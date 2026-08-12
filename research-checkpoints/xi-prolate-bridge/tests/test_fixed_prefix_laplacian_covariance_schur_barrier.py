#!/usr/bin/env python3
"""Exact regressions for the fixed-prefix covariance Schur barrier."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_PREFIX_LAPLACIAN_COVARIANCE_SCHUR_BARRIER.md"
TEST = Path(__file__).resolve()
PACKAGE_FILES = (NOTE, TEST)

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md":
        "4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be",
    "notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md":
        "14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "notes/PRIME_SIDE_SIGNED_RIESZ_HISTORY_BARRIER.md":
        "ca6fd1e6d34b7872fc55f20e6005cdec0c9c7f81a4ad3ac50187a8b30db5521c",
}


def inverse(value: F) -> F:
    return F(value.denominator, value.numerator)


def zero_moments(
    weights: tuple[F, ...],
    poles: tuple[F, ...],
    q_values: tuple[F, ...],
):
    """Return P, t_i, and K_ij for exact real signed zero data."""
    assert len(weights) == len(poles)
    p_value = sum(weights, F(0))
    nodes = tuple(
        tuple(inverse(pole + q) for pole in poles)
        for q in q_values
    )
    t_values = tuple(
        sum((weight * node for weight, node in zip(weights, row)), F(0))
        for row in nodes
    )
    k_values = tuple(
        tuple(
            sum(
                (
                    weights[a] * nodes[i][a] * nodes[j][a]
                    for a in range(len(weights))
                ),
                F(0),
            )
            for j in range(len(q_values))
        )
        for i in range(len(q_values))
    )
    return p_value, t_values, k_values


def determinant_two(matrix: tuple[tuple[F, F], tuple[F, F]]) -> F:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


class FixedPrefixLaplacianCovarianceSchurBarrierTests(unittest.TestCase):
    def test_package_files_have_clean_bytes_and_final_newlines(self) -> None:
        for path in PACKAGE_FILES:
            raw = path.read_bytes()
            bad = [
                (offset, byte)
                for offset, byte in enumerate(raw)
                if (byte < 32 and byte != 10) or byte == 127
            ]
            self.assertEqual(bad, [], path)
            self.assertTrue(raw.endswith(b"\n"), path)

    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_first_turan_identity_is_exact(self) -> None:
        weights = (F(5, 7), F(-2, 9), F(11, 13), F(3, 8))
        poles = (F(7, 3), F(13, 5), F(19, 7), F(29, 11))
        q = F(4, 17)
        p_value, t_values, k_values = zero_moments(weights, poles, (q,))
        t_value = t_values[0]
        k_value = k_values[0][0]
        u_value = p_value - q * t_value
        y_value = p_value - 2 * q * t_value + q * q * k_value
        self.assertEqual(
            p_value * y_value - u_value * u_value,
            q * q * (p_value * k_value - t_value * t_value),
        )

    def test_exact_central_schur_covariance_factorization(self) -> None:
        weights = (F(2, 3), F(-1, 11), F(7, 5), F(5, 13))
        poles = (F(9, 4), F(17, 6), F(23, 7), F(31, 9))
        q_values = (F(1, 7), F(3, 10))
        p_value, t_values, k_values = zero_moments(
            weights, poles, q_values
        )
        rho_zero = F(2, 19)
        rho = (F(-1, 23), F(4, 29))
        h = tuple(q * t for q, t in zip(q_values, t_values))
        u = tuple(p_value - value for value in h)
        y = tuple(
            p_value - 2 * h[i] + q_values[i] ** 2 * k_values[i][i]
            for i in range(2)
        )

        block = [[F(0) for _ in range(3)] for _ in range(3)]
        block[0][0] = p_value + rho_zero
        for i in range(2):
            block[0][i + 1] = u[i]
            block[i + 1][0] = u[i]
            block[i + 1][i + 1] = y[i] + rho[i]
        delta = (
            q_values[0] * h[0] - q_values[1] * h[1]
        ) / (q_values[0] - q_values[1])
        block[1][2] = p_value - delta
        block[2][1] = p_value - delta

        direct = tuple(
            tuple(
                block[i + 1][j + 1]
                - block[i + 1][0] * block[0][j + 1] / block[0][0]
                for j in range(2)
            )
            for i in range(2)
        )
        covariance = tuple(
            tuple(
                p_value * k_values[i][j] - t_values[i] * t_values[j]
                for j in range(2)
            )
            for i in range(2)
        )
        expected = tuple(
            tuple(
                q_values[i]
                * q_values[j]
                * covariance[i][j]
                / p_value
                + (rho[i] if i == j else F(0))
                + rho_zero
                * u[i]
                * u[j]
                / (p_value * (p_value + rho_zero))
                for j in range(2)
            )
            for i in range(2)
        )
        self.assertEqual(direct, expected)

    def test_positive_real_zero_measure_has_positive_covariance(self) -> None:
        weights = (F(2, 5), F(7, 11), F(13, 17), F(19, 23))
        poles = (F(-5), F(-11), F(-19), F(-29))
        q_values = (F(1, 7), F(2, 9))
        p_value, t_values, k_values = zero_moments(
            weights, poles, q_values
        )
        covariance = tuple(
            tuple(
                p_value * k_values[i][j] - t_values[i] * t_values[j]
                for j in range(2)
            )
            for i in range(2)
        )
        self.assertGreater(covariance[0][0], 0)
        self.assertGreater(covariance[1][1], 0)
        self.assertGreater(determinant_two(covariance), 0)

    def test_off_axis_conjugate_pair_sector_is_negative_rank_one(self) -> None:
        # c=x+i*y and m_i=a_i+i*b_i.  Pairing conjugates is exact over Q.
        x, y = F(7, 5), F(-11, 13)
        imaginary_nodes = (F(3, 8), F(-5, 17), F(9, 19))
        pair_covariance = tuple(
            tuple(
                -4 * (x * x + y * y) * b_i * b_j
                for b_j in imaginary_nodes
            )
            for b_i in imaginary_nodes
        )
        self.assertTrue(all(pair_covariance[i][i] < 0 for i in range(3)))
        for i in range(3):
            for j in range(i + 1, 3):
                minor = (
                    pair_covariance[i][i] * pair_covariance[j][j]
                    - pair_covariance[i][j] * pair_covariance[j][i]
                )
                self.assertEqual(minor, 0)

        # Direct one-feature expansion gives the same phase-independent sign.
        a, b = F(23, 17), imaginary_nodes[0]
        pair_p = 2 * x
        pair_t = 2 * (x * a - y * b)
        pair_k = 2 * (x * (a * a - b * b) - 2 * y * a * b)
        self.assertEqual(
            pair_p * pair_k - pair_t * pair_t,
            -4 * (x * x + y * y) * b * b,
        )

    def test_note_records_exact_scope_and_missing_gate(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        required = (
            "signed resolvent covariance",
            "o_K(L^(-4)*Psi(L))",
            "Stieltjes/Hankel variance conditional on real centered zeros",
            "negative semidefinite of rank one",
            "does not assert that one pair dominates",
            "positive least-eigenvalue margin",
            "P0_INVALIDATED",
        )
        for fragment in required:
            self.assertIn(fragment, normalized)
        forbidden = (
            "we prove rh",
            "the Riemann hypothesis follows",
            "actual zeta zero sum is dominated",
        )
        lowered = text.lower()
        for fragment in forbidden:
            self.assertNotIn(fragment, lowered)


if __name__ == "__main__":
    unittest.main()
