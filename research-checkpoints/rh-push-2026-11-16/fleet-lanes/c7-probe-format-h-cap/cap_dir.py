"""Unreflected (dir) branch: k_dir = max(0, 1 + l - M, (2 + 2l - M)/3) (MS Lemma 9.1 as transcribed by c5).
Checks (D) of c5 in free geometry and the size of the Gram excess forced by the alignment lemma.
Planned memory < 50 MB."""
from fractions import Fraction as F
import cap_lp as L

def system_dir(B, r=6, G="polar", box=F(8), high=True, comp=True):
    R = F(r); cons = []
    Gs = {"zero": [((0,0,0),0)], "polar": [((0,0,0),0), ((-1/(2*R), 1/(2*R), 0), 0)]}[G]
    ks = [((0,0,0),0), ((-1,-1,1),1), ((F(-1,3),F(-1,3),F(2,3)),F(2,3))]
    for gc, g0 in Gs:
        for kc, k0 in ks:
            c = [1/R + gc[0] + F(kc[0])/2, gc[1] + F(kc[1])/2, -1/R + gc[2] + F(kc[2])/2]
            cons.append((c, 1 - 1/R + g0 + F(k0)/2 - B))
    if high:
        cons.append(([-(1 - 1/R), -F(1,2), (1 - 1/R) - (F(1,2) if comp else 0)], F(1,2) - B + (1 - 1/R)))
    for i in range(3):
        e = [0,0,0]; e[i] = -1; cons.append((tuple(e), 0))
        e = [0,0,0]; e[i] = 1; cons.append((tuple(e), -box))
    return cons

def inf(**kw):
    lo, hi = F(1,4), F(2)
    v = L.feasible(system_dir(lo, **kw))
    if v is not None: return lo, v
    for _ in range(40):
        mid = (lo + hi)/2
        if L.feasible(system_dir(mid, **kw)) is not None: hi = mid
        else: lo = mid
    return hi, L.feasible(system_dir(hi, **kw))

for nm, kw, guess in (("dir, G polar, free, box 8", dict(G="polar"), F(1)),
                      ("dir, G polar, free, box 16", dict(G="polar", box=F(16)), F(1)),
                      ("dir, G polar, free, no high side", dict(G="polar", high=False), F(1)),
                      ("dir, G = 0, free, box 8", dict(G="zero"), None),
                      ("dir, G = 0, free, box 16", dict(G="zero", box=F(16)), None)):
    B, v = inf(**kw)
    s = f"{nm:36s} B={float(B):.7f} (lx,ly,l)=({float(v[0]):.4f},{float(v[1]):.4f},{float(v[2]):.4f}) h={float(1+v[2]-v[0]):.4f}"
    if guess is not None:
        ok = L.feasible(system_dir(guess, **kw)) is not None and L.feasible(system_dir(guess - F(1,10**9), **kw)) is None
        s += f"  exact {guess}: {'CONFIRMED' if ok else 'NOT confirmed'}"
    if B == F(1,4): s += "  [= search bound]"
    print(s)
# forced Gram excess g*(v) = h/r - k_dir/2 at sample points of the G = 0 runs
for v in ((F(0),F(8),F(3)), (F(0),F(4),F(1)), (F(2,5),F(2,5),F(1,5)), (F(1),F(1),F(1))):
    lx, ly, l = v; M = lx + ly; h = 1 + l - lx
    k = max(F(0), 1 + l - M, (2 + 2*l - M)/3)
    print(f"point {v}: h={h} k_dir={k} forced excess h/6 - k_dir/2 = {h/6 - k/2}  polar b/12 = {(ly-lx)/12}  polar >= forced: {(ly-lx)/12 >= h/6 - k/2}")
