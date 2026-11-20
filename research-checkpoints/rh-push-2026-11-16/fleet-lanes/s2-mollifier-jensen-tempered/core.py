"""Shared code, lane s2-mollifier-jensen-tempered.
nufft_sym : f(tc + j h) = sum_n c_n exp(-i j h lam_n), j = -M/2..M/2-1, Gaussian gridding + one FFT (error ~1e-10).
AFE       : smooth approximate functional equation, cutoff g(x) = Phi(-a ln x), first 1/t correction included,
            F(s) = D(sigma,t) + X(s) conj(D(1-sigma,t)),  F'(s) = D1(sigma,t) + X'(s) conj(D(1-sigma,t)) - X(s) conj(D1(1-sigma,t)).
Phases t*ln n are reduced mod 2 pi in numpy longdouble (80-bit on x86; plain double on arm64, use small t there).
xp = cupy when available (one device, pool limit set), else numpy. float64 GPU output is a screen."""
import math, os, sys
import numpy as np
import mpmath as mp
try:
    if os.environ.get('S2_NOGPU'): raise ImportError
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('S2_POOL_GB', '12')) * 1024**3))
    xp = cp; GPU = True
except Exception:
    cp = None; xp = np; GPU = False
LD = np.longdouble
PI_LD = LD('3.14159265358979323846264338327950288'); TWOPI_LD = 2 * PI_LD
EXT = np.finfo(LD).nmant >= 63

def asnp(a):
    return cp.asnumpy(a) if GPU and isinstance(a, cp.ndarray) else np.asarray(a)

def announce(what, nbytes):
    print('planned allocation: %s = %.1f MB' % (what, nbytes / 1e6), flush=True)

KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
CHI5 = np.array([0, 1, 1j, -1j, -1], dtype=np.complex128)
C1 = (1 - 1j * KAPPA) / 2; C2 = (1 + 1j * KAPPA) / 2
DHPER = np.array([0, 1, KAPPA, -KAPPA, -1.0])
TAU5 = sum(CHI5[a] * np.exp(2j * np.pi * a / 5) for a in range(1, 5))
EPS5 = TAU5 / (1j * math.sqrt(5))

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]

def mobius_upto(n):
    mu = np.ones(n + 1, dtype=np.int8); mu[0] = 0
    for p in primes_upto(n):
        mu[p::p] *= -1; mu[p*p::p*p] = 0
    return mu

