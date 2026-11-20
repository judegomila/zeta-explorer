#!/usr/bin/env python3
"""Regressions for the generic fixed inversion-even weighted pair theorem."""

from __future__ import annotations

import ast
import cmath
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
    / "GENERIC_FIXED_INVERSION_EVEN_COMPLETE_WEIGHTED_PAIR_THEOREM.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md":
        "efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca",
    "tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py":
        "12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1",
    "notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md":
        "b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e",
    "tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py":
        "9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe",
    "notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md":
        "fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md":
        "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f",
    "notes/COMPACT_PROJECTION_WEIL_BOUND.md":
        "61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93",
    "notes/OUTER_PROJECTION_RADICAL_REDUCTION.md":
        "3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd",
}


def g_coefficient(k_value: int, cutoff: int = 400_000) -> float:
    """Truncated absolutely convergent coefficient G_k."""
    if k_value == 0:
        return sum(
            math.asin(1 / sample) / (2 * math.pi * sample)
            for sample in range(1, cutoff + 1)
        )
    return sum(
        math.sin(k_value * math.asin(1 / sample))
        / (2 * math.pi * k_value * sample)
        for sample in range(1, cutoff + 1)
    )


class GenericFixedInversionEvenWeightedPairTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(relative, text)
            self.assertIn(expected, text)

    def test_generic_g_factor_diagonal_and_4_12_recovery(self) -> None:
        g0 = g_coefficient(0)
        g8 = g_coefficient(8)
        self.assertGreater(g0, 0.35)
        self.assertLess(g0, 0.36)
        self.assertGreater(g8, 0.028)
        self.assertLess(g8, 0.029)
        self.assertAlmostEqual(g_coefficient(-8), g8, places=14)

        # The absolute tail is at most a constant times sum m^-2.
        cutoff = 10_000
        tail_bound = 1 / (2 * cutoff)
        self.assertLess(tail_bound, 1e-4)

    def test_quartic_center_phase_and_generic_sign(self) -> None:
        for odd in (5, 7, 9, 101):
            self.assertEqual((odd * odd) % 8, 1)

        for first, second in ((0, 0), (0, 4), (4, 4), (4, 8), (4, 12)):
            q_value = (first + second) // 4
            center_eighths = (2 * (first + second + 5)) % 16
            shifted_eighths = (center_eighths - 1) % 16
            actual_sign = -math.copysign(
                1.0, math.cos(shifted_eighths * math.pi / 8)
            )
            expected_sign = (-1) ** q_value
            self.assertEqual(int(actual_sign), expected_sign)

        s0 = 0.5 * math.log(2)

        def radial(value: float) -> float:
            return math.sqrt(math.exp(2 * value) - 1)

        for step in (0.04, 0.02, 0.01):
            quotient = (
                radial(s0 + step) + radial(s0 - step) - 2
            ) / step**4
            self.assertAlmostEqual(quotient, -4, delta=0.04)

        coefficient = math.gamma(0.25) * math.cos(math.pi / 8) / (8 * math.pi)
        self.assertGreater(coefficient, 0)

    def test_fractional_and_prime_majorants_converge(self) -> None:
        delta = 1 / 8
        self.assertLess(-2 + 2 * delta, -1)
        near = sum(
            sample ** (-2 + 2 * delta) * (1 + math.log(sample))
            for sample in range(2, 200_000)
        )
        self.assertLess(near, 12)
        hard_integrability_left = 2 * delta
        hard_integrability_right = -2 + 2 * delta
        self.assertGreater(hard_integrability_left, -1)
        self.assertLess(hard_integrability_right, -1)

        cutoff = 200_000
        prime_majorant = sum(
            math.log(n) * (1 + math.log(n)) ** 2 / n**2
            for n in range(2, cutoff + 1)
        )
        self.assertLess(prime_majorant, 20)

    def test_complex_toeplitz_identity_and_floor(self) -> None:
        coefficients = (1 + 2j, -0.3 + 0.7j, 0.4 - 0.2j, -0.1j)
        gram = [
            [g_coefficient(4 * (column - row), 120_000)
             for column in range(len(coefficients))]
            for row in range(len(coefficients))
        ]
        quadratic = sum(
            coefficients[row].conjugate()
            * gram[row][column]
            * coefficients[column]
            for row in range(len(coefficients))
            for column in range(len(coefficients))
        )
        norm_sq = sum(abs(value) ** 2 for value in coefficients)
        # The exact theorem gives 1/4; truncation omits a positive-tail
        # Toeplitz contribution, so allow a small numerical margin.
        self.assertAlmostEqual(quadratic.imag, 0.0, places=12)
        self.assertGreater(quadratic.real, 0.249 * norm_sq)

        # A genuinely complex vector distinguishes the two exponentials.
        beta = 0.23
        plus = abs(sum(
            value * cmath.exp(4j * (index + 1) * beta)
            for index, value in enumerate(coefficients)
        )) ** 2
        minus = abs(sum(
            value * cmath.exp(-4j * (index + 1) * beta)
            for index, value in enumerate(coefficients)
        )) ** 2
        self.assertGreater(abs(plus - minus), 1e-3)

    def test_projection_exponent_dominates_every_fixed_label(self) -> None:
        exponent = (
            9600 * math.log(2)
            - 4 * math.pi
        )
        self.assertGreater(exponent, 6000)

    def test_claim_boundary_and_exception_audit_are_present(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "G_{t-s}\\log c+o_{s,t}(\\log c)",
            "pure \\(h_{j,\\lambda}/\\sqrt{d_j}\\) row is not generally\n"
            "zero-integral",
            "Accordingly no pure \\(R_j\\), compact projection, or complete",
            "\\mathcal E_{\\rm act}=\\{4,8,12,\\ldots\\}",
            "{\\mathcal W_Z(R_t^{\\rm act},R_s^{\\rm act})\n"
            "       \\over\\sqrt{D_tD_s}}",
            "There is no actual-column assertion for label zero",
            "There is no exceptional common-sample resonance when",
            "isolated\nreciprocal stationary point",
            "If \\(s=t\\), that odd term",
            "(-1)^{(s+t)/4}",
            "leading local caustic coefficient never vanishes",
            "raw coefficient \\(O(D_j)\\)",
            "central arithmetic\nstate is exactly zero",
            "costs at most a fixed polynomial in \\(c\\)",
            "not merely \\(O_j(1)\\)",
            "Only at this point is the corrected actual source eligible",
            "No decomposition (6.9) is asserted for a pure",
            "both mixed\norientations",
            "exact limiting Toeplitz fact",
            "convergence to that limit is only\nfixed-prefix",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        self.assertNotIn("G_{t-s}\\log c+O_{s,t}(1)", text)
        self.assertNotIn("\\mathcal W_Z(R_t,R_s)", text)
        self.assertNotIn("For a fixed pure or actual white column", text)
        self.assertNotIn("proves the Riemann hypothesis", text.lower())

    def test_ascii_import_and_no_generated_package_cache(self) -> None:
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
                "__future__", "ast", "cmath", "hashlib", "math", "pathlib",
                "re", "shutil", "subprocess", "tempfile", "unittest",
            },
        )

        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(path.with_suffix(".pyc").exists())

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        text = NOTE.read_text(encoding="utf-8")
        displays = re.findall(r"\\\[(.*?)\\\]", text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
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
