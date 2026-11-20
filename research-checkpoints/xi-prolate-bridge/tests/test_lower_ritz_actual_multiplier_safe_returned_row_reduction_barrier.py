#!/usr/bin/env python3
"""Regressions for the actual-multiplier safe returned-row barrier."""

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
NOTE = (
    ROOT
    / "notes"
    / "LOWER_RITZ_ACTUAL_MULTIPLIER_SAFE_RETURNED_ROW_REDUCTION_BARRIER.md"
)

DEPENDENCIES = {
    "notes/LOWER_RITZ_POST_FAR_RETAINED_INVERSE_ROW_THEOREM.md": "9288ac25216781416d0bb1d0ef7d2a11f3dd09bac8e8f04195ac9b3e928229f3",
    "tests/test_lower_ritz_post_far_retained_inverse_row_theorem.py": "8f2aa9cb6daca472d75a890520c23dfd1b5dcb487e8454b1c12b598b61a58327",
    "notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md": "cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e",
    "tests/test_growing_mixed_bridge_actual_multiplier_dangerous_feshbach_reduction.py": "1bbe3d751efedb86ab412921a5f99d243b1ebffef33afe325e2930a5d5670a0c",
    "notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md": "b0254889d35ae41a92ee926dd116b473ee427e2762f8853903f4e80e307860ed",
    "tests/test_weak_residual_duality.py": "0f1f9847497b63b6b2c9e4b9f267dd8157ab71547f80b127d65cbda16af9d659",
    "notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md": "2feb3d62a71e435706c4b330d13bcb096015e52204af6ec9bd2828308d44383d",
    "tests/test_compact_absolute_sampling.py": "883c0e4edd8b6573bcf11740031a6a0ea93340d45e36ac1057e3793b729bc605",
    "notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md": "04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83",
    "tests/test_fixed_source_block_shift_asymptotic_theorem.py": "433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5",
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


class ActualMultiplierSafeReturnedRowBarrierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(expected, self.text)

    def test_twice_harmonic_projector_pullback_and_inverse_split(self) -> None:
        rng = np.random.default_rng(20260811)
        base = rng.normal(size=(6, 6))
        physical = base.T @ base + 3.0 * np.eye(6)
        forcing = rng.normal(size=6)

        # First eliminate a two-dimensional far block.
        short_raw = physical[:4, :4]
        far_cross = physical[4:, :4]
        far = physical[4:, 4:]
        far_lift = np.vstack((np.eye(4), -np.linalg.solve(far, far_cross)))
        first_short = far_lift.T @ physical @ far_lift

        # Then eliminate a two-dimensional captured block.
        pivot = first_short[:2, :2]
        retained_cross = first_short[2:, :2]
        captured_lift = np.vstack(
            (-np.linalg.solve(pivot, retained_cross.T), np.eye(2))
        )
        combined = far_lift @ captured_lift
        retained = combined.T @ physical @ combined
        returned = combined.T @ forcing

        # Pull back a rank-one physical danger projector.
        danger_vector = rng.normal(size=6)
        danger_vector /= np.linalg.norm(danger_vector)
        projector = np.outer(danger_vector, danger_vector)
        pulled = combined.T @ danger_vector
        pulled /= np.linalg.norm(pulled)
        danger_basis = pulled.reshape(2, 1)
        safe_basis = np.array([[-pulled[1]], [pulled[0]]])

        safe_physical = combined @ safe_basis
        np.testing.assert_allclose(projector @ safe_physical, 0.0, atol=2e-12)

        d_block = danger_basis.T @ retained @ danger_basis
        cross = safe_basis.T @ retained @ danger_basis
        high = safe_basis.T @ retained @ safe_basis
        d_row = danger_basis.T @ returned
        f_row = safe_basis.T @ returned
        danger_short = d_block - cross.T @ np.linalg.solve(high, cross)
        danger_return = d_row - cross.T @ np.linalg.solve(high, f_row)

        total = returned @ np.linalg.solve(retained, returned)
        safe_energy = f_row @ np.linalg.solve(high, f_row)
        danger_energy = danger_return @ np.linalg.solve(
            danger_short, danger_return
        )
        self.assertAlmostEqual(float(total), float(safe_energy + danger_energy), 11)

        floor = float(np.linalg.eigvalsh(physical)[0])
        self.assertGreaterEqual(
            float(high[0, 0]),
            floor * float((safe_physical.T @ safe_physical)[0, 0]) - 1e-11,
        )

    def test_positive_sampling_safe_row_loewner_bound(self) -> None:
        rng = np.random.default_rng(314159)
        base = rng.normal(size=(5, 5))
        physical = base.T @ base + 2.0 * np.eye(5)
        forcing = rng.normal(size=5)
        safe_map = rng.normal(size=(5, 3))

        sample_base = rng.normal(size=(7, 5))
        sampling_gram = sample_base.T @ sample_base + np.eye(5)
        sample_ceiling = float(np.linalg.eigvalsh(sampling_gram)[-1])
        upper_shift = float(forcing @ np.linalg.solve(sampling_gram, forcing))

        # Rank-one Loewner: bb* <= U_Z G_Z.
        difference = upper_shift * sampling_gram - np.outer(forcing, forcing)
        self.assertGreaterEqual(float(np.linalg.eigvalsh(difference)[0]), -2e-12)

        safe_operator = safe_map.T @ physical @ safe_map
        safe_row = safe_map.T @ forcing
        floor = float(np.linalg.eigvalsh(physical)[0])
        row_difference = (
            upper_shift * sample_ceiling / floor * safe_operator
            - np.outer(safe_row, safe_row)
        )
        self.assertGreaterEqual(float(np.linalg.eigvalsh(row_difference)[0]), -2e-10)
        energy = float(safe_row @ np.linalg.solve(safe_operator, safe_row))
        self.assertLessEqual(energy, upper_shift * sample_ceiling / floor + 2e-12)

    def test_returned_mellin_observation_absorbs_safe_cross(self) -> None:
        rng = np.random.default_rng(271828)
        base = rng.normal(size=(5, 5))
        retained = base.T @ base + 2.0 * np.eye(5)
        forcing = rng.normal(size=5)
        observation = rng.normal(size=5)

        d_block = retained[:2, :2]
        cross = retained[2:, :2]
        high = retained[2:, 2:]
        d_row, f_row = forcing[:2], forcing[2:]
        a_row, k_row = observation[:2], observation[2:]

        danger_short = d_block - cross.T @ np.linalg.solve(high, cross)
        returned_forcing = d_row - cross.T @ np.linalg.solve(high, f_row)
        returned_observation = a_row - cross.T @ np.linalg.solve(high, k_row)

        danger_solve = np.linalg.solve(danger_short, returned_forcing)
        safe_solve = np.linalg.solve(high, f_row) - np.linalg.solve(
            high, cross @ danger_solve
        )
        full_solve = np.linalg.solve(retained, forcing)
        np.testing.assert_allclose(full_solve, np.r_[danger_solve, safe_solve])

        direct = float(observation @ full_solve)
        pure_safe = float(k_row @ np.linalg.solve(high, f_row))
        returned_danger = float(
            returned_observation @ np.linalg.solve(danger_short, returned_forcing)
        )
        self.assertAlmostEqual(direct, pure_safe + returned_danger, places=11)

        forcing_energy = float(f_row @ np.linalg.solve(high, f_row))
        observation_leverage = float(k_row @ np.linalg.solve(high, k_row))
        self.assertLessEqual(
            abs(pure_safe),
            np.sqrt(forcing_energy * observation_leverage) + 1e-12,
        )

    def test_exact_all_safe_source_cauchy_counterfamily(self) -> None:
        nodes = (-2, -1, 0, 1, 2)
        anchor = np.array([0.0, 0.0, 1.0, 0.0, 0.0])
        even_one = np.array([0.0, 1.0, 0.0, 1.0, 0.0]) / np.sqrt(2.0)
        even_two = np.array([1.0, 0.0, 0.0, 0.0, 1.0]) / np.sqrt(2.0)
        odd_one = np.array([0.0, -1.0, 0.0, 1.0, 0.0]) / np.sqrt(2.0)
        odd_two = np.array([-1.0, 0.0, 0.0, 0.0, 1.0]) / np.sqrt(2.0)
        parity = np.column_stack((anchor, even_one, even_two, odd_one, odd_two))

        ratios = []
        t_value = 0.01
        for scale in (2.0, 8.0, 32.0, 128.0):
            residual = np.sqrt(t_value * (16.0 * scale + 1.0) / 17.0)
            beta = {
                -2: 2.0 * residual / np.sqrt(34.0),
                -1: 4.0 * residual / np.sqrt(34.0),
                0: 0.0,
                1: -4.0 * residual / np.sqrt(34.0),
                2: -2.0 * residual / np.sqrt(34.0),
            }
            diagonal = {
                -2: 1.0 + residual / np.sqrt(34.0),
                -1: scale + 4.0 * residual / np.sqrt(34.0),
                0: t_value,
                1: scale + 4.0 * residual / np.sqrt(34.0),
                2: 1.0 + residual / np.sqrt(34.0),
            }
            raw = source_cauchy_matrix(nodes, diagonal, beta)
            transformed = parity.T @ raw @ parity
            even = transformed[:3, :3]
            odd = transformed[3:, 3:]
            expected_even = np.array(
                [
                    [t_value, -4.0 * residual / np.sqrt(17.0), -residual / np.sqrt(17.0)],
                    [-4.0 * residual / np.sqrt(17.0), scale, 0.0],
                    [-residual / np.sqrt(17.0), 0.0, 1.0],
                ]
            )
            np.testing.assert_allclose(even, expected_even, rtol=2e-12, atol=2e-12)
            self.assertGreater(float(np.linalg.eigvalsh(odd)[0]), 0.0)

            complement = np.diag([scale, 1.0])
            coupling = expected_even[1:, 0]
            direction = coupling / residual
            self.assertAlmostEqual(
                t_value * float(direction @ complement @ direction),
                residual**2,
                places=12,
            )
            self.assertGreater(float(np.linalg.eigvalsh(complement)[0]), 0.0)

            q_shifted = complement - t_value * np.eye(2)
            positive_part = q_shifted - 0.5 * np.eye(2)
            self.assertGreater(float(np.linalg.eigvalsh(positive_part)[0]), 0.0)

            sampling_gram = np.outer(coupling, coupling) / t_value
            self.assertLessEqual(
                float(np.linalg.eigvalsh(sampling_gram)[-1]), scale + 1e-12
            )
            np.testing.assert_allclose(
                np.outer(coupling, coupling), t_value * sampling_gram
            )

            energy = float(coupling @ np.linalg.solve(complement, coupling))
            expected_ratio = (16.0 * scale + 1.0) * (16.0 / scale + 1.0) / 289.0
            self.assertAlmostEqual(energy / t_value, expected_ratio, places=11)
            ratios.append(energy / t_value)

        self.assertTrue(all(y > x for x, y in zip(ratios, ratios[1:])))
        self.assertGreater(ratios[-1], 5.0 * ratios[0])

    def test_scope_scale_and_required_formulas(self) -> None:
        required = (
            "actual multiplier floor at `q`",
            "dangerous projection `d`",
            "U_ZB_{\\rm abs}(\\lambda,N)",
            "does not replace `U_Z` by `q`",
            "does not imply `O(d_4L)`",
            "ff^*\\preceq C d_4L H",
            "pure safe term tends to zero",
            "post-captured, multiplier-safe forcing",
            "not an arithmetic counterexample",
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
