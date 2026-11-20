"""c5-target-fe-order2-ledger: exact-rational LP for the 7/8 estimate system with the reflection ledger.
Extends ../r3-method-limit/tiers.py (same low/high formulas, re-typed) by
  w   = c*tau, tau = log t / log Z (height of the target twist; c = 4 for the theta gamma factor R(t)),
  row = which side of the row functional equation bounds the row energy:
        'refl'  reflected energy, Liu II Lemma 2.4 with dual length T = 2M + l - 1 + w:
                k = max(0, l - T/4 [J], T - M [K], (3l-1)/2 [P])
        'dir'   unreflected sextic large sieve (manuscript Lemma 9.1, rows Z^M, columns Z^(1+l)):
                k = max(0, 1 + l - M, (2 + 2l - M)/3)
        'dir0'  unreflected, hypothetical optimal large sieve: k = max(0, 1 + l - M)
        'empty' dual range empty, T <= 0: no low constraint at all (row negligible)
  A run takes a list of row branches; the system is feasible if one branch is (the estimate may choose).
Variables v = (lx, ly, l, w). Constraint (c, c0) means c.v + c0 <= 0. Vertex enumeration over integers
(Bareiss/Cramer), exact. MODEL: every value is the abscissa of a hypothetical estimate system, not a bound on zeros."""
from fractions import Fraction as F
from itertools import combinations
from math import lcm
import sys

N = 4

def det(m):
    n = len(m)
    if n == 1: return m[0][0]
    if n == 2: return m[0][0]*m[1][1] - m[0][1]*m[1][0]
    s = 0
    for j in range(n):
        if m[0][j] == 0: continue
        minor = [row[:j] + row[j+1:] for row in m[1:]]
        s += (-1)**j * m[0][j] * det(minor)
    return s

def intify(cons):
    out = []
    for c, c0 in cons:
        vals = [F(x) for x in c] + [F(c0)]
        L = 1
        for x in vals: L = lcm(L, x.denominator)
        out.append([int(x * L) for x in vals])
    return out

def feasible(cons):
    """returns a rational vertex satisfying all constraints, or None (the region is bounded by the box)."""
    I = intify(cons)
    for combo in combinations(range(len(I)), N):
        A = [I[i][:N] for i in combo]
        D = det(A)
        if D == 0: continue
        rhs = [-I[i][N] for i in combo]
        num = []
        for j in range(N):
            Aj = [row[:j] + [rhs[r]] + row[j+1:] for r, row in enumerate(A)]
            num.append(det(Aj))
        sg = 1 if D > 0 else -1
        ok = True
        for row in I:
            if sg * (sum(row[j] * num[j] for j in range(N)) + row[N] * D) > 0:
                ok = False; break
        if ok: return [F(num[j], D) for j in range(N)]
    return None

def lin(lx=0, ly=0, l=0, w=0, c=0):
    return ([F(lx), F(ly), F(l), F(w)], F(c))
def add(a, b, sb=1):
    return ([x + sb * y for x, y in zip(a[0], b[0])], a[1] + sb * b[1])
def scale(a, s):
    return ([x * s for x in a[0]], a[1] * s)

M_ = lin(1, 1); b_ = lin(-1, 1); h_ = lin(-1, 0, 1, 0, 1)
T_ = lin(2, 2, 1, 1, -1)                      # dual length 2M + l - 1 + w
ZERO = lin()

def kbranches(row, drop=""):
    if row == "refl":
        d = {"J": add(lin(0, 0, 1), scale(T_, F(1, 4)), -1), "K": add(T_, M_, -1), "P": lin(0, 0, F(3, 2), 0, F(-1, 2))}
        return [ZERO] + [d[x] for x in "JKP" if x not in drop]
    if row == "dir":
        return [ZERO, add(lin(0, 0, 1, 0, 1), M_, -1), scale(add(lin(0, 0, 2, 0, 2), M_, -1), F(1, 3))]
    if row == "dir0":
        return [ZERO, add(lin(0, 0, 1, 0, 1), M_, -1)]
    if row == "k0":
        return [ZERO]
    raise ValueError(row)

def system(B, row, r=6, G="src", geo="src", high="dh", box=F(4), wmax=F(8), wfix=None, drop="", hmode="true", comp=True):
    """hmode 'true': h = 1 - lx + l (signal exponent of the probe; Lemma U).
       hmode 'naive': h replaced by hhat = lx + 2 ly + l - 1 + w (frequency length of a Poisson step applied to the
       reflected row; NOT a signal exponent, kept to show what the excluded bookkeeping would return)."""
    R = F(r); cons = []
    hh = h_ if hmode == "true" else lin(1, 2, 1, 1, -1)
    base = add(lin(0, 0, 0, 0, 1), scale(hh, 1 / R), -1)            # 1 - h/r
    Gs = {"src": [ZERO, scale(b_, 1 / (2 * R)), lin(-1, F(1, 2))], "polar": [ZERO, scale(b_, 1 / (2 * R))], "zero": [ZERO]}[G]
    if row == "empty":
        cons.append(T_)                                              # T <= 0
    else:
        for g in Gs:
            for k in kbranches(row, drop):
                e = add(add(base, g), scale(k, F(1, 2)))
                cons.append((e[0], e[1] - B))
    if geo == "src": cons += [lin(-1, 0, 1), lin(0, -1, 1)]
    elif geo == "Q": cons += [lin(-1, -1, 2)]
    elif geo == "anti": cons += [lin(1, 0, -1)]                      # lx <= l: marks at least as long as the X-range
    if hmode == "naive": cons.append(scale(hh, -1))                   # hhat >= 0
    if high in ("dh", "grh"):
        def E(dl, x):
            e = lin(0, F(-1, 2), (F(-1, 2) + dl * x) if comp else 0, 0, F(1, 2) + dl / 2 - B)
            return add(e, scale(hh, 1 - 1 / R - dl))
        cons.append(E(F(0), F(0)))
        if high == "dh": cons.append(E(2 * B - 1, F(1, 2)))
    for i in range(3):
        e = [0] * N; e[i] = -1; cons.append((e, F(0)))
        e = [0] * N; e[i] = 1; cons.append((e, -box))
    if wfix is None:
        cons += [lin(0, 0, 0, -1), lin(0, 0, 0, 1, -wmax)]
    else:
        cons += [lin(0, 0, 0, -1, wfix), lin(0, 0, 0, 1, -wfix)]
    return cons

