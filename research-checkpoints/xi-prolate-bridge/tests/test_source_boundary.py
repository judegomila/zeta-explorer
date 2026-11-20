from __future__ import annotations

import sys
import unittest
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from source_boundary import source_commutator_metrics  # noqa: E402
from weil_matrix import inversion  # noqa: E402


def _source_matrix() -> tuple[mp.matrix, mp.matrix, list[int]]:
    modes = [-2, -1, 0, 1, 2]
    beta = [mp.mpf(-5), mp.mpf(-2), mp.mpf(0), mp.mpf(2), mp.mpf(5)]
    diagonal = [mp.mpf(7), mp.mpf(4), mp.mpf(1), mp.mpf(4), mp.mpf(7)]
    Q = mp.matrix(5)
    for i, n in enumerate(modes):
        for j, m in enumerate(modes):
            Q[i, j] = (
                diagonal[i]
                if i == j
                else (beta[i] - beta[j]) / (n - m)
            )
    return Q, inversion(2), modes


class SourceBoundaryTests(unittest.TestCase):
    def test_exact_cauchy_form_reconstructs_rank_two_commutator(self):
        Q, J, modes = _source_matrix()
        report = source_commutator_metrics(Q, J, modes, tol=mp.mpf("1e-30"))
        self.assertTrue(report["source_commutator_matrix_form_diagnostic_pass"])
        self.assertTrue(all(value == 0 for value in report["defects"].values()))

    def test_scalar_shift_leaves_commutator_audit_unchanged(self):
        Q, J, modes = _source_matrix()
        shifted = Q - mp.mpf("123.5") * mp.eye(Q.rows)
        before = source_commutator_metrics(Q, J, modes)
        after = source_commutator_metrics(shifted, J, modes)
        self.assertEqual(before["beta"], after["beta"])
        self.assertEqual(before["defects"], after["defects"])

    def test_inversion_commutation_alone_does_not_imply_source_form(self):
        Q, J, modes = _source_matrix()
        for i, j in ((0, 1), (1, 0), (4, 3), (3, 4)):
            Q[i, j] += mp.mpf("0.1")
        self.assertEqual(Q * J, J * Q)
        report = source_commutator_metrics(Q, J, modes, tol=mp.mpf("1e-20"))
        self.assertFalse(report["source_commutator_matrix_form_diagnostic_pass"])
        self.assertGreater(report["defects"]["source_cauchy_offdiagonal"], 0)

    def test_nonsymmetric_mode_range_is_rejected(self):
        Q, J, _ = _source_matrix()
        with self.assertRaises(ValueError):
            source_commutator_metrics(Q, J, [-2, -1, 0, 1, 3])


if __name__ == "__main__":
    unittest.main()
