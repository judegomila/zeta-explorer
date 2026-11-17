#!/usr/bin/env python3
"""analyse4.py -- summary statistics from ms4_200000.npz: class-3 / Moebius ratios to the random baseline, and the
excess of the class-1 (polar) family against the law  excess ~ c Z^(1/2) N(m)^(-1/4)  (theta pole, DdFH Thm 1.2)."""
import sys, numpy as np
d = np.load(sys.argv[1]); B = d['B']; rn = d['rnorm']; Zs = d['Zs']; den = d['den']; names = list(d['names'])
P = np.abs(B) ** 2 / den[None, :, None]
ix = {n: i for i, n in enumerate(names)}
print('rows with N(m) in (Z/2, Z] (balanced point) and (Z^(5/6)/2, Z^(5/6)]: mean R +- s.e.')
for zi, Z in enumerate(Zs):
    for lab, hi in (('q=1  ', Z), ('q=5/6', Z ** (5 / 6)), ('q=1/2', Z ** 0.5 * 4)):
        sel = (rn > hi / 2) & (rn <= hi); n = sel.sum()
        print('  Z=%7.0f %s rows=%6d  ' % (Z, lab, n) + '  '.join('%s %.3f+-%.3f' % (nm, P[ix[nm], zi, sel].mean(), P[ix[nm], zi, sel].std() / np.sqrt(n)) for nm in ('T', 'K3', 'K3t', 'MU', 'RND', 'K1', 'K1t')))
print('\nclass-1 polar excess E = R(K1t) - R(RND) on dyadic bins, and E / (Z^(1/2) N^(-1/4)) with N the bin mean:')
edges = 2.0 ** np.arange(9, 18)
for zi, Z in enumerate(Zs):
    out = []
    for lo, hi in zip(edges[:-1], edges[1:]):
        sel = (rn > lo) & (rn <= hi)
        E = P[ix['K1t'], zi, sel].mean() - P[ix['RND'], zi, sel].mean()
        out.append('%.3f' % (E / (Z ** .5 * rn[sel].mean() ** -.25)))
    print('  Z=%7.0f  ' % Z + ' '.join(out))
print('\nexponent of the balanced excess: fit of log E(Z, bin (Z/2, Z]) against log Z over the three Z:')
E = []
for zi, Z in enumerate(Zs):
    sel = (rn > Z / 2) & (rn <= Z); E.append(P[ix['K1t'], zi, sel].mean() - P[ix['RND'], zi, sel].mean())
print('  E =', ['%.3f' % e for e in E], ' slope = %.3f (DdFH: 1/4)' % np.polyfit(np.log(Zs), np.log(E), 1)[0])
print('\nmaximum over all 14 dyadic bins with >= 500 rows and all three Z of R(variant)/R(RND):')
for nm in ('T', 'K3', 'K3t', 'MU'):
    mx = 0; mn = 9
    e2 = 2.0 ** np.arange(10, 19)
    for zi in range(3):
        for lo, hi in zip(e2[:-1], e2[1:]):
            sel = (rn > lo) & (rn <= hi)
            if sel.sum() < 500: continue
            r = P[ix[nm], zi, sel].mean() / P[ix['RND'], zi, sel].mean(); mx = max(mx, r); mn = min(mn, r)
    print('  %-4s min %.3f max %.3f' % (nm, mn, mx))
