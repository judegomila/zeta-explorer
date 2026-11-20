import unittest

import mpmath as mp

from verifier.chebyshev_rewrite_replay import (
    combined_integral,
    correlation,
    independent_von_mangoldt_terms,
    inner,
    qfun_derivative,
    require_exact_prime_terms,
    source_correlation,
)
from verifier.independent_replay import matrix_from_source


class ChebyshevRewriteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        mp.mp.dps = 45
        _, _, _, cls.Q, cls.matrix_terms = matrix_from_source("2", 1, 45)
        cls.terms = independent_von_mangoldt_terms("2")
        cls.L = 2 * mp.log(2)
        cls.modes = [-1, 0, 1]

    def test_analytic_kernel_derivative(self):
        x = mp.mpf("0.37")
        for n, m in ((1, 0), (1, 1), (-1, 1)):
            direct = mp.diff(lambda y: source_correlation(n, m, y, self.L), x)
            self.assertLess(
                abs(direct - qfun_derivative(n, m, x, self.L)),
                mp.mpf("1e-40"),
            )

    def test_combined_integral_reconstructs_offdiagonal_entry(self):
        reconstructed = combined_integral(
            lambda x: source_correlation(1, 0, x, self.L),
            lambda x: qfun_derivative(1, 0, x, self.L),
            self.L,
            self.terms,
            mp.mpf("1e-18"),
        )
        self.assertLess(abs(reconstructed - self.Q[2, 1]), mp.mpf("1e-16"))

    def test_rayleigh_subtraction_forces_zero_origin(self):
        left = mp.matrix([mp.mpc(1, 2), mp.mpc(-2, 1), mp.mpc(3, -1)])
        right = mp.matrix([mp.mpc(2, -1), mp.mpc(1, 3), mp.mpc(-1, 2)])
        kappa = mp.matrix([1, 2, 1])
        kappa /= mp.sqrt(inner(kappa, kappa))
        overlap = inner(left, right)
        raw = correlation(left, right, self.modes, mp.mpf(0), self.L)
        shifted = raw - overlap * correlation(
            kappa, kappa, self.modes, mp.mpf(0), self.L
        )
        self.assertGreater(abs(raw), mp.mpf("1"))
        self.assertLess(abs(shifted), mp.mpf("1e-40"))

    def test_diagonal_without_origin_subtraction_is_rejected(self):
        # Formula (3.4) requires omega(0)=0.  Feeding q(U_0,U_0) directly
        # leaves omega(0)=2 and must not be accepted as a shifted rewrite.
        with self.assertRaisesRegex(ValueError, r"omega\(0\)=0"):
            combined_integral(
                lambda x: source_correlation(0, 0, x, self.L),
                lambda x: qfun_derivative(0, 0, x, self.L),
                self.L,
                self.terms,
                mp.mpf("1e-18"),
            )

    def test_nonzero_right_endpoint_is_rejected(self):
        with self.assertRaisesRegex(ValueError, r"omega\(L\)=0"):
            combined_integral(
                lambda x: x,
                lambda x: mp.mpf(1),
                self.L,
                self.terms,
                mp.mpf("1e-18"),
            )

    def test_independent_prime_enumeration_includes_cutoff(self):
        self.assertEqual([n for n, _ in self.terms], [2, 3, 4])
        require_exact_prime_terms(self.matrix_terms, "2")

    def test_missing_interior_or_endpoint_prime_power_is_rejected(self):
        for mutated in (self.terms[1:], self.terms[:-1]):
            with self.subTest(indices=[n for n, _ in mutated]):
                with self.assertRaisesRegex(ValueError, "prime-power list"):
                    require_exact_prime_terms(mutated, "2")

    def test_flipped_prime_sign_is_rejected(self):
        mutated = list(self.terms)
        mutated[1] = (mutated[1][0], -mutated[1][1])
        with self.assertRaisesRegex(ValueError, "weight/sign"):
            require_exact_prime_terms(mutated, "2")


if __name__ == "__main__":
    unittest.main()
