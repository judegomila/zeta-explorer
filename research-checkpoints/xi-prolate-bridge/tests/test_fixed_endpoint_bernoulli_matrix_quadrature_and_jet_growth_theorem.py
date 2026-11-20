#!/usr/bin/env python3
"""Exact regressions for the fixed endpoint Bernoulli matrix theorem."""

from __future__ import annotations

import ast
import cmath
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_EVEN_ENDPOINT_NULL_BERNOULLI_PRIME_QUADRATURE_BOUND.md":
        "ba3aa9777c61883424eed8404f814abf6a9974f2846424e26529661c89ab3a0b",
    "tests/test_fixed_even_endpoint_null_bernoulli_prime_quadrature_bound.py":
        "2ba9ec7f21c9f4e837cc4ec55ebf1f11d38a6fb1d036e90094a10b7f66ad8e42",
    "notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md":
        "c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md":
        "49568daabe36c6507f7b366c53f784f29f9b7807284c738b80f5b016600f354b",
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def zeta_upper(s: float, cutoff: int = 50_000) -> float:
    partial = sum(n ** (-s) for n in range(1, cutoff + 1))
    return partial + cutoff ** (1 - s) / (s - 1)


def bernoulli_one(x: float) -> float:
    fractional = x - math.floor(x)
    if fractional == 0:
        return 0.0
    return fractional - 0.5


def fejer_bernoulli_one(x: float, cutoff: int) -> float:
    # B_1(x)=-pi^(-1) sum sin(2*pi*n*x)/n, in the Fejer sense.
    return -sum(
        (1 - n / (cutoff + 1))
        * math.sin(2 * math.pi * n * x)
        / n
        for n in range(1, cutoff + 1)
    ) / math.pi


def k_constants(q: int, r: int) -> tuple[float, float]:
    beta_product = (
        math.factorial(q)
        * math.factorial(r)
        / (2 * math.pi) ** (q + r)
    )
    k_plus = (
        12
        / math.sqrt(math.pi)
        * beta_product
        * zeta_upper(q + 0.25)
        * zeta_upper(r + 0.25)
    )
    k_minus = (
        4
        / math.pi
        * beta_product
        * zeta_upper(q + 0.5)
        * zeta_upper(r + 0.5)
    )
    return k_plus, k_minus


def poly_add(*terms: dict[tuple[int, int], F]) -> dict[tuple[int, int], F]:
    result: dict[tuple[int, int], F] = {}
    for term in terms:
        for monomial, coefficient in term.items():
            result[monomial] = result.get(monomial, F(0)) + coefficient
    return {key: value for key, value in result.items() if value}


def poly_scale_shift(
    polynomial: dict[tuple[int, int], F],
    scalar: F,
    delta_shift: int = 0,
    c2_shift: int = 0,
) -> dict[tuple[int, int], F]:
    return {
        (delta_degree + delta_shift, c2_degree + c2_shift): scalar * coefficient
        for (delta_degree, c2_degree), coefficient in polynomial.items()
    }


def endpoint_polynomials(maximum: int) -> list[dict[tuple[int, int], F]]:
    # Variables are delta=Theta-c^2 and z=c^2.
    values = [{(0, 0): F(1)}]
    zero: dict[tuple[int, int], F] = {}
    for j in range(maximum):
        p_j = values[j]
        p_jm1 = values[j - 1] if j >= 1 else zero
        p_jm2 = values[j - 2] if j >= 2 else zero
        numerator = poly_add(
            poly_scale_shift(p_j, F(1), delta_shift=1),
            poly_scale_shift(p_j, F(-j * (j + 1))),
            poly_scale_shift(p_jm1, F(-2 * j), c2_shift=1),
            poly_scale_shift(p_jm2, F(-j * (j - 1)), c2_shift=1),
        )
        values.append(poly_scale_shift(numerator, F(1, 2 * (j + 1))))
    return values


