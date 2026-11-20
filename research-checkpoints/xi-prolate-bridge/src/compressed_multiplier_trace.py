#!/usr/bin/env python3
"""Produce the finite compressed-multiplier trace certificate.

This component evaluates the explicit theorem in
``notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md`` with outward ``mpmath.iv``
arithmetic.  It proves only a finite trace/rank bound.  It does not claim a
physical capture theorem, a signed Weil floor, equation (5.2), or a
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


SCHEMA = "xi-prolate-compressed-multiplier-trace-v1"
STATUS = "COMPRESSED_MULTIPLIER_TRACE_COMPONENT"
RESULT = "COMPRESSED_MULTIPLIER_TRACE_COMPONENT_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md"
LOCK = "COMPRESSED_MULTIPLIER_TRACE_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-compressed-multiplier-trace-source-lock-v1"
EXPECTED_LIBRARY = "mpmath.iv 1.4.1"
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 16

# Final byte pins for the theorem note and its source lock.  Production fails
# closed on any later mutation.
PINNED_HASHES = {
    NOTE: "ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f",
    LOCK: "5beedcf1f36206ec0f10331f139a4156ac43d0335f1bd90bbe64eba6016464da",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")

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


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _verified_source_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ValueError(f"PINNED_HASHES placeholder not finalized: {relative}")
        if _sha256(root / relative) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")

    lock = json.loads((root / LOCK).read_text(encoding="utf-8"))
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
        raise ValueError("compressed-trace source-lock inventory mismatch")
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
        if lock[key] != expected:
            raise ValueError(f"compressed-trace source-lock {key} mutation")

    result = dict(PINNED_HASHES)
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("compressed-trace source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed compressed-trace dependency")
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
            raise ValueError("invalid compressed-trace dependency fields")
        if _sha256(root / relative) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def _rational(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def _raw(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _precision_bits(dps: int) -> int:
    return (
        dps * LOG2_10_UPPER_NUMERATOR + LOG2_10_UPPER_DENOMINATOR - 1
    ) // LOG2_10_UPPER_DENOMINATOR


def _normalize_signed_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return (0, 0, 0, 0)
    sign = 1 if value < 0 else 0
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return (sign, mantissa, exponent, mantissa.bit_length())


def _shift_raw_by_power_of_two(
    raw: tuple[int, int, int, int], power: int, direction: int
) -> tuple[int, int, int, int]:
    if direction not in (-1, 1):
        raise ValueError("dyadic shift direction must be -1 or 1")
    sign, mantissa, exponent, _bit_count = raw
    signed_mantissa = -mantissa if sign else mantissa
    base = min(exponent, power)
    shifted = (signed_mantissa << (exponent - base)) + direction * (
        1 << (power - base)
    )
    return _normalize_signed_dyadic(shifted, base)


def _guarded_raw_endpoints(
    lower: tuple[int, int, int, int],
    upper: tuple[int, int, int, int],
    dps: int,
) -> tuple[tuple[int, int, int, int], tuple[int, int, int, int]]:
    if lower == upper:
        return lower, upper
    scale_exponent = 0
    for _sign, mantissa, exponent, bit_count in (lower, upper):
        if mantissa:
            scale_exponent = max(scale_exponent, exponent + bit_count - 1)
    guard_exponent = (
        scale_exponent - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
    )
    return (
        _shift_raw_by_power_of_two(lower, guard_exponent, -1),
        _shift_raw_by_power_of_two(upper, guard_exponent, 1),
    )


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    bits = max(int(lower[3]), int(upper[3])) + 48
    with mp.workprec(bits):
        return +mp.mpf(tuple(lower)), +mp.mpf(tuple(upper))


def _serialize(value: object, dps: int) -> dict[str, object]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lo, hi = _guarded_raw_endpoints(
        tuple(int(part) for part in lower),
        tuple(int(part) for part in upper),
        dps,
    )
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), dps + 10), mp.nstr(mp.mpf(hi), dps + 10)],
            "dyadic": {"lower": _raw(lo), "upper": _raw(hi)},
        }


def _positive_part(value: object) -> object:
    lower, upper = _capture(value)
    if upper <= 0:
        return mp.iv.mpf(0)
    if lower >= 0:
        return value
    return mp.iv.mpf([0, upper])


def _interval_min(left: object, right: object) -> object:
    left_lo, left_hi = _capture(left)
    right_lo, right_hi = _capture(right)
    return mp.iv.mpf([min(left_lo, right_lo), min(left_hi, right_hi)])


def prime_powers_by_sieve(p: int) -> list[tuple[int, int, int]]:
    """Enumerate every ``(n, prime, exponent)`` with ``n<=lambda^2``."""

    cutoff = (p * p) // 4
    sieve = [True] * (cutoff + 1)
    if cutoff >= 0:
        sieve[0] = False
    if cutoff >= 1:
        sieve[1] = False
    candidate = 2
    while candidate * candidate <= cutoff:
        if sieve[candidate]:
            for composite in range(candidate * candidate, cutoff + 1, candidate):
                sieve[composite] = False
        candidate += 1

    result: list[tuple[int, int, int]] = []
    for prime in range(2, cutoff + 1):
        if not sieve[prime]:
            continue
        power = prime
        exponent = 1
        while power <= cutoff:
            result.append((power, prime, exponent))
            if power > cutoff // prime:
                break
            power *= prime
            exponent += 1
    return sorted(result)


def _exact_regressions() -> dict[str, object]:
    # Saturation of (6.4): B_sh=gI-R=diag(-1,1), the active excess
    # projector is span(e_1), and K^perp is span((3/5,4/5)).  The eigenvalue
    # exactly at g-delta contributes no excess and is immaterial to (6.3).
    capture_g = Fraction(4)
    capture_delta = Fraction(1)
    capture_r = Fraction(5)
    capture_s2 = Fraction(9, 25)
    surcharge = max(Fraction(0), capture_r - capture_g + capture_delta)
    capture_floor = capture_delta - surcharge * capture_s2

    mu = Fraction(1)
    eta = Fraction(4)
    quotient_metric = Fraction(9, 4)
    chi = Fraction(3, 5)
    cross = Fraction(9, 5)
    nu = Fraction(2, 5)
    return {
        "capture_floor_model": {
            "g": _rational(capture_g),
            "delta": _rational(capture_delta),
            "r": _rational(capture_r),
            "s_squared": _rational(capture_s2),
            "positive_part_r_minus_g_plus_delta": _rational(surcharge),
            "certified_floor": _rational(capture_floor),
            "actual_compressed_floor": _rational(Fraction(7, 25)),
            "exact_capture_floor_at_s_squared_zero": _rational(capture_delta),
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
            "quotient_metric": _rational(quotient_metric),
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


def _assemble_intervals(
    p: int, N: int, terms: list[tuple[int, int, int]], dps: int
) -> dict[str, object]:
    if f"mpmath.iv {mp.__version__}" != EXPECTED_LIBRARY:
        raise RuntimeError("pinned mpmath.iv version is not active")
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        zero = mp.iv.mpf(0)
        one = mp.iv.mpf(1)
        two = one + one
        pi = +mp.iv.pi
        log2 = mp.iv.log(two)
        sqrt2 = mp.iv.sqrt(two)

        lam = mp.iv.mpf(p) / two
        x = lam * lam
        L = mp.iv.log(x)
        zeta = one
        kappa = one / two
        rho = one / two
        U = zero
        N_iv = mp.iv.mpf(N)
        d = mp.iv.mpf(2 * N + 1)
        g = kappa * L
        delta = rho * g
        gap = g - delta
        Omega = two * pi * N_iv / L
        R = (one + zeta) * Omega

        A2 = zero
        B2 = zero
        Sigma = zero
        for integer, prime, _exponent in terms:
            log_prime = mp.iv.log(mp.iv.mpf(prime))
            coefficient = log_prime / mp.iv.sqrt(mp.iv.mpf(integer))
            A2 += coefficient * coefficient
            B2 += log_prime * log_prime
            Sigma += coefficient

        coefficient = mp.iv.mpf("9.22022")
        exponent = mp.iv.mpf("0.8476836")
        Cpsi = one + coefficient * (mp.iv.mpf(3) / exponent) ** 3 * mp.iv.exp(-3)
        cstar = mp.iv.log(one / (one - one / sqrt2)) / sqrt2
        minus_c0 = mp.iv.euler + pi / two + 3 * log2 + mp.iv.log(pi)

        A2_source_upper = Cpsi * L * (one + L)
        B2_source_upper = Cpsi * x * L
        Sigma_source_upper = Cpsi * (two * mp.iv.sqrt(x) - one)
        log_hilbert = (
            two * pi * (one + sqrt2 / log2) * B2
            + 16 * cstar * Cpsi * Cpsi * x / log2
        )
        M2 = (
            R * A2 / (two * pi)
            + (one + sqrt2 / log2) * B2
            + 8 * cstar * Cpsi * Cpsi * x / (pi * log2)
            + Sigma * Sigma / (4 * pi * log2)
        )

        B = U + g
        Cplus = _positive_part(B + minus_c0)
        Aplus = _positive_part(B + two * Sigma + minus_c0)
        root = mp.iv.sqrt(mp.iv.expm1(two * Cplus))
        F_Cplus = root - mp.iv.atan2(root, one)
        H_dimension = d * Cplus
        H_envelope = L * F_Cplus / (two * pi)
        H_bound = _interval_min(H_dimension, H_envelope)
        trace_central = two * mp.iv.sqrt(d * L * M2)
        trace_tail = two * d * Aplus / (pi * pi * zeta * N_iv)
        trace = H_bound + trace_central + trace_tail
        rank_plus = trace / gap
        rank_odd = rank_plus + one
        rank_ratio_plus = rank_plus / x
        rank_ratio_odd = rank_odd / x

        values = {
            "lambda": lam,
            "x": x,
            "L": L,
            "zeta": zeta,
            "kappa": kappa,
            "rho": rho,
            "U": U,
            "N": N_iv,
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
            "A2_source_upper": A2_source_upper,
            "B2_source_upper": B2_source_upper,
            "Sigma_source_upper": Sigma_source_upper,
            "log_hilbert_bound": log_hilbert,
            "M2_bound": M2,
            "Cplus": Cplus,
            "Aplus": Aplus,
            "F_Cplus": F_Cplus,
            "H_dimension_branch": H_dimension,
            "H_envelope_branch": H_envelope,
            "H_bound": H_bound,
            "trace_central_prime_bound": trace_central,
            "trace_tail_bound": trace_tail,
            "trace_bound": trace,
            "rank_bound_plus": rank_plus,
            "rank_bound_odd": rank_odd,
            "rank_ratio_plus": rank_ratio_plus,
            "rank_ratio_odd": rank_ratio_odd,
        }
        if tuple(values) != INTERVAL_FIELDS:
            raise AssertionError("internal compressed-trace interval inventory mismatch")
        for exact_sum, upper in (
            (A2, A2_source_upper),
            (B2, B2_source_upper),
            (Sigma, Sigma_source_upper),
        ):
            if _capture(exact_sum)[1] > _capture(upper)[0]:
                raise ArithmeticError("pinned source arithmetic bound did not separate")
        return values
    finally:
        mp.iv.dps = old


def produce(lambda_numerator: int, dps: int = 80) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    dps = _integer(dps, "dps", 50)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    N = (p * p + 3) // 4
    cutoff = (p * p) // 4
    terms = prime_powers_by_sieve(p)
    values = _assemble_intervals(p, N, terms, dps)

    exact = {
        "lambda": _rational(Fraction(p, 2)),
        "x_lambda_squared": _rational(Fraction(p * p, 4)),
        "prime_power_integer_cutoff": cutoff,
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
            _capture(values["rank_bound_plus"])[0] >= N
            and _capture(values["rank_bound_odd"])[0] >= N
        ),
    }

    return {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": 2,
            "interval_decimal_digits": dps,
            "zeta": _rational(Fraction(1)),
            "kappa": _rational(Fraction(1, 2)),
            "rho": _rational(Fraction(1, 2)),
            "U": _rational(Fraction(0)),
        },
        "source_hashes": _verified_source_hashes(),
        "locked_conventions": dict(LOCKED_CONVENTIONS),
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "certificate": {
            "exact": exact,
            "outward_intervals": {
                name: _serialize(values[name], dps) for name in INTERVAL_FIELDS
            },
            "exact_regressions": _exact_regressions(),
        },
        "arithmetic": {
            "precision_mode": "outward arbitrary-precision intervals",
            "raw_interval_or_ball_output_applicable": True,
            "library": EXPECTED_LIBRARY,
            "shared_library_with_verifier": True,
            "independent_prime_power_enumeration": True,
            "independent_formula_trees": True,
            "serialization_guard": "exact dyadic rule locked in source conventions; nondegenerate intervals only",
            "independence_limitation": "producer and replay share the exact pinned mpmath.iv transcendental runtime",
        },
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": {key: list(value) for key, value in CLAIM_SCOPE.items()},
        "result": RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    encoded = json.dumps(
        produce(args.lambda_numerator, args.dps), indent=2, sort_keys=True
    ) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
