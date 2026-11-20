#!/usr/bin/env python3
"""Independent replay for the covariance/annular/odd-subsequence artifact."""
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


PRODUCER_SCHEMA = "xi-prolate-covariance-annular-odd-subsequence-v1"
REPLAY_SCHEMA = "xi-prolate-covariance-annular-odd-subsequence-replay-v1"
LOCK = "COVARIANCE_ANNULAR_ODD_SUBSEQUENCE_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-covariance-annular-odd-subsequence-source-lock-v1"
CLAIM_CLASS = "COVARIANCE_ANNULAR_ODD_FAVORABLE_SUBSEQUENCE_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_SOURCE_LOCK_SHA256 = "eb20eecf970af6c9dd95c28bbb602e1cb8ee439a95bfd736cccd6c17a21730c8"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDA_NUMERATORS = {"5", "9"}
CANONICAL_DPS = {"80", "160"}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")
_SHA256 = re.compile(r"[0-9a-f]{64}\Z")

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15

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

EXPECTED_ADMISSIONS = {
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

EXPECTED_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", "mpmath.iv 1.4.1"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}


class ReplayError(ValueError):
    pass


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _reject_float(value: Any, path: str = "root") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path}")
    if value is None or type(value) in (bool, int, str):
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            _reject_float(item, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise ReplayError(f"non-string key at {path}")
        for key, item in value.items():
            _reject_float(item, f"{path}.{key}")
        return
    raise ReplayError(f"unsupported value at {path}")


def _fraction(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"malformed rational: {label}")
    numerator, denominator = value["numerator"], value["denominator"]
    if not isinstance(numerator, str) or not isinstance(denominator, str):
        raise ReplayError(f"non-text rational: {label}")
    try:
        result = Fraction(int(numerator), int(denominator))
    except (ValueError, ZeroDivisionError) as exc:
        raise ReplayError(f"invalid rational: {label}") from exc
    if str(result.numerator) != numerator or str(result.denominator) != denominator:
        raise ReplayError(f"noncanonical rational: {label}")
    return result


def _raw_fraction(value: Any, label: str) -> Fraction:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"malformed raw endpoint: {label}")
    sign, mantissa_text, exponent, bits = value
    if sign not in (0, 1) or not isinstance(mantissa_text, str) or not isinstance(exponent, int) or not isinstance(bits, int):
        raise ReplayError(f"invalid raw endpoint: {label}")
    if not mantissa_text.isdigit() or (mantissa_text.startswith("0") and mantissa_text != "0"):
        raise ReplayError(f"noncanonical mantissa: {label}")
    mantissa = int(mantissa_text)
    if mantissa == 0:
        if (sign, exponent, bits) != (0, 0, 0):
            raise ReplayError(f"noncanonical zero endpoint: {label}")
        return Fraction(0)
    if mantissa % 2 == 0 or bits != mantissa.bit_length():
        raise ReplayError(f"nonnormalized endpoint: {label}")
    numerator = -mantissa if sign else mantissa
    return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))


def _interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"malformed interval: {label}")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if not isinstance(decimal, list) or len(decimal) != 2 or not all(isinstance(item, str) for item in decimal):
        raise ReplayError(f"malformed decimal interval: {label}")
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ReplayError(f"malformed dyadic interval: {label}")
    lo = _raw_fraction(dyadic["lower"], f"{label}.lower")
    hi = _raw_fraction(dyadic["upper"], f"{label}.upper")
    if lo > hi:
        raise ReplayError(f"reversed interval: {label}")
    try:
        dlo, dhi = mp.mpf(decimal[0]), mp.mpf(decimal[1])
    except ValueError as exc:
        raise ReplayError(f"unparseable decimal interval: {label}") from exc
    if not (mp.isfinite(dlo) and mp.isfinite(dhi)) or dlo > dhi:
        raise ReplayError(f"invalid decimal interval: {label}")
    scale = max(abs(lo.numerator).bit_length() - lo.denominator.bit_length(), abs(hi.numerator).bit_length() - hi.denominator.bit_length(), 0)
    cap_exponent = scale - (dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR + 2) + 24
    cap = Fraction(2**cap_exponent) if cap_exponent >= 0 else Fraction(1, 2 ** (-cap_exponent))
    if hi - lo > cap:
        raise ReplayError(f"overwide interval: {label}")
    return lo, hi


