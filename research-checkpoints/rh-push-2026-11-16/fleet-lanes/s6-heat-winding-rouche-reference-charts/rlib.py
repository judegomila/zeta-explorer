"""Shared engine, lane s6-heat-winding-rouche-reference-charts.

Object.  For a function with completed form Lam(s) = G(s) F(s) = eps Lam~(1 - s), F(s) = sum a(n) n^-s, the heat family
Lam_t(s) = E Lam(s + sqrt(t/2) N) (N standard normal; in Polymath's variable z = x + i y, s = (1 + y - i x)/2, this is H_t) has the
two-ladder approximant (Polymath15 A + B, same derivation for a general gamma factor: term by term second-order saddle)

    Lam_t(s) ~ M_t(s) sum_{n<=N} a(n) b_n n^{-s - (t/2) alpha(s)} + eps M_t(w) sum_{n<=N} conj(a(n)) b_n n^{-w - (t/2) alpha(w)},
    w = 1 - s,  alpha = G'/G,  M_t = G exp((t/4) alpha^2),  b_n = exp((t/4) log^2 n),  N = floor(sqrt(q x/4 pi + t/16)).

Normalised:  f = Lam_t/M_t(s) = D + eps exp(LR) R  (D direct ladder = "B/B_0", second term = "A/B_0").
Rows of f on uniform x grids (step H) are computed by a type-1 nonuniform FFT over the frequencies (log n)/2, with
 - phases (x_c/2) log p mod 2 pi from 256-bit ball arithmetic at the chunk centre x_c (primes; composites by additivity),
 - the slowly varying gamma data (alpha(s), alpha(w), LR) as degree-11 polynomial fits of 256-bit values on the chunk,
 - the slow drift of the exponent Re s* across the chunk by a Taylor expansion in eps log n (orders 0..2),
 - the change of N inside a chunk by adding the new terms directly from their window edge on.
float64 throughout after the phase reduction.  The approximant is the object of the tests (no Riemann-Siegel correction term).
"""
import math, os, sys, time
import numpy as np
from flint import acb, arb, acb_poly, ctx
try:
    if os.environ.get('S6_NOGPU'): raise ImportError
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('S6_POOL_GB', '6')) * 1024**3))
    xp = cp; GPU = True
except Exception:
    cp = None; xp = np; GPU = False

def asnp(a):
    return cp.asnumpy(a) if GPU and isinstance(a, cp.ndarray) else np.asarray(a)

def pval(co, u):
    """Horner; co numpy coefficients highest first, u xp array or scalar"""
    r = complex(co[0]) if np.iscomplexobj(co) else float(co[0])
    for c in co[1:]:
        r = r * u + (complex(c) if np.iscomplexobj(co) else float(c))
    return r

PREC = 256
H = 1.0 / 16
LEVELS = [0.03, 0.04, 0.10, 0.165, 0.1809, 0.20, 0.28, 0.36, 0.44, 0.50, 0.60, 0.70, 0.80, 0.8645, 0.93, 1.0]
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
SEED = 20261120
TWO_PI = 2 * math.pi

def log(*a):
    print(time.strftime('%H:%M:%S'), *a, flush=True)

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]

# ---------------------------------------------------------------- coefficients
_PRIME_DRAW = {}
def prime_draw(nmax=3_000_000):
    """fixed random data at primes <= 3e6: signs (+1 at 2,3,5,7,11 and -1 at 13 imposed, as in lane s3) and phases"""
    if 'pr' not in _PRIME_DRAW:
        pr = primes_upto(nmax)
        sg = np.random.default_rng(SEED).integers(0, 2, len(pr)) * 2 - 1
        sg[:5] = 1; sg[5] = -1
        un = np.random.default_rng(SEED + 1).uniform(0, TWO_PI, len(pr))
        _PRIME_DRAW.update(pr=pr, sg=sg, un=un)
    return _PRIME_DRAW['pr'], _PRIME_DRAW['sg'], _PRIME_DRAW['un']

def additive_table(N, pr, vals):
    """t[n] = sum_p v_p(n) vals[p] for n <= N"""
    t = np.zeros(N + 1)
    for p, v in zip(pr, vals):
        p = int(p)
        if p > N: break
        pk = p
        while pk <= N:
            t[pk::pk] += v
            pk *= p
    return t

