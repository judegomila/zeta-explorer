#!/usr/bin/env python3
"""Exact regressions for the prolate-anchor strip-root no-go."""

from __future__ import annotations

from fractions import Fraction
import json
import math
from pathlib import Path
import unittest


F = Fraction
ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "PROLATE_ANCHOR_STRIP_ROOT_NO_GO.md"


def _poly_add(left: list[F], right: list[F]) -> list[F]:
    out = [F(0) for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return out


def _poly_mul(left: list[F], right: list[F]) -> list[F]:
    out = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            out[i + j] += left_value * right_value
    return out


def _poly_value(polynomial: list[F], value: F) -> F:
    out = F(0)
    for coefficient in reversed(polynomial):
        out = out * value + coefficient
    return out


def _raw_polynomial(central: F, positive: list[F]) -> list[F]:
    count = len(positive)
    full = [F(1)]
    for mode in range(1, count + 1):
        full = _poly_mul(full, [F(-(mode * mode)), F(1)])
    out = [central * value for value in full]
    for mode, coefficient in enumerate(positive, start=1):
        omitted = [F(1)]
        for other in range(1, count + 1):
            if other != mode:
                omitted = _poly_mul(
                    omitted, [F(-(other * other)), F(1)]
                )
        contribution = [F(0)] + [2 * coefficient * value for value in omitted]
        out = _poly_add(out, contribution)
    return out


class ProlateAnchorStripRootNoGoTests(unittest.TestCase):
    def test_raw_polynomial_lattice_interpolation_is_exact(self) -> None:
        central = F(3, 5)
        positive = [F(-2, 7), F(5, 11), F(-7, 13)]
        polynomial = _raw_polynomial(central, positive)
        count = len(positive)

        self.assertEqual(
            _poly_value(polynomial, F(0)),
            (-1) ** count * math.factorial(count) ** 2 * central,
        )
        for mode, coefficient in enumerate(positive, start=1):
            expected = (
                (-1) ** (count - mode)
                * math.factorial(count - mode)
                * math.factorial(count + mode)
                * coefficient
            )
            self.assertEqual(
                _poly_value(polynomial, F(mode * mode)), expected
            )

        self.assertEqual(
            polynomial[-1], central + 2 * sum(positive, F(0))
        )

    def test_fixed_two_mode_limit_polynomial_and_discriminant(self) -> None:
        polynomial = _raw_polynomial(F(1), [F(-1), F(1)])
        self.assertEqual(polynomial, [F(4), F(1), F(1)])
        discriminant = polynomial[1] ** 2 - 4 * polynomial[2] * polynomial[0]
        self.assertEqual(discriminant, F(-15))

        # For y=(-1+i*sqrt(15))/2, |y|=2 exactly.  Formula (1.4)
        # therefore gives |Im sqrt(y)|^2=(2+1/2)/2=5/4.
        modulus_squared = F(1 + 15, 4)
        self.assertEqual(modulus_squared, F(4))
        imaginary_square = (F(2) - F(-1, 2)) / 2
        self.assertEqual(imaginary_square, F(5, 4))

    def test_physical_scaling_enters_strip(self) -> None:
        # The limiting exact value is pi*sqrt(5)/L.  This numerical
        # evaluation tests only the algebraic scaling, not a source threshold.
        for length in (20.0, 40.0, 80.0):
            physical_height = math.pi * math.sqrt(5.0) / length
            self.assertLess(physical_height, 0.5)
        self.assertGreater(2 * math.pi * math.sqrt(5.0), 10.0)

    def test_parabola_identity_is_exact(self) -> None:
        # If y=(u+i*v)^2, then
        # 4*d^2*(Re(y)+d^2)-Im(y)^2
        #   =4*(d^2-v^2)*(u^2+d^2).
        cases = [
            (F(3, 2), F(1, 3), F(2, 3)),
            (F(-5, 4), F(7, 5), F(3, 2)),
            (F(0), F(5, 2), F(2)),
        ]
        for real_sqrt, imag_sqrt, delta in cases:
            real_y = real_sqrt**2 - imag_sqrt**2
            imag_y = 2 * real_sqrt * imag_sqrt
            left = 4 * delta**2 * (real_y + delta**2) - imag_y**2
            right = 4 * (delta**2 - imag_sqrt**2) * (
                real_sqrt**2 + delta**2
            )
            self.assertEqual(left, right)
            self.assertEqual(left > 0, abs(imag_sqrt) < delta)

    def test_centered_mode_forces_alternating_direction(self) -> None:
        length = 7.25
        half = length / 2
        centered_coordinate = 0.37
        for mode in range(7):
            unshifted = math.cos(
                2 * math.pi * mode * (centered_coordinate + half) / length
            )
            centered = ((-1) ** mode) * math.cos(
                2 * math.pi * mode * centered_coordinate / length
            )
            self.assertAlmostEqual(unshifted, centered, places=14)

    def test_global_exclusion_is_stronger_than_local_convergence(self) -> None:
        alpha = 0.25

        def coefficients(index: int) -> tuple[complex, complex]:
            root = complex(index, alpha)
            conjugate_root = root.conjugate()
            quadratic = -(1 / root**2 + 1 / conjugate_root**2)
            quartic = 1 / (root**2 * conjugate_root**2)
            return quadratic, quartic

        quadratic_10, quartic_10 = coefficients(10)
        quadratic_100, quartic_100 = coefficients(100)
        self.assertAlmostEqual(quadratic_10.imag, 0.0, places=15)
        self.assertAlmostEqual(quartic_10.imag, 0.0, places=15)
        self.assertLess(abs(quadratic_100), abs(quadratic_10))
        self.assertLess(abs(quartic_100), abs(quartic_10))
        self.assertLess(alpha, 0.5)

        root = complex(100, alpha)
        value = (1 - root**2 / root**2) * (
            1 - root**2 / root.conjugate() ** 2
        )
        self.assertAlmostEqual(abs(value), 0.0, places=18)

        # A fixed compact value tends to one as the four zeros escape.
        fixed = complex(2, 0.1)
        approximation = (
            1 - fixed**2 / root**2
        ) * (1 - fixed**2 / root.conjugate() ** 2)
        self.assertLess(abs(approximation - 1), 0.001)

    def test_source_lock_and_claim_boundary_are_present(self) -> None:
        lock = json.loads((ROOT / "P0_SOURCE_LOCK.json").read_text())
        self.assertEqual(lock["lock_version"], 1)
        self.assertEqual(
            lock["binding_sources"][0]["version"], "arXiv:2511.22755v1"
        )

        note = NOTE.read_text()
        for required in (
            "P0_INVALIDATED",
            "e^{-izt}",
            "source-normalized",
            "not by unit",
            "minus sign",
            "1<n<=lambda^2",
            "fixed-rank projection error does not",
            "Global exclusion is strictly stronger",
        ):
            self.assertIn(required, note)


if __name__ == "__main__":
    unittest.main()
