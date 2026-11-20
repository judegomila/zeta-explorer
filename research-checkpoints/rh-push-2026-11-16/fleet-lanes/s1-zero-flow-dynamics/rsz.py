"""Riemann-Siegel zero finder for a block [T0, T0+Delta], double precision with mp-precomputed phases.
Z(t) sampled at 4x the Nyquist rate (band limit L/2), upsampled 8x by Gaussian-windowed sinc, roots by local cubic.
Usage: rs_zeros.py T0 NZEROS OUT.npz [device]
Output: delta (gamma - T0), x (unfolded: (theta(gamma)-theta(T0))/pi), meta.
"""
import sys, time, math, numpy as np, mpmath as mp
from numpy.polynomial import chebyshev as Ch

def psi_tables():
    mp.mp.dps = 60
    deg = 56
    k = np.arange(deg + 1)
    nodes = [(mp.mpf(1) + mp.cos(mp.pi * (2 * int(i) + 1) / (2 * (deg + 1)))) / 2 for i in k]
    vals = [mp.cos(2 * mp.pi * (p * p - p - mp.mpf(1) / 16)) / mp.cos(2 * mp.pi * p) for p in nodes]
    xs = np.array([float(2 * p - 1) for p in nodes]); vs = np.array([float(v) for v in vals])
    c0 = Ch.chebfit(xs, vs, deg)
    d = [c0]
    for _ in range(6): d.append(Ch.chebder(d[-1]) * 2.0)  # d/dp = 2 d/dx
    C0 = d[0]; C1 = -d[3] / (96 * math.pi ** 2)
    C2 = Ch.chebadd(d[2] / (64 * math.pi ** 2), d[6] / (18432 * math.pi ** 4))
    return C0, C1, C2

def dtheta(T0, d):
    """theta(T0+d) - theta(T0), double, stable for d << T0"""
    eps = d / T0
    return 0.5 * d * math.log(T0 / (2 * math.pi)) + 0.5 * T0 * ((1 + eps) * np.log1p(eps) - eps) + (1 / (48 * (T0 + d)) - 1 / (48 * T0))

