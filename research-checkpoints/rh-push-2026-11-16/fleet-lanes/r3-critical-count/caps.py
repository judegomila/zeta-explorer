"""r3-critical-count: price of the prime-slot costs c1 (M1: r + c1 z < 1, source c1 = 2) and c2 (M2: 2m + c2 z < 1,
source c2 = 6 kappa) and of the long-inverse slope s (source 5/6) in the detector min-max of Liu II (13.14)-(13.16)
and in the balanced scalar system (14.8).  MODEL: no c1 < 2, c2 < 6 kappa or s < 5/6 is proved.
Count at class (delta, x):  min over t in [1,3/2] of max over admissible (r, m) of min(M1, M2), with
  M1(r) = 1 - d r - 2 d x (1-r)/c1 (r <= 1),  1 + s (r-1) - d r (r >= 1);   M2(m) = 1 - 2 d m - 2 d x (1-2m)/c2.
System: LP in (b, l) at fixed kappa, fixed point kappa = max(13/18, 2B-1); E from r2-zf-critical-density/gates.py
(refereed there against B_flat at tau = 0).  Float, numpy/scipy."""
import numpy as np, sys
from scipy.optimize import linprog
KF = 0.74977329407992826; DC = 0.46934485869814

def Rk(d, x, k):
    ck = 1/(3*k); D = 3 - (1+2*ck)*x; P = (2-2*ck*x)*(1-x); J = (5/6-d)*D + d*P
    return 1 - d + (5/6-d)*d*P/(2*J)

def count(d, x, k, c1=2.0, c2=None, s=5/6, nt=501, nr=1501, extra=None):
    """d, x arrays (broadcast); returns min-max count.  extra(r, m, d, x) = optional further option."""
    c2 = 6*k if c2 is None else c2
    d = np.asarray(d, float); x = np.asarray(x, float)
    best = np.full(np.broadcast(d, x).shape, 9.0)
    for t in np.linspace(1, 1.5, nt):
        r = np.linspace(t-0.5, t, nr).reshape((-1,) + (1,)*best.ndim); m = t - r
        inv = np.where(r <= 1, 1 - d*r - 2*d*x*(1-np.minimum(r, 1))/c1, 1 + s*(r-1) - d*r)
        pl = 1 - 2*d*m - 2*d*x*(1-2*m)/c2
        c = np.minimum(inv, pl)
        if extra is not None: c = np.minimum(c, extra(r, m, d, x))
        best = np.minimum(best, c.max(axis=0))
    return best

def step(k, R, d, x, mode):
    ck = 1/(3*k); dx = d*x
    cb = 1/6 - dx*ck/8 - (3/8)*(1-R); cl = 5/4 + dx*(1 + 5*ck/8) - (9/8)*(1-R); c0 = -1/4 + d/2 - dx*ck/8 - (3/8)*(1-R)
    A = [np.c_[cb.ravel(), cl.ravel()]]; ub = [-c0.ravel()]
    def add(row, rhs): A.append(np.array([row])); ub.append(np.array([rhs]))
    add([-1, 0], 0); add([0, 1], 1/5)
    if mode == "gates":          # Remark 14.1 without the two numerical conveniences (variant (iii) of r2)
        e = 1e-9
        add([0, -1], -1/6); add([1, 3], 1-e); add([17/6, 3], 1-e); add([0, -6*k], -3/4-e); add([-1, 12*k-3], 1-e)
        add([0.21, 0.63-2], -0.21-e); add([-1, 5], 1-e); add([1, -1], -e)
        g = (6*k - 2*dx); A.append(np.c_[(R/2).ravel(), (1.5*R - g).ravel()]); ub.append((-R/2).ravel())
        add([1/6, 5/4], 1/4 - 1/250); add([1/6, 5/4 + 3/100], 1/4 - 1/50); add([13/150 - 1/4, 39/150 + 1/4], -1/20 - 1/50 - 13/150 + 1/4)
    res = linprog([0, -1], A_ub=np.vstack(A), b_ub=np.concatenate(ub), bounds=[(None, None)]*2, method="highs")
    if res.status != 0: return None
    return 11/12 - res.x[1]/4, res.x[0], res.x[1]

