from __future__ import annotations

import sys
import unittest
from pathlib import Path

import mpmath as mp
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from sector_bridge import sector_refined_metrics  # noqa: E402


def metrics(
    q_matrix: np.ndarray, kappa: np.ndarray, involution: np.ndarray
) -> dict[str, object]:
    """Adapt compact NumPy fixtures to the arbitrary-precision matrix API."""
    Q = mp.matrix([[mp.mpf(str(value)) for value in row] for row in q_matrix])
    vector = mp.matrix([[mp.mpf(str(value))] for value in kappa])
    J = mp.matrix([[mp.mpf(str(value)) for value in row] for row in involution])
    return sector_refined_metrics(Q, vector, J, tol=mp.mpf("1e-12"))


class SectorRefinedBridgeTests(unittest.TestCase):
    """Finite-dimensional checks of the sector-refined residual argument."""

    def test_negative_old_odd_gap_can_still_certify_even_ground(self) -> None:
        # In the even sector, kappa and its residual span the displayed 2x2
        # block.  The odd eigenvalue lies below q, so the old gap measured from
        # q is negative, but it remains strictly above the even Ritz upper
        # bound u.  Thus the true ground state is nevertheless even.
        q_matrix = np.array(
            [
                [1.0, 0.2, 0.0],
                [0.2, 5.0, 0.0],
                [0.0, 0.0, 0.995],
            ]
        )
        kappa = np.array([1.0, 0.0, 0.0])
        involution = np.diag([1.0, 1.0, -1.0])

        report = metrics(q_matrix, kappa, involution)

        # The old theorem compresses to all of kappa^perp, including the odd
        # direction, so its complementary gap is 0.995 - q < 0 and must fail.
        old_full_complement_gap = min(5.0, 0.995) - report["q"]
        old_full_complement_pass = old_full_complement_gap > 1e-12
        self.assertLess(old_full_complement_gap, 0.0)
        self.assertFalse(old_full_complement_pass)

        old_odd_gap_from_q = report["odd_floor"] - report["q"]
        self.assertLess(old_odd_gap_from_q, 0.0)
        self.assertGreater(report["Delta_even"], 0.0)
        self.assertGreater(
            report["even_complement_floor_minus_ritz_upper"], 0.0
        )
        self.assertGreater(report["odd_floor_minus_ritz_upper"], 0.0)
        self.assertTrue(report["sector_refined_bridge_diagnostic_pass"])

        eigenvalues, eigenvectors = np.linalg.eigh(q_matrix)
        ground = eigenvectors[:, np.argmin(eigenvalues)]
        self.assertLess(np.linalg.norm(involution @ ground - ground), 1e-12)

    def test_fails_closed_when_odd_floor_is_below_ritz_upper(self) -> None:
        q_matrix = np.array(
            [
                [1.0, 0.2, 0.0],
                [0.2, 5.0, 0.0],
                [0.0, 0.0, 0.98],
            ]
        )
        kappa = np.array([1.0, 0.0, 0.0])
        involution = np.diag([1.0, 1.0, -1.0])

        report = metrics(q_matrix, kappa, involution)

        self.assertGreater(
            report["even_complement_floor_minus_ritz_upper"], 0.0
        )
        self.assertLessEqual(report["odd_floor_minus_ritz_upper"], 0.0)
        self.assertFalse(report["sector_refined_bridge_diagnostic_pass"])
        ground = np.linalg.eigh(q_matrix)[1][:, 0]
        self.assertLess(np.linalg.norm(involution @ ground + ground), 1e-12)

    def test_ritz_gap_can_pass_when_alpha_minus_q_is_nonpositive(self) -> None:
        # Here alpha=0.9 is below q=1, so Delta_even=alpha-q is negative.
        # The residual coupling lowers the even Ritz value to about 0.744,
        # leaving both alpha-u and odd_floor-u strictly positive.
        q_matrix = np.array(
            [
                [1.0, 0.2, 0.0],
                [0.2, 0.9, 0.0],
                [0.0, 0.0, 0.8],
            ]
        )
        kappa = np.array([1.0, 0.0, 0.0])
        involution = np.diag([1.0, 1.0, -1.0])

        report = metrics(q_matrix, kappa, involution)

        self.assertLessEqual(report["Delta_even"], 0.0)
        self.assertIsNone(report["r_over_Delta_even"])
        self.assertGreater(
            report["even_complement_floor_minus_ritz_upper"], 0.0
        )
        self.assertGreater(report["odd_floor_minus_ritz_upper"], 0.0)
        self.assertIsNotNone(report["r_over_even_ritz_gap"])
        self.assertTrue(report["sector_refined_bridge_diagnostic_pass"])

        eigenvalues, eigenvectors = np.linalg.eigh(q_matrix)
        ground = eigenvectors[:, np.argmin(eigenvalues)]
        self.assertLess(np.linalg.norm(involution @ ground - ground), 1e-12)

    def test_nonpositive_even_ritz_gap_fails_closed(self) -> None:
        # The residual direction sees the high even complement value 5, but a
        # separate even direction has alpha=0.5 below the Ritz upper bound.
        q_matrix = np.array(
            [
                [1.0, 0.2, 0.0, 0.0],
                [0.2, 5.0, 0.0, 0.0],
                [0.0, 0.0, 0.5, 0.0],
                [0.0, 0.0, 0.0, 2.0],
            ]
        )
        kappa = np.array([1.0, 0.0, 0.0, 0.0])
        involution = np.diag([1.0, 1.0, 1.0, -1.0])

        report = metrics(q_matrix, kappa, involution)

        self.assertLessEqual(
            report["even_complement_floor_minus_ritz_upper"], 0.0
        )
        self.assertGreater(report["odd_floor_minus_ritz_upper"], 0.0)
        self.assertIsNone(report["r_over_even_ritz_gap"])
        self.assertFalse(report["sector_refined_bridge_diagnostic_pass"])

    def test_even_ground_distance_obeys_r_over_even_gap_bound(self) -> None:
        q_matrix = np.array(
            [
                [0.0, 0.1, 0.0],
                [0.1, 4.0, 0.0],
                [0.0, 0.0, 1.0],
            ]
        )
        kappa = np.array([1.0, 0.0, 0.0])
        involution = np.diag([1.0, 1.0, -1.0])

        report = metrics(q_matrix, kappa, involution)
        self.assertTrue(report["sector_refined_bridge_diagnostic_pass"])
        gamma = (
            report["even_complement_floor"]
            - report["two_dimensional_ritz_upper_u"]
        )
        self.assertAlmostEqual(
            float(report["even_complement_floor_minus_ritz_upper"]),
            float(gamma),
            places=14,
        )
        self.assertAlmostEqual(
            float(report["r_over_even_ritz_gap"]),
            float(report["r"] / gamma),
            places=14,
        )

        ground = np.linalg.eigh(q_matrix)[1][:, 0]
        overlap = abs(np.vdot(kappa, ground))
        phase_aligned_distance = np.sqrt(max(0.0, 2.0 - 2.0 * overlap))
        self.assertLessEqual(
            phase_aligned_distance,
            report["r_over_even_ritz_gap"] + 1e-12,
        )

    def test_zero_residual_uses_u_equal_q_without_division(self) -> None:
        q_matrix = np.diag([0.0, 2.0, 0.5])
        kappa = np.array([1.0, 0.0, 0.0])
        involution = np.diag([1.0, 1.0, -1.0])

        report = metrics(q_matrix, kappa, involution)

        self.assertEqual(report["r"], 0.0)
        self.assertIsNone(report["residual_direction_rayleigh_c"])
        self.assertEqual(report["two_dimensional_ritz_upper_u"], report["q"])
        self.assertEqual(report["r_over_even_ritz_gap"], 0.0)
        self.assertEqual(
            report["even_complement_floor_minus_ritz_upper"],
            report["Delta_even"],
        )
        self.assertGreater(report["odd_floor_minus_ritz_upper"], 0.0)
        self.assertTrue(report["sector_refined_bridge_diagnostic_pass"])

    def test_zero_residual_still_requires_strict_odd_separation(self) -> None:
        q_matrix = np.diag([0.0, 2.0, 0.0])
        kappa = np.array([1.0, 0.0, 0.0])
        involution = np.diag([1.0, 1.0, -1.0])

        report = metrics(q_matrix, kappa, involution)

        self.assertEqual(report["two_dimensional_ritz_upper_u"], report["q"])
        self.assertEqual(report["odd_floor_minus_ritz_upper"], 0.0)
        self.assertFalse(report["sector_refined_bridge_diagnostic_pass"])


if __name__ == "__main__":
    unittest.main()
