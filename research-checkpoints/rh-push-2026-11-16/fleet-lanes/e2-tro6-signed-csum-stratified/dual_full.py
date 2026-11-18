#!/usr/bin/env python3
"""dual_full.py R2IN SEXTIC_DIR coef.npz out.json -- test of the leading dual term (form (a)) over all S-unit shifts.

a_{c,sigma} = y_sigma(c) conj(gamma_1(c)) alpha(c)^j     (y: band-projected leave-one-out twisted sum at Q_k, r2 snapshot)
b_{c,tau}^{(A,B,U)} = rho_hat_tau(zeta6^U lambda^A 2^B c) or its conjugate     (dual_coef.py)
Groups g = (c mod 4, c mod 9, norm bin of ratio 1.5), n_g >= 5.  T[A,B,U,j,conj,sigma,tau] = mean_g n_g |corr_g|^2 (null 1).
Null: conductors permuted inside each group.  Planted control: a + 0.3 rms(a)/rms(b) e^{i phi_g} b for one system and tau.
"""
import os, sys, json, math, time
import numpy as np
R2, SX, COEF, OUT = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
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
pos = inv[sel]
Yb = yb[pos]; del allS, yb, sn
na = T.na[sel].astype(np.int64); nb = T.nb[sel].astype(np.int64); Nc = T.N[sel].astype(float)
g1 = T.g1[sel]; alpha = ((na - nb / 2.0) + 1j * (nb * math.sqrt(3) / 2.0)) / np.sqrt(Nc)
grp = (T.m4[sel].astype(np.int64) * 9 + T.m9[sel]) * 16 + np.floor(np.log(Nc / (1.2 * Q)) / math.log(1.5)).astype(np.int64)
gi = np.unique(grp, return_inverse=True)[1]; ng = int(gi.max()) + 1
order = np.argsort(gi, kind='stable'); bounds = np.searchsorted(gi[order], np.arange(ng + 1))
groups = [order[bounds[g]:bounds[g + 1]] for g in range(ng) if bounds[g + 1] - bounds[g] >= 5]
nc = len(sel); B = rho.reshape(nc, 216, 12).astype(complex)
print(f"k={k} Q={Q:.0f}: {nc} conductors, {len(groups)} groups with n >= 5 (median size {int(np.median([len(g) for g in groups]))}), N(c)/Q in ({Nc.min()/Q:.2f}, {Nc.max()/Q:.2f}]", flush=True)
rng = np.random.default_rng(3)
def Tstat(Aw, Bw):
    """[216, 6, 12] array of mean_g n_g |corr_g|^2."""
    acc = np.zeros((216, 6, 12)); cnt = 0
    for idx in groups:
        Ag = Aw[idx]; Bg = Bw[idx]
        C = np.einsum('ns,nqt->qst', np.conj(Ag), Bg)
        sa = (np.abs(Ag) ** 2).sum(0); sb = (np.abs(Bg) ** 2).sum(0)
        acc += len(idx) * np.abs(C) ** 2 / (sa[None, :, None] * sb[:, None, :]); cnt += 1
    return acc / cnt
def permute_in_groups(X):
    Xp = X.copy()
    for idx in groups: Xp[idx] = X[rng.permutation(idx)]
    return Xp
res = {}; allT = []; allN = []
t0 = time.time()
for j in (0, 1, -1, 2, -2):
    Aw = Yb * (np.conj(g1) * alpha ** j)[:, None]
    for cj in (0, 1):
        Bw = B if cj == 0 else np.conj(B)
        Tr = Tstat(Aw, Bw); Tn = Tstat(permute_in_groups(Aw), Bw)
        res[(j, cj)] = (Tr, Tn); allT.append(Tr.ravel()); allN.append(Tn.ravel())
        q = np.unravel_index(np.argmax(Tr), Tr.shape)
        print(f"j={j:+d} conj={cj}: T mean {Tr.mean():.4f} sd {Tr.std():.4f} max {Tr.max():.3f} at system (A,B,U)={np.unravel_index(q[0], (6,6,6))} sigma col {q[1]} tau {q[2]}"
              f" | null mean {Tn.mean():.4f} sd {Tn.std():.4f} max {Tn.max():.3f} | per-system mean over (sigma,tau): max {Tr.mean((1,2)).max():.4f} null max {Tn.mean((1,2)).max():.4f}; {time.time()-t0:.0f}s", flush=True)
allT = np.concatenate(allT); allN = np.concatenate(allN)
# planted control
Aw = Yb * np.conj(g1)[:, None]
ph = np.exp(2j * np.pi * rng.random(int(gi.max()) + 1))[gi]
Ap = Aw + 0.3 * np.sqrt((np.abs(Aw) ** 2).mean()) / np.sqrt((np.abs(B[:, 77, 5]) ** 2).mean()) * (B[:, 77, 5] * ph)[:, None]
Tp = Tstat(Ap, B)
print(f"planted (amplitude 0.3 = 8% of the energy, system 77, tau 5): T at the planted entry {Tp[77, :, 5].mean():.3f}; max elsewhere {np.delete(Tp.reshape(216, -1), 77, axis=0).max():.3f}")
print(f"all {len(allT)} entries: T mean {allT.mean():.4f} sd {allT.std():.4f} max {allT.max():.3f}; null mean {allN.mean():.4f} sd {allN.std():.4f} max {allN.max():.3f}")
qs = [0.5, 0.9, 0.99, 0.999, 0.9999]
print("quantiles", qs, "real", np.quantile(allT, qs).round(3).tolist(), "null", np.quantile(allN, qs).round(3).tolist())
json.dump(dict(k=k, Q=Q, nc=nc, ngroups=len(groups), T_mean=float(allT.mean()), T_sd=float(allT.std()), T_max=float(allT.max()),
               N_mean=float(allN.mean()), N_sd=float(allN.std()), N_max=float(allN.max()), q=qs, Tq=np.quantile(allT, qs).tolist(),
               Nq=np.quantile(allN, qs).tolist(), planted=float(Tp[77, :, 5].mean())), open(OUT, 'w'))
