#!/usr/bin/env python3
"""Finite graph-dual residual theorem and exact obstruction diagnostic.

This module contains finite-dimensional linear algebra only.  It does not
prove the required prolate-window sampling estimates, a uniform sector floor,
equation (5.2), or any assertion about RH.  Point values are diagnostics, not
outward-rounded certificates.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]


def _sha256(relative_path: str) -> str:
    return hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()


def _vector_norm(vector: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(vector[i]) ** 2 for i in range(vector.rows)))


def _max_abs(matrix: mp.matrix) -> mp.mpf:
    if matrix.rows == 0 or matrix.cols == 0:
        return mp.mpf("0")
    return max(abs(matrix[i, j]) for i in range(matrix.rows) for j in range(matrix.cols))


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


def weak_dual_point_report(
    complement_operator: mp.matrix,
    residual: mp.matrix,
    preconditioner: mp.matrix,
    shift: mp.mpf | str | int,
    projected_norm: mp.mpf | str | int,
    leakage_riesz_vector: mp.matrix,
    *,
    tolerance: mp.mpf | None = None,
) -> dict[str, object]:
    """Evaluate the exact weak-dual and left-preconditioner identities.

    ``leakage_riesz_vector`` represents the functional
    ``v -> W(v,R)`` in the complement.  Exact radical leakage requires

        residual = -leakage_riesz_vector / projected_norm.

    The graph-dual supremum is ``||D^-1 leakage_riesz_vector||``.  The
    function enforces this identity and the positive-self-adjoint hypothesis
    on ``D`` before evaluating the point diagnostics.
    """

    if tolerance is None:
        tolerance = mp.power(10, -max(12, mp.mp.dps // 2))
    tolerance = mp.mpf(tolerance)
    a = mp.mpf(projected_norm)
    U = mp.mpf(shift)
    if a <= 0:
        raise ValueError("projected norm must be positive")
    dimension = complement_operator.rows
    if complement_operator.cols != dimension or preconditioner.rows != dimension:
        raise ValueError("operators must be square with matching dimensions")
    if preconditioner.cols != dimension:
        raise ValueError("operators must be square with matching dimensions")
    for label, vector in (
        ("residual", residual),
        ("leakage Riesz vector", leakage_riesz_vector),
    ):
        if vector.rows != dimension or vector.cols != 1:
            raise ValueError(f"{label} has incompatible dimensions")
    if _max_abs(complement_operator - complement_operator.H) > tolerance:
        raise ValueError("complement operator must be Hermitian")
    if _max_abs(preconditioner - preconditioner.H) > tolerance:
        raise ValueError("preconditioner must be Hermitian")
    if _minimum_eigenvalue(preconditioner) <= 0:
        raise ValueError("preconditioner must be positive definite")

    leakage_identity_defect = _vector_norm(residual + leakage_riesz_vector / a)
    if leakage_identity_defect > tolerance:
        raise ValueError("radical leakage identity does not hold")

    identity = mp.eye(dimension)
    shifted = complement_operator - U * identity
    left_defect = mp.inverse(preconditioner) * (shifted - preconditioner)
    rho = _operator_norm(left_defect)
    weighted_residual = mp.lu_solve(preconditioner, residual)
    weighted_leakage = mp.lu_solve(preconditioner, leakage_riesz_vector)
    numerator = _vector_norm(weighted_residual)
    graph_dual_supremum = _vector_norm(weighted_leakage)
    duality_defect = abs(graph_dual_supremum / a - numerator)

    report: dict[str, object] = {
        "dimension": dimension,
        "projected_norm_a": a,
        "shift_U": U,
        "rho": rho,
        "leakage_identity_defect": leakage_identity_defect,
        "weighted_residual_norm": numerator,
        "graph_dual_supremum": graph_dual_supremum,
        "graph_duality_defect": duality_defect,
        "preconditioner_hypothesis_pass": bool(rho < 1),
        "shifted_floor_point": _minimum_eigenvalue(shifted),
        "shifted_action_point": None,
        "preconditioned_upper_bound_point": None,
        "claim_scope": "finite_arbitrary_precision_point_not_interval_or_uniform",
    }
    if rho >= 1:
        return report
    if report["shifted_floor_point"] <= 0:
        raise ArithmeticError("rho<1 did not produce a positive shifted operator")
    shifted_action = _vector_norm(mp.lu_solve(shifted, residual))
    upper = graph_dual_supremum / (a * (1 - rho))
    report["shifted_action_point"] = shifted_action
    report["preconditioned_upper_bound_point"] = upper
    report["upper_minus_shifted_action"] = upper - shifted_action
    if shifted_action > upper + tolerance:
        raise ArithmeticError("left-preconditioned weak-dual bound failed")
    return report


def canonical_obstruction_report(dps: int = 80) -> dict[str, object]:
    """Reconstruct the exact five-dimensional scalar/action obstruction."""

    if not isinstance(dps, int) or dps < 30:
        raise ValueError("dps must be an integer at least 30")
    mp.mp.dps = dps
    W = mp.matrix(
        [
            [0, 0, 0, -1, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0],
            [-1, 1, 0, 1, 0],
            [0, 0, 0, 0, 2],
        ]
    )
    p = mp.matrix([1, 0, 0, 0, 0])
    outer = mp.matrix([0, 1, 0, 0, 0])
    projection = mp.matrix([0, 0, 1, 0, 0])
    e = mp.matrix([0, 0, 0, 1, 0])
    odd = mp.matrix([0, 0, 0, 0, 1])
    radical = p + outer + projection
    remainder = outer + projection
    finite_basis = mp.matrix(5, 3)
    finite_basis[:, 0] = p
    finite_basis[:, 1] = e
    finite_basis[:, 2] = odd
    Q = finite_basis.H * W * finite_basis
    kappa = mp.matrix([1, 0, 0])
    residual_full = Q * kappa
    complement_residual = mp.matrix([residual_full[1]])
    leakage_vector = mp.matrix([(e.H * W * remainder)[0]])
    complement_operator = mp.matrix([[Q[1, 1]]])
    preconditioner = mp.matrix([[1]])
    dual = weak_dual_point_report(
        complement_operator,
        complement_residual,
        preconditioner,
        0,
        1,
        leakage_vector,
    )
    sqrt5 = mp.sqrt(5)
    u = (1 - sqrt5) / 2
    tau = 1 / (1 - u)

    def pairing(left: mp.matrix, right: mp.matrix) -> mp.mpf | mp.mpc:
        return (left.H * W * right)[0]

    scalar_pairings = {
        "outer_outer": pairing(outer, outer),
        "outer_projection": pairing(outer, projection),
        "projection_outer": pairing(projection, outer),
        "projection_projection": pairing(projection, projection),
        "remainder_remainder": pairing(remainder, remainder),
    }
    return {
        "artifact_version": "0.15.0-weak-residual-duality",
        "terminal_state": "P0_INVALIDATED",
        "construction": "canonical_5d_two_sided_radical_obstruction_v1",
        "precision_decimal_digits": dps,
        "provenance_sha256": {
            "notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md": _sha256(
                "notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md"
            ),
            "src/weak_residual_duality.py": _sha256("src/weak_residual_duality.py"),
            "verifier/weak_residual_duality_replay.py": _sha256(
                "verifier/weak_residual_duality_replay.py"
            ),
        },
        "global_basis": ["p", "O", "P", "e", "o"],
        "W_exact_integer_rows": [[str(int(W[i, j])) for j in range(5)] for i in range(5)],
        "finite_basis": ["p", "e", "o"],
        "Q_exact_integer_rows": [[str(int(Q[i, j])) for j in range(3)] for i in range(3)],
        "radical_left_norm": _vector_norm(W * radical),
        "radical_right_norm": _vector_norm(W.H * radical),
        "scalar_pairings": scalar_pairings,
        "cross_pairing_e_remainder": pairing(e, remainder),
        "cross_pairing_e_p": pairing(e, p),
        "q": Q[0, 0],
        "residual_norm": _vector_norm(residual_full),
        "even_complement_floor_alpha": Q[1, 1],
        "odd_floor_omega": Q[2, 2],
        "two_dimensional_ritz_u": u,
        "weighted_action_tau": tau,
        "strict_even_comparison": bool(Q[1, 1] > u),
        "strict_odd_comparison": bool(Q[2, 2] > u),
        "weak_dual": dual,
        "interpretation": (
            "all four scalar remainder pairings vanish exactly while the residual "
            "column and weighted action remain nonzero"
        ),
        "claim_scope": "exact_rational_obstruction_plus_point_radical_value_check",
    }


def _serialize(value: object, digits: int) -> object:
    if isinstance(value, (mp.mpf, mp.mpc)):
        if isinstance(value, mp.mpc) and mp.im(value) != 0:
            return {"re": mp.nstr(mp.re(value), digits), "im": mp.nstr(mp.im(value), digits)}
        return mp.nstr(mp.re(value), digits)
    if isinstance(value, mp.matrix):
        return [[_serialize(value[i, j], digits) for j in range(value.cols)] for i in range(value.rows)]
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
    report = canonical_obstruction_report(args.dps)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(_serialize(report, args.dps), indent=2) + "\n")


if __name__ == "__main__":
    main()
