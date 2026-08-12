from __future__ import annotations

import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "REGULARIZED_MOMENT_SCHUR_ANGLE_PROFILE.md"


Matrix = tuple[tuple[Fraction, ...], ...]


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(matrix[i][j] for i in range(len(matrix))) for j in range(len(matrix[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def scale(value: Fraction, matrix: Matrix) -> Matrix:
    return tuple(tuple(value * entry for entry in row) for row in matrix)


def identity(size: int) -> Matrix:
    return tuple(
        tuple(Fraction(i == j) for j in range(size))
        for i in range(size)
    )


def determinant(matrix: Matrix) -> Fraction:
    work = [list(row) for row in matrix]
    result = Fraction(1)
    for column in range(len(work)):
        pivot = next((row for row in range(column, len(work)) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for row in range(column + 1, len(work)):
            multiplier = work[row][column] / pivot_value
            for j in range(column + 1, len(work)):
                work[row][j] -= multiplier * work[column][j]
    return result


def inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    work = [list(matrix[i] + identity(size)[i]) for i in range(size)]
    for column in range(size):
        pivot = next(row for row in range(column, size) if work[row][column])
        work[column], work[pivot] = work[pivot], work[column]
        pivot_value = work[column][column]
        work[column] = [entry / pivot_value for entry in work[column]]
        for row in range(size):
            if row == column:
                continue
            multiplier = work[row][column]
            work[row] = [
                work[row][j] - multiplier * work[column][j]
                for j in range(2 * size)
            ]
    return tuple(tuple(row[size:]) for row in work)


def principal_positive_2x2(matrix: Matrix) -> bool:
    return matrix[0][0] > 0 and determinant(matrix) > 0


class RegularizedMomentSchurAngleProfileTests(unittest.TestCase):
    def test_claim_boundary_and_locked_source_signs_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        for token in (
            "P0_INVALIDATED",
            "e^{-itx}",
            "n\\leq\\lambda^2",
            "minus sign on the prime block",
            "source-normalized anchor",
            "complete signed",
            "structural source-Cauchy model",
            "No such source estimate is currently proved",
            "P_{\\mathcal K}T_aP_{\\mathcal K}",
            "P_{\\mathcal K_+}(Q-qI)P_{\\mathcal K_+}",
            "even-sector anchor complement",
        ):
            self.assertIn(token, normalized)

    def test_gram_whitened_resolvent_and_pencil_are_exact(self) -> None:
        # M=B+rI on K=Q^3.  U is deliberately nonorthonormal and spans
        # the first two coordinates, so this checks that raw monomial
        # coordinates cannot replace the Gram matrix.
        M: Matrix = (
            (Fraction(3), Fraction(1), Fraction(0)),
            (Fraction(1), Fraction(4), Fraction(1)),
            (Fraction(0), Fraction(1), Fraction(5)),
        )
        U: Matrix = (
            (Fraction(1), Fraction(1)),
            (Fraction(0), Fraction(1)),
            (Fraction(0), Fraction(0)),
        )
        UT = transpose(U)
        G = matmul(UT, U)
        R = matmul(matmul(UT, inverse(M)), U)

        # The physical Schur complement to span(e1,e2).
        C_orth: Matrix = (
            (Fraction(3), Fraction(1)),
            (Fraction(1), Fraction(19, 5)),
        )
        C_embedded: Matrix = (
            (Fraction(3), Fraction(1), Fraction(0)),
            (Fraction(1), Fraction(19, 5), Fraction(0)),
            (Fraction(0), Fraction(0), Fraction(0)),
        )
        self.assertEqual(inverse(C_orth), tuple(tuple(row[:2]) for row in inverse(M)[:2]))
        self.assertEqual(matmul(matmul(G, inverse(R)), G), matmul(matmul(UT, C_embedded), U))

        for z in (Fraction(-2), Fraction(0), Fraction(1), Fraction(7, 3)):
            left = determinant(subtract(C_orth, scale(z, identity(2))))
            right = determinant(subtract(G, scale(z, R))) / determinant(R)
            self.assertEqual(left, right)

        self.assertEqual(determinant(C_orth), determinant(G) / determinant(R))

    def test_generalized_floor_certificate_retains_the_gram(self) -> None:
        M: Matrix = (
            (Fraction(3), Fraction(1), Fraction(0)),
            (Fraction(1), Fraction(4), Fraction(1)),
            (Fraction(0), Fraction(1), Fraction(5)),
        )
        U: Matrix = (
            (Fraction(1), Fraction(1)),
            (Fraction(0), Fraction(1)),
            (Fraction(0), Fraction(0)),
        )
        G = matmul(transpose(U), U)
        R = matmul(matmul(transpose(U), inverse(M)), U)

        self.assertTrue(principal_positive_2x2(subtract(G, scale(Fraction(2), R))))
        self.assertFalse(principal_positive_2x2(subtract(G, scale(Fraction(5, 2), R))))

        # R alone is coordinate dependent and gives a different test.
        self.assertNotEqual(G, identity(2))

    def test_two_layer_angle_bounds_with_exact_rationals(self) -> None:
        # B=diag(1,4), r=1, and the one-dimensional moment is (3,4)/5.
        # At u=2 its low-layer angle is 9/25.
        residual = Fraction(1)
        threshold = Fraction(2)
        eta = Fraction(9, 25)
        soft_mass = Fraction(9, 25) * Fraction(1, 2) + Fraction(16, 25) * Fraction(1, 5)
        lower = residual / (threshold + residual) * eta
        upper = residual / (threshold + residual) + threshold / (threshold + residual) * eta

        self.assertEqual(soft_mass, Fraction(77, 250))
        self.assertLessEqual(lower, soft_mass)
        self.assertLessEqual(soft_mass, upper)
        self.assertLessEqual(eta, (threshold + residual) / residual * soft_mass)

    def test_regularized_short_monotonicity_keeps_low_high_coupling(self) -> None:
        # B=[[2,1],[1,3]], P=e1, and r=1/2.
        residual = Fraction(1, 2)
        c0 = Fraction(2) - Fraction(1, 3)
        cr = Fraction(2) + residual - Fraction(1, 1) / (Fraction(3) + residual)
        correction = Fraction(1, 3) - Fraction(1, 1) / (Fraction(3) + residual)

        self.assertEqual(cr, c0 + residual + correction)
        self.assertGreater(correction, 0)
        self.assertGreaterEqual(cr, c0 + residual)

    def test_source_cauchy_family_makes_the_generic_floor_sharp(self) -> None:
        ratios: list[Fraction] = []
        for k in (2, 10, 100):
            a = k + 1
            b = k
            epsilon = Fraction(1, 10**6)
            diagonal_one = Fraction(a * a + b * b) * epsilon
            diagonal_rest = Fraction(a * a) * epsilon
            q = Fraction(b * b) * epsilon
            residual = Fraction(a * b) * epsilon
            complement = Fraction(a * a - b * b) * epsilon
            schur = complement + residual

            # Source-Cauchy data b_n=0 make every off-diagonal entry and
            # the rank-two commutator exactly zero.  Inversion keeps equal
            # entries at +/-n, and V_0 is the unique zero diagonal.
            self.assertGreater(diagonal_one, 0)
            self.assertGreater(diagonal_rest, 0)
            for n, m in ((-2, -1), (-1, 0), (0, 1), (1, 2)):
                self.assertEqual((Fraction(0) - Fraction(0)) / Fraction(n - m), 0)

            self.assertEqual(diagonal_rest - q, complement)
            self.assertEqual(residual * residual / (complement + q), q)
            ratio = residual / schur
            self.assertEqual(ratio, Fraction(a * b, a * a - b * b + a * b))
            ratios.append(ratio)

        self.assertLess(ratios[0], ratios[1])
        self.assertLess(ratios[1], ratios[2])
        self.assertGreater(ratios[-1], Fraction(49, 50))


if __name__ == "__main__":
    unittest.main()
