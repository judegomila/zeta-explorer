# Lorentzian tests for Euler-product generating polynomials (exact rational arithmetic, numpy only for eigenvalue signs).
# (a) degree-d part of prod_p (1 - z_p)^{-1} = complete homogeneous h_d : Hessian signature of the quadratic derivatives.
# (b) one local factor sum_k a_k z^k y^{K-k}: Lorentzian iff a_k^2/C(K,k)^2 >= a_{k-1}a_{k+1}/(C(K,k-1)C(K,k+1)); normalised: a_k^2 >= a_{k-1}a_{k+1}.
# (c) M-convexity (exchange property) of supports.
import itertools, math, sys
from fractions import Fraction as Fr
import numpy as np

def inertia(M):
    w = np.linalg.eigvalsh(np.array(M, dtype=float))
    tol = 1e-9*max(1, abs(w).max())
    return int((w > tol).sum()), int((w < -tol).sum()), int((abs(w) <= tol).sum())

def monos(nv, d):
    return [a for a in itertools.product(range(d+1), repeat=nv) if sum(a) == d]

def quad_derivs(poly, nv, d):
    """all (d-2)-fold partial derivatives: returns dict alpha -> symmetric nv x nv Hessian matrix (constant)."""
    out = {}
    for al in monos(nv, d-2):
        H = [[Fr(0)]*nv for _ in range(nv)]
        for i in range(nv):
            for j in range(nv):
                b = list(al); b[i] += 1; b[j] += 1; b = tuple(b)
                c = poly.get(b, Fr(0))
                if c:
                    f = Fr(1)
                    for t in b: f *= math.factorial(t)
                    H[i][j] = c*f
        out[al] = H
    return out

def lorentz_report(name, poly, nv, d):
    Q = quad_derivs(poly, nv, d)
    worst = max(inertia(H)[0] for H in Q.values())
    nonneg = all(c >= 0 for c in poly.values())
    supp = [a for a, c in poly.items() if c != 0]
    S = set(supp); mconv = True
    for a in supp:
        for b in supp:
            for i in range(nv):
                if a[i] > b[i]:
                    ok = False
                    for j in range(nv):
                        if a[j] < b[j]:
                            c = list(a); c[i] -= 1; c[j] += 1
                            if tuple(c) in S: ok = True; break
                    if not ok: mconv = False
    print('%-44s nonneg %s | M-convex support %s | max positive index over all %d quadratic derivatives: %d | Lorentzian: %s' % (
        name, nonneg, mconv, len(Q), worst, nonneg and mconv and worst <= 1))

def euler_poly(local, primes_w, d):
    """degree-d part of prod_p sum_k local(k) (w_p z_p)^k."""
    nv = len(primes_w); poly = {}
    for a in monos(nv, d):
        c = Fr(1)
        for i, k in enumerate(a): c *= local(i, k)*primes_w[i]**k
        if c: poly[a] = c
    return poly

def normalise(poly):
    out = {}
    for a, c in poly.items():
        f = Fr(1)
        for t in a: f *= math.factorial(t)
        out[a] = c/f
    return out

W = [Fr(1, 2), Fr(1, 3), Fr(1, 5), Fr(1, 7)]          # weights p^{-1} (sigma = 1); a diagonal rescaling
for d in (2, 3, 4):
    P = euler_poly(lambda i, k: Fr(1), W, d)
    lorentz_report('zeta, degree %d part (h_%d), 4 primes' % (d, d), P, 4, d)
    lorentz_report('  normalised N(h_%d)' % d, normalise(P), 4, d)
# controls
def cheb(x, k):          # U_k(x): coefficients of 1/(1 - 2x z + z^2)
    a, b = Fr(1), 2*x
    if k == 0: return a
    for _ in range(k-1): a, b = b, 2*x*b - a
    return b
for d in (3, 4):
    P = euler_poly(lambda i, k: cheb(Fr(13, 10), k), W, d)       # E_a type: alpha = p^a real, cosh(a log p)=1.3
    lorentz_report('EA-type local factors (hyperbolic), deg %d' % d, normalise(P), 4, d)
    P = euler_poly(lambda i, k: cheb(Fr(3, 10), k), W, d)        # tempered GL2 local factors, cos(theta)=0.3
    lorentz_report('tempered GL2 local factors, deg %d' % d, normalise(P), 4, d)
    P = euler_poly(lambda i, k: Fr(1, 2)**k if i == 0 else Fr(1), W, d)
    lorentz_report('TW+ (eps_2 = 1/2), deg %d' % d, normalise(P), 4, d)
    P = euler_poly(lambda i, k: Fr(-1)**k if i == 0 else Fr(1), W, d)
    lorentz_report('TW- (eps_2 = -1), deg %d' % d, normalise(P), 4, d)
    c = Fr(11, 5)
    nr = lambda k: Fr(1) if k == 0 else (1+c if k == 1 else 2+c)
    P = euler_poly(lambda i, k: nr(k) if i == 0 else Fr(1), W, d)
    lorentz_report('T-NR local factor at 2 (c=2.2), deg %d' % d, normalise(P), 4, d)
    nr2 = lambda k: Fr(1) if k == 0 else (1-c if k == 1 else 2-c)
    P = euler_poly(lambda i, k: nr2(k) if i == 0 else Fr(1), W, d)
    lorentz_report('T-NR local factor at 2 (c=-2.2), deg %d' % d, normalise(P), 4, d)
    P = euler_poly(lambda i, k: Fr(1) if k <= 1 else Fr(0), W, d)   # squarefree part: elementary symmetric e_d
    lorentz_report('elementary symmetric e_%d (zeta(s)/zeta(2s))' % d, P, 4, d)
# DH: not an Euler product; the multivariate lift of its Dirichlet polynomial on 2,3 has a negative coefficient
k = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
per = [0, 1, k, -k, -1]
print('DH coefficients a(2),a(3),a(4),a(6),a(9):', [round(per[n % 5], 4) for n in (2, 3, 4, 6, 9)], ' a(6)-a(2)a(3) = %.4f' % (per[1]-per[2]*per[3]))
# (d) single-prime Weil form: symbol 2 Re log p/(p^{1/2+it}-1) takes both signs
for p in (2, 3, 5):
    import cmath
    vals = [2*(math.log(p)/(p**0.5*cmath.exp(1j*t*math.log(p))-1)).real for t in np.linspace(0, 2*math.pi/math.log(p), 2001)]
    print('prime %d: symbol of the single-prime form on one period: max %.4f, min %.4f, fraction of period positive %.3f' % (p, max(vals), min(vals), sum(1 for x in vals if x > 0)/len(vals)))
