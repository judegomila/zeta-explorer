# f_DH(s) > 0 for real s in [1/2, 2] by ball sweep (deflated Hurwitz series, ball argument);
# for s >= 2: |f(s) - 1| <= zeta(s) - 1 <= zeta(2) - 1 < 1.
import json, os
from flint import arb, arb_series, ctx
ctx.prec = 128; ctx.cap = 1
s5 = arb(5).sqrt(); k0 = ((10 - 2*s5).sqrt() - 2)/(s5 - 1); A = [arb(1), k0, -k0, arb(-1)]
def f(s):
    S = arb_series([s]); tot = arb(0)
    for r in range(1, 5): tot += S.zeta(arb(r)/5, True)[0]*A[r-1]
    return tot*arb(5)**(-s)
from fractions import Fraction as Fr
stack = [(Fr(1, 2) + Fr(3, 2)*i/300, Fr(1, 2) + Fr(3, 2)*(i + 1)/300) for i in range(300)]
n = 0; mn = None; bad = []; minw = 1.0
while stack:
    lo_, hi_ = stack.pop()
    m = (lo_ + hi_)/2; r = (hi_ - lo_)/2
    v = f(arb(arb(m.numerator)/m.denominator, float(r)*1.000001))
    if v > 0:
        n += 1; lo = float(v.lower()); mn = lo if mn is None else min(mn, lo); minw = min(minw, float(hi_ - lo_))
    elif hi_ - lo_ < Fr(1, 10**12): bad.append((float(lo_), float(hi_)))
    else: stack += [(lo_, m), (m, hi_)]
bad = len(bad) and bad
res = {'range': [0.5, 2], 'intervals': n, 'not_positive': bad, 'min_width': minw, 'min_lower_bound': mn, 'f(1/2)': f(arb(1)/2).str(15),
       'zeta(2)-1': (arb(2).zeta() - 1).str(10)}
json.dump(res, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'part3_fpos.json'), 'w'), indent=1); print(res)
