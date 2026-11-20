"""Riemann-Siegel Z(t) on a block around T0 (double precision, mp-precomputed phases) and zeros by spline roots.
Usage: rs.py T0 HALF STEP OUT.npz
"""
import sys, time, math, numpy as np, mpmath as mp
from scipy.interpolate import CubicSpline

def dtheta(T0, d):
    eps = d / T0
    return 0.5 * d * math.log(T0 / (2 * math.pi)) + 0.5 * T0 * ((1 + eps) * np.log1p(eps) - eps) + (1 / (48 * (T0 + d)) - 1 / (48 * T0))

def C0(p):
    return np.cos(2 * np.pi * (p * p - p - 1.0 / 16)) / np.cos(2 * np.pi * p)

def sample_Z(T0, deltas, chunk_budget=6e7):
    mp.mp.dps = 50
    T0m = mp.mpf(T0)
    Nmax = int(math.floor(math.sqrt((T0 + float(deltas.max())) / (2 * math.pi)))) + 1
    th0 = mp.siegeltheta(T0m); twopi = 2 * mp.pi
    c = np.empty(Nmax + 1)
    for n in range(1, Nmax + 1):
        v = th0 - T0m * mp.log(n)
        c[n] = float(v - twopi * mp.floor(v / twopi))
    n_all = np.arange(1, Nmax + 1, dtype=np.float64)
    logn = np.log(n_all); amp = 2.0 / np.sqrt(n_all); cn = c[1:]
    out = np.empty(len(deltas))
    B = max(8, int(chunk_budget // Nmax))
    for s in range(0, len(deltas), B):
        d = deltas[s:s + B]
        tau = (T0 + d) / (2 * math.pi)
        rt = np.sqrt(tau); N = np.floor(rt).astype(np.int64); p = rt - N
        dth = dtheta(T0, d)
        Nmin = int(N.min()); Nmx = int(N.max())
        ph = np.outer(d, -logn[:Nmin]); ph += cn[:Nmin][None, :]; ph += dth[:, None]
        np.cos(ph, out=ph)
        z = ph @ amp[:Nmin]
        for n in range(Nmin + 1, Nmx + 1):
            m = N >= n
            z[m] += 2.0 / math.sqrt(n) * np.cos(c[n] + dth[m] - d[m] * math.log(n))
        z += np.where(N % 2 == 1, 1.0, -1.0) * tau ** -0.25 * C0(p)
        out[s:s + B] = z
    return out

def zeros_from_grid(d, z):
    cs = CubicSpline(d, z)
    r = cs.roots(extrapolate=False)
    r = r[np.isfinite(r)]
    return np.sort(r), cs

if __name__ == '__main__':
    T0 = float(sys.argv[1]); half = float(sys.argv[2]); step = float(sys.argv[3]); out = sys.argv[4]
    t1 = time.time()
    d = np.arange(-half, half + step / 2, step)
    z = sample_Z(T0, d)
    r, cs = zeros_from_grid(d, z)
    # expected count from theta
    exp = (dtheta(T0, np.array([half]))[0] - dtheta(T0, np.array([-half]))[0]) / math.pi
    print('T0=%g half=%g samples=%d zeros=%d expected(theta/pi)=%.2f time=%.1fs' % (T0, half, len(d), len(r), exp, time.time() - t1))
    g = np.diff(r); print('gap mean %.5f min %.5f max %.5f ; max|Z| %.3f' % (g.mean(), g.min(), g.max(), np.abs(z).max()))
    np.savez(out, T0=T0, d=d, z=z, zeros=r)
