"""c5-marks-circularity-order2: exact rational LP (vertex enumeration, stdlib only) for the reduced comparison
system of r3-method-limit, with the low-side packages of RESULT.md section 3.
Variables v = (lx, ly, l). Constraint (c, c0): c.v + c0 <= 0.  MODEL: abscissae of estimate systems, not zero-free regions.
low:   B >= 5/6 - (l - lx)/6 + G + k/2
G:     polar = max(0, b/12);  tro6 = max(0, b - ly/2);  src = max of the three;  b = ly - lx
k:     zero | src = max(0,J,K,P) | hb = max(0, 1+l-M, (2+2l-M)/3) | wls = max(0, 1+l-M) | dual = max(0, l-M)
       | zf(theta) = l(2 theta - 1) (pointwise prime sums from ZF(theta))
comp:  True  -> geometry M >= 2l, ly >= l ; high E = 1/2 + d/2 - B - ly/2 + h(5/6-d) - l/2 + l d x
       False -> no geometry constraint     ; high E = 1/2 + d/2 - B - ly/2 + h(5/6-d)
high rows: d = 0 and (d, x) = (2B-1, 1/2).
"""
from fractions import Fraction as F
from itertools import combinations, product
from tiers_copy import solve3, feasible
import sys

def lowrows(B, G, k, theta=None):
    Gs = {"polar": [((0,0,0),F(0)), ((F(-1,12), F(1,12), 0), F(0))],
          "tro6":  [((0,0,0),F(0)), ((-1, F(1,2), 0), F(0))],
          "src":   [((0,0,0),F(0)), ((F(-1,12), F(1,12), 0), F(0)), ((-1, F(1,2), 0), F(0))],
          "zero":  [((0,0,0),F(0))]}[G]
    kall = {"0": ((0,0,0),F(0)), "J": ((F(-1,2), F(-1,2), F(3,4)), F(1,4)), "K": ((1,1,1),F(-1)),
            "P": ((0,0,F(3,2)), F(-1,2)), "LS": ((-1,-1,1), F(1)), "HB": ((F(-1,3),F(-1,3),F(2,3)), F(2,3)),
            "D": ((-1,-1,1), F(0))}
    if theta is not None: kall["Z"] = ((0,0,2*theta-1), F(0))
    Ks = {"zero": ["0"], "src": ["0","J","K","P"], "hb": ["0","LS","HB"], "wls": ["0","LS"], "dual": ["0","D"],
          "zf": ["Z"], "srcdual": ["0","J","K","P","D"]}[k]
    rows = []
    for (gc, g0), kk in product(Gs, Ks):
        kc, k0 = kall[kk]
        c = [F(1,6) + gc[0] + F(kc[0])/2, gc[1] + F(kc[1])/2, -F(1,6) + gc[2] + F(kc[2])/2]
        rows.append((c, F(5,6) + g0 + F(k0)/2 - B))
    return rows

def system(B, G="polar", k="zero", comp=True, box=F(16), theta=None, outside=None, extra=(), Blow=None):
    cons = lowrows(B if Blow is None else Blow, G, k, theta)
    if comp: cons += [((-1,-1,2),F(0)), ((0,-1,1),F(0))]
    hd = lambda dl, x: ([-(F(5,6) - dl), -F(1,2), (F(5,6) - dl) + ((-F(1,2) + dl*x) if comp else 0)],
                        F(1,2) + dl/2 - B + (F(5,6) - dl))
    cons.append(hd(F(0), F(0)))
    D = 2*B - 1
    if D > 0: cons.append(hd(D, F(1,2) if comp else F(0)))
    if outside is not None: cons.append(((1,0,-1), outside))     # lx <= l - outside
    cons += list(extra)
    for i in range(3):
        e = [0,0,0]; e[i] = -1; cons.append((tuple(e), F(0)))
        e = [0,0,0]; e[i] = 1; cons.append((tuple(e), -box))
    return cons

def inf_B(lo=F(1,2), **kw):
    hi = F(1)
    v = feasible(system(lo, **kw))
    if v is not None: return lo, v
    for _ in range(36):
        mid = (lo + hi)/2
        if feasible(system(mid, **kw)) is not None: hi = mid
        else: lo = mid
    return hi, feasible(system(hi, **kw))

