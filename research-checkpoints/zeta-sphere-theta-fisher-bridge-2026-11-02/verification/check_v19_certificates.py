#!/usr/bin/env python3
"""Dependency-free checks of the public v19 certificate summaries and identity."""

from __future__ import annotations

from decimal import Decimal, getcontext
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import sys


getcontext().prec = 90
ROOT = Path(__file__).resolve().parents[1]
V19 = ROOT / "evidence" / "v19-delta"


def fail(message: str) -> None:
    raise AssertionError(message)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def arb_bounds(value: str) -> tuple[Decimal, Decimal]:
    body = value.strip()
    if not (body.startswith("[") and body.endswith("]")):
        fail(f"unexpected Arb enclosure: {value!r}")
    body = body[1:-1]
    if body.startswith("+/- "):
        radius = Decimal(body[4:])
        return -radius, radius
    try:
        center_text, radius_text = body.split(" +/- ", 1)
    except ValueError as error:
        raise AssertionError(f"unexpected Arb enclosure: {value!r}") from error
    center = Decimal(center_text)
    radius = Decimal(radius_text)
    return center - radius, center + radius


def verify_h6() -> dict[str, str]:
    data = json.loads((V19 / "source_2354_audit" / "h6_replay.json").read_text())
    if data.get("PASS") is not True:
        fail("stored H6 replay is not marked PASS")
    lowers = [arb_bounds(value)[0] for value in data["gershgorin_lower"]]
    normalization_upper = arb_bounds(data["normalization_upper"])[1]
    if min(lowers) <= Decimal(1) / Decimal(60):
        fail("H6 Gershgorin reserve does not exceed 1/60")
    if normalization_upper >= Decimal(4) / Decimal(125):
        fail("H6 normalization upper does not stay below 4/125")
    return {
        "minimum_gershgorin_lower": str(min(lowers)),
        "normalization_upper": str(normalization_upper),
    }


def verify_endpoint_payment() -> dict[str, str]:
    audit = V19 / "fisher_bridge_v3_audit" / "endpoint_certificate_1000.json"
    source = V19 / "fisher_bridge_v3" / "endpoint_certificate_1000.json"
    if digest(audit) != digest(source):
        fail("source/audit endpoint certificates differ")
    data = json.loads(audit.read_text())
    results = data.get("results", [])
    if [row.get("degree") for row in results] != list(range(3, 20, 2)):
        fail("endpoint certificate does not cover exactly odd rungs 3 through 19")
    for row in results:
        gain_lower = Decimal(row["gain"][0])
        cost_lower = Decimal(row["cost"][0])
        surplus_lower = Decimal(row["surplus"][0])
        ratio_upper = Decimal(row["cost_over_gain"][1])
        if not (gain_lower > 0 and cost_lower > 0 and surplus_lower > 0 and ratio_upper < 1):
            fail(f"endpoint payment failed at degree {row['degree']}")
    row = results[-1]
    if Decimal(row["gain"][0]) <= Decimal("0.000252203292259"):
        fail("odd19 gain threshold failed")
    if Decimal(row["cost"][1]) >= Decimal("0.000091900511724"):
        fail("odd19 cost threshold failed")
    if Decimal(row["surplus"][0]) <= Decimal("0.000160302780535"):
        fail("odd19 surplus threshold failed")
    if Decimal(row["cost_over_gain"][1]) >= Decimal("0.364390610847"):
        fail("odd19 cost/gain threshold failed")
    return {
        "degree": "19",
        "gain_lower": row["gain"][0],
        "cost_upper": row["cost"][1],
        "surplus_lower": row["surplus"][0],
        "cost_over_gain_upper": row["cost_over_gain"][1],
    }


