#!/usr/bin/env python3
"""Regressions for the retained negative-index/capture barrier."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_RETAINED_NEGATIVE_INDEX_CAPTURE_BARRIER.md"
NOTE_HASH = "9fc64fedde255791775861e7a3bb2b2d55eab1a3d402cf8b842d9e0d8519424c"

FROZEN = {
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "notes/PHASE_VOLUME_SCALE_AUDIT.md":
        "bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd",
    "notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md":
        "ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md":
        "1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1",
    "notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md":
        "1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032",
    "tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py":
        "e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa",
    "notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md":
        "43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2",
    "tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py":
        "95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def cauchy_matrix(amplitude: float, cutoff: int) -> tuple[np.ndarray, np.ndarray]:
    labels = np.arange(-cutoff, cutoff + 1, dtype=float)
    b_vector = amplitude * np.sin(math.pi * labels / 2.0)
    diagonal = np.log(np.abs(labels) + 2.0)
    matrix = np.diag(diagonal)
    for row in range(labels.size):
        for column in range(labels.size):
            if row != column:
                matrix[row, column] = (
                    (b_vector[row] - b_vector[column])
                    / (labels[row] - labels[column])
                )
    return matrix, b_vector


def even_isometry(cutoff: int) -> np.ndarray:
    transform = np.zeros((2 * cutoff + 1, cutoff + 1), dtype=float)
    transform[cutoff, 0] = 1.0
    for label in range(1, cutoff + 1):
        transform[cutoff + label, label] = 1.0 / math.sqrt(2.0)
        transform[cutoff - label, label] = 1.0 / math.sqrt(2.0)
    return transform


def pair_indices(amplitude: float) -> list[int]:
    bound = math.exp(amplitude / 4.0)
    return [
        4 * index + 3
        for index in range(max(0, math.floor((bound - 6.0) / 4.0) + 1))
    ]


def pair_gram(amplitude: float) -> np.ndarray:
    indices = pair_indices(amplitude)
    gram = np.zeros((len(indices), len(indices)), dtype=float)
    for row, first in enumerate(indices):
        gram[row, row] = (
            0.5
            * (
                math.log(first + 2.0)
                + math.log(first + 3.0)
                - amplitude / first
            )
            - amplitude
            + amplitude / (2 * first + 1)
        )
        for column in range(row + 1, len(indices)):
            second = indices[column]
            difference = second - first
            total = second + first
            value = amplitude * (
                1.0 / (difference**2 - 1.0)
                - 1.0 / (total * (total + 1.0))
            )
            gram[row, column] = value
            gram[column, row] = value
    return gram


class GrowingRetainedNegativeIndexCaptureBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_cauchy_displacement_and_inversion_parity(self) -> None:
        cutoff = 12
        amplitude = 7.25
        matrix, b_vector = cauchy_matrix(amplitude, cutoff)
        labels = np.arange(-cutoff, cutoff + 1, dtype=float)
        mode = np.diag(labels)
        eta = np.ones(labels.size)
        displacement = mode @ matrix - matrix @ mode
        expected = np.outer(b_vector, eta) - np.outer(eta, b_vector)
        np.testing.assert_allclose(displacement, expected, rtol=0, atol=2e-13)

        inversion = np.fliplr(np.eye(labels.size))
        np.testing.assert_allclose(inversion @ matrix @ inversion, matrix, rtol=0, atol=1e-14)
        np.testing.assert_allclose(matrix, matrix.T, rtol=0, atol=1e-14)
        self.assertLessEqual(np.linalg.matrix_rank(expected, tol=1e-11), 2)

    def test_even_block_formulas_and_pair_cross_are_exact(self) -> None:
        cutoff = 31
        amplitude = 9.0
        matrix, _ = cauchy_matrix(amplitude, cutoff)
        transform = even_isometry(cutoff)
        even = transform.T @ matrix @ transform

        for first in range(1, cutoff + 1):
            b_first = amplitude * math.sin(math.pi * first / 2.0)
            expected_diagonal = math.log(first + 2.0) + b_first / first
            self.assertAlmostEqual(even[first, first], expected_diagonal, places=12)
            for second in range(first + 1, cutoff + 1):
                b_second = amplitude * math.sin(math.pi * second / 2.0)
                expected_cross = (
                    (b_first - b_second) / (first - second)
                    + (b_first + b_second) / (first + second)
                )
                self.assertAlmostEqual(even[first, second], expected_cross, places=12)

        selected = (3, 7, 11, 15, 19, 23, 27)
        vectors = []
        for label in selected:
            vector = np.zeros(cutoff + 1)
            vector[label] = 1.0 / math.sqrt(2.0)
            vector[label + 1] = -1.0 / math.sqrt(2.0)
            vectors.append(vector)
        vectors_array = np.column_stack(vectors)
        observed = vectors_array.T @ even @ vectors_array
        for row, first in enumerate(selected):
            for column, second in enumerate(selected):
                if row == column:
                    continue
                difference = abs(second - first)
                total = second + first
                expected = amplitude * (
                    1.0 / (difference**2 - 1.0)
                    - 1.0 / (total * (total + 1.0))
                )
                self.assertAlmostEqual(observed[row, column], expected, places=12)

    def test_gershgorin_negative_subspace_and_constants(self) -> None:
        amplitude = 24.0
        gram = pair_gram(amplitude)
        self.assertGreaterEqual(gram.shape[0], 90)
        row_radii = np.sum(np.abs(gram), axis=1) - np.abs(np.diag(gram))
        infinite_radius = math.pi**2 * amplitude / 45.0
        self.assertTrue(np.all(row_radii <= infinite_radius + 1e-12))
        self.assertTrue(np.all(np.diag(gram) <= -0.75 * amplitude + 1e-12))

        margin = (0.75 - math.pi**2 / 45.0) * amplitude
        eigenvalues = np.linalg.eigvalsh(gram)
        self.assertLess(float(eigenvalues[-1]), 0.0)
        self.assertLessEqual(float(eigenvalues[-1]), -margin + 1e-11)
        self.assertGreater(0.75 - math.pi**2 / 45.0, 0.5)

        large_amplitude = 64.0
        self.assertGreater(len(pair_indices(large_amplitude)), large_amplitude**2)

    def test_high_floor_and_locked_scale_separation(self) -> None:
        amplitude = 10.0
        log_cutoff = (2.0 * math.pi + 1.0) * amplitude
        high_floor = log_cutoff - 2.0 * math.pi * amplitude
        self.assertAlmostEqual(high_floor, amplitude, places=13)

        lam = 100.0
        log_half_power = 4800.0 * math.log(2.0) * lam**2
        log_model_cutoff = (2.0 * math.pi + 1.0) * lam
        self.assertGreater(log_half_power, 1000.0 * log_model_cutoff)
        self.assertGreater(math.exp(lam / 4.0) / 5.0, lam**2)

    def test_hilbert_schmidt_count_stays_dimension_scale(self) -> None:
        amplitude = 24.0
        dimension = len(pair_indices(amplitude))
        selected_oriented_square_sum = 2.0 * amplitude**2 * dimension
        threshold_count = selected_oriented_square_sum / amplitude**2
        self.assertEqual(threshold_count, 2.0 * dimension)
        self.assertIn(
            r"\|Q^{(B)}-D_a\|_{\rm HS}^2",
            self.text,
        )
        self.assertIn("Birman--Schwinger crossings", self.text)

    def test_phase_volume_minmax_index_bound(self) -> None:
        g_value = 10.0
        delta = 3.0
        t_values = np.array([14.0, 12.0, 6.0, 1.0, 0.0])
        shifted = np.diag(g_value - t_values)
        threshold = g_value - delta
        dangerous_rank = int(np.count_nonzero(t_values >= threshold))
        negative_index = int(np.count_nonzero(np.linalg.eigvalsh(shifted) < 0.0))
        self.assertLessEqual(negative_index, dangerous_rank)
        self.assertLessEqual(dangerous_rank, t_values.sum() / threshold)

        # A lower Ritz shift u<=U only adds the positive scalar U-u.
        lower_shifted = shifted + 2.0 * np.eye(t_values.size)
        self.assertLessEqual(
            int(np.count_nonzero(np.linalg.eigvalsh(lower_shifted) < 0.0)),
            negative_index,
        )
        for token in (
            r"n_-\!\left(PH_uP\right)",
            r"{L\Phi_\lambda(U_Z,g)\over2\pi(g-\delta)}",
            r"\exp(O(\lambda))",
            r"\Phi_\lambda(U_Z,g)\ll{\lambda^2\over\log\lambda}",
        ):
            self.assertIn(token, self.text)

    def test_polynomial_trace_does_not_transfer_to_half_power(self) -> None:
        lam = 50.0
        log_half_power = 4800.0 * math.log(2.0) * lam**2
        self.assertGreater(log_half_power, 1000.0 * math.log(lam**2))

        # In the leading trace term, M2 is proportional to N*L and
        # 2*sqrt(d*L*M2)/L is proportional to N, not lambda^2.
        logarithmic_length = 2.0 * math.log(lam)
        for cutoff in (lam**2, 10.0 * lam**2, 100.0 * lam**2):
            dimension = 2.0 * cutoff + 1.0
            mean_square = cutoff * logarithmic_length
            rank_allowance = (
                2.0
                * math.sqrt(dimension * logarithmic_length * mean_square)
                / logarithmic_length
            )
            self.assertGreater(rank_allowance, cutoff)
            self.assertLess(rank_allowance, 4.0 * cutoff)
        for token in (
            r"N_{\rm pol}\asymp\lambda^2",
            r"O(R_{\rm hp})",
            "cannot be pasted onto the distinct exponential projection schedule",
            r"\exp(O(\lambda\log\lambda))",
        ):
            self.assertIn(token, self.text)

    def test_capture_dimension_and_positive_span_nonimplication(self) -> None:
        negative_dimension = 11
        source_dimension = 4
        ambient_dimension = 20
        negative_basis = np.eye(ambient_dimension)[:, :negative_dimension]
        source_basis = np.eye(ambient_dimension)[:, -source_dimension:]
        projection = source_basis @ source_basis.T
        observed = source_basis.T @ negative_basis
        self.assertEqual(np.linalg.matrix_rank(observed), 0)
        np.testing.assert_allclose(projection @ negative_basis, 0.0, rtol=0, atol=0)
        self.assertGreaterEqual(
            negative_dimension - source_dimension,
            1,
        )
        for token in (
            r"s_Q:=\dim P_+{\cal S}_Q=O(L)",
            r"\dim({\cal E}_-\cap(P_+{\cal S}_Q)^\perp)",
            "zero smallest singular value",
            "only parametrizes the negative space",
            "criterion including the cross block",
        ):
            self.assertIn(token, self.text)

    def test_fail_closed_scope_is_literal(self) -> None:
        required = (
            "structural source-Cauchy countermodel",
            "not the actual von-Mangoldt matrix",
            "does not use the physical prolate anchor",
            "does not assert that the arithmetic matrix has a large negative index",
            "does not identify \\({\\cal S}\\) with the actual mixed physical",
            "countermodel is not evidence for",
            "actual arithmetic negativity",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)
        forbidden = (
            "the actual von-Mangoldt matrix has exponential negative index",
            "This proves equation (5.2)",
            "This proves the Riemann hypothesis",
            "The retained complement is positive",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_display_balance_unique_tags_ascii_and_tex(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
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
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout[-4000:])


if __name__ == "__main__":
    unittest.main()