CHI5 = np.array([0, 1, 1j, -1j, -1], dtype=np.complex128)
DHPER = np.array([0, 1, KAPPA, -KAPPA, -1.0])
CHI4 = np.array([0.0, 1, 0, -1])

def coefs(kind, N):
    n = np.arange(0, N + 1)
    if kind == 'ZETA': return np.ones(N + 1)
    if kind == 'CHI4': return CHI4[n % 4].copy()
    if kind == 'CHI5': return CHI5[n % 5].copy()
    if kind == 'CHI5B': return np.conj(CHI5[n % 5])
    if kind == 'DH': return DHPER[n % 5].copy()
    pr, sg, un = prime_draw()
    if kind == 'SGN':
        t = additive_table(N, pr, (sg < 0).astype(float))
        return 1.0 - 2.0 * (np.round(t).astype(np.int64) % 2)
    if kind == 'U':
        return np.exp(1j * additive_table(N, pr, un))
    raise ValueError(kind)

def coef_at_primes(kind, ps):
    """a(p) for the Euler-type reference"""
    ps = np.asarray(ps)
    if kind == 'ZETA': return np.ones(len(ps))
    if kind == 'CHI4': return CHI4[ps % 4]
    if kind == 'CHI5': return CHI5[ps % 5]
    if kind == 'CHI5B': return np.conj(CHI5[ps % 5])
    if kind == 'DH': return DHPER[ps % 5]
    pr, sg, un = prime_draw()
    idx = np.searchsorted(pr, ps)
    if kind == 'SGN': return sg[idx].astype(float)
    if kind == 'U': return np.exp(1j * un[idx])
    raise ValueError(kind)

# gamma type, conductor, root number.  Z: (w(w-1)/2) pi^{-w/2} Gamma(w/2);  O4/O5: (q/pi)^{w/2} Gamma((w+1)/2)
GT = {'ZETA': 'Z', 'SGN': 'Z', 'U': 'Z', 'CHI4': 'O4', 'CHI5': 'O5', 'DH': 'O5'}
QQ = {'Z': 1, 'O4': 4, 'O5': 5}

def g_acb(gt, w):
    if gt == 'Z':
        return w.log() + (w - 1).log() - acb(2).log() - w * acb.pi().log() / 2 + (w / 2).lgamma()
    q = QQ[gt]
    return (w / 2) * (acb(q) / acb.pi()).log() + ((w + 1) / 2).lgamma()

def alpha_acb(gt, w):
    if gt == 'Z':
        return 1 / w + 1 / (w - 1) - acb.pi().log() / 2 + (w / 2).digamma() / 2
    q = QQ[gt]
    return (acb(q) / acb.pi()).log() / 2 + ((w + 1) / 2).digamma() / 2

_ROOT = {}
def rootnum(kind):
    if kind != 'CHI5': return 1.0
    if 'c' not in _ROOT:
        ctx.prec = PREC
        s = acb(0.7, 3.1)
        def L(s, conj):
            ch = [0, 1, 1j, -1j, -1]
            tot = acb(0)
            for a in range(1, 5):
                c = ch[a].conjugate() if conj else ch[a]
                tot += acb(c.real, c.imag) * s.zeta(arb(a) / 5)
            return tot * (-s * acb(5).log()).exp()
        lam1 = g_acb('O5', s).exp() * L(s, False)
        lam2 = g_acb('O5', 1 - s).exp() * L(1 - s, True)
        e = lam1 / lam2
        _ROOT['c'] = complex(float(e.real.mid()), float(e.imag.mid()))
    return _ROOT['c']

# ---------------------------------------------------------------- high precision pieces
def c128(v):
    return complex(float(v.real.mid()), float(v.imag.mid()))

KFIT = 12
_UNODES = [math.cos(math.pi * (2 * k + 1) / (2 * KFIT)) for k in range(KFIT)]

