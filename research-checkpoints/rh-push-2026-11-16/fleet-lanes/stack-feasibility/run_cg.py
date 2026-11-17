"""Feasibility thresholds with column generation, so that every reported infeasibility has a dual function G >= 0
on the whole FINE grid of allowed zero positions (t step 0.004, 21 sigma levels), not only on the coarse LP atoms.
usage: run_cg.py high|low1000|low15000 L"""
import numpy as np, mpmath as mp, json, sys, time
from scipy.optimize import linprog
from lib import *; from lp import kern
mode, L = sys.argv[1], float(sys.argv[2]); m = 3; Wt, Wm = 5.0, 35.0; eta = 1e-5; cslack = 7.0
mp.mp.dps = 45
if mode == 'high':
    d = json.load(open('zeros_3e12.json')); t0 = mp.mpf(d['t0']); zt = np.array(d['zeros_tau']); dens = d['theta1']/np.pi
else:
    t0 = mp.mpf(mode[3:]); z = json.load(open('../../pick/zeros_20000.json'))['enclosures']; zt = np.array([float(e[0]) for e in z]) - float(t0)
    dens = np.log(float(t0)/(2*np.pi))/(2*np.pi)
zi = np.where(np.abs(zt[:-1]) < 4)[0]; i = zi[np.argmin(np.diff(zt)[zi])]; j = zi[np.argmax(np.diff(zt)[zi])]
tqs = {'pair': float((zt[i]+zt[i+1])/2), 'gap': float((zt[j]+zt[j+1])/2)}
tj = np.arange(-Wt, Wt+1e-9, np.pi/(2*L)); b = b_primes(tj, L, m, t0); bz = b_zeros(tj, L, m, zt)
a = L/(2*m); marg = Wm - Wt; tail0 = 3*dens*marg**(1-2*m)/(a**(2*m)*(2*m-1)); E = 2*Wm*dens; J = len(tj)
tf = np.arange(-Wm, Wm+1e-9, 0.004)
print(f'## {mode} t0={mp.nstr(t0,16)} L={L} N={np.exp(L):.0f} J={J} dens={dens:.3f} L*={np.pi*dens:.2f} ef_err={np.abs(b-bz).max():.2e} positions={tqs} gaps={zt[i+1]-zt[i]:.4f},{zt[j+1]-zt[j]:.4f}', flush=True)
out = dict(mode=mode, L=L, t0=mp.nstr(t0, 20), tqs=tqs, rows=[])
for name, smax in (('M1', 0.0), ('M2_3/8', 0.375), ('M2_1/2', 0.5)):
    sigs = [0.0] if smax == 0 else list(np.linspace(0, smax, 21))
    KF = np.hstack([kern(tj, tf, s, L, m) for s in sigs]); massF = np.concatenate([np.full(len(tf), 1.0 if s == 0 else 2.0) for s in sigs])
    sigF = np.concatenate([np.full(len(tf), s) for s in sigs]); tF = np.tile(tf, len(sigs))
    tailup = (0.0 if smax == 0 else tail0*np.cosh(a*smax)**(2*m)) + eta; taillo = (tail0 if smax == 0 else tail0*np.cosh(a*smax)**(2*m)) + eta
    active = np.zeros(KF.shape[1], bool); active[::5] = True            # coarse start: t step 0.02
    def solve(delta, tq):
        """returns (s, cert) with G >= -s/(20 E) on the whole fine grid when s > 0"""
        Q = np.zeros(J) if delta is None else 2*Bhat(tq - tj + 1j*delta, L, m).real; qm = 0.0 if delta is None else 2.0
        for rnd in range(40):
            idx = np.nonzero(active)[0]; A = KF[:, idx]; n = len(idx)
            Aub = np.vstack([np.hstack([A, -np.ones((J, 1))]), np.hstack([-A, -np.ones((J, 1))]),
                             np.hstack([massF[idx][None, :], [[0.0]]]), np.hstack([-massF[idx][None, :], [[0.0]]])])
            bub = np.concatenate([b + tailup - Q, -(b - taillo - Q), [E + cslack - qm], [-(E - cslack - qm)]])
            c = np.zeros(n+1); c[-1] = 1
            r = linprog(c, A_ub=Aub, b_ub=bub, bounds=[(0, None)]*(n+1), method='highs')
            if r.status != 0: raise RuntimeError(r.status)
            s = r.x[-1]
            if s <= 1e-9: return 0.0, dict(w=r.x[:-1], idx=idx)
            mu = -r.ineqlin.marginals; u, v, cp, cm = mu[:J], mu[J:2*J], mu[2*J], mu[2*J+1]
            G = (u-v) @ KF + (cp-cm)*massF
            if G.min() >= -s/(20*(E+cslack)):
                return s, dict(y=(u-v).tolist(), kappa=float(cp-cm), Gq=float((u-v)@Q + (cp-cm)*qm), Gmin_fine=float(G.min()),
                               bound=float(u@(b+tailup) - v@(b-taillo) + cp*(E+cslack) - cm*(E-cslack)), rounds=rnd, s=float(s),
                               mass_bound=E+cslack, tailup=float(tailup), taillo=float(taillo))
            neg = np.nonzero(G < 0)[0]; neg = neg[np.argsort(G[neg])][:1500]; active[neg] = True
        raise RuntimeError('column generation did not converge')
    tic = time.time(); s0, _ = solve(None, 0.0)
    row = dict(model=name, base_s=s0)
    for nm, tq in tqs.items():
        hi = 0.5 if smax == 0 else smax; lo = 0.0
        s, cert = solve(hi, tq)
        if s == 0: row[nm] = None; row[nm+'_feasible_mass_by_sigma'] = None
        else:
            chi = cert
            for _ in range(9):
                mid = (lo+hi)/2; s, cert = solve(mid, tq)
                if s > 0: hi, chi = mid, cert
                else: lo = mid
            row[nm] = hi; chi['delta'] = hi; row[nm+'_cert'] = chi
        print(name, nm, 'threshold', row[nm], 'base_s', s0, ({k: v for k, v in row.get(nm+'_cert', {}).items() if k not in ('y',)}), f'{time.time()-tic:.0f}s atoms={active.sum()}', flush=True)
    out['rows'].append(row)
    json.dump(out, open(f'cg_{mode}_{L:g}.json', 'w'), indent=1, default=float)
out['tj'] = tj.tolist(); json.dump(out, open(f'cg_{mode}_{L:g}.json', 'w'), indent=1, default=float)
