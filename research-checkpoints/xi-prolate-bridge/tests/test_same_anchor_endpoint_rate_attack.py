import math
import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md"


def endpoint_gamma_ceiling(e: float, T: float) -> float:
    return (e - T * math.sqrt(1.0 - e * e)) / math.sqrt(1.0 + T * T)


def moments(points, weights):
    m1 = sum((p * x for x, p in zip(points, weights)), Fraction())
    mm1 = sum((p / x for x, p in zip(points, weights)), Fraction())
    mm2 = sum((p / (x * x) for x, p in zip(points, weights)), Fraction())
    return m1, mm1, mm2


class SameAnchorEndpointRateAttackTests(unittest.TestCase):
    def test_endpoint_gamma_ceiling_is_exact_trigonometric_identity(self):
        for e, T in ((0.2, 0.05), (0.6, 0.3), (0.95, 0.1)):
            direct = math.sin(math.asin(e) - math.atan(T))
            self.assertAlmostEqual(endpoint_gamma_ceiling(e, T), direct, places=15)

    def test_two_rate_barrier_tightens_when_solve_nears_endpoint_threshold(self):
        e = 0.25
        N = 11
        threshold = e / math.sqrt(1.0 - e * e)
        ceilings = []
        for fraction in (0.0, 0.5, 0.9, 0.99):
            T = fraction * threshold
            gamma = endpoint_gamma_ceiling(e, T)
            ceilings.append(gamma * gamma / (N * N))
        self.assertTrue(all(a > b for a, b in zip(ceilings, ceilings[1:])))
        self.assertGreater(ceilings[0], 0.0)
        self.assertGreater(ceilings[-1], 0.0)

    def test_ritz_surplus_equals_double_spectral_spread(self):
        points = [Fraction(2), Fraction(5), Fraction(11)]
        weights = [Fraction(1, 6), Fraction(1, 3), Fraction(1, 2)]
        m1, mm1, mm2 = moments(points, weights)
        r2 = Fraction(7, 3)
        chi = r2 * (mm1 - 1 / m1)
        double = Fraction()
        for x, px in zip(points, weights):
            for y, py in zip(points, weights):
                double += px * py * (x - y) ** 2 / (x * y)
        self.assertEqual(chi, r2 * double / (2 * m1))
        self.assertGreater(chi, 0)
        self.assertEqual(r2 * mm2, r2 * moments(points, weights)[2])

    def test_fixed_solve_can_have_unbounded_surplus(self):
        previous = Fraction()
        for s in (4, 8, 16, 32):
            s = Fraction(s)
            points = [Fraction(1), s**2, s**4]
            weights = [s**-8, s**-1, 1 - s**-1 - s**-8]
            m1, mm1, mm2 = moments(points, weights)
            # T_0=1, so r^2=1/m_{-2} and tau^2=r^2*m_{-2}=1.
            r2 = 1 / mm2
            tau2 = r2 * mm2
            chi = r2 * (mm1 - 1 / m1)
            self.assertEqual(tau2, 1)
            self.assertGreaterEqual(chi, Fraction(2, 5) * s * s)
            self.assertGreater(chi, previous)
            previous = chi

    def test_scalar_complement_has_zero_surplus_at_any_solve(self):
        a = Fraction(7, 3)
        T = Fraction(5, 4)
        r = a * T
        m1 = a
        mm1 = 1 / a
        mm2 = 1 / (a * a)
        self.assertEqual(r * r * mm2, T * T)
        self.assertEqual(r * r * (mm1 - 1 / m1), 0)

    def test_exact_fejer_endpoint_overlap_and_constant_floor_loss(self):
        for N in (1, 2, 8, 64):
            weights = [Fraction(N + 1 - n, N + 1) for n in range(1, N + 1)]
            norm2 = Fraction(1) + 2 * sum((x * x for x in weights), Fraction())
            endpoint_sum = Fraction(1) + 2 * sum(weights, Fraction())
            overlap2 = endpoint_sum * endpoint_sum / (Fraction(2 * N + 1) * norm2)
            locked = Fraction(3 * (N + 1) ** 3, (2 * N + 1) * (2 * N * N + 4 * N + 3))
            self.assertEqual(overlap2, locked)
            self.assertEqual(Fraction(1, 2 * N + 1), Fraction(1, 2 * N + 1))
        self.assertGreater(float(locked), 0.70)

    @staticmethod
    def _source_cauchy_tau_squared(M: Fraction):
        c00 = Fraction(2551) - 272 * M
        c01 = Fraction(-208)
        c11 = Fraction(-137) + 2329 * M
        det = c00 * c11 - c01 * c01
        b0 = Fraction(12, 13)
        b1 = Fraction(12, 169) * (17 * M - 1)
        # B=C/2873 and b=(b0,b1)/sqrt(17).
        z0 = Fraction(2873) * (c11 * b0 - c01 * b1) / det
        z1 = Fraction(2873) * (-c01 * b0 + c00 * b1) / det
        return det, (z0 * z0 + z1 * z1) / 17

    def test_exact_source_cauchy_family_fixes_endpoint_but_blows_up_solve(self):
        values = []
        for M in (Fraction(9), Fraction(93, 10), Fraction(234, 25), Fraction(937, 100)):
            det, tau2 = self._source_cauchy_tau_squared(M)
            self.assertGreater(det, 0)
            self.assertGreater(Fraction(2551) - 272 * M, 0)
            q = (9 + 16 * M) / 169
            self.assertLess(q, 1)  # the exact odd floor is one
            values.append(tau2)
        self.assertTrue(all(a < b for a, b in zip(values, values[1:])))
        self.assertGreater(float(values[-1]), 1_000_000.0)

    def test_note_locks_claim_boundary_and_two_anchor_missing_inputs(self):
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "Gamma_{\\rm end}",
            "N^2\\chi_U",
            "B_{\\rm tr}",
            "B_{\\rm proj}",
            "absolutely continuous with an `L2` density",
            "exact Ritz-surplus spread identity",
            "mathfrak h_{\\delta}",
            "delta/sqrt(2N+1)",
            "t_{F,N}",
            "P_{z^\\perp}(Q_+-U_zI)(z-\\kappa_p)",
            "N/L^2 -> infinity",
            "no universal asymptotic scale",
            "not an asymptotic",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        self.assertNotIn("RH_PROVED", text)
        self.assertNotIn("CERTIFIED", text)


if __name__ == "__main__":
    unittest.main()
