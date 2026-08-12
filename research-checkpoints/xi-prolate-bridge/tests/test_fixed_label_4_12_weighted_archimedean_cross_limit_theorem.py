#!/usr/bin/env python3
"""Regressions for the fixed-label 4/12 weighted Archimedean limit."""

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


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md"

PROTECTED_HASHES = {
    "notes/ANCHOR_LABEL12_SIGNED_CROSS_CORRELATION_BARRIER.md":
        "632f9320855d48ac923e13d1176347cb9ccbe7925170babd52a0c5313d5bfb00",
    "notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md":
        "e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17",
    "notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md":
        "fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c",
    "notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md":
        "34bb4e43faf04f34e11126946b1069480375d5ba18baf9c97e9746b246594a0f",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
}


class FixedLabel412WeightedArchimedeanLimitTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", text)
            self.assertIn(f"`{expected}`", text)

    def test_g8_factor_and_sign(self) -> None:
        value = sum(
            math.sin(8 * math.asin(1 / sample))
            / (16 * math.pi * sample)
            for sample in range(1, 300_000)
        )
        self.assertGreater(value, 0.028)
        self.assertLess(value, 0.029)
        self.assertGreater(119 * math.sqrt(15), 128 * math.sqrt(3))

    def test_fractional_majorants_are_summable(self) -> None:
        delta = 1 / 8
        self.assertLess(delta, 1 / 2)
        self.assertLess(-2 + 2 * delta, -1)
        diagonal = sum(m ** (-2 + 2 * delta) for m in range(2, 200_000))
        near = sum(
            m ** (-2 + 2 * delta) * (1 + math.log(m))
            for m in range(2, 200_000)
        )
        self.assertLess(diagonal, 2)
        self.assertLess(near, 12)
        self.assertGreater(1 - 2 * delta, 0)
        self.assertGreater(1 - 4 * delta, 0)

    def test_sawtooth_gagliardo_integral_is_finite(self) -> None:
        delta = 1 / 8
        # Integral_0^1 v^(-2d)(1+log(1/v)) dv.
        alpha = 1 - 2 * delta
        exact = 1 / alpha + 1 / alpha**2
        self.assertTrue(math.isfinite(exact))
        self.assertLess(exact, 4)
        for value in (1.0, 2.0, 10.0, 1e8):
            self.assertLessEqual(
                math.log(value), value**delta / delta + 1e-12
            )

    def test_claim_boundary_is_fail_closed(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "mathcal G_8\\log c+o(\\log c)",
            "does **not** promote",
            "Differentiating the printed `O(1/c)` remainder",
            "cutoff-uniform",
            "Fejer",
            "Ah\\sum_{A\\leq n\\leq1/h}n^{-1}",
            "No\nBernoulli remainder is differentiated term by term",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        self.assertNotIn("proves the Riemann hypothesis", text.lower())

    def test_ascii_tex_and_import_hygiene(self) -> None:
        inside_aligned = False
        for line_number, line in enumerate(
            NOTE.read_text(encoding="utf-8").splitlines(), 1
        ):
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

        tree = ast.parse(Path(__file__).read_text(encoding="utf-8"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__", "ast", "hashlib", "math", "pathlib", "re",
                "shutil", "subprocess", "tempfile", "unittest",
            },
        )
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
        text = NOTE.read_text(encoding="utf-8")
        displays = re.findall(r"\\\[(.*?)\\\]", text, flags=re.S)
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
