#!/usr/bin/env python3
"""Strict regressions for the shifted-correlation/top-moment UI barrier.

The mathematical fixtures use only integers and ``Fraction``.  No prime
sample, zero table, numerical eigensolver, cached matrix, or network resource
is read.
"""

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
NOTE = ROOT / "notes" / (
    "ACTUAL_CENTERED_REMAINDER_SHIFTED_CORRELATION_TOP_MOMENT_UI_BARRIER.md"
)
NOTE_HASH = "8ab0f30e32fe715a4f839228f5d05dc581292c99c2a04f42804f0ff4d2d878d9"

FROZEN = {
    "notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md":
        "1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1",
    "tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py":
        "cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def hermite_values(point: F, degree: int) -> tuple[F, ...]:
    values = [F(1)]
    if degree == 0:
        return tuple(values)
    values.append(point)
    for index in range(1, degree):
        values.append(point * values[-1] - index * values[-2])
    return tuple(values)


def gaussian_moment(power: int) -> F:
    if power % 2:
        return F(0)
    return F(math.prod(range(1, power, 2)) if power else 1)


Matrix = tuple[tuple[F, ...], ...]


def matmul(left: Matrix, right: Matrix) -> Matrix:
    size = len(left)
    return tuple(
        tuple(
            sum((left[row][mid] * right[mid][column] for mid in range(size)), F(0))
            for column in range(size)
        )
        for row in range(size)
    )


def identity(size: int) -> Matrix:
    return tuple(
        tuple(F(row == column) for column in range(size))
        for row in range(size)
    )


def monic_jacobi(size: int, last_diagonal: F = F(0)) -> Matrix:
    """Matrix of multiplication by z in the monic Hermite basis."""

    rows = [[F(0) for _ in range(size)] for _ in range(size)]
    for column in range(size):
        if column + 1 < size:
            rows[column + 1][column] = F(1)
        if column:
            rows[column - 1][column] = F(column)
    rows[-1][-1] = last_diagonal
    return tuple(tuple(row) for row in rows)


def moments_from_jacobi(matrix: Matrix, max_power: int) -> tuple[F, ...]:
    power = identity(len(matrix))
    moments = []
    for _ in range(max_power + 1):
        moments.append(power[0][0])
        power = matmul(power, matrix)
    return tuple(moments)


def convolve_prime_weights(
    weights: dict[int, F], power: int
) -> dict[int, F]:
    values = {1: F(1)}
    for _ in range(power):
        next_values: dict[int, F] = {}
        for index, coefficient in values.items():
            for prime, weight in weights.items():
                product = index * prime
                next_values[product] = (
                    next_values.get(product, F(0)) + coefficient * weight
                )
        values = next_values
    return values


def omega_with_multiplicity(value: int) -> int:
    count = 0
    divisor = 2
    while divisor * divisor <= value:
        while value % divisor == 0:
            value //= divisor
            count += 1
        divisor += 1
    if value > 1:
        count += 1
    return count


class ActualCenteredRemainderShiftedCorrelationTopMomentUIBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_frozen_dependency_and_self_hash(self) -> None:
        expected_paths = {
            "notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md",
            "tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py",
        }
        self.assertEqual(set(FROZEN), expected_paths)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_dirichlet_convolution_has_exact_factor_count(self) -> None:
        weights = {2: F(2), 3: F(3), 5: F(5), 7: F(7)}
        for power in range(1, 7):
            coefficients = convolve_prime_weights(weights, power)
            self.assertTrue(coefficients)
            self.assertTrue(
                all(omega_with_multiplicity(index) == power for index in coefficients)
            )
            ordered_total = sum(coefficients.values(), F(0))
            self.assertEqual(ordered_total, sum(weights.values(), F(0)) ** power)
        self.assertIn(r"C_{r,x}=\ell_x^{*r}", self.normalized)
        self.assertIn(r"P_x(t)^r=\sum_{n\leq x^r}", self.normalized)

    def test_near_band_has_fixed_odd_and_growing_even_shifts(self) -> None:
        for k_value in range(2, 9):
            time_exponent = k_value
            odd_denominator_exponent = k_value
            even_denominator_exponent = k_value + 1
            self.assertEqual(odd_denominator_exponent - time_exponent, 0)
            self.assertEqual(even_denominator_exponent - time_exponent, 1)

        self.assertIn(r"|h|\leq{2\over A}", self.normalized)
        self.assertIn(r"0<|h|\ll_A x", self.normalized)
        self.assertIn(
            r"p_1\cdots p_{k+1}-q_1\cdots q_k=h",
            self.normalized,
        )
        self.assertIn(
            r"p_1\cdots p_5-q_1\cdots q_4=h",
            self.normalized,
        )

    def test_weighted_mv_deficits_are_exact(self) -> None:
        for k_value in range(2, 9):
            odd_x = F(2 * k_value + 1, 2) - k_value
            odd_l = F(2 * k_value + 1, 2)
            even_x = F(2 * k_value + 2, 2) - k_value
            even_l = F(2 * k_value + 2, 2)
            self.assertEqual(odd_x, F(1, 2))
            self.assertEqual(odd_l, F(2 * k_value + 1, 2))
            self.assertEqual(even_x, F(1))
            self.assertEqual(even_l, F(k_value + 1))

        required = (
            r"x^{1/2}L^{k+1/2}",
            r"{x^{1/2}\over L^{k+1/2}}",
            r"O_{A,k}(xL^{k+1})",
            r"{x\over L^{k+1}}",
            r"O_A(x^{1/2}L^{9/2})",
            r"O_A(xL^5)",
            "factor `x/L^5` improvement",
        )
        for token in required:
            self.assertIn(token, self.normalized)

    def test_rational_k_four_boundary_parameter(self) -> None:
        c_value = F(5, 2)
        values = hermite_values(c_value, 5)
        self.assertEqual(values[4], F(73, 16))
        self.assertEqual(values[5], F(-675, 32))
        tau = values[5] / values[4]
        self.assertEqual(tau, F(-675, 146))
        self.assertLess(tau, 0)

        # rho_4<c is (c^2-3)^2>6; c<rho_5 is (c^2-5)^2<10.
        self.assertGreater((c_value * c_value - 3) ** 2, 6)
        self.assertLess((c_value * c_value - 5) ** 2, 10)
        self.assertIn(r"\tau_{5/2}=-{675\over146}", self.normalized)

    def test_jacobi_boundary_characteristic_and_support_gate(self) -> None:
        c_value = F(5, 2)
        hermites = hermite_values(c_value, 5)
        tau = hermites[5] / hermites[4]
        self.assertEqual(hermites[5] - tau * hermites[4], 0)
        self.assertTrue(all(value > 0 for value in hermites[:5]))

        # Positive leading minors of cI-J through order four, followed by
        # zero determinant, are the exact LDL support certificate at c.
        leading = hermites[:5]
        pivots = tuple(leading[index] / leading[index - 1] for index in range(1, 5))
        self.assertTrue(all(pivot > 0 for pivot in pivots))
        self.assertIn(
            r"\det(zI-J_{k+1}^{(c)})"
            r" =\operatorname {He}_{k+1}(z)"
            r" -\tau_c\operatorname {He}_k(z)",
            self.normalized,
        )

    def test_jacobi_walks_match_through_eight_and_shift_ninth(self) -> None:
        c_value = F(5, 2)
        hermites = hermite_values(c_value, 5)
        tau = hermites[5] / hermites[4]
        boundary = monic_jacobi(5, tau)
        moments = moments_from_jacobi(boundary, 10)
        for power in range(9):
            self.assertEqual(moments[power], gaussian_moment(power))
        self.assertEqual(moments[9], math.factorial(4) * tau)

        ordinary = moments_from_jacobi(monic_jacobi(5), 9)
        for power, moment in enumerate(ordinary):
            self.assertEqual(moment, gaussian_moment(power))

        self.assertIn(r"\int z^{2k+1}\,d\mu_c(z)=k!\tau_c", self.normalized)

    def test_remote_atom_cancels_ninth_and_loses_tenth_ui(self) -> None:
        c_value = F(5, 2)
        hermites = hermite_values(c_value, 5)
        tau = hermites[5] / hermites[4]
        base = moments_from_jacobi(monic_jacobi(5, tau), 10)
        delta = -math.factorial(4) * tau
        self.assertGreater(delta, 0)

        excesses: list[F] = []
        tenth_moments: list[F] = []
        for radius in (128, 256, 512, 1024):
            denominator = 1 + delta * F(radius) ** -9
            moments = tuple(
                (base[power] + delta * F(radius) ** (power - 9)) / denominator
                for power in range(11)
            )
            self.assertEqual(moments[0], 1)
            self.assertEqual(moments[9], 0)
            excesses.append(
                delta * F(radius) ** -9 * (F(radius) - c_value) / denominator
            )
            tenth_moments.append(moments[10])

        self.assertTrue(
            all(right < left for left, right in zip(excesses, excesses[1:]))
        )
        self.assertTrue(
            all(right > left for left, right in zip(tenth_moments, tenth_moments[1:]))
        )
        self.assertIn(r"=O_{k,c}(R^{-2k})\longrightarrow0", self.normalized)
        self.assertIn(r"\longrightarrow\infty", self.normalized)

    def test_remote_lower_moments_converge_to_gaussian(self) -> None:
        c_value = F(5, 2)
        hermites = hermite_values(c_value, 5)
        tau = hermites[5] / hermites[4]
        base = moments_from_jacobi(monic_jacobi(5, tau), 9)
        delta = -math.factorial(4) * tau
        radii = (128, 256, 512, 1024)
        for power in range(1, 9):
            errors = []
            for radius in radii:
                denominator = 1 + delta * F(radius) ** -9
                moment = (
                    base[power] + delta * F(radius) ** (power - 9)
                ) / denominator
                errors.append(abs(moment - gaussian_moment(power)))
            self.assertTrue(
                all(right < left for left, right in zip(errors, errors[1:]))
            )

    def test_k_four_threshold_and_diagonal_scale(self) -> None:
        self.assertEqual(math.factorial(5), 120)
        self.assertGreater(F(6), F(2) ** 2)
        self.assertLess(F(6), F(3) ** 2)
        self.assertIn(r"c=4(1-\alpha)", self.normalized)
        self.assertIn(r"\rho_4=\sqrt{3+\sqrt6}", self.normalized)
        self.assertIn(r"\rho_5=\sqrt{5+\sqrt{10}}", self.normalized)
        self.assertIn(r"D_{5,x}=\{120+o(1)\}S_x^5\asymp L^{10}", self.normalized)

    def test_exact_kernel_and_method_boundary_are_recorded(self) -> None:
        required = (
            r"K(v)=\int_1^2e^{isv}\,ds",
            r"e^{3iv/2}{2\sin(v/2)\over v}",
            r"M_{a,b}(T):={1\over T}\int_T^{2T}",
            r"K\!\left(T\log{n\over m}\right)",
            "translated endpoint phase",
            "fixed-shift `(k+1)`-almost-prime",
            "growing shift band",
            "divisor switching followed by absolute values",
            "signed aggregate cancellation",
            "beyond-length mean-value theorem",
            "No Brun--Selberg sieve",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

    def test_note_contract_and_fail_closed_scope(self) -> None:
        required = (
            r"\alpha_*=1-{\sqrt{3+\sqrt6}\over4}",
            r"\nu_{c,R}=",
            r"\rho_k<c<\rho_{k+1}",
            r"c\geq\rho_k",
            "exact odd moment",
            "uniform integrability",
            "not the actual prime polynomial",
            "proves no failure of an actual shifted correlation",
            "one-way phase-volume comparison is not reversed",
            "No dangerous-projector capture",
            "RH proof or converse",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("TO_BE_FROZEN", self.text)
        self.assertNotIn("}^{,", self.text)
        self.assertNotIn("proves RH", self.text)
        self.assertNotIn("\r", self.text)
        self.assertNotIn("\t", self.text)
        self.assertIsNone(re.search(r"[ \t]+$", self.text, flags=re.MULTILINE))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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

    def test_static_ascii_ast_hash_and_cache_clean(self) -> None:
        test_path = Path(__file__)
        tree = ast.parse(test_path.read_text(encoding="ascii"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])

        for path in (NOTE, test_path):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

        cache_entries = [
            path
            for path in ROOT.rglob("*")
            if path.name == "__pycache__" or path.suffix in {".pyc", ".pyo"}
        ]
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main()
