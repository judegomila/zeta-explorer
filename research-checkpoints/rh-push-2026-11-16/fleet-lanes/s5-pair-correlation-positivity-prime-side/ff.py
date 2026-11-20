"""s5 combinations 1 and 2 (zero side): tapered periodogram (form factor) of a list of unfolded ordinates and kernel integrals.

Block of unfolded length Bl, Hann taper w.  S(alpha) = sum_j w_j exp(-2 pi i alpha x_j),  I(alpha) = |S|^2 / sum w_j^2,
alpha on the grid k/(2 Bl).  For an even kernel g with transform r(x) = int g(alpha) e^{2 pi i alpha x} d alpha,
   Q_g = sum_k g(alpha_k) I(alpha_k) / (2 Bl) = (1/sum w^2) sum_{j,k} w_j w_k r(x_j - x_k)      (identity up to periodisation at 2 Bl)
which is int h |S_I|^2 >= 0 in the notation of the m23 docs.  Evaluation: cells of size h = 1/32, Taylor moments to order 9, FFT.
Prediction: Q_g = g(0) + int g(alpha) min(|alpha|, 1) d alpha + (2/(pi L)) int_0^R r(L r/2 pi) Re[d(r) - B(r) + e^{-irL} z(r)] dr
(Bogomolny-Keating / Conrey-Snaith two-point function, class rmt.BK; HEURISTIC), L = log(q t/2 pi).
Kernels:
  tri(lam)  g = (1/lam)(1 - |a|/lam)_+     r = sinc^2(pi lam x)          Q = R_lam (Frobenius norm per zero of the bandwidth-lam Gabor matrix); certificate c = 2 - R
  fej(W)    g = (1 - |a|/W)_+^2            r = W 4 (k - sin k)/k^3, k = 2 pi W x     variance of the linear statistic sum_j W sinc^2(pi W (x_j - y)) (connected part: g(0) omitted)
  tent(c)   g = tent of half-width 1/6 at +-c   r = 2 cos(2 pi c x) (1/6) sinc^2(pi x/6)    band-resolved form factor
  pois(W)   g = exp(-4 pi |a|) 1(|a| > W)   (measured only; source law (1/a) e^{-aW}... with F = 1)
"""
import sys, math, json, time, os
import numpy as np
PI = math.pi
HCELL = 1.0 / 32; KT = 10; AMAX = 3.6
LAMS = [0.5, 0.8, 1.0, 1.04, 1.26, 1.5, 1.7, 2.0, 2.5, 3.0]
WS = [2.0 / 3, 1.0, 4.0 / 3, 2.0, 3.0]
CS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0]
PW = [0.0, 2.0 / 3, 1.0, 4.0 / 3, 2.0]
TW = 1.0 / 6

def kernels():
    ks = []
    for l in LAMS: ks.append(('tri', l))
    for W in WS: ks.append(('fej', W))
    for c in CS: ks.append(('tent', c))
    return ks

def g_alpha(k, a):
    kind, p = k
    a = np.abs(a)
    if kind == 'tri': return np.clip(1 - a / p, 0, None) / p
    if kind == 'fej': return np.clip(1 - a / p, 0, None) ** 2
    if kind == 'tent': return np.clip(1 - np.abs(a - p) / TW, 0, None) + np.clip(1 - np.abs(a + p) / TW, 0, None)
    raise ValueError

def r_x(k, x):
    kind, p = k
    if kind == 'tri': return np.sinc(p * x) ** 2
    if kind == 'fej':
        kk = 2 * PI * p * np.asarray(x, dtype=float)
        small = np.abs(kk) < 1e-2
        ks = np.where(small, 1.0, kk)
        v = 4 * (ks - np.sin(ks)) / ks ** 3
        v = np.where(small, 4 * (1 / 6.0 - kk ** 2 / 120.0), v)
        return p * v
    if kind == 'tent': return 2 * np.cos(2 * PI * p * x) * TW * np.sinc(TW * x) ** 2
    raise ValueError

def gue_value(k, conn):
    """g(0) [unless conn] + int g min(|a|,1)"""
    a = np.linspace(-AMAX - 1, AMAX + 1, 920001)
    v = np.trapezoid(g_alpha(k, a) * np.minimum(np.abs(a), 1.0), a)
    return float(v + (0.0 if conn else g_alpha(k, np.array([0.0]))[0]))

