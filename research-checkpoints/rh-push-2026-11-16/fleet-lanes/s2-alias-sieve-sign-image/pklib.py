"""pklib.py -- shared code of lane s2-alias-sieve-sign-image (ctypes wrapper of pk.c, Gram / theta_phys,
main term, statistics).  No repository module is imported."""
import ctypes, os, math
from fractions import Fraction
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
_lib = None
VARIANTS = ["ZETA", "CHI101", "SGN", "UNI", "EA", "CHI5", "TNR"]
NV = 7
POLE = {"ZETA": True, "EA": True, "TNR": True}
SIGMA_B = 0.59045
R_EX = 0.27968819555261474
EA_A = 0.25
PRIMES97 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
dp = ctypes.POINTER(ctypes.c_double)


def lib():
    global _lib
    if _lib is None:
        _lib = ctypes.CDLL(os.path.join(HERE, "libpk.so"))
        _lib.run_block.restype = ctypes.c_int64
        _lib.run_block.argtypes = [ctypes.c_uint64, ctypes.c_uint64, ctypes.c_uint64, ctypes.c_int, ctypes.c_int,
                                   ctypes.c_double, ctypes.c_double, ctypes.c_double, ctypes.c_uint64,
                                   dp, dp, dp, dp, dp, ctypes.c_double, ctypes.c_double, dp, dp, dp, dp]
        _lib.run_table.restype = ctypes.c_int64
        _lib.run_table.argtypes = [ctypes.POINTER(ctypes.c_uint64), dp, ctypes.c_int64, ctypes.c_uint64, ctypes.c_int,
                                   ctypes.c_int, ctypes.c_double, ctypes.c_double, dp, dp, dp, dp,
                                   ctypes.c_double, ctypes.c_double, dp, dp, dp, dp]
        _lib.primes_range.restype = ctypes.c_int64
        _lib.primes_range.argtypes = [ctypes.c_uint64, ctypes.c_uint64, ctypes.POINTER(ctypes.c_uint64), ctypes.c_int64]
        _lib.dh_lambda.restype = ctypes.c_int
        _lib.dh_lambda.argtypes = [ctypes.c_int64, dp]
    return _lib


def P(a):
    return a.ctypes.data_as(dp)


def primes_range(lo, hi):
    cap = int(1.3 * (hi - lo) / max(1.0, math.log(max(lo, 3)) - 1.2) + 1000)
    out = np.zeros(cap, dtype=np.uint64)
    n = lib().primes_range(int(lo), int(hi), out.ctypes.data_as(ctypes.POINTER(ctypes.c_uint64)), cap)
    if n < 0:
        raise RuntimeError("primes_range failed")
    return out[:n]


def dh_lambda(N):
    out = np.zeros(N + 1, dtype=np.float64)
    lib().dh_lambda(N, P(out))
    return out


# ---- window grid ---------------------------------------------------------------------------------
class Grid:
    """Windows j = 0..W-1 at heights T_j = T0 + j dT; packet (p,h,k): xi0 = k - h/p, centre c_j = T_j/(2 pi xi0),
    width H_j = sqrt(c_j/xi0) = c_j/sqrt(v_j), v_j = T_j/(2 pi)."""

    def __init__(self, T0, W, s, p, h, k, X=5.0):
        self.p, self.h, self.k, self.W, self.X = p, h, k, W, X
        self.xi0 = k - h / p
        v0 = T0 / (2 * math.pi)
        self.dT = s * 2 * math.pi * math.sqrt(v0)
        self.T = T0 + self.dT * np.arange(W)
        self.cj = self.T / (2 * math.pi * self.xi0)
        self.u0 = int(round(float(self.cj[0])))
        self.coff = np.array([float(Fraction(float(c)) - self.u0) for c in self.cj])
        self.H = np.sqrt(self.cj / self.xi0)
        self.invH = 1.0 / self.H
        self.xicj = self.xi0 * self.cj
        self.cm2a = self.cj ** (-2 * EA_A)
        self.dc = float((self.coff[-1] - self.coff[0]) / (W - 1)) if W > 1 else float(self.H[0])
        self.hmax = float(self.H.max())
        self.lo = max(2, int(math.floor(self.u0 + self.coff[0] - X * self.H[0])) - 1)
        self.hi = int(math.ceil(self.u0 + self.coff[-1] + X * self.H[-1])) + 2
        # exact fractional part of xi0 * c_j  (xi0 = (k p - h)/p, c_j a double)
        num = k * p - h
        self.gfrac = np.array([float((Fraction(float(c)) * num / p) % 1) for c in self.cj])


