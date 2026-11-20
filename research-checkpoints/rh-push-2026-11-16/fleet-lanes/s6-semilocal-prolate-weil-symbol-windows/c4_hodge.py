#!/usr/bin/env python3
"""Combination 4: Weil form in intersection coordinates on Gaussian graph classes at the arithmetic nodes u_i = log n, n = 1..M (all integers).
Z(d) = P(d) + A(d) - Prime(d)   (definitions of push/box-hodge-signature/bh.py; d = u_i - u_j, width s, v = 2 s^2, c0 = 2 pi s^2, amp = s sqrt(pi)):
  Prime_ij = amp (T + T^H)_ij,  T_ij = sum_q c(q) q^(-1/2) exp(-(log(q j / i))^2 / (4 s^2))
  A_ij     = (c0/pi) int_0^inf e^(-v t^2/2) W(t) cos(t d) dt,  W = const + sum_z Re psi(z + it/2)   (trapezoid; assembled as B^T diag B)
  P_ij     = c0 sum_tau e^(v tau^2/2) 2 cosh(tau d)
Full intersection form on (fibre classes, D_1..D_M) has inertia (npoles + i_-(Z), npoles + i_+(Z)): an extra positive eigenvalue <=> a negative eigenvalue of Z.
float64 screen (GPU if present): eigenvalues of the Jacobi-scaled leading blocks. usage: c4_hodge.py OBJ s MMAX [OUT]"""
import sys, math, time, json, os
import numpy as np
import s6lib
try:
    if os.environ.get('S6_NUMPY'): raise ImportError
    import cupy as xp, cupyx
    xp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('S6_POOL_GB', '22')) * 1024**3)); GPU = True
    def scat(a, i, v): cupyx.scatter_add(a, i, v)
except Exception:
    import numpy as xp; GPU = False
    def scat(a, i, v): np.add.at(a, i, v)
CUT = 41.5   # exponent cut: terms below e^-41.5 = 1e-18 dropped
def build(OBJ, s, M, verbose=True):
    t0 = time.time(); R = math.sqrt(4 * s * s * CUT); v = 2 * s * s; c0 = 2 * math.pi * s * s; amp = s * math.sqrt(math.pi)
    NQ = int(M * math.exp(R)) + 2
    o = s6lib.obj(OBJ, NQ); herm = o['hermitian']; dt_ = xp.complex128 if herm else xp.float64
    if verbose: print(f'[{OBJ} s={s} M={M}] gpu={GPU} R={R:.3f} coefficients n<={NQ} ({len(o["n"])} nonzero); planned: 3 matrices {M}x{M} = {3*M*M*(16 if herm else 8)/2**30:.2f} GB', flush=True)
    x = np.log(np.arange(1, M + 1, dtype=float)); xg = xp.asarray(x)
    # prime side
    T = xp.zeros(M * M, dtype=dt_); eR = math.exp(R); nent = 0
    qs = o['n']; wq = o['c'] / np.sqrt(qs.astype(float))
    # flatten (q, j) pairs, j <= min(M, M e^R / q)
    jm = np.minimum(M, (M * eR / qs).astype(np.int64)); keep = jm >= 1; qs = qs[keep]; wq = wq[keep]; jm = jm[keep]
    pq = np.repeat(np.arange(len(qs)), jm); pj = (np.arange(len(pq)) - np.repeat(np.cumsum(jm) - jm, jm) + 1)
    m = qs[pq].astype(float) * pj
    lo = np.maximum(1, np.ceil(m / eR)).astype(np.int64); hi = np.minimum(M, np.floor(m * eR)).astype(np.int64); cnt = np.maximum(hi - lo + 1, 0)
    cum = np.cumsum(cnt); total = int(cum[-1]) if len(cum) else 0
    CH = 3 * 10 ** 7; a = 0
    if verbose: print(f'  prime side: {len(pq)} (q,j) pairs, {total} entries, scatter blocks of {CH} [{time.time()-t0:.0f}s]', flush=True)
    while a < len(pq):
        b = int(np.searchsorted(cum, (cum[a - 1] if a else 0) + CH, side='right')); b = max(b, a + 1)
        c_ = cnt[a:b]; tot = int(c_.sum())
        if tot:
            off = np.cumsum(c_) - c_
            ii = np.repeat(lo[a:b], c_) + (np.arange(tot) - np.repeat(off, c_)); jj = np.repeat(pj[a:b], c_)
            lm = np.repeat(np.log(m[a:b]), c_)
            val = np.repeat(wq[pq[a:b]], c_) * np.exp(-(lm - x[ii - 1]) ** 2 / (4 * s * s))
            scat(T, xp.asarray((ii - 1) * M + (jj - 1)), xp.asarray(val)); nent += tot
        a = b
    T = T.reshape(M, M); Z = -amp * (T + xp.conj(T.T)); del T
    # archimedean side
    zmin = min(o['gam']); sig = 0.9 * 2 * zmin; h = 2 * math.pi * sig / (CUT + sig * x[-1]); tmax = math.sqrt(2 * CUT / v); K = int(tmax / h) + 2
    tk = h * np.arange(K); W = s6lib.arch(o, tk); om = (c0 / math.pi) * h * np.exp(-v * tk * tk / 2) * W; om[0] *= 0.5
    if verbose: print(f'  archimedean side: trapezoid step {h:.4f}, {K} nodes to t = {tmax:.1f}; blocks of 1500 nodes x {M} = {1500*M*8/2**30:.2f} GB x 4 [{time.time()-t0:.0f}s]', flush=True)
    for a in range(0, K, 1500):
        tt = xp.asarray(tk[a:a + 1500]); ph = xp.outer(tt, xg); og = xp.asarray(om[a:a + 1500])[:, None]
        Bc = xp.cos(ph); Z += Bc.T @ (og * Bc); del Bc
        Bs = xp.sin(ph); Z += Bs.T @ (og * Bs); del Bs, ph
    # pole terms
    for tau in o['poles']:
        e1 = xp.exp(tau * xg); e2 = xp.exp(-tau * xg); Z += c0 * math.exp(v * tau * tau / 2) * (xp.outer(e1, e2) + xp.outer(e2, e1))
    if verbose: print(f'  assembled [{time.time()-t0:.0f}s]', flush=True)
    return Z, o
