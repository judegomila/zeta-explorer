#!/usr/bin/env python3
"""liou.py NMAX: the Liouville point of the torus (theta_p = pi for all p).  f_{k,N}(sigma) = sum_{n<=N} (1-log n/log(N+1))^k lambda(n) n^-sigma
is real for real sigma and f(sigma) -> 1 as sigma -> +oo, so f_{k,N}(1/2) < 0 forces a real zero in (1/2, oo): a zero of the Bohr lift.
Prints, per order k, the first N with f_{k,N}(1/2) < 0 and whether the sign stays negative up to NMAX (float longdouble, MEASURED;
certified signs: cert_liou.py)."""
import sys, json, math
import numpy as np
NMAX = int(float(sys.argv[1])); ks = [1, 2, 3, 4, 5, 6]
print(f'planned memory about {NMAX * (1 + 16 * 4) / 2 ** 30:.2f} GB', flush=True)
lam = np.ones(NMAX + 1, np.int8)
sieve = np.ones(NMAX + 1, bool); sieve[:2] = False
for p in range(2, NMAX + 1):
    if sieve[p]:
        if p * p <= NMAX: sieve[p * p::p] = False
        q = p
        while q <= NMAX:
            lam[q::q] *= -1; q *= p
n = np.arange(1, NMAX + 1, dtype=np.longdouble); ln = np.log(n)
base = lam[1:] / np.sqrt(n)
Lg = np.log(n + 1)
S = []; t = base.copy()
for j in range(max(ks) + 1):
    S.append(np.cumsum(t)); t = t * ln
for k in ks:
    f = np.zeros(NMAX, np.longdouble)
    for j in range(k + 1):
        f += math.comb(k, j) * (-1) ** j * S[j] / Lg ** j
    neg = np.nonzero(f < 0)[0]
    first = int(neg[0]) + 1 if len(neg) else None
    pos = np.nonzero(f >= 0)[0]
    lastpos = int(pos[-1]) + 1
    print(json.dumps(dict(k=k, NMAX=NMAX, first_N_negative=first, last_N_nonnegative=lastpos, f_at_NMAX=float(f[-1]),
                          sample={str(N): float(f[N - 1]) for N in (100, 1000, 10000, 100000, 1000000, NMAX) if N <= NMAX})), flush=True)
