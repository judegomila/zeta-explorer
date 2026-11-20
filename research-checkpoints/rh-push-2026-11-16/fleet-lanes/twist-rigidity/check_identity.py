# Verify the prime-free family identity for the cubic field of conductor 7:
#   sum over zeros of zeta, L(chi), L(chibar) of h(gamma)  =  Arch_K(g)     (support of g inside (-log 7, log 7))
# and the same identity failing by exactly the prime terms for zeta alone.
import numpy as np, flint, json
from scipy.special import digamma
L = 1.9                      # f supported on [0,L]; g = f*f~ supported on [-L,L]; L < log 7 = 1.9459
xs, ws = np.polynomial.legendre.leggauss(600); xs = 0.5*L*(xs+1); ws = 0.5*L*ws
f = (xs*(L-xs))**3
def fhat(t):  # t array (real)
    return (np.exp(1j*np.outer(t, xs)) * f) @ ws
def h(t): return np.abs(fhat(np.atleast_1d(np.asarray(t, float))))**2
g0 = float(f*f @ ws)
def g(x):   # autocorrelation at x>=0
    m = xs + x <= L
    return float(np.sum(ws[m]*f[m]*((xs[m]+x)*(L-xs[m]-x))**3))
pole = 2*float((f*np.exp(-xs/2))@ws)*float((f*np.exp(xs/2))@ws)
t = np.arange(-600, 600, 0.004); ht = h(t) if False else np.concatenate([h(t[i:i+20000]) for i in range(0, len(t), 20000)])
def gam(a): return float(np.sum(ht*digamma(0.25+a/2+0.5j*t).real)*0.004/(2*np.pi))
G0 = gam(0)
def zeros(q, n, H=120.0, step=0.02):
    c = flint.dirichlet_char(q, n)
    Z = lambda u: float(c.hardy_z(flint.acb(u)).real)
    grid = np.arange(-H, H+step, step); vals = [Z(u) for u in grid]; out = []
    for i in range(len(grid)-1):
        if vals[i]*vals[i+1] < 0:
            a, b, fa = grid[i], grid[i+1], vals[i]
            for _ in range(50):
                m = 0.5*(a+b); fm = Z(m)
                if fa*fm <= 0: b = m
                else: a, fa = m, fm
            out.append(0.5*(a+b))
    return np.array(out)
zz = zeros(1, 1); zc = zeros(7, 2)
Sz, Sc = float(h(zz).sum()), float(h(zc).sum())
def P(char):  # prime side 2 Re sum Lambda(n) chi(n) g(log n)/sqrt n
    s = 0.0
    for n, lam in [(2, np.log(2)), (3, np.log(3)), (4, np.log(2)), (5, np.log(5))]:
        if np.log(n) < L: s += 2*lam/np.sqrt(n)*g(np.log(n))*char(n)
    return s
c7 = flint.dirichlet_char(7, 2)
Pz = P(lambda n: 1.0); Pc = P(lambda n: complex(c7(n)).real)
arch_z = pole - g0*np.log(np.pi) + G0
arch_c = g0*np.log(7/np.pi) + G0
res = dict(L=L, g0=g0, n_zeta_zeros=len(zz), n_chi_zeros=len(zc),
  zeta_zero_side=Sz, zeta_explicit=arch_z-Pz, zeta_resid=Sz-(arch_z-Pz),
  chi_zero_side=Sc, chi_explicit=arch_c-Pc, chi_resid=Sc-(arch_c-Pc),
  family_zero_side=Sz+2*Sc, family_arch_only=arch_z+2*arch_c, family_resid=Sz+2*Sc-(arch_z+2*arch_c),
  P_zeta=Pz, P_chi=Pc, P_family=Pz+2*Pc)
print(json.dumps(res, indent=1)); json.dump(res, open('check_identity.json', 'w'), indent=1)