def run_block(g, sigma=SIGMA_B, seed=1):
    W, p = g.W, g.p
    V = np.zeros((W, NV, p, 2)); Pm = np.zeros((W, NV, p, 2)); M1 = np.zeros((W, NV)); M2 = np.zeros((W, NV))
    n = lib().run_block(g.lo, g.hi, g.u0, W, p, sigma, g.X, EA_A, seed, P(g.cj), P(g.coff), P(g.invH), P(g.xicj),
                        P(g.cm2a), g.dc, g.hmax, P(V), P(Pm), P(M1), P(M2))
    if n < 0:
        raise RuntimeError("run_block failed")
    return V[..., 0] + 1j * V[..., 1], Pm[..., 0] + 1j * Pm[..., 1], M1, M2, n


def run_table(g, n, a, sigma=SIGMA_B):
    W, p = g.W, g.p
    n = np.ascontiguousarray(n, dtype=np.uint64); a = np.ascontiguousarray(a, dtype=np.float64)
    V = np.zeros((W, 1, p, 2)); Pm = np.zeros((W, 1, p, 2)); M1 = np.zeros((W, 1)); M2 = np.zeros((W, 1))
    lib().run_table(n.ctypes.data_as(ctypes.POINTER(ctypes.c_uint64)), P(a), len(n), g.u0, W, p, sigma, g.X,
                    P(g.cj), P(g.coff), P(g.invH), P(g.xicj), g.dc, g.hmax, P(V), P(Pm), P(M1), P(M2))
    return V[..., 0] + 1j * V[..., 1], Pm[..., 0] + 1j * Pm[..., 1], M1, M2


# ---- main term (pole) of the stationary twist ------------------------------------------------------
_XQ = None


