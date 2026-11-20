"""Combination 2: Gaussian-damped Gram form on primon states,
     G_ij = D_t(log p_i - log p_j) / sqrt(p_i p_j),   D_t(u) = sum_zeta e^{i zeta u - t zeta^2}  (zeros rho = 1/2 + i zeta).
   Zero side:  G = sum over zeros (rank one per on-line pair, rank <= 4 indefinite per off-line quadruple).
   Prime side (own coefficients; no zero is used):
     G = poles + sum_k dr e^{-t r_k^2} m(r_k) Re[a(r_k) a(r_k)^*],  a_i(r) = p_i^{-1/2 + i r},
     m(r) = (1/2pi) [const + sum_e Re psi((e + i r)/2) - 2 Re S(r)],  S(r) = sum_{n <= X} Lambda_F(n) n^{-1/2 - i r}
     (trapezoid rule in r, step dr with 2pi/dr > log X + span of the nodes; valid for nodes with log(p_max/p_min) <= log X - 7 sqrt(2t)).
   float64 (cupy when available); a screen, not a verdict.
   usage: combo2.py OUT.json N NODESET SIDE codes t1,t2,...     NODESET: first | log7 (log-uniform sample of primes <= 1e7)"""
import sys, json, math, os, time, numpy as np
from scipy.special import digamma
import ctl
try:
    if os.environ.get('RH_BACKEND') == 'cpu': raise ImportError
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=24 * 1024 ** 3); xp = cp; GPU = True
except Exception:
    xp = np; GPU = False
BT = os.environ.get('RH_BATTERY', '../../c12-control-battery-harness/tables/')
ZF = os.environ.get('RH_ZETA_ZEROS', '../../s1-zero-flow-dynamics/data/zeta_1e7.npy')
XCUT = float(os.environ.get('C2_XCUT', '1e8'))

def to_np(a): return cp.asnumpy(a) if GPU else a

def zero_table(code, H):
    """on-line positive ordinates and off-line (delta, gamma) with gamma > 0, delta > 0, up to height H"""
    zz = np.load(ZF, mmap_mode='r'); nz = int(np.searchsorted(zz, H)); zeta = np.array(zz[:nz])
    if code == 'ZETA': return zeta, []
    if code == 'TNR':
        d = ctl.TNR_THETA / math.log(ctl.TNR_Q); k = np.arange(0, int(H * math.log(3) / (2 * np.pi)) + 1); g = (2 * k + 1) * np.pi / math.log(3)
        return zeta, [(d, float(x)) for x in g if x <= H]
    if code.startswith('EA-'): return np.zeros(0), [(eval(code[3:]), float(x)) for x in zeta]
    z = json.load(open(BT + 'zeros_%s.json' % code))
    on = np.array([float(x) for x in z['online']]); on = on[on <= H]
    if code == 'DH': off = [(float(o[0]) - 0.5, float(o[1])) for o in z['offline'] if float(o[1]) <= H]
    else: off = [(float(o[0]), float(o[1])) for o in z['offline'] if float(o[1]) <= H]      # HEAT: Re z listed
    return on, off

