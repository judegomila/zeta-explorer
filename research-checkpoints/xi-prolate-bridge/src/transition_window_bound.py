#!/usr/bin/env python3
"""Safe conversion of the pinned KRD Corollary 3 transition bound.

The binding formula and parameter map are recorded in ``P2_SOURCE_LOCK.json``.
This module concerns only the positive prolate concentration eigenvalues.  It
does not compare that positive model with the signed Weil form.

The input ``lambda`` is exact decimal text.  Rational operations on it are
performed with :class:`fractions.Fraction`; transcendental quantities are
evaluated with outward-rounded ``mpmath.iv`` intervals.  In particular, the
integer buffer is returned only after both endpoints of an interval enclosure
have the same ceiling.
"""
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from fractions import Fraction
from pathlib import Path

import mpmath as mp


LOCKED_BETA_CONVENTION = "(2/pi^2)*log(200*lambda^2+25)"
LOCKED_TRAILING_EXPONENT = "-(n-ceil(S)-6)/beta"


def parse_lambda_fraction(lambda_text: str) -> Fraction:
    """Parse an exact textual parameter, rejecting every binary64 path."""
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact decimal text (binary64 is forbidden)")
    try:
        lam = Fraction(lambda_text)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact decimal lambda parameter") from exc
    if lam <= 1:
        raise ValueError("the repository logarithmic interval requires lambda>1")
    return lam


def require_locked_formulas(
    beta_convention: str = LOCKED_BETA_CONVENTION,
    exponent_convention: str = LOCKED_TRAILING_EXPONENT,
) -> None:
    """Reject a reciprocal placement or exponent differing from the lock."""
    if beta_convention != LOCKED_BETA_CONVENTION:
        raise ValueError("KRD beta convention differs from P2_SOURCE_LOCK.json")
    if exponent_convention != LOCKED_TRAILING_EXPONENT:
        raise ValueError("KRD trailing exponent differs from P2_SOURCE_LOCK.json")


def _require_precision(dps: int) -> int:
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("dps must be an integer")
    if dps < 30:
        raise ValueError("at least 30 decimal digits are required")
    return dps


def _require_index(n: int) -> int:
    if isinstance(n, bool) or not isinstance(n, int):
        raise TypeError("the prolate index must be an integer")
    if n < 0:
        raise ValueError("the prolate index must be nonnegative")
    return n


@dataclass(frozen=True)
class RealInterval:
    """Closed outward enclosure represented by arbitrary-precision endpoints."""

    lower: mp.mpf
    upper: mp.mpf

    def __post_init__(self) -> None:
        if self.lower > self.upper:
            raise ValueError("interval endpoints are reversed")


def _endpoints(value: object, dps: int) -> RealInterval:
    """Copy exact internal interval endpoints into independent ``mpf`` values."""
    # mpmath interval objects expose their two exact libmp endpoint tuples in
    # ``_mpi_``.  Conversion at higher working precision preserves more bits
    # than the interval calculation requested here.
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(dps + 20):
        lower = +mp.mpf(raw_lower)
        upper = +mp.mpf(raw_upper)
    return RealInterval(lower, upper)


def _interval_quantities(lam: Fraction, dps: int) -> tuple[RealInterval, RealInterval]:
    """Enclose beta and beta*log(20) at the requested interval precision."""
    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam_iv = mp.iv.mpf(lam.numerator) / mp.iv.mpf(lam.denominator)
        beta_iv = (
            2
            / mp.iv.pi**2
            * mp.iv.log(200 * lam_iv**2 + 25)
        )
        buffer_iv = beta_iv * mp.iv.log(20)
        return _endpoints(beta_iv, dps), _endpoints(buffer_iv, dps)
    finally:
        mp.iv.dps = old_iv_dps


