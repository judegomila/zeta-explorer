#!/usr/bin/env python3
"""Produce the conditional log-feature capture/alignment certificate.

The payload contains exact rational regression fixtures and outward
``mpmath.iv`` probes.  It proves no physical capture estimate, signed
sector floor, asymptotic schedule, determinant limit, or RH conclusion.
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


SCHEMA = "xi-prolate-log-feature-capture-alignment-v1"
LOCK = "LOG_FEATURE_CAPTURE_ALIGNMENT_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-log-feature-capture-alignment-source-lock-v1"
CLAIM_CLASS = "LOG_FEATURE_CAPTURE_ALIGNMENT_REDUCTION"
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
    "P0_SOURCE_LOCK.json",
    "PHYSICAL_DEFECT_ADJOINT_TAIL_SOURCE_LOCK.json",
    "notes/LOG_FEATURE_CAPTURE_ALIGNMENT_REDUCTION.md",
    "notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md",
    "requirements.txt",
}

SOURCE_ADMISSIONS = {
    "api_key_read": False,
    "big_o_reported_as_strict_pass": False,
    "binary64_parameters_used": False,
    "cached_physical_matrix_read": False,
    "central_only_capture_promoted_to_full_defect": False,
    "central_taylor_capture_claimed": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "global_weil_positivity_assumed": False,
    "input_cap_bypassed": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "odd_pole_capture_claimed": False,
    "positive_excess_axis_condition_omitted": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "rank_only_capture_claimed": False,
    "rh_proved": False,
    "runtime_version_mismatch_accepted": False,
    "secret_serialized": False,
    "source_tail_scale_claimed": False,
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
    lo, hi = str(minimum), str(maximum)
    if len(value) < len(lo) or (len(value) == len(lo) and value < lo):
        raise ValueError(f"{label} must be at least {minimum}")
    if len(value) > len(hi) or (len(value) == len(hi) and value > hi):
        raise ValueError(f"{label} must be at most {maximum}")
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


def _add(left: Matrix, right: Matrix) -> Matrix:
    return [[a + b for a, b in zip(lrow, rrow)] for lrow, rrow in zip(left, right)]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    return [[a - b for a, b in zip(lrow, rrow)] for lrow, rrow in zip(left, right)]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _outer(vector: Vector) -> Matrix:
    return [[left * right for right in vector] for left in vector]


def _trace(matrix: Matrix) -> Fraction:
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction(0))


def _quadratic(vector: Vector, matrix: Matrix) -> Fraction:
    return sum(
        (vector[i] * matrix[i][j] * vector[j]
         for i in range(len(vector)) for j in range(len(vector))),
        Fraction(0),
    )


def _factorial(value: int) -> int:
    result = 1
    for integer in range(2, value + 1):
        result *= integer
    return result


def _central_angle_fixture() -> dict[str, Any]:
    d = _diag([Fraction(1), Fraction(0)])
    p_v = _diag([Fraction(1), Fraction(0)])
    k = [Fraction(3, 5), Fraction(4, 5)]
    h = [Fraction(-4, 5), Fraction(3, 5)]
    p_k, p_h = _outer(k), _outer(h)
    alpha_squared = _quadratic([Fraction(1), Fraction(0)], p_h)
    defect = _trace(_matmul(_matmul(p_h, d), p_h))
    if (
        _add(p_k, p_h) != _eye(2)
        or alpha_squared != Fraction(16, 25)
        or defect != Fraction(16, 25)
    ):
        raise ValueError("central angle fixture failed")
    return {
        "delta": Fraction(1),
        "T_band": d,
        "P_V": p_v,
        "unit_K_vector": k,
        "unit_H_vector": h,
        "P_K": p_k,
        "P_H": p_h,
        "alpha_squared": alpha_squared,
        "polynomial_tail_tau": Fraction(0),
        "central_defect_trace": defect,
        "angle_upper_bound_squared": alpha_squared,
        "angle_bound_is_equality": defect == alpha_squared,
        "physical_angle_estimate_claimed": False,
        "theorem": {
            "tau_r_upper": "delta/pi*(delta/2)^(2*r)/((2*r+1)^2*(r!)^2)",
            "central_trace_upper": "(alpha*sqrt(delta/pi)+sqrt(tau_r))^2",
            "alpha": "operator_norm(P_H*P_V_r)",
        },
    }


def _source_tail_identity() -> dict[str, Any]:
    t = [
        [Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(1), Fraction(0)],
    ]
    b = _transpose(t)
    p_f = _diag([Fraction(1), Fraction(0), Fraction(0)])
    p_k = _diag([Fraction(1), Fraction(0)])
    p_h = _sub(_eye(2), p_k)
    p_v = _diag([Fraction(0), Fraction(1)])
    tail = _matmul(
        _matmul(_matmul(_matmul(p_h, t), _sub(_eye(3), p_f)), b),
        p_v,
    )
    left = _matmul(p_h, p_v)
    if (
        _matmul(t, b) != _eye(2)
        or left != _diag([Fraction(0), Fraction(1)])
        or tail != left
    ):
        raise ValueError("source-tail identity fixture failed")
    return {
        "T": t,
        "B_X": b,
        "P_F": p_f,
        "P_K": p_k,
        "P_H": p_h,
        "P_V": p_v,
        "T_B_X": _matmul(t, b),
        "P_H_P_V": left,
        "P_H_T_I_minus_P_F_B_X_P_V": tail,
        "identity_exact": left == tail,
        "operator_norm_squared": Fraction(1),
        "T_operator_norm_squared": Fraction(1),
        "general_T_norm_squared_upper": "lambda^2/2",
        "conditional_source_tail_squared_budget": "2*L/lambda^3",
        "conditional_alpha_squared_upper": "L/lambda",
        "big_o_is_not_a_strict_threshold": True,
        "physical_source_tail_estimate_claimed": False,
    }


def _directional_moment_fixture() -> dict[str, Any]:
    q, h = Fraction(5), Fraction(2)
    r_values = [Fraction(1), Fraction(2)]
    p = [Fraction(1), Fraction(1)]
    mu0 = Fraction(2)
    gamma = Fraction(3, 5)
    exact_load = 2 * sum((p_i * p_i / (q - value)
                          for p_i, value in zip(p, r_values)), Fraction(0))
    moments = [sum((p_i * p_i * value**j
                    for p_i, value in zip(p, r_values)), Fraction(0))
               for j in range(6)]
    u_values: list[Fraction] = []
    remainders: list[Fraction] = []
    remainder_formula: list[Fraction] = []
    geometric_bounds: list[Fraction] = []
    for k in range(5):
        partial = sum((moments[j] / q ** (j + 1) for j in range(k)), Fraction(0))
        u_k = 2 * (partial + moments[k] / (h * q**k))
        u_values.append(u_k)
        remainders.append(u_k - exact_load)
        exact_remainder = 2 * sum(
            (p_i * p_i * value**k * ((q - h) - value)
             / (h * q**k * (q - value))
             for p_i, value in zip(p, r_values)),
            Fraction(0),
        )
        remainder_formula.append(exact_remainder)
        geometric_bounds.append(2 * mu0 / h * gamma ** (k + 1))
    if (
        exact_load != Fraction(7, 6)
        or u_values != [Fraction(2), Fraction(7, 5), Fraction(31, 25),
                        Fraction(149, 125), Fraction(147, 125)]
        or remainders != remainder_formula
        or any(remainders[k] > geometric_bounds[k] for k in range(5))
    ):
        raise ValueError("directional moment fixture failed")
    return {
        "q": q,
        "h": h,
        "R": _diag(r_values),
        "p": p,
        "mu_0": mu0,
        "gamma": gamma,
        "R_upper_gamma_q": gamma * q,
        "rho_0_through_5": moments,
        "exact_load": exact_load,
        "U_0_through_4": u_values,
        "exact_U_minus_load": remainders,
        "reconstructed_remainder_formula": remainder_formula,
        "geometric_remainder_upper": geometric_bounds,
        "geometric_formula": "(2*mu_0/h)*gamma^(k+1)",
        "U_monotone": all(left >= right for left, right in zip(u_values, u_values[1:])),
        "geometric_bounds_hold": all(
            remainders[k] <= geometric_bounds[k] for k in range(5)
        ),
        "strict_odd_load_claimed": False,
    }


def _positive_excess_fixture() -> dict[str, Any]:
    m_beta = _diag([Fraction(4), Fraction(3)])
    p = [Fraction(2), Fraction(0)]
    pole = _scale(Fraction(2), _outer(p))
    norm_squared = sum((entry * entry for entry in p), Fraction(0))
    rhs = 2 * norm_squared**2 - _quadratic(p, m_beta)

    def case(a: Fraction) -> dict[str, Any]:
        excess = _diag([a, Fraction(0)])
        compensated = _sub(_add(m_beta, excess), pole)
        energy = _quadratic(p, excess)
        return {
            "A_plus": excess,
            "pole_axis_energy": energy,
            "necessary_rhs": rhs,
            "strict_necessary_inequality": energy > rhs,
            "compensated_odd_matrix": compensated,
            "principal_diagonal": [compensated[0][0], compensated[1][1]],
            "strict_positive": min(compensated[0][0], compensated[1][1]) > 0,
            "singular": compensated[0][0] * compensated[1][1] == 0,
        }

    passing = case(Fraction(5))
    boundary = case(Fraction(4))
    transverse_excess = _diag([Fraction(0), Fraction(5)])
    transverse_matrix = _sub(_add(_eye(2), transverse_excess),
                             _scale(Fraction(2), _outer([Fraction(1), Fraction(0)])))
    if (
        rhs != 16
        or passing["pole_axis_energy"] != 20
        or not passing["strict_positive"]
        or boundary["pole_axis_energy"] != 16
        or not boundary["singular"]
        or transverse_matrix != _diag([Fraction(-1), Fraction(6)])
    ):
        raise ValueError("positive-excess fixture failed")
    return {
        "q": Fraction(5),
        "R": _diag([Fraction(1), Fraction(2)]),
        "M_beta": m_beta,
        "p": p,
        "p_nonzero": True,
        "pole_axis_necessary_formula": "<p,A_plus*p> > 2*||p||^4-<p,M_beta*p>",
        "necessary_rhs": rhs,
        "strict_pass": passing,
        "equality_boundary_rejected": boundary,
        "transverse_orientation_counterexample": {
            "M_beta": _eye(2),
            "p": [Fraction(1), Fraction(0)],
            "A_plus": transverse_excess,
            "pole_axis_energy": Fraction(0),
            "necessary_rhs": Fraction(1),
            "compensated_odd_matrix": transverse_matrix,
            "large_transverse_excess_does_not_help": True,
        },
        "physical_positive_excess_reserve_claimed": False,
    }


def _spectral_alignment_fixture() -> dict[str, Any]:
    sigma = Fraction(1)
    s = _diag([Fraction(0), Fraction(1)])
    e_open = _diag([Fraction(1), Fraction(0)])
    e_closed = _eye(2)

    def load(vector: Vector) -> Fraction:
        return 2 * (vector[0] ** 2 + vector[1] ** 2 / 2)

    z = [Fraction(1, 4), Fraction(1, 4)]
    norm_squared = sum((entry * entry for entry in z), Fraction(0))
    u = 2 * norm_squared
    a_open = _quadratic(z, e_open)
    a_closed = _quadratic(z, e_closed)
    upper = (u + 2 * sigma * a_open) / (1 + sigma)
    exact = load(z)

    necessary_z = [Fraction(1, 2), Fraction(1, 2)]
    necessary_closed = _quadratic(necessary_z, e_closed)
    necessary_load = load(necessary_z)
    threshold = (1 + sigma) / 2

    endpoint_z = [Fraction(0), Fraction(1)]
    endpoint_open = _quadratic(endpoint_z, e_open)
    endpoint_closed = _quadratic(endpoint_z, e_closed)
    endpoint_load = load(endpoint_z)
    if (
        a_open != Fraction(1, 16)
        or a_closed != Fraction(1, 8)
        or exact != Fraction(3, 16)
        or upper != exact
        or necessary_load != Fraction(3, 4)
        or necessary_closed != Fraction(1, 2)
        or endpoint_open != 0
        or endpoint_closed != 1
        or endpoint_load != 1
    ):
        raise ValueError("spectral alignment fixture failed")
    return {
        "sigma": sigma,
        "S": s,
        "E_low_open_0_sigma": e_open,
        "E_low_closed_0_sigma": e_closed,
        "sufficient_open_low_mass": {
            "z": z,
            "U_k_upper_for_2_norm_z_squared": u,
            "a_open": a_open,
            "a_closed": a_closed,
            "load_exact": exact,
            "load_upper": upper,
            "strict_criterion_lhs": u + 2 * sigma * a_open,
            "strict_criterion_rhs": 1 + sigma,
            "strict_pass": u + 2 * sigma * a_open < 1 + sigma,
        },
        "necessary_closed_low_mass": {
            "z": necessary_z,
            "a_closed": necessary_closed,
            "necessary_strict_upper": threshold,
            "load_exact": necessary_load,
            "load_strictly_below_one": necessary_load < 1,
            "necessary_condition_holds": necessary_closed < threshold,
        },
        "eigenvalue_sigma_boundary": {
            "z": endpoint_z,
            "a_open": endpoint_open,
            "a_closed": endpoint_closed,
            "necessary_strict_upper": threshold,
            "load_exact": endpoint_load,
            "strict_pass": False,
            "closed_endpoint_is_mandatory": True,
        },
        "formulas": {
            "sufficient": "load <= (U_k+2*sigma*||E_[0,sigma) z||^2)/(1+sigma)",
            "necessary": "load<1 implies ||E_[0,sigma] z||^2<(1+sigma)/2",
        },
        "physical_spectral_alignment_claimed": False,
    }


def _rank_orientation_countermodels() -> dict[str, Any]:
    d = _diag([Fraction(4), Fraction(1), Fraction(1, 4), Fraction(1, 16)])
    p_v = _diag([Fraction(1), Fraction(1), Fraction(0), Fraction(0)])
    p_good = p_v
    p_bad = _diag([Fraction(0), Fraction(0), Fraction(1), Fraction(1)])
    h_good = _sub(_eye(4), p_good)
    h_bad = _sub(_eye(4), p_bad)
    residual_good = _trace(_matmul(h_good, d))
    residual_bad = _trace(_matmul(h_bad, d))
    alpha_good = Fraction(0)
    alpha_bad = Fraction(1)

    t_band = _diag([Fraction(1), Fraction(0)])
    d_exterior = _diag([Fraction(0), Fraction(7)])
    p_k = _diag([Fraction(1), Fraction(0)])
    p_h = _sub(_eye(2), p_k)
    central_defect = _trace(_matmul(p_h, t_band))
    exterior_defect = _trace(_matmul(p_h, d_exterior))
    if (
        residual_good != Fraction(5, 16)
        or residual_bad != Fraction(5)
        or central_defect != 0
        or exterior_defect != 7
    ):
        raise ValueError("rank/orientation countermodel failed")
    return {
        "rank_two_orientation": {
            "D": d,
            "P_V": p_v,
            "P_K_good": p_good,
            "P_K_bad": p_bad,
            "common_rank": 2,
            "good_residual_trace": residual_good,
            "bad_residual_trace": residual_bad,
            "good_alpha_squared": alpha_good,
            "bad_alpha_squared": alpha_bad,
            "rank_alone_does_not_control_capture": True,
        },
        "central_only_does_not_control_exterior": {
            "T_band": t_band,
            "D_exterior": d_exterior,
            "P_K": p_k,
            "central_defect": central_defect,
            "exterior_defect": exterior_defect,
            "central_capture_promoted_to_full_defect": False,
        },
    }


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


def _interval_probes(p: int, dps: int, r: int) -> dict[str, Any]:
    mp.iv.dps = dps
    lam = mp.iv.mpf(p) / 2
    length = 2 * mp.iv.log(lam)
    delta = mp.iv.mpf(1)
    factorial = mp.iv.mpf(_factorial(r))
    tau = (
        delta / mp.iv.pi * (delta / 2) ** (2 * r)
        / ((2 * r + 1) ** 2 * factorial**2)
    )
    source_tail_squared = 2 * length / lam**3
    alpha_squared = length / lam
    central_upper = (
        mp.iv.sqrt(alpha_squared) * mp.iv.sqrt(delta / mp.iv.pi)
        + mp.iv.sqrt(tau)
    ) ** 2
    half_length = length / 2
    pole_norm_squared = (
        (mp.iv.exp(half_length) - mp.iv.exp(-half_length)) / 2
        - half_length
    )
    pole_tail_squared = (
        length * lam * (length / 4) ** (2 * r)
        / ((2 * r + 1) * factorial**2)
    )
    pole_tail = mp.iv.sqrt(pole_tail_squared)
    conditional_mu0 = (
        mp.iv.sqrt(alpha_squared) * mp.iv.sqrt(pole_norm_squared)
        + pole_tail
    ) ** 2
    coarse_pole_envelope = (
        length * lam ** (1 - 6 * mp.iv.log(mp.iv.mpf(2)))
    )
    probes = {
        "lambda": lam,
        "physical_length_L": length,
        "safe_r_minus_three_L_over_two": r - 3 * length / 2,
        "central_tau_r_upper_delta_one": tau,
        "conditional_source_tail_squared_budget": source_tail_squared,
        "conditional_alpha_squared_upper": alpha_squared,
        "conditional_central_trace_upper": central_upper,
        "odd_pole_norm_squared": pole_norm_squared,
        "odd_pole_taylor_tail_squared_upper": pole_tail_squared,
        "odd_pole_coarse_power_envelope": coarse_pole_envelope,
        "conditional_odd_pole_mu0_upper": conditional_mu0,
    }
    return {
        "formula_scale_regression_only": True,
        "delta_text": "1",
        "r_exact_integer": r,
        "r_rule": "3*bit_length(lambda_numerator)",
        "strict_threshold_supplied": False,
        "physical_capture_or_odd_floor_claimed": False,
        "values": {key: _serialize_interval(value, dps) for key, value in probes.items()},
    }


def _validate_admissions() -> None:
    if any(SOURCE_ADMISSIONS.values()):
        raise ValueError("a forbidden source admission was enabled")


def produce(lambda_numerator_text: str, dps_text: str) -> dict[str, Any]:
    p_text, p = _canonical_positive_text(
        lambda_numerator_text, "lambda numerator", 3, MAX_LAMBDA_NUMERATOR
    )
    precision_text, precision = _canonical_positive_text(
        dps_text, "dps", 50, MAX_DPS
    )
    if p % 2 == 0:
        raise ValueError("lambda numerator must be odd")
    r = 3 * p.bit_length()
    _validate_admissions()
    _validate_runtime()
    source_binding, source_lock = _validated_source_lock()
    central = _central_angle_fixture()
    source_tail = _source_tail_identity()
    moments = _directional_moment_fixture()
    excess = _positive_excess_fixture()
    spectral = _spectral_alignment_fixture()
    countermodels = _rank_orientation_countermodels()
    intervals = _interval_probes(p, precision, r)
    checks = {
        "central_angle_equality_reconstructed": central["angle_bound_is_equality"],
        "central_physical_capture_not_claimed": not central["physical_angle_estimate_claimed"],
        "source_tail_identity_exact": source_tail["identity_exact"],
        "source_tail_scale_not_claimed": not source_tail["physical_source_tail_estimate_claimed"],
        "big_o_not_strict_pass": source_tail["big_o_is_not_a_strict_threshold"],
        "odd_moment_remainders_exact": moments["exact_U_minus_load"]
        == moments["reconstructed_remainder_formula"],
        "odd_moment_geometric_bounds_hold": moments["geometric_bounds_hold"],
        "positive_excess_strict_axis_inequality": excess["strict_pass"]["strict_necessary_inequality"],
        "positive_excess_equality_is_singular": excess["equality_boundary_rejected"]["singular"]
        and not excess["equality_boundary_rejected"]["strict_positive"],
        "transverse_excess_rejected": excess["transverse_orientation_counterexample"]["large_transverse_excess_does_not_help"],
        "spectral_open_sufficient_fixture_passes": spectral["sufficient_open_low_mass"]["strict_pass"],
        "spectral_closed_necessary_fixture_passes": spectral["necessary_closed_low_mass"]["necessary_condition_holds"],
        "spectral_sigma_endpoint_rejected": spectral["eigenvalue_sigma_boundary"]["load_exact"] == 1
        and not spectral["eigenvalue_sigma_boundary"]["strict_pass"],
        "rank_not_orientation": countermodels["rank_two_orientation"]["rank_alone_does_not_control_capture"],
        "central_not_full_defect": not countermodels["central_only_does_not_control_exterior"]["central_capture_promoted_to_full_defect"],
        "interval_probe_not_promoted": not intervals["physical_capture_or_odd_floor_claimed"],
        "strict_threshold_absent": not intervals["strict_threshold_supplied"],
    }
    if not all(checks.values()):
        raise ValueError("log-feature capture/alignment audit check failed")
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
            "central_taylor_angle": central,
            "exact_source_tail": source_tail,
            "odd_pole_taylor": {
                "odd_sector_only": True,
                "r_exact_integer": r,
                "r_rule": "3*bit_length(lambda_numerator)",
                "safe_r_condition": "r>=3*L/2",
                "tail_formula": "L*lambda*(L/4)^(2*r)/((2*r+1)*(r!)^2)",
                "conditional_mu0_formula": "(alpha*sqrt(sinh(L/2)-L/2)+epsilon_p)^2",
                "physical_odd_pole_capture_claimed": False,
            },
            "directional_moment_remainder": moments,
            "positive_excess_necessity": excess,
            "spectral_alignment": spectral,
            "rank_orientation_countermodels": countermodels,
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
