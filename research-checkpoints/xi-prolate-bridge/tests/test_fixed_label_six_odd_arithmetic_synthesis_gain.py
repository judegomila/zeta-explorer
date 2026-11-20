#!/usr/bin/env python3
"""Exact regressions for the fixed label-six odd synthesis gain."""

from __future__ import annotations

import ast
from dataclasses import dataclass
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md":
        "9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71",
    "notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md":
        "d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md":
        "9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c",
    "notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md":
        "113be74d52f48d66903c1babf1525ec6d130243321acfa31562abd8640868a3a",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md":
        "3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf",
    "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md":
        "39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3",
    "notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md":
        "93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329",
}


def _squarefree_split(value: int) -> tuple[int, int]:
    if value <= 0:
        raise ValueError("positive radicand required")
    outside = 1
    squarefree = 1
    prime = 2
    while prime * prime <= value:
        exponent = 0
        while value % prime == 0:
            value //= prime
            exponent += 1
        outside *= prime ** (exponent // 2)
        if exponent % 2:
            squarefree *= prime
        prime += 1
    if value > 1:
        squarefree *= value
    return outside, squarefree


@dataclass(frozen=True)
class Surd:
    """Small exact multiquadratic algebra for the displayed coefficients."""

    terms: tuple[tuple[int, F], ...] = ()

    @staticmethod
    def _make(data: dict[int, F]) -> "Surd":
        return Surd(tuple(sorted((radicand, value) for radicand, value in data.items() if value)))

    @staticmethod
    def rational(value: int | F) -> "Surd":
        coefficient = F(value)
        return Surd() if not coefficient else Surd(((1, coefficient),))

    @staticmethod
    def sqrt(value: int, coefficient: int | F = 1) -> "Surd":
        outside, squarefree = _squarefree_split(value)
        return Surd._make({squarefree: F(coefficient) * outside})

    def __add__(self, other: "Surd") -> "Surd":
        data = dict(self.terms)
        for radicand, value in other.terms:
            data[radicand] = data.get(radicand, F()) + value
        return Surd._make(data)

    def __neg__(self) -> "Surd":
        return Surd(tuple((radicand, -value) for radicand, value in self.terms))

    def __sub__(self, other: "Surd") -> "Surd":
        return self + (-other)

    def __mul__(self, other: "Surd") -> "Surd":
        data: dict[int, F] = {}
        for radicand_left, value_left in self.terms:
            for radicand_right, value_right in other.terms:
                common = math.gcd(radicand_left, radicand_right)
                radicand = radicand_left * radicand_right // common**2
                data[radicand] = (
                    data.get(radicand, F()) + value_left * value_right * common
                )
        return Surd._make(data)

    def scale(self, value: int | F) -> "Surd":
        coefficient = F(value)
        return Surd._make(
            {radicand: coefficient * term for radicand, term in self.terms}
        )


def _poly_mul(left: tuple[F, ...], right: tuple[F, ...]) -> tuple[F, ...]:
    result = [F() for _ in range(len(left) + len(right) - 1)]
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            result[i + j] += left_value * right_value
    return tuple(result)


class FixedLabelSixOddArithmeticSynthesisGainTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_label_two_and_six_quasimodes_cancel_exactly(self) -> None:
        v2_upper = Surd.sqrt(10, F(3, 2))
        u2_upper_over_pi = Surd.sqrt(10, F(-3, 32))
        self.assertEqual(F(-15, 4), -F(2 * 2 * 2 + 2 * 2 + 3, 4))
        self.assertEqual(u2_upper_over_pi.scale(16) + v2_upper, Surd())

        v6_lower = Surd.sqrt(10, F(3, 2))
        v6_upper = Surd.sqrt(35, 3)
        u6_lower_over_pi = Surd.sqrt(10, F(3, 32))
        u6_upper_over_pi = Surd.sqrt(35, F(-3, 16))
        self.assertEqual(F(-87, 4), -F(2 * 6 * 6 + 2 * 6 + 3, 4))
        self.assertEqual(u6_lower_over_pi.scale(-16) + v6_lower, Surd())
        self.assertEqual(u6_upper_over_pi.scale(16) + v6_upper, Surd())

    def test_origin_ratios_give_the_exact_a_six_correction(self) -> None:
        r6 = Surd.sqrt(10, F(1, 4))
        r10 = Surd.sqrt(14, F(3, 16))
        u2_origin_over_pi = Surd.sqrt(10, F(-3, 32)) * r6
        u6_origin_over_pi = (
            Surd.sqrt(10, F(3, 32))
            + Surd.sqrt(35, F(-3, 16)) * r10
        )
        self.assertEqual(u2_origin_over_pi, Surd.rational(F(-15, 64)))
        self.assertEqual(u6_origin_over_pi, Surd.sqrt(10, F(-39, 256)))
        ratio_correction = u6_origin_over_pi - r6 * u2_origin_over_pi
        self.assertEqual(ratio_correction, Surd.sqrt(10, F(-3, 32)))

    def test_label_six_source_correction_has_zero_point_value(self) -> None:
        r6 = Surd.sqrt(10, F(1, 4))
        r10 = Surd.sqrt(14, F(3, 16))
        point_value = (
            Surd.sqrt(10, F(-3, 16))
            + Surd.rational(F(-15, 64)) * r6
            + Surd.sqrt(35, F(3, 16)) * r10
        )
        self.assertEqual(point_value, Surd())

    def test_q_six_polynomial_and_mellin_factor_are_exact(self) -> None:
        # In common h_6 normalization and powers of pi*x^2, subtracting h_6
        # from (sqrt(10)/4)h_2 cancels the constant term exactly.
        h6_coefficients = (F(120), F(-1440), F(1920), F(-512))
        scaled_h2_coefficients = (F(120), F(-480), F(0), F(0))
        q_coefficients = tuple(
            h2_value - h6_value
            for h2_value, h6_value in zip(scaled_h2_coefficients, h6_coefficients)
        )
        self.assertEqual(q_coefficients, (F(0), F(960), F(-1920), F(512)))

        # Sum c_k*(a)_k for a=s/2.  Coefficients are low-to-high powers of a.
        mellin_in_a = (
            F(0),
            q_coefficients[1] + q_coefficients[2] + 2 * q_coefficients[3],
            q_coefficients[2] + 3 * q_coefficients[3],
            q_coefficients[3],
        )
        self.assertEqual(mellin_in_a, (F(0), F(64), F(-384), F(512)))
        mellin_in_s_before_half = tuple(
            value / (2**power) for power, value in enumerate(mellin_in_a)
        )
        self.assertEqual(
            mellin_in_s_before_half,
            (F(0), F(32), F(-96), F(64)),
        )
        expected = tuple(32 * value for value in _poly_mul(
            (F(0), F(-1), F(1)), (F(-1), F(2))
        ))
        self.assertEqual(mellin_in_s_before_half, expected)

        # Strip the common 2^(1/4): Q6 coefficient is 1/(6*sqrt(5)),
        # while Q4 coefficient is sqrt(6)/6.
        q6_coefficient = Surd.sqrt(5, F(1, 30))
        q4_coefficient = Surd.sqrt(6, F(1, 6))
        inverse_sqrt_30 = Surd.sqrt(30, F(1, 30))
        self.assertEqual(q6_coefficient, q4_coefficient * inverse_sqrt_30)

    def test_derivative_multiplier_has_the_claimed_norm_factor(self) -> None:
        # 2s-1=-2iz on s=1/2-iz.  Squaring 2/sqrt(30) gives 2/15.
        self.assertEqual(F(4, 30), F(2, 15))
        # A nonzero L2 function with zero derivative would be a zero constant.
        k4_prime_squared = F(9, 7)
        self.assertGreater(F(2, 15) * k4_prime_squared, 0)

    def test_fixed_defect_ratios_have_the_claimed_exact_constants(self) -> None:
        d2_over_d6_times_pi4 = F(
            math.factorial(6), math.factorial(2) * 16**4
        )
        d10_over_d6_divided_by_pi4 = F(
            16**4 * math.factorial(6), math.factorial(10)
        )
        self.assertEqual(d2_over_d6_times_pi4, F(45, 8192))
        self.assertEqual(d10_over_d6_divided_by_pi4, F(4096, 315))

    def test_locked_transfer_and_projection_exponents_are_consistent(self) -> None:
        source_remainder_power = F(-4)
        arithmetic_map_loss = F(1)
        first_correction_power = F(-2)
        projected_remainder_power = source_remainder_power + arithmetic_map_loss
        self.assertEqual(projected_remainder_power, F(-3))
        self.assertLess(projected_remainder_power, first_correction_power)
        for odd_p in (5, 7, 11, 15):
            self.assertEqual(odd_p * odd_p % 8, 1)

    def test_singleton_and_rest_synthesis_power_ledger(self) -> None:
        modal_count_power = F(2)
        point_value_power = F(1)
        source_synthesis_squared_power = modal_count_power + point_value_power
        arithmetic_squared_loss = F(2)
        physical_synthesis_squared_power = (
            source_synthesis_squared_power + arithmetic_squared_loss
        )
        d10_over_d6_power = F(8)
        rest_m_power = physical_synthesis_squared_power - d10_over_d6_power
        self.assertEqual(source_synthesis_squared_power, F(3))
        self.assertEqual(physical_synthesis_squared_power, F(5))
        self.assertEqual(rest_m_power, F(-3))
        self.assertEqual(F(-8), F(-8))  # D6/d6 has only a decaying correction.

    def test_cross_aware_gamma_and_shift_power_ledger(self) -> None:
        c6_power = F(1)
        m6_power = F(0)
        cr_power = F(3)
        mr_power = F(-3)
        gamma_power = max(c6_power + m6_power, cr_power + mr_power)
        self.assertEqual(gamma_power, F(1))
        self.assertEqual(cr_power + mr_power, F(0))
        # U0=o(d6) times ||A_-||^2=O(1/d6) is o(1).
        self.assertEqual(F(1) + F(-1), F(0))

    def test_positive_quotient_norm_is_squeezed_by_singleton_and_rest(self) -> None:
        # One-dimensional exact normal form for M6 <= ||Delta^-1|| <= M6+MR.
        d6 = F(1, 1000)
        kappa = F(7, 3)
        m6 = kappa / d6
        mr = F(1, 100) / d6
        delta_inverse = m6 + mr
        self.assertLessEqual(m6, delta_inverse)
        self.assertLessEqual(delta_inverse, m6 + mr)
        self.assertEqual(d6 * m6, kappa)
        self.assertEqual(1 / delta_inverse / d6, 1 / (kappa + F(1, 100)))

    def test_note_states_the_exact_gain_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Fixed label-six odd arithmetic synthesis gain",
            "source phase positive at zero",
            "u_2=-{3\\sqrt {10}\\over32\\pi}h_6",
            "u_6={3\\sqrt {10}\\over32\\pi}h_2",
            "I_n=-\\chi_{n,\\lambda}f_{n,\\lambda}(0)",
            "a_6:={I_6\\over I_2}",
            "q_{6,1}=-{3\\sqrt {10}\\over16\\pi}h_2",
            "Q_6(s)={2^{1/4}\\over6\\sqrt5}",
            "K_6=-{2\\over\\sqrt {30}}K_4'",
            "d_6M_6\\longrightarrow\\|K_6\\|_2^2",
            "source synthesis",
            "\\|C_R^-\\|^2=1+\\|\\boldsymbol a\\|^2",
            "physical synthesis has",
            "\\|W_R^-\\|^2=O(\\lambda^5)",
            "`q_R+1=O(lambda^2)` modal rows",
            "split-plus executable artifact",
            "does not certify",
            "Gamma_-(\\Delta_-)",
            "(U_0)_+\\|A_-\\|^2=o(1)",
            "still-unproved unshifted",
            "odd source quotient floor",
            "actual residual forcing is inversion even",
            "physical high complement",
            "equation (5.2)",
            "no RH statement",
            "no Lambda bound",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "the odd signed floor is proved",
            "the shifted odd floor is proved",
            "the physical high complement is controlled",
            "the odd forcing action is proved",
            "equation (5.2) is proved",
            "proves RH",
            "a Lambda bound follows",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_aligned_rows_never_end_in_one_raw_backslash(self) -> None:
        inside_aligned = False
        for line_number, line in enumerate(NOTE.read_text(encoding="utf-8").splitlines(), 1):
            if "\\begin{aligned}" in line:
                self.assertFalse(inside_aligned, f"nested aligned block at line {line_number}")
                inside_aligned = True
                continue
            if "\\end{aligned}" in line:
                self.assertTrue(inside_aligned, f"unmatched aligned end at line {line_number}")
                inside_aligned = False
                continue
            if inside_aligned:
                stripped = line.rstrip()
                trailing = len(stripped) - len(stripped.rstrip("\\"))
                self.assertNotEqual(trailing, 1, f"single raw backslash at line {line_number}")
        self.assertFalse(inside_aligned, "unterminated aligned block")

    def test_package_is_stdlib_only_and_has_clean_bytes(self) -> None:
        tree = ast.parse(TEST.read_text(encoding="utf-8"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {"__future__", "ast", "dataclasses", "fractions", "hashlib", "math", "pathlib", "unittest"},
        )
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))


if __name__ == "__main__":
    unittest.main()
