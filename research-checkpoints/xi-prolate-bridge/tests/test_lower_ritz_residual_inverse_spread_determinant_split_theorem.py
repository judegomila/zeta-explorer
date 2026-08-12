#!/usr/bin/env python3
"""Regressions for the lower-Ritz residual determinant split theorem."""

from __future__ import annotations

import ast
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
    / "LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md"
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
    for row, n in enumerate(nodes):
        for column, m in enumerate(nodes):
            matrix[row, column] = (
                diagonal[n]
                if n == m
                else (beta[n] - beta[m]) / (n - m)
            )
    return matrix


class LowerRitzResidualDeterminantSplitTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        expected = {
            "DIRECT_RH_ATTACK.md": "b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2",
            "notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md": "8ad5b2695ebea66f94c1dc58c7eb08a1d0c06d30f73c5536915be566f9e2b949",
            "notes/VECTOR_SPECIFIC_EQUATION_52_ATTACK.md": "79b9af2baddd0b2ae794e77bccf749c6fa0458afbf4637ca8b84931d8206788f",
            "notes/POLYLOG_SHIFTED_SOLVE_OBSERVABLE_REDUCTION.md": "5b7618305c56e2b1b403cd437c4cffad0ea4214396739ce2fed7a351ebb9fcfa",
            "tests/test_polylog_shifted_solve_observable_reduction.py": "c6aa5d4bdd47e16689fa42d5848bcd7d1a18e70cd6781f8f31406a6bf8ae2ae1",
            "notes/SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md": "9324d758eca900f646eb5a6187cb5f316ece99b64ec77d7da2eb72cc7c7ff4a4",
            "tests/test_same_anchor_endpoint_rate_attack.py": "dd63d4a84cbd8330893c11d273648435f57ee858ebd06231e7b3ad811a5712fb",
            "notes/CYCLIC_MELLIN_GRAPH_PRODUCT_TRANSITION_PACKET_NONCAPTURE_BARRIER.md": "b7e29753bb6ff4f4082a114413bf7f80b460f4c8d0a0b5e48ee73e435e2fc488",
            "tests/test_cyclic_mellin_graph_product_transition_packet_noncapture_barrier.py": "26d5d820330cb7971e7bf5e47550d56a9bc3924091db93d8e83afa3025a0d769",
            "notes/SOURCE_COMPATIBLE_GROUND_PROJECTIVE_RESPONSE.md": "2e4950652fc7d37d399aec34a7a1cd2b906463072cba4c7c7361e29bf411b073",
            "tests/test_source_compatible_ground_projective_response.py": "096521d90b0822a677bd147908ecca0addd63a38226924c98453d6e79247f57c",
            "notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md": "04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83",
            "tests/test_fixed_source_block_shift_asymptotic_theorem.py": "433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5",
        }
        for relative, digest in expected.items():
            path = ROOT / relative
            self.assertTrue(path.is_file(), relative)
            self.assertEqual(sha256(path), digest, relative)

    def test_short_residual_spread_and_ground_ridge_identities(self) -> None:
        # Use w=e_0 so the retained block coordinates are explicit.
        bmat = np.array(
            [
                [4.0, 0.7, -0.3],
                [0.7, 2.0, 0.4],
                [-0.3, 0.4, 1.5],
            ]
        )
        self.assertGreater(float(np.linalg.eigvalsh(bmat)[0]), 0.0)
        w = np.array([1.0, 0.0, 0.0])
        residual_norm = 0.9
        forcing = residual_norm * w
        first_moment = float(w @ bmat @ w)
        lowering = residual_norm**2 / first_moment

        cvector = bmat[1:, 0]
        cblock = bmat[1:, 1:]
        short = cblock - np.outer(cvector, cvector) / first_moment
        ritz_residual = -(lowering / residual_norm) * cvector

        forcing_energy = float(forcing @ np.linalg.solve(bmat, forcing))
        spread = forcing_energy - lowering
        short_energy = float(ritz_residual @ np.linalg.solve(short, ritz_residual))
        inverse_spread = first_moment * float(w @ np.linalg.solve(bmat, w))
        approximation = np.linalg.solve(bmat, forcing) - lowering / residual_norm * w

        self.assertAlmostEqual(spread, short_energy, places=13)
        self.assertAlmostEqual(spread, lowering * (inverse_spread - 1.0), places=13)
        self.assertAlmostEqual(
            spread,
            float(approximation @ bmat @ approximation),
            places=13,
        )
        self.assertGreater(spread, 0.0)

        # With u=0 and q=t, the Ritz compression has lower eigenvalue zero.
        qplus = np.block(
            [
                [np.array([[lowering]]), forcing[None, :]],
                [forcing[:, None], bmat],
            ]
        )
        ritz = np.array([[lowering, residual_norm], [residual_norm, first_moment]])
        self.assertAlmostEqual(float(np.linalg.det(ritz)), 0.0, places=14)
        ground = float(np.linalg.eigvalsh(qplus)[0])
        self.assertLess(ground, 0.0)
        ridge = -ground

        shifted = bmat + ridge * np.eye(3)
        ground_correction = np.linalg.solve(shifted, forcing)
        galerkin = residual_norm / (first_moment + ridge) * w
        error = ground_correction - galerkin
        shifted_short = (
            cblock
            + ridge * np.eye(2)
            - np.outer(cvector, cvector) / (first_moment + ridge)
        )
        chi_h = (
            residual_norm**2
            / (first_moment + ridge) ** 2
            * float(cvector @ np.linalg.solve(shifted_short, cvector))
        )

        self.assertAlmostEqual(float(w @ shifted @ error), 0.0, places=13)
        self.assertAlmostEqual(float(error @ shifted @ error), chi_h, places=13)
        self.assertAlmostEqual(
            float(forcing @ ground_correction),
            residual_norm**2 / (first_moment + ridge) + chi_h,
            places=13,
        )
        self.assertLessEqual(chi_h, spread + 1e-14)
        self.assertLessEqual(ridge, spread + 1e-14)

        # The graph-row inequality is checked with a nonaligned observation.
        observation = np.array([0.4, -1.1, 0.8])
        actual_row = abs(float(observation @ ground_correction))
        direct = lowering / residual_norm * abs(float(observation @ w))
        leverage = float(observation @ np.linalg.solve(bmat, observation))
        self.assertLessEqual(actual_row, direct + math.sqrt(spread * leverage) + 1e-14)

        # The ridged Galerkin error energy is monotone.
        prior = spread
        for hvalue in (0.01, 0.1, 0.5, 2.0):
            dh = bmat + hvalue * np.eye(3)
            zh = np.linalg.solve(dh, forcing)
            gh = residual_norm / (first_moment + hvalue) * w
            value = float((zh - gh) @ dh @ (zh - gh))
            self.assertLessEqual(value, prior + 1e-13)
            prior = value

    def test_spectral_pair_formula_has_exact_normalization(self) -> None:
        bmat = np.array(
            [
                [3.0, 0.4, 0.2],
                [0.4, 1.2, -0.1],
                [0.2, -0.1, 2.1],
            ]
        )
        w = np.array([2.0, -1.0, 3.0])
        w /= np.linalg.norm(w)
        eigenvalues, eigenvectors = np.linalg.eigh(bmat)
        weights = (eigenvectors.T @ w) ** 2
        first = float(np.dot(weights, eigenvalues))
        inverse = float(np.dot(weights, 1.0 / eigenvalues))
        double = 0.0
        for xvalue, xweight in zip(eigenvalues, weights):
            for yvalue, yweight in zip(eigenvalues, weights):
                double += (
                    xweight
                    * yweight
                    * (xvalue - yvalue) ** 2
                    / (xvalue * yvalue)
                )
        self.assertAlmostEqual(first * inverse - 1.0, double / 2.0, places=13)

    def test_n1_source_cauchy_family_requires_direct_ritz_term(self) -> None:
        responses = []
        for epsilon in (0.2, 0.05, 0.01, 0.002):
            nodes = (-1, 0, 1)
            beta = {-1: epsilon, 0: 0.0, 1: -epsilon}
            diagonal = {
                -1: 2 * epsilon**2 + epsilon,
                0: 0.0,
                1: 2 * epsilon**2 + epsilon,
            }
            qraw = source_cauchy_matrix(nodes, diagonal, beta)
            kappa = np.array([0.0, 1.0, 0.0])
            even = np.array([1.0, 0.0, 1.0]) / math.sqrt(2.0)
            odd = np.array([-1.0, 0.0, 1.0]) / math.sqrt(2.0)
            qplus = np.array(
                [
                    [kappa @ qraw @ kappa, kappa @ qraw @ even],
                    [even @ qraw @ kappa, even @ qraw @ even],
                ]
            )
            qminus = float(odd @ qraw @ odd)
            expected = np.array(
                [
                    [0.0, -math.sqrt(2.0) * epsilon],
                    [-math.sqrt(2.0) * epsilon, 2 * epsilon**2],
                ]
            )
            np.testing.assert_allclose(qplus, expected, rtol=0.0, atol=2e-15)

            lower_ritz = epsilon**2 - epsilon * math.sqrt(epsilon**2 + 2.0)
            bshift = 2 * epsilon**2 - lower_ritz
            self.assertGreater(bshift, 0.0)
            self.assertGreater(qminus - lower_ritz, 0.0)

            # The complement is scalar, so its inverse spread is exactly zero.
            forcing = -math.sqrt(2.0) * epsilon
            lowering = -lower_ritz
            self.assertAlmostEqual(lowering * bshift, forcing**2, places=14)
            chi = forcing**2 / bshift - lowering
            self.assertAlmostEqual(chi, 0.0, places=13)

            # At L=2*pi and frequency one, g_1=-sqrt(pi)e_1^+.
            response = math.sqrt(math.pi) * math.sqrt(2.0) * epsilon / bshift
            expected_response = math.sqrt(2.0 * math.pi) / (
                epsilon + math.sqrt(epsilon**2 + 2.0)
            )
            self.assertAlmostEqual(response, expected_response, places=13)
            responses.append(response)

        self.assertAlmostEqual(responses[-1], math.sqrt(math.pi), delta=0.003)
        self.assertTrue(all(y > x for x, y in zip(responses, responses[1:])))

    def test_n2_source_cauchy_family_requires_inverse_spread_term(self) -> None:
        nodes = (-2, -1, 0, 1, 2)
        kappa = np.array([0.0, 0.0, 1.0, 0.0, 0.0])
        even_one = np.array([0.0, 1.0, 0.0, 1.0, 0.0]) / math.sqrt(2.0)
        even_two = np.array([1.0, 0.0, 0.0, 0.0, 1.0]) / math.sqrt(2.0)
        odd_one = np.array([0.0, -1.0, 0.0, 1.0, 0.0]) / math.sqrt(2.0)
        odd_two = np.array([-1.0, 0.0, 0.0, 0.0, 1.0]) / math.sqrt(2.0)
        parity = np.column_stack((kappa, even_one, even_two, odd_one, odd_two))

        response_values = []
        ridge_ratios = []
        spread_products = []
        direct_bounds = []
        for delta in (0.1, 0.05, 0.025, 0.0125):
            scale = 1.0
            avalue = scale
            lowering = scale * delta**2
            epsilon = scale * delta**4
            residual_norm = (
                scale
                * delta
                * math.sqrt((16.0 + delta**4) / 17.0)
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
                -1: avalue + 4.0 * residual_norm / math.sqrt(34.0),
                0: lowering,
                1: avalue + 4.0 * residual_norm / math.sqrt(34.0),
                2: epsilon + residual_norm / math.sqrt(34.0),
            }
            qraw = source_cauchy_matrix(nodes, diagonal, beta)
            qparity = parity.T @ qraw @ parity
            qplus = qparity[:3, :3]
            qminus = qparity[3:, 3:]

            forcing = np.array(
                [
                    -4.0 * residual_norm / math.sqrt(17.0),
                    -residual_norm / math.sqrt(17.0),
                ]
            )
            bmat = np.diag([avalue, epsilon])
            expected_plus = np.block(
                [
                    [np.array([[lowering]]), forcing[None, :]],
                    [forcing[:, None], bmat],
                ]
            )
            np.testing.assert_allclose(qplus, expected_plus, rtol=2e-14, atol=2e-14)
            expected_minus = np.array(
                [
                    [
                        avalue + 8.0 * residual_norm / math.sqrt(34.0),
                        4.0 * residual_norm / math.sqrt(34.0),
                    ],
                    [
                        4.0 * residual_norm / math.sqrt(34.0),
                        epsilon + 2.0 * residual_norm / math.sqrt(34.0),
                    ],
                ]
            )
            np.testing.assert_allclose(qminus, expected_minus, rtol=2e-14, atol=2e-14)
            expected_odd_det = (
                avalue * epsilon
                + (2.0 * avalue * residual_norm + 8.0 * epsilon * residual_norm)
                / math.sqrt(34.0)
            )
            self.assertAlmostEqual(float(np.linalg.det(qminus)), expected_odd_det, places=13)
            self.assertGreater(float(np.linalg.eigvalsh(qminus)[0]), 0.0)

            w = np.array([-4.0, -1.0]) / math.sqrt(17.0)
            first_moment = float(w @ bmat @ w)
            self.assertAlmostEqual(lowering * first_moment, residual_norm**2, places=14)
            ritz = np.array([[lowering, residual_norm], [residual_norm, first_moment]])
            self.assertAlmostEqual(float(np.linalg.eigvalsh(ritz)[0]), 0.0, places=13)

            energy = float(forcing @ np.linalg.solve(bmat, forcing))
            inverse_spread = energy / lowering
            expected_spread = (
                (16.0 * avalue + epsilon)
                * (16.0 / avalue + 1.0 / epsilon)
                / 289.0
            )
            self.assertAlmostEqual(inverse_spread, expected_spread, places=8)
            chi = energy - lowering

            ground = float(np.linalg.eigvalsh(qplus)[0])
            ridge = -ground
            ridge_ratios.append(ridge / (scale * delta))
            zground = np.linalg.solve(bmat + ridge * np.eye(2), forcing)

            # At L=2*pi, frequency two is g_2=sqrt(pi)e_2^+.
            response = math.sqrt(math.pi) * zground[1]
            response_values.append(response)
            direct_bounds.append(
                lowering
                / residual_norm
                * math.sqrt(math.pi)
                * abs(w[1])
            )
            leverage = math.pi / epsilon
            spread_products.append(chi * leverage)

        self.assertAlmostEqual(ridge_ratios[-1], 4.0 / 17.0, delta=0.001)
        self.assertAlmostEqual(response_values[-1], -math.sqrt(math.pi), delta=0.008)
        self.assertLess(direct_bounds[-1], direct_bounds[0] / 7.0)
        self.assertTrue(
            all(y > 10.0 * x for x, y in zip(spread_products, spread_products[1:]))
        )

    def test_fail_closed_scope_and_hygiene(self) -> None:
        required = (
            "P0_INVALIDATED",
            "determinant-only sufficient condition",
            "bypasses the full-`L2` angle",
            "it does not prove that equation",
            "No paired\n`U_Z`-shifted sign is used",
            "e_u^*S_u^{-1}e_u",
            "chi(h)\\leq\\chi_u",
            "0\\leq h\\leq\\chi_u",
            "alpha_{\\lambda,N}^2\\chi_u\\mathcal L_\\Omega(u)",
            "frequency-one response tend to `sqrt(pi)`",
            "frequency-two response tends to\n   `-sqrt(pi)`",
            "fixed-depth source-block theorem at checkpoint 1.22",
            "strict lower-Ritz signs",
            "not a norming family",
            "a paired `U_Z` sign",
            "the Riemann\nhypothesis",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)
        self.assertNotIn("RH_PROVED", self.text)
        self.assertNotIn("LAMBDA_BOUND_PROVED", self.text)
        self.assertNotIn("DRAFT", self.text)
        self.assertNotRegex(self.text, re.compile(r"(?<!\\)\$"))
        self.assertEqual(self.text.count(r"\begin{aligned}"), self.text.count(r"\end{aligned}"))
        self.assertEqual(self.text.count("```"), 0)
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
        ast.parse(TEST.read_text(encoding="utf-8"), filename=str(TEST))

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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
