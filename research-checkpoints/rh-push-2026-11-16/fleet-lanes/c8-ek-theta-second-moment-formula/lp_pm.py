"""c7-probe-format-h-cap: exact rational checks of the format cap.
Variables v = (lx, ly, l). Constraint (c, c0): c.v + c0 <= 0. Vertex enumeration in Fractions (python stdlib).
MODEL: every value is the abscissa of a hypothetical estimate system, not a bound on zeros.
Planned memory: < 50 MB (lists of at most ~40 constraints, C(40,3) = 9880 3x3 solves per feasibility call)."""
from fractions import Fraction as F
from itertools import combinations
import random, sys

def solve3(rows):
    A = [list(r[0]) + [-r[1]] for r in rows]
    for i in range(3):
        p = next((j for j in range(i, 3) if A[j][i] != 0), None)
        if p is None: return None
        A[i], A[p] = A[p], A[i]
        for j in range(3):
            if j != i and A[j][i] != 0:
                f = A[j][i] / A[i][i]
                A[j] = [a - f * b for a, b in zip(A[j], A[i])]
    return [A[i][3] / A[i][i] for i in range(3)]

def feasible(cons):
    for tri in combinations(cons, 3):
        v = solve3(tri)
        if v is None: continue
        if all(sum(c * x for c, x in zip(cc, v)) + c0 <= 0 for cc, c0 in cons):
            return v
    return None

def system(B, r=6, d=2, G="zero", K="K", geo="free", high="H0", comp=True, box=F(4)):
    """low: B >= 1 - h/r + G + k/2, h = 1 + l - lx.
    G: zero | polar (b/(2r)) | src (also b - ly/2).
    k branches: 0; K_d = (d-1)(M+l) - 1 (dual length (QP)^d/(ZP) minus rows; d = 2 is the source);
                J = (1+3l-2M)/4; P = (3l-1)/2 (source, d = 2 only).
    high: H0 (floor class only): 1/2 - ly/2 + h(1-1/r) - (l/2 if comp) <= B ; none."""
    R = F(r); cons = []
    Gs = {"zero": [((0,0,0),0)],
          "polar": [((0,0,0),0), ((-1/(2*R), 1/(2*R), 0), 0)],
          "src": [((0,0,0),0), ((-1/(2*R), 1/(2*R), 0), 0), ((-1, F(1,2), 0), 0)]}[G]
    kall = {"0": ((0,0,0),0), "K": ((d-1, d-1, d-1), -1),
            "J": ((F(-1,2), F(-1,2), F(3,4)), F(1,4)), "P": ((0,0,F(3,2)), F(-1,2)),
            "D": ((-1,-1,1), 1),                      # Lemma 1 + family GRH: Sum = X D + O(N^{1+eps}), loss 1 + l - M
            "E": ((-1,-1,F(7,4)), F(7,4)),            # Lemma 1 + zero-free 7/8 pointwise: O(N^{7/4}), loss (7/4)(1+l) - M
            "S": ((F(-1,3),F(-1,3),F(2,3)), F(2,3))}  # Lemma 1 + sieve with frozen powerful part (ARGUED): loss (2+2l-M)/3
    for gc, g0 in Gs:
        for kk in "0" + K:
            kc, k0 = kall[kk]
            c = [1/R + gc[0] + F(kc[0])/2, gc[1] + F(kc[1])/2, -1/R + gc[2] + F(kc[2])/2]
            cons.append((c, 1 - 1/R + g0 + F(k0)/2 - B))
    if geo == "src": cons += [((-1,0,1),0), ((0,-1,1),0)]
    elif geo == "anti": cons += [((1,0,-1),0)]          # lx <= l, i.e. h >= 1
    if high == "H0":
        cons.append(([-(1 - 1/R), -F(1,2), (1 - 1/R) - (F(1,2) if comp else 0)], F(1,2) - B + (1 - 1/R)))
    for i in range(3):
        e = [0,0,0]; e[i] = -1; cons.append((tuple(e), 0))
        e = [0,0,0]; e[i] = 1; cons.append((tuple(e), -box))
    return cons

def inf_B(**kw):
    lo, hi = F(1,4), F(1)
    v = feasible(system(lo, **kw))
    if v is not None: return lo, v
    for _ in range(40):
        mid = (lo + hi) / 2
        if feasible(system(mid, **kw)) is not None: hi = mid
        else: lo = mid
    return hi, feasible(system(hi, **kw))

def show(name, guess=None, **kw):
    B, v = inf_B(**kw)
    h = 1 + v[2] - v[0]
    s = f"{name:58s} B={float(B):.7f} (lx,ly,l)=({float(v[0]):.4f},{float(v[1]):.4f},{float(v[2]):.4f}) h={float(h):.4f}"
    if B == F(1,4): s += "  [= search bound: no floor]"
    if guess is not None:
        g = F(guess)
        ok = feasible(system(g, **kw)) is not None and feasible(system(g - F(1, 10**9), **kw)) is None
        s += f"  exact {g}: {'CONFIRMED' if ok else 'NOT confirmed'}"
    print(s); sys.stdout.flush()

def identity_check(r, d, comp, trials=2000):
    """a L' + b L_K + c H0 = 1 - d/(2r(d-1)) + lam*lx identically."""

if __name__ == "__main__":
    print("c8: low-side alternatives from Lemma 1 (MODEL; same format as c7 cap_lp.py; r = 6). D = family GRH (circular), E = zero-free 7/8 pointwise, S = frozen-powerful sieve")
    show("regression 13/15: G src, k = JKP, src geometry", "13/15", G="src", K="KJP", geo="src")
    for G in ("src", "polar", "zero"):
        for geo in ("src", "free"):
            for K in ("D", "E", "S"):
                show(f"G={G:5s} geo={geo:4s} k={K} H0 comp", G=G, K=K, geo=geo, box=F(8))
    show("G=src free k=D no compensation", G="src", K="D", geo="free", comp=False, box=F(8))
    show("G=src free k=D box 16", G="src", K="D", geo="free", box=F(16))
    show("G=polar free k=D box 16", G="polar", K="D", geo="free", box=F(16))
