#!/usr/bin/env python3
"""Regressions for the low-prefix physical coframe/Schur barrier."""

from __future__ import annotations

import ast
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md"
)
NOTE_HASH = "1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032"

FROZEN = {
    "notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md":
        "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0",
    "tests/test_growing_low_prefix_outer_floor_assembly_theorem.py":
        "634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
    "notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md":
        "ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86",
    "tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py":
        "bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d",
    "notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md":
        "aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce",
    "tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py":
        "27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed",
    "notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md":
        "1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1",
    "notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md":
        "9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c",
    "tests/test_signed_quotient_capture.py":
        "1beba57f1ec9ef16d582dab4198da61cf90476249fd897ab68c909ece340f428",
    "notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md":
        "9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71",
    "tests/test_fixed_label_eight_arithmetic_synthesis_gain.py":
        "88c14ee4a2dfa9d2a9de33a615a4fd3601bb23e6393ca2a278ac34ba15cfc1de",
    "notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md":
        "000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932",
    "tests/test_growing_rest_signed_radical_tail_schur_reduction.py":
        "3a28e4ae33896fa14ad2f68bf8fa5de71abf49d1b62bcc8a95d6751cbd306970",
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "tests/test_block_quotient_action.py":
        "64a436a48fafbb481d7691f086ca1b49ed3fd692d90d08489a95d513df129b64",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inverse_sqrt(matrix: np.ndarray) -> np.ndarray:
    values, vectors = np.linalg.eigh(matrix)
    return vectors @ np.diag(values ** -0.5) @ vectors.T


class GrowingLowPrefixPhysicalCoframeSchurBarrierTests(unittest.TestCase):
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

    def test_exact_physical_quotient_and_forced_coframe(self) -> None:
        synthesis = np.diag([2.0, 3.0])
        physical = np.array([[5.0, 1.0], [1.0, 4.0]])
        pulled = synthesis.T @ physical @ synthesis
        floor = float(np.linalg.eigvalsh(pulled)[0])
        self.assertGreater(floor, 0.0)

        quotient = np.linalg.inv(synthesis @ synthesis.T)
        vector = np.array([1.25, -0.75])
        physical_vector = synthesis @ vector
        self.assertAlmostEqual(
            physical_vector @ quotient @ physical_vector,
            vector @ vector,
            places=14,
        )
        self.assertGreaterEqual(
            physical_vector @ physical @ physical_vector + 1e-13,
            floor * (physical_vector @ quotient @ physical_vector),
        )

        coframe_floor = floor / np.linalg.norm(physical, 2)
        self.assertGreaterEqual(
            float(np.linalg.eigvalsh(synthesis.T @ synthesis)[0]) + 1e-13,
            coframe_floor,
        )

    def test_genuine_shift_erosion_has_lambda_minus_four_scale(self) -> None:
        # U_Z=o(d_6), ||V_Q||^2=O(d_8^-1), and d_6/d_8~lambda^-4.
        previous = float("inf")
        for lam in (10.0, 20.0, 40.0, 80.0):
            ratio = lam ** -4 / math.log(lam)
            self.assertLess(ratio, previous)
            previous = ratio
        self.assertIn("u_+\\|V_Q\\|^2=o(\\lambda^{-4})", self.text)
        self.assertIn("c{L\\over\\lambda^2}I", self.text)

    def test_half_power_loss_angle_and_cross_identity(self) -> None:
        delta_q = 2.0
        a_u = 8.0
        high = 100.0
        gamma = 10.0
        loss = gamma**2 / high
        ell = loss / delta_q
        sigma_prefix = a_u * delta_q - loss
        delta_y = delta_q + (gamma / high) ** 2
        exact_angle = sigma_prefix / delta_y
        formula_angle = (a_u - ell) / (1 + ell / high)
        self.assertAlmostEqual(exact_angle, formula_angle, places=14)
        self.assertGreater(exact_angle, 0.0)

        synthesis = np.array([[2.0, 0.0], [0.0, 3.0], [0.0, 0.0]])
        u_mat, singular, vt_mat = np.linalg.svd(synthesis, full_matrices=False)
        delta_inv_sqrt = u_mat @ np.diag(singular) @ u_mat.T
        far_cross = np.array([[1.0, -2.0, 4.0]])
        left = np.linalg.norm(far_cross @ delta_inv_sqrt, 2)
        right = np.linalg.norm(far_cross @ synthesis, 2)
        self.assertAlmostEqual(left, right, places=13)
        np.testing.assert_allclose(
            synthesis,
            u_mat @ np.diag(singular) @ vt_mat,
            rtol=0,
            atol=1e-14,
        )
        self.assertEqual(
            self.text.count("\\Delta_Y=E_u^*\\Delta E_u"),
            1,
        )
        self.assertIn(
            "\\Gamma_Q=\\Gamma_ui_Q:{\\cal K}_Q\\longrightarrow F",
            self.text,
        )
        self.assertIn(
            "V_Q:{\\cal X}_Q\\longrightarrow{\\cal K}_Q",
            self.text,
        )

    def test_exact_two_by_two_cross_countermodel(self) -> None:
        a = 8
        high = 1_000_000
        tau = 1
        gamma = 3_000
        self.assertEqual(gamma**2, (a + tau) * high)
        self.assertEqual(a * high - gamma**2, -tau * high)
        self.assertEqual(a - gamma**2 / high, -tau)
        self.assertLess(gamma, 2 * high)
        self.assertAlmostEqual(gamma / high, 0.003, places=15)
        matrix = np.array([[a, gamma], [gamma, high]], dtype=float)
        eigenvalues = np.linalg.eigvalsh(matrix)
        self.assertLess(eigenvalues[0], 0.0)
        self.assertGreater(eigenvalues[1], 0.0)

    def test_untreated_retained_direction_countermodel(self) -> None:
        matrix = np.diag([8.0, -1.0, 1_000_000.0])
        self.assertEqual(matrix[0, 0], 8.0)
        self.assertEqual(matrix[2, 2], 1_000_000.0)
        self.assertEqual(float(np.linalg.eigvalsh(matrix)[0]), -1.0)
        self.assertEqual(np.linalg.norm(matrix - np.diag(np.diag(matrix))), 0.0)

    def test_generalized_schur_range_and_pseudoinverse_criterion(self) -> None:
        rest = np.diag([4.0, 0.0])
        cross = np.array([[1.0], [0.0]])
        prefix = np.array([[1.0]])
        full = np.block([[prefix, cross.T], [cross, rest]])
        short = prefix - cross.T @ np.linalg.pinv(rest) @ cross
        self.assertGreater(float(short[0, 0]), 0.0)
        self.assertGreaterEqual(float(np.linalg.eigvalsh(full)[0]), -1e-14)

        bad_cross = np.array([[1.0], [1.0]])
        bad_full = np.block([[prefix, bad_cross.T], [bad_cross, rest]])
        range_projection = rest @ np.linalg.pinv(rest)
        self.assertGreater(np.linalg.norm((np.eye(2) - range_projection) @ bad_cross), 0.0)
        self.assertLess(float(np.linalg.eigvalsh(bad_full)[0]), 0.0)

    def test_required_map_scale_and_scope_tokens(self) -> None:
        required = (
            "Growing low-prefix physical coframe and half-power Schur barrier",
            "\\widehat\\Sigma_{N,Q}^\\#=V_Q^*AV_Q",
            "P_{{\\cal K}_Q}B_uP_{{\\cal K}_Q}",
            "V_Q^*V_Q\\succeq c{L\\over\\lambda^2}I",
            "\\Delta_Q\\succeq\\Delta_{L,{\\rm full}}",
            "\\ell_Q=\\left\\|H_u^{-1/2}\\Gamma_Q",
            "o(\\lambda\\sqrt L)",
            "u_+:=\\max(u,0)\\leq U_Z",
            "H_u=H_{U_Z}+(U_Z-u)I",
            "\\|P_FB_uV_Q\\|=\\|P_FAV_Q\\|",
            "=O(\\lambda^2d_8^{-1})",
            "\\gamma^2=(a+\\tau)G",
            "R_Q=Y\\ominus{\\cal K}_Q",
            "\\operatorname {ran}C_\\theta",
            "R_\\theta^\\dagger",
            "o(\\sqrt L)",
            "Q_--uI\\succ0",
            "P0_INVALIDATED",
            "standard eight are unchanged",
            "The inputs frozen in this note do not prove (5.14)",
            "even if (5.14) is later discharged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_no_prefix_equals_y_reducing_or_strict_sign_overclaim(self) -> None:
        required_warnings = (
            "not identify \\({\\cal K}_Q\\) with the retained half-power space \\(Y\\)",
            "not make \\({\\cal K}_Q\\) reducing",
            "No onto coframe from the low prefix to \\(Y\\) is possible",
            "No frozen theorem proves \\(R_\\theta\\succeq0\\)",
            "independent open obligation",
        )
        for token in required_warnings:
            self.assertIn(token, self.text)
        forbidden = (
            "This theorem proves B_u\\succ0",
            "This theorem proves Q_--uI\\succ0",
            "This proves the Riemann hypothesis",
            "{\\cal K}_Q=Y",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

    def test_import_hygiene(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__", "ast", "hashlib", "math", "numpy", "pathlib",
                "re", "shutil", "subprocess", "tempfile", "unittest",
            },
        )

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
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
