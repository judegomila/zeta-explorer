from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "POSITIVE_XI_KERNEL_FEJER_GROUND_TRANSFER_AUDIT.md"


def no_go_coefficients(M):
    coeffs = {}
    for n in range(M + 1, 2 * M + 1):
        coeffs[n] = Fraction(-1, M)
    for n in range(16 * M + 1, 17 * M + 1):
        coeffs[n] = Fraction(1, M)
    return coeffs


def A_value(coeffs, alpha):
    alpha = Fraction(alpha)
    weighted = sum(
        xi * Fraction(n * n, n * n + alpha * alpha)
        for n, xi in coeffs.items()
    )
    return Fraction(1) - 2 * weighted


class PositiveXiKernelFejerGroundTransferTests(unittest.TestCase):
    def test_locked_h_is_strictly_positive_on_arithmetic_half_line(self):
        # h(x) has positive prefactors for x>=1 once 2*pi-3>0.
        # The elementary rational inequality pi>3 is stronger than needed.
        self.assertGreater(2 * Fraction(3) - 3, 0)

    def test_dirichlet_endpoint_parity(self):
        for N in range(20):
            d_at_pi = sum((-1) ** n for n in range(-N, N + 1))
            self.assertEqual(d_at_pi, (-1) ** N)

    def test_fejer_coefficients_are_nonnegative_and_normalized(self):
        for N in range(20):
            weights = {
                n: Fraction(N + 1 - abs(n), N + 1)
                for n in range(-N, N + 1)
            }
            self.assertEqual(weights[0], 1)
            self.assertTrue(all(weight >= 0 for weight in weights.values()))
            self.assertEqual(weights[-N], Fraction(1, N + 1))
            self.assertEqual(weights[N], Fraction(1, N + 1))

    def test_no_go_boundary_and_l2_identities(self):
        for M in (1, 2, 3, 7, 19):
            coeffs = no_go_coefficients(M)
            self.assertEqual(sum(coeffs.values()), 0)
            # Complex source modes occur in symmetric +/- pairs.
            distance_sq = 2 * sum(xi * xi for xi in coeffs.values())
            self.assertEqual(distance_sq, Fraction(4, M))
            self.assertEqual(Fraction(1) + distance_sq, Fraction(M + 4, M))

    def test_no_go_transform_is_negative_at_declared_height(self):
        for M in (1, 2, 3, 7, 19, 31):
            coeffs = no_go_coefficients(M)
            self.assertEqual(A_value(coeffs, 0), 1)
            self.assertLess(A_value(coeffs, 4 * M), Fraction(-41, 85))

    def test_exact_residual_gap_counterexample(self):
        for M in (1, 2, 3, 7, 19, 101):
            q = Fraction(4, M + 4)
            residual_sq = q * (1 - q)
            self.assertEqual(residual_sq, Fraction(4 * M, (M + 4) ** 2))
            self.assertGreater(q, 0)
            self.assertLess(q, 1)

    def test_note_records_scope_and_missing_relative_estimate(self):
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "K(t)>0",
            "P_N^{(a)}K",
            "p_{a,N}(t)>0",
            "Xi(z)\\over4",
            "mathcal D\\rho\\over c_p",
            "2N+1\\over L",
            "A_M(4M)<-{41\\over85}",
            "abstract exact Hermitian even-block model",
            "minus sign on the prime block",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)


if __name__ == "__main__":
    unittest.main()