def _iv_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    def convert(raw: object) -> Fraction:
        sign, mantissa, exponent, _bits = (int(part) for part in raw)  # type: ignore[arg-type]
        numerator = -mantissa if sign else mantissa
        return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))
    return convert(lower), convert(upper)


def _contains(serialized: Any, value: object, label: str, dps: int) -> None:
    lo, hi = _interval(serialized, label, dps)
    expected_lo, expected_hi = _iv_bounds(value)
    if lo > expected_lo or hi < expected_hi:
        raise ReplayError(f"interval does not enclose independent reconstruction: {label}")


def _validate_lock() -> tuple[dict[str, Any], dict[str, Any]]:
    path = _root() / LOCK
    actual_lock_hash = _sha256(path)
    if actual_lock_hash != EXPECTED_SOURCE_LOCK_SHA256:
        raise ReplayError("source-lock byte hash mismatch")
    lock = json.loads(path.read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    if (
        lock["schema"] != LOCK_SCHEMA or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE or lock["updated_date"] != UPDATED_DATE
        or lock["source_admissions"] != EXPECTED_ADMISSIONS
    ):
        raise ReplayError("source-lock fixed metadata mutation")
    dependencies: dict[str, str] = {}
    if not isinstance(lock["dependencies"], list):
        raise ReplayError("source-lock dependency list missing")
    for item in lock["dependencies"]:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative or candidate.is_absolute()
            or ".." in candidate.parts or relative in dependencies
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ReplayError("invalid source-lock dependency")
        actual = _sha256(_root() / candidate)
        if actual != expected:
            raise ReplayError(f"dependency byte mismatch: {relative}")
        dependencies[relative] = actual
    if set(dependencies) != EXPECTED_DEPENDENCIES:
        raise ReplayError("source-lock dependency inventory mismatch")

    external_hashes: dict[str, str] = {}
    seen: set[str] = set()
    if not isinstance(lock["external_sources"], list):
        raise ReplayError("external source list missing")
    for item in lock["external_sources"]:
        if not isinstance(item, dict) or set(item) != {"id", "version", "vendored_path", "sha256", "use"}:
            raise ReplayError("malformed external source")
        source_id = item["id"]
        if source_id in seen or source_id not in EXPECTED_EXTERNAL_SOURCES:
            raise ReplayError("external source identifier mismatch")
        expected = EXPECTED_EXTERNAL_SOURCES[source_id]
        if any(item[key] != expected[key] for key in expected):
            raise ReplayError(f"external source metadata mismatch: {source_id}")
        actual = _sha256(_root() / item["vendored_path"])
        if actual != item["sha256"] or dependencies.get(item["vendored_path"]) != actual:
            raise ReplayError(f"external source byte mismatch: {source_id}")
        seen.add(source_id)
        external_hashes[item["vendored_path"]] = actual
    if seen != set(EXPECTED_EXTERNAL_SOURCES):
        raise ReplayError("external source inventory mismatch")
    binding = {
        "path": LOCK,
        "sha256": actual_lock_hash,
        "schema": LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(dependencies.items())),
        "external_source_hashes": dict(sorted(external_hashes.items())),
    }
    return binding, lock


def _is_prime(value: int) -> bool:
    if value < 2:
        return False
    if value % 2 == 0:
        return value == 2
    divisor = 3
    while divisor * divisor <= value:
        if value % divisor == 0:
            return False
        divisor += 2
    return True


