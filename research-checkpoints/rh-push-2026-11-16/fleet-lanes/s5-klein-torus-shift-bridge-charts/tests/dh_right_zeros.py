"""Zeros of the Davenport-Heilbronn function with Re s > 1 (b = Re s - 1/2 > 1/2), |Im s| < Tmax: grid + Newton on X'/X."""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from flint import acb, arb, ctx
import objs
ctx.prec = 100; o = objs.get('DH'); Tmax = float(sys.argv[1]) if len(sys.argv) > 1 else 200
found = []
import math
t = 0.25
while t < Tmax:
    for b0 in (0.45, 0.6, 0.8, 1.0, 1.3):
        w = acb(b0, t); ok = True
        for it in range(40):
            f, l = objs.XL(o, w)
            st = 1 / l
            if not (abs(st) < 0.6): ok = False; break
            w = acb((w - st).real.mid(), (w - st).imag.mid())
            if abs(st) < 1e-25: break
        if ok and abs(st) < 1e-20:
            b = float(w.real.mid()); g = float(w.imag.mid())
            if b > 0.4 and 0 < g < Tmax and not any(abs(b - x) + abs(g - y) < 1e-6 for x, y in found): found.append((b, g))
    t += 0.5
found.sort(key=lambda p: p[1])
json.dump(found, open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'out', 'dh_right_zeros.json'), 'w'))
for b, g in found: print('b = %.10f  gamma = %.10f  Re s = %.10f' % (b, g, b + 0.5))
