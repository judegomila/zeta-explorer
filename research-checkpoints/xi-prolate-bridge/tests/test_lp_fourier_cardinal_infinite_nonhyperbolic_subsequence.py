#!/usr/bin/env python3
"""Exact regressions for the infinite Fourier-cardinal counterfamily.

Only Python standard-library rational arithmetic is used.  These tests
check the forced factorization, the reciprocal-square Newton identity, the
exact beta-value cancellation, and rational sign enclosures.  They do not
assert anything about the actual prolate source family.
"""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT / "notes" /
    "LP_FOURIER_CARDINAL_INFINITE_NONHYPERBOLIC_SUBSEQUENCE.md"
)

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}

Polynomial = tuple[F, ...]  # ascending coefficients


def add(left: Polynomial, right: Polynomial) -> Polynomial:
    result = [F(0)] * max(len(left), len(right))
    for index, value in enumerate(left):
        result[index] += value
    for index, value in enumerate(right):
        result[index] += value
    return tuple(result)


def scale(polynomial: Polynomial, scalar: F) -> Polynomial:
    return tuple(scalar * value for value in polynomial)


def multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    result = [F(0)] * (len(left) + len(right) - 1)
    for row, x_value in enumerate(left):
        for column, y_value in enumerate(right):
            result[row + column] += x_value * y_value
    return tuple(result)


def product(factors: tuple[Polynomial, ...]) -> Polynomial:
    answer: Polynomial = (F(1),)
    for factor in factors:
        answer = multiply(answer, factor)
    return answer


def raw_polynomial(raw: tuple[F, ...]) -> Polynomial:
    count = len(raw) - 1
    factors = tuple((F(-n * n), F(1)) for n in range(1, count + 1))
    denominator = product(factors)
    answer = scale(denominator, raw[0])
    for n in range(1, count + 1):
        cofactor = product(tuple(
            factor for index, factor in enumerate(factors, start=1)
            if index != n
        ))
        answer = add(answer, (F(0),) + scale(cofactor, 2 * raw[n]))
    return answer


def odd_factor(mode_count: int, pi_value: F) -> Polynomial:
    nodes = tuple(2 * index - 1 for index in range(1, mode_count + 1))
    factors = tuple((F(-node * node), F(1)) for node in nodes)
    denominator = product(factors)
    answer = scale(denominator, pi_value / 2)
    for index, node in enumerate(nodes, start=1):
        cofactor = product(tuple(
            factor for row, factor in enumerate(factors, start=1)
            if row != index
        ))
        coordinate = F((-1) ** index, node)
        answer = add(answer, (F(0),) + scale(cofactor, 2 * coordinate))
    return answer


def indicator_coordinates(cutoff: int, pi_value: F) -> tuple[F, ...]:
    raw = [pi_value / 2]
    for mode in range(1, cutoff + 1):
        if mode % 2 == 0:
            raw.append(F(0))
        else:
            index = (mode + 1) // 2
            raw.append(F((-1) ** index, mode))
    return tuple(raw)


def reciprocal_square_formula(mode_count: int, pi_value: F) -> F:
    a4 = sum(
        (F(1, (2 * index - 1) ** 4)
         for index in range(1, mode_count + 1)),
        F(0),
    )
    b3 = sum(
        (F((-1) ** (index - 1), (2 * index - 1) ** 3)
         for index in range(1, mode_count + 1)),
        F(0),
    )
    b5 = sum(
        (F((-1) ** (index - 1), (2 * index - 1) ** 5)
         for index in range(1, mode_count + 1)),
        F(0),
    )
    return a4 + 16 * b3 * b3 / (pi_value * pi_value) - 8 * b5 / pi_value


