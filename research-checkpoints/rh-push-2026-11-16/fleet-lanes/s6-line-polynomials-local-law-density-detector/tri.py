"""Copy of lib.py of lane s3-dbn-barrier-mollified-triangle with two additions in Tri.value: mode='two' (two-channel term
max(|b - g a0|, (1-g)/(1+g) |b + g a0|), Polymath15 Lemma 5.1 form, real coefficients) and jw (0/1 weight on j, partial sum S_jw).
Triangle functional of dbn-lambda-01787854-candidate-audit (NATIVE_BINDING.md; src/lemma_sweep_p235711_triangle_stored.c):
  x_N = 4 pi (N^2 - t/16), L = ln(x_N/4 pi)
  sigma = (1+y)/2 + (t/4) L - t max(0, 1 - 3y + 4y(1+y)/x_N^2)/(2 x_N^2),  K = t y/(2 (x_N - 6)),  g = exp(0.02 y - (y/2) L)
  b(n) = sum_{d in S, d|n, n/d<=N} lam_d a(n/d) b_t(n/d),   a0(n) = same with the extra factor (n/d)^y,   b_t(m) = exp((t/4) ln^2 m)
  T = (1 - g - sum_{n>=2} (|b(n)| + g |a0(n)|) n^-sigma) / sum_d |lam_d| d^-sigma  -  g sum_{m=2}^N |a(m)| b_t(m) (m^K - 1) m^(y - sigma)
with coefficients a(n) (a = 1 is the source). The sum over n <= Dmax N is organised by G = gcd(n, D): n = G j, gcd(j, D/G) = 1.
xp = cupy when available (one device, pool limit set), else numpy. float64."""
import math, os, sys, itertools
import numpy as np
try:
    if os.environ.get('S3_NOGPU'): raise ImportError
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('S3_POOL_GB', '20')) * 1024**3))
    xp = cp; GPU = True
except Exception:
    cp = None; xp = np; GPU = False

def asnp(a):
    return cp.asnumpy(a) if GPU and isinstance(a, cp.ndarray) else np.asarray(a)
def announce(what, nbytes):
    print('planned allocation: %s = %.1f MB' % (what, nbytes / 1e6), flush=True)

KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
CHI5 = np.array([0, 1, 1j, -1j, -1], dtype=np.complex128)
DHPER = np.array([0, 1, KAPPA, -KAPPA, -1.0])
T0 = 129 / 800; Y0 = math.sqrt(87677 / 2500000)
CN, AE = 2.2, 0.25
SEED = 20261119

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]

def factor(n):
    f = {}; p = 2
    while p * p <= n:
        while n % p == 0: f[p] = f.get(p, 0) + 1; n //= p
        p += 1
    if n > 1: f[n] = f.get(n, 0) + 1
    return f
def divisors(n):
    ds = [1]
    for p, e in factor(n).items():
        ds = [d * p**k for d in ds for k in range(e + 1)]
    return sorted(ds)

def prime_seeds(N):
    pr = primes_upto(N)
    sg = np.random.default_rng(SEED).integers(0, 2, len(pr)); un = np.random.default_rng(SEED + 1).uniform(0, 2 * math.pi, len(pr))
    return pr, sg, un

def coefs(name, N):
    """numpy array a[0..N] (a[0] unused), complex128 or float64"""
    n = np.arange(0, N + 1)
    if name == 'ZETA': return np.ones(N + 1)
    if name == 'LCHI5': return CHI5[n % 5].copy()
    if name == 'CHIM3': return np.array([0.0, 1, -1])[n % 3]
    if name == 'CHIM4': return np.array([0.0, 1, 0, -1])[n % 4]
    if name == 'DH': return DHPER[n % 5].copy()
    if name == 'TNR': return 1.0 + CN * math.sqrt(3) * (n % 3 == 0) + 3.0 * (n % 9 == 0)
    if name == 'UA': return np.exp(-1j * 1.0 * np.log(np.maximum(n, 1)))
    pr, sg, un = prime_seeds(N)
    if name == 'EA':
        ea = np.ones(N + 1)
        for p in pr:
            p = int(p); pk = p; k = 1; prev = 1.0
            while pk <= N:
                cur = sum(p ** (AE * (2 * j - k)) for j in range(k + 1))
                ea[pk::pk] *= cur / prev; prev = cur; pk *= p; k += 1
        return ea
    om = np.zeros(N + 1, dtype=np.int8); phs = np.zeros(N + 1, dtype=np.int8); phu = np.zeros(N + 1)
    for i, p in enumerate(pr):
        p = int(p); pk = p
        while pk <= N:
            om[pk::pk] += 1
            if sg[i]: phs[pk::pk] += 1
            if name == 'U': phu[pk::pk] += un[i]
            pk *= p
    if name == 'LIOU': return 1.0 - 2.0 * (om % 2)
    if name == 'SGN': return 1.0 - 2.0 * (phs % 2)
    if name == 'U': return np.exp(1j * phu)
    raise ValueError(name)

