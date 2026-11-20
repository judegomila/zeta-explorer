"""CUE reference for combinations 3 and 4: eigenangles of Haar unitary matrices of size N, unfolded to unit mean spacing and continued periodically.
Reports the fraction of adjacent pairs with S g^2 > 0.909 and > 2, the value of S s^2 statistics, close-pair gate counts, and the
per-point discriminant rate (1/N) sum_{i<j} 1/(u_i - u_j)^2 with chord distances (N/pi) sin(pi d/N).  Usage: cue_ref.py N SAMPLES OUT.json"""
import sys, json, math, numpy as np, hl
from scipy.stats import unitary_group
N, M, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
rng = np.random.default_rng(20261120)
print('planned memory: %d x %d complex matrix = %.3f GB' % (N, N, 16e-9 * N * N))
J = 200; xg_all = []; s_all = []; W = []; nn = []
for m in range(M):
    U = unitary_group.rvs(N, random_state=rng)
    th = np.sort(np.angle(np.linalg.eigvals(U))); u = (th + math.pi) * N / (2 * math.pi)
    ext = np.concatenate([u[-J - 1:] - N, u, u[:J + 1] + N])
    S = hl.pair_S(ext, J)[J:J + N + 1][1:N + 1] + 2.0 / (J + 0.5)
    g = np.diff(ext)[J + 1:J + 1 + N]
    xg_all.append(S * g * g); s_all.append(g)
    d = u[:, None] - u[None, :]; ch = (N / math.pi) * np.sin(math.pi * np.abs(d) / N); np.fill_diagonal(ch, np.inf)
    W.append(float((1 / ch ** 2).sum() / 2 / N)); nn.append(float((1 / g ** 2).sum() / N))
xg = np.concatenate(xg_all); s = np.concatenate(s_all); cl = s < 0.2
res = dict(N=N, samples=M, pairs=int(len(xg)), frac_gate_gt_0p909=float((xg > 0.909).mean()), frac_gate_gt_0p909_sem=float(np.std([(a > 0.909).mean() for a in xg_all], ddof=1) / math.sqrt(M)),
           frac_gate_gt_2=float((xg > 2).mean()), gate_quantiles=[float(v) for v in np.quantile(xg, [0.01, 0.1, 0.5, 0.9, 0.99, 0.999])],
           close_pairs=dict(n=int(cl.sum()), n_gate_gt_0p909=int((xg[cl] > 0.909).sum()), n_gate_gt_2=int((xg[cl] > 2).sum()), max_gate=float(xg[cl].max())),
           S_mean=float((xg / s ** 2).mean()), disc_rate_mean=float(np.mean(W)), disc_rate_sem=float(np.std(W, ddof=1) / math.sqrt(M)), disc_rate_median=float(np.median(W)),
           exact_CUE_mean=(N * N - 1) / (12.0 * N) * 0 + (math.pi ** 2 / 3) * (1 - 1.0 / N ** 2) * 0 + float('nan'), nearest_neighbour_share=float(np.mean(nn) / np.mean(W)),
           small_gap=[dict(d=dv, frac=float((s < dv).mean()), cubic=math.pi ** 2 * dv ** 3 / 9) for dv in (0.05, 0.1, 0.2)])
del res['exact_CUE_mean']
hl.jdump(res, out); print(json.dumps(res, indent=0))
