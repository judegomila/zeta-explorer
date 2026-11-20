from __future__ import annotations

from fractions import Fraction as F
import unittest


Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(matrix[i][j] for i in range(len(matrix))) for j in range(len(matrix[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = transpose(right)
    return tuple(tuple(dot(row, column) for column in right_t) for row in left)


def determinant(matrix: Matrix) -> F:
    work = [list(row) for row in matrix]
    result = F(1)
    size = len(work)
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column]), None)
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        work[column] = [entry / pivot_value for entry in work[column]]
        for row in range(column + 1, size):
            factor = work[row][column]
            work[row] = [
                entry - factor * pivot_entry
                for entry, pivot_entry in zip(work[row], work[column])
            ]
    return result


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
        work[column] = [entry / pivot_value for entry in work[column]]
        for row in range(size):
            if row == column:
                continue
            factor = work[row][column]
            work[row] = [
                entry - factor * pivot_entry
                for entry, pivot_entry in zip(work[row], work[column])
            ]
    return tuple(tuple(row[size:]) for row in work)


def leading_minors(matrix: Matrix) -> tuple[F, ...]:
    return tuple(
        determinant(tuple(tuple(matrix[i][j] for j in range(size)) for i in range(size)))
        for size in range(1, len(matrix) + 1)
    )


def diagonal(values: Vector) -> Matrix:
    return tuple(
        tuple(value if i == j else F(0) for j in range(len(values)))
        for i, value in enumerate(values)
    )


def subtract_shift(form: Matrix, gram_diagonal: Vector, shift: F) -> Matrix:
    return tuple(
        tuple(
            entry - (shift * gram_diagonal[i] if i == j else F(0))
            for j, entry in enumerate(row)
        )
        for i, row in enumerate(form)
    )


def restrict_form(form: Matrix, columns: tuple[Vector, ...]) -> Matrix:
    return tuple(
        tuple(dot(left, matvec(form, right)) for right in columns)
        for left in columns
    )


def source_cauchy_matrix(
    indices: tuple[int, ...],
    a_abs: dict[int, F],
    b: dict[int, F],
) -> Matrix:
    return tuple(
        tuple(
            a_abs[abs(n)] if n == m else (b[n] - b[m]) / F(n - m)
            for m in indices
        )
        for n in indices
    )


def parity_synthesis(indices: tuple[int, ...], odd: bool) -> Matrix:
    n_max = max(indices)
    columns: list[Vector] = []
    if not odd:
        columns.append(tuple(F(int(n == 0)) for n in indices))
    for n in range(1, n_max + 1):
        columns.append(
            tuple(
                F(1) if index == n else F(-1 if odd else 1) if index == -n else F(0)
                for index in indices
            )
        )
    return transpose(tuple(columns))


def gram_from_synthesis(synthesis: Matrix) -> Matrix:
    return matmul(transpose(synthesis), synthesis)


def form_from_synthesis(matrix: Matrix, synthesis: Matrix) -> Matrix:
    return matmul(matmul(transpose(synthesis), matrix), synthesis)


class EvenKrylovRitzEscapeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.indices = tuple(range(-3, 4))
        self.a_abs = {0: F(15), 1: F(9), 2: F(18), 3: F(7)}
        positive_b = {0: F(0), 1: F(1), 2: F(-2), 3: F(6)}
        self.b = {
            n: positive_b[n] if n >= 0 else -positive_b[-n]
            for n in self.indices
        }
        self.q = source_cauchy_matrix(self.indices, self.a_abs, self.b)
        self.s_plus = parity_synthesis(self.indices, odd=False)
        self.s_minus = parity_synthesis(self.indices, odd=True)
        self.g_plus = gram_from_synthesis(self.s_plus)
        self.g_minus = gram_from_synthesis(self.s_minus)
        self.b_plus = form_from_synthesis(self.q, self.s_plus)
        self.b_minus = form_from_synthesis(self.q, self.s_minus)

    def test_source_cauchy_reconstruction_and_displacement(self) -> None:
        position = {n: i for i, n in enumerate(self.indices)}
        for n in self.indices:
            for m in self.indices:
                i = position[n]
                j = position[m]
                self.assertEqual(self.q[i][j], self.q[j][i])
                self.assertEqual(
                    self.q[position[-n]][position[-m]],
                    self.q[i][j],
                )
                if n != m:
                    self.assertEqual(
                        F(n - m) * self.q[i][j],
                        self.b[n] - self.b[m],
                    )

        self.assertEqual(self.g_plus, diagonal((F(1), F(2), F(2), F(2))))
        self.assertEqual(self.g_minus, diagonal((F(2), F(2), F(2))))
        self.assertEqual(
            self.b_plus,
            (
                (F(15), F(2), F(-2), F(4)),
                (F(2), F(20), F(-20, 3), F(17, 2)),
                (F(-2), F(-20, 3), F(34), F(88, 5)),
                (F(4), F(17, 2), F(88, 5), F(18)),
            ),
        )
        self.assertEqual(
            self.b_minus,
            (
                (F(16), F(-16, 3), F(3, 2)),
                (F(-16, 3), F(38), F(72, 5)),
                (F(3, 2), F(72, 5), F(10)),
            ),
        )

    def test_three_vector_ritz_passes_before_cyclic_closure(self) -> None:
        gram_diagonal = (F(1), F(2), F(2), F(2))

        def action(vector: Vector) -> Vector:
            form_action = matvec(self.b_plus, vector)
            return tuple(form_action[i] / gram_diagonal[i] for i in range(4))

        kappa = (F(1), F(0), F(0), F(0))
        krylov = [kappa]
        for _ in range(3):
            krylov.append(action(krylov[-1]))

        self.assertEqual(krylov[1], (F(15), F(1), F(-1), F(2)))
        self.assertEqual(
            krylov[2],
            (F(237), F(221, 6), F(-266, 15), F(869, 20)),
        )
        krylov_matrix = transpose(tuple(krylov))
        self.assertEqual(determinant(krylov_matrix), F(95480647, 72000))

        shifted_two = subtract_shift(self.b_plus, gram_diagonal, F(7))
        two_minors = leading_minors(restrict_form(shifted_two, tuple(krylov[:2])))
        self.assertEqual(two_minors, (F(8), F(112, 15)))

        shifted_three_quarter = subtract_shift(self.b_plus, gram_diagonal, F(1, 4))
        three_quarter_minors = leading_minors(
            restrict_form(shifted_three_quarter, tuple(krylov[:3]))
        )
        self.assertEqual(
            three_quarter_minors,
            (F(59, 4), F(79801, 60), F(-213968474867, 4320000)),
        )

        shifted_three_tenth = subtract_shift(self.b_plus, gram_diagonal, F(1, 10))
        three_tenth_minors = leading_minors(
            restrict_form(shifted_three_tenth, tuple(krylov[:3]))
        )
        self.assertEqual(three_tenth_minors[-1], F(223917156293, 2160000))
        self.assertTrue(all(value > 0 for value in three_tenth_minors))

        full_tenth_minors = leading_minors(shifted_three_tenth)
        self.assertTrue(all(value > 0 for value in full_tenth_minors[:3]))
        self.assertEqual(full_tenth_minors[-1], F(-86907833, 45000))

        complement_third = tuple(
            tuple(entry for entry in row[1:])
            for row in subtract_shift(self.b_plus, gram_diagonal, F(1, 3))[1:]
        )
        self.assertEqual(
            leading_minors(complement_third),
            (F(58, 3), F(600), F(623, 75)),
        )

        odd_gram = (F(2), F(2), F(2))
        odd_one = leading_minors(subtract_shift(self.b_minus, odd_gram, F(1)))
        self.assertEqual(odd_one, (F(14), F(4280, 9), F(132751, 225)))
        odd_three_halves = leading_minors(
            subtract_shift(self.b_minus, odd_gram, F(3, 2))
        )
        self.assertEqual(
            odd_three_halves,
            (F(13), F(3839, 9), F(-17047, 900)),
        )

        # These exact inertia checks prove
        # mu_+ < 1/10 < U_3 < 1/4 < 1/3 < alpha,
        # and U_3 < 1 < omega < 3/2 < 7 < U_2.
        self.assertLess(full_tenth_minors[-1], 0)
        self.assertGreater(three_tenth_minors[-1], 0)
        self.assertLess(three_quarter_minors[-1], 0)
        self.assertTrue(all(value > 0 for value in leading_minors(complement_third)))
        self.assertTrue(all(value > 0 for value in odd_one))
        self.assertLess(odd_three_halves[-1], 0)
        self.assertTrue(all(value > 0 for value in two_minors))

    def test_hankel_moment_pencil_is_reconstructed_from_combined_actions(self) -> None:
        gram_diagonal = (F(1), F(2), F(2), F(2))
        gram = diagonal(gram_diagonal)

        def action(vector: Vector) -> Vector:
            form_action = matvec(self.b_plus, vector)
            return tuple(form_action[i] / gram_diagonal[i] for i in range(4))

        kappa = (F(1), F(0), F(0), F(0))
        powers = [kappa]
        for _ in range(5):
            powers.append(action(powers[-1]))
        moments = tuple(dot(kappa, matvec(gram, vector)) for vector in powers)
        self.assertEqual(
            moments,
            (
                F(1),
                F(15),
                F(237),
                F(57569, 15),
                F(22783369, 360),
                F(3568210181, 3375),
            ),
        )

        synthesis = tuple(powers[:3])
        gram_pencil = restrict_form(gram, synthesis)
        form_pencil = restrict_form(self.b_plus, synthesis)
        self.assertEqual(
            gram_pencil,
            tuple(tuple(moments[i + j] for j in range(3)) for i in range(3)),
        )
        self.assertEqual(
            form_pencil,
            tuple(tuple(moments[i + j + 1] for j in range(3)) for i in range(3)),
        )

    def test_feshbach_determinant_uses_the_complement_resolvent(self) -> None:
        shift = F(1, 10)
        gram_diagonal = (F(1), F(2), F(2), F(2))
        shifted = subtract_shift(self.b_plus, gram_diagonal, shift)
        complement = tuple(tuple(entry for entry in row[1:]) for row in shifted[1:])
        coupling = tuple(self.b_plus[i][0] for i in range(1, 4))
        solved = matvec(inverse(complement), coupling)
        schur = self.b_plus[0][0] - shift - dot(coupling, solved)
        self.assertEqual(determinant(shifted), determinant(complement) * schur)
        self.assertLess(schur, 0)

    def test_complete_krylov_moments_are_blind_to_a_reducing_complement(self) -> None:
        # In normalized parity coordinates, kappa has equal weight on the
        # diagonal eigenvalues 2 and 4 and no component in the c direction.
        moments_c_five = tuple((F(2) ** j + F(4) ** j) / 2 for j in range(16))
        moments_c_one = tuple((F(2) ** j + F(4) ** j) / 2 for j in range(16))
        self.assertEqual(moments_c_five, moments_c_one)

        krylov_floor = F(2)
        alpha_c_five = min(F(3), F(5))
        omega_c_five = min(F(4), F(5))
        alpha_c_one = min(F(3), F(1))
        omega_c_one = min(F(4), F(1))
        self.assertGreater(alpha_c_five, krylov_floor)
        self.assertGreater(omega_c_five, krylov_floor)
        self.assertLess(alpha_c_one, krylov_floor)
        self.assertLess(omega_c_one, krylov_floor)

        # b_n=0 makes both diagonal families exact source-Cauchy matrices:
        # every off-diagonal entry and the rank-two displacement vanish.
        indices = tuple(range(-2, 3))
        zero_b = {n: F(0) for n in indices}
        for c in (F(5), F(1)):
            matrix = source_cauchy_matrix(
                indices,
                {0: F(2), 1: F(4), 2: c},
                zero_b,
            )
            for i, n in enumerate(indices):
                for j, m in enumerate(indices):
                    if n != m:
                        self.assertEqual(matrix[i][j], 0)

    def test_blockwise_power_regression_rejects_lost_cancellation(self) -> None:
        pole: Matrix = ((F(2), F(1)), (F(1), F(0)))
        arch: Matrix = ((F(-1), F(2)), (F(2), F(0)))
        prime: Matrix = ((F(1), F(3)), (F(3), F(0)))
        combined = tuple(
            tuple(pole[i][j] + arch[i][j] - prime[i][j] for j in range(2))
            for i in range(2)
        )
        self.assertEqual(combined, ((F(0), F(0)), (F(0), F(0))))

        kappa = (F(1), F(0))
        combined_residual = matvec(combined, kappa)
        separate_residuals = (
            matvec(pole, kappa),
            matvec(arch, kappa),
            matvec(prime, kappa),
        )
        self.assertEqual(combined_residual, (F(0), F(0)))
        self.assertEqual(
            sum((residual[1] ** 2 for residual in separate_residuals), F(0)),
            F(14),
        )
        self.assertNotEqual(
            dot(kappa, matvec(matmul(pole, pole), kappa))
            + dot(kappa, matvec(matmul(arch, arch), kappa))
            + dot(kappa, matvec(matmul(prime, prime), kappa)),
            dot(kappa, matvec(matmul(combined, combined), kappa)),
        )


if __name__ == "__main__":
    unittest.main()