def a_prime(name, p):
    """a(p) for the completely multiplicative families"""
    if name == 'ZETA': return 1.0
    if name == 'LCHI5': return complex(CHI5[p % 5])
    if name == 'CHIM3': return [0.0, 1, -1][p % 3]
    if name == 'CHIM4': return [0.0, 1, 0, -1][p % 4]
    if name == 'LIOU': return -1.0
    if name == 'UA': return complex(np.exp(-1j * math.log(p)))
    pr, sg, un = prime_seeds(max(p, 100)); i = int(np.searchsorted(pr, p))
    if name == 'SGN': return 1.0 - 2.0 * sg[i]
    if name == 'U': return complex(np.exp(1j * un[i]))
    raise ValueError(name)

def bt(p, t): return math.exp((t / 4) * math.log(p) ** 2)

def euler_moll(name, primes, t):
    """own Euler mollifier: dict d -> lam_d, and modulus D"""
    lam = {1: 1.0}; D = 1
    for p in primes:
        if name == 'TNR' and p == 3:
            # (1 - X)/(1 + c sqrt3 X + 3 X^2), X = b_t(3) 3^-s, truncated at 3^6
            Kp = 6; r = [1.0, -CN * math.sqrt(3)]
            for k in range(2, Kp + 1): r.append(-CN * math.sqrt(3) * r[-1] - 3 * r[-2])
            e = [r[0]] + [r[k] - r[k - 1] for k in range(1, Kp + 1)]
            loc = {3**k: e[k] * bt(3, t) ** k for k in range(Kp + 1)}; D *= 3**Kp
        elif name == 'EA':
            loc = {1: 1.0, p: -(p**AE + p**(-AE)) * bt(p, t), p * p: bt(p, t) ** 2}; D *= p * p
        else:
            ap = 1.0 if name in ('TNR', 'DH') else a_prime(name, p)
            loc = {1: 1.0, p: -ap * bt(p, t)}; D *= p
        lam = {d * q: v * w for d, v in lam.items() for q, w in loc.items()}
    return {d: v for d, v in lam.items() if v != 0}, D

def consts(N, t, y):
    xN = 4 * math.pi * (N * N - t / 16); L = math.log(N * N - t / 16)
    inner = max(0.0, 1 - 3 * y + 4 * y * (1 + y) / xN**2)
    sigma = (1 + y) / 2 + (t / 4) * L - t * inner / (2 * xN**2)
    return xN, L, sigma, t * y / (2 * (xN - 6)), math.exp(0.02 * y - (y / 2) * L)

def err_budget(N, t, y):
    """e_A + e_B + e_C0 of independent/prop410/prop410_proof.py at the left edge of window N (float64, zeta)"""
    xN, L, sigma, K, g = consts(N, t, y); lnN = math.log(N)
    ymax = math.sqrt(max(1 - 2 * t, y * y))
    u1 = ((t * t / 16) * L * L + 0.626) / (xN - 6.66)
    pmax = 1 + math.exp(0.02) * (1 - t / (16 * N * N)) ** -0.5 * math.exp(t * lnN / (2 * (xN - 6)))
    n = np.arange(2, min(N, 200000) + 1, dtype=np.float64); ln = np.log(n)
    s1 = (1 + y) / 2 + (t / 2) * lnN
    smax = 1 + float(np.exp((t / 4) * ln * ln - s1 * ln).sum())
    if N > 200000: smax += max(math.exp((1 - s1) * u + (t / 4) * u * u) for u in (math.log(200000), lnN)) * (lnN - math.log(200000))
    eab = pmax * smax * math.expm1(u1)
    ec0 = math.exp(-(1 + y) / 4 * L - (t / 16) * L * L + 1.24 * (3**ymax + 3**(-ymax)) / (N - 0.125) + (3 * math.sqrt(L * L + (math.pi / 2) ** 2) + 10.50) / (xN - 12))
    return eab + ec0

