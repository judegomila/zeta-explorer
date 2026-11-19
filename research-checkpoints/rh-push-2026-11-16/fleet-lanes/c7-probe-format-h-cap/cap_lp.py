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
            "J": ((F(-1,2), F(-1,2), F(3,4)), F(1,4)), "P": ((0,0,F(3,2)), F(-1,2))}
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
    R = F(r)
    c = 1/R if comp else F(2)/(3*R)   # comp=False weights derived for d = 2 only
    if comp:
        b = 1/(R*(d-1)); a = 1 - b - c; lam = 1/(2*R); const = 1 - F(d)/(2*R*(d-1))
    else:
        assert d == 2
        b = F(2)/(3*R); a = 1 - b - c; lam = F(2)/(3*R); const = 1 - 1/R
    assert a >= 0 and b >= 0 and c >= 0
    rnd = random.Random(7)
    for _ in range(trials):
        lx, ly, l = (F(rnd.randint(-400, 400), rnd.randint(1, 60)) for _ in range(3))
        h = 1 + l - lx
        Lp = 1 - h/R
        LK = Lp + ((d-1)*(lx+ly+l) - 1)/2
        H0 = F(1,2) - ly/2 + h*(1 - 1/R) - (l/2 if comp else 0)
        if a*Lp + b*LK + c*H0 != const + lam*lx: return False, None
    return True, (a, b, c, lam, const)

if __name__ == "__main__":
    print("== I. identity  a L' + b L_K + c H0 = cap + lam lx  (2000 random rational points each)")
    for r in (2, 3, 4, 5, 6, 8, 12):
        for d in (2, 3, 4):
            ok, w = identity_check(r, d, True)
            print(f"r={r} d={d} comp : {ok}  (a,b,c)=({w[0]},{w[1]},{w[2]}) lam={w[3]} cap={w[4]}")
        ok, w = identity_check(r, 2, False)
        print(f"r={r} d=2 nocomp: {ok}  (a,b,c)=({w[0]},{w[1]},{w[2]}) lam={w[3]} cap={w[4]}")
    print("== II. regression against the three known systems (source geometry, r = 6)")
    show("13/15: G src, k = JKP", "13/15", G="src", K="KJP", geo="src")
    show("31/36: G src, k = JP (K removed)", "31/36", G="src", K="JP", geo="src")
    show("5/6  : G src, k = 0", "5/6", G="src", K="", geo="src")
    print("== III. CAP-K in FREE geometry (no lx >= l): G = 0, k = K only, floor class H0")
    for bx in (4, 8, 16):
        show(f"r=6 comp, box {bx}", "5/6", box=F(bx))
        show(f"r=6 no compensation, box {bx}", "5/6", comp=False, box=F(bx))
    for r in (2, 3, 4, 5, 8, 12):
        show(f"r={r} comp, box 8", str(F(r-1, r)), r=r, box=F(8))
    print("== IV. region lx <= l (h >= 1) only: same three inputs")
    for bx in (4, 16):
        show(f"r=6 anti, comp, box {bx}", "5/6", geo="anti", box=F(bx))
        show(f"r=6 anti, no comp, box {bx}", "5/6", geo="anti", comp=False, box=F(bx))
    show("r=6 anti, comp, G polar, k = K", geo="anti", G="polar", box=F(8))
    show("r=6 anti, comp, G src, k = JKP", geo="anti", G="src", K="KJP", box=F(8))
    print("== V. which input is necessary (free geometry, r = 6, G = 0, box 8 and 16)")
    for bx in (8, 16):
        show(f"K removed (k = 0), H0 kept, box {bx}", K="", box=F(bx))
        show(f"K removed, J and P kept, H0 kept, box {bx}", K="JP", box=F(bx))
        show(f"K kept, H0 removed, box {bx}", high="none", box=F(bx))
        show(f"K kept, H0 kept, no compensation, box {bx}", comp=False, box=F(bx))
    print("== VI. degree d of the row functional equation (dual length (QP)^d/(ZP)), free geometry, box 8")
    for r in (2, 3, 6):
        for d in (2, 3, 4):
            show(f"r={r} d={d}", str(1 - F(d, 2*r*(d-1))), r=r, d=d, box=F(8))
    print("== VII. the three known systems against the cap 5/6 + lx/12 (r = 6, d = 2)")
    for nm, (lx, ly, l), val in (("13/15", (F(2,5),F(2,5),F(1,5)), F(13,15)),
                                 ("31/36 (K removed)", (F(1,2),F(1,2),F(1,3)), F(31,36)),
                                 ("5/6 (k = 0)", (F(1,2),F(1,2),F(1,2)), F(5,6)),
                                 ("manuscript 7/8", (F(17,48),F(23,48),F(1,6)), F(7,8))):
        h = 1 + l - lx; cap = F(5,6) + lx/12
        print(f"{nm:20s} (lx,ly,l)=({lx},{ly},{l}) h={h} M+l={lx+ly+l} value={val} cap5/6+lx/12={cap} value>=cap: {val >= cap}")
