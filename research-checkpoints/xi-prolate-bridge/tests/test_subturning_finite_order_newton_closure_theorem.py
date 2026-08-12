#!/usr/bin/env python3
"""Regressions for the subturning finite-order Newton closure theorem."""

from __future__ import annotations

import ast
from fractions import Fraction
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SUBTURNING_FINITE_ORDER_NEWTON_CLOSURE_THEOREM.md"
NOTE_HASH = "b6597337ed033bf889eb31d06da669edb7a97ddc1e32a4c9c90fb5185dad7dc4"

FROZEN = {
    "notes/SUBTURNING_MINIMAL_RICCATI_EULER_CLOSURE_BARRIER.md":
        "faa787a3cc96fe83f41aeeec44b868feaa1e6755b90b925921e2448c3e029ac8",
    "tests/test_subturning_minimal_riccati_euler_closure_barrier.py":
        "6b2e347793020deb48730a3d11ce36c1f8f926e2c63768f376f1c4bbbd54a204",
    "notes/SUBTURNING_LAPLACE_VOLTERRA_TURNING_RESONANCE_BARRIER.md":
        "0c702f4adc6e6487d0511ce6f1dcce308996c943ff52423d100546288b4a3127",
    "tests/test_subturning_laplace_volterra_turning_resonance_barrier.py":
        "bd93da5b3d322cb95d878fff85650f070c1b3f1377349881a246938ddd268622",
    "notes/SUBTURNING_FIRST_CHERRY_GLOBAL_WIENER_CLOSURE_BARRIER.md":
        "e842c084080a4d2a2c101bbb6b113031151065c527685c43095ee5a0ab2b04f7",
    "tests/test_subturning_first_cherry_global_wiener_closure_barrier.py":
        "1d2c6662e8b09905308a3b08cf8607a4e924aa27df796e392d02397cdbd6eaf8",
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


def action(c_value: mp.mpf, s_value: mp.mpc) -> mp.mpc:
    scaled = s_value / (2 * c_value)
    return c_value * (
        mp.sqrt(1 + scaled * scaled)
        - 1
        - scaled * mp.asinh(scaled)
    )


def polynomial(label: int, s_value: mp.mpc) -> mp.mpc:
    if label == 0:
        return mp.mpc(1)
    if label == 4:
        return 4 * s_value * (s_value - 1) + 3
    raise ValueError(label)


def alpha(label: int, c_value: mp.mpf, s_value: mp.mpc) -> mp.mpc:
    return (
        (s_value + 2)
        / (s_value + 1)
        * polynomial(label, s_value + 4)
        / polynomial(label, s_value)
        * mp.exp(
            action(c_value, s_value + label + 3)
            - action(c_value, s_value + label - 1)
        )
    )


def w_value(label: int, c_value: mp.mpf, s_value: mp.mpc) -> mp.mpc:
    gamma_ratio = mp.gamma((s_value + 2) / 2) / mp.gamma((s_value + 1) / 2)
    return (
        gamma_ratio
        * polynomial(label, s_value)
        * polynomial(label, s_value + 2)
        * mp.exp(
            action(c_value, s_value + label - 1)
            + action(c_value, s_value + label + 1)
        )
    )


def rho0(c_value: mp.mpf, x_value: mp.mpf) -> mp.mpf:
    return 1 / (1 + x_value) + c_value / (c_value + x_value)


def rho1(c_value: mp.mpf, x_value: mp.mpf) -> mp.mpf:
    return 1 / (1 + x_value) ** 2 + c_value / (c_value + x_value) ** 2


def m_integral(c_value: mp.mpf, start: mp.mpf, stop: mp.mpf) -> mp.mpf:
    if stop <= c_value:
        return (stop * stop - start * start) / (2 * c_value)
    if start >= c_value:
        return stop * mp.log(stop / c_value) - start * mp.log(start / c_value)
    return m_integral(c_value, start, c_value) + m_integral(
        c_value, c_value, stop
    )


class SubturningFiniteOrderNewtonClosureTheoremTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 55
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_gamma_action_gauge(self) -> None:
        for c_text in ("100", "10000"):
            c_value = mp.mpf(c_text)
            for label in (0, 4):
                for s_value in (
                    mp.mpc("1.25", "3.5"),
                    mp.mpc("7.75", "-21"),
                    mp.mpc("31", "125"),
                ):
                    gauge_ratio = w_value(label, c_value, s_value + 2) / w_value(
                        label, c_value, s_value
                    )
                    self.assertLess(
                        abs(gauge_ratio - alpha(label, c_value, s_value)),
                        mp.mpf("2e-48"),
                    )

    def test_exact_degree_thirteen_residual_identity(self) -> None:
        length = 5
        order = 13
        alpha_values = [Fraction(index + 2, index + 5) for index in range(length)]
        forcing = [Fraction((-1) ** index, index + 7) for index in range(length)]

        def shift(values: list[Fraction]) -> list[Fraction]:
            return values[1:] + [Fraction(0)]

        def inverse_l(values: list[Fraction]) -> list[Fraction]:
            answer = [Fraction(0) for _ in range(length)]
            for index in range(length - 1, -1, -1):
                successor = answer[index + 1] if index + 1 < length else Fraction(0)
                answer[index] = values[index] - alpha_values[index] * successor
            return answer

        terms: list[list[Fraction] | None] = [None] * (order + 1)
        terms[1] = inverse_l([-value for value in forcing])
        for degree in range(2, order + 1):
            previous = terms[degree - 1]
            assert previous is not None
            rhs = [-forcing[index] * previous[index] for index in range(length)]
            for left_degree in range(1, degree):
                left = terms[left_degree]
                right = terms[degree - left_degree]
                assert left is not None and right is not None
                shifted_right = shift(right)
                for index in range(length):
                    rhs[index] -= (
                        alpha_values[index] * left[index] * shifted_right[index]
                    )
            terms[degree] = inverse_l(rhs)

        approximation = [
            sum((terms[degree][index] for degree in range(1, order + 1)), Fraction(0))
            for index in range(length)
        ]
        shifted_approximation = shift(approximation)
        residual = [
            approximation[index]
            + alpha_values[index] * shifted_approximation[index]
            + forcing[index]
            + forcing[index] * approximation[index]
            + alpha_values[index]
            * approximation[index]
            * shifted_approximation[index]
            for index in range(length)
        ]
        x_order = terms[order]
        assert x_order is not None
        explicit = [forcing[index] * x_order[index] for index in range(length)]
        for left_degree in range(1, order + 1):
            left = terms[left_degree]
            assert left is not None
            for right_degree in range(1, order + 1):
                if left_degree + right_degree <= order:
                    continue
                right = terms[right_degree]
                assert right is not None
                shifted_right = shift(right)
                for index in range(length):
                    explicit[index] += (
                        alpha_values[index]
                        * left[index]
                        * shifted_right[index]
                    )
        self.assertEqual(residual, explicit)

    def test_exact_residual_linearization_factorization(self) -> None:
        samples = (
            (mp.mpc("0.01", "-0.02"), mp.mpc("0.002", "0.001"),
             mp.mpc("0.8", "0.1"), mp.mpc("-0.03", "0.04")),
            (mp.mpc("-0.2", "0.1"), mp.mpc("0.03", "-0.02"),
             mp.mpc("1.1", "-0.25"), mp.mpc("0.07", "0.02")),
        )
        for x_value, f_value, alpha_value, shifted_x in samples:
            residual = x_value + (1 + x_value) * (
                f_value + alpha_value * shifted_x
            )
            a_value = 1 + f_value + alpha_value * shifted_x
            b_value = alpha_value * (1 + x_value)
            self.assertLess(
                abs(1 + residual - (1 + x_value) * a_value),
                mp.mpf("1e-52"),
            )
            self.assertLess(
                abs(
                    b_value / a_value
                    - alpha_value * (1 + x_value) ** 2 / (1 + residual)
                ),
                mp.mpf("1e-52"),
            )

    def test_action_real_decrease_on_subturning_samples(self) -> None:
        minimum_ratio = mp.inf
        for c_text in ("1e3", "1e5", "1e8"):
            c_value = mp.mpf(c_text)
            height = 2 * c_value ** (mp.mpf(3) / 4)
            for label in (0, 4):
                for y_value in (-height, mp.mpf(0), height):
                    for x_value in (
                        mp.mpf(1),
                        mp.sqrt(c_value),
                        c_value,
                        2 * c_value,
                        10 * c_value,
                    ):
                        derivative = -mp.re(
                            -mp.mpf(1)
                            / 2
                            * (
                                mp.asinh(
                                    (x_value + 1j * y_value + label - 1)
                                    / (2 * c_value)
                                )
                                + mp.asinh(
                                    (x_value + 1j * y_value + label + 1)
                                    / (2 * c_value)
                                )
                            )
                        )
                        scale = (
                            x_value / c_value
                            if x_value <= c_value
                            else 1 + mp.log(x_value / c_value)
                        )
                        minimum_ratio = min(minimum_ratio, derivative / scale)
        self.assertGreater(minimum_ratio, mp.mpf("0.19"))

    def test_forward_w_ratio_action_envelope_samples(self) -> None:
        kappa = mp.mpf("0.05")
        worst = mp.mpf(0)
        for c_text in ("1e3", "1e5"):
            c_value = mp.mpf(c_text)
            height = 2 * c_value ** (mp.mpf(3) / 4)
            for label in (0, 4):
                for y_value in (mp.mpf(0), height, -height):
                    for x_value in (mp.mpf(1), mp.sqrt(c_value), c_value):
                        for r_value in (
                            mp.mpf(2),
                            mp.sqrt(c_value),
                            2 * c_value,
                        ):
                            s_value = x_value + 1j * y_value
                            ratio = abs(
                                w_value(label, c_value, s_value + r_value)
                                / w_value(label, c_value, s_value)
                            )
                            envelope = (
                                (1 + x_value + r_value) / (1 + x_value)
                            ) ** 5 * mp.exp(
                                -kappa
                                * m_integral(
                                    c_value, x_value, x_value + r_value
                                )
                            )
                            worst = max(worst, ratio / envelope)
        self.assertLess(worst, mp.mpf("1.35"))

    def test_weight_sums_and_product_growth(self) -> None:
        for c_value in (mp.mpf("100"), mp.mpf("10000")):
            for x_value in (mp.mpf(1), mp.sqrt(c_value), 2 * c_value):
                sum_one = mp.fsum(
                    rho1(c_value, x_value + 2 * index) / c_value
                    for index in range(200000)
                )
                self.assertLess(sum_one, mp.mpf("0.02"))
                for count in (1, 10, 1000, 100000):
                    log_product = mp.fsum(
                        rho0(c_value, x_value + 2 * index) / c_value
                        for index in range(count)
                    )
                    log_scale = 1 + mp.log(
                        (c_value + x_value + 2 * count) / (c_value + x_value)
                    )
                    self.assertLess(log_product, log_scale)

    def test_newton_exponent_ledger(self) -> None:
        inverse_exponent = 6
        truncation_order = 13
        residual_order = truncation_order + 1
        correction_exponent = inverse_exponent - residual_order
        lipschitz_exponent = 2 * inverse_exponent - residual_order
        self.assertEqual(correction_exponent, -8)
        self.assertEqual(lipschitz_exponent, -2)
        self.assertGreater(residual_order - inverse_exponent, 0)
        self.assertGreater(residual_order - 2 * inverse_exponent, 0)
        derivative_ledger = lambda degree, order: order + 12 * (degree + 1)
        self.assertEqual(derivative_ledger(truncation_order, 0), 168)
        for degree in range(2, truncation_order + 1):
            for order in (0, 3, 12):
                self.assertEqual(
                    derivative_ledger(degree - 1, order + 12),
                    derivative_ledger(degree, order),
                )

    def test_exact_lower_strip_riccati_and_recurrence_extension(self) -> None:
        samples = (
            (
                mp.mpc("0.7", "-0.2"),
                mp.mpc("0.8", "0.1"),
                mp.mpc("1.1", "-0.05"),
                mp.mpc("-0.03", "0.02"),
                mp.mpc("0.01", "-0.04"),
                mp.mpc("1.2", "0.3"),
            ),
            (
                mp.mpc("0.52", "-31"),
                mp.mpc("0.9", "-0.02"),
                mp.mpc("0.98", "0.01"),
                mp.mpc("0.005", "0.002"),
                mp.mpc("-0.004", "0.003"),
                mp.mpc("0.7", "-0.1"),
            ),
        )
        for z_value, p_value, p_next, f_value, x_next, w_next in samples:
            alpha_value = (
                (z_value + 2) / (z_value + 1) * p_value * p_next
            )
            d_value = (
                (z_value + 1) / p_value * (1 + f_value)
                - (z_value + 2) * p_next
            )
            x_lower = -(
                f_value + alpha_value * x_next
            ) / (
                1 + f_value + alpha_value * x_next
            )
            riccati_residual = (
                x_lower
                + alpha_value * x_next
                + f_value
                + f_value * x_lower
                + alpha_value * x_lower * x_next
            )
            self.assertLess(abs(riccati_residual), mp.mpf("1e-52"))

            w_next_next = w_next * p_next * (1 + x_next)
            recurrence_value = (
                (z_value + 2) * w_next_next + d_value * w_next
            ) / (z_value + 1)
            ratio_value = w_next / (p_value * (1 + x_lower))
            self.assertLess(
                abs(recurrence_value - ratio_value),
                mp.mpf("1e-52"),
            )

    def test_finite_green_series_inverse_identity(self) -> None:
        c_value = mp.mpf("250")
        s_value = mp.mpc("3.25", "17")
        for label in (0, 4):
            values = []
            term = mp.mpc(1)
            total = mp.mpc(0)
            for index in range(900):
                h_value = mp.exp(-mp.mpf("0.03") * (s_value + 2 * index))
                total += (-1) ** index * term * h_value
                values.append((term, h_value))
                term *= alpha(label, c_value, s_value + 2 * index)

            shifted_term = mp.mpc(1)
            shifted_total = mp.mpc(0)
            for index in range(900):
                h_value = mp.exp(
                    -mp.mpf("0.03") * (s_value + 2 + 2 * index)
                )
                shifted_total += (-1) ** index * shifted_term * h_value
                shifted_term *= alpha(label, c_value, s_value + 2 + 2 * index)
            forcing = mp.exp(-mp.mpf("0.03") * s_value)
            residual = total + alpha(label, c_value, s_value) * shifted_total - forcing
            self.assertLess(abs(residual), mp.mpf("1e-43"))
            self.assertLess(abs(term), mp.mpf("1e-43"))

    def test_polynomial_loss_is_compatible_with_old_resonant_model(self) -> None:
        for c_value in (10.0, 100.0, 10000.0):
            for length in (10.0 * c_value, 100.0 * c_value):
                amplitude = c_value / length
                inverse_gain = length / 2.0
                normalized_output = amplitude * inverse_gain
                self.assertLessEqual(normalized_output, c_value)
                self.assertAlmostEqual(normalized_output, c_value / 2.0)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 60)
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

    def test_static_hygiene_cache_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))
            self.assertTrue(raw.endswith(b"\n"))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "does not prove an all-tree estimate",
            "global positive-support Wiener class",
            "thirteen fixed perturbative orders",
            "polynomially bounded Newton correction",
            "w_j(s)=g_j(s)e^{{\\cal A}_j(s)}",
            "no Riemann-hypothesis implication",
            "project state remains `P0_INVALIDATED`",
            "finite-loss estimate",
            "twenty-four more derivatives than the mixed output",
            "D(13,0)=168",
            "one-step Riccati extension",
            "rather than an evaluation of (0.2) outside",
            "finite identity",
            "A=6",
            "14-2A=2>0",
            "all-tree `O(C^|tau|)` kernel theorem remains neither proved nor needed",
            "unbound post-checkpoint-1.46 theorem/test pair",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "the Riemann hypothesis follows",
            "P0_VALIDATED",
            "uniform global Wiener inverse",
            "turning resonance is removed",
            "all trees are uniformly bounded",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, normalized)
        self.assertNotIn("H_j(s)=D_c(s+j-1)+D_c(s+j+1)", normalized)
        self.assertNotIn(",qquad", normalized)
        self.assertNotIn("a,y+b,Sy", normalized)

        cache_entries = [
            path
            for path in ROOT.rglob("*")
            if path.name == "__pycache__" or path.suffix in {".pyc", ".pyo"}
        ]
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main()
