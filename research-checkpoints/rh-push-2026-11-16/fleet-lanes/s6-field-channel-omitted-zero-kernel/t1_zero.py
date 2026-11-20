"""Combination 1, zero side.  K_l = 2 sum over omitted zeros of 1/((x_l - y)(x_{l+1} - y)) for the table of the first N zeros of a list.
(a) omitted part from a longer list (zeros N+1..M and all mirror zeros exactly, density tail beyond M): the reference value.
(b) from the counting density alone: 2 int_{Tb}^inf dens/((y-a)(y-b)) + mirror integral.  Two lower limits:
    bT: Tb = x_N + 1/(2 dens(x_N))  (half a mean spacing above the last table zero; uses no count);
    bN: Tb = T*_N, the height where the smooth count equals N (uses the count; undefined when T*_N <= x_N).
Usage: t1_zero.py NAME LIST.npy Q PAR OUT_PREFIX N1,N2,... [MIRROR.npy]
Writes OUT_PREFIX.json and OUT_PREFIX_pairs.npz (the pairs handed to the prime side)."""
import sys, math, numpy as np, fk
name, fn, Q, par, outp = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
Ns = [int(float(v)) for v in sys.argv[6].split(',')]
g = np.array(np.load(fn, mmap_mode='r'), dtype=np.float64); M = len(g)
gm = np.array(np.load(sys.argv[7]), dtype=np.float64) if len(sys.argv) > 7 else g
fk.log(name, 'list', M, 'top', g[-1], 'planned memory %.2f GB' % (2 * M * 8e-9))
# count offset c0: mean of j - 1/2 - nsmooth(x_j) over the list (zeta: 1)
idx = np.unique(np.linspace(0, M - 1, 200000).astype(np.int64))
c0 = float(np.mean(idx + 0.5 - fk.nsmooth(g[idx], Q, par)))
TM = float(g[-1] + 0.5 / fk.dens(g[-1], Q, par)); TMm = float(gm[-1] + 0.5 / fk.dens(gm[-1], Q, par))
y0 = fk.tstar(0.0, Q, par, c0, T0=max(g[0], 5.0))
res = dict(name=name, list_len=M, Q=Q, par=par, c0=c0, rows=[]); save = {}
for N in Ns:
    if N + 1000 > M: continue
    x = g[:N]; J = min(2000, N // 4)
    top = np.arange(N - 1 - J, N - 1)                      # pairs (l, l+1), l+1 <= N-1
    probes = []
    for depth in (300, 1000, 3000, 10 ** 4, 10 ** 5, 10 ** 6, 10 ** 7):
        if depth * 3 < N: probes += [N - depth + k for k in (0, 7, 23)]
    d = np.diff(x); rec = int(np.argmin(d))
    sel = np.unique(np.concatenate([top, np.array(probes + [rec], dtype=np.int64)]))
    a = x[sel]; b = x[sel + 1]
    S, _ = fk.pairsum(g, a, b, np.zeros(len(sel), np.int64), np.full(len(sel), N, np.int64))        # zeros N.. M-1
    _, Sm = fk.pairsum(gm, a, b, np.zeros(len(sel), np.int64), np.zeros(len(sel), np.int64))
    Ka = 2 * (S + Sm + fk.tail_int(TM, a, b, Q, par) + fk.tail_int(TMm, -b, -a, Q, par))
    mir = 2 * fk.tail_int(max(y0, 1.0), -b, -a, Q, par)
    Tb1 = float(x[-1] + 0.5 / fk.dens(x[-1], Q, par)); Tb2 = fk.tstar(N, Q, par, c0, T0=x[-1])
    KbT = 2 * fk.tail_int(Tb1, a, b, Q, par) + mir
    KbN = 2 * fk.tail_int(Tb2, a, b, Q, par) + mir if Tb2 > x[-1] else np.full(len(sel), np.nan)
    rT = Ka / KbT; rN = Ka / KbN
    depth = N - 2 - sel
    rho = float(fk.dens(x[-1], Q, par))
    row = dict(N=N, top_height=float(x[-1]), mean_spacing=1 / rho, Tb_half_spacing=Tb1, Tstar_N=Tb2, S_at_top=float(N - c0 - fk.nsmooth(x[-1], Q, par)),
               Kmax=float(Ka.max()), Kmax_depth=int(depth[np.argmax(Ka)]), Kmax_gap=float((b - a)[np.argmax(Ka)]),
               K_top_gap=float(Ka[depth == 0][0]), dist_first_omitted=float(g[N] - x[-1]),
               record_pair=dict(l=rec, gap=float(d[rec]), gamma=float(x[rec]), K=float(Ka[sel == rec][0]), Kb=float(KbT[sel == rec][0]), mirror_part=float(2 * Sm[sel == rec][0])),
               bands=[])
    for lo, hi in ((0, 1), (1, 3), (3, 10), (10, 30), (30, 100), (100, 300), (300, 1000), (1000, 2001), (2001, 10 ** 9)):
        m = (depth >= lo) & (depth < hi)
        if m.any():
            row['bands'].append(dict(depth=[lo, hi], n=int(m.sum()), K_median=float(np.median(Ka[m])), K_max=float(Ka[m].max()),
                                     rT_min=float(rT[m].min()), rT_med=float(np.median(rT[m])), rT_max=float(rT[m].max()),
                                     rN_min=float(np.nanmin(rN[m])) if np.isfinite(rN[m]).any() else None, rN_max=float(np.nanmax(rN[m])) if np.isfinite(rN[m]).any() else None))
    res['rows'].append(row); fk.log(name, N, {k: v for k, v in row.items() if k != 'bands'}); [fk.log('   ', bd) for bd in row['bands']]
    save['N%d_l' % N] = sel; save['N%d_a' % N] = a; save['N%d_b' % N] = b; save['N%d_Ka' % N] = Ka; save['N%d_KbT' % N] = KbT; save['N%d_KbN' % N] = KbN
# scan of the top gap over many table sizes N: K_top(N) and r = K/Kb with the half-spacing rule
rng = np.random.default_rng(1); JS = 3000
if M > 4 * JS + 100:
    Nsamp = np.sort(rng.choice(np.arange(max(1000, M // 1000), M - JS - 2), size=min(20000, (M - JS) // 3), replace=False)); Kt = np.empty(len(Nsamp)); Kb = np.empty(len(Nsamp))
    for s0 in range(0, len(Nsamp), 2000):
        i = Nsamp[s0:s0 + 2000] - 1; a = g[i - 1]; b = g[i]
        nx = g[i[:, None] + 1 + np.arange(JS)[None, :]]
        S = (1 / ((nx - a[:, None]) * (nx - b[:, None]))).sum(1)
        Tt = nx[:, -1] + 0.5 / fk.dens(nx[:, -1], Q, par)
        tl = np.array([fk.tail_int(float(t), np.array([aa]), np.array([bb]), Q, par, n=120)[0] for t, aa, bb in zip(Tt, a, b)])
        mir = fk.dens(b, Q, par) / (2 * b)          # mirror zeros: about int dens/(y+b)^2, below 1e-3 of the total here
        Kt[s0:s0 + 2000] = 2 * (S + tl + mir)
        Tb = b + 0.5 / fk.dens(b, Q, par)
        Kb[s0:s0 + 2000] = 2 * np.array([fk.tail_int(float(t), np.array([aa]), np.array([bb]), Q, par, n=120)[0] for t, aa, bb in zip(Tb, a, b)]) + 2 * mir
    r = Kt / Kb; qs = [0.0, 0.001, 0.01, 0.1, 0.5, 0.9, 0.99, 0.999, 1.0]
    un = fk.dens(g[Nsamp], Q, par)
    res['topscan'] = dict(n=len(Nsamp), J=JS, quantiles=qs, K_top_quantiles=np.quantile(Kt, qs), K_top_over_dens2_quantiles=np.quantile(Kt / un ** 2, qs), r_quantiles=np.quantile(r, qs),
                          frac_K_gt_2p85=float((Kt > 2.85).mean()), frac_K_gt_22p92=float((Kt > 22.92).mean()), K_max=float(Kt.max()), N_at_max=int(Nsamp[np.argmax(Kt)]))
    fk.log(name, 'topscan', res['topscan'])
fk.jdump(res, outp + '.json'); np.savez(outp + '_pairs.npz', **save)
