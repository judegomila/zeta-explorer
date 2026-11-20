"""Validation of the triangle functional against the stored certified minima of the source ladder (CANDIDATE_PARAMETERS.md)."""
import sys, time, math
from lib import *
REF = [(690988, (2, 3, 5, 7, 11), 0.000000791366), (729000, (2, 3, 5, 7), 0.000315112459), (819000, (2, 3, 5), 0.000305788807), (1028000, (2, 3), 0.000309285478)]
small = len(sys.argv) > 1 and sys.argv[1] == 'small'
t = T0; y = Y0
for N, P, ref in REF:
    if small and N > 700000: continue
    t0 = time.time()
    lam, D = euler_moll('ZETA', P, t)
    announce('arrays over j <= N: about 12 float64[%d]' % N, 12 * 8 * N)
    tr = Tri(coefs('ZETA', N), D, N)
    T, pr = tr.value(N, t, y, lam, parts=True)
    print('N %d P%s  T = %.12e  stored floor %.12e  diff %.3e  E = %.6e  (sigma %.9f g %.6e M %.6f corr %.3e)  %.1fs' % (N, P, T, ref, T - ref, err_budget(N, t, y), pr['sigma'], pr['g'], pr['M'], pr['corr'], time.time() - t0), flush=True)
    if N == 690988:
        # twist invariance: random signs / unimodular with own mollifier
        for nm in ('SGN', 'U', 'LIOU', 'LCHI5'):
            lam2, D2 = euler_moll(nm, P, t); tr2 = Tri(coefs(nm, N), D2, N)
            print('   %s own Euler mollifier: T = %.12e' % (nm, tr2.value(N, t, y, lam2)), flush=True)
        # gradient check of the smoothed objective
        import numpy as np
        J, dJ, _ = tr.value(N, t, y, lam, grad=True, eps=1e-6); h = 1e-6
        for d in (2, 15, 2310):
            l2 = dict(lam); l2[d] += h; J2 = tr.value(N, t, y, l2, grad=True, eps=1e-6)[0]
            print('   grad check d=%d: analytic %.8e numeric %.8e' % (d, dJ[d].real, (J2 - J) / h))
