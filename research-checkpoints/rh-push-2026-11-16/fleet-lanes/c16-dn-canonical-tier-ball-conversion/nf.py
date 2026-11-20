"""c15: pair families of DN (PREREG section 4): node sets and float64 values.
Family value = (V1, E1, V2, E2); V2 = None means the threshold form V1 - mu."""
import math
import numpy as np

WIN = 2.6
GROUPS = {'g0': ['a1-with'],
          'g1': ['b1-Aw', 'b1-Ao', 'b1-B', 'b3-with', 'b3-without', 'b4m-with', 'b4p-with', 'b4p-without', 'b6-with'],
          'g2': ['b2-with', 'b5l-with', 'b5m-with', 'b5p-with']}
GIDX = {'g0': 0, 'g1': 1, 'g2': 2}
REACH = {'g0': 0.0, 'g1': 1.0, 'g2': 1.5}
NRAND = 300_000
# deleted on paper (PREREG section 2); evaluated only by the identity check
DELETED = ['a1-without', 'b2-without', 'b2-B', 'b4m-without', 'b5m-without', 'b6-without']


def nodes(group, scale=1.0):
    r = np.random.Generator(np.random.PCG64(151000 + GIDX[group]))
    if group == 'g0':
        ug = np.round(np.arange(-2.6, 2.6 + 1e-9, 0.002), 10)
        ur = r.uniform(-2.6, 2.6, int(NRAND * scale))
        u = np.concatenate((ug, ur))
        return u, np.zeros(len(u)), len(ug)
    us = np.round(np.arange(-2.5, 2.5 + 1e-9, 0.02), 10)
    hs = np.round(np.arange(0.02, 1.6 + 1e-9, 0.02), 10)
    U, H = [z.ravel() for z in np.meshgrid(us, hs, indexing='ij')]
    ok = np.abs(U) + REACH[group] * H <= WIN + 1e-12
    U, H = U[ok], H[ok]
    n = int(NRAND * scale)
    u = r.uniform(-2.6, 2.6, n)
    h = r.uniform(0.005, 1.7, n)
    ok = np.abs(u) + REACH[group] * h <= WIN
    return np.concatenate((U, u[ok])), np.concatenate((H, h[ok])), len(U)


def points(group, u, h):
    if group == 'g0':
        return u[None, :]
    if group == 'g1':
        return np.stack((u - h, u, u + h))
    return np.stack((u - 1.5 * h, u - 0.5 * h, u + 0.5 * h, u + 1.5 * h))


def logabs(K, N):
    a = np.abs(K)
    with np.errstate(divide='ignore', invalid='ignore'):
        rel = N / a
        L = np.log(a)
    bad = ~np.isfinite(L) | ~np.isfinite(rel) | (rel > 1e-3)
    return np.where(bad, np.nan, L), np.where(bad, np.nan, rel)


