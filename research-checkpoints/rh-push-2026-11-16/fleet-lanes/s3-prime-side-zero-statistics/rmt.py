"""Reference predictions: GUE and CUE_N nearest-neighbour gap CDF (Fredholm determinants, Gauss-Legendre),
pair counts, GUE number variance and adjacent-box correlation, and the two-point function with arithmetic
lower-order terms (Bogomolny-Keating / Conrey-Snaith form) for zeta and for a primitive character of prime conductor q.
LAMBDA(q) = gamma0^2 + 2 gamma1 + sum_{p != q} log^2 p/(p-1)^2 + [q > 1] log^2 q * q/(q-1)^2   (small-x coefficient; derived in RESULT.md)
           = 1.57314 (zeta), 1.57314 + log^2(5)/4 = 2.22071 (conductor 5).   N_eff = log(q t/2 pi)/sqrt(12 LAMBDA)."""
import math, numpy as np
from scipy.special import sici

G0 = 0.5772156649015329; G1 = -0.0728158454836767

def _gl(m, a, b):
    x, w = np.polynomial.legendre.leggauss(m)
    return 0.5 * (b - a) * x + 0.5 * (b + a), 0.5 * (b - a) * w

def _E(s, N=None, m=40):
    """probability of no point in an interval of length s (unit density); N=None: sine kernel; else CUE_N kernel (N real)"""
    if s <= 0: return 1.0
    x, w = _gl(m, 0.0, s)
    d = x[:, None] - x[None, :]
    if N is None:
        K = np.sinc(d)
    else:
        with np.errstate(divide='ignore', invalid='ignore'):
            K = np.where(np.abs(d) < 1e-14, 1.0, np.sin(math.pi * d) / (N * np.sin(math.pi * d / N)))
    sw = np.sqrt(w)
    return float(np.linalg.det(np.eye(m) - sw[:, None] * K * sw[None, :]))

def gap_cdf(s, N=None):
    """P(nearest-neighbour gap < s) = 1 + E'(s)"""
    h = 1e-3
    d = (-_E(s + 2 * h, N) + 8 * _E(s + h, N) - 8 * _E(s - h, N) + _E(s - 2 * h, N)) / (12 * h)
    return 1.0 + d

def pair_gue(s, m=200):
    x, w = _gl(m, 0.0, s)
    return float(np.sum(w * (1 - np.sinc(x) ** 2)))

def pair_cue(s, N, m=200):
    x, w = _gl(m, 0.0, s)
    return float(np.sum(w * (1 - (np.sin(math.pi * x) / (N * np.sin(math.pi * x / N))) ** 2)))

def numvar_gue(L):
    si, ci = sici(2 * math.pi * L)
    return (math.log(2 * math.pi * L) + G0 + 1 - math.cos(2 * math.pi * L) - ci) / math.pi ** 2 + L * (1 - 2 / math.pi * si)

def r1_gue(L):
    v1 = numvar_gue(L); v2 = numvar_gue(2 * L)
    return (v2 - 2 * v1) / (2 * v1)

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]

def LAMBDA(q=1, P=10 ** 7):
    p = primes_upto(P).astype(np.float64)
    lp = np.log(p)
    S = float(np.sum((lp / (p - 1)) ** 2)) + math.log(P) / P     # tail ~ int log^2 x/(x^2 log x)
    v = G0 ** 2 + 2 * G1 + S
    if q > 1: v += math.log(q) ** 2 * (q / (q - 1) ** 2 - 1 / (q - 1) ** 2)
    return v

