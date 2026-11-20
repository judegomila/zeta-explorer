import math, numpy as np
from symlib import *
for b in (0.4, 0.25, 0.1, 0.01, 0.001):
    row = []
    for twoa in np.arange(0.5, 1.61, 0.1):
        o = make_object('EA%g' % b, math.exp(twoa) + 1)
        row.append('%.1f:% .2e' % (twoa, lam_min(o, twoa / 2, 200)[0][0]))
    print('b=%g ' % b, ' '.join(row))