def feas(B, rows, **kw):
    for row in rows:
        v = feasible(system(B, row, **kw))
        if v is not None: return row, v
    return None

def inf_B(rows, lo=F(1, 4), **kw):
    hi = F(3)
    if feas(hi, rows, **kw) is None: return None, ("none", [F(0)] * N)
    f = feas(lo, rows, **kw)
    if f is not None: return lo, f
    for _ in range(36):
        mid = (lo + hi) / 2
        if feas(mid, rows, **kw) is not None: hi = mid
        else: lo = mid
    return hi, feas(hi, rows, **kw)

def show(name, rows, guess=None, **kw):
    B, (row, v) = inf_B(rows, **kw)
    if B is None:
        print(f"{name:58s} infeasible for every B <= 3"); sys.stdout.flush(); return None
    hval = 1 - v[0] + v[2]
    s = (f"{name:58s} B={float(B):.7f} row={row:5s} lx={float(v[0]):.4f} ly={float(v[1]):.4f} l={float(v[2]):.4f} "
         f"w={float(v[3]):.4f} h={float(hval):.4f}")
    if guess is not None:
        g = F(guess)
        ok = feas(g, rows, **kw) is not None and feas(g - F(1, 10**9), rows, **kw) is None
        s += f"  exact {g}: {'CONFIRMED' if ok else 'NOT confirmed'}"
    print(s); sys.stdout.flush()
    return B

if __name__ == "__main__":
    ALL = ["refl", "dir", "empty"]
    print("== A. regression against r3-method-limit/tiers.log (w = 0, reflected row only)")
    show("A1 source system (T1)", ["refl"], "13/15", wfix=F(0))
    show("A2 K removed (T2b)", ["refl"], "31/36", wfix=F(0), drop="K")
    show("A3 K, J removed (T2g)", ["refl"], "23/27", wfix=F(0), drop="KJ")
    show("A4 k = 0 (T3)", ["k0"], "5/6", wfix=F(0))
    show("A5 free geometry, K only (F5)", ["refl"], "13/15", wfix=F(0), drop="JP", G="polar", geo="free", box=F(8))
    print("== B. reflection ledger, source geometry lx, ly >= l, ideal high side; w free in [0, 8]")
    show("B1 refl, w free", ["refl"], "13/15")
    show("B2 refl | dir | empty, w free", ALL, "13/15")
    show("B3 dir only (no row reflection: THIN / sign-twist control)", ["dir"], wfix=F(0))
    show("B3  dir only, box 8", ["dir"], wfix=F(0), box=F(8))
    show("B3' dir0 only (optimal unreflected sieve)", ["dir0"], wfix=F(0))
    show("B4 empty only (dual range empty)", ["empty"])
    show("B5 refl, K removed, w free", ["refl"], drop="K")
    show("B6 refl | dir0 | empty, G = 0, w free", ["refl", "dir0", "empty"], G="zero")
    show("B7 k = 0 | empty, G = 0, w free", ["k0", "empty"], "5/6", G="zero")
    print("== C. tau-dependence of the source system (refl | dir | empty), source geometry: B as a function of w")
    for w in ["0", "1/20", "1/10", "1/5", "2/5", "1", "2", "4"]:
        show(f"C  w = {w}", ALL, wfix=F(w))
    print("== C'. same, reflected row only")
    for w in ["0", "1/10", "1/5", "2/5", "1", "2"]:
        show(f"C' w = {w}", ["refl"], wfix=F(w))
    print("== D. geometry relaxed (M >= 2l, and free), reflection ledger, w free")
    show("D1 geo Q, refl | dir | empty, G src", ALL, geo="Q")
    show("D2 geo free, refl | dir | empty, G src, box 4", ALL, geo="free")
    show("D3 geo free, refl | dir | empty, G src, box 8", ALL, geo="free", box=F(8))
    show("D4 geo free, refl | dir0 | empty, G polar, box 8", ["refl", "dir0", "empty"], geo="free", G="polar", box=F(8))
    show("D5 geo free, dir0 | empty, G = 0, box 8", ["dir0", "empty"], geo="free", G="zero", box=F(8))
    show("D6 geo free, empty only", ["empty"], "11/12", geo="free")
    print("== E. other orders r (transplant), source geometry, reflection ledger, w free")
    for r in (3, 4, 6):
        show(f"E  r={r} refl | dir | empty", ALL, r=r)
        show(f"E  r={r} k = 0 | empty, G polar: expect 1 - 1/r", ["k0", "empty"], str(F(r - 1, r)), r=r, G="polar")
    print("== N. naive ledger (h replaced by hhat = lx + 2ly + l - 1 + w): excluded by Lemma U; for the record")
    for w in ["0", "1/2", "1", "2", "4"]:
        show(f"N1 low side only, k = 0, G = 0, source geo, w = {w}", ["k0"], wfix=F(w), G="zero", high="none", hmode="naive")
    for w in ["0", "1/2", "1", "2"]:
        show(f"N2 with ideal high side at hhat, refl, G src, w = {w}", ["refl"], wfix=F(w), hmode="naive")
