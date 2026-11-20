#!/usr/bin/env python3
"""Regressions for the multiplier deficit-geometry boundary-alias barrier."""

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
    "GROWING_MULTIPLIER_DEFICIT_GEOMETRY_BOUNDARY_ALIAS_BARRIER.md"
)
NOTE_HASH = "2e5b38892f73848b4d081de5fef45f10819bd4e7f6a8be5a4edb8f85dae11141"

FROZEN = {
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "notes/PHASE_VOLUME_SCALE_AUDIT.md":
        "bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd",
    "notes/ANNULAR_GRAY_MASS_OBSTRUCTION.md":
        "85e26feefbb18482eacd9761ecca4d3743c26ff480a53983bcc5651e3ae80b5a",
    "notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md":
        "cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def orthogonal_complement(matrix: np.ndarray, tolerance: float = 1e-12) -> np.ndarray:
    _, singular, right = np.linalg.svd(matrix.T, full_matrices=True)
    rank = int(np.count_nonzero(singular > tolerance))
    return right[rank:, :].T


class GrowingMultiplierDeficitGeometryBoundaryAliasBarrierTests(unittest.TestCase):
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

    def test_nonzero_boundary_harmonics_have_zero_overlap(self) -> None:
        # A source interval of length L becomes M samples.  Translation by
        # kL becomes translation by kM in the zero extension, with no
        # positive-measure overlap for every nonzero integer k.
        rng = np.random.default_rng(20260811)
        samples = rng.normal(size=37) + 1j * rng.normal(size=37)
        extended = np.zeros(5 * samples.size, dtype=complex)
        offset = 2 * samples.size
        extended[offset:offset + samples.size] = samples
        norm = np.vdot(samples, samples)
        for harmonic in (-2, -1, 1, 2):
            shifted = np.roll(extended, harmonic * samples.size)
            correlation = np.vdot(extended, shifted)
            self.assertAlmostEqual(correlation.real, 0.0, places=13)
            self.assertAlmostEqual(correlation.imag, 0.0, places=13)
        self.assertGreater(norm.real, 0.0)
        self.assertIn(r"W_{q,L}", self.text)
        self.assertIn(r"=\bar q I", self.text)

    def test_exact_positive_part_means_and_shift_identity(self) -> None:
        lam = 1000.0
        g = 7.0
        upper_shift = 3.0
        beta = g + upper_shift
        alpha = math.acos(-beta / (4.0 * lam))
        mean_v = (beta * alpha + 4.0 * lam * math.sin(alpha)) / math.pi
        mean_a = mean_v - beta

        grid = (np.arange(400_000) + 0.5) * (2.0 * math.pi / 400_000)
        edge = -4.0 * lam * np.cos(grid)
        observed_v = float(np.mean(np.maximum(beta - edge, 0.0)))
        observed_a = float(np.mean(np.maximum(edge - beta, 0.0)))
        self.assertAlmostEqual(observed_v, mean_v, places=7)
        self.assertAlmostEqual(observed_a, mean_a, places=7)
        self.assertAlmostEqual(g + mean_a - mean_v, -upper_shift, places=13)

        leading = 4.0 * lam / math.pi
        self.assertLess(abs(mean_v - leading - beta / 2.0), beta**2 / lam)
        self.assertLess(abs(mean_a - leading + beta / 2.0), beta**2 / lam)
        self.assertGreater(mean_v, 100.0 * g)

    def test_critical_thickness_and_bernstein_scales(self) -> None:
        lam = 500.0
        logarithmic_length = 12.0
        beta = 9.0
        alpha = math.acos(-beta / (4.0 * lam))
        period = 2.0 * math.pi / logarithmic_length
        deficit_length = 2.0 * alpha / logarithmic_length
        positive_length = 2.0 * (math.pi - alpha) / logarithmic_length
        self.assertAlmostEqual(deficit_length + positive_length, period)
        self.assertAlmostEqual(deficit_length / period, alpha / math.pi)
        self.assertGreater(deficit_length / period, 0.5)
        self.assertLess(deficit_length / period, 0.51)

        amplitude = 4.0 * lam
        derivative_amplitude = 4.0 * lam * logarithmic_length
        self.assertEqual(derivative_amplitude, logarithmic_length * amplitude)
        window_radius = 100.0
        component_count = window_radius * logarithmic_length / math.pi
        self.assertGreater(component_count, 300.0)
        self.assertIn("saturates the natural Bernstein scale", self.text)
        self.assertIn("relatively dense", self.text)

    def test_exact_pole_parity_and_finite_cap_countermodel(self) -> None:
        lam = 30.0
        logarithmic_length = 2.0 * math.log(lam)
        plus_pole_norm = lam - 1.0 / lam + logarithmic_length
        minus_pole_norm = lam - 1.0 / lam - logarithmic_length
        self.assertGreater(plus_pole_norm, minus_pole_norm)
        self.assertGreater(minus_pole_norm, 0.0)

        dimension = 8
        upper_shift = 0.4
        p_plus = np.zeros((dimension, 1))
        p_minus = np.zeros((dimension, 1))
        p_plus[0, 0] = math.sqrt(plus_pole_norm / 2.0)
        p_minus[0, 0] = math.sqrt(minus_pole_norm / 2.0)
        captured = np.eye(dimension)[:, 1:4]
        constraints_plus = np.column_stack((captured, p_plus))
        constraints_minus = np.column_stack((captured, p_minus))
        residual_plus = orthogonal_complement(constraints_plus)
        residual_minus = orthogonal_complement(constraints_minus)
        self.assertEqual(residual_plus.shape[1], 4)
        self.assertEqual(residual_minus.shape[1], 4)

        edge_plus = -upper_shift * np.eye(dimension) + 2.0 * p_plus @ p_plus.T
        edge_minus = -upper_shift * np.eye(dimension) - 2.0 * p_minus @ p_minus.T
        np.testing.assert_allclose(
            residual_plus.T @ edge_plus @ residual_plus,
            -upper_shift * np.eye(4),
            atol=2e-14,
        )
        np.testing.assert_allclose(
            residual_minus.T @ edge_minus @ residual_minus,
            -upper_shift * np.eye(4),
            atol=2e-14,
        )
        self.assertLess(float(np.linalg.eigvalsh(edge_minus)[0]), -upper_shift)
        self.assertIn(r"2\epsilon|p_\epsilon\rangle", self.text)
        self.assertIn("The negative odd pole is retained", self.text)

    def test_actual_remainder_and_method_boundaries_are_explicit(self) -> None:
        required = (
            r"m_\lambda(z/L)=-4\lambda\cos z+o(\lambda)",
            "archimedean term makes the actual deficit integrable",
            "signed PNT discrepancy",
            "unresolved orientation",
            "Bernstein bounds and fragmentation",
            "Nazarov and Logvinenko--Sereda",
            "Toeplitz and Wiener--Hopf theory",
            "Diagonal dominance",
            "Fixed-symbol Szego or Garding asymptotics do not apply\nuniformly",
            "signed remainder\nor Feshbach inf--sup estimate",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_fail_closed_scope(self) -> None:
        required = (
            "countermodel to the proposed *geometry-only proof",
            "It is not the actual arithmetic operator",
            "does not assert",
            "genuine retained short is negative or singular",
            "No retained sign",
            "Riemann-hypothesis conclusion is proved",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the genuine retained short is negative",
            "the actual arithmetic operator is singular",
            "This proves the retained sign",
            "This proves the Riemann hypothesis",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
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
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex = Path(directory) / "note.tex"
            tex.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-halt-on-error", "-interaction=nonstopmode", tex.name],
                cwd=directory,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout[-4000:])


if __name__ == "__main__":
    unittest.main()
