"""s4 combination (1) and (4): batched prime-power sums (GPU float64 screen, numpy fallback).

Echo train   E_P(s) = sum_{n = p^m <= P} c(n) Lambda(n) n^{-s},   s = 1/2 + x + i t
Test value   D_P(x, t) = Re G(s) - Re E_P(s) (+ explicit pole term for zeta),  G = gamma drift of the completed function,
so that D_P -> Re xi'/xi(s) when the train converges.
x*(t, P) = smallest grid x such that D_P(x', t) > 0 for every grid x' >= x (0 if D > 0 on the whole grid).

Objects (coefficients c(p^m)):
  ZETA 1; CHI4 chi_-4(p)^m; SGN eps_p^m (eps_p = +-1 from SplitMix64 of p); LIOU (-1)^m; U e(m u_p) (u_p uniform, hash);
  EA (a = 1/4): Lambda(n)(n^a + n^-a) -> zeta columns at x -+ a;  TNR(q, c): zeta + explicit local train at powers of q.
Variants: 'sharp' (cutoff n <= P), 'fejer' (weight 1 - log n/log P), each with the explicit pole term where there is a pole.
Checkpoints P_k: every statistic is recorded at each P_k from the same accumulation.

usage: echo.py <out.json> <Pmax> <npts per height> <heights csv> [--raw=N] [--seed=1] [--mc=65536] [--bc=4096] [--L=1000]
"""
import sys, os, json, time, math
import numpy as np
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(os.environ.get('S4_POOL_GB', '20')) * 1024 ** 3)
    xp = cp; GPU = True
except Exception:
    xp = np; GPU = False

X = np.array([0.005, 0.01, 0.015, 0.02, 0.03, 0.04, 0.06, 0.08, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5])
A_E = 0.25
XZ = np.concatenate([X, X - A_E, X + A_E])          # zeta abscissa offsets (45)
SIG4 = 1.25                                          # second line of combination (4)


