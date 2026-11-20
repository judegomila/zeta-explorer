#!/usr/bin/env python3
"""Exact regressions for the RH even zero-Gram Gevrey reserve barrier."""

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
NOTE = ROOT / "notes" / "RH_EVEN_ZERO_GRAM_GEVREY_RELATIVE_RESERVE_BARRIER.md"
NOTE_HASH = "4527a5cc5ba8a7c66b76ff70c4aa4423aaecd60fe10ba52cee134b9d9c2ef36c"

FROZEN = {
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "tests/test_gevrey_prolate_remainder.py":
        "93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058",
    "notes/RH_ODD_ZERO_GRAM_GEVREY_RELATIVE_FLOOR_BARRIER.md":
        "295e387c1e0ea9935bebb8458a9fea255ed60919116832dc4cd3756b033bea89",
    "tests/test_rh_odd_zero_gram_gevrey_relative_floor_barrier.py":
        "e8517b2baa6ec084d724826136bc4d15b427416211c2679bfbdca2be76a19c29",
    "notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md":
        "e5a0888f54ae4ae97d00462b7cfd00cbc9d98638ff9d36aea0fdb7a1c861e77f",
    "tests/test_transverse_xi_radical_moment_angle_obstruction.py":
        "3cbea43c78355fcece4dec25a76280ee23e5c706b0d509c2951b003d3a531c75",
    "notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md":
        "ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a",
    "tests/test_anti_carrier_log_schedule.py":
        "304175ece40e36ae979dffa44c43009d1b796be2d72a820d7021758a34472a1b",
    "notes/SHIFTED_ZERO_SELECTOR_GAUSSIAN_QUADRATURE_BARRIER.md":
        "1a2c95f9cf352a89b5eda544ac7158124761b1afe49ead464ca881ca08d6acd1",
    "tests/test_shifted_zero_selector_gaussian_quadrature_barrier.py":
        "2da21833bf1d79977c7b1b656be3f40d9bfbe9e2483ecb5c65941fabb6dde2d0",
    "notes/RH_ZERO_GAUSSIAN_SQUARE_FREE_LIMIT_THEOREM.md":
        "6622d6ee81f08daef596850ecd4dfbb071c5a2a087e083ee5f68a5bc1b211742",
    "tests/test_rh_zero_gaussian_square_free_limit_theorem.py":
        "680c2ad7ebef01683b218d4f2e4693047d01a0452346fe89b8277f7bd31c84fb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def determinant(matrix: list[list[F]]) -> F:
    work = [row[:] for row in matrix]
    result = F(1)
    for column in range(len(work)):
        pivot = next(
            row for row in range(column, len(work)) if work[row][column]
        )
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        value = work[column][column]
        result *= value
        for row in range(column + 1, len(work)):
            scale = work[row][column] / value
            for index in range(column, len(work)):
                work[row][index] -= scale * work[column][index]
    return result


def rank(matrix: tuple[tuple[F, ...], ...]) -> int:
    if not matrix:
        return 0
    work = [list(row) for row in matrix]
    pivot_row = 0
    for column in range(len(work[0])):
        pivot = next(
            (row for row in range(pivot_row, len(work)) if work[row][column]),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        value = work[pivot_row][column]
        work[pivot_row] = [entry / value for entry in work[pivot_row]]
        for row in range(len(work)):
            if row == pivot_row or not work[row][column]:
                continue
            scale = work[row][column]
            work[row] = [
                left - scale * right
                for left, right in zip(work[row], work[pivot_row])
            ]
        pivot_row += 1
    return pivot_row


class RHEvenZeroGramGevreyRelativeReserveBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 12)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_reflected_height_and_two_slot_factor(self) -> None:
        samples = (F(2, 3), F(-5, 7), F(11, 13), F(3, 8))
        multiplicities = (1, 3, 2, 5)
        positive_height = sum(
            F(weight) * value * value
            for weight, value in zip(multiplicities, samples)
        )
        even_gram_energy = 2 * positive_height
        two_slot_norm_squared = 4 * positive_height
        self.assertEqual(even_gram_energy, two_slot_norm_squared / 2)

    def test_even_and_odd_cauchy_determinant_ratio(self) -> None:
        roots = (F(3, 2), F(5, 2), F(7, 2))
        squares = tuple(value * value for value in roots)
        row_factors = (F(2), F(-3), F(5))
        size = len(roots)
        odd = [
            [
                row_factors[row] * F(column, squares[row] - column * column)
                for column in range(1, size + 1)
            ]
            for row in range(size)
        ]
        even = [
            [
                row_factors[row] * roots[row]
                / (squares[row] - column * column)
                for column in range(1, size + 1)
            ]
            for row in range(size)
        ]
        ratio = math.prod(roots) / F(math.factorial(size))
        self.assertEqual(determinant(even), ratio * determinant(odd))

    def test_second_derivative_has_zero_full_central_coefficient(self) -> None:
        # K(x)=x^6-3*x^4+x^2 is even.  Direct integration of K'' on
        # [-a,a] equals the endpoint jump 2*K'(a).
        for endpoint in (F(1), F(3, 2), F(4)):
            integral_second = (
                12 * endpoint**5 - 24 * endpoint**3 + 4 * endpoint
            )
            twice_endpoint_first = 2 * (
                6 * endpoint**5 - 12 * endpoint**3 + 2 * endpoint
            )
            self.assertEqual(integral_second, twice_endpoint_first)

        # For a decaying even K the endpoint derivative tends to zero, so
        # the full integral of K'' is zero.  The note removes the finite
        # endpoint coefficient before entering the positive-index block.
        normalized = " ".join(self.text.split())
        self.assertIn("Delete this coefficient exactly", normalized)
        self.assertIn("2K_\\infty'(L/2)", self.text)

    def test_minmax_chain_gives_only_necessary_reserve_ratio(self) -> None:
        mu = F(1, 4)
        even_floor = F(2)
        rayleigh = F(3)
        reserve = 1 - mu / even_floor
        rho = F(4, 5)
        self.assertLess(mu, even_floor)
        self.assertLessEqual(even_floor, rayleigh)
        self.assertGreater(reserve, rho)
        self.assertLess(mu / rayleigh, 1 - rho)
        self.assertGreaterEqual(mu / even_floor, mu / rayleigh)

        # A model sequence verifies the direction of the little-o
        # implication.  It does not assert the converse.
        for length in (10, 20, 40, 80):
            trial = F(1, length)
            floor = trial / 2
            ground = trial / (length * length)
            epsilon = ground / floor
            relative_trial = ground / trial
            self.assertLessEqual(relative_trial, epsilon)
            self.assertLess(length * epsilon, F(1, 4))

    def test_minor_and_gevrey_exponents_remain_separated(self) -> None:
        ratios = []
        for lam in (8, 16, 32, 64):
            length = 2 * math.log(lam)
            minor_exponent = lam * lam * length**7
            gevrey_exponent = lam * length**2
            ratios.append(minor_exponent / gevrey_exponent)
            self.assertAlmostEqual(ratios[-1], lam * length**5)
        self.assertTrue(
            all(left < right for left, right in zip(ratios, ratios[1:]))
        )

    def test_even_carrier_rows_have_the_same_rank_defect(self) -> None:
        size = 60
        for step in (2, 3, 5, 7):
            lattice = tuple(
                tuple(
                    F(int(column == step * index))
                    for column in range(1, size + 1)
                )
                for index in range(1, size // step + 1)
            )
            prefix_count = 3
            prefix = tuple(
                tuple(F((row + 2) ** column) for column in range(size))
                for row in range(prefix_count)
            )
            matrix = lattice + prefix
            self.assertLessEqual(rank(matrix), size // step + prefix_count)
            self.assertLess(size // step + prefix_count, size)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_static_hygiene_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn(r",qquad", self.text)
        self.assertNotIn("{cal E}", self.text)
        self.assertIn(r"={\cal E}({\cal L}^2g_0)", self.text)
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "unshifted positive-index even zero Gram",
            "not the prolate-anchor complement",
            "delete the small finite central coefficient exactly",
            "reflected-height factor two",
            "necessary only",
            "unrelated positive constants",
            "one Rayleigh upper test",
            "fixed-source strip majorant",
            "logical lattice model below is not the zeta divisor",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "rh proves the even reserve",
            "lambda_min(a_circ) is bounded below by r_n",
            "the lattice model is the zeta divisor",
            "the riemann hypothesis is proved",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
