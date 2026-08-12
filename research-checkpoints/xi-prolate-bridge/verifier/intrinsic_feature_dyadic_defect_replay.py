#!/usr/bin/env python3
"""Clean-room replay for the intrinsic-feature dyadic-defect certificate.

This verifier imports no producer code and reads no environment variables.  It
rehashes the source lock and every locked dependency, reconstructs all finite
fixtures with ``Fraction`` arithmetic, detects prime powers independently, and
evaluates transcendental probes through a formula tree distinct from the
producer's.  The replay is diagnostic and can only emit ``P0_INVALIDATED``.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
import math
from pathlib import Path
import re
from typing import Any

import mpmath as mp


PRODUCER_SCHEMA = "xi-prolate-intrinsic-feature-dyadic-defect-v1"
REPLAY_SCHEMA = "xi-prolate-intrinsic-feature-dyadic-defect-replay-v1"
SOURCE_LOCK_PATH = "INTRINSIC_FEATURE_DYADIC_DEFECT_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = "xi-prolate-intrinsic-feature-dyadic-defect-source-lock-v1"
CLAIM_CLASS = "INTRINSIC_FEATURE_DYADIC_DEFECT_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_SOURCE_LOCK_SHA256 = "6c9c8e43093d3156f11a42b11a967d7deaebc707e0868716748e54014048038a"
EXPECTED_MPMATH_VERSION = "1.4.1"
EXPECTED_DEPENDENCY_PATHS = {
    "DIRECT_RH_ATTACK.md",
    "P0_SOURCE_LOCK.json",
    "LOG_FEATURE_CAPTURE_ALIGNMENT_SOURCE_LOCK.json",
    "PHYSICAL_DEFECT_ADJOINT_TAIL_SOURCE_LOCK.json",
    "FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json",
    "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_SOURCE_LOCK.json",
    "notes/INTRINSIC_FEATURE_DYADIC_DEFECT_REDUCTION.md",
    "notes/LOG_FEATURE_CAPTURE_ALIGNMENT_REDUCTION.md",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md",
    "requirements.txt",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_UNSIGNED_INTEGER_TEXT = re.compile(r"^(?:0|[1-9][0-9]*)$")
_POSITIVE_INTEGER_TEXT = re.compile(r"^[1-9][0-9]*$")
_DECIMAL_TEXT = re.compile(
    r"^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e[+-]?[0-9]+)?$"
)
_LOG2_10_UPPER_NUMERATOR = 3321928094887363
_LOG2_10_UPPER_DENOMINATOR = 10**15

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": [
        "Python fractions.Fraction",
        f"mpmath.iv {EXPECTED_MPMATH_VERSION}",
    ],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "every nondegenerate interval is enlarged to a precision-scaled dyadic enclosure",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and the pinned mpmath.iv transcendental runtime",
}

Matrix = list[list[Fraction]]
Vector = list[Fraction]


class ReplayError(ValueError):
    """Raised when an artifact is malformed or independent replay fails."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _read(path: Path, label: str) -> bytes:
    try:
        return path.read_bytes()
    except OSError as exc:
        raise ReplayError(f"cannot read {label}: {path}") from exc


