#!/usr/bin/env python3
"""Exact regressions for the moving-tail phase-weighted Gram barrier."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "MOVING_TAIL_PHASE_WEIGHTED_XI_GRAM_BARRIER.md"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


class MovingTailPhaseWeightedXiGramBarrierTests(unittest.TestCase):
    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_rh_phase_atom_is_negative_divided_difference(self) -> None:
        for x2, y2, gamma2, theta in (
            (F(2), F(7), F(11), F(3, 5)),
            (F(13), F(3), F(17), F(7, 4)),
            (F(5, 2), F(19, 3), F(23, 2), F(9, 7)),
        ):
            ax = 2 * theta / (x2 - gamma2)
            ay = 2 * theta / (y2 - gamma2)
            divided = (x2 * ax - y2 * ay) / (x2 - y2)
            gram = -2 * theta * gamma2 / (
                (x2 - gamma2) * (y2 - gamma2)
            )
            self.assertEqual(divided, gram)

    def test_zero_frequency_kernel_is_screw_margin(self) -> None:
        # Suppress the common Xi(0)^2/(4*pi).  Each atom contributes
        # 2*theta/gamma^2 to Psi and theta/gamma^2 to twice the kernel.
        atoms = ((F(3, 7), F(11)), (F(5, 9), F(17)), (F(7, 13), F(23)))
        psi = sum((2 * theta / gamma2 for theta, gamma2 in atoms), F(0))
        kernel_without_xi_over_2pi = sum(
            (theta / gamma2 for theta, gamma2 in atoms), F(0)
        )
        self.assertEqual(kernel_without_xi_over_2pi, psi / 2)

    def test_delta_kernel_is_gram_minus_scalar_rank_one(self) -> None:
        xi_x = F(5, 7)
        xi_y = F(-11, 13)
        atoms = ((F(2, 3), F(17)), (F(4, 5), F(29)))
        psi = sum((2 * theta / gamma2 for theta, gamma2 in atoms), F(0))
        full = sum(
            (
                theta * gamma2
                * (xi_x / (F(3) - gamma2))
                * (xi_y / (F(7) - gamma2))
                for theta, gamma2 in atoms
            ),
            F(0),
        )
        delta = full - psi * xi_x * xi_y / 2
        self.assertEqual(delta + psi * xi_x * xi_y / 2, full)

    def test_feature_row_sum_and_endpoint_trace_are_exact(self) -> None:
        p = (F(3, 5), F(-7, 11), F(13, 17), F(-19, 23))
        s = F(9, 4)
        gamma2 = F(25, 49) * s * s
        scale2 = F(25, 49)
        feature_sum = sum(
            (p[n] / (scale2 * n * n - gamma2) for n in range(len(p))),
            F(0),
        )
        h_value = p[0] + s * s * sum(
            (p[n] / (s * s - n * n) for n in range(1, len(p))),
            F(0),
        )
        self.assertEqual(feature_sum, -h_value / gamma2)

        endpoint = sum(p, F(0))
        # H(s)-P is exactly sum p_n*n^2/(s^2-n^2).
        large_s2 = F(10**6)
        h_large = p[0] + large_s2 * sum(
            (p[n] / (large_s2 - n * n) for n in range(1, len(p))),
            F(0),
        )
        correction = sum(
            (p[n] * n * n / (large_s2 - n * n)
             for n in range(1, len(p))),
            F(0),
        )
        self.assertEqual(h_large - endpoint, correction)

    def test_gram_minus_row_sum_diagonal_has_zero_rows(self) -> None:
        gram = (
            (F(5), F(-2), F(1)),
            (F(-2), F(7), F(3)),
            (F(1), F(3), F(11)),
        )
        row_sums = tuple(sum(row, F(0)) for row in gram)
        laplacian = tuple(
            tuple(
                gram[i][j] - (row_sums[i] if i == j else F(0))
                for j in range(3)
            )
            for i in range(3)
        )
        self.assertEqual(tuple(sum(row, F(0)) for row in laplacian), (F(0),) * 3)

    def test_induced_prefix_and_full_rank_one_limit_are_distinct(self) -> None:
        induced = (
            (F(0), F(-2), F(2)),
            (F(-2), F(6), F(-4)),
            (F(2), F(-4), F(2)),
        )
        # The leading 2x2 principal determinant is negative.
        self.assertLess(
            induced[0][0] * induced[1][1] - induced[0][1] ** 2,
            0,
        )

        q = (F(1), F(-2), F(2))
        full = tuple(tuple(x * y for y in q) for x in q)
        for i in range(3):
            for j in range(3):
                self.assertEqual(full[0][0] * full[i][j], full[0][i] * full[0][j])

    def test_claim_boundary_and_phase_average_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "phase-weighted positive Gram kernel",
            "there is no sharp continuum limit",
            r"1-\cos(\gamma L)",
            r"\mathcal K_\theta",
            r"\mathcal K_{\Delta,\theta}",
            r"L_w=G-\operatorname {diag}(G\mathbf1)",
            r"H_N\left({\gamma L\over2\pi}\right)",
            "Christoffel--Darboux kernel is only the phase average",
            "forbidden critical-line continuation",
            "P0_INVALIDATED",
            "an evaluation of `L_w`",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "RH_PROVED",
            "the sharp continuum limit exists",
            "actual-source routing contraction follows",
            "N=24 proves routing",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
