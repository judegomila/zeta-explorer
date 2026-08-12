#!/usr/bin/env python3
"""Exact regressions for natural-cutoff negative-real root exclusion."""

from __future__ import annotations

from fractions import Fraction as F
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md"


def poly_add(left: list[F], right: list[F]) -> list[F]:
    out = [F(0) for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return out


def poly_mul(left: list[F], right: list[F]) -> list[F]:
    out = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            out[i + j] += left_value * right_value
    return out


def poly_value(polynomial: list[F], value: F) -> F:
    out = F(0)
    for coefficient in reversed(polynomial):
        out = out * value + coefficient
    return out


def lattice_polynomial(count: int) -> list[F]:
    out = [F(1)]
    for mode in range(1, count + 1):
        out = poly_mul(out, [F(-(mode * mode)), F(1)])
    return out


def raw_polynomial(central: F, positive: list[F]) -> list[F]:
    count = len(positive)
    out = [central * value for value in lattice_polynomial(count)]
    for mode, coefficient in enumerate(positive, start=1):
        omitted = [F(1)]
        for other in range(1, count + 1):
            if other != mode:
                omitted = poly_mul(
                    omitted, [F(-(other * other)), F(1)]
                )
        contribution = [F(0)] + [
            2 * coefficient * value for value in omitted
        ]
        out = poly_add(out, contribution)
    return out


class NaturalCutoffNegativeRealRootExclusionTests(unittest.TestCase):
    def test_two_secular_forms_are_exact(self) -> None:
        central = F(5, 7)
        positive = [F(-3, 11), F(2, 13), F(-7, 17), F(11, 19)]
        polynomial = raw_polynomial(central, positive)
        lattice = lattice_polynomial(len(positive))
        y = F(3, 2)  # avoids 1,4,9,16

        direct = poly_value(polynomial, y) / poly_value(lattice, y)
        first = central + 2 * y * sum(
            (
                coefficient / (y - mode * mode)
                for mode, coefficient in enumerate(positive, start=1)
            ),
            F(0),
        )
        boundary = central + 2 * sum(positive, F(0))
        second = boundary + 2 * sum(
            (
                mode * mode * coefficient / (y - mode * mode)
                for mode, coefficient in enumerate(positive, start=1)
            ),
            F(0),
        )

        self.assertEqual(direct, first)
        self.assertEqual(first, second)
        self.assertEqual(polynomial[-1], boundary)

    def test_transform_numerator_identity_is_exact(self) -> None:
        central = F(7, 9)
        positive = [F(-2, 5), F(3, 8), F(-4, 13)]
        polynomial = raw_polynomial(central, positive)
        lattice = lattice_polynomial(len(positive))
        s = F(1, 2)

        mode_sum = central / s + sum(
            (
                coefficient * (F(1) / (s - mode) + F(1) / (s + mode))
                for mode, coefficient in enumerate(positive, start=1)
            ),
            F(0),
        )
        rational = (
            poly_value(polynomial, s * s)
            / (s * poly_value(lattice, s * s))
        )
        self.assertEqual(mode_sum, rational)

    def test_direct_mode_integral_phase_and_prefactor_are_exact(self) -> None:
        # Take L=9, so sqrt(L)=3, and s=1/2, so sin(pi*s)=1.
        # We scale each direct integral by pi; all remaining quantities are
        # then rational and the source phase can be checked without floats.
        length = F(9)
        sqrt_length = F(3)
        s = F(1, 2)

        def parity(mode: int) -> int:
            return -1 if abs(mode) % 2 else 1

        pi_scaled_modes: dict[int, F] = {}
        for mode in range(-3, 4):
            source_phase = parity(mode)
            sine_phase = parity(mode)  # sin(pi*(1/2-mode))
            frequency_difference_over_pi = 2 * (s - mode) / length
            direct = (
                F(source_phase, 1)
                / sqrt_length
                * 2
                * sine_phase
                / frequency_difference_over_pi
            )
            expected = sqrt_length / (s - mode)
            self.assertEqual(source_phase * sine_phase, 1)
            self.assertEqual(direct, expected)
            pi_scaled_modes[mode] = direct

        central = F(7, 9)
        positive = [F(-2, 5), F(3, 8), F(-4, 13)]
        coefficients = {0: central}
        for mode, coefficient in enumerate(positive, start=1):
            coefficients[mode] = coefficient
            coefficients[-mode] = coefficient
        direct_sum = sum(
            (coefficients[mode] * pi_scaled_modes[mode] for mode in coefficients),
            F(0),
        )

        polynomial = raw_polynomial(central, positive)
        lattice = lattice_polynomial(len(positive))
        expected_sum = (
            sqrt_length
            * poly_value(polynomial, s * s)
            / (s * poly_value(lattice, s * s))
        )
        self.assertEqual(direct_sum, expected_sum)

    def test_lattice_interpolation_and_endpoint_ratio(self) -> None:
        central = F(3, 5)
        positive = [F(-2, 7), F(5, 11), F(-7, 13), F(11, 17)]
        polynomial = raw_polynomial(central, positive)
        count = len(positive)

        zero_value = (-1) ** count * math.factorial(count) ** 2 * central
        self.assertEqual(poly_value(polynomial, F(0)), zero_value)
        for mode, coefficient in enumerate(positive, start=1):
            expected = (
                (-1) ** (count - mode)
                * math.factorial(count - mode)
                * math.factorial(count + mode)
                * coefficient
            )
            self.assertEqual(
                poly_value(polynomial, F(mode * mode)), expected
            )

        endpoint_ratio = abs(
            poly_value(polynomial, F(count * count)) / zero_value
        )
        expected_ratio = F(math.comb(2 * count, count)) * abs(
            positive[-1] / central
        )
        self.assertEqual(endpoint_ratio, expected_ratio)

    def test_central_binomial_endpoint_obstruction(self) -> None:
        for count in (2, 5, 12, 25):
            central = F(1)
            top_perturbation = F(1, math.comb(2 * count, count))
            positive = [F(0) for _ in range(count - 1)] + [top_perturbation]
            polynomial = raw_polynomial(central, positive)

            self.assertEqual(
                abs(poly_value(polynomial, F(count * count))),
                abs(poly_value(polynomial, F(0))),
            )
            self.assertGreater(top_perturbation, F(1, 4**count))

    def test_fixed_two_mode_limit_and_growing_zero_extension(self) -> None:
        fixed = raw_polynomial(F(1), [F(-1), F(1)])
        self.assertEqual(fixed, [F(4), F(1), F(1)])
        self.assertEqual(fixed[1] ** 2 - 4 * fixed[2] * fixed[0], F(-15))

        # The roots have |y|=2 and Re(y)=-1/2, hence
        # |Im sqrt(y)|^2=(2+1/2)/2=5/4.
        self.assertEqual((F(2) + F(1, 2)) / 2, F(5, 4))

        extended = raw_polynomial(
            F(1), [F(-1), F(1), F(0), F(0), F(0)]
        )
        expected = fixed
        for mode in (3, 4, 5):
            expected = poly_mul(expected, [F(-(mode * mode)), F(1)])
        self.assertEqual(extended, expected)

    def test_physical_negative_interval_and_parabola_mapping(self) -> None:
        delta = F(7, 3)
        radius = F(5, 4)
        self.assertLess(radius, delta)

        # With delta=L/(4*pi), (2*pi/L)*radius=radius/(2*delta).
        physical_height = radius / (2 * delta)
        self.assertLess(physical_height, F(1, 2))
        self.assertGreater(-(radius * radius), -(delta * delta))
        self.assertEqual(F(0) / (2 * delta), F(0))
        self.assertEqual(delta / (2 * delta), F(1, 2))
        endpoint_y = -(delta * delta)
        self.assertEqual(-endpoint_y, delta * delta)
        self.assertLessEqual(endpoint_y, 0)

        real_s = F(11, 7)
        imag_s = F(5, 6)
        real_y = real_s * real_s - imag_s * imag_s
        modulus_y = real_s * real_s + imag_s * imag_s
        v_squared = (modulus_y - real_y) / 2
        self.assertEqual(v_squared, imag_s * imag_s)

    def test_off_critical_mapping_lands_inside_physical_parabola(self) -> None:
        beta = F(3, 4)
        gamma = F(17, 3)
        real_z = gamma
        imag_z = F(1, 2) - beta

        self.assertNotEqual(real_z, 0)
        self.assertNotEqual(imag_z, 0)
        self.assertLess(2 * abs(imag_z), 1)

        # Scaling s=(L/(2*pi))*z does not affect the ratio v/delta.
        v_over_delta = 2 * abs(imag_z)
        self.assertEqual(v_over_delta, F(1, 2))
        # Both parts are nonzero, so y=s^2 is nonreal.
        self.assertNotEqual(2 * real_z * imag_z, 0)

    def test_weighted_closed_segment_gevrey_rate_is_eventually_small(self) -> None:
        # sqrt(L)<=exp(L/2) for L>=1 and lambda^(1/2)=exp(L/4).
        # Thus sqrt(L)*lambda^(1/2)*exp(-cL^2) is bounded by the
        # exponential with the exact exponent below.
        c = F(1, 100)

        def exponent_upper(length: F) -> F:
            return -c * length * length + F(3, 4) * length

        self.assertLess(exponent_upper(F(100)), 0)
        self.assertLess(exponent_upper(F(200)), exponent_upper(F(100)))
        self.assertLess(exponent_upper(F(400)), exponent_upper(F(200)))

    def test_claim_boundary_and_dependencies_are_explicit(self) -> None:
        note = NOTE.read_text()
        for required in (
            "P0_INVALIDATED",
            "closed imaginary segment",
            "source-normalized",
            "not unit-normalized",
            "minus sign",
            "1<n<=lambda^2",
            "-\\delta^2\\le y\\le0",
            "nonreal branch remains unresolved",
            "Riemann-hypothesis strength",
            "global finite exclusion is stronger",
            "4^{-M}",
            "|E(F)(u)|",
            "\\int_\\lambda^\\infty e^{-bu^2}",
            "total multiplicity",
            "GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md",
            "POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md",
        ):
            self.assertIn(required, note)


if __name__ == "__main__":
    unittest.main()
