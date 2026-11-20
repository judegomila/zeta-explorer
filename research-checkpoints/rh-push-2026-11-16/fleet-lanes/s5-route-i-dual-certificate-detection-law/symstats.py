"""Combination 3 (and the large-support screen for 1, 2): full-prime symbol statistics and float64 Ritz values on the
orthogonal lattice nu_k = pi k / a, |k| <= K (sector matrices of size K+1 and K; K = 16384 is the 32769-dimensional space).
GPU (cupy) when available; float64 is a screen. usage: python symstats.py out.jsonl OBJ1,OBJ2 2a_1 2a_2 ...   env KMAX, TWIN"""
import os, sys, math, json, time
import numpy as np
from scipy.special import digamma
from symlib import *
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get("POOL_GB", "24")) * 1024 ** 3))
    xp = cp; GPU = True
except Exception as e:
    xp = np; GPU = False
KMAX = int(os.environ.get('KMAX', '16384')); TWIN = float(os.environ.get('TWIN', '5e4'))

def sector_mats(al, be, a, xp):
    """even and odd sector matrices (float64) from alpha_k = Im A(nu_k), beta_k = Re B(nu_k), k = 0..K"""
    K = len(al) - 1
    al_ = xp.asarray(al); be_ = xp.asarray(be); nu = xp.asarray(math.pi * np.arange(K + 1) / a)
    sg = xp.asarray(np.where(np.arange(K + 1) % 2, -1.0, 1.0))
    E = xp.empty((K + 1, K + 1)); O = xp.empty((K, K))
    step = 2048
    for i in range(1, K + 1, step):
        j = min(K + 1, i + step)
        l = slice(i, j)
        d = nu[None, 1:] - nu[l, None]; d[d == 0] = 1.0
        m1 = 2 * (sg[l, None] * sg[None, 1:]) * (al_[l, None] - al_[None, 1:]) / d
        m2 = -2 * (sg[l, None] * sg[None, 1:]) * (al_[l, None] + al_[None, 1:]) / (nu[None, 1:] + nu[l, None])
        E[l, 1:] = (m1 + m2) / (2 * a); O[i - 1:j - 1, :] = (m1 - m2) / (2 * a)
        del d, m1, m2
    kk = xp.arange(1, K + 1)
    mkk = -2 * al_[1:] / nu[1:]
    E[kk, kk] = (2 * be_[1:] + mkk) / (2 * a); O[kk - 1, kk - 1] = (2 * be_[1:] - mkk) / (2 * a)
    E[0, 0] = be_[0] / a
    E[0, 1:] = -2 * sg[1:] * al_[1:] / nu[1:] / (a * math.sqrt(2)); E[1:, 0] = E[0, 1:]
    return E, O

def full_mat(al, be, a, xp):
    """full-lattice matrix for objects with complex coefficients: indices k = -K..K"""
    n = len(al); K = (n - 1) // 2
    al_ = xp.asarray(al); nu = xp.asarray(math.pi * np.arange(-K, K + 1) / a); sg = xp.asarray(np.where(np.arange(-K, K + 1) % 2, -1.0, 1.0))
    M = xp.empty((n, n)); step = 2048
    for i in range(0, n, step):
        l = slice(i, min(n, i + step))
        d = nu[None, :] - nu[l, None]; d[d == 0] = 1.0
        M[l, :] = 2 * (sg[l, None] * sg[None, :]) * (al_[l, None] - al_[None, :]) / d / (2 * a)
    kk = xp.arange(n); M[kk, kk] = 2 * xp.asarray(be) / (2 * a)
    return M

def project(M, u, xp, big=1e3):
    """restrict to the orthogonal complement of u: P M P + big u u^T"""
    u = xp.asarray(u); u = u / xp.linalg.norm(u)
    Mu = M @ u; uMu = float(u @ Mu)
    M -= xp.outer(u, Mu); M -= xp.outer(Mu, u); M += (uMu + big) * xp.outer(u, u)
    return M

def eigs(M, xp, vec):
    M = (M + M.T) / 2
    if vec:
        w, V = xp.linalg.eigh(M); return float(w[0]), float(w[1]), V[:, 0]
    w = xp.linalg.eigvalsh(M); return float(w[0]), float(w[1]), None

