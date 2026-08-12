#!/usr/bin/env python3
"""Regressions for the source-quotient Pick/Herglotz barrier."""

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
NOTE = ROOT / "notes" / "SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md"
NOTE_HASH = "9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13"

FROZEN = {
    "notes/CAPTURE_FREE_ACTUAL_GROUND_PARITY_RESPONSE_BARRIER.md":
        "ec53e8c99f639bdae46a8da6d55c4e34b8381b3348f62833cd2ac1d1bb8dbbf3",
    "tests/test_capture_free_actual_ground_parity_response_barrier.py":
        "477c7849bf319a62c6d483874d29c638250060ee0e9db844ae1477455f380772",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md":
        "d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0",
    "notes/DETERMINANT_LIMIT_AUDIT.md":
        "1a77a7b6e7b9573c0f9f6656481af24962280959d867177fa232e8f2cfa006b0",
    "tests/test_determinant_bridge.py":
        "d2fee5eb81291b8dbd2bb2e229a89c52cf36704f76d0873f4cdf4e505bb2c69d",
    "notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md":
        "1c4568a142779f0d7cab023bfb41811d10c2ccac37a505cbe7f079b972761755",
    "notes/PARITY_PENCIL_TRACE_REDUCTION.md":
        "4840232a94c75021ff60b08b89ccb0e4be240d54b9a5e4a550353e7049ed260b",
    "notes/EVEN_GROUND_COEFFICIENT_CONE_AUDIT.md":
        "8599690f41785c7317c2f3627ef992dba4f3b1576e2fa3ce0ab6e204514ecc94",
}

F = Fraction
Matrix = tuple[tuple[Fraction, ...], ...]
Vector = tuple[Fraction, ...]

MODES = (-2, -1, 0, 1, 2)
SOURCE_B = (F(-2), F(1), F(0), F(-1), F(2))
DIAGONAL = (F(10, 3), F(16, 3), F(4), F(16, 3), F(10, 3))
XI = (F(-1), F(1), F(1), F(1), F(-1))
ETA = (F(1),) * 5
KAPPA = (F(0), F(0), F(1), F(0), F(0))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    )


def dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), F(0))


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum(
                (left[i][k] * right[k][j] for k in range(len(right))),
                F(0),
            )
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def source_matrix() -> Matrix:
    rows = []
    for row, n in enumerate(MODES):
        values = []
        for column, m in enumerate(MODES):
            if n == m:
                values.append(DIAGONAL[row])
            else:
                values.append((SOURCE_B[row] - SOURCE_B[column]) / (n - m))
        rows.append(tuple(values))
    return tuple(rows)


Q = source_matrix()
D: Matrix = tuple(
    tuple(F(mode) if i == j else F(0) for j in range(5))
    for i, mode in enumerate(MODES)
)


def h_value(s: complex) -> complex:
    return sum(float(coefficient) / (mode - s) for mode, coefficient in zip(MODES, XI))


def h_fraction(s: Fraction) -> Fraction:
    return sum((coefficient / (mode - s) for mode, coefficient in zip(MODES, XI)), F(0))


def determinant_d_minus_s(s: Fraction) -> Fraction:
    value = F(1)
    for mode in MODES:
        value *= mode - s
    return value


def polynomial_p(s: Fraction) -> Fraction:
    return s**4 - 11 * s**2 + 4


def profile(r: Fraction) -> Fraction:
    return F(1) - F(2) / (1 - r * r) + F(8) / (4 - r * r)


