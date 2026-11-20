#!/usr/bin/env python3
"""Exact audit of the Gaussian full-conservation payment barrier."""

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
    "evidence/v20-v26-continuation/modular_cd_flux_v1/NORMALIZED_LIMIT.md":
        "d0f4b2c61364270c71515caaa421a10a29683ddaedbc779ecd36db485cac08af",
    "evidence/v20-v26-continuation/modular_innovation_payment_v1/BOUNDARY_ELIMINATION.md":
        "f0cf0ab2e7d596fe13ce50729e2b361d67c3bb1821be81befa8c9eb3f1ec00db",
}


def add(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    size = max(len(left), len(right))
    return [
        (left[index] if index < len(left) else Fraction(0))
        + (right[index] if index < len(right) else Fraction(0))
        for index in range(size)
    ]


def scale(poly: list[Fraction], factor: int | Fraction) -> list[Fraction]:
    return [Fraction(factor) * coefficient for coefficient in poly]


def shift(poly: list[Fraction]) -> list[Fraction]:
    return [Fraction(0), *poly]


def square(poly: list[Fraction]) -> list[Fraction]:
    result = [Fraction(0)] * (2 * len(poly) - 1)
    for left_index, left in enumerate(poly):
        for right_index, right in enumerate(poly):
            result[left_index + right_index] += left * right
    return result


def derivative(poly: list[Fraction]) -> list[Fraction]:
    return [index * poly[index] for index in range(1, len(poly))]


def monic_hermite(max_degree: int) -> list[list[Fraction]]:
    polys = [[Fraction(1)], [Fraction(0), Fraction(1)]]
    for degree in range(1, max_degree):
        polys.append(
            add(shift(polys[-1]), scale(polys[-2], Fraction(-degree, 2)))
        )
    return polys[: max_degree + 1]


def odd_gaussian_moment(power: int) -> Fraction:
    if power < 1 or power % 2 != 1:
        raise ValueError("power must be positive and odd")
    return Fraction(math.factorial((power - 1) // 2), 2)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    root = args.root.resolve()
    checkpoint = (
        root / "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
    )
    observed = {}
    for relative, expected in SOURCES.items():
        actual = sha256(checkpoint / relative)
        if actual != expected:
            raise AssertionError(
                f"source hash mismatch for {relative}: {actual} != {expected}"
            )
        observed[relative] = actual

    checks = ["frozen complete-commutator source hashes"]
    max_degree = 15
    polys = monic_hermite(max_degree)
    for degree in range(1, max_degree):
        recurrence = add(
            shift(polys[degree]),
            scale(polys[degree - 1], Fraction(-degree, 2)),
        )
        if recurrence != polys[degree + 1]:
            raise AssertionError(f"Hermite recurrence failed at {degree}")
        if derivative(polys[degree + 1]) != scale(polys[degree], degree + 1):
            raise AssertionError(f"Hermite derivative failed at {degree}")
    checks.append("monic Hermite recurrence and Appell derivative")

    # e_n=sqrt(pi) E_n|X|=2^(n+1) J_n/n! is rational.
    expectation_coefficients: list[Fraction] = []
    for degree, poly in enumerate(polys):
        x_square = shift(square(poly))
        halfline = sum(
            coefficient * odd_gaussian_moment(power)
            for power, coefficient in enumerate(x_square)
            if coefficient
        )
        e_n = Fraction(2 ** (degree + 1), math.factorial(degree)) * halfline
        expectation_coefficients.append(e_n)

    if expectation_coefficients[0] != 1:
        raise AssertionError("e_0 mismatch")
    for degree in range(max_degree):
        if not expectation_coefficients[degree + 1] > expectation_coefficients[degree]:
            raise AssertionError(f"absolute Hermite moment is not increasing at {degree}")
    if expectation_coefficients[15] != Fraction(6435, 1024):
        raise AssertionError("e_15 mismatch")
    checks.append("exact increasing Hermite absolute moments through degree 15")

    N = 15
    A = sum(expectation_coefficients) - (N + 1) * expectation_coefficients[N]
    if A != Fraction(-66495, 2048):
        raise AssertionError(f"A_15 mismatch: {A}")
    checks.append("A_15=-66495/2048, so the complete commutator is negative")

    # W_15=160+2*sqrt(20/pi)*A.  Its negativity follows from
    # A^2 > 320*pi and pi<22/7.
    rational_gap = A * A - Fraction(7040, 7)
    expected_gap = Fraction(1423195015, 29360128)
    if rational_gap != expected_gap or rational_gap <= 0:
        raise AssertionError(f"net-conservation rational gap mismatch: {rational_gap}")
    checks.append("W_15<0 from A_15^2>320*pi using pi<22/7")

    c = 20
    X = c
    B = 6 * c * c
    D = 60 * c**3
    P = X * D - B * B
    if P != 24 * c**4 or not (X > 17 and P > 8 * X**4):
        raise AssertionError("Gaussian curvature constants mismatch")
    checks.append("Gaussian satisfies X>17 and P>8*X^4")

    payload = {
        "schema_version": (
            "zsv.modular_full_conservation_gaussian_barrier.20261103.v1"
        ),
        "status": "PASS",
        "scope": (
            "Exact auxiliary Gaussian barrier to a generic net full-conservation "
            "payment; not the theta profile, a theta pivot theorem, an all-degree "
            "theta result, or an RH claim"
        ),
        "checks": checks,
        "source_sha256": observed,
        "endpoint_identity": {
            "complete_commutator": "4*(tr(H0)-d^T*H0*e_N)",
            "square_form": "P_N0-kappa_N0*H0_NN",
            "net_target": "sigma_(N+1)/sigma_N+C_N0",
        },
        "gaussian_model": {
            "profile": "psi_c(h)=exp(-c*h^2/2)",
            "c": c,
            "pivot": "sigma_n=sqrt(pi)*n!*c^(n-3/2)/2^n",
            "d": "(n+1)*e_n",
            "H0_jj": "sqrt(c)*E_j|X|/2",
            "commutator": (
                "2*sqrt(c/pi)*(sum_(j=0)^N e_j-(N+1)*e_N)"
            ),
        },
        "exact_n15": {
            "e15": "6435/1024",
            "A15": "-66495/2048",
            "next_pivot_ratio_at_c20": "160",
            "net_target": "160-(66495/1024)*sqrt(20/pi)",
            "pi_upper": "22/7",
            "squared_rational_gap": "1423195015/29360128",
        },
        "conclusion": (
            "Even after retaining the complete commutator positive square, "
            "positive-prefix and generic curvature hypotheses do not imply the "
            "net modular conservation payment. Theta-specific correlation is still "
            "required."
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
