"""c14: dictionary DJ (PREREG section 5): parameter tables and float64 sign evaluation (section 6).
Table columns: m (int8), x (int32; JA: 2 ci + alt, JC1: 0 for s = +1 and 1 for s = -1), a, b, c (float64):
JA (u0, h, g); JB1 (h, g, t); JB2 (h, phi, t); JC1, JC2 (u, h, lam)."""
import math
import numpy as np
import funcs
from funcs import COLSETS, LOGN, det_sign, _decide, _rho

WIN = 2.6
KINDS = ['JA', 'JB1', 'JB2', 'JC1', 'JC2']
FAMS = ['%s-%s' % (k, p) for k in KINDS for p in ('with', 'without')]
HJC = [0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1.0, 1.5]
LAMJ = [-1, 0, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2, 4]
M2 = [2, 3, 4, 6, 8, 12]


def fam_info(fam):
    k, p = fam.split('-')[:2]
    return k, p == 'with'


def nfun(tab):
    return len(tab['m'])


def take(tab, sl):
    return {k: v[sl] for k, v in tab.items()}


def cat(tabs):
    return {k: np.concatenate([t[k] for t in tabs]) for k in ('m', 'x', 'a', 'b', 'c')}


def mk(m, x, a, b, c):
    n = len(a)
    return dict(m=np.broadcast_to(np.asarray(m, dtype=np.int8), (n,)).copy(), x=np.broadcast_to(np.asarray(x, dtype=np.int32), (n,)).copy(),
                a=np.asarray(a, dtype=np.float64).copy(), b=np.asarray(b, dtype=np.float64).copy(), c=np.asarray(c, dtype=np.float64).copy())


def _nodes(m, u0, h, g):
    i = np.arange(m)
    return u0[:, None] + i[None, :] * h[:, None] + (i * i)[None, :] * g[:, None]


