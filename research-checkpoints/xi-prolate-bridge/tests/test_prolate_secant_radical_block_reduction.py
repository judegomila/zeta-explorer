from __future__ import annotations

from fractions import Fraction
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md"


def dot(left, right):
    return sum((x * y for x, y in zip(left, right)), Fraction(0))


def transpose(matrix):
    return [list(row) for row in zip(*matrix)]


def matmul(left, right):
    right_t = transpose(right)
    return [[dot(row, column) for column in right_t] for row in left]


def matadd(left, right):
    return [
        [x + y for x, y in zip(left_row, right_row)]
        for left_row, right_row in zip(left, right)
    ]


def matsub(left, right):
    return [
        [x - y for x, y in zip(left_row, right_row)]
        for left_row, right_row in zip(left, right)
    ]


def scalar_matrix(value, matrix):
    return [[value * entry for entry in row] for row in matrix]


def identity(size):
    return [
        [Fraction(int(row == column)) for column in range(size)]
        for row in range(size)
    ]


def outer(left, right):
    return [[x * y for y in right] for x in left]


def matvec(matrix, vector):
    return [dot(row, vector) for row in matrix]


def quadratic(vector, matrix):
    return dot(vector, matvec(matrix, vector))


def frobenius_squared(matrix):
    return sum(
        (entry * entry for row in matrix for entry in row), Fraction(0)
    )


def trace(matrix):
    return sum((matrix[index][index] for index in range(len(matrix))), Fraction(0))


class FirstCorrectionTests(unittest.TestCase):
    def test_transform_coefficients_give_transverse_radical(self) -> None:
        # Coefficients are measured after factoring out Xi.  Keep the pi in
        # the formal multiplier: -16*pi*G has rational coefficients.
        g_constant_times_pi = Fraction(-21, 128)
        g_t2_times_pi = Fraction(2, 128)
        minus_16pi_g_constant = -16 * g_constant_times_pi
        minus_16pi_g_t2 = -16 * g_t2_times_pi

        # (m2-21/2)K, with Khat=Xi/4.
        anchor_m2_coefficient = Fraction(1, 4)
        anchor_constant = Fraction(-21, 8)

        self.assertEqual(
            minus_16pi_g_constant + anchor_constant,
            Fraction(0),
        )
        self.assertEqual(minus_16pi_g_t2, Fraction(-1, 4))
        self.assertEqual(anchor_m2_coefficient, Fraction(1, 4))

    def test_secant_limit_has_positive_transverse_sign(self) -> None:
        m2 = 10.0
        coefficient = (2.0 * m2 - 21.0) / (32.0 * math.pi)
        g1 = (coefficient, -1.0 / (16.0 * math.pi))
        expected = 1.0 / (16.0 * math.pi)

        errors = []
        for scale in (1.0e-2, 1.0e-3, 1.0e-4):
            p = (1.0 + scale * g1[0], scale * g1[1])
            norm = math.hypot(*p)
            kappa = (p[0] / norm, p[1] / norm)
            overlap = kappa[0]  # <kappa,z0>, z0=(1,0)
            secant = (1.0 - overlap * kappa[0], -overlap * kappa[1])
            scaled_second = secant[1] / scale
            self.assertGreater(scaled_second, 0.0)
            errors.append(abs(scaled_second - expected))

        self.assertGreater(errors[0], errors[1])
        self.assertGreater(errors[1], errors[2])
        self.assertLess(errors[-1], 2.0e-6)


