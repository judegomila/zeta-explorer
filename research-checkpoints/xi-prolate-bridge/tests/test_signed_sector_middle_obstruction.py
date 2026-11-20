from __future__ import annotations

import sys
import unittest
from pathlib import Path

import mpmath as mp

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from signed_sector_middle_obstruction import (  # noqa: E402
    adversarial_shifted_pair,
    coefficient_bounds_admit_pair,
    parity_entries,
    source_constants,
    sufficient_high_cutoff_log10,
)


class SignedSectorMiddleObstructionTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 80

    def test_parity_formulas_match_direct_cauchy_assembly(self) -> None:
        n, m = 7, 3
        a_n, a_m = mp.mpf("1.25"), mp.mpf("-0.75")
        b_n, b_m = mp.mpf("0.4"), mp.mpf("-0.2")
        blocks = parity_entries(n, m, a_n, a_m, b_n, b_m)

        q_nm = (b_n - b_m) / (n - m)
        q_n_minus_m = (b_n + b_m) / (n + m)
        self.assertEqual(blocks["plus"][0, 1], q_nm + q_n_minus_m)
        self.assertEqual(blocks["minus"][0, 1], q_nm - q_n_minus_m)
        self.assertEqual(blocks["plus"][0, 0], a_n + b_n / n)
        self.assertEqual(blocks["minus"][0, 0], a_n - b_n / n)

    def test_complete_loewner_diagonal_identity(self) -> None:
        n = 11
        b_n = mp.mpf("-0.37")
        b_prime_n = mp.mpf("0.19")
        cosine_pairing_n = mp.mpf("-0.08")
        a_n = b_prime_n + 2 * cosine_pairing_n

        natural_plus_diagonal = b_prime_n + b_n / n
        natural_minus_diagonal = b_prime_n - b_n / n
        self.assertEqual(a_n + b_n / n, natural_plus_diagonal + 2 * cosine_pairing_n)
        self.assertEqual(a_n - b_n / n, natural_minus_diagonal + 2 * cosine_pairing_n)

    def test_adversarial_pair_is_indefinite_in_both_sectors(self) -> None:
        report = adversarial_shifted_pair(mp.mpf("2.75"), mp.mpf("0.125"), 19)
        expected = -4 * mp.mpf("2.75") ** 2 - mp.mpf("2.75") ** 2 / (19 * 20)
        self.assertEqual(report["determinant_formula"], expected)
        self.assertLess(abs(report["plus_determinant"] - expected), mp.mpf("1e-75"))
        self.assertLess(abs(report["minus_determinant"] - expected), mp.mpf("1e-75"))
        self.assertLess(report["plus_determinant"], 0)
        self.assertLess(report["minus_determinant"], 0)

    def test_lambda2_transition_index_lies_inside_uncontrolled_range(self) -> None:
        constants = source_constants("2", dps=80)
        # The pinned transition theorem gives n_*(2)=27.  Equations (4.2)--
        # (4.4) still admit the simultaneous countermodel at r=27 for U=0.
        self.assertTrue(coefficient_bounds_admit_pair(constants, mp.mpf("0"), 27))

    def test_displayed_high_cutoff_is_not_the_transition_index(self) -> None:
        constants = source_constants("2", dps=80)
        # The sufficient high cutoff is above 10^11 at lambda=2, whereas the
        # positive additive transition index is 27.  This is a scope check,
        # not an assertion about the exact arithmetic low block.
        self.assertGreater(sufficient_high_cutoff_log10(constants), 11)

    def test_decimal_parameter_is_not_binary64_rounded(self) -> None:
        a = source_constants("2.0000000000000000000000000000000000001", dps=90)
        b = source_constants("2", dps=90)
        self.assertNotEqual(a.lam, b.lam)
        self.assertNotEqual(a.C_a, b.C_a)


if __name__ == "__main__":
    unittest.main()
