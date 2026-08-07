from __future__ import annotations

import sys
import unittest
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "verifier"))

from independent_replay import sector_metrics  # noqa: E402


def _matrix(rows: list[list[str | int | float]]) -> mp.matrix:
    return mp.matrix([[mp.mpf(str(value)) for value in row] for row in rows])


def _native_fixture(
    even_block: list[list[str | int | float]],
    odd_values: list[str | int | float],
) -> tuple[mp.matrix, mp.matrix, int]:
    """Embed parity blocks in the verifier's modes ``-N,...,N`` basis."""
    N = len(odd_values)
    if len(even_block) != N + 1:
        raise ValueError("even and odd dimensions do not define a 2N+1 fixture")
    d = 2 * N + 1
    plus = mp.matrix(d, N + 1)
    minus = mp.matrix(d, N)
    plus[N, 0] = 1
    for n in range(1, N + 1):
        plus[N - n, n] = plus[N + n, n] = 1 / mp.sqrt(2)
        minus[N + n, n - 1] = 1 / mp.sqrt(2)
        minus[N - n, n - 1] = -1 / mp.sqrt(2)
    odd = mp.matrix(N)
    for i, value in enumerate(odd_values):
        odd[i, i] = mp.mpf(str(value))
    Q = plus * _matrix(even_block) * plus.T + minus * odd * minus.T
    return Q, plus[:, 0], N


class WeightedSectorBridgeTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 80

    def test_tau_is_bounded_by_uniform_residual_gap_ratio(self) -> None:
        Q, kappa, N = _native_fixture(
            [["0", "0.3", "0.4"], ["0.3", "2", "0.2"], ["0.4", "0.2", "8"]],
            ["1", "3"],
        )

        report = sector_metrics(Q, kappa, N)

        self.assertTrue(report["sector_refined_bridge_diagnostic_pass"])
        self.assertTrue(report["resolvent_weighted_bound_diagnostic_pass"])
        self.assertTrue(report["resolvent_tau_le_r_over_Gamma"])
        self.assertLessEqual(
            report["resolvent_weighted_tau"],
            report["resolvent_comparison_r_over_Gamma"] + mp.mpf("1e-60"),
        )
        self.assertLessEqual(report["resolvent_tau_le_r_over_Gamma_defect"], mp.mpf("1e-60"))
        self.assertLessEqual(report["resolvent_rhs_norm_minus_r_abs"], mp.mpf("1e-60"))
        self.assertLessEqual(report["resolvent_solve_residual_norm"], mp.mpf("1e-60"))

    def test_one_dimensional_complement_attains_uniform_bound(self) -> None:
        Q, kappa, N = _native_fixture(
            [["0", "0.25"], ["0.25", "4"]],
            ["1"],
        )

        report = sector_metrics(Q, kappa, N)

        self.assertTrue(report["resolvent_weighted_bound_diagnostic_pass"])
        self.assertTrue(
            mp.almosteq(
                report["resolvent_weighted_tau"],
                report["resolvent_comparison_r_over_Gamma"],
                rel_eps=mp.mpf("1e-70"),
                abs_eps=mp.mpf("1e-70"),
            )
        )

    def test_high_energy_residual_makes_tau_dramatically_sharper(self) -> None:
        # The low complement direction fixes alpha=1 but carries no residual.
        # All of b lies in the energy-100 direction, which the weighted
        # resolvent discounts instead of charging at the worst spectral gap.
        Q, kappa, N = _native_fixture(
            [["0", "0", "1"], ["0", "1", "0"], ["1", "0", "100"]],
            ["0.5", "0.75"],
        )

        report = sector_metrics(Q, kappa, N)
        tau = report["resolvent_weighted_tau"]
        uniform = report["resolvent_comparison_r_over_Gamma"]

        self.assertTrue(report["resolvent_weighted_bound_diagnostic_pass"])
        self.assertLess(tau, uniform / 50)

        eigenvalues, eigenvectors = mp.eigsy(Q)
        ground = eigenvectors[:, 0]
        overlap = abs((kappa.T * ground)[0])
        true_phase_aligned_distance = mp.sqrt(max(mp.mpf(0), 2 - 2 * overlap))
        chordal_bound = report["resolvent_weighted_chordal_distance_bound"]
        self.assertTrue(
            mp.almosteq(
                chordal_bound,
                mp.sqrt(2 - 2 / mp.sqrt(1 + tau**2)),
                rel_eps=mp.mpf("1e-70"),
                abs_eps=mp.mpf("1e-70"),
            )
        )
        self.assertLessEqual(true_phase_aligned_distance, tau + mp.mpf("1e-60"))
        self.assertLessEqual(true_phase_aligned_distance, chordal_bound + mp.mpf("1e-60"))
        self.assertLess(eigenvalues[0], report["two_dimensional_ritz_upper_u"] + mp.mpf("1e-60"))

    def test_nonpositive_alpha_minus_u_fails_closed(self) -> None:
        Q, kappa, N = _native_fixture(
            [["1", "0.2", "0"], ["0.2", "5", "0"], ["0", "0", "0.5"]],
            ["2", "3"],
        )

        report = sector_metrics(Q, kappa, N)

        self.assertLessEqual(report["resolvent_Gamma"], 0)
        self.assertIsNone(report["resolvent_weighted_tau"])
        self.assertIsNone(report["resolvent_weighted_chordal_distance_bound"])
        self.assertIsNone(report["resolvent_comparison_r_over_Gamma"])
        self.assertIsNone(report["resolvent_tau_minus_r_over_Gamma"])
        self.assertIsNone(report["resolvent_tau_le_r_over_Gamma_defect"])
        self.assertIsNone(report["resolvent_solve_residual_norm"])
        self.assertFalse(report["resolvent_tau_le_r_over_Gamma"])
        self.assertFalse(report["sector_refined_bridge_diagnostic_pass"])
        self.assertFalse(report["resolvent_weighted_bound_diagnostic_pass"])

    def test_alpha_equal_u_fails_closed_without_attempting_a_solve(self) -> None:
        Q, kappa, N = _native_fixture(
            [["0", "0"], ["0", "0"]],
            ["1"],
        )

        report = sector_metrics(Q, kappa, N)

        self.assertEqual(report["resolvent_Gamma"], 0)
        self.assertIsNone(report["resolvent_weighted_tau"])
        self.assertIsNone(report["resolvent_solve_residual_norm"])
        self.assertFalse(report["resolvent_weighted_bound_diagnostic_pass"])

    def test_odd_floor_below_u_still_fails_weighted_sector_pass(self) -> None:
        Q, kappa, N = _native_fixture(
            [["1", "0.2"], ["0.2", "5"]],
            ["0.98"],
        )

        report = sector_metrics(Q, kappa, N)

        self.assertGreater(report["resolvent_Gamma"], 0)
        self.assertIsNotNone(report["resolvent_weighted_tau"])
        self.assertTrue(report["resolvent_tau_le_r_over_Gamma"])
        self.assertLessEqual(report["odd_floor_minus_ritz_upper"], 0)
        self.assertFalse(report["sector_refined_bridge_diagnostic_pass"])
        self.assertFalse(report["resolvent_weighted_bound_diagnostic_pass"])

    def test_odd_floor_equal_u_is_not_strict_separation(self) -> None:
        Q, kappa, N = _native_fixture(
            [["0", "0"], ["0", "2"]],
            ["0"],
        )

        report = sector_metrics(Q, kappa, N)

        self.assertEqual(report["odd_floor_minus_ritz_upper"], 0)
        self.assertEqual(report["resolvent_weighted_tau"], 0)
        self.assertTrue(report["resolvent_tau_le_r_over_Gamma"])
        self.assertFalse(report["sector_refined_bridge_diagnostic_pass"])
        self.assertFalse(report["resolvent_weighted_bound_diagnostic_pass"])


if __name__ == "__main__":
    unittest.main()
