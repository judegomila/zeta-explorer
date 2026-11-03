#!/usr/bin/env python3
"""Exact algebra checks for the N=1 modular s2 payment reduction.

This checker uses a tiny multivariate-polynomial representation from the
standard library.  It verifies only the cleared algebraic identities in the
accompanying note; it does not evaluate theta integrals or prove the remaining
inequalities.
"""

from __future__ import annotations

import hashlib
import json
import re
from decimal import Decimal
from fractions import Fraction
from pathlib import Path


VARIABLES = (
    "a",
    "I",
    "P",
    "Q",
    "s0",
    "s1",
    "I0",
    "Q0",
    "sigma0",
    "sigma1",
    "L",
    "C",
    "negative",
    "R",
    "cost",
    "S",
)
INDEX = {name: i for i, name in enumerate(VARIABLES)}


def mono(coefficient: int, **powers: int) -> dict[tuple[int, ...], int]:
    exponent = [0] * len(VARIABLES)
    for name, power in powers.items():
        exponent[INDEX[name]] = power
    return {tuple(exponent): coefficient} if coefficient else {}


def add(*polynomials: dict[tuple[int, ...], int]) -> dict[tuple[int, ...], int]:
    result: dict[tuple[int, ...], int] = {}
    for polynomial in polynomials:
        for exponent, coefficient in polynomial.items():
            result[exponent] = result.get(exponent, 0) + coefficient
            if result[exponent] == 0:
                del result[exponent]
    return result


def neg(polynomial: dict[tuple[int, ...], int]) -> dict[tuple[int, ...], int]:
    return {exponent: -coefficient for exponent, coefficient in polynomial.items()}


def assert_zero(label: str, polynomial: dict[tuple[int, ...], int]) -> None:
    if polynomial:
        raise AssertionError(f"{label} failed: {polynomial}")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def arb_endpoints(text: str) -> tuple[Decimal, Decimal]:
    match = re.fullmatch(r"\[([^ ]+) \+/- ([^\]]+)\]", text)
    if match is None:
        raise AssertionError(f"unrecognized Arb interval: {text!r}")
    midpoint = Decimal(match.group(1))
    radius = Decimal(match.group(2))
    return midpoint - radius, midpoint + radius


