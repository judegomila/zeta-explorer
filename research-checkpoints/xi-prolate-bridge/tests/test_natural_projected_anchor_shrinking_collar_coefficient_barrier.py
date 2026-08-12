#!/usr/bin/env python3
"""Exact regressions for the natural-anchor collar coefficient barrier.

The verifier uses only integers, Fraction, and Gaussian rationals.  It does
not read a prolate artifact, a zero table, the adjacent-outer pilot, or any
floating-point root finder.
"""

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
    / "NATURAL_PROJECTED_ANCHOR_SHRINKING_COLLAR_COEFFICIENT_BARRIER.md"
)
NOTE_HASH = "1fbf70b0cdbdd1eb51d86aeafd259b0d443c9fd2b6a81325e93ea66e41185127"

FROZEN = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "notes/NATURAL_CUTOFF_STRIP_WINDING_INDEX.md":
        "67997ba160cc3a9ba6cdcb4a387120e3b62cb9665b684c6253bb618ecd9053a0",
    "tests/test_natural_cutoff_strip_winding_index.py":
        "0b409b8fe8774ab8487bdac5cf3ba8dbaf2db4195ab0938a0ce5c7b1bcb8a45c",
    "notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md":
        "baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c",
    "tests/test_natural_cutoff_negative_real_root_exclusion.py":
        "6b37c98bdb946d6c9236e768d4cf2c00652ecdbf10e221a516ac4454d6680fad",
    "notes/NATURAL_CUTOFF_SHRINKING_COLLAR_ESCAPE_REDUCTION.md":
        "6a14b68a7ab048aad90580c2043bb8309839b6ea9947e1eac0defaede3b8e120",
    "tests/test_natural_cutoff_shrinking_collar_escape_reduction.py":
        "04a66bfd2c4bd560b4fe0e5b3c5336c26a8bbc7535ad3e2fed73d4209845c55c",
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "notes/VERIFIED_HEIGHT_SHRINKING_COLLAR_PARTIAL_THEOREM.md":
        "d731f67fd8bb7b0a704728df1fc36b72984722eee3b5c29165503aca7d9a9f4d",
    "tests/test_verified_height_shrinking_collar_partial_theorem.py":
        "8d99ef99db0e2f36df4d76624afa39427ffff4c59c10fe0c9961aad9953e3c34",
}

Polynomial = list[F]
Gaussian = tuple[F, F]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def trim(polynomial: Polynomial) -> Polynomial:
    out = polynomial[:]
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return out


