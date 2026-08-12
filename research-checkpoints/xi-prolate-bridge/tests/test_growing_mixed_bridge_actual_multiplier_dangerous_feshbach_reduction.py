#!/usr/bin/env python3
"""Regressions for the actual-multiplier retained Feshbach reduction."""

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
NOTE = ROOT / "notes" / (
    "GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md"
)
NOTE_HASH = "cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e"

FROZEN = {
    "notes/GROWING_MIXED_BRIDGE_RETAINED_COMPLEMENT_TWO_STAGE_SCHUR_BARRIER.md":
        "102f69ec567803153d5648316874c8369cd558ee17cfce71f3cca2e9bb259f81",
    "tests/test_growing_mixed_bridge_retained_complement_two_stage_schur_barrier.py":
        "0613ef6cb25d6c1c7182011d7092fb42786af3a1d25244d2d0451f26f8098a15",
    "notes/GROWING_RETAINED_NEGATIVE_INDEX_CAPTURE_BARRIER.md":
        "9fc64fedde255791775861e7a3bb2b2d55eab1a3d402cf8b842d9e0d8519424c",
    "tests/test_growing_retained_negative_index_capture_barrier.py":
        "1e6067e8e4795eac284a8efc12bfc235ff7a6590efce28428b4569320257c4aa",
    "notes/PARITY_DANGEROUS_ALL_SHIFT_METRIC_ROTATION_AUDIT.md":
        "23f0a23f39cb52d6d754dc88e1ea0d779948a78edffc7e5db3ee2cb687e035ea",
    "notes/LOCKED_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md":
        "5cc71bf159432e4b651ecad4db2b1702a5288e647ce4025fcf1fb3378bd36d2c",
    "notes/ODD_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md":
        "85efc9bcb2228f0007af10943c693276b8a819fe9198bd76176d4a329574657a",
    "notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md":
        "aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce",
    "tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py":
        "27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed",
    "notes/PHASE_VOLUME_SCALE_AUDIT.md":
        "bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd",
    "notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md":
        "ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f",
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


def inertia(matrix: np.ndarray, tolerance: float = 1e-10) -> tuple[int, int, int]:
    values = np.linalg.eigvalsh(matrix)
    return (
        int(np.count_nonzero(values < -tolerance)),
        int(np.count_nonzero(np.abs(values) <= tolerance)),
        int(np.count_nonzero(values > tolerance)),
    )


class GrowingMixedBridgeActualMultiplierDangerousFeshbachTests(unittest.TestCase):
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

    def test_dangerous_projector_pulls_back_through_harmonic_lift(self) -> None:
        delta = 2.0
        dangerous_block = np.array([[-2.0, 0.3], [0.3, 0.7]])
        safe_block = np.diag([2.5, 3.0, 4.0, 5.0])
        cross = np.array([
            [0.4, -0.2],
            [-0.1, 0.3],
            [0.2, 0.1],
            [-0.3, 0.15],
        ])
        physical = np.block([
            [dangerous_block, cross.T],
            [cross, safe_block],
        ])
        projector = np.diag([1.0, 1.0, 0.0, 0.0, 0.0, 0.0])
        lift = np.array([
            [1.0, 0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
            [0.2, -0.1, 0.4, 0.3],
            [-0.2, 0.1, -0.3, 0.2],
        ])
        retained = lift.T @ physical @ lift

        dangerous_pullback = orthonormal_range(lift.T @ projector)
        self.assertEqual(dangerous_pullback.shape[1], 2)
        cap = np.array([[0.0], [0.0], [1.0], [0.0]])
        small = orthonormal_range(np.column_stack((dangerous_pullback, cap)))
        far = orthogonal_complement(small)
        self.assertEqual(small.shape[1], 3)
        self.assertEqual(far.shape[1], 1)
        np.testing.assert_allclose(projector @ lift @ far, 0.0, atol=2e-14)

        physical_safe = np.eye(6) - projector
        safe_compression = physical_safe @ physical @ physical_safe
        safe_vectors = physical_safe[:, 2:]
        self.assertGreaterEqual(
            float(np.linalg.eigvalsh(safe_vectors.T @ safe_compression @ safe_vectors)[0]),
            delta,
        )
        far_compression = far.T @ retained @ far
        far_lift_gram = far.T @ lift.T @ lift @ far
        self.assertGreaterEqual(
            float(far_compression[0, 0]),
            delta * float(far_lift_gram[0, 0]) - 2e-14,
        )
        self.assertGreaterEqual(float(far_lift_gram[0, 0]), 1.0)

        basis = np.column_stack((small, far))
        blocked = basis.T @ retained @ basis
        small_block = blocked[:3, :3]
        feedback = blocked[3:, :3]
        far_block = blocked[3:, 3:]
        feshbach = small_block - feedback.T @ np.linalg.inv(far_block) @ feedback
        full_inertia = inertia(retained)
        split_inertia = tuple(
            first + second
            for first, second in zip(inertia(feshbach), inertia(far_block))
        )
        self.assertEqual(full_inertia, split_inertia)

    def test_positive_theta_needs_safe_metric_ratio(self) -> None:
        delta = 2.0
        physical = np.diag([-1.0, 0.5, 2.5, 3.0, 4.0, 5.0])
        projector = np.diag([1.0, 1.0, 0.0, 0.0, 0.0, 0.0])
        lift = np.array([
            [1.0, 0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
            [0.2, 0.1, 0.3, -0.2],
            [0.1, -0.2, 0.4, 0.3],
        ])
        dangerous_pullback = orthonormal_range(lift.T @ projector)
        cap = np.array([[0.0], [0.0], [1.0], [0.0]])
        small = orthonormal_range(np.column_stack((dangerous_pullback, cap)))
        far = orthogonal_complement(small)
        metric = np.diag([1.0, 1.5, 1.2, 1.4, 2.0, 3.0])
        numerator = (far.T @ lift.T @ metric @ lift @ far).item()
        denominator = (far.T @ lift.T @ lift @ far).item()
        metric_ratio = numerator / denominator
        theta = 0.2
        self.assertLess(theta * metric_ratio, delta)

        retained = lift.T @ physical @ lift
        retained_metric = lift.T @ metric @ lift
        shifted = retained - theta * retained_metric
        observed_far = (far.T @ shifted @ far).item()
        lower = (delta - theta * metric_ratio) * denominator
        self.assertGreaterEqual(observed_far, lower - 2e-14)
        self.assertIn(r"\theta C_{\Delta,\mathcal F}<\delta", self.text)
        self.assertIn("automatic only at `theta=0`", self.text)

    def test_two_stage_reverse_schur_has_constant_bridge_scale(self) -> None:
        captured = np.array([[8.0, 1.0], [1.0, 6.0]])
        bridge_row = np.array([[0.4, -0.2]])
        retained_cross = np.array([[0.5, -0.1], [0.2, 0.3]])
        bridge = 1.4
        bridge_retained = np.array([[0.15], [-0.05]])
        retained = np.array([[2.0, 0.1], [0.1, 1.5]])

        captured_inverse = np.linalg.inv(captured)
        q_one = (bridge - bridge_row @ captured_inverse @ bridge_row.T).item()
        y_one = bridge_retained - retained_cross @ captured_inverse @ bridge_row.T
        r_one = retained - retained_cross @ captured_inverse @ retained_cross.T
        leverage = (y_one.T @ np.linalg.inv(r_one) @ y_one).item()
        self.assertGreater(q_one, 1.0)
        self.assertGreater(float(np.linalg.eigvalsh(r_one)[0]), 1.0)
        self.assertLess(leverage, q_one)

        full = np.block([
            [captured, bridge_row.T, retained_cross.T],
            [bridge_row, np.array([[bridge]]), bridge_retained.T],
            [retained_cross, bridge_retained, retained],
        ])
        self.assertEqual(inertia(full)[0], 0)
        self.assertEqual(inertia(full)[0], int(leverage > q_one))

        bad_bridge_retained = 20.0 * bridge_retained
        bad_y_one = (
            bad_bridge_retained
            - retained_cross @ captured_inverse @ bridge_row.T
        )
        bad_leverage = (
            bad_y_one.T @ np.linalg.inv(r_one) @ bad_y_one
        ).item()
        bad_full = np.block([
            [captured, bridge_row.T, retained_cross.T],
            [bridge_row, np.array([[bridge]]), bad_bridge_retained.T],
            [retained_cross, bad_bridge_retained, retained],
        ])
        self.assertGreater(bad_leverage, q_one)
        self.assertEqual(inertia(bad_full)[0], 1)
        self.assertIn(r"q_{1,\theta}\geq c_b=\Theta(1)", self.text)
        self.assertIn("an `O(1)` inverse response", self.text)

    def test_generalized_bridge_short_keeps_range_condition(self) -> None:
        r_one = np.diag([1.0, 0.0])
        q_one = 2.0
        good = np.array([[1.0], [0.0]])
        bad = np.array([[0.0], [1.0]])
        good_block = np.block([
            [np.array([[q_one]]), good.T],
            [good, r_one],
        ])
        bad_block = np.block([
            [np.array([[q_one]]), bad.T],
            [bad, r_one],
        ])
        self.assertEqual(inertia(good_block)[0], 0)
        self.assertEqual(inertia(bad_block)[0], 1)
        self.assertLessEqual(
            (good.T @ np.linalg.pinv(r_one) @ good).item(),
            q_one,
        )
        self.assertIn(r"\operatorname {ran}y_{1,\theta}", self.text)
        self.assertIn(r"R_{1,\theta}^{\dagger}", self.text)

    def test_paired_rank_bound_and_locked_scale(self) -> None:
        logarithmic_length = 12.0
        phase_volume = 30.0
        gap = 2.0
        even_rank = logarithmic_length * phase_volume / (2.0 * math.pi * gap)
        odd_rank = 1.0 + even_rank
        paired_rank = even_rank + odd_rank
        displayed = 1.0 + logarithmic_length * phase_volume / (math.pi * gap)
        self.assertAlmostEqual(paired_rank, displayed, places=14)

        lam = 80.0
        log_half_power = 4800.0 * math.log(2.0) * lam**2
        log_absolute_rank = 5.0 * lam
        self.assertGreater(log_half_power, 1000.0 * log_absolute_rank)
        self.assertIn(r"O(L)+\exp(O(\lambda))", self.text)
        self.assertIn(r"R-O(L)", self.text)

    def test_signed_inf_sup_and_failure_modes_are_explicit(self) -> None:
        required = (
            r"\beta_{\lambda,+}^{\rm mv}",
            r"\beta_{\lambda,-}^{\rm mv}",
            r"\mathfrak B_{\epsilon,\sigma}(u,y)",
            r"\int_0^L D_\lambda(t){d\over dt}",
            "has a plus sign",
            "endpoint `n=lambda^2` remains",
            r"\Phi_\lambda(U,g)\ll{\lambda^2\over\log\lambda}",
            "hence its rank",
            "allowance is `O(R)`",
            "magnitude-only argument cannot replace",
            r"R_{1,\theta}:=",
            "earliest unsupported positivity line",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_fail_closed_scope(self) -> None:
        required = (
            "It proves an exact cost",
            "reduction, not a sign",
            "conditional positive-`theta` reduction",
            "not a source-angle theorem",
            "It is not",
            "proved here",
            "No retained sign",
            "complete even or odd sector sign",
            "Riemann-hypothesis conclusion is",
            "proved.  The formal state remains",
            "P0_INVALIDATED",
            "standard eight\nare unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the retained sign",
            "the complete even sector is positive",
            "the complete odd sector is positive",
            "the source angle is proved",
            "This proves the Riemann hypothesis",
            "condition (4.5) is proved",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
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
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex = Path(directory) / "note.tex"
            tex.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-halt-on-error", "-interaction=nonstopmode", tex.name],
                cwd=directory,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout[-4000:])


if __name__ == "__main__":
    unittest.main()
