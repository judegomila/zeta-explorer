#!/usr/bin/env python3
"""Standard-library regressions for fixed-prefix edge synchronization."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_PREFIX_EDGE_SIGN_SYNCHRONIZATION.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md":
        "14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md":
        "cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d",
}


def diagonal_root(iterations: int = 100) -> float:
    """First positive root of 3*sin(x)+x*cos(x)."""
    left = math.pi / 2
    right = math.pi
    for _ in range(iterations):
        middle = (left + right) / 2
        value = 3 * math.sin(middle) + middle * math.cos(middle)
        if value > 0:
            left = middle
        else:
            right = middle
    return (left + right) / 2


def cross_root(ratio: float, iterations: int = 100) -> float:
    """Unique root of sin(y)-r^3*sin(r*y) in (x0, pi)."""
    if ratio == 0:
        return math.pi
    left = diagonal_root()
    right = math.pi
    for _ in range(iterations):
        middle = (left + right) / 2
        value = math.sin(middle) - ratio**3 * math.sin(ratio * middle)
        if value > 0:
            left = middle
        else:
            right = middle
    return (left + right) / 2


def cross_kernel(i: int, j: int, length: float, u: float) -> float:
    """Closed cross-correction kernel for 0 <= i < j."""
    a_i = 2 * math.pi * i / length
    a_j = 2 * math.pi * j / length
    return (
        a_j**3 * math.sin(a_j * u)
        - a_i**3 * math.sin(a_i * u)
    ) / (a_j**2 - a_i**2)


class FixedPrefixEdgeSignSynchronizationTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_resolvent_filter_and_edge_identities_are_exact(self) -> None:
        p_value = F(17, 5)
        q_i = F(3, 7)
        q_j = F(11, 13)
        t_i = F(19, 17)
        t_j = F(-5, 23)
        k_ij = (t_i - t_j) / (q_j - q_i)

        u_i = p_value - q_i * t_i
        u_j = p_value - q_j * t_j
        z_ij = p_value - q_i * t_i - q_j * t_j + q_i * q_j * k_ij
        divided = (q_i * u_i - q_j * u_j) / (q_i - q_j)
        a_i = -u_i
        a_j = -u_j
        d_ij = (q_i * a_i - q_j * a_j) / (q_i - q_j)

        self.assertEqual(z_ij, divided)
        self.assertEqual(d_ij, -z_ij)

    def test_cross_kernel_closed_form_matches_resolvent_form(self) -> None:
        length = 19.0
        for i, j in ((0, 1), (1, 2), (1, 5), (4, 7)):
            a_i = 2 * math.pi * i / length
            a_j = 2 * math.pi * j / length
            for u in (0.1, 1.3, 7.1, 18.5):
                closed = cross_kernel(i, j, length, u)
                raw = a_j * math.sin(a_j * u)
                if i:
                    raw += a_i * math.sin(a_i * u)
                    composition = (
                        math.sin(a_i * u) / a_i
                        - math.sin(a_j * u) / a_j
                    ) / (a_j**2 - a_i**2)
                    raw -= a_i**2 * a_j**2 * composition
                self.assertAlmostEqual(closed, raw, places=13)

    def test_diagonal_kernel_is_the_coalescing_limit(self) -> None:
        length = 23.0
        vertex = 3
        a_value = 2 * math.pi * vertex / length
        for u in (0.2, 3.0, 17.0):
            diagonal = a_value * (
                3 * math.sin(a_value * u)
                + a_value * u * math.cos(a_value * u)
            ) / 2
            epsilon = 1e-6
            b_value = a_value + epsilon
            divided = (
                b_value**3 * math.sin(b_value * u)
                - a_value**3 * math.sin(a_value * u)
            ) / (b_value**2 - a_value**2)
            self.assertAlmostEqual(divided, diagonal, places=4)

    def test_distinct_resonant_comparator_is_exact_and_positive(self) -> None:
        eta = F(3, 7)
        q_i = F(5, 19)
        q_j = F(11, 23)
        exponential = F(31, 4)
        denominator = (eta**2 + q_i) * (eta**2 + q_j)
        t_i = (exponential - 1) / (eta**2 + q_i)
        t_j = (exponential - 1) / (eta**2 + q_j)
        t_ij = (exponential - 1) / denominator
        direct = exponential - q_i * t_i - q_j * t_j + q_i * q_j * t_ij
        reduced = (
            exponential * eta**4
            + eta**2 * (q_i + q_j)
            + q_i * q_j
        ) / denominator
        self.assertEqual(direct, reduced)
        self.assertGreater(reduced, 0)

        anchor_direct = exponential - q_j * t_j
        anchor_reduced = (
            exponential * eta**2 + q_j
        ) / (eta**2 + q_j)
        self.assertEqual(anchor_direct, anchor_reduced)
        self.assertGreater(anchor_reduced, 0)

    def test_diagonal_resonant_comparator_boundary_is_exact(self) -> None:
        eta = F(2, 5)
        q_value = F(7, 17)
        length = F(29, 3)
        exponential = F(37, 5)
        denominator = eta**2 + q_value
        t_one = (exponential - 1) / denominator
        t_two = (
            (exponential - 1) / denominator**2
            + eta * length / (2 * q_value * denominator)
        )
        direct = exponential - 2 * q_value * t_one + q_value**2 * t_two
        reduced = (
            exponential * eta**4 / denominator**2
            + q_value * (2 * eta**2 + q_value) / denominator**2
            + q_value * eta * length / (2 * denominator)
        )
        self.assertEqual(direct, reduced)
        self.assertGreater(reduced, 0)

    def test_cross_root_is_unique_later_than_diagonal_root(self) -> None:
        x_zero = diagonal_root()
        self.assertAlmostEqual(x_zero, 2.45564386287944, places=13)
        for i, j in ((0, 1), (1, 2), (2, 3), (1, 7), (6, 7)):
            ratio = i / j
            root = cross_root(ratio)
            self.assertGreater(root, x_zero)
            self.assertLessEqual(root, math.pi)
            if ratio:
                self.assertAlmostEqual(
                    math.sin(root),
                    ratio**3 * math.sin(ratio * root),
                    places=14,
                )
                samples = [
                    x_zero + (root - x_zero) * step / 8
                    for step in range(1, 8)
                ]
                ratios = [
                    math.sin(value) / math.sin(ratio * value)
                    for value in samples
                ]
                self.assertTrue(
                    all(left > right for left, right in zip(ratios, ratios[1:]))
                )

    def test_first_lobe_support_is_covered_by_frozen_theta(self) -> None:
        x_zero = diagonal_root()
        for prefix in range(1, 9):
            theta_k = 1 - x_zero / (2 * math.pi * prefix)
            for j in range(1, prefix + 1):
                theta_j = 1 - x_zero / (2 * math.pi * j)
                for i in range(j):
                    root = cross_root(i / j)
                    theta_ij = 1 - root / (2 * math.pi * j)
                    self.assertLess(theta_ij, theta_j)
                    self.assertLessEqual(theta_j, theta_k)

                    length = 41.0
                    u_root = root * length / (2 * math.pi * j)
                    before = cross_kernel(i, j, length, 0.999 * u_root)
                    after = cross_kernel(i, j, length, 1.001 * u_root)
                    self.assertGreater(before, 0)
                    self.assertLess(after, 0)

    def test_existing_eta_threshold_covers_every_cross_filter(self) -> None:
        x_zero = diagonal_root()
        for edge in (1e-6, 0.01, 0.25, 0.5):
            for prefix in range(1, 7):
                theta_k = 1 - x_zero / (2 * math.pi * prefix)
                eta = edge * (1 + theta_k) / 2
                self.assertGreater(eta, edge * theta_k)
                self.assertLess(eta, edge)
                for j in range(1, prefix + 1):
                    for i in range(j):
                        theta_ij = 1 - cross_root(i / j) / (2 * math.pi * j)
                        self.assertGreater(eta, edge * theta_ij)
                        self.assertLess(edge * theta_ij - eta, 0)

    def test_positive_edge_graph_is_exactly_complete_bipartite(self) -> None:
        prefix = 9
        coordinates = [1] + [2 * (-1) ** index for index in range(1, prefix + 1)]
        positive_edges: set[tuple[int, int]] = set()
        for i in range(prefix + 1):
            for j in range(i + 1, prefix + 1):
                z_ij = F(i + j + 3, prefix + 5)
                d_ij = -z_ij
                weight = coordinates[i] * coordinates[j] * d_ij
                self.assertNotEqual(weight, 0)
                if weight > 0:
                    positive_edges.add((i, j))

        expected = {
            (i, j)
            for i in range(prefix + 1)
            for j in range(i + 1, prefix + 1)
            if (i + j) % 2 == 1
        }
        self.assertEqual(positive_edges, expected)

        reached = {0}
        changed = True
        while changed:
            changed = False
            for left, right in positive_edges:
                if left in reached and right not in reached:
                    reached.add(right)
                    changed = True
                if right in reached and left not in reached:
                    reached.add(left)
                    changed = True
        self.assertEqual(reached, set(range(prefix + 1)))

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"Z_{ij}(L_n):=(F_iF_j\Psi)(L_n)>0",
            r"D_{ij}=-Z_{ij}",
            r"\kappa_{ij,L}(u)",
            r"a_j^3\sin(a_ju)-a_i^3\sin(a_iu)",
            r"\sin\zeta_r=r^3\sin(r\zeta_r)",
            r"x_0<\zeta_r<\pi",
            r"\theta_{ij}=1-{\zeta_{i/j}\over2\pi j}",
            r"B\theta_K<\eta<B",
            r"e^{-(\eta-B\theta_K)L_n}",
            r"w_{ij}>0\iff i+j\ \hbox{is odd}",
            "complete bipartite",
            "no comparison with the natural outer\ndimension",
            "not prove a positive reduced Laplacian",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "the signed Laplacian is positive semidefinite",
            "routing contraction is proved",
            "all vertices in every natural finite section",
            "Riemann hypothesis is proved",
            "equation (5.2) is proved",
        )
        for token in forbidden:
            self.assertNotIn(token, text)

        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_new_package_contains_no_disallowed_control_bytes(self) -> None:
        allowed = {9, 10, 13}
        for path in (NOTE, TEST):
            disallowed = [
                byte for byte in path.read_bytes()
                if (byte < 32 and byte not in allowed) or byte == 127
            ]
            self.assertEqual(disallowed, [], path.name)


if __name__ == "__main__":
    unittest.main()
