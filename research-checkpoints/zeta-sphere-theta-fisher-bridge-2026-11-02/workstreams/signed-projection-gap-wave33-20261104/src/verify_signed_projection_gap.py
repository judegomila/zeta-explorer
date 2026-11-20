#!/usr/bin/env python3
"""Exact rational replay for the signed projection/gap checkpoint."""
from __future__ import annotations

import argparse
from fractions import Fraction as Q
import hashlib
import json
from pathlib import Path
from typing import Iterable


SCHEMA = "zsv.signed_projection_gap.20261104.v1"


def canonical_sha256(payload: object) -> str:
    encoded = json.dumps(
        payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def qstr(value: Q) -> str:
    return str(value.numerator) if value.denominator == 1 else f"{value.numerator}/{value.denominator}"


def diagonal_residual(
    lambdas: Iterable[Q], b: Iterable[Q], h: Q
) -> dict[str, Q]:
    eigenvalues = tuple(lambdas)
    coupling = tuple(b)
    assert len(eigenvalues) == len(coupling)
    assert all(Q(0) <= value < Q(1) for value in eigenvalues)
    coefficients = tuple(
        entry / (1 - value) for value, entry in zip(eigenvalues, coupling)
    )
    s1 = sum(
        (entry * entry / (1 - value) for value, entry in zip(eigenvalues, coupling)),
        Q(0),
    )
    s2 = sum((entry * entry for entry in coefficients), Q(0))
    xq = 1 + s2
    hq_direct = h
    qq_direct = 1 - h
    for value, entry, coefficient in zip(eigenvalues, coupling, coefficients):
        hq_direct += 2 * entry * coefficient + value * coefficient * coefficient
        qq_direct += -2 * entry * coefficient + (1 - value) * coefficient * coefficient
    hq_formula = h + s1 + s2
    qq_formula = 1 - h - s1
    assert hq_direct == hq_formula
    assert qq_direct == qq_formula
    assert xq == hq_formula + qq_formula

    # Selected-column interpolation p(lambda) at lambda=1.
    pivot = 1 - h
    pivot_derivative = -h
    pivot_second = Q(0)
    for value, entry in zip(eigenvalues, coupling):
        pivot -= entry * entry / (1 - value)
        pivot_derivative -= entry * entry * (
            Q(2) / (1 - value) + value / (1 - value) ** 2
        )
        pivot_second -= Q(2) * entry * entry / (1 - value) ** 3
    assert pivot == qq_formula
    assert -pivot_derivative == hq_formula
    assert pivot - pivot_derivative == xq
    assert pivot_second <= 0
    return {
        "s1": s1,
        "s2": s2,
        "Xq_over_A": xq,
        "Hq_over_A": hq_formula,
        "Qq_over_A": qq_formula,
        "H_over_X": hq_formula / xq,
        "pivot_second_at_1": pivot_second,
    }


def psd_schur_cost(lambdas: Iterable[Q], b: Iterable[Q]) -> Q:
    cost = Q(0)
    for value, entry in zip(lambdas, b):
        if value == 0:
            assert entry == 0
        else:
            cost += entry * entry / value
    return cost


def audit_general_examples() -> list[dict[str, str]]:
    examples = [
        ((Q(1, 4),), (Q(1, 10),), Q(1, 5)),
        ((Q(1, 5), Q(2, 5)), (Q(1, 20), Q(-1, 15)), Q(1, 4)),
        ((Q(0), Q(1, 3), Q(1, 2)), (Q(0), Q(1, 30), Q(-1, 20)), Q(1, 6)),
    ]
    rows: list[dict[str, str]] = []
    for lambdas, b, h in examples:
        assert psd_schur_cost(lambdas, b) <= h
        rho = 1 - max(lambdas, default=Q(0))
        assert h < rho
        row = diagonal_residual(lambdas, b, h)
        sharp_bound = h / (rho * rho + (1 - rho) * h)
        assert row["H_over_X"] <= sharp_bound
        rows.append(
            {
                "rho": qstr(rho),
                "h": qstr(h),
                "s1": qstr(row["s1"]),
                "s2": qstr(row["s2"]),
                "H_over_X": qstr(row["H_over_X"]),
                "sharp_bound": qstr(sharp_bound),
                "pivot_second_at_1": qstr(row["pivot_second_at_1"]),
            }
        )
    return rows


def audit_sharp_family() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    previous_ratio = Q(0)
    for n in (10, 100, 1000, 10000):
        rho = Q(1, n * n)
        h = Q(1, n * n * n)
        k = 1 - rho
        b_squared = k * h
        assert rho * rho < h < rho
        assert k * h - b_squared == 0  # det(H)=0
        assert rho * (1 - h) - b_squared == rho - h > 0  # det(Q)>0

        d_trial = 1 + h / k
        q_over_a = 1 - h / rho
        ratio = h / (rho * rho + k * h)
        assert ratio > previous_ratio
        assert d_trial > 1
        assert q_over_a > 0
        previous_ratio = ratio
        rows.append(
            {
                "N": str(n),
                "rho": qstr(rho),
                "h": qstr(h),
                "det_H": "0",
                "det_Q": qstr(rho - h),
                "perfect_trial_epsilon": "0",
                "trial_D": qstr(d_trial),
                "Qq_over_A": qstr(q_over_a),
                "Hq_over_Xq": qstr(ratio),
            }
        )
    assert previous_ratio > Q(999, 1001)
    return rows


def audit_tail_threshold_algebra() -> dict[str, str]:
    rho = Q(2, 5)
    tail_ratio = Q(1, 2)
    tau = (2 - tail_ratio) / (2 + tail_ratio)
    h_threshold = tau * tau * rho * rho / (1 - (1 - rho) * tau * tau)
    h = h_threshold / 2
    residual_ratio_bound = h / (rho * rho + (1 - rho) * h)
    assert residual_ratio_bound < tau * tau
    return {
        "rho": qstr(rho),
        "tail_ratio": qstr(tail_ratio),
        "tau": qstr(tau),
        "h_threshold": qstr(h_threshold),
        "strict_test_h": qstr(h),
        "residual_ratio_bound": qstr(residual_ratio_bound),
    }


def build_receipt() -> dict[str, object]:
    payload: dict[str, object] = {
        "schema_version": SCHEMA,
        "status": "PASS",
        "grade": "exact rational algebra replay; analytic spectral proof in note",
        "checks": [
            "Q-Galerkin residual coordinates",
            "X/H/Q form identities",
            "selected-column pivot value and first/second derivatives",
            "sharp gap-relative bound on rational PSD examples",
            "rank-one sharp obstruction family",
            "wave-31 tail-threshold algebra",
        ],
        "general_examples": audit_general_examples(),
        "sharp_family": audit_sharp_family(),
        "tail_threshold_replay": audit_tail_threshold_algebra(),
        "analytic_inputs_not_replaced_by_replay": [
            "spectral extreme-point proof for all dimensions",
            "Pollaczek asymptotics at remote commit fc148eaa",
            "actual selected-column obstruction at remote commit 3263f5a7",
            "relative selected-column obstruction at remote commit 859300d1",
            "membership in the relevant positive old prefix",
        ],
        "nonclaims": [
            "The countermodel is generic, not actual complete theta.",
            "No actual-theta pivot failure is asserted.",
            "No all-degree theorem or RH conclusion is asserted.",
        ],
    }
    payload["payload_sha256_before_self_hash"] = canonical_sha256(payload)
    return payload


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    payload = build_receipt()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"status": "PASS", "output": str(args.output)}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
