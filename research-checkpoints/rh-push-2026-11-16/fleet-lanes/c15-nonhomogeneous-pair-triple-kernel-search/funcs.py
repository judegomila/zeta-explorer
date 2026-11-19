"""Dictionary D (PREREG section 4): parameter tables and float64 sign evaluation (PREREG section 5)."""
import itertools
import math
import numpy as np
import kern

WIN = kern.WIN
TOL = 1e-9
PLAB = [0, 2, 3, 5, 7, 11, 13]
LOGN = np.log(np.arange(0, 14).clip(1))          # LOGN[n] = log n, n = 1..13
LAMS = [0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2, 4]
MUS = [-2, -1, -0.5, 0, 0.5, 1, 2]
H1 = [0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1.0, 1.5]
H3 = [0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1.0]
UG = np.round(np.arange(-2.5, 2.5 + 1e-9, 0.05), 10)

COLSETS = {m: np.array(list(itertools.combinations(range(1, 14), m)), dtype=np.int8) for m in (2, 3, 4)}
MINOR_FAMS = {'D1': True, 'D3a': False}
TURAN = ['F1', 'F2', 'F3', 'F4', 'F5']


def fam_info(fam):
    """-> (kind, pol, sub) with kind 'minor' or 'turan'."""
    base = fam.split('-rnd')[0].split('-adp')[0]
    if base in MINOR_FAMS:
        return 'minor', MINOR_FAMS[base], None
    d, f = base.split('-')
    return 'turan', d == 'D2', f


def all_families():
    return ['D1', 'D3a'] + ['%s-%s' % (d, f) for d in ('D2', 'D3b') for f in TURAN]


# ---------- parameter tables ----------
def _nodes(m, u0, h, g):
    i = np.arange(m)
    return u0[:, None] + i[None, :] * h[:, None] + (i * i)[None, :] * g[:, None]


def minor_window_ok(m, cols, u0, h, g):
    U = _nodes(m, u0, h, g)
    inc = np.all(np.diff(U, axis=1) > 1e-9, axis=1)
    lo = U.min(1) + LOGN[cols[:, 0]]
    hi = U.max(1) + LOGN[cols[:, m - 1]]
    return inc & (lo >= -WIN - 1e-12) & (hi <= WIN + 1e-12)


def gen_minor_grid():
    u0s = np.round(np.arange(-2.6, 2.6 + 1e-9, 0.1), 10)
    hs = np.concatenate((np.round(np.arange(0.05, 1.0 + 1e-9, 0.05), 10), [math.log(2), math.log(3), math.log(1.5)]))
    gs = np.array([-0.1, -0.05, 0.0, 0.05, 0.1])
    out = {}
    for m in (2, 3, 4):
        gg = np.array([0.0]) if m == 2 else gs
        C = COLSETS[m]
        U0, H, G = [x.ravel() for x in np.meshgrid(u0s, hs, gg, indexing='ij')]
        # window pre-filter on the node part, then cross with column sets
        ci = np.repeat(np.arange(len(C)), len(U0))
        u0 = np.tile(U0, len(C))
        h = np.tile(H, len(C))
        g = np.tile(G, len(C))
        ok = minor_window_ok(m, C[ci], u0, h, g)
        out[m] = dict(ci=ci[ok].astype(np.int32), u0=u0[ok], h=h[ok], g=g[ok])
    return out


def gen_minor_random(n, seed):
    r = np.random.Generator(np.random.PCG64(seed))
    out = {}
    lab = r.integers(0, 1079, n)
    edges = [0, len(COLSETS[2]), len(COLSETS[2]) + len(COLSETS[3]), 1079]
    u0 = r.uniform(-2.6, 2.6, n)
    h = r.uniform(0.02, 1.2, n)
    g = r.uniform(-0.12, 0.12, n)
    for k, m in enumerate((2, 3, 4)):
        sel = (lab >= edges[k]) & (lab < edges[k + 1])
        ci = lab[sel] - edges[k]
        gg = g[sel] if m > 2 else np.zeros(sel.sum())
        ok = minor_window_ok(m, COLSETS[m][ci], u0[sel], h[sel], gg)
        out[m] = dict(ci=ci[ok].astype(np.int32), u0=u0[sel][ok], h=h[sel][ok], g=gg[ok])
    return out


def turan_window_ok(sub, u, h):
    reach = {'F1': 1, 'F3': 2}.get(sub, 0)
    return (u - reach * h >= -WIN - 1e-12) & (u + reach * h <= WIN + 1e-12)


def gen_turan_grid(sub):
    axes = {'F1': (PLAB, UG, H1, LAMS, [0.0]), 'F2': (PLAB, UG, [0.0], LAMS, MUS), 'F3': (PLAB, UG, H3, [1.0], [0.0]),
            'F4': (PLAB, UG, [0.0], [1.0], [0.0]), 'F5': (PLAB, UG, [0.0], [1.0], MUS)}[sub]
    P, U, H, L, M = [x.ravel() for x in np.meshgrid(*[np.asarray(a, dtype=np.float64) for a in axes], indexing='ij')]
    ok = turan_window_ok(sub, U, H)
    return dict(p=P[ok].astype(np.int8), u=U[ok], h=H[ok], lam=L[ok], mu=M[ok])


