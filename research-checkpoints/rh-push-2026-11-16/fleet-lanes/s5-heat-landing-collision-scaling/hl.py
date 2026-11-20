"""Shared library, lane s5-heat-landing-collision-scaling.
Contents: ctypes wrappers of kern.c; the forward heat flow of a zero set with non-real conjugate pairs
(d_t H = -H_zz, dz_k/dt = 2 sum' 1/(z_k - z_j), z = 2 gamma - 2 i (beta - 1/2)); density tails; list loaders.
All float64 unless a routine says long double."""
import ctypes, os, math, time, json, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
_k = ctypes.CDLL(os.path.join(HERE, 'kern.so'))
_kl = ctypes.CDLL(os.path.join(HERE, 'kernl.so')) if os.path.exists(os.path.join(HERE, 'kernl.so')) else None
_dp = np.ctypeslib.ndpointer(np.float64, flags='C_CONTIGUOUS')
_lp = np.ctypeslib.ndpointer(np.longdouble, flags='C_CONTIGUOUS')
_L = ctypes.c_long
_k.forces_complex.argtypes = [_L, _L, _dp, _dp, _dp, _dp, ctypes.c_int]
_k.forces_real.argtypes = [_L, _dp, _dp]
_k.pair_S.argtypes = [_L, _dp, _L, _dp]
_k.disc_lag.argtypes = [_L, _dp, _L, _dp]
_k.disc_windows.argtypes = [_L, _dp, _L, _dp]
_k.prime_sum.argtypes = [_L, _dp, _dp, _L, _dp, _dp]
if _kl is not None:
    _kl.forces_complex.argtypes = [_L, _L, _lp, _lp, _lp, _lp, ctypes.c_int]
    _kl.forces_real.argtypes = [_L, _lp, _lp]

def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)

def forces_real(x, ld=False):
    x = np.ascontiguousarray(x, dtype=np.longdouble if ld else np.float64); F = np.empty_like(x)
    (_kl if ld else _k).forces_real(len(x), x, F); return F

def pair_S(x, J):
    x = np.ascontiguousarray(x, dtype=np.float64); S = np.full(len(x), np.nan); _k.pair_S(len(x), x, J, S); return S

def disc_lag(x, K):
    x = np.ascontiguousarray(x, dtype=np.float64); D = np.full(len(x), np.nan); _k.disc_lag(len(x), x, K, D); return D

