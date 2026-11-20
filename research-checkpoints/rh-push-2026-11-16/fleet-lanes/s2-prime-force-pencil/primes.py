"""Segmented odd sieve; THIN set (greedy floor rule, b = 0.9); sign hash."""
import math, numpy as np
from scipy.special import expi

def base_primes(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]

def prime_segments(pmax, seg=1 << 24):
    """yields int64 arrays of the primes in consecutive ranges, up to pmax (inclusive)."""
    bp = base_primes(int(math.isqrt(pmax)) + 1); bp = bp[bp > 2]
    lo = 3; first = True
    while lo <= pmax:
        hi = min(pmax + 1, lo + 2 * seg)          # odd numbers lo, lo+2, ... < hi
        n = (hi - lo + 1) // 2
        s = np.ones(n, dtype=bool)
        for p in bp:
            if p * p >= hi: break
            st = max(p * p, ((lo + p - 1) // p) * p)
            if st % 2 == 0: st += p
            s[(st - lo) // 2::p] = False
        pr = lo + 2 * np.nonzero(s)[0].astype(np.int64)
        if first: pr = np.concatenate([[2], pr]); first = False
        yield pr
        lo = lo + 2 * n

def li(x): return expi(np.log(x))
class Thin:
    """S: prime p is put in S when floor(g(p)) exceeds the number already in S, g(x) = (1/2)(li(x^b) - li(2^b)) (control THIN, b = 0.9)."""
    def __init__(self, b=0.9): self.b = b; self.count = 0; self.c0 = float(li(2.0 ** b))
    def flags(self, pr):
        g = np.floor(0.5 * (li(pr.astype(np.float64) ** self.b) - self.c0)).astype(np.int64)
        # greedy: with count c before the segment, prime i is taken iff g_i > c + (number taken before i); g is non-decreasing and
        # increases by at most 1 between consecutive primes except at the very start, so taken_i = (max(g_i, c) increments)
        t = np.maximum.accumulate(np.maximum(g, self.count)); prev = np.concatenate([[self.count], t[:-1]])
        fl = t > prev                      # an increment by >= 1; increments larger than 1 (only at tiny p) are capped at one prime
        self.count = self.count + int(fl.sum())
        return fl

def sign_hash(pr, seed=1):
    """deterministic +-1 per prime (splitmix-type hash)."""
    z = (pr.astype(np.uint64) + np.uint64(seed) * np.uint64(0x9E3779B97F4A7C15))
    z = (z ^ (z >> np.uint64(30))) * np.uint64(0xBF58476D1CE4E5B9)
    z = (z ^ (z >> np.uint64(27))) * np.uint64(0x94D049BB133111EB)
    z = z ^ (z >> np.uint64(31))
    return np.where((z >> np.uint64(17)) & np.uint64(1), 1.0, -1.0)
