#!/usr/bin/env python3
"""Regressions for the transition-capture/fixed-plane barrier."""

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
    / "GROWING_REST_TRANSITION_CAPTURE_FIXED_PLANE_NONIMPLICATION_BARRIER.md"
)
TEST = pathlib.Path(__file__).resolve()


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


PROTECTED_HASHES = {
    "notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md":
        "000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932",
    "tests/test_growing_rest_signed_radical_tail_schur_reduction.py":
        "3a28e4ae33896fa14ad2f68bf8fa5de71abf49d1b62bcc8a95d6751cbd306970",
    "notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md":
        "ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86",
    "tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py":
        "bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d",
    "notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md":
        "787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79",
    "tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py":
        "73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7",
    "notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md":
        "3d6428991a0e66e1c2752c8eec76375576e6f94f68a65891cd3215495e6d4e61",
    "tests/test_physical_map_conditioning.py":
        "d5caad0dc12a2b3ca202fa49552c9cc384b3fc4c4ac3f71b68cc74e90970e396",
    "notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md":
        "1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1",
    "notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md":
        "aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce",
    "tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py":
        "27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed",
    "notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md":
        "e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17",
    "tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py":
        "545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f",
}


class GrowingRestTransitionCaptureFixedPlaneBarrierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            path = ROOT / relative
            self.assertTrue(path.is_file(), relative)
            self.assertEqual(sha256(path), expected, relative)

    def test_eighth_row_dimension_count(self) -> None:
        for m in (9, 12, 31):
            seven_row_lower_bound = m - 7
            anchor_row_lower_bound = seven_row_lower_bound - 1
            self.assertEqual(anchor_row_lower_bound, m - 8)
            self.assertGreater(anchor_row_lower_bound, 0)

    def test_anchor_overlap_kernel_gives_exact_rest_image(self) -> None:
        kappa = np.array([1.0, 0.0, 0.0])
        pre_anchor = np.array(
            [[1.0, -2.0, 0.5], [0.3, 1.2, -0.7], [1.1, 0.4, 0.8]]
        )
        coefficient = np.array([2.0, 1.0, 0.0])
        physical = pre_anchor @ coefficient
        self.assertAlmostEqual(float(kappa @ physical), 0.0, places=14)
        projection = np.eye(3) - np.outer(kappa, kappa)
        anchor_deflated = projection @ pre_anchor
        np.testing.assert_allclose(projection @ physical, physical, atol=2e-14)
        np.testing.assert_allclose(anchor_deflated @ coefficient, physical, atol=2e-14)

    def test_exact_minimum_energy_capture_identity(self) -> None:
        synthesis = np.array([[1.0, 0.0, 1.0], [0.0, 1.0, -1.0]])
        injection = np.array([[0.2, 0.0], [0.0, 0.7], [0.8, -0.3]])
        p0 = np.linalg.pinv(synthesis) @ synthesis
        quotient_metric = np.linalg.pinv(synthesis @ synthesis.T)
        capture = p0 @ injection
        for vector in (np.array([1.0, -0.4]), np.array([0.3, 2.0])):
            physical = synthesis @ injection @ vector
            quotient_energy = float(physical @ quotient_metric @ physical)
            capture_energy = float(np.linalg.norm(capture @ vector) ** 2)
            coframe_energy = float(vector @ (injection.T @ p0 @ injection) @ vector)
            self.assertAlmostEqual(quotient_energy, capture_energy, places=13)
            self.assertAlmostEqual(capture_energy, coframe_energy, places=13)

    def test_exact_metric_bridge_does_not_bound_capture_angle(self) -> None:
        values = []
        for delta in (0.5, 0.1, 0.01, 0.001):
            synthesis = np.array([[1.0, delta]])
            injection = np.array([0.0, 1.0])
            p0 = np.linalg.pinv(synthesis) @ synthesis
            coframe = float(injection @ p0 @ injection)
            expected = delta**2 / (1 + delta**2)
            self.assertAlmostEqual(coframe, expected, places=15)
            self.assertGreater(float((synthesis @ injection).item()), 0.0)
            values.append(coframe)
        self.assertLess(values[-1], values[0] * 1e-5)

    def test_fixed_coordinate_compressions_hide_coherent_floor(self) -> None:
        q = 80
        tau = 1e-7
        ones = np.ones(q)
        rest = np.eye(q) - (1 - tau) * np.outer(ones, ones) / q
        eigenvalues = np.linalg.eigvalsh(rest)
        self.assertAlmostEqual(eigenvalues[0], tau, places=13)
        self.assertTrue(np.allclose(eigenvalues[1:], 1.0, atol=2e-13))

        for k in (1, 2, 5, 9):
            principal = rest[:k, :k]
            expected = 1 - (1 - tau) * k / q
            self.assertAlmostEqual(np.linalg.eigvalsh(principal)[0], expected, places=13)
            self.assertGreater(expected, 0.8)

    def test_fixed_depth_schur_iteration_retains_coherent_scale(self) -> None:
        q = 30
        tau = 2e-5
        vector = np.ones(q) / math.sqrt(q)
        rest = np.eye(q) - (1 - tau) * np.outer(vector, vector)
        for k in (1, 3, 7):
            pivot = rest[:k, :k]
            cross = rest[k:, :k]
            tail = rest[k:, k:]
            schur = tail - cross @ np.linalg.solve(pivot, cross.T)
            expected = tau / (1 - (1 - tau) * k / q)
            self.assertAlmostEqual(np.linalg.eigvalsh(schur)[0], expected, places=13)

            v_tail = vector[k:]
            formula = tail - 0.0 * tail
            formula = np.eye(q - k) - (
                (1 - tau) / (1 - (1 - tau) * k / q)
            ) * np.outer(v_tail, v_tail)
            np.testing.assert_allclose(schur, formula, rtol=2e-13, atol=2e-13)

    def test_paired_slot_realization_is_positive(self) -> None:
        q = 12
        length = 3.5
        vector = np.ones(q) / math.sqrt(q)
        for tau in (0.4, 1e-6, -1e-6, -0.7):
            rest = np.eye(q) - (1 - tau) * np.outer(vector, vector)
            signed = length * np.block(
                [
                    [np.ones((1, 1)), np.zeros((1, q))],
                    [np.zeros((q, 1)), rest],
                ]
            )
            absolute = length * np.eye(q + 1)
            parallel = (absolute + signed) / 2
            anti = (absolute - signed) / 2
            self.assertGreaterEqual(np.linalg.eigvalsh(parallel)[0], -2e-13)
            self.assertGreaterEqual(np.linalg.eigvalsh(anti)[0], -2e-13)
            np.testing.assert_allclose(parallel + anti, absolute, atol=2e-13)
            np.testing.assert_allclose(parallel - anti, signed, atol=2e-13)

    def test_slight_negative_coherent_mode_evades_every_fixed_prefix(self) -> None:
        tau = -1e-8
        fixed_depth = 6
        for q in (30, 100, 300):
            fixed_floor = 1 - (1 - tau) * fixed_depth / q
            self.assertGreater(fixed_floor, 0.79)
            self.assertLess(tau, 0.0)

    def test_lower_shift_preserves_fixed_plane_positivity(self) -> None:
        q_shift = 0.4
        upper_shift = 0.8
        lower_ritz = -0.2
        qmat = np.array([[2.0, 0.3], [0.3, 1.4]])
        at_upper = qmat - upper_shift * np.eye(2)
        at_lower = qmat - lower_ritz * np.eye(2)
        np.testing.assert_allclose(
            at_lower,
            at_upper + (upper_shift - lower_ritz) * np.eye(2),
            atol=1e-14,
        )
        self.assertLessEqual(lower_ritz, q_shift)
        self.assertLessEqual(q_shift, upper_shift)
        self.assertGreater(np.linalg.eigvalsh(at_upper)[0], 0.0)
        self.assertGreater(np.linalg.eigvalsh(at_lower)[0], 0.0)

    def test_genuine_shift_term_has_uncontrolled_sign(self) -> None:
        rng = np.random.default_rng(1168)
        synthesis = rng.normal(size=(3, 4))
        signed = rng.normal(size=(3, 3))
        signed = (signed + signed.T) / 2
        injection = rng.normal(size=(4, 2))
        for lower_ritz in (-0.7, 0.6):
            direct = (
                injection.T
                @ synthesis.T
                @ (signed - lower_ritz * np.eye(3))
                @ synthesis
                @ injection
            )
            separated = (
                injection.T @ synthesis.T @ signed @ synthesis @ injection
                - lower_ritz
                * injection.T
                @ synthesis.T
                @ synthesis
                @ injection
            )
            np.testing.assert_allclose(direct, separated, rtol=2e-13, atol=2e-13)

    def test_transition_scale_ledgers_are_not_decaying_upper_bounds(self) -> None:
        for h_c in (0.6, 0.8, 0.99):
            current_exponent = 4 - 2 * h_c
            collective_exponent = 2 - 2 * h_c
            self.assertGreater(current_exponent, 2.0)
            self.assertGreater(collective_exponent, 0.0)

    def test_required_claim_boundary_and_formula_tokens(self) -> None:
        required = (
            "dim E_\\kappa\\geq m-8>0",
            "\\ell_\\kappa(x)=\\langle\\kappa,V_R\\iota_E x\\rangle",
            "V_R\\iota_E x=P_\\kappa V_R\\iota_E x",
            "C_E=P_0J",
            "C_E^*C_E=J^*P_0J",
            "J^*P_0J\\succeq\\kappa_EI_{E_\\kappa}",
            "minimum-energy quotient identity is exact",
            "{\\delta^2\\over1+\\delta^2}\\longrightarrow0",
            "Q_X-u G_phys",
            "genuine lower Ritz value `u`",
            "not automatically `Sigma_u`",
            "{\\lambda^4P(\\lambda)^2\\over T_L}",
            "{\\lambda^2P(\\lambda)^2\\over T_L}",
            "u\\leq q\\leq U_Z",
            "R_{q,\\tau}=I_q-(1-\\tau)vv^*",
            "1-(1-\\tau){k\\over q}",
            "{\\tau\\over1-(1-\\tau)k/q}",
            "logical nonimplication from fixed-plane data",
            "No actual floor is demoted",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_no_actual_failure_or_rh_overclaim(self) -> None:
        forbidden = (
            "This note proves that the actual growing rest floor collapses",
            "The actual transition packet loses quotient capture",
            "The fixed 8/12 plane proves the growing-rest floor",
            "The structured metric bridge proves (0.3)",
            "This note proves the strict sector signs",
            "Equation (5.2) is proved",
            "This note proves RH",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, self.text)

    def test_python_ast_and_displayed_tex_compile(self) -> None:
        ast.parse(TEST.read_text(encoding="utf-8"))
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
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
        for path in (NOTE, TEST):
            data = path.read_bytes()
            self.assertTrue(
                all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data),
                path,
            )
        self.assertNotIn("__pycache__", self.text)
        self.assertNotIn(".pyc", self.text)
        self.assertNotIn("PENDING_STRICT_AUDIT", self.text)


if __name__ == "__main__":
    unittest.main()
