#!/usr/bin/env python3
"""Exact regressions for the Gevrey prolate remainder audit."""

from __future__ import annotations

import math
import unittest
from fractions import Fraction


def highest_path_square_without_pi(target: int, order: int) -> Fraction:
    """Return ``(pi**order*c_target,order)**2`` from equation (2.9)."""

    if target not in (0, 4) or order < 0:
        raise ValueError("locked targets are 0 and 4 and order is nonnegative")
    return Fraction(
        math.factorial(target + 4 * order),
        math.factorial(target)
        * 64 ** (2 * order)
        * math.factorial(order) ** 2,
    )


def factorial_convolution(order: int) -> int:
    if order < 0:
        raise ValueError("nonnegative order required")
    return sum(math.factorial(p) * math.factorial(order - p) for p in range(order + 1))


class GevreyProlateRemainderTests(unittest.TestCase):
    def test_unique_highest_path_recurrence(self) -> None:
        for target in (0, 4):
            previous = highest_path_square_without_pi(target, 0)
            self.assertEqual(previous, 1)
            for order in range(1, 20):
                current = highest_path_square_without_pi(target, order)
                four_step_product = math.prod(
                    range(target + 4 * order - 3, target + 4 * order + 1)
                )
                expected_ratio = Fraction(four_step_product, 64**2 * order**2)
                self.assertEqual(current / previous, expected_ratio)
                previous = current

    def test_highest_path_has_factorial_lower_growth(self) -> None:
        # This is the squared, pi-free form of
        # |c_(n,j)| >= j!/(64*pi)^j.  The proof groups the numerator
        # factorial into j consecutive blocks of four; the finite loop is a
        # regression for that exact combinatorial inequality.
        for target in (0, 4):
            for order in range(1, 80):
                numerator_product = Fraction(
                    math.factorial(target + 4 * order), math.factorial(target)
                )
                self.assertGreaterEqual(numerator_product, math.factorial(order) ** 4)
                lower_square = Fraction(
                    math.factorial(order) ** 2, 64 ** (2 * order)
                )
                self.assertGreaterEqual(
                    highest_path_square_without_pi(target, order), lower_square
                )

    def test_factorial_convolution_majorant(self) -> None:
        for order in range(100):
            self.assertLessEqual(
                factorial_convolution(order), 3 * math.factorial(order)
            )

    def test_reduced_resolvent_entries_are_linear_in_block_index(self) -> None:
        # Multiply R_n V by pi.  The diagonal entry is rational; the two
        # off-diagonal inequalities are checked after squaring, so this test
        # uses exact integer arithmetic throughout.
        for target in (0, 4):
            minimum_q = -1 if target == 4 else 1
            for q in range(minimum_q, 200):
                if q == 0:
                    continue
                output = target + 4 * q
                if output < 0:
                    continue
                denominator = 16 * abs(output - target)
                linear_bound = 2 * (abs(q) + 1)

                diagonal = Fraction(
                    2 * output * output + 2 * output + 3, denominator
                )
                self.assertLessEqual(diagonal, linear_bound)

                if output >= 4:
                    down_square = Fraction(
                        output * (output - 1) * (output - 2) * (output - 3),
                        denominator**2,
                    )
                    self.assertLessEqual(down_square, linear_bound**2)

                up_square = Fraction(
                    (output + 1)
                    * (output + 2)
                    * (output + 3)
                    * (output + 4),
                    denominator**2,
                )
                self.assertLessEqual(up_square, linear_bound**2)

    def test_endpoint_safe_cutoff_has_strict_mehler_margin(self) -> None:
        # For delta=1/100, r=1/2, pi>3 and log(2)<1 give
        # 2*pi/3 - 4*delta*log(2) > 2 - 1/25 = 49/25.
        delta = Fraction(1, 100)
        lower_margin = Fraction(2) - 4 * delta
        self.assertEqual(lower_margin, Fraction(49, 25))
        self.assertGreater(lower_margin, 0)

    def test_locked_target_and_parameter_mixups_are_rejected(self) -> None:
        for target, order in ((2, 1), (0, -1), (4, -2)):
            with self.assertRaises(ValueError):
                highest_path_square_without_pi(target, order)
        with self.assertRaises(ValueError):
            factorial_convolution(-1)


if __name__ == "__main__":
    unittest.main()
