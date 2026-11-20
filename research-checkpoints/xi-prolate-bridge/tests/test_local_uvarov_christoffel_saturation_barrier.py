#!/usr/bin/env python3
"""Exact regressions for the local multi-Uvarov saturation barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import itertools
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "LOCAL_UVAROV_CHRISTOFFEL_SATURATION_BARRIER.md"
NOTE_HASH = "c7a0e912e1c93386116afe4e686b8b56c56bcfd2bb7adda1c3700fd3102af89d"

FROZEN = {
    "notes/RH_ZERO_GAUSSIAN_SQUARE_FREE_LIMIT_THEOREM.md":
        "6622d6ee81f08daef596850ecd4dfbb071c5a2a087e083ee5f68a5bc1b211742",
    "tests/test_rh_zero_gaussian_square_free_limit_theorem.py":
        "680c2ad7ebef01683b218d4f2e4693047d01a0452346fe89b8277f7bd31c84fb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def permutation_sign(permutation: tuple[int, ...]) -> int:
    inversions = sum(
        permutation[i] > permutation[j]
        for i in range(len(permutation))
        for j in range(i + 1, len(permutation))
    )
    return -1 if inversions % 2 else 1


def determinant(matrix: list[list[F]]) -> F:
    size = len(matrix)
    total = F(0)
    for permutation in itertools.permutations(range(size)):
        term = F(permutation_sign(permutation))
        for row, column in enumerate(permutation):
            term *= matrix[row][column]
        total += term
    return total


def inverse(matrix: list[list[F]]) -> list[list[F]]:
    size = len(matrix)
    work = [
        row[:] + [F(int(i == j)) for j in range(size)]
        for i, row in enumerate(matrix)
    ]
    for column in range(size):
        pivot = next(row for row in range(column, size) if work[row][column])
        work[column], work[pivot] = work[pivot], work[column]
        scale = work[column][column]
        work[column] = [value / scale for value in work[column]]
        for row in range(size):
            if row == column:
                continue
            factor = work[row][column]
            work[row] = [
                value - factor * pivot_value
                for value, pivot_value in zip(work[row], work[column])
            ]
    return [row[size:] for row in work]


def matrix_multiply(left: list[list[F]], right: list[list[F]]) -> list[list[F]]:
    return [
        [
            sum((left[i][k] * right[k][j] for k in range(len(right))), F(0))
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


def matrix_vector(matrix: list[list[F]], vector: list[F]) -> list[F]:
    return [
        sum((value * other for value, other in zip(row, vector)), F(0))
        for row in matrix
    ]


def moments(support: list[F], weights: list[F], count: int) -> list[F]:
    return [
        sum(
            (weight * point**degree for point, weight in zip(support, weights)),
            F(0),
        )
        for degree in range(count)
    ]


def moment_pair(
    support: list[F], weights: list[F], size: int
) -> tuple[list[list[F]], list[list[F]]]:
    data = moments(support, weights, 2 * size)
    gram = [[data[i + j] for j in range(size)] for i in range(size)]
    local = [[data[i + j + 1] for j in range(size)] for i in range(size)]
    return gram, local


def kernel(moment_inverse: list[list[F]], left: F, right: F) -> F:
    left_vector = [F(1), left]
    right_vector = [F(1), right]
    return sum(
        (
            left_vector[i] * moment_inverse[i][j] * right_vector[j]
            for i in range(2)
            for j in range(2)
        ),
        F(0),
    )


def polynomial_value(coefficients: list[F], value: F) -> F:
    result = F(0)
    for coefficient in reversed(coefficients):
        result = result * value + coefficient
    return result


# Elements a+b*sqrt(D), represented by (a,b).
def qadd(left: tuple[F, F], right: tuple[F, F]) -> tuple[F, F]:
    return (left[0] + right[0], left[1] + right[1])


def qmul(
    left: tuple[F, F], right: tuple[F, F], radicand: F
) -> tuple[F, F]:
    return (
        left[0] * right[0] + left[1] * right[1] * radicand,
        left[0] * right[1] + left[1] * right[0],
    )


class LocalUvarovChristoffelSaturationBarrierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

        cls.x = F(1)
        cls.t = F(5, 4)
        cls.remote = F(9)
        cls.shift = F(1, 100)
        cls.beta = F(1, 10**6)
        cls.rho_support = [cls.x, cls.t]
        cls.rho_weights = [F(1), cls.beta]
        cls.zero_support = [cls.x, cls.t, cls.remote]
        cls.zero_weights = [F(101, 100), cls.beta, cls.shift]
        cls.zero_moments = moments(cls.zero_support, cls.zero_weights, 4)

        m0, m1, m2, m3 = cls.zero_moments
        moment_determinant = m0 * m2 - m1 * m1
        cls.sum_roots = (m0 * m3 - m1 * m2) / moment_determinant
        cls.product_roots = (m1 * m3 - m2 * m2) / moment_determinant
        cls.discriminant = cls.sum_roots**2 - 4 * cls.product_roots

    def test_frozen_dependencies_and_draft_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_rational_fixture_and_node_windows(self) -> None:
        self.assertEqual(
            self.zero_moments,
            [
                F(1020001, 1000000),
                F(880001, 800000),
                F(1164801, 640000),
                F(4249601, 512000),
            ],
        )
        self.assertEqual(self.sum_roots, F(20684820155, 2068482124))
        self.assertEqual(self.product_roots, F(18616341875, 2068482124))
        self.assertEqual(
            self.discriminant,
            F(273831503313853654025, 4278618297307551376),
        )

        polynomial = [self.product_roots, -self.sum_roots, F(1)]
        self.assertEqual(polynomial_value(polynomial, F(1)), F(961, 517120531))
        self.assertEqual(
            polynomial_value(polynomial, F(13, 10)),
            F(-238909476847, 103424106200),
        )
        self.assertEqual(
            polynomial_value(polynomial, F(8)),
            F(-14479363429, 2068482124),
        )
        self.assertEqual(
            polynomial_value(polynomial, F(10)),
            F(18616352725, 2068482124),
        )

        shifted_polynomial = [F(5, 4), F(-9, 4), F(1)]
        self.assertEqual(polynomial_value(shifted_polynomial, F(1)), 0)
        self.assertEqual(polynomial_value(shifted_polynomial, F(5, 4)), 0)

    def test_both_shifted_grams_are_strictly_positive(self) -> None:
        shifted_moment, shifted_local = moment_pair(
            self.rho_support, self.rho_weights, 2
        )
        zero_moment, zero_local = moment_pair(
            self.zero_support, self.zero_weights, 2
        )
        self.assertEqual(determinant(shifted_moment), F(1, 16000000))
        self.assertEqual(determinant(shifted_local), F(1, 12800000))
        self.assertEqual(determinant(zero_moment), F(517120531, 800000000))
        self.assertEqual(determinant(zero_local), F(29786147, 5120000))
        for matrix in (shifted_moment, shifted_local, zero_moment, zero_local):
            self.assertGreater(matrix[0][0], 0)
            self.assertGreater(determinant(matrix), 0)

    def test_exact_uvarov_polynomial_orientation(self) -> None:
        zero_moment, _ = moment_pair(self.zero_support, self.zero_weights, 2)
        inverse_zero = inverse(zero_moment)
        sites = [self.x, self.remote]
        kernel_sites = [
            [kernel(inverse_zero, left, right) for right in sites]
            for left in sites
        ]
        identity_minus_kc = [
            [F(int(i == j)) - kernel_sites[i][j] * self.shift for j in range(2)]
            for i in range(2)
        ]
        zero_polynomial = [self.product_roots, -self.sum_roots, F(1)]
        zero_values = [polynomial_value(zero_polynomial, site) for site in sites]
        shifted_values = matrix_vector(inverse(identity_minus_kc), zero_values)

        expected = [F(5, 4), F(-9, 4), F(1)]
        for value in (F(0), F(2), F(3)):
            correction = sum(
                (
                    kernel(inverse_zero, value, sites[i])
                    * self.shift
                    * shifted_values[i]
                    for i in range(2)
                ),
                F(0),
            )
            self.assertEqual(
                polynomial_value(zero_polynomial, value) + correction,
                polynomial_value(expected, value),
            )
        self.assertEqual(
            shifted_values,
            [polynomial_value(expected, site) for site in sites],
        )

    def test_exact_woodbury_kernel_orientation(self) -> None:
        zero_moment, _ = moment_pair(self.zero_support, self.zero_weights, 2)
        shifted_moment, _ = moment_pair(self.rho_support, self.rho_weights, 2)
        inverse_zero = inverse(zero_moment)
        inverse_shifted = inverse(shifted_moment)
        sites = [self.x, self.remote]
        kernel_sites = [
            [kernel(inverse_zero, left, right) for right in sites]
            for left in sites
        ]
        c_inverse_minus_kernel = [
            [
                F(100) * F(int(i == j)) - kernel_sites[i][j]
                for j in range(2)
            ]
            for i in range(2)
        ]
        resolvent = inverse(c_inverse_minus_kernel)

        for left, right in ((F(0), F(2)), (F(3), F(7)), (F(1, 2), F(5))):
            left_row = [kernel(inverse_zero, left, site) for site in sites]
            right_column = [kernel(inverse_zero, site, right) for site in sites]
            correction = sum(
                (
                    left_row[i] * resolvent[i][j] * right_column[j]
                    for i in range(2)
                    for j in range(2)
                ),
                F(0),
            )
            self.assertEqual(
                kernel(inverse_shifted, left, right),
                kernel(inverse_zero, left, right) + correction,
            )

    def test_exact_quadratic_field_christoffel_saturation(self) -> None:
        zero_moment, _ = moment_pair(self.zero_support, self.zero_weights, 2)
        inverse_zero = inverse(zero_moment)
        m0, m1, _, _ = self.zero_moments
        root = (self.sum_roots / 2, F(-1, 2))
        coefficient = m0 * self.sum_roots / 2 - m1
        alpha = (m0 / 2, coefficient / self.discriminant)

        root_squared = qmul(root, root, self.discriminant)
        christoffel_kernel = qadd(
            (inverse_zero[0][0], F(0)),
            qadd(
                (2 * inverse_zero[0][1] * root[0],
                 2 * inverse_zero[0][1] * root[1]),
                (inverse_zero[1][1] * root_squared[0],
                 inverse_zero[1][1] * root_squared[1]),
            ),
        )
        self.assertEqual(
            qmul(alpha, christoffel_kernel, self.discriminant),
            (F(1), F(0)),
        )

    def test_all_site_cardinal_direction_and_reserve_collapse(self) -> None:
        sites = [F(1), F(4), F(9)]
        t = F(5, 4)
        beta = F(1, 1000)
        lattice_weights = [F(1, 10), F(1, 20), F(1, 30)]
        rho_support = [sites[0], t, sites[1]]
        rho_weights = [F(2), beta, F(3)]
        zero_support = [sites[0], t, sites[1], sites[2]]
        zero_weights = [
            rho_weights[0] + lattice_weights[0],
            beta,
            rho_weights[2] + lattice_weights[1],
            lattice_weights[2],
        ]

        rho_moments = moments(rho_support, rho_weights, 6)
        zero_moments = moments(zero_support, zero_weights, 6)
        lattice_moments = moments(sites, lattice_weights, 6)
        self.assertEqual(
            [zero - lattice for zero, lattice in zip(zero_moments, lattice_moments)],
            rho_moments,
        )

        for support, weights in (
            (rho_support, rho_weights),
            (zero_support, zero_weights),
        ):
            gram, local = moment_pair(support, weights, 3)
            for matrix in (gram, local):
                for size in range(1, 4):
                    principal = [row[:size] for row in matrix[:size]]
                    self.assertGreater(determinant(principal), 0)

        denominator = (t - sites[0]) * (t - sites[1])

        def cardinal(value: F) -> F:
            return (value - sites[0]) * (value - sites[1]) / denominator

        self.assertEqual(cardinal(t), 1)
        self.assertEqual(cardinal(sites[0]), 0)
        self.assertEqual(cardinal(sites[1]), 0)
        self.assertEqual(cardinal(sites[2]), F(-640, 11))

        q_remote = cardinal(sites[2])
        moment_ratio = beta / (beta + lattice_weights[2] * q_remote**2)
        local_ratio = beta * t / (
            beta * t + lattice_weights[2] * sites[2] * q_remote**2
        )
        self.assertLess(moment_ratio, F(1, 100000))
        self.assertLess(local_ratio, F(1, 100000))

    def test_checkpoint_scaled_nearest_mass_ratio(self) -> None:
        length = F(100)
        multiplicity = F(2)
        mu = F(1, 100)
        lattice_mass = F(1, 123)
        removed = mu * lattice_mass
        residual = (multiplicity * length - mu) * lattice_mass
        unshifted = residual + removed
        self.assertGreater(residual, 0)
        self.assertEqual(unshifted, multiplicity * length * lattice_mass)
        self.assertEqual(removed / unshifted, mu / (multiplicity * length))

    def test_exact_reserve_witnesses_in_fixture(self) -> None:
        q_remote = 4 * (self.remote - 1)
        self.assertEqual(q_remote, 32)
        moment_ratio = self.beta / (
            self.beta + self.shift * q_remote**2
        )
        local_ratio = self.beta * self.t / (
            self.beta * self.t + self.shift * self.remote * q_remote**2
        )
        self.assertEqual(moment_ratio, F(1, 10240001))
        self.assertEqual(local_ratio, F(1, 73728001))

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 20)
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
            "global inverse",
            "all-lattice-site nonimplication family",
            "exact target saturation",
            "two Gaussian nodes in the same target neighborhood",
            "positive localizing Grams",
            "structural truncated-moment family",
            "not the actual transformed zeta-zero functional",
            "degree at most `2N-1`",
            "checkpoint-1.38 standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "rh is proved",
            "actual shifted-node failure is proved",
            "the structural family is the zeta-zero functional",
            "standard eight are updated",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
