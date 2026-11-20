"""ball-arithmetic bracket of the first sign change of Re(completed F'/F) on a line, near a float64 grid onset."""
import sys, json
from flint import acb, arb, acb_series, ctx
import recheck_lib as R
ctx.prec = 128
cases = [('DH', '0.51', 85.42), ('DH', '0.55', 85.42), ('DH', '0.7', 85.49), ('EA18', '0.51', 14.02), ('EA18', '0.55', 14.03),
         ('EA14', '0.51', 13.89), ('EA14', '0.7', 13.99), ('TNR', '0.51', 8.2), ('TNR', '0.7', 8.25), ('TNR', '0.7', 2.6)]
out = []
for o, sg, t0 in cases:
    last_pos = None; first_neg = None
    k = -30 if o != 'TNR' or t0 > 3 else -1500
    while k <= 12 and first_neg is None:
        t = t0 + k * 0.001
        x = acb_series([acb(arb(sg), arb(t)), 1], prec=2)
        y = R.completed(o, x); w = (y[1] / y[0]).real
        if w > 0: last_pos = t
        elif w < 0: first_neg = t
        k += 1
    out.append(dict(obj=o, sigma=sg, grid_onset=t0, last_certified_positive=last_pos, first_certified_negative=first_neg))
    print(out[-1], flush=True)
json.dump(out, open('onset.json', 'w'), indent=1)
