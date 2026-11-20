"""on-line zeros of L(s, chi_-4) below T by sign changes of the Hardy Z function (python-flint), refined by bisection. MEASURED."""
import sys, json
from flint import arb, acb, ctx, dirichlet_char
ctx.prec = 80
T = float(sys.argv[1]); h = float(sys.argv[2]) if len(sys.argv) > 2 else 0.02
chi = dirichlet_char(4, 3)
def Z(t): return float(chi.hardy_z(acb(t)).real.mid())
zs = []; t = 0.5; prev = Z(t)
while t < T:
    t2 = t + h; cur = Z(t2)
    if (prev > 0) != (cur > 0):
        lo, hi, fl = t, t2, prev
        for _ in range(60):
            m = (lo + hi) / 2; fm = Z(m)
            if (fm > 0) == (fl > 0): lo, fl = m, fm
            else: hi = m
        zs.append((lo + hi) / 2)
    t, prev = t2, cur
# count check: N(T) = (T/pi) log(4T/(2 pi e)) + O(1)
import math
print(len(zs), 'zeros; main term', T / math.pi * math.log(4 * T / (2 * math.pi * math.e)), 'first', zs[:3])
json.dump([repr(x) for x in zs], open(sys.argv[3] if len(sys.argv) > 3 else 'zeros_LCHI4.json', 'w'))
