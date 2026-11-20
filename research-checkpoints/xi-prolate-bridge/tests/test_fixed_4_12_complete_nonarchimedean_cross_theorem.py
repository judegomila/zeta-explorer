#!/usr/bin/env python3
"""Regressions for the fixed 4/12 complete non-Archimedean cross theorem."""

from __future__ import annotations

import ast
from fractions import Fraction
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md":
        "fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c",
    "notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md":
        "e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17",
    "notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md":
        "287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md":
        "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "notes/COMPACT_PROJECTION_WEIL_BOUND.md":
        "61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93",
    "notes/OUTER_PROJECTION_RADICAL_REDUCTION.md":
        "3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd",
    "notes/PROLATE_TAIL_ENVELOPE.md":
        "309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d",
    "notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md":
        "b16d33c89dd1517875180a0a5b03f0c0e2b601b0e0e608090016174a464e1e11",
}


def sawtooth_covariance(sample: int) -> Fraction:
    """Integrate (1/2-{x})(1/2-{n*x}) on its exact cells."""
    n_value = Fraction(sample)
    total = Fraction()
    for index in range(sample):
        left = Fraction(index, sample)
        right = Fraction(index + 1, sample)
        aa = n_value
        bb = -(n_value / 2 + index + Fraction(1, 2))
        cc = Fraction(1, 4) + Fraction(index, 2)
        total += aa * (right**3 - left**3) / 3
        total += bb * (right**2 - left**2) / 2
        total += cc * (right - left)
    return total


class Fixed412CompleteNonarchimedeanCrossTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", text)
            self.assertIn(f"`{expected}`", text)

    def test_anchor_and_deflation_white_scales(self) -> None:
        # sqrt(d_s/d_t) carries lambda^(s-t) for fixed labels.
        self.assertEqual(0 - 4, -4)
        self.assertEqual(4 - 12, -8)
        self.assertEqual(0 - 12, -12)

        d4_over_d8 = Fraction(105, 4096)
        d12_over_d8 = Fraction(16**4, 9 * 10 * 11 * 12)
        self.assertEqual(d4_over_d8 * d12_over_d8, Fraction(14, 99))

    def test_integer_dilation_endpoint_row(self) -> None:
        for sample in range(1, 100):
            self.assertEqual(
                sawtooth_covariance(sample),
                Fraction(1, 12 * sample),
            )

    def test_same_side_equality_majorant_and_prime_sum(self) -> None:
        for n_value in (2, 3, 17, 101):
            for ell in (1, 2, 9):
                radial = n_value * ell
                lower = math.sqrt(radial * radial - 1)
                lhs = 1 / (2 * math.pi * ell * math.sqrt(n_value) * lower)
                rhs = 1 / (
                    math.pi * math.sqrt(3) * n_value**1.5 * ell**2
                )
                self.assertLessEqual(lhs, rhs + 1e-15)

        cutoff = 100_000
        partial = sum(
            math.log(n) * (1 + math.log(n)) ** 2 / n**2
            for n in range(2, cutoff + 1)
        )
        tail = (
            math.log(cutoff) ** 3
            + 4 * math.log(cutoff) ** 2
            + 10 * math.log(cutoff)
            + 10
        ) / cutoff
        self.assertLess(partial + tail, 20)

    def test_locked_pure_4_12_quartic_phase_and_constant(self) -> None:
        for odd in (5, 7, 9, 101):
            self.assertEqual((odd * odd) % 8, 1)

        # 2*c contributes pi modulo 2*pi, and (nu4+nu12)*pi/4=17*pi/4.
        center_units_of_pi_over_4 = (4 + 17) % 8
        self.assertEqual(center_units_of_pi_over_4, 5)

        s0 = 0.5 * math.log(2)

        def radial(s_value: float) -> float:
            return math.sqrt(math.exp(2 * s_value) - 1)

        for step in (0.04, 0.02, 0.01):
            quartic_ratio = (
                radial(s0 + step) + radial(s0 - step) - 2
            ) / step**4
            self.assertAlmostEqual(quartic_ratio, -4, delta=0.04)

        amplitude = 2 ** (-0.25) / math.sqrt(math.pi)
        integral_scale = math.gamma(0.25) / (2 * math.sqrt(2))
        coefficient = (
            amplitude**2 / 2
            * integral_scale
            * math.cos(math.pi / 8)
        )
        expected = math.gamma(0.25) * math.cos(math.pi / 8) / (8 * math.pi)
        self.assertAlmostEqual(coefficient, expected, places=14)
        self.assertGreater(coefficient, 0)

    def test_hard_edge_and_quartic_lattice_masses_gain_width(self) -> None:
        for c_value in (10**4, 10**8, 10**12):
            point_height = c_value ** (-0.25)
            width = c_value ** (-0.5)
            self.assertAlmostEqual(point_height * width, c_value ** (-0.75))
            self.assertLess(
                c_value ** (-0.75) * math.log(c_value),
                2 * c_value ** (-0.5),
            )

    def test_projection_exponent_is_positive(self) -> None:
        margin = 9600 * math.log(2) - 320 * math.pi * math.log(96) / math.log(2)
        self.assertGreater(margin, 34)
        self.assertLess(margin, 35)

    def test_exact_scope_and_locked_signs_are_present(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "complete same-side inclusive-minus-prime fold",
            "Q_{\\rm refl}(O_j,O_k)=-2\\lambda\\mathcal M_{jk;A}",
            "P_+(O_j,O_k)=2\\widehat O_j(i/2)",
            "Both mixed orientations are present",
            "does not prove the weighted Archimedean",
            "No sign is assigned",
            "no RH conclusion",
        )
        for phrase in required:
            self.assertIn(phrase, text)

    def test_package_bytes_and_imports_are_clean(self) -> None:
        tree = ast.parse(TEST.read_text(encoding="utf-8"))
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
                "pathlib", "re", "shutil", "subprocess", "tempfile",
                "unittest",
            },
        )

        for path in (NOTE, TEST):
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
        self.assertGreaterEqual(len(displays), 45)
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
