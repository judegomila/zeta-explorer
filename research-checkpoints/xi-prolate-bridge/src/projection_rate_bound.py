#!/usr/bin/env python3
"""Explicit analytic terms in the prolate-state Fourier projection bound.

The theorem and proof are in ``notes/PROJECTION_RATE_THEOREM.md``.  This
module evaluates only the closed finite bound; it does not pretend to enclose
the prolate supremum ``delta_lambda``.
"""
from __future__ import annotations

from dataclasses import dataclass
import mpmath as mp

from weil_matrix import parse_decimal


def hermite_limit_h(x: mp.mpf) -> mp.mpf:
    x = mp.mpf(x)
    return mp.pi * x * x * (2 * mp.pi * x * x - 3) * mp.exp(-mp.pi * x * x) / 2


@dataclass(frozen=True)
class HermiteTailTerms:
    boundary_value: mp.mpf
    tail_integral: mp.mpf
    arithmetic_l2_bound: mp.mpf


def hermite_tail_terms(lambda_text: str, dps: int = 50) -> HermiteTailTerms:
    """Return A_lambda, I_lambda, and R_h(lambda) from (3.1)/(3.5)."""
    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    if lam < 1:
        raise ValueError("the monotone Hermite-tail formula requires lambda>=1")
    exponential = mp.exp(-mp.pi * lam * lam)
    boundary = mp.pi * lam**2 * (2 * mp.pi * lam**2 - 3) * exponential / 2
    integral = mp.pi * lam**3 * exponential / 2
    radicand = (
        (lam - 1 / lam) * (boundary**2 + integral**2)
        + 4 * boundary * integral * mp.log(lam)
    )
    if radicand < 0:
        raise ArithmeticError("Hermite-tail radicand unexpectedly negative")
    return HermiteTailTerms(boundary, integral, mp.sqrt(radicand))


def limiting_log_derivative_bound(dps: int = 50) -> mp.mpf:
    """The explicit upper bound C_K in equation (4.5)."""
    mp.mp.dps = dps
    B = 2 * mp.pi**3 + mp.mpf(15) * mp.pi**2 / 2 + mp.mpf(15) * mp.pi / 4
    S = 1 + (
        mp.exp(mp.pi)
        * mp.gammainc(mp.mpf(7) / 2, mp.pi, mp.inf)
        / (2 * mp.pi ** (mp.mpf(7) / 2))
    )
    return B * S * mp.sqrt(
        mp.gammainc(mp.mpf(13) / 2, 2 * mp.pi, mp.inf)
        / (2 * mp.pi) ** (mp.mpf(13) / 2)
    )


@dataclass(frozen=True)
class ProjectionRateBound:
    prolate_comparison_term: mp.mpf
    omitted_hermite_tail_term: mp.mpf
    limiting_fourier_tail_term: mp.mpf
    total: mp.mpf


def projection_rate_bound(
    lambda_text: str,
    N: int,
    delta_text: str,
    dps: int = 50,
    ck_bound_text: str | None = None,
) -> ProjectionRateBound:
    """Evaluate the exact right side of projection theorem (5.1).

    ``delta_text`` must be an independently justified upper bound for
    ``max |h_lambda-h|``.  Decimal text is mandatory so this analytic audit
    never enters through binary64.
    """
    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    delta = parse_decimal(delta_text)
    if lam <= 1 or N < 0 or delta < 0:
        raise ValueError("require lambda>1, N>=0, and delta>=0")
    # The exact rational 6006/1000 is an Arb-proved outward upper bound for
    # the sharper incomplete-gamma expression.  A point evaluation of that
    # expression must never be substituted as if it were an upper enclosure.
    safe_ck = mp.mpf(6006) / 1000
    ck = safe_ck if ck_bound_text is None else parse_decimal(ck_bound_text)
    if ck < safe_ck:
        raise ValueError("C_K override must be at least the safe bound 6.006")
    tails = hermite_tail_terms(lambda_text, dps)
    comparison = delta * mp.sqrt(lam**3 - lam)
    fourier = mp.log(lam) * ck / (mp.pi * (N + 1))
    return ProjectionRateBound(
        comparison,
        tails.arithmetic_l2_bound,
        fourier,
        comparison + tails.arithmetic_l2_bound + fourier,
    )
