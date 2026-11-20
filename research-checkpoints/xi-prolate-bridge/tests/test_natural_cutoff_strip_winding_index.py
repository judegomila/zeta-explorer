#!/usr/bin/env python3
"""Exact regressions for the natural-cutoff strip winding reduction.

Only the Python standard library is used.  Polynomial, Cauchy-index, and
Gaussian-rational checks use ``fractions.Fraction`` throughout.  No source
artifact, numerical eigensystem, floating root finder, or zero list is read.
"""

from __future__ import annotations

from fractions import Fraction as F
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "NATURAL_CUTOFF_STRIP_WINDING_INDEX.md"

Polynomial = list[F]
Gaussian = tuple[F, F]


def trim(polynomial: Polynomial) -> Polynomial:
    out = polynomial[:]
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return out


def poly_add(left: Polynomial, right: Polynomial) -> Polynomial:
    out = [F(0) for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    return trim(out)


def poly_neg(polynomial: Polynomial) -> Polynomial:
    return [-value for value in polynomial]


def poly_sub(left: Polynomial, right: Polynomial) -> Polynomial:
    return poly_add(left, poly_neg(right))


def poly_scale(polynomial: Polynomial, scalar: F) -> Polynomial:
    return trim([scalar * value for value in polynomial])


def poly_mul(left: Polynomial, right: Polynomial) -> Polynomial:
    out = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            out[i + j] += left_value * right_value
    return trim(out)


def poly_value(polynomial: Polynomial, value: F) -> F:
    out = F(0)
    for coefficient in reversed(polynomial):
        out = out * value + coefficient
    return out


def poly_derivative(polynomial: Polynomial) -> Polynomial:
    if len(polynomial) == 1:
        return [F(0)]
    return trim(
        [F(index) * polynomial[index] for index in range(1, len(polynomial))]
    )


def poly_divmod(
    numerator: Polynomial, denominator: Polynomial
) -> tuple[Polynomial, Polynomial]:
    numerator = trim(numerator)
    denominator = trim(denominator)
    if denominator == [F(0)]:
        raise ZeroDivisionError("zero polynomial")
    quotient = [
        F(0) for _ in range(max(1, len(numerator) - len(denominator) + 1))
    ]
    remainder = numerator[:]
    while remainder != [F(0)] and len(remainder) >= len(denominator):
        degree = len(remainder) - len(denominator)
        coefficient = remainder[-1] / denominator[-1]
        quotient[degree] = coefficient
        for index, value in enumerate(denominator):
            remainder[index + degree] -= coefficient * value
        remainder = trim(remainder)
    return trim(quotient), remainder


def poly_exact_div(
    numerator: Polynomial, denominator: Polynomial
) -> Polynomial:
    quotient, remainder = poly_divmod(numerator, denominator)
    if remainder != [F(0)]:
        raise AssertionError("polynomial division was not exact")
    return quotient


def poly_gcd(left: Polynomial, right: Polynomial) -> Polynomial:
    left = trim(left)
    right = trim(right)
    while right != [F(0)]:
        _, remainder = poly_divmod(left, right)
        left, right = right, remainder
    if left == [F(0)]:
        return left
    return poly_scale(left, F(1) / left[-1])


def sturm_sequence(
    denominator: Polynomial, numerator: Polynomial
) -> list[Polynomial]:
    """Signed remainder sequence for the index of numerator/denominator."""

    denominator = trim(denominator)
    numerator = trim(numerator)
    if numerator == [F(0)]:
        return [denominator]
    sequence = [denominator, numerator]
    while True:
        _, remainder = poly_divmod(sequence[-2], sequence[-1])
        if remainder == [F(0)]:
            break
        sequence.append(poly_neg(remainder))
    return sequence


def sign_at_infinity(polynomial: Polynomial, positive: bool) -> int:
    sign = 1 if polynomial[-1] > 0 else -1
    if not positive and (len(polynomial) - 1) % 2:
        sign = -sign
    return sign


def sign_at_point(polynomial: Polynomial, value: F) -> int:
    evaluated = poly_value(polynomial, value)
    if evaluated == 0:
        return 0
    return 1 if evaluated > 0 else -1


def sign_variations(signs: list[int]) -> int:
    nonzero = [sign for sign in signs if sign]
    return sum(left != right for left, right in zip(nonzero, nonzero[1:]))


def cauchy_index_up(
    numerator: Polynomial, denominator: Polynomial
) -> int:
    """Upward Cauchy index of numerator/denominator on RP^1."""

    if numerator == [F(0)]:
        return 0
    common = poly_gcd(numerator, denominator)
    if len(common) > 1:
        if distinct_real_root_count(common):
            raise ValueError("common real factor: boundary branch")
        numerator = poly_exact_div(numerator, common)
        denominator = poly_exact_div(denominator, common)
    sequence = sturm_sequence(denominator, numerator)
    minus = sign_variations(
        [sign_at_infinity(polynomial, False) for polynomial in sequence]
    )
    plus = sign_variations(
        [sign_at_infinity(polynomial, True) for polynomial in sequence]
    )
    return minus - plus


def distinct_real_root_count(polynomial: Polynomial) -> int:
    """Count distinct roots on the whole real line by Sturm's theorem."""

    polynomial = trim(polynomial)
    if len(polynomial) <= 1:
        return 0
    common = poly_gcd(polynomial, poly_derivative(polynomial))
    radical = poly_exact_div(polynomial, common)
    sequence = sturm_sequence(radical, poly_derivative(radical))
    at_minus_infinity = sign_variations(
        [sign_at_infinity(entry, False) for entry in sequence]
    )
    at_plus_infinity = sign_variations(
        [sign_at_infinity(entry, True) for entry in sequence]
    )
    return at_minus_infinity - at_plus_infinity


def _distinct_positive_root_count_squarefree(polynomial: Polynomial) -> int:
    sequence = sturm_sequence(polynomial, poly_derivative(polynomial))
    at_zero = sign_variations(
        [sign_at_point(entry, F(0)) for entry in sequence]
    )
    at_infinity = sign_variations(
        [sign_at_infinity(entry, True) for entry in sequence]
    )
    return at_zero - at_infinity


def zero_root_multiplicity(polynomial: Polynomial) -> int:
    if polynomial == [F(0)]:
        raise ValueError("zero polynomial has undefined root multiplicity")
    multiplicity = 0
    for coefficient in polynomial:
        if coefficient != 0:
            break
        multiplicity += 1
    return multiplicity


def positive_root_count(polynomial: Polynomial) -> int:
    """Count positive real roots with algebraic multiplicity."""

    polynomial = trim(polynomial)
    zero_order = zero_root_multiplicity(polynomial)
    if zero_order:
        polynomial = polynomial[zero_order:]

    def recurse(value: Polynomial) -> int:
        if len(value) <= 1:
            return 0
        common = poly_gcd(value, poly_derivative(value))
        radical = poly_exact_div(value, common)
        distinct = _distinct_positive_root_count_squarefree(radical)
        if len(common) <= 1:
            return distinct
        return distinct + recurse(common)

    return recurse(polynomial)


def lattice_polynomial(count: int) -> Polynomial:
    out = [F(1)]
    for mode in range(1, count + 1):
        out = poly_mul(out, [F(-(mode * mode)), F(1)])
    return out


def raw_polynomial(central: F, positive: list[F]) -> Polynomial:
    count = len(positive)
    out = poly_scale(lattice_polynomial(count), central)
    for mode, coefficient in enumerate(positive, start=1):
        omitted = [F(1)]
        for other in range(1, count + 1):
            if other != mode:
                omitted = poly_mul(
                    omitted, [F(-(other * other)), F(1)]
                )
        out = poly_add(
            out,
            [F(0)] + [2 * coefficient * value for value in omitted],
        )
    return out


def interpolation_coordinates(polynomial: Polynomial, count: int) -> tuple[F, list[F]]:
    central = poly_value(polynomial, F(0)) / F(
        (-1) ** count * math.factorial(count) ** 2
    )
    positive = []
    for mode in range(1, count + 1):
        denominator = (
            (-1) ** (count - mode)
            * math.factorial(count - mode)
            * math.factorial(count + mode)
        )
        positive.append(
            poly_value(polynomial, F(mode * mode)) / F(denominator)
        )
    return central, positive


def complex_poly_add(
    left: tuple[Polynomial, Polynomial],
    right: tuple[Polynomial, Polynomial],
) -> tuple[Polynomial, Polynomial]:
    return poly_add(left[0], right[0]), poly_add(left[1], right[1])


def complex_poly_mul(
    left: tuple[Polynomial, Polynomial],
    right: tuple[Polynomial, Polynomial],
) -> tuple[Polynomial, Polynomial]:
    return (
        poly_sub(poly_mul(left[0], right[0]), poly_mul(left[1], right[1])),
        poly_add(poly_mul(left[0], right[1]), poly_mul(left[1], right[0])),
    )


def evaluate_at_squared_boundary(
    polynomial: Polynomial, height: F
) -> tuple[Polynomial, Polynomial]:
    squared_boundary = (
        [-(height * height), F(0), F(1)],
        [F(0), 2 * height],
    )
    out = ([F(0)], [F(0)])
    for coefficient in reversed(polynomial):
        out = complex_poly_add(
            complex_poly_mul(out, squared_boundary),
            ([coefficient], [F(0)]),
        )
    return trim(out[0]), trim(out[1])


def secular_boundary_parts(
    numerator: Polynomial, denominator: Polynomial, height: F
) -> tuple[Polynomial, Polynomial]:
    numerator_real, numerator_imag = evaluate_at_squared_boundary(
        numerator, height
    )
    denominator_real, denominator_imag = evaluate_at_squared_boundary(
        denominator, height
    )
    real = poly_add(
        poly_mul(numerator_real, denominator_real),
        poly_mul(numerator_imag, denominator_imag),
    )
    imag = poly_sub(
        poly_mul(numerator_imag, denominator_real),
        poly_mul(numerator_real, denominator_imag),
    )
    return trim(real), trim(imag)


def winding_index(
    numerator: Polynomial, denominator: Polynomial, height: F
) -> int:
    real, imag = secular_boundary_parts(numerator, denominator, height)
    return -cauchy_index_up(imag, real)


def gaussian_add(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def gaussian_neg(value: Gaussian) -> Gaussian:
    return -value[0], -value[1]


def gaussian_sub(left: Gaussian, right: Gaussian) -> Gaussian:
    return gaussian_add(left, gaussian_neg(right))


def gaussian_mul(left: Gaussian, right: Gaussian) -> Gaussian:
    return (
        left[0] * right[0] - left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def gaussian_div(left: Gaussian, right: Gaussian) -> Gaussian:
    denominator = right[0] * right[0] + right[1] * right[1]
    return (
        (left[0] * right[0] + left[1] * right[1]) / denominator,
        (left[1] * right[0] - left[0] * right[1]) / denominator,
    )


def gaussian_pow(value: Gaussian, exponent: int) -> Gaussian:
    out = (F(1), F(0))
    base = value
    power = exponent
    while power:
        if power & 1:
            out = gaussian_mul(out, base)
        base = gaussian_mul(base, base)
        power //= 2
    return out


def escaping_factor(
    value: Gaussian, radius: F, alpha: F, order: int
) -> Gaussian:
    one = (F(1), F(0))
    upper = gaussian_pow(
        gaussian_div(value, (radius, alpha)), 2 * order
    )
    lower = gaussian_pow(
        gaussian_div(value, (radius, -alpha)), 2 * order
    )
    return gaussian_mul(gaussian_sub(one, upper), gaussian_sub(one, lower))


class NaturalCutoffStripWindingIndexTests(unittest.TestCase):
    def test_note_locks_scope_orientation_and_degenerate_branches(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for required in (
            "theorem-only reduction",
            "nonzero real inversion-even finite state",
            "P0_INVALIDATED",
            "no actual-source Cauchy-index",
            "no Riemann-hypothesis conclusion",
            r"\delta={L\over4\pi}",
            "increasing `t` is used on the upper line",
            "Removable lattice poles",
            "The branch `c=0`",
            r"\mathcal I_{h-}",
            r"v(y)=|\operatorname {Im}\sqrt y|",
            "branch-independent raw-root height",
            "necessary and sufficient finite certificate",
            "Gevrey-scale escaping-zero obstruction",
            "not an actual finite source anchor",
            "1<n<=lambda^2",
        ):
            self.assertIn(required, text)
        self.assertNotIn("Riemann hypothesis is proved", text)
        self.assertNotIn("actual-source Cauchy-index equality is proved", text)

    def test_upward_cauchy_index_orientation_is_exact(self) -> None:
        denominator = [F(0), F(1)]
        self.assertEqual(cauchy_index_up([F(1)], denominator), 1)
        self.assertEqual(cauchy_index_up([F(-1)], denominator), -1)

    def test_boundary_real_and_imaginary_parts_are_exact(self) -> None:
        central = F(5, 7)
        positive = [F(-3, 11), F(2, 13)]
        numerator = raw_polynomial(central, positive)
        denominator = lattice_polynomial(2)
        height = F(2, 3)
        parameter = F(3, 5)
        real_poly, imag_poly = secular_boundary_parts(
            numerator, denominator, height
        )

        numerator_real, numerator_imag = evaluate_at_squared_boundary(
            numerator, height
        )
        denominator_real, denominator_imag = evaluate_at_squared_boundary(
            denominator, height
        )
        nr = poly_value(numerator_real, parameter)
        ni = poly_value(numerator_imag, parameter)
        dr = poly_value(denominator_real, parameter)
        di = poly_value(denominator_imag, parameter)
        norm = dr * dr + di * di
        direct_real = (nr * dr + ni * di) / norm
        direct_imag = (ni * dr - nr * di) / norm

        self.assertEqual(poly_value(real_poly, parameter) / norm, direct_real)
        self.assertEqual(poly_value(imag_poly, parameter) / norm, direct_imag)

        c = central + 2 * sum(positive, F(0))
        a = parameter * parameter - height * height
        b = 2 * height * parameter
        formula_real = c
        formula_imag = F(0)
        for mode, coefficient in enumerate(positive, start=1):
            residue = mode * mode * coefficient
            difference = a - mode * mode
            local_norm = difference * difference + b * b
            formula_real += 2 * residue * difference / local_norm
            formula_imag -= 2 * b * residue / local_norm
        self.assertEqual(direct_real, formula_real)
        self.assertEqual(direct_imag, formula_imag)

    def test_negative_root_index_drop_is_two(self) -> None:
        denominator = [F(-1), F(1)]
        height = F(1)

        inside = [F(1, 4), F(1)]  # root y=-1/4
        outside = [F(4), F(1)]  # root y=-4
        self.assertEqual(winding_index(inside, denominator, height), 0)
        self.assertEqual(winding_index(outside, denominator, height), 2)

        index_at_zero = 2  # 2*(M-R_+) with M=1 and R_+=0
        self.assertEqual(index_at_zero - winding_index(inside, denominator, height), 2)
        self.assertEqual(index_at_zero - winding_index(outside, denominator, height), 0)

    def test_nonreal_pair_index_drop_is_four_and_certificate_is_exact(self) -> None:
        denominator = [F(4), F(-5), F(1)]
        height = F(1)

        inside = [F(1), F(0), F(1)]  # y^2+1, v^2=1/2
        outside = [F(9), F(0), F(1)]  # y^2+9, v^2=3/2
        self.assertEqual(positive_root_count(inside), 0)
        self.assertEqual(positive_root_count(outside), 0)
        index_at_zero = 4

        inside_index = winding_index(inside, denominator, height)
        outside_index = winding_index(outside, denominator, height)
        self.assertEqual(inside_index, 0)
        self.assertEqual(outside_index, 4)
        self.assertEqual(index_at_zero - inside_index, 4)
        self.assertEqual(index_at_zero - outside_index, 0)

        # Z_h=2M-I_h: all four square roots are inside for y^2+1,
        # and none is inside for y^2+9.
        self.assertEqual(4 - inside_index, 4)
        self.assertEqual(4 - outside_index, 0)

    def test_boundary_root_uses_the_inward_index(self) -> None:
        numerator = [F(4), F(0), F(1)]  # roots +/-2i, v=1
        denominator = [F(4), F(-5), F(1)]
        boundary_real, boundary_imag = secular_boundary_parts(
            numerator, denominator, F(1)
        )
        self.assertEqual(poly_value(boundary_real, F(1)), 0)
        self.assertEqual(poly_value(boundary_imag, F(1)), 0)
        self.assertGreater(len(poly_gcd(boundary_real, boundary_imag)), 1)

        inward = winding_index(numerator, denominator, F(1, 2))
        outward = winding_index(numerator, denominator, F(2))
        self.assertEqual(inward, 4)
        self.assertEqual(outward, 0)
        self.assertEqual(4 - inward, 0)  # open strip excludes boundary roots

    def test_no_real_common_boundary_factor_is_canceled_exactly(self) -> None:
        # At h=1 these boundary parts have gcd t^2+9.  It has no real
        # root, so Gamma never meets zero and the factor must be canceled,
        # not misclassified as a parabolic-boundary root.
        numerator = poly_mul([F(16), F(1)], [F(4), F(1)])
        denominator = poly_mul([F(-1), F(1)], [F(-4), F(1)])
        real, imag = secular_boundary_parts(numerator, denominator, F(1))
        common = poly_gcd(real, imag)
        self.assertEqual(common, [F(9), F(0), F(1)])
        self.assertEqual(distinct_real_root_count(common), 0)
        self.assertEqual(winding_index(numerator, denominator, F(1)), 4)

    def test_algebraic_multiplicity_and_zero_root_are_counted(self) -> None:
        denominator = [F(4), F(-5), F(1)]
        repeated_positive = [F(4), F(-4), F(1)]  # (y-2)^2
        self.assertEqual(positive_root_count(repeated_positive), 2)
        self.assertEqual(zero_root_multiplicity(repeated_positive), 0)
        self.assertEqual(winding_index(repeated_positive, denominator, F(1)), 0)
        self.assertEqual(2 * (2 - positive_root_count(repeated_positive)), 0)

        double_zero = [F(0), F(0), F(1)]  # y^2
        self.assertEqual(zero_root_multiplicity(double_zero), 2)
        self.assertEqual(positive_root_count(double_zero), 0)
        nonnegative_count = (
            positive_root_count(double_zero)
            + zero_root_multiplicity(double_zero)
        )
        self.assertEqual(nonnegative_count, 2)
        self.assertEqual(winding_index(double_zero, denominator, F(1)), 0)
        self.assertEqual(2 * (2 - nonnegative_count), 0)

    def test_removable_pole_and_c_zero_polynomial_branch(self) -> None:
        removable = [F(-4), F(1)]
        numerator = poly_mul(removable, [F(4), F(1)])
        denominator = poly_mul(removable, [F(-1), F(1)])
        common = poly_gcd(numerator, denominator)
        self.assertEqual(common, removable)
        reduced_numerator = poly_exact_div(numerator, common)
        reduced_denominator = poly_exact_div(denominator, common)
        self.assertEqual(reduced_numerator, [F(4), F(1)])
        self.assertEqual(reduced_denominator, [F(-1), F(1)])
        self.assertEqual(
            winding_index(reduced_numerator, reduced_denominator, F(1)), 2
        )

        # A degree-deficient p has c=0 relative to a degree-two D.  Its
        # polynomial boundary loop remains based and gives Z_h=-I_q.
        degree_deficient = [F(1, 4), F(1)]
        real, imag = evaluate_at_squared_boundary(degree_deficient, F(1))
        polynomial_loop_index = -cauchy_index_up(imag, real)
        self.assertEqual(polynomial_loop_index, -2)
        self.assertEqual(-polynomial_loop_index, 2)

    def test_exact_counterfamily_reconstructs_anchor_and_changes_index(self) -> None:
        count = 4
        positive_roots = (F(2), F(3))
        denominator = lattice_polynomial(count)

        def counter_polynomial(parameter: F) -> Polynomial:
            out = [parameter * parameter, F(0), F(1)]
            for root in positive_roots:
                out = poly_mul(out, [-root, F(1)])
            return out

        inside = counter_polynomial(F(1))
        outside = counter_polynomial(F(3))
        for polynomial in (inside, outside):
            central, positive = interpolation_coordinates(polynomial, count)
            self.assertEqual(raw_polynomial(central, positive), polynomial)
            self.assertNotEqual(central, 0)
            self.assertTrue(all(coordinate != 0 for coordinate in positive))
            self.assertEqual(central + 2 * sum(positive, F(0)), 1)
            self.assertEqual(positive_root_count(polynomial), 2)
            for radius in (F(0), F(1, 2), F(2), F(5)):
                value = -(radius * radius)
                self.assertGreater(
                    poly_value(polynomial, value)
                    / poly_value(denominator, value),
                    0,
                )

        index_at_zero = 2 * (count - 2)
        inside_index = winding_index(inside, denominator, F(1))
        outside_index = winding_index(outside, denominator, F(1))
        self.assertEqual(index_at_zero, 4)
        self.assertEqual(inside_index, 0)
        self.assertEqual(outside_index, 4)
        self.assertEqual(index_at_zero - inside_index, 4)
        self.assertEqual(index_at_zero - outside_index, 0)

    def test_gevrey_escaping_factor_symmetry_positivity_and_scale(self) -> None:
        alpha = F(1, 4)
        radius = F(100)
        order = 3
        root = (radius, alpha)
        self.assertEqual(
            escaping_factor(root, radius, alpha, order), (F(0), F(0))
        )

        value = (F(7, 5), F(2, 7))
        factor = escaping_factor(value, radius, alpha, order)
        even_factor = escaping_factor(
            gaussian_neg(value), radius, alpha, order
        )
        conjugate_factor = escaping_factor(
            (value[0], -value[1]), radius, alpha, order
        )
        self.assertEqual(even_factor, factor)
        self.assertEqual(conjugate_factor, (factor[0], -factor[1]))

        imaginary_value = (F(0), F(1, 2))
        positive_factor = escaping_factor(
            imaginary_value, radius, alpha, order
        )
        upper_power = gaussian_pow(
            gaussian_div(imaginary_value, (radius, alpha)), 2 * order
        )
        one_minus = gaussian_sub((F(1), F(0)), upper_power)
        norm_square = one_minus[0] ** 2 + one_minus[1] ** 2
        self.assertEqual(positive_factor, (norm_square, F(0)))
        self.assertGreater(norm_square, 0)

        bounds = []
        for length in (20, 40):
            scaled_radius = F(2 ** (length // 2), length)
            scaled_order = length // 4
            ratio = F(1) / (scaled_radius**2 + alpha**2)
            bound = 2 * ratio**scaled_order + ratio ** (2 * scaled_order)
            bounds.append(bound)
            self.assertLess(bound, F(1, 2 ** (length * length // 8)))
        self.assertLess(bounds[1], bounds[0])


if __name__ == "__main__":
    unittest.main()