def gen_turan_random(sub, n, seed):
    r = np.random.Generator(np.random.PCG64(seed))
    P = np.asarray(PLAB)[r.integers(0, 7, n)]
    U = r.uniform(-2.5, 2.5, n)
    H = r.uniform(0.01, 1.5, n) if sub in ('F1', 'F3') else np.zeros(n)
    L = r.uniform(0.25, 4, n) if sub in ('F1', 'F2') else np.ones(n)
    M = r.uniform(-2, 2, n) if sub in ('F2', 'F5') else np.zeros(n)
    ok = turan_window_ok(sub, U, H)
    return dict(p=P[ok].astype(np.int8), u=U[ok], h=H[ok], lam=L[ok], mu=M[ok])


def flatten_minor(par):
    """dict by m -> single table with field m (for storage and slicing)."""
    m = np.concatenate([np.full(len(par[k]['ci']), k, dtype=np.int8) for k in (2, 3, 4)])
    out = dict(m=m)
    for f in ('ci', 'u0', 'h', 'g'):
        out[f] = np.concatenate([par[k][f] for k in (2, 3, 4)])
    return out


def nfun(tab):
    return len(next(iter(tab.values())))


def take(tab, sl):
    return {k: v[sl] for k, v in tab.items()}


# ---------- sign evaluation ----------
def _decide(v, S, rho=0.0, deg=4):
    """decided when |Re v| > max(TOL, 10 deg rho) S; rho = largest relative rounding noise of an entry read."""
    v = np.real(v)
    thr = np.maximum(TOL, 10 * deg * rho)
    ok = np.isfinite(v) & np.isfinite(S) & (np.abs(v) > thr * S) & np.isfinite(thr)
    return np.where(ok, np.sign(v), 0).astype(np.int8)


def _rho(E, N, axis):
    """max over the entries of noise / modulus (0/0 = 0, x/0 = inf)."""
    A = np.abs(E)
    with np.errstate(divide='ignore', invalid='ignore'):
        r = np.where(N == 0, 0.0, N / A)
    r = np.where(np.isnan(r), np.inf, r)
    return r.max(axis=axis)


def det_sign(M, Nz=None):
    """M (F, m, m), real or complex -> int8 sign of Re det with the permanent-of-moduli scale."""
    m = M.shape[1]
    rho = 0.0 if Nz is None else _rho(M.reshape(len(M), -1), Nz.reshape(len(M), -1), 1)
    A = np.abs(M)
    r = A.max(axis=2, keepdims=True)
    r[r == 0] = 1
    M = M / r
    A = A / r
    c = A.max(axis=1, keepdims=True)
    c[c == 0] = 1
    M = M / c
    A = A / c
    if m == 2:
        d = M[:, 0, 0] * M[:, 1, 1] - M[:, 0, 1] * M[:, 1, 0]
        S = A[:, 0, 0] * A[:, 1, 1] + A[:, 0, 1] * A[:, 1, 0]
    elif m == 3:
        d = 0
        S = 0
        for (a, b, cc), sg in (((0, 1, 2), 1), ((1, 2, 0), 1), ((2, 0, 1), 1), ((0, 2, 1), -1), ((1, 0, 2), -1), ((2, 1, 0), -1)):
            d = d + sg * M[:, 0, a] * M[:, 1, b] * M[:, 2, cc]
            S = S + A[:, 0, a] * A[:, 1, b] * A[:, 2, cc]
    else:
        d = 0
        S = 0
        for a, b in itertools.combinations(range(4), 2):
            rest = [x for x in range(4) if x not in (a, b)]
            sg = (-1) ** (a + b + 1)                      # rows 0,1 (sum 1), columns a,b
            t = M[:, 0, a] * M[:, 1, b] - M[:, 0, b] * M[:, 1, a]
            w = M[:, 2, rest[0]] * M[:, 3, rest[1]] - M[:, 2, rest[1]] * M[:, 3, rest[0]]
            d = d + sg * t * w
            S = S + (A[:, 0, a] * A[:, 1, b] + A[:, 0, b] * A[:, 1, a]) * (A[:, 2, rest[0]] * A[:, 3, rest[1]] + A[:, 2, rest[1]] * A[:, 3, rest[0]])
    return _decide(d, S, rho, m)


def _uniq(pts):
    uq, inv = np.unique(pts.ravel(), return_inverse=True)
    return uq, inv.reshape(pts.shape)


