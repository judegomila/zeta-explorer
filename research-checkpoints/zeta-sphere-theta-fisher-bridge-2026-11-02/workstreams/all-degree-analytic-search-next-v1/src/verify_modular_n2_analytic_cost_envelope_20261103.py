#!/usr/bin/env python3
"""Exact-rational audit of the conditional N=2 analytic cost envelope."""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
from math import isqrt
import json
from pathlib import Path
import re


CHECKPOINT = "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
WORKSTREAM = "workstreams/all-degree-analytic-search-next-v1"
PRIOR = f"{WORKSTREAM}/results/prior_derivative_score_20261103.json"
CENTER = f"{WORKSTREAM}/results/modular_vprime_tilt_replay.json"
SHARP_NOTE = f"{WORKSTREAM}/MODULAR_N2_SHARP_CUBIC_TRANSPORT_20261103.md"
SHARP_RESULT = f"{WORKSTREAM}/results/modular_n2_sharp_cubic_transport_20261103.json"
ENDPOINT_NOTE = f"{WORKSTREAM}/MODULAR_N2_ENDPOINT_PAYMENT_INDEPENDENT_AUDIT_20261103.md"
ENDPOINT_RESULT = f"{WORKSTREAM}/results/modular_n2_endpoint_payment_independent_audit_20261103.json"

EXPECTED = {
    PRIOR: "77cb034a3c488d77a3ec52ae9429a3f14b92ba8a796a15745b4c80248c92ddfe",
    CENTER: "ba2fa918da86840db31e72decb72f49647d331c956bd180154e301403ec95855",
    SHARP_NOTE: "cde23c97b17f3029621299b4ff0d99ff462b0c89ad6632ceade073922e172318",
    SHARP_RESULT: "5b5118668f17f3067c63fbb357e7e0dcb088b8af6f9b37447e73a3b8237a8333",
    ENDPOINT_NOTE: "45dae1c894767eebd900774e321cbdae5a9059916399fcd342edaf8a3f050970",
    ENDPOINT_RESULT: "7dafd0dc39c7f32d29c6bdcecaf81c9cbefced6a916e1162840cf4d5d2f09873",
}

Interval = tuple[Fraction, Fraction]
BALL = re.compile(r"^\[([^ ]+) \+/- ([^\]]+)\]$")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def ball(text: str) -> Interval:
    match = BALL.fullmatch(text)
    if match is None:
        raise AssertionError(f"unrecognized Arb ball: {text!r}")
    midpoint = Fraction(match.group(1))
    radius = Fraction(match.group(2))
    return midpoint - radius, midpoint + radius


def add(*values: Interval) -> Interval:
    return sum((value[0] for value in values), Fraction()), sum(
        (value[1] for value in values), Fraction()
    )


def sub(left: Interval, right: Interval) -> Interval:
    return left[0] - right[1], left[1] - right[0]


def scale(value: Interval, coefficient: Fraction | int) -> Interval:
    coefficient = Fraction(coefficient)
    if coefficient >= 0:
        return coefficient * value[0], coefficient * value[1]
    return coefficient * value[1], coefficient * value[0]


def mul(left: Interval, right: Interval) -> Interval:
    products = [x * y for x in left for y in right]
    return min(products), max(products)


def reciprocal(value: Interval) -> Interval:
    if value[0] <= 0:
        raise AssertionError("interval denominator is not positive")
    return 1 / value[1], 1 / value[0]


def div(left: Interval, right: Interval) -> Interval:
    return mul(left, reciprocal(right))


def square(value: Interval) -> Interval:
    if value[0] <= 0 <= value[1]:
        return Fraction(), max(value[0] ** 2, value[1] ** 2)
    return min(value[0] ** 2, value[1] ** 2), max(value[0] ** 2, value[1] ** 2)


def ceil_sqrt(value: Fraction, places: int = 30) -> Fraction:
    scale_factor = 10**places
    quotient = value.numerator * scale_factor**2 // value.denominator
    root = isqrt(quotient)
    result = Fraction(root, scale_factor)
    if result * result < value:
        result += Fraction(1, scale_factor)
    if result * result < value:
        raise AssertionError("directed square-root ceiling failed")
    return result


