#!/usr/bin/env python3
"""Regressions for the capture-free actual-ground parity response barrier."""

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
NOTE = ROOT / "notes" / "CAPTURE_FREE_ACTUAL_GROUND_PARITY_RESPONSE_BARRIER.md"
NOTE_HASH = "ec53e8c99f639bdae46a8da6d55c4e34b8381b3348f62833cd2ac1d1bb8dbbf3"

FROZEN = {
    "notes/LOWER_RITZ_DANGEROUS_RESPONSE_ARITHMETIC_KREIN_RH_GATE_THEOREM.md":
        "f0fd4065d6f1bafe8c119f5fcd3efe963e0da70cfe4871d3a26338f2016e2d1e",
    "tests/test_lower_ritz_dangerous_response_arithmetic_krein_rh_gate_theorem.py":
        "c9ee7fee05841b7831f9dfd3a6d5bb0bdd3431696e9122203c34e9ee9d041773",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md":
        "d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0",
    "notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md":
        "81bc4055b644a409c10d9d06f145040e822452dc5fc9a0fc4888c63fb535f3ab",
    "tests/test_relative_odd_gap_endpoint_schur.py":
        "cee76e8a21c3406b49bd123832a4e47bacd41ebf16622cf91c69fd48ba130127",
    "notes/DETERMINANT_LIMIT_AUDIT.md":
        "1a77a7b6e7b9573c0f9f6656481af24962280959d867177fa232e8f2cfa006b0",
    "notes/CAUCHY_GROUND_RESPONSE_WINDOW_REDUCTION.md":
        "0cbf4c438f1f06ab0d972fed3ba6d1464aef2aa9888e9dc3a6aeee548e66ee4c",
    "tests/test_cauchy_ground_response_window_reduction.py":
        "bee2696c54155e2458238aac68f75c8e6dacbba173704dafeb70d8ae4df87ffd",
    "notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md":
        "1c4568a142779f0d7cab023bfb41811d10c2ccac37a505cbe7f079b972761755",
    "notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md":
        "eaefd8dc51bbf4427fec21b559fbe6121403c8a98e5e79ccd4866e6d1d0e9923",
    "notes/HIGHER_DERIVATIVE_BOUNDARY_KRYLOV_NO_GO.md":
        "0133e6add806d1a4abdc40a6b6d8982c73054b07f22e637f214f557c31e3f700",
    "tests/test_higher_derivative_boundary_krylov.py":
        "1b5899217518f0918a9db7c83130d48c4b2e4276adbdb51ef4858be652af020e",
}

F = Fraction
Matrix = tuple[tuple[Fraction, ...], ...]
Vector = tuple[Fraction, ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def identity(size: int) -> Matrix:
    return tuple(
        tuple(F(int(i == j)) for j in range(size))
        for i in range(size)
    )


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
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


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    )


def add_vectors(left: Vector, right: Vector) -> Vector:
    return tuple(x + y for x, y in zip(left, right))


def scale_vector(scalar: Fraction, vector: Vector) -> Vector:
    return tuple(scalar * value for value in vector)


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def shift(matrix: Matrix, scalar: Fraction) -> Matrix:
    return subtract(
        matrix,
        tuple(
            tuple(scalar * value for value in row)
            for row in identity(len(matrix))
        ),
    )


def outer(column: Vector, row: Vector) -> Matrix:
    return tuple(tuple(x * y for y in row) for x in column)


def determinant(matrix: Matrix) -> Fraction:
    size = len(matrix)
    if size == 0:
        return F(1)
    work = [list(row) for row in matrix]
    value = F(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column]),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            value = -value
        pivot_value = work[column][column]
        value *= pivot_value
        for row in range(column + 1, size):
            factor = work[row][column] / pivot_value
            for entry in range(column, size):
                work[row][entry] -= factor * work[column][entry]
    return value


def minor(matrix: Matrix, row: int, column: int) -> Matrix:
    return tuple(
        tuple(
            value
            for j, value in enumerate(source_row)
            if j != column
        )
        for i, source_row in enumerate(matrix)
        if i != row
    )


def adjugate(matrix: Matrix) -> Matrix:
    size = len(matrix)
    cofactors = tuple(
        tuple(
            (-1) ** (i + j) * determinant(minor(matrix, i, j))
            for j in range(size)
        )
        for i in range(size)
    )
    return transpose(cofactors)