def syrk_acc(G, l, isq, r, w):
    """G += sum_k w_k (c_k c_k^T + s_k s_k^T), c_k,i = cos(r_k l_i) isq_i ; chunked over k"""
    N = len(l); ch = max(1, int(1.5e9 // (8 * N)))
    for i in range(0, len(r), ch):
        ph = xp.outer(xp.asarray(r[i:i + ch]), l); ww = xp.asarray(w[i:i + ch])[:, None]
        C = xp.cos(ph) * isq; G += C.T @ (C * ww); del C
        S = xp.sin(ph) * isq; G += S.T @ (S * ww); del S, ph
    return G

def gram_zero(code, t, p):
    cut = math.sqrt(46.0 / t); on, off = zero_table(code, cut)
    l = xp.asarray(np.log(p)); isq = xp.asarray(p ** -0.5); N = len(p)
    G = xp.zeros((N, N))
    if len(on): syrk_acc(G, l, isq, on, 2 * np.exp(-t * on ** 2))
    for d, g in off:
        # 2 e^{-t(g^2-d^2)} [e^{d u} cos(g u + 2 t g d) + e^{-d u} cos(g u - 2 t g d)],  u = l_i - l_j
        amp = 2 * math.exp(-t * (g * g - d * d)); phi = 2 * t * g * d
        up = xp.exp(d * l) * isq; um = xp.exp(-d * l) * isq
        U1 = up * xp.cos(g * l + phi); V1 = um * xp.cos(g * l); U2 = up * xp.sin(g * l + phi); V2 = um * xp.sin(g * l)
        T = xp.outer(U1, V1) + xp.outer(U2, V2); G += amp * (T + T.T)
    return G, dict(n_online=int(len(on)), n_offline=len(off), cut_height=cut)

def gram_prime(code, t, p, variant='full', vc=None):
    sp = ctl.spec(code); lsp = math.log(p[-1] / p[0]); sig = math.sqrt(2 * t)
    assert lsp <= math.log(XCUT) - 7 * sig + 1e-9, 'node span %.3f exceeds log X - 7 sigma = %.3f' % (lsp, math.log(XCUT) - 7 * sig)
    dr = 2 * np.pi / (math.log(XCUT) + lsp + 4.0); R = math.sqrt(46.0 / t); K = int(R / dr) + 1; r = dr * np.arange(K + 1)
    v, c = vc if vc is not None else ctl.coeffs(code, XCUT)
    if variant == 'cut': m_ = v <= math.log(p[-1]) + 1e-12; v, c = v[m_], c[m_]
    t0 = time.time(); S = ctl.expsum_uniform(v, c, np.pi / dr, K)        # S(k dr) = sum c e^{+i k dr v}; Re is what is used
    m = np.full(K + 1, sp['const'])
    for e in sp['gam']: m += digamma((e + 1j * r) / 2).real
    m = (m - 2 * S.real) / (2 * np.pi)
    w = 2 * dr * np.exp(-t * r ** 2) * m; w[0] /= 2
    l = xp.asarray(np.log(p)); isq = xp.asarray(p ** -0.5); N = len(p)
    G = xp.zeros((N, N)); syrk_acc(G, l, isq, r, w)
    # alias images of the archimedean kernel -e^{-e v}/(1-e^{-2v}) under the trapezoid rule (period Pd = 2pi/dr): removed in closed form
    Pd = 2 * np.pi / dr
    for e in sp['gam']:
        for j in (0, 1, 2):
            ee = e + 2 * j
            if ee * Pd > 60 or ee == 0: continue
            T = xp.outer(xp.exp(ee * l) * isq, xp.exp(-ee * l) * isq); G += math.exp(t * ee ** 2) / math.expm1(ee * Pd) * (T + T.T)
    if variant != 'nopole':
        for cpol in sp['poles']:
            # e^{t c^2} 2cosh(c u)/sqrt(p_i p_j) = e^{t c^2} (p_i^{c-1/2} p_j^{-c-1/2} + transpose)
            T = xp.outer(xp.exp(cpol * l) * isq, xp.exp(-cpol * l) * isq); G += math.exp(t * cpol ** 2) * (T + T.T)
    return G, dict(r_nodes=K + 1, dr=dr, nterms=int(len(v)), expsum_sec=time.time() - t0)

def nodeset(kind, N):
    if kind == 'first':
        X = int(max(100, 1.3 * N * (math.log(N) + math.log(math.log(N + 3)) + 1))); pr = ctl.primes_upto(X); return pr[:N].astype(np.float64)
    if kind.startswith('log'):
        P = 10.0 ** float(kind[3:]); pr = ctl.primes_upto(P)
        tgt = np.exp(np.linspace(math.log(2.0), math.log(P), N)); idx = np.unique(np.clip(np.searchsorted(pr, tgt), 0, len(pr) - 1))
        if len(idx) < N:      # fill with the largest unused primes
            rest = np.setdiff1d(np.arange(len(pr)), idx)[-(N - len(idx)):]; idx = np.sort(np.concatenate([idx, rest]))
        return pr[idx].astype(np.float64)
    raise ValueError

def spectrum(G, want_vec=False):
    G = (G + G.T) / 2
    if want_vec:
        ev, V = xp.linalg.eigh(G); return to_np(ev), to_np(V[:, 0])
    return to_np(xp.linalg.eigvalsh(G)), None

def summarize(ev):
    lmax = float(ev[-1]); floor = 1e-11 * lmax
    return dict(lam_min=float(ev[0]), lam_max=lmax, lam_min_rel=float(ev[0] / lmax), n_neg_above_floor=int(np.sum(ev < -floor)), num_rank=int(np.sum(ev > floor)))

if __name__ == '__main__':
    out = sys.argv[1]; N = int(sys.argv[2]); kind = sys.argv[3]; side = sys.argv[4]; codes = sys.argv[5].split(','); ts = [float(x) for x in sys.argv[6].split(',')]
    p = nodeset(kind, N); print('backend', 'cupy' if GPU else 'numpy', 'N', len(p), 'p range', p[0], p[-1], 'planned G memory %.2f GB (x4 with eigensolver workspace)' % (8 * len(p) ** 2 / 1e9), flush=True)
    res = []
    for code in codes:
        vc = None
        for t in ts:
            for variant in (side.split('+')):
                t0 = time.time()
                try:
                    if variant == 'zero': G, info = gram_zero(code, t, p)
                    else:
                        pp = p
                        lim = math.log(XCUT) - 7 * math.sqrt(2 * t)
                        if math.log(p[-1] / p[0]) > lim: pp = p[p <= p[0] * math.exp(lim)]
                        if vc is None: vc = ctl.coeffs(code, XCUT)
                        G, info = gram_prime(code, t, pp, variant, vc); info['N_used'] = int(len(pp)); info['p_max_used'] = float(pp[-1])
                    ev, _ = spectrum(G); r = dict(code=code, t=t, side=variant, N=int(G.shape[0]), nodeset=kind, **summarize(ev), **info, sec=time.time() - t0)
                    del G
                    if GPU: cp.get_default_memory_pool().free_all_blocks()
                except Exception as ex:
                    r = dict(code=code, t=t, side=variant, error=repr(ex)[:300])
                res.append(r); print(json.dumps(r), flush=True); json.dump(res, open(out, 'w'), indent=0)
    print('DONE')
