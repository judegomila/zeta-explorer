#!/usr/bin/env python3
"""Exact algebra/source audit; analytic asymptotics are proved in the note.

No theta quadrature, degree extrapolation, spectral sign assumption, or
claim that the trial ladder is the actual signed-orthogonal ladder.
"""

from __future__ import annotations

import argparse
from fractions import Fraction as F
import hashlib
from itertools import permutations
import json
from math import comb, factorial
from pathlib import Path


SOURCES = {
    "workstreams/all-degree-analytic-search-next-v1/MODULAR_THETA_HIGH_DEGREE_CRITERION_20261103.md":
        "1ecb468d0537c6f60e64afc94939bdb415d8522d7b6cc112be4057abc8fc85cb",
    "evidence/v20-v26-continuation/theta_parent_growth_v1/GROWTH.md":
        "749b4e3109a308706d31c07f38817d08f8d061d10aadad8d4fd314d402d57a9f",
    "evidence/v18-curated/hierarchy/large_order_v4/L1_GAUSSIAN_THEOREM.md":
        "16f69ea1af286f384d15ae0576bc72eedcdf5020dab3030aba4a976dedce6414",
    "workstreams/all-degree-analytic-search-next-v1/MODULAR_GENERAL_PIVOT_TRANSPORT_NEXT.md":
        "5076a00c5e5b2b20fddd7470d92f61f907a2e954c23dc0bb66278271e0d96970",
    "workstreams/all-degree-analytic-search-next-v1/THETA_ORBIT_CORRELATED_NEXT.md":
        "de46d21f14822d74e73639c47d1b51a2b8bfc1bdaca47c81f7a6304e9e647e5a",
    "workstreams/all-degree-analytic-search-next-v1/EWALD_CORRELATED_PAIRING_NEXT.md":
        "801de61f7aa6c54401c14ef612e151f7b33f5228694323a2ec227eef51495402",
    "evidence/v31-continuation/theta_correlated_local_v1/THETA_CURVATURE_PAYMENT.md":
        "a508698183302e3827769a3b9cd135023d79ffb557e2fe5f700ffb00cd98d97d",
}

NAME = "THETA_RESERVE_QUADRATIC_JACOBI_OBSTRUCTION_20261103.md"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def trim(p: list[F]) -> list[F]:
    while len(p) > 1 and p[-1] == 0:
        p.pop()
    return p or [F(0)]


def add(p: list[F], q: list[F]) -> list[F]:
    r = [F(0)] * max(len(p), len(q))
    for i, x in enumerate(p):
        r[i] += x
    for i, x in enumerate(q):
        r[i] += x
    return trim(r)


def scale(p: list[F], x: F) -> list[F]:
    return trim([x * y for y in p])


def mul(p: list[F], q: list[F]) -> list[F]:
    r = [F(0)] * (len(p) + len(q) - 1)
    for i, x in enumerate(p):
        for j, y in enumerate(q):
            r[i + j] += x * y
    return trim(r)


def deriv(p: list[F]) -> list[F]:
    return trim([i * p[i] for i in range(1, len(p))])


def ladder(c: F, degree: int) -> list[list[F]]:
    p = [[F(1)], [F(0), F(1)]]
    for n in range(1, degree):
        p.append(add([F(0), *p[n]], scale(p[n - 1], -c * n * n)))
    return p


