"""Coefficient tables to N (numpy). Every allocation is announced before it is made.
Functions return arrays indexed by n (index 0 unused, a[0] = 0).
Seeds: U-j: numpy PCG64(120000 + j), u = rng.random(pi(N)) in increasing prime order, chi(p) = exp(2 pi i u_p).
       SGN-j: numpy PCG64(121000 + j), bits = rng.integers(0, 2, pi(N)), eps(p) = 1 - 2 bit.
"""
import numpy as np, math, hashlib, sys, os

KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)


def announce(what, nbytes):
    print('planned allocation: %s = %.1f MB' % (what, nbytes / 1e6), flush=True)


def spf_sieve(N):
    announce('smallest-prime-factor table int32[%d]' % (N + 1), 4 * (N + 1))
    spf = np.zeros(N + 1, dtype=np.int32)
    for p in range(2, int(N ** 0.5) + 1):
        if spf[p] == 0:
            seg = spf[p * p::p]
            seg[seg == 0] = p
    idx = np.nonzero(spf[2:] == 0)[0] + 2
    spf[idx] = idx
    return spf


def primes_of(spf):
    n = np.arange(len(spf), dtype=np.int32)
    return n[(spf == n) & (n >= 2)]


def additive(spf, w, dtype):
    """f(n) = sum over prime factors with multiplicity of w[p]; w indexed by integer."""
    N = len(spf) - 1
    f = np.zeros(N + 1, dtype=dtype)
    lo = 2
    while lo <= N:
        hi = min(2 * lo, N + 1)
        idx = np.arange(lo, hi)
        p = spf[lo:hi]
        f[lo:hi] = f[idx // p] + w[p]
        lo = hi
    return f


def by_prime(spf, primes, vals, dtype):
    w = np.zeros(len(spf), dtype=dtype); w[primes] = vals
    return w


def u_params(j, npr):
    return np.random.Generator(np.random.PCG64(120000 + j)).random(npr)


def sgn_params(j, npr):
    return (1 - 2 * np.random.Generator(np.random.PCG64(121000 + j)).integers(0, 2, npr)).astype(np.int8)


def coef_U(spf, primes, j):
    u = u_params(j, len(primes))
    th = additive(spf, by_prime(spf, primes, u, np.float64), np.float64)
    a = np.exp(2j * np.pi * th); a[0] = 0
    return a


def coef_from_sign(spf, primes, eps):
    """completely multiplicative with eps(p) in {+1, -1}"""
    c = additive(spf, by_prime(spf, primes, (eps < 0).astype(np.int8), np.int8), np.int8)
    a = (1 - 2 * (c & 1)).astype(np.int8); a[0] = 0
    return a


def coef_SGN(spf, primes, j):
    return coef_from_sign(spf, primes, sgn_params(j, len(primes)))


def coef_LIOU(spf, primes):
    return coef_from_sign(spf, primes, -np.ones(len(primes), dtype=np.int8))


def coef_THIN(spf, primes, S):
    eps = np.ones(len(primes), dtype=np.int8); eps[np.isin(primes, S)] = -1
    return coef_from_sign(spf, primes, eps)


def coef_DEL(spf, primes, S):
    c = additive(spf, by_prime(spf, primes, np.isin(primes, S).astype(np.int8), np.int8), np.int8)
    a = (c == 0).astype(np.int8); a[0] = 0
    return a


def coef_DH(N):
    a = np.zeros(N + 1); pat = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])
    a[:] = pat[np.arange(N + 1) % 5]; a[0] = 0
    return a


def coef_EA(spf, a_):
    """sum_{d|n} d^a (n/d)^-a: multiplicative, f(p^e) = sum_{j=0..e} p^((2j-e)a)"""
    N = len(spf) - 1
    pe = np.ones(N + 1, dtype=np.int64); ee = np.zeros(N + 1, dtype=np.int8)
    f = np.ones(N + 1, dtype=np.float64)
    lo = 2
    while lo <= N:
        hi = min(2 * lo, N + 1)
        idx = np.arange(lo, hi); p = spf[lo:hi].astype(np.int64)
        m = idx // p
        same = spf[m] == p
        pe[lo:hi] = np.where(same, pe[m] * p, p)
        ee[lo:hi] = np.where(same, ee[m] + 1, 1)
        e = ee[lo:hi].astype(np.float64); lp = np.log(p.astype(np.float64))
        g = np.sinh((e + 1) * a_ * lp) / np.sinh(a_ * lp)
        f[lo:hi] = f[idx // pe[lo:hi]] * g
        lo = hi
    f[0] = 0
    return f


def coef_TNR(N, q=3, c=2.2):
    a = np.ones(N + 1); a[0] = 0
    a[q::q] += c * math.sqrt(q); a[q * q::q * q] += q
    return a


def coef_WT(N, alpha):
    n = np.arange(N + 1, dtype=np.float64); n[0] = 1
    a = np.exp(-1j * alpha * np.log(n)); a[0] = 0
    return a


def beurling_integers(primes, X, shift=0.5):
    """sorted generalised integers <= X of the system q = p + shift (float64 products)."""
    q = primes.astype(np.float64) + shift
    small = q[q <= math.sqrt(X)]
    g = np.array([1.0])
    for qq in small:
        parts = [g]; cur = g
        while True:
            cur = cur[cur <= X / qq] * qq
            if len(cur) == 0: break
            parts.append(cur)
        g = np.concatenate(parts)
    g.sort()
    big = q[q > math.sqrt(X)]
    cnt = np.searchsorted(g, X / big, side='right')
    announce('Beurling integers float64[%d]' % (len(g) + int(cnt.sum())), 8 * (len(g) + int(cnt.sum())))
    reps = np.repeat(big, cnt)
    # index within each block: 0..cnt-1
    starts = np.cumsum(cnt) - cnt
    within = np.arange(int(cnt.sum())) - np.repeat(starts, cnt)
    out = np.concatenate([g, reps * g[within]])
    out.sort()
    return out[out <= X]


def sha(a):
    return hashlib.sha256(np.ascontiguousarray(a).tobytes()).hexdigest()


def dirichlet_sum(a, s, chunk=1 << 20):
    N = len(a) - 1; tot = 0j
    for lo in range(1, N + 1, chunk):
        hi = min(lo + chunk, N + 1)
        n = np.arange(lo, hi, dtype=np.float64)
        tot += np.sum(a[lo:hi] * np.exp(-s * np.log(n)))
    return complex(tot)
