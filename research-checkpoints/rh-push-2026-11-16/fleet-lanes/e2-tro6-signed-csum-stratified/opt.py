#!/usr/bin/env python3
"""opt.py -- row-sensitive statistics of the theta-row form by squarefull stratum of the row, at path point k.

x_{s,v,sigma}(c) = alpha(c) gamma_2(c) w_k(c) y(c),  y = leave-one-out twisted sum of stratum s, variant v
(v = 0: rho_hat; v = 1, 2: random-phase rows), projection 'loo' or 'band' (cell means of y conj(pred) removed).
t(nu) = |sum_c nu(c) x(c)|^2 / sum_c |x(c)|^2.
Reported per column: t at nu = 1; t at the aligned (non-multiplicative) polar direction conj(alpha gamma_2 pred);
max and mean of t over F2 = {alpha^-k N^-iv} and F1 = {Dirichlet characters mod split primes of norm <= PMAX};
sup of t over completely multiplicative unimodular nu with free phases at the primes of norm <= P (nu = 1 at the others),
by cyclic coordinate ascent (closed-form phase per prime; block step for the primes above sqrt(max norm), whose
conductor sets are disjoint), nested levels P, warm start; a second run from a random multiplicative start at P = all.
usage: opt.py ACCDIR SEXTIC_DIR k NW out.json [SNAPDIR]
"""
import os, sys, math, time, json
import numpy as np
ACC, SX, k, NW, OUT = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
SNAP = sys.argv[6] if len(sys.argv) > 6 else None
sys.path.insert(0, SX)
import alib as A, zomega as Z
Z6 = Z.ZETA6
NS, NV = 3, 3; NCOL = NV * 6
NA, NVB, KA, JV = 1024, 4096, 12, 128
PMAX = 199; LEVELS = [30, 100, 300, 1000]; NSWEEP = 6
t0 = time.time()
def P(*a): print(f"[k={k} {time.time()-t0:6.0f}s]", *a, flush=True)
T = A.SFTable(os.path.join(SX, 'data', 'sf_1e7.npz'))
gm = np.load(os.path.join(ACC, 'geom.npz')); perm = gm['perm']; ne = int(gm['ne']); win = gm['win']; Rs = gm['Rs']; Qs = gm['Qs']
nsh = int(gm['nsh']); cop = [gm['cls_even'], gm['cls_odd']]
R = float(Rs[k])
ne0 = Z.mul((2, 0), Z.power(Z.LAM, 5))
e0 = T.node_exponents(ne0)[perm]; assert (e0 >= 0).all()
res = dict(k=k, Q=float(Qs[k]), R=R, cols=[], meta={})
rng = np.random.default_rng(777 + k)
nr = 0; cnt = 0
for w in range(NW):
    pt = np.load(os.path.join(ACC, f'part_{k:02d}_{w}.npz')); nr = nr + pt['nr']; cnt = cnt + pt['cnt']
res['meta']['row_norm2'] = nr.tolist(); res['meta']['row_cnt'] = cnt.tolist()

