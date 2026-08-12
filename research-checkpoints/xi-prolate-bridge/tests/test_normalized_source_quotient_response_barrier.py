#!/usr/bin/env python3
"""Regressions for the normalized source-quotient response barrier."""

from __future__ import annotations

import ast
import cmath
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
NOTE = ROOT / "notes" / "NORMALIZED_SOURCE_QUOTIENT_RESPONSE_BARRIER.md"
NOTE_HASH = "a21be420fa1696cceffdaf653e083e848addd9ca13b3ad0b0f930476916271f2"

FROZEN = {
    "notes/CAPTURE_FREE_ACTUAL_GROUND_PARITY_RESPONSE_BARRIER.md":
        "ec53e8c99f639bdae46a8da6d55c4e34b8381b3348f62833cd2ac1d1bb8dbbf3",
    "tests/test_capture_free_actual_ground_parity_response_barrier.py":
        "477c7849bf319a62c6d483874d29c638250060ee0e9db844ae1477455f380772",
    "notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md":
        "9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13",
    "tests/test_source_quotient_pick_herglotz_interlacing_barrier.py":
        "86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md":
        "d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0",
    "tests/test_source_boundary.py":
        "a4be31e74a735c8f9150ed84cc4dc8c147e654364b65ec5cb3b814500e7ff808",
    "notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md":
        "1c4568a142779f0d7cab023bfb41811d10c2ccac37a505cbe7f079b972761755",
    "notes/ACTUAL_GROUND_FIXED_MODE_RESIDUE_SIGN_BARRIER.md":
        "3a64146e1f3836b9dd07ae55a1955e7d66cd35ad72f58d4ce116c18b16cddcce",
    "tests/test_actual_ground_fixed_mode_residue_sign_barrier.py":
        "5ea8d73b2641f6fe31e494bcd4ab0e524940bc7575d6c5b8a784e7e415201216",
    "notes/SOURCE_COMPATIBLE_MIXED_COFACTOR_DEFORMATION_BARRIER.md":
        "cfc5585292a8880f43003280900e85f052951195c563c01ed48cdd49f27aa4d9",
    "tests/test_source_compatible_mixed_cofactor_deformation_barrier.py":
        "d91f134ebc3d8a33e38a7cb3acd6354a25a0293233bf111f7983710076db5af7",
}

F = Fraction
Vector = tuple[Fraction, ...]
Matrix = tuple[tuple[Fraction, ...], ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    )


def scale(vector: Vector, scalar: Fraction) -> Vector:
    return tuple(scalar * value for value in vector)


def source_matrix(a: Fraction) -> Matrix:
    modes = tuple(range(-2, 3))
    source = (F(-2), F(1), F(0), F(-1), F(2))
    diagonal = (
        1 / a + F(7, 3),
        1 / a + F(13, 3),
        4 * a,
        1 / a + F(13, 3),
        1 / a + F(7, 3),
    )
    return tuple(
        tuple(
            diagonal[row]
            if row == column
            else (source[row] - source[column]) / (modes[row] - modes[column])
            for column in range(5)
        )
        for row in range(5)
    )


def q_data(cutoff: int, x: Fraction) -> tuple[Fraction, Fraction, Fraction]:
    factors = tuple(x - j for j in range(-cutoff, cutoff + 1))
    q = math.prod(factors)
    logarithmic = sum((1 / value for value in factors), F(0))
    square_sum = sum((1 / (value * value) for value in factors), F(0))
    derivative = q * logarithmic
    second = q * (logarithmic * logarithmic - square_sum)
    return q, derivative, second


def logarithmic_derivative(cutoff: int, x: float) -> float:
    return sum(1.0 / (x - j) for j in range(-cutoff, cutoff + 1))


