#!/usr/bin/env python3
"""Produce the intrinsic-feature/dyadic-defect reduction certificate.

The payload contains exact rational regression fixtures and outward
``mpmath.iv`` formula probes.  It proves no physical feature angle, exterior
layer capture, odd directional reserve, sector floor, determinant limit, or
Riemann-hypothesis conclusion.
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


SCHEMA = "xi-prolate-intrinsic-feature-dyadic-defect-v1"
LOCK = "INTRINSIC_FEATURE_DYADIC_DEFECT_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-intrinsic-feature-dyadic-defect-source-lock-v1"
CLAIM_CLASS = "INTRINSIC_FEATURE_DYADIC_DEFECT_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_MPMATH_VERSION = "1.4.1"
EXPECTED_LIBRARY = f"mpmath.iv {EXPECTED_MPMATH_VERSION}"

CANONICAL_LAMBDA_NUMERATORS = {5, 9}
CANONICAL_DPS = {80, 160}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_POSITIVE_INTEGER_TEXT = re.compile(r"^[1-9][0-9]*$")
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

EXPECTED_DEPENDENCIES = {
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

SOURCE_ADMISSIONS = {
    "actual_feature_angle_claimed": False,
    "actual_layer_capture_claimed": False,
    "actual_odd_reserve_claimed": False,
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_matrix_read": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "global_weil_positivity_assumed": False,
    "input_cap_bypassed": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "rank_only_capture_claimed": False,
    "rh_proved": False,
    "runtime_version_mismatch_accepted": False,
    "secret_serialized": False,
    "spectral_endpoint_dropped": False,
    "unit_source_normalization_substituted": False,
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
    if not isinstance(lock["locked_conventions"], dict) or not lock["locked_conventions"]:
        raise ValueError("locked conventions missing")
    if not isinstance(lock["locked_formulas"], dict) or not lock["locked_formulas"]:
        raise ValueError("locked formulas missing")
    boundary = lock["claim_boundary"]
    if (
        not isinstance(boundary, dict)
        or set(boundary) != {"proved", "not_proved"}
        or not isinstance(boundary["proved"], list)
        or not isinstance(boundary["not_proved"], list)
    ):
        raise ValueError("source-lock claim boundary malformed")
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
    return {
        "path": LOCK,
        "sha256": _sha256(path),
        "schema": LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(found.items())),
    }, lock


def _canonical_choice_text(value: Any, label: str, allowed: set[int]) -> tuple[str, int]:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError(f"{label} must be canonical positive integer text")
    choices = ", ".join(str(item) for item in sorted(allowed))
    if value not in {str(item) for item in allowed}:
        raise ValueError(f"{label} must be one of {{{choices}}}")
    return value, int(value)


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


def _diag(values: Vector) -> Matrix:
    return [[value if i == j else Fraction(0) for j in range(len(values))]
            for i, value in enumerate(values)]


def _eye(size: int) -> Matrix:
    return _diag([Fraction(1) for _ in range(size)])


def _transpose(matrix: Matrix) -> Matrix:
    return [list(column) for column in zip(*matrix)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    if not left or not right or len(left[0]) != len(right):
        raise ValueError("matrix dimension mismatch")
    if any(len(row) != len(left[0]) for row in left):
        raise ValueError("ragged left matrix")
    if any(len(row) != len(right[0]) for row in right):
        raise ValueError("ragged right matrix")
    return [[sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
             for j in range(len(right[0]))] for i in range(len(left))]


def _matvec(matrix: Matrix, vector: Vector) -> Vector:
    return [sum((entry * value for entry, value in zip(row, vector)), Fraction(0))
            for row in matrix]


def _add(left: Matrix, right: Matrix) -> Matrix:
    return [[a + b for a, b in zip(lrow, rrow)] for lrow, rrow in zip(left, right)]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    return [[a - b for a, b in zip(lrow, rrow)] for lrow, rrow in zip(left, right)]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _outer(vector: Vector) -> Matrix:
    return [[left * right for right in vector] for left in vector]


def _dot(left: Vector, right: Vector) -> Fraction:
    return sum((a * b for a, b in zip(left, right)), Fraction(0))


def _norm_squared(vector: Vector) -> Fraction:
    return _dot(vector, vector)


def _quadratic(vector: Vector, matrix: Matrix) -> Fraction:
    return _dot(vector, _matvec(matrix, vector))


def _trace(matrix: Matrix) -> Fraction:
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction(0))


def _determinant_2(matrix: Matrix) -> Fraction:
    if len(matrix) != 2 or any(len(row) != 2 for row in matrix):
        raise ValueError("two-dimensional determinant required")
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def _inverse_2(matrix: Matrix) -> Matrix:
    determinant = _determinant_2(matrix)
    if determinant == 0:
        raise ValueError("singular two-dimensional matrix")
    return _scale(Fraction(1, 1) / determinant, [
        [matrix[1][1], -matrix[0][1]],
        [-matrix[1][0], matrix[0][0]],
    ])


def _factorial(value: int) -> int:
    result = 1
    for integer in range(2, value + 1):
        result *= integer
    return result


def _gauge_minimal_tail(p: int) -> dict[str, Any]:
    lam = Fraction(p, 2)
    t = [[Fraction(p, 4), Fraction(0)]]
    b0 = [[Fraction(4, p)], [Fraction(0)]]
    b1 = [[Fraction(4, p)], [Fraction(1)]]
    p_v = [[Fraction(1)]]
    p_f_good = _diag([Fraction(1), Fraction(0)])
    p_f_bad = _diag([Fraction(0), Fraction(1)])
    right_inverse_norms = [
        _norm_squared([row[0] for row in b]) for b in (b0, b1)
    ]
    coarse_right_inverse_norm_squared = 2 * lam**2
    good_tails = [
        _norm_squared(_matvec(_sub(_eye(2), p_f_good), [row[0] for row in b]))
        for b in (b0, b1)
    ]
    exact_minimum = Fraction(16, p * p)
    theorem_lower = Fraction(8, p * p)
    if (
        _matmul(t, b0) != [[Fraction(1)]]
        or _matmul(t, b1) != [[Fraction(1)]]
        or good_tails != [Fraction(0), Fraction(1)]
        or any(value > coarse_right_inverse_norm_squared for value in right_inverse_norms)
        or exact_minimum != Fraction(4, 1) / lam**2
        or theorem_lower != Fraction(2, 1) / lam**2
    ):
        raise ValueError("gauge/minimal-tail fixture failed")
    return {
        "lambda": lam,
        "X_dimension": 1,
        "V_dimension": 1,
        "source_dimension": 2,
        "T": t,
        "P_V": p_v,
        "T_operator_norm_squared": Fraction(p * p, 16),
        "general_T_norm_squared_upper": Fraction(p * p, 8),
        "gauge_right_inverses": {
            "P_F": p_f_good,
            "B_0": b0,
            "B_1": b1,
            "T_B_0": _matmul(t, b0),
            "T_B_1": _matmul(t, b1),
            "right_inverse_norms_squared_B_0_B_1": right_inverse_norms,
            "declared_coarse_norm_squared_upper": coarse_right_inverse_norm_squared,
            "both_right_inverses_obey_coarse_bound": True,
            "P_K": [[Fraction(1)]],
            "P_H": [[Fraction(0)]],
            "alpha_squared": Fraction(0),
            "source_tail_squared_B_0_B_1": good_tails,
            "same_physical_angle_different_source_tails": True,
        },
        "minimal_tail_rank_obstruction": {
            "P_F": p_f_bad,
            "P_K": [[Fraction(0)]],
            "P_H": [[Fraction(1)]],
            "alpha_squared": Fraction(1),
            "minimizing_right_inverse": b0,
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


def _corrected_sparse_identity() -> dict[str, Any]:
    constant = [Fraction(1), Fraction(2), Fraction(3), Fraction(4)]
    selected = [0, 2]
    p_e = _diag([Fraction(1), Fraction(0), Fraction(1), Fraction(0)])
    z = [Fraction(2), Fraction(-1), Fraction(0), Fraction(0)]
    f_direction = [Fraction(3), Fraction(0), Fraction(-1), Fraction(0)]
    p_f = _scale(Fraction(1, 10), _outer(f_direction))
    omitted = _matvec(_sub(_eye(4), p_e), z)
    e = _matvec(_sub(_eye(4), p_e), constant)
    s = _norm_squared(_matvec(p_e, constant))
    raw_tail = _norm_squared(omitted)
    correction_numerator = _dot(e, omitted) ** 2
    correction = correction_numerator / s
    corrected_vector = _matvec(_sub(_eye(4), p_f), z)
    corrected_tail = _norm_squared(corrected_vector)
    if (
        _dot(constant, z) != 0
        or s != 10
        or raw_tail != 1
        or correction_numerator != 4
        or correction != Fraction(2, 5)
        or corrected_tail != Fraction(7, 5)
        or corrected_tail != raw_tail + correction
    ):
        raise ValueError("corrected sparse-tail fixture failed")
    return {
        "orthonormal_constant_coefficients": constant,
        "selected_zero_based_indices": selected,
        "P_E": p_e,
        "s_selected_constant_mass": s,
        "z": z,
        "constant_inner_z": _dot(constant, z),
        "F_direction": f_direction,
        "P_F": p_f,
        "raw_omitted_vector": omitted,
        "omitted_constant_vector": e,
        "raw_omitted_norm_squared": raw_tail,
        "mean_correction_numerator": correction_numerator,
        "mean_correction": correction,
        "corrected_tail_vector": corrected_vector,
        "corrected_tail_squared": corrected_tail,
        "identity_formula": "||(I-P_F)z||^2=||(I-P_E)z||^2+|<e,(I-P_E)z>|^2/s",
        "mean_correction_retained": True,
    }


def _feature_quotient() -> dict[str, Any]:
    u = [Fraction(1), Fraction(0)]
    w = [Fraction(3, 5), Fraction(4, 5)]
    p_k = _outer(w)
    p_h = _sub(_eye(2), p_k)
    gram_u = _norm_squared(u)
    gram_w = _norm_squared(w)
    cross = _dot(u, w)
    minimizer = cross / gram_w
    residual = [u[i] - minimizer * w[i] for i in range(2)]
    residual_squared = _norm_squared(residual)
    alpha_squared = _quadratic(u, p_h) / gram_u
    graph = [Fraction(1), Fraction(4, 3)]
    graph_scaled = [minimizer * entry for entry in graph]
    beta_squared = Fraction(16, 9)
    graph_angle = beta_squared / (1 + beta_squared)
    if (
        gram_u != 1
        or gram_w != 1
        or cross != Fraction(3, 5)
        or minimizer != Fraction(3, 5)
        or residual_squared != Fraction(16, 25)
        or alpha_squared != Fraction(16, 25)
        or graph_scaled != w
        or graph_angle != alpha_squared
    ):
        raise ValueError("feature quotient fixture failed")
    return {
        "U_column": u,
        "W_column": w,
        "G_U_star_U": gram_u,
        "A_W_star_W": gram_w,
        "cross_gram_U_star_W": cross,
        "least_squares_minimizer_y": minimizer,
        "least_squares_residual": residual,
        "least_squares_residual_squared": residual_squared,
        "P_K": p_k,
        "P_H": p_h,
        "intrinsic_alpha_squared": alpha_squared,
        "schur_complement_G_minus_cross_A_dagger_cross": residual_squared,
        "graph_Z": graph,
        "graph_scale_y": minimizer,
        "graph_scale_y_times_Z": graph_scaled,
        "W_equals_y_Z": graph_scaled == w,
        "graph_beta_squared": beta_squared,
        "graph_beta_squared_over_one_plus_beta_squared": graph_angle,
        "cross_gram_retained": True,
        "actual_feature_angle_claimed": False,
    }


def _dyadic_povm() -> dict[str, Any]:
    a1 = _diag([Fraction(1, 4), Fraction(0)])
    a2 = _scale(Fraction(1, 8), [[Fraction(1), Fraction(1)],
                                 [Fraction(1), Fraction(1)]])
    a3 = _sub(_eye(2), _add(a1, a2))
    heights = [Fraction(1), Fraction(3), Fraction(8)]
    d = _add(_add(_scale(heights[0], a1), _scale(heights[1], a2)),
             _scale(heights[2], a3))
    c_1 = _add(a2, a3)
    c_2 = _add(a2, a3)
    c_4 = a3
    majorant = _add(_add(_add(_eye(2), c_1), _scale(Fraction(2), c_2)),
                     _scale(Fraction(4), c_4))
    gap = _sub(majorant, d)
    commutator = _sub(_matmul(c_1, c_4), _matmul(c_4, c_1))

    sigma = Fraction(1, 2)
    endpoint_c = _diag([sigma, Fraction(3, 4)])
    endpoint_p_k = _diag([Fraction(0), Fraction(1)])
    endpoint_p_h = _diag([Fraction(1), Fraction(0)])
    upper_open = endpoint_p_k
    lower_closed = _eye(2)
    sharp_upper = _add(_scale(sigma, _eye(2)),
                       _scale(1 - sigma, upper_open))
    upper_angle_squared = _trace(_matmul(endpoint_p_h, upper_open))
    closed_angle_squared = _trace(_matmul(endpoint_p_h, lower_closed))
    if (
        _add(_add(a1, a2), a3) != _eye(2)
        or gap != a2
        or commutator != [[Fraction(0), Fraction(1, 32)],
                          [Fraction(-1, 32), Fraction(0)]]
        or endpoint_c[0][0] != sigma
        or _sub(sharp_upper, endpoint_c) != _diag([Fraction(0), Fraction(1, 4)])
        or upper_angle_squared != 0
        or closed_angle_squared != 1
    ):
        raise ValueError("dyadic POVM or spectral-endpoint fixture failed")
    return {
        "noncommuting_layer_majorant": {
            "POVM_A_1": a1,
            "POVM_A_2": a2,
            "POVM_A_3": a3,
            "POVM_sum": _add(_add(a1, a2), a3),
            "heights": heights,
            "tau": Fraction(1),
            "A_star": Fraction(8),
            "J": 3,
            "thresholds_s_j": [Fraction(1), Fraction(2), Fraction(4)],
            "coefficients_c_j": [Fraction(1), Fraction(2), Fraction(4)],
            "level_operator_C_1": c_1,
            "level_operator_C_2": c_2,
            "level_operator_C_4": c_4,
            "exact_D": d,
            "dyadic_majorant": majorant,
            "majorant_minus_D": gap,
            "majorant_minus_D_equals_A_2": gap == a2,
            "C_1_C_4_commutator": commutator,
            "level_operators_noncommuting": commutator != _scale(Fraction(0), _eye(2)),
        },
        "spectral_endpoint_rank_obstruction": {
            "C": endpoint_c,
            "sigma": sigma,
            "P_K": endpoint_p_k,
            "P_H": endpoint_p_h,
            "upper_projector_E_open_sigma_1": upper_open,
            "sharp_upper_sigma_I_plus_one_minus_sigma_E": sharp_upper,
            "sharp_upper_minus_C": _sub(sharp_upper, endpoint_c),
            "upper_intrinsic_angle_squared": upper_angle_squared,
            "high_compression_at_sigma": _trace(_matmul(endpoint_p_h, endpoint_c)),
            "lower_projector_F_closed_sigma_1": lower_closed,
            "closed_projector_rank": 2,
            "K_dimension": 1,
            "rank_excess": 1,
            "closed_intrinsic_angle_squared": closed_angle_squared,
            "closed_endpoint_mandatory": True,
        },
        "actual_layer_capture_claimed": False,
    }


def _odd_directional_reserve() -> dict[str, Any]:
    q, h, b = Fraction(3), Fraction(1), Fraction(2)
    gamma = b / q
    r_matrix = _diag([Fraction(0), Fraction(2)])
    m_beta = _diag([q, h])
    defect_operator = _sub(_scale(b, _eye(2)), r_matrix)

    def orientation(label: str, pole: Vector) -> dict[str, Any]:
        rhos = [_quadratic(pole, _diag([Fraction(0) ** j, Fraction(2) ** j]))
                 if j > 0 else _norm_squared(pole) for j in range(5)]
        defect_moments = [
            _quadratic(pole, _diag([Fraction(2) ** j, Fraction(0)]))
            for j in range(1, 5)
        ]
        u_values: list[Fraction] = []
        for k in range(5):
            partial = sum((rhos[j] / q ** (j + 1) for j in range(k)), Fraction(0))
            u_values.append(2 * (partial + rhos[k] / (h * q**k)))
        load = 2 * _quadratic(pole, _inverse_2(m_beta))
        shifted = _sub(m_beta, _scale(Fraction(2), _outer(pole)))
        return {
            "label": label,
            "p": pole,
            "rho_0_through_4": rhos,
            "directional_defect_moments_power_1_through_4": defect_moments,
            "U_0_through_4": u_values,
            "exact_load": load,
            "shifted_odd_matrix": shifted,
            "shifted_odd_determinant": _determinant_2(shifted),
            "strict_pass": shifted[0][0] > 0 and _determinant_2(shifted) > 0,
        }

    good = orientation("good_orientation", [Fraction(1), Fraction(0)])
    bad = orientation("bad_orientation", [Fraction(0), Fraction(1)])

    scalar_r = [[Fraction(1)]]
    scalar_p = [Fraction(1)]
    scalar_load = Fraction(2, 1) / (q - scalar_r[0][0])
    scalar_u1 = 2 * (Fraction(1, 1) / q + scalar_r[0][0] / (h * q))

    base = _eye(2)
    pole = [Fraction(1), Fraction(0)]

    def excess_case(label: str, excess: Matrix) -> dict[str, Any]:
        positive_base = _add(base, excess)
        load = 2 * _quadratic(pole, _inverse_2(positive_base))
        compensated = _sub(positive_base, _scale(Fraction(2), _outer(pole)))
        return {
            "label": label,
            "A_plus": excess,
            "A_plus_trace": _trace(excess),
            "A_plus_determinant": _determinant_2(excess),
            "pole_axis_energy": _quadratic(pole, excess),
            "necessary_axis_rhs": Fraction(1),
            "necessary_axis_inequality": _quadratic(pole, excess) > 1,
            "exact_load": load,
            "compensated_odd_matrix": compensated,
            "compensated_determinant": _determinant_2(compensated),
            "strict_pass": compensated[0][0] > 0 and _determinant_2(compensated) > 0,
        }

    aligned = excess_case("aligned", _diag([Fraction(2), Fraction(0)]))
    oblique_vector = [Fraction(4, 5), Fraction(3, 5)]
    oblique = excess_case("oblique", _scale(Fraction(2), _outer(oblique_vector)))
    transverse = excess_case("transverse", _diag([Fraction(0), Fraction(2)]))
    if (
        good["exact_load"] != Fraction(2, 3)
        or good["U_0_through_4"] != [Fraction(2), Fraction(2, 3), Fraction(2, 3),
                                      Fraction(2, 3), Fraction(2, 3)]
        or not good["strict_pass"]
        or bad["exact_load"] != 2
        or bad["U_0_through_4"] != [Fraction(2) for _ in range(5)]
        or bad["strict_pass"]
        or scalar_load != 1
        or scalar_u1 != Fraction(4, 3)
        or aligned["exact_load"] != Fraction(2, 3)
        or aligned["A_plus_trace"] != 2
        or aligned["A_plus_determinant"] != 0
        or not aligned["strict_pass"]
        or oblique["exact_load"] != Fraction(86, 75)
        or oblique["A_plus_trace"] != 2
        or oblique["A_plus_determinant"] != 0
        or oblique["compensated_determinant"] != Fraction(-11, 25)
        or oblique["strict_pass"]
        or transverse["exact_load"] != 2
        or transverse["A_plus_trace"] != 2
        or transverse["A_plus_determinant"] != 0
        or transverse["strict_pass"]
    ):
        raise ValueError("odd directional/orientation fixture failed")
    return {
        "q": q,
        "h": h,
        "b_q_minus_h": b,
        "gamma": gamma,
        "R": r_matrix,
        "M_beta": m_beta,
        "directional_defect_operator_b_I_minus_R": defect_operator,
        "good_orientation": good,
        "bad_orientation": bad,
        "same_R_spectrum_and_pole_norm": True,
        "scalar_remainder_regression": {
            "q": q,
            "h": h,
            "b": b,
            "gamma": gamma,
            "R_scalar": scalar_r,
            "p": scalar_p,
            "mu_p": Fraction(1),
            "x_R_over_q": Fraction(1, 3),
            "exact_load": scalar_load,
            "U_1": scalar_u1,
            "U_1_minus_load": scalar_u1 - scalar_load,
        },
        "aligned_excess_orientation": {
            "M_beta": base,
            "p": pole,
            "shared_nonzero_spectrum_A_plus": [Fraction(2)],
            "aligned": aligned,
            "oblique": oblique,
            "transverse": transverse,
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


def _prime_power_inventory(p: int) -> list[dict[str, int]]:
    maximum = p * p // 4
    inventory: list[dict[str, int]] = []
    for n in range(2, maximum + 1):
        remaining = n
        prime_base = 0
        exponent = 0
        divisor = 2
        while divisor * divisor <= remaining:
            if remaining % divisor == 0:
                if prime_base != 0 and prime_base != divisor:
                    prime_base = -1
                    break
                prime_base = divisor
                while remaining % divisor == 0:
                    remaining //= divisor
                    exponent += 1
            divisor += 1
        if prime_base == -1:
            continue
        if remaining > 1:
            if prime_base == 0:
                prime_base = remaining
                exponent = 1
                remaining = 1
            elif remaining != prime_base:
                continue
            else:
                exponent += 1
                remaining = 1
        if prime_base > 1 and remaining == 1:
            inventory.append({"n": n, "prime_base": prime_base, "exponent": exponent})
    return inventory


def _precision_bits(dps: int) -> int:
    return (
        dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR
        + 2
    )


def _raw(value: tuple[int, int, int, int]) -> list[object]:
    sign, mantissa, exponent, bits = value
    return [sign, str(mantissa), exponent, bits]


def _raw_fraction(value: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = value
    numerator = -mantissa if sign else mantissa
    return (Fraction(numerator * 2**exponent) if exponent >= 0
            else Fraction(numerator, 2 ** (-exponent)))


def _power_of_two(exponent: int) -> Fraction:
    return Fraction(2**exponent) if exponent >= 0 else Fraction(1, 2 ** (-exponent))


def _normalize_signed_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return 0, 0, 0, 0
    sign = int(value < 0)
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return sign, mantissa, exponent, mantissa.bit_length()


def _shift_raw(
    raw: tuple[int, int, int, int], power: int, direction: int
) -> tuple[int, int, int, int]:
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
        tuple(int(part) for part in lower), tuple(int(part) for part in upper), dps
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


def _iv_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    return (
        _raw_fraction(tuple(int(part) for part in lower)),
        _raw_fraction(tuple(int(part) for part in upper)),
    )


def _ceil_fraction(value: Fraction) -> int:
    return -((-value.numerator) // value.denominator)


def _interval_probes(
    p: int,
    dps: int,
    r: int,
    inventory: list[dict[str, int]],
) -> dict[str, Any]:
    mp.iv.dps = dps
    lam = mp.iv.mpf(p) / 2
    length = 2 * mp.iv.log(lam)
    sigma_lambda = mp.iv.mpf(0)
    for item in inventory:
        sigma_lambda += (
            mp.iv.log(mp.iv.mpf(item["prime_base"]))
            / mp.iv.sqrt(mp.iv.mpf(item["n"]))
        )
    c_0 = (
        -mp.iv.euler - mp.iv.pi / 2 - 3 * mp.iv.log(2)
        - mp.iv.log(mp.iv.pi)
    )
    nu = mp.iv.mpf(1)
    shift_u = mp.iv.mpf(0)
    delta = mp.iv.mpf(1)
    spectral_sigma = mp.iv.mpf(1) / 2
    tau = length / 4
    a_raw = shift_u + nu * length + 2 * sigma_lambda - c_0
    a_lo, _a_hi = _iv_bounds(a_raw)
    if a_lo <= 0:
        raise ArithmeticError("canonical A_star positivity was not certified")
    a_star = a_raw
    support_radius = mp.iv.sqrt(mp.iv.exp(2 * a_star) - 1) / 2
    layer_log = mp.iv.log(a_star / tau) / mp.iv.log(2)
    layer_lo, layer_hi = _iv_bounds(layer_log)
    j_lo, j_hi = _ceil_fraction(layer_lo), _ceil_fraction(layer_hi)
    if j_lo != j_hi or j_lo <= 0:
        raise ArithmeticError("dyadic layer count straddles an integer boundary")
    layer_count = j_lo
    layer_coefficients: list[dict[str, Any]] = []
    for j in range(layer_count):
        threshold = (2**j) * tau
        next_threshold = (2 ** (j + 1)) * tau
        if j < layer_count - 1:
            separation_lo, _ = _iv_bounds(a_star - next_threshold)
            if separation_lo <= 0:
                raise ArithmeticError("interior dyadic coefficient branch unresolved")
            coefficient = threshold
            branch = "2^j*tau"
        else:
            coefficient = a_star - threshold
            coefficient_lo, _ = _iv_bounds(coefficient)
            _, terminal_hi = _iv_bounds(a_star - next_threshold)
            if coefficient_lo <= 0 or terminal_hi > 0:
                raise ArithmeticError("terminal dyadic coefficient branch unresolved")
            branch = "A_star-2^j*tau"
        layer_coefficients.append({
            "j": j,
            "threshold_s_j": _serialize_interval(threshold, dps),
            "coefficient_c_j": _serialize_interval(coefficient, dps),
            "certified_min_branch": branch,
        })

    half_length = length / 2
    pole_norm_squared = (
        (mp.iv.exp(half_length) - mp.iv.exp(-half_length)) / 2
        - half_length
    )
    factorial = mp.iv.mpf(_factorial(r))
    odd_taylor_tail_squared = (
        length * lam * (length / 4) ** (2 * r)
        / ((2 * r + 1) * factorial**2)
    )

    gamma = mp.iv.mpf(2) / 3
    optimal: dict[str, Any] = {}
    for k in (1, 2, 4):
        a_k = (k + 1) + (k - 1) * gamma
        x_k = (a_k - mp.iv.sqrt(a_k**2 - 4 * k * k * gamma)) / (2 * k)
        c_k = x_k**k * (gamma - x_k) / (1 - x_k)
        optimal[f"k_{k}"] = {
            "k": k,
            "A_k": _serialize_interval(a_k, dps),
            "x_k": _serialize_interval(x_k, dps),
            "C_k_gamma": _serialize_interval(c_k, dps),
        }

    values = {
        "lambda": lam,
        "physical_length_L": length,
        "inclusive_prime_power_Sigma_lambda": sigma_lambda,
        "archimedean_c_0": c_0,
        "A_star": a_star,
        "support_radius": support_radius,
        "tau_L_over_4": tau,
        "delta": delta,
        "spectral_sigma": spectral_sigma,
        "A_star_over_tau_log2": layer_log,
        "odd_pole_norm_squared_S_L": pole_norm_squared,
        "odd_pole_taylor_tail_squared_upper": odd_taylor_tail_squared,
        "gamma": gamma,
        "C_0_gamma": gamma,
    }
    return {
        "formula_scale_regression_only": True,
        "nu_text": "1",
        "U_text": "0",
        "tau_rule": "L/4",
        "delta_text": "1",
        "spectral_sigma_text": "1/2",
        "r_exact_integer": r,
        "r_rule": "3*bit_length(lambda_numerator)",
        "dyadic_layer_count_J": layer_count,
        "dyadic_layer_coefficients": layer_coefficients,
        "optimal_remainder_constants_gamma_two_thirds": optimal,
        "strict_threshold_supplied": False,
        "actual_angle_layer_or_odd_reserve_claimed": False,
        "values": {key: _serialize_interval(value, dps) for key, value in values.items()},
    }


def _validate_admissions() -> None:
    if any(SOURCE_ADMISSIONS.values()):
        raise ValueError("a forbidden source admission was enabled")


def produce(lambda_numerator_text: str, dps_text: str) -> dict[str, Any]:
    p_text, p = _canonical_choice_text(
        lambda_numerator_text, "lambda numerator", CANONICAL_LAMBDA_NUMERATORS
    )
    precision_text, precision = _canonical_choice_text(dps_text, "dps", CANONICAL_DPS)
    r = 3 * p.bit_length()
    _validate_admissions()
    _validate_runtime()
    source_binding, source_lock = _validated_source_lock()

    gauge = _gauge_minimal_tail(p)
    sparse = _corrected_sparse_identity()
    feature = _feature_quotient()
    dyadic = _dyadic_povm()
    odd = _odd_directional_reserve()
    inventory = _prime_power_inventory(p)
    intervals = _interval_probes(p, precision, r, inventory)
    expected_inventory = {
        5: [2, 3, 4, 5],
        9: [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19],
    }
    if [item["n"] for item in inventory] != expected_inventory[p]:
        raise ValueError("inclusive prime-power inventory regression failed")

    checks = {
        "right_inverse_gauge_changes_tail_not_angle": gauge["gauge_right_inverses"]["same_physical_angle_different_source_tails"],
        "minimal_tail_rank_obstruction_exact": gauge["minimal_tail_rank_obstruction"]["exact_over_general_lower_ratio"] == 2,
        "sparse_mean_correction_retained": sparse["mean_correction_retained"],
        "sparse_corrected_tail_exact": sparse["corrected_tail_squared"] == Fraction(7, 5),
        "feature_cross_gram_angle_exact": feature["intrinsic_alpha_squared"] == Fraction(16, 25),
        "feature_graph_angle_exact": feature["graph_beta_squared_over_one_plus_beta_squared"] == Fraction(16, 25),
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
        "interval_probe_not_promoted": not intervals["actual_angle_layer_or_odd_reserve_claimed"],
        "strict_threshold_absent": not intervals["strict_threshold_supplied"],
    }
    if not all(checks.values()):
        raise ValueError("intrinsic-feature/dyadic-defect audit check failed")

    payload = _encode({
        "schema": SCHEMA,
        "source_lock": source_binding,
        "inputs": {
            "lambda_numerator_text": p_text,
            "lambda_denominator_text": "2",
            "dps_text": precision_text,
            "r_exact_integer": r,
            "r_rule": "3*bit_length(lambda_numerator)",
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
            "gauge_minimal_tail": gauge,
            "corrected_sparse_identity": sparse,
            "feature_quotient": feature,
            "dyadic_povm": dyadic,
            "odd_directional_reserve": odd,
            "inclusive_prime_powers": {
                "lambda_squared_numerator": str(p * p),
                "lambda_squared_denominator": "4",
                "maximum_integer_n": p * p // 4,
                "endpoint_rule": "include every prime power n with 4*n<=p^2",
                "inventory": inventory,
                "combined_multiplier": "m_lambda(t)=2*theta'(t)-2*sum_(1<n<=lambda^2) Lambda(n)/sqrt(n)*cos(t*log(n))",
                "prime_block_sign": "minus",
                "individual_prime_blocks_absolutized_in_level_sets": False,
            },
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
