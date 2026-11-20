#!/usr/bin/env python3
"""Exact regressions for the even--odd multiplicity/Krylov reduction."""

from __future__ import annotations

from fractions import Fraction
from itertools import permutations
from math import factorial
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "EVEN_ODD_MULTIPLICITY_KRYLOV_SIMPLICITY.md"
F = Fraction

Vector = tuple[Fraction, ...]
Matrix = tuple[tuple[Fraction, ...], ...]
Polynomial = tuple[Fraction, ...]  # ascending powers


def dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def matmul(left: Matrix, right: Matrix) -> Matrix:
    columns = tuple(zip(*right))
    return tuple(tuple(dot(row, tuple(column)) for column in columns) for row in left)


def matrix_subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def diagonal_matrix(diagonal: Vector) -> Matrix:
    return tuple(
        tuple(value if row == column else F(0) for column in range(len(diagonal)))
        for row, value in enumerate(diagonal)
    )


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def determinant(matrix: Matrix) -> Fraction:
    size = len(matrix)
    if size == 0:
        return F(1)
    work = [list(row) for row in matrix]
    out = F(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            out = -out
        pivot_value = work[column][column]
        out *= pivot_value
        for row in range(column + 1, size):
            if work[row][column] == 0:
                continue
            multiplier = work[row][column] / pivot_value
            for entry in range(column + 1, size):
                work[row][entry] -= multiplier * work[column][entry]
    return out


def rank(matrix: Matrix) -> int:
    if not matrix:
        return 0
    work = [list(row) for row in matrix]
    rows = len(work)
    columns = len(work[0])
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        for row in range(rows):
            if row == pivot_row or work[row][column] == 0:
                continue
            multiplier = work[row][column] / pivot_value
            for entry in range(column, columns):
                work[row][entry] -= multiplier * work[pivot_row][entry]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


def columns_to_matrix(columns: tuple[Vector, ...]) -> Matrix:
    return tuple(tuple(column[row] for column in columns) for row in range(len(columns[0])))


def krylov(matrix: Matrix, vector: Vector) -> Matrix:
    columns = [vector]
    for _ in range(1, len(matrix)):
        columns.append(matvec(matrix, columns[-1]))
    return columns_to_matrix(tuple(columns))


def poly_trim(polynomial: Polynomial) -> Polynomial:
    out = list(polynomial)
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return tuple(out)


def poly_add(left: Polynomial, right: Polynomial) -> Polynomial:
    out = [F(0) for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    return poly_trim(tuple(out))


def poly_scale(scale: Fraction, polynomial: Polynomial) -> Polynomial:
    return poly_trim(tuple(scale * value for value in polynomial))


def poly_multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    out = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, x in enumerate(left):
        for j, y in enumerate(right):
            out[i + j] += x * y
    return poly_trim(tuple(out))


def permutation_sign(permutation: tuple[int, ...]) -> int:
    inversions = sum(
        permutation[i] > permutation[j]
        for i in range(len(permutation))
        for j in range(i + 1, len(permutation))
    )
    return -1 if inversions % 2 else 1


def polynomial_determinant(matrix: tuple[tuple[Polynomial, ...], ...]) -> Polynomial:
    size = len(matrix)
    out: Polynomial = (F(0),)
    for permutation in permutations(range(size)):
        term: Polynomial = (F(permutation_sign(permutation)),)
        for row, column in enumerate(permutation):
            term = poly_multiply(term, matrix[row][column])
        out = poly_add(out, term)
    return poly_trim(out)


def characteristic_polynomial(matrix: Matrix) -> Polynomial:
    entries = []
    for row in range(len(matrix)):
        entries.append(
            tuple(
                (matrix[row][column], F(-1))
                if row == column
                else (matrix[row][column],)
                for column in range(len(matrix))
            )
        )
    return polynomial_determinant(tuple(entries))


def boundary_adjugate_polynomial(matrix: Matrix, boundary: Vector) -> Polynomial:
    """Return boundary^T adj(A-zI)e0 by replacing the first row."""
    entries = []
    for row in range(len(matrix)):
        if row == 0:
            entries.append(tuple((value,) for value in boundary))
            continue
        entries.append(
            tuple(
                (matrix[row][column], F(-1))
                if row == column
                else (matrix[row][column],)
                for column in range(len(matrix))
            )
        )
    return polynomial_determinant(tuple(entries))


def resultant(left: Polynomial, right: Polynomial) -> Fraction:
    left = poly_trim(left)
    right = poly_trim(right)
    left_degree = len(left) - 1
    right_degree = len(right) - 1
    size = left_degree + right_degree
    left_descending = tuple(reversed(left))
    right_descending = tuple(reversed(right))
    rows: list[tuple[Fraction, ...]] = []
    for shift in range(right_degree):
        row = [F(0) for _ in range(size)]
        row[shift : shift + left_degree + 1] = left_descending
        rows.append(tuple(row))
    for shift in range(left_degree):
        row = [F(0) for _ in range(size)]
        row[shift : shift + right_degree + 1] = right_descending
        rows.append(tuple(row))
    return determinant(tuple(rows))


def source_cauchy_matrix(
    count: int,
    positive_b: Vector,
    shell_diagonal: Vector,
) -> Matrix:
    modes = tuple(range(-count, count + 1))

    def b(mode: int) -> Fraction:
        if mode == 0:
            return F(0)
        if mode > 0:
            return positive_b[mode - 1]
        return -positive_b[-mode - 1]

    return tuple(
        tuple(
            shell_diagonal[abs(mode)]
            if mode == other
            else (b(mode) - b(other)) / F(mode - other)
            for other in modes
        )
        for mode in modes
    )


def raw_even_vector(count: int, coordinates: Vector) -> Vector:
    out = [F(0) for _ in range(2 * count + 1)]
    out[count] = coordinates[0]
    for shell in range(1, count + 1):
        out[count - shell] = coordinates[shell]
        out[count + shell] = coordinates[shell]
    return tuple(out)


def raw_odd_vector(count: int, coordinates: Vector) -> Vector:
    out = [F(0) for _ in range(2 * count + 1)]
    for shell in range(1, count + 1):
        out[count + shell] = coordinates[shell - 1]
        out[count - shell] = -coordinates[shell - 1]
    return tuple(out)


def even_block_raw_coordinates(matrix: Matrix) -> Matrix:
    count = (len(matrix) - 1) // 2
    columns: list[Vector] = []
    for shell in range(count + 1):
        coordinates = tuple(F(int(index == shell)) for index in range(count + 1))
        image = matvec(matrix, raw_even_vector(count, coordinates))
        columns.append(tuple(image[count + row] for row in range(count + 1)))
    return columns_to_matrix(tuple(columns))


def odd_block_raw_coordinates(matrix: Matrix) -> Matrix:
    count = (len(matrix) - 1) // 2
    columns: list[Vector] = []
    for shell in range(count):
        coordinates = tuple(F(int(index == shell)) for index in range(count))
        image = matvec(matrix, raw_odd_vector(count, coordinates))
        columns.append(tuple(image[count + row] for row in range(1, count + 1)))
    return columns_to_matrix(tuple(columns))


def shifted_diagonal_polynomial(shifts: Vector) -> Polynomial:
    out: Polynomial = (F(1),)
    for value in shifts:
        out = poly_multiply(out, (value, F(1)))
    return out


class EvenOddMultiplicityKrylovSimplicityTests(unittest.TestCase):
    def test_note_retains_claim_and_source_conventions(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        for required in (
            "P0_INVALIDATED",
            "pole minus archimedean minus prime",
            "source equation (3.19)",
            "1<n<=lambda^2",
            r"e^{-izt}",
            "No list of zeta zeros",
            "does not remove",
            "unproved condition",
        ):
            self.assertIn(required, normalized)
        self.assertNotIn("numerical agreement proves", text.lower())

    def test_exact_persistent_multiplicity_and_both_commutator_injections(self) -> None:
        count = 3
        mu = F(5, 7)
        c = F(4, 9)
        positive_b = tuple(c * shell for shell in range(1, count + 1))
        diagonal = tuple(mu + c for _ in range(count + 1))
        matrix = source_cauchy_matrix(count, positive_b, diagonal)
        modes = tuple(range(-count, count + 1))
        mode_matrix = diagonal_matrix(tuple(F(mode) for mode in modes))
        eta = tuple(F(1) for _ in modes)
        beta = tuple(c * mode for mode in modes)

        commutator = matrix_subtract(matmul(mode_matrix, matrix), matmul(matrix, mode_matrix))
        expected = matrix_subtract(outer(beta, eta), outer(eta, beta))
        self.assertEqual(commutator, expected)

        shifted = matrix_subtract(matrix, diagonal_matrix(tuple(mu for _ in modes)))
        self.assertEqual(rank(shifted), 1)

        even = even_block_raw_coordinates(matrix)
        odd = odd_block_raw_coordinates(matrix)
        even_shifted = matrix_subtract(
            even, diagonal_matrix(tuple(mu for _ in range(count + 1)))
        )
        odd_shifted = matrix_subtract(
            odd, diagonal_matrix(tuple(mu for _ in range(count)))
        )
        self.assertEqual(rank(even_shifted), 1)
        self.assertEqual(rank(odd_shifted), 0)
        self.assertEqual((count + 1) - rank(even_shifted), count)
        self.assertEqual(count - rank(odd_shifted), count)

        even_collision = raw_even_vector(count, (F(0), F(1), F(-1), F(0)))
        odd_image = matvec(mode_matrix, even_collision)
        self.assertNotEqual(odd_image, tuple(F(0) for _ in modes))
        self.assertEqual(sum(even_collision, F(0)), 0)
        self.assertEqual(matvec(matrix, even_collision), tuple(mu * x for x in even_collision))
        self.assertEqual(matvec(matrix, odd_image), tuple(mu * x for x in odd_image))

        odd_collision = raw_odd_vector(count, (F(2), F(-1), F(0)))
        self.assertEqual(dot(beta, odd_collision), 0)
        even_image = matvec(mode_matrix, odd_collision)
        self.assertNotEqual(even_image, tuple(F(0) for _ in modes))
        self.assertEqual(matvec(matrix, even_image), tuple(mu * x for x in even_image))

    def test_boundary_resultant_equals_two_krylov_determinants(self) -> None:
        matrix: Matrix = (
            (F(2), F(1), F(0)),
            (F(1), F(4), F(2)),
            (F(0), F(2), F(7)),
        )
        central: Vector = (F(1), F(0), F(0))
        boundary: Vector = (F(1), F(2), F(3))
        p = characteristic_polynomial(matrix)
        q = boundary_adjugate_polynomial(matrix, boundary)
        actual_resultant = resultant(p, q)
        central_krylov = determinant(krylov(matrix, central))
        boundary_krylov = determinant(krylov(matrix, boundary))
        dimension = len(matrix)
        expected_sign = -1 if (dimension * (dimension - 1) // 2) % 2 else 1

        self.assertEqual(central_krylov, F(2))
        self.assertEqual(boundary_krylov, F(68))
        self.assertEqual(
            actual_resultant,
            expected_sign * central_krylov * boundary_krylov,
        )
        self.assertNotEqual(actual_resultant, 0)

    def test_source_beta_cyclicity_determinant_transport(self) -> None:
        count = 3
        positive_b: Vector = (F(2), F(-1), F(5))
        diagonal: Vector = (F(7), F(11), F(13), F(17))
        matrix = source_cauchy_matrix(count, positive_b, diagonal)
        even = even_block_raw_coordinates(matrix)
        odd = odd_block_raw_coordinates(matrix)
        central: Vector = (F(1), F(0), F(0), F(0))
        boundary_functional: Vector = (F(1), F(2), F(2), F(2))
        derivative: Matrix = tuple(
            tuple(
                F(row + 1) if column == row + 1 else F(0)
                for column in range(count + 1)
            )
            for row in range(count)
        )

        left = matrix_subtract(matmul(derivative, even), matmul(odd, derivative))
        right = outer(positive_b, boundary_functional)
        self.assertEqual(left, right)

        even_determinant = determinant(krylov(even, central))
        odd_determinant = determinant(krylov(odd, positive_b))
        self.assertEqual(even_determinant, odd_determinant / factorial(count))
        self.assertNotEqual(even_determinant, 0)
        self.assertEqual(rank(krylov(even, central)), count + 1)
        self.assertEqual(rank(krylov(odd, positive_b)), count)

    def test_true_ground_coefficient_cone_detects_every_nonpositive_shift(self) -> None:
        positive = shifted_diagonal_polynomial((F(2), F(5), F(9)))
        one_negative = shifted_diagonal_polynomial((F(2), F(5), F(-3)))
        two_negative = shifted_diagonal_polynomial((F(2), F(-3), F(-5)))
        singular = shifted_diagonal_polynomial((F(0), F(2), F(5)))

        self.assertTrue(all(coefficient > 0 for coefficient in positive))
        self.assertFalse(all(coefficient > 0 for coefficient in one_negative))
        self.assertFalse(all(coefficient > 0 for coefficient in two_negative))
        self.assertEqual(singular[0], 0)

    def test_n1_source_cauchy_models_realize_all_bottom_orders(self) -> None:
        def even_at_odd(a0: Fraction, a1: Fraction, t: Fraction) -> Fraction:
            odd = a1 - t
            return (a0 - odd) * (a1 + t - odd) - 2 * t * t

        # Positive value plus a positive leading principal minor puts the odd
        # level below both even eigenvalues.
        self.assertEqual(even_at_odd(F(3), F(2), F(1)), F(2))
        self.assertGreater(F(3) - (F(2) - F(1)), 0)

        # Exact collision, although the two even roots a-t and a+2t differ.
        a = F(5)
        t = F(2, 3)
        self.assertEqual(even_at_odd(a, a, t), 0)
        self.assertNotEqual(a - t, a + 2 * t)

        # A negative characteristic value places the odd level between the
        # two even roots, so the even bottom is strictly lower.
        t = F(2, 5)
        a0 = F(1)
        a1 = F(1) + t / 2
        self.assertEqual(even_at_odd(a0, a1, t), -(t * t))

    def test_analytic_structure_alone_does_not_force_nonidentity(self) -> None:
        count = 4
        mu = F(3, 8)
        for c in (F(1, 7), F(5, 3), F(19, 5)):
            with self.subTest(c=c):
                matrix = source_cauchy_matrix(
                    count,
                    tuple(c * shell for shell in range(1, count + 1)),
                    tuple(mu + c for _ in range(count + 1)),
                )
                even = even_block_raw_coordinates(matrix)
                odd = odd_block_raw_coordinates(matrix)
                even_shifted = matrix_subtract(
                    even, diagonal_matrix(tuple(mu for _ in range(count + 1)))
                )
                odd_shifted = matrix_subtract(
                    odd, diagonal_matrix(tuple(mu for _ in range(count)))
                )
                self.assertEqual(rank(even_shifted), 1)
                self.assertEqual(rank(odd_shifted), 0)
                beta = tuple(c * shell for shell in range(1, count + 1))
                self.assertNotEqual(beta, tuple(F(0) for _ in range(count)))
                self.assertEqual(rank(krylov(odd, beta)), 1)


if __name__ == "__main__":
    unittest.main()
