"""Theorem 2 constants over a grid of the lane: c log-spaced in [3.1e12, 7.5e16] (61 points), h in {300..1000 step 50}, a in {0.55, 0.75, 1, 1.5, 2, 2.5, 3}."""
import numpy as np, math, json
from scipy.special import zeta as hz
def Btr(T): return 0.112 * math.log(T) + 0.278 * math.log(math.log(T)) + 2.510
worst_margin = 1e9; worst_pref = {}; n = 0
for c in np.exp(np.linspace(math.log(3.1e12), math.log(7.5e16), 61)):
    L = math.log(c / (2 * math.pi)); dens = L / (2 * math.pi); B = Btr(2 * c)
    for h in np.arange(300.0, 1001.0, 50.0):
        tau = np.linspace(0, h / 2, 20001); dt = tau[1] - tau[0]
        small = dens / h ** 2 + 2 * h / c + 3 * B / c + 20 / c
        epsX = 4 * B * h / (h ** 2 - tau ** 2) + small
        I_eps = np.concatenate([[0], np.cumsum((epsX[1:] + epsX[:-1]) / 2 * dt)])
        for a in [0.55, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0]:
            sig = 0.5 + a
            Lam = 0.5 * np.log(((h + tau) ** 2 + a * a) / ((h - tau) ** 2 + a * a))
            I_Lam = np.concatenate([[0], np.cumsum((Lam[1:] + Lam[:-1]) / 2 * dt)])
            kappa = float(np.max(I_eps - dens * I_Lam)) + 20 * h / c
            Gamma1 = float(dens * I_Lam[-1] - I_eps[-1])
            D = h / 2; mhat = math.log((D + math.sqrt(D * D + 4 * a * a)) / (2 * a)); far = B * (5 * mhat + 0.29) + 1e-6
            r = 2 * B / (math.log((c - h) / (2 * math.pi)) / (2 * math.pi))
            kp = dens * (a * a + 1.01 * r * r) / h + (4 * B / h + small) * a + 4.1 * B * r / h + 20 * r / c
            pref = (1 + 5 * h / c) * math.exp(kappa + kp) * hz(sig) / hz(2 * sig)
            worst_margin = min(worst_margin, Gamma1 - far - kappa); n += 1
            key = '%.2f' % sig
            if h >= 500: worst_pref[key] = max(worst_pref.get(key, 0), pref)
print('grid points', n, ' min (Gamma1 - far_err - kappa) = %.1f' % worst_margin)
print('max prefactor e^{kappa+kappa\'}(1+5h/c)/m_sigma over the lane, h >= 500:', {k: round(v, 3) for k, v in worst_pref.items()})
json.dump(dict(n=n, worst_margin=worst_margin, worst_pref_h_ge_500=worst_pref), open('consts_grid.json', 'w'), indent=1)
