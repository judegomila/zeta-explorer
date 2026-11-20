#!/usr/bin/env python3
"""Exact algebraic regressions for the UNADMITTED Suzuki shift audit."""

import unittest
from fractions import Fraction as F


def neumann_kernel(a: F, x: F, y: F) -> F:
    return (x * x + y * y) / (4 * a) - abs(x - y) / 2 + a / 6


def polynomial_value(coefficients: tuple[F, ...], z: F) -> F:
    value = F(0)
    for coefficient in reversed(coefficients):
        value = value * z + coefficient
    return value


class UnadmittedSuzukiShiftedMetricTests(unittest.TestCase):
    def test_candidate_g_symbol_fails_even_transform_parity(self) -> None:
        # The functional equation makes M=xi'/xi odd in z.  Therefore
        # L=M/z^2 is odd, while a bilateral transform of real even g would
        # have to be even.  Use a nonzero exact placeholder M(z).
        z = F(3, 2)
        m_at_z = F(11, 5)
        candidate_at_z = m_at_z / (z * z)
        candidate_at_minus_z = -m_at_z / (z * z)
        self.assertEqual(candidate_at_minus_z, -candidate_at_z)
        self.assertNotEqual(candidate_at_minus_z, candidate_at_z)

    def test_nontrivial_zero_coordinate_lies_in_central_strip(self) -> None:
        # If s=beta+i*gamma and s=1/2-i*z, then Im(z)=beta-1/2.
        for beta in (F(1, 10), F(1, 3), F(1, 2), F(9, 10)):
            imaginary_part_of_z = beta - F(1, 2)
            self.assertLess(abs(imaginary_part_of_z), F(1, 2))

    def test_source_shift_has_plus_sign_on_both_scales(self) -> None:
        c = F(7, 3)
        source_lambda = -c
        inverse_laplacian_symbol = F(1, 25)

        self.assertEqual(-source_lambda, c)
        self.assertEqual(
            -source_lambda * inverse_laplacian_symbol,
            c * inverse_laplacian_symbol,
        )

    def test_finite_operator_shift_is_a_derivative_congruence(self) -> None:
        # D=diag(2,3), G=[[1,1/2],[1/2,2]],
        # K=(D D*)^-1=diag(1/4,1/9), and c=5.
        derivative = (F(2), F(3))
        g = ((F(1), F(1, 2)), (F(1, 2), F(2)))
        k = ((F(1, 4), F(0)), (F(0), F(1, 9)))
        c = F(5)
        a = tuple(
            tuple(derivative[i] * g[i][j] * derivative[j] for j in range(2))
            for i in range(2)
        )
        shifted_g = tuple(
            tuple(g[i][j] + c * k[i][j] for j in range(2))
            for i in range(2)
        )
        shifted_through_derivative = tuple(
            tuple(
                derivative[i] * shifted_g[i][j] * derivative[j]
                for j in range(2)
            )
            for i in range(2)
        )
        a_plus_c_identity = (
            (a[0][0] + c, a[0][1]),
            (a[1][0], a[1][1] + c),
        )
        self.assertEqual(shifted_through_derivative, a_plus_c_identity)

    def test_a_and_g_scale_inverse_responses(self) -> None:
        z = F(5, 2)
        logarithmic_derivative = F(11, 7)
        c = F(13, 9)
        g_symbol = logarithmic_derivative / (z * z)

        a_response = 1 / (logarithmic_derivative + c)
        g_response = 1 / (g_symbol + c / (z * z))

        self.assertEqual(1 / a_response - c, logarithmic_derivative)
        self.assertEqual(g_response, z * z * a_response)
        self.assertEqual(1 / g_response - c / (z * z), g_symbol)

    def test_scalar_deshift_is_rejected_in_g_scale(self) -> None:
        z = F(2)
        logarithmic_derivative = F(7, 3)
        c = F(5, 4)
        target = logarithmic_derivative / (z * z)
        response = 1 / (target + c / (z * z))

        wrong = 1 / response - c
        exact_error = c * (1 / (z * z) - 1)
        self.assertEqual(wrong - target, exact_error)
        self.assertEqual(exact_error, F(-15, 16))
        self.assertNotEqual(wrong, target)

    def test_origin_double_principal_part_requires_exact_cancellation(self) -> None:
        # Formally M(z)=k*z+O(z^3), so (M+c)/z^2 has coefficients
        # c*z^-2+k*z^-1.  The G-scale de-shift removes only the first.
        c = F(5, 3)
        k = F(7, 4)
        shifted_principal_part = {-2: c, -1: k}
        correction = {-2: c}
        residual = {
            exponent: shifted_principal_part.get(exponent, F(0))
            - correction.get(exponent, F(0))
            for exponent in (-2, -1)
        }
        self.assertEqual(residual[-2], 0)
        self.assertEqual(residual[-1], k)

    def test_wrong_minus_sign_is_rejected(self) -> None:
        z = F(3)
        g_symbol = F(17, 10)
        c = F(2, 5)
        correct_shifted_symbol = g_symbol + c / (z * z)
        mutated_shifted_symbol = g_symbol - c / (z * z)
        self.assertNotEqual(correct_shifted_symbol, mutated_shifted_symbol)
        self.assertEqual(
            correct_shifted_symbol - mutated_shifted_symbol,
            2 * c / (z * z),
        )

    def test_neumann_kernel_has_a_mean_zero_constant_remainder(self) -> None:
        a = F(2)
        nodes = (F(-1), F(0), F(1))
        weights = (F(1), F(-2), F(1))
        self.assertEqual(sum(weights), 0)

        second_moment = sum(w * y * y for w, y in zip(weights, nodes))
        constant = second_moment / (4 * a)
        for x in (F(-3, 2), F(-1, 3), F(4, 3)):
            finite_action = sum(
                w * neumann_kernel(a, x, y)
                for w, y in zip(weights, nodes)
            )
            convolution_action = -sum(
                w * abs(x - y) / 2 for w, y in zip(weights, nodes)
            )
            self.assertEqual(finite_action, convolution_action + constant)

    def test_scalar_subtraction_cannot_cancel_real_characteristic_poles(self) -> None:
        # W(z)=(z+2)^2(z-3)=z^3+z^2-8z-12.
        w = (F(-12), F(-8), F(1), F(1))
        c = F(9, 5)
        for root in (F(-2), F(3)):
            self.assertEqual(polynomial_value(w, root), 0)
            numerator = 1 - c * polynomial_value(w, root)
            self.assertEqual(numerator, 1)

    def test_reciprocal_normalization_is_not_scale_invariant(self) -> None:
        # The zero set is unchanged by alpha, while 1/W is not.
        w = (F(-6), F(1), F(1))  # (z+3)(z-2)
        z = F(1)
        c = F(4, 7)
        alpha = F(3)
        value = polynomial_value(w, z)
        self.assertNotEqual(value, 0)

        normalized = 1 / value - c
        rescaled = 1 / (alpha * value) - c
        self.assertNotEqual(normalized, rescaled)
        self.assertEqual(rescaled - normalized, (1 / alpha - 1) / value)


if __name__ == "__main__":
    unittest.main()
