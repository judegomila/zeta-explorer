#!/usr/bin/env python3
"""conv_rate.py: check of the expansion A_N(s) = sum_{j<=k} C(k,j) zeta^(j)(s) / log^j M + R_N(s) (R_N = O(M^-c)) for the pole-corrected order-k
Riesz section, and of the first-order term of F_N - 2 xi.  float64 sums, mpmath derivatives.  MEASURED."""
import math, json
import numpy as np, mpmath as mp
mp.mp.dps = 30
def A(k, N, s):
    n = np.arange(1, N + 1.0); ln = np.log(n); L = math.log(N + 1)
    D = complex(np.sum((1 - ln / L) ** k * np.exp(-s * ln)))
    return D - math.factorial(k) * np.exp((1 - s) * L) / ((1 - s) ** (k + 1) * L ** k)
for k in (1, 2, 3):
    for s in (0.7 + 10j, 0.5 + 14.134725141734695j, 0.3 + 30j, 0.5 + 100j):
        z = [complex(mp.zeta(s, derivative=j)) for j in range(k + 1)]
        for N in (10 ** 2, 10 ** 4, 10 ** 6):
            L = math.log(N + 1); a = A(k, N, s)
            pred = sum(math.comb(k, j) * z[j] / L ** j for j in range(k + 1))
            print(json.dumps(dict(k=k, s=str(s), N=N, abs_A_minus_zeta=abs(a - z[0]), k_over_L_abs_zeta1=k / L * abs(z[1]),
                                  abs_remainder_R=abs(a - pred), M_pow_minus_half=(N + 1) ** -0.5)), flush=True)
