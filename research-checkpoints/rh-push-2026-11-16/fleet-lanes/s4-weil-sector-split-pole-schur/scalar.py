"""Combination 2: scalar comparison (G_W + mu)^{-1/2} V_W (G_W + mu)^{-1/2} <= I on step functions of mesh h, support W = m h.
Source normalisation (atlas section 11): a(t) = Re psi(5/4 + it/2) - log pi, a_0 = a(0), G = A - a_0,
d nu = sum Lambda(n) n^{-1/2} delta_{log n} - e^{r/2} dr,  V_W[f] = 2 Re int_[0,W) R_f d nu,  q_W = G + a_0 - V_W.
Identity used throughout:  lambda_max((G+mu)^{-1/2} V (G+mu)^{-1/2}) <= 1  iff  lambda_min(q_W) >= a_0 - mu.
Box basis b_i = h^{-1/2} 1_[ih,(i+1)h): every form is a Toeplitz matrix with entries K_|i-j| = int tent_d(r) k(r) dr.
float64 (numpy, or cupy on the GPU when available). A value on this subspace is a lower bound for the supremum over L^2.

usage: python scalar.py MODE h Wmax outfile        MODE = validate | sweep | big
"""
import sys, json, math, time, os
import numpy as np
from scipy.special import polygamma, digamma

try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=24 * 1024 ** 3)
    _ = cp.zeros(4).sum()
    xp = cp; GPU = True
except Exception:
    cp = None; xp = np; GPU = False


# ---------------- Toeplitz first columns ----------------
def gam_col(z, h, m):
    """entries K_0..K_{m-1} of the form with symbol Re psi(z + it/2) - psi(z)  (time kernel sum_k [delta/(k+z) - e^{-2(k+z)|r|}])"""
    K = np.zeros(m)
    kmax0 = int(45 / (2 * h)) + 10
    k = np.arange(kmax0); c = 2 * (k + z)
    K[0] = polygamma(1, z) / (2 * h) - np.sum(2 * np.exp(-c * h) / (c * c * h))
    if m > 1:
        K[1] = -(polygamma(1, z) / (4 * h) - np.sum((2 * np.exp(-c * h) - np.exp(-2 * c * h)) / (c * c * h)))
    base = (1 - np.exp(-c * h)) ** 2 / (c * c * h)
    for d in range(2, m):
        kk = min(kmax0, int(45 / (2 * h * (d - 1))) + 10)
        K[d] = -np.sum(np.exp(-c[:kk] * (d - 1) * h) * base[:kk])
    return K


def pole_col(p, h, m, kind):
    """kind 'cosh': kernel 2 cosh(p r); kind 'exp': kernel e^{p |r|}.  (cosh(ph) - 1 is evaluated as 2 sinh^2(ph/2):
    the direct difference loses 1e-9 relative accuracy at h = 0.001 and showed up as -4e-8 in lambda_min of zeta.)"""
    d = np.arange(m)
    f = 4 * math.sinh(p * h / 2) ** 2 / (p * p * h)
    if kind == 'cosh': return 2 * np.cosh(p * d * h) * f
    K = np.exp(p * d * h) * f
    x = p * h
    em = sum(x ** k / math.factorial(k) for k in range(2, 14))      # e^x - 1 - x
    K[0] = 2 * em / (p * p * h)
    return K


def prime_col(logn, wts, h, m):
    """entries of sum_n w_n (delta_{log n} + delta_{-log n}): K_d = sum_n w_n tent((log n - d h)/h)"""
    K = np.zeros(m + 2)
    u = logn / h
    j = np.floor(u).astype(np.int64); fr = u - j
    ok = j < m + 1
    np.add.at(K, j[ok], (wts * (1 - fr))[ok])
    np.add.at(K, j[ok] + 1, (wts * fr)[ok])
    return K[:m]


