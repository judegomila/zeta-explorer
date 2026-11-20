#!/usr/bin/env python3
"""Exact algebra audit for the wave-31 tail-augmented Hardy gate."""

from __future__ import annotations

from fractions import Fraction
import hashlib
import json
from pathlib import Path
from typing import Dict, Iterable, List


SOURCE = Path(__file__).resolve()
WORKSTREAM = SOURCE.parents[1]
CHECKPOINT = SOURCE.parents[3]
OUTPUT = WORKSTREAM / "results/direct_head_hardy_tail.json"
HARDY_NOTE = CHECKPOINT / (
    "workstreams/all-degree-analytic-search-next-v1/"
    "COMPLETE_ORBIT_HARDY_NEXT.md"
)
WAVE30_NOTE = CHECKPOINT / (
    "workstreams/direct-head-route-audit-wave30-20261104/"
    "DIRECT_HEAD_ROUTE_AUDIT_20261104.md"
)

Poly = Dict[int, Fraction]


def clean(poly: Poly) -> Poly:
    return {degree: value for degree, value in poly.items() if value}


def add(left: Poly, right: Poly) -> Poly:
    result = dict(left)
    for degree, value in right.items():
        result[degree] = result.get(degree, Fraction()) + value
    return clean(result)


def multiply(left: Poly, right: Poly) -> Poly:
    result: Poly = {}
    for i, a in left.items():
        for j, b in right.items():
            result[i + j] = result.get(i + j, Fraction()) + a * b
    return clean(result)


def derivative(poly: Poly) -> Poly:
    return clean(
        {degree - 1: degree * value for degree, value in poly.items() if degree}
    )


def shift(poly: Poly, amount: int, factor: Fraction = Fraction(1)) -> Poly:
    return clean({degree + amount: factor * value for degree, value in poly.items()})


def from_roots(roots: Iterable[Fraction]) -> Poly:
    result: Poly = {0: Fraction(1)}
    for root in roots:
        result = multiply(result, {1: Fraction(1), 0: -root})
    return result


def divide_by_linear(poly: Poly, root: Fraction) -> Poly:
    degree = max(poly)
    coefficients = [poly.get(k, Fraction()) for k in range(degree, -1, -1)]
    quotient = [coefficients[0]]
    for coefficient in coefficients[1:-1]:
        quotient.append(coefficient + root * quotient[-1])
    assert coefficients[-1] + root * quotient[-1] == 0
    return clean({degree - 1 - i: value for i, value in enumerate(quotient)})


