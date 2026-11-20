"""ffanalyze.py: exact post-processing of the census list written by ffcensus.c.
For each kept (c_1..c_g): exact check a_d >= 0, d <= D (Python integers); exact inertia of the integer
Gram matrices G_N = [q^min(j,k) p_|j-k|], N = 1..2g+1 (same inertia as the Toeplitz matrix T_N = [S_{j-k}]),
by Descartes' rule on the exact characteristic polynomial (real-rooted, so the rule is exact);
Hasse-Weil-Serre |N_d - q^d - 1| <= g floor(2 q^{d/2}) for d <= g; first n with |S_n| > 2g;
float: eps = max log|beta|, lambda_min(T_2g), heat constant Lambda (bisection, then refined in mpmath for the minimisers).
usage: ffanalyze.py q g D census.txt out.json [nproc]"""
import sys, json, math, os
from math import isqrt, comb
from fractions import Fraction
import numpy as np
from flint import fmpz_mat, fmpz

def mobius(n):
    m, cnt = n, 0
    p = 2
    while p * p <= m:
        if m % p == 0:
            m //= p
            if m % p == 0: return 0
            cnt += 1
        p += 1
    if m > 1: cnt += 1
    return -1 if cnt % 2 else 1
MU = [0] + [mobius(n) for n in range(1, 400)]
DIVS = [[]] + [[e for e in range(1, n + 1) if n % e == 0] for n in range(1, 400)]

def full_coeffs(c, q, g):
    cc = [1] + list(c)
    for k in range(g + 1, 2 * g + 1): cc.append(cc[2 * g - k] * q ** (k - g))
    return cc
def power_sums(cc, g, nmax):
    p = [2 * g]
    for n in range(1, nmax + 1):
        s = 0
        for i in range(1, min(n - 1, 2 * g) + 1): s -= cc[i] * p[n - i]
        if n <= 2 * g: s -= n * cc[n]
        p.append(s)
    return p
