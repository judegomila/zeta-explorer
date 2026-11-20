"""MODEL prices (hypothetical inputs, not bounds) for the only kind of input that changes the numerator LP:
a moment of order 2k > 4 of plain polynomials over the row family, Lindelof on average,
    sum_u |S_m(u)|^{2k} |Q_sel(u)|^2 << U^{1+eps}   (k m + 6 kappa z <= 1; z = 0: all lengths),
which gives  K_k = R + (1-R)/(2k)  and shift capacity theta_k = 2 g/(6 kappa k)  (k = 2 is the source).
Uses the float LP of ../bypass-78/scalar_system.py (same optimistic conventions as its price list:
region A, free lengths, kappa = 2B-1, classes delta >= 1/8, gates of Liu II Remark 14.1 not imposed)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "bypass-78"))
import numpy as np
import scalar_system
from scalar_system import solve, bisect, count_R
LEN = [(np.array([-1.0, 0.0, 1.0]), 0.0), (np.array([0.0, -1.0, 1.0]), 0.0)]

def run(name, Kfun, theta_scale=1.0):
    scalar_system.THETA_SCALE = theta_scale
    # class_row uses K = (3 R + 1)/4 and R nowhere else: feed R_eff with (3 R_eff + 1)/4 = K_target
    Rf = lambda d, x, k: (4.0*Kfun(count_R(d, x, k)) - 1.0)/3.0
    f = lambda B: solve(B, ["av_max"], "A", Rfun=Rf, extra_rows=LEN, nd=97, nx=33)
    Bs = bisect(f, 0.70, 0.95, it=45)
    t, v = f(Bs)
    print(f"{name:66s} B={Bs:.7f}  lx={v[0]:.4f} ly={v[1]:.4f} l={v[2]:.4f}")
    scalar_system.THETA_SCALE = 1.0
    return Bs

if __name__ == "__main__":
    b0 = run("k=2 (source; validation, expect 0.8748865)", lambda R: (3*R + 1)/4)
    for k in (3, 4, 6, 12):
        run(f"2k={2*k}-th moment, K=R+(1-R)/{2*k}, theta capacity unchanged", lambda R, k=k: R + (1 - R)/(2*k))
        run(f"2k={2*k}-th moment, K=R+(1-R)/{2*k}, theta capacity 2/k", lambda R, k=k: R + (1 - R)/(2*k), theta_scale=2.0/k)
    run("k=inf (Lindelof on the class, K=R; expect 13/15)", lambda R: R)
    for om in (0.01, 0.025, 0.05, 0.1, 0.2):
        run(f"fourth moment restricted to the class saves U^-{om}: K=(3R+1-{om})/4", lambda R, om=om: (3*R + 1 - om)/4)
    # first-order slope dB/dK
    e = 1e-4
    b1 = run("K -> K - 1e-4 on every class", lambda R: (3*R + 1)/4 - e)
    print("slope dB/dK =", (b1 - b0)/(-e))
