#!/usr/bin/env python3
"""Finite quotient-preconditioner and sampling-action diagnostics.

The theorem implemented here is finite-dimensional linear algebra. It does
not prove the exterior sampling comparison, a signed Weil-sector floor,
equation (5.2), determinant convergence, or RH. Point calculations are
diagnostics rather than directed interval certificates.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
VERSION = "0.16.0-quotient-exterior-preconditioner"
TERMINAL_STATE = "P0_INVALIDATED"


def _sha256(relative_path: str) -> str:
    return hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()


def _max_abs(matrix: mp.matrix) -> mp.mpf:
    if matrix.rows == 0 or matrix.cols == 0:
        return mp.mpf("0")
    return max(
        abs(matrix[row, column])
        for row in range(matrix.rows)
        for column in range(matrix.cols)
    )


def _vector_norm(vector: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(vector[row]) ** 2 for row in range(vector.rows)))


def _operator_norm(matrix: mp.matrix) -> mp.mpf:
    if matrix.rows == 0 or matrix.cols == 0:
        return mp.mpf("0")
    values, _ = mp.eighe(matrix.H * matrix)
    value = mp.re(values[-1])
    if value < 0 and abs(value) <= 100 * mp.eps:
        value = mp.mpf("0")
    if value < 0:
        raise ArithmeticError("negative squared singular value")
    return mp.sqrt(value)


def _minimum_eigenvalue(matrix: mp.matrix) -> mp.mpf:
    values, _ = mp.eighe((matrix + matrix.H) / 2)
    return mp.re(values[0])


def _inverse_root(matrix: mp.matrix, tolerance: mp.mpf) -> mp.matrix:
    values, vectors = mp.eighe((matrix + matrix.H) / 2)
    if values[0] <= tolerance:
        raise ValueError("source metric must be positive definite")
    return (
        vectors
        * mp.diag([1 / mp.sqrt(mp.re(values[index])) for index in range(values.rows)])
        * vectors.H
    )


def _range_data(
    positive_matrix: mp.matrix, tolerance: mp.mpf
) -> tuple[mp.matrix, list[mp.mpf]]:
    values, vectors = mp.eighe((positive_matrix + positive_matrix.H) / 2)
    scale = max(mp.mpf("1"), max(abs(values[index]) for index in range(values.rows)))
    indices = [
        index for index in range(values.rows) if mp.re(values[index]) > tolerance * scale
    ]
    if not indices:
        raise ValueError("physical synthesis has zero range")
    range_basis = mp.matrix(vectors.rows, len(indices))
    for column, index in enumerate(indices):
        range_basis[:, column] = vectors[:, index]
    return range_basis, [mp.re(values[index]) for index in indices]


def quotient_point_report(
    source_metric: mp.matrix,
    physical_synthesis: mp.matrix,
    sampling_analysis: mp.matrix,
    shifted_operator: mp.matrix,
    forcing: mp.matrix,
    epsilon: mp.mpf | str | int,
    *,
    tolerance: mp.mpf | None = None,
) -> dict[str, object]:
    """Evaluate the quotient identities on the actual physical range."""

    if tolerance is None:
        tolerance = mp.power(10, -max(16, mp.mp.dps // 2))
    tolerance = mp.mpf(tolerance)
    D = source_metric
    W = physical_synthesis
    S = sampling_analysis
    B = shifted_operator
    c = forcing
    eps = mp.mpf(epsilon)
    if eps < 0:
        raise ValueError("epsilon must be nonnegative")
    if D.rows != D.cols or W.cols != D.rows:
        raise ValueError("source metric and synthesis dimensions disagree")
    if S.cols != W.rows:
        raise ValueError("sampling and physical dimensions disagree")
    if B.rows != W.rows or B.cols != W.rows:
        raise ValueError("shifted operator has the wrong physical dimension")
    if c.rows != W.rows or c.cols != 1:
        raise ValueError("forcing has the wrong physical dimension")
    if _max_abs(D - D.H) > tolerance:
        raise ValueError("source metric must be Hermitian")
    if _max_abs(B - B.H) > tolerance:
        raise ValueError("shifted operator must be Hermitian for this diagnostic")

    D_inverse_root = _inverse_root(D, tolerance)
    A = W * D_inverse_root
    AA = A * A.H
    range_basis, positive_values = _range_data(AA, tolerance)
    rank = len(positive_values)
    source_kernel_dimension = W.cols - rank
    Delta_reduced = mp.diag([1 / value for value in positive_values])
    Delta = range_basis * Delta_reduced * range_basis.H
    Delta_inverse_reduced = mp.diag(positive_values)

    range_projector = range_basis * range_basis.H
    forcing_range_defect = _vector_norm((mp.eye(W.rows) - range_projector) * c)
    if forcing_range_defect > tolerance:
        raise ValueError("forcing does not lie in the physical range")

    G = S.H * S
    G_reduced = range_basis.H * G * range_basis
    normalized_sampling = S * A
    C_min = _operator_norm(normalized_sampling) ** 2
    source_slack = C_min * D - W.H * G * W
    source_slack_floor = _minimum_eigenvalue(source_slack)
    if source_slack_floor < -tolerance:
        raise ArithmeticError("source sampling Loewner comparison failed")

    descent_slack = C_min * Delta_reduced - G_reduced
    descent_slack_floor = _minimum_eigenvalue(descent_slack)
    if descent_slack_floor < -tolerance:
        raise ArithmeticError("quotient sampling descent failed")

    A_norm_squared = _operator_norm(A) ** 2
    quotient_floor = _minimum_eigenvalue(Delta_reduced)
    floor_identity_defect = abs(quotient_floor - 1 / A_norm_squared)

    Gamma_matrix = (
        Delta_inverse_reduced * G_reduced * Delta_inverse_reduced
    )
    Gamma = _operator_norm(Gamma_matrix)
    Gamma_bound = C_min * A_norm_squared
    if Gamma > Gamma_bound + tolerance:
        raise ArithmeticError("quotient alignment bound failed")

    c_reduced = range_basis.H * c
    forcing_slack = eps * G_reduced - c_reduced * c_reduced.H
    forcing_slack_floor = _minimum_eigenvalue(forcing_slack)
    if forcing_slack_floor < -tolerance:
        raise ValueError("forcing rank-one comparison failed")

    B_reduced = range_basis.H * B * range_basis
    left_defect = mp.inverse(Delta_reduced) * (B_reduced - Delta_reduced)
    rho = _operator_norm(left_defect)
    action = _vector_norm(mp.lu_solve(B_reduced, c_reduced))
    left_bound = None
    if rho < 1:
        left_bound = mp.sqrt(eps * C_min) * mp.sqrt(A_norm_squared) / (1 - rho)
        if action > left_bound + tolerance:
            raise ArithmeticError("left-close action bound failed")

    delta_values, delta_vectors = mp.eighe(Delta_reduced)
    Delta_inverse_half = (
        delta_vectors
        * mp.diag([1 / mp.sqrt(delta_values[index]) for index in range(rank)])
        * delta_vectors.H
    )
    relative_B = Delta_inverse_half * B_reduced * Delta_inverse_half
    domination_mu = _minimum_eigenvalue(relative_B)
    domination_bound = None
    if domination_mu > 0:
        domination_bound = (
            mp.sqrt(eps * C_min)
            * mp.sqrt(A_norm_squared)
            / domination_mu
        )
        if action > domination_bound + tolerance:
            raise ArithmeticError("dominating action bound failed")

    return {
        "physical_dimension": W.rows,
        "source_dimension": W.cols,
        "physical_range_dimension": rank,
        "source_kernel_dimension": source_kernel_dimension,
        "source_map_injective": source_kernel_dimension == 0,
        "quotient_matrix_physical": Delta,
        "source_sampling_constant_C_min": C_min,
        "source_sampling_slack_floor": source_slack_floor,
        "quotient_sampling_slack_floor": descent_slack_floor,
        "normalized_synthesis_norm_squared": A_norm_squared,
        "quotient_floor": quotient_floor,
        "quotient_floor_identity_defect": floor_identity_defect,
        "alignment_Gamma": Gamma,
        "alignment_upper_bound": Gamma_bound,
        "forcing_range_defect": forcing_range_defect,
        "forcing_slack_floor": forcing_slack_floor,
        "left_closeness_rho": rho,
        "shifted_action": action,
        "left_close_action_bound": left_bound,
        "domination_mu": domination_mu,
        "dominating_action_bound": domination_bound,
        "ordinary_source_inverse_permitted": source_kernel_dimension == 0,
        "claim_scope": "finite_arbitrary_precision_point_linear_algebra",
    }


def canonical_report(dps: int = 80) -> dict[str, object]:
    """Build the exact rank-deficient theorem regression."""

    if isinstance(dps, bool) or not isinstance(dps, int) or dps < 40:
        raise ValueError("dps must be an integer at least 40")
    mp.mp.dps = dps
    D = mp.diag([1, 4, 9])
    W = mp.matrix([[1, 0, 1], [0, 1, 0]])
    S = mp.matrix([[1, 1]])
    Delta_exact = mp.diag([mp.mpf(9) / 10, 4])
    forcing = mp.matrix([1, 1])
    point = quotient_point_report(D, W, S, Delta_exact, forcing, 1)

    # A one-dimensional high block seen by the same sampling row. The exact
    # sum, rather than the maximum of its block constants, is required.
    g = mp.mpf(3)
    B_H = mp.mpf(4)
    C_L = mp.mpf(49) / 36
    low_inverse_norm = mp.mpf(10) / 9
    cross_aware_constant = C_L + B_H / g
    block_inverse_norm = max(low_inverse_norm, 1 / g)
    block_Gamma_bound = cross_aware_constant * block_inverse_norm
    sharp_block_Gamma_bound = C_L * low_inverse_norm + B_H / g**2
    transformed_sampling_row = mp.matrix(
        [[1 / mp.sqrt(mp.mpf(9) / 10), mp.mpf(1) / 2, 2 / mp.sqrt(g)]]
    )
    actual_cross_aware_constant = _operator_norm(transformed_sampling_row) ** 2
    transformed_for_Gamma = mp.matrix(
        [[mp.mpf(10) / 9, mp.mpf(1) / 4, mp.mpf(2) / 3]]
    )
    actual_block_Gamma = _operator_norm(transformed_for_Gamma) ** 2

    return {
        "artifact_version": VERSION,
        "terminal_state": TERMINAL_STATE,
        "construction": "rank_deficient_exact_quotient_model_v1",
        "precision_decimal_digits": dps,
        "provenance_sha256": {
            "notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md": _sha256(
                "notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md"
            ),
            "src/quotient_exterior_preconditioner.py": _sha256(
                "src/quotient_exterior_preconditioner.py"
            ),
            "verifier/quotient_exterior_preconditioner_replay.py": _sha256(
                "verifier/quotient_exterior_preconditioner_replay.py"
            ),
        },
        "exact_inputs": {
            "D_integer_diagonal": ["1", "4", "9"],
            "W_integer_rows": [["1", "0", "1"], ["0", "1", "0"]],
            "S_integer_rows": [["1", "1"]],
            "forcing_integer_column": ["1", "1"],
            "epsilon_integer": "1",
            "shifted_operator_B_rational_diagonal": ["9/10", "4"],
            "source_kernel_integer_vector": ["-1", "0", "1"],
        },
        "exact_expected_rationals": {
            "quotient_diagonal": ["9/10", "4"],
            "C_min": "49/36",
            "normalized_synthesis_norm_squared": "10/9",
            "quotient_floor": "9/10",
            "alignment_Gamma": "1681/1296",
            "alignment_upper_bound": "245/162",
            "forcing_action_squared": "1681/1296",
            "block_cross_aware_constant": "97/36",
            "block_actual_Gamma": "2257/1296",
            "block_Gamma_bound": "485/162",
            "sharp_block_Gamma_bound": "317/162",
        },
        "quotient_point": point,
        "block_cross_term_regression": {
            "high_metric_g": g,
            "high_sampling_norm_squared_B_H": B_H,
            "low_source_constant_C_L": C_L,
            "cross_aware_constant_formula": cross_aware_constant,
            "cross_aware_constant_direct": actual_cross_aware_constant,
            "incorrect_maximum_of_block_constants": max(C_L, B_H / g),
            "block_inverse_norm": block_inverse_norm,
            "actual_block_Gamma": actual_block_Gamma,
            "block_Gamma_bound": block_Gamma_bound,
            "sharp_block_Gamma_bound": sharp_block_Gamma_bound,
        },
        "theorem_flags": {
            "source_injectivity_required": False,
            "ordinary_inverse_on_source_kernel_used": False,
            "moore_penrose_quotient_used": True,
            "low_high_sampling_cross_terms_retained": True,
            "defect_relative_exterior_sampling_proved": False,
            "shifted_signed_sector_comparison_proved": False,
            "equation_5_2_proved": False,
            "local_uniform_determinant_convergence_proved": False,
            "status_promoted": False,
        },
        "claim_scope": (
            "exact rational construction with arbitrary-precision point replay; "
            "finite linear algebra only"
        ),
    }


def _serialize(value: Any, digits: int) -> Any:
    if isinstance(value, mp.matrix):
        return [
            [_serialize(value[row, column], digits) for column in range(value.cols)]
            for row in range(value.rows)
        ]
    if isinstance(value, mp.mpc):
        if mp.im(value) != 0:
            return {
                "re": mp.nstr(mp.re(value), digits),
                "im": mp.nstr(mp.im(value), digits),
            }
        return mp.nstr(mp.re(value), digits)
    if isinstance(value, mp.mpf):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _serialize(item, digits) for key, item in value.items()}
    if isinstance(value, list):
        return [_serialize(item, digits) for item in value]
    return value


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    report = canonical_report(args.dps)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(_serialize(report, args.dps), indent=2) + "\n")


if __name__ == "__main__":
    main()
