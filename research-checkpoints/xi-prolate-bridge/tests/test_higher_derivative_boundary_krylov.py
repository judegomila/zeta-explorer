from __future__ import annotations

import unittest
from fractions import Fraction as F


Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]
MODES = (-2, -1, 0, 1, 2)


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum(
                (left[i][k] * right[k][j] for k in range(len(right))),
                F(0),
            )
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
    )


def determinant(matrix: Matrix) -> F:
    work = [list(row) for row in matrix]
    value = F(1)
    for column in range(len(work)):
        pivot = next(
            (row for row in range(column, len(work)) if work[row][column]),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            value = -value
        pivot_value = work[column][column]
        value *= pivot_value
        for row in range(column + 1, len(work)):
            factor = work[row][column] / pivot_value
            for entry in range(column, len(work)):
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
        scale = work[column][column]
        work[column] = [entry / scale for entry in work[column]]
        for row in range(size):
            if row == column:
                continue
            factor = work[row][column]
            work[row] = [
                entry - factor * pivot_entry
                for entry, pivot_entry in zip(work[row], work[column])
            ]
    return tuple(tuple(row[size:]) for row in work)


def matrix_power_action(matrix: Matrix, power: int, vector: Vector) -> Vector:
    result = vector
    for _ in range(power):
        result = matvec(matrix, result)
    return result


def pi_times_evaluation_gram() -> Matrix:
    data = (
        (F(1, 4), F(1, 2)),
        (F(3, 2), F(1)),
        (F(5, 2), F(1)),
    )
    rows: list[tuple[F, ...]] = []
    for n in MODES:
        row: list[F] = []
        for k in MODES:
            entry = F(0)
            for height, sine_squared in data:
                entry += 2 * sine_squared * (
                    F(1, (height - n) * (height - k))
                    + F(1, (-height - n) * (-height - k))
                )
            row.append(entry)
        rows.append(tuple(row))
    return tuple(rows)


def cauchy_b_vector() -> Vector:
    data = (
        (F(1, 4), F(1, 2)),
        (F(3, 2), F(1)),
        (F(5, 2), F(1)),
    )
    result: list[F] = []
    for n in MODES:
        value = F(0)
        for height, sine_squared in data:
            value += 2 * sine_squared * (
                F(1, height - n) + F(1, -height - n)
            )
        result.append(value)
    return tuple(result)


def shifted(matrix: Matrix, scalar: F) -> Matrix:
    return tuple(
        tuple(
            entry - (scalar if i == j else F(0))
            for j, entry in enumerate(row)
        )
        for i, row in enumerate(matrix)
    )


class HigherDerivativeBoundaryKrylovTests(unittest.TestCase):
    def setUp(self) -> None:
        self.q_full = pi_times_evaluation_gram()
        self.beta = cauchy_b_vector()
        self.kappa = (F(-3), F(1), F(-1), F(1), F(-3))
        self.q = dot(self.kappa, matvec(self.q_full, self.kappa)) / dot(
            self.kappa, self.kappa
        )
        self.q_odd = tuple(
            tuple(
                self.q_full[MODES.index(n)][MODES.index(k)]
                - self.q_full[MODES.index(n)][MODES.index(-k)]
                for k in (1, 2)
            )
            for n in (1, 2)
        )
        self.a_odd = shifted(self.q_odd, self.q)

    def test_evaluation_gram_is_positive_and_exact_source_cauchy(self) -> None:
        for size in range(1, len(MODES) + 1):
            principal = tuple(
                tuple(self.q_full[i][j] for j in range(size))
                for i in range(size)
            )
            self.assertGreater(determinant(principal), 0)

        for i, n in enumerate(MODES):
            self.assertEqual(self.beta[i], -self.beta[MODES.index(-n)])
            for j, k in enumerate(MODES):
                self.assertEqual(self.q_full[i][j], self.q_full[j][i])
                self.assertEqual(
                    self.q_full[i][j],
                    self.q_full[MODES.index(-n)][MODES.index(-k)],
                )
                if n != k:
                    self.assertEqual(
                        self.q_full[i][j],
                        (self.beta[i] - self.beta[j]) / F(n - k),
                    )

    def test_all_odd_derivative_commutator_formula(self) -> None:
        residual = tuple(
            value - self.q * self.kappa[i]
            for i, value in enumerate(matvec(self.q_full, self.kappa))
        )
        eta = tuple(F(1) for _ in MODES)

        for power in (1, 3, 5):
            derivative_state = tuple(
                F(n**power) * self.kappa[i] for i, n in enumerate(MODES)
            )
            left = tuple(
                value - self.q * derivative_state[i]
                for i, value in enumerate(matvec(self.q_full, derivative_state))
            )
            right = tuple(
                F(n**power) * residual[i] for i, n in enumerate(MODES)
            )

            correction = [F(0) for _ in MODES]
            for r in range(power):
                if r % 2 == 0:
                    scalar = sum(
                        F(n**r) * eta[i] * self.kappa[i]
                        for i, n in enumerate(MODES)
                    )
                    for i, n in enumerate(MODES):
                        correction[i] -= F(n ** (power - 1 - r)) * self.beta[i] * scalar
                else:
                    scalar = sum(
                        F(n**r) * self.beta[i] * self.kappa[i]
                        for i, n in enumerate(MODES)
                    )
                    for i, n in enumerate(MODES):
                        correction[i] += F(n ** (power - 1 - r)) * eta[i] * scalar

            self.assertEqual(
                left,
                tuple(right[i] + correction[i] for i in range(len(MODES))),
            )

    def test_full_derivative_cross_gram_detects_failure(self) -> None:
        self.assertEqual(self.q, F(195904, 11025))
        self.assertEqual(
            self.q_odd,
            (
                (F(36608, 3675), F(-512, 135)),
                (F(-512, 135), F(23552, 1323)),
            ),
        )
        self.assertEqual(
            self.a_odd,
            (
                (F(-17216, 2205), F(-512, 135)),
                (F(-512, 135), F(1088, 33075)),
            ),
        )

        x0 = (F(1), F(-6))
        x1 = (F(1), F(-24))
        synthesis = ((x0[0], x1[0]), (x0[1], x1[1]))
        derivative_gram = matmul(
            transpose(synthesis), matmul(self.a_odd, synthesis)
        )

        self.assertEqual(
            derivative_gram,
            (
                (F(20416, 525), F(135616, 1225)),
                (F(135616, 1225), F(709952, 3675)),
            ),
        )
        self.assertGreater(derivative_gram[0][0], 0)
        self.assertGreater(derivative_gram[1][1], 0)
        self.assertEqual(
            determinant(self.a_odd), F(-3203231744, 218791125)
        )
        self.assertEqual(
            determinant(derivative_gram), F(-12812926976, 2701125)
        )
        self.assertEqual(
            determinant(derivative_gram),
            determinant(synthesis) ** 2 * determinant(self.a_odd),
        )

    def test_boundary_krylov_similarity_and_moment_closure(self) -> None:
        # Rational unnormalised parity coordinates:
        # plus=(V_0,V_1+V_-1,V_2+V_-2),
        # minus=(V_1-V_-1,V_2-V_-2).
        q_plus = (
            (
                self.q_full[2][2],
                2 * self.q_full[2][3],
                2 * self.q_full[2][4],
            ),
            (
                self.q_full[3][2],
                self.q_full[3][3] + self.q_full[3][1],
                self.q_full[3][4] + self.q_full[3][0],
            ),
            (
                self.q_full[4][2],
                self.q_full[4][3] + self.q_full[4][1],
                self.q_full[4][4] + self.q_full[4][0],
            ),
        )
        derivative = ((F(0), F(1), F(0)), (F(0), F(0), F(2)))

        # delta(c_0,c_1,c_2)=c_0+2c_1+2c_2.
        def project_boundary_zero(vector: Vector) -> Vector:
            delta = vector[0] + 2 * vector[1] + 2 * vector[2]
            return (vector[0] - delta, vector[1], vector[2])

        kappa_plus = (F(-1), F(1), F(-3))
        f0 = project_boundary_zero(kappa_plus)
        x = matvec(derivative, f0)
        self.assertEqual(x, (F(1), F(-6)))

        def t_action(vector: Vector) -> Vector:
            shifted_action = tuple(
                value - self.q * vector[i]
                for i, value in enumerate(matvec(q_plus, vector))
            )
            return project_boundary_zero(shifted_action)

        even_chain = f0
        odd_chain = x
        for _ in range(3):
            self.assertEqual(matvec(derivative, even_chain), odd_chain)
            even_chain = t_action(even_chain)
            odd_chain = matvec(self.a_odd, odd_chain)

        moments = tuple(
            dot(x, matrix_power_action(self.a_odd, j, x)) for j in range(4)
        )
        ordinary_gram = ((moments[0], moments[1]), (moments[1], moments[2]))
        energy_gram = ((moments[1], moments[2]), (moments[2], moments[3]))
        self.assertGreater(determinant(ordinary_gram), 0)
        self.assertEqual(
            determinant(energy_gram) / determinant(ordinary_gram),
            determinant(self.a_odd),
        )

        load = dot(x, matvec(inverse(self.a_odd), x))
        g = (moments[0], moments[1])
        reconstructed_load = dot(g, matvec(inverse(energy_gram), g))
        self.assertEqual(reconstructed_load, load)

    def test_coefficient_zero_cauchy_model_misses_bad_complement(self) -> None:
        # Q is positive diagonal, has b_n=0, and hence has exact source
        # Cauchy displacement.  The comparison has q=(1+3)/2=2.
        q = F(2)
        q_odd = ((F(3), F(0)), (F(0), F(3, 2)))
        a_odd = shifted(q_odd, q)
        x = (F(1), F(0))

        for power in range(1, 8, 2):
            derivative = (F(1**power) * x[0], F(2**power) * x[1])
            self.assertGreater(dot(derivative, matvec(a_odd, derivative)), 0)
        self.assertLess(a_odd[1][1], 0)
        self.assertLess(determinant(a_odd), 0)

    def test_cyclic_moments_reconstruct_transverse_inverse_load(self) -> None:
        a_odd = ((F(3), F(1)), (F(1), F(2)))
        x = (F(1), F(1))
        moments = tuple(
            dot(x, matrix_power_action(a_odd, j, x)) for j in range(4)
        )
        self.assertEqual(moments, (F(2), F(7), F(25), F(90)))

        mu0, mu1, mu2, mu3 = moments
        transverse_form = (
            mu3 - 2 * mu1 * mu2 / mu0 + mu1 * mu1 * mu1 / (mu0 * mu0)
        )
        coupling = mu2 - mu1 * mu1 / mu0
        inverse_weighted = coupling * coupling / (mu0 * transverse_form)
        schur = mu1 / mu0 - inverse_weighted

        self.assertEqual(transverse_form, F(3, 4))
        self.assertEqual(coupling, F(1, 2))
        self.assertEqual(inverse_weighted, F(1, 6))
        self.assertEqual(schur, F(10, 3))

        energy_gram = ((mu1, mu2), (mu2, mu3))
        g = (mu0, mu1)
        load = dot(g, matvec(inverse(energy_gram), g))
        self.assertEqual(load, F(3, 5))
        self.assertEqual(mu0 / load, schur)


if __name__ == "__main__":
    unittest.main()
