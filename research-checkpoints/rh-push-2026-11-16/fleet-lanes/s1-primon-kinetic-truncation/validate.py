#!/usr/bin/env python3
"""Validation of psums.c against an independent direct computation (numpy float64 and mpmath 30 digits)."""
import sys, numpy as np, mpmath as mp
from lib import *
binf, jsonf, sfile, seed = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
R = Run(binf, jsonf); Pmax = int(R.P[-1]); pr = primes_upto(Pmax); print("Pmax", Pmax, "pi", len(pr), "C count", R.cnt[-1])
S = set(int(x) for x in open(sfile).read().split())
cls = np.zeros((len(pr), NCLS)); cls[:, 0] = 1; cls[:, 1] = (pr % 4 == 3)
cls[:, 2] = [rsign(int(p), seed) for p in pr]; cls[:, 3] = [int(p) in S for p in pr]; cls[:, 4] = (pr % 3 == 2); cls[:, 5] = [rsign(int(p), seed + 1) for p in pr]
assert (cls.sum(0).astype(int) == R.cnt[-1]).all(), (cls.sum(0), R.cnt[-1])
L = np.log(pr.astype(float)); worst = 0
rng = np.random.default_rng(1)
for ip in rng.choice(R.npts, size=min(40, R.npts), replace=False):
    p = R.pts[ip]; s = complex(p["re"], p["im"]); x = np.exp(-s * L); m = p["mask"]
    ref = {}
    if m & 1: ref[0] = L * x; ref[1] = L * L * x
    if m & 2: ref[2] = L * x / (1 - x); ref[3] = L * x / (1 + x); ref[4] = L * L * x / (1 - x) ** 2; ref[5] = L * L * x / (1 + x) ** 2
    if m & 4: ref[6] = -np.log(abs(1 - x)); ref[7] = -np.log(abs(1 + x))
    for kk in (len(R.P) - 1, len(R.P) // 2):
        sel = pr <= R.P[kk]
        for q, v in ref.items():
            for c in range(NCLS):
                a = (v[sel] * cls[sel, c]).sum(); b = R.D[kk, ip, c, q]
                err = abs(a - b) / max(1.0, abs(a)); worst = max(worst, err)
print("float64 direct vs C: worst relative difference over sampled points/classes/quantities:", worst)
# mpmath 30-digit check of two entries
mp.mp.dps = 30
for tag, q in (("T1:1.0", 4), ("T2:0.05", 2)):
    if tag not in R.tag: continue
    s = mp.mpf(R.s(tag).real); tot = mp.mpf(0)
    for p in pr:
        l = mp.log(int(p)); x = mp.power(int(p), -s)
        tot += l * l * x / (1 - x) ** 2 if q == 4 else l * x / (1 - x)
    print(tag, "q", q, "mp:", mp.nstr(tot, 20), "C:", repr(R.q(tag, 0, q)[-1].real), "diff", mp.nstr(tot - mp.mpf(R.q(tag, 0, q)[-1].real), 5))
# known values: node statement offset(1e7) = -0.18389 (if reached), pi(x; 4, 3)
k = R.q("T1:1.0", 0, 4).real
for P, K in zip(R.P, k):
    if P in (1e4, 1e5, 1e6, 1e7): print("offset(%g) = %.6f" % (P, K - np.log(P) ** 2 / 2))
