"""CPU (multiprocessing) builders for the Gram matrices of gram.py; same formulas, no GPU.
Usage: gramcpu.py N OUTDIR which[zeta|per|ladder] [names]      workers = RH_WORKERS
"""
import sys, os, math, time, json, numpy as np
from multiprocessing import Pool
from scipy.special import digamma
import gram as Gm
log = Gm.log
NW = int(os.environ.get('RH_WORKERS', '4'))

def _v_worker(n):
    k = np.arange(1, n, dtype=np.int64)
    cot = 1.0 / np.tan(math.pi * k / n)
    vec = np.empty(n)
    for s in range(0, n, 2000):
        r = np.arange(s, min(n, s + 2000), dtype=np.int64)
        vec[s:s + 2000] = ((r[:, None] * k[None, :]) % n).astype(np.float64) @ cot / n
    return n, vec

def zeta_gram_cpu(N):
    log('zeta (cpu, %d workers): planned %.2f GB' % (NW, 2 * N * N * 8 / 1e9))
    Vf = np.zeros((N, N)); m = np.arange(1, N + 1); t0 = time.time()
    with Pool(NW) as p:
        for n, vec in p.imap_unordered(_v_worker, range(N, 1, -1), chunksize=4):
            Vf[:, n - 1] = vec[m % n]
    log('V table %.1fs' % (time.time() - t0))
    i = np.arange(1, N + 1, dtype=np.int64)
    c = (math.log(2 * math.pi) - np.euler_gamma) / 2
    G = np.empty((N, N))
    for s0 in range(0, N, 1000):
        ii = i[s0:s0 + 1000]
        g = np.gcd.outer(ii, i)
        mm = ii[:, None] // g; nn = i[None, :] // g
        b = c * (1 / mm + 1 / nn) + (nn - mm) / (2.0 * mm * nn) * np.log(mm / nn) - math.pi / (2.0 * mm * nn) * (Vf[mm - 1, nn - 1] + Vf[nn - 1, mm - 1])
        G[s0:s0 + 1000] = b / g
    return G

_COEF = None; _N = None
def _init(names, N):
    global _COEF, _N
    A = np.array([Gm.VECS[v] for v in names])
    Ap = np.concatenate([np.zeros((len(names), 1)), np.cumsum(A, axis=1)[:, :4]], axis=1)
    _COEF = np.conj(Ap)[:, :, None] * A[:, None, :4]; _N = N

