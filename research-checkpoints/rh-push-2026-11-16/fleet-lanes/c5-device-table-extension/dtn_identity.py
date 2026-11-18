"""Device (g): two-boundary Dirichlet-to-Neumann identity for u = log|S| on the strip 0 < x < b.
S = (1 - a L)/(1 + a L), L = F'/F, F(z) = completed function at s = 1/2 + z.
Claim tested:  -theta'(y) = T_b(y) + sum_{zeros of S in strip} K(x_k, y - y_k) - sum_{poles of S in strip} K(x_j, y - y_j)
  T_b(y) = (pi/(4 b^2)) int sech^2(pi (y-y')/(2b)) (-log|S(b+iy')|) dy'
  K(x, d) = (pi/b) sin(pi x/b)/(cosh(pi d/b) - cos(pi x/b))
theta'(y) = S'/S(iy) (real).  Run for zeta and for Davenport-Heilbronn.
T_b by the trapezoid rule with step 1/50; zeros and poles by grid minima plus guarded Newton; winding number as completeness check.
Usage: python dtn_identity.py zeta | zeta1e4 | dh   (run from this directory; writes dtn_identity_<arg>.json)"""
import sys, json
from mpmath import mp, mpf, mpc, zeta, digamma, log, pi, sqrt, cosh, cos, sin, quad, diff, findroot, fabs, re, im, arg, linspace
mp.dps = 25

def L_zeta(z):
    s = mpf(1)/2 + z
    return 1/s + 1/(s-1) - log(pi)/2 + digamma(s/2)/2 + zeta(s, derivative=1)/zeta(s)

TAN = (sqrt(10 - 2*sqrt(5)) - 2)/(sqrt(5) - 1)
def dh(s, d=0):
    return (zeta(s, mpf(1)/5, d) + TAN*zeta(s, mpf(2)/5, d) - TAN*zeta(s, mpf(3)/5, d) - zeta(s, mpf(4)/5, d))
def L_dh(z):
    s = mpf(1)/2 + z
    # f(s) = 5^{-s} dh(s); completed: (5/pi)^{s/2} Gamma((s+1)/2) f(s)
    return log(5/pi)/2 + digamma((s+1)/2)/2 - log(5) + dh(s, 1)/dh(s)

def run(name, L, alpha, b, y0s, R, grid):
    out = {"name": name, "alpha": str(alpha), "b": str(b), "R": R}
    n = lambda z: 1 - alpha*L(z)
    d = lambda z: 1 + alpha*L(z)
    S = lambda z: n(z)/d(z)
    ylo, yhi = min(y0s) - R, max(y0s) + R
    def roots(f):
        found = []
        nx = int(b/grid); ny = int((yhi-ylo)/grid)
        vals = [[fabs(f(mpc((i+0.5)*grid, ylo + (j+0.5)*grid))) for j in range(ny)] for i in range(nx)]
        for i in range(nx):
            for j in range(ny):
                v = vals[i][j]
                nb = [vals[ii][jj] for ii in (i-1, i, i+1) for jj in (j-1, j, j+1) if 0 <= ii < nx and 0 <= jj < ny and (ii, jj) != (i, j)]
                if v <= min(nb):
                    z0 = mpc((i+0.5)*grid, ylo + (j+0.5)*grid)
                    r = z0; ok = True
                    for _ in range(40):
                        fr = f(r)
                        if fabs(fr) < mpf(10)**(-20): break
                        h = mpf(10)**(-10)
                        dfr = (f(r + h) - f(r - h))/(2*h)
                        if dfr == 0: ok = False; break
                        r = r - fr/dfr
                        if not (-0.3 < re(r) < b + 0.3 and ylo - 0.3 < im(r) < yhi + 0.3): ok = False; break
                    if not ok: continue
                    if 0 < re(r) < b and ylo < im(r) < yhi and fabs(f(r)) < 1e-12 and all(fabs(r - q) > 1e-8 for q in found):
                        found.append(r)
        return found
    Z = roots(n); P = roots(d)
    # winding number of S around the rectangle = #zeros - #poles
    def winding():
        pts = []
        m = 100
        for t in linspace(0, 1, m)[:-1]: pts.append(mpc(t*b, ylo))
        for t in linspace(0, 1, 8*m)[:-1]: pts.append(mpc(b, ylo + t*(yhi-ylo)))
        for t in linspace(0, 1, m)[:-1]: pts.append(mpc(b - t*b, yhi))
        for t in linspace(0, 1, 8*m)[:-1]: pts.append(mpc(0, yhi - t*(yhi-ylo)))
        tot = mpf(0); prev = S(pts[0]); first = prev
        for p in pts[1:] + [pts[0]]:
            cur = S(p); tot += arg(cur/prev); prev = cur
        return tot/(2*pi)
    w = winding()
    out["zeros"] = [(float(re(r)), float(im(r))) for r in Z]
    out["poles"] = [(float(re(r)), float(im(r))) for r in P]
    out["winding"] = float(w)
    K = lambda x, dd: (pi/b)*sin(pi*x/b)/(cosh(pi*dd/b) - cos(pi*x/b))
    ub = lambda yy: log(fabs(S(mpc(b, yy))))
    HT = mpf(1)/50
    UB = [(ylo + k*HT, ub(ylo + k*HT)) for k in range(int((yhi-ylo)/HT)+1)]
    rows = []
    for y0 in y0s:
        Lp = diff(L, mpc(0, y0))
        Lv = L(mpc(0, y0))
        thp = re(-2*alpha*Lp/(1 - alpha**2*Lv**2))
        T = (pi/(4*b*b))*sum(-uv/cosh(pi*(y0-yy)/(2*b))**2 for yy, uv in UB)*HT
        zs = sum(K(re(r), y0 - im(r)) for r in Z)
        ps = sum(K(re(r), y0 - im(r)) for r in P)
        rows.append({"y": float(y0), "minus_theta_prime": float(-thp), "T_b": float(T), "zero_sum": float(zs), "pole_sum": float(ps), "residual": float(-thp - (T + zs - ps))})
        print(name, rows[-1], flush=True)
    out["rows"] = rows
    out["min_ub_sign"] = float(max(ub(mpf(y)) for y in linspace(ylo, yhi, 60)))
    return out

if __name__ == "__main__":
    res = []
    which = sys.argv[1]
    if which == "zeta":
        res.append(run("zeta", L_zeta, mpf(1)/5, mpf(1)/2, [mpf(27), mpf(28.3), mpf(31.7)], 6, 0.025))
    elif which == "zeta1e4":
        res.append(run("zeta", L_zeta, mpf(1), mpf(1)/2, [mpf(10000.3), mpf(10000.8)], 2.5, 0.025))
    else:
        res.append(run("DH", L_dh, mpf(1)/5, mpf(3)/4, [mpf(84.9), mpf(85.7), mpf(86.4)], 7, 0.04))
    json.dump(res, open(f"dtn_identity_{which}.json", "w"), indent=1)
