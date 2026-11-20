"""Theorem B check: add to the numerator LP the best conceivable moment of 'large-sieve range' with three
plain factors,   rho + 2(sigma_i + sigma_j + sigma_k) + 2 g z <= 1   for m_i + m_j + m_k + 6 kappa z <= 1
(a hypothetical input; not available in the sources), and re-solve.  Claim: N(theta) is unchanged for
theta <= theta0 because m_x >= 1/3.  Exact check of the modified flat configuration (sigma = 0 below m_x)
in Fractions, then HiGHS on the enlarged LP."""
from fractions import Fraction as Fr
import numpy as np
from scipy.optimize import linprog
from numerator_lp import Rk

def run(name, d, x, k, n=30):
    R = Rk(d, x, k); g = d*x; th0 = g/(6*k)
    mx = ((1 - R)/4 - g/(12*k))/(d/2 - g/(6*k))
    ms = [Fr(j, 2*n) for j in range(n + 1)]
    sig = [Fr(0) if m < mx else (1 - R)/4 - g*(1 - 2*m)/(12*k) for m in ms]
    worst = Fr(-10); cons = []
    for i in range(n + 1):
        for j in range(i, n + 1):
            for l in range(j, n + 1):
                s = ms[i] + ms[j] + ms[l]
                if s > 1: continue
                z = (1 - s)/(6*k)
                worst = max(worst, R + 2*(sig[i] + sig[j] + sig[l]) + 2*g*z - 1)
                cons.append((i, j, l, float(1 - 2*g*z)))
    for i in range(n + 1):                # the source's pairs (C1), any lengths <= 1/2
        for j in range(i, n + 1):
            z = (1 - ms[i] - ms[j])/(6*k)
            worst = max(worst, R + 2*(sig[i] + sig[j]) + 2*g*z - 1)
            cons.append((i, j, None, float(1 - 2*g*z)))
    A = []; ub = []
    for i, j, l, rhs in cons:
        row = np.zeros(n + 2); row[0] = 1; row[1 + i] += 2; row[1 + j] += 2
        if l is not None: row[1 + l] += 2
        A.append(row); ub.append(rhs)
    A = np.array(A); ub = np.array(ub)
    bounds = [(0, float(R))] + [(0, float(d*m/2)) for m in ms]
    res = []
    for th in (Fr(0), th0):
        best = -9
        for j in range(n + 1):
            c = np.zeros(n + 2); c[0] = -1; c[1 + j] = -1
            r = linprog(c, A_ub=A, b_ub=ub, bounds=bounds, method="highs")
            best = max(best, -r.fun - float(th*ms[j]))
        res.append((float(th), best, float((3*R + 1)/4 - th/2)))
    print(f"{name}: m_x={float(mx):.6f}; modified flat configuration, max slack over pairs and triples = {float(worst):.3e} (<= 0 exact: {worst <= 0})")
    for th, best, form in res:
        print(f"    theta={th:.6f}: LP with ideal triple moments = {best:.9f}; source value (3R+1)/4 - theta/2 = {form:.9f}")

if __name__ == "__main__":
    kf = Fr(74977329407992826, 10**17)
    run("critical class", Fr(46934485869814, 10**14), Fr(1, 2), kf)
    run("delta=1/4, x=1/4", Fr(1, 4), Fr(1, 4), kf)
    run("delta=2/3, x=1/2", Fr(2, 3), Fr(1, 2), kf)
    run("delta=1/8, x=0", Fr(1, 8), Fr(0), kf)
