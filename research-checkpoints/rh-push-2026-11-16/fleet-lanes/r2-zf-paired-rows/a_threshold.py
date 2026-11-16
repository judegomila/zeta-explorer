#!/usr/bin/env python3
"""a_threshold.py -- MODEL: abscissa of the two campaign models as a function of a real dual exponent a (2 <= a <= e).
Uses ../zf-higher-rows/models.py unchanged (Framework A model A-V; Framework B model runB)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'zf-higher-rows'))
from fractions import Fraction as F
import models
BXS = float(models.BXS)
print('B_XS =', BXS)
print('\nFramework B model (runB): sigma0(r, a)')
grid = [2, 2.05, 2.1, 2.15, 2.2, 2.25, 2.3, 2.4, 2.5, 2.75, 3, 3.5, 4]
print('   a      ' + ' '.join('%7.3f' % a for a in grid))
thr = {}
for r in (3, 4, 5, 6):
    vals = []
    for a in grid:
        res = models.runB(a, r)
        vals.append(None if res is None else res[0])
    print('   r=%d    ' % r + ' '.join('   -   ' if v is None else '%7.4f' % v for v in vals))
    # bisection for sigma0 = B_XS
    lo, hi = 2.0, 4.0
    f = lambda a: (models.runB(a, r) or (9,))[0] - BXS
    if f(lo) < 0 < f(hi):
        for _ in range(22):
            mid = (lo + hi) / 2
            if f(mid) < 0: lo = mid
            else: hi = mid
        thr[r] = lo
print('   threshold a*(r) with sigma0 = B_XS:', {r: round(v, 4) for r, v in thr.items()})
print('\nFramework A model A-V, c = 1/2: theta_A(r, a) (min over lambda)')
ag = [F(2), F(9, 4), F(5, 2), F(3), F(4), F(6)]
print('   a      ' + ' '.join('%8s' % a for a in ag))
for r in (3, 4, 5, 6):
    print('   r=%d    ' % r + ' '.join('%8.5f' % float(models.best_A(r, a, F(1, 2))[0]) for a in ag))
print('   Framework A floor 1 - 1/(2r):', {r: float(1 - F(1, 2 * r)) for r in (3, 4, 5, 6)})
