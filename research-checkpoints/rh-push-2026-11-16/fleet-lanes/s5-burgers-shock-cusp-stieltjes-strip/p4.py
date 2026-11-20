"""Prime side of combinations 1 and 4. Lane s5-burgers-shock-cusp-stieltjes-strip.

G_k(s) = sum_{n = p^j <= X} eps(n) Lambda(n) (log n)^k n^{-s} w(log n / L),  L = log X,  s = 1/2 + delta + i t,
w = 1 on [0, a], C-infinity decreasing to 0 on [a, 1] (a = 2/3).
Explicit formula (exact for zeta, contour shift; K(z) = (1 + E(z L))/z, E(zeta) = int_a^1 w'(v) e^{-zeta v} dv, |E| <= e^{-a Re zeta}):
    sum_rho K(s - rho) = -G_0(s) + K(s - 1) + [1/s - (1/2) log pi + (1/2) psi(s/2)] + (trivial zeros through E, below 1e-30)
so  M_K(t) := (1/2) Re sum_rho K(s - rho) = (1/2) [ (1/2) log(q t / 2 pi) - Re G_0 ] + O(1/t)
and the Poisson mass is M(x = 2t, Y = 2 delta) = (1/2) Re sum_rho 1/(s - rho) = M_K - (1/2) Re sum_rho E((s - rho) L)/(s - rho).
Derivatives: sum_rho K'(s - rho) = G_1 (+ O(1/t)), sum_rho K''(s - rho) = -G_2; with K = 1/z these are sum 1/(gamma - z)^2 and -i * 2 sum 1/(gamma - z)^3
at z = t - i delta: |m'| = |G_1|, |m''| = |G_2| for the K-smoothed measure.

Evaluation on the grid t_j = T + j dt, |j| < M/4, by a type-1 non-uniform FFT in u = log n (Gaussian gridding, 13 taps, oversampling >= 2).
Phases T log n mod 2 pi are computed in 80-bit long double on the CPU; the sum itself is float64 (GPU when present): a screen.

usage:
  p4.py sieve X T1,T2,...           primes to X (segmented, RH_WORKERS processes): files prim/u_*.npy, prim/ph_<T>_*.npy
  p4.py run OBJ T [deriv]           OBJ in zeta, chi4, chi5, sgn, liou, uni, tnr ; writes out/p4_<OBJ>_<T>.json (+ npz slice)
  p4.py selftest                    small X: NUFFT against the direct sum, and the explicit formula against mpmath
"""
import sys, os, json, math, time, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out'); PR = os.environ.get('RH_PRIM', os.path.join(HERE, 'prim'))
os.makedirs(OUT, exist_ok=True)
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)

A_FLAT = 2.0 / 3.0
P_REQ = 4.37426
DELTAS = [0.0825, 0.165, 0.2, 0.5]                 # Y = 0.165, 0.33 (mirror kernel at y0 = 0.165), 0.4, 1 in the coordinates of H_t
DELTAS_DER = [2.5066282746310002e-4, 7.926654595212022e-3, 0.0825, 0.2, 0.5]   # y_N for N = 1e8, 1e5; then the three widths

# ------------------------------------------------------------------ window
def _f(x):
    out = np.zeros_like(x); m = x > 0; out[m] = np.exp(-1.0 / x[m]); return out
def w_of(v, B=np):
    """w(v) = 1 (v <= a), 1 - S((v-a)/(1-a)) on (a, 1), 0 (v >= 1); S(x) = f(x)/(f(x) + f(1-x)), f = exp(-1/x)"""
    x = (v - A_FLAT) / (1 - A_FLAT)
    xc = B.clip(x, 1e-12, 1 - 1e-12)
    f = B.exp(-1.0 / xc); f1 = B.exp(-1.0 / (1 - xc)); S = f / (f + f1)
    return B.where(x <= 0, 1.0, B.where(x >= 1, 0.0, 1.0 - S))
