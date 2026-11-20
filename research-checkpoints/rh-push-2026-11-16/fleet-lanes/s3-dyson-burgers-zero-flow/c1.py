"""Combination 1: Theta-trap of the minimal pair on windows of N consecutive zeros.
  c1.py premise                      N = 1e4 first zeta zeros: g_min^2/6, Theta(0), full flow t_c, long-double re-check
  c1.py static NAME [nmax] [K]       Theta of every adjacent pair, window statistics for all N, worst windows
  c1.py flow NAME N [start] [inner]  backward flow on a window of N zeros (inner > 0: only the inner block moves, rest = frozen linearised field)
  c1.py tables                       full zero sets to height 2000 (DH, HEAT, TNR, EA): Theta with the off-line pairs in E, flow with complex particles
  c1.py winexact NAME N nmax         Theta with E restricted to the window (definition check for small N)
"""
import sys, json, math, os, numpy as np
import zf
from zf import xp, asnp, log
OUT = os.path.join(zf.HERE, 'out')
NS = [2, 3, 5, 10, 20, 30, 50, 70, 100, 150, 200, 300, 500, 1000, 2000, 5000, 10000, 100000, 1000000]

def unf(x, T0, q): return np.diff(x) * zf.rho(T0 + x[:-1], q)

def tnr_extra_E(a, b, q=3.0, c=2.2):
    """E contribution of the T-NR local-factor zeros (2k+1) pi/log q +- i arccosh(c/2)/log q, all k (closed form by the cotangent series)"""
    D = 2 * math.pi / math.log(q); w0 = math.pi / math.log(q) + 1j * math.acosh(c / 2) / math.log(q)
    cot = lambda z: 1.0 / np.tan(z)
    return 2 * ((math.pi / D) * (cot(math.pi * (a - w0) / D) - cot(math.pi * (b - w0) / D)) / (b - a)).real

