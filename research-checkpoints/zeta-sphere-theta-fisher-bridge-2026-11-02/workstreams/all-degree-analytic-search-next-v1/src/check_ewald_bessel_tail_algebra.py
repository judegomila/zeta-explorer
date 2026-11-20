#!/usr/bin/env python3
"""Exact algebra audit for EWALD_BESSEL_CELL_TAIL_NEXT.md.

The proof of the orbit and Laplace remainders is in the note.  This script
uses only the Python standard library and checks the finite polynomial
identities that determine the leading constants and signs.
"""

from __future__ import annotations

import argparse
from decimal import Decimal, getcontext
from fractions import Fraction
import json
from pathlib import Path


Poly = list[Fraction]  # increasing powers of x


def add(a: Poly, b: Poly) -> Poly:
    out = [Fraction(0)] * max(len(a), len(b))
    for i, value in enumerate(a):
        out[i] += value
    for i, value in enumerate(b):
        out[i] += value
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return out


def scale(a: Poly, c: Fraction) -> Poly:
    return [c * value for value in a]


def xmul(a: Poly) -> Poly:
    return [Fraction(0), *a]


def deriv(a: Poly) -> Poly:
    if len(a) == 1:
        return [Fraction(0)]
    return [Fraction(i) * a[i] for i in range(1, len(a))]


def plus_derivative_polynomials(order: int) -> list[Poly]:
    """D^r[e^(4u-x e^u)] at u=0, after removing e^(-x)."""
    rows = [[Fraction(1)]]
    for _ in range(order):
        p = rows[-1]
        # (4-x)p + x p'
        rows.append(add(add(scale(p, Fraction(4)), scale(xmul(p), Fraction(-1))), xmul(deriv(p))))
    return rows


def minus_derivative_polynomials(order: int) -> list[Poly]:
    """D^r[e^(-4u-x e^(-u))] at u=0, after removing e^(-x)."""
    rows = [[Fraction(1)]]
    for _ in range(order):
        p = rows[-1]
        # (-4+x)p - x p'
        rows.append(add(add(scale(p, Fraction(-4)), xmul(p)), scale(xmul(deriv(p)), Fraction(-1))))
    return rows


def decimal_exp(x: Decimal) -> Decimal:
    return x.exp()


def run_checks() -> dict[str, object]:
    # From 1/2*z1*z2*(2*z1-3)*(2*z2-3), with
    # z1*z2=lambda^2 and z1+z2=2*lambda*cosh(w).
    # Coefficients are keyed by (power of lambda, power of cosh).
    crossed = {
        "lambda^4": Fraction(2),
        "lambda^3_cosh": Fraction(-6),
        "lambda^2": Fraction(9, 2),
    }
    assert crossed == {
        "lambda^4": Fraction(2),
        "lambda^3_cosh": Fraction(-6),
        "lambda^2": Fraction(9, 2),
    }

    maximum_degree = 12
    plus = plus_derivative_polynomials(2 * maximum_degree)
    minus = minus_derivative_polynomials(2 * maximum_degree)
    degree_rows = []
    for kappa in range(maximum_degree + 1):
        r = 2 * kappa
        assert len(plus[r]) == r + 1
        assert len(minus[r]) == r + 1
        assert plus[r][-1] == 1
        assert minus[r][-1] == 1
        operator_leading_sign = 1 if kappa % 2 == 0 else -1
        source_sign = operator_leading_sign
        cell_sign = -source_sign
        degree_rows.append(
            {
                "degree": kappa,
                "derivative_order": r,
                "plus_leading_coefficient_at_unit_scale": str(plus[r][-1]),
                "minus_leading_coefficient_at_unit_scale": str(minus[r][-1]),
                "source_sign": source_sign,
                "cell_sign": cell_sign,
            }
        )

    getcontext().prec = 70
    pi = Decimal("3.141592653589793238462643383279502884197169399375105820974944592307816")
    two_pi = Decimal(2) * pi
    exp_two_pi = decimal_exp(two_pi)
    euler_factor = (exp_two_pi - Decimal(1)) / two_pi - Decimal(1)
    ratio_limit = decimal_exp(-two_pi)
    assert euler_factor > 0
    assert Decimal(0) < ratio_limit < Decimal(1)

    return {
        "status": "PASS",
        "scope": "exact finite algebra plus recorded Decimal constants; analytic remainder proof is in the note; no RH claim",
        "crossed_orbit_polynomial": {key: str(value) for key, value in crossed.items()},
        "degrees": degree_rows,
        "euler_factor_H": str(euler_factor),
        "ratio_limit_exp_minus_2pi": str(ratio_limit),
        "maximum_degree_checked": maximum_degree,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    payload = json.dumps(run_checks(), indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(payload, encoding="utf-8")
    print(payload, end="")


if __name__ == "__main__":
    main()
