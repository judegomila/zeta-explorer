#!/usr/bin/env python3
"""dual_probe2.py R2IN SEXTIC_DIR coef_split.npz -- controls for the dual-term correlation, and the s = 1 slice of the dual form.
(1) conjugate-index control: b taken at the conjugate conductor (a different squarefree element of the same norm).
(2) split-modulus robustness: b fitted from moduli N(n) <= 2e6 only, and from N(n) > 2e6 only.
(3) cross-check of (2): correlation between the two half-estimators themselves (signal fraction of b).
(4) Moebius slice: t = |sum_c mu(c) alpha(c)^(2+j) G(c) rho_hat_tau(S c) N(c)^(-1/2)|^2 / sum |.|^2 over the conductors, against the same
    with mu alpha^2 G replaced by random completely multiplicative unimodular functions and by 1."""
import os, sys, json, math, time
import numpy as np
R2, SX, COEF = sys.argv[1], sys.argv[2], sys.argv[3]
sys.path.insert(0, SX)
import alib as A, zomega as Z
T = A.SFTable(os.path.join(SX, 'data', 'sf_1e7.npz'))
cf = np.load(COEF); sel = cf['sel']; k = int(cf['k']); Q = float(cf['Q'])
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
pos = inv[sel]; Yb = yb[pos]
Nc = T.N[sel].astype(float); g1 = T.g1[sel]; m4 = T.m4[sel].astype(np.int64); m9 = T.m9[sel].astype(np.int64)
na = T.na[sel].astype(np.int64); nb = T.nb[sel].astype(np.int64)
nc = len(sel); SYS = [(1, 0, 0), (3, 4, 5), (0, 0, 0), (5, 1, 0)]
qs = [np.ravel_multi_index(s, (6, 6, 6)) for s in SYS]
Bf = cf['rho'].reshape(nc, 216, 12)[:, qs].astype(complex); Bl = cf['rho_lo'].reshape(nc, 216, 12)[:, qs].astype(complex); Bh = cf['rho_hi'].reshape(nc, 216, 12)[:, qs].astype(complex)
rng = np.random.default_rng(9)
def mkgroups(key, nmin):
    gi = np.unique(key, return_inverse=True)[1]; ng = int(gi.max()) + 1
    order = np.argsort(gi, kind='stable'); b = np.searchsorted(gi[order], np.arange(ng + 1))
    return [order[b[g]:b[g + 1]] for g in range(ng) if b[g + 1] - b[g] >= nmin]
G2 = mkgroups(m4 * 9 + m9, 30)
def R2stat(Aw, Bw, perm_=False):
    ex = 0.0; tot = 0.0
    for idx in G2:
        Ag = Aw[idx] - Aw[idx].mean(0); Bg = Bw[idx] - Bw[idx].mean(0)
        if perm_: Ag = Ag[rng.permutation(len(idx))]
        coef = np.linalg.lstsq(Bg, Ag, rcond=None)[0]
        ex += (np.abs(Bg @ coef) ** 2).sum(); tot += (np.abs(Ag) ** 2).sum()
    return ex / tot
Aw = Yb * np.conj(g1)[:, None]
# conjugate conductor: primary associate of conj(c) is conj(c) itself; find its row
key = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(na, nb))}
cj = np.array([key.get(Z.conj((int(a), int(b))), -1) for a, b in zip(na, nb)])
print(f"k={k} Q={Q:.0f}: {nc} conductors; conjugate found for {(cj >= 0).sum()}, self-conjugate {(cj == np.arange(nc)).sum()}; {len(G2)} groups (c mod 4, c mod 9), median size {int(np.median([len(g) for g in G2]))}")
print("explained fraction R2 of a_sigma (6 columns) by the 12 classes tau of one system; null = conductors permuted inside groups (expected 12/n_g)")
for si, s in enumerate(SYS):
    r = R2stat(Aw, Bf[:, si]); rn = np.mean([R2stat(Aw, Bf[:, si], True) for _ in range(3)])
    rl = R2stat(Aw, Bl[:, si]); rh = R2stat(Aw, Bh[:, si])
    rc = R2stat(Aw, Bf[cj, si]) if (cj >= 0).all() else float('nan')
    rb = R2stat(Aw, np.concatenate([Bl[:, si], Bh[:, si]], axis=1))
    # signal content of the half estimators: correlation between them
    num = np.abs((Bl[:, si] * np.conj(Bh[:, si])).sum(0)); den = np.sqrt((np.abs(Bl[:, si]) ** 2).sum(0) * (np.abs(Bh[:, si]) ** 2).sum(0))
    print(f"  system {s}: full {r:.4f} | null {rn:.4f} | moduli <= 2e6 only {rl:.4f} | moduli > 2e6 only {rh:.4f} | both halves as 24 predictors {rb:.4f} (null 24/n_g) | conjugate conductor {rc:.4f} | corr(lo, hi) per tau: mean {np.mean(num/den):.3f}")
# Moebius slice
mu = T.mu[sel].astype(float); Gc = T.G()[sel]; alpha = ((na - nb / 2.0) + 1j * (nb * math.sqrt(3) / 2.0)) / np.sqrt(Nc)
# completely multiplicative random phases: factor conductors
cur = sel.copy(); loc = np.arange(nc); pc = []; pk = []
while True:
    ok = cur > 0
    if not ok.any(): break
    pc.append(loc[ok]); pk.append(T.last[cur[ok]].astype(np.int64)); cur = np.where(ok, T.parent[cur], 0)
pc = np.concatenate(pc); pk = np.concatenate(pk)
Ball = cf['rho'].reshape(nc, 216 * 12).astype(complex) / np.sqrt(Nc)[:, None]
E = (np.abs(Ball) ** 2).sum(0)
print("Moebius slice of the dual form at s = 1 (2592 columns = 216 systems x 12 classes); t ~ Exp(1) for a random row: mean 1, max of 2592 about 7.9 +- 1.3")
for j in (0, 1, -1, 2, -2, 3, -3):
    t = np.abs(((mu * alpha ** (2 + j) * Gc)[:, None] * Ball).sum(0)) ** 2 / E
    print(f"   mu alpha^{2+j} G: mean t {t.mean():.3f}  max {t.max():.2f}  frac > 3: {(t > 3).mean():.4f} (Exp: 0.0498)")
for d in range(4):
    ph = np.exp(2j * np.pi * rng.random(T.np_)); nu = np.exp(1j * np.bincount(pc, weights=np.angle(ph[pk]), minlength=nc))
    t = np.abs((nu[:, None] * Ball).sum(0)) ** 2 / E
    print(f"   random completely multiplicative draw {d}: mean t {t.mean():.3f}  max {t.max():.2f}  frac > 3: {(t > 3).mean():.4f}")
for name, wgt in (('1', np.ones(nc)), ('mu', mu), ('alpha^2 G', alpha ** 2 * Gc), ('conj(gamma_1)', np.conj(g1)), ('conj(gamma_1 gamma_2)', np.conj(g1 * T.g2[sel]))):
    t = np.abs((wgt[:, None] * Ball).sum(0)) ** 2 / E
    print(f"   weight {name}: mean t {t.mean():.3f}  max {t.max():.2f} at system {tuple(int(x) for x in np.unravel_index(np.argmax(t) // 12, (6, 6, 6)))} tau {int(np.argmax(t) % 12)}  frac > 3: {(t > 3).mean():.4f}")