class Tri:
    """state for one coefficient array a (numpy, index 0..Nmax) and one modulus D"""
    def __init__(self, a, D, Nmax):
        self.D = D; self.divs = divisors(D); self.Nmax = Nmax
        self.a = xp.asarray(a[:Nmax + 1]); self.absa = xp.abs(self.a)
        self.ln = xp.log(xp.arange(1, Nmax + 1, dtype=xp.float64))            # ln[j-1] = ln j
        self.pm = {}
        j = xp.arange(1, Nmax + 1)
        for p in factor(D): self.pm[p] = (j % p != 0)
        self._t = None
    def set_ty(self, t, y):
        if self._t == (t, y): return
        self._t = (t, y)
        heat = xp.exp((t / 4) * self.ln * self.ln)
        self.cB = self.a[1:] * heat                 # index m-1
        self.cA = self.cB * xp.exp(y * self.ln)
        self.heatabs = self.absa[1:] * heat
    def mask(self, Q, jmax):
        m = None
        for p in factor(Q):
            m = self.pm[p][:jmax] if m is None else (m & self.pm[p][:jmax])
        return m
    def value(self, N, t, y, lam, grad=False, eps=0.0, parts=False, mode='tri', jw=None):
        """T(N) for mollifier dict lam (keys divide D). eps > 0: |x| -> sqrt(x^2 + eps^2) and returns (J, dJ) for the
        objective J = sum w(|b| + g|a0|) + corr * sum_{d>1} |lam_d| d^-sigma (positive margin iff J < 1 - g - corr)."""
        self.set_ty(t, y)
        xN, L, sigma, K, g = consts(N, t, y)
        wj = xp.exp(-sigma * self.ln[:N])
        S = 0.0; self.S_jw = 0.0
        keys = sorted(lam)
        gr = {d: 0.0 for d in keys} if grad else None
        for G in self.divs:
            Sd = [d for d in keys if G % d == 0]
            if not Sd: continue
            jmax = (N * max(Sd)) // G
            if jmax < 1: continue
            bG = xp.zeros(jmax, dtype=self.cB.dtype); aG = xp.zeros(jmax, dtype=self.cB.dtype)
            for d in Sd:
                k = G // d; jm = N // k
                if jm < 1: continue
                bG[:jm] += lam[d] * self.cB[k - 1:k * jm:k]
                aG[:jm] += lam[d] * self.cA[k - 1:k * jm:k]
            w = wj[:jmax] * (G ** -sigma)
            m = self.mask(self.D // G, jmax)
            if m is not None: w = w * m
            if G == 1: w = w.copy(); w[0] = 0.0
            if eps > 0:
                hb = xp.sqrt(bG.real**2 + bG.imag**2 + eps * eps); ha = xp.sqrt(aG.real**2 + aG.imag**2 + eps * eps)
            else:
                hb = xp.abs(bG); ha = xp.abs(aG)
            if mode == 'two':
                con = xp.maximum(xp.abs(bG - g * aG), ((1 - g) / (1 + g)) * xp.abs(bG + g * aG))
            else:
                con = hb + g * ha
            S += float((w * con).sum())
            if jw is not None: self.S_jw = getattr(self, 'S_jw', 0.0) + float((w * con * jw[:jmax]).sum())
            if grad:
                sb = w * xp.conj(bG) / hb; sa = (g * w) * xp.conj(aG) / ha
                for d in Sd:
                    k = G // d; jm = N // k
                    if jm < 1: continue
                    v = (sb[:jm] * self.cB[k - 1:k * jm:k]).sum() + (sa[:jm] * self.cA[k - 1:k * jm:k]).sum()
                    gr[d] += complex(v)
            del bG, aG, w, hb, ha
        lnN = self.ln[1:N]
        corr = g * float((self.heatabs[1:N] * xp.expm1(K * lnN) * xp.exp((y - sigma) * lnN)).sum())
        if grad:
            J = S + corr * sum(math.sqrt(abs(lam[d])**2 + eps * eps) * d ** -sigma for d in keys if d > 1)
            dJ = {d: gr[d] + corr * (np.conj(lam[d]) / math.sqrt(abs(lam[d])**2 + eps * eps)) * d ** -sigma for d in keys if d > 1}
            return J, dJ, 1 - g - corr
        M = sum(abs(lam[d]) * d ** -sigma for d in keys)
        T = (1 - g - S) / M - corr
        if parts: return T, dict(sigma=sigma, g=g, S=S, M=M, corr=corr, K=K, S_jw=self.S_jw)
        return T

def optimise(tri, N, t, y, lam0, iters=120, stages=(1e-3, 1e-4, 1e-5, 1e-6), verbose=False):
    """minimise J over real lam_d, d > 1 (lam_1 = 1), support = keys of lam0. Returns (T, lam)."""
    from scipy.optimize import minimize
    keys = [d for d in sorted(lam0) if d > 1]
    x = np.array([float(np.real(lam0[d])) for d in keys])
    def mk(x): 
        lam = {1: 1.0}; lam.update({d: float(v) for d, v in zip(keys, x)}); return lam
    best = (tri.value(N, t, y, mk(x)), x.copy())
    for eps in stages:
        def f(x):
            J, dJ, _ = tri.value(N, t, y, mk(x), grad=True, eps=eps)
            return J, np.array([float(np.real(dJ[d])) for d in keys])
        r = minimize(f, x, jac=True, method='L-BFGS-B', options=dict(maxiter=iters, maxcor=30))
        x = r.x
        T = tri.value(N, t, y, mk(x))
        if verbose: print('   eps %g J %.9f T %.6e nit %d' % (eps, r.fun, T, r.nit), flush=True)
        if T > best[0]: best = (T, x.copy())
    return best[0], mk(best[1])