def primes_upto(N):
    """segmented sieve; returns int64 array"""
    N = int(N); r = int(math.isqrt(N)) + 1
    s = np.ones(r + 1, bool); s[:2] = False
    for i in range(2, int(math.isqrt(r)) + 1):
        if s[i]: s[i * i::i] = False
    base = np.nonzero(s)[0]
    out = [base[base <= N]]
    seg = 1 << 24; lo = r + 1
    while lo <= N:
        hi = min(lo + seg - 1, N)
        m = np.ones(hi - lo + 1, bool)
        for p in base:
            if p * p > hi: break
            st = max(p * p, (lo + p - 1) // p * p)
            m[st - lo::p] = False
        out.append(np.nonzero(m)[0] + lo); lo = hi + 1
    return np.concatenate(out).astype(np.int64)


def splitmix(p):
    z = p.astype(np.uint64) + np.uint64(0x9E3779B97F4A7C15)
    z = (z ^ (z >> np.uint64(30))) * np.uint64(0xBF58476D1CE4E5B9)
    z = (z ^ (z >> np.uint64(27))) * np.uint64(0x94D049BB133111EB)
    return z ^ (z >> np.uint64(31))


def terms(P):
    """prime powers n = p^m <= P sorted by n: dict of arrays logn, lam, m, eps, u, chi4"""
    pr = primes_upto(P)
    ps = [pr]; ms = [np.ones(len(pr), np.int64)]; ns = [pr.astype(np.float64)]
    m = 2
    while 2 ** m <= P:
        q = pr[pr <= int(round(P ** (1.0 / m))) + 1]
        q = q[np.array([int(v) ** m <= P for v in q], bool)] if len(q) < 100000 else q[q.astype(object) ** m <= P]
        if len(q) == 0: break
        ps.append(q); ms.append(np.full(len(q), m, np.int64)); ns.append(q.astype(np.float64) ** m); m += 1
    p = np.concatenate(ps); mm = np.concatenate(ms); n = np.concatenate(ns)
    o = np.argsort(n, kind='stable'); p = p[o]; mm = mm[o]; n = n[o]
    lam = np.log(p.astype(np.float64))
    h = splitmix(p)
    eps = np.where((h >> np.uint64(63)) == 1, -1.0, 1.0)
    u = (splitmix(h) >> np.uint64(11)).astype(np.float64) / 2.0 ** 53
    c4 = np.where(p % 4 == 1, 1.0, np.where(p % 4 == 3, -1.0, 0.0))
    return dict(n=n, logn=lam * mm, lam=lam, m=mm.astype(np.float64), eps=eps, u=u, chi4=c4, p=p)


def digamma_asym(z):
    """psi(z) for |z| large (|z| >= 20 used), complex numpy"""
    zi = 1 / z; z2 = zi * zi
    return np.log(z) - zi / 2 - z2 / 12 + z2 * z2 / 120 - z2 ** 3 / 252


def drift(kind, s):
    """Re of the gamma drift G(s): xi'/xi = G + zeta'/zeta etc."""
    if kind == 'ZETA':    # 1/s + 1/(s-1) - log(pi)/2 + psi(s/2)/2
        return (1 / s + 1 / (s - 1) - 0.5 * math.log(math.pi) + 0.5 * digamma_asym(s / 2)).real
    if kind == 'CHI4':    # log(4/pi)/2 + psi((s+1)/2)/2
        return (0.5 * math.log(4 / math.pi) + 0.5 * digamma_asym((s + 1) / 2)).real
    if kind == 'DH':
        return (0.5 * math.log(5 / math.pi) + 0.5 * digamma_asym((s + 1) / 2)).real
    raise KeyError(kind)


def build_cols(T, lo, hi, dev):
    """weight matrices for terms lo:hi. cos-columns Wc (M x Kc), sin-columns Ws (M x Ks)."""
    g = lambda k: dev.asarray(T[k][lo:hi])
    logn = g('logn'); lam = g('lam'); m = g('m')
    def blk(off):   # M x len(off): n^{-1/2 - off}
        return dev.exp(-(0.5 + dev.asarray(off))[None, :] * logn[:, None])
    bz = blk(XZ); bx = bz[:, :len(X)]
    par = dev.where((m % 2) == 1, 1.0, 0.0)
    cols = []
    def add(base, B):
        w = (lam * base)[:, None] * B
        cols.append(w); cols.append(w * logn[:, None])
    add(dev.ones_like(lam), bz)                                   # ZETA  (45 x 2)
    add(g('chi4') ** m, bx)                                       # CHI4
    add(dev.where(par == 1, g('eps'), 1.0), bx)                   # SGN
    add(dev.where(par == 1, -1.0, 1.0), bx)                       # LIOU
    ang = 2 * math.pi * m * g('u')
    add(dev.cos(ang), bx)                                         # U real part
    # combination (4): log zeta and log L(chi4) on Re s = SIG4: weight (1/m) n^-SIG4
    w4 = dev.exp(-SIG4 * logn) / m
    cols.append(w4[:, None]); cols.append((w4 * g('chi4') ** m)[:, None])
    Wc = dev.concatenate(cols, axis=1)
    scol = []
    w = (lam * dev.sin(ang))[:, None] * bx
    scol.append(w); scol.append(w * logn[:, None])               # U imaginary part
    scol.append(w4[:, None]); scol.append((w4 * g('chi4') ** m)[:, None])
    Ws = dev.concatenate(scol, axis=1)
    return Wc, Ws


def layout():
    nx = len(X); nz = len(XZ); o = {}; k = 0
    o['ZETA'] = (k, nz); k += 2 * nz
    for nm in ('CHI4', 'SGN', 'LIOU', 'Ure'):
        o[nm] = (k, nx); k += 2 * nx
    o['L4Z'] = (k, 1); k += 1; o['L4C'] = (k, 1); k += 1
    return o, k


def accumulate(t, T, cks, mc, dev):
    """returns list over checkpoints of (Sc, Ss) numpy arrays: Sc = cos(t logn) @ Wc, Ss = sin(t logn) @ Ws"""
    td = dev.asarray(t)
    n = T['n']; idx = [int(np.searchsorted(n, c, side='right')) for c in cks]
    accc = None; accs = None; out = []; lo = 0
    for ci, top in enumerate(idx):
        while lo < top:
            hi = min(lo + mc, top)
            Wc, Ws = build_cols(T, lo, hi, dev)
            ph = td[:, None] * dev.asarray(T['logn'][lo:hi])[None, :]
            C = dev.cos(ph); dev.sin(ph, out=ph)
            a = C @ Wc; b = ph @ Ws
            accc = a if accc is None else accc + a
            accs = b if accs is None else accs + b
            del C, ph, Wc, Ws
            lo = hi
        if accc is None:
            _, K = layout(); accc = dev.zeros((len(t), K)); accs = dev.zeros((len(t), 2 * len(X) + 2))
        out.append((cp.asnumpy(accc) if GPU else accc.copy(), cp.asnumpy(accs) if GPU else accs.copy()))
    return out


def tnr_local(q, c, s, P):
    """Re of the truncated local train: -log q * sum_{q^m <= P} (alpha^m + beta^m) q^{m(1/2 - s)}; alpha beta = 1, alpha + beta = -c"""
    al = (-c - math.sqrt(c * c - 4)) / 2; be = 1 / al
    tot = np.zeros(s.shape, complex); m = 1
    while q ** m <= P:
        tot += (al ** m + be ** m) * np.exp(m * (0.5 - s) * math.log(q)); m += 1
    return (-math.log(q) * tot).real


def tests(t, Sc, Ss, P):
    """dict name -> D array (len(t) x len(X)) at checkpoint P"""
    lay, _ = layout(); nx = len(X); nz = len(XZ); lP = math.log(P)
    s = (0.5 + X)[None, :] + 1j * t[:, None]
    def col(nm, logw):
        k, w = lay[nm]; return Sc[:, k + (w if logw else 0): k + (2 * w if logw else w)]
    out = {}
    Gz = drift('ZETA', s)
    zs = col('ZETA', 0); zl = col('ZETA', 1)
    # zeta: columns ordered [X, X - a, X + a]
    def pole(sig_off, fe):   # explicit pole term of sum_{n<=P} Lambda n^-s: + P^(1-s)/(1-s) (sharp); Fejer: P^(1-s)/((1-s)^2 log P)
        ss = (0.5 + sig_off)[None, :] + 1j * t[:, None]
        v = np.exp((1 - ss) * lP) / (1 - ss)
        return (v / ((1 - ss) * lP)).real if fe else v.real
    for var in ('sharp', 'fejer'):
        fe = var == 'fejer'
        tr = zs - zl / lP if fe else zs
        trc = tr - pole(XZ, fe)                       # pole-corrected train (all 45 offsets)
        out['ZETA:' + var] = Gz - tr[:, :nx]
        out['ZETA:' + var + '+pole'] = Gz - trc[:, :nx]
        # E_a: drift G(s+a) + G(s-a); train columns at x - a and x + a
        Ge = drift('ZETA', s + A_E) + drift('ZETA', s - A_E)
        out['EA:' + var + '+pole'] = Ge - trc[:, nx:2 * nx] - trc[:, 2 * nx:]
        for q in (3, 1000003):
            out['TNR%d:%s+pole' % (q, var)] = Gz + math.log(q) - trc[:, :nx] - (tnr_local(q, 2.2, s, P) if not fe else tnr_local_fejer(q, 2.2, s, P))
        c4 = col('CHI4', 0) - (col('CHI4', 1) / lP if fe else 0)
        out['CHI4:' + var] = drift('CHI4', s) - c4
        for nm in ('SGN', 'LIOU'):
            v = col(nm, 0) - (col(nm, 1) / lP if fe else 0)
            out[nm + ':' + var] = Gz - v
        # Liouville train = -(zeta train at s) + 2 (zeta train at 2s, cutoff sqrt P): explicit pole terms of both
        s2 = 1 - 2 * s; p2 = np.exp(s2 * lP / 2) / s2
        p2 = (p2 / (s2 * lP / 2)).real if fe else p2.real
        out['LIOU:' + var + '+pole'] = Gz - (v + pole(X, fe) - 2 * p2)
        u = col('Ure', 0) + Ss[:, :nx] - ((col('Ure', 1) + Ss[:, nx:2 * nx]) / lP if fe else 0)
        out['U:' + var] = Gz - u
    return out


def tnr_local_fejer(q, c, s, P):
    al = (-c - math.sqrt(c * c - 4)) / 2; be = 1 / al
    tot = np.zeros(s.shape, complex); m = 1; lP = math.log(P)
    while q ** m <= P:
        tot += (1 - m * math.log(q) / lP) * (al ** m + be ** m) * np.exp(m * (0.5 - s) * math.log(q)); m += 1
    return (-math.log(q) * tot).real


def xstar_index(D):
    """index i in 0..nx: x* = X[i] is the smallest grid x with D > 0 on all grid x' >= x; i = nx means D <= 0 at the top of the grid.
    returns i (0 = positive on the whole grid)."""
    neg = D <= 0
    nx = D.shape[1]
    last = np.where(neg.any(axis=1), nx - np.argmax(neg[:, ::-1], axis=1), 0)   # index after the highest negative
    return last


def main():
    a_ = [v for v in sys.argv[1:] if not v.startswith('--')]
    opt = dict(v[2:].split('=') for v in sys.argv[1:] if v.startswith('--'))
    out = a_[0]; Pmax = float(a_[1]); npts = int(a_[2]); heights = [float(v) for v in a_[3].split(',')]
    raw = int(opt.get('raw', 256)); seed = int(opt.get('seed', 1)); mc = int(opt.get('mc', 65536)); bc = int(opt.get('bc', 4096))
    L = float(opt.get('L', 1000.0))
    cks = [c for c in [1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10] if c <= Pmax * 1.0000001]
    t0 = time.time()
    T = terms(Pmax)
    print('GPU', GPU, 'terms', len(T['n']), 'sieve sec', round(time.time() - t0, 1), flush=True)
    _, K = layout()
    print('planned device arrays: 2 x %d x %d float64 = %.2f GB; weights %d x %d = %.2f GB' % (bc, mc, 2 * bc * mc * 8 / 2 ** 30, mc, K, mc * K * 8 / 2 ** 30), flush=True)
    rng = np.random.default_rng(seed)
    res = dict(X=X.tolist(), a_E=A_E, Pmax=Pmax, checkpoints=cks, npts=npts, L=L, gpu=GPU, heights={}, seed=seed)
    rawd = {}
    for H in heights:
        t = np.sort(H + L * rng.random(npts))
        hist = {}; mins = {}; rawH = {}
        for b0 in range(0, npts, bc):
            tb = t[b0:b0 + bc]
            acc = accumulate(tb, T, cks, mc, xp)
            for ci, P in enumerate(cks):
                Sc, Ss = acc[ci]
                D = tests(tb, Sc, Ss, P)
                for nm, d in D.items():
                    key = '%s|%g' % (nm, P)
                    xi = xstar_index(d)
                    h = np.bincount(xi, minlength=len(X) + 1)
                    hist[key] = hist.get(key, 0) + h
                    mn = d.min(axis=0)
                    mins[key] = np.minimum(mins[key], mn) if key in mins else mn
                    if b0 == 0 and raw:
                        rawH[key] = d[:raw].copy()
                if b0 == 0 and raw:
                    lay, _ = layout()
                    rawH['L4Z|%g' % P] = np.stack([Sc[:raw, lay['L4Z'][0]], Ss[:raw, 2 * len(X)]], axis=1)
                    rawH['L4C|%g' % P] = np.stack([Sc[:raw, lay['L4C'][0]], Ss[:raw, 2 * len(X) + 1]], axis=1)
            print('H %g batch %d/%d  %.1f s' % (H, b0 // bc + 1, (npts + bc - 1) // bc, time.time() - t0), flush=True)
        res['heights']['%g' % H] = dict(hist={k: v.tolist() for k, v in hist.items()}, minD={k: v.tolist() for k, v in mins.items()})
        if raw:
            rawd['t_%g' % H] = t[:raw]
            for k, v in rawH.items(): rawd['%g|%s' % (H, k)] = v
        json.dump(res, open(out, 'w'))
    if raw: np.savez_compressed(out.replace('.json', '_raw.npz'), **rawd)
    res['seconds'] = time.time() - t0
    json.dump(res, open(out, 'w'))
    print('DONE', round(time.time() - t0, 1), flush=True)


if __name__ == '__main__':
    main()
