"""Exact rational checks of the local identities behind the uncompensated (marked-only) high side.
Manuscript Lemma 7.1 (7.11), (7.12), (16.1), (16.2), (16.4), (16.8) for a slot prime p not dividing u (valuation j = 0).
Free rational variables: q = 1/Q, D, R, V, W, c.  Conventions (conjugations were lost in the text extraction, so the
unit phases are kept as one free variable):  c := eta(p) Q^x D  (a unit; c = 1 on the principal row u = 1),
Q^-w = c W,  eta(p)(Q-1)Q^(-x-w) = D W (Q-1) c  ... on u = 1 this is the form used in c6 hp_check.py (c = 1).
Each identity is between rational functions; agreement at 400 random points with independent coordinates proves it."""
from fractions import Fraction as F
import random
random.seed(7)
def rnd(): return F(random.randint(-97, 97), random.randint(101, 199))
def Pstar_711(q, D, R, V, W):              # (7.11), j = 0, principal-row phase convention (c = 1)
    Q = 1 / q
    return (1 / (1 - R)) * ((R * (1 - q) - D * (Q - 1) * W * V) / (1 - V) + (-D + W * R))
ok = dict(a=True, b=True, c=True, d=True, e=True, f=True, g=True)
n = 0
for _ in range(400):
    q, D, R, V, W = rnd(), rnd(), rnd(), rnd(), rnd()
    if 0 in (q, D, R, V, W): continue
    n += 1
    Ps = Pstar_711(q, D, R, V, W)
    P = 1 / (1 - V) + W / (1 - W) + Ps
    H = P * (1 - V) * (1 - W) / (1 - D)                                   # (7.12)
    etaQx = 1 / D                                                         # eta(p) Q^x, c = 1
    Qw = W                                                                # Q^-w,      c = 1
    Gmark = etaQx * Ps * (1 - V) * (1 - W) / (1 - D)                      # marked-only selected factor (Lemma 1)
    G = ((etaQx - Qw) * (1 - V) * (1 - W) * Ps - Qw * (1 - V * W)) / (1 - D)   # (16.2)
    ok["a"] &= (G == Gmark - Qw * H)                                      # Lemma 1(i)
    ok["b"] &= (etaQx * Ps - Qw * P == (1 - D) / ((1 - V) * (1 - W)) * G)   # (16.4) (the common Q^(z-1) dropped)
    E = Ps + D
    rhs = (1 - V) * (1 - W) / (1 - D) * ((1 - Qw) * (V / (1 - V) - D) + (etaQx + 1 - Qw) * E)   # (16.8), v = 1
    ok["c"] &= (G + H == rhs)
    ok["d"] &= (Gmark == -(1 - Qw) * H + rhs)                             # Lemma 1(ii)
    # principal residue point V = W = q
    Ps = Pstar_711(q, D, R, q, q); P = 1 / (1 - q) + q / (1 - q) + Ps
    H = P * (1 - q) ** 2 / (1 - D)
    Gmark = (1 / D) * Ps * (1 - q) ** 2 / (1 - D)
    ok["e"] &= (Gmark == -(1 - q * q) * (1 - q) * (1 - R / D) / ((1 - R) * (1 - D)))
    Bmark = Gmark / H
    ok["f"] &= (Bmark == -(1 - q) * (1 - R / D) / (1 - D * (1 - q) - R * q))
    G = ((1 / D - q) * (1 - q) ** 2 * Ps - q * (1 - q * q)) / (1 - D)
    ok["g"] &= (G / H == Bmark - q)
print("points:", n)
print("(i)   G_p = Gmark_p - Q^-w H_p                                        :", ok["a"])
print("      (16.4) eta Q^x P* - Q^-w P = (1-D)/((1-V)(1-W)) G_p             :", ok["b"])
print("      (16.8) at v = 1 from (7.11)                                     :", ok["c"])
print("(ii)  Gmark_p = -(1 - Q^-w) H_p + Delta_p, Delta_p = rhs of (16.8)    :", ok["d"])
print("(iii) principal point: Gmark_p = -(1-q^2)(1-q)(1 - R/D)/((1-R)(1-D))  :", ok["e"])
print("(iv)  Bmark_p = Gmark_p/H_p = -(1-q)(1 - R/D)/(1 - D(1-q) - Rq)       :", ok["f"])
print("(v)   compensated B_p = Bmark_p - q   (R/D = eta a_p^2 Q^(3-5s))      :", ok["g"])
# sizes of the three terms of the slot multiplier at s = sigma (real), eta = a = 1, for a few Q
print("slot multiplier at real s, phases 1:  Bmark_p + 1,  R/D = Q^(3-5s),  D = Q^-s")
for s in (F(1, 2), F(11, 20), F(3, 5), F(2, 3), F(7, 8)):
    row = []
    for Qn in (7, 31, 103, 1009):
        q = 1 / Qn; Dv = Qn ** (-float(s)); Rv = Qn ** (3 - 6 * float(s))
        row.append(f"{-(1 - q) * (1 - Rv / Dv) / (1 - Dv * (1 - q) - Rv * q) + 1:+.4f}")
    print(f"   s = {str(s):5s}", " ".join(row), f"   (Q = 7, 31, 103, 1009; exponent 3 - 5s = {float(3 - 5 * s):+.3f})")
