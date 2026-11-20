from __future__ import annotations

import unittest
from fractions import Fraction
from math import factorial


F = Fraction


def matvec(
    matrix: tuple[tuple[Fraction, ...], ...], vector: tuple[Fraction, ...]
):
    return tuple(
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    )


def quadratic(
    matrix: tuple[tuple[Fraction, ...], ...], vector: tuple[Fraction, ...]
):
    image = matvec(matrix, vector)
    return sum((x * y for x, y in zip(vector, image)), F(0))


def radical_projection_model(epsilon: Fraction, rayleigh: Fraction):
    matrix = (
        (rayleigh, -rayleigh / epsilon),
        (-rayleigh / epsilon, rayleigh / (epsilon * epsilon)),
    )
    global_vector = (F(1), epsilon)
    projection = (F(1), F(0))
    remainder = (F(0), epsilon)
    return matrix, global_vector, projection, remainder


def coefficient(d: int, n: int) -> Fraction:
    return F(2 * ((-1) ** (d - n)) * n, factorial(d - n) * factorial(d + n))


class SignedShiftOddFloorObstructionTests(unittest.TestCase):
    def test_off_line_reflected_pairing_is_not_an_absolute_square(self):
        # For real-even kappa, F(conj(s))=conj(F(s)).  The locked term
        # F(s)*conj(F(conj(s))) is therefore z^2, not |z|^2.
        real = F(1, 3)
        imag = F(2, 3)
        signed_square = (real * real - imag * imag, 2 * real * imag)
        absolute_square = (real * real + imag * imag, F(0))

        self.assertNotEqual(signed_square, absolute_square)
        # Adding the conjugate-zero partner gives twice Re(z^2), here negative.
        self.assertLess(2 * signed_square[0], 0)

    def test_paired_sampling_factor_two_keeps_algebraic_multiplicity(self):
        # Each tuple is (algebraic multiplicity, real critical-line sample).
        samples = ((2, F(3, 5)), (1, F(-7, 11)), (4, F(5, 13)))
        signed = sum((m * value * value for m, value in samples), F(0))
        paired = sum(
            (m * (value * value + value * value) for m, value in samples),
            F(0),
        )
        single_slot = sum((m * value * value for m, value in samples), F(0))

        self.assertEqual(paired, 2 * signed)
        self.assertNotEqual(single_slot, paired)

    def test_exact_annihilator_coefficients_and_residue_identity(self):
        for d in range(1, 8):
            coefficients = tuple(coefficient(d, n) for n in range(1, d + 1))
            norm_squared = sum((value * value for value in coefficients), F(0))
            closed_norm = F(
                2 * d * d * factorial(4 * d),
                (4 * d - 1) * factorial(2 * d) ** 4,
            )
            self.assertEqual(norm_squared, closed_norm)

            # Evaluate away from every pole using an exact half-integer.
            z = F(2 * d + 1, 2)
            lhs = sum(
                (
                    coefficients[n - 1] * n / (z * z - n * n)
                    for n in range(1, d + 1)
                ),
                F(0),
            )
            rhs_denominator = F(1)
            for m in range(1, d + 1):
                rhs_denominator *= z * z - m * m
            self.assertEqual(lhs, 1 / rhs_denominator)

            for moment in range(max(0, d - 1)):
                annihilated = sum(
                    (
                        coefficients[n - 1] * n ** (2 * moment + 1)
                        for n in range(1, d + 1)
                    ),
                    F(0),
                )
                self.assertEqual(annihilated, F(0))

    def test_small_projection_error_countermodel(self):
        epsilon = F(1, 17)
        rayleigh = F(1)
        odd_floor = F(1, 10_000)
        matrix, global_vector, projection, remainder = radical_projection_model(
            epsilon, rayleigh
        )

        self.assertEqual(matvec(matrix, global_vector), (F(0), F(0)))
        self.assertEqual(matrix[0][0] * matrix[1][1] - matrix[0][1] ** 2, F(0))
        self.assertGreater(matrix[0][0], 0)
        self.assertGreater(matrix[1][1], 0)
        self.assertEqual(quadratic(matrix, projection), rayleigh)
        self.assertEqual(quadratic(matrix, remainder), rayleigh)
        self.assertEqual(sum((x * x for x in remainder), F(0)), epsilon * epsilon)
        paired_matrix = tuple(tuple(2 * value for value in row) for row in matrix)
        self.assertEqual(matvec(paired_matrix, global_vector), (F(0), F(0)))
        self.assertEqual(quadratic(paired_matrix, projection), 2 * rayleigh)
        self.assertEqual(quadratic(paired_matrix, remainder), 2 * rayleigh)
        self.assertGreater(rayleigh, odd_floor)

    def test_superpolynomial_scale_countermodel_has_wrong_relative_order(self):
        # Algebraic surrogate for t=e^{-L/4}: epsilon=t, q=t^4, mu=t^8.
        t = F(1, 7)
        epsilon = t
        rayleigh = t**4
        odd_floor = t**8
        matrix, global_vector, projection, _ = radical_projection_model(
            epsilon, rayleigh
        )

        self.assertEqual(matvec(matrix, global_vector), (F(0), F(0)))
        self.assertEqual(quadratic(matrix, projection), t**4)
        self.assertGreater(rayleigh, odd_floor)
        # The unique nonzero eigenvalue of this rank-one matrix is its trace.
        self.assertEqual(matrix[0][0] + matrix[1][1], t**4 + t**2)


if __name__ == "__main__":
    unittest.main()