def _common_ceiling(interval: RealInterval) -> int | None:
    lower_ceil = int(mp.ceil(interval.lower))
    upper_ceil = int(mp.ceil(interval.upper))
    return lower_ceil if lower_ceil == upper_ceil else None


@dataclass(frozen=True)
class TransitionWindowBound:
    """Pinned transition parameters and safe KRD trailing-side evaluations."""

    lambda_text: str
    lambda_exact: Fraction
    shannon_index: Fraction
    shannon_ceil: int
    beta: RealInterval
    buffer: RealInterval
    buffer_ceil: int
    n_star: int
    interval_dps: int

    def trailing_upper_bound(self, n: int) -> mp.mpf:
        """Return an outward upper bound for ``Lambda_n`` from Corollary 3."""
        n = _require_index(n)
        if n < self.shannon_ceil:
            raise ValueError("the KRD trailing bound requires n>=ceil(S)")

        old_iv_dps = mp.iv.dps
        try:
            mp.iv.dps = self.interval_dps
            beta_iv = mp.iv.mpf([self.beta.lower, self.beta.upper])
            exponent = -(n - self.shannon_ceil - 6) / beta_iv
            value = 10 * mp.iv.exp(exponent)
            return _endpoints(value, self.interval_dps).upper
        finally:
            mp.iv.dps = old_iv_dps

    def defect_lower_bound(self, n: int) -> mp.mpf:
        """Return ``max(0,1-U_n)``, a safe lower bound for ``1-Lambda_n``."""
        upper = self.trailing_upper_bound(n)
        old_iv_dps = mp.iv.dps
        try:
            mp.iv.dps = self.interval_dps
            complement = 1 - mp.iv.mpf(upper)
            lower = _endpoints(complement, self.interval_dps).lower
        finally:
            mp.iv.dps = old_iv_dps
        return lower if lower > 0 else mp.mpf("0")

    def has_half_defect_floor(self, n: int) -> bool:
        """Whether the locked integer threshold proves ``1-Lambda_n>=1/2``."""
        n = _require_index(n)
        return n >= self.n_star

    def shannon_target_counts(self) -> tuple[int, int]:
        """Count plus/minus targets satisfying the strict cutoff ``t<S``."""
        x = self.lambda_exact * self.lambda_exact

        def ceil_fraction(value: Fraction) -> int:
            return -(-value.numerator // value.denominator)

        plus = max(0, ceil_fraction(x) - 2)  # 8,12,... < 4*x
        minus = max(0, ceil_fraction(x - Fraction(1, 2)) - 1)  # 6,10,...
        return plus, minus

    def buffered_target_counts(self) -> tuple[int, int]:
        """Count plus/minus targets in the strict buffered window ``t<n_*``."""
        plus = max(0, (self.n_star - 1) // 4 - 1)
        minus = max(0, (self.n_star - 3) // 4)
        return plus, minus


def transition_window_bound(
    lambda_text: str,
    dps: int = 80,
    *,
    beta_convention: str = LOCKED_BETA_CONVENTION,
    exponent_convention: str = LOCKED_TRAILING_EXPONENT,
    max_refinements: int = 3,
) -> TransitionWindowBound:
    """Construct the pinned KRD transition threshold.

    ``max_refinements`` controls how often the interval precision may double
    if the enclosure of ``beta*log(20)`` straddles an integer.  Failure to
    establish a common ceiling is reported rather than silently rounded.
    """
    require_locked_formulas(beta_convention, exponent_convention)
    dps = _require_precision(dps)
    if isinstance(max_refinements, bool) or not isinstance(max_refinements, int):
        raise TypeError("max_refinements must be an integer")
    if max_refinements < 0:
        raise ValueError("max_refinements must be nonnegative")

    lam = parse_lambda_fraction(lambda_text)
    shannon = 4 * lam * lam
    shannon_ceil = -(-shannon.numerator // shannon.denominator)

    used_dps = dps
    beta = buffer = None
    buffer_ceil = None
    for _ in range(max_refinements + 1):
        beta, buffer = _interval_quantities(lam, used_dps)
        buffer_ceil = _common_ceiling(buffer)
        if buffer_ceil is not None:
            break
        used_dps *= 2
    if beta is None or buffer is None or buffer_ceil is None:
        raise ArithmeticError(
            "could not certify ceil(beta*log(20)); increase interval precision"
        )

    n_star = shannon_ceil + 6 + buffer_ceil
    result = TransitionWindowBound(
        lambda_text=lambda_text,
        lambda_exact=lam,
        shannon_index=shannon,
        shannon_ceil=shannon_ceil,
        beta=beta,
        buffer=buffer,
        buffer_ceil=buffer_ceil,
        n_star=n_star,
        interval_dps=used_dps,
    )
    # This check catches an implementation or parenthesization regression in
    # the actual outward evaluation, independently of the symbolic threshold.
    if result.trailing_upper_bound(n_star) > mp.mpf("0.5"):
        raise ArithmeticError("derived n_star does not certify Lambda_n<=1/2")
    return result


def serialize_transition_window(bound: TransitionWindowBound) -> dict[str, object]:
    """Serialize exact inputs and outward interval endpoints for replay."""
    digits = bound.interval_dps + 10
    nstr = lambda value: mp.nstr(value, digits)
    return {
        "claim_class": "PINNED_POSITIVE_PROLATE_TRANSITION_BOUND",
        "terminal_state": "P0_INVALIDATED",
        "signed_weil_comparison_claim": False,
        "inputs": {
            "lambda": bound.lambda_text,
            "lambda_exact": str(bound.lambda_exact),
            "interval_decimal_digits": bound.interval_dps,
            "arithmetic_library": f"mpmath.iv {mp.__version__}",
        },
        "locked_formulas": {
            "beta": LOCKED_BETA_CONVENTION,
            "trailing_exponent": LOCKED_TRAILING_EXPONENT,
        },
        "exact_indices": {
            "shannon_index": str(bound.shannon_index),
            "shannon_ceil": bound.shannon_ceil,
            "buffer_ceil": bound.buffer_ceil,
            "n_star": bound.n_star,
            "shannon_target_counts_plus_minus": list(
                bound.shannon_target_counts()
            ),
            "buffered_target_counts_plus_minus": list(
                bound.buffered_target_counts()
            ),
        },
        "outward_intervals": {
            "beta": [nstr(bound.beta.lower), nstr(bound.beta.upper)],
            "beta_log20": [nstr(bound.buffer.lower), nstr(bound.buffer.upper)],
            "Lambda_upper_at_n_star": nstr(
                bound.trailing_upper_bound(bound.n_star)
            ),
            "defect_lower_at_n_star": nstr(
                bound.defect_lower_bound(bound.n_star)
            ),
            "Lambda_upper_at_previous_index": nstr(
                bound.trailing_upper_bound(bound.n_star - 1)
            ),
        },
        "checks": {
            "n_star_is_included": bound.has_half_defect_floor(bound.n_star),
            "previous_index_is_not_promoted": not bound.has_half_defect_floor(
                bound.n_star - 1
            ),
        },
        "limitations": [
            "positive sinc-kernel concentration model only",
            "no lower bound for the fixed leading defects",
            "no physical arithmetic-map conditioning or signed Weil comparison",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", default="2")
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = serialize_transition_window(
        transition_window_bound(args.lambda_text, args.dps)
    )
    text = json.dumps(result, indent=2) + "\n"
    if args.output:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")


__all__ = [
    "LOCKED_BETA_CONVENTION",
    "LOCKED_TRAILING_EXPONENT",
    "RealInterval",
    "TransitionWindowBound",
    "parse_lambda_fraction",
    "require_locked_formulas",
    "serialize_transition_window",
    "transition_window_bound",
]


if __name__ == "__main__":
    main()
