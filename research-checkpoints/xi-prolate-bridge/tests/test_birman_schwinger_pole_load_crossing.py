from __future__ import annotations

import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "BIRMAN_SCHWINGER_POLE_LOAD_CROSSING_AUDIT.md"


def det2(matrix):
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def inverse2(matrix):
    determinant = det2(matrix)
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


def quadratic(vector, matrix):
    return sum(
        vector[i] * matrix[i][j] * vector[j]
        for i in range(len(vector))
        for j in range(len(vector))
    )


def rank_one_update(matrix, vector, coefficient):
    return tuple(
        tuple(
            matrix[i][j] + coefficient * vector[i] * vector[j]
            for j in range(len(vector))
        )
        for i in range(len(vector))
    )


class BirmanSchwingerPoleLoadCrossingTests(unittest.TestCase):
    def test_two_rank_one_determinant_identities(self):
        a_plus = ((3.0, 0.25), (0.25, 7.0))
        a_minus = ((5.0, -0.4), (-0.4, 9.0))
        p_plus = (1.25, -0.75)
        p_minus = (0.5, 1.5)
        s = 0.7
        z = 1.1

        for base, vector, sign in (
            (a_plus, p_plus, 1.0),
            (a_minus, p_minus, -1.0),
        ):
            shifted = (
                (base[0][0] - z, base[0][1]),
                (base[1][0], base[1][1] - z),
            )
            resolvent = inverse2(shifted)
            f_value = quadratic(vector, resolvent)
            loaded = rank_one_update(shifted, vector, sign * 2 * s)
            expected = det2(shifted) * (1 + sign * 2 * s * f_value)
            self.assertAlmostEqual(det2(loaded), expected, places=13)

    def test_exact_hyperbolic_pole_norm_sum(self):
        for ell in (0.1, 0.7, 1.5, 3.0):
            plus_norm_squared = math.sinh(ell) + ell
            minus_norm_squared = math.sinh(ell) - ell
            self.assertGreater(plus_norm_squared, 0)
            self.assertGreater(minus_norm_squared, 0)
            self.assertAlmostEqual(
                plus_norm_squared + minus_norm_squared,
                2 * math.sinh(ell),
                places=14,
            )
            lam = math.exp(ell)
            self.assertAlmostEqual(
                4 * math.sinh(ell),
                2 * (lam - 1 / lam),
                places=13,
            )

    def test_killed_jump_semigroup_is_positivity_improving(self):
        kappa = 0.4
        jump = 2.3
        for time in (0.01, 0.2, 1.0, 5.0):
            common = math.exp(-kappa * time) / 2
            diagonal = common * (1 + math.exp(-2 * jump * time))
            off_diagonal = common * (1 - math.exp(-2 * jump * time))
            self.assertGreater(diagonal, 0)
            self.assertGreater(off_diagonal, 0)

    def test_graph_model_attains_the_norm_gap_threshold(self):
        ell = 1.2
        s = 1.0
        kappa = 0.75
        plus_norm_squared = math.sinh(ell) + ell
        minus_norm_squared = math.sinh(ell) - ell
        crossing_jump = 2 * s * math.sinh(ell)

        for factor, expected_sign in ((1.2, 1), (1.0, 0), (0.8, -1)):
            jump = factor * crossing_jump
            z_plus = kappa + 2 * s * plus_norm_squared
            z_minus = kappa + 2 * jump - 2 * s * minus_norm_squared
            gap = z_minus - z_plus
            if expected_sign > 0:
                self.assertGreater(gap, 0)
            elif expected_sign < 0:
                self.assertLess(gap, 0)
            else:
                self.assertAlmostEqual(gap, 0, places=13)

        nonpole_gap = 2 * crossing_jump
        threshold = 2 * s * (plus_norm_squared + minus_norm_squared)
        self.assertAlmostEqual(nonpole_gap, threshold, places=13)

    def test_graph_secular_roots_and_crossing_identity(self):
        ell = 0.9
        kappa = 0.6
        plus_norm_squared = math.sinh(ell) + ell
        minus_norm_squared = math.sinh(ell) - ell
        jump = 1.7
        critical_s = jump / (2 * math.sinh(ell))
        z_cross = kappa + 2 * critical_s * plus_norm_squared

        f_plus = plus_norm_squared / (kappa - z_cross)
        f_minus = minus_norm_squared / (kappa + 2 * jump - z_cross)
        self.assertAlmostEqual(1 + 2 * critical_s * f_plus, 0, places=13)
        self.assertAlmostEqual(1 - 2 * critical_s * f_minus, 0, places=13)
        self.assertAlmostEqual(f_plus + f_minus, 0, places=13)
        self.assertAlmostEqual(critical_s, 1 / (2 * f_minus), places=13)

    def test_live_birman_margin_decreases_to_the_crossing(self):
        ell = 0.8
        kappa = 1.1
        jump = 3.0
        plus_norm_squared = math.sinh(ell) + ell
        minus_norm_squared = math.sinh(ell) - ell
        critical_s = jump / (2 * math.sinh(ell))
        margins = []
        for fraction in (0.1, 0.3, 0.6, 0.9, 1.0):
            s = fraction * critical_s
            z_plus = kappa + 2 * s * plus_norm_squared
            f_minus = minus_norm_squared / (kappa + 2 * jump - z_plus)
            margins.append(1 - 2 * s * f_minus)
        self.assertTrue(all(y < x for x, y in zip(margins, margins[1:])))
        self.assertGreater(margins[-2], 0)
        self.assertAlmostEqual(margins[-1], 0, places=13)

    def test_note_retains_claim_boundary_and_exact_source_signs(self):
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "every prime-power atom `n<=lambda^2`",
            "The source is the single value `s=1`",
            "1+2sF_+(z)",
            "1-2sF_-(z)",
            "F_+(z_c)+F_-(z_c)=0",
            "s_c>1",
            "4s\\sinh\\ell",
            "positivity-improving",
            "best possible",
            "not the arithmetic source operator",
            "No zeta zero is assumed",
        )
        for phrase in required:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
