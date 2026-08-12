#!/usr/bin/env python3
"""Exact convention stress tests for the zero-side derivative-frame audit."""

import unittest
from fractions import Fraction as F


class ZeroSideDerivativeFrameSourceLimitTests(unittest.TestCase):
    def test_paired_and_positive_height_normalizations_agree(self) -> None:
        # One distinct positive ordinate of multiplicity m, with evaluation y.
        # Positive-height notation: G=m*y^2 and Q includes +/-gamma.
        multiplicity = F(3)
        value_squared = F(5, 7)
        positive_gram = multiplicity * value_squared
        q_from_positive_heights = 2 * positive_gram

        # Paired-map notation has two slots for every member of the full
        # +/- ordinate multiset, followed by Q=(1/2)Z*Z.
        paired_norm_squared = 4 * multiplicity * value_squared
        q_from_paired_map = paired_norm_squared / 2
        self.assertEqual(q_from_positive_heights, q_from_paired_map)

    def test_multiplicity_repeats_a_row_but_does_not_raise_rank(self) -> None:
        row = (F(2), F(-3))
        multiplicity = 7
        gram = tuple(
            tuple(multiplicity * row[i] * row[j] for j in range(2))
            for i in range(2)
        )
        self.assertEqual(gram[0][0] * gram[1][1] - gram[0][1] ** 2, 0)
        self.assertNotEqual(gram, ((F(0), F(0)), (F(0), F(0))))

    def test_in_range_carrier_limit_and_out_of_range_zero(self) -> None:
        # Set L=2*pi, so alpha=1.  Factoring sqrt(pi) from the
        # l'Hospital limit leaves the exact coefficient (-1)^n:
        #
        # (2*n/sqrt(pi)) * [pi*(-1)^n]/(2*n)
        #     = sqrt(pi)*(-1)^n.
        for n in (1, 2, 3, 4):
            numerator_coefficient = F(2 * n) * F((-1) ** n)
            denominator_coefficient = F(2 * n)
            coefficient_of_sqrt_pi = numerator_coefficient / denominator_coefficient
            self.assertEqual(coefficient_of_sqrt_pi, F((-1) ** n))

        cutoff = 3
        out_of_range_carrier = 5
        symbolic_sine_pi_m = F(0)  # sin(pi*m)=0 exactly for integer m.
        for n in range(1, cutoff + 1):
            denominator = F(out_of_range_carrier**2 - n**2)
            self.assertNotEqual(denominator, 0)
            row_value_without_nonzero_common_scale = (
                F(n) * symbolic_sine_pi_m / denominator
            )
            self.assertEqual(row_value_without_nonzero_common_scale, 0)

    def test_lattice_carrier_leaves_nondivisible_columns_null(self) -> None:
        # Take L0=2*pi and L=k*L0.  Then gamma_m=m and the carrier index is
        # n=k*m.  For k=2, every odd column is zero at every model row.
        k = 2
        cutoff = 7
        carrier_indices = {k * m for m in range(1, cutoff + 1) if k * m <= cutoff}
        null_columns = {n for n in range(1, cutoff + 1) if n not in carrier_indices}
        self.assertTrue({1, 3, 5, 7}.issubset(null_columns))
        self.assertNotIn(2, null_columns)
        self.assertNotIn(4, null_columns)

    def test_one_derivative_rayleigh_is_an_upper_bound_on_the_minimum(self) -> None:
        # Exact PSD model: the tested derivative direction has Rayleigh 5,
        # while an unseen transverse direction has Rayleigh 1/10.
        q = F(1)
        q_x = F(5)
        odd_minimum = F(1, 10)
        self.assertGreater(q_x, q)
        self.assertLess(odd_minimum, q)
        self.assertLessEqual(odd_minimum, q_x)

    def test_coarse_minor_and_state_exponents_diverge_in_wrong_order(self) -> None:
        # On N~exp(L/2)L^3, the schematic determinant exponent scale divided
        # by the state exponent scale is exp(L/2)L^5.  At L=2*k it is
        # bounded below by the exact integer 2^k*(2*k)^5, which diverges.
        lower_bounds = [2**k * (2 * k) ** 5 for k in (2, 3, 4, 5)]
        self.assertEqual(lower_bounds, sorted(lower_bounds))
        self.assertEqual(len(set(lower_bounds)), len(lower_bounds))
        self.assertGreater(lower_bounds[-1], lower_bounds[0])


if __name__ == "__main__":
    unittest.main()
