"""Lattice Lee-Yang polynomial violating GHS. Float scan over m for P_m = (w^2 - 2c w + 1)(w+1)^m, c = m/(m+2),
then an exact rational certificate (Fractions) at the smallest m found, at a rational point w0 > 1."""
import numpy as np, json
from math import comb
from fractions import Fraction as Fr
def coeffs(m):
    c = Fr(m, m + 2); B = [comb(m, k) for k in range(m + 1)]
    P = [Fr(0)] * (m + 3)
    for k, b in enumerate(B):
        P[k] += b; P[k + 1] += -2 * c * b; P[k + 2] += b
    return P
def third_float(P, h):
    k = np.arange(len(P)); Pf = np.array([float(x) for x in P])
    lw = np.outer(h, k) + np.log(np.maximum(Pf, 1e-300))[None, :]; lw -= lw.max(axis=1, keepdims=True)
    pr = np.exp(lw) * (Pf > 0)[None, :]; pr /= pr.sum(axis=1, keepdims=True)
    m1 = pr @ k; return (pr * (k[None, :] - m1[:, None]) ** 3).sum(axis=1)
h = np.linspace(0.002, 3, 3000); first = None; rows = []
for m in list(range(10, 131, 4)):
    P = coeffs(m); t = third_float(P, h); rows.append((m, float(t.max()), float(h[t.argmax()])))
    if first is None and t.max() > 1e-6: first = m
for r in rows: print("m=%d  max third cumulant %.5e at h=%.4f" % r)
# refine smallest m
lo = None
for m in range(2, 131):
    if third_float(coeffs(m), h).max() > 1e-9: lo = m; break
print("smallest m with a positive third cumulant on the scan:", lo)
m = lo; P = coeffs(m); t = third_float(P, h); h0 = h[t.argmax()]
w0 = Fr(np.exp(h0)).limit_denominator(64)
assert all(x >= 0 for x in P), "nonnegative coefficients"
assert P == P[::-1]
Z = sum(p * w0 ** k for k, p in enumerate(P)); m1 = sum(k * p * w0 ** k for k, p in enumerate(P)) / Z
k3 = sum((k - m1) ** 3 * p * w0 ** k for k, p in enumerate(P)) / Z
print("exact certificate: m =", m, "degree", m + 2, "c =", Fr(m, m + 2), "min coefficient =", min(P), " w0 =", w0, " third cumulant (exact rational) > 0:", k3 > 0, float(k3))
# a round member with margin
m2 = 100; P2 = coeffs(m2); t2 = third_float(P2, h); w2 = Fr(np.exp(h[t2.argmax()])).limit_denominator(32)
Z = sum(p * w2 ** k for k, p in enumerate(P2)); m1 = sum(k * p * w2 ** k for k, p in enumerate(P2)) / Z
k32 = sum((k - m1) ** 3 * p * w2 ** k for k, p in enumerate(P2)) / Z
print("m = 100: c = 50/51, all coefficients >= 0:", all(x >= 0 for x in P2), " w0 =", w2, " third cumulant exact > 0:", k32 > 0, float(k32))
json.dump(dict(scan=rows, smallest_m=lo, w0=str(w0), k3=float(k3), k3_positive_exact=bool(k3 > 0), m100_w0=str(w2), m100_k3=float(k32), m100_positive_exact=bool(k32 > 0)), open("ghs_lattice.json", "w"), indent=1)
