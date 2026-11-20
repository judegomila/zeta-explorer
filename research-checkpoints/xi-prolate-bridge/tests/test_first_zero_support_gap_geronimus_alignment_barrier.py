#!/usr/bin/env python3
"""Strict regressions for the first-zero support-gap barrier."""

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
    / "FIRST_ZERO_SUPPORT_GAP_GERONIMUS_ALIGNMENT_BARRIER.md"
)
NOTE_HASH = "2d3c9f69b359f83ca1094cedc910aa78b7eb7779f2c4c55ae22ee96e8263c995"

FROZEN = {
    "notes/CRITICAL_ODD_GROUND_MIXED_VANDERMONDE_COFACTOR_TARGET.md":
        "e29cbe760a3fea646220fa738573638ad42075e92cf4a0345e674002f9f91fda",
    "tests/test_critical_odd_ground_mixed_vandermonde_cofactor_target.py":
        "ee3fd3205cdefb061c4d55f321e69b5cd480fd109b0670bb9d028066d530f51f",
    "notes/CRITICAL_GROUND_NEGATIVE_SOBOLEV_NO_ESCAPE_BARRIER.md":
        "08048a91afda16b0b1305f7355efc5b8be223d7fc8a27a8918da71a8532cdfa6",
    "tests/test_critical_ground_negative_sobolev_no_escape_barrier.py":
        "9afbfa782f507ad1c6ffd2b7e9721d06413a90d82c83c987b1d1abb1441e71a4",
    "notes/RH_ACTUAL_ODD_GROUND_PRIMITIVE_CHRISTOFFEL_PARITY_BARRIER.md":
        "29475ddb8b57f227530b6aa296b088f07c4ac9db0cadd1a2d230b40a780b3157",
    "tests/test_rh_actual_odd_ground_primitive_christoffel_parity_barrier.py":
        "c03b4325d8f04266091dc3cd8ad17f6bf4f91ca97773cf7dfcaedb44f46caeb6",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def determinant(matrix: list[list[F]]) -> F:
    size = len(matrix)
    if size == 0:
        return F(1)
    work = [row[:] for row in matrix]
    result = F(1)
    for column in range(size):
        pivot = next(
            (
                row
                for row in range(column, size)
                if work[row][column] != 0
            ),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for row in range(column + 1, size):
            factor = work[row][column] / pivot_value
            for index in range(column + 1, size):
                work[row][index] -= factor * work[column][index]
    return result


def matrix_vector(matrix: list[list[F]], vector: list[F]) -> list[F]:
    return [
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    ]


def moments(atoms: dict[F, F], largest: int) -> list[F]:
    return [
        sum((weight * node**power for node, weight in atoms.items()), F(0))
        for power in range(largest + 1)
    ]


def hankel(moment_values: list[F], shift: int, size: int) -> list[list[F]]:
    return [
        [moment_values[row + column + shift] for column in range(size)]
        for row in range(size)
    ]


def polynomial_product(roots: list[F]) -> list[F]:
    coefficients = [F(1)]
    for root in roots:
        updated = [F(0)] * (len(coefficients) + 1)
        for index, value in enumerate(coefficients):
            updated[index] += value
            updated[index + 1] -= value / root
        coefficients = updated
    return coefficients


def evaluate(coefficients: list[F], value: F) -> F:
    result = F(0)
    for coefficient in reversed(coefficients):
        result = result * value + coefficient
    return result


def functional(atoms: dict[F, F], coefficients: list[F], power: int) -> F:
    return sum(
        (
            weight
            * node**power
            * evaluate(coefficients, node) ** 2
            for node, weight in atoms.items()
        ),
        F(0),
    )


def carrier_atoms(size: int, h_squared: F = F(1)) -> dict[F, F]:
    center = math.comb(2 * size, size)
    atoms = {F(0): F(1)}
    for index in range(1, size + 1):
        ratio = F(math.comb(2 * size, size - index), center)
        atoms[h_squared * index * index] = 2 * ratio * ratio
    return atoms


def constant_statistics(size: int) -> tuple[F, F]:
    center = math.comb(2 * size, size)
    ratios = [
        F(math.comb(2 * size, size - index), center)
        for index in range(size + 1)
    ]
    s_two = sum(
        (F(index * index) * ratios[index] ** 2 for index in range(1, size + 1)),
        F(0),
    )
    s_four = sum(
        (
            F(index**4) * ratios[index] ** 2
            for index in range(1, size + 1)
        ),
        F(0),
    )
    alternating = sum(
        (
            (-1) ** (size - index) * ratios[index]
            for index in range(1, size + 1)
        ),
        F(0),
    )
    unshifted = sum((value * value for value in ratios[1:]), F(0))
    j_one = (2 * alternating * alternating + unshifted) / s_two
    j_two = (2 * alternating * alternating + unshifted) / s_four
    return j_one, j_two


def low_block_ratios(size: int, cutoff: int) -> tuple[float, float, float]:
    ratio = 1.0
    normalizer = 1.0
    low_zero = 1.0
    low_two = 0.0
    low_four = 0.0
    for index in range(1, size + 1):
        ratio *= (size - index + 1) / (size + index)
        square = ratio * ratio
        normalizer += 2.0 * square
        if index <= cutoff:
            low_zero += 2.0 * square
            low_two += 2.0 * index * index * square
            low_four += 2.0 * index**4 * square
        if index > 10.0 * math.sqrt(size) and square < 1e-30:
            break
    total_two = normalizer * size * size / (4.0 * size - 1.0)
    total_four = (
        normalizer
        * size**3
        * (3.0 * size - 2.0)
        / ((4.0 * size - 1.0) * (4.0 * size - 3.0))
    )
    return (
        low_zero / normalizer,
        low_two / total_two,
        low_four / total_four,
    )


class FirstZeroSupportGapGeronimusAlignmentBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_minimal_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 6)
        self.assertEqual(
            sum(relative.startswith("notes/") for relative in FROZEN),
            3,
        )
        self.assertEqual(
            sum(relative.startswith("tests/") for relative in FROZEN),
            3,
        )
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        self.assertNotIn(NOTE_HASH, {"DRAFT", "PENDING"})
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_carrier_weights_and_vandermonde_normalizer(self) -> None:
        for size in range(1, 13):
            center = math.comb(2 * size, size)
            ratios = [
                F(math.comb(2 * size, size - index), center)
                for index in range(size + 1)
            ]
            normalizer = F(1) + 2 * sum(
                (value * value for value in ratios[1:]),
                F(0),
            )
            expected = F(math.comb(4 * size, 2 * size), center * center)
            self.assertEqual(normalizer, expected)

            scale = F(3, 7)
            h_value = F(2, 5)
            for index in range(1, size + 1):
                derivative = (
                    (-1) ** (size - index)
                    * h_value ** (2 * size - 2)
                    * math.factorial(size - index)
                    * math.factorial(size + index)
                    / (2 * index * index)
                )
                x_value = h_value * h_value * index * index
                weight = F(1, 1) / (2 * x_value * x_value * derivative * derivative)
                base = h_value ** (-4 * size) / math.factorial(size) ** 4
                self.assertEqual(weight / base, 2 * ratios[index] ** 2)
                self.assertEqual(scale * weight / (scale * base), 2 * ratios[index] ** 2)

    def test_exact_hypergeometric_second_and_fourth_moments(self) -> None:
        for size in range(1, 16):
            center = math.comb(2 * size, size)
            raw_weights = [
                F(math.comb(2 * size, size - index) ** 2, center**2)
                for index in range(-size, size + 1)
            ]
            normalizer = sum(raw_weights, F(0))
            second = sum(
                (
                    weight * index * index
                    for index, weight in zip(range(-size, size + 1), raw_weights)
                ),
                F(0),
            ) / normalizer
            fourth = sum(
                (
                    weight * index**4
                    for index, weight in zip(range(-size, size + 1), raw_weights)
                ),
                F(0),
            ) / normalizer
            self.assertEqual(second, F(size * size, 4 * size - 1))
            self.assertEqual(
                fourth,
                F(
                    size**3 * (3 * size - 2),
                    (4 * size - 1) * (4 * size - 3),
                ),
            )

    def test_exact_constant_polynomial_j1_and_j2(self) -> None:
        for size in (1, 2, 3, 4, 7, 12, 25):
            j_one, j_two = constant_statistics(size)
            self.assertEqual(j_one, F(4 * size - 1, size * size))
            self.assertEqual(
                j_two,
                F(
                    (4 * size - 1) * (4 * size - 3),
                    size**3 * (3 * size - 2),
                ),
            )

            center = math.comb(2 * size, size)
            alternating = sum(
                (
                    (-1) ** (size - index)
                    * F(math.comb(2 * size, size - index), center)
                    for index in range(1, size + 1)
                ),
                F(0),
            )
            self.assertEqual(alternating, F((-1) ** (size - 1), 2))

    def test_exact_support_gap_first_variation_has_wrong_sign(self) -> None:
        size = 4
        gap = F(21, 20)
        roots = [F(10_000), F(10_001), F(10_002)]
        polynomial = polynomial_product(roots)
        sigma = carrier_atoms(size)

        sigma_zero = functional(sigma, polynomial, 0)
        sigma_one = functional(sigma, polynomial, 1)
        carrier_mean = sigma_one / sigma_zero
        self.assertGreater(carrier_mean, gap)
        self.assertGreater(F(size * size, 4 * size - 1), gap)

        carrier_moments = moments(sigma, 2 * size)
        carrier_shift = hankel(carrier_moments, 1, size)
        self.assertGreater(determinant(carrier_shift), 0)

        core = {roots[0]: F(2), roots[1]: F(3), roots[2]: F(5)}
        core_moments = moments(core, 2 * size)
        core_shift = hankel(core_moments, 1, size)
        self.assertEqual(matrix_vector(core_shift, polynomial), [F(0)] * size)
        self.assertEqual(determinant(core_shift), 0)
        self.assertGreater(
            determinant([row[: size - 1] for row in core_shift[: size - 1]]),
            0,
        )

        at_gap = evaluate(polynomial, gap)
        eigenvalue_slope = gap * at_gap * at_gap / sigma_one
        delta_slope = at_gap * at_gap * (gap * sigma_zero - sigma_one)
        geronimus_slope = at_gap * at_gap * (
            F(1) - gap * sigma_zero / sigma_one
        )
        self.assertGreater(eigenvalue_slope, 0)
        self.assertLess(delta_slope, 0)
        self.assertGreater(geronimus_slope, 0)
        self.assertEqual(delta_slope, -sigma_one * geronimus_slope)
        self.assertTrue(all(root > gap for root in roots))

    def test_low_carrier_block_has_q_q3_q5_asymptotics(self) -> None:
        constant_zero = 2.0 * math.sqrt(2.0 / math.pi)
        constant_two = (8.0 / 3.0) * math.sqrt(2.0 / math.pi)
        constant_four = (32.0 / 15.0) * math.sqrt(2.0 / math.pi)
        errors = []
        for size in (20_000, 80_000, 320_000):
            cutoff = int(size**0.3)
            q_value = cutoff / math.sqrt(size)
            low_zero, low_two, low_four = low_block_ratios(size, cutoff)
            ratios = (
                low_zero / (constant_zero * q_value),
                low_two / (constant_two * q_value**3),
                low_four / (constant_four * q_value**5),
            )
            self.assertTrue(all(value > 1.0 for value in ratios))
            errors.append(tuple(value - 1.0 for value in ratios))
        for coordinate in range(3):
            self.assertGreater(errors[0][coordinate], errors[1][coordinate])
            self.assertGreater(errors[1][coordinate], errors[2][coordinate])
        self.assertLess(max(errors[-1]), 0.06)

    def test_critical_scaling_drives_all_no_escape_statistics_to_zero(self) -> None:
        density = 0.2
        gamma_one = 14.0
        rows = []
        for length in (12.0, 16.0, 20.0):
            size = density * math.exp(length) * length
            q_value = (
                gamma_one
                / (2.0 * math.pi * math.sqrt(density))
                * math.sqrt(length)
                * math.exp(-length / 2.0)
            )
            carrier_mean = math.pi**2 * density * math.exp(length) / length
            scaled_j_one = length * length * (4.0 * size - 1.0) / size**2
            scaled_j_two = (
                length**4
                * (4.0 * size - 1.0)
                * (4.0 * size - 3.0)
                / (size**3 * (3.0 * size - 2.0))
            )
            rows.append((q_value, carrier_mean, scaled_j_one, scaled_j_two))
        self.assertTrue(all(row[1] > gamma_one**2 for row in rows))
        for coordinate in (0, 2, 3):
            values = [row[coordinate] for row in rows]
            self.assertEqual(values, sorted(values, reverse=True))
        means = [row[1] for row in rows]
        self.assertEqual(means, sorted(means))
        self.assertLess(rows[-1][2], 1e-6)
        self.assertLess(rows[-1][3], 1e-12)

    def test_count_scope_quadrature_and_nonclaims(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            "positive simple generalized odd ground",
            "Riemann--von Mangoldt main count with `O(1)` error",
            "every Gaussian node and every Sturm root",
            "The support and count do not determine the moment weights",
            "not the zeta divisor",
            "free positive moment weights",
            "No carrier pole has been discarded",
            "changes none of the standard eight",
            "actual arithmetic mixed cofactor",
            "P0_INVALIDATED",
            r"\Delta_N(\epsilon)<0",
            r"{4N-1\over N^2}",
            r"{(4N-1)(4N-3)\over N^3(3N-2)}",
            r"{8\over3}\sqrt{{2\over\pi}}q_L^3",
            r"{32\over15}\sqrt{{2\over\pi}}q_L^5",
        )
        for token in required:
            self.assertIn(token, normalized)

        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the actual zeta ground has Delta_N<0",
            "the constructed weights are the zeta weights",
            "all finite gates are closed",
            "determinant convergence is proved",
            "the first-zero gap proves the mixed sign",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 55)
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
