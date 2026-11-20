"""Combination 1, mollifier-independent side. If T(N) > 0 for some mollifier then the window polynomial
P(z) = sum_{n<=N} a(n) b_t(n) n^-sigma prod_p z_p^{v_p(n)} has no zero on the torus |z_p| = 1 (E(z)P(z) = 1 + sum_{n>=2} B_n n^-sigma z^n and sum |B_n| n^-sigma < 1).
Search for torus zeros by minimising |P|^2 over the prime phases (L-BFGS, multi-start); min |P| = 0 certifies that no mollifier of any support passes.
Usage: c1_torus.py N [F,...]"""
import sys, math, json
import numpy as np, scipy.sparse as sp
from scipy.optimize import minimize
from lib import coefs, consts, primes_upto, Y0, T0, SEED
N = int(float(sys.argv[1])); FUN = sys.argv[2].split(',') if len(sys.argv) > 2 else ['ZETA', 'DH', 'TNR']
pr = primes_upto(N); rows = []; cols = []; vals = []
for i, p in enumerate(pr):
    pk = int(p)
    while pk <= N:
        m = np.arange(pk, N + 1, pk); rows.append(m - 1); cols.append(np.full(len(m), i)); vals.append(np.ones(len(m))); pk *= int(p)
V = sp.csr_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))), shape=(N, len(pr))); VT = V.T.tocsr()
ln = np.log(np.arange(1, N + 1)); rng = np.random.default_rng(SEED)
def minP(a, t, nstart=12):
    xN, L, sigma, K, g = consts(N, t, Y0); c = a[1:N + 1] * np.exp((t / 4) * ln * ln - sigma * ln)
    def f(th):
        term = c * np.exp(1j * (V @ th)); P = term.sum()
        return abs(P) ** 2, VT @ (-2 * (np.conj(P) * term).imag)
    best = 1e9
    starts = [np.full(len(pr), math.pi)] + [rng.uniform(0, 2 * math.pi, len(pr)) for _ in range(nstart)]
    starts.append(np.where(pr % 5 == 2, math.pi / 2, np.where(pr % 5 == 3, -math.pi / 2, 0.0)))
    for th0 in starts:
        r = minimize(f, th0, jac=True, method='L-BFGS-B', options=dict(maxiter=400))
        best = min(best, math.sqrt(max(r.fun, 0)))
        if best < 1e-9: break
    return best, float(np.abs(c).sum())
out = []
for nm in FUN:
    a = coefs(nm, N).astype(np.complex128)
    hi = None; lo = None
    for t in (0.50, 0.40, 0.34, 0.30, 0.27, 0.25, 0.23, 0.21, 0.19, 0.175, T0, 0.14, 0.12, 0.10):
        m, l1 = minP(a, t); r = dict(F=nm, N=N, t=t, min_abs_P_torus=m, l1=l1); out.append(r); print(json.dumps(r), flush=True)
        if m < 1e-5: lo = t; break
        hi = t
    if hi is not None and lo is not None:
        for _ in range(6):
            mid = (lo + hi) / 2; m, l1 = minP(a, mid); out.append(dict(F=nm, N=N, t=mid, min_abs_P_torus=m, l1=l1)); print(json.dumps(out[-1]), flush=True)
            if m < 1e-5: lo = mid
            else: hi = mid
        r = dict(F=nm, N=N, torus_zero_found_up_to_t=lo, no_zero_found_from_t=hi); out.append(r); print(json.dumps(r), flush=True)
json.dump(out, open('c1_torus_%d.json' % N, 'w'), indent=1)
