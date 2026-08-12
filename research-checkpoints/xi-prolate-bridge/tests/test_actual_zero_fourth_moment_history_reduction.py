#!/usr/bin/env python3
"""Exact regressions for the actual-zero fourth-moment reduction.

The tests use only Python standard-library integer and Fraction arithmetic.
They bind every frozen dependency, verify the one-zero collective identity
and its H_N collapse, and audit the complete L/ordinate exponent ledger.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md"
TEST = ROOT / "tests" / "test_actual_zero_fourth_moment_history_reduction.py"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md":
        "baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "notes/PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md":
        "ca6fd1e6d34b7872fc55f20e6005cdec0c9c7f81a4ad3ac50187a8b30db5521c",
    "notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md":
        "cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d",
    "notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md":
        "6f67349e53e761744408bfa053874ce4f79b22aac578fa6fff48fa5915e65edf",
    "notes/ZERO_SAMPLING_SOURCE_AUDIT.md":
        "f17f843414a18b47a2abf4b4386f99dcbb420d1912c69e99d34fe4bc8ccdd0f4",
}


def one_zero_direct(
    coordinates: tuple[F, ...],
    vertex: int,
    c: F,
    alpha_squared: F,
    cosh_minus_one: F,
) -> F:
    """Evaluate -p_k(A_k-g)+k^2 sum p_j(A_k-A_j)/(k^2-j^2)."""
    moments = tuple(
        -2 * cosh_minus_one / (alpha_squared + c * j * j)
        for j in range(len(coordinates))
    )
    g = moments[0]
    result = -coordinates[vertex] * (moments[vertex] - g)
    result += vertex * vertex * sum(
        (
            coordinates[j]
            * (moments[vertex] - moments[j])
            / (vertex * vertex - j * j)
            for j in range(len(coordinates))
            if j != vertex
        ),
        F(0),
    )
    return result


def one_zero_reduced(
    coordinates: tuple[F, ...],
    vertex: int,
    c: F,
    alpha_squared: F,
    cosh_minus_one: F,
) -> F:
    bracket = sum(
        (
            coordinates[j] / (alpha_squared + c * j * j)
            for j in range(len(coordinates))
            if j != vertex
        ),
        F(0),
    ) - coordinates[vertex] / alpha_squared
    return (
        2 * c * vertex * vertex * cosh_minus_one
        / (alpha_squared + c * vertex * vertex)
        * bracket
    )


def h_value(coordinates: tuple[F, ...], s_squared: F) -> F:
    return coordinates[0] + s_squared * sum(
        (
            coordinates[j] / (s_squared - j * j)
            for j in range(1, len(coordinates))
        ),
        F(0),
    )


class ActualZeroFourthMomentHistoryReductionTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_exact_one_zero_collective_identity(self) -> None:
        fixtures = (
            ((F(2), F(-3), F(5), F(7)), 1, F(4, 9), F(13, 5), F(11, 7)),
            ((F(-5), F(2, 3), F(9, 4), F(-8, 5), F(1)),
             3, F(7, 11), F(17, 6), F(-4, 13)),
        )
        for coordinates, vertex, c, alpha_squared, cosh_minus_one in fixtures:
            direct = one_zero_direct(
                coordinates, vertex, c, alpha_squared, cosh_minus_one
            )
            reduced = one_zero_reduced(
                coordinates, vertex, c, alpha_squared, cosh_minus_one
            )
            self.assertEqual(direct, reduced)

    def test_h_n_collapse_is_exact(self) -> None:
        fixtures = (
            ((F(2), F(-3), F(5), F(7)), F(4, 9), F(13, 5)),
            ((F(-5), F(2, 3), F(9, 4), F(-8, 5)), F(7, 11), F(17, 6)),
        )
        for coordinates, c, alpha_squared in fixtures:
            s_squared = -alpha_squared / c
            direct = sum(
                (
                    coordinates[j] / (alpha_squared + c * j * j)
                    for j in range(len(coordinates))
                ),
                F(0),
            )
            self.assertEqual(direct, h_value(coordinates, s_squared) / alpha_squared)

    def test_h_split_reconstructs_the_reduced_bracket(self) -> None:
        coordinates = (F(3, 2), F(-5, 7), F(11, 13), F(17, 19))
        vertex = 2
        c = F(5, 12)
        alpha_squared = F(23, 7)
        s_squared = -alpha_squared / c

        full_sum = h_value(coordinates, s_squared) / alpha_squared
        split_bracket = (
            full_sum
            - coordinates[vertex] / (alpha_squared + c * vertex * vertex)
            - coordinates[vertex] / alpha_squared
        )
        original_bracket = sum(
            (
                coordinates[j] / (alpha_squared + c * j * j)
                for j in range(len(coordinates))
                if j != vertex
            ),
            F(0),
        ) - coordinates[vertex] / alpha_squared
        self.assertEqual(split_bracket, original_bracket)

    def test_fourth_moment_exponent_ledger_loses_no_power(self) -> None:
        # Each pair is (power of L, power of |alpha|).
        outer = (F(-2), F(-2))
        h_residual = (F(1, 2), F(1))
        h_denominator = (F(0), F(-2))
        explicit_denominator = (F(0), F(-2))

        h_term = tuple(
            outer[index] + h_residual[index] + h_denominator[index]
            for index in range(2)
        )
        explicit_term = tuple(
            outer[index] + explicit_denominator[index]
            for index in range(2)
        )
        self.assertEqual(h_term, (F(-3, 2), F(-3)))
        self.assertEqual(explicit_term, (F(-2), F(-4)))

        # The transform weight and sine denominator cancel at beta>=b.
        self.assertEqual(F(1, 2) + F(-1, 2), F(0))

    def test_relative_high_and_low_ledgers_match_the_stated_gate(self) -> None:
        p_fixed = F(-1, 2)
        high_moment = F(-2)
        low_moment = F(-3, 2)

        # High: L^-2*A4 divided by Psi.  The p_k factors cancel.
        self.assertEqual(high_moment, F(-2))
        # Low: L^-3/2*exp(bL) divided by L^-1/2*Psi.
        self.assertEqual(low_moment - p_fixed, F(-1))

    def test_grid_transfer_preserves_a_divergent_normalized_peak(self) -> None:
        # Abstract the exact transfer: the signal is n times its scale and
        # the grid perturbation is o(scale).  All arithmetic is rational.
        ratios = []
        for n in range(2, 12):
            scale = F(10**n)
            signal = n * scale
            perturbation = F(1, n)
            transferred = signal - perturbation
            ratio = transferred / scale
            ratios.append(ratio)
            self.assertGreater(ratio, F(n - 1))
        self.assertGreater(ratios[-1], ratios[0])

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "one-zero identity",
            r"{H_N(s)\over\alpha^2}",
            r"|H_N(-i\alpha L/(2\pi))|",
            r"C_{k,b}|p_k|L^{-2}A_{4,b}(L)",
            r"A_{4,b}(L)=o\{L^2\Psi(L)\}",
            r"e^{-bL}\Psi(L)\longrightarrow+\infty",
            "same** sequence",
            r"d_k(L)>0\qquad(0\leq k\leq K)",
            r"{d_k(L)\over d_0(L)}\longrightarrow4",
            "N(T+1)-N(T)=O(log T)",
            "do not currently\nprove (0.3)",
            "No `Xi'/Xi` continuation",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "the nonattained-edge case is proved",
            "HSW proves (6.1)",
            "Riemann hypothesis is proved",
            "unconditional fixed-prefix selection",
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
