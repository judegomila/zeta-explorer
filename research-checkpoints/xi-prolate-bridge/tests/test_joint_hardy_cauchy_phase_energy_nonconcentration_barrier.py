#!/usr/bin/env python3
"""Regressions for the joint Hardy--Cauchy nonconcentration barrier."""

from __future__ import annotations

import ast
import cmath
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "JOINT_HARDY_CAUCHY_PHASE_ENERGY_NONCONCENTRATION_BARRIER.md"
)
NOTE_HASH = "69b985d600f1a9cc5f3522ddaa6a4d4a242e9e3f9907a7deed0abe93e06039d7"

FROZEN = {
    "notes/IDEAL_STOKES_ALTERNATING_CAUCHY_FILTER_REDUCTION.md":
        "fb68a7b26abdbc938536c88c9e9780314c0d8b4fc794f24d69a0d4cd8b5a30d2",
    "tests/test_ideal_stokes_alternating_cauchy_filter_reduction.py":
        "696b74f6743aa7fbd6d1d784381386efc9b588cbd3e9d5eecbe57d822374d6b0",
    "notes/HSW_CONTINUOUS_L_PHASE_SHELL_THEOREM.md":
        "49a53cb1f8ee6db85040cd39aa6faa4fff0296d8bb8b99b18e830efce63df70e",
    "tests/test_hsw_continuous_l_phase_shell_theorem.py":
        "54e28858ad50a9b29578ff7719a2bb9818e02d7f275530a9da8cc15a023b6d9f",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def locked_parameters(length: float) -> tuple[int, float, float, float, float]:
    carrier = math.ceil(math.exp(length / 2.0) * length**3) + 1
    spacing = 2.0 * math.pi / length
    height = carrier * spacing
    log_height = math.log(height / (2.0 * math.pi))
    omega = length / 4.0
    beta = log_height / 4.0 - length / 8.0
    return carrier, spacing, height, omega, beta


def multiplier(alpha: float, spacing: float, frequency: float) -> complex:
    return 1.0 / (
        1.0 + cmath.exp(-alpha * spacing + 1j * frequency * spacing)
    )


class JointHardyCauchyPhaseEnergyNonconcentrationBarrierTests(
    unittest.TestCase
):
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

    def test_hsw_phase_good_set_measure_and_constants(self) -> None:
        hsw_width = 4.0 * math.pi * 0.103787
        amplitude = 4.0
        delta = 1.0
        shell = 6.0
        margin = shell - delta - amplitude / 2.0 - hsw_width
        phase = 0.5 - abs(math.sin(amplitude / 2.0)) / amplitude
        c_minus = phase * margin / (2.0 * math.pi)
        c_plus = (shell - delta) / (2.0 * math.pi) + 2.0 * 0.103787
        good_fraction = c_minus / (2.0 * c_plus - c_minus)

        self.assertGreater(margin, 0.0)
        self.assertGreater(c_minus, 0.0)
        self.assertGreater(c_plus, c_minus)
        self.assertGreater(good_fraction, 0.0)
        self.assertLess(good_fraction, 1.0)

        # This is the extremal two-level calculation behind (2.7).
        average = (c_minus / 2.0) * (1.0 - good_fraction)
        average += c_plus * good_fraction
        self.assertAlmostEqual(average, c_minus)

    def test_nonconcentration_and_covariance_constants(self) -> None:
        rho = 0.2
        phase = 0.3
        margin = 1.7
        shell = 6.0
        conservative = rho * phase * margin / (
            1024.0 * math.pi * shell**2
        )
        sharp = rho * phase * margin / (16.0 * math.pi * shell**2)
        self.assertGreater(conservative, 0.0)
        self.assertAlmostEqual(sharp / conservative, 64.0)

        multiplicity = 11
        weights = (2.0, 3.0, 5.0)
        exponential_sum = (4.0 + 1.0j, -2.0 + 3.0j, 1.0 - 2.0j)
        phases = tuple(
            (multiplicity - value.real) / 2.0
            for value in exponential_sum
        )
        left = sum(weight * phase_value for weight, phase_value in zip(
            weights, phases
        ))
        right = 0.5 * (
            multiplicity * sum(weights)
            - sum(
                weight * value.real
                for weight, value in zip(weights, exponential_sum)
            )
        )
        self.assertEqual(left, right)

    def test_correct_type_and_algebraic_density(self) -> None:
        for length in (40.0, 80.0, 160.0):
            _, spacing, height, omega, beta = locked_parameters(length)
            log_height = math.log(height / (2.0 * math.pi))
            exponential_type = omega + 2.0 * beta
            total_density = omega / math.pi + 2.0 * beta / math.pi

            self.assertGreater(beta, 0.0)
            self.assertAlmostEqual(exponential_type, log_height / 2.0)
            self.assertAlmostEqual(
                total_density,
                log_height / (2.0 * math.pi),
            )
            self.assertLess(spacing * exponential_type, 0.75 * math.pi)
            self.assertAlmostEqual(
                beta / math.log(length),
                0.5,
                delta=0.08,
            )

    def test_carrier_alignment_and_double_sinc_counting(self) -> None:
        # L=40 keeps the locked carrier integer exactly representable in a
        # binary64 mantissa, so this regression tests the identity rather
        # than large-argument trigonometric range reduction.
        length = 40.0
        carrier, spacing, height, omega, beta = locked_parameters(length)
        delta = 1.0
        shell = 5.0

        cosine_offsets = []
        index = 0
        while True:
            offset = (2 * index + 1) * spacing
            if offset > shell:
                break
            if offset >= delta:
                cosine_offsets.append(offset)
                gamma = height - offset
                normalized_exact = carrier - (2 * index + 1)
                reconstructed = (
                    normalized_exact * 2.0 * math.pi / length
                )
                self.assertLess(
                    abs(gamma - reconstructed) / height,
                    5e-16,
                )
            index += 1

        sinc_positions = 0
        index = 1
        while index * math.pi / beta <= shell:
            if index * math.pi / beta >= delta:
                sinc_positions += 1
            index += 1
        algebraic_sinc_count = 2 * sinc_positions

        width = shell - delta
        expected_cosine = width * omega / math.pi
        expected_sinc = width * 2.0 * beta / math.pi
        self.assertLessEqual(abs(len(cosine_offsets) - expected_cosine), 2.0)
        self.assertLessEqual(abs(algebraic_sinc_count - expected_sinc), 4.0)
        self.assertGreater(algebraic_sinc_count, sinc_positions)

    def test_exact_sinc_fourth_moment_ratio(self) -> None:
        integral_four = 2.0 * math.pi / 3.0
        integral_second = (
            4.0 * (math.pi * 2.0) - math.pi * 4.0
        ) / 8.0
        self.assertAlmostEqual(integral_second, math.pi / 2.0)
        self.assertAlmostEqual(integral_second / integral_four, 0.75)

        for beta in (1.5, 3.0, 7.0):
            norm = integral_four / beta
            second = integral_second / beta**3
            self.assertAlmostEqual(second / norm, 3.0 / (4.0 * beta**2))

    def test_multiplier_gap_and_localization_bound(self) -> None:
        alpha = 0.8
        epsilon = math.pi / 4.0
        for length in (60.0, 100.0, 180.0):
            _, spacing, _, omega, beta = locked_parameters(length)
            bandwidth = omega + 2.0 * beta
            self.assertLessEqual(
                spacing * bandwidth,
                math.pi - epsilon,
            )
            for frequency in (
                -bandwidth,
                -omega,
                0.0,
                omega,
                bandwidth,
            ):
                value = multiplier(alpha, spacing, frequency)
                denominator = abs(
                    1.0
                    + cmath.exp(
                        -alpha * spacing + 1j * frequency * spacing
                    )
                )
                derivative = (
                    spacing
                    * math.exp(-alpha * spacing)
                    / denominator**2
                )
                self.assertGreaterEqual(abs(value), 0.5 - 1e-15)
                self.assertLessEqual(abs(value), 1.0 / math.sin(epsilon))
                self.assertLessEqual(
                    derivative,
                    spacing / math.sin(epsilon) ** 2,
                )

            localization = (
                6.0 / (math.sin(epsilon) ** 2 * beta**2)
                + 8.0 * spacing**2 / math.sin(epsilon) ** 4
            )
            self.assertGreater(localization, 0.0)

    def test_normalized_joint_model_bound_tends_to_zero(self) -> None:
        values = []
        for length in (80.0, 160.0, 320.0, 640.0):
            _, spacing, height, _, beta = locked_parameters(length)
            bound = (
                beta**-2
                + spacing**2
                + (height * spacing) ** -2
                + beta / length
            )
            values.append(bound)
        self.assertTrue(
            all(right < left for left, right in zip(values, values[1:]))
        )
        self.assertLess(values[-1], 0.11)

    def test_finite_joint_model_uses_algebraic_row_weights(self) -> None:
        def sinc(value: float) -> float:
            if value == 0.0:
                return 1.0
            return math.sin(value) / value

        def finite_ratio(length: float) -> tuple[float, int, int]:
            carrier, spacing, height, omega, beta = locked_parameters(
                length
            )
            alpha = 0.8
            micro_radius = 0.4
            delta = 0.8
            shell = 4.5
            rows: list[tuple[float, int]] = []

            index = 0
            while (2 * index + 1) * spacing <= shell - micro_radius:
                offset = (2 * index + 1) * spacing
                if offset >= delta + micro_radius:
                    rows.append((offset, 1))
                index += 1

            index = 1
            while index * math.pi / beta <= shell - micro_radius:
                offset = index * math.pi / beta
                if offset >= delta + micro_radius:
                    # One sinc position is one distinct row but has
                    # algebraic multiplicity two.
                    rows.append((offset, 2))
                index += 1

            intervals = 200
            step = 2.0 * micro_radius / intervals
            numerator = 0.0
            denominator = 0.0
            for grid in range(intervals + 1):
                x_value = -micro_radius + grid * step
                quadrature_weight = (
                    0.5 if grid in (0, intervals) else 1.0
                )
                endpoint = 0.0
                cauchy_rows = [0.0 for _ in rows]
                moving_height = height + x_value

                for tail_index in range(180):
                    centered = x_value + tail_index * spacing
                    source = (
                        sinc(beta * centered) ** 2
                        * math.cos(omega * centered)
                    )
                    amplitude = (
                        (-1 if tail_index % 2 else 1)
                        * math.exp(-alpha * tail_index * spacing)
                        * source
                    )
                    endpoint += amplitude
                    node = moving_height + tail_index * spacing
                    for row_index, (offset, _) in enumerate(rows):
                        gamma = height - offset
                        moving_delta = offset + x_value
                        kernel = -gamma**2 / (
                            (moving_delta + tail_index * spacing)
                            * (node + gamma)
                        )
                        cauchy_rows[row_index] += amplitude * kernel

                denominator += quadrature_weight * endpoint**2
                for cauchy, (offset, multiplicity) in zip(
                    cauchy_rows, rows
                ):
                    gamma = height - offset
                    # gamma*L/2=pi*m-offset*L/2 exactly; this reduced
                    # phase avoids inaccurate huge-argument range reduction.
                    phase = (
                        -offset * length / 2.0
                        + gamma * x_value / height
                    )
                    numerator += (
                        quadrature_weight
                        * multiplicity
                        * math.sin(phase) ** 2
                        * cauchy**2
                        / gamma**2
                    )

            distinct_rows = len(rows)
            algebraic_rows = sum(weight for _, weight in rows)
            self.assertGreater(denominator, 0.0)
            self.assertGreaterEqual(algebraic_rows, distinct_rows)
            return (
                numerator / (math.log(height) * denominator),
                distinct_rows,
                algebraic_rows,
            )

        results = [finite_ratio(length) for length in (20.0, 30.0, 40.0)]
        ratios = [result[0] for result in results]
        self.assertTrue(
            all(right < left for left, right in zip(ratios, ratios[1:]))
        )
        self.assertLess(ratios[-1], 0.004)
        self.assertTrue(
            all(algebraic > distinct for _, distinct, algebraic in results)
        )

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(
            compiler,
            "pdflatex is required for TeX regression",
        )
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\usepackage{mathrsfs}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    compiler,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    source.name,
                ],
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
            self.assertTrue(
                all(line == line.rstrip(b" ") for line in raw.splitlines())
            )

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "explicit positive relative Lebesgue measure",
            "endpoint-energy nonconcentration gate",
            "factor `64`",
            "exactly equivalent to the covariance gap",
            "algebraic multiplicity",
            "multiplicity two",
            "At a collision the multiplicities add",
            "correct Riemann--Siegel type",
            "local zeta main density",
            "literal Lebesgue-measure one-vector joint estimate",
            "not the actual Hardy `Z` source",
            "not one global HSW-compatible zeta divisor",
            "standard-eight edit",
            "no serialized artifact",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        forbidden = (
            "the endpoint-energy nonconcentration gate is proved",
            "the actual joint inequality is proved",
            "the actual hardy source has this localization",
            "a global hsw-compatible counterexample",
            "the locked ceiling transport is proved",
            "eta_n^pr=o(1) is proved",
            "the riemann hypothesis is proved",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
