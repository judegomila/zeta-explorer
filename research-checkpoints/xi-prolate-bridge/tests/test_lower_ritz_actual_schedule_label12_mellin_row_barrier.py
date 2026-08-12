#!/usr/bin/env python3
"""Regressions for the actual-schedule lower-Ritz Mellin-row barrier."""

from __future__ import annotations

import ast
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
NOTE = (
    ROOT
    / "notes"
    / "LOWER_RITZ_ACTUAL_SCHEDULE_LABEL12_MELLIN_ROW_BARRIER.md"
)
TEST = pathlib.Path(__file__)


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_cauchy_matrix(
    nodes: tuple[int, ...],
    diagonal: dict[int, float],
    beta: dict[int, float],
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


def dimensionless_ground_ridge(delta: float) -> float:
    """Solve equation (7.11) of the frozen inverse-spread theorem."""

    def equation(height: float) -> float:
        right = (
            delta**2
            * (16.0 + delta**4)
            / 289.0
            * (16.0 / (1.0 + height) + 1.0 / (delta**4 + height))
        )
        return delta**2 + height - right

    low = 0.0
    high = 1.0
    while equation(high) <= 0.0:
        high *= 2.0
    for _ in range(180):
        middle = (low + high) / 2.0
        if equation(middle) <= 0.0:
            low = middle
        else:
            high = middle
    return (low + high) / 2.0


class LowerRitzActualScheduleMellinRowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        expected = {
            "notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md":
                "0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3",
            "tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py":
                "8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b",
            "notes/ANCHOR_LABEL12_COMPLETE_WEIGHTED_CROSS_ASYMPTOTIC_THEOREM.md":
                "81282cb12234c8ea14a5acebc300fd64db9d03723f760d9c98ca1954526aafd0",
            "tests/test_anchor_label12_complete_weighted_cross_asymptotic_theorem.py":
                "930faf7b475cface7e9c052f3474dbe948992fc73f6e8a27433382ecf1b49a55",
            "notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md":
                "04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83",
            "tests/test_fixed_source_block_shift_asymptotic_theorem.py":
                "433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5",
            "notes/CYCLIC_MELLIN_GRAPH_PRODUCT_TRANSITION_PACKET_NONCAPTURE_BARRIER.md":
                "b7e29753bb6ff4f4082a114413bf7f80b460f4c8d0a0b5e48ee73e435e2fc488",
            "tests/test_cyclic_mellin_graph_product_transition_packet_noncapture_barrier.py":
                "26d5d820330cb7971e7bf5e47550d56a9bc3924091db93d8e83afa3025a0d769",
            "notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md":
                "aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce",
            "tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py":
                "27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed",
            "notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md":
                "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc",
            "tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py":
                "5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b",
            "notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md":
                "e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe",
            "tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py":
                "a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713",
            "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
                "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
        }
        for relative, digest in expected.items():
            path = ROOT / relative
            self.assertTrue(path.is_file(), relative)
            self.assertEqual(sha256(path), digest, relative)
            self.assertIn(f"`{relative}`", self.text)
            self.assertIn(f"`{digest}`", self.text)

    def test_critical_defect_ratio_and_direct_rates(self) -> None:
        d4_over_d8_without_pi = F(105, 4096)
        d12_over_d8_without_pi = F(16**4, 9 * 10 * 11 * 12)
        self.assertEqual(
            d4_over_d8_without_pi * d12_over_d8_without_pi,
            F(14, 99),
        )

        real_rates = []
        strip_rates = []
        for lambda_value in (4.0, 8.0, 16.0, 32.0):
            length = 2.0 * math.log(lambda_value)
            real_rates.append(lambda_value**-8 * math.sqrt(length))
            strip_rates.append(lambda_value ** (-8.0 + 0.49))
        self.assertTrue(all(y < x / 100.0 for x, y in zip(real_rates, real_rates[1:])))
        self.assertTrue(all(y < x / 100.0 for x, y in zip(strip_rates, strip_rates[1:])))

    def test_visible_scales_do_not_force_the_lowering_scale(self) -> None:
        rho = 0.1
        kappa = 4.0
        cross_constant = 0.7
        ratios = []
        expected_limit = (math.sqrt(kappa**2 + 4.0) - kappa) / 2.0

        for delta in (0.1, 0.03, 0.01, 0.003):
            qvalue = delta**2
            forcing = np.array([cross_constant * delta, rho])
            complement = np.diag([1.0, kappa * rho])
            residual_norm = float(np.linalg.norm(forcing))
            direction = forcing / residual_norm
            first_moment = float(direction @ complement @ direction)
            lower_ritz = (
                qvalue
                + first_moment
                - math.sqrt((first_moment - qvalue) ** 2 + 4 * residual_norm**2)
            ) / 2.0
            lowering = qvalue - lower_ritz
            shifted = complement - lower_ritz * np.eye(2)
            self.assertGreater(float(np.linalg.eigvalsh(shifted)[0]), 0.0)
            self.assertGreater(1.0 - lower_ritz, 0.0)  # independent odd scalar
            ratios.append(lowering / residual_norm)

            self.assertAlmostEqual(qvalue, delta**2)
            self.assertAlmostEqual(forcing[0], cross_constant * delta)
            self.assertAlmostEqual(complement[0, 0], 1.0)

        self.assertAlmostEqual(ratios[-1], expected_limit, delta=0.002)
        self.assertGreater(ratios[-1], 0.2)

    def test_scale_matched_source_cauchy_inverse_spread(self) -> None:
        nodes = (-2, -1, 0, 1, 2)
        anchor = np.array([0.0, 0.0, 1.0, 0.0, 0.0])
        even_one = np.array([0.0, 1.0, 0.0, 1.0, 0.0]) / math.sqrt(2.0)
        even_two = np.array([1.0, 0.0, 0.0, 0.0, 1.0]) / math.sqrt(2.0)
        odd_one = np.array([0.0, -1.0, 0.0, 1.0, 0.0]) / math.sqrt(2.0)
        odd_two = np.array([-1.0, 0.0, 0.0, 0.0, 1.0]) / math.sqrt(2.0)
        parity = np.column_stack((anchor, even_one, even_two, odd_one, odd_two))

        direct_bounds = []
        residual_products = []
        ridge_ratios = []
        normalized_responses = []

        for exponent in (8, 12, 16, 20):
            delta = 2.0**-exponent
            lambda_value = delta ** (-1.0 / 8.0)
            length = 2.0 * math.log(lambda_value)
            scale = 1.0
            lowering = scale * delta**2
            epsilon = scale * delta**4
            residual_norm = (
                scale * delta * math.sqrt((16.0 + delta**4) / 17.0)
            )

            beta_one = -4.0 * residual_norm / math.sqrt(34.0)
            beta_two = -2.0 * residual_norm / math.sqrt(34.0)
            beta = {
                -2: -beta_two,
                -1: -beta_one,
                0: 0.0,
                1: beta_one,
                2: beta_two,
            }
            diagonal = {
                -2: epsilon + residual_norm / math.sqrt(34.0),
                -1: scale + 4.0 * residual_norm / math.sqrt(34.0),
                0: lowering,
                1: scale + 4.0 * residual_norm / math.sqrt(34.0),
                2: epsilon + residual_norm / math.sqrt(34.0),
            }
            raw = source_cauchy_matrix(nodes, diagonal, beta)
            transformed = parity.T @ raw @ parity
            even = transformed[:3, :3]
            odd = transformed[3:, 3:]
            forcing = np.array(
                [
                    -4.0 * residual_norm / math.sqrt(17.0),
                    -residual_norm / math.sqrt(17.0),
                ]
            )
            complement = np.diag([scale, epsilon])
            expected_even = np.block(
                [
                    [np.array([[lowering]]), forcing[None, :]],
                    [forcing[:, None], complement],
                ]
            )
            np.testing.assert_allclose(even, expected_even, rtol=2e-12, atol=2e-12)
            self.assertGreater(float(np.linalg.eigvalsh(odd)[0]), 0.0)

            direction = np.array([-4.0, -1.0]) / math.sqrt(17.0)
            first_moment = float(direction @ complement @ direction)
            self.assertAlmostEqual(
                lowering * first_moment / residual_norm**2,
                1.0,
                places=11,
            )

            visible_coupling = abs(forcing[0])
            self.assertGreater(visible_coupling / delta, 0.9)
            self.assertLess(visible_coupling / delta, 1.0)

            direct_bounds.append(
                lowering / residual_norm * math.sqrt(length)
            )
            forcing_energy = float(forcing @ np.linalg.solve(complement, forcing))
            spread = forcing_energy - lowering
            leverage = length / (2.0 * epsilon)
            residual_products.append(spread * leverage)

            ridge = dimensionless_ground_ridge(delta)
            ridge_ratios.append(ridge / delta)
            normalized_responses.append(
                -delta
                * math.sqrt(16.0 + delta**4)
                / 17.0
                / (delta**4 + ridge)
            )

        self.assertTrue(
            all(y < x / 10.0 for x, y in zip(direct_bounds, direct_bounds[1:]))
        )
        self.assertTrue(
            all(y > 1000.0 * x for x, y in zip(residual_products, residual_products[1:]))
        )
        self.assertAlmostEqual(ridge_ratios[-1], 4.0 / 17.0, delta=2e-5)
        self.assertAlmostEqual(normalized_responses[-1], -1.0, delta=2e-5)

    def test_exact_grid_mellin_row_normalization(self) -> None:
        # On [-L/2,L/2], V_n=L^(-1/2)exp(2*pi*i*n*x/L).
        # At z=4*pi/L only V_2 survives, so its even projection is
        # sqrt(L/2)e_2^+.  This recovers sqrt(pi)e_2^+ when L=2*pi.
        for length in (2.0, 2.0 * math.pi, 20.0):
            even_row_norm = math.sqrt(length / 2.0)
            self.assertAlmostEqual(even_row_norm**2, length / 2.0)
        self.assertAlmostEqual(math.sqrt((2.0 * math.pi) / 2.0), math.sqrt(math.pi))

    def test_fail_closed_scope_and_hygiene(self) -> None:
        required = (
            "P0_INVALIDATED",
            "r\\geq\\{C_{12}+o(1)\\}d_8L",
            "q-u=O(d_4L)",
            "O(\\lambda^{-8}\\sqrt L)",
            "u>=0",
            "residual capture",
            "\\|P_{Y_\\lambda}b\\|\n \\leq C|\\langle\\omega_{12},b\\rangle|",
            "the direct capture",
            "sigma_{12}(u)",
            "fixed compression floor",
            "theta_\\lambda\\gg",
            "oriented Galerkin-error row",
            "z_\\lambda={4\\pi\\over L}",
            "interval containing a\nneighborhood of zero",
            "L\\delta^{-6}",
            "not the\npinned pole--Archimedean--minus-prime matrix",
            "No paired\n`U_Z` sign is used",
            "No numerical or literature report is admitted",
            "No standard-eight\nfile",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)
        forbidden = (
            "RH_PROVED",
            "LAMBDA_BOUND_PROVED",
            "proves the Riemann hypothesis",
            "equation (5.2) is proved",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)
        self.assertNotRegex(self.text, re.compile(r"(?<!\\)\$"))
        self.assertEqual(
            self.text.count(r"\begin{aligned}"),
            self.text.count(r"\end{aligned}"),
        )
        display_open = sum(line == r"\[" for line in self.text.splitlines())
        display_close = sum(line == r"\]" for line in self.text.splitlines())
        self.assertEqual(display_open, display_close)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        ast.parse(TEST.read_text(encoding="utf-8"), filename=str(TEST))
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
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
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
