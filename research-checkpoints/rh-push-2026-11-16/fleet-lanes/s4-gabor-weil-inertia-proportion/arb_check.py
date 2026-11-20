"""Certified counts N_theta(G) = #{eigenvalues > theta} for small windows, Arb ball arithmetic (entries from w3_arb.run, s3 lane),
LDL^T of G - theta without pivoting, every pivot sign decided by a ball that excludes 0 (Sylvester). Compared with float64 gw.build_G."""
import sys, math, json, numpy as np
from flint import arb, ctx
import w3_arb, gw
PI = math.pi

def inertia_shift(W, L2, theta):
    m = len(W); A = [[W[i][j] / L2 - (theta if i == j else 0) for j in range(m)] for i in range(m)]
    pos = neg = 0; minabs = None
    for k in range(m):
        p = A[k][k]
        if p > 0: pos += 1
        elif p < 0: neg += 1
        else: return None
        ap = abs(float(p.mid())); minabs = ap if minabs is None else min(minabs, ap)
        rk = A[k]
        for i in range(k + 1, m):
            f = rk[i] / p; ri = A[i]
            for j in range(i, m): ri[j] = ri[j] - f * rk[j]
    return pos, neg, minabs

cases = [('ZETA', 10000.0, 10150.0, 0.5, 1), ('ZETA', 10000.0, 10150.0, 0.8, 1), ('ZETA', 10000.0, 10110.0, 1.0, 1), ('CHI5R', 10000.0, 10150.0, 0.8, 5),
         ('DH', 1000.0, 1200.0, 0.8, 5), ('DH', 1000.0, 1200.0, 0.6, 5), ('DH', 1840.0, 1900.0, 0.8, 5), ('LIOU', 10000.0, 10150.0, 0.8, 1), ('LIOU', 10000.0, 10110.0, 1.0, 1)]
res = []
for name, lo, hi, lam, q in cases:
    X = float(int(math.exp(lam * math.log(q * 0.5 * (lo + hi) / (2 * PI)))))
    W, nus, L, info = w3_arb.run(name, lo, hi, X, 400, do_eig=False, log=lambda *a: None, return_W=True)
    n = len(W); L2 = L * L
    Gf, _ = gw.build_G(gw.family(name, X), lo, n, X, log=lambda *a: None)
    evf = np.linalg.eigvalsh(Gf)
    maxdiff = max(abs(float((W[i][j] / L2).mid()) - Gf[i, j]) for i in range(n) for j in range(n))
    rec = dict(family=name, lo=lo, hi=hi, lam=lam, X=X, n=n, max_radius=info['max_radius'], float_vs_arb_max_entry_diff=maxdiff, float_lam_min=float(evf[0]), counts={})
    for th in (0.0, 0.05, 0.25, 0.5, 1.0):
        r = inertia_shift(W, L2, arb(th))
        rec['counts'][str(th)] = dict(arb_N_theta=None if r is None else r[0], arb_min_abs_pivot=None if r is None else r[2], float_N_theta=int((evf > th).sum()))
    res.append(rec); print(json.dumps(rec), flush=True)
json.dump(res, open('out/arb_check.json', 'w'), indent=1)
