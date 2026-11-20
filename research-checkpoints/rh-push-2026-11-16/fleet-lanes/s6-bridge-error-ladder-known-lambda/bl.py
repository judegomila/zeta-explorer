"""Shared library, lane s6-bridge-error-ladder-known-lambda: wrappers of kb.c, the source surrogate E(N), control zero sets,
the forward heat flow with a frozen external set (extends hl.Flow of lane s5-heat-landing-collision-scaling)."""
import ctypes, os, math, json, numpy as np, hl
from hl import log, jdump
HERE = os.path.dirname(os.path.abspath(__file__))
_b = ctypes.CDLL(os.path.join(HERE, 'kb.so'))
_dp = np.ctypeslib.ndpointer(np.float64, flags='C_CONTIGUOUS'); _L = ctypes.c_long
_b.forces_ext.argtypes = [_L, _dp, _dp, _L, _dp, _dp, _dp, _dp, ctypes.c_int]
_b.rot_sum.argtypes = [_L, _dp, _dp, _L, _dp, _L, _dp, _dp]
_b.prime_sum_cs.argtypes = [_L, _dp, _L, _dp, _L, _dp, _dp, _dp]
_b.phase_big.argtypes = [_L, _dp, ctypes.c_double, _dp, _dp]
_b.have_quad.restype = ctypes.c_int
HAVE_QUAD = bool(_b.have_quad())
TWO_PI = 2 * math.pi
ca = lambda a: np.ascontiguousarray(a, dtype=np.float64)

def rot_sum(phi0, dl, coef, M):
    coef = ca(np.atleast_2d(coef)); K = coef.shape[0]; outs = np.zeros((K, M)); outc = np.zeros((K, M))
    _b.rot_sum(len(phi0), ca(phi0), ca(dl), K, coef, M, outs, outc); return outs, outc

def prime_sum_cs(logn, coef, x):
    coef = ca(np.atleast_2d(coef)); K = coef.shape[0]; x = ca(x); oc = np.zeros((K, len(x))); os_ = np.zeros((K, len(x)))
    _b.prime_sum_cs(len(logn), ca(logn), K, coef, len(x), x, oc, os_); return oc, os_

def phase_big(v, T):
    v = ca(v); phi = np.empty(len(v)); lg = np.empty(len(v)); _b.phase_big(len(v), v, float(T), phi, lg); return phi, lg

# ---------------------------------------------------------------- source surrogate E(N) (imp-33620, imp-eflow-constant-discharge)
CC = math.sqrt(3 * math.pi) / 8          # 0.38375
E_TRUNC = 3.06e-5
def T_of_N(N):
    """Riemann-von Mangoldt inverse: N = T/2pi (log(T/2pi) - 1) + 7/8"""
    T = max(20.0, TWO_PI * N / max(math.log(max(N, 3)), 1))
    for _ in range(60):
        f = T / TWO_PI * (math.log(T / TWO_PI) - 1) + 0.875 - N; T -= f / (math.log(T / TWO_PI) / TWO_PI)
    return T
def surrogate(N, T0=None):
    T0 = T0 or T_of_N(N); L = math.log(T0); CF = (math.log(T0 / TWO_PI) + 1) / TWO_PI
    Ef = CF * L / T0 * math.exp(2.37e-4); Ec = CC * math.sqrt(L / N)
    return dict(T0=T0, E_flow=Ef, E_coll=Ec, E_trunc=E_TRUNC, E=Ef + Ec + E_TRUNC, sigma=Ec / (Ef + Ec + E_TRUNC))
def least_CC(D, N, T0=None):
    """least C_C with D <= E_trunc + E_flow + C_C sqrt(log T0 / N)"""
    s = surrogate(N, T0); return max(0.0, D - s['E_trunc'] - s['E_flow']) / math.sqrt(math.log(s['T0']) / N)

