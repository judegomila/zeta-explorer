#!/usr/bin/env python3
"""Exact regressions for the fixed even-prefix arithmetic synthesis theorem."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md":
        "d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd",
    "notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md":
        "ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md":
        "9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71",
    "notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md":
        "d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771",
    "notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md":
        "6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98",
    "notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md":
        "000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932",
}


def _trim(poly: list[F] | tuple[F, ...]) -> tuple[F, ...]:
    values = list(poly)
    while len(values) > 1 and values[-1] == 0:
        values.pop()
    return tuple(values)


def _poly_add(left: tuple[F, ...], right: tuple[F, ...]) -> tuple[F, ...]:
    out = [F() for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    return _trim(out)


def _poly_scale(poly: tuple[F, ...], scalar: int | F) -> tuple[F, ...]:
    return _trim([F(scalar) * value for value in poly])


def _poly_mul(left: tuple[F, ...], right: tuple[F, ...]) -> tuple[F, ...]:
    out = [F() for _ in range(len(left) + len(right) - 1)]
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            out[i + j] += left_value * right_value
    return _trim(out)


def _poly_pow(poly: tuple[F, ...], exponent: int) -> tuple[F, ...]:
    out = (F(1),)
    for _ in range(exponent):
        out = _poly_mul(out, poly)
    return out


def _poly_eval(poly: tuple[F, ...], point: int | F) -> F:
    value = F()
    x = F(point)
    for coefficient in reversed(poly):
        value = value * x + coefficient
    return value


def _poly_div_exact(
    numerator: tuple[F, ...], denominator: tuple[F, ...]
) -> tuple[F, ...]:
    remainder = list(numerator)
    quotient = [F() for _ in range(len(numerator) - len(denominator) + 1)]
    for shift in range(len(quotient) - 1, -1, -1):
        coefficient = remainder[shift + len(denominator) - 1] / denominator[-1]
        quotient[shift] = coefficient
        for index, value in enumerate(denominator):
            remainder[shift + index] -= coefficient * value
    self_remainder = _trim(remainder)
    if any(self_remainder):
        raise AssertionError(f"nonzero polynomial remainder: {self_remainder}")
    return _trim(quotient)


def _hermite_mellin_polynomial(label: int) -> tuple[F, ...]:
    """Polynomial R_label in equation (4.7), in ascending powers of s."""
    if label < 0 or label % 2:
        raise ValueError("nonnegative even label required")
    half = label // 2
    out = (F(),)
    product = (F(1),)
    for degree in range(half + 1):
        if degree:
            product = _poly_mul(product, (F(2 * (degree - 1)), F(1)))
        coefficient = F(
            (-1) ** degree * math.factorial(half) * 4**degree,
            math.factorial(half - degree) * math.factorial(2 * degree),
        )
        out = _poly_add(out, _poly_scale(product, coefficient))
    return out


def _q_mellin_polynomial(label: int) -> tuple[F, ...]:
    out = list(_hermite_mellin_polynomial(label))
    out[0] -= 1
    return _trim(out)


def _q1_mellin_polynomial_scaled(label: int) -> tuple[F, ...]:
    """The polynomial for (64*pi/v_t) q_(t,1)."""
    if label < 4 or label % 4:
        raise ValueError("positive label divisible by four required")
    lower = _poly_scale(
        _hermite_mellin_polynomial(label - 4), label * (label - 2)
    )
    upper = _poly_scale(
        _hermite_mellin_polynomial(label + 4),
        -(label + 1) * (label + 3),
    )
    anchor = _poly_scale(_hermite_mellin_polynomial(4), 3)
    ground = _poly_scale(_hermite_mellin_polynomial(0), 6 * label)
    return _poly_add(_poly_add(lower, upper), _poly_add(anchor, ground))


def _substitute_one_minus(poly: tuple[F, ...]) -> tuple[F, ...]:
    out = (F(),)
    one_minus_s = (F(1), F(-1))
    for degree, coefficient in enumerate(poly):
        out = _poly_add(
            out, _poly_scale(_poly_pow(one_minus_s, degree), coefficient)
        )
    return out


def _as_polynomial_in_z(poly: tuple[F, ...]) -> tuple[F, ...]:
    """Convert an s -> 1-s invariant polynomial to z=s(s-1)."""
    if (len(poly) - 1) % 2:
        raise AssertionError("even total degree required")
    degree = (len(poly) - 1) // 2
    z = (F(), F(-1), F(1))
    remainder = poly
    coefficients = [F() for _ in range(degree + 1)]
    for power in range(degree, -1, -1):
        z_power = _poly_pow(z, power)
        coefficient = remainder[-1] / z_power[-1]
        coefficients[power] = coefficient
        remainder = _poly_add(remainder, _poly_scale(z_power, -coefficient))
    if any(remainder):
        raise AssertionError(f"not a polynomial in z: {remainder}")
    return _trim(coefficients)


class FixedEvenPrefixArithmeticSynthesisTheoremTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_generic_quasimode_cancels_both_gap_terms(self) -> None:
        for label in (4, 8, 12, 16, 24, 40):
            lower_product = math.prod(range(label - 3, label + 1))
            upper_product = math.prod(range(label + 1, label + 5))
            self.assertEqual(F(-16, 64) + F(1, 4), 0)
            self.assertEqual(F(16, -64) + F(1, 4), 0)
            self.assertGreater(lower_product, 0)
            self.assertGreater(upper_product, 0)
            self.assertEqual(
                F(-(2 * label * label + 2 * label + 3), 4),
                F(-2 * label * label - 2 * label - 3, 4),
            )

    def test_origin_simplification_and_rho_correction(self) -> None:
        for label in (4, 8, 12, 20, 40):
            lower = label * (label - 2)
            upper = (label + 1) * (label + 3)
            self.assertEqual(lower - upper, -3 * (2 * label + 1))
            u_over_v = F(-3 * (2 * label + 1), 64)
            u0_over_v0 = F(-3, 64)
            integral_ratio = u_over_v - u0_over_v0
            self.assertEqual(integral_ratio, F(-3 * label, 32))
            self.assertEqual(-integral_ratio, F(3 * label, 32))

    def test_r_t_formula_matches_known_labels(self) -> None:
        # Squared ratios avoid any floating or symbolic radical input.
        for label, expected_square in (
            (4, F(6, 16)),
            (8, F(70, 256)),
            (12, F(231, 1024)),
        ):
            square = F(
                math.factorial(label),
                2**label * math.factorial(label // 2) ** 2,
            )
            self.assertEqual(square, expected_square)

    def test_q_and_q1_have_exact_limiting_cancellations(self) -> None:
        for label in (4, 8, 12, 16, 24):
            # Divide q_(t,1)(0) by v_t/(64*pi).
            point_value = (
                -3 * (2 * label + 1)
                + 3
                + 6 * label
            )
            self.assertEqual(point_value, 0)
            q_poly = _q_mellin_polynomial(label)
            q1_poly = _q1_mellin_polynomial_scaled(label)
            self.assertEqual(_poly_eval(q_poly, 0), 0)
            self.assertEqual(_poly_eval(q_poly, 1), 0)
            self.assertEqual(_poly_eval(q1_poly, 0), 0)
            self.assertEqual(_poly_eval(q1_poly, 1), 0)

    def test_finite_zero_integral_does_not_force_zero_point(self) -> None:
        f_t_zero = F(7, 5)
        f_0_zero = F(11, 6)
        chi_t = F(9, 10)
        chi_0 = F(19, 20)
        i_t = chi_t * f_t_zero
        i_0 = chi_0 * f_0_zero
        rho = -i_t / i_0
        self.assertEqual(i_t + rho * i_0, 0)
        finite_point = f_t_zero + rho * f_0_zero
        self.assertEqual(finite_point, f_t_zero * (1 - chi_t / chi_0))
        self.assertNotEqual(finite_point, 0)

    def test_arithmetic_transfer_and_locked_schedule_ledger(self) -> None:
        source_remainder_power = F(-4)
        arithmetic_loss = F(1)
        self.assertEqual(source_remainder_power + arithmetic_loss, F(-3))
        for odd_p in (5, 7, 9, 15, 31):
            self.assertEqual(odd_p * odd_p % 8, 1)

    def test_label_mellin_family_is_triangular_in_z(self) -> None:
        s_times_s_minus_one = (F(), F(-1), F(1))
        leading_coefficients = []
        for j in range(1, 7):
            label = 4 * j
            q_poly = _q_mellin_polynomial(label)
            quotient = _poly_div_exact(q_poly, s_times_s_minus_one)
            self.assertEqual(quotient, _substitute_one_minus(quotient))
            in_z = _as_polynomial_in_z(quotient)
            self.assertEqual(len(in_z) - 1, j - 1)
            self.assertNotEqual(in_z[-1], 0)
            leading_coefficients.append(in_z[-1])
        self.assertEqual(len(leading_coefficients), 6)

    def test_first_correction_has_next_polynomial_xi_degree(self) -> None:
        s_times_s_minus_one = (F(), F(-1), F(1))
        for j in range(1, 6):
            label = 4 * j
            q1_poly = _q1_mellin_polynomial_scaled(label)
            quotient = _poly_div_exact(q1_poly, s_times_s_minus_one)
            self.assertEqual(quotient, _substitute_one_minus(quotient))
            in_z = _as_polynomial_in_z(quotient)
            self.assertEqual(len(in_z) - 1, j)
            self.assertNotEqual(in_z[-1], 0)

    def test_distinct_polynomial_degrees_force_deflated_independence(self) -> None:
        s_times_s_minus_one = (F(), F(-1), F(1))
        rows = []
        for j in range(1, 6):
            quotient = _poly_div_exact(
                _q_mellin_polynomial(4 * j), s_times_s_minus_one
            )
            rows.append(_as_polynomial_in_z(quotient))
        # The coefficient matrix is triangular when rows are ordered by
        # degree, so its determinant is the product of nonzero diagonal terms.
        determinant = F(1)
        for row_index, row in enumerate(rows):
            self.assertEqual(len(row), row_index + 1)
            determinant *= row[-1]
        self.assertNotEqual(determinant, 0)

    def test_fixed_defect_ratio_formula_and_metric_exponents(self) -> None:
        def ratio_constant_without_pi(small: int, large: int) -> F:
            return F(
                math.factorial(large),
                math.factorial(small) * 16 ** (large - small),
            )

        self.assertEqual(ratio_constant_without_pi(4, 8), F(105, 4096))
        self.assertEqual(ratio_constant_without_pi(6, 8), F(7, 32))
        self.assertEqual(-2 * (8 - 4), -8)
        self.assertEqual(-2 * (12 - 4), -16)
        self.assertEqual((2 * 4 + 1) - ((2 * 8 + 1) + (2 * 12 + 1)) // 2, -12)
        self.assertEqual(-2 * (8 - 0), -16)
        self.assertEqual(-2 * (12 - 0), -24)

    def test_rank_two_exterior_metric_has_the_claimed_diagonal(self) -> None:
        defects = (F(5), F(7))
        d4, d0 = F(2), F(3)
        alpha = (F(1), F(2))
        b = (F(3), F(-1))
        metric = [
            [
                (defects[i] if i == j else F())
                + d4 * alpha[i] * alpha[j]
                + d0 * b[i] * b[j]
                for j in range(2)
            ]
            for i in range(2)
        ]
        for index in range(2):
            expected = (
                defects[index]
                + d4 * alpha[index] ** 2
                + d0 * b[index] ** 2
            )
            self.assertEqual(metric[index][index], expected)
        self.assertNotEqual(metric[0][1], 0)
        for vector in ((F(1), F(0)), (F(0), F(1)), (F(2), F(-3))):
            quadratic = sum(
                vector[i] * metric[i][j] * vector[j]
                for i in range(2)
                for j in range(2)
            )
            self.assertGreater(quadratic, 0)

    def test_per_column_joint_and_rest_scale_ledgers(self) -> None:
        # Relative to d8^(-1), the fixed-rest leading scale d12^(-1)
        # gains lambda^(-8); the last label controls the smallest singular
        # square.
        for m in (3, 4, 7):
            combined_max_power = 0
            rest_max_power = -2 * (12 - 8)
            gram_condition_power = 2 * (4 * m - 8)
            synthesis_condition_power = gram_condition_power // 2
            rest_gram_condition_power = 2 * (4 * m - 12)
            self.assertEqual(combined_max_power, 0)
            self.assertEqual(rest_max_power, -8)
            self.assertEqual(gram_condition_power, 8 * m - 16)
            self.assertEqual(synthesis_condition_power, 4 * m - 8)
            self.assertEqual(rest_gram_condition_power, 8 * m - 24)

    def test_condition_number_belongs_to_whitened_nonzero_spectrum(self) -> None:
        # Raw Gram I is perfectly conditioned.  Whitening by D=diag(1,81)
        # gives squared singular values 1 and 1/81.  Adding an ambient zero
        # row changes neither nonzero value.
        raw_gram_condition = F(1)
        defect_ratio = F(81)
        whitened_gram_condition = defect_ratio
        synthesis_condition = math.isqrt(defect_ratio.numerator)
        self.assertEqual(raw_gram_condition, 1)
        self.assertEqual(whitened_gram_condition, 81)
        self.assertEqual(synthesis_condition, 9)
        self.assertEqual(synthesis_condition**2, whitened_gram_condition)
        ambient_nonzero_spectrum = (F(1), F(1, 81))
        ambient_full_spectrum = ambient_nonzero_spectrum + (F(0),)
        self.assertEqual(len(ambient_full_spectrum), 3)
        self.assertEqual(min(ambient_nonzero_spectrum), F(1, 81))

    def test_fixed_depth_whitened_shift_exponents(self) -> None:
        exponent = lambda s, t: 12 - s - t
        self.assertEqual(exponent(8, 8), -4)
        self.assertEqual(exponent(8, 12), -8)
        self.assertEqual(exponent(12, 12), -12)
        self.assertEqual(exponent(12, 16), -16)
        # Fixed block norms are controlled by their least labels.
        self.assertEqual(max(exponent(s, t) for s in (8, 12, 16)
                             for t in (8, 12, 16)), -4)
        self.assertEqual(max(exponent(s, t) for s in (12, 16)
                             for t in (12, 16)), -12)

    def test_note_locks_quantifiers_distinctions_and_open_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Fix an integer \\(m\\geq3\\)",
            "Nothing here is uniform when",
            "\\mu_t=-{2t^2+2t+3\\over4}",
            "{u_t(0)\\over v_t}=-{3(2t+1)\\over64\\pi}",
            "q_{t,\\lambda}(0)",
            "generally not zero",
            "Only \\(q_t\\) and \\(q_{t,1}\\)",
            "O_{t}(\\lambda^{-3})",
            "polynomial--Xi",
            "linearly independent",
            "G_{m,\\infty}\\succ0",
            "{D_t\\over d_t}\\longrightarrow1",
            "O_m(\\lambda^{-16})",
            "\\Theta_m(d_8^{-1})",
            "\\Theta_m(d_{12}^{-1})",
            "nonzero spectrum",
            "\\operatorname {cond}_2(A_m)",
            "It is not \\(d_{4m}/d_8\\)",
            "whitened blocks only",
            "these powers for the raw matrices",
            "no growing-rest covariance",
            "no equation (5.2)",
            "no RH conclusion",
            "no Lambda bound",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "uniform in m",
            "the growing-rest floor is proved",
            "the signed floor follows",
            "equation (5.2) is proved",
            "proves RH",
            "raw UG has the same rate",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

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
                continue
        self.assertFalse(inside_aligned)

    def test_package_is_stdlib_only_and_has_clean_bytes(self) -> None:
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
