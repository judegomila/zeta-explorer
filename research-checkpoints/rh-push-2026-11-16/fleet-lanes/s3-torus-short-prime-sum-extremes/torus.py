"""Shared code for the lane s1-prime-torus-orbit.

Dirichlet polynomials sum a_n n^(-sigma-it) evaluated through the prime-phase torus:
cycles c_p = t log p / (2 pi) mod 1 for the primes, c_n = sum v_p(n) c_p for composites.
Heights t = t_int + delta with t_int an integer < 2^40 and |delta| small: the integer part is
multiplied exactly in 88-bit fixed point (error < 2^-48 cycles), the offset in float64.
Haar samples replace the base cycles by independent uniform numbers.
float64 on GPU (cupy) when present, numpy otherwise. GPU output is a screen, not a verdict.
"""
import os, math
import numpy as np
import mpmath as mp

GPU = False
try:
    if os.environ.get('RH_NOGPU'):
        raise ImportError
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('RH_POOL_GB', '20')) * 1024 ** 3))
    xp = cp
    GPU = True
except Exception:
    xp = np


def asnp(a):
    return cp.asnumpy(a) if GPU and isinstance(a, cp.ndarray) else np.asarray(a)


def retry(fn, *args, tries=120, wait=20):
    """Run fn; on a GPU out-of-memory error (the card is shared) free the pool, wait and try again."""
    import time
    for k in range(tries):
        try:
            return fn(*args)
        except Exception as e:
            if not GPU or 'OutOfMemory' not in type(e).__name__:
                raise
            cp.get_default_memory_pool().free_all_blocks()
            print(f'GPU out of memory (attempt {k + 1}); waiting {wait}s', flush=True)
            time.sleep(wait)
    raise RuntimeError('GPU memory not available')


def nworkers():
    return max(1, int(os.environ.get('RH_WORKERS', '4')))


def free():
    if GPU:
        cp.get_default_memory_pool().free_all_blocks()


def sieve(P):
    P = int(P)
    s = np.ones(P + 1, dtype=bool)
    s[:2] = False
    for i in range(2, int(P ** 0.5) + 1):
        if s[i]:
            s[i * i::i] = False
    return np.nonzero(s)[0].astype(np.int64)


def fixed_logs(ns, denom='2pi', cache=None):
    """frac(log n / D) as 88-bit fixed point: hi (64 bits, uint64), lo (next 24 bits, uint64)."""
    if cache and os.path.exists(cache):
        z = np.load(cache)
        if len(z['hi']) == len(ns):
            return z['hi'], z['lo']
    hi = np.empty(len(ns), dtype=np.uint64)
    lo = np.empty(len(ns), dtype=np.uint64)
    try:
        import flint
        flint.ctx.prec = 160
        D = 2 * flint.arb.pi() if denom == '2pi' else flint.arb(2).log()
        two88 = flint.arb(2) ** 88
        for i, n in enumerate(ns):
            x = flint.arb(int(n)).log() / D
            x = x - x.floor()
            u = (x * two88).floor().unique_fmpz()
            if u is None:          # exact integer ratio (log 2 / log 2) or a ball straddling an integer
                mp.mp.prec = 200
                y = mp.log(int(n)) / (2 * mp.pi if denom == '2pi' else mp.log(2))
                u = int(mp.floor(mp.ldexp(y - mp.floor(y + mp.mpf(2) ** -150), 88)))
            v = int(u) % (1 << 88)
            hi[i] = v >> 24
            lo[i] = v & 0xFFFFFF
    except ImportError:
        mp.mp.prec = 160
        D = 2 * mp.pi if denom == '2pi' else mp.log(2)
        for i, n in enumerate(ns):
            x = mp.log(int(n)) / D
            x = x - mp.floor(x)
            v = int(mp.floor(mp.ldexp(x, 88)))
            hi[i] = v >> 24
            lo[i] = v & 0xFFFFFF
    if cache:
        np.savez(cache, hi=hi, lo=lo)
    return hi, lo


def base_cycles(t_int, hi, lo):
    """(K, n) float64 cycles of t_int * frac(log n / D), t_int integers in [0, 2^40)."""
    t = xp.asarray(np.asarray(t_int, dtype=np.uint64))[:, None]
    u = t * xp.asarray(hi)[None, :] + ((t * xp.asarray(lo)[None, :]) >> np.uint64(24))
    return (u >> np.uint64(11)).astype(xp.float64) * (2.0 ** -53)


