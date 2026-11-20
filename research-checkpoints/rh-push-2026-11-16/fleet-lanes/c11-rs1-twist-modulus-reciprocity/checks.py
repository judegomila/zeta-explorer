# Checks for RESULT.md (control lemmas only; this is not stage B). Planned memory: < 50 MB.
import sys
from fractions import Fraction as Fr
from math import gcd
import mpmath as mp
mp.mp.dps = 30
def s3(a, b, c):  # Rademacher s(a,b;c) = sum_{m mod c} ((ma/c))((mb/c)), exact; integer numerator over 4c^2
    if c == 1: return Fr(0)
    t = 0
    for m in range(1, c):
        x = m*a % c; y = m*b % c
        if x and y: t += (2*x - c)*(2*y - c)
    return Fr(t, 4*c*c)
def s2(h, k): return s3(h, 1, k)
def proot(p):
    for g in range(2, p):
        x, o = g, 1
        while x != 1: x = x*g % p; o += 1
        if o == p-1: return g
def chars(p):
    g = proot(p); ind = {}; x = 1
    for j in range(p-1): ind[x] = j; x = x*g % p
    out = []
    for r in range(p-1):
        chi = [0]*p
        for a in range(1, p): chi[a] = mp.expjpi(mp.mpf(2*r*ind[a])/(p-1))
        out.append((r, chi))
    return out
def L(s, chi):
    p = len(chi)
    return sum(chi[a]*mp.zeta(s, mp.mpf(a)/p) for a in range(1, p) if chi[a] != 0)/mp.mpf(p)**s if s != 1 else -sum(chi[a]*mp.digamma(mp.mpf(a)/p) for a in range(1, p))/p
print("== A. three-term reciprocity (exact rationals) ==")
n = bad = 0
for c in [7, 11, 13, 101, 211, 499]:
    for a in range(1, 31):
        for b in range(a, 31):
            if gcd(a, b) == 1 and gcd(a, c) == 1 and gcd(b, c) == 1:
                lhs = s3(a, b, c) + s3(b, c, a) + s3(c, a, b)
                rhs = Fr(a*a + b*b + c*c, 12*a*b*c) - Fr(1, 4)
                n += 1; bad += (lhs != rhs)
print("triples", n, "mismatches", bad)
print("== B. Lemma 1: sum_{chi odd mod p} chi(h)|L(1,chi)|^2 = pi^2 (p-1) s(h,p)/p ==")
worst = mp.mpf(0)
for p in [7, 11, 13, 29]:
    ch = [(r, c) for r, c in chars(p) if r % 2 == 1]   # odd characters: chi(-1) = -1
    L1 = {r: L(1, c) for r, c in ch}
    for h in range(1, p):
        lhs = sum(c[h]*abs(L1[r])**2 for r, c in ch)
        rhs = mp.pi**2*(p-1)*mp.mpf(s2(h, p).numerator)/s2(h, p).denominator/p if s2(h,p)!=0 else mp.mpf(0)
        worst = max(worst, abs(lhs-rhs))
print("max abs difference over p in {7,11,13,29}, all h:", mp.nstr(worst, 5))
print("== C. T-NR twin, s=1 model: X(s,chi) = L(s,chi)(1 + c q^(1/2-s) chi(q) + q^(1-2s) chi(q)^2) ==")
for (p, q, cc) in [(29, 2, 3.0), (29, 3, -2.5), (13, 2, 3.0), (29, 3, 2.2), (31, 5, 2.1)]:
    ch = [(r, c) for r, c in chars(p) if r % 2 == 1]
    u = [mp.mpf(1), mp.mpf(cc)/mp.sqrt(q), mp.mpf(1)/q]
    qi = pow(q, -1, p); worst = mp.mpf(0); big = mp.mpf(0)
    for h in range(1, p):
        lhs = sum(c[h]*abs(L(1, c)*(u[0] + u[1]*c[q] + u[2]*c[q]**2))**2 for r, c in ch)
        rhs = mp.mpf(0)
        for i in range(3):
            for j in range(3):
                hh = h*pow(q, i, p)*pow(qi, j, p) % p
                sv = s2(hh, p)
                rhs += u[i]*u[j]*mp.pi**2*(p-1)*mp.mpf(sv.numerator)/sv.denominator/p
        worst = max(worst, abs(lhs-rhs)); big = max(big, abs(lhs))
    sig = mp.acosh(abs(cc)/2)/mp.log(q)
    print("p,q,c =", p, q, cc, " max abs diff", mp.nstr(worst, 5), " max abs value", mp.nstr(big, 8), " zeros of twin at Re s = 1/2 +-", mp.nstr(sig, 8))
