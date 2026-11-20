"""Chebyshev coefficients of the Riemann-Siegel functions C0(p) = cos(2 pi (p^2 - p - 1/16))/cos(2 pi p) and
C1(p) = -C0'''(p)/(96 pi^2) on p in [-0.1, 1.1] (mpmath, 40 digits), with derivatives; written to rs_cheb.json."""
import mpmath as mp, json
import numpy as np
mp.mp.dps = 40
def C0(p):
    return mp.cos(2 * mp.pi * (p * p - p - mp.mpf(1) / 16)) / mp.cos(2 * mp.pi * p)
deg = 48; a, b = -0.1, 1.1
k = np.arange(deg + 1)
xs = np.cos(np.pi * (k + 0.5) / (deg + 1))
ps = [mp.mpf(0.5 * (a + b)) + mp.mpf(0.5 * (b - a)) * mp.mpf(float(x)) for x in xs]
vals = np.array([float(C0(p)) for p in ps])
c0 = np.polynomial.chebyshev.chebfit(xs, vals, deg)
sc = 2.0 / (b - a)
d1 = np.polynomial.chebyshev.chebder(c0) * sc
d2 = np.polynomial.chebyshev.chebder(d1) * sc
d3 = np.polynomial.chebyshev.chebder(d2) * sc
c1 = -d3 / (96 * np.pi ** 2)
c1d = np.polynomial.chebyshev.chebder(c1) * sc
json.dump(dict(a=a, b=b, C0=c0.tolist(), C0d=d1.tolist(), C0dd=d2.tolist(), C1=c1.tolist(), C1d=c1d.tolist()), open('rs_cheb.json', 'w'))
# check
for p in [0.1, 0.25001, 0.5, 0.9]:
    x = (p - 0.5 * (a + b)) * sc
    print(p, np.polynomial.chebyshev.chebval(x, c0), float(C0(mp.mpf(p))), np.polynomial.chebyshev.chebval(x, c1), float(-mp.diff(C0, mp.mpf(p), 3) / (96 * mp.pi ** 2)))
