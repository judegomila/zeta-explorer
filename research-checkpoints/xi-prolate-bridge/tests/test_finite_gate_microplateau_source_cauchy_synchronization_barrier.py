#!/usr/bin/env python3
"""Exact regressions for the finite-gate synchronization barrier."""

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

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FINITE_GATE_MICROPLATEAU_SOURCE_CAUCHY_SYNCHRONIZATION_BARRIER.md"
)
NOTE_HASH = "d79cd5b7366ae8171a9c566b13618461b39fe62f68425ee3f4af0c9da215721f"
FROZEN = {
    "notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md":
        "ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f",
    "tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py":
        "e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d",
    "notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md":
        "2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87",
    "tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py":
        "d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97",
    "notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md":
        "e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26",
    "tests/test_source_cauchy_selector_cone_projective_tradeoff.py":
        "f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def max_abs(matrix: mp.matrix) -> mp.mpf:
    return max(
        abs(matrix[row, column])
        for row in range(matrix.rows)
        for column in range(matrix.cols)
    )


def source_matrix(
    cutoff: int,
    diagonal: dict[int, mp.mpf],
    source: dict[int, mp.mpf],
) -> tuple[list[int], mp.matrix]:
    modes = list(range(-cutoff, cutoff + 1))
    matrix = mp.matrix(len(modes))
    for row, n_value in enumerate(modes):
        for column, m_value in enumerate(modes):
            if n_value == m_value:
                matrix[row, column] = diagonal[abs(n_value)]
            else:
                matrix[row, column] = (
                    source[n_value] - source[m_value]
                ) / (n_value - m_value)
    return modes, matrix


def parity_bases(cutoff: int) -> tuple[mp.matrix, mp.matrix]:
    dimension = 2 * cutoff + 1
    plus = mp.matrix(dimension, cutoff + 1)
    minus = mp.matrix(dimension, cutoff)
    plus[cutoff, 0] = 1
    for index in range(1, cutoff + 1):
        positive = cutoff + index
        negative = cutoff - index
        plus[positive, index] = 1 / mp.sqrt(2)
        plus[negative, index] = 1 / mp.sqrt(2)
        minus[positive, index - 1] = 1 / mp.sqrt(2)
        minus[negative, index - 1] = -1 / mp.sqrt(2)
    return plus, minus


def compress(
    matrix: mp.matrix,
    basis: mp.matrix,
) -> mp.matrix:
    return basis.T * matrix * basis


def eigenvalues(matrix: mp.matrix) -> list[mp.mpf]:
    values = mp.eigsy(matrix, eigvals_only=True)
    return [mp.mpf(values[index]) for index in range(values.rows)]


def favorable_matrix(
    cutoff: int,
    ground: mp.mpf,
    gap: mp.mpf,
) -> tuple[mp.matrix, mp.matrix]:
    dimension = 2 * cutoff + 1
    eta = mp.matrix([1] * dimension)
    unit = eta / mp.sqrt(dimension)
    identity = mp.eye(dimension)
    matrix = (
        ground * identity
        + gap * (identity - unit * unit.T)
    )
    return matrix, unit


def selector_matrix(
    cutoff: int,
    rho: mp.mpf,
    gamma: mp.mpf,
) -> tuple[mp.matrix, mp.matrix, mp.matrix]:
    modes = list(range(-cutoff, cutoff + 1))
    u_value = mp.matrix([
        mp.sqrt(gamma) * rho / (rho + n_value**2)
        for n_value in modes
    ])
    v_value = mp.matrix([
        mp.sqrt(gamma) * n_value / (rho + n_value**2)
        for n_value in modes
    ])
    matrix = u_value * u_value.T - rho * v_value * v_value.T
    return matrix, u_value, v_value


def q_kernel(
    n_value: int,
    m_value: int,
    x_value: mp.mpf,
    length: mp.mpf,
) -> mp.mpf:
    if n_value == m_value:
        return (
            2 * (1 - x_value / length)
            * mp.cos(2 * mp.pi * n_value * x_value / length)
        )
    return (
        mp.sin(2 * mp.pi * m_value * x_value / length)
        - mp.sin(2 * mp.pi * n_value * x_value / length)
    ) / (mp.pi * (n_value - m_value))


class FiniteGateMicroplateauSourceCauchySynchronizationBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 100
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

    def test_favorable_source_cauchy_anchor_and_selector_diagonal(self) -> None:
        cutoff = 4
        dimension = 2 * cutoff + 1
        ground = Fraction(2, 7)
        gap = Fraction(3, 11)
        diagonal = {
            index: ground + gap * (1 - Fraction(1, dimension))
            for index in range(cutoff + 1)
        }
        source = {
            index: -gap * Fraction(index, dimension)
            for index in range(-cutoff, cutoff + 1)
        }
        modes, exact = source_matrix(cutoff, diagonal, source)
        for row, n_value in enumerate(modes):
            for column, m_value in enumerate(modes):
                if row == column:
                    self.assertEqual(exact[row, column], mp.mpf(diagonal[abs(n_value)].numerator) / diagonal[abs(n_value)].denominator)
                else:
                    self.assertEqual(
                        exact[row, column],
                        -mp.mpf(gap.numerator) / (gap.denominator * dimension),
                    )

        matrix, unit = favorable_matrix(
            cutoff,
            mp.mpf(ground.numerator) / ground.denominator,
            mp.mpf(gap.numerator) / gap.denominator,
        )
        self.assertLess(max_abs(matrix - exact), mp.mpf("1e-90"))
        plus, minus = parity_bases(cutoff)
        plus_values = eigenvalues(compress(matrix, plus))
        minus_values = eigenvalues(compress(matrix, minus))
        self.assertLess(abs(plus_values[0] - mp.mpf(2) / 7), mp.mpf("1e-90"))
        self.assertTrue(
            all(abs(value - (mp.mpf(2) / 7 + mp.mpf(3) / 11)) < mp.mpf("1e-90")
                for value in plus_values[1:] + minus_values)
        )
        eta = mp.matrix([1] * dimension)
        self.assertLess(
            abs((eta.T * unit)[0] - mp.sqrt(dimension)),
            mp.mpf("1e-90"),
        )
        for index in range(1, cutoff + 1):
            shifted_diagonal = mp.mpf(gap.numerator) / gap.denominator * (
                1 - mp.mpf(1) / dimension
            )
            source_value = (
                -mp.mpf(gap.numerator) / gap.denominator
                * index / dimension
            )
            selector_diagonal = shifted_diagonal - source_value / index
            self.assertLess(
                abs(selector_diagonal - mp.mpf(gap.numerator) / gap.denominator),
                mp.mpf("1e-90"),
            )

    def test_actual_anchor_branches_residual_and_complement_reserve(self) -> None:
        cutoff = 3
        dimension = 2 * cutoff + 1
        ground_value = mp.mpf("0.2")
        gap = mp.mpf("0.07")
        matrix, unit = favorable_matrix(cutoff, ground_value, gap)
        plus, _ = parity_bases(cutoff)
        first_even = mp.matrix(dimension, 1)
        first_even[cutoff - 1] = 1 / mp.sqrt(2)
        first_even[cutoff + 1] = 1 / mp.sqrt(2)
        overlap = (unit.T * first_even)[0]
        transverse = first_even - overlap * unit
        transverse /= mp.sqrt((transverse.T * transverse)[0])
        anchor = (unit + transverse) / mp.sqrt(2)
        alpha = (unit.T * anchor)[0]
        self.assertLess(abs(alpha**2 - mp.mpf("0.5")), mp.mpf("1e-90"))

        rayleigh = (anchor.T * matrix * anchor)[0]
        expected = ground_value + gap * (1 - alpha**2)
        self.assertLess(abs(rayleigh - expected), mp.mpf("1e-90"))
        residual = matrix * anchor - rayleigh * anchor
        expected_residual = gap * (alpha**2 * anchor - alpha * unit)
        self.assertLess(max_abs(residual - expected_residual), mp.mpf("1e-90"))
        reconstructed = alpha * anchor - residual / (gap * alpha)
        self.assertLess(max_abs(reconstructed - unit), mp.mpf("1e-90"))

        identity = mp.eye(dimension)
        projector = identity - anchor * anchor.T
        shifted = matrix - ground_value * identity
        compressed = projector * shifted * projector
        nonzero = [
            value for value in eigenvalues(compressed)
            if value > mp.mpf("1e-50")
        ]
        self.assertEqual(len(nonzero), dimension - 1)
        self.assertLess(
            abs(min(nonzero) - gap * alpha**2),
            mp.mpf("1e-80"),
        )

        zero_overlap_anchor = transverse
        zero_rayleigh = (
            zero_overlap_anchor.T * matrix * zero_overlap_anchor
        )[0]
        zero_residual = (
            matrix * zero_overlap_anchor
            - zero_rayleigh * zero_overlap_anchor
        )
        self.assertLess(max_abs(zero_residual), mp.mpf("1e-90"))
        self.assertLess(
            abs(zero_rayleigh - ground_value - gap),
            mp.mpf("1e-90"),
        )

    def test_regular_selector_source_factorization_and_collapse_radius(self) -> None:
        cutoff = 3
        rho = mp.mpf(2)
        gamma = mp.mpf(3)
        matrix, u_value, v_value = selector_matrix(
            cutoff, rho, gamma
        )
        modes = list(range(-cutoff, cutoff + 1))
        for row, n_value in enumerate(modes):
            a_value = (
                gamma * rho * (rho - n_value**2)
                / (rho + n_value**2) ** 2
            )
            self.assertLess(abs(matrix[row, row] - a_value), mp.mpf("1e-90"))
            b_value = gamma * n_value * rho / (rho + n_value**2)
            for column, m_value in enumerate(modes):
                closed = (
                    gamma * rho * (rho - n_value * m_value)
                    / ((rho + n_value**2) * (rho + m_value**2))
                )
                self.assertLess(
                    abs(matrix[row, column] - closed),
                    mp.mpf("1e-90"),
                )
                if row != column:
                    b_other = gamma * m_value * rho / (rho + m_value**2)
                    self.assertLess(
                        abs(
                            matrix[row, column]
                            - (b_value - b_other) / (n_value - m_value)
                        ),
                        mp.mpf("1e-90"),
                    )
        factored = u_value * u_value.T - rho * v_value * v_value.T
        self.assertLess(max_abs(matrix - factored), mp.mpf("1e-90"))

        ground = mp.mpf("0.04")
        gap = mp.mpf("1e-7")
        base, _ = favorable_matrix(cutoff, ground, gap)
        v_norm_squared = (v_value.T * v_value)[0]
        crossing_bound = gap / (rho * v_norm_squared)
        at_bound = base + crossing_bound * matrix
        plus, minus = parity_bases(cutoff)
        even_floor = eigenvalues(compress(at_bound, plus))[0]
        odd_floor = eigenvalues(compress(at_bound, minus))[0]
        self.assertGreaterEqual(even_floor + mp.mpf("1e-80"), ground)
        self.assertLessEqual(odd_floor, ground + mp.mpf("1e-80"))
        self.assertLess(odd_floor, even_floor)

        smaller_gap = gap / 1000
        smaller_radius = smaller_gap / (rho * v_norm_squared)
        self.assertLess(
            abs(crossing_bound / smaller_radius - 1000),
            mp.mpf("1e-80"),
        )
        self.assertGreater(max_abs(matrix), 0)

    def test_exact_nested_rational_parity_flip(self) -> None:
        diagonal_one = {0: mp.mpf(1), 1: mp.mpf(11) / 10}
        source_one = {
            -1: -mp.mpf(1) / 5,
            0: mp.mpf(0),
            1: mp.mpf(1) / 5,
        }
        modes_one, matrix_one = source_matrix(
            1, diagonal_one, source_one
        )
        plus_one, minus_one = parity_bases(1)
        even_one = eigenvalues(compress(matrix_one, plus_one))
        odd_one = eigenvalues(compress(matrix_one, minus_one))
        expected_even_one = [
            (23 - mp.sqrt(41)) / 20,
            (23 + mp.sqrt(41)) / 20,
        ]
        self.assertTrue(
            all(abs(left - right) < mp.mpf("1e-90")
                for left, right in zip(even_one, expected_even_one))
        )
        self.assertLess(abs(odd_one[0] - mp.mpf(9) / 10), mp.mpf("1e-90"))
        self.assertLess(even_one[0], odd_one[0])

        diagonal_two = {
            0: mp.mpf(1),
            1: mp.mpf(11) / 10,
            2: mp.mpf(5),
        }
        source_two = {
            -2: mp.mpf(4) / 5,
            -1: -mp.mpf(1) / 5,
            0: mp.mpf(0),
            1: mp.mpf(1) / 5,
            2: -mp.mpf(4) / 5,
        }
        modes_two, matrix_two = source_matrix(
            2, diagonal_two, source_two
        )
        old_indices = [modes_two.index(value) for value in modes_one]
        principal = mp.matrix(3)
        for row, old_row in enumerate(old_indices):
            for column, old_column in enumerate(old_indices):
                principal[row, column] = matrix_two[old_row, old_column]
        self.assertLess(max_abs(principal - matrix_one), mp.mpf("1e-90"))

        plus_two, minus_two = parity_bases(2)
        even_two = eigenvalues(compress(matrix_two, plus_two))
        odd_two = eigenvalues(compress(matrix_two, minus_two))
        expected_even_two = sorted([
            mp.mpf(1),
            (59 - 5 * mp.sqrt(73)) / 20,
            (59 + 5 * mp.sqrt(73)) / 20,
        ])
        expected_odd_two = [
            (63 - mp.sqrt(2281)) / 20,
            (63 + mp.sqrt(2281)) / 20,
        ]
        self.assertTrue(
            all(abs(left - right) < mp.mpf("1e-85")
                for left, right in zip(even_two, expected_even_two))
        )
        self.assertTrue(
            all(abs(left - right) < mp.mpf("1e-85")
                for left, right in zip(odd_two, expected_odd_two))
        )
        self.assertGreater(min(even_two + odd_two), 0)
        self.assertLess(odd_two[0], even_two[0])
        comparison_square = 2281 - (4 + 5 * mp.sqrt(73)) ** 2
        self.assertLess(
            abs(comparison_square - 40 * (11 - mp.sqrt(73))),
            mp.mpf("1e-85"),
        )
        self.assertGreater(comparison_square, 0)

    def test_large_diagonal_padding_gives_long_bad_window(self) -> None:
        padding_diagonal = mp.mpf("1e8")
        for cutoff in (2, 3, 5, 10, 20):
            diagonal = {
                0: mp.mpf(1),
                1: mp.mpf(11) / 10,
                2: mp.mpf(5),
            }
            diagonal.update({
                index: padding_diagonal
                for index in range(3, cutoff + 1)
            })
            source = {
                index: mp.mpf(0)
                for index in range(-cutoff, cutoff + 1)
            }
            source[-2] = mp.mpf(4) / 5
            source[-1] = -mp.mpf(1) / 5
            source[1] = mp.mpf(1) / 5
            source[2] = -mp.mpf(4) / 5
            _, matrix = source_matrix(cutoff, diagonal, source)
            plus, minus = parity_bases(cutoff)
            even_floor = eigenvalues(compress(matrix, plus))[0]
            odd_floor = eigenvalues(compress(matrix, minus))[0]
            self.assertGreater(odd_floor, 0)
            self.assertLess(odd_floor, even_floor)

        c_plus = mp.mpf(0)
        c_minus = mp.mpf(0)
        b_values = {1: mp.mpf(1) / 5, 2: -mp.mpf(4) / 5}
        for index in range(3, 10000):
            for old_index, b_value in b_values.items():
                c_plus += (
                    2 * old_index * b_value
                    / (index**2 - old_index**2)
                ) ** 2
                c_minus += (
                    2 * index * b_value
                    / (index**2 - old_index**2)
                ) ** 2
        self.assertTrue(mp.isfinite(c_plus))
        self.assertTrue(mp.isfinite(c_minus))
        self.assertLess(c_plus, 1)
        self.assertLess(c_minus, 2)

    def test_quantitative_margin_modulus_conditions(self) -> None:
        ground_margins = (0.30, 0.24)
        shifted_margins = (0.12, 0.15)
        boundary = 0.4
        denominator = 0.09
        reserve = 0.05
        constants = {
            "matrix": 2.0,
            "ritz": 1.0,
            "boundary": 0.5,
            "denominator": 0.3,
            "reserve": 0.2,
        }
        radius = 0.01
        omega_matrix = constants["matrix"] * radius
        omega_ritz = constants["ritz"] * radius
        self.assertLess(2 * omega_matrix, min(ground_margins))
        self.assertLess(
            omega_matrix + omega_ritz,
            min(shifted_margins),
        )
        self.assertLess(constants["boundary"] * radius, boundary)
        self.assertLess(constants["denominator"] * radius, denominator)
        self.assertLess(constants["reserve"] * radius, reserve)
        synchronization_radius = min(
            min(ground_margins) / (2 * constants["matrix"]),
            min(shifted_margins)
            / (constants["matrix"] + constants["ritz"]),
            boundary / constants["boundary"],
            denominator / constants["denominator"],
            reserve / constants["reserve"],
        )
        self.assertGreater(synchronization_radius, radius)
        self.assertIn(
            r"{A\over t}<R_{\rm sync}",
            self.text,
        )

    def test_prime_threshold_is_continuous_with_rank_one_derivative_jump(self) -> None:
        length = mp.mpf("7.3")
        step = mp.mpf("1e-20")
        for n_value, m_value in (
            (0, 0),
            (2, 2),
            (-3, -3),
            (1, 4),
            (-2, 3),
        ):
            self.assertLess(
                abs(q_kernel(n_value, m_value, length, length)),
                mp.mpf("1e-90"),
            )
            derivative = (
                q_kernel(
                    n_value,
                    m_value,
                    length,
                    length + step,
                )
                / step
            )
            self.assertLess(
                abs(derivative - 2 / length),
                mp.mpf("1e-17"),
            )

        cutoff = 6
        dimension = 2 * cutoff + 1
        coefficient = mp.mpf("0.017")
        eta = mp.matrix([1] * dimension)
        jump = coefficient * eta * eta.T
        values = eigenvalues(jump)
        self.assertLess(abs(values[-1] - coefficient * dimension), mp.mpf("1e-90"))
        self.assertTrue(
            all(abs(value) < mp.mpf("1e-90") for value in values[:-1])
        )
        normalized = " ".join(self.text.split())
        self.assertIn(
            "continuous and piecewise smooth, but it is not globally real analytic",
            normalized,
        )

    def test_gate_restricted_aggregate_is_a_new_condition(self) -> None:
        scale = 25.0
        total_endpoint = (1.0, 0.0)
        total_rows = (0.0, scale)
        self.assertGreaterEqual(sum(total_rows), scale * sum(total_endpoint))
        good = (0,)
        self.assertEqual(sum(total_rows[index] for index in good), 0)
        self.assertGreater(sum(total_endpoint[index] for index in good), 0)

        good_endpoint = (2.0, 3.0)
        good_rows = tuple(scale * value for value in good_endpoint)
        self.assertGreater(sum(good_endpoint), 0)
        self.assertGreaterEqual(
            sum(good_rows),
            scale * sum(good_endpoint),
        )
        self.assertIn(
            r"\sum_{n\in K\setminus G}D_n^{\rm act}",
            self.text,
        )

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
            "unbound post-checkpoint-1.45 theorem/barrier note/test pair",
            "changes no standard eight file",
            "A favorable fixed-N source-Cauchy anchor",
            "arbitrarily small good radius",
            "Quantitative fixed-dimension synchronization theorem",
            "actual prime-threshold derivative jump",
            "Exact source-Cauchy parity flip under principal extension",
            "Arbitrarily long bad adjacent-cutoff windows",
            "not the actual arithmetic principal chain",
            "finite selector quantity",
            "Stokes denominator",
            "gate-restricted arithmetic theorem",
            "No such actual synchronization theorem is proved here",
            "P0_INVALIDATED",
        ):
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        for phrase in (
            "the actual finite gates are proved",
            "the actual arithmetic path is q(s)",
            "adjacency preserves the simple-even ground",
            "the stokes denominator follows from the finite selector",
            "the gate-restricted arithmetic theorem is proved",
            "eta_n^pr=o(1) is proved",
            "the riemann hypothesis is proved",
            "actual arithmetic sign is negative",
        ):
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
