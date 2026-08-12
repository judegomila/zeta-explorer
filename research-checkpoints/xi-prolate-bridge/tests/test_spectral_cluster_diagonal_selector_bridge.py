#!/usr/bin/env python3
"""Exact regressions for the spectral-cluster diagonal-selector bridge."""

from __future__ import annotations

from fractions import Fraction as F
from itertools import combinations
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SPECTRAL_CLUSTER_DIAGONAL_SELECTOR_BRIDGE.md"

Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def matmul(left: Matrix, right: Matrix) -> Matrix:
    columns = tuple(tuple(column) for column in zip(*right))
    return tuple(tuple(dot(row, column) for column in columns) for row in left)


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(column) for column in zip(*matrix))


def diagonal(entries: Vector) -> Matrix:
    return tuple(
        tuple(value if row == column else F(0) for column in range(len(entries)))
        for row, value in enumerate(entries)
    )


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def determinant(matrix: Matrix) -> F:
    work = [list(row) for row in matrix]
    result = F(1)
    for column in range(len(work)):
        pivot = next((row for row in range(column, len(work)) if work[row][column]), None)
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        value = work[column][column]
        result *= value
        for row in range(column + 1, len(work)):
            multiplier = work[row][column] / value
            for entry in range(column + 1, len(work)):
                work[row][entry] -= multiplier * work[column][entry]
    return result


def rank(matrix: Matrix) -> int:
    work = [list(row) for row in matrix]
    row = 0
    for column in range(len(work[0]) if work else 0):
        pivot = next((index for index in range(row, len(work)) if work[index][column]), None)
        if pivot is None:
            continue
        work[row], work[pivot] = work[pivot], work[row]
        value = work[row][column]
        for index in range(len(work)):
            if index == row or not work[index][column]:
                continue
            multiplier = work[index][column] / value
            for entry in range(column, len(work[index])):
                work[index][entry] -= multiplier * work[row][entry]
        row += 1
        if row == len(work):
            break
    return row


def principal_submatrix(matrix: Matrix, indices: tuple[int, ...]) -> Matrix:
    return tuple(tuple(matrix[row][column] for column in indices) for row in indices)


def is_psd(matrix: Matrix) -> bool:
    size = len(matrix)
    return all(
        determinant(principal_submatrix(matrix, indices)) >= 0
        for count in range(1, size + 1)
        for indices in combinations(range(size), count)
    )


def hadamard_square(matrix: Matrix) -> Matrix:
    return tuple(tuple(value * value for value in row) for row in matrix)


