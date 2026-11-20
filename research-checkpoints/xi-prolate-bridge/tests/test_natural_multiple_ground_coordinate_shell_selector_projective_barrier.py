#!/usr/bin/env python3
"""Strict regressions for the multiple-ground coordinate-shell barrier."""

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


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "NATURAL_MULTIPLE_GROUND_COORDINATE_SHELL_SELECTOR_PROJECTIVE_BARRIER.md"
)
NOTE_HASH = "0b275f6c62e0ae63e45410ddf9bdd654a836970b4763ace1c9b6408efa34e2a6"

FROZEN = {
    "notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md":
        "e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26",
    "tests/test_source_cauchy_selector_cone_projective_tradeoff.py":
        "f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee",
    "notes/NATURAL_CENTERED_GATE_ANCHOR_COFACTOR_NONEMPTYNESS_REDUCTION_BARRIER.md":
        "88f6ffa991547f5ca88aacce893a585f3047d7675200288cd18a57cbbcfb7699",
    "tests/test_natural_centered_gate_anchor_cofactor_nonemptiness_reduction_barrier.py":
        "b57ad035543d21e4d6746bb58c19764171706ecc613932f850ea71e6857186bb",
}


F = Fraction


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: list[F], right: list[F]) -> F:
    return sum((a * b for a, b in zip(left, right)), F(0))


def outer(left: list[F], right: list[F]) -> list[list[F]]:
    return [[a * b for b in right] for a in left]


def matrix_add(
    left: list[list[F]], right: list[list[F]]
) -> list[list[F]]:
    return [
        [a + b for a, b in zip(left_row, right_row)]
        for left_row, right_row in zip(left, right)
    ]


def matvec(matrix: list[list[F]], vector: list[F]) -> list[F]:
    return [dot(row, vector) for row in matrix]


def column(matrix: list[list[F]], index: int) -> list[F]:
    return [row[index] for row in matrix]


def polynomial_add(left: list[F], right: list[F]) -> list[F]:
    size = max(len(left), len(right))
    result = [F(0)] * size
    for index, value in enumerate(left):
        result[index] += value
    for index, value in enumerate(right):
        result[index] += value
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def polynomial_multiply(left: list[F], right: list[F]) -> list[F]:
    result = [F(0)] * (len(left) + len(right) - 1)
    for left_index, left_value in enumerate(left):
        for right_index, right_value in enumerate(right):
            result[left_index + right_index] += left_value * right_value
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def polynomial_scale(polynomial: list[F], scalar: F) -> list[F]:
    return [scalar * coefficient for coefficient in polynomial]


def raw_mellin_polynomial(raw: list[F]) -> list[F]:
    """Return (2.2), in ascending powers, from f_0,...,f_N."""
    cutoff = len(raw) - 1
    all_factors = [F(1)]
    for mode in range(1, cutoff + 1):
        all_factors = polynomial_multiply(
            all_factors, [F(-(mode * mode)), F(1)]
        )
    result = polynomial_scale(all_factors, raw[0])
    for selected in range(1, cutoff + 1):
        product = [F(1)]
        for mode in range(1, cutoff + 1):
            if mode != selected:
                product = polynomial_multiply(
                    product, [F(-(mode * mode)), F(1)]
                )
        product = polynomial_multiply([F(0), F(1)], product)
        result = polynomial_add(
            result, polynomial_scale(product, 2 * raw[selected])
        )
    return result


class NaturalMultipleGroundCoordinateShellTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_minimal_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 4)
        self.assertEqual(
            sum(relative.startswith("notes/") for relative in FROZEN), 2
        )
        self.assertEqual(
            sum(relative.startswith("tests/") for relative in FROZEN), 2
        )
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)
        self.assertIn(
            "form a closed cone which need not be a vector space",
            self.normalized,
        )
        self.assertNotIn(
            "form a closed cone, not a vector space",
            self.normalized,
        )

    def test_exact_y_squared_plus_one_counterfamily(self) -> None:
        seed = [F(-1, 36), F(1, 24), F(-17, 120), F(41, 360)]
        self.assertEqual(seed[0] + 2 * sum(seed[1:], F(0)), 0)
        for cutoff in range(3, 9):
            raw = seed + [F(0)] * (cutoff - 3)
            expected = [F(1), F(0), F(1)]
            for mode in range(4, cutoff + 1):
                expected = polynomial_multiply(
                    expected, [F(-(mode * mode)), F(1)]
                )
            self.assertEqual(raw_mellin_polynomial(raw), expected)

            if cutoff == 3:
                polynomial = raw_mellin_polynomial(raw)
                self.assertEqual(polynomial, [F(1), F(0), F(1)])

        self.assertLess(0**2 - 4 * 1 * 1, 0)
        required = (
            r"(y^2+1)\prod_{m=4}^N(y-m^2)",
            r"P\kappa=\kappa",
            r"P\eta_+=0",
            "four transform zeros off both axes",
            "exclude every source-Cauchy-preserving simple-ground selection sequence",
            "synthetic source-Cauchy family",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_rank_one_selector_characterization_and_cycle_obstruction(self) -> None:
        raw = [F(-1, 36), F(1, 24), F(-17, 120), F(41, 360)]
        rho_from_one = raw[0] / raw[1] - 1
        rho_from_two = (raw[0] / raw[2] - 1) / 4
        self.assertEqual(rho_from_one, F(-5, 3))
        self.assertEqual(rho_from_two, F(-41, 204))
        self.assertNotEqual(rho_from_one, rho_from_two)

        index_i, index_j, index_k = 0, 1, 2
        cycle = (
            (index_i - index_j) * raw[0] * raw[1]
            + (index_j - index_k) * raw[1] * raw[2]
            + (index_k - index_i) * raw[2] * raw[0]
        )
        self.assertEqual(cycle, F(43, 2880))
        boundary = [F(1), F(1), F(1)]
        boundary_cycle = (
            -boundary[0] * boundary[1]
            - boundary[1] * boundary[2]
            + 2 * boundary[2] * boundary[0]
        )
        self.assertEqual(boundary_cycle, 0)

        required = (
            r"w_n={\sqrt2w_0\over1+\rho n^2}",
            r"f_n={f_0\over1+\rho n^2}",
            r"|\eta\rangle\langle\eta|",
            r"|V_0\rangle\langle V_0|",
            "only the central coordinate as the sparse alternative",
            "arbitrary projected-prolate anchor satisfies neither exact characterization",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_projective_closed_cone_and_coordinate_existence(self) -> None:
        for denominator in (2, 7, 19, 101):
            first = F(1, denominator)
            polynomial = polynomial_multiply(
                [F(-first), F(1)], [F(-2), F(1)]
            )
            self.assertEqual(len(polynomial), 3)
        limit = polynomial_multiply([F(0), F(1)], [F(-2), F(1)])
        self.assertEqual(limit, [F(0), F(-2), F(1)])

        cutoff = 4
        eta = [1.0] + [math.sqrt(2.0)] * cutoff
        eta_norm = sum(value * value for value in eta)
        projector = [
            [float(row == col) - eta[row] * eta[col] / eta_norm
             for col in range(cutoff + 1)]
            for row in range(cutoff + 1)
        ]
        raw = [F(-1, 36), F(1, 24), F(-17, 120), F(41, 360), F(0)]
        anchor = [float(raw[0])] + [
            math.sqrt(2.0) * float(value) for value in raw[1:]
        ]
        anchor_norm = math.sqrt(sum(value * value for value in anchor))
        anchor = [value / anchor_norm for value in anchor]
        projected = [
            sum(projector[row][col] * anchor[col] for col in range(cutoff + 1))
            for row in range(cutoff + 1)
        ]
        self.assertTrue(
            all(abs(left - right) < 1e-13 for left, right in zip(projected, anchor))
        )
        self.assertTrue(all(
            abs(sum(projector[row][col] * eta[col] for col in range(cutoff + 1)))
            < 1e-13
            for row in range(cutoff + 1)
        ))
        overlaps = [
            sum(anchor[row] * projector[row][col] for row in range(cutoff + 1))
            for col in range(cutoff + 1)
        ]
        self.assertAlmostEqual(sum(value * value for value in overlaps), 1.0)
        self.assertTrue(any(abs(value) > 1e-12 for value in overlaps))

        required = (
            r"{\cal R}_0(E)={\cal R}(E)\mathbin\cup\{0\}",
            "coefficientwise closed",
            "cannot be selected or even approximated at fixed `N`",
            r"w_j\ne0\quad\Longrightarrow\quad w_j\in{\cal R}(E)",
            "qualitative coordinate-selected cross-root existence",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def _shell_fixture(self) -> dict[str, object]:
        u_value = [F(3, 5), F(4, 5), F(0), F(0)]
        v_value = [F(0), F(0), F(5, 13), F(12, 13)]
        projector = matrix_add(
            outer(u_value, u_value), outer(v_value, v_value)
        )
        low_perpendicular = [
            [F(int(row == col and row in (1, 2))) for col in range(4)]
            for row in range(4)
        ]
        anchor = [F(3, 5), F(0), F(0), F(4, 5)]
        low_anchor = [F(3, 5), F(0), F(0), F(0)]
        shells = [column(projector, index) for index in range(4)]
        n_values = [
            dot(matvec(low_perpendicular, shell), matvec(low_perpendicular, shell))
            for shell in shells
        ]
        a_values = [dot(anchor, shell) for shell in shells]
        c_values = [dot(low_anchor, shell) for shell in shells]
        q_values = [dot(shell, shell) for shell in shells]
        trace = sum(projector[index][index] for index in (1, 2))
        projected_anchor = matvec(projector, anchor)
        projected_low = matvec(projector, low_anchor)
        return {
            "P": projector,
            "PL": low_perpendicular,
            "kappa": anchor,
            "p": low_anchor,
            "w": shells,
            "n": n_values,
            "a": a_values,
            "c": c_values,
            "q": q_values,
            "T": trace,
            "Y2": dot(projected_anchor, projected_anchor),
            "YM2": dot(projected_low, projected_low),
        }

    def test_exact_three_shell_sums_and_minimum_ratios(self) -> None:
        data = self._shell_fixture()
        n_values = data["n"]
        a_values = data["a"]
        c_values = data["c"]
        self.assertEqual(sum(n_values, F(0)), data["T"])
        self.assertEqual(sum((value * value for value in a_values), F(0)), data["Y2"])
        self.assertEqual(sum((value * value for value in c_values), F(0)), data["YM2"])

        full_ratios = [
            numerator / (denominator * denominator)
            for numerator, denominator in zip(n_values, a_values)
            if denominator != 0
        ]
        low_ratios = [
            numerator / (denominator * denominator)
            for numerator, denominator in zip(n_values, c_values)
            if denominator != 0
        ]
        self.assertLessEqual(min(full_ratios), data["T"] / data["Y2"])
        self.assertLessEqual(min(low_ratios), data["T"] / data["YM2"])
        self.assertEqual(min(low_ratios), F(400, 81))

        for token in (
            r"\sum_{j=0}^Nn_j=T",
            r"\sum_{j=0}^N|a_j|^2=Y^2",
            r"\sum_{j=0}^N|c_j|^2=Y_M^2",
            r"\min_{a_j\ne0}{n_j\over|a_j|^2}\leq {T\over Y^2}",
            r"\min_{c_j\ne0}{n_j\over|c_j|^2}\leq {T\over Y_M^2}",
        ):
            self.assertIn(token, self.normalized)

    def test_low_projective_formula_and_two_simultaneous_choices(self) -> None:
        data = self._shell_fixture()
        low_anchor = data["p"]
        k_zero = dot(low_anchor, low_anchor)
        selected = 0
        numerator = data["n"][selected]
        overlap = data["c"][selected]
        denominator = k_zero * numerator + overlap * overlap
        scalar = k_zero * overlap / denominator
        low_shell = list(data["w"][selected])
        low_shell[-1] = F(0)
        residual = [
            scalar * value - target for value, target in zip(low_shell, low_anchor)
        ]
        exact_error = dot(residual, residual)
        formula = k_zero * k_zero * numerator / denominator
        self.assertEqual(exact_error, formula)

        theta = F(2)
        low_good = [
            index
            for index, (n_value, c_value) in enumerate(zip(data["n"], data["c"]))
            if c_value != 0
            and n_value / (c_value * c_value)
            <= theta * data["T"] / data["YM2"]
        ]
        self.assertTrue(low_good)
        mass_threshold = data["YM2"] / (2 * len(data["c"]))
        self.assertTrue(any(data["c"][index] ** 2 >= mass_threshold for index in low_good))

        dimension = F(2)
        full_good = [
            index
            for index, (n_value, a_value, q_value) in enumerate(
                zip(data["n"], data["a"], data["q"])
            )
            if a_value != 0
            and n_value / (a_value * a_value) <= 2 * data["T"] / data["Y2"]
            and q_value / (a_value * a_value) <= 2 * dimension / data["Y2"]
        ]
        self.assertTrue(full_good)

        required = (
            r"{k_{00}^2n_j\over k_{00}n_j+|c_j|^2}",
            r"|c_j|^2\geq",
            r"|s_j|\leq {k_{00}\over|c_j|}",
            r"{q_j\over|a_j|^2}\leq {2d\over Y^2}",
            "low-projective scaling bound, not yet an anchor normalization",
            "That selector need not be the low-overlap selector",
            r"\delta_M< {\sqrt{1-\theta^{-1}}\,Y_M",
            "`sqrt(lambda)` loss",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_tail_transfer_and_outer_shell_failure(self) -> None:
        data = self._shell_fixture()
        full_y = math.sqrt(float(data["Y2"]))
        low_y = math.sqrt(float(data["YM2"]))
        delta = F(4, 5)
        self.assertLessEqual(abs(full_y - low_y), float(delta) + 1e-15)

        differences = [
            full - low for full, low in zip(data["a"], data["c"])
        ]
        projected_tail = matvec(
            data["P"], [F(0), F(0), F(0), F(4, 5)]
        )
        self.assertEqual(
            sum((value * value for value in differences), F(0)),
            dot(projected_tail, projected_tail),
        )
        self.assertLessEqual(dot(projected_tail, projected_tail), delta * delta)

        cutoff = 4
        epsilon = F(3, 5)
        anchor = [F(4, 5)] + [F(0)] * (cutoff - 1) + [epsilon]
        ground = [F(0)] * cutoff + [F(1)]
        full_visibility = dot(anchor, ground)
        low_ground = ground[:-1] + [F(0)]
        low_visibility = dot(anchor, low_ground)
        self.assertEqual(full_visibility, epsilon)
        self.assertEqual(low_visibility, 0)
        self.assertEqual(dot(anchor[:-1], anchor[:-1]), F(16, 25))

        required = (
            r"|Y_M-Y|\leq\delta_M",
            r"\sum_{j=0}^N|a_j-c_j|^2",
            r"Y=\varepsilon>0",
            r"Y_M=0",
            r"\|\Pi(se_N^+-\kappa)\|^2=1-\varepsilon^2",
            "quantitative tail-to-visibility comparison is indispensable",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_rank_obstruction_and_trace_is_not_necessary(self) -> None:
        for low_rank in (1, 3, 7):
            ambient = low_rank + 2
            bottom_rank = ambient
            trace = low_rank
            self.assertEqual(trace, bottom_rank - 2)
            self.assertGreaterEqual(
                trace, max(0, bottom_rank - (ambient - low_rank))
            )

        cutoff = 5
        eta = [1.0] + [math.sqrt(2.0)] * cutoff
        eta_norm = sum(value * value for value in eta)
        projector = [
            [float(row == col) - eta[row] * eta[col] / eta_norm
             for col in range(cutoff + 1)]
            for row in range(cutoff + 1)
        ]
        shell = [projector[row][0] for row in range(cutoff + 1)]
        shell_norm = math.sqrt(sum(value * value for value in shell))
        anchor = [value / shell_norm for value in shell]
        scalar = 1.0 / shell_norm
        self.assertTrue(all(
            abs(scalar * shell[index] - anchor[index]) < 1e-14
            for index in range(cutoff + 1)
        ))
        self.assertEqual(cutoff - 2, 3)

        required = (
            r"T\geq\max\{0,d-(N+1-M)\}",
            "At the natural adjacent cutoff `N=M+1`",
            r"T\geq N-2",
            "trace condition is not necessary",
            "perfect coordinate selector",
            "exact weakest coordinate target is the minimum in (6.9)",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_simple_eta_free_branch_and_fail_closed_scope(self) -> None:
        required = (
            "strict simple branch",
            "complement gate itself forces `P*kappa!=0`",
            "multiple bottom space",
            "line `P*kappa` can fail (2.6)",
            "No standard-eight file, source lock, or numerical artifact is changed",
            "formal state remains `P0_INVALIDATED`",
            "Actual-source low visibility",
            "quantitative minimum-shell projective rate remain open",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "P0_PROVED",
            "actual good-set nonemptiness is proved",
        )
        for token in forbidden:
            self.assertNotIn(token, self.normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 60)
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

    def test_ascii_ast_tex_tags_and_cache_clean(self) -> None:
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
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 15)
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
