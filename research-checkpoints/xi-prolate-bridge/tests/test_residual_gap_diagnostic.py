from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from residual_gap_diagnostic import analyze  # noqa: E402


class ResidualGapDiagnosticTests(unittest.TestCase):
    def test_exact_comparison_eigenvector(self) -> None:
        q_matrix = np.diag([0.0, 2.0, 3.0])
        report = analyze(
            {"Q": q_matrix, "kappa": np.array([1.0, 0.0, 0.0])}, 1e-12
        )
        self.assertEqual(report["residual_r"], 0.0)
        self.assertAlmostEqual(report["complement_gap_Delta"], 2.0)
        self.assertTrue(report["complement_gap_diagnostic_pass"])

    def test_nonzero_residual_obeys_bound(self) -> None:
        q_matrix = np.array([[0.0, 0.1], [0.1, 2.0]])
        report = analyze(
            {"Q": q_matrix, "kappa": np.array([1.0, 0.0])}, 1e-12
        )
        self.assertAlmostEqual(report["residual_r"], 0.1)
        self.assertAlmostEqual(report["complement_gap_Delta"], 2.0)
        self.assertLessEqual(
            report["observed_projective_distance"],
            report["theorem_distance_bound"] + 1e-12,
        )

    def test_nonpositive_complement_gap_fails_closed(self) -> None:
        q_matrix = np.diag([1.0, 0.0])
        report = analyze(
            {"Q": q_matrix, "kappa": np.array([1.0, 0.0])}, 1e-12
        )
        self.assertFalse(report["complement_gap_diagnostic_pass"])
        self.assertIsNone(report["theorem_distance_bound"])

    def test_nonhermitian_matrix_rejected(self) -> None:
        with self.assertRaises(ValueError):
            analyze(
                {
                    "Q": np.array([[0.0, 1.0], [0.0, 0.0]]),
                    "kappa": np.array([1.0, 0.0]),
                },
                1e-12,
            )

    def test_boundary_reserve(self) -> None:
        q_matrix = np.array([[0.0, 0.01], [0.01, 2.0]])
        report = analyze(
            {
                "Q": q_matrix,
                "kappa": np.array([1.0, 0.0]),
                "delta": np.array([1.0, 0.0]),
                "J": np.eye(2),
            },
            1e-12,
        )
        self.assertTrue(report["boundary_condition_pass"])
        self.assertTrue(report["generic_boundary_bridge_diagnostic_pass"])

    def test_complex_comparison_vector_uses_hermitian_complement(self) -> None:
        kappa = np.array([1.0, 1.0j]) / np.sqrt(2.0)
        orthogonal = np.array([1.0, -1.0j]) / np.sqrt(2.0)
        basis = np.column_stack([kappa, orthogonal])
        q_matrix = basis @ np.diag([0.0, 3.0]) @ basis.conj().T
        report = analyze({"Q": q_matrix, "kappa": kappa}, 1e-12)
        self.assertLess(report["residual_r"], 1e-12)
        self.assertAlmostEqual(report["complement_gap_Delta"], 3.0)

    def test_bad_involution_cannot_pass_theorem_hypotheses(self) -> None:
        report = analyze(
            {
                "Q": np.diag([0.0, 2.0]),
                "kappa": np.array([1.0, 0.0]),
                "J": np.array([[1.0, 0.0], [0.0, 100.0]]),
                "delta": np.array([1.0, 0.0]),
            },
            1e-12,
        )
        self.assertTrue(report["complement_gap_diagnostic_pass"])
        self.assertFalse(report["theorem2_hypotheses_diagnostic_pass"])
        self.assertFalse(report["generic_boundary_bridge_diagnostic_pass"])

    def test_nonpositive_gap_with_boundary_serializes_as_null(self) -> None:
        report = analyze(
            {
                "Q": np.diag([1.0, 0.0]),
                "kappa": np.array([1.0, 0.0]),
                "J": np.eye(2),
                "delta": np.array([1.0, 0.0]),
            },
            1e-12,
        )
        self.assertIsNone(report["boundary_reserve"])
        self.assertFalse(report["generic_boundary_bridge_diagnostic_pass"])

    def test_one_dimensional_input_rejected(self) -> None:
        with self.assertRaises(ValueError):
            analyze({"Q": np.array([[0.0]]), "kappa": np.array([1.0])}, 1e-12)

    def test_nonpositive_tolerance_rejected(self) -> None:
        with self.assertRaises(ValueError):
            analyze(
                {"Q": np.diag([0.0, 1.0]), "kappa": np.array([1.0, 0.0])},
                0.0,
            )


if __name__ == "__main__":
    unittest.main()
