#!/usr/bin/env python3
"""Explicit source-normalized prolate envelope for the far-prime tail.

This module evaluates Theorem 6.1 of ``notes/PROLATE_TAIL_ENVELOPE.md``
with outward ``mpmath.iv`` intervals.  It concerns one analytic component of
the residual only.  It does not assert a signed Weil comparison, a sector
gap, equation (5.2), determinant convergence, or RH.
"""
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from fractions import Fraction
from pathlib import Path

import mpmath as mp


LOCKED_FOURIER_CONVENTION = "exp(+2*pi*i*x*xi)"
LOCKED_BETA_FORMULA = "(2/pi^2)*log(200*lambda^2+25)"
LOCKED_DEFECT_FORMULA = "Lambda_n=chi_n^2; d_n=1-chi_n^2"
LOCKED_D_FORMULA = "10*exp(-(floor(4*lambda^2)-11)/beta)"
LOCKED_A4_FORMULA = "sqrt(3)/2^(11/4)"
LOCKED_CPSI_FORMULA = (
    "40*3^(-1/4)*exp(-(1+sqrt(3))/2)/(1-1/sqrt(3))^2"
)
LOCKED_MODE_TERM = (
    "16*pi*a4*(1+2*sqrt(2)*lambda)*lambda^(3/2)*sqrt(D)"
)
LOCKED_BUMP_TERM = (
    "(2*sqrt(2)*a4/pi)*Cpsi*lambda^(3/2)*D"
)
LOCKED_ENDPOINT_TERM = (
    "16*pi*a4*(1+2*sqrt(2)*lambda)*sqrt(lambda*D)"
)
LOCKED_NORMALIZATION = "source_limit_h"


@dataclass(frozen=True)
class RealInterval:
    lower: mp.mpf
    upper: mp.mpf

    def __post_init__(self) -> None:
        if self.lower > self.upper:
            raise ValueError("interval endpoints are reversed")


def _endpoints(value: object, dps: int) -> RealInterval:
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(dps + 20):
        return RealInterval(+mp.mpf(raw_lower), +mp.mpf(raw_upper))


def parse_lambda_fraction(lambda_text: str) -> Fraction:
    """Parse exact decimal text and reject every binary64 parameter path."""
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact decimal text (binary64 is forbidden)")
    try:
        lam = Fraction(lambda_text)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact decimal lambda parameter") from exc
    if lam < 2:
        raise ValueError("the proved prolate tail envelope requires lambda>=2")
    return lam


def _require_dps(dps: int) -> int:
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("dps must be an integer")
    if dps < 30:
        raise ValueError("at least 30 interval decimal digits are required")
    return dps


def _require_N(N: int) -> int:
    if isinstance(N, bool) or not isinstance(N, int):
        raise TypeError("N must be an integer")
    if N < 0:
        raise ValueError("N must be nonnegative")
    return N


def require_locked_formulas(
    *,
    fourier: str = LOCKED_FOURIER_CONVENTION,
    beta: str = LOCKED_BETA_FORMULA,
    defect: str = LOCKED_DEFECT_FORMULA,
    D_formula: str = LOCKED_D_FORMULA,
    a4: str = LOCKED_A4_FORMULA,
    Cpsi: str = LOCKED_CPSI_FORMULA,
    mode_term: str = LOCKED_MODE_TERM,
    bump_term: str = LOCKED_BUMP_TERM,
    endpoint_term: str = LOCKED_ENDPOINT_TERM,
    normalization: str = LOCKED_NORMALIZATION,
) -> None:
    """Fail closed on every normalization or parenthesization mutation."""
    supplied = {
        "Fourier convention": (fourier, LOCKED_FOURIER_CONVENTION),
        "KRD beta": (beta, LOCKED_BETA_FORMULA),
        "concentration defect": (defect, LOCKED_DEFECT_FORMULA),
        "KRD leading defect": (D_formula, LOCKED_D_FORMULA),
        "source a4": (a4, LOCKED_A4_FORMULA),
        "bump constant": (Cpsi, LOCKED_CPSI_FORMULA),
        "mode term": (mode_term, LOCKED_MODE_TERM),
        "bump term": (bump_term, LOCKED_BUMP_TERM),
        "endpoint term": (endpoint_term, LOCKED_ENDPOINT_TERM),
        "source normalization": (normalization, LOCKED_NORMALIZATION),
    }
    for label, (actual, expected) in supplied.items():
        if actual != expected:
            raise ValueError(f"{label} differs from the locked tail theorem")


@dataclass(frozen=True)
class ProlateTailEnvelope:
    lambda_text: str
    lambda_exact: Fraction
    N: int
    shannon_floor: int
    leading_gap_integer: int
    prime_cutoff: int
    interval_dps: int
    beta: RealInterval
    D: RealInterval
    a4: RealInterval
    Cpsi: RealInterval
    primitive_defect_constant: RealInterval
    mu_margin: RealInterval
    mode_term: RealInterval
    bump_term: RealInterval
    total_bound: RealInterval
    corrected_endpoint_bound: RealInterval
    test_vector_C: RealInterval
    elementary_prime_tail: RealInterval
    far_prime_pairing: RealInterval


