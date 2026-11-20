#!/usr/bin/env python3
"""Regressions for the fixed source-block shift asymptotic theorem."""

from __future__ import annotations

import ast
from fractions import Fraction
import hashlib
import math
from pathlib import Path
import re
import unittest

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md"
TEST = Path(__file__).resolve()
NOTE_HASH = "04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83"

FROZEN = {
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/FIXED_PREFIX_COMPLETE_SIGNED_TOEPLITZ_SCHUR_THEOREM.md":
        "c69d6d1a69f71548aa9291c5d261117ac913f2851df8f8fcc2f186c8bd530314",
    "notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md":
        "9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71",
    "notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md":
        "d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771",
    "notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md":
        "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0",
    "notes/GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md":
        "a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459",
    "notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md":
        "1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md":
        "3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md":
        "78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def gamma_coefficient(index: int, cutoff: int = 250_000) -> float:
    if index == 0:
        return sum(
            math.asin(1.0 / sample) / (2.0 * math.pi * sample)
            for sample in range(1, cutoff + 1)
        )
    return sum(
        math.sin(4.0 * index * math.asin(1.0 / sample))
        / (8.0 * math.pi * index * sample)
        for sample in range(1, cutoff + 1)
    )


def inverse_symmetric(matrix: np.ndarray) -> np.ndarray:
    values, vectors = np.linalg.eigh(matrix)
    return (vectors / values) @ vectors.T


def inverse_sqrt_symmetric(matrix: np.ndarray) -> np.ndarray:
    values, vectors = np.linalg.eigh(matrix)
    return (vectors / np.sqrt(values)) @ vectors.T


class FixedSourceBlockShiftAsymptoticTheoremTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(f"`{relative}`", self.text)
            self.assertIn(f"`{expected}`", self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_toeplitz_schur_constant_and_quarter_floor(self) -> None:
        coefficients = [gamma_coefficient(index) for index in range(3)]
        toeplitz = np.array(
            [
                [coefficients[abs(left - right)] for right in range(3)]
                for left in range(3)
            ]
        )
        self.assertGreater(float(np.linalg.eigvalsh(toeplitz)[0]), 0.25)
        row = toeplitz[1:, 0]
        rest = toeplitz[1:, 1:]
        tau = toeplitz[0, 0] - row @ np.linalg.solve(rest, row)
        self.assertGreater(tau, 0.25)
        self.assertAlmostEqual(tau, 0.3397534, delta=3e-6)
        self.assertIn(r"\tau_m\geq{1\over4}", self.text)

    def test_anisotropic_generalized_eigenvalue_limit(self) -> None:
        coefficients = [gamma_coefficient(index) for index in range(3)]
        toeplitz = np.array(
            [
                [coefficients[abs(left - right)] for right in range(3)]
                for left in range(3)
            ]
        )
        row = toeplitz[1:, 0]
        rest = toeplitz[1:, 1:]
        tau = toeplitz[0, 0] - row @ np.linalg.solve(rest, row)
        gram = np.array(
            [[2.0, 0.3, -0.1], [0.3, 1.7, 0.2], [-0.1, 0.2, 1.4]]
        )
        gram_inverse_sqrt = inverse_sqrt_symmetric(gram)
        limits = []
        for epsilon in (0.08, 0.04, 0.02, 0.01):
            defects = np.diag([epsilon**4, epsilon**2, 1.0])
            root = np.diag(np.sqrt(np.diag(defects)))
            form = root @ toeplitz @ root
            physical = gram_inverse_sqrt @ form @ gram_inverse_sqrt
            smallest = float(np.linalg.eigvalsh(physical)[0])
            limits.append(smallest / epsilon**4)
        target = tau / gram[0, 0]
        self.assertLess(abs(limits[-1] - target), 0.002)
        self.assertLess(abs(limits[-1] - target), abs(limits[0] - target))
        self.assertIn("Toeplitz Schur reserve", self.text)

    def test_exact_defect_ratios(self) -> None:
        # Rational coefficients after all factorial and 16*pi powers cancel.
        d8_over_d4 = Fraction(4096, 105)
        d6_over_d4 = Fraction(128, 15)
        d6_over_d8 = Fraction(7, 32)
        self.assertEqual(d6_over_d4 / d8_over_d4, d6_over_d8)
        self.assertIn(r"{4096\pi^4\over105}\lambda^8", self.text)
        self.assertIn(r"{128\pi^2\over15}\lambda^4", self.text)
        self.assertIn(r"{7\over32\pi^2}\lambda^{-4}", self.text)

    def test_first_direction_moment_constants(self) -> None:
        # |(-2*i*xi)/sqrt(30)|^2 = (2/15)*xi^2.
        self.assertEqual(Fraction(4, 30), Fraction(2, 15))
        # Centering (45/2-2*xi^2)/(2*sqrt(105)) leaves variance/105.
        self.assertEqual(Fraction(4, 4 * 105), Fraction(1, 105))
        self.assertIn(r"\|K_6\|_2^2={2\over15}A_4^2M_2", self.text)
        self.assertIn(
            r"\|W_{8,\infty}\|_2^2={1\over105}A_4^2V_2",
            self.text,
        )

    def test_q_and_upper_shift_separations(self) -> None:
        for lam in (10.0, 100.0, 1000.0):
            length = 2.0 * math.log(lam)
            # A representative U_Z/d_6 -> 0 sequence.
            upper_over_d6 = 1.0 / math.sqrt(lam)
            upper_over_even = (
                upper_over_d6
                * (7.0 / (32.0 * math.pi**2))
                * lam ** (-4)
                / length
            )
            upper_over_odd = upper_over_d6 / length
            self.assertLess(upper_over_even, upper_over_odd)
            self.assertLess(upper_over_odd, 1.0)
        self.assertIn(r"U_Z=o(d_6)", self.text)
        self.assertIn(r"\mu_{+,m}-U_Z>0", self.text)
        self.assertIn(r"\mu_{-,m}-U_Z>0", self.text)

    def test_projection_cutoff_is_exponential_not_linear(self) -> None:
        for lam in (5.0, 10.0, 20.0):
            length = 2.0 * math.log(lam)
            log_d4_model = 9.0 * math.log(lam) - 4.0 * math.pi * lam**2
            log_linear_product = math.log(length) + log_d4_model
            log_locked_product = (
                9600.0 * math.log(2.0) * lam**2 + log_d4_model
            )
            self.assertLess(log_linear_product, 0.0)
            self.assertGreater(log_locked_product, 0.0)
        self.assertEqual(2400 * 4, 9600)
        self.assertIn(r"N_{\rm proj}=2^{2400p^2}=2^{9600\lambda^2}", self.text)
        self.assertIn("A fixed Fourier cutoff, or `N_proj=O(L)`", self.text)

    def test_physical_parity_and_bridge_boundary(self) -> None:
        required = (
            "physical inversion-even sector",
            "physical inversion-odd sector",
            "positive-at-origin residue-two convention",
            "every Hermite source displayed here is even in `x`",
            "mixes the two Fourier phases through",
            "endpoint shear is an invertible congruence",
            "captured source ranges are not proved to be",
            "retained multiplier-dangerous complement",
            "source-label depth",
            "log-Fourier projection cutoff",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

    def test_finite_diagnostic_is_not_certified(self) -> None:
        required = (
            "4.312473215141095",
            "7.638771822333190",
            "6.105885368581463",
            "3.014894535013564",
            "3.340087891628824",
            "2.621968317272557",
            "5.494068248875289",
            "interval certificates",
            "neither contradict nor\ncertify",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

    def test_fail_closed_claim_boundary(self) -> None:
        required = (
            "P0_INVALIDATED",
            "only restricted-source statements",
            "do not prove either sign on the whole physical",
            "does not prove",
            "whole even complement",
            "whole odd sector",
            "No numerical value",
            "No conclusion in Sections 2--6",
            "paired whole-sector `U_Z` signs remain the RH-strength",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)
        forbidden = (
            "proves the Riemann hypothesis",
            "N=7 certifies",
            "N=14 certifies",
            "captured source ranges exhaust",
            "fixed Fourier cutoff satisfies (7.3)",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, self.text)

    def test_ascii_tex_and_python_hygiene(self) -> None:
        NOTE.read_text(encoding="ascii")
        self.assertNotIn("DRAFT", self.text)
        self.assertNotRegex(self.text, re.compile(r"(?<!\\)\$"))
        self.assertEqual(self.text.count(r"\begin{aligned}"), self.text.count(r"\end{aligned}"))
        self.assertEqual(self.text.count("```"), 0)
        ast.parse(TEST.read_text(encoding="utf-8"), filename=str(TEST))


if __name__ == "__main__":
    unittest.main()
