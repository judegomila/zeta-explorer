#!/usr/bin/env python3
"""Regressions for the anchor/label-12 signed-cross barrier."""

from __future__ import annotations

from fractions import Fraction as F
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
NOTE = ROOT / "notes" / "ANCHOR_LABEL12_SIGNED_CROSS_CORRELATION_BARRIER.md"

PROTECTED_HASHES = {
    "notes/FIRST_TRANSVERSE_RELATIVE_LEAKAGE_ENDPOINT_HIERARCHY_BARRIER.md":
        "aa2027679035174d2af6ef533f04b66f5dc9f9006e97b8ef77fc011b7501ef79",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md":
        "c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b",
    "notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md":
        "fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c",
    "notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md":
        "e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
}


class AnchorLabel12SignedCrossBarrierTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", text)
            self.assertIn(f"`{expected}`", text)

    def test_critical_defect_ratio_is_fourteen_over_ninety_nine(self) -> None:
        d4_over_d8 = F(105, 4096)
        d12_over_d8 = F(16**4, 9 * 10 * 11 * 12)
        self.assertEqual(d4_over_d8 * d12_over_d8, F(14, 99))

    def test_sawtooth_cross_has_pi_over_twelve_coefficient(self) -> None:
        # Strip pi.  Two tails, two endpoint factors, and int P^2=1/12
        # give exactly 1/12 after defect whitening.
        endpoint_product_without_pi = F(2)
        poisson_two_tail_factor = F(1, 2)
        sawtooth_second_moment = F(1, 12)
        self.assertEqual(
            endpoint_product_without_pi
            * poisson_two_tail_factor
            * sawtooth_second_moment,
            F(1, 12),
        )

    def test_complete_jost_carrier_is_strictly_positive(self) -> None:
        negative_m2_without_pi = math.sqrt(3) / 64
        tail_lower_without_pi = 119 * math.sqrt(15) / 8192
        self.assertGreater(tail_lower_without_pi, negative_m2_without_pi)
        self.assertGreater(119 * math.sqrt(5), 128)

        partial = sum(
            math.sin(8 * math.asin(1 / m)) / (16 * math.pi * m)
            for m in range(1, 200_000)
        )
        self.assertGreater(partial, 0.028)
        self.assertLess(partial, 0.029)

    def test_second_correction_unique_raising_path(self) -> None:
        # Squaring the radical coefficient in (5.2) removes sqrt(154).
        numerator_squared = 45**2 * 154
        denominator_squared = 1024**2
        self.assertEqual(F(numerator_squared, denominator_squared), F(155925, 524288))

        # The two raising gaps are 16*pi and 32*pi.
        self.assertEqual(4 * (8 - 4), 16)
        self.assertEqual(4 * (12 - 4), 32)

    def test_claim_boundary_keeps_complete_signed_form(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "does **not** prove (0.3)",
            "inclusive minus-prime",
            "both mixed orientations",
            "mathcal G_8>0",
            "cutoff-uniform logarithmic moment",
            "cannot be\npolarized into an asymptotic",
            "No equation (5.2)",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        self.assertNotIn("proves the Riemann hypothesis", text.lower())

    def test_aligned_rows_and_package_bytes_are_clean(self) -> None:
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
                "__future__", "ast", "fractions", "hashlib", "math",
                "pathlib", "re", "shutil", "subprocess", "tempfile", "unittest",
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
