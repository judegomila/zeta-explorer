"""c6-pair-probe-bridge-order2: exact-rational LP for the PAIR (product-row) probe in the 7/8 estimate system.
Pair probe: I2 = Q^{-1/2} Sum_m A_m B_m(eta) B'_m(eta'), two target rows of scale Z with mark lengths l1, l2,
sharing the row variable m (length Q = XY = Z^(lx+ly)).  Constraints are typed in PAIR variables v = (lx, ly, l1, l2)
(units of log Z), not obtained by substitution; section S checks them against the single system of
../c5-target-fe-order2-ledger/tiers_fe.py at (lx/2, ly/2, (l1+l2)/2).
  frequency length after Poisson in m: modulus Y Z^(1+l1) Z^(1+l2) / (XY):   h2 = 2 + l1 + l2 - lx
  signal at a pair of zeros of real part beta:                               2 beta - 2 + lx/2 + h2/6
  per-zero signal constant (Lemma U normalisation, slope one per zero):      hp = h2/2 = 1 + (l1+l2)/2 - lx/2
  low side: lx/2 + G + k2/2, G = max(0, b/12, b - ly/2), b = ly - lx,
            k2 = max(0, l - T2/4 [J], T2 - M [K], (3l - 2)/2 [P]),  l = l1 + l2, T2 = 2M + l - 2 (product row, length 2 + l)
  => abscissa  B >= 1 - h2/12 + G/2 + k2/4
  high side (ideal, per zero): 1/2 + d/2 - B - ly/4 + hp (5/6 - d) - l/4 + amp * (l/2) d x <= 0, d in {0, 2B-1}, x = 1/2;
            amp = 1: degree-one homogeneous transplant; amp = 2: prime amplitude of the squared target doubled.
  geometry: 'pair' lx, ly >= l1 + l2 (both compensations applied: rescaled lengths X/(P1 P2), Y/(P1 P2) >= 1)
            'row'  lx, ly >= l1 and >= l2 (HYPOTHETICAL: each row compensated as if alone)
            'free' none;  'anti' lx <= l1 + l2 (hp >= 1), high side without compensation.
Vertex enumeration over the integers, exact.  MODEL: every value is the abscissa of a hypothetical estimate system."""
import sys, os
from fractions import Fraction as F
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "c5-target-fe-order2-ledger"))
import tiers_fe as T1          # solver (feasible) and the single system, read-only
feasible = T1.feasible

def lin(lx=0, ly=0, l1=0, l2=0, c=0): return ([F(lx), F(ly), F(l1), F(l2)], F(c))
def add(a, b, sb=1): return ([x + sb*y for x, y in zip(a[0], b[0])], a[1] + sb*b[1])
def sc(a, s): return ([x*F(s) for x in a[0]], a[1]*F(s))
ZERO = lin()
M_ = lin(1, 1); b_ = lin(-1, 1); L_ = lin(0, 0, 1, 1)
h2_ = lin(-1, 0, 1, 1, 2); hp_ = sc(h2_, F(1, 2))
T2_ = add(add(sc(M_, 2), L_), lin(c=-2))

def system(B, G="src", drop="", k0=False, geo="pair", high="dh", amp=1, comp=True, box=F(8), sym=False):
    cons = []
    Gs = {"src": [ZERO, sc(b_, F(1, 12)), lin(-1, F(1, 2))], "polar": [ZERO, sc(b_, F(1, 12))], "zero": [ZERO]}[G]
    d = {"J": add(L_, sc(T2_, F(1, 4)), -1), "K": add(T2_, M_, -1), "P": add(sc(L_, F(3, 2)), lin(c=-1))}
    ks = [ZERO] + ([] if k0 else [d[x] for x in "JKP" if x not in drop])
    base = add(lin(c=1), sc(h2_, F(1, 12)), -1)
    for g in Gs:
        for k in ks:
            e = add(add(base, sc(g, F(1, 2))), sc(k, F(1, 4)))
            cons.append((e[0], e[1] - B))
    if geo == "pair": cons += [lin(-1, 0, 1, 1), lin(0, -1, 1, 1)]
    elif geo == "row": cons += [lin(-1, 0, 1, 0), lin(-1, 0, 0, 1), lin(0, -1, 1, 0), lin(0, -1, 0, 1)]
    elif geo == "anti": cons += [lin(1, 0, -1, -1)]
    if sym: cons += [lin(0, 0, 1, -1), lin(0, 0, -1, 1)]
    if high in ("dh", "grh"):
        def E(dl):
            e = lin(0, F(-1, 4), 0, 0, F(1, 2) + dl/2 - B)
            if comp: e = add(e, sc(L_, F(-1, 4) + F(amp) * dl * F(1, 4)))     # -l/4 + amp (l/2) d (1/2)
            return add(e, sc(hp_, F(5, 6) - dl))
        cons.append(E(F(0)))
        if high == "dh": cons.append(E(2*B - 1))
    for i in range(4):
        e = [0]*4; e[i] = -1; cons.append((e, F(0)))
        e = [0]*4; e[i] = 1; cons.append((e, -box))
    return cons

