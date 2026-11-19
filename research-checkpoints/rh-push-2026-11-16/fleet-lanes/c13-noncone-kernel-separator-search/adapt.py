"""Adaptive stage (PREREG section 4): 500 Gaussian perturbations of the real parameters around the 200 functionals per
family that reject the largest number of classes (P2 strict list; filled from P1, then P0, when P2 has fewer than 200).
usage: python adapt.py <outdir> <family>[,...]   -> params_<family>-adp.npz"""
import json, os, sys
import numpy as np
import funcs

out = sys.argv[1]
order = funcs.all_families()
for fam in sys.argv[2].split(','):
    a = json.load(open(os.path.join(out, 'analysis_%s.json' % fam)))
    rows = []
    for pset in ('P2', 'P1', 'P0'):
        for sc, i in a['%s/strict' % pset].get('top', []):
            if i not in rows and len(rows) < 200:
                rows.append(i)
    if not rows:
        print(fam, 'no one-signed functional under any positive set: no adaptive stage')
        continue
    P = dict(np.load(os.path.join(out, 'params_%s.npz' % fam)))
    r = np.random.Generator(np.random.PCG64(132000 + order.index(fam)))
    rows = np.repeat(np.array(rows), 500)
    kind, pol, sub = funcs.fam_info(fam)
    n = len(rows)
    if kind == 'minor':
        m = P['m'][rows]
        ci = P['ci'][rows]
        u0 = P['u0'][rows] + r.normal(0, 0.05, n)
        h = P['h'][rows] * (1 + r.normal(0, 0.3, n))
        g = np.where(m == 2, 0.0, P['g'][rows] + r.normal(0, 0.02, n))
        ok = np.zeros(n, dtype=bool)
        for mm in (2, 3, 4):
            s = m == mm
            if s.any():
                ok[s] = funcs.minor_window_ok(mm, funcs.COLSETS[mm][ci[s]], u0[s], h[s], g[s])
        tab = dict(m=m[ok], ci=ci[ok], u0=u0[ok], h=h[ok], g=g[ok])
    else:
        u = P['u'][rows] + r.normal(0, 0.05, n)
        h = P['h'][rows] * (1 + r.normal(0, 0.3, n)) if sub in ('F1', 'F3') else P['h'][rows]
        lam = P['lam'][rows] * (1 + r.normal(0, 0.1, n)) if sub in ('F1', 'F2') else P['lam'][rows]
        mu = P['mu'][rows] + r.normal(0, 0.2, n) if sub in ('F2', 'F5') else P['mu'][rows]
        ok = funcs.turan_window_ok(sub, u, h) & (h >= 0)
        tab = dict(p=P['p'][rows][ok], u=u[ok], h=h[ok], lam=lam[ok], mu=mu[ok])
    np.savez(os.path.join(out, 'params_%s-adp.npz' % fam), **tab)
    print(fam, 'adaptive rows', funcs.nfun(tab), 'from', len(set(rows.tolist())), 'centres')