def dirichlet_inverse(a, n):
    b = np.zeros(n + 1, dtype=np.complex128); b[1] = 1
    for m in range(1, n // 2 + 1):
        if b[m] != 0:
            ks = np.arange(2, n // m + 1)
            b[m * ks] -= b[m] * a[ks]
    return b

_LN = {}
def lnn_ld(S):
    """ln n, n = 1..S, longdouble (cached, grown on demand)"""
    if 'a' not in _LN or len(_LN['a']) < S:
        _LN['a'] = np.log(np.arange(1, S + 1, dtype=LD))
    return _LN['a'][:S]

def reduce_phase(tc, lam_ld):
    """(tc * lam) mod 2 pi as float64; tc python float (exact), lam longdouble array"""
    return np.fmod(LD(tc) * lam_ld, TWOPI_LD).astype(np.float64)

TAU = 1.2; WH = 11
def nufft_sym(lam, c, h, M):
    """lam: xp float64 (S,), c: xp complex128 (S,). Returns xp complex (M,), entry i <-> j = i - M/2."""
    Mg = 2 * M
    p = xp.mod(lam * (h / (2 * math.pi)), 1.0) * Mg
    k0 = xp.rint(p); d = p - k0; k0 = k0.astype(xp.int64)
    gr = xp.zeros(Mg); gi = xp.zeros(Mg)
    offs = xp.arange(-WH, WH + 1)
    CH = 1 << 20
    for s0 in range(0, len(c), CH):
        dd = d[s0:s0 + CH]; kk = k0[s0:s0 + CH]; cc = c[s0:s0 + CH]
        w = xp.exp(-(offs[None, :] - dd[:, None]) ** 2 / (4 * TAU))
        idx = xp.mod(kk[:, None] + offs[None, :], Mg).ravel()
        gr += xp.bincount(idx, weights=(w * cc.real[:, None]).ravel(), minlength=Mg)
        gi += xp.bincount(idx, weights=(w * cc.imag[:, None]).ravel(), minlength=Mg)
        del w, idx
    G = xp.fft.fft(gr + 1j * gi)
    del gr, gi
    j = xp.arange(-M // 2, M // 2)
    out = G[xp.mod(j, Mg)] / (math.sqrt(4 * math.pi * TAU) * xp.exp(-4 * math.pi**2 * TAU * (j / Mg) ** 2))
    return out

def dk_table(v, a, kmax):
    """D^k g at v = a (ln n - ln N), g = Phi(-v): D^0 = Phi(-v), D^k = a^k He_{k-1}(v) phi(v)"""
    from math import sqrt, pi
    if GPU:
        import cupyx.scipy.special as sps
    else:
        import scipy.special as sps
    out = [0.5 * sps.erfc(v / sqrt(2))]
    ph = xp.exp(-v * v / 2) / sqrt(2 * pi)
    He0 = xp.ones_like(v); He1 = v
    for k in range(1, kmax + 1):
        He = He0 if k == 1 else He1
        out.append(a**k * He * ph)
        if k >= 2:
            He0, He1 = He1, v * He1 - (k - 1) * He0
    return out

class Win:
    """uniform grid t = tc + j h, j = -M/2..M/2-1"""
    def __init__(self, tc, h, M, Smax):
        self.tc = float(tc); self.h = float(h); self.M = int(M)
        self.tau = (xp.arange(-M // 2, M // 2)) * self.h
        self.S = int(Smax)
        l = lnn_ld(self.S)
        self.ln = xp.asarray(l.astype(np.float64))
        self.ph = xp.asarray(reduce_phase(self.tc, l))
        self.e = xp.exp(-1j * self.ph)          # n^{-i tc}
    def dsum(self, coef):
        """sum_{n<=len(coef)} coef_n n^{-it}; coef xp complex indexed from n = 1"""
        S = len(coef)
        return nufft_sym(self.ln[:S], coef * self.e[:S], self.h, self.M)

def afe_sums(win, sigma, q, kappa, coef, a=4.0, K=None, deriv=True):
    """D(sigma,t), D1(sigma,t) = -i d/dt D on the window. coef: xp complex, coef[n-1] = a_n (at least Smax entries)."""
    tc = win.tc; Nc = math.sqrt(q * tc / (2 * math.pi))
    S = min(int(Nc * math.exp(7.5 / a)) + 1, win.S)
    assert S <= len(coef), (S, len(coef))
    emax = 0.5 * math.log1p(win.h * win.M / 2 / tc)
    if K is None:
        K = 0
        while (a * emax) ** (K + 1) / math.factorial(K + 1) * 3 > 3e-9: K += 1
    ln = win.ln[:S]; v = a * (ln - math.log(Nc))
    Dk = dk_table(v, a, K + 2)
    base = coef[:S] * xp.exp(-sigma * ln) * win.e[:S]
    c0 = (sigma + kappa - 1) / 2
    eps = 0.5 * xp.log1p(win.tau / tc)
    D = 0; D1 = 0; f = 1.0
    for k in range(K + 1):
        Wk = Dk[k] - (1j / tc) * (Dk[k + 2] / 4 + c0 * Dk[k + 1])
        A = nufft_sym(ln, base * Wk, win.h, win.M)
        D = D + f * A
        if deriv:
            B = nufft_sym(ln, base * (-ln * Wk - 1j * Dk[k + 1] / (2 * tc)), win.h, win.M)
            D1 = D1 + f * B
        f = f * eps / (k + 1)
    return D, D1

def xfac(win, sigma, q, kappa, epsroot=1.0, KX=7):
    """X(s) and X'(s)/X(s) on the window; X = eps Q^{1-2s} Gamma((1-s+kappa)/2)/Gamma((s+kappa)/2), Q^2 = q/pi."""
    mp.mp.dps = 40
    s = mp.mpc(sigma, win.tc); lq = mp.log(mp.mpf(q) / mp.pi)
    z1 = (1 - s + kappa) / 2; z2 = (s + kappa) / 2
    lx = (mp.mpf(1) / 2 - s) * lq + mp.loggamma(z1) - mp.loggamma(z2) + mp.log(mp.mpc(epsroot))
    lx = mp.mpc(lx.real, lx.imag - 2 * mp.pi * mp.floor(lx.imag / (2 * mp.pi)))
    Ls = [complex(-lq - mp.psi(0, z1) / 2 - mp.psi(0, z2) / 2)]
    for k in range(2, KX + 1):
        Ls.append(complex(-(mp.mpf(1) / 2) * ((-mp.mpf(1) / 2) ** (k - 1) * mp.psi(k - 1, z1) + (mp.mpf(1) / 2) ** (k - 1) * mp.psi(k - 1, z2))))
    it = 1j * win.tau
    logX = xp.zeros(win.M, dtype=xp.complex128); xpx = xp.zeros(win.M, dtype=xp.complex128)
    pw = xp.ones(win.M, dtype=xp.complex128)       # (i tau)^{k-1}/(k-1)!
    for k in range(1, KX + 1):
        xpx += Ls[k - 1] * pw
        pw = pw * it / k
        logX += Ls[k - 1] * pw
    X = xp.exp(logX + complex(lx))
    return X, xpx

def F_and_deriv(win, sigma, q, kappa, coef, coef_dual_conj=None, epsroot=1.0, a=4.0, K=None, KX=7):
    """F(sigma + i t), F'(sigma + i t) on the window for the Dirichlet series with coefficients coef (primitive, conductor q, parity kappa)."""
    D, D1 = afe_sums(win, sigma, q, kappa, coef, a, K)
    Dm, Dm1 = afe_sums(win, 1 - sigma, q, kappa, coef, a, K)
    X, xpx = xfac(win, sigma, q, kappa, epsroot, KX)
    F = D + X * xp.conj(Dm)
    Fp = D1 + X * (xpx * xp.conj(Dm) - xp.conj(Dm1))
    return F, Fp

def phasor(lam, win):
    """exp(i lam t) on the window, lam python float; phase at tc reduced with mpmath"""
    mp.mp.dps = 40
    r = mp.mpf(lam) * mp.mpf(win.tc); r = float(r - 2 * mp.pi * mp.floor(r / (2 * mp.pi)))
    return xp.exp(1j * (r + lam * win.tau))
