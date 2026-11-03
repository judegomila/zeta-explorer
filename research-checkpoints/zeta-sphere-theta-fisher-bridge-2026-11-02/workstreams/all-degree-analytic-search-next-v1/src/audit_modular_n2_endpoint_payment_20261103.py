#!/usr/bin/env python3
"""Independent exact-rational audit of the complete-theta N=2 endpoint payment.

The frozen Arb receipt already contains outward enclosures for the signed
moments M_0,... and the positive half-line derivative norms n_0,... .  This
checker consumes only those serialized enclosures.  It performs dependency-
safe interval arithmetic with fractions and proves the endpoint inequality

    sigma_3 > kappa_0 * Q_{2,0}^-.

This is a fixed a=0, degree-three certificate.  It is not a prefix-only
all-degree induction argument and makes no RH claim.
"""

from __future__ import annotations

import argparse
from copy import deepcopy
from fractions import Fraction
import hashlib
import json
from math import isqrt
from pathlib import Path
import re


WORKSTREAM = "workstreams/all-degree-analytic-search-next-v1"
PRIOR_RESULT = f"{WORKSTREAM}/results/prior_derivative_score_20261103.json"
PRIOR_SOURCE = f"{WORKSTREAM}/src/verify_prior_derivative_score_20261103.py"
SIGNED_RESULT = f"{WORKSTREAM}/results/u3_kappa15_signed_moments_20261103.json"
SIGNED_SOURCE = f"{WORKSTREAM}/src/certify_u3_kappa15_signed_moments_20261103.py"
POSITIVE_ENGINE = f"{WORKSTREAM}/src/audit_reverse_schur_actual_failure.py"
SQUARE_NOTE = "evidence/v31-continuation/theta_correlated_local_v1/INTEGRATED_SQUARE_PAYMENT.md"
PIVOT_NOTE = f"{WORKSTREAM}/MODULAR_GENERAL_PIVOT_TRANSPORT_NEXT.md"
PAYMENT_NOTE = f"{WORKSTREAM}/MODULAR_N2_CUBIC_RESERVE_PAYMENT_MAP_20261103.md"

EXPECTED_HASHES = {
    PRIOR_RESULT: "77cb034a3c488d77a3ec52ae9429a3f14b92ba8a796a15745b4c80248c92ddfe",
    PRIOR_SOURCE: "45467394a474ae3e53cda98d91eb6c4ebde62afe84d76264ed1cef1c72683aeb",
    SIGNED_RESULT: "94d3741b7eabecf2f0f0ccc33a2786f8a4eaae752a98e1076fe08389828b1eff",
    SIGNED_SOURCE: "dc5828f6ce61a461d5a881c08d0e4034dab473f85dabd20be488dd4b5f6ff178",
    POSITIVE_ENGINE: "5d86938507fe5bc78994cfd5658a0de745835f614534f98161083c2651a62536",
    SQUARE_NOTE: "dca1c63d81b7c6796d2526a6933afd37f2b0c7dc03a2e66687e5de529139485a",
    PIVOT_NOTE: "5076a00c5e5b2b20fddd7470d92f61f907a2e954c23dc0bb66278271e0d96970",
    PAYMENT_NOTE: "afb6431055e8167fdb9ef30e61e01195cfd557cfec91d2114d062f27daee9c93",
}
EXPECTED_PRIOR_PAYLOAD = "be6376819d0a5759b3e4474d7c3159e925b6d488743b06fd294ce2f02bf85f34"
EXPECTED_SIGNED_PAYLOAD = "924c7d10d504af4e09e1754b757bf187499d09dd1b53e743865b552e87686f25"

Interval = tuple[Fraction, Fraction]
BALL_RE = re.compile(r"^\[([^ ]+) \+/- ([^\]]+)\]$")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def payload_sha256(record: dict) -> str:
    payload = deepcopy(record)
    payload.pop("receipt_integrity", None)
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(encoded).hexdigest()


def ball(text: str) -> Interval:
    match = BALL_RE.fullmatch(text)
    if match is None:
        raise AssertionError(f"unrecognized Arb ball: {text!r}")
    midpoint = Fraction(match.group(1))
    radius = Fraction(match.group(2))
    if radius < 0:
        raise AssertionError("negative radius")
    return midpoint - radius, midpoint + radius