def minsum(B, **kw):
    """vertex of the feasible set at abscissa B with the smallest l, then smallest M."""
    best = None
    cons = system(B, **kw)
    for tri in combinations(cons, 3):
        v = solve3(tri)
        if v is None: continue
        if all(sum(c*x for c, x in zip(cc, v)) + c0 <= 0 for cc, c0 in cons):
            key = (v[2], v[0] + v[1])
            if best is None or key < best[0]: best = (key, v)
    return None if best is None else best[1]

def fmt(v): return "(" + ", ".join(str(x) for x in v) + ")"

if __name__ == "__main__":
    print("== T1. infimum of B (searched down to 1/2; '<=1/2' means B = 1/2 is feasible), box 16")
    for G in ("polar", "tro6", "src"):
        for k in ("zero", "wls", "hb", "src", "dual", "srcdual"):
            for comp in (True, False):
                B, v = inf_B(G=G, k=k, comp=comp)
                tag = "<=1/2" if B == F(1,2) else f"{float(B):.7f}"
                print(f"  G={G:5s} k={k:7s} comp={str(comp):5s}  inf B = {tag:10s} at (lx,ly,l)={fmt(v)}  h={1 - v[0] + v[2]}")
    print("== T2. smallest-l vertex at B = 1/2 for the packages where 1/2 is feasible")
    for G in ("polar", "tro6", "src"):
        for k in ("zero", "wls", "hb", "dual"):
            for comp in (True, False):
                v = minsum(F(1,2), G=G, k=k, comp=comp)
                if v is None: continue
                M = v[0] + v[1]
                print(f"  G={G:5s} k={k:5s} comp={str(comp):5s}  (lx,ly,l)={fmt(v)}  M={M}  h={1 - v[0] + v[2]}  l-M={v[2]-M}  M-(1+l)={M-1-v[2]}  b={v[1]-v[0]}")
    print("== T3. same at B = 3/4 and 4/5 (first vertices below 5/6)")
    for Bt in (F(4,5), F(3,4)):
        for G in ("polar", "tro6"):
            for k in ("zero", "wls", "hb", "dual"):
                for comp in (True, False):
                    v = minsum(Bt, G=G, k=k, comp=comp)
                    if v is None: print(f"  B={Bt} G={G:5s} k={k:5s} comp={str(comp):5s}  infeasible"); continue
                    M = v[0] + v[1]
                    print(f"  B={Bt} G={G:5s} k={k:5s} comp={str(comp):5s}  (lx,ly,l)={fmt(v)}  M={M}  h={1 - v[0] + v[2]}  l-M={v[2]-M}")
    print("== T4. bootstrap: marks priced by pointwise ZF(theta) prime sums, k = l(2 theta - 1); G = zero (most favourable)")
    for th in (F(1,2), F(11,20), F(3,5), F(2,3), F(3,4), F(5,6), F(7,8)):
        for comp in (True, False):
            B, v = inf_B(lo=F(1,4), G="zero", k="zf", comp=comp, theta=th)
            print(f"  theta={str(th):6s} comp={str(comp):5s}  f(theta) = {float(B):.7f} = {B if B.denominator < 10**4 else '~'}  at {fmt(v)}  h={1 - v[0] + v[2]}   f - theta = {float(B - th):+.6f}")
    print("== T5. thin branch only (l >= M): infimum with k = dual and with k = zero")
    for G in ("polar", "tro6"):
        for k in ("zero", "dual"):
            for comp in (True, False):
                B, v = inf_B(G=G, k=k, comp=comp, extra=[((1,1,-1),F(0))])
                tag = "<=1/2" if B == F(1,2) else f"{float(B):.7f}"
                print(f"  thin  G={G:5s} k={k:5s} comp={str(comp):5s}  inf B = {tag} at {fmt(v) if v is not None else 'none (infeasible up to B = 1)'}")
    print("== T6. criticality: low rows at B_low < 1/2 together with the high rows at B = 1/2 (geometries with h > 3)")
    for G, k, comp in (("polar","wls",False), ("tro6","wls",True), ("tro6","hb",True), ("polar","dual",False), ("tro6","zero",True)):
        for Bl in (F(49,100), F(2,5), F(1,4)):
            v = feasible(system(F(1,2), G=G, k=k, comp=comp, Blow=Bl, box=F(40)))
            print(f"  G={G:5s} k={k:5s} comp={str(comp):5s}  B_low={str(Bl):6s}: " + ("infeasible" if v is None else f"feasible at {fmt(v)}  h={1 - v[0] + v[2]}  (h-3)/6={(v[2]-v[0]-2)/6}"))