def static(name, nmax=None, K=400, tag=None, x=None, T0=0.0, q=1, extra=None, tnr=False):
    if x is None: x, T0, q = zf.load(name, nmax)
    n = len(x); log(name, 'zeros', n, 'planned host arrays %.1f GB' % (n * 8 * 7 / 1e9))
    g, Th = zf.pair_theta(x, K, extra=extra)
    ADD = np.zeros(n - 1) if tnr else None
    if tnr:
        for c0 in range(0, n - 1, 10 ** 7): ADD[c0:c0 + 10 ** 7] = 0.5 * g[c0:c0 + 10 ** 7] ** 2 * tnr_extra_E(T0 + x[c0:c0 + 10 ** 7 + 1][:-1], T0 + x[c0 + 1:c0 + 10 ** 7 + 1])
        Th += ADD
    if False:
        for c0 in range(0, n - 1, 10 ** 7): Th[c0:c0 + 10 ** 7] += 0.5 * g[c0:c0 + 10 ** 7] ** 2 * tnr_extra_E(T0 + x[c0:c0 + 10 ** 7 + 1][:-1], T0 + x[c0 + 1:c0 + 10 ** 7 + 1])
    s = unf(x, T0, q)
    res = dict(name=name, n=n, K=K, height=[float(T0 + x[0]), float(T0 + x[-1])], backend='gpu' if zf.GPU else 'cpu')
    res['frac_pairs_Theta_gt'] = {str(t): float((Th > t).mean()) for t in (0.25, 0.443, 0.5, 1.0)}
    res['min_Theta'] = float(Th.min()); res['n_negative_Theta'] = int((Th < 0).sum())
    sm = s < 0.05
    res['Theta_over_s2_small_gaps'] = dict(n=int(sm.sum()), median=float(np.median(Th[sm] / s[sm] ** 2)) if sm.any() else None,
                                           q05=float(np.quantile(Th[sm] / s[sm] ** 2, 0.05)) if sm.any() else None,
                                           q95=float(np.quantile(Th[sm] / s[sm] ** 2, 0.95)) if sm.any() else None, note='lattice background value pi^2/6 - 5/4 + ... ; uniform density gives (pi^2/6) s^2 minus the two nearest terms')
    i = int(np.argmin(g)); res['global_min_pair'] = dict(i=i, at=float(T0 + x[i]), g=float(g[i]), s=float(s[i]), Theta=float(Th[i]), g2_over_6=float(g[i] ** 2 / 6), g2_over_8=float(g[i] ** 2 / 8), pair_law_tc=float(g[i] ** 2 / (8 * (1 - Th[i]))))
    ws = zf.window_stats(g, Th, [N for N in NS if N <= n]); res['windows'] = ws
    # exact window definition (E restricted to the N zeros of the window) for N >= 100; Theta_K above is an upper bound for it
    from scipy.ndimage import minimum_filter1d, maximum_filter1d
    def minpairs(N):
        w = N - 1
        m = minimum_filter1d(g, size=w, mode='nearest'); v0 = w // 2; v1 = len(g) - 1 - (w - 1 - w // 2); m[:v0] = -np.inf; m[v1 + 1:] = -np.inf
        M = maximum_filter1d(m, size=w, mode='constant', cval=-np.inf, origin=(0 if w % 2 else -1))
        return np.nonzero((M == g) & (Th > 0.25))[0]
    for r in ws:
        if r['N'] < 100 or r['fail_0.25'] == 0: continue
        cand = minpairs(r['N'])
        if len(cand) > 400000: r['exact'] = 'skipped (%d candidate pairs)' % len(cand); continue
        f1, mx = exact_for_pairs(x, g, cand, r['N'], 0.25, ADD); f2, _ = exact_for_pairs(x, g, cand, r['N'], 0.443, ADD)
        r['exact_fail_0.25'] = f1; r['exact_fail_0.443'] = f2; r['exact_maxTheta'] = mx
    for t in (0.25, 0.443):
        cand = minpairs(100) if len(g) >= 100 else np.array([], int)
        cand = cand[Th[cand] > t]
        sp = sorted(((zf.span_of(g, int(c)), int(c)) for c in cand), reverse=True)
        best = 99; rec = None
        for spn, c in sp:
            if spn <= best: break
            for N in range(spn, best, -1):
                f, mx = exact_for_pairs(x, g, [c], N, t, ADD)
                if f > 0:
                    best = N; rec = dict(Nstar=N, i=c, at=float(T0 + x[c]), s=float(s[c]), Theta_K=float(Th[c]), Theta_window=mx, span=spn,
                                         s_left=float(s[c - 1]) if c > 0 else None, s_right=float(s[c + 1]) if c + 1 < len(s) else None); break
        res['Nstar_%g' % t] = rec or dict(Nstar=None, note='no window of N >= 100 zeros fails')
    # triple clusters: pairs with Theta > 1 (closing sign reversed) among close pairs
    cl = np.nonzero((Th > 1) & (s < 0.2))[0]
    res['close_pairs_Theta_gt_1'] = [dict(i=int(c), at=float(T0 + x[c]), s=float(s[c]), Theta=float(Th[c])) for c in cl[:20]]
    res['n_close_pairs_s_lt_0.2'] = int((s < 0.2).sum())
    json.dump(res, open(os.path.join(OUT, 'c1_static_%s.json' % (tag or name)), 'w'), indent=1)
    log('saved', name, 'Nstar', {k: v for k, v in res.items() if k.startswith('Nstar')})
    for r in ws: log(r)
    return res, g, Th, s

def exact_for_pairs(x, g, cand, N, thr, add=None):
    """windows of N zeros in which pair i is the minimal pair, E restricted to the window: number with Theta > thr, and the max"""
    n = len(g); w = N - 1; nf = 0; mx = 0.0
    for i in cand:
        i = int(i); L = i - 1
        while L >= 0 and L >= i - w and g[L] >= g[i]: L -= 1
        R = i + 1
        while R < n and R <= i + w and g[R] >= g[i]: R += 1
        s_lo = max(L + 1, i - w + 1, 0); s_hi = min(i, R - w, n - w)
        if s_hi < s_lo: continue
        xx = x[s_lo:s_hi + w + 1]
        with np.errstate(all='ignore'): T = 1.0 / ((x[i] - xx) * (x[i + 1] - xx))
        T[i - s_lo] = 0.0; T[i + 1 - s_lo] = 0.0
        c = np.concatenate([[0.0], np.cumsum(T)]); k = np.arange(s_hi - s_lo + 1)
        Thw = 0.5 * g[i] ** 2 * (c[k + w + 1] - c[k]) + (add[i] if add is not None else 0.0); nf += int((Thw > thr).sum()); mx = max(mx, float(Thw.max()))
    return nf, mx

