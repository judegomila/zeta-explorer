"""Static statistics of ordinate lists (tests 1, 2 and 3b).
Usage: zstats.py OUT.json SPEC...   SPEC = name:kind:path[:key]
 kinds: odl (Odlyzko text, first zeros), blk (b-dyson block npz: delta, x, T0), lz (lzeros npz, key = object name), heat (rsref npz with tau)
For every list: t (ordinates), x (unfolded with the smooth counting function of the full zero set of the parent L-function), q (conductor).
"""
import sys, math, json, numpy as np, mpmath as mp
import rmt

def moving_mean(g, W=2001):
    c = np.concatenate([[0.0], np.cumsum(g)])
    n = len(g); h = W // 2
    lo = np.clip(np.arange(n) - h, 0, n); hi = np.clip(np.arange(n) + h + 1, 0, n)
    return (c[hi] - c[lo]) / (hi - lo)

def theta_zeta(t):
    t = np.asarray(t, dtype=np.float64)
    return 0.5 * t * np.log(t / (2 * math.pi)) - 0.5 * t - math.pi / 8 + 1 / (48 * t) + 7 / (5760 * t ** 3)

def load(spec):
    p = spec.split(':'); name, kind, path = p[0], p[1], p[2]
    if kind == 'odl':
        t = np.loadtxt(path); x = theta_zeta(t) / math.pi + 1; q = 1; T0 = 0.0; d = t
    elif kind in ('blk', 'heat'):
        z = np.load(path); T0 = float(z['T0']); d = z['delta']; x = z['x']; t = T0 + d; q = 1
    elif kind == 'lz':
        z = np.load(path); t = z['t_' + p[3]]; x = z['x_' + p[3]]; q = 5; T0 = 0.0; d = t
        m = t >= float(p[4]) if len(p) > 4 else np.ones(len(t), bool)
        t = t[m]; x = x[m]; d = d[m]
    return dict(name=name, kind=kind, t=t, x=x, q=q, T0=T0, d=d)

_BK = {}
def bk(q):
    if q not in _BK: _BK[q] = rmt.BK(q)
    return _BK[q]

def smallgap(t, x, q, s0=0.2, label=''):
    g = np.diff(x)
    n = len(g)
    ngap = int((g < s0).sum())
    npair = ngap + int(((x[2:] - x[:-2]) < s0).sum())
    # predictions summed over height bins
    L = np.log(q * t[:-1] / (2 * math.pi))
    edges = np.linspace(L.min(), L.max() + 1e-9, 41)
    cnt, _ = np.histogram(L, edges); mid = 0.5 * (edges[1:] + edges[:-1])
    lam = rmt.LAMBDA(q); lam1 = rmt.LAMBDA(1)
    Fg = rmt.gap_cdf(s0); Pg = rmt.pair_gue(s0)
    pred = dict(gue_gap=n * Fg, gue_pair=n * Pg, cue_neff_gap=0.0, cue_neff_pair=0.0, bk_pair=0.0, cue_neff_gap_zetaLambda=0.0)
    for c, Lm in zip(cnt, mid):
        if c == 0: continue
        Ne = Lm / math.sqrt(12 * lam)
        pred['cue_neff_gap'] += c * rmt.gap_cdf(s0, Ne); pred['cue_neff_pair'] += c * rmt.pair_cue(s0, Ne)
        pred['bk_pair'] += c * bk(q).pair(s0, Lm)
        pred['cue_neff_gap_zetaLambda'] += c * rmt.gap_cdf(s0, Lm / math.sqrt(12 * lam1))
    se = 1 / math.sqrt(max(ngap, 1))
    return dict(n_gaps=n, mean_gap=float(g.mean()), n_gap_lt=ngap, n_pair_lt=npair, s0=s0, pred=pred,
                ratio_gap_gue=ngap / pred['gue_gap'], ratio_gap_cue_neff=ngap / pred['cue_neff_gap'], ratio_gap_cue_neff_zetaLambda=ngap / pred['cue_neff_gap_zetaLambda'],
                ratio_pair_gue=npair / pred['gue_pair'], ratio_pair_bk=npair / pred['bk_pair'], rel_se=se,
                L_range=[float(L.min()), float(L.max())], lambda_q=lam, min_gap=float(g.min()))

