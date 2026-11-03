#!/usr/bin/env python3
"""Non-rigorous diagnostic for fully assembled actual Ewald cells.

This intentionally evaluates the correlated scalar cell only after the
complete Xi leg and the actual residual polynomial have been assembled.  It
is a convergence probe, not an interval certificate.
"""

import argparse
from decimal import Decimal, getcontext
from fractions import Fraction
import hashlib
import json
import math
from pathlib import Path
import sys

import mpmath as mp
import numpy as np


def verify_exact_identities():
    """Exact rational checks of (4), (5), (8), and (10) in the note."""
    checks = 0
    for z in (Fraction(1, 2), Fraction(3, 5), Fraction(4, 5)):
        for a, b in (
            ([2, 0, 3, 1], [0, 5, 0, 2]),
            ([1, 4, 0, 7], [3, 0, 2, 0]),
            ([9, 1, 2, 0], [0, 2, 3, 4]),
        ):
            P = sum(Fraction(x) * z**(i + 1) for i, x in enumerate(a))
            N = sum(Fraction(x) * z**(i + 1) for i, x in enumerate(b))
            Pp = sum(Fraction(i + 1) * x * z**i for i, x in enumerate(a))
            Np = sum(Fraction(i + 1) * x * z**i for i, x in enumerate(b))
            D = Pp * N - P * Np
            pair = sum(Fraction(i - j) * a[i - 1] * b[j - 1] * z**(i + j - 1)
                       for i in range(1, len(a) + 1) for j in range(1, len(b) + 1))
            assert D == pair
            C = Fraction(3, 2) * sum(map(Fraction, a + b))
            W1 = (C - 2 * N) * Pp - (C - 2 * P) * Np
            assert W1 == C * (Pp - Np) - 2 * D
            tails_a = [sum(Fraction(a[i]) * z**(i + 1) for i in range(k - 1, len(a)))
                       for k in range(1, len(a) + 1)]
            tails_b = [sum(Fraction(b[i]) * z**(i + 1) for i in range(k - 1, len(b)))
                       for k in range(1, len(b) + 1)]
            assert -z * D == sum(P * bk - N * ak for ak, bk in zip(tails_a, tails_b))
            if P and N:
                ep = z * Pp / P
                en = z * Np / N
                assert D == P * N * (ep - en) / z
            checks += 4
    return checks


def actual_profiles(certificate):
    getcontext().prec = 70
    moments = []
    for j, (left, right) in enumerate(certificate["moments"]):
        midpoint = (Decimal(left) + Decimal(right)) / Decimal(2)
        moments.append(midpoint / (Decimal(4) ** j))
    m = [float(x) for x in moments]
    c2 = m[1] / m[0]
    c3 = m[2] / m[1]
    det_even = m[0] * m[2] - m[1] ** 2
    a4 = (m[1] * m[2] - m[0] * m[3]) / det_even
    b4 = (m[1] * m[3] - m[2] ** 2) / det_even
    det_odd = m[1] * m[3] - m[2] ** 2
    a5 = (m[2] * m[3] - m[1] * m[4]) / det_odd
    b5 = (m[2] * m[4] - m[3] ** 2) / det_odd
    profiles = {
        "kappa1_t": [0.0, 1.0],
        "kappa2_t2_minus_c": [c2 * c2, -2 * c2, 1.0],
        "kappa3_t_times_t2_minus_c": [0.0, c3 * c3, -2 * c3, 1.0],
        "kappa4_actual": [b4 * b4, 2 * a4 * b4,
                           a4 * a4 + 2 * b4, 2 * a4, 1.0],
        "kappa5_actual": [0.0, b5 * b5, 2 * a5 * b5,
                           a5 * a5 + 2 * b5, 2 * a5, 1.0],
    }
    return moments, profiles, {"c2": c2, "c3": c3, "a4": a4, "b4": b4,
                                "a5": a5, "b5": b5}


