"""r2-zf-critical-density: counting exponents at the critical class of Liu 2610.26835v2.
Part A: replay of (14.3)/(13.16) as a detector min-max.  Part B: third option = general-coefficient
sextic large sieve (K + D + (KD)^{2/3}).  Part C: Ingham/Montgomery two-class scheme with that large sieve
and with a hypothetical perfect one.  Part D: Halasz-Montgomery threshold.  Float, numpy only."""
import numpy as np

KF = 0.74977329407992826
DC = 0.46934485869814

def R_formula(d, x, k):
    ck = 1/(3*k)
    D = 3 - (1+2*ck)*x; P = (2-2*ck*x)*(1-x); J = (5/6-d)*D + d*P
    return 1 - d + (5/6-d)*d*P/(2*J)

def cI(r, d, x):            # M1, r<=1, prime length (1-r)/2
    return 1 - d*(x + (1-x)*r)
def cL(r, d, s=5/6):        # M1 long, r>=1, e(r) = 1 + s(r-1)
    return 1 + s*(r-1) - d*r
def cS(m, d, x, k, cap=None):  # M2, two copies, prime length (1-2m)/cap, cap = 6 kappa
    cap = 6*k if cap is None else cap
    return 1 - d*(2*m + 2*x*(1-2*m)/cap)
def cBGL(Y, d):             # general coefficients, product polynomial of total length Y, x=1/2 best case
    return np.maximum(1, np.maximum(Y, 2*(1+Y)/3)) - d*Y

def minmax(d, x, k, s=5/6, cap=None, third=False, nt=2001, nr=4001):
    best = 9
    for t in np.linspace(1, 1.5, nt):
        r = np.linspace(t-0.5, t, nr); m = t - r
        inv = np.where(r <= 1, cI(np.minimum(r, 1), d, x), cL(r, d, s))
        c = np.minimum(inv, cS(m, d, x, k, cap))
        if third:
            c = np.minimum(c, 1 - d/2)   # inf_Y cBGL(Y) = 1 - d/2 for d < 2/3
        best = min(best, c.max())
    return best

if __name__ == "__main__":
    print("A. replay of (14.3) as detector min-max  [delta, x, formula, minmax]")
    for d, x in [(DC, 0.5), (DC, 0.0), (0.3, 0.25), (0.6, 0.5), (0.125, 0.5), (0.75, 0.1)]:
        print(f"   {d:.5f} {x:.2f}  {R_formula(d,x,KF):.6f}  {minmax(d,x,KF):.6f}")
    Rc = R_formula(DC, 0.5, KF)
    print(f"   R_c = {Rc:.9f}   density-hypothesis value 1-delta = {1-DC:.6f}   1-2delta/3 = {1-2*DC/3:.6f}")

    print("B. general-coefficient sextic large sieve as an extra option")
    Y = np.linspace(0, 3, 30001)
    v = cBGL(Y, DC); i = v.argmin()
    print(f"   inf_Y [max(1,Y,2(1+Y)/3) - delta Y] = {v[i]:.6f} at Y = {Y[i]:.4f}   (1 - delta/2 = {1-DC/2:.6f})")
    print(f"   minmax with the extra option at (delta_c,1/2): {minmax(DC,0.5,KF,third=True):.6f}")
    dd = np.linspace(0.125, 0.8333, 400); gap = (1 - dd/2) - (1 - 2*dd/3)
    print(f"   min over delta in [1/8,5/6] of (1-delta/2) - (1-2delta/3) = {gap.min():.6f}  (>0: never selected)")
    v2 = np.maximum(1, Y) - DC*Y; j = v2.argmin()
    print(f"   hypothetical perfect large sieve max(1,Y): inf = {v2[j]:.6f} at Y = {Y[j]:.3f}")

    print("C. Ingham/Montgomery two-class scheme, sigma = (1+delta_c)/2")
    def ingham(De):
        best = (9, 0, 0)
        for x1 in np.linspace(0.02, 2.0, 397):
            for y in np.linspace(x1, 4.0, 400):
                kk = np.linspace(x1, y, 200)
                R1 = (De(kk) - DC*kk).max()
                R2 = 1/3 + (2/3)*De(np.array([x1]))[0] - (2/3)*DC*y
                if max(R1, R2) < best[0]: best = (max(R1, R2), x1, y)
        return best
    bgl = lambda K: np.maximum(1, np.maximum(K, 2*(1+K)/3))
    perf = lambda K: np.maximum(1, K)
    print("   with K + D + (KD)^{2/3}:  exponent %.6f  (mollifier %.3f, Y %.3f)" % ingham(bgl))
    print("   with perfect K + D:       exponent %.6f  (mollifier %.3f, Y %.3f);  3(1-s)/(2-s) = %.6f" % (*ingham(perf), 3*(1-DC)/(3-DC)))

    print("D. Halasz-Montgomery: needs K^{1/2-delta} U^{2 mu} < 1; delta_c = %.5f < 1/2, so no K qualifies even at mu = 0" % DC)
    print("   threshold real part 3/4; a_c = %.6f; distance %.6f" % ((1+DC)/2, 0.75-(1+DC)/2))

    print("E. MODEL inputs that would lower the count at (delta_c,1/2)  [tau = R_c - R']")
    for name, kw in [("e(r) slope 5/6 -> 4/5 on r>=1", dict(s=0.8)), ("e(r) slope -> 3/4", dict(s=0.75)),
                     ("e(r) slope -> 1/2", dict(s=0.5)), ("e(r) = 1 on r>=1 (Lindelof-on-average, Mobius)", dict(s=0.0)),
                     ("M2 prime capacity 6k -> 3k", dict(cap=3*KF)), ("M2 prime capacity -> 2 (large-sieve cost)", dict(cap=2.0))]:
        Rn = minmax(DC, 0.5, KF, **kw)
        print(f"   {name:50s} R' = {Rn:.6f}  tau = {Rc-Rn:+.6f}")
