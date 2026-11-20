#!/usr/bin/env python3
"""norms_strata.py ROWDIR out.json -- l2 mass of the theta estimator and of the row vector B by squarefull kernel of m.

For each generic half row m (N(m) <= 30000): exponents of m at the primes away from 2 and lambda, from N(m) and the
rational content of m; kernel norm K(m) = prod_{e_p >= 2} N(p)^{e_p}.  Sums: count, sum |rho_hat|^2 (12 classes),
sum se^2 (estimator noise), sum |B_m|^2 (row type 'a', window k = 10, both parities).
"""
import sys, os, json, math, glob
import numpy as np
ROWDIR, OUT = sys.argv[1], sys.argv[2]
stc = np.load(os.path.join(ROWDIR, 'static.npz')); types = [str(t) for t in stc['types']]; TA = types.index('a'); Qs = stc['Qs']
def exps(a, b):
    """exponents (prime norm, exponent) of m = a + b omega at primes away from 6."""
    N = a * a - a * b + b * b; out = []
    g = math.gcd(a, b)
    p = 5
    n = N
    while n % 2 == 0: n //= 2
    while n % 3 == 0: n //= 3
    p = 5
    while p * p <= n:
        if n % p == 0:
            e = 0
            while n % p == 0: n //= p; e += 1
            out.append((p, e))
        p += 2
    if n > 1: out.append((n, 1))
    res = []
    for p, e in out:
        if p % 3 == 2:
            assert e % 2 == 0; res.append((p * p, e // 2))
        else:
            c = 0; gg = g
            while gg % p == 0: gg //= p; c += 1
            if e - c > 0: res.append((p, e - c))
            if c > 0: res.append((p, c))
    return res
rows = []
for f in sorted(glob.glob(os.path.join(ROWDIR, 'rows_*.npz'))):
    r = np.load(f); ms = r['ms']; fl = r['flags']; six = r['six']
    rho2 = (np.abs(r['rho_str'] + r['rho_cor']) ** 2).sum(1); se2 = (r['se'] ** 2).sum(1)
    B2 = (np.abs(r['B'][:, 10, :, TA]) ** 2).sum(1)
    for i in range(len(ms)):
        ex = exps(int(ms[i, 0]), int(ms[i, 1]))
        mx = max([e for _, e in ex], default=0)
        assert mx == int(fl[i, 4]), (ms[i], ex, fl[i])
        K = 1
        for q, e in ex:
            if e >= 2: K *= q ** e
        pat = tuple(sorted(set(e % 6 for _, e in ex if e >= 2)))
        rows.append((int(r['Nm'][i]), mx, K, bool(six[i]), rho2[i], se2[i], B2[i], any(e % 6 == 5 for _, e in ex),
                     any(e == 2 for _, e in ex), any(e == 3 for _, e in ex), any(e == 4 for _, e in ex)))
    print(f, len(rows), flush=True)
A = np.array([(a, b, c, d, e, f, g, h, i, j, k) for (a, b, c, d, e, f, g, h, i, j, k) in rows], float)
Nm, mx, K, six, rho2, se2, B2, has5, has2, has3, has4 = A.T
gen = six == 0
res = {}
for Q in (Qs[4], Qs[6], Qs[8], Qs[10]):
    m0 = gen & (Nm <= Q); tot = dict(cnt=m0.sum(), rho2=rho2[m0].sum(), se2=se2[m0].sum(), B2=B2[m0].sum())
    d = dict(total={k: float(v) for k, v in tot.items()}, bymax={}, tail={}, has={})
    def sh(msk):
        mm = m0 & msk
        return dict(cnt=float(mm.sum() / tot['cnt']), rho2=float(rho2[mm].sum() / tot['rho2']),
                    sig2=float((rho2[mm].sum() - se2[mm].sum()) / (tot['rho2'] - tot['se2'])), B2=float(B2[mm].sum() / tot['B2']),
                    n=int(mm.sum()), mean_rho2=float(rho2[mm].mean()) if mm.any() else None, mean_se2=float(se2[mm].mean()) if mm.any() else None,
                    mean_B2=float(B2[mm].mean()) if mm.any() else None)
    for e in range(0, 7):
        d['bymax'][str(e)] = sh(mx == e if e < 6 else mx >= 6)
    for Kc in (1, 30, 100, 300, 1000, 3000):
        d['tail'][str(Kc)] = sh(K > Kc)
    d['has'] = {'5': sh(has5 == 1), '2': sh(has2 == 1), '3': sh(has3 == 1), '4': sh(has4 == 1)}
    res[f"{Q:.0f}"] = d
json.dump(res, open(OUT, 'w'), indent=1)
d = res[f"{Qs[10]:.0f}"]
print(json.dumps(d, indent=1))
