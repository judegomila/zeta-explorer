#!/usr/bin/env python3
"""Clean-room replay of the finite compressed-multiplier trace certificate.

The replay imports neither the producer nor any arithmetic helper.  Prime
powers are reconstructed by factoring every integer through the exact
``lambda**2`` cutoff, whereas the producer uses a prime sieve followed by
power generation.  Both paths deliberately share the pinned ``mpmath.iv``
runtime; that common transcendental dependency is reported in the result.
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


SCHEMA = "xi-prolate-compressed-multiplier-trace-v1"
REPLAY_SCHEMA = "xi-prolate-compressed-multiplier-trace-replay-v1"
STATUS = "COMPRESSED_MULTIPLIER_TRACE_COMPONENT"
RESULT = "COMPRESSED_MULTIPLIER_TRACE_COMPONENT_PASS"
REPLAY_RESULT = "COMPRESSED_MULTIPLIER_TRACE_COMPONENT_REPLAY_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md"
LOCK = "COMPRESSED_MULTIPLIER_TRACE_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-compressed-multiplier-trace-source-lock-v1"
EXPECTED_LIBRARY = "mpmath.iv 1.4.1"
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 16

# Final byte pins for the theorem note and its source lock.  Replay fails
# closed on any later mutation.
PINNED_HASHES = {
    NOTE: "ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f",
    LOCK: "5beedcf1f36206ec0f10331f139a4156ac43d0335f1bd90bbe64eba6016464da",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER_TEXT = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_NONNEGATIVE_TEXT = re.compile(r"^(?:0|[1-9][0-9]*)$")
_POSITIVE_TEXT = re.compile(r"^[1-9][0-9]*$")

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension",
    "physical_interval": "I_lambda=[-log(lambda),log(lambda)] with Lebesgue measure in logarithmic coordinates, equivalently du/u on [lambda^(-1),lambda]",
    "fourier_sign": "fhat(t)=integral f(y)*exp(-i*t*y) dy",
    "prime_endpoint": "every prime power n<=lambda^2 is included",
    "prime_sign": "m_lambda=2*theta_prime-2*sum Lambda(n)/sqrt(n)*cos(t*log(n))",
    "compression": "centered modes |n|<=N, d=2*N+1, with no cached Weil matrix",
    "schedule_scope": "the O(lambda^2) rank scale requires N asymptotic lambda^2, fixed positive tail ratio, U=o(log(lambda^2)), and g=kappa*log(lambda^2)",
    "interval_serialization": "nondegenerate intervals are expanded by exact dyadic 2^(s-ceil(dps*3321928094887363/10^15)+16), s=max(0,floor(log2(max endpoint magnitude))), and replay requires enclosure of its independent interval",
    "shared_library": "producer and replay use the exact pinned mpmath.iv version and disclose that common dependency",
}

LOCKED_FORMULAS = {
    "c_star": "c_star=log(1/(1-1/sqrt(2)))/sqrt(2)",
    "log_hilbert": "abs(H_log)<=2*pi*(1+sqrt(2)/log(2))*B2+16*c_star*Cpsi^2*x/log(2)",
    "mean_square": "M2<=R*A2/(2*pi)+(1+sqrt(2)/log(2))*B2+8*c_star*Cpsi^2*x/(pi*log(2))+Sigma^2/(4*pi*log(2))",
    "arithmetic_bounds": "A2<=Cpsi*L*(1+L), B2<=Cpsi*x*L, Sigma<=Cpsi*(2*sqrt(x)-1)",
    "trace": "trace(P_N*T_v*P_N)<=H_N+2*sqrt(d*L*M2)+2*d*Aplus/(pi^2*zeta*N)",
    "even_rank": "dim(L_even)<=trace_bound/(g-delta)",
    "odd_rank": "dim(L_odd_sharp)<=trace_bound/(g-delta)+1",
    "capture_floor": "B_on_Kperp>=delta-[r-g+delta]_+*s^2 where Pi_strict=1_(g-delta,infinity)(R) and s=norm(Pi_strict*P_Kperp)",
    "quotient_gluing": "nu=(mu+1-sqrt((mu-1)^2+4*chi^2))/2 and chi^2<mu",
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "cached_weil_matrix_read": False,
    "inclusive_prime_power_endpoint_used": True,
    "lambda_squared_cutoff_used": True,
    "fourier_minus_sign_preserved": True,
    "zeta_zero_table_read": False,
    "zeros_assumed_real": False,
    "global_weil_positivity_assumed": False,
    "montgomery_vaughan_inequality_used": False,
    "self_contained_discrete_hilbert_argument_used": True,
    "inclusive_rank_projector_distinct_from_strict_capture_projector": True,
    "physical_capture_claimed": False,
    "signed_low_comparison_claimed": False,
    "signed_sector_floor_claimed": False,
    "equation_5_2_claimed": False,
    "determinant_limit_claimed": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "a self-contained finite logarithmic-Hilbert inequality with explicit constants",
        "an explicit finite second-moment and compressed weighted-trace bound",
        "an O(lambda^2) dangerous-rank scale on the displayed polynomial compression schedule",
        "exact physical-capture and quotient-relative signed-gluing criteria",
    ],
    "not_proved": [
        "a favorable finite dangerous-rank fraction",
        "capture of the dangerous space by the physical prolate range",
        "the signed low comparison or quotient-relative cross bound",
        "a signed floor in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

ARITHMETIC = {
    "precision_mode": "outward arbitrary-precision intervals",
    "raw_interval_or_ball_output_applicable": True,
    "library": EXPECTED_LIBRARY,
    "shared_library_with_verifier": True,
    "independent_prime_power_enumeration": True,
    "independent_formula_trees": True,
    "serialization_guard": "exact dyadic rule locked in source conventions; nondegenerate intervals only",
    "independence_limitation": "producer and replay share the exact pinned mpmath.iv transcendental runtime",
}

INTERVAL_FIELDS = (
    "lambda",
    "x",
    "L",
    "zeta",
    "kappa",
    "rho",
    "U",
    "N",
    "d",
    "g",
    "delta",
    "g_minus_delta",
    "Omega",
    "R",
    "A2",
    "B2",
    "Sigma",
    "Cpsi",
    "cstar",
    "minus_c0",
    "A2_source_upper",
    "B2_source_upper",
    "Sigma_source_upper",
    "log_hilbert_bound",
    "M2_bound",
    "Cplus",
    "Aplus",
    "F_Cplus",
    "H_dimension_branch",
    "H_envelope_branch",
    "H_bound",
    "trace_central_prime_bound",
    "trace_tail_bound",
    "trace_bound",
    "rank_bound_plus",
    "rank_bound_odd",
    "rank_ratio_plus",
    "rank_ratio_odd",
)


class ReplayError(ValueError):
    """Raised when source bytes, arithmetic, or claim scope fail replay."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError as exc:
        raise ReplayError(f"cannot read pinned source: {path}") from exc


