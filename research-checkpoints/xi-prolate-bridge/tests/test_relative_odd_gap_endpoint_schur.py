from __future__ import annotations

import unittest
from fractions import Fraction


F = Fraction
Matrix = tuple[tuple[Fraction, ...], ...]
Vector = tuple[Fraction, ...]


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
    )


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum((left[i][k] * right[k][j] for k in range(len(right))), F(0))
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum((row[j] * vector[j] for j in range(len(vector))), F(0))
        for row in matrix
    )


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def shift(matrix: Matrix, scalar: Fraction) -> Matrix:
    return tuple(
        tuple(matrix[i][j] - (scalar if i == j else F(0)) for j in range(len(matrix)))
        for i in range(len(matrix))
    )


def determinant(matrix: Matrix) -> Fraction:
    size = len(matrix)
    work = [list(row) for row in matrix]
    value = F(1)
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column]), None)
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            value = -value
        pivot_value = work[column][column]
        value *= pivot_value
        for row in range(column + 1, size):
            factor = work[row][column] / pivot_value
            for entry in range(column, size):
                work[row][entry] -= factor * work[column][entry]
    return value


def inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    work = [
        list(row) + [F(int(i == j)) for j in range(size)]
        for i, row in enumerate(matrix)
    ]
    for column in range(size):
        pivot = next(row for row in range(column, size) if work[row][column])
        work[column], work[pivot] = work[pivot], work[column]
        pivot_value = work[column][column]
        work[column] = [value / pivot_value for value in work[column]]
        for row in range(size):
            if row == column:
                continue
            factor = work[row][column]
            work[row] = [
                value - factor * pivot_entry
                for value, pivot_entry in zip(work[row], work[column])
            ]
    return tuple(tuple(row[size:]) for row in work)


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), F(0))


def source_cauchy_matrix_n1(a0: Fraction, a1: Fraction, b1: Fraction) -> Matrix:
    modes = (-1, 0, 1)
    diagonal = {-1: a1, 0: a0, 1: a1}
    b = {-1: -b1, 0: F(0), 1: b1}
    return tuple(
        tuple(
            diagonal[n]
            if n == m
            else (b[n] - b[m]) / F(n - m)
            for m in modes
        )
        for n in modes
    )


