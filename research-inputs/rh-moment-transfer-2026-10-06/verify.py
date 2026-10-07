#!/usr/bin/env python3
"""Exact finite checks for the RH moment-transfer audit; Python standard library.

The analytic proofs are in the accompanying note. These checks do not prove RH,
the imported 7/8 theorem, or an infinite-scale cancellation estimate.
"""
from collections import defaultdict
from fractions import Fraction as Q
from pathlib import Path
import hashlib
import json
import math


def arithmetic(nmax):
    spf = list(range(nmax + 1))
    for p in range(2, math.isqrt(nmax) + 1):
        if spf[p] == p:
            for n in range(p*p, nmax + 1, p):
                if spf[n] == n:
                    spf[n] = p
    factors = [{} for _ in range(nmax + 1)]
    mu = [0] * (nmax + 1)
    mu[1] = 1
    prime_power = [0] * (nmax + 1)
    for n in range(2, nmax + 1):
        p = spf[n]
        factors[n] = dict(factors[n//p])
        factors[n][p] = factors[n].get(p, 0) + 1
        mu[n] = 0 if any(e > 1 for e in factors[n].values()) else (-1)**len(factors[n])
        if len(factors[n]) == 1:
            prime_power[n] = p
    return factors, mu, prime_power


def add(dst, src, scale=1):
    for p, v in src.items():
        dst[p] = dst.get(p, 0) + scale*v
        if dst[p] == 0:
            del dst[p]


def dirichlet_convolution(a, b, nmax):
    out = [0] * (nmax + 1)
    for d in range(1, nmax + 1):
        if a[d]:
            for m in range(1, nmax//d + 1):
                out[d*m] += a[d]*b[m]
    return out


def vaughan_check(nmax, u, v, factors, mu, powers):
    a = [0] * (nmax + 1)
    for d in range(u + 1, nmax + 1):
        if mu[d]:
            for n in range(d, nmax + 1, d):
                a[n] += mu[d]
    direct = [{} for _ in range(nmax + 1)]
    for b in range(v + 1, nmax + 1):
        p = powers[b]
        if p:
            for r in range(u + 1, nmax//b + 1):
                if a[r]:
                    add(direct[r*b], {p: a[r]})
    aa = [{} for _ in range(nmax + 1)]
    bb = [{} for _ in range(nmax + 1)]
    for d in range(1, min(u, nmax) + 1):
        if mu[d]:
            for m in range(1, nmax//d + 1):
                add(aa[d*m], factors[m], mu[d])
            for b in range(2, min(v, nmax//d) + 1):
                if powers[b]:
                    for n in range(d*b, nmax + 1, d*b):
                        add(bb[n], {powers[b]: mu[d]})
    mismatches_if_B_omitted = 0
    for n in range(1, nmax + 1):
        expected = {powers[n]: 1} if powers[n] and n > v else {}
        add(expected, aa[n], -1)
        if expected != direct[n]:
            mismatches_if_B_omitted += 1
        add(expected, bb[n])
        assert expected == direct[n], (u, v, n)
    if v >= 2:
        assert mismatches_if_B_omitted > 0
    return {"U": u, "V": v, "coefficients_checked": nmax,
            "negative_control_mismatches": mismatches_if_B_omitted}


def poly_add(a, b):
    out = [Q(0)] * max(len(a), len(b))
    for i, x in enumerate(a): out[i] += x
    for i, x in enumerate(b): out[i] += x
    return out


def poly_mul(a, b):
    out = [Q(0)] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b): out[i+j] += x*y
    return out


def pole_checks():
    rows = []
    for multiplicity in range(1, 7):
        p = [Q(0)]*multiplicity + [Q(1), Q(2), Q(1)]
        dp = [Q(i)*p[i] for i in range(1, len(p))]
        m, ell = [Q(2), Q(-3), Q(5)], [Q(7), Q(11)]
        num = [-x for x in dp]
        num = poly_add(num, [-x for x in poly_mul(ell, p)])
        num = poly_add(num, poly_mul(poly_mul(m, p), dp))
        num = poly_add(num, poly_mul(poly_mul(m, ell), poly_mul(p, p)))
        assert all(x == 0 for x in num[:multiplicity-1])
        assert num[multiplicity-1] == -multiplicity
        assert p[multiplicity] == 1
        rows.append({"zero_multiplicity": multiplicity, "residue": -multiplicity})
    return rows


def norm_lift_checks(nmax, mu):
    chi = [0 if n % 3 == 0 else (1 if n % 3 == 1 else -1)
           for n in range(nmax + 1)]
    mu_chi = [mu[n]*chi[n] for n in range(nmax + 1)]
    mu_field = dirichlet_convolution(mu, mu_chi, nmax)
    recovered = dirichlet_convolution(mu_field, chi, nmax)
    assert recovered == mu
    ideals = dirichlet_convolution([0] + [1]*nmax, chi, nmax)
    identity = dirichlet_convolution(mu_field, ideals, nmax)
    assert identity[1] == 1 and all(x == 0 for x in identity[2:])
    assert mu_field[2] == 0 != mu[2]
    assert mu_field[7] == -2 != mu[7]
    assert mu_field[4] == -1 and mu_field[49] == 1
    return {"coefficients_checked": nmax,
            "examples": [{"n": n, "mu_Q": mu[n], "mu_Eisenstein_norm": mu_field[n],
                          "recovered_mu": recovered[n]} for n in [2,3,4,7,9,13,49]],
            "naive_identification_rejected": True}


def exponent_checks():
    # r=1, closure of the two admissibility inequalities. Strict margins can
    # only increase these exponents. The note gives the proof for every z>=0.
    rows = []
    for z in [Q(j,60) for j in range(121)]:
        m = max(1 + 2*z, (2 + 8*z)/3)
        raw = (1 + m-z)/2
        amplified = (1 + Q(5,6)*m-z)/2
        piece = Q(11,12)+z/3 if z <= Q(1,2) else Q(7,9)+Q(11,18)*z
        assert amplified == piece and amplified >= Q(11,12)
        assert raw >= 1
        rows.append((z, raw, amplified))
    assert min(x[2] for x in rows) == Q(11,12) > Q(7,8)
    for beta in [Q(7,8), Q(4,5), Q(3,4)]:
        for u in [Q(j,100) for j in range(1,100)]:
            assert (beta-Q(1,2))*u+(beta-Q(1,2))*(1-u) == beta-Q(1,2)
    # The idealized amplifier worksheet grants perfect transfer of the mark
    # through sixth-power copies. It is not asserted as a new combined theorem.
    return {"raw_single_row_infimum": "1", "sixth_power_infimum": "11/12",
            "imported_zero_bound": "7/8", "energy_bound": "3/4",
            "closure_parameter_samples": len(rows),
            "combined_mark_worksheet_is_optimistic_model": True,
            "balanced_product_has_no_exponent_contraction": True}


def main():
    nmax = 8192
    factors, mu, powers = arithmetic(nmax)
    checks = [vaughan_check(nmax, u, v, factors, mu, powers)
              for u,v in [(1,1),(3,5),(17,17),(31,11),(127,127)]]
    out = {"status": "PASS", "arithmetic": "exact integers and rational numbers",
           "RH_proved": False, "new_zero_free_region_proved": False,
           "imported_Lean_build_run": False,
           "vaughan_coefficients": checks, "pole_residues": pole_checks(),
           "norm_lift": norm_lift_checks(nmax, mu), "exponents": exponent_checks()}
    here = Path(__file__).resolve().parent
    out["source_sha256"] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    (here/'verification.json').write_text(json.dumps(out, indent=2)+'\n')
    print(json.dumps({"status":out['status'], "Vaughan_coefficients":5*nmax,
                      "norm_lift_coefficients":nmax, "pole_cases":6,
                      "new_zero_free_region_proved":False}, indent=2))


if __name__ == '__main__':
    main()
