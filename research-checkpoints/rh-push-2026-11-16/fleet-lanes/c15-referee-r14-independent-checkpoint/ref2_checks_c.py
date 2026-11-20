"""E1 of c14-prefilter-sweep: R_a(w) = X(w-a)/X(w+a), a = 1/4, X with zeros +-0.35+-3i and +-0.15+-3i.
Claim under test: 'for a < 1/2 an off-line zero is a pole and the Schur condition is the zero-free statement'.
Two grids. Also X with zeros +-0.35+-3i only (no cancellation) and +-0.2+-3i only (inside abs Re <= a)."""
import sys, json, itertools
OUT = sys.argv[1]; R = {}
def X(w, zs):
    v = 1
    for z in zs: v *= (w - z)
    return v
def quartet(x, y): return [complex(sx * x, sy * y) for sx in (1, -1) for sy in (1, -1)]
cases = {"zeros +-0.35+-3i and +-0.15+-3i (cancelling)": quartet(.35, 3) + quartet(.15, 3),
         "zeros +-0.35+-3i only": quartet(.35, 3), "zeros +-0.2+-3i only (inside the strip of half-width a)": quartet(.2, 3)}
a = 0.25
for name, zs in cases.items():
    rec = {}
    for G in (200, 800):
        sup = 0; ax = 0
        for i in range(G + 1):
            t = -8 + 16 * i / G + 0.00137
            ax = max(ax, abs(abs(X(1j * t - a, zs) / X(1j * t + a, zs)) - 1))
            for j in range(1, G + 1):
                w = complex(4.0 * j / G + 0.00071, t)
                sup = max(sup, abs(X(w - a, zs) / X(w + a, zs)))
        rec["grid %d" % G] = {"max | |R| - 1 | on the axis": ax, "sup |R| on 0 < Re w <= 4, |Im w| <= 8": sup}
    R[name] = rec
json.dump(R, open(OUT, "w"), indent=1); print(json.dumps(R, indent=1))
