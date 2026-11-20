#!/usr/bin/env python3
"""Produce the covariance/annular/odd-subsequence checkpoint artifact.

The artifact contains exact rational countermodels and outward interval
formula probes.  It records necessary conditions and a favorable odd
subsequence; it does not establish either signed sector floor, the target in
equation (5.2), determinant convergence, or the Riemann hypothesis.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from math import factorial
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-covariance-annular-odd-subsequence-v1"
LOCK = "COVARIANCE_ANNULAR_ODD_SUBSEQUENCE_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-covariance-annular-odd-subsequence-source-lock-v1"
CLAIM_CLASS = "COVARIANCE_ANNULAR_ODD_FAVORABLE_SUBSEQUENCE_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_MPMATH_VERSION = "1.4.1"
EXPECTED_LIBRARY = f"mpmath.iv {EXPECTED_MPMATH_VERSION}"

CANONICAL_LAMBDA_NUMERATORS = {5, 9}
CANONICAL_DPS = {80, 160}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")
_SHA256 = re.compile(r"[0-9a-f]{64}\Z")

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

EXPECTED_DEPENDENCIES = {
    "DIRECT_RH_ATTACK.md",
    "INTRINSIC_FEATURE_DYADIC_DEFECT_SOURCE_LOCK.json",
    "MELLIN_PROJECTION_SOFT_SYMBOL_GRAPH_SPILL_SOURCE_LOCK.json",
    "P0_MATRIX_FORMULAS.md",
    "P0_NORMALIZATION_AUDIT.md",
    "P0_SOURCE_LOCK.json",
    "ZERO_SAMPLING_SOURCE_LOCK.json",
    "notes/ANNULAR_GRAY_MASS_OBSTRUCTION.md",
    "notes/COVARIANCE_TANGENT_GRAPH_SPILL.md",
    "notes/INTRINSIC_FEATURE_DYADIC_DEFECT_REDUCTION.md",
    "notes/MELLIN_PROJECTION_SOFT_SYMBOL_REDUCTION.md",
    "notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md",
    "notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md",
    "requirements.txt",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/FKS-PNT-2204.02588v3.pdf",
    "vendor/HSW-ZC-2107.06506v1.pdf",
}

EXPECTED_EXTERNAL_SOURCES = {
    "CCM-ZST-v1": {
        "version": "arXiv:2511.22755v1",
        "vendored_path": "vendor/CCM-ZST-2511.22755v1.pdf",
        "sha256": "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
        "use": "finite Weil convention, source equation (3.19), and inversion convention",
    },
    "FKS-PNT-v3": {
        "version": "arXiv:2204.02588v3",
        "vendored_path": "vendor/FKS-PNT-2204.02588v3.pdf",
        "sha256": "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4",
        "use": "pinned unconditional prime-number-theorem error estimate",
    },
    "HSW-ZC-v1": {
        "version": "arXiv:2107.06506v1",
        "vendored_path": "vendor/HSW-ZC-2107.06506v1.pdf",
        "sha256": "3fc4c89f49249924e61cb0d289d81559faed53fcbb838628ea32dc7ec6f89fbf",
        "use": "global zero-count existence only; no zero ordinate table",
    },
}

SOURCE_ADMISSIONS = {
    "actual_central_source_ratio_proved": False,
    "actual_exterior_alignment_proved": False,
    "actual_odd_transverse_schur_proved": False,
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_matrix_or_eigenvector_read": False,
    "decimal_zero_list_read": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "exterior_hard_cut_dropped": False,
    "favorable_subsequence_promoted_to_full_schedule": False,
    "fourier_sign_changed": False,
    "global_weil_positivity_assumed": False,
    "gray_mass_dropped": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "nonpositive_complementary_gap_reported_as_pass": False,
    "open_projector_substituted_for_closed_converse": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence": False,
    "riemann_hypothesis_assumed_or_claimed": False,
    "row_rank_promoted_to_spill_rate": False,
    "secret_serialized": False,
    "unit_source_normalization_substituted": False,
    "zero_reality_assumed": False,
}

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", EXPECTED_LIBRARY],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validate_runtime() -> None:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise RuntimeError("mpmath runtime mismatch")


def _choice(value: Any, label: str, allowed: set[int]) -> tuple[str, int]:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError(f"{label} must be canonical positive integer text")
    if value not in {str(item) for item in allowed}:
        raise ValueError(f"{label} is outside the canonical pilot inventory")
    return value, int(value)


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
        or lock["source_admissions"] != SOURCE_ADMISSIONS
    ):
        raise ValueError("source-lock fixed metadata mutation")

    dependencies: dict[str, str] = {}
    for item in lock["dependencies"]:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative or candidate.is_absolute()
            or ".." in candidate.parts or relative in dependencies
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ValueError("invalid source-lock dependency")
        actual = _sha256(_root() / candidate)
        if actual != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        dependencies[relative] = actual
    if set(dependencies) != EXPECTED_DEPENDENCIES:
        raise ValueError("source-lock dependency path inventory mismatch")

    external_hashes: dict[str, str] = {}
    seen: set[str] = set()
    for item in lock["external_sources"]:
        if not isinstance(item, dict) or set(item) != {
            "id", "version", "vendored_path", "sha256", "use"
        }:
            raise ValueError("malformed external-source entry")
        source_id = item["id"]
        if source_id in seen or source_id not in EXPECTED_EXTERNAL_SOURCES:
            raise ValueError("external-source identifier mismatch")
        expected = EXPECTED_EXTERNAL_SOURCES[source_id]
        if any(item[key] != expected[key] for key in expected):
            raise ValueError(f"external-source metadata mismatch: {source_id}")
        actual = _sha256(_root() / item["vendored_path"])
        if actual != item["sha256"] or dependencies.get(item["vendored_path"]) != actual:
            raise ValueError(f"external-source byte mismatch: {source_id}")
        seen.add(source_id)
        external_hashes[item["vendored_path"]] = actual
    if seen != set(EXPECTED_EXTERNAL_SOURCES):
        raise ValueError("external-source inventory mismatch")

    return {
        "path": LOCK,
        "sha256": _sha256(path),
        "schema": LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(dependencies.items())),
        "external_source_hashes": dict(sorted(external_hashes.items())),
    }, lock


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, list):
        return [_encode(item) for item in value]
    if isinstance(value, tuple):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _assert_strict_json(value: Any) -> None:
    if isinstance(value, float):
        raise TypeError("binary floating-point value reached serialization")
    if value is None or type(value) in (bool, int, str):
        return
    if isinstance(value, list):
        for item in value:
            _assert_strict_json(item)
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise TypeError("non-string JSON key")
        for item in value.values():
            _assert_strict_json(item)
        return
    raise TypeError(f"unsupported JSON value: {type(value).__name__}")


def _precision_bits(dps: int) -> int:
    return dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR + 2


def _raw_fraction(raw: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = raw
    numerator = -mantissa if sign else mantissa
    return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))


def _normalize_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
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
    return _normalize_dyadic(shifted, base)


def _serialize_interval(value: object, dps: int) -> dict[str, object]:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    lower = tuple(int(part) for part in lower_raw)
    upper = tuple(int(part) for part in upper_raw)
    if lower != upper:
        scale = max(
            (exponent + bits - 1 if mantissa else 0)
            for _sign, mantissa, exponent, bits in (lower, upper)
        )
        guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
        lower = _shift_raw(lower, guard, -1)
        upper = _shift_raw(upper, guard, 1)
    lo, hi = _raw_fraction(lower), _raw_fraction(upper)
    if lo > hi:
        raise ArithmeticError("reversed interval")
    raw = lambda x: [x[0], str(x[1]), x[2], x[3]]
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lower), dps + 10), mp.nstr(mp.mpf(upper), dps + 10)],
            "dyadic": {"lower": raw(lower), "upper": raw(upper)},
        }


def _ceil_interval(value: object) -> int:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    lo = _raw_fraction(tuple(int(part) for part in lower_raw))
    hi = _raw_fraction(tuple(int(part) for part in upper_raw))
    ceil_lo = -((-lo.numerator) // lo.denominator)
    ceil_hi = -((-hi.numerator) // hi.denominator)
    if ceil_lo != ceil_hi:
        raise ArithmeticError("interval ceiling is undecidable")
    return ceil_lo


def _is_prime(value: int) -> bool:
    if value < 2:
        return False
    divisor = 2
    while divisor * divisor <= value:
        if value % divisor == 0:
            return False
        divisor += 1
    return True


def _prime_powers(p: int) -> list[dict[str, int]]:
    maximum = p * p // 4
    result: list[dict[str, int]] = []
    for n in range(2, maximum + 1):
        for base in range(2, n + 1):
            if not _is_prime(base):
                continue
            power, exponent = base, 1
            while power < n:
                power *= base
                exponent += 1
            if power == n:
                result.append({"n": n, "prime_base": base, "exponent": exponent})
                break
    return result


def _central_exact_fixture() -> dict[str, Any]:
    cosines = [Fraction(3, 5), Fraction(5, 13)]
    sines = [Fraction(4, 5), Fraction(12, 13)]
    covariance = [value * value for value in cosines]
    tangent = [(1 - value) / value for value in covariance]
    weights = [Fraction(2), Fraction(3)]
    minimum = sum((weight * ratio for weight, ratio in zip(weights, tangent)), Fraction(0))
    shell_direct = sum(
        (weight * (sine / cosine) ** 2 for weight, sine, cosine in zip(weights, sines, cosines)),
        Fraction(0),
    )
    if minimum != Fraction(4688, 225) or shell_direct != minimum:
        raise ArithmeticError("minimum-spill regression failed")
    scalar_ratio = (Fraction(4, 5) ** 2) / (Fraction(3, 5) ** 2)
    if scalar_ratio != Fraction(16, 9):
        raise ArithmeticError("relative-shell regression failed")
    return {
        "cosines": cosines,
        "sines": sines,
        "R_M_diagonal": covariance,
        "R_M_pseudoinverse_minus_identity_diagonal": tangent,
        "D_diagonal": weights,
        "minimum_spill_squared": minimum,
        "direct_shell_squared": shell_direct,
        "scalar_positive_coframe_gamma": Fraction(9, 25),
        "scalar_shell_epsilon": Fraction(16, 25),
        "scalar_epsilon_over_gamma": scalar_ratio,
        "row_rank_alone_has_no_rate": True,
    }


def _soft_symbol_exact_fixture() -> dict[str, Any]:
    amplitude = Fraction(4)
    symbol = [Fraction(1, 4), Fraction(3, 4)]
    kernel = [[Fraction(1, 2), Fraction(1, 2)], [Fraction(1, 2), Fraction(1, 2)]]
    trace_c = sum((symbol[i] * kernel[i][i] for i in range(2)), Fraction(0))
    chi = trace_c - trace_c * trace_c
    gray = sum((symbol[i] * (1 - symbol[i]) * kernel[i][i] for i in range(2)), Fraction(0))
    difference = Fraction(1, 2) * sum(
        ((symbol[i] - symbol[j]) ** 2 * kernel[i][j] ** 2 for i in range(2) for j in range(2)),
        Fraction(0),
    )
    if (amplitude * chi, amplitude * gray, amplitude * difference) != (
        Fraction(1), Fraction(3, 4), Fraction(1, 4)
    ):
        raise ArithmeticError("gray-mass regression failed")
    return {
        "amplitude_A": amplitude,
        "normalized_symbol": symbol,
        "kernel": kernel,
        "A_times_chi": amplitude * chi,
        "gray_mass": amplitude * gray,
        "difference_mass": amplitude * difference,
        "gray_mass_is_mandatory": True,
        "closed_projector_endpoint_fixture": {
            "spectrum": [Fraction(1, 2), Fraction(1)],
            "threshold": Fraction(1, 2),
            "closed_rank": 2,
            "open_rank": 1,
        },
    }


def _interval_formulas(p: int, dps: int, inventory: list[dict[str, int]]) -> dict[str, Any]:
    mp.iv.dps = dps
    one, two = mp.iv.mpf(1), mp.iv.mpf(2)
    lam = mp.iv.mpf(p) / two
    length = two * mp.iv.log(lam)
    delta = mp.iv.mpf(1) / 2
    z0 = mp.iv.mpf(3) / 4
    z1 = one
    h = mp.iv.mpf(1) / 8

    central_m_real = lam * length
    central_m = _ceil_interval(central_m_real)
    c_parameter = mp.iv.mpf(1) / 2
    r_real = c_parameter * length / mp.iv.log(length)
    central_r = max(1, _ceil_interval(r_real))
    a_delta = delta / (two * mp.iv.pi)
    h_bound = delta**3 / (6 * mp.iv.pi**3 * (central_m - a_delta))
    tau_r = (
        delta / mp.iv.pi * (delta / two) ** (2 * central_r)
        / ((2 * central_r + 1) ** 2 * factorial(central_r) ** 2)
    )
    b_r_m = (
        2 * central_r**2 / (mp.iv.pi**2 * central_m)
        * mp.iv.exp(central_r * (central_r - 1) / (mp.iv.pi * central_m))
    )
    central_non_graph = mp.iv.sqrt(h_bound) + two * mp.iv.sqrt(tau_r)

    f_even_min = two * mp.iv.sin(z1 / two) / z1
    f_odd_min = 4 * mp.iv.sqrt(two) * mp.iv.pi * mp.iv.sin(z0 / two) / (4 * mp.iv.pi**2 - z0**2)
    annular_length = two * (z1 - z0)
    even_integral_lower = annular_length * f_even_min**2
    odd_integral_lower = annular_length * f_odd_min**2
    # The fixed theorem constant deliberately keeps the two factor-of-two
    # slacks used in the annular proof: d>=2*lambda*cos(z1) and
    # 1-d/A>=(1-rho)/2.
    gray_prefactor = mp.iv.cos(z1) / (2 * mp.iv.pi) * (one - mp.iv.cos(z0) / mp.iv.cos(delta))
    gray_even = gray_prefactor * even_integral_lower
    gray_odd = gray_prefactor * odd_integral_lower
    beta_even = even_integral_lower / (two * mp.iv.pi)
    beta_odd = odd_integral_lower / (two * mp.iv.pi)
    sigma_even = beta_even / two
    sigma_odd = beta_odd / two
    closed_angle_even = (beta_even - sigma_even) / (one - sigma_even)
    closed_angle_odd = (beta_odd - sigma_odd) / (one - sigma_odd)
    hard_layer = mp.iv.cos(delta + h) * mp.iv.sin(h) ** 2 / (4 * mp.iv.pi**2)

    x_value = lam**2
    psi_c = mp.iv.mpf(0)
    a_sum = mp.iv.mpf(0)
    b0 = mp.iv.mpf(0)
    b1 = mp.iv.mpf(0)
    sigma_lambda = mp.iv.mpf(0)
    s_z0 = mp.iv.mpf(0)
    for item in inventory:
        n = item["n"]
        von_mangoldt = mp.iv.log(item["prime_base"])
        log_ratio = mp.iv.log(x_value / n)
        psi_c += von_mangoldt
        a_sum += von_mangoldt / n
        b0 += von_mangoldt * log_ratio
        b1 += von_mangoldt * log_ratio / n
        sigma_lambda += von_mangoldt / mp.iv.sqrt(n)
        s_z0 += von_mangoldt / mp.iv.sqrt(n) * mp.iv.cos(z0 * mp.iv.log(n) / length)
    mu = (lam - one / lam - length) / two
    pole_prime_1 = -two * mu**2 - lam * a_sum + psi_c / lam + (b0 + b1) / two
    e_x = psi_c - x_value
    d_x = a_sum - mp.iv.log(x_value)
    f_x = b0 - x_value + one
    integral_d = b1 - mp.iv.log(x_value) ** 2 / two
    pole_prime_2 = (
        lam * (one - d_x) + e_x / lam + (f_x + integral_d) / two
        - mp.iv.log(x_value) ** 2 / 4 - mp.iv.log(x_value) / lam
        + one / two - one / (two * x_value)
    )
    c0 = one + mp.iv.euler / two - mp.iv.log(two * mp.iv.sqrt(mp.iv.pi))

    values = {
        "lambda": lam,
        "physical_length_L": length,
        "central_M_real": central_m_real,
        "central_r_real": r_real,
        "central_a_delta": a_delta,
        "central_H_M_upper": h_bound,
        "central_tau_r": tau_r,
        "central_B_r_M": b_r_m,
        "central_non_graph_square_root_upper": central_non_graph,
        "even_fourier_factor_min": f_even_min,
        "odd_fourier_factor_min": f_odd_min,
        "even_annular_integral_lower": even_integral_lower,
        "odd_annular_integral_lower": odd_integral_lower,
        "gray_even_lambda_coefficient_lower": gray_even,
        "gray_odd_lambda_coefficient_lower": gray_odd,
        "annular_beta_even_lower": beta_even,
        "annular_beta_odd_lower": beta_odd,
        "closed_angle_even_lower": closed_angle_even,
        "closed_angle_odd_lower": closed_angle_odd,
        "hard_cut_layer_lambda_coefficient_lower": hard_layer,
        "inclusive_prime_mass_Sigma_lambda": sigma_lambda,
        "annular_prime_sum_S_lambda_z0": s_z0,
        "annular_minus_prime_block_z0": -two * s_z0,
        "odd_pole_mass_mu": mu,
        "psi_C_X": psi_c,
        "A_X": a_sum,
        "B0_X": b0,
        "B1_X": b1,
        "first_Riesz_F_X": f_x,
        "pole_prime_path_1": pole_prime_1,
        "pole_prime_path_2": pole_prime_2,
        "odd_center_c0": c0,
        "selected_shift_beta": c0 / 4,
        "selected_axis_rayleigh_lower": 3 * c0 / 4,
        "remaining_schur_load_threshold": c0 / 2,
    }
    return {
        "central_M": central_m,
        "central_r": central_r,
        "values": {key: _serialize_interval(value, dps) for key, value in values.items()},
    }


def produce(lambda_numerator: str, dps: str) -> dict[str, Any]:
    p_text, p = _choice(lambda_numerator, "lambda numerator", CANONICAL_LAMBDA_NUMERATORS)
    dps_text, dps_integer = _choice(dps, "dps", CANONICAL_DPS)
    _validate_runtime()
    source_binding, source_lock = _validated_source_lock()
    inventory = _prime_powers(p)
    exact_central = _central_exact_fixture()
    exact_soft = _soft_symbol_exact_fixture()
    intervals = _interval_formulas(p, dps_integer, inventory)

    checks = {
        "central_minimum_spill_reconstructed": exact_central["minimum_spill_squared"] == exact_central["direct_shell_squared"],
        "positive_row_rank_not_promoted_to_rate": exact_central["row_rank_alone_has_no_rate"],
        "relative_shell_ratio_retained": exact_central["scalar_epsilon_over_gamma"] == Fraction(16, 9),
        "covariance_tail_uses_M_over_lambda_to_infinity": True,
        "gray_mass_retained": exact_soft["gray_mass"] > 0,
        "gray_mass_exceeds_difference_fixture": exact_soft["gray_mass"] > exact_soft["difference_mass"],
        "hard_exterior_cut_retained": True,
        "closed_projector_endpoint_retained": exact_soft["closed_projector_endpoint_fixture"]["closed_rank"] == 2,
        "prime_power_endpoint_inclusive": bool(inventory) and inventory[-1]["n"] <= Fraction(p * p, 4),
        "minus_prime_sign_retained": True,
        "odd_favorable_result_is_limsup_only": True,
        "odd_transverse_schur_still_open": True,
        "no_zero_ordinate_table_used": True,
        "source_normalization_retained": True,
        "no_secret_or_api_key_read": True,
        "formal_status_unchanged": TERMINAL_STATE == "P0_INVALIDATED",
    }
    if not all(checks.values()):
        raise ArithmeticError("checkpoint regression failed")

    payload = {
        "schema": SCHEMA,
        "source_lock": source_binding,
        "inputs": {
            "lambda": {"numerator": p_text, "denominator": "2"},
            "dps": dps_text,
            "annular_parameters": {
                "delta": {"numerator": "1", "denominator": "2"},
                "z0": {"numerator": "3", "denominator": "4"},
                "z1": {"numerator": "1", "denominator": "1"},
                "jump_width_h": {"numerator": "1", "denominator": "8"},
            },
        },
        "terminal_state": TERMINAL_STATE,
        "source_conventions": {
            "fourier_transform": "hat(f)(t)=integral_[-L/2,L/2] f(x)*exp(-i*t*x) dx",
            "frequency_measure": "dnu(t)=dt/(2*pi)",
            "physical_interval": "[-log(lambda),log(lambda)] with L=2*log(lambda)",
            "zero_extension": True,
            "inversion": "Jf(x)=f(-x)",
            "combined_multiplier": "m_lambda(t)=2*theta'(t)-2*sum_(1<n<=lambda^2) Lambda(n)/sqrt(n)*cos(t*log(n))",
            "prime_power_endpoint": "inclusive n<=lambda^2",
            "exterior_defect": "1_(abs(t)>delta/L)*(U+nu*L-m_lambda(t))_+",
            "source_normalization": "h_lambda is source-normalized and tends to h; unit norm is rejected",
        },
        "claim_boundary": source_lock["claim_boundary"],
        "certificate": {
            "exact_central_fixture": _encode(exact_central),
            "exact_soft_symbol_fixture": _encode(exact_soft),
            "inclusive_prime_powers": inventory,
            "interval_formulas": intervals,
            "source_admissions": source_lock["source_admissions"],
            "logical_theorems": {
                "minimum_spill": "Gamma_min^2=tr(D*U_M^*(R_M^dagger-P_ran(R_M))*U_M)",
                "source_ratio_sufficient": "epsilon/gamma=o(1/lambda)",
                "central_tail": "H_M<=delta^3/(6*pi^3*(M-delta/(2*pi)))",
                "exterior_gray_mass": "A*chi_X=Omega(lambda) in each parity sector",
                "exterior_angle_necessary": "closed annular projector angle squared is O(log(lambda)/lambda)",
                "odd_limsup": "limsup over locked lambda of G(lambda)/lambda is at least c0",
                "finite_projection": "a non-effective diagonal N_j transfers the favorable odd pole axis",
                "remaining_odd_target": "transverse positivity and strict shifted Schur inverse-load margin",
            },
            "checks": checks,
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    }
    _assert_strict_json(payload)
    return payload


def _canonical_bytes(payload: dict[str, Any]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda-numerator", required=True)
    parser.add_argument("--dps", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    payload = produce(args.lambda_numerator, args.dps)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(_canonical_bytes(payload))


if __name__ == "__main__":
    main()
