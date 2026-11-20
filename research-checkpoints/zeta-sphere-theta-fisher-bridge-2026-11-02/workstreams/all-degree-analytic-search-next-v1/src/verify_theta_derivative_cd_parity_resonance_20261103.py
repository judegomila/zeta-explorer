#!/usr/bin/env python3
"""Exact algebra audit; no theta quadrature or theta-pivot extrapolation."""

from __future__ import annotations

import argparse
from fractions import Fraction as Q
import hashlib
import json
from math import comb, factorial
from pathlib import Path


CHECKPOINT = "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
WORKSTREAM = "workstreams/all-degree-analytic-search-next-v1"
STEM = "theta_derivative_cd_parity_resonance_20261103"
SOURCES = {
    f"{WORKSTREAM}/MODULAR_THETA_HIGH_DEGREE_CRITERION_20261103.md":
        "1ecb468d0537c6f60e64afc94939bdb415d8522d7b6cc112be4057abc8fc85cb",
    "evidence/v20-v26-continuation/modular_cd_flux_v1/NORMALIZED_LIMIT.md":
        "d0f4b2c61364270c71515caaa421a10a29683ddaedbc779ecd36db485cac08af",
    "evidence/v20-v26-continuation/modular_cd_flux_v1/MODULAR_REFLECTION.md":
        "f835812a94fea49975530614dafe600449596d8e579fe2cacfef53a052cdd4e3",
    f"{WORKSTREAM}/THETA_TURAN_NEXT.md":
        "722a5ec66b1ee984b5f28769f3a6a7b28824eeed4709d3461c2d03d47b853a19",
    f"{WORKSTREAM}/MODULAR_GAUSSIAN_STRONG_PAYMENT_BARRIER_20261103.md":
        "6dfb042d62b594bc93c73f3db36d9dfea7a177f535b77f85d1062fe5bfd0f539",
    f"{WORKSTREAM}/PRIOR_DERIVATIVE_SUPERGAUSSIAN_BARRIER_NEXT.md":
        "3cd55aaf03ef221f380fac945b9b1d3286f980723c5a34b2460c2f267c960bd7",
}


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def add(a: list[Q], b: list[Q]) -> list[Q]:
    out = [Q(0)] * max(len(a), len(b))
    for j, v in enumerate(a):
        out[j] += v
    for j, v in enumerate(b):
        out[j] += v
    while len(out) > 1 and not out[-1]:
        out.pop()
    return out


def scale(a: list[Q], c: Q) -> list[Q]:
    return [c * v for v in a]


def mul(a: list[Q], b: list[Q]) -> list[Q]:
    out = [Q(0)] * (len(a) + len(b) - 1)
    for i, v in enumerate(a):
        for j, w in enumerate(b):
            out[i + j] += v * w
    return out


def deriv(a: list[Q]) -> list[Q]:
    return [j * a[j] for j in range(1, len(a))] or [Q(0)]


def recurrence(b: list[Q], spectral: bool = False) -> tuple[list[list[Q]], list[Q]]:
    pol = [[Q(1)], [Q(0), Q(1)]]
    sig = [Q(1)]
    for j in range(1, len(b)):
        sig.append(sig[-1] * b[j])
        sign = -1 if spectral else 1
        pol.append(add([Q(0), *pol[j]], scale(pol[j - 1], sign * b[j])))
    return pol, sig


def expand(a: list[Q], basis: list[list[Q]]) -> list[Q]:
    out = [Q(0)] * len(a)
    residue = a[:]
    for j in range(len(a) - 1, -1, -1):
        out[j] = residue[j]
        for k, v in enumerate(basis[j]):
            residue[k] -= out[j] * v
    assert not any(residue)
    return out


def row(n: int, pol: list[list[Q]], sig: list[Q]) -> tuple[list[Q], Q]:
    coeff = expand(deriv(pol[n + 1]), pol)
    assert coeff[n] == n + 1
    assert all(not coeff[j] for j in range(n + 1) if (n - j) % 2)
    cost = sum((coeff[j] ** 2 * sig[j] / sig[n] for j in range(n)), Q(0))
    return coeff, cost


