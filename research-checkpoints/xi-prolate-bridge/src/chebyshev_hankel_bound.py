#!/usr/bin/env python3
"""Uniform moment bounds for the combined Chebyshev-error Hankel kernel.

The formulas are proved in ``notes/NEAR_SIGNED_HANKEL_REDUCTION.md`` and use
the exact v3 source lock in ``P3_SOURCE_LOCK.json``.  This module evaluates
only the three kernel moments C_{-1}, C_0, and C_1.  It does not supply the
missing prolate boundary-profile estimates or a signed Weil lower bound.
"""
from __future__ import annotations

import argparse
import json
import math
from dataclasses import dataclass
from pathlib import Path

import mpmath as mp


LOCKED_PNT_A = "9.22022"
LOCKED_PNT_ALPHA = "0.8476836"
LOCKED_PNT_FORMULA = (
    "abs(psi(X)-X)/X < A*(log X)^(3/2)*exp(-alpha*sqrt(log X)) for X>2"
)
LOCKED_KERNEL_FORMULA = (
    "delta_star(x)=1-exp(-x)*psi(exp(x))-(1/2)*exp(-x)*log(1-exp(-2*x))"
)
LOCKED_SOURCE_SHA256 = (
    "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4"
)


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


def _require_dps(dps: int) -> int:
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("dps must be an integer")
    if dps < 30:
        raise ValueError("at least 30 interval decimal digits are required")
    return dps


def require_locked_source(
    *,
    A: str = LOCKED_PNT_A,
    alpha: str = LOCKED_PNT_ALPHA,
    pnt_formula: str = LOCKED_PNT_FORMULA,
    kernel_formula: str = LOCKED_KERNEL_FORMULA,
) -> None:
    supplied = {
        "PNT A": (A, LOCKED_PNT_A),
        "PNT alpha": (alpha, LOCKED_PNT_ALPHA),
        "PNT formula": (pnt_formula, LOCKED_PNT_FORMULA),
        "combined kernel": (kernel_formula, LOCKED_KERNEL_FORMULA),
    }
    for label, (actual, expected) in supplied.items():
        if actual != expected:
            raise ValueError(f"{label} differs from P3_SOURCE_LOCK.json")


def _upper_gamma_integer(n: int, z: object) -> object:
    """Upper incomplete Gamma(n,z) using its exact finite-sum identity."""
    if isinstance(n, bool) or not isinstance(n, int) or n < 1:
        raise ValueError("n must be a positive integer")
    polynomial = mp.iv.mpf(0)
    term = mp.iv.mpf(1)
    polynomial += term
    for k in range(1, n):
        term = term * z / k
        polynomial += term
    return math.factorial(n - 1) * mp.iv.exp(-z) * polynomial


@dataclass(frozen=True)
class ChebyshevHankelMoments:
    interval_dps: int
    x0: RealInterval
    near_bracket: RealInterval
    C_minus1_upper_expression: RealInterval
    C0_squared_upper_expression: RealInterval
    C1_squared_upper_expression: RealInterval
    C0_upper: RealInterval
    C1_upper: RealInterval


def chebyshev_hankel_moments(
    dps: int = 80,
    **locked_overrides: str,
) -> ChebyshevHankelMoments:
    """Evaluate explicit all-range upper bounds with outward intervals."""
    require_locked_source(**locked_overrides)
    dps = _require_dps(dps)
    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        A = mp.iv.mpf(LOCKED_PNT_A)
        alpha = mp.iv.mpf(LOCKED_PNT_ALPHA)
        x0 = mp.iv.log(2)
        log_x0 = mp.iv.log(x0)
        near_bracket = (
            mp.iv.mpf(5) / 2
            - mp.iv.mpf(3) / 2 * log_x0
            + mp.iv.mpf(1) / 4 * log_x0**2
        )

        gamma5 = _upper_gamma_integer(5, alpha * mp.iv.sqrt(x0))
        gamma8 = _upper_gamma_integer(8, 2 * alpha * mp.iv.sqrt(x0))
        gamma10 = _upper_gamma_integer(10, 2 * alpha * mp.iv.sqrt(x0))

        C_minus1 = (
            x0 * (mp.iv.mpf(3) / 2 - log_x0 / 2)
            + 2 * A / alpha**5 * gamma5
            + mp.iv.mpf(1) / 36
        )
        C0_squared = (
            x0 * near_bracket
            + 4 * A**2 / (2 * alpha) ** 8 * gamma8
            + mp.iv.mpf(1) / 432
        )
        C1_squared = (
            x0**2 * near_bracket
            + 4 * A**2 / (2 * alpha) ** 10 * gamma10
            + mp.iv.mpf(8)
            / 9
            * mp.iv.exp(-6 * x0)
            * (x0 / 6 + mp.iv.mpf(1) / 36)
        )
        C0 = mp.iv.sqrt(C0_squared)
        C1 = mp.iv.sqrt(C1_squared)
        values = {
            "x0": _endpoints(x0, dps),
            "near": _endpoints(near_bracket, dps),
            "Cm1": _endpoints(C_minus1, dps),
            "C0sq": _endpoints(C0_squared, dps),
            "C1sq": _endpoints(C1_squared, dps),
            "C0": _endpoints(C0, dps),
            "C1": _endpoints(C1, dps),
        }
    finally:
        mp.iv.dps = old_iv_dps

    for label in ("Cm1", "C0sq", "C1sq", "C0", "C1"):
        if values[label].lower <= 0:
            raise ArithmeticError(f"{label} upper-bound expression is not positive")

    return ChebyshevHankelMoments(
        interval_dps=dps,
        x0=values["x0"],
        near_bracket=values["near"],
        C_minus1_upper_expression=values["Cm1"],
        C0_squared_upper_expression=values["C0sq"],
        C1_squared_upper_expression=values["C1sq"],
        C0_upper=values["C0"],
        C1_upper=values["C1"],
    )


