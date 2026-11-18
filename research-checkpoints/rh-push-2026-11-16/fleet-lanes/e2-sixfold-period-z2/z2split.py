"""z2split.py -- moduli-side Z/2 split of the exceptional (theta-residue) term, on tmp/sextic/data/sf_1e7.npz (read-only).

For index y = y_S * pi (y_S = (-9,0), the base S-unit index of sextic_theta_1e7; pi the primes of norm <= P0):
  S(X)   = sum_{c sf, (c,6y)=1, N(c)<=X} gt_1(y, c)             ~ rho(y) X^{2/3}     (the P_a^{1/6} source)
  S_+/-  = same sum restricted to moduli with chi_c(y)^3 = +1 / -1  (the Z/2 factor of the sextic symbol)
S_+ - S_- = sum chi_c(y)^3 gt_1(y,c) = sum gt_1(y^4, c)  (index y^4: grade 4 at pi, linked to grade 0 by the Hecke reflection).
WLS fit of the X^{2/3} constant on shell increments (alib.fit_binned), noise model |v| = 1.
Control: random Z/2 labels on the same moduli. Cubic calibration: gt_2-based cubic sum at exponent 5/6 split by the same sign.
Planned memory: table 2.8e6 nodes x ~12 arrays ~ 0.5 GB; work arrays < 0.3 GB.
"""
import sys, os, json, math
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z
Z6 = Z.ZETA6
P0 = int(sys.argv[1]) if len(sys.argv) > 1 else 200
T = A.SFTable(SX + '/data/sf_1e7.npz'); X = T.X
grid = A.geom_grid(1000, X, 90); B1 = A.Binner(T, grid)
def fit(v, th=2 / 3):
    dS, dn = B1.binned(v); c, se, _, _ = A.fit_binned(grid, dS[:, 0], dn[:, 0], th); return c, se
yS = (-9, 0)
eS = T.node_exponents(yS).astype(np.int16)
eL = T.node_exponents(Z.LAM).astype(np.int16)
rng = np.random.default_rng(3)
good = [k for k in range(T.np_) if T.pq[k] <= P0]
rows = []
for k in good:
    eP = T.node_exponents((int(T.pa[k]), int(T.pb[k]))).astype(np.int16)
    ok = (eS >= 0) & (eP >= 0)
    e = (np.maximum(eS, 0) + np.maximum(eP, 0)) % 6
    v = np.where(ok, np.conj(Z6[e]) * T.g1, 0)
    ev = ok & (e % 2 == 0); od = ok & (e % 2 == 1)
    lab = rng.random(T.n) < 0.5
    c, se = fit(v); cp, sep = fit(np.where(ev, v, 0)); cm, sem = fit(np.where(od, v, 0))
    cr, ser = fit(np.where(lab, v, 0))
    # cubic calibration: cubic Gauss function index pi (Dunn-Radziwill normalisation as in sextic_theta.py), exponent 5/6
    okc = (eL >= 0) & (eP >= 0)
    v3 = np.where(okc, Z6[(-2 * np.maximum(eL, 0)) % 6] * Z6[(-2 * np.maximum(eP, 0)) % 6] * T.g2, 0)
    c3, se3 = fit(v3, 5 / 6); c3p, se3p = fit(np.where(okc & (eP % 2 == 0), v3, 0), 5 / 6); c3m, se3m = fit(np.where(okc & (eP % 2 == 1), v3, 0), 5 / 6)
    rows.append(dict(N=int(T.pq[k]), z=abs(c) / se, zp=abs(cp) / sep, zm=abs(cm) / sem, zr=abs(cr) / ser,
                     share=float(ev.sum() / max(ok.sum(), 1)),
                     c=[c.real, c.imag], cp=[cp.real, cp.imag], cm=[cm.real, cm.imag],
                     z3=abs(c3) / se3, z3p=abs(c3p) / se3p, z3m=abs(c3m) / se3m))
R = lambda key: float(np.mean([r[key] ** 2 for r in rows]))
summ = dict(n_indices=len(rows), P0=P0, X=X, mean_z2_all=R('z'), mean_z2_Z2even=R('zp'), mean_z2_Z2odd=R('zm'),
            mean_z2_random_half=R('zr'), mean_even_share=float(np.mean([r['share'] for r in rows])),
            n_both_gt3=int(sum(1 for r in rows if r['zp'] > 3 and r['zm'] > 3)),
            n_even_gt3=int(sum(1 for r in rows if r['zp'] > 3)), n_odd_gt3=int(sum(1 for r in rows if r['zm'] > 3)),
            cubic_mean_z2_all=R('z3'), cubic_mean_z2_even=R('z3p'), cubic_mean_z2_odd=R('z3m'))
print(json.dumps(summ, indent=1))
json.dump(dict(summary=summ, rows=rows), open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'z2split.json'), 'w'), indent=1)
