"""float64 entry error and certified counts at larger height: zeta at T = 1e7 (lam = 0.8, 1) and T = 1e8 (lam = 1), small windows, Arb 300 bits."""
import math, json, numpy as np
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
res = []
for name, lo, hi, lam in (('ZETA', 1e7, 1e7 + 40, 0.8), ('LIOU', 1e7, 1e7 + 40, 0.8), ('ZETA', 1e7, 1e7 + 30, 1.0), ('ZETA', 1e8, 1e8 + 14, 1.0)):
    X = float(int(math.exp(lam * math.log(0.5 * (lo + hi) / (2 * PI)))))
    W, nus, L, info = w3_arb.run(name, lo, hi, X, 300, do_eig=False, log=lambda *a: None, return_W=True)
    n = len(W); L2 = L * L
    Gf, _ = gw.build_G(gw.family(name, X), lo, n, X, log=lambda *a: None)
    evf = np.linalg.eigvalsh(Gf)
    D = np.array([[float((W[i][j] / L2).mid()) - Gf[i, j] for j in range(n)] for i in range(n)])
    rec = dict(family=name, lo=lo, hi=hi, lam=lam, X=X, n=n, terms=info['nterms'], float_vs_arb_max_entry_diff=float(np.abs(D).max()), float_vs_arb_operator_norm=float(np.linalg.norm(D, 2)),
               float_lam_min=float(evf[0]), counts={})
    for th in (0.0, 0.1, 0.5):
        r = inertia_shift(W, L2, arb(th))
        rec['counts'][str(th)] = dict(arb_N_theta=None if r is None else r[0], float_N_theta=int((evf > th).sum()))
    res.append(rec); print(json.dumps(rec), flush=True)
json.dump(res, open('out/arb_check3.json', 'w'), indent=1)