def gap_profile(t, x, q):
    """counts of adjacent gaps below s for several s, against GUE and CUE_Neff at the median height; Hill estimate of the
    small-gap exponent k in P(gap < s) ~ s^k (GUE: k -> 3; simple real zeros of a function whose zeros can leave the line: k = 2)"""
    g = np.diff(x); n = len(g)
    Lm = math.log(q * float(np.median(t)) / (2 * math.pi)); Ne = Lm / math.sqrt(12 * rmt.LAMBDA(q))
    rows = []
    for s in (0.0125, 0.025, 0.05, 0.1, 0.2, 0.3):
        c = int((g < s).sum())
        rows.append(dict(s=s, count=c, gue=n * rmt.gap_cdf(s), cue_neff=n * rmt.gap_cdf(s, Ne)))
    hill = {}
    for s0 in (0.1, 0.2):
        sm = g[g < s0]
        k = len(sm) / float(np.sum(np.log(s0 / sm))) if len(sm) > 5 else float('nan')
        # reference value of the same estimator for the GUE gap law: E[log(s0/s) | s < s0]
        a0 = 0.01; ss = np.linspace(a0, s0, 200); F = np.array([rmt.gap_cdf(v) for v in ss]); F0 = math.pi ** 2 * a0 ** 3 / 9
        dF = np.gradient(F, ss); ref = float(F[-1] / (np.trapezoid(dF * np.log(s0 / ss), ss) + F0 * (math.log(s0 / a0) + 1 / 3)))
        hill[str(s0)] = dict(k=k, se=k / math.sqrt(max(len(sm), 1)), n=int(len(sm)), k_gue=ref)
    return dict(median_L=Lm, N_eff=Ne, rows=rows, hill=hill)

def wigner_sample(n, rng):
    # GUE Wigner surmise p(s) = (32/pi^2) s^2 exp(-4 s^2/pi): s = sqrt(pi/4 * chi2_3 / 2)... (s^2 * 4/pi ~ Gamma(3/2, 1))
    return np.sqrt(math.pi / 4 * rng.gamma(1.5, 1.0, n))

def runmin_fit(g):
    m = np.minimum.accumulate(g)
    Ns = np.unique(np.round(np.exp(np.linspace(math.log(50), math.log(len(g)), 200))).astype(int))
    y = np.log(m[Ns - 1]); xx = np.log(Ns)
    p = np.polyfit(xx, y, 1)
    return float(p[0]), float(math.exp(p[1]))

