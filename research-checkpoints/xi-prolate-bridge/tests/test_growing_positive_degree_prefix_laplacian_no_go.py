#!/usr/bin/env python3
"""Exact regressions for the growing positive-degree Laplacian no-go."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_POSITIVE_DEGREE_PREFIX_LAPLACIAN_NO_GO.md"
PACKAGE_FILES = (NOTE, Path(__file__).resolve())

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def edge_weights(
    p: tuple[F, ...],
    t: tuple[F, ...],
    c: tuple[F, ...],
) -> dict[tuple[int, int], F]:
    """Return exact anchored weighted-Loewner/source-Cauchy edges."""
    assert len(p) == len(t) == len(c)
    return {
        (i, j): -p[i] * p[j] * (c[i] - c[j]) / (t[i] - t[j])
        for i in range(len(p))
        for j in range(i + 1, len(p))
    }


def parity_source_cauchy_weights(
    p: tuple[F, ...],
    c: tuple[F, ...],
) -> dict[tuple[int, int], F]:
    """Rebuild the same edges from the raw odd displacement b_n=c_n/n."""
    b = tuple(F(0) if n == 0 else c[n] / n for n in range(len(c)))
    weights: dict[tuple[int, int], F] = {}
    for j in range(1, len(p)):
        # A_(0j)=sqrt(2)*b_j/j and kappa_j=p_j/sqrt(2).
        weights[0, j] = -p[0] * p[j] * b[j] / j
    for i in range(1, len(p)):
        for j in range(i + 1, len(p)):
            # A_(ij)=2*(i*b_i-j*b_j)/(i^2-j^2); the two sqrt(2)
            # factors in the anchor coordinates cancel its factor two.
            weights[i, j] = (
                -p[i] * p[j] * (i * b[i] - j * b[j])
                / (i * i - j * j)
            )
    return weights


def degrees(size: int, weights: dict[tuple[int, int], F]) -> tuple[F, ...]:
    return tuple(
        sum(
            (weights[min(i, j), max(i, j)] for j in range(size) if j != i),
            F(0),
        )
        for i in range(size)
    )


def laplacian(size: int, weights: dict[tuple[int, int], F]):
    matrix = [[F(0) for _ in range(size)] for _ in range(size)]
    for (i, j), weight in weights.items():
        matrix[i][i] += weight
        matrix[j][j] += weight
        matrix[i][j] -= weight
        matrix[j][i] -= weight
    return tuple(tuple(row) for row in matrix)


def positive_components(size: int, weights: dict[tuple[int, int], F]):
    adjacency = [set() for _ in range(size)]
    for (i, j), weight in weights.items():
        if weight > 0:
            adjacency[i].add(j)
            adjacency[j].add(i)
    unseen = set(range(size))
    components: list[tuple[int, ...]] = []
    while unseen:
        root = min(unseen)
        seen = {root}
        stack = [root]
        unseen.remove(root)
        while stack:
            i = stack.pop()
            for j in adjacency[i]:
                if j not in seen:
                    seen.add(j)
                    unseen.discard(j)
                    stack.append(j)
        components.append(tuple(sorted(seen)))
    return tuple(components)


def growing_data(N: int, q: F, epsilon: F):
    assert N >= 3 and N % 2 == 1
    assert 0 < epsilon <= q
    p = (F(1),) + tuple(F(2 * (-1) ** i) for i in range(1, N)) + (F(-1),)
    t = tuple(F(i * i) for i in range(N + 1))
    c = tuple(q * t[i] + (epsilon if i == 2 else F(0)) for i in range(N + 1))
    return p, t, c


def fraction_text(value: F) -> str:
    return f"{value.numerator}/{value.denominator}"


def canonical_certificate(
    p: tuple[F, ...],
    t: tuple[F, ...],
    c: tuple[F, ...],
) -> str:
    weights = edge_weights(p, t, c)
    payload = {
        "p": [fraction_text(value) for value in p],
        "t": [fraction_text(value) for value in t],
        "c": [fraction_text(value) for value in c],
        "b": [
            "0/1" if i == 0 else fraction_text(c[i] / i)
            for i in range(len(c))
        ],
        "weights": {
            f"{i},{j}": fraction_text(value)
            for (i, j), value in sorted(weights.items())
        },
        "degrees": [
            fraction_text(value) for value in degrees(len(p), weights)
        ],
    }
    return json.dumps(payload, sort_keys=True, separators=(",", ":"))


class GrowingPositiveDegreePrefixLaplacianNoGoTests(unittest.TestCase):
    def test_package_files_contain_no_raw_control_bytes(self) -> None:
        for path in PACKAGE_FILES:
            bad = [
                (offset, byte)
                for offset, byte in enumerate(path.read_bytes())
                if (byte < 32 and byte != 10) or byte == 127
            ]
            self.assertEqual(bad, [], path)

    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_disconnected_source_cauchy_fixture_is_exact(self) -> None:
        p = (F(2), F(3), F(-2), F(3))
        t = (F(0), F(1), F(4), F(9))
        c = (F(0), F(-73), F(-77), F(0))
        weights = edge_weights(p, t, c)
        self.assertEqual(
            weights,
            {
                (0, 1): F(438),
                (0, 2): F(-77),
                (0, 3): F(0),
                (1, 2): F(-8),
                (1, 3): F(-657, 8),
                (2, 3): F(462, 5),
            },
        )
        self.assertEqual(
            degrees(4, weights),
            (F(361), F(2783, 8), F(37, 5), F(411, 40)),
        )
        self.assertEqual(positive_components(4, weights), ((0, 1), (2, 3)))

    def test_source_cauchy_serialization_is_canonical(self) -> None:
        disconnected = canonical_certificate(
            (F(2), F(3), F(-2), F(3)),
            (F(0), F(1), F(4), F(9)),
            (F(0), F(-73), F(-77), F(0)),
        )
        growing = canonical_certificate(*growing_data(5, F(7, 5), F(2, 7)))
        # Filled with immutable exact digests after independent calculation.
        self.assertEqual(
            hashlib.sha256(disconnected.encode("ascii")).hexdigest(),
            "19c464362d7d81e9792cccdf3386e0b02273387650ef63bf66a56d0512e7e4ca",
        )
        self.assertEqual(
            hashlib.sha256(growing.encode("ascii")).hexdigest(),
            "2816d959449fd0bcf24c9cf4b3a9882f4d1c58dcd8392d5bcf9339223341fc9f",
        )

    def test_weighted_loewner_edges_equal_raw_parity_source_cauchy_edges(self) -> None:
        fixtures = (
            (
                (F(2), F(3), F(-2), F(3)),
                (F(0), F(1), F(4), F(9)),
                (F(0), F(-73), F(-77), F(0)),
            ),
            growing_data(9, F(17, 13), F(5, 19)),
        )
        for p, t, c in fixtures:
            self.assertEqual(
                edge_weights(p, t, c),
                parity_source_cauchy_weights(p, c),
            )

    def test_growing_family_has_the_fixed_mode_pattern_and_zero_sum(self) -> None:
        for N in (3, 5, 9, 21):
            p, _, _ = growing_data(N, F(1), F(1, 7))
            self.assertEqual(sum(p, F(0)), F(0))
            self.assertEqual(p[0], F(1))
            for i in range(1, N):
                self.assertEqual(p[i], F(2 * (-1) ** i))
            self.assertEqual(p[N], F(-1))

    def test_every_growing_family_degree_is_positive(self) -> None:
        cases = (
            (3, F(1), F(1)),
            (5, F(7, 5), F(2, 7)),
            (21, F(13, 11), F(13, 11)),
            (101, F(5, 3), F(1, 1000)),
        )
        for N, q, epsilon in cases:
            p, t, c = growing_data(N, q, epsilon)
            actual = degrees(N + 1, edge_weights(p, t, c))
            self.assertTrue(all(value > 0 for value in actual), (N, actual))
            self.assertEqual(actual[0], q - epsilon / 2)
            self.assertEqual(actual[1], 4 * q + 4 * epsilon / 3)

    def test_positive_graph_is_connected_for_every_sampled_size(self) -> None:
        for N in (3, 5, 7, 15, 51):
            p, t, c = growing_data(N, F(11, 7), F(3, 8))
            weights = edge_weights(p, t, c)
            self.assertEqual(positive_components(N + 1, weights), (tuple(range(N + 1)),))
            # Every opposite-sign edge is positive, the spanning bipartite core.
            for (i, j), weight in weights.items():
                if p[i] * p[j] < 0:
                    self.assertGreater(weight, 0, (N, i, j, weight))

    def test_fixed_two_by_two_principal_minor_is_negative(self) -> None:
        for N, q, epsilon in (
            (3, F(1), F(1)),
            (9, F(7, 3), F(2, 5)),
            (31, F(19, 11), F(1, 100)),
        ):
            p, t, c = growing_data(N, q, epsilon)
            weights = edge_weights(p, t, c)
            matrix = laplacian(N + 1, weights)
            self.assertEqual(matrix[0][0], q - epsilon / 2)
            self.assertEqual(matrix[1][1], 4 * q + 4 * epsilon / 3)
            self.assertEqual(matrix[0][1], -2 * q)
            determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] ** 2
            self.assertEqual(determinant, -F(2, 3) * epsilon * (q + epsilon))
            self.assertLess(determinant, 0)

    def test_negative_energy_forces_routing_norm_above_one(self) -> None:
        N, q, epsilon = 9, F(1), F(1, 10)
        p, t, c = growing_data(N, q, epsilon)
        weights = edge_weights(p, t, c)
        matrix = laplacian(N + 1, weights)
        d0 = matrix[0][0]
        vector = (2 * q, d0) + (F(0),) * (N - 1)
        energy = sum(
            (vector[i] * matrix[i][j] * vector[j]
             for i in range(N + 1) for j in range(N + 1)),
            F(0),
        )
        expected_det = -F(2, 3) * epsilon * (q + epsilon)
        self.assertEqual(energy, d0 * expected_det)
        self.assertLess(energy, 0)

        positive_energy = F(0)
        negative_energy = F(0)
        for (i, j), weight in weights.items():
            contribution = abs(weight) * (vector[i] - vector[j]) ** 2
            if weight > 0:
                positive_energy += contribution
            elif weight < 0:
                negative_energy += contribution
        self.assertGreater(positive_energy, 0)
        self.assertEqual(energy, positive_energy - negative_energy)
        self.assertGreater(negative_energy / positive_energy, 1)

    def test_rank_one_limits_do_not_sign_the_minor(self) -> None:
        q = F(1)
        for denominator in (10, 100, 1000, 10000):
            epsilon = F(1, denominator)
            p, t, c = growing_data(5, q, epsilon)
            weights = edge_weights(p, t, c)
            actual = degrees(6, weights)
            self.assertEqual(actual[1] / actual[0],
                             (4 * q + 4 * epsilon / 3) / (q - epsilon / 2))
            self.assertEqual(weights[0, 1] / actual[0], 2 * q / (q - epsilon / 2))
            normalized_minor = actual[0] * actual[1] - weights[0, 1] ** 2
            self.assertEqual(normalized_minor,
                             -F(2, 3) * epsilon * (q + epsilon))
            self.assertLess(normalized_minor, 0)

    def test_scaling_can_beat_any_absolute_displacement_rate(self) -> None:
        N = 101
        q, epsilon = F(1), F(1, 100)
        p, t, c = growing_data(N, q, epsilon)
        tiny = F(1, 10**100)
        scaled_c = tuple(tiny * value for value in c)
        b = tuple(F(0) if i == 0 else scaled_c[i] / i for i in range(N + 1))
        self.assertLess(max(abs(value) for value in b), F(1, 10**97))

        original = edge_weights(p, t, c)
        scaled = edge_weights(p, t, scaled_c)
        for edge in original:
            self.assertEqual(scaled[edge], tiny * original[edge])
            self.assertEqual(scaled[edge] > 0, original[edge] > 0)

    def test_claim_boundary_and_surviving_matrix_gate_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "positive degrees do not force positive connectivity",
            r"d_i d_j-w_{ij}^2\geq0",
            r"L_w^{(r)}\succ0",
            r"\det L_w[\{0,1\}]",
            r"\|S\|_{\rm op}>1",
            r"{d_1\over d_0}\longrightarrow4",
            "positive centered-zero Gram decomposition is RH-conditional",
            "synthetic combined-displacement matrices",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "RH_PROVED",
            "positive degrees imply connectivity",
            "positive degrees imply routing contraction",
            "the pinned arithmetic source is indefinite",
            "equation (5.2) is proved",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
