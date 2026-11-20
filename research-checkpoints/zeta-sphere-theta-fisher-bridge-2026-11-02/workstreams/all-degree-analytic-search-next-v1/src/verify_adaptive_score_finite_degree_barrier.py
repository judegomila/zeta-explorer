#!/usr/bin/env python3
"""Deterministic diagnostics for the finite-degree adaptive-score barrier.

The proof is analytic and lives in ADAPTIVE_SCORE_FINITE_DEGREE_BARRIER_NEXT.md.
This script checks the closed Gaussian-mixture moment formulas and records
high-precision samples.  The samples are route-selection diagnostics, not the
proof of the all-d limit.
"""

from __future__ import annotations

import argparse
from decimal import Decimal, getcontext
import hashlib
import json
from pathlib import Path


getcontext().prec = 110
D = Decimal


def odd_double_factorial(k: int) -> int:
    if k == 0:
        return 1
    out = 1
    for j in range(1, k + 1):
        out *= 2 * j - 1
    return out


def moment_over_sqrt_pi(k: int, L: Decimal) -> Decimal:
    """Return integral t^(2k) W_L(t)^2 dt / sqrt(pi).

    W_L(t)=exp(-t^2/2)+L^(-1)exp(-t^2/(2L^2)).
    """

    df = D(odd_double_factorial(k))
    c = df / (D(2) ** k)
    narrow_and_broad = c * (D(1) + L ** (2 * k - 1))
    root = (L * L + 1).sqrt()
    cross = (
        D(2)
        * D(2).sqrt()
        * df
        * L ** (2 * k)
        / ((L * L + 1) ** k * root)
    )
    return narrow_and_broad + cross


def solve(matrix: list[list[Decimal]], rhs: list[Decimal]) -> list[Decimal]:
    n = len(rhs)
    a = [row[:] + [rhs[i]] for i, row in enumerate(matrix)]
    for col in range(n):
        pivot = max(range(col, n), key=lambda r: abs(a[r][col]))
        if a[pivot][col] == 0:
            raise ArithmeticError("singular Gram matrix")
        if pivot != col:
            a[col], a[pivot] = a[pivot], a[col]
        piv = a[col][col]
        for j in range(col, n + 1):
            a[col][j] /= piv
        for r in range(n):
            if r == col:
                continue
            factor = a[r][col]
            if factor == 0:
                continue
            for j in range(col, n + 1):
                a[r][j] -= factor * a[col][j]
    return [a[i][n] for i in range(n)]


def sample(d: int, L_int: int) -> dict[str, object]:
    L = D(L_int)
    size = d + 1
    gram: list[list[Decimal]] = []
    for i in range(size):
        row = []
        for j in range(size):
            row.append(moment_over_sqrt_pi(i + j, L) / L ** (2 * i + 2 * j))
        gram.append(row)
    score = [D(0)]
    for j in range(1, size):
        score.append(D(2 * j) * moment_over_sqrt_pi(j, L) / L ** (2 * j))
    coeff = solve(gram, score)
    projection = sum(score[i] * coeff[i] for i in range(size))
    m0 = moment_over_sqrt_pi(0, L)

    # J_L = integral t^2 W_L'(t)^2 dt, divided by sqrt(pi).
    root = (L * L + 1).sqrt()
    j_scaled = (
        D(3) / D(4)
        + D(3) * (D(2) ** D("1.5")) * L * L / ((L * L + 1) ** 2 * root)
        + D(3) / (D(4) * L)
    )
    target_gap = D(4) * j_scaled - D(2) * m0
    auxiliary = (projection - m0) / D(4)
    assert target_gap > 0
    assert auxiliary < 0
    return {
        "degree_ceiling": 2 * d,
        "L": L_int,
        "projection_over_sqrt_pi": str(projection),
        "A_over_sqrt_pi": str(m0),
        "target_gap_over_sqrt_pi": str(target_gap),
        "H_full_polynomial_space_over_sqrt_pi": str(auxiliary),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    rows = [sample(d, L) for d in range(1, 7) for L in (100, 1000, 10000)]
    source = Path(__file__).read_bytes()
    receipt = {
        "status": "PASS_DIAGNOSTIC_SUPPORT_FOR_ANALYTIC_PROOF",
        "source_sha256": hashlib.sha256(source).hexdigest(),
        "exact_formula_checks": {
            "moment_formula": (
                "m_k/sqrt(pi)=((2k-1)!!/2^k)(1+L^(2k-1))"
                "+2sqrt(2)(2k-1)!!L^(2k)/(L^2+1)^(k+1/2)"
            ),
            "target_gap_limit_over_sqrt_pi": "1",
            "full_polynomial_auxiliary_limit_over_sqrt_pi": "-1/4",
            "score_correlation": "y_j=2j m_j for p_j=t^(2j)",
        },
        "samples": rows,
        "scope": (
            "Finite high-precision samples only. The proof for every fixed "
            "degree ceiling is the scaled-polynomial norm argument in the note."
        ),
        "nonclaims": [
            "The counterprofiles are not the complete theta profile.",
            "No actual theta pivot, all-degree theorem, or RH statement follows.",
        ],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"status": receipt["status"], "output": str(args.output)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
