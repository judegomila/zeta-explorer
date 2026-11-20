#!/usr/bin/env python3
"""Regressions for the post-far retained inverse-row theorem."""

from __future__ import annotations

import hashlib
import pathlib
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = pathlib.Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "LOWER_RITZ_POST_FAR_RETAINED_INVERSE_ROW_THEOREM.md"

DEPENDENCIES = {
    "notes/LOWER_RITZ_ACTUAL_LABEL16_RESIDUAL_CAPTURE_ACTION_BARRIER.md": "8b54fe4064ddaf5047763aaef301856ccfa82bfa6bf27691d582cd559d4a5d77",
    "tests/test_lower_ritz_actual_label16_residual_capture_action_barrier.py": "67407df0c007b50046c0ca4b8dec1a36910d1ad44fc3f2f8e48242f8a1dc6572",
    "notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md": "aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce",
    "tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py": "27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed",
    "notes/GROWING_MIXED_BRIDGE_RETAINED_COMPLEMENT_TWO_STAGE_SCHUR_BARRIER.md": "102f69ec567803153d5648316874c8369cd558ee17cfce71f3cca2e9bb259f81",
    "tests/test_growing_mixed_bridge_retained_complement_two_stage_schur_barrier.py": "0613ef6cb25d6c1c7182011d7092fb42786af3a1d25244d2d0451f26f8098a15",
    "notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md": "c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f",
    "tests/test_growing_low_prefix_half_power_far_cross_theorem.py": "be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569",
    "notes/GROWING_FIXED_CAPTURE_MULTIPLIER_DANGER_NESTED_FESHBACH_BARRIER.md": "0abc50aabff9e630001e1164eafba8de52ef5804e1c2251e70e1367e5b7c9197",
    "tests/test_growing_fixed_capture_multiplier_danger_nested_feshbach_barrier.py": "31d09931272864bc1f8dc93e5008d4453f30ad953916cf5a2a56f3cabb636750",
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


class PostFarRetainedInverseRowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(expected, self.text)

    def test_two_stage_strict_inverse_identity(self) -> None:
        # Dimensions are captured=2, retained=2, far=2.
        rng = np.random.default_rng(20260811)
        base = rng.normal(size=(6, 6))
        full = base.T @ base + 2.0 * np.eye(6)
        forcing = rng.normal(size=6)

        d_block = full[:4, :4]
        gamma = full[4:, :4]
        high = full[4:, 4:]
        sigma = d_block - gamma.T @ np.linalg.solve(high, gamma)
        beta = forcing[:4] - gamma.T @ np.linalg.solve(high, forcing[4:])

        pivot = sigma[:2, :2]
        cross = sigma[2:, :2]
        retained = sigma[2:, 2:]
        first_short = retained - cross @ np.linalg.solve(pivot, cross.T)
        returned = beta[2:] - cross @ np.linalg.solve(pivot, beta[:2])

        total = forcing @ np.linalg.solve(full, forcing)
        far = forcing[4:] @ np.linalg.solve(high, forcing[4:])
        captured = beta[:2] @ np.linalg.solve(pivot, beta[:2])
        rest = returned @ np.linalg.solve(first_short, returned)
        self.assertAlmostEqual(total, far + captured + rest, places=11)

    def test_combined_harmonic_lift(self) -> None:
        rng = np.random.default_rng(113)
        base = rng.normal(size=(5, 5))
        full = base.T @ base + np.eye(5)
        forcing = rng.normal(size=5)

        d_block = full[:3, :3]
        gamma = full[3:, :3]
        high = full[3:, 3:]
        far_lift = np.vstack((np.eye(3), -np.linalg.solve(high, gamma)))
        sigma = far_lift.T @ full @ far_lift
        beta = far_lift.T @ forcing

        pivot = sigma[:1, :1]
        cross = sigma[1:, :1]
        captured_lift = np.vstack((-np.linalg.solve(pivot, cross.T), np.eye(2)))
        combined = far_lift @ captured_lift
        first_short = sigma[1:, 1:] - cross @ np.linalg.solve(pivot, cross.T)
        returned = beta[1:] - cross @ np.linalg.solve(pivot, beta[:1])

        np.testing.assert_allclose(combined.T @ full @ combined, first_short)
        np.testing.assert_allclose(combined.T @ forcing, returned)

    def test_semidefinite_range_and_pseudoinverse_identity(self) -> None:
        pivot = np.array([[2.0]])
        cross = np.array([[1.0], [0.0]])
        first_short = np.diag([3.0, 0.0])
        retained = first_short + cross @ np.linalg.solve(pivot, cross.T)
        sigma = np.block([[pivot, cross.T], [cross, retained]])

        captured_row = np.array([4.0])
        returned = np.array([5.0, 0.0])
        raw_retained = returned + cross @ np.linalg.solve(pivot, captured_row)
        beta = np.r_[captured_row, raw_retained]

        left = beta @ np.linalg.pinv(sigma) @ beta
        right = (
            captured_row @ np.linalg.solve(pivot, captured_row)
            + returned @ np.linalg.pinv(first_short) @ returned
        )
        self.assertAlmostEqual(left, right, places=12)
        np.testing.assert_allclose(sigma @ np.linalg.pinv(sigma) @ beta, beta)

        failed_return = np.array([5.0, 1.0])
        failed_raw = failed_return + cross @ np.linalg.solve(pivot, captured_row)
        failed_beta = np.r_[captured_row, failed_raw]
        self.assertGreater(
            np.linalg.norm(sigma @ np.linalg.pinv(sigma) @ failed_beta - failed_beta),
            0.5,
        )

    def test_loewner_row_range_equivalence(self) -> None:
        first_short = np.diag([2.0, 5.0, 0.0])
        returned = np.array([3.0, -4.0, 0.0])
        optimal = float(returned @ np.linalg.pinv(first_short) @ returned)
        difference = optimal * first_short - np.outer(returned, returned)
        self.assertGreaterEqual(float(np.linalg.eigvalsh(difference)[0]), -1e-12)

        below = (optimal - 1e-4) * first_short - np.outer(returned, returned)
        self.assertLess(float(np.linalg.eigvalsh(below)[0]), -1e-7)

        kernel_row = returned + np.array([0.0, 0.0, 1.0])
        kernel_test = np.array([0.0, 0.0, 1.0])
        self.assertGreater(abs(float(kernel_row @ kernel_test)), 0.0)
        self.assertEqual(float(kernel_test @ first_short @ kernel_test), 0.0)

    def test_exact_source_cauchy_retained_split(self) -> None:
        nodes = (-2, -1, 0, 1, 2)
        anchor = np.array([0.0, 0.0, 1.0, 0.0, 0.0])
        even_one = np.array([0.0, 1.0, 0.0, 1.0, 0.0]) / np.sqrt(2.0)
        even_two = np.array([1.0, 0.0, 0.0, 0.0, 1.0]) / np.sqrt(2.0)
        odd_one = np.array([0.0, -1.0, 0.0, 1.0, 0.0]) / np.sqrt(2.0)
        odd_two = np.array([-1.0, 0.0, 0.0, 0.0, 1.0]) / np.sqrt(2.0)
        parity = np.column_stack((anchor, even_one, even_two, odd_one, odd_two))

        retained_ratios = []
        for delta in (0.1, 0.05, 0.025, 0.0125):
            scale = 1.7
            lowering = scale * delta**2
            residual_norm = scale * delta * np.sqrt((16.0 + delta**4) / 17.0)
            beta = {
                -2: 2.0 * residual_norm / np.sqrt(34.0),
                -1: 4.0 * residual_norm / np.sqrt(34.0),
                0: 0.0,
                1: -4.0 * residual_norm / np.sqrt(34.0),
                2: -2.0 * residual_norm / np.sqrt(34.0),
            }
            diagonal = {
                -2: scale * delta**4 + residual_norm / np.sqrt(34.0),
                -1: scale + 4.0 * residual_norm / np.sqrt(34.0),
                0: lowering,
                1: scale + 4.0 * residual_norm / np.sqrt(34.0),
                2: scale * delta**4 + residual_norm / np.sqrt(34.0),
            }
            raw = source_cauchy_matrix(nodes, diagonal, beta)
            transformed = parity.T @ raw @ parity
            even = transformed[:3, :3]
            odd = transformed[3:, 3:]
            expected = np.array(
                [
                    [lowering, -4.0 * residual_norm / np.sqrt(17.0), -residual_norm / np.sqrt(17.0)],
                    [-4.0 * residual_norm / np.sqrt(17.0), scale, 0.0],
                    [-residual_norm / np.sqrt(17.0), 0.0, scale * delta**4],
                ]
            )
            np.testing.assert_allclose(even, expected, rtol=2e-12, atol=2e-12)
            self.assertGreater(float(np.linalg.eigvalsh(odd)[0]), 0.0)

            captured = 16.0 * residual_norm**2 / (17.0 * scale)
            retained = residual_norm**2 / (17.0 * scale * delta**4)
            total = expected[0, 1:] @ np.linalg.solve(expected[1:, 1:], expected[0, 1:])
            self.assertAlmostEqual(total, captured + retained, places=11)
            self.assertLess(captured / lowering, 1.0)
            retained_ratios.append(retained / lowering)

        self.assertTrue(
            all(y > 15.0 * x for x, y in zip(retained_ratios, retained_ratios[1:]))
        )

    def test_multiplier_safe_decoration_leaves_soft_danger(self) -> None:
        scale, delta, high = 0.7, 0.03, 11.0
        block = np.diag([scale, scale * delta**4, high])
        g_value, floor, deficit = 2.0, 0.5, 3.0
        negative = np.diag([deficit, deficit, 0.0])
        positive = block - g_value * np.eye(3) + negative
        self.assertGreater(float(np.linalg.eigvalsh(positive)[0]), 0.0)
        np.testing.assert_allclose(block, g_value * np.eye(3) + positive - negative)
        self.assertGreater(deficit, g_value - floor)
        self.assertGreaterEqual(block[2, 2], floor)

    def test_scope_and_required_formulas(self) -> None:
        required = (
            "exact three-term split",
            "Conditional on the first two estimates",
            "necessary and sufficient",
            "rho_1\\rho_1^*\\preceq C\\mathfrak d_\\lambda R_1",
            "separate anchor forcing `b_F`",
            "twice-harmonic retained range",
            "do not imply `E_u=O(d_4 L)`",
            "not the pinned",
            "non-implication model",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)
        self.assertNotIn("proves the Riemann hypothesis", self.text.lower())

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
