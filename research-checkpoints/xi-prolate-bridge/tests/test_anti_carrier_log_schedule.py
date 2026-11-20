#!/usr/bin/env python3
"""Focused regressions for the anti-carrier logarithmic schedule audit."""

from __future__ import annotations

import itertools
import math
import unittest
from fractions import Fraction

import mpmath as mp


F = Fraction


def determinant(matrix: tuple[tuple[Fraction, ...], ...]) -> Fraction:
    size = len(matrix)
    total = F(0)
    for permutation in itertools.permutations(range(size)):
        inversions = sum(
            permutation[i] > permutation[j]
            for i in range(size)
            for j in range(i + 1, size)
        )
        term = F(-1 if inversions % 2 else 1)
        for row, column in enumerate(permutation):
            term *= matrix[row][column]
        total += term
    return total


def parity_separated_bins(counts: tuple[int, ...]) -> tuple[int, ...]:
    occupied = tuple(index for index, count in enumerate(counts) if count)
    classes = tuple(
        tuple(index for index in occupied if index % 2 == parity)
        for parity in (0, 1)
    )
    return max(classes, key=lambda values: (len(values), tuple(-x for x in values)))


class AntiCarrierLogScheduleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 90

    def test_parity_bin_extraction_retains_multiplicity_as_one_row(self) -> None:
        # Exhaust every occupied-bin pattern through nine bins.  The values
        # 3 and 11 model algebraic multiplicities; neither creates a second
        # distinct evaluation row.
        for size in range(1, 10):
            for mask in range(1 << size):
                counts = tuple(
                    (11 if index % 3 == 0 else 3) if mask & (1 << index) else 0
                    for index in range(size)
                )
                chosen = parity_separated_bins(counts)
                occupied_count = sum(bool(count) for count in counts)
                self.assertGreaterEqual(len(chosen), (occupied_count + 1) // 2)
                self.assertTrue(all(counts[index] > 0 for index in chosen))
                self.assertTrue(
                    all(right - left >= 2 for left, right in zip(chosen, chosen[1:]))
                )

    def test_exact_sine_weighted_cauchy_determinant(self) -> None:
        # The sine values are represented by independent rational row
        # factors.  This checks every algebraic factor in (4.3) without
        # reading transcendental values through binary64.
        for size in range(1, 5):
            scale = F(3, 5)  # symbolic stand-in for L/(2*pi)
            gammas = tuple(F(11 + 3 * index, 1) for index in range(size))
            xs = tuple((scale * gamma) ** 2 for gamma in gammas)
            row_factors = tuple(F(index + 2, index + 5) for index in range(size))
            matrix = tuple(
                tuple(row_factors[j] * n / (xs[j] - n * n) for n in range(1, size + 1))
                for j in range(size)
            )

            numerator = F(math.factorial(size), 1)
            for factor in row_factors:
                numerator *= factor
            for j in range(size):
                for k in range(j + 1, size):
                    numerator *= xs[k] - xs[j]
            for n in range(1, size + 1):
                for m in range(n + 1, size + 1):
                    numerator *= m * m - n * n

            denominator = F(1)
            for x in xs:
                for n in range(1, size + 1):
                    denominator *= abs(x - n * n)

            self.assertEqual(abs(determinant(matrix)), numerator / denominator)

    def test_full_product_lower_bound_passes_to_every_prefix(self) -> None:
        factors = (F(2, 3), F(3, 7), F(5, 11), F(7, 13), F(11, 17))
        full_product = math.prod(factors, start=F(1))
        for length in range(1, len(factors) + 1):
            prefix_product = math.prod(factors[:length], start=F(1))
            self.assertGreaterEqual(prefix_product, full_product)

    def test_log_sine_primitive_and_window_bound(self) -> None:
        # Phi(u)=-Im Li_2(exp(2iu))/2 is the periodic primitive used in
        # (1.2).  Test the exact endpoint identity on decimal-string inputs
        # and then its deliberately slack universal lower bound.
        def primitive(u: mp.mpf) -> mp.mpf:
            return -mp.im(mp.polylog(2, mp.exp(2j * u))) / 2

        for a_text, b_text in (
            ("0.137", "1.923"),
            ("2.111", "7.731"),
            ("10.25", "23.875"),
        ):
            a = mp.mpf(a_text)
            b = mp.mpf(b_text)
            exact_integral = -(b - a) * mp.log(2) + primitive(b) - primitive(a)
            lower_bound = -(b - a) * mp.log(2) - mp.pi**2 / 6
            self.assertGreater(exact_integral, lower_bound)
            self.assertLessEqual(abs(primitive(a)), mp.pi**2 / 12)
            self.assertLessEqual(abs(primitive(b)), mp.pi**2 / 12)

    def test_source_count_separated_density_exceeds_one_fifth(self) -> None:
        coefficient = (1 / (2 * mp.pi)) / (
            2 * (1 / (2 * mp.pi) + 2 * mp.mpf("0.103787"))
        )
        self.assertGreater(coefficient, mp.mpf(1) / 5)
        self.assertLess(coefficient, mp.mpf("0.2170"))


if __name__ == "__main__":
    unittest.main()
