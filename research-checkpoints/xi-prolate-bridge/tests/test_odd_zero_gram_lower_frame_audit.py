from __future__ import annotations

import itertools
import math
import unittest
from fractions import Fraction


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


class OddZeroGramLowerFrameAuditTests(unittest.TestCase):
    def test_exact_cauchy_minor_factorization(self) -> None:
        for size in range(1, 5):
            xs = tuple(F(4 * j + 1, 2) for j in range(1, size + 1))
            matrix = tuple(
                tuple(F(n, 1) / (x - n * n) for n in range(1, size + 1))
                for x in xs
            )
            actual = abs(determinant(matrix))

            numerator = F(math.factorial(size), 1)
            for j in range(size):
                for k in range(j + 1, size):
                    numerator *= abs(xs[k] - xs[j])
            for n in range(1, size + 1):
                for m in range(n + 1, size + 1):
                    numerator *= m * m - n * n

            denominator = F(1)
            for x in xs:
                for n in range(1, size + 1):
                    denominator *= abs(x - n * n)

            self.assertEqual(actual, numerator / denominator)

    def test_one_fixed_carrier_lattice_kills_nonmultiple_columns(self) -> None:
        # At length L=k*L0, a model ordinate 2*pi*m/L0 is carrier k*m.
        # The continuous carrier row is supported only in column k*m.
        for k in (2, 3, 7):
            size = 20
            carrier_indices = tuple(k * m for m in range(1, size // k + 1))
            rows = tuple(
                tuple(F(int(n == carrier), 1) for n in range(1, size + 1))
                for carrier in carrier_indices
            )

            for n in range(1, size + 1):
                column = tuple(row[n - 1] for row in rows)
                if n % k:
                    self.assertTrue(all(value == 0 for value in column))
                else:
                    self.assertEqual(sum(column, F(0)), F(1))

    def test_positive_height_factor_two_cancels_in_relative_gate(self) -> None:
        even_sample_norm_squared = F(3, 5)
        odd_minimum_singular_value_squared = F(4, 5)

        q = 2 * even_sample_norm_squared
        odd_floor = 2 * odd_minimum_singular_value_squared

        self.assertEqual(
            q < odd_floor,
            even_sample_norm_squared < odd_minimum_singular_value_squared,
        )


if __name__ == "__main__":
    unittest.main()
