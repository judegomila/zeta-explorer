"""Direct evaluation of F_b(x) = sum_{k<=x} mu(k) r_b(x/k) from the definition of T_b, against the closed form
   psi_b(x) - a x (m(x) log x - beta(x)) - c x m(x).  Also the control identities (E_a, Liouville, DH)."""
import math, numpy as np
from math import lgamma, log, floor, sqrt
N = 200000
print(f"planned memory: arrays of length {N}: < 0.01 GB")
mu = np.ones(N+1, np.int64); mu[0] = 0; pr = np.ones(N+1, bool)
lam = np.zeros(N+1)
for p in range(2, N+1):
    if pr[p]:
        pr[2*p::p] = False; mu[p::p] *= -1; mu[p*p::p*p] = 0
        q = p
        while q <= N: lam[q] = log(p); q *= p
ks = np.arange(1, N+1)
psiL = np.concatenate([[0], np.cumsum(lam[1:])])
def T1(Y): return floor(Y)                                   # b = delta_1
def T2(Y):                                                   # b = sum_j delta_{2^j}
    s = 0; q = 1
    while q <= Y: s += floor(Y/q); q *= 2
    return s
def T3(Y): n = floor(Y); return n*log(Y) - lgamma(n+1)       # b = dt/t
def T4(Y): n = floor(Y); return lgamma(n+1)                  # b = Lambda : T = log floor(Y)!
cases = [('b1 delta_1', T1, 0, 1, lambda x: 1.0),
         ('b2 powers of 2', T2, 0, 2, lambda x: floor(math.log2(x))+1),
         ('b3 dt/t', T3, 0, 1, lambda x: log(x)),
         ('Lambda (density 1)', T4, 1, -1, lambda x: psiL[floor(x)])]
for x in (1000.0, 54321.5, 199999.0, 123456.789):
    K = floor(x); k = ks[:K]; m = float((mu[1:K+1]/k).sum()); beta = float((mu[1:K+1]*np.log(k)/k).sum())
    for nm, T, a, c, psi in cases:
        F = 0.0
        for kk in range(1, K+1):
            if mu[kk]:
                Y = x/kk; F += mu[kk]*(T(Y) - (a*Y*log(Y) if a else 0.0) - c*Y)
        cf = psi(x) - a*x*(m*log(x) - beta) - c*x*m
        print(f"x={x:<11} {nm:20s} direct {F:+.8f}  closed form {cf:+.8f}  diff {F-cf:+.1e}   psi_b={psi(x):.4f}")
# sup |r_b| / (1+log Y)
for nm, T, a, c, psi in cases[:3]:
    Ys = np.concatenate([np.arange(1, 20001)+1e-9, np.arange(2, 20001)-1e-9, np.random.default_rng(1).uniform(1, 2e5, 20000)])
    print(nm, " sup |r_b(Y)|/(1+log Y) on samples:", max(abs(T(Y)-c*Y)/(1+log(Y)) for Y in Ys))
# ---- controls: Dirichlet inverse a^{-1} by convolution, and sum_k a^{-1}(k) A(x/k) = 1
def dinv(a):
    inv = np.zeros(N+1); inv[1] = 1.0
    for d in range(1, N//2+1):
        if inv[d] != 0.0:
            J = N//d
            inv[2*d:J*d+1:d] -= a[2:J+1]*inv[d]
    return inv
xi = (sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1)
aDH = np.zeros(N+1); n = np.arange(N+1)
for r, v in ((1, 1), (2, xi), (3, -xi), (4, -1)): aDH[n % 5 == r] = v
aL = np.zeros(N+1)  # Liouville
om = np.zeros(N+1, np.int64)
for p in range(2, N+1):
    if pr[p]:
        q = p
        while q <= N: om[q::q] += 1; q *= p
aL = (-1.0)**om; aL[0] = 0
A = 0.2
sig = np.zeros(N+1)
for d in range(1, N+1): sig[d::d] += d**(2*A)
aE = sig.copy(); aE[1:] *= ks**(-A)
for nm, a in (('DH', aDH), ('Liouville', aL), ('E_a a=0.2', aE)):
    inv = dinv(a); Ac = np.cumsum(a)
    for x in (1000, 54321, 200000):
        k = ks[:x]; s = float((inv[1:x+1]*Ac[x//k]).sum())
        l1 = float(np.abs(inv[1:x+1]).sum())
        print(f"{nm:10s} x={x:<7d} sum_k a^-1(k) A(x/k) = {s:+.10f}   sum|a^-1| = {l1:.4e}  exponent vs x: {log(l1)/log(x):.3f}   A(x) = {Ac[x]:+.4f}")
    if nm == 'Liouville': print("   Liouville: max |a^-1 - mu^2| =", float(np.abs(inv[1:]-np.abs(mu[1:])).max()))
    if nm == 'DH':
        print("   DH: sup_{Y<=N} |A(Y)| =", float(np.abs(Ac).max()), " (target 0, r = T, F_b = psi_b identically)")
        neg = [(i, round(inv[i], 4)) for i in range(2, 13)]
        print("   DH a^-1(2..12):", neg)
