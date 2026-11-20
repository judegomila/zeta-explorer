#!/usr/bin/env python3
"""Exact algebra/provenance audit of the net CD shifted-score reduction.

No theta quadrature, new theta rung, or all-degree sign is computed.
"""

from __future__ import annotations

import argparse
from fractions import Fraction as Q
import hashlib
import json
import math
from pathlib import Path


CHECKPOINT = "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
STREAM = "workstreams/all-degree-analytic-search-next-v1"
SOURCES = {
    f"{STREAM}/MODULAR_FULL_CONSERVATION_GAUSSIAN_BARRIER_20261103.md":
        "425b2c7347090b7af3497614f17ed4364c7bffd0b35bce7b30171c463f96e14c",
    f"{STREAM}/MODULAR_THETA_HIGH_DEGREE_CRITERION_20261103.md":
        "1ecb468d0537c6f60e64afc94939bdb415d8522d7b6cc112be4057abc8fc85cb",
    f"{STREAM}/MODULAR_EWALD_GROUPING_NEXT.md":
        "7cbcc0dd83f1417b08a54922a646be01f8eeaba58568855ff4ee26a994296b70",
    f"{STREAM}/EWALD_CORRELATED_PAIRING_NEXT.md":
        "801de61f7aa6c54401c14ef612e151f7b33f5228694323a2ec227eef51495402",
    f"{STREAM}/JOINT_ORBIT_SCORE_NEXT.md":
        "ea20400dca0c99f4d3617a1f9f8d513322c1d683763fa4b35d9973ebb4acf819",
    f"{STREAM}/ENLARGED_SCORE_PROJECTION_NEXT.md":
        "2576e464c25c547d0a1a202e4d62e64bd80a96aef444e4562799d3450a96dd43",
    "evidence/v20-v26-continuation/modular_cd_flux_v1/NORMALIZED_LIMIT.md":
        "d0f4b2c61364270c71515caaa421a10a29683ddaedbc779ecd36db485cac08af",
    "evidence/v20-v26-continuation/modular_cd_flux_v1/MODULAR_REFLECTION.md":
        "f835812a94fea49975530614dafe600449596d8e579fe2cacfef53a052cdd4e3",
}


def add(a: list[Q], b: list[Q]) -> list[Q]:
    return [
        (a[j] if j < len(a) else Q(0))
        + (b[j] if j < len(b) else Q(0))
        for j in range(max(len(a), len(b)))
    ]


def scale(a: list[Q], c: Q | int) -> list[Q]:
    return [Q(c) * x for x in a]


def shift(a: list[Q], degree: int = 1) -> list[Q]:
    return [Q(0)] * degree + a


def mul(a: list[Q], b: list[Q]) -> list[Q]:
    result = [Q(0)] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            result[i + j] += x * y
    return result


def derivative(a: list[Q]) -> list[Q]:
    return [j * a[j] for j in range(1, len(a))] or [Q(0)]


def clean(a: list[Q]) -> list[Q]:
    a = a[:]
    while len(a) > 1 and not a[-1]:
        a.pop()
    return a


def jet_product(a: list[Q], b: list[Q], c: Q = Q(1)) -> dict[tuple[int, int], Q]:
    """Product of linear forms in independent spatial jets psi^(j)."""
    result: dict[tuple[int, int], Q] = {}
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            key = tuple(sorted((i, j)))
            result[key] = result.get(key, Q(0)) + c * x * y
    return {key: value for key, value in result.items() if value}


def add_forms(a: dict, b: dict) -> dict:
    result = dict(a)
    for key, value in b.items():
        result[key] = result.get(key, Q(0)) + value
    return {key: value for key, value in result.items() if value}


def cd_audit(n: int) -> dict:
    betas = [Q(0)] + [Q(j * j + 2, j + 1) for j in range(1, n + 1)]
    sigmas = [Q(7, 11)]
    for b in betas[1:]:
        sigmas.append(sigmas[-1] * b)
    polys = [[Q(1)], [Q(0), Q(1)]]
    for j in range(1, n + 1):
        polys.append(add(shift(polys[j]), scale(polys[j - 1], betas[j])))
    left: dict = {}
    for j in range(n + 1):
        left = add_forms(left, jet_product(polys[j], shift(polys[j]), 2 / sigmas[j]))
    right = jet_product(polys[n], polys[n + 1], 2 / sigmas[n])
    if left != right:
        raise AssertionError(f"diagonal CD identity failed at n={n}")
    return {"n": n, "independent_jet_coefficients": len(right), "exact": True}


