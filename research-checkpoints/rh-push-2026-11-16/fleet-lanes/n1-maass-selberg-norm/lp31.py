"""Exact-rational check of the K-loss price in the r3-method-limit model system.
Imports the refereed LP (vertex enumeration, Fractions) from ../r3-method-limit/tiers.py unchanged,
and adds a scaled K-loss k_K = th*(M + l - 1), th in [0,1]. MODEL: values of an estimate system, not zeros."""
import sys, os
from fractions import Fraction as F
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3-method-limit"))
import tiers

def confirm(name, guess, **kw):
    g = F(guess)
    ok = tiers.feasible(tiers.system(g, **kw)) is not None and tiers.feasible(tiers.system(g - F(1, 10**9), **kw)) is None
    v = tiers.feasible(tiers.system(g, **kw))
    print(f"{name:52s} {guess:>6s} = {float(g):.7f}  {'CONFIRMED' if ok else 'NOT confirmed'}  point={[str(x) for x in v] if v else None}")

confirm("source low side (K, J, P kept)", "13/15")
confirm("K-loss removed (row exponent M, no K term)", "31/36", K="noK")
confirm("K and J removed", "23/27", K="onlyP")
confirm("K and P removed", "5/6", K="onlyJ")

# scaled K-loss: patch the K row of the k-table through a wrapper around tiers.system
def system_scaled(B, th):
    cons = tiers.system(B, K="noK")
    R = F(6)
    Gs = [((0,0,0),0), ((-1/(2*R), 1/(2*R), 0), 0), ((-1, F(1,2), 0), 0)]
    for gc, g0 in Gs:
        kc, k0 = (th, th, th), -th
        c = [F(1)/R + gc[0] + F(kc[0])/2, gc[1] + F(kc[1])/2, -F(1)/R + gc[2] + F(kc[2])/2]
        cons.append((c, 1 - 1/R + g0 + F(k0)/2 - B))
    return cons

print("\nscaled K-loss k_K = th*(M+l-1): infimum of the model system (bisection to 2^-40, exact feasibility tests)")
for th in [F(1), F(1,2), F(1,10), F(1,20), F(1,30), F(1,40), F(1,60), F(1,100), F(1,300), F(0)]:
    lo, hi = F(1,2), F(1)
    for _ in range(40):
        mid = (lo + hi) / 2
        if tiers.feasible(system_scaled(mid, th)) is not None: hi = mid
        else: lo = mid
    v = tiers.feasible(system_scaled(hi, th))
    print(f"  th={str(th):5s} B={float(hi):.7f}  (lx,ly,l)=({float(v[0]):.4f},{float(v[1]):.4f},{float(v[2]):.4f})  M+l-1={float(v[0]+v[1]+v[2]-1):+.4f}")
