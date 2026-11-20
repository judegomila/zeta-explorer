#!/usr/bin/env python3
"""Strict regressions for the RH odd-ground primitive parity barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
from itertools import permutations
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
    / "RH_ACTUAL_ODD_GROUND_PRIMITIVE_CHRISTOFFEL_PARITY_BARRIER.md"
)
NOTE_HASH = "29475ddb8b57f227530b6aa296b088f07c4ac9db0cadd1a2d230b40a780b3157"

FROZEN = {
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md":
        "d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0",
    "notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md":
        "0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3",
    "tests/test_odd_zero_gram_lower_frame_audit.py":
        "b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467",
    "notes/ADAPTIVE_PROLATE_STOKES_ENDPOINT_ROW_TRANSFER_THEOREM.md":
        "0ae198d3a304960744a04c0ec095ffa6afcd4aa61599de551780efb43f89d878",
    "tests/test_adaptive_prolate_stokes_endpoint_row_transfer_theorem.py":
        "e54bb937552247550c4ed57c1e20b86883556460416b5f046618076b2fbf4b76",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def determinant(matrix: list[list[F]]) -> F:
    size = len(matrix)
    total = F(0)
    for order in permutations(range(size)):
        inversions = sum(
            order[left] > order[right]
            for left in range(size)
            for right in range(left + 1, size)
        )
        term = F(-1 if inversions % 2 else 1)
        for row, column in enumerate(order):
            term *= matrix[row][column]
        total += term
    return total


def raw_scaled_gram() -> tuple[list[int], list[list[F]]]:
    """Return pi*Q for the exact reflected half-integer multiset."""
    modes = list(range(-2, 3))
    points = ((F(1, 2), 1), (F(3, 2), 2), (F(9, 2), 18))
    matrix = [[F(0) for _ in modes] for _ in modes]
    for row, n_value in enumerate(modes):
        for column, m_value in enumerate(modes):
            for point, multiplicity in points:
                matrix[row][column] += 2 * multiplicity * (
                    F(1, (point - n_value) * (point - m_value))
                    + F(1, (-point - n_value) * (-point - m_value))
                )
    return modes, matrix


class RHActualOddGroundPrimitiveChristoffelParityBarrierTests(
    unittest.TestCase
):
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

    def test_exact_finite_primitive_and_norm(self) -> None:
        frequencies = (F(2, 3), F(5, 4), F(7, 3))
        coefficients = (F(3, 5), F(-4, 7), F(5, 11))
        central = sum(
            (coefficient / frequency
             for coefficient, frequency in zip(coefficients, frequencies)),
            F(0),
        )
        even_positive = tuple(
            -coefficient / frequency
            for coefficient, frequency in zip(coefficients, frequencies)
        )
        primitive_norm = 2 * central * central + sum(
            (value * value for value in even_positive),
            F(0),
        )
        displayed = 2 * central * central + sum(
            (
                coefficient * coefficient / (frequency * frequency)
                for coefficient, frequency in zip(coefficients, frequencies)
            ),
            F(0),
        )
        self.assertEqual(primitive_norm, displayed)

        # Strip the common sine and normalization factors from the rows.
        ordinate_squared = F(121, 9)
        odd_rational = sum(
            (
                coefficient * frequency
                / (ordinate_squared - frequency * frequency)
                for coefficient, frequency in zip(coefficients, frequencies)
            ),
            F(0),
        )
        even_rational_over_sqrt_two = central + sum(
            (
                value * ordinate_squared
                / (ordinate_squared - frequency * frequency)
                for value, frequency in zip(even_positive, frequencies)
            ),
            F(0),
        )
        self.assertEqual(even_rational_over_sqrt_two, -odd_rational)

    def test_primitive_rayleigh_iff_with_all_norm_factors(self) -> None:
        samples = (F(3, 7), F(-5, 13), F(7, 17))
        multiplicities = (2, 3, 1)
        ordinates = (F(11, 2), F(17, 3), F(23, 4))
        odd_norm = F(19, 11)
        primitive_norm = F(31, 7)
        energy = sum(
            (
                multiplicity * sample * sample
                for multiplicity, sample in zip(multiplicities, samples)
            ),
            F(0),
        )
        inverse_energy = sum(
            (
                multiplicity * sample * sample / (ordinate * ordinate)
                for multiplicity, sample, ordinate in zip(
                    multiplicities, samples, ordinates
                )
            ),
            F(0),
        )
        primitive_below = (
            2 * inverse_energy / primitive_norm
            < 2 * energy / odd_norm
        )
        harmonic_criterion = (
            inverse_energy / energy < primitive_norm / odd_norm
        )
        self.assertEqual(primitive_below, harmonic_criterion)

    def test_low_high_localizing_identity(self) -> None:
        omega = F(10)
        low = ((F(3), F(2, 7)), (F(8), F(3, 11)))
        high = ((F(12), F(5, 13)), (F(19), F(7, 17)))
        energy = sum(
            (weight for _, weight in low + high),
            F(0),
        )
        inverse = sum(
            (weight / (ordinate * ordinate) for ordinate, weight in low + high),
            F(0),
        )
        primitive_norm = F(7, 20)
        direct_margin = energy * primitive_norm - inverse
        low_cost = sum(
            (
                weight * (omega * omega / (ordinate * ordinate) - 1)
                for ordinate, weight in low
            ),
            F(0),
        )
        high_gain = sum(
            (
                weight * (1 - omega * omega / (ordinate * ordinate))
                for ordinate, weight in high
            ),
            F(0),
        )
        localized_margin = (
            energy * (omega * omega * primitive_norm - 1)
            + high_gain - low_cost
        )
        self.assertEqual(localized_margin, omega * omega * direct_margin)

    def test_christoffel_measure_and_mean_equivalence(self) -> None:
        zero_values = (F(2), F(5), F(11))
        zero_weights = (F(3, 7), F(4, 9), F(5, 13))
        carrier_values = (F(1), F(4), F(9))
        carrier_weights = (F(7, 11), F(2, 5), F(3, 8))

        def polynomial(value: F) -> F:
            return value * value - 3 * value + 2

        nu_zero = sum(
            (weight * polynomial(value) ** 2
             for value, weight in zip(zero_values, zero_weights)),
            F(0),
        )
        nu_one = sum(
            (weight * value * polynomial(value) ** 2
             for value, weight in zip(zero_values, zero_weights)),
            F(0),
        )
        sigma_zero = sum(
            (weight * polynomial(value) ** 2
             for value, weight in zip(carrier_values, carrier_weights)),
            F(0),
        )
        sigma_one = sum(
            (weight * value * polynomial(value) ** 2
             for value, weight in zip(carrier_values, carrier_weights)),
            F(0),
        )
        cross = nu_one * sigma_zero - nu_zero * sigma_one
        quotient_order = nu_zero / sigma_zero < nu_one / sigma_one
        mean_order = nu_one / nu_zero > sigma_one / sigma_zero
        self.assertEqual(cross > 0, quotient_order)
        self.assertEqual(cross > 0, mean_order)

        # Odd carrier and zero measures are exactly 2y times the even ones.
        odd_zero = sum(
            (2 * value * weight * polynomial(value) ** 2
             for value, weight in zip(zero_values, zero_weights)),
            F(0),
        )
        odd_carrier = sum(
            (2 * value * weight * polynomial(value) ** 2
             for value, weight in zip(carrier_values, carrier_weights)),
            F(0),
        )
        self.assertEqual(odd_zero, 2 * nu_one)
        self.assertEqual(odd_carrier, 2 * sigma_one)

    def test_exact_real_evaluation_gram_and_source_cauchy(self) -> None:
        modes, matrix = raw_scaled_gram()
        center = modes.index(0)
        source = {
            n_value: n_value * matrix[row][center]
            for row, n_value in enumerate(modes)
        }
        for row, n_value in enumerate(modes):
            for column, m_value in enumerate(modes):
                self.assertEqual(matrix[row][column], matrix[column][row])
                self.assertEqual(
                    matrix[row][column],
                    matrix[len(modes) - 1 - row][len(modes) - 1 - column],
                )
                if n_value != m_value:
                    self.assertEqual(
                        matrix[row][column],
                        (source[n_value] - source[m_value])
                        / (n_value - m_value),
                    )
        for n_value in modes:
            self.assertEqual(source[-n_value], -source[n_value])

    def test_exact_parity_blocks_and_odd_ground(self) -> None:
        modes, matrix = raw_scaled_gram()
        index = {value: position for position, value in enumerate(modes)}
        even_diagonal = [
            matrix[index[0]][index[0]],
            matrix[index[1]][index[1]] + matrix[index[1]][index[-1]],
            matrix[index[2]][index[2]] + matrix[index[2]][index[-2]],
        ]
        even_central_sqrt_two = [
            matrix[index[0]][index[1]],
            matrix[index[0]][index[2]],
        ]
        even_twelve = (
            matrix[index[1]][index[2]]
            + matrix[index[1]][index[-2]]
        )
        odd = [
            [
                matrix[index[n_value]][index[m_value]]
                - matrix[index[n_value]][index[-m_value]]
                for m_value in (1, 2)
            ]
            for n_value in (1, 2)
        ]
        self.assertEqual(
            even_diagonal,
            [F(208, 9), F(45976736, 1334025), F(42742688, 1863225)],
        )
        self.assertEqual(
            even_central_sqrt_two,
            [F(5552, 1155), F(-1648, 1365)],
        )
        self.assertEqual(even_twelve, F(-289376, 45045))
        self.assertEqual(
            odd,
            [
                [F(33151616, 1334025), F(-361216, 45045)],
                [F(-361216, 45045), F(47241728, 1863225)],
            ],
        )

        shift = F(18)
        a_value = even_diagonal[0] - shift
        d_value = even_diagonal[1] - shift
        f_value = even_diagonal[2] - shift
        b_value, c_value = even_central_sqrt_two
        e_value = even_twelve
        leading_one = a_value
        leading_two = a_value * d_value - 2 * b_value * b_value
        leading_three = (
            a_value * (d_value * f_value - e_value * e_value)
            - 2 * b_value * (b_value * f_value - c_value * e_value)
            + 2 * c_value * (b_value * e_value - c_value * d_value)
        )
        self.assertEqual(leading_one, F(46, 9))
        self.assertEqual(leading_two, F(65073212, 1715175))
        self.assertEqual(leading_three, F(4287698202712, 55235305125))
        self.assertGreater(leading_one, 0)
        self.assertGreater(leading_two, 0)
        self.assertGreater(leading_three, 0)

        odd_determinant = determinant(odd)
        odd_shifted = [row[:] for row in odd]
        odd_shifted[0][0] -= shift
        odd_shifted[1][1] -= shift
        self.assertEqual(
            odd_determinant,
            F(156256144719872, 276176525625),
        )
        self.assertEqual(
            determinant(odd_shifted),
            F(-3843792811228, 276176525625),
        )
        self.assertGreater(odd[0][0], 0)
        self.assertGreater(odd_determinant, 0)
        self.assertLess(determinant(odd_shifted), 0)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 50)
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
            "Exact outcome and claim boundary",
            "belongs to the exact finite even space",
            "iff for this primitive comparison",
            "Strict parity forces simplicity and boundary nonvanishing",
            "d\\sigma_o=2y\\,d\\sigma_e",
            "minimal missing actual statistic",
            "one projected-prolate vector",
            "integer multiplicities",
            "The countermodel is structural",
            "not the zeta divisor",
            "does not prove (0.5) on one cutoff",
            "does not synchronize the simple-even",
            "no RH implication or converse",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "RH is proved",
            "proves RH",
            "the Riemann hypothesis follows",
            "actual odd ground failure",
            "the countermodel is the zeta divisor",
            "literal ceiling gate is proved",
            "finite gate is proved",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

        standard_eight = (
            "README.md",
            "P0_RESIDUAL.md",
            "LEDGER.md",
            "SOURCES.md",
            "PROJECT_STATE.json",
            "P0_INVALIDATED.json",
            "HANDOFF_MANIFEST.json",
            "replay.sh",
        )
        for name in standard_eight:
            self.assertNotIn(f"changes `{name}`", normalized)

    def test_no_cache_artifacts(self) -> None:
        self.assertFalse(any(ROOT.rglob("__pycache__")))
        self.assertFalse(any(ROOT.rglob("*.pyc")))


if __name__ == "__main__":
    unittest.main()
