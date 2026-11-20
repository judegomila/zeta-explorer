"""Test C: pure lattice model (on-line lattice of spacing 2 pi/Lg, tolerance M). One pair: at a lattice midpoint,
at a lattice point (on-line zero kept), and replacing a lattice point. Thresholds against Theorem 2 (d) and
Theorem 4 (b). Ball arithmetic, exact criterion."""
import json, math
from flint import ctx, arb
import wil
ctx.prec = 512
def root(fn, lo, hi):
    for _ in range(200):
        m = (lo + hi) / 2
        if fn(m): lo = m
        else: hi = m
    return lo
Lg = 18.885
d = 2 * math.pi / Lg
for thp in (0.5, 0.9, 1.07, 1.5, 2.2):
    for M in ((0.0, 1.0) if thp < 1 else (1.0, 1e-2, 1e-4)):
        u = thp * Lg; u1 = u - Lg
        dev = wil.Device(u, Lg, M); dev.set_online([], [])
        out = {}
        for name, x, rem in (("midpoint", d / 2, []), ("lattice point", 0.0, []), ("replace", 0.0, [0.0])):
            if rem:
                dev2 = wil.Device(u, Lg, M); dev2.set_online([], [0.0])
                b, note = wil.threshold(lambda b: dev2.test([(x, b)]), 1e-7, 0.4999, steps=30)
            else:
                b, note = wil.threshold(lambda b: dev.test([(x, b)]), 1e-7, 0.4999, steps=30)
            out[name] = b
        if thp < 1:
            a = root(lambda a: math.sinh(a) / a <= 1 + (Lg + 2 * M) / u, 1e-9, 50)
            ref = "tight law b = %.6f" % (a / u)
        else:
            own = root(lambda b: u * (math.sinh(u * b) / (u * b) - 1) <= 2 * M, 1e-12, 2)
            mid = root(lambda b: (1 + math.sinh(math.pi * b / d) ** 2) * u1 * (math.sinh(u1 * b) / (u1 * b) - 1) <= 2 * M, 1e-12, 2)
            at = root(lambda b: (math.sinh(math.pi * b / d) ** 2) * u1 * (math.sinh(u1 * b) / (u1 * b) - 1) <= 2 * M, 1e-12, 2)
            ref = "passes below %.6f; excluded above %.6f (midpoint), %.6f (lattice point)" % (own, mid, at)
        print(json.dumps(dict(thetap=thp, M=M, u=u, **out, ref=ref)), flush=True)
