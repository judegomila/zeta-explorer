"""Independent quadrature (different rotation angle, panel width, node count): re-solve selected events."""
from zf import *
from track import collide
from flint import arb
Z2 = ZF(prec=500, delta=0.2, h=0.08, n=90, xmax=3.04)
def agree(a, b):
    n = 0
    for x, y in zip(a, b):
        if x != y: break
        n += 1
    return n
rows = [l.rstrip("\n").split("\t") for l in open("events_table.tsv")][1:]
pick = [r for r in rows if r[1].startswith(("0.35217", "0.56573", "0.91685", "1.12200", "0.05852", "0.62502"))]
for r in pick:
    wk, tk, ok, res = collide(Z2, arb(r[1][:40]), arb(r[2][:40]))
    s1 = wk.str(70, radius=False); s2 = tk.str(70, radius=False)
    print(r[0], r[1][:20], "ok", ok, "agreeing leading chars: w", agree(s1, r[1]), " t", agree(s2, r[2]))