class LPFourierCardinalInfiniteCounterfamilyTests(unittest.TestCase):
    def test_package_contains_no_disallowed_control_bytes(self) -> None:
        for path in (NOTE, Path(__file__).resolve()):
            disallowed = [
                (offset, byte)
                for offset, byte in enumerate(path.read_bytes())
                if (byte < 32 and byte != 10) or byte == 127
            ]
            self.assertEqual(disallowed, [], path)

    def test_protected_source_bytes_are_unchanged(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_zero_even_modes_force_the_displayed_factors(self) -> None:
        # Two rational placeholders prove the affine-in-pi polynomial
        # identities while keeping every operation exact.
        for pi_value in (F(3), F(22, 7)):
            for mode_count in range(1, 8):
                odd = odd_factor(mode_count, pi_value)
                even_factors = tuple(
                    (F(-4 * index * index), F(1))
                    for index in range(1, mode_count)
                )
                expected_odd_cutoff = multiply(product(even_factors), odd)
                odd_cutoff = 2 * mode_count - 1
                self.assertEqual(
                    raw_polynomial(indicator_coordinates(odd_cutoff, pi_value)),
                    expected_odd_cutoff,
                )

                even_cutoff = 2 * mode_count
                expected_even_cutoff = multiply(
                    expected_odd_cutoff,
                    (F(-even_cutoff * even_cutoff), F(1)),
                )
                self.assertEqual(
                    raw_polynomial(indicator_coordinates(even_cutoff, pi_value)),
                    expected_even_cutoff,
                )

    def test_reciprocal_square_newton_identity_is_exact(self) -> None:
        # For q/q(0)=1+u1*y+u2*y^2+..., the reciprocal-square
        # root sum is u1^2-2*u2.  Check the closed formula in Q(pi)
        # through two exact rational evaluations.
        for pi_value in (F(3), F(22, 7)):
            for mode_count in range(2, 10):
                polynomial = odd_factor(mode_count, pi_value)
                u1 = polynomial[1] / polynomial[0]
                u2 = polynomial[2] / polynomial[0]
                newton_sum = u1 * u1 - 2 * u2
                self.assertEqual(
                    newton_sum,
                    reciprocal_square_formula(mode_count, pi_value),
                )

    def test_infinite_beta_constants_cancel_exactly(self) -> None:
        # Divide the pi^4 identity by pi^4.  This is (3.12) without
        # floating-point evaluation.
        cancellation = (
            F(1, 96)
            + 16 * F(1, 32) ** 2
            - 8 * F(5, 1536)
        )
        self.assertEqual(cancellation, 0)

        # The cross term from (beta(3)-delta_3)^2 is exactly
        # -pi*delta_3 after the common powers of pi are removed.
        self.assertEqual(-32 * F(1, 32), -1)

    def test_uniform_tail_comparisons_reduce_to_exact_rational_bounds(self) -> None:
        # pi>3 gives both pi^2>8 and, at the minimal omitted odd mode
        # b=5, 16/(pi^2*b^6)<b^-4.
        lower_pi = F(3)
        minimal_b = F(5)
        self.assertGreater(lower_pi * lower_pi, 8)
        self.assertLess(
            F(16, 1) / (lower_pi * lower_pi * minimal_b**6),
            F(1, 1) / minimal_b**4,
        )

        # h(a)=a^-3-a^-5 is positive and decreasing for a>=5 because
        # h'(a) has numerator 5-3*a^2.
        self.assertGreater(F(1, 5**3) - F(1, 5**5), 0)
        self.assertLess(5 - 3 * minimal_b**2, 0)

    def test_even_mode_counts_have_exact_negative_enclosures(self) -> None:
        # A tight classical rational enclosure for pi.  For a positive
        # term 16*B3^2/pi^2 use the lower endpoint; for the negative term
        # -8*B5/pi use the upper endpoint.  A negative resulting upper
        # bound certifies the Newton sum's sign with Fraction arithmetic.
        lower_pi = F(103993, 33102)
        upper_pi = F(104348, 33215)
        self.assertLess(lower_pi, upper_pi)
        self.assertGreater(lower_pi, 3)

        for mode_count in range(2, 102, 2):
            a4 = sum(
                (F(1, (2 * index - 1) ** 4)
                 for index in range(1, mode_count + 1)),
                F(0),
            )
            b3 = sum(
                (F((-1) ** (index - 1), (2 * index - 1) ** 3)
                 for index in range(1, mode_count + 1)),
                F(0),
            )
            b5 = sum(
                (F((-1) ** (index - 1), (2 * index - 1) ** 5)
                 for index in range(1, mode_count + 1)),
                F(0),
            )
            upper_bound = (
                a4
                + 16 * b3 * b3 / lower_pi**2
                - 8 * b5 / upper_pi
            )
            self.assertLess(upper_bound, 0, mode_count)

    def test_note_records_the_exact_subsequence_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Laguerre--Polya membership",
            r"E(y)={\sin(\pi\sqrt y/2)\over\sqrt y}",
            r"x_{2j}=0",
            r"p_{2M-1}(y)",
            r"p_{2M}(y)",
            "exact Newton identity",
            r"\sum_{j=1}^M\rho_{j,M}^{-2}<0",
            r"N=4r-1",
            r"N=4r",
            "does not exclude a specially selected",
            "ordinary LP membership",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "all Fourier-cardinal sections are nonhyperbolic",
            "no cofinal hyperbolic subsequence exists",
            "the actual prolate states are eventually nonhyperbolic",
            "This proves the Riemann hypothesis",
            "Lambda is bounded",
        )
        for token in forbidden:
            self.assertNotIn(token, text)


if __name__ == "__main__":
    unittest.main()
