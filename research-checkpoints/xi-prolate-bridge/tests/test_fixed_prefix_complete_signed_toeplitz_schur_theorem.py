#!/usr/bin/env python3
"""Regressions for the fixed-prefix complete signed Toeplitz theorem."""

from __future__ import annotations

import ast
import cmath
import hashlib
import math
from pathlib import Path
import random
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FIXED_PREFIX_COMPLETE_SIGNED_TOEPLITZ_SCHUR_THEOREM.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md":
        "b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e",
    "tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py":
        "9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe",
    "notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md":
        "efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca",
    "tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py":
        "12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1",
    "notes/GENERIC_FIXED_INVERSION_EVEN_COMPLETE_WEIGHTED_PAIR_THEOREM.md":
        "c53a709dd1d7603ef1d2361c324a3f91f471705989ee06cd0f715fe4da4ec213",
    "tests/test_generic_fixed_inversion_even_complete_weighted_pair_theorem.py":
        "3dea227c95a0a514578229b2e07b13e4d42ab57f7c5459245c9796ce3344cbe1",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "notes/FIXED_TO_GROWING_TOEPLITZ_OPERATOR_NORM_GATE.md":
        "57f4a8014e280e4594221b4466212b0104d2d7c25e9e6ff81808a4eb7f14ce25",
    "tests/test_fixed_to_growing_toeplitz_operator_norm_gate.py":
        "4b2d982c5de1b28fe3bac56e412f43a6a333bf47e643cf6bd435e589271bbf31",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md":
        "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f",
    "notes/COMPACT_PROJECTION_WEIL_BOUND.md":
        "61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93",
    "notes/OUTER_PROJECTION_RADICAL_REDUCTION.md":
        "3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd",
}


def gamma_coefficient(index: int, cutoff: int = 500_000) -> float:
    """Return a controlled large partial sum for Gamma_index."""
    if index == 0:
        return sum(
            math.asin(1 / sample) / (2 * math.pi * sample)
            for sample in range(1, cutoff + 1)
        )
    return sum(
        math.sin(4 * index * math.asin(1 / sample))
        / (8 * math.pi * index * sample)
        for sample in range(1, cutoff + 1)
    )


def sawtooth_weight(beta: float) -> float:
    if beta == 0:
        raise ValueError("the endpoint weight diverges logarithmically")
    top = math.floor(1 / math.sin(beta) + 1e-13)
    return sum(1 / (2 * math.pi * sample) for sample in range(1, top + 1))


class FixedPrefixCompleteSignedToeplitzSchurTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", text)
            self.assertIn(f"`{expected}`", text)

    def test_toeplitz_coefficients_and_anchor_12_regression(self) -> None:
        gamma0 = gamma_coefficient(0)
        gamma1 = gamma_coefficient(1)
        gamma2 = gamma_coefficient(2)
        # The omitted tails are below 1/(2*pi*cutoff) at this precision.
        self.assertAlmostEqual(gamma0, 0.355070021, delta=2e-6)
        self.assertAlmostEqual(gamma1, 0.0724418, delta=2e-6)
        self.assertAlmostEqual(gamma2, 0.0282956, delta=2e-6)
        g8 = sum(
            math.sin(8 * math.asin(1 / sample))
            / (16 * math.pi * sample)
            for sample in range(1, 500_001)
        )
        self.assertAlmostEqual(gamma2, g8, places=14)
        self.assertGreater(gamma2, 0)

    def test_weight_floor_and_complex_cosine_polarization(self) -> None:
        rng = random.Random(20260811)
        coefficients = [
            complex(rng.uniform(-1, 1), rng.uniform(-1, 1))
            for _ in range(5)
        ]
        for beta in (0.013, 0.2, 0.61, 1.2, math.pi / 2):
            weight = sawtooth_weight(beta)
            self.assertGreaterEqual(weight + 1e-15, 1 / (2 * math.pi))
            direct = 0j
            for left, a_left in enumerate(coefficients, 1):
                for right, a_right in enumerate(coefficients, 1):
                    direct += (
                        a_left.conjugate()
                        * a_right
                        * math.cos(4 * (left - right) * beta)
                    )
            plus = sum(
                value * cmath.exp(4j * index * beta)
                for index, value in enumerate(coefficients, 1)
            )
            minus = sum(
                value * cmath.exp(-4j * index * beta)
                for index, value in enumerate(coefficients, 1)
            )
            polarized = (abs(plus) ** 2 + abs(minus) ** 2) / 2
            self.assertAlmostEqual(direct.imag, 0, places=13)
            self.assertAlmostEqual(direct.real, polarized, places=12)

    def test_constant_weight_integral_is_exact_quarter(self) -> None:
        # Integral_0^(pi/2) exp(i*4*r*beta) vanishes for nonzero integer r.
        for difference in range(-10, 11):
            if difference == 0:
                integral = math.pi / 2
            else:
                integral = (
                    cmath.exp(2j * math.pi * difference) - 1
                ) / (4j * difference)
            if difference:
                self.assertAlmostEqual(abs(integral), 0, places=14)
            else:
                self.assertEqual(integral, math.pi / 2)
        self.assertEqual((1 / (2 * math.pi)) * (math.pi / 2), 0.25)

    def test_three_label_schur_reserve(self) -> None:
        g0 = gamma_coefficient(0)
        g1 = gamma_coefficient(1)
        g2 = gamma_coefficient(2)
        determinant = g0 * g0 - g1 * g1
        self.assertGreater(determinant, 0)
        inverse_load = (
            g0 * (g1 * g1 + g2 * g2) - 2 * g1 * g1 * g2
        ) / determinant
        tau = g0 - inverse_load
        self.assertGreaterEqual(tau, 0.25 - 2e-6)
        self.assertLess(inverse_load, g0 - 0.25 + 2e-6)
        # A nonzero raw cross has a finite inverse-weighted cost.
        self.assertGreater(g2 * g2 / g0, 0)
        self.assertLess(g2 * g2 / g0, g0 - 0.25)

    def test_defect_critical_scale_is_preserved(self) -> None:
        d4_over_d8 = 105 / (4096 * math.pi**4)
        d12_over_d8 = 16**4 * math.pi**4 / (9 * 10 * 11 * 12)
        self.assertAlmostEqual(d4_over_d8 * d12_over_d8, 14 / 99)
        self.assertAlmostEqual(
            math.sqrt(d4_over_d8 * d12_over_d8),
            math.sqrt(14 / 99),
        )

    def test_claim_boundary_and_growing_gate(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "diagonal scalar-defect normalization",
            "o_M(\\log c)",
            "T_M\\succeq {1\\over4}I_M",
            "Both mixed orientations",
            "no global radical or compact projection is\nattached to it",
            "inverse-weighted Schur cost",
            "old sufficient row-smallness route",
            "does not replace the Rayleigh-shifted block",
            "earliest genuinely new estimate",
            "collection of fixed-pair `O(1)` bounds is insufficient",
            "No growing uniformity or RH conclusion is claimed",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "proves the Riemann hypothesis",
            "are uniform when M=M(\\lambda)",
            "Gamma_{j-k}\\log c+O(1)",
            "P_t^{\\rm pure}",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_aligned_rows_package_bytes_and_imports_are_clean(self) -> None:
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
                "__future__", "ast", "cmath", "hashlib", "math",
                "pathlib", "random", "re", "shutil", "subprocess",
                "tempfile", "unittest",
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
