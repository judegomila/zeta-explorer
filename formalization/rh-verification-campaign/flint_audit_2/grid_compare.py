# compare patched vs unpatched Platt grids (meprobe_fix / meprobe_orig output: mantissa exponent radius per grid point)
from flint import arb, ctx
ctx.prec = 200
def load(fn): return [tuple(int(x) if i < 2 else float(x) for i, x in enumerate(l.split())) for l in open(fn)]
g0 = load('grid_orig.txt'); g1 = load('grid_fix.txt'); N = len(g0); A = 8
bad = worse = 0; rr = 0
for i in range(N//2 - 900*A, N//2 + 900*A):
    (m0, e0, r0), (m1, e1, r1) = g0[i], g1[i]
    d = abs(arb(m0)*arb(2)**e0 - arb(m1)*arb(2)**e1)
    bad += float(d.mid()) > r0 + r1; worse += r1 > r0; rr = max(rr, r1/r0)
print("central |t-T|<=900:", 1800*A, "non-overlapping:", bad, "patched radius larger:", worse, "max r_fix/r_orig:", rr)
