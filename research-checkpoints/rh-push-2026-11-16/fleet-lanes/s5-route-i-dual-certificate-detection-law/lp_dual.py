"""Combination 1: dual (positive-extension) certificate as a linear programme, against lambda_min.
Certificate: phi_hat(t) = sum_k y_k 2 cos(x_k t), x_k >= 2a (atoms outside the support), plus for the pole-free form
alpha FT[cosh(u/2) 1_{|u|<2a}] + beta FT[u sinh(u/2) 1_{|u|<2a}]; maximise m subject to w(t_j) + phi_hat(t_j) >= m on a grid,
w(t) = 2 Re A(t) = Fourier transform of the kernel K cut at |u| = 2a. Weak duality: m <= lambda_min for an exact certificate."""
import sys, math, json, numpy as np
from scipy.optimize import linprog
from symlib import *

def lp(name, twoa, pf, T=200.0, dt=0.02, span=12.0, dx=0.02, l1=None):
    a = twoa / 2
    o = make_object(name, math.exp(twoa) + 1)
    t = np.arange(0, T + dt / 2, dt)
    A, _ = symbols(o, t, a, with_pole=not pf)
    w = 2 * A.real
    x = np.arange(twoa, twoa + span + dx / 2, dx)
    cols = [2 * np.cos(np.outer(t, x))]
    if pf:
        for p in list(o['poles']) + list(o.get('pf_poles', [])):
            kp = p + 1j * t; km = -p + 1j * t
            f1 = ((np.exp(2 * a * kp) - 1) / kp + (np.exp(2 * a * km) - 1) / km).real          # 2 Re int_0^{2a} cosh(pu) e^{itu} du
            dkp = (np.exp(2 * a * kp) * (2 * a * kp - 1) + 1) / kp ** 2; dkm = (np.exp(2 * a * km) * (2 * a * km - 1) + 1) / km ** 2
            f2 = (dkp - dkm).real                                                               # 2 Re int_0^{2a} u sinh(pu) e^{itu} du
            cols.append(np.stack([f1, f2], axis=1))
    Phi = np.hstack(cols); nv = Phi.shape[1]
    # variables: y (free), m ; maximise m ; constraints -Phi y + m <= w
    c = np.zeros(nv + 1); c[-1] = -1
    Aub = np.hstack([-Phi, np.ones((len(t), 1))]); bub = w
    bounds = [(None, None)] * (nv + 1)
    if l1 is not None: bounds = [(-l1, l1)] * nv + [(None, None)]
    r = linprog(c, A_ub=Aub, b_ub=bub, bounds=bounds, method='highs')
    if r.x is None: return None
    y = r.x[:nv]; m = r.x[-1]
    # check of the certificate on a finer and longer grid
    t2 = np.arange(0, 3 * T, dt / 3 + 1e-4)
    A2, _ = symbols(o, t2, a, with_pole=not pf)
    val = 2 * A2.real + 2 * np.cos(np.outer(t2, x)) @ y[:len(x)]
    if pf:
        j = len(x)
        for p in list(o['poles']) + list(o.get('pf_poles', [])):
            kp = p + 1j * t2; km = -p + 1j * t2
            f1 = ((np.exp(2 * a * kp) - 1) / kp + (np.exp(2 * a * km) - 1) / km).real
            dkp = (np.exp(2 * a * kp) * (2 * a * kp - 1) + 1) / kp ** 2; dkm = (np.exp(2 * a * km) * (2 * a * km - 1) + 1) / km ** 2
            val += y[j] * f1 + y[j + 1] * (dkp - dkm).real; j += 2
    lam = lam_min(o, a, 240, 2.0, pf=pf)[0][0]
    return dict(obj=name, twoa=twoa, pf=pf, T=T, dt=dt, span=span, dx=dx, m_lp=float(m), min_fine_grid_in_T=float(val[t2 <= T].min()),
                min_beyond_T=float(val[t2 > T].min()), l1=float(np.abs(y[:len(x)]).sum()), lam_min=float(lam), status=r.status)

if __name__ == '__main__':
    cases = [('DH', math.log(3), False), ('DH', 1.6, False), ('CHI5', 1.0, False), ('CHI-4', 1.0, False), ('TNR:2:2.2', 1.0, False), ('TNR:2:2.2', 1.5, False),
             ('LIOU', 1.2, True), ('ZETA', 0.8, True), ('ZETA', 1.0, True), ('EA0.25', 1.5, False), ('UNI', 1.3, True)]
    out = []
    for nm, twoa, pf in cases:
        for (T, span) in ((120.0, 6.0), (240.0, 12.0), (480.0, 24.0)):
            r = lp(nm, twoa, pf, T=T, span=span, dt=0.05, dx=0.05, l1=1e4)
            if r is None: print(nm, twoa, T, 'LP not solved'); continue
            out.append(r)
            print('%-10s 2a=%.4f %s T=%3.0f span=%2.0f  m_LP=% .6f  fine-grid min=% .6f  beyond T min=% .4f  l1=%.3g  lambda_min=% .6f' % (
                nm, twoa, 'pf' if pf else 'full', T, span, r['m_lp'], r['min_fine_grid_in_T'], r['min_beyond_T'], r['l1'], r['lam_min']), flush=True)
    json.dump(out, open('lp_dual.json', 'w'), indent=1)
