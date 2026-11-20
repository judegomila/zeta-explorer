"""Combination 2, fixed weights: w_n proportional to the object's own coefficients a_F(n), n <= N (one-dimensional family, sign free).
Statistic: fraction of near-collision constraints with the majority sign, and the height of the first constraint with the other sign."""
import sys, json, math, numpy as np
import lib, c2_margin
from lib import log
res = []
def coeff(obj, N):
    n = np.arange(1, N + 1)
    if obj == 'zeta': return np.ones(N)
    if obj == 'dh': return np.array([0.0, 1.0, lib.KAPPA, -lib.KAPPA, -1.0])[n % 5]
    if obj.startswith('tnr'):
        q = int(obj[3:]); return 1.0 + 2.2 * math.sqrt(q) * (n % q == 0) + q * (n % (q * q) == 0)
for obj in sys.argv[2:]:
    for N in (8, 32, 128, 1024):
        S, g, cond = c2_margin.build(obj, N, 'cos')
        v = S.dots(coeff(obj, N)); sg = np.sign(np.sum(np.sign(v))); bad = np.nonzero(sg * v < 0)[0]
        afe = 2 * math.pi * N * N / cond * (int(obj[3:]) ** 2 if obj.startswith('tnr') else 1)
        inside = S.x < afe
        r = dict(obj=obj, N=N, K=S.K, frac_majority=float((sg * v > 0).mean()), first_other_x=float(S.x[bad[0]]) if len(bad) else None, first_other_K=int(bad[0]) + 1 if len(bad) else None,
                 afe_height=afe, frac_majority_below_afe_height=float((sg * v > 0)[inside].mean()) if inside.any() else None)
        res.append(r); log(r)
json.dump(res, open(sys.argv[1], 'w'))
