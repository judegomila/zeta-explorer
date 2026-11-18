#!/usr/bin/env python3
"""acc.py -- per-conductor twisted sums of the complete sextic theta estimator, split by the squarefull type of the row.

Input (read-only): rows_XX.npz and static.npz of r2-tro6-nonpolar-scale (rho_str, rho_cor, dn, W, flags, six per half row),
the exact Gauss-sum table sf_1e7.npz.  Nothing is refitted.
Strata of the row m (primes away from 2 and lambda): 0 = all exponents <= 1; 1 = max exponent 2; 2 = max exponent >= 3
(rows with all exponents = 0 mod 6 are excluded, as in round 2).
Variants: 0 = rho_hat; 1, 2 = rho_hat with an independent uniform phase per (row, class) (random-phase rows).
Per conductor c (order of scale.py: parity, shell, class):
   S[s][c, v*6+i] = sum_{half rows in stratum s} rho_v,sigma_i(c)(m) chi_c(m)
   selfr[s][c] = sum wt_m(c);  selfc[s][v-1][c] = sum phase_v(m, class(c)) wt_m(c)       (leave-one-out terms)
At the end of bin j the window slice for k = j (R_j = Q_j^1.4) is written.
usage: acc.py ROWDIR SEXTIC_DIR OUTDIR NPROC [JMAX]
"""
import os, sys
for v in ('OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'):
    os.environ[v] = '1'
import math, time
import multiprocessing as mp
import numpy as np
from scipy.linalg.blas import cgeru
ROWDIR, SX, OUTD, NPROC = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
JMAX = int(sys.argv[5]) if len(sys.argv) > 5 else 10
sys.path.insert(0, SX)
import alib as A, zomega as Z
Z6 = Z.ZETA6
LUT = np.concatenate([Z6, [0]]).astype(np.complex64)
WCUT = 1.6; NS = 3; NV = 3; SEED = 20261118
G = {}
def P(*a): print(*a, flush=True)

