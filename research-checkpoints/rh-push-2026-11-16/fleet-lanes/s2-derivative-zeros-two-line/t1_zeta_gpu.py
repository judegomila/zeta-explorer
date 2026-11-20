"""Combination 1, zeta at large height: winding number of zeta' on the boundary of [0.01, 0.5] x [T, T+H] for contiguous
windows of a strip [T0, T0 + D] (float64 Riemann-Siegel evaluator zgpu.py; a screen).  Also the number of sign changes of
Z on the right edge (zeros of zeta on the line in each window) and max over the left rectangle grid of Re zeta'/zeta.
Usage: t1_zeta_gpu.py out.json H T0:D [T0:D ...]"""
import sys, json, math, time, numpy as np
import zgpu
PI = math.pi
SL = 0.01
OUT = sys.argv[1]; H = float(sys.argv[2])
jobs = [(float(a.split(':')[0]), float(a.split(':')[1])) for a in sys.argv[3:]]

def loop_winding(w, d0, d1, nt, nx):
    """sampled winding of zeta' on [SL, 1/2] x [T0+d0, T0+d1] with nt / nx points per vertical / horizontal edge."""
    dv = np.linspace(d0, d1, nt); xh = np.linspace(SL - 0.5, 0.0, nx)
    _, zv, _ = w.zeta(dv, [0.0, SL - 0.5], order=1)
    _, zh, _ = w.zeta(np.array([d0, d1]), list(xh), order=1)
    path = np.concatenate([zh[:, 0], zv[0], zh[::-1, 1], zv[1][::-1]])
    da = np.angle(path[1:] / path[:-1])
    return da.sum() / (2 * PI), float(np.abs(da).max())