for p in (0, 1):
    lo, hi = int(win[k][p][0]), int(win[k][p][1]); nw = hi - lo
    ti = perm[lo:hi]
    Nf = T.N[ti].astype(float); na = T.na[ti].astype(np.int64); nb = T.nb[ti].astype(np.int64)
    alpha = ((na - nb / 2.0) + 1j * (nb * math.sqrt(3) / 2.0)) / np.sqrt(Nf)
    pred = np.conj(Z6[e0[lo:hi]]) * T.g1[ti]
    cls = T.m4[ti].astype(np.int64)
    grid = A.geom_grid(1000, T.X, 90)
    sh = np.searchsorted(grid.astype(np.int64), T.N[ti], side='left')
    cell = sh * 12 + cls; cell = cell - cell.min(); ncell = int(cell.max()) + 1
    cc = np.bincount(cell, minlength=ncell).astype(float); cc[cc == 0] = 1
    wk = np.exp(-2 * np.log(Nf / R) ** 2) / np.sqrt(Nf)
    pre = alpha * T.g2[ti] * wk
    ual = np.conj(alpha * T.g2[ti] * pred)                         # aligned polar direction (unit modulus)
    P(f"parity {p}: window {nw} conductors; planned x and nu: 2 x {nw} x {2*NCOL} complex64 = {2*nw*2*NCOL*8/2**30:.2f} GB")
    # ---- loads
    Y = []
    sr = 0; sc = 0
    for w in range(NW):
        pt = np.load(os.path.join(ACC, f'part_{k:02d}_{w}.npz')); sr = sr + pt[f'sr{p}']; sc = sc + pt[f'sc{p}']
    for s in range(NS):
        S = 0
        for w in range(NW):
            S = S + np.load(os.path.join(ACC, f'S_{k:02d}_{w}_{s}_{p}.npy')).astype(complex)
        if SNAP and s == 0: Sall = S[:, :6].copy()
        elif SNAP: Sall += S[:, :6]
        for v in range(NV):
            slf = sr[s] if v == 0 else sc[s, v - 1]
            for i, sg in enumerate(cop[p]):
                msk = cls == sg
                S[msk, v * 6 + i] -= (pred * slf)[msk]
        Y.append(S)
    if SNAP:
        sn = np.load(os.path.join(SNAP, f'snap_{k:02d}.npz'))
        ref = sn['S'][0, lo:hi].astype(complex) + sn['S'][1, lo:hi]
        P(f"validation against round-2 snapshot: max |sum_s S_s - S_r2| = {np.abs(Sall - ref).max():.3e} on values of rms {np.sqrt((np.abs(ref)**2).mean()):.3f}")
        srr = sn['selfacc'][0, lo:hi] + sn['selfacc'][1, lo:hi]
        P(f"   self term: max diff {np.abs(sr.sum(0) - srr).max():.3e} (rms {np.sqrt((srr**2).mean()):.3e})")
        res['meta'][f'valid{p}'] = float(np.abs(Sall - ref).max())
        del sn, ref, Sall
    Y.append(Y[0] + Y[1] + Y[2])                                   # stratum 3 = all generic rows
    # ---- factorisation of the window conductors
    cur = ti.copy(); loc = np.arange(nw); pc = []; pk = []
    while True:
        ok = cur > 0
        if not ok.any(): break
        pc.append(loc[ok]); pk.append(T.last[cur[ok]].astype(np.int64)); cur = np.where(ok, T.parent[cur], 0)
    pc = np.concatenate(pc); pk = np.concatenate(pk)
    assert np.allclose(np.bincount(pc, weights=np.log(T.pq[pk].astype(float)), minlength=nw), np.log(Nf)), 'factorisation'
    pcut = int(math.isqrt(int(Nf.max()))) + 1
    small = T.pq[pk] <= pcut
    o = np.lexsort((pc[small], T.pq[pk[small]], pk[small])); spk = pk[small][o]; spc = pc[small][o]
    ub, st_ = np.unique(spk, return_index=True); en_ = np.append(st_[1:], len(spk))
    oo = np.argsort(T.pq[ub], kind='stable'); sm_list = [(int(T.pq[ub[i]]), spc[st_[i]:en_[i]]) for i in oo]
    lpk = pk[~small]; lpc = pc[~small]; o = np.argsort(lpk, kind='stable'); lpk = lpk[o]; lpc = lpc[o]
    assert len(np.unique(lpc)) == len(lpc)
    lstart = np.flatnonzero(np.concatenate([[True], lpk[1:] != lpk[:-1]])); lcount = np.diff(np.append(lstart, len(lpk)))
    nfree = {str(L): int(sum(1 for q, _ in sm_list if q <= L)) for L in LEVELS}
    nfree['small'] = len(sm_list); nfree['all'] = len(sm_list) + len(lstart)
    res['meta'][f'nfree{p}'] = nfree; res['meta'][f'nw{p}'] = nw; res['meta'][f'pcut{p}'] = pcut
    P(f"free phases: {nfree}, pcut {pcut}")
    # ---- F1 tables
    f1 = []
    for kk in np.flatnonzero((~T.pinert) & (T.pq >= 7) & (T.pq <= PMAX)):
        pp = int(T.pp[kk]); ww = int(T.pw[kk]); r = (na % pp + (nb % pp) * ww) % pp
        for gcand in range(2, pp):
            x_ = 1; seen = 0
            for _ in range(pp - 1):
                x_ = x_ * gcand % pp; seen += 1
                if x_ == 1: break
            if seen == pp - 1: break
        dl = np.full(pp, -1); x_ = 1
        for e in range(pp - 1):
            dl[x_] = e; x_ = x_ * gcand % pp
        f1.append((pp, dl[r]))
    th_bin = np.minimum(((np.angle(alpha) + np.pi) / (2 * np.pi) * NA).astype(np.int64), NA - 1)
    u_bin = np.minimum(((np.log(Nf / R) + 3.2) / 6.4 * NVB).astype(np.int64), NVB - 1)
    flat = th_bin * NVB + u_bin
    ksel = np.arange(-KA, KA + 1) % NA; jsel = np.arange(-JV, JV + 1) % NVB
    for s in range(NS + 1):
        y = Y[s]
        yb = np.empty_like(y); cp = np.conj(pred)
        for c in range(NCOL):
            z = y[:, c] * cp
            mz = (np.bincount(cell, weights=z.real, minlength=ncell) + 1j * np.bincount(cell, weights=z.imag, minlength=ncell)) / cc
            yb[:, c] = y[:, c] - pred * mz[cell]
        x = np.concatenate([y, yb], axis=1) * pre[:, None]          # [nw, 36]: loo cols 0..17, band cols 18..35
        del yb
        E = (np.abs(x) ** 2).sum(0)
        X0 = x.sum(0); t_triv = np.abs(X0) ** 2 / E
        t_al = np.abs((ual[:, None] * x).sum(0)) ** 2 / E
        # F2
        f2max = np.zeros(2 * NCOL); f2mean = np.zeros(2 * NCOL)
        for c in range(2 * NCOL):
            H = (np.bincount(flat, weights=x[:, c].real, minlength=NA * NVB) + 1j * np.bincount(flat, weights=x[:, c].imag, minlength=NA * NVB)).reshape(NA, NVB)
            F = np.fft.fft2(H)[np.ix_(ksel, jsel)]
            tt = np.abs(F) ** 2 / E[c]; tt[KA, JV] = np.nan
            f2max[c] = np.nanmax(tt); f2mean[c] = np.nanmean(tt)
        # F1
        f1max = np.zeros(2 * NCOL); f1sum = np.zeros(2 * NCOL); f1n = 0
        for pp, dlr in f1:
            okk = dlr >= 0
            for c in range(2 * NCOL):
                h = np.bincount(dlr[okk], weights=x[okk, c].real, minlength=pp - 1) + 1j * np.bincount(dlr[okk], weights=x[okk, c].imag, minlength=pp - 1)
                tt = np.abs(np.fft.fft(h)[1:]) ** 2 / E[c]
                f1max[c] = max(f1max[c], tt.max()); f1sum[c] += tt.sum()
            f1n += pp - 2
        # optimiser
        xs = x.astype(np.complex64)
        def run(nu, X, levels):
            out = {}
            def sweep_small(Pmax):
                nonlocal X
                for q, idx in sm_list:
                    if q > Pmax: break
                    Bv = (nu[idx] * xs[idx]).sum(0, dtype=complex); Av = X - Bv
                    aa = np.abs(Av); bb = np.abs(Bv); good = (aa > 0) & (bb > 0)
                    phz = np.where(good, Av * np.conj(Bv) / np.where(good, aa * bb, 1), 1)
                    nu[idx] *= phz.astype(np.complex64); X = Av + phz * Bv
            def sweep_large():
                nonlocal X
                if len(lpc) == 0: return
                vals = nu[lpc] * xs[lpc]
                Bg = np.add.reduceat(vals, lstart, axis=0).astype(complex); bb = np.abs(Bg)
                u = X / np.abs(X)
                phz = np.where(bb > 0, u[None, :] * np.conj(Bg) / np.where(bb > 0, bb, 1), 1)
                nu[lpc] *= np.repeat(phz.astype(np.complex64), lcount, axis=0)
                X = X - Bg.sum(0) + (phz * Bg).sum(0)
            for L in levels:
                if L == 'all':
                    for _ in range(NSWEEP):
                        sweep_small(pcut); sweep_large()
                else:
                    Pm = pcut if L == 'small' else L
                    for _ in range(NSWEEP): sweep_small(Pm)
                X = (nu * xs).sum(0, dtype=complex)                 # recompute (removes drift)
                out[str(L)] = (np.abs(X) ** 2 / E).tolist()
            return out
        nu = np.ones(xs.shape, np.complex64)
        o1 = run(nu, xs.sum(0, dtype=complex), LEVELS + ['small', 'all'])
        # second start: random completely multiplicative
        phs = np.exp(2j * np.pi * rng.random(T.np_))
        lg = np.bincount(pc, weights=np.angle(phs[pk]), minlength=nw)
        nu = np.repeat(np.exp(1j * lg).astype(np.complex64)[:, None], xs.shape[1], axis=1)
        t_rs = (np.abs((nu * xs).sum(0, dtype=complex)) ** 2 / E).tolist()
        o2 = run(nu, (nu * xs).sum(0, dtype=complex), ['all'])
        del nu
        for c in range(2 * NCOL):
            pj = c // NCOL; v = (c % NCOL) // 6; i = c % 6
            res['cols'].append(dict(par=p, s=s, proj=['loo', 'band'][pj], v=v, sigma=int(cop[p][i]), E=float(E[c]), t_triv=float(t_triv[c]),
                                    t_al=float(t_al[c]), f2max=float(f2max[c]), f2mean=float(f2mean[c]), f1max=float(f1max[c]),
                                    f1mean=float(f1sum[c] / f1n), t_rs=float(t_rs[c]), opt={L: o1[L][c] for L in o1}, opt2_all=o2['all'][c]))
        P(f"stratum {s} done; opt all (rho, loo) {np.mean(o1['all'][:6]):.1f} (rnd) {np.mean(o1['all'][6:18]):.1f}; band rho {np.mean(o1['all'][18:24]):.1f} rnd {np.mean(o1['all'][24:36]):.1f}")
        del x, xs
    del Y
res['meta']['f1_targets'] = int(f1n); res['meta']['f2_targets'] = int((2 * KA + 1) * (2 * JV + 1) - 1)
json.dump(res, open(OUT, 'w'))
P('done')