def fitpoly(fn, xc, Lc, reduce_phase=False):
    """polynomial (numpy coefficients, highest first, variable u = (x - xc)/(Lc/2) in [-1,1]) of the acb-valued fn(x)"""
    ctx.prec = PREC
    xs = [acb(u) for u in _UNODES]
    ys = [fn(arb(xc) + arb(u) * arb(Lc) / 2) for u in _UNODES]
    P = acb_poly.interpolate(xs, ys)
    co = [P[i] for i in range(KFIT)]
    if reduce_phase:
        c0 = co[0]
        k = (c0.imag / (2 * arb.pi())).floor()
        co[0] = acb(c0.real, c0.imag - k * 2 * arb.pi())
    return np.array([c128(c) for c in co][::-1])

def s_of(x, y):   # x arb, y float
    return acb(arb(1) + arb(y), -x) / 2

class Chunk:
    """x grid of one chunk: x_j = xc + j H, j = -M/2 .. M/2-1"""
    def __init__(self, xc, M, nmax_hint):
        self.xc = float(xc); self.M = M; self.Lc = M * H
        self.delta = xp.arange(-M // 2, M // 2) * H
        self.u = self.delta / (self.Lc / 2)
        self.x = self.xc + self.delta
        self.x0 = self.xc - (M // 2) * H; self.x1 = self.xc + (M // 2 - 1) * H
        self.cache = {}
        self.nuf = get_nufft(M)
        self.set_phases(nmax_hint)

    def set_phases(self, nmax):
        ctx.prec = PREC
        nmax = max(nmax, 1100)
        pr = primes_upto(nmax)
        half = arb(self.xc) / 2
        tp = arb.pi() * 2
        th = np.empty(len(pr))
        for i, p in enumerate(pr):
            v = half * arb(int(p)).log()
            v = v - (v / tp).floor() * tp
            th[i] = float(v.mid())
        self.nmax = nmax
        self.theta_np = np.mod(additive_table(nmax, pr, th), TWO_PI)
        self.theta = xp.asarray(self.theta_np)
        self.logn = xp.log(xp.maximum(xp.arange(nmax + 1), 1).astype(xp.float64))
        self.spread = {}

    def theta_of(self, q):
        """(xc/2) log q mod 2 pi for an integer q (256 bit)"""
        ctx.prec = PREC
        v = arb(self.xc) / 2 * arb(int(q)).log(); tp = arb.pi() * 2
        return float((v - (v / tp).floor() * tp).mid())

    def gam(self, gt, y):
        """fits of alpha(s), alpha(w), P1 = g(w) - g(s), P2 = (alpha(w)^2 - alpha(s)^2)/4 on the chunk, s = (1+y-ix)/2, w = 1-s"""
        key = ('gam', gt, y)
        if key not in self.cache:
            xc, Lc = self.xc, self.Lc
            As = fitpoly(lambda x: alpha_acb(gt, s_of(x, y)), xc, Lc)
            Aw = fitpoly(lambda x: alpha_acb(gt, 1 - s_of(x, y)), xc, Lc)
            P1 = fitpoly(lambda x: g_acb(gt, 1 - s_of(x, y)) - g_acb(gt, s_of(x, y)), xc, Lc, True)
            P2 = fitpoly(lambda x: (alpha_acb(gt, 1 - s_of(x, y))**2 - alpha_acb(gt, s_of(x, y))**2) / 4, xc, Lc)
            self.cache[key] = (As, Aw, P1, P2)
        return self.cache[key]

    def spreader(self, N):
        if N not in self.spread:
            if len(self.spread) > 3: self.spread.clear()
            self.spread[N] = self.nuf.plan(H * self.logn[1:N + 1] / 2)
        return self.spread[N]

# ---------------------------------------------------------------- NUFFT (type 1, 1D, "exponential of semicircle" kernel)
class Nufft:
    W = 12
    def __init__(self, M):
        self.M = M; self.Mf = 2 * M
        self.beta = 2.30 * self.W
        j = xp.arange(-M // 2, M // 2)
        zs, ws = np.polynomial.legendre.leggauss(48)
        phi = np.exp(self.beta * (np.sqrt(1 - zs**2) - 1))
        ph = xp.zeros(M)
        for z, w, f in zip(zs, ws, phi):
            ph += float(w * f) * xp.cos((math.pi * self.W * float(z) / self.Mf) * j)
        self.phihat = ph * self.W / 2
        self.jmod = xp.mod(j, self.Mf)

    def plan(self, upos):
        """upos: positions u (radians per grid step j), any real; returns (i0, ker) for spreading"""
        upos = xp.asarray(upos)
        p = xp.mod(upos, TWO_PI) * self.Mf / TWO_PI
        i0 = xp.ceil(p - self.W / 2).astype(xp.int64)
        ker = xp.empty((len(p), self.W))
        for k in range(self.W):
            z = (i0 + k - p) / (self.W / 2)
            ker[:, k] = xp.exp(self.beta * (xp.sqrt(xp.maximum(1 - z * z, 0.0)) - 1)) * (xp.abs(z) <= 1)
        return (i0, ker, int(i0.min()), int(i0.max()) + self.W)

    def run(self, plan, wts):
        """G[j] = sum_n wts[n] exp(i j u_n), j = -M/2 .. M/2-1"""
        i0, ker, lo, hi = plan
        span = hi - lo + 1
        wts = xp.asarray(wts).astype(xp.complex128)
        wr = xp.ascontiguousarray(wts.real); wi = xp.ascontiguousarray(wts.imag)
        base = i0 - lo
        gre = xp.zeros(span); gim = xp.zeros(span)
        for k in range(self.W):
            kk = ker[:, k]
            gre += xp.bincount(base + k, weights=wr * kk, minlength=span)
            gim += xp.bincount(base + k, weights=wi * kk, minlength=span)
        gr = gre + 1j * gim
        grid = xp.zeros(self.Mf, dtype=xp.complex128)
        if span <= self.Mf:
            grid[xp.mod(xp.arange(lo, hi + 1), self.Mf)] = gr
        else:
            for a in range(0, span, self.Mf):
                seg = gr[a:a + self.Mf]
                grid[xp.mod(xp.arange(lo + a, lo + a + len(seg)), self.Mf)] += seg
        out = xp.fft.ifft(grid) * self.Mf
        return out[self.jmod] / self.phihat

_NUF = {}
def get_nufft(M):
    if M not in _NUF: _NUF[M] = Nufft(M)
    return _NUF[M]

# ---------------------------------------------------------------- ladders
def nterms(q, x, t):
    return int(math.floor(math.sqrt(q * x / (4 * math.pi) + t / 16)))

def taylor_order(epsmax, logN):
    v = epsmax * logN
    return 0 if v < 1e-9 else (1 if v < 1.5e-3 else 2)

def base_row(ch, kind, t, y, want_parts=False, a_tab=None):
    """rows on the chunk of the two-ladder approximant f = D + eps exp(LR) R for a degree-one kind at time t, level y.
    returns dict(f, D, A, eps_s, sig, cs)   (eps_s, sig, cs describe the exponent s* for Euler references)"""
    gt = GT[kind]; q = QQ[gt]
    As, Aw, P1, P2 = ch.gam(gt, y)
    u = ch.u
    a_s0 = complex(As[-1]); a_w0 = complex(Aw[-1])
    eps_s = (t / 2) * (pval(As, u) - a_s0) if t != 0 else None
    eps_w = (t / 2) * (pval(Aw, u) - a_w0) if t != 0 else None
    sig_s = (1 + y) / 2 + (t / 2) * a_s0.real; c_s = (t / 2) * a_s0.imag
    sig_w = (1 - y) / 2 + (t / 2) * a_w0.real; c_w = (t / 2) * a_w0.imag
    Nlo = nterms(q, ch.x0, t); Nhi = nterms(q, ch.x1, t)
    assert Nhi <= ch.nmax, (Nhi, ch.nmax)
    key = ('coef', kind, Nhi)
    if key not in ch.cache:
        ch.cache[key] = xp.asarray(coefs(kind, Nhi))
    a = ch.cache[key]
    L = ch.logn[1:Nhi + 1]; th = ch.theta[1:Nhi + 1]; an = a[1:Nhi + 1]
    amp = (t / 4) * L * L
    wD = an * xp.exp(amp - sig_s * L + 1j * (th - c_s * L))
    wR = an * xp.exp(amp - sig_w * L + 1j * (th + c_w * L))
    order = 0
    if t != 0:
        order = taylor_order(max(float(abs(eps_s).max()), float(abs(eps_w).max())), float(L[-1]))
    pl = ch.spreader(Nlo)
    def lad(wts, eps):
        G = ch.nuf.run(pl, wts[:Nlo])
        if order >= 1:
            G = G - eps * ch.nuf.run(pl, wts[:Nlo] * L[:Nlo])
        if order >= 2:
            G = G + (eps * eps / 2) * ch.nuf.run(pl, wts[:Nlo] * L[:Nlo]**2)
        for n in range(Nlo + 1, Nhi + 1):       # new terms from their window edge on
            xn = 4 * math.pi * (n * n - t / 16) / q
            j0 = int(math.ceil((xn - ch.x0) / H - 1e-9))
            if j0 >= ch.M: continue
            j0 = max(j0, 0)
            Ln = float(L[n - 1])
            term = wts[n - 1] * xp.exp(1j * ch.delta[j0:] * Ln / 2)
            if order >= 1: term = term * xp.exp(-eps[j0:] * Ln)
            G[j0:] += term
        return G
    D = lad(wD, eps_s)
    R = xp.conj(lad(wR, None if eps_w is None else xp.conj(eps_w)))
    LR = pval(P1, u) + t * pval(P2, u)
    A = rootnum(kind) * xp.exp(LR) * R
    return dict(f=D + A, D=D, A=A, eps_s=eps_s, sig=sig_s, cs=c_s)

PSETS = [2, 13, 97, 1000]
_PR1000 = primes_upto(1000)

def euler_rows(ch, row, ap, t, cuts=PSETS):
    """E_P(x) = prod_{p<=P} (1 - a_p b_p p^{-s*(x)}) on the chunk for P in cuts (cumulative), exponent data from `row`.
    p <= 13 directly; larger blocks through the logarithm series by NUFFT when max |a_p b_p p^-sigma| < 0.6, else directly."""
    eps = row['eps_s']; sig = row['sig']; cs = row['cs']
    ps = _PR1000; Lp = np.log(ps.astype(float))
    key = ('thp',)
    if key not in ch.cache:
        ch.cache[key] = ch.theta_np[ps]
    thp = ch.cache[key]
    w = ap * np.exp((t / 4) * Lp**2 - sig * Lp + 1j * (thp - cs * Lp))
    out = {}
    E = xp.ones(ch.M, dtype=xp.complex128)
    def direct(i):
        v = complex(w[i]) * xp.exp(1j * ch.delta * float(Lp[i]) / 2)
        if eps is not None: v = v * xp.exp(-eps * float(Lp[i]))
        return 1 - v
    order = 0 if eps is None else taylor_order(float(abs(eps).max()), 60.0)
    prev = 0
    for P in cuts:
        idx = [i for i in range(len(ps)) if prev < ps[i] <= P and w[i] != 0]
        if P <= 13 or (len(idx) and np.abs(w[idx]).max() >= 0.6):
            for i in idx: E = E * direct(i)
        elif len(idx):
            fr = []; wt = []
            for i in idx:
                aw = abs(w[i]); k = 1
                while True:
                    fr.append(k * Lp[i] / 2); wt.append(-w[i]**k / k)
                    k += 1
                    if aw**k / k < 1e-11: break
            fr = np.array(fr); wt = np.array(wt)
            pl = ch.nuf.plan(H * fr)
            G = ch.nuf.run(pl, wt)
            if order >= 1: G = G - eps * ch.nuf.run(pl, wt * 2 * fr)
            if order >= 2: G = G + (eps * eps / 2) * ch.nuf.run(pl, wt * (2 * fr)**2)
            E = E * xp.exp(G)
        out[P] = E
        prev = P
    return out

# ---------------------------------------------------------------- function sets
TNR_C = 2.2
EA_A = 0.1

def mt_ratio_fit(ch, t, y1, y2):
    """fit of log M_t(s_{y1}) - log M_t(s_{y2}) (zeta gamma type) on the chunk"""
    def fn(x):
        s1 = s_of(x, y1); s2 = s_of(x, y2)
        return g_acb('Z', s1) - g_acb('Z', s2) + (arb(t) / 4) * (alpha_acb('Z', s1)**2 - alpha_acb('Z', s2)**2)
    return fitpoly(fn, ch.xc, ch.Lc, True)

def make_row(ch, kind, t, y, with_refs=True, cuts=PSETS):
    """returns dict: f, refs {name: Qinv}, optionally D, A.  Statistic of a reference: |f Qinv - 1|."""
    refs = {}
    if kind in GT:
        r = base_row(ch, kind, t, y)
        out = dict(f=r['f'], D=r['D'], A=r['A'])
        if with_refs:
            ps = _PR1000
            if kind == 'DH':
                Ea = euler_rows(ch, r, coef_at_primes('DH', ps), t, cuts)
                E1 = euler_rows(ch, r, coef_at_primes('CHI5', ps), t, cuts)
                E2 = euler_rows(ch, r, coef_at_primes('CHI5B', ps), t, cuts)
                c1 = (1 - 1j * KAPPA) / 2; c2 = (1 + 1j * KAPPA) / 2
                for P in cuts:
                    refs['aP%d' % P] = Ea[P]
                    refs['cP%d' % P] = 1.0 / (c1 / E1[P] + c2 / E2[P])
            else:
                E = euler_rows(ch, r, coef_at_primes(kind, ps), t, cuts)
                for P in cuts: refs['P%d' % P] = E[P]
        out['refs'] = refs
        return out
    if kind == 'EA':
        assert t == 0
        r1 = base_row(ch, 'ZETA', 0.0, y + 2 * EA_A); r2 = base_row(ch, 'ZETA', 0.0, y - 2 * EA_A)
        out = dict(f=r1['f'] * r2['f'])
        if with_refs:
            ps = _PR1000; ap = np.ones(len(ps))
            E1 = euler_rows(ch, r1, ap, 0.0, cuts); E2 = euler_rows(ch, r2, ap, 0.0, cuts)
            for P in cuts: refs['P%d' % P] = E1[P] * E2[P]
        out['refs'] = refs
        return out
    if kind.startswith('TNR'):
        q = int(kind[3:]); lam = math.log(q); sh = lam * t
        ys = [y + sh, y, y - sh]
        rows = [base_row(ch, 'ZETA', t, yy) for yy in (ys if t != 0 else [y])]
        if t == 0: rows = [rows[0]] * 3
        thq = ch.theta_of(q)
        ph = xp.exp(1j * (thq + ch.delta * lam / 2))        # exp(i lam x / 2)
        if t != 0:
            r1 = xp.exp(pval(mt_ratio_fit(ch, t, ys[1], ys[0]), ch.u))
            r2 = xp.exp(pval(mt_ratio_fit(ch, t, ys[2], ys[0]), ch.u))
        else:
            r1 = r2 = 1.0
        rho1 = TNR_C * math.exp(-lam * lam * t / 4 - lam * y / 2) * ph * r1
        rho2 = math.exp(-lam * y) * ph * ph * r2
        f = rows[0]['f'] + rho1 * rows[1]['f'] + rho2 * rows[2]['f']
        out = dict(f=f)
        if with_refs:
            ps = _PR1000; ap = np.ones(len(ps))
            Es = [euler_rows(ch, r, ap, t, cuts) for r in (rows if t != 0 else rows[:1])]
            if t == 0: Es = Es * 3
            for P in cuts:
                refs['zP%d' % P] = Es[0][P]
                refs['oP%d' % P] = 1.0 / (1.0 / Es[0][P] + rho1 / Es[1][P] + rho2 / Es[2][P])
        out['refs'] = refs
        return out
    raise ValueError(kind)

def chunk_plan(X, Ltot):
    """chunk length (x units, power of two) and number of chunks for a strip [X, X + Ltot]"""
    Lc = min(131072, 2 ** int(math.floor(math.log2(0.02 * X))))
    Lc = min(Lc, Ltot)
    return Lc, int(Ltot // Lc)

def nmax_for(kinds, xmax, tmax=0.5):
    qmax = max(QQ[GT[k]] if k in GT else 1 for k in kinds)
    return int(math.sqrt(qmax * xmax / (4 * math.pi) + tmax / 16)) + 2
