# Second pass, different code path: Kronecker symbol by prime factorisation and Euler's criterion;
# sums K(m,c) straight from the definition; closed forms written by hand from RESULT.md section 2.
import sys, json, math, cmath, time
import numpy as np
import mpmath as mp
mp.mp.dps = 25
OUT = sys.argv[1]; t0 = time.time(); res = {}
def legendre(a, p):
    a %= p
    if a == 0: return 0
    return 1 if pow(a, (p - 1)//2, p) == 1 else -1
def fac(n):
    f = []; p = 3
    while p * p <= n:
        while n % p == 0: f.append(p); n //= p
        p += 2
    if n > 1: f.append(n)
    return f
_fc = {}
def sym(c, d):  # (c/d), d odd > 0, as a product of Legendre symbols
    if d not in _fc: _fc[d] = fac(d)
    r = 1
    for p in _fc[d]:
        r *= legendre(c, p)
        if r == 0: return 0
    return r
C = 1400
def Kvec(c):
    v = np.zeros(c, dtype=complex)
    for d in range(1, c, 2):
        x = sym(c, d)
        if x: v[d] = x * (1 if d % 4 == 1 else 1j)
    return v
# accumulate S(m) = sum_{4|c<=C} K(m,c) c^{-2s} for a list of m, two values of s
ms = [0, 1, 9, 25, 2, 5, -3, -7, 121, 242, 605, -363, 169, 338, 845, -507]
svals = [complex(1.6, 0.45), complex(1.75, -1.2)]
S = {(m, i): 0j for m in ms for i in range(len(svals))}
for c in range(4, C + 1, 4):
    v = Kvec(c)
    d = np.nonzero(v)[0]
    for m in ms:
        k = np.sum(v[d] * np.exp(2j*np.pi*((m * d) % c)/c))
        for i, s in enumerate(svals):
            S[(m, i)] += k * c**(-2*s)
z = lambda x: complex(mp.zeta(x))
out = {}
for i, s in enumerate(svals):
    u = 2*s - 0.5
    A1 = (1+1j) * 2**(-4*s) * (1 + 2**(1-u)) / (1 + 2**(-u)) * z(u) / z(2*u)
    A0 = (1+1j) * 2**(-4*s) * z(4*s - 2) / ((1 - 2**(1 - 4*s)) * z(4*s - 1))
    x3 = 3**(-2*s); A9 = A1 * (1 + 6*x3**2 + 3**2.5 * x3**3) / (1 + 3**(-u))
    x5 = 5**(-2*s); A25 = A1 * (1 + 20*x5**2 + 5**2.5 * x5**3) / (1 + 5**(-u))
    o = {'A(1) series - closed': abs(S[(1, i)] - A1), 'A(0) series - closed': abs(S[(0, i)] - A0),
         'A(9) series - closed': abs(S[(9, i)] - A9), 'A(25) series - closed': abs(S[(25, i)] - A25),
         'abs A(1)': abs(A1)}
    # Hecke relation at p = 11, 13 from the truncated series alone
    for p in (11, 13):
        lam = p**(2*s - 1) + p**(1 - 2*s)
        bb = lambda m: S[(m, i)] * abs(m)**(s - 1)
        for t in (1, 2, 5, -3):
            lhs = p * bb(t*p*p) + p**-0.5 * legendre(t, p) * bb(t)
            o['Hecke defect p=%d m=%d (rel)' % (p, t)] = abs(lhs - lam * bb(t)) / abs(lam * bb(t))
    out[str(s)] = o
res['R1_series_vs_closed_forms_and_Hecke'] = out
res['R1_note'] = 'series truncated at c <= %d; tail of order C^(-2.2) times divisor factors' % C
# R2: zeros 3, 4, 5: the D = 1 row through the hand-written closed form, and two non-square rows through Hurwitz zeta
def Lchar(m, u, q):   # sum over odd n coprime to m of (m/n) n^-u, modulus q = 8|m|
    tot = mp.mpc(0)
    for a in range(1, q, 2):
        x = sym(m % (8*abs(m)) if m > 0 else m, a) if math.gcd(a, abs(m)) == 1 else 0
        if x: tot += x * mp.zeta(u, mp.mpf(a)/q)
    return tot * mp.power(q, -u)
R2 = {}
for k in (1, 3, 4, 5):
    rho = mp.zetazero(k); s = mp.mpf(1)/4 + rho/2; u = rho
    A1 = (1+1j) * mp.power(2, -4*s) * (1 + mp.power(2, 1-u)) / (1 + mp.power(2, -u)) * mp.zeta(u) / mp.zeta(2*u)
    # m = 5 and m = -3 (odd squarefree, v_2 = 0): 2-adic weight computed from the definition
    def W(m):
        tot = 0
        for a in (2, 3):
            q = 2**a; Ua = 0
            for d in range(1, q, 2):
                e = 1 if d % 4 == 1 else 1j
                two = (1 if d % 8 in (1, 7) else -1)**a
                Ua += e * two * cmath.exp(2j*math.pi*m*d/q)
            tot += complex(mp.power(2, -2*a*s)) * Ua     # r = 1 term; equal for all r by checks.py B2
        return tot
    def Am(m):
        L = Lchar(m, u, 8*abs(m))
        # local factor at the prime |m| (v = 1): 1 - p^(1-4s) = 1 - p^(-2u); it cancels the factor removed from zeta(2u)
        return W(m) * L / (mp.zeta(2*u) * (1 - mp.power(2, -2*u)))
    R2['zero%d' % k] = {'abs A(1,s_rho)': float(abs(A1)), 'abs A(5,s_rho)': float(abs(Am(5))), 'abs A(-3,s_rho)': float(abs(Am(-3))),
                        'abs zeta(2rho)': float(abs(mp.zeta(2*rho)))}
res['R2_zeros_1_3_4_5'] = R2
# R3: exponent count. w*(P,d) >= P - 1 for d >= 2 (grid), and P - beta_0 = 1
def wstar(P, d):
    A = (d - 1)/2 + d*(P - 1)
    return (A*P - (P - 1))/(A + 1)
mn = min(wstar(1 + b0, d) - b0 for d in (2, 3, 4, 6, 9, 16) for b0 in [j/200 for j in range(0, 101)])
res['R3_min over d, beta_0 in [0,1/2] of w*(1+beta_0,d) - beta_0'] = mn
res['R3_w*(1+b0,4) for b0 = 0, .1, .25, .5'] = [wstar(1 + b, 4) for b in (0, .1, .25, .5)]
res['seconds'] = time.time() - t0
json.dump(res, open(OUT, 'w'), indent=1); print(json.dumps(res, indent=1))
