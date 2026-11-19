"""c8, pivot: (E-H) by an operator-norm bound for the non-principal dual frequencies.
Hypothetical best case (Hilbert-Schmidt floor, 'optimal K + D' for the operator with the sixth-power frequencies removed):
    |NP| <= Q^(-1/2) ||A|| ||T_np|| ||beta||,  ||T_np||^2 >= max(Q, N)  =>  exponent >= lx/2 + max(0, 1 + l - M)/2,
so in the abscissa normalisation  B >= N_np := 1 - h/r + max(0, 1 + l - M)/2.
System: low side of cap_lp_copy (G, k branches) and high side = min(H0, N_np) (the estimate may choose): two LPs.
Theorem K' (identity): (1/2) L_K + (1/2) N_np = 1 - h/r + l/2 = 1 - 1/r + lx/r + l (1/2 - 1/r).
MODEL abscissae. Planned memory < 50 MB."""
from fractions import Fraction as F
import random, sys
import cap_lp_copy as C

def system(B, high="np", r=6, **kw):
    R = F(r); kw2 = dict(kw); kw2['high'] = 'none'; kw2['r'] = r
    cons = C.system(B, **kw2)
    if high in ("np",):
        # 1 - (1 + l - lx)/r - B <= 0 is already a low constraint; add 1 - h/r + (1 + l - lx - ly)/2 - B <= 0
        cons.append(([1/R - F(1, 2), -F(1, 2), -1/R + F(1, 2)], 1 - 1/R + F(1, 2) - B))
    elif high == "H0":
        cons.append(([-(1 - 1/R), -F(1, 2), (1 - 1/R) - F(1, 2)], F(1, 2) - B + (1 - 1/R)))
    return cons
def inf_B(**kw):
    lo, hi = F(1, 4), F(2)
    v = C.feasible(system(lo, **kw))
    if v is not None: return lo, v
    for _ in range(40):
        mid = (lo + hi) / 2
        if C.feasible(system(mid, **kw)) is not None: hi = mid
        else: lo = mid
    return hi, C.feasible(system(hi, **kw))
def show(name, guess=None, **kw):
    best = None
    for high in ("H0", "np"):
        B, v = inf_B(high=high, **kw)
        if best is None or B < best[0]: best = (B, v, high)
    B, v, high = best; h = 1 + v[2] - v[0]
    s = f"{name:60s} B={float(B):.7f} branch={high:2s} (lx,ly,l)=({float(v[0]):.4f},{float(v[1]):.4f},{float(v[2]):.4f}) h={float(h):.4f}"
    if B == F(1, 4): s += "  [= search bound: no floor]"
    if guess is not None:
        g = F(guess)
        ok = any(C.feasible(system(g, high=hh, **kw)) is not None for hh in ("H0", "np")) and all(C.feasible(system(g - F(1, 10**9), high=hh, **kw)) is None for hh in ("H0", "np"))
        s += f"  exact {g}: {'CONFIRMED' if ok else 'NOT confirmed'}"
    print(s); sys.stdout.flush()
if __name__ == "__main__":
    rnd = random.Random(11); bad = 0
    for r in (2, 3, 4, 6, 8, 12):
        R = F(r)
        for _ in range(3000):
            lx, ly, l = (F(rnd.randint(-300, 300), rnd.randint(1, 50)) for _ in range(3))
            h = 1 + l - lx; LK = 1 - h/R + (lx + ly + l - 1)/2; Nnp = 1 - h/R + (1 + l - lx - ly)/2
            if (LK + Nnp)/2 != 1 - 1/R + lx/R + l*(F(1, 2) - 1/R): bad += 1
    print("== identity (L_K + N_np)/2 = 1 - 1/r + lx/r + l(1/2 - 1/r): 18000 random rational points, violations:", bad)
    print("== high side = min(H0, N_np); free geometry; box 8")
    for r in (2, 3, 6):
        show(f"r={r}, G=0, k = K only", str(F(r - 1, r)), r=r, box=F(8))
    for G in ("zero", "polar", "src"):
        show(f"r=6, G={G}, k = K only", G=G, box=F(8))
        show(f"r=6, G={G}, k = J,K,P", G=G, K="KJP", box=F(8))
        show(f"r=6, G={G}, (E-K): K deleted, J,P kept", G=G, K="JP", box=F(8))
        show(f"r=6, G={G}, k = 0", G=G, K="", box=F(8))
    print("== high side = N_np only (H0 not available), free geometry; box 8")
    for G in ("zero", "polar"):
        for K, kn in (("K", "k = K only"), ("KJP", "k = J,K,P"), ("JP", "(E-K)"), ("", "k = 0")):
            B, v = inf_B(high="np", G=G, K=K, box=F(8)); h = 1 + v[2] - v[0]
            print(f"G={G}, {kn:12s} B={float(B):.7f} = {B.limit_denominator(1000)} (lx,ly,l)=({float(v[0]):.4f},{float(v[1]):.4f},{float(v[2]):.4f}) h={float(h):.4f}")
