"""Shared control library (s2-heat-root-drift-forces): log-derivative coefficients Lambda_F(n) (-F'/F = sum Lambda_F(n) n^-s),
   archimedean / pole data of the explicit formula, exponential sums.
   Explicit formula used everywhere (ordinate variable; zeros rho = 1/2 + i zeta, A a test function, Ahat(g) = int A(v) e^{igv} dv):
     sum_zeta Ahat(zeta) = sum_{c in poles} int A(v) 2cosh(c v) dv  +  const * A(0)
                          + sum_{e in gam} int_0^inf [A(0) e^{-2v}/v - e^{-e v} (A(v)+A(-v)) / (1 - e^{-2v})] dv
                          - sum_n Lambda_F(n) n^{-1/2} (A(log n) + A(-log n))            (real coefficients)
   SPEC[code] = poles (exponents c), gam (exponents e = 1/2 + mu_j), const = log N - d log pi."""
import math, os, numpy as np
LOGPI = math.log(math.pi)
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
TNR_Q, TNR_C = 3, 2.2
TNR_THETA = math.acosh(TNR_C / 2)

def spec(code):
    if code in ('ZETA', 'SGN-LIOU', 'SGN-R'): return dict(poles=[0.5], gam=[0.5], const=-LOGPI)
    if code == 'LCHI5': return dict(poles=[], gam=[0.5], const=math.log(5 / math.pi))
    if code == 'DH': return dict(poles=[], gam=[1.5], const=math.log(5 / math.pi))
    if code == 'TNR': return dict(poles=[0.5], gam=[0.5], const=-LOGPI + 2 * math.log(TNR_Q))
    if code.startswith('EA-'):
        a = eval(code[3:]); return dict(poles=[0.5 + a, 0.5 - a], gam=[0.5 + a, 0.5 - a], const=-2 * LOGPI)
    raise KeyError(code)

def primes_upto(X):
    X = int(X)
    if X < 2: return np.zeros(0, dtype=np.int64)
    print('sieve to %d: planned %.2f GB' % (X, X / 2 / 1e9), flush=True)
    s = np.ones(X // 2 + 1, dtype=bool); s[0] = False     # index i <-> 2i+1
    for i in range(1, int(math.isqrt(X)) // 2 + 1):
        if s[i]: s[2 * i * (i + 1)::2 * i + 1] = False
    p = 2 * np.nonzero(s)[0].astype(np.int64) + 1
    p = p[p <= X]
    return np.concatenate([[2], p])

_PP = {}
def prime_powers(X):
    """n = p^m <= X sorted; returns n, p, m"""
    X = int(X)
    if X in _PP: return _PP[X]
    pr = primes_upto(X); ns = [pr]; ps = [pr]; ms = [np.ones(len(pr), dtype=np.int64)]
    m = 2
    while 2 ** m <= X:
        q = pr[pr <= int(round(X ** (1.0 / m))) + 1]; q = q[q ** m <= X]
        ns.append(q ** m); ps.append(q); ms.append(np.full(len(q), m, dtype=np.int64)); m += 1
    n = np.concatenate(ns); p = np.concatenate(ps); mm = np.concatenate(ms); o = np.argsort(n, kind='stable')
    _PP[X] = (n[o], p[o], mm[o]); return _PP[X]

def dh_lambda(X):
    """Lambda_DH(n), n <= X (index n), from a(n) log n = sum_{d|n} Lambda(d) a(n/d), a periodic mod 5: (0, 1, k, -k, -1)."""
    X = int(X); print('dh_lambda to %d: planned %.2f GB' % (X, 16 * X / 1e9), flush=True)
    per = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])
    a = np.tile(per, X // 5 + 1)[:X + 1].copy()
    L = np.log(np.maximum(np.arange(X + 1, dtype=np.float64), 1.0)); L *= a; L[:2] = 0.0
    try:
        import numba
        @numba.njit(cache=False)
        def run(L, a, X):
            for d in range(2, X // 2 + 1):
                Ld = L[d]
                if Ld != 0.0:
                    m = 2; k = 2 * d
                    while k <= X:
                        L[k] -= Ld * a[m]; m += 1; k += d
        run(L, a, X)
    except ImportError:
        for d in range(2, X // 2 + 1):
            Ld = L[d]
            if Ld != 0.0: L[2 * d::d] -= Ld * a[2:X // d + 1]
    return L

def chi5(n):
    return np.array([0.0, 1.0, -1.0, -1.0, 1.0])[n % 5]

def coeffs(code, X, seed=121000):
    """returns v = log n (float64), c = Lambda_F(n)/sqrt(n) for all n <= X with nonzero coefficient"""
    if code == 'DH':
        L = dh_lambda(X); n = np.arange(2, int(X) + 1, dtype=np.float64); c = L[2:] / np.sqrt(n); del L; np.log(n, out=n); return n, c
    n, p, m = prime_powers(X); lp = np.log(p); v = m * lp; base = lp / np.sqrt(n)
    if code == 'ZETA': return v, base
    if code == 'LCHI5': return v, base * chi5(n)
    if code == 'SGN-LIOU': return v, base * np.where(m % 2 == 1, -1.0, 1.0)
    if code == 'SGN-R':
        pr = primes_upto(X); rng = np.random.Generator(np.random.PCG64(seed)); eps = 1 - 2 * rng.integers(0, 2, size=len(pr))
        e = eps[np.searchsorted(pr, p)]; return v, base * np.where(m % 2 == 1, e, 1.0)
    if code == 'TNR':
        c = base.copy(); isq = (p == TNR_Q)
        c[isq] = math.log(TNR_Q) * (TNR_Q ** (-m[isq] / 2.0) - (-1.0) ** m[isq] * 2 * np.cosh(m[isq] * TNR_THETA))
        return v, c
    if code.startswith('EA-'):
        a = eval(code[3:]); return v, base * 2 * np.cosh(a * v)
    raise KeyError(code)

def expsum(v, c, omega):
    """S(omega_k) = sum_n c_n exp(i omega_k v_n), direct, chunked (float64). omega arbitrary."""
    out = np.zeros(len(omega), dtype=np.complex128); ch = max(1, int(2e7 // max(1, len(omega))))
    for i in range(0, len(v), ch):
        ph = np.outer(omega, v[i:i + ch]); out += (np.cos(ph) + 1j * np.sin(ph)) @ c[i:i + ch]
    return out

def expsum_uniform(v, c, a, K):
    """S(pi k / a), k = 0..K, for 0 <= v <= 2a: NUFFT type 1 when finufft is present (else direct)."""
    if len(v) * (K + 1) <= float(os.environ.get('RH_DIRECT_MAX', '2e10')): return expsum(v, c, np.pi * np.arange(K + 1) / a)
    try:
        import finufft
        x = (np.pi * v / a); x = np.where(x >= np.pi, x - 2 * np.pi, x)
        f = finufft.nufft1d1(x, c.astype(np.complex128), 2 * K + 1, eps=1e-14, isign=1)
        return f[K:]
    except ImportError:
        return expsum(v, c, np.pi * np.arange(K + 1) / a)
