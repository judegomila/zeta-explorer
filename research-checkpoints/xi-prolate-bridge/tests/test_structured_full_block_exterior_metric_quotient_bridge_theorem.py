#!/usr/bin/env python3
"""Regressions for the structured full/block exterior-metric bridge."""

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
NOTE = (
    ROOT
    / "notes"
    / "STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md"
)


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def hermitian_sqrt(matrix: np.ndarray) -> np.ndarray:
    values, vectors = np.linalg.eigh(matrix)
    return (vectors * np.sqrt(values)) @ vectors.conj().T


def hermitian_invsqrt(matrix: np.ndarray) -> np.ndarray:
    values, vectors = np.linalg.eigh(matrix)
    return (vectors * (1.0 / np.sqrt(values))) @ vectors.conj().T


def minimum_eigenvalue(matrix: np.ndarray) -> float:
    hermitian = (matrix + matrix.conj().T) / 2
    return float(np.linalg.eigvalsh(hermitian)[0])


class StructuredFullBlockExteriorMetricBridgeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        expected = {
            "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md": "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
            "tests/test_block_quotient_action.py": "64a436a48fafbb481d7691f086ca1b49ed3fd692d90d08489a95d513df129b64",
            "notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md": "93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329",
            "tests/test_low_block_forcing_rate_full_metric_barrier.py": "9b461a01e5025c874ced03d00f56b1915be05e05396759c75d301fe7c6ed4fbb",
            "notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md": "9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71",
            "tests/test_fixed_label_eight_arithmetic_synthesis_gain.py": "88c14ee4a2dfa9d2a9de33a615a4fd3601bb23e6393ca2a278ac34ba15cfc1de",
            "notes/TRANSITION_PROLATE_OUTER_THEOREM.md": "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
            "tests/test_transition_prolate_outer.py": "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
            "notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md": "c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b",
            "tests/test_fixed_even_endpoint_null_volterra_pnt_correlation_barrier.py": "195f71b516553b18bccd0ed9b873191abf463b6f72c79f2c4418f041f3f1bd73",
            "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md": "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
            "tests/test_growing_transition_complete_central_form_reduction.py": "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
        }
        for relative, digest in expected.items():
            path = ROOT / relative
            self.assertTrue(path.is_file(), relative)
            self.assertEqual(sha256(path), digest, relative)

    def test_rank_one_leverage_and_uniform_bridge(self) -> None:
        rng = np.random.default_rng(1701)
        q = 7
        d4 = 0.07
        d0 = 0.013
        d8 = 0.31
        diagonal = np.diag(np.linspace(0.4, 1.1, q))
        alpha_r = rng.normal(size=q) + 1j * rng.normal(size=q)
        b_r = rng.normal(size=q) + 1j * rng.normal(size=q)
        alpha8 = 0.6 - 0.4j
        b8 = -0.3 + 0.2j
        dr = (
            diagonal
            + d4 * np.outer(alpha_r, alpha_r.conj())
            + d0 * np.outer(b_r, b_r.conj())
        )
        d8_full = d8 + d4 * abs(alpha8) ** 2 + d0 * abs(b8) ** 2
        krow = (
            d4 * alpha8 * alpha_r.conj()
            + d0 * b8 * b_r.conj()
        )[None, :]

        leverage_alpha = d4 * np.vdot(alpha_r, np.linalg.solve(dr, alpha_r)).real
        leverage_b = d0 * np.vdot(b_r, np.linalg.solve(dr, b_r)).real
        self.assertLessEqual(leverage_alpha, 1.0 + 1e-12)
        self.assertLessEqual(leverage_b, 1.0 + 1e-12)

        e = krow @ hermitian_invsqrt(dr) / math.sqrt(d8_full)
        epsilon = float(np.linalg.norm(e, 2))
        bound = abs(alpha8) * math.sqrt(d4 / d8_full) + abs(b8) * math.sqrt(
            d0 / d8_full
        )
        self.assertLessEqual(epsilon, bound + 1e-13)

    def test_exact_factorization_loewner_and_inverse_orders(self) -> None:
        rng = np.random.default_rng(117)
        q = 5
        dr_seed = rng.normal(size=(q, q))
        dr = dr_seed.T @ dr_seed + 2.0 * np.eye(q)
        d8 = 1.7
        e = (rng.normal(size=q) / 25.0)[None, :]
        krow = math.sqrt(d8) * e @ hermitian_sqrt(dr)
        dblock = np.zeros((q + 1, q + 1))
        dblock[0, 0] = d8
        dblock[1:, 1:] = dr
        dfull = dblock.copy()
        dfull[0, 1:] = krow
        dfull[1:, 0] = krow.conj().T[:, 0]

        block_sqrt = hermitian_sqrt(dblock)
        identity = np.eye(q + 1)
        normalized = identity.copy()
        normalized[0, 1:] = e
        normalized[1:, 0] = e.conj().T[:, 0]
        np.testing.assert_allclose(dfull, block_sqrt @ normalized @ block_sqrt)

        epsilon = float(np.linalg.norm(e, 2))
        self.assertGreaterEqual(
            minimum_eigenvalue(dfull - (1 - epsilon) * dblock), -2e-13
        )
        self.assertGreaterEqual(
            minimum_eigenvalue((1 + epsilon) * dblock - dfull), -2e-13
        )
        full_inverse = np.linalg.inv(dfull)
        block_inverse = np.linalg.inv(dblock)
        self.assertGreaterEqual(
            minimum_eigenvalue(
                full_inverse - block_inverse / (1 + epsilon)
            ),
            -2e-13,
        )
        self.assertGreaterEqual(
            minimum_eigenvalue(
                block_inverse / (1 - epsilon) - full_inverse
            ),
            -2e-13,
        )

    def test_physical_quotient_and_metric_orders_on_common_range(self) -> None:
        rng = np.random.default_rng(417)
        source_dimension = 6
        physical_dimension = 4
        dseed = rng.normal(size=(source_dimension, source_dimension))
        dblock = dseed.T @ dseed + 3.0 * np.eye(source_dimension)
        block_sqrt = hermitian_sqrt(dblock)
        e = (rng.normal(size=source_dimension - 1) / 30.0)[None, :]
        normalized = np.eye(source_dimension)
        normalized[0, 1:] = e
        normalized[1:, 0] = e.T[:, 0]
        dfull = block_sqrt @ normalized @ block_sqrt
        epsilon = float(np.linalg.norm(e, 2))

        wtop = rng.normal(size=(physical_dimension - 1, source_dimension))
        w = np.vstack([wtop, wtop[0] - 2 * wtop[1]])
        rblock = w @ np.linalg.inv(dblock) @ w.T
        rfull = w @ np.linalg.inv(dfull) @ w.T
        self.assertGreaterEqual(
            minimum_eigenvalue(rfull - rblock / (1 + epsilon)), -2e-12
        )
        self.assertGreaterEqual(
            minimum_eigenvalue(rblock / (1 - epsilon) - rfull), -2e-12
        )

        delta_block = np.linalg.pinv(rblock)
        delta_full = np.linalg.pinv(rfull)
        self.assertGreaterEqual(
            minimum_eigenvalue(delta_full - (1 - epsilon) * delta_block),
            -2e-11,
        )
        self.assertGreaterEqual(
            minimum_eigenvalue((1 + epsilon) * delta_block - delta_full),
            -2e-11,
        )

    def test_exact_inverse_blocks_control_complete_sampling_action(self) -> None:
        rng = np.random.default_rng(517)
        physical = 5
        rest = 4
        sampling = 3
        a8 = rng.normal(size=(physical, 1))
        ar = rng.normal(size=(physical, rest))
        sample = rng.normal(size=(sampling, physical))
        e = (rng.normal(size=rest) / 20.0)[None, :]
        epsilon = float(np.linalg.norm(e, 2))
        normalized = np.eye(rest + 1)
        normalized[0, 1:] = e
        normalized[1:, 0] = e.T[:, 0]
        inverse = np.linalg.inv(normalized)
        synthesis = np.hstack([a8, ar])
        rfull = synthesis @ inverse @ synthesis.T

        c8 = float(np.linalg.norm(sample @ a8, 2) ** 2)
        cr = float(np.linalg.norm(sample @ ar, 2) ** 2)
        m8 = float(np.linalg.norm(a8, 2) ** 2)
        mr = float(np.linalg.norm(ar, 2) ** 2)
        envelope = (
            math.sqrt(c8 * m8)
            + math.sqrt(cr * mr)
            + epsilon * (math.sqrt(c8 * mr) + math.sqrt(cr * m8))
        ) / (1 - epsilon**2)
        self.assertLessEqual(np.linalg.norm(sample @ rfull, 2), envelope + 1e-12)

        top = np.array([[1.0]]) - e @ e.T
        bottom = np.eye(rest) - e.T @ e
        inverse_formula = np.block(
            [
                [np.linalg.inv(top), -e @ np.linalg.inv(bottom)],
                [-np.linalg.inv(bottom) @ e.T, np.linalg.inv(bottom)],
            ]
        )
        np.testing.assert_allclose(inverse, inverse_formula, rtol=2e-13, atol=2e-13)

    def test_locked_ratios_give_lambda_minus_four(self) -> None:
        c4 = 105 / (4096 * math.pi**4)
        c0 = 315 / (2**25 * math.pi**8)
        expected4 = math.sqrt(105) / (64 * math.pi**2)
        expected0 = math.sqrt(315) / (4096 * math.sqrt(2) * math.pi**4)
        self.assertAlmostEqual(math.sqrt(c4), expected4, places=16)
        self.assertAlmostEqual(math.sqrt(c0), expected0, places=16)

        scaled = []
        for lam in (20.5, 50.5, 100.5):
            d8 = 1.0
            d4 = c4 * lam ** (-8)
            d0 = c0 * lam ** (-16)
            alpha8 = 0.7
            b8 = 0.4
            d8_full = d8 + d4 * alpha8**2 + d0 * b8**2
            bound = abs(alpha8) * math.sqrt(d4 / d8_full) + abs(b8) * math.sqrt(
                d0 / d8_full
            )
            scaled.append(bound * lam**4)
        self.assertLess(abs(scaled[-1] - abs(0.7) * expected4), 1e-10)
        self.assertEqual(-4 + (3 - 0) / 2, -2.5)
        self.assertEqual(-4 + (1 - 2) / 2, -4.5)

    def test_endpoint_shear_preserves_full_quotient_and_riesz_norm(self) -> None:
        rng = np.random.default_rng(617)
        source = 5
        physical = 3
        seed = rng.normal(size=(source, source))
        metric = seed.T @ seed + 2.0 * np.eye(source)
        synthesis = rng.normal(size=(physical, source))
        endpoint = rng.normal(size=(1, source))
        endpoint[0, 0] = 1.3
        gamma = endpoint[0, 1:] / endpoint[0, 0]
        shear = np.eye(source)
        shear[0, 1:] = -gamma

        sheared_metric = shear.T @ metric @ shear
        sheared_synthesis = synthesis @ shear
        sheared_endpoint = endpoint @ shear
        np.testing.assert_allclose(sheared_endpoint[0, 1:], 0.0, atol=1e-14)

        quotient = synthesis @ np.linalg.inv(metric) @ synthesis.T
        sheared_quotient = (
            sheared_synthesis
            @ np.linalg.inv(sheared_metric)
            @ sheared_synthesis.T
        )
        np.testing.assert_allclose(quotient, sheared_quotient, rtol=2e-13, atol=2e-13)
        riesz = (endpoint @ np.linalg.inv(metric) @ endpoint.T).item()
        sheared_riesz = (
            sheared_endpoint @ np.linalg.inv(sheared_metric) @ sheared_endpoint.T
        ).item()
        self.assertAlmostEqual(riesz, sheared_riesz, places=12)

    def test_q_amplification_reappears_in_anchor_schur_denominator(self) -> None:
        for q in (1, 4, 16, 64):
            block = np.eye(q + 1)
            endpoint = np.ones((1, q + 1))
            gamma = np.ones(q)
            shear = np.eye(q + 1)
            shear[0, 1:] = -gamma
            pulled = shear.T @ block @ shear
            pulled_rest = pulled[1:, 1:]
            cross = pulled[0:1, 1:]
            schur = pulled[0, 0] - (
                cross @ np.linalg.solve(pulled_rest, cross.T)
            ).item()
            self.assertAlmostEqual(schur, 1 / (q + 1), places=13)

            sheared_endpoint = endpoint @ shear
            self.assertTrue(np.allclose(sheared_endpoint, np.r_[1.0, np.zeros(q)][None, :]))
            riesz = (endpoint @ endpoint.T).item()
            sheared_riesz = (
                sheared_endpoint @ np.linalg.solve(pulled, sheared_endpoint.T)
            ).item()
            self.assertAlmostEqual(riesz, q + 1, places=13)
            self.assertAlmostEqual(sheared_riesz, q + 1, places=12)

            relative = shear
            expected_norm = (math.sqrt(q + 4) + math.sqrt(q)) / 2
            self.assertAlmostEqual(np.linalg.norm(relative, 2), expected_norm, places=12)

    def test_required_scope_and_formula_tokens(self) -> None:
        required = (
            "positive rank-one leverage",
            "d_4\\alpha _R^*D_R^{-1}\\alpha _R\\leq1",
            "|\\alpha _8|\\sqrt{d_4/D_8}",
            "=O(\\lambda^{-4})",
            "(1-\\varepsilon_L)D_{\\rm block}",
            "{1\\over1+\\varepsilon_L}D_{\\rm block}^{-1}",
            "R_{\\rm full}=WD_{\\rm full}^{-1}W^*=AM^{-1}A^*",
            "(1-\\varepsilon_L)\\Delta_{\\rm block}",
            "\\sqrt{C_8M_R}+\\sqrt{C_RM_8}",
            "\\Gamma_{\\rm full}(\\Delta_{\\rm full})",
            "O\\!\\left({\\lambda P(\\lambda)\\over d_8}\\right)",
            "W^\\#(D_i^\\#)^{-1}(W^\\#)^*=WD_i^{-1}W^*",
            "endpoint Riesz norm is likewise invariant",
            "2592\\pi^2\\lambda(q_R+2)",
            "(1296\\pi+o(1))(q_R+2)",
            "{D_8\\over1+\\|\\zeta\\|^2}",
            "(7.7) is an upper bound",
            "\\|\\zeta\\|^2=q",
            "not a claim that the actual prolate endpoint row saturates",
            "O(q_RM_8)=O(\\lambda^2d_8^{-1})",
            "no sampling cancellation",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_no_signed_floor_or_generic_metric_overclaim(self) -> None:
        forbidden = (
            "Every positive two-block metric obeys (0.2)",
            "The endpoint shear lowers the sampling action",
            "The endpoint Riesz norm becomes |ell_8|^2/D_8",
            "This theorem proves the signed low floor",
            "Equation (5.2) is proved",
            "This theorem proves RH",
            "Gamma_full/Gamma_block tends to one",
            "the actual prolate shear is unbounded",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, self.text)

    def test_displayed_tex_compiles(self) -> None:
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
        self.assertNotIn(",qquad", self.text)


if __name__ == "__main__":
    unittest.main()
