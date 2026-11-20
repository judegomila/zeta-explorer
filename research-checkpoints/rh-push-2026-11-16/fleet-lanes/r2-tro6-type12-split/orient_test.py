#!/usr/bin/env python3
"""orient_test.py -- MEASURED test of the orientation and shape of the dual formula (3.1), hypothesis (V).

Pt(c) = P_c chi_c(-e0), P_c = sum_m w(N(m)/Q) rho_nat_sigma(c)(-e0 m) conj gt(m, c), smooth weight w = sin^4(pi x).
The polar part of Pt(c) is real and positive, and the estimator self-term (N(c) > 1000) is real, so Im Pt(c) is a clean
sample of the non-polar remainder R(c) (one real component), up to estimator noise.

Prediction of (V) (Ramanujan orientation; dual sum over delta | c of mu(c/delta) N(delta) sum_{m'} rho*(delta m')):
  delta = 1 is a smooth sum over all coefficients of an automorphic form (no oscillation): negligible;
  delta > 1 contributes only if N(delta) (N(c)/N(delta))^2 >~ Q (dual length N(c)^2/(Q N(delta)) >~ 1).
  => threshold statistic  T(c) := max_{delta | c, delta > 1} N(c)^2 / (Q N(delta)) = N(c)^2 / (Q pmin(c)).
     PRIME c: T = N(c)/Q, remainder absent until N(c) ~ Q.   c = p1 p2: T = pmax^2 pmin / Q.
Opposite orientation (dual sum twisted by chi_c^2): remainder of full random size as soon as N(c) >> Q^(1/2), for every c.
Random level of one real component: var = ||rho w||^2 (pairing m, -m);  noise-only level: se-share * ||rho w||^2.
usage: orient_test.py
"""
import sys, math, numpy as np
SX = 'tmp/sextic'
ND = 'tmp/research-2026-11-16/push/tro6-numerics'
sys.path.insert(0, SX)
import alib as A, zomega as Z
d = np.load(ND + '/rows_full.npz'); cd = np.load(ND + '/data/conductors.npz'); E = np.load(ND + '/E.npy', mmap_mode='r')
Nm = d['Nm']; rho = d['rho_str'] + d['rho_cor']; se = d['se']; six = d['six']
cN = cd['cN']; cna = cd['cna']; cnb = cd['cnb']; C = len(cN)
T = A.SFTable(SX + '/data/sf_1e7.npz')
sm = np.flatnonzero(T.N <= 100000)
lut = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(T.na[sm], T.nb[sm]))}
node = sm[[lut[(int(a), int(b))] for a, b in zip(cna, cnb)]]
g1 = T.g1[node]; m4 = T.m4[node].astype(int); mu = T.mu[node].astype(int)
ne0 = Z.mul((2, 0), Z.power(Z.LAM, 5)); ee0 = T.node_exponents(ne0)[node]
Z6 = np.exp(1j * np.pi * np.arange(6) / 3); LUT = np.concatenate([Z6, [0]])
pred = g1 * np.conj(Z6[ee0]); gen = ~six
def isprime(n):
    if n < 2: return False
    i = 2
    while i * i <= n:
        if n % i == 0: return False
        i += 1
    return True
def prime_ideal_norm(n):                     # norm of a prime of O prime to 6: p = 1 mod 3 prime, or q^2 with q = 2 mod 3 prime
    if isprime(n) and n % 3 == 1: return True
    r = math.isqrt(n)
    return r * r == n and isprime(r) and r % 3 == 2
pn = sorted({int(x) for x in cN if prime_ideal_norm(int(x))})
def pmin_norm(n):                            # smallest prime-ideal norm dividing the squarefree ideal norm n (norms multiply)
    for q in pn:
        if q > n: break
        if n % q == 0:
            # q = p (split) divides n, or q = r^2 (inert).  For split p both conjugates have norm p; either way the norm of a prime factor is q.
            return q
    return n
omega = np.zeros(C, int); pmin = np.zeros(C)
for i in range(C):
    n = int(cN[i]); k = 0; first = None
    if n == 1: pmin[i] = 1; continue
    for q in pn:
        if q > n: break
        while n % q == 0:
            n //= q; k += 1; first = first or q
    omega[i] = k; pmin[i] = first
