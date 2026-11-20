import math, sys, numpy as np, sisum
name = sys.argv[1]; p = 2; LP = math.log(p)
gx, gw = np.polynomial.legendre.leggauss(16)
def cellmass(k):
    pts = []; wts = []
    for side in (+1, -1):
        prev = 0.0
        for j in range(80, -1, -1):
            e = (LP / 2) * 1.5 ** (-j); lo, hi = prev, e; prev = e
            h = (hi - lo) / 2; x = lo + h + h * gx
            pts.extend(k * LP + side * x); wts.extend(h * gw)
    pts = np.array(pts); wts = np.array(wts)
    v = sisum.delta_grid(name, p, np.exp(pts))
    return float(np.sum(wts * v)), float(np.sum(wts * np.abs(v)))
for k in (1, 2, 4, 8, 16, 24, 32, 40, 46, 52, 58, 62):
    m, ma = cellmass(k); print(name, 'k=%d mass=%+.6e absmass=%.6e  2^(-0.3k)=%.3e 2^(-k/2)=%.3e' % (k, m, ma, 2 ** (-0.3 * k), 2 ** (-0.5 * k)), flush=True)
