#!/usr/bin/env python3
"""dual_coef.py R2IN SEXTIC_DIR k out.npz [NMAX_C] -- stripped theta estimators at the indices y' = zeta6^U lambda^A 2^B c
for ALL (A, B, U) in (Z/6)^3 and all 12 classes tau, for every conductor c with 1.2 Q_k < N(c) <= 30000.

rho_hat_tau(y') = X^(2/3) weighted-least-squares constant of sum_{n in tau, N(n) <= X} gamma_1(n) conj chi_n(y')
(same fit as scale.py: shells of the geometric grid, weights 1/count).  Moduli n: squarefree, primary, prime to 6 y'.
Because chi_n(t^6) = 1 the coefficient depends on (A, B, U) mod 6 only, so the 216 systems cover every S-unit shift.
One pass per conductor: histogram of gamma_1(n) over (cell, e_lambda, e_2, e_zeta, e_c), then a 4-dimensional DFT.
Memory plan: histogram 1080 x 6^4 complex = 22 MB; output N_c x 216 x 12 complex64 = N_c * 20.7 kB (6000 conductors: 124 MB).
"""
import os, sys, math, time
import numpy as np
R2, SX, k, OUT = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
NMAX = int(sys.argv[5]) if len(sys.argv) > 5 else 10 ** 9
sys.path.insert(0, SX)
import alib as A, zomega as Z
T = A.SFTable(os.path.join(SX, 'data', 'sf_1e7.npz')); n = T.n
stc = np.load(os.path.join(R2, 'static.npz')); Qs = stc['Qs']; Q = float(Qs[k]); grid = stc['grid']; a_th = stc['a_th']; nsh = len(grid)
shell = np.searchsorted(grid.astype(np.int64), T.N, side='left')
cell = shell * 12 + T.m4.astype(np.int64)
el = T.node_exponents(Z.LAM).astype(np.int64); e2 = T.node_exponents((2, 0)).astype(np.int64); ez = T.node_exponents(Z.UNITS[1]).astype(np.int64)
assert (el >= 0).all() and (e2 >= 0).all() and (ez >= 0).all()
base = (((cell * 6 + el) * 6 + e2) * 6 + ez) * 6
NB_ = nsh * 12 * 6 ** 4
g1r = T.g1.real.copy(); g1i = T.g1.imag.copy()
sel = np.flatnonzero((T.N > 1.2 * Q) & (T.N <= 30000))[:NMAX]
print(f"k={k} Q={Q:.0f}: {len(sel)} conductors; output {len(sel)*216*12*8/2**20:.0f} MB", flush=True)
out = np.zeros((len(sel), 6, 6, 6, 12), np.complex64); out_lo = np.zeros_like(out); out_hi = np.zeros_like(out)
SPLIT = int(np.searchsorted(grid.astype(float), 2.0e6))      # shells 1..SPLIT-1: moduli N(n) <= about 2e6; SPLIT..: above
t0 = time.time()
for ii, nd in enumerate(sel):
    c = (int(T.na[nd]), int(T.nb[nd]))
    ec = T.node_exponents(c).astype(np.int64); good = ec >= 0
    idx = base[good] + ec[good]
    H = (np.bincount(idx, weights=g1r[good], minlength=NB_) + 1j * np.bincount(idx, weights=g1i[good], minlength=NB_)).reshape(nsh * 12, 6, 6, 6, 6)
    F = np.fft.fftn(H, axes=(1, 2, 3, 4))[..., 1].reshape(nsh, 12, 6, 6, 6)          # [shell, tau, A, B, U]
    dn = np.bincount(cell[good], minlength=nsh * 12).reshape(nsh, 12)[1:].astype(float)
    inv = np.where(dn > 0, 1.0 / np.where(dn > 0, dn, 1), 0)
    Wt = (a_th[:, None] ** 2 * inv).sum(0)
    rho = ((a_th[:, None] * inv)[:, :, None, None, None] * F[1:]).sum(0) / Wt[:, None, None, None]   # [tau, A, B, U]
    out[ii] = np.moveaxis(rho, 0, -1)
    for dst, sl in ((out_lo, slice(0, SPLIT - 1)), (out_hi, slice(SPLIT - 1, None))):
        Wp = (a_th[sl, None] ** 2 * inv[sl]).sum(0)
        dst[ii] = np.moveaxis(((a_th[sl, None] * inv[sl])[:, :, None, None, None] * F[1:][sl]).sum(0) / Wp[:, None, None, None], 0, -1)
    if ii % 500 == 0: print(f"  {ii}/{len(sel)} {time.time()-t0:.0f}s", flush=True)
np.savez(OUT, sel=sel, rho=out, rho_lo=out_lo, rho_hi=out_hi, k=k, Q=Q, split=float(grid[SPLIT - 1]))
print('done', time.time() - t0)
