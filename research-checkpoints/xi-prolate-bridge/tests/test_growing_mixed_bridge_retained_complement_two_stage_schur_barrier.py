#!/usr/bin/env python3
"""Regressions for the mixed-bridge retained two-stage Schur barrier."""

from __future__ import annotations

import ast
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
NOTE = ROOT / "notes" / (
    "GROWING_MIXED_BRIDGE_RETAINED_COMPLEMENT_TWO_STAGE_SCHUR_BARRIER.md"
)
NOTE_HASH = "102f69ec567803153d5648316874c8369cd558ee17cfce71f3cca2e9bb259f81"

FROZEN = {
    "notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md":
        "43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2",
    "tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py":
        "95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a",
    "notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md":
        "1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032",
    "tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py":
        "e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa",
    "notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md":
        "c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f",
    "tests/test_growing_low_prefix_half_power_far_cross_theorem.py":
        "be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "tests/test_high_fourier_coercivity.py":
        "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class GrowingMixedBridgeRetainedTwoStageSchurBarrierTests(unittest.TestCase):
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

    def test_exact_two_stage_schur_identity(self) -> None:
        captured = np.array([[9.0, 1.0], [1.0, 7.0]])
        bridge_row = np.array([[0.4, -0.2]])
        retained_cross = np.array([[1.2, -0.7], [-0.3, 0.5]])
        bridge = 1.5
        bridge_retained = np.array([[0.25], [-0.1]])
        retained = np.array([[5.0, 0.3], [0.3, 4.0]])

        full = np.block([
            [captured, bridge_row.T, retained_cross.T],
            [bridge_row, np.array([[bridge]]), bridge_retained.T],
            [retained_cross, bridge_retained, retained],
        ])
        captured_inverse = np.linalg.inv(captured)
        q_one = (bridge - bridge_row @ captured_inverse @ bridge_row.T).item()
        y_one = bridge_retained - retained_cross @ captured_inverse @ bridge_row.T
        r_one = retained - retained_cross @ captured_inverse @ retained_cross.T
        final_short = r_one - y_one @ y_one.T / q_one

        signs_full = np.sign(np.linalg.eigvalsh(full))
        signs_pivots = np.concatenate((
            np.sign(np.linalg.eigvalsh(captured)),
            np.array([np.sign(q_one)]),
            np.sign(np.linalg.eigvalsh(final_short)),
        ))
        np.testing.assert_array_equal(np.sort(signs_full), np.sort(signs_pivots))
        self.assertGreater(q_one, 0.0)
        self.assertGreater(float(np.linalg.eigvalsh(final_short)[0]), 0.0)

    def test_pivot_scales_do_not_delete_retained_terms(self) -> None:
        for length in (20.0, 80.0, 320.0):
            captured_inverse = 8.0 / length
            captured_to_retained = 2.0
            bridge_inverse = 1.0 / 0.03
            bridge_to_retained = 0.02
            cap_cost = captured_to_retained**2 * captured_inverse
            bridge_cost = bridge_to_retained**2 * bridge_inverse
            self.assertAlmostEqual(cap_cost, 32.0 / length, places=14)
            self.assertAlmostEqual(bridge_cost, 0.04 / 3.0, places=14)
        self.assertIn("the cap pivot pays `1/L`", self.text)
        self.assertIn("the bridge pivot pays `O(1)`", self.text)

    def test_no_exhaustion_dimension(self) -> None:
        for exponent, captured_dimension in ((30, 30), (60, 100), (120, 500)):
            retained_low = 2**exponent
            complement = retained_low - captured_dimension - 1
            self.assertGreater(complement, retained_low // 2)
        self.assertIn("R-O(L)\\sim R", self.text)
        self.assertIn("R=\\sqrt N=2^{4800\\lambda^2}", self.text)
        self.assertIn("cannot exhaust the retained space", self.text)

    def test_cauchy_hilbert_schmidt_scale_is_not_small(self) -> None:
        b_bound = 3.0
        previous = 0.0
        for dimension in (10, 100, 1000):
            hs_bound = 2 * math.pi * b_bound * math.sqrt(dimension / 3)
            self.assertGreater(hs_bound, previous)
            previous = hs_bound
        self.assertIn("{4\\pi^2\\over3}B_b^2d", self.text)
        self.assertIn("positive total trace", self.text)

    def test_exact_n2_source_cauchy_countermodel(self) -> None:
        length = 20.0
        tau = 0.75
        b_value = (length - 1) / 2
        high = 10_000.0
        modes = (-2, -1, 0, 1, 2)
        a_values = {
            -2: high,
            -1: (length + 1) / 2,
            0: -tau,
            1: (length + 1) / 2,
            2: high,
        }
        b_values = {-2: 0.0, -1: -b_value, 0: 0.0, 1: b_value, 2: 0.0}
        source = np.empty((5, 5), dtype=float)
        for row, n_value in enumerate(modes):
            for column, m_value in enumerate(modes):
                if n_value == m_value:
                    source[row, column] = a_values[n_value]
                else:
                    source[row, column] = (
                        (b_values[n_value] - b_values[m_value])
                        / (n_value - m_value)
                    )
        np.testing.assert_allclose(source, source.T, rtol=0, atol=0)

        index = {mode: position for position, mode in enumerate(modes)}
        parity_vectors = []
        for positive, negative in ((1, 1), (1, -1)):
            vector = np.zeros(5)
            vector[index[1]] = positive / math.sqrt(2)
            vector[index[-1]] = negative / math.sqrt(2)
            parity_vectors.append(vector)
        zero = np.zeros(5)
        zero[index[0]] = 1.0
        parity_vectors.append(zero)
        for positive, negative in ((1, 1), (1, -1)):
            vector = np.zeros(5)
            vector[index[2]] = positive / math.sqrt(2)
            vector[index[-2]] = negative / math.sqrt(2)
            parity_vectors.append(vector)
        transform = np.column_stack(parity_vectors)
        parity = transform.T @ source @ transform

        expected = np.array([
            [length, 0.0, math.sqrt(2) * b_value, -2 * b_value / 3, 0.0],
            [0.0, 1.0, 0.0, 0.0, -4 * b_value / 3],
            [math.sqrt(2) * b_value, 0.0, -tau, 0.0, 0.0],
            [-2 * b_value / 3, 0.0, 0.0, high, 0.0],
            [0.0, -4 * b_value / 3, 0.0, 0.0, high],
        ])
        np.testing.assert_allclose(parity, expected, rtol=0, atol=2e-12)

        low = parity[:3, :3]
        coupling = parity[3:, :3]
        high_block = parity[3:, 3:]
        np.testing.assert_allclose(high_block, high * np.eye(2), rtol=0, atol=3e-12)
        low_short = low - coupling.T @ np.linalg.inv(high_block) @ coupling
        captured_pivot = low_short[0, 0]
        bridge_pivot = low_short[1, 1]
        retained_short = low_short[2, 2] - low_short[2, 0] ** 2 / captured_pivot
        self.assertGreater(captured_pivot, 0.0)
        self.assertGreater(bridge_pivot, 0.0)
        self.assertLess(retained_short, 0.0)
        self.assertAlmostEqual(
            retained_short,
            -tau - 2 * b_value**2 / (length - 4 * b_value**2 / (9 * high)),
            places=13,
        )

    def test_scope_and_required_tokens(self) -> None:
        required = (
            "retained-complement two-stage Schur barrier",
            "K_0\\oplus\\mathbb Cb\\oplus\\mathcal R_Q",
            "q_{1,\\theta}:=q_\\theta-r_\\theta A_\\theta^{-1}",
            "S_{\\mathcal R,\\theta}",
            "R_\\theta-X_\\theta A_\\theta^{-1}X_\\theta^*",
            "y_\\theta-X_\\theta A_\\theta^{-1}r_\\theta^*",
            "\\operatorname {ran}y_1",
            "The first pair is the strict-PASS coherent bridge pair",
            "positive high block",
            "of arbitrary size",
            "logical countermodel only",
            "does **not** prove that the",
            "genuine arithmetic retained short is negative",
            "They are not",
            "claimed to be the actual pole--Archimedean--prime coefficients",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_no_arithmetic_failure_or_global_sign_overclaim(self) -> None:
        forbidden = (
            "the genuine arithmetic retained short is negative.",
            "This proves the genuine arithmetic short fails",
            "This proves the Riemann hypothesis",
            "T_\\theta\\succeq0 for the actual arithmetic operator",
            "R_\\theta\\succeq0 is proved",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

    def test_import_hygiene(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__", "ast", "hashlib", "math", "numpy", "pathlib",
                "re", "shutil", "subprocess", "tempfile", "unittest",
            },
        )

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 25)
        body = "\n".join(f"\\[{display}\\]" for display in displays)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\newcommand{\\mathbbm}{\\mathbb}\n"
            "\\begin{document}\n"
            f"{body}\n"
            "\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "displays.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                check=False,
                capture_output=True,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
