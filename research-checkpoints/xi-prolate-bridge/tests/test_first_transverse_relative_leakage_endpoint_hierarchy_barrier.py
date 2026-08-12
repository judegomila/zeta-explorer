from __future__ import annotations

from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FIRST_TRANSVERSE_RELATIVE_LEAKAGE_ENDPOINT_HIERARCHY_BARRIER.md"
)


class FirstCorrectionIdentificationTests(unittest.TestCase):
    def test_q41_is_triangular_in_q4_q8(self) -> None:
        # Work after multiplication by 64*pi.  Coordinates are in
        # (h0,h4,h8), with independent formal radicals sqrt(6), sqrt(70),
        # and sqrt(105).  The h0 identity uses sqrt(105)*sqrt(70)=35*sqrt(6).
        q41_h4 = Fraction(3)
        q41_h8_sqrt105 = Fraction(-4)

        from_q4_h0_sqrt6 = Fraction(3) * Fraction(-1, 4)
        from_q8_h0_sqrt6 = Fraction(-4) * Fraction(-35, 16)

        self.assertEqual(q41_h4, Fraction(3))
        self.assertEqual(q41_h8_sqrt105, Fraction(-4))
        self.assertEqual(
            from_q4_h0_sqrt6 + from_q8_h0_sqrt6,
            Fraction(8),
        )

    def test_first_proxy_correction_has_four_pi_lambda_squared_scale(self) -> None:
        # d4/d8 ~ 105/(4096*pi^4)*lambda^-8.  After multiplication by
        # lambda^-2*sqrt(105)/(16*pi), the square of the amplitude ratio is
        # exactly 16*pi^2*lambda^4.
        coefficient_squared_without_pi = Fraction(105, 16 * 16)
        inverse_defect_constant_without_pi = Fraction(4096, 105)
        product_without_pi = (
            coefficient_squared_without_pi
            * inverse_defect_constant_without_pi
        )
        self.assertEqual(product_without_pi, Fraction(16))


class DefectHierarchyTests(unittest.TestCase):
    def test_label_twelve_is_exactly_critical(self) -> None:
        # Remove pi^4 before multiplying the two fixed-index ratios.
        d4_over_d8_without_pi = Fraction(105, 4096)
        d12_over_d8_without_inverse_pi = Fraction(16**4, 9 * 10 * 11 * 12)
        product = d4_over_d8_without_pi * d12_over_d8_without_inverse_pi
        self.assertEqual(product, Fraction(14, 99))

    def test_label_eight_retains_polynomial_gain(self) -> None:
        # The squared coefficient of sqrt(d4/d8), after removing pi^-4 and
        # lambda^-8, is 105/4096.  Its square-root denominator is 64.
        self.assertEqual(64 * 64, 4096)
        self.assertEqual(Fraction(105, 4096), Fraction(105, 64 * 64))


class CriticalScaleCountermodelTests(unittest.TestCase):
    @staticmethod
    def model(length: int):
        delta = Fraction(1, 2 ** (length * length))
        d4 = delta / (length**8)
        d8 = delta
        d12 = delta * (length**8)
        shifted = [
            [Fraction(0), Fraction(0), delta],
            [Fraction(0), length * delta, Fraction(0)],
            [delta, Fraction(0), length * d12],
        ]
        return delta, d4, d8, d12, shifted

    def test_metric_floor_and_hidden_residual_are_exact(self) -> None:
        length = 5
        delta, d4, d8, d12, shifted = self.model(length)

        self.assertEqual(d4 * d12, d8 * d8)
        self.assertEqual(shifted[1][1], length * d8)
        self.assertEqual(shifted[2][2], length * d12)
        self.assertGreater(shifted[1][1], 0)
        self.assertGreater(shifted[2][2], 0)

        residual_squared = shifted[0][1] ** 2 + shifted[0][2] ** 2
        epsilon8 = shifted[1][1]
        self.assertEqual(residual_squared, delta * delta)
        self.assertEqual(delta / epsilon8, Fraction(1, length))

    def test_intrinsic_target_fails_despite_superpolynomial_flatness(self) -> None:
        scaled_ratio_squared = []
        largest_entries = []
        for length in (4, 9, 16):
            delta, _, _, d12, shifted = self.model(length)
            epsilon8 = shifted[1][1]
            ratio_squared = delta * delta / (epsilon8 * epsilon8)
            scaled_ratio_squared.append(length**3 * ratio_squared)
            largest_entries.append(length * d12)

        self.assertEqual(
            scaled_ratio_squared,
            [Fraction(4), Fraction(9), Fraction(16)],
        )
        self.assertGreater(largest_entries[0], largest_entries[-1])
        self.assertLess(largest_entries[-1], Fraction(1, 10**40))

    def test_positive_transverse_plane_does_not_make_full_block_positive(self) -> None:
        length = 5
        delta, _, _, _, shifted = self.model(length)

        # The (kappa,e12) principal minor is negative although the
        # transverse diagonal is positive.  Positive-plane Cauchy--Schwarz
        # therefore cannot control the anchor residual cross.
        determinant = shifted[0][0] * shifted[2][2] - delta * delta
        self.assertEqual(determinant, -delta * delta)
        self.assertLess(determinant, 0)


class ClaimDisciplineTests(unittest.TestCase):
    def test_note_keeps_the_combined_source_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "1<n<=lambda^2",
            "minus sign from source equation (3.19)",
            "No zero list",
            "combined pole--Archimedean--minus-prime",
            "not an arithmetic Weil matrix",
            "does **not** follow",
            "o(d_8L^{-1/2})",
            "sqrt(d_4d_12)=Theta(d_8)",
            "D^{\\rm unc}_{88}",
            "c_2\\geq2\\pi",
            "sufficient checkpoint",
            "not a necessary rate",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        self.assertNotIn("first necessary new scalar", text)
        self.assertNotIn(
            "an exponent strictly larger\n   than `2*pi` before sampling losses",
            text,
        )


if __name__ == "__main__":
    unittest.main()