class SourceQuotientPickHerglotzInterlacingBarrierTests(unittest.TestCase):
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

    def test_exact_source_cauchy_displacement_and_ground(self) -> None:
        expected: Matrix = (
            (F(10, 3), F(3), F(1), F(1, 3), F(1)),
            (F(3), F(16, 3), F(-1), F(-1), F(1, 3)),
            (F(1), F(-1), F(4), F(-1), F(1)),
            (F(1, 3), F(-1), F(-1), F(16, 3), F(3)),
            (F(1), F(1, 3), F(1), F(3), F(10, 3)),
        )
        self.assertEqual(Q, expected)
        self.assertEqual(
            subtract(matmul(D, Q), matmul(Q, D)),
            subtract(outer(SOURCE_B, ETA), outer(ETA, SOURCE_B)),
        )
        self.assertEqual(matvec(Q, XI), (F(0),) * 5)
        self.assertEqual(dot(ETA, XI), F(1))

        d_xi = tuple(F(mode) * value for mode, value in zip(MODES, XI))
        self.assertEqual(d_xi, tuple(-value for value in SOURCE_B))
        self.assertEqual(matvec(Q, d_xi), d_xi)
        self.assertEqual(matvec(Q, d_xi), tuple(-value for value in SOURCE_B))

    def test_parity_spectra_and_both_strict_ritz_signs(self) -> None:
        eigenpairs = (
            (F(0), XI),
            (F(5), (F(1), F(-1), F(4), F(-1), F(1))),
            (F(23, 3), (F(1), F(1), F(0), F(1), F(1))),
            (F(1), (F(2), F(-1), F(0), F(1), F(-2))),
            (F(23, 3), (F(-1), F(-2), F(0), F(2), F(1))),
        )
        for eigenvalue, vector in eigenpairs:
            self.assertEqual(
                matvec(Q, vector),
                tuple(eigenvalue * value for value in vector),
            )

        # The even complement block in the normalized parity basis.
        complement: Matrix = ((F(13, 3), F(10, 3)), (F(10, 3), F(13, 3)))
        self.assertEqual(complement[0][0] + complement[0][1], F(23, 3))
        self.assertEqual(complement[0][0] - complement[0][1], F(1))

        # w=(-e_1^++e_2^+)/sqrt(2) has rational source coordinates.
        w = (F(1, 2), F(-1, 2), F(0), F(-1, 2), F(1, 2))
        self.assertEqual(dot(w, w), F(1))
        ritz: Matrix = (
            (dot(KAPPA, matvec(Q, KAPPA)), dot(KAPPA, matvec(Q, w))),
            (dot(w, matvec(Q, KAPPA)), dot(w, matvec(Q, w))),
        )
        self.assertEqual(ritz, ((F(4), F(2)), (F(2), F(1))))
        self.assertEqual(ritz[0][0] * ritz[1][1] - ritz[0][1] ** 2, F(0))
        self.assertEqual(ritz[0][0] + ritz[1][1], F(5))

        # The exact odd block has eigenvalues 1 and 23/3.
        odd: Matrix = ((F(19, 3), F(8, 3)), (F(8, 3), F(7, 3)))
        self.assertEqual(odd[0][0] + odd[1][1], F(26, 3))
        self.assertEqual(odd[0][0] * odd[1][1] - odd[0][1] ** 2, F(23, 3))
        self.assertGreater(F(1), 0)
        self.assertGreater(F(23, 3), 0)

    def test_real_quotient_polynomial_is_not_lattice_interlacing(self) -> None:
        for s in (F(-7, 3), F(-3, 2), F(-1, 2), F(2, 3), F(5, 2)):
            self.assertEqual(determinant_d_minus_s(s) * h_fraction(s), polynomial_p(s))

            pencil = (
                (F(13, 3) - s * s * F(19, 3), F(20, 3) - s * s * F(8, 3)),
                (F(20, 3) - s * s * F(8, 3), F(52, 3) - s * s * F(7, 3)),
            )
            pencil_determinant = pencil[0][0] * pencil[1][1] - pencil[0][1] ** 2
            self.assertEqual(pencil_determinant, F(23, 3) * polynomial_p(s))

        discriminant = 11**2 - 4 * 4
        self.assertEqual(discriminant, 105)
        self.assertGreater(11 - math.sqrt(discriminant), 0)
        self.assertLess((11 - math.sqrt(discriminant)) / 2, 1)
        self.assertGreater((11 + math.sqrt(discriminant)) / 2, 4)
        self.assertEqual(polynomial_p(F(0)), F(4))
        self.assertEqual(polynomial_p(F(1)), F(-6))
        self.assertEqual(polynomial_p(F(2)), F(-24))

        residues = tuple(-value for value in XI)
        self.assertEqual(residues, (F(1), F(-1), F(-1), F(-1), F(1)))
        self.assertTrue(any(value > 0 for value in residues))
        self.assertTrue(any(value < 0 for value in residues))

    def test_pick_sign_changes_and_generalized_kernel(self) -> None:
        epsilon = 1.0e-5
        self.assertGreater(h_value(1j * epsilon).imag, 0)
        self.assertLess(h_value(2 + 1j * epsilon).imag, 0)

        z = 0.25 + 0.7j
        w = -0.4 + 0.5j
        kernel = (h_value(z) - h_value(w).conjugate()) / (z - w.conjugate())
        expanded = sum(
            float(coefficient)
            / ((mode - z) * (mode - w.conjugate()))
            for mode, coefficient in zip(MODES, XI)
        )
        self.assertAlmostEqual(kernel, expanded)
        self.assertEqual(sum(value < 0 for value in XI), 2)

    def test_odd_profile_has_opposite_residues_and_mixed_stieltjes_atoms(self) -> None:
        for r in (F(1, 3), F(3, 2), F(7, 3), F(-5, 3)):
            self.assertEqual(profile(r), -r * h_fraction(r))
            denominator = (1 - r * r) * (4 - r * r)
            self.assertEqual(profile(r) * denominator, polynomial_p(r))

        coefficient_by_mode = dict(zip(MODES, XI))
        profile_residues = tuple(
            F(pole) * coefficient_by_mode[pole]
            for pole in (-2, -1, 1, 2)
        )
        self.assertEqual(profile_residues, (F(2), F(-1), F(1), F(-2)))
        stieltjes_atoms = tuple(
            -2 * F(mode * mode) * coefficient_by_mode[mode]
            for mode in (1, 2)
        )
        self.assertTrue(any(value < 0 for value in stieltjes_atoms))
        self.assertTrue(any(value > 0 for value in stieltjes_atoms))

        def f(t: Fraction) -> Fraction:
            return F(1) - F(2) / (1 + t) + F(8) / (4 + t)

        def derivative(t: Fraction) -> Fraction:
            return F(2) / (1 + t) ** 2 - F(8) / (4 + t) ** 2

        for t in (F(0), F(1), F(2), F(7), F(100)):
            self.assertEqual(f(t), (t * t + 11 * t + 4) / ((t + 1) * (t + 4)))
            self.assertGreater(f(t), 0)
        self.assertGreater(derivative(F(0)), 0)
        self.assertEqual(derivative(F(2)), 0)
        self.assertLess(derivative(F(3)), 0)

    def test_favorable_hyperplane_projection_family_still_has_no_compensation(self) -> None:
        for cutoff in (1, 2, 5):
            modes = tuple(range(-cutoff, cutoff + 1))
            dimension = 2 * cutoff + 1
            xi = tuple(F(1, dimension) for _ in modes)
            matrix: Matrix = tuple(
                tuple(F(int(i == j)) - F(1, dimension) for j in range(dimension))
                for i in range(dimension)
            )
            source_b = tuple(-F(mode, dimension) for mode in modes)
            eta = (F(1),) * dimension
            self.assertEqual(matvec(matrix, eta), (F(0),) * dimension)
            self.assertEqual(sum(xi, F(0)), F(1))
            self.assertTrue(all(value > 0 for value in xi))
            self.assertEqual(xi[cutoff], F(1, dimension))
            for row, n in enumerate(modes):
                for column, m in enumerate(modes):
                    if n != m:
                        self.assertEqual(
                            matrix[row][column],
                            (source_b[row] - source_b[column]) / (n - m),
                        )
            self.assertEqual(F(1) - F(dimension - 1, dimension), F(1, dimension))
            self.assertGreater(F(1, dimension), 0)

            def imaginary_profile(t: Fraction) -> Fraction:
                total = sum(
                    (F(1) / (n * n + t) for n in range(1, cutoff + 1)),
                    F(0),
                )
                return (F(1) + 2 * t * total) / dimension

            lower = imaginary_profile(F(1))
            upper = imaginary_profile(F(4))
            self.assertGreater(lower, 0)
            self.assertLess(lower, upper)
            self.assertLess(lower / upper, 1)

    def test_scope_required_formulas_and_fail_closed_wording(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            "Pick--Herglotz rational function if and only if",
            r"\mathcal A_\mu(r)=-r h(r)",
            r"\operatorname {Res}_{r=n}\mathcal A_\mu(r)=n\xi_n",
            "generalized Nevanlinna--Pontryagin structure",
            "not an orthogonal compression",
            r"s^4-11s^2+4",
            "Both checkpoint-1.25 strict Ritz signs hold exactly",
            "Hermite--Biehler",
            "forced exponential compensation",
            "failure of an actual arithmetic matrix",
            "no response decay or nondecay for the actual ground",
            "no Riemann-hypothesis conclusion",
            "P0_INVALIDATED",
            "standard eight are unchanged",
            "No estimate for either quantity is proved here",
        )
        for token in required:
            self.assertIn(token, normalized)
        self.assertNotIn("This theorem proves RH", normalized)
        self.assertNotIn("the actual matrix fails", normalized)

    def test_displayed_tex_static_hygiene_and_test_ast(self) -> None:
        self.assertNotIn("\t", self.text)
        self.assertNotIn("\r", self.text)
        self.assertTrue(all(ord(character) < 128 for character in self.text))
        self.assertFalse(
            any(line.endswith((" ", "\t")) for line in self.text.splitlines())
        )

        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for display in displays:
            self.assertNotIn("$", display)
            self.assertEqual(display.count("{"), display.count("}"))
            self.assertEqual(display.count(r"\begin"), display.count(r"\end"))

        source = Path(__file__).read_text(encoding="ascii")
        ast.parse(source)
        self.assertNotIn("\r", source)
        self.assertFalse(
            any(line.endswith((" ", "\t")) for line in source.splitlines())
        )

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            tex = Path(temporary) / "note.tex"
            tex.write_text(document, encoding="ascii")
            completed = subprocess.run(
                [pdflatex, "-halt-on-error", "-interaction=nonstopmode", tex.name],
                cwd=temporary,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
        self.assertEqual(completed.returncode, 0, completed.stdout)


if __name__ == "__main__":
    unittest.main()
