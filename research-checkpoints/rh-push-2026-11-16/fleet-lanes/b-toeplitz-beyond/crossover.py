# One-pair model crossover. Exact extremal: lambda_min of kernel
#   k(x-y) = e^{kap|x-y|} + e^{-(del+th)|x-y|},  kap = del - th,  on L^2(-a,a)
# (zero-side contribution of an off-line pair gamma = H +- i del to the damped Weil form W(h e^{-th|u|})).
# Threshold: -lambda_min > log(H/2pi).   th = 0: closed form 2a - sinh(2 a del)/del.
import numpy as np, math
from scipy.optimize import brentq
def lam_min_num(a, dl, th, n=1200):
    x, w = np.polynomial.legendre.leggauss(n); x = a*x; w = a*w
    D = np.abs(x[:,None]-x[None,:])
    K = np.exp((dl-th)*D) + np.exp(-(dl+th)*D)
    s = np.sqrt(w); M = s[:,None]*K*s[None,:]
    return np.linalg.eigvalsh(M)[0]
def lam_min_closed0(a, dl): return 2*a - math.sinh(2*a*dl)/dl
L = math.log(3e12/(2*math.pi))
print("L=log(X/2pi)=",L)
# check closed form
for a in (1.0,3.0):
    print("check", a, lam_min_num(a,0.5,0.0), lam_min_closed0(a,0.5))
def rest(T, dl):  # RES-T packet threshold
    S = math.sinh(T*dl/2)/(T*dl/2); return dl*dl*S**4*T**3 - L
for dl in (0.5, 0.375, 0.374887, 0.25, 0.1):
    a_sharp = brentq(lambda a: -lam_min_closed0(a,dl)-L, 0.1, 400)
    T_res = brentq(lambda T: rest(T,dl), 0.1, 400)
    print(f"delta0={dl}: sharp one-pair crossover a={a_sharp:.4f} 2a={2*a_sharp:.4f} e^2a={math.exp(2*a_sharp):.0f} | RES-T packet a={T_res:.4f} 2a={2*T_res:.4f} e^2a={math.exp(2*T_res):.0f}")
# other heights
for X in (1e6, 3e12, 1e20, 1e100):
    LL = math.log(X/(2*math.pi))
    print("X=%g"%X, [round(2*brentq(lambda a: -lam_min_closed0(a,dl)-LL, 0.1, 600),3) for dl in (0.5,0.375)])
# damped crossover curve a_X(theta) for delta0 = 3/8 and 1/2
for dl in (0.5,0.375):
    print("damped crossover, delta0=",dl)
    for th in (0,0.05,0.1,0.15,0.2,0.25,0.3,0.33,0.35):
        if th>=dl: continue
        f = lambda a: -lam_min_num(a,dl,th,500)-L
        try:
            a = brentq(f, 0.5, 300, xtol=1e-4)
            print(f"  theta={th}: 2a_X={2*a:.3f} e^2a={math.exp(2*a):.3g}")
        except Exception as e: print("  theta",th,"no root",e)
