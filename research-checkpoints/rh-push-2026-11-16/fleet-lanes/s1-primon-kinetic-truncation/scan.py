#!/usr/bin/env python3
"""Test 3b: fine scan in t of the pole-corrected Fejer-smoothed margin near the off-line zeros of EA and T-NR, and the same windows for zeta.
usage: scan.py <X> <out.json>   (float64; cupy on one device if available, numpy otherwise)"""
import sys, json, time, numpy as np, mpmath as mp
from lib import *
from points import EA_A
mp.mp.dps = 20
X = float(sys.argv[1]); outf = sys.argv[2]
try:
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=4 * 1024 ** 3); GPU = True
except Exception:
    xp = np; GPU = False
print("backend", "cupy" if GPU else "numpy", flush=True)
N = int(X); print("planned allocation: sieve %.2f GB" % (N / 1e9), flush=True)
sv = np.ones(N + 1, dtype=bool); sv[:2] = False
for i in range(2, int(N ** 0.5) + 1):
    if sv[i]: sv[i * i::i] = False
pr = np.nonzero(sv)[0]; del sv; print("primes", len(pr), flush=True)
L = np.log(pr.astype(np.float64)); ell = [L]; lam = [L]; k = 2
while 2 ** k <= X:
    m = pr[pr <= X ** (1.0 / k) * (1 + 1e-12)]; m = m[m.astype(float) ** k <= X * (1 + 1e-12)]; lm = np.log(m.astype(float)); ell.append(k * lm); lam.append(lm); k += 1
ell = np.concatenate(ell); lam = np.concatenate(lam); lx = np.log(X); w = lam * (1 - ell / lx)   # Fejer weight in log n
print("prime powers", len(ell), flush=True)
def smooth_sum(sigmas, ts):
    """S_X(sigma+it) for all sigma, t: array (n_sigma, n_t)"""
    out = xp.zeros((len(sigmas), len(ts)), dtype=xp.complex128); tg = xp.asarray(ts); CHK = 20000
    print("planned allocation per chunk: %.2f GB" % (CHK * len(ts) * 16 / 1e9), flush=True)
    for a in range(0, len(ell), CHK):
        e = xp.asarray(ell[a:a + CHK]); ww = xp.asarray(w[a:a + CHK]); E = xp.exp(-1j * e[:, None] * tg[None, :])
        for i, sg in enumerate(sigmas): out[i] += (ww * xp.exp(-sg * e)) @ E
    return out.get() if GPU else out
def triv(s):
    k = np.arange(1, 3000)[:, None]; m = 2 * k
    return ((X ** (-m - s[None, :]) - 1) / ((m + s[None, :]) ** 2 * lx)).sum(0) - 1 / (2 * (6001 + s) * lx)
def Az(s): return np.array([complex(A_zeta(complex(z))) for z in s])
def pole(s): return (X ** (1 - s) - 1) / ((1 - s) ** 2 * lx)
res = {"X": X, "backend": "cupy" if GPU else "numpy"}
lq = np.log(NR_Q); na = -NR_Q ** (0.5 + NR_DELTA); nb = -NR_Q ** (0.5 - NR_DELTA)
for name, t0 in (("W_gamma1", 14.134725141734693), ("W_NR", np.pi / np.log(2.0))):
    ts = t0 + np.arange(-4, 4.0001, 0.01); xs = [0.02, 0.05, 0.2]
    sig = sorted(set([round(0.5 + x + d, 10) for x in xs for d in (0, EA_A, -EA_A)])); t1 = time.time()
    S = smooth_sum(sig, ts); print(name, "sum time %.0fs" % (time.time() - t1), flush=True); row = {}
    for x in xs:
        s = 0.5 + x + 1j * ts; g = lambda d: S[sig.index(round(0.5 + x + d, 10))]
        mz = (Az(s) - g(0) + pole(s) - triv(s)).real
        mea = (Az(s + EA_A) + Az(s - EA_A) - g(EA_A) - g(-EA_A) + pole(s + EA_A) + pole(s - EA_A) - triv(s + EA_A) - triv(s - EA_A)).real
        nrS = g(0).copy(); kk = 1
        while NR_Q ** kk <= X * (1 + 1e-12):
            nrS -= (na ** kk + nb ** kk) * lq * NR_Q ** (-kk * s) * (1 - kk * lq / lx); kk += 1
        mnr = (Az(s) + lq - nrS + pole(s) - triv(s)).real
        row[str(x)] = {c: dict(min=float(v.min()), t_at_min=float(ts[int(np.argmin(v))]), n_neg=int((v < 0).sum()), max=float(v.max())) for c, v in (("zeta", mz), ("EA", mea), ("NR", mnr))}
        row[str(x)]["curves"] = {c: [round(float(z), 6) for z in v[::10]] for c, v in (("zeta", mz), ("EA", mea), ("NR", mnr))}
    res[name] = row
json.dump(res, open(outf, "w"))
for name in ("W_gamma1", "W_NR"):
    for x in res[name]: print(name, x, {c: (round(v["min"], 4), round(v["t_at_min"], 3), v["n_neg"]) for c, v in res[name][x].items() if c != "curves"})
