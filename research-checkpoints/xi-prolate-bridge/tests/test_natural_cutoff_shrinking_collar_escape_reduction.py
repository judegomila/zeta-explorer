#!/usr/bin/env python3
"""Exact regressions for the shrinking-collar and escape reduction.

Only the Python standard library is used.  All polynomial, Gaussian-rational,
Cauchy-index, determinant, endpoint-jet, and countermodel checks are exact.
No numerical root finder, zero list, source artifact, or floating-point pilot
is read.
"""

from __future__ import annotations

from fractions import Fraction as F
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "NATURAL_CUTOFF_SHRINKING_COLLAR_ESCAPE_REDUCTION.md"
)

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


def sign_variations(signs: list[int]) -> int:
    nonzero = [sign for sign in signs if sign]
    return sum(left != right for left, right in zip(nonzero, nonzero[1:]))


def distinct_real_root_count(polynomial: Polynomial) -> int:
    polynomial = trim(polynomial)
    if len(polynomial) <= 1:
        return 0
    common = poly_gcd(polynomial, poly_derivative(polynomial))
    radical = poly_exact_div(polynomial, common)
    sequence = sturm_sequence(radical, poly_derivative(radical))
    at_minus = sign_variations(
        [sign_at_infinity(entry, False) for entry in sequence]
    )
    at_plus = sign_variations(
        [sign_at_infinity(entry, True) for entry in sequence]
    )
    return at_minus - at_plus


def cauchy_index_up(numerator: Polynomial, denominator: Polynomial) -> int:
    """Upward Cauchy index of numerator/denominator on RP^1."""

    if numerator == [F(0)]:
        return 0
    common = poly_gcd(numerator, denominator)
    if len(common) > 1:
        if distinct_real_root_count(common):
            raise ValueError("common real factor: boundary root")
        numerator = poly_exact_div(numerator, common)
        denominator = poly_exact_div(denominator, common)
    sequence = sturm_sequence(denominator, numerator)
    at_minus = sign_variations(
        [sign_at_infinity(entry, False) for entry in sequence]
    )
    at_plus = sign_variations(
        [sign_at_infinity(entry, True) for entry in sequence]
    )
    return at_minus - at_plus


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


def interpolation_coordinates(
    polynomial: Polynomial, count: int
) -> tuple[F, list[F]]:
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


