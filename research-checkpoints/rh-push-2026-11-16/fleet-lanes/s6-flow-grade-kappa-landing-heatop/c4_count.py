"""Combination 4, direct count: D(tau, T) = #real zeros of H_0 - #real zeros of H_{-tau} in blocks starting at T, for zeta
(Riemann-Siegel sum with the heat factor, sampler zgen/zl.py of lane s1) and for T-NR (same sum with the factor
c + 2 cos(w log q) carried through the heat flow, see tnr_samples).  tau in unfolded units at the start of each block
(t = 16 pi^2 tau / L0^2 in de Bruijn units); the prediction is evaluated with the unfolded tau at the block midpoint.
Usage: c4_count.py OUT.json T NZEROS TAU1,TAU2,.. [tnr:q:c]"""
import sys, os, math, json, time
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'zgen'))
if os.environ.get('RH_BACKEND', 'cpu') == 'cpu':
    os.environ['RH_BACKEND'] = 'cpu'; os.environ['OMP_NUM_THREADS'] = '1'; os.environ['OPENBLAS_NUM_THREADS'] = '1'
import numpy as np
from multiprocessing import Pool
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(os.path.join(HERE, 'zgen'))
import zl, rsz as R
sys.path.insert(0, HERE)
import c4lib

def tnr_samples(Ta, deltas, tau, q, c):
    """model of Xi^TNR_t(w)/A(w), w = Ta + delta, t = 16 pi^2 tau/L0^2 (tau < 0 backward):
    sum_n a_n [2c cos(phi_n) + 2E (e^{d k_n} cos(lam w + pi d/4 + phi_n) + e^{-d k_n} cos(lam w + pi d/4 - phi_n))] + R (c + 2E cos(lam w + pi d/4)),
    a_n = n^-1/2 exp(-(t/4) log n (L - log n)), phi_n = theta(w) - w log n, k_n = L/2 - log n, lam = log q, d = lam t/2, E = exp(t lam^2/4)."""
    import mpmath as mp
    mp.mp.dps = 50
    lam = math.log(q); L0 = math.log(Ta / (2 * math.pi)); t = 16 * math.pi ** 2 * tau / L0 ** 2; d_ = lam * t / 2; E = math.exp(t * lam * lam / 4)
    Nmax = int(math.floor(math.sqrt((Ta + float(deltas.max())) / (2 * math.pi)))) + 1
    th0 = mp.siegeltheta(mp.mpf(Ta)); twopi = 2 * mp.pi
    cph = np.array([float((th0 - mp.mpf(Ta) * mp.log(n)) % twopi) for n in range(1, Nmax + 1)])
    lam0 = float((mp.mpf(Ta) * mp.log(q)) % twopi)
    logn = np.log(np.arange(1, Nmax + 1.0)); out = np.empty(len(deltas)); C0, C1, C2 = R.psi_tables()
    from numpy.polynomial import chebyshev as Ch
    CH = max(64, int(4e6 // Nmax))
    for s in range(0, len(deltas), CH):
        dl = deltas[s:s + CH]; w = Ta + dl; tau_ = w / (2 * math.pi); rt = np.sqrt(tau_); N = np.floor(rt).astype(np.int64); p = rt - N
        Lb = np.log(tau_); dth = R.dtheta(Ta, dl)
        ph = cph[None, :] + dth[:, None] - dl[:, None] * logn[None, :]
        a = np.exp(-0.5 * logn[None, :] - 0.25 * t * logn[None, :] * (Lb[:, None] - logn[None, :]))
        a = a * (np.arange(1, Nmax + 1)[None, :] <= N[:, None])
        k = 0.5 * Lb[:, None] - logn[None, :]
        lw = (lam0 + dl * lam + math.pi * d_ / 4)[:, None]
        z = (a * (2 * c * np.cos(ph) + 2 * E * (np.exp(d_ * k) * np.cos(lw + ph) + np.exp(-d_ * k) * np.cos(lw - ph)))).sum(1)
        xx = 2 * p - 1
        Rm = Ch.chebval(xx, C0) + Ch.chebval(xx, C1) / np.sqrt(tau_) + Ch.chebval(xx, C2) / tau_
        z += np.where(N % 2 == 1, 1.0, -1.0) * tau_ ** -0.25 * Rm * math.exp(-math.pi ** 2 * tau) * (c + 2 * E * np.cos(lw[:, 0]))
        out[s:s + CH] = z
    return out

def tnr_block(Ta, Tb, tau, q, c):
    W = R.W; lam = math.log(q); Lend = math.log(Tb / (2 * math.pi))
    h = math.pi / (0.5 * Lend + lam) / R.OS; pad = (W + 6) * h
    J = int((Tb - Ta + 2 * pad) / h) + 2; deltas = -pad + h * np.arange(J)
    S = tnr_samples(Ta, deltas, tau, q, c)
    rc, nh, bad = zl.roots_of_samples(S)
    g = Ta + (-pad + rc * h)
    g, nref, nfail = zl.refine_close(g, lambda x: tnr_samples(Ta, x - Ta, tau, q, c), 2 * math.pi / Lend)
    return g[(g >= Ta) & (g < Tb)]

def blocks(Ta, nz, maxsamp=float(os.environ.get("RH_MAXSAMP", "1.5e5"))):
    T = Ta; out = []; n = 0
    while n < nz:
        L = math.log(T / (2 * math.pi)); sp = 2 * math.pi / L
        Tb = int(min(T * 1.1 + 1, T + maxsamp * sp / 4, T + (nz - n) * sp + 2))
        out.append((T, Tb)); n += (Tb - T) / sp; T = Tb
    return out

def work(a):
    Ta, Tb, taus, tnr = a
    L0 = math.log(Ta / (2 * math.pi)); Lm = math.log(0.5 * (Ta + Tb) / (2 * math.pi))
    row = dict(Ta=Ta, Tb=Tb, L0=L0, Lmid=Lm)
    if tnr:
        q, c = tnr
        g0 = tnr_block(Ta, Tb, 0.0, q, c); row['n0'] = int(len(g0))
        gz, *_ = zl.zeta_block(Ta, Tb, 0.0, budget=2e7); row['n0_zeta'] = int(len(gz))
        row['max_shift_vs_zeta'] = float(np.abs(g0 - gz).max()) if len(g0) == len(gz) else None
        for tau in taus:
            row['n_%g' % tau] = int(len(tnr_block(Ta, Tb, -tau, q, c)))
            row['nz_%g' % tau] = int(len(zl.zeta_block(Ta, Tb, -tau, budget=2e7)[0]))
        g = gz
    else:
        g, nh, bad, ex = zl.zeta_block(Ta, Tb, 0.0, budget=float(os.environ.get('RH_BUDGET', '2e7'))); row['n0'] = int(len(g)); row['expected'] = ex
        for tau in taus:
            row['n_%g' % tau] = int(len(zl.zeta_block(Ta, Tb, -tau, budget=float(os.environ.get('RH_BUDGET', '2e7')))[0]))
    # gap criterion on the tau = 0 list of the block
    x = zl.theta(g) / math.pi; s = np.diff(x)
    i = np.nonzero(s < 0.45)[0]; i = i[(i > 45) & (i < len(x) - 47)]
    B = c4lib.env_B(x, i, 40); tc = c4lib.tau_c(s[i], B)
    for tau in taus:
        tl = tau * (Lm / L0) ** 2
        row['gap_%g' % tau] = int(2 * (tc <= tl).sum()); row['gap0_%g' % tau] = int(2 * (s[i] ** 2 / 8 <= tl).sum()); row['tauloc_%g' % tau] = tl
    row['nsmall'] = int(len(i)); row['B_mean_close'] = float(B[s[i] < 0.3].mean()) if (s[i] < 0.3).any() else None
    row['small'] = [s[i][s[i] < 0.12].tolist(), B[s[i] < 0.12].tolist()]
    return row

if __name__ == '__main__':
    out, T, nz, taus = sys.argv[1], int(float(sys.argv[2])), int(float(sys.argv[3])), [float(v) for v in sys.argv[4].split(',')]
    tnr = None
    if len(sys.argv) > 5: _, q, c = sys.argv[5].split(':'); tnr = (float(q), float(c))
    bl = [(a, b, taus, tnr) for a, b in blocks(T, nz)]
    NW = int(os.environ.get('RH_WORKERS', '4')); zl.log('T', T, 'blocks', len(bl), 'workers', NW, 'backend', 'gpu' if zl.GPU else 'cpu')
    rows = []; t0 = time.time()
    if zl.GPU: rows = [work(b) for b in bl]
    else:
        with Pool(NW) as p:
            for k, r in enumerate(p.imap(work, bl, chunksize=1)):
                rows.append(r)
                if k % max(1, len(bl) // 8) == 0: zl.log('block %d/%d' % (k + 1, len(bl)))
    Bb = c4lib.Bbar(); res = dict(T=T, Tend=bl[-1][1], taus=taus, tnr=tnr, n0=sum(r['n0'] for r in rows), Bbar=Bb, sec=time.time() - t0, table=[])
    for tau in taus:
        D = sum(r['n0'] - r['n_%g' % tau] for r in rows); Dg = sum(r['gap_%g' % tau] for r in rows); Dg0 = sum(r['gap0_%g' % tau] for r in rows)
        P = {m: sum(r['n0'] * c4lib.pred(r['tauloc_%g' % tau], r['Lmid'], 1, bb, mod) for r in rows) for m, bb, mod in (('gue', None, 'gue'), ('bk_pair', None, 'bk'), ('bk_pair_triple', Bb, 'bk'))}
        e = dict(tau=tau, D=D, D_gap=Dg, D_gap_isolated=Dg0, pred=P, ratio={k: (D / v if v else None) for k, v in P.items()}, rel_stat=(1 / math.sqrt(D / 2) if D else None))
        if tnr: e['D_zeta'] = sum(r['n0_zeta'] - r['nz_%g' % tau] for r in rows); e['ratio_zeta'] = {k: (e['D_zeta'] / v if v else None) for k, v in P.items()}
        res['table'].append(e); print(json.dumps(e), flush=True)
    res['rows'] = rows
    json.dump(res, open(os.path.join(HERE, out), 'w'))
