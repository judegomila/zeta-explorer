"""c7-uncompensated-high-side-normaliser: exact rational LP (vertex enumeration, stdlib) for the reduced 7/8
estimate system with
  (a) the DERIVED uncompensated high side: slot amplitude l(z0 - 1/2) + l*delta/2 (RESULT section 2), which in the
      ideal model is E(delta, x = 1/2) of r3 (flag comp=True), in place of r3's guess H0' = H0 + l/2 (comp=False);
  (b) the necessity constraint for the row energy (RESULT section 3, Lemma C):
          max(k, 1 + l - M) >= ksig(beta0) = (2 + 2l - M)/6 - 2(1 - beta0),
      imposed as a disjunction over the branches of k; beta0 = 1/2 is unconditional (zeros on the line exist);
  (c) the normaliser floors: zero-free reading only for B >= 2/3; (2.2) false below 7/12; slot term below 3/5.
tiers_fe_copy.py is ../c5-target-fe-order2-ledger/tiers_fe.py unchanged. MODEL: values are abscissae of a
hypothetical estimate system, not bounds on zeros."""
from tiers_fe_copy import *

def ksig(beta0):
    return lin(F(-1, 6), F(-1, 6), F(1, 3), 0, F(1, 3) - 2 * (1 - F(beta0)))

def systems(B, row, nec=None, hmin=None, lmax=None, bmax=None, **kw):
    drop = kw.get("drop", "")
    base = system(B, row, **kw)
    extra = []
    if hmin is not None: extra.append(add(lin(0, 0, 0, 0, hmin), h_, -1))          # h >= hmin
    if lmax is not None: extra.append(lin(0, 0, 1, 0, -lmax))                      # l <= lmax
    if bmax is not None: extra.append(add(b_, lin(0, 0, 0, 0, bmax), -1))          # b <= bmax
    if nec is None or row == "empty":
        return [base + extra]
    out = []
    for kj in kbranches(row, drop) + [add(lin(0, 0, 1, 0, 1), M_, -1)]:
        out.append(base + extra + [add(ksig(nec), kj, -1)])                        # ksig - k_j <= 0
    return out

def feas2(B, rows, **kw):
    for row in rows:
        for cons in systems(B, row, **kw):
            v = feasible(cons)
            if v is not None: return row, v
    return None

def infB(rows, lo=F(1, 4), **kw):
    hi = F(3)
    if feas2(hi, rows, **kw) is None: return None, None
    f = feas2(lo, rows, **kw)
    if f is not None: return lo, f
    for _ in range(34):
        mid = (lo + hi) / 2
        if feas2(mid, rows, **kw) is not None: hi = mid
        else: lo = mid
    return hi, feas2(hi, rows, **kw)

def fmt(v):
    lx, ly, l = v[0], v[1], v[2]
    return (f"lx={float(lx):.4f} ly={float(ly):.4f} l={float(l):.4f} h={float(1-lx+l):.4f} "
            f"hE={float(1+l-(lx+ly)/2):.4f} M-(1+l)={float(lx+ly-1-l):+.4f}")

def show2(name, rows, guess=None, **kw):
    B, f = infB(rows, **kw)
    if B is None:
        print(f"{name:66s} infeasible for every B <= 3"); sys.stdout.flush(); return
    row, v = f
    s = f"{name:66s} B={float(B):.7f} row={row:5s} {fmt(v)}"
    if B == F(1, 4): s += "  [= search bound]"
    if guess is not None:
        g = F(guess)
        ok = feas2(g, rows, **kw) is not None and feas2(g - F(1, 10**9), rows, **kw) is None
        s += f"  exact {g}: {'CONFIRMED' if ok else 'NOT confirmed'}"
    print(s); sys.stdout.flush()

def maxh(B, rows, hi=F(40), **kw):
    if feas2(B, rows, **kw) is None: return None
    lo = F(0)
    if feas2(B, rows, hmin=hi, **kw) is not None: return hi
    for _ in range(30):
        mid = (lo + hi) / 2
        if feas2(B, rows, hmin=mid, **kw) is not None: lo = mid
        else: hi = mid
    return lo

def minl(B, rows, **kw):
    if feas2(B, rows, **kw) is None: return None, None
    lo, hi = F(0), F(kw.get("box", F(8)))
    for _ in range(30):
        mid = (lo + hi) / 2
        if feas2(B, rows, lmax=mid, **kw) is not None: hi = mid
        else: lo = mid
    return hi, feas2(B, rows, lmax=hi, **kw)