class RelativeOddGapEndpointSchurTests(unittest.TestCase):
    def test_exact_boundary_pullback_characteristic_ratio_and_schur_gate(self) -> None:
        # Unnormalized parity coordinates:
        # plus=(V_0,V_1+V_-1,V_2+V_-2),
        # minus=(V_1-V_-1,V_2-V_-2).
        q_plus = (
            (F(0), F(2), F(2)),
            (F(1), F(4), F(2)),
            (F(1), F(2), F(6)),
        )
        q_minus = ((F(2), F(0)), (F(0), F(4)))
        derivative = ((F(0), F(1), F(0)), (F(0), F(0), F(2)))
        boundary = (F(1), F(2), F(2))
        beta = (F(1), F(2))

        self.assertEqual(
            subtract(matmul(derivative, q_plus), matmul(q_minus, derivative)),
            outer(beta, boundary),
        )

        primitive = (
            (F(-2), F(-1)),
            (F(1), F(0)),
            (F(0), F(1, 2)),
        )
        self.assertEqual(
            matmul(derivative, primitive),
            ((F(1), F(0)), (F(0), F(1))),
        )
        self.assertEqual(matmul((boundary,), primitive), ((F(0), F(0)),))
        self.assertEqual(matmul(matmul(derivative, q_plus), primitive), q_minus)

        e0 = ((F(1),), (F(0),), (F(0),))
        for z in (F(1, 3), F(7, 2)):
            even_shift = shift(q_plus, z)
            odd_shift = shift(q_minus, z)
            boundary_resolvent = matmul(
                matmul((boundary,), inverse(even_shift)),
                e0,
            )[0][0]
            self.assertEqual(
                determinant(odd_shift),
                determinant(even_shift) * boundary_resolvent,
            )

        kappa = (F(1), F(1, 10), F(1, 20))
        plus_gram_weights = (F(1), F(2), F(2))
        qk = matvec(q_plus, kappa)
        norm_squared = sum(w * x * x for w, x in zip(plus_gram_weights, kappa))
        rayleigh = sum(
            w * x * y for w, x, y in zip(plus_gram_weights, kappa, qk)
        ) / norm_squared
        self.assertEqual(rayleigh, F(30, 41))

        residual = tuple(value - rayleigh * kappa[i] for i, value in enumerate(qk))
        boundary_value = dot(boundary, kappa)
        x = matvec(derivative, kappa)
        combined = tuple(
            value - boundary_value * beta[i]
            for i, value in enumerate(matvec(derivative, residual))
        )
        odd_action = matvec(shift(q_minus, rayleigh), x)
        self.assertEqual(combined, odd_action)

        transverse = (-x[1], x[0])
        odd_shift = shift(q_minus, rayleigh)
        a = dot(x, matvec(odd_shift, x))
        b = dot(transverse, matvec(odd_shift, transverse))
        c = dot(x, matvec(odd_shift, transverse))
        schur_numerator = a - c * c / b
        self.assertEqual((a, b, c), (F(93, 2050), F(93, 2050), F(1, 50)))
        self.assertEqual(schur_numerator, F(3484, 95325))
        self.assertGreater(schur_numerator, 0)

        common_norm = dot(x, x)
        self.assertEqual(
            determinant(odd_shift),
            (a * b - c * c) / (common_norm * common_norm),
        )

    def test_positive_source_cauchy_models_reject_abstract_shortcuts(self) -> None:
        mode_operator = (
            (F(-1), F(0), F(0)),
            (F(0), F(0), F(0)),
            (F(0), F(0), F(1)),
        )
        eta = (F(1), F(1), F(1))

        # Positive definite, but the odd eigenvalue 1 is below the two even
        # eigenvalues 3 +/- sqrt(2).
        q_noninterlacing = source_cauchy_matrix_n1(F(3), F(2), F(1))
        b_vector = (F(-1), F(0), F(1))
        self.assertEqual(
            subtract(
                matmul(mode_operator, q_noninterlacing),
                matmul(q_noninterlacing, mode_operator),
            ),
            subtract(outer(b_vector, eta), outer(eta, b_vector)),
        )
        self.assertEqual(determinant(q_noninterlacing), F(7))
        even_characteristic_at_odd = (F(3) - F(1)) ** 2 - F(2)
        self.assertEqual(even_characteristic_at_odd, F(2))
        self.assertGreater(even_characteristic_at_odd, 0)

        # The global ground is now even and the parity spectra interlace, but
        # the selected Rayleigh value q=1 is still above the odd floor.
        t = F(1, 100)
        a0 = F(1)
        a1 = F(1) + t / 2
        q_even_ground = source_cauchy_matrix_n1(a0, a1, t)
        b_vector = (-t, F(0), t)
        self.assertEqual(
            subtract(
                matmul(mode_operator, q_even_ground),
                matmul(q_even_ground, mode_operator),
            ),
            subtract(outer(b_vector, eta), outer(eta, b_vector)),
        )

        odd_floor = a1 - t
        self.assertEqual(odd_floor, F(199, 200))
        self.assertGreater(a0, odd_floor)

        # Normalized even block is [[a0,sqrt(2)t],[sqrt(2)t,a1+t]].
        # Its characteristic polynomial is rational despite the basis square root.
        even_characteristic_at_odd = (
            (a0 - odd_floor) * (a1 + t - odd_floor) - 2 * t * t
        )
        self.assertEqual(even_characteristic_at_odd, -t * t)
        self.assertLess(even_characteristic_at_odd, 0)
        self.assertGreater(a0 * (a1 + t) - 2 * t * t, 0)

        rayleigh_e0 = a0
        residual_norm_squared = 2 * t * t
        self.assertEqual(rayleigh_e0, F(1))
        self.assertEqual(residual_norm_squared, F(1, 5000))
        self.assertGreater(rayleigh_e0, odd_floor)


if __name__ == "__main__":
    unittest.main()
