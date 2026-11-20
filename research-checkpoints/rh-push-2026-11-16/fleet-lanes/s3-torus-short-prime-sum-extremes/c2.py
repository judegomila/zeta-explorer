"""Combination 2: realised infimum of the barrier torus function against its torus infimum.

G(theta) = |B(theta)| - gamma |A(theta)|,  B = sum_{n<=N} w_n e^{-i theta.v(n)},  A = sum_{n<=N} w_n n^y e^{-i theta.v(n)},
w_n = exp((t/4) log^2 n - sigma log n), sigma = (1+y)/2 + (t/4) log(N^2 - t/16), gamma = exp(y/50 - (y/2) log(N^2 - t/16))
(source: barrier-mollifier-length-ceiling-2026-09, torus_floor_scan.py; rows on the line t + y^2/2 = 0.145, N = 690988).
Realised phases: theta_p = (x/2) log p, x on a grid of step dx covering whole windows (type-1 NUFFT in x).
Orbits: true (x near 4 pi N^2); haar (independent uniform base phases, same flow); sgn (true base, phase pi added on a random
half of the primes); beurling (primes p replaced by p + U(-1/2, 1/2), random base).
"""
import sys, math, json, time, argparse
import numpy as np
import torus as T, s3lib as S
from torus import xp, GPU, asnp
if GPU:
    import cupyx

ap = argparse.ArgumentParser()
ap.add_argument('--N', type=int, default=690988)
ap.add_argument('--rows', default='0.08:0.1418,0.10:0.14,0.12:0.1378,0.14:0.1352,0.16:0.1322,0.25:0.11375')
ap.add_argument('--logM', type=int, default=26)
ap.add_argument('--dx', type=float, default=0.1294)
ap.add_argument('--w', type=int, default=12)
ap.add_argument('--ntrue', type=int, default=16)
ap.add_argument('--nhaar', type=int, default=8)
ap.add_argument('--nsgn', type=int, default=4)
ap.add_argument('--nbeu', type=int, default=4)
ap.add_argument('--nchi', type=int, default=0)
ap.add_argument('--x0', type=float, default=0.0)
ap.add_argument('--out', default='c2.json')
ap.add_argument('--seed', type=int, default=5)
a = ap.parse_args(None if __name__ == '__main__' else [])
t00 = time.time()
N = a.N; M = 1 << a.logM; nf = 2 * M
ROWS = [tuple(float(v) for v in s.split(':')) for s in a.rows.split(',')]
NB, BW, BLO = 800, 0.005, -1.0


def coeffs(N, y, t):
    q = N * N - t / 16.0; lnq = math.log(q)
    sigma = (1 + y) / 2 + (t / 4) * lnq
    gamma = math.exp(0.02 * y - (y / 2) * lnq)
    ln = np.log(np.arange(1, N + 1, dtype=np.float64))
    w = np.exp((t / 4) * ln * ln - sigma * ln)
    return w, w * np.exp(y * ln), sigma, gamma


def tables(omega):
    beta_k = S.es_beta(a.w, 2.0)
    x = xp.asarray(omega) * (nf / (2 * math.pi))
    j0 = xp.ceil(x - a.w / 2)
    IDX = xp.empty((a.w, len(omega)), dtype=xp.int64); KER = xp.empty((a.w, len(omega)), dtype=xp.float64)
    for l in range(a.w):
        j = j0 + l
        z = (j - x) * (2.0 / a.w)
        KER[l] = xp.exp(beta_k * (xp.sqrt(xp.maximum(0.0, 1 - z * z)) - 1))
        IDX[l] = j.astype(xp.int64) % nf
    return IDX.ravel(), KER


def transform(IDXf, KER, strength, ksel, khat):
    grid = xp.zeros(nf, dtype=xp.complex128)
    vals = (KER * strength[None, :]).ravel()
    if GPU:
        gv = grid.view(xp.float64)
        cupyx.scatter_add(gv, 2 * IDXf, vals.real)
        cupyx.scatter_add(gv, 2 * IDXf + 1, vals.imag)
    else:
        grid += np.bincount(IDXf, weights=vals.real, minlength=nf) + 1j * np.bincount(IDXf, weights=vals.imag, minlength=nf)
    del vals
    F = xp.fft.fft(grid)
    del grid
    out = xp.abs(F[ksel] / khat)
    del F
    return out


