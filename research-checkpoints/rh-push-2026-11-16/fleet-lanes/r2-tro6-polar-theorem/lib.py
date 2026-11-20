"""lib.py -- predicted polar amplitude for sum_m psi(m) W(N(m)/Q) chi_c(m) rho_nat_sigma(-e0 m)  (see RESULT.md section 2)."""
import sys, math, json, itertools
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import zomega as Z
from math import gamma, pi, sqrt
Z6 = np.exp(1j * np.pi * np.arange(6) / 3)
# class data on (O/4)^x: chi_sigma(-1), chi_sigma(4), chi_sigma(lambda^3) (exponents mod 6), from supp.json (exact table)
E0 = json.load(open(__file__.rsplit('/', 1)[0] + '/supp.json'))['E0']
tab = {(i, j, a, b): v for i, j, a, b, v in E0}
X_M1 = np.array(tab[(1, 0, 0, 0)]); X_4 = np.array(tab[(0, 0, 2, 0)]); X_L3 = np.array(tab[(0, 0, 0, 3)])
REPS = Z.MOD4_REPS
Rm = np.array([[Z.Rrec(a, b) for b in REPS] for a in REPS], float)        # R(sigma, tau)
rF = pi / (3 * sqrt(3)); zF2 = (pi ** 2 / 6) * 0.7813024128964862
K0 = 1.5 * (2 / sqrt(3)) * pi ** (2 / 3) * gamma(1 / 6) / gamma(5 / 6) * (4 / 3) ** (-1 / 6) * rF ** 2 / (240 * zF2)

def chi_cls(s, sign, a, b):
    """chi_sigma(eps), eps = (-1)^sign 2^a lambda^b with a even, 3 | b (any integers)."""
    return Z6[(sign * X_M1[s] + (a // 2) * X_4[s] + (b // 3) * X_L3[s]) % 6]

def Amat(wa, wb, amax=400, bmax=400):
    """A(sigma, tau) = R(sigma,tau) sum_{eps in E0} w(n) chi_sigma(eps) conj chi_tau(-eps) N(n)^(-1/6),
    n = e0 eps = -+ 2^(1+a) lambda^(5+b); frequency n = 2^A lambda^B (up to sign), weight wa(A) wb(B)."""
    A = np.zeros((12, 12), complex)
    for s in range(12):
        for t in range(12):
            tot = 0
            for sign in (0, 1):
                for Aexp in range(-6, amax):
                    a = Aexp - 1
                    if a % 2: continue
                    w2 = wa(Aexp)
                    if w2 == 0: continue
                    for Bexp in range(-6, bmax):
                        b = Bexp - 5
                        if b % 3: continue
                        w3 = wb(Bexp)
                        if w3 == 0: continue
                        tot += w2 * w3 * chi_cls(s, sign, a, b) * np.conj(chi_cls(t, sign + 1, a, b)) * (4.0 ** Aexp * 3.0 ** Bexp) ** (-1 / 6)
            A[s, t] = Rm[s, t] * tot
    return A
w_all = lambda e: 1.0 if e >= 0 else 0.0
w_odd2 = lambda e: 0.75 if e >= 0 else (-0.25 if e == -1 else 0.0)      # rows prime to 2
w_odd3 = lambda e: 2 / 3 if e >= 0 else (-1 / 3 if e == -1 else 0.0)     # rows prime to lambda
