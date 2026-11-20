"""Combination (3), second detector: argument-principle count of zeros of F in a < Re w < xhi + a, |Im w| < Y
(= number of poles of R_a in the box 0 < Re w < xhi, |Im w| < Y). Sampled phase of F on the rectangle, step ds, 128-bit Arb.
usage: winding.py <code> <a> <ds> Y1 Y2 ..."""
import sys, json, cmath, math
from flint import acb, ctx
import lib
ctx.prec = 128
code, a, ds = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]); o = lib.get(code); xhi = 2.0
for Y in [float(v) for v in sys.argv[4:]]:
    c = [complex(a, -Y), complex(xhi + a, -Y), complex(xhi + a, Y), complex(a, Y), complex(a, -Y)]
    tot = 0.0; prev = None; mx = 0.0
    for p, q in zip(c[:-1], c[1:]):
        n = max(2, int(abs(q - p) / ds))
        for k in range(n + (1 if q == c[-1] else 0)):
            z = p + (q - p) * k / n
            v = lib.val(o, acb(z.real, z.imag))
            ph = math.atan2(float(v.imag.mid()), float(v.real.mid()))
            if prev is not None:
                d = ph - prev
                while d > math.pi: d -= 2 * math.pi
                while d < -math.pi: d += 2 * math.pi
                tot += d; mx = max(mx, abs(d))
            prev = ph
    print(json.dumps(dict(detector='winding', code=code, a=a, Y=Y, count=tot / (2 * math.pi), max_phase_step=mx)), flush=True)