def compute_basis(nodes, nmax, tmax, dps):
    mp.mp.dps = dps
    xg, wg = np.polynomial.legendre.leggauss(nodes)
    ts = (xg + 1.0) * tmax / 2.0
    weights = wg * tmax / 2.0
    lnpi = mp.log(mp.pi)
    xi = np.empty((nodes, 3), dtype=np.float64)
    kpack = []
    for r, tf in enumerate(ts):
        t = mp.mpf(float(tf))
        s = mp.mpf("0.5") - 1j * t
        k = s * (s - 1) * mp.power(mp.pi, -s / 2) * mp.gamma(s / 2)
        l1 = 1 / s + 1 / (s - 1) - lnpi / 2 + mp.digamma(s / 2) / 2
        l2 = -1 / s**2 - 1 / (s - 1)**2 + mp.polygamma(1, s / 2) / 4
        zeta = mp.zeta(s)
        zeta1 = mp.diff(mp.zeta, s)
        zeta2 = mp.diff(mp.zeta, s, 2)
        f = k * zeta
        fs = k * (l1 * zeta + zeta1)
        fss = k * ((l1**2 + l2) * zeta + 2 * l1 * zeta1 + zeta2)
        xi[r] = [float(mp.re(f) / 2), float(mp.re(-1j * fs) / 2),
                 float(mp.re(-fss) / 2)]
        kpack.append((s, k, l1, l2))

    def dcell(s, n):
        if n == 1:
            return 1 - 1 / (1 - s)
        nn = mp.mpf(n)
        return nn ** (-s) - (nn ** (1 - s) - mp.mpf(n - 1) ** (1 - s)) / (1 - s)

    cells = np.empty((nmax, 6), dtype=np.float64)
    for n in range(1, nmax + 1):
        band = np.empty(nodes, dtype=np.float64)
        for r, (s, k, l1, l2) in enumerate(kpack):
            d0 = dcell(s, n)
            d1 = mp.diff(lambda u: dcell(u, n), s)
            d2 = mp.diff(lambda u: dcell(u, n), s, 2)
            g = k * d0
            gs = k * (l1 * d0 + d1)
            gss = k * ((l1**2 + l2) * d0 + 2 * l1 * d1 + d2)
            c, cp, cpp = float(mp.re(g) / 2), float(mp.re(-1j * gs) / 2), float(mp.re(-gss) / 2)
            x, xp, xpp = xi[r]
            band[r] = xp * cp - (x * cpp + xpp * c) / 2
        for j in range(6):
            cells[n - 1, j] = (2 / math.pi) * np.dot(weights, band * ts ** (2 * j))
    return cells


def profile_report(cells, coefficients, exact_endpoint):
    e = cells[:, :len(coefficients)] @ np.asarray(coefficients)
    indices = np.arange(1, len(e) + 1)
    pos, neg = np.maximum(e, 0), np.maximum(-e, 0)
    samples = []
    total_variation = float(np.sum(np.abs(e)))
    for z in (0.5, 0.6, 0.75, 0.9, 1.0):
        zp = z ** indices
        P, N = float(np.dot(pos, zp)), float(np.dot(neg, zp))
        Pp = float(np.dot(indices * pos, z ** (indices - 1)))
        Np = float(np.dot(indices * neg, z ** (indices - 1)))
        D = Pp * N - P * Np
        W = (1.5 * total_variation - 2 * N) * Pp - (1.5 * total_variation - 2 * P) * Np
        samples.append({"z": z, "S_prime_truncated": Pp - Np,
                        "D_truncated": D, "W_half_truncated": W})
    return {"coefficients_of_q_squared": list(map(float, coefficients)),
            "cells": list(map(float, e)),
            "signs": "".join("+" if x > 0 else "-" if x < 0 else "0" for x in e),
            "truncated_endpoint": float(np.sum(e)),
            "exact_endpoint_from_archived_moments_midpoints": float(exact_endpoint),
            "endpoint_discrepancy": float(np.sum(e) - float(exact_endpoint)),
            "samples": samples}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--nodes", type=int, default=640)
    parser.add_argument("--nmax", type=int, default=10)
    parser.add_argument("--tmax", type=float, default=40.0)
    parser.add_argument("--dps", type=int, default=35)
    args = parser.parse_args()
    cert_path = args.checkpoint_root / "evidence/v18-curated/core_inertia_v2/actual_total_certificate.json"
    certificate = json.loads(cert_path.read_text())
    moments, profiles, parameters = actual_profiles(certificate)
    basis = compute_basis(args.nodes, args.nmax, args.tmax, args.dps)
    reports = {}
    for name, coefficients in profiles.items():
        endpoint = sum(Decimal(str(coefficients[j])) * moments[j]
                       for j in range(len(coefficients)))
        reports[name] = profile_report(basis, coefficients, endpoint)
    source_hash = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    payload = {
        "status": "PASS_DIAGNOSTIC_ONLY",
        "rigor": "non-rigorous floating Gauss-Legendre convergence probe; not a sign certificate",
        "assembly": "complete Xi and one actual residual are assembled before each scalar cell is split by sign",
        "parameters": {"nodes": args.nodes, "nmax": args.nmax,
                       "tmax": args.tmax, "mpmath_dps": args.dps,
                       "source_sha256": source_hash,
                       "certificate": str(cert_path.relative_to(args.checkpoint_root)),
                       **parameters},
        "profiles": reports,
        "exact_rational_identity_checks": verify_exact_identities(),
        "limitations": [
            "No interval quadrature or analytic Ewald-index tail is supplied.",
            "The W values use the first nmax cells and their truncated variation M.",
            "Finite Abel samples do not prove an interval inequality or an all-degree theorem.",
        ],
        "python": sys.version,
    }
    args.output.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"status": payload["status"], "profiles": {
        k: {"signs": v["signs"], "endpoint_discrepancy": v["endpoint_discrepancy"],
            "samples": v["samples"]} for k, v in reports.items()}}, indent=2))


if __name__ == "__main__":
    main()
