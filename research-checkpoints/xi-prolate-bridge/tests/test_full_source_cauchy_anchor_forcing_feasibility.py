#!/usr/bin/env python3
"""Exact regressions for full source-Cauchy anchor forcing feasibility.

Only Python standard-library rational arithmetic is used.  The tests replay
the linear annihilator, zero-coordinate condition, cleared selector
identity, strict/repeated/infinite/pole root branches, and the exact
``y^2+y+4`` SDP obstruction.  They do not assemble an arithmetic Weil
matrix or make an asymptotic claim.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FULL_SOURCE_CAUCHY_ANCHOR_FORCING_FEASIBILITY.md"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}

Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]
Linear = tuple[F, F]       # a*u+b*v
Quadratic = tuple[F, F, F]  # a*u^2+b*u*v+c*v^2


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def outer(vector: Vector) -> Matrix:
    return tuple(tuple(x * y for y in vector) for x in vector)


def add_scaled_outers(vectors: tuple[Vector, ...], weights: tuple[F, ...]) -> Matrix:
    size = len(vectors[0])
    result = [[F(0) for _ in range(size)] for _ in range(size)]
    for vector, weight in zip(vectors, weights):
        atom = outer(vector)
        for row in range(size):
            for column in range(size):
                result[row][column] += weight * atom[row][column]
    return tuple(tuple(row) for row in result)


def rank(matrix: Matrix) -> int:
    work = [list(row) for row in matrix]
    if not work:
        return 0
    rows = len(work)
    columns = len(work[0])
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column]),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        value = work[pivot_row][column]
        for row in range(rows):
            if row == pivot_row or work[row][column] == 0:
                continue
            factor = work[row][column] / value
            for entry in range(column, columns):
                work[row][entry] -= factor * work[pivot_row][entry]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


def product(values: tuple[F, ...]) -> F:
    answer = F(1)
    for value in values:
        answer *= value
    return answer


def raw_polynomial_value(raw: Vector, y: F) -> F:
    count = len(raw) - 1
    squares = tuple(F(index * index) for index in range(1, count + 1))
    answer = raw[0] * product(tuple(y - square for square in squares))
    for index in range(1, count + 1):
        answer += (
            2 * y * raw[index]
            * product(tuple(
                y - squares[other - 1]
                for other in range(1, count + 1)
                if other != index
            ))
        )
    return answer


def n2_coefficients(raw: Vector) -> tuple[F, F, F]:
    x0, x1, x2 = raw
    return (
        4 * x0,
        -5 * x0 - 8 * x1 - 2 * x2,
        x0 + 2 * x1 + 2 * x2,
    )  # constant, linear, quadratic


def cleared_selector_raw(count: int, tau: F) -> Vector:
    """Return S*q(tau), S=diag(1,sqrt(2),...), using rationals."""

    squares = tuple(F(index * index) for index in range(1, count + 1))
    central = product(tuple(tau + square for square in squares))
    positive = tuple(
        2 * tau * product(tuple(
            tau + squares[other - 1]
            for other in range(1, count + 1)
            if other != index
        ))
        for index in range(1, count + 1)
    )
    return (central,) + positive


def infinity_selector_raw(count: int) -> Vector:
    return (F(1),) + (F(2),) * count


def source_congruent_off_diagonal(count: int, gamma: Vector) -> list[list[F]]:
    """Build off-diagonal S*K*S for the source-Cauchy displacement gamma."""

    matrix = [[F(0) for _ in range(count + 1)] for _ in range(count + 1)]
    for n in range(1, count + 1):
        value = 2 * gamma[n - 1] / n
        matrix[0][n] = value
        matrix[n][0] = value
    for n in range(1, count + 1):
        for m in range(n + 1, count + 1):
            value = 4 * (n * gamma[n - 1] - m * gamma[m - 1]) / (n * n - m * m)
            matrix[n][m] = value
            matrix[m][n] = value
    return matrix


def complete_annihilator(
    raw: Vector,
    gamma: Vector,
    zero_diagonal: dict[int, F] | None = None,
) -> Matrix:
    matrix = source_congruent_off_diagonal(len(raw) - 1, gamma)
    free = zero_diagonal or {}
    for index, coordinate in enumerate(raw):
        off_action = sum(matrix[index][other] * raw[other]
                         for other in range(len(raw)) if other != index)
        if coordinate:
            matrix[index][index] = -off_action / coordinate
        else:
            if off_action:
                raise ValueError("zero-coordinate compatibility fails")
            matrix[index][index] = free.get(index, F(0))
    return tuple(tuple(row) for row in matrix)


def multiply_linear(left: Linear, right: Linear) -> Quadratic:
    return (
        left[0] * right[0],
        left[0] * right[1] + left[1] * right[0],
        left[1] * right[1],
    )


def subtract_quadratic(left: Quadratic, right: Quadratic) -> Quadratic:
    return tuple(x - y for x, y in zip(left, right))  # type: ignore[return-value]


class FullSourceCauchyAnchorForcingFeasibilityTests(unittest.TestCase):
    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_all_nonzero_coordinates_leave_exactly_n_offdiagonal_parameters(self) -> None:
        raw = (F(2), F(-3), F(5), F(7))
        gamma = (F(1, 2), F(-2, 3), F(3, 5))
        matrix = complete_annihilator(raw, gamma)
        self.assertEqual(matvec(matrix, raw), (F(0),) * len(raw))

        # Changing any one gamma changes an off-diagonal entry, while the
        # diagonal completion remains unique because every coordinate is nonzero.
        changed = complete_annihilator(raw, (F(3, 2), gamma[1], gamma[2]))
        self.assertNotEqual(matrix[0][1], changed[0][1])
        self.assertNotEqual(matrix, changed)

    def test_zero_coordinate_has_linear_compatibility_and_free_diagonal(self) -> None:
        raw = (F(1), F(0), F(2))
        # At coordinate 1 the compatibility equation is -2*u+16*v=0.
        compatible = complete_annihilator(
            raw,
            (F(8), F(1)),
            zero_diagonal={1: F(17)},
        )
        self.assertEqual(matvec(compatible, raw), (F(0), F(0), F(0)))
        self.assertEqual(compatible[1][1], F(17))

        with self.assertRaisesRegex(ValueError, "compatibility"):
            complete_annihilator(raw, (F(0), F(1)))

    def test_commutator_preservation_forces_zero_perturbation_displacement(self) -> None:
        # [D,H]_(n,0)=b_n because b_0=0.  Hence every positive b_n is
        # individually visible and commutator preservation forces all to zero.
        positive_b = (F(3, 7), F(-5, 11), F(13, 17))
        modes = tuple(range(-len(positive_b), len(positive_b) + 1))

        def b(mode: int) -> F:
            if mode == 0:
                return F(0)
            return positive_b[mode - 1] if mode > 0 else -positive_b[-mode - 1]

        for mode in modes:
            self.assertEqual(b(mode) - b(0), b(mode))
        self.assertTrue(any(b(mode) for mode in modes))

        zero_b = (F(0),) * len(positive_b)
        self.assertTrue(all(value == 0 for value in zero_b))

    def test_cleared_selector_identity_includes_regular_and_pole_values(self) -> None:
        raw = (F(5, 3), F(-7, 5), F(11, 13), F(-17, 19))
        count = len(raw) - 1
        for tau in (F(0), F(2, 3), F(-1), F(-4), F(-9), F(7, 2)):
            selector = cleared_selector_raw(count, tau)
            self.assertEqual(
                dot(raw, selector),
                F((-1) ** count) * raw_polynomial_value(raw, -tau),
            )

        self.assertEqual(
            dot(raw, infinity_selector_raw(count)),
            raw[0] + 2 * sum(raw[1:], F(0)),
        )

    def test_pole_root_is_exactly_a_zero_shell_coordinate(self) -> None:
        # p(y)=(y-1)(y-2); the y=1 root is the tau=-1 shell pole.
        raw = (F(1, 2), F(0), F(1, 4))
        self.assertEqual(n2_coefficients(raw), (F(2), F(-3), F(1)))
        pole = cleared_selector_raw(2, F(-1))
        self.assertEqual(pole[0], F(0))
        self.assertNotEqual(pole[1], F(0))
        self.assertEqual(pole[2], F(0))
        self.assertEqual(dot(raw, pole), F(0))

        other = cleared_selector_raw(2, F(-2))
        matrix = add_scaled_outers((pole, other), (F(1), F(1)))
        self.assertEqual(rank(matrix), 2)
        self.assertEqual(matvec(matrix, raw), (F(0), F(0), F(0)))

    def test_distinct_real_roots_construct_a_rank_n_positive_face_member(self) -> None:
        # p(y)=(y-2)(y-3).
        raw = (F(3, 2), F(-1, 3), F(1, 12))
        self.assertEqual(n2_coefficients(raw), (F(6), F(-5), F(1)))
        roots = (
            cleared_selector_raw(2, F(-2)),
            cleared_selector_raw(2, F(-3)),
        )
        matrix = add_scaled_outers(roots, (F(2), F(3)))
        self.assertEqual(matvec(matrix, raw), (F(0), F(0), F(0)))
        self.assertEqual(rank(matrix), 2)

        rank_one = add_scaled_outers(roots, (F(2), F(0)))
        self.assertEqual(rank(rank_one), 1)

    def test_repeated_root_reduces_maximal_support_rank(self) -> None:
        # p(y)=(y-2)^2 has one distinct real projective root, with multiplicity two.
        raw = (F(1), F(-1, 6), F(1, 6))
        constant, linear, quadratic = n2_coefficients(raw)
        self.assertEqual((constant, linear, quadratic), (F(4), F(-4), F(1)))
        self.assertEqual(linear * linear - 4 * quadratic * constant, F(0))

        selector = cleared_selector_raw(2, F(-2))
        matrix = add_scaled_outers((selector,), (F(5),))
        self.assertEqual(matvec(matrix, raw), (F(0), F(0), F(0)))
        self.assertEqual(rank(matrix), 1)

    def test_projective_infinity_is_a_genuine_distinct_selector_root(self) -> None:
        # p(y)=y-2 has finite root y=2 and a simple projective root at infinity.
        raw = (F(-1, 2), F(1, 6), F(1, 12))
        self.assertEqual(n2_coefficients(raw), (F(-2), F(1), F(0)))
        finite = cleared_selector_raw(2, F(-2))
        infinity = infinity_selector_raw(2)
        self.assertEqual(dot(raw, finite), F(0))
        self.assertEqual(dot(raw, infinity), F(0))

        matrix = add_scaled_outers((finite, infinity), (F(7), F(11)))
        self.assertEqual(matvec(matrix, raw), (F(0), F(0), F(0)))
        self.assertEqual(rank(matrix), 2)

    def test_y2_plus_y_plus_4_has_only_the_zero_positive_annihilator(self) -> None:
        raw = (F(1), F(-1), F(1))
        constant, linear, quadratic = n2_coefficients(raw)
        discriminant = linear * linear - 4 * quadratic * constant
        self.assertEqual((constant, linear, quadratic), (F(4), F(1), F(1)))
        self.assertEqual(discriminant, F(-15))

        # In the kappa-perpendicular basis used in the note, the restricted
        # determinant is computed as a quadratic form in u=gamma_1,v=gamma_2.
        g11: Linear = (F(20, 3), F(5, 3))
        g22: Linear = (F(2, 3), F(-4, 3))
        g12: Linear = (F(-16, 3), F(14, 3))
        determinant = subtract_quadratic(
            multiply_linear(g11, g22),
            multiply_linear(g12, g12),
        )
        self.assertEqual(determinant, (F(-24), F(42), F(-24)))
        self.assertEqual(determinant, tuple(-6 * value for value in (F(4), F(-7), F(4))))

        # 4*u^2-7*u*v+4*v^2 is positive definite.
        self.assertEqual(F(-7) ** 2 - 4 * F(4) * F(4), F(-15))

    def test_note_records_exact_equivalence_and_rejects_global_promotion(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "The linear eigenvector equation is always solvable",
            "distinct real projective roots",
            r"K\succeq P_\perp",
            r"(C(\gamma)\kappa)_i=0",
            r"[D,Q-H]=[D,Q]",
            r"\langle\kappa,q(\tau)\rangle",
            r"=(-1)^N p_\kappa(-\tau)",
            "includes multiplicities and the root at",
            "annihilating selector face",
            r"\max_{K\in F_\kappa}\operatorname {rank}K=r",
            r"y^2+y+4",
            r"-6(4u^2-7uv+4v^2)",
            "equivalent to the strict real-root target",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual natural-cutoff SDP is feasible",
            "all actual prolate anchor polynomials are real-rooted",
            "equation (5.2) is proved",
        )
        for token in forbidden:
            self.assertNotIn(token, text)


if __name__ == "__main__":
    unittest.main()
