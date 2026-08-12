#!/usr/bin/env python3
"""Checks for the Dirichlet-moment Schatten dangerous-space barrier."""

from __future__ import annotations

import hashlib
import math
from fractions import Fraction
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / (
    "ACTUAL_DIRICHLET_MOMENT_SCHATTEN_DANGEROUS_SPACE_BARRIER.md"
)
NOTE_HASH = "9c0414bf028330e1758b25d06aaaf4a4ebc68f58e462c5e22a13db6434031f13"

FROZEN = {
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "tests/test_high_fourier_coercivity.py":
        "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
    "notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md":
        "1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1",
    "tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py":
        "cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d",
    "notes/ACTUAL_PHASE_VOLUME_LONG_BLOCK_THRESHOLD_NEGATIVE_INDEX_BARRIER.md":
        "964b58396b1913013b017be6393cef768891d253e553a22979c3189a5c603f56",
    "tests/test_actual_phase_volume_long_block_threshold_negative_index_barrier.py":
        "149a7034c83a952b4069574cf5892583540f66b5fcea385afb2a90ecd66a979c",
    "notes/CUTOFF_FREE_CYCLICITY_EFFECTIVE_DIMENSION_CAPTURE_BARRIER.md":
        "e27463c41c6a45fcb6a3a332b8e5ab173178f35a4abb9fd5eff07dfbbc27eccd",
    "tests/test_cutoff_free_cyclicity_effective_dimension_capture_barrier.py":
        "1bc88d49195b54c185be767a217d952145839962bf894e06dfe38ce9bfbed515",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def hilbert_matrix(indices: np.ndarray) -> np.ndarray:
    result = np.zeros((len(indices), len(indices)), dtype=float)
    for row, left in enumerate(indices):
        for column, right in enumerate(indices):
            if row != column:
                result[row, column] = 1.0 / (left - right)
    return result


def orthogonal_complement(columns: np.ndarray, dimension: int) -> np.ndarray:
    if columns.size == 0:
        return np.eye(dimension)
    left_singular, singular, _ = np.linalg.svd(columns, full_matrices=True)
    rank = int(np.sum(singular > 1.0e-11))
    return left_singular[:, rank:]


class ActualDirichletMomentSchattenDangerousSpaceBarrierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_centering_leaves_commutator_unchanged(self) -> None:
        indices = np.arange(-3, 4, dtype=float)
        hilbert = hilbert_matrix(indices)
        values = np.array((0.0, 0.2, -0.1, 0.15, -0.05, 0.1, -0.2))
        center = 7.25
        diagonal = np.diag(values)
        centered = np.diag(values - center)
        commutator = diagonal @ hilbert - hilbert @ diagonal
        centered_commutator = centered @ hilbert - hilbert @ centered
        self.assertTrue(np.allclose(commutator, centered_commutator))
        self.assertTrue(np.allclose(commutator, commutator.T))

    def test_hilbert_schmidt_instance_and_rank_count(self) -> None:
        indices = np.arange(6, dtype=float)
        hilbert = hilbert_matrix(indices)
        values = np.array((0.0, 0.2, -0.1, 0.15, -0.05, 0.1))
        center = float(np.median(values))
        centered = values - center
        commutator = (
            np.diag(centered) @ hilbert - hilbert @ np.diag(centered)
        )

        self.assertLessEqual(np.linalg.norm(hilbert, 2), math.pi + 1.0e-12)
        lhs = np.linalg.norm(commutator, "fro")
        rhs = 2.0 * math.pi * np.linalg.norm(centered)
        self.assertLessEqual(lhs, rhs + 1.0e-12)

        threshold = 0.3
        singular = np.linalg.svd(commutator, compute_uv=False)
        actual_rank = int(np.sum(singular > threshold))
        schatten_bound = (
            (2.0 * math.pi / threshold) ** 2
            * float(np.dot(centered, centered))
        )
        self.assertLessEqual(actual_rank, schatten_bound + 1.0e-12)
        self.assertEqual(actual_rank, 2)

    def test_exceptional_space_floor_is_exact(self) -> None:
        indices = np.arange(6, dtype=float)
        hilbert = hilbert_matrix(indices)
        values = np.array((0.0, 0.2, -0.1, 0.15, -0.05, 0.1))
        commutator = (
            np.diag(values) @ hilbert - hilbert @ np.diag(values)
        )
        eigenvalues, eigenvectors = np.linalg.eigh(commutator)

        q_value = 0.0
        threshold = 0.3
        gap = 0.5
        diagonal_values = np.array((0.0, 1.0, 1.0, 1.0, 1.0, 1.0))
        exceptional = np.flatnonzero(
            diagonal_values < q_value + threshold + gap
        )
        large = np.flatnonzero(np.abs(eigenvalues) > threshold)

        coordinate_columns = np.eye(6)[:, exceptional]
        spectral_columns = eigenvectors[:, large]
        columns = np.column_stack((coordinate_columns, spectral_columns))
        complement = orthogonal_complement(columns, 6)
        self.assertGreater(complement.shape[1], 0)

        matrix = np.diag(diagonal_values) + commutator - q_value * np.eye(6)
        compressed = complement.T @ matrix @ complement
        self.assertGreaterEqual(
            float(np.min(np.linalg.eigvalsh(compressed))),
            gap - 1.0e-12,
        )

    def test_scalar_moment_count_requires_baseline_margin(self) -> None:
        q_value = 0
        threshold = 1
        gap = 0
        exponent = 2
        heights = np.array((1,), dtype=int)
        diagonal_values = np.array((0,), dtype=int)
        old_baseline = np.array((0,), dtype=int)
        cutoff = q_value + threshold + gap
        old_shortfall = np.maximum(old_baseline - diagonal_values, 0)
        exceptional_count = int(np.sum(diagonal_values < cutoff))
        old_moment_bound = int(np.sum(
            old_shortfall**exponent / heights**exponent
        ))

        self.assertTrue(np.all(heights > 0))
        self.assertFalse(np.all(old_baseline >= cutoff + heights))
        self.assertEqual(exceptional_count, 1)
        self.assertEqual(old_moment_bound, 0)
        self.assertGreater(exceptional_count, old_moment_bound)

        valid_baseline = np.array((2,), dtype=int)
        valid_shortfall = np.maximum(valid_baseline - diagonal_values, 0)
        valid_moment_bound = int(np.sum(
            valid_shortfall**exponent / heights**exponent
        ))
        self.assertTrue(np.all(valid_baseline >= cutoff + heights))
        self.assertLessEqual(exceptional_count, valid_moment_bound)

        required = (
            "baseline-margin condition",
            "positivity alone does not suffice",
            "exact singleton counterfixture",
            "would instead demand `0>=2`",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.text)

    def test_moment_length_optimization_cannot_certify_order_x(self) -> None:
        # Ignore harmless fixed constants: the obstruction is between the
        # exponents s*L and s*log(s).
        length_log = 100.0
        shell_exponent = 20.0
        constant = 1.0
        values = [
            r * math.log(constant * r / shell_exponent**2)
            for r in range(1, int(shell_exponent) + 1)
        ]
        self.assertTrue(all(left > right for left, right in zip(values, values[1:])))
        self.assertEqual(int(np.argmin(values)) + 1, int(shell_exponent))

        needed_saving = (shell_exponent - 1.0) * length_log
        available_saving = shell_exponent * math.log(shell_exponent / constant)
        self.assertGreater(needed_saving, available_saving)
        self.assertGreater(shell_exponent**2, shell_exponent)

    def test_fixed_s_two_uses_exact_half_scale(self) -> None:
        length_log = 100
        shell_exponent = 2
        constant = 1.0
        needed_saving = (shell_exponent - 1) * length_log
        normalized = needed_saving / (shell_exponent * length_log)
        bounded_orders = range(1, shell_exponent + 1)
        bounded_saving = max(
            r * math.log(shell_exponent**2 / (constant * r))
            for r in bounded_orders
        )

        self.assertEqual(normalized, 0.5)
        self.assertGreater(needed_saving, bounded_saving)
        self.assertNotIn("(1-o(1))sL", self.text)

        required = (
            "remaining bounded regime",
            "no decreasing optimization is",
            "(s-1)L=(1-1/s)sL",
            "exact normalized",
            "not an asymptotic quantity tending to one",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.text)

    def test_coordinate_exception_uses_same_shell_threshold(self) -> None:
        shell_exponent = Fraction(10)
        shell_constant = Fraction(1, 2)
        q_value = Fraction(0)
        gap = Fraction(0)
        prime_deleted_diagonal = Fraction(10)
        prime_remainder = Fraction(3)
        shell_threshold = shell_constant * shell_exponent
        full_diagonal = prime_deleted_diagonal - 2 * prime_remainder
        exact_threshold = (
            prime_deleted_diagonal - q_value - shell_threshold - gap
        ) / 2
        old_surrogate = shell_exponent / 2 - 1

        self.assertLess(full_diagonal, q_value + shell_threshold + gap)
        self.assertGreater(prime_remainder, exact_threshold)
        self.assertFalse(prime_remainder > old_surrogate)
        self.assertNotIn("{1\\over2}\\log|n|-C_1L", self.text)

        required = (
            "prime-deleted diagonal",
            "a_n=d_n-2 Re R_x(t_n)",
            "{d_n-q-\\tau_{x,s}-G\\over2}",
            "same `tau_(x,s)`",
            "exact rejected-reading fixture",
            "cannot be absorbed into a fixed multiple of `L`",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.text)

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertEqual(len(displays), 38)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex_path.name,
                ],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_note_keeps_the_conditional_and_heuristic_boundaries(self) -> None:
        required = (
            "operator exceptional",
            "2\\pi\\over\\tau",
            "r<=floor(s)",
            "r asymp s^2",
            "continuous block moments",
            "lattice estimate (5.2)",
            "method obstruction",
            "Heuristic only",
            "not a theorem",
            "source-angle statement",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.text)


if __name__ == "__main__":
    unittest.main()
