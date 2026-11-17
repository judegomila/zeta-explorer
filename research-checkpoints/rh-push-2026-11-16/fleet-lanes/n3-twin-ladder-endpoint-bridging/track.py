"""Track the right member of each FE pair of zeros of F(w,.) from w=0 until it collides with its partner
on Re s = w/2; refine the collision (double zero of H(w,.)) by 2D Newton. Output JSON lines."""
import sys, json, time, math
from zf import *
from flint import acb, arb, ctx
import mpmath
WMAX = 1.3
def newton_s(Z, w, s, tol_exp=-250, maxit=40):
    for it in range(maxit):
        f, d = Z.F(w, s, True)
        ds = f/d
        s = acb(s.real.mid(), s.imag.mid()) - acb(ds.real.mid(), ds.imag.mid())
        a = abs(ds)
        if a < arb(2)**tol_exp:
            return s, True
        if not (a < 5): return s, False
    return s, False
def fH(Z, w, t):
    h, hd = Z.H(w, t, True)
    sc = (arb.pi()*t/4).exp()
    return h*sc, hd*sc
def collide(Z, w, t, maxit=25):
    """solve H=0, H_t=0 in (w,t). returns (w,t,ok,resid)"""
    w = arb(w); t = arb(t); e = arb(10)**(-30)
    for it in range(maxit):
        f1, f2 = fH(Z, w, t)
        a1, a2 = fH(Z, w, t+e); b1, b2 = fH(Z, w, t-e)
        c1, c2 = fH(Z, w+e, t); d1, d2 = fH(Z, w-e, t)
        j11 = (c1-d1)/(2*e); j12 = (a1-b1)/(2*e); j21 = (c2-d2)/(2*e); j22 = (a2-b2)/(2*e)
        det = j11*j22 - j12*j21
        dw = (f1*j22 - f2*j12)/det; dt = (j11*f2 - j21*f1)/det
        w = arb((w-dw).mid()); t = arb((t-dt).mid())
        sz = abs(dw)+abs(dt)
        if not (sz < 1): return w, t, False, None
        if sz < arb(10)**(-75):
            f1, f2 = fH(Z, w, t)
            return w, t, True, (float(abs(f1).upper()), float(abs(f2).upper()))
    return w, t, False, None
def track(Z, s0, label, dw0=0.01, w_start=0.0):
    w = w_start; s = acb(s0); s, ok = newton_s(Z, w, s); assert ok, label
    path = [(w, float(s.real), float(s.imag))]
    dw = dw0; prev = None  # (w, s)
    nfail = 0
    while w < WMAX:
        wn = round(w + dw, 10)
        if prev is None: pred = s
        else: pred = s + (s - prev[1])*((wn-w)/(w-prev[0]))
        sn, ok = newton_s(Z, wn, pred)
        dn = float(sn.real) - wn/2 if ok else None
        good = ok and dn > 1e-12 and float(abs(sn-pred)) < 0.25 + 0*dw
        # collision test using d^2 extrapolation
        d = float(s.real) - w/2
        if good and dn < d:
            wstar = wn + dn*dn*(wn-w)/(d*d-dn*dn)
            if wstar - wn < 1.5*dw and dn < 0.3:
                wk, tk, okc, res = collide(Z, wstar, float(sn.imag))
                if okc and abs(float(wk)-wstar) < 5*dw and abs(float(tk)-float(sn.imag)) < 1.0 and float(wk) > wn - 1e-9:
                    path.append((wn, float(sn.real), float(sn.imag)))
                    return {"label": label, "s0": [float(acb(s0).real), float(acb(s0).imag)], "collided": True,
                            "wk": wk.str(70, radius=False), "tk": tk.str(70, radius=False), "resid": res, "path": path}
        if good:
            prev = (w, s); w = wn; s = sn; path.append((w, float(s.real), float(s.imag)))
            if dw < dw0: dw = min(dw0, dw*1.5)
            nfail = 0
        else:
            dw /= 2; nfail += 1
            if dw < 1e-7:
                return {"label": label, "s0": [float(acb(s0).real), float(acb(s0).imag)], "collided": False, "stuck_at": w,
                        "path": path}
    return {"label": label, "s0": [float(acb(s0).real), float(acb(s0).imag)], "collided": False, "reached": w, "path": path}
if __name__ == "__main__":
    i0, i1, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
    mpmath.mp.dps = 125
    starts = []
    k = 1
    while True:
        g = mpmath.zetazero(k).imag
        if 2*g > 235: break
        starts.append((float(2*g), "L%d" % k, acb(1, arb(mpmath.nstr(2*g, 120))))); k += 1
    k = 1
    while True:
        h = 4*arb.pi()*k/arb(2).log()
        if float(h) > 235: break
        starts.append((float(h), "A%d" % k, acb(2, h))); k += 1
    starts.sort()
    print("pairs:", len(starts), flush=True)
    Z = ZF()
    with open(out, "a") as f:
        for idx in range(i0, min(i1, len(starts))):
            h0, lab, s0 = starts[idx]; t0 = time.time()
            r = track(Z, s0, lab); r["idx"] = idx
            f.write(json.dumps(r)+"\n"); f.flush()
            print(idx, lab, round(h0,3), r.get("collided"), r.get("wk","")[:22], r.get("tk","")[:14], r.get("resid"), len(r["path"]), round(time.time()-t0,1), flush=True)