def _u_worker(k):
    """U_v(h,k) for h <= N coprime to k (zero elsewhere)"""
    N = _N
    h = np.arange(1, N + 1)
    h = h[np.gcd(h, k) == 1]
    W = np.zeros((len(h), 5, 4))
    rows = max(1, 4000000 // k)
    inv = 1.0 / (5.0 * k)
    for rho in range(1, 5):
        n = (5 * np.arange(k) + rho).astype(np.float64)
        psi = digamma(n * inv)
        for s in range(0, len(h), rows):
            hh = h[s:s + rows].astype(np.float64)
            y = (hh[:, None] * n[None, :] + 0.5) * inv
            y -= np.floor(y); y *= 5.0
            q = y.astype(np.intp)                       # floor(hn/k) mod 5, exact (margin 0.5/k against rounding 1e-12)
            q += 5 * np.arange(len(hh), dtype=np.intp)[:, None]
            cnt = np.bincount(q.ravel(), weights=np.broadcast_to(psi, q.shape).ravel(), minlength=5 * len(hh))
            W[s:s + rows, :, rho - 1] = cnt.reshape(len(hh), 5)
    out = np.einsum('hcr,vcr->hv', W.astype(np.complex128), _COEF)
    return k, h, out

def periodic_gram_cpu(N, names, outdir):
    nv = len(names)
    log('periodic (cpu, %d workers): U planned %.2f GB' % (NW, nv * N * N * 16 / 1e9))
    U = np.zeros((nv, N, N), dtype=np.complex128); t0 = time.time(); done = 0
    with Pool(NW, initializer=_init, initargs=(names, N)) as p:
        for k, h, out in p.imap_unordered(_u_worker, range(N, 0, -1), chunksize=2):
            U[:, h - 1, k - 1] = out.T; done += 1
            if done % 500 == 0: log('  %d/%d columns %.1fs' % (done, N, time.time() - t0))
    i = np.arange(1, N + 1, dtype=np.int64)
    psi5 = digamma(np.arange(1, 5) / 5.0)
    files = {}
    for vi, v in enumerate(names):
        a = Gm.VECS[v]
        G = np.empty((N, N), dtype=np.complex128)
        for s0 in range(0, N, 1000):
            ii = i[s0:s0 + 1000]
            g = np.gcd.outer(ii, i)
            hh = ii[:, None] // g; kk = i[None, :] // g
            D = np.zeros(g.shape, dtype=np.complex128)
            for j in range(1, 5):
                D += a[(kk * j - 1) % 5] * np.conj(a[(hh * j - 1) % 5]) * psi5[j - 1]
            G[s0:s0 + 1000] = -(U[vi][hh - 1, kk - 1] + np.conj(U[vi][kk - 1, hh - 1]) - D) / (5.0 * hh * kk) / g
        np.save(outdir + '/G_%s_%d.npy' % (v, N), G); files[v] = outdir + '/G_%s_%d.npy' % (v, N); del G
    return files

NS = [100, 150, 250, 400, 600, 800, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 7000, 8000, 9000, 10000]
if __name__ == '__main__':
    N = int(sys.argv[1]); outdir = sys.argv[2]; which = sys.argv[3]
    names = sys.argv[4].split(',') if len(sys.argv) > 4 else list(Gm.VECS)
    Ns = [n for n in NS if n <= N]; res = {}
    if which == 'zeta':
        t0 = time.time(); Gz = zeta_gram_cpu(N); log('zeta gram built %.1fs' % (time.time() - t0)); np.save(outdir + '/G_ZETA_%d.npy' % N, Gz)
        res['ZETA'] = Gm.ladder(Gz, Gm.zeta_target(N), Ns, 'ZETA')
        Nt = N // 9; beta = [1.0, 2.2 * math.sqrt(3), 3.0]; idx = np.arange(1, Nt + 1)
        Gt = np.zeros((Nt, Nt)); tt = np.zeros(Nt); tz = Gm.zeta_target(N)
        for i_, bi in enumerate(beta):
            tt += bi * tz[3 ** i_ * idx - 1]
            for j_, bj in enumerate(beta): Gt += bi * bj * Gz[np.ix_(3 ** i_ * idx - 1, 3 ** j_ * idx - 1)]
        res['TNR'] = Gm.ladder(Gt, tt, [n for n in Ns if n <= Nt] + [Nt], 'TNR')
    elif which == 'per':
        t0 = time.time(); files = periodic_gram_cpu(N, names, outdir); log('periodic grams built %.1fs' % (time.time() - t0))
        for v in names:
            G = np.load(files[v]); res[v] = Gm.ladder(G, Gm.F1(v) * (1.0 / np.arange(1, N + 1)).astype(complex), Ns, v); del G
    elif which == 'ladder':
        for v in names:
            G = np.load(outdir + '/G_%s_%d.npy' % (v, N))
            tv = Gm.zeta_target(N) if v == 'ZETA' else Gm.F1(v) * (1.0 / np.arange(1, N + 1)).astype(complex)
            res[v] = Gm.ladder(G, tv, Ns, v); del G
    fits = {k: [Gm.fit(v), Gm.fit(v, 1000), Gm.fit(v, 3000)] for k, v in res.items()}
    for k in fits: log('FIT', k, json.dumps(fits[k]))
    json.dump(dict(N=N, rows=res, fits=fits), open(outdir + '/gramcpu_%d_%s_%s.json' % (N, which, '_'.join(names) if which != 'zeta' else 'ZETA'), 'w'), indent=1)