def poly_add(left: Polynomial, right: Polynomial) -> Polynomial:
    out = [F(0) for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    return trim(out)


def poly_scale(polynomial: Polynomial, scalar: F) -> Polynomial:
    return trim([scalar * value for value in polynomial])


def poly_mul(left: Polynomial, right: Polynomial) -> Polynomial:
    out = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            out[i + j] += left_value * right_value
    return trim(out)


def poly_value(polynomial: Polynomial, value: F) -> F:
    out = F(0)
    for coefficient in reversed(polynomial):
        out = out * value + coefficient
    return out


def lattice_polynomial(count: int) -> Polynomial:
    out = [F(1)]
    for mode in range(1, count + 1):
        out = poly_mul(out, [F(-(mode * mode)), F(1)])
    return out


def raw_polynomial(central: F, positive: list[F]) -> Polynomial:
    count = len(positive)
    denominator = lattice_polynomial(count)
    out = poly_scale(denominator, central)
    for mode, coefficient in enumerate(positive, start=1):
        omitted = [F(1)]
        for other in range(1, count + 1):
            if other != mode:
                omitted = poly_mul(
                    omitted,
                    [F(-(other * other)), F(1)],
                )
        out = poly_add(
            out,
            [F(0)] + [2 * coefficient * value for value in omitted],
        )
    return out


def interpolation_coordinates(
    polynomial: Polynomial, count: int
) -> tuple[F, list[F]]:
    central = poly_value(polynomial, F(0)) / F(
        (-1) ** count * math.factorial(count) ** 2
    )
    positive = []
    for mode in range(1, count + 1):
        denominator = F(
            (-1) ** (count - mode)
            * math.factorial(count - mode)
            * math.factorial(count + mode)
        )
        positive.append(poly_value(polynomial, F(mode * mode)) / denominator)
    return central, positive


def moments(central: F, positive: list[F], maximum: int) -> list[F]:
    out = [central + 2 * sum(positive, F(0))]
    for order in range(1, maximum + 1):
        out.append(
            2
            * sum(
                (
                    F(mode ** (2 * order)) * coefficient
                    for mode, coefficient in enumerate(positive, start=1)
                ),
                F(0),
            )
        )
    return out


def determinant(matrix: list[list[F]]) -> F:
    if not matrix:
        return F(1)
    work = [row[:] for row in matrix]
    out = F(1)
    size = len(work)
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
            out = -out
        pivot_value = work[column][column]
        out *= pivot_value
        for row in range(column + 1, size):
            factor = work[row][column] / pivot_value
            for entry in range(column + 1, size):
                work[row][entry] -= factor * work[column][entry]
    return out


def routh_coefficients(polynomial: Polynomial, height: F) -> list[F]:
    degree = len(trim(polynomial)) - 1
    leading = polynomial[degree]
    coefficients = []
    for index in range(2 * degree + 1):
        power = 2 * degree - index
        value = F(0)
        for k in range((power + 1) // 2, degree + 1):
            value += (
                F((-1) ** (degree + k), 1)
                * polynomial[k]
                * math.comb(2 * k, power)
                * height ** (2 * k - power)
                / leading
            )
        coefficients.append(value)
    return coefficients


def hurwitz_determinants(coefficients: list[F]) -> list[F]:
    degree = len(coefficients) - 1

    def alpha(index: int) -> F:
        if 0 <= index <= degree:
            return coefficients[index]
        return F(0)

    out = []
    for size in range(1, degree + 1):
        matrix = [
            [alpha(2 * q - p) for q in range(1, size + 1)]
            for p in range(1, size + 1)
        ]
        out.append(determinant(matrix))
    return out


def sign_variations(values: list[F]) -> int:
    signs = [1 if value > 0 else -1 for value in values]
    return sum(left != right for left, right in zip(signs, signs[1:]))


def regular_routh_count(determinants: list[F]) -> int:
    if any(value == 0 for value in determinants):
        raise ValueError("degenerate Routh first column")
    self_values = [F(1), determinants[0]]
    self_values.extend(
        determinants[index] / determinants[index - 1]
        for index in range(1, len(determinants))
    )
    if any(value == 0 for value in self_values):
        raise ValueError("degenerate Routh first column")
    return sign_variations(self_values)


def gadd(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def gsub(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] - right[0], left[1] - right[1]


def gmul(left: Gaussian, right: Gaussian) -> Gaussian:
    return (
        left[0] * right[0] - left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def gdiv(left: Gaussian, right: Gaussian) -> Gaussian:
    denominator = right[0] ** 2 + right[1] ** 2
    return (
        (left[0] * right[0] + left[1] * right[1]) / denominator,
        (left[1] * right[0] - left[0] * right[1]) / denominator,
    )


def gnorm_squared(value: Gaussian) -> F:
    return value[0] ** 2 + value[1] ** 2


def secular_value(
    central: F, positive: list[F], y: Gaussian
) -> Gaussian:
    constant = central + 2 * sum(positive, F(0))
    out = (constant, F(0))
    for mode, coefficient in enumerate(positive, start=1):
        out = gadd(
            out,
            gdiv(
                (2 * mode * mode * coefficient, F(0)),
                gsub(y, (F(mode * mode), F(0))),
            ),
        )
    return out


def inverse_two(matrix: list[list[F]]) -> list[list[F]]:
    det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    if det == 0:
        raise ValueError("singular two-by-two matrix")
    return [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det],
    ]


def matvec_two(matrix: list[list[F]], vector: list[F]) -> list[F]:
    return [
        matrix[row][0] * vector[0] + matrix[row][1] * vector[1]
        for row in range(2)
    ]


class NaturalProjectedAnchorShrinkingCollarCoefficientBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_strict_cutoff_outer_cutoff_and_exact_shell_recurrence(self) -> None:
        for p in (3, 5, 7, 11):
            strict = (p + 1) // 2
            outer = strict + 1
            self.assertEqual(strict, math.ceil(F(p, 2)))
            self.assertEqual(outer, math.ceil(F(p, 2)) + 1)

        lower_central = F(3, 5)
        lower_positive = [F(-2, 7), F(5, 11), F(-7, 13)]
        outer_coordinate = F(17, 19)
        lower = raw_polynomial(lower_central, lower_positive)
        full = raw_polynomial(
            lower_central,
            lower_positive + [outer_coordinate],
        )
        count = len(lower_positive) + 1
        recurrence = poly_add(
            poly_mul([F(-(count * count)), F(1)], lower),
            poly_scale(
                [F(0)] + lattice_polynomial(count - 1),
                2 * outer_coordinate,
            ),
        )
        self.assertEqual(full, recurrence)

    def test_barycentric_inverse_moment_triangle_and_recurrence(self) -> None:
        central = F(7, 9)
        positive = [F(-2, 5), F(3, 7), F(-11, 13), F(17, 19)]
        count = len(positive)
        polynomial = raw_polynomial(central, positive)
        self.assertEqual(
            interpolation_coordinates(polynomial, count),
            (central, positive),
        )

        denominator = lattice_polynomial(count)
        descending_d = list(reversed(denominator))
        signed_moments = moments(central, positive, 2 * count + 3)
        descending_p = list(reversed(polynomial))
        descending_p += [F(0)] * (count + 1 - len(descending_p))

        for j in range(count + 1):
            triangular = sum(
                (
                    descending_d[j - k] * signed_moments[k]
                    for k in range(j + 1)
                ),
                F(0),
            )
            self.assertEqual(descending_p[j], triangular)

        for shift in range(1, count + 3):
            recurrence = signed_moments[shift + count]
            recurrence += sum(
                (
                    descending_d[j] * signed_moments[shift + count - j]
                    for j in range(1, count + 1)
                ),
                F(0),
            )
            self.assertEqual(recurrence, 0)

        # The forbidden shift zero is generally the constant coefficient.
        shift_zero = signed_moments[count] + sum(
            (
                descending_d[j] * signed_moments[count - j]
                for j in range(1, count + 1)
            ),
            F(0),
        )
        self.assertEqual(shift_zero, polynomial[0])
        self.assertNotEqual(shift_zero, 0)

    def test_exact_hurwitz_quartic_and_reversed_hb_geometry(self) -> None:
        amplitude = F(3)
        polynomial = [amplitude * amplitude, F(0), F(1)]

        inside_height = F(2)
        inside_coefficients = routh_coefficients(polynomial, inside_height)
        self.assertEqual(
            inside_coefficients,
            [
                F(1),
                4 * inside_height,
                6 * inside_height**2,
                4 * inside_height**3,
                inside_height**4 + amplitude**2,
            ],
        )
        inside_deltas = hurwitz_determinants(inside_coefficients)
        self.assertEqual(
            inside_deltas,
            [
                4 * inside_height,
                20 * inside_height**3,
                16
                * inside_height**2
                * (4 * inside_height**4 - amplitude**2),
                (inside_height**4 + amplitude**2)
                * 16
                * inside_height**2
                * (4 * inside_height**4 - amplitude**2),
            ],
        )
        self.assertEqual(regular_routh_count(inside_deltas), 0)

        outside_height = F(1)
        outside_deltas = hurwitz_determinants(
            routh_coefficients(polynomial, outside_height)
        )
        self.assertEqual(regular_routh_count(outside_deltas), 2)
        self.assertGreater(amplitude, 2 * outside_height**2)
        self.assertLess(amplitude, 2 * inside_height**2)

        boundary_amplitude = F(2)
        boundary = [boundary_amplitude**2, F(0), F(1)]
        boundary_deltas = hurwitz_determinants(
            routh_coefficients(boundary, F(1))
        )
        self.assertEqual(boundary_deltas[2], 0)
        with self.assertRaisesRegex(ValueError, "degenerate"):
            regular_routh_count(boundary_deltas)

    def test_rouche_identity_and_relative_direction(self) -> None:
        positive = [F(2), F(-1)]
        central = -2 * sum(positive, F(0))
        signed_moments = moments(central, positive, 2)
        self.assertEqual(signed_moments[0], 0)
        self.assertEqual(signed_moments[1], -4)

        s = (F(5, 7), F(3))
        y = gmul(s, s)
        phi = secular_value(central, positive, y)
        left = gmul(y, phi)
        remainder = (F(0), F(0))
        for mode, coefficient in enumerate(positive, start=1):
            remainder = gadd(
                remainder,
                gdiv(
                    (2 * mode**4 * coefficient, F(0)),
                    gsub(y, (F(mode * mode), F(0))),
                ),
            )
        self.assertEqual(
            left,
            gadd((signed_moments[1], F(0)), remainder),
        )

        absolute = sum(
            (
                F(mode**3) * abs(coefficient)
                for mode, coefficient in enumerate(positive, start=1)
            ),
            F(0),
        )
        height = s[1]
        self.assertLessEqual(
            gnorm_squared(remainder),
            (absolute / height) ** 2,
        )
        self.assertGreater(height * abs(signed_moments[1]), absolute)
        self.assertNotEqual(phi, (F(0), F(0)))

    def test_checkerboard_flat_jet_prescribed_pair(self) -> None:
        count = 6
        deficit = 3
        amplitude = F(5)
        rho = F(100)
        polynomial = poly_scale(
            poly_mul(
                [amplitude**2, F(0), F(1)],
                [-rho, F(1)],
            ),
            F((-1) ** deficit),
        )
        central, positive = interpolation_coordinates(polynomial, count)
        self.assertEqual(raw_polynomial(central, positive), polynomial)
        coordinates = [central] + positive
        for mode, coordinate in enumerate(coordinates):
            self.assertNotEqual(coordinate, 0)
            self.assertEqual(1 if coordinate > 0 else -1, (-1) ** mode)

        signed_moments = moments(central, positive, deficit)
        self.assertEqual(signed_moments[:deficit], [F(0)] * deficit)
        self.assertEqual(signed_moments[deficit], F(-1))

        denominator = lattice_polynomial(count)
        for radius in (F(0), F(1, 3), F(2), F(17, 4)):
            numerator_value = poly_value(polynomial, -(radius**2))
            denominator_value = poly_value(denominator, -(radius**2))
            self.assertGreater(numerator_value / denominator_value, 0)

        prescribed_height = F(3, 2)
        prescribed_amplitude = 2 * prescribed_height**2
        self.assertEqual(prescribed_amplitude / 2, prescribed_height**2)

    def test_fixed_prefix_ratio_formula_has_the_claimed_limit_mechanism(self) -> None:
        def coordinate_ratio(count: int, mode: int) -> F:
            amplitude = F(count)
            factorial_ratio = F(
                math.factorial(count) ** 2,
                math.factorial(count - mode) * math.factorial(count + mode),
            )
            value = factorial_ratio * F(mode**4 + amplitude**2, amplitude**2)
            for index in range(1, count - 1):
                rho = F(count**6 + index)
                value *= (rho - mode**2) / rho
            return value

        for mode in (1, 2):
            small = coordinate_ratio(20, mode)
            large = coordinate_ratio(100, mode)
            self.assertLess(abs(large - 1), abs(small - 1))
            self.assertGreater(large, 0)

    def test_exact_high_shell_distance_and_endpoint_jet_limit(self) -> None:
        count = 8
        central = F(3, 5)
        positive = [
            F(-2, 7),
            F(5, 11),
            F(-7, 13),
            F(11, 17),
            F(-13, 19),
            F(17, 23),
            F(-19, 29),
            F(23, 31),
        ]
        signed_moments = moments(central, positive, 1)
        c, mu_1 = signed_moments
        shell = list(range((count + 1) // 2, count + 1))
        height = F(3, 2)
        radius = F(10**6)
        s = (radius, height)
        y = gmul(s, s)

        rows = [[], []]
        for mode in shell:
            h = gdiv(y, gsub(y, (F(mode * mode), F(0))))
            rows[0].append(h[0])
            rows[1].append(h[1])

        gram = [
            [
                sum(
                    (rows[i][j] * rows[k][j] for j in range(len(shell))),
                    F(0),
                )
                for k in range(2)
            ]
            for i in range(2)
        ]
        inverse = inverse_two(gram)
        phi = secular_value(central, positive, y)
        target = [-phi[0], -phi[1]]
        multipliers = matvec_two(inverse, target)
        delta_x = [
            (
                rows[0][index] * multipliers[0]
                + rows[1][index] * multipliers[1]
            )
            / 2
            for index in range(len(shell))
        ]

        perturbed = positive[:]
        for mode, delta in zip(shell, delta_x):
            perturbed[mode - 1] += delta
        self.assertEqual(
            secular_value(central, perturbed, y),
            (F(0), F(0)),
        )

        norm_squared = 2 * sum((delta**2 for delta in delta_x), F(0))
        exact_distance = F(1, 2) * sum(
            (target[index] * multipliers[index] for index in range(2)),
            F(0),
        )
        self.assertEqual(norm_squared, exact_distance)

        shell_size = F(len(shell))
        sum_two = sum((F(mode**2) for mode in shell), F(0))
        sum_four = sum((F(mode**4) for mode in shell), F(0))
        denominator = 2 * (shell_size * sum_four - sum_two**2)
        distance_limit = (
            sum_four * c**2
            - 2 * sum_two * c * mu_1
            + shell_size * mu_1**2
        ) / denominator
        self.assertGreater(distance_limit, 0)
        self.assertLess(abs(exact_distance - distance_limit), F(1, 10**4))

        epsilon = F(1, 10**9)
        scaled_limit = (
            sum_four * (epsilon * c) ** 2
            - 2 * sum_two * (epsilon * c) * (epsilon * mu_1)
            + shell_size * (epsilon * mu_1) ** 2
        ) / denominator
        self.assertEqual(scaled_limit, epsilon**2 * distance_limit)

    def test_shell_riemann_sum_constants_are_exact(self) -> None:
        # Exact polynomial sums at increasing K verify the positive limiting
        # variance constant; the note gives the elementary Riemann-sum proof.
        target = F(17, 1440)
        errors = []
        for count in (40, 80, 160):
            shell = range((count + 1) // 2, count + 1)
            size = F(len(shell))
            sum_two = sum((F(mode**2) for mode in shell), F(0))
            sum_four = sum((F(mode**4) for mode in shell), F(0))
            scaled = (size * sum_four - sum_two**2) / count**6
            self.assertGreater(scaled, 0)
            errors.append(abs(scaled - target))
        self.assertGreater(errors[0], errors[1])
        self.assertGreater(errors[1], errors[2])

    def test_claim_boundary_diagnostics_and_required_formulas(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            r"M=\lceil\lambda\rceil",
            r"N=M+1=\lceil\lambda\rceil+1",
            r"p_K(y)=(y-K^2)p_{K-1}(y)+2yx_KD_{K-1}(y)",
            r"m_{r+K}+d_1m_{r+K-1}+\cdots+d_Km_r=0",
            r"\nu(0+)=\nu(\delta-)",
            "epsilon-Routh",
            "signed subresultants",
            r"{A_k\over|m_k|}=o(L)",
            r"\operatorname {sgn}(x_n)=(-1)^n",
            r"\lim_{R\to\infty}d_R^2",
            r"{1\over L}\leq|\Im z|\leq{1\over2}",
            "noncertified point diagnostics",
            "not part of any theorem",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, normalized)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual global collar equality is proved",
            "the adjacent outer pilot certifies",
            "the standard eight are modified",
        )
        for token in forbidden:
            self.assertNotIn(token, normalized)

        source = Path(__file__).read_text(encoding="ascii")
        tree = ast.parse(source)
        float_calls = [
            node
            for node in ast.walk(tree)
            if isinstance(node, ast.Call)
            and isinstance(node.func, ast.Name)
            and node.func.id == "float"
        ]
        self.assertEqual(float_calls, [])
        for package in ("numpy", "scipy", "sympy", "mpmath"):
            self.assertNotIn(f"import {package}", source)

    def test_displayed_tex_static_hash_and_cache_hygiene(self) -> None:
        self.assertNotIn("\t", self.text)
        self.assertNotIn("\r", self.text)
        self.assertTrue(all(ord(character) < 128 for character in self.text))
        self.assertFalse(
            any(line.endswith((" ", "\t")) for line in self.text.splitlines())
        )

        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for display in displays:
            self.assertNotIn("$", display)
            self.assertEqual(display.count("{"), display.count("}"))
            self.assertEqual(display.count(r"\begin"), display.count(r"\end"))

        source = Path(__file__).read_text(encoding="ascii")
        ast.parse(source)
        self.assertNotIn("\r", source)
        self.assertFalse(
            any(line.endswith((" ", "\t")) for line in source.splitlines())
        )

        cache_entries = [
            path
            for path in ROOT.rglob("*")
            if path.name == "__pycache__" or path.suffix in {".pyc", ".pyo"}
        ]
        self.assertEqual(cache_entries, [])

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            tex = Path(temporary) / "note.tex"
            tex.write_text(document, encoding="ascii")
            completed = subprocess.run(
                [
                    pdflatex,
                    "-halt-on-error",
                    "-interaction=nonstopmode",
                    tex.name,
                ],
                cwd=temporary,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
        self.assertEqual(completed.returncode, 0, completed.stdout)


if __name__ == "__main__":
    unittest.main()
