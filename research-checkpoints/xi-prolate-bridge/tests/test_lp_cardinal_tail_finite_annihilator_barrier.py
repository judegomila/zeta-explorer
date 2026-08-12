#!/usr/bin/env python3
"""Exact regressions for the LP cardinal-tail finite-annihilator barrier."""

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
NOTE = ROOT / "notes" / "LP_CARDINAL_TAIL_FINITE_ANNIHILATOR_BARRIER.md"
NOTE_HASH = "2c4f48bf672ffc49da3d9d32d851f6177c34e25be2fd78b193a2f77ea9e21b67"

FROZEN = {
    "notes/ACTUAL_ENDPOINT_RATIONAL_VARIANCE_FAR_TAIL_BARRIER.md":
        "88965c9926092be319f83014408b689622911b1d27b5e5f266e2d7fb74e92644",
    "tests/test_actual_endpoint_rational_variance_far_tail_barrier.py":
        "bd993af601bcddbd48ad077bd9b9c64f0cfb34ba2354b617de94f66029d0716c",
    "notes/HSW_CONTINUOUS_L_PHASE_SHELL_THEOREM.md":
        "49a53cb1f8ee6db85040cd39aa6faa4fff0296d8bb8b99b18e830efce63df70e",
    "tests/test_hsw_continuous_l_phase_shell_theorem.py":
        "54e28858ad50a9b29578ff7719a2bb9818e02d7f275530a9da8cc15a023b6d9f",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def product(values: list[F]) -> F:
    result = F(1)
    for value in values:
        result *= value
    return result


def annihilator(
    a: int, h: F, rows: tuple[F, ...]
) -> tuple[list[F], list[F], list[F]]:
    size = len(rows)
    nodes = [(h * (a + index)) ** 2 for index in range(size + 1)]
    row_squares = [row**2 for row in rows]
    coefficients: list[F] = []
    for index, node in enumerate(nodes):
        numerator = product([node - row for row in row_squares])
        denominator = product(
            [node - other for j, other in enumerate(nodes) if j != index]
        )
        coefficients.append(numerator / denominator)
    return nodes, row_squares, coefficients


def cauchy_row(
    coefficients: list[F], nodes: list[F], row_square: F
) -> F:
    return sum(
        (
            coefficient * row_square / (row_square - node)
            for coefficient, node in zip(coefficients, nodes)
        ),
        F(0),
    )


def q_value(x: F, rows: list[F]) -> F:
    return product([x - row for row in rows])


def carrier_interpolant_value(
    a: int,
    h: F,
    size: int,
    rows: list[F],
    index: int,
) -> F:
    if index > size:
        return F(0)
    node = (h * (a + index)) ** 2
    numerator = (
        2
        * (a + index)
        * q_value(node, rows)
        * math.factorial(2 * a + index - 1)
    )
    denominator = (
        math.factorial(index)
        * math.factorial(size - index)
        * math.factorial(2 * a + index + size)
    )
    return F(numerator, denominator)


class LPCardinalTailFiniteAnnihilatorBarrierTests(unittest.TestCase):
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

    def test_exact_barycentric_endpoint_and_rows(self) -> None:
        a = 7
        h = F(3, 2)
        rows = (F(1, 2), F(13, 4), F(29, 5), F(41, 5))
        nodes, row_squares, coefficients = annihilator(a, h, rows)

        self.assertEqual(sum(coefficients, F(0)), 1)
        for row_square in row_squares:
            self.assertEqual(
                cauchy_row(coefficients, nodes, row_square),
                0,
            )

        for probe in (F(2), F(17), F(101)):
            if probe in nodes:
                continue
            left = cauchy_row(coefficients, nodes, probe)
            right = (
                probe
                * q_value(probe, row_squares)
                / product([probe - node for node in nodes])
            )
            self.assertEqual(left, right)

    def test_unalternated_samples_have_one_sign(self) -> None:
        for size in (1, 2, 3, 6):
            a = size + 5
            h = F(2, 3)
            rows = tuple(F(index + 1, 4) for index in range(size))
            _, _, coefficients = annihilator(a, h, rows)
            samples = [
                (-1) ** index * coefficient
                for index, coefficient in enumerate(coefficients)
            ]
            expected_sign = (-1) ** size
            self.assertTrue(
                all(expected_sign * sample > 0 for sample in samples)
            )

    def test_gamma_interpolant_matches_exact_coefficients(self) -> None:
        a = 6
        h = F(5, 4)
        rows = (F(2, 3), F(7, 3), F(9, 2))
        size = len(rows)
        nodes, row_squares, coefficients = annihilator(a, h, rows)
        scale = h ** (2 * size) * ((-1) ** size)

        for index, coefficient in enumerate(coefficients):
            value = carrier_interpolant_value(
                a, h, size, row_squares, index
            )
            self.assertEqual((-1) ** index * value, scale * coefficient)
            self.assertEqual(nodes[index], (h * (a + index)) ** 2)

        for index in (size + 1, size + 2, size + 11):
            self.assertEqual(
                carrier_interpolant_value(
                    a, h, size, row_squares, index
                ),
                0,
            )

    def test_even_entire_factorization_and_real_zeros(self) -> None:
        a = 5
        size = 3
        h = 1.25
        rows = (0.7, 2.1, 4.8)
        shift = size + 1 + a

        def polynomial_ratio(u: float) -> float:
            result = 1.0
            for integer in range(1 - a, a):
                result *= u + integer
            return result

        def simplified(u: float) -> float:
            q_factor = math.prod(
                ((h * u) ** 2 - row**2 for row in rows)
            )
            return (
                2.0
                * u
                * q_factor
                * polynomial_ratio(u)
                / (math.gamma(shift - u) * math.gamma(shift + u))
            )

        for u in (0.125, 0.75, 1.375, 3.25):
            self.assertAlmostEqual(simplified(u), simplified(-u), places=12)
            self.assertAlmostEqual(
                polynomial_ratio(-u),
                -polynomial_ratio(u),
                places=12,
            )

        finite_positive_roots = {
            *(float(integer) for integer in range(1, a)),
            *(row / h for row in rows),
        }
        self.assertTrue(all(root > 0 for root in finite_positive_roots))
        tail_roots = tuple(shift + index for index in range(5))
        self.assertTrue(
            all(right - left == 1 for left, right in zip(tail_roots, tail_roots[1:]))
        )

    def test_simple_zero_perturbation_makes_rows_arbitrarily_small(self) -> None:
        a = 8
        h = F(1)
        rows = (F(3, 2), F(11, 4), F(21, 4))
        nodes, row_squares, coefficients = annihilator(a, h, rows)

        ratios: list[float] = []
        for epsilon in (F(1, 3), F(1, 9), F(1, 27), F(1, 81)):
            perturbed = [
                coefficient
                * (1 - epsilon**2 / (a + index) ** 2)
                for index, coefficient in enumerate(coefficients)
            ]
            endpoint = sum(perturbed, F(0))
            self.assertNotEqual(endpoint, 0)
            maximum = max(
                abs(cauchy_row(perturbed, nodes, row_square) / endpoint)
                for row_square in row_squares
            )
            ratios.append(float(maximum))

        self.assertTrue(
            all(left > right for left, right in zip(ratios, ratios[1:]))
        )
        self.assertLess(ratios[-1], ratios[0] / 700.0)

    def test_hsw_local_window_threshold_and_joint_interface(self) -> None:
        threshold = 4.0 * math.pi * 0.103787
        self.assertGreater(threshold, 1.3040)
        self.assertLess(threshold, 1.3043)

        length = F(2000)
        width = F(13, 10)
        carrier_count = width * length / F(2) / F(str(math.pi))
        main_count = width * length / F(4) / F(str(math.pi))
        excess = carrier_count - main_count
        self.assertEqual(excess, main_count)

        height = F(1000)
        log_factor = F(17)
        phase_amplitude = height**2 * log_factor
        local_weighted = phase_amplitude / height**2
        self.assertEqual(local_weighted, log_factor)

        sampling_cap = F(5, 7)
        eta_upper = sampling_cap / local_weighted
        self.assertEqual(eta_upper, F(5, 119))

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
            "all the nonzero `f_k` have one sign",
            "explicit even real entire interpolant of order one",
            "not an HSW-compatible counterexample",
            "does not prove that the actual tail cancels",
            "The exact actual cardinal reduction is also not imported as a theorem",
            "algebraic multiplicity does not imply distinct rows",
            "Nyquist-saturating carrier lattice",
            "For an integer `A>2`, the natural half-lattice replacement",
            "does not rule out LP plus the correct type/density/slow-frequency margin",
            "annihilates the endpoint tail along with the zero rows",
            "Multiplicity must also remain explicit",
            "Endpoint and zero-row remainders cannot be dropped",
            "joint phase-amplitude statement for the one actual vector",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        forbidden = (
            "hsw-compatible lp counterexample is constructed",
            "the actual zeta tail vanishes",
            "eta_n^pr=o(1) is proved",
            "the riemann hypothesis is proved",
            "all zeta zeros are simple",
            "mathcal f_{a,m}=xi",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
