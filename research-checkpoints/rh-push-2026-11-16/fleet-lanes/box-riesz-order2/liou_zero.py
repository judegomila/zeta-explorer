#!/usr/bin/env python3
"""liou_zero.py: real zeros in (1/2, 1.3) of f_{k,N}(sigma) = sum_{n<=N} (1-log n/log(N+1))^k lambda(n) n^-sigma (float64, MEASURED),
and sigma_1 = root of sum_p arcsin(p^-sigma) = pi/2."""
import sys, json, math
import numpy as np
from scipy.optimize import brentq
import tor
def lam_upto(N):
    lam = np.ones(N + 1, np.int8)
    for p in tor.primes_upto(N):
        q = int(p)
        while q <= N:
            lam[q::q] *= -1; q *= int(p)
    return lam[1:]
if __name__ == '__main__':
    for k, Ns in ((1, [37, 50, 100, 1000]), (2, [292, 300, 400, 600, 959, 2000, 10000]), (3, [2184, 3000, 5000, 10000, 30000, 100000]), (4, [16238, 30000, 100000])):
        for N in Ns:
            lam = lam_upto(N); ln = np.log(np.arange(1, N + 1.0)); w = (1 - ln / math.log(N + 1)) ** k * lam
            f = lambda s: float(w @ np.exp(-s * ln))
            xs = np.linspace(0.5, 1.3, 1601); v = np.array([f(x) for x in xs])
            zs = [brentq(f, xs[i], xs[i + 1], xtol=1e-14) for i in range(len(xs) - 1) if v[i] * v[i + 1] < 0]
            print(json.dumps(dict(k=k, N=N, f_half=v[0], real_zeros=zs, one_minus_k_over_L=1 - k / math.log(N + 1))), flush=True)
    ps = tor.primes_upto(10 ** 7).astype(float)
    g = lambda s: float(np.arcsin(ps ** -s).sum()) + (1e7 ** (1 - s) / ((s - 1) * math.log(1e7))) - math.pi / 2
    print('sigma_1 (sum_p arcsin p^-sigma = pi/2), tail by the prime number theorem:', brentq(g, 1.05, 1.5))
