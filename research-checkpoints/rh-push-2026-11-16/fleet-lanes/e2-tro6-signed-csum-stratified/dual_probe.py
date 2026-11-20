#!/usr/bin/env python3
"""dual_probe.py R2IN SEXTIC_DIR coef.npz -- structure of the dual-term correlation found by dual_full.py.
Group means are removed from a and b first (so a common class-constant component cannot contribute); j = 0, b unconjugated."""
import os, sys, json, math, time
import numpy as np
R2, SX, COEF = sys.argv[1], sys.argv[2], sys.argv[3]
sys.path.insert(0, SX)
import alib as A, zomega as Z
T = A.SFTable(os.path.join(SX, 'data', 'sf_1e7.npz'))
cf = np.load(COEF); sel = cf['sel']; rho = cf['rho']; k = int(cf['k']); Q = float(cf['Q'])
nd = np.load(os.path.join(R2, 'nodes.npz')); stc = np.load(os.path.join(R2, 'static.npz'))
perm = nd['perm']; clsp = nd['clsp'].astype(np.int64); shp = nd['shp'].astype(np.int64); pred = nd['pred']; Np = nd['Np']
cop = [stc['cls_even'], stc['cls_odd']]
sn = np.load(os.path.join(R2, f'snap_{k:02d}.npz'))
allS = sn['S'][0].astype(complex) + sn['S'][1]; allself = sn['selfacc'][0] + sn['selfacc'][1]
parp = ((Np - 1) // 6) % 2
for p in (0, 1):
    for i, sg in enumerate(cop[p]):
        msk = (parp == p) & (clsp == sg)
        allS[msk, i] -= (pred * allself)[msk]
cell = shp * 12 + clsp; ncell = int(cell.max()) + 1
cc = np.bincount(cell, minlength=ncell).astype(float); cc[cc == 0] = 1
yb = np.empty_like(allS)
for i in range(6):
    z = allS[:, i] * np.conj(pred)
    mz = (np.bincount(cell, weights=z.real, minlength=ncell) + 1j * np.bincount(cell, weights=z.imag, minlength=ncell)) / cc
    yb[:, i] = allS[:, i] - pred * mz[cell]
inv = np.empty(len(perm), np.int64); inv[perm] = np.arange(len(perm))
pos = inv[sel]; Yb = yb[pos]; Yl = allS[pos]
Nc = T.N[sel].astype(float); g1 = T.g1[sel]; m4 = T.m4[sel].astype(np.int64); m9 = T.m9[sel].astype(np.int64); par = parp[pos]
nc = len(sel); B = rho.reshape(nc, 216, 12).astype(complex)
rng = np.random.default_rng(5)
def mkgroups(key, nmin):
    gi = np.unique(key, return_inverse=True)[1]; ng = int(gi.max()) + 1
    order = np.argsort(gi, kind='stable'); b = np.searchsorted(gi[order], np.arange(ng + 1))
    return [order[b[g]:b[g + 1]] for g in range(ng) if b[g + 1] - b[g] >= nmin]
def Tstat(Aw, Bw, groups, perm_=False):
    acc = np.zeros((Bw.shape[1], 6, 12)); cnt = 0
    for idx in groups:
        Ag = Aw[idx] - Aw[idx].mean(0); Bg = Bw[idx] - Bw[idx].mean(0)
        if perm_: Ag = Ag[rng.permutation(len(idx))]
        C = np.einsum('ns,nqt->qst', np.conj(Ag), Bg)
        sa = (np.abs(Ag) ** 2).sum(0); sb = (np.abs(Bg) ** 2).sum(0)
        acc += (len(idx) - 1) * np.abs(C) ** 2 / (sa[None, :, None] * sb[:, None, :]); cnt += 1
    return acc / cnt
nbin = np.floor(np.log(Nc / (1.2 * Q)) / math.log(1.5)).astype(np.int64)
G = mkgroups((m4 * 9 + m9) * 16 + nbin, 6)
Aw = Yb * np.conj(g1)[:, None]
Tr = Tstat(Aw, B, G); Tn = Tstat(Aw, B, G, True)
ps = Tr.mean((1, 2)); pn = Tn.mean((1, 2))
print(f"k={k} Q={Q:.0f}, {nc} conductors, {len(G)} groups (c mod 4, c mod 9, norm bin 1.5), group means removed")
print(f"per-system mean of T over (sigma, tau): real mean {ps.mean():.4f} sd {ps.std():.4f}; null mean {pn.mean():.4f} sd {pn.std():.4f} max {pn.max():.4f}")
o = np.argsort(-ps)
print("top systems (A, B, U): mean T, max T over (sigma,tau)")
for q in o[:14]:
    print("   ", tuple(int(x) for x in np.unravel_index(q, (6, 6, 6))), f"{ps[q]:.4f}  {Tr[q].max():.3f}")
print(f"number of systems above the null maximum: {(ps > pn.max()).sum()} of 216")
q0 = int(o[0]); A0 = tuple(int(x) for x in np.unravel_index(q0, (6, 6, 6)))
print(f"best system {A0}: T[sigma col, tau] for parity-0 groups and parity-1 groups")
for p in (0, 1):
    Gp = [g for g in G if par[g[0]] == p]
    Tp = Tstat(Aw, B[:, [q0]], Gp)[0]
    print(f"  parity {p} (sigma classes {cop[p].tolist()}), {len(Gp)} groups"); print(np.array2string(Tp, precision=2, suppress_small=True, max_line_width=200))
print("best system: dependence on N(c)/Q (groups by c mod 4, c mod 9 inside each norm range); mean T over (sigma, tau), null")
for lo, hi in ((1.2, 1.5), (1.5, 1.9), (1.9, 2.4), (2.4, 3.0), (3.0, 4.01), (4.01, 5.5), (5.5, 8.01)):
    mk = (Nc / Q > lo) & (Nc / Q <= hi); ids = np.flatnonzero(mk)
    if mk.sum() < 100: continue
    Gb = [ids[g] for g in mkgroups((m4[mk] * 9 + m9[mk]), 6)]
    tr = Tstat(Aw, B[:, [q0]], Gb)[0].mean(); tn = np.mean([Tstat(Aw, B[:, [q0]], Gb, True)[0].mean() for _ in range(5)])
    print(f"   N(c)/Q in ({lo}, {hi}]: n = {mk.sum()}, groups {len(Gb)}, median size {int(np.median([len(g) for g in Gb]))}: T {tr:.3f}  null {tn:.3f}")
# regression of a_sigma on the 12 tau of the best system; groups (c mod 4, c mod 9), all norms
print("regression of a_sigma on the 12 classes tau of one system, groups (c mod 4, c mod 9), means removed: explained fraction R2, null (permuted)")
G2 = mkgroups(m4 * 9 + m9, 30)
def R2stat(Aw, Bw, groups, perm_=False):
    ex = 0.0; tot = 0.0
    for idx in groups:
        Ag = Aw[idx] - Aw[idx].mean(0); Bg = Bw[idx] - Bw[idx].mean(0)
        if perm_: Ag = Ag[rng.permutation(len(idx))]
        coef = np.linalg.lstsq(Bg, Ag, rcond=None)[0]
        ex += (np.abs(Bg @ coef) ** 2).sum(); tot += (np.abs(Ag) ** 2).sum()
    return ex / tot
for q in list(o[:6]) + [int(o[100])]:
    r = R2stat(Aw, B[:, q], G2); rn = [R2stat(Aw, B[:, q], G2, True) for _ in range(4)]
    rl = R2stat(Yl * np.conj(g1)[:, None], B[:, q], G2)
    print(f"   system {tuple(int(x) for x in np.unravel_index(q, (6, 6, 6)))}: R2 band {r:.4f}  null {np.mean(rn):.4f} +- {np.std(rn):.4f}   (loo variant {rl:.4f}); groups {len(G2)}, median size {int(np.median([len(g) for g in G2]))}")