class ExactSecantIdentityTests(unittest.TestCase):
    def test_scalar_and_orthogonal_residual_identity_exactly(self) -> None:
        shifted_q = [
            [Fraction(0), Fraction(2), Fraction(3)],
            [Fraction(2), Fraction(5), Fraction(0)],
            [Fraction(3), Fraction(0), Fraction(7)],
        ]
        kappa = [Fraction(1), Fraction(0), Fraction(0)]
        omega = [Fraction(0), Fraction(1), Fraction(0)]
        z0 = [Fraction(2), Fraction(3), Fraction(0)]

        alpha = Fraction(2)
        beta = Fraction(3)
        epsilon = quadratic(omega, shifted_q)
        residual = matvec(shifted_q, kappa)
        d = dot(omega, residual)
        d0 = quadratic(z0, shifted_q)
        residual_squared = dot(residual, residual)
        perpendicular_squared = residual[2] ** 2

        self.assertEqual(epsilon, Fraction(5))
        self.assertEqual(d, Fraction(2))
        self.assertEqual(d0, Fraction(69))
        self.assertEqual(
            d0,
            2 * alpha * beta * d + beta * beta * epsilon,
        )

        scalar_ratio = -beta / (2 * alpha) + d0 / (
            2 * alpha * beta * epsilon
        )
        self.assertEqual(scalar_ratio, d / epsilon)
        self.assertEqual(
            residual_squared / (epsilon * epsilon),
            scalar_ratio * scalar_ratio
            + perpendicular_squared / (epsilon * epsilon),
        )

    def test_scalar_secant_data_do_not_control_b_perp(self) -> None:
        records = []
        for hidden in (Fraction(0), Fraction(3), Fraction(100)):
            shifted_q = [
                [Fraction(0), Fraction(2), hidden],
                [Fraction(2), Fraction(5), Fraction(0)],
                [hidden, Fraction(0), Fraction(7)],
            ]
            z0 = [Fraction(2), Fraction(3), Fraction(0)]
            residual = matvec(shifted_q, [Fraction(1), Fraction(0), Fraction(0)])
            records.append(
                (
                    quadratic(z0, shifted_q),
                    shifted_q[1][1],
                    residual[1],
                    dot(residual, residual),
                )
            )

        self.assertEqual([record[:3] for record in records], [(Fraction(69), Fraction(5), Fraction(2))] * 3)
        self.assertEqual(records[0][3], Fraction(4))
        self.assertEqual(records[1][3], Fraction(13))
        self.assertEqual(records[2][3], Fraction(10004))


class TiltedBlockTests(unittest.TestCase):
    def test_tilted_block_pythagoras_with_rational_data(self) -> None:
        # Choose S with a rational square root: S=diag(1/4,1/9,1/16),
        # so r=1 and B=S^(-1)-I=diag(3,8,15).
        b_matrix = [
            [Fraction(3), Fraction(0), Fraction(0)],
            [Fraction(0), Fraction(8), Fraction(0)],
            [Fraction(0), Fraction(0), Fraction(15)],
        ]
        s_matrix = [
            [Fraction(1, 4), Fraction(0), Fraction(0)],
            [Fraction(0), Fraction(1, 9), Fraction(0)],
            [Fraction(0), Fraction(0), Fraction(1, 16)],
        ]
        sqrt_s = [
            [Fraction(1, 2), Fraction(0), Fraction(0)],
            [Fraction(0), Fraction(1, 3), Fraction(0)],
            [Fraction(0), Fraction(0), Fraction(1, 4)],
        ]
        inverse_sqrt_s = [
            [Fraction(2), Fraction(0), Fraction(0)],
            [Fraction(0), Fraction(3), Fraction(0)],
            [Fraction(0), Fraction(0), Fraction(4)],
        ]
        observation = [
            [Fraction(1), Fraction(2), Fraction(3)],
            [Fraction(2), Fraction(-1), Fraction(1)],
        ]
        z = [Fraction(3, 5), Fraction(4, 5), Fraction(0)]
        self.assertEqual(dot(z, z), Fraction(1))

        x_matrix = matmul(observation, sqrt_s)
        tilted = matvec(inverse_sqrt_s, z)
        gram = dot(tilted, tilted)
        projector = scalar_matrix(Fraction(1, 1) / gram, outer(tilted, tilted))
        complement = matsub(identity(3), projector)

        k_z = dot(matvec(observation, z), matvec(observation, z))
        e_z = quadratic(z, b_matrix)
        first_term = k_z / (e_z + 1)
        remainder = frobenius_squared(matmul(x_matrix, complement))
        lhs = frobenius_squared(x_matrix)

        k_matrix = matmul(transpose(observation), observation)
        trace_form = trace(matmul(s_matrix, k_matrix))
        self.assertEqual(gram, 1 + e_z)
        self.assertEqual(lhs, trace_form)
        self.assertEqual(lhs, first_term + remainder)
        self.assertGreater(remainder, 0)

    def test_one_vector_lower_bound_is_strict_when_tilted_tail_remains(self) -> None:
        b_matrix = [
            [Fraction(3), Fraction(0)],
            [Fraction(0), Fraction(8)],
        ]
        s_matrix = [
            [Fraction(1, 4), Fraction(0)],
            [Fraction(0), Fraction(1, 9)],
        ]
        observation = [[Fraction(1), Fraction(1)]]
        z = [Fraction(1), Fraction(0)]
        k_matrix = matmul(transpose(observation), observation)
        lhs = trace(matmul(s_matrix, k_matrix))
        epsilon = quadratic(z, b_matrix)
        k_z = quadratic(z, k_matrix)
        lower = k_z / (epsilon + 1)
        self.assertEqual(lhs, Fraction(13, 36))
        self.assertEqual(lower, Fraction(1, 4))
        self.assertGreater(lhs, lower)


