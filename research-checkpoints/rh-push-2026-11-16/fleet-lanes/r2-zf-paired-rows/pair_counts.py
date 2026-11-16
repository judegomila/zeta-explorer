#!/usr/bin/env python3
"""pair_counts.py -- trivialising rows of product families (valuation model over Z; primes of Z stand for prime ideals).

Family: rows (u1, u2), u_i <= H_i, character chi^(e1)(u1) chi^(e2)(u2) with chi of order r.
Trivial row: e1 v_p(u1) + e2 v_p(u2) = 0 mod r for every prime p.
Checks: (L1) J <= #{(u1,u2): u1 u2 powerful};  (L2) fibre bound: for each u2 at most ~H1^(1/r1) values of u1;
        (L3) exponent = value of the LP  max sum_v y_v  s.t. sum_v y_v v <= (lam1, lam2), v over solution vectors.
"""
import math, sys, itertools
from collections import Counter
from fractions import Fraction as Fr

def spf_table(n):
    spf = list(range(n + 1))
    for i in range(2, int(n ** .5) + 1):
        if spf[i] == i:
            for j in range(i * i, n + 1, i):
                if spf[j] == j: spf[j] = i
    return spf

def key(u, e, r, spf):
    out = []
    while u > 1:
        p = spf[u]; k = 0
        while u % p == 0: u //= p; k += 1
        x = (e * k) % r
        if x: out.append((p, x))
    return tuple(out)

def count(H1, H2, e1, e2, r, spf):
    c1 = Counter(key(u, e1, r, spf) for u in range(1, H1 + 1))
    J = 0; fib = 0
    for u in range(1, H2 + 1):
        k = tuple((p, (-x) % r) for p, x in key(u, e2, r, spf))
        m = c1.get(k, 0); J += m; fib = max(fib, m)
    return J, fib

def powerful_pairs(H1, H2, spf):
    def sig(u):
        d = {}
        while u > 1:
            p = spf[u]; k = 0
            while u % p == 0: u //= p; k += 1
            d[p] = k
        return d
    # pairs with u1*u2 powerful: every prime of u1 with exponent 1 must divide u2 and conversely
    sf1 = Counter(); 
    def unit_part(u):
        out = 1; 
        for p, k in sig(u).items():
            if k == 1: out *= p
        return out
    import collections
    by = collections.defaultdict(list)
    for u in range(1, H1 + 1): by[unit_part(u)].append(u)
    tot = 0
    for v in range(1, H2 + 1):
        a = unit_part(v); sv = sig(v)
        # u must be divisible by a, and unit_part(u) must divide v
        for dv in divisors_of(v, sv):
            for u in by.get(dv, ()):
                if u % a == 0: tot += 1
    return tot

def divisors_of(v, sv):
    ds = [1]
    for p, k in sv.items():
        ds = [d * p ** j for d in ds for j in range(k + 1)]
    return ds

def lp_exponent(e1, e2, r, lam1, lam2):
    """max sum y_v, sum y_v v <= lam, v in minimal solution vectors (two-variable LP by vertex enumeration)."""
    vs = [(a, b) for a in range(0, r + 1) for b in range(0, r + 1) if (a, b) != (0, 0) and (e1 * a + e2 * b) % r == 0]
    best = Fr(0)
    for v in vs:
        for w in vs:
            # use v first as much as possible, then w
            t = min([Fr(l, 1) / x for l, x in ((lam1, v[0]), (lam2, v[1])) if x] )
            for frac in [Fr(k, 12) for k in range(13)]:
                y = t * frac
                rem = (lam1 - y * v[0], lam2 - y * v[1])
                z = min([rem[i] / w[i] for i in (0, 1) if w[i]])
                best = max(best, y + z)
    return best

if __name__ == '__main__':
    N = 1 << 17; spf = spf_table(N * 8)
    fams = [('conj pair (4,4): chi(u1) chi-bar(u2)', 1, 3, 4, 4, 4), ('same orientation (4,4): chi(u1) chi(u2)', 1, 1, 4, 4, 4),
            ('(4,12): chi12^3(u1) chi12^-1(u2)', 3, 11, 12, 4, 12), ('conj pair (6,6)', 1, 5, 6, 6, 6),
            ('(3,6): chi6^2(u1) chi6^-1(u2)', 2, 5, 6, 3, 6), ('conj pair (12,12)', 1, 11, 12, 12, 12)]
    for name, e1, e2, r, r1, r2 in fams:
        print('\n' + name)
        for shape, (l1, l2) in (('H1 = H2', (1, 1)), ('H2 = H1^3', (1, 3)), ('H2 = H1^(1/2)', (2, 1))):
            rows = []
            for H in (2 ** 10, 2 ** 12, 2 ** 14, 2 ** 16):
                unit = H ** (1.0 / max(l1, l2))
                H1 = int(round(unit ** l1)); H2 = int(round(unit ** l2))
                J, fib = count(H1, H2, e1, e2, r, spf)
                rows.append((H1, H2, J, fib))
            (a1, b1, J1, _), (a2, b2, J2, _) = rows[-2], rows[-1]
            slope = math.log(J2 / J1) / math.log((a2 * b2) / (a1 * b1))
            lp = lp_exponent(e1, e2, r, l1, l2) / (l1 + l2)
            print('  %-14s' % shape + '  '.join('(%d,%d): J=%d maxfibre=%d [H1^(1/r1)=%.1f]' % (a, b, J, f, a ** (1.0 / r1)) for a, b, J, f in rows[-2:]))
            print('  %-14s measured density exponent log J / log(H1 H2) (last step) = %.3f ; LP value = %s = %.3f ; J/sqrt(H1H2) = %.3f'
                  % ('', slope, lp, float(lp), J2 / math.sqrt(a2 * b2)))
    print('\n(L1) powerful-product bound, H1 = H2 = H: J(conj 4,4) vs #{u1 u2 powerful} vs H')
    for H in (2 ** 8, 2 ** 10, 2 ** 12):
        J, _ = count(H, H, 1, 3, 4, spf); Pw = powerful_pairs(H, H, spf)
        print('   H=%-6d J=%-7d powerful pairs=%-8d H=%d  H log H=%.0f' % (H, J, Pw, H, H * math.log(H)))
