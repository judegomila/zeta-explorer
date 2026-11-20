"""Lambda as a cofinal point of the log class: value (psi(x)-x)/(kappa (1+log x)) with kappa = sup_Y |T(Y)-Y log Y-cY|/(1+log Y)."""
import math, numpy as np
from scipy.special import gammaln
for x in (10**4, 4*10**4, 16*10**4):
    N = 3 * 10**6
    sieve = np.ones(x + 1, bool); sieve[:2] = False
    for p in range(2, int(x**.5) + 1):
        if sieve[p]: sieve[p*p::p] = False
    psi = 0.0
    for p in np.nonzero(sieve)[0]:
        psi += math.log(p) * int(math.log(x) / math.log(p) + 1e-12)
    M = np.arange(1, N + 1, dtype=float); T = gammaln(M + 1)
    best = None
    for c in np.linspace(-1.3, -0.7, 61):
        lo = np.abs(T - M * np.log(M) - c * M) / (1 + np.log(M))            # Y = M
        hi = np.abs(T - (M + 1) * np.log(M + 1) - c * (M + 1)) / (1 + np.log(M + 1))   # Y -> M+1
        k = max(lo.max(), hi.max())
        if best is None or k < best[0]: best = (k, c)
    print(f"x={x}: psi(x)-x = {psi-x:.3f}; kappa(Lambda; Y<=3e6) = {best[0]:.4f} at c = {best[1]:.3f}; "
          f"Lambda value in cof units (psi(x)-x)/(kappa(1+log x)) = {(psi-x)/best[0]/(1+math.log(x)):.3f} = {(psi-x)/best[0]/(1+math.log(x))/math.sqrt(x):.4f} sqrt(x)")
