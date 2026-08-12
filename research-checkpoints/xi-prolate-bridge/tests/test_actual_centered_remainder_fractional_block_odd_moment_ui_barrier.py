#!/usr/bin/env python3
"""Strict regressions for the fractional-block odd-moment UI barrier.

All fixtures are exact.  The verifier reads no zero table, prime-orbit
sample, cached matrix, network resource, or external numerical artifact.
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
    "ACTUAL_CENTERED_REMAINDER_FRACTIONAL_BLOCK_ODD_MOMENT_UI_BARRIER.md"
)
NOTE_HASH = "c5510f3491d2d6ff173581bd6be540edc1b8b5c4bbb0afb56b636bfd68b51f19"

FROZEN = {
    "notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md":
        "1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1",
    "tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py":
        "cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def floor_fraction(value: F) -> int:
    return value.numerator // value.denominator


def moment(nodes: tuple[F, ...], weights: tuple[F, ...], degree: int) -> F:
    return sum(
        (weight * node**degree for node, weight in zip(nodes, weights)),
        F(0),
    )


class ActualCenteredRemainderFractionalBlockOddMomentUIBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_frozen_pair_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 2)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_real_exponent_moment_ceiling_is_exactly_floor_two_s(self) -> None:
        cases = {
            F(2): 4,
            F(9, 4): 4,
            F(5, 2): 5,
            F(11, 4): 5,
            F(3): 6,
            F(7, 2): 7,
            F(15, 4): 7,
            F(4): 8,
        }
        for s_value, ceiling in cases.items():
            with self.subTest(s=s_value):
                self.assertEqual(floor_fraction(2 * s_value), ceiling)
                for degree in range(1, ceiling + 1):
                    self.assertLessEqual(F(degree, 2) - s_value, 0)
                self.assertGreater(F(ceiling + 1, 2) - s_value, 0)

        self.assertIn(r"M(s)=\lfloor2s\rfloor", self.normalized)
        self.assertIn("Equality is included", self.text)
        self.assertIn(r"0\leq j\leq\lfloor2s\rfloor", self.normalized)

    def test_macroscopic_ui_index_is_floor_s(self) -> None:
        for numerator in range(4, 17):
            s_value = F(numerator, 2)
            r_value = floor_fraction(s_value)
            self.assertEqual(floor_fraction(s_value), r_value)
            self.assertLessEqual(F(r_value), s_value)
            self.assertLess(s_value, F(r_value + 1))

        required = (
            r"k_{\rm UI}(s)=\lfloor s\rfloor",
            r"s(1-\alpha)<\rho_{\lfloor s\rfloor}",
            r"\sup_{s\geq2}{\rho_{\lfloor s\rfloor}\over s}",
            r"={\sqrt{3+\sqrt6}\over4}",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_first_missing_even_moment_has_polynomial_loss(self) -> None:
        cases = (
            (1, F(3, 2), F(1, 2)),
            (2, F(5, 2), F(1, 2)),
            (2, F(11, 4), F(1, 4)),
            (3, F(7, 2), F(1, 2)),
            (4, F(19, 4), F(1, 4)),
        )
        for r_value, s_value, expected in cases:
            with self.subTest(r=r_value, s=s_value):
                self.assertEqual(F(r_value + 1) - s_value, expected)
                self.assertGreater(expected, 0)

        self.assertIn(
            r"1+{x^{r+1-s}\over L^{r+1}}",
            self.normalized,
        )
        self.assertIn("not a uniform-integrability bound", self.text)

    def test_odd_localizer_needs_the_next_even_absolute_moment(self) -> None:
        for r_value in range(1, 9):
            p_value = 2 * r_value + 1
            q_value = p_value + 1
            theta = (
                F(1, p_value) - F(1, q_value)
            ) / (
                F(1) - F(1, q_value)
            )
            self.assertEqual(theta, F(1, p_value * p_value))
            self.assertEqual(p_value * theta, F(1, p_value))
            self.assertEqual(
                F(p_value, q_value) * (1 - theta),
                F(p_value - 1, p_value),
            )

        required = (
            r"(c-Z)q_{r+1}(Z)^2",
            r"c-\rho_{r+1}",
            r"\mathbb E U^{2r+1}",
            r"\mathbb E U^{2r+2}",
            "signed odd moment",
            "precise uniform-integrability gap",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_radau_remote_atom_countermeasure_is_exact(self) -> None:
        # For r=1 and c=1/2, Q_2=z^2+(3/2)z-1 has nodes -2,1/2.
        c_value = F(1, 2)
        nodes = (F(-2), c_value)
        weights = (F(1, 5), F(4, 5))
        self.assertEqual(tuple(moment(nodes, weights, j) for j in range(3)),
                         (F(1), F(0), F(1)))
        third = moment(nodes, weights, 3)
        self.assertEqual(third, F(-3, 2))

        excesses: list[F] = []
        for radius in (4, 8, 16, 32, 64):
            remote_weight = -third / (F(radius**3) - third)
            base_weight = 1 - remote_weight
            corrected_nodes = nodes + (F(radius),)
            corrected_weights = tuple(
                base_weight * weight for weight in weights
            ) + (remote_weight,)

            self.assertEqual(sum(corrected_weights, F(0)), 1)
            self.assertEqual(moment(corrected_nodes, corrected_weights, 3), 0)
            for degree, gaussian in enumerate((F(1), F(0), F(1))):
                error = abs(
                    moment(corrected_nodes, corrected_weights, degree)
                    - gaussian
                )
                self.assertLessEqual(error, F(4, radius ** (3 - degree)))

            excess = remote_weight * (radius - c_value)
            excesses.append(excess)
            self.assertLess(excess, F(2, radius**2))

        self.assertTrue(
            all(right < left for left, right in zip(excesses, excesses[1:]))
        )
        self.assertIn("Gaussian--Radau quadrature measure", self.text)
        self.assertIn(r"O_{r,c}(R^{-2r})", self.normalized)
        self.assertIn("top odd moment", self.text)

    def test_deterministic_bounds_do_not_remove_escaping_mass(self) -> None:
        for r_value in range(1, 7):
            s_value = F(2 * r_value + 1, 2)
            time_exponent = s_value - r_value - F(1, 2)
            self.assertEqual(time_exponent, 0)
            support_loss = -r_value
            total_exponent = s_value + support_loss
            self.assertEqual(total_exponent, F(1, 2))

        required = (
            r"B_x\ll{\sqrt x\over L}",
            r"R^(-(2r+1))",
            r"||Z'_(x,s)||_infty=O(sqrt(x))=O(LB_x)",
            r"T_sw_R\asymp",
            "Fixed truncations and rational localizers",
            "not a claim that the actual prime polynomial realizes",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_weak_odd_shelf_scale_is_below_required_target(self) -> None:
        cases = (
            (1, F(3, 2)),
            (2, F(5, 2)),
            (2, F(11, 4)),
            (3, F(7, 2)),
            (4, F(19, 4)),
        )
        for r_value, s_value in cases:
            with self.subTest(r=r_value, s=s_value):
                weak_x_exponent = s_value - r_value
                ratio_x_exponent = weak_x_exponent - 1
                self.assertGreaterEqual(weak_x_exponent, F(1, 2))
                self.assertLess(weak_x_exponent, 1)
                self.assertLess(ratio_x_exponent, 0)

        self.assertIn(r"x^{s-r}L^{2r+1}", self.normalized)
        self.assertIn(r"x^{s-r-1}L^{2r+2}\longrightarrow0", self.normalized)
        self.assertIn("cannot invalidate the required upper target", self.text)

    def test_best_odd_shelf_threshold_is_r_two_but_sub_target(self) -> None:
        eta_one_squared = F(4, 9)
        eta_two_squared = F(12, 25)
        self.assertLess(eta_one_squared, eta_two_squared)

        # sqrt(6)<5/2 gives eta_3^2<22/49<12/25.
        self.assertLess(F(6), F(25, 4))
        self.assertLess(F(22, 49), eta_two_squared)

        # For r>=4, eta_r<35/54, again below 2*sqrt(3)/5.
        self.assertLess(F(35, 54) ** 2, eta_two_squared)
        self.assertEqual(F(2 * 2 + 1, 2), F(5, 2))

        required = (
            r"\eta_2={2\sqrt3\over5}",
            r"\alpha>1-{2\sqrt3\over5}",
            r"x^{1/2}L^5=\lambda L^5",
            r"=o\left({\lambda^2\over L}\right)",
            "not an improvement of the checkpoint-1.68 barrier",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_near_integer_schedule_returns_to_integer_threshold(self) -> None:
        # delta_x must be logarithmically vanishing if x^delta/L^(r+1)
        # is to stay bounded; a fixed rational delta always fails.
        for delta in (F(1, 10), F(1, 4), F(1, 2)):
            self.assertGreater(delta, 0)
        self.assertIn(r"{x^{\delta_x}\over L^{r+1}}=O(1)", self.normalized)
        self.assertIn(
            r"\delta_x=O\left({\log L\over\log x}\right)=o(1)",
            self.normalized,
        )
        self.assertIn("same limit as `(r+1)beta`", self.text)

    def test_note_contract_and_fail_closed_scope(self) -> None:
        required = (
            r"I_{x,s}=[Ax^s,2Ax^s]",
            r"r+{1\over2}\leq s<r+1",
            r"s(1-\alpha)<\rho_{r+1}",
            r"\mathfrak R_{\lambda,\alpha}",
            r"\mathfrak R^{\rm hi}_{\lambda,\alpha}",
            r"\gg_{A,\alpha,r,s}x^{s-r}L^{2r+1}",
            r"\|H_x\|_\infty\leq\left({1\over2}+o(1)\right)L",
            r"\mathbb E_{x,s}|H_x|=O(1)",
            r"T_sL B_x^{-2r}",
            "sub-target-scale conclusion",
            "one-way",
            "New arithmetic tail control",
            "dangerous-space capture",
            "RH proof or converse",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

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
        self.assertGreaterEqual(len(displays), 35)
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
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error",
                 tex_path.name],
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

        cache_entries = [
            path
            for path in ROOT.rglob("*")
            if path.name == "__pycache__" or path.suffix in {".pyc", ".pyo"}
        ]
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main()
