from __future__ import annotations

from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "PAIRED_EXPONENTIAL_CONSTRAINED_GROUND_REDUCTION.md"


def det2(matrix):
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def quadratic(vector, matrix):
    return sum(
        vector[i] * matrix[i][j] * vector[j]
        for i in range(len(vector))
        for j in range(len(vector))
    )


class PairedExponentialConstrainedGroundTests(unittest.TestCase):
    """Exact rational replay of the finite reduction.

    The two-dimensional model is an algebra check, not an arithmetic source
    matrix.  Its parity blocks are one dimensional, with

        A_+ = 3, A_- = 15, p_+ = 2, p_- = 1.

    """

    def setUp(self) -> None:
        self.a_plus = Fraction(3)
        self.a_minus = Fraction(15)
        self.p_plus = Fraction(2)
        self.p_minus = Fraction(1)
        self.w = (self.p_plus, self.p_minus)
        self.k = (Fraction(1), Fraction(-2))
        self.zeta = Fraction(63, 5)
        self.crossing_load = Fraction(6, 5)

    def test_constrained_ground_and_weyl_zero_are_identical(self) -> None:
        norm_k_squared = quadratic(self.k, ((1, 0), (0, 1)))
        constrained_rayleigh = quadratic(
            self.k,
            ((self.a_plus, 0), (0, self.a_minus)),
        ) / norm_k_squared
        self.assertEqual(constrained_rayleigh, self.zeta)

        f_plus = self.p_plus**2 / (self.a_plus - self.zeta)
        f_minus = self.p_minus**2 / (self.a_minus - self.zeta)
        self.assertEqual(f_plus, Fraction(-5, 12))
        self.assertEqual(f_minus, Fraction(5, 12))
        self.assertEqual(f_plus + f_minus, 0)
        self.assertEqual(Fraction(1, 2) / f_minus, self.crossing_load)

    def test_single_weyl_cofactor_identity(self) -> None:
        for z in (Fraction(0), Fraction(7), Fraction(25, 2)):
            self.assertNotEqual(z, self.a_plus)
            self.assertNotEqual(z, self.a_minus)
            paired = self.p_plus**2 / (self.a_plus - z)
            paired += self.p_minus**2 / (self.a_minus - z)
            determinant_ratio = (
                (self.p_plus**2 + self.p_minus**2) * (self.zeta - z)
                / ((self.a_plus - z) * (self.a_minus - z))
            )
            self.assertEqual(paired, determinant_ratio)

    def test_pole_form_compresses_to_zero_on_exponential_hyperplane(self) -> None:
        pole = (
            (2 * self.p_plus**2, Fraction(0)),
            (Fraction(0), -2 * self.p_minus**2),
        )
        self.assertEqual(self.w[0] * self.k[0] + self.w[1] * self.k[1], 0)
        self.assertEqual(quadratic(self.k, pole), 0)

        pole_times_k = (
            pole[0][0] * self.k[0],
            pole[1][1] * self.k[1],
        )
        alpha = self.p_plus * self.k[0]
        self.assertEqual(pole_times_k, tuple(2 * alpha * x for x in self.w))

    def test_constrained_residual_recovers_crossing_load_without_inverse(self) -> None:
        residual = (
            (self.a_plus - self.zeta) * self.k[0],
            (self.a_minus - self.zeta) * self.k[1],
        )
        gamma = Fraction(-24, 5)
        self.assertEqual(residual, tuple(gamma * x for x in self.w))
        alpha = self.p_plus * self.k[0]
        self.assertEqual(-gamma / (2 * alpha), self.crossing_load)

        loaded_residual = tuple(
            residual[i]
            + self.crossing_load * 2 * alpha * self.w[i]
            for i in range(2)
        )
        self.assertEqual(loaded_residual, (0, 0))

    def test_loaded_sector_grounds_collide_at_constrained_energy(self) -> None:
        z_plus = self.a_plus + 2 * self.crossing_load * self.p_plus**2
        z_minus = self.a_minus - 2 * self.crossing_load * self.p_minus**2
        self.assertEqual(z_plus, self.zeta)
        self.assertEqual(z_minus, self.zeta)

        # At the source load one, s_c>1 puts the even sector strictly lower.
        source_plus = self.a_plus + 2 * self.p_plus**2
        source_minus = self.a_minus - 2 * self.p_minus**2
        self.assertLess(source_plus, source_minus)
        self.assertLess(source_plus, self.zeta)
        self.assertLess(2 * Fraction(5, 12), 1)

    def test_bare_paired_weyl_sign_does_not_identify_the_first_gap(self) -> None:
        # Exact adversarial branch from the independent red-team audit:
        # A_+=diag(0,10), A_-=[1], p_+=(1,0), p_-=1.  The constrained
        # ground is zeta=1/2 and s_c=1/4.  At source load one the even
        # ground has moved to z=2, beyond the odd nonpole pole at 1.
        zeta = Fraction(1, 2)
        source_even_ground = Fraction(2)
        source_odd_ground = Fraction(-1)
        f_plus = Fraction(1, -source_even_ground)
        f_minus = Fraction(1, 1 - source_even_ground)

        self.assertGreater(source_even_ground, zeta)
        self.assertLess(source_odd_ground, source_even_ground)
        self.assertLess(f_plus + f_minus, 0)
        self.assertLess(1 - source_even_ground, 0)

        # The paired sign is therefore a false positive unless the odd
        # nonpole floor condition A_- - z I > 0 is retained.
        self.assertFalse(1 - source_even_ground > 0)

    def test_full_determinant_ratio_is_a_perfect_square(self) -> None:
        base = (self.a_plus - self.zeta) * (self.a_minus - self.zeta)
        for load in (
            Fraction(0),
            Fraction(1, 2),
            Fraction(1),
            self.crossing_load,
            Fraction(3, 2),
        ):
            loaded = (
                self.a_plus + 2 * load * self.p_plus**2 - self.zeta
            ) * (
                self.a_minus - 2 * load * self.p_minus**2 - self.zeta
            )
            self.assertEqual(
                loaded / base,
                (1 - load / self.crossing_load) ** 2,
            )

        # The unlabelled square is positive on both sides and loses orientation.
        below = (1 - Fraction(1) / self.crossing_load) ** 2
        above = (1 - Fraction(7, 5) / self.crossing_load) ** 2
        self.assertGreater(below, 0)
        self.assertGreater(above, 0)

    def test_exact_moments_reconstruct_the_trailing_jacobi_ground(self) -> None:
        norm_w_squared = self.p_plus**2 + self.p_minus**2
        mu_1 = (
            self.p_plus**2 * self.a_plus
            + self.p_minus**2 * self.a_minus
        ) / norm_w_squared
        mu_2 = (
            self.p_plus**2 * self.a_plus**2
            + self.p_minus**2 * self.a_minus**2
        ) / norm_w_squared
        mu_3 = (
            self.p_plus**2 * self.a_plus**3
            + self.p_minus**2 * self.a_minus**3
        ) / norm_w_squared

        alpha_0 = mu_1
        beta_1_squared = mu_2 - mu_1**2
        alpha_1 = (
            mu_3 - 2 * mu_1 * mu_2 + mu_1**3
        ) / beta_1_squared

        self.assertEqual(alpha_0, Fraction(27, 5))
        self.assertEqual(beta_1_squared, Fraction(576, 25))
        self.assertEqual(alpha_1, self.zeta)

        for z in (Fraction(0), Fraction(7), Fraction(25, 2)):
            continued_fraction = 1 / (
                alpha_0 - z - beta_1_squared / (alpha_1 - z)
            )
            direct = (
                self.p_plus**2 / (self.a_plus - z)
                + self.p_minus**2 / (self.a_minus - z)
            ) / norm_w_squared
            self.assertEqual(continued_fraction, direct)

    def test_note_retains_exact_source_conventions_and_claim_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "n<=lambda^2",
            "endpoint is inclusive",
            "minus sign on the prime block",
            "w=p_++p_-",
            "F_+(z)+F_-(z)",
            "load-independent constrained compression",
            "first even/odd ground collision",
            "perfect square",
            "full direct-sum** loaded",
            "unchanged pole-orthogonal sector eigenvalues",
            "one-sided Mellin-zero Poincare constant",
            "continued-fraction target",
            "upper** Ritz bound",
            "exceptional case",
            "missing sign theorem",
            "No finite conclusion is inferred from continuum",
        )
        for phrase in required:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
