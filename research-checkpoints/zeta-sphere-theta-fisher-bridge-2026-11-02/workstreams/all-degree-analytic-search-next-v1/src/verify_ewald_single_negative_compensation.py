#!/usr/bin/env python3
"""Exact checks for the one-negative-cell Ewald compensation identity."""

from __future__ import annotations

from fractions import Fraction
import hashlib
import json
from pathlib import Path


def add(a: list[Fraction], b: list[Fraction]) -> list[Fraction]:
    n = max(len(a), len(b))
    out = [Fraction(0) for _ in range(n)]
    for i, value in enumerate(a):
        out[i] += value
    for i, value in enumerate(b):
        out[i] += value
    return trim(out)


def sub(a: list[Fraction], b: list[Fraction]) -> list[Fraction]:
    return add(a, [-value for value in b])


def mul(a: list[Fraction], b: list[Fraction]) -> list[Fraction]:
    out = [Fraction(0) for _ in range(len(a) + len(b) - 1)]
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            out[i + j] += x * y
    return trim(out)


def derivative(a: list[Fraction]) -> list[Fraction]:
    if len(a) <= 1:
        return [Fraction(0)]
    return trim([Fraction(i) * a[i] for i in range(1, len(a))])


def shift(a: list[Fraction], count: int = 1) -> list[Fraction]:
    return [Fraction(0)] * count + a


def scale(a: list[Fraction], c: Fraction) -> list[Fraction]:
    return trim([c * value for value in a])


def trim(a: list[Fraction]) -> list[Fraction]:
    out = list(a)
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return out


def evaluate(a: list[Fraction], z: Fraction) -> Fraction:
    total = Fraction(0)
    for value in reversed(a):
        total = total * z + value
    return total


def encode_fraction(value: Fraction) -> str:
    return str(value.numerator) if value.denominator == 1 else f"{value.numerator}/{value.denominator}"


def encode_poly(poly: list[Fraction]) -> list[str]:
    return [encode_fraction(value) for value in poly]


def check_example(cells: list[Fraction]) -> dict[str, object]:
    assert len(cells) >= 4
    assert cells[0] == 0
    assert cells[1] > 0
    assert cells[2] < 0
    assert all(value >= 0 for value in cells[3:])

    positive = [Fraction(0) for _ in cells]
    negative = [Fraction(0) for _ in cells]
    for index, value in enumerate(cells):
        if value >= 0:
            positive[index] = value
        else:
            negative[index] = -value

    signed = sub(positive, negative)
    assert signed == trim(cells)
    d_pairing = sub(mul(derivative(positive), negative), mul(positive, derivative(negative)))

    z_s_prime_minus_2s = sub(shift(derivative(signed)), scale(signed, Fraction(2)))
    b = -cells[2]
    collapsed = scale(shift(z_s_prime_minus_2s), b)
    assert d_pairing == collapsed

    # F=(zS'-2S)/z.  The numerator has no constant term.
    assert z_s_prime_minus_2s[0] == 0
    f_poly = z_s_prime_minus_2s[1:]
    expected_f = [Fraction(0) for _ in range(len(cells) - 1)]
    expected_f[0] = -cells[1]
    for n in range(3, len(cells)):
        expected_f[n - 1] = Fraction(n - 2) * cells[n]
    assert trim(expected_f) == trim(f_poly)
    assert all(value >= 0 for value in derivative(f_poly))

    s_at_one = sum(cells)
    sp_at_one = sum(Fraction(n) * cells[n] for n in range(len(cells)))
    assert evaluate(f_poly, Fraction(1)) == sp_at_one - 2 * s_at_one

    # Direct pairwise expansion of D.
    pairwise = [Fraction(0)]
    for i, ai in enumerate(positive):
        for j, bj in enumerate(negative):
            if ai and bj:
                term = [Fraction(0)] * (i + j)
                term[i + j - 1] = Fraction(i - j) * ai * bj
                pairwise = add(pairwise, term)
    assert pairwise == d_pairing

    # Seed and one-turn derivative geometry.
    seed = evaluate(signed, Fraction(1, 2))
    seed_floor = (2 * cells[1] + cells[2]) / 4
    assert seed >= seed_floor
    third = derivative(derivative(derivative(signed)))
    assert all(value >= 0 for value in third)

    return {
        "cells": encode_poly(cells),
        "D": encode_poly(d_pairing),
        "F": encode_poly(f_poly),
        "endpoint_gap": encode_fraction(sp_at_one - 2 * s_at_one),
        "seed": encode_fraction(seed),
        "seed_floor": encode_fraction(seed_floor),
        "F_derivative_coefficients_nonnegative": True,
        "S_third_derivative_coefficients_nonnegative": True,
    }


def main() -> None:
    examples = [
        [Fraction(0), Fraction(13, 5), Fraction(-7, 6), Fraction(1, 9), Fraction(1, 80)],
        [
            Fraction(0),
            Fraction(17, 3),
            Fraction(-11, 7),
            Fraction(2, 13),
            Fraction(0),
            Fraction(1, 101),
            Fraction(1, 997),
        ],
    ]
    checks = [check_example(cells) for cells in examples]

    receipt = {
        "status": "PASS",
        "exact_examples": checks,
        "identities": {
            "aggregate_collapse": "D=b*z*(z*S_prime-2*S)",
            "endpoint_equivalence": "D<=0 on (0,1] iff S_prime(1)-2*S(1)<=0 under the sole-negative-index-2 sign pattern",
            "spectral_multiplier": "H1-4*Xi",
            "physical_packet": "eta-2*psi",
        },
        "scope": "exact rational algebra only; the actual all-index sign pattern and endpoint inequality remain unproved",
    }
    encoded = json.dumps(receipt, indent=2, sort_keys=True) + "\n"
    output = Path(__file__).resolve().parents[1] / "results" / "ewald_single_negative_compensation.json"
    output.write_text(encoded, encoding="utf-8")
    source_sha = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    output_sha = hashlib.sha256(encoded.encode()).hexdigest()
    print(json.dumps({"status": "PASS", "source_sha256": source_sha, "receipt_sha256": output_sha}, sort_keys=True))


if __name__ == "__main__":
    main()
