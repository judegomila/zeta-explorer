from __future__ import annotations

from fractions import Fraction
import json
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SECANT_SHORTED_RECIPROCAL_FESHBACH.md"
PILOT = (
    ROOT
    / "artifacts"
    / "checkpoint064_reciprocal_secant"
    / "lambda2_N4_T1_dps80_producer.json"
)

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


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def scale(scalar: Fraction, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * entry for entry in row) for row in matrix)


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def trace(matrix: Matrix) -> Fraction:
    return sum((matrix[index][index] for index in range(len(matrix))), Fraction(0))


def inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    work = [
        list(matrix[row] + identity(size)[row])
        for row in range(size)
    ]
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


def quadratic(vector: Vector, matrix: Matrix) -> Fraction:
    return dot(vector, matvec(matrix, vector))


def columns(matrix: Matrix) -> tuple[Vector, ...]:
    return tuple(tuple(row[index] for row in matrix) for index in range(len(matrix[0])))


def from_columns(*vectors: Vector) -> Matrix:
    return tuple(tuple(vector[row] for vector in vectors) for row in range(len(vectors[0])))


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


class NoteContractTests(unittest.TestCase):
    def test_claim_boundary_and_source_formula_strings(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        for token in (
            "P0_INVALIDATED",
            "Lebesgue measure",
            "zero extension",
            "source-normalized",
            "1<n<=lambda^2",
            "minus sign from source equation (3.19)",
            "graph-load identity",
            "rank-three deflated displacement",
            "(TU)(C+rI)-({\\cal C}_-+rI)(TU)",
            "-|T\\omega\\rangle\\langle g|",
            "w_r=x-y\\alpha+z\\gamma",
            "b_n=\\tau n",
            "a_0=0",
            "a_n=\\rho+\\tau",
            "**not** the matrix assembled from the pinned pole",
            "DIAGNOSTIC",
            "equation (5.2)",
            "locally uniform determinant convergence",
            "nor the Riemann hypothesis",
        ):
            self.assertIn(token, normalized)

        self.assertIn("synthetic diagonal and displacement coefficients", normalized)
        self.assertIn("not an actual-source upper bound", normalized)
        self.assertNotIn("assume every nontrivial zeta zero is real", text.lower())
        self.assertNotIn("global weil positivity holds", text.lower())


class ExactFeshbachTests(unittest.TestCase):
    def setUp(self) -> None:
        self.b: Matrix = (
            (Fraction(2), Fraction(2)),
            (Fraction(2), Fraction(3)),
        )
        self.ridge = Fraction(1)
        self.omega: Vector = (Fraction(1), Fraction(0))
        self.embedding: Matrix = ((Fraction(0),), (Fraction(1),))

    def test_block_inverse_and_graph_load_are_exact(self) -> None:
        shifted = add(self.b, identity(2))
        direct_inverse = inverse(shifted)

        epsilon = Fraction(2)
        g = Fraction(2)
        lower = Fraction(3)
        denominator = lower + self.ridge
        delta = epsilon + self.ridge - g * g / denominator
        v: Vector = (Fraction(1), -g / denominator)

        rank_term = scale(Fraction(1, 1) / delta, outer(v, v))
        bulk_term: Matrix = (
            (Fraction(0), Fraction(0)),
            (Fraction(0), Fraction(1, 1) / denominator),
        )
        self.assertEqual(direct_inverse, add(rank_term, bulk_term))

        w = matvec(direct_inverse, self.omega)
        graph_term = scale(Fraction(1, 1) / dot(self.omega, w), outer(w, w))
        self.assertEqual(graph_term, rank_term)
        self.assertEqual(delta, Fraction(2))
        self.assertEqual(w, (Fraction(1, 2), Fraction(-1, 4)))

        k: Matrix = (
            (Fraction(1, 4), Fraction(1, 4)),
            (Fraction(1, 4), Fraction(1, 4)),
        )
        full_trace = trace(matmul(direct_inverse, k))
        graph_trace = quadratic(w, k) / dot(self.omega, w)
        k_f = k[1][1]
        deflated_trace = k_f / denominator
        self.assertEqual(full_trace, graph_trace + deflated_trace)
        self.assertGreaterEqual(graph_trace, 0)
        self.assertGreaterEqual(deflated_trace, 0)

    def test_sharp_lower_and_upper_envelopes_are_attained(self) -> None:
        shifted_inverse = inverse(add(self.b, identity(2)))
        epsilon_plus_ridge = Fraction(3)
        c_squared = Fraction(1, 4)
        a = Fraction(2, 3)
        bulk = Fraction(3, 4)
        square_root = Fraction(1, 2)  # sqrt((1-a)*bulk)

        k_lower: Matrix = (
            (Fraction(1, 4), Fraction(1, 4)),
            (Fraction(1, 4), Fraction(1, 4)),
        )
        k_upper: Matrix = (
            (Fraction(1, 4), Fraction(-1, 4)),
            (Fraction(-1, 4), Fraction(1, 4)),
        )

        reserve_lower = (
            epsilon_plus_ridge
            * trace(matmul(shifted_inverse, k_lower))
            / c_squared
        )
        reserve_upper = (
            epsilon_plus_ridge
            * trace(matmul(shifted_inverse, k_upper))
            / c_squared
        )
        lower_endpoint = bulk + (1 - square_root) ** 2 / a
        upper_endpoint = bulk + (1 + square_root) ** 2 / a

        self.assertEqual(reserve_lower, Fraction(9, 8))
        self.assertEqual(reserve_upper, Fraction(33, 8))
        self.assertEqual(reserve_lower, lower_endpoint)
        self.assertEqual(reserve_upper, upper_endpoint)


class SourceDisplacementTests(unittest.TestCase):
    def test_rank_three_deflated_identity_with_exact_rationals(self) -> None:
        # A finite algebraic source-displacement model.  T=I makes all
        # entries rational while retaining both source columns and the new
        # secant column.  The displayed deflated numerator has rank three.
        t = identity(4)
        b_even: Matrix = (
            (Fraction(20), Fraction(1), Fraction(2), Fraction(3)),
            (Fraction(1), Fraction(21), Fraction(4), Fraction(5)),
            (Fraction(2), Fraction(4), Fraction(22), Fraction(6)),
            (Fraction(3), Fraction(5), Fraction(6), Fraction(23)),
        )
        beta: Vector = (Fraction(1), Fraction(1), Fraction(0), Fraction(0))
        eta: Vector = beta
        derivative_anchor: Vector = (
            Fraction(0), Fraction(0), Fraction(1), Fraction(1)
        )
        residual: Vector = derivative_anchor
        source_numerator = subtract(
            outer(beta, eta), outer(derivative_anchor, residual)
        )
        odd = subtract(b_even, source_numerator)
        self.assertEqual(
            subtract(matmul(t, b_even), matmul(odd, t)),
            source_numerator,
        )

        omega: Vector = (Fraction(1), Fraction(0), Fraction(0), Fraction(0))
        embedding: Matrix = (
            (Fraction(0), Fraction(0), Fraction(0)),
            (Fraction(1), Fraction(0), Fraction(0)),
            (Fraction(0), Fraction(1), Fraction(0)),
            (Fraction(0), Fraction(0), Fraction(1)),
        )
        g = matvec(transpose(embedding), matvec(b_even, omega))
        compressed = matmul(matmul(transpose(embedding), b_even), embedding)
        left = subtract(
            matmul(matmul(t, embedding), compressed),
            matmul(odd, matmul(t, embedding)),
        )
        eta_f = matvec(transpose(embedding), eta)
        residual_f = matvec(transpose(embedding), residual)
        right = subtract(
            subtract(
                outer(beta, eta_f),
                outer(derivative_anchor, residual_f),
            ),
            outer(matvec(t, omega), g),
        )
        self.assertEqual(left, right)

        # The top 3 by 3 minor is nonzero, so the new numerator really can
        # have rank three rather than merely being called rank three.
        top_minor = tuple(tuple(right[row][column] for column in range(3)) for row in range(3))
        self.assertNotEqual(determinant(top_minor), 0)

    def test_odd_response_reconstruction_matches_complete_inverse(self) -> None:
        t = identity(4)
        b_even: Matrix = (
            (Fraction(20), Fraction(1), Fraction(2), Fraction(3)),
            (Fraction(1), Fraction(21), Fraction(4), Fraction(5)),
            (Fraction(2), Fraction(4), Fraction(22), Fraction(6)),
            (Fraction(3), Fraction(5), Fraction(6), Fraction(23)),
        )
        beta: Vector = (Fraction(1), Fraction(1), Fraction(0), Fraction(0))
        eta: Vector = beta
        derivative_anchor: Vector = (
            Fraction(0), Fraction(0), Fraction(1), Fraction(1)
        )
        residual: Vector = derivative_anchor
        odd = subtract(
            b_even,
            subtract(outer(beta, eta), outer(derivative_anchor, residual)),
        )
        ridge = Fraction(1)
        odd_resolvent = inverse(add(odd, identity(4)))
        omega: Vector = (Fraction(1), Fraction(0), Fraction(0), Fraction(0))

        x = matvec(odd_resolvent, omega)
        y = matvec(odd_resolvent, beta)
        z = matvec(odd_resolvent, derivative_anchor)
        scalar_system: Matrix = (
            (1 + dot(eta, y), -dot(eta, z)),
            (dot(residual, y), 1 - dot(residual, z)),
        )
        scalar_rhs: Vector = (dot(eta, x), dot(residual, x))
        alpha, gamma = matvec(inverse(scalar_system), scalar_rhs)
        reconstructed = tuple(
            x[index] - alpha * y[index] + gamma * z[index]
            for index in range(4)
        )
        direct = matvec(inverse(add(b_even, identity(4))), omega)
        self.assertEqual(reconstructed, direct)
        self.assertNotEqual(determinant(scalar_system), 0)

    def test_nonzero_source_cauchy_family_and_phase_bulk_are_exact(self) -> None:
        n_max = 4
        indices = tuple(range(-n_max, n_max + 1))
        rho = Fraction(3)
        tau = Fraction(1, 10)
        displacement = {index: tau * index for index in indices}
        diagonal = {
            index: Fraction(0) if index == 0 else rho + tau
            for index in indices
        }
        q: Matrix = tuple(
            tuple(
                diagonal[n]
                if n == m
                else (displacement[n] - displacement[m]) / (n - m)
                for m in indices
            )
            for n in indices
        )

        for row, n in enumerate(indices):
            for column, m in enumerate(indices):
                self.assertEqual(q[row][column], q[-row - 1][-column - 1])
                self.assertEqual(
                    (n - m) * q[row][column],
                    displacement[n] - displacement[m],
                )
        self.assertNotEqual(displacement[1], 0)

        kappa: Vector = tuple(Fraction(index == 0) for index in indices)
        residual_vector = matvec(q, kappa)
        self.assertEqual(dot(residual_vector, residual_vector), 2 * n_max * tau * tau)

        omega = tuple(
            Fraction(1, 2)
            if abs(index) == 1
            else Fraction(-1, 2)
            if abs(index) == 2
            else Fraction(0)
            for index in indices
        )
        self.assertEqual(dot(omega, omega), 1)
        self.assertEqual(matvec(q, omega), tuple(rho * entry for entry in omega))

        # In normalized even-complement coordinates B=rho*I+2*tau*11^T.
        ones = tuple(Fraction(1) for _ in range(n_max))
        b_complement = add(
            scale(rho, identity(n_max)),
            scale(2 * tau, outer(ones, ones)),
        )
        ridge = Fraction(1)
        inverse_shifted = inverse(add(b_complement, scale(ridge, identity(n_max))))
        reciprocal_trace = trace(inverse_shifted)
        expected = Fraction(n_max - 1, 1) / (rho + ridge) + Fraction(1, 1) / (
            rho + ridge + 2 * tau * n_max
        )
        self.assertEqual(reciprocal_trace, expected)
        reserve = (rho + ridge) * reciprocal_trace
        self.assertGreater(reserve, n_max - 1)


class PilotDiagnosticTests(unittest.TestCase):
    def test_serialized_pilot_splits_into_graph_and_bulk(self) -> None:
        data = json.loads(PILOT.read_text(encoding="utf-8"))
        mp.mp.dps = 60

        def matrix(records):
            return mp.matrix([[mp.mpf(entry) for entry in row] for row in records])

        def vector(records):
            return mp.matrix([mp.mpf(entry) for entry in records])

        b = matrix(data["source_geometry"]["B_even_complement_at_q"])
        k = matrix(data["source_geometry"]["K_T_even_complement"])
        omega = vector(data["secant_geometry"]["omega_even_complement"])
        residual = mp.mpf(data["source_geometry"]["residual_r"])
        epsilon = mp.mpf(data["secant_geometry"]["epsilon"])
        c_squared = mp.mpf(data["secant_geometry"]["c2_fixed_window_capture"])

        e0 = mp.matrix(4, 1)
        e0[0] = 1
        sign = 1 if omega[0] >= 0 else -1
        householder = omega + sign * e0
        embedding = (
            mp.eye(4)
            - 2 * householder * householder.T / (householder.T * householder)[0]
        )[:, 1:]
        g = embedding.T * b * omega
        compressed = embedding.T * b * embedding
        denominator = compressed + residual * mp.eye(3)
        solve = mp.lu_solve(denominator, g)
        delta = epsilon + residual - (g.T * solve)[0]
        v = omega - embedding * solve
        k_f = embedding.T * k * embedding

        graph = (
            (epsilon + residual)
            * (v.T * k * v)[0]
            / (c_squared * delta)
        )
        bulk = (
            (epsilon + residual)
            * mp.fsum((mp.inverse(denominator) * k_f)[index, index] for index in range(3))
            / c_squared
        )
        total = graph + bulk

        self.assertLess(abs(delta - mp.mpf("7.9319998056225e-5")), mp.mpf("1e-16"))
        self.assertLess(abs(graph - mp.mpf("4.82538429942087")), mp.mpf("1e-12"))
        self.assertLess(abs(bulk - mp.mpf("0.00408762568893704")), mp.mpf("1e-14"))
        self.assertLess(
            abs(total - mp.mpf(data["reciprocal_soft_trace"]["reciprocal_crowding_reserve"])),
            mp.mpf("1e-12"),
        )
        self.assertGreater(graph, 1000 * bulk)


if __name__ == "__main__":
    unittest.main()
