"""Dual certificate for the stacking example: (0) window count + (ii) explicit formula with Lambda(n), n <= e^L + (iv) |Re rho - 1/2| <= 3/8
exclude a quartet (1/2 +- delta, +-(t0 + tq)) that (0)+(ii) with |Re rho - 1/2| <= 1/2 allow.  Column generation as in run_cg.py; also a
robustness sweep over the evaluation slack eta and the count slack.  usage: cert.py L delta"""
import numpy as np, mpmath as mp, json, sys
from scipy.optimize import linprog
from lib import *; from lp import kern
L, delta = float(sys.argv[1]), float(sys.argv[2]); m = 3; Wt, Wm = 5.0, 35.0
mp.mp.dps = 45
d = json.load(open('zeros_3e12.json')); t0 = mp.mpf(d['t0']); zt = np.array(d['zeros_tau']); dens = d['theta1']/np.pi
zi = np.where(np.abs(zt[:-1]) < 4)[0]; j = zi[np.argmax(np.diff(zt)[zi])]; tq = float((zt[j]+zt[j+1])/2)
tj = np.arange(-Wt, Wt+1e-9, np.pi/(2*L)); b = b_primes(tj, L, m, t0); J = len(tj)
a = L/(2*m); tail0 = 3*dens*(Wm-Wt)**(1-2*m)/(a**(2*m)*(2*m-1)); E = 2*Wm*dens
tf = np.arange(-Wm, Wm+1e-9, 0.004); Q = 2*Bhat(tq - tj + 1j*delta, L, m).real
out = dict(L=L, delta=delta, tq=tq, t0=mp.nstr(t0, 20), tj=tj.tolist(), b=b.tolist(), Q=Q.tolist(), runs=[])
for smax in (0.375, 0.5):
    sigs = list(np.linspace(0, smax, 21)); KF = np.hstack([kern(tj, tf, s, L, m) for s in sigs])
    massF = np.concatenate([np.full(len(tf), 1.0 if s == 0 else 2.0) for s in sigs])
    for eta, cslack in ((1e-5, 7.0), (1e-4, 7.0), (1e-5, 30.0), (1e-3, 30.0)):
        tl = tail0*np.cosh(a*smax)**(2*m) + eta; active = np.zeros(KF.shape[1], bool); active[::5] = True
        for rnd in range(60):
            idx = np.nonzero(active)[0]; A = KF[:, idx]; n = len(idx)
            Aub = np.vstack([np.hstack([A, -np.ones((J, 1))]), np.hstack([-A, -np.ones((J, 1))]),
                             np.hstack([massF[idx][None, :], [[0.0]]]), np.hstack([-massF[idx][None, :], [[0.0]]])])
            bub = np.concatenate([b + tl - Q, -(b - tl - Q), [E + cslack - 2], [-(E - cslack - 2)]])
            c = np.zeros(n+1); c[-1] = 1
            r = linprog(c, A_ub=Aub, b_ub=bub, bounds=[(0, None)]*(n+1), method='highs'); assert r.status == 0
            s = r.x[-1]
            if s <= 1e-9: break
            mu = -r.ineqlin.marginals; u, v, cp, cm = mu[:J], mu[J:2*J], mu[2*J], mu[2*J+1]
            G = (u-v) @ KF + (cp-cm)*massF
            if G.min() >= -s/(20*(E+cslack)): break
            neg = np.nonzero(G < 0)[0]; active[neg[np.argsort(G[neg])][:1500]] = True
        row = dict(smax=smax, eta=eta, cslack=cslack, s=float(s), rounds=rnd)
        if s > 1e-9:
            Gq = float((u-v)@Q + (cp-cm)*2); bound = float(u@(b+tl) - v@(b-tl) + cp*(E+cslack) - cm*(E-cslack))
            row.update(infeasible=True, y=(u-v).tolist(), u=u.tolist(), v=v.tolist(), cp=float(cp), cm=float(cm), Gq=Gq, bound=bound, Gmin_fine=float(G.min()),
                       l1=float(np.abs(u-v).sum()), nnz=int((np.abs(u-v) > 1e-12).sum()))
            print(f'smax={smax} eta={eta} cslack={cslack}: INFEASIBLE  G(quartet)={Gq:.6f} > bound={bound:.6f}  (s*={s:.3e}, ratio {Gq/bound:.4f}); min G on fine grid {G.min():.2e}; tests used {row["nnz"]}/{J}', flush=True)
        else:
            w = r.x[:-1]; ms = {f'{sg:.3f}': float(w[np.isclose(np.concatenate([np.full(len(tf), q) for q in sigs])[idx], sg)].sum()*(1 if sg == 0 else 2)) for sg in sigs}
            off = sum(vv for k, vv in ms.items() if float(k) > 0)
            row.update(infeasible=False, zeros_on_line=ms['0.000'], other_offline_zeros=off, offline_beyond_3_8=sum(vv for k, vv in ms.items() if float(k) > 0.3751))
            print(f'smax={smax} eta={eta} cslack={cslack}: feasible; relaxed measure has {ms["0.000"]:.1f} on-line zeros and {off:.2f} other off-line zeros in the window ({row["offline_beyond_3_8"]:.2f} with sigma > 3/8)', flush=True)
        out['runs'].append(row)
json.dump(out, open(f'cert_L{L:g}_d{delta:g}.json', 'w'), indent=1)
