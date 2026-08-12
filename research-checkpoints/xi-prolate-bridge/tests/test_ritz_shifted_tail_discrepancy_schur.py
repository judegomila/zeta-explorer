from __future__ import annotations

from fractions import Fraction as F
import unittest


Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


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


def add_scalar(matrix: Matrix, scalar: F) -> Matrix:
    return tuple(
        tuple(entry + (scalar if i == j else F(0)) for j, entry in enumerate(row))
        for i, row in enumerate(matrix)
    )


def schur_short(a: F, coupling: Vector, transverse: Matrix) -> F:
    solved = matvec(inverse(transverse), coupling)
    return a - dot(coupling, solved)


class RitzShiftedTailDiscrepancySchurTests(unittest.TestCase):
    def test_exact_first_ritz_lowering(self) -> None:
        q_plus: Matrix = ((F(5), F(2)), (F(2), F(8)))
        kappa: Vector = (F(1), F(0))
        q = dot(kappa, matvec(q_plus, kappa))
        residual = tuple(
            action - q * coordinate
            for action, coordinate in zip(matvec(q_plus, kappa), kappa)
        )
        self.assertEqual(q, 5)
        self.assertEqual(residual, (F(0), F(2)))

        # The characteristic polynomial is
        # (5-z)(8-z)-4=(z-4)(z-9).
        self.assertEqual((5 - 4) * (8 - 4) - 4, 0)
        self.assertEqual((5 - 9) * (8 - 9) - 4, 0)
        u = F(4)
        lowering = q - u
        self.assertEqual(lowering, 1)
        self.assertLess(u, q)
        self.assertEqual(lowering * (8 - q + lowering), 2**2)
        d_ritz = F(8) - q
        self.assertLessEqual(F(2**2, d_ritz + 2), lowering)
        self.assertLessEqual(lowering, F(2**2, d_ritz))

    def test_live_ritz_gate_passes_when_raw_q_gate_fails(self) -> None:
        q = F(5)
        u = F(4)
        lowering = q - u
        a_q = F(1)
        coupling = (F(3, 2), F(0))
        b_q: Matrix = ((F(1), F(0)), (F(0), F(2)))

        raw_short = schur_short(a_q, coupling, b_q)
        live_short = schur_short(
            a_q + lowering,
            coupling,
            add_scalar(b_q, lowering),
        )
        self.assertEqual(raw_short, F(-5, 4))
        self.assertEqual(live_short, F(7, 8))
        self.assertLess(raw_short, 0)
        self.assertGreater(live_short, 0)

        # Q_- has exact eigenvalues 9/2, 15/2, and 7.
        self.assertEqual(q + 1 - F(3, 2), F(9, 2))
        self.assertEqual(q + 1 + F(3, 2), F(15, 2))
        self.assertEqual(q + 2, F(7))
        self.assertLess(u, F(9, 2))
        self.assertLess(F(9, 2), q)

    def test_hidden_low_even_direction_gives_first_order_lowering(self) -> None:
        q = F(5)
        c_ritz = F(2)
        residual_norm = F(2)
        # sqrt((c-q)^2+4r^2)=5, hence u=1 and t=4.
        u = F(1)
        lowering = q - u
        hidden_drop = q - c_ritz
        self.assertEqual(lowering, 4)
        self.assertEqual(
            lowering * (c_ritz - q + lowering),
            residual_norm**2,
        )
        self.assertLessEqual(
            residual_norm + hidden_drop / 2,
            lowering,
        )
        self.assertLessEqual(lowering, residual_norm + hidden_drop)

    def test_transverse_combined_vector_is_not_shifted(self) -> None:
        # Coordinates are ordered as y direct-sum G.  This is Q_- - qI.
        a_q: Matrix = (
            (F(1), F(3, 2), F(0)),
            (F(3, 2), F(1), F(0)),
            (F(0), F(0), F(2)),
        )
        x: Vector = (F(1), F(0), F(0))
        lowering = F(1)
        s_q = matvec(a_q, x)
        s_u = matvec(add_scalar(a_q, lowering), x)

        self.assertEqual(s_q, (F(1), F(3, 2), F(0)))
        self.assertEqual(s_u, (F(2), F(3, 2), F(0)))
        self.assertEqual(s_u, tuple(s_q[i] + lowering * x[i] for i in range(3)))
        self.assertEqual(s_q[1:], s_u[1:])

        # Mutating the transverse coupling by the scalar lowering would
        # change the exact commutator transport and must be rejected.
        self.assertNotEqual(s_u[1:], tuple(value + lowering for value in s_q[1:]))

    def test_schur_improvement_exceeds_the_scalar_lowering(self) -> None:
        a_q = F(1)
        coupling = (F(3, 2), F(1, 3))
        b_q: Matrix = ((F(1), F(0)), (F(0), F(2)))
        lowering = F(2, 3)
        phi_zero = schur_short(a_q, coupling, b_q)
        phi_live = schur_short(
            a_q + lowering,
            coupling,
            add_scalar(b_q, lowering),
        )

        # Exact resolvent identity:
        # Phi(t)-Phi(0)-t = t*c^T B^-1(B+tI)^-1 c.
        b_inverse = inverse(b_q)
        live_inverse = inverse(add_scalar(b_q, lowering))
        intermediate = matvec(live_inverse, coupling)
        rhs = lowering * dot(coupling, matvec(b_inverse, intermediate))
        self.assertEqual(phi_live - phi_zero - lowering, rhs)
        self.assertGreater(rhs, 0)

    def test_shifting_only_the_scalar_direction_is_rejected(self) -> None:
        a_q = F(1)
        coupling = (F(3, 2), F(0))
        b_q: Matrix = ((F(1), F(0)), (F(0), F(2)))
        lowering = F(1)
        correct = schur_short(
            a_q + lowering,
            coupling,
            add_scalar(b_q, lowering),
        )
        wrong = schur_short(a_q + lowering, coupling, b_q)
        self.assertEqual(correct, F(7, 8))
        self.assertEqual(wrong, F(-1, 4))
        self.assertNotEqual(correct, wrong)

    def test_lower_source_ritz_upper_bounds_monotonically_improve_both_sectors(self) -> None:
        q = F(5)
        first_ritz = F(4)
        enlarged_ritz = F(7, 2)
        alpha = F(8)
        omega = F(9, 2)
        self.assertLessEqual(enlarged_ritz, first_ritz)
        self.assertGreater(alpha - enlarged_ritz, alpha - first_ritz)
        self.assertGreater(omega - enlarged_ritz, omega - first_ritz)

        a_q = F(1)
        coupling = (F(3, 2), F(0))
        b_q: Matrix = ((F(1), F(0)), (F(0), F(2)))
        first_short = schur_short(
            a_q + (q - first_ritz),
            coupling,
            add_scalar(b_q, q - first_ritz),
        )
        enlarged_short = schur_short(
            a_q + (q - enlarged_ritz),
            coupling,
            add_scalar(b_q, q - enlarged_ritz),
        )
        self.assertGreater(enlarged_short, first_short)


if __name__ == "__main__":
    unittest.main()
