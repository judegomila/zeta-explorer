#!/usr/bin/env python3
"""Exact helpers for the physical arithmetic/parity conditioning reduction.

The analytic injectivity theorem is proved in
``notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md``.  This module reconstructs
its exact half-integer breakpoint arithmetic, Möbius conditioning constant,
and finite normalized-Gram determinant criterion.  Point spectral values are
diagnostics, not interval or uniform certificates.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
import math
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]


def _sha256(relative_path: str) -> str:
    return hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()


def parse_exact_lambda(lambda_text: str) -> Fraction:
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must enter as exact decimal or rational text")
    try:
        value = Fraction(lambda_text)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact lambda") from exc
    if value <= 1:
        raise ValueError("lambda must exceed one")
    return value


def mobius_values(limit: int) -> list[int]:
    """Return ``mu(0),...,mu(limit)`` by an integer-only sieve."""

    if not isinstance(limit, int) or limit < 1:
        raise ValueError("limit must be a positive integer")
    values = [1] * (limit + 1)
    prime = [True] * (limit + 1)
    prime[0] = False
    if limit >= 1:
        prime[1] = False
    for p in range(2, limit + 1):
        if not prime[p]:
            continue
        for multiple in range(p, limit + 1, p):
            prime[multiple] = False if multiple != p else prime[multiple]
            values[multiple] *= -1
        square = p * p
        for multiple in range(square, limit + 1, square):
            values[multiple] = 0
    values[0] = 0
    values[1] = 1
    return values


def mobius_conditioning_data(lambda_text: str) -> dict[str, object]:
    lam_exact = parse_exact_lambda(lambda_text)
    square = lam_exact * lam_exact
    cutoff = square.numerator // square.denominator
    mu = mobius_values(cutoff)
    lam = mp.mpf(lam_exact.numerator) / lam_exact.denominator
    constant = mp.fsum(mp.mpf(abs(mu[n])) / mp.sqrt(n) for n in range(1, cutoff + 1))
    return {
        "lambda_exact": str(lam_exact),
        "lambda_squared_exact": str(square),
        "cutoff_floor_lambda_squared": cutoff,
        "mobius_1_to_cutoff": mu[1:],
        "S_lambda": constant,
        "elementary_upper_2lambda": 2 * lam,
        "upper_bound_defect": 2 * lam - constant,
        "bound_pass": bool(constant <= 2 * lam),
    }


def half_integer_breakpoint_data(lambda_text: str) -> dict[str, object]:
    lam = parse_exact_lambda(lambda_text)
    if lam.denominator != 2 or lam.numerator % 2 != 1:
        raise ValueError("lambda is not a strict half-integer")
    reflected_index = lam * lam / 2
    return {
        "lambda_exact": str(lam),
        "forward_unmatched_breakpoint_u0": str(lam / 2),
        "reflected_argument_at_u0": str(Fraction(2, 1) / lam),
        "would_be_reflected_index_lambda_squared_over_2": str(reflected_index),
        "odd_square_mod_8": (lam.numerator * lam.numerator) % 8,
        "reflected_index_is_integer": reflected_index.denominator == 1,
        "unmatched_breakpoint_hypothesis_pass": reflected_index.denominator != 1,
    }


def endpoint_jet_leading_coefficient(order: int) -> Fraction:
    if not isinstance(order, int) or order < 0:
        raise ValueError("order must be a nonnegative integer")
    return Fraction(1, (2**order) * math.factorial(order))


def determinant_floor_from_bounds(
    determinant_lower: mp.mpf | str | int,
    operator_upper: mp.mpf | str | int,
    dimension: int,
) -> mp.mpf:
    determinant = mp.mpf(determinant_lower)
    upper = mp.mpf(operator_upper)
    if not isinstance(dimension, int) or dimension < 1:
        raise ValueError("dimension must be a positive integer")
    if determinant <= 0 or upper <= 0:
        raise ValueError("determinant lower bound and operator upper bound must be positive")
    return determinant / upper ** (dimension - 1)


def _inverse_square_root(matrix: mp.matrix) -> mp.matrix:
    values, vectors = mp.eighe(matrix)
    if values[0] <= 0:
        raise ValueError("source Gram must be positive definite")
    return vectors * mp.diag([1 / mp.sqrt(values[i]) for i in range(values.rows)]) * vectors.H


def normalized_gram_point_report(source_gram: mp.matrix, physical_columns: mp.matrix) -> dict[str, object]:
    """Evaluate the coordinate-invariant determinant criterion at a point."""

    dimension = source_gram.rows
    if dimension < 1:
        raise ValueError("source Gram must have positive dimension")
    if source_gram.cols != dimension:
        raise ValueError("source Gram must be square")
    source_adjoint = source_gram.H
    if any(
        source_gram[row, column] != source_adjoint[row, column]
        for row in range(dimension)
        for column in range(dimension)
    ):
        raise ValueError("source Gram must be Hermitian")
    if physical_columns.cols != dimension:
        raise ValueError("physical column count must match the source dimension")
    inverse_root = _inverse_square_root(source_gram)
    physical_gram = physical_columns.H * physical_columns
    normalized = inverse_root * physical_gram * inverse_root
    values, _ = mp.eighe((normalized + normalized.H) / 2)
    upper = mp.re(values[-1])
    lower = mp.re(values[0])
    determinant = mp.re(mp.det(normalized))
    determinant_floor = determinant_floor_from_bounds(determinant, upper, dimension)
    return {
        "dimension": dimension,
        "normalized_gram": normalized,
        "normalized_eigenvalue_floor_point": lower,
        "normalized_operator_upper_point": upper,
        "normalized_determinant_point": determinant,
        "determinant_criterion_floor_point": determinant_floor,
        "criterion_below_true_floor_defect": lower - determinant_floor,
        "finite_point_injective": bool(lower > 0),
        "claim_scope": "finite_arbitrary_precision_point_not_interval_or_uniform",
    }


def conditioning_reduction_report(lambda_text: str, dps: int = 80) -> dict[str, object]:
    if not isinstance(dps, int) or dps < 30:
        raise ValueError("dps must be an integer at least 30")
    mp.mp.dps = dps
    return {
        "artifact_version": "0.15.0-physical-conditioning-reduction",
        "terminal_state": "P0_INVALIDATED",
        "precision_decimal_digits": dps,
        "provenance_sha256": {
            "notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md": _sha256(
                "notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md"
            ),
            "src/physical_map_conditioning.py": _sha256(
                "src/physical_map_conditioning.py"
            ),
            "verifier/physical_map_conditioning_replay.py": _sha256(
                "verifier/physical_map_conditioning_replay.py"
            ),
        },
        "mobius": mobius_conditioning_data(lambda_text),
        "half_integer_breakpoint": half_integer_breakpoint_data(lambda_text),
        "first_endpoint_jet_leading_coefficients": [
            str(endpoint_jet_leading_coefficient(order)) for order in range(8)
        ],
        "continuous_parity_injectivity_scope": (
            "qualitative_on_finite_dimensional_analytic_source_spaces_at_fixed_half_integer_lambda"
        ),
        "uniform_physical_conditioning_proved": False,
        "claim_scope": "exact_arithmetic_reduction_not_uniform_conditioning",
    }


def _serialize(value: object, digits: int) -> object:
    if isinstance(value, (mp.mpf, mp.mpc)):
        return mp.nstr(mp.re(value), digits)
    if isinstance(value, mp.matrix):
        return [[_serialize(value[i, j], digits) for j in range(value.cols)] for i in range(value.rows)]
    if isinstance(value, dict):
        return {key: _serialize(item, digits) for key, item in value.items()}
    if isinstance(value, list):
        return [_serialize(item, digits) for item in value]
    return value


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    report = conditioning_reduction_report(args.lambda_text, args.dps)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(_serialize(report, args.dps), indent=2) + "\n")


if __name__ == "__main__":
    main()
