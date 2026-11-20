import unittest

import mpmath as mp

from projection_rate_bound import (
    hermite_limit_h,
    hermite_tail_terms,
    limiting_log_derivative_bound,
    projection_rate_bound,
)


class ProjectionRateBoundTests(unittest.TestCase):
    def setUp(self):
        mp.mp.dps = 60

    def test_exact_hermite_tail_integral(self):
        lam = mp.mpf("2.25")
        terms = hermite_tail_terms("2.25", 60)
        direct = mp.quad(lambda x: hermite_limit_h(x), [lam, mp.inf])
        self.assertLess(abs(direct - terms.tail_integral), mp.mpf("1e-55"))

    def test_omitted_lattice_tail_is_bounded(self):
        lam = mp.mpf("2.25")
        terms = hermite_tail_terms("2.25", 60)
        for u_text in ("0.5", "1", "2"):
            u = mp.mpf(u_text)
            cutoff = int(mp.floor(lam / u))
            direct = mp.sqrt(u) * mp.nsum(
                lambda m: hermite_limit_h(m * u), [cutoff + 1, mp.inf]
            )
            point_bound = (
                terms.boundary_value * mp.sqrt(u)
                + terms.tail_integral / mp.sqrt(u)
            )
            self.assertLessEqual(direct, point_bound)

    def test_explicit_log_derivative_constant(self):
        ck = limiting_log_derivative_bound(60)
        self.assertGreater(ck, mp.mpf("6.005"))
        self.assertLess(ck, mp.mpf("6.006"))

    def test_bound_rejects_binary64_parameters(self):
        with self.assertRaises(TypeError):
            projection_rate_bound(2.0, 12, "0.01")
        with self.assertRaises(TypeError):
            projection_rate_bound("2", 12, 0.01)

    def test_false_log_derivative_upper_bound_is_rejected(self):
        with self.assertRaises(ValueError):
            projection_rate_bound("2", 12, "0.01", ck_bound_text="6.005")
        with self.assertRaises(ValueError):
            projection_rate_bound("2", 12, "0.01", ck_bound_text="0")

    def test_bound_is_sum_of_all_three_terms(self):
        result = projection_rate_bound("2.25", 18, "0.001", 60)
        self.assertEqual(
            result.total,
            result.prolate_comparison_term
            + result.omitted_hermite_tail_term
            + result.limiting_fourier_tail_term,
        )
        self.assertGreater(result.omitted_hermite_tail_term, 0)


if __name__ == "__main__":
    unittest.main()
