#!/usr/bin/env python3
"""Exact verifier for the Gaussian modular strong-payment barrier."""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
import math
from pathlib import Path


SOURCES = {
    "evidence/v20-v26-continuation/modular_cd_flux_v1/MODULAR_REFLECTION.md":
        "f835812a94fea49975530614dafe600449596d8e579fe2cacfef53a052cdd4e3",
    "evidence/v20-v26-continuation/modular_cd_flux_v1/PAID_HALF_LINE.md":
        "808cdf94c2196e8dbe819418534d9a95853ff8aa61d2ff3d09412a57a95b4fb0",
}


def add(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    size = max(len(left), len(right))
    return [
        (left[index] if index < len(left) else Fraction(0))
        + (right[index] if index < len(right) else Fraction(0))
        for index in range(size)
    ]


def scale(poly: list[Fraction], factor: Fraction | int) -> list[Fraction]:
    return [Fraction(factor) * coefficient for coefficient in poly]


def shift(poly: list[Fraction]) -> list[Fraction]:
    return [Fraction(0), *poly]


def derivative(poly: list[Fraction]) -> list[Fraction]:
    return [index * poly[index] for index in range(1, len(poly))]


def physicists_monic_hermite(max_degree: int) -> list[list[Fraction]]:
    polys = [[Fraction(1)], [Fraction(0), Fraction(1)]]
    for degree in range(1, max_degree):
        polys.append(
            add(shift(polys[-1]), scale(polys[-2], Fraction(-degree, 2)))
        )
    return polys[: max_degree + 1]


def odd_gaussian_moment(power: int) -> Fraction:
    """Integral from zero to infinity of x^power exp(-x^2), for odd power."""
    if power < 1 or power % 2 != 1:
        raise ValueError("power must be positive and odd")
    k = (power - 1) // 2
    return Fraction(math.factorial(k), 2)


def square(poly: list[Fraction]) -> list[Fraction]:
    result = [Fraction(0)] * (2 * len(poly) - 1)
    for left_index, left in enumerate(poly):
        for right_index, right in enumerate(poly):
            result[left_index + right_index] += left * right
    return result


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    root = args.root.resolve()
    checkpoint = root / "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
    observed = {}
    for relative, expected in SOURCES.items():
        digest = sha256(checkpoint / relative)
        if digest != expected:
            raise AssertionError(f"source hash mismatch for {relative}")
        observed[relative] = digest

    checks = ["frozen modular source hashes"]
    polys = physicists_monic_hermite(5)
    for degree in range(1, 5):
        recurrence = add(
            shift(polys[degree]),
            scale(polys[degree - 1], Fraction(-degree, 2)),
        )
        if recurrence != polys[degree + 1]:
            raise AssertionError(f"Hermite recurrence failed at {degree}")
        if derivative(polys[degree + 1]) != scale(polys[degree], degree + 1):
            raise AssertionError(f"Hermite derivative failed at {degree}")
    checks.append("monic Hermite recurrence and derivative")

    p3 = polys[3]
    if p3 != [Fraction(0), Fraction(-3, 2), Fraction(0), Fraction(1)]:
        raise AssertionError("P3 coefficients mismatch")
    x_p3_squared = shift(square(p3))
    j3 = sum(
        coefficient * odd_gaussian_moment(power)
        for power, coefficient in enumerate(x_p3_squared)
        if coefficient
    )
    if j3 != Fraction(9, 8):
        raise AssertionError(f"J3 mismatch: {j3}")
    if 12 * j3 != Fraction(27, 2):
        raise AssertionError("N=3 modular cost coefficient mismatch")
    checks.append("J3=9/8")

    curvature = 20
    if not curvature * 4 < 81:
        raise AssertionError("pi<4 does not prove N=3 failure")
    checks.append("N=3 strict failure from pi<4")

    for degree in (0, 1, 3, 400):
        second = Fraction(2 * degree + 1, 2)
        fourth = Fraction(3 * (2 * degree * degree + 2 * degree + 1), 4)
        second_from_recurrence = Fraction(degree + 1, 2) + Fraction(degree, 2)
        fourth_from_recurrence = (
            Fraction((degree + 1) * (degree + 2), 4)
            + Fraction((2 * degree + 1) ** 2, 4)
            + Fraction(degree * (degree - 1), 4)
        )
        if second_from_recurrence != second or fourth_from_recurrence != fourth:
            raise AssertionError(f"oscillator recurrence mismatch at {degree}")
        if second <= 0 or fourth < second * second:
            raise AssertionError(f"invalid oscillator moments at {degree}")
    checks.append("exact second and fourth oscillator moments")

    n = 400
    c = 20
    left = 8 * n * n * (2 * n + 1) ** 3
    right = 3 * c * (n + 1) ** 2 * (2 * n * n + 2 * n + 1)
    gap = left - right
    if gap != 654725565983940 or gap <= 0:
        raise AssertionError(f"N=400 integer gap mismatch: {gap}")
    second = Fraction(2 * n + 1, 2)
    fourth = Fraction(3 * (2 * n * n + 2 * n + 1), 4)
    cost_lower_squared = Fraction(4 * n * n * c) * second**3 / fourth
    next_ratio_squared = Fraction((n + 1) ** 2 * c * c, 4)
    if cost_lower_squared <= next_ratio_squared:
        raise AssertionError("N=400 squared-cost comparison did not fail")
    checks.append("N=400 exact interpolation failure certificate")

    X = c
    B = 6 * c * c
    D = 60 * c**3
    P = X * D - B * B
    if P != 24 * c**4 or not (X > 17 and P > 8 * X**4):
        raise AssertionError("Gaussian H3 constants mismatch")
    checks.append("Gaussian satisfies X>17 and P>8X^4")

    payload = {
        "schema_version": "zsv.modular_gaussian_strong_payment_barrier.20261103.v1",
        "status": "PASS",
        "scope": (
            "Exact auxiliary Gaussian barrier to source-free modular strong payment; "
            "not the theta profile, full conservation law, an all-degree theta result, "
            "or an RH claim"
        ),
        "checks": checks,
        "source_sha256": observed,
        "model": {
            "profile": "psi_c(h)=exp(-c*h^2/2)",
            "c": c,
            "pivot": "sigma_n=sqrt(pi)*n!*c^(n-3/2)/2^n",
            "next_pivot_ratio": "(n+1)*c/2",
            "kappa_endpoint": "4*n",
            "halfline_mass": "Q_n0=c^(n-1)*J_n",
            "normalized_cost": "2*n*sqrt(c)*E_n|X|",
        },
        "exact_n3": {
            "J3": "9/8",
            "cost": "27*c^2/2",
            "sigma4": "3*sqrt(pi)*c^(5/2)/2",
            "payment_condition": "sqrt(pi*c)>=9",
            "failure_proof_at_c20": "20*pi<80<81 using pi<4",
        },
        "exact_n400": {"left": left, "right": right, "gap": gap},
        "asymptotic": {
            "cost_lower": "2*sqrt(2*c/3)*n^(3/2)*(1+o(1))",
            "next_pivot_ratio": "(c/2)*n+O(1)",
        },
        "conclusion": (
            "Generic curvature and positive-prefix hypotheses do not imply the "
            "modular strong payment. The strict endpoint failure persists for "
            "sufficiently small positive tilt at each fixed counterexample degree."
        ),
    }

    output = args.output
    if not output.is_absolute():
        output = root / output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