def fam_values(group, KAw, NAw, KAo, NAo, KB, NB):
    """K* (npts, F) -> dict fam -> (V1, E1, V2, E2); also the deleted families (for the identity check)."""
    out = {}
    if group == 'g0':
        for tag, KA, NA in (('with', KAw, NAw), ('without', KAo, NAo)):
            with np.errstate(divide='ignore', invalid='ignore'):
                R = KB[0] / KA[0]
                E = (NB[0] + np.abs(R) * NA[0]) / np.abs(KA[0])
                bad = ~np.isfinite(R) | (NA[0] / np.abs(KA[0]) > 1e-3)
            out['a1-' + tag] = (np.where(bad, np.nan, R.real), np.where(bad, np.nan, E), None, None)
        return out
    lw, ew = logabs(KAw, NAw)
    lo, eo = logabs(KAo, NAo)
    lb, eb = logabs(KB, NB)
    if group == 'g1':
        def d2(l, e):
            return l[0] - 2 * l[1] + l[2], e[0] + 2 * e[1] + e[2]
        Lw, Ew = d2(lw, ew)
        Lo, Eo = d2(lo, eo)
        Lb, Eb = d2(lb, eb)
        out['b1-Aw'] = (Lw, Ew, None, None)
        out['b1-Ao'] = (Lo, Eo, None, None)
        out['b1-B'] = (Lb, Eb, None, None)
        out['b3-with'] = (Lw, Ew, Lb, Eb)
        out['b3-without'] = (Lo, Eo, Lb, Eb)
        out['b4m-with'] = (Lw - Lb, Ew + Eb, None, None)
        out['b4m-without'] = (Lo - Lb, Eo + Eb, None, None)
        out['b4p-with'] = (Lw + Lb, Ew + Eb, None, None)
        out['b4p-without'] = (Lo + Lb, Eo + Eb, None, None)
        out['b6-with'] = ((lb[2] - lw[2]) - (lb[1] - lw[1]), eb[2] + ew[2] + eb[1] + ew[1], None, None)
        out['b6-without'] = ((lb[2] - lo[2]) - (lb[1] - lo[1]), eb[2] + eo[2] + eb[1] + eo[1], None, None)
        return out

    def d3(l, e):
        return l[3] - 3 * l[2] + 3 * l[1] - l[0], e[3] + 3 * e[2] + 3 * e[1] + e[0]
    Lw, Ew = d3(lw, ew)
    Lo, Eo = d3(lo, eo)
    Lb, Eb = d3(lb, eb)
    out['b2-with'] = (Lw, Ew, None, None)
    out['b2-without'] = (Lo, Eo, None, None)
    out['b2-B'] = (Lb, Eb, None, None)
    out['b5l-with'] = (Lw, Ew, Lb, Eb)
    out['b5m-with'] = (Lw - Lb, Ew + Eb, None, None)
    out['b5m-without'] = (Lo - Lb, Eo + Eb, None, None)
    out['b5p-with'] = (Lw + Lb, Ew + Eb, None, None)
    return out


def eval_group(group, u, h, pairs, fams=None):
    """-> dict fam -> [V1, E1, V2, E2] arrays (F, nobj) (V2, E2 None for threshold families)"""
    fams = GROUPS[group] if fams is None else fams
    P = points(group, u, h)
    uq, inv = np.unique(P.ravel(), return_inverse=True)
    inv = inv.reshape(P.shape)
    F = len(u)
    n = len(pairs)
    res = {f: [np.full((F, n), np.nan), np.full((F, n), np.nan), None, None] for f in fams}
    cache = {}
    last = {}

    def get(k, pol, keep):
        key = (id(k), pol)
        if key in cache:
            return cache[key]
        if key in last:
            return last[key]
        K, N = k.val(uq, pol)
        v = (np.asarray(K)[inv], np.asarray(N)[inv])
        if keep:
            cache[key] = v
        else:
            if len(last) >= 2:
                last.clear()
            last[key] = v
        return v
    for j, p in enumerate(pairs):
        pos = p.group in ('P', 'PX', 'PH')
        KAw, NAw = get(p.A, True, pos)
        KAo, NAo = get(p.A, False, pos)
        if pos:
            KB, NB = get(p.B, True, True)
        else:
            K, N = p.B.val(uq, True)
            KB, NB = np.asarray(K)[inv], np.asarray(N)[inv]
        vals = fam_values(group, KAw, NAw, KAo, NAo, KB, NB)
        for f in fams:
            V1, E1, V2, E2 = vals[f]
            res[f][0][:, j] = V1
            res[f][1][:, j] = E1
            if V2 is not None:
                if res[f][2] is None:
                    res[f][2] = np.full((F, n), np.nan)
                    res[f][3] = np.full((F, n), np.nan)
                res[f][2][:, j] = V2
                res[f][3][:, j] = E2
    return res


def v2full(V):
    """fill V2 = 1, E2 = 0 for threshold families"""
    V1, E1, V2, E2 = V
    if V2 is None:
        V2 = np.ones_like(V1)
        E2 = np.zeros_like(V1)
    return V1, E1, V2, E2
