#!/usr/bin/env python3
"""Strict regressions for the direct bottom-projector adjugate barrier."""

from __future__ import annotations

import ast
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "NATURAL_DIRECT_BOTTOM_PROJECTOR_ADJUGATE_ALIGNMENT_BARRIER.md"
)
NOTE_HASH = "1d94062e36554e08bee7491fe263f037192b094c57b4b219e02dfd657f93a1fe"

FROZEN = {
    "notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md":
        "e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26",
    "tests/test_source_cauchy_selector_cone_projective_tradeoff.py":
        "f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee",
    "notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md":
        "ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450",
    "tests/test_natural_cutoff_signed_ground_alignment.py":
        "3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb",
    "notes/CENTRAL_PROLATE_NORMALIZATION_FEEDBACK_BARRIER.md":
        "00efc515b17157da25e980962aee7fafdd4ea522e92b5db0caca290fead0490d",
    "tests/test_central_prolate_normalization_feedback_barrier.py":
        "128026af692bf3f03663510b4dadbab3518509e107ab488c1c00a4e9f3a84e66",
    "notes/NATURAL_CENTERED_GATE_ANCHOR_COFACTOR_NONEMPTYNESS_REDUCTION_BARRIER.md":
        "88f6ffa991547f5ca88aacce893a585f3047d7675200288cd18a57cbbcfb7699",
    "tests/test_natural_centered_gate_anchor_cofactor_nonemptiness_reduction_barrier.py":
        "b57ad035543d21e4d6746bb58c19764171706ecc613932f850ea71e6857186bb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def adjugate(matrix: np.ndarray) -> np.ndarray:
    """Return the classical adjugate of a small square matrix."""
    dimension = matrix.shape[0]
    result = np.empty_like(matrix, dtype=float)
    for row in range(dimension):
        for column in range(dimension):
            minor = np.delete(np.delete(matrix, column, axis=0), row, axis=1)
            result[row, column] = ((-1) ** (row + column)) * np.linalg.det(minor)
    return result


def retained_geometry(kappa: np.ndarray) -> tuple[np.ndarray, np.ndarray, float]:
    """Return Pi, P_L, and k for the last-coordinate outer shell."""
    dimension = len(kappa)
    outer = np.zeros(dimension)
    outer[-1] = 1.0
    pi = np.eye(dimension) - np.outer(outer, outer)
    retained_anchor = pi @ kappa
    k_value = float(retained_anchor @ retained_anchor)
    p_l = pi - np.outer(retained_anchor, retained_anchor) / k_value
    return pi, p_l, k_value


class NaturalDirectBottomProjectorAdjugateTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_minimal_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 8)
        self.assertEqual(
            sum(relative.startswith("notes/") for relative in FROZEN), 4
        )
        self.assertEqual(
            sum(relative.startswith("tests/") for relative in FROZEN), 4
        )
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_eta_free_projector_bound_and_exact_observable(self) -> None:
        matrix = np.diag([1.0, 3.0, 5.0])
        kappa = np.array([2.0, 2.0, 1.0]) / 3.0
        _, p_l, _ = retained_geometry(kappa)
        ground = np.array([1.0, 0.0, 0.0])
        projector = np.outer(ground, ground)
        rho = float(kappa @ projector @ kappa)
        normalized = projector @ kappa / rho
        observable = float((p_l @ normalized) @ (p_l @ normalized))
        global_error = float((normalized - kappa) @ (normalized - kappa))

        self.assertAlmostEqual(rho, 4.0 / 9.0)
        self.assertAlmostEqual(float(kappa @ normalized), 1.0)
        self.assertAlmostEqual(float(normalized @ normalized), 1.0 / rho)
        self.assertAlmostEqual(observable, 9.0 / 8.0)
        self.assertAlmostEqual(global_error, 1.0 / rho - 1.0)
        self.assertLessEqual(observable, global_error)

        for lam in (2.0, 10.0, 100.0):
            constant = 3.0
            threshold = lam / (lam + constant)
            self.assertLessEqual(1.0 / threshold - 1.0, constant / lam + 1e-14)
        self.assertIn(r"\mathcal A\leq\rho^{-1}-1", self.text)
        self.assertIn(r"\rho\geq{\lambda\over\lambda+C}", self.text)

    def test_globally_safe_adjugate_and_gram_ratio(self) -> None:
        matrix = np.diag([1.0, 3.0, 5.0])
        mu = 1.0
        kappa = np.array([2.0, 2.0, 1.0]) / 3.0
        _, p_l, k_value = retained_geometry(kappa)
        shifted = mu * np.eye(3) - matrix
        j_matrix = adjugate(shifted)
        expected = np.diag([8.0, 0.0, 0.0])
        self.assertTrue(np.allclose(j_matrix, expected, atol=1e-13))

        j_kappa = j_matrix @ kappa
        denominator = float(kappa @ j_kappa)
        direct_ratio = float((p_l @ j_kappa) @ (p_l @ j_kappa)) / denominator**2
        vectors = np.column_stack(
            [np.array([0.0, 0.0, 1.0]), kappa, j_kappa]
        )
        gram_ratio = float(np.linalg.det(vectors.T @ vectors)) / (
            k_value * denominator**2
        )
        self.assertAlmostEqual(direct_ratio, 9.0 / 8.0)
        self.assertAlmostEqual(gram_ratio, direct_ratio)

        # The outer adjugate column vanishes although J*kappa and its
        # denominator are nonzero.  This is the chart failure repaired by
        # the full J*kappa formulation.
        self.assertTrue(np.allclose(j_matrix[:, -1], 0.0))
        self.assertGreater(float(j_kappa @ j_kappa), 0.0)
        self.assertNotEqual(denominator, 0.0)
        self.assertIn("particular outer cofactor column", self.text)
        self.assertIn("globally valid choice of chart", self.text)
        self.assertIn(
            r"{\|P_{\mathcal L}J\kappa\|^2 \over|\langle\kappa,J\kappa\rangle|^2}",
            self.normalized,
        )

    def test_multiple_adjugate_derivative_and_coordinate_visibility(self) -> None:
        matrix = np.diag([1.0, 1.0, 4.0])
        mu = 1.0
        multiplicity = 2
        h_value = 1e-5
        plus = adjugate((mu + h_value) * np.eye(3) - matrix)
        minus = adjugate((mu - h_value) * np.eye(3) - matrix)
        j_m = (plus - minus) / (2.0 * h_value)
        expected = np.diag([-3.0, -3.0, 0.0])
        self.assertTrue(np.allclose(j_m, expected, atol=2e-10))

        # chi''(1)=-6, so chi''(1)/m=-3.
        chi_m = -6.0
        projector = np.diag([1.0, 1.0, 0.0])
        self.assertTrue(
            np.allclose(j_m, (chi_m / multiplicity) * projector, atol=2e-10)
        )

        kappa = np.array([1.0, 2.0, 3.0]) / math.sqrt(14.0)
        overlaps = [float(kappa @ projector[:, index]) ** 2 for index in range(3)]
        rho = float(kappa @ projector @ kappa)
        self.assertAlmostEqual(sum(overlaps), rho)
        self.assertGreater(max(overlaps), 0.0)

        epsilon = 0.125
        lowered = matrix - epsilon * np.diag([1.0, 0.0, 0.0])
        values, vectors = np.linalg.eigh(lowered)
        self.assertLess(values[0], mu)
        self.assertLess(values[0], values[1])
        self.assertAlmostEqual(abs(float(vectors[0, 0])), 1.0)
        self.assertIn("coordinate-selected axis-rooted bottom line", self.normalized)
        self.assertIn(r"\min_{\langle\kappa,J_m e_j\rangle\ne0}", self.text)

    def test_shell_sums_and_adjacent_rank_obstruction(self) -> None:
        dimension = 5
        kappa = np.ones(dimension) / math.sqrt(dimension)
        _, p_l, _ = retained_geometry(kappa)
        projector = np.diag([1.0, 1.0, 1.0, 0.0, 0.0])
        rank = int(round(float(np.trace(projector))))
        trace_value = float(np.trace(p_l @ projector))
        rho = float(kappa @ projector @ kappa)

        numerators = []
        denominators = []
        for index in range(dimension):
            coordinate = np.eye(dimension)[:, index]
            selected = projector @ coordinate
            numerators.append(float((p_l @ selected) @ (p_l @ selected)))
            denominators.append(float(kappa @ selected) ** 2)
        self.assertAlmostEqual(sum(numerators), trace_value)
        self.assertAlmostEqual(sum(denominators), rho)
        visible_ratios = [
            numerator / denominator
            for numerator, denominator in zip(numerators, denominators)
            if denominator > 0.0
        ]
        self.assertLessEqual(min(visible_ratios), trace_value / rho + 1e-13)
        self.assertGreaterEqual(trace_value, max(0, rank - 2) - 1e-13)
        self.assertIn(r"\max\{0,m-2\}", self.text)
        self.assertIn("not the unweighted dimension of `E`", self.text)

    def test_rank_one_jump_and_analytic_genericity_are_insufficient(self) -> None:
        collision_projector = np.diag([1.0, 1.0, 1.0, 0.0])
        eta = np.array([1.0, 1.0, 1.0, 1.0])
        restricted_jump = collision_projector @ np.outer(eta, eta) @ collision_projector
        eigenvalues = np.linalg.eigvalsh(restricted_jump)
        self.assertEqual(sum(value > 1e-12 for value in eigenvalues), 1)
        self.assertEqual(sum(abs(value) < 1e-12 for value in eigenvalues), 3)

        # Source-Cauchy contains a persistent multiple-ground analytic
        # family: beta=0 and arbitrary repeated diagonal data.
        for parameter in (-2.0, 0.0, 3.5):
            family = np.diag([parameter, parameter, parameter + 1.0])
            values = np.linalg.eigvalsh(family)
            self.assertAlmostEqual(values[0], values[1])
        self.assertIn("If that discriminant is not identically zero", self.normalized)
        self.assertIn("dimension-changing family", self.text)
        self.assertIn("quantitative gap and stability radius", self.normalized)

    def test_source_cauchy_sign_frustration_blocks_abstract_perron(self) -> None:
        nodes = np.array([0.0, 1.0, 2.0])
        beta = nodes.copy()
        matrix = np.zeros((3, 3))
        for row in range(3):
            for column in range(3):
                if row != column:
                    matrix[row, column] = (
                        beta[row] - beta[column]
                    ) / (nodes[row] - nodes[column])
        self.assertTrue(np.allclose(matrix + np.eye(3), np.ones((3, 3))))
        triangle_product = matrix[0, 1] * matrix[1, 2] * matrix[2, 0]
        self.assertGreater(triangle_product, 0.0)

        # Diagonal sign conjugation preserves a triangle product, whereas
        # three strictly negative off-diagonals would have negative product.
        for signs in (
            np.array([1.0, 1.0, 1.0]),
            np.array([1.0, 1.0, -1.0]),
            np.array([1.0, -1.0, 1.0]),
            np.array([1.0, -1.0, -1.0]),
        ):
            gauged = np.diag(signs) @ matrix @ np.diag(signs)
            self.assertFalse(
                gauged[0, 1] < 0.0
                and gauged[1, 2] < 0.0
                and gauged[2, 0] < 0.0
            )
        self.assertIn("no abstract Perron repair", self.text)
        self.assertIn("operator-monotone Loewner generator", self.text)

    def test_actual_anchor_diagonal_countermodel_formula_and_growth(self) -> None:
        gain = 7.0
        raw_indices = np.arange(-2, 3)
        beta = np.zeros(len(raw_indices))
        raw = np.zeros((len(raw_indices), len(raw_indices)))
        for row, row_index in enumerate(raw_indices):
            for column, column_index in enumerate(raw_indices):
                if row == column:
                    raw[row, column] = 0.0 if row_index == 0 else gain
                else:
                    raw[row, column] = (
                        beta[row] - beta[column]
                    ) / (row_index - column_index)
        self.assertTrue(np.allclose(raw, np.diag([gain, gain, 0.0, gain, gain])))

        k_infinity = 2.0
        scaled_values = []
        for length in (20.0, 80.0, 320.0):
            kappa_zero = k_infinity / math.sqrt(length)
            outer = math.exp(-length)
            middle = math.sqrt(1.0 - kappa_zero**2 - outer**2)
            kappa = np.array([kappa_zero, middle, outer])
            _, p_l, k_value = retained_geometry(kappa)
            projector = np.diag([1.0, 0.0, 0.0])
            rho = float(kappa @ projector @ kappa)
            direct = float(
                (p_l @ projector @ kappa) @ (p_l @ projector @ kappa)
            ) / rho**2
            formula = 1.0 / kappa_zero**2 - 1.0 / k_value
            self.assertAlmostEqual(direct, formula, places=10)
            scaled_values.append(direct / length)
        self.assertAlmostEqual(scaled_values[-1], 1.0 / k_infinity**2, places=2)
        self.assertGreater(scaled_values[-1], scaled_values[0])
        self.assertIn(r"{1\over|\kappa_0|^2}-{1\over k}", self.text)
        self.assertIn(r"{L\over K_\infty^2}+o(L)", self.text)
        self.assertIn("synthetic and is not the actual prime source", self.text)

    def test_exact_stopping_line_and_claim_boundary(self) -> None:
        required = (
            "eta-free projector estimate",
            "globally safe adjugate ratio",
            "multiplicity-safe qualitative selector",
            r"\mathfrak R_p=O(\lambda_p^{-1})",
            r"\rho_p=1-O(\lambda_p^{-1})",
            "adaptive algebraic root",
            "common cofactor scale cancels",
            "actual relative orientation theorem",
            "is **not proved**",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.normalized)
        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "eventual actual simplicity is proved",
            "the actual finite-good set is nonempty",
            "Perron proves actual simplicity",
            "the diagonal countermodel is the actual arithmetic source",
            "the ordinary large sieve proves (8.3)",
            "the finite pilot proves (8.3)",
        )
        for token in forbidden:
            self.assertNotIn(token, self.normalized)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
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

    def test_ascii_ast_tex_hash_and_cache_clean(self) -> None:
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
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 10)
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