def prolate_tail_envelope(
    lambda_text: str,
    N: int,
    dps: int = 80,
    **locked_overrides: str,
) -> ProlateTailEnvelope:
    """Evaluate the explicit finite envelope with outward intervals."""
    require_locked_formulas(**locked_overrides)
    lam = parse_lambda_fraction(lambda_text)
    N = _require_N(N)
    dps = _require_dps(dps)

    lam2 = lam * lam
    shannon = 4 * lam2
    shannon_floor = shannon.numerator // shannon.denominator
    leading_gap = shannon_floor - 11
    prime_cutoff = lam2.numerator // lam2.denominator
    if leading_gap <= 0 or prime_cutoff < 2:
        raise ArithmeticError("tail-envelope integer hypotheses were not met")

    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam_iv = mp.iv.mpf(lam.numerator) / mp.iv.mpf(lam.denominator)
        half = mp.iv.mpf(1) / 2
        beta_iv = 2 / mp.iv.pi**2 * mp.iv.log(200 * lam_iv**2 + 25)
        D_iv = 10 * mp.iv.exp(-leading_gap / beta_iv)
        a4_iv = mp.iv.sqrt(3) / mp.iv.power(2, mp.iv.mpf(11) / 4)
        Cpsi_iv = (
            40
            * mp.iv.power(3, -mp.iv.mpf(1) / 4)
            * mp.iv.exp(-(1 + mp.iv.sqrt(3)) / 2)
            / (1 - 1 / mp.iv.sqrt(3)) ** 2
        )
        primitive_iv = 11 / mp.iv.sqrt(2)
        c_squared_iv = (2 * mp.iv.pi * lam_iv**2) ** 2
        mu_margin_iv = c_squared_iv / 8 - 20
        lam_three_halves = lam_iv * mp.iv.sqrt(lam_iv)
        mode_iv = (
            16
            * mp.iv.pi
            * a4_iv
            * (1 + 2 * mp.iv.sqrt(2) * lam_iv)
            * lam_three_halves
            * mp.iv.sqrt(D_iv)
        )
        bump_iv = (
            2
            * mp.iv.sqrt(2)
            * a4_iv
            / mp.iv.pi
            * Cpsi_iv
            * lam_three_halves
            * D_iv
        )
        total_iv = mode_iv + bump_iv
        endpoint_iv = (
            16
            * mp.iv.pi
            * a4_iv
            * (1 + 2 * mp.iv.sqrt(2) * lam_iv)
            * mp.iv.sqrt(lam_iv * D_iv)
        )

        L_iv = 2 * mp.iv.log(lam_iv)
        M0_iv = mp.iv.sqrt((2 * N + 1) / L_iv)
        M1_iv = (
            2
            * mp.iv.pi
            / (L_iv * mp.iv.sqrt(L_iv))
            * mp.iv.sqrt(mp.iv.mpf(N * (N + 1) * (2 * N + 1)) / 3)
        )
        inv_lam_three_halves = 1 / lam_three_halves
        C_test_iv = M0_iv * (lam_three_halves + inv_lam_three_halves) + (
            mp.iv.mpf(2) / 3
        ) * (lam_three_halves - inv_lam_three_halves) * (M1_iv + M0_iv * half)
        prime_tail_iv = (mp.iv.log(prime_cutoff) + 1) / prime_cutoff
        far_pairing_iv = mp.iv.pi / 12 * total_iv * C_test_iv * prime_tail_iv

        values = {
            "beta": _endpoints(beta_iv, dps),
            "D": _endpoints(D_iv, dps),
            "a4": _endpoints(a4_iv, dps),
            "Cpsi": _endpoints(Cpsi_iv, dps),
            "primitive": _endpoints(primitive_iv, dps),
            "mu_margin": _endpoints(mu_margin_iv, dps),
            "mode": _endpoints(mode_iv, dps),
            "bump": _endpoints(bump_iv, dps),
            "total": _endpoints(total_iv, dps),
            "endpoint": _endpoints(endpoint_iv, dps),
            "C_test": _endpoints(C_test_iv, dps),
            "prime_tail": _endpoints(prime_tail_iv, dps),
            "far_pairing": _endpoints(far_pairing_iv, dps),
        }
    finally:
        mp.iv.dps = old_iv_dps

    if values["D"].upper > mp.mpf("0.5"):
        raise ArithmeticError("KRD D_lambda<=1/2 check failed")
    if values["primitive"].upper >= 8:
        raise ArithmeticError("11/sqrt(2)<8 safety check failed")
    if values["mu_margin"].lower <= 0:
        raise ArithmeticError("mu_4<c^2 min-max margin is not positive")
    if values["total"].lower <= 0:
        raise ArithmeticError("tail envelope must be strictly positive")

    return ProlateTailEnvelope(
        lambda_text=lambda_text,
        lambda_exact=lam,
        N=N,
        shannon_floor=shannon_floor,
        leading_gap_integer=leading_gap,
        prime_cutoff=prime_cutoff,
        interval_dps=dps,
        beta=values["beta"],
        D=values["D"],
        a4=values["a4"],
        Cpsi=values["Cpsi"],
        primitive_defect_constant=values["primitive"],
        mu_margin=values["mu_margin"],
        mode_term=values["mode"],
        bump_term=values["bump"],
        total_bound=values["total"],
        corrected_endpoint_bound=values["endpoint"],
        test_vector_C=values["C_test"],
        elementary_prime_tail=values["prime_tail"],
        far_prime_pairing=values["far_pairing"],
    )


