#!/usr/bin/env python3
"""Exact source-free countermodel for the prior-derivative score rule.

The positive even entire Schwartz profile

    W(t) = exp(-t^2/2) * (1 + 4*t^2/5)

has a positive old even signed block and a positive degree-four signed
Galerkin pivot.  Nevertheless, for its actual degree-four residual q_2 and
the prior residual q_1, the projected auxiliary on

    span{q_2', t*q_2, q_1'}

is strictly negative.  Every calculation below is exact over Q after a
common positive sqrt(pi) factor is removed.

This refutes only a source-free implication.  It says nothing adverse about
the complete-theta finite certificates and proves no RH statement.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from math import factorial
from pathlib import Path


Q = Fraction
Polynomial = dict[int, Q]


def add(left: Polynomial, right: Polynomial) -> Polynomial:
    result = dict(left)
    for degree, coefficient in right.items():
        result[degree] = result.get(degree, Q(0)) + coefficient
    return {degree: coefficient for degree, coefficient in result.items() if coefficient}


def scale(polynomial: Polynomial, coefficient: Q) -> Polynomial:
    return {
        degree: coefficient * value
        for degree, value in polynomial.items()
        if coefficient * value
    }


def multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    result: Polynomial = {}
    for left_degree, left_coefficient in left.items():
        for right_degree, right_coefficient in right.items():
            degree = left_degree + right_degree
            result[degree] = result.get(degree, Q(0)) + left_coefficient * right_coefficient
    return {degree: coefficient for degree, coefficient in result.items() if coefficient}


def shift(polynomial: Polynomial, degree: int) -> Polynomial:
    return {old_degree + degree: coefficient for old_degree, coefficient in polynomial.items()}


def derivative(polynomial: Polynomial) -> Polynomial:
    return {
        degree - 1: degree * coefficient
        for degree, coefficient in polynomial.items()
        if degree
    }


def gaussian_moment(degree: int) -> Q:
    """Return integral t^degree exp(-t^2) dt / sqrt(pi)."""

    if degree % 2:
        return Q(0)
    order = degree // 2
    if order == 0:
        return Q(1)
    return Q(factorial(2 * order), 4**order * factorial(order))


def integrate_gaussian(polynomial: Polynomial) -> Q:
    return sum(
        (coefficient * gaussian_moment(degree) for degree, coefficient in polynomial.items()),
        Q(0),
    )


def determinant(matrix: list[list[Q]]) -> Q:
    work = [list(row) for row in matrix]
    size = len(work)
    result = Q(1)
    for column in range(size):
        pivot = next(row for row in range(column, size) if work[row][column])
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        diagonal = work[column][column]
        result *= diagonal
        for row in range(column + 1, size):
            multiplier = work[row][column] / diagonal
            for inner_column in range(column + 1, size):
                work[row][inner_column] -= multiplier * work[column][inner_column]
    return result


def solve(matrix: list[list[Q]], vector: list[Q]) -> list[Q]:
    size = len(vector)
    work = [list(matrix[row]) + [vector[row]] for row in range(size)]
    for column in range(size):
        pivot = next(row for row in range(column, size) if work[row][column])
        work[column], work[pivot] = work[pivot], work[column]
        diagonal = work[column][column]
        work[column] = [entry / diagonal for entry in work[column]]
        for row in range(size):
            if row == column:
                continue
            multiplier = work[row][column]
            work[row] = [
                work[row][inner] - multiplier * work[column][inner]
                for inner in range(size + 1)
            ]
    return [work[row][-1] for row in range(size)]


def fraction_text(value: Q) -> str:
    return str(value.numerator) if value.denominator == 1 else f"{value.numerator}/{value.denominator}"


def polynomial_record(polynomial: Polynomial) -> dict[str, str]:
    return {
        str(degree): fraction_text(polynomial[degree])
        for degree in sorted(polynomial)
    }


def vector_record(vector: list[Q]) -> list[str]:
    return [fraction_text(value) for value in vector]


def matrix_record(matrix: list[list[Q]]) -> list[list[str]]:
    return [vector_record(row) for row in matrix]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    # W=exp(-t^2/2)P.  Removing exp(-t^2), write
    # W'=exp(-t^2/2)u and W''=exp(-t^2/2)v.
    parameter = Q(4, 5)
    profile_polynomial = {0: Q(1), 2: parameter}
    u = add(derivative(profile_polynomial), scale(shift(profile_polynomial, 1), Q(-1)))
    v = add(derivative(u), scale(shift(u, 1), Q(-1)))
    signed_polynomial = add(multiply(u, u), scale(multiply(profile_polynomial, v), Q(-1)))
    positive_polynomial = multiply(profile_polynomial, profile_polynomial)
    assert signed_polynomial == {0: Q(-3, 5), 2: Q(72, 25), 4: Q(16, 25)}

    signed_moments = [
        integrate_gaussian(shift(signed_polynomial, 2 * index))
        for index in range(5)
    ]
    positive_moments = [
        integrate_gaussian(shift(positive_polynomial, 2 * index))
        for index in range(7)
    ]
    assert signed_moments == [Q(33, 25), Q(153, 50), Q(183, 20), Q(1467, 40), Q(2961, 16)]

    old_signed_gram = [
        [signed_moments[0], signed_moments[1]],
        [signed_moments[1], signed_moments[2]],
    ]
    old_signed_determinant = determinant(old_signed_gram)
    assert signed_moments[0] == Q(33, 25) > 0
    assert old_signed_determinant == Q(3393, 1250) > 0

    degree_four_coefficients = solve(
        old_signed_gram,
        [-signed_moments[2], -signed_moments[3]],
    )
    prior_residual = {0: -signed_moments[1] / signed_moments[0], 2: Q(1)}
    current_residual = {
        0: degree_four_coefficients[0],
        2: degree_four_coefficients[1],
        4: Q(1),
    }
    assert prior_residual == {0: Q(-51, 22), 2: Q(1)}
    assert current_residual == {0: Q(15835, 1508), 2: Q(-2835, 377), 4: Q(1)}
    assert integrate_gaussian(multiply(multiply(current_residual, {0: Q(1)}), signed_polynomial)) == Q(0)
    assert integrate_gaussian(multiply(multiply(current_residual, {2: Q(1)}), signed_polynomial)) == Q(0)

    signed_target = integrate_gaussian(
        multiply(multiply(current_residual, current_residual), signed_polynomial)
    )
    assert signed_target == Q(4035, 754) > 0

    def positive_inner(left: Polynomial, right: Polynomial) -> Q:
        return integrate_gaussian(multiply(multiply(left, right), positive_polynomial))

    current_derivative = derivative(current_residual)
    basis = [current_derivative, shift(current_residual, 1), derivative(prior_residual)]
    gram = [[positive_inner(left, right) for right in basis] for left in basis]
    score = [positive_inner(current_residual, derivative(feature)) for feature in basis]
    derivative_norm = positive_inner(current_derivative, current_derivative)
    gram_determinant = determinant(gram)
    projection_coefficients = solve(gram, score)
    projected_norm = sum(
        (score[index] * projection_coefficients[index] for index in range(3)),
        Q(0),
    )
    auxiliary = (projected_norm - derivative_norm) / 4

    assert gram_determinant == Q(17734914, 125) > 0
    assert auxiliary == Q(-14131991108769, 2800717324340) < 0

    bordered = [gram[row] + [score[row]] for row in range(3)]
    bordered.append(score + [derivative_norm])
    bordered_determinant = determinant(bordered)
    assert bordered_determinant == Q(254375839957842, 88830625) > 0
    assert bordered_determinant == -4 * auxiliary * gram_determinant

    source_path = Path(__file__).resolve()
    source_sha256 = hashlib.sha256(source_path.read_bytes()).hexdigest()
    receipt = {
        "schema_version": "zsv.prior_derivative_source_free_countermodel.20261103.v1",
        "status": "PASS",
        "scope": (
            "Exact rational source-free countermodel at the actual degree-four "
            "Galerkin residual of W=exp(-t^2/2)(1+4t^2/5)"
        ),
        "source_sha256": source_sha256,
        "normalization": "Every displayed integral has its common positive sqrt(pi) factor removed",
        "profile": {
            "W": "exp(-t^2/2)*(1+4*t^2/5)",
            "positive_even_entire_schwartz": True,
            "W_squared_polynomial_after_exp_minus_t2": polynomial_record(positive_polynomial),
            "Lambda_polynomial_after_exp_minus_t2": polynomial_record(signed_polynomial),
        },
        "signed_moments_M0_through_M4": vector_record(signed_moments),
        "positive_moments_J0_through_J6": vector_record(positive_moments),
        "old_signed_block": {
            "gram": matrix_record(old_signed_gram),
            "determinant": fraction_text(old_signed_determinant),
            "positive_definite": True,
        },
        "residuals": {
            "q_prior_degree_two": polynomial_record(prior_residual),
            "q_current_degree_four": polynomial_record(current_residual),
            "current_signed_target": fraction_text(signed_target),
            "current_signed_target_positive": True,
        },
        "prior_derivative_auxiliary": {
            "basis": ["q_current_prime", "t*q_current", "q_prior_prime"],
            "gram": matrix_record(gram),
            "score": vector_record(score),
            "derivative_norm": fraction_text(derivative_norm),
            "gram_determinant": fraction_text(gram_determinant),
            "projection_coefficients": vector_record(projection_coefficients),
            "auxiliary": fraction_text(auxiliary),
            "auxiliary_negative": True,
            "bordered_determinant": fraction_text(bordered_determinant),
        },
        "conclusion": (
            "Old signed-block positivity plus a positive current signed target does not "
            "imply positivity of span{q_N',t*q_N,q_(N-1)'} for a general positive "
            "even entire Schwartz profile; any uniform proof must use complete-theta arithmetic"
        ),
        "nonclaims": [
            "The profile is not the complete theta profile",
            "The result does not refute the 13 finite complete-theta certificates",
            "The result proves no all-degree theta theorem or RH statement",
        ],
    }
    serialized = json.dumps(receipt, indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.write_text(serialized, encoding="utf-8")
    else:
        print(serialized, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