def ritz(name, twoa, K):
    a = twoa / 2
    o = make_object(name, math.exp(twoa) + 1)
    pf = name in ('ZETA', 'LIOU', 'SGNR', 'UNI') or name.startswith('WT')
    cplx = name == 'UNI' or name.startswith('WT')
    rec = dict(K=K, pf=pf, omega=math.pi * K / a)
    if not cplx:
        nu = math.pi * np.arange(K + 1) / a
        A, B = symbols(o, nu, a, with_pole=not pf, xp=xp)
        E, O = sector_mats(A.imag, B.real, a, xp)
        if pf:
            p = 0.5; s = np.where(np.arange(K + 1) % 2, -1.0, 1.0)
            ev = s * p / (p * p + nu * nu); ev[0] = 1 / p / math.sqrt(2); od = (s * nu / (p * p + nu * nu))[1:]
            E = project(E, ev, xp); O = project(O, od, xp)
        best = None
        for nm, Mx in (('even', E), ('odd', O)):
            lam, lam2, v = eigs(Mx, xp, True)
            rec[nm] = lam; rec[nm + '_2'] = lam2
            v = xp.asnumpy(v) if GPU else v
            off = 0 if nm == 'even' else 1
            f = nu[off:]
            rec[nm + '_centroid'] = float((v * v * f).sum()); rec[nm + '_q90'] = float(f[np.searchsorted(np.cumsum(v * v), 0.9)])
            order = np.argsort(-v * v)[:5]; rec[nm + '_top_freqs'] = [float(f[i]) for i in order]
            del Mx
        del E, O
    else:
        Kc = K // 2
        nu = math.pi * np.arange(-Kc, Kc + 1) / a
        A, B = symbols(o, nu, a, with_pole=False, xp=xp)
        M = full_mat(A.imag, B.real, a, xp)
        for part in (0, 1):
            kp = 0.5 + 1j * nu; v = 2 * np.sinh(kp * a) / kp
            M = project(M, v.real if part == 0 else v.imag, xp)
        lam, lam2, v = eigs(M, xp, True)
        v = xp.asnumpy(v) if GPU else v
        rec['even'] = lam; rec['odd'] = lam; rec['even_2'] = lam2; rec['even_centroid'] = float((v * v * np.abs(nu)).sum())
        rec['even_q90'] = float(np.sort(np.abs(nu))[np.searchsorted(np.cumsum((v * v)[np.argsort(np.abs(nu))]), 0.9)]); rec['K'] = Kc
        del M
    if GPU: cp.get_default_memory_pool().free_all_blocks()
    rec['lam'] = min(rec['even'], rec['odd'])
    return rec

def stats(name, twoa):
    """w_F(t) = arch(t) + 2 log Q - 2 Re sum_{log n < 2a} c(n) n^{-1/2} n^{it} on [0, T], T = min(TWIN, 2 pi e e^{2a}/q)"""
    a = twoa / 2
    o = make_object(name, math.exp(twoa) + 1)
    qc = math.exp(2 * o['logQ'])
    Tst = 2 * math.pi * math.e * math.exp(twoa) / qc
    T = min(TWIN, max(Tst, 50.0)); dt = min(0.02, math.pi / (16 * a))
    t = np.arange(0, T, dt)
    w = np.full(len(t), 2 * o['logQ'])
    for z in o['zs']: w += digamma(z + 0.5j * t).real - LOGPI
    logn = np.log(o['ns'].astype(float)); keep = logn < twoa
    S0, _ = prime_sums(t, logn[keep], o['cn'][keep], a, xp=xp)
    wF = w - 2 * S0.real
    neg = float(-wF[wF < 0].sum() * dt); pos = float(wF[wF > 0].sum() * dt)
    m = max(1, int(round(math.pi / (2 * a) / dt)))
    srt = np.sort(wF)
    floor_L2 = float(srt[:m].mean())
    s2 = (t * t + 0.25) ** 2 * wF
    floor_s2 = float(np.sort(s2)[:m].sum() * dt * 2 * a / math.pi)
    # same, window restricted to t >= 1 (outside the pole well)
    return dict(T=T, Tstar=Tst, dt=dt, neg_mass=neg, pos_mass=pos, mass_ratio=neg / pos, frac_negative=float((wF < 0).mean()), wmin=float(wF.min()),
                t_at_min=float(t[np.argmin(wF)]), floor_L2=floor_L2, floor_sigma2=floor_s2, t_at_min_sigma2=float(t[np.argmin(s2)]), n_terms=int(keep.sum()))

if __name__ == '__main__':
    out = sys.argv[1]; names = sys.argv[2].split(','); sups = [float(x) for x in sys.argv[3:]]
    print('GPU', GPU, 'KMAX', KMAX, 'planned: sector matrices %dx%d float64 = %.2f GB each (two held, plus eigh workspace)' % (KMAX + 1, KMAX + 1, (KMAX + 1) ** 2 * 8 / 1e9), flush=True)
    done = set()
    if os.path.exists(out):
        for line in open(out):
            r = json.loads(line); done.add((r['obj'], r['twoa']))
    for twoa in sups:
        for nm in names:
            if (nm, twoa) in done: continue
            t0 = time.time()
            rec = dict(obj=nm, twoa=twoa)
            rec['stats'] = stats(nm, twoa)
            K = KMAX if twoa >= 6 else KMAX // 2
            rec['ritz'] = ritz(nm, twoa, K)
            rec['sec'] = round(time.time() - t0, 1)
            print('%-10s 2a=%-6.3f lam=% .4e (even % .3e odd % .3e) centroid %.1f  mass ratio %.4f floorL2 %.3f  floor_s2 %.3e  [%.0fs]' % (
                nm, twoa, rec['ritz']['lam'], rec['ritz']['even'], rec['ritz']['odd'], rec['ritz'].get('even_centroid', 0), rec['stats']['mass_ratio'],
                rec['stats']['floor_L2'], rec['stats']['floor_sigma2'], rec['sec']), flush=True)
            with open(out, 'a') as f: f.write(json.dumps(rec) + '\n')
    print('done', flush=True)
