#!/usr/bin/env python3
"""Trace-side symbol, version 2 (exact spike offsets). Every mesh point is u = k log p + d, rho = p^k (1 + eps), eps = expm1(d);
the resonant differences |rho p^n - p^m| with n + k = m are evaluated as p^m |eps| (no cancellation), so spikes with large k
and non-tempered factors (power singularities |eps|^{-2 log_p|alpha|}) are resolved.  Lhat(t) = 2theta'(t) + 2Re(L'/L)(1/2+it) + deltahat(t).
usage: symbol2.py p name OUT KMAX [GLN RATIO J]"""
import sys, math, json, os, time
import numpy as np
from scipy.special import digamma
import sisum, lf
p = int(sys.argv[1]); name = sys.argv[2]; OUT = sys.argv[3]; KMAX = int(sys.argv[4])
GLN = int(sys.argv[5]) if len(sys.argv) > 5 else 12; RAT = float(sys.argv[6]) if len(sys.argv) > 6 else 2.0; J = int(sys.argv[7]) if len(sys.argv) > 7 else 42
os.makedirs(OUT, exist_ok=True); t0 = time.time(); LP = math.log(p)
gx, gw = np.polynomial.legendre.leggauss(GLN)
B = lf.factor(name, p)[1]
amax = max([abs(1 / r) for r in np.roots(np.array(B)[::-1])] + [1.0]) if len(B) > 1 else 1.0
dmin = (LP / 2) * RAT ** (-J)   # relative to the core width p^-k: the grading depth at spike k is J + k log p / log RAT
NEXT = int(37.0 / (LP - math.log(amax))) + 4            # m beyond n+k: weights (alpha/p)^(m-n-k)
NRES = int((math.log(1 / dmin) + 37.0) / (LP - 2 * math.log(amax))) + 4   # n beyond resonance onset: (alpha^2/p)^n / eps
nmin, c = lf.laurent(name, p, npos=KMAX + NRES + NEXT + 8, nneg=60); c = c.real
nall = nmin + np.arange(len(c)); keep = np.abs(c) > 1e-18; nall = nall[keep]; c = c[keep]
cdict = dict(zip(nall.tolist(), c.tolist()))
def half(side, Jk):
    d = []; w = []; prev = 0.0
    for j in range(Jk, -1, -1):
        e = (LP / 2) * RAT ** (-j); lo, hi = prev, e; prev = e; h = (hi - lo) / 2
        d.extend(side * (lo + h + h * gx)); w.extend(h * gw)
    return np.array(d), np.array(w)
dP, wP = half(+1, J)
print(f'[{name}@{p}] KMAX={KMAX} pts/spike={2*len(dP)} |alpha|max={amax:.4f} NRES={NRES} NEXT={NEXT}; planned work array {(KMAX+NRES+NEXT+70)*2*len(dP)*8*4/2**20:.1f} MB', flush=True)
def delta_spike(k, d):
    eps = np.expm1(d); out = np.zeros_like(d)
    ns = nall[nall <= NRES + 2]                               # n range: resonance partner m = n + k
    for n in ns:
        cn = cdict[int(n)]
        ms = nall[nall <= n + k + NEXT]
        cm = np.array([cdict[int(m)] for m in ms])
        dd = (n + k - ms).astype(float)                       # exponent of p in (rho p^n)/p^m
        pm = float(p) ** ms.astype(float)
        A = float(p) ** float(n + k) * (1 + eps)              # shape (E,)
        fac = np.where(dd[:, None] == 0, np.abs(eps)[None, :], np.abs(float(p) ** dd[:, None] * (1 + eps)[None, :] - 1))
        diff = pm[:, None] * fac
        out += cn * (cm[:, None] * (sisum.si(A[None, :] + pm[:, None]) + sisum.si(diff))).sum(axis=0)
    return 2 * np.sqrt(float(p) ** k * (1 + eps)) * out
ts = np.arange(0, 60.0001, 0.02); hat = np.zeros_like(ts); masses = []
for k in range(0, KMAX + 1):
    Jk = J + int(math.ceil(k * LP / math.log(RAT)))          # resolve the core |eps| < p^-k of spike k
    dP, wP = half(+1, Jk); dM, wM = half(-1, Jk)
    parts = [(dP, wP)] if k == 0 else [(dP, wP), (dM, wM)]
    mk = 0.0
    for d, w in parts:
        v = delta_spike(k, d); u = k * LP + d
        hat += 2 * (np.cos(np.outer(ts, u)) @ (w * v)); mk += float(np.sum(w * v))
    masses.append(mk)
    if k % 10 == 0: print(f'  spike {k}: mass {mk:+.4e} [{time.time()-t0:.0f}s]', flush=True)
tth = digamma(0.25 + 0.5j * ts).real - math.log(math.pi); ld = lf.logderiv2re(name, p, ts); Lh = tth + ld + hat
i = int(np.argmin(Lh))
tail = abs(masses[-1]) / (1 - abs(masses[-1] / masses[-2])) if abs(masses[-1]) < abs(masses[-2]) else float('nan')
print(f'RESULT2 {name}@{p}: Lhat(0) = {Lh[0]:+.6f} (2theta\' = {tth[0]:.6f}, 2ReL\'/L = {ld[0]:+.6f}, deltahat(0) = {hat[0]:.6f}); min over [0,60] = {Lh[i]:+.6f} at t = {ts[i]:.2f}; last spike mass {masses[-1]:+.2e}; geometric tail estimate 2*{tail:.1e}', flush=True)
json.dump(dict(name=name, p=p, KMAX=KMAX, GLN=GLN, RAT=RAT, J=J, L0=float(Lh[0]), minL=float(Lh[i]), argmin=float(ts[i]), tth0=float(tth[0]), ld0=float(ld[0]), hat0=float(hat[0]),
               masses=masses, tail=2 * tail, samples=[[float(ts[q]), float(Lh[q])] for q in range(0, len(ts), 10)], seconds=time.time() - t0), open(f'{OUT}/symbol2_{name}_p{p}_K{KMAX}_g{GLN}.json', 'w'))