def solve(mode="optimistic", nd=141, nx=21, **kw):
    d = np.linspace(1/8, 5/6, nd)[:, None]; x = np.linspace(0, .5, nx)[None, :]
    k = 0.75; out = None
    for it in range(40):
        c2 = kw.get("c2", None)
        kk = dict(kw); 
        if callable(c2): kk["c2"] = c2(k)
        R = count(d, x, k, nt=201, nr=601, **kk)
        out = step(k, R, d, x, mode)
        if out is None: return None
        kn = max(13/18, 2*out[0]-1)
        if abs(kn-k) < 1e-10: break
        k = kn
    return (*out, k)

if __name__ == "__main__":
    print("A. validation: count(min-max) vs closed form (13.16) at kappa_flat")
    for d_, x_ in [(DC, .5), (DC, 0.), (.3, .25), (.6, .5)]:
        print(f"   d={d_:.5f} x={x_:.2f}  formula {Rk(d_, x_, KF):.6f}  minmax {float(count(d_, x_, KF, nt=2001, nr=4001)):.6f}")
    print("B. count at the critical class (delta_c, 1/2), kappa_flat; R_c = %.6f, 1 - delta_c = %.6f" % (Rk(DC, .5, KF), 1-DC))
    print("   c1\\c2      6k=%.3f     3.0       2.0       1.0" % (6*KF))
    for c1 in (2.0, 1.9, 1.75, 1.5, 1.25, 1.0):
        row = [float(count(DC, .5, KF, c1=c1, c2=c2, nt=2001, nr=4001)) for c2 in (6*KF, 3.0, 2.0, 1.0)]
        print("   %.2f     " % c1 + "  ".join("%.6f" % v for v in row))
    print("C. first-order tau per unit of 1/c1 and 1/c2 at the critical class")
    R0 = float(count(DC, .5, KF, nt=4001, nr=8001))
    R1 = float(count(DC, .5, KF, c1=1.98, nt=4001, nr=8001)); R2 = float(count(DC, .5, KF, c2=6*KF*0.99, nt=4001, nr=8001))
    print("   c1: 2 -> 1.98: tau = %.6f;   c2: 6k -> 0.99*6k: tau = %.6f" % (R0-R1, R0-R2))
    if "--system" in sys.argv:
        print("D. system value B (balanced, kappa = 2B-1 >= 13/18); grid 141x21; MODEL")
        ref = solve("optimistic"); print("   reference (c1=2, c2=6k): optimistic %.7f   gates %.7f" % (ref[0], solve("gates")[0]))
        for name, kw in [("c1 = 1.9", dict(c1=1.9)), ("c1 = 1.75", dict(c1=1.75)), ("c1 = 1.5", dict(c1=1.5)), ("c1 = 1.25", dict(c1=1.25)),
                         ("c1 = 1 (natural)", dict(c1=1.0)), ("c2 = 3k", dict(c2=lambda k: 3*k)), ("c2 = 2", dict(c2=2.0)), ("c2 = 1 (natural)", dict(c2=1.0)),
                         ("c1 = 1.5, c2 = 3k", dict(c1=1.5, c2=lambda k: 3*k)), ("c1 = 1, c2 = 1", dict(c1=1.0, c2=1.0)),
                         ("c1 = 1, c2 = 1, s = 0", dict(c1=1.0, c2=1.0, s=0.0))]:
            o = solve("optimistic", **kw); g = solve("gates", **kw)
            print("   %-22s optimistic %.7f (b=%.4f l=%.4f k=%.5f)   gates %s" % (name, o[0], o[1], o[2], o[3], "infeasible" if g is None else "%.7f" % g[0]), flush=True)