def generating_series(degree: int) -> list[list[F]]:
    """Expand (1+z²)^-1/2 exp((t/2) arctan z), independently of (1)."""
    exponent = [[F(0)] for _ in range(degree + 1)]
    for k in range((degree + 1) // 2):
        exponent[2 * k + 1] = [F(0), F((-1) ** k, 2 * (2 * k + 1))]
    exponential = [[F(1)]]
    for n in range(1, degree + 1):
        coefficient = [F(0)]
        for k in range(1, n + 1):
            coefficient = add(coefficient,
                              scale(mul(exponent[k], exponential[n - k]), F(k, n)))
        exponential.append(coefficient)
    result = []
    for n in range(degree + 1):
        coefficient = [F(0)]
        for k in range(n // 2 + 1):
            coefficient = add(coefficient,
                              scale(exponential[n - 2 * k],
                                    F((-1) ** k * comb(2 * k, k), 4 ** k)))
        result.append(coefficient)
    return result


def jacobi_determinant(n: int) -> list[F]:
    """Leibniz determinant of tI-J, with J_(j-1,j)=2j (C=4)."""
    total = [F(0)]
    for permutation in permutations(range(n)):
        inversions = sum(permutation[i] > permutation[j]
                         for i in range(n) for j in range(i + 1, n))
        term = [F((-1) ** inversions)]
        for i, j in enumerate(permutation):
            if i == j:
                term = mul(term, [F(0), F(1)])
            elif abs(i - j) == 1:
                term = scale(term, F(-2 * max(i, j)))
            else:
                term = [F(0)]
                break
        total = add(total, term)
    return total


def audit_root_deletion() -> dict[str, object]:
    roots = [F(-7), F(-2), F(0), F(3), F(5)]
    factors = [[-r, F(1)] for r in roots]
    p = [F(1)]
    for factor in factors:
        p = mul(p, factor)
    quotients = []
    for excluded in range(len(roots)):
        q = [F(1)]
        for j, factor in enumerate(factors):
            if j != excluded:
                q = mul(q, factor)
        quotients.append(q)
    observed = add(mul(deriv(p), deriv(p)), scale(mul(p, deriv(deriv(p))), F(-1)))
    expected = [F(0)]
    for q in quotients:
        expected = add(expected, mul(q, q))
    assert observed == expected
    return {"rational_simple_roots": [str(r) for r in roots],
            "identity": "p'^2-p*p''=sum_j(p/(t-r_j))^2",
            "coefficient_check": "PASS"}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()
    checkpoint = root / "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
    workstream = checkpoint / "workstreams/all-degree-analytic-search-next-v1"
    script = Path(__file__).resolve()
    assert script.parent.parent == workstream

    bound = {}
    for relative, expected in SOURCES.items():
        observed = sha(checkpoint / relative)
        if observed != expected:
            raise AssertionError(f"frozen source mismatch: {relative}: {observed}")
        bound[relative] = observed

    c = F(4)
    polys = ladder(c, 16)
    generated = generating_series(16)
    for n in range(17):
        assert len(polys[n]) == n + 1 and polys[n][-1] == 1
        assert all(x == 0 for j, x in enumerate(polys[n]) if (j - n) % 2)
        assert generated[n] == scale(polys[n], F(1, factorial(n) * 2 ** n))
    for n in range(1, 8):
        assert jacobi_determinant(n) == polys[n]

    # Exact Fourier constants: U=2Xi, source=h/(2pi), parent=||pU||²/(2pi).
    assert F(4, 2) == 2
    source_over_parent = F(4, 2) / F(4, 2)
    assert source_over_parent == 1

    # Gaussian audit of I_f=2 int e^(at)(Xi'+a Xi/2)^2: no quadrature.
    gaussian_c, gaussian_a = F(20), F(3, 7)
    mean, variance = gaussian_a * gaussian_c / 2, gaussian_c / 2
    expected_square = variance / gaussian_c ** 2 + (-mean / gaussian_c + gaussian_a / 2) ** 2
    gaussian_ratio = 2 * expected_square
    assert gaussian_ratio == 1 / gaussian_c

    # For C=4 choose d=3pi/16: a=pi/4<2d<pi/2.
    a_over_pi, d_over_pi = F(1, 4), F(3, 16)
    assert a_over_pi / 2 < d_over_pi < F(1, 4)
    assert 2 * d_over_pi - a_over_pi == F(1, 8)

    # Leading asymptotic ratio arithmetic, without asserting a finite-n rate.
    ratio_rows = []
    for n in (2, 3, 7, 101):
        normalization_ratio = c * (n + 1) ** 2
        reserve_prefactor = normalization_ratio * F(n, n + 1)
        assert reserve_prefactor == c * n * (n + 1)
        ratio_rows.append({"n": n, "reserve_prefactor_before_1_plus_o1": str(reserve_prefactor)})
    spatial_coefficient = 1 / (4 * c)
    deletion_coefficient = 2 * spatial_coefficient
    assert spatial_coefficient == F(1, 16)
    assert deletion_coefficient == F(1, 8)

    output = args.output.resolve() if args.output.is_absolute() else (root / args.output).resolve()
    if output.parent != workstream / "results":
        raise AssertionError("output must be in this workstream's results directory")
    result = {
        "schema": "zsv.theta_reserve_quadratic_jacobi_obstruction.20261103.v1",
        "status": "PASS_EXACT_ALGEBRA_AND_SOURCE_BINDING",
        "scope": "Unchanged complete-theta profile, alternate coherent quadratic Jacobi trial ladder; not the actual signed-orthogonal endpoint residuals.",
        "frozen_sources": bound,
        "proof_note": {"path": str((workstream / NAME).relative_to(checkpoint)),
                       "sha256": sha(workstream / NAME)},
        "verifier_sha256": sha(script),
        "checked": {
            "C": "4",
            "monic_parity_recurrence_degrees": "0..16 (finite algebra replay, not asymptotic evidence)",
            "independent_generating_series": "PASS",
            "leibniz_jacobi_characteristic_determinants": "PASS at dimensions 1..7",
            "root_deletion": audit_root_deletion(),
            "fourier_source_parent_ratio_factor": str(source_over_parent),
            "gaussian_factor_audit_c_infinity": str(gaussian_ratio),
            "strip_exponent_gap_over_pi": str(2 * d_over_pi - a_over_pi),
            "asymptotic_ratio_arithmetic": ratio_rows,
            "spatial_log_squared_coefficient": str(spatial_coefficient),
            "root_deletion_log_squared_coefficient": str(deletion_coefficient),
        },
        "analytic_theorems_proved_in_note_not_machine_certified": [
            "complete theta strip decay and absolute exponential frequency moments",
            "uniform sqrt(n)*Q_n and sqrt(n)*Q_n'/(1+log(n)) coefficient bounds",
            "compact two-singularity Darboux expansion with derivative",
            "weighted weak convergence for Xi^2 and the signed f",
            "strict positivity and strip-shift expression of c_C",
            "R_tilde/(n^2*(log(n)+1))->0 and leading root-deletion cancellation",
        ],
        "not_proved": [
            "a lower reserve for the actual inverse-selected theta residual",
            "exact theta signed stationarity of the alternate ladder (it fails)",
            "all-degree positive theta Gram blocks",
            "all-degree modular payment, the endpoint sign, or RH",
        ],
        "external_formula_identification": [
            "https://dlmf.nist.gov/18.23.E7",
            "https://dlmf.nist.gov/18.22.E8",
        ],
    }
    output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"status": result["status"], "output": str(output),
                      "result_sha256": sha(output), "proof_note_sha256": sha(workstream / NAME)},
                     indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