class Pred:
    def __init__(self, q, R=60.0, dr=0.004, P=10 ** 6):
        import rmt
        nx = int(round(R / dr))
        self.bk = rmt.BK(q, P=P, xmax=R, nx=nx)
        self.r = self.bk.x; self.dr = dr
        self.dsm = (self.bk.D + 1 / self.r ** 2 - self.bk.B)      # diagonal part minus its mean (-1/r^2 removed)
        self.z = self.bk.Z - 1 / self.r ** 2
        self.cache = {}
    def arith(self, k, L):
        key = (k, round(L, 3))
        if key not in self.cache:
            rr = r_x(k, L * self.r / (2 * PI))
            f = rr * (self.dsm + np.exp(-1j * self.r * L) * self.z).real
            fd = rr * self.dsm.real
            c = 2 / (PI * L) * self.dr
            # r = 0 endpoint: half weight with the value at the first node
            self.cache[key] = (c * (f.sum() - 0.5 * f[-1] + 0.5 * f[0]), c * (fd.sum() - 0.5 * fd[-1] + 0.5 * fd[0]))
        return self.cache[key]

def periodogram(x, x0, Bl):
    """I(alpha_k), k = 0..kmax, alpha_k = k/(2 Bl); points x in [x0, x0+Bl)"""
    M = int(round(Bl / HCELL)); Mp = 2 * M
    y = (x - x0)
    w = np.sin(PI * y / Bl) ** 2
    c = np.floor(y / HCELL).astype(np.int64); c = np.clip(c, 0, M - 1)
    d = y - (c + 0.5) * HCELL
    kmax = int(AMAX * 2 * Bl)
    al = np.arange(kmax + 1) / (2.0 * Bl)
    S = np.zeros(kmax + 1, dtype=np.complex128)
    wm = w.copy(); fac = np.ones(kmax + 1, dtype=np.complex128)
    for m in range(KT):
        mom = np.bincount(c, weights=wm, minlength=M)
        F = np.fft.rfft(mom, n=Mp)[:kmax + 1]
        S += fac * F
        wm = wm * d
        fac = fac * (-2j * PI * al) / (m + 1)
    return al, (S.real ** 2 + S.imag ** 2) / np.sum(w * w), float(np.sum(w * w)), len(x)

def direct_Q(x, x0, Bl, k):
    y = x - x0; w = np.sin(PI * y / Bl) ** 2
    d = y[:, None] - y[None, :]
    return float((w[:, None] * w[None, :] * r_x(k, d)).sum() / np.sum(w * w))

