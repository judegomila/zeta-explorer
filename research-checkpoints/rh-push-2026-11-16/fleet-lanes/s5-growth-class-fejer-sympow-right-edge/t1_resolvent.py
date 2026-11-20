"""s5 combination 1: resolvent of the Bender-Brody-Mueller difference operator with the boundary condition psi(0) = 0, per object.
   Eigenfunctions: psi_z(x) = - sum_{n >= 1} a_n (n + x)^{-z} (continued in z), x >= 0; psi_z(0) = -F(z).
     ZETA: -zeta(z, x+1).  Periodic a_n (L4, L5, DH): -q^{-z} sum_a c_a zeta(z, (a + x)/q).
     TNR (q, c): -[zeta(z, 1+x) + c q^{1/2-z} zeta(z, 1 + x/q) + q^{1-2z} zeta(z, 1 + x/q^2)].
   H psi_z = z psi_z; on the domain psi(0) = 0 the exact resolvent is
        R(s) psi_z = [psi_z - (F(z)/F(s)) psi_s] / (z - s)                     ((H - s) R(s) psi_z = psi_z, (R(s) psi_z)(0) = 0).
   Realisation: inputs g = int ghat(tau) psi_{sigma0 + i tau} dtau with ghat in L^2(t - TW, t + TW) (norm of ghat), outputs in
   L^2([0, M], (1+x)^{-2-2c} dx) (growth cap x^{1/2+c}), sigma0 = 1/2 + c, s = sigma0 + i t.
   N_M(s) = norm of R(s); computed as sqrt(lambda_max) of the Gram matrix on a tau grid of step DEL (s at midpoints).
   Usage: t1_resolvent.py run OBJ c out.json | validate | direct OBJ c t (SVD of the kernel matrix against the Gram value)"""
import sys, os, json, math, time
import numpy as np
import multiprocessing as mp
GPU = False
try:
    if os.environ.get('RH_BACKEND') == 'cpu': raise ImportError
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=int(os.environ.get('RH_POOL_GB', '10')) * 1024 ** 3)
    xp.zeros(4).sum(); GPU = True
except Exception:
    import numpy as xp
def asnp(a): return xp.asnumpy(a) if GPU else np.asarray(a)
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)

DEL = float(os.environ.get('RH_DEL', '0.125')); TW = float(os.environ.get('RH_TW', '60')); TMAX = float(os.environ.get('RH_TMAX', '200'))
MS = [1e2, 1e3, 1e4, 1e5]
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510]
A0 = 300.0

