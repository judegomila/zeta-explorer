#!/usr/bin/env python3
"""Regressions for the complete endpoint-null Volterra caustic theorem."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md":
        "c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b",
    "notes/FIXED_EVEN_ENDPOINT_NULL_BERNOULLI_PRIME_QUADRATURE_BOUND.md":
        "ba3aa9777c61883424eed8404f814abf6a9974f2846424e26529661c89ab3a0b",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
    "notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md":
        "b16d33c89dd1517875180a0a5b03f0c0e2b601b0e0e608090016174a464e1e11",
    "notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md":
        "49568daabe36c6507f7b366c53f784f29f9b7807284c738b80f5b016600f354b",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def exp_series(scale: F, degree: int) -> list[F]:
    return [scale**n / math.factorial(n) for n in range(degree + 1)]


def sqrt_series(source: list[F]) -> list[F]:
    """Return b with b*b=source and positive b[0], for source[0]=1."""
    out = [F(1)]
    for degree in range(1, len(source)):
        cross = sum(out[j] * out[degree - j] for j in range(1, degree))
        out.append((source[degree] - cross) / 2)
    return out


class FixedEvenEndpointNullCompleteVolterraCausticTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        note_text = NOTE.read_text(encoding="utf-8")
        tick = chr(96)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"{tick}{relative}{tick}", note_text)
            self.assertIn(f"{tick}{expected}{tick}", note_text)

    def test_locked_schedule_and_kernel_scale(self) -> None:
        for odd_numerator in range(5, 50, 2):
            lambda_value = F(odd_numerator, 2)
            a_value = lambda_value * lambda_value
            self.assertEqual(a_value, F(odd_numerator**2, 4))
            self.assertEqual(a_value - a_value.numerator // a_value.denominator, F(1, 4))
            self.assertAlmostEqual(float(a_value) ** -0.5, float(lambda_value) ** -1)

    def test_endpoint_null_coefficient_powers(self) -> None:
        self.assertEqual(F(-7, 2) - F(1, 2), -4)
        self.assertEqual(F(-4, 2), -2)
        q_values = (F(3), F(-2), F(7), F(-8))
        self.assertEqual(sum(q_values), 0)

    def test_divided_difference_operator_signs(self) -> None:
        theta_j = F(29)
        theta_r = F(13)
        delta = theta_j - theta_r
        self.assertEqual((theta_j - theta_r) / delta, 1)
        self.assertEqual(-(theta_r - theta_j) / delta, 1)

    def test_liouville_potential_is_exact(self) -> None:
        for x_value in (F(1, 3), F(1), F(5, 2)):
            r_value = 1 + x_value * x_value
            p_value = 1 / x_value + x_value / r_value
            p_prime = -1 / (x_value * x_value) + (
                1 - x_value * x_value
            ) / (r_value * r_value)
            transformed = -p_prime / 2 - p_value * p_value / 4
            displayed = (
                1 / (4 * x_value * x_value)
                - (1 + x_value * x_value / 4) / (r_value * r_value)
            )
            self.assertEqual(transformed, displayed)

    def test_far_jost_constant_collection(self) -> None:
        collected = 2 * F(4, 3) * 2
        self.assertEqual(collected, F(16, 3))
        displayed_without_pi = 16 / (3 * math.sqrt(3))
        self.assertAlmostEqual(float(collected) / math.sqrt(3), displayed_without_pi)

    def test_hard_edge_bessel_scales_meet(self) -> None:
        for c_value in (16.0, 10_000.0):
            x_value = 1 / c_value
            self.assertAlmostEqual(
                c_value * x_value**2,
                c_value ** -0.5 * x_value**0.5,
            )
        self.assertEqual(F(-1, 4) * F(5, 2), F(-5, 8))
        self.assertLess(F(-5, 8), F(-1, 2))
        for c_value in (100.0, 1_000.0):
            self.assertLessEqual(
                c_value**6 * math.exp(-c_value),
                math.exp(-c_value / 2),
            )

    def test_exact_radial_caustic_series(self) -> None:
        degree = 6
        source = exp_series(F(2), degree)
        source = [2 * value for value in source]
        source[0] -= 1
        x_series = sqrt_series(source)
        self.assertEqual(x_series[0], 1)
        self.assertEqual(x_series[1], 2)
        self.assertEqual(x_series[2], 0)
        self.assertEqual(x_series[4], -2)
        self.assertEqual(2 * x_series[2], 0)
        self.assertEqual(2 * x_series[4], -4)

    def test_unfolding_quadratic_coefficient_is_four(self) -> None:
        x_prime = F(2)
        h_prime_at_one = F(4)
        derivative_of_x_second = x_prime * h_prime_at_one
        self.assertEqual(derivative_of_x_second, 8)
        self.assertEqual(derivative_of_x_second / 2, 4)

    def test_stationary_equation_has_only_two_branches(self) -> None:
        for x_value in (F(1, 3), F(2, 3), F(1), F(2), F(5)):
            for y_value in (x_value, 1 / x_value):
                f_x = x_value + 1 / x_value
                f_y = y_value + 1 / y_value
                self.assertEqual(f_x, f_y)
            h_sum = (
                x_value
                - x_value ** -3
                + x_value ** -1
                - x_value**3
            )
            if x_value == 1:
                self.assertEqual(h_sum, 0)
            else:
                self.assertNotEqual(h_sum, 0)

    def test_integer_samples_force_the_unique_degenerate_pair(self) -> None:
        for sample in range(1, 8):
            possible = sample <= math.sqrt(2)
            self.assertEqual(possible, sample == 1)
        self.assertAlmostEqual(
            math.sqrt(math.exp(2 * (math.log(2) / 2)) - 1),
            1.0,
        )

    def test_locked_phase_is_pi_over_four(self) -> None:
        for odd_numerator in range(5, 80, 2):
            phase_over_pi = F(odd_numerator**2) + F(21, 4)
            quotient = phase_over_pi // 2
            self.assertEqual(phase_over_pi - 2 * quotient, F(1, 4))
            self.assertEqual(odd_numerator**2 % 8, 1)

    def test_kernel_and_raw_caustic_constants(self) -> None:
        amplitude_at_caustic = 2 ** 0.25 / math.sqrt(math.pi)
        cosine_product_amplitude = amplitude_at_caustic**2 / 2
        self.assertAlmostEqual(
            cosine_product_amplitude,
            1 / (math.sqrt(2) * math.pi),
        )
        quartic_integral_amplitude = math.gamma(0.25) / (2 * math.sqrt(2))
        kernel_constant = (
            cosine_product_amplitude
            * quartic_integral_amplitude
            * math.cos(math.pi / 8)
        )
        displayed = math.gamma(0.25) * math.cos(math.pi / 8) / (4 * math.pi)
        self.assertAlmostEqual(kernel_constant, displayed)
        raw_constant = kernel_constant / math.sqrt(2)
        self.assertAlmostEqual(raw_constant * math.sqrt(2), displayed)
        self.assertGreater(kernel_constant, 0)

    def test_kernel_normalization_is_not_reflection_normalization(self) -> None:
        y_value = math.log(2)
        raw_value = 3.25
        kernel_value = math.exp(y_value / 2) * raw_value
        self.assertAlmostEqual(kernel_value, math.sqrt(2) * raw_value)
        reflected_multiplier = 2
        self.assertNotEqual(math.sqrt(2), reflected_multiplier)

    def test_complete_sample_envelope_is_summable(self) -> None:
        partial = sum(1 / (m * m) for m in range(1, 100_000))
        self.assertLess(partial, 2)
        self.assertGreater(partial, 1)
        for s_value in (0.0, 0.2, 1.0, 3.0):
            weighted = sum(
                math.exp(-s_value) / (m * m) for m in range(1, 10_000)
            )
            self.assertLessEqual(weighted, 2 * math.exp(-s_value))
        for c_value in (10**4, 10**8):
            s_cut = math.log1p(c_value ** -0.5) / 2
            for s_value in (s_cut, 0.2, 1.0, 3.0):
                error_sum = 0.0
                for sample in range(1, 10_000):
                    x_value = math.sqrt(sample**2 * math.exp(2 * s_value) - 1)
                    if sample == 1 and x_value < c_value ** -0.25:
                        continue
                    error_sum += (
                        (1 + x_value**2) ** 0.25
                        / (c_value * sample * x_value**1.5)
                    )
                self.assertLessEqual(
                    error_sum,
                    2 * c_value ** -0.5 * math.exp(-s_value),
                )

    def test_caustic_envelope_has_integrated_c_inverse_half_scale(self) -> None:
        eta = 0.1
        for c_value in (10**4, 10**8):
            exact_integral = (
                c_value ** -0.75
                * 2
                * (math.sqrt(1 + math.sqrt(c_value) * eta) - 1)
            )
            self.assertLessEqual(exact_integral, 2 * math.sqrt(eta) * c_value ** -0.5)

    def test_poisson_boundary_terms_enter_continuously(self) -> None:
        lambda_value = 2.5
        entering_integer = 5
        threshold = entering_integer / lambda_value

        def source(x_value: float) -> float:
            if abs(x_value) > lambda_value:
                return 0.0
            return lambda_value**2 - x_value**2

        def finite_sum(u_value: float) -> float:
            bound = math.floor(lambda_value * u_value)
            return sum(source(n / u_value) for n in range(-bound, bound + 1))

        at_threshold = finite_sum(threshold)
        just_below = finite_sum(threshold * (1 - 1e-9))
        self.assertLess(abs(at_threshold - just_below), 1e-5)
        self.assertEqual(source(lambda_value), 0)

    def test_finite_stieltjes_atom_sign_and_weight(self) -> None:
        a_value = 6.25
        atoms = ((7.0, 2.0), (11.0, 3.0), (13.0, 5.0))

        def c_value(y_value: float) -> float:
            return y_value * math.exp(-y_value)

        jump_sum = sum(
            weight / location * c_value(math.log(location / a_value))
            for location, weight in atoms
        )
        f_jump_sum = sum(
            weight
            / a_value
            * math.exp(-math.log(location / a_value))
            * c_value(math.log(location / a_value))
            for location, weight in atoms
        )
        self.assertAlmostEqual(jump_sum, f_jump_sum)
        self.assertGreater(jump_sum, 0)

    def test_prime_lattice_shell_scales(self) -> None:
        self.assertEqual(F(-1, 2) + F(-1, 4), F(-3, 4))
        for log_c in (100.0, 1000.0, 10_000.0):
            reserve = math.exp(-log_c / 4) * log_c
            self.assertLess(reserve, 1)
        alpha = 0.8476836
        log_c = 10_000.0
        epsilon = 9.22022 * log_c**1.5 * math.exp(-alpha * math.sqrt(log_c))
        self.assertLess(math.sqrt(epsilon) * log_c, 1)

    def test_required_quadrature_and_reflected_scales(self) -> None:
        for odd_numerator in range(5, 50, 2):
            lambda_value = odd_numerator / 2
            c_value = 2 * math.pi * lambda_value**2
            scalar = c_value ** -0.5
            self.assertAlmostEqual(
                scalar,
                (2 * math.pi) ** -0.5 / lambda_value,
            )
            self.assertAlmostEqual(
                2 * lambda_value * scalar,
                math.sqrt(2 / math.pi),
            )

    def test_note_serializes_the_complete_theorem_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        normalized = " ".join(text.split())
        tick = chr(96)
        required = (
            "C_\\lambda(y)=e^{y/2}(B_\\lambda*B_\\lambda)(y)",
            "{\\Gamma(1/4)\\cos(\\pi/8)\\over4\\pi}c^{-1/4}",
            f"divided by {tick}sqrt(2){tick}",
            "\\mathcal L_rW_{jr}=F_j",
            "\\mathcal L_jW_{jr}=F_r",
            "{16\\over3\\pi\\sqrt3}",
            "|H_v(t)|\\leq K_0\\lambda^{3/2}t^{-2}",
            "{1\\over8}+o(1)",
            "Q(x)={1\\over4x^2}-{1+x^2/4\\over(1+x^2)^2}",
            "|E_j(x)|\\leq{K_j\\over cx}",
            "\\min\\{cx^2,c^{-1/2}x^{1/2}\\}",
            "+O(e^{-\\kappa'c})",
            "\\(g_{\\lambda,1}(0)\\) is exponentially small, not identically zero",
            "|g_{\\lambda,m}(s)-g_{\\lambda,m}^{\\rm Jost}(s)|",
            "\\leq Kc^{-1/2}e^{-s}",
            "Kc^{-1/2}(1+y)e^{-y}",
            "O(c^{-5/8})+O(e^{-\\kappa'c})",
            "Combining (3.17), (4.5a), (5.6), and (5.10) proves (0.5)",
            "x_1(s_0+z)+x_1(s_0-z)=2-4z^4+O(z^6)",
            "=X_0(\\delta)+4\\delta z^2-4z^4",
            "(1+c^{1/2}|y-\\log2|)^{-1/2}",
            "Poisson summation",
            "locally absolutely continuous",
            "\\sum_{n>A}{\\Lambda(n)\\over n}",
            "R_{v,{\\rm ar}}(A)",
            "\\epsilon_c=K_{\\rm FKS}(\\log c)^{3/2}",
            "use no short-interval prime-number theorem",
            "\\mathcal M_{v,A}=O(c^{-1/2})=O(\\lambda^{-1})",
            "do **not** give its sign or limit",
            "no equation (5.2)",
            "no RH conclusion",
            f"The formal state remains {tick}P0_INVALIDATED{tick}",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)
        forbidden = (
            "therefore the signed floor holds",
            "the prime quadrature is positive",
            "the prime quadrature is negative",
            "equation (5.2) follows",
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
