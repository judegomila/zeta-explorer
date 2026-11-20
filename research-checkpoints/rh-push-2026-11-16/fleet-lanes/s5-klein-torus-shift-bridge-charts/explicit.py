"""Combination (4): prime-side (coefficient-side) evaluation of the smoothed log-derivative on the lines Re s = 1/2 + x.

  S_v(s) = sum_n Lambda_F(n) n^{-s} v(log n),   v(u) = int_u^inf phi,   phi(y) = (1/eta) beta((y - yc)/eta),
  beta(x) = (35/32)(1 - x^2)^3 on [-1,1],  yc = log X - eta  (v = 1 for n <= X e^{-2 eta}, v = 0 for n >= X).
Identity (CLASSICAL: truncated explicit formula averaged against phi), Phi(z) = int phi(y) e^{yz} dy = e^{yc z} betahat(eta z):
  -F_ar'/F_ar(s) = S_v(s) - [pole terms] + sum_rho Phi(rho - s)/(rho - s) + ...
  => for the completed function:  A_X(s) := -S_v(s) + G(s) = sum_rho (1 - Phi(rho - s))/(s - rho)   (G = gamma and pole part)
Output: S_v(1/2 + x_c + i t_k) on the uniform grid t_k = Tc + k delta, k = -N/2 .. N/2-1, for each x_c, by a type-1 NUFFT
(finufft, eps 1e-11) over the prime powers, or by direct summation when finufft is absent or DIRECT=1.
Coefficient models: ZETA, LCHI4, LCHI5, LIOU (lambda(n) Lambda(n)), SGN:<seed> (eps_p = +-1, PCG64), EA:<a> (Lambda(n)(n^a + n^-a)),
DH (Lambda_DH by Dirichlet convolution, all n <= X).  T-NR differs from ZETA only at powers of q: added in explicit_an.py.

usage: explicit.py MODEL X eta Tc delta log2N OUT x1 x2 ..."""
import sys, os, math, time, json
import numpy as np
from multiprocessing import Pool

def beta_cdf_upper(xx):
    """int_x^1 beta, clipped"""
    x = np.clip(xx, -1.0, 1.0)
    return 0.5 - (35.0 / 32.0) * (x - x ** 3 + 0.6 * x ** 5 - x ** 7 / 7.0)

