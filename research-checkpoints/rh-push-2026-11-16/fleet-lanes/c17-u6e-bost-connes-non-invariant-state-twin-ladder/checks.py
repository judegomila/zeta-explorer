#!/usr/bin/env python3
"""c17-u6e checks. mpmath 30 digits (N1, N2, N4, N5), numpy float64 (N3: partial Euler products, a screen).
Planned memory: N2 matrices 108x108 mpc (< 5 MB each); N3 sieve to 1e7 (10 MB bool + 664579 float64 x 6 < 40 MB).
Output: checks.json next to this file (absolute path)."""
import json, os, math
from fractions import Fraction
from math import gcd
import mpmath as mp
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
mp.mp.dps = 30
out = {}

def factor(n):
    f = {}; p = 2
    while p * p <= n:
        while n % p == 0: f[p] = f.get(p, 0) + 1; n //= p
        p += 1
    if n > 1: f[n] = f.get(n, 0) + 1
    return f

def ee(fr):
    fr = fr - math.floor(fr)
    return mp.expjpi(2 * mp.mpf(fr.numerator) / fr.denominator)

def perzeta(beta, r):
    """sum_k e(rk) k^-beta, Re beta > 1, r Fraction."""
    r = r - math.floor(r); a, b = r.numerator, r.denominator
    return sum(ee(Fraction(a * j, b)) * mp.zeta(beta, mp.mpf(j) / b) for j in range(1, b + 1)) / mp.mpf(b) ** beta

