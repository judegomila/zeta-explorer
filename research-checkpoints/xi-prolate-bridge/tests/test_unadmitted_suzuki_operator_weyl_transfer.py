#!/usr/bin/env python3
"""Exact tests for the UNADMITTED Suzuki operator-transfer audit."""

import unittest
from fractions import Fraction as F


def diagonal_resolvent_trace(eigenvalues: tuple[F, ...], z: F) -> F:
    return sum(F(1, 1) / (value - z) for value in eigenvalues)


def diagonal_boundary_resolvent(
    eigenvalues: tuple[F, ...], weights: tuple[F, ...], z: F
) -> F:
    return sum(
        weight / (value - z)
        for value, weight in zip(eigenvalues, weights)
    )


class UnadmittedSuzukiOperatorWeylTransferTests(unittest.TestCase):
    def test_boundary_resolvent_has_exact_nevanlinna_sign(self) -> None:
        eigenvalues = (F(1), F(4), F(9))
        weights = (F(1, 2), F(1, 3), F(1, 6))
        x = F(2)
        y = F(3, 4)
        imaginary_part = sum(
            weight * y / ((value - x) ** 2 + y * y)
            for value, weight in zip(eigenvalues, weights)
        )
        self.assertGreater(imaginary_part, 0)

    def test_zero_mode_removed_congruence_is_exact(self) -> None:
        # D=diag(2,3), G=diag(5,7), K=(D D*)^-1.
        d = (F(2), F(3))
        g = (F(5), F(7))
        k = (F(1, 4), F(1, 9))
        c = F(11, 6)

        a = tuple(dj * gj * dj for dj, gj in zip(d, g))
        shifted_from_s = tuple(
            dj * (gj + c * kj) * dj
            for dj, gj, kj in zip(d, g, k)
        )
        self.assertEqual(a, (F(20), F(63)))
        self.assertEqual(shifted_from_s, tuple(value + c for value in a))

    def test_generalized_resolvent_deshifts_by_argument_translation(self) -> None:
        eigenvalues = (F(1), F(4), F(9))
        weights = (F(1), F(4), F(0))
        c = F(5, 3)
        z = F(2)

        shifted = tuple(value + c for value in eigenvalues)
        self.assertEqual(
            diagonal_boundary_resolvent(shifted, weights, z + c),
            diagonal_boundary_resolvent(eigenvalues, weights, z),
        )
        self.assertEqual(
            diagonal_resolvent_trace(shifted, z + c),
            diagonal_resolvent_trace(eigenvalues, z),
        )

    def test_original_pencil_trace_matches_a_scale_resolvent(self) -> None:
        d = (F(2), F(3))
        g = (F(5), F(7))
        k = (F(1, 4), F(1, 9))
        c = F(4, 3)
        z = F(1)
        pencil_trace = sum(
            kj / (gj + c * kj - (z + c) * kj)
            for gj, kj in zip(g, k)
        )
        a_eigenvalues = tuple(dj * gj * dj for dj, gj in zip(d, g))
        a_trace = diagonal_resolvent_trace(a_eigenvalues, z)
        self.assertEqual(pencil_trace, a_trace)

    def test_basepoint_regularized_transfer_is_exactly_shift_independent(self) -> None:
        eigenvalues = (F(2), F(5), F(11))
        c = F(7, 4)
        z = F(1)
        eta = F(-1)
        shifted = tuple(value + c for value in eigenvalues)

        shifted_regularized = (
            diagonal_resolvent_trace(shifted, z + c)
            - diagonal_resolvent_trace(shifted, eta + c)
        )
        unshifted_regularized = (
            diagonal_resolvent_trace(eigenvalues, z)
            - diagonal_resolvent_trace(eigenvalues, eta)
        )
        self.assertEqual(shifted_regularized, unshifted_regularized)

    def test_boundary_residues_do_not_equal_counting_residues(self) -> None:
        eigenvalues = (F(1), F(4), F(9))
        boundary_weights = (F(1), F(4), F(0))
        counting_weights = (F(1), F(1), F(1))

        self.assertNotEqual(boundary_weights, counting_weights)
        self.assertEqual(sum(boundary_weights), F(5))
        self.assertEqual(sum(counting_weights), F(3))
        self.assertEqual(boundary_weights[2], 0)
        self.assertEqual(counting_weights[2], 1)

        # At a safe point the two rational transfers are visibly different.
        z = F(2)
        self.assertNotEqual(
            diagonal_boundary_resolvent(eigenvalues, boundary_weights, z),
            diagonal_resolvent_trace(eigenvalues, z),
        )

    def test_unit_boundary_vector_cannot_have_unit_weight_at_every_pole(self) -> None:
        # Exact squared spectral components of a unit vector.
        weights = (F(1, 2), F(1, 3), F(1, 6))
        self.assertEqual(sum(weights), 1)
        self.assertTrue(any(weight != 1 for weight in weights))
        self.assertNotEqual(weights, (F(1), F(1), F(1)))
        self.assertLess(sum(weights), F(2))

    def test_trace_is_negative_logarithmic_derivative(self) -> None:
        eigenvalues = (F(1), F(4), F(9))
        z = F(2)
        # p'/p=sum 1/(z-lambda), while q=sum 1/(lambda-z).
        logarithmic_derivative = sum(
            F(1) / (z - value) for value in eigenvalues
        )
        trace_transfer = diagonal_resolvent_trace(eigenvalues, z)
        self.assertEqual(trace_transfer, -logarithmic_derivative)

    def test_resolvent_taylor_coefficients_are_trace_moments(self) -> None:
        eigenvalues = (F(2), F(5), F(8))
        eta = F(0)
        # Coefficient of z^n in q(z)-q(0) is sum lambda^(-n-1).
        for n in range(1, 5):
            coefficient = sum(value ** (-(n + 1)) for value in eigenvalues)
            resolvent_moment = sum(
                (F(1) / (value - eta)) ** (n + 1)
                for value in eigenvalues
            )
            self.assertEqual(coefficient, resolvent_moment)

    def test_metric_extension_spectrum_is_not_a_translation(self) -> None:
        c = F(1)
        unshifted = (F(1), F(3))  # 1/1 and 6/2.
        shifted = (F(1, 2), F(2))  # 1/(1+c) and 6/(2+c).
        translated = tuple(value + c for value in unshifted)
        self.assertNotEqual(shifted, translated)
        self.assertNotEqual(
            shifted[1] - shifted[0],
            unshifted[1] - unshifted[0],
        )


if __name__ == "__main__":
    unittest.main()
