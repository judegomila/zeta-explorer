#!/usr/bin/env python3
"""Exact replay for the fixed-width finite-Gram escape theorem.

The checker uses only integer polynomial algebra.  It verifies the product
rule, the complete a/b/s operator recurrence, the bounded multiplication-band
escape, and the effective-degree argument for finite differential-operator
dictionaries.  It makes no numerical theta or all-degree sign claim.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import random
from typing import Iterable


Polynomial = tuple[int, ...]  # coefficient of t**j at index j
Operator = tuple[Polynomial, ...]  # polynomial coefficient of D**j at index j
ModuleVector = tuple[Polynomial, Polynomial]  # P*W + Q*W'


def trim(poly: Iterable[int]) -> Polynomial:
    result = list(poly)
    while result and result[-1] == 0:
        result.pop()
    return tuple(result)


def add(left: Polynomial, right: Polynomial) -> Polynomial:
    length = max(len(left), len(right))
    return trim(
        (left[index] if index < len(left) else 0)
        + (right[index] if index < len(right) else 0)
        for index in range(length)
    )


def scale(value: int, poly: Polynomial) -> Polynomial:
    return trim(value * coefficient for coefficient in poly)


def multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    if not left or not right:
        return ()
    result = [0] * (len(left) + len(right) - 1)
    for i, left_coefficient in enumerate(left):
        for j, right_coefficient in enumerate(right):
            result[i + j] += left_coefficient * right_coefficient
    return trim(result)


def derivative(poly: Polynomial, order: int = 1) -> Polynomial:
    result = poly
    for _ in range(order):
        result = trim(
            index * result[index]
            for index in range(1, len(result))
        )
    return result


def shift(poly: Polynomial, power: int) -> Polynomial:
    return () if not poly else (0,) * power + poly


def degree(poly: Polynomial) -> int:
    return len(poly) - 1


def module_add(left: ModuleVector, right: ModuleVector) -> ModuleVector:
    return add(left[0], right[0]), add(left[1], right[1])


def module_scale(value: int, vector: ModuleVector) -> ModuleVector:
    return scale(value, vector[0]), scale(value, vector[1])


def module_shift(vector: ModuleVector, power: int) -> ModuleVector:
    return shift(vector[0], power), shift(vector[1], power)


def apply_operator(operator: Operator, poly: Polynomial) -> Polynomial:
    result: Polynomial = ()
    for order, coefficient_poly in enumerate(operator):
        result = add(result, multiply(coefficient_poly, derivative(poly, order)))
    return result


def operator_shift(operator: Operator) -> int:
    candidates = [
        degree(coefficient_poly) - order
        for order, coefficient_poly in enumerate(operator)
        if coefficient_poly
    ]
    if not candidates:
        raise ValueError("the zero operator has no effective degree shift")
    return max(candidates)


def falling(value: int, order: int) -> int:
    result = 1
    for offset in range(order):
        result *= value - offset
    return result


def leading_symbol(operator: Operator, monomial_degree: int) -> int:
    delta = operator_shift(operator)
    return sum(
        coefficient_poly[-1] * falling(monomial_degree, order)
        for order, coefficient_poly in enumerate(operator)
        if coefficient_poly and degree(coefficient_poly) - order == delta
    )


def monic_parity_poly(rng: random.Random, value_degree: int) -> Polynomial:
    coefficients = [0] * (value_degree + 1)
    for exponent in range(value_degree % 2, value_degree, 2):
        coefficients[exponent] = rng.randint(-13, 13)
    coefficients[value_degree] = 1
    return trim(coefficients)


def random_operator(rng: random.Random, max_order: int = 4) -> Operator:
    order = rng.randint(0, max_order)
    pieces: list[Polynomial] = []
    for _ in range(order + 1):
        coefficient_degree = rng.randint(0, 6)
        coefficients = [rng.randint(-5, 5) for _ in range(coefficient_degree + 1)]
        pieces.append(trim(coefficients))
    if not any(pieces):
        pieces[0] = (1,)
    return tuple(pieces)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--seed", type=int, default=20261103)
    parser.add_argument("--trials", type=int, default=400)
    args = parser.parse_args()
    if args.trials < 1:
        raise ValueError("--trials must be positive")

    rng = random.Random(args.seed)
    product_rule_checks = 0
    recurrence_checks = 0
    band_escape_checks = 0
    dictionary_escape_checks = 0
    skipped_symbol_roots = 0

    # This exact polynomial identity is the algebraic part of the integration
    # by parts which gives <s,pW> = integral(q*p'*W^2).
    for _ in range(args.trials):
        q = monic_parity_poly(rng, rng.randint(2, 32))
        p = monic_parity_poly(rng, rng.randint(1, 31))
        assert derivative(multiply(q, p)) == add(
            multiply(derivative(q), p), multiply(q, derivative(p))
        )
        product_rule_checks += 1

    sample: dict[str, object] | None = None
    for _ in range(args.trials):
        current_degree = 2 * rng.randint(3, 30) + rng.randint(0, 1)
        q = monic_parity_poly(rng, current_degree)
        q_prior = monic_parity_poly(rng, current_degree - 2)
        alpha = rng.randint(-19, 19)
        beta = rng.randint(1, 19)
        q_next = add(add(shift(q, 2), scale(-alpha, q)), scale(-beta, q_prior))
        assert degree(q_next) == current_degree + 2 and q_next[-1] == 1

        a: ModuleVector = (derivative(q), ())
        b: ModuleVector = (shift(q, 1), ())
        s: ModuleVector = (scale(-1, derivative(q)), scale(-2, q))
        a_prior: ModuleVector = (derivative(q_prior), ())
        b_prior: ModuleVector = (shift(q_prior, 1), ())
        s_prior: ModuleVector = (
            scale(-1, derivative(q_prior)),
            scale(-2, q_prior),
        )
        a_next: ModuleVector = (derivative(q_next), ())
        b_next: ModuleVector = (shift(q_next, 1), ())
        s_next: ModuleVector = (
            scale(-1, derivative(q_next)),
            scale(-2, q_next),
        )

        expected_a_next = module_add(
            module_add(
                module_add(module_shift(a, 2), module_scale(-alpha, a)),
                module_scale(2, b),
            ),
            module_scale(-beta, a_prior),
        )
        expected_b_next = module_add(
            module_add(module_shift(b, 2), module_scale(-alpha, b)),
            module_scale(-beta, b_prior),
        )
        expected_s_next = module_add(
            module_add(
                module_add(module_shift(s, 2), module_scale(-alpha, s)),
                module_scale(-2, b),
            ),
            module_scale(-beta, s_prior),
        )
        assert a_next == expected_a_next
        assert b_next == expected_b_next
        assert s_next == expected_s_next
        recurrence_checks += 3

        band = rng.randint(0, 12)
        top_new_b = module_shift(b_next, 2 * band)
        top_escape = module_shift(b, 2 * (band + 1))
        lower_terms = module_add(
            module_scale(-alpha, module_shift(b, 2 * band)),
            module_scale(-beta, module_shift(b_prior, 2 * band)),
        )
        assert top_new_b == module_add(top_escape, lower_terms)
        old_max_degree = degree(module_shift(b, 2 * band)[0])
        assert degree(top_escape[0]) == old_max_degree + 2
        assert degree(top_new_b[0]) == old_max_degree + 2
        band_escape_checks += 1

        if sample is None:
            sample = {
                "current_degree": current_degree,
                "alpha": alpha,
                "beta": beta,
                "band_R": band,
                "old_band_max_degree": old_max_degree,
                "new_top_feature_degree": degree(top_new_b[0]),
            }

    # Test the invariant degree-shift formulation.  A zero leading symbol is
    # exactly one of the theorem's finite exceptional degrees, and is counted
    # rather than silently treated as a failure.
    attempts = 0
    while dictionary_escape_checks < args.trials:
        attempts += 1
        if attempts > 20 * args.trials:
            raise RuntimeError("too many exceptional leading-symbol roots")
        dictionary = tuple(random_operator(rng) for _ in range(rng.randint(1, 9)))
        delta_star = max(operator_shift(operator) for operator in dictionary)
        top_operator = next(
            operator
            for operator in dictionary
            if operator_shift(operator) == delta_star
        )
        current_degree = rng.randint(18, 80)
        if leading_symbol(top_operator, current_degree + 2) == 0:
            skipped_symbol_roots += 1
            continue

        q = monic_parity_poly(rng, current_degree)
        q_prior = monic_parity_poly(rng, current_degree - 2)
        alpha = rng.randint(-11, 11)
        beta = rng.randint(1, 11)
        q_next = add(add(shift(q, 2), scale(-alpha, q)), scale(-beta, q_prior))
        escaped = apply_operator(top_operator, q_next)
        old_features = [
            apply_operator(operator, residual)
            for residual in (q, q_prior)
            for operator in dictionary
        ]
        old_max_degree = max(degree(feature) for feature in old_features if feature)
        assert degree(escaped) == current_degree + 2 + delta_star
        assert degree(escaped) > old_max_degree
        dictionary_escape_checks += 1

    source_path = Path(__file__).resolve()
    payload = {
        "status": "PASS",
        "scope": (
            "Exact polynomial algebra only; no finite-degree theta, "
            "all-degree pivot, Xi--Laguerre, or RH claim."
        ),
        "seed": args.seed,
        "trials_requested_per_family": args.trials,
        "checks": {
            "product_rule": product_rule_checks,
            "full_a_b_s_operator_recurrence": recurrence_checks,
            "bounded_scalar_band_escape": band_escape_checks,
            "finite_dictionary_scalar_span_escape": dictionary_escape_checks,
            "skipped_finite_symbol_roots": skipped_symbol_roots,
        },
        "sample_band_escape": sample,
        "source": str(source_path),
        "source_sha256": digest(source_path),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
