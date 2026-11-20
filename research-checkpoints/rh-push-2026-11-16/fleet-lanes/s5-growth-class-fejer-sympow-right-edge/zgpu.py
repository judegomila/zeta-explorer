"""s2-derivative-zeros-two-line: float64 evaluator of zeta off the critical line at large height (cupy on one GPU, numpy fallback).
Riemann-Siegel formula continued analytically in tau = t - i x, s = 1/2 + i tau = 1/2 + x + i t:
   Z(tau) = e^{i theta(tau)} zeta(1/2 + i tau) = E S_x + conj(S_{-x}) / E + R(tau),
   S_x(delta) = sum_{n <= N} n^{-1/2-x} exp(i (c_n - delta log n)),  c_n = theta(T0) - T0 log n mod 2 pi (Arb, 192 bits),
   E = exp(i (theta(tau) - theta(T0))),  R = (-1)^{N-1} a^{-1/2} (C0(p) + C1(p)/a + C2(p)/a^2), a = sqrt(tau/2 pi), p = a - N.
Returned: Z, dZ/dtau, d2Z/dtau2 (complex arrays [nx, nt]).  zeta = e^{-i theta} Z,  zeta'/zeta = -i Z'/Z - theta'.
A window must lie inside one block of constant N = floor(sqrt(t/2 pi)).  float64 output is a screen."""
import math, os, time, numpy as np
from numpy.polynomial import chebyshev as Ch
GPU = False
try:
    if os.environ.get('RH_BACKEND') == 'cpu': raise ImportError
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=int(os.environ.get('RH_POOL_GB', '12')) * 1024 ** 3)
    xp.zeros(4).sum(); GPU = True
except Exception:
    import numpy as xp
PI = math.pi

def asnp(a): return xp.asnumpy(a) if GPU else np.asarray(a)
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)

_PSI = None
def psi_tables():
    global _PSI
    if _PSI is not None: return _PSI
    import mpmath as mp
    mp.mp.dps = 60
    deg = 56
    nodes = [(mp.mpf(1) + mp.cos(mp.pi * (2 * i + 1) / (2 * (deg + 1)))) / 2 for i in range(deg + 1)]
    vals = [mp.cos(2 * mp.pi * (p * p - p - mp.mpf(1) / 16)) / mp.cos(2 * mp.pi * p) for p in nodes]
    xs = np.array([float(2 * p - 1) for p in nodes]); vs = np.array([float(v) for v in vals])
    c0 = Ch.chebfit(xs, vs, deg)
    d = [c0]
    for _ in range(6): d.append(Ch.chebder(d[-1]) * 2.0)
    C0 = d[0]; C1 = -d[3] / (96 * PI ** 2)
    C2 = Ch.chebadd(d[2] / (64 * PI ** 2), d[6] / (18432 * PI ** 4))
    _PSI = (C0, C1, C2)
    return _PSI

def clenshaw(c, x):
    """Chebyshev series at (complex) numpy array x."""
    b1 = np.zeros_like(x); b2 = np.zeros_like(x)
    for ck in c[:0:-1]:
        b1, b2 = 2 * x * b1 - b2 + ck, b1
    return x * b1 - b2 + c[0]

def block_of(T):
    """(N, t_lo, t_hi): the block of constant N containing T."""
    N = int(math.floor(math.sqrt(T / (2 * PI))))
    return N, 2 * PI * N * N, 2 * PI * (N + 1) ** 2

def safe_T0(T, H, margin=2.0):
    """shift T upward if [T - margin, T + H + margin] straddles a block boundary."""
    N, lo, hi = block_of(T)
    if T + H + margin >= hi: T = hi + margin + 1e-3 * (hi - lo)
    if T - margin < block_of(T)[1]: T = block_of(T)[1] + margin
    return T

