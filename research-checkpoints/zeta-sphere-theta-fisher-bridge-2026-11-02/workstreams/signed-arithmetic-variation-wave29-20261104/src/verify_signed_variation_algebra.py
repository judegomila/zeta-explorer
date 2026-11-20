#!/usr/bin/env python3
"""Exact standard-library audit of the wave-29 arithmetic identities."""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
import math
import os
from pathlib import Path
import sys


SOURCE = Path(__file__).resolve()
WORKSTREAM = SOURCE.parents[1]


def jordan_two(n: int) -> int:
    return sum(mobius(d) * (n // d) ** 2 for d in divisors(n))


def divisors(n: int) -> list[int]:
    return [d for d in range(1, n + 1) if n % d == 0]


def mobius(n: int) -> int:
    prime_count = 0
    remainder = n
    prime = 2
    while prime * prime <= remainder:
        if remainder % prime == 0:
            remainder //= prime
            if remainder % prime == 0:
                return 0
            prime_count += 1
            while remainder % prime == 0:
                remainder //= prime
        prime += 1
    if remainder > 1:
        prime_count += 1
    return -1 if prime_count % 2 else 1


def f_sum(y: Fraction) -> Fraction:
    return sum(
        (Fraction(k) * (y - k) for k in range(1, math.floor(y) + 1)),
        Fraction(0),
    )


def f_closed(y: Fraction) -> Fraction:
    integer = math.floor(y)
    remainder = y - integer
    return (
        y**3
        - y * (1 - 3 * remainder + 3 * remainder**2)
        + (2 * remainder**3 - 3 * remainder**2 + remainder)
    ) / 6


def arithmetic_weight(x: Fraction) -> Fraction:
    s_zero = sum((jordan_two(m) for m in range(1, math.floor(x) + 1)), 0)
    s_one = sum(
        (Fraction(jordan_two(m), m) for m in range(1, math.floor(x) + 1)),
        Fraction(0),
    )
    return (x * s_one - s_zero) / x**3


def integrate_u_power_times_shifted_power(
    a: int, shifted_power: int, u_power: int
) -> Fraction:
    return sum(
        (
            Fraction(math.comb(shifted_power, index) * a ** (shifted_power - index), index + u_power + 1)
            for index in range(shifted_power + 1)
        ),
        Fraction(0),
    )


def atomic_write(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)
        handle.write("\n")
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        type=Path,
        default=WORKSTREAM / "results/signed_variation_analytic_audit.json",
    )
    args = parser.parse_args()

    tested_y = 0
    for integer in range(0, 21):
        for numerator in range(0, 7):
            y = Fraction(integer) + Fraction(numerator, 7)
            if f_sum(y) != f_closed(y):
                raise ArithmeticError(f"F identity failed at {y}")
            tested_y += 1

    for n in range(1, 101):
        product = Fraction(n * n)
        for prime in range(2, n + 1):
            if n % prime == 0 and all(prime % d for d in range(2, int(math.sqrt(prime)) + 1)):
                product *= Fraction(prime * prime - 1, prime * prime)
        if jordan_two(n) != product:
            raise ArithmeticError(f"J_2 divisor identity failed at {n}")

    h_four = arithmetic_weight(Fraction(4))
    h_five = arithmetic_weight(Fraction(5))
    if h_four != Fraction(13, 96) or h_five != Fraction(101, 750):
        raise ArithmeticError("recorded arithmetic weights are incorrect")
    derivative_left = (3 - 2 * Fraction(5, 4)) / Fraction(5, 4) ** 4
    derivative_right = (3 - 2 * Fraction(7, 4)) / Fraction(7, 4) ** 4
    if not derivative_left > 0 > derivative_right:
        raise ArithmeticError("first-cell derivative sign change failed")

    jump_coefficient = Fraction(-4, 3) + Fraction(6, 5)
    if jump_coefficient != Fraction(-2, 15):
        raise ArithmeticError("Stieltjes jump coefficient failed")
    derivative_s_one = Fraction(-4, 3) * Fraction(-3, 2)
    derivative_s_zero = Fraction(6, 5) * Fraction(-5, 2)
    if (derivative_s_one, derivative_s_zero) != (2, -3):
        raise ArithmeticError("between-cell P derivative coefficients failed")

    peano_cases = 0
    for a in range(0, 6):
        for power in range(0, 9):
            integral = Fraction((a + 1) ** (power + 1) - a ** (power + 1), power + 1)
            left_cell = Fraction((a + 1) ** power) - integral
            left_peano = (
                power * integrate_u_power_times_shifted_power(a, power - 1, 1)
                if power
                else Fraction(0)
            )
            trap_cell = Fraction(a**power + (a + 1) ** power, 2) - integral
            trap_peano = (
                Fraction(power * (power - 1), 2)
                * (
                    integrate_u_power_times_shifted_power(a, power - 2, 1)
                    - integrate_u_power_times_shifted_power(a, power - 2, 2)
                )
                if power >= 2
                else Fraction(0)
            )
            if left_cell != left_peano or trap_cell != trap_peano:
                raise ArithmeticError(f"Peano identity failed at a={a}, p={power}")
            peano_cases += 1

    decombination_cases = 0
    for m in range(1, 21):
        combined = {
            "Fm_h2_Tm": 1,
            "Fm_h_Tm_prime": 1,
            "Fn_h2_Tm": -1,
            "Fn_h_Tn": -m,
        }
        threshold = {"Fn_h2_Tm": -1, "Fn_h_Tn": -m}
        direct = {
            key: combined.get(key, 0) - threshold.get(key, 0)
            for key in set(combined) | set(threshold)
        }
        direct = {key: value for key, value in direct.items() if value}
        if direct != {"Fm_h2_Tm": 1, "Fm_h_Tm_prime": 1}:
            raise ArithmeticError(f"source decombination failed at m={m}")
        if Fraction(1) - m != -(m - 1):
            raise ArithmeticError(f"threshold CD coefficient failed at m={m}")
        decombination_cases += 1

    g_coefficients = (1, -4, 3)
    g_rates = (1, 2, 3)
    h_coefficients = (1, -3, 2)
    h_rates = (2, 3, 4)
    if sum(g_coefficients) or sum(Fraction(c, r) for c, r in zip(g_coefficients, g_rates)):
        raise ArithmeticError("analytic g endpoint/mean cancellation failed")
    if sum(h_coefficients) or sum(Fraction(c, r) for c, r in zip(h_coefficients, h_rates)):
        raise ArithmeticError("analytic h endpoint/mean cancellation failed")

    receipt: dict[str, object] = {
        "schema_version": "zsv.signed_variation_analytic_audit.v1",
        "status": "PASS",
        "grade": "exact_standard_library_algebra_audit",
        "checks": {
            "F_closed_form_rational_samples": tested_y,
            "jordan_divisor_identity_integers": 100,
            "H_4": str(h_four),
            "H_5": str(h_five),
            "first_cell_derivative_has_both_signs": True,
            "stieltjes_jump_coefficient": str(jump_coefficient),
            "P_derivative_coefficients": [
                str(derivative_s_one),
                str(derivative_s_zero),
            ],
            "peano_cell_polynomial_cases": peano_cases,
            "combined_source_decombination_cases": decombination_cases,
            "analytic_countermodel_endpoint_mean_cancellations": True,
        },
        "provenance": {
            "source": str(SOURCE.relative_to(WORKSTREAM)),
            "source_sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
            "network_used": False,
        },
        "nonclaims": [
            "Finite rational samples audit exact algebra but do not replace the analytic proof.",
            "This receipt proves no all-degree theta inequality, next pivot, or RH claim.",
        ],
    }
    canonical = json.dumps(
        receipt, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode()
    receipt["receipt_integrity"] = {
        "definition": "sha256 of compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": hashlib.sha256(canonical).hexdigest(),
    }
    atomic_write(args.output.resolve(), receipt)
    print(
        json.dumps(
            {
                "status": "PASS",
                "output": str(args.output.resolve()),
                "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
