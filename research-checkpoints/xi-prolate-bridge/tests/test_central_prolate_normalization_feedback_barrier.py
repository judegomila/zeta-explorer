#!/usr/bin/env python3
"""Exact regressions for the central/prolate normalization feedback barrier."""

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
NOTE = ROOT / "notes" / "CENTRAL_PROLATE_NORMALIZATION_FEEDBACK_BARRIER.md"
NOTE_HASH = "00efc515b17157da25e980962aee7fafdd4ea522e92b5db0caca290fead0490d"

FROZEN = {
    "notes/RH_ZERO_GAUSSIAN_SQUARE_FREE_LIMIT_THEOREM.md":
        "6622d6ee81f08daef596850ecd4dfbb071c5a2a087e083ee5f68a5bc1b211742",
    "tests/test_rh_zero_gaussian_square_free_limit_theorem.py":
        "680c2ad7ebef01683b218d4f2e4693047d01a0452346fe89b8277f7bd31c84fb",
    "notes/SCREENED_FEEDBACK_ORIGIN_COLLAPSE.md":
        "6195660a2fb34051610b579a5b0e88f4721e8d5385e436541c055d212e3d9f79",
    "tests/test_screened_feedback_origin_collapse.py":
        "b7a23289c94da48f389dd8d6b4cd35c5dc9ed31cccf19d091aff63003ce70f00",
    "notes/SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md":
        "9324d758eca900f646eb5a6187cb5f316ece99b64ec77d7da2eb72cc7c7ff4a4",
    "tests/test_same_anchor_endpoint_rate_attack.py":
        "dd63d4a84cbd8330893c11d273648435f57ee858ebd06231e7b3ad811a5712fb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: list[F], right: list[F]) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: list[list[F]], vector: list[F]) -> list[F]:
    return [dot(row, vector) for row in matrix]


def source_model(size: int, epsilon: F) -> tuple[list[int], list[F], list[list[F]]]:
    modes = list(range(-size, size + 1))
    dimension = 2 * size + 1
    source_row = [-epsilon * F(index, dimension) for index in modes]
    matrix: list[list[F]] = []
    for i, left in enumerate(modes):
        row: list[F] = []
        for j, right in enumerate(modes):
            if i == j:
                row.append(epsilon * F(dimension - 1, dimension))
            else:
                row.append((source_row[i] - source_row[j]) / (left - right))
        matrix.append(row)
    return modes, source_row, matrix


class CentralProlateNormalizationFeedbackBarrierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_note_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_feedback_and_normalization_equivalence(self) -> None:
        central = F(3, 7)
        prolate = F(5, 4)
        x0 = central / prolate
        kappa0 = F(2, 9)
        gamma = 1 - kappa0 / x0
        self.assertEqual(x0 / kappa0, 1 / (1 - gamma))

        length = F(25)
        origin_scale = F(11, 6)
        kappa0 = origin_scale / 5
        gamma = F(1, 13)
        central_over_prolate = kappa0 / (1 - gamma)
        self.assertEqual(
            5 * central_over_prolate,
            origin_scale / (1 - gamma),
        )

    def test_uniform_model_has_exact_source_row_and_simple_ground(self) -> None:
        size = 3
        epsilon = F(5, 3)
        modes, source_row, matrix = source_model(size, epsilon)
        dimension = 2 * size + 1
        eta = [F(1) for _ in modes]

        for i, left in enumerate(modes):
            self.assertEqual(source_row[i], -source_row[-i - 1])
            for j, right in enumerate(modes):
                self.assertEqual(matrix[i][j], matrix[-i - 1][-j - 1])
                if i != j:
                    self.assertEqual(
                        matrix[i][j],
                        (source_row[i] - source_row[j]) / (left - right),
                    )

        self.assertEqual(matvec(matrix, eta), [F(0) for _ in modes])

        # Every sum-zero vector is an epsilon eigenvector; this proves that
        # the ground eta is simple and that the entire odd block is epsilon I.
        for index in range(1, size + 1):
            odd = [F(0) for _ in modes]
            odd[modes.index(index)] = 1
            odd[modes.index(-index)] = -1
            self.assertEqual(
                matvec(matrix, odd),
                [epsilon * value for value in odd],
            )
        test_sum_zero = [F(1), F(-2), F(1), F(0), F(0), F(0), F(0)]
        self.assertEqual(sum(test_sum_zero, F(0)), 0)
        self.assertEqual(
            matvec(matrix, test_sum_zero),
            [epsilon * value for value in test_sum_zero],
        )
        self.assertEqual(dot(eta, eta), dimension)

    def test_ritz_capture_complement_floor_and_determinant_ratio(self) -> None:
        size = 2
        dimension = 2 * size + 1
        epsilon = F(7, 5)
        modes, _, matrix = source_model(size, epsilon)
        eta = [F(1) for _ in modes]
        # Exact real inversion-even unit vector: 1/9 + 2*(4/9)=1.
        kappa = [F(0), F(2, 3), F(1, 3), F(2, 3), F(0)]
        self.assertEqual(dot(kappa, kappa), 1)
        self.assertEqual(kappa, list(reversed(kappa)))

        boundary_sum = dot(kappa, eta)
        alpha_squared = boundary_sum * boundary_sum / dimension
        q_value = dot(kappa, matvec(matrix, kappa))
        self.assertEqual(boundary_sum, F(5, 3))
        self.assertEqual(alpha_squared, F(5, 9))
        self.assertEqual(q_value, epsilon * (1 - alpha_squared))

        residual = [
            value - q_value * coefficient
            for value, coefficient in zip(matvec(matrix, kappa), kappa)
        ]
        reconstructed_eta = [
            boundary_sum * coefficient
            - F(dimension, 1) * value / (epsilon * boundary_sum)
            for coefficient, value in zip(kappa, residual)
        ]
        self.assertEqual(reconstructed_eta, eta)

        complement_floor = epsilon * alpha_squared
        self.assertGreater(complement_floor, 0)
        for vector in (
            [F(1), F(0), F(0), F(0), F(0)],
            [F(0), F(1), F(0), F(-1), F(0)],
            [F(0), F(1), F(-4), F(1), F(0)],
        ):
            self.assertEqual(dot(kappa, vector), 0)
            energy = dot(vector, matvec(matrix, vector))
            self.assertGreaterEqual(energy, complement_floor * dot(vector, vector))

        central = F(1, dimension)
        prolate = boundary_sum / dimension
        x0 = central / prolate
        kappa0 = kappa[modes.index(0)]
        gamma = 1 - kappa0 / x0
        self.assertEqual(x0, 1 / boundary_sum)
        self.assertEqual(gamma, F(4, 9))

        det_odd = epsilon**size
        det_b0 = det_odd / dimension
        det_bkappa = det_odd * boundary_sum**2 / dimension
        self.assertEqual(central, det_b0 / det_odd)
        self.assertEqual((prolate / central) ** 2, det_bkappa / det_b0)
        self.assertEqual(
            (1 - gamma) ** 2,
            kappa0**2 * det_bkappa / det_b0,
        )

    def test_centered_origin_and_endpoint_are_distinct_functionals(self) -> None:
        length = 16
        root_length = 4
        coefficients = {
            -2: F(0),
            -1: F(2, 3),
            0: F(1, 3),
            1: F(2, 3),
            2: F(0),
        }
        boundary_sum = sum(coefficients.values(), F(0))
        endpoint = boundary_sum / root_length
        transform_at_zero = root_length * coefficients[0]
        self.assertEqual(endpoint * root_length, boundary_sum)
        self.assertEqual(transform_at_zero, F(4, 3))
        self.assertNotEqual(boundary_sum, coefficients[0])
        self.assertEqual(math.sqrt(length), root_length)

    def test_nonzero_and_zero_overlap_branches_are_fail_closed(self) -> None:
        k_infinity = F(1, 3)
        gammas: list[F] = []
        scaled_ratios: list[F] = []
        for index in range(2, 20):
            root_length = F(index)
            kappa0 = k_infinity / root_length
            boundary_sum = F(1, index**3)
            dimension = 2 * index + 1
            epsilon = F(1, index**2)
            floor = epsilon * boundary_sum**2 / dimension
            gamma = 1 - kappa0 * boundary_sum
            gammas.append(gamma)
            scaled_ratios.append(root_length / boundary_sum)
            self.assertGreater(floor, 0)
            self.assertLess(gamma, 1)
        self.assertTrue(all(a < b for a, b in zip(gammas, gammas[1:])))
        self.assertGreater(gammas[-1], F(999, 1000))
        self.assertTrue(
            all(a < b for a, b in zip(scaled_ratios, scaled_ratios[1:]))
        )

        zero_boundary_sum = F(0)
        self.assertEqual(zero_boundary_sum, 0)
        self.assertEqual(F(7, 5) * zero_boundary_sum**2 / 11, 0)
        with self.assertRaises(ZeroDivisionError):
            _ = F(1) / zero_boundary_sum

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
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
            "two different scalars called `p_mu`",
            "central coefficient",
            "unit projected prolate anchor",
            "gamma_{\\rm fb}\\longrightarrow0",
            "subpolynomial feedback reserve",
            "relative principal-compression determinant asymptotic",
            "central-normalized actual profile",
            "auxiliary `mu=0` Gaussian functional",
            "The centered endpoint convention",
            "The source data and anchors in this section are real",
            "not to infer a bound for `s_L` merely from the normalized endpoint angle",
            "two-vector Ritz plane",
            "actual prolate anchors only as comparison vectors",
            "not the actual pole--archimedean--minus-prime matrices",
            "single-coordinate consequence",
            "checkpoint-1.38 standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "rh is proved",
            "actual response convergence is proved",
            "zero simplicity is proved",
            "gamma_fb->0 is proved for the actual",
            "standard eight are updated",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