def analyse(lst, Bl=32768.0, pred=None, log=print, maxblocks=None, nbin=360):
    x = lst['x']; t = lst['t0'] + lst['d']; q = lst['q']
    ks = kernels()
    kmax = int(AMAX * 2 * Bl); al = np.arange(kmax + 1) / (2.0 * Bl); da = 1 / (2.0 * Bl)
    K0 = 32                                                       # connected part: k >= K0 (alpha >= 16/Bl)
    gk = [g_alpha(k, al) for k in ks]
    pw = [np.exp(-4 * PI * al) * (al > W) for W in PW]
    binidx = np.minimum((al / 0.01).astype(int), nbin - 1)
    nb = int((x[-1] - x[0]) // Bl)
    if maxblocks: nb = min(nb, maxblocks)
    rows = []; Fb = np.zeros((nb, nbin)); t0 = time.time()
    for b in range(nb):
        xa = x[0] + b * Bl
        i0, i1 = np.searchsorted(x, [xa, xa + Bl])
        al_, I, sw2, n = periodogram(x[i0:i1], xa, Bl)
        L = float(np.mean(np.log(q * t[i0:i1] / (2 * PI))))
        row = dict(L=L, n=n)
        full = [float((g[0] * I[0] + 2 * np.sum(g[1:] * I[1:])) * da) for g in gk]
        conn = [float(2 * np.sum(g[K0:] * I[K0:]) * da) for g in gk]
        row['full'] = full; row['conn'] = conn
        row['pois'] = [float(2 * np.sum(p[K0:] * I[K0:]) * da) for p in pw]
        Fb[b] = np.bincount(binidx[K0:], weights=I[K0:], minlength=nbin) / np.maximum(np.bincount(binidx[K0:], minlength=nbin), 1)
        if pred is not None:
            ar = [pred.arith(k, L) for k in ks]
            row['arith'] = [float(a[0]) for a in ar]; row['arith_diag'] = [float(a[1]) for a in ar]
        rows.append(row)
        if b % 50 == 0: log('   block %d/%d  n=%d L=%.3f  %.0fs' % (b, nb, n, L, time.time() - t0))
    def jk(v):
        v = np.asarray(v, dtype=float); m = v.mean(0); n = len(v)
        return m, (v.std(0, ddof=1) / math.sqrt(n) if n > 1 else np.zeros_like(m))
    out = dict(name=lst['name'], q=q, n_zeros=int(len(x)), nblocks=nb, Bl=Bl, T_lo=float(t[0]), T_hi=float(t[-1]), L_mean=float(np.mean([r['L'] for r in rows])),
               mean_n_per_block=float(np.mean([r['n'] for r in rows])))
    full_m, full_s = jk([r['full'] for r in rows]); conn_m, conn_s = jk([r['conn'] for r in rows])
    if pred is not None:
        ar_m, _ = jk([r['arith'] for r in rows]); ad_m, _ = jk([r['arith_diag'] for r in rows])
    out['kernels'] = []
    for i, k in enumerate(ks):
        e = dict(kind=k[0], par=k[1], full=float(full_m[i]), full_se=float(full_s[i]), conn=float(conn_m[i]), conn_se=float(conn_s[i]),
                 gue_full=gue_value(k, False), gue_conn=gue_value(k, True))
        if pred is not None: e['arith'] = float(ar_m[i]); e['arith_diag'] = float(ad_m[i])
        out['kernels'].append(e)
    pm, ps = jk([r['pois'] for r in rows])
    a = 4 * PI
    def pois_gue(W):
        if W >= 1: return 2 * math.exp(-a * W) / a
        f = lambda s: -math.exp(-a * s) * (s / a + 1 / a ** 2)
        return 2 * (f(1.0) - f(W) + math.exp(-a) / a)
    out['pois'] = [dict(W=W, meas=float(pm[i]), se=float(ps[i]), gue=pois_gue(W)) for i, W in enumerate(PW)]
    Fm, Fs = jk(Fb)
    out['F_alpha'] = dict(da=0.01, mean=[float(v) for v in Fm], se=[float(v) for v in Fs])
    return out

def landau(lst, xs, Bl=32768.0):
    """(1/sum w) sum_j w_j exp(i gamma_j log x) per block (Hann in t); expectation -Lambda(x)/(L sqrt x) per zero"""
    import mpmath as mp
    mp.mp.dps = 40
    x = lst['x']; d = lst['d']; t0 = lst['t0']
    nb = int((x[-1] - x[0]) // Bl); res = {}
    for X in xs:
        lx = math.log(X)
        ph0 = float(mp.fmod(mp.mpf(t0) * mp.log(X), 2 * mp.pi))
        vals = []; Ls = []
        for b in range(nb):
            i0, i1 = np.searchsorted(x, [x[0] + b * Bl, x[0] + (b + 1) * Bl])
            dd = d[i0:i1]
            w = np.sin(PI * (dd - dd[0]) / (dd[-1] - dd[0])) ** 2
            vals.append(np.sum(w * np.exp(1j * (ph0 + dd * lx))) / np.sum(w)); Ls.append(np.mean(np.log(lst['q'] * (t0 + dd) / (2 * PI))))
        v = np.array(vals); L = float(np.mean(Ls))
        res[str(X)] = dict(re=float(v.real.mean()), im=float(v.imag.mean()), se=float(v.real.std(ddof=1) / math.sqrt(len(v))) if len(v) > 1 else None, L=L, nblocks=nb)
    return res

if __name__ == '__main__':
    import lists
    out = sys.argv[1]; names = sys.argv[2:]
    preds = {}; res = []
    for nm in names:
        mb = None
        if ':' in nm: nm, mb = nm.split(':'); mb = int(mb)
        lst = lists.load(nm)
        print('list', nm, len(lst['x']), 'zeros; planned allocation per block: 10 arrays of %d float64 = %.2f GB' % (int(2 * 32768 / HCELL), 10 * 2 * 32768 / HCELL * 8 / 1e9), flush=True)
        q = lst['q']
        if q not in preds:
            t0 = time.time(); preds[q] = Pred(q); print('  BK table q=%d built %.0fs' % (q, time.time() - t0), flush=True)
        r = analyse(lst, pred=preds[q], log=lambda s: print(s, flush=True), maxblocks=mb)
        if lst['kind'] in ('odl', 'blk') and q == 1:
            r['landau'] = landau(lst, [2, 3, 1000003, 999983, 1000002])
        res.append(r)
        json.dump(res, open(out, 'w'), indent=1)
        print('  done', nm, flush=True)
