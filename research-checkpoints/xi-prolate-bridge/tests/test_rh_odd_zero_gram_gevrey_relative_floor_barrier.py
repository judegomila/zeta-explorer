#!/usr/bin/env python3
"""Exact regressions for the RH odd zero-Gram Gevrey barrier."""

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
NOTE = ROOT / "notes" / "RH_ODD_ZERO_GRAM_GEVREY_RELATIVE_FLOOR_BARRIER.md"
NOTE_HASH = "295e387c1e0ea9935bebb8458a9fea255ed60919116832dc4cd3756b033bea89"

FROZEN = {
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "tests/test_gevrey_prolate_remainder.py":
        "93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058",
    "notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md":
        "0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3",
    "tests/test_odd_zero_gram_lower_frame_audit.py":
        "b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467",
    "notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md":
        "ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a",
    "tests/test_anti_carrier_log_schedule.py":
        "304175ece40e36ae979dffa44c43009d1b796be2d72a820d7021758a34472a1b",
    "notes/DERIVATIVE_RADICAL_ODD_SPLIT.md":
        "abac446060d19ccd8ced9e4fb3aef3aedfa643d14494556b661cfba79bfbad95",
    "tests/test_derivative_radical_odd_split.py":
        "507728a8391d06135e62a48f7cabd9db73874049965c5e37631c563ec8815b44",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def carrier_rows(size: int, step: int) -> tuple[tuple[F, ...], ...]:
    return tuple(
        tuple(F(int(column == step * index)) for column in range(1, size + 1))
        for index in range(1, size // step + 1)
    )


def rank(matrix: tuple[tuple[F, ...], ...]) -> int:
    if not matrix:
        return 0
    work = [list(row) for row in matrix]
    rows = len(work)
    columns = len(work[0])
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column]),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        value = work[pivot_row][column]
        work[pivot_row] = [entry / value for entry in work[pivot_row]]
        for row in range(rows):
            if row == pivot_row or not work[row][column]:
                continue
            scale = work[row][column]
            work[row] = [
                left - scale * right
                for left, right in zip(work[row], work[pivot_row])
            ]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


class RHOddZeroGramGevreyRelativeFloorBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_projected_radical_energy_is_residual_energy(self) -> None:
        # If the global radical has zero samples, projection and residual
        # samples are negatives.  The Gram energies agree exactly.
        projected = (F(2, 3), F(-5, 7), F(11, 13), F(3, 8))
        residual = tuple(-value for value in projected)
        multiplicities = (1, 3, 2, 5)
        projected_energy = sum(
            F(weight) * value * value
            for weight, value in zip(multiplicities, projected)
        )
        residual_energy = sum(
            F(weight) * value * value
            for weight, value in zip(multiplicities, residual)
        )
        self.assertEqual(projected_energy, residual_energy)

        # The complete odd Gram has the reflected-height factor two.  The
        # repository two-slot seminorm counts both signs and both paired
        # slots, so its square is four times the positive-height energy.
        complete_odd_energy = 2 * projected_energy
        two_slot_norm_squared = 4 * residual_energy
        self.assertEqual(complete_odd_energy, two_slot_norm_squared / 2)

    def test_finite_prefix_cannot_repair_carrier_rank_defect(self) -> None:
        for step in (2, 3, 5, 11):
            size = 80
            prefix_count = 4
            lattice = carrier_rows(size, step)
            prefix = tuple(
                tuple(F((row + 2) ** column) for column in range(size))
                for row in range(prefix_count)
            )
            matrix = lattice + prefix
            self.assertLessEqual(rank(matrix), size // step + prefix_count)
            self.assertLess(size // step + prefix_count, size)

    def test_rank_bound_survives_repeated_multiplicity_rows(self) -> None:
        size = 30
        step = 4
        lattice = carrier_rows(size, step)
        repeated = tuple(row for row in lattice for _ in range(7))
        self.assertEqual(rank(lattice), size // step)
        self.assertEqual(rank(repeated), size // step)

    def test_rounded_count_is_tail_only(self) -> None:
        # At T=2*pi the main term is -1, so the rounded expression is -1
        # and cannot be a counting function.  The construction must splice
        # it only after a compatible finite beginning.
        main_term = F(-1)
        rounded = math.floor(main_term - F(1, 8) + F(1, 2))
        self.assertEqual(rounded, -1)
        normalized = " ".join(self.text.split())
        self.assertIn("only on the lattice tail", normalized)
        self.assertIn("HSW-compatible finite beginning", normalized)
        self.assertIn("without any claim", normalized)

    def test_minor_and_gevrey_exponents_are_separated(self) -> None:
        # With N=lambda*L^3, the count-derived determinant exponent is of
        # order lambda^2*L^7 while the q exponent is lambda*L^2.
        ratios = []
        for lam in (8, 16, 32, 64):
            length = 2 * math.log(lam)
            minor_exponent = lam * lam * length**7
            gevrey_exponent = lam * length**2
            ratios.append(minor_exponent / gevrey_exponent)
            self.assertAlmostEqual(ratios[-1], lam * length**5)
        self.assertTrue(all(left < right for left, right in zip(ratios, ratios[1:])))

    def test_strict_relative_gate_rejects_zero_floor(self) -> None:
        for q_value in (F(0), F(1, 10**100)):
            odd_floor = F(0)
            self.assertFalse(q_value < odd_floor)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 25)
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
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        self.assertNotIn("lambda*L^2=N/L", self.text)
        required = (
            "same Gevrey exponential class",
            "Let `lambda` tend to infinity",
            "Fourier L=-L Fourier",
            "N/L=lambda*L^2+O(1/L)",
            "unrelated and non-effective",
            "any prescribed HSW-compatible finite collection",
            "logical countermodel",
            "not the zeta divisor",
            "upper bound, not the all-vector lower frame",
            "repeated value rows",
            "carrier-scale sampling lower bound",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "rh proves the shifted odd sign",
            "the odd floor is bounded below exponentially",
            "the lattice model is the zeta divisor",
            "the riemann hypothesis is proved",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
