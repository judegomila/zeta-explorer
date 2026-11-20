#!/usr/bin/env python3
"""Row definitions for the c22 dense census. See PREREG.md. numpy only (+ flint for the prime head)."""
import math, os, json
import numpy as np

LEX = 30.0
CUT = 32.0
TWO_PI = 2 * math.pi
HERE = os.path.dirname(os.path.abspath(__file__))

def smix(k, seed, xp=np):
    """uniform [0,1) doubles from a splitmix64 hash of (k, seed); k integer array"""
    z = k.astype(xp.uint64) + xp.uint64((0x9E3779B97F4A7C15 * (seed + 1)) & 0xFFFFFFFFFFFFFFFF)
    z = (z ^ (z >> xp.uint64(30))) * xp.uint64(0xBF58476D1CE4E5B9)
    z = (z ^ (z >> xp.uint64(27))) * xp.uint64(0x94D049BB133111EB)
    z = z ^ (z >> xp.uint64(31))
    return (z >> xp.uint64(11)).astype(xp.float64) * (1.0 / 9007199254740992.0)

def fx(kind, x, xp=np):
    if kind == 'D1': return x
    if kind == 'D2': return xp.sqrt(x)
    if kind == 'D4': return xp.sqrt(xp.sqrt(x))
    if kind == 'DE': return xp.log(x + 1.0) ** 2
    raise ValueError(kind)

def finv(kind, L):
    if kind == 'D1': return L
    if kind == 'D2': return L * L
    if kind == 'D4': return L ** 4
    if kind == 'DE': return math.exp(math.sqrt(L)) - 1.0

_SIEVE = None
def _primes_to(n=10_000_000):
    global _SIEVE
    if _SIEVE is None:
        s = np.ones(n + 1, dtype=bool); s[:2] = False
        for i in range(2, int(n ** .5) + 1):
            if s[i]: s[i * i::i] = False
        _SIEVE = np.nonzero(s)[0]
    return _SIEVE

def nearest_primes(vals):
    """nearest prime to each real value (float array, < 2e13)"""
    from flint import fmpz
    P = _primes_to()
    out = np.zeros(len(vals), dtype=np.int64)
    small = vals < 9.9e6
    v = vals[small]
    i = np.searchsorted(P, v)
    i = np.clip(i, 1, len(P) - 1)
    lo = P[i - 1]; hi = P[i]
    out[small] = np.where(v - lo <= hi - v, lo, hi)
    for idx in np.nonzero(~small)[0]:
        x = float(vals[idx]); n = int(math.floor(x))
        a = n
        while not fmpz(a).is_prime(): a -= 1
        b = n + 1
        while not fmpz(b).is_prime(): b += 1
        out[idx] = a if (x - a) <= (b - x) else b
    return out

