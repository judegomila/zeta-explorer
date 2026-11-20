"""On-line ordinates of zeta near heights T (Riemann-Siegel main sum + C0 term, float; brentq),
spot-checked against mpmath.siegelz. Writes zeros_<T>.json next to this script."""
import sys, os, json, math
import numpy as np
from scipy.optimize import brentq
HERE = os.path.dirname(os.path.abspath(__file__))
LD = np.longdouble

def theta(t):
    t = LD(t)
    return t / 2 * np.log(t / (2 * LD(np.pi))) - t / 2 - LD(np.pi) / 8 + 1 / (48 * t) + 7 / (5760 * t ** 3)
def Z(tarr):
    tarr = np.atleast_1d(np.asarray(tarr, dtype=LD))
    out = np.empty(tarr.shape, dtype=np.float64)
    for i, t in enumerate(tarr):
        a = np.sqrt(t / (2 * LD(np.pi)))
        N = int(a)
        p = float(a - N)
        n = np.arange(1, N + 1, dtype=LD)
        ph = theta(t) - t * np.log(n)
        ph = ph - np.floor(ph / (2 * LD(np.pi))) * (2 * LD(np.pi))
        s = 2 * np.sum(np.cos(ph.astype(np.float64)) / np.sqrt(n.astype(np.float64)))
        c0 = math.cos(2 * math.pi * (p * p - p - 1 / 16)) / math.cos(2 * math.pi * p)
        out[i] = s + (-1) ** (N - 1) * float(a) ** -0.5 * c0
    return out
def run(T, W):
    step = 0.004
    grid = T + np.arange(-W, W + step, step)
    print("planned grid points", grid.size, "terms", int(math.sqrt(T / 2 / math.pi)), flush=True)
    z = Z(grid)
    idx = np.nonzero(np.sign(z[:-1]) * np.sign(z[1:]) < 0)[0]
    zs = [brentq(lambda t: float(Z([t])[0]), float(grid[i]), float(grid[i + 1]), xtol=1e-11) for i in idx]
    expect = float((theta(T + W) - theta(T - W)) / LD(np.pi))
    import mpmath as mp
    mp.mp.dps = 25
    chk = []
    for g in zs[:: max(1, len(zs) // 6)][:6]:
        r = mp.findroot(mp.siegelz, mp.mpf(repr(g)))
        chk.append(abs(float(r) - g))
    rec = dict(T=T, W=W, count=len(zs), expected_from_theta=expect, max_spot_diff_vs_mpmath=max(chk), zeros_minus_T=[g - T for g in zs])
    json.dump(rec, open(os.path.join(HERE, "zeros_%g.json" % T), "w"))
    print("T", T, "count", len(zs), "expected", round(expect, 2), "spot diff", max(chk), flush=True)
if __name__ == "__main__":
    from multiprocessing import Pool
    Ts = [1e6, 1e7, 1e8, 1e9]
    with Pool(4) as p:
        p.starmap(run, [(T, 90.0) for T in Ts])
