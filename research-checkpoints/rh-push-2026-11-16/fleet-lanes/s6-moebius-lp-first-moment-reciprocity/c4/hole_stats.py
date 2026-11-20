"""Statistics of the hole test from the arrays of hole.py.  usage: hole_stats.py in.npz out.json
Unfolded coordinate: sample index / pps (each window is sampled at step = local mean spacing / pps)."""
import sys, json, math, numpy as np
from scipy.stats import spearmanr
f = np.load(sys.argv[1], allow_pickle=True)
Z = f['Z'].astype(np.float64); U = f['U']; M2 = f['M2']; pps = int(f['pps']); npw = int(f['npw'])
T0 = float(f['T0']); q = int(f['q']); obj = str(f['obj']); thetas = [float(x) for x in f['thetas']]; ys = [int(x) for x in f['ys']]
n = len(Z); R = dict(obj=obj, T0=T0, q=q, points=n, windows17=n // npw, pps=pps, ys=ys, thetas=thetas)
u = np.arange(n) / pps
# positive local minima / negative local maxima of the samples.  Parabola through three samples: Z ~ a2 (x^2 -+ e^2) in step units.
# vertex beyond zero -> a pair of real zeros closer than one step (half-distance e); otherwise a minimum that stays positive:
# a conjugate pair at distance eta = e steps from the line, or a real pair below the resolution if eta < ETA_MIN.
ETA_MIN = 0.6      # steps; 0.06 mean spacings (the cubic term of Z over one step is of this size: see recheck_min.py)
i = np.arange(1, n - 1)
fl = i[((Z[i] > 0) & (Z[i] < Z[i - 1]) & (Z[i] < Z[i + 1])) | ((Z[i] < 0) & (Z[i] > Z[i - 1]) & (Z[i] > Z[i + 1]))]
a2 = (Z[fl - 1] - 2 * Z[fl] + Z[fl + 1]) / 2; b1 = (Z[fl + 1] - Z[fl - 1]) / 2
vertex = Z[fl] - b1 * b1 / (4 * a2); xv = -b1 / (2 * a2); ee = np.sqrt(np.abs(vertex / a2))
close = vertex * Z[fl] < 0
marg = (~close) & (ee < ETA_MIN)
viol = fl[(~close) & (ee >= ETA_MIN)]; eta_v = ee[(~close) & (ee >= ETA_MIN)] / pps
R['positive_minima_eta_ge_steps'] = {str(x): int(((~close) & (ee >= x)).sum()) for x in (0.3, 0.6, 1.0, 2.0, 5.0)}
R['flagged_minima'] = int(len(fl)); R['flagged_close_pairs'] = int(close.sum()); R['flagged_marginal'] = int(marg.sum())
R['laguerre_violations'] = int(len(viol)); R['violations_per_1000_spacings'] = 1000 * len(viol) / (n / pps)
R['violation_eta_spacings_q'] = [float(np.quantile(eta_v, x)) for x in (0.0, 0.1, 0.5, 0.9, 1.0)] if len(viol) else None
sc = np.nonzero(Z[:-1] * Z[1:] < 0)[0]
zpos = (sc + Z[sc] / (Z[sc] - Z[sc + 1])) / pps
# zeros of unresolved close pairs (and of marginal minima, counted as real pairs at the vertex) are inserted in the zero list
cp_i = fl[close | marg]; cp_x = xv[close | marg]; cp_e = np.where(close, ee, 0.0)[close | marg]
zextra = np.r_[(cp_i + cp_x - cp_e) / pps, (cp_i + cp_x + cp_e) / pps]
zall = np.sort(np.r_[zpos, zextra])
R['sign_changes'] = int(len(sc)); R['zeros_with_close_pairs'] = int(len(zall)); R['expected_main_term'] = n / pps
R['count_minus_expected'] = len(zall) - n / pps
gaps_all = np.diff(zall)
# for the max |Z| per gap keep the sample-resolved gaps (between consecutive sign changes), with a mask for gaps that contain an inserted pair
gaps = np.diff(zpos)
absZ = np.abs(Z); csmax = np.maximum.reduceat(absZ, np.r_[sc[:-1] + 1]) if len(sc) > 1 else np.array([])
gmax = csmax[:len(gaps)] if len(gaps) else np.array([])
has_pair = np.zeros(len(gaps), dtype=bool)
gi_ = np.searchsorted(sc, cp_i, side='left') - 1; gi_ = gi_[(gi_ >= 0) & (gi_ < len(gaps))]; has_pair[gi_] = True
gaps_raw = gaps; gmax_raw = gmax
keepg = ~has_pair
R['gaps_merged_by_unresolved_pairs'] = int(has_pair.sum())
R['gap_mean'] = float(gaps_all.mean()); R['gap_max'] = float(gaps_all.max()); R['gap_q'] = [float(np.quantile(gaps_all, x)) for x in (0.5, 0.9, 0.99, 0.999, 0.9999)]
gaps = np.where(keepg, gaps_raw, 0.0)     # gaps containing an inserted pair are removed from the per-gap statistics
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
nosc = np.ones(n - 1, dtype=bool); nosc[sc] = False; nosc[np.clip(cp_i, 0, n - 2)] = False; nosc[np.clip(cp_i - 1, 0, n - 2)] = False
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
    brk = np.zeros(n, dtype=bool); brk[sc] = True; brk[np.clip(cp_i, 0, n - 1)] = True; brk[np.clip(cp_i - 1, 0, n - 1)] = True
    ch = brk[:nw * m].reshape(nw, m)[:, :-1]
    hole = np.empty(nw)
    idx = np.arange(m - 1)
    for j in range(nw):
        c = idx[ch[j]]
        b = np.r_[-0.5, c + 0.5, m - 0.5] if len(c) else np.array([-0.5, m - 0.5])
        hole[j] = np.diff(b).max() / pps
    vw = np.zeros(n, dtype=bool); vw[viol] = True; hasv = vw[:nw * m].reshape(nw, m).any(1)
    zc = np.bincount(np.clip((zall // w).astype(np.int64), 0, nw), minlength=nw + 1)[:nw]     # zeros per window (unfolded length w)
    clean = (~hasv) & (zc >= w - 1)          # proxy for 'no off-line zero in the window': full count and no positive minimum
    rec = dict(w=w, nwin=int(nw), hole_max=float(hole.max()), hole_mean=float(hole.mean()), hole_q=[float(np.quantile(hole, x)) for x in (0.5, 0.99, 0.999)],
               windows_with_violation=int(hasv.sum()), maxZ_max=float(np.abs(Zw).max()))
    maxZ = np.abs(Zw).max(1); J0 = (Zw ** 2).mean(1)
    rec['zero_count_mean'] = float(zc.mean()); rec['zero_count_min'] = int(zc.min()); rec['clean_windows'] = int(clean.sum())
    if clean.any():
        rec['hole_max_clean'] = float(hole[clean].max()); rec['hole_mean_clean'] = float(hole[clean].mean()); rec['hole_q999_clean'] = float(np.quantile(hole[clean], 0.999))
        rec['maxZ_median_clean'] = float(np.median(maxZ[clean]))
    if (~clean).any():
        rec['hole_max_unclean'] = float(hole[~clean].max()); rec['hole_mean_unclean'] = float(hole[~clean].mean()); rec['maxZ_median_unclean'] = float(np.median(maxZ[~clean]))
        big = (~clean) & (hole >= 4.0)
        if big.any(): rec['unclean_holes_ge4'] = int(big.sum()); rec['maxZ_median_unclean_holes_ge4'] = float(np.median(maxZ[big])); rec['maxZ_max_unclean_holes_ge4'] = float(maxZ[big].max())
    rec['spearman_hole_maxZ'] = float(spearmanr(hole, maxZ)[0]); rec['spearman_hole_J0'] = float(spearmanr(hole, J0)[0])
    top = hole >= np.quantile(hole, 0.99)
    rec['maxZ_median_all'] = float(np.median(maxZ)); rec['maxZ_median_top1pct_hole'] = float(np.median(maxZ[top])); rec['maxZ_min_top1pct_hole'] = float(maxZ[top].min())
    for ti, th in enumerate(thetas):
        J = (Z * Z * M2[:, ti])[:nw * m].reshape(nw, m).mean(1)
        rec[f'J_mean_th{th}'] = float(J.mean()); rec[f'J_sd_th{th}'] = float(J.std()); rec[f'spearman_hole_J_th{th}'] = float(spearmanr(hole, J)[0])
        rec[f'J_median_top1pct_hole_th{th}'] = float(np.median(J[top])); rec[f'J_median_all_th{th}'] = float(np.median(J))
        # second-moment rule calibrated on this object: windows with J below its median: largest hole seen
        rec[f'hole_max_given_J_below_median_th{th}'] = float(hole[J <= np.median(J)].max())
        if clean.any(): rec[f'J_mean_clean_th{th}'] = float(J[clean].mean()); rec[f'J_sd_clean_th{th}'] = float(J[clean].std())
        if (~clean).any(): rec[f'J_mean_unclean_th{th}'] = float(J[~clean].mean())
        if hasv.any() and (~hasv).any():
            rec[f'J_mean_noviol_th{th}'] = float(J[~hasv].mean()); rec[f'J_mean_viol_th{th}'] = float(J[hasv].mean())
    if hasv.any() and (~hasv).any():
        rec['hole_max_noviol'] = float(hole[~hasv].max()); rec['hole_mean_noviol'] = float(hole[~hasv].mean()); rec['hole_mean_viol'] = float(hole[hasv].mean()); rec['hole_max_viol'] = float(hole[hasv].max())
    R['win'].append(rec)
json.dump(R, open(sys.argv[2], 'w'), indent=1)
m0 = R['moll'][-1]
print(f"{obj} T0={T0:.1e} zeros={R['zeros_with_close_pairs']} (count-expected {R['count_minus_expected']:+.1f}) viol={R['laguerre_violations']} gap_max={R['gap_max']:.3f} max|Z|={R['max_abs_Z']:.1f} "
      f"cert_max(th={m0['theta']})={m0['cert_max_run_m0.0']:.3f} false={m0['false_holes']} J17={R['win'][-1]['J_mean_th' + str(thetas[-1])]:.3f}", flush=True)