def _reject_json_number(token: str) -> None:
    raise ReplayError(f"binary64 or non-integer JSON number rejected: {token}")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _validate_json(value: Any, label: str = "payload") -> None:
    if value is None or type(value) in (str, bool):
        return
    if isinstance(value, int) and not isinstance(value, bool):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {label} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate_json(child, f"{label}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string JSON key at {label}")
            _validate_json(child, f"{label}.{key}")
        return
    raise ReplayError(f"non-JSON value at {label}")


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        text = raw.decode("utf-8") if isinstance(raw, bytes) else raw
    except UnicodeDecodeError as exc:
        raise ReplayError(f"{label} is not UTF-8") from exc
    try:
        value = json.loads(
            text,
            parse_float=_reject_json_number,
            parse_constant=_reject_json_number,
            object_pairs_hook=_unique_object,
        )
    except ReplayError:
        raise
    except (json.JSONDecodeError, TypeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate_json(value, label)
    return value


def _same(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(
            _same(left[key], right[key]) for key in left
        )
    if isinstance(left, list):
        return len(left) == len(right) and all(
            _same(a, b) for a, b in zip(left, right)
        )
    return left == right


def _require(actual: Any, expected: Any, label: str) -> None:
    if not _same(actual, expected):
        raise ReplayError(f"{label} mismatch or claim promotion")


def _rational(value: Fraction | int) -> dict[str, str]:
    item = value if isinstance(value, Fraction) else Fraction(value)
    return {"numerator": str(item.numerator), "denominator": str(item.denominator)}


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return _rational(value)
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _validate_runtime() -> None:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise ReplayError(
            "mpmath runtime mismatch: expected "
            f"{EXPECTED_MPMATH_VERSION}, found {getattr(mp, '__version__', None)!r}"
        )


def _canonical_input(value: Any, label: str, allowed: set[int]) -> int:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be canonical positive integer text")
    if _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise ReplayError(f"{label} must be canonical positive integer text")
    allowed_text = {str(item) for item in allowed}
    upper = str(max(allowed))
    if len(value) > len(upper) or (len(value) == len(upper) and value > upper):
        raise ReplayError(f"{label} exceeds maximum")
    if value not in allowed_text:
        choices = ", ".join(str(item) for item in sorted(allowed))
        raise ReplayError(f"{label} must be one of {{{choices}}}")
    return int(value)


def _validate_source_lock(root: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    raw = _read(root / SOURCE_LOCK_PATH, "source lock")
    lock_hash = _digest(raw)
    if lock_hash != EXPECTED_SOURCE_LOCK_SHA256:
        raise ReplayError("source-lock hash mismatch")
    lock = _strict_json_loads(raw, "source lock")
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    if (
        lock["schema"] != SOURCE_LOCK_SCHEMA
        or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE
        or lock["updated_date"] != UPDATED_DATE
        or lock["external_sources"] != []
    ):
        raise ReplayError("source-lock fixed metadata mismatch")
    admissions = lock["source_admissions"]
    if not isinstance(admissions, dict) or not admissions:
        raise ReplayError("source-lock admissions missing")
    for key, value in admissions.items():
        if not isinstance(key, str) or type(value) is not bool or value:
            raise ReplayError("source-lock admission promotes a forbidden claim")
    conventions = lock["locked_conventions"]
    formulas = lock["locked_formulas"]
    if not isinstance(conventions, dict) or not conventions:
        raise ReplayError("source-lock conventions missing")
    if not isinstance(formulas, dict) or not formulas:
        raise ReplayError("source-lock formulas missing")
    boundary = lock["claim_boundary"]
    if (
        not isinstance(boundary, dict)
        or set(boundary) != {"proved", "not_proved"}
        or not isinstance(boundary["proved"], list)
        or not isinstance(boundary["not_proved"], list)
        or not all(isinstance(item, str) for item in boundary["proved"])
        or not all(isinstance(item, str) for item in boundary["not_proved"])
        or not any("Riemann hypothesis" in item for item in boundary["not_proved"])
        or not any("equation (5.2)" in item for item in boundary["not_proved"])
    ):
        raise ReplayError("source-lock claim boundary malformed")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list):
        raise ReplayError("source-lock dependency inventory malformed")
    found: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
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
            raise ReplayError("invalid source-lock dependency")
        actual = _digest(_read(root / candidate, relative))
        if actual != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        found[relative] = expected
    if set(found) != EXPECTED_DEPENDENCY_PATHS:
        raise ReplayError("source-lock dependency path inventory mismatch")
    return {
        "path": SOURCE_LOCK_PATH,
        "sha256": lock_hash,
        "schema": SOURCE_LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(found.items())),
    }, lock


def _diag(*entries: Fraction | int) -> Matrix:
    values = [Fraction(entry) for entry in entries]
    return [
        [values[i] if i == j else Fraction(0) for j in range(len(values))]
        for i in range(len(values))
    ]


def _identity(size: int) -> Matrix:
    return _diag(*([Fraction(1)] * size))


def _transpose(matrix: Matrix) -> Matrix:
    if not matrix or any(len(row) != len(matrix[0]) for row in matrix):
        raise ReplayError("internal replay matrix is empty or ragged")
    return [[matrix[row][column] for row in range(len(matrix))]
            for column in range(len(matrix[0]))]


def _product(left: Matrix, right: Matrix) -> Matrix:
    if (
        not left or not right
        or any(len(row) != len(left[0]) for row in left)
        or any(len(row) != len(right[0]) for row in right)
        or len(left[0]) != len(right)
    ):
        raise ReplayError("internal replay matrix dimension mismatch")
    return [[
        sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
        for j in range(len(right[0]))
    ] for i in range(len(left))]


def _sum_matrix(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right) or any(len(a) != len(b) for a, b in zip(left, right)):
        raise ReplayError("internal replay matrix shape mismatch")
    return [[a + b for a, b in zip(row_a, row_b)]
            for row_a, row_b in zip(left, right)]


def _difference(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right) or any(len(a) != len(b) for a, b in zip(left, right)):
        raise ReplayError("internal replay matrix shape mismatch")
    return [[a - b for a, b in zip(row_a, row_b)]
            for row_a, row_b in zip(left, right)]


def _multiple(scalar: Fraction | int, matrix: Matrix) -> Matrix:
    factor = Fraction(scalar)
    return [[factor * entry for entry in row] for row in matrix]


def _outer(left: Vector, right: Vector | None = None) -> Matrix:
    other = left if right is None else right
    return [[a * b for b in other] for a in left]


def _dot(left: Vector, right: Vector) -> Fraction:
    if len(left) != len(right):
        raise ReplayError("internal replay vector dimension mismatch")
    return sum((a * b for a, b in zip(left, right)), Fraction(0))


def _apply(matrix: Matrix, vector: Vector) -> Vector:
    return [_dot(row, vector) for row in matrix]


def _quadratic(matrix: Matrix, vector: Vector) -> Fraction:
    return _dot(vector, _apply(matrix, vector))


def _det2(matrix: Matrix) -> Fraction:
    if len(matrix) != 2 or any(len(row) != 2 for row in matrix):
        raise ReplayError("internal replay determinant shape mismatch")
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def _trace(matrix: Matrix) -> Fraction:
    if not matrix or any(len(row) != len(matrix) for row in matrix):
        raise ReplayError("internal replay trace shape mismatch")
    return sum((matrix[index][index] for index in range(len(matrix))), Fraction(0))


def _rank(matrix: Matrix) -> int:
    if not matrix or any(len(row) != len(matrix[0]) for row in matrix):
        raise ReplayError("internal replay rank shape mismatch")
    work = [row[:] for row in matrix]
    rows, columns = len(work), len(work[0])
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        scale = work[pivot_row][column]
        work[pivot_row] = [entry / scale for entry in work[pivot_row]]
        for row in range(rows):
            if row == pivot_row:
                continue
            factor = work[row][column]
            if factor:
                work[row] = [
                    entry - factor * base
                    for entry, base in zip(work[row], work[pivot_row])
                ]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


def _gauge_reconstruction(p: int) -> dict[str, Any]:
    scale = Fraction(p, 4)
    t_row = [scale, Fraction(0)]
    aligned = _diag(1, 0)
    transverse = _diag(0, 1)
    b_min = [Fraction(4, p), Fraction(0)]
    b_shift = [Fraction(4, p), Fraction(1)]
    aligned_tail_min = _apply(_difference(_identity(2), aligned), b_min)
    aligned_tail_shift = _apply(_difference(_identity(2), aligned), b_shift)
    transverse_tail = _apply(_difference(_identity(2), transverse), b_min)
    if (
        _dot(t_row, b_min) != 1
        or _dot(t_row, b_shift) != 1
        or _dot(aligned_tail_min, aligned_tail_min) != 0
        or _dot(aligned_tail_shift, aligned_tail_shift) != 1
        or _dot(transverse_tail, transverse_tail) != Fraction(16, p * p)
    ):
        raise ReplayError("gauge/minimal-tail reconstruction failed")
    exact_minimum = Fraction(16, p * p)
    theorem_lower = Fraction(8, p * p)
    b_min_matrix = [[b_min[0]], [b_min[1]]]
    b_shift_matrix = [[b_shift[0]], [b_shift[1]]]
    return {
        "lambda": Fraction(p, 2),
        "X_dimension": 1,
        "V_dimension": 1,
        "source_dimension": 2,
        "T": [t_row],
        "P_V": [[Fraction(1)]],
        "T_operator_norm_squared": Fraction(p * p, 16),
        "general_T_norm_squared_upper": Fraction(p * p, 8),
        "gauge_right_inverses": {
            "P_F": aligned,
            "B_0": b_min_matrix,
            "B_1": b_shift_matrix,
            "T_B_0": [[_dot(t_row, b_min)]],
            "T_B_1": [[_dot(t_row, b_shift)]],
            "right_inverse_norms_squared_B_0_B_1": [
                _dot(b_min, b_min), _dot(b_shift, b_shift)
            ],
            "declared_coarse_norm_squared_upper": Fraction(p * p, 2),
            "both_right_inverses_obey_coarse_bound": (
                _dot(b_min, b_min) <= Fraction(p * p, 2)
                and _dot(b_shift, b_shift) <= Fraction(p * p, 2)
            ),
            "P_K": [[Fraction(1)]],
            "P_H": [[Fraction(0)]],
            "alpha_squared": Fraction(0),
            "source_tail_squared_B_0_B_1": [
                _dot(aligned_tail_min, aligned_tail_min),
                _dot(aligned_tail_shift, aligned_tail_shift),
            ],
            "same_physical_angle_different_source_tails": True,
        },
        "minimal_tail_rank_obstruction": {
            "P_F": transverse,
            "P_K": [[Fraction(0)]],
            "P_H": [[Fraction(1)]],
            "alpha_squared": Fraction(1),
            "minimizing_right_inverse": b_min_matrix,
            "exact_minimal_tail_squared": exact_minimum,
            "exact_minimal_tail_formula": "16/p^2=4/lambda^2",
            "general_theorem_lower_squared": theorem_lower,
            "general_theorem_lower_formula": "2/lambda^2",
            "exact_over_general_lower_ratio": exact_minimum / theorem_lower,
            "target_scale": "L/lambda^3",
            "target_scale_impossible_from_rank_obstruction": True,
        },
        "actual_source_tail_claimed": False,
    }


def _corrected_sparse_reconstruction() -> dict[str, Any]:
    constant = [Fraction(1), Fraction(2), Fraction(3), Fraction(4)]
    p_e = _diag(1, 0, 1, 0)
    omitted_projector = _difference(_identity(4), p_e)
    selected_constant = _apply(p_e, constant)
    omitted_constant = _apply(omitted_projector, constant)
    s = _dot(selected_constant, selected_constant)
    z = [Fraction(2), Fraction(-1), Fraction(0), Fraction(0)]
    omitted_z = _apply(omitted_projector, z)
    raw = _dot(omitted_z, omitted_z)
    correction = _dot(omitted_constant, omitted_z) ** 2 / s
    total = raw + correction
    f_direction = [Fraction(3), Fraction(0), Fraction(-1), Fraction(0)]
    f_projector = _multiple(Fraction(1, 10), _outer(f_direction))
    corrected_vector = _apply(_difference(_identity(4), f_projector), z)
    direct = _dot(corrected_vector, corrected_vector)
    if (
        _dot(constant, z) != 0
        or s != 10
        or raw != 1
        or correction != Fraction(2, 5)
        or total != Fraction(7, 5)
        or _dot(constant, f_direction) != 0
        or direct != total
    ):
        raise ReplayError("corrected sparse identity reconstruction failed")
    return {
        "orthonormal_constant_coefficients": constant,
        "selected_zero_based_indices": [0, 2],
        "P_E": p_e,
        "s_selected_constant_mass": s,
        "z": z,
        "constant_inner_z": _dot(constant, z),
        "F_direction": f_direction,
        "P_F": f_projector,
        "raw_omitted_vector": omitted_z,
        "omitted_constant_vector": omitted_constant,
        "raw_omitted_norm_squared": raw,
        "mean_correction_numerator": _dot(omitted_constant, omitted_z) ** 2,
        "mean_correction": correction,
        "corrected_tail_vector": corrected_vector,
        "corrected_tail_squared": total,
        "identity_formula": "||(I-P_F)z||^2=||(I-P_E)z||^2+|<e,(I-P_E)z>|^2/s",
        "mean_correction_retained": True,
    }


def _feature_quotient_reconstruction() -> dict[str, Any]:
    feature = [Fraction(1), Fraction(0)]
    captured = [Fraction(3, 5), Fraction(4, 5)]
    coefficient = _dot(captured, feature)
    residual = [u - coefficient * w for u, w in zip(feature, captured)]
    alpha_squared = _dot(residual, residual)
    lift = [Fraction(1), Fraction(4, 3)]
    p_f = _diag(1, 0)
    lift_tail = _apply(_difference(_identity(2), p_f), lift)
    beta_squared = _dot(lift_tail, lift_tail)
    graph_bound_squared = beta_squared / (1 + beta_squared)
    p_k = _outer(captured)
    p_h = _difference(_identity(2), p_k)
    if (
        coefficient != Fraction(3, 5)
        or residual != [Fraction(16, 25), Fraction(-12, 25)]
        or alpha_squared != Fraction(16, 25)
        or beta_squared != Fraction(16, 9)
        or [coefficient * entry for entry in lift] != captured
        or graph_bound_squared != alpha_squared
    ):
        raise ReplayError("feature quotient reconstruction failed")
    return {
        "U_column": feature,
        "W_column": captured,
        "G_U_star_U": _dot(feature, feature),
        "A_W_star_W": _dot(captured, captured),
        "cross_gram_U_star_W": coefficient,
        "least_squares_minimizer_y": coefficient,
        "least_squares_residual": residual,
        "least_squares_residual_squared": alpha_squared,
        "P_K": p_k,
        "P_H": p_h,
        "intrinsic_alpha_squared": _quadratic(p_h, feature),
        "schur_complement_G_minus_cross_A_dagger_cross": (
            _dot(feature, feature) - coefficient**2 / _dot(captured, captured)
        ),
        "graph_Z": lift,
        "graph_scale_y": coefficient,
        "graph_scale_y_times_Z": [coefficient * entry for entry in lift],
        "W_equals_y_Z": [coefficient * entry for entry in lift] == captured,
        "graph_beta_squared": beta_squared,
        "graph_beta_squared_over_one_plus_beta_squared": graph_bound_squared,
        "cross_gram_retained": True,
        "actual_feature_angle_claimed": False,
    }


def _dyadic_povm_reconstruction() -> dict[str, Any]:
    a1 = _diag(Fraction(1, 4), 0)
    a2 = _multiple(Fraction(1, 8), [[Fraction(1), Fraction(1)],
                                               [Fraction(1), Fraction(1)]])
    a3 = _difference(_identity(2), _sum_matrix(a1, a2))
    layers = [a1, a2, a3]
    heights = [Fraction(1), Fraction(3), Fraction(8)]
    dyadic_heights = [Fraction(1), Fraction(4), Fraction(8)]
    exact_operator = _diag(0, 0)
    majorant = _diag(0, 0)
    for height, dyadic_height, layer in zip(heights, dyadic_heights, layers):
        exact_operator = _sum_matrix(exact_operator, _multiple(height, layer))
        majorant = _sum_matrix(majorant, _multiple(dyadic_height, layer))
    excess = _difference(majorant, exact_operator)
    ranks = [_rank(layer) for layer in layers]
    c_1 = _sum_matrix(a2, a3)
    c_2 = _sum_matrix(a2, a3)
    c_4 = a3
    commutator = _difference(_product(c_1, c_4), _product(c_4, c_1))
    sigma = Fraction(1, 2)
    endpoint_operator = _diag(sigma, Fraction(3, 4))
    p_k = _diag(0, 1)
    p_h = _difference(_identity(2), p_k)
    e_low_open = _diag(0, 0)
    e_low_closed = _diag(1, 0)
    e_high_closed = _identity(2)
    e_high_open = _diag(0, 1)
    sharp_upper = _sum_matrix(
        _multiple(sigma, _identity(2)),
        _multiple(1 - sigma, e_high_open),
    )
    if (
        _sum_matrix(_sum_matrix(a1, a2), a3) != _identity(2)
        or a3 != [[Fraction(5, 8), Fraction(-1, 8)],
                  [Fraction(-1, 8), Fraction(7, 8)]]
        or _det2(a3) != Fraction(17, 32)
        or ranks != [1, 1, 2]
        or excess != a2
        or commutator != [[Fraction(0), Fraction(1, 32)],
                          [Fraction(-1, 32), Fraction(0)]]
        or _trace(_product(p_h, e_low_closed)) != 1
        or _trace(_product(p_h, e_low_open)) != 0
    ):
        raise ReplayError("dyadic POVM/endpoint reconstruction failed")
    return {
        "noncommuting_layer_majorant": {
            "POVM_A_1": a1,
            "POVM_A_2": a2,
            "POVM_A_3": a3,
            "POVM_sum": _sum_matrix(_sum_matrix(a1, a2), a3),
            "heights": heights,
            "tau": Fraction(1),
            "A_star": Fraction(8),
            "J": 3,
            "thresholds_s_j": [Fraction(1), Fraction(2), Fraction(4)],
            "coefficients_c_j": [Fraction(1), Fraction(2), Fraction(4)],
            "level_operator_C_1": c_1,
            "level_operator_C_2": c_2,
            "level_operator_C_4": c_4,
            "exact_D": exact_operator,
            "dyadic_majorant": majorant,
            "majorant_minus_D": excess,
            "majorant_minus_D_equals_A_2": excess == a2,
            "C_1_C_4_commutator": commutator,
            "level_operators_noncommuting": commutator != _diag(0, 0),
        },
        "spectral_endpoint_rank_obstruction": {
            "C": endpoint_operator,
            "sigma": sigma,
            "P_K": p_k,
            "P_H": p_h,
            "upper_projector_E_open_sigma_1": e_high_open,
            "sharp_upper_sigma_I_plus_one_minus_sigma_E": sharp_upper,
            "sharp_upper_minus_C": _difference(sharp_upper, endpoint_operator),
            "upper_intrinsic_angle_squared": _trace(_product(p_h, e_high_open)),
            "high_compression_at_sigma": _trace(_product(p_h, endpoint_operator)),
            "lower_projector_F_closed_sigma_1": e_high_closed,
            "closed_projector_rank": _rank(e_high_closed),
            "K_dimension": _rank(p_k),
            "rank_excess": _rank(e_high_closed) - _rank(p_k),
            "closed_intrinsic_angle_squared": _trace(_product(p_h, e_high_closed)),
            "closed_endpoint_mandatory": True,
        },
        "actual_layer_capture_claimed": False,
    }


def _odd_directional_reconstruction() -> dict[str, Any]:
    q, h, b = Fraction(3), Fraction(1), Fraction(2)
    r_operator = _diag(0, b)
    m_beta = _difference(_multiple(q, _identity(2)), r_operator)

    def orientation(label: str, pole: Vector) -> dict[str, Any]:
        mu = _dot(pole, pole)
        moments: list[Fraction] = []
        current = pole[:]
        for _ in range(5):
            moments.append(_dot(pole, current))
            current = _apply(r_operator, current)
        deficits = [b**order * mu - moment
                    for order, moment in enumerate(moments)]
        upper: list[Fraction] = []
        for order in range(5):
            prefix = sum(
                (moments[index] / q**(index + 1) for index in range(order)),
                Fraction(0),
            )
            upper.append(2 * (prefix + moments[order] / (h * q**order)))
        load = 2 * (
            pole[0] ** 2 / m_beta[0][0] + pole[1] ** 2 / m_beta[1][1]
        )
        shifted = _difference(m_beta, _multiple(2, _outer(pole)))
        return {
            "label": label,
            "p": pole,
            "rho_0_through_4": moments,
            "directional_defect_moments_power_1_through_4": deficits[1:],
            "U_0_through_4": upper,
            "exact_load": load,
            "shifted_odd_matrix": shifted,
            "shifted_odd_determinant": _det2(shifted),
            "strict_pass": shifted[0][0] > 0 and _det2(shifted) > 0,
        }

    good = orientation("good_orientation", [Fraction(1), Fraction(0)])
    bad = orientation("bad_orientation", [Fraction(0), Fraction(1)])
    base = _identity(2)
    pole = [Fraction(1), Fraction(0)]

    def excess_case(label: str, excess: Matrix) -> dict[str, Any]:
        combined = _sum_matrix(base, excess)
        determinant = _det2(combined)
        inverse_11 = combined[1][1] / determinant
        load = 2 * inverse_11
        shifted = _difference(combined, _multiple(2, _outer(pole)))
        return {
            "label": label,
            "A_plus": excess,
            "A_plus_trace": _trace(excess),
            "A_plus_determinant": _det2(excess),
            "pole_axis_energy": _quadratic(excess, pole),
            "necessary_axis_rhs": Fraction(1),
            "necessary_axis_inequality": _quadratic(excess, pole) > 1,
            "exact_load": load,
            "compensated_odd_matrix": shifted,
            "compensated_determinant": _det2(shifted),
            "strict_pass": shifted[0][0] > 0 and _det2(shifted) > 0,
        }

    aligned = excess_case("aligned", _diag(2, 0))
    u = [Fraction(4, 5), Fraction(3, 5)]
    oblique = excess_case("oblique", _multiple(2, _outer(u)))
    transverse = excess_case("transverse", _diag(0, 2))

    scalar_moments = [Fraction(1)] * 5
    scalar_deficits = [b**order - 1 for order in range(5)]
    scalar_upper: list[Fraction] = []
    for order in range(5):
        prefix = sum(
            (Fraction(1, q**(index + 1)) for index in range(order)),
            Fraction(0),
        )
        scalar_upper.append(2 * (prefix + Fraction(1, h * q**order)))
    scalar_load = Fraction(1)
    scalar_remainders = [upper - scalar_load for upper in scalar_upper]
    if (
        good["exact_load"] != Fraction(2, 3)
        or good["U_0_through_4"] != [Fraction(2), Fraction(2, 3),
                                      Fraction(2, 3), Fraction(2, 3),
                                      Fraction(2, 3)]
        or not good["strict_pass"]
        or bad["exact_load"] != 2
        or bad["U_0_through_4"] != [Fraction(2)] * 5
        or bad["strict_pass"]
        or aligned["exact_load"] != Fraction(2, 3)
        or not aligned["strict_pass"]
        or oblique["pole_axis_energy"] != Fraction(32, 25)
        or oblique["exact_load"] != Fraction(86, 75)
        or oblique["compensated_determinant"] != Fraction(-11, 25)
        or oblique["strict_pass"]
        or transverse["exact_load"] != 2
        or scalar_upper != [Fraction(2), Fraction(4, 3), Fraction(10, 9),
                            Fraction(28, 27), Fraction(82, 81)]
        or scalar_remainders != [Fraction(1), Fraction(1, 3),
                                 Fraction(1, 9), Fraction(1, 27),
                                 Fraction(1, 81)]
    ):
        raise ReplayError("odd directional/alignment reconstruction failed")
    return {
        "q": q,
        "h": h,
        "b_q_minus_h": b,
        "gamma": Fraction(2, 3),
        "R": r_operator,
        "M_beta": m_beta,
        "directional_defect_operator_b_I_minus_R": _difference(
            _multiple(b, _identity(2)), r_operator
        ),
        "good_orientation": good,
        "bad_orientation": bad,
        "scalar_remainder_regression": {
            "q": q,
            "h": h,
            "b": b,
            "gamma": Fraction(2, 3),
            "R_scalar": [[Fraction(1)]],
            "p": [Fraction(1)],
            "mu_p": Fraction(1),
            "x_R_over_q": Fraction(1, 3),
            "exact_load": scalar_load,
            "U_1": scalar_upper[1],
            "U_1_minus_load": scalar_remainders[1],
        },
        "same_R_spectrum_and_pole_norm": True,
        "aligned_excess_orientation": {
            "M_beta": base,
            "p": pole,
            "aligned": aligned,
            "oblique": oblique,
            "transverse": transverse,
            "shared_nonzero_spectrum_A_plus": [Fraction(2)],
            "axis_necessity_not_sufficient": (
                oblique["necessary_axis_inequality"] and not oblique["strict_pass"]
            ),
            "spectrum_without_orientation_not_sufficient": True,
        },
        "optimal_constant_formula": {
            "C_0": "gamma",
            "C_k": "max_(0<=x<=gamma) x^k*(gamma-x)/(1-x)",
            "A_k": "(k+1)+(k-1)*gamma",
            "x_k": "(A_k-sqrt(A_k^2-4*k^2*gamma))/(2*k)",
            "remainder": "0<=U_k-load<=(2*mu_p/h)*C_k(gamma)",
        },
        "actual_odd_reserve_claimed": False,
    }


def _prime_power_base(n: int) -> tuple[int, int] | None:
    """Return the unique prime base/exponent, using only trial division."""
    if n < 2:
        return None
    divisor = 2
    while divisor <= math.isqrt(n) and n % divisor:
        divisor += 1
    if divisor > math.isqrt(n):
        return n, 1
    remainder, exponent = n, 0
    while remainder % divisor == 0:
        remainder //= divisor
        exponent += 1
    return (divisor, exponent) if remainder == 1 else None


def _prime_power_reconstruction(p: int) -> dict[str, Any]:
    cutoff_numerator = p * p
    largest_integer = cutoff_numerator // 4
    entries: list[dict[str, int]] = []
    excluded_composites: list[int] = []
    for n in range(2, largest_integer + 1):
        result = _prime_power_base(n)
        if result is None:
            excluded_composites.append(n)
        else:
            base, exponent = result
            entries.append({"n": n, "prime_base": base, "exponent": exponent})
    expected = {
        5: [2, 3, 4, 5],
        9: [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19],
    }
    if p not in expected or [entry["n"] for entry in entries] != expected[p]:
        raise ReplayError("inclusive prime-power reconstruction failed")
    return {
        "lambda_squared_numerator": str(cutoff_numerator),
        "lambda_squared_denominator": "4",
        "maximum_integer_n": largest_integer,
        "endpoint_rule": "include every prime power n with 4*n<=p^2",
        "inventory": entries,
        "combined_multiplier": "m_lambda(t)=2*theta'(t)-2*sum_(1<n<=lambda^2) Lambda(n)/sqrt(n)*cos(t*log(n))",
        "prime_block_sign": "minus",
        "individual_prime_blocks_absolutized_in_level_sets": False,
    }


def _factorial_product(value: int) -> int:
    result = 1
    for term in range(value, 1, -1):
        result *= term
    return result


def _certified_ceiling_log2(value: Any, label: str) -> int:
    lower, upper = _interval_bounds(value, label)
    if lower <= 0:
        raise ReplayError(f"{label} is not certified positive")
    for exponent in range(0, 4097):
        ceiling = Fraction(1 << exponent)
        previous = Fraction(0) if exponent == 0 else Fraction(1 << (exponent - 1))
        if upper <= ceiling:
            if lower <= previous:
                raise ReplayError(f"{label} does not certify a unique dyadic ceiling")
            return exponent
    raise ReplayError(f"{label} layer count exceeds cap")


def _interval_targets(
    p: int,
    dps: int,
    r: int,
    prime_entries: list[dict[str, int]],
) -> dict[str, Any]:
    """Rebuild probes through identities not used by the producer path."""
    _validate_runtime()
    mp.iv.dps = dps
    one = mp.iv.mpf(1)
    two = mp.iv.mpf(2)
    four = mp.iv.mpf(4)
    lam = mp.iv.mpf(p) / two
    length = two * mp.iv.log(lam)

    # Independent exact special-value tree.  The producer adds three log(2)
    # terms and log(pi) separately; replay combines them as log(8*pi):
    # psi(1/4)-log(pi)=-Euler-pi/2-log(8*pi).
    c0 = -mp.iv.euler - mp.iv.pi / two - mp.iv.log(mp.iv.mpf(8) * mp.iv.pi)
    sigma_sum = mp.iv.mpf(0)
    for item in prime_entries:
        sigma_sum += mp.iv.log(mp.iv.mpf(item["prime_base"])) / mp.iv.sqrt(
            mp.iv.mpf(item["n"])
        )
    raw_height = two * (mp.iv.log(lam) + sigma_sum) - c0
    raw_lower, _ = _interval_bounds(raw_height, "A_star_raw")
    if raw_lower <= 0:
        raise ReplayError("positive-part branch for A_star is not certified")
    a_star = raw_height
    support_radius = mp.iv.sqrt(mp.iv.exp(two * a_star) - one) / two
    layer_tau = length / four
    layer_ratio = a_star / layer_tau
    layer_count = _certified_ceiling_log2(layer_ratio, "A_star_over_tau")
    layer_log = mp.iv.log(layer_ratio) / mp.iv.log(two)
    coefficient_targets: list[dict[str, Any]] = []
    for index in range(layer_count):
        threshold = mp.iv.mpf(2**index) * layer_tau
        if index < layer_count - 1:
            coefficient = threshold
            branch = "2^j*tau"
        else:
            coefficient = a_star - threshold
            branch = "A_star-2^j*tau"
        coefficient_targets.append({
            "j": index,
            "threshold_s_j": threshold,
            "coefficient_c_j": coefficient,
            "certified_min_branch": branch,
        })

    half_length = length / two
    pole_norm_squared = (
        mp.iv.exp(half_length) - mp.iv.exp(-half_length)
    ) / two - half_length
    factorial = mp.iv.mpf(_factorial_product(r))
    pole_tail_squared = (
        lam * length ** (2 * r + 1)
        / (
            mp.iv.mpf(2 * r + 1)
            * mp.iv.mpf(16) ** r
            * factorial**2
        )
    )

    gamma = mp.iv.mpf(2) / mp.iv.mpf(3)
    values: dict[str, Any] = {
        "lambda": lam,
        "physical_length_L": length,
        "inclusive_prime_power_Sigma_lambda": sigma_sum,
        "archimedean_c_0": c0,
        "A_star": a_star,
        "support_radius": support_radius,
        "tau_L_over_4": layer_tau,
        "delta": one,
        "spectral_sigma": one / two,
        "A_star_over_tau_log2": layer_log,
        "odd_pole_norm_squared_S_L": pole_norm_squared,
        "odd_pole_taylor_tail_squared_upper": pole_tail_squared,
        "gamma": gamma,
        "C_0_gamma": gamma,
    }
    optimal: dict[str, dict[str, Any]] = {}
    for order in (1, 2, 4):
        k = mp.iv.mpf(order)
        a_value = (k + one) + (k - one) * gamma
        discriminant = a_value**2 - four * k**2 * gamma
        # Rationalized smaller-root formula is independent of the producer's
        # subtractive quadratic formula.
        maximizer = two * k * gamma / (a_value + mp.iv.sqrt(discriminant))
        optimal_value = (
            maximizer**order * (gamma - maximizer) / (one - maximizer)
        )
        optimal[f"k_{order}"] = {
            "k": order,
            "A_k": a_value,
            "x_k": maximizer,
            "C_k_gamma": optimal_value,
        }
    return {
        "values": values,
        "layer_count": layer_count,
        "layer_coefficients": coefficient_targets,
        "optimal": optimal,
    }


def _exact_certificate(p: int) -> tuple[dict[str, Any], dict[str, bool]]:
    gauge = _gauge_reconstruction(p)
    corrected = _corrected_sparse_reconstruction()
    quotient = _feature_quotient_reconstruction()
    dyadic = _dyadic_povm_reconstruction()
    odd = _odd_directional_reconstruction()
    prime_powers = _prime_power_reconstruction(p)
    checks = {
        "right_inverse_gauge_changes_tail_not_angle": gauge["gauge_right_inverses"]["same_physical_angle_different_source_tails"],
        "minimal_tail_rank_obstruction_exact": gauge["minimal_tail_rank_obstruction"]["exact_over_general_lower_ratio"] == 2,
        "sparse_mean_correction_retained": corrected["mean_correction_retained"],
        "sparse_corrected_tail_exact": corrected["corrected_tail_squared"] == Fraction(7, 5),
        "feature_cross_gram_angle_exact": quotient["intrinsic_alpha_squared"] == Fraction(16, 25),
        "feature_graph_angle_exact": quotient["graph_beta_squared_over_one_plus_beta_squared"] == Fraction(16, 25),
        "noncommuting_layer_majorant_exact": dyadic["noncommuting_layer_majorant"]["majorant_minus_D_equals_A_2"],
        "spectral_open_upper_endpoint_exact": dyadic["spectral_endpoint_rank_obstruction"]["upper_intrinsic_angle_squared"] == 0,
        "spectral_closed_lower_endpoint_retained": dyadic["spectral_endpoint_rank_obstruction"]["closed_intrinsic_angle_squared"] == 1,
        "odd_directional_good_passes": odd["good_orientation"]["strict_pass"],
        "odd_directional_bad_rejected": not odd["bad_orientation"]["strict_pass"],
        "odd_scalar_remainder_exact": odd["scalar_remainder_regression"]["U_1_minus_load"] == Fraction(1, 3),
        "aligned_excess_passes": odd["aligned_excess_orientation"]["aligned"]["strict_pass"],
        "oblique_axis_necessity_not_sufficient": odd["aligned_excess_orientation"]["axis_necessity_not_sufficient"],
        "transverse_excess_rejected": not odd["aligned_excess_orientation"]["transverse"]["strict_pass"],
        "prime_power_endpoint_inclusive": True,
        "interval_probe_not_promoted": True,
        "strict_threshold_absent": True,
    }
    if not all(checks.values()):
        raise ReplayError("independent exact fixture check failed")
    return {
        "gauge_minimal_tail": gauge,
        "corrected_sparse_identity": corrected,
        "feature_quotient": quotient,
        "dyadic_povm": dyadic,
        "odd_directional_reserve": odd,
        "inclusive_prime_powers": prime_powers,
    }, checks


def replay(payload: dict[str, Any], *, producer_bytes: bytes | None = None) -> dict[str, Any]:
    _validate_json(payload, "producer payload")
    if not isinstance(payload, dict) or set(payload) != {
        "schema", "source_lock", "inputs", "terminal_state",
        "source_conventions", "claim_boundary", "certificate",
        "arithmetic_libraries",
    }:
        raise ReplayError("producer top-level inventory mismatch")
    if payload["schema"] != PRODUCER_SCHEMA or payload["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("producer schema or terminal state mismatch")

    inputs = payload["inputs"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator_text", "lambda_denominator_text", "dps_text",
        "r_exact_integer", "r_rule",
    }:
        raise ReplayError("input inventory mismatch")
    p = _canonical_input(inputs["lambda_numerator_text"], "lambda numerator", {5, 9})
    dps = _canonical_input(inputs["dps_text"], "dps", {80, 160})
    r = 3 * p.bit_length()
    if (
        inputs["lambda_denominator_text"] != "2"
        or isinstance(inputs["r_exact_integer"], bool)
        or not isinstance(inputs["r_exact_integer"], int)
        or inputs["r_exact_integer"] != r
        or inputs["r_rule"] != "3*bit_length(lambda_numerator)"
    ):
        raise ReplayError("lambda or Taylor-order input mismatch")

    _validate_runtime()
    binding, lock = _validate_source_lock(_root())
    _require(payload["source_lock"], binding, "source-lock binding")
    _require(
        payload["source_conventions"],
        {
            "locked_conventions": lock["locked_conventions"],
            "locked_formulas": lock["locked_formulas"],
        },
        "source conventions",
    )
    _require(
        payload["claim_boundary"],
        {
            "claim_class": CLAIM_CLASS,
            "proved": lock["claim_boundary"]["proved"],
            "not_proved": lock["claim_boundary"]["not_proved"],
            "source_admissions": lock["source_admissions"],
        },
        "claim boundary",
    )
    _require(payload["arithmetic_libraries"], ARITHMETIC_LIBRARIES, "arithmetic libraries")

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "gauge_minimal_tail", "corrected_sparse_identity", "feature_quotient",
        "dyadic_povm", "odd_directional_reserve", "inclusive_prime_powers",
        "transcendental_intervals", "checks",
    }:
        raise ReplayError("certificate inventory mismatch")
    exact_groups, expected_checks = _exact_certificate(p)
    for name, reconstructed in exact_groups.items():
        _require(certificate[name], _encode(reconstructed), name)

    interval_section = certificate["transcendental_intervals"]
    if not isinstance(interval_section, dict) or set(interval_section) != {
        "formula_scale_regression_only", "nu_text", "U_text", "tau_rule",
        "delta_text", "spectral_sigma_text", "r_exact_integer", "r_rule",
        "dyadic_layer_count_J", "dyadic_layer_coefficients",
        "optimal_remainder_constants_gamma_two_thirds",
        "strict_threshold_supplied", "actual_angle_layer_or_odd_reserve_claimed",
        "values",
    }:
        raise ReplayError("interval section inventory mismatch")
    prime_entries = exact_groups["inclusive_prime_powers"]["inventory"]
    interval_targets = _interval_targets(p, dps, r, prime_entries)
    layer_count = interval_targets["layer_count"]
    _require(
        {
            key: interval_section[key]
            for key in (
                "formula_scale_regression_only", "nu_text", "U_text", "tau_rule",
                "delta_text", "spectral_sigma_text", "r_exact_integer", "r_rule",
                "dyadic_layer_count_J", "strict_threshold_supplied",
                "actual_angle_layer_or_odd_reserve_claimed",
            )
        },
        {
            "formula_scale_regression_only": True,
            "nu_text": "1",
            "U_text": "0",
            "tau_rule": "L/4",
            "delta_text": "1",
            "spectral_sigma_text": "1/2",
            "r_exact_integer": r,
            "r_rule": "3*bit_length(lambda_numerator)",
            "dyadic_layer_count_J": layer_count,
            "strict_threshold_supplied": False,
            "actual_angle_layer_or_odd_reserve_claimed": False,
        },
        "interval metadata",
    )
    submitted_coefficients = interval_section["dyadic_layer_coefficients"]
    expected_coefficients = interval_targets["layer_coefficients"]
    if (
        not isinstance(submitted_coefficients, list)
        or len(submitted_coefficients) != layer_count
    ):
        raise ReplayError("dyadic layer coefficient inventory mismatch")
    for index, (submitted, expected) in enumerate(
        zip(submitted_coefficients, expected_coefficients)
    ):
        if not isinstance(submitted, dict) or set(submitted) != {
            "j", "threshold_s_j", "coefficient_c_j", "certified_min_branch"
        }:
            raise ReplayError("dyadic layer coefficient entry malformed")
        _require(submitted["j"], expected["j"], f"dyadic layer {index} index")
        _require(
            submitted["certified_min_branch"], expected["certified_min_branch"],
            f"dyadic layer {index} branch",
        )
        _check_enclosure(
            submitted["threshold_s_j"], expected["threshold_s_j"],
            f"dyadic_layer.{index}.threshold", dps,
        )
        _check_enclosure(
            submitted["coefficient_c_j"], expected["coefficient_c_j"],
            f"dyadic_layer.{index}.coefficient", dps,
        )

    submitted_optimal = interval_section[
        "optimal_remainder_constants_gamma_two_thirds"
    ]
    expected_optimal = interval_targets["optimal"]
    if not isinstance(submitted_optimal, dict) or set(submitted_optimal) != set(expected_optimal):
        raise ReplayError("optimal remainder inventory mismatch")
    for name, expected in expected_optimal.items():
        submitted = submitted_optimal[name]
        if not isinstance(submitted, dict) or set(submitted) != {
            "k", "A_k", "x_k", "C_k_gamma"
        }:
            raise ReplayError(f"optimal remainder {name} malformed")
        _require(submitted["k"], expected["k"], f"optimal remainder {name} order")
        for field in ("A_k", "x_k", "C_k_gamma"):
            _check_enclosure(
                submitted[field], expected[field],
                f"optimal_remainder.{name}.{field}", dps,
            )

    values = interval_section["values"]
    value_targets = interval_targets["values"]
    if not isinstance(values, dict) or set(values) != set(value_targets):
        raise ReplayError("interval target inventory mismatch")
    for name, target in value_targets.items():
        _check_enclosure(values[name], target, f"interval.{name}", dps)
    _require(certificate["checks"], expected_checks, "producer check inventory")

    canonical = (
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n"
    ).encode("utf-8")
    bound_bytes = canonical if producer_bytes is None else producer_bytes
    if bound_bytes != canonical:
        raise ReplayError("producer artifact bytes are not canonical exact serialization")
    parsed = _strict_json_loads(bound_bytes, "producer artifact bytes")
    _require(parsed, payload, "producer artifact bytes")

    return {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "source_lock": binding,
        "inputs": inputs,
        "producer_binding": {
            "sha256": _digest(bound_bytes),
            "byte_length": len(bound_bytes),
        },
        "reconstructed": {
            "exact_fixture_groups": len(exact_groups),
            "transcendental_interval_count": len(value_targets),
            "source_dependency_count": len(binding["dependency_hashes"]),
            "prime_power_count": len(prime_entries),
            "dyadic_layer_count": layer_count,
            "optimal_remainder_orders": [1, 2, 4],
        },
        "checks": {
            "formula_tree_independent": True,
            "producer_module_imported": False,
            "producer_booleans_trusted": False,
            "source_lock_and_dependencies_rehashed": True,
            "producer_bytes_bound": True,
            "all_exact_rational_models_reconstructed": True,
            "prime_powers_independently_detected": True,
            "all_interval_probes_independently_enclosed": True,
            "digamma_special_value_rebuilt_without_digamma_call": True,
            "binary64_parameters_used": False,
            "api_key_or_environment_secret_read": False,
            "physical_feature_angle_claimed": False,
            "physical_exterior_defect_claimed": False,
            "physical_odd_reserve_claimed": False,
            "signed_sector_floor_claimed": False,
            "equation_5_2_claimed": False,
            "determinant_limit_claimed": False,
            "rh_proved": False,
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input)
    raw = _read(input_path, "producer artifact")
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(report, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )


def _precision_bits(dps: int) -> int:
    return (
        dps * _LOG2_10_UPPER_NUMERATOR + _LOG2_10_UPPER_DENOMINATOR - 1
    ) // _LOG2_10_UPPER_DENOMINATOR


def _raw_fraction(raw: Any, label: str) -> Fraction:
    if not isinstance(raw, tuple) or len(raw) != 4:
        raise ReplayError(f"{label} raw endpoint malformed")
    sign, mantissa, exponent, bit_count = raw
    if (
        isinstance(sign, bool) or sign not in (0, 1)
        or isinstance(mantissa, bool) or not isinstance(mantissa, int)
        or isinstance(exponent, bool) or not isinstance(exponent, int)
        or isinstance(bit_count, bool) or not isinstance(bit_count, int)
    ):
        raise ReplayError(f"{label} raw endpoint malformed")
    if mantissa == 0:
        return Fraction(0)
    numerator = -mantissa if sign else mantissa
    return (Fraction(numerator * (1 << exponent)) if exponent >= 0
            else Fraction(numerator, 1 << (-exponent)))


def _fraction_raw(value: Fraction) -> tuple[int, int, int, int]:
    if value == 0:
        return 0, 0, 0, 0
    denominator = value.denominator
    if denominator & (denominator - 1):
        raise ReplayError("submitted interval endpoint is not dyadic")
    sign = int(value < 0)
    mantissa = abs(value.numerator)
    exponent = -(denominator.bit_length() - 1)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return sign, mantissa, exponent, mantissa.bit_length()


def _parse_dyadic(value: Any, label: str, dps: int) -> Fraction:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"{label} must be a four-part dyadic")
    sign, mantissa_text, exponent, bit_count = value
    if isinstance(sign, bool) or sign not in (0, 1):
        raise ReplayError(f"{label} sign is invalid")
    if not isinstance(mantissa_text, str) or _UNSIGNED_INTEGER_TEXT.fullmatch(mantissa_text) is None:
        raise ReplayError(f"{label} mantissa is noncanonical")
    if isinstance(exponent, bool) or not isinstance(exponent, int):
        raise ReplayError(f"{label} exponent is invalid")
    if isinstance(bit_count, bool) or not isinstance(bit_count, int) or bit_count < 0:
        raise ReplayError(f"{label} bit count is invalid")
    mantissa = int(mantissa_text)
    if mantissa == 0:
        if (sign, exponent, bit_count) != (0, 0, 0):
            raise ReplayError(f"{label} zero is noncanonical")
        return Fraction(0)
    if mantissa % 2 == 0 or mantissa.bit_length() != bit_count:
        raise ReplayError(f"{label} dyadic is not normalized")
    bits = _precision_bits(dps)
    if bit_count > 20 * bits + 4096 or abs(exponent) > 20 * bits + 4096:
        raise ReplayError(f"{label} exceeds precision budget")
    numerator = -mantissa if sign else mantissa
    return (Fraction(numerator * (1 << exponent)) if exponent >= 0
            else Fraction(numerator, 1 << (-exponent)))


def _mpf_raw(raw: tuple[int, int, int, int], dps: int) -> Any:
    with mp.workprec(max(_precision_bits(dps) + 64, raw[3] + 16)):
        return +mp.mpf(raw)


def _submitted_interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if (
        not isinstance(decimal, list) or len(decimal) != 2
        or any(not isinstance(item, str) or _DECIMAL_TEXT.fullmatch(item) is None
               for item in decimal)
        or not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}
    ):
        raise ReplayError(f"{label} interval serialization malformed")
    lower = _parse_dyadic(dyadic["lower"], f"{label}.lower", dps)
    upper = _parse_dyadic(dyadic["upper"], f"{label}.upper", dps)
    if lower > upper:
        raise ReplayError(f"{label} interval is reversed")
    with mp.workdps(dps + 20):
        expected_decimal = [
            mp.nstr(_mpf_raw(_fraction_raw(lower), dps), dps + 10),
            mp.nstr(_mpf_raw(_fraction_raw(upper), dps), dps + 10),
        ]
    if decimal != expected_decimal:
        raise ReplayError(f"{label} decimal text does not match dyadics")
    return lower, upper


def _interval_bounds(value: Any, label: str) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    return _raw_fraction(tuple(lower), f"{label}.lower"), _raw_fraction(
        tuple(upper), f"{label}.upper"
    )


def _check_enclosure(submitted: Any, independent: Any, label: str, dps: int) -> None:
    submitted_lower, submitted_upper = _submitted_interval(submitted, label, dps)
    independent_lower, independent_upper = _interval_bounds(independent, label)
    if not submitted_lower <= independent_lower <= independent_upper <= submitted_upper:
        raise ReplayError(f"{label} does not enclose independent replay")
    scale = max(Fraction(1), abs(independent_lower), abs(independent_upper))
    exponent = _precision_bits(dps) - 64
    width_limit = scale * (
        Fraction(1, 1 << exponent) if exponent >= 0 else Fraction(1 << (-exponent))
    )
    if submitted_upper - submitted_lower > width_limit:
        raise ReplayError(f"{label} interval is excessively wide")


if __name__ == "__main__":
    main()
