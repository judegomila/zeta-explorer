"""DH with its composite-index (non-prime-power) coefficients removed, against the full DH form (float64 frame, Omega = 240, os = 2)."""
import math, numpy as np
from symlib import *
def is_pp(n):
    for p in range(2, int(n ** 0.5) + 1):
        if n % p == 0:
            while n % p == 0: n //= p
            return n == 1
    return True
for twoa in (1.7, 1.8, 1.85, 1.9, 2.0, 2.5, 3.0, 3.4, 3.5, 3.6, 4.0):
    o = make_object('DH', math.exp(twoa) + 1)
    keep = np.array([is_pp(int(n)) for n in o['ns']])
    opp = dict(o, ns=o['ns'][keep], cn=o['cn'][keep])
    print('2a = %.2f  DH full % .4e   DH prime powers only % .4e' % (twoa, lam_min(o, twoa / 2, 240)[0][0], lam_min(opp, twoa / 2, 240)[0][0]))
