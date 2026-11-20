"""(1) explicit value of the tau given by Suzuki's Prop 4.2 argument: tau = sup_v -log(M_v)/(2v),
    M_v = sup_u |Theta(u+iv)|^nu, v > 1/2+omega.   (2) sign-twist crossing by bisection (float64)."""
import math, sys, numpy as np, mpmath as mp
from suz import coeffs, GTable, galerkin
mp.mp.dps = 20
def xi(s): return 0.5 * s * (s - 1) * mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
def Mv(om, v):
    best = 0
    for u in np.linspace(0, 80, 321):
        s = mp.mpc(0.5 + v, -u)
        val = abs(xi(s - om) / xi(s + om))
        best = max(best, val)
    return best
for om, nu in ((0.25, 5), (0.4, 3), (0.25, 9)):
    best = (0, None)
    for v in (2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 50, 60, 80):
        m = Mv(om, v)
        tau = -nu * math.log(m) / (2 * v)
        if tau > best[0]: best = (tau, v, float(m))
    print("Suzuki Prop 4.2 explicit tau for om=%g nu=%d: tau=%.4f at v=%s (M_v^(1/nu)=%.4f)" % (om, nu, best[0], best[1], best[2]))
# twist bisection
for nu in (5, 1):
    om = 0.25
    N = 4
    a = coeffs("twist2", om, nu, N); tab = GTable("twist2", om, nu, 1.0)
    def norm(t):
        M, _ = galerkin(tab, a, t, 60)
        ev = np.linalg.eigvalsh(M)
        return ev[0], ev[-1]
    lo, hi = 0.3466, 0.40
    for _ in range(22):
        mid = (lo + hi) / 2
        l0, l1 = norm(mid)
        if max(abs(l0), abs(l1)) > 1: hi = mid
        else: lo = mid
    print("twist2 om=0.25 nu=%d: first |eigenvalue|=1 at t in (%.6f, %.6f); (log 2)/2 = %.6f; eig at hi: %s" % (nu, lo, hi, math.log(2) / 2, norm(hi)))
    for kind in ("zeta", "twist2"):
        a2 = coeffs(kind, om, nu, N)
        print("   q(2) for", kind, "=", a2[2])