def verify_paid_newman() -> dict[str, str]:
    audit = V19 / "paid_relaxation_audit" / "certificate.json"
    source = V19 / "paid_relaxation_v2" / "certify_n2_final.json"
    if digest(audit) != digest(source):
        fail("source/audit paid Newman certificates differ")
    data = json.loads((V19 / "paid_relaxation_v2" / "endpoint_summary.json").read_text())
    if data.get("PASS") is not True:
        fail("paid Newman endpoint summary is not marked PASS")
    terminal_lower = arb_bounds(data["terminal_lower"])[0]
    budget_upper = arb_bounds(data["budget_upper"])[1]
    paid_lower = arb_bounds(data["paid_lower_unscaled"])[0]
    physical_lower = arb_bounds(data["paid_lower_with_pi_over_2"])[0]
    if terminal_lower <= Decimal("3.6442681947430"):
        fail("paid Newman terminal threshold failed")
    if budget_upper >= Decimal("3.1520578244214"):
        fail("paid Newman budget threshold failed")
    if paid_lower <= Decimal("0.4922103693903"):
        fail("paid Newman unscaled residual threshold failed")
    if physical_lower <= Decimal("0.773162230542629"):
        fail("paid Newman physical residual threshold failed")
    return {
        "terminal_lower": str(terminal_lower),
        "budget_upper": str(budget_upper),
        "paid_lower_unscaled": str(paid_lower),
        "paid_lower_with_pi_over_2": str(physical_lower),
    }


def poly_add(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    size = max(len(left), len(right))
    out = [Fraction(0) for _ in range(size)]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    return out


def poly_scale(poly: list[Fraction], scale: Fraction) -> list[Fraction]:
    return [scale * value for value in poly]


def poly_mul(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    out = [Fraction(0) for _ in range(len(left) + len(right) - 1)]
    for i, a in enumerate(left):
        for j, b in enumerate(right):
            out[i + j] += a * b
    return out


def poly_derivative(poly: list[Fraction]) -> list[Fraction]:
    if len(poly) == 1:
        return [Fraction(0)]
    return [Fraction(index) * poly[index] for index in range(1, len(poly))]


def poly_shift(poly: list[Fraction], amount: int) -> list[Fraction]:
    return [Fraction(0)] * amount + poly


def expectation(poly: list[Fraction], moments: list[Fraction]) -> Fraction:
    return sum((coefficient * moments[index] for index, coefficient in enumerate(poly)), Fraction(0))


def verify_orthogonality_identity() -> dict[str, int]:
    captured = (V19 / "orthogonality_forcing_v1" / "check_identity.out").read_text().strip()
    audit = (V19 / "orthogonality_forcing_audit" / "check_identity.out").read_text().strip()
    if captured != audit or not captured.startswith("PASS:"):
        fail("orthogonality source/audit output mismatch")

    a = Fraction(1, 3)
    recurrence_multiplier = [a, Fraction(-2)]
    q = [[Fraction(1)]]
    for _ in range(8):
        q.append(poly_add(poly_derivative(q[-1]), poly_mul(recurrence_multiplier, q[-1])))

    mean = a / 2
    variance = Fraction(1, 4)
    moments = [Fraction(1), mean]
    for order in range(2, 20):
        moments.append(mean * moments[-1] + Fraction(order - 1) * variance * moments[-2])

    for degree in range(8):
        parity = degree % 2
        coefficients = {index: Fraction(index + 1) for index in range(parity, degree + 1, 2)}
        f = [Fraction(0)]
        k = [Fraction(0)]
        ell = [Fraction(0)]
        for index, coefficient in coefficients.items():
            f = poly_add(f, poly_scale(q[index], coefficient))
            if index:
                k = poly_add(k, poly_scale(q[index - 1], Fraction(index) * coefficient))
            if index >= 2:
                ell = poly_add(
                    ell,
                    poly_scale(q[index - 2], Fraction(index * (index - 1)) * coefficient),
                )
        identity = poly_add(
            poly_shift(poly_mul(f, k), 2),
            poly_shift(poly_add(poly_mul(k, k), poly_mul(f, ell)), 1),
        )
        if expectation(identity, moments) != 0:
            fail(f"exact orthogonality identity failed at degree {degree}")
    return {"exact_degrees_checked": 8}


def main() -> int:
    result = {
        "status": "PASS",
        "h6": verify_h6(),
        "odd_endpoint_payment": verify_endpoint_payment(),
        "paid_newman": verify_paid_newman(),
        "orthogonality_forcing": verify_orthogonality_identity(),
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (AssertionError, OSError, ValueError, KeyError, json.JSONDecodeError) as error:
        print(json.dumps({"status": "FAIL", "error": str(error)}), file=sys.stderr)
        sys.exit(1)