class Row:
    """lam ascending. head: explicit arrays (lam, theta, prime or 0). tail: formula in k (dense rows)."""
    def __init__(self, name, kind, phase='+', pseed=0, rseed=None, Lmax=None, **kw):
        self.name, self.kind, self.phase, self.pseed, self.rseed, self.Lmax = name, kind, phase, pseed, rseed, Lmax
        self.kw = kw
        self.tail0 = self.tail1 = 0
        self._build()

    # ---- phases by original index k
    def theta_of(self, k, xp=np):
        if self.phase == '+': return xp.zeros(k.shape, dtype=xp.float64)
        if self.phase == 'alt': return (k % 2).astype(xp.float64) * math.pi
        if self.phase == 'pi': return xp.full(k.shape, math.pi, dtype=xp.float64)
        if self.phase == 'rand': return TWO_PI * smix(k, 1000 + self.pseed, xp)
        raise ValueError

    def xk(self, k, xp=np):
        x = k.astype(xp.float64)
        if self.rseed is not None: x = x + smix(k, self.rseed, xp)
        return x

    def _build(self):
        kind = self.kind
        if kind in ('D1', 'D2', 'D4', 'DE'):
            cache = os.path.join(HERE, 'cache', 'head_%s_%s.npz' % (kind, self.rseed))
            if os.path.exists(cache):
                z = np.load(cache); hk, hp, kt = z['k'], z['p'], int(z['kt'])
            else:
                kmax = int(finv(kind, LEX)) + 3
                k = np.arange(1, kmax + 1, dtype=np.int64)
                f = fx(kind, self.xk(k))
                assert np.all(np.diff(f) > 0)
                kt = int(k[f > LEX][0])           # first tail index
                k = k[:kt - 1]; f = f[:kt - 1]
                p = nearest_primes(np.exp(f))
                p, first = np.unique(p, return_index=True)
                hk, hp = k[first], p
                os.makedirs(os.path.dirname(cache), exist_ok=True)
                np.savez(cache, k=hk, p=hp, kt=kt)
            self.head_k, self.head_p = hk, hp
            self.head_lam = np.log(hp.astype(np.float64))
            self.head_th = self.theta_of(hk)
            self.tail0 = kt
            # last tail index with f <= Lmax
            k1 = int(finv(kind, self.Lmax)) + 2
            while k1 >= kt and float(fx(kind, self.xk(np.array([k1], dtype=np.int64)))[0]) > self.Lmax: k1 -= 1
            self.tail1 = max(k1 + 1, kt)          # exclusive
        elif kind in ('CYC', 'CYCP', 'CYCeps'):
            l0 = math.log(3.0); ks = np.arange(0, 64, dtype=np.int64)
            lam = (2.0 ** ks) * l0
            p = np.zeros(len(ks), dtype=object)
            if kind == 'CYCP':
                pj = json.load(open(os.path.join(HERE, 'cycp_primes.json')))
                for i, q in enumerate(pj):
                    p[i] = int(q); lam[i] = math.log(int(q))
            if kind == 'CYCeps':
                lam = lam * (1.0 + self.kw['eps'] * (2 * smix(ks, 1) - 1))
            m = lam <= self.Lmax
            self.head_k, self.head_lam, self.head_p = ks[m], lam[m], p[m]
            self.head_th = np.full(m.sum(), math.pi)
        elif kind == 'ETA':
            ks = np.arange(1, int(self.Lmax) + 1, dtype=np.int64)
            self.head_k, self.head_lam, self.head_p = ks, ks.astype(np.float64), np.zeros(len(ks), dtype=np.int64)
            self.head_th = np.zeros(len(ks))
        elif kind == 'HQ1':
            self.head_k = np.array([0]); self.head_lam = np.array([math.log(3.0)]); self.head_p = np.array([3])
            self.head_th = np.zeros(1)
        elif kind == 'INJ':
            J = self.kw['J']
            base = Row('b', 'D1', '+', rseed=1, Lmax=self.Lmax)
            k = np.arange(base.tail0, base.tail1, dtype=np.int64)
            lam = np.concatenate([base.head_lam, fx('D1', base.xk(k))])
            kk = np.concatenate([base.head_k, k])
            pr = _primes_to(1000)[:J]
            E = np.concatenate([math.log(int(p)) * np.arange(1, int(self.Lmax / math.log(int(p))) + 2, dtype=np.float64) for p in pr])
            E = np.unique(E)
            i = np.clip(np.searchsorted(E, lam), 1, len(E) - 1)
            near = np.where(lam - E[i - 1] <= E[i] - lam, E[i - 1], E[i])
            near, first = np.unique(near, return_index=True)
            m = near <= self.Lmax
            self.head_lam = near[m]; self.head_k = kk[first][m]; self.head_p = np.zeros(m.sum(), dtype=np.int64)
            self.head_th = self.theta_of(self.head_k)
        else:
            raise ValueError(kind)
        self.nh = len(self.head_lam)
        self.count = self.nh + (self.tail1 - self.tail0)

    def chunk(self, a, b, xp=np):
        """(lam, theta) for positions a..b-1 of the concatenated sequence, as xp arrays"""
        parts_l, parts_t = [], []
        if a < self.nh:
            e = min(b, self.nh)
            parts_l.append(xp.asarray(self.head_lam[a:e])); parts_t.append(xp.asarray(self.head_th[a:e]))
        if b > self.nh and self.tail1 > self.tail0:
            k = xp.arange(self.tail0 + max(a - self.nh, 0), self.tail0 + (b - self.nh), dtype=xp.int64)
            parts_l.append(fx(self.kind, self.xk(k, xp), xp)); parts_t.append(self.theta_of(k, xp))
        if len(parts_l) == 1: return parts_l[0], parts_t[0]
        return xp.concatenate(parts_l), xp.concatenate(parts_t)