class BK:
    """r2(u; L) with the arithmetic terms, tabulated in x = 2 pi u / L."""
    def __init__(self, q=1, P=10 ** 6, xmax=0.5, nx=500):
        import mpmath as mp
        self.q = q
        p = primes_upto(P).astype(np.float64)
        if q > 1: p = p[p != q]
        lp = np.log(p)
        self.x = np.linspace(xmax / nx, xmax, nx)
        Dv = np.empty(nx, dtype=complex); Bv = np.empty(nx, dtype=complex); Zv = np.empty(nx, dtype=complex)
        for i, x in enumerate(self.x):
            eta = 1j * x
            s = mp.mpc(1, x)
            z0 = mp.zeta(s); z1 = mp.zeta(s, derivative=1); z2 = mp.zeta(s, derivative=2)
            D = complex(z2 / z0 - (z1 / z0) ** 2)
            pe = p ** (1 + eta)
            B = np.sum((lp / (pe - 1)) ** 2)
            A = np.exp(np.sum(np.log((1 - 1 / pe) * (1 - 2 / p + 1 / pe) / (1 - 1 / p) ** 2)))
            Z = complex(z0 * mp.zeta(mp.mpc(1, -x))) * A
            if q > 1:
                lq = math.log(q); qe = q ** (1 + eta)
                D += -lq ** 2 * qe / (qe - 1) ** 2
                Z *= (1 - q ** (-1 - eta)) * (1 - q ** (-1 + eta)) * (q / (q - 1.0)) ** 2
            Dv[i] = D; Bv[i] = B; Zv[i] = Z
        self.D = Dv; self.B = Bv; self.Z = Zv
    def r2(self, u, L):
        x = 2 * math.pi * np.asarray(u, dtype=float) / L
        # smooth parts: D = -1/x^2 + d(x), Z = 1/x^2 + z(x); the 1/x^2 terms are combined analytically
        d = self.D + 1 / self.x ** 2; z = self.Z - 1 / self.x ** 2
        ip = lambda f: np.interp(x, self.x, f.real) + 1j * np.interp(x, self.x, f.imag)
        val = -(1 - np.exp(-1j * x * L)) / x ** 2 + ip(d) - ip(self.B) + np.exp(-1j * x * L) * ip(z)
        return 1 + 2 / L ** 2 * val.real
    def pair(self, s, L, m=120):
        lo = 2 * self.x[0] * L / (2 * math.pi)
        x, w = _gl(m, lo, s)
        # below lo use the small-u form with LAMBDA
        return float(np.sum(w * self.r2(x, L))) + (math.pi ** 2 / 9 - 4 * self.lam() * math.pi ** 2 / (3 * L ** 2)) * lo ** 3
    def lam(self):
        if not hasattr(self, '_lam'): self._lam = LAMBDA(self.q)
        return self._lam

if __name__ == '__main__':
    print('GUE gap cdf(0.2) =', gap_cdf(0.2), ' pair integral', pair_gue(0.2), ' small-s series pi^2 s^3/9 =', math.pi ** 2 * 0.008 / 9)
    for q in (1, 5):
        print('LAMBDA(q=%d) = %.6f' % (q, LAMBDA(q)))
    bk = BK(1)
    L = math.log(1e12 / (2 * math.pi)); Ne = L / math.sqrt(12 * bk.lam())
    print('zeta at 1e12: L=%.3f N_eff=%.3f' % (L, Ne))
    print('  ratios to GUE: CUE_Neff gap cdf %.5f, CUE_Neff pair %.5f, BK pair %.5f  (measured in the repo: 0.9733 +- 0.0088)' % (gap_cdf(0.2, Ne) / gap_cdf(0.2), pair_cue(0.2, Ne) / pair_gue(0.2), bk.pair(0.2, L) / pair_gue(0.2)))
    for u in (0.01, 0.05, 0.1, 0.2):
        lam_eff = (1 - np.sinc(u) ** 2 - bk.r2(u, L)) * L ** 2 / (4 * math.sin(math.pi * u) ** 2)
        print('  u=%.2f  effective LAMBDA from the full formula %.5f' % (u, lam_eff))
    bk5 = BK(5); L5 = math.log(5 * 5e5 / (2 * math.pi))
    for u in (0.01, 0.1, 0.2):
        print('  q=5: u=%.2f effective LAMBDA %.5f' % (u, (1 - np.sinc(u) ** 2 - bk5.r2(u, L5)) * L5 ** 2 / (4 * math.sin(math.pi * u) ** 2)))
    print('r1_gue(495.78) =', r1_gue(495.78), '(repo: -0.46398)')
