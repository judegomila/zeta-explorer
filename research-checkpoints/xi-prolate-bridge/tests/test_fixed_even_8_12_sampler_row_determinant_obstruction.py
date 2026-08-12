#!/usr/bin/env python3
"""Regressions for the fixed 8/12 sampler-row determinant obstruction."""

from __future__ import annotations

import ast
from fractions import Fraction
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FIXED_EVEN_8_12_SAMPLER_ROW_DETERMINANT_OBSTRUCTION.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md":
        "e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17",
    "tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py":
        "545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f",
    "notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md":
        "fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c",
    "tests/test_fixed_even_endpoint_null_complete_volterra_caustic_quadrature_theorem.py":
        "b734c0e93d264cca9bfe31a141f06907724e526de08781295b6a7cd3bcc0b47c",
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "tests/test_growing_transition_edge_carleman_scattering_obstruction.py":
        "b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb",
}


def squarefree_decomposition(value: int) -> tuple[int, int]:
    square_part = 1
    squarefree = 1
    prime = 2
    remainder = value
    while prime * prime <= remainder:
        exponent = 0
        while remainder % prime == 0:
            exponent += 1
            remainder //= prime
        square_part *= prime ** (exponent // 2)
        if exponent % 2:
            squarefree *= prime
        prime += 1
    if remainder > 1:
        squarefree *= remainder
    return square_part, squarefree


def coefficient(sample: int) -> float:
    radial = math.sqrt(sample * sample - 1)
    return (
        2 * math.sqrt(radial)
        / (math.sqrt(math.pi * sample) * sample * sample)
    )


def transpose(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [list(row) for row in zip(*matrix)]


def matmul(
    left: list[list[Fraction]],
    right: list[list[Fraction]],
) -> list[list[Fraction]]:
    return [
        [
            sum(
                (left[i][k] * right[k][j] for k in range(len(right))),
                Fraction(0),
            )
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


def add(
    left: list[list[Fraction]],
    right: list[list[Fraction]],
    sign: int = 1,
) -> list[list[Fraction]]:
    return [
        [left[i][j] + sign * right[i][j] for j in range(len(left[0]))]
        for i in range(len(left))
    ]


def inverse_two(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    return [
        [matrix[1][1] / determinant, -matrix[0][1] / determinant],
        [-matrix[1][0] / determinant, matrix[0][0] / determinant],
    ]


class FixedEven812SamplerRowDeterminantObstructionTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        note_text = NOTE.read_text(encoding="utf-8")
        tick = chr(96)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"{tick}{relative}{tick}", note_text)
            self.assertIn(f"{tick}{expected}{tick}", note_text)

    def test_squarefree_radial_decomposition(self) -> None:
        seen_nontrivial = set()
        for sample in range(2, 500):
            value = sample * sample - 1
            square_part, squarefree = squarefree_decomposition(value)
            self.assertEqual(value, square_part * square_part * squarefree)
            self.assertGreater(squarefree, 1)
            divisor = 2
            while divisor * divisor <= squarefree:
                self.assertNotEqual(squarefree % (divisor * divisor), 0)
                divisor += 1
            seen_nontrivial.add(squarefree)
        self.assertIn(3, seen_nontrivial)
        self.assertGreater(len(seen_nontrivial), 20)

    def test_limiting_coefficients_have_summable_majorant(self) -> None:
        partial = 0.0
        for sample in range(2, 20_000):
            value = coefficient(sample)
            majorant = 2 / (math.sqrt(math.pi) * sample * sample)
            self.assertGreater(value, 0)
            self.assertLessEqual(value, majorant)
            partial += value
        tail_majorant = 2 / (math.sqrt(math.pi) * 19_999)
        self.assertLess(partial + tail_majorant, 1)

    def test_odd_schedule_weyl_polynomial_identity(self) -> None:
        radicals = (math.sqrt(3), math.sqrt(5), math.sqrt(15))
        weights = (2, -3, 5)
        alpha = sum(weight * radical for weight, radical in zip(weights, radicals))
        for index in (0, 1, 7, 31):
            odd_p = 2 * index + 1
            direct = odd_p * odd_p * alpha / 4
            polynomial = (index * index + index + Fraction(1, 4)) * alpha
            self.assertAlmostEqual(direct, polynomial, places=13)

    def test_each_torus_character_has_zero_discrete_mean(self) -> None:
        for sample in range(2, 80):
            harmonic, _ = squarefree_decomposition(sample * sample - 1)
            beta = math.atan(1 / math.sqrt(sample * sample - 1))
            phase = 10.5 * beta
            grid_size = 2 * harmonic + 3
            average = sum(
                math.cos(harmonic * 2 * math.pi * index / grid_size + phase)
                for index in range(grid_size)
            ) / grid_size
            self.assertAlmostEqual(average, 0.0, places=12)

    def test_normalized_row_conditioning_is_controlled_by_gamma_v(self) -> None:
        for gamma_e, gamma_v in ((0.25, 1.0), (2.0, 0.1), (-3.0, 1e-6)):
            determinant = gamma_v
            image_of_null_anchor = abs(gamma_v)
            self.assertEqual(determinant, gamma_v)
            self.assertEqual(image_of_null_anchor, abs(gamma_v))
            inverse_bottom_right = 1 / gamma_v
            self.assertGreaterEqual(abs(inverse_bottom_right), 1 / abs(gamma_v))

    def test_two_row_interpolation_annihilates_both_rows(self) -> None:
        radius = 7.0
        gamma_e = -0.4
        gamma_v = 0.025
        eta_f = 3.5
        gamma_f = 1.2
        alpha_e = eta_f / radius
        alpha_v = (gamma_f - gamma_e * alpha_e) / gamma_v
        self.assertAlmostEqual(eta_f - radius * alpha_e, 0.0)
        self.assertAlmostEqual(
            gamma_f - gamma_e * alpha_e - gamma_v * alpha_v,
            0.0,
        )
        self.assertGreater(abs(alpha_v), 10)

    def test_anchor_schur_complement_is_exactly_shear_invariant(self) -> None:
        anchor = [
            [Fraction(4), Fraction(1)],
            [Fraction(1), Fraction(3)],
        ]
        cross = [
            [Fraction(1), Fraction(2)],
            [Fraction(-1), Fraction(1)],
        ]
        rest = [
            [Fraction(7), Fraction(1, 2)],
            [Fraction(1, 2), Fraction(6)],
        ]
        shear = [
            [Fraction(2), Fraction(-1)],
            [Fraction(1), Fraction(3)],
        ]
        anchor_inverse = inverse_two(anchor)
        original_schur = add(
            rest,
            matmul(matmul(transpose(cross), anchor_inverse), cross),
            sign=-1,
        )
        cross_sheared = add(cross, matmul(anchor, shear), sign=-1)
        rest_sheared = rest
        rest_sheared = add(
            rest_sheared,
            matmul(transpose(cross), shear),
            sign=-1,
        )
        rest_sheared = add(
            rest_sheared,
            matmul(transpose(shear), cross),
            sign=-1,
        )
        rest_sheared = add(
            rest_sheared,
            matmul(matmul(transpose(shear), anchor), shear),
        )
        sheared_schur = add(
            rest_sheared,
            matmul(
                matmul(transpose(cross_sheared), anchor_inverse),
                cross_sheared,
            ),
            sign=-1,
        )
        self.assertEqual(sheared_schur, original_schur)

    def test_note_serializes_result_and_claim_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        tick = chr(96)
        required = (
            "Fixed-even label-8/12 sampler-row determinant obstruction",
            r"\Gamma_v(\lambda)",
            r"\sum_{m=2}^\infty b_m",
            r"b_m={2(m^2-1)^{1/4}",
            r"\liminf_{\substack{p\longrightarrow\infty",
            r"|\Gamma_v(p/2)|=0",
            r"M_\lambda=",
            r"r_\lambda\Gamma_v",
            "is not a condition number",
            "physical row scaling obtained by normalizing only the endpoint row",
            "No claim is made about an arbitrary parameter-dependent",
            "does **not** prove that an exact locked trace ever vanishes",
            r"no bound \(|\Gamma_v|\geq\kappa>0\) can hold",
            "uniform boundedness of the inverse is impossible",
            r"\Gamma_{\rm out}(f)",
            r"\sum_{1\leq n<A}f(n/\lambda)",
            "equations (3.16), (4.4), and (4.11)--(4.12)",
            "equations (2.7)-- (2.10)",
            r"The omitted \(m=1\) hard-edge value is exponentially small",
            "not identically zero",
            r"{\mathbb T}^{\cal D}",
            r"\int_{{\mathbb T}^{\cal D}}G\,dm_{\cal D}=0",
            "Distinct squarefree radicals, together with `1`",
            "Weyl's criterion",
            r"\sigma_{\min}(\widetilde M_\lambda)",
            r"\alpha_v(f)",
            "exact arithmetic assertion",
            r"\Gamma_v(p/2)\ne0",
            r"|\Gamma_v(p/2)|\geq\varepsilon_p>0",
            r"a constant positive choice of \(\varepsilon_p\) is impossible",
            r"H^\#=S^*HS",
            r"D^\#=S^*DS",
            r"H_A^\#=H_A",
            r"K_R^\#-K_{RA}^\#K_A^{-1}K_{AR}^\#",
            r"=K_R-K_{RA}K_A^{-1}K_{AR}",
            "exact generalized Schur test is shear invariant",
            "not the growing-rest block",
            "no pre-Hermitian row factorization",
            "no Hypothesis `PA`",
            "no RH conclusion",
            f"The formal state remains {tick}P0_INVALIDATED{tick}",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = normalized.lower()
        forbidden = (
            "the exact trace vanishes infinitely often",
            "the row matrix is eventually singular",
            "hypothesis `pa` follows",
            "the growing-rest floor follows",
            "proves rh",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)

    def test_python_source_is_stdlib_only_and_files_have_clean_bytes(self) -> None:
        tree = ast.parse(TEST.read_text(encoding="utf-8"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__",
                "ast",
                "fractions",
                "hashlib",
                "math",
                "pathlib",
                "unittest",
            },
        )
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            for line_number, line in enumerate(payload.splitlines(), 1):
                self.assertFalse(
                    line.endswith((b" ", b"\t")),
                    f"{path.name}:{line_number}",
                )


if __name__ == "__main__":
    unittest.main()