def center_audit(b: list[Q], label: str) -> list[dict[str, str | int]]:
    pol, sig = recurrence(b)
    pair, kernel = Q(1), Q(1)
    rows = []
    for m in range(1, (len(b) - 1) // 2 + 1):
        pair *= b[2 * m] / b[2 * m - 1]
        previous_kernel = kernel
        kernel += 1 / pair
        coeff, cost = row(2 * m, pol, sig)
        # Squared identities avoid all approximate square roots.
        center = deriv(pol[2 * m + 1])[0]
        assert center * pol[2 * m][0] / sig[2 * m] == kernel
        assert center ** 2 / sig[2 * m] == pair * kernel ** 2
        residue = center - (2 * m + 1) * pol[2 * m][0]
        lower = (pair * kernel - (2 * m + 1)) ** 2 / (pair * previous_kernel)
        assert residue ** 2 / sig[2 * m] / previous_kernel == lower
        assert cost >= lower
        entry = {"m": m, "D_2m": str(cost), "center_CD_lower": str(lower)}
        if label == "parity_countermodel":
            wallis = Q(4 ** m, comb(2 * m, m))
            assert pair == (m + 1) ** 2 * wallis ** 2
            assert wallis ** 2 >= 3 * m + 1
            assert kernel <= 2
            assert pair >= 4 * (2 * m + 1)
            theorem_lower = Q(9, 32) * (m + 1) ** 2 * (3 * m + 1)
            assert lower >= theorem_lower
            entry["all_degree_cubic_lower"] = str(theorem_lower)
        rows.append(entry)
    return rows


def gaussian_moment(k: int) -> Q:
    """Integral t^k exp(-t^2) dt, divided by sqrt(pi)."""
    if k % 2:
        return Q(0)
    m = k // 2
    return Q(factorial(2 * m), 4 ** m * factorial(m))


def gaussian_integral(p: list[Q]) -> Q:
    return sum((v * gaussian_moment(k) for k, v in enumerate(p)), Q(0))


def gaussian_source_audit() -> list[dict[str, str | int]]:
    # Choose Xi=exp(-t^2/2), so f=exp(-t^2), f''=(4t^2-2)f.
    # Strip the single common positive factor (2/pi)*sqrt(pi) from B.
    # Payment is affine in the physical half-line quantity Q_n, so audit
    # its constant and coefficient separately, without approximating Q_n.
    b = [Q(0), *[Q(k, 2) for k in range(1, 12)]]
    pol, sig = recurrence(b, spectral=True)
    f_second_factor = [Q(-2), Q(0), Q(4)]
    rows = []
    for n in range(1, 10):
        p = pol[n + 1]
        p_prime = deriv(p)
        energy = gaussian_integral(mul(p_prime, p_prime))
        source_second = gaussian_integral(mul(mul(p, p), f_second_factor))
        next_source = gaussian_integral(mul(p, p))
        assert gaussian_integral(mul(p, deriv(p_prime))) == 0
        assert source_second == 2 * energy
        assert energy / sig[n] == (n + 1) ** 2
        assert next_source == sig[n + 1]
        kappa = 4 * n
        # Constant/coefficient comparison in sigma_next-kappa*Q.
        correlated_Q_coefficient = -source_second / (2 * sig[n]) + (n - 1) ** 2
        assert correlated_Q_coefficient == -kappa
        rows.append({"n": n, "derivative_energy_over_sigma_n": str(energy / sig[n]),
                     "f_second_source": str(source_second),
                     "payment_Q_coefficient": str(correlated_Q_coefficient)})
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()
    checkpoint = root / CHECKPOINT
    source = Path(__file__).resolve()
    workstream = checkpoint / WORKSTREAM
    assert source.parent.parent == workstream
    frozen = {}
    for relative, expected in SOURCES.items():
        actual = sha(checkpoint / relative)
        assert actual == expected, f"Source changed: {relative}: {actual}"
        frozen[relative] = actual

    quadratic_rows = []
    c = Q(7, 3)
    b = [Q(0), *[c * k * k for k in range(1, 21)]]
    pol, sig = recurrence(b)
    for n in range(1, 20):
        coeff, cost = row(n, pol, sig)
        for r in range(n // 2 + 1):
            j = n - 2 * r
            expected = Q(factorial(n + 1), (2 * r + 1) * factorial(j)) * c ** r
            assert coeff[j] == expected
            assert coeff[j] ** 2 * sig[j] / sig[n] == Q((n + 1) ** 2, (2 * r + 1) ** 2)
        expected_cost = (n + 1) ** 2 * sum((Q(1, (2 * r + 1) ** 2)
                                                          for r in range(1, n // 2 + 1)), Q(0))
        assert cost == expected_cost
        assert cost < Q((n + 1) ** 2, 4)
        quadratic_rows.append({"n": n, "D_n": str(cost), "D_n_over_n_squared": str(cost / n ** 2)})

    arbitrary = [Q(0), *map(Q, [2, 7, 5, 11, 13, 17, 19, 23, 29, 31])]
    arbitrary_rows = center_audit(arbitrary, "arbitrary")
    parity = [Q(0)]
    for j in range(1, 13):
        parity.extend([Q((2 * j - 1) ** 2 * j, j + 1), Q((2 * j) ** 2 * (j + 1), j)])
    parity_rows = center_audit(parity, "parity_countermodel")

    # Exact polynomial identity proving the Wallis induction for every m.
    m_squared = [Q(0), Q(0), Q(4)]
    first = mul(m_squared, [Q(-2), Q(3)])
    second = mul(mul([Q(-1), Q(2)], [Q(-1), Q(2)]), [Q(1), Q(3)])
    assert add(first, scale(second, Q(-1))) == [Q(-1), Q(1)]

    note = workstream / "THETA_DERIVATIVE_CD_PARITY_RESONANCE_20261103.md"
    result = {
        "schema_version": "zsv.theta_derivative_cd_parity_resonance.20261103.v1",
        "status": "PASS",
        "scope": "Exact recurrence/source identities and non-theta parity countermodel; actual-theta upper bound and payment remain open; no RH claim",
        "frozen_sources": frozen,
        "exact_formulas": {
            "actual_theta_endpoint_normalization": "sigma[p]=(2/pi)*integral p^2*(Xi'^2-Xi*Xi'')",
            "derivative_source": "(n+1)^2+D_n=integral p_(n+1)^2*f''/(pi*sigma_n)",
            "correlated_payment_margin": "(2/pi)*integral p_(n+1)^2*(f-Q_n*f''/(2*sigma_n))+(n-1)^2*Q_n",
            "quadratic_full_row": "d_(n,n-2r)=(n+1)/(2r+1)",
            "quadratic_limit": "pi^2/8-1",
            "center_CD_lower": "D_(2m)>=(Pi_m*K_m-(2m+1))^2/(Pi_m*K_(m-1))",
            "countermodel": "b_(2j-1)=(2j-1)^2*j/(j+1); b_(2j)=(2j)^2*(j+1)/j",
            "countermodel_cubic_lower": "D_(2m)>=(9/32)*(m+1)^2*(3m+1)",
            "Wallis_induction_identity": "4*m^2*(3*m-2)-(2*m-1)^2*(3*m+1)=m-1",
        },
        "quadratic_exact_replay": quadratic_rows,
        "arbitrary_positive_recurrence_center_replay": arbitrary_rows,
        "parity_countermodel_exact_replay": parity_rows,
        "gaussian_source_identity_replay": gaussian_source_audit(),
        "limitations": [
            "No actual-theta recurrence asymptotic or derivative upper bound is established",
            "The parity countermodel has a square-summable Jacobi zero mode and is not a theta source",
            "The correlated payment identity is not a proof of its nonnegative sign",
            "Finite exact replays audit algebra; all-degree claims use the analytic note's proofs",
        ],
        "note": {"path": str(note.relative_to(checkpoint)), "sha256": sha(note)},
        "source_sha256": sha(source),
    }
    output = args.output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"status": "PASS", "output": str(output), "receipt_sha256": sha(output)}, sort_keys=True))


if __name__ == "__main__":
    main()
