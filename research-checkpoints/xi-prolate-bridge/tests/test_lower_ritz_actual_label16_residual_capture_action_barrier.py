#!/usr/bin/env python3
"""Regressions for the actual label-16 residual-capture action barrier."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
import pathlib
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = pathlib.Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "LOWER_RITZ_ACTUAL_LABEL16_RESIDUAL_CAPTURE_ACTION_BARRIER.md"

DEPENDENCIES = {
    "notes/LOWER_RITZ_ACTUAL_SCHEDULE_LABEL12_MELLIN_ROW_BARRIER.md": "9737ce38ba458c98200a35c97a2f9bd8fe942e2e4e77a56d2ab9d7c072dfc021",
    "tests/test_lower_ritz_actual_schedule_label12_mellin_row_barrier.py": "76f8c67bcd40767bc7c34f51d50dbdd06d0d5caed27434ecfbd57b483d526595",
    "notes/FIXED_PREFIX_COMPLETE_SIGNED_TOEPLITZ_SCHUR_THEOREM.md": "c69d6d1a69f71548aa9291c5d261117ac913f2851df8f8fcc2f186c8bd530314",
    "tests/test_fixed_prefix_complete_signed_toeplitz_schur_theorem.py": "4f704f58524b9f4818db8bd1884009be9f4074fd303e2ec1cca5be5c74f70f87",
    "notes/FIXED_TO_GROWING_TOEPLITZ_OPERATOR_NORM_GATE.md": "57f4a8014e280e4594221b4466212b0104d2d7c25e9e6ff81808a4eb7f14ce25",
    "tests/test_fixed_to_growing_toeplitz_operator_norm_gate.py": "4b2d982c5de1b28fe3bac56e412f43a6a333bf47e643cf6bd435e589271bbf31",
    "notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md": "c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f",
    "tests/test_growing_low_prefix_half_power_far_cross_theorem.py": "be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569",
    "notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md": "0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3",
    "tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py": "8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b",
}


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_cauchy_matrix(
    nodes: tuple[int, ...], diagonal: dict[int, float], beta: dict[int, float]
) -> np.ndarray:
    matrix = np.empty((len(nodes), len(nodes)))
    for row, n_value in enumerate(nodes):
        for column, m_value in enumerate(nodes):
            matrix[row, column] = (
                diagonal[n_value]
                if n_value == m_value
                else (beta[n_value] - beta[m_value]) / (n_value - m_value)
            )
    return matrix


class ActualLabel16ResidualCaptureActionBarrierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        for relative, expected in DEPENDENCIES.items():
            digest = sha256(ROOT / relative)
            self.assertEqual(digest, expected, relative)
            self.assertIn(expected, self.text)

    def test_gamma3_is_strictly_positive_by_rational_bounds(self) -> None:
        r3 = F(151340, 531441)
        r5 = F(33058452, 244140625)
        r6 = F(81328, 531441)
        self.assertLess(F(8, 9), F(943, 1000) ** 2)
        self.assertGreater(F(24, 25), F(979, 1000) ** 2)
        self.assertGreater(F(35, 36), F(197, 200) ** 2)
        self.assertLess(r3 * F(943, 1000), F(269, 1000))
        self.assertGreater(r5 * F(979, 1000), F(132, 1000))
        self.assertGreater(r6 * F(197, 200), F(150, 1000))
        self.assertGreater(-F(269, 1000) + F(132, 1000) + F(150, 1000), 0)

        # Independently check the sign pattern of the exact multiple-angle formula.
        for n in range(4, 100):
            x2 = F(1, n * n)
            last = 1 - 18 * x2 + 48 * x2**2 - 32 * x2**3
            self.assertGreater(last, 0)

    def test_label16_defect_ratio_has_lambda_four_growth(self) -> None:
        # A_j is proportional to (16*pi)^j/j!, so after square roots the
        # remaining power is (16*pi)^2*8!/sqrt(4!*16!).
        exponent = ((2 * 4 + 1) + (2 * 16 + 1)) / 2 - (2 * 8 + 1)
        self.assertEqual(exponent, 4)
        coefficient_without_pi = 16**2 * math.factorial(8) / math.sqrt(
            math.factorial(4) * math.factorial(16)
        )
        self.assertGreater(coefficient_without_pi, 0)

    def test_forward_action_identity_is_exact(self) -> None:
        B = np.diag([3.0, 11.0, 29.0])
        b = np.array([2.0, -3.0, 5.0])
        residual_norm = float(np.linalg.norm(b))
        w = b / residual_norm
        first_moment = float(w @ B @ w)
        lowering = residual_norm**2 / first_moment
        action = float(b @ B @ b)
        self.assertAlmostEqual(lowering, residual_norm**4 / action, places=13)
        inverse_energy = float(b @ np.linalg.solve(B, b))
        self.assertGreaterEqual(inverse_energy, lowering)

    def test_full_metric_sufficient_package(self) -> None:
        Delta = np.diag([F(2), F(5)])
        c, length = F(3), F(7)
        B = np.diag([c * length * Delta[0, 0], c * length * Delta[1, 1]])
        b = np.array([F(4), F(-3)], dtype=object)
        dual = b[0] ** 2 / Delta[0, 0] + b[1] ** 2 / Delta[1, 1]
        inverse = b[0] ** 2 / B[0, 0] + b[1] ** 2 / B[1, 1]
        self.assertEqual(inverse, dual / (c * length))

    def test_scalar_coframe_and_exact_full_metric_are_split(self) -> None:
        scalar_metric = np.diag([2.0, 5.0, 11.0])
        relative_full_metric = np.array(
            [[1.2, 0.1, 0.0], [0.1, 0.9, -0.1], [0.0, -0.1, 1.4]]
        )
        square_root = np.diag(np.sqrt(np.diag(scalar_metric)))
        full_metric = square_root @ relative_full_metric @ square_root
        row = np.array([3.0, -2.0, 7.0])
        scalar_coframe = np.linalg.solve(square_root, row)
        exact_dual = float(row @ np.linalg.solve(full_metric, row))
        relative_dual = float(
            scalar_coframe
            @ np.linalg.solve(relative_full_metric, scalar_coframe)
        )
        self.assertAlmostEqual(exact_dual, relative_dual, places=13)

    def test_retained_source_cauchy_counterfamily(self) -> None:
        nodes = (-2, -1, 0, 1, 2)
        anchor = np.array([0.0, 0.0, 1.0, 0.0, 0.0])
        even_one = np.array([0.0, 1.0, 0.0, 1.0, 0.0]) / math.sqrt(2.0)
        even_two = np.array([1.0, 0.0, 0.0, 0.0, 1.0]) / math.sqrt(2.0)
        odd_one = np.array([0.0, -1.0, 0.0, 1.0, 0.0]) / math.sqrt(2.0)
        odd_two = np.array([-1.0, 0.0, 0.0, 0.0, 1.0]) / math.sqrt(2.0)
        parity = np.column_stack((anchor, even_one, even_two, odd_one, odd_two))

        ratios = []
        c_value, k_value, scale = 0.7, 8.0, 1.0
        for delta in (1e-2, 1e-3, 1e-4, 1e-5):
            rho = math.sqrt(delta)
            b1 = -c_value * scale * delta
            b2 = -scale * rho
            beta = {
                -2: math.sqrt(2.0) * scale * rho,
                -1: c_value * scale * delta / math.sqrt(2.0),
                0: 0.0,
                1: -c_value * scale * delta / math.sqrt(2.0),
                2: -math.sqrt(2.0) * scale * rho,
            }
            diagonal = {
                -2: k_value * scale * rho + scale * rho / math.sqrt(2.0),
                -1: scale + c_value * scale * delta / math.sqrt(2.0),
                0: scale * delta**2,
                1: scale + c_value * scale * delta / math.sqrt(2.0),
                2: k_value * scale * rho + scale * rho / math.sqrt(2.0),
            }
            raw = source_cauchy_matrix(nodes, diagonal, beta)
            transformed = parity.T @ raw @ parity
            even = transformed[:3, :3]
            odd = transformed[3:, 3:]
            expected_cross = math.sqrt(2.0) / 3.0 * (-4 * rho + c_value * delta)
            expected_even = scale * np.array(
                [
                    [delta**2, -c_value * delta, -rho],
                    [-c_value * delta, 1.0, expected_cross],
                    [-rho, expected_cross, k_value * rho],
                ]
            )
            np.testing.assert_allclose(even, expected_even, rtol=2e-12, atol=2e-12)
            self.assertGreater(float(np.linalg.eigvalsh(even[1:, 1:])[0]), 0.0)
            self.assertGreater(float(np.linalg.eigvalsh(odd)[0]), 0.0)

            forcing = np.array([b1, b2])
            residual_norm = float(np.linalg.norm(forcing))
            direction = forcing / residual_norm
            first_moment = float(direction @ even[1:, 1:] @ direction)
            qvalue = scale * delta**2
            lower_ritz = (
                qvalue
                + first_moment
                - math.sqrt((first_moment - qvalue) ** 2 + 4 * residual_norm**2)
            ) / 2.0
            self.assertLess(lower_ritz, 0.0)
            self.assertGreater(float(np.linalg.eigvalsh(even[1:, 1:] - lower_ritz * np.eye(2))[0]), 0.0)
            self.assertGreater(float(np.linalg.eigvalsh(odd - lower_ritz * np.eye(2))[0]), 0.0)
            ratios.append((qvalue - lower_ritz) / qvalue)

        self.assertTrue(all(y > 20.0 * x for x, y in zip(ratios, ratios[1:])))

    def test_scope_and_required_formulas(self) -> None:
        required = (
            "proposed ordinary residual capture",
            "is false for the pinned arithmetic matrices",
            "\\Gamma_3>{13\\over24000\\pi}>0",
            "{r\\over d_8L}\\longrightarrow\\infty",
            "smallest exact one-vector action lemma",
            "\\geq c\\,{\\|b\\|^4\\over d_4L}",
            "strict even\nlower-Ritz branch",
            "forward-action identities are not",
            "scalar-coframe row",
            "uniform full-metric\nequivalence gate",
            "not being identified with the exact\nfull exterior metric",
            "g_M^*E_M^{-1}g_M",
            "does not control the separate anchor-to-far residual row",
            "b_F=P_Fb",
            "b_R=P_(R_M)b",
            "inverse-row estimates for `b_F` or `b_R`",
            "soft retained direction",
            "not the pinned arithmetic matrix",
            "does not prove\nor disprove `t=O(d_4L)`",
            "remains\n`P0_INVALIDATED`",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)
        self.assertNotIn("B=A-uI\\succ0", self.text)
        self.assertGreaterEqual(self.text.count("conditional"), 4)

    def test_displayed_tex_and_static_hygiene(self) -> None:
        self.assertNotIn("\t", self.text)
        self.assertTrue(all(ord(character) < 128 for character in self.text))
        self.assertFalse(any(line.endswith((" ", "\t")) for line in self.text.splitlines()))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for display in displays:
            self.assertNotIn("$", display)
            self.assertEqual(display.count("{"), display.count("}"))
            self.assertEqual(display.count("\\begin"), display.count("\\end"))

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = pathlib.Path(directory) / "note.tex"
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


if __name__ == "__main__":
    unittest.main()
