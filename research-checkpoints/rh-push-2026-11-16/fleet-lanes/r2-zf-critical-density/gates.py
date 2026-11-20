"""Min-max of Liu II's refined system (balanced lengths) with a hypothetical count saving tau,
(i) optimistic: only E<=0 on [1/8, 2B-1]x[0,1/2], kappa = 2B-1 (>= 13/18);
(ii) gates of Remark 14.1 imposed literally (kappa in [0.7497,0.75], B > 437/500, (2), (4), and (14.15) at L = l/h);
(iii) as (ii) but without the two numerical conveniences kappa >= 7497/10000 and B > 437/500.
LP in (b, l) for fixed kappa (E is affine in (b,l)); outer fixed point kappa = max(kmin, 2B-1).  MODEL for tau>0."""
import numpy as np
from scipy.optimize import linprog

def Rk(d, x, k):
    ck = 1/(3*k)
    D = 3 - (1+2*ck)*x; P = (2-2*ck*x)*(1-x); J = (5/6-d)*D + d*P
    return 1 - d + (5/6-d)*d*P/(2*J)

def step(k, tau, mode, where="uniform", nd=709, nx=41, dmax=5/6, win=0.02, lin=None, names=None):
    d = np.linspace(1/8, dmax, nd)[:, None]; x = np.linspace(0, .5, nx)[None, :]
    R = Rk(d, x, k)
    if where == "uniform": R = R - tau
    else:                  # saving only near the critical class
        R = R - tau*((np.abs(d-0.4693) < win) & (x > 0.45))
    ck = 1/(3*k)
    # E = C0 + d/2 + d x (l + ck (h/4 - ly/2)) - (3h/4)(1-R); C0=-1/4+b/6+5l/4; h=(1+b+3l)/2; ly=(1+b-l)/2
    # h/4 - ly/2 = (5l - 1 - b)/8
    dx = d*x
    cb = 1/6 - dx*ck/8 - (3/8)*(1-R)
    cl = 5/4 + dx*(1 + 5*ck/8) - (9/8)*(1-R)
    c0 = -1/4 + d/2 - dx*ck/8 - (3/8)*(1-R)
    A = [np.c_[cb.ravel(), cl.ravel()]]; ub = [-c0.ravel()]
    lab = ["E<=0"]*cb.size
    def add(row, rhs, name=""): A.append(np.array([row])); ub.append(np.array([rhs])); lab.append(name)
    add([-1, 0], 0, "b>=0"); add([0, 1], 1/5, "l<=1/5")
    if mode != "optimistic":
        e = 1e-9
        add([0, -1], -1/6, "l>=1/6")
        add([1, 3], 1 - e, "lx>l")                      # lx > l  <=> b + 3l < 1
        add([17/6, 3], 1 - e, "ly-l>11b/6")                   # ly - l > 11b/6
        add([0, -6*k], -3/4 - e, "6kl>3/4")                # 6 k l > 3/4
        add([-1, 12*k-3], 1 - e, "l/h<1/(6k)")                # l/h < 1/(6k)
        add([0.21, 0.63-2], -0.21 - e, "l/h>21/100")          # l/h > 21/100
        add([-1, 5], 1 - e, "h/2<ly")                     # h/2 < ly
        add([1, -1], 0 - e, "ly<1/2")                     # ly < 1/2
        # (14.15) at L = l/h: R h <= (6k - 2 d x) l
        g = (6*k - 2*dx)
        A.append(np.c_[(R/2).ravel(), (1.5*R - g).ravel()]); ub.append((-R/2).ravel()); lab += ["(14.15)"]*R.size
        if lin is not None:      # C0 + Asm/8 < -1/250 with l^2/h linearised at (b0,l0)
            b0, l0 = lin; h0 = (1+b0+3*l0)/2; q = l0*l0/h0; qb = -q/h0/2; ql = 2*l0/h0 - 1.5*q/h0
            add([1/6 - 1/32 + qb/8, 5/4 + 1/32 - 3/32 + ql/8], 1/4 - 1/16 + 1/32 - 1/250 - (q - qb*b0 - ql*l0)/8, "C0+Asm/8<-1/250")
        # (14.10) lines 1b,2,3 are affine: C0 < -1/250 ; C0 + (1/2+3l/2)/50 < -1/100 ; 13h/75 - ly/2 + 1/50 < -1/20
        add([1/6, 5/4], 1/4 - 1/250, "C0<-1/250")
        add([1/6, 5/4 + 3/100], 1/4 - 1/100 - 1/100, "floor endpoint")
        add([13/150 - 1/4, 39/150 + 1/4], -1/20 - 1/50 - 13/150 + 1/4, "small rows")
        if mode == "literal": add([0, 1], (11/12 - 437/500)*4 - e, "B>437/500")   # B(l) > 437/500
    res = linprog([0, -1], A_ub=np.vstack(A), b_ub=np.concatenate(ub), bounds=[(None, None)]*2, method="highs")
    if res.status != 0: return None
    b, l = res.x
    if names is not None:
        sl = np.concatenate(ub) - np.vstack(A) @ res.x
        names[:] = sorted(set(lab[i] for i in np.where(sl < 2e-7)[0]))
    h = (1+b+3*l)/2
    asm = 0.5 + (l/2)*(0.5 + 2*l/h) - h/2
    C0 = -1/4 + b/6 + 5*l/4
    ok4 = (C0 + asm/8 < -1/250) if mode != "optimistic" else True
    return 11/12 - l/4, b, l, ok4