class CounterScalingTests(unittest.TestCase):
    @staticmethod
    def source_cauchy_matrix(length: int):
        epsilon = Fraction(1, 2 ** (length * length))
        unit = epsilon / (length * length)
        indices = (-1, 0, 1)
        displacement = { -1: unit, 0: Fraction(0), 1: -unit }
        diagonal = {
            -1: epsilon + unit,
            0: Fraction(0),
            1: epsilon + unit,
        }
        matrix = []
        for n in indices:
            row = []
            for m in indices:
                if n == m:
                    row.append(diagonal[n])
                else:
                    row.append((displacement[n] - displacement[m]) / (n - m))
            matrix.append(row)
        return indices, displacement, matrix, epsilon, unit

    def test_rational_source_cauchy_and_parity_blocks(self) -> None:
        indices, displacement, matrix, epsilon, unit = self.source_cauchy_matrix(4)
        for row, n in enumerate(indices):
            for column, m in enumerate(indices):
                if n != m:
                    self.assertEqual(
                        (n - m) * matrix[row][column],
                        displacement[n] - displacement[m],
                    )

        # In the normalized parity basis, the even complement diagonal is
        # epsilon, its residual squared is 2*unit^2, and the odd scalar is
        # epsilon+2*unit.
        even_diagonal = (matrix[0][0] + matrix[2][2] + 2 * matrix[0][2]) / 2
        odd_diagonal = (matrix[0][0] + matrix[2][2] - 2 * matrix[0][2]) / 2
        residual_squared = matrix[1][0] ** 2 + matrix[1][2] ** 2
        self.assertEqual(even_diagonal, epsilon)
        self.assertEqual(odd_diagonal, epsilon + 2 * unit)
        self.assertEqual(residual_squared, 2 * unit * unit)
        self.assertGreater(odd_diagonal, 0)

    def test_intrinsic_scale_can_pass_while_old_scale_fails(self) -> None:
        intrinsic_squared = []
        older_squared = []
        for length in (4, 9, 16):
            _, _, _, epsilon, unit = self.source_cauchy_matrix(length)
            ratio_squared = 2 * unit * unit / (epsilon * epsilon)
            self.assertEqual(ratio_squared, Fraction(2, length**4))
            intrinsic_squared.append(Fraction(length**3) * ratio_squared)
            older_squared.append(Fraction(length**5) * ratio_squared)

        self.assertEqual(intrinsic_squared, [Fraction(1, 2), Fraction(2, 9), Fraction(1, 8)])
        self.assertEqual(older_squared, [Fraction(8), Fraction(18), Fraction(32)])
        self.assertGreater(intrinsic_squared[0], intrinsic_squared[-1])
        self.assertLess(older_squared[0], older_squared[-1])


class ClaimDisciplineTests(unittest.TestCase):
    def test_note_preserves_locked_conventions_and_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "e^{-itx}",
            "1<n<=lambda^2",
            "minus sign from",
            "No zero list",
            "not interval or ball",
            "shared the repository's `mpmath`",
            "o(L^{-3/2})",
            "o(L^{-5/2})",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        self.assertIn("reconnaissance only", text)
        self.assertIn("not necessary for the soft trace itself", text)


if __name__ == "__main__":
    unittest.main()
