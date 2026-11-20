#!/usr/bin/env python3
"""Regressions for the growing low-prefix half-power far-cross theorem."""

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
NOTE = ROOT / "notes" / "GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md"
NOTE_HASH = "c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f"

FROZEN = {
    "notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md":
        "1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032",
    "notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md":
        "1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1",
    "notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md":
        "81bc4055b644a409c10d9d06f145040e822452dc5fc9a0fc4888c63fb535f3ab",
    "tests/test_relative_odd_gap_endpoint_schur.py":
        "cee76e8a21c3406b49bd123832a4e47bacd41ebf16622cf91c69fd48ba130127",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "tests/test_high_fourier_coercivity.py":
        "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "tests/test_block_quotient_action.py":
        "64a436a48fafbb481d7691f086ca1b49ed3fd692d90d08489a95d513df129b64",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "tests/test_growing_transition_sampling.py":
        "ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md":
        "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc",
    "tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py":
        "5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b",
    "notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md":
        "b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44",
    "tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py":
        "16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md":
        "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f",
    "tests/test_defect_relative_projection.py":
        "21b33670a9d017d363f53776ba05ca93ce3588eb049ba9dcb7e61f202bc01999",
    "notes/SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md":
        "9324d758eca900f646eb5a6187cb5f316ece99b64ec77d7da2eb72cc7c7ff4a4",
    "tests/test_same_anchor_endpoint_rate_attack.py":
        "dd63d4a84cbd8330893c11d273648435f57ee858ebd06231e7b3ad811a5712fb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class GrowingLowPrefixHalfPowerFarCrossTests(unittest.TestCase):
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

    def test_exact_source_cauchy_parity_displacement(self) -> None:
        cutoff = 8
        labels = np.arange(-cutoff, cutoff + 1, dtype=float)
        b_vector = labels / (1.0 + labels**2)
        a_vector = np.log(2.0 + np.abs(labels))
        matrix = np.empty((2 * cutoff + 1, 2 * cutoff + 1))
        for row, n_value in enumerate(labels):
            for column, m_value in enumerate(labels):
                if row == column:
                    matrix[row, column] = a_vector[row]
                else:
                    matrix[row, column] = (
                        (b_vector[row] - b_vector[column])
                        / (n_value - m_value)
                    )

        plus = np.zeros((2 * cutoff + 1, cutoff + 1))
        minus = np.zeros((2 * cutoff + 1, cutoff))
        plus[cutoff, 0] = 1.0
        for index in range(1, cutoff + 1):
            plus[cutoff + index, index] = 1.0 / math.sqrt(2.0)
            plus[cutoff - index, index] = 1.0 / math.sqrt(2.0)
            minus[cutoff + index, index - 1] = 1.0 / math.sqrt(2.0)
            minus[cutoff - index, index - 1] = -1.0 / math.sqrt(2.0)

        index_operator = np.diag(labels)
        q_plus = plus.T @ matrix @ plus
        q_minus = minus.T @ matrix @ minus
        derivative = minus.T @ index_operator @ plus
        beta = minus.T @ b_vector
        delta = np.ones(2 * cutoff + 1) @ plus
        np.testing.assert_allclose(
            derivative @ q_plus - q_minus @ derivative,
            np.outer(beta, delta),
            rtol=0,
            atol=2e-15,
        )

        rng = np.random.default_rng(2400)
        vector = rng.normal(size=cutoff + 1)
        boundary = 3
        left = (q_plus @ vector)[boundary + 1:]
        odd_right = q_minus @ (derivative @ vector) + beta * (delta @ vector)
        recovered = odd_right[boundary:] / np.arange(boundary + 1, cutoff + 1)
        np.testing.assert_allclose(left, recovered, rtol=0, atol=3e-15)

        direct_tail = np.sum(
            beta[boundary:] ** 2
            / np.arange(boundary + 1, cutoff + 1, dtype=float) ** 2
        )
        modal_tail = 2.0 * np.sum(
            b_vector[cutoff + boundary + 1:] ** 2
            / np.arange(boundary + 1, cutoff + 1, dtype=float) ** 2
        )
        self.assertAlmostEqual(float(direct_tail), float(modal_tail), places=15)

    def test_endpoint_nullity_removes_every_threshold_jump(self) -> None:
        lam = 2.5

        def source(value: float) -> float:
            if abs(value) > lam:
                return 0.0
            return (
                math.cos(math.pi * value / lam)
                + math.cos(2.0 * math.pi * value / lam)
            )

        self.assertAlmostEqual(source(lam), 0.0, places=15)
        self.assertAlmostEqual(source(-lam), 0.0, places=15)
        for sampler in range(1, math.floor(lam**2) + 1):
            threshold = lam / sampler
            jump = math.sqrt(threshold) * source(sampler * threshold)
            self.assertAlmostEqual(jump, 0.0, places=14)
        self.assertIn(
            "The source zero extension also has no endpoint delta",
            self.text,
        )
        self.assertIn(
            "A_\\lambda{\\cal L}\\widetilde f_z=A_\\lambda{\\cal L}f_z",
            self.text,
        )

    def test_exact_poisson_endpoint_formula(self) -> None:
        lam = 2.5

        def source(value: float) -> float:
            if abs(value) > lam:
                return 0.0
            return (
                math.cos(math.pi * value / lam)
                + math.cos(2.0 * math.pi * value / lam)
            )

        def cosine_transform(frequency: float, wave: int) -> float:
            source_frequency = wave * math.pi / lam
            fourier_frequency = 2.0 * math.pi * frequency
            return (
                math.sin((source_frequency - fourier_frequency) * lam)
                / (source_frequency - fourier_frequency)
                + math.sin((source_frequency + fourier_frequency) * lam)
                / (source_frequency + fourier_frequency)
            )

        def transform(frequency: float) -> float:
            return cosine_transform(frequency, 1) + cosine_transform(frequency, 2)

        source_sum = sum(
            source(index / lam)
            for index in range(1, math.floor(lam**2) + 1)
        )
        direct_endpoint = source_sum / (2.0 * math.sqrt(lam))
        transform_sum = sum(transform(index * lam) for index in range(1, 1001))
        poisson_endpoint = (
            math.sqrt(lam) * transform_sum / 2.0
            - source(0.0) / (4.0 * math.sqrt(lam))
        )
        self.assertAlmostEqual(direct_endpoint, poisson_endpoint, places=11)

    def test_finite_fourier_endpoint_error_keeps_two_signs(self) -> None:
        rng = np.random.default_rng(17)
        outer = 80
        cutoff = 19
        labels = np.arange(-outer, outer + 1)
        coefficients = (
            rng.normal(size=2 * outer + 1)
            + 1j * rng.normal(size=2 * outer + 1)
        ) / (1.0 + np.abs(labels)) ** 2
        tail = labels != 0
        endpoint_error = abs(np.sum(coefficients[np.abs(labels) > cutoff]))
        h1_norm = math.sqrt(
            float(np.sum(labels[tail] ** 2 * np.abs(coefficients[tail]) ** 2))
        )
        reciprocal_weight = math.sqrt(
            float(np.sum(1.0 / labels[np.abs(labels) > cutoff] ** 2))
        )
        self.assertLessEqual(endpoint_error, reciprocal_weight * h1_norm + 1e-14)
        self.assertLessEqual(reciprocal_weight, math.sqrt(2.0 / cutoff))
        self.assertIn("\\sqrt{2\\over N}\\,{\\mathfrak M}_Q", self.text)

    def test_positive_exponent_margin_and_all_other_factors(self) -> None:
        margin = (
            4800.0 * math.log(2.0)
            - 160.0 * math.pi * math.log(96.0) / math.log(2.0)
        )
        self.assertAlmostEqual(margin, 17.143296058960234, places=12)
        self.assertGreater(margin, 17.0)

        previous = float("inf")
        for lam in (2.5, 3.5, 4.5, 5.5):
            length = 2.0 * math.log(lam)
            log_ratio = (
                30.0 * math.log(lam + length + 2.0)
                - margin * lam**2
                - math.log(lam * math.sqrt(length))
            )
            self.assertLess(log_ratio, previous)
            previous = log_ratio
        self.assertIn("no inverse defect", self.text)
        self.assertIn("R^{-1/2}=e^{-2400(\\log2)\\lambda^2}", self.text)

    def test_quotient_polar_norm_identity_with_weighted_left_map(self) -> None:
        synthesis = np.array(
            [[2.0, 0.5], [0.0, 3.0], [1.0, -0.25], [0.0, 0.0]],
            dtype=float,
        )
        u_matrix, singular, vt_matrix = np.linalg.svd(
            synthesis, full_matrices=False
        )
        delta_inverse_sqrt = u_matrix @ np.diag(singular) @ u_matrix.T
        left_map = np.array([[1.0, -2.0, 0.5, 4.0], [-0.5, 1.0, 2.0, 0.0]])
        high_inverse_sqrt = np.diag([0.25, 0.5])
        left = np.linalg.norm(
            high_inverse_sqrt @ left_map @ delta_inverse_sqrt, 2
        )
        right = np.linalg.norm(high_inverse_sqrt @ left_map @ synthesis, 2)
        self.assertAlmostEqual(left, right, places=13)
        np.testing.assert_allclose(
            synthesis,
            u_matrix @ np.diag(singular) @ vt_matrix,
            rtol=0,
            atol=2e-15,
        )

    def test_required_identity_scale_and_scope_tokens(self) -> None:
        required = (
            "Growing low-prefix half-power far-cross theorem",
            "F\\subset {\\cal K}_L^\\perp\\cap\\operatorname {ran}P_{>R}^+",
            "A=P_{\\cal K}Q_+P_{\\cal K}|_{\\cal K}",
            "P_FAv=P_FP_{\\cal K}Q_+P_{\\cal K}v=P_FQ_+v",
            "{\\cal M}Q_+-Q_-{\\cal M}=|\\beta\\rangle\\delta",
            "2\\sum_{n=R+1}^N{|b_n|^2\\over n^2}",
            "\\|{\\cal M}V_Q\\|\\leq{\\mathfrak M}_Q",
            "\\|\\delta V_Q\\|",
            "M_{2400}",
            "o(\\lambda\\sqrt L)",
            "\\ell_Q",
            "=o(L)",
            "R_Q=Y\\ominus{\\cal K}_Q",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_no_retained_complement_strict_sign_or_rh_overclaim(self) -> None:
        required_warnings = (
            "does not control the retained complement",
            "prove a signed floor there",
            "closes only the prefix-to-far gate",
            "generalized Schur conditions",
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
        self.assertEqual(self.text.count("\\tag{4.6}"), 1)
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
