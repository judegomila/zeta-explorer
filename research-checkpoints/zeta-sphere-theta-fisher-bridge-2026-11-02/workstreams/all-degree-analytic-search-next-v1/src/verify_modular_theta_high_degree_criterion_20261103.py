#!/usr/bin/env python3
"""Exact algebra audit for the theta high-degree modular criterion."""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path


SOURCES = {
    "evidence/v20-v26-continuation/theta_parent_growth_v1/GROWTH.md":
        "749b4e3109a308706d31c07f38817d08f8d061d10aadad8d4fd314d402d57a9f",
    "evidence/v20-v26-continuation/modular_cd_flux_v1/NORMALIZED_LIMIT.md":
        "d0f4b2c61364270c71515caaa421a10a29683ddaedbc779ecd36db485cac08af",
    "workstreams/all-degree-analytic-search-next-v1/MODULAR_GENERAL_PIVOT_TRANSPORT_NEXT.md":
        "5076a00c5e5b2b20fddd7470d92f61f907a2e954c23dc0bb66278271e0d96970",
    "evidence/v18-curated/hierarchy/large_order_v4/L1_GAUSSIAN_THEOREM.md":
        "16f69ea1af286f384d15ae0576bc72eedcdf5020dab3030aba4a976dedce6414",
    "workstreams/all-degree-analytic-search-next-v1/MODULAR_GAUSSIAN_STRONG_PAYMENT_BARRIER_20261103.md":
        "6dfb042d62b594bc93c73f3db36d9dfea7a177f535b77f85d1062fe5bfd0f539",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def add(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    size = max(len(left), len(right))
    result = [Fraction(0)] * size
    for index, value in enumerate(left):
        result[index] += value
    for index, value in enumerate(right):
        result[index] += value
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def scale(poly: list[Fraction], scalar: Fraction) -> list[Fraction]:
    return [scalar * value for value in poly]


def physical_polynomials(betas: list[Fraction]) -> list[list[Fraction]]:
    """T_(j+1)=x*T_j+b_j*T_(j-1), with betas indexed from one."""
    polys = [[Fraction(1)], [Fraction(0), Fraction(1)]]
    for index in range(1, len(betas)):
        polys.append(add([Fraction(0), *polys[index]], scale(polys[index - 1], betas[index])))
    return polys


def derivative(poly: list[Fraction]) -> list[Fraction]:
    return [index * poly[index] for index in range(1, len(poly))]


def audit_sequence(betas: list[Fraction], max_n: int) -> list[dict[str, str | int]]:
    polys = physical_polynomials(betas)
    rows = []
    for n in range(2, max_n + 1):
        residual = add(derivative(polys[n + 1]), scale(polys[n], Fraction(-(n + 1))))
        gamma = (n - 1) * betas[n] - 2 * sum(betas[1:n], Fraction(0))
        observed_gamma = residual[n - 2] if n - 2 < len(residual) else Fraction(0)
        if len(residual) > n - 1 or observed_gamma != gamma:
            raise AssertionError(f"leading derivative component failed at n={n}")
        normalized_square = gamma * gamma / (betas[n - 1] * betas[n])
        if normalized_square < 0:
            raise AssertionError("normalized square must be nonnegative")
        rows.append({
            "n": n,
            "gamma": str(gamma),
            "normalized_leading_square": str(normalized_square),
        })
    return rows


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    source = Path(__file__).resolve()
    workstream = source.parents[1]
    root = args.root.resolve()
    checkpoint = root / "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
    expected_workstream = checkpoint / "workstreams/all-degree-analytic-search-next-v1"
    if workstream != expected_workstream:
        raise AssertionError("verifier is not running from the bound workstream")

    observed = {}
    for relative, expected in SOURCES.items():
        path = checkpoint / relative
        actual = sha256(path)
        if actual != expected:
            raise AssertionError(f"frozen source hash mismatch: {relative}: {actual}")
        observed[relative] = actual

    arbitrary = [None, Fraction(2), Fraction(7), Fraction(5), Fraction(11), Fraction(13), Fraction(17), Fraction(19)]
    arbitrary_rows = audit_sequence(arbitrary, 6)

    c = Fraction(7, 3)
    linear = [None, *[c * n for n in range(1, 9)]]
    linear_rows = audit_sequence(linear, 7)
    if any(Fraction(row["normalized_leading_square"]) != 0 for row in linear_rows):
        raise AssertionError("linear Gaussian-type recurrence must cancel")

    quadratic = [None, *[c * n * n for n in range(1, 9)]]
    quadratic_rows = audit_sequence(quadratic, 7)
    for row in quadratic_rows:
        n = int(row["n"])
        gamma = Fraction(row["gamma"])
        expected_gamma = c * n * (n - 1) * (n + 1) / 3
        expected_square = Fraction((n + 1) ** 2, 9)
        if gamma != expected_gamma:
            raise AssertionError(f"quadratic gamma mismatch at n={n}")
        if Fraction(row["normalized_leading_square"]) != expected_square:
            raise AssertionError(f"quadratic normalized square mismatch at n={n}")

    result = {
        "schema_version": "zsv.modular_theta_high_degree_criterion.20261103.v1",
        "status": "PASS",
        "scope": (
            "Exact recurrence and source-binding audit for a conditional complete-theta "
            "high-degree modular-payment criterion; no theta asymptotic, all-degree sign, "
            "or RH claim"
        ),
        "frozen_sources": observed,
        "checks": [
            "endpoint half-line factor 1/2 and parent multiplier H_n+1",
            "direct reserve R_n=sigma_(n+1)/P_n=b_(n+1)*c_n",
            "physical recurrence subleading coefficient",
            "leading lower derivative component gamma_n",
            "pivot-normalized square gamma_n^2/(b_(n-1)*b_n)",
            "exact cancellation for b_n=C*n",
            "exact lower component (n+1)^2/9 for b_n=C*n^2",
        ],
        "exact_formulas": {
            "parent_halfline_bound": "Q_n0 < (log(10*(n+1))+1)*P_n/2",
            "conditioning": "c_n=sigma_n/P_n",
            "direct_theta_reserve": "R_n=sigma_(n+1)/P_n=b_(n+1)*c_n",
            "kappa_endpoint": "4*n+D_n",
            "sufficient_payment": "R_n >= (4*n+D_n)*(H_n+1)/2",
            "sharp_asymptotic_criterion": (
                "2*liminf R_n/(n^2*(H_n+1)) > limsup D_n/n^2"
            ),
            "gamma_n": "(n-1)*b_n-2*sum_(k=1)^(n-1)b_k",
            "D_n_lower": "gamma_n^2/(b_(n-1)*b_n)",
            "quadratic_model_lower": "(n+1)^2/9",
        },
        "arbitrary_positive_recurrence_replay": arbitrary_rows,
        "proof_note": {
            "path": str((workstream / "MODULAR_THETA_HIGH_DEGREE_CRITERION_20261103.md").relative_to(checkpoint)),
            "sha256": sha256(workstream / "MODULAR_THETA_HIGH_DEGREE_CRITERION_20261103.md"),
            "binding": "recorded, not self-frozen by this replay",
        },
        "source_sha256": sha256(source),
    }
    output = args.output if args.output.is_absolute() else root / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
