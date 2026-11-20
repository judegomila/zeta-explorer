#!/usr/bin/env python3
"""limit_check.py -- the resonant-frequency sum at modulus length Y = X/Q -> infinity against the closed form K0 W^(5/6) A(sigma, 1).
c = 1, complete coefficient, weight W = (1-x)^j. The n-sum over the class sigma is replaced by its density (r_F/24) phi(k)/N(k):
  T_Y / Q^(5/6) = (1/vol) (r_F/24) Y^(-2/3)/(2^(2/3)-1) sum_{f = +-2^A lam^B k^6} w(f) chi_sigma(f/e0) (phi(k)/N(k)) int_Y^{2Y} y^(-1/2) Phi(4 N(f)/(3y)) dy.
Checks the residue calculus that gives K0 (not the Poisson step, which finiteX*.py checks against data)."""
import math, numpy as np
from scipy.special import jv
from lib import *
j = 3
def Phi(x):
    a = 2 * np.pi * np.sqrt(np.maximum(x, 1e-300)); return np.pi * 2 ** (j + 1) * math.factorial(j) * jv(j + 1, a) / a ** (j + 1)
mel = math.gamma(5 / 6) * math.factorial(j) / math.gamma(5 / 6 + j + 1)
# ideals prime to 6 with norm <= KM, with phi(k)/N(k)
def ideals(KM):
    out = {}
    R = int(math.isqrt(4 * KM // 3)) + 2
    for a in range(-R, R + 1):
        for b in range(-R, R + 1):
            N = a * a - a * b + b * b
            if N == 0 or N > KM or N % 2 == 0 or N % 3 == 0: continue
            if not Z.is_primary((a, b)): continue
            # prime ideal factors
            f = 1.0; n = N; q = 5
            while q * q <= n:
                if n % q == 0:
                    while n % q == 0: n //= q
                    if q % 3 == 2: f *= (1 - 1 / q ** 2)
                    else:
                        pi = Z.split_primary(q)
                        for P in (pi, Z.conj(pi)):
                            if Z.divides(P, (a, b)): f *= (1 - 1 / q)
                q += 2
            if n > 1:
                if n % 3 == 2: f *= (1 - 1 / n ** 2)
                else:
                    pi = Z.split_primary(n)
                    for P in (pi, Z.conj(pi)):
                        if Z.divides(P, (a, b)): f *= (1 - 1 / n)
            out.setdefault(N, []).append(f)
    Ns = []; fs = []
    for N, v in out.items():
        for x in v: Ns.append(N); fs.append(x)
    return np.array(Ns, float), np.array(fs)
vol = math.sqrt(3) / 2
tau = Z.mod4_index((1, 0)); blk = [0, 1, 2, 3, 8, 11]
xs, wq = np.polynomial.legendre.leggauss(400)
np.set_printoptions(precision=4, suppress=True, linewidth=200)
for name, wa, wb in (('all rows', w_all, w_all), ('rows prime to 6', w_odd2, w_odd3)):
    Ainf = Amat(wa, wb)[:, tau]
    print(name, " closed form K0 W^ A(sigma,1):", (K0 * mel * Ainf)[blk])
    for Y in (1e4, 1e7, 1e10, 1e13, 1e16):
        KM = int((60 * Y * 12) ** (1 / 6)) + 2
        Nk, fk = ideals(KM)
        y = Y * (1.5 + 0.5 * xs); wy = 0.5 * Y * wq
        tot = np.zeros(12, complex)
        for Aexp in range(-1, 80):
            if (Aexp - 1) % 2 or wa(Aexp) == 0: continue
            for Bexp in range(-1, 80):
                if (Bexp - 5) % 3 or wb(Bexp) == 0: continue
                N0 = 4.0 ** Aexp * 3.0 ** Bexp
                if N0 > 60 * Y: break
                kk = Nk ** 6 * N0 <= 60 * Y
                if not kk.any(): continue
                arg = (4 / 3) * (Nk[kk] ** 6 * N0)[:, None] / y[None, :]
                val = ((Phi(arg) * (y ** -0.5 * wy)[None, :]).sum(1) * fk[kk]).sum()
                a = Aexp - 1; b = Bexp - 5
                for sign in (0, 1):
                    tot += wa(Aexp) * wb(Bexp) * val * np.array([chi_cls(s, sign + 1, a, b) for s in range(12)])
        T = tot / vol * (rF / 24) * Y ** (-2 / 3) / (2 ** (2 / 3) - 1)
        print(f"   Y = {Y:.0e} (ideals k with N(k) <= {KM}: {len(Nk)}):", T[blk], "  max rel dev", float(np.abs(T[blk] - (K0 * mel * Ainf)[blk]).max() / np.abs(K0 * mel * Ainf[blk]).max()))
