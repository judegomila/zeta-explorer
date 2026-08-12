#!/usr/bin/env python3
"""Exact regressions for the endpoint-null Bernoulli prime-quadrature bound."""

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
    / "FIXED_EVEN_ENDPOINT_NULL_BERNOULLI_PRIME_QUADRATURE_BOUND.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md":
        "c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b",
    "notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md":
        "49568daabe36c6507f7b366c53f784f29f9b7807284c738b80f5b016600f354b",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def bernoulli_two(x: float) -> float:
    fractional = x - math.floor(x)
    return fractional * fractional - fractional + 1 / 6


def zeta_upper(s: float, cutoff: int = 20_000) -> float:
    partial = sum(n ** (-s) for n in range(1, cutoff + 1))
    return partial + cutoff ** (1 - s) / (s - 1)


class FixedEvenEndpointNullBernoulliPrimeQuadratureTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        note_text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", note_text)
            self.assertIn(f"`{expected}`", note_text)

    def test_locked_schedule_has_quarter_fractional_part(self) -> None:
        for odd_numerator in range(5, 60, 2):
            a_value = F(odd_numerator * odd_numerator, 4)
            self.assertEqual(
                a_value - a_value.numerator // a_value.denominator,
                F(1, 4),
            )
            lambda_value = F(odd_numerator, 2)
            self.assertEqual(a_value, lambda_value * lambda_value)

    def test_bernoulli_normalization_and_locked_endpoint_value(self) -> None:
        self.assertEqual(F(1, 16) - F(1, 4) + F(1, 6), F(-1, 48))
        samples = [bernoulli_two(j / 1000) for j in range(1001)]
        self.assertLessEqual(max(abs(value) for value in samples), 1 / 6)

    def test_absolute_fourier_series_normalization(self) -> None:
        # B_2(x)=(2*pi^2)^(-1) sum_(k!=0) e(kx)/k^2.
        for x_value in (0.125, 0.25, 0.37, 0.625):
            truncation = sum(
                cmath.exp(2j * math.pi * k * x_value) / (k * k)
                for k in range(-20_000, 20_001)
                if k
            ) / (2 * math.pi**2)
            self.assertAlmostEqual(truncation.real, bernoulli_two(x_value), 9)
            self.assertAlmostEqual(truncation.imag, 0.0, 12)

    def test_van_der_corput_constants_and_decay_exponents(self) -> None:
        # 12/sqrt(4*pi)=6/sqrt(pi), and 8/(4*pi)=2/pi.
        self.assertAlmostEqual(12 / math.sqrt(4 * math.pi), 6 / math.sqrt(math.pi))
        self.assertAlmostEqual(8 / (4 * math.pi), 2 / math.pi)
        exterior_decay = F(1)
        same_sign_phase_decay = F(1, 4)
        opposite_sign_phase_decay = F(1, 2)
        self.assertEqual(exterior_decay + same_sign_phase_decay, F(5, 4))
        self.assertEqual(exterior_decay + opposite_sign_phase_decay, F(3, 2))

    def test_phase_derivative_lower_bounds_in_all_quadrants(self) -> None:
        a_value = 9.25
        for y_value in (0.0, 0.03, 0.7, 2.0):
            for k_value, ell_value in (
                (1, 1),
                (2, 5),
                (-3, -1),
                (1, -4),
                (-5, 2),
            ):
                for fraction in (0.0, 0.17, 0.5, 0.91, 1.0):
                    t_value = fraction * y_value
                    common_lower = (
                        4
                        * math.pi
                        * a_value
                        * math.sqrt(abs(k_value * ell_value))
                        * math.exp(y_value / 2)
                    )
                    if k_value * ell_value > 0:
                        second = 2 * math.pi * a_value * (
                            k_value * math.exp(t_value)
                            + ell_value * math.exp(y_value - t_value)
                        )
                        self.assertGreaterEqual(abs(second) + 1e-12, common_lower)
                    else:
                        first = 2 * math.pi * a_value * (
                            k_value * math.exp(t_value)
                            - ell_value * math.exp(y_value - t_value)
                        )
                        self.assertGreaterEqual(abs(first) + 1e-12, common_lower)

    def test_quadrant_sums_produce_the_displayed_constants(self) -> None:
        zeta_nine_fourths = zeta_upper(9 / 4)
        zeta_five_halves = zeta_upper(5 / 2)
        same_quadrants = 2 * zeta_nine_fourths**2
        opposite_quadrants = 2 * zeta_five_halves**2
        fourier_prefactor = 1 / (4 * math.pi**4)
        k_plus = 3 * zeta_nine_fourths**2 / math.pi ** (9 / 2)
        k_minus = zeta_five_halves**2 / math.pi**5
        self.assertAlmostEqual(
            fourier_prefactor * (6 / math.sqrt(math.pi)) * same_quadrants,
            k_plus,
        )
        self.assertAlmostEqual(
            fourier_prefactor * (2 / math.pi) * opposite_quadrants,
            k_minus,
        )
        self.assertGreater(k_plus, 0)
        self.assertGreater(k_minus, 0)

    def test_mean_zero_continuous_term_has_a_squared_a_inverse_gain(self) -> None:
        # One Fourier integration by parts gives
        # |int g_A|<=zeta(3)/(pi^3*A), then int(g*g)=(int g)^2.
        zeta_three = zeta_upper(3.0)
        a_value = 25 / 4
        one_dimensional_bound = zeta_three / (math.pi**3 * a_value)
        convolution_bound = zeta_three**2 / (math.pi**6 * a_value**2)
        self.assertAlmostEqual(one_dimensional_bound**2, convolution_bound)
        self.assertEqual(F(-1, 2) * 2, -1)

    def test_finite_stieltjes_boundary_and_jump_signs(self) -> None:
        a_value = 6.25
        endpoint = 24.0
        y_endpoint = math.log(endpoint / a_value)
        atoms = ((7.0, 2.0), (11.0, 3.0), (13.0, 5.0), (19.0, 7.0))

        def f_value(y_value: float) -> float:
            return y_value * math.exp(-y_value)

        # Each atom contributes its weight on [log(n/A),Y].
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

        # If C(y)=e^y F(y), then A^(-1)F(log(n/A))=n^(-1)C(log(n/A)).
        for location, _ in atoms:
            y_value = math.log(location / a_value)
            c_value = math.exp(y_value) * f_value(y_value)
            self.assertAlmostEqual(f_value(y_value) / a_value, c_value / location)

    def test_archimedean_integration_by_parts_constant(self) -> None:
        # |C_A(y)|<=y*e^(-y)/36 and the logarithmic derivative adds e^(-3y).
        self.assertEqual(F(1, 36) * F(1, 4 * 4), F(1, 576))
        for a_value in (6.25, 20.25, 100.25):
            y_value = 0.7
            z_value = a_value ** -2 * math.exp(-2 * y_value)
            q_prime = 2 * z_value / (1 - z_value)
            expected = 2 * a_value ** -2 * math.exp(-2 * y_value) / (1 - z_value)
            self.assertAlmostEqual(q_prime, expected)

    def test_chebyshev_partial_summation_factors(self) -> None:
        beta_same = F(5, 4)
        beta_opposite = F(3, 2)
        self.assertEqual((1 + beta_same) / beta_same, F(9, 5))
        self.assertEqual((1 + beta_opposite) / beta_opposite, F(5, 3))

    def test_required_scale_and_reflected_prefactor(self) -> None:
        # A=lambda^2, so A^(-1/2)=lambda^(-1); multiplying by lambda is O(1).
        for odd_numerator in range(5, 30, 2):
            lambda_value = odd_numerator / 2
            a_value = lambda_value * lambda_value
            self.assertAlmostEqual(a_value ** -0.5, lambda_value ** -1)
            self.assertAlmostEqual(lambda_value * a_value ** -0.5, 1.0)

    def test_note_serializes_exact_theorem_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        required = (
            "For every `A>1`",
            "K_+={3\\zeta(9/4)^2\\over\\pi^{9/2}}",
            "K_-={\\zeta(5/2)^2\\over\\pi^5}",
            "\\sum_{n>A}{\\Lambda(n)\\over n}",
            "R_{\\rm ar}(A)",
            "{9C_\\psi\\over5}",
            "{5C_\\psi\\over3}",
            "{\\zeta(3)^2\\over\\pi^6}A^{-2}",
            "\\int_0^\\infty C_A(y)\\,dy =\\left(\\int_0^\\infty g_A(t)\\,dt\\right)^2",
            "\\mathcal M_{11,A}=O(\\lambda^{-1})",
            "No PNT cancellation is needed",
            "right-continuous convention",
            "same-sign stationary phases",
            "e\\!\\left(\\mathord\\pm p\\sqrt{|k\\ell|n}\\right)",
            "does **not** give a limit or a sign",
            "no statement about the complete post-sum physical outer state",
            "The formal state remains `P0_INVALIDATED`",
            "RH all remain open",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)
        forbidden = (
            "therefore the signed floor holds",
            "the scalar is positive",
            "the scalar is negative",
            "the complete outer tail is bounded",
            "proves RH",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

    def test_aligned_rows_never_end_in_one_raw_backslash(self) -> None:
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

    def test_python_source_is_stdlib_only_and_files_have_clean_bytes(self) -> None:
        tree = ast.parse(TEST.read_text(encoding="utf-8"))
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
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            for line_number, line in enumerate(payload.splitlines(), 1):
                self.assertFalse(
                    line.endswith((b" ", b"\t")),
                    f"{path.name}:{line_number}",
                )


if __name__ == "__main__":
    unittest.main()
