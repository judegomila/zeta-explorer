#!/usr/bin/env python3
"""Strict regressions for adaptive prolate saturation divergence."""

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


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "ADAPTIVE_PROLATE_SATURATION_DIVERGENCE_ORIENTATION_BARRIER.md"
)
NOTE_HASH = "7882db630232ec094318e52689b0b12bf28b0d74ee2c012259a6e91fe666268b"

DEPENDENCIES = {
    "notes/ADAPTIVE_PROLATE_STOKES_ENDPOINT_ROW_TRANSFER_THEOREM.md":
        "0ae198d3a304960744a04c0ec095ffa6afcd4aa61599de551780efb43f89d878",
    "tests/test_adaptive_prolate_stokes_endpoint_row_transfer_theorem.py":
        "e54bb937552247550c4ed57c1e20b86883556460416b5f046618076b2fbf4b76",
    "notes/RH_EVEN_DERIVATIVE_RELATIVE_LEAKAGE_COMPARISON_BARRIER.md":
        "0cf345e6eccd543fa2552848bc79be9b51e0e74217b2947ca9c1ad8cde26479c",
    "tests/test_rh_even_derivative_relative_leakage_comparison_barrier.py":
        "5f70ccb12dfc9892f020551a17bdf516706b353fcd60f18108aa93ca923214d7",
    "notes/RH_EVEN_SPECTRAL_CLUSTER_GROUND_PRIMITIVE_EVALUATION_BARRIER.md":
        "75e5b1b9b916f0ea1732c95bcd9940be4ff0308f561897e64cc0a7141a0c4c4a",
    "tests/test_rh_even_spectral_cluster_ground_primitive_evaluation_barrier.py":
        "fc9c3a13e1559393beabd46cb5a1e26c50c042c8e9865e28ec164d45a353a0af",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def lambert_w_positive(value: float) -> float:
    estimate = math.log(value)
    for _ in range(20):
        exponential = math.exp(estimate)
        residual = estimate * exponential - value
        derivative = exponential * (estimate + 1.0)
        estimate -= residual / derivative
    return estimate


class AdaptiveProlateSaturationDivergenceTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(DEPENDENCIES), 6)
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_larger_row_selection_is_simultaneously_absolute_and_relative(
        self,
    ) -> None:
        carrier_labels = (23, 24)
        finite_cutoffs = tuple(label - 1 for label in carrier_labels)
        self.assertEqual(finite_cutoffs, (22, 23))
        self.assertTrue(
            all(label == cutoff + 1 for label, cutoff in zip(
                carrier_labels, finite_cutoffs
            ))
        )
        examples = (
            ((Fraction(7), Fraction(5)), (Fraction(9), Fraction(4))),
            ((Fraction(1), Fraction(19)), (Fraction(2), Fraction(31))),
            ((Fraction(13), Fraction(13)), (Fraction(101), Fraction(1))),
        )
        for rows, endpoints in examples:
            selected = max(range(2), key=lambda index: rows[index])
            row_total = sum(rows, Fraction())
            endpoint_total = sum(endpoints, Fraction())
            self.assertGreaterEqual(rows[selected], row_total / 2)
            self.assertLessEqual(endpoints[selected], endpoint_total)
            self.assertGreaterEqual(
                rows[selected] / endpoints[selected],
                row_total / (2 * endpoint_total),
            )

    def test_exact_q_normalization_and_lattice_scale(self) -> None:
        for length, row_energy, norm_squared in (
            (8.0, 3.0, 2.0),
            (20.0, 0.125, 7.0),
            (50.0, 11.0, 0.75),
        ):
            zero_norm_squared = 16.0 * row_energy / length
            q_rayleigh = zero_norm_squared / (2.0 * norm_squared)
            self.assertAlmostEqual(
                q_rayleigh,
                8.0 * row_energy / (length * norm_squared),
            )
            q_lattice_squared = 4.0 / length
            h_inverse_squared = length**2 / (4.0 * math.pi**2)
            self.assertAlmostEqual(
                q_lattice_squared * h_inverse_squared,
                length / math.pi**2,
            )

    def test_carrier_exponent_converts_to_dimension_scale(self) -> None:
        errors = []
        for length in (40.0, 80.0, 120.0):
            lam = math.exp(length / 2.0)
            perturbation = length / 5.0
            dimension = lam * length**3 + perturbation
            carrier_square_log = (
                -math.pi**2 * lam * length**2
                + math.pi * length**4 / 2.0
                - 3.0 * length
            )
            leading_dimension_log = -math.pi**2 * dimension / length
            relative_error = (
                carrier_square_log - leading_dimension_log
            ) / (dimension / length)
            errors.append(abs(relative_error))
            self.assertLess(abs(relative_error), 1e-5)
        self.assertGreater(errors[0], errors[1])
        self.assertGreater(errors[1], errors[2])

    def test_cluster_optimizer_and_constants(self) -> None:
        w_zero = lambert_w_positive(2.0 * math.e)
        c_star = 4.0 * (w_zero - 1.0) ** 2 / w_zero
        self.assertAlmostEqual(c_star, 0.4087565478566229, places=14)

        previous = c_star
        for delta in (0.05, 0.15, 0.30, 0.45):
            w_delta = lambert_w_positive(2.0 * math.e * (1.0 - delta))
            theta = (1.0 - delta) / w_delta
            c_delta = (
                4.0 * (1.0 - delta) * (w_delta - 1.0) ** 2 / w_delta
            )
            direct = 4.0 * (1.0 - delta - theta) * math.log(2.0 * theta)
            self.assertGreater(theta, 0.5)
            self.assertLess(theta, 1.0 - delta)
            self.assertAlmostEqual(c_delta, direct, places=13)
            self.assertGreater(c_delta, 0.0)
            self.assertLess(c_delta, previous)
            previous = c_delta

    def test_sampling_energy_projection_not_hilbert_projection(self) -> None:
        eigenvalues = (1e-12, 2e-12, 1.0)
        vector_squared = (0.499999, 0.499999, 0.000002)
        rayleigh = sum(
            value * weight for value, weight in zip(eigenvalues, vector_squared)
        )
        bottom_energy = sum(
            value * weight
            for value, weight in zip(eigenvalues[:2], vector_squared[:2])
        )
        hilbert_mass = sum(vector_squared[:2])
        self.assertLessEqual(bottom_energy / rayleigh, eigenvalues[1] / rayleigh)
        self.assertGreater(hilbert_mass, 0.99999)
        self.assertLess(bottom_energy / rayleigh, 1e-5)

    def test_ground_inverse_fourth_moment_split(self) -> None:
        omega = 20.0
        least = 2.0
        threshold = 30.0
        ordinates = (2.0, 10.0, 29.0, 31.0, 80.0)
        probabilities = (0.01, 0.02, 0.07, 0.40, 0.50)
        ground_norm = 1.75
        actual = sum(
            probability * (omega / ordinate) ** 4
            for ordinate, probability in zip(ordinates, probabilities)
        ) / ground_norm
        low_mass = sum(
            probability
            for ordinate, probability in zip(ordinates, probabilities)
            if ordinate <= threshold
        )
        bound = (
            (omega / threshold) ** 4
            + ((omega / least) ** 4 - (omega / threshold) ** 4) * low_mass
        ) / ground_norm
        self.assertLessEqual(actual, bound)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
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

    def test_static_contract_and_claim_boundary(self) -> None:
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
            self.assertTrue(raw.endswith(b"\n"))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "The larger-row adjacent cutoff",
            "K=n_*-1",
            "q_K^{\\rm pr}={8D_K^{\\rm act}",
            "0.4087565478566",
            "sampling energy",
            "no Hilbert-space angle",
            "eventually impossible on this adaptive sequence",
            "does **not** orient the actual ratio",
            "The surviving true-ground statistic",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        self.assertNotIn("proves the Riemann hypothesis", normalized.lower())
        self.assertNotIn("literal ceiling schedule is proved", normalized.lower())
        self.assertNotIn("the actual even reserve follows", normalized.lower())


if __name__ == "__main__":
    unittest.main()