class Win:
    def __init__(self, T0):
        from flint import arb, acb, ctx
        old = ctx.prec; ctx.prec = 192
        self.T0 = float(T0)
        T = arb(T0)
        self.N = int(math.floor(math.sqrt(self.T0 / (2 * PI))))
        th0 = (acb(arb(1) / 4, T / 2).lgamma()).imag - T / 2 * arb.pi().log()
        twopi = 2 * arb.pi()
        c = np.empty(self.N)
        for n in range(1, self.N + 1):
            v = th0 - T * arb(n).log(); v = v - twopi * (v / twopi).floor()
            c[n - 1] = float(v.mid())
        v = th0 - twopi * (th0 / twopi).floor(); self.th0 = float(v.mid())
        ctx.prec = old
        n = np.arange(1, self.N + 1, dtype=np.float64)
        self.logn = xp.asarray(np.log(n)); self.c = xp.asarray(c); self.n = n

    def dtheta(self, d):
        """theta(T0 + d) - theta(T0), d complex numpy array, |d| <= 0.05 T0."""
        T0 = self.T0; e = d / T0
        ser = np.zeros_like(e); pw = e * e
        for k in range(2, 42):
            ser = ser + ((-1) ** k) * pw / (k * (k - 1)); pw = pw * e
        t1 = T0 + d
        return 0.5 * d * math.log(T0 / (2 * PI)) + 0.5 * T0 * ser + (1 / (48 * t1) - 1 / (48 * T0)) + 7.0 / 5760 * (t1 ** -3 - T0 ** -3)

    def thp(self, tau):
        return 0.5 * np.log(tau / (2 * PI)) - 1 / (48 * tau ** 2) - 7.0 / (1920 * tau ** 4), 1 / (2 * tau) + 1 / (24 * tau ** 3)

    def rem(self, tau):
        C0, C1, C2 = psi_tables()
        a = np.sqrt(tau / (2 * PI)); p = a - self.N; x = 2 * p - 1
        sg = 1.0 if self.N % 2 == 1 else -1.0
        return sg * a ** -0.5 * (clenshaw(C0, x) + clenshaw(C1, x) / a + clenshaw(C2, x) / a ** 2)

    def eval(self, deltas, xs, order=2, budget=float(os.environ.get("RH_BLOCK", "6e7"))):
        """Z, Z', Z'' at tau = T0 + delta - i x.  deltas: real array [nt]; xs: list [nx].  Returns numpy complex [nx, nt] each."""
        deltas = np.asarray(deltas, dtype=np.float64); xs = [float(x) for x in xs]
        lo, hi = 2 * PI * self.N ** 2, 2 * PI * (self.N + 1) ** 2
        assert self.T0 + deltas.min() > lo and self.T0 + deltas.max() < hi, 'window leaves the block of constant N'
        assert np.abs(deltas).max() <= 0.26 * self.T0
        ux = sorted(set(xs) | set(-x for x in xs)); ix = {x: i for i, x in enumerate(ux)}
        nw = len(ux); nt = len(deltas); N = self.N
        W = xp.empty(((order + 1) * nw, N), dtype=xp.complex128)
        for i, x in enumerate(ux):
            base = xp.exp(-(0.5 + x) * self.logn)
            for k in range(order + 1): W[k * nw + i] = base * self.logn ** k
        S = xp.empty((nt, (order + 1) * nw), dtype=xp.complex128)
        B = max(8, int(budget // N))
        dg = xp.asarray(deltas)
        for s in range(0, nt, B):
            ph = xp.outer(dg[s:s + B], self.logn); ph *= -1.0; ph += self.c[None, :]
            U = xp.exp(1j * ph); del ph
            S[s:s + B] = U @ W.T; del U
        S = asnp(S)
        nx = len(xs)
        Z = np.empty((nx, nt), dtype=np.complex128); Zp = np.empty_like(Z); Zpp = np.empty_like(Z) if order >= 2 else None
        h = 1e-3 * max(1.0, math.sqrt(self.T0) * 1e-2)
        for j, x in enumerate(xs):
            d = deltas - 1j * x; tau = self.T0 + d
            E = np.exp(1j * self.dtheta(d)); t1, t2 = self.thp(tau)
            a0 = E * S[:, ix[x]]; b0 = np.conj(S[:, ix[-x]]) / E
            R0 = self.rem(tau); Rp = self.rem(tau + h); Rm = self.rem(tau - h)
            Z[j] = a0 + b0 + R0
            if order >= 1:
                a1 = E * S[:, nw + ix[x]]; b1 = np.conj(S[:, nw + ix[-x]]) / E
                Zp[j] = 1j * (t1 * a0 - a1) - 1j * (t1 * b0 - b1) + (Rp - Rm) / (2 * h)
            if order >= 2:
                a2 = E * S[:, 2 * nw + ix[x]]; b2 = np.conj(S[:, 2 * nw + ix[-x]]) / E
                Zpp[j] = (1j * t2 - t1 * t1) * a0 + 2 * t1 * a1 - a2 + (-1j * t2 - t1 * t1) * b0 + 2 * t1 * b1 - b2 + (Rp - 2 * R0 + Rm) / (h * h)
        return Z, Zp, Zpp

    def zeta(self, deltas, xs, order=1):
        """zeta, zeta', (zeta'') at s = 1/2 + x + i (T0 + delta)."""
        Z, Zp, Zpp = self.eval(deltas, xs, order=max(order, 1) if order < 2 else 2)
        out = []
        z0 = np.empty_like(Z); z1 = np.empty_like(Z); z2 = np.empty_like(Z) if order >= 2 else None
        for j, x in enumerate(xs):
            d = np.asarray(deltas) - 1j * x; tau = self.T0 + d
            e = np.exp(-1j * (self.th0 + self.dtheta(d))); t1, t2 = self.thp(tau)
            z0[j] = e * Z[j]; z1[j] = -1j * e * (Zp[j] - 1j * t1 * Z[j])
            if order >= 2: z2[j] = -e * (Zpp[j] - 2j * t1 * Zp[j] - 1j * t2 * Z[j] - t1 * t1 * Z[j])
        return z0, z1, z2

def arb_zeta_jet(s_re, T0, d=0.0, prec=160, n=3):
    """exact reference: zeta, zeta', zeta'' at s = s_re + i (T0 + d) by central differences of acb.zeta (Riemann-Siegel
    inside Arb).  T0 and d are added in Arb: the float sum T0 + d is rounded at 1e9 (ulp 1.2e-7)."""
    from flint import arb, acb, ctx
    old = ctx.prec; ctx.prec = prec + 200
    h = arb(2) ** (-60)
    s = acb(arb(s_re), arb(T0) + arb(d))
    f0 = s.zeta(); fp = (s + h).zeta(); fm = (s - h).zeta()
    out = [f0, (fp - fm) / (2 * h), (fp - 2 * f0 + fm) / (h * h)][:n]
    ctx.prec = old
    return [complex(float(v.real.mid()), float(v.imag.mid())) for v in out]

if __name__ == '__main__':
    import sys
    log('backend', 'cupy' if GPU else 'numpy')
    worst = 0
    for T in [float(a) for a in sys.argv[1:]] or [1e4, 1e6]:
        T0 = safe_T0(T, 20)
        w = Win(T0)
        dl = np.array([0.0, 0.37, 5.11, 13.3, 19.9]); xs = [-0.49, -0.2, 0.0, 0.01, 0.3, 0.5, 1.0]
        t = time.time(); z0, z1, z2 = w.zeta(dl, xs, order=2); el = time.time() - t
        for j, x in enumerate(xs):
            for k, d in enumerate(dl):
                r = arb_zeta_jet(0.5 + x, T0, d)
                e = [abs(z0[j, k] - r[0]) / abs(r[0]), abs(z1[j, k] - r[1]) / abs(r[1]), abs(z2[j, k] - r[2]) / abs(r[2])]
                worst = max(worst, max(e))
                if k == 1: print('T0 %.6g x %+.2f d %.2f  rel err zeta %.2e  zeta\' %.2e  zeta\'\' %.2e   |zeta| %.3e' % (T0, x, d, e[0], e[1], e[2], abs(r[0])), flush=True)
        log('T0 %.6g N %d time %.2fs' % (T0, w.N, el))
    print('worst relative error', worst)
