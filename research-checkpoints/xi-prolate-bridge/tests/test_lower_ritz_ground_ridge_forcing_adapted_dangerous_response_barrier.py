#!/usr/bin/env python3
"""Regressions for the ground-ridge dangerous-response barrier."""

from __future__ import annotations

import ast
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import mpmath as mp
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / (
    "LOWER_RITZ_GROUND_RIDGE_FORCING_ADAPTED_DANGEROUS_RESPONSE_BARRIER.md"
)
NOTE_HASH = "acb5f56fb97e1ad54b95328beb555effa0e89b1569540915728b5b6959a2d122"

FROZEN = {
    "notes/LOWER_RITZ_ACTUAL_MULTIPLIER_FORCING_ADAPTED_SAFE_ELIMINATION_THEOREM.md":
        "b49285625d876d36ae21fa8e1dcf1ba0ff361d770987bb66cbea2fc415674398",
    "tests/test_lower_ritz_actual_multiplier_forcing_adapted_safe_elimination_theorem.py":
        "0e670415cf39bb3e53a7d200ec3947bd84dbd7c1576e888ed18954ffd6183edc",
    "notes/LOWER_RITZ_ACTUAL_MULTIPLIER_SAFE_RETURNED_ROW_REDUCTION_BARRIER.md":
        "e181b86e3984f4bf4237825e88d1a67703cb03043b386bf8844b49343dbf73cd",
    "tests/test_lower_ritz_actual_multiplier_safe_returned_row_reduction_barrier.py":
        "6ac27b5821e267003ade5b63666b409a1357802b8314f5461c7e62da922579c0",
    "notes/LOWER_RITZ_POST_FAR_RETAINED_INVERSE_ROW_THEOREM.md":
        "9288ac25216781416d0bb1d0ef7d2a11f3dd09bac8e8f04195ac9b3e928229f3",
    "tests/test_lower_ritz_post_far_retained_inverse_row_theorem.py":
        "8f2aa9cb6daca472d75a890520c23dfd1b5dcb487e8454b1c12b598b61a58327",
    "notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md":
        "0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3",
    "tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py":
        "8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b",
    "notes/FIXED_ANCHOR_BV_CAUCHY_FAR_ROW_THEOREM.md":
        "59395e5d184c93e3e56c935028c5fba322a0f30476bd9db1c99585c056876c79",
    "tests/test_fixed_anchor_bv_cauchy_far_row_theorem.py":
        "905dae5ca5489665dea4bfa1309d062fbd2769a529674b6c10d380a3f3627e3e",
    "notes/LOWER_RITZ_POST_FAR_CAPTURED_RESPONSE_ANCHOR_ROW_BARRIER.md":
        "3628b3b5f6365e0fdbc441ba08503bfed1969fa64f91deb1fd88e79ce5fe5c3e",
    "tests/test_lower_ritz_post_far_captured_response_anchor_row_barrier.py":
        "8e604475927555203ab0d0389a681648ca2a3bbcd5d61e36447d0005db4953e4",
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


class GroundRidgeForcingAdaptedDangerousResponseTests(unittest.TestCase):
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

    def test_ridge_specific_three_level_energy_and_response(self) -> None:
        # Physical order is Y=(captured, retained) followed by far.
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
        t = 2.0
        b_u = b_q + t * np.eye(7)
        direction = np.array([0.5, -0.7, 0.9, 0.2, -0.4, 0.8, -0.3])
        direction /= np.linalg.norm(direction)
        moment = direction @ b_u @ direction
        forcing = np.sqrt(t * moment) * direction

        def secular(short_ridge: float) -> float:
            d_ridge = b_u + short_ridge * np.eye(7)
            return float(
                t
                + short_ridge
                - forcing @ np.linalg.solve(d_ridge, forcing)
            )

        lower = 0.0
        upper = 1.0
        self.assertLess(secular(lower), 0.0)
        while secular(upper) < 0.0:
            upper *= 2.0
        for _ in range(100):
            middle = (lower + upper) / 2.0
            if secular(middle) < 0.0:
                lower = middle
            else:
                upper = middle
        ridge = (lower + upper) / 2.0
        d_h = b_u + ridge * np.eye(7)
        projector = np.diag([1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
        safe_physical = np.eye(7)[:, 1:]
        self.assertGreaterEqual(
            float(np.linalg.eigvalsh(safe_physical.T @ b_q @ safe_physical)[0]),
            delta,
        )

        observation = np.array([-0.2, 0.6, 0.1, -0.8, 0.7, 0.4, -0.5])

        lower_ritz = np.array(
            [[t, np.linalg.norm(forcing)], [np.linalg.norm(forcing), moment]]
        )
        self.assertAlmostEqual(float(np.linalg.eigvalsh(lower_ritz)[0]), 0.0)
        q_plus = np.block(
            [
                [np.array([[t]]), forcing[np.newaxis, :]],
                [forcing[:, np.newaxis], b_u],
            ]
        )
        self.assertAlmostEqual(
            float(np.linalg.eigvalsh(q_plus)[0]), -ridge, places=12
        )

        high = d_h[5:, 5:]
        cross = d_h[5:, :5]
        far_lift = np.vstack((np.eye(5), -np.linalg.solve(high, cross)))
        sigma = far_lift.T @ d_h @ far_lift
        beta = far_lift.T @ forcing
        gamma = far_lift.T @ observation

        pivot = sigma[:1, :1]
        captured_cross = sigma[1:, :1]
        captured_lift = np.vstack(
            (-np.linalg.solve(pivot, captured_cross.T), np.eye(4))
        )
        combined = far_lift @ captured_lift
        retained = combined.T @ d_h @ combined
        returned_forcing = combined.T @ forcing
        returned_observation = combined.T @ observation

        danger_pullback = combined.T @ projector
        danger = orthonormal_range(
            np.column_stack((danger_pullback, returned_forcing))
        )
        safe = orthogonal_complement(danger)
        self.assertEqual(danger.shape[1], 2)
        self.assertEqual(safe.shape[1], 2)
        np.testing.assert_allclose(safe.T @ returned_forcing, 0.0, atol=2e-14)
        np.testing.assert_allclose(projector @ combined @ safe, 0.0, atol=2e-14)

        basis = np.column_stack((danger, safe))
        blocked = basis.T @ retained @ basis
        rank = danger.shape[1]
        dangerous_block = blocked[:rank, :rank]
        coupling = blocked[rank:, :rank]
        safe_block = blocked[rank:, rank:]
        schur = dangerous_block - coupling.T @ np.linalg.solve(
            safe_block, coupling
        )
        dangerous_forcing = danger.T @ returned_forcing
        dangerous_observation = danger.T @ returned_observation
        safe_observation = safe.T @ returned_observation
        returned_observation_short = dangerous_observation - coupling.T @ np.linalg.solve(
            safe_block, safe_observation
        )

        safe_lift = combined @ safe
        floor_defect = (
            safe_block
            - (delta + t + ridge) * (safe_lift.T @ safe_lift)
        )
        self.assertGreaterEqual(float(np.linalg.eigvalsh(floor_defect)[0]), -3e-13)

        far_energy = forcing[5:] @ np.linalg.solve(high, forcing[5:])
        captured_energy = beta[:1] @ np.linalg.solve(pivot, beta[:1])
        dangerous_energy = dangerous_forcing @ np.linalg.solve(
            schur, dangerous_forcing
        )
        full_energy = forcing @ np.linalg.solve(d_h, forcing)
        self.assertAlmostEqual(float(full_energy), t + ridge, places=12)
        self.assertAlmostEqual(
            float(full_energy),
            float(far_energy + captured_energy + dangerous_energy),
            places=11,
        )

        far_response = observation[5:] @ np.linalg.solve(high, forcing[5:])
        captured_response = gamma[:1] @ np.linalg.solve(pivot, beta[:1])
        dangerous_response = returned_observation_short @ np.linalg.solve(
            schur, dangerous_forcing
        )
        full_response = observation @ np.linalg.solve(d_h, forcing)
        self.assertAlmostEqual(
            float(full_response),
            float(far_response + captured_response + dangerous_response),
            places=11,
        )

        leverage = returned_observation_short @ np.linalg.solve(
            schur, returned_observation_short
        )
        self.assertLessEqual(
            float(dangerous_response * dangerous_response),
            float(dangerous_energy * leverage) + 2e-13,
        )

    def test_anchor_removed_fourier_tail_is_the_raw_far_tail(self) -> None:
        dimension = 13
        anchor = np.zeros(dimension, dtype=np.complex128)
        anchor[:5] = np.array([1.0, -2.0, 0.5, 0.25, -0.75])
        anchor /= np.linalg.norm(anchor)
        far = np.eye(dimension, dtype=np.complex128)[:, 7:]
        riesz = np.array(
            [complex(index + 1, 2 - index) for index in range(dimension)]
        )
        anchor_removed = riesz - anchor * np.vdot(anchor, riesz)
        np.testing.assert_allclose(
            far.conj().T @ anchor_removed,
            far.conj().T @ riesz,
            atol=2e-14,
        )

        radius = 1000
        tail = sum(1.0 / (index * index) for index in range(radius + 1, 10**6))
        self.assertLess(tail, 1.0 / radius)

    def test_ridge_uniform_far_and_captured_monotonicity(self) -> None:
        high_zero = np.array([[5.0, 0.3], [0.3, 7.0]])
        cross = np.array([[0.2, -0.1, 0.4], [0.1, 0.3, -0.2]])
        low_zero = np.array(
            [[4.0, 0.1, -0.2], [0.1, 5.0, 0.3], [-0.2, 0.3, 6.0]]
        )
        low_metric = np.diag([1.2, 0.9, 1.5])
        synthesis = np.array([[1.0, 0.0], [0.0, 1.0], [0.2, -0.1]])

        def lift(short_ridge: float) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
            high = high_zero + short_ridge * np.eye(2)
            sigma = (
                low_zero
                + short_ridge * np.eye(3)
                - cross.T @ np.linalg.solve(high, cross)
            )
            harmonic = np.vstack((np.eye(3), -np.linalg.solve(high, cross)))
            pulled = harmonic @ synthesis
            metric = np.block(
                [
                    [low_metric, np.zeros((3, 2))],
                    [np.zeros((2, 3)), np.eye(2)],
                ]
            )
            return sigma, pulled.T @ metric @ pulled, synthesis.T @ sigma @ synthesis

        sigma_zero, metric_zero, pivot_zero = lift(0.0)
        for ridge in (0.1, 1.0, 9.0):
            sigma, metric, pivot = lift(ridge)
            self.assertGreaterEqual(
                float(np.linalg.eigvalsh(sigma - sigma_zero)[0]), -2e-14
            )
            self.assertGreaterEqual(
                float(np.linalg.eigvalsh(pivot - pivot_zero)[0]), -2e-14
            )
            self.assertGreaterEqual(
                float(np.linalg.eigvalsh(metric_zero - metric)[0]), -2e-14
            )

        # Both raw high rows carry R^{-1/2}; the inverse contributes G_R^{-1}.
        radius = 10**12
        anchor_polynomial = 17.0
        mellin_polynomial = 23.0
        far_floor = 101.0
        response_bound = (
            anchor_polynomial * mellin_polynomial / (far_floor * radius)
        )
        self.assertLess(response_bound, 4e-12)

    def test_exact_source_cauchy_ground_ridge_countermodel(self) -> None:
        mp.mp.dps = 100
        eps = mp.mpf("1e-24")
        t = eps**2
        edge = eps**4
        radius = eps * mp.sqrt((16 + eps**4) / 17)
        root34 = mp.sqrt(34)

        nodes = [-2, -1, 0, 1, 2]
        beta = {
            0: mp.mpf(0),
            1: -4 * radius / root34,
            2: -2 * radius / root34,
            -1: 4 * radius / root34,
            -2: 2 * radius / root34,
        }
        diagonal = {
            0: t,
            1: 1 + 4 * radius / root34,
            -1: 1 + 4 * radius / root34,
            2: edge + radius / root34,
            -2: edge + radius / root34,
        }
        raw = mp.matrix(5, 5)
        for i, node_i in enumerate(nodes):
            for j, node_j in enumerate(nodes):
                if i == j:
                    raw[i, j] = diagonal[node_i]
                else:
                    raw[i, j] = (
                        (beta[node_i] - beta[node_j]) / (node_i - node_j)
                    )

        even = mp.matrix(5, 3)
        even[2, 0] = 1
        even[1, 1] = even[3, 1] = 1 / mp.sqrt(2)
        even[0, 2] = even[4, 2] = 1 / mp.sqrt(2)
        odd = mp.matrix(5, 2)
        odd[3, 0] = 1 / mp.sqrt(2)
        odd[1, 0] = -1 / mp.sqrt(2)
        odd[4, 1] = 1 / mp.sqrt(2)
        odd[0, 1] = -1 / mp.sqrt(2)

        even_block = even.T * raw * even
        expected_even = mp.matrix(
            [
                [t, -4 * radius / mp.sqrt(17), -radius / mp.sqrt(17)],
                [-4 * radius / mp.sqrt(17), 1, 0],
                [-radius / mp.sqrt(17), 0, edge],
            ]
        )
        odd_block = odd.T * raw * odd
        expected_odd = mp.matrix(
            [
                [1 + 8 * radius / root34, 4 * radius / root34],
                [4 * radius / root34, edge + 2 * radius / root34],
            ]
        )
        self.assertLess(mp.norm(even_block - expected_even), mp.mpf("1e-90"))
        self.assertLess(mp.norm(odd_block - expected_odd), mp.mpf("1e-90"))
        self.assertGreater(expected_odd[0, 0], 0)
        self.assertGreater(mp.det(expected_odd), 0)

        moment = (16 + edge) / 17
        self.assertLess(abs(t * moment - radius**2), mp.mpf("1e-95"))

        def secular(ridge: mp.mpf) -> mp.mpf:
            return (
                t
                + ridge
                - t
                * (16 + edge)
                / 289
                * (16 / (1 + ridge) + 1 / (edge + ridge))
            )

        lower = mp.mpf(0)
        upper = eps
        self.assertLess(secular(lower), 0)
        self.assertGreater(secular(upper), 0)
        for _ in range(400):
            middle = (lower + upper) / 2
            if secular(middle) < 0:
                lower = middle
            else:
                upper = middle
        ridge = (lower + upper) / 2
        self.assertLess(abs(ridge / eps - mp.mpf(4) / 17), mp.mpf("1e-20"))

        hard_forcing = -4 * eps * mp.sqrt(16 + edge) / 17
        soft_forcing = -eps * mp.sqrt(16 + edge) / 17
        forcing_energy = (
            hard_forcing**2 / (1 + ridge)
            + soft_forcing**2 / (edge + ridge)
        )
        response = mp.sqrt(mp.pi) * soft_forcing / (edge + ridge)
        energy = t + ridge
        leverage = mp.pi / (edge + ridge)
        theta_squared = response**2 / (energy * leverage)
        self.assertLess(abs(forcing_energy - energy), mp.mpf("1e-90"))
        self.assertLess(abs(response + mp.sqrt(mp.pi)), mp.mpf("1e-20"))
        self.assertLess(abs(energy * leverage - mp.pi), mp.mpf("1e-20"))
        self.assertLess(abs(theta_squared - 1), mp.mpf("1e-20"))

        safe_floor = 1 - t
        self.assertGreater(safe_floor, mp.mpf(3) / 4)
        sampling_norm = radius**2 / t
        self.assertLess(sampling_norm, 1)

        projector = mp.matrix([[0, 0], [0, 1]])
        forcing_column = mp.matrix([[hard_forcing], [soft_forcing]])
        adapted_columns = mp.matrix(
            [
                [projector[0, 0], projector[0, 1], forcing_column[0]],
                [projector[1, 0], projector[1, 1], forcing_column[1]],
            ]
        )
        self.assertEqual(mp.rank(adapted_columns), 2)

    def test_scope_and_required_formulas(self) -> None:
        required = (
            "Redo the positive far and captured eliminations at the ridge `h`",
            r"\mathcal D_{\rho,h}",
            r"f_h=0",
            r"t+h=\mathcal E_{F,h}+\mathcal E_{C,h}",
            r"0\leq\mathcal E_{\rho,h}\leq t+h",
            r"\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h",
            r"\Lambda_{\rho,h}(z)",
            r"\theta_{z,h}",
            r"\sqrt L\,\lambda^\eta\over\sqrt R",
            r"P_Fg_z=P_FP_{\mathcal K}\ell_z^*=P_F\ell_z^*",
            r"\Sigma_s-\Sigma_0",
            r"K_{\Delta,Q}",
            r"g_2=\sqrt\pi\,e_2^+",
            "sole unresolved determinant response",
            "structural source-Cauchy countermodel",
            "not the pinned arithmetic",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)
        self.assertNotIn("proves the Riemann hypothesis", self.text.lower())

    def test_displayed_tex_and_static_hygiene(self) -> None:
        self.assertNotIn("\t", self.text)
        self.assertTrue(all(ord(character) < 128 for character in self.text))
        self.assertFalse(
            any(line.endswith((" ", "\t")) for line in self.text.splitlines())
        )
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 55)
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
