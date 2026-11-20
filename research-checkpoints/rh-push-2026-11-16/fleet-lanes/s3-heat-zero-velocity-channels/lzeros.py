"""Zeros on the line of L(s, chi_-q), q = 3 or 4, below TMAX: sign changes of the Hardy function (python-flint) on a grid of
1/12 of the local mean spacing, bisection, count check against the phase.  Usage: lzeros.py q TMAX OUT.npy"""
import sys, os, math, numpy as np, mpmath
from multiprocessing import Pool
from flint import arb, acb, ctx, dirichlet_char
q = int(sys.argv[1]); TMAX = float(sys.argv[2]); NW = int(os.environ.get('RH_WORKERS', '4'))
def Z(t):
    ctx.prec = 64
    return float(dirichlet_char(q, q - 1).hardy_z(acb(t)).real.mid())
def vartheta(t): return 0.5 * t * math.log(q / math.pi) + float(mpmath.loggamma(mpmath.mpc(0.75, 0.5 * t)).imag)
def block(ab):
    a, b, div = ab; out = []
    t = a; zp = Z(t)
    while t < b:
        sp = 2 * math.pi / math.log(max(q * (t + 3) / (2 * math.pi), 2.0)); st = sp / div
        tn = min(t + st, b); zn = Z(tn)
        if zp == 0: zp = 1e-300
        if zp * zn < 0:
            lo, hi, zl = t, tn, zp
            for _ in range(14):
                m = (lo + hi) / 2; zm = Z(m)
                if zm * zl > 0: lo, zl = m, zm
                else: hi = m
            out.append((lo + hi) / 2)
        t, zp = tn, zn
    ex = (vartheta(b) - vartheta(a)) / math.pi
    return a, b, out, ex
if __name__ == '__main__':
    edges = np.linspace(0.05, TMAX, int(TMAX / 20) + 2)
    with Pool(NW) as p: res = p.map(block, [(a, b, 12) for a, b in zip(edges[:-1], edges[1:])], chunksize=4)
    # windows of 10 blocks: phase count - found; refine when |difference| > 1.6
    fix = []
    for i in range(0, len(res), 10):
        w = res[i:i + 10]; d = sum(r[3] for r in w) - sum(len(r[2]) for r in w)
        if abs(d) > 1.6: fix += list(range(i, min(i + 10, len(res))))
    print('q=%d blocks %d ; windows needing a finer pass: %d blocks' % (q, len(res), len(fix)), flush=True)
    if fix:
        with Pool(NW) as p: r2 = p.map(block, [(res[i][0], res[i][1], 96) for i in fix], chunksize=2)
        for i, r in zip(fix, r2):
            if len(r[2]) != len(res[i][2]): print('   block [%.2f, %.2f): %d -> %d zeros' % (r[0], r[1], len(res[i][2]), len(r[2])))
            res[i] = r
    g = np.array(sorted(z for r in res for z in r[2]))
    ex = sum(r[3] for r in res)
    worst = max(abs(sum(r[3] for r in res[i:i + 10]) - sum(len(r[2]) for r in res[i:i + 10])) for i in range(0, len(res), 10))
    print('q=%d zeros below %g: %d ; phase count %.2f ; difference %.2f ; largest window difference %.2f ; first zeros %s ; min gap %.4g' % (q, TMAX, len(g), ex + vartheta(0.05) / math.pi, ex + vartheta(0.05) / math.pi - len(g), worst, g[:3], np.diff(g).min()), flush=True)
    np.save(sys.argv[3], g)