def flow(name, N, start=0, inner=0, cfl=0.05, tag=None):
    x, T0, q = zf.load(name, None if start else N)
    x = x[start:start + N]
    B_ = xp
    res = dict(name=name, N=N, start=start, inner=inner, backend='gpu' if zf.GPU else 'cpu', height=[float(T0 + x[0]), float(T0 + x[-1])])
    i = int(np.argmin(np.diff(x)))
    if inner and inner < N:
        lo = max(0, min(N - inner, i - inner // 2)); sel = np.zeros(N, bool); sel[lo:lo + inner] = True
        xin = B_.asarray(x[sel]); xout = B_.asarray(x[~sel])
        log('frozen far field: inner', inner, 'outer', N - inner, 'planned chunk 0.24 GB')
        F0, F1 = zf.rect_field(xin, xout, B_)
        r = zf.backward_flow(xin, B_, cfl=cfl, ext=(F0, F1, xin.copy()))
    else:
        log('full pairwise flow N', N, 'pair terms per force %.2e' % (N * N))
        r = zf.backward_flow(B_.asarray(x), B_, cfl=cfl)
    g0 = r['g0']
    res.update({k: v for k, v in r.items() if k not in ('X', 'rec')}); res['rec'] = r['rec'][-5:]
    res.update(g2_over_6=g0 * g0 / 6, g2_over_8=g0 * g0 / 8, pair_law=g0 * g0 / (8 * (1 - r['Theta0'])), tc_over_g2_8=r['tc'] / (g0 * g0 / 8), A1_holds=bool(r['tc'] <= g0 * g0 / 6))
    # long-double re-check on a local window of 2001 ordinates around the pair (numpy, CPU)
    lo = max(0, i - 1000); xl = np.asarray(x[lo:lo + 2001], dtype=np.longdouble)
    rl = zf.backward_flow(xl, np, cfl=cfl / 2)
    res['longdouble_local'] = dict(eps=float(np.finfo(np.longdouble).eps), tc=rl['tc'], Theta0=rl['Theta0'], Theta_max=rl['Theta_max'], steps=rl['steps'], rel_diff=rl['tc'] / r['tc'] - 1)
    json.dump(res, open(os.path.join(OUT, 'c1_flow_%s.json' % (tag or '%s_%d_%d_%d' % (name, N, start, inner))), 'w'), indent=1)
    log({k: v for k, v in res.items() if k != 'rec'})
    return res

def premise():
    r = flow('zeta8', 10000, tag='premise_1e4')
    log('PREMISE N=1e4: g_min^2/6 = %.4e (source 2.369e-4); Theta(0) = %.4f (source 0.0017); t_c = %.5e; t_c <= g^2/6: %s' % (r['g2_over_6'], r['Theta0'], r['tc'], r['A1_holds']))

def winexact(name, N, nmax):
    """E restricted to the N zeros of the window (the definition of the source); all windows of the first nmax zeros"""
    x, T0, q = zf.load(name, nmax); n = len(x); bs = max(1, int(4e7 // N)); cnt = 0; fail = {0.25: 0, 0.443: 0}; mx = 0.0
    for s in range(0, n - N + 1, bs):
        idx = np.arange(s, min(n - N + 1, s + bs))[:, None] + np.arange(N)[None, :]
        W = xp.asarray(x[idx]); G = W[:, 1:] - W[:, :-1]; k = G.argmin(1); r = xp.arange(len(W))
        a = W[r, k]; b = W[r, k + 1]; t = (a[:, None] - W) * (b[:, None] - W); t[r, k] = xp.inf; t[r, k + 1] = xp.inf
        Th = 0.5 * (b - a) ** 2 * (1.0 / t).sum(1); cnt += len(W); mx = max(mx, float(Th.max()))
        for th in fail: fail[th] += int((Th > th).sum())
    out = dict(name=name, N=N, windows=cnt, fail={str(k): v for k, v in fail.items()}, maxTheta=mx)
    log(out); return out

def tables():
    res = {}
    zon, _ = zf.table('ZETA')
    sets = {}
    for nm in ('DH', 'HEAT--0.1', 'HEAT--0.5', 'TNR'):
        on, off = zf.table(nm); sets[nm] = (on, off, 5 if nm == 'DH' else 1)
    sets['ZETA'] = (zon, [], 1)
    for a in (0.25,): sets['EA-1_4'] = (np.array([]), [(a, float(g)) for g in zon], 1)
    for nm, (on, off, q) in sets.items():
        r = dict(online=len(on), offline_pairs=len(off))
        offg = np.array(sorted(g for b, g in off)) if off else np.array([])
        if len(on) < 3:
            # no real pair: formal Theta of a conjugate pair (g = 2 i a): Theta = -2 a^2 sum_j 2/(D_j^2 + 4 a^2) < 0
            a = off[0][0]; gam = np.array([g for b, g in off]); D = gam[:, None] - gam[None, :]; np.fill_diagonal(D, np.inf)
            Thc = -2 * a * a * (2.0 / (D * D + 4 * a * a)).sum(1)
            r.update(note='no real zeros: no real pair, no collision under the attractive flow (conjugate pairs separate, d(b^2)/ds = 2 > 0); formal Theta of each conjugate pair is negative',
                     formal_Theta_range=[float(Thc.min()), float(Thc.max())]); res[nm] = r; continue
        extra = np.array([complex(g, s * b) for b, g in off for s in (1, -1)]) if off else None
        g, Th0 = zf.pair_theta(on, K=len(on))               # on-line particles only
        g, Th = zf.pair_theta(on, K=len(on), extra=extra)   # full set
        s = g * zf.rho(np.maximum(on[:-1], 3.0), q)
        mid = 0.5 * (on[1:] + on[:-1])
        dist = np.abs(mid[:, None] - offg[None, :]).min(1) * zf.rho(np.maximum(mid, 3.0), q) if len(offg) else np.full(len(mid), np.inf)
        ws = zf.window_stats(g, Th, [N for N in zf_NS_small if N <= len(on)])
        r['windows_full_set'] = ws
        r['windows_online_only'] = zf.window_stats(g, Th0, [N for N in zf_NS_small if N <= len(on)])
        r['max_abs_Theta_shift_from_offline'] = float(np.abs(Th - Th0).max())
        far = dist > 100
        r['pairs_farther_than_100_spacings_from_offline'] = int(far.sum()); r['max_distance_to_offline_in_spacings'] = float(dist[np.isfinite(dist)].max()) if np.isfinite(dist).any() else None
        r['first_offline_height'] = float(offg[0]) if len(offg) else None
        r['n_negative_Theta'] = int((Th < 0).sum())
        # windows that end below the first off-line height (zeta-free comparison region)
        if len(offg):
            nb = int((on < offg[0]).sum()); r['online_below_first_offline'] = nb
            if nb > 3: r['windows_below_first_offline'] = zf.window_stats(g[:nb - 1], Th[:nb - 1], [N for N in (2, 3, 5, 10, 20, 30) if N <= nb])
        # flow of the full set (complex particles included), CPU
        X = zf.full_set(on, off); isr = np.abs(X.imag) == 0
        fr = zf.backward_flow(X, np, cfl=0.05, isreal=isr)
        fo = zf.backward_flow(on.copy(), np, cfl=0.05)
        r['flow_full_set'] = {k: v for k, v in fr.items() if k not in ('X', 'rec')}
        r['flow_online_only'] = {k: v for k, v in fo.items() if k not in ('X', 'rec')}
        r['flow_full_set']['tc_over_g2_8'] = fr['tc'] / (fr['g0'] ** 2 / 8); r['flow_full_set']['at'] = float(X[fr['pair0'][0]].real)
        r['flow_full_set']['dist_to_offline_spacings'] = float(np.abs(X[fr['pair0'][0]].real - offg).min() * zf.rho(X[fr['pair0'][0]].real, q)) if len(offg) else None
        res[nm] = r; log(nm, json.dumps(r)[:1500])
    json.dump(res, open(os.path.join(OUT, 'c1_tables.json'), 'w'), indent=1)

zf_NS_small = [2, 3, 5, 10, 20, 30, 50, 100, 200, 500, 1000]

if __name__ == '__main__':
    m = sys.argv[1]
    if m == 'premise': premise()
    elif m == 'static': static(sys.argv[2], int(float(sys.argv[3])) if len(sys.argv) > 3 and float(sys.argv[3]) > 0 else None, int(sys.argv[4]) if len(sys.argv) > 4 else 400)
    elif m == 'static_tnr': static(sys.argv[2], int(float(sys.argv[3])) if len(sys.argv) > 3 and float(sys.argv[3]) > 0 else None, 400, tag='tnr_' + sys.argv[2], tnr=True)
    elif m == 'static_chunks':
        xa = np.load(sys.argv[2], mmap_mode='r'); tag = sys.argv[3]; CH = 5 * 10 ** 7
        for k, c0 in enumerate(range(0, len(xa), CH)):
            static(tag + '_c%d' % k, x=np.array(xa[c0:c0 + CH + 5000]), tag=tag + '_c%d' % k); import gc; gc.collect()
    elif m == 'flow': flow(sys.argv[2], int(float(sys.argv[3])), int(float(sys.argv[4])) if len(sys.argv) > 4 else 0, int(float(sys.argv[5])) if len(sys.argv) > 5 else 0)
    elif m == 'tables': tables()
    elif m == 'winexact':
        o = [winexact(sys.argv[2], N, int(float(sys.argv[4])) or None) for N in [int(v) for v in sys.argv[3].split(',')]]
        json.dump(o, open(os.path.join(OUT, 'c1_winexact_%s.json' % sys.argv[2]), 'w'), indent=1)