class Levels:
    """Composite cycles from prime cycles: c_n = c_{n/spf(n)} + c_{spf(n)}."""

    def __init__(self, N):
        N = int(N)
        self.N = N
        spf = np.zeros(N + 1, dtype=np.int64)
        for i in range(2, N + 1):
            if spf[i] == 0:
                spf[i::i] = np.where(spf[i::i] == 0, i, spf[i::i])
        self.spf = spf
        om = np.zeros(N + 1, dtype=np.int8)
        order = np.arange(2, N + 1)
        par = np.ones(N + 1, dtype=np.int64)
        par[2:] = order // spf[2:]
        # Omega by increasing n (parent < n)
        for n in range(2, N + 1):
            om[n] = om[par[n]] + 1
        self.om = om
        self.par = par
        self.primes = np.nonzero(om == 1)[0]
        self.lev = [np.nonzero(om == k)[0] for k in range(2, int(om.max()) + 1)]
        self.logn = np.zeros(N + 1)
        self.logn[1:] = np.log(np.arange(1, N + 1))

    def cycles(self, cp_primes, nmax=None):
        """cp_primes: (K, pi(nmax)) cycles of the primes <= nmax (in order). Returns (K, nmax+1); columns 0, 1 are zero."""
        nmax = self.N if nmax is None else int(nmax)
        K = cp_primes.shape[0]
        C = xp.zeros((K, nmax + 1), dtype=xp.float64)
        npr = int(np.searchsorted(self.primes, nmax, side='right'))
        C[:, xp.asarray(self.primes[:npr])] = cp_primes[:, :npr]
        for idx in self.lev:
            idx = idx[:int(np.searchsorted(idx, nmax, side='right'))]
            if len(idx) == 0:
                break
            C[:, xp.asarray(idx)] = C[:, xp.asarray(self.par[idx])] + C[:, xp.asarray(self.spf[idx])]
        return C


# ---------------------------------------------------------------- arithmetic data
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
DH_C1 = (1 - 1j * KAPPA) / 2
DH_C2 = (1 + 1j * KAPPA) / 2
CHI5 = np.array([0, 1, 1j, -1j, -1], dtype=complex)          # chi(2) = i, odd character mod 5
W5 = sum(CHI5[a] * np.exp(2j * np.pi * a / 5) for a in range(5)) / (1j * math.sqrt(5))   # root number
TNR_Q, TNR_C = 3, 2.2
TNR_B = math.acosh(TNR_C / 2) / math.log(TNR_Q)             # zeros of the T-NR factor on Re s = 1/2 +- TNR_B
SIGB = 0.59045


def chi5(n):
    return CHI5[np.asarray(n) % 5]


def families(pr, seed=20261119):
    """Unimodular per-prime multipliers u_p of the Euler-product families."""
    rng = np.random.default_rng(seed)
    n = len(pr)
    U = {}
    U['ZETA'] = np.ones(n, dtype=complex)
    U['CHI'] = chi5(pr)
    U['CHIB'] = np.conj(chi5(pr))
    U['SGN'] = rng.choice([-1.0, 1.0], size=n).astype(complex)        # random sign twist, fixed seed
    U['LIO'] = -np.ones(n, dtype=complex)                             # Liouville twist
    U['UNI'] = np.exp(2j * np.pi * rng.random(n))                     # random unimodular twist, fixed seed
    return U


def tnr_factor(sig, e3):
    """m(s) = q^(s-1/2) + c + q^(1/2-s) with q^(-it) = e3 (array), sig real or array."""
    a = TNR_Q ** (sig - 0.5)
    return a * xp.conj(e3) + TNR_C + e3 / a


def mangoldt(N):
    L = np.zeros(N + 1)
    for p in sieve(N):
        q = p
        while q <= N:
            L[q] = math.log(p)
            q *= p
    return L


def dh_coeffs(N):
    a = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])
    return a[np.arange(N + 1) % 5]


