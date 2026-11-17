import numpy as np, mpmath as mp, json
from lib import *
z = json.load(open('../../pick/zeros_20000.json'))['enclosures']; g = np.array([float(e[0]) for e in z])
for t0, L, m in [(1000.0, 6.0, 2), (1000.0, 9.0, 2), (15000.0, 9.0, 3), (15000.0, 12.0, 2)]:
    taus = np.linspace(-3, 3, 13)
    bp = b_primes(taus, L, m, mp.mpf(t0)); bz = b_zeros(taus, L, m, g - t0)
    print(t0, L, m, 'max|prime - zero| =', np.abs(bp-bz).max(), ' typical b =', bz[:3])
