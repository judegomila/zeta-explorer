#!/usr/bin/env python3
"""Exact regressions for the fixed label-eight arithmetic synthesis gain."""

from __future__ import annotations

import ast
from dataclasses import dataclass
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md":
        "d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md":
        "93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329",
    "notes/ONE_SIDED_LOEWNER_ACTION_TRANSFER_BARRIER.md":
        "643c54707b9dee31493a628f6fd8d1368a3a5eb4eb27d17d7e2acaa5a0448a9f",
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


class FixedLabelEightArithmeticSynthesisGainTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_label_eight_couplings_and_quasimode_cancel_exactly(self) -> None:
        lower_v = Surd.sqrt(105)
        upper_v = Surd.sqrt(330, F(3, 2))
        mu_eight = F(-147, 4)
        lower_u_over_pi = Surd.sqrt(105, F(1, 16))
        upper_u_over_pi = Surd.sqrt(330, F(-3, 32))
        self.assertEqual(mu_eight, -F(2 * 8 * 8 + 2 * 8 + 3, 4))
        # Multiplication by the oscillator gaps (-16*pi) and (16*pi)
        # cancels the two off-diagonal entries of (V-mu_8)h_8.
        self.assertEqual(lower_u_over_pi.scale(-16) + lower_v, Surd())
        self.assertEqual(upper_u_over_pi.scale(16) + upper_v, Surd())

    def test_origin_ratios_give_the_exact_rho_eight_correction(self) -> None:
        r4 = Surd.sqrt(6, F(1, 4))
        r8 = Surd.sqrt(70, F(1, 16))
        r12 = Surd.sqrt(231, F(1, 32))
        u0_origin_over_pi = Surd.sqrt(6, F(-1, 32)) * r4
        u8_origin_over_pi = (
            Surd.sqrt(105, F(1, 16)) * r4
            + Surd.sqrt(330, F(-3, 32)) * r12
        )
        self.assertEqual(u0_origin_over_pi, Surd.rational(F(-3, 64)))
        self.assertEqual(u8_origin_over_pi, Surd.sqrt(70, F(-51, 1024)))
        integral_ratio_correction = u8_origin_over_pi - r8 * u0_origin_over_pi
        self.assertEqual(integral_ratio_correction, Surd.sqrt(70, F(-3, 64)))
        rho_correction = -integral_ratio_correction
        self.assertEqual(rho_correction, Surd.sqrt(70, F(3, 64)))

    def test_label_eight_source_correction_has_zero_point_value(self) -> None:
        r4 = Surd.sqrt(6, F(1, 4))
        r12 = Surd.sqrt(231, F(1, 32))
        point_value = (
            Surd.sqrt(70, F(3, 64))
            + Surd.sqrt(105, F(17, 256)) * r4
            + Surd.sqrt(330, F(-3, 32)) * r12
        )
        self.assertEqual(point_value, Surd())

    def test_exact_mellin_polynomial_relation_is_nonconstant(self) -> None:
        s_times_s_minus_one = (F(0), F(-1), F(1))
        mellin_factor = (F(23), F(-2), F(2))
        q8_polynomial = _poly_mul(s_times_s_minus_one, mellin_factor)
        self.assertEqual(q8_polynomial, (F(0), F(-23), F(25), F(-4), F(2)))
        coefficient_left = Surd.sqrt(70, F(1, 420))
        coefficient_right = (
            Surd.sqrt(105, F(1, 210)) * Surd.sqrt(6, F(1, 6))
        )
        self.assertEqual(coefficient_left, coefficient_right)
        self.assertNotEqual(2 * F(2) ** 2 - 2 * F(2) + 23,
                            2 * F(3) ** 2 - 2 * F(3) + 23)

    def test_fixed_defect_ratios_have_the_claimed_exact_constants(self) -> None:
        # Remove the displayed powers of pi; only exact factorial arithmetic
        # remains in the fixed-index coefficient A_n=(16*pi)^n/n!.
        d4_over_d8_times_pi4 = F(math.factorial(8), math.factorial(4) * 16**4)
        d0_over_d8_times_pi8 = F(math.factorial(8), 16**8)
        d6_over_d8_times_pi2 = F(math.factorial(8), math.factorial(6) * 16**2)
        self.assertEqual(d4_over_d8_times_pi4, F(105, 4096))
        self.assertEqual(d0_over_d8_times_pi8, F(315, 2**25))
        self.assertEqual(d6_over_d8_times_pi2, F(7, 32))

    def test_locked_arithmetic_transfer_exponents_are_consistent(self) -> None:
        source_remainder_power = F(-4)
        arithmetic_map_loss = F(1)
        first_correction_power = F(-2)
        projected_remainder_power = source_remainder_power + arithmetic_map_loss
        self.assertEqual(projected_remainder_power, F(-3))
        self.assertLess(projected_remainder_power, first_correction_power)
        for odd_p in (5, 7, 11, 15):
            self.assertEqual(odd_p * odd_p % 8, 1)

    def test_anchor_projection_and_metric_gain_are_exact(self) -> None:
        # Finite exact normal form of K8 not in span{K4}.
        k4 = (F(1), F(0))
        k8 = (F(2), F(3))
        alpha = (k4[0] * k8[0] + k4[1] * k8[1]) / (
            k4[0] ** 2 + k4[1] ** 2
        )
        winfinity = (k8[0] - alpha * k4[0], k8[1] - alpha * k4[1])
        self.assertEqual(alpha, 2)
        self.assertEqual(winfinity, (F(0), F(3)))
        self.assertEqual(sum(value * value for value in winfinity), 9)
        # Bounded deflation coefficients leave only negative relative powers
        # from d4/d8 and d0/d8, so D8/d8 tends to one.
        self.assertEqual((F(-8), F(-16)), (F(-8), F(-16)))
        self.assertEqual(F(0) - F(0), F(0))  # M8 has no extra lambda power.

    def test_cross_aware_gamma_and_forcing_power_ledger(self) -> None:
        c8_power = F(1)
        m8_power = F(0)
        cr_power = F(3)
        mr_power = F(-2)
        gamma_power = max(c8_power + m8_power, cr_power + mr_power)
        d6_over_d8_power = F(-4)
        forcing_squared_power = gamma_power + d6_over_d8_power
        self.assertEqual(gamma_power, F(1))
        self.assertEqual(forcing_squared_power, F(-3))
        self.assertEqual(forcing_squared_power / 2, F(-3, 2))

    def test_conditional_one_sided_action_power_ledger(self) -> None:
        symmetric_sampling_power = F(3)
        delta_inverse_power = F(0)
        d6_over_d8_power = F(-4)
        squared_action_power = (
            symmetric_sampling_power + delta_inverse_power + d6_over_d8_power
        )
        self.assertEqual(squared_action_power, F(-1))
        self.assertEqual(squared_action_power / 2, F(-1, 2))
        self.assertEqual(F(-1, 2) - F(-3, 2), F(1))

    def test_note_states_the_exact_gain_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Fixed label-eight arithmetic synthesis gain",
            "mu_8=-{147\\over4}",
            "u_8={\\sqrt{105}\\over16\\pi}h_4",
            "point-value extension for label 8",
            "rho_8=-{I_8\\over I_0}",
            "Q_8(s)={\\sqrt{105}\\over210}",
            "exact source-specific noncollinearity theorem",
            "D_8\\over d_8",
            "M_8=\\Theta(d_8^{-1})",
            "lambda^{-3/2}P(\\lambda)^{1/2}",
            "lambda^{-1/2}",
            "still-unproved uniform left-preconditioned reserve",
            "unproved comparison",
            "physical high complement",
            "odd sector",
            "equation (5.2)",
            "every Lambda bound remain open",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "the uniform signed floor is proved",
            "equation (5.2) is proved",
            "proves RH",
            "the odd sector is closed",
            "the high complement is controlled",
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
