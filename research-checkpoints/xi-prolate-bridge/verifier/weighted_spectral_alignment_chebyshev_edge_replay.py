#!/usr/bin/env python3
"""Clean-room replay for the weighted/spectral/Chebyshev-edge reduction.

This verifier imports no producer module and reads no environment variables.
It rehashes the source lock and every dependency, reconstructs the rational
models from first principles, independently detects every included prime
power, and evaluates transcendental probes through a separate formula tree.
The only admitted terminal state is ``P0_INVALIDATED``.
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


PRODUCER_SCHEMA = "xi-prolate-weighted-spectral-alignment-chebyshev-edge-v1"
REPLAY_SCHEMA = "xi-prolate-weighted-spectral-alignment-chebyshev-edge-replay-v1"
SOURCE_LOCK_PATH = "WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = "xi-prolate-weighted-spectral-alignment-chebyshev-edge-source-lock-v1"
CLAIM_CLASS = "WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_SOURCE_LOCK_SHA256 = "6250e0d229ddb014bd072587a7788cd3284f9320235bb1b0902fb46c2033c680"
EXPECTED_MPMATH_VERSION = "1.4.1"
EXPECTED_DEPENDENCY_PATHS = {
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
    """Raised when a submitted artifact fails independent replay."""


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
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise ReplayError(f"{label} must be canonical positive integer text")
    upper = str(max(allowed))
    if len(value) > len(upper) or (len(value) == len(upper) and value > upper):
        raise ReplayError(f"{label} exceeds maximum")
    if value not in {str(item) for item in allowed}:
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
        raise ReplayError("internal matrix is empty or ragged")
    return [[matrix[i][j] for i in range(len(matrix))]
            for j in range(len(matrix[0]))]


def _product(left: Matrix, right: Matrix) -> Matrix:
    if (
        not left or not right
        or any(len(row) != len(left[0]) for row in left)
        or any(len(row) != len(right[0]) for row in right)
        or len(left[0]) != len(right)
    ):
        raise ReplayError("internal matrix dimension mismatch")
    return [[
        sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
        for j in range(len(right[0]))
    ] for i in range(len(left))]


def _difference(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right) or any(len(a) != len(b) for a, b in zip(left, right)):
        raise ReplayError("internal matrix shape mismatch")
    return [[a - b for a, b in zip(row_a, row_b)]
            for row_a, row_b in zip(left, right)]


def _outer(left: Vector, right: Vector | None = None) -> Matrix:
    other = left if right is None else right
    return [[a * b for b in other] for a in left]


def _multiple(scalar: Fraction | int, matrix: Matrix) -> Matrix:
    factor = Fraction(scalar)
    return [[factor * entry for entry in row] for row in matrix]


def _trace(matrix: Matrix) -> Fraction:
    if not matrix or any(len(row) != len(matrix) for row in matrix):
        raise ReplayError("internal trace shape mismatch")
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction(0))


def _dot(left: Vector, right: Vector) -> Fraction:
    if len(left) != len(right):
        raise ReplayError("internal vector dimension mismatch")
    return sum((a * b for a, b in zip(left, right)), Fraction(0))


def _apply(matrix: Matrix, vector: Vector) -> Vector:
    return [_dot(row, vector) for row in matrix]


def _quadratic(matrix: Matrix, vector: Vector) -> Fraction:
    return _dot(vector, _apply(matrix, vector))


def _weighted_central_reconstruction() -> dict[str, Any]:
    u = _identity(2)
    t_b = _diag(1, Fraction(1, 100))
    w = [[Fraction(1)], [Fraction(0)]]
    g = _product(_transpose(u), u)
    c = _product(_product(_transpose(u), t_b), u)
    a = _product(_transpose(w), w)
    p_k = _product(w, _transpose(w))
    p_h = _difference(_identity(2), p_k)
    s = _product(_product(_transpose(u), p_h), u)
    rho = _trace(_product(c, s))
    high = _product(_product(p_h, t_b), p_h)
    high_trace = _trace(high)
    high_norm = high[1][1]
    alpha_squared = Fraction(1)
    tau = Fraction(0)
    old_coarse = alpha_squared * _trace(t_b)
    weighted_bound = rho
    if (
        g != _identity(2)
        or c != t_b
        or a != [[Fraction(1)]]
        or s != p_h
        or rho != Fraction(1, 100)
        or high_trace != rho
        or high_norm != rho
        or old_coarse != Fraction(101, 100)
    ):
        raise ReplayError("weighted central reconstruction failed")
    return {
        "U": u,
        "T_B": t_b,
        "W": w,
        "G_U_star_U": g,
        "C_U_star_T_B_U": c,
        "A_W_star_W": a,
        "P_K": p_k,
        "P_H": p_h,
        "S_U_star_P_H_U": s,
        "unweighted_alpha_squared": alpha_squared,
        "weighted_rho": rho,
        "weighted_tau": tau,
        "high_trace": high_trace,
        "high_operator_norm": high_norm,
        "old_unweighted_coarse_bound": old_coarse,
        "weighted_square_bound": weighted_bound,
        "weighted_bound_is_sharp": weighted_bound == high_trace,
        "unweighted_bound_loses_factor_101": old_coarse / weighted_bound == 101,
    }


def _line_projector(vector: Vector) -> Matrix:
    if _dot(vector, vector) != 1:
        raise ReplayError("internal line vector is not normalized")
    return _outer(vector)


def _trace_k_width_case(vector: Vector) -> dict[str, Any]:
    c = _diag(1, Fraction(1, 2), Fraction(1, 4))
    p_k = _line_projector(vector)
    p_h = _difference(_identity(3), p_k)
    e_k = _diag(1, 0, 0)
    angle_hs_squared = _trace(_product(_product(p_h, e_k), p_h))
    actual = _trace(_product(_product(p_h, c), p_h))
    tail = Fraction(3, 4)
    lower = tail + Fraction(1, 2) * angle_hs_squared
    upper = tail + Fraction(3, 4) * angle_hs_squared
    return {
        "C": c,
        "K_unit_vector": vector,
        "P_K": p_k,
        "P_H": p_h,
        "top_k_projector": e_k,
        "top_k_HS_angle_squared": angle_hs_squared,
        "spectral_tail_after_k": tail,
        "gap_gamma_k_minus_gamma_k_plus_1": Fraction(1, 2),
        "spread_gamma_1_minus_gamma_d": Fraction(3, 4),
        "trace_on_H": actual,
        "trace_lower_bound": lower,
        "trace_upper_bound": upper,
        "lower_equality": actual == lower,
        "upper_equality": actual == upper,
    }


def _exterior_k_width_reconstruction() -> dict[str, Any]:
    lower_case = _trace_k_width_case(
        [Fraction(3, 5), Fraction(4, 5), Fraction(0)]
    )
    upper_case = _trace_k_width_case(
        [Fraction(3, 5), Fraction(0), Fraction(4, 5)]
    )
    c_op = _diag(1, Fraction(1, 4))
    k_vector = [Fraction(3, 5), Fraction(4, 5)]
    h_vector = [Fraction(-4, 5), Fraction(3, 5)]
    p_k_op = _line_projector(k_vector)
    p_h_op = _difference(_identity(2), p_k_op)
    e_top = _diag(1, 0)
    alpha_squared = _trace(_product(_product(p_h_op, e_top), p_h_op))
    operator_value = _quadratic(c_op, h_vector)
    operator_upper = Fraction(1, 4) + Fraction(3, 4) * alpha_squared
    operator_lower = max(Fraction(1, 4), alpha_squared)
    if (
        not lower_case["lower_equality"]
        or lower_case["trace_on_H"] != Fraction(107, 100)
        or not upper_case["upper_equality"]
        or upper_case["trace_on_H"] != Fraction(123, 100)
        or alpha_squared != Fraction(16, 25)
        or operator_value != Fraction(73, 100)
        or operator_value != operator_upper
    ):
        raise ReplayError("k-width equality reconstruction failed")

    open_eigenvalues = [Fraction(1), Fraction(1, 2)]
    open_sigma = Fraction(1, 2)
    open_high_rank = sum(value > open_sigma for value in open_eigenvalues)
    open_chi = sum(
        (value * (1 - value) for value in open_eigenvalues), Fraction(0)
    )
    open_low_tail = sum(
        (value for value in open_eigenvalues if value <= open_sigma), Fraction(0)
    )
    rank_eigenvalues = [
        Fraction(9, 10), Fraction(3, 5), Fraction(1, 10), Fraction(0)
    ]
    rank_sigma = Fraction(1, 2)
    phase_volume = sum(rank_eigenvalues, Fraction(0))
    transition_defect = sum(
        (value * (1 - value) for value in rank_eigenvalues), Fraction(0)
    )
    rank_real_bound = phase_volume + transition_defect / rank_sigma
    rank_integer_bound = rank_real_bound.numerator // rank_real_bound.denominator
    actual_open_rank = sum(value > rank_sigma for value in rank_eigenvalues)
    actual_tail = sum(rank_eigenvalues[actual_open_rank:], Fraction(0))
    low_tail_bound = transition_defect / (1 - rank_sigma)
    if (
        open_high_rank != 1
        or open_chi != Fraction(1, 4)
        or open_low_tail != Fraction(1, 2)
        or open_low_tail != open_chi / (1 - open_sigma)
        or phase_volume != Fraction(8, 5)
        or transition_defect != Fraction(21, 50)
        or rank_real_bound != Fraction(61, 25)
        or rank_integer_bound != 2
        or actual_open_rank != 2
        or actual_tail != Fraction(1, 10)
        or actual_tail > low_tail_bound
    ):
        raise ReplayError("transition-rank reconstruction failed")

    return {
        "trace_lower_equality": lower_case,
        "trace_upper_equality": upper_case,
        "operator_upper_equality": {
            "C": c_op,
            "K_unit_vector": k_vector,
            "H_unit_vector": h_vector,
            "P_K": p_k_op,
            "P_H": p_h_op,
            "top_projector": e_top,
            "top_operator_angle_squared": alpha_squared,
            "gamma_k_plus_1": Fraction(1, 4),
            "gamma_k": Fraction(1),
            "operator_norm_on_H": operator_value,
            "operator_lower_bound": operator_lower,
            "operator_upper_bound": operator_upper,
            "upper_equality": operator_value == operator_upper,
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
            "eigenvalues": open_eigenvalues,
            "sigma": open_sigma,
            "strict_high_rank": open_high_rank,
            "transition_defect_chi": open_chi,
            "low_tail_including_endpoint": open_low_tail,
            "chi_over_one_minus_sigma": open_chi / (1 - open_sigma),
            "endpoint_is_low_and_tail_bound_is_equality": True,
        },
        "effective_rank_count": {
            "eigenvalues": rank_eigenvalues,
            "sigma": rank_sigma,
            "phase_volume_p": phase_volume,
            "transition_defect_chi": transition_defect,
            "p_plus_chi_over_sigma": rank_real_bound,
            "floor_p_plus_chi_over_sigma": rank_integer_bound,
            "strict_high_rank": actual_open_rank,
            "chosen_k": 2,
            "spectral_tail_after_k": actual_tail,
            "chi_over_one_minus_sigma": low_tail_bound,
            "integer_rule_is_exact_here": rank_integer_bound == actual_open_rank,
            "tail_bound_holds": actual_tail <= low_tail_bound,
        },
        "actual_exterior_alignment_claimed": False,
    }


def _chebyshev_value(order: int, value: Fraction) -> Fraction:
    if order < 0:
        raise ReplayError("negative Chebyshev order")
    if order == 0:
        return Fraction(1)
    previous, current = Fraction(1), value
    for _ in range(1, order):
        previous, current = current, 2 * value * current - previous
    return current


def _odd_profile(weights: list[Fraction], max_order: int = 6) -> dict[str, Any]:
    spectrum = [Fraction(0), Fraction(1), Fraction(2)]
    q, h, b = Fraction(3), Fraction(1), Fraction(2)
    if len(weights) != len(spectrum) or any(weight < 0 for weight in weights):
        raise ReplayError("invalid internal odd spectral profile")
    mu = sum(weights, Fraction(0))
    rho_1 = sum((x * weight for x, weight in zip(spectrum, weights)), Fraction(0))
    d_1 = b * mu - rho_1
    y_spectrum = [b - x for x in spectrum]
    edge_deficit = sum(
        (weight * y / (h + y) for y, weight in zip(y_spectrum, weights)),
        Fraction(0),
    )
    load = 2 * sum(
        (weight / (q - x) for x, weight in zip(spectrum, weights)), Fraction(0)
    )
    first_moment_upper = 2 * mu / h - 2 * d_1 / (h * q)
    mapped = [2 * x / b - 1 for x in spectrum]
    moments = [
        sum(
            (weight * _chebyshev_value(order, z)
             for z, weight in zip(mapped, weights)),
            Fraction(0),
        )
        for order in range(max_order + 1)
    ]
    return {
        "R_spectrum": spectrum,
        "spectral_weights": weights,
        "q": q,
        "h": h,
        "b": b,
        "mu": mu,
        "rho_1": rho_1,
        "Y_spectrum_b_minus_R": y_spectrum,
        "d_1_b_mu_minus_rho_1": d_1,
        "nonlinear_edge_deficit": edge_deficit,
        "edge_threshold_mu_minus_h_over_2": mu - h / 2,
        "edge_identity_load": 2 * mu / h - 2 * edge_deficit / h,
        "exact_edge_criterion_pass": edge_deficit > mu - h / 2,
        "first_moment_chord_edge_lower": d_1 / q,
        "exact_shifted_load": load,
        "first_moment_upper": first_moment_upper,
        "strict_load_pass": load < 1,
        "mapped_Chebyshev_spectrum": mapped,
        "Theta_orders_0_through_6": moments,
    }


def _odd_first_moment_reconstruction() -> dict[str, Any]:
    profile_a = _odd_profile([
        Fraction(27, 80), Fraction(9, 40), Fraction(27, 80)
    ])
    profile_b = _odd_profile([
        Fraction(9, 80), Fraction(27, 40), Fraction(9, 80)
    ])
    endpoint = _odd_profile([
        Fraction(1, 2), Fraction(0), Fraction(1, 2)
    ])
    if (
        profile_a["mu"] != Fraction(9, 10)
        or profile_b["mu"] != Fraction(9, 10)
        or profile_a["rho_1"] != Fraction(9, 10)
        or profile_b["rho_1"] != Fraction(9, 10)
        or profile_a["d_1_b_mu_minus_rho_1"] != Fraction(9, 10)
        or profile_b["d_1_b_mu_minus_rho_1"] != Fraction(9, 10)
        or profile_a["first_moment_upper"] != Fraction(6, 5)
        or profile_b["first_moment_upper"] != Fraction(6, 5)
        or profile_a["exact_shifted_load"] != Fraction(9, 8)
        or profile_b["exact_shifted_load"] != Fraction(39, 40)
        or profile_a["nonlinear_edge_deficit"] != Fraction(27, 80)
        or profile_b["nonlinear_edge_deficit"] != Fraction(33, 80)
        or profile_a["edge_identity_load"] != profile_a["exact_shifted_load"]
        or profile_b["edge_identity_load"] != profile_b["exact_shifted_load"]
        or profile_a["exact_edge_criterion_pass"]
        or not profile_b["exact_edge_criterion_pass"]
        or profile_a["strict_load_pass"]
        or not profile_b["strict_load_pass"]
        or profile_a["Theta_orders_0_through_6"][2] != Fraction(9, 20)
        or profile_b["Theta_orders_0_through_6"][2] != Fraction(-9, 20)
        or endpoint["mu"] != 1
        or endpoint["d_1_b_mu_minus_rho_1"] != 1
        or endpoint["exact_shifted_load"] != Fraction(4, 3)
        or endpoint["first_moment_upper"] != Fraction(4, 3)
        or endpoint["nonlinear_edge_deficit"] != Fraction(1, 3)
        or endpoint["first_moment_chord_edge_lower"] != Fraction(1, 3)
    ):
        raise ReplayError("odd first-moment/Chebyshev reconstruction failed")
    return {
        "same_first_moment_profile_A": profile_a,
        "same_first_moment_profile_B": profile_b,
        "same_mu_rho1_d1_and_bound": all(
            profile_a[key] == profile_b[key]
            for key in ("mu", "rho_1", "d_1_b_mu_minus_rho_1", "first_moment_upper")
        ),
        "opposite_strict_load_outcomes": (
            profile_a["strict_load_pass"] != profile_b["strict_load_pass"]
        ),
        "second_Chebyshev_moment_distinguishes_profiles": (
            profile_a["Theta_orders_0_through_6"][2]
            == -profile_b["Theta_orders_0_through_6"][2]
            != 0
        ),
        "sharp_endpoint_profile": endpoint,
        "endpoint_first_moment_bound_is_equality": (
            endpoint["exact_shifted_load"] == endpoint["first_moment_upper"]
        ),
        "actual_odd_reserve_claimed": False,
    }


def _prime_power_base(n: int) -> tuple[int, int] | None:
    """Return a prime base/exponent using a trial-division path."""
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
        "excluded_non_prime_power_composites": excluded_composites,
        "combined_multiplier": "m_lambda(t)=2*theta'(t)-2*sum_(1<n<=lambda^2) Lambda(n)/sqrt(n)*cos(t*log(n))",
        "prime_block_sign": "minus",
        "individual_prime_blocks_absolutized_in_level_sets": False,
    }


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
    return (
        Fraction(numerator * (1 << exponent)) if exponent >= 0
        else Fraction(numerator, 1 << (-exponent))
    )


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
    if (
        not isinstance(mantissa_text, str)
        or _UNSIGNED_INTEGER_TEXT.fullmatch(mantissa_text) is None
    ):
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
    return (
        Fraction(numerator * (1 << exponent)) if exponent >= 0
        else Fraction(numerator, 1 << (-exponent))
    )


def _mpf_raw(raw: tuple[int, int, int, int], dps: int) -> Any:
    with mp.workprec(max(_precision_bits(dps) + 64, raw[3] + 16)):
        return +mp.mpf(raw)


def _submitted_interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if (
        not isinstance(decimal, list) or len(decimal) != 2
        or any(
            not isinstance(item, str) or _DECIMAL_TEXT.fullmatch(item) is None
            for item in decimal
        )
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
        Fraction(1, 1 << exponent) if exponent >= 0
        else Fraction(1 << (-exponent))
    )
    if submitted_upper - submitted_lower > width_limit:
        raise ReplayError(f"{label} interval is excessively wide")


def _interval_targets(
    p: int,
    dps: int,
    odd_fixture: dict[str, Any],
) -> dict[str, Any]:
    mp.iv.dps = dps
    one = mp.iv.mpf(1)
    two = mp.iv.mpf(2)
    three = mp.iv.mpf(3)
    lam = mp.iv.mpf(p) / two
    length = two * mp.iv.log(lam)
    log_length = mp.iv.log(length)
    central_degree_real = (length / two) / log_length
    central_degree = 2
    prolate_dimension = (p * p + 3) // 4
    # Reconstruct pi and log(2) through trees distinct from direct constants.
    pi_value = 4 * mp.iv.atan2(one, one)
    factorial = math.factorial(central_degree)
    central_tail = (
        (one / pi_value)
        * (one / two) ** (2 * central_degree)
        / (
            mp.iv.mpf(2 * central_degree + 1) ** 2
            * mp.iv.mpf(factorial) ** 2
        )
    )
    lambda_times_central_tail = lam * central_tail
    legendre_eta_squared = (
        two * mp.iv.mpf(central_degree) ** 2
        / (pi_value**2 * mp.iv.mpf(prolate_dimension))
        * mp.iv.exp(
            mp.iv.mpf(central_degree * (central_degree - 1))
            / (pi_value * mp.iv.mpf(prolate_dimension))
        )
    )
    legendre_eta = mp.iv.sqrt(legendre_eta_squared)
    legendre_gram_lower = one - legendre_eta_squared
    legendre_condition = one / legendre_gram_lower
    log_two = mp.iv.log(mp.iv.mpf(4)) / two
    kernel_b_y_4 = mp.iv.mpf(12) + mp.iv.mpf(8) * log_two
    kernel_normalized = kernel_b_y_4 / (4 * pi_value**2)
    sqrt_three = mp.iv.sqrt(three)
    # Rationalized form of (sqrt(3)-1)/(sqrt(3)+1).
    r_zero = one / (two + sqrt_three)
    mu = mp.iv.mpf(9) / mp.iv.mpf(10)
    tail_factor = two * mu * (one + one / sqrt_three)

    profiles: dict[str, dict[str, Any]] = {}
    for profile_name, source_name in (
        ("profile_A", "same_first_moment_profile_A"),
        ("profile_B", "same_first_moment_profile_B"),
    ):
        exact_profile = odd_fixture[source_name]
        theta_exact = exact_profile["Theta_orders_0_through_6"]
        per_order: dict[str, dict[str, Any]] = {}
        for order in (1, 2, 4):
            partial = mu
            for index in range(1, order + 1):
                theta = theta_exact[index]
                partial += (
                    two * r_zero**index
                    * mp.iv.mpf(theta.numerator) / mp.iv.mpf(theta.denominator)
                )
            remainder_inside = two * mu * r_zero ** (order + 1) / (one - r_zero)
            upper = two / sqrt_three * (partial + remainder_inside)
            tail = tail_factor * r_zero ** (order + 1)
            per_order[f"k_{order}"] = {
                "order": order,
                "truncated_plus_tail_upper": upper,
                "absolute_tail_upper": tail,
            }
        profiles[profile_name] = per_order
    return {
        "values": {
            "lambda": lam,
            "physical_length_L": length,
            "log_physical_length": log_length,
            "central_degree_real_cL_over_logL": central_degree_real,
            "central_factorial_tail_tau": central_tail,
            "lambda_times_central_factorial_tail": lambda_times_central_tail,
            "legendre_eta_squared_upper": legendre_eta_squared,
            "legendre_eta_upper": legendre_eta,
            "legendre_Gram_lower": legendre_gram_lower,
            "legendre_Gram_upper": one,
            "legendre_condition_number_upper": legendre_condition,
            "kernel_b_y_4": kernel_b_y_4,
            "kernel_b_y_4_over_4_pi_squared": kernel_normalized,
            "chebyshev_r_0": r_zero,
            "chebyshev_tail_prefactor_mu_9_over_10": tail_factor,
        },
        "profiles": profiles,
    }


def _exact_certificate(p: int) -> tuple[dict[str, Any], dict[str, bool]]:
    central = _weighted_central_reconstruction()
    exterior = _exterior_k_width_reconstruction()
    odd = _odd_first_moment_reconstruction()
    primes = _prime_power_reconstruction(p)
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
        "prime_block_minus_sign_retained": primes["prime_block_sign"] == "minus",
        "interval_probe_not_promoted": True,
        "strict_physical_threshold_absent": True,
    }
    if not all(checks.values()):
        raise ReplayError("independent exact fixture check failed")
    return {
        "weighted_central_fixture": central,
        "exterior_k_width_fixture": exterior,
        "odd_first_moment_fixture": odd,
        "inclusive_prime_powers": primes,
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
        "chebyshev_orders_exact",
    }:
        raise ReplayError("input inventory mismatch")
    p = _canonical_input(inputs["lambda_numerator_text"], "lambda numerator", {5, 9})
    dps = _canonical_input(inputs["dps_text"], "dps", {80, 160})
    if (
        inputs["lambda_denominator_text"] != "2"
        or inputs["chebyshev_orders_exact"] != [1, 2, 4]
    ):
        raise ReplayError("lambda or Chebyshev-order input mismatch")

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
        "weighted_central_fixture", "exterior_k_width_fixture",
        "odd_first_moment_fixture", "inclusive_prime_powers",
        "transcendental_intervals", "checks",
    }:
        raise ReplayError("certificate inventory mismatch")
    exact_groups, expected_checks = _exact_certificate(p)
    for name, reconstructed in exact_groups.items():
        _require(certificate[name], _encode(reconstructed), name)

    interval_section = certificate["transcendental_intervals"]
    if not isinstance(interval_section, dict) or set(interval_section) != {
        "diagnostic_only", "q_text", "h_text", "b_text",
        "central_c_text", "central_delta_text", "central_degree_rule",
        "central_degree_exact", "prolate_dimension_N_exact",
        "chebyshev_orders_exact", "strict_threshold_supplied",
        "actual_weighted_central_rate_claimed",
        "actual_exterior_alignment_claimed", "actual_odd_reserve_claimed",
        "values", "chebyshev_profile_bounds",
    }:
        raise ReplayError("transcendental interval inventory mismatch")
    _require(
        {
            key: interval_section[key]
            for key in (
                "diagnostic_only", "q_text", "h_text", "b_text",
                "central_c_text", "central_delta_text", "central_degree_rule",
                "central_degree_exact", "prolate_dimension_N_exact",
                "chebyshev_orders_exact", "strict_threshold_supplied",
                "actual_weighted_central_rate_claimed",
                "actual_exterior_alignment_claimed", "actual_odd_reserve_claimed",
            )
        },
        {
            "diagnostic_only": True,
            "q_text": "3",
            "h_text": "1",
            "b_text": "2",
            "central_c_text": "1/2",
            "central_delta_text": "1",
            "central_degree_rule": "r=ceil((L/2)/log(L))",
            "central_degree_exact": 2,
            "prolate_dimension_N_exact": (p * p + 3) // 4,
            "chebyshev_orders_exact": [1, 2, 4],
            "strict_threshold_supplied": False,
            "actual_weighted_central_rate_claimed": False,
            "actual_exterior_alignment_claimed": False,
            "actual_odd_reserve_claimed": False,
        },
        "interval metadata",
    )
    interval_targets = _interval_targets(
        p, dps, exact_groups["odd_first_moment_fixture"]
    )
    degree_lower, degree_upper = _interval_bounds(
        interval_targets["values"]["central_degree_real_cL_over_logL"],
        "central degree",
    )
    if not Fraction(1) < degree_lower <= degree_upper <= Fraction(2):
        raise ReplayError("central degree ceiling is not independently certified")
    values = interval_section["values"]
    if not isinstance(values, dict) or set(values) != set(interval_targets["values"]):
        raise ReplayError("interval value inventory mismatch")
    for name, target in interval_targets["values"].items():
        _check_enclosure(values[name], target, f"interval.{name}", dps)

    submitted_profiles = interval_section["chebyshev_profile_bounds"]
    expected_profiles = interval_targets["profiles"]
    if not isinstance(submitted_profiles, dict) or set(submitted_profiles) != set(expected_profiles):
        raise ReplayError("Chebyshev profile inventory mismatch")
    for profile_name, expected_orders in expected_profiles.items():
        submitted_orders = submitted_profiles[profile_name]
        if not isinstance(submitted_orders, dict) or set(submitted_orders) != set(expected_orders):
            raise ReplayError(f"Chebyshev order inventory mismatch: {profile_name}")
        for order_name, expected in expected_orders.items():
            submitted = submitted_orders[order_name]
            if not isinstance(submitted, dict) or set(submitted) != {
                "order", "truncated_plus_tail_upper", "absolute_tail_upper"
            }:
                raise ReplayError(f"Chebyshev bound malformed: {profile_name}.{order_name}")
            _require(
                submitted["order"], expected["order"],
                f"Chebyshev order {profile_name}.{order_name}",
            )
            for field in ("truncated_plus_tail_upper", "absolute_tail_upper"):
                _check_enclosure(
                    submitted[field], expected[field],
                    f"Chebyshev.{profile_name}.{order_name}.{field}", dps,
                )
    _require(certificate["checks"], expected_checks, "producer check inventory")

    canonical = (
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n"
    ).encode("utf-8")
    bound_bytes = canonical if producer_bytes is None else producer_bytes
    if bound_bytes != canonical:
        raise ReplayError("producer artifact bytes are not canonical exact serialization")
    parsed = _strict_json_loads(bound_bytes, "producer artifact bytes")
    _require(parsed, payload, "producer artifact bytes")

    prime_entries = exact_groups["inclusive_prime_powers"]["inventory"]
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
            "transcendental_interval_count": len(interval_targets["values"]) + 12,
            "source_dependency_count": len(binding["dependency_hashes"]),
            "prime_power_count": len(prime_entries),
            "chebyshev_profiles": sorted(expected_profiles),
            "chebyshev_orders": [1, 2, 4],
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
            "binary64_parameters_used": False,
            "api_key_or_environment_secret_read": False,
            "physical_weighted_central_rate_claimed": False,
            "physical_exterior_alignment_claimed": False,
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


if __name__ == "__main__":
    main()