def inf_B(lo=F(1, 4), **kw):
    hi = F(3)
    if feasible(system(hi, **kw)) is None: return None, None
    v = feasible(system(lo, **kw))
    if v is not None: return lo, v
    for _ in range(36):
        mid = (lo + hi)/2
        if feasible(system(mid, **kw)) is not None: hi = mid
        else: lo = mid
    return hi, feasible(system(hi, **kw))

def show(name, guess=None, **kw):
    B, v = inf_B(**kw)
    if B is None: print(f"{name:66s} infeasible"); return
    hp = 1 + (v[2] + v[3])/2 - v[0]/2
    s = (f"{name:66s} B={float(B):.7f} lx={float(v[0]):.4f} ly={float(v[1]):.4f} l1={float(v[2]):.4f} l2={float(v[3]):.4f} hp={float(hp):.4f}")
    if guess is not None:
        g = F(guess)
        ok = feasible(system(g, **kw)) is not None and feasible(system(g - F(1, 10**9), **kw)) is None
        s += f"  exact {g}: {'CONFIRMED' if ok else 'NOT confirmed'}"
    print(s); sys.stdout.flush()

if __name__ == "__main__":
    print("== S. homogeneity check: pair system at (lx, ly, l1, l2) vs single system at (lx/2, ly/2, (l1+l2)/2), w = 0")
    import random
    random.seed(7); bad = 0; n = 0
    for _ in range(4000):
        v = [F(random.randint(0, 40), 10) for _ in range(4)]
        B = F(random.randint(50, 110), 100)
        for G in ("src", "polar", "zero"):
            for drop in ("", "K", "KP"):
                p = system(B, G=G, drop=drop, geo="free", high="dh", amp=1, box=F(100))
                okp = all(sum(c*x for c, x in zip(cc, v)) + c0 <= 0 for cc, c0 in p)
                w = [v[0]/2, v[1]/2, (v[2] + v[3])/2, F(0)]
                s = T1.system(B, "refl", G=G, geo="free", high="dh", box=F(100), wfix=F(0), drop=drop)
                oks = all(sum(c*x for c, x in zip(cc, w)) + c0 <= 0 for cc, c0 in s)
                n += 1; bad += (okp != oks)
    print(f"   {n} random (point, B, G, drop) membership comparisons, mismatches: {bad}")
    print("== P. pair geometry lx, ly >= l1 + l2 (both compensations), ideal high side")
    show("P1 full ledger (G src, k src)", "13/15")
    show("P2 full ledger, amplitude doubled", "13/15", amp=2)
    show("P3 K removed", "31/36", drop="K")
    show("P4 k = 0", "5/6", k0=True)
    show("P5 k = 0, G = 0", "5/6", k0=True, G="zero")
    show("P6 k = 0, G = 0, amplitude doubled", k0=True, G="zero", amp=2)
    show("P7 k = 0, G = 0, GRH counts", "5/6", k0=True, G="zero", high="grh")
    print("== R. HYPOTHETICAL row geometry lx, ly >= max(l1, l2): the only place hp > 1 can occur with compensation")
    show("R1 full ledger", geo="row")
    show("R2 full ledger, amplitude doubled", amp=2, geo="row")
    show("R3 full ledger, G polar", G="polar", geo="row")
    show("R4 K removed", drop="K", geo="row")
    show("R5 K removed, G polar", drop="K", G="polar", geo="row")
    show("R6 K, P removed, G polar", drop="KP", G="polar", geo="row")
    show("R7 k = 0, G src", k0=True, geo="row")
    show("R8 k = 0, G polar", k0=True, G="polar", geo="row")
    show("R9 k = 0, G = 0", k0=True, G="zero", geo="row")
    show("R9' k = 0, G = 0, amplitude doubled", k0=True, G="zero", amp=2, geo="row")
    show("R10 k = 0, G = 0, low side only", k0=True, G="zero", high="none", geo="row")
    show("R11 full ledger, l1 = l2", sym=True, geo="row")
    show("R12 k = 0, G = 0, l1 = l2", k0=True, G="zero", sym=True, geo="row")
    for bx in (2, 4, 16):
        show(f"R13 k = 0, G = 0, box {bx}", k0=True, G="zero", geo="row", box=F(bx))
        show(f"R14 full ledger, box {bx}", geo="row", box=F(bx))
    show("R15 K removed, G zero", drop="K", G="zero", geo="row")
    show("R16 full ledger, GRH counts", geo="row", high="grh")
    show("R17 k = 0, G = 0, uncompensated high side", k0=True, G="zero", geo="row", comp=False)
    show("R18 full ledger, uncompensated high side", geo="row", comp=False)
    print("== F. free geometry / anti geometry")
    show("F1 free, full ledger", geo="free")
    show("F2 free, full ledger, G polar", geo="free", G="polar")
    show("F3 anti (lx <= l1+l2), no compensation, full ledger", geo="anti", comp=False)
    show("F4 anti, no compensation, G polar", geo="anti", comp=False, G="polar")
    show("F5 anti, no compensation, K removed, G zero", geo="anti", comp=False, drop="K", G="zero")
