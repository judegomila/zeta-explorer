"""Combination 3, zeta at large height (float64 Riemann-Siegel evaluator; a screen): for a window [T0, T0+H]
D(w) = log|zeta(w)(w-1)/w| - int_{T0}^{T0+H} P_w(t) log|zeta(1/2+it)| dt,  w = sigma1 + i (T0 + tau), sigma1 in {1, 1.2, 1.5}.
Zeros of Z in the window by sign changes on a grid of step (mean spacing)/24 and 46 bisections; cells between breakpoints
(zeros, local minima of |Z|, uniform mesh 0.1) with the same quadrature as t3_low.py.
Usage: t3_zeta_gpu.py out.json H T0 [T0 ...]"""
import sys, json, math, time, numpy as np
import zgpu
PI = math.pi
OUT = sys.argv[1]; HREQ = float(sys.argv[2]); SIG1 = [1.0, 1.2, 1.5]; M = 24
res = []
for T in [float(a) for a in sys.argv[3:]]:
    t_start = time.time()
    N, lo, hi = zgpu.block_of(T); T0 = lo + 2.0 if T - 2 < lo or T + HREQ + 2 > hi else T
    H = min(HREQ, hi - T0 - 2, 0.05 * T0)
    w = zgpu.Win(T0)
    sp = 2 * PI / math.log(T0 / (2 * PI)); step = sp / 24; n = int(H / step) + 1
    d = np.arange(n) * step; H = d[-1]
    Z = w.eval(d, [0.0], order=0)[0][0].real
    ic = np.where(np.sign(Z[1:]) != np.sign(Z[:-1]))[0]
    a = d[ic].copy(); b = d[ic + 1].copy(); sa = np.sign(Z[ic])
    for _ in range(46):
        mid = 0.5 * (a + b); zm = w.eval(mid, [0.0], order=0)[0][0].real
        left = np.sign(zm) == sa
        a = np.where(left, mid, a); b = np.where(left, b, mid)
    zeros = 0.5 * (a + b)
    az = np.abs(Z); im = np.where((az[1:-1] < az[:-2]) & (az[1:-1] <= az[2:]))[0] + 1
    bp = np.unique(np.concatenate([np.arange(0, H + 1e-9, 0.1), [H], zeros, d[im]]))
    keep = np.concatenate([[True], np.diff(bp) > 1e-9]); bp = bp[keep]
    gx, gw = np.polynomial.legendre.leggauss(M); u = (gx + 1) / 2; wu = gw / 2
    phi = 6 * u ** 5 - 15 * u ** 4 + 10 * u ** 3; dphi = 30 * u ** 2 * (1 - u) ** 2
    ca = bp[:-1]; cb = bp[1:]
    tn = (ca[:, None] + (cb - ca)[:, None] * phi[None, :]).ravel(); wt = ((cb - ca)[:, None] * (dphi * wu)[None, :]).ravel()
    zgpu.log('T0 %.12g N %d H %.1f zeros %d cells %d nodes %d (planned %.2e terms)' % (T0, w.N, H, len(zeros), len(ca), len(tn), len(tn) * w.N))
    Zn = w.eval(tn, [0.0], order=0)[0][0]
    U = np.log(np.abs(Zn.real))
    taus = np.arange(0.0, H + 1e-9, 0.5)
    xs = [s - 0.5 for s in SIG1]
    zw = w.zeta(taus, xs, order=1)[0]
    r = dict(T0=T0, N=w.N, H=H, zeros=int(len(zeros)), rvm=(T0 + H) / (2 * PI) * math.log((T0 + H) / (2 * PI * math.e)) - T0 / (2 * PI) * math.log(T0 / (2 * PI * math.e)),
             cells=int(len(ca)), nodes=int(len(tn)), int_U=float((U * wt).sum()), min_abs_Z_at_nodes=float(np.abs(Zn.real).min()), rows=[])
    for i, s1 in enumerate(SIG1):
        aa = s1 - 0.5
        ww = s1 + 1j * (T0 + taus)
        LW = np.log(np.abs(zw[i])) + np.log(np.abs((ww - 1) / ww))
        Dv = np.empty(len(taus))
        for j0 in range(0, len(taus), 64):
            tt = taus[j0:j0 + 64]
            P = (aa / PI) / (aa * aa + (tn[None, :] - tt[:, None]) ** 2)
            Dv[j0:j0 + 64] = LW[j0:j0 + 64] - (P * (U * wt)[None, :]).sum(axis=1)
        row = dict(sigma1=s1)
        for m in [5.0, 20.0, 50.0, H / 4]:
            sel = (taus >= m) & (taus <= H - m)
            if sel.any():
                row['margin_%g' % m] = dict(max_abs_D=float(np.abs(Dv[sel]).max()), min_D=float(Dv[sel].min()), max_D=float(Dv[sel].max()),
                                            rms_D=float(np.sqrt((Dv[sel] ** 2).mean())), tail_scale_a_over_pi_m=aa / (PI * m))
        mid = len(taus) // 2
        row['D_at_centre'] = float(Dv[mid]); row['logabs_zeta_w_centre'] = float(LW[mid])
        r['rows'].append(row)
    # Arb spot checks: log|zeta(w)| at 3 points, Z at 6 nodes
    chk = []
    for j in [len(taus) // 3, len(taus) // 2]:
        for i, s1 in enumerate(SIG1):
            ref = zgpu.arb_zeta_jet(s1, T0, taus[j], n=1)[0]; chk.append(abs(zw[i][j] - ref) / abs(ref))
    rng = np.random.default_rng(3); ck2 = []
    for j in rng.integers(0, len(tn), 6):
        ref = zgpu.arb_zeta_jet(0.5, T0, tn[j], n=1)[0]; ck2.append(abs(abs(ref) - abs(Zn[j].real)) / abs(ref))
    r['arb_check_rel_err_zeta_w'] = float(max(chk)); r['arb_check_rel_err_absZ_nodes'] = float(max(ck2)); r['sec'] = time.time() - t_start
    res.append(r); zgpu.log(json.dumps(r))
    json.dump(dict(backend='cupy' if zgpu.GPU else 'numpy', windows=res), open(OUT, 'w'), indent=0)
