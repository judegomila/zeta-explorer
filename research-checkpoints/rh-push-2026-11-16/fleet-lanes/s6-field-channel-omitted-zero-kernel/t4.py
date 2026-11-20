"""Combination 4: isolation ratio of the globally minimal pair of each window of N consecutive zeros.
rho = g/d_1, g = smallest unfolded gap of the window, d_1 = the smaller of the two gaps adjacent to that pair (zeros outside the window count
as environment).  Thresholds: 0.72 (Theorem C) and c_half = 0.8980208880762339.
Also, over all adjacent pairs of the list: the small-gap law P(gap < e) and the triple law P(gap < e and d_1 < gap/0.72), fitted exponents.
Usage: t4.py NAME LIST.npy Q OUT.json [T0]     (T0: offset added to the list, for windows stored as offsets)"""
import sys, math, numpy as np, fk
name, fn, Q, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
T0 = float(sys.argv[5]) if len(sys.argv) > 5 else 0.0
CH = 0.8980208880762339
g = np.array(np.load(fn, mmap_mode='r'), dtype=np.float64)
if g[0] > 1e6: T0 = 0.0
fk.log(name, len(g), 'planned memory %.2f GB' % (len(g) * 8e-9 * 5))
mid = 0.5 * (g[1:] + g[:-1]) + T0
d = np.diff(g) * (np.log(Q * mid / (2 * math.pi)) / (2 * math.pi)); del mid
M = len(d)
nb = np.minimum(d[:-2], d[2:])            # d_1 of pair i+1 (gaps i, i+2 adjacent), i = 0..M-3
dc = d[1:-1]; rho_all = dc / nb           # for every interior gap
res = dict(name=name, n_zeros=len(g), Q=Q, height=[float(g[0] + T0), float(g[-1] + T0)], mean_unfolded_gap=float(d.mean()), windows=[], laws={})
# laws over all pairs
eps = np.array([0.01, 0.015, 0.02, 0.03, 0.05, 0.07, 0.1, 0.15, 0.2, 0.3])
cnt = np.array([(dc < e).sum() for e in eps]); tr72 = np.array([((dc < e) & (rho_all > 0.72) & (rho_all < 1 / 0.72)).sum() for e in eps])
cl = np.array([((dc < e) & (nb < e)).sum() for e in eps])     # both the gap and its nearest neighbour gap below e
def slope(e, c, lo):
    m = c >= lo
    return (float(np.polyfit(np.log(e[m]), np.log(c[m]), 1)[0]), int(m.sum())) if m.sum() >= 3 else (None, int(m.sum()))
res['laws'] = dict(eps=eps, pairs_below=cnt, frac_below=cnt / len(dc), triple_ratio_in_072_band=tr72, cluster_both_below=cl,
                   pair_exponent_fit=slope(eps[:8], cnt[:8], 30), cluster_exponent_fit=slope(eps, cl, 10),
                   gue_pair_frac=[(math.pi ** 2 / 9) * e ** 3 for e in eps])
fk.log(name, 'laws', {k: (v.tolist() if hasattr(v, 'tolist') else v) for k, v in res['laws'].items()})
for N in (100, 300, 1000, 3000, 10 ** 4, 3 * 10 ** 4, 10 ** 5):
    W = (len(dc)) // N
    if W < 5: continue
    A = dc[:W * N].reshape(W, N); j = A.argmin(1); idx = np.arange(W) * N + j
    gm = dc[idx]; r = rho_all[idx]
    h = (g[idx + 1] + T0)
    row = dict(N=N, windows=W, frac_gt_072=float((r > 0.72).mean()), n_gt_072=int((r > 0.72).sum()), frac_gt_chalf=float((r > CH).mean()), n_gt_chalf=int((r > CH).sum()),
               rho_max=float(r.max()), rho_max_height=float(h[np.argmax(r)]), rho_max_gap=float(gm[np.argmax(r)]), rho_median=float(np.median(r)), rho_q99=float(np.quantile(r, 0.99)),
               gmin_mean=float(gm.mean()), gmin_min=float(gm.min()), by_height=[])
    for q4 in range(4):
        s = slice(q4 * W // 4, (q4 + 1) * W // 4)
        if W >= 40: row['by_height'].append(dict(height=[float(h[s][0]), float(h[s][-1])], frac_gt_072=float((r[s] > 0.72).mean()), n_gt_072=int((r[s] > 0.72).sum()), rho_max=float(r[s].max()), gmin_mean=float(gm[s].mean())))
    res['windows'].append(row); fk.log(name, {k: v for k, v in row.items() if k != 'by_height'})
fk.jdump(res, out)