# ---------------- coefficients ----------------
def mangoldt(K):
    lam = np.zeros(K + 1); pr = np.zeros(K + 1, dtype=np.int64); ex = np.zeros(K + 1, dtype=np.int64)
    sieve = np.ones(K + 1, dtype=bool); sieve[:2] = False
    for p in range(2, K + 1):
        if sieve[p]:
            sieve[p * p::p] = False
            q = p; e = 1
            while q <= K:
                lam[q] = math.log(p); pr[q] = p; ex[q] = e
                q *= p; e += 1
    return lam, pr, ex


def dh_coef(K):
    s5 = math.sqrt(5); kap = (math.sqrt(10 - 2 * s5) - 2) / (s5 - 1)
    ap = np.array([0, 1, kap, -kap, -1.0])
    c = np.zeros(K + 1); acc = np.zeros(K + 1)
    n = np.arange(K + 1)
    base = ap[n % 5] * np.log(np.maximum(n, 1))
    for d in range(2, K + 1):
        c[d] = base[d] - acc[d]
        if c[d] != 0 and 2 * d <= K:
            ks = np.arange(2, K // d + 1)
            acc[d * ks] += c[d] * ap[ks % 5]
    return c


PRIMES_CACHE = {}
def objects(K):
    """name -> dict(c = real coefficient array 0..K, own = (zs, shift, poles) or None)
    own: gamma parameters z_j (with zeta's pole absorbed: z = 5/4 and kernel e^{r/2}), shift = 2 log Q, pole list for 'cosh' kernels."""
    lam, pr, ex = mangoldt(K)
    n = np.arange(K + 1)
    O = {}
    O['ZETA'] = dict(c=lam.copy(), own='zeta')
    chi3 = np.array([0, 1, -1.0]); chi5 = np.array([0, 1, -1, -1, 1.0])
    O['CHI-3'] = dict(c=lam * chi3[n % 3], own=([0.75], math.log(3), []))
    O['CHI5'] = dict(c=lam * chi5[n % 5], own=([0.25], math.log(5), []))
    Kd = min(K, 200000)                      # DH coefficients only for n <= 2e5 (its exceedance is near W = 4.7); zero beyond
    cd = np.zeros(K + 1); cd[:Kd + 1] = dh_coef(Kd)
    O['DH'] = dict(c=cd, own=([0.75], math.log(5), []))
    O['DHcoef-ZETAframe'] = dict(c=cd, own=None)
    for q in (2, 3, 5, 7, 101):
        c = lam.copy()
        s0, s1 = 2.0, -2.2 * math.sqrt(q); m = q
        while m <= K:
            c[m] -= s1 * math.log(q)
            s0, s1 = s1, (-2.2 * math.sqrt(q)) * s1 - q * s0
            m *= q
        O['TNR-q%d-c2.2' % q] = dict(c=c, own=('zeta', 2 * math.log(q)))
    for b, nm in ((0.125, 'EA-1/8'), (0.25, 'EA-1/4')):
        nn = np.maximum(n, 1).astype(float)
        O[nm] = dict(c=lam * (nn ** b + nn ** (-b)), own=([0.25 + b / 2, 0.25 - b / 2], 0.0, [0.5 + b, 0.5 - b]))
    primes = np.nonzero((ex == 1))[0]
    sgn_all = np.ones(K + 1)
    O['LIOUVILLE'] = dict(c=lam * np.where(ex % 2 == 1, -1.0, 1.0), own=None)
    f2 = lam.copy(); k2 = 2; e = 1
    while k2 <= K: f2[k2] *= (-1) ** e; k2 *= 2; e += 1
    O['FLIP2'] = dict(c=f2, own=None)
    for j in range(2):
        rng = np.random.Generator(np.random.PCG64(440000 + j))
        eps = np.ones(K + 1); eps[primes] = rng.integers(0, 2, len(primes)) * 2 - 1.0
        O['SGN-%02d' % j] = dict(c=lam * np.where(pr > 0, eps[pr] ** ex, 0.0), own=None)
    for j in range(2):
        rng = np.random.Generator(np.random.PCG64(450000 + j))
        th = np.zeros(K + 1); th[primes] = 2 * math.pi * rng.random(len(primes))
        O['U-%02d(Re)' % j] = dict(c=lam * np.cos(ex * th[pr]), own=None)
    alpha = 1.2393168126993495
    O['WT(Re)'] = dict(c=lam * np.cos(alpha * np.log(np.maximum(n, 1))), own=None)
    return O


A0_ZETA = float(digamma(1.25) - math.log(math.pi))


def columns(obj, h, m, K, cache):
    """returns dict of Toeplitz columns: Vswap (control charge with zeta's pole charge), G (zeta, z = 5/4),
    and for own forms: Gown, a0own, Vown."""
    c = obj['c'][:K + 1]
    idx = np.nonzero(c)[0]
    logn = np.log(idx); w = c[idx] / np.sqrt(idx)
    P = prime_col(logn, w, h, m)
    if 'G54' not in cache:
        cache['G54'] = gam_col(1.25, h, m); cache['pexp'] = pole_col(0.5, h, m, 'exp')
    out = dict(P=P, G=cache['G54'], Vswap=P - cache['pexp'], idx=idx, logn=logn, w=w)
    own = obj['own']
    if own == 'zeta':
        out.update(Gown=cache['G54'], a0own=A0_ZETA, Vown=out['Vswap'])
    elif own is not None and own[0] == 'zeta':
        out.update(Gown=cache['G54'], a0own=A0_ZETA + own[1], Vown=out['Vswap'])
    elif own is not None:
        zs, shift, poles = own
        G = np.zeros(m)
        for z in zs:
            key = 'G%.5f' % z
            if key not in cache: cache[key] = gam_col(z, h, m)
            G = G + cache[key]
        V = P.copy()
        for p in poles: V = V - pole_col(p, h, m, 'cosh')
        out.update(Gown=G, a0own=shift + sum(float(digamma(z)) - math.log(math.pi) for z in zs), Vown=V)
    return out


def toep(col, m):
    col = xp.asarray(col[:m])
    i = xp.arange(m, dtype=xp.int32)
    return col[xp.abs(i[:, None] - i[None, :])]


def lam_min_q(G, V, a0, m):
    """lowest eigenvalue and eigenvector of q = G + a0 - V on the leading m cells"""
    Q = toep(G - V, m)
    w, U = xp.linalg.eigh(Q)
    v = U[:, 0]
    return float(w[0]) + a0, (cp.asnumpy(v) if GPU else v), int((w + a0 < 0).sum())


def pencil_max(G, V, mu, m):
    """largest eigenvalue of (G+mu)^{-1/2} V (G+mu)^{-1/2} on the leading m cells, with its eigenvector f (in the box basis)"""
    A = toep(G, m) + mu * xp.eye(m)
    L = xp.linalg.cholesky(A)
    Vm = toep(V, m)
    if GPU:
        from cupyx.scipy.linalg import solve_triangular
    else:
        from scipy.linalg import solve_triangular
    Y = solve_triangular(L, Vm, lower=True)
    C = solve_triangular(L, Y.T, lower=True)
    C = (C + C.T) / 2
    w, U = xp.linalg.eigh(C)
    f = solve_triangular(L.T, U[:, -1], lower=False)
    f = f / xp.linalg.norm(f)
    return float(w[-1]), (cp.asnumpy(f) if GPU else f)


def dyadic_blocks(f, cols, h):
    """V[f] split by dyadic blocks of n: 2 sum_d K^{(j)}_d R_f(d)."""
    m = len(f)
    R = np.correlate(f, f, mode='full')[m - 1:]          # R[d] = sum_i f_i f_{i+d}
    idx, logn, w = cols['idx'], cols['logn'], cols['w']
    out = {}
    jb = np.floor(np.log2(idx)).astype(int)
    for j in sorted(set(jb.tolist())):
        sel = jb == j
        if logn[sel].min() >= m * h: continue
        Kj = prime_col(logn[sel], w[sel], h, m)
        out[int(j)] = float(2 * np.dot(Kj[1:], R[1:]) + Kj[0] * R[0])
    return out


def run_point(nm, cols, h, m, mus, variant):
    G = cols['G'] if variant == 'swap' else cols['Gown']
    V = cols['Vswap'] if variant == 'swap' else cols['Vown']
    a0 = A0_ZETA if variant == 'swap' else cols['a0own']
    lam, v, nneg = lam_min_q(G, V, a0, m)
    rec = dict(obj=nm, variant=variant, W=m * h, m=m, h=h, lam_min_q=lam, a0=a0, nneg=nneg, pencil={})
    for mu in mus:
        lm, f = pencil_max(G, V, mu, m)
        rec['pencil'][str(mu)] = lm
        if lm > 1:
            db = dyadic_blocks(f, cols, h)
            tot = sum(db.values())
            top = max(db, key=lambda j: abs(db[j]))
            rec.setdefault('blocks', {})[str(mu)] = dict(V_primes=tot, top_block='[2^%d, 2^%d)' % (top, top + 1), top_value=db[top],
                                                        blocks={str(j): x for j, x in db.items()})
    return rec


def first_exceed(nm, cols, h, mmax, mu, variant, mmin):
    """smallest m (bisection; lambda_min(q_W) is nonincreasing in W) with lambda_min(q) < a0 - mu"""
    G = cols['G'] if variant == 'swap' else cols['Gown']
    V = cols['Vswap'] if variant == 'swap' else cols['Vown']
    a0 = A0_ZETA if variant == 'swap' else cols['a0own']
    def bad(m): return lam_min_q(G, V, a0, m)[0] < a0 - mu
    def neg(m): return lam_min_q(G, V, a0, m)[0] < 0
    res = {}
    for key, test in (('exceed', bad), ('weil_negative', neg)):
        if not test(mmax): res[key] = None; continue
        lo, hi = mmin, mmax
        if test(lo): res[key] = lo * h; continue
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if test(mid): hi = mid
            else: lo = mid
        res[key] = hi * h
    return res


if __name__ == '__main__':
    MODE = sys.argv[1]; h = float(sys.argv[2]); Wmax = float(sys.argv[3]); OUT = sys.argv[4]
    mus = [1e-2, 1e-4, 1e-6]
    mmax = int(round(Wmax / h))
    K = int(math.exp(mmax * h)) + 1
    print('mode %s, GPU %s, h = %g, Wmax = %g, m = %d, coefficients n <= %d; planned dense float64 matrices %d x %d = %.2f GB each (about 6 live)'
          % (MODE, GPU, h, Wmax, mmax, K, mmax, mmax, mmax * mmax * 8 / 1e9), flush=True)
    t0 = time.time()
    O = objects(K)
    cache = {}
    out = {'h': h, 'Wmax': mmax * h, 'a0': A0_ZETA, 'gpu': GPU, 'rows': [], 'first': {}}
    print('objects built %.0fs' % (time.time() - t0), flush=True)
    if MODE == 'validate':
        import mpmath as mp
        cz = columns(O['ZETA'], h, mmax, K, cache)
        # (a) constant vector: (h/W) sum_ij K_|i-j| = 2 Psi(W)/W, Psi from the closed form (z = 1/4 with 2cosh pole, PR 21)
        W = mmax * h
        def tsum(col): return (h / W) * (mmax * col[0] + 2 * sum((mmax - d) * col[d] for d in range(1, mmax)))
        q54 = tsum(cz['G']) + A0_ZETA - tsum(cz['Vswap'])
        g14 = gam_col(0.25, h, mmax); pc = pole_col(0.5, h, mmax, 'cosh')
        q14 = tsum(g14) + float(digamma(0.25)) - math.log(math.pi) + tsum(pc) - tsum(cz['P'])
        mp.mp.dps = 30; z = mp.mpf(1) / 4; Wm = mp.mpf(W)
        psi = (Wm / 2) * (mp.digamma(z) - mp.log(mp.pi)) + mp.nsum(lambda k: (1 - mp.exp(-2 * (k + z) * Wm)) / (4 * (k + z) ** 2), [0, mp.inf]) \
            + 2 * (mp.cosh(Wm / 2) - 1) / mp.mpf('0.25') - sum(mp.mangoldt(n) / mp.sqrt(n) * (Wm - mp.log(n)) for n in range(2, K + 1) if mp.log(n) < Wm)
        out['box'] = {'W': W, 'closed_form_2Psi/W': float(2 * psi / Wm), 'toeplitz_5/4_form': q54, 'toeplitz_1/4_form': q14}
        # (b) matrices in the two normalisations agree
        d54 = cz['G'] - cz['Vswap']; d14 = g14 + pc - cz['P']
        d54[0] += A0_ZETA; d14[0] += float(digamma(0.25)) - math.log(math.pi)
        out['norm_5/4_vs_1/4_max_abs_diff'] = float(np.max(np.abs(d54 - d14)))
        out['G_row_sum_to_0'] = float(cz['G'][0] + 2 * cz['G'][1:].sum())
        # (c) pencil identity on one object
        cd = columns(O['FLIP2'], h, mmax, K, cache)
        for mu in mus:
            lm, f = pencil_max(cd['G'], cd['Vswap'], mu, mmax)
            lq = lam_min_q(cd['G'], cd['Vswap'], A0_ZETA, mmax)[0]
            out.setdefault('identity', []).append({'mu': mu, 'pencil_max': lm, 'lam_min_q': lq, 'a0-mu': A0_ZETA - mu, 'consistent': (lm > 1) == (lq < A0_ZETA - mu)})
        print(json.dumps(out, indent=1)); json.dump(out, open(OUT, 'w'), indent=1); sys.exit()
    Wgrid = [w for w in [math.log(x) for x in (4, 10, 30, 100, 300, 1000, 3000, 1e4, 3e4, 1e5, 3e5, 1e6)] if w <= mmax * h + 1e-9]
    names = list(O) if MODE == 'sweep' else ['ZETA', 'CHI-3', 'CHI5']
    for nm in names:
        cols = columns(O[nm], h, mmax, K, cache)
        variants = (['own'] if O[nm]['own'] is not None and nm != 'ZETA' else []) + (['swap'] if nm != 'DH' else [])
        for variant in variants:
            if MODE == 'sweep':
                fe = first_exceed(nm, cols, h, mmax, 1e-2, variant, max(2, int(0.2 / h)))
                out['first']['%s|%s' % (nm, variant)] = fe
                print(nm, variant, 'first', json.dumps(fe), '%.0fs' % (time.time() - t0), flush=True)
                pts = Wgrid if nm in ('ZETA', 'CHI-3', 'CHI5') else []
                if fe['exceed'] is not None:
                    pts = [w for w in pts if w < fe['exceed']] + [fe['exceed']]
            else:
                pts = Wgrid[-3:]
            for W in pts:
                m = int(round(W / h))
                rec = run_point(nm, cols, h, m, mus, variant)
                out['rows'].append(rec)
                print(json.dumps({k: rec[k] for k in ('obj', 'variant', 'W', 'm', 'lam_min_q', 'a0', 'pencil')}),
                      ('top block ' + rec['blocks'][str(mus[0])]['top_block']) if 'blocks' in rec and str(mus[0]) in rec['blocks'] else '', '%.0fs' % (time.time() - t0), flush=True)
            json.dump(out, open(OUT, 'w'), indent=1)
    print('written', OUT, '%.0fs' % (time.time() - t0), flush=True)
