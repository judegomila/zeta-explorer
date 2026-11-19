"""c15: exact solution in the last parameter (PREREG section 5). An object has value sign(V1 - lam V2).
All arrays (F, nobj). Rays: with r = V1/V2, e = half-width of r: sign s holds for lam < r - e when s*sign(V2) > 0
and for lam > r + e when s*sign(V2) < 0."""
import numpy as np

INF = np.inf
NEED = 23


def ratio(V1, E1, V2, E2):
    with np.errstate(divide='ignore', invalid='ignore'):
        r = V1 / V2
        e = (E1 + np.abs(r) * E2) / np.abs(V2)
        e = np.maximum(e, 1e-12 * np.abs(r))
    und = ~np.isfinite(r) | ~np.isfinite(e) | (np.abs(V2) <= 2 * E2)
    return r, e, und, np.sign(np.where(und, 1.0, V2))


def solve_sign(r, e, und, sg2, s, pos, cls, optimistic):
    """-> C (F, K+1) candidate left ends, UP (F, K+1) right ends, feas (F, K+1), nsat (F, K+1), valid, rejk (F, K)"""
    m = -1.0 if optimistic else 1.0
    with np.errstate(invalid='ignore'):
        aL = r - m * e           # left-ray end (lam < aL)
        bR = r + m * e           # right-ray end (lam > bR)
    left = (sg2 * s) > 0     # sign s is a left ray
    P = pos
    lp = left[:, P] & ~und[:, P]
    rp = ~left[:, P] & ~und[:, P]
    hi = np.where(lp, aL[:, P], INF).min(1)
    lo = np.where(rp, bR[:, P], -INF).max(1)
    if not optimistic:
        hi = np.where(und[:, P].any(1), -INF, hi)
    F = len(r)
    K = len(cls)
    A = np.full((F, K), -INF)
    B = np.full((F, K), INF)
    for k, C in enumerate(cls):
        if len(C) == 0:
            continue
        lc = ~left[:, C] & ~und[:, C]      # sign -s is a left ray
        rc = left[:, C] & ~und[:, C]
        A[:, k] = np.where(lc, aL[:, C], -INF).max(1)
        B[:, k] = np.where(rc, bR[:, C], INF).min(1)
        if optimistic:
            A[:, k] = np.where(und[:, C].any(1), INF, A[:, k])
    Cn = np.concatenate((lo[:, None], B), axis=1)
    valid = (Cn >= lo[:, None]) & (Cn < hi[:, None])
    sat = (Cn[:, :, None] < A[:, None, :]) | (Cn[:, :, None] >= B[:, None, :])
    nsat = np.where(valid, sat.sum(2), -1)
    feas = valid & sat.all(2)
    UP = np.minimum(hi[:, None], np.where(Cn[:, :, None] < B[:, None, :], A[:, None, :], INF).min(2))
    rejk = (valid[:, :, None] & sat).any(1)
    return Cn, UP, feas, nsat, rejk


def pick(c, up):
    if np.isfinite(c) and np.isfinite(up):
        return 0.5 * (c + up)
    if np.isfinite(c):
        return c + 1.0
    if np.isfinite(up):
        return up - 1.0
    return 0.0


def heldout(V1, E1, V2, E2, row, lam, s, d, classes):
    v = V1[row] - lam * V2[row]
    tol = E1[row] + abs(lam) * E2[row]
    sg = np.where(np.isfinite(v) & np.isfinite(tol) & (np.abs(v) > tol), np.sign(v), 0)
    same = int((sg[d['PH']] == s).sum())
    opp = [int((sg[d['H%d' % k]] == -s).sum()) for k in classes]
    return same, opp


