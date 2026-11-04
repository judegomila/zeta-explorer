#!/usr/bin/env python3
"""Exact symbolic replay for the actual-theta first-score monotonicity."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import tempfile

import sympy as s


SCHEMA = "zsv.theta_score_monotonicity.v1"


def canonical_hash(payload: object) -> str:
    encoded = json.dumps(
        payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def score_algebra() -> dict[str, bool]:
    h, v, v1, v2 = s.symbols("h v v1 v2", nonzero=True)

    def total_h(expr):
        return s.diff(expr, h) + s.diff(expr, v) * v1 + s.diff(expr, v1) * v2

    score = h * (v - v1 / v)
    C = v**2 / v1
    alpha = v * v2 / v1**2
    delta = 1 - v / (h * v1)
    rhs = (v1 / v) / (1 - delta) * (
        C * (2 - delta) + delta - alpha
    )

    psi, psi1, psi2 = s.symbols("psi psi1 psi2", nonzero=True)
    vv = -psi1 / psi
    vv1 = -psi2 / psi + psi1**2 / psi**2
    cancellation = s.factor(
        h * (vv - vv1 / vv) + h * psi2 / psi1
    )

    P, P1, P2 = s.symbols("P P1 P2", nonzero=True)
    scaling = s.factor((-2 * P) * (-4 * P1) - (-8 * P2))
    return {
        "score_equals_minus_h_psi2_over_psi1": cancellation == 0,
        "score_derivative_identity": s.factor(total_h(score) - rhs) == 0,
        "vv1_minus_v2_equals_8_PP1_plus_P2": s.factor(
            scaling - 8 * (P * P1 + P2)
        ) == 0,
    }


def jacobi_polynomial_audit() -> dict[str, object]:
    a, R, kappa, q, x, y = s.symbols("a R kappa q x y", real=True)
    ap = s.Rational(1, 2) * (1 - a**2) * (R - 1)
    Rp = R * kappa
    kp = a * (R + 1) * kappa + s.Rational(1, 2) * (
        (1 - a**2) * R**2 - 2 * (2 - a**2) * R - (1 + a**2)
    )

    def D(expr):
        return s.factor(
            s.diff(expr, a) * ap
            + s.diff(expr, R) * Rp
            + s.diff(expr, kappa) * kp
        )

    P = a * (s.Rational(5, 4) - R) + R * kappa / (
        R - s.Rational(3, 2)
    )
    P1 = D(P)
    P2 = D(P1)
    energy = s.factor(P * P1 + P2)
    numerator, denominator = s.fraction(s.together(energy.subs(kappa, a * q)))
    denominator_exact = s.factor(
        denominator - 32 * (2 * R - 3) ** 3
    ) == 0
    F = s.Poly(s.expand(numerator / a), a).as_expr().subs(a**2, x)

    table: dict[str, list[list[str]]] = {}
    all_positive = True
    for endpoint in (0, 1):
        polynomial = s.Poly(s.expand(F.subs(x, endpoint)), q)
        power = [polynomial.coeff_monomial(q**i) for i in range(4)]
        rows = []
        for j in range(4):
            bernstein = s.factor(
                sum(
                    power[i] * s.binomial(j, i) / s.binomial(3, i)
                    for i in range(j + 1)
                )
            )
            shifted = s.Poly(s.expand(bernstein.subs(R, y + 4)), y)
            descending = shifted.all_coeffs()
            all_positive = all_positive and all(value > 0 for value in descending)
            rows.append([str(value) for value in descending])
        table[str(endpoint)] = rows

    return {
        "denominator_exact": denominator_exact,
        "F_degree_in_a_squared": int(s.degree(F, x)),
        "F_degree_in_q": int(s.degree(F, q)),
        "all_shifted_bernstein_coefficients_positive": bool(all_positive),
        "bernstein_coefficients_after_R_equals_4_plus_y": table,
    }


def build_payload() -> dict[str, object]:
    algebra = score_algebra()
    jacobi = jacobi_polynomial_audit()
    passed = (
        all(algebra.values())
        and jacobi["denominator_exact"] is True
        and jacobi["F_degree_in_a_squared"] == 1
        and jacobi["F_degree_in_q"] == 3
        and jacobi["all_shifted_bernstein_coefficients_positive"] is True
    )
    payload: dict[str, object] = {
        "schema_version": SCHEMA,
        "status": "PASS_EXACT_SYMBOLIC" if passed else "FAIL",
        "score_algebra": algebra,
        "jacobi_polynomial": jacobi,
        "positivity_domain": "0<a<1, 0<kappa/a<1, R>4",
        "imported_inputs": [
            "Planat-Sole analytic Jacobi autonomous system and invariant region",
            "first-level theta-kernel log-concavity",
            "wave-32 endpoint limits of the first score",
        ],
        "consequence": "conditional on imported inputs, score'(h)>0 and Y1 has one positive zero",
        "nonclaims": [
            "The imported all-height invariant theorem is not re-proved here.",
            "The remaining signed Green correlation is not evaluated.",
            "No all-degree or Riemann-hypothesis conclusion is claimed.",
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
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    payload = build_payload()
    atomic_write(args.output, payload)
    print(json.dumps({"output": str(args.output), "status": payload["status"]}))
    return 0 if payload["status"].startswith("PASS_") else 1


if __name__ == "__main__":
    raise SystemExit(main())