def rows_stat1():
    """(row args, j list, n heights)"""
    R = []
    J1 = list(range(4, 19)); L1 = CUT * 2 ** 18
    for ph, ps in (('+', 0), ('alt', 0), ('rand', 1), ('rand', 2), ('rand', 3)):
        R.append((dict(name='D1_%s%s' % (ph, ps or ''), kind='D1', phase=ph, pseed=ps, Lmax=L1), J1, 2000))
    for rs in (1, 2, 3):
        for ph, ps in (('+', 0), ('rand', 1)):
            R.append((dict(name='D1R%d_%s%s' % (rs, ph, ps or ''), kind='D1', phase=ph, pseed=ps, rseed=rs, Lmax=L1), J1, 2000))
    R.append((dict(name='CYC', kind='CYC', phase='pi', Lmax=L1), J1, 2000))
    R.append((dict(name='CYCP', kind='CYCP', phase='pi', Lmax=L1), J1, 2000))
    for e in (1e-10, 1e-9, 1e-8, 1e-7, 1e-6, 1e-4, 1e-2):
        R.append((dict(name='CYCeps_%g' % e, kind='CYCeps', phase='pi', Lmax=L1, eps=e), J1, 2000))
    R.append((dict(name='ETA', kind='ETA', phase='+', Lmax=L1), J1, 2000))
    R.append((dict(name='HQ1', kind='HQ1', phase='+', Lmax=L1), J1, 2000))
    for J in (1, 2, 4, 16, 64):
        for ph, ps in (('+', 0), ('alt', 0), ('rand', 1)):
            R.append((dict(name='INJ%d_%s%s' % (J, ph, ps or ''), kind='INJ', phase=ph, pseed=ps, Lmax=L1, J=J), J1, 2000))
    J2 = list(range(0, 11)); L2 = CUT * 2 ** 10
    for ph, ps in (('+', 0), ('alt', 0), ('rand', 1), ('rand', 2), ('rand', 3)):
        R.append((dict(name='D2_%s%s' % (ph, ps or ''), kind='D2', phase=ph, pseed=ps, Lmax=L2), J2, 400))
    for ph, ps in (('+', 0), ('rand', 1)):
        R.append((dict(name='D2R1_%s%s' % (ph, ps or ''), kind='D2', phase=ph, pseed=ps, rseed=1, Lmax=L2), J2, 400))
    for kind, JJ in (('D4', [-1, 0, 1, 2]), ('DE', [0, 1, 2, 3])):
        for rs in (None, 1):
            for ph, ps in (('+', 0), ('rand', 1)):
                R.append((dict(name='%s%s_%s%s' % (kind, 'R1' if rs else '', ph, ps or ''), kind=kind, phase=ph, pseed=ps, rseed=rs,
                               Lmax=CUT * 2 ** JJ[-1]), JJ, 200))
    return R

def heights(row, n, dmin):
    """n doubles: 20% pole points, 60% generic, 20% resonance-constructed; returns (t, cls)"""
    npole = n // 5; nres = n // 5; ngen = n - npole - nres
    nav = min(row.count, 201)
    lam, th = row.chunk(0, nav)
    idx = list(range(min(10, nav)))
    rest = list(range(10, nav))
    if rest:
        step = max(1, len(rest) // 10)
        idx += rest[step - 1::step][:10]
    mm = max(1, npole // len(idx))
    tp = np.array([(TWO_PI * m + th[i]) / lam[i] for i in idx for m in range(1, mm + 1)])[:npole]
    rng = np.random.default_rng(20261120)
    tg = rng.uniform(0.5, 100.0, n - len(tp) - nres)
    na = max(1, nres // 10); anchors = list(range(min(na, nav)))
    per = int(math.ceil(nres / len(anchors)))
    kk = min(nav, 60); tr = []
    for a in anchors:
        mmax = min(20000, max(per + 1, int(200.0 * lam[a] / TWO_PI)))
        m = np.arange(1, mmax + 1)
        t = (TWO_PI * m + th[a]) / lam[a]
        ph = t[:, None] * lam[None, :kk] - th[None, :kk]
        d = np.abs(ph - TWO_PI * np.round(ph / TWO_PI))
        d[:, a] = 1.0
        sc = -np.log(np.maximum(d, 1e-12)).sum(axis=1)
        tr += list(t[np.argsort(-sc)[:per]])
    tr = np.array(tr[:nres])
    tx = np.zeros(0)
    if row.kind in ('CYC', 'CYCP', 'CYCeps'):      # poles of the telescoped function 1/(1 - w)
        tx = TWO_PI * np.arange(1, 41) / math.log(3.0); tg = tg[:-40]
    t = np.concatenate([tp, tg, tr, tx])
    cls = np.array([0] * len(tp) + [1] * len(tg) + [2] * len(tr) + [3] * len(tx))
    return t, cls