def solve(tau, mode, where="uniform", win=0.02, names=None):
    kmin = 0.7497 if mode == "literal" else 13/18
    k = 0.75; lin = None; lprev = 9
    for _ in range(80):
        r = step(k, tau, mode, where, win=win, lin=lin, names=names)
        if r is None: return None
        if mode != "optimistic": lin = (r[1], r[2])
        kn = min(0.75, max(kmin, 2*r[0]-1)) if mode == "literal" else max(kmin, 2*r[0]-1)
        if abs(kn-k) < 1e-12 and _ > 2 and abs(r[2]-lprev) < 1e-12: break
        lprev = r[2]
        k = kn
    return (*r, k)

if __name__ == "__main__":
    print("B_flat reference 0.874886647040")
    for where in ("uniform", "critical-only"):
        print(f"count saving applied: {where}")
        print("   tau        optimistic      gates(iii)      gates literal(ii)   [b, l, kappa, (14.10)-1a ok] for (ii)")
        for tau in (0.0, 1e-4, 1e-3, 1/120, 0.01, 0.02, 0.05, 0.0597):
            out = []; nms = {}
            for mode in ("optimistic", "relaxed", "literal"):
                nms[mode] = []
                out.append(solve(tau, mode, where, names=nms[mode]))
            f = lambda r: "infeasible   " if r is None else f"{r[0]:.9f}"
            lit = out[2]
            extra = "" if lit is None else f"[{lit[1]:.5f}, {lit[2]:.5f}, {lit[4]:.6f}, {lit[3]}] active(ii)={nms['literal']} active(iii)={nms['relaxed']}"
            print(f"   {tau:.6f}   {f(out[0])}   {f(out[1])}   {f(out[2])}   {extra}", flush=True)
    print("critical-only saving tau = 0.05, dependence on the delta-window half-width (x > 0.45), optimistic")
    for w in (0.005, 0.02, 0.05, 0.1, 0.2, 0.4):
        print(f"   half-width {w:.3f}: B = {solve(0.05, 'optimistic', 'critical-only', win=w)[0]:.9f}")
    # slope
    a = solve(0.0, "optimistic")[0]; c = solve(1e-3, "optimistic")[0]
    print("dB/dtau (optimistic, uniform, tau=1e-3): %.4f" % ((c-a)/1e-3))
