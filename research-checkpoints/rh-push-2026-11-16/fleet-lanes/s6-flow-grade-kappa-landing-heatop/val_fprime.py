"""check of "the zero of F' continued from an off-line zero of F is real": number of zeros of F^(n)(X) in the disc |X - Re X_rho| <= R, R = 1.6 |Im X_rho|
(winding number on the circle, 4000 points, 60-digit values) against the number of sign changes of F^(n) on the real diameter.
Usage: val_fprime.py TABLE.pkl OBJ g b"""
import sys, cmath, math
from flint import arb, acb, ctx
import jl
T = jl.Tables(sys.argv[1]); ctx.prec = min(T.prec, int(700 + 6 * float(sys.argv[3]))); G = jl.gammas(T.series(sys.argv[2])); g = float(sys.argv[3]); b = float(sys.argv[4])
K = int(min(len(G) - 5, 600 + 5.5 * g))
def Fn(X, n):
    s = acb(0)
    f = arb(1); c = []
    for j in range(K): 
        if j: f *= j
        c.append(G[n + j] / f)
    for v in reversed(c): s = s * X + v
    return s
xr = -(g * g - b * b); xi = 2 * g * b; R = 1.6 * xi
for n in (0, 1, 2):
    cs = None
    f = arb(1); c = []
    for j in range(K):
        if j: f *= j
        c.append(G[n + j] / f)
    def ev(X):
        s = acb(0)
        for v in reversed(c): s = s * X + v
        return s
    M = 4000; tot = 0.0; prev = None
    for k in range(M + 1):
        th = 2 * math.pi * k / M; v = ev(acb(xr + R * math.cos(th), R * math.sin(th)))
        a = math.atan2(float(v.imag.mid()), float(v.real.mid()))
        if prev is not None:
            d = a - prev
            while d > math.pi: d -= 2 * math.pi
            while d < -math.pi: d += 2 * math.pi
            tot += d
        prev = a
    wind = round(tot / (2 * math.pi)); sc = 0; pv = None
    for k in range(4001):
        v = ev(acb(xr - R + 2 * R * k / 4000)).real
        sg = 1 if v > 0 else -1
        if pv is not None and sg != pv: sc += 1
        pv = sg
    print('%s n=%d: zeros of F^(n) in the disc centre %.1f radius %.1f: %d; sign changes on the real diameter: %d; non-real zeros in the disc: %d' % (sys.argv[2], n, xr, R, wind, sc, wind - sc))
