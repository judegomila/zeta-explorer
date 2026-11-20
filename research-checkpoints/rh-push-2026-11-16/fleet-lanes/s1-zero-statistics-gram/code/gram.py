"""Nyman-Beurling / Vasyunin Gram matrices.
ZETA:  b(m,n) = int_0^inf {1/(mx)}{1/(nx)} dx   (Vasyunin's formula with cotangent sums)
PERIODIC (period 5, sum zero; chi mod 5, DH, ...):  G(h,k) = int_0^inf A(x/h) conj(A(x/k)) dx/x^2,  A(y) = sum_{n<=y} a(n)
   = (1/2pi) int |F(1/2+it)|^2 (k/h)^{it} (hk)^{-1/2} dt/(1/4+t^2)   (Mellin-Plancherel; F(s) h^{-s}/s is the Mellin transform of A(x/h))
   closed form used: for coprime h,k
   G(h,k) = -(1/(5hk)) [ U(h,k) + conj(U(k,h)) - sum_{j=1..4} a(kj) conj(a(hj)) psi(j/5) ],
   U(h,k) = sum_{n=1..5k} a(n) psi(n/(5k)) conj(Ap(floor(hn/k) mod 5)),  Ap(c) = a(1)+..+a(c);   G(dh,dk) = G(h,k)/d.
float64; GPU (cupy) if present. Usage: gram.py N OUTDIR [which=zeta,per] [poolGB]
"""
import sys, math, time, json, numpy as np
from scipy.special import digamma
try:
    import cupy as cp
    from cupyx.scipy.special import digamma as cdigamma
    GPU = True
except Exception:
    cp = np; cdigamma = digamma; GPU = False

KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
VECS = {
    'CHI5':  np.array([1, 1j, -1j, -1, 0]),              # complex character mod 5, chi(2)=i (Euler product)
    'CHI5R': np.array([1, -1, -1, 1, 0], dtype=complex),  # real character mod 5 (Euler product)
    'DH':    np.array([1, KAPPA, -KAPPA, -1, 0], dtype=complex),          # Davenport-Heilbronn (functional equation, no Euler product)
    'DHALT': np.array([1, -1 / KAPPA, 1 / KAPPA, -1, 0], dtype=complex),  # the other FE combination
    'PER':   np.array([1, 0.3, -1.7, 0.4, 0], dtype=complex),             # generic period-5 sum-zero vector (no FE, no Euler product)
}

def log(*a): print(*a, flush=True)

def gcd_table(N):
    i = np.arange(1, N + 1)
    return np.gcd.outer(i, i)

# ---------------------------------------------------------------- zeta (Vasyunin)
def vasyunin_V(N):
    """Vf[m-1, n-1] = V(m mod n, n) = sum_{k=1}^{n-1} {mk/n} cot(pi k/n)"""
    log('zeta: V table N=%d, planned %.2f GB (N x N float64) + per-n work %.2f GB' % (N, N * N * 8 / 1e9, N * N * 16 / 1e9))
    Vf = np.zeros((N, N))
    m = np.arange(1, N + 1)
    t0 = time.time()
    for n in range(2, N + 1):
        k = cp.arange(1, n, dtype=cp.int64)
        cot = 1.0 / cp.tan(math.pi * k / n)
        r = cp.arange(n, dtype=cp.int64)
        M = (r[:, None] * k[None, :]) % n
        vec = (M.astype(cp.float64) @ cot) / n
        vec = cp.asnumpy(vec) if GPU else vec
        Vf[:, n - 1] = vec[m % n]
        if n % 2000 == 0: log('  n=%d %.1fs' % (n, time.time() - t0))
    return Vf

def zeta_gram(N):
    Vf = vasyunin_V(N)
    i = np.arange(1, N + 1, dtype=np.int64)
    c = (math.log(2 * math.pi) - np.euler_gamma) / 2
    G = np.empty((N, N))
    for s0 in range(0, N, 1000):
        ii = i[s0:s0 + 1000]
        g = np.gcd.outer(ii, i)
        mm = ii[:, None] // g; nn = i[None, :] // g
        V1 = Vf[mm - 1, nn - 1]; V2 = Vf[nn - 1, mm - 1]
        b = c * (1 / mm + 1 / nn) + (nn - mm) / (2.0 * mm * nn) * np.log(mm / nn) - math.pi / (2.0 * mm * nn) * (V1 + V2)
        G[s0:s0 + 1000] = b / g
    return G

