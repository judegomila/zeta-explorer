#!/usr/bin/env python3
"""dual_test.py R2DIR SEXTIC_DIR k out.json -- direct test of the leading dual term behind form (a).

Sketch under test (r3-nonpolar-proof 4.3): for N(c) > Q the non-polar remainder of the twisted first moment is
    R(c) ~ (unit) gamma_1(c) N(c)^(-1/2) Q^(11/12) sum_{N(s) <~ N(c)/Q} rho(u c s) w~(N(s) Q / N(c)),
i.e. theta coefficients at multiples of c.  Test: correlation over conductors c (squarefree, primary, prime to 6,
1.2 Q_k < N(c), N(z) <= 30000) of
    a_c = y_sigma(c) conj(gamma_1(c)) alpha(c)^j      (y = band-projected leave-one-out twisted sum at Q_k, r2 snapshot)
    b_c = rho_hat_tau(-e0 z) or its conjugate,  z = u lambda^a 2^b s c   (stored rows, N(z) <= 30000)
inside groups g = (class of c mod 4, class of c mod 9, norm bin of ratio 1.3), where a unit factor depending on c only
through its classes and a slowly varying kernel are constant.  Statistic T = mean_g n_g |corr_g|^2 (null: 1).
Null: b permuted inside each group.
"""
import os, sys, json, math, glob, time
import numpy as np
R2, SX, k, OUT = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
sys.path.insert(0, SX)
import alib as A, zomega as Z
t0 = time.time()
T = A.SFTable(os.path.join(SX, 'data', 'sf_1e7.npz'))
nd = np.load(os.path.join(R2, 'nodes.npz')); stc = np.load(os.path.join(R2, 'static.npz'))
perm = nd['perm']; clsp = nd['clsp'].astype(np.int64); shp = nd['shp'].astype(np.int64); pred = nd['pred']; Np = nd['Np']
Qs = stc['Qs']; Q = float(Qs[k]); cop = [stc['cls_even'], stc['cls_odd']]; par_cls = stc['par_cls']
QMAX = 30000
sn = np.load(os.path.join(R2, f'snap_{k:02d}.npz'))
sel = np.flatnonzero((Np > 1.2 * Q) & (Np <= QMAX))
S = sn['S'][0][sel].astype(complex) + sn['S'][1][sel]; slf = sn['selfacc'][0][sel] + sn['selfacc'][1][sel]
# band projection needs cell means over whole cells: compute on all nodes of the shells involved
allS = sn['S'][0].astype(complex) + sn['S'][1]; allself = sn['selfacc'][0] + sn['selfacc'][1]
parp = ((Np - 1) // 6) % 2
y_all = allS.copy()
for p in (0, 1):
    for i, sg in enumerate(cop[p]):
        msk = (parp == p) & (clsp == sg)
        y_all[msk, i] -= (pred * allself)[msk]
cell = shp * 12 + clsp; ncell = int(cell.max()) + 1
cc = np.bincount(cell, minlength=ncell).astype(float); cc[cc == 0] = 1
yb_all = np.empty_like(y_all)
for i in range(6):
    z = y_all[:, i] * np.conj(pred)
    mz = (np.bincount(cell, weights=z.real, minlength=ncell) + 1j * np.bincount(cell, weights=z.imag, minlength=ncell)) / cc
    yb_all[:, i] = y_all[:, i] - pred * mz[cell]
ti = perm[sel]; na = T.na[ti].astype(np.int64); nb = T.nb[ti].astype(np.int64); Nc = Np[sel]
g1 = T.g1[ti]; alpha = ((na - nb / 2.0) + 1j * (nb * math.sqrt(3) / 2.0)) / np.sqrt(Nc.astype(float))
m4 = T.m4[ti].astype(np.int64); m9 = T.m9[ti].astype(np.int64); pc = parp[sel]
Y = {'band': yb_all[sel], 'loo': y_all[sel]}
del allS, y_all, yb_all, sn
print(f"k={k} Q={Q:.0f}: {len(sel)} conductors with {1.2*Q:.0f} < N(c) <= {QMAX}", flush=True)
# rows
ms = []; rho = []
for f in sorted(glob.glob(os.path.join(R2, 'rows_*.npz'))):
    r = np.load(f); ms.append(r['ms']); rho.append(r['rho_str'] + r['rho_cor'])
ms = np.concatenate(ms); rho = np.concatenate(rho)
OFF = 400; M = 1000
rkey = (ms[:, 0] + OFF) * M + (ms[:, 1] + OFF); ro = np.argsort(rkey); rkey_s = rkey[ro]
sgn_tau = 1.0 - 2.0 * par_cls                                     # rho_tau(-y) = chi_tau(-1) rho_tau(y)
def lookup(za, zb):
    """rho_hat[12] at z (any half), and a validity mask."""
    can = (za > 0) | ((za == 0) & (zb > 0))
    a2 = np.where(can, za, -za); b2 = np.where(can, zb, -zb)
    key = (a2 + OFF) * M + (b2 + OFF)
    pos = np.searchsorted(rkey_s, key); pos = np.minimum(pos, len(rkey_s) - 1)
    ok = rkey_s[pos] == key
    out = rho[ro[pos]] * np.where(can[:, None], 1.0, sgn_tau[None, :])
    return out, ok
nbin = np.floor(np.log(Nc / (1.2 * Q)) / math.log(1.3)).astype(np.int64)
rng = np.random.default_rng(11)
res = []; nullmax = []
smalls = [((1, 0), 1)] + [((int(T.pa[q]), int(T.pb[q])), int(T.pq[q])) for q in range(T.np_) if (not T.pinert[q]) and T.pq[q] in (7, 13)]
for (sv, sN) in smalls:
  for ui, u in enumerate(Z.UNITS[:3]):
    for a in range(6):
        for b in range(3):
            v = Z.mul(Z.mul(u, Z.power(Z.LAM, a)), Z.mul(Z.power((2, 0), b), sv))
            vN = Z.norm(v)
            if vN * 1.2 * Q * 1.3 ** 2 > QMAX: continue
            za = v[0] * na - v[1] * nb; zb = v[0] * nb + v[1] * na - v[1] * nb
            bb, ok = lookup(za, zb)
            ok &= (Nc * vN <= QMAX)
            if sN > 1: ok &= (na * 0 + 1).astype(bool)             # c s need not be coprime; kept
            if ok.sum() < 500: continue
            grp = (m4 * 9 + m9) * 64 + nbin
            gi = np.unique(grp[ok], return_inverse=True)[1]; ng = int(gi.max()) + 1
            cnt = np.bincount(gi, minlength=ng).astype(float)
            keep = cnt >= 4
            B = bb[ok]
            perms = [np.arange(ok.sum())]
            for _ in range(2):
                o = np.lexsort((rng.random(ok.sum()), gi)); pp = np.empty_like(o); so = np.argsort(gi, kind='stable'); pp[so] = o
                perms.append(pp)
            for var in ('band', 'loo'):
                for j in (0, 1, -1, 2, -2):
                    Aall = Y[var][ok] * (np.conj(g1[ok]) * alpha[ok] ** j)[:, None]
                    for i in range(6):
                        # y_sigma_i is defined on conductors of one parity only; restrict
                        for p in (0, 1):
                            mp = pc[ok] == p
                            if mp.sum() < 200: continue
                            av = np.where(mp, Aall[:, i], 0)
                            sa = np.bincount(gi, weights=np.abs(av) ** 2, minlength=ng)
                            for ip, pm in enumerate(perms):
                                Bp = B[pm]
                                for cj in (0, 1):
                                    Bc = np.conj(Bp) if cj == 0 else Bp
                                    best = None
                                    Tv = np.zeros(12)
                                    for tau in range(12):
                                        prod = av * Bc[:, tau]
                                        num = np.bincount(gi, weights=prod.real, minlength=ng) + 1j * np.bincount(gi, weights=prod.imag, minlength=ng)
                                        sb = np.bincount(gi, weights=np.where(mp, np.abs(Bc[:, tau]) ** 2, 0), minlength=ng)
                                        cg = np.bincount(gi, weights=mp.astype(float), minlength=ng)
                                        kk = keep & (cg >= 4) & (sa > 0) & (sb > 0)
                                        Tv[tau] = (cg[kk] * np.abs(num[kk]) ** 2 / (sa[kk] * sb[kk])).mean()
                                    if ip == 0:
                                        for tau in range(12):
                                            res.append(dict(s=sN, u=ui, a=a, b=b, var=var, j=j, sigma=int(cop[p][i]), par=p, tau=tau, conj=cj,
                                                            T=float(Tv[tau]), n=int(mp.sum()), ngroups=int(kk.sum())))
                                    else:
                                        nullmax.append(float(Tv.max())); 
            print(f"  map s={sN} u={ui} a={a} b={b}: n={int(ok.sum())}, groups {ng}, {time.time()-t0:.0f}s", flush=True)
Tall = np.array([r['T'] for r in res]); nullv = np.array(nullmax)
print(f"configurations {len(res)}; T: mean {Tall.mean():.4f} sd {Tall.std():.4f} max {Tall.max():.3f}; "
      f"null (permuted b; max over 12 tau per config): mean {nullv.mean():.4f} max {nullv.max():.3f} n {len(nullv)}")
res.sort(key=lambda r: -r['T'])
for r in res[:25]: print(r)
json.dump(dict(k=k, Q=Q, top=res[:200], T_mean=float(Tall.mean()), T_sd=float(Tall.std()), T_max=float(Tall.max()),
               null_mean=float(nullv.mean()), null_max=float(nullv.max()), null_n=len(nullv), nconf=len(res),
               hist=np.histogram(Tall, bins=np.linspace(0, 6, 61))[0].tolist(), null_hist=np.histogram(nullv, bins=np.linspace(0, 6, 61))[0].tolist()), open(OUT, 'w'))
