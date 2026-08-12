#!/usr/bin/env python3
"""Exact regressions for the actual endpoint-rational variance barrier."""

from __future__ import annotations

import ast
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
NOTE = (
    ROOT
    / "notes"
    / "ACTUAL_ENDPOINT_RATIONAL_VARIANCE_FAR_TAIL_BARRIER.md"
)
NOTE_HASH = "88965c9926092be319f83014408b689622911b1d27b5e5f266e2d7fb74e92644"

FROZEN = {
    "notes/RH_EVEN_DERIVATIVE_RELATIVE_LEAKAGE_COMPARISON_BARRIER.md":
        "0cf345e6eccd543fa2552848bc79be9b51e0e74217b2947ca9c1ad8cde26479c",
    "tests/test_rh_even_derivative_relative_leakage_comparison_barrier.py":
        "5f70ccb12dfc9892f020551a17bdf516706b353fcd60f18108aa93ca923214d7",
    "notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md":
        "18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b",
    "tests/test_centered_zero_gram_simultaneous_vertex_subsequence.py":
        "39ee34b725a27873143e140a3e4ba71489e8deb406eb73bbefde63ecb68fdc0d",
    "notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md":
        "baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c",
    "tests/test_natural_cutoff_negative_real_root_exclusion.py":
        "6b37c98bdb946d6c9236e768d4cf2c00652ecdbf10e221a516ac4454d6680fad",
    "notes/FIXED_LAMBDA_GALERKIN_ALIGNMENT_NO_GO.md":
        "a809f361f3939c2f309ad7030b8ef5abd5cf321b443d513d7d0c7087a7f38d34",
    "tests/test_fixed_lambda_galerkin_alignment_no_go.py":
        "118afd5b57e9d1b0267d00d230526426cc26833bb74d62f98ccf01f7966198c5",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rational_row(
    endpoint: F,
    coefficients: tuple[F, ...],
    mode_squares: tuple[F, ...],
    row_square: F,
) -> F:
    return endpoint + sum(
        (
            coefficient * mode_square / (row_square - mode_square)
            for coefficient, mode_square in zip(
                coefficients,
                mode_squares,
            )
        ),
        F(0),
    )


class ActualEndpointRationalVarianceFarTailBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_weighted_mean_variance_and_eta_factors(self) -> None:
        # u_gamma=m_gamma*sin(gamma*L/2)^2.  Keeping u_gamma
        # rational tests every factor without a transcendental fixture.
        gamma_squares = (F(25), F(36), F(49), F(64))
        u_values = (F(2, 3), F(3, 5), F(5, 7), F(7, 11))
        mode_squares = (F(1), F(4), F(9))
        coefficients = (F(-2, 7), F(5, 13), F(-3, 17))
        p0 = F(11, 19)
        endpoint = p0 + sum(coefficients, F(0))

        weights = tuple(
            u_value / gamma_square
            for u_value, gamma_square in zip(
                u_values,
                gamma_squares,
            )
        )
        s0 = sum(weights, F(0))
        rows = tuple(
            rational_row(
                endpoint,
                coefficients,
                mode_squares,
                gamma_square,
            )
            for gamma_square in gamma_squares
        )

        a0 = -4 * s0
        moments = tuple(
            4 * sum(
                (
                    u_value / (mode_square - gamma_square)
                    for u_value, gamma_square in zip(
                        u_values,
                        gamma_squares,
                    )
                ),
                F(0),
            )
            for mode_square in mode_squares
        )
        sqrt_l_times_j = p0 * a0 + sum(
            (
                coefficient * moment
                for coefficient, moment in zip(
                    coefficients,
                    moments,
                )
            ),
            F(0),
        )

        first_moment = sum(
            (
                weight * row
                for weight, row in zip(weights, rows)
            ),
            F(0),
        )
        self.assertEqual(first_moment, -sqrt_l_times_j / 4)

        mean = first_moment / s0
        variance = sum(
            (
                weight * (row - mean) ** 2
                for weight, row in zip(weights, rows)
            ),
            F(0),
        ) / s0
        denominator = sum(
            (
                weight * row * row
                for weight, row in zip(weights, rows)
            ),
            F(0),
        )
        self.assertEqual(
            denominator,
            s0 * variance + sqrt_l_times_j**2 / (16 * s0),
        )

        eta_rows = endpoint**2 * s0 / denominator
        eta_variance = endpoint**2 / (
            variance + sqrt_l_times_j**2 / (16 * s0**2)
        )
        self.assertEqual(eta_rows, eta_variance)

    def test_carrier_first_and_second_moment_limits(self) -> None:
        length = 7.25
        carrier = 3
        coefficient = -5.0 / 17.0
        expected_sine_square = (
            math.pi**2 * carrier**2 * coefficient**2 / 4.0
        )
        expected_physical = length**2 * coefficient**2 / 16.0

        for epsilon in (1e-4, 1e-5, 1e-6):
            row = carrier + epsilon
            pole = coefficient * row**2 / (
                row**2 - carrier**2
            )
            sine = math.sin(math.pi * row)
            first = sine**2 * pole
            second = sine**2 * pole**2
            gamma = 2.0 * math.pi * row / length
            physical_second = sine**2 * pole**2 / gamma**2
            self.assertLess(abs(first), 5.0 * epsilon)
            self.assertAlmostEqual(
                second,
                expected_sine_square,
                delta=3.0 * epsilon,
            )
            self.assertAlmostEqual(
                physical_second,
                expected_physical,
                delta=3.0 * epsilon,
            )

    def test_projective_infinity_bound_and_threshold(self) -> None:
        p0 = F(1, 10)
        coefficients = (F(-2, 7), F(3, 11), F(-1, 13))
        mode_squares = (F(1), F(4), F(9))
        endpoint = p0 + sum(coefficients, F(0))
        b_value = sum(
            (
                abs(coefficient) * mode_square
                for coefficient, mode_square in zip(
                    coefficients,
                    mode_squares,
                )
            ),
            F(0),
        )
        cutoff_square = F(9)

        row_square = F(100)
        row = rational_row(
            endpoint,
            coefficients,
            mode_squares,
            row_square,
        )
        self.assertLessEqual(
            abs(row - endpoint),
            b_value / (row_square - cutoff_square),
        )

        threshold_square = (
            cutoff_square + 2 * b_value / abs(endpoint)
        )
        safe_square = threshold_square + 1
        safe_row = rational_row(
            endpoint,
            coefficients,
            mode_squares,
            safe_square,
        )
        self.assertLessEqual(abs(safe_row - endpoint), abs(endpoint) / 2)
        self.assertGreaterEqual(abs(safe_row), abs(endpoint) / 2)

    def test_far_tail_eta_bound_remains_conditional(self) -> None:
        p0 = F(9, 10)
        coefficients = (F(-1, 7), F(2, 9))
        mode_squares = (F(1), F(4))
        endpoint = p0 + sum(coefficients, F(0))
        b_value = sum(
            (
                abs(coefficient) * mode_square
                for coefficient, mode_square in zip(
                    coefficients,
                    mode_squares,
                )
            ),
            F(0),
        )
        threshold = F(4) + 2 * b_value / abs(endpoint)
        low_square = F(25, 4)
        tail_squares = (threshold + 1, threshold + 3)
        low_weight = F(3, 8)
        tail_weights = (F(2, 11), F(5, 13))
        low_row = rational_row(
            endpoint,
            coefficients,
            mode_squares,
            low_square,
        )
        tail_rows = tuple(
            rational_row(
                endpoint,
                coefficients,
                mode_squares,
                square,
            )
            for square in tail_squares
        )
        tail_mass = sum(tail_weights, F(0))
        tail_denominator = sum(
            (
                weight * row**2
                for weight, row in zip(tail_weights, tail_rows)
            ),
            F(0),
        )
        denominator = low_weight * low_row**2 + tail_denominator
        s0 = low_weight + tail_mass

        self.assertGreaterEqual(
            tail_denominator,
            endpoint**2 * tail_mass / 4,
        )
        eta_squared = endpoint**2 * s0 / denominator
        self.assertLessEqual(eta_squared, 4 * s0 / tail_mass)

    def test_mellin_integration_by_parts_recurrence(self) -> None:
        # For Y(z)=z^r, compare the integral of L_c Y directly with
        # the shifted-Mellin integration-by-parts identity.
        for s_value in (F(4), F(7), F(11)):
            for power in (0, 1, 2, 5):
                for c_squared in (F(0), F(3), F(19, 5)):
                    def mellin(shift: int) -> F:
                        return F(1, 1) / (
                            s_value + shift + power
                        )

                    shifted = (
                        c_squared * mellin(2)
                        + s_value * (s_value - 1) * mellin(0)
                        - (s_value - 1)
                        * (s_value - 2)
                        * mellin(-2)
                    )
                    direct = (
                        -power
                        * (power - 1)
                        / (s_value + power - 2)
                        + power
                        * (power + 1)
                        / (s_value + power)
                        + c_squared / (s_value + power + 2)
                    )
                    self.assertEqual(shifted, direct)

    def test_two_distinct_prolate_modes_do_not_close(self) -> None:
        chi0 = F(7, 3)
        chi4 = F(29, 5)
        a0 = F(2, 7)
        a4 = F(5, 11)
        self.assertNotEqual(chi0, chi4)
        self.assertNotEqual(a0, 0)
        self.assertNotEqual(a4, 0)

        # Coefficientwise closure by one scalar chi would require both.
        required_from_label0 = (-a0 * chi0) / (-a0)
        required_from_label4 = (a4 * chi4) / a4
        self.assertEqual(required_from_label0, chi0)
        self.assertEqual(required_from_label4, chi4)
        self.assertNotEqual(required_from_label0, required_from_label4)

    def test_alternating_residues_and_edge_nonuniformity(self) -> None:
        c_value = F(13, 17)
        p1_limit = -2 * c_value
        p2_limit = 2 * c_value
        residue1 = p1_limit
        residue2 = 4 * p2_limit
        self.assertLess(residue1 * residue2, 0)

        # Use a rational symbol for pi: the algebraic coefficient is exact
        # for every nonzero value of that symbol.
        pi_symbol = F(355, 113)
        lam = F(37)
        length = F(9, 2)
        omega = 2 * pi_symbol * lam * length**2
        relative_leading = (
            2 * omega**2 / (32 * pi_symbol * lam**2)
        )
        self.assertEqual(relative_leading, pi_symbol * length**4 / 4)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(
            compiler,
            "pdflatex is required for TeX regression",
        )
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join(
                "\\[" + display + "\\]"
                for display in displays
            )
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

    def test_static_hygiene_factors_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(
                all(
                    line == line.rstrip(b" ")
                    for line in raw.splitlines()
                )
            )

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn(r",qquad", self.text)
        self.assertNotIn(r",quad", self.text)
        self.assertNotIn("P_N", self.text)
        self.assertIn(r"d_N=H_N(\infty)", self.text)
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "actual source scalar `J_L` determines the weighted mean",
            "current actual source-Cauchy identities control the mean, not the variance",
            "including its minus sign and factor `1/4`",
            "actual-prolate-compatible obstruction, not a generic rational counterexample",
            "projective-infinity estimate starts beyond every polynomial zero-height scale",
            "actual mixed source has no closed scalar three-term Mellin recurrence",
            "actual rational residues alternate sign",
            "first relative correction is nonuniform at the full cutoff",
            "standard eight are unchanged",
            "Nothing in this note proves that such a theorem is false",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        forbidden = (
            "eta_n^pr fails",
            "eta_n^pr does not decay",
            "the actual arithmetic sign is negative",
            "the riemann hypothesis is proved",
            "the prolate recurrence proves",
            "computed eta sample",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
