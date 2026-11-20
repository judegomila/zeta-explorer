"""Bohr-lift (polydisc) checks.  float64.
(a) DH piece U_DH(z) = c1 prod_p e(chi(p) z_p) + c2 prod_p e(conj chi(p) z_p): search for zeros
    on tori |z_p| = p^{-sigma}; report largest sigma with a zero (bisection on min |U| = 0).
(b) additive ladder  sum_p (1 - z_p^{N+1})/(1 - z_p)  (the app's deformedZTL at beta=P=0) and
    1 + sum_p z_p/(1-z_p): zeros on the critical torus.
(c) inner-function bound: sup over torus of |E(1-s)/E(s)| against n_max^x for zeta products.
(d) heat-deformed squarefree ladder U_c(z) = sum_{S} exp(c (log n_S)^2) prod_{p in S} z_p :
    Lee-Yang polycircle |z_p| = p^{-c log M}; zero search inside it for c>0 and c<0.
"""
import json, math, sys, itertools
import numpy as np
from scipy.optimize import minimize
rng = np.random.default_rng(7)
PR = [2, 3, 7, 11, 13, 17, 19, 23]
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
C1 = (1 - 1j * KAPPA) / 2
CHI = {1: 1, 2: 1j, 3: -1j, 4: -1}
out = {}

def U_dh(theta, sigma, primes, N):
    a = 1 + 0j; b = 1 + 0j
    for th, p in zip(theta, primes):
        z = p ** (-sigma) * np.exp(1j * th); c = CHI[p % 5]
        if N is None:
            a *= 1 / (1 - c * z); b *= 1 / (1 - np.conj(c) * z)
        else:
            a *= sum((c * z) ** k for k in range(N + 1)); b *= sum((np.conj(c) * z) ** k for k in range(N + 1))
    return C1 * a + np.conj(C1) * b

def minabs(f, dim, tries=14):
    best = 1e9; bx = None
    for _ in range(tries):
        x0 = rng.uniform(0, 2 * math.pi, dim)
        r = minimize(lambda x: abs(f(x)) ** 2, x0, method='Nelder-Mead',
                     options=dict(xatol=1e-10, fatol=1e-24, maxiter=3000, maxfev=3000))
        if r.fun < best: best = r.fun; bx = r.x
        if best < 1e-20: break
    return math.sqrt(best), bx

res = {}
for P in (2, 3, 7, 13):
    primes = [p for p in PR if p <= P]
    eff = [p for p in primes if p % 5 in (2, 3)]         # chi real at p = +-1 mod 5: factor cancels in the zero condition only if both branches equal
    for N in (1, 4, None):
        f = lambda s: minabs(lambda th: U_dh(th, s, primes, N), len(primes))[0]
        m_half = f(0.5)
        if m_half > 1e-9:
            res[f"P={P} N={N}"] = dict(min_abs_on_critical_torus=m_half, sup_sigma_with_zero=None)
        else:
            lo, hi = 0.5, 2.0
            for _ in range(12):
                mid = (lo + hi) / 2
                if f(mid) < 1e-9: lo = mid
                else: hi = mid
            res[f"P={P} N={N}"] = dict(min_abs_on_critical_torus=m_half, sup_sigma_with_zero=lo)
        print('dh', P, N, res[f"P={P} N={N}"], flush=True)
out['dh_piece_zero_on_tori'] = res

# (b) additive ladder
resb = {}
for S in ([2, 3], [2, 3, 5], [2, 3, 5, 7]):
    for N in (1, 4, None):
        def g(th, S=S, N=N, const=1.0):
            tot = 0j
            for t, p in zip(th, S):
                z = p ** -0.5 * np.exp(1j * t)
                tot += (z / (1 - z)) if N is None else sum(z ** k for k in range(1, N + 1))
            return const + tot
        m1, _ = minabs(lambda th: g(th, const=1.0), len(S))
        mS, _ = minabs(lambda th: g(th, const=float(len(S))), len(S))
        resb[f"S={S} N={N}"] = dict(min_abs_1_plus_sum=m1, min_abs_app_ZTL=mS)
        print('additive', S, N, resb[f"S={S} N={N}"], flush=True)
out['additive_ladder_critical_torus'] = resb

# (c) inner-function bound for zeta products
resc = {}
for (P, N) in ((5, 1), (11, 1), (5, 4), (11, 4)):
    primes = [p for p in [2, 3, 5, 7, 11] if p <= P]
    nmax = math.prod(primes) ** N
    worst = -1e9
    for x in (0.01, 0.1, 0.5, 1.0, 2.0, 5.0):
        lr = 0.0
        th = np.linspace(0, 2 * math.pi, 20001)
        for p in primes:
            z1 = p ** (x - 0.5) * np.exp(1j * th); z0 = p ** (-x - 0.5) * np.exp(1j * th)
            f1 = sum(z1 ** k for k in range(N + 1)); f0 = sum(z0 ** k for k in range(N + 1))
            lr += float(np.max(np.log(np.abs(f1) / np.abs(f0))))
        worst = max(worst, lr / (x * math.log(nmax)))
        resc[f"P={P} N={N} x={x}"] = lr / (x * math.log(nmax))
    print('inner bound ratio psi(x)/(x log nmax), max', P, N, worst, flush=True)
out['psi_over_x_log_nmax'] = resc

# (d) heat-deformed squarefree ladder
resd = {}
primes = [2, 3, 5, 7, 11]
logs = np.array([math.log(p) for p in primes]); logM = float(logs.sum())
subsets = [np.array(s) for s in itertools.product((0, 1), repeat=len(primes))]
def U_c(z, c):
    tot = 0j
    for a in subsets:
        ln = float(a @ logs)
        tot += math.exp(c * ln * ln) * np.prod(z ** a)
    return tot
for c in (0.05, 0.2, -0.05, -0.2):
    rad = np.exp(-c * logs * logM)
    # zero search with all |zeta_p| = q < 1 (inside the Lee-Yang polycircle)
    rep = {}
    for q in (0.999, 0.9, 0.5):
        m, _ = minabs(lambda th: U_c(q * rad * np.exp(1j * th), c) / U_c(q * rad, abs(c) * 0 + c).real, len(primes), tries=14)
        rep[str(q)] = m
    # univariate specialisation z_p = y * rad_p : root moduli in y
    co = np.zeros(len(primes) + 1)
    for a in subsets:
        ln = float(a @ logs); co[int(a.sum())] += math.exp(c * ln * ln) * float(np.prod(rad ** a))
    rts = np.roots(co[::-1])
    resd[str(c)] = dict(min_abs_inside=rep, diag_root_moduli=sorted(float(abs(r)) for r in rts))
    print('heat-ising', c, resd[str(c)], flush=True)
out['heat_ising'] = resd
json.dump(out, open(sys.argv[1], 'w'), indent=1)
