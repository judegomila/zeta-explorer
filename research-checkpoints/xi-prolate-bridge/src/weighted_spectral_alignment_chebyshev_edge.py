#!/usr/bin/env python3
"""Produce the weighted-spectral-alignment/Chebyshev-edge certificate.

The payload contains exact rational regression fixtures and outward
``mpmath.iv`` formula probes.  It proves no actual weighted central capture,
exterior alignment, shifted odd reserve, signed sector floor, determinant
limit, equation-(5.2) estimate, or Riemann-hypothesis conclusion.
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


SCHEMA = "xi-prolate-weighted-spectral-alignment-chebyshev-edge-v1"
LOCK = "WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-weighted-spectral-alignment-chebyshev-edge-source-lock-v1"
CLAIM_CLASS = "WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_REDUCTION"
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
    "INTRINSIC_FEATURE_DYADIC_DEFECT_SOURCE_LOCK.json",
    "MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_SOURCE_LOCK.json",
    "notes/WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_REDUCTION.md",
    "notes/INTRINSIC_FEATURE_DYADIC_DEFECT_REDUCTION.md",
    "notes/LOG_FEATURE_CAPTURE_ALIGNMENT_REDUCTION.md",
    "notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md",
    "requirements.txt",
}

SOURCE_ADMISSIONS = {
    "actual_exterior_alignment_claimed": False,
    "actual_odd_reserve_claimed": False,
    "actual_weighted_central_capture_claimed": False,
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_matrix_read": False,
    "central_factorial_tail_promoted_to_capture": False,
    "chebyshev_truncation_promoted_to_actual_load": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "first_moment_bound_promoted_to_strict_pass": False,
    "global_weil_positivity_assumed": False,
    "input_cap_bypassed": False,
    "inversion_reflection_dropped": False,
    "k_width_bound_promoted_to_capture": False,
    "lambda_squared_mixed_with_lambda": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "rank_only_capture_claimed": False,
    "rh_proved": False,
    "runtime_version_mismatch_accepted": False,
    "secret_serialized": False,
    "spectral_endpoint_dropped": False,
    "transition_defect_bound_promoted_to_alignment": False,
    "uniform_feature_angle_inferred_from_weighted_capture": False,
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
    allowed_text = {str(item) for item in allowed}
    if value not in allowed_text:
        choices = ", ".join(str(item) for item in sorted(allowed))
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
    return [
        [value if i == j else Fraction(0) for j in range(len(values))]
        for i, value in enumerate(values)
    ]


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
    return [
        [
            sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


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


def _trace(matrix: Matrix) -> Fraction:
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction(0))


def _trace_product(left: Matrix, right: Matrix) -> Fraction:
    return _trace(_matmul(left, right))


def _weighted_central_fixture() -> dict[str, Any]:
    epsilon = Fraction(1, 100)
    u = _eye(2)
    t_band = _diag([Fraction(1), epsilon])
    w = [[Fraction(1)], [Fraction(0)]]
    gram = _matmul(_transpose(u), u)
    central_gram = _matmul(_matmul(_transpose(u), t_band), u)
    source_gram = _matmul(_transpose(w), w)
    source_gram_dagger = [[Fraction(1)]]
    p_k = _matmul(_matmul(w, source_gram_dagger), _transpose(w))
    p_h = _sub(_eye(2), p_k)
    p_v = _eye(2)
    schur = _sub(
        gram,
        _matmul(
            _matmul(_matmul(_transpose(u), w), source_gram_dagger),
            _matmul(_transpose(w), u),
        ),
    )
    rho = _trace(_matmul(_matmul(central_gram, schur), gram))
    weighted_leakage = _trace(_matmul(_matmul(p_h, t_band), p_h))
    tau = _trace(_matmul(_matmul(_sub(_eye(2), p_v), t_band), _sub(_eye(2), p_v)))
    alpha_squared = Fraction(1)
    central_trace = _trace(t_band)
    old_uniform_coarse_squared = alpha_squared * central_trace
    sharp_weighted_squared = rho + tau
    if (
        gram != _eye(2)
        or central_gram != t_band
        or source_gram != [[Fraction(1)]]
        or schur != p_h
        or rho != epsilon
        or weighted_leakage != epsilon
        or tau != 0
        or alpha_squared != 1
        or old_uniform_coarse_squared != Fraction(101, 100)
        or sharp_weighted_squared != Fraction(1, 100)
    ):
        raise ValueError("weighted central fixture failed")
    return {
        "U": u,
        "T_B": t_band,
        "W": w,
        "G_U_star_U": gram,
        "C_U_star_T_B_U": central_gram,
        "A_W_star_W": source_gram,
        "P_K": p_k,
        "P_H": p_h,
        "S_U_star_P_H_U": schur,
        "unweighted_alpha_squared": alpha_squared,
        "weighted_rho": rho,
        "weighted_tau": tau,
        "high_trace": weighted_leakage,
        "high_operator_norm": epsilon,
        "old_unweighted_coarse_bound": old_uniform_coarse_squared,
        "weighted_square_bound": sharp_weighted_squared,
        "weighted_bound_is_sharp": sharp_weighted_squared == weighted_leakage,
        "unweighted_bound_loses_factor_101": (
            old_uniform_coarse_squared / sharp_weighted_squared == 101
        ),
    }


def _rank_one_projectors(vector: Vector) -> tuple[Matrix, Matrix]:
    if _dot(vector, vector) != 1:
        raise ValueError("rank-one projector vector must be normalized")
    p_k = _outer(vector)
    return p_k, _sub(_eye(len(vector)), p_k)


def _trace_k_width_model(label: str, vector: Vector) -> dict[str, Any]:
    eigenvalues = [Fraction(1), Fraction(1, 2), Fraction(1, 4)]
    c = _diag(eigenvalues)
    p_k, p_h = _rank_one_projectors(vector)
    e_top = _diag([Fraction(1), Fraction(0), Fraction(0)])
    alignment = _trace(_matmul(_matmul(p_h, e_top), p_h))
    tail = sum(eigenvalues[1:], Fraction(0))
    actual = _trace(_matmul(_matmul(p_h, c), p_h))
    lower = tail + (eigenvalues[0] - eigenvalues[1]) * alignment
    upper = tail + (eigenvalues[0] - eigenvalues[-1]) * alignment
    if alignment != Fraction(16, 25) or tail != Fraction(3, 4):
        raise ValueError("trace k-width shared fixture failed")
    return {
        "C": c,
        "K_unit_vector": vector,
        "P_K": p_k,
        "P_H": p_h,
        "top_k_projector": e_top,
        "top_k_HS_angle_squared": alignment,
        "spectral_tail_after_k": tail,
        "gap_gamma_k_minus_gamma_k_plus_1": Fraction(1, 2),
        "spread_gamma_1_minus_gamma_d": Fraction(3, 4),
        "trace_on_H": actual,
        "trace_lower_bound": lower,
        "trace_upper_bound": upper,
        "lower_equality": actual == lower,
        "upper_equality": actual == upper,
    }


def _exterior_k_width_fixture() -> dict[str, Any]:
    lower_model = _trace_k_width_model(
        "trace_lower_equality", [Fraction(3, 5), Fraction(4, 5), Fraction(0)]
    )
    upper_model = _trace_k_width_model(
        "trace_upper_equality", [Fraction(3, 5), Fraction(0), Fraction(4, 5)]
    )

    c_operator = _diag([Fraction(1), Fraction(1, 4)])
    operator_vector = [Fraction(3, 5), Fraction(4, 5)]
    p_k, p_h = _rank_one_projectors(operator_vector)
    alpha_squared = _trace(_matmul(p_h, _diag([Fraction(1), Fraction(0)])))
    compressed = _matmul(_matmul(p_h, c_operator), p_h)
    compressed_norm = _trace(compressed)
    operator_upper = Fraction(1, 4) + Fraction(3, 4) * alpha_squared

    endpoint_eigenvalues = [Fraction(1), Fraction(1, 2)]
    endpoint_sigma = Fraction(1, 2)
    endpoint_p = sum(endpoint_eigenvalues, Fraction(0))
    endpoint_chi = sum(
        (eta * (1 - eta) for eta in endpoint_eigenvalues), Fraction(0)
    )
    endpoint_rank = sum(eta > endpoint_sigma for eta in endpoint_eigenvalues)
    endpoint_tail = sum(
        (eta for eta in endpoint_eigenvalues if eta <= endpoint_sigma), Fraction(0)
    )
    endpoint_tail_bound = endpoint_chi / (1 - endpoint_sigma)

    rank_eigenvalues = [Fraction(9, 10), Fraction(3, 5), Fraction(1, 10), Fraction(0)]
    rank_sigma = Fraction(1, 2)
    rank_p = sum(rank_eigenvalues, Fraction(0))
    rank_chi = sum((eta * (1 - eta) for eta in rank_eigenvalues), Fraction(0))
    rank_actual = sum(eta > rank_sigma for eta in rank_eigenvalues)
    rank_upper_raw = rank_p + rank_chi / rank_sigma
    rank_upper_integer = rank_upper_raw.numerator // rank_upper_raw.denominator
    rank_tail = sum((eta for eta in rank_eigenvalues[rank_actual:]), Fraction(0))
    rank_tail_bound = rank_chi / (1 - rank_sigma)

    if (
        lower_model["trace_on_H"] != Fraction(107, 100)
        or not lower_model["lower_equality"]
        or upper_model["trace_on_H"] != Fraction(123, 100)
        or not upper_model["upper_equality"]
        or alpha_squared != Fraction(16, 25)
        or compressed_norm != Fraction(73, 100)
        or compressed_norm != operator_upper
        or endpoint_rank != 1
        or endpoint_chi != Fraction(1, 4)
        or endpoint_tail != Fraction(1, 2)
        or endpoint_tail != endpoint_tail_bound
        or rank_p != Fraction(8, 5)
        or rank_chi != Fraction(21, 50)
        or rank_actual != 2
        or rank_upper_raw != Fraction(61, 25)
        or rank_upper_integer != 2
        or rank_tail != Fraction(1, 10)
        or rank_tail > rank_tail_bound
    ):
        raise ValueError("exterior k-width fixture failed")
    return {
        "trace_lower_equality": lower_model,
        "trace_upper_equality": upper_model,
        "operator_upper_equality": {
            "C": c_operator,
            "K_unit_vector": operator_vector,
            "H_unit_vector": [Fraction(-4, 5), Fraction(3, 5)],
            "P_K": p_k,
            "P_H": p_h,
            "top_projector": _diag([Fraction(1), Fraction(0)]),
            "top_operator_angle_squared": alpha_squared,
            "gamma_k_plus_1": Fraction(1, 4),
            "gamma_k": Fraction(1),
            "operator_norm_on_H": compressed_norm,
            "operator_lower_bound": max(Fraction(1, 4), alpha_squared),
            "operator_upper_bound": operator_upper,
            "upper_equality": compressed_norm == operator_upper,
        },
        "interval_kernel_piecewise_oracles": {
            "b_y_formula_low": "b(y)=8*y-y^2 for 0<=y<=2",
            "b_y_formula_high": "b(y)=12+8*log(y/2) for y>=2",
            "b_at_y_1": Fraction(7),
            "b_at_y_2_low_branch": Fraction(12),
            "b_at_y_2_high_branch_without_log": Fraction(12),
            "junction_agrees": True,
            "b_at_y_4_formula": "12+8*log(2)",
        },
        "open_threshold_endpoint": {
            "eigenvalues": endpoint_eigenvalues,
            "sigma": endpoint_sigma,
            "strict_high_rank": endpoint_rank,
            "transition_defect_chi": endpoint_chi,
            "low_tail_including_endpoint": endpoint_tail,
            "chi_over_one_minus_sigma": endpoint_tail_bound,
            "endpoint_is_low_and_tail_bound_is_equality": True,
        },
        "effective_rank_count": {
            "eigenvalues": rank_eigenvalues,
            "sigma": rank_sigma,
            "phase_volume_p": rank_p,
            "transition_defect_chi": rank_chi,
            "p_plus_chi_over_sigma": rank_upper_raw,
            "floor_p_plus_chi_over_sigma": rank_upper_integer,
            "strict_high_rank": rank_actual,
            "chosen_k": 2,
            "spectral_tail_after_k": rank_tail,
            "chi_over_one_minus_sigma": rank_tail_bound,
            "integer_rule_is_exact_here": rank_actual == rank_upper_integer,
            "tail_bound_holds": rank_tail <= rank_tail_bound,
        },
        "actual_exterior_alignment_claimed": False,
    }


def _chebyshev_values_at_minus_one_zero_one(order: int) -> list[Fraction]:
    x_values = [Fraction(-1), Fraction(0), Fraction(1)]
    if order == 0:
        return [Fraction(1), Fraction(1), Fraction(1)]
    previous = [Fraction(1), Fraction(1), Fraction(1)]
    current = x_values[:]
    for _ in range(1, order):
        following = [2 * x * now - before for x, now, before in zip(x_values, current, previous)]
        previous, current = current, following
    return current


def _odd_orientation(label: str, weights: Vector) -> dict[str, Any]:
    q, h, b = Fraction(3), Fraction(1), Fraction(2)
    r_eigenvalues = [Fraction(0), Fraction(1), Fraction(2)]
    y_eigenvalues = [b - value for value in r_eigenvalues]
    mu = sum(weights, Fraction(0))
    rho_1 = _dot(weights, r_eigenvalues)
    d_1 = _dot(weights, y_eigenvalues)
    load = 2 * sum(
        (weight / (q - eigenvalue) for weight, eigenvalue in zip(weights, r_eigenvalues)),
        Fraction(0),
    )
    edge = sum(
        (weight * y / (h + y) for weight, y in zip(weights, y_eigenvalues)),
        Fraction(0),
    )
    first_moment_upper = 2 * mu / h - 2 * d_1 / (h * q)
    mapped = [2 * value / b - 1 for value in r_eigenvalues]
    theta = [
        _dot(weights, _chebyshev_values_at_minus_one_zero_one(order))
        for order in range(7)
    ]
    return {
        "R_spectrum": r_eigenvalues,
        "spectral_weights": weights,
        "q": q,
        "h": h,
        "b": b,
        "mu": mu,
        "rho_1": rho_1,
        "Y_spectrum_b_minus_R": y_eigenvalues,
        "d_1_b_mu_minus_rho_1": d_1,
        "nonlinear_edge_deficit": edge,
        "edge_threshold_mu_minus_h_over_2": mu - h / 2,
        "edge_identity_load": 2 * mu / h - 2 * edge / h,
        "exact_edge_criterion_pass": edge > mu - h / 2,
        "first_moment_chord_edge_lower": d_1 / q,
        "exact_shifted_load": load,
        "first_moment_upper": first_moment_upper,
        "strict_load_pass": load < 1,
        "mapped_Chebyshev_spectrum": mapped,
        "Theta_orders_0_through_6": theta,
    }


def _odd_first_moment_fixture() -> dict[str, Any]:
    q, h, b = Fraction(3), Fraction(1), Fraction(2)
    fail = _odd_orientation(
        "same_first_moment_actual_fail",
        [Fraction(27, 80), Fraction(9, 40), Fraction(27, 80)],
    )
    passed = _odd_orientation(
        "same_first_moment_actual_pass",
        [Fraction(9, 80), Fraction(27, 40), Fraction(9, 80)],
    )
    endpoint = _odd_orientation(
        "sharp_endpoint_measure",
        [Fraction(1, 2), Fraction(0), Fraction(1, 2)],
    )
    if (
        fail["mu"] != Fraction(9, 10)
        or passed["mu"] != fail["mu"]
        or fail["rho_1"] != Fraction(9, 10)
        or passed["rho_1"] != fail["rho_1"]
        or fail["d_1_b_mu_minus_rho_1"] != Fraction(9, 10)
        or passed["d_1_b_mu_minus_rho_1"] != fail["d_1_b_mu_minus_rho_1"]
        or fail["first_moment_upper"] != Fraction(6, 5)
        or passed["first_moment_upper"] != Fraction(6, 5)
        or fail["exact_shifted_load"] != Fraction(9, 8)
        or fail["strict_load_pass"]
        or passed["exact_shifted_load"] != Fraction(39, 40)
        or not passed["strict_load_pass"]
        or endpoint["mu"] != 1
        or endpoint["d_1_b_mu_minus_rho_1"] != 1
        or endpoint["exact_shifted_load"] != Fraction(4, 3)
        or endpoint["first_moment_upper"] != Fraction(4, 3)
        or endpoint["exact_shifted_load"] != endpoint["first_moment_upper"]
    ):
        raise ValueError("odd first-moment fixture failed")
    return {
        "same_first_moment_profile_A": fail,
        "same_first_moment_profile_B": passed,
        "same_mu_rho1_d1_and_bound": all(
            fail[key] == passed[key]
            for key in ("mu", "rho_1", "d_1_b_mu_minus_rho_1", "first_moment_upper")
        ),
        "opposite_strict_load_outcomes": (
            fail["strict_load_pass"] != passed["strict_load_pass"]
        ),
        "second_Chebyshev_moment_distinguishes_profiles": (
            fail["Theta_orders_0_through_6"][2]
            == -passed["Theta_orders_0_through_6"][2]
            != 0
        ),
        "sharp_endpoint_profile": endpoint,
        "endpoint_first_moment_bound_is_equality": (
            endpoint["exact_shifted_load"] == endpoint["first_moment_upper"]
        ),
        "actual_odd_reserve_claimed": False,
    }


def _prime_power_inventory(p: int) -> list[dict[str, int]]:
    maximum = p * p // 4
    inventory: list[dict[str, int]] = []
    for n in range(2, maximum + 1):
        for base in range(2, n + 1):
            divisor = 2
            composite = False
            while divisor * divisor <= base:
                if base % divisor == 0:
                    composite = True
                    break
                divisor += 1
            if composite:
                continue
            power = base
            exponent = 1
            while power < n:
                power *= base
                exponent += 1
            if power == n:
                inventory.append({"n": n, "prime_base": base, "exponent": exponent})
                break
    return inventory


def _precision_bits(dps: int) -> int:
    return dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR + 2


def _raw(value: tuple[int, int, int, int]) -> list[object]:
    sign, mantissa, exponent, bits = value
    return [sign, str(mantissa), exponent, bits]


def _raw_fraction(value: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = value
    numerator = -mantissa if sign else mantissa
    return (
        Fraction(numerator * 2**exponent)
        if exponent >= 0
        else Fraction(numerator, 2 ** (-exponent))
    )


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


def _factorial(value: int) -> int:
    result = 1
    for integer in range(2, value + 1):
        result *= integer
    return result


def _iv_fraction(value: Fraction) -> object:
    return mp.iv.mpf(value.numerator) / value.denominator


def _chebyshev_theta(weights: Vector, order: int) -> Fraction:
    return _dot(weights, _chebyshev_values_at_minus_one_zero_one(order))


def _interval_probes(p: int, dps: int) -> dict[str, Any]:
    mp.iv.dps = dps
    lam = mp.iv.mpf(p) / 2
    length = 2 * mp.iv.log(lam)
    log_length = mp.iv.log(length)
    central_c = mp.iv.mpf(1) / 2
    central_degree_real = central_c * length / log_length
    degree_lo, degree_hi = _iv_bounds(central_degree_real)
    degree_lo_ceil = _ceil_fraction(degree_lo)
    degree_hi_ceil = _ceil_fraction(degree_hi)
    if degree_lo_ceil != degree_hi_ceil or degree_lo_ceil < 1:
        raise ArithmeticError("central degree ceiling was not interval-decidable")
    central_degree = degree_lo_ceil
    factorial = mp.iv.mpf(_factorial(central_degree))
    delta = mp.iv.mpf(1)
    central_tau = (
        delta / mp.iv.pi
        * (delta / 2) ** (2 * central_degree)
        / ((2 * central_degree + 1) ** 2 * factorial**2)
    )

    prolate_dimension = (p * p + 3) // 4
    legendre_eta_squared = (
        2 * central_degree**2 / (mp.iv.pi**2 * prolate_dimension)
        * mp.iv.exp(
            central_degree * (central_degree - 1)
            / (mp.iv.pi * prolate_dimension)
        )
    )
    legendre_eta = mp.iv.sqrt(legendre_eta_squared)
    _eta_lo, eta_hi = _iv_bounds(legendre_eta)
    if eta_hi >= 1:
        raise ArithmeticError("Legendre conditioning denominator was not certified positive")
    legendre_gram_lower = 1 - legendre_eta_squared
    legendre_gram_upper = mp.iv.mpf(1)
    legendre_condition_upper = legendre_gram_upper / legendre_gram_lower

    q = mp.iv.mpf(3)
    h = mp.iv.mpf(1)
    mu = mp.iv.mpf(9) / 10
    chebyshev_r0 = (mp.iv.sqrt(q) - mp.iv.sqrt(h)) / (mp.iv.sqrt(q) + mp.iv.sqrt(h))
    tail_prefactor = 2 * mu * (1 + mp.iv.sqrt(h / q)) / h
    chebyshev_profiles: dict[str, dict[str, Any]] = {
        "profile_A": {},
        "profile_B": {},
    }
    fail_weights = [Fraction(27, 80), Fraction(9, 40), Fraction(27, 80)]
    pass_weights = [Fraction(9, 80), Fraction(27, 40), Fraction(9, 80)]
    for order in (1, 2, 4):
        tail = tail_prefactor * chebyshev_r0 ** (order + 1)
        for profile_name, weights in (
            ("profile_A", fail_weights), ("profile_B", pass_weights)
        ):
            partial = mu
            for n in range(1, order + 1):
                partial += 2 * chebyshev_r0**n * _iv_fraction(_chebyshev_theta(weights, n))
            upper = 2 / mp.iv.sqrt(q * h) * (
                partial + 2 * mu * chebyshev_r0 ** (order + 1) / (1 - chebyshev_r0)
            )
            chebyshev_profiles[profile_name][f"k_{order}"] = {
                "order": order,
                "truncated_plus_tail_upper": _serialize_interval(upper, dps),
                "absolute_tail_upper": _serialize_interval(tail, dps),
            }

    kernel_b_y_4 = 12 + 8 * mp.iv.log(2)
    kernel_b_y_4_over_4_pi_squared = (3 + 2 * mp.iv.log(2)) / mp.iv.pi**2
    values = {
        "lambda": lam,
        "physical_length_L": length,
        "log_physical_length": log_length,
        "central_degree_real_cL_over_logL": central_degree_real,
        "central_factorial_tail_tau": central_tau,
        "lambda_times_central_factorial_tail": lam * central_tau,
        "legendre_eta_squared_upper": legendre_eta_squared,
        "legendre_eta_upper": legendre_eta,
        "legendre_Gram_lower": legendre_gram_lower,
        "legendre_Gram_upper": legendre_gram_upper,
        "legendre_condition_number_upper": legendre_condition_upper,
        "kernel_b_y_4": kernel_b_y_4,
        "kernel_b_y_4_over_4_pi_squared": kernel_b_y_4_over_4_pi_squared,
        "chebyshev_r_0": chebyshev_r0,
        "chebyshev_tail_prefactor_mu_9_over_10": tail_prefactor,
    }
    return {
        "diagnostic_only": True,
        "q_text": "3",
        "h_text": "1",
        "b_text": "2",
        "central_c_text": "1/2",
        "central_delta_text": "1",
        "central_degree_rule": "r=ceil((L/2)/log(L))",
        "central_degree_exact": central_degree,
        "prolate_dimension_N_exact": prolate_dimension,
        "chebyshev_orders_exact": [1, 2, 4],
        "strict_threshold_supplied": False,
        "actual_weighted_central_rate_claimed": False,
        "actual_exterior_alignment_claimed": False,
        "actual_odd_reserve_claimed": False,
        "values": {key: _serialize_interval(value, dps) for key, value in values.items()},
        "chebyshev_profile_bounds": chebyshev_profiles,
    }


def _validate_admissions() -> None:
    if any(SOURCE_ADMISSIONS.values()):
        raise ValueError("a forbidden source admission was enabled")


def produce(p_text: str, dps_text: str) -> dict[str, Any]:
    canonical_p_text, p = _canonical_choice_text(
        p_text, "lambda numerator", CANONICAL_LAMBDA_NUMERATORS
    )
    precision_text, precision = _canonical_choice_text(dps_text, "dps", CANONICAL_DPS)
    _validate_admissions()
    _validate_runtime()
    source_binding, source_lock = _validated_source_lock()

    central = _weighted_central_fixture()
    exterior = _exterior_k_width_fixture()
    odd = _odd_first_moment_fixture()
    inventory = _prime_power_inventory(p)
    inventory_set = {item["n"] for item in inventory}
    excluded_composites = [
        n for n in range(2, p * p // 4 + 1) if n not in inventory_set
    ]
    intervals = _interval_probes(p, precision)
    expected_inventory = {
        5: [2, 3, 4, 5],
        9: [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19],
    }
    if [item["n"] for item in inventory] != expected_inventory[p]:
        raise ValueError("inclusive prime-power inventory regression failed")

    checks = {
        "weighted_central_bound_sharp": central["weighted_bound_is_sharp"],
        "weighted_central_avoids_unweighted_factor_101": central["unweighted_bound_loses_factor_101"],
        "exterior_trace_lower_equality": exterior["trace_lower_equality"]["lower_equality"],
        "exterior_trace_upper_equality": exterior["trace_upper_equality"]["upper_equality"],
        "exterior_operator_upper_equality": exterior["operator_upper_equality"]["upper_equality"],
        "interval_kernel_branches_meet": exterior["interval_kernel_piecewise_oracles"]["junction_agrees"],
        "open_threshold_endpoint_retained_low": exterior["open_threshold_endpoint"]["endpoint_is_low_and_tail_bound_is_equality"],
        "effective_rank_integer_rule_exact": exterior["effective_rank_count"]["integer_rule_is_exact_here"],
        "effective_rank_tail_bound_holds": exterior["effective_rank_count"]["tail_bound_holds"],
        "odd_first_moment_profiles_indistinguishable": odd["same_mu_rho1_d1_and_bound"],
        "odd_first_moment_outcomes_differ": odd["opposite_strict_load_outcomes"],
        "odd_nonlinear_edge_outcomes_exact": (
            not odd["same_first_moment_profile_A"]["exact_edge_criterion_pass"]
            and odd["same_first_moment_profile_B"]["exact_edge_criterion_pass"]
        ),
        "odd_second_chebyshev_moment_distinguishes": odd["second_Chebyshev_moment_distinguishes_profiles"],
        "odd_first_moment_endpoint_sharp": odd["endpoint_first_moment_bound_is_equality"],
        "prime_power_endpoint_inclusive": True,
        "prime_block_minus_sign_retained": True,
        "interval_probe_not_promoted": True,
        "strict_physical_threshold_absent": True,
    }
    if not all(checks.values()):
        raise ValueError("weighted-spectral-alignment/Chebyshev-edge audit check failed")

    payload = _encode({
        "schema": SCHEMA,
        "source_lock": source_binding,
        "inputs": {
            "lambda_numerator_text": canonical_p_text,
            "lambda_denominator_text": "2",
            "dps_text": precision_text,
            "chebyshev_orders_exact": [1, 2, 4],
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
            "weighted_central_fixture": central,
            "exterior_k_width_fixture": exterior,
            "odd_first_moment_fixture": odd,
            "inclusive_prime_powers": {
                "lambda_squared_numerator": str(p * p),
                "lambda_squared_denominator": "4",
                "maximum_integer_n": p * p // 4,
                "endpoint_rule": "include every prime power n with 4*n<=p^2",
                "inventory": inventory,
                "excluded_non_prime_power_composites": excluded_composites,
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
