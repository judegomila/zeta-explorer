#!/usr/bin/env python3
"""ident.py: check of the exact structure of the pole-corrected symmetrised section:
  F_N(s) = [(1 + (D - psi_G)/L)^k xi](s) + [same at 1-s] + G(s) R_N(s) + G(1-s) R_N(1-s),   psi_G = G'/G,  L = log M,
for k = 1:  F_N(s) = xi(s) (2 - (psi_G(s) + psi_G(1-s))/L) + remainder.   Prints |F_N / (xi m_N) - 1| (k = 1) and, for k = 2,
|F_N - main_2| / |F_N| with main_2 = xi m0 + xi' m1 + 2 xi''/L^2.  mpmath 40 digits, MEASURED."""
import mpmath as mp, json, sys
mp.mp.dps = 40
def G(s): return s * (s - 1) / 2 * mp.pi ** (-s / 2) * mp.gamma(s / 2)
def psiG(s): return 1 / s + 1 / (s - 1) - mp.log(mp.pi) / 2 + mp.digamma(s / 2) / 2
def dpsiG(s): return -1 / s ** 2 - 1 / (s - 1) ** 2 + mp.polygamma(1, s / 2) / 4
def xi(s): return G(s) * mp.zeta(s)
def A(k, N, s):
    L = mp.log(N + 1)
    return mp.fsum((1 - mp.log(n) / L) ** k * mp.mpf(n) ** (-s) for n in range(1, N + 1)) - mp.factorial(k) * (N + 1) ** (1 - s) / ((1 - s) ** (k + 1) * L ** k)
def F(k, N, s): return G(s) * A(k, N, s) + G(1 - s) * A(k, N, 1 - s)
N = int(sys.argv[1]); L = mp.log(N + 1)
print('N', N, '2 pi M =', float(2 * mp.pi * (N + 1)), ' 2 pi M^2 =', float(2 * mp.pi * (N + 1) ** 2))
for t in [float(x) for x in sys.argv[2].split(',')]:
    for sg in (0.5, 0.7):
        s = mp.mpc(sg, t)
        x0 = xi(s); x1 = mp.diff(xi, s); x2 = mp.diff(xi, s, 2)
        p, q = psiG(s), psiG(1 - s)
        m1 = 2 - (p + q) / L
        f1 = F(1, N, s)
        main2 = x0 * (2 - 2 * (p + q) / L + (p * p + q * q - dpsiG(s) - dpsiG(1 - s)) / L ** 2) + x1 * (-2 * (p - q) / L ** 2) + 2 * x2 / L ** 2
        f2 = F(2, N, s)
        print(json.dumps(dict(N=N, s=[sg, t], k1_multiplier_m=[float(m1.real), float(m1.imag)], k1_rel_dev=float(abs(f1 / (x0 * m1) - 1)) if abs(x0 * m1) else None,
                              k2_rel_dev=float(abs(f2 - main2) / abs(f2)))), flush=True)