def main_term(g, sigma=SIGMA_B, ea=None, nq=None, both=False):
    """I_j = e(frac(xi0 c_j)) * H_j * int_{-X}^{X} (1+y)^(-sigma) fac(y) psi(x) exp(-2 pi i xi0 c_j (log1p(y)-y)) dx,
    y = x H_j / c_j.  This is the sum over ALL integers n of the kernel times e(-h n/p) (density-1 model of Lambda).
    both=True returns (zeta main term, EA main term).  Simpson rule; nq chosen from the size of the remainder
    (nq = 2001 agrees with nq = 20001 to 1e-12 relative)."""
    if nq is None:
        nq = 2001
    x = np.linspace(-g.X, g.X, nq)
    w = np.full(nq, 2.0); w[1::2] = 4.0; w[0] = w[-1] = 1.0; w *= (x[1] - x[0]) / 3.0
    outz = np.zeros(g.W, dtype=complex); oute = np.zeros(g.W, dtype=complex)
    B = max(1, int(4e6 // nq))
    for a in range(0, g.W, B):
        sl = slice(a, min(g.W, a + B))
        y = x[None, :] * (g.H[sl] / g.cj[sl])[:, None]
        l = np.log1p(y)
        y2 = y * y
        ell = np.where(np.abs(y) < 1e-3, y2 * (-0.5 + y / 3 - y2 / 4 + y2 * y / 5 - y2 * y2 / 6), l - y)
        f = (w[None, :] * np.exp(-0.5 * x * x)[None, :]) * np.exp(-sigma * l) * np.exp(-2j * np.pi * g.xicj[sl][:, None] * ell)
        pref = g.H[sl] * np.exp(2j * np.pi * g.gfrac[sl])
        if ea is None or both:
            outz[sl] = pref * f.sum(-1)
        if ea is not None or both:
            e = np.exp((ea if ea is not None else EA_A) * l)
            oute[sl] = pref * (f * (e + g.cm2a[sl][:, None] / e)).sum(-1)
    if both:
        return outz, oute
    return oute if ea is not None else outz


# ---- Gram of the port model (imp-95375 / imp-95898 closed form) and theta_phys ---------------------
PORT_C, PORT_V = 1.7, 2.3


def gram(a, p_, b, q_):
    if p_ > q_:
        a, p_, b, q_ = b, q_, a, p_
    D = q_ - p_
    if a == b:
        return math.exp(-a * D) * (D + 1 / a)
    I1 = math.exp(-a * p_ - b * q_) * math.exp((a + b) * p_) / (a + b)
    I3 = math.exp(a * p_ + b * q_) * math.exp(-(a + b) * q_) / (a + b)
    I2 = math.exp(a * p_ - b * q_) * (math.exp((b - a) * q_) - math.exp((b - a) * p_)) / (b - a)
    return I1 + I2 + I3


_GD = {}


def gram_diag_sums(p, k):
    """g[D mod p] = sum_{h_m - h_l = D} G_ml (D = -(p-2)..p-2), S = sum G, tr = trace."""
    key = (p, k)
    if key not in _GD:
        hs = list(range(1, p))
        ds = [k - h / p for h in hs]
        mu = [d ** (1 / 3) / PORT_C for d in ds]; u = [PORT_V / d for d in ds]
        gD = np.zeros(2 * p - 3) if p > 2 else np.zeros(1)
        S = 0.0; tr = 0.0; gmin = 1e300
        for m in range(p - 1):
            for l in range(p - 1):
                G = gram(mu[m], u[m], mu[l], u[l]); S += G; gmin = min(gmin, G)
                if m == l:
                    tr += G
                gD[(hs[m] - hs[l]) + (p - 2)] += G
        _GD[key] = (gD, S, tr, gmin)
    return _GD[key]


def theta_from_fourier(p, k, Fh):
    """Fh[..., D] = sum_n w(n) e(-D n/p), D = 0..p-1.  theta = sum_D g(D) (F(D)+F(-D))/2 / (S F(0))."""
    gD, S, tr, _ = gram_diag_sums(p, k)
    D = np.arange(-(p - 2), p - 1) if p > 2 else np.array([0])
    cosm = 0.5 * (Fh[..., D % p] + Fh[..., (-D) % p])
    return (cosm * gD).sum(-1) / (S * Fh[..., 0])


def theta_uniform(p, k):
    gD, S, tr, _ = gram_diag_sums(p, k)
    return (p * tr - S) / ((p - 1) * S)


def alias_majorant(p):
    """m_h = p^(-4/3) j(h)^(-2/3), j = min(h, p-h); sum_h m_h = Sbar_p; alpha>1 iff 1 - h/p < 1/(2 pi) (k=1)."""
    h = np.arange(1, p)
    j = np.minimum(h, p - h)
    m = p ** (-4 / 3) * j ** (-2 / 3)
    over = (1 - h / p) < 1 / (2 * math.pi)
    return m, over


def stats_block(g, V, Pm, M1, M2, sigma=SIGMA_B):
    """Per-window statistics for one packet block (sieve front end, NV variants)."""
    main = np.zeros((g.W, NV), dtype=complex)
    mz, me = main_term(g, sigma, both=True)
    main[:, 0] = mz; main[:, 6] = mz
    main[:, 4] = me
    return stats_core(g, V, Pm, M1, M2, main)


def stats_core(g, V, Pm, M1, M2, main):
    """Statistics for arrays [W, nv, p]; main [W, nv] is the pole term of the stationary twist (0 if no pole)."""
    p, h, k = g.p, g.h, g.k
    Fh = np.fft.fft(V, axis=-1)          # Fh[..., D] = sum_r V_r e(-D r/p)
    Ph = np.fft.fft(Pm, axis=-1)
    A = Fh[..., h % p].copy()            # stationary twist
    R = A - main
    out = {}
    out["rho_raw"] = np.abs(A) / M1
    out["r"] = np.abs(R) / M1
    out["z"] = np.abs(R) / np.sqrt(M2)
    th_pos = theta_from_fourier(p, k, Ph)
    th_c = theta_from_fourier(p, k, Fh)
    out["thpos_re"] = th_pos.real; out["thpos_abs"] = np.abs(th_pos)
    out["nu"] = Ph[..., 0].real / M1
    out["nu_abs"] = np.abs(Ph[..., 0]) / M1
    out["thc_re"] = th_c.real; out["thc_abs"] = np.abs(th_c)
    out["nuc"] = np.abs(Fh[..., 0]) / M1
    if p > 2:
        nz = Fh[..., 1:]
        E = (np.abs(nz) ** 2).sum(-1)
        out["f_alg"] = np.abs(nz.sum(-1)) ** 2 / ((p - 1) * E)      # chirp kernel, Theorem-U fraction
        nzp = Ph[..., 1:]
        Ep = (np.abs(nzp) ** 2).sum(-1)
        out["f_alg_pos"] = np.abs(nzp.sum(-1)) ** 2 / ((p - 1) * Ep)
    else:
        out["f_alg"] = np.ones_like(M1); out["f_alg_pos"] = np.ones_like(M1)
    out["M1"] = M1; out["M2"] = M2
    return out


# ---- independent numpy reference (direct formulas, long double phase) ------------------------------
def splitmix(x):
    M = (1 << 64) - 1
    x = (x + 0x9E3779B97F4A7C15) & M
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & M
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & M
    return x ^ (x >> 31)


def coef_ref(q, j, seed=1):
    lq = math.log(q)
    sq = {(i * i) % 101 for i in range(1, 101)}
    ch = 0 if q % 101 == 0 else (1 if q % 101 in sq else -1)
    h = splitmix(q ^ ((seed * 0x100000001B3) & ((1 << 64) - 1)))
    sg = 1.0 if (h & 1) else -1.0
    h2 = splitmix(h ^ 0xABCDEF1234567)
    th = 2 * math.pi * (h2 >> 11) / 9007199254740992.0
    c5 = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}[q % 5]
    cc = 2.2; d = math.sqrt(cc * cc - 4); al = math.sqrt(3) * (-cc + d) / 2; be = math.sqrt(3) * (-cc - d) / 2
    tn = lq * (1 - al ** j - be ** j) if q == 3 else lq
    return [lq, lq * ch ** j, lq * sg ** j, lq * complex(math.cos(th * j), math.sin(th * j)), lq, lq * c5 ** j, tn]
