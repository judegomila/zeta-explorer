"""Task (3): reach of the pair {Theorem E (Lambda>=0 upper bound), Krein-square decomposition}.
Cone: g(l) = e^{-x l} sum_k a_k cos(k g0 l), a_k >= 0, trig poly >= 0, x > 1/2 (+a for E_a).
Inequality (zeta):  sum_rho sum_k a_k Re 1/(x - i k g0 - rho) <= Re sum_k a_k Arch(x - i k g0).
Every zero term on the left is > 0 (x > 1/2 > beta), so a hypothetical quartet at beta + i g0 is excluded iff
  a_1 (1/(x-beta) + 1/(x+beta)) > R := Re sum_k a_k Arch(x - i k g0).
Outputs beta*(g0) = smallest excluded beta, and c = (1/2 - beta*) log g0.
Controls: DH (Arch without pole, conductor 5, odd gamma factor): test whether the inequality 'excludes' the true DH zero.
E_a: Arch_a = Arch(.+a) + Arch(.-a); true zeros at beta = a.
"""
import json, math
import numpy as np
from scipy.optimize import minimize
from scipy.special import digamma

def arch_zeta(x):
    s = 0.5 + x
    return 1/s + 1/(s-1) - math.log(math.pi)/2 + digamma(s/2)/2
def arch_dh(x):
    s = 0.5 + x
    return math.log(5/math.pi)/2 + digamma((s+1)/2)/2
def arch_ea(a):
    return lambda x: arch_zeta(x + a) + arch_zeta(x - a)

def coeffs(c):
    c = np.abs(np.array(c, float)); d = len(c)
    # |sum c_j e^{ij th}|^2 = a_0 + sum_{k>=1} a_k cos(k th) with a_0 = sum c^2, a_k = 2 sum c_j c_{j+k}
    a = [float(np.dot(c, c))] + [2*float(np.dot(c[:-k], c[k:])) for k in range(1, d)]
    return a

def R(arch, x, a, g0):
    return sum(ak*(arch(complex(x, -k*g0))).real for k, ak in enumerate(a))

def beta_star(arch, g0, xmin, deg=4):
    def obj(p):
        x = xmin + abs(p[0]); a = coeffs([1.0] + list(p[1:]))
        r = float(R(arch, x, a, g0))
        if r <= 0 or a[1] <= 0: return 10.0
        b2 = x*x - 2*x*a[1]/r
        return math.sqrt(b2) if b2 > 0 else 0.0   # 0.0 => every beta>0 excluded at this height
    best = None
    for x0 in (0.05, 0.2, 0.6, 1.5):
        for c1 in (0.5, 1.0, 1.5):
            p0 = [x0, c1] + [0.3]*(deg-1)
            res = minimize(obj, p0, method='Nelder-Mead', options=dict(xatol=1e-7, fatol=1e-10, maxiter=4000))
            if best is None or res.fun < best.fun: best = res
    x = xmin + abs(best.x[0]); a = coeffs([1.0] + list(best.x[1:]))
    return best.fun, x, a

out = {}
print("zeta: smallest excluded centered beta at height g0 (strip half-width 1/2)")
for g0 in (1e2, 1e4, 1e6, 1e9, 1e12, 1e20):
    b, x, a = beta_star(arch_zeta, g0, 0.5)
    c = (0.5 - b)*math.log(g0)
    out[f"zeta_{g0:g}"] = dict(beta_star=b, width=0.5-b, c=c, x=x, a=a)
    print(f"g0={g0:8.0e}  beta*={b:.6f}  width={0.5-b:.3e}  width*log g0={c:.4f}  x-1/2={x-0.5:.3e}  a/a0={[round(t/a[0],3) for t in a]}")

print("\nDH: true off-line zeros (centered beta, gamma); inequality value at (3,4,1) and optimised")
for (b0, g0) in ((0.808517-0.5, 85.699348), (0.650830-0.5, 114.163343), (0.574356-0.5, 166.479306), (0.724258-0.5, 176.702461)):
    b, x, a = beta_star(arch_dh, g0, 0.5)
    a341 = [3.0, 4.0, 1.0]; xx = 0.55
    lhs = a341[1]*(1/(xx-b0) + 1/(xx+b0)); rhs = float(R(arch_dh, xx, a341, g0))
    out[f"dh_{g0:g}"] = dict(true_beta=b0, beta_star=b, lhs341=lhs, rhs341=rhs)
    print(f"g0={g0:.3f} true beta={b0:.4f}  pair would exclude beta>{b:.4f}  => inequality E {'VIOLATED by the true zero' if b0 > b else 'not violated'};  (3,4,1), x=0.55: zero term {lhs:.3f} vs arch {rhs:.3f}")

print("\nE_a = zeta(s+a) zeta(s-a): rates must exceed 1/2+a; true zeros at beta = a")
for a_shift in (0.1, 0.25, 0.375):
    for g0 in (14.134725, 1e4):
        b, x, a = beta_star(arch_ea(a_shift), g0, 0.5 + a_shift)
        out[f"ea_{a_shift}_{g0:g}"] = dict(beta_star=b, true_beta=a_shift)
        print(f"a={a_shift} g0={g0:g}: pair excludes beta>{b:.4f} (strip half-width {0.5+a_shift}); true zeros at beta={a_shift}: {'consistent (PASS)' if a_shift <= b else 'CONTRADICTION'}")
json.dump(out, open('t3_pair_reach.json', 'w'), indent=1)
