"""Extend the Hecke eigenvalues of hejhal_odd1.json to all primes <= NMAX (vectorised, K table by flint)."""
import math, json, sys
import numpy as np
from flint import acb, ctx
ctx.prec = 100
H = json.load(open('hejhal_odd1.json')); R = H['R']; alow = np.array(H['a'][:14])
NMAX = int(sys.argv[1])
XMIN, XMAX, NT = 1e-3, 70.0, 400001
LT = np.linspace(math.log(XMIN), math.log(XMAX), NT); HH = LT[1]-LT[0]
sc = (acb.pi()*R/2).exp(); nu = acb(0, R)
TAB = np.array([float((acb(math.exp(t)).bessel_k(nu)*sc).real.mid()) for t in LT])
def Kt(x):
    x = np.asarray(x, float); big = x >= XMAX
    u = (np.log(np.clip(x, XMIN*1.001, XMAX*0.999)) - LT[0])/HH
    i = np.clip(np.floor(u).astype(np.int64), 1, NT-3); s = u - i
    out = (-s*(s-1)*(s-2)/6)*TAB[i-1] + ((s+1)*(s-1)*(s-2)/2)*TAB[i] + (-(s+1)*s*(s-2)/2)*TAB[i+1] + ((s+1)*s*(s-1)/6)*TAB[i+2]
    out[big] = 0; return out
def pullback(x, y):
    x = x.copy(); y = y.copy()
    for it in range(10000):
        x -= np.round(x)
        n = x*x + y*y
        m = n < 1 - 1e-14
        if not m.any(): return x, y
        x[m] = -x[m]/n[m]; y[m] = y[m]/n[m]
    raise RuntimeError
def coeff(n, fac):
    Y = fac*R/(2*math.pi*n); Q = 3*n + 60
    xs = (np.arange(1, 2*Q+1) - 0.5)/(2*Q)
    px, py = pullback(xs, np.full(2*Q, Y))
    f = np.zeros(2*Q)
    for m in range(1, len(alow)+1):
        f += alow[m-1]*Kt(2*math.pi*m*py)*np.sin(2*math.pi*m*px)
    f *= np.sqrt(py)
    return float(np.sum(f*np.sin(2*math.pi*n*xs))/Q/(math.sqrt(Y)*Kt(np.array([2*math.pi*n*Y]))[0]))
primes = [p for p in range(2, NMAX+1) if all(p % t for t in range(2, int(p**.5)+1))]
lam = {}; worst = 0.0
for p in primes:
    a = coeff(p, 1.15); b = coeff(p, 1.35)
    lam[p] = a; worst = max(worst, abs(a-b))
chk = max(abs(lam[p] - H['a'][p-1]) for p in primes if p <= 47)
# composite checks
comp = max(abs(coeff(p*q, 1.2) - lam[p]*lam[q]) for p, q in ((2, 3), (3, 5), (7, 11), (13, 17), (23, 29), (31, 37)) if p*q <= NMAX)
print("primes:", len(primes), "max |lam(Y1)-lam(Y2)|:", worst, "vs stage-1 list (p<=47):", chk, "composite defect:", comp, "max |lam|:", max(abs(v) for v in lam.values()))
json.dump(dict(R=R, lam=lam, two_height_defect=worst, composite_defect=comp), open('hejhal_odd1_ext.json', 'w'))
