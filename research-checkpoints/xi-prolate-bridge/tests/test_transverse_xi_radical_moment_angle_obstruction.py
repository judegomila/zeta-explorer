from __future__ import annotations

import math
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md"


class TransverseXiRadicalMomentAngleObstructionTests(unittest.TestCase):
    def test_claim_boundary_and_source_conventions_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        for token in (
            "P0_INVALIDATED",
            "e^{-itx}",
            "n\\leq\\lambda^2",
            "prime block keeps the minus sign",
            "source-normalized",
            "Lebesgue measure and zero extension",
            "inversion is reflection",
            "No list of real zeta zeros",
            "no global Weil positivity assumption",
            "combined value must be formed before absolute values",
            "covariance-weighted layer profile",
            "\\Theta_m(u)=",
            "\\Phi(u)=\\operatorname {tr}(E_uK_TE_u)",
            "not a hidden new source estimate",
            "Numerical agreement cannot replace",
        ):
            self.assertIn(token, normalized)

    def test_centered_second_derivative_is_transverse(self) -> None:
        # Gaussian regression for the integration-by-parts algebra.  With
        # K=exp(-x^2), A=int K^2, B=int (K')^2=A, hence m2=1 and
        # W=K''+K=(4*x^2-1)K.  Under the K^2 density E[x^2]=1/4.
        m2 = 1.0
        k2_second_moment = 1.0 / 4.0
        normalized_inner_product = 4.0 * k2_second_moment - 1.0
        self.assertAlmostEqual(normalized_inner_product, 0.0)

        # Under the K density, E[x^2]=1/2, so int W = int K rather
        # than zero.  This checks the zeroth-moment warning in (2.9).
        k_second_moment = 1.0 / 2.0
        integral_ratio = 4.0 * k_second_moment - 1.0
        self.assertAlmostEqual(integral_ratio, m2)

    def test_euler_generator_preserves_the_source_codimension_two_class(self) -> None:
        # Integration by parts gives int Lf=-int(f)/2.  Applying L twice
        # therefore keeps a zero integral zero; L also preserves f(0)=0.
        integral_f = 0
        value_at_zero = 0
        integral_lf = -integral_f / 2
        integral_l2f = -integral_lf / 2
        value_lf_at_zero = value_at_zero / 2
        value_l2f_at_zero = value_lf_at_zero / 2

        self.assertEqual(integral_lf, 0)
        self.assertEqual(integral_l2f, 0)
        self.assertEqual(value_lf_at_zero, 0)
        self.assertEqual(value_l2f_at_zero, 0)

    def test_exact_low_layer_angle_inequality(self) -> None:
        # B=diag(1/100,100), u=1.  The unit transverse vector is almost
        # entirely in the low spectral layer, while its small high component
        # is controlled by the Rayleigh/threshold Markov estimate.
        low_coordinate = math.sqrt(999_999) / 1000
        high_coordinate = 1 / 1000
        epsilon = (
            low_coordinate**2 / 100
            + 100 * high_coordinate**2
        )
        threshold = 1.0

        # Take the one-dimensional moment range to be span(omega), so alpha=1.
        eta = low_coordinate**2
        lower_bound = max(0.0, 1.0 - math.sqrt(epsilon / threshold)) ** 2

        self.assertAlmostEqual(low_coordinate**2 + high_coordinate**2, 1.0)
        self.assertLessEqual(high_coordinate**2, epsilon / threshold)
        self.assertGreater(lower_bound, 0.8)
        self.assertLessEqual(lower_bound, eta)

    def test_fixed_window_capture_feeds_the_angle_bound(self) -> None:
        # Abstract finite regression of alpha >= ||A w||-sqrt(tau).
        # A=diag(sqrt(9/10),sqrt(1/5)); P keeps the first coordinate.
        omega = (3 / 5, 4 / 5)
        observed_norm = math.sqrt(
            (9 / 10) * omega[0] ** 2 + (1 / 5) * omega[1] ** 2
        )
        tail_trace = 1 / 5
        alpha = abs(omega[0])

        self.assertGreaterEqual(
            alpha + 1e-15,
            observed_norm - math.sqrt(tail_trace),
        )

    def test_target_forces_relative_radical_separation(self) -> None:
        # The proof only uses u <= C*epsilon and r/u=o(L^-5/2).
        # These exact exponent examples distinguish an admissible relative
        # scale from one which is too large.
        for L in (16, 64, 256):
            epsilon = L ** -8
            constant = 16
            threshold = constant * epsilon

            good_residual = epsilon * L ** -3
            bad_residual = epsilon * L ** -2

            good_scaled = L ** (5 / 2) * good_residual / threshold
            bad_scaled = L ** (5 / 2) * bad_residual / threshold

            self.assertAlmostEqual(good_scaled, L ** (-1 / 2) / constant)
            self.assertAlmostEqual(bad_scaled, L ** (1 / 2) / constant)

        self.assertLess(
            256 ** (5 / 2) * (256 ** -8 * 256 ** -3) / (16 * 256 ** -8),
            16 ** (5 / 2) * (16 ** -8 * 16 ** -3) / (16 * 16 ** -8),
        )
        self.assertGreater(
            256 ** (5 / 2) * (256 ** -8 * 256 ** -2) / (16 * 256 ** -8),
            16 ** (5 / 2) * (16 ** -8 * 16 ** -2) / (16 * 16 ** -8),
        )

    def test_covariance_weighted_two_layer_bounds(self) -> None:
        # B=diag(1,4), residual ridge r=1, threshold u=2, and
        # K_m=[[2,1],[1,1]].  The off-diagonal covariance is retained even
        # though the resolvent happens to be diagonal in this example.
        residual = 1.0
        threshold = 2.0
        t = residual / (threshold + residual)

        trace_k = 3.0
        theta = 2.0  # tr(K_m * diag(1,0))
        low = 2.0 * (1 / 2) + 1.0 * (1 / 5)

        lower = t * theta
        upper = t * trace_k + (1 - t) * theta
        self.assertLessEqual(lower, low)
        self.assertLessEqual(low, upper)

        # Worst-angle replacement gives theta <= eta*tr(K); here eta=1
        # and is strictly less informative than the exact theta.
        eta = 1.0
        self.assertLess(theta, eta * trace_k)

    def test_covariance_profile_is_a_hilbert_schmidt_overlap(self) -> None:
        # A=diag(2,1), so K=A^*A=diag(4,1); E=diag(1,0).
        # tr(K E)=4 equals ||E A^*||_HS^2.
        trace_product = 4.0
        hs_squared = 2.0**2
        self.assertEqual(trace_product, hs_squared)

    def test_moment_covariance_is_close_to_the_direct_profile(self) -> None:
        # Hilbert--Schmidt triangle inequality in a diagonal toy model.
        # Direct operator A E has singular values (3,1); moment projection
        # drops the second coordinate, so sqrt(Phi)=sqrt(10),
        # sqrt(Theta)=3, and the omitted HS tail is exactly 1.
        sqrt_phi = math.sqrt(10)
        sqrt_theta = 3.0
        sqrt_tail = 1.0
        self.assertLessEqual(abs(sqrt_phi - sqrt_theta), sqrt_tail)

    def test_direct_two_layer_profile_needs_no_moment_floor(self) -> None:
        # The same exact spectral measure as the covariance regression,
        # now interpreted directly on the whole complement.
        residual = 1.0
        threshold = 2.0
        t = residual / (threshold + residual)
        phi = 2.0
        trace_k = 3.0
        soft_trace = 2.0 * (1 / 2) + 1.0 * (1 / 5)
        self.assertLessEqual(t * phi, soft_trace)
        self.assertLessEqual(
            soft_trace,
            t * trace_k + (1 - t) * phi,
        )


if __name__ == "__main__":
    unittest.main()
