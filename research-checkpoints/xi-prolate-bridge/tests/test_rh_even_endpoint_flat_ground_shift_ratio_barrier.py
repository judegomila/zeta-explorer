#!/usr/bin/env python3
"""Exact regressions for the RH even endpoint-flat ground-shift barrier."""

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
NOTE = ROOT / "notes" / "RH_EVEN_ENDPOINT_FLAT_GROUND_SHIFT_RATIO_BARRIER.md"
NOTE_HASH = "3aefae1160a823e7cd2ea4b5d35dc3c2048ea98faf855297a7b3e3212fae7d1e"

FROZEN = {
    "notes/RH_EVEN_QUOTIENT_ENDPOINT_FLAT_FLOOR_OBSTRUCTION.md":
        "b0a561a048df0b0eede249be8cc014ce29b8aa8fa29efb61de5d9bf773822d8c",
    "tests/test_rh_even_quotient_endpoint_flat_floor_obstruction.py":
        "1f9caeec9487afd7a632b8572e1e401dbca22a2acb2b37b5359d5b5bf6ce1742",
    "notes/RH_EVEN_DERIVATIVE_RELATIVE_LEAKAGE_COMPARISON_BARRIER.md":
        "0cf345e6eccd543fa2552848bc79be9b51e0e74217b2947ca9c1ad8cde26479c",
    "tests/test_rh_even_derivative_relative_leakage_comparison_barrier.py":
        "5f70ccb12dfc9892f020551a17bdf516706b353fcd60f18108aa93ca923214d7",
    "notes/CENTRAL_PROLATE_NORMALIZATION_FEEDBACK_BARRIER.md":
        "00efc515b17157da25e980962aee7fafdd4ea522e92b5db0caca290fead0490d",
    "tests/test_central_prolate_normalization_feedback_barrier.py":
        "128026af692bf3f03663510b4dadbab3518509e107ab488c1c00a4e9f3a84e66",
    "notes/RH_EVEN_ZERO_GRAM_GEVREY_RELATIVE_RESERVE_BARRIER.md":
        "4527a5cc5ba8a7c66b76ff70c4aa4423aaecd60fe10ba52cee134b9d9c2ef36c",
    "tests/test_rh_even_zero_gram_gevrey_relative_reserve_barrier.py":
        "fe276d7e4e60f1f40ec10fc4dac1cee8084fc3e8df969fa3a9f30ef64cd4ad86",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: list[F], right: list[F]) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: list[list[F]], vector: list[F]) -> list[F]:
    return [dot(row, vector) for row in matrix]


def determinant(matrix: list[list[F]]) -> F:
    work = [row[:] for row in matrix]
    size = len(work)
    result = F(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column]), None
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for row in range(column + 1, size):
            multiplier = work[row][column] / pivot_value
            for index in range(column + 1, size):
                work[row][index] -= multiplier * work[column][index]
    return result


def source_model(
    size: int, tau: F, epsilon: F
) -> tuple[list[int], list[F], list[list[F]]]:
    modes = list(range(-size, size + 1))
    dimension = 2 * size + 1
    source_row = [-epsilon * F(index, dimension) for index in modes]
    diagonal = tau + epsilon * F(dimension - 1, dimension)
    matrix: list[list[F]] = []
    for i, left in enumerate(modes):
        row: list[F] = []
        for j, right in enumerate(modes):
            if i == j:
                row.append(diagonal)
            else:
                row.append((source_row[i] - source_row[j]) / (left - right))
        matrix.append(row)
    return modes, source_row, matrix


def positive_principal(size: int, tau: F, epsilon: F) -> list[list[F]]:
    dimension = 2 * size + 1
    return [
        [
            tau + epsilon - 2 * epsilon / dimension
            if row == column
            else -2 * epsilon / dimension
            for column in range(size)
        ]
        for row in range(size)
    ]