def _serialize_interval(value: RealInterval, digits: int) -> list[str]:
    return [mp.nstr(value.lower, digits), mp.nstr(value.upper, digits)]


def serialize_chebyshev_hankel(
    moments: ChebyshevHankelMoments,
) -> dict[str, object]:
    digits = moments.interval_dps + 10
    interval = lambda value: _serialize_interval(value, digits)
    return {
        "claim_class": "ANALYTIC_UNIFORM_COMBINED_KERNEL_MOMENT_BOUND",
        "terminal_state": "P0_INVALIDATED",
        "signed_lower_bound_claim": False,
        "equation_5_2_claim": False,
        "inputs": {
            "interval_decimal_digits": moments.interval_dps,
            "arithmetic_library": f"mpmath.iv {mp.__version__}",
            "A_exact_decimal": LOCKED_PNT_A,
            "alpha_exact_decimal": LOCKED_PNT_ALPHA,
        },
        "locked_formulas": {
            "PNT": LOCKED_PNT_FORMULA,
            "combined_kernel": LOCKED_KERNEL_FORMULA,
            "x0": "log(2)",
            "C_minus1": "integral_0^infinity abs(delta_star(x)) dx",
            "C0_squared": "integral_0^infinity abs(delta_star(x))^2 dx",
            "C1_squared": "integral_0^infinity x*abs(delta_star(x))^2 dx",
        },
        "outward_intervals": {
            "x0": interval(moments.x0),
            "near_origin_bracket": interval(moments.near_bracket),
            "C_minus1_upper_expression": interval(
                moments.C_minus1_upper_expression
            ),
            "C0_squared_upper_expression": interval(
                moments.C0_squared_upper_expression
            ),
            "C1_squared_upper_expression": interval(
                moments.C1_squared_upper_expression
            ),
            "C0_upper": interval(moments.C0_upper),
            "C1_upper": interval(moments.C1_upper),
        },
        "certified_upper_endpoints": {
            "C_minus1": mp.nstr(
                moments.C_minus1_upper_expression.upper, digits
            ),
            "C0": mp.nstr(moments.C0_upper.upper, digits),
            "C1": mp.nstr(moments.C1_upper.upper, digits),
        },
        "source_chain": {
            "lock": "P3_SOURCE_LOCK.json",
            "source": "vendor/FKS-PNT-2204.02588v3.pdf",
            "sha256": LOCKED_SOURCE_SHA256,
        },
        "checks": {
            "combined_kernel_retained": True,
            "prime_pole_archimedean_blocks_not_split": True,
            "all_three_uniform_moment_bounds_finite": True,
        },
        "limitations": [
            "these are deliberately crude uniform upper constants",
            "no prolate boundary-profile or physical-map conditioning bound",
            "no relative projection theorem or signed shifted-sector floor",
            "the source PNT theorem is unconditional; no zero table is read by this implementation",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = serialize_chebyshev_hankel(
        chebyshev_hankel_moments(args.dps)
    )
    text = json.dumps(result, indent=2) + "\n"
    if args.output:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")


__all__ = [
    "ChebyshevHankelMoments",
    "LOCKED_KERNEL_FORMULA",
    "LOCKED_PNT_A",
    "LOCKED_PNT_ALPHA",
    "LOCKED_PNT_FORMULA",
    "LOCKED_SOURCE_SHA256",
    "RealInterval",
    "chebyshev_hankel_moments",
    "require_locked_source",
    "serialize_chebyshev_hankel",
]


if __name__ == "__main__":
    main()
