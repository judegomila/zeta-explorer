"""Validation of symlib against the Legendre-Galerkin ball values of lane s4 (N = 200) and the DH coefficients of route 30."""
import sys, math, numpy as np
from symlib import *
ref = [  # (object, 2a, pf, s4 value)
 ('DH', 1.0, False, 2.99e-1), ('DH', math.log(3), False, 0.20871), ('CHI5', 1.0, False, 9.01e-2), ('CHI5', 2.0, False, 2.01e-6),
 ('TNR:2:2.2', 1.0, False, -1.05e-1), ('TNR:2:2.2', 2.0, False, -5.33e-1), ('TNR:3:1.0', 2.3, False, 1.31e-1),
 ('LIOU', 1.2, True, -1.78e-1), ('LIOU', 2.0, True, -1.33), ('ZETA', 1.0, True, 1.19e-2), ('ZETA', 1.2, True, 6.61e-5),
 ('ZETA', 1.0, False, 9.34e-7), ('CHI-3', 1.5, False, 4.08e-5), ('DH', 2.0, False, 3.43e-5), ('DH', 2.6, False, 2.33e-11)]
c = dirichlet_log_deriv(periodic([0, 1, kappa_dh(), -kappa_dh(), -1], 10), 10)
print('DH c(2), c(3), c(4), c(6), c(7):', c[2].real, c[3].real, c[4].real, c[6].real, c[7].real)
for Om, os_ in ((60, 2.0), (120, 2.0), (240, 2.0), (240, 1.0)):
    print('Omega', Om, 'os', os_)
    for nm, twoa, pf, val in ref:
        o = make_object(nm, math.exp(twoa) + 1)
        w, n, rank = lam_min(o, twoa / 2, Om, os_, pf=pf)
        print('  %-10s 2a=%.4f %s  n=%4d rank=%4d  lam=% .6e   s4: % .3e' % (nm, twoa, 'pf  ' if pf else 'full', n, rank, w[0], val))
