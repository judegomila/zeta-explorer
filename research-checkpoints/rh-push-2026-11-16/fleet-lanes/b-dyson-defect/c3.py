import mpmath as mp, numpy as np, math
mp.mp.dps = 30
# -zeta'/zeta(1+s) = 1/s - g0 + a1 s + a2 s^2 + ...
g0 = mp.euler; g1 = mp.stieltjes(1); g2 = mp.stieltjes(2); g3 = mp.stieltjes(3)
# s zeta(1+s) = 1 + g0 s - g1 s^2 + g2 s^3/2 - g3 s^4/6 ; log = l1 s + l2 s^2 + l3 s^3 ; -zeta'/zeta(1+s) = 1/s - l1 - 2 l2 s - 3 l3 s^2
c = [mp.mpf(1), g0, -g1, g2 / 2, -g3 / 6]
l1 = c[1]; l2 = c[2] - l1 * c[1] / 2; l3 = c[3] - (l1 * c[2] + 2 * l2 * c[1]) / 3
a1 = -2 * l2; a2 = -3 * l3
print('a1 vs g0^2+2g1', a1, g0 ** 2 + 2 * g1, ' a2', a2)
X = 10 ** 8
sieve = np.ones(X + 1, dtype=bool); sieve[:2] = False
for i in range(2, int(X ** 0.5) + 1):
    if sieve[i]: sieve[i * i::i] = False
p = np.nonzero(sieve)[0].astype(np.float64); lp = np.log(p)
lx = math.log(X)
S2 = float(np.sum(lp ** 2 / (p - 1) ** 2)) + (lx + 1) / X
S3 = float(np.sum(lp ** 3 * 2 * p / (p - 1) ** 3)) + 2 * (lx * lx + 2 * lx + 2) / X
LamB = float(a1) + S2
c3 = 2 * float(a2) - S3
print('sum log^2p/(p-1)^2 =', S2, ' Lambda_B =', LamB)
print('sum 2p log^3p/(p-1)^3 =', S3, ' a2 =', float(a2), ' c3 =', c3)
V = 0.17999
print('A = (1+V)(2pi)^2(-c3) =', (1 + V) * 4 * math.pi ** 2 * (-c3))
# direct check of c3 by partial sums
for Xc in [1e4, 1e6, 1e8]:
    m = p <= Xc; tot = 0.0
    for k in range(1, 40):
        mk = m & (p ** k <= Xc)
        if not mk.any(): break
        tot += np.sum(k * lp[mk] ** 3 / p[mk] ** k)
    print('X=%g  sum Lambda^2 log n/n - log^3X/3 = %.5f' % (Xc, tot - math.log(Xc) ** 3 / 3))
