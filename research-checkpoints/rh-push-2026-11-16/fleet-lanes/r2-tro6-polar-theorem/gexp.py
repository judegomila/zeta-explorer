#!/usr/bin/env python3
"""gexp.py -- G on the 12 classes of (O/4)^x, its character expansion, and the class functions that enter the polar part of the theta-row form."""
import numpy as np, math, itertools
from lib import *
import alib as A
T = A.SFTable(SX + '/data/sf_1e7.npz')
G = T.G(); m4 = T.m4.astype(int)
sel = np.flatnonzero(T.N <= 200000)
Gc = np.zeros(12, complex)
for s in range(12):
    v = G[sel][m4[sel] == s]; Gc[s] = v.mean(); assert np.abs(v - v[0]).max() < 1e-7, s
print("G on classes (index: rep, value, 12*arg/2pi):")
for s in range(12): print(f"  {s:2d} {REPS[s]}  {Gc[s]:.4f}  {round(np.angle(Gc[s]) * 6 / np.pi) % 12}")
# group structure: class = w^i (-1)^j lam^k
def cls(x): return Z.mod4_index((x[0] % 4, x[1] % 4))
dec = {}
for i, j, k in itertools.product(range(3), range(2), range(2)):
    x = Z.mul(Z.mul(Z.power((0, 1), i), Z.power((-1, 0), j)), Z.power(Z.LAM, k)); dec[cls(x)] = (i, j, k)
assert len(dec) == 12
chars = {}
for a, b, c in itertools.product(range(3), range(2), range(2)):
    chars[(a, b, c)] = np.array([np.exp(2j * np.pi * a * dec[s][0] / 3) * (-1) ** (b * dec[s][1] + c * dec[s][2]) for s in range(12)])
mult = np.array([[cls(Z.mul(REPS[s], REPS[t])) for t in range(12)] for s in range(12)])
# G(vw) = G(v) G(w) R(v,w)
d = max(abs(Gc[mult[s, t]] - Gc[s] * Gc[t] * Rm[s, t]) for s in range(12) for t in range(12))
print(f"G(vw) = G(v)G(w)R(v,w) on classes: max defect {d:.2e};  G multiplicative: {max(abs(Gc[mult[s,t]] - Gc[s]*Gc[t]) for s in range(12) for t in range(12)) < 1e-6}")
print("characters theta = (a,b,c): theta(w^i (-1)^j lam^k) = zeta3^(a i) (-1)^(b j + c k)")
print("expansion G = sum a_theta theta:")
for key, ch in chars.items():
    a = (Gc * np.conj(ch)).mean()
    if abs(a) > 1e-9: print(f"   theta {key}: a = {a:.4f}  |a| = {abs(a):.4f}")
g2 = Gc ** 2
for key, ch in chars.items():
    if np.abs(g2 - ch).max() < 1e-6: print("G^2 is the character", key)
# chi_sigma(-1), chi_sigma(4), chi_sigma(lam^3) as characters
for nm, ex in (('chi_.(-1)', X_M1), ('chi_.(4)', X_4), ('chi_.(lam^3)', X_L3)):
    v = Z6[ex]
    for key, ch in chars.items():
        if np.abs(v - ch).max() < 1e-9: print(f"{nm} = theta{key}")
A_all = Amat(w_all, w_all); A_6 = Amat(w_odd2, w_odd3)
np.set_printoptions(precision=4, suppress=True, linewidth=200)
print("\nclosed form check, all rows: A(s,t) = R(s,t) chi_t(-1) (1 + chi_s(-1)chi_t(-1)) 4^(-1/6)/(1 - z4 4^(-1/3)) z3 3^(-1/3)/(1 - z3 3^(-1/2))")
cf = np.zeros((12, 12), complex)
for s in range(12):
    for t in range(12):
        z4 = Z6[(X_4[s] - X_4[t]) % 6]; z3 = Z6[(X_L3[s] + X_L3[t]) % 6]; e = Z6[X_M1[t]]; es = Z6[X_M1[s]]
        cf[s, t] = Rm[s, t] * e * (1 + es * e) * 4 ** (-1 / 6) / (1 - z4 * 4 ** (-1 / 3)) * z3 * 3 ** (-1 / 3) / (1 - z3 * 3 ** -0.5)
print("   max |A_all - closed form| =", np.abs(A_all - cf).max())
cf6 = np.zeros((12, 12), complex)
for s in range(12):
    for t in range(12):
        z4 = Z6[(X_4[s] - X_4[t]) % 6]; z3 = Z6[(X_L3[s] + X_L3[t]) % 6]; e = Z6[X_M1[t]]; es = Z6[X_M1[s]]
        f2 = -0.25 * 4 ** (1 / 6) * np.conj(z4) + 0.75 * 4 ** (-1 / 6) / (1 - z4 * 4 ** (-1 / 3))
        f3 = z3 * 3 ** (-1 / 3)
        cf6[s, t] = Rm[s, t] * e * (1 + es * e) * f2 * f3
print("   rows prime to 6: max |A_6 - closed form| =", np.abs(A_6 - cf6).max(), "  (lambda-factor is the pure sign z3 3^(-1/3))")
print("   |A_all| values:", np.unique(np.round(np.abs(A_all), 4)), " |A_6| values:", np.unique(np.round(np.abs(A_6), 4)))
print("\nclass function tau -> G(tau) A(sigma, tau) expanded over characters (all rows), sigma = class of 1:")
s0 = cls((1, 0))
for nm, AA in (('all rows', A_all), ('rows prime to 6', A_6)):
    f = Gc * AA[s0]; nz = 0
    for key, ch in chars.items():
        b = (f * np.conj(ch)).mean()
        if abs(b) > 1e-9: nz += 1; print(f"   {nm}: theta {key}: b = {b:.4f}")
    print(f"   {nm}: {nz} nonzero characters; G^2 A: ", sum(abs((Gc ** 2 * AA[s0] * np.conj(ch)).mean()) > 1e-9 for ch in chars.values()), "nonzero")
print("K0 =", K0, " K0*max|A_all| =", K0 * np.abs(A_all).max(), " K0*max|A_6| =", K0 * np.abs(A_6).max())
