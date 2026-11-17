"""r3-method-limit: exact-rational tier table for the idealised order-r comparison system.
Variables v = (lx, ly, l).  A constraint is (c, c0) meaning c.v + c0 <= 0.
Feasibility at a given B by vertex enumeration in Fractions (box 0<=v<=BOX added).
MODEL: every row is the abscissa of a hypothetical estimate system, not a bound on zeros."""
from fractions import Fraction as F
from itertools import combinations
import sys

def solve3(rows):
    A = [list(r[0]) + [-r[1]] for r in rows]
    n = 3
    for i in range(n):
        p = next((j for j in range(i, n) if A[j][i] != 0), None)
        if p is None: return None
        A[i], A[p] = A[p], A[i]
        for j in range(n):
            if j != i and A[j][i] != 0:
                f = A[j][i] / A[i][i]
                A[j] = [a - f * b for a, b in zip(A[j], A[i])]
    return [A[i][3] / A[i][i] for i in range(n)]

def feasible(cons):
    for tri in combinations(cons, 3):
        v = solve3(tri)
        if v is None: continue
        if all(sum(c * x for c, x in zip(cc, v)) + c0 <= 0 for cc, c0 in cons):
            return v
    return None

def system(B, r=6, G="src", K="src", geo="src", high="dh", box=F(4), lcap=None, comp=True):
    """low: B >= 1 - 1/r + (lx - l)/r + G + k/2 ; signal exponent C(s) = s - 1 + lx/2 + h/r.
    G branches: 0, b/(2r) [polar], b - ly/2 [P_a^2/Y'] ; k branches as in Liu II sec. 15.1.
    high (ideal, Lindelof numerator, density-hypothesis count U^(1-delta), prime amplitude x<=1/2):
      E(delta,x) = 1/2 + delta/2 - B - ly/2 + h(1 - 1/r - delta) - l/2 + l*delta*x <= 0, delta in [0, 2B-1].
    comp=False: no compensation, the row prime factor is not reduced (drop the -l/2 and the amplitude term)."""
    cons = []
    R = F(r)
    Gs = {"src": [((0,0,0),0), ((-1/(2*R), 1/(2*R), 0), 0), ((-1, F(1,2), 0), 0)],
          "polar": [((0,0,0),0), ((-1/(2*R), 1/(2*R), 0), 0)],
          "zero": [((0,0,0),0)]}[G]
    kall = {"0": ((0,0,0),0), "J": ((F(-1,2), F(-1,2), F(3,4)), F(1,4)),
            "K": ((1,1,1),-1), "P": ((0,0,F(3,2)), F(-1,2))}
    Ks = {"src": "0JKP", "noK": "0JP", "noJ": "0KP", "noP": "0JK", "onlyJ": "0J", "onlyK": "0K", "onlyP": "0P", "zero": "0"}[K]
    for gc, g0 in Gs:
        for kk in Ks:
            kc, k0 = kall[kk]
            c = [F(1)/R + gc[0] + F(kc[0])/2, gc[1] + F(kc[1])/2, -F(1)/R + gc[2] + F(kc[2])/2]
            cons.append((c, 1 - 1/R + g0 + F(k0)/2 - B))
    if geo == "src":      # lx >= l, ly >= l (rescaled lengths X/P, Y/P >= 1)
        cons += [((-1,0,1),0), ((0,-1,1),0)]
    elif geo == "Q":      # only M >= 2l (rescaled row range nonempty)
        cons += [((-1,-1,2),0)]
    elif geo == "free":
        pass
    if high in ("dh", "grh"):
        hd = lambda dl, x: ([-(1 - 1/R - dl), -F(1,2), (1 - 1/R - dl) + (-F(1,2) + dl * x if comp else 0)],
                            F(1,2) + dl/2 - B + (1 - 1/R - dl))
        cons.append(hd(F(0), F(0)))
        if high == "dh":
            D = 2 * B - 1
            cons.append(hd(D, F(1,2) if comp else F(0)))
    for i in range(3):
        e = [0,0,0]; e[i] = -1; cons.append((tuple(e), 0))
        e = [0,0,0]; e[i] = 1; cons.append((tuple(e), -(lcap if (i == 2 and lcap is not None) else box)))
    return cons

