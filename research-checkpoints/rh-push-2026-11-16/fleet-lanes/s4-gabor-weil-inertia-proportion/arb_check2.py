"""Certified inertia at bandwidth 1.25 for DH on [1000, 1200] (and zeta on [10000, 10100]) against the table of zeros:
N_theta (theta = 0.01) and the number of eigenvalues below -0.01, Arb LDL^T with certified pivot signs."""
import math, json, numpy as np
from flint import arb, ctx
import w3_arb, gw
from arb_check import inertia_shift
PI = math.pi
tab = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
on = np.array([float(x) for x in tab['online']]); off = np.array([(float(b) - 0.5, float(t)) for b, t, _ in tab['offline']])
res = []
for name, lo, hi, lam, q in (('DH', 1000.0, 1200.0, 1.25, 5), ('DH', 1000.0, 1200.0, 1.0, 5), ('ZETA', 10000.0, 10100.0, 1.25, 1)):
    X = float(int(math.exp(lam * math.log(q * 0.5 * (lo + hi) / (2 * PI)))))
    W, nus, L, info = w3_arb.run(name, lo, hi, X, 600, do_eig=False, log=lambda *a: None, return_W=True)
    n = len(W); L2 = L * L; delta = float(2 * PI / math.log(X))
    a0, a1 = lo - delta / 2, lo + (n - 0.5) * delta
    rec = dict(family=name, lo=lo, hi=hi, lam=lam, X=X, n=n, window=[a0, a1])
    if name == 'DH':
        rec['online_in_window'] = int(((on > a0) & (on < a1)).sum()); rec['pairs_in_window'] = int(((off[:, 1] > a0) & (off[:, 1] < a1)).sum())
    else:
        fam = gw.family('ZETA', X); rec['smooth_count'] = gw.count_smooth(fam, a1) - gw.count_smooth(fam, a0)
    for th in (0.01, 0.05, -0.01, -0.05):
        r = inertia_shift(W, L2, arb(th))
        rec['theta=%g' % th] = None if r is None else dict(above=r[0], below=r[1], min_abs_pivot=r[2])
    res.append(rec); print(json.dumps(rec), flush=True)
json.dump(res, open('out/arb_check2.json', 'w'), indent=1)
