#!/usr/bin/env python3
"""Exact regressions for the RH-conditional fixed-zero selector capture."""

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
NOTE = ROOT / "notes" / "RH_CONDITIONAL_FIXED_ZERO_SELECTOR_CAPTURE_THEOREM.md"
NOTE_HASH = "07345bdb6278cd2914c7edaaa711351f4b8aa020038dca7a19b8c406e4a0f84c"

FROZEN = {
    "notes/Q0_FREE_SELECTOR_SECANT_ROOT_PARITY_THEOREM.md":
        "7d61da7b191fa7f6c00cf83ec139b2cfeac6981b46fa6d2059c5c842aaf9ba22",
    "tests/test_q0_free_selector_secant_root_parity_theorem.py":
        "04b9f67ca9db40a01ae2b89e759a59083d538dcc3c1dc4598105ed1830d8acf6",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "tests/test_centered_zero_gram_simultaneous_vertex_subsequence.py":
        "39ee34b725a27873143e140a3e4ba71489e8deb406eb73bbefde63ecb68fdc0d",
    "notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md":
        "0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3",
    "tests/test_odd_zero_gram_lower_frame_audit.py":
        "b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467",
    "notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md":
        "cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d",
    "tests/test_anchored_central_degree_screw_barrier.py":
        "bba275f3a12e7d11e11100362f0afc55d11206d85a7e4479fea26d044fa4d014",
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "tests/test_gevrey_prolate_remainder.py":
        "93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058",
    "notes/ACTUAL_GLOBAL_TWISTED_CONE_MOVING_GRID_TARGET_INCOMPATIBILITY.md":
        "0fb7b3d1ab5980b9cdc490933c68d9da3536a8d77a677fe96ec921445639121f",
    "tests/test_actual_global_twisted_cone_moving_grid_target_incompatibility.py":
        "91bda99e6b0db886a7551501ae2343705e4a2cb4632a687fe0f0d72287f031d6",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def scaled_zero_atom(
    length: F, delta_frequency: F, theta: F, root: F, node: int
) -> tuple[F, F, F]:
    """Return A_n, S(n^2), and the odd diagonal for one regular atom."""

    denominator = delta_frequency**2 * (F(node * node) - root**2)
    moment = 2 * theta / denominator
    stieltjes = moment / length
    odd_diagonal = (
        8
        * (delta_frequency * node) ** 2
        * theta
        / (length * denominator**2)
    )
    return moment, stieltjes, odd_diagonal


def stieltjes_atom(coefficient: F, root_square: F, x: F) -> F:
    return coefficient / (x - root_square)


class RhConditionalFixedZeroSelectorCaptureTests(unittest.TestCase):
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

    def test_zero_moment_source_row_and_odd_diagonal_scaling(self) -> None:
        length = F(18)
        delta_frequency = F(2, 3)
        theta = F(7, 5)
        root = F(13, 4)
        node = 5
        moment, stieltjes, odd_diagonal = scaled_zero_atom(
            length, delta_frequency, theta, root, node
        )
        coefficient = 2 * theta / (length * delta_frequency**2)
        denominator = F(node * node) - root**2
        self.assertEqual(stieltjes, coefficient / denominator)
        self.assertEqual(moment / length, stieltjes)
        self.assertEqual(
            odd_diagonal,
            4 * node * node * coefficient / denominator**2,
        )

        source = -2 * node * stieltjes
        self.assertEqual(-source / (2 * node), stieltjes)

    def test_regular_interior_atom_has_positive_secant_defect(self) -> None:
        for node, offset in ((3, F(-1, 2)), (5, F(1, 3)), (11, F(2, 5))):
            root = F(node) + offset
            root_square = root**2
            coefficient = F(7, 13)
            center = F(node * node)
            left = F((node - 1) ** 2)
            right = F((node + 1) ** 2)
            diagonal = 4 * node * node * coefficient / (center - root_square) ** 2
            secant = node * (
                stieltjes_atom(coefficient, root_square, left)
                - stieltjes_atom(coefficient, root_square, right)
            )
            self.assertLess((left - root_square) * (right - root_square), 0)
            self.assertLess(secant, 0)
            self.assertGreater(diagonal - secant, diagonal)

    def test_exterior_defect_formula_and_sign_are_exact(self) -> None:
        length = F(30)
        delta_frequency = F(1, 5)
        node = 9
        frequency = delta_frequency * node
        theta = F(11, 7)
        multiplicity = 3
        for beta in (F(1, 3), F(17, 5)):
            self.assertTrue(
                beta < frequency - delta_frequency
                or beta > frequency + delta_frequency
            )
            d_value = frequency**2 - beta**2
            product = (
                (frequency - delta_frequency) ** 2 - beta**2
            ) * ((frequency + delta_frequency) ** 2 - beta**2)
            difference = delta_frequency**2 * (
                2 * (frequency**2 + beta**2) - delta_frequency**2
            )
            self.assertEqual(d_value**2 - product, difference)
            self.assertGreater(product, 0)
            defect = (
                8
                * multiplicity
                * frequency**2
                * theta
                / length
                * (1 / d_value**2 - 1 / product)
            )
            self.assertLess(defect, 0)

    def test_carrier_phase_lower_bound_and_exact_shell(self) -> None:
        # The analytic input is sin(pi*|delta|)>=2|delta|.  Replacing theta
        # by its resulting lower value 8*delta^2 leaves an exact rational
        # inequality for pi^2*D/L.
        offsets = (F(-1, 2), F(-2, 5), F(-1, 7), F(1, 9), F(1, 3), F(1, 2))
        for node in range(1, 20):
            for offset in offsets:
                theta_lower = 8 * offset**2
                pi_squared_diagonal_over_length = (
                    2
                    * node**2
                    * theta_lower
                    / (offset**2 * (2 * node + offset) ** 2)
                )
                self.assertGreaterEqual(
                    pi_squared_diagonal_over_length, F(64, 25)
                )

        length = F(37)
        multiplicity = 4
        evaluation_row_square = length / 2
        complete_odd_gram_shell = 2 * multiplicity * evaluation_row_square
        self.assertEqual(complete_odd_gram_shell, multiplicity * length)

    def test_exterior_tail_has_the_claimed_summable_power(self) -> None:
        # For beta>=2*gamma, the Section 4 majorant is O(beta^-6), and the
        # centered Hadamard beta^-2 majorant dominates it termwise.
        gamma = F(7, 5)
        for beta_integer in range(3, 200):
            beta = F(beta_integer)
            if beta < 2 * gamma:
                continue
            term = (1 + beta**2) / (beta**2 - gamma**2) ** 4
            self.assertLessEqual(term, F(8) / beta**6)
            self.assertLessEqual(F(1, beta_integer**6), F(1, beta_integer**2))

    def test_shifted_strict_secant_forces_a_selector_window(self) -> None:
        carrier = F(10)
        exterior_loss = F(1, 1000)
        ground_shift = F(1, 100)
        unshifted_defect = carrier - exterior_loss
        shifted_defect = unshifted_defect - ground_shift
        self.assertGreater(shifted_defect, 0)

        # Root-free would say shifted D<=C, i.e. shifted_defect<=0.
        root_free_conclusion = shifted_defect <= 0
        self.assertFalse(root_free_conclusion)

    def test_fixed_finite_windows_and_physical_distance(self) -> None:
        zero_frequencies = (F(14), F(21), F(33))
        length = F(100)
        scaled = tuple(value * length / F(2) for value in zero_frequencies)
        self.assertTrue(
            all(right - left > 3 for left, right in zip(scaled, scaled[1:]))
        )

        node = 17
        zero_radius = F(35, 2)
        selector_radius = F(81, 5)
        self.assertLessEqual(abs(zero_radius - node), F(1, 2))
        self.assertLessEqual(abs(selector_radius - node), 1)
        self.assertLessEqual(abs(selector_radius - zero_radius), F(3, 2))

        # Multiplication by 2*pi/L turns 3/2 into 3*pi/L.
        physical_coefficient_of_pi_over_length = 2 * abs(
            selector_radius - zero_radius
        )
        self.assertLessEqual(physical_coefficient_of_pi_over_length, 3)

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
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "RH-conditional fixed-zero theorem",
            "simple inversion-even ground",
            "strict shifted odd sign",
            "zero-Gram shell of weight `m_0 L`",
            "all other distinct fixed zero atoms contribute only `O(L^(-3))`",
            "simultaneous for every fixed finite set",
            "at least one ordinate `gamma_0 in (13,15)`",
            "does not enumerate, isolate, or prove simplicity",
            "checkpoint-1.35 standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "rh is proved",
            "actual strict signs are proved",
            "every zero below",
            "one root per gap",
            "determinant convergence is proved",
            "standard eight are updated",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