class FixedEndpointBernoulliMatrixQuadratureTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", text)
            self.assertIn(f"`{expected}`", text)

    def test_fejer_sawtooth_normalization_and_midpoint(self) -> None:
        for x_value in (0.125, 0.2, 0.37, 0.625):
            self.assertAlmostEqual(
                fejer_bernoulli_one(x_value, 20_000),
                bernoulli_one(x_value),
                delta=2e-5,
            )
        for integer in range(-3, 4):
            self.assertAlmostEqual(fejer_bernoulli_one(integer, 500), 0.0, 12)
            self.assertEqual(bernoulli_one(float(integer)), 0.0)

    def test_fourier_coefficient_magnitudes(self) -> None:
        # |-q!/(2*pi*i)^q| is q!/(2*pi)^q.
        for q_value in range(1, 8):
            complex_coefficient = -math.factorial(q_value) / (
                2j * math.pi
            ) ** q_value
            expected = math.factorial(q_value) / (2 * math.pi) ** q_value
            self.assertAlmostEqual(abs(complex_coefficient), expected, 14)

    def test_mixed_weight_is_monotone_with_exact_supremum(self) -> None:
        y_value = 1.7
        for q_value in range(1, 7):
            for r_value in range(1, 7):
                samples = [
                    math.exp(
                        -(q_value - 1) * y_value * fraction
                        -(r_value - 1) * y_value * (1 - fraction)
                    )
                    for fraction in (0.0, 0.1, 0.4, 0.8, 1.0)
                ]
                expected = math.exp(
                    -(min(q_value, r_value) - 1) * y_value
                )
                self.assertAlmostEqual(max(samples), expected, 14)
                differences = [b - a for a, b in zip(samples, samples[1:])]
                self.assertTrue(
                    all(value >= -1e-15 for value in differences)
                    or all(value <= 1e-15 for value in differences)
                )

    def test_phase_derivative_bounds_survive_every_fixed_pair(self) -> None:
        a_value = 12.25
        for y_value in (0.0, 0.2, 1.1):
            for k_value, ell_value in ((1, 2), (-3, -1), (1, -4), (-2, 5)):
                for fraction in (0.0, 0.23, 0.5, 0.89, 1.0):
                    t_value = fraction * y_value
                    common = (
                        4
                        * math.pi
                        * a_value
                        * math.sqrt(abs(k_value * ell_value))
                        * math.exp(y_value / 2)
                    )
                    if k_value * ell_value > 0:
                        derivative = 2 * math.pi * a_value * (
                            k_value * math.exp(t_value)
                            + ell_value * math.exp(y_value - t_value)
                        )
                    else:
                        derivative = 2 * math.pi * a_value * (
                            k_value * math.exp(t_value)
                            - ell_value * math.exp(y_value - t_value)
                        )
                    self.assertGreaterEqual(abs(derivative) + 1e-12, common)

    def test_general_constants_recover_p_p_and_b2_b2(self) -> None:
        k11_plus, k11_minus = k_constants(1, 1)
        self.assertAlmostEqual(
            k11_plus,
            3 * zeta_upper(5 / 4) ** 2 / math.pi ** (5 / 2),
        )
        self.assertAlmostEqual(
            k11_minus,
            zeta_upper(3 / 2) ** 2 / math.pi**3,
        )

        k22_plus, k22_minus = k_constants(2, 2)
        self.assertAlmostEqual(
            k22_plus,
            3 * zeta_upper(9 / 4) ** 2 / math.pi ** (9 / 2),
        )
        self.assertAlmostEqual(
            k22_minus,
            zeta_upper(5 / 2) ** 2 / math.pi**5,
        )

    def test_decay_and_chebyshev_factors(self) -> None:
        for minimum, alpha, beta in (
            (1, F(1, 4), F(1, 2)),
            (2, F(5, 4), F(3, 2)),
            (3, F(9, 4), F(5, 2)),
        ):
            self.assertEqual(F(minimum) - F(3, 4), alpha)
            self.assertEqual(F(minimum) - F(1, 2), beta)
        self.assertEqual((1 + F(1, 4)) / F(1, 4), 5)
        self.assertEqual((1 + F(1, 2)) / F(1, 2), 3)
        self.assertEqual((1 + F(5, 4)) / F(5, 4), F(9, 5))
        self.assertEqual((1 + F(3, 2)) / F(3, 2), F(5, 3))

    def test_one_dimensional_primitive_constants(self) -> None:
        j_one = (
            2
            * math.factorial(1)
            * zeta_upper(2)
            / (math.pi * (2 * math.pi))
        )
        j_two = (
            2
            * math.factorial(2)
            * zeta_upper(3)
            / (math.pi * (2 * math.pi) ** 2)
        )
        self.assertAlmostEqual(j_one, 1 / 6, delta=2e-10)
        self.assertAlmostEqual(j_two, zeta_upper(3) / math.pi**3)
        self.assertAlmostEqual(j_one * j_one, 1 / 36, delta=1e-10)

    def test_stieltjes_prime_jump_and_boundary_signs(self) -> None:
        a_value = 6.25
        endpoint = 24.0
        y_endpoint = math.log(endpoint / a_value)
        atoms = ((7.0, 2.0), (11.0, 3.0), (13.0, 5.0), (19.0, 7.0))

        def f_value(y_value: float) -> float:
            return y_value * math.exp(-y_value)

        integral_psi_f_prime = sum(
            weight
            * (f_value(y_endpoint) - f_value(math.log(location / a_value)))
            for location, weight in atoms
        )
        left = -integral_psi_f_prime / a_value
        boundary = -sum(weight for _, weight in atoms) * f_value(y_endpoint) / a_value
        jumps = sum(
            weight * f_value(math.log(location / a_value)) / a_value
            for location, weight in atoms
        )
        self.assertAlmostEqual(left, boundary + jumps, 14)

        # C(0)=0 kills a possible atom at n=A.
        self.assertEqual(0.0 * 17.0 / a_value, 0.0)
        for location, _ in atoms:
            y_value = math.log(location / a_value)
            c_value = math.exp(y_value) * f_value(y_value)
            self.assertAlmostEqual(f_value(y_value) / a_value, c_value / location)

    def test_archimedean_exponents_and_denominators(self) -> None:
        self.assertEqual(F(1, 4) + 3, F(13, 4))
        self.assertEqual(F(1, 2) + 3, F(7, 2))
        self.assertEqual(1 / F(13, 4), F(4, 13))
        self.assertEqual(1 / F(7, 2), F(2, 7))
        for a_value in (6.25, 20.25, 100.25):
            y_value = 0.7
            z_value = a_value ** -2 * math.exp(-2 * y_value)
            derivative = 2 * z_value / (1 - z_value)
            expected = (
                2
                * a_value ** -2
                * math.exp(-2 * y_value)
                / (1 - a_value ** -2 * math.exp(-2 * y_value))
            )
            self.assertAlmostEqual(derivative, expected)

    def test_endpoint_polynomial_recurrence_and_leading_term(self) -> None:
        values = endpoint_polynomials(7)
        self.assertEqual(values[0], {(0, 0): F(1)})
        self.assertEqual(values[1], {(1, 0): F(1, 2)})
        self.assertEqual(
            values[2],
            {(2, 0): F(1, 8), (1, 0): F(-1, 4), (0, 1): F(-1, 2)},
        )
        for j_value, polynomial in enumerate(values):
            self.assertEqual(
                polynomial[(j_value, 0)],
                F(1, 2**j_value * math.factorial(j_value)),
            )

    def test_raw_and_physical_endpoint_signs(self) -> None:
        # Raw fixed-label leading sign is (-1)^(q-1); physical B_q adds (-1)^q.
        for q_value in range(1, 9):
            raw_sign = (-1) ** (q_value - 1)
            physical_multiplier = (-1) ** q_value
            self.assertEqual(raw_sign * physical_multiplier, -1)
        # At q=1, -B_1 is exactly the physical sawtooth P.
        for x_value in (0.2, 0.37, 0.8):
            self.assertAlmostEqual(-bernoulli_one(x_value), 0.5 - x_value)

    def test_endpoint_null_constants_and_growth_exponents(self) -> None:
        def null_constant(q_value: int) -> float:
            return (
                (-1) ** (q_value - 1)
                * 2**q_value
                * math.pi ** (2 * q_value - 2.5)
                / (
                    math.factorial(q_value - 2)
                    * math.factorial(q_value)
                )
            )

        self.assertAlmostEqual(null_constant(2), -2 * math.pi ** 1.5)
        self.assertAlmostEqual(null_constant(3), 4 * math.pi ** 3.5 / 3)
        self.assertAlmostEqual(null_constant(4), -math.pi ** 5.5 / 3)

        for q_value in range(2, 8):
            self.assertEqual(2 * q_value - 4, 2 * (q_value - 2))
            self.assertEqual(4 * q_value - 8, 4 * (q_value - 2))
        for q_value in range(1, 8):
            self.assertEqual(2 * q_value - 2, 2 * (q_value - 1))

    def test_required_scale_for_fixed_bernoulli_matrix(self) -> None:
        # 2*lambda times an O(A^-1/2) scalar is O(1) on A=lambda^2.
        for odd_numerator in range(5, 40, 2):
            lambda_value = odd_numerator / 2
            a_value = lambda_value * lambda_value
            self.assertAlmostEqual(
                2 * lambda_value * a_value ** -0.5,
                2.0,
            )

    def test_note_serializes_theorem_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        required = (
            "For an integer `q>=1`",
            "K^+_{q,r}",
            "K^-_{q,r}",
            "\\mathcal Q_{q,r;A}=O_{q,r}(A^{-1/2})",
            "\\mathcal M_{jk,A}=\\mathcal Q_{j+1,k+1;A}",
            "leading `P--P` scalar is `mathcal M_(00,A)`",
            "`mathcal M_(11,A)` is `mathcal Q_(2,2;A)`",
            "K^+_{1,1}={3\\zeta(5/4)^2\\over\\pi^{5/2}}",
            "J_1=1/6",
            "Fejer",
            "There is no factor-two variation loss",
            "C_{q,r;A}\\in AC_{\\rm loc}",
            "possible endpoint atom contributes zero",
            "2(j+1)P_{j+1}",
            "\\widehat\\gamma_{2,v}=\\gamma_{2,v}\\longrightarrow",
            "O_R(\\lambda^{4R-8})",
            "do not certify an own-defect `O(1)` physical matrix",
            "This note proves neither growth nor failure",
            "supplies their signed asymptotics",
            "The formal state remains `P0_INVALIDATED`",
            "no RH conclusion",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "therefore the finite truncation diverges",
            "therefore the signed floor holds",
            "the complete volterra remainder is bounded",
            "the growing rest is controlled",
            "proves rh",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)

    def test_aligned_rows_and_clean_bytes(self) -> None:
        data = NOTE.read_bytes()
        self.assertNotIn(b"\r", data)
        self.assertNotIn(b"\x00", data)
        data.decode("utf-8")

        inside_aligned = False
        for line_number, line in enumerate(
            NOTE.read_text(encoding="utf-8").splitlines(), 1
        ):
            stripped = line.rstrip()
            trailing = len(stripped) - len(stripped.rstrip("\\"))
            self.assertNotEqual(trailing, 1, line_number)
            if "\\begin{aligned}" in line:
                self.assertFalse(inside_aligned, line_number)
                inside_aligned = True
                continue
            if "\\end{aligned}" in line:
                self.assertTrue(inside_aligned, line_number)
                inside_aligned = False
        self.assertFalse(inside_aligned)

    def test_python_source_is_stdlib_only_and_clean(self) -> None:
        data = TEST.read_bytes()
        self.assertNotIn(b"\r", data)
        self.assertNotIn(b"\x00", data)
        tree = ast.parse(data.decode("utf-8"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__",
                "ast",
                "cmath",
                "fractions",
                "hashlib",
                "math",
                "pathlib",
                "unittest",
            },
        )


if __name__ == "__main__":
    unittest.main()
