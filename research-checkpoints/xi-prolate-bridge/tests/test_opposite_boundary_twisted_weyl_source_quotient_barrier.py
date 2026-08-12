#!/usr/bin/env python3
"""Regressions for the opposite-boundary twisted-Weyl barrier."""

from __future__ import annotations

import ast
from fractions import Fraction
import hashlib
from itertools import combinations
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "OPPOSITE_BOUNDARY_TWISTED_WEYL_SOURCE_QUOTIENT_BARRIER.md"
NOTE_HASH = "a6b21ec0048f632d67ff32f116291e011f66b5c1a168df12442cac19d33c2258"

FROZEN = {
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md":
        "d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0",
    "tests/test_source_boundary.py":
        "a4be31e74a735c8f9150ed84cc4dc8c147e654364b65ec5cb3b814500e7ff808",
    "notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md":
        "9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13",
    "tests/test_source_quotient_pick_herglotz_interlacing_barrier.py":
        "86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658",
    "notes/CAPTURE_FREE_ACTUAL_GROUND_PARITY_RESPONSE_BARRIER.md":
        "ec53e8c99f639bdae46a8da6d55c4e34b8381b3348f62833cd2ac1d1bb8dbbf3",
    "tests/test_capture_free_actual_ground_parity_response_barrier.py":
        "477c7849bf319a62c6d483874d29c638250060ee0e9db844ae1477455f380772",
    "notes/ACTUAL_GROUND_FIXED_MODE_RESIDUE_SIGN_BARRIER.md":
        "3a64146e1f3836b9dd07ae55a1955e7d66cd35ad72f58d4ce116c18b16cddcce",
    "tests/test_actual_ground_fixed_mode_residue_sign_barrier.py":
        "5ea8d73b2641f6fe31e494bcd4ab0e524940bc7575d6c5b8a784e7e415201216",
    "notes/NORMALIZED_SOURCE_QUOTIENT_RESPONSE_BARRIER.md":
        "a21be420fa1696cceffdaf653e083e848addd9ca13b3ad0b0f930476916271f2",
    "tests/test_normalized_source_quotient_response_barrier.py":
        "8bafeff220c3193e9dcd5b511db011e3df565fe1b773878f88f435be687f7026",
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


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(matrix[j][i] for j in range(len(matrix))) for i in range(len(matrix[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = transpose(right)
    return tuple(
        tuple(sum((x * y for x, y in zip(row, column)), F(0)) for column in right_t)
        for row in left
    )


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def determinant(matrix: Matrix) -> Fraction:
    work = [list(row) for row in matrix]
    result = F(1)
    for column in range(len(work)):
        pivot = next((row for row in range(column, len(work)) if work[row][column]), None)
        if pivot is None:
            return F(0)
        if pivot != column:
            work[pivot], work[column] = work[column], work[pivot]
            result = -result
        value = work[column][column]
        result *= value
        for row in range(column + 1, len(work)):
            ratio = work[row][column] / value
            for entry in range(column, len(work)):
                work[row][entry] -= ratio * work[column][entry]
    return result


def diagonal(values: Vector) -> Matrix:
    return tuple(
        tuple(value if i == j else F(0) for j in range(len(values)))
        for i, value in enumerate(values)
    )


def source_matrix(parameter: Fraction) -> Matrix:
    modes = tuple(range(-2, 3))
    source = (F(-2), F(1), F(0), F(-1), F(2))
    diagonal_values = (
        1 / parameter + F(7, 3),
        1 / parameter + F(13, 3),
        4 * parameter,
        1 / parameter + F(13, 3),
        1 / parameter + F(7, 3),
    )
    return tuple(
        tuple(
            diagonal_values[i]
            if i == j
            else (source[i] - source[j]) / (modes[i] - modes[j])
            for j in range(5)
        )
        for i in range(5)
    )


def target_matrix(a: Fraction, b: Fraction) -> Matrix:
    modes = tuple(range(-2, 3))
    source = (2 * b, -b, F(0), b, -2 * b)
    diagonal_values = (
        b / a - F(7, 3) * b,
        b / a - F(13, 3) * b,
        4 * a * b,
        b / a - F(13, 3) * b,
        b / a - F(7, 3) * b,
    )
    return tuple(
        tuple(
            diagonal_values[i]
            if i == j
            else (source[i] - source[j]) / (modes[i] - modes[j])
            for j in range(5)
        )
        for i in range(5)
    )


class OppositeBoundaryTwistedWeylSourceQuotientBarrierTests(unittest.TestCase):
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

    def test_midpoint_sampling_residues_and_fixed_prefix_quantifier(self) -> None:
        cutoff = 4
        modes = tuple(range(-cutoff, cutoff + 1))
        alternate = tuple(F(-1 if n % 2 else 1) for n in modes)
        coefficients = tuple(F(n * n + 1, 17) for n in modes)
        midpoint_pairing = sum((e * x for e, x in zip(alternate, coefficients)), F(0))
        self.assertEqual(
            midpoint_pairing,
            sum((alternate[n + cutoff] * coefficients[n + cutoff] for n in modes), F(0)),
        )
        self.assertEqual(sum(value * value for value in alternate), 2 * cutoff + 1)

        weights = tuple(e * x for e, x in zip(alternate, coefficients))
        residues = tuple(-value for value in weights)
        self.assertEqual(residues, tuple(-e * x for e, x in zip(alternate, coefficients)))

        # A fixed-prefix statement leaves the moving tail completely free.
        prefix = (F(1), F(1), F(1))
        positive_tail = prefix + (F(10),)
        negative_tail = prefix + (F(-10),)
        self.assertTrue(all(value > 0 for value in prefix))
        self.assertNotEqual(sum(positive_tail), sum(negative_tail))
        self.assertTrue(any(value < 0 for value in negative_tail))

    def test_alternate_characteristic_and_metric_defect(self) -> None:
        modes = tuple(F(n) for n in range(-2, 3))
        eta = (F(1),) * 5
        alternate = (F(1), F(-1), F(1), F(-1), F(1))
        ground = tuple(F(1, 5) for _ in modes)
        source = tuple(-n / 5 for n in modes)
        matrix = tuple(
            tuple(F(int(i == j)) - F(1, 5) for j in range(5))
            for i in range(5)
        )
        mode_matrix = diagonal(modes)
        a = sum((e * x for e, x in zip(alternate, ground)), F(0))
        self.assertEqual(a, F(1, 5))

        d_ground = tuple(n * x for n, x in zip(modes, ground))
        quotient = subtract(mode_matrix, tuple(
            tuple(d_ground[i] * alternate[j] / a for j in range(5))
            for i in range(5)
        ))
        left = subtract(matmul(matrix, quotient), matmul(transpose(quotient), matrix))
        defect_vector = tuple(e / a - one for e, one in zip(alternate, eta))
        right = subtract(outer(source, defect_vector), outer(defect_vector, source))
        self.assertEqual(left, right)
        self.assertNotEqual(left, tuple((F(0),) * 5 for _ in range(5)))

        for s in (F(1, 3), F(3, 2), F(5, 2)):
            shifted = subtract(quotient, diagonal((s,) * 5))
            b_value = math.prod((n - s for n in modes), start=F(1))
            g_value = sum((e * x / (n - s) for e, x, n in zip(alternate, ground, modes)), F(0))
            self.assertEqual(determinant(shifted), -s * b_value * g_value / a)

        # A zero twisted weight leaves a lattice eigenvalue that is not a zero of g.
        cancellation_source = (F(4), F(17), F(0), F(-17), F(-4))
        cancellation_matrix = (
            (F(10), F(13), F(-2), F(-7), F(-2)),
            (F(13), F(68), F(-17), F(-17), F(-7)),
            (F(-2), F(-17), F(34, 3), F(-17), F(-2)),
            (F(-7), F(-17), F(-17), F(68), F(13)),
            (F(-2), F(-7), F(-2), F(13), F(10)),
        )
        cancellation_ground = (F(0), F(1, 5), F(3, 5), F(1, 5), F(0))
        for i, n in enumerate(modes):
            for j, m in enumerate(modes):
                if i != j:
                    self.assertEqual(
                        (n - m) * cancellation_matrix[i][j],
                        cancellation_source[i] - cancellation_source[j],
                    )
        self.assertEqual(matvec(cancellation_matrix, cancellation_ground), (F(0),) * 5)
        self.assertEqual(sum(cancellation_ground, F(0)), F(1))
        cancellation_a = sum(
            (e * x for e, x in zip(alternate, cancellation_ground)), F(0)
        )
        self.assertEqual(cancellation_a, F(1, 5))

        for size in range(1, 6):
            for indices in combinations(range(5), size):
                principal = tuple(
                    tuple(cancellation_matrix[i][j] for j in indices)
                    for i in indices
                )
                self.assertGreaterEqual(determinant(principal), 0)
        indices = (0, 1, 3, 4)
        self.assertEqual(
            determinant(tuple(
                tuple(cancellation_matrix[i][j] for j in indices)
                for i in indices
            )),
            F(230640),
        )

        cancellation_weights = tuple(
            e * x for e, x in zip(alternate, cancellation_ground)
        )
        self.assertEqual(cancellation_weights[-1], F(0))
        g_at_two = sum(
            (
                weight / (n - 2)
                for n, weight in zip(modes, cancellation_weights)
                if n != 2
            ),
            F(0),
        )
        self.assertEqual(g_at_two, F(-1, 30))

        cancellation_d_ground = tuple(
            n * x for n, x in zip(modes, cancellation_ground)
        )
        cancellation_quotient = subtract(mode_matrix, tuple(
            tuple(cancellation_d_ground[i] * alternate[j] / cancellation_a for j in range(5))
            for i in range(5)
        ))
        self.assertEqual(
            determinant(subtract(cancellation_quotient, diagonal((F(2),) * 5))),
            F(0),
        )

    def test_source_boundary_replacement_and_diagonal_gauge_fail(self) -> None:
        modes = tuple(range(-3, 4))
        alternate = tuple((-1) ** n for n in modes)
        source = tuple(F(-n, 7) for n in modes)
        gamma0 = F(11, 13)
        gamma = tuple(b + e * gamma0 for b, e in zip(source, alternate))
        failures = []
        for i, n in enumerate(modes):
            for j, m in enumerate(modes):
                if i != j:
                    failures.append(
                        source[i] - source[j]
                        != gamma[i] * alternate[j] - alternate[i] * gamma[j]
                    )
        self.assertTrue(any(failures))

        coefficients = tuple(F(n * n + 2, 31) for n in modes)
        s = complex(0.2, 0.7)
        original = sum(float(x) / (n - s) for x, n in zip(coefficients, modes))
        twisted_both = sum(
            float(e * e * x) / (n - s)
            for e, x, n in zip(alternate, coefficients, modes)
        )
        twisted_once = sum(
            float(e * x) / (n - s)
            for e, x, n in zip(alternate, coefficients, modes)
        )
        self.assertAlmostEqual(original.real, twisted_both.real, places=14)
        self.assertAlmostEqual(original.imag, twisted_both.imag, places=14)
        self.assertGreater(abs(original - twisted_once), 1.0e-3)

    def test_exact_strict_sign_midpoint_annihilator(self) -> None:
        parameter = F(1, 4)
        matrix = source_matrix(parameter)
        ground = (-parameter, parameter, F(1), parameter, -parameter)
        eta = (F(1),) * 5
        alternate = (F(1), F(-1), F(1), F(-1), F(1))
        self.assertEqual(matvec(matrix, ground), (F(0),) * 5)
        self.assertEqual(sum(ground, F(0)), F(1))
        self.assertEqual(sum((e * x for e, x in zip(alternate, ground)), F(0)), F(0))

        eigenpairs = (
            ((F(1), F(-1), F(1), F(-1), F(1)), F(5)),
            ((F(1), F(1), F(0), F(1), F(1)), F(32, 3)),
            ((F(2), F(-1), F(0), F(1), F(-2)), F(4)),
            ((F(-1), F(-2), F(0), F(2), F(1)), F(32, 3)),
        )
        for vector, eigenvalue in eigenpairs:
            self.assertEqual(matvec(matrix, vector), tuple(eigenvalue * value for value in vector))
        self.assertEqual(min(value / 4 for value in (F(5), F(32, 3), F(4))), F(1))

        for s in (F(1, 3), F(3, 2), F(5, 2)):
            q = s * (s * s - 1) * (s * s - 4)
            g = sum((e * x / (n - s) for n, e, x in zip(range(-2, 3), alternate, ground)), F(0))
            self.assertEqual(q * g, F(5, 2) * s * s - 4)

    def test_favorable_t2_alternate_quotient_has_no_real_roots(self) -> None:
        for s in (F(1, 3), F(3, 2), F(5, 2)):
            q = s * (s * s - 1) * (s * s - 4)
            weights = (F(1, 5), F(-1, 5), F(1, 5), F(-1, 5), F(1, 5))
            g = sum((weight / (n - s) for n, weight in zip(range(-2, 3), weights)), F(0))
            self.assertEqual(q * g, -(s ** 4 + s * s + 4) / 5)
        discriminant = 1 - 16
        self.assertLess(discriminant, 0)
        self.assertTrue(all(x ** 4 + x * x + 4 > 0 for x in (-10, -1, 0, 1, 10)))

    def test_global_cone_root_signs_and_target_compatible_n2(self) -> None:
        a = F(1, 10)
        b = F(3, 2)
        ground = (a, -a, F(1), -a, a)
        matrix = target_matrix(a, b)
        self.assertEqual(matvec(matrix, ground), (F(0),) * 5)
        weights = tuple(F((-1) ** n) * x for n, x in zip(range(-2, 3), ground))
        self.assertTrue(all(value > 0 for value in weights))

        complement = (b / a, b * (1 / a - F(20, 3)))
        odd_determinant = b * b / a * (1 / a - F(20, 3))
        odd_trace = b * (2 / a - F(20, 3))
        self.assertTrue(all(value > 0 for value in complement))
        self.assertGreater(odd_determinant, 0)
        self.assertGreater(odd_trace, 0)
        self.assertEqual((4 * a * b) * (b / a) - (2 * b) ** 2, F(0))

        at_i = F(1) - F(3, 5) * a
        self.assertEqual(
            F(1) + 6 * a * F(-1) / ((F(1) + 1) * (F(4) + 1)),
            at_i,
        )
        self.assertGreater(at_i, 0)

        # P=q*h has one constant sign at all five lattice nodes.
        def q_prime_at(node: int) -> int:
            return math.prod(node - other for other in range(-2, 3) if other != node)

        p_values = tuple(-x * q_prime_at(n) for n, x in zip(range(-2, 3), ground))
        self.assertTrue(all(value < 0 for value in p_values))

        squared_sum = F(5) - 6 * a
        squared_product = F(4)
        discriminant = squared_sum * squared_sum - 4 * squared_product
        self.assertGreater(discriminant, 0)
        small = (float(squared_sum) - math.sqrt(float(discriminant))) / 2
        large = (float(squared_sum) + math.sqrt(float(discriminant))) / 2
        self.assertGreater(small, 1.0)
        self.assertLess(large, 4.0)

    def test_matrix_weyl_atoms_and_mass_anchor_stopping_line(self) -> None:
        weights = (F(2), F(5), F(1), F(4))
        signs = (F(1), F(-1), F(1), F(-1))
        coefficients = tuple(sign * weight for sign, weight in zip(signs, weights))
        for sign, coefficient, weight in zip(signs, coefficients, weights):
            atom = ((F(1), weight), (weight, coefficient * coefficient))
            self.assertEqual(determinant(atom), F(0))
            self.assertGreater(atom[0][0] + atom[1][1], 0)

        t = F(3, 2)
        positive_side = weights[0] + 2 * t * t * sum(
            (weight / (n * n + t * t) for n, weight in enumerate(weights[1:], 1)),
            F(0),
        )
        signed_side = coefficients[0] + 2 * t * t * sum(
            (coefficient / (n * n + t * t) for n, coefficient in enumerate(coefficients[1:], 1)),
            F(0),
        )
        total_mass = weights[0] + 2 * sum(weights[1:], F(0))
        self.assertLessEqual(abs(signed_side), positive_side)
        self.assertLessEqual(positive_side, total_mass)

        # The same positive weights permit arbitrarily small independent anchor pairing.
        phi = tuple(sign * weight for sign, weight in zip(signs, weights))
        kappa = (F(1), F(1), F(-1), F(-1))
        pairing = sum((x * y for x, y in zip(phi, kappa)), F(0))
        self.assertNotEqual(pairing, total_mass)

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
            "midpoint Riesz vector",
            "fixed-prefix conclusion",
            "not a self-adjoint quotient theorem",
            "zero-weight lattice modes",
            "g(2)=-{1\\over30}",
            "cannot simply replace `eta` by `e`",
            "both checkpoint strict signs hold",
            "no real zero",
            "even number of roots",
            "Cauchy--Schwarz",
            "source identity bounds `a/|p_mu|`",
            "P0_INVALIDATED",
            "eight are unchanged",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

        lowered = self.text.lower()
        forbidden = (
            "the actual global twisted cone fails",
            "the actual strict signs fail",
            "actual response divergence is proved",
            "the riemann hypothesis is proved",
            "fixed-prefix alternation makes the full g herglotz",
            "standard eight are updated",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
