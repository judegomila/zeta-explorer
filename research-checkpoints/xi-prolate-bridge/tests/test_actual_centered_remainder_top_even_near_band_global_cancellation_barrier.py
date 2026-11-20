#!/usr/bin/env python3
"""Strict regressions for the top-even near-band cancellation barrier.

The fixtures are finite integer/Fraction calculations.  No prime sample,
zero table, numerical eigensolver, cached matrix, or network resource is
read.
"""

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
NOTE = ROOT / "notes" / (
    "ACTUAL_CENTERED_REMAINDER_TOP_EVEN_NEAR_BAND_"
    "GLOBAL_CANCELLATION_BARRIER.md"
)
NOTE_HASH = "e3c660f12f8d147f6d1caff14805d22325cee679a1a6b38ff5f9ec78d99b812f"

FROZEN = {
    "notes/ACTUAL_CENTERED_REMAINDER_SHIFTED_CORRELATION_TOP_MOMENT_UI_BARRIER.md":
        "8ab0f30e32fe715a4f839228f5d05dc581292c99c2a04f42804f0ff4d2d878d9",
    "tests/test_actual_centered_remainder_shifted_correlation_top_moment_ui_barrier.py":
        "ecaf4f1eaaab4a3a146c277eb0897e79d5323bfe9b79709bbc5cac5d423bd787",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ActualCenteredRemainderTopEvenNearBandGlobalCancellationBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_frozen_dependency_and_self_hash(self) -> None:
        expected = {
            "notes/ACTUAL_CENTERED_REMAINDER_SHIFTED_CORRELATION_TOP_MOMENT_UI_BARRIER.md",
            "tests/test_actual_centered_remainder_shifted_correlation_top_moment_ui_barrier.py",
        }
        self.assertEqual(set(FROZEN), expected)
        for relative, digest in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), digest)
                self.assertIn(relative, self.text)
                self.assertIn(digest, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_exponent_and_shift_scales(self) -> None:
        for k_value in range(1, 9):
            r_value = k_value + 1
            product_exponent = r_value
            time_exponent = k_value
            shift_exponent = product_exponent - time_exponent
            self.assertEqual(shift_exponent, 1)
        required = (
            r"r=k+1",
            r"T=Ax^k=Ax^{r-1}",
            r"X=x^r",
            r"{X\over T}",
            r"\asymp_A x",
            "growing near band",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_restricted_mass_identity_and_lower_constant(self) -> None:
        # The exact finite analogue: convolution total mass is the r-th
        # power of the one-prime mass, before equal products are collected.
        weights = {2: 2, 3: 3, 5: 5}
        values = {1: 1}
        for power in range(1, 7):
            next_values: dict[int, int] = {}
            for index, coefficient in values.items():
                for prime, weight in weights.items():
                    product = index * prime
                    next_values[product] = (
                        next_values.get(product, 0) + coefficient * weight
                    )
            values = next_values
            self.assertEqual(sum(values.values()), sum(weights.values()) ** power)

        self.assertIn(
            r"\left(\vartheta(x)-\vartheta(x/2)\right)^r",
            self.normalized,
        )
        self.assertIn(r"\left(2^{-r}+o(1)\right)X", self.normalized)
        self.assertIn(r"\sum_nB_{r,x}(n)\geq3^{-r}X", self.normalized)

    def test_kernel_positive_core_constant_is_rigorous(self) -> None:
        for r_value in range(2, 9):
            # T*h0/min(J) after deleting the floor and common powers.
            ratio = F(1, 2 ** (r_value + 4)) / F(1, 2**r_value)
            self.assertEqual(ratio, F(1, 16))
        max_sv = F(1, 8)
        cosine_lower = 1 - max_sv * max_sv / 2
        self.assertGreater(cosine_lower, F(1, 2))
        self.assertIn(r"={1\over16}", self.normalized)
        self.assertIn(
            r"\operatorname {Re}K(v)\geq{1\over2}",
            self.normalized,
        )

    def test_bin_cauchy_lower_bound(self) -> None:
        for r_value in range(2, 9):
            mass = F(1, 3**r_value)
            bin_count_factor = F(2)
            lower = mass * mass / bin_count_factor
            self.assertEqual(lower, F(1, 2 * 3 ** (2 * r_value)))
            kernel_and_denominator = F(1, 2)
            self.assertEqual(
                lower * kernel_and_denominator,
                F(1, 4 * 3 ** (2 * r_value)),
            )
        self.assertIn(r"\sum_j\beta_j^2", self.normalized)
        self.assertIn(r"{3^{-2r}\over2}Xh_0", self.normalized)
        self.assertIn(r"{3^{-2r}\over4}h_0", self.normalized)

    def test_off_diagonal_survives_shell_diagonal_removal(self) -> None:
        for r_value in range(2, 9):
            weighted_energy_x_exponent = r_value
            shell_denominator_x_exponent = r_value
            self.assertEqual(
                weighted_energy_x_exponent - shell_denominator_x_exponent,
                0,
            )
        required = (
            r"W_{r,x}\leq r!V_x^r",
            r"\ll_r(xL)^r=XL^r",
            r"\ll_r L^r",
            "restricted top product shell",
            "full diagonal asymptotic",
            r"\mathcal N_{r,A}(x):=",
            r"\gg_{A,r}x",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_complete_cancellation_is_the_exact_conditional_target(self) -> None:
        required = (
            r"M_{r,r}(T)=D_{r,x}+\mathcal N_{r,A}(x)",
            r"\mathcal F_{r,A}(x)",
            r"=-\mathcal N_{r,A}(x)+O_{A,r}(L^{2r})",
            r"O_{A,r}(xL^r)",
            r"{x\over L^r}",
            "complete signed-kernel evaluation",
            "not a positive majorant",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_shifted_asymptotic_error_budget(self) -> None:
        for r_value in range(2, 9):
            shift_exponent = F(1, r_value)
            average_error_exponent = 1 - shift_exponent
            self.assertEqual(average_error_exponent, F(r_value - 1, r_value))
        required = (
            r"H={X\over T}\asymp_A X^{1/r}=x",
            r"\sum_{0<|h|\ll H}|E_r(h;X)|",
            r"\ll_{A,r}XL^{2r}",
            r"X^{1-1/r}L^{2r}",
            r"X^(-1/r)` power saving",
            r"X^(4/5)L^10=x^4L^10",
            "growing-shift aggregate requirement",
            "not supplied by a theorem for every fixed `h`",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_k_four_constants_and_two_diagonal_scales(self) -> None:
        r_value = 5
        self.assertEqual(2 ** (r_value + 4), 512)
        self.assertEqual(2**r_value, 32)
        self.assertEqual(math.factorial(r_value), 120)
        required = (
            r"h_0=\left\lfloor{x\over512A}\right\rfloor",
            r"n,m\in[x^5/32,x^5]",
            r"\mathcal N_{5,A}(x)\gg_Ax",
            r"=O(L^5)",
            r"D_{5,x}=\{120+o(1)\}S_x^5\asymp L^{10}",
            r"M_{5,5}(Ax^4)=O_A(L^{10})",
            r"O_A(xL^5)",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_method_and_claim_boundaries(self) -> None:
        required = (
            "fixed-shift ninth-moment",
            "growing-shift tenth-moment",
            "Unique factorization",
            "Divisor switching",
            "Selberg-sieve majorants",
            "dispersion or large-sieve theorem",
            "Coefficient positivity",
            "does not prove a lower bound for the complete moment",
            "No claim is made that the full tenth moment is `Omega(x)`",
            "one-way phase-volume comparison",
            "No determinant theorem",
            "Riemann hypothesis",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_note_contract_and_tex_hygiene(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("TO_BE_FROZEN", self.text)
        self.assertNotIn("proves RH", self.text)
        self.assertNotIn("\r", self.text)
        self.assertNotIn("\t", self.text)
        self.assertIsNone(re.search(r"[ \t]+$", self.text, flags=re.MULTILINE))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
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
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_static_ascii_ast_hash_and_cache_clean(self) -> None:
        test_path = Path(__file__)
        tree = ast.parse(test_path.read_text(encoding="ascii"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])

        for path in (NOTE, test_path):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )


if __name__ == "__main__":
    unittest.main()
