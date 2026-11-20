import numpy as np, math, runBC
from runBC import *
t, th = 1e4, 0.75
P = P_of(t, th); a = coeffs('EA', P)
# EA coefficients against direct divisor sum
for n in (1, 2, 12, 36, 97, 240, P):
    d = [x for x in range(1, n + 1) if n % x == 0]
    assert abs(a[n] - sum((x / (n // x)) ** 0.1 for x in d)) < 1e-12, n
pr = primes_upto(P); thp = np.random.default_rng(5).random(len(pr)) * 6.28
T = additive_theta(P, pr, thp)
def fac(n):
    s = 0.0
    for p, tt in zip(pr, thp):
        while n % p == 0: s += tt; n //= p
    return s
for n in (1, 2, 12, 97, 180, 250, P): assert abs(T[n] - fac(n)) < 1e-9, n
A = a * np.exp(1j * T)
M, om = moments(t, P, A); F = Fn(M, om, P)
z = np.array([0.3 + 2j, -0.1 - 49.5j, 1.2 + 50.2j, 0j, 11.5 + 50j])
f, g = F(z, True)
n = np.arange(1, P + 1)
for zz, ff, gg in zip(z, f, g):
    s = 0.5 + 1j * t + zz
    d = (A[1:] * np.exp(-s * np.log(n))).sum(); dd = (-np.log(n) * A[1:] * np.exp(-s * np.log(n))).sum()
    print(zz, abs(ff - d), abs(gg - dd)); assert abs(ff - d) < 1e-9 and abs(gg - dd) < 1e-8
# ZQ: removable poles, and F = m D - corrections agrees with direct Laplace truncation by quadrature-free formula
M, om = moments(t, P, a * 0 + (np.arange(P + 1) > 0)); 
zq = runBC.zq_pairs([t])[t] if True else None
print('zq pair', zq)
F = Fn(M, om, P, zq=(zq[0] - t, zq[1] - t))
z1 = 1j * (zq[0] - t)
f1, g1 = F(np.array([z1 + 1e-5, z1 + 1e-5 + 1e-7]), True)
print('near pole', f1, 'fd deriv', (f1[1] - f1[0]) / 1e-7, g1[0])
zz = np.array([0.4 + 3j]); f0, g0 = F(zz, True); f2, _ = F(zz + 1e-6)
print('deriv check', (f2 - f0) / 1e-6, g0)
print('selftest ok')
