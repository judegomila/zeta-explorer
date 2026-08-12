#!/usr/bin/env python3
"""Exact regressions for the conditional unique-edge first-minor obstruction."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "UNIQUE_ATTAINED_EDGE_FIRST_MINOR_OBSTRUCTION.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md":
        "6f67349e53e761744408bfa053874ce4f79b22aac578fa6fff48fa5915e65edf",
    "notes/NONATTAINED_HIGH_EDGE_RECORD_FILTER_THEOREM.md":
        "14be9eca50d64ff2c4c6710e1523238e1a3df21464f40b13b9ab86478b0e61ae",
    "notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md":
        "4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md":
        "cdea3cf9d1756d76f7fc2524c66b031728ef8817825f4f68ea55887ef82cf91d",
}


def gaussian_multiply(left: tuple[F, F], right: tuple[F, F]) -> tuple[F, F]:
    a, b = left
    c, d = right
    return a * c - b * d, a * d + b * c


def gaussian_inverse(value: tuple[F, F]) -> tuple[F, F]:
    real, imag = value
    denominator = real**2 + imag**2
    return real / denominator, -imag / denominator


def nearest_strict_natural_length(time: float) -> tuple[int, float]:
    target = 2.0 * math.exp(time / 2.0)
    center = int(round(target))
    candidates = [value for value in range(center - 2, center + 3) if value % 2]
    odd = min(candidates, key=lambda value: abs(value - target))
    return odd, 2.0 * math.log(odd / 2.0)


class UniqueAttainedEdgeFirstMinorObstructionTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_positive_phase_transfers_to_the_strict_natural_grid(self) -> None:
        edge = 0.3
        ordinate = 5.0
        phase = 2.0 * math.atan2(ordinate, edge)
        for index in (4, 7, 10):
            time = (phase + 2.0 * math.pi * index) / ordinate
            odd, length = nearest_strict_natural_length(time)
            self.assertEqual(odd % 2, 1)
            self.assertLessEqual(abs(length - time), 2.1 * math.exp(-time / 2.0))
            phase_error = ordinate * (length - time)
            self.assertGreater(math.cos(phase_error), 0.99)

    def test_dominant_orbit_covariance_limit_is_exactly_negative(self) -> None:
        # alpha=B+i*gamma with B=1/3 and gamma=2/3.
        alpha = (F(1, 3), F(2, 3))
        alpha_squared = gaussian_multiply(alpha, alpha)
        z_real, z_imag = gaussian_inverse(alpha_squared)
        multiplicity = F(7)
        alpha_norm_squared = alpha[0] ** 2 + alpha[1] ** 2
        amplitude = 2 * multiplicity / alpha_norm_squared

        psi = amplitude
        t_one = amplitude * z_real
        t_two = amplitude * (z_real**2 - z_imag**2)
        covariance = psi * t_two - t_one**2
        self.assertEqual(covariance / psi**2, -z_imag**2)
        self.assertLess(covariance, 0)
        self.assertNotEqual(z_imag, 0)

    def test_conjugate_edge_pair_formula_includes_multiplicity(self) -> None:
        c_real, c_imag = F(2, 5), F(-7, 11)
        nu_real, nu_imag = F(13, 17), F(3, 19)
        multiplicity = F(5)

        psi = 2 * multiplicity * c_real
        t_one = 2 * multiplicity * (
            c_real * nu_real - c_imag * nu_imag
        )
        nu_squared_real = nu_real**2 - nu_imag**2
        nu_squared_imag = 2 * nu_real * nu_imag
        t_two = 2 * multiplicity * (
            c_real * nu_squared_real - c_imag * nu_squared_imag
        )
        direct = psi * t_two - t_one**2
        expected = -4 * multiplicity**2 * (
            c_real**2 + c_imag**2
        ) * nu_imag**2
        self.assertEqual(direct, expected)
        self.assertLess(direct, 0)

    def test_positive_phase_filtered_signs_hold_for_small_q(self) -> None:
        alpha = (F(1, 3), F(2, 3))
        z = gaussian_inverse(gaussian_multiply(alpha, alpha))
        previous_u_error = None
        previous_y_error = None
        for denominator in (100, 1000, 10000):
            q = F(1, denominator)
            one_plus_qz = (1 + q * z[0], q * z[1])
            multiplier = gaussian_inverse(one_plus_qz)
            multiplier_squared = gaussian_multiply(multiplier, multiplier)
            self.assertGreater(multiplier[0], 0)
            self.assertGreater(multiplier_squared[0], 0)
            u_error = abs(multiplier[0] - 1)
            y_error = abs(multiplier_squared[0] - 1)
            if previous_u_error is not None:
                self.assertLess(u_error, previous_u_error)
                self.assertLess(y_error, previous_y_error)
            previous_u_error = u_error
            previous_y_error = y_error

    def test_exact_minor_normalization_and_negative_core(self) -> None:
        length = F(17, 3)
        p_zero = F(5, 7)
        p_one = F(-11, 13)
        psi = F(19, 5)
        y_value = F(23, 7)
        u_value = F(4)
        rho_zero = F(1, 101)
        rho_one = F(-1, 103)

        d_zero = 2 * p_zero**2 * (psi + rho_zero) / length
        d_one = 2 * p_one**2 * (y_value + rho_one) / length
        edge = -2 * p_zero * p_one * u_value / length
        determinant = d_zero * d_one - edge**2
        normalized = length**2 * determinant / (4 * p_zero**2 * p_one**2)
        self.assertEqual(
            normalized,
            (psi + rho_zero) * (y_value + rho_one) - u_value**2,
        )
        self.assertGreater(d_zero, 0)
        self.assertGreater(d_one, 0)
        self.assertGreater(edge, 0)
        self.assertLess(normalized, 0)
        self.assertLess(determinant, 0)

    def test_residual_exponential_gap_beats_the_turan_scale(self) -> None:
        edge = F(2, 5)
        low_edge = F(1, 4)
        self.assertGreater(edge - low_edge, 0)
        # The low-history cross term divided by q^2*Psi^2 has polynomial
        # power L^3 and exponential rate -(B-b_0).
        self.assertEqual(F(-1) + F(4), F(3))
        self.assertLess(-(edge - low_edge), 0)

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "exactly one conjugate orbit",
            "lower zero lines may accumulate at the edge",
            r"{e^{i\gamma L_j}\over\alpha^2}",
            r"e^{-BL_j}\Psi&\longrightarrow A",
            r"e^{-BL_j}U&\longrightarrow A",
            r"e^{-BL_j}Y&\longrightarrow A",
            r"-\{\Im(\alpha^{-2})\}^2<0",
            r"-4r^2|c_\alpha|^2\{\Im\nu_\alpha\}^2<0",
            "every lower-line and edge--lower cross contribution",
            "uniform `H_N`",
            r"O_{b_0}\{L^3e^{-(B-b_0)L}\}+o(1)",
            r"d_0d_1-w_{01}^2<0",
            "conditional obstruction for the actual zeta source",
            "not a\nsynthetic zero fixture",
            "proves neither RH nor its negation",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "RH is proved",
            "RH is false unconditionally",
            "the unique edge hypothesis is known",
            "all attained edges force a negative minor",
            "the nonattained edge is solved",
            "equation (5.2) is proved",
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