def window_ok(kind, tab):
    """in-window mask (also strictly increasing nodes)"""
    m = tab['m'].astype(int)
    a, b, c = tab['a'], tab['b'], tab['c']
    ok = np.zeros(len(a), dtype=bool)
    if kind == 'JA':
        for mm in (2, 3, 4):
            s = np.nonzero(m == mm)[0]
            if s.size:
                cols = COLSETS[mm][tab['x'][s] // 2]
                ok[s] = funcs.minor_window_ok(mm, cols, a[s], b[s], c[s])
    elif kind == 'JB1':
        for mm in (2, 3, 4):
            s = np.nonzero(m == mm)[0]
            if s.size:
                U = _nodes(mm, np.zeros(s.size), a[s], b[s])
                ok[s] = np.all(np.diff(U, axis=1) > 1e-9, axis=1) & (U[:, -1] <= WIN + 1e-12)
    elif kind == 'JB2':
        ok = ((m - 1) * a <= WIN + 1e-12) & (a > 0)
    else:
        ok = (a - b >= -WIN - 1e-12) & (a + b <= WIN + 1e-12)
    return ok


def gen_grid(kind):
    tabs = []
    if kind == 'JA':
        u0s = np.round(np.arange(-2.6, 2.6 + 1e-9, 0.2), 10)
        hs = np.array([0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, math.log(2), math.log(3), math.log(1.5)])
        for m in (2, 3, 4):
            gg = np.array([0.0]) if m == 2 else np.array([-0.05, 0.0, 0.05])
            nc = len(COLSETS[m])
            X, U0, H, G = [z.ravel() for z in np.meshgrid(np.arange(2 * nc), u0s, hs, gg, indexing='ij')]
            tabs.append(mk(m, X, U0, H, G))
    elif kind == 'JB1':
        hs = 0.02 * np.arange(1, 66)
        ts = math.pi * np.arange(32) / 32
        for m in (2, 3, 4):
            gg = np.array([0.0]) if m == 2 else np.array([-0.08, -0.05, -0.03, -0.01, 0, 0.01, 0.03, 0.05, 0.08])
            H, G, T = [z.ravel() for z in np.meshgrid(hs, gg, ts, indexing='ij')]
            tabs.append(mk(m, 0, H, G, T))
    elif kind == 'JB2':
        hs = 0.02 * np.arange(1, 66)
        ph = 2 * math.pi * np.arange(24) / 24
        ts = math.pi * np.arange(32) / 32
        for m in M2:
            H, F, T = [z.ravel() for z in np.meshgrid(hs, ph, ts, indexing='ij')]
            tabs.append(mk(m, 0, H, F, T))
    else:
        us = np.round(np.arange(-2.5, 2.5 + 1e-9, 0.05), 10)
        for s in ((0, 1) if kind == 'JC1' else (0,)):
            U, H, L = [z.ravel() for z in np.meshgrid(us, np.array(HJC), np.array(LAMJ, dtype=float), indexing='ij')]
            tabs.append(mk(0, s, U, H, L))
    t = cat(tabs)
    return take(t, window_ok(kind, t))


def gen_random(kind, n, seed):
    r = np.random.Generator(np.random.PCG64(seed))
    if kind == 'JA':
        lab = r.integers(0, 1079, n)
        alt = r.integers(0, 2, n)
        edges = [0, len(COLSETS[2]), len(COLSETS[2]) + len(COLSETS[3]), 1079]
        m = np.select([lab < edges[1], lab < edges[2]], [2, 3], 4)
        ci = lab - np.asarray(edges)[m - 2]
        u0 = r.uniform(-2.6, 2.6, n)
        h = r.uniform(0.02, 1.2, n)
        g = np.where(m > 2, r.uniform(-0.12, 0.12, n), 0.0)
        t = mk(m, 2 * ci + alt, u0, h, g)
    elif kind == 'JB1':
        m = r.integers(2, 5, n)
        h = r.uniform(0.01, 1.3, n)
        g = np.where(m > 2, r.uniform(-0.1, 0.1, n), 0.0)
        t = mk(m, 0, h, g, r.uniform(0, math.pi, n))
    elif kind == 'JB2':
        m = np.asarray(M2)[r.integers(0, len(M2), n)]
        t = mk(m, 0, r.uniform(0.01, 1.3, n), r.uniform(0, 2 * math.pi, n), r.uniform(0, math.pi, n))
    else:
        s = r.integers(0, 2, n) if kind == 'JC1' else np.zeros(n, dtype=int)
        t = mk(0, s, r.uniform(-2.5, 2.5, n), r.uniform(0.01, 1.5, n), r.uniform(-2, 4, n))
    return take(t, window_ok(kind, t))


NRAND = {'JA': 1_000_000, 'JB1': 500_000, 'JB2': 500_000, 'JC1': 500_000, 'JC2': 500_000}


def gen_family(fam, scale=1.0):
    """'<kind>-<pol>' registered grid; '<kind>-<pol>-rnd' registered draws."""
    kind, pol = fam_info(fam)
    base = FAMS.index('-'.join(fam.split('-')[:2]))
    if fam.endswith('-rnd'):
        return gen_random(kind, int(NRAND[kind] * scale), 141000 + base)
    if fam.endswith('-rnd2'):                      # PREREG amendment B2: ten times the registered draws, other seeds
        return gen_random(kind, int(10 * NRAND[kind] * scale), 147000 + base)
    return gen_grid(kind)


def perturb(kind, tab, nper, seed):
    """adaptive stage (PREREG section 5)"""
    r = np.random.Generator(np.random.PCG64(seed))
    t = {k: np.repeat(v, nper) for k, v in tab.items()}
    n = len(t['a'])
    if kind == 'JA':
        t['a'] = t['a'] + r.normal(0, 0.05, n)
        t['b'] = t['b'] * (1 + r.normal(0, 0.3, n))
        t['c'] = np.where(t['m'] > 2, t['c'] + r.normal(0, 0.02, n), 0.0)
    elif kind == 'JB1':
        t['a'] = t['a'] * (1 + r.normal(0, 0.3, n))
        t['b'] = np.where(t['m'] > 2, t['b'] + r.normal(0, 0.02, n), 0.0)
        t['c'] = t['c'] + r.normal(0, 0.1, n)
    elif kind == 'JB2':
        t['a'] = t['a'] * (1 + r.normal(0, 0.3, n))
        t['b'] = t['b'] + r.normal(0, 0.1, n)
        t['c'] = t['c'] + r.normal(0, 0.1, n)
    else:
        t['a'] = t['a'] + r.normal(0, 0.05, n)
        t['b'] = t['b'] * (1 + r.normal(0, 0.3, n))
        t['c'] = t['c'] + r.normal(0, 0.1, n) * np.maximum(np.abs(t['c']), 0.1)
    ok = window_ok(kind, t) & (t['b'] > 1e-6 if kind != 'JB2' else t['a'] > 1e-6) & ((t['a'] > 1e-6) if kind == 'JB1' else True)
    return take(t, ok)


# ---------- evaluation ----------
def points(kind, m, tab):
    """(npts, F) points read on both kernels"""
    a, b, c = tab['a'], tab['b'], tab['c']
    if kind == 'JA':
        cols = COLSETS[m][tab['x'] // 2]
        U = _nodes(m, a, b, c)
        return (U[:, :, None] + LOGN[cols][:, None, :]).reshape(len(a), m * m).T
    if kind == 'JB1':
        U = _nodes(m, np.zeros(len(a)), a, b)
        P = [np.zeros(len(a))]
        for i in range(m):
            for j in range(i):
                P.append(U[:, i] - U[:, j])
        return np.stack(P)
    if kind == 'JB2':
        return np.stack([d * a for d in range(m)])
    return np.stack([a - b, a, a + b])


def _uniq(P):
    uq, inv = np.unique(P.ravel(), return_inverse=True)
    return uq, inv.reshape(P.shape)


def sign_from(kind, m, tab, KA, NA, KB, NB):
    """KA, KB (npts, F) values, NA, NB noise -> int8 (F,)"""
    F = KA.shape[1]
    if kind == 'JA':
        alt = (tab['x'] % 2)[:, None, None]
        A = KA.T.reshape(F, m, m)
        B = KB.T.reshape(F, m, m)
        useA = ((np.arange(m)[None, :, None] + alt) % 2) == 0
        M = np.where(useA, A, B)
        Nz = np.where(useA, NA.T.reshape(F, m, m), NB.T.reshape(F, m, m))
        return det_sign(M, Nz)
    if kind in ('JB1', 'JB2'):
        ct = np.cos(tab['c'])[None, :]
        st = np.sin(tab['c'])[None, :]
        Mv = ct * KB + st * KA
        Nv = np.abs(ct) * NB + np.abs(st) * NA
        Sv = np.abs(ct * KB) + np.abs(st * KA)
        if kind == 'JB1':
            H = np.zeros((F, m, m), dtype=np.complex128)
            Nz = np.zeros((F, m, m))
            k = 1
            for i in range(m):
                H[:, i, i] = Mv[0].real
                Nz[:, i, i] = Nv[0]
                for j in range(i):
                    H[:, i, j] = Mv[k]
                    H[:, j, i] = np.conj(Mv[k])
                    Nz[:, i, j] = Nv[k]
                    Nz[:, j, i] = Nv[k]
                    k += 1
            return det_sign(H, Nz)
        ph = tab['b']
        v = m * Mv[0].real
        S = m * Sv[0]
        nz = m * Nv[0]
        for d in range(1, m):
            v = v + 2 * (m - d) * (np.exp(1j * ph * d) * Mv[d]).real
            S = S + 2 * (m - d) * Sv[d]
            nz = nz + 2 * (m - d) * Nv[d]
        ok = np.isfinite(v) & (np.abs(v) > 1e-9 * S) & (np.abs(v) > 20 * nz)
        return np.where(ok, np.sign(v), 0).astype(np.int8)
    lam = tab['c']
    sa = np.abs(KA).max(axis=0)
    sb = np.abs(KB).max(axis=0)
    sa = np.where((sa == 0) | ~np.isfinite(sa), 1.0, sa)
    sb = np.where((sb == 0) | ~np.isfinite(sb), 1.0, sb)
    rho = np.maximum(_rho(KA, NA, 0), _rho(KB, NB, 0))
    A = KA / sa
    B = KB / sb
    if kind == 'JC1':
        s = tab['x'] == 1                       # s = -1: A at u + h, B at u - h
        a1 = np.where(s, A[2], A[0])
        b1 = np.where(s, B[0], B[2])
        v = (a1 * b1 - lam * A[1] * B[1]).real
        S = np.abs(a1 * b1) + np.abs(lam) * np.abs(A[1] * B[1])
        return _decide(v, S, rho, 2)
    v = (A[0] * np.conj(A[2])).real * np.abs(B[1]) ** 2 - lam * np.abs(A[1]) ** 2 * (B[0] * np.conj(B[2])).real
    S = np.abs(A[0] * A[2]) * np.abs(B[1]) ** 2 + np.abs(lam) * np.abs(A[1]) ** 2 * np.abs(B[0] * B[2])
    return _decide(v, S, rho, 4)


def eval_family(fam, tab, pairs):
    """-> int8 (F, len(pairs))"""
    kind, pol = fam_info(fam)
    F = nfun(tab)
    out = np.zeros((F, len(pairs)), dtype=np.int8)
    for m in np.unique(tab['m']):
        sel = np.nonzero(tab['m'] == m)[0]
        sub = take(tab, sel)
        P = points(kind, int(m), sub)
        uq, inv = _uniq(P)
        cache = {}
        last = {}

        def get(k, keep):
            key = id(k)
            if key in cache:
                return cache[key]
            if key in last:
                return last[key]
            K, N = k.val(uq, pol)
            v = (K[inv], N[inv])
            if keep:
                cache[key] = v
            else:
                last.clear()                    # control kernels: only the latest A side is kept (shared by its twists)
                last[key] = v
            return v
        for j, p in enumerate(pairs):
            pos = p.group in ('P', 'PX', 'PH')
            KA, NA = get(p.A, pos)
            if pos:
                KB, NB = get(p.B, True)
            else:
                K, N = p.B.val(uq, pol)
                KB, NB = K[inv], N[inv]
            out[sel, j] = sign_from(kind, int(m), sub, KA, NA, KB, NB)
    return out
