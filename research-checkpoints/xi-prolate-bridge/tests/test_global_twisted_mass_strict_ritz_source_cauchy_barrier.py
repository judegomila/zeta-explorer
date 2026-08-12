#!/usr/bin/env python3
"""Exact regressions for the global twisted-mass source-Cauchy barrier."""

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
NOTE = ROOT / "notes" / "GLOBAL_TWISTED_MASS_STRICT_RITZ_SOURCE_CAUCHY_BARRIER.md"
NOTE_HASH = "1611454641341aa48f94caa1b1e1e14eb9abbe6eca4945b3bceffd359e66c034"

FROZEN = {
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md":
        "d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0",
    "tests/test_source_boundary.py":
        "a4be31e74a735c8f9150ed84cc4dc8c147e654364b65ec5cb3b814500e7ff808",
    "notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md":
        "9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13",
    "tests/test_source_quotient_pick_herglotz_interlacing_barrier.py":
        "86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658",
    "notes/GROWING_RETAINED_NEGATIVE_INDEX_CAPTURE_BARRIER.md":
        "9fc64fedde255791775861e7a3bb2b2d55eab1a3d402cf8b842d9e0d8519424c",
    "tests/test_growing_retained_negative_index_capture_barrier.py":
        "1e6067e8e4795eac284a8efc12bfc235ff7a6590efce28428b4569320257c4aa",
    "notes/NORMALIZED_SOURCE_QUOTIENT_RESPONSE_BARRIER.md":
        "a21be420fa1696cceffdaf653e083e848addd9ca13b3ad0b0f930476916271f2",
    "tests/test_normalized_source_quotient_response_barrier.py":
        "8bafeff220c3193e9dcd5b511db011e3df565fe1b773878f88f435be687f7026",
    "notes/OPPOSITE_BOUNDARY_TWISTED_WEYL_SOURCE_QUOTIENT_BARRIER.md":
        "a6b21ec0048f632d67ff32f116291e011f66b5c1a168df12442cac19d33c2258",
    "tests/test_opposite_boundary_twisted_weyl_source_quotient_barrier.py":
        "5b368373194720eb8a332475c21425dace632678975127c7bbfdb94f863382d2",
}

Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def roots(count: int, epsilon: F) -> tuple[F, ...]:
    return tuple(F(k) + F((-1) ** (k + 1)) * epsilon for k in range(1, count + 1))


def q_value(count: int, value: F) -> F:
    return math.prod((value - n for n in range(-count, count + 1)), start=F(1))


def p_value(root_values: tuple[F, ...], value: F) -> F:
    return -math.prod((value * value - root * root for root in root_values), start=F(1))


def ground(count: int, epsilon: F) -> Vector:
    root_values = roots(count, epsilon)
    result = []
    for n in range(-count, count + 1):
        derivative = math.prod(
            (F(n - m) for m in range(-count, count + 1) if m != n),
            start=F(1),
        )
        result.append(-p_value(root_values, F(n)) / derivative)
    return tuple(result)


def gram_matrix(count: int, epsilon: F) -> Matrix:
    modes = tuple(range(-count, count + 1))
    root_values = roots(count, epsilon)
    return tuple(
        tuple(
            sum(
                (
                    F(1, 1) / (F(n) - root) / (F(m) - root)
                    + F(1, 1) / (F(n) + root) / (F(m) + root)
                    for root in root_values
                ),
                F(0),
            )
            for m in modes
        )
        for n in modes
    )


def source_row(count: int, epsilon: F) -> Vector:
    root_values = roots(count, epsilon)
    return tuple(
        -sum(
            (F(1, 1) / (F(n) - root) + F(1, 1) / (F(n) + root)
             for root in root_values),
            F(0),
        )
        for n in range(-count, count + 1)
    )


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    )