# ---------------------------------------------------------------- zero sets of the controls (gamma > 0)
def zeta_list(H, B):
    fn = os.environ.get('RH_ZETA')
    if fn and os.path.exists(fn):
        g = np.load(fn, mmap_mode='r'); return np.array(g[:np.searchsorted(g, H)])
    g = np.array(json.load(open(B + 'zeros_ZETA_2H.json'))['gamma'], dtype=float); assert H <= 4000, 'local zeta table ends at 4000'; return g[g < H]

def control(obj, Hg):
    """returns on (ordinates of on-line zeros), og, ox (ordinate and |beta - 1/2| of each off-line pair), tail = (degree, kappa)"""
    B = os.environ.get('RH_BATTERY', '../c12-control-battery-harness/tables/')
    if obj == 'DH':
        fn = os.environ.get('RH_DH')
        if fn and os.path.exists(fn):
            d = np.load(fn); on = d['on']; ox = d['offx']; og = d['offg']
        else:
            d = json.load(open(B + 'zeros_DH.json')); on = np.array(sorted(float(v) for v in d['online']))
            off = np.array([[float(a) - 0.5, float(b)] for a, b, *_ in d['offline']]); ox = off[:, 0]; og = off[:, 1]
        on = np.sort(on[on < Hg]); k = og < Hg; ox = np.abs(ox[k]); og = og[k]; tail = (1, math.log(5 / (4 * math.pi)))
    elif obj.startswith('HEAT'):
        d = json.load(open(B + 'zeros_%s.json' % obj)); on = np.array(sorted(float(v) for v in d['online']))
        off = np.array([[float(a), float(b)] for a, b, *_ in d['offline']]); ox = off[:, 0]; og = off[:, 1]
        on = on[on < Hg]; k = og < Hg; ox = ox[k]; og = og[k]; tail = (1, math.log(1 / (4 * math.pi)))
    elif obj.startswith('EA-'):
        a = float(obj[3:]); og = zeta_list(Hg, B); ox = np.full(len(og), a); on = np.zeros(0); tail = (2, math.log(1 / (4 * math.pi)))
    elif obj.startswith('TNR-'):
        _, q, c = obj.split('-'); q = float(q); c = float(c)
        on = zeta_list(Hg, B); b = math.acosh(c / 2) / math.log(q)
        og = (2 * np.arange(0, int(Hg * math.log(q) / TWO_PI) + 2) + 1) * math.pi / math.log(q); og = og[og < Hg]
        ox = np.full(len(og), b); tail = (1, math.log(q * q / (4 * math.pi)))
    elif obj == 'ZETA':
        on = zeta_list(Hg, B); og = np.zeros(0); ox = np.zeros(0); tail = (1, math.log(1 / (4 * math.pi)))
    else: raise SystemExit('unknown object ' + obj)
    o = np.argsort(og); return np.asarray(on, float), og[o], ox[o], tail

def first_N(on, og, ox, N):
    """the N zeros of smallest positive ordinate (an off-line pair counts as two zeros and is kept whole); returns the cut height too"""
    h = np.concatenate([on, og]); w = np.concatenate([np.ones(len(on)), 2 * np.ones(len(og))]); o = np.argsort(h, kind='stable')
    cw = np.cumsum(w[o]); k = int(np.searchsorted(cw, N - 0.5)) + 1          # number of items
    if k > len(o): raise ValueError('list has only %d zeros' % cw[-1])
    hc = 0.5 * (h[o][k - 1] + h[o][k]) if k < len(o) else h[o][k - 1] * 1.0000001
    return on[on < hc], og[og < hc], ox[og < hc], hc, int(cw[k - 1])