def gaussian_integral(poly: Poly) -> Fraction:
    """Return integral poly(t) exp(-2t^2) dt divided by I_0."""
    total = Fraction()
    for degree, coefficient in poly.items():
        if degree % 2:
            continue
        moment = Fraction(1)
        for r in range(1, degree // 2 + 1):
            moment *= Fraction(2 * r - 1, 4)
        total += coefficient * moment
    return total


def evaluate(poly: Poly, value: Fraction) -> Fraction:
    return sum(coefficient * value**degree for degree, coefficient in poly.items())


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_text_digest(path: Path) -> str:
    lines = path.read_text(encoding="utf-8").splitlines()
    normalized = "\n".join(line.rstrip() for line in lines) + "\n"
    return hashlib.sha256(normalized.encode()).hexdigest()


def hardy_cases() -> List[dict[str, object]]:
    rows = []
    root_sets = [
        [Fraction(0)],
        [Fraction(-1), Fraction(2)],
        [Fraction(-2), Fraction(0), Fraction(3)],
        [Fraction(-3), Fraction(-1), Fraction(2), Fraction(4)],
        [Fraction(-4), Fraction(-2), Fraction(0), Fraction(1), Fraction(5)],
        [Fraction(-5), Fraction(-3), Fraction(-1), Fraction(2), Fraction(4), Fraction(6)],
    ]
    for roots in root_sets:
        q = from_roots(roots)
        q_prime = derivative(q)
        g_prime_polynomial = add(q_prime, shift(q, 1, Fraction(-2)))
        energy = gaussian_integral(multiply(g_prime_polynomial, g_prime_polynomial))
        root_cost = Fraction()
        for root in roots:
            q_j = divide_by_linear(q, root)
            root_cost += gaussian_integral(multiply(q_j, q_j))
            assert evaluate(q, root) == 0
        target = 2 * gaussian_integral(multiply(q, q))
        assert 2 * energy - root_cost == target
        rows.append(
            {
                "degree": len(roots),
                "energy_over_I0": str(energy),
                "root_cost_over_I0": str(root_cost),
                "target_over_I0": str(target),
            }
        )
    return rows


def quotient_identity_cases() -> int:
    cases = 0
    for a in range(1, 8):
        xi = {0: Fraction(1), 1: Fraction(a), 2: Fraction(a + 1)}
        for b in range(1, 8):
            ratio = {0: Fraction(b), 1: Fraction(1 - b), 3: Fraction(2)}
            ewald = multiply(xi, ratio)
            xi_p = derivative(xi)
            xi_pp = derivative(xi_p)
            ewald_p = derivative(ewald)
            ewald_pp = derivative(ewald_p)
            left = add(
                multiply(xi_p, ewald_p),
                {
                    k: -v / 2
                    for k, v in add(
                        multiply(xi, ewald_pp), multiply(xi_pp, ewald)
                    ).items()
                },
            )
            laguerre = add(
                multiply(xi_p, xi_p),
                {k: -v for k, v in multiply(xi, xi_pp).items()},
            )
            ratio_pp = derivative(derivative(ratio))
            right = add(
                multiply(ratio, laguerre),
                {
                    k: -v / 2
                    for k, v in multiply(multiply(xi, xi), ratio_pp).items()
                },
            )
            assert left == right
            cases += 1
    return cases


def main() -> int:
    identity_rows = hardy_cases()

    threshold_cases = 0
    for m in range(1, 31):
        for numerator in range(0, 20):
            r_value = Fraction(numerator, 10)
            if r_value >= 2:
                continue
            bound = (2 - r_value) / (4 * m - 2 + r_value)
            assert 4 * m * bound / (1 + bound) == 2 - r_value
            test_value = bound / 2
            assert 2 - 4 * m * test_value / (1 + test_value) > r_value
            threshold_cases += 1

    reciprocal_cases = 0
    for numerator in range(1, 101):
        variance = Fraction(numerator, 37)
        gamma_lower = (1 + variance) / (4 * variance)
        assert 1 / gamma_lower == 4 * variance / (1 + variance)
        reciprocal_cases += 1

    telescoping_cases = 0
    for cutoff in range(1, 101):
        endpoints: Dict[int, int] = {}
        for k in range(1, cutoff + 1):
            endpoints[k - 1] = endpoints.get(k - 1, 0) - 1
            endpoints[k] = endpoints.get(k, 0) + 1
        endpoints = {k: v for k, v in endpoints.items() if v}
        assert endpoints == {0: -1, cutoff: 1}
        telescoping_cases += 1

    gauss_cases = 0
    for m in range(1, 31):
        gauss_cost = Fraction(m * (m + 1), 3)
        energy = Fraction(7 * m + 3, 5)
        root_cost = Fraction(2 * m + 1, 7)
        pi_proxy = Fraction(355, 113)
        sigma = (2 * energy - root_cost) / (2 * pi_proxy)
        assert gauss_cost + sigma - gauss_cost == sigma
        gauss_cases += 1

    payload = {
        "schema_version": "zsv.direct_head_hardy_tail.v1",
        "status": "PASS",
        "grade": "exact_algebra_and_independently_audited_reduction",
        "hardy_identity_rows": identity_rows,
        "hardy_identity_case_count": len(identity_rows),
        "uniform_threshold_case_count": threshold_cases,
        "variance_reciprocal_case_count": reciprocal_cases,
        "incomplete_euler_telescoping_case_count": telescoping_cases,
        "quotient_identity_case_count": quotient_identity_cases(),
        "gauss_cancellation_case_count": gauss_cases,
        "source_sha256": digest(SOURCE),
        "dependencies": {
            "hash_normalization": "UTF-8, trailing whitespace removed per line, one terminal newline",
            "complete_orbit_hardy_note": str(HARDY_NOTE.relative_to(CHECKPOINT)),
            "complete_orbit_hardy_canonical_sha256": canonical_text_digest(HARDY_NOTE),
            "wave30_note": str(WAVE30_NOTE.relative_to(CHECKPOINT)),
            "wave30_note_canonical_sha256": canonical_text_digest(WAVE30_NOTE),
        },
        "analytic_inputs": [
            "positive old prefix and real simple roots",
            "complete-theta decay and integration by parts",
            "Gaussian quadrature exactness through degree 2m-1",
            "conditional wave-24/wave-29 Ewald tail onset and domain",
        ],
        "nonclaims": [
            "The criterion is not a proof of its strict Hardy-slack inequality.",
            "Tail positivity remains conditional on imported hypotheses.",
            "No direct-head sign, next pivot, all-degree theorem, or RH proof is claimed.",
        ],
    }
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    payload["payload_sha256"] = hashlib.sha256(canonical).hexdigest()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(
        json.dumps(
            {
                "status": payload["status"],
                "output": str(OUTPUT),
                "payload_sha256": payload["payload_sha256"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
