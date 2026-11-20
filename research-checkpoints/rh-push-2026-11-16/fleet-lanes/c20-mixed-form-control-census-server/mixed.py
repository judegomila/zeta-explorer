# Part 2, float stage (screen): mixed second-order form T2 for every class. See GATE.md.
# float64 with long-double phases; MEASURED, never a verdict. Signs are decided by mixed_ball.py.
import os, sys, json, math, time
for v in ('OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[v] = '1'
import numpy as np
from multiprocessing import Pool
DELTA = 1.0 / 64; K = 14; KM = 24; RC = 10; HW = 40.0; STEP = 0.02   # K: orders in tau; KM: moment orders; RC: Taylor orders of c
NPMAX = 1100000
STEP = float(os.environ.get('MIXED_STEP', STEP))      # referee refinement only; the census uses 0.02
LD = np.longdouble
TWOPI_LD = LD(8) * np.arctan(LD(1))
CK = {0: 3 / 8, 1: -1 / 4, -1: -1 / 4, 2: 1 / 16, -2: 1 / 16}
EA_A = 0.1; DEL_B = 0.75
TNR = (3, 2.2); HQ2 = (2, 0.01); HQ34 = (2, 0.1, 0.2)

def primes_upto(N):
    s = np.ones(N + 1, dtype=bool); s[:2] = False
    for p in range(2, int(N ** 0.5) + 1):
        if s[p]: s[p * p::p] = False
    return np.nonzero(s)[0]

def P_of(t, th): return int(math.floor((t / (2 * math.pi)) ** th + 1e-9))

def cterms(u, tau=0.0):
    """<h, C_a h> = sum_l (alpha_l + beta_l a) exp(i nu_l a), h = sin^4(pi s/u) e^{i tau s}; returns list (alpha, beta, nu)"""
    om = {k: 2 * math.pi * k / u for k in CK}
    out = []
    for l in CK:
        al = CK[l] ** 2 * u
        for k in CK:
            if k != l: al = al + 2 * CK[k] * CK[l] / (1j * (om[l] - om[k]))
        out.append((al, -CK[l] ** 2, -(tau + om[l])))
    return out

def ctaylor(u, xi, Kn):
    """Taylor coefficients (order < Kn) of c at the points xi; shape (len(xi), Kn)"""
    T = np.zeros((len(xi), Kn), dtype=complex)
    for al, be, nu in cterms(u):
        e = np.exp(1j * nu * xi)
        f = 1.0
        for k in range(Kn):          # (i nu)^k / k!
            T[:, k] += e * (al + be * xi) * f
            if k + 1 < Kn: T[:, k + 1] += e * be * f
            f = f * (1j * nu) / (k + 1)
    return T

def loglocal(num, den, J):
    def lg(n):
        n = list(n) + [0.0] * (J + 1); l = [0.0] * (J + 1)
        for j in range(1, J + 1):
            l[j] = (j * n[j] - sum(i * l[i] * n[j - i] for i in range(1, j))) / j
        return l
    a, b = lg(num), lg(den)
    return [a[j] - b[j] for j in range(J + 1)]

def local_poly(cls):
    if cls == 'TNR':
        q, c = TNR; return q, [1, c, 1], [1]
    if cls == 'HQ2':
        q, eps = HQ2; return q, [1, -4, 6 + eps, -4, 1], [1, -4, 6, -4, 1]
    q, a, b = HQ34
    al = q ** a + q ** -a; be = q ** b + q ** -b
    return q, [1, -al if cls == 'HQ3' else al, 1], [1, -be, 1]

def del_set(pr):
    def expi(x):                       # Ei(x) = gamma + log x + sum x^k/(k k!), 0 < x < 40
        x = np.asarray(x, dtype=float); s = np.zeros_like(x); term = np.ones_like(x)
        for k in range(1, 200):
            term = term * x / k; s += term / k
        return 0.5772156649015329 + np.log(x) + s
    L = expi(DEL_B * np.log(pr.astype(float))) - expi(np.array([DEL_B * math.log(2.0)]))[0]
    fl = np.floor(L).astype(np.int64)
    dele = np.zeros(len(pr), dtype=bool); c = 0
    for i, f in enumerate(fl.tolist()):
        if c < f: dele[i] = True; c += 1
    return dele

class PP:
    """prime powers n < P"""
    def __init__(self, P):
        self.P = P
        pr = primes_upto(P - 1); self.pr = pr
        ns, ix, ks = [pr], [np.arange(len(pr))], [np.ones(len(pr), dtype=np.int64)]
        k = 2
        while 2 ** k < P:
            r = int(round((P - 1) ** (1.0 / k)))
            while r ** k > P - 1: r -= 1
            while (r + 1) ** k <= P - 1: r += 1
            m = pr[pr <= r]
            ns.append(m ** k); ix.append(np.arange(len(m))); ks.append(np.full(len(m), k, dtype=np.int64)); k += 1
        n = np.concatenate(ns); o = np.argsort(n, kind='stable')
        self.n = n[o]; self.ix = np.concatenate(ix)[o]; self.k = np.concatenate(ks)[o]
        self.logp = np.log(pr.astype(float))[self.ix]
        self._del = None
    def lam(self, obj):
        cls = obj[0]; lp = self.logp; n = self.n.astype(float)
        if cls in ('zeta', 'ZQ'): return lp.copy()
        if cls == 'EA': return lp * (n ** EA_A + n ** -EA_A)
        if cls == 'DEL':
            if self._del is None: self._del = del_set(self.pr)
            return np.where(self._del[self.ix], 0.0, lp)
        if cls in ('TNR', 'HQ2', 'HQ3', 'HQ4'):
            q, num, den = local_poly(cls)
            J = int(math.log(self.P) / math.log(q)) + 2
            g = loglocal(num, den, J)
            L = lp.copy()
            iq = int(np.searchsorted(self.pr, q))
            sel = self.ix == iq
            kk = self.k[sel]
            L[sel] = math.log(q) * (1 + kk * np.array([g[j] for j in kk]) * q ** (kk / 2))
            return L
        if cls == 'chain':
            bits = np.random.default_rng(121000 + obj[1]).integers(0, 2, size=max(NPMAX, len(self.pr)))[:len(self.pr)]
            sg = 1.0 - 2.0 * bits
            return lp * sg[self.ix] ** self.k
        if cls == 'LIOU': return lp * (-1.0) ** self.k
        if cls == 'haar':
            th = 2 * math.pi * np.random.default_rng(770000 + obj[1]).random(max(NPMAX, len(self.pr)))[:len(self.pr)]
            return lp * np.exp(1j * th[self.ix] * self.k)
        raise ValueError(cls)

_DH = {}
def dh_lam(P):
    if P in _DH: return _DH[P]
    k = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
    per = np.array([0, 1, k, -k, -1])
    N = P - 1
    a = per[np.arange(N + 1) % 5].astype(float)
    lam = a * np.log(np.maximum(np.arange(N + 1), 1).astype(float)); lam[0] = 0
    for d in range(2, N // 2 + 1):
        v = lam[d]
        if v != 0.0: lam[2 * d::d] -= v * a[2:N // d + 1]
    _DH.clear(); _DH[P] = lam
    return lam

def phases(n, tw):
    """returns lnf, j, base = n^(-1/2 - i tw), d"""
    ln = np.log(n.astype(LD))
    ph = np.fmod(LD(tw) * ln, TWOPI_LD).astype(float)
    lnf = ln.astype(float)
    j = np.rint(lnf / DELTA).astype(np.int64)
    d = (ln - j.astype(LD) * LD(DELTA)).astype(float)
    return lnf, j, np.exp(-0.5 * lnf - 1j * ph), d

def moments_from(j, G, A, J):
    """M[j,k] = sum A_n G_k(n) over n in bin j ; G list of K complex arrays"""
    M = np.zeros((J, KM), dtype=complex)
    for k in range(KM):
        w = A * G[k]
        M[:, k] = np.bincount(j, weights=w.real, minlength=J)[:J] + 1j * np.bincount(j, weights=w.imag, minlength=J)[:J]
    return M

def dense_moments(lam, tw, J):
    N = len(lam) - 1
    M = np.zeros((J, KM), dtype=complex); CH = 1000000
    for n0 in range(2, N + 1, CH):
        n1 = min(N + 1, n0 + CH)
        lnf, j, base, d = phases(np.arange(n0, n1), tw)
        c = base * lam[n0:n1]
        cr = c.real.copy(); ci = c.imag.copy()
        for k in range(KM):
            if k > 0: cr *= d / k; ci *= d / k
            M[:, k] += np.bincount(j, weights=cr, minlength=J)[:J] + 1j * np.bincount(j, weights=ci, minlength=J)[:J]
    return M

_GL = np.polynomial.legendre.leggauss(16)
def density_moments(lams, signs, u, J):
    """moments of the density sum_i signs_i exp(lam_i xi) on (0, u)"""
    M = np.zeros((J, KM), dtype=complex)
    xj = np.arange(J) * DELTA
    lo = np.maximum(xj - DELTA / 2, 0.0); hi = np.minimum(xj + DELTA / 2, u)
    ok = hi > lo
    x, wq = _GL
    for i in range(J):
        if not ok[i]: continue
        mid = (lo[i] + hi[i]) / 2; hw = (hi[i] - lo[i]) / 2
        pts = mid + hw * x; w = wq * hw
        dens = sum(s * np.exp(l * pts) for l, s in zip(lams, signs))
        d = pts - xj[i]; f = np.ones_like(d)
        for k in range(KM):
            M[i, k] = (w * dens * f).sum(); f = f * d / (k + 1)
    return M

def conv_moments(M, J):
    L = 1 << int(math.ceil(math.log2(2 * J + 2)))
    F = np.fft.fft(M, n=L, axis=0)
    C = np.zeros((L, KM), dtype=complex)
    for k in range(KM):
        acc = np.zeros(L, dtype=complex)
        for i in range(k + 1): acc += F[:, i] * F[:, k - i]
        C[:, k] = np.fft.ifft(acc)
    return C[:J]

def xi_moments(M, xj):
    ML = xj[:, None] * M
    ML[:, :-1] += M[:, 1:] * np.arange(1, KM)[None, :]      # xi d^k/k! = xi_j d^k/k! + (k+1) d^(k+1)/(k+1)!; top order dropped
    return ML

_FR = np.array([[math.factorial(i + r) / math.factorial(i) for r in range(RC)] for i in range(K)])
def weight(M, CT):
    """moments (orders < K) of c d mu from moments (orders < KM) of mu: W[j,i] = sum_r c_r(xi_j) M[j,i+r] (i+r)!/i!"""
    W = np.zeros((M.shape[0], K), dtype=complex)
    for i in range(K):
        for r in range(RC): W[:, i] += CT[:, r] * M[:, i + r] * _FR[i, r]
    return W

def evalS(W, E, mit):
    S = np.zeros(E.shape[0], dtype=complex); pw = np.ones(E.shape[0], dtype=complex)
    for k in range(K):
        S += (E @ W[:, k]) * pw; pw = pw * mit
    return S

def objects():
    o = [('zeta',), ('EA',), ('DEL',), ('HQ2',), ('HQ3',), ('HQ4',), ('ZQ', 0.01), ('ZQ', 0.1), ('LIOU',), ('TNR',), ('DH',)]
    o += [('chain', j) for j in range(24)] + [('haar', j) for j in range(24)]
    return o

_PP = {}
def job(spec):
    t, th, w, zq, objs, keep = spec
    t0 = time.time()
    P = P_of(t, th); u = math.log(P); tw = t + 200.0 * w; Lg = math.log(tw / (2 * math.pi))
    if P not in _PP: _PP.clear(); _PP[P] = PP(P)
    pp = _PP[P]
    J = int(u / DELTA) + 3
    xj = np.arange(J) * DELTA
    CT = ctaylor(u, xj, RC)
    c0 = 35 * u / 128
    tau = np.arange(-HW, HW + STEP / 2, STEP)
    E = np.exp(-1j * np.outer(tau, xj)); mit = -1j * tau
    lnf, jb, base, d = phases(pp.n, tw)
    G = [base.copy()]
    for k in range(1, KM): G.append(G[-1] * d / k)
    cut = xj <= u + 1.5 * DELTA
    out = []; S1z = None
    for obj in objs:
        cls = obj[0]
        if cls == 'DH':
            if P > 2.5e7: continue
            M = dense_moments(dh_lam(P), tw, J); R = math.log(5 * tw / (2 * math.pi))
        else:
            M = moments_from(jb, G, pp.lam(obj), J); R = 2 * Lg if cls == 'EA' else Lg
        if cls == 'ZQ':
            d1, d2 = zq; eta = obj[1]; db = (d1 + d2) / 2
            M = M + density_moments([1j * d1, 1j * d2, eta + 1j * db, -eta + 1j * db], [1, 1, -1, -1], u, J)
        Mc = conv_moments(M, J) * cut[:, None]
        S1 = evalS(weight(M, CT), E, mit)
        Sl = evalS(weight(xi_moments(M, xj), CT), E, mit)
        Sc = evalS(weight(Mc, CT), E, mit)
        if cls == 'zeta': S1z = S1
        a1 = 2 * S1.real / c0; q2a = 2 * Sl.real / c0; q2b = 2 * Sc.real / c0
        T1n = (R - a1) / Lg
        T2n = (R * R / 2 - R * a1 + q2a + q2b) / Lg ** 2
        i = int(np.argmin(T2n)); neg = T2n < 0
        rec = {'t': t, 'theta': th, 'w': w, 'P': P, 'obj': list(obj), 'R_over_Lg': R / Lg,
               'm': float(T2n[i]), 'tau_min': float(tau[i]), 'T1n_at_min': float(T1n[i]),
               'parts_at_min': [float(R * R / 2 / Lg ** 2), float(-R * a1[i] / Lg ** 2), float(q2a[i] / Lg ** 2), float(q2b[i] / Lg ** 2)],
               'neg2': float(neg.mean()), 'neg1': float((T1n < 0).mean()), 'minT1n': float(T1n.min()),
               'q01': float(np.quantile(T2n, 0.01)), 'q50': float(np.quantile(T2n, 0.5)), 'meanT2n': float(T2n.mean()),
               'Q1_mean': float((-R * a1).mean() / (R * u)), 'Q1_sd': float((R * a1).std() / (R * u)),
               'Q2a_sd': float(q2a.std() / u ** 2), 'Q2b_sd': float(q2b.std() / u ** 2), 'Q2_sd': float((q2a + q2b).std() / u ** 2),
               'Q2_mean': float((q2a + q2b).mean() / u ** 2),
               'kappa': float(T1n[neg].max()) if neg.any() else None,
               'imS1_at_min': float(S1[i].imag / c0),
               'dS1_vs_zeta': float(np.abs(S1 - S1z).max() / c0) if S1z is not None else None}
        if cls == 'DEL': rec['deleted_below_P'] = int(pp._del.sum())
        if cls == 'ZQ': rec['zq_d'] = [d1, d2]
        if keep and cls in keep: rec['T2n_grid'] = [float(x) for x in T2n[::5]]; rec['T1n_grid'] = [float(x) for x in T1n[::5]]
        out.append(rec)
    return out, time.time() - t0

def zq_pairs(cells, nw):
    try:
        import flint
    except ImportError:
        return None
    flint.ctx.prec = 120
    out = {}
    for t in sorted({c[0] for c in cells}):
        for w in range(nw):
            tw = t + 200.0 * w
            n0 = int(tw / (2 * math.pi) * math.log(tw / (2 * math.pi * math.e)) + 7 / 8)
            g = [flint.acb.zeta_zero(n).imag for n in range(max(1, n0 - 3), n0 + 5)]
            k = min(range(len(g) - 1), key=lambda i: abs(float((g[i] + g[i + 1]) / 2 - flint.arb(tw))))
            out[(t, w)] = (float(g[k] - flint.arb(tw)), float(g[k + 1] - flint.arb(tw)), str(g[k]), str(g[k + 1]))
    return out

if __name__ == '__main__':
    tag = sys.argv[1]
    cells = [(float(x.split(':')[0]), float(x.split(':')[1])) for x in sys.argv[2].split(',')]
    NW = int(sys.argv[3]) if len(sys.argv) > 3 else 24
    only = sys.argv[4].split(',') if len(sys.argv) > 4 and sys.argv[4] != 'all' else None
    nw = int(os.environ.get('RH_WORKERS', '4'))
    zq = zq_pairs(cells, NW) if (only is None or 'ZQ' in only) else None
    objs = [o for o in objects() if (only is None or o[0] in only) and (zq is not None or o[0] != 'ZQ')]
    cells.sort(key=lambda c: P_of(*c))
    jobs = [(t, th, w, zq[(t, w)][:2] if zq else None, objs, ('zeta',) if w == 0 else None) for t, th in cells for w in range(NW)]
    Pmax = max(P_of(*c) for c in cells)
    print('jobs', len(jobs), 'workers', nw, 'objects', len(objs), 'Pmax', Pmax,
          'planned memory per worker about %.2f GB' % (Pmax / math.log(Pmax) * 1.1 * (KM * 16 + 80) / 1e9 + Pmax * 9 / 1e9 + (Pmax * 8 * 3 / 1e9 if Pmax <= 2.5e7 else 0) + 0.4), flush=True)
    if zq: json.dump({'%g:%d' % k: v for k, v in zq.items()}, open('zq_%s.json' % tag, 'w'))
    t0 = time.time()
    with Pool(nw, maxtasksperchild=6) as pool, open('mixed_%s.jsonl' % tag, 'a') as fo:
        for i, (recs, sec) in enumerate(pool.imap(job, jobs, chunksize=1)):
            for r in recs: fo.write(json.dumps(r) + '\n')
            fo.flush()
            z = recs[0]
            print(i, z['t'], z['theta'], 'w', z['w'], 'P', z['P'], 'zeta m %.4f neg2 %.4f neg1 %.4f' % (z['m'], z['neg2'], z['neg1']), 'sec %.1f' % sec, 'elapsed %.0f' % (time.time() - t0), flush=True)
    print('done', time.time() - t0, flush=True)
