"""Where is the minimum of the real-zero mass among points further than 5 Y from every off-line pair (tables below height 2000)?
Reports, for each control and width: the minimum ratio to the mean at far points, the distance from that point to the nearest off-line pair
(in t and in mean spacings), whether the off-line pair lies in the same gap of real zeros, and the gap length in mean spacings.
Comparison: the same minimum for the zeta table and for the first zeros of L(chi mod 5) (list of s1-zero-flow-dynamics) on the same heights."""
import os, sys, json, math, numpy as np
os.environ['RH_BACKEND'] = 'cpu'
import zf
grid = np.arange(300.0, 1900.0, 0.01); top = 2000.0
def dens(t, q): return np.log(q * t / (2 * math.pi)) / (2 * math.pi)
def real_mass(on, t, de, q, cut=None):
    S = np.zeros(len(t))
    for s in range(0, len(t), 20000):
        tt = t[s:s + 20000]
        S[s:s + 20000] = (de / ((tt[:, None] - on[None, :]) ** 2 + de * de)).sum(1) + (de / ((tt[:, None] + on[None, :]) ** 2 + de * de)).sum(1)
    return 0.5 * S + 0.5 * dens(t, q) * (math.pi / 2 - np.arctan(((cut or top) - t) / de))
out = {}
for nm in ('ZETA', 'CHI5', 'DH', 'HEAT--0.1', 'HEAT--0.5'):
    if nm == 'CHI5':
        x = zf.load('chi')[0]; cut = 2500.0; on = x[x < cut]; off = []; q = 5
    else:
        on, off = zf.table(nm); on = np.sort(np.array(on, dtype=float)); q = 5 if nm == 'DH' else 1; cut = top
    mean = 0.25 * np.log(q * grid / (2 * math.pi)); r = {}
    for de in (0.0825, 0.165, 0.2, 0.5):
        Y = 2 * de; ratio = real_mass(on, grid, de, q, cut) / mean
        if off:
            offg = np.array([g for b, g in off]); dist = np.abs(grid[:, None] - offg[None, :]).min(1); far = 2 * dist > 5 * Y
            j = int(np.argmin(np.where(far, ratio, np.inf))); t0 = grid[j]; k = int(np.argmin(np.abs(offg - t0)))
            i = int(np.searchsorted(on, t0)); lo, hi = on[i - 1], on[i]
            r['Y%g' % Y] = dict(far_min_ratio=float(ratio[j]), t=float(t0), dist_to_offline_t=float(abs(offg[k] - t0)), dist_in_mean_spacings=float(abs(offg[k] - t0) * dens(t0, q)),
                                offline_pair_in_same_gap=bool(lo < offg[k] < hi), gap_in_mean_spacings=float((hi - lo) * dens(t0, q)),
                                far_q01=float(np.quantile(ratio[far], 0.01)), far_q1e3=float(np.quantile(ratio[far], 1e-3)))
        else:
            j = int(np.argmin(ratio)); i = int(np.searchsorted(on, grid[j]))
            r['Y%g' % Y] = dict(min_ratio=float(ratio[j]), t=float(grid[j]), gap_in_mean_spacings=float((on[i] - on[i - 1]) * dens(grid[j], q)),
                                q01=float(np.quantile(ratio, 0.01)), q1e3=float(np.quantile(ratio, 1e-3)))
    out[nm] = r; print(nm, json.dumps(r), flush=True)
json.dump(out, open('out/c4_far_min.json', 'w'), indent=1)