def eval_minor(tab, objs, pol):
    """tab: flattened minor table (one chunk). -> int8 (F, n_obj)."""
    F = nfun(tab)
    out = np.zeros((F, len(objs)), dtype=np.int8)
    for m in (2, 3, 4):
        sel = np.nonzero(tab['m'] == m)[0]
        if sel.size == 0:
            continue
        cols = COLSETS[m][tab['ci'][sel]]
        U = _nodes(m, tab['u0'][sel], tab['h'][sel], tab['g'][sel])
        pts = U[:, :, None] + LOGN[cols][:, None, :]
        uq, inv = _uniq(pts)
        for j, o in enumerate(objs):
            K, N = o.jn(uq, 0, pol)
            out[sel, j] = det_sign(K[0][inv], N[0][inv])
    return out


def _tilt(J, mu):
    """jets (kmax+1, F) of k -> jets of e^(mu u) k up to the positive factor e^(mu u)."""
    K = J.shape[0]
    out = np.zeros_like(J)
    for n in range(K):
        for j in range(n + 1):
            out[n] = out[n] + math.comb(n, j) * mu ** (n - j) * J[j]
    return out


def _scale(J):
    s = np.abs(J).max(axis=0)
    s = np.where((s == 0) | ~np.isfinite(s), 1.0, s)
    return J / s


def turan_sign(sub, J, lam, mu, Nz):
    """J: (npts or kmax+1, F) values/jets of k at the functional's points; Nz their noise -> int8 (F,)."""
    if sub == 'F1':
        rho = _rho(J, Nz, 0)
        a, b, c = _scale(J)
        return _decide(a * c - lam * b * b, np.abs(a * c) + np.abs(lam) * np.abs(b) ** 2, rho, 2)
    if sub == 'F2':
        T = _tilt(J, mu)
        rho = _rho(T, _tilt(Nz, np.abs(mu)), 0)
        k0, k1, k2 = _scale(T)
        return _decide(k1 * k1 - lam * k0 * k2, np.abs(k1) ** 2 + np.abs(lam) * np.abs(k0 * k2), rho, 2)
    if sub in ('F3', 'F4'):
        i = np.arange(3)
        M = np.moveaxis(J[i[:, None] + i[None, :]], 2, 0)      # (F, 3, 3)
        return det_sign(M, np.moveaxis(Nz[i[:, None] + i[None, :]], 2, 0))
    if sub == 'F5':
        T = _tilt(J, mu)
        rho = _rho(T, _tilt(Nz, np.abs(mu)), 0)
        k0, k1, k2, k3 = _scale(T)
        A = k1 * k1 - k0 * k2
        B = k2 * k2 - k1 * k3
        C = k1 * k2 - k0 * k3
        S = 4 * (np.abs(k1) ** 2 + np.abs(k0 * k2)) * (np.abs(k2) ** 2 + np.abs(k1 * k3)) + (np.abs(k1 * k2) + np.abs(k0 * k3)) ** 2
        return _decide(4 * A * B - C * C, S, rho, 4)
    raise ValueError(sub)


def eval_turan(tab, objs, pol, sub):
    F = nfun(tab)
    out = np.zeros((F, len(objs)), dtype=np.int8)
    for p in PLAB:
        sel = np.nonzero(tab['p'] == p)[0]
        if sel.size == 0:
            continue
        u = tab['u'][sel]
        h = tab['h'][sel]
        lam = tab['lam'][sel]
        mu = tab['mu'][sel]
        if sub == 'F1':
            pts = np.stack((u - h, u, u + h))
        elif sub == 'F3':
            pts = np.stack([u + k * h for k in (-2, -1, 0, 1, 2)])
        else:
            pts = u[None, :]
        kmax = {'F2': 2, 'F4': 4, 'F5': 3}.get(sub, 0)
        uq, inv = _uniq(pts)
        for j, o in enumerate(objs):
            Ju, Nu = kern.hecke_jn(o, uq, kmax, pol, p)        # (kmax+1, nuq)
            if kmax == 0:
                J = Ju[0][inv]                                  # (npts, F)
                Nz = Nu[0][inv]
            else:
                J = Ju[:, inv[0]]                               # (kmax+1, F)
                Nz = Nu[:, inv[0]]
            out[sel, j] = turan_sign(sub, J, lam, mu, Nz)
    return out


def eval_family(fam, tab, objs):
    kind, pol, sub = fam_info(fam)
    if kind == 'minor':
        return eval_minor(tab, objs, pol)
    return eval_turan(tab, objs, pol, sub)


def gen_family(fam):
    """registered grid, or the registered random draws for '<fam>-rnd'."""
    kind, pol, sub = fam_info(fam)
    order = all_families()
    base = fam.split('-rnd')[0]
    big = fam.endswith('-rnd2')                      # PREREG amendment A3: ten times the registered draws, other seeds
    seed = (137000 if big else 131000) + order.index(base)
    if kind == 'minor':
        if '-rnd' in fam:
            return flatten_minor(gen_minor_random(4000000 if big else 400000, seed))
        return flatten_minor(gen_minor_grid())
    if '-rnd' in fam:
        if sub == 'F4':
            return gen_turan_random(sub, 100000 if big else 10000, seed) if big else None
        return gen_turan_random(sub, 1000000 if big else 100000, seed)
    return gen_turan_grid(sub)
