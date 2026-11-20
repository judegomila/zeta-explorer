"""Combination 1: where the Euler product enters A5.  The step A4 -> A5 replaces Re f'/f(sigma + i gamma) by the majorant
-sum |Lambda_F(n)| n^-sigma.  Table of sum_{n <= N} |Lambda_F(n)| n^-sigma against |zeta'/zeta(sigma)| for the controls."""
import math, json, numpy as np, mpmath as mp
N = 2000000
kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
a = np.zeros(N + 1); per = [0, 1, kap, -kap, -1]
for r in range(1, 5): a[r::5] = per[r]
b = np.zeros(N + 1); b[1] = 1.0
for d in range(1, N // 2 + 1):
    if b[d] != 0: b[2 * d::d] -= b[d] * a[2:N // d + 1]
al = a * np.log(np.maximum(np.arange(N + 1), 1)); L = np.zeros(N + 1)
for d in range(1, N + 1):
    if b[d] != 0: L[d::d] += b[d] * al[1:N // d + 1]
n = np.arange(N + 1, dtype=float); n[0] = 1
print('Lambda_DH(n), n = 2..12:', np.round(L[2:13], 4)); print('planned memory %.2f GB' % (4 * 8 * N / 1e9))
chk = -(L[1:] * n[1:] ** -3.0).sum()
mp.mp.dps = 20
f = lambda s: 5 ** (-s) * (mp.zeta(s, mp.mpf(1) / 5) + kap * mp.zeta(s, mp.mpf(2) / 5) - kap * mp.zeta(s, mp.mpf(3) / 5) - mp.zeta(s, mp.mpf(4) / 5))
print('check: sum Lambda_DH(n) n^-3 = %.12f ; -f\'/f(3) = %.12f' % (-chk, float(-mp.diff(f, 3) / f(3))))
th = math.acosh(1.1); out = {}
print(' sigma  |zeta\'/zeta|   DH: N=2e4      N=2e5      N=2e6     TNR        EA a=1/4   sign twist, L(chi)')
for sig in (1.05, 1.2, 1.5, 2.0, 3.0):
    z = float(-mp.zeta(sig, derivative=1) / mp.zeta(sig))
    dh = [float((np.abs(L[1:M + 1]) * n[1:M + 1] ** -sig).sum()) for M in (20000, 200000, 2000000)]
    tn = z + sum(math.log(3) * (abs(1 - (-1) ** m * 3 ** (m / 2) * 2 * math.cosh(m * th)) - 1) * 3 ** (-m * sig) for m in range(1, 200))
    ea = float(-mp.zeta(sig - 0.25, derivative=1) / mp.zeta(sig - 0.25) - mp.zeta(sig + 0.25, derivative=1) / mp.zeta(sig + 0.25)) if sig > 1.25 else float('inf')
    out[sig] = {'zeta': z, 'DH': dh, 'TNR': tn, 'EA': ea}
    print(' %.2f  %9.4f   %9.4f  %9.4f  %9.4f  %9.4f  %9.4f   <= %.4f' % (sig, z, dh[0], dh[1], dh[2], tn, ea, z))
# size of Lambda_DH: max |Lambda_DH(n)|/log n in dyadic ranges (growth = abscissa of the zeros to the right)
for lo in (10, 100, 1000, 10000, 100000, 1000000):
    seg = np.abs(L[lo:2 * lo]) ; i = int(seg.argmax())
    print('   max |Lambda_DH(n)| for n in [%d, %d): %.3f at n = %d (log n = %.2f)' % (lo, 2 * lo, seg[i], lo + i, math.log(lo + i)))
json.dump(out, open('out/maj.json', 'w'))
