#!/usr/bin/env python3
"""Regressions for the actual mixed-bridge pole-row reduction."""

from __future__ import annotations

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
NOTE = (
    ROOT
    / "notes"
    / "ACTUAL_MIXED_BRIDGE_POLE_ROW_RESOLVENT_CANCELLATION_REDUCTION.md"
)
NOTE_HASH = "610aa2b58734ab191e561bbaa7529f0558e1f979fa67461273e69f6d6253cde2"

FROZEN = {
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md":
        "d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771",
    "notes/MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md":
        "4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2",
    "notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md":
        "703c19f9cbadd73e6b60672a6f836fc2bd0bf7d43eaa5f60ac5806dd1cdc0d18",
    "notes/POSITIVITY_IMPROVING_SOURCE_GROUND_OBSTRUCTION.md":
        "5cd474c382c25dd3fd02d0e77bc3287dd69dda9ff23ab47c10aacfbf8491bf31",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inverse_two(matrix: tuple[tuple[float, float], tuple[float, float]]):
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


def matvec(matrix, vector):
    return tuple(
        sum(matrix[i][j] * vector[j] for j in range(len(vector)))
        for i in range(len(vector))
    )


def dot(left, right):
    return sum(x * y for x, y in zip(left, right))


class ActualMixedBridgePoleRowTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)

    def test_fixed_label_bridge_first_correction(self) -> None:
        r = 1 / math.sqrt(2)
        v_zero = 2 ** 0.25
        v_two = 2 ** -0.25
        a_zero = -3 / (64 * math.pi)
        a_two = -15 / (64 * math.pi)

        ratio_correction = -r * (a_two - a_zero)
        self.assertAlmostEqual(ratio_correction, 3 * r / (16 * math.pi), places=15)

        b_one_at_zero = v_two * a_two + r * v_zero * a_zero
        b_one_at_zero -= 3 * r * v_zero / (16 * math.pi)
        expected = -15 * 2 ** -0.25 / (32 * math.pi)
        self.assertAlmostEqual(b_one_at_zero, expected, places=15)

    def test_theta_derivative_polynomial_is_positive(self) -> None:
        upper_root = (7 + math.sqrt(41)) / 8
        self.assertLess(upper_root, math.pi)
        for n in range(1, 20):
            for u in (1.0, 1.1, 1.5, 2.0, 4.0):
                a_value = math.pi * n * n * u * u
                self.assertGreater(1 - 14 * a_value + 8 * a_value * a_value, 0)

    def test_limiting_row_constants_and_scale(self) -> None:
        c_value = 2 ** 0.75
        c_xi = 2 + 0.5772156649015329 - math.log(4 * math.pi)
        xi_prime_zero = -c_xi / 4
        constant_one = -c_value / 4 + c_value * xi_prime_zero / 2
        constant_two = -c_value * (4 + 0.5772156649015329 - math.log(4 * math.pi)) / 8
        self.assertAlmostEqual(constant_one, constant_two, places=15)

        for lam in (100.0, 1000.0, 10000.0):
            mass = (lam - 1 / lam) / 2 - math.log(lam)
            leading_row = c_value * math.log(lam) / 4
            normalized = leading_row / math.sqrt(mass)
            expected = 2 ** -0.75 * math.log(lam) / math.sqrt(lam)
            self.assertAlmostEqual(normalized / expected, 1.0, delta=0.12)

    def test_first_correction_finite_part(self) -> None:
        q_three = 2 ** 0.75
        xi_prime_zero = (
            math.log(4 * math.pi) - 2 - 0.5772156649015329
        ) / 4
        z_one = 15 * q_three / (128 * math.pi)
        finite_part = q_three / (16 * math.pi) * (
            15 * xi_prime_zero / 4 - 0.5
        )
        row_constant = (z_one - finite_part) / 2
        expected = q_three / (512 * math.pi) * (
            68 + 15 * 0.5772156649015329 - 15 * math.log(4 * math.pi)
        )
        self.assertAlmostEqual(row_constant, expected, places=15)

    def test_exact_feshbach_and_complete_cancellation(self) -> None:
        mass = 2.0
        transverse = 3.0
        coupling = 1.0
        scalar = 2 * mass + coupling * coupling / transverse
        shifted = ((scalar, coupling), (coupling, transverse))
        inverse = inverse_two(shifted)
        pole = (math.sqrt(mass), 0.0)
        response = matvec(inverse, pole)
        self.assertAlmostEqual(dot(pole, response), 0.5, places=14)

        beta = 5.0
        bridge_axis = beta / math.sqrt(mass)
        bridge_transverse = bridge_axis * transverse / coupling
        bridge = (bridge_axis, bridge_transverse)
        self.assertAlmostEqual(dot(pole, bridge), beta, places=14)
        self.assertAlmostEqual(dot(response, bridge), 0.0, places=14)

        direct = beta / (2 * mass)
        correction = (
            coupling / transverse * bridge_transverse / (2 * math.sqrt(mass))
        )
        self.assertAlmostEqual(direct - correction, 0.0, places=14)

    def test_scope_and_exact_tokens(self) -> None:
        required = (
            "2^{-5/4}\\log\\lambda",
            "beta_lambda>0` eventually",
            "B'(u)=2\\sum_{n\\geq1}",
            "(7+sqrt(41))/8",
            "finite-`lambda` pointwise sign",
            "H_{\\lfloor\\lambda v\\rfloor}",
            "\\operatorname {FP}_{s=0}Z_1(s)",
            "s=2M",
            "centered nonpole pole residual",
            "+\\omega_n\\delta_{x+y=\\log n}",
            "must be estimated arithmetically",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual finite bridge profile is positive",
            "the pole row proves the bottom overlap",
            "the second term vanishes identically",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_tags_ascii_and_import_hygiene(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__",
                "ast",
                "hashlib",
                "math",
                "pathlib",
                "re",
                "shutil",
                "subprocess",
                "tempfile",
                "unittest",
            },
        )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        self.assertIsNotNone(pdflatex, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertEqual(len(displays), 50)
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
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
