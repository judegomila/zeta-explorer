#!/usr/bin/env python3
"""Strict regressions for the critical-ground no-escape barrier."""

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
    / "CRITICAL_GROUND_NEGATIVE_SOBOLEV_NO_ESCAPE_BARRIER.md"
)
NOTE_HASH = "08048a91afda16b0b1305f7355efc5b8be223d7fc8a27a8918da71a8532cdfa6"

FROZEN = {
    "notes/CRITICAL_SCALAR_FLOOR_TO_TRUE_GROUND_ROW_DELETION_BARRIER.md":
        "3cf82e60d684f738e331ba5b4378ee7d0528bd47dd71c73bd551777750938ba4",
    "tests/test_critical_scalar_floor_to_true_ground_row_deletion_barrier.py":
        "0f4ca4642d750876a2216df0cec4f60704bc9cd977223d08b6796f89783437ba",
    "notes/RH_EVEN_SPECTRAL_CLUSTER_GROUND_PRIMITIVE_EVALUATION_BARRIER.md":
        "75e5b1b9b916f0ea1732c95bcd9940be4ff0308f561897e64cc0a7141a0c4c4a",
    "tests/test_rh_even_spectral_cluster_ground_primitive_evaluation_barrier.py":
        "fc9c3a13e1559393beabd46cb5a1e26c50c042c8e9865e28ec164d45a353a0af",
    "notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md":
        "0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3",
    "tests/test_odd_zero_gram_lower_frame_audit.py":
        "b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_matrix(size: int) -> tuple[list[int], list[list[F]]]:
    modes = list(range(-size, size + 1))
    c_value = F(1, size**4)
    matrix = []
    for n_value in modes:
        row = []
        for m_value in modes:
            if n_value == m_value:
                diagonal = F(1) if abs(n_value) == size else F(2)
                row.append(diagonal - c_value)
            else:
                row.append(-c_value)
        matrix.append(row)
    return modes, matrix


def matmul(left: list[list[F]], right: list[list[F]]) -> list[list[F]]:
    return [
        [
            sum(
                (left[i][k] * right[k][j] for k in range(len(right))),
                F(0),
            )
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


def j2_ground(size: int) -> tuple[float, float, list[float]]:
    c_value = size ** -4
    linear = 1.0 - 2.0 * c_value * size
    delta = (-linear + math.sqrt(linear * linear + 8.0 * c_value)) / 2.0
    ratio = delta / (1.0 + delta)
    top = 1.0 / math.sqrt(1.0 + (size - 1) * ratio * ratio)
    vector = [ratio * top] * (size - 1) + [top]
    j_value = 2.0 * sum(
        vector[index - 1] / (index * index)
        for index in range(1, size + 1)
    ) ** 2
    j_value += sum(
        vector[index - 1] ** 2 / (index**4)
        for index in range(1, size + 1)
    )
    return delta, j_value, vector


class CriticalGroundNegativeSobolevNoEscapeBarrierTests(unittest.TestCase):
    maxDiff = None

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

    def test_exact_positive_source_cauchy_and_commutator(self) -> None:
        for size in (2, 3, 7):
            modes, matrix = source_matrix(size)
            c_value = F(1, size**4)
            positivity_reserve = F(1) - c_value * F(2 * size + 3, 2)
            self.assertGreater(positivity_reserve, 0)

            b_values = {n_value: -c_value * n_value for n_value in modes}
            for i, n_value in enumerate(modes):
                self.assertEqual(b_values[-n_value], -b_values[n_value])
                expected_diagonal = F(1) if abs(n_value) == size else F(2)
                self.assertEqual(matrix[i][i], expected_diagonal - c_value)
                for j, m_value in enumerate(modes):
                    if i != j:
                        self.assertEqual(
                            matrix[i][j],
                            (b_values[n_value] - b_values[m_value])
                            / (n_value - m_value),
                        )

            mode_matrix = [
                [F(n_value) if i == j else F(0) for j in range(len(modes))]
                for i, n_value in enumerate(modes)
            ]
            left = matmul(mode_matrix, matrix)
            right = matmul(matrix, mode_matrix)
            beta = [b_values[n_value] for n_value in modes]
            for i in range(len(modes)):
                for j in range(len(modes)):
                    self.assertEqual(
                        left[i][j] - right[i][j],
                        beta[i] - beta[j],
                    )

    def test_exact_parity_blocks_strict_order_and_odd_j1(self) -> None:
        for size in (2, 5, 11):
            modes, matrix = source_matrix(size)
            index = {mode: offset for offset, mode in enumerate(modes)}
            c_value = F(1, size**4)
            odd = []
            positive_even = []
            for n_value in range(1, size + 1):
                odd_row = []
                even_row = []
                for m_value in range(1, size + 1):
                    odd_row.append(
                        matrix[index[n_value]][index[m_value]]
                        - matrix[index[n_value]][index[-m_value]]
                    )
                    even_row.append(
                        matrix[index[n_value]][index[m_value]]
                        + matrix[index[n_value]][index[-m_value]]
                    )
                odd.append(odd_row)
                positive_even.append(even_row)

            for i in range(size):
                for j in range(size):
                    expected_odd = (
                        F(1)
                        if i == j == size - 1
                        else F(2) if i == j else F(0)
                    )
                    self.assertEqual(odd[i][j], expected_odd)
                    diagonal = F(1) if i == size - 1 else F(2)
                    expected_even = (diagonal if i == j else F(0)) - 2 * c_value
                    self.assertEqual(positive_even[i][j], expected_even)

            odd_floor = F(1)
            full_even_top_trial = F(1) - 2 * c_value
            self.assertLess(full_even_top_trial, odd_floor)
            self.assertEqual(F(3, size * size), F(3) / size**2)

    def test_quadratic_extension_even_ground_equation_exactly(self) -> None:
        # Elements are p+q*delta, reduced with
        # delta^2=2*c-(1-2*c*N)*delta.
        for size in (2, 3, 8, 17):
            c_value = F(1, size**4)
            delta_constant = 2 * c_value
            delta_linear = -(F(1) - 2 * c_value * size)

            def add(left: tuple[F, F], right: tuple[F, F]) -> tuple[F, F]:
                return left[0] + right[0], left[1] + right[1]

            def scale(value: tuple[F, F], scalar: F) -> tuple[F, F]:
                return value[0] * scalar, value[1] * scalar

            def multiply(
                left: tuple[F, F], right: tuple[F, F]
            ) -> tuple[F, F]:
                constant = left[0] * right[0] + left[1] * right[1] * delta_constant
                linear = (
                    left[0] * right[1]
                    + left[1] * right[0]
                    + left[1] * right[1] * delta_linear
                )
                return constant, linear

            lower = (F(0), F(1))
            top = (F(1), F(1))
            vector = [lower] * (size - 1) + [top]
            vector_sum = (F(1), F(size))
            eigenvalue = (F(1), F(-1))
            for index, value in enumerate(vector):
                diagonal = F(1) if index == size - 1 else F(2)
                left = add(scale(value, diagonal), scale(vector_sum, -2 * c_value))
                right = multiply(eigenvalue, value)
                self.assertEqual(left, right)

            def polynomial(argument: F) -> F:
                return (
                    argument * argument
                    + (F(1) - 2 * c_value * size) * argument
                    - 2 * c_value
                )

            self.assertLess(polynomial(2 * c_value), 0)
            self.assertGreaterEqual(polynomial(F(16, 7) * c_value), 0)

    def test_even_j2_asymptotic_and_zero_residual(self) -> None:
        scaled_values = []
        for size in (2, 3, 5, 10, 25, 100):
            delta, j_value, vector = j2_ground(size)
            c_value = size ** -4
            alpha = 1.0 - delta
            vector_sum = sum(vector)
            residual = []
            for index, value in enumerate(vector):
                diagonal = 1.0 if index == size - 1 else 2.0
                residual.append(
                    diagonal * value - 2.0 * c_value * vector_sum - alpha * value
                )
            self.assertLess(max(abs(value) for value in residual), 2e-14)
            self.assertGreater(delta, 2.0 * c_value)
            self.assertLessEqual(delta, (16.0 / 7.0) * c_value)
            scaled = size**4 * j_value
            scaled_values.append(scaled)
            self.assertGreater(scaled, 3.0)
            self.assertLess(scaled, 6.0)
            self.assertLess(abs(scaled - 3.0) * size * size, 16.0)
        self.assertLess(scaled_values[-1], scaled_values[0])

    def test_critical_schedule_defeats_both_support_only_bounds(self) -> None:
        density = 0.2
        gamma_one = 14.0
        target = 0.5
        odd_threshold = (2.0 * math.pi / gamma_one) ** 2
        even_threshold = (2.0 * math.pi / gamma_one) ** 4 / target
        odd_values = []
        even_values = []
        for length in (8.0, 12.0, 16.0):
            size = math.ceil(density * math.exp(length) * length)
            odd_scaled = length * length * 3.0 / (size * size)
            _, j_value, _ = j2_ground(size)
            even_scaled = length**4 * j_value
            odd_values.append(odd_scaled)
            even_values.append(even_scaled)
        self.assertTrue(all(value < odd_threshold for value in odd_values))
        self.assertTrue(all(value < even_threshold for value in even_values))
        self.assertTrue(
            all(left > right for left, right in zip(odd_values, odd_values[1:]))
        )
        self.assertTrue(
            all(left > right for left, right in zip(even_values, even_values[1:]))
        )

    def test_evaluation_integer_scope_and_hsw_degenerate_columns(self) -> None:
        for size in (2, 5, 19):
            c_value = F(1, size**4)
            approximation_scale = F(1, size**10)
            self.assertLess(approximation_scale, c_value / 4)
            self.assertLess(
                approximation_scale / c_value,
                F(1, size**4),
            )

        # In the HSW-compatible carrier model at L=k*L_0, a row indexed
        # by m can see only column k*m.
        for multiplier in (2, 3, 5):
            for row_index in (1, 4, 9):
                carrier_column = multiplier * row_index
                for column in range(1, carrier_column + 3):
                    visible = column == carrier_column
                    self.assertEqual(
                        visible,
                        column % multiplier == 0 and column // multiplier == row_index,
                    )
            top = 101 * multiplier + 1
            self.assertNotEqual(top % multiplier, 0)
            self.assertEqual(F(3, top * top), F(3) / top**2)
            self.assertEqual(F(3, top**4), F(3) / top**4)

        self.assertLess(F(1, 40), F(103787, 1000000))

    def test_claim_boundary_and_minimal_input(self) -> None:
        required = (
            "P0_INVALIDATED",
            "L^2J_1(u)",
            "L^4J_2(h)",
            "J_1={3\\over N^2}",
            "J_2={3\\over N^4}+O(N^{-6})",
            "exact source displacement",
            "simple and even",
            "nonzero source-boundary pairing",
            "positive real Fourier-evaluation Gram",
            "positive integer",
            "HSW-compatible carrier-lattice multiset",
            "singular and its ground is degenerate",
            "phase-sensitive relative",
            "changes none of the standard eight",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual zeta ground escapes",
            "actual-zeta gate failure",
            "the HSW model has a simple ground",
            "the evaluation nodes are zeta ordinates",
            "the finite gates are closed",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
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

    def test_static_ascii_ast_hash_and_cache_clean(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        self.note_bytes.decode("ascii")
        test_bytes.decode("ascii")
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        self.assertNotRegex(self.text, r"(?<!\\)\b(?:qquad|quad)\b")
        self.assertIsNone(
            re.search(r"\\begin\{aligned\}.*?\\tag", self.text, flags=re.S)
        )
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