def runmin(x, rng, nsim=200):
    g = np.diff(x)
    e, A = runmin_fit(g)
    nsim = max(16, min(nsim, int(3e8 // len(g))))
    sims = [runmin_fit(wigner_sample(len(g), rng))[0] for _ in range(nsim)]
    return dict(exponent=e, prefactor=A, null_mean=float(np.mean(sims)), null_sd=float(np.std(sims)), null_q05_q95=[float(np.quantile(sims, 0.05)), float(np.quantile(sims, 0.95))], n=len(g))

def r1stat(x, Ls=(100, 200, 300, 495.78, 700, 1000)):
    out = []
    for Lb in Ls:
        nb = int((x[-1] - x[0]) // Lb)
        if nb < 30: continue
        edges = x[0] + Lb * np.arange(nb + 1)
        c = np.diff(np.searchsorted(x, edges)).astype(float)
        D = c - c.mean()
        r_raw = float((D[1:] * D[:-1]).sum() / (D * D).sum())
        Dd = c - moving_mean(c, 101) * (1.0) if nb > 300 else D
        Dd = Dd - Dd.mean()
        r_det = float((Dd[1:] * Dd[:-1]).sum() / (Dd * Dd).sum())
        out.append(dict(L=Lb, nboxes=nb, mean_count=float(c.mean()), var=float(D.var()), var_detrended=float(Dd.var()), r1_raw=r_raw, r1_detrended=r_det, se=1 / math.sqrt(nb), r1_gue=rmt.r1_gue(Lb), numvar_gue=rmt.numvar_gue(Lb)))
    return out

RS = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 2048, 4096, 8192, 10000]
def s2stat(x):
    g = np.diff(x); u = g / moving_mean(g, 2001)
    var = float(u.var()); out = []
    for r in RS:
        if r * 20 > len(u): break
        d = u[r:] - u[:-r]
        s2 = float((d * d).mean())
        out.append([r, s2, 1 - s2 / (2 * var)])
    # full autocorrelation by FFT up to lag 10000 (for the band statistics)
    v = u - u.mean(); n = len(v); nf = 1 << int(math.ceil(math.log2(2 * n)))
    F = np.fft.rfft(v, nf); ac = np.fft.irfft(F * np.conj(F), nf)[:10001] / (np.arange(n, n - 10001, -1) * var) if n > 20002 else None
    band = None
    if ac is not None:
        band = dict(rms_C_100_10000=float(np.sqrt((ac[100:] ** 2).mean())), max_abs_C_10_10000=float(np.abs(ac[10:]).max()), argmax=int(np.abs(ac[10:]).argmax() + 10), noise_1_over_sqrt_n=1 / math.sqrt(n),
                    C_1_to_8=[float(v_) for v_ in ac[1:9]])
    return dict(var_unfolded_gap=var, table=out, band=band)

def chat(t, d, T0, nmax=40):
    """c^(n) = -sqrt(n) * sum_gamma w(gamma) exp(i gamma log n) / ((1/2pi) int w), w = cos^4 window over the list"""
    a = d[0]; b = d[-1]
    w = np.cos(math.pi * ((d - a) / (b - a) - 0.5)) ** 4
    norm = (3.0 / 8.0) * (b - a) / (2 * math.pi)
    out = {}
    mp.mp.dps = 40
    for n in range(2, nmax + 1):
        ln = math.log(n)
        ph0 = float(mp.fmod(mp.mpf(T0) * mp.log(n), 2 * mp.pi)) if T0 else 0.0
        s = np.sum(w * np.exp(1j * (d * ln))) * complex(math.cos(ph0), math.sin(ph0))
        c = -math.sqrt(n) * s / norm
        out[n] = [float(c.real), float(c.imag)]
    return out

def analyse(L, rng, do_local=False):
    t, x, q = L['t'], L['x'], L['q']
    res = dict(name=L['name'], n=int(len(t)), t_range=[float(t[0]), float(t[-1])], q=q, x_span=float(x[-1] - x[0]),
               count_over_expected=float((len(t) - 1) / (x[-1] - x[0])))
    import os
    if os.environ.get('ZS_ONLY') == 'profile':
        g = np.diff(x); xl = np.concatenate([[0.0], np.cumsum(g / moving_mean(g, 2001))])
        res['gap_profile_full'] = gap_profile(t, x, q); res['gap_profile_local'] = gap_profile(t, xl, q)
        return res
    res['smallgap_full_unfolding'] = smallgap(t, x, q)
    g = np.diff(x); xl = np.concatenate([[0.0], np.cumsum(g / moving_mean(g, 2001))])
    res['smallgap_local_unfolding'] = smallgap(t, xl, q)
    res['gap_profile_full'] = gap_profile(t, x, q); res['gap_profile_local'] = gap_profile(t, xl, q)
    res['runmin_full'] = runmin(x, rng); res['runmin_local'] = runmin(xl, rng)
    res['r1_full'] = r1stat(x); res['r1_local'] = r1stat(xl)
    res['s2'] = s2stat(x)
    res['chat'] = chat(t, L['d'], L['T0'])
    return res

if __name__ == '__main__':
    out = sys.argv[1]; rng = np.random.default_rng(20261119); allres = {}
    for spec in sys.argv[2:]:
        L = load(spec)
        r = analyse(L, rng); allres[L['name']] = r
        if 'smallgap_full_unfolding' not in r:
            gp = r['gap_profile_local']
            print(L['name'] + ' local-unfolded gap counts obs/GUE/CUE_Neff at s=0.0125..0.3: ' + ' '.join('%d/%.1f/%.1f' % (a['count'], a['gue'], a['cue_neff']) for a in gp['rows']) + ' | Hill exponent s<0.2: %.3f+-%.3f (GUE law %.3f), s<0.1: %.3f+-%.3f' % (gp['hill']['0.2']['k'], gp['hill']['0.2']['se'], gp['hill']['0.2']['k_gue'], gp['hill']['0.1']['k'], gp['hill']['0.1']['se']), flush=True)
            json.dump(allres, open(out, 'w')); continue
        sg = r['smallgap_full_unfolding']; sl = r['smallgap_local_unfolding']
        print('%s n=%d count/expected=%.5f | gaps<0.2: %d  /GUE %.4f /CUE_Neff %.4f (+-%.4f) [local unf: /GUE %.4f /CUE_Neff %.4f] pairs/BK %.4f | runmin exp %.4f (null %.3f+-%.3f) | r1(L=495.78) %s | C(1)=%.4f | c^(2)=%.4f%+.4fi c^(4)=%.4f c^(6)=%.4f%+.4fi' % (
            L['name'], r['n'], r['count_over_expected'], sg['n_gap_lt'], sg['ratio_gap_gue'], sg['ratio_gap_cue_neff'], sg['rel_se'], sl['ratio_gap_gue'], sl['ratio_gap_cue_neff'], sg['ratio_pair_bk'],
            r['runmin_full']['exponent'], r['runmin_full']['null_mean'], r['runmin_full']['null_sd'],
            ['%.4f/%.4f' % (a['r1_raw'], a['r1_detrended']) for a in r['r1_full'] if abs(a['L'] - 495.78) < 1],
            r['s2']['table'][0][2], r['chat'][2][0], r['chat'][2][1], r['chat'][4][0], r['chat'][6][0], r['chat'][6][1]), flush=True)
        gp = r['gap_profile_local']
        print('    local-unfolded gap counts obs/GUE at s=0.0125..0.3: ' + ' '.join('%d/%.1f' % (a['count'], a['gue']) for a in gp['rows']) + ' | Hill exponent s<0.2: %.3f+-%.3f (GUE law %.3f), full unfolding %.3f' % (gp['hill']['0.2']['k'], gp['hill']['0.2']['se'], gp['hill']['0.2']['k_gue'], r['gap_profile_full']['hill']['0.2']['k']), flush=True)
        json.dump(allres, open(out, 'w'))
