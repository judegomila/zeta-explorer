#!/usr/bin/env python3
"""Exact structural regressions for the polynomial--Xi tower obstruction."""

from __future__ import annotations

import math
import unittest
from fractions import Fraction
from functools import lru_cache


@lru_cache(maxsize=None)
def _stirling_second(n: int, k: int) -> int:
    if n == k == 0:
        return 1
    if n == 0 or k == 0 or k > n:
        return 0
    return _stirling_second(n - 1, k - 1) + k * _stirling_second(n - 1, k)


def _half_geometric_power_sum(power: int) -> int:
    """Return sum_{k>=1} k**power/2**k as an exact integer."""

    if power == 0:
        return 1
    return 2 * sum(
        _stirling_second(power, j) * math.factorial(j)
        for j in range(1, power + 1)
    )


def _moment(index: int) -> Fraction:
    """Even moment for mass 2^(-k-1) at each of +/-k, k>=1."""

    return Fraction(_half_geometric_power_sum(2 * index))


def _moment_ratio(index: int) -> Fraction:
    return _moment(index + 1) / _moment(index)


def _witness_norm_squared(index: int) -> Fraction:
    """Integral of [t^(2n)(t^2-c_n)]^2 against the fixture measure."""

    c_n = _moment_ratio(index)
    return (
        _moment(2 * index + 2)
        - 2 * c_n * _moment(2 * index + 1)
        + c_n * c_n * _moment(2 * index)
    )


def _unit_window_mass(index: int) -> Fraction:
    """Window |t|<=1 contains only the two atoms at +/-1."""

    c_n = _moment_ratio(index)
    return Fraction(1, 2) * (1 - c_n) ** 2


Matrix = list[list[Fraction]]


def _transpose(matrix: Matrix) -> Matrix:
    return [list(row) for row in zip(*matrix)]


def _multiply(left: Matrix, right: Matrix) -> Matrix:
    return [
        [
            sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction())
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


def _add(left: Matrix, right: Matrix) -> Matrix:
    return [
        [left[i][j] + right[i][j] for j in range(len(left[0]))]
        for i in range(len(left))
    ]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    augmented = [
        list(matrix[i]) + [Fraction(int(i == j)) for j in range(size)]
        for i in range(size)
    ]
    for column in range(size):
        pivot = next(row for row in range(column, size) if augmented[row][column])
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        pivot_value = augmented[column][column]
        augmented[column] = [entry / pivot_value for entry in augmented[column]]
        for row in range(size):
            if row == column:
                continue
            multiplier = augmented[row][column]
            if multiplier:
                augmented[row] = [
                    a - multiplier * b
                    for a, b in zip(augmented[row], augmented[column])
                ]
    return [row[size:] for row in augmented]


def _trace(matrix: Matrix) -> Fraction:
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction())


def _congruence(matrix: Matrix, change: Matrix) -> Matrix:
    return _multiply(_transpose(change), _multiply(matrix, change))


def _raw_block_load(
    gram: Matrix, covariance: Matrix, energy: Matrix, ridge: Fraction
) -> Fraction:
    denominator = _add(energy, _scale(ridge, gram))
    return ridge * _trace(_multiply(covariance, _inverse(denominator)))


class PolynomialXiRadicalTowerCovarianceFloorTests(unittest.TestCase):
    def test_exact_moment_ratio_witness_is_anchor_orthogonal(self) -> None:
        for index in range(1, 10):
            c_n = _moment_ratio(index)
            self.assertEqual(_moment(index + 1) - c_n * _moment(index), 0)
            self.assertGreater(_witness_norm_squared(index), 0)

    def test_fixture_moment_ratios_are_monotone_and_unbounded(self) -> None:
        ratios = [_moment_ratio(index) for index in range(1, 18)]
        self.assertTrue(all(left < right for left, right in zip(ratios, ratios[1:])))
        self.assertGreater(ratios[-1], 2000)

    def test_exact_outer_atom_bound_for_unit_window(self) -> None:
        # For R=2, mu([-1,1])=1/2 and mu({-2,2})=1/4.  Equation (3.6)
        # therefore gives 18*16^(-n) once c_n>=2R^2.
        for index in range(1, 11):
            c_n = _moment_ratio(index)
            self.assertGreaterEqual(c_n, 8)
            quotient = _unit_window_mass(index) / _witness_norm_squared(index)
            bound = Fraction(18, 16**index)
            self.assertLessEqual(quotient, bound)

    def test_arbitrary_outer_scales_expose_the_asymptotic_mechanism(self) -> None:
        # The total mass at +/-R is 2^(-R).  These exact bounds have root
        # scale R^(-4), illustrating why arbitrary R forces a zero limiting
        # d-th root for an unbounded-support measure.
        index = 18
        c_n = _moment_ratio(index)
        actual = _unit_window_mass(index) / _witness_norm_squared(index)
        previous_root_bound: Fraction | None = None
        for radius in (2, 3, 4, 5):
            self.assertGreaterEqual(c_n, 2 * radius * radius)
            outer_mass = Fraction(1, 2**radius)
            window_mass = Fraction(1, 2)
            bound = (
                9
                * window_mass
                / outer_mass
                * Fraction(1, radius ** (4 * index))
            )
            self.assertLessEqual(actual, bound)
            root_bound = Fraction(1, radius**4)
            if previous_root_bound is not None:
                self.assertLess(root_bound, previous_root_bound)
            previous_root_bound = root_bound

    def test_raw_soft_block_load_is_exactly_basis_invariant(self) -> None:
        gram = [
            [Fraction(2), Fraction(1)],
            [Fraction(1), Fraction(3)],
        ]
        covariance = [
            [Fraction(1), Fraction(1, 3)],
            [Fraction(1, 3), Fraction(2)],
        ]
        energy = [
            [Fraction(5), Fraction(1)],
            [Fraction(1), Fraction(4)],
        ]
        ridge = Fraction(2, 5)
        change = [
            [Fraction(2), Fraction(1)],
            [Fraction(0), Fraction(3)],
        ]
        original = _raw_block_load(gram, covariance, energy, ridge)
        transformed = _raw_block_load(
            _congruence(gram, change),
            _congruence(covariance, change),
            _congruence(energy, change),
            ridge,
        )
        self.assertEqual(original, transformed)


if __name__ == "__main__":
    unittest.main()