def hz(alpha, z, budget=2e7):
    """Hurwitz zeta(z_k, alpha_j), alpha > 0 real [X], z complex [Nz] with |z| <= 290: complex [X, Nz] (float64)."""
    alpha = np.asarray(alpha, dtype=np.float64); z = np.asarray(z, dtype=np.complex128)
    X, Nz = len(alpha), len(z)
    out = np.empty((X, Nz), dtype=np.complex128)
    K = np.maximum(0, np.ceil(A0 - alpha)).astype(int)
    zg = xp.asarray(z)
    B = max(1, int(budget // Nz))
    for s0 in range(0, X, B):
        al = xp.asarray(alpha[s0:s0 + B]); kk = K[s0:s0 + B]; acc = xp.zeros((len(kk), Nz), dtype=xp.complex128)
        kmax = int(kk.max())
        order = np.argsort(-kk); kks = kk[order]; als = al[xp.asarray(order)]
        for k in range(kmax):
            na = int(np.searchsorted(-kks, -k, side='left'))            # rows with K > k
            if na == 0: break
            acc[:na] += xp.exp(-xp.outer(xp.log(als[:na] + k), zg))
        x = als + xp.asarray(kks.astype(np.float64)); lx = xp.log(x)
        xs_ = xp.exp(-xp.outer(lx, zg))
        tail = xs_ * x[:, None] / (zg[None, :] - 1) + 0.5 * xs_
        poch = xp.broadcast_to(zg[None, :], xs_.shape).copy(); xp_ = xs_ / x[:, None]; f = 2.0
        for k in range(1, 9):
            tail = tail + B2K[k - 1] / f * poch * xp_
            poch = poch * (zg[None, :] + 2 * k - 1) * (zg[None, :] + 2 * k); xp_ = xp_ / (x * x)[:, None]; f = f * (2 * k + 1) * (2 * k + 2)
        res = asnp(acc + tail); inv = np.empty_like(order); inv[order] = np.arange(len(order))
        out[s0:s0 + B] = res[inv]
    return out

OBJ = {'ZETA': ('per', 1, [(1, 1.0)]), 'L4': ('per', 4, [(1, 1.0), (3, -1.0)]), 'L5': ('per', 5, [(1, 1.0), (2, -1.0), (3, -1.0), (4, 1.0)]),
       'DH': ('per', 5, [(1, 1.0), (2, KAPPA), (3, -KAPPA), (4, -1.0)]), 'TNR3': ('tnr', 3.0, 2.2), 'TNRQ': ('tnr', 1000003.0, 2.2)}

def psi(obj, x, z):
    """psi_z(x) on [X, Nz]"""
    kind = OBJ[obj][0]; x = np.asarray(x, dtype=np.float64); z = np.asarray(z, dtype=np.complex128)
    if kind == 'per':
        q, cl = OBJ[obj][1], OBJ[obj][2]
        tot = 0
        for a, c in cl: tot = tot + c * hz((a + x) / q, z)
        return -tot * np.exp(-z * math.log(q))[None, :]
    q, c = OBJ[obj][1], OBJ[obj][2]
    return -(hz(1 + x, z) + c * np.exp((0.5 - z) * math.log(q))[None, :] * hz(1 + x / q, z) + np.exp((1 - 2 * z) * math.log(q))[None, :] * hz(1 + x / q ** 2, z))

def Fval(obj, z): return -psi(obj, [0.0], z)[0]

def xnodes(Mmax):
    """Gauss-Legendre panels in u = log(1 + x); panel edges contain log(1 + M) for M in MS. Returns x, weights dx, index bounds."""
    gl_x, gl_w = np.polynomial.legendre.leggauss(96)
    edges = [0.0]; cuts = []
    for M in MS:
        if M > Mmax: break
        u1 = math.log(1 + M); n = int(math.ceil((u1 - edges[-1]) / 0.25))
        e0 = edges[-1]
        edges += [e0 + (u1 - e0) * (i + 1) / n for i in range(n)]; cuts.append(96 * (len(edges) - 1))
    xs = []; ws = []
    for a, b in zip(edges[:-1], edges[1:]):
        u = 0.5 * (a + b) + 0.5 * (b - a) * gl_x; xs.append(np.expm1(u)); ws.append(0.5 * (b - a) * gl_w * np.exp(u))
    return np.concatenate(xs), np.concatenate(ws), cuts

_G = {}
def _eig(k):
    G_list, Bm_list, n_list, f, Fs, tau, tgrid, sig0 = _G['d']
    t = tgrid[k]; sel = np.nonzero(np.abs(tau - t) <= TW)[0]; i0, i1 = sel[0], sel[-1] + 1
    d = math.sqrt(DEL) / (1j * (tau[i0:i1] - t))                # sqrt(DEL)/(z - s)
    fz = f[i0:i1]; out = []
    for G, Bm, nn in zip(G_list, Bm_list, n_list):
        b = Bm[i0:i1, k]                                         # <psi_z, psi_s>
        A = G[i0:i1, i0:i1] - np.outer(b, fz) / Fs[k] - np.outer(np.conj(fz), np.conj(b)) / np.conj(Fs[k]) + nn[k] * np.outer(np.conj(fz), fz) / abs(Fs[k]) ** 2
        A = np.conj(d)[:, None] * A * d[None, :]
        A = 0.5 * (A + A.conj().T)
        try:
            from scipy.sparse.linalg import eigsh
            w = np.sort(eigsh(A, k=2, which='LA', tol=1e-11, return_eigenvectors=False))
        except Exception:
            w = np.linalg.eigvalsh(A)
        r1 = math.sqrt(nn[k]) * np.linalg.norm(fz * d) / abs(Fs[k])
        out.append((math.sqrt(max(w[-1], 0.0)), math.sqrt(max(w[-2], 0.0)), r1))
    return k, out

def build(obj, c, Mmax=1e5):
    sig0 = 0.5 + c
    x, wx, cuts = xnodes(Mmax)
    w = wx * (1 + x) ** (-2 - 2 * c)
    ntau = int(round((TMAX + 2 * TW) / DEL)); tau = -TW + DEL * (np.arange(ntau) + 0.5)
    step = int(round(1.0 / DEL)); tgrid = DEL * step * np.arange(int(TMAX) + 1)
    log('planned memory: Psi %d x %d complex = %.2f GB; Gram %d^2 x %d = %.2f GB' % (len(x), ntau, len(x) * ntau * 16 / 1e9, ntau, len(cuts), ntau * ntau * 16 * len(cuts) / 1e9))
    z = sig0 + 1j * tau
    Psi = psi(obj, x, z); f = -psi(obj, [0.0], z)[0]
    # s grid: integers 0..200 plus the local minima of |F| on the line (on multiples of DEL)
    tf = DEL * np.arange(int(round(TMAX / DEL)) + 1); Ff = -psi(obj, [0.0], sig0 + 1j * tf)[0]; af = np.abs(Ff)
    mins = [i for i in range(1, len(tf) - 1) if af[i] < af[i - 1] and af[i] <= af[i + 1]]
    mins = sorted(mins, key=lambda i: af[i])[:60]
    tgrid = np.array(sorted(set(np.round(tgrid, 6)) | set(np.round(tf[mins], 6))))
    s = sig0 + 1j * tgrid
    Ps = psi(obj, x, s); Fs = -psi(obj, [0.0], s)[0]
    sw = np.sqrt(w)[:, None]; Psi = Psi * sw; Ps = Ps * sw
    return x, cuts, tau, tgrid, Psi, Ps, f, Fs, sig0

def run(obj, c, out):
    t0 = time.time()
    x, cuts, tau, tgrid, Psi, Ps, f, Fs, sig0 = build(obj, c)
    log(obj, 'c', c, 'kernel values done', round(time.time() - t0, 1), 's; x nodes', len(x), 'tau nodes', len(tau), 's points', len(tgrid), 'backend', 'cupy' if GPU else 'numpy')
    G_list, B_list, n_list = [], [], []
    G = np.zeros((len(tau), len(tau)), dtype=np.complex128); Bm = np.zeros((len(tau), len(tgrid)), dtype=np.complex128); nn = np.zeros(len(tgrid)); prev = 0
    for cu in cuts:
        P = xp.asarray(Psi[prev:cu]); Q = xp.asarray(Ps[prev:cu])
        G = G + asnp(P.conj().T @ P); Bm = Bm + asnp(P.conj().T @ Q); nn = nn + np.sum(np.abs(Ps[prev:cu]) ** 2, axis=0); prev = cu
        G_list.append(G.copy()); B_list.append(Bm.copy()); n_list.append(nn.copy())
    del Psi
    _G['d'] = (G_list, B_list, n_list, f, Fs, tau, tgrid, sig0)
    W = int(os.environ.get('RH_WORKERS', '4'))
    with mp.get_context('fork').Pool(W) as pool: res = pool.map(_eig, range(len(tgrid)), chunksize=4)
    rows = []
    for k, o in res:
        rows.append({'t': float(tgrid[k]), 'absF': float(abs(Fs[k])), 'N': [v[0] for v in o], 'second': [v[1] for v in o], 'rank_one': [v[2] for v in o], 'psi_norm': [float(math.sqrt(n[k])) for n in n_list]})
    N = np.array([r['N'] for r in rows]); aF = np.array([r['absF'] for r in rows])
    summ = {'max_N_by_M': N.max(axis=0).tolist(), 'argmax_t_by_M': [float(tgrid[i]) for i in N.argmax(axis=0)], 'median_N_by_M': np.median(N, axis=0).tolist(),
            'max_ratio_N(1e5)/N(1e4)': float((N[:, 3] / N[:, 2]).max()), 'max_ratio_N(1e4)/N(1e3)': float((N[:, 2] / N[:, 1]).max()), 'max_ratio_N(1e3)/N(1e2)': float((N[:, 1] / N[:, 0]).max()),
            'min_absF': float(aF.min()), 'argmin_t_absF': float(tgrid[aF.argmin()]), 'corr_logN_logabsF': float(np.corrcoef(np.log(N[:, 3]), np.log(aF))[0, 1]),
            'max_N*absF': float((N[:, 3] * aF).max()), 'min_N*absF': float((N[:, 3] * aF).min())}
    json.dump({'object': obj, 'c': c, 'sigma0': sig0, 'M': MS, 'DEL': DEL, 'TW': TW, 'x_nodes': len(x), 'summary': summ, 'rows': rows, 'seconds': time.time() - t0}, open(out, 'w'))
    log(obj, 'c', c, json.dumps(summ))

def validate():
    from flint import acb, arb, ctx
    ctx.prec = 200; rng = np.random.default_rng(1); worst = 0
    al = np.array([0.2, 0.4, 1.0, 1.37, 17.3, 250.0, 301.0, 4321.5, 9.9e4]); z = np.array([0.53 + 0.3j, 0.6 - 59.2j, 0.8 + 199.7j, 0.53 + 259.9j])
    v = hz(al, z)
    for i, a in enumerate(al):
        for j, zz in enumerate(z):
            r = acb(arb(float(zz.real)), arb(float(zz.imag))).zeta(arb(float(a))); r = complex(float(r.real.mid()), float(r.imag.mid()))
            worst = max(worst, abs(v[i, j] - r) / abs(r))
    print('Hurwitz evaluator against Arb: worst relative error %.2e' % worst)
    # psi_z(0) = -F(z): DH at its tabulated off-line zero, zeta at its first zero
    print('abs F at 0.80851718245663738 + 85.699348485377592 i (DH): %.2e' % abs(Fval('DH', [0.80851718245663738 + 85.699348485377592j])[0]))
    print('abs F at 0.5 + 14.134725141734693 i (ZETA): %.2e' % abs(Fval('ZETA', [0.5 + 14.134725141734693j])[0]))
    b = math.acosh(1.1) / math.log(3.0)
    print('abs F at 1/2 + b + i pi/log 3 (TNR3): %.2e' % abs(Fval('TNR3', [0.5 + b + 1j * math.pi / math.log(3.0)])[0]))
    # difference relation for zeta: psi_z(x) - psi_z(x - 1) = x^{-z}
    xx = np.array([1.5, 7.25, 400.0]); zz = np.array([0.6 + 33.3j]); d = psi('ZETA', xx, zz)[:, 0] - psi('ZETA', xx - 1, zz)[:, 0]
    print('difference relation psi(x) - psi(x-1) - x^{-z}:', np.abs(d - xx ** (-zz[0])).max())

def direct(obj, c, t):
    """SVD of the kernel matrix at one s against the Gram value (all four M), and with DEL halved"""
    global DEL
    for dl in (DEL, DEL / 2):
        DEL = dl
        x, cuts, tau, tgrid, Psi, Ps, f, Fs, sig0 = build(obj, c)
        k = int(np.argmin(np.abs(tgrid - t))); tt = tgrid[k]; sel = np.abs(tau - tt) <= TW
        d = math.sqrt(DEL) / (1j * (tau[sel] - tt))
        Kmat = (Psi[:, sel] - np.outer(Ps[:, k], f[sel]) / Fs[k]) * d[None, :]
        print('DEL %.4f t %.3f abs F %.4e:' % (DEL, tt, abs(Fs[k])), ' '.join('M=%g: %.6f' % (M, np.linalg.svd(Kmat[:cu], compute_uv=False)[0]) for M, cu in zip(MS, cuts)), flush=True)

if __name__ == '__main__':
    if sys.argv[1] == 'run': run(sys.argv[2], float(sys.argv[3]), sys.argv[4])
    elif sys.argv[1] == 'validate': validate()
    elif sys.argv[1] == 'direct': direct(sys.argv[2], float(sys.argv[3]), float(sys.argv[4]))
