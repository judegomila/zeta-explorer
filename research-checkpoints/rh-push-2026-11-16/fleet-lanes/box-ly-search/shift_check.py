"""shift_check.py: number of zeros of F^(n)(w) = sum_k gamma(k+n) w^k / k!  (DH input) in the rectangle
Re w in [-7700, -7000], Im w in [2, 150], by the argument principle with Arb point values (winding by float
phase increments on a fine contour: MEASURED, not certified).  The off-line DH zero 0.8085+85.699i is w = -7344.3+52.9i."""
import math, cmath, json, sys
from flint import arb, acb, ctx
import jensen_track as JT
JT.PREC = 700
ctx.prec = 700
K = 900
m = []
for k in range(K + 1):
    kk, a, b = JT.moment(k)
    m.append(arb(a, b))
Jn = JT.Jen(m, K)
def Fn(n, w):
    s = acb(0); p = acb(1)
    for k in range(0, K - n - 1):
        if k > 0: p = p * w / k
        s += Jn.g[k + n] * p
    return s
def count(n, x1=-7700.0, x2=-7000.0, y1=2.0, y2=150.0, h=2.0):
    pts = []
    def seg(a, b):
        L = abs(b - a); N = int(L / h) + 1
        return [a + (b - a) * i / N for i in range(N)]
    c = complex
    pts = seg(c(x1, y1), c(x2, y1)) + seg(c(x2, y1), c(x2, y2)) + seg(c(x2, y2), c(x1, y2)) + seg(c(x1, y2), c(x1, y1))
    vals = []
    for z in pts:
        v = Fn(n, acb(z.real, z.imag))
        sc = max(abs(v.real.mid()), abs(v.imag.mid()))
        v = v / sc
        vals.append(complex(v))
    tot = 0.0; big = 0.0
    for i in range(len(vals)):
        d = cmath.phase(vals[(i + 1) % len(vals)] / vals[i]); tot += d; big = max(big, abs(d))
    return tot / (2 * math.pi), big
for n in (0, 1, 2, 3):
    w, big = count(n)
    print(json.dumps(dict(n=n, zeros_in_rectangle=round(w, 4), max_phase_step=round(big, 3))), flush=True)
