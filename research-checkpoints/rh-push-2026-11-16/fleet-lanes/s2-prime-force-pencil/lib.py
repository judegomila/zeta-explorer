"""Shared library, lane s2-prime-force-pencil (screening). numpy/scipy only; float64 screen.
Objects: zero lists (read-only from lane s1-zero-flow-dynamics), phase functions, inter-zero extrema from the zero list,
mode matrices of the signed-force system, min-norm-point (Gordan margin) solver with cutting planes."""
import os, math, time, numpy as np
from concurrent.futures import ThreadPoolExecutor
from scipy.special import loggamma
from scipy.optimize import nnls

NW = int(os.environ.get('RH_WORKERS', '4'))
TWOPI = 2 * math.pi
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)

DATA = os.environ.get('S1DATA', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 's1-zero-flow-dynamics', 'data'))
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)

# ---------------------------------------------------------------- phases
def theta_zeta(t):
    """Riemann-Siegel theta reduced mod 2 pi (float64 out). Stirling series in long double for t >= 40, loggamma below."""
    t = np.asarray(t, dtype=np.float64); out = np.empty(t.shape)
    lo = t < 40
    if lo.any(): out[lo] = loggamma(0.25 + 0.5j * t[lo]).imag - 0.5 * t[lo] * math.log(math.pi)
    hi = ~lo
    if hi.any():
        x = t[hi].astype(np.longdouble); pi = np.longdouble(math.pi)
        v = x / 2 * np.log(x / (2 * pi)) - x / 2 - pi / 8 + 1 / (48 * x) + 7 / (5760 * x ** 3) + 31 / (80640 * x ** 5)
        out[hi] = (v - 2 * pi * np.floor(v / (2 * pi))).astype(np.float64)
    return out

def dtheta_zeta(t):
    t = np.asarray(t, dtype=np.float64); return 0.5 * np.log(t / TWOPI) - 1 / (48 * t * t)

def theta_chi5(t):
    """phase of the odd conductor-5 gamma factor without root number: (t/2) log(5/pi) + Im log Gamma(3/4 + i t/2)."""
    t = np.asarray(t, dtype=np.float64)
    return 0.5 * t * math.log(5 / math.pi) + loggamma(0.75 + 0.5j * t).imag

# ---------------------------------------------------------------- extrema from a zero list
def near_collisions(g, cond=1.0, thr=0.85, W=40, extra=None, sign0=+1.0, tmin=0.0):
    """Consecutive pairs (g[k], g[k+1]) with gap/(2 pi/log(cond*mid/2pi)) < thr. The inter-zero extremum x* is the root of
    sum_{|j-k|<=W} 1/(x-g[j]) + extra(x) = 0 in the gap (log-derivative of the Hadamard product, zeros beyond W dropped), by bisection.
    Sign of the function on (g[k], g[k+1]) = sign0 * (-1)^k (parity of the list index). Returns x*, s = sign F''(x*) = -sign F(x*),
    pair index k, tightness."""
    n = len(g); k = np.arange(n - 1); gap = np.diff(g); mid = 0.5 * (g[:-1] + g[1:])
    tight = gap / (TWOPI / np.log(np.maximum(cond * mid / TWOPI, 1.2)))
    sel = k[(tight < thr) & (mid > tmin)]
    xs = np.empty(len(sel)); CH = 200000
    gp = np.concatenate([np.full(W, -1e300), g, np.full(W, 1e300)])  # padding: absent neighbours contribute 0
    off = np.arange(-W + 1, W + 1)                                   # neighbours k-W+1 .. k+W around the gap (k, k+1)
    def work(a):
        kk = sel[a:a + CH]; nb = gp[kk[:, None] + off[None, :] + W]
        lo = g[kk].copy(); hi = g[kk + 1].copy()
        for _ in range(52):
            x = 0.5 * (lo + hi)
            S = (1.0 / (x[:, None] - nb)).sum(1)
            if extra is not None: S = S + extra(x)
            pos = S > 0
            lo = np.where(pos, x, lo); hi = np.where(pos, hi, x)
        xs[a:a + CH] = 0.5 * (lo + hi)
    with ThreadPoolExecutor(NW) as ex: list(ex.map(work, range(0, len(sel), CH)))
    sgnF = sign0 * np.where(sel % 2 == 0, 1.0, -1.0)
    return xs, -sgnF, sel, tight[sel]