print("== D. E_a, real a: L(1/2-a,chi)/conj(L(1/2+a,chi)) divided by its value at a=0 ==")
for p in [7, 13]:
    for a in [mp.mpf('0.2'), mp.mpf('0.35')]:
        for par in (0, 1):
            vals = []
            for r, c in chars(p):
                if r == 0 or r % 2 != par: continue
                R0 = L(mp.mpf(1)/2, c)/mp.conj(L(mp.mpf(1)/2, c))
                Ra = L(mp.mpf(1)/2 - a, c)/mp.conj(L(mp.mpf(1)/2 + a, c))
                vals.append(Ra/R0)
            print("p", p, "a", a, "parity", par, " ratio: min re", mp.nstr(min(v.real for v in vals), 12), "max re", mp.nstr(max(v.real for v in vals), 12), "max abs im", mp.nstr(max(abs(v.imag) for v in vals), 3))
print("== E. off the central line of E_a: L(1/2+2a+ig,chi) L(1/2+ig,chi)/eps is not real >= 0 ==")
p = 7; a = mp.mpf('0.2'); g = mp.mpf(3)
for r, c in chars(p):
    if r % 2 == 1:
        eps = L(mp.mpf(1)/2, c)/mp.conj(L(mp.mpf(1)/2, c))
        v = L(mp.mpf(1)/2 + 2*a + 1j*g, c)*L(mp.mpf(1)/2 + 1j*g, c)/eps
        print("r", r, mp.nstr(v, 8))
print("== F. EIS-w (complex a): L(1/2+a+it,chi) conj(L(1/2+conj(a)+it,chi)), a = 0.2+1.5i, t = 3, p = 7, odd chi ==")
a = mp.mpc('0.2', '1.5'); t = mp.mpf(3)
for r, c in chars(7):
    if r % 2 == 1:
        v = L(mp.mpf(1)/2 + a + 1j*t, c)*mp.conj(L(mp.mpf(1)/2 + mp.conj(a) + 1j*t, c))
        print("r", r, mp.nstr(v, 8))
print("== G. zero-one law at X >= p-1: weights a_l, l = 1..p-1, with F(s,chi) A_chi(s) = 1 for all chi mod p ==")
for p, s in [(7, mp.mpc('0.75', '3')), (13, mp.mpc('0.6', '14.2'))]:
    ch = chars(p)
    Lv = {}
    for r, c in ch:
        Lv[r] = mp.zeta(s)*(1 - mp.mpf(p)**(-s)) if r == 0 else L(s, c)
    al = {l: sum(mp.conj(c[l])/Lv[r] for r, c in ch)/(p-1)*mp.mpf(l)**s for l in range(1, p)}
    tot = sum(abs(Lv[r]*sum(al[l]*c[l]*mp.mpf(l)**(-s) for l in range(1, p)) - 1)**2 for r, c in ch)
    print("p", p, "s", s, " sum_chi |F A - 1|^2 =", mp.nstr(tot, 3), " max |a_l| =", mp.nstr(max(abs(v) for v in al.values()), 6), " min |L(s,chi)| =", mp.nstr(min(abs(v) for v in Lv.values()), 6))