def _inventory(p: int) -> list[dict[str, int]]:
    result: list[dict[str, int]] = []
    for base in range(2, p * p // 4 + 1):
        if not _is_prime(base):
            continue
        value, exponent = base, 1
        while value <= p * p // 4:
            result.append({"n": value, "prime_base": base, "exponent": exponent})
            value *= base
            exponent += 1
    return sorted(result, key=lambda item: item["n"])


def _check_exact_fixtures(certificate: dict[str, Any]) -> None:
    central = certificate.get("exact_central_fixture")
    if not isinstance(central, dict) or set(central) != {
        "cosines", "sines", "R_M_diagonal", "R_M_pseudoinverse_minus_identity_diagonal",
        "D_diagonal", "minimum_spill_squared", "direct_shell_squared",
        "scalar_positive_coframe_gamma", "scalar_shell_epsilon",
        "scalar_epsilon_over_gamma", "row_rank_alone_has_no_rate",
    }:
        raise ReplayError("central fixture inventory mismatch")
    cosines = [_fraction(item, "central cosine") for item in central["cosines"]]
    sines = [_fraction(item, "central sine") for item in central["sines"]]
    if cosines != [Fraction(3, 5), Fraction(5, 13)] or sines != [Fraction(4, 5), Fraction(12, 13)]:
        raise ReplayError("central direction mutation")
    covariance = [cosine**2 for cosine in cosines]
    tangent = [sine**2 / cosine**2 for sine, cosine in zip(sines, cosines)]
    weights = [Fraction(2), Fraction(3)]
    minimum = sum((weight * ratio for weight, ratio in zip(weights, tangent)), Fraction(0))
    if [_fraction(item, "R diagonal") for item in central["R_M_diagonal"]] != covariance:
        raise ReplayError("central covariance mutation")
    if [_fraction(item, "tangent diagonal") for item in central["R_M_pseudoinverse_minus_identity_diagonal"]] != tangent:
        raise ReplayError("central tangent mutation")
    if [_fraction(item, "D diagonal") for item in central["D_diagonal"]] != weights:
        raise ReplayError("central weight mutation")
    if _fraction(central["minimum_spill_squared"], "minimum spill") != minimum or minimum != Fraction(4688, 225):
        raise ReplayError("minimum-spill identity failed")
    if _fraction(central["direct_shell_squared"], "direct shell") != minimum:
        raise ReplayError("direct-shell identity failed")
    gamma = _fraction(central["scalar_positive_coframe_gamma"], "gamma")
    epsilon = _fraction(central["scalar_shell_epsilon"], "epsilon")
    if (gamma, epsilon, _fraction(central["scalar_epsilon_over_gamma"], "ratio")) != (Fraction(9, 25), Fraction(16, 25), Fraction(16, 9)):
        raise ReplayError("relative-shell fixture failed")
    if central["row_rank_alone_has_no_rate"] is not True:
        raise ReplayError("row rank was promoted to a rate")

    soft = certificate.get("exact_soft_symbol_fixture")
    if not isinstance(soft, dict) or set(soft) != {
        "amplitude_A", "normalized_symbol", "kernel", "A_times_chi", "gray_mass",
        "difference_mass", "gray_mass_is_mandatory", "closed_projector_endpoint_fixture",
    }:
        raise ReplayError("soft-symbol fixture inventory mismatch")
    amplitude = _fraction(soft["amplitude_A"], "amplitude")
    symbol = [_fraction(item, "symbol") for item in soft["normalized_symbol"]]
    kernel = [[_fraction(item, "kernel") for item in row] for row in soft["kernel"]]
    trace_c = sum((symbol[i] * kernel[i][i] for i in range(2)), Fraction(0))
    chi = trace_c - trace_c**2
    gray = sum((symbol[i] * (1 - symbol[i]) * kernel[i][i] for i in range(2)), Fraction(0))
    difference = Fraction(1, 2) * sum(
        ((symbol[i] - symbol[j]) ** 2 * kernel[i][j] ** 2 for i in range(2) for j in range(2)),
        Fraction(0),
    )
    if amplitude != 4 or _fraction(soft["A_times_chi"], "A chi") != amplitude * chi:
        raise ReplayError("soft transition identity failed")
    if _fraction(soft["gray_mass"], "gray") != amplitude * gray or _fraction(soft["difference_mass"], "difference") != amplitude * difference:
        raise ReplayError("gray/difference decomposition failed")
    if soft["gray_mass_is_mandatory"] is not True or amplitude * gray <= 0:
        raise ReplayError("gray mass was dropped")
    endpoint = soft["closed_projector_endpoint_fixture"]
    if not isinstance(endpoint, dict) or set(endpoint) != {"spectrum", "threshold", "closed_rank", "open_rank"}:
        raise ReplayError("endpoint fixture malformed")
    spectrum = [_fraction(item, "endpoint spectrum") for item in endpoint["spectrum"]]
    threshold = _fraction(endpoint["threshold"], "endpoint threshold")
    if endpoint["closed_rank"] != sum(value >= threshold for value in spectrum) or endpoint["open_rank"] != sum(value > threshold for value in spectrum):
        raise ReplayError("closed spectral endpoint was changed")


def _independent_intervals(p: int, dps: int, inventory: list[dict[str, int]]) -> tuple[int, int, dict[str, object]]:
    mp.iv.dps = dps
    q = mp.iv.mpf
    lam = q(p) / q(2)
    length = mp.iv.log(lam) * q(2)
    delta, z0, z1, h = q(1) / q(2), q(3) / q(4), q(1), q(1) / q(8)

    def ceil_iv(value: object) -> int:
        lo, hi = _iv_bounds(value)
        a = -((-lo.numerator) // lo.denominator)
        b = -((-hi.numerator) // hi.denominator)
        if a != b:
            raise ReplayError("independent interval ceiling undecidable")
        return a

    m_real = length * lam
    m_index = ceil_iv(m_real)
    r_real = length / (q(2) * mp.iv.log(length))
    r_index = max(1, ceil_iv(r_real))
    a_delta = delta / (q(2) * mp.iv.pi)
    h_bound = (delta * delta * delta) / (q(6) * mp.iv.pi**3 * (q(m_index) - a_delta))
    tau = delta * (delta / q(2)) ** (q(2) * r_index) / (
        mp.iv.pi * q((2 * r_index + 1) ** 2 * factorial(r_index) ** 2)
    )
    b_value = q(2 * r_index**2) * mp.iv.exp(q(r_index * (r_index - 1)) / (mp.iv.pi * m_index)) / (mp.iv.pi**2 * m_index)
    central_bound = q(2) * mp.iv.sqrt(tau) + mp.iv.sqrt(h_bound)

    f_even = mp.iv.sin(z1 / q(2)) * q(2) / z1
    f_odd = q(4) * mp.iv.pi * mp.iv.sqrt(q(2)) * mp.iv.sin(z0 / q(2)) / (q(4) * mp.iv.pi**2 - z0**2)
    even_integral = q(2) * (z1 - z0) * f_even**2
    odd_integral = q(2) * (z1 - z0) * f_odd**2
    prefactor = mp.iv.cos(z1) * (mp.iv.cos(delta) - mp.iv.cos(z0)) / (q(2) * mp.iv.pi * mp.iv.cos(delta))
    gray_even, gray_odd = prefactor * even_integral, prefactor * odd_integral
    beta_even, beta_odd = even_integral / (q(2) * mp.iv.pi), odd_integral / (q(2) * mp.iv.pi)
    angle_even = (beta_even / q(2)) / (q(1) - beta_even / q(2))
    angle_odd = (beta_odd / q(2)) / (q(1) - beta_odd / q(2))
    hard_layer = mp.iv.sin(h) ** 2 * mp.iv.cos(delta + h) / (q(4) * mp.iv.pi**2)

    x_value = lam * lam
    psi_c = q(0)
    a_sum = q(0)
    b0 = q(0)
    b1 = q(0)
    sigma_lambda = q(0)
    s_z0 = q(0)
    for item in sorted(inventory, key=lambda entry: (entry["prime_base"], entry["exponent"])):
        n, base = item["n"], item["prime_base"]
        log_base = mp.iv.log(q(base))
        log_x_over_n = mp.iv.log(x_value) - mp.iv.log(q(n))
        psi_c = psi_c + log_base
        a_sum = a_sum + log_base / q(n)
        b0 = b0 + log_base * log_x_over_n
        b1 = b1 + (log_base / q(n)) * log_x_over_n
        sigma_lambda = sigma_lambda + log_base / mp.iv.sqrt(q(n))
        s_z0 = s_z0 + (log_base / mp.iv.sqrt(q(n))) * mp.iv.cos((z0 / length) * mp.iv.log(q(n)))
    mu = (lam - q(1) / lam - length) / q(2)
    pole_1 = (b0 + b1) / q(2) + psi_c / lam - lam * a_sum - q(2) * mu**2
    e_x = psi_c - x_value
    d_x = a_sum - mp.iv.log(x_value)
    f_x = b0 - x_value + q(1)
    integral_d = b1 - mp.iv.log(x_value) ** 2 / q(2)
    pole_2 = (
        (f_x + integral_d) / q(2) + e_x / lam + lam * (q(1) - d_x)
        - mp.iv.log(x_value) ** 2 / q(4) - mp.iv.log(x_value) / lam
        + q(1) / q(2) - q(1) / (q(2) * x_value)
    )
    c0 = q(1) - mp.iv.log(q(2)) - mp.iv.log(mp.iv.pi) / q(2) + mp.iv.euler / q(2)

    return m_index, r_index, {
        "lambda": lam,
        "physical_length_L": length,
        "central_M_real": m_real,
        "central_r_real": r_real,
        "central_a_delta": a_delta,
        "central_H_M_upper": h_bound,
        "central_tau_r": tau,
        "central_B_r_M": b_value,
        "central_non_graph_square_root_upper": central_bound,
        "even_fourier_factor_min": f_even,
        "odd_fourier_factor_min": f_odd,
        "even_annular_integral_lower": even_integral,
        "odd_annular_integral_lower": odd_integral,
        "gray_even_lambda_coefficient_lower": gray_even,
        "gray_odd_lambda_coefficient_lower": gray_odd,
        "annular_beta_even_lower": beta_even,
        "annular_beta_odd_lower": beta_odd,
        "closed_angle_even_lower": angle_even,
        "closed_angle_odd_lower": angle_odd,
        "hard_cut_layer_lambda_coefficient_lower": hard_layer,
        "inclusive_prime_mass_Sigma_lambda": sigma_lambda,
        "annular_prime_sum_S_lambda_z0": s_z0,
        "annular_minus_prime_block_z0": -q(2) * s_z0,
        "odd_pole_mass_mu": mu,
        "psi_C_X": psi_c,
        "A_X": a_sum,
        "B0_X": b0,
        "B1_X": b1,
        "first_Riesz_F_X": f_x,
        "pole_prime_path_1": pole_1,
        "pole_prime_path_2": pole_2,
        "odd_center_c0": c0,
        "selected_shift_beta": c0 / q(4),
        "selected_axis_rayleigh_lower": q(3) * c0 / q(4),
        "remaining_schur_load_threshold": c0 / q(2),
    }


def replay(payload: dict[str, Any], producer_bytes: bytes | None = None) -> dict[str, Any]:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise ReplayError("mpmath runtime mismatch")
    _reject_float(payload)
    if not isinstance(payload, dict) or set(payload) != {
        "schema", "source_lock", "inputs", "terminal_state", "source_conventions",
        "claim_boundary", "certificate", "arithmetic_libraries",
    }:
        raise ReplayError("producer payload inventory mismatch")
    if payload["schema"] != PRODUCER_SCHEMA or payload["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("producer schema or terminal-state mutation")
    if payload["arithmetic_libraries"] != EXPECTED_LIBRARIES:
        raise ReplayError("arithmetic-library disclosure mutation")

    live_binding, lock = _validate_lock()
    if payload["source_lock"] != live_binding or payload["claim_boundary"] != lock["claim_boundary"]:
        raise ReplayError("source-lock binding mutation")
    expected_conventions = {
        "fourier_transform": "hat(f)(t)=integral_[-L/2,L/2] f(x)*exp(-i*t*x) dx",
        "frequency_measure": "dnu(t)=dt/(2*pi)",
        "physical_interval": "[-log(lambda),log(lambda)] with L=2*log(lambda)",
        "zero_extension": True,
        "inversion": "Jf(x)=f(-x)",
        "combined_multiplier": "m_lambda(t)=2*theta'(t)-2*sum_(1<n<=lambda^2) Lambda(n)/sqrt(n)*cos(t*log(n))",
        "prime_power_endpoint": "inclusive n<=lambda^2",
        "exterior_defect": "1_(abs(t)>delta/L)*(U+nu*L-m_lambda(t))_+",
        "source_normalization": "h_lambda is source-normalized and tends to h; unit norm is rejected",
    }
    if payload["source_conventions"] != expected_conventions:
        raise ReplayError("source convention mutation")

    inputs = payload["inputs"]
    if not isinstance(inputs, dict) or set(inputs) != {"lambda", "dps", "annular_parameters"}:
        raise ReplayError("input inventory mismatch")
    lambda_input = inputs["lambda"]
    if not isinstance(lambda_input, dict) or set(lambda_input) != {"numerator", "denominator"}:
        raise ReplayError("lambda input malformed")
    p_text, denominator, dps_text = lambda_input["numerator"], lambda_input["denominator"], inputs["dps"]
    if (
        not isinstance(p_text, str) or _POSITIVE_INTEGER_TEXT.fullmatch(p_text) is None
        or p_text not in CANONICAL_LAMBDA_NUMERATORS or denominator != "2"
        or not isinstance(dps_text, str) or dps_text not in CANONICAL_DPS
    ):
        raise ReplayError("noncanonical pilot input")
    annular = inputs["annular_parameters"]
    expected_annular = {
        "delta": {"numerator": "1", "denominator": "2"},
        "z0": {"numerator": "3", "denominator": "4"},
        "z1": {"numerator": "1", "denominator": "1"},
        "jump_width_h": {"numerator": "1", "denominator": "8"},
    }
    if annular != expected_annular:
        raise ReplayError("annular parameter mutation")
    p, dps = int(p_text), int(dps_text)

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "exact_central_fixture", "exact_soft_symbol_fixture", "inclusive_prime_powers",
        "interval_formulas", "source_admissions", "logical_theorems", "checks",
    }:
        raise ReplayError("certificate inventory mismatch")
    if certificate["source_admissions"] != EXPECTED_ADMISSIONS:
        raise ReplayError("source admission mutation")
    _check_exact_fixtures(certificate)
    inventory = _inventory(p)
    if certificate["inclusive_prime_powers"] != inventory:
        raise ReplayError("inclusive prime-power inventory mutation")

    interval_section = certificate["interval_formulas"]
    if not isinstance(interval_section, dict) or set(interval_section) != {"central_M", "central_r", "values"}:
        raise ReplayError("interval formula inventory mismatch")
    m_index, r_index, reconstructed = _independent_intervals(p, dps, inventory)
    if interval_section["central_M"] != m_index or interval_section["central_r"] != r_index:
        raise ReplayError("central schedule mutation")
    values = interval_section["values"]
    if not isinstance(values, dict) or set(values) != set(reconstructed):
        raise ReplayError("interval value inventory mismatch")
    for name, value in reconstructed.items():
        _contains(values[name], value, name, dps)

    positive_names = {
        "central_H_M_upper", "central_tau_r", "central_B_r_M",
        "gray_even_lambda_coefficient_lower", "gray_odd_lambda_coefficient_lower",
        "closed_angle_even_lower", "closed_angle_odd_lower",
        "hard_cut_layer_lambda_coefficient_lower", "odd_center_c0",
        "remaining_schur_load_threshold",
    }
    for name in positive_names:
        lo, _hi = _interval(values[name], name, dps)
        if lo <= 0:
            raise ReplayError(f"nonpositive required interval: {name}")
    pole1 = _interval(values["pole_prime_path_1"], "pole path 1", dps)
    pole2 = _interval(values["pole_prime_path_2"], "pole path 2", dps)
    if max(pole1[0], pole2[0]) > min(pole1[1], pole2[1]):
        raise ReplayError("independent pole-prime formula paths do not overlap")

    expected_theorems = {
        "minimum_spill": "Gamma_min^2=tr(D*U_M^*(R_M^dagger-P_ran(R_M))*U_M)",
        "source_ratio_sufficient": "epsilon/gamma=o(1/lambda)",
        "central_tail": "H_M<=delta^3/(6*pi^3*(M-delta/(2*pi)))",
        "exterior_gray_mass": "A*chi_X=Omega(lambda) in each parity sector",
        "exterior_angle_necessary": "closed annular projector angle squared is O(log(lambda)/lambda)",
        "odd_limsup": "limsup over locked lambda of G(lambda)/lambda is at least c0",
        "finite_projection": "a non-effective diagonal N_j transfers the favorable odd pole axis",
        "remaining_odd_target": "transverse positivity and strict shifted Schur inverse-load margin",
    }
    if certificate["logical_theorems"] != expected_theorems:
        raise ReplayError("logical theorem inventory mutation")
    expected_checks = {
        "central_minimum_spill_reconstructed": True,
        "positive_row_rank_not_promoted_to_rate": True,
        "relative_shell_ratio_retained": True,
        "covariance_tail_uses_M_over_lambda_to_infinity": True,
        "gray_mass_retained": True,
        "gray_mass_exceeds_difference_fixture": True,
        "hard_exterior_cut_retained": True,
        "closed_projector_endpoint_retained": True,
        "prime_power_endpoint_inclusive": True,
        "minus_prime_sign_retained": True,
        "odd_favorable_result_is_limsup_only": True,
        "odd_transverse_schur_still_open": True,
        "no_zero_ordinate_table_used": True,
        "source_normalization_retained": True,
        "no_secret_or_api_key_read": True,
        "formal_status_unchanged": True,
    }
    if certificate["checks"] != expected_checks:
        raise ReplayError("producer Boolean inventory is not independently valid")

    canonical = (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")
    if producer_bytes is not None and producer_bytes != canonical:
        raise ReplayError("producer byte stream is not canonical")
    producer_hash = hashlib.sha256(canonical).hexdigest()
    return {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "source_lock": live_binding,
        "producer_binding": {"sha256": producer_hash, "canonical_bytes": len(canonical)},
        "reconstructed": {
            "lambda_numerator": p_text,
            "dps": dps_text,
            "dependency_count": len(EXPECTED_DEPENDENCIES),
            "external_source_count": len(EXPECTED_EXTERNAL_SOURCES),
            "prime_power_count": len(inventory),
            "interval_count": len(reconstructed),
            "central_M": m_index,
            "central_r": r_index,
            "all_intervals_enclose_independent_formulas": True,
            "pole_prime_paths_overlap": True,
            "claim_boundary_retained": True,
        },
        "arithmetic_limitation": EXPECTED_LIBRARIES["independence_limitation"],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input)
    producer_bytes = input_path.read_bytes()
    payload = json.loads(producer_bytes.decode("utf-8"))
    report = replay(payload, producer_bytes=producer_bytes)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
