#!/usr/bin/env python3
"""Exact regressions for the actual source-row and selector-moment gate."""

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
NOTE = ROOT / "notes" / "ACTUAL_SOURCE_ROW_PAIRED_GRAM_EXCLUSION_SELECTOR_MOMENT_GATE.md"
NOTE_HASH = "39777f86bfbf067402ccccdf069ff96276e5f931ee3ed4880edd3b135e181329"

FROZEN = {
    "notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md":
        "e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26",
    "tests/test_source_cauchy_selector_cone_projective_tradeoff.py":
        "f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee",
    "notes/FULL_SOURCE_CAUCHY_ANCHOR_FORCING_FEASIBILITY.md":
        "e54cb3b5d79f8dc8bf6188ae1168d7c18fb6cec07e4d92de83510d8f6e523928",
    "tests/test_full_source_cauchy_anchor_forcing_feasibility.py":
        "63619da4265edbbfebcd96a27f549a43872dcd2eb24b5a9f455cf8dedb58b37b",
    "notes/EVEN_GROUND_COEFFICIENT_CONE_AUDIT.md":
        "8599690f41785c7317c2f3627ef992dba4f3b1576e2fa3ce0ab6e204514ecc94",
    "tests/test_ground_jet_weyl_coefficient_cone_source_lock.py":
        "d30f8e340fa20b8f4ac12afcd056d544e35b7a6708166053f85128de92140e55",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "tests/test_high_fourier_coercivity.py":
        "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
    "notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md":
        "ac50057befa429894ba1498869a602324489f34aa5795e2d39cfc62bd549df73",
    "notes/LOWER_RITZ_DANGEROUS_RESPONSE_ARITHMETIC_KREIN_RH_GATE_THEOREM.md":
        "f0fd4065d6f1bafe8c119f5fcd3efe963e0da70cfe4871d3a26338f2016e2d1e",
    "tests/test_lower_ritz_dangerous_response_arithmetic_krein_rh_gate_theorem.py":
        "c9ee7fee05841b7831f9dfd3a6d5bb0bdd3431696e9122203c34e9ee9d041773",
    "notes/FIXED_PREFIX_EDGE_SIGN_SYNCHRONIZATION.md":
        "38079afb3f5f319d0ca29eeb6cfd827ff77af7589582f8f083296d92ce6fe773",
    "tests/test_fixed_prefix_edge_sign_synchronization.py":
        "0da34a29118fb63f38f601a63c90986fa452d4dc7d6b50f65218f8b7a75f885f",
    "notes/GLOBAL_TWISTED_MASS_STRICT_RITZ_SOURCE_CAUCHY_BARRIER.md":
        "1611454641341aa48f94caa1b1e1e14eb9abbe6eca4945b3bceffd359e66c034",
    "tests/test_global_twisted_mass_strict_ritz_source_cauchy_barrier.py":
        "e258c239a4d5291d8a92fd1699893e42b3d9af2ade515a7b12dc264c4b260a14",
}

Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def paired_roots(count: int, epsilon: F) -> tuple[F, ...]:
    return tuple(F(k) + F((-1) ** (k + 1)) * epsilon for k in range(1, count + 1))


def paired_source_at(count: int, epsilon: F, n: int) -> F:
    return -sum(
        (
            F(1, 1) / (F(n) - root) + F(1, 1) / (F(n) + root)
            for root in paired_roots(count, epsilon)
        ),
        F(0),
    )


def paired_diagonal_at(count: int, epsilon: F, n: int) -> F:
    return sum(
        (
            F(1, 1) / (F(n) - root) ** 2 + F(1, 1) / (F(n) + root) ** 2
            for root in paired_roots(count, epsilon)
        ),
        F(0),
    )


def selector_matrix(count: int, roots: tuple[F, ...], weights: tuple[F, ...]) -> Matrix:
    modes = tuple(range(-count, count + 1))
    return tuple(
        tuple(
            sum(
                (
                    weight / (F(n) - root) / (F(m) - root)
                    + weight / (F(n) + root) / (F(m) + root)
                    for root, weight in zip(roots, weights)
                ),
                F(0),
            )
            for m in modes
        )
        for n in modes
    )


def selector_source(roots: tuple[F, ...], weights: tuple[F, ...], n: int) -> F:
    return -2 * F(n) * sum(
        (weight / (F(n * n) - root * root) for root, weight in zip(roots, weights)),
        F(0),
    )


def selector_diagonal(roots: tuple[F, ...], weights: tuple[F, ...], n: int) -> F:
    return 2 * sum(
        (
            weight * (F(n * n) + root * root) / (F(n * n) - root * root) ** 2
            for root, weight in zip(roots, weights)
        ),
        F(0),
    )


