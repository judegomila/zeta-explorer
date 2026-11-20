#!/usr/bin/env python3
"""Exact regressions for the two-frequency phase transversality theorem."""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md":
        "ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1",
    "notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md":
        "a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc",
    "notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md":
        "00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff",
}

Gaussian = tuple[F, F]
Laurent = dict[int, Gaussian]
Poly = tuple[F, ...]  # ascending coefficients
Interval = tuple[F, F]


def g_add(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def g_sub(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] - right[0], left[1] - right[1]


def g_mul(left: Gaussian, right: Gaussian) -> Gaussian:
    return (
        left[0] * right[0] - left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def g_scale(scale: F, value: Gaussian) -> Gaussian:
    return scale * value[0], scale * value[1]


def g_conjugate(value: Gaussian) -> Gaussian:
    return value[0], -value[1]


def g_inverse(value: Gaussian) -> Gaussian:
    norm = value[0] ** 2 + value[1] ** 2
    return value[0] / norm, -value[1] / norm


def g_div(left: Gaussian, right: Gaussian) -> Gaussian:
    return g_mul(left, g_inverse(right))


def g_power(value: Gaussian, exponent: int) -> Gaussian:
    result = (F(1), F(0))
    factor = value
    remaining = exponent
    while remaining:
        if remaining % 2:
            result = g_mul(result, factor)
        factor = g_mul(factor, factor)
        remaining //= 2
    return result


def inverse_square(edge: F, frequency: F) -> Gaussian:
    return g_inverse(g_power((edge, frequency), 2))


def laurent_add_term(poly: Laurent, exponent: int, value: Gaussian) -> None:
    poly[exponent] = g_add(poly.get(exponent, (F(0), F(0))), value)
    if poly[exponent] == (F(0), F(0)):
        del poly[exponent]


def laurent_multiply(left: Laurent, right: Laurent) -> Laurent:
    result: Laurent = {}
    for left_exponent, left_value in left.items():
        for right_exponent, right_value in right.items():
            laurent_add_term(
                result,
                left_exponent + right_exponent,
                g_mul(left_value, right_value),
            )
    return result


def laurent_subtract(left: Laurent, right: Laurent) -> Laurent:
    result = dict(left)
    for exponent, value in right.items():
        laurent_add_term(result, exponent, g_scale(F(-1), value))
    return result


def p_normalize(poly: Poly) -> Poly:
    values = list(poly)
    while len(values) > 1 and values[-1] == 0:
        values.pop()
    return tuple(values) if values else (F(0),)


def p_const(value: int | F) -> Poly:
    return (F(value),)


def p_add(left: Poly, right: Poly) -> Poly:
    length = max(len(left), len(right))
    return p_normalize(tuple(
        (left[index] if index < len(left) else F(0))
        + (right[index] if index < len(right) else F(0))
        for index in range(length)
    ))


def p_neg(poly: Poly) -> Poly:
    return tuple(-value for value in poly)


def p_sub(left: Poly, right: Poly) -> Poly:
    return p_add(left, p_neg(right))


def p_scale(scale: F, poly: Poly) -> Poly:
    return p_normalize(tuple(scale * value for value in poly))


def p_mul(left: Poly, right: Poly) -> Poly:
    result = [F(0)] * (len(left) + len(right) - 1)
    for left_index, left_value in enumerate(left):
        for right_index, right_value in enumerate(right):
            result[left_index + right_index] += left_value * right_value
    return p_normalize(tuple(result))


def p_power(poly: Poly, exponent: int) -> Poly:
    result = p_const(1)
    factor = poly
    remaining = exponent
    while remaining:
        if remaining % 2:
            result = p_mul(result, factor)
        factor = p_mul(factor, factor)
        remaining //= 2
    return result


def p_derivative(poly: Poly) -> Poly:
    if len(poly) == 1:
        return p_const(0)
    return p_normalize(tuple(
        F(index) * poly[index] for index in range(1, len(poly))
    ))


def p_divmod(dividend: Poly, divisor: Poly) -> tuple[Poly, Poly]:
    dividend = p_normalize(dividend)
    divisor = p_normalize(divisor)
    if divisor == p_const(0):
        raise ZeroDivisionError
    if len(dividend) < len(divisor):
        return p_const(0), dividend
    remainder = list(dividend)
    quotient = [F(0)] * (len(dividend) - len(divisor) + 1)
    while len(remainder) >= len(divisor) and any(remainder):
        degree = len(remainder) - len(divisor)
        coefficient = remainder[-1] / divisor[-1]
        quotient[degree] = coefficient
        for index, value in enumerate(divisor):
            remainder[index + degree] -= coefficient * value
        while len(remainder) > 1 and remainder[-1] == 0:
            remainder.pop()
    return p_normalize(tuple(quotient)), p_normalize(tuple(remainder))


def p_gcd(left: Poly, right: Poly) -> Poly:
    left = p_normalize(left)
    right = p_normalize(right)
    while right != p_const(0):
        _, remainder = p_divmod(left, right)
        left, right = right, remainder
    return p_scale(F(1, 1) / left[-1], left)


def p_eval(poly: Poly, value: F) -> F:
    result = F(0)
    for coefficient in reversed(poly):
        result = result * value + coefficient
    return result


@dataclass(frozen=True)
class Rat:
    numerator: Poly
    denominator: Poly

    @staticmethod
    def make(numerator: Poly, denominator: Poly = p_const(1)) -> "Rat":
        numerator = p_normalize(numerator)
        denominator = p_normalize(denominator)
        if denominator == p_const(0):
            raise ZeroDivisionError
        if numerator == p_const(0):
            return Rat(p_const(0), p_const(1))
        common = p_gcd(numerator, denominator)
        numerator, numerator_remainder = p_divmod(numerator, common)
        denominator, denominator_remainder = p_divmod(denominator, common)
        if numerator_remainder != p_const(0) or denominator_remainder != p_const(0):
            raise AssertionError("non-exact rational-function cancellation")
        scale = F(1, 1) / denominator[-1]
        return Rat(p_scale(scale, numerator), p_scale(scale, denominator))


def r_const(value: int | F) -> Rat:
    return Rat.make(p_const(value))


def r_add(left: Rat, right: Rat) -> Rat:
    return Rat.make(
        p_add(
            p_mul(left.numerator, right.denominator),
            p_mul(right.numerator, left.denominator),
        ),
        p_mul(left.denominator, right.denominator),
    )


def r_neg(value: Rat) -> Rat:
    return Rat.make(p_neg(value.numerator), value.denominator)


def r_sub(left: Rat, right: Rat) -> Rat:
    return r_add(left, r_neg(right))


def r_mul(left: Rat, right: Rat) -> Rat:
    return Rat.make(
        p_mul(left.numerator, right.numerator),
        p_mul(left.denominator, right.denominator),
    )


def r_div(left: Rat, right: Rat) -> Rat:
    return Rat.make(
        p_mul(left.numerator, right.denominator),
        p_mul(left.denominator, right.numerator),
    )


def r_power(value: Rat, exponent: int) -> Rat:
    return Rat.make(
        p_power(value.numerator, exponent),
        p_power(value.denominator, exponent),
    )


ComplexRat = tuple[Rat, Rat]


def c_add(left: ComplexRat, right: ComplexRat) -> ComplexRat:
    return r_add(left[0], right[0]), r_add(left[1], right[1])


def c_sub(left: ComplexRat, right: ComplexRat) -> ComplexRat:
    return r_sub(left[0], right[0]), r_sub(left[1], right[1])


def c_mul(left: ComplexRat, right: ComplexRat) -> ComplexRat:
    return (
        r_sub(r_mul(left[0], right[0]), r_mul(left[1], right[1])),
        r_add(r_mul(left[0], right[1]), r_mul(left[1], right[0])),
    )


def c_conjugate(value: ComplexRat) -> ComplexRat:
    return value[0], r_neg(value[1])


def c_inverse(value: ComplexRat) -> ComplexRat:
    norm = r_add(r_power(value[0], 2), r_power(value[1], 2))
    return r_div(value[0], norm), r_neg(r_div(value[1], norm))


def c_div(left: ComplexRat, right: ComplexRat) -> ComplexRat:
    return c_mul(left, c_inverse(right))


def c_power(value: ComplexRat, exponent: int) -> ComplexRat:
    result = (r_const(1), r_const(0))
    factor = value
    remaining = exponent
    while remaining:
        if remaining % 2:
            result = c_mul(result, factor)
        factor = c_mul(factor, factor)
        remaining //= 2
    return result


def inverse_square_symbolic(multiplier: int) -> ComplexRat:
    # (1+i*n*x)^-2, written over real rational functions in x.
    x = (F(0), F(1))
    x_squared = p_mul(x, x)
    base = p_add(p_const(1), p_scale(F(multiplier**2), x_squared))
    denominator = p_power(base, 2)
    real = Rat.make(
        p_sub(p_const(1), p_scale(F(multiplier**2), x_squared)),
        denominator,
    )
    imaginary = Rat.make(p_scale(F(-2 * multiplier), x), denominator)
    return real, imaginary


F_POLY: Poly = tuple(F(value) for value in (
    17, 384, 3777, 20545, 63735, 95025, -21721,
    -299493, -345180, 18595, 159276, -29616, 832,
))

N_POLY: Poly = tuple(F(value) for value in (
    -16, -408, -4605, -28120, -85932, -10920, 905170,
    3230760, 4607940, 794048, -4553853, -2516304,
    1380640, -103680, 768,
))

ROOT_INTERVALS = (
    (F(34447, 50000), F(13779, 20000), 1),
    (F(41749, 20000), F(104373, 50000), -1),
    (F(38903, 6250), F(622449, 100000), 1),
    (F(2898161, 100000), F(1449081, 50000), -1),
)


def lift_even(poly: Poly) -> Poly:
    result = [F(0)] * (2 * (len(poly) - 1) + 1)
    for index, coefficient in enumerate(poly):
        result[2 * index] = coefficient
    return tuple(result)


def sturm_sequence(poly: Poly) -> tuple[Poly, ...]:
    sequence = [p_normalize(poly), p_derivative(poly)]
    while sequence[-1] != p_const(0):
        _, remainder = p_divmod(sequence[-2], sequence[-1])
        if remainder == p_const(0):
            break
        sequence.append(p_neg(remainder))
    return tuple(sequence)


def sign(value: F) -> int:
    return (value > 0) - (value < 0)


def variations(signs: list[int]) -> int:
    nonzero = [value for value in signs if value]
    return sum(left != right for left, right in zip(nonzero, nonzero[1:]))


def sturm_variations_at(sequence: tuple[Poly, ...], point: F) -> int:
    return variations([sign(p_eval(poly, point)) for poly in sequence])


def sturm_variations_positive_infinity(sequence: tuple[Poly, ...]) -> int:
    return variations([sign(poly[-1]) for poly in sequence])


def sturm_count(sequence: tuple[Poly, ...], left: F, right: F) -> int:
    return sturm_variations_at(sequence, left) - sturm_variations_at(
        sequence, right
    )


def i_add(left: Interval, right: Interval) -> Interval:
    return left[0] + right[0], left[1] + right[1]


def i_neg(value: Interval) -> Interval:
    return -value[1], -value[0]


def i_mul(left: Interval, right: Interval) -> Interval:
    products = tuple(
        left[left_index] * right[right_index]
        for left_index in (0, 1)
        for right_index in (0, 1)
    )
    return min(products), max(products)


def i_inverse(value: Interval) -> Interval:
    if value[0] <= 0 <= value[1]:
        raise ZeroDivisionError
    return min(F(1, 1) / value[0], F(1, 1) / value[1]), max(
        F(1, 1) / value[0], F(1, 1) / value[1]
    )


def i_div(left: Interval, right: Interval) -> Interval:
    return i_mul(left, i_inverse(right))


def i_power(value: Interval, exponent: int) -> Interval:
    if exponent == 0:
        return F(1), F(1)
    if exponent % 2:
        return i_mul(value, i_power(value, exponent - 1))
    half = i_power(value, exponent // 2)
    return i_mul(half, half)


def i_poly(poly: Poly, value: Interval) -> Interval:
    result = (poly[-1], poly[-1])
    for coefficient in reversed(poly[:-1]):
        result = i_add(i_mul(result, value), (coefficient, coefficient))
    return result


def i_real_product(left: tuple[Interval, Interval], right: Gaussian) -> Interval:
    return i_add(
        i_mul(left[0], (right[0], right[0])),
        i_neg(i_mul(left[1], (right[1], right[1]))),
    )


def i_inverse_square(multiplier: int, s_box: Interval, x_box: Interval) -> tuple[Interval, Interval]:
    one = (F(1), F(1))
    multiplier_squared = (F(multiplier**2), F(multiplier**2))
    denominator_base = i_add(one, i_mul(multiplier_squared, s_box))
    denominator = i_power(denominator_base, 2)
    real = i_div(
        i_add(one, i_neg(i_mul(multiplier_squared, s_box))),
        denominator,
    )
    imaginary = i_div(
        i_neg(i_mul((F(2 * multiplier), F(2 * multiplier)), x_box)),
        denominator,
    )
    return real, imaginary


def square_unit_phase(value: Gaussian) -> Gaussian:
    return value[0] ** 2 - value[1] ** 2, 2 * value[0] * value[1]


def p_phase_interval(
    s_box: Interval,
    x_box: Interval,
    ratio_box: Interval,
    phase: Gaussian,
) -> Interval:
    b_one = i_inverse_square(1, s_box, x_box)
    b_two = i_inverse_square(2, s_box, x_box)
    total = i_add(
        i_real_product(b_one, phase),
        i_mul(ratio_box, i_real_product(b_two, square_unit_phase(phase))),
    )
    return i_mul((F(2), F(2)), total)


class TwoFrequencyPhaseTransversalityTheoremTests(unittest.TestCase):
    def test_protected_dependency_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_generic_two_frequency_determinant_has_nonzero_top_mode(self) -> None:
        for p_value, q_value in ((1, 2), (2, 3), (3, 4), (2, 5)):
            b_p = inverse_square(F(7, 5), F(3 * p_value, 2))
            b_q = inverse_square(F(7, 5), F(3 * q_value, 2))
            a_p = {p_value: b_p, -p_value: g_conjugate(b_p)}
            a_q = {q_value: b_q, -q_value: g_conjugate(b_q)}
            q_p = {
                p_value: g_power(b_p, 2),
                -p_value: g_conjugate(g_power(b_p, 2)),
            }
            q_q = {
                q_value: g_power(b_q, 2),
                -q_value: g_conjugate(g_power(b_q, 2)),
            }
            determinant = laurent_subtract(
                laurent_multiply(a_p, q_q),
                laurent_multiply(a_q, q_p),
            )
            expected = g_mul(g_mul(b_p, b_q), g_sub(b_q, b_p))
            self.assertEqual(determinant[p_value + q_value], expected)
            self.assertNotEqual(expected, (F(0), F(0)))
            self.assertEqual(max(abs(exponent) for exponent in determinant), p_value + q_value)
            self.assertNotEqual(b_q[1], 0)

    def test_self_inversive_common_quadratic_remainder_is_exact(self) -> None:
        for unit, k_value, a_value in (
            ((F(3, 5), F(4, 5)), F(3, 2), (F(2, 3), F(-5, 7))),
            ((F(5, 13), F(-12, 13)), F(-4, 3), (F(-7, 11), F(3, 8))),
        ):
            u_squared = g_power(unit, 2)
            u_cubed = g_power(unit, 3)
            u_fourth = g_power(unit, 4)
            b_value = g_div(
                g_scale(
                    F(-1),
                    g_add(
                        g_conjugate(a_value),
                        g_scale(1 - k_value**2, g_mul(a_value, u_fourth)),
                    ),
                ),
                g_scale(k_value, u_cubed),
            )
            e_zero = g_add(
                g_add(
                    g_conjugate(a_value),
                    g_scale(k_value, g_mul(b_value, u_cubed)),
                ),
                g_scale(1 - k_value**2, g_mul(a_value, u_fourth)),
            )
            e_one = g_add(
                g_add(
                    g_scale(
                        k_value * (2 - k_value**2),
                        g_mul(a_value, u_cubed),
                    ),
                    g_scale(
                        k_value**2 - 1,
                        g_mul(b_value, u_squared),
                    ),
                ),
                g_conjugate(b_value),
            )
            self.assertEqual(e_zero, (F(0), F(0)))
            self.assertEqual(e_one, (F(0), F(0)))

    def test_symbolic_h_g_j_and_candidate_polynomials_are_exact(self) -> None:
        b_one = inverse_square_symbolic(1)
        b_two = inverse_square_symbolic(2)
        b_two_bar = c_conjugate(b_two)
        h_value = c_div(
            c_mul(b_two_bar, c_sub(b_one, b_two_bar)),
            c_mul(b_two, c_sub(b_two, b_one)),
        )
        h_norm = r_add(r_power(h_value[0], 2), r_power(h_value[1], 2))

        x_squared = (F(0), F(0), F(1))
        expected_h_norm = Rat.make(
            p_scale(F(9), p_add(x_squared, p_const(4))),
            p_add(p_scale(F(9), x_squared), p_const(4)),
        )
        self.assertEqual(h_norm, expected_h_norm)

        g_value = c_add(c_mul(b_two, h_value), b_two_bar)
        expected_g = c_div(
            c_mul(b_two_bar, c_sub(b_two, b_two_bar)),
            c_sub(b_two, b_one),
        )
        self.assertEqual(g_value, expected_g)

        e_value = c_mul(c_div(b_two, b_two_bar), h_value)
        expected_e = c_div(
            c_sub(b_one, b_two_bar),
            c_sub(b_two, b_one),
        )
        self.assertEqual(e_value, expected_e)
        e_norm = r_add(r_power(e_value[0], 2), r_power(e_value[1], 2))
        self.assertEqual(e_norm, h_norm)

        j_from_h = c_div(
            c_mul(c_power(b_one, 4), c_power(h_value, 3)),
            c_power(g_value, 4),
        )
        j_rational = c_div(
            c_mul(
                c_mul(c_power(b_one, 4), c_sub(b_two, b_one)),
                c_power(c_sub(b_one, b_two_bar), 3),
            ),
            c_mul(
                c_mul(b_two_bar, c_power(b_two, 3)),
                c_power(c_sub(b_two, b_two_bar), 4),
            ),
        )
        self.assertEqual(j_from_h, j_rational)

        four_x_squared_plus_one = p_add(p_const(1), p_scale(F(4), x_squared))
        x_squared_plus_one = p_add(p_const(1), x_squared)
        expected_real = Rat.make(
            p_scale(
                F(-27),
                p_mul(p_power(four_x_squared_plus_one, 4), lift_even(N_POLY)),
            ),
            p_scale(F(4096), p_power(x_squared_plus_one, 16)),
        )
        expected_imaginary = Rat.make(
            p_scale(
                F(-27),
                p_mul(
                    (F(0), F(0), F(0), F(1)),
                    p_mul(
                        p_power(four_x_squared_plus_one, 4),
                        lift_even(F_POLY),
                    ),
                ),
            ),
            p_scale(F(256), p_power(x_squared_plus_one, 16)),
        )
        self.assertEqual(j_rational[0], expected_real)
        self.assertEqual(j_rational[1], expected_imaginary)
        self.assertNotEqual(b_two[1], r_const(0))

    def test_sturm_certificates_isolate_all_positive_candidate_roots(self) -> None:
        f_sturm = sturm_sequence(F_POLY)
        n_sturm = sturm_sequence(N_POLY)
        positive_roots = (
            sturm_variations_at(f_sturm, F(0))
            - sturm_variations_positive_infinity(f_sturm)
        )
        self.assertEqual(positive_roots, 4)
        self.assertEqual(p_gcd(F_POLY, p_derivative(F_POLY)), p_const(1))

        isolated = 0
        positive_ratio_branches = 0
        for left, right, n_sign in ROOT_INTERVALS:
            self.assertNotEqual(p_eval(F_POLY, left), 0)
            self.assertNotEqual(p_eval(F_POLY, right), 0)
            root_count = sturm_count(f_sturm, left, right)
            self.assertEqual(root_count, 1)
            isolated += root_count
            self.assertEqual(sturm_count(n_sturm, left, right), 0)
            self.assertEqual(sign(p_eval(N_POLY, left)), n_sign)
            self.assertEqual(sign(p_eval(N_POLY, right)), n_sign)
            if n_sign > 0:
                # Re(J)<0 here, so Appendix A's exact fourth-power
                # equation has a positive common-quadratic ratio branch.
                positive_ratio_branches += 1
        self.assertEqual(isolated, positive_roots)
        self.assertEqual(positive_ratio_branches, 2)

    def test_admissible_common_quadratic_boxes_have_four_sign_changes(self) -> None:
        candidates = (
            (
                (F(34447, 50000), F(13779, 20000)),
                (F("0.830024096035"), F("0.830030119936")),
                (F("2.033980560948"), F("2.033991702891")),
                (F("3.438601678831"), F("3.438840007851")),
                (-1, 1, 1, -1, -1, 1, -1, -1),
                F(3, 10),
            ),
            (
                (F(38903, 6250), F(622449, 100000)),
                (F("2.494890779172"), F("2.494892783268")),
                (F("1.238204536137"), F("1.238206069989")),
                (F("18.617554864817"), F("18.617837822310")),
                (-1, 1, 1, 1, -1, 1, 1, -1),
                F(1, 10),
            ),
        )
        phases = (
            (F(1), F(0)),
            (F(3, 5), F(4, 5)),
            (F(0), F(1)),
            (F(-3, 5), F(4, 5)),
            (F(-1), F(0)),
            (F(-3, 5), F(-4, 5)),
            (F(0), F(-1)),
            (F(3, 5), F(-4, 5)),
        )

        for s_box, x_box, h_box, ratio_box, expected_signs, margin in candidates:
            self.assertLessEqual(x_box[0] ** 2, s_box[0])
            self.assertGreaterEqual(x_box[1] ** 2, s_box[1])

            h_squared_lower = F(9) * (s_box[1] + 4) / (9 * s_box[1] + 4)
            h_squared_upper = F(9) * (s_box[0] + 4) / (9 * s_box[0] + 4)
            self.assertLessEqual(h_box[0] ** 2, h_squared_lower)
            self.assertGreaterEqual(h_box[1] ** 2, h_squared_upper)

            n_box = i_poly(N_POLY, s_box)
            self.assertGreater(n_box[0], 0)
            four_s_plus_one = i_add(
                i_mul((F(4), F(4)), s_box), (F(1), F(1))
            )
            minus_real_j = i_div(
                i_mul(
                    (F(27), F(27)),
                    i_mul(i_power(four_s_plus_one, 4), n_box),
                ),
                i_mul(
                    (F(4096), F(4096)),
                    i_power(i_add(s_box, (F(1), F(1))), 16),
                ),
            )
            ratio_fourth = i_div(
                i_mul(
                    i_power(i_add((F(1), F(1)), h_box), 2),
                    minus_real_j,
                ),
                i_power(h_box, 3),
            )
            self.assertLessEqual(ratio_box[0] ** 4, ratio_fourth[0])
            self.assertGreaterEqual(ratio_box[1] ** 4, ratio_fourth[1])

            phase_intervals = tuple(
                p_phase_interval(s_box, x_box, ratio_box, phase)
                for phase in phases
            )
            signs = tuple(
                1 if value[0] > 0 else -1 if value[1] < 0 else 0
                for value in phase_intervals
            )
            self.assertEqual(signs, expected_signs)
            certified_margins = tuple(
                value[0] if current_sign > 0 else -value[1]
                for value, current_sign in zip(
                    phase_intervals, expected_signs, strict=True
                )
            )
            self.assertGreater(min(certified_margins), margin)
            cyclic_changes = sum(
                expected_signs[index] != expected_signs[(index + 1) % 8]
                for index in range(8)
            )
            self.assertEqual(cyclic_changes, 4)

    def test_quartic_proportionality_contradiction_is_exact(self) -> None:
        x_value = F(7, 5)
        b_one = inverse_square(F(1), x_value)
        b_two = inverse_square(F(1), 2 * x_value)
        self.assertNotEqual(b_one, b_two)
        ratio = F(11, 3)
        p_coefficients = (g_scale(ratio, b_two), b_one)
        v_coefficients = (
            g_scale(ratio, g_power(b_two, 2)),
            g_power(b_one, 2),
        )
        leading_ratio = g_div(v_coefficients[0], p_coefficients[0])
        cubic_ratio = g_div(v_coefficients[1], p_coefficients[1])
        self.assertEqual(leading_ratio, b_two)
        self.assertEqual(cubic_ratio, b_one)
        self.assertNotEqual(leading_ratio, cubic_ratio)

    def test_common_zero_set_is_distinct_from_failure_set(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        self.assertIn("the **failure set** is\n   empty", text)
        self.assertIn("That common-zero set need not be\n   empty", text)
        self.assertIn("common-zero set is not always empty", text)
        self.assertIn("the `1:2` failure set is empty", text)
        self.assertNotIn("the exceptional set is\n   empty", text)

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "|E_{p,q}(B,omega)| <= 2(p+q)",
            "For the primitive non-antipodal pair `(p,q)=(1,2)`",
            "all but a\n   finite set",
            "boundary-\ntransversality reduction",
            r"[e^{i(p+q)t}]D=b_pb_q^2-b_qb_p^2",
            r"\boxed{|E_{p,q}(B,\omega)|\leq2(p+q)}",
            "generic positive-weight\ntransversality",
            "exact degree-two subresultant condition",
            "The branch `k=0` must be handled separately",
            r"|H|^2={9(x^2+4)\over9x^2+4}",
            "The quotient-circle bound rules out every `1:2` failure",
            r"E={b_2\over\overline b_2}H",
            r"|\ell|={|\eta-E|\over\eta\sqrt{1+\eta}}",
            r"\leq {2\over\sqrt{1+\eta}}",
            "two distinct unit-circle roots",
            "even multiplicity two",
            r"R^4=-{(1+|H|)^2\over|H|^3}J",
            "four positive roots",
            "exact terminating rational endpoint",
            "direct outward rational interval evaluation",
            "four distinct simple unit-circle",
            "Since `b_1 != b_2`, this is impossible",
            "needs no global hull antipode",
            "common-zero candidate\nratios for other mixed-parity `p:q` pairs",
            "universal problem for\nthree or more phase-locked frequencies, remain open",
            "does **not** assert that an actual\nattained zeta edge",
            "Numerical searches are not proof",
            "P0_INVALIDATED",
            "changes no status, integration,",
            "replay, source lock, or checkpoint artifact",
            "Membership in this set is necessary for\nfailure, not sufficient",
            "Appendix A\ncertifies two common-quadratic branches",
            "subset, if any, on which actual failure\noccurs remains unknown",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "every finite phase-locked edge is solved",
            "all exceptional sets are empty",
            "actual zeta edge has ratio `1:2`",
            "actual-zeta geometry is proved",
            "RH is proved",
            "RH is false unconditionally",
            "equation (5.2) is proved",
            "floating searches prove",
        )
        for token in forbidden:
            self.assertNotIn(token, text)

        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_package_contains_only_clean_raw_bytes(self) -> None:
        for path in (NOTE, TEST):
            bad = [
                (offset, byte)
                for offset, byte in enumerate(path.read_bytes())
                if (byte < 32 and byte != 10) or byte == 127
            ]
            self.assertEqual(bad, [], path.name)


if __name__ == "__main__":
    unittest.main()
