# Thin set S of primes with pi_S(x) = floor-greedy approximation to L(x) = (1/2) int_2^x t^(b-1)/log t dt.
# Rule: c_0 = 0, c_n = min(c_{n-1} + 1, floor(L(p_n))); p_n in S iff c_n > c_{n-1}.
import numpy as np
from scipy.special import expi
B = 0.9
EI2 = float(expi(B * np.log(2.0)))
def Lfun(x):
    return 0.5 * (expi(B * np.log(x)) - EI2)
def base_primes(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]
def prime_segments(N, seg=1 << 24):
    bp = base_primes(int(N ** 0.5) + 1)
    lo = 2
    while lo <= N:
        hi = min(lo + seg, N + 1)
        a = np.ones(hi - lo, dtype=bool)
        for p in bp:
            p = int(p)
            if p * p >= hi: break
            st = max(p * p, ((lo + p - 1) // p) * p)
            a[st - lo::p] = False
        yield (np.nonzero(a)[0] + lo).astype(np.int64)
        lo = hi
def thin_segments(N, seg=1 << 24):
    """yields (primes, inS mask, c array, L array) per segment"""
    n0 = 0; runmin = 0; cprev = 0
    for pr in prime_segments(N, seg):
        Lp = Lfun(pr.astype(np.float64))
        f = np.floor(Lp).astype(np.int64)
        k = n0 + 1 + np.arange(len(pr), dtype=np.int64)
        m = np.minimum(np.minimum.accumulate(f - k), runmin)
        c = k + m
        cp = np.concatenate(([cprev], c[:-1]))
        yield pr, c > cp, c, Lp
        n0 += len(pr); runmin = int(m[-1]); cprev = int(c[-1])