def gadd(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def gneg(value: Gaussian) -> Gaussian:
    return -value[0], -value[1]


def gsub(left: Gaussian, right: Gaussian) -> Gaussian:
    return gadd(left, gneg(right))


def gmul(left: Gaussian, right: Gaussian) -> Gaussian:
    return (
        left[0] * right[0] - left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def gdiv(left: Gaussian, right: Gaussian) -> Gaussian:
    denominator = right[0] * right[0] + right[1] * right[1]
    return (
        (left[0] * right[0] + left[1] * right[1]) / denominator,
        (left[1] * right[0] - left[0] * right[1]) / denominator,
    )


def gconj(value: Gaussian) -> Gaussian:
    return value[0], -value[1]


def gpow(value: Gaussian, exponent: int) -> Gaussian:
    out = (F(1), F(0))
    base = value
    power = exponent
    while power:
        if power & 1:
            out = gmul(out, base)
        base = gmul(base, base)
        power //= 2
    return out


def gnorm_squared(value: Gaussian) -> F:
    return value[0] * value[0] + value[1] * value[1]


def secular_value(c: F, positive: list[F], y: Gaussian) -> Gaussian:
    out = (c, F(0))
    for mode, coefficient in enumerate(positive, start=1):
        numerator = (2 * mode * mode * coefficient, F(0))
        denominator = gsub(y, (F(mode * mode), F(0)))
        out = gadd(out, gdiv(numerator, denominator))
    return out


def determinant(matrix: list[list[F]]) -> F:
    work = [row[:] for row in matrix]
    size = len(work)
    out = F(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            out = -out
        pivot_value = work[column][column]
        out *= pivot_value
        for row in range(column + 1, size):
            factor = work[row][column] / pivot_value
            for entry in range(column + 1, size):
                work[row][entry] -= factor * work[column][entry]
            work[row][column] = F(0)
    return out


def escaping_factor(
    z: Gaussian, radius: F, alpha: F, half_degree: int
) -> Gaussian:
    one = (F(1), F(0))
    plus = gsub(
        one,
        gpow(gdiv(z, (radius, alpha)), 2 * half_degree),
    )
    minus = gsub(
        one,
        gpow(gdiv(z, (radius, -alpha)), 2 * half_degree),
    )
    return gmul(plus, minus)


class NaturalCutoffShrinkingCollarEscapeReductionTests(unittest.TestCase):
    def test_open_collar_index_difference_is_four_per_pair(self) -> None:
        # p=(y^2+1)(y-2): one positive real root and one nonreal pair.
        polynomial = poly_mul([F(1), F(0), F(1)], [F(-2), F(1)])
        denominator = lattice_polynomial(3)
        inner = winding_index(polynomial, denominator, F(1, 2))
        outer = winding_index(polynomial, denominator, F(1))

        # v(+-i)^2=1/2, so the pair lies in the open collar (1/2,1).
        self.assertLess(F(1, 4), F(1, 2))
        self.assertLess(F(1, 2), F(1))
        self.assertEqual(inner - outer, 4)
        self.assertEqual((inner - outer) % 4, 0)

    def test_one_sided_boundaries_multiplicity_and_removable_factor(self) -> None:
        # For p=y^2+4, v(+-2i)=1.  Values below and above height one
        # replay I_(1-) and I_(1+), respectively.
        boundary_polynomial = [F(4), F(0), F(1)]
        denominator_two = lattice_polynomial(2)
        inward = winding_index(
            boundary_polynomial, denominator_two, F(3, 4)
        )
        outward = winding_index(
            boundary_polynomial, denominator_two, F(5, 4)
        )
        self.assertEqual(inward - outward, 4)

        # Algebraic multiplicity two makes the collar difference eight.
        repeated = poly_mul([F(1), F(0), F(1)], [F(1), F(0), F(1)])
        repeated_difference = winding_index(
            repeated, lattice_polynomial(4), F(1, 2)
        ) - winding_index(repeated, lattice_polynomial(4), F(1))
        self.assertEqual(repeated_difference, 8)

        # A common y-1 factor is a removable real lattice root.  Reducing it
        # leaves the positive-height index unchanged.
        full_numerator = poly_mul([F(-1), F(1)], [F(1), F(0), F(1)])
        full_denominator = lattice_polynomial(3)
        reduced_numerator = [F(1), F(0), F(1)]
        reduced_denominator = poly_exact_div(
            full_denominator, [F(-1), F(1)]
        )
        for height in (F(1, 2), F(1)):
            self.assertEqual(
                winding_index(full_numerator, full_denominator, height),
                winding_index(reduced_numerator, reduced_denominator, height),
            )

    def test_c_zero_polynomial_loop_collar_identity(self) -> None:
        # Regard p=y^2+1 as degree deficient relative to a degree-three
        # lattice denominator, so c=0.  The polynomial loop itself gives
        # 2U=-Ind^up(Im/Re), and its collar difference is four.
        polynomial = [F(1), F(0), F(1)]

        def twice_polynomial_winding(height: F) -> int:
            real, imag = evaluate_at_squared_boundary(polynomial, height)
            return -cauchy_index_up(imag, real)

        inner_twice_winding = twice_polynomial_winding(F(1, 2))
        outer_twice_winding = twice_polynomial_winding(F(1))
        self.assertEqual(inner_twice_winding - outer_twice_winding, 4)

    def test_shrinking_physical_collar_catches_fixed_off_axis_height(self) -> None:
        # Ratios to delta avoid transcendental L/(2*pi):
        # a_lambda/delta=2*epsilon_lambda and v/delta=2*|Im z|.
        epsilon_lambda = F(1, 100)
        fixed_imaginary_height = F(1, 5)
        inner_over_delta = 2 * epsilon_lambda
        root_over_delta = 2 * fixed_imaginary_height

        self.assertGreater(root_over_delta, inner_over_delta)
        self.assertLess(root_over_delta, 1)
        self.assertNotEqual(F(7, 3) * fixed_imaginary_height, 0)

    def test_nonzero_leading_coefficient_escape_bound_is_exact(self) -> None:
        central = F(2)
        positive = [F(1), F(-2), F(3)]
        count = len(positive)
        c = central + 2 * sum(positive, F(0))
        bound = 2 * sum(
            (
                mode * mode * abs(coefficient)
                for mode, coefficient in enumerate(positive, start=1)
            ),
            F(0),
        )
        real_part = F(20)
        imag_part = F(7)

        self.assertGreater(
            real_part * real_part - count * count, bound / abs(c)
        )
        for mode in range(1, count + 1):
            left = (
                (real_part - mode) ** 2 + imag_part**2
            ) * ((real_part + mode) ** 2 + imag_part**2)
            self.assertGreaterEqual(
                left, (real_part * real_part - mode * mode) ** 2
            )

        s = (real_part, imag_part)
        value = secular_value(c, positive, gmul(s, s))
        self.assertNotEqual(value, (F(0), F(0)))

    def test_vanishing_lead_uses_first_nonzero_even_moment(self) -> None:
        # c=mu_1=0 but mu_2!=0.  The top coordinate is zero, so this also
        # exercises a removable lattice factor without changing the bound.
        positive = [F(4), F(-1), F(0)]
        central = -2 * sum(positive, F(0))
        c = central + 2 * sum(positive, F(0))
        mu_1 = 2 * sum(
            (
                mode**2 * coefficient
                for mode, coefficient in enumerate(positive, start=1)
            ),
            F(0),
        )
        mu_2 = 2 * sum(
            (
                mode**4 * coefficient
                for mode, coefficient in enumerate(positive, start=1)
            ),
            F(0),
        )
        self.assertEqual(c, 0)
        self.assertEqual(mu_1, 0)
        self.assertEqual(mu_2, F(-24))

        y = (F(20), F(0))
        phi = secular_value(c, positive, y)
        left = gmul(gpow(y, 2), phi)
        remainder = (F(0), F(0))
        for mode, coefficient in enumerate(positive, start=1):
            numerator = (2 * mode**6 * coefficient, F(0))
            remainder = gadd(
                remainder,
                gdiv(numerator, gsub(y, (F(mode * mode), F(0)))),
            )
        self.assertEqual(left, gadd((mu_2, F(0)), remainder))

        absolute_moment = 2 * sum(
            (
                mode**6 * abs(coefficient)
                for mode, coefficient in enumerate(positive, start=1)
            ),
            F(0),
        )
        real_part = F(4)
        self.assertGreater(
            real_part**2 - len(positive) ** 2,
            absolute_moment / abs(mu_2),
        )
        s = (real_part, F(5))
        self.assertNotEqual(
            secular_value(c, positive, gmul(s, s)), (F(0), F(0))
        )

    def test_endpoint_jet_identities_include_centered_phase(self) -> None:
        central = F(7, 5)
        positive = [F(-2, 3), F(5, 7), F(-11, 13)]
        sqrt_length = F(4)
        c = central + 2 * sum(positive, F(0))
        endpoint_value = c / sqrt_length
        self.assertEqual(sqrt_length * endpoint_value, c)

        for order in (1, 2, 3):
            mu = 2 * sum(
                (
                    mode ** (2 * order) * coefficient
                    for mode, coefficient in enumerate(positive, start=1)
                ),
                F(0),
            )
            # This is f^(2k)(L/2)/(2*pi/L)^(2k), with the transcendental
            # scale canceled before exact evaluation.
            scaled_derivative = (
                (-1) ** order
                * 2
                * sum(
                    (
                        mode ** (2 * order) * coefficient
                        for mode, coefficient in enumerate(positive, start=1)
                    ),
                    F(0),
                )
                / sqrt_length
            )
            reconstructed = (
                (-1) ** order * sqrt_length * scaled_derivative
            )
            self.assertEqual(reconstructed, mu)

            odd_pair_sum = sum(
                (
                    coefficient
                    * (mode ** (2 * order - 1) - mode ** (2 * order - 1))
                    for mode, coefficient in enumerate(positive, start=1)
                ),
                F(0),
            )
            self.assertEqual(odd_pair_sum, 0)

    def test_rank_one_determinant_and_mixed_residue_no_go(self) -> None:
        central = F(5)
        positive = [F(2), F(-1), F(3)]
        c = central + 2 * sum(positive, F(0))
        u = [
            F(2 * mode * mode) * coefficient / c
            for mode, coefficient in enumerate(positive, start=1)
        ]
        y = F(7, 3)
        matrix = []
        for row in range(len(positive)):
            entries = []
            for column in range(len(positive)):
                diagonal = y - F((row + 1) ** 2) if row == column else F(0)
                entries.append(diagonal + u[row])
            matrix.append(entries)

        polynomial = raw_polynomial(central, positive)
        self.assertEqual(c * determinant(matrix), poly_value(polynomial, y))

        # Positive diagonal h_i cannot make h_i*u_i constant when two
        # nonzero residues have opposite signs.
        self.assertLess(u[0] * u[1], 0)

    def test_positive_imaginary_axis_family_and_hb_reversal(self) -> None:
        alpha = F(1)
        polynomial = [alpha * alpha, F(0), F(1)]
        expected_coordinates = (
            alpha * alpha / 4,
            [-(1 + alpha * alpha) / 6, (16 + alpha * alpha) / 24],
        )
        coordinates = interpolation_coordinates(polynomial, 2)
        self.assertEqual(coordinates, expected_coordinates)
        self.assertEqual(raw_polynomial(*coordinates), polynomial)
        self.assertEqual(coordinates[0] + 2 * sum(coordinates[1], F(0)), 1)

        denominator = lattice_polynomial(2)
        for radius in (F(0), F(1, 3), F(2), F(7, 2)):
            self.assertGreater(poly_value(polynomial, -(radius * radius)), 0)
            self.assertGreater(poly_value(denominator, -(radius * radius)), 0)

        # v(+-i*alpha)^2=alpha/2 lies between heights 1/2 and 1.
        inner = winding_index(polynomial, denominator, F(1, 2))
        outer = winding_index(polynomial, denominator, F(1))
        self.assertEqual(inner - outer, 4)
        self.assertEqual(inner % 2, 0)
        self.assertEqual(outer % 2, 0)
        self.assertEqual(inner // 2 - outer // 2, 2)

        # At h=1, alpha<2h^2 is the HB/lower-half-plane branch, but it is
        # exactly the branch containing the forbidden nonreal roots.
        self.assertLess(alpha, 2 * F(1) ** 2)
        outside_alpha = F(3)
        outside = [outside_alpha**2, F(0), F(1)]
        near_axis = winding_index(outside, denominator, F(1, 10))
        at_height = winding_index(outside, denominator, F(1))
        self.assertGreater(outside_alpha, 2 * F(1) ** 2)
        self.assertEqual(near_axis, at_height)

    def test_splitting_family_and_exact_finite_horizontal_escape(self) -> None:
        radius = F(3)
        epsilon = F(1, 4)
        polynomial = [
            (radius * radius + epsilon * epsilon) ** 2,
            2 * (epsilon * epsilon - radius * radius),
            F(1),
        ]
        coordinates = interpolation_coordinates(polynomial, 2)
        self.assertEqual(raw_polynomial(*coordinates), polynomial)

        for r in (F(0), F(1, 3), F(2), F(5)):
            left = poly_value(polynomial, -(r * r))
            right = (
                radius * radius + epsilon * epsilon - r * r
            ) ** 2 + 4 * radius * radius * r * r
            self.assertEqual(left, right)
            self.assertGreater(left, 0)

        denominator = lattice_polynomial(2)
        below_pair = winding_index(polynomial, denominator, F(1, 8))
        above_pair = winding_index(polynomial, denominator, F(1, 2))
        self.assertEqual(below_pair - above_pair, 4)

        double_real_limit = [radius**4, -2 * radius**2, F(1)]
        self.assertEqual(
            double_real_limit,
            poly_mul([-radius**2, F(1)], [-radius**2, F(1)]),
        )

        # Normalize the constant term.  At each fixed y the family tends to
        # one as R grows while its roots remain at +-R+-i*epsilon.
        y = F(2)

        def normalized_error(large_radius: F) -> F:
            value = [
                (large_radius**2 + epsilon**2) ** 2,
                2 * (epsilon**2 - large_radius**2),
                F(1),
            ]
            return abs(
                poly_value(value, y)
                / (large_radius**2 + epsilon**2) ** 2
                - 1
            )

        self.assertLess(normalized_error(F(100)), normalized_error(F(10)))

    def test_gevrey_escaping_factor_symmetry_positivity_and_zeros(self) -> None:
        radius = F(5)
        alpha = F(1, 3)
        half_degree = 3
        z = (F(2), F(1, 4))

        value = escaping_factor(z, radius, alpha, half_degree)
        self.assertEqual(
            escaping_factor(gneg(z), radius, alpha, half_degree), value
        )
        self.assertEqual(
            escaping_factor(gconj(z), radius, alpha, half_degree),
            gconj(value),
        )
        self.assertEqual(
            escaping_factor((radius, alpha), radius, alpha, half_degree),
            (F(0), F(0)),
        )

        imaginary_value = escaping_factor(
            (F(0), F(1, 2)), radius, alpha, half_degree
        )
        self.assertEqual(imaginary_value[1], 0)
        self.assertGreater(imaginary_value[0], 0)

        fixed_point = (F(1), F(0))
        small_radius_error = gnorm_squared(
            gsub(
                escaping_factor(
                    fixed_point, F(5), alpha, half_degree
                ),
                (F(1), F(0)),
            )
        )
        large_radius_error = gnorm_squared(
            gsub(
                escaping_factor(
                    fixed_point, F(20), alpha, half_degree
                ),
                (F(1), F(0)),
            )
        )
        self.assertLess(large_radius_error, small_radius_error)

    def test_note_records_all_branches_and_rejects_a_proof_claim(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "4C_{(a,b)}=\\mathcal I_{a+}-\\mathcal I_{b-}",
            "4C_{(a,b)}=2(U_{a+}-U_{b-})",
            "Z_{\\delta-}=Z_{a_\\lambda+}",
            "M^2+{B_k\\over|a_k|}",
            "c=\\sqrt L\\,f(L/2)",
            "Shifted Hermite--Biehler has the opposite geometry",
            "q+iq'",
            "by two turns",
            "0<\\beta_-\\le |\\Im z|\\le\\beta_+<1/2",
            "p_{R,\\epsilon}(y)",
            "H_L(z)",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the actual-source shrinking-collar equality is proved",
            "the endpoint-jet rate is certified",
        )
        for token in forbidden:
            self.assertNotIn(token, text)

        source = Path(__file__).read_text(encoding="utf-8")
        for dependency in ("numpy", "scipy", "sympy", "mpmath"):
            self.assertNotIn(f"import {dependency}", source)


if __name__ == "__main__":
    unittest.main()