def quotient_roots(cutoff: int) -> tuple[float, ...]:
    roots = []
    for k in range(1, cutoff + 1):
        left = float(k - 1) + 1.0e-12
        right = float(k) - 1.0e-12
        for _ in range(100):
            middle = (left + right) / 2.0
            if logarithmic_derivative(cutoff, middle) > 0.0:
                left = middle
            else:
                right = middle
        roots.append((left + right) / 2.0)
    return tuple(roots)


def sinc(x: float) -> float:
    if x == 0.0:
        return 1.0
    return math.sin(math.pi * x) / (math.pi * x)


class NormalizedSourceQuotientResponseBarrierTests(unittest.TestCase):
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

    def test_exact_n2_source_ground_and_spectra(self) -> None:
        source = (F(-2), F(1), F(0), F(-1), F(2))
        modes = tuple(range(-2, 3))
        for a in (F(1, 3), F(1), F(7, 2)):
            matrix = source_matrix(a)
            for row, n in enumerate(modes):
                for column, m in enumerate(modes):
                    if row != column:
                        self.assertEqual(
                            (n - m) * matrix[row][column],
                            source[row] - source[column],
                        )

            ground = (-a, a, F(1), a, -a)
            self.assertEqual(sum(ground, F(0)), F(1))
            self.assertEqual(matvec(matrix, ground), (F(0),) * 5)

            exact_eigenpairs = (
                ((F(1), F(-1), 4 * a, F(-1), F(1)), 4 * a + 1 / a),
                ((F(1), F(1), F(0), F(1), F(1)), F(20, 3) + 1 / a),
                ((F(2), F(-1), F(0), F(1), F(-2)), 1 / a),
                ((F(-1), F(-2), F(0), F(2), F(1)), F(20, 3) + 1 / a),
            )
            for vector, eigenvalue in exact_eigenpairs:
                self.assertEqual(matvec(matrix, vector), scale(vector, eigenvalue))

            odd_trace = 2 / a + F(20, 3)
            odd_determinant = (1 / a) * (F(20, 3) + 1 / a)
            self.assertEqual(odd_trace, 1 / a + (F(20, 3) + 1 / a))
            self.assertGreater(odd_determinant, 0)

            complement_eigenvalues = (1 / a, F(20, 3) + 1 / a)
            self.assertTrue(all(value > 0 for value in complement_eigenvalues))
            self.assertEqual((4 * a) * (1 / a) - 4, F(0))
            self.assertEqual(4 * a + 1 / a, sum((4 * a, 1 / a), F(0)))

    def test_scaled_uniform_gaps_real_quotient_and_profile_blowup(self) -> None:
        for a in (F(1, 5), F(1), F(5), F(100)):
            scaled_odd = (F(1), F(1) + F(20, 3) * a)
            scaled_even = (F(1) + 4 * a * a, F(1) + F(20, 3) * a)
            self.assertGreaterEqual(min(scaled_odd + scaled_even), F(1))

            at_i = F(1) + F(3, 5) * a
            self.assertEqual(
                F(1) - 6 * a * F(-1) / ((F(1) + 1) * (F(4) + 1)),
                at_i,
            )
            denominator = (F(1) - F(1, 4)) * (F(4) - F(1, 4))
            profile = F(1) - 6 * a * F(1, 4) / denominator
            polynomial_ratio = (
                F(1, 16) - (F(5) + 6 * a) * F(1, 4) + 4
            ) / denominator
            self.assertEqual(profile, polynomial_ratio)

            discriminant = (5.0 + 6.0 * float(a)) ** 2 - 16.0
            small = ((5.0 + 6.0 * float(a)) - math.sqrt(discriminant)) / 2.0
            large = ((5.0 + 6.0 * float(a)) + math.sqrt(discriminant)) / 2.0
            self.assertGreater(small, 0.0)
            self.assertLess(small, 1.0)
            self.assertGreater(large, 4.0)
            self.assertAlmostEqual(small * large, 4.0, places=10)
        self.assertGreater(F(1) + F(3, 5) * 100, 60)

    def test_favorable_source_profile_and_uniform_gap_scaling(self) -> None:
        for cutoff in range(1, 6):
            dimension = 2 * cutoff + 1
            modes = tuple(range(-cutoff, cutoff + 1))
            eta = (F(1),) * dimension
            matrix = tuple(
                tuple(
                    F(dimension * int(i == j) - 1)
                    for j in range(dimension)
                )
                for i in range(dimension)
            )
            self.assertEqual(matvec(matrix, eta), (F(0),) * dimension)
            source = tuple(F(-n) for n in modes)
            for i, n in enumerate(modes):
                for j, m in enumerate(modes):
                    if i != j:
                        self.assertEqual(
                            matrix[i][j],
                            (source[i] - source[j]) / (n - m),
                        )

            for n in range(1, cutoff + 1):
                odd = tuple(
                    F(int(mode == n) - int(mode == -n)) for mode in modes
                )
                self.assertEqual(matvec(matrix, odd), scale(odd, F(dimension)))

            ones = (F(1),) * cutoff
            even_complement = tuple(
                tuple(F(dimension * int(i == j) - 2) for j in range(cutoff))
                for i in range(cutoff)
            )
            self.assertEqual(matvec(even_complement, ones), ones)
            if cutoff > 1:
                difference = (F(1), F(-1)) + (F(0),) * (cutoff - 2)
                self.assertEqual(
                    matvec(even_complement, difference),
                    scale(difference, F(dimension)),
                )
            self.assertEqual((dimension - 1) * 1 - (dimension - 1), 0)
            self.assertEqual((dimension - 1) + 1, dimension)

            for r in (F(1, 3), F(2, 5)):
                if r in modes:
                    continue
                direct = F(1) + 2 * r * r * sum(
                    (1 / (r * r - n * n) for n in range(1, cutoff + 1)),
                    F(0),
                )
                q, derivative, _ = q_data(cutoff, r)
                self.assertEqual(direct, r * derivative / q)

    def test_bernstein_stieltjes_and_hermite_biehler_identities(self) -> None:
        cutoff = 4
        dimension = 2 * cutoff + 1
        roots = quotient_roots(cutoff)
        for k, root in enumerate(roots, 1):
            self.assertGreater(root, k - 1)
            self.assertLess(root, k)
        product = math.prod(root * root for root in roots)
        self.assertAlmostEqual(product, math.factorial(cutoff) ** 2 / dimension, places=11)

        residues = []
        for k, root in enumerate(roots):
            numerator = math.prod(n * n - root * root for n in range(1, cutoff + 1))
            denominator = math.prod(
                other * other - root * root
                for index, other in enumerate(roots)
                if index != k
            )
            residues.append(numerator / (dimension * denominator))
        self.assertTrue(all(value > 0.0 for value in residues))

        for t in (0.2, 1.0, 7.5):
            complete_bernstein = 1.0 + 2.0 * t * sum(
                1.0 / (t + n * n) for n in range(1, cutoff + 1)
            )
            stieltjes_over_t = 1.0 / t + 2.0 * sum(
                1.0 / (t + n * n) for n in range(1, cutoff + 1)
            )
            reciprocal_stieltjes = 1.0 / dimension + sum(
                residue / (t + root * root)
                for residue, root in zip(residues, roots)
            )
            self.assertAlmostEqual(complete_bernstein / t, stieltjes_over_t, places=13)
            self.assertAlmostEqual(1.0 / complete_bernstein, reciprocal_stieltjes, places=12)

        for x in (F(1, 3), F(3, 2), F(9, 2)):
            q, derivative, second = q_data(cutoff, x)
            diagonal_kernel = derivative * derivative - q * second
            square_sum_form = q * q * sum(
                (1 / ((x - j) ** 2) for j in range(-cutoff, cutoff + 1)),
                F(0),
            )
            self.assertEqual(diagonal_kernel, square_sum_form)
            self.assertGreater(diagonal_kernel, 0)

    def test_product_anchor_and_cofactor_cancellation(self) -> None:
        for cutoff in range(1, 8):
            dimension = 2 * cutoff + 1
            p = F(1, dimension)
            cofactor_at_zero = -F(2 * cutoff, dimension)
            profile_at_zero = F(1) + cofactor_at_zero
            normalized = profile_at_zero / p
            self.assertEqual(profile_at_zero, p)
            self.assertEqual(cofactor_at_zero / p, -2 * cutoff)
            self.assertEqual(normalized, F(1))
            self.assertEqual(
                normalized - 1,
                dimension * cofactor_at_zero + (dimension - 1),
            )

        for a in (F(1, 2), F(3), F(11)):
            squared_sum = F(5) + 6 * a
            squared_product = F(4)
            self.assertEqual(squared_product, F(1) * math.factorial(2) ** 2)
            self.assertGreater(squared_sum, 0)

    def test_cardinal_continuation_and_exact_grid_failure(self) -> None:
        cutoff = 5
        length = 16.0
        root_length = math.sqrt(length)
        for j in range(-cutoff, cutoff + 1):
            cardinal = root_length * sum(
                ((-1) ** k) * sinc(float(j - k))
                for k in range(-cutoff, cutoff + 1)
            )
            self.assertAlmostEqual(cardinal, root_length * ((-1) ** j), places=12)
            kernel = root_length if j == 0 else 0.0
            response = kernel - cardinal
            if j == 0:
                self.assertAlmostEqual(response, 0.0, places=12)
            else:
                self.assertAlmostEqual(response, -root_length * ((-1) ** j), places=12)

        r = 0.37
        logarithmic = sum(1.0 / (r - j) for j in range(-cutoff, cutoff + 1))
        meromorphic = root_length / math.pi * math.sin(math.pi * r) * logarithmic
        cardinal = root_length * sum(
            ((-1) ** j) * sinc(r - j) for j in range(-cutoff, cutoff + 1)
        )
        self.assertAlmostEqual(meromorphic, cardinal, places=13)

    def test_fixed_strict_strip_growth(self) -> None:
        y = 0.2
        response_ratios = []
        continuation_errors = []
        for length in (40, 80, 160):
            cutoff = length * length
            r = 1j * y * length / (2.0 * math.pi)
            logarithmic = 1.0 / r + sum(
                2.0 * r / (r * r - n * n) for n in range(1, cutoff + 1)
            )
            continuation = (
                math.sqrt(length) / math.pi * cmath.sin(math.pi * r) * logarithmic
            )
            kernel = 2.0 * cmath.sin(1j * y * length / 2.0) / (
                1j * y * math.sqrt(length)
            )
            response = kernel - continuation
            leading = math.sqrt(length) * math.cosh(y * length / 2.0)
            response_ratios.append(abs(response) / leading)
            continuation_errors.append(abs(continuation - leading) / leading)

        self.assertEqual(response_ratios, sorted(response_ratios))
        self.assertGreater(response_ratios[-1], 0.93)
        self.assertEqual(continuation_errors, sorted(continuation_errors, reverse=True))
        self.assertLess(continuation_errors[-1], 2.0e-4)

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

    def test_static_hygiene_ast_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))

        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))

        required = (
            "uniform-gap counterfamily",
            "The two checkpoint-1.28 admitted pairs fix",
            "complete Bernstein function",
            "Hermite--Biehler",
            "compact strict-strip bound",
            "Discarding the constant",
            "No actual-arithmetic failure claim is made",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

        lowered = self.text.lower()
        forbidden = (
            "the actual arithmetic family fails",
            "the actual strict signs fail",
            "the riemann hypothesis is proved",
            "actual response divergence is proved",
            "real-rootedness implies a uniform bound",
            "checkpoint-1.28 candidates",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