def zeta_target(N):
    n = np.arange(1, N + 1)
    return (np.log(n) + 1 - np.euler_gamma) / n      # int_0^1 {1/(nx)} dx = <1_{x>=1}, {x/n}> in L^2(dx/x^2)

# ---------------------------------------------------------------- periodic coefficients
def periodic_U(N, names, pool_gb=8.0):
    """U[v][h-1, k-1] for all 1 <= h,k <= N.  Universal counts W[h,c,rho] = sum_{n = rho mod 5, n <= 5k} [floor(hn/k) mod 5 = c] psi(n/5k),
    then U_v(h,k) = sum_{c,rho} conj(Ap_v[c]) a_v(rho) W[h,c,rho]."""
    nv = len(names)
    A = np.array([VECS[v] for v in names])                    # nv x 5 ; a(1..5)
    Ap = np.concatenate([np.zeros((nv, 1)), np.cumsum(A, axis=1)[:, :4]], axis=1)   # Ap[c], c = 0..4
    coef = cp.asarray(np.conj(Ap)[:, :, None] * A[:, None, :4])     # nv x 5 x 4
    U = np.zeros((nv, N, N), dtype=np.complex128)
    log('periodic: U tables planned %.2f GB' % (nv * N * N * 16 / 1e9))
    h = cp.arange(1, N + 1, dtype=cp.int32)
    budget = int(pool_gb * 1024 ** 3 / 16)       # elements of the (rows x k) work arrays (int32 + uint8 + bool + float64)
    t0 = time.time()
    for k in range(1, N + 1):
        Wk = cp.zeros((N, 5, 4))
        rows = max(1, budget // k)
        for rho in range(1, 5):
            n = 5 * np.arange(k) + rho
            psi = cp.asarray(digamma(n / (5.0 * k)))
            tot = psi.sum()
            ng = cp.asarray(n.astype(np.int32))
            for s in range(0, N, rows):
                q = ((h[s:s + rows, None] * ng[None, :]) // k) % 5
                acc = cp.zeros(q.shape[0])
                for c in range(4):
                    r = (q == c).astype(cp.float64) @ psi
                    Wk[s:s + rows, c, rho - 1] = r; acc += r
                Wk[s:s + rows, 4, rho - 1] = tot - acc
                del q
        out = cp.einsum('hcr,vcr->hv', Wk.astype(cp.complex128), coef)
        U[:, :, k - 1] = (cp.asnumpy(out) if GPU else out).T
        if k % 500 == 0: log('  k=%d %.1fs' % (k, time.time() - t0))
    return U

def periodic_gram(N, names, pool_gb=8.0, outdir=None):
    U = periodic_U(N, names, pool_gb)
    i = np.arange(1, N + 1, dtype=np.int64)
    psi5 = digamma(np.arange(1, 5) / 5.0)
    out = {}
    for vi, v in enumerate(names):
        a = VECS[v]
        G = np.empty((N, N), dtype=np.complex128)
        for s0 in range(0, N, 1000):
            ii = i[s0:s0 + 1000]
            g = np.gcd.outer(ii, i)
            hh = ii[:, None] // g; kk = i[None, :] // g
            D = np.zeros(g.shape, dtype=np.complex128)
            for j in range(1, 5):
                D += a[(kk * j - 1) % 5] * np.conj(a[(hh * j - 1) % 5]) * psi5[j - 1]
            G[s0:s0 + 1000] = -(U[vi][hh - 1, kk - 1] + np.conj(U[vi][kk - 1, hh - 1]) - D) / (5.0 * hh * kk) / g
        if outdir:
            np.save(outdir + '/G_%s_%d.npy' % (v, N), G); out[v] = outdir + '/G_%s_%d.npy' % (v, N); del G
        else:
            out[v] = G
    return out

def F1(v):
    a = VECS[v]
    return -(a[:4] * digamma(np.arange(1, 5) / 5.0)).sum() / 5.0

# ---------------------------------------------------------------- analysis
def ladder(G, tvec, Ns, name, herm=True):
    """lam_min, lam_max, d_N^2 = 1 - t* G^{-1} t on leading blocks"""
    import scipy.linalg as sl
    rows = []
    for n in Ns:
        Gn = G[:n, :n]
        w = sl.eigvalsh(Gn)
        try:
            cf = sl.cho_factor(Gn); x = sl.cho_solve(cf, tvec[:n]); d2 = 1 - float(np.real(np.vdot(tvec[:n], x)))
        except Exception as e:
            d2 = float('nan')
        rows.append(dict(obj=name, N=int(n), lam_min=float(w[0]), lam2=float(w[1]), lam_max=float(w[-1]), d2=d2, herm_defect=float(np.abs(Gn - Gn.conj().T).max())))
        log(json.dumps(rows[-1]))
    return rows

def fit(rows, lo=0):
    x = np.log([r['N'] for r in rows if r['N'] >= lo]); y = np.log([r['lam_min'] for r in rows if r['N'] >= lo])
    if len(x) < 3: return None
    p = np.polyfit(x, y, 1); res = y - np.polyval(p, x)
    return dict(p=-float(p[0]), A=float(math.exp(p[1])), r2=float(1 - res.var() / y.var()), nrungs=len(x), lo=lo)

if __name__ == '__main__':
    N = int(sys.argv[1]); outdir = sys.argv[2]; which = sys.argv[3] if len(sys.argv) > 3 else 'zeta,per'; pool = float(sys.argv[4]) if len(sys.argv) > 4 else 8.0
    if GPU: cp.get_default_memory_pool().set_limit(size=int((pool + 2) * 1024 ** 3))
    log('GPU=%s N=%d' % (GPU, N))
    Ns = [n for n in [100, 150, 250, 400, 600, 800, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 7000, 8000, 9000, 10000, 12000] if n <= N]
    res = {}
    if 'zeta' in which:
        t0 = time.time(); Gz = zeta_gram(N); log('zeta gram built %.1fs' % (time.time() - t0))
        np.save(outdir + '/G_ZETA_%d.npy' % N, Gz)
        res['ZETA'] = ladder(Gz, zeta_target(N), Ns, 'ZETA')
        # T-NR = zeta(s)(1 + c q^{1/2-s} + q^{1-2s}), q=3, c=2.2: linear combination of rows m, 3m, 9m
        Nt = N // 9
        if Nt >= 100:
            beta = [1.0, 2.2 * math.sqrt(3), 3.0]; idx = np.arange(1, Nt + 1)
            Gt = np.zeros((Nt, Nt)); tt = np.zeros(Nt); tz = zeta_target(N)
            for i_, bi in enumerate(beta):
                tt += bi * tz[3 ** i_ * idx - 1]
                for j_, bj in enumerate(beta):
                    Gt += bi * bj * Gz[np.ix_(3 ** i_ * idx - 1, 3 ** j_ * idx - 1)]
            res['TNR'] = ladder(Gt, tt, [n for n in Ns if n <= Nt] + ([Nt] if Nt not in Ns else []), 'TNR')
        del Gz
    if 'per' in which:
        names = sys.argv[5].split(',') if len(sys.argv) > 5 else list(VECS)
        t0 = time.time(); Gs = periodic_gram(N, names, pool, outdir); log('periodic grams built %.1fs' % (time.time() - t0))
        for v in names:
            G = np.load(Gs[v])
            tv = F1(v) * (1.0 / np.arange(1, N + 1)).astype(complex)
            res[v] = ladder(G, tv, Ns, v); del G
    fits = {k: [fit(v), fit(v, 1000), fit(v, 3000)] if len(v) > 3 else None for k, v in res.items()}
    for k in fits: log('FIT', k, json.dumps(fits[k]))
    json.dump(dict(N=N, rows=res, fits=fits), open(outdir + '/gram_%d_%s%s.json' % (N, which.replace(',', '_'), ('_' + sys.argv[5].replace(',', '_')) if len(sys.argv) > 5 else ''), 'w'), indent=1)
