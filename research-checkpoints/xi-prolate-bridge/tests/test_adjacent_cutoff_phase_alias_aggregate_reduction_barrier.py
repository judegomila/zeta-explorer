#!/usr/bin/env python3
"""Regressions for the adjacent-cutoff phase-alias aggregate barrier."""

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

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT / "notes"
    / "ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md"
)
NOTE_HASH = "2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87"
FROZEN = {
    "notes/JOINT_HARDY_CAUCHY_PHASE_ENERGY_NONCONCENTRATION_BARRIER.md":
        "69b985d600f1a9cc5f3522ddaa6a4d4a242e9e3f9907a7deed0abe93e06039d7",
    "tests/test_joint_hardy_cauchy_phase_energy_nonconcentration_barrier.py":
        "5b38f27de63a5b972a2daec330cfeb895f66a2d7eb691ed6c8691c6e312c51ab",
    "notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md":
        "aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6",
    "tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py":
        "6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6",
    "notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md":
        "ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f",
    "tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py":
        "e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def endpoint(values: list[complex], start: int) -> complex:
    return sum(
        (-1) ** (index - start) * values[index]
        for index in range(start, len(values))
    )


def row(
    values: list[complex],
    start: int,
    gamma: float,
    spacing: float,
) -> complex:
    return sum(
        (-1) ** (index - start)
        * values[index]
        * gamma**2 / (gamma**2 - (index * spacing) ** 2)
        for index in range(start, len(values))
    )


class AdjacentCutoffPhaseAliasAggregateReductionBarrierTests(
    unittest.TestCase
):
    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_adjacent_and_normalized_recurrences(self) -> None:
        spacing = 0.37
        values = [
            cmath.exp(0.19j * index) / (index + 2) ** 2
            for index in range(64)
        ]
        envelopes = [math.exp(-0.021 * index) for index in range(64)]
        gamma = 17.41 * spacing
        for index in range(10, 22):
            e0 = endpoint(values, index)
            e1 = endpoint(values, index + 1)
            c0 = row(values, index, gamma, spacing)
            c1 = row(values, index + 1, gamma, spacing)
            kernel = gamma**2 / (gamma**2 - (index * spacing) ** 2)
            self.assertAlmostEqual(abs(e0 + e1 - values[index]), 0, places=13)
            self.assertAlmostEqual(
                abs(c0 + c1 - values[index] * kernel), 0, places=12
            )
            ratio = envelopes[index + 1] / envelopes[index]
            self.assertAlmostEqual(
                abs(
                    e0 / envelopes[index]
                    + ratio * e1 / envelopes[index + 1]
                    - values[index] / envelopes[index]
                ),
                0,
                places=13,
            )
            self.assertAlmostEqual(
                abs(
                    c0 / envelopes[index]
                    + ratio * c1 / envelopes[index + 1]
                    - kernel * values[index] / envelopes[index]
                ),
                0,
                places=12,
            )

    def test_squared_recurrence_and_kernel_constants(self) -> None:
        for left, right, ratio in (
            (1.2 - 0.7j, -0.3 + 1.4j, 0.8),
            (-2 + 0.5j, 1 - 1j, 1.3),
            (0.25 + 0.9j, -0.8 - 0.2j, 0.4),
        ):
            lhs = abs(left) ** 2 + ratio**2 * abs(right) ** 2
            rhs = 0.5 * abs(left + ratio * right) ** 2
            self.assertGreaterEqual(lhs + 1e-14, rhs)

        spacing = 0.09
        index = 120
        for y_value in (0.31, -0.43, 0.72):
            gamma = index * spacing - y_value * spacing
            phase_weight = (
                math.sin(gamma * math.pi / spacing) ** 2 / gamma**2
            )
            kernel = gamma**2 / (
                gamma**2 - (index * spacing) ** 2
            )
            exact = phase_weight * kernel**2
            profile = math.sin(math.pi * y_value) ** 2 / y_value**2
            self.assertGreaterEqual(
                exact + 1e-14, profile / (9 * spacing**2)
            )

    def test_ideal_rows_omit_exact_carrier_ordinates(self) -> None:
        spacing = 0.17
        ordinates = (
            101 * spacing,
            101.25 * spacing,
            102 * spacing,
            102.61 * spacing,
        )
        noncarriers = tuple(
            gamma for gamma in ordinates
            if not math.isclose(
                gamma / spacing,
                round(gamma / spacing),
                rel_tol=0,
                abs_tol=1e-12,
            )
        )
        self.assertEqual(noncarriers, (101.25 * spacing, 102.61 * spacing))
        for gamma in set(ordinates) - set(noncarriers):
            self.assertAlmostEqual(
                math.sin(gamma * math.pi / spacing) ** 2,
                0,
                places=25,
            )
        self.assertIn(
            r"\gamma/h\notin\mathbb Z",
            self.text,
        )
        self.assertIn(
            "every omitted carrier-continuous row is nonnegative",
            " ".join(self.text.split()),
        )

    def test_block_overlap_weighting_and_selection(self) -> None:
        profile = {
            (0, "a"): 1.0,
            (1, "b"): 1.0,
            (2, "c"): 1.0,
        }
        overlap = max(
            profile.get((index, zero), 0)
            + profile.get((index - 1, zero), 0)
            for index in range(4)
            for zero in ("a", "b", "c")
        )
        self.assertEqual(overlap, 1)
        source_energy = 7.0
        raw_energy = 3.5
        endpoint_energy = 14.0
        constant = (
            (raw_energy / source_energy)
            / (18 * 2 * 1.15**2 * (endpoint_energy / source_energy))
        )
        endpoint_parts = (2.0, 3.0, 9.0)
        row_parts = tuple(constant * 25 * value for value in endpoint_parts)
        self.assertGreater(constant, 0)
        self.assertTrue(
            any(
                row_value / end_value >= constant * 25
                for row_value, end_value in zip(row_parts, endpoint_parts)
            )
        )

    def test_endpoint_positivity_and_zero_branches(self) -> None:
        zero_endpoints = (0.0, 0.0, 0.0)
        zero_rows = (0.0, 0.0, 0.0)
        self.assertFalse(sum(zero_endpoints) > 0)
        self.assertTrue(all(
            end_value == row_value == 0
            for end_value, row_value in zip(zero_endpoints, zero_rows)
        ))

        endpoint_energy = (0.0, 2.0, 3.0)
        row_energy = (1.0, 4.0, 9.0)
        self.assertGreater(sum(endpoint_energy), 0)
        self.assertTrue(
            any(
                end_value == 0 and row_value > 0
                for end_value, row_value in zip(
                    endpoint_energy,
                    row_energy,
                )
            )
        )
        self.assertIn(
            r"0<\sum_{n\in J^+}|e_n|^2",
            self.text,
        )
        self.assertIn(
            "has an undefined quotient",
            " ".join(self.text.split()),
        )

    def test_q_envelope_cancellation_and_transfer_losses(self) -> None:
        q_value = -2 / math.sqrt(80)
        envelope = 3.7e-9
        end_value = 1.2 - 0.4j
        rows = (0.8 + 0.3j, -0.2 + 1.1j, 0.7 - 0.6j)
        ideal = sum(abs(value) ** 2 for value in rows) / abs(end_value) ** 2
        physical = sum(
            abs(q_value * envelope * value) ** 2 for value in rows
        ) / abs(q_value * envelope * end_value) ** 2
        self.assertAlmostEqual(ideal, physical)
        one_stage = ((1 - 0.25) / (1 + 0.25)) ** 2
        self.assertAlmostEqual(one_stage, 9 / 25)
        self.assertAlmostEqual(one_stage**2, 81 / 625)
        self.assertTrue(0 <= 0.25 < 1)
        invalid_eta = 2.0
        spurious_square = ((1 - invalid_eta) / (1 + invalid_eta)) ** 2
        self.assertGreater(spurious_square, 0)
        self.assertFalse(0 <= invalid_eta < 1)
        normalized = " ".join(self.text.split())
        self.assertIn("0<=eta<1", normalized)
        self.assertIn("0<=epsilon_row<1", normalized)
        self.assertIn("0<=epsilon_end<1", normalized)

    def test_phase_alias_centers_and_raw_tex_regression(self) -> None:
        alpha = 1.93
        coefficients = {0.0: 0.5, alpha: -0.25, -alpha: -0.25}
        x_value = 0.37
        reconstructed = sum(
            coefficient * cmath.exp(2j * math.pi * frequency * x_value)
            for frequency, coefficient in coefficients.items()
        )
        self.assertAlmostEqual(
            reconstructed.real, math.sin(math.pi * alpha * x_value) ** 2
        )
        self.assertAlmostEqual(reconstructed.imag, 0)
        self.assertEqual(set(coefficients), {0.0, alpha, -alpha})
        self.assertNotIn("tau=left(", self.text)
        self.assertIn(r"\tau=\left(", self.text)

    def test_general_and_critical_schedule_scales(self) -> None:
        for exponent in (0.8, 1.2, 1.7):
            self.assertGreater(2 / exponent, 1)
            lam = 1e20
            length = 2 * math.log(lam)
            self.assertLess(
                0.5 * lam ** (exponent - 2) * length**2, 1
            )
        d_value = 0.25
        self.assertGreater(d_value, 1 / (2 * math.pi))
        self.assertLess(d_value, 0.5)
        for length in (80.0, 160.0, 320.0):
            log_height = length + math.log(2 * math.pi * d_value)
            self.assertLess(length / log_height, 1)
            omega = 0.5 * (length + math.log(d_value))
            phase_band = 2 * math.pi * omega / length
            self.assertLess(phase_band, math.pi)
            self.assertAlmostEqual(
                (math.pi - phase_band) * length,
                -math.pi * math.log(d_value),
            )

    def test_critical_joint_symbol_and_gonek_scale(self) -> None:
        mp.mp.dps = 50
        for real_part, imaginary_part, delta in (
            (0.4, 0.7, 0.5),
            (1.2, -0.3, 1.7),
            (0.08, 2.0, 0.2),
        ):
            z_value = mp.mpc(real_part, imaginary_part)
            integral = mp.quad(
                lambda value: mp.exp(-delta * value) / (z_value + value),
                [0, mp.inf],
            )
            self.assertGreater(mp.re(integral), 0)
            self.assertGreater(abs(z_value * integral), mp.mpf("1e-10"))
        x_value = 0.25
        gonek_kernel = 1 - (
            math.sin(math.pi * x_value) / (math.pi * x_value)
        ) ** 2
        self.assertGreater(gonek_kernel, 0)
        moment_coefficient = gonek_kernel / (2 * math.pi)
        zero_count_coefficient = 1 / (2 * math.pi)
        self.assertAlmostEqual(
            moment_coefficient / zero_count_coefficient,
            gonek_kernel,
        )
        height = 1e8
        moment = (
            moment_coefficient * height * math.log(height) ** 2
        )
        zero_count = zero_count_coefficient * height * math.log(height)
        self.assertAlmostEqual(
            moment / zero_count,
            gonek_kernel * math.log(height),
        )
        self.assertAlmostEqual(math.sin(2 * math.pi * x_value) ** 2, 1)
        self.assertIn(
            r"\sim {W_U^1(x)\over2\pi}T(\log T)^2",
            self.text,
        )
        self.assertNotIn(r"\sim W_U^1(x)T\log T", self.text)
        self.assertIn(
            "Only a deliberately weakened consequence",
            self.text,
        )

    def test_adaptive_plateau_alias_scan_diverges(self) -> None:
        scans = []
        for lam in (1e5, 1e8, 1e12):
            length = 2 * math.log(lam)
            height = 2 * math.pi * lam * length**2
            scan = math.exp(length) / height
            scans.append(scan)
            expected = lam / (2 * math.pi * length**2)
            self.assertAlmostEqual(
                scan, expected, delta=1e-12 * expected
            )
        self.assertTrue(
            all(right > left for left, right in zip(scans, scans[1:]))
        )

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 50)
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
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        normalized = " ".join(self.text.split())
        for phrase in (
            "unbound post-checkpoint-1.44 theorem/barrier note/test pair",
            "changes no standard eight file",
            "same-index pair estimate",
            "discrete shrinking-progression, phase-weighted",
            "first carrier aliases",
            "below-Nyquist total-energy control",
            "operator-relative ideal-to-main and exterior Stokes transfer",
            "finite-gate block-intersection barrier",
            "No continuous one-level density theorem is imported",
            "endpoint-nonvanishing observation",
            "opposite indices",
            "simultaneous prime and approximate-functional-equation",
            "P0_INVALIDATED",
        ):
            self.assertIn(phrase, normalized)
        lowered = normalized.lower()
        for phrase in (
            "pw1 is proved",
            "the first carrier aliases vanish",
            "bettin--fazzari proves the discrete theorem",
            "the actual hardy--cauchy inequality is proved",
            "the finite strict gates are inherited",
            "eta_n^pr=o(1) is proved",
            "the riemann hypothesis is proved",
        ):
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