def _reject_number(token: str) -> None:
    raise ReplayError(f"non-integer JSON number {token!r} is forbidden")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _validate_json(value: Any, path: str = "payload") -> None:
    if value is None or isinstance(value, (str, bool)):
        return
    if isinstance(value, int):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate_json(child, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string JSON key at {path}")
            _validate_json(child, f"{path}.{key}")
        return
    raise ReplayError(f"non-JSON value at {path}")


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        value = json.loads(
            raw,
            parse_float=_reject_number,
            parse_constant=_reject_number,
            object_pairs_hook=_unique_object,
        )
    except ReplayError:
        raise
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate_json(value, label)
    return value


def _same(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(_same(left[key], right[key]) for key in left)
    if isinstance(left, list):
        return len(left) == len(right) and all(_same(a, b) for a, b in zip(left, right))
    return left == right


def _int(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _rational(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def _parse_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} must be an exact rational object")
    numerator = value["numerator"]
    denominator = value["denominator"]
    if (
        not isinstance(numerator, str)
        or _INTEGER_TEXT.fullmatch(numerator) is None
        or not isinstance(denominator, str)
        or _POSITIVE_TEXT.fullmatch(denominator) is None
    ):
        raise ReplayError(f"{label} has noncanonical integer text")
    result = Fraction(int(numerator), int(denominator))
    if (str(result.numerator), str(result.denominator)) != (numerator, denominator):
        raise ReplayError(f"{label} is not reduced canonically")
    return result


def _source_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ReplayError(f"PINNED_HASHES placeholder not finalized: {relative}")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")

    lock = _strict_json_loads((root / LOCK).read_bytes(), "source lock")
    expected_top = {
        "schema",
        "claim_class",
        "terminal_state",
        "updated_date",
        "external_sources",
        "dependencies",
        "locked_conventions",
        "locked_formulas",
        "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("compressed-trace source-lock inventory mismatch")
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": "FINITE_COMPRESSION_DANGEROUS_RANK_AND_CAPTURE_REDUCTION",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-08",
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
    }
    for key, expected in fixed.items():
        if not _same(lock[key], expected):
            raise ReplayError(f"compressed-trace source-lock {key} mutation")

    result = dict(PINNED_HASHES)
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("compressed-trace source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed compressed-trace dependency")
        relative = item["path"]
        expected = item["sha256"]
        role = item["role"]
        if (
            not isinstance(relative, str)
            or not relative
            or Path(relative).is_absolute()
            or ".." in Path(relative).parts
            or relative in result
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
        ):
            raise ReplayError("invalid compressed-trace dependency fields")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def prime_powers_by_integer_factorization(p: int) -> list[tuple[int, int, int]]:
    """Factor each integer independently and retain exactly prime powers."""

    cutoff = (p * p) // 4
    result: list[tuple[int, int, int]] = []
    for integer in range(2, cutoff + 1):
        remaining = integer
        factor = 2
        prime = 0
        exponent = 0
        distinct = 0
        while factor * factor <= remaining:
            if remaining % factor == 0:
                distinct += 1
                prime = factor
                exponent = 0
                while remaining % factor == 0:
                    remaining //= factor
                    exponent += 1
                if distinct > 1:
                    break
            factor += 1
        if distinct <= 1 and remaining > 1:
            if distinct == 0:
                distinct = 1
                prime = remaining
                exponent = 1
            elif remaining != prime:
                distinct += 1
        if distinct == 1:
            result.append((integer, prime, exponent))
    return result


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    bits = max(int(lower[3]), int(upper[3])) + 48
    with mp.workprec(bits):
        return +mp.mpf(tuple(lower)), +mp.mpf(tuple(upper))


def _positive_part(value: object) -> object:
    lower, upper = _capture(value)
    if upper <= 0:
        return mp.iv.mpf(0)
    if lower >= 0:
        return value
    return mp.iv.mpf([0, upper])


def _interval_min(left: object, right: object) -> object:
    a, b = _capture(left)
    c, d = _capture(right)
    return mp.iv.mpf([min(a, c), min(b, d)])


def _exact_certificate(
    p: int,
    terms: list[tuple[int, int, int]],
    finite_trace_rank_bound_is_order_vacuous: bool,
) -> dict[str, Any]:
    N = (p * p + 3) // 4
    return {
        "lambda": _rational(Fraction(p, 2)),
        "x_lambda_squared": _rational(Fraction(p * p, 4)),
        "prime_power_integer_cutoff": (p * p) // 4,
        "N_rule": "ceil(lambda^2)",
        "N": N,
        "d": 2 * N + 1,
        "ambient_even_complement_dimension": N,
        "ambient_odd_dimension": N,
        "zeta": _rational(Fraction(1)),
        "kappa": _rational(Fraction(1, 2)),
        "rho": _rational(Fraction(1, 2)),
        "U": _rational(Fraction(0)),
        "prime_powers": [
            {"n": integer, "prime": prime, "exponent": exponent}
            for integer, prime, exponent in terms
        ],
        "prime_power_count": len(terms),
        "H_bound_operation": "interval_lattice_min_of_two_source_upper_bounds",
        "odd_pole_rank_surcharge": 1,
        "finite_trace_rank_bound_is_order_vacuous": (
            finite_trace_rank_bound_is_order_vacuous
        ),
    }


def _exact_regressions() -> dict[str, object]:
    g = Fraction(4)
    delta = Fraction(1)
    r = Fraction(5)
    s_squared = Fraction(9, 25)
    excess = max(Fraction(0), r - g + delta)
    floor = delta - excess * s_squared

    mu = Fraction(1)
    eta = Fraction(4)
    quotient = Fraction(9, 4)
    cross = Fraction(9, 5)
    chi = cross / (Fraction(2) * Fraction(3, 2))
    # Here mu=1, so the radical in (6.7) is exactly 2*chi.
    nu = (mu + 1 - 2 * chi) / 2
    return {
        "capture_floor_model": {
            "g": _rational(g),
            "delta": _rational(delta),
            "r": _rational(r),
            "s_squared": _rational(s_squared),
            "positive_part_r_minus_g_plus_delta": _rational(excess),
            "certified_floor": _rational(floor),
            "actual_compressed_floor": _rational(
                -Fraction(9, 25) + Fraction(16, 25)
            ),
            "exact_capture_floor_at_s_squared_zero": _rational(delta),
            "R_diagonal": [_rational(Fraction(5)), _rational(Fraction(3))],
            "Kperp_unit_vector": [_rational(Fraction(3, 5)), _rational(Fraction(4, 5))],
            "inclusive_rank_projector_threshold": "[g-delta,infinity)",
            "strict_capture_projector_threshold": "(g-delta,infinity)",
            "inclusive_rank_projector_diagonal": [1, 1],
            "strict_capture_projector_diagonal": [1, 0],
            "strict_rank_bounded_by_inclusive_rank": True,
        },
        "quotient_gluing_model": {
            "mu": _rational(mu),
            "eta": _rational(eta),
            "quotient_metric": _rational(quotient),
            "cross_block": _rational(cross),
            "chi": _rational(chi),
            "chi_squared": _rational(chi * chi),
            "nu": _rational(nu),
            "B_matrix": [
                [_rational(Fraction(9, 4)), _rational(Fraction(9, 5))],
                [_rational(Fraction(9, 5)), _rational(Fraction(4))],
            ],
        },
        "rank_only_capture_obstruction": {
            "dangerous_dimension": 2,
            "physical_dimension": 1,
            "forced_s_squared": _rational(Fraction(1)),
        },
    }


def _assemble(
    p: int, dps: int, terms: list[tuple[int, int, int]]
) -> dict[str, tuple[mp.mpf, mp.mpf]]:
    if f"mpmath.iv {mp.__version__}" != EXPECTED_LIBRARY:
        raise ReplayError("pinned mpmath.iv version is not active")
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        z = mp.iv.mpf(0)
        o = mp.iv.mpf(1)
        t = mp.iv.mpf(2)
        pi = +mp.iv.pi
        log_two = mp.iv.log(t)
        root_two = mp.iv.sqrt(t)
        p_iv = mp.iv.mpf(p)
        lam = p_iv / t
        x = p_iv * p_iv / 4
        L = mp.iv.log(x)
        N_int = (p * p + 3) // 4
        N = mp.iv.mpf(N_int)
        d = mp.iv.mpf(2 * N_int + 1)
        zeta = o
        kappa = o / t
        rho = o / t
        U = z
        g = L / t
        delta = g / t
        gap = g - delta
        Omega = (t * pi / L) * N
        R = 4 * pi * N / L

        A2 = z
        B2 = z
        Sigma = z
        for integer, prime, _exponent in terms:
            lp = mp.iv.log(mp.iv.mpf(prime))
            A2 += lp * lp / integer
            B2 += lp**2
            Sigma += lp * mp.iv.sqrt(o / integer)

        decimal_coefficient = mp.iv.mpf("9.22022")
        decimal_exponent = mp.iv.mpf("0.8476836")
        Cpsi = o + 27 * decimal_coefficient * mp.iv.exp(-3) / decimal_exponent**3
        cstar = -mp.iv.log(o - o / root_two) / root_two
        minus_c0 = mp.iv.euler + pi / t + mp.iv.log(8 * pi)

        A2_source = Cpsi * (L + L * L)
        B2_source = (Cpsi * L) * x
        Sigma_source = Cpsi * (t * mp.iv.sqrt(x) - o)
        log_hilbert = (
            t * pi * (o + root_two / log_two) * B2
            + (16 / log_two) * cstar * (Cpsi**2) * x
        )
        M2 = (
            (R * A2) / (t * pi)
            + B2
            + root_two * B2 / log_two
            + (8 / (pi * log_two)) * cstar * Cpsi**2 * x
            + Sigma**2 / (4 * pi * log_two)
        )
        B = g + U
        Cplus = _positive_part(B + minus_c0)
        Aplus = _positive_part(B + minus_c0 + t * Sigma)
        y = mp.iv.sqrt(mp.iv.exp(t * Cplus) - o)
        F = y - mp.iv.atan2(y, o)
        H_dimension = Cplus * d
        H_envelope = (L / (t * pi)) * F
        H = _interval_min(H_dimension, H_envelope)
        central = t * mp.iv.sqrt(M2 * L * d)
        tail = (t / (pi**2)) * d * Aplus / N
        trace = central + tail + H
        rank_plus = trace / gap
        rank_odd = o + rank_plus
        ratio_plus = rank_plus / x
        ratio_odd = rank_odd / x

        values = {
            "lambda": lam,
            "x": x,
            "L": L,
            "zeta": zeta,
            "kappa": kappa,
            "rho": rho,
            "U": U,
            "N": N,
            "d": d,
            "g": g,
            "delta": delta,
            "g_minus_delta": gap,
            "Omega": Omega,
            "R": R,
            "A2": A2,
            "B2": B2,
            "Sigma": Sigma,
            "Cpsi": Cpsi,
            "cstar": cstar,
            "minus_c0": minus_c0,
            "A2_source_upper": A2_source,
            "B2_source_upper": B2_source,
            "Sigma_source_upper": Sigma_source,
            "log_hilbert_bound": log_hilbert,
            "M2_bound": M2,
            "Cplus": Cplus,
            "Aplus": Aplus,
            "F_Cplus": F,
            "H_dimension_branch": H_dimension,
            "H_envelope_branch": H_envelope,
            "H_bound": H,
            "trace_central_prime_bound": central,
            "trace_tail_bound": tail,
            "trace_bound": trace,
            "rank_bound_plus": rank_plus,
            "rank_bound_odd": rank_odd,
            "rank_ratio_plus": ratio_plus,
            "rank_ratio_odd": ratio_odd,
        }
        if tuple(values) != INTERVAL_FIELDS:
            raise ReplayError("internal replay interval inventory mismatch")
        return {name: _capture(value) for name, value in values.items()}
    finally:
        mp.iv.dps = old


def reconstruct(
    lambda_numerator: int, dps: int
) -> tuple[dict[str, Any], dict[str, tuple[mp.mpf, mp.mpf]], dict[str, object]]:
    p = _int(lambda_numerator, "lambda_numerator", 5)
    dps = _int(dps, "interval_decimal_digits", 50)
    if p % 2 == 0:
        raise ReplayError("lambda_numerator must be odd")
    terms = prime_powers_by_integer_factorization(p)
    intervals = _assemble(p, dps, terms)
    N = (p * p + 3) // 4
    vacuous = (
        intervals["rank_bound_plus"][0] >= N
        and intervals["rank_bound_odd"][0] >= N
    )
    return _exact_certificate(p, terms, vacuous), intervals, _exact_regressions()


def _raw_endpoint(value: Any, label: str, dps: int) -> mp.mpf:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"{label} must be a four-item raw dyadic")
    sign, mantissa_text, exponent, bit_count = value
    if sign not in (0, 1) or isinstance(sign, bool):
        raise ReplayError(f"{label} has invalid sign")
    if not isinstance(mantissa_text, str) or _NONNEGATIVE_TEXT.fullmatch(mantissa_text) is None:
        raise ReplayError(f"{label} has noncanonical mantissa")
    if isinstance(exponent, bool) or not isinstance(exponent, int):
        raise ReplayError(f"{label} has noninteger exponent")
    if isinstance(bit_count, bool) or not isinstance(bit_count, int) or bit_count < 0:
        raise ReplayError(f"{label} has invalid bit count")
    mantissa = int(mantissa_text)
    if mantissa == 0:
        if (sign, exponent, bit_count) != (0, 0, 0):
            raise ReplayError(f"{label} has noncanonical zero")
    else:
        if bit_count != mantissa.bit_length() or mantissa % 2 == 0:
            raise ReplayError(f"{label} has noncanonical bit count or mantissa")
        if bit_count > int(3.322 * dps) + 128:
            raise ReplayError(f"{label} exceeds the precision bit budget")
    try:
        with mp.workprec(max(64, bit_count + 16)):
            return +mp.mpf((sign, mantissa, exponent, bit_count))
    except (TypeError, ValueError, OverflowError) as exc:
        raise ReplayError(f"{label} is not a finite raw dyadic") from exc


def _interval(value: Any, label: str, dps: int) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal = value["decimal"]
    dyadic = value["dyadic"]
    if not isinstance(decimal, list) or len(decimal) != 2 or not all(isinstance(x, str) for x in decimal):
        raise ReplayError(f"{label} decimal enclosure malformed")
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ReplayError(f"{label} raw dyadic inventory mismatch")
    lower = _raw_endpoint(dyadic["lower"], f"{label}.lower", dps)
    upper = _raw_endpoint(dyadic["upper"], f"{label}.upper", dps)
    if lower > upper:
        raise ReplayError(f"{label} interval endpoints are reversed")
    with mp.workdps(dps + 20):
        canonical = [mp.nstr(lower, dps + 10), mp.nstr(upper, dps + 10)]
    if decimal != canonical:
        raise ReplayError(f"{label} decimal text does not match raw dyadics")
    return lower, upper


def _compare_interval(
    submitted: tuple[mp.mpf, mp.mpf],
    expected: tuple[mp.mpf, mp.mpf],
    label: str,
    dps: int,
) -> None:
    lo, hi = submitted
    expected_lo, expected_hi = expected
    if lo > expected_lo or hi < expected_hi:
        raise ReplayError(f"{label} does not enclose independent reconstruction")
    with mp.workdps(dps + 30):
        scale_exponent = 0
        for endpoint in (lo, hi, expected_lo, expected_hi):
            _sign, mantissa, exponent, bit_count = endpoint._mpf_
            if mantissa:
                scale_exponent = max(scale_exponent, exponent + bit_count - 1)
        precision_bits = (
            dps * LOG2_10_UPPER_NUMERATOR + LOG2_10_UPPER_DENOMINATOR - 1
        ) // LOG2_10_UPPER_DENOMINATOR
        quantum = mp.power(
            2,
            scale_exponent - precision_bits + SERIALIZATION_GUARD_OFFSET_BITS,
        )
        allowance = 256 * ((expected_hi - expected_lo) + quantum)
        if hi - lo > allowance:
            raise ReplayError(f"{label} interval is not precision-tight")
        if abs((lo + hi) - (expected_lo + expected_hi)) > 4 * allowance:
            raise ReplayError(f"{label} center differs from independent reconstruction")


def replay(payload: dict[str, Any], *, producer_bytes: bytes | None = None) -> dict[str, Any]:
    _validate_json(payload)
    if not isinstance(payload, dict):
        raise ReplayError("artifact payload must be a JSON object")
    if producer_bytes is None:
        raise ReplayError("exact producer artifact bytes are required for replay")
    if not isinstance(producer_bytes, bytes):
        raise ReplayError("producer bytes must be exact bytes")
    decoded = _strict_json_loads(producer_bytes, "producer bytes")
    if not _same(decoded, payload):
        raise ReplayError("producer bytes do not decode exactly to replay payload")
    producer_digest = hashlib.sha256(producer_bytes).hexdigest()

    expected_top = {
        "schema",
        "status",
        "terminal_state",
        "input",
        "source_hashes",
        "locked_conventions",
        "locked_formulas",
        "source_admissions",
        "certificate",
        "arithmetic",
        "producer_pass_boolean_trusted_by_replay",
        "claim_scope",
        "result",
    }
    if set(payload) != expected_top:
        raise ReplayError("top-level artifact inventory mismatch")
    fixed = {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": ARITHMETIC,
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": CLAIM_SCOPE,
        "result": RESULT,
    }
    for key, expected in fixed.items():
        if not _same(payload[key], expected):
            raise ReplayError(f"{key} mutation or claim promotion rejected")

    inputs = payload["input"]
    expected_input_fields = {
        "lambda_numerator",
        "lambda_denominator",
        "interval_decimal_digits",
        "zeta",
        "kappa",
        "rho",
        "U",
    }
    if not isinstance(inputs, dict) or set(inputs) != expected_input_fields:
        raise ReplayError("exact input inventory mismatch")
    p = _int(inputs["lambda_numerator"], "lambda_numerator", 5)
    denominator = _int(inputs["lambda_denominator"], "lambda_denominator", 1)
    dps = _int(inputs["interval_decimal_digits"], "interval_decimal_digits", 50)
    if p % 2 == 0 or denominator != 2:
        raise ReplayError("locked half-integer schedule mutation")
    for field, expected in (
        ("zeta", Fraction(1)),
        ("kappa", Fraction(1, 2)),
        ("rho", Fraction(1, 2)),
        ("U", Fraction(0)),
    ):
        if _parse_rational(inputs[field], f"input.{field}") != expected:
            raise ReplayError(f"input.{field} schedule mutation")

    source_hashes = _source_hashes()
    if not _same(payload["source_hashes"], source_hashes):
        raise ReplayError("declared source-hash inventory mismatch")

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "exact",
        "outward_intervals",
        "exact_regressions",
    }:
        raise ReplayError("certificate inventory mismatch; cached matrices are forbidden")
    expected_exact, expected_intervals, expected_regressions = reconstruct(p, dps)
    if not _same(certificate["exact"], expected_exact):
        raise ReplayError("exact schedule or inclusive prime-power inventory differs from reconstruction")
    if not _same(certificate["exact_regressions"], expected_regressions):
        raise ReplayError("exact capture/gluing regression reconstruction failed")

    intervals = certificate["outward_intervals"]
    if not isinstance(intervals, dict) or tuple(intervals) != INTERVAL_FIELDS:
        # JSON is emitted with sorted keys, so decoded object order is not a
        # semantic promise.  Accept the exact set and replay in locked order.
        if not isinstance(intervals, dict) or set(intervals) != set(INTERVAL_FIELDS):
            raise ReplayError("outward interval inventory mismatch")
    submitted: dict[str, tuple[mp.mpf, mp.mpf]] = {}
    for name in INTERVAL_FIELDS:
        submitted[name] = _interval(intervals[name], name, dps)
        _compare_interval(submitted[name], expected_intervals[name], name, dps)

    if submitted["A2"][1] > submitted["A2_source_upper"][0]:
        raise ReplayError("A2 source upper bound does not separate")
    if submitted["B2"][1] > submitted["B2_source_upper"][0]:
        raise ReplayError("B2 source upper bound does not separate")
    if submitted["Sigma"][1] > submitted["Sigma_source_upper"][0]:
        raise ReplayError("Sigma source upper bound does not separate")
    if submitted["g_minus_delta"][0] <= 0:
        raise ReplayError("dangerous-rank denominator is not positive")

    return {
        "schema": REPLAY_SCHEMA,
        "status": REPLAY_RESULT,
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "byte_source": "exact artifact file bytes",
            "byte_count": len(producer_bytes),
            "sha256": producer_digest,
        },
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": denominator,
            "interval_decimal_digits": dps,
        },
        "source_hashes": source_hashes,
        "reconstructed_exact": expected_exact,
        "checks": {
            "source_note_lock_and_dependencies_rehashed": True,
            "producer_bytes_bound_exactly": True,
            "independent_integer_factorization_inventory_pass": True,
            "inclusive_lambda_squared_endpoint_pass": True,
            "all_submitted_intervals_enclose_reconstruction": True,
            "all_interval_pairs_precision_tight": True,
            "source_arithmetic_bounds_pass": True,
            "capture_and_gluing_regressions_reconstructed": True,
            "fourier_minus_sign_locked": True,
            "cached_matrices_read": False,
            "producer_booleans_trusted": False,
            "binary64_parameters_used": False,
        },
        "arithmetic": dict(ARITHMETIC),
        "claim_boundary": {
            "finite_compressed_trace_bound": True,
            "polynomial_schedule_rank_scale": True,
            "physical_capture": False,
            "signed_low_comparison": False,
            "signed_sector_floor": False,
            "equation_5_2": False,
            "locally_uniform_determinant_convergence": False,
            "rh_proved": False,
        },
        "result": REPLAY_RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    raw = Path(args.artifact).read_bytes()
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    encoded = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