def add(left: Interval, right: Interval) -> Interval:
    return left[0] + right[0], left[1] + right[1]


def sub(left: Interval, right: Interval) -> Interval:
    return left[0] - right[1], left[1] - right[0]


def scale(value: Interval, coefficient: Fraction | int) -> Interval:
    coefficient = Fraction(coefficient)
    if coefficient >= 0:
        return coefficient * value[0], coefficient * value[1]
    return coefficient * value[1], coefficient * value[0]


def mul(left: Interval, right: Interval) -> Interval:
    products = [a * b for a in left for b in right]
    return min(products), max(products)


def reciprocal(value: Interval) -> Interval:
    if value[0] <= 0:
        raise AssertionError("division interval is not strictly positive")
    return Fraction(1, 1) / value[1], Fraction(1, 1) / value[0]


def div(left: Interval, right: Interval) -> Interval:
    return mul(left, reciprocal(right))


def square(value: Interval) -> Interval:
    if value[0] <= 0 <= value[1]:
        return Fraction(0), max(value[0] * value[0], value[1] * value[1])
    products = (value[0] * value[0], value[1] * value[1])
    return min(products), max(products)


def rational_text(value: Fraction) -> str:
    return f"{value.numerator}/{value.denominator}"


def ceil_sqrt(value: Fraction, decimal_places: int = 15) -> Fraction:
    if value < 0:
        raise AssertionError("negative square-root input")
    scale_factor = 10**decimal_places
    quotient = value.numerator * scale_factor * scale_factor // value.denominator
    root = isqrt(quotient)
    candidate = Fraction(root, scale_factor)
    if candidate * candidate < value:
        candidate += Fraction(1, scale_factor)
    if candidate * candidate < value:
        raise AssertionError("square-root ceiling failed")
    return candidate


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()

    observed_hashes: dict[str, str] = {}
    for relative, expected in EXPECTED_HASHES.items():
        observed = sha256(root / relative)
        if observed != expected:
            raise AssertionError(f"frozen input hash mismatch: {relative}: {observed}")
        observed_hashes[relative] = observed

    prior = json.loads((root / PRIOR_RESULT).read_text())
    signed = json.loads((root / SIGNED_RESULT).read_text())
    if prior.get("status") != "PASS" or signed.get("status") != "PASS":
        raise AssertionError("an input receipt is not PASS")
    if payload_sha256(prior) != EXPECTED_PRIOR_PAYLOAD:
        raise AssertionError("prior receipt canonical payload mismatch")
    if payload_sha256(signed) != EXPECTED_SIGNED_PAYLOAD:
        raise AssertionError("signed receipt canonical payload mismatch")
    if prior["receipt_integrity"]["payload_sha256"] != EXPECTED_PRIOR_PAYLOAD:
        raise AssertionError("prior embedded payload hash mismatch")
    if signed["receipt_integrity"]["payload_sha256"] != EXPECTED_SIGNED_PAYLOAD:
        raise AssertionError("signed embedded payload hash mismatch")

    moment_rows = prior["target_moments"]
    positive_rows = prior["complete_positive_moments"]
    if [row["index"] for row in moment_rows[:4]] != [0, 1, 2, 3]:
        raise AssertionError("signed moment indices changed")
    if [row["order"] for row in positive_rows[:3]] != [0, 1, 2]:
        raise AssertionError("positive moment indices changed")

    moments: list[Interval] = []
    for row in moment_rows[:4]:
        enclosure = row["corrected_M_interval"]
        lower_ball = ball(enclosure["lower"])
        upper_ball = ball(enclosure["upper"])
        moments.append((lower_ball[0], upper_ball[1]))
    positive = [
        ball(row["complete_halfline_norm_square"]["arb"])
        for row in positive_rows[:3]
    ]
    M0, M1, M2, M3 = moments
    n0, n1, n2 = positive
    if min(value[0] for value in moments + positive) <= 0:
        raise AssertionError("expected strictly positive input enclosures")

    sigma0 = scale(M0, 2)
    sigma1 = scale(M1, 2)
    S2 = sub(M2, div(square(M1), M0))
    sigma2 = scale(S2, 2)
    S3 = sub(M3, div(square(M2), M1))
    sigma3 = scale(S3, 2)
    b1 = div(sigma1, sigma0)
    b2 = div(sigma2, sigma1)
    if min(sigma2[0], sigma3[0], b1[0], b2[0]) <= 0:
        raise AssertionError("positive endpoint prefix/pivot was not certified")

    centered = sub(b2, scale(b1, 2))
    kappa0 = add(
        (Fraction(8), Fraction(8)),
        div(square(centered), mul(b1, b2)),
    )
    A = add(sub(n2, scale(mul(b1, n1), 2)), mul(square(b1), n0))
    B = add(add(scale(sigma2, Fraction(1, 4)), n1), mul(b1, n0))
    if A[0] <= 0 or B[0] <= 0:
        raise AssertionError("Cauchy factors were not positive")
    AB = mul(A, B)
    q_upper = ceil_sqrt(AB[1])
    payment_upper = kappa0[1] * q_upper
    margin_lower = sigma3[0] - payment_upper

    if not kappa0[1] < Fraction(4001, 500):
        raise AssertionError("kappa0 < 8.002 failed")
    if not A[1] < Fraction(6327, 50):
        raise AssertionError("A < 126.54 failed")
    if not B[1] < Fraction(18283, 1000):
        raise AssertionError("B < 18.283 failed")
    if not sigma3[0] > Fraction(14487, 25):
        raise AssertionError("sigma3 > 579.48 failed")
    if not q_upper < Fraction(240461, 5000):
        raise AssertionError("Q <= sqrt(A*B) < 48.0922 failed")
    if not payment_upper < 385:
        raise AssertionError("endpoint modular cost < 385 failed")
    if not margin_lower > Fraction(19469, 100):
        raise AssertionError("endpoint payment margin > 194.69 failed")

    source = Path(__file__).resolve()
    result = {
        "schema_version": "zsv.modular_n2_endpoint_payment_independent_audit.20261103.v1",
        "status": "PASS",
        "scope": (
            "Direct complete-theta N=2 strong modular payment at a=0 only; "
            "not a prefix-only induction theorem, finite-a interval theorem, "
            "all-degree result, or RH result"
        ),
        "checks": [
            "frozen source and receipt hashes",
            "canonical payload hashes for signed and positive-moment receipts",
            "full-line signed versus half-line positive normalization",
            "sigma2=2*(M2-M1^2/M0)",
            "sigma3=2*(M3-M2^2/M1)",
            "A=n2-2*b1*n1+b1^2*n0",
            "B=sigma2/4+n1+b1*n0",
            "Q20^2<=A*B by Cauchy-Schwarz",
            "kappa0=8+(b2-2*b1)^2/(b1*b2)",
            "sigma3>kappa0*Q20 with exact rational outward arithmetic",
        ],
        "frozen_inputs": observed_hashes,
        "receipt_payload_sha256": {
            PRIOR_RESULT: EXPECTED_PRIOR_PAYLOAD,
            SIGNED_RESULT: EXPECTED_SIGNED_PAYLOAD,
        },
        "exact_bounds": {
            "kappa0_upper": rational_text(kappa0[1]),
            "A_upper": rational_text(A[1]),
            "B_upper": rational_text(B[1]),
            "AB_upper": rational_text(AB[1]),
            "Q20_upper_decimal_ceiling": rational_text(q_upper),
            "sigma3_lower": rational_text(sigma3[0]),
            "payment_upper": rational_text(payment_upper),
            "margin_lower": rational_text(margin_lower),
        },
        "simple_directed_bounds": {
            "kappa0": "<8.002",
            "A": "<126.54",
            "B": "<18.283",
            "Q20": "<48.0922",
            "sigma3": ">579.48",
            "kappa0_times_Q20": "<385",
            "sigma3_minus_kappa0_times_Q20": ">194.69",
        },
        "scope_caveat": (
            "The direct value of sigma3 uses the fixed target moment M3. Its "
            "sign is certified rather than assumed, but this is not a "
            "current-prefix-only all-degree mechanism."
        ),
        "source_sha256": sha256(source),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
