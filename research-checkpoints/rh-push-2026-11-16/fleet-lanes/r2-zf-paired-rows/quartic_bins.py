#!/usr/bin/env python3
"""quartic_bins.py data.npz -- mean square over rows h (primary primes, binned by norm) of class-e quartic sums.

G_e(D, bin) = mean over h in bin of |sum_n alpha(n) conj(gamma_1(n)) chi_n(h)^e V(N n/D)|^2 / sum_n V(N n/D)^2
e = 3 is the Moebius-twisted family (Poisson dual of the order-4 Moebius rows), exactly: mu gamma_1 conj(chi_n(h)).
"""
import sys, math
import numpy as np
d = np.load(sys.argv[1])
norms, gam, mus, als, exps = d['norms'], d['gam'], d['mus'], d['als'], d['exps']
hnorm = d['hnorm']; X = norms.max()
I4 = np.array([1, 1j, -1, -1j])
V = lambda x: x * np.exp(-x * x)
Ds = np.array([X / 5.0 / 2 ** k for k in range(13, -1, -1)])
W = np.array([V(norms / D) for D in Ds])                    # (D, n)
bins = [(5, 30), (30, 120), (120, 500), (500, 2001)]
base = als * np.conj(gam)
out = {b: np.zeros((4, len(Ds))) for b in bins}; cnt = {b: 0 for b in bins}
sq = {b: np.zeros((4, len(Ds))) for b in bins}
for k, Nh in enumerate(hnorm):
    b = next((b for b in bins if b[0] <= Nh < b[1]), None)
    if b is None: continue
    ok = exps[:, k] >= 0
    chi = I4[exps[ok, k].astype(np.int64)]
    Wk = W[:, ok]; den = (Wk * Wk).sum(axis=1)
    f = base[ok]
    for e in range(4):
        v = np.abs(Wk @ f) ** 2 / den
        out[b][e] += v; sq[b][e] += v * v
        f = f * chi
    cnt[b] += 1
print('X = %d, n = %d, rows h = %d (primary primes, N(h) <= %d)' % (X, len(norms), len(hnorm), hnorm.max()))
print('G_e(D, bin) with standard error; e = 3 is the Moebius-twisted family')
for b in bins:
    m = cnt[b]
    print('\nbin N(h) in [%d, %d): %d rows' % (b[0], b[1], m))
    print('     D     ' + ' '.join('%9.0f' % D for D in Ds[2:]))
    for e in range(4):
        mean = out[b][e] / m; se = np.sqrt(np.maximum(sq[b][e] / m - mean ** 2, 0) / m)
        print('   e=%d    ' % e + ' '.join('%5.2f(%2.0f)' % (x, 100 * s) for x, s in zip(mean[2:], se[2:])))
print('\n(parentheses: standard error in units of 0.01)')