def spectrum(Zb):
    d = xp.sqrt(xp.abs(xp.diagonal(Zb).real)); S = Zb / d[:, None] / d[None, :]; S = 0.5 * (S + xp.conj(S.T))
    return xp.linalg.eigh(S), d
if __name__ == '__main__':
    OBJ = sys.argv[1]; s = float(sys.argv[2]); MMAX = int(sys.argv[3]); OUT = sys.argv[4] if len(sys.argv) > 4 else 'out4'
    os.makedirs(OUT, exist_ok=True); t0 = time.time()
    Z, o = build(OBJ, s, MMAX)
    ML = sorted(set([m for m in (8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384, 20000) if m < MMAX] + [MMAX]))
    TH = 1e-10; rows = []; first = None; prev = 1
    def row_of(M):
        if (not GPU) and M > 10000:      # CPU, large block: eigenvalues only, scaled copy overwritten (last block: Z itself is overwritten)
            import scipy.linalg as sla
            S_ = Z if M == MMAX else Z[:M, :M].copy()
            d = np.sqrt(np.abs(np.diagonal(S_).real)).copy(); S_ /= d[:, None]; S_ /= d[None, :]
            ev = sla.eigvalsh(S_, overwrite_a=True, check_finite=False); U = None
        else:
            (ev, U), d = spectrum(Z[:M, :M]); ev = xp.asnumpy(ev) if GPU else ev
        lmax = float(ev[-1]); r = dict(M=M, lmax=lmax, lmin=float(ev[0]), rel=float(ev[0] / lmax), n_neg_1e12=int(np.sum(ev < -1e-12 * lmax)), n_neg_1e10=int(np.sum(ev < -1e-10 * lmax)), n_neg_1e8=int(np.sum(ev < -1e-8 * lmax)),
                 rank_1e10=int(np.sum(ev > 1e-10 * lmax)), diag0=float(Z[0, 0].real), diagM=float(Z[M - 1, M - 1].real))
        return r, U, d
    for M in ML:
        r, U, d = row_of(M); rows.append(r)
        print(f"RESULT4 {OBJ} s={s} M={M}: lmax {r['lmax']:.4e} lmin/lmax {r['rel']:+.3e}; negative below -1e-12/-1e-10/-1e-8: {r['n_neg_1e12']}/{r['n_neg_1e10']}/{r['n_neg_1e8']}; rank(1e-10) {r['rank_1e10']} [{time.time()-t0:.0f}s]", flush=True)
        if first is None and r['rel'] < -TH and U is not None:
            lo, hi = prev, M           # bisect the onset between the two list sizes
            while hi - lo > 1:
                mid = (lo + hi) // 2; rm, _, _ = row_of(mid)
                if rm['rel'] < -TH: hi = mid
                else: lo = mid
            rs, U, d = row_of(hi); first = hi
            y = (U[:, 0] / d); y = xp.asnumpy(y) if GPU else y
            np.save(f'{OUT}/c4vec_{OBJ}_s{s:g}.npy', y)
            print(f"ONSET4 {OBJ} s={s}: first M with lmin/lmax < -{TH:g}: M* = {hi} (log M* = {math.log(hi):.3f}); lmin/lmax = {rs['rel']:+.3e}; eigenvector saved", flush=True)
            rows.append(dict(onset=hi, **{k: v for k, v in rs.items() if k != 'M'}))
        prev = M
        del U
    json.dump(dict(obj=OBJ, s=s, MMAX=MMAX, threshold=TH, onset=first, rows=rows, seconds=time.time() - t0), open(f'{OUT}/c4_{OBJ}_s{s:g}_M{MMAX}.json', 'w'))
    print(f'done {time.time()-t0:.0f}s', flush=True)
