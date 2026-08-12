#!/usr/bin/env python3
"""Exact standard-library regressions for the first-minor Turan barrier."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md":
        "14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae",
    "notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md":
        "4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be",
    "notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md":
        "cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
}


def variance_direct(weights: tuple[F, ...], nodes: tuple[F, ...]) -> F:
    psi = sum(weights, F(0))
    first = sum((weight * node for weight, node in zip(weights, nodes)), F(0))
    second = sum(
        (weight * node * node for weight, node in zip(weights, nodes)), F(0)
    )
    return psi * second - first * first


def variance_pair_sum(weights: tuple[F, ...], nodes: tuple[F, ...]) -> F:
    return sum(
        (
            weights[i] * weights[j] * (nodes[i] - nodes[j]) ** 2 / 2
            for i in range(len(weights))
            for j in range(len(weights))
        ),
        F(0),
    )


class FirstLaplacianMinorTuranBarrierTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_degree_edge_normalization_is_exact(self) -> None:
        length = F(13, 2)
        p_zero = F(3, 5)
        p_one = F(-7, 11)
        psi = F(17, 7)
        y_value = F(31, 13)
        u_value = F(19, 17)
        rho_zero = F(-2, 23)
        rho_one = F(5, 29)

        degree_zero = 2 * p_zero**2 * (psi + rho_zero) / length
        degree_one = 2 * p_one**2 * (y_value + rho_one) / length
        edge = -2 * p_zero * p_one * u_value / length
        determinant = degree_zero * degree_one - edge**2
        normalized = (
            length**2 * determinant / (4 * p_zero**2 * p_one**2)
        )
        self.assertEqual(
            normalized,
            (psi + rho_zero) * (y_value + rho_one) - u_value**2,
        )
        self.assertGreater(edge, 0)

    def test_resonant_first_filter_comparator_is_exact(self) -> None:
        eta = F(3, 7)
        q = F(5, 19)
        exponential = F(29, 3)
        denominator = eta**2 + q
        t_exponential = (exponential - 1) / denominator
        direct = exponential - q * t_exponential
        reduced = exponential * eta**2 / denominator + q / denominator
        self.assertEqual(direct, reduced)
        self.assertGreater(reduced, 0)

    def test_filter_and_turan_identities_are_exact(self) -> None:
        q = F(3, 11)
        alpha_squared = (F(7, 5), F(13, 9), F(19, 8))
        weights = (F(5, 7), F(-2, 13), F(17, 6))
        nus = tuple(1 / (value + q) for value in alpha_squared)
        multipliers = tuple(value / (value + q) for value in alpha_squared)

        for nu, multiplier in zip(nus, multipliers):
            self.assertEqual(multiplier, 1 - q * nu)

        psi = sum(weights, F(0))
        t_one = sum(
            (weight * nu for weight, nu in zip(weights, nus)), F(0)
        )
        t_two = sum(
            (weight * nu**2 for weight, nu in zip(weights, nus)), F(0)
        )
        u_value = sum(
            (weight * node for weight, node in zip(weights, multipliers)),
            F(0),
        )
        y_value = sum(
            (weight * node**2 for weight, node in zip(weights, multipliers)),
            F(0),
        )
        self.assertEqual(psi * y_value - u_value**2, q**2 * (psi * t_two - t_one**2))
        self.assertEqual(
            psi * y_value - u_value**2,
            variance_pair_sum(weights, multipliers),
        )

    def test_only_complete_resonant_summands_are_removable(self) -> None:
        q = F(7, 5)
        length = F(9, 4)
        coefficient = length**2 / (4 * q**2)
        self.assertEqual(coefficient * q**2, length**2 / 4)
        previous_bare_size = F(0)
        for denominator in (10, 100, 1000):
            delta = F(1, denominator)
            alpha_squared = -q + delta
            c_value = coefficient * delta**2
            nu = 1 / delta
            multiplier = alpha_squared / delta

            self.assertGreater(abs(nu), previous_bare_size)
            self.assertGreater(abs(multiplier), previous_bare_size)
            self.assertEqual(c_value * nu, coefficient * delta)
            self.assertEqual(c_value * nu**2, coefficient)
            self.assertEqual(
                c_value * multiplier,
                coefficient * delta * (delta - q),
            )
            self.assertEqual(
                c_value * multiplier**2,
                coefficient * (delta - q) ** 2,
            )
            previous_bare_size = min(abs(nu), abs(multiplier))

    def test_pair_sum_equals_weighted_covariance_for_signed_data(self) -> None:
        fixtures = (
            ((F(2), F(3), F(5)), (F(-1), F(4), F(9))),
            ((F(7, 3), F(-5, 11), F(13, 17)),
             (F(2, 5), F(-3, 7), F(19, 23))),
        )
        for weights, nodes in fixtures:
            self.assertEqual(
                variance_direct(weights, nodes),
                variance_pair_sum(weights, nodes),
            )

    def test_rh_weighted_variance_is_nonnegative_but_can_vanish(self) -> None:
        q = F(1, 4)
        gamma_squared = (F(1), F(4), F(9))
        weights = (F(2, 3), F(5, 7), F(11, 13))
        nodes = tuple(value / (value - q) for value in gamma_squared)
        self.assertGreater(variance_direct(weights, nodes), 0)
        self.assertEqual(
            variance_direct((F(2), F(3)), (F(7, 5), F(7, 5))),
            0,
        )
        self.assertEqual(variance_direct((F(5),), (F(17, 9),)), 0)

    def test_conjugate_pair_covariance_is_exactly_negative(self) -> None:
        # c=c_r+i*c_i and nu=nu_r+i*nu_i, all Gaussian-rational data.
        c_real = F(2, 3)
        c_imag = F(-5, 7)
        nu_real = F(11, 13)
        nu_imag = F(3, 8)

        psi = 2 * c_real
        t_one = 2 * (c_real * nu_real - c_imag * nu_imag)
        real_nu_squared = nu_real**2 - nu_imag**2
        imag_nu_squared = 2 * nu_real * nu_imag
        t_two = 2 * (
            c_real * real_nu_squared - c_imag * imag_nu_squared
        )
        direct = psi * t_two - t_one**2
        expected = -4 * (c_real**2 + c_imag**2) * nu_imag**2
        self.assertEqual(direct, expected)
        self.assertLess(direct, 0)

    def test_record_and_residual_exponent_gaps_are_strict(self) -> None:
        edge = F(2, 5)
        theta = F(3, 5)
        eta = F(3, 10)
        b_zero = F(1, 10)
        self.assertGreater(theta, F(1, 2))
        self.assertGreater(eta, edge * theta)
        self.assertLess(eta, edge)
        self.assertGreater(eta - edge / 2, 0)
        self.assertGreater(2 * eta - edge - b_zero, 0)
        self.assertLess(b_zero, eta)

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"w_{01}(L_n)>0",
            r"d_0={2p_0^2\over L}(\Psi+\rho _0)",
            r"d_1={2p_1^2\over L}(Y+\rho _1)",
            r"w_{01}={2p_0p_1\over L}A_1",
            r"U=(I-qT)\Psi=-A_1",
            r"Y=(I-qT)^2\Psi",
            r"\Psi Y-U^2",
            r"q^2\{\Psi T^2\Psi-(T\Psi)^2\}",
            r"c_\alpha c_\beta(m_\alpha-m_\beta)^2",
            "the bare factors `nu_alpha` and\n`m_alpha` have simple poles",
            "only the complete summands",
            r"\rho _0Y+\rho _1\Psi+\rho _0\rho _1",
            r"o(q^2P_n^2)",
            "sufficient positive margin",
            "Mere nonnegativity",
            "under RH",
            r"-4q^2|c|^2\{\Im\nu\}^2<0",
            "not the actual zeta zero set",
            "not a nonattained-edge counterexample",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "the first principal minor is proved positive",
            "the full Laplacian is positive",
            "equation (5.2) is proved",
            "the Riemann hypothesis is proved",
            "an actual zeta counterexample",
        )
        for token in forbidden:
            self.assertNotIn(token, text)

        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_package_contains_only_clean_raw_bytes(self) -> None:
        for path in (NOTE, TEST):
            bad = [
                (offset, byte)
                for offset, byte in enumerate(path.read_bytes())
                if (byte < 32 and byte != 10) or byte == 127
            ]
            self.assertEqual(bad, [], path.name)


if __name__ == "__main__":
    unittest.main()