def inverse(matrix: Matrix) -> Matrix:
    det = determinant(matrix)
    if det == 0:
        raise ValueError("singular matrix")
    return tuple(
        tuple(value / det for value in row)
        for row in adjugate(matrix)
    )


def row_times_matrix(row: Vector, matrix: Matrix) -> Vector:
    return tuple(
        sum((row[i] * matrix[i][j] for i in range(len(row))), F(0))
        for j in range(len(matrix[0]))
    )


def dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), F(0))


# Exact N=2 positive source-Cauchy model in unnormalized parity coordinates.
# Even coordinates represent c_0 V_0 + c_1(V_1+V_-1)+c_2(V_2+V_-2).
# Odd coordinates represent c_1(V_1-V_-1)+c_2(V_2-V_-2).
Q_PLUS: Matrix = (
    (F(4), F(-2), F(-2)),
    (F(-1), F(3), F(-2)),
    (F(-1), F(-2), F(3)),
)
Q_MINUS: Matrix = ((F(5), F(0)), (F(0), F(5)))
D_PLUS: Matrix = ((F(0), F(1), F(0)), (F(0), F(0), F(2)))
D_MINUS: Matrix = ((F(0), F(0)), (F(1), F(0)), (F(0), F(2)))
DELTA: Vector = (F(1), F(2), F(2))
BETA: Vector = (F(-1), F(-2))
PHI: Vector = (F(1, 5), F(1, 5), F(1, 5))
E0: Vector = (F(1), F(0), F(0))


def even_cauchy(vector: Vector, r: Fraction) -> Fraction:
    return (
        vector[0] / r
        + sum(
            (
                vector[n]
                * (F(1) / (r - n) + F(1) / (r + n))
                for n in (1, 2)
            ),
            F(0),
        )
    )


def odd_cauchy(vector: Vector, r: Fraction) -> Fraction:
    return sum(
        (
            vector[n - 1]
            * (F(1) / (r - n) - F(1) / (r + n))
            for n in (1, 2)
        ),
        F(0),
    )


def odd_profile(v: Vector, r: Fraction) -> Fraction:
    return F(1) + sum(
        (F(2 * n) * v[n - 1] / (F(n * n) - r * r) for n in (1, 2)),
        F(0),
    )


