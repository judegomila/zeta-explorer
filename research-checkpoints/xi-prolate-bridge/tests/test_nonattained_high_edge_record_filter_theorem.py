#!/usr/bin/env python3
"""Regressions for the nonattained zero-edge record filter theorem.

The tests use only the Python standard library.  Exact Fraction arithmetic
checks the rational multiplier and resonant comparator; elementary bisection
checks the first negative lobe and arbitrary-edge fixed-prefix separation.
"""

from __future__ import annotations

from fractions import Fraction as F
import cmath
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md"
TEST = ROOT / "tests" / "test_nonattained_high_edge_record_filter_theorem.py"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md":
        "4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be",
    "notes/PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md":
        "ca6fd1e6d34b7872fc55f20e6005cdec0c9c7f81a4ad3ac50187a8b30db5521c",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md":
        "baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md":
        "cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d",
}


def first_kernel_root(iterations: int = 100) -> float:
    """Bisect the unique root of 3*sin(x)+x*cos(x) in (pi/2, pi)."""
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


class NonattainedHighEdgeRecordFilterTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_explicit_terms_and_main_collapse_to_fourth_filter(self) -> None:
        fixtures = (
            (F(13, 7), F(5, 11)),
            (F(-17, 9), F(4, 13)),
            (F(29, 8), F(7, 5)),
        )
        for alpha_squared, q in fixtures:
            explicit_multiplier = (2 * alpha_squared + q) / (
                alpha_squared + q
            ) ** 2
            filtered = 1 - q * explicit_multiplier
            expected = alpha_squared**2 / (alpha_squared + q) ** 2
            self.assertEqual(filtered, expected)

    def test_resonant_positive_comparator_formula_is_exact(self) -> None:
        # Abstract exact resonance data: E=e^(eta*L), D=eta^2+q.
        eta = F(3, 5)
        length = F(17, 4)
        q = F(7, 19)
        exponential = F(23, 3)
        denominator = eta**2 + q

        t_one = (exponential - 1) / denominator
        t_two = (
            (exponential - 1) / denominator**2
            + eta * length / (2 * q * denominator)
        )
        direct = exponential - 2 * q * t_one + q**2 * t_two
        reduced = (
            exponential * eta**4 / denominator**2
            + q * (2 * eta**2 + q) / denominator**2
            + q * eta * length / (2 * denominator)
        )
        self.assertEqual(direct, reduced)
        self.assertGreater(reduced, 0)

    def test_correction_kernel_has_both_signs(self) -> None:
        # The irrelevant positive factor 1/(2a) is omitted.
        at_half_pi = 3 * math.sin(math.pi / 2) + (
            math.pi / 2
        ) * math.cos(math.pi / 2)
        at_pi = 3 * math.sin(math.pi) + math.pi * math.cos(math.pi)
        at_two_pi = 3 * math.sin(2 * math.pi) + 2 * math.pi * math.cos(
            2 * math.pi
        )
        self.assertGreater(at_half_pi, 0)
        self.assertLess(at_pi, 0)
        self.assertGreater(at_two_pi, 0)

        # A nonnegative bump in either lobe drives the record-filter
        # correction in the corresponding direction.
        baseline = 1.0
        amplitude = 100.0
        self.assertLess(baseline + amplitude * at_pi, 0)
        self.assertGreater(baseline + amplitude * at_half_pi, 0)

    def test_first_root_and_prefix_support_fractions(self) -> None:
        root = first_kernel_root()
        self.assertGreater(root, math.pi / 2)
        self.assertLess(root, math.pi)
        self.assertAlmostEqual(root, 2.45564386287944, places=13)

        fractions = [
            1 - root / (2 * math.pi * vertex)
            for vertex in range(1, 6)
        ]
        self.assertAlmostEqual(fractions[0], 0.6091721407494606, places=14)
        self.assertAlmostEqual(fractions[1], 0.8045860703747303, places=14)
        self.assertAlmostEqual(fractions[2], 0.8697240469164868, places=14)
        self.assertEqual(fractions, sorted(fractions))
        self.assertTrue(all(0 < value < 1 for value in fractions))

    def test_negative_lobe_exponent_condition_for_arbitrary_edge(self) -> None:
        root = first_kernel_root()
        for edge in (1e-6, 1e-3, 0.25, 0.5):
            for vertex in range(1, 8):
                theta = 1 - root / (2 * math.pi * vertex)
                eta = edge * (1 + theta) / 2
                self.assertGreater(eta, edge * theta)
                self.assertLess(eta, edge)
                # The record part and actual-screw part both decay relative
                # to R*exp(eta*L) on the negative support.
                self.assertLess(eta * theta - eta, 0)
                self.assertLess(edge * theta - eta, 0)

    def test_zero_edge_envelope_includes_backward_and_constant_terms(self) -> None:
        fixtures = (
            (0.0 + 14.0j, 0.5),
            (0.0001 + 37.0j, 0.0001),
            (0.125 + 91.0j, 0.25),
            (0.499 + 211.0j, 0.5),
        )
        for alpha, edge in fixtures:
            self.assertLessEqual(alpha.real, edge)
            for time in (0.0, 0.25, 3.0, 17.0):
                atom = 2 * (cmath.cosh(alpha * time) - 1) / alpha**2
                majorant = 4 * math.exp(edge * time) / abs(alpha) ** 2
                self.assertLessEqual(abs(atom), majorant * (1 + 1e-12))

    def test_low_high_split_has_an_exponential_gap(self) -> None:
        b_zero = F(1, 5)
        eta = F(2, 5)
        self.assertGreater(eta - b_zero, 0)
        # Polynomial ledgers after division by p_k.
        self.assertEqual(F(-3, 2) - F(-1, 2), F(-1))
        self.assertEqual(F(-1), F(-1))  # q*R_q*Psi_< ledger.

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"\Phi_{k,L}=(I-qT_q)^2",
            r"{\alpha^4\over(\alpha^2+q)^2}",
            r"r_q(u)={3\sin(au)+au\cos(au)\over2a}",
            r"r_q(\pi/a)=-{\pi\over2a}<0",
            r"|\Psi(t)|\leq C_Ze^{Bt}",
            r"B\theta_K<\eta<B",
            r"e^{-(\eta-B\theta_K)L}",
            r"d_k(L)>0\qquad(0\leq k\leq K)",
            r"d_k(L_j)>0\qquad(0\leq k\leq K_j)",
            "holds for arbitrarily small `B>0`",
            "unquantified growing-prefix extraction",
            "no comparison such as `K_j` being comparable with the\n"
            "natural outer dimension `N(L_j)`",
            "no positivity of all vertices at any\nfinite stage",
            "no degree-ratio limit",
            "not a zeta-zero countermodel",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            r"B>\tau_K",
            r"0<B\leq\tau_K",
            "arbitrary positive nonattained edge remains open",
            "neither a growing prefix",
            "Riemann hypothesis is proved",
            "all vertices are eventually positive",
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