def half_gaussian_integral(a: list[Q]) -> tuple[Q, Q]:
    """Integral_0^infinity a(x)e^(-x^2)dx = r + p*sqrt(pi)."""
    rational = Q(0)
    sqrt_pi = Q(0)
    for j, coefficient in enumerate(a):
        if j % 2:
            rational += coefficient * Q(math.factorial((j - 1) // 2), 2)
        else:
            k = j // 2
            sqrt_pi += coefficient * Q(math.factorial(2 * k), 2 * 4**k * math.factorial(k))
    return rational, sqrt_pi


def hermites(maximum: int) -> list[list[Q]]:
    polys = [[Q(1)], [Q(0), Q(1)]]
    for j in range(1, maximum):
        polys.append(add(shift(polys[j]), scale(polys[j - 1], Q(-j, 2))))
    return polys


def shifted_gaussian_audit(n: int, polys: list[list[Q]]) -> dict:
    p = polys[n]
    pn = polys[n + 1]
    g = scale(p, n + 1)
    unshifted = add(g, scale(shift(pn), -2))
    v = shift(p)
    # t=1/sqrt(c). The square gap has no t^2 term.
    coefficient_0 = half_gaussian_integral(add(mul(unshifted, unshifted), scale(mul(g, g), -1)))
    coefficient_1 = half_gaussian_integral(scale(mul(v, add(unshifted, g)), -2))
    coefficient_2 = clean(add(mul(v, v), scale(mul(v, v), -1)))
    qn = Q(math.factorial(n), 2**n)
    es = []
    for j in range(n + 1):
        half = half_gaussian_integral(shift(mul(polys[j], polys[j])))
        if half[1]:
            raise AssertionError("x P_j^2 must have rational half integral")
        es.append(Q(2 ** (j + 1), math.factorial(j)) * half[0])
    aggregate = sum(es) - (n + 1) * es[n]
    expected_0 = (Q(0), qn * Q(n + 1, 2))
    expected_1 = (2 * qn * aggregate, Q(0))
    if coefficient_0 != expected_0 or coefficient_1 != expected_1 or coefficient_2 != [0]:
        raise AssertionError(f"shifted-score Gaussian identity failed at n={n}")

    # The integration-by-parts score correlation is a polynomial identity.
    r = add(shift(p), derivative(p))
    lhs = add(scale(mul(derivative(pn), r), -1), derivative(mul(pn, r)))
    if clean(lhs) != clean(mul(pn, derivative(r))):
        raise AssertionError("division-free score correlation identity failed")
    return {
        "n": n,
        "coefficient_t0_sqrt_pi": str(coefficient_0[1]),
        "coefficient_t1_rational": str(coefficient_1[0]),
        "coefficient_t2": "0",
        "hermite_absolute_moment_e_n": str(es[n]),
        "aggregate_A_n": str(aggregate),
        "normalization": "sigma_n*W_n=c^(n-1/2)*(coefficient_t0+coefficient_t1/sqrt(c))",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()
    observed = {}
    for relative, expected in SOURCES.items():
        actual = hashlib.sha256((root / CHECKPOINT / relative).read_bytes()).hexdigest()
        if actual != expected:
            raise AssertionError(f"source hash mismatch: {relative}: {actual}")
        observed[relative] = actual

    # These finite algebra audits verify formulas whose proofs telescope for
    # arbitrary n. They contain no actual-theta degree evidence.
    cd_rows = [cd_audit(n) for n in (0, 1, 2, 7)]
    polys = hermites(16)
    gaussian_rows = [shifted_gaussian_audit(n, polys) for n in (0, 1, 3, 15)]
    a15 = Q(gaussian_rows[-1]["aggregate_A_n"])
    if a15 != Q(-66495, 2048):
        raise AssertionError("frozen Gaussian aggregate mismatch")
    # W_15(c=20)=160+2 sqrt(20/pi) A15. pi<22/7 suffices.
    gap = a15 * a15 - Q(7040, 7)
    if gap != Q(1423195015, 29360128) or gap <= 0:
        raise AssertionError("known Gaussian negative net target lost")

    payload = {
        "schema_version": "zsv.theta_net_cd_shifted_score.20261103.v1",
        "status": "PASS",
        "scope": "Exact all-degree identity reduction and algebra audits; no actual-theta payment sign, theta degree sweep, or RH claim",
        "source_sha256": observed,
        "diagonal_cd_exact_jet_audits": cd_rows,
        "shifted_score_exact_gaussian_audits": gaussian_rows,
        "identities": {
            "K_prime": "2 F_n F_(n+1)/sigma_n",
            "net_correlation": "4/sigma_n * int_0^infinity h(F_(n+1)-F_n) T_(n+1)(D)(h psi) dh",
            "net_square_difference": "(||2hF_(n+1)+G-|h|F_n||^2-||G+|h|F_n||^2)/(2 sigma_n)",
            "shifted_projection_sufficient": "y^T K^(-1)y >= ||G+|h|F_n||^2",
            "net_ewald_source": "J_n(x)=4/sigma_n * int_0^infinity h(F_(n+1)-F_n) T_(n+1)(D)(h sigma_x) dh",
        },
        "known_generic_barrier_replayed": {
            "n": 15,
            "c": 20,
            "net_target": "160-(66495/1024)*sqrt(20/pi)<0",
            "rational_squared_gap": str(gap),
        },
        "actual_theta_pointwise_obstruction": {
            "n": 0,
            "integrand_without_positive_h_factor_center_limit": "-psi(0)^2<0",
            "reason": "evenness psi'(0)=0 and psi(0)>0; no quadrature",
        },
        "remaining_blocker": "Source-specific signed complete-theta lower bound for the shifted projection, joint orbit correlation, or net Ewald curvature placement; no such bound proved",
        "next_pivot_sign_caveat": "W_n>=0 implies the next pivot nonnegative only on the branch C_n<=0",
    }
    output = args.output if args.output.is_absolute() else root / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"status": "PASS", "output": str(output), "source_hashes": len(observed), "theta_rungs_computed": 0}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