def sample_Z(T0, deltas, device='cpu', budget=4e8, log=None, tau=0.0):
    """Z(T0+delta) for delta array (float64)."""
    import torch
    mp.mp.dps = 60
    T0m = mp.mpf(T0)
    dmax = float(deltas.max())
    Nmax = int(math.floor(math.sqrt((T0 + dmax) / (2 * math.pi)))) + 1
    th0 = mp.siegeltheta(T0m)
    twopi = 2 * mp.pi
    t1 = time.time()
    c = np.empty(Nmax + 1); 
    for n in range(1, Nmax + 1):
        v = th0 - T0m * mp.log(n)
        c[n] = float(v - twopi * mp.floor(v / twopi))
    if log: log('phases %d terms %.1fs' % (Nmax, time.time() - t1))
    C0, C1, C2 = psi_tables()
    dev = torch.device(device)
    n_all = torch.arange(1, Nmax + 1, dtype=torch.float64, device=dev)
    logn = torch.log(n_all); amp = 2.0 / torch.sqrt(n_all); cn = torch.tensor(c[1:], dtype=torch.float64, device=dev)
    out = np.empty(len(deltas))
    B = max(16, int(budget // Nmax))
    L0 = math.log(T0 / (2 * math.pi)); th = 16 * math.pi ** 2 * tau / L0 ** 2   # heat time t (convention dH/dt = -H_zz, z = 2 gamma)
    if tau: amp = amp * torch.exp(0.25 * th * logn * logn)
    t1 = time.time()
    for s in range(0, len(deltas), B):
        d = deltas[s:s + B]
        tau_ = (T0 + d) / (2 * math.pi)
        rt = np.sqrt(tau_); N = np.floor(rt).astype(np.int64); p = rt - N
        dth = dtheta(T0, d)
        Nmin = int(N.min()); Nmx = int(N.max())
        dt_ = torch.tensor(d, dtype=torch.float64, device=dev); dth_ = torch.tensor(dth, dtype=torch.float64, device=dev)
        ph = torch.outer(dt_, logn[:Nmin]); ph.neg_(); ph.add_(cn[:Nmin][None, :]); ph.add_(dth_[:, None]); ph.cos_()
        if tau:
            Lb = torch.tensor(np.log((T0 + d) / (2 * math.pi)), dtype=torch.float64, device=dev)
            dm = torch.outer(Lb, logn[:Nmin]); dm.mul_(-0.25 * th); dm.exp_(); ph.mul_(dm); del dm
        z = (ph @ amp[:Nmin]).cpu().numpy(); del ph
        for n in range(Nmin + 1, Nmx + 1):
            m = N >= n
            z[m] += 2.0 / math.sqrt(n) * np.cos(c[n] + dth[m] - d[m] * math.log(n)) * np.exp(-0.25 * th * math.log(n) * (np.log((T0 + d[m]) / (2 * math.pi)) - math.log(n)))
        xx = 2 * p - 1
        R = Ch.chebval(xx, C0) + Ch.chebval(xx, C1) / np.sqrt(tau_) + Ch.chebval(xx, C2) / tau_
        z += np.where(N % 2 == 1, 1.0, -1.0) * tau_ ** -0.25 * R * math.exp(-math.pi ** 2 * tau)
        out[s:s + B] = z
        if log and (s // B) % 200 == 0: log('  sampled %d/%d %.1fs' % (s + len(d), len(deltas), time.time() - t1))
    return out

OS = 4; U = 8; W = 20
def upsample(S):
    """S at step h -> fine grid at step h/U, valid for coarse index in [W, len-W). returns F aligned so F[i*U] = S[i]."""
    b = 0.5 * (1 - 1 / OS); s2 = W / (2 * math.pi * b)
    n = len(S); F = np.empty(n * U)
    F[0::U] = S
    k = np.arange(-W + 1, W + 1)
    for r in range(1, U):
        u = r / U - k
        w = np.sinc(u) * np.exp(-u * u / (2 * s2))
        # F[i*U + r] = sum_k S[i+k] w_k
        full = np.correlate(S, w, mode='full')  # full[j] = sum_k S[j - (len(w)-1) + kidx] w[kidx], kidx=0..2W-1, k = kidx - W + 1
        # want index i + k = j - (2W-1) + kidx  => j = i + W
        seg = full[W: W + n]
        F[r::U] = seg
    return F

def interp(S, t):
    """exact windowed-sinc interpolant of coarse samples S at coarse-index positions t (array)."""
    b = 0.5 * (1 - 1 / OS); s2 = W / (2 * math.pi * b)
    out = np.empty(len(t)); CH = 500000
    k = np.arange(-W + 1, W + 1)
    for a in range(0, len(t), CH):
        tt = t[a:a + CH]; i0 = np.floor(tt).astype(np.int64); fr = tt - i0
        u = fr[:, None] - k[None, :]
        w = np.sinc(u) * np.exp(-u * u / (2 * s2))
        out[a:a + CH] = (S[i0[:, None] + k[None, :]] * w).sum(1)
    return out

def polish(S, r, iters=2):
    """Newton polish of roots r (coarse-index units) on the exact interpolant."""
    e = 1e-4
    for _ in range(iters):
        f0 = interp(S, r); f1 = interp(S, r + e); fm = interp(S, r - e)
        d = (f1 - fm) / (2 * e)
        step = np.clip(f0 / d, -0.01, 0.01)
        r = r - step
    return r

def find_roots(F, lo, hi):
    """roots of the function sampled on unit fine grid F, in fine-index units, restricted to [lo, hi)."""
    i = np.arange(lo, hi - 1)
    a = F[i]; b = F[i + 1]
    sc = i[(a * b < 0) | (a == 0)]
    ym, y0, y1, y2 = F[sc - 1], F[sc], F[sc + 1], F[sc + 2]
    # cubic Lagrange on nodes -1,0,1,2: p(s) = c0 + c1 s + c2 s^2 + c3 s^3
    c0 = y0; c3 = (y2 - 3 * y1 + 3 * y0 - ym) / 6; c2 = (ym - 2 * y0 + y1) / 2; c1 = y1 - y0 - c2 - c3
    lo_ = np.zeros(len(sc)); hi_ = np.ones(len(sc)); sgn0 = np.sign(y0); sgn0[sgn0 == 0] = -np.sign(y1[sgn0 == 0])
    for _ in range(46):  # bisection on the cubic (sign change guaranteed on [0,1]); robust for close pairs
        s = 0.5 * (lo_ + hi_)
        f = c0 + s * (c1 + s * (c2 + s * c3))
        left = f * sgn0 > 0
        lo_ = np.where(left, s, lo_); hi_ = np.where(left, hi_, s)
    s = 0.5 * (lo_ + hi_)
    roots = [sc + s]
    # hidden pairs: local min of |F| without sign change, parabola crosses zero
    j = np.arange(max(lo, 1), hi - 1)
    fm, f0, fp_ = F[j - 1], F[j], F[j + 1]
    m = (fm * f0 > 0) & (f0 * fp_ > 0) & (np.abs(f0) < np.abs(fm)) & (np.abs(f0) <= np.abs(fp_))
    j = j[m]; fm, f0, fp_ = fm[m], f0[m], fp_[m]
    A = (fm - 2 * f0 + fp_) / 2; Bq = (fp_ - fm) / 2; disc = Bq * Bq - 4 * A * f0
    ok = disc > 0
    j = j[ok]; A = A[ok]; Bq = Bq[ok]; sq = np.sqrt(disc[ok])
    r1 = (-Bq - sq) / (2 * A); r2 = (-Bq + sq) / (2 * A)
    good = (np.abs(r1) < 1) & (np.abs(r2) < 1)
    nh = int(good.sum())
    roots.append(j[good] + r1[good]); roots.append(j[good] + r2[good])
    r = np.sort(np.concatenate(roots))
    return r, nh

def run(T0, nz, device='cpu', log=print, budget=4e8, tau=0.0):
    L = math.log(T0 / (2 * math.pi)); sp = 2 * math.pi / L; h = sp / OS
    J = int(nz * OS) + 2 * W + 8
    deltas = np.arange(J) * h
    t0 = time.time()
    S = sample_Z(T0, deltas, device, budget / (2 if tau else 1), log, tau)
    log('sampled %d points in %.1fs' % (J, time.time() - t0))
    SEG = 2000000; parts = []; nh = 0
    for s0 in range(W, J - W, SEG):
        s1 = min(s0 + SEG, J - W)
        Fs = upsample(S[s0 - W: s1 + W])
        rr, nn = find_roots(Fs, W * U, (s1 - s0 + W) * U + 1)
        parts.append(rr / U + (s0 - W)); nh += nn; del Fs
    r = np.concatenate(parts) * U
    rc = r / U
    rp = polish(S, rc)
    bad = int((np.diff(rp) <= 0).sum())
    log('polish: max shift %.3e (coarse units), order violations %d' % (np.abs(rp - rc).max(), bad))
    if bad == 0: rc = rp
    delta = rc * h
    x = dtheta(T0, delta) / math.pi
    expect = (dtheta(T0, (J - W) * h) - dtheta(T0, W * h)) / math.pi
    log('zeros %d expected %.2f hidden pairs %d  total %.1fs' % (len(r), expect, nh, time.time() - t0))
    return delta, x, dict(T0=T0, n=len(r), expect=expect, hidden=nh, h=h, tau=tau)

if __name__ == '__main__':
    T0 = int(float(sys.argv[1])); nz = int(float(sys.argv[2])); out = sys.argv[3]; dev = sys.argv[4] if len(sys.argv) > 4 else 'cpu'
    budget = float(sys.argv[5]) if len(sys.argv) > 5 else 4e8
    def log(s): print(s, flush=True)
    tau = float(sys.argv[6]) if len(sys.argv) > 6 else 0.0
    delta, x, meta = run(T0, nz, dev, log, budget, tau)
    np.savez(out, delta=delta, x=x, **meta)
