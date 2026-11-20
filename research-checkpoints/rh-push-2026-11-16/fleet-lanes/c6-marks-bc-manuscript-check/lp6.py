"""c6: exact rational checks with the c5 solver (lp5.py, tiers_copy.py copied unchanged).
T1: referee vertices of c5 (claim A).  T2: vertices at B = 2/3 (h = 2), the last abscissa at which Prop. 2.1 gives
an unconditional conclusion (H_eta has no zero in Re s >= 2/3).  T3: which vertices satisfy the source hypotheses
lx > l (Prop 15.3 / Liu II Prop 13.4), l <= 1/5, M + l <= 1 (k_K = 0).  MODEL abscissae, not zero-free regions."""
from fractions import Fraction as F
from lp5 import minsum, system, feasible, inf_B, fmt
def show(tag, v):
    if v is None: print(f"  {tag}: none"); return
    lx, ly, l = v; M = lx + ly
    print(f"  {tag}: (lx,ly,l)={fmt(v)} M={M} h={1-lx+l} b={ly-lx} | lx>l:{lx>l} lx>0:{lx>0} M>=2l:{M>=2*l} ly>=l:{ly>=l} M+l<=1:{M+l<=1} l<=1/5:{l<=F(1,5)}")
print("== T1 claim A: vertices at B = 1/2")
for G, k, comp in (("zero","zero",True), ("zero","hb",True), ("polar","zero",True), ("polar","wls",False),
                   ("tro6","wls",False), ("tro6","zero",True), ("tro6","hb",True)):
    show(f"G={G} k={k} comp={comp}", minsum(F(1,2), G=G, k=k, comp=comp))
print("   polar G with GEO-Q: inf B =", inf_B(G="polar", k="zero", comp=True)[0])
print("== T2 vertices at B = 2/3")
for G, k, comp in (("zero","zero",True), ("zero","hb",True), ("polar","wls",False), ("tro6","wls",False),
                   ("tro6","zero",True), ("tro6","hb",True)):
    show(f"G={G} k={k} comp={comp}", minsum(F(2,3), G=G, k=k, comp=comp))
print("== T3 source hypotheses added (lx >= l, M + l <= 1, l <= 1/5): infimum of B, packages polar/src G, src k")
src = [((-1,0,1),F(0)), ((1,1,1),F(-1)), ((0,0,1),F(-1,5))]
for G in ("polar","src","tro6","zero"):
    for k in ("zero","src"):
        B, v = inf_B(G=G, k=k, comp=True, extra=src)
        print(f"  G={G:5s} k={k:4s}: inf B = {B if B.denominator<1000 else float(B)}  at {fmt(v)}  h={1-v[0]+v[2]}")
print("== T4 h > 1 with lx >= l is empty (h = 1 - lx + l <= 1): any B = 1/2 or 2/3 vertex violates lx > l")
for Bt in (F(1,2), F(2,3)):
    for G in ("zero","tro6","polar"):
        v = feasible(system(Bt, G=G, k="zero", comp=True, extra=[((-1,0,1),F(0))]))
        print(f"  B={Bt} G={G} k=zero comp, lx>=l:", "infeasible" if v is None else fmt(v))