def inf_B(**kw):
    lo, hi = F(1,4), F(1)
    if feasible(system(lo, **kw)) is not None: return lo, feasible(system(lo, **kw))
    for _ in range(40):
        mid = (lo + hi) / 2
        if feasible(system(mid, **kw)) is not None: hi = mid
        else: lo = mid
    return hi, feasible(system(hi, **kw))

def show(name, guess=None, **kw):
    B, v = inf_B(**kw)
    s = f"{name:66s} B={float(B):.7f} lx={float(v[0]):.4f} ly={float(v[1]):.4f} l={float(v[2]):.4f}"
    if guess is not None:
        g = F(guess)
        ok = feasible(system(g, **kw)) is not None and feasible(system(g - F(1, 10**9), **kw)) is None
        s += f"  exact {g}: {'CONFIRMED' if ok else 'NOT confirmed'}"
    print(s); sys.stdout.flush()

if __name__ == "__main__":
    print("== r = 6, ideal high side (density-hypothesis counts, Lindelof numerator), source geometry lx,ly >= l")
    show("T1  source low side (G src, k src)", "13/15")
    show("T1' source low, GRH counts (floor class only)", "13/15", high="grh")
    show("T2a G = 0 for every b (no Gram excess), k src", G="zero")
    show("T2b k: K-loss removed", K="noK")
    show("T2c k: J-loss removed", K="noJ")
    show("T2d k: P-loss (3l-1)/2 removed", K="noP")
    show("T2e k = max(0, J)", K="onlyJ")
    show("T2f k = max(0, K)", K="onlyK")
    show("T2g k = max(0, P)", K="onlyP")
    show("T3  k = 0, G src", "5/6", K="zero")
    show("T3' k = 0, G polar", "5/6", K="zero", G="polar")
    show("T4  k = 0, G = 0", "5/6", K="zero", G="zero")
    show("T4' k = 0, G = 0, no high side at all", "5/6", K="zero", G="zero", high="none")
    print("== r = 6, geometry relaxed to M >= 2l")
    show("Q1  k = 0, G polar", "5/6", K="zero", G="polar", geo="Q")
    show("Q2  k = 0, G = 0", K="zero", G="zero", geo="Q")
    show("Q3  k src, G = 0", K="src", G="zero", geo="Q")
    print("== r = 6, geometry free (lx, ly, l >= 0 only), box <= 4 and <= 8")
    for bx in (4, 8, 16):
        show(f"F1  k = 0, G polar, box {bx}", K="zero", G="polar", geo="free", box=F(bx))
        show(f"F2  k = 0, G = 0,   box {bx}", K="zero", G="zero", geo="free", box=F(bx))
    show("F3  k src, G polar, free", K="src", G="polar", geo="free")
    show("F4  k = max(0,P), G polar, free", K="onlyP", G="polar", geo="free")
    show("F5  k = max(0,K), G polar, free", K="onlyK", G="polar", geo="free", box=F(8))
    show("F6  k = max(0,J), G polar, free", K="onlyJ", G="polar", geo="free", box=F(8))
    print("== other orders r (transplant 6 -> r), source geometry, k = 0, G polar, ideal high")
    for r in (3, 4, 5, 6, 8, 12):
        show(f"r={r}: expect 1 - 1/r = {1 - 1/r:.6f}", str(F(r - 1, r)), r=r, K="zero", G="polar")
    for r in (3, 4, 5, 6, 8):
        show(f"r={r}: source k (expect 1 - 4/(5r) = {1 - 4/(5*r):.6f}?)", r=r)
