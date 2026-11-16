# Adversarial node placement. Objective: smallest generalized eigenvalue mu of (K_test, K_zeta) at the same nodes.
# mu < 0  <=>  K_test indefinite (K_zeta is positive definite). Scale-free, so node coalescence is not rewarded.
import mpmath as mp, sys, os, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick import L_zeta, L_dh
from nested import quad
from scipy.optimize import minimize
which = sys.argv[1]; N = int(sys.argv[2]); starts = int(sys.argv[3]); mp.mp.dps = int(sys.argv[4])
d = mp.mpf(sys.argv[5]) if len(sys.argv)>5 else mp.mpf('0.3')
g1 = mp.im(mp.zetazero(1))
cz, ct = {}, {}
def Lt(x):
    if which=="dh": return L_dh(x)
    return L_zeta(x) - 2*x/(x**2+g1**2) + quad(x,g1,d)       # twin1: first zero pair moved to 1/2+d+-i*g1
def cached(c, fn, x):
    k = mp.nstr(x, 40)
    if k not in c: c[k] = fn(x)
    return c[k]
def pick(xs, Lx):
    n=len(xs); K=mp.matrix(n,n)
    for i in range(n):
        for j in range(n): K[i,j]=(Lx[i]+Lx[j])/(xs[i]+xs[j])
    return K
def mu(t):
    xs = sorted(mp.exp(mp.mpf(v)) for v in t)
    for i in range(N-1):
        if xs[i+1]-xs[i] < mp.mpf('1e-4')*xs[i+1]: return mp.mpf(1)
    Kz = pick(xs, [cached(cz, L_zeta, x) for x in xs]); Kt = pick(xs, [cached(ct, Lt, x) for x in xs])
    try:
        R = mp.cholesky(Kz)
    except ValueError:
        return mp.mpf(1)                       # zeta matrix unresolved at this precision: reject node set
    if min(R[i,i] for i in range(N))**2 < mp.mpf(10)**(-(mp.mp.dps-30))*max(Kz[i,i] for i in range(N)):
        return mp.mpf(1)
    Ri = R**-1
    M = Ri*Kt*Ri.T
    M = (M+M.T)/2
    return mp.eigsy(M, eigvals_only=True)[0]
best=None; random.seed(7)
for s in range(starts):
    t0 = sorted(random.uniform(-6, 4.6) for _ in range(N))
    r = minimize(lambda t: float(mu(t)), t0, method="Nelder-Mead", options={"maxiter":300*N,"xatol":1e-4,"fatol":1e-12})
    e = mu(r.x); xs=[float(mp.exp(v)) for v in sorted(r.x)]
    if best is None or e<best[0]: best=(e,xs)
print("BEST", which, "N=%d"%N, "d=%s"%mp.nstr(d,3), "min generalized eig mu=%s"%mp.nstr(best[0],6), "nodes", [round(x,5) for x in best[1]], flush=True)
