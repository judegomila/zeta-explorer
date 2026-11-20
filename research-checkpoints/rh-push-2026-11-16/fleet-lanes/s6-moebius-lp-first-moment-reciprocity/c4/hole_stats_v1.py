"""Statistics of the hole test from the arrays of hole.py.  usage: hole_stats.py in.npz out.json
Unfolded coordinate: sample index / pps (each window is sampled at step = local mean spacing / pps)."""
import sys, json, math, numpy as np
from scipy.stats import spearmanr
f = np.load(sys.argv[1], allow_pickle=True)
Z = f['Z'].astype(np.float64); U = f['U']; M2 = f['M2']; pps = int(f['pps']); npw = int(f['npw'])
T0 = float(f['T0']); q = int(f['q']); obj = str(f['obj']); thetas = [float(x) for x in f['thetas']]; ys = [int(x) for x in f['ys']]
n = len(Z); R = dict(obj=obj, T0=T0, q=q, points=n, windows17=n // npw, pps=pps, ys=ys, thetas=thetas)
u = np.arange(n) / pps
sc = np.nonzero(Z[:-1] * Z[1:] < 0)[0]
zpos = (sc + Z[sc] / (Z[sc] - Z[sc + 1])) / pps
gaps = np.diff(zpos)
# max |Z| in each gap (samples strictly inside; gaps shorter than one step get the interpolated bound 0)
absZ = np.abs(Z); csmax = np.maximum.reduceat(absZ, np.r_[sc[:-1] + 1]) if len(sc) > 1 else np.array([])
gmax = csmax[:len(gaps)] if len(gaps) else np.array([])
# positive local minima / negative local maxima of Z (Laguerre-type violations; none if all zeros near the window are real and simple)
i = np.arange(1, n - 1)
viol = i[((Z[i] > 0) & (Z[i] < Z[i - 1]) & (Z[i] < Z[i + 1])) | ((Z[i] < 0) & (Z[i] > Z[i - 1]) & (Z[i] > Z[i + 1]))]
a2 = (Z[viol - 1] - 2 * Z[viol] + Z[viol + 1]) / 2; b1 = (Z[viol + 1] - Z[viol - 1]) / 2
vertex = Z[viol] - b1 * b1 / (4 * a2)
close = vertex * Z[viol] < 0            # the interpolating parabola crosses zero: a pair of real zeros closer than one step
R['flagged_minima'] = int(len(viol)); R['flagged_close_pairs'] = int(close.sum())
viol = viol[~close]
R['laguerre_violations'] = int(len(viol)); R['violations_per_1000_spacings'] = 1000 * len(viol) / (n / pps)
R['sign_changes'] = int(len(sc)); R['zeros_with_close_pairs'] = int(len(sc) + 2 * close.sum()); R['expected_main_term'] = n / pps
R['count_minus_expected'] = R['zeros_with_close_pairs'] - n / pps
R['min_abs_Z_at_violation'] = float(absZ[viol].min()) if len(viol) else None
R['gap_mean'] = float(gaps.mean()); R['gap_max'] = float(gaps.max()); R['gap_q'] = [float(np.quantile(gaps, x)) for x in (0.5, 0.9, 0.99, 0.999, 0.9999)]
o = np.argsort(gaps)[::-1][:8]; R['top_gaps'] = [[float(gaps[j]), float(gmax[j])] for j in o]
R['max_abs_Z'] = float(absZ.max()); R['mean_Z2'] = float((Z * Z).mean())
# gap law: log max|Z| against gap length
edges = np.arange(0.5, max(4.6, gaps.max() + 0.25), 0.25); law = []
for a, b in zip(edges[:-1], edges[1:]):
    m = (gaps >= a) & (gaps < b)
    if m.sum() >= 5: law.append([float((a + b) / 2), int(m.sum()), float(np.log(gmax[m]).mean()), float(np.log(gmax[m]).min()), float(np.log(gmax[m]).max())])
R['gap_law'] = law
gv = np.zeros(len(gaps), dtype=bool)
gidx = np.searchsorted(sc, viol, side='left') - 1; gidx = gidx[(gidx >= 0) & (gidx < len(gaps))]; gv[gidx] = True
R['gaps_with_violation'] = int(gv.sum())
for tag, msk in (('gap_law_noviol', ~gv), ('gap_law_viol', gv)):
    lw = []
    for a, b in zip(edges[:-1], edges[1:]):
        m = (gaps >= a) & (gaps < b) & msk
        if m.sum() >= 3: lw.append([float((a + b) / 2), int(m.sum()), float(np.log(gmax[m]).mean()), float(np.log(gmax[m]).min()), float(np.log(gmax[m]).max())])
    R[tag] = lw
    R[tag + '_gap_max'] = float(gaps[msk].max()) if msk.any() else None
L = np.array(law)
if len(L) >= 4:
    sel = L[:, 0] >= 1.5
    if sel.sum() >= 3:
        cf = np.polyfit(L[sel, 0], L[sel, 2], 1, w=np.sqrt(L[sel, 1])); R['gap_law_fit_mean_log_maxZ'] = dict(slope=float(cf[0]), intercept=float(cf[1]))
        cf2 = np.polyfit(L[sel, 0], L[sel, 3], 1); R['gap_law_fit_min_log_maxZ'] = dict(slope=float(cf2[0]), intercept=float(cf2[1]))
# typical size for the factor comparison
R['median_abs_Z'] = float(np.median(absZ)); R['rms_Z'] = float(math.sqrt((Z * Z).mean()))
nosc = np.ones(n - 1, dtype=bool); nosc[sc] = False
def runs(mask):
    """start, length (samples) of maximal runs of True that contain no sign change of Z between consecutive samples"""
    il = np.empty(2 * n - 1, dtype=np.int8); il[0::2] = mask; il[1::2] = nosc
    d = np.diff(np.r_[0, il, 0]); s = np.nonzero(d == 1)[0]; e = np.nonzero(d == -1)[0]
    s0 = (s + 1) // 2; e0 = e // 2          # sample indices [s0, e0]
    ln = e0 - s0 + 1; ok = ln >= 1
    return s0[ok], ln[ok]
gap_of_sample = np.searchsorted(sc, np.arange(n), side='left')   # samples between sc[k-1]+1 .. sc[k] belong to gap index k-1
R['moll'] = []
for ti, th in enumerate(thetas):
    s = Z * U[:, ti]; W = Z * Z * M2[:, ti]; rec = dict(theta=th, y=ys[ti], mean_FM2=float(W.mean()), mean_ReFM=float(s.mean()), frac_ReFM_pos=float((s > 0).mean()))
    for marg in (0.0, 0.05, 0.2):
        st, ln = runs(s > marg)
        span = (ln - 1) / pps
        rec[f'cert_max_run_m{marg}'] = float(span.max()); rec[f'cert_runs_ge2_m{marg}'] = int((span >= 2).sum())
        if marg == 0.0:
            # efficiency per gap: longest certified run inside each gap / gap length
            gi = gap_of_sample[st] - 1; ok = (gi >= 0) & (gi < len(gaps))
            best = np.zeros(len(gaps)); np.maximum.at(best, gi[ok], span[ok])
            eff = []
            for a, b in ((1.0, 1.5), (1.5, 2.0), (2.0, 2.5), (2.5, 3.0), (3.0, 9.0)):
                m = (gaps >= a) & (gaps < b)
                if m.sum(): eff.append([a, b, int(m.sum()), float((best[m] / gaps[m]).mean()), float((best[m] / gaps[m]).min())])
            rec['cert_efficiency_by_gap'] = eff
            o = np.argsort(gaps)[::-1][:5]; rec['cert_on_top_gaps'] = [[float(gaps[j]), float(best[j])] for j in o]
            # is any certified run not inside a single gap (would be a false hole)?  by construction Z s > 0 forbids a sign change of Z inside
            rec['false_holes'] = int(sum(1 for a, l in zip(st, ln) if l > 1 and np.any(Z[a:a + l - 1] * Z[a + 1:a + l] < 0)))
    R['moll'].append(rec)
# window statistics
R['win'] = []
sgn = Z > 0
for w in (7, 12, 17):
    m = w * pps; nw = n // m
    Zw = Z[:nw * m].reshape(nw, m)
    # longest zero-free stretch inside the window (grid units)
    ch = (Zw[:, :-1] * Zw[:, 1:] < 0)
    hole = np.empty(nw)
    idx = np.arange(m - 1)
    for j in range(nw):
        c = idx[ch[j]]
        b = np.r_[-0.5, c + 0.5, m - 0.5] if len(c) else np.array([-0.5, m - 0.5])
        hole[j] = np.diff(b).max() / pps
    vw = np.zeros(n, dtype=bool); vw[viol] = True; hasv = vw[:nw * m].reshape(nw, m).any(1)
    rec = dict(w=w, nwin=int(nw), hole_max=float(hole.max()), hole_mean=float(hole.mean()), hole_q=[float(np.quantile(hole, x)) for x in (0.5, 0.99, 0.999)],
               windows_with_violation=int(hasv.sum()), maxZ_max=float(np.abs(Zw).max()))
    maxZ = np.abs(Zw).max(1); J0 = (Zw ** 2).mean(1)
    rec['spearman_hole_maxZ'] = float(spearmanr(hole, maxZ)[0]); rec['spearman_hole_J0'] = float(spearmanr(hole, J0)[0])
    top = hole >= np.quantile(hole, 0.99)
    rec['maxZ_median_all'] = float(np.median(maxZ)); rec['maxZ_median_top1pct_hole'] = float(np.median(maxZ[top])); rec['maxZ_min_top1pct_hole'] = float(maxZ[top].min())
    for ti, th in enumerate(thetas):
        J = (Z * Z * M2[:, ti])[:nw * m].reshape(nw, m).mean(1)
        rec[f'J_mean_th{th}'] = float(J.mean()); rec[f'J_sd_th{th}'] = float(J.std()); rec[f'spearman_hole_J_th{th}'] = float(spearmanr(hole, J)[0])
        rec[f'J_median_top1pct_hole_th{th}'] = float(np.median(J[top])); rec[f'J_median_all_th{th}'] = float(np.median(J))
        # second-moment rule calibrated on this object: windows with J below its median: largest hole seen
        rec[f'hole_max_given_J_below_median_th{th}'] = float(hole[J <= np.median(J)].max())
        if hasv.any() and (~hasv).any():
            rec[f'J_mean_noviol_th{th}'] = float(J[~hasv].mean()); rec[f'J_mean_viol_th{th}'] = float(J[hasv].mean())
    if hasv.any() and (~hasv).any():
        rec['hole_max_noviol'] = float(hole[~hasv].max()); rec['hole_mean_noviol'] = float(hole[~hasv].mean()); rec['hole_mean_viol'] = float(hole[hasv].mean()); rec['hole_max_viol'] = float(hole[hasv].max())
    R['win'].append(rec)
json.dump(R, open(sys.argv[2], 'w'), indent=1)
m0 = R['moll'][-1]
print(f"{obj} T0={T0:.1e} zeros={R['zeros_with_close_pairs']} (count-expected {R['count_minus_expected']:+.1f}) viol={R['laguerre_violations']} gap_max={R['gap_max']:.3f} max|Z|={R['max_abs_Z']:.1f} "
      f"cert_max(th={m0['theta']})={m0['cert_max_run_m0.0']:.3f} false={m0['false_holes']} J17={R['win'][-1]['J_mean_th' + str(thetas[-1])]:.3f}", flush=True)
