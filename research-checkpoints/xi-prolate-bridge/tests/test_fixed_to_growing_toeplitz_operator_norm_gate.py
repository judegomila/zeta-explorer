#!/usr/bin/env python3
"""Regressions for the fixed-to-growing Toeplitz operator-norm gate."""

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
NOTE = ROOT / "notes" / "FIXED_TO_GROWING_TOEPLITZ_OPERATOR_NORM_GATE.md"
NOTE_HASH = "57f4a8014e280e4594221b4466212b0104d2d7c25e9e6ff81808a4eb7f14ce25"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "tests/test_growing_transition_equality_conductor_garding_theorem.py":
        "61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba",
    "notes/GROWING_TRANSITION_ENDPOINT_NULL_COLLECTIVE_DILATION_FRAME_REDUCTION.md":
        "bbffec21c91b1e1150e36c9b2120b9255f1d0aa1bd4a1c7ec226e02db8d6abe6",
    "tests/test_growing_transition_endpoint_null_collective_dilation_frame_reduction.py":
        "eb25ab43e4f5fdeea96d89aa425ac2a9ab4f7cbdd0feaad3294e494387840f66",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_NEAR_BAND_FOLD_LARGE_SIEVE_THEOREM.md":
        "93a42acf8f33a2706e67ca53a929755d021c291a0dd3907099eb3176524e2675",
    "tests/test_growing_transition_ordered_prime_near_band_fold_large_sieve_theorem.py":
        "4d1075a2b61ef9d1cb510b2e21ac0225b94f702829b426014b8581c5ee6a72e6",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_FAR_ANNULUS_DILATION_LARGE_SIEVE_THEOREM.md":
        "c09ae35ef96a9d897446221354199e6a945c7e4b6d118a4b934b223452e137cc",
    "tests/test_growing_transition_ordered_prime_far_annulus_dilation_large_sieve_theorem.py":
        "1b09dd1eac6356e5a9faecbee8b400911d28577e473ee3583cfb1df349587f1b",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "tests/test_fixed_even_prefix_arithmetic_synthesis_theorem.py":
        "6e89f2f1af22260e5796eb67221fccd86d2668556e9cb23dd903ea283d5f069f",
    "notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md":
        "e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17",
    "tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py":
        "545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f",
    "notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md":
        "b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e",
    "tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py":
        "9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe",
    "notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md":
        "efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca",
    "tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py":
        "12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1",
    "notes/FIXED_EVEN_PREFIX_DIAGONAL_COVARIANCE_COLLAPSE_AND_SIGNED_TAIL_DICHOTOMY.md":
        "6d8be3d8bef6002d7fa2f1581e09bf27aa0dc12b2a3805fa7cd5e92863cd70d8",
    "tests/test_fixed_even_prefix_diagonal_covariance_collapse_and_signed_tail_dichotomy.py":
        "cd772d51fce2136756e82aff09831d690b26ec5aaf704f8aa8108e1f157a304a",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def truncated_toeplitz(size: int, samples: int = 100_000) -> np.ndarray:
    """Positive partial symbol sum; the n=1 term gives the exact 1/4 floor."""
    n_value = np.arange(1, samples + 1, dtype=float)
    alpha = np.arcsin(1 / n_value)
    gamma = np.empty(size, dtype=float)
    gamma[0] = np.sum(alpha / (2 * math.pi * n_value))
    for offset in range(1, size):
        gamma[offset] = np.sum(
            np.sin(4 * offset * alpha)
            / (8 * math.pi * offset * n_value)
        )
    indices = np.arange(size)
    return gamma[np.abs(indices[:, None] - indices[None, :])]


