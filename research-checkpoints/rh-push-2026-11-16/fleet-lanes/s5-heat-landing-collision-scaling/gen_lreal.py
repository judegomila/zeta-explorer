"""Ordinates of the zeros of L(s, chi) on the line for a real primitive character (flint Hardy Z, sign changes on a grid of 1/12 mean
spacing, bisection). Usage: gen_lreal.py Q NUM TMAX OUT.npy   (dirichlet_char(Q, NUM)); count checked against the smooth count."""
import sys, os, math, numpy as np
from multiprocessing import Pool
from flint import dirichlet_char, arb, ctx
q, num, tmax, out = int(sys.argv[1]), int(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
def Z(t):
    v = dirichlet_char(q, num).hardy_z(arb(t))
    v = v.real if hasattr(v, 'real') and not isinstance(v, arb) else v
    return float(v.mid())
def block(a):
    t0, t1 = a; ctx.prec = 80; zs = []
    t = t0; f = Z(t)
    while t < t1:
        h = 2 * math.pi / math.log(q * max(t, 3.0) / (2 * math.pi) + 2) / 12
        t2 = min(t + h, t1); f2 = Z(t2)
        if f == 0 or f * f2 < 0:
            lo, hi, flo = t, t2, f
            for _ in range(48):
                m = 0.5 * (lo + hi); fm = Z(m)
                if flo * fm <= 0: hi = m
                else: lo, flo = m, fm
            zs.append(0.5 * (lo + hi))
        t, f = t2, f2
    return zs
if __name__ == '__main__':
    edges = np.linspace(0.0, tmax, 257)
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as p: parts = p.map(block, list(zip(edges[:-1], edges[1:])), chunksize=1)
    g = np.array([v for part in parts for v in part])
    par = 0 if dirichlet_char(q, num)(q - 1) == 1 else 1
    smooth = tmax / (2 * math.pi) * math.log(q * tmax / (2 * math.pi * math.e)) + (-1 / 8 if par == 0 else 1 / 8)
    print('L(chi mod %d): %d zeros below %g ; smooth count %.2f ; min gap %.4g' % (q, len(g), tmax, smooth, np.diff(g).min()))
    np.save(out, g)