def setup():
    t0 = time.time()
    T = A.SFTable(os.path.join(SX, 'data', 'sf_1e7.npz')); n = T.n
    stc = np.load(os.path.join(ROWDIR, 'static.npz'))
    Qs = stc['Qs']; Rs = stc['Rs']; grid = stc['grid']; a_th = stc['a_th']; nsh = len(grid)
    assert np.array_equal(grid, A.geom_grid(1000, T.X, 90))
    shell0 = np.searchsorted(grid.astype(np.int64), T.N, side='left')
    par0 = (((T.N - 1) // 6) % 2).astype(np.int64)
    key = par0 * (nsh * 12) + shell0 * 12 + T.m4.astype(np.int64)
    perm = np.argsort(key, kind='stable'); ks = key[perm]
    L = 2 * nsh * 12
    starts = np.searchsorted(ks, np.arange(L), 'left'); ends = np.searchsorted(ks, np.arange(L), 'right')
    ne = int(starts[nsh * 12]); assert ne == int(stc['ne'])
    clsp = T.m4[perm].astype(np.int64); shp = shell0[perm]
    cop = [stc['cls_even'], stc['cls_odd']]
    win = []
    for R in Rs:
        s_lo = max(int(np.searchsorted(grid.astype(float), R * math.exp(-WCUT), 'left')), 1)
        s_hi = min(int(np.searchsorted(grid.astype(float), R * math.exp(WCUT), 'left')), nsh - 1)
        win.append([(int(starts[p * nsh * 12 + s_lo * 12]), int(ends[p * nsh * 12 + s_hi * 12 + 11])) for p in (0, 1)])
    G.update(T=T, n=n, perm=perm, ne=ne, clsp=clsp, binidx=shp * 12 + clsp, cop=cop, win=win, a_th=a_th, nsh=nsh, Qs=Qs, Rs=Rs)
    np.savez(os.path.join(OUTD, 'geom.npz'), perm=perm, ne=ne, win=np.array(win), Qs=Qs, Rs=Rs, starts=starts, ends=ends, nsh=nsh,
             cls_even=cop[0], cls_odd=cop[1])
    P(f"setup: nodes {n}, even {ne}, windows {win}, {time.time()-t0:.1f}s")
    P(f"memory plan per worker: S = {NS} x ({n} x {NV*6}) complex64 = {NS*n*NV*6*8/2**30:.2f} GB; self = {NS*n*(8+2*16)/2**30:.2f} GB; "
      f"x {NPROC} workers = {NPROC*(NS*n*NV*6*8+NS*n*40)/2**30:.2f} GB (+ table, shared by fork)")

def worker(w):
    g = G; T = g['T']; n = g['n']; perm = g['perm']; ne = g['ne']; cop = g['cop']; clsp = g['clsp']; binidx = g['binidx']
    a_th = g['a_th']; nsh = g['nsh']
    S = [[np.zeros((ne, NV * 6), np.complex64, order='F'), np.zeros((n - ne, NV * 6), np.complex64, order='F')] for _ in range(NS)]
    selfr = np.zeros((NS, n)); selfc = np.zeros((NS, 2, n), complex)
    nr = np.zeros((JMAX + 1, NS, 12)); cnt = np.zeros((JMAX + 1, NS), np.int64)
    t0 = time.time()
    for j in range(JMAX + 1):
        r = np.load(os.path.join(ROWDIR, f'rows_{j:02d}.npz'))
        ms = r['ms']; fl = r['flags']; six = r['six']; rho = r['rho_str'] + r['rho_cor']; W = r['W']; dn = r['dn']
        nrow = len(ms)
        ph_rnd = np.exp(2j * np.pi * np.random.default_rng([SEED, j]).random((nrow, 2, 12)))
        mx = fl[:, 4]; strat = np.where(mx <= 1, 0, np.where(mx == 2, 1, 2))
        for ii in range(w, nrow, NPROC):
            if six[ii]: continue
            s = int(strat[ii]); m = (int(ms[ii, 0]), int(ms[ii, 1]))
            e = T.node_exponents(m)[perm]
            good = e >= 0
            ph = LUT[np.where(good, e, 6)]
            rv = np.stack([rho[ii], rho[ii] * ph_rnd[ii, 0], rho[ii] * ph_rnd[ii, 1]])          # [3, 12]
            y0 = np.ascontiguousarray(rv[:, cop[0]].reshape(-1)).astype(np.complex64)
            y1 = np.ascontiguousarray(rv[:, cop[1]].reshape(-1)).astype(np.complex64)
            Sa = S[s]
            Sa[0] = cgeru(1.0, ph[:ne], y0, a=Sa[0], overwrite_a=1)
            Sa[1] = cgeru(1.0, ph[ne:], y1, a=Sa[1], overwrite_a=1)
            nn = dn[ii, 1:].astype(float); ok = nn > 0
            inv = np.where(ok, 1.0 / np.where(ok, nn, 1), 0)
            wfac = np.zeros((nsh, 12)); wfac[1:] = a_th[:, None] * inv / W[ii][None, :]
            wf = np.where(good, wfac.ravel()[binidx], 0.0)
            selfr[s] += wf
            selfc[s, 0] += ph_rnd[ii, 0][clsp] * wf
            selfc[s, 1] += ph_rnd[ii, 1][clsp] * wf
            nr[j, s] += np.abs(rho[ii]) ** 2; cnt[j, s] += 1
        out = {}
        for p in (0, 1):
            lo, hi = g['win'][j][p]
            for s in range(NS):
                np.save(os.path.join(OUTD, f'S_{j:02d}_{w}_{s}_{p}.npy'), S[s][p][lo - p * ne:hi - p * ne])
            out[f'sr{p}'] = selfr[:, lo:hi]; out[f'sc{p}'] = selfc[:, :, lo:hi]
        np.savez(os.path.join(OUTD, f'part_{j:02d}_{w}.tmp.npz'), nr=nr[:j + 1].sum(0), cnt=cnt[:j + 1].sum(0), **out)
        os.replace(os.path.join(OUTD, f'part_{j:02d}_{w}.tmp.npz'), os.path.join(OUTD, f'part_{j:02d}_{w}.npz'))
        if w == 0: P(f"bin {j}: worker 0 done {len(range(w, nrow, NPROC))} rows, total {time.time()-t0:.0f}s")

def main():
    os.makedirs(OUTD, exist_ok=True)
    setup()
    # check that S passes through cgeru in place (F-ordered slices of an F-ordered array are F-contiguous views)
    ps = [mp.Process(target=worker, args=(w,)) for w in range(NPROC)]
    [p.start() for p in ps]; [p.join() for p in ps]
    assert all(p.exitcode == 0 for p in ps), [p.exitcode for p in ps]
    P('ALLDONE')

if __name__ == '__main__':
    mp.set_start_method('fork')
    main()