class SpectralClusterDiagonalSelectorBridgeTests(unittest.TestCase):
    def test_two_block_bounds_and_simplicity_gate(self) -> None:
        # P has rank one.  B has exact eigenpairs
        # (-1,(8,1)) and (2,(-1,8)).
        epsilon = F(62, 65)
        coupling = F(12, 31)
        outside = F(127, 65)
        chi = F(43, 31)  # exact row-sum operator-norm upper bound
        h = ((F(1), coupling), (coupling, F(0)))
        a = diagonal((F(0), outside))
        b = tuple(
            tuple(a[i][j] - epsilon * h[i][j] for j in range(2))
            for i in range(2)
        )
        self.assertEqual(matvec(b, (F(8), F(1))), (F(-8), F(-1)))
        self.assertEqual(matvec(b, (F(-1), F(8))), (F(-2), F(16)))

        delta = outside - epsilon * (chi - 1)
        rho = epsilon * coupling / delta
        q_sel = epsilon * coupling * coupling / delta
        self.assertEqual(delta, F(103, 65))
        self.assertLessEqual(F(1, 64), rho * rho)  # actual (z/y)^2
        self.assertLess(rho * rho + q_sel * q_sel, F(1, 2))
        self.assertTrue(is_psd(((chi - 1, -coupling), (-coupling, chi))))
        self.assertTrue(is_psd(((chi + 1, coupling), (coupling, chi))))

    def test_three_block_rho_and_q_inequalities(self) -> None:
        # P=span(e1,e2), R=span(e3), v=e1.  The unique ground is
        # beta=-3 with vector (2,1,1).
        a = diagonal((F(0), F(1), F(6)))
        h = (
            (F(1), F(0), F(1)),
            (F(0), F(0), F(2)),
            (F(1), F(2), F(1, 2)),
        )
        epsilon = F(2)
        b = tuple(
            tuple(a[i][j] - epsilon * h[i][j] for j in range(3))
            for i in range(3)
        )
        ground = (F(2), F(1), F(1))
        self.assertEqual(matvec(b, ground), tuple(-3 * value for value in ground))
        shifted = tuple(
            tuple(b[i][j] + (F(3) if i == j else F(0)) for j in range(3))
            for i in range(3)
        )
        self.assertTrue(is_psd(shifted))
        self.assertEqual(rank(shifted), 2)

        w, outside, chi, coupling_squared = F(1), F(6), F(3), F(5)
        delta = outside - w - epsilon * (chi - 1)
        rho_squared = epsilon * epsilon * coupling_squared / (delta * delta)
        q_sel = (w + epsilon * epsilon * coupling_squared / delta) / (epsilon - w)
        self.assertEqual(delta, F(1))
        self.assertLessEqual(F(1, 5), rho_squared)  # ||z||^2/||y||^2
        self.assertLessEqual(F(1, 5), q_sel * q_sel)  # ||r||^2/||y||^2
        self.assertTrue(is_psd(tuple(
            tuple((F(3) if i == j else F(0)) - h[i][j] for j in range(3))
            for i in range(3)
        )))
        self.assertTrue(is_psd(tuple(
            tuple((F(3) if i == j else F(0)) + h[i][j] for j in range(3))
            for i in range(3)
        )))

    def test_hadamard_projector_rank_and_exact_cost(self) -> None:
        # P=I-nn^T for the rational unit normal n=(1,2,2)/3.
        normal = (F(1, 3), F(2, 3), F(2, 3))
        identity = diagonal((F(1), F(1), F(1)))
        nn = outer(normal, normal)
        p = tuple(
            tuple(identity[i][j] - nn[i][j] for j in range(3))
            for i in range(3)
        )
        gram = hadamard_square(p)
        self.assertEqual(rank(p), 2)
        self.assertEqual(rank(gram), 3)

        p_e0 = tuple(row[0] for row in p)
        p00 = p[0][0]
        target = tuple(tuple(x * y / p00 for y in p_e0) for x in p_e0)
        h = (F(9, 8), F(0), F(0))
        compressed = matmul(matmul(p, diagonal(h)), p)
        self.assertEqual(compressed, target)
        # Invertibility of P o P makes this realization unique.
        self.assertEqual(max(abs(value) for value in h), F(9, 8))

    def test_empty_shell_capture_is_exact_but_not_a_bottom_theorem(self) -> None:
        spectrum = (F(-30), F(-3), F(3), F(30))
        squared_weights = (F(0), F(1, 2), F(1, 2), F(0))
        rayleigh = sum((value * weight for value, weight in zip(spectrum, squared_weights)), F())
        residual_squared = sum(
            ((value - rayleigh) ** 2 * weight for value, weight in zip(spectrum, squared_weights)),
            F(),
        )
        self.assertEqual(rayleigh, 0)
        self.assertEqual(residual_squared, 9)

        eta, ratio, base = F(1, 2), F(3), F(2)
        distances = tuple(abs(value - rayleigh) for value in spectrum)
        empty = next(
            index
            for index in range(len(spectrum) + 1)
            if not any(base * ratio**index < value < base * ratio ** (index + 1) for value in distances)
        )
        self.assertEqual(empty, 1)
        inner = base * ratio**empty
        outer_radius = inner * ratio
        captured = tuple(value <= inner for value in distances)
        leakage_squared = sum(
            (weight for weight, keep in zip(squared_weights, captured) if not keep), F()
        )
        self.assertLessEqual(leakage_squared, eta * eta)
        self.assertTrue(all(
            keep or value >= outer_radius for value, keep in zip(distances, captured)
        ))
        captured_spectrum = tuple(value for value, keep in zip(spectrum, captured) if keep)
        self.assertLess(min(spectrum), min(captured_spectrum))
        self.assertGreater(max(spectrum), max(captured_spectrum))

        # An eigenvalue at the outer endpoint remains outside.  For this
        # proper bottom cluster, only the exterior separation G-w has the
        # claimed lower bound; G >= (rho+1)*a would be false.
        endpoint_spectrum = (F(-1, 10), F(1, 10), F(2))
        a_endpoint, rho_endpoint = F(1), F(2)
        endpoint_keep = tuple(abs(value) <= a_endpoint for value in endpoint_spectrum)
        self.assertEqual(endpoint_keep, (True, True, False))
        width = F(1, 5)
        exterior_floor = F(21, 10)
        self.assertGreaterEqual(exterior_floor - width, (rho_endpoint - 1) * a_endpoint)
        self.assertLess(exterior_floor, (rho_endpoint + 1) * a_endpoint)

    def test_fixed_dimension_conditioning_and_wrong_scale(self) -> None:
        products = []
        for denominator in (2, 3, 5, 8):
            t = F(1, denominator)
            t2 = t * t
            a2 = 1 - 2 * t2
            chi = 1 / (4 * t2)
            h = (1 / (2 * a2), 1 / (2 * a2), chi, -chi)
            compressed = (
                (a2 * h[0] + t2 * (h[2] + h[3]), t2 * (h[2] - h[3])),
                (t2 * (h[2] - h[3]), a2 * h[1] + t2 * (h[2] + h[3])),
            )
            self.assertEqual(compressed, ((F(1, 2), F(1, 2)), (F(1, 2), F(1, 2))))
            self.assertGreaterEqual(max(abs(value) for value in h), chi)
            self.assertEqual(t2 * chi * chi, 1 / (16 * t2))
            products.append(t2 * chi * chi)
        self.assertTrue(all(left < right for left, right in zip(products, products[1:])))

        # The same exact frame with cluster width t^3 rejects w*chi/G.
        shortcuts = []
        correct = []
        for denominator in (4, 8, 16, 32):
            t = F(1, denominator)
            chi = 1 / (4 * t * t)
            width = t**3
            shortcuts.append(width * chi)
            correct.append(width * chi * chi)
        self.assertTrue(all(left > right for left, right in zip(shortcuts, shortcuts[1:])))
        self.assertTrue(all(left < right for left, right in zip(correct, correct[1:])))

    def test_source_cauchy_atom_conditioning_asymptotic(self) -> None:
        scaled_masses = []
        scaled_costs = []
        for denominator in (10, 100, 1000, 10000):
            tau = F(1, denominator)
            first = 2 * tau * tau / (tau + 1) ** 2
            second = 2 * tau * tau / (tau + 4) ** 2
            tail = first + second
            p0 = tail / (1 + tail)
            squares = (1 / (1 + tail), first / (1 + tail), second / (1 + tail))
            gram = tuple(
                tuple(
                    (1 - squares[i]) ** 2 if i == j else squares[i] * squares[j]
                    for j in range(3)
                )
                for i in range(3)
            )
            self.assertEqual(determinant(gram), 2 * squares[0] * squares[1] * squares[2])
            self.assertGreater(determinant(gram), 0)
            chi = 1 / p0
            scaled_masses.append(p0 / (tau * tau))
            scaled_costs.append(chi * tau * tau)
        self.assertTrue(all(left < right for left, right in zip(scaled_masses, scaled_masses[1:])))
        self.assertTrue(all(left > right for left, right in zip(scaled_costs, scaled_costs[1:])))
        self.assertLess(abs(scaled_masses[-1] - F(17, 8)), F(1, 1000))
        self.assertLess(abs(scaled_costs[-1] - F(8, 17)), F(1, 1000))

    def test_high_multiplicity_dimension_obstruction_and_claim_boundary(self) -> None:
        p = diagonal((F(1), F(1), F(1)))
        self.assertEqual(rank(hadamard_square(p)), 3)
        self.assertLess(3, 3 * (3 + 1) // 2)
        # Diagonal compression cannot realize the off-diagonal entries of vv*.
        uniform_target = tuple(tuple(F(1, 3) for _ in range(3)) for _ in range(3))
        self.assertTrue(any(uniform_target[i][j] for i in range(3) for j in range(3) if i != j))

        text = NOTE.read_text(encoding="utf-8")
        required = (
            "\\Delta=G-w-\\epsilon(\\chi-1)",
            "w\\chi^2",
            "m(m+1)/2<=N+1",
            "\\operatorname{rank}(P\\circ P)",
            "dimension at least three",
            "forbids this surjectivity",
            "Diagonal source-Cauchy selector cost can diverge",
            "\\chi_v=\\inf",
            "Nothing below is an RH proof",
            "conditional reduction only",
            "no RH conclusion",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        self.assertIn("w*chi/G", text)
        self.assertNotIn("RH_PROVED", text)
        self.assertNotIn("establishes the Riemann hypothesis", text)


if __name__ == "__main__":
    unittest.main()
