"""Bohr supremum sigma+ of the real parts of the zeros of D_tau(s) = sum a(n) g_n n^-s, g_n = exp(-(tau/4) log^2 n), from the coefficients alone.
F(sigma, theta) = sum_n a(n) g_n n^-sigma exp(-i sum_p v_p(n) theta_p)  (Bohr lift, theta on the torus of the primes <= PMAX).
sigma+ = sup{sigma : F(sigma, .) has a zero} (Kronecker + Hurwitz; classical for absolutely convergent series). Found by bisection in sigma with
minimum-norm Newton from random starts (a zero found certifies sigma <= sigma+; 'no zero found' is numerical evidence only).
Also sigma_L: largest real root of sum lambda(n) a(n) g_n n^-sigma (all theta_p = pi), when it exists.
Usage: bohr.py <tau> [kinds...]"""
import sys, math, json
import numpy as np
import hk
from escape import coeffs, bounds
def primes_upto(n): return [p for p in range(2, n + 1) if all(p % q for q in range(2, int(p**0.5) + 1))]
def setup(kind, tau, N, PMAX):
    a = coeffs(kind, N); ps = primes_upto(PMAX)
    ns = [n for n in range(1, N + 1) if a[n] != 0]
    V = []; keep = []
    for n in ns:
        m = n; v = []
        for p in ps:
            e = 0
            while m % p == 0: m //= p; e += 1
            v.append(e)
        if m == 1: V.append(v); keep.append(n)
    n = np.array(keep, dtype=float); l = np.log(n)
    return np.array([a[int(k)] for k in keep]), np.exp(-(tau/4)*l*l), l, np.array(V, dtype=float), ps
def has_zero(c, V, rng, starts=300):
    best = 1e9
    for _ in range(starts):
        th = rng.random(V.shape[1])*2*math.pi
        for it in range(60):
            e = c*np.exp(-1j*(V @ th)); F = e.sum()
            if abs(F) < 1e-13: return True, abs(F)
            J = (-1j*V*e[:, None]).sum(0)                       # dF/dtheta
            A = np.array([J.real, J.imag]); b = -np.array([F.real, F.imag])
            d, *_ = np.linalg.lstsq(A, b, rcond=None)
            nd = np.linalg.norm(d)
            if nd > 1.0: d = d/nd
            th = th + d
        best = min(best, abs(F))
    return False, best
def sup(kind, tau, N=600, PMAX=23, seed=0):
    a, g, l, V, ps = setup(kind, tau, N, PMAX)
    b = bounds(kind, tau, 20000); rng = np.random.default_rng(seed)
    hi = b['sigma_abs']; lo = None
    for k in range(1, 200):                                   # first sigma below sigma_abs (step 0.02) at which a zero is found
        s0 = b['sigma_abs'] - 0.02*k
        if has_zero(a*g*np.exp(-s0*l), V, rng, 60)[0]: lo = s0; hi = s0 + 0.02; break
    assert lo is not None
    for _ in range(26):
        mid = (lo + hi)/2
        if has_zero(a*g*np.exp(-mid*l), V, rng)[0]: lo = mid
        else: hi = mid
    lam = np.array([(-1)**int(v.sum()) for v in V])
    f = lambda s: float(np.sum(lam*a*g*np.exp(-s*l)))
    sL = None
    xs = np.linspace(b['sigma_abs'], b['sigma_abs'] - 3, 3001); vals = [f(x) for x in xs]
    for i in range(len(xs) - 1):
        if vals[i]*vals[i+1] < 0:
            u, w = xs[i], xs[i+1]
            for _ in range(60):
                m = (u + w)/2
                if f(u)*f(m) <= 0: w = m
                else: u = m
            sL = u; break
    return dict(kind=kind, tau=tau, sigma_plus_bohr=lo, sigma_L=sL, sigma_abs=b['sigma_abs'], sigma_3=b['sigma_3'], N=N, PMAX=PMAX, nterms=len(a))
if __name__ == '__main__':
    tau = float(sys.argv[1]); out = []
    for kind in sys.argv[2:]:
        r = sup(kind, tau); out.append(r); print(json.dumps(r), flush=True)
    json.dump(out, open('out/bohr_%g.json' % tau, 'w'), indent=1)
