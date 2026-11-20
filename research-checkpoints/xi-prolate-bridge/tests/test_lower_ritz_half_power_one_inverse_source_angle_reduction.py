#!/usr/bin/env python3
"""Regressions for the lower-Ritz one-inverse source-angle reduction."""

from __future__ import annotations

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
NOTE = ROOT / "notes" / "LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md"


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class LowerRitzHalfPowerOneInverseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        expected = {
            "notes/CYCLIC_MELLIN_GRAPH_PRODUCT_TRANSITION_PACKET_NONCAPTURE_BARRIER.md": "b7e29753bb6ff4f4082a114413bf7f80b460f4c8d0a0b5e48ee73e435e2fc488",
            "tests/test_cyclic_mellin_graph_product_transition_packet_noncapture_barrier.py": "26d5d820330cb7971e7bf5e47550d56a9bc3924091db93d8e83afa3025a0d769",
            "notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md": "1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1",
            "notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md": "9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71",
            "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md": "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
            "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md": "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
            "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md": "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
            "notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md": "c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b",
            "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md": "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
            "notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md": "aae9399deac920452a4dc9a3f865503bf987ac2be7fc3c11c515ae2ad02b9b55",
            "notes/CAUCHY_GROUND_RESPONSE_WINDOW_REDUCTION.md": "0cbf4c438f1f06ab0d972fed3ba6d1464aef2aa9888e9dc3a6aeee548e66ee4c",
            "notes/SECANT_SHORTED_RECIPROCAL_FESHBACH.md": "40060cf7c6c46ed7a36e6febcb6edc2c9a58f296bd8ec324755553920b8dd03e",
            "notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md": "787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79",
        }
        for relative, digest in expected.items():
            path = ROOT / relative
            self.assertTrue(path.is_file(), relative)
            self.assertEqual(sha256(path), digest, relative)

    def test_harmonic_schur_quadratic_and_sampling_identities(self) -> None:
        dmat = np.array([[5.0, 1.0], [1.0, 4.0]])
        gamma = np.array([[1.0, 2.0]])
        hmat = np.array([[3.0]])
        bmat = np.block([[dmat, gamma.T], [gamma, hmat]])
        shear = np.linalg.solve(hmat, gamma)
        sigma = dmat - gamma.T @ np.linalg.solve(hmat, gamma)
        lift = np.vstack([np.eye(2), -shear])

        y = np.array([1.0, 2.0])
        f = np.array([-1.0])
        v = np.concatenate([y, f])
        harmonic_far = f + shear @ y
        expected_quadratic = y @ sigma @ y + harmonic_far @ hmat @ harmonic_far
        self.assertAlmostEqual(v @ bmat @ v, expected_quadratic, places=13)

        zmat = np.array([[1.0, 2.0, 1.0], [0.0, 1.0, -1.0]])
        z_y = zmat[:, :2]
        z_f = zmat[:, 2:]
        z_eff = z_y - z_f @ shear
        np.testing.assert_allclose(
            zmat @ v, z_eff @ y + z_f @ harmonic_far, rtol=0, atol=2e-14
        )
        np.testing.assert_allclose(z_eff, zmat @ lift, rtol=0, atol=2e-14)

    def test_one_inverse_row_and_normalized_graph_identities(self) -> None:
        dmat = np.array([[5.0, 1.0], [1.0, 4.0]])
        gamma = np.array([[1.0, 2.0]])
        hmat = np.array([[3.0]])
        bmat = np.block([[dmat, gamma.T], [gamma, hmat]])
        shear = np.linalg.solve(hmat, gamma)
        sigma = dmat - gamma.T @ np.linalg.solve(hmat, gamma)

        row = np.array([2.0, -1.0, 3.0])
        effective_row = row[:2] - shear.T[:, 0] * row[2]
        exact = row @ np.linalg.inv(bmat) @ row
        harmonic = (
            effective_row @ np.linalg.inv(sigma) @ effective_row
            + row[2] ** 2 / hmat[0, 0]
        )
        self.assertAlmostEqual(exact, harmonic, places=13)

        zmat = np.array([[1.0, 2.0, 1.0], [0.0, 1.0, -1.0]])
        z_eff = zmat[:, :2] - zmat[:, 2:] @ shear
        inverse_graph = zmat @ np.linalg.inv(bmat) @ zmat.T
        harmonic_graph = (
            z_eff @ np.linalg.inv(sigma) @ z_eff.T
            + zmat[:, 2:] @ np.linalg.inv(hmat) @ zmat[:, 2:].T
        )
        np.testing.assert_allclose(inverse_graph, harmonic_graph, rtol=0, atol=3e-14)

    def test_source_angle_costs_one_inverse_theta(self) -> None:
        delta_y = np.array([[3.0, 0.4], [0.4, 2.0]])
        theta = 0.125
        c_pos = 7.0
        sigma = theta * delta_y
        chol = np.linalg.cholesky(delta_y)
        z_eff = math.sqrt(c_pos) * chol.T
        normalized = z_eff @ np.linalg.inv(sigma) @ z_eff.T
        self.assertAlmostEqual(
            float(np.linalg.eigvalsh(normalized)[-1]), c_pos / theta, places=11
        )

        h_eff = np.array([1.3, -0.7])
        raw_leverage = h_eff @ np.linalg.inv(delta_y) @ h_eff
        signed_leverage = h_eff @ np.linalg.inv(sigma) @ h_eff
        self.assertAlmostEqual(signed_leverage, raw_leverage / theta, places=12)
        self.assertNotAlmostEqual(signed_leverage, raw_leverage / theta**2, places=6)

    def test_far_block_is_lower_order_at_one_inverse_level(self) -> None:
        # B_abs/G_R has exponent 3-2=1.  The retained angle term has
        # exponent 3+a when theta=lambda^(-a), a>=0.
        for angle_exponent in (0.0, 0.4, 0.9):
            far_exponent = 3 - 2
            retained_exponent = 3 + angle_exponent
            self.assertLess(far_exponent, retained_exponent)

    def test_exact_graph_budget_thresholds(self) -> None:
        # Existing C_pos: total exponent is -2+2*eta+2*a for
        # theta=lambda^(-a), so decay is equivalent to a<1-eta.
        # Conditional collective gain: -4+2*eta+2*a, hence a<2-eta.
        for eta in (0.0, 0.17, 0.49):
            old_boundary = 1 - eta
            improved_boundary = 2 - eta
            for margin in (0.03, 0.2):
                old_a = old_boundary - margin
                new_a = improved_boundary - margin
                self.assertLess(-2 + 2 * eta + 2 * old_a, 0)
                self.assertLess(-4 + 2 * eta + 2 * new_a, 0)
                self.assertGreater(-2 + 2 * eta + 2 * (old_boundary + margin), 0)
                self.assertGreater(-4 + 2 * eta + 2 * (improved_boundary + margin), 0)

    def test_endpoint_shear_preserves_generalized_leverage(self) -> None:
        d8 = 2.0
        drest = np.array([[3.0, 0.4], [0.4, 5.0]])
        dbd = np.block(
            [[np.array([[d8]]), np.zeros((1, 2))], [np.zeros((2, 1)), drest]]
        )
        e8 = 7.0
        erest = np.array([11.0, -2.0])
        srow = erest / e8
        shear = np.block(
            [[np.ones((1, 1)), -srow.reshape(1, 2)], [np.zeros((2, 1)), np.eye(2)]]
        )
        endpoint = np.concatenate([[e8], erest])
        transformed_endpoint = endpoint @ shear
        np.testing.assert_allclose(transformed_endpoint, np.array([e8, 0.0, 0.0]))

        dprime = shear.T @ dbd @ shear
        zmat = np.array([[1.0, -0.3, 2.0], [0.2, 1.1, -0.7]])
        zprime = zmat @ shear
        np.testing.assert_allclose(
            zprime @ np.linalg.inv(dprime) @ zprime.T,
            zmat @ np.linalg.inv(dbd) @ zmat.T,
            rtol=2e-13,
            atol=2e-13,
        )

        lower = dprime[1:, 1:]
        schur = dprime[0, 0] - dprime[0, 1:] @ np.linalg.solve(
            lower, dprime[1:, 0]
        )
        woodbury_schur = d8 / (1 + d8 * srow @ np.linalg.solve(drest, srow))
        self.assertAlmostEqual(schur, woodbury_schur, places=13)
        transformed_energy = e8**2 / schur
        original_energy = e8**2 / d8 + erest @ np.linalg.solve(drest, erest)
        self.assertAlmostEqual(transformed_energy, original_energy, places=12)

    def test_common_carrier_has_coherent_rank_one_growth(self) -> None:
        for prefix_size in (2, 5, 11):
            gram = (math.pi / 12) * np.ones((prefix_size, prefix_size))
            eigenvalues = np.linalg.eigvalsh(gram)
            self.assertAlmostEqual(eigenvalues[-1], prefix_size * math.pi / 12, places=12)
            self.assertLess(np.linalg.norm(eigenvalues[:-1]), 1e-12)

    def test_projective_wedge_is_exact_profile_determinant(self) -> None:
        c_kappa = 1.7
        overlap = 0.83
        k_t, k_0 = 1.2, -0.9
        a_k_t, a_k_0 = 0.6, 1.4
        a_u_t, a_u_0 = -0.3, 0.8

        kappa_t = c_kappa * k_t * a_k_t
        kappa_0 = c_kappa * k_0 * a_k_0
        phi_t = k_t * a_u_t
        phi_0 = k_0 * a_u_0
        z_t = kappa_t - phi_t / overlap
        z_0 = kappa_0 - phi_0 / overlap
        wedge = kappa_0 * z_t - kappa_t * z_0
        determinant = a_k_t * a_u_0 - a_k_0 * a_u_t
        expected = c_kappa * k_t * k_0 * determinant / overlap
        self.assertAlmostEqual(wedge, expected, places=13)

    def test_all_shift_rank_two_woodbury_and_mixed_row(self) -> None:
        tmat = np.array([[2.0, 0.3], [0.2, 1.4]])
        odd_shift = np.array([[3.0, 0.1], [0.1, 2.2]])
        u0 = np.array([[0.4, -0.7], [1.1, 0.2]])
        v0 = np.array([[0.8, -0.3], [0.5, 1.2]])
        inv_t = np.linalg.inv(tmat)
        a_shift = inv_t @ (odd_shift @ tmat + u0 @ v0.T)
        xmat = inv_t @ np.linalg.inv(odd_shift) @ tmat
        ymat = inv_t @ np.linalg.inv(odd_shift) @ u0
        woodbury = xmat - ymat @ np.linalg.inv(np.eye(2) + v0.T @ ymat) @ v0.T @ xmat
        np.testing.assert_allclose(woodbury, np.linalg.inv(a_shift), rtol=2e-13, atol=2e-13)

        hrow = np.array([0.6, -1.4])
        forcing = np.array([1.2, 0.4])
        direct = hrow @ np.linalg.solve(a_shift, forcing)
        reconstructed = (
            hrow @ xmat @ forcing
            - (hrow @ ymat)
            @ np.linalg.solve(np.eye(2) + v0.T @ ymat, v0.T @ xmat @ forcing)
        )
        self.assertAlmostEqual(direct, reconstructed, places=13)

    def test_forced_cancellation_diagnostic_is_only_conditional(self) -> None:
        # A=lambda^2, so A^(1/2-hC)=lambda^(1-2*hC).
        for epsilon in (0.05, 0.2):
            h_c = 1 - epsilon / 2
            self.assertAlmostEqual(1 - 2 * h_c, -1 + epsilon, places=14)
        required_missing = (
            "\\sigma:=hC",
            "T_L={e^{hCL}\\over L^{2m}}",
            "not a proved contraction of ordinary paired-zero",
            "not captured by `Y`",
            "minimum-energy metric can shrink",
            "Q_X-u G_phys",
            "no proved nonnegative sign",
            "only a scale diagnostic",
        )
        for phrase in required_missing:
            self.assertIn(phrase, self.text)

    def test_required_claim_boundary_and_scale_tokens(self) -> None:
        required = (
            "Lower-Ritz half-power one-inverse source-angle reduction",
            "B_u=A-uI\\succ0",
            "Q_--uI\\succ0",
            "\\Sigma_u\\succeq\\theta_\\lambda\\Delta_Y>0",
            "C_R(\\lambda)=O",
            "C_E(\\lambda)=O(\\theta_\\lambda^{-1})",
            "\\lambda^{-1+\\eta}\\operatorname {polylog}\\lambda",
            "\\lambda^{-2+\\eta}\\operatorname {polylog}\\lambda",
            "r=f+\\mathscr Sy",
            "Z_{\\rm eff}=ZE_u=Z_Y-Z_F\\mathscr S",
            "h^*B_u^{-1}h",
            "\\Delta_Y=E_u^*\\Delta E_u",
            "one-power form",
            "C_{\\rm pos}=O(\\lambda^3P(\\lambda))",
            "B_{\\rm abs}\\over G_R",
            "strictly weaker determinant observable",
            "generalized sampling leverage is exactly invariant",
            "singleton Schur complement",
            "{\\pi\\over12}{\\bf1}{\\bf1}^*",
            "whole-window profile determinant estimate",
            "independent real source-Cauchy",
            "not the lower Ritz shift `u`",
            "rank-two",
            "Woodbury identity",
            "pole, Archimedean, and minus-prime pieces",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_no_sign_metric_or_rh_overclaim(self) -> None:
        forbidden = (
            "This note proves the strict signs",
            "This note proves the source-angle floor",
            "This note proves RH",
            "The collective O(lambda*P) theorem is proved",
            "The endpoint shear lowers generalized leverage",
            "The full exterior metric equals the split metric",
            "The off-prime Hilbert map is ordinary zero sampling",
            "Equation (5.2) is proved",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, self.text)

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = pathlib.Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_ascii_balanced_displays_unique_tags_and_no_artifacts(self) -> None:
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("__pycache__", self.text)
        self.assertNotIn(".pyc", self.text)
        self.assertNotIn("PENDING_STRICT_AUDIT", self.text)


if __name__ == "__main__":
    unittest.main()
