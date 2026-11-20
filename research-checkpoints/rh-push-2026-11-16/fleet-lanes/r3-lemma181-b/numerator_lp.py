"""The numerator step as a linear program in exponents, solved exactly.

Unknowns (exponents to base U on a row class B):  rho = log #B,  sigma_j = log |S_{m_j}| on B,
m_j = j/(2n), j = 0..n (dyadic block lengths of the approximate functional equation, 0 <= m <= 1/2).
Inputs of the source used as constraints:
  C1 (M2 = Liu II Thm 12.16 = manuscript Lemma 18.1):  rho + 2 sigma_i + 2 sigma_j + 2 g z <= 1
       for every z <= min((1 - m_i - m_j)/(6 kappa), L)      (two plain factors, prime length z, capacity 6 kappa)
  C2 (bin bound, Cor 13.8(2) through Mellin inversion):  sigma_j <= delta m_j / 2
  C3 (count):                                            rho <= R
Objective for block j at shift theta:  rho + sigma_j - theta m_j.   N(theta) = max_j of the LP values.

Exact part (fractions.Fraction): primal point (flat configuration) feasible for every constraint; dual
multipliers (3/4 on C3, 1/4 on C1(j,j)) or (1 on C3, 1 on C2) reproduce the same value.  Primal = dual
proves optimality without a solver.  Float part: HiGHS on the same LP as an independent cross-check."""
from fractions import Fraction as Fr
import numpy as np
from scipy.optimize import linprog

def Rk(d, x, k):
    c = Fr(2, 3)/k
    D = 3 - (1 + c)*x; P = (2 - c*x)*(1 - x); J = (Fr(5, 6) - d)*D + d*P
    return 1 - d + (Fr(5, 6) - d)*d*P/(2*J)

def exact_check(d, x, k, R, L, n=60):
    g = d*x; th0 = g/(6*k)
    ms = [Fr(j, 2*n) for j in range(n + 1)]
    tau = [(1 - R)/4 - g*(1 - 2*m)/(12*k) for m in ms]          # uncapped M2 branch
    sig = [max(Fr(0), min(d*m/2, t)) for m, t in zip(ms, tau)]   # flat configuration
    # primal feasibility, all pairs, largest admissible z
    worst = Fr(-10)
    for i in range(n + 1):
        for j in range(i, n + 1):
            z = min((1 - ms[i] - ms[j])/(6*k), L)
            worst = max(worst, R + 2*sig[i] + 2*sig[j] + 2*g*z - 1)
    assert worst <= 0, ("primal infeasible", worst)
    assert all(s <= d*m/2 for s, m in zip(sig, ms))
    mx = ((1 - R)/4 - g/(12*k))/(d/2 - g/(6*k))
    out = []
    for th in [Fr(0), th0/2, th0, (th0 + d/2)/2, d/2]:
        prim = max(R + s - th*m for s, m in zip(sig, ms))
        # dual bound per block: min of the two certificates (capped z in the M2 certificate)
        dual = max(min(R + d*m/2 - th*m,
                       Fr(3, 4)*R + Fr(1, 4) - g*min((1 - 2*m)/(6*k), L)/2 - th*m) for m in ms)
        if th <= th0:
            formula = (3*R + 1)/4 - th/2
        else:
            formula = R + mx*(d/2 - th)
        out.append((th, prim, dual, formula))
    return worst, mx, out

def float_lp(d, x, k, R, L, th, n=60):
    d, x, k, R, L, th = map(float, (d, x, k, R, L, th)); g = d*x
    ms = np.arange(n + 1)/(2.0*n)
    A = []; ub = []
    for i in range(n + 1):
        for j in range(i, n + 1):
            z = min((1 - ms[i] - ms[j])/(6*k), L)
            row = np.zeros(n + 2); row[0] = 1; row[1 + i] += 2; row[1 + j] += 2
            A.append(row); ub.append(1 - 2*g*z)
    bounds = [(0, R)] + [(0, d*m/2) for m in ms]
    best = -9
    for j in range(n + 1):
        cvec = np.zeros(n + 2); cvec[0] = -1; cvec[1 + j] = -1
        res = linprog(cvec, A_ub=np.array(A), b_ub=np.array(ub), bounds=bounds, method="highs")
        best = max(best, -res.fun - th*ms[j])
    return best

if __name__ == "__main__":
    kf = Fr(74977329407992826, 10**17)
    dc = Fr(46934485869814, 10**14)
    cases = [("critical class, kappa_flat", dc, Fr(1, 2), kf),
             ("critical class, kappa=3/4", dc, Fr(1, 2), Fr(3, 4)),
             ("delta=1/4, x=1/4", Fr(1, 4), Fr(1, 4), kf),
             ("delta=2/3, x=1/2", Fr(2, 3), Fr(1, 2), kf),
             ("delta=1/8, x=1/2", Fr(1, 8), Fr(1, 2), Fr(13, 18)),
             ("delta=3/5, x=1/10", Fr(3, 5), Fr(1, 10), Fr(1))]
    for name, d, x, k in cases:
        Rm = Rk(d, x, k)
        for Rlab, R in [("R=R_kappa", Rm), ("R=(R_kappa+1-delta)/2", (Rm + 1 - d)/2)]:
            for L in [Fr(1), Fr(2105, 10000)]:
                g = d*x
                gate_new = R <= 1 - d + (6*k*d - 2*g)*L
                gate_old = R <= (6*k - 2*g)*L
                worst, mx, out = exact_check(d, x, k, R, L)
                print(f"{name}; {Rlab}={float(R):.9f}; L={float(L):.4f}; m_x={float(mx):.6f}; primal slack max={float(worst):.2e};"
                      f" gate(14.15)={gate_old} relaxed gate={gate_new}")
                for th, prim, dual, formula in out:
                    fl = float_lp(d, x, k, R, L, th)
                    tag = "EXACT primal=dual" if prim == dual else f"gap {float(dual - prim):.3e}"
                    # grid effect: the crossing m_x need not be a grid point; formula is the continuum value
                    print(f"    theta={float(th):.6f}: primal={float(prim):.9f} dual={float(dual):.9f} [{tag}]"
                          f" formula N(theta)={float(formula):.9f} (formula-primal={float(formula - prim):.2e}) HiGHS={fl:.9f}")
