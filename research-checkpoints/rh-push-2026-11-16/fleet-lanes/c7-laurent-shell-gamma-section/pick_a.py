# choose angles for Test A (float optimisation), write cfg files
import numpy as np, json, math, itertools, sys
from scipy.optimize import minimize
kap = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1); c1, c2 = (1 - 1j*kap)/2, (1 + 1j*kap)/2
CHI = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}
def E(P, w, tw=None):
    r = 1
    for i, p in enumerate(P): r = r/(1 - p**-0.5*w[i]*(1 if tw is None else tw[i]))
    return r
def D(P, w):
    ch = [CHI[p % 5] for p in P]; return c1*E(P, w, ch) + c2*E(P, w, [np.conj(x) for x in ch])
P = [2, 3, 7]; pb = 7
for nm, F, s in (('zeta', E, (4, 5)), ('DH', D, (4, 5)), ('zeta', E, (1, 2)), ('DH', D, (1, 2))):
    sv = s[0]/s[1]; best = None
    f = lambda th: F(P, [sv*np.exp(1j*th[0]), sv*np.exp(1j*th[1]), np.exp(1j*th[2])]).real
    for x0 in itertools.product([0.5, 2.0, 3.5, 5.0], repeat=3):
        r = minimize(f, x0, method='Nelder-Mead', options={'xatol': 1e-9, 'fatol': 1e-12})
        if best is None or r.fun < best.fun: best = r
    th = [round(float(x % (2*np.pi)), 3) for x in best.x]
    wh = [sv*np.exp(1j*th[0]), sv*np.exp(1j*th[1]), np.exp(1j*th[2])]
    cfg = {'P': P, 'pb': pb, 'theta': {2: th[0], 3: th[1], 7: th[2]}, 's': list(s), 't0': 1.0,
           'deltas_zeta': [1e-3, 3e-4, 1e-4, 3e-5, 1e-5], 'deltas_dh': [3e-3, 1e-3, 5e-4], 'twist_zeta': 5, 'twist_dh': 11,
           'E_hat_float': [complex(E(P, wh)).real, complex(E(P, wh)).imag], 'D_hat_float': [complex(D(P, wh)).real, complex(D(P, wh)).imag]}
    name = 'cfgA_%sopt_s%d%d.json' % (nm, s[0], s[1]); json.dump(cfg, open(name, 'w'), indent=1); print(name, cfg)