# ---------------------------------------------------------------- mode matrices
class System:
    """rows g_k = s_k * a(x_k) / |a(x_k)|, a = (amp_n cos(th_k - x_k f_n))_n, optionally followed by the sin modes."""
    def __init__(self, x, s, th, freqs, amps, sin=False, rowscale=None):
        self.x = np.asarray(x); self.s = np.asarray(s); self.th = np.asarray(th)
        self.f = np.asarray(freqs, dtype=np.float64); self.a = np.asarray(amps, dtype=np.float64); self.sin = sin
        self.rowscale = rowscale  # optional (K, len(f)) multiplicative weights (off-line cosh factors): callable idx -> array
        self.K = len(self.x); self.dim = len(self.f) * (2 if sin else 1)
    def rows(self, idx):
        ph = self.th[idx][:, None] - np.outer(self.x[idx], self.f)
        A = np.cos(ph) * self.a
        if self.rowscale is not None: A = A * self.rowscale(idx)
        if self.sin:
            B = np.sin(ph) * self.a
            A = np.concatenate([A, B], axis=1)
        A *= (self.s[idx] / np.sqrt((A * A).sum(1)))[:, None]
        return A
    def dots(self, p, K=None, CH=None, cpu=False):
        """G[:K] @ p. Threaded numpy; with RH_GPU_DOTS=1 and real modes the float64 products are formed with cupy on the one visible device."""
        K = self.K if K is None else K
        if os.environ.get('RH_GPU_DOTS') == '1' and not cpu and not self.sin and self.rowscale is None:
            return self._dots_gpu(p, K)
        CH = CH or max(256, int(4e6 // self.dim))
        out = np.empty(K)
        def work(a):
            idx = np.arange(a, min(K, a + CH)); out[a:a + len(idx)] = self.rows(idx) @ p
        with ThreadPoolExecutor(NW) as ex: list(ex.map(work, range(0, K, CH)))
        return out
    def _dots_gpu(self, p, K):
        import cupy as cp
        if not hasattr(self, '_g'):
            cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('RH_POOL_GB', '16')) * 1024 ** 3))
            self._g = (cp.asarray(self.th), cp.asarray(self.x), cp.asarray(self.s), cp.asarray(self.f), cp.asarray(self.a))
            log('  gpu: planned chunk matrix %.2f GB (two live copies)' % (max(1024, int(GCH // self.dim)) * self.dim * 8 / 1e9))
        th, x, s, f, a = self._g; ap = a * cp.asarray(p); a2 = a * a
        CH = max(1024, int(GCH // self.dim)); out = cp.empty(K)
        for i in range(0, K, CH):
            j = min(K, i + CH)
            c = x[i:j, None] * f[None, :]; c *= -1.0; c += th[i:j, None]; cp.cos(c, out=c)
            num = c @ ap; c *= c; out[i:j] = s[i:j] * num / cp.sqrt(c @ a2); del c
        return cp.asnumpy(out)

GCH = float(os.environ.get('RH_GPU_CHUNK', '3e7'))

def minnorm(G):
    """min-norm point of conv(rows of G): nnls on [G^T; 1^T] lam = [0; 1]; the minimiser is a positive multiple of the simplex minimiser."""
    m, d = G.shape
    A = np.vstack([G.T, np.ones((1, m))]); b = np.zeros(d + 1); b[-1] = 1.0
    lam, _ = nnls(A, b, maxiter=50 * (m + d))
    ssum = lam.sum(); lam = lam / ssum
    return G.T @ lam, lam

def margin(sysm, K=None, W0=None, add=300, maxpass=200, tol=1e-7, verbose=False):
    """Gordan margin rho = dist(0, conv{g_k : k < K}) by cutting planes on a working set.
    Returns dict(rho_upper = |p|, rho_lower = min_k g_k.p / |p| (over all k < K), status, work = working set, lam, passes)."""
    K = sysm.K if K is None else K
    if W0 is None or len(W0) == 0:
        W0 = np.unique(np.linspace(0, K - 1, min(K, 2 * sysm.dim + 8)).astype(np.int64))
    Wk = np.array(sorted(set(int(i) for i in W0 if i < K)), dtype=np.int64)
    GW = sysm.rows(Wk)
    for it in range(maxpass):
        p, lam = minnorm(GW)
        r = float(np.linalg.norm(p))
        if r < tol:
            return dict(rho_upper=r, rho_lower=0.0, status='infeasible', work=Wk, lam=lam, passes=it)
        v = sysm.dots(p, K)
        vmin = float(v.min())
        if verbose: log('  pass %d |W| %d |p| %.6f min g.p/|p| %.6f' % (it, len(Wk), r, vmin / r))
        if vmin >= r * r * (1 - 1e-6) - 1e-12:
            return dict(rho_upper=r, rho_lower=vmin / r, status='feasible', work=Wk[lam > 0], lam=lam[lam > 0], passes=it, p=p)
        cand = np.argpartition(v, min(add, len(v) - 1))[:add] if len(v) > add else np.arange(len(v)); cand = cand[v[cand] < r * r * (1 - 1e-6)]
        new = np.setdiff1d(cand, Wk)
        keep = lam > 0
        Wk = np.concatenate([Wk[keep], new]); GW = np.vstack([GW[keep], sysm.rows(new)])
    return dict(rho_upper=r, rho_lower=vmin / r, status='maxpass', work=Wk, lam=lam, passes=maxpass, p=p)

# ---------------------------------------------------------------- lists
def load_list(name):
    """returns (ordinates, conductor, sign0)."""
    if name == 'zeta':
        for f in ('zeta_fixed.npy', 'zeta_1e7.npy'):
            p = os.path.join(DATA, f)
            if os.path.exists(p): return np.load(p), 1.0, +1.0
    if name in ('chi', 'chibar', 'dh', 'alt'):
        for pre in ('dir', 'dir2e5'):
            p = os.path.join(DATA, '%s_%s.npy' % (pre, name))
            if os.path.exists(p): return np.load(p), 5.0, +1.0
    if name.startswith('heat'):
        for pre in ('heat_', 'heatL_'):
            p = os.path.join(DATA, pre + name[4:] + '.npy')
            if os.path.exists(p): return np.load(p), 1.0, +1.0
    raise FileNotFoundError(name)

# ---------------------------------------------------------------- exact extrema at low height
def mp_extrema_zeta(x, g_lo, g_hi, extra_q=None, c=2.2):
    """mpmath: root of Z'/Z + extra in (g_lo, g_hi), start x (bisection on mp values of Z'/Z)."""
    import mpmath as mp
    mp.mp.dps = 20
    out = np.empty(len(x))
    for i in range(len(x)):
        def f(t):
            v = mp.siegelz(t, derivative=1) / mp.siegelz(t)
            if extra_q: v -= 2 * mp.log(extra_q) * mp.sin(t * mp.log(extra_q)) / (c + 2 * mp.cos(t * mp.log(extra_q)))
            return v
        lo = mp.mpf(float(g_lo[i])); hi = mp.mpf(float(g_hi[i])); e = (hi - lo) * mp.mpf('1e-6'); lo += e; hi -= e
        for _ in range(40):
            m = (lo + hi) / 2
            if f(m) > 0: lo = m
            else: hi = m
        out[i] = float((lo + hi) / 2)
    return out

_INTERP = dict(OS=4, W=24)
def sinc_interp(S, t, OS=4, W=24):
    """windowed-sinc interpolant (same kernel as lane s1-zero-flow-dynamics rsz.interp) of samples S at index positions t."""
    b = 0.5 * (1 - 1 / OS); s2 = W / (2 * math.pi * b)
    k = np.arange(-W + 1, W + 1); out = np.empty(len(t)); CH = 200000
    for a in range(0, len(t), CH):
        tt = t[a:a + CH]; i0 = np.floor(tt).astype(np.int64); fr = tt - i0
        u = fr[:, None] - k[None, :]
        w = np.sinc(u) * np.exp(-u * u / (2 * s2))
        out[a:a + CH] = (S[i0[:, None] + k[None, :]] * w).sum(1)
    return out

def refine_from_samples(x, lo, hi, S, h, OS=4, W=24):
    """extremum of the sampled function in (lo, hi): golden-free bisection on the centred difference of the interpolant. Returns x*, F(x*)."""
    a = lo / h; b = hi / h; e = 1e-4
    ok = (a > W + 2) & (b < len(S) - W - 2)
    a2 = a[ok].copy(); b2 = b[ok].copy()
    d = lambda t: sinc_interp(S, t + e, OS, W) - sinc_interp(S, t - e, OS, W)
    sa = np.sign(d(a2 + 1e-3 * (b2 - a2)))
    for _ in range(40):
        m = 0.5 * (a2 + b2); sm = np.sign(d(m)); left = sm == sa
        a2 = np.where(left, m, a2); b2 = np.where(left, b2, m)
    xo = x.copy(); xo[ok] = 0.5 * (a2 + b2) * h
    F = np.full(len(x), np.nan); F[ok] = sinc_interp(S, xo[ok] / h, OS, W)
    return xo, F, ok

# ---------------------------------------------------------------- Riemann-Siegel Z on a set of points
_PSI = None
def psi_tables():
    """Chebyshev tables of the Riemann-Siegel correction functions C0, C1, C2 on p in [0,1] (construction as in lane b-dyson-defect)."""
    global _PSI
    if _PSI is None:
        import mpmath as mp
        from numpy.polynomial import chebyshev as Ch
        mp.mp.dps = 60; deg = 56; k = np.arange(deg + 1)
        nodes = [(mp.mpf(1) + mp.cos(mp.pi * (2 * int(i) + 1) / (2 * (deg + 1)))) / 2 for i in k]
        vals = [mp.cos(2 * mp.pi * (p * p - p - mp.mpf(1) / 16)) / mp.cos(2 * mp.pi * p) for p in nodes]
        xs = np.array([float(2 * p - 1) for p in nodes]); vs = np.array([float(v) for v in vals])
        d = [Ch.chebfit(xs, vs, deg)]
        for _ in range(6): d.append(Ch.chebder(d[-1]) * 2.0)
        _PSI = (d[0], -d[3] / (96 * math.pi ** 2), Ch.chebadd(d[2] / (64 * math.pi ** 2), d[6] / (18432 * math.pi ** 4)))
    return _PSI

def hardy_Z(x, budget=3e6):
    """Z(x) for a float64 array x (x >= 30): main sum + C0, C1, C2. Threaded over chunks."""
    from numpy.polynomial import chebyshev as Ch
    C0, C1, C2 = psi_tables()
    x = np.asarray(x, dtype=np.float64); out = np.empty(len(x)); th = theta_zeta(x)
    Nall = int(math.sqrt(x.max() / TWOPI)) + 2
    logn = np.log(np.arange(1, Nall + 1.0)); amp = 2 / np.sqrt(np.arange(1, Nall + 1.0))
    order = np.argsort(x)
    CH = max(64, int(budget // Nall))
    def work(a):
        idx = order[a:a + CH]; xx = x[idx]; tt = xx / TWOPI; rt = np.sqrt(tt); N = np.floor(rt).astype(np.int64); p = rt - N
        Nmin = int(N.min()); Nmx = int(N.max())
        ph = th[idx][:, None] - np.outer(xx, logn[:Nmin]); np.cos(ph, out=ph); z = ph @ amp[:Nmin]
        for n in range(Nmin + 1, Nmx + 1):
            m = N >= n; z[m] += amp[n - 1] * np.cos(th[idx][m] - xx[m] * logn[n - 1])
        u = 2 * p - 1
        Rm = Ch.chebval(u, C0) + Ch.chebval(u, C1) / np.sqrt(tt) + Ch.chebval(u, C2) / tt
        out[idx] = z + np.where(N % 2 == 1, 1.0, -1.0) * tt ** -0.25 * Rm
    with ThreadPoolExecutor(NW) as ex: list(ex.map(work, range(0, len(x), CH)))
    return out