def _serialize_interval(interval: RealInterval, digits: int) -> list[str]:
    return [mp.nstr(interval.lower, digits), mp.nstr(interval.upper, digits)]


def serialize_prolate_tail(bound: ProlateTailEnvelope) -> dict[str, object]:
    digits = bound.interval_dps + 10
    interval = lambda value: _serialize_interval(value, digits)
    return {
        "claim_class": "ANALYTIC_UNIFORM_FAR_PRIME_COMPONENT_BOUND",
        "terminal_state": "P0_INVALIDATED",
        "far_prime_component_analytic_uniform_claim": True,
        "full_residual_analytic_uniform_claim": False,
        "full_residual_claim": False,
        "equation_5_2_claim": False,
        "inputs": {
            "lambda": bound.lambda_text,
            "lambda_exact": str(bound.lambda_exact),
            "N": bound.N,
            "interval_decimal_digits": bound.interval_dps,
            "arithmetic_library": f"mpmath.iv {mp.__version__}",
        },
        "locked_formulas": {
            "Fourier": LOCKED_FOURIER_CONVENTION,
            "beta": LOCKED_BETA_FORMULA,
            "concentration": LOCKED_DEFECT_FORMULA,
            "D": LOCKED_D_FORMULA,
            "a4": LOCKED_A4_FORMULA,
            "Cpsi": LOCKED_CPSI_FORMULA,
            "mode_term": LOCKED_MODE_TERM,
            "bump_term": LOCKED_BUMP_TERM,
            "endpoint_term": LOCKED_ENDPOINT_TERM,
            "normalization": LOCKED_NORMALIZATION,
        },
        "exact_integer_data": {
            "floor_4lambda_squared": bound.shannon_floor,
            "leading_exponent_numerator": bound.leading_gap_integer,
            "floor_lambda_squared": bound.prime_cutoff,
        },
        "outward_intervals": {
            "beta": interval(bound.beta),
            "D": interval(bound.D),
            "a4": interval(bound.a4),
            "Cpsi": interval(bound.Cpsi),
            "11_over_sqrt2": interval(bound.primitive_defect_constant),
            "c_squared_over_8_minus_20": interval(bound.mu_margin),
            "mode_term": interval(bound.mode_term),
            "bump_term": interval(bound.bump_term),
            "total_bound_B_f": interval(bound.total_bound),
            "corrected_endpoint_bound": interval(
                bound.corrected_endpoint_bound
            ),
            "uniform_test_vector_C_lambda_N": interval(bound.test_vector_C),
            "elementary_prime_tail": interval(bound.elementary_prime_tail),
            "far_prime_pairing_bound": interval(bound.far_prime_pairing),
        },
        "checks": {
            "D_at_most_one_half": bound.D.upper <= mp.mpf("0.5"),
            "primitive_constant_below_8": (
                bound.primitive_defect_constant.upper < 8
            ),
            "mu4_strict_margin_positive": bound.mu_margin.lower > 0,
            "combined_before_reporting": True,
        },
        "source_chain": {
            "KRD": "vendor/KRD-PSWF-2006.00427v2.pdf",
            "KRD_sha256": (
                "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0"
            ),
            "DPSS_to_PSWF_dependency": "vendor/BBK-DPSWF-1905.08354v1.pdf",
            "dependency_sha256": (
                "928759f7eebeeb59883ae2de305ebe8062f412c2ad0d275bb9ad4320c897ff6b"
            ),
        },
        "limitations": [
            "far-prime leakage-correlation component only",
            "the finite/near signed Chebyshev-error integral is not bounded here",
            "no physical-map conditioning or shifted sector-floor theorem",
            "producer interval arithmetic uses mpmath.iv; replay must disclose if it shares that library",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", default="2")
    parser.add_argument("--N", type=int, default=12)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = serialize_prolate_tail(
        prolate_tail_envelope(args.lambda_text, args.N, args.dps)
    )
    text = json.dumps(result, indent=2) + "\n"
    if args.output:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")


__all__ = [
    "LOCKED_A4_FORMULA",
    "LOCKED_BETA_FORMULA",
    "LOCKED_BUMP_TERM",
    "LOCKED_CPSI_FORMULA",
    "LOCKED_D_FORMULA",
    "LOCKED_DEFECT_FORMULA",
    "LOCKED_ENDPOINT_TERM",
    "LOCKED_FOURIER_CONVENTION",
    "LOCKED_MODE_TERM",
    "LOCKED_NORMALIZATION",
    "ProlateTailEnvelope",
    "RealInterval",
    "parse_lambda_fraction",
    "prolate_tail_envelope",
    "require_locked_formulas",
    "serialize_prolate_tail",
]


if __name__ == "__main__":
    main()
