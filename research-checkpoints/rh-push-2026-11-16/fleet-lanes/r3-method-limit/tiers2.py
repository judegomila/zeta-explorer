"""Second table: exact confirmations and the amplification requirement. Same conventions as tiers.py."""
from fractions import Fraction as F
import tiers
from tiers import show, system, feasible

# add the option G = max(0, b - ly/2)  (TRO6 at eta = 1 with the P_a^2/Y' term kept)
_orig = tiers.system
def system_eta1(B, **kw):
    cons = _orig(B, **{**kw, "G": "src"})
    # drop the rows that carry the polar branch: rebuild with a filtered G list
    return cons
print("== exact confirmations (ideal high side, source geometry)")
show("k without K-loss", "31/36", K="noK")
show("k = max(0, P)", "23/27", K="onlyP")
show("k = max(0, J)", "5/6", K="onlyJ")
show("k = max(0, J, P)", "31/36", K="noK")
show("k = max(0, K, P)  (J-loss removed)", "13/15", K="noJ")
show("G = 0 for every b, k src", "5/6", G="zero")
show("G = 0, k src, GRH counts", "5/6", G="zero", high="grh")
print("== new certificate for 13/15 without the J-loss: weights on L0, L0', L_K, H0")
lx, ly, l = F(2,5), F(2,5), F(1,5)
import random
random.seed(1)
for _ in range(5):
    lx, ly, l = [F(random.randint(0, 1000), 1000) for _ in range(3)]
    M = lx + ly
    L0 = F(5,6) + M/12 - l/6; L0p = F(5,6) + lx/6 - l/6; LK = L0 + (M + l - 1)/2
    H0 = F(1,2) - ly/2 + F(5,6)*(1 - lx + l) - l/2
    val = F(4,15)*L0 + F(2,5)*L0p + F(2,15)*LK + F(1,5)*H0
    print("  random geometry", (float(lx), float(ly), float(l)), "combination =", val)
print("== amplification needed to reach a given abscissa, k = 0, free geometry (lx, ly, l >= 0), ideal high")
def min_l(B, **kw):
    lo, hi = F(0), F(40)
    if feasible(system(B, lcap=hi, box=F(80), **kw)) is None: return None
    for _ in range(34):
        mid = (lo + hi)/2
        if feasible(system(B, lcap=mid, box=F(80), **kw)) is not None: hi = mid
        else: lo = mid
    return hi
for B in (F(5,6), F(4,5), F(3,4), F(2,3), F(3,5), F(1,2)):
    a = min_l(B, K="zero", G="polar", geo="free")
    b = min_l(B, K="zero", G="zero", geo="free")
    c = min_l(B, K="zero", G="polar", geo="free", comp=False)
    d = min_l(B, K="zero", G="zero", geo="free", comp=False)
    f = lambda x: "none" if x is None else f"{float(x):.4f}"
    print(f"  B={float(B):.4f}: min l  polar/comp {f(a)}  G=0/comp {f(b)}  polar/no-comp {f(c)}  G=0/no-comp {f(d)}"
          f"   [predicted: polar 8-9B = {float(8-9*B):.4f}, G=0: 6(5/6-B) = {float(6*(F(5,6)-B)):.4f}]")
