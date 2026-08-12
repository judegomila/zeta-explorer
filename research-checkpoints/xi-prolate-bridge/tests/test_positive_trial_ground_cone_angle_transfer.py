from fractions import Fraction
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "POSITIVE_TRIAL_GROUND_CONE_ANGLE_TRANSFER.md"


def paired_boundary(y0, paired):
    """Boundary in coordinates paired[n-1] = sqrt(2) * y_n."""
    return y0 + sum(paired)


def paired_response(y0, paired, alpha_sq):
    """Exact homogeneous B_y with rational alpha^2; None means infinity."""
    if alpha_sq is None:
        return paired_boundary(y0, paired)
    t = Fraction(alpha_sq)
    return y0 + sum(
        Fraction(t, n * n + t) * paired[n - 1]
        for n in range(1, len(paired) + 1)
    )


def dirichlet_kernel(N, theta):
    return 1.0 + 2.0 * sum(math.cos(n * theta) for n in range(1, N + 1))


def lowest_two_by_two(q, coupling, complement):
    disc = math.sqrt((complement - q) ** 2 + 4.0 * coupling * coupling)
    return 0.5 * (q + complement - disc)


class PositiveTrialGroundConeAngleTransferTests(unittest.TestCase):
    def test_homogeneous_response_is_boundary_times_normalized_response(self):
        y0 = Fraction(7, 5)
        paired = [Fraction(-2, 7), Fraction(3, 11), Fraction(5, 13)]
        boundary = paired_boundary(y0, paired)
        self.assertNotEqual(boundary, 0)

        for alpha_sq in (Fraction(0), Fraction(1, 9), Fraction(7, 3), 25):
            B = paired_response(y0, paired, alpha_sq)
            r_sum = sum(
                Fraction(n * n, n * n + Fraction(alpha_sq)) * paired[n - 1]
                for n in range(1, len(paired) + 1)
            )
            A = 1 - r_sum / boundary
            self.assertEqual(B, boundary * A)

        self.assertEqual(paired_response(y0, paired, 0), y0)
        self.assertEqual(paired_response(y0, paired, None), boundary)

    def test_constant_state_depth_and_spherical_cap_are_sharp(self):
        N = 4
        cone_depth = 1.0 / math.sqrt(2 * N + 1)
        cap = math.asin(cone_depth)

        # The closest endpoint-boundary vector is the normalized projection
        # of z=e_0 onto d^perp.
        sqrt2 = math.sqrt(2.0)
        z = [1.0] + [0.0] * N
        d = [1.0] + [sqrt2] * N
        d_norm_sq = sum(value * value for value in d)
        projection = [zj - d[0] * dj / d_norm_sq for zj, dj in zip(z, d)]
        projection_norm = math.sqrt(sum(value * value for value in projection))
        boundary_vector = [value / projection_norm for value in projection]

        self.assertAlmostEqual(sum(a * b for a, b in zip(d, boundary_vector)), 0.0, places=14)
        self.assertAlmostEqual(sum(value * value for value in boundary_vector), 1.0, places=14)
        angle = math.acos(sum(a * b for a, b in zip(z, boundary_vector)))
        self.assertAlmostEqual(angle, cap, places=14)

        # The worst direction is the negative normalized nonconstant part of d.
        below = cap - 1.0e-4
        above = cap + 1.0e-4
        B_below_infinity = math.cos(below) - math.sqrt(2 * N) * math.sin(below)
        B_above_infinity = math.cos(above) - math.sqrt(2 * N) * math.sin(above)
        self.assertGreater(B_below_infinity, 0.0)
        self.assertLess(B_above_infinity, 0.0)

        # Every finite-alpha weight lies between zero and its endpoint value,
        # so the below-cap vector remains in every response halfspace.
        for alpha_sq in (0.0, 0.01, 0.25, 1.0, 10.0, 1.0e6):
            negative_coefficient = -math.sin(below) / math.sqrt(N)
            B = math.cos(below) + math.sqrt(2.0) * sum(
                alpha_sq / (n * n + alpha_sq) * negative_coefficient
                for n in range(1, N + 1)
            )
            self.assertGreater(B, 0.0)

    def test_finite_hyperplane_distance_formula_is_sharp(self):
        N = 3
        alpha_sq = 2.5
        b = [1.0] + [
            math.sqrt(2.0) * alpha_sq / (n * n + alpha_sq)
            for n in range(1, N + 1)
        ]
        z = [1.0] + [0.0] * N
        b_norm = math.sqrt(sum(value * value for value in b))
        m = 1.0 / b_norm
        b_hat = [value / b_norm for value in b]
        projected = [zj - m * bj for zj, bj in zip(z, b_hat)]
        projected_norm = math.sqrt(sum(value * value for value in projected))
        on_hyperplane = [value / projected_norm for value in projected]

        self.assertAlmostEqual(sum(a * b0 for a, b0 in zip(b, on_hyperplane)), 0.0, places=14)
        angle = math.acos(sum(a * b0 for a, b0 in zip(z, on_hyperplane)))
        self.assertAlmostEqual(angle, math.asin(m), places=14)

    def test_non_circular_even_resolvent_atan_gate(self):
        # Everything below is built from a 2x2 even block.  No odd eigenvalue
        # or odd floor enters the angle estimate.
        q = 0.4
        complement = 3.0
        coupling = -0.2
        U = q
        mu = lowest_two_by_two(q, coupling, complement)
        tau = abs(coupling) / (complement - U)
        actual_tan = abs(coupling) / (complement - mu)
        actual_turn = math.atan(actual_tan)
        cone_depth = 1.0 / math.sqrt(3.0)  # z=e_0, N=1
        cap = math.asin(cone_depth)

        self.assertLessEqual(actual_tan, tau)

        theta0 = 0.20
        self.assertLess(math.atan(tau) + theta0, cap)
        actual_angle = theta0 + actual_turn
        B_infinity = math.cos(actual_angle) - math.sqrt(2.0) * math.sin(actual_angle)
        self.assertGreater(B_infinity, 0.0)

        # Exact sine form of the same branch-selected gate.
        gate_sine = (
            math.sin(theta0) + tau * math.cos(theta0)
        ) / math.sqrt(1.0 + tau * tau)
        self.assertLess(theta0 + math.atan(tau), math.pi / 2.0)
        self.assertLess(gate_sine, cone_depth)

        # Moving the anchor beyond the sharp cap makes the endpoint response
        # fail in this worst-direction model.
        theta0_bad = 0.58
        self.assertGreater(math.atan(tau) + theta0_bad, cap)
        bad_actual_angle = theta0_bad + actual_turn
        bad_boundary = math.cos(bad_actual_angle) - math.sqrt(2.0) * math.sin(bad_actual_angle)
        self.assertLess(bad_boundary, 0.0)

    def test_boundary_normalized_l2_radius_has_exact_hitting_perturbation(self):
        N = 4
        alpha_sq = Fraction(9, 4)
        r = [
            Fraction(n * n, n * n + alpha_sq)
            for n in range(1, N + 1)
        ]
        S = sum(r)
        dimension = 2 * N + 1

        # Encode an even parity vector as (h0, htilde), where the actual
        # nth coordinate is sqrt(2)*htilde[n-1].
        projected0 = Fraction(2) * S / dimension
        projected_tilde = [-rn + Fraction(2) * S / dimension for rn in r]
        restricted_norm_sq = (
            2 * sum(rn * rn for rn in r)
            - Fraction(4) * S * S / dimension
        )
        direct_norm_sq = projected0 * projected0 + 2 * sum(
            value * value for value in projected_tilde
        )
        self.assertEqual(direct_norm_sq, restricted_norm_sq)
        self.assertGreater(restricted_norm_sq, 0)

        # Start from p=e_0, for which A_p=1, and take h=-P a/s^2.
        h0 = -projected0 / restricted_norm_sq
        h_tilde = [-value / restricted_norm_sq for value in projected_tilde]
        self.assertEqual(h0 + 2 * sum(h_tilde), 0)
        response_change = -2 * sum(rn * hn for rn, hn in zip(r, h_tilde))
        self.assertEqual(1 + response_change, 0)
        h_norm_sq = h0 * h0 + 2 * sum(value * value for value in h_tilde)
        self.assertEqual(h_norm_sq, 1 / restricted_norm_sq)

    def test_commutator_correction_identity_preserves_the_signed_response(self):
        N = 4
        w = [0.17, -0.09, 0.04, 0.13]
        T_diag = [1.5, 2.0, 3.0, 5.0]
        h_high = [-w[n - 1] / n for n in range(1, N + 1)]
        h0 = -math.sqrt(2.0) * sum(h_high)

        # D h = -w and D rho = T w, so T D h = -D rho exactly
        # up to binary arithmetic in this replay.
        D_h = [n * h_high[n - 1] for n in range(1, N + 1)]
        D_rho = [T_diag[n - 1] * w[n - 1] for n in range(1, N + 1)]
        for lhs, rhs in zip(
            [T_diag[n] * D_h[n] for n in range(N)],
            [-value for value in D_rho],
        ):
            self.assertAlmostEqual(lhs, rhs, places=14)
        self.assertAlmostEqual(h0 + math.sqrt(2.0) * sum(h_high), 0.0, places=14)

        for alpha_sq in (0.0, 0.5, 4.0, 100.0):
            A_difference = -math.sqrt(2.0) * sum(
                n * n / (n * n + alpha_sq) * h_high[n - 1]
                for n in range(1, N + 1)
            )
            g_dot_w = math.sqrt(2.0) * sum(
                n / (n * n + alpha_sq) * w[n - 1]
                for n in range(1, N + 1)
            )
            self.assertAlmostEqual(A_difference, g_dot_w, places=14)

    def test_boundary_zero_reproducing_kernel_formula(self):
        N = 5
        L = 7.25
        d = [1.0] + [math.sqrt(2.0)] * N
        d_norm_sq = 2 * N + 1

        for y in (0.0, 0.03, 0.4, 1.7, L / 2.0):
            theta = 2.0 * math.pi * y / L
            v = [1.0 / math.sqrt(L)] + [
                math.sqrt(2.0 / L) * math.cos(n * theta)
                for n in range(1, N + 1)
            ]
            direct = sum(value * value for value in v) - (
                sum(a * b for a, b in zip(d, v)) ** 2 / d_norm_sq
            )
            formula = (
                (2 * N + 1 + dirichlet_kernel(N, 2.0 * theta)) / (2.0 * L)
                - dirichlet_kernel(N, theta) ** 2 / (L * (2 * N + 1))
            )
            self.assertAlmostEqual(direct, formula, places=13)
            self.assertGreaterEqual(formula, -1.0e-14)
        self.assertAlmostEqual(
            (2 * N + 1 + dirichlet_kernel(N, 0.0)) / (2.0 * L)
            - dirichlet_kernel(N, 0.0) ** 2 / (L * (2 * N + 1)),
            0.0,
            places=14,
        )

    def test_note_records_sharp_gate_and_open_schedule(self):
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "largest spherical cap",
            "m_{\\mathcal C}(z)",
            "\\arctan(\\tau_+)+\\theta_0",
            "No information about `Q_-`",
            "rho_A(p)",
            "T_-^{-1}\\mathcal D\\rho",
            "Q=Q_{\\rm pole}-Q_{\\rm arch}-Q_{\\rm prime}",
            "source equation (3.19)",
            "equation (5.2)",
            "No theorem presently in the source lock proves",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)


if __name__ == "__main__":
    unittest.main()
