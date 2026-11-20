"""Test 4, zero side: (a) S(t) = N(t) - smooth count on windows of W consecutive zeros of a list: rms and sup of |S| per window
(continuous in t: S is linear between zeros), normalised by sqrt(log log T / (2 pi^2)); also after removing a linear trend per window.
(b) Palm density around close pairs (normalised gap < 0.2): histogram of the other zeros against rho(u) = 1 - S^2 - 3 S'^2/pi^2.
Usage: t4_zero.py LIST.npy NAME Q DEG OUT.json [T0]  [OFF.npz]
  Q, DEG: conductor and degree for the smooth count (DEG/2pi) log(Q^(1/DEG) T/2pi); T0: the list holds offsets from T0 (or a window near T0
  when the values are absolute); OFF.npz: DH.npz with 'on', 'offg' (the list argument is then ignored and 'on' is used)."""
import sys, json, math, numpy as np, bl, hl
fn, name, Q, DEG, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
T0 = float(sys.argv[6]) if len(sys.argv) > 6 and sys.argv[6] not in ('', '-') else None
offg = None
if len(sys.argv) > 7: d = np.load(sys.argv[7]); g = np.sort(np.asarray(d['on'], float)); offg = np.sort(np.asarray(d['offg'], float))
else: g = np.array(np.load(fn, mmap_mode='r'), dtype=np.float64)
n = len(g); LD = np.longdouble if (T0 is not None and T0 > 1e8) else np.float64
is_off = T0 is not None and g[-1] < 0.5 * T0
hl.log('%s: %d ordinates, %.4f .. %.4f, offsets=%s; list %.2f GB, planned peak %.2f GB' % (name, n, g[0], g[-1], is_off, 8e-9 * n, 8 * 8e-9 * n + 0.5))
def Nsm(t):
    """smooth count of ordinates in (0, t], degree DEG, conductor Q, up to an additive constant: (t/2pi) log(Q t^DEG/(2 pi e)^DEG) for DEG=1 exact theta/pi"""
    t = t.astype(LD); TP = LD(2) * np.pi
    if DEG == 1: return t / TP * (np.log(Q * t / TP) - 1) + LD(1) / (48 * np.pi * t)
    return DEG * t / TP * (np.log(t / TP) - 1) + t / TP * np.log(Q)