def disc_windows(x, N):
    x = np.ascontiguousarray(x, dtype=np.float64); W = np.empty(len(x) // N); _k.disc_windows(len(x), x, N, W); return W

def prime_sum(logn, coef, x):
    logn = np.ascontiguousarray(logn, dtype=np.float64); coef = np.ascontiguousarray(coef, dtype=np.float64)
    x = np.ascontiguousarray(x, dtype=np.float64); out = np.empty(len(x)); _k.prime_sum(len(logn), logn, coef, len(x), x, out); return out

# ------------------------------------------------------------------ forward heat flow with non-real pairs
class Flow:
    """State: r (real zeros, Re > 0 when mirror), pairs (c, u): the two members are c +- sqrt(u)/2; u < 0 is a conjugate
    pair with Im = sqrt(-u)/2, u > 0 a real pair of gap sqrt(u). c' and u' are regular through u = 0:
      c' = (v1 + v2)/2,  u' = 8 + 2 sqrt(u) (v1 - v2),  v = 2 * (sum over all other zeros, the partner excluded).
    mirror=True adds the zeros -z. tail = (m, kappa, H): zeros beyond |Re z| > H replaced by the density
    (m/4pi)(log s + kappa) (mirror) ; tail = ('const', rho, H) for a constant density without mirror (validation)."""
    def __init__(self, r, c, u, mirror=True, tail=None, ld=False):
        self.ld = ld; self.ft = np.longdouble if ld else np.float64
        self.ns = len(r); self.np = len(c); self.mirror = mirror; self.tail = tail
        self.s = np.concatenate([np.asarray(r, self.ft), np.asarray(c, self.ft), np.asarray(u, self.ft)])
        self.t = self.ft(0); self.nev = 0
        self.land = np.full(self.np, np.nan); self.landx = np.full(self.np, np.nan)

    def split(self, s): return s[:self.ns], s[self.ns:self.ns + self.np], s[self.ns + self.np:]

    def positions(self, s):
        r, c, u = self.split(s)
        q = np.sqrt(np.abs(u)) / 2
        x = np.empty(self.ns + 2 * self.np, self.ft); y = np.zeros(self.ns + 2 * self.np, self.ft)
        x[:self.ns] = r
        re = np.where(u > 0, q, 0); im = np.where(u > 0, 0, q)
        x[self.ns::2] = c + re; x[self.ns + 1::2] = c - re; y[self.ns::2] = im; y[self.ns + 1::2] = -im
        return x, y

    def tailv(self, x, y):
        if self.tail is None: return 0 * x, 0 * y
        z = x.astype(np.complex128) + 1j * y.astype(np.complex128)
        if self.tail[0] == 'const':
            _, rho, H = self.tail
            v = 2 * rho * np.log((H - z) / (H + z))
            return v.real, v.imag
        m, kappa, H = self.tail
        w = z / H; kp = math.log(H) + kappa
        acc = np.zeros_like(w); p = w.copy(); w2 = w * w
        for j in range(0, 400):
            acc += p * (kp / (2 * j + 1) + 1.0 / (2 * j + 1) ** 2); p *= w2
            if j > 20 and np.abs(p).max() < 1e-17: break
        v = -(m / math.pi) * acc
        v[np.abs(w) > 0.995] = 0
        return v.real, v.imag

    def rhs(self, s):
        self.nev += 1
        x, y = self.positions(s)
        vx = np.empty_like(x); vy = np.empty_like(y)
        (_kl if self.ld else _k).forces_complex(self.ns, self.np, np.ascontiguousarray(x), np.ascontiguousarray(y), vx, vy, int(self.mirror))
        tx, ty = self.tailv(x, y)
        vx = 2 * vx + tx; vy = 2 * vy + ty
        r, c, u = self.split(s)
        d = np.empty_like(s)
        d[:self.ns] = vx[:self.ns]
        v1x = vx[self.ns::2]; v2x = vx[self.ns + 1::2]; v1y = vy[self.ns::2]; v2y = vy[self.ns + 1::2]
        d[self.ns:self.ns + self.np] = 0.5 * (v1x + v2x)
        q = np.sqrt(np.abs(u))
        # sqrt(u) (v1 - v2): real pair q (v1x - v2x); conjugate pair (i q)(i (v1y - v2y)) = -q (v1y - v2y)
        d[self.ns + self.np:] = 8 + 2 * np.where(u > 0, q * (v1x - v2x), -q * (v1y - v2y))
        return d

    # Dormand-Prince 5(4)
    A = [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9], [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
         [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]]
    B5 = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0]
    B4 = [5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40]

    def run(self, tend, stops=(), rtol=1e-9, atol=1e-10, dt0=1e-7, dtmax=5e-3, on_stop=None, maxsteps=200000, verbose=True, stop_when_landed=True):
        s = self.s; t = float(self.t); dt = dt0
        k1 = self.rhs(s); stops = sorted(st for st in stops if st > t); nst = 0; nrej = 0
        iu = slice(self.ns + self.np, None)
        while t < tend - 1e-15 and nst < maxsteps:
            target = stops[0] if stops else tend
            h = min(dt, target - t, dtmax)
            ks = [k1]
            for i in range(1, 7):
                si = s + h * sum(a * k for a, k in zip(self.A[i], ks) if a != 0)
                ks.append(self.rhs(si))
            s5 = s + h * sum(b * k for b, k in zip(self.B5, ks) if b != 0)
            e = h * sum((b5 - b4) * k for b5, b4, k in zip(self.B5, self.B4, ks))
            sc = atol + rtol * np.maximum(np.abs(s), np.abs(s5)); sc[:self.ns + self.np] = atol + rtol * 1.0
            err = float(np.max(np.abs(e) / sc))
            if not np.isfinite(err): err = 1e9
            if err <= 1.0:
                u0 = s[iu]; u1 = s5[iu]; cross = (u0 < 0) & (u1 >= 0)
                if cross.any():
                    d0 = k1[iu][cross]; d1 = ks[6][iu][cross]; a0 = u0[cross]; a1 = u1[cross]
                    th = -a0 / (a1 - a0)
                    for _ in range(30):           # root of the cubic Hermite interpolant
                        h00 = 2 * th ** 3 - 3 * th ** 2 + 1; h10 = th ** 3 - 2 * th ** 2 + th; h01 = -2 * th ** 3 + 3 * th ** 2; h11 = th ** 3 - th ** 2
                        f = h00 * a0 + h10 * h * d0 + h01 * a1 + h11 * h * d1
                        fp = (6 * th ** 2 - 6 * th) * a0 + (3 * th ** 2 - 4 * th + 1) * h * d0 + (-6 * th ** 2 + 6 * th) * a1 + (3 * th ** 2 - 2 * th) * h * d1
                        th = np.clip(th - f / fp, 0, 1)
                    idx = np.nonzero(cross)[0]
                    self.land[idx] = t + h * th.astype(np.float64)
                    self.landx[idx] = s5[self.ns:self.ns + self.np][idx].astype(np.float64)
                t += h; s = s5; k1 = ks[6]; nst += 1
                if stops and abs(t - stops[0]) < 1e-14:
                    self.s = s; self.t = t
                    if on_stop: on_stop(self, stops[0])
                    stops.pop(0)
                if verbose and nst % 25 == 0:
                    log('step %d t=%.6f h=%.2e err=%.2f unlanded=%d rej=%d' % (nst, t, h, err, int((s[iu] < 0).sum()), nrej))
                if stop_when_landed and not (s[iu] < 0).any() and not stops: break
            else: nrej += 1
            dt = h * min(5.0, max(0.2, 0.9 * (1.0 / max(err, 1e-10)) ** 0.2))
        self.s = s; self.t = t; self.steps = nst; self.rejected = nrej
        return self

