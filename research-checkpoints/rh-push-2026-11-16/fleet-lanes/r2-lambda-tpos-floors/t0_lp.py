# t = 0 positive probe-measure LP with exact zeta tails and boundary domination; output a rational configuration omega (w = y*omega).
import numpy as np, mpmath as mp, json, math
from scipy.optimize import linprog
from fractions import Fraction as F
mp.mp.dps = 30
X = 6000000185827; q0 = F(5625001, 10**7); y = math.sqrt(q0); L = math.log((X-8)/(4*math.pi))/4
def K(h, d, b): return (h-b)/(d*d+(h-b)**2) + (h+b)/(d*d+(h+b)**2)
Nc = 3000
vm = []
for n in range(2, Nc+1):
    m = n; p = next((d for d in range(2, int(n**.5)+1) if n % d == 0), n)
    while m % p == 0: m //= p
    if m == 1: vm.append((n, math.log(p)))
nn = np.array([v[0] for v in vm], float); lam = np.array([v[1] for v in vm]); lnn = np.log(nn)
def lp(probes):
    hh = np.array([float(p[0]) for p in probes]); xx = np.array([float(p[1]) for p in probes]); P = len(probes); M = len(nn)
    ds = np.concatenate([[0.0], y*np.geomspace(1e-3, 1, 25), np.linspace(y, 12, 500)[1:], np.geomspace(12.2, 1e4, 150)])
    cols = np.array([0.5*(K(h, ds-x, y)+K(h, ds+x, y)) for h, x in zip(hh, xx)]).T; rhs = 4*y/(ds*ds+4*y*y)
    Fm = nn[:, None]**(-hh[None, :]/2)*np.cos(0.5*xx[None, :]*lnn[:, None]); base = lam*nn**-0.5
    uh = sorted(set(hh)); zt = {h: float(-mp.zeta((1+mp.mpf(h))/2, derivative=1)/mp.zeta((1+mp.mpf(h))/2)) for h in uh}
    tail = np.array([zt[h] for h in hh]) - (base[:, None]*nn[:, None]**(-hh[None, :]/2)).sum(0)
    g = L - K(hh, xx, y)
    c = -np.concatenate([g - 0.5*tail, -0.5*base])
    Aub = np.vstack([np.hstack([cols, np.zeros((len(ds), M))]), np.hstack([Fm, -np.eye(M)]), np.hstack([-Fm, -np.eye(M)]), np.concatenate([hh, np.zeros(M)])[None, :]])
    bub = np.concatenate([rhs, np.zeros(2*M), [2*y]])
    r = linprog(c, A_ub=Aub, b_ub=bub, bounds=(0, None), method='highs'); return -r.fun, r.x[:P]
hs = [F(a, 40) for a in range(54, 81)] + [F(22, 10), F(26, 10)]; xs = [F(a, 16) for a in range(0, 49)]
probes = [(h, x) for h in hs for x in xs]
E, w = lp(probes); print('full grid LP: E = %.5f  rate 2E/y = %.4f' % (E, 2*E/y))
sup = [probes[i] for i in np.argsort(-w)[:6] if w[i] > 2e-3]
E2, w2 = lp(sup); print('restricted to', [(str(h), str(x)) for h, x in sup], ' E = %.5f' % E2)
om = [F(int(wi/y*(1 - 2e-3)*10**6), 10**6) for wi in w2]
cfg = dict(q0=str(q0), probes=[[str(h), str(x), str(o)] for (h, x), o in zip(sup, om) if o > 0], Nc=Nc, E_lp_float=E2)
json.dump(cfg, open('t0_config.json', 'w'), indent=1); print(cfg)
