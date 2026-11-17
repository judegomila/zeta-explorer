"""Torus-uniform Hermite-Biehler threshold of Euler-type lifts (float64, closed forms + grids; MEASURED).
S(x) = sup over the torus of log |D(-x,-th)| / |D(x,th)|.  The lifted object M = G(s) D + G(1-s) D~ has no zero at
s = 1/2 + x + it for ANY torus point when  log|G(s)/G(1-s)| > S(x).  t*(X) = least t with this for all 0 < x <= X.
For a product, S(x) = sum_p S_p(x) (independent variables)."""
import math, json, sys
import numpy as np
from scipy.special import loggamma
import bl

TH = np.linspace(0, 2 * math.pi, 4001)


def logR(inp, x, t):
    s = 0.5 + x + 1j * t
    k = inp.split(':')[0]
    if t > 1e6:   # Stirling; avoids float cancellation in loggamma differences
        return (2 * x) * 0.5 * math.log((5.0 if k == 'dh' else 1.0) * t / (2 * math.pi)) * (2 if k == 'ea' else 1)
    if k == 'dh':
        f = lambda s: loggamma((s + 1) / 2) + (s / 2) * math.log(5 / math.pi)
    elif k == 'ea':
        a = float(inp.split(':')[1]); f = lambda s: loggamma((s + a) / 2) + loggamma((s - a) / 2) - s * math.log(math.pi)
    else:
        f = lambda s: loggamma(s / 2) - (s / 2) * math.log(math.pi)
    return (f(s) - f(1 - s)).real


def S_prod(inp, P, K, x):
    k = inp.split(':')[0]
    tot = 0.0
    for p in bl.primes_upto(P):
        e = {'zeta': 1.0, 'tw2m': -1.0 if p == 2 else 1.0, 'tw2h': 0.5 if p == 2 else 1.0, 'liou': -1.0}[k]
        def loc(y):
            return 1 / (1 - y) if K == 0 else sum(y ** j for j in range(K + 1))
        num = np.abs(loc(e * p ** (-0.5 + x) * np.exp(1j * TH))); den = np.abs(loc(e * p ** (-0.5 - x) * np.exp(-1j * TH)))
        tot += float(np.max(np.log(num / den)))
    return tot


def S_dh(P, K, x, n=400):
    ps = [p for p in bl.primes_upto(P) if p != 5]
    assert len(ps) <= 2
    g = np.linspace(0, 2 * math.pi, n, endpoint=False)
    th = np.stack(np.meshgrid(*([g] * len(ps)), indexing='ij'), -1).reshape(-1, len(ps))
    def D(xx, sgn):
        a = np.ones(len(th), complex); b = np.ones(len(th), complex)
        for j, p in enumerate(ps):
            y = p ** (-0.5 - xx) * np.exp(-1j * sgn * th[:, j]); ch = bl.CHI5[p % 5]
            loc = (lambda u: 1 / (1 - u)) if K == 0 else (lambda u: sum(u ** i for i in range(K + 1)))
            a *= loc(ch * y); b *= loc(np.conj(ch) * y)
        return bl.C1 * a + np.conj(bl.C1) * b
    return float(np.max(np.log(np.abs(D(-x, -1)) / np.abs(D(x, 1)))))


def tstar(inp, Sfun, X, nx=60):
    xs = np.linspace(X / nx, X, nx)
    Sv = [Sfun(x) for x in xs]
    worst = 0.0
    for x, s in zip(xs, Sv):
        if not np.isfinite(s):
            return math.inf
        lo, hi = 1.0, 1e3
        while logR(inp, x, hi) <= s:
            hi *= 10
            if hi > 1e300:
                return math.inf
        if logR(inp, x, lo) > s:
            # logR is not monotone at small t; scan
            pass
        for _ in range(200):
            mid = math.sqrt(lo * hi)
            if logR(inp, x, mid) > s:
                hi = mid
            else:
                lo = mid
        worst = max(worst, hi)
    return worst


if __name__ == '__main__':
    out = {}
    for K, X in ((1, 0.5), (2, 0.5), (0, 0.45)):
        for inp in ('zeta', 'tw2m', 'tw2h', 'liou'):
            for P in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 97, 199, 499, 997):
                out[f'{inp}|P{P}|K{K}|X{X}'] = tstar(inp, lambda x: S_prod(inp, P, K, x), X)
        for P in (2, 3):
            out[f'dh|P{P}|K{K}|X{X}'] = tstar('dh', lambda x: S_dh(P, K, x), X)
    json.dump(out, open('results/thresholds.json', 'w'), indent=1)
    for k, v in out.items():
        if k.startswith('zeta') or k.startswith('dh') or 'P2|' in k:
            print(k, '%.6g' % v)