def counts_ok(p, q, D):
    N = [None] + [q ** n + 1 - p[n] for n in range(1, D + 1)]
    for d in range(1, D + 1):
        da = sum(MU[d // e] * N[e] for e in DIVS[d])
        if da < 0: return False, d
        assert da % d == 0
    return True, 0
def neg_count(G):
    """number of negative eigenvalues of a symmetric integer matrix (exact)."""
    cp = [int(x) for x in G.charpoly().coeffs()]  # det(x - G), low to high
    n = len(cp) - 1
    seq = [cp[i] * (-1) ** i for i in range(n + 1)]  # p(-x) up to sign
    seq = [s for s in seq if s != 0]
    return sum(1 for a, b in zip(seq, seq[1:]) if (a > 0) != (b > 0))
def gram(p, q, N):
    return fmpz_mat(N, N, [q ** min(j, k) * p[abs(j - k)] for j in range(N) for k in range(N)])
def serre_ok(p, q, g):
    for d in range(1, g + 1):
        # floor(2 q^{d/2}) = isqrt(4 q^d)
        if abs(p[d]) > g * isqrt(4 * q ** d): return False, d
    return True, 0
def first_hasse_fail(p, q, g, nmax):
    for n in range(1, nmax + 1):
        if p[n] * p[n] > 4 * g * g * q ** n: return n
    return None
def heat_real(b, L, t, g):
    """True if H_t(theta) = b0 + 2 sum b_k e^{t (kL)^2/4} cos k theta has 2g real zeros per period."""
    from numpy.polynomial import chebyshev as Ch
    co = [b[0]] + [2 * b[k] * math.exp(t * (k * L) ** 2 / 4) for k in range(1, g + 1)]
    r = Ch.chebroots(co)
    return bool(np.all(np.abs(r.imag) < 1e-7) and np.all(np.abs(r.real) <= 1 + 1e-9))
def heat_lambda(cc, q, g):
    """Lambda = inf{t : H_t has only real zeros}; float bisection. Returns (Lambda, flag); -inf coded as None."""
    L = math.log(q)
    b = [cc[g + k] * q ** (-(g + k) / 2) for k in range(0, g + 1)]
    if heat_real(b, L, 0.0, g):
        lo, hi = -1.0, 0.0
        while heat_real(b, L, lo, g):
            lo *= 2
            if lo < -4096: return None
    else:
        lo, hi = 0.0, 1.0
        while not heat_real(b, L, hi, g):
            hi *= 2
            if hi > 4096: return float('inf')
    for _ in range(70):
        mid = (lo + hi) / 2
        if heat_real(b, L, mid, g): hi = mid
        else: lo = mid
    return hi
def analyze(args):
    c, q, g, D = args
    cc = full_coeffs(c, q, g)
    p = power_sums(cc, g, max(D, 4 * g + 4))
    ok, dfail = counts_ok(p, q, D)
    if not ok: return None
    negs = [neg_count(gram(p, q, N)) for N in range(1, 2 * g + 2)]
    nu = negs[2 * g - 1]
    ndet = next((N for N in range(1, 2 * g + 2) if negs[N - 1] > 0), None)
    s_ok, s_d = serre_ok(p, q, g)
    rec = dict(c=list(c), nu=nu, ndet=ndet, serre=s_ok, negs=negs)
    if nu > 0:
        rec['hasse_n'] = first_hasse_fail(p, q, g, len(p) - 1)
        roots = np.roots(cc)
        beta = roots / math.sqrt(q)  # np.roots on ascending coefficients returns the alpha_i
        rec['eps'] = float(np.max(np.log(np.abs(beta))))
        rec['nreal_ghost'] = int(np.sum((np.abs(np.abs(beta) - 1) > 1e-7) & (np.abs(beta.imag) < 1e-7)))
        S = [float(p[n]) * q ** (-n / 2) for n in range(0, 2 * g)]
        T = np.array([[S[abs(j - k)] for k in range(2 * g)] for j in range(2 * g)])
        rec['lmin'] = float(np.linalg.eigvalsh(T)[0])
    rec['Lam'] = heat_lambda(cc, q, g)
    return rec
def main():
    q, g, D = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3])
    rows = [tuple(int(x) for x in ln.split()) for ln in open(sys.argv[4]) if ln.strip()]
    nproc = int(sys.argv[6]) if len(sys.argv) > 6 else int(os.environ.get('RH_WORKERS', '1'))
    print(f'q={q} g={g} D={D} kept by screen={len(rows)} nproc={nproc}; planned memory: list of {len(rows)} records, < {len(rows) * 600 / 1e9:.2f} GB', flush=True)
    args = [(c, q, g, D) for c in rows]
    if nproc > 1:
        import multiprocessing as mp
        with mp.Pool(nproc) as pool: res = pool.map(analyze, args, chunksize=500)
    else: res = [analyze(a) for a in args]
    res = [r for r in res if r is not None]
    rh = [r for r in res if r['nu'] == 0]; fk = [r for r in res if r['nu'] > 0]
    summ = dict(q=q, g=g, D=D, screened=len(rows), members=len(res), rh=len(rh), fakes=len(fk))
    # consistency: Lambda sign vs nu
    summ['rh_Lam_pos'] = sum(1 for r in rh if r['Lam'] is not None and r['Lam'] > 1e-9)
    summ['fake_Lam_nonpos'] = sum(1 for r in fk if r['Lam'] is None or r['Lam'] <= 1e-12)
    summ['rh_serre_fail'] = sum(1 for r in rh if not r['serre'])
    if fk:
        from collections import Counter
        summ['ndet_hist'] = dict(sorted(Counter(r['ndet'] for r in fk).items()))
        summ['nu_hist'] = dict(sorted(Counter(r['nu'] for r in fk).items()))
        summ['fakes_pass_T_gplus1'] = sum(1 for r in fk if r['negs'][g] == 0)   # T_{g+1}: delays <= g
        summ['fakes_pass_T_2gminus1'] = sum(1 for r in fk if r['negs'][2 * g - 2] == 0)
        summ['fakes_pass_serre_d_le_g'] = sum(1 for r in fk if r['serre'])
        summ['fakes_pass_serre_and_T_gplus1'] = sum(1 for r in fk if r['serre'] and r['negs'][g] == 0)
        summ['hasse_n_hist'] = dict(sorted(Counter(str(r['hasse_n']) for r in fk).items(), key=lambda kv: (len(kv[0]), kv[0])))
        fin = [r for r in fk if r['Lam'] is not None and r['Lam'] > 1e-12 and r['Lam'] != float('inf')]
        fin.sort(key=lambda r: r['Lam'])
        summ['min_pos_Lam'] = fin[0]['Lam'] if fin else None
        summ['minimisers'] = fin[:5]
        summ['max_Lam_fake'] = fin[-1]['Lam'] if fin else None
        ee = sorted(fk, key=lambda r: r['eps'])
        summ['min_eps'] = ee[0]['eps']; summ['min_eps_rec'] = ee[0]
        rat = [(-r['lmin'] / r['eps'] ** 2) for r in fk if r['nu'] == 1]
        summ['C_ratio_nu1'] = [min(rat), float(np.median(rat)), max(rat)] if rat else None
        late = [r for r in fk if r['ndet'] == 2 * g]
        summ['n_late'] = len(late)
        summ['late_examples'] = sorted(late, key=lambda r: r['eps'])[:3]
        summ['fake_real_ghost_only'] = sum(1 for r in fk if r['nreal_ghost'] > 0)
    rl = [r['Lam'] for r in rh if r['Lam'] is not None]
    summ['rh_max_Lam'] = max(rl) if rl else None
    summ['rh_Lam_minus_inf'] = sum(1 for r in rh if r['Lam'] is None)
    json.dump(dict(summary=summ, fakes=fk if len(fk) <= 20000 else None), open(sys.argv[5], 'w'), default=str)
    print(json.dumps({k: v for k, v in summ.items() if k not in ('minimisers', 'late_examples', 'min_eps_rec')}, default=str), flush=True)
if __name__ == '__main__':
    main()
