"""Test of the Theorem 2 inequality chain at h = 500 on a wide block at the proxy height 5e5 (O(h/c) terms kept)."""
import numpy as np, math, json, mpmath as mp
from model2 import *
from scipy.interpolate import CubicSpline
from scipy.special import zeta as hz
D = np.load('z_5e5_wide.npz'); T0 = float(D['T0']); zs = D['zeros']; cs = CubicSpline(D['d'], D['z'])
def Btr(T): return 0.112 * math.log(T) + 0.278 * math.log(math.log(T)) + 2.510
h = 500.0; rows = []
mp.mp.dps = 20
N = 3000; n = np.arange(1, N + 1.0); ph0 = np.array([float(mp.fmod(mp.mpf(T0) * mp.log(int(k)), 2 * mp.pi)) for k in range(1, N + 1)])
def zabs(sig, u): return np.abs(np.exp(-1j * (ph0[None, :] + np.outer(np.atleast_1d(u), np.log(n)))) @ n ** -sig)
worst = 0
for c0 in np.linspace(-600, 600, 13):
    c = T0 + c0; L = math.log(c / (2 * math.pi)); dens = L / (2 * math.pi); B = Btr(2 * c)
    g = zs[np.abs(zs - c0) <= h]; k = len(g)
    i = np.searchsorted(g, c0); lo, hi = g[i - 1], g[i]
    from scipy.optimize import minimize_scalar
    r_ = minimize_scalar(lambda t: -np.sum(np.log(np.abs(t - g))), bounds=(lo + 1e-9, hi - 1e-9), method='bounded', options=dict(xatol=1e-12)); tm = r_.x
    for a in [1.0, 1.5, 2.5]:
        sig = 0.5 + a
        us = np.concatenate([np.linspace(c0 - 3 * h, c0 + 3 * h, 60001)])
        A = logp(g, us - 1j * a).real; A0 = logp(g, np.array([c0]) - 1j * a).real[0]
        z_c = zabs(sig, c0)[0]; msig = hz(2 * sig) / hz(sig)
        small = dens / h ** 2 + 2 * h / c + 3 * B / c + 20 / c
        tau = np.linspace(0, h / 2, 100001); epsX = 4 * B * h / (h ** 2 - tau ** 2) + small
        Lam = 0.5 * np.log(((h + tau) ** 2 + a * a) / ((h - tau) ** 2 + a * a)); dt = tau[1] - tau[0]
        kappa = float(np.max(np.concatenate([[0], np.cumsum((epsX[1:] + epsX[:-1]) / 2 * dt)]) - dens * np.concatenate([[0], np.cumsum((Lam[1:] + Lam[:-1]) / 2 * dt)]))) + 20 * h / c
        lemP_lhs = float((A - A0).min()); lemP_rhs = math.log(msig / z_c) - kappa
        r = abs(tm - c0)
        kprime = dens * (a * a + 1.01 * r * r) / h + (4 * B / h + small) * a + 4.1 * B * r / h + 20 * r / c
        E_meas = float(np.exp(logp(g, np.array([tm + 0j])).real[0] - A.min()))          # sup_u |p(t_m)|/|p(u - ia)|
        E_bound = (1 + 5 * h / c) * math.exp(kappa + kprime) / msig * abs(float(cs(tm))) * (c / (2 * math.pi)) ** (-a / 2)
        ok = (lemP_lhs >= lemP_rhs) and (E_meas <= E_bound); worst = max(worst, E_meas / E_bound)
        rows.append(dict(c0=float(c0), k=k, sigma=sig, t_m=float(tm), Zm=abs(float(cs(tm))), lemP_lhs=lemP_lhs, lemP_rhs=lemP_rhs, E_meas=E_meas, E_bound=E_bound, ok=bool(ok)))
        print('c0=%+5.0f k=%d sigma=%.1f |Z(t_m)|=%.4f | min(A-A(c))=%.4f >= %.4f | E_meas=%.3e <= E_bound=%.3e (ratio %.3f) %s' % (c0, k, sig, abs(float(cs(tm))), lemP_lhs, lemP_rhs, E_meas, E_bound, E_meas / E_bound, 'OK' if ok else 'FAIL'))
print('all ok:', all(r['ok'] for r in rows), ' worst E_meas/E_bound = %.3f' % worst)
json.dump(rows, open('out_check_thm2.json', 'w'), indent=1)
