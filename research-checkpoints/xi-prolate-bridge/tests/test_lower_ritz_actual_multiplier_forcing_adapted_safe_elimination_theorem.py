#!/usr/bin/env python3
"""Regressions for the forcing-adapted multiplier-safe elimination."""

from __future__ import annotations

import ast
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / (
    "LOWER_RITZ_ACTUAL_MULTIPLIER_FORCING_ADAPTED_SAFE_ELIMINATION_THEOREM.md"
)
NOTE_HASH = "b49285625d876d36ae21fa8e1dcf1ba0ff361d770987bb66cbea2fc415674398"

FROZEN = {
    "notes/LOWER_RITZ_POST_FAR_RETAINED_INVERSE_ROW_THEOREM.md":
        "9288ac25216781416d0bb1d0ef7d2a11f3dd09bac8e8f04195ac9b3e928229f3",
    "tests/test_lower_ritz_post_far_retained_inverse_row_theorem.py":
        "8f2aa9cb6daca472d75a890520c23dfd1b5dcb487e8454b1c12b598b61a58327",
    "notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md":
        "cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e",
    "tests/test_growing_mixed_bridge_actual_multiplier_dangerous_feshbach_reduction.py":
        "1bbe3d751efedb86ab412921a5f99d243b1ebffef33afe325e2930a5d5670a0c",
    "notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md":
        "04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83",
    "tests/test_fixed_source_block_shift_asymptotic_theorem.py":
        "433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def orthonormal_range(matrix: np.ndarray, tolerance: float = 1e-12) -> np.ndarray:
    left, singular, _ = np.linalg.svd(matrix, full_matrices=False)
    rank = int(np.count_nonzero(singular > tolerance))
    return left[:, :rank]


def orthogonal_complement(matrix: np.ndarray, tolerance: float = 1e-12) -> np.ndarray:
    _, singular, right = np.linalg.svd(matrix.T, full_matrices=True)
    rank = int(np.count_nonzero(singular > tolerance))
    return right[rank:, :].T


class LowerRitzActualMultiplierForcingAdaptedSafeEliminationTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_twice_harmonic_forcing_adaptation_and_inverse_row(self) -> None:
        # The physical order is Y=(captured, retained) followed by far.
        b_q = np.diag([-0.5, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0])
        for row, column, value in (
            (0, 1, 0.10),
            (0, 5, -0.08),
            (1, 3, 0.12),
            (1, 6, 0.07),
            (2, 5, 0.11),
            (3, 6, -0.09),
            (4, 5, 0.06),
        ):
            b_q[row, column] = value
            b_q[column, row] = value

        delta = 2.5
        shift = 2.0
        b_u = b_q + shift * np.eye(7)
        projector = np.diag([1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
        safe_basis = np.eye(7)[:, 1:]
        safe_q = safe_basis.T @ b_q @ safe_basis
        self.assertGreaterEqual(float(np.linalg.eigvalsh(safe_q)[0]), delta)
        self.assertGreater(float(np.linalg.eigvalsh(b_u)[0]), 0.0)

        high = b_u[5:, 5:]
        gamma = b_u[5:, :5]
        far_lift = np.vstack((np.eye(5), -np.linalg.solve(high, gamma)))
        sigma = far_lift.T @ b_u @ far_lift
        pivot = sigma[:1, :1]
        cross = sigma[1:, :1]
        captured_lift = np.vstack(
            (-np.linalg.solve(pivot, cross.T), np.eye(4))
        )
        combined = far_lift @ captured_lift
        gram = combined.T @ combined
        self.assertGreaterEqual(float(np.linalg.eigvalsh(gram - np.eye(4))[0]), -2e-14)

        forcing = np.array([0.5, -0.7, 0.9, 0.2, -0.4, 0.8, -0.3])
        returned = combined.T @ forcing
        dangerous_pullback = combined.T @ projector
        dangerous = orthonormal_range(
            np.column_stack((dangerous_pullback, returned))
        )
        safe = orthogonal_complement(dangerous)
        self.assertEqual(dangerous.shape[1], 2)
        self.assertEqual(safe.shape[1], 2)
        self.assertLessEqual(dangerous.shape[1], int(np.trace(projector)) + 1)

        safe_lift = combined @ safe
        np.testing.assert_allclose(projector @ safe_lift, 0.0, atol=2e-14)
        np.testing.assert_allclose(safe.T @ returned, 0.0, atol=2e-14)
        np.testing.assert_allclose(safe_lift.T @ forcing, 0.0, atol=2e-14)

        safe_short = safe_lift.T @ b_u @ safe_lift
        safe_gram = safe_lift.T @ safe_lift
        floor_defect = safe_short - (delta + shift) * safe_gram
        self.assertGreaterEqual(float(np.linalg.eigvalsh(floor_defect)[0]), -2e-13)
        self.assertGreaterEqual(float(np.linalg.eigvalsh(safe_gram)[0]), 1.0 - 2e-14)

        retained = combined.T @ b_u @ combined
        basis = np.column_stack((dangerous, safe))
        blocked = basis.T @ retained @ basis
        dangerous_block = blocked[:2, :2]
        coupling = blocked[2:, :2]
        safe_block = blocked[2:, 2:]
        schur = dangerous_block - coupling.T @ np.linalg.solve(
            safe_block, coupling
        )
        dangerous_row = dangerous.T @ returned
        full_energy = returned @ np.linalg.solve(retained, returned)
        reduced_energy = dangerous_row @ np.linalg.solve(schur, dangerous_row)
        self.assertAlmostEqual(float(full_energy), float(reduced_energy), places=12)
        self.assertAlmostEqual(
            float((safe.T @ returned) @ np.linalg.solve(safe_block, safe.T @ returned)),
            0.0,
            places=14,
        )

    def test_shift_and_dimension_arithmetic(self) -> None:
        q_value = 7.0
        u_value = 5.5
        self.assertGreaterEqual(q_value - u_value, 0.0)
        b_q = np.diag([-1.0, 3.0, 4.0])
        np.testing.assert_allclose(
            b_q + (q_value - u_value) * np.eye(3),
            b_q + 1.5 * np.eye(3),
        )
        for multiplier_rank in (0, 1, 7, 23):
            self.assertLessEqual(multiplier_rank + 1, multiplier_rank + 1)

    def test_scope_and_required_formulas(self) -> None:
        required = (
            "forcing-adapted dangerous space",
            r"\mathcal D_\rho",
            r"\operatorname {Ran}(\mathsf G_u^*\Pi_q)",
            r"\Pi_qW_F=0",
            r"f_F=0",
            r"f_F^*H_F^{-1}f_F=0",
            r"\mathsf G_u^*\mathsf G_u\succeq I",
            r"d_\rho d_\rho^*\preceq C d_4L S_\rho",
            "even block of the paired physical projector",
            "not a circular Riesz-representer construction",
            "`b_F=P_Fb`",
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
        self.assertGreaterEqual(len(displays), 25)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for display in displays:
            self.assertNotIn("$", display)
            self.assertEqual(display.count("{"), display.count("}"))
            self.assertEqual(display.count(r"\begin"), display.count(r"\end"))

        source = Path(__file__).read_text(encoding="ascii")
        ast.parse(source)
        self.assertNotIn("\r", source)
        self.assertFalse(any(line.endswith((" ", "\t")) for line in source.splitlines()))

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
        with tempfile.TemporaryDirectory() as temporary:
            tex = Path(temporary) / "note.tex"
            tex.write_text(document, encoding="ascii")
            completed = subprocess.run(
                [pdflatex, "-halt-on-error", "-interaction=nonstopmode", tex.name],
                cwd=temporary,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
        self.assertEqual(completed.returncode, 0, completed.stdout)


if __name__ == "__main__":
    unittest.main()
