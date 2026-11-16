# Heat family kappa_tau(u) = exp(tau u^2/16) kappa(u)  (tau = de Bruijn time). One-node odd sign
# D_tau(t) = f'^2 - f f'' + f f'/t,  f_tau(t) = 2 int_0^inf kappa_tau(u) cos(tu/2) du.  mpmath, non-interval.
import mpmath as mp, json, sys
mp.mp.dps = 60
def k_xi(u):
    e = mp.exp(u)
    return mp.fsum(mp.pi*n*n*(2*mp.pi*n*n*e-3)*mp.exp(mp.mpf('1.25')*u-mp.pi*n*n*e) for n in range(1, 10))
NQ = 600; U = mp.mpf(7)
from mpmath.calculus.quadrature import GaussLegendre
import numpy as np
xs, ws = np.polynomial.legendre.leggauss(NQ)
# refine GL nodes to mp precision by Newton on Legendre
nodes = []
for x0 in xs:
    x = mp.mpf(float(x0))
    for _ in range(6):
        p = mp.legendre(NQ, x); p1 = mp.legendre(NQ-1, x)
        dp = NQ*(x*p-p1)/(x*x-1); x = x - p/dp
    p1 = mp.legendre(NQ-1, x); dp = NQ*(x*mp.legendre(NQ, x)-p1)/(x*x-1)
    nodes.append(((x+1)/2*U, 2/((1-x*x)*dp*dp)*U/2))
kv = [(u, w*k_xi(u)) for u, w in nodes]
res = {}
for tau in [mp.mpf(x) for x in sys.argv[1:]]:
    kw = [(u, c*mp.exp(mp.mpf(tau)*u*u/16)) for u, c in kv]
    runs = []; cur = None; mn = None
    T = 51; h = mp.mpf(1)/50
    for i in range(47*50, int(T/h)+1):
        t = i*h
        f = f1 = f2 = mp.mpf(0)
        for u, c in kw:
            a = t*u/2; cs = mp.cos(a); sn = mp.sin(a)
            f += c*cs; f1 -= c*sn*u/2; f2 -= c*cs*u*u/4
        f *= 2; f1 *= 2; f2 *= 2
        D = f1*f1 - f*f2 + f*f1/t; R = D/(f*f+f1*f1)
        if mn is None or R < mn[0]: mn = (R, t)
        if R < 0:
            if cur is None: cur = [float(t), float(t), float(R)]
            cur[1] = float(t); cur[2] = min(cur[2], float(R))
        elif cur is not None: runs.append(cur); cur = None
    if cur: runs.append(cur)
    print('tau', float(tau), 'min R', mp.nstr(mn[0], 8), 'at t', mp.nstr(mn[1], 6), 'negative runs', runs[:8], len(runs), flush=True)
    res[str(float(tau))] = {'minR': float(mn[0]), 'at': float(mn[1]), 'neg_runs': runs}
json.dump(res, open('heat_bisect.json', 'w'), indent=1)