class FixedToGrowingToeplitzOperatorNormGateTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(f"`{relative}`", self.text)
            self.assertIn(f"`{expected}`", self.text)
        if not NOTE_HASH.startswith("DRAFT_"):
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_truncated_symbol_has_exact_quarter_floor(self) -> None:
        for size in (1, 2, 5, 12):
            matrix = truncated_toeplitz(size, samples=20_000)
            self.assertGreaterEqual(np.linalg.eigvalsh(matrix)[0], 0.25 - 2e-13)

    def test_g8_coefficient_matches_fixed_pair_value(self) -> None:
        # Labels 4 and 12 differ by two index steps, hence cos(8 beta).
        matrix = truncated_toeplitz(3, samples=300_000)
        value = matrix[0, 2]
        direct = sum(
            math.sin(8 * math.asin(1 / sample))
            / (16 * math.pi * sample)
            for sample in range(1, 300_001)
        )
        self.assertAlmostEqual(value, direct, places=13)
        self.assertGreater(value, 0.028)
        self.assertLess(value, 0.029)

    def test_entrywise_schur_gate_and_negative_part_threshold(self) -> None:
        rng = np.random.default_rng(1181)
        for size in (3, 9, 25):
            raw = rng.uniform(-1, 1, size=(size, size))
            error = 0.5 * (raw + raw.T)
            radius = float(np.max(np.abs(error)))
            self.assertLessEqual(np.linalg.norm(error, 2), size * radius + 1e-12)

            ell = 100.0
            toeplitz = truncated_toeplitz(size, samples=20_000)
            scaled = 0.1 * ell * error / max(np.linalg.norm(error, 2), 1e-12)
            assembled = ell * toeplitz + scaled
            self.assertGreaterEqual(np.linalg.eigvalsh(assembled)[0], 0.15 * ell - 1e-9)

    def test_uniform_entrywise_little_o_of_log_is_not_enough(self) -> None:
        ratios = []
        for size in (64, 256, 1024, 4096):
            entry_over_ell = 1 / math.sqrt(size)
            operator_over_ell = math.sqrt(size)
            ratios.append(entry_over_ell)
            self.assertGreater(operator_over_ell, 1)
            self.assertGreater(math.sqrt(size), math.log(size + 1))
        self.assertLess(ratios[-1], ratios[0] / 7)

    def test_structured_row_sums_have_the_claimed_scales(self) -> None:
        for size in (20, 100, 500):
            constant = np.ones((size, size))
            self.assertAlmostEqual(np.linalg.norm(constant, 2), size, places=10)

            hankel = np.fromfunction(
                lambda j, k: 1 / (j + k + 3), (size, size), dtype=float
            )
            max_row_sum = float(np.max(np.sum(np.abs(hankel), axis=1)))
            self.assertLessEqual(np.linalg.norm(hankel, 2), max_row_sum + 1e-12)
            self.assertLess(max_row_sum, 1 + math.log(size + 2))

    def test_claim_boundary_and_new_contribution_tokens(self) -> None:
        required = (
            "T_M\\succeq {1\\over4}I_M",
            "\\|(E_{M,c})_-\\|=o(\\ell)",
            "Mr_{M,c}=o(\\ell)",
            "r_{M,c}=o(1)",
            "uniform moving-matrix",
            "bounded real symbol",
            "constant Toeplitz matrix",
            "constant Hankel matrix",
            "dimension-free quarter-floor for the equality subsystem",
            "fixed `2m`-mode packet",
            "dimension-free operator-valued unequal-dilation Gram estimate",
            "strict-PASS endpoint-null collective-dilation barrier",
            "No arbitrary-pair fixed-label asymptotic",
            "P0_INVALIDATED",
            "standard eight are not changed",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_fail_closed_language(self) -> None:
        forbidden = (
            "This proves the complete growing signed floor",
            "The fixed-pair theorem is uniform in the label",
            "The near/far sieve applies to every growing low-label prefix",
            "proves the Riemann hypothesis",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

    def test_ascii_tex_and_import_hygiene(self) -> None:
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

        inside_aligned = False
        for line_number, line in enumerate(self.text.splitlines(), 1):
            if "\\begin{aligned}" in line:
                self.assertFalse(inside_aligned, line_number)
                inside_aligned = True
                continue
            if "\\end{aligned}" in line:
                self.assertTrue(inside_aligned, line_number)
                inside_aligned = False
                continue
            if inside_aligned:
                stripped = line.rstrip()
                trailing = len(stripped) - len(stripped.rstrip("\\"))
                self.assertNotEqual(trailing, 1, line_number)
        self.assertFalse(inside_aligned)

        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 25)
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
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
