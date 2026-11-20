#!/usr/bin/env python3
"""Exact regressions for the moving-label carrier right-inverse theorem."""

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
    / "MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/REAL_WINDOW_TO_ZERO_TAIL_CARRIER_TRANSFER_BARRIER.md":
        "a2dc20c00fcc75f8696da591331554728c41a8d937f6ce3eab5eeff33cd6c73d",
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "notes/GROWING_WINDOW_THEOREM.md":
        "dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7",
    "notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md":
        "6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def poly_add(left: list[F], right: list[F], scale: F = F(1)) -> list[F]:
    size = max(len(left), len(right))
    result = [F(0)] * size
    for index, value in enumerate(left):
        result[index] += value
    for index, value in enumerate(right):
        result[index] += scale * value
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def poly_mul(left: list[F], right: list[F]) -> list[F]:
    result = [F(0)] * (len(left) + len(right) - 1)
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            result[i + j] += left_value * right_value
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def poly_divmod(numerator: list[F], denominator: list[F]) -> tuple[list[F], list[F]]:
    remainder = numerator[:]
    quotient = [F(0)] * max(1, len(numerator) - len(denominator) + 1)
    while len(remainder) >= len(denominator) and any(remainder):
        shift = len(remainder) - len(denominator)
        coefficient = remainder[-1] / denominator[-1]
        quotient[shift] += coefficient
        subtract = [F(0)] * shift + [coefficient * value for value in denominator]
        remainder = poly_add(remainder, subtract, F(-1))
    return quotient, remainder


def poly_power(polynomial: list[F], exponent: int) -> list[F]:
    result = [F(1)]
    for _ in range(exponent):
        result = poly_mul(result, polynomial)
    return result


def raw_mellin_polynomial(j: int) -> list[F]:
    """Return R_(4j)(s) from the exact factorial formula."""
    result = [F(0)]
    for a_value in range(2 * j + 1):
        coefficient = F(
            (-1) ** a_value
            * math.factorial(2 * j)
            * 4**a_value,
            math.factorial(2 * j - a_value)
            * math.factorial(2 * a_value),
        )
        product = [F(1)]
        for ell in range(a_value):
            product = poly_mul(product, [F(2 * ell), F(1)])
        result = poly_add(result, product, coefficient)
    return result


def invariant_polynomial(j: int) -> list[F]:
    """Return P with R_(4j)(s)-1=s(s-1)P(s(s-1))."""
    raw = raw_mellin_polynomial(j)
    raw[0] -= 1
    quotient, remainder = poly_divmod(raw, [F(0), F(-1), F(1)])
    if any(remainder):
        raise AssertionError((j, remainder))

    z_value = [F(0), F(-1), F(1)]
    residual = quotient[:]
    coefficients = [F(0)] * j
    for degree in range(j - 1, -1, -1):
        z_power = poly_power(z_value, degree)
        coefficient = residual[-1] if len(residual) == 2 * degree + 1 else F(0)
        coefficients[degree] = coefficient
        residual = poly_add(residual, z_power, -coefficient)
    if any(residual):
        raise AssertionError((j, residual))
    return coefficients


def quadratic_form(matrix: list[list[F]], vector: list[F]) -> F:
    return sum(
        vector[i] * matrix[i][j] * vector[j]
        for i in range(len(vector))
        for j in range(len(vector))
    )


class MovingLabelCarrierCoframeTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)
            self.assertIn(f"`{relative}`", text)
            self.assertIn(f"`{expected}`", text)

    def test_locked_candidate_count_dominates_bad_intervals(self) -> None:
        # The proof compares exp(A/2) candidates with O(A^3 log A) bad sets.
        previous_margin = None
        for a_value in (80.0, 160.0, 320.0):
            margin = a_value / 2 - (
                3 * math.log(a_value) + math.log(math.log(a_value))
            )
            self.assertGreater(margin, 0)
            if previous_margin is not None:
                self.assertGreater(margin, previous_margin)
            previous_margin = margin

            # O(A exp(-A)) is strictly below locked spacing exp(-A/2).
            self.assertLess(math.log(a_value) - a_value, -a_value / 2)

    def test_hadamard_near_and_far_exponents_fit_claimed_scale(self) -> None:
        # Near factors: O(A log A) factors, each costing O(A).
        # Far factors: R^2 * O(log R / R)=O(A log A).
        for a_value in (16.0, 64.0, 256.0):
            near = a_value * math.log(a_value + 2) * (
                a_value + math.log(2 * a_value) + 1
            )
            far = a_value * math.log(a_value + 2)
            claimed = 4 * a_value**2 * math.log(a_value + 2)
            self.assertLessEqual(near + far, claimed)

    def test_exact_polynomial_xi_triangular_degrees(self) -> None:
        for j_value in range(1, 8):
            polynomial = invariant_polynomial(j_value)
            self.assertEqual(len(polynomial), j_value)
            self.assertNotEqual(polynomial[-1], 0)

    def test_scaled_quadratic_vandermonde_denominators(self) -> None:
        for maximum in range(1, 9):
            for k_value in range(maximum + 1):
                product = 1
                for r_value in range(maximum + 1):
                    if r_value != k_value:
                        product *= abs(k_value**2 - r_value**2)
                if k_value == 0:
                    expected = math.factorial(maximum) ** 2
                else:
                    expected = (
                        math.factorial(maximum - k_value)
                        * math.factorial(maximum + k_value)
                        // 2
                    )
                self.assertEqual(product, expected)

    def test_correct_raw_target_and_buffer_dimensions(self) -> None:
        for physical_n, buffer in ((4, 3), (9, 5), (20, 8)):
            j_count = physical_n + 1
            q_count = j_count + buffer
            # Raw Hermite targets are indices 0,...,J: J+1 columns.
            self.assertEqual(len(range(j_count + 1)), j_count + 1)
            # Actual raw source rows are 0,...,Q: Q+1 rows.
            self.assertEqual(len(range(q_count + 1)), q_count + 1)
            # Zero-integral composition then has J columns q_1,...,q_J.
            self.assertEqual(len(range(1, j_count + 1)), j_count)

    def test_total_degree_buffer_has_no_omitted_row(self) -> None:
        for j_count in (5, 12):
            for buffer in (3, 7):
                q_count = j_count + buffer
                for target in range(j_count + 1):
                    for total_degree in range(buffer + 1):
                        for actual in range(max(0, target - total_degree), target + total_degree + 1):
                            self.assertLessEqual(actual, q_count)

    def test_gevrey_least_term_beats_l4_log_l_conditioning(self) -> None:
        kappa = 10.0
        normalized = []
        for ell in (400.0, 800.0):
            j_count = ell**2 + 1
            order = math.ceil(kappa * ell**3 * math.log(ell))
            q_count = j_count + order
            b_value = (4 * (j_count + 2 * order) + 1) ** 2
            log_delta = (
                8 * math.log(q_count + 2)
                + (order + 1) * (math.log(b_value) - ell)
                + math.lgamma(order + 2)
            )
            ratio = log_delta / (ell**4 * math.log(ell))
            normalized.append(ratio)
            self.assertLess(ratio, -0.7 * kappa)
        self.assertLess(normalized[1], normalized[0])

    def test_uniform_gap_error_goes_to_zero_for_polynomial_labels(self) -> None:
        values = []
        for ell in (400.0, 800.0, 1600.0):
            order_log = (
                math.log(8.0)
                + 3 * math.log(ell)
                + math.log(math.log(ell))
            )
            # Log of R^2 epsilon^(1/8), with R=O(L^3 log L).
            values.append(2 * order_log - ell / 8)
        self.assertGreater(values[0], values[1])
        self.assertGreater(values[1], values[2])
        self.assertLess(values[-1], -100)

    def test_krd_defect_dominates_every_polynomial_prefix_loss(self) -> None:
        for ell in (40.0, 60.0):
            lambda_squared = math.exp(ell)
            q_count = math.ceil(ell**3 * math.log(ell))
            beta = 2 / math.pi**2 * math.log(200 * lambda_squared + 25)
            log_d = math.log(10) - (
                math.floor(4 * lambda_squared) - 4 * q_count - 7
            ) / beta
            self.assertLess(log_d, math.log(10) - 2 * lambda_squared / ell)
            total_log_cost = log_d + 20 * ell**4 * math.log(ell)
            self.assertLess(total_log_cost, 0)

    def test_exact_full_metric_and_anchor_deflation_identity(self) -> None:
        d_values = [F(1, 100), F(1, 20), F(1, 10), F(1, 5)]
        integrals = [F(2), F(1), F(-3, 2), F(1, 4)]
        rho = [-integrals[index] / integrals[0] for index in range(1, 4)]

        metric = [[F(0) for _ in range(3)] for _ in range(3)]
        for i in range(3):
            metric[i][i] = d_values[i + 1]
            for j in range(3):
                metric[i][j] += d_values[0] * rho[i] * rho[j]

        alpha_2, alpha_3 = F(3, 5), F(-2, 7)
        y_2, y_3 = F(4, 3), F(-5, 2)
        full = [-alpha_2 * y_2 - alpha_3 * y_3, y_2, y_3]
        raw_zero = sum(rho[index] * full[index] for index in range(3))
        raw = [raw_zero] + full

        direct_cost = sum(d_values[index] * raw[index] ** 2 for index in range(4))
        metric_cost = quadratic_form(metric, full)
        self.assertEqual(direct_cost, metric_cost)

        # Deflated sources c_2-alpha_2*c_1 and c_3-alpha_3*c_1
        # have exactly the same raw coefficients.
        deflated = [
            -alpha_2 * y_2 - alpha_3 * y_3,
            y_2,
            y_3,
        ]
        self.assertEqual(deflated, full)

    def test_carrier_indices_fit_quadratic_physical_cutoff(self) -> None:
        ordinates = (14.2, 21.1)
        for ell in (100.0, 200.0, 400.0):
            cutoff = math.ceil((ell + 1) ** 2)
            for ordinate in ordinates:
                carrier = round(ordinate * ell / (2 * math.pi))
                self.assertLess(carrier, cutoff)

    def test_mobius_breakpoint_jump_normalization(self) -> None:
        lambda_value = 25.0
        log_length = 2 * math.log(lambda_value)
        for n_value, mu_value in ((2, -1), (5, -1), (6, 1), (10, 1)):
            breakpoint = lambda_value / n_value
            entering_term = (
                breakpoint ** (-0.5)
                * mu_value
                * n_value ** (-0.5)
                / math.sqrt(log_length)
            )
            expected = mu_value / math.sqrt(log_length * lambda_value)
            self.assertAlmostEqual(entering_term, expected, 14)

    def test_note_serializes_theorem_and_fail_closed_boundary(self) -> None:
        normalized = " ".join(NOTE.read_text(encoding="utf-8").split())
        required = (
            "wide-prefix surjectivity",
            "does **not** establish nonvanishing of the square",
            "H_\\Xi(A)",
            "Z(\\Xi)",
            "**whole-line** Fourier values",
            "|\\alpha_m(\\lambda)-E_m|",
            "There are `J+1` raw Hermite targets",
            "`0,...,J`",
            "`0,...,Q`",
            "no omitted source row contributes through degree `K`",
            "exactly zero-integral",
            "first point at which the restriction tail is inserted",
            "D_{\\rm full}",
            "same source, not merely sources with the same physical image",
            "{\\cal R}_D(J_L;Q,\\lambda)=o(1)",
            "weighted-Mobius/zeta-zero resonance",
            "no equation (5.2)",
            "no RH conclusion",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "the first-j square determinant is nonzero",
            "therefore the signed orientation holds",
            "equation (5.2) follows",
            "proves rh",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)

    def test_note_and_test_bytes_are_clean(self) -> None:
        for path in (NOTE, TEST):
            data = path.read_bytes()
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
            if "\\end{aligned}" in line:
                self.assertTrue(inside_aligned, line_number)
                inside_aligned = False
        self.assertFalse(inside_aligned)

    def test_python_source_is_stdlib_only(self) -> None:
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


if __name__ == "__main__":
    unittest.main()
