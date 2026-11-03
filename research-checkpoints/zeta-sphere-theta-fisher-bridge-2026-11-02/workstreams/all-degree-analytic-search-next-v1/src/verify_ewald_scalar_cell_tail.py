#!/usr/bin/env python3
"""Exact algebra checks for EWALD_SCALAR_CELL_TAIL_NEXT.md.

This intentionally uses only the standard library.  It checks the beta
moments, the first Euler coefficient polynomials, and the differentiated
kernel multipliers.  The analytic contour-shift theorem remains a written
proof, not a numerical certificate.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from fractions import Fraction
from pathlib import Path


Poly = list[Fraction]  # coefficients in increasing powers of s


def poly_mul(a: Poly, b: Poly) -> Poly:
    out = [Fraction(0) for _ in range(len(a) + len(b) - 1)]
    for i, ai in enumerate(a):
        for j, bj in enumerate(b):
            out[i + j] += ai * bj
    return out


def rising_s_plus_one(r: int) -> Poly:
    out = [Fraction(1)]
    for k in range(1, r + 1):
        out = poly_mul(out, [Fraction(k), Fraction(1)])
    return out


def a_polynomial(r: int) -> Poly:
    numerator = poly_mul([Fraction(0), Fraction(1)], rising_s_plus_one(r))
    denominator = math.factorial(r) * (r + 1) * (r + 2)
    return [-c / denominator for c in numerator]


def beta_moment_by_expansion(r: int) -> Fraction:
    # Integral_0^1 u(1-u)^r du, expanded by the binomial theorem.
    return sum(
        (Fraction((-1) ** k * math.comb(r, k), k + 2) for k in range(r + 1)),
        Fraction(0),
    )


def encode_poly(p: Poly) -> list[str]:
    return [str(c) for c in p]


def moment_difference_coefficients(m: int) -> dict[int, int]:
    """Zeta-basis coefficients for sum n^m[n^(1-s)-(n-1)^(1-s)].

    Key k denotes zeta(s-k).  This is a formal finite-difference check;
    convergence/continuation is handled in the note.
    """
    out: dict[int, int] = {m + 1: 1}
    for j in range(m + 1):
        key = j + 1
        out[key] = out.get(key, 0) - math.comb(m, j)
        if out[key] == 0:
            del out[key]
    return out


def run_checks() -> dict[str, object]:
    for r in range(13):
        observed = beta_moment_by_expansion(r)
        expected = Fraction(1, (r + 1) * (r + 2))
        assert observed == expected, (r, observed, expected)

    expected_first_four: list[Poly] = [
        [Fraction(0), Fraction(-1, 2)],
        [Fraction(0), Fraction(-1, 6), Fraction(-1, 6)],
        [Fraction(0), Fraction(-1, 12), Fraction(-1, 8), Fraction(-1, 24)],
        [
            Fraction(0),
            Fraction(-1, 20),
            Fraction(-11, 120),
            Fraction(-1, 20),
            Fraction(-1, 120),
        ],
    ]
    observed_first_four = [a_polynomial(r) for r in range(4)]
    assert observed_first_four == expected_first_four

    for m in range(9):
        expected_difference = {
            j + 1: -math.comb(m, j) for j in range(m)
        }
        assert moment_difference_coefficients(m) == expected_difference

    # s(s-1)(2-s)/(1-s) = -s(2-s), the cancellation used in H_1.
    h1_left_numerator = poly_mul(
        poly_mul([Fraction(0), Fraction(-1), Fraction(1)], [Fraction(2), Fraction(-1)]),
        [Fraction(1)],
    )
    h1_right_times_denominator = poly_mul(
        [Fraction(0), Fraction(-2), Fraction(1)], [Fraction(1), Fraction(-1)]
    )
    assert h1_left_numerator == h1_right_times_denominator

    # After factoring exp(-(s+1) ell), the kernel -s has the following
    # first and second s-derivative multipliers.  Check by the product rule
    # at exact rational sample points.
    derivative_samples = []
    for s in (Fraction(-3, 5), Fraction(1, 2), Fraction(7, 3)):
        for ell in (Fraction(0), Fraction(2, 7), Fraction(5, 2)):
            first = -1 + s * ell
            second = 2 * ell - s * ell * ell
            # Differentiate (coefficient)*exp(-(s+1)ell): c' - ell*c.
            first_from_rule = Fraction(-1) - ell * (-s)
            second_from_rule = ell - ell * first
            assert first == first_from_rule
            assert second == second_from_rule
            derivative_samples.append(
                {"s": str(s), "ell": str(ell), "first": str(first), "second": str(second)}
            )

    return {
        "status": "PASS",
        "scope": "exact algebra only; no numerical sign or RH claim",
        "source_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "beta_moments_checked": 13,
        "index_moment_differences_checked": 9,
        "coefficient_polynomials": {
            str(r): encode_poly(a_polynomial(r)) for r in range(9)
        },
        "kernel_derivative_samples": derivative_samples,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = run_checks()
    payload = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(payload, encoding="utf-8")
    print(payload, end="")


if __name__ == "__main__":
    main()
