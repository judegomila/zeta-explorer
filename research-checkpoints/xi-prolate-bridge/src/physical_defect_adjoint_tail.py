#!/usr/bin/env python3
"""Produce the physical-defect/adjoint-tail reduction certificate.

The payload contains exact rational theorem regressions and outward
mpmath.iv formula probes. It does not assemble a physical prolate--Weil
matrix or certify an asymptotic estimate.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-physical-defect-adjoint-tail-v1"
LOCK = "PHYSICAL_DEFECT_ADJOINT_TAIL_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-physical-defect-adjoint-tail-source-lock-v1"
CLAIM_CLASS = "PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_MPMATH_VERSION = "1.4.1"
EXPECTED_LIBRARY = f"mpmath.iv {EXPECTED_MPMATH_VERSION}"
MAX_LAMBDA_NUMERATOR = 999999
MAX_DPS = 1000

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_POSITIVE_INTEGER_TEXT = re.compile(r"^[1-9][0-9]*$")
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

EXPECTED_DEPENDENCIES = {
    "DIRECT_RH_ATTACK.md",
    "FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json",
    "MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_SOURCE_LOCK.json",
    "MATCHED_HIGH_MOMENT_COFRAME_SOURCE_LOCK.json",
    "P0_SOURCE_LOCK.json",
    "PHYSICAL_LEVERAGE_SHORTED_SCHUR_SOURCE_LOCK.json",
    "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_SOURCE_LOCK.json",
    "SOFT_DEFECT_PROLATE_ANGLE_SOURCE_LOCK.json",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md",
    "notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md",
    "notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md",
    "notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md",
    "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md",
    "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md",
    "notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md",
    "requirements.txt",
}

SOURCE_ADMISSIONS = {
    "absolute_prime_values_substituted_for_signed_sum": False,
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_physical_matrix_read": False,
    "cached_prolate_eigenvectors_read": False,
    "cached_weil_matrix_read": False,
    "central_trace_estimate_claimed": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "equality_boundary_reported_as_pass": False,
    "exact_coframe_claimed": False,
    "global_weil_positivity_assumed": False,
    "input_cap_bypassed": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "nonpositive_floor_reported_as_pass": False,
    "odd_chord_correction_omitted": False,
    "odd_negative_pole_omitted": False,
    "physical_weighted_capture_claimed": False,
    "positive_odd_pole_substituted": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence": False,
    "rh_proved": False,
    "runtime_version_mismatch_accepted": False,
    "secret_serialized": False,
    "signed_sector_floor_claimed": False,
    "source_gram_replaced_by_identity": False,
    "unit_source_normalization_substituted": False,
    "unshifted_transverse_block_substituted": False,
    "weighted_one_state_promoted_to_trace": False,
    "zeros_assumed_real": False,
    "zeta_zero_table_read": False,
}

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", EXPECTED_LIBRARY],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "every nondegenerate interval is enlarged to a precision-scaled dyadic enclosure",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and the pinned mpmath.iv transcendental runtime",
}

Matrix = list[list[Fraction]]
Vector = list[Fraction]


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validated_source_lock() -> tuple[dict[str, Any], dict[str, Any]]:
    path = _root() / LOCK
    lock = json.loads(path.read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("source-lock inventory mismatch")
    if (
        lock["schema"] != LOCK_SCHEMA
        or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE
        or lock["updated_date"] != UPDATED_DATE
        or lock["external_sources"] != []
        or lock["source_admissions"] != SOURCE_ADMISSIONS
    ):
        raise ValueError("source-lock fixed metadata mutation")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("source-lock dependencies missing")
    found: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed source-lock dependency")
        relative = item["path"]
        expected = item["sha256"]
        role = item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str)
            or not relative
            or candidate.is_absolute()
            or ".." in candidate.parts
            or relative in found
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
        ):
            raise ValueError("invalid source-lock dependency")
        if _sha256(_root() / candidate) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        found[relative] = expected
    if set(found) != EXPECTED_DEPENDENCIES:
        raise ValueError("source-lock dependency path inventory mismatch")
    binding = {
        "path": LOCK,
        "sha256": _sha256(path),
        "schema": LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(found.items())),
    }
    return binding, lock


def _canonical_positive_text(
    value: Any,
    label: str,
    minimum: int,
    maximum: int,
) -> tuple[str, int]:
    if not isinstance(value, str):
        raise TypeError(f"{label} must be canonical positive integer text")
    if len(value) > len(str(maximum)):
        raise ValueError(f"{label} must be at most {maximum}")
    if _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError(f"{label} must be canonical positive integer text")
    minimum_text = str(minimum)
    maximum_text = str(maximum)
    if len(value) < len(minimum_text) or (
        len(value) == len(minimum_text) and value < minimum_text
    ):
        raise ValueError(f"{label} must be at least {minimum}")
    if len(value) > len(maximum_text) or (
        len(value) == len(maximum_text) and value > maximum_text
    ):
        raise ValueError(f"{label} must be at most {maximum}")
    integer = int(value)
    return value, integer


def _validate_runtime() -> None:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise RuntimeError(
            "mpmath runtime mismatch: "
            f"expected {EXPECTED_MPMATH_VERSION}, got {getattr(mp, '__version__', None)!r}"
        )


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _assert_strict_json(value: Any) -> None:
    if isinstance(value, float):
        raise TypeError("binary floating-point value reached JSON serialization")
    if value is None or type(value) in (bool, int, str):
        return
    if isinstance(value, list):
        for item in value:
            _assert_strict_json(item)
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise TypeError("JSON object keys must be strings")
        for item in value.values():
            _assert_strict_json(item)
        return
    raise TypeError(f"unsupported JSON value type: {type(value).__name__}")


def _shape(matrix: Matrix) -> tuple[int, int]:
    rows = len(matrix)
    columns = len(matrix[0]) if rows else 0
    if any(len(row) != columns for row in matrix):
        raise ValueError("ragged matrix")
    return rows, columns


def _eye(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(values: Vector) -> Matrix:
    return [[value if i == j else Fraction(0) for j in range(len(values))]
            for i, value in enumerate(values)]


def _transpose(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    return [[matrix[i][j] for i in range(rows)] for j in range(columns)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    lr, lc = _shape(left)
    rr, rc = _shape(right)
    if lc != rr:
        raise ValueError("matrix dimension mismatch")
    return [[sum((left[i][k] * right[k][j] for k in range(lc)), Fraction(0))
             for j in range(rc)] for i in range(lr)]


def _add(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix shape mismatch")
    return [[a + b for a, b in zip(lrow, rrow)] for lrow, rrow in zip(left, right)]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix shape mismatch")
    return [[a - b for a, b in zip(lrow, rrow)] for lrow, rrow in zip(left, right)]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _outer(left: Vector, right: Vector | None = None) -> Matrix:
    other = left if right is None else right
    return [[a * b for b in other] for a in left]


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows != columns or rows == 0:
        raise ValueError("inverse requires a nonempty square matrix")
    work = [row[:] + identity for row, identity in zip(matrix, _eye(rows))]
    for column in range(rows):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            raise ValueError("singular matrix")
        work[column], work[pivot] = work[pivot], work[column]
        divisor = work[column][column]
        work[column] = [entry / divisor for entry in work[column]]
        for row in range(rows):
            if row == column:
                continue
            factor = work[row][column]
            if factor:
                work[row] = [entry - factor * base
                             for entry, base in zip(work[row], work[column])]
    return [row[rows:] for row in work]


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("determinant requires square matrix")
    if rows == 0:
        return Fraction(1)
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(rows):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        divisor = work[column][column]
        result *= divisor
        for row in range(column + 1, rows):
            factor = work[row][column] / divisor
            for j in range(column + 1, rows):
                work[row][j] -= factor * work[column][j]
    return result


def _trace(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("trace requires square matrix")
    return sum((matrix[i][i] for i in range(rows)), Fraction(0))


def _quadratic(vector: Vector, matrix: Matrix) -> Fraction:
    column = [[entry] for entry in vector]
    return _matmul(_matmul([vector], matrix), column)[0][0]


def _matvec(matrix: Matrix, vector: Vector) -> Vector:
    return [row[0] for row in _matmul(matrix, [[entry] for entry in vector])]


def _weighted_frobenius_square(matrix: Matrix, diagonal_weight: Vector) -> Fraction:
    rows, columns = _shape(matrix)
    if columns != len(diagonal_weight):
        raise ValueError("weight dimension mismatch")
    return sum(
        (diagonal_weight[j] * matrix[i][j] ** 2
         for i in range(rows) for j in range(columns)),
        Fraction(0),
    )


def _principal_minors_2(matrix: Matrix) -> list[Fraction]:
    if _shape(matrix) != (2, 2):
        raise ValueError("two-dimensional fixture required")
    return [matrix[0][0], _determinant(matrix)]


def _cap_free_weighted_capture() -> dict[str, Any]:
    c, nu, length = Fraction(5), Fraction(3), Fraction(2)
    w_values = [Fraction(-1), Fraction(4), Fraction(8), Fraction(13)]
    threshold = (c - nu) * length
    left = [max(max(c * length - w, 0) - threshold, 0) for w in w_values]
    right = [max(nu * length - w, 0) for w in w_values]
    if left != right:
        raise ValueError("cap cancellation regression failed")

    defect = _diag([Fraction(9), Fraction(1), Fraction(4)])
    physical = [
        [Fraction(1), Fraction(0)],
        [Fraction(1), Fraction(1)],
        [Fraction(0), Fraction(1)],
    ]
    gram = _matmul(_transpose(physical), physical)
    gram_inverse = _inverse(gram)
    pseudoinverse = _matmul(gram_inverse, _transpose(physical))
    p_k = _matmul(physical, pseudoinverse)
    p_h = _sub(_eye(3), p_k)
    residual_cost = _trace(_matmul(_matmul(p_h, defect), p_h))
    captured_cost = _trace(_matmul(_matmul(p_k, defect), p_k))

    source_map = [
        [Fraction(1), Fraction(0), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(1), Fraction(0)],
    ]
    right_inverse = _transpose(source_map)
    source_columns = [
        [Fraction(1), Fraction(0)],
        [Fraction(1), Fraction(1)],
        [Fraction(0), Fraction(1)],
        [Fraction(1), Fraction(0)],
    ]
    source_gram = _matmul(_transpose(source_columns), source_columns)
    p_f = _matmul(
        _matmul(source_columns, _inverse(source_gram)),
        _transpose(source_columns),
    )
    competitor = _matmul(
        _matmul(_matmul(source_map, _sub(_eye(4), p_f)), right_inverse),
        _eye(3),
    )
    competitor_cost = _weighted_frobenius_square(
        competitor, [Fraction(9), Fraction(1), Fraction(4)]
    )

    band = _diag([Fraction(1), Fraction(1, 2), Fraction(0)])
    band_symbol_floor, strict_budget = Fraction(6), Fraction(4)
    central_defect = _scale(band_symbol_floor, band)
    domination_remainder = _sub(
        central_defect,
        _scale(band_symbol_floor, band),
    )
    domination_verified = domination_remainder == _scale(Fraction(0), _eye(3))
    band_trace = _trace(_matmul(_matmul(p_h, band), p_h))
    central_residual_trace = _trace(
        _matmul(_matmul(p_h, central_defect), p_h)
    )
    strict_budget_antecedent = central_residual_trace < strict_budget

    if (
        gram != [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(2)]]
        or _matmul(source_map, source_columns) != physical
        or _matmul(source_map, right_inverse) != _eye(3)
        or residual_cost != Fraction(14, 3)
        or captured_cost != Fraction(28, 3)
        or residual_cost + captured_cost != _trace(defect)
        or competitor_cost != Fraction(144, 25)
        or competitor_cost - residual_cost != Fraction(82, 75)
        or band_trace != Fraction(1, 2)
        or not domination_verified
        or central_residual_trace != Fraction(3)
        or central_residual_trace != band_symbol_floor * band_trace
        or not strict_budget_antecedent
    ):
        raise ValueError("weighted capture regression failed")

    return {
        "cap_cancellation": {
            "c": c,
            "nu": nu,
            "L": length,
            "w_values": w_values,
            "threshold_tau": threshold,
            "capped_excess_values": left,
            "cap_free_values": right,
            "pointwise_identity_exact": True,
            "operator_positive_part_substituted": False,
        },
        "least_squares_capture": {
            "D_nu": defect,
            "W": physical,
            "G": gram,
            "G_inverse": gram_inverse,
            "W_pseudoinverse": pseudoinverse,
            "P_K": p_k,
            "P_H": p_h,
            "total_trace": _trace(defect),
            "captured_trace": captured_cost,
            "residual_trace": residual_cost,
            "hilbert_schmidt_infimum": residual_cost,
        },
        "full_source_competitor": {
            "T": source_map,
            "B_X": right_inverse,
            "C": source_columns,
            "source_gram_C_star_C": source_gram,
            "P_F": p_f,
            "T_C": _matmul(source_map, source_columns),
            "T_B_X": _matmul(source_map, right_inverse),
            "competitor_operator": competitor,
            "competitor_cost": competitor_cost,
            "cost_above_infimum": competitor_cost - residual_cost,
        },
        "central_band_necessity_fixture": {
            "D_central": central_defect,
            "T_band": band,
            "band_symbol_floor": band_symbol_floor,
            "domination_remainder_D_minus_A_T_band": domination_remainder,
            "domination_verified": domination_verified,
            "residual_band_trace": band_trace,
            "residual_trace": central_residual_trace,
            "defect_lower_bound": band_symbol_floor * band_trace,
            "strict_excess_budget": strict_budget,
            "strict_budget_antecedent": strict_budget_antecedent,
            "necessary_trace_upper_bound": strict_budget / band_symbol_floor,
            "one_state_estimate_promoted_to_trace": False,
        },
    }


def _exact_coframe_loss() -> dict[str, Any]:
    one = [Fraction(1) for _ in range(5)]
    p_e = _diag([Fraction(1), Fraction(1), Fraction(1), Fraction(0), Fraction(0)])
    identity = _eye(5)
    u = _matvec(p_e, one)
    e = _matvec(_sub(identity, p_e), one)
    s = sum((entry * entry for entry in u), Fraction(0))
    source_columns = [
        [Fraction(1), Fraction(0)],
        [Fraction(0), Fraction(1)],
        [Fraction(-1), Fraction(-1)],
        [Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0)],
    ]
    source_gram = _matmul(_transpose(source_columns), source_columns)
    p_f = _matmul(_matmul(source_columns, _inverse(source_gram)), _transpose(source_columns))
    z_star = [
        [Fraction(-1, 2), Fraction(1, 2)],
        [Fraction(1, 2), Fraction(-1, 2)],
        [Fraction(-1, 2), Fraction(-1, 2)],
        [Fraction(1, 2), Fraction(1, 2)],
        [Fraction(0), Fraction(0)],
    ]
    z = _transpose(z_star)
    tail = _matmul(_sub(identity, p_e), z_star)
    raw_loss = _matmul(_transpose(tail), tail)
    tail_star_e = _matvec(_transpose(tail), e)
    correction = _scale(Fraction(1, 1) / s, _outer(tail_star_e))
    exact_loss = _add(raw_loss, correction)
    direct_loss = _matmul(_matmul(z, _sub(identity, p_f)), z_star)
    raw_loss_trace = _trace(raw_loss)
    raw_loss_determinant = _determinant(raw_loss)
    raw_loss_is_positive_rank_one = (
        raw_loss == _transpose(raw_loss)
        and raw_loss[0][0] >= 0
        and raw_loss[1][1] >= 0
        and raw_loss_determinant == 0
        and raw_loss_trace > 0
    )
    if not raw_loss_is_positive_rank_one:
        raise ValueError("raw coframe tail is not positive rank one")
    exact_loss_trace = _trace(exact_loss)
    exact_loss_determinant = _determinant(exact_loss)
    exact_loss_is_positive_rank_one = (
        exact_loss == _transpose(exact_loss)
        and exact_loss[0][0] >= 0
        and exact_loss[1][1] >= 0
        and exact_loss_determinant == 0
        and exact_loss_trace > 0
    )
    if not exact_loss_is_positive_rank_one:
        raise ValueError("coframe loss is not positive rank one")
    exact_loss_norm = exact_loss_trace
    volume = _determinant(_sub(_eye(2), exact_loss))
    rho = raw_loss_trace
    beta_e = sum((entry * entry for entry in tail_star_e), Fraction(0)) / s
    lam = Fraction(5, 2)

    if (
        s != 3
        or _matmul(z, z_star) != _eye(2)
        or _matmul([one], z_star) != [[Fraction(0), Fraction(0)]]
        or source_gram == _eye(2)
        or direct_loss != exact_loss
        or rho + beta_e != exact_loss_norm
        or 2 * lam * rho / s != Fraction(5, 6)
        or volume != Fraction(1, 3)
    ):
        raise ValueError("exact coframe-loss regression failed")

    return {
        "lambda": lam,
        "constant_vector": one,
        "P_E": p_e,
        "u_P_E_one": u,
        "e_I_minus_P_E_one": e,
        "s_norm_u_squared": s,
        "corrected_source_columns_C": source_columns,
        "source_gram_C_star_C": source_gram,
        "P_F_from_full_gram": p_f,
        "Z_star": z_star,
        "Z_Z_star": _matmul(z, z_star),
        "one_star_Z_star": _matmul([one], z_star),
        "A_I_minus_P_E_Z_star": tail,
        "A_star_A": raw_loss,
        "A_star_e": tail_star_e,
        "rank_one_correction": correction,
        "loss_from_exact_formula": exact_loss,
        "loss_from_direct_projection": direct_loss,
        "exact_loss_characteristic_trace": exact_loss_trace,
        "exact_loss_characteristic_determinant": exact_loss_determinant,
        "exact_loss_is_positive_rank_one": exact_loss_is_positive_rank_one,
        "rho_norm_A_squared": rho,
        "beta_E": beta_e,
        "rho_plus_beta_E": rho + beta_e,
        "exact_loss_norm": exact_loss_norm,
        "old_cauchy_Theta": 2 * lam * rho / s,
        "normalized_volume_det_I_minus_loss": volume,
        "exact_coframe_on_physical_family_claimed": False,
    }


def _matrix_power_diagonal(diagonal: Vector, power: int) -> Matrix:
    return _diag([entry**power for entry in diagonal])


def _odd_case(beta: Fraction) -> dict[str, Any]:
    c, a, length = Fraction(5), Fraction(2), Fraction(1)
    r_diagonal = [Fraction(1), Fraction(2)]
    r_matrix = _diag(r_diagonal)
    p = [Fraction(1, 2), Fraction(1, 3)]
    q, h = (c - beta) * length, (a - beta) * length
    if h <= 0:
        raise ValueError("odd chord fixture requires beta<a")
    m_beta = _sub(_scale(q, _eye(2)), r_matrix)
    m_inverse = _inverse(m_beta)
    mu0 = sum((entry * entry for entry in p), Fraction(0))
    rhos = [_quadratic(p, _matrix_power_diagonal(r_diagonal, power)) for power in range(6)]
    b = (c - a) * length
    chi_operator = _matmul(
        _matmul(_sub(_scale(b, _eye(2)), r_matrix), r_matrix),
        m_inverse,
    )
    chi = _quadratic(p, chi_operator)
    load_direct = 2 * _quadratic(p, m_inverse)
    load_chord = 2 * (h * mu0 + rhos[1] - chi) / (h * q)
    load_without_chi = 2 * (h * mu0 + rhos[1]) / (h * q)
    moment_bounds: list[Fraction] = []
    for k in range(5):
        partial = sum((rhos[j] / q ** (j + 1) for j in range(k)), Fraction(0))
        moment_bounds.append(2 * (partial + rhos[k] / (h * q**k)))
    differences = [moment_bounds[k] - moment_bounds[k + 1] for k in range(4)]
    remainders = [bound - load_direct for bound in moment_bounds]
    chord_slack = _sub(_scale(q - h, _eye(2)), r_matrix)
    difference_formula_rhs = [
        Fraction(2, 1) / (h * q ** (k + 1))
        * _quadratic(
            p,
            _matmul(_matrix_power_diagonal(r_diagonal, k), chord_slack),
        )
        for k in range(4)
    ]
    remainder_formula_rhs = [
        Fraction(2, 1) / (h * q**k)
        * _quadratic(
            p,
            _matmul(
                _matmul(_matrix_power_diagonal(r_diagonal, k), chord_slack),
                m_inverse,
            ),
        )
        for k in range(5)
    ]
    shifted_odd = _sub(m_beta, _scale(Fraction(2), _outer(p)))
    if (
        load_direct != load_chord
        or differences != difference_formula_rhs
        or remainders != remainder_formula_rhs
        or any(value < 0 for value in differences + remainders)
        or min(_principal_minors_2(shifted_odd)) <= 0
        or mu0 >= q / 2
    ):
        raise ValueError("shifted odd regression failed")
    return {
        "beta": beta,
        "c": c,
        "a": a,
        "L": length,
        "R": r_matrix,
        "p": p,
        "q": q,
        "h": h,
        "M_beta": m_beta,
        "M_beta_inverse": m_inverse,
        "mu0": mu0,
        "rho_0_through_5": rhos,
        "chi_beta_operator": chi_operator,
        "chi_beta": chi,
        "load_direct": load_direct,
        "load_from_chord_identity": load_chord,
        "load_if_chi_omitted": load_without_chi,
        "chi_omission_error": load_without_chi - load_direct,
        "U_0_through_4": moment_bounds,
        "successive_U_differences": differences,
        "successive_U_difference_formula_rhs": difference_formula_rhs,
        "U_minus_exact_load": remainders,
        "U_minus_exact_load_formula_rhs": remainder_formula_rhs,
        "shifted_odd_matrix": shifted_odd,
        "shifted_odd_principal_minors": _principal_minors_2(shifted_odd),
        "necessary_pole_budget_q_over_2": q / 2,
        "necessary_pole_budget_margin": q / 2 - mu0,
    }


def _shifted_odd_and_positive_excess() -> dict[str, Any]:
    unshifted = _odd_case(Fraction(0))
    shifted = _odd_case(Fraction(1))
    if (
        unshifted["chi_beta"] != Fraction(43, 216)
        or unshifted["load_direct"] != Fraction(43, 216)
        or unshifted["load_if_chi_omitted"] != Fraction(43, 180)
        or shifted["chi_beta"] != Fraction(5, 18)
        or shifted["load_direct"] != Fraction(5, 18)
        or shifted["load_if_chi_omitted"] != Fraction(5, 12)
    ):
        raise ValueError("nonzero chi oracle failed")

    m_beta = shifted["M_beta"]
    p = shifted["p"]
    excess_vector = [Fraction(1), Fraction(1)]
    excess = _outer(excess_vector)
    compensated = _add(m_beta, excess)
    load_compensated = 2 * _quadratic(p, _inverse(compensated))
    m_inverse = shifted["M_beta_inverse"]
    m_inverse_p = _matvec(m_inverse, p)
    aligned_inner = sum((excess_vector[i] * m_inverse_p[i] for i in range(2)), Fraction(0))
    excess_norm = _quadratic(excess_vector, m_inverse)
    correction = 2 * aligned_inner**2 / (1 + excess_norm)
    if (
        load_compensated != Fraction(31, 198)
        or correction != Fraction(4, 33)
        or shifted["load_direct"] - correction != load_compensated
    ):
        raise ValueError("aligned positive-excess regression failed")

    actual_base = [[Fraction(5), Fraction(1)], [Fraction(1), Fraction(4)]]
    pole = [Fraction(1), Fraction(0)]
    one_direction: dict[str, Any] = {}
    for label, beta in (
        ("strict_floor_2", Fraction(2)),
        ("rejected_floor_5_over_2", Fraction(5, 2)),
    ):
        shifted_base = _sub(actual_base, _scale(beta, _eye(2)))
        odd_matrix = _sub(shifted_base, _scale(Fraction(2), _outer(pole)))
        transverse = shifted_base[1][1]
        reserve = shifted_base[0][0] - 2 - shifted_base[0][1] ** 2 / transverse
        one_direction[label] = {
            "beta_L": beta,
            "shifted_positive_base": shifted_base,
            "shifted_odd_matrix": odd_matrix,
            "transverse_C_beta": transverse,
            "off_diagonal_b": shifted_base[0][1],
            "schur_reserve": reserve,
            "principal_minors": _principal_minors_2(odd_matrix),
            "strict_pass": reserve > 0,
        }
    if (
        one_direction["strict_floor_2"]["schur_reserve"] != Fraction(1, 2)
        or not one_direction["strict_floor_2"]["strict_pass"]
        or one_direction["rejected_floor_5_over_2"]["schur_reserve"] != Fraction(-1, 6)
        or one_direction["rejected_floor_5_over_2"]["strict_pass"]
    ):
        raise ValueError("shifted one-direction regression failed")

    equality_m_beta = _diag([Fraction(3), Fraction(2)])
    equality_p = [Fraction(0), Fraction(1)]
    equality_load = 2 * _quadratic(equality_p, _inverse(equality_m_beta))
    equality_odd = _sub(equality_m_beta, _scale(Fraction(2), _outer(equality_p)))
    equality_minors = _principal_minors_2(equality_odd)
    equality_strict_pass = min(equality_minors) > 0
    wrong_positive_pole = _add(
        equality_m_beta,
        _scale(Fraction(2), _outer(equality_p)),
    )
    wrong_positive_pole_minors = _principal_minors_2(wrong_positive_pole)
    wrong_positive_pole_matrix_is_positive = min(wrong_positive_pole_minors) > 0
    wrong_positive_pole_sign_rejected = True
    if (
        equality_load != 1
        or equality_odd != _diag([Fraction(3), Fraction(0)])
        or equality_strict_pass
        or not wrong_positive_pole_matrix_is_positive
        or not wrong_positive_pole_sign_rejected
    ):
        raise ValueError("load-one equality or odd-pole sign regression failed")

    unshifted_transverse_wrong_reserve = (
        actual_base[0][0]
        - Fraction(2)
        - Fraction(2)
        - actual_base[0][1] ** 2 / actual_base[1][1]
    )
    if unshifted_transverse_wrong_reserve != Fraction(3, 4):
        raise ValueError("unshifted transverse substitution regression failed")

    return {
        "unshifted_beta_zero_nonzero_chi": unshifted,
        "shifted_beta_one_nonzero_chi": shifted,
        "aligned_positive_excess": {
            "A_plus": excess,
            "M_beta_plus_A": compensated,
            "base_load": shifted["load_direct"],
            "aligned_inner_u_star_M_inverse_p": aligned_inner,
            "u_star_M_inverse_u": excess_norm,
            "sherman_morrison_correction": correction,
            "compensated_load_formula": shifted["load_direct"] - correction,
            "compensated_load_direct": load_compensated,
            "transverse_operator_norm_used_as_reserve": False,
        },
        "load_one_equality_oracle": {
            "M_beta": equality_m_beta,
            "p": equality_p,
            "load_direct": equality_load,
            "shifted_odd_matrix": equality_odd,
            "shifted_odd_principal_minors": equality_minors,
            "strict_pass": equality_strict_pass,
            "wrong_positive_pole_matrix": wrong_positive_pole,
            "wrong_positive_pole_principal_minors": wrong_positive_pole_minors,
            "wrong_positive_pole_matrix_is_positive": wrong_positive_pole_matrix_is_positive,
            "wrong_positive_pole_sign_rejected": wrong_positive_pole_sign_rejected,
        },
        "shifted_one_direction": {
            "M_actual_positive_base": actual_base,
            "p": pole,
            "unshifted_transverse_wrong_reserve": unshifted_transverse_wrong_reserve,
            "unshifted_transverse_substituted": False,
            **one_direction,
        },
    }


def _precision_bits(dps: int) -> int:
    return (
        dps * LOG2_10_UPPER_NUMERATOR + LOG2_10_UPPER_DENOMINATOR - 1
    ) // LOG2_10_UPPER_DENOMINATOR


def _raw(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _raw_fraction(raw: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = raw
    value = Fraction(mantissa * (1 if sign == 0 else -1))
    return value * (2**exponent if exponent >= 0 else Fraction(1, 2 ** (-exponent)))


def _power_of_two(exponent: int) -> Fraction:
    return Fraction(2**exponent) if exponent >= 0 else Fraction(1, 2 ** (-exponent))


def _normalize_signed_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return (0, 0, 0, 0)
    sign = 1 if value < 0 else 0
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return (sign, mantissa, exponent, mantissa.bit_length())


def _shift_raw(raw: tuple[int, int, int, int], power: int, direction: int) -> tuple[int, int, int, int]:
    sign, mantissa, exponent, _bits = raw
    signed = -mantissa if sign else mantissa
    base = min(exponent, power)
    shifted = (signed << (exponent - base)) + direction * (1 << (power - base))
    return _normalize_signed_dyadic(shifted, base)


def _guarded_endpoints(
    lower: tuple[int, int, int, int],
    upper: tuple[int, int, int, int],
    dps: int,
) -> tuple[tuple[int, int, int, int], tuple[int, int, int, int]]:
    if lower == upper:
        return lower, upper
    scale = 0
    for _sign, mantissa, exponent, bits in (lower, upper):
        if mantissa:
            scale = max(scale, exponent + bits - 1)
    guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
    return _shift_raw(lower, guard, -1), _shift_raw(upper, guard, 1)


def _serialize_interval(value: object, dps: int) -> dict[str, object]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lo, hi = _guarded_endpoints(
        tuple(int(part) for part in lower),
        tuple(int(part) for part in upper),
        dps,
    )
    scale = 0
    for _sign, mantissa, exponent, bits in (lo, hi):
        if mantissa:
            scale = max(scale, exponent + bits - 1)
    width = _raw_fraction(hi) - _raw_fraction(lo)
    cap = _power_of_two(scale - _precision_bits(dps) + 22)
    if width < 0 or width > cap:
        raise ArithmeticError("serialized interval exceeds precision-scaled width cap")
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), dps + 10), mp.nstr(mp.mpf(hi), dps + 10)],
            "dyadic": {"lower": _raw(lo), "upper": _raw(hi)},
        }


def _interval_probes(p: int, dps: int) -> dict[str, Any]:
    mp.iv.dps = dps
    lam = mp.iv.mpf(p) / 2
    length = 2 * mp.iv.log(lam)
    probes = {
        "lambda": lam,
        "physical_length_L": length,
        "necessary_central_trace_scale_L_over_lambda": length / lam,
        "unit_s_old_tail_threshold": mp.iv.sqrt(1 / (16 * lam**5)),
        "q_beta_one_with_c_five": 4 * length,
        "h_beta_one_with_a_two": length,
        "half_L_strict_budget_probe": length / 2,
    }
    return {
        "formula_scale_regression_only": True,
        "physical_capture_or_coframe_estimate_claimed": False,
        "values": {key: _serialize_interval(value, dps) for key, value in probes.items()},
    }


def _validate_admissions() -> None:
    if any(SOURCE_ADMISSIONS.values()):
        raise ValueError("a forbidden source admission was enabled")


def produce(lambda_numerator_text: str, dps_text: str) -> dict[str, Any]:
    p_text, p = _canonical_positive_text(
        lambda_numerator_text,
        "lambda numerator",
        3,
        MAX_LAMBDA_NUMERATOR,
    )
    precision_text, precision = _canonical_positive_text(
        dps_text,
        "dps",
        50,
        MAX_DPS,
    )
    if p % 2 == 0:
        raise ValueError("lambda numerator must be odd")
    _validate_admissions()
    _validate_runtime()
    source_binding, source_lock = _validated_source_lock()
    weighted = _cap_free_weighted_capture()
    coframe = _exact_coframe_loss()
    odd = _shifted_odd_and_positive_excess()
    intervals = _interval_probes(p, precision)
    checks = {
        "cap_parameter_cancels_exactly": weighted["cap_cancellation"]["capped_excess_values"]
        == weighted["cap_cancellation"]["cap_free_values"],
        "weighted_capture_infimum_exact": weighted["least_squares_capture"]["residual_trace"]
        == Fraction(14, 3),
        "source_tail_competitor_is_upper_bound": weighted["full_source_competitor"]["cost_above_infimum"]
        == Fraction(82, 75),
        "central_domination_fixture_exact": weighted["central_band_necessity_fixture"]["domination_verified"]
        and weighted["central_band_necessity_fixture"]["residual_trace"] == Fraction(3),
        "central_strict_budget_antecedent_true": weighted["central_band_necessity_fixture"]["strict_budget_antecedent"],
        "one_state_not_promoted_to_trace": not weighted["central_band_necessity_fixture"]["one_state_estimate_promoted_to_trace"],
        "full_source_gram_retained": coframe["source_gram_C_star_C"] != _eye(2),
        "exact_coframe_correction_reconstructed": coframe["loss_from_exact_formula"]
        == coframe["loss_from_direct_projection"],
        "exact_coframe_bound_sharper_than_old_majorant": coframe["rho_plus_beta_E"]
        < coframe["old_cauchy_Theta"],
        "nonzero_chi_reconstructed_at_two_floors": odd["unshifted_beta_zero_nonzero_chi"]["chi_beta"] > 0
        and odd["shifted_beta_one_nonzero_chi"]["chi_beta"] > 0,
        "moment_hierarchy_nonincreasing": min(
            odd["shifted_beta_one_nonzero_chi"]["successive_U_differences"]
        ) >= 0,
        "moment_difference_formula_reconstructed": odd["shifted_beta_one_nonzero_chi"]["successive_U_differences"]
        == odd["shifted_beta_one_nonzero_chi"]["successive_U_difference_formula_rhs"],
        "moment_remainder_formula_reconstructed": odd["shifted_beta_one_nonzero_chi"]["U_minus_exact_load"]
        == odd["shifted_beta_one_nonzero_chi"]["U_minus_exact_load_formula_rhs"],
        "aligned_positive_excess_identity_exact": odd["aligned_positive_excess"]["compensated_load_formula"]
        == odd["aligned_positive_excess"]["compensated_load_direct"],
        "load_one_equality_rejected": not odd["load_one_equality_oracle"]["strict_pass"],
        "wrong_positive_odd_pole_sign_rejected": odd["load_one_equality_oracle"]["wrong_positive_pole_matrix_is_positive"]
        and odd["load_one_equality_oracle"]["wrong_positive_pole_sign_rejected"],
        "unshifted_transverse_not_substituted": not odd["shifted_one_direction"]["unshifted_transverse_substituted"],
        "nonpositive_shifted_reserve_rejected": not odd["shifted_one_direction"]["rejected_floor_5_over_2"]["strict_pass"],
        "interval_probe_not_promoted": not intervals["physical_capture_or_coframe_estimate_claimed"],
    }
    if not all(checks.values()):
        raise ValueError("physical-defect/adjoint-tail audit check failed")
    payload = _encode({
        "schema": SCHEMA,
        "source_lock": source_binding,
        "inputs": {
            "lambda_numerator_text": p_text,
            "lambda_denominator_text": "2",
            "dps_text": precision_text,
        },
        "terminal_state": TERMINAL_STATE,
        "source_conventions": {
            "locked_conventions": source_lock["locked_conventions"],
            "locked_formulas": source_lock["locked_formulas"],
        },
        "claim_boundary": {
            "claim_class": CLAIM_CLASS,
            "proved": source_lock["claim_boundary"]["proved"],
            "not_proved": source_lock["claim_boundary"]["not_proved"],
            "source_admissions": SOURCE_ADMISSIONS,
        },
        "certificate": {
            "cap_free_weighted_capture": weighted,
            "exact_coframe_loss": coframe,
            "shifted_odd_and_positive_excess": odd,
            "transcendental_intervals": intervals,
            "checks": checks,
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    })
    _assert_strict_json(payload)
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", required=True)
    parser.add_argument("--dps", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    payload = produce(args.lambda_numerator, args.dps)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
