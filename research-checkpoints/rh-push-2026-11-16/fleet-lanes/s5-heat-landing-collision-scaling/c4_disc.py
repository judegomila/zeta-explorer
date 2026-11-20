"""Combination 4, zero side: windowed discriminant rate.  d/dt log Disc = -8 sum_{i<j} 1/(x_i - x_j)^2 over N consecutive ordinates,
in unfolded units and per zero: w = (1/N) sum_{i<j in window} 1/(u_i - u_j)^2.  Reference values: lattice zeta(2) = 1.6449;
sine-kernel (GUE) mean pi^2/3 = 3.2899 (int_0^inf (1 - sinc^2)/r^2 dr); a list with P(s < d) ~ d^2 has a divergent mean (log N).
Usage: c4_disc.py LIST.npy NAME Q OUT.json [T0 for a window list]"""
import sys, json, math, numpy as np, hl
fn, name, Q, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
g = np.array(np.load(fn, mmap_mode='r'), dtype=np.float64); n = len(g)
T0w = float(sys.argv[5]) if len(sys.argv) > 5 else None
if T0w is None: u = hl.unfold(g, Q)
else: u = (g - g[0]) * float(hl.rho_gamma(T0w, Q))
u = u * ((n - 1) / (u[-1] - u[0]))            # exact unit mean spacing over the list (on-line density of the list itself)
hl.log('%s: %d ordinates' % (name, n))
res = dict(name=name, n=n, gue=math.pi ** 2 / 3, lattice=math.pi ** 2 / 6)
K = 2000
D = hl.disc_lag(u, K)[:n - K]                  # forward-lag sums; window sum of pairs with lag <= K
D1 = 1 / np.diff(u)[:n - K] ** 2               # nearest-neighbour term
cs = np.concatenate([[0], np.cumsum(D)]); cs1 = np.concatenate([[0], np.cumsum(D1)])
rows = []
for N in (1000, 10000, 100000, 1000000):
    if n - K < 4 * N: break
    m = (n - K) // N
    if N == 1000: W = hl.disc_windows(u[:m * N], N) / N      # exact: all pairs inside the window
    else: W = (cs[N * np.arange(1, m + 1)] - cs[N * np.arange(m)]) / N + 1.0 / K   # lags <= K, continuum tail 1/K
    W1 = (cs1[N * np.arange(1, m + 1)] - cs1[N * np.arange(m)]) / N
    mx = np.array([D1[k * N:(k + 1) * N].max() for k in range(min(m, 20000))]) / N
    rows.append(dict(N=N, windows=int(m), mean=float(W.mean()), sem=float(W.std(ddof=1) / math.sqrt(m)) if m > 1 else None, median=float(np.median(W)),
                     q05=float(np.quantile(W, 0.05)), q95=float(np.quantile(W, 0.95)), max=float(W.max()),
                     mean_over_gue=float(W.mean() / (math.pi ** 2 / 3)), median_over_gue=float(np.median(W) / (math.pi ** 2 / 3)),
                     nearest_neighbour_share=float(W1.mean() / W.mean()), largest_single_pair_share_median=float(np.median(mx / W[:len(mx)]))))
res['windows'] = rows
# running mean per zero against the number of zeros (log-divergence test)
res['running_mean'] = [dict(n=int(k), mean=float(cs[k] / k + 1.0 / K)) for k in [int(v) for v in np.geomspace(1e3, n - K, 13)]]
# heights: windows of 1000 in 10 height bands
if rows:
    N = 1000; m = (n - K) // N; W = hl.disc_windows(u[:m * N], N) / N; b = m // 10
    res['bands_N1000'] = [dict(height=float(g[(k * b + b // 2) * N]), median=float(np.median(W[k * b:(k + 1) * b])), mean=float(W[k * b:(k + 1) * b].mean())) for k in range(10)]
hl.jdump(res, out); print(json.dumps(res, indent=0)[:3000])