assert ((-1) ** omega[cN > 1] == mu[cN > 1]).all(), "factor count inconsistent with mu"
Q = float(Nm.max())
w = np.sin(np.pi * Nm / (Q + 1.0)) ** 4
acc = np.zeros((12, C), complex); accn = np.zeros(12); noise = np.zeros(12)
for a in range(0, len(Nm), 400):
    b = min(a + 400, len(Nm)); mk = gen[a:b]
    Eb = np.asarray(E[a:b])[mk]
    X = (rho[a:b][mk] * w[a:b][mk, None]).astype(np.complex64)
    acc += X.T @ LUT[Eb].astype(np.complex64); accn += (np.abs(X) ** 2).sum(0)
    sev = se[a:b][mk] if se.ndim == 2 else np.repeat(se[a:b][mk][:, None], 12, 1)
    noise += ((sev * w[a:b][mk, None]) ** 2).sum(0)
S = acc[m4, np.arange(C)]; Pt = S * np.conj(pred); nr2 = accn[m4]
y = Pt.imag ** 2 / nr2                        # one real component, in units of ||rho w||^2: random level 1, noise level = share
share = float((noise / accn).mean())
Tst = cN.astype(float) ** 2 / (Q * np.maximum(pmin, 1))
print(f"Q = {Q:.0f}, Q^(1/2) = {math.sqrt(Q):.1f}, generic rows {int(gen.sum())}; conductors {C}; estimator-noise share {share:.3f}")
print(f"units: mean of (Im Pt)^2/||rho w||^2;  random level 1.00;  noise-only level {share:.2f}")
print("\n(a) PRIME moduli, by N(c)/Q:")
for lo, hi in ((0, 0.005), (0.005, 0.0177), (0.0177, 0.05), (0.05, 0.15), (0.15, 0.4), (0.4, 1), (1, 2.5), (2.5, 6), (6, 15), (15, 32)):
    s = (omega == 1) & (cN / Q > lo) & (cN / Q <= hi)
    if s.sum(): print(f"   {lo:7.4f} < N(c)/Q <= {hi:7.4f}  (N(c) in ({lo*Q:7.0f},{hi*Q:7.0f}]): n = {int(s.sum()):5d}   mean = {y[s].mean():.3f} +- {y[s].std()/math.sqrt(s.sum()):.3f}")
print("\n(b) all moduli with N(c) > 3 Q^(1/2), by threshold statistic T = N(c)^2/(Q pmin):   [and by number of prime factors]")
for lo, hi in ((0, 0.03), (0.03, 0.1), (0.1, 0.3), (0.3, 1), (1, 3), (3, 10), (10, 100), (100, 1e9)):
    s = (cN > 3 * math.sqrt(Q)) & (Tst > lo) & (Tst <= hi)
    if not s.sum(): continue
    parts = []
    for k in (1, 2, 3):
        sk = s & (omega == k)
        parts.append(f"k={k}: n={int(sk.sum()):5d} mean={y[sk].mean():.3f}" if sk.sum() else f"k={k}: n=    0           ")
    print(f"   {lo:6.2f} < T <= {hi:8.2f}: n = {int(s.sum()):5d}  mean = {y[s].mean():.3f} +- {y[s].std()/math.sqrt(s.sum()):.3f}   | " + " | ".join(parts))
print("\n(c) fixed N(c) band (Q, 3Q], two prime factors, by pmin (T = N(c)^2/(Q pmin) decreases with pmin):")
s0 = (omega == 2) & (cN > Q) & (cN <= 3 * Q)
for lo, hi in ((6, 8), (8, 20), (20, 45), (45, 100)):
    s = s0 & (pmin > lo) & (pmin <= hi)
    if s.sum(): print(f"   pmin in ({lo},{hi}]: n = {int(s.sum()):5d}, median T = {np.median(Tst[s]):7.2f}, mean = {y[s].mean():.3f} +- {y[s].std()/math.sqrt(s.sum()):.3f}")
print("\n(d) opposite-orientation control: all moduli by N(c)/Q^(1/2) regardless of factorisation:")
for lo, hi in ((0, 1), (1, 3), (3, 10), (10, 30), (30, 100), (100, 300), (300, 2000)):
    s = (cN > 1) & (cN / math.sqrt(Q) > lo) & (cN / math.sqrt(Q) <= hi)
    if s.sum(): print(f"   {lo:5.0f} < N(c)/Q^(1/2) <= {hi:5.0f}: n = {int(s.sum()):5d}  mean = {y[s].mean():.3f} +- {y[s].std()/math.sqrt(s.sum()):.3f}")
