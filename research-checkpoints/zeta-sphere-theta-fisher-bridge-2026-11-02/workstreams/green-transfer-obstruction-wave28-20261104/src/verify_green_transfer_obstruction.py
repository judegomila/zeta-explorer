#!/usr/bin/env python3
"""Exact standard-library checks for the Green localization obstruction."""

from __future__ import annotations

from fractions import Fraction as Q
import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "results" / "green_transfer_obstruction.json"


def add(p: list[Q], q: list[Q]) -> list[Q]:
    size = max(len(p), len(q))
    out = [Q(0) for _ in range(size)]
    for i, value in enumerate(p):
        out[i] += value
    for i, value in enumerate(q):
        out[i] += value
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return out


def scale(p: list[Q], factor: Q) -> list[Q]:
    return [factor * value for value in p]


def mul_z(p: list[Q]) -> list[Q]:
    return [Q(0), *p]


def derivative(p: list[Q]) -> list[Q]:
    if len(p) == 1:
        return [Q(0)]
    return [Q(i) * p[i] for i in range(1, len(p))]


def evaluate(p: list[Q], x: Q) -> Q:
    total = Q(0)
    for coefficient in reversed(p):
        total = total * x + coefficient
    return total


def qstr(value: Q) -> str:
    return str(value.numerator) if value.denominator == 1 else f"{value.numerator}/{value.denominator}"


def main() -> None:
    # The unique positive root beta of p(x) is bracketed without floating point.
    p_beta = [Q(-27), Q(32), Q(63)]
    lower = Q(8, 21)
    upper = Q(27, 56)
    assert evaluate(p_beta, lower) < 0
    assert evaluate(p_beta, upper) > 0
    assert 2 * Q(63) * lower + Q(32) > 0

    # Positive symmetric Jacobi prefix.
    b1, b2, b3 = Q(1), Q(5, 4), Q(11, 4)
    t0 = [Q(1)]
    t1 = [Q(0), Q(1)]
    t2 = add(mul_z(t1), scale(t0, -b1))
    t3 = add(mul_z(t2), scale(t1, -b2))
    t4 = add(mul_z(t3), scale(t2, -b3))
    assert t3 == [Q(0), Q(-9, 4), Q(0), Q(1)]
    assert t4 == [Q(11, 4), Q(0), Q(-5), Q(0), Q(1)]
    q3 = add(derivative(t4), scale(t3, Q(-4)))
    assert q3 == [Q(0), Q(-1)]

    # Local identity mode factors, with the common pi and beta factors removed.
    psi_mode_1 = Q(4, 35)
    psi_mode_2 = Q(4, 21)
    l2_1 = (Q(1) + Q(5, 2)) * (Q(1) + Q(3, 2))
    l2_2 = (Q(2) + Q(5, 2)) * (Q(2) + Q(3, 2))
    assert psi_mode_1 * l2_1 == 2 * (Q(1) - Q(1, 2))
    assert psi_mode_2 * l2_2 == 2 * (Q(2) - Q(1, 2))

    # F=T3(D)psi and g=-DB, again recording coefficients without common pi.
    f1 = evaluate(t3, Q(-1)) * psi_mode_1
    f2_per_beta = evaluate(t3, Q(-2)) * psi_mode_2
    g1 = Q(1)
    g2_per_beta = Q(2)
    assert f1 == Q(1, 7)
    assert f2_per_beta == Q(-2, 3)
    assert (g1, g2_per_beta) == (Q(1), Q(2))

    # K(t)/pi = A0 exp(-t) + A2 exp(-2t), with beta symbolic.
    # A0 = 1/28 - 2 beta/27.
    # A2 = 2 beta(1/63-beta/24).
    # Their sum is -(63 beta^2+32 beta-27)/756, hence exactly zero.
    constant_sum = Q(1, 28)
    beta_sum = Q(-2, 27) + Q(2, 63)
    beta2_sum = Q(-1, 12)
    assert constant_sum == Q(27, 756)
    assert beta_sum == Q(-32, 756)
    assert beta2_sum == Q(-63, 756)
    assert upper == Q(27, 56)  # A0>0 exactly when beta<27/56.

    # Exact Laplace factors for one exponential mode.
    def laplace_angle_factor(rate: Q) -> Q:
        return Q(3) / (rate + Q(5, 2)) - Q(2) / (rate + Q(3, 2))

    slow = laplace_angle_factor(Q(1))
    fast = laplace_angle_factor(Q(2))
    assert slow == Q(2, 35)
    assert fast == Q(2, 21)
    angle_per_amplitude = slow - fast
    assert angle_per_amplitude == Q(-4, 105)

    c_three_halves = Q(1) / ((Q(3, 2) + 1) * (Q(3, 2) + 2))
    c_five_halves = Q(1) / ((Q(5, 2) + 1) * (Q(5, 2) + 2))
    ratio = c_three_halves / c_five_halves
    assert c_three_halves == Q(4, 35)
    assert c_five_halves == Q(4, 63)
    assert ratio == Q(9, 5) > Q(3, 2)

    source_hash = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    payload = {
        "status": "PASS",
        "evidence_grade": "exact_standard_library_countermodel",
        "beta": {
            "minimal_polynomial": "63*x^2+32*x-27",
            "exact": "(sqrt(1957)-16)/63",
            "lower": qstr(lower),
            "upper": qstr(upper),
        },
        "jacobi_coefficients": [qstr(b1), qstr(b2), qstr(b3)],
        "t3_coefficients_ascending": [qstr(x) for x in t3],
        "t4_coefficients_ascending": [qstr(x) for x in t4],
        "q3_coefficients_ascending": [qstr(x) for x in q3],
        "correlation": "K(t)=A*(exp(-t)-exp(-2*t)), A>0",
        "angle_per_amplitude": qstr(angle_per_amplitude),
        "localization_ratio": qstr(ratio),
        "localization_threshold": "3/2",
        "scope": (
            "Local Green/source identity and positive abstract Jacobi prefix only; "
            "not the actual arithmetic U, weighted operator estimate, or actual-theta selection."
        ),
        "source_sha256": source_hash,
    }
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    envelope = {
        "payload": payload,
        "payload_sha256": hashlib.sha256(canonical).hexdigest(),
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(envelope, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"status": "PASS", "output": str(OUTPUT), "payload_sha256": envelope["payload_sha256"]}, sort_keys=True))


if __name__ == "__main__":
    main()