def wprime(v):
    x = (v - A_FLAT) / (1 - A_FLAT); f = _f(x); f1 = _f(1 - x)
    fp = np.where(x > 0, f / np.maximum(x, 1e-300) ** 2, 0.0); f1p = np.where(x < 1, f1 / np.maximum(1 - x, 1e-300) ** 2, 0.0)
    return -(fp * f1 + f * f1p) / (f + f1) ** 2 / (1 - A_FLAT)
_GL = None
def E_of(zeta):
    """E(zeta) = int_a^1 w'(v) e^{-zeta v} dv, complex array zeta (any shape); 800-node Gauss-Legendre (|Im zeta| up to about 3000)"""
    global _GL
    if _GL is None:
        from numpy.polynomial.legendre import leggauss
        t, wt = leggauss(800); v = 0.5 * (1 - A_FLAT) * t + 0.5 * (1 + A_FLAT); _GL = (v, 0.5 * (1 - A_FLAT) * wt * wprime(v))
    v, c = _GL; z = np.asarray(zeta, dtype=complex); out = np.zeros(z.shape, dtype=complex)
    flat = z.reshape(-1); o = out.reshape(-1); bs = max(1, 2_000_000 // len(v))
    for s in range(0, len(flat), bs):
        o[s:s + bs] = (np.exp(-flat[s:s + bs, None] * v[None, :]) * c[None, :]).sum(1)
    return out

# ------------------------------------------------------------------ sieve
def _small_primes(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]

def _sieve_chunk(args):
    ci, lo, hi, Ts, base, PR = args        # primes in [lo, hi)
    seg = 1 << 23; out = []
    for a in range(lo, hi, 2 * seg):
        b = min(hi, a + 2 * seg)
        a1 = a | 1                           # odd numbers a1, a1+2, ... < b
        n = (b - a1 + 1) // 2
        if n <= 0: continue
        s = np.ones(n, dtype=bool)
        for p in base[1:]:
            if p * p >= b: break
            st = max(p * p, ((a1 + p - 1) // p) * p)
            if st % 2 == 0: st += p
            s[(st - a1) // 2::p] = False
        pr = a1 + 2 * np.nonzero(s)[0].astype(np.int64)
        if a <= 2 < b: pr = np.concatenate([[2], pr])
        pr = pr[pr > 1]
        out.append(pr)
    pr = np.concatenate(out) if out else np.zeros(0, dtype=np.int64)
    lp = np.log(pr.astype(np.longdouble))
    np.save(os.path.join(PR, 'u_%04d.npy' % ci), lp.astype(np.float64))
    twopi = 8 * np.arctan(np.longdouble(1))
    for T in Ts:
        ph = np.fmod(np.longdouble(T) * lp, twopi)
        np.save(os.path.join(PR, 'ph_%s_%04d.npy' % (T, ci)), ph.astype(np.float64))
    return ci, len(pr)

def sieve(X, Ts):
    from multiprocessing import Pool
    os.makedirs(PR, exist_ok=True)
    X = int(float(X)); base = _small_primes(int(X ** 0.5) + 1)
    nch = max(1, min(400, X // 25_000_000)); edges = [int(i * X / nch) // 2 * 2 for i in range(nch)] + [X + 1]
    jobs = [(i, edges[i], edges[i + 1], Ts, base, PR) for i in range(nch)]
    log('sieve to', X, 'chunks', nch, 'workers', os.environ.get('RH_WORKERS', '4'), 'planned per worker: about 0.4 GB')
    tot = 0
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as P:
        for ci, n in P.imap_unordered(_sieve_chunk, jobs): tot += n
    # prime powers p^k <= X, k >= 2
    pp = []; twopi = 8 * np.arctan(np.longdouble(1))
    for p in base:
        k = 2
        while p ** k <= X: pp.append((int(p), k)); k += 1
    pp = np.array(pp, dtype=np.int64)
    lp = np.log(pp[:, 0].astype(np.longdouble)); uk = lp * pp[:, 1]
    np.save(os.path.join(PR, 'pp.npy'), pp); np.save(os.path.join(PR, 'pp_u.npy'), uk.astype(np.float64))
    for T in Ts: np.save(os.path.join(PR, 'pp_ph_%s.npy' % T), np.fmod(np.longdouble(T) * uk, twopi).astype(np.float64))
    json.dump(dict(X=X, chunks=nch, primes=tot, prime_powers=len(pp), Ts=Ts), open(os.path.join(PR, 'meta.json'), 'w'))
    log('primes', tot, 'prime powers', len(pp))

# ------------------------------------------------------------------ objects
def eps_of(obj, p, k, B):
    """twist factor for n = p^k; p integer array (B.int64), k integer or array"""
    if obj in ('zeta', 'tnr'): return None
    if obj == 'chi4':
        r = p % 4; e = B.where(r == 1, 1.0, B.where(r == 3, -1.0, 0.0)); return e ** k
    if obj == 'chi5':
        r = p % 5; e = B.where((r == 1) | (r == 4), 1.0, B.where((r == 2) | (r == 3), -1.0, 0.0)); return e ** k
    if obj == 'liou': return (-1.0) ** k * B.ones(len(p))
    h = (p.astype(B.uint64) * B.uint64(0x9E3779B97F4A7C15)); h = h ^ (h >> B.uint64(29)); h = h * B.uint64(0xBF58476D1CE4E5B9); h = h ^ (h >> B.uint64(32))
    if obj == 'sgn':
        e = 1.0 - 2.0 * ((h >> B.uint64(63)).astype(B.float64)); return e ** k
    if obj == 'uni':
        ang = (h >> B.uint64(11)).astype(B.float64) * (2 * math.pi / 2 ** 53); return B.exp(1j * ang * k)
    raise ValueError(obj)
QCOND = {'zeta': 1, 'tnr': 1, 'chi4': 4, 'chi5': 5, 'sgn': 1, 'liou': 1, 'uni': 1}

# ------------------------------------------------------------------ NUFFT
SP = 6          # taps on each side
S2 = SP / (math.pi * math.sqrt(2))   # Gaussian variance in cells: aliasing e^{-s^2 pi^2} = truncation e^{-SP^2/(2 s^2)} = e^{-13.3} = 1.6e-6 relative

def grid_add(G, u, C, h, B):
    """G: complex array (ncol, nG); C: complex weights (ncol, n). One bincount per tap over all columns (real and imaginary rows stacked)."""
    ncol, n = C.shape
    pos = u / h; j0 = B.rint(pos).astype(B.int64); d0 = pos - j0
    lo = int(j0.min()) - SP; span = int(j0.max()) + SP + 1 - lo; j0 = j0 - lo
    W = B.concatenate([C.real, C.imag]); rows = 2 * ncol
    offs = (B.arange(rows, dtype=B.int64) * span)[:, None]
    acc = B.zeros(rows * span)
    for o in range(-SP, SP + 1):
        wg = B.exp(-(d0 - o) ** 2 / (2 * S2))
        acc += B.bincount(((j0 + o)[None, :] + offs).ravel(), weights=(W * wg[None, :]).ravel(), minlength=rows * span)[:rows * span]
    acc = acc.reshape(rows, span)
    G[:, lo:lo + span] += acc[:ncol] + 1j * acc[ncol:]

def transform(Gu, M, B):
    """sum_p c_p e^{-i tau_j u_p} at tau_j = 2 pi j/(M h), j = -M/4 .. M/4-1"""
    full = B.zeros(M, dtype=B.complex128); full[:len(Gu)] = Gu
    F = B.fft.fft(full); del full
    q = M // 4
    out = B.concatenate([F[M - q:], F[:q]]); del F
    j = B.arange(-q, q, dtype=B.float64); om = 2 * math.pi * j / M
    out /= math.sqrt(2 * math.pi * S2) * B.exp(-S2 * om * om / 2)
    return out

def backend():
    try:
        if os.environ.get('RH_BACKEND') == 'cpu': raise ImportError
        import cupy as cp
        cp.get_default_memory_pool().set_limit(size=int(os.environ.get('RH_POOL_GB', '24')) * 1024 ** 3); cp.zeros(1)
        return cp, True
    except Exception:
        return np, False

def stats(Mv, B, name):
    """Mv: real array of masses"""
    h = B.histogram(Mv, bins=B.linspace(-40, 60, 2001))[0]
    r = dict(n=int(Mv.size), min=float(Mv.min()), max=float(Mv.max()), mean=float(Mv.mean()), std=float(Mv.std()),
             frac_below_preq=float((Mv < P_REQ).mean()), frac_below_0=float((Mv < 0).mean()), argmin=int(Mv.argmin()))
    qs = [1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 0.1, 0.5, 0.9, 0.99, 0.999]
    hh = (B.asnumpy(h) if B is not np else h).astype(float); c = np.cumsum(hh) / hh.sum(); ed = np.linspace(-40, 60, 2001)
    r['quantiles'] = {str(q): float(ed[min(2000, int(np.searchsorted(c, q)) + 1)]) for q in qs}
    # windows: fraction of consecutive blocks of 2^16 samples whose minimum is below p_req
    nb = Mv.size // 65536
    if nb:
        mn = Mv[:nb * 65536].reshape(nb, 65536).min(1); r['blocks_65536'] = nb; r['blocks_with_min_below_preq'] = int((mn < P_REQ).sum()); r['max_block_min'] = float(mn.max())
    return r

def run(obj, T, deriv=False, Mlog=28, dt=0.02, save_slice=(1000.0, 21000.0), tnr=(1000003.0, 2.2), X=None):
    B, gpu = backend()
    meta = json.load(open(os.path.join(PR, 'meta.json'))); X = meta['X']; L = math.log(X)
    M = 1 << Mlog; h = 2 * math.pi / (M * dt); nG = int(L / h) + 4 * SP + 8
    deltas = DELTAS_DER if deriv else DELTAS
    ncol = len(deltas) * (3 if deriv else 1)
    log(obj, 'T', T, 'X', X, 'M 2^%d' % Mlog, 'dt', dt, 'h %.3e' % h, 'grid cells used', nG, 'columns', ncol, 'GPU', gpu,
        'planned: accumulators %.2f GB, FFT %.2f GB x 3' % (ncol * nG * 16 / 1e9, M * 16 / 1e9))
    assert nG < M // 2
    G = B.zeros((ncol, nG), dtype=B.complex128)
    def add(u, ph, p, k, lam):
        uu = B.asarray(u); base = lam * w_of(uu / L, B) * B.exp(-0.5 * uu) * B.exp(-1j * B.asarray(ph))
        e = eps_of(obj, p, k, B)
        if e is not None: base = base * e
        cols = []
        for d in deltas:
            c0 = base * B.exp(-d * uu); cols.append(c0)
            if deriv: cols.append(c0 * uu); cols.append(c0 * uu * uu)
        grid_add(G, uu, B.stack(cols), h, B)
    t0 = time.time(); npr = 0
    for ci in range(meta['chunks']):
        u = np.load(os.path.join(PR, 'u_%04d.npy' % ci)); ph = np.load(os.path.join(PR, 'ph_%s_%04d.npy' % (T, ci)))
        for s in range(0, len(u), 1_000_000):
            ug = B.asarray(u[s:s + 1_000_000]); p = B.rint(B.exp(ug)).astype(B.int64)
            add(ug, ph[s:s + 1_000_000], p, 1, ug); npr += len(ug)
        if ci % 10 == 0: log('chunk', ci, 'of', meta['chunks'], 'primes so far', npr, '%.0f s' % (time.time() - t0))
    pp = np.load(os.path.join(PR, 'pp.npy')); ppu = np.load(os.path.join(PR, 'pp_u.npy')); pph = np.load(os.path.join(PR, 'pp_ph_%s.npy' % T))
    add(ppu, pph, B.asarray(pp[:, 0]), B.asarray(pp[:, 1]), B.asarray(ppu / pp[:, 1]))
    log('gridding done', npr, 'primes', len(pp), 'prime powers', '%.0f s' % (time.time() - t0))
    q = M // 4; Tf = float(T); jj = B.arange(-q, q, dtype=B.float64); tt = Tf + jj * dt
    arch = 0.5 * B.log(QCOND[obj] * tt / (2 * math.pi))
    res = dict(obj=obj, T=T, X=X, a_flat=A_FLAT, M=M, dt=dt, n_samples=2 * q, t_min=Tf - q * dt, t_max=Tf + (q - 1) * dt, deltas=deltas, cols={})
    sl0 = int(round(save_slice[0] / dt)) + q; sl1 = int(round(save_slice[1] / dt)) + q; saved = {}
    # direct-sum check at 5 grid points for the first column (all primes, float64)
    col = 0
    for di, d in enumerate(deltas):
        for kk in range(3 if deriv else 1):
            F = transform(G[col], M, B); col += 1
            key = 'd%g_k%d' % (d, kk)
            r = dict(delta=d, Y=2 * d, k=kk, absmax=float(B.abs(F).max()), re_std=float(F.real.std()), im_std=float(F.imag.std()))
            if kk == 0:
                Mk = 0.5 * (arch - F.real)
                r['M_K'] = stats(Mk, B, key); r['ReG'] = stats(-F.real, B, key)     # -Re G_0 = Re "zeta'/zeta" of the object (K-smoothed)
                if obj == 'tnr':
                    lq = math.log(tnr[0]); add_t = B.empty(len(tt))
                    for c0 in range(0, len(tt), 1 << 23):          # 8.4e6 points per block (0.13 GB complex temporaries)
                        uq = lq * (d + 1j * tt[c0:c0 + (1 << 23)]); add_t[c0:c0 + (1 << 23)] = (lq * 2 * B.sinh(uq) / (2 * B.cosh(uq) + tnr[1])).real; del uq
                    r['M_K_full_with_local_factor'] = stats(Mk + 0.5 * add_t, B, key)
                    r['local_factor_term_range'] = [float(0.5 * add_t.min()), float(0.5 * add_t.max())]
                am = int(Mk.argmin()); r['t_at_min_minus_T'] = float((am - q) * dt)
                del Mk
            else:
                r['C_at_this_delta'] = dict(power=kk + 0.5, median=float(d ** (kk + 0.5) * B.median(B.abs(F[::64]))), max=float(d ** (kk + 0.5) * B.abs(F).max()),
                                            min=float(d ** (kk + 0.5) * B.abs(F).min()))
            saved[key] = (B.asnumpy(F[sl0:sl1]) if gpu else np.array(F[sl0:sl1]))
            res['cols'][key] = r
            log(key, json.dumps({k: v for k, v in r.items() if k not in ('M_K', 'ReG')}), 'M_K' in r and json.dumps(r['M_K']))
            del F
    # NUFFT check: direct sums at 4 grid points for delta = deltas[-1], k = 0
    d = deltas[-1]; chk = []
    js = [0, 12345, -q + 7, q - 3]
    acc = np.zeros(len(js), dtype=complex)
    for ci in range(meta['chunks']):
        u = B.asarray(np.load(os.path.join(PR, 'u_%04d.npy' % ci))); ph = B.asarray(np.load(os.path.join(PR, 'ph_%s_%04d.npy' % (T, ci))))
        base = u * w_of(u / L, B) * B.exp(-(0.5 + d) * u)
        e = eps_of(obj, B.rint(B.exp(u)).astype(B.int64), 1, B)
        if e is not None: base = base * e
        for i, j in enumerate(js): acc[i] += complex((base * B.exp(-1j * (ph + j * dt * u))).sum())
    u = B.asarray(ppu); ph = B.asarray(pph); base = B.asarray(ppu / pp[:, 1]) * w_of(u / L, B) * B.exp(-(0.5 + d) * u)
    e = eps_of(obj, B.asarray(pp[:, 0]), B.asarray(pp[:, 1]), B)
    if e is not None: base = base * e
    for i, j in enumerate(js): acc[i] += complex((base * B.exp(-1j * (ph + j * dt * u))).sum())
    Fl = transform(G[(len(deltas) - 1) * (3 if deriv else 1)], M, B)
    for i, j in enumerate(js):
        v = complex(Fl[j + q]); chk.append(dict(j=j, direct=[acc[i].real, acc[i].imag], nufft=[v.real, v.imag], abs_diff=abs(v - acc[i])))
    res['nufft_check'] = chk; log('NUFFT against direct sums:', json.dumps(chk))
    np.savez(os.path.join(OUT, 'p4_%s_%s_slice.npz' % (obj, T)), tau0=save_slice[0], dt=dt, T=Tf, **saved)
    json.dump(res, open(os.path.join(OUT, 'p4_%s_%s.json' % (obj, T)), 'w'), indent=1)

def selftest():
    """X = 1e6, T = 1000: (a) NUFFT against direct sums (inside run); (b) explicit formula: -Re G_0 + (1/2) log(t/2pi)-type terms against
    sum over zeros of K(s - rho) with mpmath zeros, and M against mpmath Re xi'/xi."""
    import mpmath as mp
    global PR
    PR = os.path.join(HERE, 'prim_test'); os.environ['RH_WORKERS'] = '2'
    sieve(1e6, ['1000'])
    run('zeta', '1000', deriv=True, Mlog=16, dt=0.02, save_slice=(0.0, 100.0))
    z = np.load(os.path.join(OUT, 'p4_zeta_1000_slice.npz')); L = math.log(1e6)
    mp.mp.dps = 20
    import zf
    zs = zf.load('zeta8', 5000)[0]; zs = zs[zs < 4000.0]                       # ordinates below 4000 (list of s1-zero-flow-dynamics)
    out = []
    for d in (0.5, 0.2, 0.0825):
        for j in (0, 1000, 2500, 4999):
            t = 1000.0 + j * 0.02; s = complex(0.5 + d, t)
            G0 = z['d%g_k0' % d][j]; G1 = z['d%g_k1' % d][j]; G2 = z['d%g_k2' % d][j]
            # zero side: all zeros +-gamma below 1500 with K, tail by the smooth density with kernel 1/z
            gam = np.concatenate([zs, -zs]); zz = s - (0.5 + 1j * gam)
            Kv = (1 + E_of(zz * L)) / zz; K1 = -(1 + E_of(zz * L)) / zz ** 2      # K' = -(1+E)/z^2 + L E'/z ; E' term added below
            v, c = _GL; Ep = (np.exp(-(zz * L)[:, None] * v[None, :]) * (-v * c)[None, :]).sum(1)
            K1 = K1 + L * Ep / zz
            sK = Kv.sum(); sK1 = K1.sum()
            # exact right side
            arch = 1 / s - 0.5 * math.log(math.pi) + 0.5 * complex(mp.digamma(mp.mpc(s) / 2)); Ks1 = (1 + E_of(np.array([(s - 1) * L]))[0]) / (s - 1)
            # tail of sum_rho 1/(s-rho) beyond 1500: use mpmath for the full sum instead: xi'/xi = zeta'/zeta + 1/s + 1/(s-1) - log(pi)/2 + psi(s/2)/2
            full = complex(mp.zeta(mp.mpc(s), derivative=1) / mp.zeta(mp.mpc(s))) + 1 / s + 1 / (s - 1) - 0.5 * math.log(math.pi) + 0.5 * complex(mp.digamma(mp.mpc(s) / 2))
            trunc = (1 / zz).sum(); tail = full - trunc
            lhs = sK + tail; rhs = -G0 + Ks1 + arch
            out.append(dict(delta=d, t=t, sumK_zero_side=[lhs.real, lhs.imag], prime_side=[rhs.real, rhs.imag], abs_diff=abs(lhs - rhs),
                            M_true=0.5 * full.real, M_K=0.5 * rhs.real, G1=[G1.real, G1.imag], sumKprime_zero_side=[sK1.real, sK1.imag],
                            abs_diff_k1=abs(sK1 - G1 + 0.5j / t * 0)))
            log(json.dumps(out[-1]))
    json.dump(out, open(os.path.join(OUT, 'p4_selftest.json'), 'w'), indent=1)

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'sieve': sieve(sys.argv[2], sys.argv[3].split(','))
    elif cmd == 'run': run(sys.argv[2], sys.argv[3], deriv=(len(sys.argv) > 4 and sys.argv[4] == 'deriv'), Mlog=int(os.environ.get('RH_MLOG', '28')))
    elif cmd == 'selftest': selftest()