class ActualSourceRowPairedGramExclusionSelectorMomentGateTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_edge_source_lower_bound_and_locked_scale(self) -> None:
        epsilon = F(1, 100)
        ratios = []
        for count in (2, 4, 10, 20):
            edge = -paired_source_at(count, epsilon, count)
            harmonic = 1 / epsilon + sum(
                (F(1, 1) / (F(j) + epsilon) for j in range(1, count)),
                F(0),
            )
            integral = 1 / epsilon + math.log(
                (count + float(epsilon)) / (1 + float(epsilon))
            )
            self.assertGreaterEqual(edge, harmonic)
            self.assertGreaterEqual(float(harmonic), integral)
            ratios.append(float(edge) / math.log(count))
        self.assertGreater(ratios[-1], 1.0)
        self.assertIn("9600\\log2", self.text)
        self.assertIn("cannot equal the pinned", self.text)

    def test_edge_diagonal_is_uniformly_bounded(self) -> None:
        epsilon = F(1, 100)
        upper = 1 / epsilon**2 + 2 * (
            1 / (1 - epsilon) ** 2 + 1 / (1 - epsilon)
        )
        for count in (2, 4, 10, 20):
            self.assertLessEqual(paired_diagonal_at(count, epsilon, count), upper)
        self.assertIn("scalar multiple of the", self.text)
        self.assertIn("source row is therefore", self.text)

    def test_positive_selector_source_and_diagonal_moments(self) -> None:
        count = 3
        roots = (F(6, 5), F(9, 5), F(13, 5))
        weights = (F(2, 7), F(5, 11), F(7, 13))
        modes = tuple(range(-count, count + 1))
        matrix = selector_matrix(count, roots, weights)
        source = tuple(selector_source(roots, weights, n) for n in modes)

        self.assertEqual(source, tuple(-value for value in reversed(source)))
        for i, n in enumerate(modes):
            self.assertEqual(matrix[i][i], selector_diagonal(roots, weights, n))
            for j, m in enumerate(modes):
                self.assertEqual(matrix[i][j], matrix[-i - 1][-j - 1])
                if i != j:
                    self.assertEqual(F(n - m) * matrix[i][j], source[i] - source[j])

        trial = tuple(F(n * n + 2 * n - 1, 9) for n in modes)
        quadratic = sum(
            (
                matrix[i][j] * trial[i] * trial[j]
                for i in range(len(modes))
                for j in range(len(modes))
            ),
            F(0),
        )
        square_sum = sum(
            (
                weight * sum(
                    (trial[i] / (F(n) - root) for i, n in enumerate(modes)), F(0)
                ) ** 2
                + weight * sum(
                    (trial[i] / (F(n) + root) for i, n in enumerate(modes)), F(0)
                ) ** 2
                for root, weight in zip(roots, weights)
            ),
            F(0),
        )
        self.assertEqual(quadratic, square_sum)
        self.assertGreaterEqual(quadratic, 0)

    def test_derivative_identity_and_localization_average(self) -> None:
        roots = (F(5, 4), F(7, 4), F(13, 4))
        weights = (F(2, 5), F(3, 7), F(5, 9))
        q_zero = 2 * sum(
            (weight / root**2 for root, weight in zip(roots, weights)), F(0)
        )
        for n in (1, 2, 3):
            source = selector_source(roots, weights, n)
            diagonal = selector_diagonal(roots, weights, n)
            minus_derivative = sum(
                (
                    weight / (F(n * n) - root * root) ** 2
                    for root, weight in zip(roots, weights)
                ),
                F(0),
            )
            derivative_numerator = diagonal - source / n
            self.assertEqual(minus_derivative, derivative_numerator / (4 * n * n))

            distances = tuple(
                abs(F(n * n) - root * root) / root for root in roots
            )
            bound_squared = F(2 * n * n) * q_zero / derivative_numerator
            self.assertLessEqual(min(distances) ** 2, bound_squared)

        self.assertIn("{q_0\\over D_N}<{1\\over8N^2}", self.text)
        self.assertIn("N^2\\log^2N", self.text)

    def test_center_ground_row_is_only_a_signed_harmonic_moment(self) -> None:
        count = 2
        roots = (F(5, 4), F(7, 4))
        weights = (F(3, 5), F(7, 11))
        modes = tuple(range(-count, count + 1))
        matrix = selector_matrix(count, roots, weights)

        def numerator(s: F) -> F:
            return -math.prod((s * s - root * root for root in roots), start=F(1))

        coefficients = []
        for n in modes:
            derivative = math.prod((F(n - m) for m in modes if m != n), start=F(1))
            coefficients.append(-numerator(F(n)) / derivative)
        ground = tuple(coefficients)
        self.assertEqual(sum(ground, F(0)), F(1))
        self.assertTrue(all(F((-1) ** n) * value > 0 for n, value in zip(modes, ground)))

        product = tuple(
            sum((matrix[i][j] * ground[j] for j in range(len(modes))), F(0))
            for i in range(len(modes))
        )
        self.assertEqual(product, (F(0),) * len(modes))

        q_zero = matrix[count][count]
        p = ground[count]
        source = tuple(selector_source(roots, weights, n) for n in range(1, count + 1))
        positive_weights = tuple(
            F((-1) ** n) * ground[count + n] for n in range(1, count + 1)
        )
        center = q_zero * p + 2 * sum(
            (
                F((-1) ** n) * source[n - 1] * positive_weights[n - 1] / n
                for n in range(1, count + 1)
            ),
            F(0),
        )
        self.assertEqual(center, 0)
        self.assertIn("one signed harmonic moment", self.text)
        self.assertIn("not an upper bound", self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
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

    def test_static_hygiene_ast_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("\\[\n\\[", self.text)

        required = (
            "first scalar-shift invariant arithmetic obstruction",
            "positive selector-moment representation",
            "unique weights `theta_j>0`",
            "not the Rayleigh quadratic of the projected prolate anchor",
            "metric atom weights, not the ground residues",
            "fixed-prefix alternation theorem is also insufficient",
            "actual arithmetic counterexample",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        normalized = " ".join(self.text.split())
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = self.text.lower()
        forbidden = (
            "the actual global twisted cone is false",
            "the actual strict signs fail",
            "actual response decay is proved",
            "the riemann hypothesis is proved",
            "standard eight are updated",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
