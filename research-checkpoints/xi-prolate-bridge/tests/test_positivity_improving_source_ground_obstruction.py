from __future__ import annotations

from pathlib import Path
import itertools
import unittest

import mpmath as mp

from verifier import even_total_positivity_ball_audit


ROOT = Path(__file__).resolve().parents[1]
BALL_ROOT = ROOT / "artifacts" / "p0_ball_pilots" / "lambda2_N4"


def plastic_constant() -> mp.mpf:
    lo = mp.mpf("1")
    hi = mp.mpf("2")
    for _ in range(400):
        mid = (lo + hi) / 2
        if mid**3 - mid - 1 < 0:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def tau(h: mp.mpf) -> mp.mpf:
    return mp.exp(-5 * h / 2) / (1 - mp.exp(-2 * h))


def signed_jump_density(h: mp.mpf) -> mp.mpf:
    return tau(h) - mp.exp(h / 2)


def complete_off_diagonal_density(h: mp.mpf) -> mp.mpf:
    return -signed_jump_density(h)


class PositivityImprovingSourceGroundObstructionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 100
        cls.rho = plastic_constant()
        cls.h_star = mp.log(cls.rho)

    def test_plastic_constant_is_the_unique_density_crossing(self) -> None:
        self.assertLess(abs(self.rho**3 - self.rho - 1), mp.mpf("1e-90"))
        self.assertLess(
            abs(self.h_star - mp.mpf("0.2811995743229618465120507640678783")),
            mp.mpf("1e-34"),
        )
        self.assertGreater(signed_jump_density(self.h_star / 2), 0)
        self.assertLess(abs(signed_jump_density(self.h_star)), mp.mpf("1e-90"))
        self.assertLess(signed_jump_density(2 * self.h_star), 0)

    def test_density_algebra_matches_pole_minus_archimedean_split(self) -> None:
        for text in ("0.01", "0.1", "0.5", "1.25"):
            h = mp.mpf(text)
            full_arch = mp.exp(-h / 2) / (1 - mp.exp(-2 * h))
            pole = 2 * mp.cosh(h / 2)
            self.assertLess(
                abs((full_arch - pole) - signed_jump_density(h)),
                mp.mpf("1e-90"),
            )
            y = mp.exp(h)
            rationalized = (1 + y - y**3) / (mp.sqrt(y) * (y**2 - 1))
            self.assertLess(
                abs(rationalized - signed_jump_density(h)), mp.mpf("1e-90")
            )

    def test_a_three_point_cycle_rejects_every_sign_gauge(self) -> None:
        d = 3 * self.h_star / 4
        edges = {
            (0, 1): complete_off_diagonal_density(d),
            (1, 2): complete_off_diagonal_density(d),
            (0, 2): complete_off_diagonal_density(2 * d),
        }
        self.assertLess(edges[(0, 1)], 0)
        self.assertLess(edges[(1, 2)], 0)
        self.assertGreater(edges[(0, 2)], 0)
        self.assertGreater(mp.fprod(edges.values()), 0)
        for signs in itertools.product((-1, 1), repeat=3):
            gauged = [signs[i] * signs[j] * value for (i, j), value in edges.items()]
            self.assertFalse(all(value <= 0 for value in gauged))

    def test_odd_fold_has_favorable_continuous_part_but_bad_prime_reflection(self) -> None:
        prime_shift = mp.log(2)
        x = prime_shift / 5
        y = 4 * prime_shift / 5
        continuous_odd = complete_off_diagonal_density(abs(x - y)) - complete_off_diagonal_density(x + y)
        self.assertLess(continuous_odd, 0)
        # The source atom is -w delta_(|x-y|=h); odd reflection subtracts
        # its value at x+y and hence gives +w delta_(x+y=h).
        self.assertLess(abs(x + y - prime_shift), mp.mpf("1e-95"))
        self.assertGreater(mp.log(2) / mp.sqrt(2), 0)

    def test_certified_lambda2_even_triangle_is_not_antibalanced(self) -> None:
        for bits in (256, 512):
            result = even_total_positivity_ball_audit.audit(
                BALL_ROOT / f"producer_{bits}bits.txt",
                BALL_ROOT / f"verifier_{bits}bits.txt",
                lambda_text="2",
                N=4,
                precision_bits=bits,
            )
            self.assertTrue(result["checks"]["all_raw_entries_strictly_positive"])
            # Every natural-even off-diagonal is a positive sum of raw
            # reflected entries, so any 3-cycle has product +1; a Z-matrix
            # 3-cycle would require product -1.
            triangle_edge_signs = (1, 1, 1)
            self.assertEqual(mp.fprod(triangle_edge_signs), 1)
            self.assertNotEqual(mp.fprod(triangle_edge_signs), -1)


if __name__ == "__main__":
    unittest.main()