class RHEvenEndpointFlatGroundShiftRatioBarrierTests(unittest.TestCase):
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

    def test_clamped_twice_primitive_and_tail_orientation(self) -> None:
        # Frequencies are 1,2,3,4 after an irrelevant common rescaling.
        h = [F(1), F(-3), F(3), F(-1)]
        frequencies = [F(1), F(2), F(3), F(4)]
        self.assertEqual(sum(h, F(0)), 0)

        primitive_positive = [
            -coefficient / frequency**2
            for coefficient, frequency in zip(h, frequencies)
        ]
        primitive_central_over_sqrt2 = -sum(primitive_positive, F(0))
        self.assertEqual(
            primitive_central_over_sqrt2,
            sum(
                coefficient / frequency**2
                for coefficient, frequency in zip(h, frequencies)
            ),
        )
        recovered = [
            -(frequency**2) * coefficient
            for coefficient, frequency in zip(primitive_positive, frequencies)
        ]
        self.assertEqual(recovered, h)

        norm_h_squared = dot(h, h)
        norm_g_squared = (
            2 * primitive_central_over_sqrt2**2
            + dot(primitive_positive, primitive_positive)
        )
        derivative_ratio = norm_h_squared / norm_g_squared
        omega = max(frequencies)
        self.assertLessEqual(derivative_ratio, omega**4)

        # The first two rows have been annihilated.  Surviving samples start
        # at T=10, so division by gamma^4 has the favorable orientation.
        heights = [F(3), F(7), F(10), F(12)]
        samples_h = [F(0), F(0), F(2, 5), F(-3, 7)]
        threshold = F(10)
        energy_h = sum((value**2 for value in samples_h), F(0))
        samples_g = [
            -value / height**2
            for value, height in zip(samples_h, heights)
        ]
        energy_g = sum((value**2 for value in samples_g), F(0))
        self.assertLessEqual(energy_g, energy_h / threshold**4)

        rayleigh_ratio = (
            (energy_g / norm_g_squared) / (energy_h / norm_h_squared)
        )
        self.assertLessEqual(
            rayleigh_ratio, derivative_ratio / threshold**4
        )
        self.assertLessEqual(rayleigh_ratio, (omega / threshold) ** 4)

    def test_shifted_hyperplane_is_exact_source_cauchy(self) -> None:
        size = 3
        tau = F(2, 7)
        epsilon = F(5, 11)
        modes, source_row, matrix = source_model(size, tau, epsilon)
        dimension = 2 * size + 1
        eta = [F(1) for _ in modes]

        for i, left in enumerate(modes):
            self.assertEqual(source_row[i], -source_row[-i - 1])
            for j, right in enumerate(modes):
                self.assertEqual(matrix[i][j], matrix[-i - 1][-j - 1])
                expected = (
                    tau + epsilon * F(dimension - 1, dimension)
                    if i == j
                    else -epsilon / dimension
                )
                self.assertEqual(matrix[i][j], expected)
                if i != j:
                    self.assertEqual(
                        matrix[i][j],
                        (source_row[i] - source_row[j]) / (left - right),
                    )

        self.assertEqual(
            matvec(matrix, eta), [tau * value for value in eta]
        )
        for index in range(1, size + 1):
            odd = [F(0) for _ in modes]
            odd[modes.index(index)] = 1
            odd[modes.index(-index)] = -1
            self.assertEqual(
                matvec(matrix, odd),
                [(tau + epsilon) * value for value in odd],
            )

        sum_zero = [F(1), F(-2), F(1), F(0), F(0), F(0), F(0)]
        self.assertEqual(sum(sum_zero, F(0)), 0)
        self.assertEqual(
            matvec(matrix, sum_zero),
            [(tau + epsilon) * value for value in sum_zero],
        )
        self.assertEqual(
            determinant(matrix), tau * (tau + epsilon) ** (dimension - 1)
        )

    def test_positive_principal_floor_and_exact_schur_identity(self) -> None:
        size = 4
        dimension = 2 * size + 1
        tau = F(3, 13)
        epsilon = F(7, 17)
        principal = positive_principal(size, tau, epsilon)
        ones = [F(1) for _ in range(size)]
        transverse = [F(1), F(-1), F(0), F(0)]
        floor = tau + epsilon / dimension

        self.assertEqual(
            matvec(principal, ones), [floor * value for value in ones]
        )
        self.assertEqual(
            matvec(principal, transverse),
            [(tau + epsilon) * value for value in transverse],
        )
        self.assertEqual(
            determinant(principal),
            floor * (tau + epsilon) ** (size - 1),
        )

        central_diagonal = tau + epsilon * F(dimension - 1, dimension)
        coupling_norm_squared = 2 * epsilon**2 * size / dimension**2
        shifted_inverse_on_ones = F(dimension, epsilon)
        schur_load = coupling_norm_squared * shifted_inverse_on_ones
        self.assertEqual(
            schur_load, epsilon * F(dimension - 1, dimension)
        )
        self.assertEqual(schur_load, central_diagonal - tau)

        determinant_ratio = tau * (tau + epsilon) / floor
        zero_schur = (
            central_diagonal - coupling_norm_squared / floor
        )
        self.assertEqual(zero_schur, determinant_ratio)

        shifted_even_cofactor = epsilon**size / dimension
        shifted_odd_determinant = epsilon**size
        self.assertEqual(
            shifted_even_cofactor * dimension, shifted_odd_determinant
        )

    def test_same_anchor_rayleighs_remain_distinct(self) -> None:
        size = 2
        dimension = 2 * size + 1
        target_scale = F(1)
        tau = target_scale / 5
        epsilon = 4 * target_scale / 5
        modes, _, matrix = source_model(size, tau, epsilon)

        # Same normalized real even comparison anchor used in the existing
        # central/prolate regression.
        kappa = [F(0), F(2, 3), F(1, 3), F(2, 3), F(0)]
        self.assertEqual(dot(kappa, kappa), 1)
        anchor_overlap_squared = sum(kappa, F(0)) ** 2 / dimension
        q_value = dot(kappa, matvec(matrix, kappa))
        self.assertEqual(
            q_value, tau + epsilon * (1 - anchor_overlap_squared)
        )

        # A positive-index even endpoint-flat direction.
        flat = [F(1, 2), F(-1, 2), F(0), F(-1, 2), F(1, 2)]
        self.assertEqual(dot(flat, flat), 1)
        self.assertEqual(sum(flat, F(0)), 0)
        flat_value = dot(flat, matvec(matrix, flat))
        self.assertEqual(flat_value, target_scale)

        # A different positive-index even derivative direction.
        derivative = [F(7, 10), F(-1, 10), F(0), F(-1, 10), F(7, 10)]
        self.assertEqual(dot(derivative, derivative), 1)
        derivative_overlap_squared = sum(derivative, F(0)) ** 2 / dimension
        derivative_value = dot(derivative, matvec(matrix, derivative))
        self.assertEqual(
            derivative_value,
            tau + epsilon * (1 - derivative_overlap_squared),
        )

        floor = tau + epsilon / dimension
        mu = tau
        self.assertLess(mu, floor)
        self.assertLessEqual(floor, derivative_value)
        self.assertLess(derivative_value, flat_value)
        self.assertNotEqual(q_value, derivative_value)
        self.assertNotEqual(q_value, floor)
        self.assertNotEqual(mu, q_value)

    def test_scale_model_defeats_the_reserve_but_not_primitive_scalar(self) -> None:
        theta_star = 0.727366608780532
        primitive_constant = (1 / (2 * theta_star)) ** 4
        self.assertGreater(primitive_constant, 0.2232)
        self.assertLess(primitive_constant, 0.2234)
        self.assertLess(F(1, 5), primitive_constant)

        ratios: list[F] = []
        for size in (5, 20, 100, 500):
            dimension = 2 * size + 1
            target_scale = F(1, size + 3)
            tau = target_scale / 5
            epsilon = 4 * target_scale / 5
            floor = tau + epsilon / dimension
            ratios.append(tau / floor)
            self.assertEqual((tau + epsilon), target_scale)
            self.assertEqual(tau / target_scale, F(1, 5))
            self.assertLess(tau / target_scale, primitive_constant)
        self.assertTrue(all(left < right for left, right in zip(ratios, ratios[1:])))
        self.assertGreater(ratios[-1], F(99, 100))

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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
            raw.decode("ascii")

        required = (
            "varkappa_N^{\\rm flat}",
            "s_0=a-b^*(A^\\circ)^{-1}b",
            "q_N^{\\rm str}",
            "r_N^{{\\rm pr},{\\rm str}}",
            "structural source-Cauchy matrix",
            "not the actual zeta zero Gram",
            "tau=0",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual reserve follows",
            "the actual zeta zero Gram fails",
            "varkappa_N^{\\rm flat}=1",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)


if __name__ == "__main__":
    unittest.main()
