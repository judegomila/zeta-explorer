"""Independent check of bypass-78 sections 2-3: unequal lengths and class-by-class mixing of the averaged
and pointwise numerators do not lower B_flat.  Direct nonconvex minimisation over (lx, ly, l) (no rho-scan LP):
F = max(low majorant, max over classes of min over allowed numerator options), kappa fixed.
Formulas: Liu II section 15.1 (low), (14.7) at d = h (averaged, theta in {0, g/(6k)}), (13.18) at d = h (pointwise)."""
import numpy as np
from scipy.optimize import differential_evolution, minimize

KF = 0.74977329407992826
def Rk(d, x, k):
    ck = 1/(3*k)
    D = 3 - (1+2*ck)*x; P = (2-2*ck*x)*(1-x); J = (5/6-d)*D + d*P
    return 1 - d + (5/6-d)*d*P/(2*J)

d = np.linspace(1/8, 5/6, 341)[:, None]; x = np.linspace(0, .5, 41)[None, :]
def build(k):
    R = Rk(d, x, k); a = (1+d)/2; g = d*x; K = (3*R+1)/4; th = g/(6*k)
    return R, a, g, K, th

def F(p, k, opts, tabs):
    lx, ly, l = p
    R, a, g, K, th = tabs
    M = lx+ly; b = ly-lx; h = 1-lx+l
    G = max(0, b/12, b-ly/2); kk = max(0, (1+3*l-2*M)/4, M+l-1, (3*l-1)/2)
    low = 5/6 + lx/6 - l/6 + G + kk/2
    Hs = []
    if "av" in opts:
        Hs.append(a - ly*(0.5+th) - h/6 - l/2 + l*g + h*(K+th/2))
        Hs.append(a - ly*0.5 - h/6 - l/2 + l*g + h*K)
    if "pt" in opts:
        Hs.append(a - a*ly - h/6 - l/2 + l*g + h*(R+d/2))
    H = np.minimum.reduce(Hs)
    return max(low, H.max())

def glob(k, opts, balanced=False, seed=0):
    tabs = build(k)
    if balanced:
        f = lambda q: F(((1-q[0]-q[1])/2, (1+q[0]-q[1])/2, q[1]), k, opts, tabs)
        bnds = [(0, 0.4), (0.05, 0.2)]
    else:
        f = lambda q: F(q, k, opts, tabs)
        bnds = [(0.0, 0.8), (0.0, 1.0), (0.0, 0.5)]
    best = None
    for s in range(seed, seed+4):
        r = differential_evolution(f, bnds, seed=s, popsize=40, tol=1e-12, atol=1e-12, maxiter=600, polish=False)
        r2 = minimize(f, r.x, method="Nelder-Mead", options=dict(xatol=1e-11, fatol=1e-13, maxiter=4000))
        if best is None or r2.fun < best.fun: best = r2
    return best

if __name__ == "__main__":
    for k, nm in ((KF, "kappa_flat"), (0.75, "3/4")):
        ref = glob(k, ("av",), balanced=True)
        print(f"kappa = {nm}: balanced, averaged only (same grid reference)  B = {ref.fun:.10f}  (b,l) = {ref.x}")
        for opts, bal, name in ((("av",), False, "unequal lengths, averaged only"),
                                (("av", "pt"), True, "balanced, class-by-class mixing"),
                                (("av", "pt"), False, "unequal lengths + mixing"),
                                (("pt",), False, "unequal lengths, pointwise only")):
            r = glob(k, opts, balanced=bal)
            p = r.x if not bal else ((1-r.x[0]-r.x[1])/2, (1+r.x[0]-r.x[1])/2, r.x[1])
            print(f"   {name:36s} B = {r.fun:.10f}  diff = {r.fun-ref.fun:+.2e}  lx,ly,l = {p[0]:.5f},{p[1]:.5f},{p[2]:.5f}  M+l = {sum(p):.5f}")
