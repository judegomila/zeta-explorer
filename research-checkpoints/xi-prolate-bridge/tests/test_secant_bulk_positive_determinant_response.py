from __future__ import annotations

from fractions import Fraction
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SECANT_BULK_POSITIVE_DETERMINANT_RESPONSE.md"

Matrix = tuple[tuple[Fraction, ...], ...]
Vector = tuple[Fraction, ...]


def identity(size: int) -> Matrix:
    return tuple(
        tuple(Fraction(row == column) for column in range(size))
        for row in range(size)
    )


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(row) for row in zip(*matrix))


def dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), Fraction(0))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = transpose(right)
    return tuple(
        tuple(dot(left_row, right_column) for right_column in right_t)
        for left_row in left
    )


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x + y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def scale(scalar: Fraction, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * entry for entry in row) for row in matrix)


def trace(matrix: Matrix) -> Fraction:
    return sum((matrix[index][index] for index in range(len(matrix))), Fraction(0))


def determinant(matrix: Matrix) -> Fraction:
    size = len(matrix)
    work = [list(row) for row in matrix]
    result = Fraction(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for row in range(column + 1, size):
            multiplier = work[row][column] / pivot_value
            for index in range(column + 1, size):
                work[row][index] -= multiplier * work[column][index]
    return result


def inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    unit = identity(size)
    work = [list(matrix[row] + unit[row]) for row in range(size)]
    for column in range(size):
        pivot = next(
            row for row in range(column, size) if work[row][column] != 0
        )
        work[column], work[pivot] = work[pivot], work[column]
        pivot_value = work[column][column]
        work[column] = [entry / pivot_value for entry in work[column]]
        for row in range(size):
            if row == column:
                continue
            multiplier = work[row][column]
            work[row] = [
                work[row][index] - multiplier * work[column][index]
                for index in range(2 * size)
            ]
    return tuple(tuple(row[size:]) for row in work)


def diagonal(*entries: Fraction) -> Matrix:
    return tuple(
        tuple(entry if row == column else Fraction(0) for column, entry in enumerate(entries))
        for row in range(len(entries))
    )


def as_mpf(value: Fraction) -> mp.mpf:
    return mp.mpf(value.numerator) / value.denominator


class PositiveDeterminantIncrementTests(unittest.TestCase):
    def setUp(self) -> None:
        # D=B+rI with r=1.  K is the rank-one orthogonal projection onto
        # (1,1,0)/sqrt(2), so all contraction assertions are exact.
        self.d: Matrix = (
            (Fraction(3), Fraction(1), Fraction(0)),
            (Fraction(1), Fraction(4), Fraction(1)),
            (Fraction(0), Fraction(1), Fraction(5)),
        )
        self.k: Matrix = (
            (Fraction(1, 2), Fraction(1, 2), Fraction(0)),
            (Fraction(1, 2), Fraction(1, 2), Fraction(0)),
            (Fraction(0), Fraction(0), Fraction(0)),
        )
        self.d_f: Matrix = (
            (Fraction(4), Fraction(1)),
            (Fraction(1), Fraction(5)),
        )
        self.k_f: Matrix = (
            (Fraction(1, 2), Fraction(0)),
            (Fraction(0), Fraction(0)),
        )

    def test_exact_feshbach_determinant_split(self) -> None:
        d_one = add(self.d, self.k)
        d_f_one = add(self.d_f, self.k_f)

        det_d = determinant(self.d)
        det_d_one = determinant(d_one)
        det_f = determinant(self.d_f)
        det_f_one = determinant(d_f_one)
        delta_zero = det_d / det_f
        delta_one = det_d_one / det_f_one

        self.assertEqual(det_d, Fraction(52))
        self.assertEqual(det_d_one, Fraction(64))
        self.assertEqual(det_f, Fraction(19))
        self.assertEqual(det_f_one, Fraction(43, 2))
        self.assertEqual(delta_zero, Fraction(52, 19))
        self.assertEqual(delta_one, Fraction(128, 43))

        full_ratio = det_d_one / det_d
        bulk_ratio = det_f_one / det_f
        graph_ratio = delta_one / delta_zero
        self.assertEqual(full_ratio, Fraction(16, 13))
        self.assertEqual(bulk_ratio, Fraction(43, 38))
        self.assertEqual(graph_ratio, Fraction(608, 559))
        self.assertEqual(full_ratio, bulk_ratio * graph_ratio)

    def test_sharp_log_increment_inequalities(self) -> None:
        mp.mp.dps = 80
        full_soft = trace(matmul(inverse(self.d), self.k))
        bulk_soft = trace(matmul(inverse(self.d_f), self.k_f))
        graph_soft = full_soft - bulk_soft

        self.assertEqual(full_soft, Fraction(3, 13))
        self.assertEqual(bulk_soft, Fraction(5, 38))
        self.assertEqual(graph_soft, Fraction(49, 494))

        full_increment = mp.log(mp.mpf(16) / 13)
        bulk_increment = mp.log(mp.mpf(43) / 38)
        graph_increment = mp.log(mp.mpf(608) / 559)
        self.assertLess(abs(full_increment - bulk_increment - graph_increment), mp.mpf("1e-75"))

        log_two = mp.log(2)
        self.assertLessEqual(bulk_increment, as_mpf(bulk_soft))
        self.assertLessEqual(as_mpf(bulk_soft), bulk_increment / log_two)
        self.assertLessEqual(full_increment, as_mpf(full_soft))
        self.assertLessEqual(as_mpf(full_soft), full_increment / log_two)

        graph_lower = mp.e**graph_increment - 1
        graph_upper = 2 * (1 - mp.e ** (-graph_increment))
        self.assertLessEqual(graph_lower, as_mpf(graph_soft))
        self.assertLessEqual(as_mpf(graph_soft), graph_upper)
        self.assertEqual(Fraction(49, 559), Fraction(608 - 559, 559))
        self.assertEqual(Fraction(49, 304), 2 * Fraction(608 - 559, 608))


class SourceCauchyFactorTests(unittest.TestCase):
    def test_two_schur_factors_and_boundary_factor_are_exact(self) -> None:
        # N=2 diagonal source-Cauchy model.  The even diagonal is
        # (0,2,5), the odd diagonal is (2,5), and the positive-contraction
        # homotopy has even diagonal (1,1/2,1/3).  Its displacement vector
        # is zero, but the complete source determinant identity is exact.
        q = Fraction(18, 25)
        ridge = Fraction(24, 25)
        ritz_shift = Fraction(0)
        self.assertLess(ritz_shift, q)
        z = ritz_shift - ridge
        self.assertEqual(z, Fraction(-24, 25))

        kappa: Vector = (Fraction(4, 5), Fraction(3, 5), Fraction(0))
        omega: Vector = (Fraction(-3, 5), Fraction(4, 5), Fraction(0))
        far: Vector = (Fraction(0), Fraction(0), Fraction(1))
        rotation: Matrix = tuple(tuple(column[row] for column in (kappa, omega, far)) for row in range(3))

        source_q = diagonal(Fraction(0), Fraction(2), Fraction(5))
        source_k = diagonal(Fraction(1), Fraction(1, 2), Fraction(1, 3))

        factors = []
        for s in (Fraction(0), ridge):
            a_source = add(
                add(source_q, scale(-z, identity(3))),
                scale(s, source_k),
            )
            odd = diagonal(
                Fraction(2) - z + s * Fraction(1, 2),
                Fraction(5) - z + s * Fraction(1, 3),
            )
            a_rotated = matmul(matmul(transpose(rotation), a_source), rotation)
            d = tuple(tuple(a_rotated[row][column] for column in (1, 2)) for row in (1, 2))
            d_f = ((d[1][1],),)

            sigma = a_rotated[0][0] - (
                dot(
                    (a_rotated[1][0], a_rotated[2][0]),
                    matvec(inverse(d), (a_rotated[1][0], a_rotated[2][0])),
                )
            )
            delta = d[0][0] - d[0][1] * d[1][0] / d[1][1]
            boundary_m = Fraction(1, 1) / a_source[0][0]

            self.assertGreater(sigma, 0)
            self.assertGreater(delta, 0)
            self.assertGreater(boundary_m, 0)
            self.assertEqual(determinant(a_source), determinant(d) * sigma)
            self.assertEqual(determinant(d), determinant(d_f) * delta)
            self.assertEqual(determinant(odd), determinant(a_source) * boundary_m)
            self.assertEqual(
                determinant(odd),
                determinant(d_f) * delta * sigma * boundary_m,
            )
            factors.append((odd, d_f, sigma, delta, boundary_m))

        odd_zero, d_f_zero, sigma_zero, delta_zero, m_zero = factors[0]
        odd_one, d_f_one, sigma_one, delta_one, m_one = factors[1]
        direct_ratio = determinant(d_f_one) / determinant(d_f_zero)
        response_ratio = (
            determinant(odd_one)
            / determinant(odd_zero)
            * (m_zero * sigma_zero * delta_zero)
            / (m_one * sigma_one * delta_one)
        )
        self.assertEqual(direct_ratio, Fraction(157, 149))
        self.assertEqual(direct_ratio, response_ratio)

        # The direct bulk trace is r*(1/3)/(149/25)=8/149, and the
        # determinant increment has ratio 1+8/149, as it must for this
        # one-dimensional deflated block at theta=1.
        self.assertEqual(ridge * Fraction(1, 3) / d_f_zero[0][0], Fraction(8, 149))
        self.assertEqual(direct_ratio, 1 + Fraction(8, 149))


class RitzShiftScopeRegressionTests(unittest.TestCase):
    def test_extra_q_minus_u_term_rejects_false_self_regularized_transfer(self) -> None:
        # The whole even space is the mandatory two-vector Ritz space.
        # Q_+ has eigenvalues -1 and 3, so U=-1 is the exact Ritz upper
        # bound (indeed the exact ground value).  The odd block 0 is
        # strictly above U.  All data are exact rationals.
        q_plus: Matrix = (
            (Fraction(1), Fraction(2)),
            (Fraction(2), Fraction(1)),
        )
        kappa: Vector = (Fraction(1), Fraction(0))
        ground: Vector = (Fraction(1), Fraction(-1))
        ritz_shift = Fraction(-1)
        ground_value = Fraction(-1)
        odd_value = Fraction(0)

        self.assertEqual(matvec(q_plus, ground), tuple(ground_value * x for x in ground))
        self.assertEqual(determinant(add(q_plus, scale(-ritz_shift, identity(2)))), 0)
        self.assertGreater(odd_value - ritz_shift, 0)

        q = Fraction(1)
        residual = Fraction(2)
        ridge = abs(residual)
        d = q - ritz_shift
        b_u = Fraction(1) - ritz_shift
        h_u = ritz_shift - ground_value
        correction = residual / (b_u + h_u)
        feshbach_energy = residual * residual / (b_u + h_u)

        self.assertEqual(d, Fraction(2))
        self.assertEqual(b_u, Fraction(2))
        self.assertGreater(b_u, 0)
        self.assertEqual(h_u, 0)
        self.assertEqual(feshbach_energy, d + h_u)
        self.assertNotEqual(feshbach_energy, h_u)

        # K=1 on the one-dimensional complement.  The false arbitrary-U
        # transplant of the q-shift theorem would bound |z|^2 by this
        # residual-ridged soft trace; the exact values reject it.
        residual_ridged_soft_trace = ridge / (b_u + ridge)
        self.assertEqual(correction * correction, Fraction(1))
        self.assertEqual(residual_ridged_soft_trace, Fraction(1, 2))
        self.assertGreater(correction * correction, residual_ridged_soft_trace)
        # The repaired theorem keeps a multiplier.  At d/r=1 it is 4.
        self.assertLessEqual(
            correction * correction, 4 * residual_ridged_soft_trace
        )


class NoteContractTests(unittest.TestCase):
    def test_claim_boundary_and_required_response_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        for token in (
            "positive determinant increment",
            "log(1+\\theta)",
            "\\mathcal F_\\theta=\\mathcal G_\\theta+\\mathcal J_\\theta",
            "m_{\\theta r}\\sigma_{\\theta r}\\delta_{\\theta r}",
            "`B_U>0` by itself does not determine the sign",
            "separate odd shifted sign",
            "Q_SHIFT_SECTOR_WEIL_CORE_GATE.md",
            "U<=q",
            "d+h_U",
            "RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
            "A_{\\rm R}",
            "weighted combined response decay",
            "false inequality `1<=1/2`",
            "compression of the complete inverse",
            "minus sign from source equation (3.19)",
            "1<n<=lambda^2",
            "P0_INVALIDATED",
            "locally uniform determinant limit",
        ):
            self.assertIn(token, normalized)

        self.assertIn("Current source estimates prove neither", normalized)
        self.assertNotIn("assume every nontrivial zeta zero is real", text.lower())
        self.assertNotIn("global weil positivity holds", text.lower())


if __name__ == "__main__":
    unittest.main()
