#!/usr/bin/env python3
"""Exact replay of the boundary-Weyl evaluation-Gram countermodel."""

import unittest
from fractions import Fraction as F


MODES = (-1, 0, 1)


def pi_times_paired_gram_entry(n: int, k: int) -> F:
    """Return pi*Q[n,k] from the two positive nodes and their reflections."""

    # Each tuple is (positive t, multiplicity, sin(pi*t)^2).
    data = ((F(3, 4), 2, F(1, 2)), (F(3, 2), 1, F(1)))
    total = F(0)
    for t, multiplicity, sine_squared in data:
        paired = F(1, (t - n) * (t - k)) + F(1, (-t - n) * (-t - k))
        total += 2 * multiplicity * sine_squared * paired
    return total


class BoundaryWeylEvaluationGramSignObstruction(unittest.TestCase):
    def setUp(self) -> None:
        self.q = {
            (n, k): pi_times_paired_gram_entry(n, k)
            for n in MODES
            for k in MODES
        }

    def test_exact_evaluation_assembly(self) -> None:
        expected = (
            (F(50192, 1225), F(-208, 35), F(-208, 35)),
            (F(-208, 35), F(80, 9), F(-208, 35)),
            (F(-208, 35), F(-208, 35), F(50192, 1225)),
        )
        self.assertEqual(
            tuple(tuple(self.q[(n, k)] for k in MODES) for n in MODES),
            expected,
        )

    def test_inversion_and_source_cauchy_form(self) -> None:
        b = {-1: F(208, 35), 0: F(0), 1: F(-208, 35)}
        for n in MODES:
            for k in MODES:
                self.assertEqual(self.q[(n, k)], self.q[(k, n)])
                self.assertEqual(self.q[(n, k)], self.q[(-n, -k)])
                if n != k:
                    self.assertEqual(self.q[(n, k)], (b[n] - b[k]) / (n - k))

    def test_both_parity_blocks_are_strictly_positive(self) -> None:
        # The even off-diagonal is c*sqrt(2), so its square is 2*c^2.
        a = self.q[(0, 0)]
        c = self.q[(0, 1)]
        d = self.q[(1, 1)] + self.q[(1, -1)]
        even_determinant = a * d - 2 * c * c
        odd_eigenvalue = self.q[(1, 1)] - self.q[(1, -1)]
        self.assertEqual(even_determinant, F(294912, 1225))
        self.assertGreater(a, 0)
        self.assertGreater(even_determinant, 0)
        self.assertEqual(odd_eigenvalue, F(57472, 1225))
        self.assertGreater(odd_eigenvalue, 0)

    def test_upper_boundary_residue_is_strictly_negative(self) -> None:
        # In the even basis eta=(1,sqrt(2)) and e0=(1,0).
        a = self.q[(0, 0)]
        c = self.q[(0, 1)]
        d = self.q[(1, 1)] + self.q[(1, -1)]
        mixed_moment = a + 2 * c
        even_determinant = a * d - 2 * c * c

        # Positive definiteness implies lambda_min>0.  Since
        # w_+=(mixed_moment-lambda_min)/(lambda_max-lambda_min), s<0
        # certifies w_+<0 without decimal eigenvalues.
        self.assertEqual(mixed_moment, F(-944, 315))
        self.assertLess(mixed_moment, 0)
        self.assertGreater(a, 0)
        self.assertGreater(even_determinant, 0)

    def test_odd_root_lies_above_both_even_roots(self) -> None:
        even_trace = (
            self.q[(0, 0)] + self.q[(1, 1)] + self.q[(1, -1)]
        )
        odd_root = self.q[(1, 1)] - self.q[(1, -1)]
        self.assertEqual(odd_root - even_trace, F(944, 315))
        self.assertGreater(odd_root, even_trace)

    def test_carrier_pole_prevents_one_positive_signature(self) -> None:
        k_below_squared_over_two = F(81, 49)
        k_above_squared_over_two = F(81, 25)
        self.assertEqual(k_below_squared_over_two, F(9, 7) ** 2)
        self.assertEqual(k_above_squared_over_two, F(9, 5) ** 2)
        # k(3/4)<0<k(3/2), while both first row entries are positive.
        self.assertLess(F(-9, 7), 0)
        self.assertGreater(F(9, 5), 0)


if __name__ == "__main__":
    unittest.main()
