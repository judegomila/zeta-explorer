# Locate a zero of the Davenport-Heilbronn function with Re s > 1 (classical: infinitely many exist).
import mpmath as mp, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from r2lib import *
mp.mp.dps = 15
cands = []
for x in (1.03, 1.12):
    prev2 = prev1 = None; y = 2.0
    while y < 260:
        v = abs(f_dh(mp.mpc(x, y)))
        if prev2 is not None and prev1[0] < prev2[0] and prev1[0] < v and prev1[0] < 0.25:
            cands.append((prev1[0], x, prev1[1]))
        prev2, prev1 = prev1, (v, y); y += 0.1
cands.sort()
print("local minima of |f_DH|:", [(mp.nstr(v, 3), x, round(y, 1)) for v, x, y in cands[:10]])
mp.mp.dps = 30
found = []
for v, x, y in cands[:10]:
    try:
        r = mp.findroot(f_dh, mp.mpc(x, y))
        if all(abs(r - q) > 1e-6 for q in found): found.append(r)
    except Exception as e:
        pass
print("zeros found:", [mp.nstr(r, 14) for r in found])