tabs = (LD(T0) + g.astype(LD)) if is_off else g.astype(LD)
Ns = Nsm(tabs); k = np.arange(1, n + 1, dtype=LD)
a = (k - Ns); a = (a - np.median(a) + 0.5).astype(np.float64)  # S just after zero k (constant fixed by median of the mid value = 0); just before zero k: a - 1
del Ns, k
height = np.asarray(tabs, dtype=np.float64); del tabs
# ---- (a) windows
W = 2048; m = n // W
rows = []
for w in range(m):
    sl = slice(w * W, (w + 1) * W); av = a[sl]; hv = height[sl]
    aa = av[:-1]; bb = av[1:] - 1.0; L = np.diff(hv)
    msq = float(((aa * aa + aa * bb + bb * bb) / 3 * L).sum() / L.sum()); mean = float(((aa + bb) / 2 * L).sum() / L.sum())
    sup = float(max(np.abs(av).max(), np.abs(av - 1).max()))
    idx = np.arange(W); mid = av - 0.5; p = np.polyfit(idx, mid, 1); res = mid - np.polyval(p, idx)
    Tm = float(hv[W // 2]); nrm = math.sqrt(math.log(math.log(Tm)) / (2 * math.pi ** 2)) if Tm > 3 else float('nan')
    rows.append((Tm, math.sqrt(msq), sup, mean, float(p[0]), float(math.sqrt((res ** 2).mean() + 1 / 12)), float(np.abs(res).max() + 0.5), nrm))
rows = np.array(rows)
res = dict(name=name, n=n, W=W, windows=m)
med0 = np.median(rows[:, 3]) if m else 0.0
dec = []
edges = [0, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e10, 1e13]
for lo, hi in zip(edges[:-1], edges[1:]):
    kk = (rows[:, 0] >= lo) & (rows[:, 0] < hi) if m else np.zeros(0, bool)
    if kk.sum():
        r = rows[kk]
        dec.append(dict(lo=lo, hi=hi, windows=int(kk.sum()), T_median=float(np.median(r[:, 0])), norm=float(np.median(r[:, 7])),
                        rms_all=float(np.sqrt((r[:, 1] ** 2).mean())), r_rms=float(np.sqrt((r[:, 1] ** 2).mean()) / np.median(r[:, 7])),
                        sup_median=float(np.median(r[:, 2])), sup_max=float(r[:, 2].max()), r_sup_median=float(np.median(r[:, 2] / r[:, 7])), r_sup_max=float((r[:, 2] / r[:, 7]).max()),
                        drift_per_zero_median=float(np.median(r[:, 4])), detrended_rms=float(np.sqrt((r[:, 5] ** 2).mean())), detrended_r_rms=float(np.sqrt((r[:, 5] ** 2).mean()) / np.median(r[:, 7])),
                        detrended_sup_median=float(np.median(r[:, 6])), detrended_r_sup_median=float(np.median(r[:, 6] / r[:, 7]))))
res['by_height'] = dec
res['total_drift_of_S'] = float(a[-1] - a[0])
# ---- (b) Palm density around close pairs
J = 100; KN = 16
cs = (g - g[0]) if True else None; del g
i = np.arange(J, n - J - 1, dtype=np.int32 if n < 2e9 else np.int64)
rho_loc = (2 * J + 1) / (cs[2 * J + 1:] - cs[:n - 2 * J - 1])                 # local density from the 2J+1 gaps around the pair (i, i+1)
s = (cs[J + 1:n - J] - cs[J:n - J - 1]) * rho_loc
close = np.nonzero(s < 0.2)[0]
bins = np.linspace(-6, 6, 121); bc = 0.5 * (bins[1:] + bins[:-1])
def palm(sel, label):
    if len(sel) == 0: return dict(label=label, pairs=0)
    ii = i[sel]; mid = 0.5 * (cs[ii] + cs[ii + 1]); H = np.zeros(120)
    for off in list(range(-KN, 0)) + list(range(2, KN + 2)):
        u = (cs[ii + off] - mid) * rho_loc[sel]; H += np.histogram(u, bins)[0]
    emp = H / (len(sel) * 0.1)
    S = np.sinc(bc); Sp = (np.cos(np.pi * bc) - np.sinc(bc)) / bc
    th = 1 - S ** 2 - 3 * Sp ** 2 / np.pi ** 2; th1 = 1 - S ** 2
    core = np.abs(bc) < 3
    return dict(label=label, pairs=int(len(sel)), mean_gap=float(s[sel].mean()), deficit_6=float(((1 - emp) * 0.1).sum()), deficit_6_theory=float(((1 - th) * 0.1).sum()),
                deficit_3=float(((1 - emp[core]) * 0.1).sum()), deficit_3_theory=float(((1 - th[core]) * 0.1).sum()),
                l2_to_palm2=float(math.sqrt(((emp - th)[core] ** 2).mean())), l2_to_palm1=float(math.sqrt(((emp - th1)[core] ** 2).mean())),
                stat_err=float(math.sqrt(1.0 / max(len(sel) * 0.1, 1))), density=emp.tolist(), theory=th.tolist())
res['palm'] = [palm(close, 'all close pairs (s < 0.2)'), palm(np.nonzero(s < 0.1)[0], 's < 0.1')]
res['close_fraction'] = float((s < 0.2).mean()); res['gue_close_fraction'] = math.pi ** 2 * 0.2 ** 3 / 9
if offg is not None:
    hm = 0.5 * (height[i] + height[i + 1])
    j = np.searchsorted(offg, hm); d1 = np.abs(offg[np.clip(j, 0, len(offg) - 1)] - hm); d2 = np.abs(offg[np.clip(j - 1, 0, len(offg) - 1)] - hm)
    dist = np.minimum(d1, d2) * rho_loc                                 # distance to the nearest off-line pair in on-line mean spacings
    for thr in (5.0, 10.0, 20.0):
        far = dist > thr
        res['palm'].append(palm(np.nonzero((s < 0.2) & far)[0], 'close pairs farther than %g spacings from every off-line pair' % thr))
        res['close_fraction_far_%g' % thr] = float((s[far] < 0.2).mean()) if far.any() else None
        res['small_gap_exponent_far_%g' % thr] = float(math.log(max((s[far] < 0.2).mean(), 1e-300) / max((s[far] < 0.05).mean(), 1e-300)) / math.log(4)) if far.any() else None
    near = dist <= 5.0
    res['palm'].append(palm(np.nonzero((s < 0.2) & near)[0], 'close pairs within 5 spacings of an off-line pair'))
    res['frac_sites_far_5'] = float((dist > 5).mean())
res['small_gap_exponent'] = float(math.log(max((s < 0.2).mean(), 1e-300) / max((s < 0.05).mean(), 1e-300)) / math.log(4))
bl.jdump(res, out)
print(json.dumps(dict(by_height=dec, palm=[{k_: v for k_, v in p.items() if k_ not in ('density', 'theory')} for p in res['palm']], close=res['close_fraction'], expo=res['small_gap_exponent'])))
