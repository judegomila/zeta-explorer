#!/usr/bin/env python3
"""Exact regressions for the adaptive outer-cutoff hyperbolicity barrier.

Only Python standard-library arithmetic is used.  These tests check the raw
polynomial identities, the LP-but-nonhyperbolic finite Fourier section, the
projective escaping-pair family, and the exact/binary64 conditioning split.
They do not test or assert an actual-source asymptotic sign.
"""

from __future__ import annotations

import cmath
from fractions import Fraction as F
import hashlib
from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ADAPTIVE_OUTER_CUTOFF_HYPERBOLICITY_BARRIER.md"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}

Polynomial = tuple[F, ...]  # ascending coefficients


def add(left: Polynomial, right: Polynomial) -> Polynomial:
    result = [F(0)] * max(len(left), len(right))
    for index, value in enumerate(left):
        result[index] += value
    for index, value in enumerate(right):
        result[index] += value
    return tuple(result)


def scale(polynomial: Polynomial, scalar: F) -> Polynomial:
    return tuple(scalar * value for value in polynomial)


def multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    result = [F(0)] * (len(left) + len(right) - 1)
    for row, x_value in enumerate(left):
        for column, y_value in enumerate(right):
            result[row + column] += x_value * y_value
    return tuple(result)


def raw_polynomial(raw: tuple[F, ...]) -> Polynomial:
    count = len(raw) - 1
    factors = tuple((F(-n * n), F(1)) for n in range(1, count + 1))
    denominator: Polynomial = (F(1),)
    for factor in factors:
        denominator = multiply(denominator, factor)
    answer = scale(denominator, raw[0])
    for n in range(1, count + 1):
        cofactor: Polynomial = (F(1),)
        for m, factor in enumerate(factors, start=1):
            if m != n:
                cofactor = multiply(cofactor, factor)
        answer = add(answer, (F(0),) + scale(cofactor, 2 * raw[n]))
    return answer


class AdaptiveOuterCutoffHyperbolicityBarrierTests(unittest.TestCase):
    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_raw_polynomial_leading_and_interpolation_identities(self) -> None:
        raw = (F(7, 5), F(-2, 3), F(11, 7), F(-13, 17))
        polynomial = raw_polynomial(raw)
        count = len(raw) - 1
        self.assertEqual(polynomial[-1], raw[0] + 2 * sum(raw[1:], F(0)))
        self.assertEqual(polynomial[0], F((-1) ** count) * F(6 * 6) * raw[0])

        for n in range(1, count + 1):
            value = sum(
                (coefficient * F(n * n) ** power
                 for power, coefficient in enumerate(polynomial)),
                F(0),
            )
            factorial_factor = 1
            for integer in range(2, count - n + 1):
                factorial_factor *= integer
            for integer in range(2, count + n + 1):
                factorial_factor *= integer
            expected = F((-1) ** (count - n) * factorial_factor) * raw[n]
            self.assertEqual(value, expected)

    def test_lp_limit_does_not_make_every_fourier_section_hyperbolic(self) -> None:
        # For the indicator of [-pi/2,pi/2] in [-pi,pi], the N=3 raw
        # direction is (pi/2,-1,0,1/3).  Its non-lattice quadratic factor
        # has discriminant (16/9)*(9*pi^2-84*pi+169).
        lower_pi = F(157, 50)
        upper_pi = F(22, 7)

        def h(value: F) -> F:
            return 9 * value * value - 84 * value + 169

        # h'(x)=18*x-84 is negative on the classical rational enclosure,
        # and h is already negative at its lower endpoint.
        self.assertLess(18 * upper_pi - 84, 0)
        self.assertLess(h(lower_pi), 0)

        # The exact factor y-4 comes from the zero second Fourier sample.
        # Verify the affine-in-pi coefficient algebra at two rational
        # placeholders; polynomial identity then proves the displayed form.
        for pi_placeholder in (lower_pi, upper_pi):
            raw = (pi_placeholder / 2, F(-1), F(0), F(1, 3))
            polynomial = raw_polynomial(raw)
            quadratic = (
                9 * pi_placeholder / 2,
                F(52, 3) - 5 * pi_placeholder,
                pi_placeholder / 2 - F(4, 3),
            )
            self.assertEqual(polynomial, multiply((F(-4), F(1)), quadratic))

    def test_nonreal_pair_can_escape_to_projective_infinity(self) -> None:
        compact_radius = F(3)
        previous_bound: F | None = None
        for radius in (F(10), F(100), F(1000)):
            denominator = radius * radius + 1
            polynomial = (
                F(1),
                -2 * radius / denominator,
                1 / denominator,
            )
            discriminant = polynomial[1] ** 2 - 4 * polynomial[2] * polynomial[0]
            self.assertEqual(discriminant, -4 / denominator**2)
            self.assertLess(discriminant, 0)

            # Uniform bound for |g_R(y)-1| on |y|<=compact_radius.
            bound = (
                2 * radius * compact_radius / denominator
                + compact_radius**2 / denominator
            )
            if previous_bound is not None:
                self.assertLess(bound, previous_bound)
            previous_bound = bound

    def test_exact_real_roots_can_become_binary64_complex(self) -> None:
        self.assertEqual(sys.float_info.mant_dig, 53)
        t = F(1, 10**9)
        leading = t * t
        linear = -2 * t * (1 + t)
        constant = F(1)
        exact_discriminant = linear * linear - 4 * leading * constant
        self.assertEqual(exact_discriminant, 4 * t * t * (2 * t + t * t))
        self.assertGreater(exact_discriminant, 0)

        raw = (
            constant / 4,
            -(constant + leading + linear) / 6,
            (16 * leading + constant + 4 * linear) / 24,
        )
        self.assertEqual(raw_polynomial(raw), (constant, linear, leading))
        self.assertEqual(raw[0] + 2 * raw[1] + 2 * raw[2], leading)

        rounded = tuple(float(value) for value in raw)
        rounded_leading = rounded[0] + 2 * rounded[1] + 2 * rounded[2]
        rounded_linear = -5 * rounded[0] - 8 * rounded[1] - 2 * rounded[2]
        rounded_constant = 4 * rounded[0]
        rounded_discriminant = (
            rounded_linear * rounded_linear
            - 4 * rounded_leading * rounded_constant
        )
        self.assertLess(rounded_discriminant, 0)
        root = (
            -rounded_linear + cmath.sqrt(rounded_discriminant)
        ) / (2 * rounded_leading)
        self.assertNotEqual(root.imag, 0.0)

    def test_note_records_one_way_theorem_and_claim_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"\Phi_\infty(y)",
            "converges absolutely and locally uniformly",
            r"\mathcal E_\lambda\in\mathcal {LP}",
            "cofinal hyperbolicity implies Laguerre--Polya",
            "prescribed Fourier-cardinal numerator",
            "projective infinity",
            "multiple real limit zeros",
            r"g_R(y)",
            r"9\pi^2-84\pi+169",
            "exact false-complex-root fixture",
            "shifted pencil has the same real-root barrier",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "eventual hyperbolicity of its Fourier sections is proved",
            "This proves the Riemann hypothesis",
            "the actual adaptive schedule is certified",
            "Lambda is bounded",
        )
        for token in forbidden:
            self.assertNotIn(token, text)


if __name__ == "__main__":
    unittest.main()
