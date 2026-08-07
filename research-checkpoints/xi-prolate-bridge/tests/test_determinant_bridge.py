from __future__ import annotations

import sys
import unittest
from fractions import Fraction
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from determinant_bridge import (  # noqa: E402
    CCM_ZST_SHA256,
    boundary_value,
    determinant_rational_product,
    mellin_l2_error_bound,
    mellin_transform_from_modes,
    scaled_vector_error,
    source_regularized_determinant,
    verify_ccm_source,
)


class DeterminantBridgeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        mp.mp.dps = 80

    def test_binding_pdf_hash(self):
        self.assertEqual(verify_ccm_source(ROOT), CCM_ZST_SHA256)

    def test_source_525_and_527_agree(self):
        L = 2 * mp.log(mp.mpf("2"))
        modes = [-2, -1, 0, 1, 2]
        coefficients = [mp.mpf("3"), mp.mpf("-2"), mp.mpf("5"), mp.mpf("-2"), mp.mpf("3")]
        z = mp.mpc("1.125", "0.375")
        determinant = source_regularized_determinant(coefficients, modes, L, z)
        rational = determinant_rational_product(coefficients, modes, L, z)
        self.assertLess(abs(determinant - rational), mp.mpf("1e-70"))

    def test_arbitrary_nonzero_rescaling_is_exactly_invariant(self):
        L = 2 * mp.log(mp.mpf("2.75"))
        modes = [-1, 0, 1]
        coefficients = [mp.mpf("-1"), mp.mpf("3"), mp.mpf("-1")]
        scale = mp.mpc("-7.25", "2.5")
        rescaled = [scale * value for value in coefficients]
        z = mp.mpc("2.25", "-0.2")
        original = source_regularized_determinant(coefficients, modes, L, z)
        replay = source_regularized_determinant(rescaled, modes, L, z)
        self.assertLess(abs(original - replay), mp.mpf("1e-70"))

    def test_uncompensated_transform_does_change_scale(self):
        L = 2 * mp.log(mp.mpf("2"))
        modes = [-1, 0, 1]
        coefficients = [mp.mpf("-1"), mp.mpf("3"), mp.mpf("-1")]
        scale = mp.mpc("4", "-3")
        z = mp.mpc("1.7", "0.1")
        original = mellin_transform_from_modes(coefficients, modes, L, z)
        changed = mellin_transform_from_modes(
            [scale * value for value in coefficients], modes, L, z
        )
        self.assertLess(abs(changed - scale * original), mp.mpf("1e-70"))
        self.assertGreater(abs(changed - original), mp.mpf("1e-10"))

    def test_zero_boundary_vector_is_rejected(self):
        L = 2 * mp.log(mp.mpf("2"))
        coefficients = [mp.mpf("1"), mp.mpf("-2"), mp.mpf("1")]
        self.assertEqual(boundary_value(coefficients, L), 0)
        with self.assertRaisesRegex(ValueError, "boundary normalization is zero"):
            source_regularized_determinant(
                coefficients, [-1, 0, 1], L, mp.mpc("1", "0.2")
            )

    def test_removable_lattice_value_is_reconstructed_by_direct_integral(self):
        L = 2 * mp.log(mp.mpf("2"))
        modes = [-1, 0, 1]
        coefficients = [mp.mpf("-1"), mp.mpf("3"), mp.mpf("-1")]
        lattice_point = 2 * mp.pi / L
        value = mellin_transform_from_modes(
            coefficients, modes, L, lattice_point
        )
        # At z=2*pi/L only the n=1 integral survives, with centered phase -1.
        expected = -mp.sqrt(L) * coefficients[2]
        self.assertLess(abs(value - expected), mp.mpf("1e-70"))

    def test_exact_nontrivial_source_example_has_real_quotient_roots(self):
        # Modes -1,0,1; b=(-1,0,1), diagonal=(2,2/3,2).  The shifted
        # Cauchy matrix is PSD with simple even kernel xi=(1,-3,1).
        T = [
            [Fraction(2), Fraction(1), Fraction(1)],
            [Fraction(1), Fraction(2, 3), Fraction(1)],
            [Fraction(1), Fraction(1), Fraction(2)],
        ]
        xi = [Fraction(-1), Fraction(3), Fraction(-1)]  # eta(xi)=1
        Dxi = [Fraction(1), Fraction(0), Fraction(-1)]
        D = [
            [Fraction(-1), Fraction(0), Fraction(0)],
            [Fraction(0), Fraction(0), Fraction(0)],
            [Fraction(0), Fraction(0), Fraction(1)],
        ]
        Dprime = [
            [D[i][j] - Dxi[i] for j in range(3)]
            for i in range(3)
        ]

        def matmul(A, B):
            return [
                [sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)]
                for i in range(3)
            ]

        TD = matmul(T, Dprime)
        DstarT = matmul(
            [[Dprime[j][i] for j in range(3)] for i in range(3)], T
        )
        self.assertEqual(TD, DstarT)
        self.assertEqual(
            [sum(Dprime[i][j] * xi[j] for j in range(3)) for i in range(3)],
            [Fraction(0), Fraction(0), Fraction(0)],
        )
        # Lemma 5.4 gives Det(M''-s)=s^2-3, hence the two quotient roots
        # are exactly +/-sqrt(3), both real.  Check the polynomial at three
        # rational points without importing an eigensolver.
        for s in (Fraction(-2), Fraction(0), Fraction(5, 2)):
            det_D_minus_s = (-1 - s) * (-s) * (1 - s)
            resolvent_sum = (
                xi[0] / (-1 - s) + xi[1] / (-s) + xi[2] / (1 - s)
                if s not in (-1, 0, 1)
                else None
            )
            if resolvent_sum is not None:
                self.assertEqual(det_D_minus_s * resolvent_sum, s * s - 3)

    def test_substrip_bound_and_scaled_error_are_decimal_exact_inputs(self):
        combined = scaled_vector_error("2.5", "0.001", "0.002")
        self.assertEqual(combined, mp.mpf("0.006"))
        bound = mellin_l2_error_bound("3", "0.4", combined)
        self.assertGreater(bound, 0)
        with self.assertRaises(TypeError):
            mellin_l2_error_bound(3.0, "0.4", combined)
        with self.assertRaises(ValueError):
            mellin_l2_error_bound("3", "0.5", combined)


if __name__ == "__main__":
    unittest.main()
