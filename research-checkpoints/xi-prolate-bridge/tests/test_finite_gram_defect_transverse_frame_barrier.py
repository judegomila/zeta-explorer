#!/usr/bin/env python3
"""Exact regressions for the finite Gram-defect transverse-frame barrier."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FINITE_GRAM_DEFECT_TRANSVERSE_FRAME_BARRIER.md"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def matmul(a: tuple[tuple[F, ...], ...], b: tuple[tuple[F, ...], ...]):
    return tuple(
        tuple(sum((a[i][k] * b[k][j] for k in range(len(b))), F(0))
              for j in range(len(b[0])))
        for i in range(len(a))
    )


class FiniteGramDefectTransverseFrameBarrierTests(unittest.TestCase):
    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_feature_sum_and_anchor_sampling_energy_constants(self) -> None:
        p = (F(3, 5), F(-7, 11), F(13, 17), F(-19, 23))
        s = F(9, 4)
        omega2 = F(25, 49)
        gamma2 = omega2 * s * s
        direct = sum(
            (p[n] / (omega2 * n * n - gamma2)
             for n in range(len(p))),
            F(0),
        )
        h_value = p[0] + s * s * sum(
            (p[n] / (s * s - n * n) for n in range(1, len(p))),
            F(0),
        )
        self.assertEqual(direct, -h_value / gamma2)

        theta = F(7, 13)
        length = F(11, 5)
        # |1-exp(-i gamma L)|^2=2*theta.  Suppress the common H^2/gamma^2.
        feature_energy_factor = F(4) * theta / length
        positive_sample_factor = F(2) * theta / length
        self.assertEqual(feature_energy_factor, 2 * positive_sample_factor)

    def test_block_row_sum_decomposition_is_exact(self) -> None:
        # A positive definite Gram matrix with rational entries.
        gram = (
            (F(5), F(-2), F(1)),
            (F(-2), F(7), F(3)),
            (F(1), F(3), F(11)),
        )
        one = (F(1), F(1), F(1))
        row_sum = tuple(sum(row, F(0)) for row in gram)
        alpha = sum(row_sum, F(0)) / F(3)
        # b = P G u; store sqrt(3)*b to avoid irrational coordinates.
        sqrt_d_b = tuple(value - alpha for value in row_sum)
        self.assertEqual(sum(sqrt_d_b, F(0)), F(0))
        reconstructed = tuple(alpha + value for value in sqrt_d_b)
        self.assertEqual(reconstructed, row_sum)

        laplacian = tuple(
            tuple(
                gram[i][j] - (row_sum[i] if i == j else F(0))
                for j in range(3)
            )
            for i in range(3)
        )
        self.assertEqual(
            tuple(sum(row, F(0)) for row in laplacian),
            (F(0), F(0), F(0)),
        )

    def test_small_residual_countermodel_is_exact(self) -> None:
        epsilon = F(1, 10)
        delta = epsilon ** 4
        v = (F(1), F(-1), epsilon)
        projection = tuple(
            tuple((F(1) if i == j else F(0)) - F(1, 3)
                  for j in range(3))
            for i in range(3)
        )
        gram = tuple(
            tuple(v[i] * v[j] + delta * projection[i][j]
                  for j in range(3))
            for i in range(3)
        )
        row_sum = tuple(sum(row, F(0)) for row in gram)
        self.assertEqual(row_sum, tuple(epsilon * value for value in v))
        self.assertEqual(sum(row_sum, F(0)), epsilon ** 2)

        laplacian = tuple(
            tuple(
                gram[i][j] - (row_sum[i] if i == j else F(0))
                for j in range(3)
            )
            for i in range(3)
        )
        degrees = tuple(laplacian[i][i] for i in range(3))
        self.assertTrue(all(value > 0 for value in degrees))
        self.assertGreater(-laplacian[0][1], 0)
        self.assertGreater(-laplacian[1][2], 0)
        self.assertLess(-laplacian[0][2], 0)

        # For a three-vertex Laplacian, any cofactor is one third of the
        # product of the two transverse eigenvalues.
        cofactor = (
            laplacian[0][0] * laplacian[1][1]
            - laplacian[0][1] * laplacian[1][0]
        )
        expected = (-3 * epsilon ** 2 + 2 * delta + delta ** 2) / 3
        self.assertEqual(cofactor, expected)
        self.assertLess(cofactor, 0)

    def test_scaling_can_beat_any_absolute_residual_rate(self) -> None:
        epsilon = F(1, 7)
        tau = F(1, 10**20)
        unscaled_eta2 = epsilon ** 2
        scaled_eta2 = tau ** 2 * unscaled_eta2
        self.assertLess(scaled_eta2, F(1, 10**30))
        # Scaling a Laplacian by a positive square preserves a negative
        # cofactor sign.
        negative_cofactor = F(-1, 13)
        self.assertLess(tau ** 4 * negative_cofactor, 0)

    def test_claim_boundary_and_surviving_gate_are_explicit(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "transverse second-frame",
            r"\eta^2=2\sum_{\gamma>0}|\widehat f_N(\gamma)|^2",
            r"C-\alpha I_{u^\perp}",
            r"\sigma_{\min}(T|_{\mathbf1^\perp})^2",
            "carrier-scale phase information",
            "Arbitrarily small residual",
            "connected positive-edge",
            "meromorphic critical-line substitution",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "RH_PROVED",
            "approximate divisor implies positivity",
            "zero count supplies the transverse frame",
            "routing contraction follows",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