def base_primes(n):
    sv = np.ones(n + 1, bool); sv[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if sv[i]: sv[i * i::i] = False
    return np.nonzero(sv)[0].astype(np.int64)

def seg_primes(lo, hi, bp):
    """primes in [lo, hi), lo >= 3 odd-only sieve"""
    if lo < 3: lo = 3
    lo |= 1
    n = (hi - lo + 1) // 2
    if n <= 0: return np.empty(0, np.int64)
    sv = np.ones(n, bool)
    lim = int(math.isqrt(hi)) + 1
    for p in bp[1:]:
        if p > lim: break
        st = max(p * p, ((lo + p - 1) // p) * p)
        if st % 2 == 0: st += p
        if st >= hi: continue
        sv[(st - lo) // 2::p] = False
    return lo + 2 * np.nonzero(sv)[0].astype(np.int64)

_G = {}
def _init(model, X, eta, Tc, delta, N, xs, direct):
    _G.update(model=model, X=X, eta=eta, Tc=Tc, delta=delta, N=N, xs=xs, direct=direct, bp=base_primes(int(math.isqrt(int(X))) + 2))
    if model.startswith('SGN'):
        rng = np.random.Generator(np.random.PCG64(int(model.split(':')[1])))
        _G['key'] = int(rng.integers(1, 2 ** 62))

def _coef(model, p):
    if model == 'ZETA' or model.startswith('EA'): return np.ones(len(p))
    if model == 'LCHI4': return np.where(p % 4 == 1, 1.0, np.where(p % 4 == 3, -1.0, 0.0))
    if model == 'LCHI5':
        r = p % 5; return np.where((r == 1) | (r == 4), 1.0, np.where(r == 0, 0.0, -1.0))
    if model == 'LIOU': return -np.ones(len(p))
    if model.startswith('SGN'):
        h = (p.astype(np.uint64) * np.uint64(0x9E3779B97F4A7C15) + np.uint64(_G['key'])); h ^= h >> np.uint64(31); h *= np.uint64(0xBF58476D1CE4E5B9); h ^= h >> np.uint64(29)
        return 1.0 - 2.0 * ((h >> np.uint64(40)) & np.uint64(1)).astype(float)
    raise KeyError(model)

def _accum(n, lam):
    """add sum lam_j n_j^{-1/2-x-it} v(log n_j) for the arrays n (float64 or int64), lam"""
    X, eta, Tc, delta, N, xs = (_G[k] for k in ('X', 'eta', 'Tc', 'delta', 'N', 'xs'))
    lg = np.log(n.astype(np.longdouble))
    v = beta_cdf_upper(((lg - (math.log(X) - eta)) / eta).astype(float))
    keep = v > 0
    if not keep.all(): lg = lg[keep]; lam = lam[keep]; v = v[keep]
    twopi = 2 * np.longdouble(np.pi)
    ph = np.fmod(np.longdouble(Tc) * lg, twopi).astype(float)
    lgf = lg.astype(float)
    base = lam * v * np.exp(-0.5 * lgf) * np.exp(-1j * ph)
    c = np.empty((len(xs), len(lgf)), complex)
    for i, x in enumerate(xs): c[i] = base * np.exp(-x * lgf)
    if _G['model'].startswith('EA'):
        a = float(_G['model'].split(':')[1]); c *= (np.exp(a * lgf) + np.exp(-a * lgf))[None, :]
    if _G['direct']:
        k = np.arange(-N // 2, N // 2)
        out = np.zeros((len(xs), N), complex)
        for j0 in range(0, len(lgf), 4096):
            E = np.exp(-1j * delta * np.outer(k, lgf[j0:j0 + 4096]))
            out += (E @ c[:, j0:j0 + 4096].T).T
        return out
    import finufft
    xj = np.fmod(-delta * lgf, 2 * np.pi)
    return finufft.nufft1d1(xj, c, N, eps=1e-11, isign=1, nthreads=1)

def _work(rng):
    lo, hi = rng; model = _G['model']; N = _G['N']; tot = np.zeros((len(_G['xs']), N), complex); cnt = 0
    step = 1 << 27
    for a in range(lo, hi, step):
        b = min(a + step, hi)
        p = seg_primes(a, b, _G['bp'])
        if a <= 2 < b: p = np.concatenate([[2], p])
        if len(p) == 0: continue
        cf = _coef(model, p)
        tot += _accum(p, cf * np.log(p.astype(float))); cnt += len(p)
    return tot, cnt

def dh_lambda(Nmax):
    """Lambda_DH(n), n <= Nmax:  sum_{d|n} Lambda(d) a(n/d) = a(n) log n,  a = (1, kappa, -kappa, -1, 0) mod 5"""
    kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
    co = np.array([0.0, 1.0, kap, -kap, -1.0])
    n = np.arange(Nmax + 1); a = co[n % 5]; a[0] = 0
    L = a * np.log(np.maximum(n, 1))
    for d in range(2, Nmax // 2 + 1):
        ld = L[d]
        if ld != 0.0:
            m = np.arange(2, Nmax // d + 1)
            L[d * m] -= ld * a[m]
    return L

def main():
    model, X, eta, Tc, delta, lg, out = sys.argv[1:8]; xs = [float(v) for v in sys.argv[8:]]
    X = float(X); eta = float(eta); Tc = float(Tc); delta = float(delta); N = 1 << int(lg)
    nw = int(os.environ.get('RH_WORKERS', '1')); direct = int(os.environ.get('DIRECT', '0'))
    try: import finufft
    except Exception: direct = 1
    print('explicit %s X=%g eta=%g Tc=%g delta=%g N=2^%s lines %s workers %d direct %d; per-worker accumulators %.2f GB' %
          (model, X, eta, Tc, delta, lg, xs, nw, direct, 2 * len(xs) * N * 16 / 1e9), flush=True)
    t0 = time.time(); _init(model, X, eta, Tc, delta, N, xs, direct)
    tot = np.zeros((len(xs), N), complex); cnt = 0
    if model == 'DH':
        L = dh_lambda(int(X)); n = np.nonzero(L)[0]
        print('Lambda_DH built %.1f s; max |Lambda_DH(n)| n^-1 = %.3e' % (time.time() - t0, np.abs(L[n] / n).max()), flush=True)
        for j0 in range(0, len(n), 1 << 22): tot += _accum(n[j0:j0 + (1 << 22)], L[n[j0:j0 + (1 << 22)]])
        cnt = len(n)
    else:
        Xi = int(X) + 1; nr = max(nw * 4, 1); edges = np.linspace(2, Xi, nr + 1).astype(np.int64)
        edges[1:-1] = (edges[1:-1] // (1 << 27)) * (1 << 27); edges = np.unique(edges)
        with Pool(nw, initializer=_init, initargs=(model, X, eta, Tc, delta, N, xs, direct)) as pool:
            for t, c in pool.imap_unordered(_work, list(zip(edges[:-1], edges[1:]))):
                tot += t; cnt += c
        # prime powers p^k, k >= 2
        bp = _G['bp']; ns = []; lam = []
        for p in bp:
            p = int(p)
            if p * p > X: break
            cp = float(_coef(model, np.array([p], np.int64))[0]); q = p * p; k = 2
            while q <= X: ns.append(q); lam.append(cp ** k * math.log(p)); q *= p; k += 1
        if ns: tot += _accum(np.array(ns, np.int64), np.array(lam)); cnt += len(ns)
    np.savez(out, S=tot, xs=np.array(xs), meta=json.dumps(dict(model=model, X=X, eta=eta, Tc=Tc, delta=delta, N=N, terms=int(cnt), seconds=time.time() - t0)))
    print('terms %d  done %.1f s' % (cnt, time.time() - t0), flush=True)

if __name__ == '__main__':
    main()