if __name__ == "__main__":
    W0 = dict(wfix=F(0))
    print("== P1. regression against c5 tiers_fe2.log (r3 guess for the uncompensated high side, comp=False)")
    show2("P1a Y2 refl|dir|empty, polar, lx<=l, guess high side", ["refl", "dir", "empty"], geo="anti", box=F(8), comp=False, G="polar")
    show2("P1b Y3 dir0, polar, lx<=l, guess high side, box 8", ["dir0"], geo="anti", box=F(8), comp=False, G="polar")
    print("== P2. derived uncompensated high side (E(0), E(2B-1, 1/2)), lx <= l, w = 0, box 8")
    show2("P2a refl (Liu II 2.4), G src", ["refl"], geo="anti", box=F(8), **W0)
    show2("P2b refl, G polar", ["refl"], geo="anti", box=F(8), G="polar", **W0)
    show2("P2c refl | dir (proved rows), G polar", ["refl", "dir"], geo="anti", box=F(8), G="polar", **W0)
    show2("P2d dir (Lemma 9.1), G polar", ["dir"], "1", geo="anti", box=F(8), G="polar", **W0)
    show2("P2e dir0 (K + D), G polar", ["dir0"], geo="anti", box=F(8), G="polar", **W0)
    show2("P2f dir0, G polar, box 16", ["dir0"], geo="anti", box=F(16), G="polar", **W0)
    show2("P2g k0, G polar", ["k0"], geo="anti", box=F(8), G="polar", **W0)
    show2("P2h refl, K removed, G polar", ["refl"], geo="anti", box=F(8), G="polar", drop="K", **W0)
    show2("P2i refl, K and P removed, G polar", ["refl"], geo="anti", box=F(8), G="polar", drop="KP", **W0)
    show2("P2j refl, strict h > 1 (h >= 11/10), G polar", ["refl"], geo="anti", box=F(8), G="polar", hmin=F(11, 10), **W0)
    show2("P2k refl, h >= 2, G polar", ["refl"], geo="anti", box=F(8), G="polar", hmin=F(2), **W0)
    print("== P3. same with the energy necessity at beta0 = 1/2 (decisive test)")
    for box in (8, 16):
        show2(f"P3a dir0, G polar, box {box}", ["dir0"], "1/2", geo="anti", box=F(box), G="polar", nec=F(1, 2), **W0)
    show2("P3b k0, G polar", ["k0"], "1/2", geo="anti", box=F(8), G="polar", nec=F(1, 2), **W0)
    show2("P3c dir0, G = 0", ["dir0"], "1/2", geo="anti", box=F(8), G="zero", nec=F(1, 2), **W0)
    show2("P3d refl, K and P removed, G polar", ["refl"], geo="anti", box=F(8), G="polar", drop="KP", nec=F(1, 2), **W0)
    show2("P3e refl, K removed, G polar", ["refl"], geo="anti", box=F(8), G="polar", drop="K", nec=F(1, 2), **W0)
    show2("P3f refl | dir | dir0, G polar, free geometry", ["refl", "dir", "dir0"], "1/2", geo="free", box=F(8), G="polar", nec=F(1, 2), **W0)
    show2("P3g dir0, G polar, guess high side (comp=False)", ["dir0"], "1/2", geo="anti", box=F(8), G="polar", nec=F(1, 2), comp=False, **W0)
    print("== P3'. necessity at beta0 = B (self-consistent reading: the abscissa of the system is beta*)")
    for Bq in ["1/2", "7/12", "3/5", "2/3", "3/4", "5/6"]:
        Bv = F(Bq)
        f = feas2(Bv, ["dir0"], geo="anti", box=F(8), G="polar", nec=Bv, **W0)
        f2 = feas2(Bv - F(1, 10**6), ["dir0"], geo="anti", box=F(8), G="polar", nec=Bv, **W0)
        print(f"P3' dir0, nec at beta0 = B = {Bq:5s}: feasible at B: {f is not None}; at B - 1e-6 with nec(B): {f2 is not None}"
              + (f"   {fmt(f[1])}" if f else ""))
    print("== P4. normaliser floors: dir0 + necessity(1/2), G polar, lx <= l, b <= 1: max h and min l at fixed B")
    for Bq, note in [("5/6", "h = 1 line"), ("3/4", ""), ("2/3", "H_eta: zero-free reading stops here (h_eff = 2)"),
                     ("3/5", "slot term a_p^2 Q^(3-5s), slots <= 1/5"), ("7/12", "(2.2) false below"), ("1/2", "h_eff = 3")]:
        Bv = F(Bq)
        kw = dict(geo="anti", box=F(8), G="polar", nec=F(1, 2), **W0)
        mh = maxh(Bv, ["dir0"], bmax=F(0), **kw)
        mh1 = maxh(Bv, ["dir0"], bmax=F(1), **kw)
        ml, f = minl(Bv, ["dir0"], **kw)
        print(f"P4 B = {Bq:5s} max h (b <= 0) = {float(mh):.4f}; max h (b <= 1) = {float(mh1):.4f}; 6(1-B) = {float(6*(1-Bv)):.4f}; "
              f"min l = {float(ml):.4f} at {fmt(f[1])}   {note}")
    print("== P5. cone (t, t, 2t - 1): B_low = 1 - t/6, derived high side values")
    for t in ["6/5", "3/2", "2", "12/5", "5/2", "3", "7/2"]:
        t = F(t); l = 2 * t - 1; h = 1 - t + l; B = 1 - h / 6
        H0 = F(1, 2) - t / 2 + 5 * h / 6 - l / 2
        dl = 2 * B - 1
        E1 = F(1, 2) + dl / 2 - B - t / 2 + h * (F(5, 6) - dl) - l / 2 + l * dl / 2
        ks = (2 + 2 * l - 2 * t) / 6 - 1
        print(f"P5 t = {str(t):4s} l = {str(l):5s} h = hE = {str(h):4s} B_low = {str(B):5s} H0 = {str(H0):6s} E(2B-1,1/2) = {str(E1):6s} "
              f"ksig(1/2) = {str(ks):5s} dir0 consistent with zeros on the line: {ks <= 0}")
