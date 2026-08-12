from __future__ import annotations

import unittest
from fractions import Fraction


def scaled_half_carrier_transform(coefficients: dict[int, Fraction]) -> Fraction:
    """Return sqrt(2*pi)/2 times the transform at z=1/2, exactly.

    On the locked circle L=2*pi,

      (-1)^n sin((n-1/2)pi) = -1,

    so the scaled transform of mode n is exactly -2/(2*n-1).
    No binary64 transcendental value enters this regression.
    """

    return sum((c * Fraction(-2, 2 * n - 1) for n, c in coefficients.items()), Fraction())


class DerivativeRadicalOddSplitTests(unittest.TestCase):
    def test_distributional_derivative_multiplier_sign_exactly(self) -> None:
        # For K(t)=exp(-|t|), hat(K)(z)=2/(1+z^2).  Directly integrating
        # K' on the two half-lines gives 2*i*z/(1+z^2), so D=alpha/i*d/dt
        # has transform +alpha*z*hat(K).  All displayed values are rational.
        alpha = Fraction(3, 5)
        z = Fraction(2, 7)
        k_hat = Fraction(2, 1) / (1 + z * z)
        d_k_hat_from_half_lines = alpha * Fraction(2) * z / (1 + z * z)
        d_k_hat_from_multiplier = alpha * z * k_hat
        self.assertEqual(d_k_hat_from_half_lines, d_k_hat_from_multiplier)
        self.assertGreater(d_k_hat_from_multiplier, 0)

    def test_boundary_primitive_and_endpoint_sign(self) -> None:
        coefficients = {
            -2: Fraction(3, 7),
            -1: Fraction(-2, 5),
            0: Fraction(1, 3),
            1: Fraction(-2, 5),
            2: Fraction(3, 7),
        }
        d = sum(coefficients.values(), Fraction())
        primitive = dict(coefficients)
        primitive[0] -= d
        derivative = {n: n * c for n, c in coefficients.items()}

        self.assertEqual(sum(primitive.values(), Fraction()), 0)
        self.assertEqual(derivative, {n: n * c for n, c in primitive.items()})

        p_hat = scaled_half_carrier_transform(coefficients)
        f_hat = scaled_half_carrier_transform(primitive)
        x_hat = scaled_half_carrier_transform(derivative)

        # Here L/(2*pi)=1 and z=1/2.  After the common scaling,
        # the endpoint term in (2.4) is exactly -d.
        self.assertEqual(x_hat, Fraction(1, 2) * f_hat)
        self.assertEqual(x_hat, Fraction(1, 2) * p_hat - d)
        self.assertNotEqual(x_hat, Fraction(1, 2) * p_hat)

    def test_boundary_zero_weighting_can_have_negative_split(self) -> None:
        # This is a scalar multiple of e_2^+-sqrt(2)e_0, chosen so all
        # coefficients and every check are exact rationals.
        coefficients = {-2: Fraction(1), 0: Fraction(-2), 2: Fraction(1)}
        derivative = {n: n * c for n, c in coefficients.items()}
        gamma = Fraction(1, 2)

        self.assertEqual(sum(coefficients.values(), Fraction()), 0)
        p_hat = scaled_half_carrier_transform(coefficients)
        x_hat = scaled_half_carrier_transform(derivative)
        self.assertNotEqual(p_hat, 0)
        self.assertEqual(x_hat, gamma * p_hat)

        norm_p_squared = sum((c * c for c in coefficients.values()), Fraction())
        norm_x_squared = sum(
            ((n * c) ** 2 for n, c in coefficients.items()), Fraction()
        )
        ratio = (x_hat * x_hat / norm_x_squared) / (
            p_hat * p_hat / norm_p_squared
        )
        self.assertEqual(norm_p_squared, 6)
        self.assertEqual(norm_x_squared, 8)
        self.assertEqual(ratio, Fraction(3, 16))
        self.assertLess(ratio, 1)

    def test_weighted_constant_endpoint_samples_are_not_square_summable(self) -> None:
        # On L=2*pi and gamma=k+1/2, the exactly scaled value
        # sqrt(L)/2*gamma*hat(e_0)(gamma)=sin(pi*gamma) is +/-1.
        # Its square partial sums therefore grow exactly linearly.
        partial_sums: list[int] = []
        total = 0
        for k in range(1, 33):
            weighted_square = 1
            total += weighted_square
            partial_sums.append(total)
        self.assertEqual(partial_sums, list(range(1, 33)))

    def test_conditional_factor_two_and_derivative_ratio_exactly(self) -> None:
        alpha = Fraction(2, 3)
        gamma = Fraction(5, 2)
        norm_p_squared = Fraction(3)
        norm_x_squared = Fraction(7)
        q = Fraction(11, 13)

        z_p_squared = 2 * norm_p_squared * q
        z_x_squared = (alpha * gamma) ** 2 * z_p_squared
        q_x = z_x_squared / (2 * norm_x_squared)
        expected_ratio = (alpha * gamma) ** 2 * norm_p_squared / norm_x_squared

        self.assertEqual(q_x / q, expected_ratio)
        self.assertEqual(
            q_x - q,
            q * (expected_ratio - 1),
        )

    def test_positive_derivative_rayleigh_does_not_close_schur_gate(self) -> None:
        q = Fraction(1)

        # Positive directional scalar, but the transverse shifted floor fails.
        first = ((Fraction(2), Fraction(0)), (Fraction(0), Fraction(1, 2)))
        a_first = first[0][0] - q
        b_first = first[1][1] - q
        self.assertEqual(a_first, 1)
        self.assertLess(b_first, 0)
        self.assertGreater(first[0][0] * first[1][1] - first[0][1] ** 2, 0)

        # Positive transverse block, but its inverse-weighted coupling is
        # larger than the directional scalar.
        second = ((Fraction(2), Fraction(1)), (Fraction(1), Fraction(3, 2)))
        a_second = second[0][0] - q
        coupling = second[1][0]
        b_second = second[1][1] - q
        schur = a_second - coupling * coupling / b_second
        self.assertEqual(a_second, 1)
        self.assertGreater(b_second, 0)
        self.assertEqual(schur, -1)
        self.assertGreater(second[0][0] * second[1][1] - second[0][1] ** 2, 0)


if __name__ == "__main__":
    unittest.main()
