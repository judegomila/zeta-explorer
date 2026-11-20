#!/usr/bin/env python3
"""dual_mob.py SEXTIC_DIR coef_split.npz -- Moebius slice of the dual form at s = 1, resolved by the class of c mod 4.
t_j[column] = sum_{classes kappa of c mod 4} |sum_{c in kappa} mu(c) alpha(c)^j rho_hat_tau(S c) N(c)^(-1/2)|^2 / sum_c |.|^2
(independent of any class function of c mod 4 such as G or G^2; null: mean 1, chi^2 with 24 degrees of freedom / 12 scaled).
Robustness: estimator from moduli <= 2e6 and from moduli > 2e6; conductors split in two norm ranges; random multiplicative control."""
import os, sys, math
import numpy as np
SX, COEF = sys.argv[1], sys.argv[2]
sys.path.insert(0, SX)
import alib as A, zomega as Z
T = A.SFTable(os.path.join(SX, 'data', 'sf_1e7.npz'))
cf = np.load(COEF); sel = cf['sel']; nc = len(sel)
Nc = T.N[sel].astype(float); na = T.na[sel].astype(np.int64); nb = T.nb[sel].astype(np.int64); m4 = T.m4[sel].astype(np.int64)
mu = T.mu[sel].astype(float); alpha = ((na - nb / 2.0) + 1j * (nb * math.sqrt(3) / 2.0)) / np.sqrt(Nc)
oh = np.zeros((nc, 12)); oh[np.arange(nc), m4] = 1
def tstat(wgt, Bm, msk=None):
    X = Bm / np.sqrt(Nc)[:, None]
    if msk is not None: X = X[msk]; w = wgt[msk]; o = oh[msk]
    else: w = wgt; o = oh
    S = np.einsum('n,nk,nq->kq', w, o, X)
    return (np.abs(S) ** 2).sum(0) / (np.abs(X) ** 2).sum(0)
B = {nm: cf[nm].reshape(nc, 2592).astype(complex) for nm in ('rho', 'rho_lo', 'rho_hi')}
rng = np.random.default_rng(2)
cur = sel.copy(); loc = np.arange(nc); pc = []; pk = []
while True:
    ok = cur > 0
    if not ok.any(): break
    pc.append(loc[ok]); pk.append(T.last[cur[ok]].astype(np.int64)); cur = np.where(ok, T.parent[cur], 0)
pc = np.concatenate(pc); pk = np.concatenate(pk)
nullmax = []; nullmean = []
for d in range(20):
    ph = np.exp(2j * np.pi * rng.random(T.np_)); nu = np.exp(1j * np.bincount(pc, weights=np.angle(ph[pk]), minlength=nc))
    t = tstat(nu, B['rho']); nullmax.append(t.max()); nullmean.append(t.mean())
print(f"{nc} conductors, N(c) in ({Nc.min():.0f}, {Nc.max():.0f}]; 2592 columns (216 distinct up to exact ties x 12)")
print(f"control, random completely multiplicative weights (20 draws): mean t {np.mean(nullmean):.3f}, max over columns: mean {np.mean(nullmax):.2f}, largest {np.max(nullmax):.2f}")
lo = Nc <= np.median(Nc)
print(" j : weight mu alpha^j : mean t, max t, column of max (A,B,U,tau) | same column: moduli<=2e6, moduli>2e6, lower-norm half of c, upper half | no mu: max t")
for j in range(-4, 7):
    w = mu * alpha ** j
    t = tstat(w, B['rho']); q = int(np.argmax(t)); s = tuple(int(x) for x in np.unravel_index(q // 12, (6, 6, 6))) + (q % 12,)
    tl = tstat(w, B['rho_lo'])[q]; th = tstat(w, B['rho_hi'])[q]; t1 = tstat(w, B['rho'], lo)[q]; t2 = tstat(w, B['rho'], ~lo)[q]
    tn = tstat(alpha ** j, B['rho'])
    print(f" {j:+d}: {t.mean():.3f}  {t.max():7.2f}  {s} | {tl:6.2f} {th:6.2f} {t1:6.2f} {t2:6.2f} | {tn.max():8.2f} (mean {tn.mean():.2f})")
