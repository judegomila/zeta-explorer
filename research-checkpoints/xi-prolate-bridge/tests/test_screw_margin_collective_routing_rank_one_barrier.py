#!/usr/bin/env python3
"""Exact regressions for the screw-margin collective-routing barrier.

Only standard-library rational arithmetic is used.  The smooth no-go is a
synthetic cosine-moment profile, never a purported arithmetic Weil matrix.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SCREW_MARGIN_COLLECTIVE_ROUTING_RANK_ONE_BARRIER.md"

LOCK_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def weights_from_p_a(
    p: tuple[F, ...], a: tuple[F, ...], length: F
) -> dict[tuple[int, int], F]:
    weights: dict[tuple[int, int], F] = {}
    for i in range(len(p)):
        for j in range(i + 1, len(p)):
            quotient = (F(i * i) * a[i] - F(j * j) * a[j]) \
                / F(i * i - j * j)
            weights[i, j] = F(2) * p[i] * p[j] * quotient / length
    return weights


def weights_from_p_c(
    p: tuple[F, ...], c: tuple[F, ...]
) -> dict[tuple[int, int], F]:
    weights: dict[tuple[int, int], F] = {}
    for i in range(len(p)):
        for j in range(i + 1, len(p)):
            weights[i, j] = -p[i] * p[j] * (c[i] - c[j]) \
                / F(i * i - j * j)
    return weights


def degree(weights: dict[tuple[int, int], F], vertex: int) -> F:
    return sum(
        (weight for edge, weight in weights.items() if vertex in edge),
        F(0),
    )


def graph_energy(
    weights: dict[tuple[int, int], F], vector: tuple[F, ...]
) -> F:
    return sum(
        (
            weight * (vector[i] - vector[j]) ** 2
            for (i, j), weight in weights.items()
        ),
        F(0),
    )


def positive_graph_connected(
    weights: dict[tuple[int, int], F], vertex_count: int
) -> bool:
    adjacency = [set() for _ in range(vertex_count)]
    for (i, j), weight in weights.items():
        if weight > 0:
            adjacency[i].add(j)
            adjacency[j].add(i)
    seen = {0}
    stack = [0]
    while stack:
        i = stack.pop()
        for j in adjacency[i] - seen:
            seen.add(j)
            stack.append(j)
    return len(seen) == vertex_count


class ScrewMarginCollectiveRoutingRankOneBarrierTests(unittest.TestCase):
    def test_claim_boundary_and_actual_synthetic_separation(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "all-edge and all-vertex normal form",
            "minimum-norm routing lies exactly on the\nnoncontractive boundary",
            "is **not** the pinned\npole--archimedean--minus-prime source",
            "scalar all-order cancellation alone are\nlogically insufficient",
            "P0_INVALIDATED",
            "1<n<=lambda^2",
            r"w_{ij}={2p_ip_j\over L}",
            r"d_k={2p_k\over L}",
            r"L_w={2\Psi\over L}",
            r"\|B_+^\dagger B_-\|_{\rm op}=1",
            "fixed-edge limits",
            "RH-conditional fixed-frequency locking",
            r"A_n(L)-g(L)=O_n(L^{-1})",
            r"0,\quad4-2\sqrt 7,\quad4+2\sqrt 7",
            r"E_k=o(|p_k|\Psi)",
            "exact scalar flatness do not route",
            r"A_0=-\eta,\qquad J_L=0",
            r"\|B_+^\dagger B_-\|_{\rm op}^2>Q",
            "not an arithmetic counterexample",
            "moment-difference operator",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "RH_PROVED",
            "Riemann hypothesis is proved",
            "actual-source routing contraction holds",
            "actual-source vertex-1 sign is positive",
            "all actual-source vertices are positive",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in LOCK_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_all_edge_and_all_vertex_formulas_are_exact(self) -> None:
        length = F(14)
        p = (F(3, 5), F(-7, 11), F(13, 17), F(-19, 23), F(29, 31))
        a = (F(-2, 3), F(5, 7), F(-11, 13), F(17, 19), F(-23, 29))
        c = (F(0),) + tuple(
            -F(2 * n * n) * a[n] / length for n in range(1, len(a))
        )
        from_a = weights_from_p_a(p, a, length)
        from_c = weights_from_p_c(p, c)
        self.assertEqual(from_a, from_c)

        sqrt_l_j = sum((p[n] * a[n] for n in range(len(p))), F(0))
        for k in range(len(p)):
            t_k = F(0) if k == 0 else F(k * k) * sum(
                (
                    p[j] * (a[k] - a[j]) / F(k * k - j * j)
                    for j in range(len(p)) if j != k
                ),
                F(0),
            )
            reduced = F(2) * p[k] * (sqrt_l_j - p[k] * a[k] + t_k) \
                / length
            self.assertEqual(degree(from_a, k), reduced)

            error = sqrt_l_j - p[k] * (a[k] - a[0]) + t_k
            screw_form = -F(2) * p[k] ** 2 * a[0] / length \
                + F(2) * p[k] * error / length
            self.assertEqual(reduced, screw_form)

    def test_collective_matrix_decomposition_as_quadratic_forms(self) -> None:
        length = F(10)
        p = (F(2), F(-3), F(5), F(-7))
        a = (F(-4, 3), F(11, 7), F(-13, 9), F(17, 11))
        weights = weights_from_p_a(p, a, length)
        screw = -a[0]
        total_p = sum(p, F(0))
        delta = tuple(value - a[0] for value in a)
        correction = weights_from_p_a(p, delta, length)

        vectors = (
            (F(1), F(0), F(0), F(0)),
            (F(1), F(-2), F(3), F(-5)),
            (F(7, 3), F(11, 5), F(-13, 7), F(17, 9)),
        )
        for vector in vectors:
            scalar_form = F(2) * screw / length * (
                sum((p[i] * vector[i] for i in range(len(p))), F(0)) ** 2
                - total_p * sum(
                    (p[i] * vector[i] ** 2 for i in range(len(p))), F(0)
                )
            )
            self.assertEqual(
                graph_energy(weights, vector),
                scalar_form + graph_energy(correction, vector),
            )

    def test_ideal_locking_is_rank_one_with_extra_kernel(self) -> None:
        length = F(12)
        screw = F(5, 2)
        # Sum zero, both signs, and two positive coordinates.
        p = (F(1), F(-3), F(2))
        a = (-screw, -screw, -screw)
        weights = weights_from_p_a(p, a, length)
        self.assertTrue(positive_graph_connected(weights, len(p)))
        self.assertGreater(weights[0, 1], 0)
        self.assertGreater(weights[1, 2], 0)
        self.assertLess(weights[0, 2], 0)

        # v is nonconstant and p-orthogonal, so the rank-one energy vanishes.
        vector = (F(3), F(1), F(0))
        self.assertEqual(sum((p[i] * vector[i] for i in range(3)), F(0)), 0)
        self.assertEqual(graph_energy(weights, vector), 0)

        for trial in (
            (F(1), F(0), F(0)),
            (F(2), F(-1), F(4)),
            (F(-3), F(5), F(7)),
        ):
            expected = F(2) * screw / length * sum(
                (p[i] * trial[i] for i in range(3)), F(0)
            ) ** 2
            self.assertEqual(graph_energy(weights, trial), expected)

    def test_smooth_margin_flat_counterfamily_is_exact(self) -> None:
        length = F(12)
        eta = F(3)
        p = (F(1), F(-2), F(2), F(-3), F(5))
        delta = F(1, 10_000)
        c_list = [F(0), delta, F(0)]
        c_list.extend(-delta if entry > 0 else delta for entry in p[3:])
        tail = sum(
            (p[j] * c_list[j] / F(j * j) for j in range(3, len(p))),
            F(0),
        )
        c_list[2] = F(4) / p[2] * (
            -F(2) * p[0] * eta / length - p[1] * c_list[1] - tail
        )
        c = tuple(c_list)
        self.assertLess(c[2], 0)

        a = (-eta,) + tuple(
            -length * c[n] / F(2 * n * n) for n in range(1, len(c))
        )
        self.assertEqual(sum((p[n] * a[n] for n in range(len(p))), F(0)), 0)

        weights = weights_from_p_c(p, c)
        self.assertEqual(weights, weights_from_p_a(p, a, length))
        self.assertTrue(positive_graph_connected(weights, len(p)))
        for j in range(1, len(p)):
            self.assertGreater(weights[0, j], 0)

        d0 = degree(weights, 0)
        d1 = degree(weights, 1)
        self.assertEqual(d0, F(2) * p[0] ** 2 * eta / length)
        self.assertGreater(d0, 0)
        self.assertLess(d1, 0)

        positive_at_one = sum(
            (w for edge, w in weights.items() if 1 in edge and w > 0), F(0)
        )
        negative_at_one = sum(
            (-w for edge, w in weights.items() if 1 in edge and w < 0), F(0)
        )
        self.assertEqual(positive_at_one, weights[0, 1])
        self.assertGreater(negative_at_one / positive_at_one, F(1000))
        self.assertEqual(d1, positive_at_one - negative_at_one)

    def test_fixed_edge_parity_constants(self) -> None:
        # Strip the common C^2*Psi/L^2 factor from the ideal fixed-mode
        # asymptotic.  Index zero has amplitude 1; positive indices have 2.
        amplitudes = tuple([F(1)] + [F(2) * (-1) ** n for n in range(1, 8)])
        for j in range(1, len(amplitudes)):
            normalized = -F(2) * amplitudes[0] * amplitudes[j]
            self.assertEqual(normalized, -F(4) * (-1) ** j)
        for i in range(1, len(amplitudes)):
            for j in range(i + 1, len(amplitudes)):
                normalized = -F(2) * amplitudes[i] * amplitudes[j]
                self.assertEqual(normalized, -F(8) * (-1) ** (i + j))

    def test_rh_fixed_frequency_bound_uses_a_summable_majorant(self) -> None:
        # If a<=gamma/2, product-to-sum bounds the oscillatory integral by
        # 1/(gamma+a)+1/(gamma-a)<=3/gamma.  Multiplication by the
        # screw coefficient gamma^(-2) leaves a gamma^(-3) majorant.
        for gamma, a in ((F(5), F(1)), (F(11, 3), F(1, 2)),
                         (F(17, 5), F(3, 4))):
            self.assertLessEqual(a, gamma / 2)
            bound = 1 / (gamma + a) + 1 / (gamma - a)
            self.assertLessEqual(bound, F(3) / gamma)
            self.assertLessEqual(bound / gamma**2, F(3) / gamma**3)

    def test_three_vertex_fixed_prefix_is_indefinite(self) -> None:
        q = (F(1), F(-2), F(2))
        total = sum(q, F(0))
        matrix = tuple(
            tuple(
                q[i] * q[j] - (total * q[i] if i == j else F(0))
                for j in range(3)
            )
            for i in range(3)
        )
        self.assertEqual(matrix, (
            (F(0), F(-2), F(2)),
            (F(-2), F(6), F(-4)),
            (F(2), F(-4), F(2)),
        ))
        self.assertEqual(tuple(sum(row, F(0)) for row in matrix), (F(0),) * 3)
        self.assertEqual(sum(matrix[i][i] for i in range(3)), F(8))

        # The product of the two nonzero eigenvalues is -12, so one is
        # negative; their sum 8 gives 4 +/- 2*sqrt(7).
        principal_two_sum = (
            matrix[0][0] * matrix[1][1] - matrix[0][1] ** 2
            + matrix[0][0] * matrix[2][2] - matrix[0][2] ** 2
            + matrix[1][1] * matrix[2][2] - matrix[1][2] ** 2
        )
        self.assertEqual(principal_two_sum, F(-12))


if __name__ == "__main__":
    unittest.main()
