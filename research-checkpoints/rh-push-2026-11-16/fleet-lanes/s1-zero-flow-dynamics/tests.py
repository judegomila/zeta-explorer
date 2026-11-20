"""Tests (1)-(4) on one ordinate list.
Usage: tests.py LIST.npy KIND OUT.json [NFULLMAX]
KIND: zeta | dir (conductor 5, odd: chi, chibar, dh, alt) ; for a heat window list use zeta.
(1) Q+1 = <g D> + 1 and V in height windows;  (2) R_eff = g^2 B/2 over close pairs (normalised gap < 0.2);
(3) beta(N, f) = running sup of B_p along the backward Dyson flow of the first N ordinates until g_min = f g_min(0);
(4) first collision time t_c(N) of the backward Dyson flow of the first N ordinates.
Full N-body flow for N <= NFULLMAX; for larger N the flow of a window of 2001 ordinates around each candidate pair."""
import sys, math, json, numpy as np
import zl

def unfold(g, kind):
    if kind == 'zeta': return zl.theta(g) / math.pi, np.log(g / (2 * math.pi)) / (2 * math.pi)
    import gen_dir
    return gen_dir.vartheta(g) / math.pi, np.log(5 * g / (2 * math.pi)) / (2 * math.pi)

def windows(g, nmin=900):
    """height windows: geometric in the index, factor ~3.16, starting at 1000 zeros."""
    n = len(g); e = [0]; k = 1000
    while k < n: e.append(k); k = int(k * 10 ** 0.5)
    e.append(n)
    return [(a, b) for a, b in zip(e[:-1], e[1:]) if b - a >= nmin]

def local_flow(g, i, half=1000, lo=0, hi=None, **kw):
    hi = len(g) if hi is None else hi
    a = max(lo, i - half); b = min(hi, i + half + 2)
    return zl.backward_flow(g[a:b], **kw), a

if __name__ == '__main__':
    f = sys.argv[1]; kind = sys.argv[2]; out = sys.argv[3]; NFULL = int(float(sys.argv[4])) if len(sys.argv) > 4 else 20000
    g = np.load(f); n = len(g)
    x, rho = unfold(g, kind)
    res = dict(file=f, kind=kind, n=n, Tmin=float(g[0]), Tmax=float(g[-1]))
    zl.log('list', f, 'n', n, 'range', g[0], g[-1])
    # ---------------- pair fields for the whole list (unfolded with the full-count density), computed once
    J = 200
    gu, Bu = zl.pair_fields(x, J)
    xa = x[0]; xspan = lambda a, b: float(x[b - 1] - x[a])
    spans = {(a, b): xspan(a, b) for a, b in windows(g)}
    del x
    # ---------------- (1), (2): window statistics
    W = []
    for a, b in windows(g):
        lo = max(a, J) - J; hi = min(b - 1, n - 1 - J) - J
        s = zl.qstats_from(gu[lo:hi], Bu[lo:hi])
        s.update(a=a, b=b, Tmed=float(np.median(g[a:b])), Tlo=float(g[a]), Thi=float(g[b - 1]),
                 expect_all=spans[(a, b)], foff=float(1 - (b - 1 - a) / spans[(a, b)]))
        s['L'] = math.log((5 if kind == 'dir' else 1) * s['Tmed'] / (2 * math.pi))
        W.append(s)
        zl.log('win [%d,%d) T~%.3g L=%.2f foff=%.4f Q+1=%.4f+-%.4f V=%.4f P(<.05,.1,.2)=%.5f %.5f %.5f close %d closing %d Rmax %.3f' % (
            a, b, s['Tmed'], s['L'], s['foff'], s['Q'] + 1, s['Qerr'], s['V'], s['P'][2], s['P'][3], s['P'][4], s['nclose'], s['nclosing'], s['Rclose_q'][-1] if s['Rclose_q'] else -1))
    res['windows'] = W
    json.dump(res, open(out, 'w'))
    # ---------------- raw pair fields
    idx = np.arange(J, J + len(gu))                    # pair (idx, idx+1)
    graw = np.diff(g)
    cumB = Bu; del Bu
    cumB *= rho[idx]; cumB *= rho[idx]; del idx, gu
    np.maximum.accumulate(cumB, out=cumB)
    # ---------------- (3), (4): grids
    grid = [50, 100, 200, 500]
    k = 1000
    while k < n: grid += [k, 2 * k, 5 * k]; k *= 10
    grid = [N for N in grid if N < n] + [n]
    rows = []
    for N in grid:
        r = dict(N=N, T=float(g[N - 1]))
        gm_i = int(graw[:N - 1].argmin()); gm = float(graw[gm_i])
        r.update(gmin=gm, gmin_index=gm_i, smin=float(gm * rho[gm_i]), tc_pair=gm * gm / 8)
        if N <= NFULL:
            sn = zl.backward_flow(g[:N])
            r['full'] = {str(k_): v for k_, v in sn.items()}
            r['tc_full'] = sn.get('tc'); r['beta_full'] = {str(fr): sn[fr]['beta'] for fr in (0.5, 0.25, 0.1, 0.05) if fr in sn}
            r['prod_full'] = {str(fr): sn[fr]['prod'] for fr in (0.5, 0.25, 0.1, 0.05) if fr in sn}
        if N >= 1000:
            # first collision of the first N ordinates: the three smallest gaps, each flowed in a window clipped at N
            top = np.argpartition(graw[:N - 1], 3)[:3]; best = None
            for i in top:
                sn, a = local_flow(g, int(i), hi=N, fracs=())
                if 'tc' in sn and (best is None or sn['tc'] < best[0]): best = (sn['tc'], sn['tc_index'] + a)
            if best: r['tc_local'] = float(best[0]); r['tc_local_index'] = int(best[1])
            sn, a = local_flow(g, gm_i, hi=N, want_tc=False)
            stat = float(cumB[min(N - 2, len(cumB) + J - 1) - J]) if N - 2 >= J else float('nan')
            r['beta_static'] = stat
            r['beta_local'] = {str(fr): max(sn[fr]['beta'], stat) for fr in (0.5, 0.25, 0.1, 0.05) if fr in sn}
            r['prod_local'] = {str(fr): sn[fr]['prod'] for fr in (0.5, 0.25, 0.1, 0.05) if fr in sn}
        rows.append(r)
        zl.log('N=%d T=%.4g gmin=%.5g smin=%.5f tc_pair=%.4g tc_full=%s tc_local=%s beta_full(.5)=%s beta_local(.5)=%s prod(.05)=%s' % (
            N, r['T'], gm, r['smin'], r['tc_pair'], r.get('tc_full'), r.get('tc_local'), r.get('beta_full', {}).get('0.5'), r.get('beta_local', {}).get('0.5'),
            (r.get('prod_full') or r.get('prod_local') or {}).get('0.05')))
    res['grid'] = rows
    json.dump(res, open(out, 'w'))