def direct(n, r, w, m, rp, s, K):
    # <mu_n e(r) xi_w, mu_m e(r') xi_s>, (mu_n e(r) xi_w)(n k) = e(r k) k^-w, truncated at index K
    g = gcd(n, m); L = n * m // g; tot = mp.mpc(0)
    for j in range(1, K // L + 1):
        k1 = j * L // n; k2 = j * L // m
        tot += mp.conj(ee(r * k1) * mp.mpf(k1) ** (-w)) * ee(rp * k2) * mp.mpf(k2) ** (-s)
    return tot

def n1():
    K = 60000; w = mp.mpc(1.5, 0.7); s = mp.mpc(1.5, -0.4); res = []
    for (n, r, m, rp) in [(2, Fraction(1, 3), 3, Fraction(1, 4)), (4, Fraction(1, 6), 6, Fraction(5, 9)), (1, Fraction(0), 5, Fraction(2, 7)), (6, Fraction(1, 2), 6, Fraction(1, 3))]:
        g = gcd(n, m); mm, nn = m // g, n // g
        closed = mp.mpf(mm) ** (-mp.conj(w)) * mp.mpf(nn) ** (-s) * perzeta(mp.conj(w) + s, nn * rp - mm * r)
        tot = direct(n, r, w, m, rp, s, K)
        res.append({"n": n, "r": str(r), "m": m, "rp": str(rp), "abs_diff": float(abs(tot - closed)), "abs_closed": float(abs(closed)), "tail_bound": float((mp.mpf(K) / (n * m // g)) ** -2)})
    return res
out["N1_kernel_formula"] = n1(); print("N1", out["N1_kernel_formula"], flush=True)

NS = [1, 2, 3, 4, 6, 9]; DEN = 18
WORDS = [(n, Fraction(a, DEN)) for n in NS for a in range(DEN)]
def nu_zeta(beta, rho):
    b = (rho - math.floor(rho)).denominator; v = mp.mpf(1)
    for p, k in factor(b).items():
        v *= mp.mpf(p) ** (-k * beta) * (1 - mp.mpf(p) ** (beta - 1)) / (1 - mp.mpf(1) / p)
    return v
def nu_del(beta, rho, S=(3,)):
    b = (rho - math.floor(rho)).denominator; v = mp.mpf(1)
    for p, k in factor(b).items():
        if p in S: v *= (mp.mpf(-1) / (p - 1) if k == 1 else mp.mpf(0))
        else: v *= mp.mpf(p) ** (-k * beta) * (1 - mp.mpf(p) ** (beta - 1)) / (1 - mp.mpf(1) / p)
    return v
def gram(beta, t, nu, lam):
    s = mp.mpc(beta / 2, t); N = len(WORDS); G = mp.zeros(N, N)
    for i, (n, r) in enumerate(WORDS):
        for j, (m, rp) in enumerate(WORDS):
            g = gcd(n, m); mm, nn = m // g, n // g
            G[i, j] = mp.conj(lam(mm, s)) * lam(nn, s) * nu(beta, nn * rp - mm * r)
    return G
lam_z = lambda m, s: mp.mpf(m) ** (-s)
lam_d = lambda m, s: (mp.mpc(0) if m % 3 == 0 else mp.mpf(m) ** (-s))
def mineig(G):
    herm = float(mp.mnorm(G - G.H, 1))
    E = mp.eigh((G + G.H) / 2, eigvals_only=True)
    E = [E[i] for i in range(len(E))]
    return float(min(E)), float(max(E)), herm
def tnr_conj(G, q=3, c=mp.mpf("2.05")):
    a1 = mp.sqrt(1 + c * mp.sqrt(q)); a2 = mp.sqrt(1 + c * mp.sqrt(q) + q)
    d = {Fraction(0): mp.mpf(1)}
    for j in range(q): d[Fraction(j, q)] = d.get(Fraction(j, q), 0) + (a1 - 1) / q
    for j in range(q * q): d[Fraction(j, q * q)] = d.get(Fraction(j, q * q), 0) + (a2 - a1) / (q * q)
    idx = {w: i for i, w in enumerate(WORDS)}; N = len(WORDS); C = mp.zeros(N, N)
    for (n, r), i in idx.items():
        for sh, coef in d.items():
            rr = r + sh; rr -= math.floor(rr)
            C[idx[(n, rr)], i] += coef
    return C.T * G * C
res2 = []
for beta in ["0.55", "0.75", "1"]:
    b = mp.mpf(beta); t = mp.mpf("0.9")
    Gz = gram(b, t, nu_zeta, lam_z); Gd = gram(b, t, nu_del, lam_d); Gt = tnr_conj(Gz)
    i0 = WORDS.index((1, Fraction(0))); q = 3; c = mp.mpf("2.05")
    row = {"beta": beta, "t": "0.9", "size": len(WORDS)}
    for name, G in [("zeta", Gz), ("DEL_S={3}", Gd), ("TNR_q=3_c=2.05", Gt)]:
        lo, hi, herm = mineig(G); row[name] = {"min_eig": lo, "max_eig": hi, "hermitian_defect": herm, "value_at_1": float(mp.re(G[i0, i0]))}
    row["TNR_omega(D)_minus_closed"] = float(abs(Gt[i0, i0] - (1 + c * mp.sqrt(q) * q ** (-b) + q * q ** (-2 * b))))
    res2.append(row); print("N2", row, flush=True)
out["N2_gram_eigenstates"] = res2

def n2x():
    K = 40000; s = mp.mpc(1, 0.9); worst = 0.0
    sub = [(2, Fraction(1, 18)), (3, Fraction(5, 18)), (6, Fraction(7, 18)), (9, Fraction(1, 2)), (4, Fraction(1, 3))]
    for (n, r) in sub:
        for (m, rp) in sub:
            g = gcd(n, m); mm, nn = m // g, n // g
            closed = mp.mpf(mm) ** (-mp.conj(s)) * mp.mpf(nn) ** (-s) * perzeta(mp.mpf(2), nn * rp - mm * r)
            worst = max(worst, float(abs(direct(n, r, s, m, rp, s, K) - closed)))
    return {"beta": 2, "K": K, "worst_abs_diff": worst, "tail_bound": 36.0 / K}
out["N2x_word_rule_l2"] = n2x(); print("N2x", out["N2x_word_rule_l2"], flush=True)

PMAX = 10 ** 7
print("N3 planned memory: sieve %d bytes, 664579 primes as float64 and complex128 temporaries < 60 MB" % PMAX, flush=True)
sv = np.ones(PMAX + 1, dtype=bool); sv[:2] = False
for i in range(2, int(PMAX ** 0.5) + 1):
    if sv[i]: sv[i * i::i] = False
pr = np.nonzero(sv)[0].astype(np.float64); lp = np.log(pr)
res3 = []
for beta in [0.55, 0.75, 1.0, 1.5]:
    for tau in [1.0, 14.134725141734693]:
        loc = np.log1p(-pr ** (-beta)) - np.log(np.abs(1 - pr ** (-beta) * np.exp(-1j * tau * lp)))
        cs = np.cumsum(loc); row = {"beta": beta, "tau": tau}
        for e in range(2, 8):
            k = np.searchsorted(pr, 10 ** e, side="right") - 1
            row["logF_P=1e%d" % e] = float(cs[k])
        if beta > 1: row["log(|zeta(beta+i tau)|/zeta(beta))"] = float(mp.log(abs(mp.zeta(mp.mpc(beta, tau))) / mp.zeta(beta)))
        if beta == 1.0: row["log(|zeta(1+i tau)| e^-gamma/log P) at 1e7"] = float(mp.log(abs(mp.zeta(mp.mpc(1, tau))) * mp.exp(-mp.euler) / mp.log(PMAX)))
        q = 3.0; c = 2.05
        a = [1.0, 1 + c * math.sqrt(q)] + [1 + c * math.sqrt(q) + q] * 400
        num = abs(sum(a[k] * q ** (-k * (beta + 1j * tau)) for k in range(len(a)))); den = sum(a[k] * q ** (-k * beta) for k in range(len(a)))
        zloc = (1 - q ** (-beta)) / abs(1 - q ** (-(beta + 1j * tau)))
        row["TNR_local_overlap_q=3"] = num / den; row["zeta_local_overlap_p=3"] = zloc
        row["logF_TNR_1e7"] = float(cs[-1]) + math.log(num / den) - math.log(zloc)
        row["logF_DEL{3}_1e7"] = float(cs[-1]) - math.log(zloc)
        res3.append(row); print("N3", row, flush=True)
out["N3_partial_overlaps"] = res3

def n4():
    q = mp.mpf(3); rows = []
    for c in ["2.05", "2.3", "2.5"]:
        c_ = mp.mpf(c); x = mp.acosh(c_ / 2) / mp.log(q)
        z = mp.mpc(mp.mpf(1) / 2 + x, mp.pi / mp.log(q))
        val = 1 + c_ * mp.sqrt(q) * q ** (-z) + q * q ** (-2 * z)
        rows.append({"c": c, "zero_of_local_factor": [float(z.real), float(z.imag)], "abs_value": float(abs(val)), "strip_edge_c": float(mp.sqrt(q) + 1 / mp.sqrt(q))})
    return rows
out["N4_tnr_local_zero"] = n4(); print("N4", out["N4_tnr_local_zero"], flush=True)

def n5():
    rows = []
    for beta, w in [(mp.mpf("0.75"), mp.mpc("0.6", "0.3")), (mp.mpf("1"), mp.mpc("0.45", "-0.2")), (mp.mpf("0.55"), mp.mpc("0.7", "0.1"))]:
        a, b, r = 2, 3, Fraction(1, 5); K = 300000; tot = mp.mpc(0); k = 1
        while max(b * k, a * k) <= K:
            n, m = b * k, a * k
            tot += mp.mpf(n) ** (-w) * mp.mpf(m) ** (-mp.conj(w)) * mp.mpf(n * a) ** (-beta); k += 1
        tot *= nu_zeta(beta, r); arg = 2 * w.real + beta
        closed = mp.mpf(b) ** (-w - beta) * mp.mpf(a) ** (-mp.conj(w) - beta) * nu_zeta(beta, r) * mp.zeta(arg)
        rows.append({"beta": float(beta), "w": [float(w.real), float(w.imag)], "arg_of_zeta": float(arg), "abs_diff": float(abs(tot - closed)), "abs_closed": float(abs(closed)), "tail_bound": float((mp.mpf(K) / 3) ** (1 - arg) / (arg - 1))})
    return rows
out["N5_typeIII_dirichlet_vector"] = n5(); print("N5", out["N5_typeIII_dirichlet_vector"], flush=True)
json.dump(out, open(os.path.join(HERE, "checks.json"), "w"), indent=1)
print("done")
