#!/usr/bin/env python3
"""Regressions for the growing anchor-row Toeplitz inverse-energy barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
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
    / "GROWING_ANCHOR_ROW_FULL_METRIC_TOEPLITZ_INVERSE_ENERGY_BARRIER.md"
)
TEST = Path(__file__).resolve()
NOTE_HASH = "b5da4b84a6c67c96220cb0fd25b3fec152e01f7ec4c357aea0bd5de986af0178"

FROZEN = {
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "tests/test_fixed_even_prefix_arithmetic_synthesis_theorem.py":
        "6e89f2f1af22260e5796eb67221fccd86d2668556e9cb23dd903ea283d5f069f",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_FACTORED_FRACTIONAL_FRAME_THEOREM.md":
        "6f0385a37476079991c45497e88664d49c0e13a5661026966f9d3bb22ee4f404",
    "tests/test_growing_low_prefix_endpoint_factored_fractional_frame_theorem.py":
        "cf03e6e7a4254403bc4fb75469a90b926e4525455693cd5a1c5decc78b12640e",
    "notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md":
        "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0",
    "tests/test_growing_low_prefix_outer_floor_assembly_theorem.py":
        "634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311",
    "notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md":
        "1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032",
    "tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py":
        "e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa",
    "notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md":
        "0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3",
    "tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py":
        "8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def transpose(matrix: list[list[F]]) -> list[list[F]]:
    return [list(row) for row in zip(*matrix)]


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


def inv2(matrix: list[list[F]]) -> list[list[F]]:
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    return [
        [matrix[1][1] / determinant, -matrix[0][1] / determinant],
        [-matrix[1][0] / determinant, matrix[0][0] / determinant],
    ]


def quadratic(vector: list[F], matrix: list[list[F]]) -> F:
    column = [[value] for value in vector]
    return matmul(matmul([vector], matrix), column)[0][0]


class GrowingAnchorRowToeplitzInverseEnergyBarrierTests(unittest.TestCase):
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

    def test_source_label_support_survives_both_shears(self) -> None:
        # Pure coordinates are ordered (0,4,8,12).  The physical anchor
        # column q4 is not one of the two final complement columns.
        rho4, rho8, rho12 = F(2), F(5), F(7)
        alpha8, alpha12, gamma = F(3), F(-2), F(4)
        q4 = [rho4, F(1), F(0), F(0)]
        q8 = [rho8, F(0), F(1), F(0)]
        q12 = [rho12, F(0), F(0), F(1)]
        w8 = [q8[j] - alpha8 * q4[j] for j in range(4)]
        w12 = [q12[j] - alpha12 * q4[j] for j in range(4)]
        w12_sharp = [w12[j] - gamma * w8[j] for j in range(4)]
        self.assertNotEqual(w8[0], 0)
        self.assertNotEqual(w8[1], 0)
        self.assertNotEqual(w12_sharp[0], 0)
        self.assertNotEqual(w12_sharp[1], 0)
        self.assertNotEqual(w12_sharp[2], 0)
        self.assertEqual(w8[3], 0)
        self.assertNotEqual(w12_sharp[3], 0)

    def test_recoordination_preserves_anchor_orthogonal_range(self) -> None:
        # kappa=e0; V spans its orthogonal complement.  Multiplying by an
        # invertible source shear cannot put kappa into the range.
        v = [[F(0), F(0)], [F(1), F(0)], [F(0), F(1)]]
        shear = [[F(1), F(2)], [F(3), F(7)]]
        sharp = matmul(v, shear)
        self.assertEqual(sharp[0], [F(0), F(0)])
        determinant = sharp[1][0] * sharp[2][1] - sharp[1][1] * sharp[2][0]
        self.assertNotEqual(determinant, 0)

    def test_inverse_energy_is_exactly_congruence_invariant(self) -> None:
        form = [[F(4), F(1)], [F(1), F(3)]]
        row = [F(2), F(-1)]
        shear = [[F(1), F(2)], [F(0), F(1)]]
        transformed_form = matmul(matmul(transpose(shear), form), shear)
        transformed_row = matmul(transpose(shear), [[value] for value in row])
        transformed_vector = [entry[0] for entry in transformed_row]
        before = quadratic(row, inv2(form))
        after = quadratic(transformed_vector, inv2(transformed_form))
        self.assertEqual(before, after)

    def test_exact_prefix_retained_inverse_split(self) -> None:
        form = [[F(3), F(1)], [F(1), F(2)]]
        row = [F(2), F(5)]
        direct = quadratic(row, inv2(form))
        prefix = row[0] * row[0] / form[0][0]
        short = form[1][1] - form[1][0] * form[0][1] / form[0][0]
        residual = row[1] - form[1][0] * row[0] / form[0][0]
        retained = residual * residual / short
        self.assertEqual(prefix, F(4, 3))
        self.assertEqual(retained, F(169, 15))
        self.assertEqual(direct, F(63, 5))
        self.assertEqual(direct, prefix + retained)
        self.assertGreater(direct, prefix)

    def test_retained_family_has_good_ritz_scale_but_bad_inverse_row(self) -> None:
        ratios: list[F] = []
        for length in (2, 4, 8, 16):
            ell = F(length)
            epsilon = ell ** -8
            b0, b1 = ell, ell ** -2
            norm_squared = b0 * b0 + b1 * b1
            forward = ell * b0 * b0 + epsilon * b1 * b1
            lowering = norm_squared * norm_squared / forward
            first_moment = forward / norm_squared
            self.assertEqual(lowering * first_moment, norm_squared)

            prefix_energy = b0 * b0 / ell
            inverse_energy = prefix_energy + b1 * b1 / epsilon
            self.assertEqual(prefix_energy, ell)
            self.assertEqual(inverse_energy, ell + ell**4)
            ratios.append(inverse_energy / ell)

            # q=lowering and u=0 make the lower two-vector determinant zero.
            self.assertEqual(lowering * first_moment - norm_squared, 0)
            self.assertGreater(lowering, 0)
            self.assertGreater(first_moment, 0)
            self.assertLess(abs(lowering / ell - 1), F(1, length))
        self.assertTrue(all(right > left for left, right in zip(ratios, ratios[1:])))

    def test_scope_and_required_formulas(self) -> None:
        required = (
            "Conditionally on the unproved strict even lower-Ritz branch",
            "u_+\\|V_Q\\|^2=o(\\lambda^{-4})",
            "pure source supports",
            "not a list of physical basis",
            "range enlargement, not a congruence",
            "c_Q^*D_Q^{-1}c_Q+e_Q^*S_Q^{-1}e_Q",
            "e_Q^*S_Q^{-1}e_Q=O(d_4L)",
            "An upper bound for the visible term is therefore not an upper bound",
            "No coordinate choice changes",
            "does not prove or disprove",
            "remains `P0_INVALIDATED`",
            "standard eight are unchanged",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)
        forbidden = (
            "proves the Riemann hypothesis",
            "the outer floor contains the determinant anchor",
            "the retained term vanishes",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, self.text)

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_ascii_python_and_whitespace_hygiene(self) -> None:
        ast.parse(TEST.read_text(encoding="utf-8"), filename=str(TEST))
        self.assertNotRegex(self.text, re.compile(r"(?<!\\)\$"))
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertEqual(
            self.text.count(r"\begin{aligned}"),
            self.text.count(r"\end{aligned}"),
        )
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(any(line.endswith((b" ", b"\t")) for line in payload.splitlines()))


if __name__ == "__main__":
    unittest.main()
