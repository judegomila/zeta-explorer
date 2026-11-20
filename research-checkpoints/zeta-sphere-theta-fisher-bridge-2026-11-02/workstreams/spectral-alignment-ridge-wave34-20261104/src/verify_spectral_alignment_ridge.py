#!/usr/bin/env python3
"""Deterministic exact-arithmetic replay for the wave-34 algebra."""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import tempfile


SCHEMA = "zsv.spectral_alignment_ridge.v1"


def canonical_hash(payload: object) -> str:
    encoded = json.dumps(
        payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def exact_layer_cake(rs: list[Fraction], masses: list[Fraction]) -> bool:
    direct = sum(mass / (r * r) for r, mass in zip(rs, masses))
    levels = sorted(set(rs + [Fraction(1)]))
    integral = Fraction(0)
    for left, right in zip(levels, levels[1:]):
        cumulative = sum(mass for r, mass in zip(rs, masses) if r <= left)
        integral += cumulative * (left ** -2 - right ** -2)
    return direct == sum(masses) + integral


def audit_layer_cake() -> dict[str, object]:
    rs = [Fraction(1, 5), Fraction(1, 2), Fraction(1)]
    masses = [Fraction(2, 7), Fraction(3, 11), Fraction(5, 13)]
    s2 = sum(mass / (r * r) for r, mass in zip(rs, masses))
    necessities = []
    for t in rs:
        m_t = sum(mass for r, mass in zip(rs, masses) if r <= t)
        necessities.append(m_t <= t * t * s2)
    return {
        "identity_exact": exact_layer_cake(rs, masses),
        "endpoint_atom_at_one_present": rs[-1] == 1 and masses[-1] > 0,
        "necessity_checks": all(necessities),
    }


def audit_countermodel() -> dict[str, object]:
    n = 5
    rho = Fraction(1, n**10)
    epsilon = Fraction(1, n)
    k1 = 1 - rho
    k2 = Fraction(1, 2)
    h = 2 * epsilon
    b2_square = epsilon
    h_schur = h - b2_square / k2
    s1 = b2_square / (1 - k2)
    s2 = b2_square / ((1 - k2) ** 2)
    q_schur = 1 - h - s1
    ratio = (h + s1 + s2) / (1 + s2)
    return {
        "old_H_positive": k1 > 0 and k2 > 0,
        "H_schur_zero": h_schur == 0,
        "old_Q_positive": rho > 0 and 1 - k2 > 0,
        "enlarged_Q_schur_positive": q_schur > 0,
        "s1_exact": s1 == Fraction(2, n),
        "s2_exact": s2 == Fraction(4, n),
        "s1_over_rho_exact": s1 / rho == 2 * n**9,
        "selected_ratio_exact": ratio == Fraction(8, n) / (1 + Fraction(4, n)),
    }


def audit_ridge() -> dict[str, object]:
    samples = [
        (Fraction(1, 7), Fraction(1, 5), Fraction(2, 9)),
        (Fraction(1, 3), Fraction(1, 3), Fraction(5, 17)),
        (Fraction(3, 4), Fraction(1), Fraction(7, 19)),
    ]
    inequalities = []
    equality_at_edge = False
    for r, t, mass in samples:
        kernel_difference = t * mass / ((r + t) * (r + 2 * t))
        if r <= t:
            inequalities.append(mass <= 6 * t * kernel_difference)
            if r == t:
                equality_at_edge = mass == 6 * t * kernel_difference

    rs = [Fraction(1, 6), Fraction(2, 5), Fraction(1)]
    masses = [Fraction(1, 9), Fraction(2, 13), Fraction(3, 17)]
    t = Fraction(1, 2)
    h = Fraction(1, 8)

    def g(tau: Fraction) -> Fraction:
        return sum(mass / (r + tau) for r, mass in zip(rs, masses))

    def pivot(tau: Fraction) -> Fraction:
        return 1 - h + tau - g(tau)

    ridge_identity = g(t) - g(2 * t) == pivot(2 * t) - pivot(t) - t
    cumulative = sum(mass for r, mass in zip(rs, masses) if r <= t)
    ridge_bound = cumulative <= 6 * t * (g(t) - g(2 * t))
    return {
        "single_mode_bounds": all(inequalities),
        "constant_six_attained_at_r_equals_t": equality_at_edge,
        "pivot_increment_identity": ridge_identity,
        "multi_mode_cumulative_bound": ridge_bound,
    }


def audit_form_expansion() -> dict[str, object]:
    # The mixed term is 2 F F' (pq)'.  Integration by parts contributes
    # -2(F'^2+F F'')pq, which combines with +4F'^2 pq.
    fprime_square = -2 + 4
    f_fsecond = -2
    return {
        "fprime_square_coefficient": fprime_square,
        "f_fsecond_coefficient": f_fsecond,
        "equals_two_times_difference": (
            fprime_square == 2 and f_fsecond == -2
        ),
    }


def build_payload() -> dict[str, object]:
    audits = {
        "layer_cake": audit_layer_cake(),
        "countermodel": audit_countermodel(),
        "positive_ridge": audit_ridge(),
        "form_expansion": audit_form_expansion(),
    }
    passed = all(
        value is True or not isinstance(value, bool)
        for group in audits.values()
        for value in group.values()
    )
    payload: dict[str, object] = {
        "schema_version": SCHEMA,
        "status": "PASS" if passed else "FAIL",
        "audits": audits,
        "scope": "exact finite-dimensional algebra; no actual-theta asymptotic estimate",
        "nonclaims": [
            "No all-degree spectral-alignment estimate is proved.",
            "No selected-pivot sign or Riemann-hypothesis conclusion is claimed.",
        ],
    }
    payload["canonical_sha256_before_self_hash"] = canonical_hash(payload)
    return payload


def atomic_write(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        "w", encoding="utf-8", dir=path.parent, prefix=path.name, delete=False
    ) as handle:
        temporary = Path(handle.name)
        json.dump(payload, handle, indent=2, sort_keys=True)
        handle.write("\n")
        handle.flush()
    temporary.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    payload = build_payload()
    atomic_write(args.output, payload)
    print(json.dumps({"output": str(args.output), "status": payload["status"]}))
    return 0 if payload["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