if __name__ == '__main__':
    lev = T.Levels(N)
    pr = lev.primes
    print(f'N={N} primes={len(pr)} M={M} nf={nf} dx={a.dx} window length={M * a.dx:.4e} GPU={GPU} t={time.time() - t00:.0f}s', flush=True)
    print(f'planned: grid {nf * 16 / 2**30:.2f} GiB, FFT output {nf * 16 / 2**30:.2f} GiB, kernel tables {a.w * N * 16 / 2**30:.2f} GiB', flush=True)
    Lp = S.frac_logs(pr)
    rng = np.random.default_rng(a.seed)
    logp = np.log(pr.astype(np.float64))

    def extend(cp_):
        """values on the primes -> additive extension to n = 1..N (float)."""
        c = np.zeros(N + 1); c[pr] = cp_
        for ix in lev.lev:
            c[ix] = c[lev.par[ix]] + c[lev.spf[ix]]
        return c[1:]

    kmodes = xp.arange(-M // 2, M // 2)
    khat = S.es_hat(kmodes, nf, a.w, S.es_beta(a.w, 2.0)); ksel = kmodes % nf
    om_true = (a.dx / 2) * np.log(np.arange(1, N + 1, dtype=np.float64))
    assert om_true.max() < 2 * math.pi * 0.45
    TAB = tables(om_true)
    C = [coeffs(N, y, t) for (y, t) in ROWS]
    xstart = a.x0 or 4 * math.pi * N * N
    plan = [('true', i) for i in range(a.ntrue)] + [('haar', i) for i in range(a.nhaar)] + [('sgn', i) for i in range(a.nsgn)] + [('beurling', i) for i in range(a.nbeu)] + [('chi', i) for i in range(a.nchi)] + [('chihaar', i) for i in range(a.nchi)]
    res = dict(meta=dict(vars(a)), rows=[dict(y=y, t=t, sigma=C[i][2], gamma=C[i][3]) for i, (y, t) in enumerate(ROWS)], windows=[], hist_bins=[BLO, BW, NB])
    for kind, i in plan:
        tab = TAB
        if kind in ('true', 'sgn'):
            tc = int((xstart + (i + 0.5) * M * a.dx) / 2)                    # x_c = 2 tc
            cp_ = S.cycles_exact(tc, Lp)
            if kind == 'sgn':
                cp_ = cp_ + 0.5 * (rng.random(len(pr)) < 0.5)
            cyc = extend(cp_)
            xc = 2 * tc
        elif kind == 'haar':
            cyc = extend(rng.random(len(pr))); xc = None
        elif kind == 'chi':                                                  # L(chi mod 5): coefficients chi(n) w_n, true base phases
            tc = int((xstart + (i + 0.5) * M * a.dx) / 2)
            cp_ = S.cycles_exact(tc, Lp) - np.angle(T.chi5(pr) + (pr == 5)) / (2 * math.pi)
            cyc = extend(cp_); xc = 2 * tc
        elif kind == 'chihaar':
            cyc = extend(rng.random(len(pr))); xc = None
        else:
            lq = np.log(pr + rng.uniform(-0.5, 0.5, len(pr)))
            om = (a.dx / 2) * extend(lq)
            tab = tables(om)
            cyc = extend(rng.random(len(pr))); xc = None
        phase = xp.exp(xp.asarray(cyc) * (-2j * math.pi))
        if kind in ('chi', 'chihaar'):
            phase = phase * xp.asarray((np.arange(1, N + 1) % 5 != 0).astype(np.float64))
        for r, (y, t) in enumerate(ROWS):
            wB, wA, sigma, gamma = C[r]
            aB = T.retry(transform, tab[0], tab[1], xp.asarray(wB) * phase, ksel, khat)
            aA = T.retry(transform, tab[0], tab[1], xp.asarray(wA) * phase, ksel, khat)
            G = aB - gamma * aA
            j = int(G.argmin())
            jb = int(aB.argmin())
            h = asnp(xp.bincount(xp.clip(xp.floor((G - BLO) / BW), 0, NB - 1).astype(xp.int64), minlength=NB))
            jj = max(1, min(M - 2, j))
            g3 = asnp(G[jj - 1:jj + 2])
            den = g3[0] - 2 * g3[1] + g3[2]
            vert = float(g3[1] - (g3[0] - g3[2]) ** 2 / (8 * den)) if den > 0 else float(g3[1])
            rec = dict(kind=kind, i=i, row=r, xc=xc, minG=float(G[j]), minG_parab=vert, kmin=j - M // 2, absB_at_min=float(aB[j]), gA_at_min=float(gamma * aA[j]),
                       min_absB=float(aB[jb]), max_gA=float(gamma * aA.max()), meanG=float(G.mean()), stdG=float(G.std()),
                       frac_neg=float((G < 0).mean()), hist=h.tolist())
            res['windows'].append(rec)
            del aB, aA, G
            T.free()
        json.dump(res, open(a.out, 'w'))
        last = [w for w in res['windows'] if w['kind'] == kind and w['i'] == i]
        print(f'{kind} {i} t={time.time() - t00:.0f}s  minG per row: ' + ' '.join(f"{w['minG']:+.4f}" for w in last), flush=True)
    print('done', f'{time.time() - t00:.0f}s', flush=True)