def rank(matrix: Matrix) -> int:
    work = [list(row) for row in matrix]
    pivot_row = 0
    for column in range(len(work[0])):
        pivot = next(
            (row for row in range(pivot_row, len(work)) if work[row][column]),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        for row in range(len(work)):
            if row == pivot_row or not work[row][column]:
                continue
            multiplier = work[row][column] / pivot_value
            for entry in range(column, len(work[0])):
                work[row][entry] -= multiplier * work[pivot_row][entry]
        pivot_row += 1
    return pivot_row


def twisted_mass_ratio(count: int, epsilon: F) -> F:
    coefficients = ground(count, epsilon)
    weights = tuple(F((-1) ** n) * value for n, value in zip(range(-count, count + 1), coefficients))
    return sum(weights, F(0)) / weights[count]


class GlobalTwistedMassStrictRitzSourceCauchyBarrierTests(unittest.TestCase):
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

    def test_exact_ground_normalization_and_global_cone(self) -> None:
        count = 4
        epsilon = F(1, 100)
        root_values = roots(count, epsilon)
        coefficients = ground(count, epsilon)
        modes = tuple(range(-count, count + 1))

        self.assertEqual(sum(coefficients, F(0)), F(1))
        self.assertEqual(coefficients, tuple(reversed(coefficients)))
        weights = tuple(F((-1) ** n) * value for n, value in zip(modes, coefficients))
        self.assertTrue(all(value > 0 for value in weights))
        self.assertEqual(weights[count], coefficients[count])

        for n in modes:
            expected_derivative = F((-1) ** n) * F(
                math.factorial(count + n) * math.factorial(count - n)
            )
            actual_derivative = math.prod(
                (F(n - m) for m in modes if m != n), start=F(1)
            )
            self.assertEqual(actual_derivative, expected_derivative)
            self.assertLess(p_value(root_values, F(n)), 0)

        for j in range(1, count // 2 + 1):
            self.assertLess(2 * j - 1, root_values[2 * j - 2])
            self.assertLess(root_values[2 * j - 2], root_values[2 * j - 1])
            self.assertLess(root_values[2 * j - 1], 2 * j)

        for s in (F(1, 3), F(7, 5), F(9, 2)):
            partial_fractions = sum(
                (value / (F(n) - s) for n, value in zip(modes, coefficients)),
                F(0),
            )
            self.assertEqual(partial_fractions, p_value(root_values, s) / q_value(count, s))

    def test_positive_gram_source_displacement_and_simple_kernel(self) -> None:
        count = 4
        epsilon = F(1, 100)
        modes = tuple(range(-count, count + 1))
        matrix = gram_matrix(count, epsilon)
        coefficients = ground(count, epsilon)
        source = source_row(count, epsilon)

        self.assertEqual(matvec(matrix, coefficients), (F(0),) * (2 * count + 1))
        self.assertEqual(rank(matrix), 2 * count)
        self.assertEqual(source, tuple(-value for value in reversed(source)))
        for i, n in enumerate(modes):
            for j, m in enumerate(modes):
                self.assertEqual(matrix[i][j], matrix[-i - 1][-j - 1])
                if i != j:
                    self.assertEqual(
                        F(n - m) * matrix[i][j],
                        source[i] - source[j],
                    )

        # Positivity is exact from the displayed sum of rank-one squares.
        trial = tuple(F(n * n - 3 * n + 2, 7) for n in modes)
        quadratic = sum(
            (
                sum((matrix[i][j] * trial[i] * trial[j] for j in range(len(modes))), F(0))
                for i in range(len(modes))
            ),
            F(0),
        )
        root_values = roots(count, epsilon)
        square_sum = sum(
            (
                sum((trial[i] / (F(n) - root) for i, n in enumerate(modes)), F(0)) ** 2
                + sum((trial[i] / (F(n) + root) for i, n in enumerate(modes)), F(0)) ** 2
                for root in root_values
            ),
            F(0),
        )
        self.assertEqual(quadratic, square_sum)
        self.assertGreaterEqual(quadratic, 0)

    def test_uniform_hilbert_bounds_imply_genuine_shifted_signs(self) -> None:
        epsilon = F(1, 100)
        pi_upper = F(22, 7)
        remainder_upper = epsilon * pi_upper * pi_upper / (6 * (1 - epsilon))
        lower_singular = 1 / (2 * epsilon) - pi_upper - remainder_upper
        q_upper = 2 * (1 / (1 - epsilon) ** 2 + 1 / (1 - epsilon))

        self.assertGreater(lower_singular, 46)
        self.assertGreater(4 * lower_singular * lower_singular, 8464)
        self.assertLess(q_upper, 5)
        self.assertGreater(4 * lower_singular * lower_singular - q_upper, 8459)

        # The proof uses the genuine lower Ritz eigenvalue u, with 0 <= u <= q.
        self.assertIn("Let `u_N` be the lower", self.text)
        self.assertIn("0\\leq u_N\\leq q", self.text)
        self.assertIn("A_N-u_NI\\succ8459I", self.text)
        self.assertIn("O_N-u_NI\\succ8459I", self.text)
        self.assertIn("does not silently replace `u_N`", self.text)

    def test_twisted_mass_growth_and_gamma_exponent(self) -> None:
        epsilon = F(1, 100)
        ratios = tuple(twisted_mass_ratio(count, epsilon) for count in (2, 4, 8))
        self.assertLess(ratios[0], ratios[1])
        self.assertLess(ratios[1], ratios[2])
        self.assertGreater(ratios[2], F(21, 20))

        alpha = (1 + epsilon) / 2
        beta = 1 - epsilon / 2
        self.assertEqual(alpha + beta, F(3, 2))
        self.assertEqual((1 - 2 * alpha) + (1 - 2 * beta), F(-1))
        even_sine = abs(math.sin(math.pi * float(alpha)) * math.sin(math.pi * float(beta)))
        odd_sine = abs(math.cos(math.pi * float(alpha)) * math.cos(math.pi * float(beta)))
        self.assertGreater(even_sine, 0)
        self.assertGreater(odd_sine, 0)
        self.assertIn("Fatou's lemma", self.text)
        self.assertIn("=+\\infty", self.text)

    def test_root_clearance_can_be_fixed_or_vanish(self) -> None:
        for epsilon in (F(1, 100), F(1, 1000), F(1, 10000)):
            root_values = roots(8, epsilon)
            distances = tuple(abs(root - round(float(root))) for root in root_values)
            self.assertTrue(all(distance == epsilon for distance in distances))
        self.assertIn("epsilon_N\\longrightarrow0", self.text)
        self.assertIn("positive quotient-root clearance", self.text)

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
            "global target-compatible cone",
            "source-Cauchy counterfamily",
            "simple boundary-normalized even ground",
            "positive semidefinite",
            "genuine lower-Ritz hypotheses",
            "gamma product",
            "Fatou's lemma",
            "actual prime-power matrix",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

        lowered = self.text.lower()
        forbidden = (
            "the actual global twisted cone fails",
            "the actual strict signs fail",
            "actual response nondecay is proved",
            "the riemann hypothesis is proved",
            "standard eight are updated",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
