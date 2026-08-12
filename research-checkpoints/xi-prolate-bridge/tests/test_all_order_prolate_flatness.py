#!/usr/bin/env python3
"""Exact algebra regressions for the all-order prolate recursion."""

from __future__ import annotations

import math
import unittest
from dataclasses import dataclass
from fractions import Fraction


def _squarefree_split(n: int) -> tuple[int, int]:
    """Return ``outside, squarefree`` with sqrt(n)=outside*sqrt(squarefree)."""

    if n <= 0:
        raise ValueError("positive radicand required")
    outside = 1
    squarefree = 1
    p = 2
    while p * p <= n:
        exponent = 0
        while n % p == 0:
            n //= p
            exponent += 1
        outside *= p ** (exponent // 2)
        if exponent % 2:
            squarefree *= p
        p += 1
    if n > 1:
        squarefree *= n
    return outside, squarefree


@dataclass(frozen=True)
class Surd:
    """An exact element of the finite multiquadratic algebra used here."""

    terms: tuple[tuple[int, Fraction], ...] = ()

    @staticmethod
    def _make(data: dict[int, Fraction]) -> "Surd":
        return Surd(tuple(sorted((d, q) for d, q in data.items() if q)))

    @staticmethod
    def rational(value: int | Fraction) -> "Surd":
        q = Fraction(value)
        return Surd() if not q else Surd(((1, q),))

    @staticmethod
    def sqrt_int(n: int, coefficient: int | Fraction = 1) -> "Surd":
        outside, squarefree = _squarefree_split(n)
        return Surd._make({squarefree: Fraction(coefficient) * outside})

    def __add__(self, other: "Surd") -> "Surd":
        data = dict(self.terms)
        for d, q in other.terms:
            data[d] = data.get(d, Fraction()) + q
        return Surd._make(data)

    def __neg__(self) -> "Surd":
        return Surd(tuple((d, -q) for d, q in self.terms))

    def __sub__(self, other: "Surd") -> "Surd":
        return self + (-other)

    def __mul__(self, other: "Surd") -> "Surd":
        data: dict[int, Fraction] = {}
        for d1, q1 in self.terms:
            for d2, q2 in other.terms:
                common = math.gcd(d1, d2)
                radicand = d1 * d2 // (common * common)
                data[radicand] = data.get(radicand, Fraction()) + q1 * q2 * common
        return Surd._make(data)

    def scale(self, value: int | Fraction) -> "Surd":
        q = Fraction(value)
        return Surd(tuple((d, q * c) for d, c in self.terms if q * c))

    def __bool__(self) -> bool:
        return bool(self.terms)


@dataclass(frozen=True)
class PiPolynomial:
    """Exact Laurent polynomial in p=1/pi with multiquadratic coefficients."""

    terms: tuple[tuple[int, Surd], ...] = ()

    @staticmethod
    def _make(data: dict[int, Surd]) -> "PiPolynomial":
        return PiPolynomial(tuple(sorted((degree, c) for degree, c in data.items() if c)))

    @staticmethod
    def constant(value: int | Fraction | Surd) -> "PiPolynomial":
        coefficient = value if isinstance(value, Surd) else Surd.rational(value)
        return PiPolynomial() if not coefficient else PiPolynomial(((0, coefficient),))

    @staticmethod
    def monomial(degree: int, value: int | Fraction | Surd = 1) -> "PiPolynomial":
        coefficient = value if isinstance(value, Surd) else Surd.rational(value)
        return PiPolynomial() if not coefficient else PiPolynomial(((degree, coefficient),))

    def __add__(self, other: "PiPolynomial") -> "PiPolynomial":
        data = dict(self.terms)
        for degree, coefficient in other.terms:
            data[degree] = data.get(degree, Surd()) + coefficient
        return PiPolynomial._make(data)

    def __neg__(self) -> "PiPolynomial":
        return PiPolynomial(tuple((degree, -coefficient) for degree, coefficient in self.terms))

    def __sub__(self, other: "PiPolynomial") -> "PiPolynomial":
        return self + (-other)

    def __mul__(self, other: "PiPolynomial") -> "PiPolynomial":
        data: dict[int, Surd] = {}
        for d1, c1 in self.terms:
            for d2, c2 in other.terms:
                degree = d1 + d2
                data[degree] = data.get(degree, Surd()) + c1 * c2
        return PiPolynomial._make(data)

    def scale(self, value: int | Fraction) -> "PiPolynomial":
        return PiPolynomial._make(
            {degree: coefficient.scale(value) for degree, coefficient in self.terms}
        )

    def shift(self, degree: int) -> "PiPolynomial":
        return PiPolynomial(tuple((d + degree, c) for d, c in self.terms))

    def __bool__(self) -> bool:
        return bool(self.terms)


Vector = dict[int, PiPolynomial]


def _vector_add(*summands: tuple[PiPolynomial, Vector]) -> Vector:
    result: Vector = {}
    for scalar, vector in summands:
        for label, coefficient in vector.items():
            result[label] = result.get(label, PiPolynomial()) + scalar * coefficient
    return {label: coefficient for label, coefficient in result.items() if coefficient}


def _vector_scale(scalar: PiPolynomial, vector: Vector) -> Vector:
    return _vector_add((scalar, vector))


def _apply_v(vector: Vector) -> Vector:
    result: Vector = {}
    for label, coefficient in vector.items():
        diagonal = Fraction(-(2 * label * label + 2 * label + 3), 4)
        result[label] = result.get(label, PiPolynomial()) + coefficient.scale(diagonal)
        if label >= 4:
            radicand = label * (label - 1) * (label - 2) * (label - 3)
            multiplier = PiPolynomial.constant(Surd.sqrt_int(radicand, Fraction(1, 4)))
            result[label - 4] = result.get(label - 4, PiPolynomial()) + multiplier * coefficient
        radicand = (label + 1) * (label + 2) * (label + 3) * (label + 4)
        multiplier = PiPolynomial.constant(Surd.sqrt_int(radicand, Fraction(1, 4)))
        result[label + 4] = result.get(label + 4, PiPolynomial()) + multiplier * coefficient
    return {label: coefficient for label, coefficient in result.items() if coefficient}


def _gap_apply(target: int, vector: Vector) -> Vector:
    """Apply H-E_target, using E_m-E_target=4*pi*(m-target)."""

    return {
        label: coefficient.shift(-1).scale(4 * (label - target))
        for label, coefficient in vector.items()
        if label != target and coefficient
    }


def _raw_recursion(target: int, order: int) -> tuple[list[Vector], list[PiPolynomial]]:
    vectors: list[Vector] = [{target: PiPolynomial.constant(1)}]
    eigenvalues = [PiPolynomial()]
    for j in range(1, order + 1):
        v_previous = _apply_v(vectors[j - 1])
        mu_j = v_previous.get(target, PiPolynomial())
        eigenvalues.append(mu_j)
        rhs = _vector_add((PiPolynomial.constant(-1), v_previous))
        for k in range(1, j + 1):
            rhs = _vector_add(
                (PiPolynomial.constant(1), rhs),
                (eigenvalues[k], vectors[j - k]),
            )
        if rhs.get(target, PiPolynomial()):
            raise AssertionError("solvability component did not cancel")
        rhs.pop(target, None)
        vector_j = {
            label: coefficient.shift(1).scale(Fraction(1, 4 * (label - target)))
            for label, coefficient in rhs.items()
        }
        vectors.append(vector_j)
    return vectors, eigenvalues


def _dot(left: Vector, right: Vector) -> PiPolynomial:
    result = PiPolynomial()
    for label in set(left).intersection(right):
        result = result + left[label] * right[label]
    return result


def _series_multiply(
    left: list[PiPolynomial], right: list[PiPolynomial], order: int
) -> list[PiPolynomial]:
    result = [PiPolynomial() for _ in range(order + 1)]
    for i, a in enumerate(left):
        for j, b in enumerate(right):
            if i + j <= order:
                result[i + j] = result[i + j] + a * b
    return result


def _normalized_recursion(target: int, order: int) -> list[Vector]:
    raw, _ = _raw_recursion(target, order)
    norm = [PiPolynomial() for _ in range(order + 1)]
    for i in range(order + 1):
        for j in range(order + 1 - i):
            norm[i + j] = norm[i + j] + _dot(raw[i], raw[j])
    if norm[0] != PiPolynomial.constant(1):
        raise AssertionError("leading quasimode norm changed")

    x = list(norm)
    x[0] = PiPolynomial()
    inverse_sqrt = [PiPolynomial.constant(1)] + [PiPolynomial() for _ in range(order)]
    power = [PiPolynomial.constant(1)] + [PiPolynomial() for _ in range(order)]
    binomial = Fraction(1)
    for r in range(1, order + 1):
        power = _series_multiply(power, x, order)
        binomial *= Fraction(-1, 2) - (r - 1)
        binomial /= r
        for j in range(order + 1):
            inverse_sqrt[j] = inverse_sqrt[j] + power[j].scale(binomial)

    normalized: list[Vector] = []
    for j in range(order + 1):
        pieces = [(inverse_sqrt[k], raw[j - k]) for k in range(j + 1)]
        normalized.append(_vector_add(*pieces))
    return normalized


def _origin_ratio(label: int) -> Surd:
    """Return h_label(0)/h_0(0) for a label divisible by four."""

    if label % 4:
        raise ValueError("only Fourier +1 Hermite labels are used")
    denominator = 2 ** (label // 2) * math.factorial(label // 2)
    return Surd.sqrt_int(math.factorial(label), Fraction(1, denominator))


def _origin_value(vector: Vector) -> PiPolynomial:
    result = PiPolynomial()
    for label, coefficient in vector.items():
        result = result + coefficient * PiPolynomial.constant(_origin_ratio(label))
    return result


def _source_corrections(order: int) -> list[Vector]:
    mode_zero = _normalized_recursion(0, order)
    mode_four = _normalized_recursion(4, order)
    denominator = [_origin_value(vector) for vector in mode_zero]
    numerator = [_origin_value(vector) for vector in mode_four]
    if denominator[0] != PiPolynomial.constant(1):
        raise AssertionError("h_0(0) quotient normalization changed")

    quotient: list[PiPolynomial] = []
    for j in range(order + 1):
        coefficient = numerator[j]
        for ell in range(j):
            coefficient = coefficient - quotient[ell] * denominator[j - ell]
        quotient.append(coefficient)

    corrections: list[Vector] = []
    for j in range(order + 1):
        correction = mode_four[j]
        for ell in range(j + 1):
            correction = _vector_add(
                (PiPolynomial.constant(1), correction),
                (-quotient[ell], mode_zero[j - ell]),
            )
        corrections.append(correction)
    return corrections


class AllOrderProlateFlatnessTests(unittest.TestCase):
    def test_exact_recursion_and_mod_four_support_through_order_three(self) -> None:
        for target in (0, 4):
            vectors, eigenvalues = _raw_recursion(target, 3)
            expected_mu_one = Fraction(-3, 4) if target == 0 else Fraction(-43, 4)
            self.assertEqual(eigenvalues[1], PiPolynomial.constant(expected_mu_one))
            for j in range(1, 4):
                self.assertTrue(all(label % 4 == target % 4 for label in vectors[j]))
                self.assertLessEqual(max(vectors[j], default=target), target + 4 * j)
                rhs = _vector_add((PiPolynomial.constant(-1), _apply_v(vectors[j - 1])))
                for k in range(1, j + 1):
                    rhs = _vector_add(
                        (PiPolynomial.constant(1), rhs),
                        (eigenvalues[k], vectors[j - k]),
                    )
                self.assertEqual(_gap_apply(target, vectors[j]), rhs)

    def test_formal_normalization_through_order_three(self) -> None:
        order = 3
        for target in (0, 4):
            vectors = _normalized_recursion(target, order)
            for total_degree in range(1, order + 1):
                coefficient = PiPolynomial()
                for i in range(total_degree + 1):
                    coefficient = coefficient + _dot(vectors[i], vectors[total_degree - i])
                self.assertEqual(coefficient, PiPolynomial())

    def test_first_source_correction_matches_closed_form_exactly(self) -> None:
        first = _source_corrections(1)[1]
        expected = {
            0: PiPolynomial.monomial(1, Surd.sqrt_int(6, Fraction(1, 8))),
            4: PiPolynomial.monomial(1, Fraction(3, 64)),
            8: PiPolynomial.monomial(1, Surd.sqrt_int(105, Fraction(-1, 16))),
        }
        self.assertEqual(first, expected)

    def test_origin_and_integral_cancel_through_order_three(self) -> None:
        corrections = _source_corrections(3)
        for correction in corrections:
            # Mod-four support proves F_+ correction=correction.  Its integral
            # is therefore its value at zero, reconstructed exactly below.
            self.assertTrue(all(label % 4 == 0 for label in correction))
            self.assertEqual(_origin_value(correction), PiPolynomial())


if __name__ == "__main__":
    unittest.main()