def analyse(V1, E1, V2, E2, d, ALLC, FEC, want_rows=True, extra=False):
    """per-chunk analysis. Returns counts and rows (index within chunk) of feasible / undecided nodes."""
    r, e, und, sg2 = ratio(V1, E1, V2, E2)
    F = len(r)
    PZ = d['P']
    PA = np.concatenate((d['P'], d['PX']))
    tiers = {'PA/all': (PA, ALLC), 'PA/FE': (PA, FEC), 'PZ/all': (PZ, ALLC)}
    if extra:        # tiers requested by LIFT_RULING.md section 4 (amendment A6): canonical lifts only; six classes
        tiers['PA/canon'] = (PA, [2, 3, 4])
        tiers['PA/six'] = (PA, [1, 2, 3, 4, 6, 7])
    out = dict(nodes=F)
    rows = []
    for name, (pos, cl) in tiers.items():
        cls = [d['C%d' % k] for k in cl]
        feas_any = np.zeros(F, dtype=bool)
        opt_any = np.zeros(F, dtype=bool)
        nrej = np.full(F, -1, dtype=np.int64)     # -1 = no lam keeps the positives one-signed (corrected after the run: was 0)
        rejk = np.zeros((F, len(cl)), dtype=bool)
        full = np.zeros(F, dtype=bool)
        tweak = np.zeros(F, dtype=bool)
        best = 0
        for s in (1, -1):
            Cn, UP, feas, nsat, rk = solve_sign(r, e, und, sg2, s, pos, cls, False)
            feas_any |= feas.any(1)
            nrej = np.maximum(nrej, nsat.max(1))
            rejk |= rk
            for i, j in zip(*np.nonzero(feas)):
                lam = pick(Cn[i, j], UP[i, j])
                same, opp = heldout(V1, E1, V2, E2, i, lam, s, d, cl)
                isfull = same >= NEED and min(opp) >= NEED
                full[i] |= isfull
                tweak[i] |= (same == len(d['PH'])) and min(opp) >= 1
                if same >= NEED:
                    best = max(best, min(opp))
                if want_rows:
                    rows.append(dict(tier=name, row=int(i), s=int(s), lam=float(lam), lo=float(Cn[i, j]), up=float(UP[i, j]),
                                     ph_same=same, h_opp=opp, full=bool(isfull)))
            if name != 'PZ/all' or True:
                _, _, feo, _, _ = solve_sign(r, e, und, sg2, s, pos, cls, True)
                opt_any |= feo.any(1)
        und_rows = np.nonzero(opt_any & ~feas_any)[0]
        out[name] = dict(ttrain=int(feas_any.sum()), optimistic=int(opt_any.sum()), undecided=int(len(und_rows)),
                         tweak=int(tweak.sum()), full=int(full.sum()), best_min_heldout=int(best),
                         nrej_hist=[int((nrej == q).sum()) for q in range(-1, len(cl) + 1)],
                         rejected=[int(x) for x in rejk.sum(0)], classes=list(cl))
        out[name + '/rows_feas'] = np.nonzero(feas_any)[0]
        out[name + '/rows_und'] = und_rows
    out['und_share'] = float(und.mean())
    return out, rows


def shuffle_test(V1, E1, V2, E2, groups, ALLC, nperm, seed0, gidx):
    """-> bool arrays (nperm,) for 'a T-train node exists' and 'a full survivor exists' under PA/all."""
    r, e, und, sg2 = ratio(V1, E1, V2, E2)
    tt = np.zeros(nperm, dtype=bool)
    fl = np.zeros(nperm, dtype=bool)
    g = np.asarray(groups)
    for q in range(nperm):
        perm = np.random.Generator(np.random.PCG64(seed0 + q)).permutation(len(g))
        d = gidx(g[perm])
        pos = np.concatenate((d['P'], d['PX']))
        cls = [d['C%d' % k] for k in ALLC]
        for s in (1, -1):
            Cn, UP, feas, _, _ = solve_sign(r, e, und, sg2, s, pos, cls, False)
            if feas.any():
                tt[q] = True
                for i, j in zip(*np.nonzero(feas)):
                    same, opp = heldout(V1, E1, V2, E2, i, pick(Cn[i, j], UP[i, j]), s, d, ALLC)
                    if same >= NEED and min(opp) >= NEED:
                        fl[q] = True
                        break
    return tt, fl
