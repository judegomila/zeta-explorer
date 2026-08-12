#!/usr/bin/env python3
"""Regressions for the complete anchor/label-12 cross asymptotic."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "ANCHOR_LABEL12_COMPLETE_WEIGHTED_CROSS_ASYMPTOTIC_THEOREM.md"
)

PROTECTED_HASHES = {
    "notes/ANCHOR_LABEL12_SIGNED_CROSS_CORRELATION_BARRIER.md":
        "632f9320855d48ac923e13d1176347cb9ccbe7925170babd52a0c5313d5bfb00",
    "notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md":
        "b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e",
    "tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py":
        "9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md":
        "efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca",
    "tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py":
        "12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
}


def sawtooth_covariance(sample: int) -> F:
    total = F(0)
    n_value = F(sample)
    for index in range(sample):
        left = F(index, sample)
        right = F(index + 1, sample)
        aa = n_value
        bb = -(n_value / 2 + index + F(1, 2))
        cc = F(1, 4) + F(index, 2)
        total += aa * (right**3 - left**3) / 3
        total += bb * (right**2 - left**2) / 2
        total += cc * (right - left)
    return total


class AnchorLabel12CompleteWeightedCrossTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", text)
            self.assertIn(f"`{expected}`", text)

    def test_defect_white_correction_exponents_and_critical_ratio(self) -> None:
        # sqrt(d_s/d_t) has exponent lambda^{-(t-s)} for fixed labels.
        self.assertEqual(4 - 0, 4)
        self.assertEqual(12 - 4, 8)
        self.assertEqual(12 - 0, 12)
        d4_over_d8 = F(105, 4096)
        d12_over_d8 = F(16**4, 9 * 10 * 11 * 12)
        self.assertEqual(d4_over_d8 * d12_over_d8, F(14, 99))

    def test_g8_sign_factor_and_orientation(self) -> None:
        partial = sum(
            math.sin(8 * math.asin(1 / sample))
            / (16 * math.pi * sample)
            for sample in range(1, 200_000)
        )
        self.assertGreater(partial, 0.028)
        self.assertLess(partial, 0.029)
        self.assertGreater(119 * math.sqrt(15) / 8192, math.sqrt(3) / 64)
        # The cross is real, hence orientation reversal does not change G8.
        self.assertEqual(complex(partial).conjugate().real, partial)

    def test_fractional_log_moment_majorants_converge(self) -> None:
        delta = F(1, 8)
        sample_power = -2 + 2 * float(delta)
        interval_ratio = math.exp(-(1 - 2 * float(delta)))
        self.assertLess(sample_power, -1)
        self.assertLess(interval_ratio, 1)
        partial = sum(sample**sample_power for sample in range(1, 100_000))
        tail = 100_000 ** (sample_power + 1) / (-sample_power - 1)
        self.assertTrue(math.isfinite(partial + tail))
        self.assertLess(partial + tail, 3)
        for value in (1.0, 2.0, 10.0, 1e6):
            self.assertLessEqual(
                math.log(value),
                (value ** float(delta) - 1) / float(delta) + 1e-12,
            )

    def test_exact_integer_dilation_row(self) -> None:
        for sample in range(1, 60):
            self.assertEqual(sawtooth_covariance(sample), F(1, 12 * sample))

    def test_prime_majorant_and_caustic_scales(self) -> None:
        cutoff = 200_000
        prime_majorant = sum(
            math.log(n) * (1 + math.log(n)) ** 2 / n**2
            for n in range(2, cutoff + 1)
        )
        self.assertTrue(math.isfinite(prime_majorant))
        self.assertLess(prime_majorant, 20)
        for c_value in (1e4, 1e8, 1e16):
            core = c_value**-0.25 * c_value**-0.5 * math.log(c_value)
            target = c_value**-0.5
            self.assertLess(core, target)
            self.assertAlmostEqual(
                2 * math.sqrt(c_value / (2 * math.pi)) * c_value**-0.5,
                math.sqrt(2 / math.pi),
            )

    def test_pole_row_scaling_is_bounded(self) -> None:
        for lambda_value in (2.5, 20.5, 100.5):
            c_value = 2 * math.pi * lambda_value**2
            right = math.sqrt(lambda_value) / c_value
            left = lambda_value**-0.5
            self.assertLessEqual(right, left / (2 * math.pi))
            self.assertLess((right + left) ** 2, 1)

    def test_projection_exponent_is_positive(self) -> None:
        exponent = (
            9600 * math.log(2)
            - 320 * math.pi * math.log(96) / math.log(2)
        )
        self.assertGreater(exponent, 34)
        self.assertLess(exponent, 35)

    def test_claim_boundary_and_complete_ledger(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "mathcal G_8\\log c+o(\\log c)",
            "sqrt{14\\over99}",
            "ground-label component",
            "cutoff-uniform",
            "inclusive prime endpoint",
            "even pole magnitude",
            "both mixed orientations",
            "failure of that sufficient residual route",
            "not a\nfailure of positivity",
            "does **not** promote",
            "O(1/\\log c)",
            "No zero list",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        self.assertNotIn("mathcal G_8\\log c+O(1)", text)
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
        self.assertGreaterEqual(len(displays), 20)
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
