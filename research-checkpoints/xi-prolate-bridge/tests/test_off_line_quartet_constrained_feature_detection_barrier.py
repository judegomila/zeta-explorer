#!/usr/bin/env python3
"""Regressions for the off-line quartet feature-detection barrier."""

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
NOTE = (
    ROOT
    / "notes"
    / "OFF_LINE_QUARTET_CONSTRAINED_FEATURE_DETECTION_BARRIER.md"
)
TEST = Path(__file__).resolve()
NOTE_HASH = "8ca421aeb09392da8864f6f36a5298ba39b2ff9355584c9a602a020aa052719d"

FROZEN = {
    "notes/GROWING_SIGNED_DISCREPANCY_CENTERED_ZERO_KREIN_FACTORIZATION_BARRIER.md":
        "0257bb5582700fada40fc2a6c6ba578a09fad94e11eb4fa0f72a525c80bd04c9",
    "notes/CENTERED_ZERO_PALEY_WIENER_INTERPOLATION_OBSTRUCTION.md":
        "b23720bd4c05afbda4aa3f50176ff0580bacda0668264fd4fcc075b7c43d5ae2",
    "notes/CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md":
        "c9b4513fb0afa57a396f3c1bf7326bb94969d4c8d51a245ea66fa64c1889061e",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md":
        "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    "notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md":
        "caaa4df57d43f74ef56fed6df907da6db0daa7b0f89da23cce30bc2ac9369acd",
    "notes/LOCKED_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md":
        "5cc71bf159432e4b651ecad4db2b1702a5288e647ce4025fcf1fb3378bd36d2c",
    "notes/ODD_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md":
        "85efc9bcb2228f0007af10943c693276b8a819fe9198bd76176d4a329574657a",
    "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md":
        "78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3",
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md":
        "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md":
        "3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def interval_gram(beta: float, gamma: float, a: float, parity: int) -> np.ndarray:
    nodes, weights = np.polynomial.legendre.leggauss(500)
    x = a * nodes
    weights = a * weights
    if parity == 1:
        rows = np.vstack(
            (
                2.0 * np.cosh(beta * x) * np.cos(gamma * x),
                2.0 * np.sinh(beta * x) * np.sin(gamma * x),
            )
        )
    else:
        rows = np.vstack(
            (
                2.0 * np.sinh(beta * x) * np.cos(gamma * x),
                2.0 * np.cosh(beta * x) * np.sin(gamma * x),
            )
        )
    return (rows * weights) @ rows.T


class OffLineQuartetFeatureDetectionBarrierTests(unittest.TestCase):
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

    def test_endpoint_matrix_eigenvalues_are_phase_independent(self) -> None:
        beta = 0.23
        gamma = 1.7
        expected = np.array(
            [
                1.0 / (4.0 * beta) - 1.0 / (4.0 * math.hypot(beta, gamma)),
                1.0 / (4.0 * beta) + 1.0 / (4.0 * math.hypot(beta, gamma)),
            ]
        )
        for theta in (0.0, 0.4, 2.2, 5.7):
            integral = 1.0 / (2.0 * beta)
            oscillatory = np.exp(2j * theta) / (2.0 * beta + 2j * gamma)
            matrix = np.array(
                [
                    [(integral + oscillatory.real) / 2.0, oscillatory.imag / 2.0],
                    [oscillatory.imag / 2.0, (integral - oscillatory.real) / 2.0],
                ]
            )
            self.assertTrue(np.allclose(np.linalg.eigvalsh(matrix), expected))
        self.assertIn(r"{1\over4\beta}\mathbin\pm", self.text)

    def test_both_physical_parities_have_the_claimed_interval_floor(self) -> None:
        beta = 0.23
        gamma = 1.7
        a = 18.0
        coefficient = 0.5 * (
            1.0 / beta - 1.0 / math.hypot(beta, gamma)
        )
        lower = math.exp(2.0 * beta * a) * coefficient - 4.0 * a - 2.0 / beta
        leading = math.exp(2.0 * beta * a) * coefficient
        for parity in (1, -1):
            smallest = float(np.linalg.eigvalsh(interval_gram(beta, gamma, a, parity))[0])
            self.assertGreater(smallest, lower)
            self.assertLess(abs(smallest / leading - 1.0), 0.02)
        self.assertIn("physical inversion parity", self.text)
        self.assertIn(r"O_z(\lambda^{-\beta})", self.text)
        self.assertIn(r"f_{z,+}^{\rm neg}=J_{z,+}\binom01", self.text)
        self.assertIn(r"f_{z,-}^{\rm neg}=J_{z,-}\binom10", self.text)
        self.assertIn("not Hermite source residues", self.text)

    def test_three_row_critical_feature_has_linear_schur_complement(self) -> None:
        beta = 0.23
        gamma = 1.7
        eta = 3.2
        ratios = []
        for a in (10.0, 14.0, 18.0):
            nodes, weights = np.polynomial.legendre.leggauss(500)
            x = a * nodes
            weights = a * weights
            rows = np.vstack(
                (
                    2.0 * np.cosh(beta * x) * np.cos(gamma * x),
                    2.0 * np.sinh(beta * x) * np.sin(gamma * x),
                    np.cos(eta * x),
                )
            )
            gram = (rows * weights) @ rows.T
            schur = gram[2, 2] - gram[2, :2] @ np.linalg.solve(
                gram[:2, :2], gram[:2, 2]
            )
            ratios.append(float(schur / a))
            self.assertGreater(float(np.linalg.eigvalsh(gram)[0]), 0.25 * a)
        self.assertLess(max(abs(ratio - 1.0) for ratio in ratios), 0.03)
        self.assertIn("three-row Gram", self.text)
        self.assertIn("projected-anchor removal", self.text)

    def test_metric_gram_is_invariant_under_endpoint_shear(self) -> None:
        rng = np.random.default_rng(8122026)
        channel_synthesis = rng.normal(size=(2, 4))
        raw = rng.normal(size=(4, 4))
        metric = raw.T @ raw + np.eye(4)
        shear = rng.normal(size=(4, 4))
        while abs(np.linalg.det(shear)) < 0.1:
            shear = rng.normal(size=(4, 4))
        before = channel_synthesis @ np.linalg.inv(metric) @ channel_synthesis.T
        after = (
            channel_synthesis
            @ shear
            @ np.linalg.inv(shear.T @ metric @ shear)
            @ shear.T
            @ channel_synthesis.T
        )
        self.assertTrue(np.allclose(before, after, atol=2e-12))
        self.assertIn(r"\mathcal G_z(W,D)", self.text)
        self.assertIn("leaves (4.2) unchanged", self.text)

    def test_proper_dangerous_range_can_erase_one_channel(self) -> None:
        # Ambient channels have rank two, but a rank-one retained harmonic
        # range has a singular two-channel metric Gram.
        channels = np.eye(2)
        harmonic_lift = np.array([[1.0], [1.0]])
        metric = np.array([[3.0]])
        danger = (
            channels
            @ harmonic_lift
            @ np.linalg.inv(metric)
            @ harmonic_lift.T
            @ channels.T
        )
        self.assertEqual(np.linalg.matrix_rank(channels), 2)
        self.assertEqual(np.linalg.matrix_rank(danger), 1)
        self.assertAlmostEqual(float(np.linalg.det(danger)), 0.0)
        self.assertIn(r"\mathcal G_{z,\epsilon}^{\rm dang}", self.text)
        self.assertIn("Equation (4.4) is the earliest missing matrix", self.text)

    def test_exact_multiplicity_aware_mask(self) -> None:
        quartet_multiplicity = Fraction(3)
        critical_multiplicity = Fraction(2)
        critical_value_squared = quartet_multiplicity / critical_multiplicity
        negative_entry = (
            -quartet_multiplicity
            + 2 * critical_multiplicity * critical_value_squared
        )
        self.assertEqual(negative_entry, quartet_multiplicity)
        self.assertIn(r"\sqrt{m/n}", self.text)
        self.assertIn(r"mI_2>0", self.text)
        self.assertIn("does not\nclaim that the actual dangerous projector", self.text)

    def test_rh_converse_requires_restricted_sampling_floors(self) -> None:
        required = (
            r"N=N_{\rm lock}(\lambda)=2^{2400p^2}=2^{9600\lambda^2}",
            r"\text{eventual paired }U_Z\text{ signs}",
            r"2\,\sigma_{\min}^2",
            r"Z_{\lambda,+}|_{\kappa^\perp}",
            "U_Z=o(d_6)",
            "extra converse hypothesis",
            "do not imply that theorem",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

    def test_fail_closed_scope(self) -> None:
        required = (
            "P0_INVALIDATED",
            "gives no sign for\nthe actual dangerous compression",
            "cannot currently be imposed together",
            "No frozen theorem\nproves even the strict inequality (4.5)",
            "not sufficient to dominate (5.1)",
            "not the actual zeta compression",
            "No such",
            "floor is frozen",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)
        forbidden = (
            "proves the Riemann hypothesis",
            "the actual dangerous projector has rank two",
            "quartet transversality implies RH",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, self.text)

    def test_ascii_tex_and_python_hygiene(self) -> None:
        NOTE.read_text(encoding="ascii")
        self.assertNotRegex(self.text, re.compile(r"(?<!\\)\$"))
        self.assertEqual(
            self.text.count(r"\begin{aligned}"),
            self.text.count(r"\end{aligned}"),
        )
        self.assertEqual(self.text.count("```"), 0)
        ast.parse(TEST.read_text(encoding="utf-8"), filename=str(TEST))


if __name__ == "__main__":
    unittest.main()
