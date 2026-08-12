#!/usr/bin/env python3
"""Regressions for the RH even quotient endpoint-flat floor obstruction."""

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
NOTE = ROOT / "notes" / "RH_EVEN_QUOTIENT_ENDPOINT_FLAT_FLOOR_OBSTRUCTION.md"
NOTE_HASH = "b0a561a048df0b0eede249be8cc014ce29b8aa8fa29efb61de5d9bf773822d8c"

FROZEN = {
    "notes/RH_EVEN_ZERO_GRAM_GEVREY_RELATIVE_RESERVE_BARRIER.md":
        "4527a5cc5ba8a7c66b76ff70c4aa4423aaecd60fe10ba52cee134b9d9c2ef36c",
    "tests/test_rh_even_zero_gram_gevrey_relative_reserve_barrier.py":
        "fe276d7e4e60f1f40ec10fc4dac1cee8084fc3e8df969fa3a9f30ef64cd4ad86",
    "notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md":
        "ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a",
    "tests/test_anti_carrier_log_schedule.py":
        "304175ece40e36ae979dffa44c43009d1b796be2d72a820d7021758a34472a1b",
    "ZERO_SAMPLING_SOURCE_LOCK.json":
        "f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def product(values: tuple[F, ...]) -> F:
    result = F(1)
    for value in values:
        result *= value
    return result


def polynomial_value(roots: tuple[F, ...], value: F) -> F:
    return product(tuple(value - root for root in roots))


def quotient_residues(
    carrier_squares: tuple[F, ...], zero_squares: tuple[F, ...]
) -> tuple[F, ...]:
    residues = []
    for index, carrier in enumerate(carrier_squares):
        derivative = product(
            tuple(
                carrier - other
                for other_index, other in enumerate(carrier_squares)
                if other_index != index
            )
        )
        residues.append(polynomial_value(zero_squares, carrier) / derivative)
    return tuple(residues)


def log_rational_interval(value: F, terms: int = 28) -> tuple[F, F]:
    """Exact atanh-series enclosure for log(value), with 1 < value < 2."""
    if not F(1) < value < F(2):
        raise ValueError("the regression only needs 1 < value < 2")
    z = (value - 1) / (value + 1)
    partial = F(0)
    for index in range(terms + 1):
        partial += 2 * z ** (2 * index + 1) / (2 * index + 1)
    next_power = z ** (2 * terms + 3)
    remainder = 2 * next_power / ((2 * terms + 3) * (1 - z * z))
    return partial, partial + remainder


class RHEvenQuotientEndpointFlatFloorObstructionTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 5)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_quotient_residues_and_endpoint_moments(self) -> None:
        carrier_squares = tuple(F(n * n) for n in range(1, 8))
        # The first selected ordinate is an in-band carrier.  Its residue
        # must vanish under the continuous carrier convention.
        zero_squares = (F(9), F(25, 4), F(121, 9), F(289, 16))
        residues = quotient_residues(carrier_squares, zero_squares)
        self.assertTrue(any(residues))
        self.assertEqual(residues[2], 0)

        # P/D=sum x_n/(y-a_n^2), checked at exact rational points.
        for value in (F(1, 2), F(7, 3), F(50, 3), F(100)):
            left = polynomial_value(zero_squares, value) / polynomial_value(
                carrier_squares, value
            )
            right = sum(
                residue / (value - carrier)
                for residue, carrier in zip(residues, carrier_squares)
            )
            self.assertEqual(left, right)

        # There are N-M-1 exact even endpoint moment cancellations.
        cancellation_count = len(carrier_squares) - len(zero_squares) - 1
        for degree in range(cancellation_count):
            self.assertEqual(
                sum(
                    residue * carrier**degree
                    for residue, carrier in zip(residues, carrier_squares)
                ),
                0,
            )
        self.assertEqual(
            sum(
                residue * carrier**cancellation_count
                for residue, carrier in zip(residues, carrier_squares)
            ),
            1,
        )

    def test_multiplicity_count_bounds_distinct_count_in_safe_direction(self) -> None:
        multiplicities = (7, 1, 4, 9, 2, 6)
        for prefix in range(1, len(multiplicities) + 1):
            distinct_count = prefix
            multiplicity_count = sum(multiplicities[:prefix])
            self.assertLessEqual(distinct_count, multiplicity_count)

        # If the multiplicity count below a threshold is less than M, then
        # the Mth distinct row cannot yet have occurred.
        target = 8
        distinct_count_below = 4
        multiplicity_count_below = 7
        self.assertLessEqual(distinct_count_below, multiplicity_count_below)
        self.assertLess(multiplicity_count_below, target)

    def test_hsw_scale_is_four_pi_theta_times_n_over_l(self) -> None:
        theta = 0.73
        epsilon = 2.0
        ratios = []
        for length in (80.0, 160.0, 320.0, 640.0):
            # N cancels from M(T)/N at T=(4*pi*theta-epsilon)N/L.
            log_n = length / 2 + 3 * math.log(length)
            coefficient = 4 * math.pi * theta - epsilon
            log_t_over_2pie = (
                log_n
                - math.log(length)
                + math.log(coefficient / (2 * math.pi * math.e))
            )
            ratios.append(coefficient * log_t_over_2pie / (2 * math.pi * length))
        target = theta - epsilon / (4 * math.pi)
        self.assertTrue(all(value < theta for value in ratios))
        self.assertLess(abs(ratios[-1] - target), abs(ratios[0] - target))

    def test_tail_partial_summation_constant_is_uniform_in_power(self) -> None:
        for power in (2, 4, 8, 20, 100):
            threshold = F(100)
            exact_integral_factor = F(power, power - 1) + F(
                power, (power - 1) ** 2
            ) / F(4)  # log(T)>4, so this is an upper normalized factor.
            self.assertLessEqual(exact_integral_factor, F(8, 3))
            self.assertGreater(threshold ** (1 - power), 0)

    def test_constraint_budget_produces_the_squared_tail_exponent(self) -> None:
        for dimension, selected in ((20, 14), (41, 29), (100, 72)):
            endpoint_moments = dimension - selected - 1
            integration_order = 2 * endpoint_moments
            squared_tail_power = 2 * integration_order
            self.assertEqual(selected + endpoint_moments, dimension - 1)
            self.assertEqual(squared_tail_power, 4 * endpoint_moments)
            self.assertGreater(endpoint_moments, 0)

    def test_lambert_w_optimizer_has_a_rational_interval_certificate(self) -> None:
        lower = F(72_736_660, 100_000_000)
        upper = F(72_736_661, 100_000_000)

        log_lower_lo, log_lower_hi = log_rational_interval(2 * lower)
        log_upper_lo, log_upper_hi = log_rational_interval(2 * upper)

        derivative_at_lower_lo = 1 / lower - 1 - log_lower_hi
        derivative_at_upper_hi = 1 / upper - 1 - log_upper_lo
        self.assertGreater(derivative_at_lower_lo, 0)
        self.assertLess(derivative_at_upper_hi, 0)

        # d'(theta)=-theta^(-2)-theta^(-1)<0, so the root is unique.
        for theta in (lower, upper):
            self.assertLess(-1 / theta**2 - 1 / theta, 0)

        # Enclose c*=4(1-theta*)log(2theta*) without trusting its printed
        # decimal.  Concavity and the derivative enclosure avoid the usual
        # interval-dependency loss from multiplying opposing monotone terms.
        c_lower = max(
            4 * (1 - lower) * log_lower_lo,
            4 * (1 - upper) * log_upper_lo,
        )
        derivative_at_lower_hi = 1 / lower - 1 - log_lower_lo
        c_upper = (
            4 * (1 - lower) * log_lower_hi
            + 4 * (upper - lower) * derivative_at_lower_hi
        )
        printed_prefix_lower = F(4_087_565_478, 10_000_000_000)
        printed_prefix_upper = F(4_087_565_479, 10_000_000_000)
        self.assertLess(printed_prefix_lower, c_lower)
        self.assertLess(c_lower, c_upper)
        self.assertLess(c_upper, printed_prefix_upper)
        self.assertGreater(c_lower, F(4087, 10_000))

    def test_n_exponent_is_strictly_beyond_n_over_l(self) -> None:
        c_star_lower = F(4087, 10_000)
        fixed_gevrey_constant = F(20)
        for length in (50, 100, 200, 400):
            ratio = c_star_lower * length / fixed_gevrey_constant
            if length >= 100:
                self.assertGreater(ratio, 2)
        self.assertGreater(c_star_lower * 400 / fixed_gevrey_constant, 8)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
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
        self.assertNotIn(r",quad", self.text)
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "upper-floor obstruction, not a lower frame theorem",
            "actual positive ordinates",
            "Algebraic multiplicity repeats the same vanished value row",
            "possibly very small normalization",
            "There is no hidden assumption that `T_N` has an upper bound",
            "does not compare the actual projected-prolate Rayleigh value `q_N`",
            "standard eight are unchanged",
            "no checkpoint-admission order",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "rh proves the even reserve",
            "lambda_min(a_circ) is bounded below",
            "q_n is larger than the floor",
            "the riemann hypothesis is proved",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
