#!/usr/bin/env python3
"""Exact regressions for the RH zero Gaussian square-free limit theorem."""

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
NOTE = ROOT / "notes" / "RH_ZERO_GAUSSIAN_SQUARE_FREE_LIMIT_THEOREM.md"
NOTE_HASH = "6622d6ee81f08daef596850ecd4dfbb071c5a2a087e083ee5f68a5bc1b211742"

FROZEN = {
    "notes/SHIFTED_ZERO_SELECTOR_GAUSSIAN_QUADRATURE_BARRIER.md":
        "1a2c95f9cf352a89b5eda544ac7158124761b1afe49ead464ca881ca08d6acd1",
    "tests/test_shifted_zero_selector_gaussian_quadrature_barrier.py":
        "2da21833bf1d79977c7b1b656be3f40d9bfbe9e2483ecb5c65941fabb6dde2d0",
    "notes/RH_CONDITIONAL_FIXED_ZERO_SELECTOR_CAPTURE_THEOREM.md":
        "07345bdb6278cd2914c7edaaa711351f4b8aa020038dca7a19b8c406e4a0f84c",
    "tests/test_rh_conditional_fixed_zero_selector_capture_theorem.py":
        "9de65e4fd61a71736c4df484a6b3f7ce0dd54a659b681baab0e6dd2bd0c36730",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def poly_mul(left: list[F], right: list[F]) -> list[F]:
    result = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, value in enumerate(left):
        for j, other in enumerate(right):
            result[i + j] += value * other
    return result


def poly_from_squares(values: list[F]) -> list[F]:
    result = [F(1)]
    for value in values:
        result = poly_mul(result, [F(1), F(0), -F(1, value)])
    return result


def solve_two_by_two(
    left: list[list[F]], right: list[F]
) -> tuple[F, F]:
    determinant = left[0][0] * left[1][1] - left[0][1] * left[1][0]
    return (
        (right[0] * left[1][1] - left[0][1] * right[1]) / determinant,
        (left[0][0] * right[1] - right[0] * left[1][0]) / determinant,
    )


def degree_two_gaussian_nodes(
    support: list[F], weights: list[F]
) -> tuple[float, float]:
    moments = [
        sum(weight * point**degree for point, weight in zip(support, weights))
        for degree in range(4)
    ]
    # p(x)=x^2+a*x+b is orthogonal to 1 and x.  Only moments through
    # degree 3=2N-1 occur.
    a, b = solve_two_by_two(
        [[moments[1], moments[0]], [moments[2], moments[1]]],
        [-moments[2], -moments[3]],
    )
    discriminant = float(a * a - 4 * b)
    root = math.sqrt(discriminant)
    return ((-float(a) - root) / 2, (-float(a) + root) / 2)


class RhZeroGaussianSquareFreeLimitTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_draft_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_degree_two_nodes_use_only_degree_three_moments(self) -> None:
        support = [F(1), F(4), F(9), F(16)]
        weights = [F(7), F(5), F(3), F(2)]
        first, second = degree_two_gaussian_nodes(support, weights)
        self.assertGreaterEqual(first, float(support[0]))
        self.assertGreaterEqual(second, float(support[1]))
        self.assertLess(first, second)
        self.assertLess(second, float(support[-1]))

    def test_carrier_shell_factorial_identity(self) -> None:
        for size in range(2, 9):
            for index in range(1, size + 1):
                derivative = math.prod(
                    F(index * index - other * other)
                    for other in range(1, size + 1)
                    if other != index
                )
                direct = F(1, 4 * index * index) / (derivative * derivative)
                factorial = F(
                    index * index,
                    math.factorial(size - index) ** 2
                    * math.factorial(size + index) ** 2,
                )
                self.assertEqual(direct, factorial)

    def test_reciprocal_ordering_and_product_tail(self) -> None:
        zero_frequencies = [F(3, 2), F(5, 2), F(4), F(6)]
        node_frequencies = [F(2), F(3), F(5), F(8)]
        self.assertTrue(
            all(node >= zero for node, zero in zip(node_frequencies, zero_frequencies))
        )
        self.assertLessEqual(
            sum(F(1, node * node) for node in node_frequencies),
            sum(F(1, zero * zero) for zero in zero_frequencies),
        )

        # The omitted sine-product tail tends to one when L^2/N tends to zero.
        length = 20
        size = 20_000
        z_value = F(1, 3)
        logarithmic_majorant = float(
            z_value * z_value * length * length / (4 * F(math.pi**2) * size)
        )
        self.assertLess(logarithmic_majorant, 0.001)

    def test_square_free_product_does_not_repeat_weights(self) -> None:
        distinct = [F(4), F(9), F(25)]
        square_free = poly_from_squares(distinct)
        multiplicity_product = poly_from_squares([F(4), F(9), F(9), F(25)])
        self.assertNotEqual(square_free, multiplicity_product)
        self.assertEqual(len(square_free), 7)
        self.assertEqual(len(multiplicity_product), 9)

    def test_shifted_minmax_bounds_and_even_gate(self) -> None:
        # A diagonal fixture realizes the two Loewner comparisons exactly.
        moment_zero = [F(5), F(9)]
        local_zero = [F(20), F(54)]
        shift = F(1)
        lattice_squares = [F(1), F(4)]
        nodes_zero = [local_zero[i] / moment_zero[i] for i in range(2)]
        nodes_shifted = [
            (local_zero[i] - shift * lattice_squares[i])
            / (moment_zero[i] - shift)
            for i in range(2)
        ]
        delta_minus = 1 - shift / min(moment_zero)
        # Here A degrees are H_0/D^2.
        even_floor = min(
            local_zero[i] / lattice_squares[i] for i in range(2)
        )
        delta_plus = 1 - shift / even_floor
        for original, moved in zip(nodes_zero, nodes_shifted):
            self.assertGreaterEqual(moved, delta_plus * original)
            self.assertLessEqual(moved, original / delta_minus)

        gamma_j = F(3)
        gamma_next = F(5)
        reserve = F(3, 4)
        self.assertGreater(reserve, (gamma_j / gamma_next) ** 2)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 25)
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
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "positive transformed RH zero measure",
            "degree `2N-1`",
            "Carrier shells",
            "square-free zero product",
            "one asymptotic node for each fixed distinct support ordinate",
            "Gaussian radius `sqrt(t_(j,L))` lies",
            "above the squared upper endpoint",
            "Christoffel saturation",
            "RH alone is not being used to assert `M_0>0`",
            "out-of-band carrier locking",
            "prolate-anchor overlap",
            "quantitative even reserve",
            "`mu*L=o(1)`",
            "checkpoint-1.37 standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "rh is proved",
            "actual shifted local uniqueness is proved",
            "xi_0 equals the prolate-anchor overlap",
            "multiplicity transfer is proved",
            "standard eight are updated",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
