"""psi_k^F(X) = sum_{n<=X} Lambda_F(n) (X-n)^k/k!, k = 0,1,2, for Euler-product objects, segmented sieve, 80-bit accumulation.
usage: truth.py Xmax out.json     Objects: zeta, E_a (a = 0.02, 0.1), T-NR q = 1000003 c = 2.2, chi_-4, chi_5, Liouville, random
completely multiplicative sign, unimodular twist alpha = 1 (complex).  Checkpoints: 100 per decade."""
import sys, json, math, numpy as np
Xmax = int(float(sys.argv[1])); out = sys.argv[2]
LD = np.longdouble
SEG = 10 ** 7
print(f"# planned memory: segment arrays about {SEG * 8 * 12 / 1e9:.2f} GB", flush=True)
r = int(math.isqrt(Xmax)) + 1
sv = np.ones(r + 1, dtype=bool); sv[:2] = False
for p in range(2, int(r ** 0.5) + 1):
    if sv[p]: sv[p * p::p] = False
small = np.nonzero(sv)[0].astype(np.int64)
def rsign(p):  # deterministic pseudo-random sign per prime
    h = (p.astype(np.uint64) * np.uint64(0x9E3779B97F4A7C15)) >> np.uint64(40)
    return np.where((h & np.uint64(1)) == 1, 1.0, -1.0)
chi4 = np.array([0, 1, 0, -1.0]); chi5 = np.array([0, 1, -1, -1, 1.0])
q = 1000003; cc = 2.2; dl = math.acosh(cc / 2); al = math.sqrt(q) * math.exp(dl); be = math.sqrt(q) * math.exp(-dl)
OBJ = ['zeta', 'Ea0.02', 'Ea0.1', 'chi4', 'chi5', 'liouville', 'randsign', 'unimod_re', 'unimod_im']
def weights(n, p, j):
    """per prime power n = p^j: dict of Lambda_F(n)/log p"""
    ln = np.log(n.astype(np.float64))
    return {'zeta': np.ones(len(n)), 'Ea0.02': 2 * np.cosh(0.02 * ln), 'Ea0.1': 2 * np.cosh(0.1 * ln),
            'chi4': chi4[p % 4] ** j, 'chi5': chi5[p % 5] ** j, 'liouville': (-1.0) ** j, 'randsign': rsign(p) ** j,
            'unimod_re': np.cos(ln), 'unimod_im': -np.sin(ln)}
# prime powers j >= 2
pp_n, pp_p, pp_j = [], [], []
for p in small:
    p = int(p); v = p * p; j = 2
    while v <= Xmax: pp_n.append(v); pp_p.append(p); pp_j.append(j); v *= p; j += 1
pp_n = np.array(pp_n, dtype=np.int64); o = np.argsort(pp_n); pp_n = pp_n[o]; pp_p = np.array(pp_p, dtype=np.int64)[o]; pp_j = np.array(pp_j, dtype=np.int64)[o]
cps = np.unique(np.round(10 ** np.arange(2, math.log10(Xmax) + 1e-9, 0.01)).astype(np.int64))
acc = {o_: np.zeros(3, dtype=LD) for o_ in OBJ}
res = {o_: [] for o_ in OBJ}; cpi = 0
lo = 2
while lo <= Xmax:
    hi = min(lo + SEG - 1, Xmax)
    seg = np.ones(hi - lo + 1, dtype=bool)
    for p in small:
        p = int(p)
        if p * p > hi: break
        st = max(p * p, ((lo + p - 1) // p) * p); seg[st - lo::p] = False
    pr = np.nonzero(seg)[0].astype(np.int64) + lo
    a, b = np.searchsorted(pp_n, lo), np.searchsorted(pp_n, hi, side='right')
    n = np.concatenate([pr, pp_n[a:b]]); p = np.concatenate([pr, pp_p[a:b]]); j = np.concatenate([np.ones(len(pr), dtype=np.int64), pp_j[a:b]])
    o = np.argsort(n, kind='stable'); n = n[o]; p = p[o]; j = j[o]
    lg = np.log(p.astype(np.float64)); W = weights(n, p, j)
    nl = n.astype(LD)
    c1 = np.searchsorted(cps, hi, side='right')
    for name in OBJ:
        v = (lg * W[name]).astype(LD)
        cs = [np.cumsum(v * nl ** jj) for jj in range(3)]
        for ci in range(cpi, c1):
            X = int(cps[ci]); idx = np.searchsorted(n, X, side='right')
            S = [acc[name][jj] + (cs[jj][idx - 1] if idx > 0 else 0) for jj in range(3)]
            XL = LD(X)
            res[name].append([float(S[0]), float(S[0] - S[1] / XL), float((S[0] - 2 * S[1] / XL + S[2] / XL / XL) / 2)])
        for jj in range(3): acc[name][jj] += cs[jj][-1] if len(n) else 0
    cpi = c1
    if (lo // SEG) % 50 == 0: print(f"# segment to {hi:.3e}", flush=True)
    lo = hi + 1
json.dump(dict(X=cps.tolist(), psi=res, tnr=dict(q=q, c=cc, alpha=al, beta=be)), open(out, 'w'))
print('done', len(cps))