def point(value: Fraction | int) -> Interval:
    value = Fraction(value)
    return value, value


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()
    nested = root / CHECKPOINT
    if nested.is_dir():
        checkpoint = nested
    elif (root / "evidence").is_dir() and (root / "workstreams").is_dir():
        checkpoint = root
    else:
        raise AssertionError("--root is neither repository nor checkpoint root")

    observed: dict[str, str] = {}
    for relative, expected in EXPECTED.items():
        actual = sha256(checkpoint / relative)
        if actual != expected:
            raise AssertionError(f"frozen input hash mismatch: {relative}: {actual}")
        observed[relative] = actual

    prior = json.loads((checkpoint / PRIOR).read_text())
    center = json.loads((checkpoint / CENTER).read_text())
    sharp = json.loads((checkpoint / SHARP_RESULT).read_text())
    endpoint = json.loads((checkpoint / ENDPOINT_RESULT).read_text())
    if any(record.get("status") != "PASS" for record in (prior, sharp, endpoint)):
        raise AssertionError("a frozen audit input is not PASS")

    moments = []
    for row in prior["target_moments"][:3]:
        enclosure = row["corrected_M_interval"]
        low = ball(enclosure["lower"])[0]
        high = ball(enclosure["upper"])[1]
        moments.append((low, high))
    positive = [
        ball(row["complete_halfline_norm_square"]["arb"])
        for row in prior["complete_positive_moments"][:3]
    ]
    M0, M1, M2 = moments
    n0, n1, n2 = positive
    psi0_square = ball(center["psi_zero_squared"])

    sigma2 = scale(sub(M2, div(square(M1), M0)), 2)
    b10 = div(M1, M0)
    H0 = scale(M0, Fraction(1, 2))
    H1 = scale(add(M1, n0), Fraction(1, 2))
    B0 = add(scale(sigma2, Fraction(1, 4)), n1, mul(b10, n0))
    H2 = sub(sub(B0, scale(mul(b10, sub(n0, H1)), 2)), mul(square(b10), H0))
    if min(sigma2[0], H0[0], H1[0], H2[0], sub(n0, H1)[0]) <= 0:
        raise AssertionError("required endpoint moment positivity failed")

    J0_upper = ceil_sqrt(mul(n0, H0)[1])
    J1_upper = ceil_sqrt(mul(n1, H1)[1])
    a = Fraction(1, 4)
    a2 = a * a

    def A_at(b: Fraction) -> Interval:
        C = a2 + b
        return add(
            n2,
            scale(n1, 2 * a2 - 2 * b),
            scale(n0, C * C),
            scale(psi0_square, 2 * a * C),
        )

    A_left = A_at(Fraction(17, 2))
    A_right = A_at(Fraction(14))
    A_upper = max(A_left[1], A_right[1])

    b = Fraction(14)
    C = a2 + b
    B = add(
        H2,
        scale(H1, 4 * a2),
        scale(H0, C * C),
        point(4 * a * J1_upper),
        scale(sub(n0, H1), 2 * C),
        point(4 * a * C * J0_upper),
    )
    B_upper = B[1]
    if not A_upper < 159:
        raise AssertionError(f"A envelope did not close: {A_upper}")
    if not B_upper < 24:
        raise AssertionError(f"B envelope did not close: {B_upper}")
    AB_upper = A_upper * B_upper
    if not AB_upper < 3816:
        raise AssertionError("A*B envelope is not below 3816")
    if not 3816 < 62**2:
        raise AssertionError("sqrt(3816)<62 comparison failed")

    x_left = Fraction(209, 192)
    x_right = Fraction(60, 17)
    y = Fraction(1, 34)

    def K(x: Fraction) -> Fraction:
        return 4 + x + 4 / x + 2 * y + (y * y + 5 * y) / x

    K_left = K(x_left)
    K_right = K(x_right)
    if K_left != Fraction(103884673, 11596992):
        raise AssertionError("left reflection endpoint changed")
    if K_right != Fraction(7151, 816):
        raise AssertionError("right reflection endpoint changed")
    if not max(K_left, K_right) < 9:
        raise AssertionError("reflection rectangle did not close below 9")

    reserve = Fraction(14487, 25)
    cost = 9 * 62
    margin = reserve - cost
    if cost != 558 or margin != Fraction(537, 25) or not margin > 0:
        raise AssertionError("final conditional payment comparison failed")

    source = Path(__file__).resolve()
    note = source.parents[1] / "MODULAR_N2_ANALYTIC_COST_ENVELOPE_20261103.md"
    result = {
        "schema_version": "zsv.modular_n2_analytic_cost_envelope.20261103.v1",
        "status": "PASS",
        "scope": (
            "Conditional complete-theta N=2 finite-a payment envelope assuming "
            "b1<=12 and b2<=30; those two prefix bounds, higher degrees, "
            "all-degree positivity, and RH are not proved"
        ),
        "conditional_inputs": ["b1(a)<=12", "b2(a)<=30", "0<a<=1/4"],
        "proved_bounds": {
            "A": "<159",
            "B": "<24",
            "Q2_minus": "<sqrt(3816)<62",
            "kappa2_over_a": "<9",
            "cost_over_a": "<558",
            "s3_over_a": ">14487/25",
            "payment_margin": ">537/25",
        },
        "checks": [
            "frozen directed endpoint moments and center value",
            "exact half-line integration-by-parts envelope",
            "A convex endpoint maximum",
            "B monotone endpoint maximum",
            "Cauchy Q2-minus envelope",
            "exact reflection x-y rectangle",
            "conditional cost 558 below sharp reserve 14487/25",
        ],
        "exact_directed_values": {
            "A_upper": str(A_upper),
            "B_upper": str(B_upper),
            "AB_upper": str(AB_upper),
            "J0_upper": str(J0_upper),
            "J1_upper": str(J1_upper),
            "K_left": str(K_left),
            "K_right": str(K_right),
        },
        "frozen_inputs": observed,
        "proof_note": {
            "path": str(note.relative_to(checkpoint)),
            "sha256": sha256(note),
            "binding": "recorded, not self-frozen by this replay",
        },
        "source_sha256": sha256(source),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
