"""c8: exact rational LP for (E-H) with and without (E-K). Copy of the system of ../c7-probe-format-h-cap/cap_lp.py
(file cap_lp_copy.py, unchanged) with one added parameter theta: the high constraint is
    H_theta = 1/2 - ly/2 + (1 - 1/r - theta) h - l/2 <= B       (row count Z^h, saving Z^(-theta h) over the trivial count)
theta = 0 is H0; high='none' deletes the constraint. MODEL: abscissae of hypothetical estimate systems, not zero-free regions.
Planned memory < 50 MB."""
from fractions import Fraction as F
import sys
import cap_lp_copy as C

def system(B, theta=F(0), floor=None, **kw):
    r = kw.get('r', 6); R = F(r); comp = kw.get('comp', True); high = kw.get('high', 'H0')
    kw2 = dict(kw); kw2['high'] = 'none'
    cons = C.system(B, **kw2)
    if high == 'H0':
        c = 1 - 1/R - theta
        # 1/2 - ly/2 + c (1 + l - lx) - l/2 - B <= 0
        cons.append(([-c, -F(1, 2), c - (F(1, 2) if comp else 0)], F(1, 2) + c - B))
    return cons

def inf_B(**kw):
    lo, hi = F(1, 4), F(1)
    v = C.feasible(system(lo, **kw))
    if v is not None: return lo, v
    for _ in range(40):
        mid = (lo + hi) / 2
        if C.feasible(system(mid, **kw)) is not None: hi = mid
        else: lo = mid
    return hi, C.feasible(system(hi, **kw))

def show(name, guess=None, **kw):
    B, v = inf_B(**kw)
    h = 1 + v[2] - v[0]
    s = f"{name:66s} B={float(B):.7f} (lx,ly,l)=({float(v[0]):.4f},{float(v[1]):.4f},{float(v[2]):.4f}) h={float(h):.4f}"
    if B == F(1, 4): s += "  [= search bound: no floor]"
    if guess is not None:
        g = F(guess)
        ok = C.feasible(system(g, **kw)) is not None and C.feasible(system(g - F(1, 10**9), **kw)) is None
        s += f"  exact {g}: {'CONFIRMED' if ok else 'NOT confirmed'}"
    print(s); sys.stdout.flush()

if __name__ == "__main__":
    print("== 0. regression (theta = 0 must reproduce cap_lp.log)")
    show("13/15: G src, k = JKP, src geometry", "13/15", G="src", K="KJP", geo="src")
    show("free, G=0, k=K, H0", "5/6", box=F(8))
    show("free, G=0, k=K, H0 removed", "2/3", high="none", box=F(8))
    for G in ("zero", "polar", "src"):
        print(f"== G = {G}; free geometry, box 8; r = 6")
        for K, kn in (("K", "k = K only"), ("KJP", "k = J,K,P (source ledger)"), ("JP", "(E-K): K deleted, J,P kept"), ("", "k = 0 (all range losses deleted)")):
            for th in (F(0), F(1, 12), F(1, 6), F(1, 4), F(1, 3), F(1, 2), F(5, 6)):
                show(f"{kn}; theta = {th}", G=G, K=K, theta=th, box=F(8))
            show(f"{kn}; H removed", G=G, K=K, high="none", box=F(8))
    print("== source geometry lx, ly >= l (the only region with a sourced compensated probe)")
    for G in ("polar", "src"):
        for K, kn in (("KJP", "k = J,K,P"), ("JP", "(E-K)"), ("", "k = 0")):
            for th in (F(0), F(1, 2)):
                show(f"G={G}; {kn}; theta = {th}", G=G, K=K, theta=th, geo="src", box=F(8))
            show(f"G={G}; {kn}; H removed", G=G, K=K, high="none", geo="src", box=F(8))