def log_derivative_coeffs(a):
    """Lambda_F with -F'/F = sum Lambda_F(n) n^-s for F = sum a(n) n^-s, a(1) = 1."""
    N = len(a) - 1
    logn = np.zeros(N + 1)
    logn[1:] = np.log(np.arange(1, N + 1))
    L = a * logn
    for d in range(2, N // 2 + 1):
        if L[d] != 0.0:
            m = N // d
            L[2 * d:m * d + 1:d] -= L[d] * a[2:m + 1]
    L[0] = 0
    return L


def tnr_lambda(N):
    L = mangoldt(N)
    al1 = -(TNR_C / 2 + math.sqrt(TNR_C ** 2 / 4 - 1))
    al2 = 1 / al1
    k = 1
    while TNR_Q ** k <= N:
        L[TNR_Q ** k] = math.log(TNR_Q) * (1 - (al1 ** k + al2 ** k) * TNR_Q ** (k / 2))
        k += 1
    return L


def completely_mult(u_primes, lev):
    """Completely multiplicative extension to n <= N of values on the primes <= N."""
    e = np.ones(lev.N + 1, dtype=complex)
    e[0] = 0
    e[lev.primes] = u_primes
    for idx in lev.lev:
        e[idx] = e[lev.par[idx]] * e[lev.spf[idx]]
    return e


# ---------------------------------------------------------------- evaluation
def euler_logs(t_int, delta, sig, Ulist, pr, hi, lo, cuts, haar_base=None, chunk_elems=None):
    """log of truncated Euler products prod_{p<=cut} (1 - u_p p^(-s))^(-1), s = sig_k + i (t_int_k + delta_k).
    Returns (K, nf, ncuts) complex (numpy) and e3 = 3^(-it) (K,). haar_base: (K, n) cycles replacing the orbit base."""
    if chunk_elems is None:
        chunk_elems = float(os.environ.get('RH_CHUNK', 1.2e8 if GPU else 1.5e7))
    K = len(t_int)
    n = len(pr)
    logp = xp.asarray(np.log(pr))
    l2pi = logp / (2 * math.pi)
    ind = xp.asarray(np.stack([(pr <= c) for c in cuts], axis=1).astype(np.float64)).astype(xp.complex128)
    Ux = [xp.asarray(u) for u in Ulist]
    out = np.empty((K, len(Ulist), len(cuts)), dtype=complex)
    e3 = np.empty(K, dtype=complex)
    i3 = int(np.nonzero(pr == 3)[0][0])
    ck = max(1, int(chunk_elems // n))
    sig = np.broadcast_to(np.asarray(sig, dtype=float), (K,))
    def body(a, b):
        if haar_base is None:
            C = base_cycles(t_int[a:b], hi, lo)
        else:
            C = xp.asarray(haar_base[a:b])
        C = C + xp.asarray(np.asarray(delta[a:b], dtype=float))[:, None] * l2pi[None, :]
        E = xp.exp(-2j * math.pi * C)
        del C
        A = xp.exp(-xp.asarray(sig[a:b])[:, None] * logp[None, :])
        E *= A
        del A
        e3[a:b] = asnp(E[:, i3] * xp.exp(xp.asarray(sig[a:b]) * math.log(3)))
        for f, u in enumerate(Ux):
            Lg = -xp.log1p(-(E * u[None, :]))
            out[a:b, f, :] = asnp(Lg @ ind)
            del Lg
        del E

    for a in range(0, K, ck):
        retry(body, a, min(K, a + ck))
        free()
    return out, e3


def dir_sums(t_int, delta, sig, M, coef, lev, hi_p, lo_p, haar_base=None, chunk_elems=None):
    """S_k,c = sum_{n <= M_k} coef[n, c] n^(-sig_k - i t_k). coef: (N+1, ncol). hi_p, lo_p for lev.primes.
    Points are processed in increasing order of M_k and each chunk uses only the columns n <= max M in the chunk."""
    if chunk_elems is None:
        chunk_elems = float(os.environ.get('RH_CHUNK', 6e7 if GPU else 1.5e7))
    K = len(t_int)
    t_int = np.asarray(t_int); delta = np.asarray(delta, dtype=float)
    sig = np.broadcast_to(np.asarray(sig, dtype=float), (K,))
    M = np.minimum(np.broadcast_to(np.asarray(M), (K,)).astype(np.int64), lev.N)
    order = np.argsort(M, kind='stable')
    out = np.empty((K, coef.shape[1]), dtype=complex)
    cfull = coef.astype(complex)
    a = 0
    while a < K:
        nm = int(M[order[min(K - 1, a + max(1, int(chunk_elems // (int(M[order[a]]) + 1))) - 1)]])
        b = min(K, a + max(1, int(chunk_elems // (nm + 1))))
        sel = order[a:b]
        nm = int(M[sel].max())

        def body(sel=sel, nm=nm):
            npr = int(np.searchsorted(lev.primes, nm, side='right'))
            logn = xp.asarray(lev.logn[:nm + 1])
            l2pi_p = xp.asarray(np.log(lev.primes[:npr]) / (2 * math.pi))
            if haar_base is None:
                Cp = base_cycles(t_int[sel], hi_p[:npr], lo_p[:npr])
            else:
                Cp = xp.asarray(haar_base[sel][:, :npr])
            Cp = Cp + xp.asarray(delta[sel])[:, None] * l2pi_p[None, :]
            C = lev.cycles(Cp, nm)
            del Cp
            E = xp.exp(-2j * math.pi * C)
            del C
            E *= xp.exp(-xp.asarray(sig[sel])[:, None] * logn[None, :])
            nn = xp.arange(nm + 1)
            E *= (nn[None, :] <= xp.asarray(M[sel])[:, None]) & (nn[None, :] >= 1)
            out[sel] = asnp(E @ xp.asarray(cfull[:nm + 1]))

        retry(body)
        free()
        a = b
    return out


# ---------------------------------------------------------------- gamma factors (mpmath, CPU)
def theta_F(t, q=1, a=0, omega=0.0):
    """arg of (q/pi)^(s/2) Gamma((s+a)/2) at s = 1/2 + it, minus omega (mp numbers)."""
    t = mp.mpf(t)
    return t / 2 * mp.log(mp.mpf(q) / mp.pi) + mp.im(mp.loggamma((mp.mpf(1) / 2 + a + 1j * t) / 2)) - omega


def gram_point(n, q=1, a=0, omega=0.0, t0=None):
    """Solve theta_F(g) = n pi by Newton (mp)."""
    target = n * mp.pi
    if t0 is None:
        # theta ~ (t/2) log(q t / (2 pi e)): invert roughly
        t0 = mp.mpf(max(10.0, 2 * math.pi * (n + 1) / max(1.0, math.log(max(n, 3)))))
        for _ in range(60):
            t0 = 2 * (target + omega + mp.pi / 8) / mp.log(q * t0 / (2 * mp.pi * mp.e))
    g = mp.mpf(t0)
    for _ in range(8):
        d = mp.log(q * g / (2 * mp.pi)) / 2
        step = (theta_F(g, q, a, omega) - target) / d
        g -= step
        if abs(step) < mp.mpf(10) ** (-(mp.mp.dps - 8)):
            break
    return g


def X_factor(s, q=1, a=0, W=1.0):
    """L(s, chi) = X(s) L(1-s, chibar): X = W (pi/q)^(s-1/2) Gamma((1-s+a)/2) / Gamma((s+a)/2) (mp complex)."""
    s = mp.mpc(s)
    return mp.mpc(W) * mp.exp((s - mp.mpf(1) / 2) * mp.log(mp.pi / q) + mp.loggamma((1 - s + a) / 2) - mp.loggamma((s + a) / 2))


# ---------------------------------------------------------------- exact values at low height (Euler-Maclaurin, numpy)
_B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510]


def hurwitz_em(s, x, chunk=2e7):
    """Hurwitz zeta(s, x) for complex s (array, |Im s| up to about 1e6, s != 1), 0 < x <= 1: Euler-Maclaurin, float64."""
    s = np.asarray(s, dtype=complex)
    out = np.empty(len(s), dtype=complex)
    order = np.argsort(np.abs(s.imag))
    a = 0
    while a < len(s):
        N = int(1.2 * abs(s[order[a]].imag) + 30)
        b = min(len(s), a + max(1, int(chunk // N)))
        N = int(1.2 * abs(s[order[b - 1]].imag) + 30)      # largest N in the first guess; shrink the chunk to it
        b = min(len(s), a + max(1, int(chunk // N)))
        sel = order[a:b]
        N = int(1.2 * np.abs(s[sel].imag).max() + 30)
        ss = s[sel]
        ln = np.log(np.arange(N) + x)
        tot = np.exp(-ss[:, None] * ln[None, :]).sum(axis=1)
        y = N + x
        ly = math.log(y)
        tot += np.exp((1 - ss) * ly) / (ss - 1) + 0.5 * np.exp(-ss * ly)
        term = ss * np.exp((-ss - 1) * ly)          # s (N+x)^(-s-1)
        fact = 2.0
        for k in range(1, len(_B2K) + 1):
            tot += _B2K[k - 1] / fact * term
            term = term * (ss + 2 * k - 1) * (ss + 2 * k) / (y * y)
            fact *= (2 * k + 1) * (2 * k + 2)
        out[sel] = tot
        a = b
    return out


def zeta_low(s):
    return hurwitz_em(s, 1.0)


def chi5_low(s, conj=False):
    s = np.asarray(s, dtype=complex)
    c = np.conj(CHI5) if conj else CHI5
    return sum(c[a] * hurwitz_em(s, a / 5.0) for a in range(1, 5)) * np.exp(-s * math.log(5))
