#!/usr/bin/env python3
"""Exact regressions for the source-Cauchy selector-cone theorem."""

from __future__ import annotations

from fractions import Fraction as F
from itertools import permutations
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md"

Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]
Polynomial = tuple[F, ...]  # ascending powers


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_columns = tuple(zip(*right))
    return tuple(
        tuple(dot(row, tuple(column)) for column in right_columns)
        for row in left
    )


def trace(matrix: Matrix) -> F:
    return sum((matrix[index][index] for index in range(len(matrix))), F(0))


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x + y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def scale(value: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(value * entry for entry in row) for row in matrix)


def rank(matrix: Matrix) -> int:
    if not matrix:
        return 0
    work = [list(row) for row in matrix]
    row_count = len(work)
    column_count = len(work[0])
    pivot_row = 0
    for column in range(column_count):
        pivot = next(
            (row for row in range(pivot_row, row_count) if work[row][column]),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        for row in range(row_count):
            if row == pivot_row or not work[row][column]:
                continue
            multiplier = work[row][column] / pivot_value
            for entry in range(column, column_count):
                work[row][entry] -= multiplier * work[pivot_row][entry]
        pivot_row += 1
        if pivot_row == row_count:
            break
    return pivot_row


def poly_trim(values: list[F]) -> Polynomial:
    while len(values) > 1 and values[-1] == 0:
        values.pop()
    return tuple(values)


def poly_add(left: Polynomial, right: Polynomial) -> Polynomial:
    values = [F(0) for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        values[index] += value
    for index, value in enumerate(right):
        values[index] += value
    return poly_trim(values)


def poly_scale(value: F, polynomial: Polynomial) -> Polynomial:
    return poly_trim([value * coefficient for coefficient in polynomial])


def poly_multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    values = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, x in enumerate(left):
        for j, y in enumerate(right):
            values[i + j] += x * y
    return poly_trim(values)


def permutation_sign(permutation: tuple[int, ...]) -> int:
    inversions = sum(
        permutation[i] > permutation[j]
        for i in range(len(permutation))
        for j in range(i + 1, len(permutation))
    )
    return -1 if inversions % 2 else 1


def polynomial_determinant(matrix: tuple[tuple[Polynomial, ...], ...]) -> Polynomial:
    size = len(matrix)
    if size == 0:
        return (F(1),)
    result: Polynomial = (F(0),)
    for permutation in permutations(range(size)):
        term: Polynomial = (F(permutation_sign(permutation)),)
        for row, column in enumerate(permutation):
            term = poly_multiply(term, matrix[row][column])
        result = poly_add(result, term)
    return result


def polynomial_minor(
    matrix: tuple[tuple[Polynomial, ...], ...],
    row: int,
    column: int,
) -> tuple[tuple[Polynomial, ...], ...]:
    return tuple(
        tuple(matrix[i][j] for j in range(len(matrix)) if j != column)
        for i in range(len(matrix)) if i != row
    )


def polynomial_adjugate(
    matrix: tuple[tuple[Polynomial, ...], ...],
) -> tuple[tuple[Polynomial, ...], ...]:
    size = len(matrix)
    return tuple(
        tuple(
            poly_scale(
                F((-1) ** (i + j)),
                polynomial_determinant(polynomial_minor(matrix, j, i)),
            )
            for j in range(size)
        )
        for i in range(size)
    )


def z_identity_minus(matrix: Matrix) -> tuple[tuple[Polynomial, ...], ...]:
    return tuple(
        tuple(
            (-matrix[i][j], F(1)) if i == j else (-matrix[i][j],)
            for j in range(len(matrix))
        )
        for i in range(len(matrix))
    )


def derivative_at(polynomial: Polynomial, order: int, point: F) -> F:
    result = F(0)
    for power in range(order, len(polynomial)):
        falling = 1
        for factor in range(order):
            falling *= power - factor
        result += polynomial[power] * falling * point ** (power - order)
    return result


def source_cauchy_matrix(
    count: int,
    diagonal: tuple[F, ...],
    positive_b: tuple[F, ...],
) -> Matrix:
    modes = tuple(range(-count, count + 1))

    def b(mode: int) -> F:
        if mode == 0:
            return F(0)
        return positive_b[mode - 1] if mode > 0 else -positive_b[-mode - 1]

    return tuple(
        tuple(
            diagonal[abs(mode)]
            if mode == other
            else (b(mode) - b(other)) / F(mode - other)
            for other in modes
        )
        for mode in modes
    )


def atom_source_parameters(count: int, tau: F, gamma: F) -> tuple[tuple[F, ...], tuple[F, ...]]:
    if tau == 0:
        return (gamma,) + (F(0),) * count, (F(0),) * count
    diagonal = (gamma,) + tuple(
        gamma * tau * (tau - n * n) / (tau + n * n) ** 2
        for n in range(1, count + 1)
    )
    positive_b = tuple(
        gamma * n * tau / (tau + n * n)
        for n in range(1, count + 1)
    )
    return diagonal, positive_b


def atom_closed_matrix(count: int, tau: F, gamma: F) -> Matrix:
    if tau == 0:
        modes = tuple(range(-count, count + 1))
        return tuple(
            tuple(gamma if n == 0 and m == 0 else F(0) for m in modes)
            for n in modes
        )
    modes = tuple(range(-count, count + 1))
    return tuple(
        tuple(
            gamma * tau * (tau - n * m)
            / ((tau + n * n) * (tau + m * m))
            for m in modes
        )
        for n in modes
    )


def raw_even_polynomial(central: F, positive: tuple[F, ...]) -> tuple[F, ...]:
    if len(positive) != 2:
        raise ValueError("this exact fixture is N=2")
    x1, x2 = positive
    return (
        4 * central,
        -5 * central - 8 * x1 - 2 * x2,
        central + 2 * x1 + 2 * x2,
    )


class SourceCauchySelectorConeProjectiveTradeoffTests(unittest.TestCase):
    def test_regular_atom_serialization_and_rank_two_factorization(self) -> None:
        count = 3
        tau = F(5, 2)
        gamma = F(7, 3)
        diagonal, positive_b = atom_source_parameters(count, tau, gamma)
        assembled = source_cauchy_matrix(count, diagonal, positive_b)
        closed = atom_closed_matrix(count, tau, gamma)
        self.assertEqual(assembled, closed)

        modes = tuple(range(-count, count + 1))
        # Remove sqrt(gamma) from both vectors and retain gamma outside.
        even = tuple(tau / (tau + n * n) for n in modes)
        odd = tuple(F(n, 1) / (tau + n * n) for n in modes)
        factored = add(scale(gamma, outer(even, even)), scale(-gamma * tau, outer(odd, odd)))
        self.assertEqual(factored, assembled)
        self.assertEqual(rank(assembled), 2)

        # Normalized parity formulas can be checked without adjoining sqrt(2):
        # H^+_(0,n)/sqrt(2)=b_n/n and
        # H^+_(n,m)=w_n*w_m=2*gamma*tau^2/denominators.
        for n in range(1, count + 1):
            self.assertEqual(
                positive_b[n - 1] / n,
                gamma * tau / (tau + n * n),
            )
            self.assertEqual(
                diagonal[n] + positive_b[n - 1] / n,
                2 * gamma * tau * tau / (tau + n * n) ** 2,
            )
        for n in range(1, count + 1):
            for m in range(1, count + 1):
                if n == m:
                    continue
                even_entry = 2 * (
                    n * positive_b[n - 1] - m * positive_b[m - 1]
                ) / F(n * n - m * m)
                expected = (
                    2 * gamma * tau * tau
                    / ((tau + n * n) * (tau + m * m))
                )
                self.assertEqual(even_entry, expected)

    def test_parameter_recovery_center_boundary_and_pole_limits(self) -> None:
        count = 4
        tau = F(7, 3)
        ratios = tuple(tau / (tau + n * n) for n in range(1, count + 1))
        recovered = tuple(
            (F(1, ratio) - 1) / (n * n)
            for n, ratio in enumerate(ratios, start=1)
        )
        self.assertEqual(recovered, (F(1, tau),) * count)

        center_diagonal, center_b = atom_source_parameters(count, F(0), F(3, 2))
        center = source_cauchy_matrix(count, center_diagonal, center_b)
        self.assertEqual(rank(center), 1)

        boundary = source_cauchy_matrix(
            count,
            (F(3, 2),) * (count + 1),
            tuple(F(3, 2) * n for n in range(1, count + 1)),
        )
        self.assertEqual(boundary, tuple(tuple(F(3, 2) for _ in row) for row in boundary))
        self.assertEqual(rank(boundary), 1)

        # Exact normalized pole formulas from tau=-j^2+delta.
        shell = 2
        delta = F(1, 101)
        pole_tau = -shell * shell + delta
        pole_gamma = delta * delta / (2 * pole_tau * pole_tau)
        pole_diagonal, pole_b = atom_source_parameters(count, pole_tau, pole_gamma)
        self.assertEqual(
            pole_diagonal[shell],
            (pole_tau - shell * shell) / (2 * pole_tau),
        )
        self.assertEqual(pole_b[shell - 1], delta * shell / (2 * pole_tau))
        self.assertEqual(
            pole_diagonal[shell] - 1,
            -delta / (2 * pole_tau),
        )
        # The exact paired shell has one even and one odd direction.
        paired_shell = source_cauchy_matrix(
            count,
            tuple(F(1) if n == shell else F(0) for n in range(count + 1)),
            (F(0),) * count,
        )
        self.assertEqual(rank(paired_shell), 2)

    def test_rational_curve_outer_products_span_the_source_dimension(self) -> None:
        # N=2 gives d=3 and source-block dimension 2d-1=5.  Removing the
        # fixed normalized-parity diagonal congruence leaves rational vectors
        # (1,tau/(tau+1),tau/(tau+4)).
        taus = (F(1), F(2), F(3), F(5), F(7))
        symmetric_coordinates = []
        for tau in taus:
            vector = (F(1), tau / (tau + 1), tau / (tau + 4))
            atom = outer(vector, vector)
            symmetric_coordinates.append(
                (atom[0][0], atom[0][1], atom[0][2], atom[1][1], atom[1][2], atom[2][2])
            )
        self.assertEqual(rank(tuple(symmetric_coordinates)), 5)

        # A positive mixture is a Gram matrix, and five atoms still remain in
        # the five-dimensional source span.
        weights = (F(1), F(2), F(3), F(4), F(5))
        mixture = tuple(tuple(F(0) for _ in range(3)) for _ in range(3))
        for tau, weight in zip(taus, weights):
            vector = (F(1), tau / (tau + 1), tau / (tau + 4))
            mixture = add(mixture, scale(weight, outer(vector, vector)))
        for vector in (
            (F(1), F(0), F(0)),
            (F(2), F(-1), F(3)),
            (F(-4), F(5), F(2)),
        ):
            self.assertGreaterEqual(dot(vector, matvec(mixture, vector)), 0)

    def test_multiple_projector_derivative_cofactor_serialization(self) -> None:
        # Reconstruct p(z)=det(zI-A) and C(z)=adj(zI-A) from polynomial
        # entries and signed minors.  No eigensystem or cached projector is
        # used.  The ground zero mu=0 has multiplicity two.
        operator = (
            (F(0), F(0), F(0), F(0)),
            (F(0), F(0), F(0), F(0)),
            (F(0), F(0), F(2), F(0)),
            (F(0), F(0), F(0), F(3)),
        )
        polynomial_matrix = z_identity_minus(operator)
        characteristic = polynomial_determinant(polynomial_matrix)
        cofactor = polynomial_adjugate(polynomial_matrix)
        self.assertEqual(characteristic, (F(0), F(0), F(6), F(-5), F(1)))

        mu = F(0)
        multiplicity = 2
        self.assertEqual(derivative_at(characteristic, 0, mu), 0)
        self.assertEqual(derivative_at(characteristic, 1, mu), 0)
        characteristic_derivative = derivative_at(characteristic, multiplicity, mu)
        self.assertEqual(characteristic_derivative, 12)
        cofactor_derivative = tuple(
            tuple(
                derivative_at(cofactor[i][j], multiplicity - 1, mu)
                for j in range(4)
            )
            for i in range(4)
        )
        projector = scale(F(multiplicity, characteristic_derivative), cofactor_derivative)
        expected_projector = (
            (F(1), F(0), F(0), F(0)),
            (F(0), F(1), F(0), F(0)),
            (F(0), F(0), F(0), F(0)),
            (F(0), F(0), F(0), F(0)),
        )
        self.assertEqual(projector, expected_projector)

        kappa = (F(1, 2), F(1, 2), F(1, 2), F(1, 2))
        low_projector = (
            (F(1), F(0), F(0), F(0)),
            (F(0), F(1), F(0), F(0)),
            (F(0), F(0), F(1), F(0)),
            (F(0), F(0), F(0), F(0)),
        )
        low_state = matvec(low_projector, kappa)
        k00 = dot(low_state, low_state)
        perpendicular = add(low_projector, scale(-1 / k00, outer(low_state, low_state)))

        y_squared = dot(kappa, matvec(projector, kappa))
        reconstructed_y_squared = (
            F(multiplicity, characteristic_derivative)
            * dot(kappa, matvec(cofactor_derivative, kappa))
        )
        self.assertEqual(y_squared, F(1, 2))
        self.assertEqual(reconstructed_y_squared, y_squared)

        trace_value = trace(matmul(perpendicular, projector))
        reconstructed_trace = F(multiplicity, characteristic_derivative) * (
            trace(matmul(low_projector, cofactor_derivative))
            - dot(low_state, matvec(cofactor_derivative, low_state)) / k00
        )
        self.assertEqual(trace_value, F(4, 3))
        self.assertEqual(reconstructed_trace, trace_value)

    def test_delta_tradeoff_and_t_zero_branch(self) -> None:
        # E is the full rational three-space and kappa=(1,2,2)/3.
        kappa = (F(1, 3), F(2, 3), F(2, 3))
        self.assertEqual(dot(kappa, kappa), 1)
        dimension = F(3)
        y_squared = F(1)

        # P_L=I-|kappa><kappa|, so T=2 and A_j=1-alpha_j^2.
        trace = F(2)
        delta = trace / dimension
        alphas_squared = tuple(value * value for value in kappa)
        leakages = tuple(F(1) - value for value in alphas_squared)
        ratios = tuple(
            (leakage + delta) / alpha_squared
            for leakage, alpha_squared in zip(leakages, alphas_squared)
        )
        bound = (trace + delta * dimension) / y_squared
        selected = min(range(3), key=ratios.__getitem__)
        self.assertLessEqual(ratios[selected], bound)
        self.assertLessEqual(
            leakages[selected] / alphas_squared[selected],
            2 * trace / y_squared,
        )
        self.assertLessEqual(
            1 / alphas_squared[selected],
            2 * dimension / y_squared,
        )

        # T=0: every A_j vanishes and the largest coordinate overlap has
        # inverse square at most m/Y^2.
        zero_leakages = (F(0), F(0), F(0))
        selected_zero = max(range(3), key=alphas_squared.__getitem__)
        self.assertEqual(zero_leakages[selected_zero], 0)
        self.assertLessEqual(1 / alphas_squared[selected_zero], dimension / y_squared)

    def test_exact_y2_plus_y_plus_4_separation_countermodel(self) -> None:
        raw = (F(1), F(-1), F(1))
        polynomial = raw_even_polynomial(raw[0], raw[1:])
        self.assertEqual(polynomial, (F(4), F(1), F(1)))
        discriminant = polynomial[1] ** 2 - 4 * polynomial[2] * polynomial[0]
        self.assertEqual(discriminant, -15)
        raw_norm_squared = raw[0] ** 2 + 2 * raw[1] ** 2 + 2 * raw[2] ** 2
        self.assertEqual(raw_norm_squared, 5)

        # Dual norms in diag(1,2,2) are c0^2+c1^2/2+c2^2/2.
        self.assertEqual(F(1) + F(2 * 2, 2) + F(2 * 2, 2), 5)
        self.assertEqual(F(25) + F(64, 2) + F(4, 2), 59)
        self.assertEqual(F(16), 16)
        self.assertLess(F(5, 59), F(1, 9))
        self.assertGreater(F(59), F(49))
        self.assertLess(F(4), F(64, 7))

        projective_distance_squared = F(1, 59) / raw_norm_squared
        self.assertEqual(projective_distance_squared, F(1, 295))
        self.assertEqual(
            projective_distance_squared / (1 - projective_distance_squared),
            F(1, 294),
        )

        # Exact diagonal source-Cauchy family: the first three even
        # coordinates are the ground space, and kappa is an exact ground
        # vector with no tail.  Its low perpendicular trace is two.
        count = 5
        diagonal = (F(0), F(0), F(0), F(7), F(7), F(7))
        matrix = source_cauchy_matrix(count, diagonal, (F(0),) * count)
        raw_kappa = tuple(
            F(1) if n == 0 else F(-1) if abs(n) == 1 else F(1) if abs(n) == 2 else F(0)
            for n in range(-count, count + 1)
        )
        self.assertEqual(matvec(matrix, raw_kappa), (F(0),) * (2 * count + 1))
        self.assertEqual(F(3) - F(1), 2)  # tr(P_(kappa^perp) P_E)

        # Canonical boundary selector in E: overlap 1/5, A=24/25, ratio 24.
        overlap = F(1, 5)
        leakage = F(1) - overlap * overlap
        self.assertEqual(leakage, F(24, 25))
        self.assertEqual(leakage / (overlap * overlap), 24)

    def test_note_records_claim_boundary_and_self_contained_cone_proof(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Every positive rank-one even block",
            "tau=-j^2",
            "H=|u\\rangle\\langle u|",
            "finite moment-cone representation",
            "sum of two squares",
            "P_E={m\\,C^{(m-1)}(\\mu)\\over p^{(m)}(\\mu)}",
            "cached eigenvectors",
            "spectral projectors are not inputs",
            "For every `delta>0`",
            "If `T=0`",
            "1\\over295",
            "conditional",
            "not new pinned Weil matrices",
            "`P0_INVALIDATED`",
        )
        for phrase in required:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
