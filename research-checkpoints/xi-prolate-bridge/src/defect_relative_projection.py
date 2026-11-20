#!/usr/bin/env python3
"""Exact defect-relative Fourier projection bound for prolate labels 0 and 4.

This module evaluates the theorem proved in
``notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md``.  It is deliberately narrow:
it bounds only the ordinary ``L2`` Fourier projection remainder.  It does not
bound a signed Weil-distribution pairing, a shifted sector floor, or a
determinant.

All user-controlled numbers enter through exact integer data.  Transcendental
quantities are enclosed with ``mpmath.iv`` and serialized with their exact
dyadic endpoints as well as human-readable decimal displays.
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass
from fractions import Fraction
import gzip
import hashlib
import json
from pathlib import Path
from typing import Any

import mpmath as mp


LOCKED_SCHEMA = "xi-prolate-defect-relative-projection-artifact-v1"
LOCKED_CLAIM_CLASS = "DEFECT_RELATIVE_FOURIER_PROJECTION_ONLY"
LOCKED_TERMINAL_STATE = "P0_INVALIDATED"
LOCKED_FOURIER = "F_plus(f)(xi)=integral_R f(x)*exp(+2*pi*i*x*xi) dx"
LOCKED_SOURCE_INTERVAL = "[-lambda,lambda] with Lebesgue dx and zero extension"
LOCKED_C_MAP = "c=2*pi*lambda^2"
LOCKED_CONCENTRATION = "Lambda_n(c)=chi_n(lambda)^2; d_n=1-chi_n(lambda)^2"
LOCKED_LOG_INTERVAL = "[-log(lambda),log(lambda)]; L=2*log(lambda)"
LOCKED_EVENIZATION = "K_n(t)=(E(h_n)(exp(t))+E(h_n)(exp(-t)))/2"
LOCKED_SOURCE_COMBINATION = (
    "a4=sqrt(3)/2^(11/4); a0_lambda=a4*integral(h4)/integral(h0)"
)
LOCKED_BASIS = "L^(-1/2)*exp(+2*pi*i*m*(t+log(lambda))/L)"
LOCKED_LS_THICKNESS = "omega=R\\[-lambda,lambda]; gamma=1/2; rho=4*lambda"
LOCKED_LS_COVERING = "kappa=1; l_1=4*lambda; eta=1; tau_1=2"
LOCKED_LS_ENERGY = "E=(2*pi*lambda)^2"
LOCKED_LS_BASE = "96"
LOCKED_LS_EXPONENT = "5+(320*pi/log(2))*lambda^2"
LOCKED_DEFECT_LOWER = "6*96^(-5-(320*pi/log(2))*lambda^2)"
LOCKED_TV_BOUND = (
    "4*lambda*(2*pi*lambda^2+1/2)+32*pi*lambda^2*sqrt(d_n)"
)
LOCKED_PERIODIC_BV_TAIL = (
    "sqrt(2*log(lambda))*TV/(pi*sqrt(2*N))"
)
LOCKED_LOG_WEIGHTED_TAIL = (
    "sum_(abs(m)>N)log(2+abs(m))*abs(c_m)^2"
    "<=(L*TV^2/(2*pi^2*N))*(log(3*N)+1)"
)
LOCKED_SCHEDULE = "lambda_j=j+1/2; N_j=2^(2400*(2*j+1)^2)"
LOCKED_SCHEDULE_K = 2400
LOCKED_MIN_J = 2

SOURCE_LOCK_NAME = "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json"
SOURCE_LOCK_SHA256 = (
    "66347adeb8c3e0d497760318370d00949d598a3ba42d5375c27dafc1651b3714"
)
SOURCE_GZIP_NAME = "vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz"
SOURCE_GZIP_SHA256 = (
    "8cad2763fb84f09e44c7309ebecffa295e8b193ba9e506749451b305b50adf5c"
)
SOURCE_TEX_SHA256 = (
    "b459dd2a485b061edb1dc94e5313830acf6e12b2af07098e3f8642993e676907"
)
PINNED_DEPENDENCY_HASHES = {
    "vendor/CCM-ZST-2511.22755v1.pdf": (
        "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
    ),
    "vendor/CCM-PROLATE-2310.18423v2.pdf": (
        "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e"
    ),
    "vendor/KRD-PSWF-2006.00427v2.pdf": (
        "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0"
    ),
}


def _require_exact_integer(value: object, label: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer, never binary64")
    return value


def _require_dps(dps: object) -> int:
    dps = _require_exact_integer(dps, "interval precision")
    if dps < 50:
        raise ValueError("at least 50 interval decimal digits are required")
    return dps


def _fraction_decimal(value: Fraction) -> str:
    """Return an exact terminating decimal for a half-integer fraction."""
    if value.denominator == 1:
        return str(value.numerator)
    if value.denominator != 2:
        raise ArithmeticError("locked schedule should produce only half-integers")
    sign = "-" if value.numerator < 0 else ""
    numerator = abs(value.numerator)
    return f"{sign}{numerator // 2}.{5 if numerator % 2 else 0}"


def require_locked_formulas(
    *,
    fourier: str = LOCKED_FOURIER,
    source_interval: str = LOCKED_SOURCE_INTERVAL,
    c_map: str = LOCKED_C_MAP,
    concentration: str = LOCKED_CONCENTRATION,
    log_interval: str = LOCKED_LOG_INTERVAL,
    evenization: str = LOCKED_EVENIZATION,
    source_combination: str = LOCKED_SOURCE_COMBINATION,
    basis: str = LOCKED_BASIS,
    ls_thickness: str = LOCKED_LS_THICKNESS,
    ls_covering: str = LOCKED_LS_COVERING,
    ls_energy: str = LOCKED_LS_ENERGY,
    ls_base: str = LOCKED_LS_BASE,
    ls_exponent: str = LOCKED_LS_EXPONENT,
    defect_lower: str = LOCKED_DEFECT_LOWER,
    tv_bound: str = LOCKED_TV_BOUND,
    periodic_bv_tail: str = LOCKED_PERIODIC_BV_TAIL,
    log_weighted_tail: str = LOCKED_LOG_WEIGHTED_TAIL,
    schedule: str = LOCKED_SCHEDULE,
) -> None:
    """Reject every convention, square, sign, or parenthesization mutation."""
    supplied = {
        "additive Fourier convention": (fourier, LOCKED_FOURIER),
        "source interval/measure": (source_interval, LOCKED_SOURCE_INTERVAL),
        "prolate c map": (c_map, LOCKED_C_MAP),
        "concentration square": (concentration, LOCKED_CONCENTRATION),
        "logarithmic interval": (log_interval, LOCKED_LOG_INTERVAL),
        "inversion evenization": (evenization, LOCKED_EVENIZATION),
        "source combination normalization": (
            source_combination,
            LOCKED_SOURCE_COMBINATION,
        ),
        "log Fourier basis": (basis, LOCKED_BASIS),
        "LS thickness": (ls_thickness, LOCKED_LS_THICKNESS),
        "LS covering": (ls_covering, LOCKED_LS_COVERING),
        "LS angular-frequency energy": (ls_energy, LOCKED_LS_ENERGY),
        "LS base": (ls_base, LOCKED_LS_BASE),
        "LS exponent": (ls_exponent, LOCKED_LS_EXPONENT),
        "defect lower bound": (defect_lower, LOCKED_DEFECT_LOWER),
        "BV variation bound": (tv_bound, LOCKED_TV_BOUND),
        "periodic BV tail": (periodic_bv_tail, LOCKED_PERIODIC_BV_TAIL),
        "log-weighted BV tail": (
            log_weighted_tail,
            LOCKED_LOG_WEIGHTED_TAIL,
        ),
        "diagonal schedule": (schedule, LOCKED_SCHEDULE),
    }
    for label, (actual, expected) in supplied.items():
        if actual != expected:
            raise ValueError(f"{label} differs from the locked theorem")


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def validate_source_lock_payload(lock: object) -> None:
    """Fail closed on the complete source-lock inventory and theorem fields."""
    if not isinstance(lock, dict):
        raise TypeError("relative-projection source lock must be a JSON object")
    expected_top_level = {
        "schema",
        "claim_class",
        "terminal_state",
        "external_source",
        "existing_pinned_dependencies",
        "locked_project_conventions",
        "locked_logvinenko_sereda_insertion",
        "locked_bv_projection_bound",
        "locked_diagonal_schedule",
        "claim_boundary",
    }
    if set(lock) != expected_top_level:
        raise ValueError("source-lock top-level inventory differs from the contract")
    if lock.get("schema") != "xi-prolate-defect-relative-projection-source-lock-v1":
        raise ValueError("source-lock schema differs from the contract")
    if lock.get("claim_class") != LOCKED_CLAIM_CLASS:
        raise ValueError("source-lock claim class differs from the contract")
    if lock.get("terminal_state") != LOCKED_TERMINAL_STATE:
        raise ValueError("source-lock terminal state differs from the contract")

    external = lock.get("external_source")
    if not isinstance(external, dict) or set(external) != {
        "authors",
        "title",
        "arxiv_id",
        "version",
        "version_date",
        "source_url",
        "vendored_source",
        "vendored_source_media_type",
        "gzip_original_filename",
        "gzip_sha256",
        "uncompressed_tex_sha256",
        "binding_location",
        "license_notice_in_source",
    }:
        raise ValueError("external-source inventory differs from the contract")
    expected_external = {
        "arxiv_id": "2010.11901",
        "version": "v2",
        "vendored_source": SOURCE_GZIP_NAME,
        "gzip_sha256": SOURCE_GZIP_SHA256,
        "uncompressed_tex_sha256": SOURCE_TEX_SHA256,
        "binding_location": (
            "Theorem 1.2 (TeX label thm:LS), equations (1.4)--(1.6), and "
            "the pure-Laplacian specialization immediately following equation (1.7)"
        ),
    }
    for key, expected in expected_external.items():
        if external.get(key) != expected:
            raise ValueError(f"external-source field {key} differs from the contract")

    dependencies = lock.get("existing_pinned_dependencies")
    expected_dependencies = [
        (
            "vendor/CCM-ZST-2511.22755v1.pdf",
            "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
            "additive Fourier and source prolate-state conventions",
        ),
        (
            "vendor/CCM-PROLATE-2310.18423v2.pdf",
            "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e",
            "finite Fourier/prolate eigenfunction normalization",
        ),
        (
            "vendor/KRD-PSWF-2006.00427v2.pdf",
            "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0",
            "chi_n at least 1/sqrt(2) for labels 0 and 4 when lambda at least 2",
        ),
    ]
    if (
        not isinstance(dependencies, list)
        or len(dependencies) != len(expected_dependencies)
        or not all(
            isinstance(entry, dict)
            and set(entry) == {"path", "sha256", "role"}
            for entry in dependencies
        )
        or [
            (entry.get("path"), entry.get("sha256"), entry.get("role"))
            for entry in dependencies
        ]
        != expected_dependencies
    ):
        raise ValueError("pinned dependency inventory differs from the contract")

    conventions = lock.get("locked_project_conventions")
    expected_conventions = {
        "additive_fourier_transform": LOCKED_FOURIER,
        "source_interval": "[-lambda,lambda]",
        "source_measure": "Lebesgue dx",
        "zero_extension": "h_n is zero outside [-lambda,lambda]",
        "prolate_parameter": LOCKED_C_MAP,
        "concentration": "Lambda_n(c)=chi_n(lambda)^2",
        "defect": "d_n(lambda)=1-chi_n(lambda)^2",
        "mode_labels": [0, 4],
        "log_interval": "[-log(lambda),log(lambda)]",
        "log_interval_length": "L=2*log(lambda)",
        "log_fourier_basis": LOCKED_BASIS,
        "inversion_evenization": LOCKED_EVENIZATION,
        "source_combination": LOCKED_SOURCE_COMBINATION,
        "projector": "P_N keeps all integer modes |m|<=N",
    }
    if conventions != expected_conventions:
        raise ValueError("project convention fields differ from the contract")

    ls = lock.get("locked_logvinenko_sereda_insertion")
    expected_ls = {
        "ambient_domain": "Omega=R",
        "observation_set": "omega=R\\[-lambda,lambda]",
        "dimension": "d=1",
        "thickness": "gamma=1/2; rho=4*lambda",
        "covering": (
            "Q_j=(4*lambda*j,4*lambda*(j+1)); "
            "kappa=1; l_1=4*lambda; eta=1"
        ),
        "unit_ball_volume": "tau_1=2",
        "angular_frequency_energy": LOCKED_LS_ENERGY,
        "pure_laplacian_h": (
            "h(E)=exp(10*l_1*sqrt(E))=exp(80*pi*lambda^2)"
        ),
        "theorem_base": (
            "24*d*tau_d*l_1/(gamma*eta*rho)=96"
        ),
        "theorem_exponent": "5+320*pi*lambda^2/log(2)",
        "defect_lower_bound": "d_n>=6*96^(-5-(320*pi/log(2))*lambda^2)",
        "sqrt_defect_lower_bound": (
            "sqrt(d_n)>=sqrt(6)*96^(-5/2)*exp(-(160*pi*log(96)/log(2))*lambda^2)"
        ),
    }
    if ls != expected_ls:
        raise ValueError("Logvinenko-Sereda insertion fields differ from the contract")

    bv = lock.get("locked_bv_projection_bound")
    expected_bv = {
        "dilation_generator": "D=1/2+x*d/dx",
        "endpoint_bound": "abs(h_n(lambda))<=16*pi*sqrt(lambda*d_n)",
        "variation_bound": "TV_circle(K_n)<=" + LOCKED_TV_BOUND,
        "periodic_bv_tail": (
            "norm((I-P_N)K_n)_2<="
            "sqrt(2*log(lambda))*TV_circle(K_n)/(pi*sqrt(2*N))"
        ),
        "log_weighted_tail": (
            "sum_(abs(m)>N) log(2+abs(m))*abs(c_m)^2 <= "
            "(L*TV_circle(K_n)^2/(2*pi^2*N))*(log(3*N)+1)"
        ),
    }
    if bv != expected_bv:
        raise ValueError("BV projection fields differ from the contract")

    schedule = lock.get("locked_diagonal_schedule")
    expected_schedule = {
        "index_domain": "j is an integer and j>=2",
        "lambda": "lambda_j=j+1/2",
        "K": 2400,
        "N": "N_j=2^(2400*(2*j+1)^2)",
        "N_equivalent": "N_j=exp(9600*log(2)*lambda_j^2)",
        "inverse_sqrt_N": "N_j^(-1/2)=exp(-4800*log(2)*lambda_j^2)",
        "sqrt_defect_exponent": "A=160*pi*log(96)/log(2)",
        "exponent_margin": (
            "M=4800*log(2)-160*pi*log(96)/log(2)"
        ),
        "positive_margin_decimal_diagnostic": (
            "17.143296058960234038554423774919999560718362798993342185910008604959871343574238"
        ),
        "unsafe_integer_K_ceiling": 2387,
        "first_positive_margin_integer_K": 2388,
        "exact_safety_condition": "K>80*pi*log(96)/log(2)^2",
    }
    if schedule != expected_schedule:
        raise ValueError("diagonal-schedule fields differ from the contract")

    boundary = lock.get("claim_boundary")
    expected_boundary = {
        "proved": (
            "defect-relative ordinary L2 and logarithmically weighted Fourier "
            "projection tails for each normalized prolate label 0 and 4, and "
            "hence for their exact source combination with explicit coefficient "
            "control"
        ),
        "not_proved": [
            "O-P or P-P signed-distribution correlation bounds",
            "high Fourier block coercivity",
            "a shifted even or odd sector floor",
            "residual-gap scaling for the full Weil form",
            "locally uniform determinant convergence",
            "the Riemann hypothesis",
        ],
    }
    if boundary != expected_boundary:
        raise ValueError("claim-boundary fields differ from the contract")


def verify_source_pin(repo_root: Path | None = None) -> dict[str, object]:
    """Hash the exact vendored v2 gzip and its uncompressed TeX bytes."""
    root = _repo_root() if repo_root is None else Path(repo_root)
    lock_path = root / SOURCE_LOCK_NAME
    source_path = root / SOURCE_GZIP_NAME
    lock_bytes = lock_path.read_bytes()
    if hashlib.sha256(lock_bytes).hexdigest() != SOURCE_LOCK_SHA256:
        raise ValueError("relative-projection source-lock byte hash mismatch")
    lock = json.loads(lock_bytes.decode("utf-8"))
    validate_source_lock_payload(lock)
    external = lock.get("external_source", {})
    if external.get("version") != "v2":
        raise ValueError("source lock is not the binding arXiv v2")
    if external.get("gzip_sha256") != SOURCE_GZIP_SHA256:
        raise ValueError("source-lock gzip hash differs from the code contract")
    if external.get("uncompressed_tex_sha256") != SOURCE_TEX_SHA256:
        raise ValueError("source-lock TeX hash differs from the code contract")
    compressed = source_path.read_bytes()
    compressed_hash = hashlib.sha256(compressed).hexdigest()
    if compressed_hash != SOURCE_GZIP_SHA256:
        raise ValueError("vendored Egidi-Seelmann v2 gzip hash mismatch")
    uncompressed = gzip.decompress(compressed)
    tex_hash = hashlib.sha256(uncompressed).hexdigest()
    if tex_hash != SOURCE_TEX_SHA256:
        raise ValueError("vendored Egidi-Seelmann v2 TeX hash mismatch")
    dependency_hashes: dict[str, str] = {}
    for relative_path, expected_hash in PINNED_DEPENDENCY_HASHES.items():
        actual_hash = hashlib.sha256((root / relative_path).read_bytes()).hexdigest()
        if actual_hash != expected_hash:
            raise ValueError(f"pinned dependency byte hash mismatch: {relative_path}")
        dependency_hashes[relative_path] = actual_hash
    return {
        "source_lock": SOURCE_LOCK_NAME,
        "source_lock_sha256": SOURCE_LOCK_SHA256,
        "vendored_source": SOURCE_GZIP_NAME,
        "gzip_sha256": compressed_hash,
        "uncompressed_tex_sha256": tex_hash,
        "pinned_dependency_sha256": dependency_hashes,
    }


@dataclass(frozen=True)
class DyadicInterval:
    """Closed interval represented by exact mpmath/libmp dyadic endpoints."""

    lower_raw: tuple[int, int, int, int]
    upper_raw: tuple[int, int, int, int]

    def lower(self) -> mp.mpf:
        return mp.mpf(self.lower_raw)

    def upper(self) -> mp.mpf:
        return mp.mpf(self.upper_raw)


def _capture_interval(value: Any) -> DyadicInterval:
    lower, upper = value._mpi_
    lower_tuple = tuple(int(item) for item in lower)
    upper_tuple = tuple(int(item) for item in upper)
    if len(lower_tuple) != 4 or len(upper_tuple) != 4:
        raise ArithmeticError("unexpected interval endpoint representation")
    return DyadicInterval(lower_tuple, upper_tuple)  # type: ignore[arg-type]


def _serialize_raw_endpoint(raw: tuple[int, int, int, int]) -> list[object]:
    sign, mantissa, exponent, bitcount = raw
    return [sign, str(mantissa), exponent, bitcount]


def serialize_interval(interval: DyadicInterval, digits: int) -> dict[str, object]:
    with mp.workdps(digits + 20):
        lower = interval.lower()
        upper = interval.upper()
        return {
            "decimal": [mp.nstr(lower, digits), mp.nstr(upper, digits)],
            "dyadic": {
                "lower": _serialize_raw_endpoint(interval.lower_raw),
                "upper": _serialize_raw_endpoint(interval.upper_raw),
            },
        }


def exponent_margin_interval(K: int, dps: int = 80) -> DyadicInterval:
    """Enclose ``2*K*log(2)-160*pi*log(96)/log(2)`` exactly."""
    K = _require_exact_integer(K, "schedule multiplier K")
    dps = _require_dps(dps)
    if K <= 0:
        raise ValueError("schedule multiplier K must be positive")
    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        margin = (
            2 * K * mp.iv.log(2)
            - 160 * mp.iv.pi * mp.iv.log(96) / mp.iv.log(2)
        )
        return _capture_interval(margin)
    finally:
        mp.iv.dps = old_iv_dps


def require_locked_schedule_multiplier(K: int, dps: int = 80) -> None:
    """Reject nonpositive-margin schedules and every nonlocked replacement."""
    K = _require_exact_integer(K, "schedule multiplier K")
    margin = exponent_margin_interval(K, dps)
    with mp.workdps(dps + 20):
        if margin.upper() <= 0:
            raise ValueError("schedule multiplier has no positive defect exponent margin")
    if K != LOCKED_SCHEDULE_K:
        raise ValueError("schedule multiplier differs from the locked value 2400")


@dataclass(frozen=True)
class DefectRelativeProjectionBound:
    j: int
    lambda_exact: Fraction
    lambda_decimal: str
    interval_dps: int
    schedule_K: int
    schedule_exponent: int
    angular_energy: DyadicInterval
    ls_exponent: DyadicInterval
    defect_lower: DyadicInterval
    sqrt_defect_lower: DyadicInterval
    sqrt_defect_decay_A: DyadicInterval
    inverse_sqrt_N_decay: DyadicInterval
    exponent_margin: DyadicInterval
    bulk_relative_bound: DyadicInterval
    jump_relative_bound: DyadicInterval
    total_relative_bound: DyadicInterval
    log_weight_factor: DyadicInterval
    log_weighted_relative_bound: DyadicInterval
    lambda2_uniform_relative_guard: DyadicInterval
    lambda2_uniform_log_weighted_guard: DyadicInterval
    bulk_log_derivative_guard_at_lambda2: DyadicInterval
    jump_log_derivative_guard_at_lambda2: DyadicInterval
    source_pin: dict[str, object]


def _relative_terms(lam_iv: Any, K: int) -> tuple[Any, Any, Any, Any, Any]:
    log_two = mp.iv.log(2)
    decay_A = 160 * mp.iv.pi * mp.iv.log(96) / log_two
    schedule_decay = 2 * K * log_two
    margin = schedule_decay - decay_A
    length = 2 * mp.iv.log(lam_iv)
    c = 2 * mp.iv.pi * lam_iv**2
    common = mp.iv.sqrt(length) / (mp.iv.pi * mp.iv.sqrt(2))
    bulk = (
        common
        * 4
        * lam_iv
        * (c + mp.iv.mpf(1) / 2)
        * mp.iv.power(96, mp.iv.mpf(5) / 2)
        / mp.iv.sqrt(6)
        * mp.iv.exp(-margin * lam_iv**2)
    )
    jump = (
        common
        * 32
        * mp.iv.pi
        * lam_iv**2
        * mp.iv.exp(-schedule_decay * lam_iv**2)
    )
    return bulk, jump, bulk + jump, decay_A, schedule_decay


def defect_relative_projection_bound(
    j: int,
    dps: int = 80,
    *,
    schedule_K: int = LOCKED_SCHEDULE_K,
    **locked_overrides: str,
) -> DefectRelativeProjectionBound:
    """Evaluate the locked half-integer schedule with outward intervals."""
    require_locked_formulas(**locked_overrides)
    j = _require_exact_integer(j, "schedule index j")
    dps = _require_dps(dps)
    if j < LOCKED_MIN_J:
        raise ValueError("the proved endpoint insertion requires j>=2 (lambda>=5/2)")
    require_locked_schedule_multiplier(schedule_K, dps)
    source_pin = verify_source_pin()

    lam = Fraction(2 * j + 1, 2)
    lam_text = _fraction_decimal(lam)
    schedule_exponent = schedule_K * (2 * j + 1) ** 2

    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam_iv = mp.iv.mpf(lam.numerator) / mp.iv.mpf(lam.denominator)
        log_two = mp.iv.log(2)
        energy = (2 * mp.iv.pi * lam_iv) ** 2
        ls_exponent = 5 + 320 * mp.iv.pi * lam_iv**2 / log_two
        defect_lower = 6 * mp.iv.exp(-ls_exponent * mp.iv.log(96))
        sqrt_defect_lower = mp.iv.sqrt(defect_lower)
        bulk, jump, total, decay_A, schedule_decay = _relative_terms(
            lam_iv, schedule_K
        )
        margin = schedule_decay - decay_A
        log_weight_factor = mp.iv.sqrt(
            1 + mp.iv.log(3) + schedule_exponent * log_two
        )
        log_weighted_total = total * log_weight_factor

        two = mp.iv.mpf(2)
        guard_bulk, guard_jump, guard_total, _, _ = _relative_terms(
            two, schedule_K
        )
        guard_exponent = 4 * schedule_K * two**2
        guard_log_weight_factor = mp.iv.sqrt(
            1 + mp.iv.log(3) + guard_exponent * log_two
        )
        guard_log_weighted_total = guard_total * guard_log_weight_factor
        bulk_derivative_guard = (
            mp.iv.mpf(3) / 2
            + 1 / (4 * log_two)
            - 4 * margin
        )
        jump_derivative_guard = (
            1 + 1 / (4 * log_two) - 4 * schedule_decay
        )

        captured = {
            "energy": _capture_interval(energy),
            "ls_exponent": _capture_interval(ls_exponent),
            "defect_lower": _capture_interval(defect_lower),
            "sqrt_defect_lower": _capture_interval(sqrt_defect_lower),
            "decay_A": _capture_interval(decay_A),
            "schedule_decay": _capture_interval(schedule_decay),
            "margin": _capture_interval(margin),
            "bulk": _capture_interval(bulk),
            "jump": _capture_interval(jump),
            "total": _capture_interval(total),
            "log_weight_factor": _capture_interval(log_weight_factor),
            "log_weighted_total": _capture_interval(log_weighted_total),
            "guard_total": _capture_interval(guard_total),
            "guard_log_weighted_total": _capture_interval(
                guard_log_weighted_total
            ),
            "bulk_derivative": _capture_interval(bulk_derivative_guard),
            "jump_derivative": _capture_interval(jump_derivative_guard),
        }

        if margin.a <= 0:
            raise ArithmeticError("locked exponent margin is not positive")
        if total.a <= 0 or total.b >= 1:
            raise ArithmeticError("relative projection bound is not in (0,1)")
        if guard_total.b >= 1:
            raise ArithmeticError("lambda=2 uniform relative guard is not below one")
        if log_weighted_total.b >= 1 or guard_log_weighted_total.b >= 1:
            raise ArithmeticError("log-weighted relative guard is not below one")
        if bulk_derivative_guard.b >= 0 or jump_derivative_guard.b >= 0:
            raise ArithmeticError("monotonicity derivative guard is not negative")
    finally:
        mp.iv.dps = old_iv_dps

    return DefectRelativeProjectionBound(
        j=j,
        lambda_exact=lam,
        lambda_decimal=lam_text,
        interval_dps=dps,
        schedule_K=schedule_K,
        schedule_exponent=schedule_exponent,
        angular_energy=captured["energy"],
        ls_exponent=captured["ls_exponent"],
        defect_lower=captured["defect_lower"],
        sqrt_defect_lower=captured["sqrt_defect_lower"],
        sqrt_defect_decay_A=captured["decay_A"],
        inverse_sqrt_N_decay=captured["schedule_decay"],
        exponent_margin=captured["margin"],
        bulk_relative_bound=captured["bulk"],
        jump_relative_bound=captured["jump"],
        total_relative_bound=captured["total"],
        log_weight_factor=captured["log_weight_factor"],
        log_weighted_relative_bound=captured["log_weighted_total"],
        lambda2_uniform_relative_guard=captured["guard_total"],
        lambda2_uniform_log_weighted_guard=captured[
            "guard_log_weighted_total"
        ],
        bulk_log_derivative_guard_at_lambda2=captured["bulk_derivative"],
        jump_log_derivative_guard_at_lambda2=captured["jump_derivative"],
        source_pin=source_pin,
    )


def serialize_bound(bound: DefectRelativeProjectionBound) -> dict[str, object]:
    digits = bound.interval_dps + 10
    interval = lambda value: serialize_interval(value, digits)
    return {
        "schema": LOCKED_SCHEMA,
        "claim_class": LOCKED_CLAIM_CLASS,
        "terminal_state": LOCKED_TERMINAL_STATE,
        "claims": {
            "defect_relative_L2_projection_for_modes_0_and_4": True,
            "defect_relative_log_weighted_projection_for_modes_0_and_4": True,
            "signed_O_P_or_P_P_form_control": False,
            "high_block_coercivity": False,
            "shifted_sector_floor": False,
            "full_residual_gap_scaling": False,
            "locally_uniform_determinant_convergence": False,
            "riemann_hypothesis_proof": False,
        },
        "inputs": {
            "j": bound.j,
            "lambda_decimal": bound.lambda_decimal,
            "lambda_exact_fraction": str(bound.lambda_exact),
            "interval_decimal_digits": bound.interval_dps,
            "producer_arithmetic_library": f"mpmath.iv {mp.__version__}",
            "binary64_parameter_path": False,
        },
        "source_pin": bound.source_pin,
        "locked_formulas": {
            "Fourier": LOCKED_FOURIER,
            "source_interval": LOCKED_SOURCE_INTERVAL,
            "c_map": LOCKED_C_MAP,
            "concentration": LOCKED_CONCENTRATION,
            "log_interval": LOCKED_LOG_INTERVAL,
            "evenization": LOCKED_EVENIZATION,
            "source_combination": LOCKED_SOURCE_COMBINATION,
            "basis": LOCKED_BASIS,
            "LS_thickness": LOCKED_LS_THICKNESS,
            "LS_covering": LOCKED_LS_COVERING,
            "LS_energy": LOCKED_LS_ENERGY,
            "LS_base": LOCKED_LS_BASE,
            "LS_exponent": LOCKED_LS_EXPONENT,
            "defect_lower": LOCKED_DEFECT_LOWER,
            "TV_bound": LOCKED_TV_BOUND,
            "periodic_BV_tail": LOCKED_PERIODIC_BV_TAIL,
            "log_weighted_BV_tail": LOCKED_LOG_WEIGHTED_TAIL,
            "schedule": LOCKED_SCHEDULE,
        },
        "exact_schedule": {
            "K": bound.schedule_K,
            "power_of_two_exponent": bound.schedule_exponent,
            "N": f"2^{bound.schedule_exponent}",
            "N_is_materialized": False,
        },
        "outward_intervals": {
            "angular_frequency_energy": interval(bound.angular_energy),
            "LS_theorem_exponent": interval(bound.ls_exponent),
            "defect_lower_bound": interval(bound.defect_lower),
            "sqrt_defect_lower_bound": interval(bound.sqrt_defect_lower),
            "sqrt_defect_decay_A": interval(bound.sqrt_defect_decay_A),
            "inverse_sqrt_N_decay": interval(bound.inverse_sqrt_N_decay),
            "positive_exponent_margin": interval(bound.exponent_margin),
            "bulk_projection_over_sqrt_defect": interval(
                bound.bulk_relative_bound
            ),
            "endpoint_jump_projection_over_sqrt_defect": interval(
                bound.jump_relative_bound
            ),
            "total_projection_over_sqrt_defect": interval(
                bound.total_relative_bound
            ),
            "sqrt_log_3N_plus_1_weight_factor": interval(
                bound.log_weight_factor
            ),
            "log_weighted_projection_over_sqrt_defect": interval(
                bound.log_weighted_relative_bound
            ),
            "lambda2_uniform_relative_guard": interval(
                bound.lambda2_uniform_relative_guard
            ),
            "lambda2_uniform_log_weighted_guard": interval(
                bound.lambda2_uniform_log_weighted_guard
            ),
            "bulk_log_derivative_guard_at_lambda2": interval(
                bound.bulk_log_derivative_guard_at_lambda2
            ),
            "jump_log_derivative_guard_at_lambda2": interval(
                bound.jump_log_derivative_guard_at_lambda2
            ),
        },
        "checks": {
            "source_bytes_hashed": True,
            "lambda_reconstructed_from_exact_j": True,
            "lambda_squared_used_in_c_map": True,
            "thickness_parameters_checked": True,
            "angular_frequency_2pi_checked": True,
            "positive_exponent_margin": True,
            "relative_bound_below_one": True,
            "log_weighted_relative_bound_below_one": True,
            "uniform_expression_decreasing_for_lambda_at_least_2": True,
        },
        "limitations": [
            "Only the ordinary L2 Fourier projection remainder is bounded.",
            "A logarithmically weighted Fourier-coefficient tail is also bounded, but continuity of the signed O-P/P-P distribution in that norm is not proved.",
            "No high-block coercivity or shifted sector floor is proved.",
            "Producer and verifier both use mpmath.iv; the replay is code-path independent but not arithmetic-library independent."
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Produce the locked defect-relative projection artifact"
    )
    parser.add_argument("--j", type=int, default=2)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    payload = serialize_bound(defect_relative_projection_bound(args.j, args.dps))
    rendered = json.dumps(payload, indent=2, sort_keys=True) + "\n"
    if args.output is None:
        print(rendered, end="")
    else:
        args.output.write_text(rendered, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


__all__ = [
    "DefectRelativeProjectionBound",
    "DyadicInterval",
    "LOCKED_SCHEDULE_K",
    "defect_relative_projection_bound",
    "exponent_margin_interval",
    "require_locked_formulas",
    "require_locked_schedule_multiplier",
    "serialize_bound",
    "validate_source_lock_payload",
    "verify_source_pin",
]