def main() -> int:
    # Clear the positive denominator s0*s1^2 in
    # kappa*mu + C1 - R_a = 0.
    cost_numerator = add(
        mono(4, a=1, Q=1, s0=1, s1=1),
        mono(4, a=3, Q=1, s0=2),
    )
    commutator_numerator = add(
        mono(4, a=1, I=1, s1=2),
        mono(-4, a=1, Q=1, s0=1, s1=1),
        mono(4, a=2, P=1, s0=1, s1=1),
    )
    remainder_numerator = add(
        mono(4, a=1, I=1, s1=2),
        mono(4, a=2, P=1, s0=1, s1=1),
        mono(4, a=3, Q=1, s0=2),
    )
    assert_zero(
        "finite-a cost decomposition",
        add(cost_numerator, commutator_numerator, neg(remainder_numerator)),
    )

    # The witness hypothesis is L+C-negative-R >= 0.  Its left side is
    # exactly (L-negative)-cost after cost=-C+R.
    witness_gap = add(
        mono(1, L=1),
        mono(1, C=1),
        mono(-1, negative=1),
        mono(-1, R=1),
    )
    lower_minus_cost = add(
        mono(1, L=1),
        mono(-1, negative=1),
        mono(-1, cost=1),
    )
    cost_relation = add(mono(1, cost=1), mono(1, C=1), mono(-1, R=1))
    assert_zero(
        "witness rearrangement modulo cost relation",
        add(lower_minus_cost, neg(witness_gap), cost_relation),
    )

    # Clear sigma0*sigma1 in cost0+C0-R0 = 0.
    endpoint_cost = mono(4, Q0=1, sigma0=1)
    endpoint_commutator = add(
        mono(4, I0=1, sigma1=1),
        mono(-4, Q0=1, sigma0=1),
    )
    endpoint_remainder = mono(4, I0=1, sigma1=1)
    assert_zero(
        "endpoint cost decomposition",
        add(endpoint_cost, endpoint_commutator, neg(endpoint_remainder)),
    )

    # Clear sigma0*sigma1 in
    # S/sigma1 + C0 - 4 I0/sigma0 = (S-4Q0)/sigma1.
    commutator_payment_left = add(
        mono(1, S=1, sigma0=1),
        endpoint_commutator,
        mono(-4, I0=1, sigma1=1),
    )
    payment_right = add(
        mono(1, S=1, sigma0=1),
        mono(-4, Q0=1, sigma0=1),
    )
    assert_zero(
        "endpoint commutator-payment equivalence",
        add(commutator_payment_left, neg(payment_right)),
    )

    source = Path(__file__).resolve()
    workstream = source.parents[1]
    checkpoint = workstream.parents[1]
    modular_receipt = workstream / "results" / "modular_vprime_tilt_certificate.json"
    square_receipt = (
        checkpoint
        / "evidence"
        / "v31-continuation"
        / "theta_correlated_local_v1"
        / "integrated_square_payment_64000.json"
    )
    curvature_receipt = (
        checkpoint
        / "evidence"
        / "v31-continuation"
        / "theta_correlated_local_v1"
        / "theta_curvature_square.json"
    )
    expected_hashes = {
        modular_receipt: "1db1987de3a7542c5cf02e45178b5d5dd65a76c1f2bfaeaa176184d5810290e5",
        square_receipt: "bd25296a2bd9d739fdc6463167198738dd60785ca6fa3ebbec941ba6c423d17e",
        curvature_receipt: "47353b64c47ce2d5e14112d2bbfcdfc0f2985a170e15c13cb8e64222823990f7",
    }
    for path, expected in expected_hashes.items():
        if sha256(path) != expected:
            raise AssertionError(f"frozen input hash mismatch: {path}")

    modular = json.loads(modular_receipt.read_text())
    _, psi_zero_upper = arb_endpoints(modular["psi_zero_squared"])
    if not psi_zero_upper < Decimal(16) / Decimal(5):
        raise AssertionError("psi(0)^2 < 16/5 is not certified")

    square = json.loads(square_receipt.read_text())
    moment_zero_lower, _ = arb_endpoints(square["moments"]["0"]["lo"])
    if not moment_zero_lower > Decimal(3) / Decimal(100):
        raise AssertionError("complete-theta M0 > 3/100 is not certified")

    curvature = json.loads(curvature_receipt.read_text())
    curvature_lower, _ = arb_endpoints(curvature["minimum_directed_lower"])
    if not curvature_lower > Decimal(1254):
        raise AssertionError("quadratic curvature lower bound > 1254 is not certified")

    q0_upper = Fraction(91, 136) * Fraction(16, 5)
    sigma0_lower = 2 * Fraction(3, 100)
    curvature_payment_lower = Fraction(1254, 32) * sigma0_lower
    if q0_upper != Fraction(182, 85):
        raise AssertionError("Q0 rational upper simplification failed")
    if curvature_payment_lower != Fraction(1881, 800):
        raise AssertionError("curvature payment rational lower simplification failed")
    if not q0_upper < curvature_payment_lower:
        raise AssertionError("endpoint rational payment margin is not positive")

    result = {
        "status": "PASS",
        "scope": (
            "Exact cleared N=1 algebra plus frozen input bounds for the normalized "
            "a=0 payment; no finite-positive-a, higher-degree, all-degree, or RH "
            "claim is evaluated."
        ),
        "checks": [
            "finite-a cost decomposition",
            "witness rearrangement",
            "endpoint cost decomposition",
            "endpoint commutator-payment equivalence",
            "frozen complete-theta input hashes",
            "psi(0)^2 < 16/5",
            "complete-theta M0 > 3/100",
            "quadratic curvature lower bound > 1254",
            "182/85 < 1881/800 endpoint payment margin",
        ],
        "frozen_inputs": {
            str(path.relative_to(checkpoint)): digest
            for path, digest in expected_hashes.items()
        },
        "rational_bounds": {
            "Q0_upper": "182/85",
            "curvature_payment_lower": "1881/800",
        },
        "source_sha256": sha256(source),
    }
    print(json.dumps(result, sort_keys=True, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
