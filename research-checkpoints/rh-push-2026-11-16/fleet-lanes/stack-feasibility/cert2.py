"""Refined dual certificate for the stacking example (L = 14, delta = 3/8, largest-gap position, strip |sigma| <= 3/8).
Column generation on a fine candidate grid (t step 0.001, 41 sigma levels), then the dual function G is evaluated on a much finer
grid (t step 0.0001, 121 sigma levels) to bound its minimum over the continuum of allowed zero positions."""
import numpy as np, mpmath as mp, json, sys
from scipy.optimize import linprog
from lib import *; from lp import kern
L, delta = float(sys.argv[1]), float(sys.argv[2]); m = 3; Wt, Wm = 5.0, 35.0; smax = 0.375; eta, cslack = 1e-4, 30.0
mp.mp.dps = 45
d = json.load(open('zeros_3e12.json')); t0 = mp.mpf(d['t0']); zt = np.array(d['zeros_tau']); dens = d['theta1']/np.pi
zi = np.where(np.abs(zt[:-1]) < 4)[0]; j = zi[np.argmax(np.diff(zt)[zi])]; tq = float((zt[j]+zt[j+1])/2)
tj = np.arange(-Wt, Wt+1e-9, np.pi/(2*L)); b = b_primes(tj, L, m, t0); J = len(tj)
a = L/(2*m); tl = 3*dens*(Wm-Wt)**(1-2*m)/(a**(2*m)*(2*m-1))*np.cosh(a*smax)**(2*m) + eta; E = 2*Wm*dens
Q = 2*Bhat(tq - tj + 1j*delta, L, m).real
tf = np.arange(-Wm, Wm+1e-9, 0.001); sigs = list(np.linspace(0, smax, 41))
KF = np.hstack([kern(tj, tf, s, L, m).astype(np.float64) for s in sigs]); massF = np.concatenate([np.full(len(tf), 1.0 if s == 0 else 2.0) for s in sigs])
active = np.zeros(KF.shape[1], bool); active[::20] = True
for rnd in range(80):
    idx = np.nonzero(active)[0]; A = KF[:, idx]; n = len(idx)
    Aub = np.vstack([np.hstack([A, -np.ones((J, 1))]), np.hstack([-A, -np.ones((J, 1))]), np.hstack([massF[idx][None, :], [[0.0]]]), np.hstack([-massF[idx][None, :], [[0.0]]])])
    bub = np.concatenate([b + tl - Q, -(b - tl - Q), [E + cslack - 2], [-(E - cslack - 2)]]); c = np.zeros(n+1); c[-1] = 1
    r = linprog(c, A_ub=Aub, b_ub=bub, bounds=[(0, None)]*(n+1), method='highs'); assert r.status == 0
    s = r.x[-1]; mu = -r.ineqlin.marginals; u, v, cp, cm = mu[:J], mu[J:2*J], mu[2*J], mu[2*J+1]
    G = (u-v) @ KF + (cp-cm)*massF; print('round', rnd, 'atoms', n, 's*', s, 'min G', G.min(), flush=True)
    if s <= 1e-9 or G.min() >= -s/(200*(E+cslack)): break
    neg = np.nonzero(G < 0)[0]; active[neg[np.argsort(G[neg])][:3000]] = True
del KF
y = u - v; kap = cp - cm; Gq = float(y@Q + kap*2); bound = float(u@(b+tl) - v@(b-tl) + cp*(E+cslack) - cm*(E-cslack))
gmin = np.inf; arg = None; tff = np.arange(-Wm, Wm, 0.0001)
for sg in np.linspace(0, smax, 121):
    for k in range(0, len(tff), 50000):
        tt = tff[k:k+50000]; G = y @ kern(tj, tt, sg, L, m) + kap*(1.0 if sg == 0 else 2.0)
        if G.min() < gmin: gmin = float(G.min()); arg = (float(sg), float(tt[G.argmin()]))
M = E + cslack
print(f'L={L} delta={delta} tq={tq}: G(quartet)={Gq:.6f} bound={bound:.6f} margin={Gq-bound:.6f}; min G on (1e-4 x 121) grid = {gmin:.3e} at {arg}; mass bound {M:.1f}; '
      f'margin - mass*|minG| = {Gq - bound - M*abs(min(gmin, 0)):.6f}')
json.dump(dict(L=L, delta=delta, tq=tq, t0=mp.nstr(t0, 22), tj=tj.tolist(), u=u.tolist(), v=v.tolist(), cp=float(cp), cm=float(cm), b=b.tolist(), Q=Q.tolist(), tail=float(tl),
               E=float(E), cslack=cslack, eta=eta, Gq=Gq, bound=bound, Gmin_ultrafine=gmin, argmin=arg), open(f'cert2_L{L:g}_d{delta:g}.json', 'w'), indent=1)
