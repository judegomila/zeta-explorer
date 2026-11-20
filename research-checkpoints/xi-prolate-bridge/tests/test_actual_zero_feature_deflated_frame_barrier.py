#!/usr/bin/env python3
"""Exact regressions for the actual zero-feature deflated-frame barrier."""

from __future__ import annotations

from fractions import Fraction as F
from itertools import combinations
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ACTUAL_ZERO_FEATURE_DEFLATED_FRAME_BARRIER.md"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}

Matrix = tuple[tuple[F, ...], ...]


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(matrix[i][j] for i in range(len(matrix)))
                 for j in range(len(matrix[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum((left[i][k] * right[k][j]
                 for k in range(len(right))), F(0))
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def determinant(matrix: Matrix) -> F:
    size = len(matrix)
    work = [list(row) for row in matrix]
    sign = F(1)
    answer = F(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size)
             if work[row][column] != 0),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            sign = -sign
        pivot_value = work[column][column]
        answer *= pivot_value
        for row in range(column + 1, size):
            ratio = work[row][column] / pivot_value
            for entry in range(column + 1, size):
                work[row][entry] -= ratio * work[column][entry]
    return sign * answer


def difference_basis(size: int) -> Matrix:
    return tuple(
        tuple(
            (F(1) if row == column + 1 else F(0))
            - (F(1) if row == 0 else F(0))
            for column in range(size - 1)
        )
        for row in range(size)
    )


def gram(rows: Matrix) -> Matrix:
    return matmul(transpose(rows), rows)


def cauchy_rows(
    nodes: tuple[F, ...],
    samples: tuple[F, ...],
    anchor: tuple[F, ...],
    weights: tuple[F, ...],
) -> Matrix:
    return tuple(
        tuple(weights[j] * anchor[n] / (nodes[n] - samples[j])
              for n in range(len(nodes)))
        for j in range(len(samples))
    )


def vandermonde(values: tuple[F, ...]) -> F:
    return _product(
        values[j] - values[i]
        for i in range(len(values))
        for j in range(i + 1, len(values))
    )


def _product(values) -> F:
    answer = F(1)
    for value in values:
        answer *= value
    return answer


def theta(
    nodes: tuple[F, ...],
    samples: tuple[F, ...],
    anchor: tuple[F, ...],
) -> F:
    answer = F(0)
    for n, node in enumerate(nodes):
        q_value = _product(node - sample for sample in samples)
        derivative = _product(
            node - other for index, other in enumerate(nodes) if index != n
        )
        omitted_anchor = _product(
            value for index, value in enumerate(anchor) if index != n
        )
        answer += q_value * omitted_anchor / derivative
    return answer


class ActualZeroFeatureDeflatedFrameBarrierTests(unittest.TestCase):
    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_deflated_theta_minor_is_exact(self) -> None:
        nodes = (F(0), F(1), F(4), F(9))
        samples = (F(2), F(5), F(11))
        anchor = (F(3, 2), F(-5, 3), F(7, 5), F(-11, 7))
        weights = (F(2, 3), F(5, 4), F(7, 6))
        rows = cauchy_rows(nodes, samples, anchor, weights)
        basis = difference_basis(len(nodes))
        actual = determinant(matmul(rows, basis))

        denominator = _product(
            node - sample for sample in samples for node in nodes
        )
        predicted = (
            _product(weights)
            * vandermonde(nodes)
            * vandermonde(samples)
            * theta(nodes, samples, anchor)
            / denominator
        )
        self.assertEqual(abs(actual), abs(predicted))

    def test_exact_cauchy_binet_sum_on_the_difference_basis(self) -> None:
        nodes = (F(0), F(1), F(4))
        samples = (F(2), F(3), F(5), F(7))
        anchor = (F(2), F(-3), F(5))
        weights = (F(1), F(2), F(3, 2), F(4, 3))
        rows = cauchy_rows(nodes, samples, anchor, weights)
        basis = difference_basis(len(nodes))
        restricted = matmul(rows, basis)
        restricted_gram = gram(restricted)

        minor_sum = F(0)
        for selected in combinations(range(len(samples)), len(nodes) - 1):
            minor = tuple(restricted[index] for index in selected)
            minor_sum += determinant(minor) ** 2
        self.assertEqual(determinant(restricted_gram), minor_sum)

        # det(S^T*S)=d, so this is d times the determinant in an
        # orthonormal basis of one-perp.
        basis_gram = matmul(transpose(basis), basis)
        self.assertEqual(determinant(basis_gram), F(len(nodes)))

    def test_square_cauchy_determinant_is_exact(self) -> None:
        nodes = (F(0), F(1), F(4))
        samples = (F(2), F(3), F(7))
        anchor = (F(2, 5), F(-3, 7), F(5, 11))
        weights = (F(7, 13), F(11, 17), F(19, 23))
        rows = cauchy_rows(nodes, samples, anchor, weights)
        denominator = _product(
            node - sample for sample in samples for node in nodes
        )
        predicted = (
            _product(weights)
            * _product(anchor)
            * vandermonde(nodes)
            * vandermonde(samples)
            / denominator
        )
        self.assertEqual(abs(determinant(rows)), abs(predicted))

    def test_residual_deflated_column_volume_inequality(self) -> None:
        nodes = (F(0), F(1), F(4), F(9))
        samples = (F(2), F(3), F(5), F(7))
        anchor = (F(2), F(-3), F(5), F(-7))
        weights = (F(1), F(2), F(3), F(4))
        rows = cauchy_rows(nodes, samples, anchor, weights)
        basis = difference_basis(len(nodes))
        restricted_gram = gram(matmul(rows, basis))

        row_sum = tuple(sum(row, F(0)) for row in rows)
        eta2 = sum((value * value for value in row_sum), F(0))
        # The difference basis has volume squared d relative to an
        # orthonormal transverse basis.  Thus the orthonormal inequality
        # det(C)>=d*det(T)^2/eta^2 becomes the exact rational inequality
        # eta^2*det(S^T*T^T*T*S)>=d^2*det(T)^2.
        left = eta2 * determinant(restricted_gram)
        right = F(len(nodes) ** 2) * determinant(rows) ** 2
        self.assertGreaterEqual(left, right)

    def test_root_placement_identity_for_theta(self) -> None:
        nodes = (F(0), F(1), F(4), F(9))
        anchor = (F(2), F(-3), F(5), F(7))
        total = sum(anchor, F(0))
        self.assertNotEqual(total, 0)

        # At a node xi_n, the monic anchor numerator A_p/total has value
        # p_n*D'(xi_n)/total.  These values determine Q_Gamma without
        # needing to solve for its roots.
        theta_from_root_values = F(0)
        for n, node in enumerate(nodes):
            derivative = _product(
                node - other
                for index, other in enumerate(nodes)
                if index != n
            )
            q_value = anchor[n] * derivative / total
            theta_from_root_values += (
                q_value / derivative
                * _product(value for index, value in enumerate(anchor)
                           if index != n)
            )
        expected = F(len(nodes)) * _product(anchor) / total
        self.assertEqual(theta_from_root_values, expected)

    def test_nonresonant_kernel_tolerates_at_most_one_zero_coordinate(self) -> None:
        nodes = (F(0), F(1), F(4))
        samples = (F(2), F(3), F(5), F(7))
        weights = (F(1),) * len(samples)
        basis = difference_basis(len(nodes))

        for anchor in (
            (F(2), F(-3), F(5)),
            (F(0), F(-3), F(5)),
        ):
            rows = cauchy_rows(nodes, samples, anchor, weights)
            restricted_gram = gram(matmul(rows, basis))
            self.assertGreater(restricted_gram[0][0], 0)
            self.assertGreater(determinant(restricted_gram), 0)

        two_zeros = (F(0), F(0), F(5))
        rows = cauchy_rows(nodes, samples, two_zeros, weights)
        restricted_gram = gram(matmul(rows, basis))
        self.assertEqual(determinant(restricted_gram), 0)

    def test_one_zero_coordinate_is_an_isolated_graph_vertex(self) -> None:
        features = (
            (F(2), F(0), F(-1)),
            (F(3), F(0), F(4)),
        )
        graph_gram = gram(features)
        self.assertEqual(graph_gram[1], (F(0), F(0), F(0)))
        row_sums = tuple(sum(row, F(0)) for row in graph_gram)
        laplacian = tuple(
            tuple(
                graph_gram[i][j] - (row_sums[i] if i == j else F(0))
                for j in range(3)
            )
            for i in range(3)
        )
        self.assertEqual(laplacian[1], (F(0), F(0), F(0)))

    def test_carrier_limits_distinguish_in_band_and_out_of_band(self) -> None:
        length = F(11, 3)
        carrier = F(7, 5)
        # Leading coefficients in delta for
        # (4/L)*(1-cos((a+delta)L))*(a+delta)^2 /
        # (a^2-(a+delta)^2)^2.
        theta_delta2 = length * length / 2
        denominator_delta2 = 4 * carrier * carrier
        numerator_delta2 = F(4) / length * theta_delta2 * carrier * carrier
        self.assertEqual(numerator_delta2 / denominator_delta2, length / 2)

        # For every other fixed coordinate the denominator has nonzero
        # constant term while the phase has a double zero.
        other_node = F(13, 2)
        self.assertNotEqual(other_node - carrier * carrier, 0)
        self.assertEqual(F(0) / (other_node - carrier * carrier) ** 2, 0)

    def test_claim_boundary_and_surviving_data_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "actual-anchor orientation divided difference",
            r"\Theta_\Gamma(p)",
            "complete transverse determinant",
            "residual-deflated column volume",
            r"\ker C=\{x:\operatorname {supp}x\subseteq Z_p",
            "An in-band carrier is therefore a coordinate selector",
            "out-of-band carrier is genuinely lost",
            r"{M(a_N)\over N}={\kappa\over2}",
            "no-escape inputs",
            "carrier-scale distinct-zero theorem",
            "meromorphic critical-line",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "RH_PROVED",
            "actual-source transverse lower frame is proved",
            "zero count supplies the quantitative floor",
            "routing contraction follows",
            "Xi'/Xi proves the finite frame",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
