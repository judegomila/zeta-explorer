"""Combination 2, zeta at large height (float64 Riemann-Siegel evaluator; a screen).
For F = xi: Re F'/F (1/2 + x + it) = Im (Z'/Z)(t - i x) + O(x/t^2).  E_eta(D) = 0 for every eta iff Re F'/F >= 0 on D.
Rectangles D = (0, 1/2) x (T, T + H).  Grid: x = 0.5 * 2^-j (j = 0..11), t step = (mean spacing)/32; at x -> 0 the Laguerre
expression Z'^2 - Z Z'' on the line.  Per rectangle: number of grid points with Im(Z'/Z)/x < 0 (support of Q), min of
Im(Z'/Z)/x, min of the normalised Laguerre expression (Z'^2 - Z Z'')/(Z'^2 + theta'^2 Z^2).
Usage: t2_zeta_gpu.py out.json H T0:nrect [T0:nrect ...]"""
import sys, json, math, time, numpy as np
import zgpu
PI = math.pi
OUT = sys.argv[1]; H = float(sys.argv[2])
jobs = [(float(a.split(':')[0]), int(a.split(':')[1])) for a in sys.argv[3:]]
XS = [0.5 * 2.0 ** -j for j in range(12)]
res = []
for T, nrect in jobs:
    t_start = time.time()
    N, lo, hi = zgpu.block_of(T); T0 = T if T - 2 > lo else lo + 2
    nrect = int(min(nrect, (0.05 * T0) // H, (hi - T0 - 2) // H))
    w = zgpu.Win(T0)
    sp = 2 * PI / math.log(T0 / (2 * PI)); per = max(32, int(math.ceil(H / (sp / 32))))
    chunk = max(1, int(2.0e6 // (per * 1)) // 8)
    zgpu.log('T0 %.12g N %d rectangles %d H %g t-samples per rectangle %d; planned %.2e terms; host array per chunk %.2f GB'
             % (T0, w.N, nrect, H, per, nrect * per * w.N, chunk * per * 75 * 16 / 1e9))
    neg_pts = 0; neg_rect = 0; min_q = 1e300; min_q_at = None; min_lag = 1e300; min_lag_at = None; lag_neg = 0; tot_pts = 0
    min_q_x = [1e300] * len(XS); nz = 0; worst_rect = []
    th1 = 0.5 * math.log(T0 / (2 * PI))
    for r0 in range(0, nrect, chunk):
        r1 = min(nrect, r0 + chunk)
        d = r0 * H + (np.arange((r1 - r0) * per) + 0.5) * (H / per)
        Z, Zp, Zpp = w.eval(d, [0.0] + XS, order=2)
        q = np.array([(Zp[j + 1] / Z[j + 1]).imag / x for j, x in enumerate(XS)])      # [nx, nt]
        z0 = Z[0].real; z1 = Zp[0].real; z2 = Zpp[0].real
        lag = (z1 * z1 - z0 * z2) / (z1 * z1 + th1 * th1 * z0 * z0)
        nz += int((np.sign(z0[1:]) != np.sign(z0[:-1])).sum())
        tot_pts += q.size + lag.size
        neg = q < 0
        neg_pts += int(neg.sum()); lag_neg += int((lag < 0).sum())
        nr = neg.reshape(len(XS), r1 - r0, per).any(axis=(0, 2)) | (lag.reshape(r1 - r0, per) < 0).any(axis=1)
        neg_rect += int(nr.sum())
        for k in np.where(nr)[0]: worst_rect.append(T0 + (r0 + k) * H)
        for j in range(len(XS)): min_q_x[j] = min(min_q_x[j], float(q[j].min()))
        i = np.unravel_index(np.argmin(q), q.shape)
        if q[i] < min_q: min_q = float(q[i]); min_q_at = [XS[i[0]], float(d[i[1]])]
        k = int(np.argmin(lag))
        if lag[k] < min_lag: min_lag = float(lag[k]); min_lag_at = float(d[k])
    r = dict(T0=T0, N=w.N, H=H, rectangles=nrect, t_samples_per_rectangle=per, grid_points=tot_pts, zeta_zeros_seen=nz,
             negative_grid_points=neg_pts, negative_laguerre_points=lag_neg, rectangles_with_Q_nonzero=neg_rect, rectangles_flagged=worst_rect[:50],
             min_ImZpZ_over_x=min_q, min_at_x_delta=min_q_at, min_over_theta1sq=min_q / th1 ** 2, min_by_x=min_q_x,
             min_normalised_laguerre=min_lag, min_laguerre_at_delta=min_lag_at, sec=time.time() - t_start)
    res.append(r); zgpu.log(json.dumps(r))
    json.dump(dict(backend='cupy' if zgpu.GPU else 'numpy', xs=XS, strips=res), open(OUT, 'w'), indent=0)