# ------------------------------------------------------------------ static landing estimates
def poisson_real(X, Y, reals, W=400.0):
    """P(X, Y) = sum over real zeros r of Y/((X-r)^2+Y^2), zeros within W of X, both signs of r, plus nothing for the rest."""
    lo = np.searchsorted(reals, X - W); hi = np.searchsorted(reals, X + W)
    rr = reals[lo:hi]
    out = (Y[:, None] / ((X - rr[None, :]) ** 2 + Y[:, None] ** 2)).sum(1)
    if X < W: out = out + (Y[:, None] / ((X + reals[:np.searchsorted(reals, W - X)][None, :]) ** 2 + Y[:, None] ** 2)).sum(1)
    return out

def rung_time(X, Y0, reals, rho, W=400.0, n=200):
    """landing time of Y' = -1/Y - 2 P_0(X, Y), P_0 the Poisson mass of the real zeros frozen at t = 0:
    T = int_0^Y0 Y dY / (1 + 2 Y P_0(X, Y)).  Zeros farther than W contribute 2 rho Y / W (added)."""
    xg, wg = np.polynomial.legendre.leggauss(n)
    Y = 0.5 * Y0 * (xg + 1); w = 0.5 * Y0 * wg
    P = poisson_real(X, Y, reals, W) + 2 * rho * Y / W
    return float((w * Y / (1 + 2 * Y * P)).sum()), float(P[-1])

# ------------------------------------------------------------------ densities, unfolding
def rho_gamma(T, Q=1.0, m=1):
    """smooth density of ordinates at height T for degree m and conductor Q: (m/2pi) log(Q^(1/m) T/2pi)"""
    return m / (2 * math.pi) * np.log(Q ** (1.0 / m) * np.asarray(T, dtype=np.float64) / (2 * math.pi))

def unfold(g, Q=1.0):
    g = np.asarray(g, dtype=np.float64)
    return g / (2 * math.pi) * (np.log(Q * g / (2 * math.pi)) - 1)

def jdump(o, fn):
    def conv(v):
        if isinstance(v, (np.floating,)): return float(v)
        if isinstance(v, (np.integer,)): return int(v)
        if isinstance(v, np.ndarray): return v.tolist()
        raise TypeError(type(v))
    json.dump(o, open(fn, 'w'), indent=1, default=conv)