class FlowX(hl.Flow):
    """hl.Flow plus a frozen external set ext = (ex, ey) (z units), added to the velocity of every moving zero."""
    ext = None
    def rhs(self, s):
        if self.ext is None: return hl.Flow.rhs(self, s)
        self.nev += 1
        x, y = self.positions(s); x = ca(x); y = ca(y)
        vx = np.empty_like(x); vy = np.empty_like(y)
        hl._k.forces_complex(self.ns, self.np, x, y, vx, vy, int(self.mirror))
        _b.forces_ext(len(x), x, y, len(self.ext[0]), self.ext[0], self.ext[1], vx, vy, int(self.mirror))
        tx, ty = self.tailv(x, y)
        vx = 2 * vx + tx; vy = 2 * vy + ty
        r, c, u = self.split(s); d = np.empty_like(s)
        d[:self.ns] = vx[:self.ns]
        v1x = vx[self.ns::2]; v2x = vx[self.ns + 1::2]; v1y = vy[self.ns::2]; v2y = vy[self.ns + 1::2]
        d[self.ns:self.ns + self.np] = 0.5 * (v1x + v2x)
        q = np.sqrt(np.abs(u))
        d[self.ns + self.np:] = 8 + 2 * np.where(u > 0, q * (v1x - v2x), -q * (v1y - v2y))
        return d

def primes_upto(n):
    """odd-only segmented sieve; memory about n/16 bytes of flags per segment of 2^24"""
    n = int(n); r = int(n ** 0.5) + 1
    sv = np.ones(r + 1, bool); sv[:2] = False
    for i in range(2, int(r ** 0.5) + 1):
        if sv[i]: sv[i * i::i] = False
    base = np.nonzero(sv)[0]; out = [base[base <= n]]
    lo = r + 1; SEG = 1 << 24
    while lo <= n:
        hi = min(lo + SEG - 1, n); seg = np.ones(hi - lo + 1, bool)
        for p in base:
            if p * p > hi: break
            st = max(p * p, (lo + p - 1) // p * p); seg[st - lo::p] = False
        out.append(np.nonzero(seg)[0] + lo); lo = hi + 1
    return np.concatenate(out)

def prime_powers(X):
    """n = p^k <= X with Lambda(n) = log p; returns n (float64), logp, k"""
    p = primes_upto(X).astype(np.float64); n = [p]; lp = [np.log(p)]; k = [np.ones(len(p))]
    j = 2
    while 2.0 ** j <= X:
        q = p[p <= X ** (1.0 / j) * (1 + 1e-12)]; q = q[q ** j <= X]
        if len(q) == 0: break
        n.append(q ** j); lp.append(np.log(q)); k.append(np.full(len(q), float(j))); j += 1
    return np.concatenate(n), np.concatenate(lp), np.concatenate(k)

def pp_chunks(Xtop, cuts, CH=1e8):
    """prime powers n = p^k <= Xtop in increasing blocks; yields (hi, n, k, p) with block edges at every cut-off"""
    edges = sorted(set([2.0] + [float(c) for c in cuts if c <= Xtop] + [float(v) for v in np.arange(CH, Xtop, CH)] + [float(Xtop)]))
    small = primes_upto(int(math.isqrt(int(Xtop)) + 1)); sf = small.astype(np.float64)
    for lo, hi in zip(edges[:-1], edges[1:]):
        lo_i = int(lo) + 1 if lo > 2 else 2; hi_i = int(hi)
        if hi_i < lo_i: yield hi, np.zeros(0), np.zeros(0), np.zeros(0); continue
        seg = np.ones(hi_i - lo_i + 1, bool)
        for p in small:
            if p * p > hi_i: break
            st = max(p * p, (lo_i + p - 1) // p * p); seg[st - lo_i::p] = False
        pr = (np.nonzero(seg)[0] + lo_i).astype(np.float64); n = [pr]; k = [np.ones(len(pr))]; pp = [pr]
        j = 2
        while 2.0 ** j <= hi:
            q = sf[((sf ** j > lo) if lo > 2 else np.ones(len(sf), bool)) & (sf ** j <= hi)]
            if len(q): n.append(q ** j); k.append(np.full(len(q), float(j))); pp.append(q)
            j += 1
        yield hi, np.concatenate(n), np.concatenate(k), np.concatenate(pp)
