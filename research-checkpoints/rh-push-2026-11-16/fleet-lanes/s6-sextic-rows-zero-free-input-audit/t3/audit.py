#!/usr/bin/env python3
"""audit.py -- coefficient-level inputs of the 7/8 / B = 17497733/20000000 system tested on the control battery, n <= X.
(M) mollifier identity: D_F = (mu a) * a = delta for completely multiplicative a (inverse polynomial M_u = sum mu(n) psi_u(n) ...).
    Reported: first n > 1 with D_F(n) != 0, sum_{1<n<=x} |D_F(n)|^2 / n, sup |D_F|.
(R) coefficient bound |a(p)| <= 1 at primes (hypothesis of manuscript Lemma 17.1): first prime violating it.
(P) duality in the target variable: smooth sums T_F(x) = sum_n a_F(n) W(n/x), W a smooth bump on [1/2, 2];
    a periodic mean-zero a (functional equation) gives O(x^-A); a pole gives c x; no functional equation gives ~ x^(1/2).
usage: audit.py X out.json"""
import sys, math, json, time
import numpy as np
X = int(float(sys.argv[1])); outp = sys.argv[2]; t0 = time.time()
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1); ALPHA = 1.2393168126993495
NN = 2 * X
print(f"planned: int8 arrays of {NN + 1} (x3), float64 arrays of {X + 1} (x3) = {(3 * NN + 24 * X) / 2**30:.2f} GB", flush=True)
# ---- sieve: mu and the hash sign twist eps (completely multiplicative), n <= 2X
def hbit(x):
    x = (x.astype(np.uint64) + np.uint64(0x9E3779B97F4A7C15)); x = (x ^ (x >> np.uint64(30))) * np.uint64(0xBF58476D1CE4E5B9)
    x = (x ^ (x >> np.uint64(27))) * np.uint64(0x94D049BB133111EB); x = x ^ (x >> np.uint64(31)); return ((x >> np.uint64(17)) & np.uint64(1)).astype(np.int8)
comp = np.zeros(NN + 1, bool); comp[:2] = True
for i in range(2, int(math.isqrt(NN)) + 1):
    if not comp[i]: comp[i * i::i] = True
primes = np.flatnonzero(~comp); del comp
hb = hbit(primes)
mu = np.ones(NN + 1, np.int8); eps = np.ones(NN + 1, np.int8)
for p, h in zip(primes.tolist(), hb.tolist()):
    if p * p <= NN or p <= NN // 2:
        mu[p::p] = -mu[p::p]
        if h: eps[p::p] = -eps[p::p]
    else:
        mu[p] = -1
        if h: eps[p] = -1
    if p * p <= NN:
        mu[p * p::p * p] = 0
        q = p * p
        while q <= NN:
            if h: eps[q::q] = -eps[q::q]
            q *= p
mu[0] = 0
print(f"sieve to {NN}: {len(primes)} primes, {time.time() - t0:.0f}s; M(1e6) = {int(mu[1:10**6 + 1].sum())} (known 212)", flush=True)
out = {'X': X, 'mertens_1e6': int(mu[1:10**6 + 1].sum())}
# ---- (M) mollifier defect for DH: D = (mu a) * a, hyperbola
per = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])
def defect(a):
    ma = mu[:X + 1] * a; D = np.zeros(X + 1); r = int(math.isqrt(X))
    for d in range(1, r + 1):
        if ma[d] != 0: D[d::d] += ma[d] * a[1:X // d + 1]
    for m in range(1, r + 1):                                 # d > r, m <= r (m <= X/d < sqrt X)
        if a[m] == 0: continue
        hi = X // m
        if hi > r: D[(r + 1) * m:hi * m + 1:m] += a[m] * ma[r + 1:hi + 1]
    return D
n = np.arange(X + 1)
res = {}
mk = {'DH': lambda: per[n % 5], 'chi5': lambda: np.array([0.0, 1, -1, -1, 1])[n % 5], 'hash': lambda: eps[:X + 1].astype(float)}
for nm in (('DH', 'chi5', 'hash') if X <= 10 ** 7 else ('DH',)):
    a = mk[nm](); D = defect(a); D[1] -= 1.0; del a
    nz = np.flatnonzero(np.abs(D) > 1e-9)
    cs = np.cumsum(np.abs(D[1:]) ** 2 / n[1:])
    marks = [10 ** k for k in range(1, int(math.log10(X)) + 1)]
    res[nm] = dict(first_defect=int(nz[0]) if len(nz) else None, first_value=float(D[nz[0]]) if len(nz) else 0.0, n_defects=int(len(nz)),
                   sup=float(np.abs(D).max()), cum={str(m): float(cs[m - 1]) for m in marks},
                   cum_abs={str(m): float(np.abs(D[1:m + 1]).sum() / m) for m in marks})
    print(nm, {k: v for k, v in res[nm].items()}, f"{time.time() - t0:.0f}s", flush=True)
    del D, cs
out['mollifier_defect'] = res
out['coefficient_bound'] = {'DH': 'max |a(p)| = 1', 'Ea25': 'a(2) = 2^0.25 + 2^-0.25 = %.4f > 1 (first prime)' % (2 ** .25 + 2 ** -.25),
                            'TNR(q=1000003,c=2.2)': 'a(q) = 1 - c sqrt(q)-normalised local coefficient; |local roots| = 1.558, 0.642 != 1 at n = q'}
# ---- (P) smooth sums
def W(x):
    t = (np.log(x) / math.log(2.0))                         # bump in log2 x on (-1, 1)
    return np.where(np.abs(t) < 1, np.exp(1 - 1 / np.maximum(1 - t * t, 1e-300)), 0.0)
sm = {}
xs = [10.0 ** (k / 2) for k in range(2, 2 * int(math.log10(X)) + 1)]
for x in [x_ for x_ in xs if x_ <= 3.2e7]:
    lo = int(x / 2); hi = min(int(2 * x) + 1, NN)
    nn = np.arange(max(lo, 1), hi + 1, dtype=np.int32); w = W(nn / x)
    row = dict(x=x, zeta=float(w.sum()), chi4=float((w * np.array([0, 1, 0, -1])[nn % 4]).sum()), chi5=float((w * np.array([0, 1, -1, -1, 1])[nn % 5]).sum()),
               DH=float((w * per[nn % 5]).sum()), hash=float((w * eps[nn]).sum()), liou_mu=float((w * mu[nn]).sum()),
               unimod=float(abs((w * np.exp(-1j * ALPHA * np.log(nn))).sum())), norm=float(math.sqrt((w * w).sum())))
    sm[f"{x:.6g}"] = row
    print({k: (f"{v:.4g}") for k, v in row.items()}, flush=True)
out['smooth_sums'] = sm
json.dump(out, open(outp, 'w'), indent=0)
print(f"done {time.time() - t0:.0f}s", flush=True)