res = []
for T, D in jobs:
    t_start = time.time()
    N, lo, hi = zgpu.block_of(T)
    T0 = T if T - 2 > lo else lo + 2
    D = min(D, 0.01 * T0, hi - T0 - 2)
    nwin = int(D // H); D = nwin * H
    w = zgpu.Win(T0)
    sp = 2 * PI / math.log(T0 / (2 * PI)); per = max(64, int(math.ceil(H / (sp / 48))))
    nt = nwin * per + 1; nx = 97
    zgpu.log('T0 %.10g N %d windows %d H %g samples/edge %d (step %.4g) planned samples %d x N = %.2e terms; block memory <= %.1f GB'
             % (T0, w.N, nwin, H, per, H / per, nt, nt * w.N, 1.2e8 * 16 * 3 / 1e9))
    dv = np.linspace(0, D, nt)
    xleft = SL - 0.5
    def zprime(Zr, Zpr, x, d):
        # zeta' up to the common factor -i e^{-i theta(T0)}: e^{-i dtheta} (Z' - i theta' Z)
        tau = w.T0 + d - 1j * x
        return np.exp(-1j * w.dtheta(d - 1j * x)) * (Zpr - 1j * w.thp(tau)[0] * Zr)
    def vert(d, x):
        Zq, Zpq, _ = w.eval(d, [x], order=1); return zprime(Zq[0], Zpq[0], x, d)
    def horiz(dcut, xs_):
        out = []
        for i0 in range(0, len(xs_), 48):
            xx = list(xs_[i0:i0 + 48]); Zq, Zpq, _ = w.eval(np.array([dcut]), xx, order=1)
            out += [zprime(Zq[j], Zpq[j], xx[j], np.array([dcut]))[0] for j in range(len(xx))]
        return np.array(out)
    Z, Zp, _ = w.eval(dv, [0.0, xleft], order=1)
    vr = zprime(Z[0], Zp[0], 0.0, dv); vl = zprime(Z[1], Zp[1], xleft, dv)
    cuts = np.arange(nwin + 1) * H
    nx = 385; xh = np.linspace(xleft, 0.0, nx)
    vh = np.empty((nx, nwin + 1), dtype=np.complex128)
    for i0 in range(0, nx, 48):
        xx = list(xh[i0:i0 + 48]); Zc, Zpc, _ = w.eval(cuts, xx, order=1)
        for j in range(len(xx)): vh[i0 + j] = zprime(Zc[j], Zpc[j], xx[j], cuts)
    dar = np.angle(vr[1:] / vr[:-1]); dal = np.angle(vl[1:] / vl[:-1]); dah = np.angle(vh[1:] / vh[:-1])   # dah [nx-1, ncuts]
    sr = np.abs(dar); sl = np.abs(dal); sh = np.abs(dah)
    # local refinement of every step above THR: 64 sub-points, then 4096 if still above
    THR = 0.8; nref = 0; refined = []
    def refine_v(v, da, st, x):
        global_n = 0
        for sub in (64, 4096):
            bad = np.where(st > THR)[0]
            if len(bad) == 0: break
            fr = np.arange(1, sub) / sub
            dd = (dv[bad][:, None] + (dv[bad + 1] - dv[bad])[:, None] * fr[None, :]).ravel()
            vv = vert(dd, x).reshape(len(bad), sub - 1)
            path = np.concatenate([v[bad][:, None], vv, v[bad + 1][:, None]], axis=1)
            inc = np.angle(path[:, 1:] / path[:, :-1])
            da[bad] = inc.sum(axis=1); st[bad] = np.abs(inc).max(axis=1); global_n += len(bad)
        return global_n
    nref += refine_v(vr, dar, sr, 0.0); nref += refine_v(vl, dal, sl, xleft)
    for sub in (64, 4096):
        bi, bc = np.where(sh > THR)
        for i, c in zip(bi, bc):
            xs_ = xh[i] + (xh[i + 1] - xh[i]) * np.arange(1, sub) / sub
            path = np.concatenate([[vh[i, c]], horiz(cuts[c], xs_), [vh[i + 1, c]]])
            inc = np.angle(path[1:] / path[:-1]); dah[i, c] = inc.sum(); sh[i, c] = np.abs(inc).max(); nref += 1
    ccons = max(np.abs(vh[-1] - vr[::per]).max() / np.abs(vr[::per]).max(), np.abs(vh[0] - vl[::per]).max() / np.abs(vl[::per]).max())
    cr = np.concatenate([[0], np.cumsum(dar)]); cl = np.concatenate([[0], np.cumsum(dal)]); ch = dah.sum(axis=0)
    idx = np.arange(nwin) * per
    wind = (ch[:-1] + (cr[idx + per] - cr[idx]) - ch[1:] - (cl[idx + per] - cl[idx])) / (2 * PI)
    mstep = np.maximum(np.maximum(sr.reshape(nwin, per).max(axis=1), sl.reshape(nwin, per).max(axis=1)),
                       np.maximum(sh.max(axis=0)[:-1], sh.max(axis=0)[1:]))
    cnt = np.rint(wind).astype(int)
    bad = np.where((mstep > THR) | (np.abs(wind - cnt) > 1e-6))[0]
    refined = [dict(window=int(k), T=T0 + k * H, winding=float(wind[k]), step=float(mstep[k]), resolved=False) for k in bad]
    Zr = Z[0].real
    sc = (np.sign(Zr[1:]) != np.sign(Zr[:-1])).reshape(nwin, per).sum(axis=1)
    # left-rectangle grid: sign of Re zeta'/zeta on a coarse grid (x = -0.45 .. -0.01), sub-sampled in t
    xg = [-0.45, -0.3, -0.15, -0.05, -0.01]; sub = dv[::4]
    Zg, Zpg, _ = w.eval(sub, xg, order=1)
    mxre = -1e300
    for j, x in enumerate(xg):
        tau = w.T0 + sub - 1j * x
        ld = -1j * Zpg[j] / Zg[j] - w.thp(tau)[0]
        mxre = max(mxre, float(ld.real.max()))
    r = dict(T0=T0, N=w.N, D=D, H=H, windows=nwin, samples_per_edge=per, zeta_zeros_on_line=int(sc.sum()),
             count_zeta_prime_left=int(cnt.sum()), nonzero_windows=[dict(T=T0 + k * H, count=int(cnt[k])) for k in np.where(cnt != 0)[0]],
             max_abs_winding_residual=float(np.abs(wind - cnt).max()), max_step=float(mstep.max()), locally_refined_steps=int(nref), refined=refined,
             unresolved=[x['T'] for x in refined if not x['resolved']], corner_consistency=float(ccons),
             max_Re_logder_on_left_grid=mxre, sec=time.time() - t_start,
             riemann_von_mangoldt=(T0 + D) / (2 * PI) * math.log((T0 + D) / (2 * PI * math.e)) - T0 / (2 * PI) * math.log(T0 / (2 * PI * math.e)))
    res.append(r)
    zgpu.log(json.dumps({k: v for k, v in r.items() if k not in ('refined',)}))
    json.dump(dict(backend='cupy' if zgpu.GPU else 'numpy', SL=SL, strips=res), open(OUT, 'w'), indent=0)