class CaptureFreeActualGroundParityResponseBarrierTests(unittest.TestCase):
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

    def test_source_displacement_ground_and_complement_solve(self) -> None:
        self.assertEqual(
            subtract(matmul(D_PLUS, Q_PLUS), matmul(Q_MINUS, D_PLUS)),
            outer(BETA, DELTA),
        )
        self.assertEqual(matvec(Q_PLUS, PHI), (F(0), F(0), F(0)))
        self.assertEqual(dot(DELTA, PHI), F(1))

        odd_inverse = inverse(Q_MINUS)
        v = matvec(odd_inverse, BETA)
        self.assertEqual(v, (F(-1, 5), F(-2, 5)))
        self.assertEqual(matvec(D_PLUS, PHI), scale_vector(F(-1), v))
        self.assertEqual(
            matvec(Q_MINUS, matvec(D_PLUS, PHI)),
            scale_vector(F(-1), BETA),
        )

        # kappa=e_0, x=Phi/<kappa,Phi>=(1,1,1), y=kappa-x.
        p_mu = PHI[0]
        ground = scale_vector(F(1) / p_mu, PHI)
        correction = add_vectors(E0, scale_vector(F(-1), ground))
        self.assertEqual(ground, (F(1), F(1), F(1)))
        self.assertEqual(correction, (F(0), F(-1), F(-1)))
        complement = (Q_PLUS[1][1:], Q_PLUS[2][1:])
        forcing = (Q_PLUS[1][0], Q_PLUS[2][0])
        self.assertEqual(
            matvec(complement, correction[1:]),
            forcing,
        )

    def test_mode_multiplication_profile_and_invariant_response(self) -> None:
        v = matvec(inverse(Q_MINUS), BETA)
        p_mu = PHI[0]
        ground = scale_vector(F(1) / p_mu, PHI)
        correction = add_vectors(E0, scale_vector(F(-1), ground))

        for r in (F(1, 3), F(3, 4), F(7, 3), F(-5, 3)):
            for even_vector in (PHI, ground, E0, correction):
                left = r * even_cauchy(even_vector, r)
                right = dot(DELTA, even_vector) + odd_cauchy(
                    matvec(D_PLUS, even_vector), r
                )
                self.assertEqual(left, right)

            profile = odd_profile(v, r)
            self.assertEqual(profile, F(1) - odd_cauchy(v, r))
            self.assertEqual(r * even_cauchy(PHI, r), profile)

            invariant_response = even_cauchy(correction, r)
            capture_free = (
                even_cauchy(E0, r) - profile / (r * p_mu)
            )
            self.assertEqual(invariant_response, capture_free)

    def test_analytic_continuation_residues_cancel_lattice_zeros(self) -> None:
        v = matvec(inverse(Q_MINUS), BETA)
        self.assertEqual(odd_profile(v, F(0)), PHI[0])

        # The residue of A at r=n is n*Phi_n.  Multiplication by
        # sin(pi*r)/r therefore has the finite value
        # pi*(-1)^n*Phi_n, exactly matching the Cauchy-transform residue.
        for n in (1, 2):
            profile_residue = -v[n - 1]
            self.assertEqual(profile_residue, n * PHI[n])
            continued_without_pi = F((-1) ** n) * profile_residue / n
            self.assertEqual(continued_without_pi, F((-1) ** n) * PHI[n])

        # A numerical approach to the removable values checks the displayed
        # sine convention rather than treating zero times infinity pointwise.
        for n in (0, 1, 2):
            epsilon = 1.0e-7
            r = n + epsilon
            if n == 0:
                profile = float(odd_profile(v, F(1, 10_000_000)))
            else:
                profile = 1.0 + sum(
                    2.0 * mode * float(v[mode - 1])
                    / (mode * mode - r * r)
                    for mode in (1, 2)
                )
            continued = math.sin(math.pi * r) / r * profile
            target = math.pi * ((-1.0) ** n) * float(PHI[n])
            self.assertAlmostEqual(continued, target, places=5)

    def test_parity_adjugate_and_mixed_bordered_cofactor(self) -> None:
        for spectral in (F(0), F(1, 3), F(7, 2)):
            plus_shift = shift(Q_PLUS, spectral)
            minus_shift = shift(Q_MINUS, spectral)
            boundary_cofactor = dot(
                DELTA,
                matvec(adjugate(plus_shift), E0),
            )
            self.assertEqual(boundary_cofactor, determinant(minus_shift))

        w = matvec(adjugate(Q_PLUS), E0)
        self.assertEqual(w, scale_vector(determinant(Q_MINUS), PHI))
        self.assertEqual(
            matvec(D_PLUS, w),
            scale_vector(F(-1), matvec(adjugate(Q_MINUS), BETA)),
        )

        r = F(1, 3)
        chi_dual = tuple(
            F(2 * n) / (F(n * n) - r * r)
            for n in (1, 2)
        )
        adj_beta = matvec(adjugate(Q_MINUS), BETA)
        numerator = dot(chi_dual, adj_beta)
        profile_from_cofactor = F(1) + numerator / determinant(Q_MINUS)
        profile_from_inverse = odd_profile(matvec(inverse(Q_MINUS), BETA), r)
        self.assertEqual(profile_from_cofactor, profile_from_inverse)

        border: Matrix = (
            (F(0),) + chi_dual,
            (BETA[0],) + Q_MINUS[0],
            (BETA[1],) + Q_MINUS[1],
        )
        self.assertEqual(numerator, -determinant(border))

    def test_isospectral_odd_determinant_does_not_fix_mixed_row(self) -> None:
        first: Matrix = ((F(1), F(0)), (F(0), F(4)))
        second: Matrix = (
            (F(73, 25), F(-36, 25)),
            (F(-36, 25), F(52, 25)),
        )
        beta = (F(1), F(0))
        chi = (F(0), F(1))

        self.assertEqual(determinant(first), determinant(second))
        self.assertEqual(first[0][0] + first[1][1], F(5))
        self.assertEqual(second[0][0] + second[1][1], F(5))
        for spectral in (F(-2), F(0), F(1, 2), F(7)):
            self.assertEqual(
                determinant(shift(first, spectral)),
                determinant(shift(second, spectral)),
            )

        first_mixed = dot(chi, matvec(adjugate(first), beta))
        second_mixed = dot(chi, matvec(adjugate(second), beta))
        self.assertEqual(first_mixed, F(0))
        self.assertEqual(second_mixed, F(36, 25))

    def test_regularized_determinant_ode_and_projective_ratio(self) -> None:
        log_lambda = 0.43
        constant = 0.71 - 0.19j

        def delta(z: complex) -> complex:
            return (z - 1.0) * (z + 2.0)

        def delta_prime(z: complex) -> complex:
            return 2.0 * z + 1.0

        def anchor(z: complex) -> complex:
            return 1.0 + 0.3 * z + 0.2 * z * z

        def anchor_prime(z: complex) -> complex:
            return 0.3 + 0.4 * z

        def ground_transform(z: complex) -> complex:
            return constant * cmath.exp(1j * log_lambda * z) * delta(z)

        def ground_transform_prime(z: complex) -> complex:
            phase = cmath.exp(1j * log_lambda * z)
            return constant * phase * (
                1j * log_lambda * delta(z) + delta_prime(z)
            )

        for z in (0.2 + 0.3j, -0.7 + 0.4j, 2.1 - 0.2j):
            response = anchor(z) - ground_transform(z)
            response_prime = anchor_prime(z) - ground_transform_prime(z)
            coefficient = 1j * log_lambda + delta_prime(z) / delta(z)
            self.assertAlmostEqual(
                response_prime - coefficient * response,
                anchor_prime(z) - coefficient * anchor(z),
            )

            cross = (
                delta(z) * (anchor_prime(z) - response_prime)
                - (
                    1j * log_lambda * delta(z) + delta_prime(z)
                )
                * (anchor(z) - response)
            )
            self.assertAlmostEqual(cross, 0.0j)

        z = 0.2 + 0.3j
        z0 = -0.7 + 0.4j
        ratio = ground_transform(z) / ground_transform(z0)
        determinant_ratio = (
            cmath.exp(1j * log_lambda * (z - z0))
            * delta(z)
            / delta(z0)
        )
        self.assertAlmostEqual(ratio, determinant_ratio)

        # The divided coefficient is singular at z=1, but the
        # cross-multiplied equation remains valid there.
        z = 1.0 + 0.0j
        response = anchor(z) - ground_transform(z)
        response_prime = anchor_prime(z) - ground_transform_prime(z)
        cross = (
            delta(z) * (anchor_prime(z) - response_prime)
            - (1j * log_lambda * delta(z) + delta_prime(z))
            * (anchor(z) - response)
        )
        self.assertAlmostEqual(cross, 0.0j)

    def test_second_multiplication_has_ground_component_ambiguity(self) -> None:
        v = matvec(inverse(Q_MINUS), BETA)
        d_beta = matvec(D_MINUS, BETA)
        # The odd Hilbert metric contributes two copies of every positive
        # mode in the raw unnormalized coordinate convention.
        c_mu = F(2) * dot(BETA, v)
        rhs = add_vectors(d_beta, scale_vector(c_mu, (F(1), F(1), F(1))))
        actual = matvec(D_MINUS, v)
        self.assertEqual(c_mu, F(2))
        self.assertEqual(rhs, (F(2), F(1), F(-2)))
        self.assertEqual(matvec(Q_PLUS, actual), rhs)

        # A singular even equation determines the next vector only modulo
        # the ground.  The zero central-mode condition selects the actual
        # derivative and requires division by the central ground overlap.
        particular = add_vectors(actual, PHI)
        self.assertEqual(matvec(Q_PLUS, particular), rhs)
        selector = -particular[0] / PHI[0]
        self.assertEqual(selector, F(-1))
        self.assertEqual(add_vectors(particular, scale_vector(selector, PHI)), actual)
        self.assertEqual(actual[0], F(0))
        self.assertEqual(determinant(Q_PLUS), F(0))

    def test_scope_prior_art_and_required_formulas(self) -> None:
        required = (
            "The odd response itself is not new",
            "PAIRED_TRACE_ODD_RESOLVENT_GATE.md",
            "ODD_RESOLVENT_WEYL_RECONSTRUCTION.md",
            "CAUCHY_GROUND_RESPONSE_WINDOW_REDUCTION.md",
            r"\mathfrak R_\lambda(z)",
            r"K_L(z)\mathcal A_\mu",
            r"\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h",
            r"\operatorname {adj}(O_\mu)\beta",
            r"\Delta_{\lambda,N}'(z)",
            r"T_+^\dagger",
            "analytic-continuation convention",
            "mixed directional cofactor",
            "tautological for",
            "Krylov tower",
            "proves no response decay",
            "no strict sector sign",
            "hypothesis conclusion",
            "eight are unchanged",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)
        self.assertIn("Equation (7.1) is not proved here", self.text)
        self.assertNotIn("This theorem proves RH", self.text)

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
