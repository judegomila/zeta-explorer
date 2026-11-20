#!/usr/bin/env python3
"""Regressions for the subturning minimal-Riccati closure barrier."""

from __future__ import annotations

import ast
import cmath
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SUBTURNING_MINIMAL_RICCATI_EULER_CLOSURE_BARRIER.md"
NOTE_HASH = "faa787a3cc96fe83f41aeeec44b868feaa1e6755b90b925921e2448c3e029ac8"

FROZEN = {
    "notes/EXACT_PROLATE_MELLIN_RECURRENCE_BIRKHOFF_CONNECTION_BARRIER.md":
        "d1191bdc6f0d2edd0ae900e1a7d73f61cea7f78693e2074b6850df7aec36a041",
    "tests/test_exact_prolate_mellin_recurrence_birkhoff_connection_barrier.py":
        "836949d060b03d697574731aad2ede90241b2f6ccb29e58d123908218ef7955f",
    "notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md":
        "d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd",
    "tests/test_first_prolate_correction.py":
        "9f424a931f3a9435ec0ce9883b07201afe9b85cf56fcdda81644050e876ef991",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def action(c_value: float, sigma: complex) -> complex:
    value = sigma / (2.0 * c_value)
    return c_value * (
        cmath.sqrt(1.0 + value * value)
        - 1.0
        - value * cmath.asinh(value)
    )


def action_prime(c_value: float, sigma: complex) -> complex:
    return -0.5 * cmath.asinh(sigma / (2.0 * c_value))


def polynomial(label: int, s_value: complex) -> complex:
    if label == 0:
        return 1.0 + 0.0j
    if label == 4:
        return 4.0 * s_value * (s_value - 1.0) + 3.0
    raise ValueError(label)


def trial_ratio(label: int, c_value: float, s_value: complex) -> complex:
    shift = label - 1
    return (
        cmath.exp(
            action(c_value, s_value + shift + 2.0)
            - action(c_value, s_value + shift)
        )
        * polynomial(label, s_value + 2.0)
        / polynomial(label, s_value)
    )


def trial_symbols(
    label: int,
    c_value: float,
    a_value: float,
    s_value: complex,
) -> tuple[complex, complex, complex]:
    p_value = trial_ratio(label, c_value, s_value)
    p_next = trial_ratio(label, c_value, s_value + 2.0)
    residual = (
        (s_value + 2.0) * p_next
        + (s_value + 2.0) * (s_value + 1.0) / c_value
        - a_value
        - (s_value + 1.0) / p_value
    )
    anchor = (s_value + 1.0) / p_value
    alpha = (s_value + 2.0) / (s_value + 1.0) * p_value * p_next
    return p_value, residual / anchor, alpha


class SubturningMinimalRiccatiEulerClosureBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 4)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_nonlinear_riccati_identity(self) -> None:
        for label, a_value in ((0, 1.003), (4, 8.997)):
            c_value = 317.0
            s_value = 2.25 - 19.0j
            p_value, f_value, alpha = trial_symbols(
                label, c_value, a_value, s_value
            )
            r_next = 0.73 + 0.11j
            r_value = (s_value + 1.0) / (
                (s_value + 2.0) * r_next
                + (s_value + 2.0) * (s_value + 1.0) / c_value
                - a_value
            )
            x_value = r_value / p_value - 1.0
            x_next = (
                r_next / trial_ratio(label, c_value, s_value + 2.0) - 1.0
            )
            left = x_value + alpha * x_next
            right = -f_value - f_value * x_value - alpha * x_value * x_next
            self.assertLess(abs(left - right), 2e-14)

    def test_exact_gamma_action_gauge(self) -> None:
        c_value = 911.0
        s_value = 3.25
        for label in (0, 4):
            p_value = trial_ratio(label, c_value, s_value)
            p_next = trial_ratio(label, c_value, s_value + 2.0)
            gamma_ratio = (
                math.gamma((s_value + 2.0) / 2.0)
                / math.gamma((s_value + 1.0) / 2.0)
            )
            gamma_ratio_next = (
                math.gamma((s_value + 4.0) / 2.0)
                / math.gamma((s_value + 3.0) / 2.0)
            )
            gauge_ratio = gamma_ratio_next / gamma_ratio * p_value * p_next
            alpha = (s_value + 2.0) / (s_value + 1.0) * p_value * p_next
            self.assertLess(abs(gauge_ratio - alpha), 2e-14)

    def test_finite_euler_identity_for_even_and_odd_depth(self) -> None:
        original = [F((index + 1) ** 5 - 3 * index, 17) for index in range(31)]
        original.extend([F(0)] * 30)
        exact = sum((-1) ** index * value for index, value in enumerate(original))
        for depth in (0, 1, 5, 12, 13):
            local = F(0)
            current = original
            for order in range(depth):
                local += F((-1) ** order, 2 ** (order + 1)) * current[0]
                current = [
                    current[index + 1] - current[index]
                    for index in range(len(current) - 1)
                ]
            remainder = F((-1) ** depth, 2**depth) * sum(
                (-1) ** index * value for index, value in enumerate(current)
            )
            self.assertEqual(exact, local + remainder)

    def test_missing_vertical_phase_term_is_a_real_counterexample(self) -> None:
        target = math.asin(0.25)
        for c_value in (1.0e5, 1.0e6, 1.0e7):
            s_value = math.sqrt(c_value) + 0.5j * c_value
            for label in (0, 4):
                phase = (
                    action_prime(c_value, s_value + label - 1)
                    + action_prime(c_value, s_value + label + 1)
                )
                self.assertLess(abs(abs(phase) - target), 0.01)
            omitted = (
                1.0 / (1.0 + math.sqrt(c_value))
                + 1.0 / math.sqrt(c_value)
                + math.sqrt(c_value) / c_value
            )
            corrected = omitted + 0.5
            self.assertLess(omitted, 0.011)
            self.assertGreater(corrected, target)

    def test_c_three_quarters_power_count(self) -> None:
        for c_value in (1.0e4, 1.0e6, 1.0e8):
            y_value = c_value ** 0.75
            power = c_value ** (9.0 / 4.0 + 0.5) * (y_value / c_value) ** 12
            self.assertAlmostEqual(power, c_value ** -0.25, places=11)

    def test_resonant_c1_inverse_norm_diverges(self) -> None:
        # For g_R=A exp(i*pi*s/2) exp(-s/R), the alternating signs cancel.
        previous = 0.0
        for radius in (20.0, 100.0, 500.0, 2500.0):
            amplification = 1.0 / (1.0 - math.exp(-2.0 / radius))
            self.assertGreater(amplification, previous)
            self.assertAlmostEqual(amplification / radius, 0.5, delta=0.026)
            # Differentiation multiplies input and output by the same factor.
            derivative = abs(0.5j * math.pi - 1.0 / radius)
            c1_ratio = max(amplification, amplification * derivative) / max(
                1.0, derivative
            )
            self.assertAlmostEqual(c1_ratio, amplification, places=12)
            previous = amplification

    def test_exact_casoratian_transport(self) -> None:
        c_value = F(29)
        a_value = F(17, 3)
        s_value = F(11, 4)

        def advance(previous: F, current: F, center: F) -> F:
            coefficient = (center + 2) * (center + 1) / c_value - a_value
            return ((center + 1) * previous - coefficient * current) / (
                center + 2
            )

        u_zero, u_two = F(2, 3), F(7, 5)
        v_zero, v_two = F(-5, 7), F(11, 9)
        u_four = advance(u_zero, u_two, s_value)
        v_four = advance(v_zero, v_two, s_value)
        omega = u_two * v_zero - u_zero * v_two
        omega_next = u_four * v_two - u_two * v_four
        self.assertEqual(omega_next, -F(s_value + 1, s_value + 2) * omega)

    def test_conditional_annulus_suppression_at_y_c(self) -> None:
        for c_value in (1.0e3, 1.0e4, 1.0e5):
            height = c_value ** 0.75
            target = height / 2.0
            log_boundary = math.pi * height / 4.0 + 0.2 * height**2 / c_value
            log_tail = log_boundary - math.pi * (height - target)
            self.assertLess(log_tail, -0.2 * math.pi * height)

    def test_locked_height_lies_inside_conditional_window(self) -> None:
        lambda_value = 100_000_000.0
        length = 2.0 * math.log(lambda_value)
        cutoff = math.ceil(lambda_value * length**3)
        height = 2.0 * math.pi * (cutoff + 1) / length
        c_value = 2.0 * math.pi * lambda_value**2
        y_value = c_value**0.75
        error = 1.0 / height + height / c_value
        self.assertLess(height, y_value / 2.0)
        self.assertLess(error, 1.01 * length**2 / lambda_value)

    def test_anchor_scaling_has_no_missing_lambda_power(self) -> None:
        for lambda_value in (100.0, 1000.0, 10000.0):
            c_value = 2.0 * math.pi * lambda_value**2
            weighted_remainder = lambda_value**-4 * lambda_value**1.5 / math.sqrt(3.0)
            first_correction = lambda_value**-2
            self.assertLess(weighted_remainder, 1.0 / c_value)
            self.assertAlmostEqual(first_correction * c_value, 2.0 * math.pi)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_static_hygiene_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "does **not** prove the subturning Birkhoff connection estimate",
            "Closure Lemma CL (unproved)",
            "exact cancellation",
            "counterexample to the earlier slow-symbol derivative claim",
            "top-seminorm obstruction",
            "finite list of pointwise derivative bounds",
            "all-order analytic or tail-seminorm space",
            "both products in (7.2) are `o(n^(-1/2))`",
            "There is no missing lambda factor",
            "(0.3) remains conditional",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "This note proves the local complex Mellin estimate",
            "Banach iteration gives a unique Watson-minimal analytic solution",
            "Combining (5.6), (6.4), (7.6), and (7.8) proves",
            "the Riemann hypothesis is proved",
            "RH follows",
            "actual arithmetic sign is negative",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)


if __name__ == "__main__":
    unittest.main()
