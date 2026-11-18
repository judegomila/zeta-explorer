#!/usr/bin/env python3
"""dual_reg.py R2DIR SEXTIC_DIR k out.json -- regression form of the dual-term test (form (a)).

Model under test (r3-nonpolar-proof 4.3, r2-tro6-type12-split (V)): for N(c) > Q,
    y_sigma(c) conj(gamma_1(c)) f(c) alpha(c)^j  =  sum_tau eps_tau(g) b_tau(c) + noise,
    b_tau(c) = rho_hat_tau(-e0 z) (or its conjugate),  z = u lambda^a 2^b s c,
with coefficients eps_tau constant on groups g = (class of c mod 4, norm bin of ratio 1.3), f in {1, chi_c(-e0), conj chi_c(-e0)}.
Per group: least squares of the 6 columns sigma on the 12 predictors tau; R2 = explained / total sum of squares.
Statistic: U = mean over (g, sigma) of n_g R2_g (null: about 12; calibrated by permuting the rows of b inside each group).
Planted control: a + 0.3 |a|_rms/|b|_rms * b_tau0 (one tau) must be detected.
"""
import os, sys, json, math, glob, time
import numpy as np
R2, SX, k, OUT = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
sys.path.insert(0, SX)
import alib as A, zomega as Z
Z6 = Z.ZETA6
t0 = time.time()
T = A.SFTable(os.path.join(SX, 'data', 'sf_1e7.npz'))
nd = np.load(os.path.join(R2, 'nodes.npz')); stc = np.load(os.path.join(R2, 'static.npz'))
perm = nd['perm']; clsp = nd['clsp'].astype(np.int64); shp = nd['shp'].astype(np.int64); pred = nd['pred']; Np = nd['Np']
Qs = stc['Qs']; Q = float(Qs[k]); cop = [stc['cls_even'], stc['cls_odd']]; par_cls = stc['par_cls']
QMAX = 30000
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
sel = np.flatnonzero((Np > 1.2 * Q) & (Np <= QMAX))
ti = perm[sel]; na = T.na[ti].astype(np.int64); nb = T.nb[ti].astype(np.int64); Nc = Np[sel]
g1 = T.g1[ti]; alpha = ((na - nb / 2.0) + 1j * (nb * math.sqrt(3) / 2.0)) / np.sqrt(Nc.astype(float))
m4 = T.m4[ti].astype(np.int64); pc = parp[sel]
ne0 = Z.mul((2, 0), Z.power(Z.LAM, 5)); xe0 = Z6[T.node_exponents(ne0)[ti]]
Y = {'band': yb[sel], 'loo': allS[sel]}
del allS, yb, sn
print(f"k={k} Q={Q:.0f}: {len(sel)} conductors with {1.2*Q:.0f} < N(c) <= {QMAX}", flush=True)
ms = []; rho = []
for f in sorted(glob.glob(os.path.join(R2, 'rows_*.npz'))):
    r = np.load(f); ms.append(r['ms']); rho.append(r['rho_str'] + r['rho_cor'])
ms = np.concatenate(ms); rho = np.concatenate(rho)
OFF = 400; M = 1000
rkey = (ms[:, 0] + OFF) * M + (ms[:, 1] + OFF); ro = np.argsort(rkey); rkey_s = rkey[ro]
sgn_tau = 1.0 - 2.0 * par_cls
def lookup(za, zb):
    can = (za > 0) | ((za == 0) & (zb > 0))
    a2 = np.where(can, za, -za); b2 = np.where(can, zb, -zb)
    key = (a2 + OFF) * M + (b2 + OFF)
    pos = np.minimum(np.searchsorted(rkey_s, key), len(rkey_s) - 1)
    ok = rkey_s[pos] == key
    return rho[ro[pos]] * np.where(can[:, None], 1.0, sgn_tau[None, :]), ok
nbin = np.floor(np.log(Nc / (1.2 * Q)) / math.log(1.3)).astype(np.int64)
rng = np.random.default_rng(11)
BINU = {}
def stat(Aw, Bw, gi, ng, cols, tag=None, gbin=None):
    """U = mean over groups and columns of n_g R2."""
    tot = 0.0; cnt = 0
    order = np.argsort(gi, kind='stable'); bounds = np.searchsorted(gi[order], np.arange(ng + 1))
    for g in range(ng):
        idx = order[bounds[g]:bounds[g + 1]]; n = len(idx)
        if n < 30: continue
        Bg = Bw[idx]; Ag = Aw[idx][:, cols]
        coef = np.linalg.lstsq(Bg, Ag, rcond=None)[0]
        fit = Bg @ coef
        tt = (np.abs(Ag) ** 2).sum(0); ex = (np.abs(fit) ** 2).sum(0)
        okc = tt > 0
        tot += (n * ex[okc] / tt[okc]).sum(); cnt += int(okc.sum())
        if tag is not None:
            d = BINU.setdefault((tag, int(gbin[g])), [0.0, 0]); d[0] += (n * ex[okc] / tt[okc]).sum(); d[1] += int(okc.sum())
    return tot / max(cnt, 1), cnt
res = []
smalls = [((1, 0), 1)] + [((int(T.pa[q]), int(T.pb[q])), int(T.pq[q])) for q in range(T.np_) if (not T.pinert[q]) and T.pq[q] in (7, 13)]
for (sv, sN) in smalls:
  for ui, u in enumerate(Z.UNITS[:3]):
    for a in range(6):
        for b in range(3):
            v = Z.mul(Z.mul(u, Z.power(Z.LAM, a)), Z.mul(Z.power((2, 0), b), sv)); vN = Z.norm(v)
            if vN * 1.2 * Q * 1.3 ** 3 > QMAX: continue
            za = v[0] * na - v[1] * nb; zb = v[0] * nb + v[1] * na - v[1] * nb
            bb, ok = lookup(za, zb); ok &= (Nc * vN <= QMAX)
            if ok.sum() < 600: continue
            gi = np.unique(m4[ok] * 64 + nbin[ok], return_inverse=True)[1]; ng = int(gi.max()) + 1
            gbin = np.zeros(ng, int); gbin[gi] = nbin[ok]; main = (sN == 1 and a == 0 and b == 0)
            B0 = bb[ok]
            perms = []
            for _ in range(3):
                o = np.lexsort((rng.random(ok.sum()), gi)); pp = np.empty_like(o); so = np.argsort(gi, kind='stable'); pp[so] = o
                perms.append(pp)
            for var in ('band', 'loo'):
                for fi, fac in enumerate((np.ones(len(sel)), xe0, np.conj(xe0))):
                    for j in (0, 1, -1, 2, -2):
                        Aw = Y[var][ok] * (np.conj(g1[ok]) * fac[ok] * alpha[ok] ** j)[:, None]
                        for cj in (0, 1):
                            Bw = B0 if cj == 0 else np.conj(B0)
                            tg = (var == 'band') and main
                            U, cnt = stat(Aw, Bw, gi, ng, slice(0, 6), 'real' if tg else None, gbin)
                            Un = [stat(Aw, Bw[pm], gi, ng, slice(0, 6), 'null' if tg else None, gbin)[0] for pm in perms]
                            res.append(dict(s=sN, u=ui, a=a, b=b, var=var, f=fi, j=j, conj=cj, U=U, null=Un, cells=cnt, n=int(ok.sum())))
            # planted control on the last configuration
            Ap = Aw + 0.3 * np.sqrt((np.abs(Aw) ** 2).mean()) / np.sqrt((np.abs(Bw[:, 3]) ** 2).mean()) * Bw[:, [3]] * np.exp(2j * np.pi * rng.random(ng))[gi][:, None]
            Up = stat(Ap, Bw, gi, ng, slice(0, 6))[0]
            print(f"  map s={sN} u={ui} a={a} b={b}: n={int(ok.sum())}, groups {ng}, cells {cnt}; last U {U:.3f} null {np.mean(Un):.3f}; planted (amplitude 0.3 on one tau) U {Up:.3f}; {time.time()-t0:.0f}s", flush=True)
            res.append(dict(s=sN, u=ui, a=a, b=b, planted=Up, planted_base=U))
print("per norm bin (map z = u c, band, all f, j, conj, u): N(c)/Q range, U real, U null, cells")
for bn in sorted(set(b_ for (_, b_) in BINU)):
    r_ = BINU.get(('real', bn)); n_ = BINU.get(('null', bn))
    if r_ and n_: print(f"   N(c)/Q in ({1.2*1.3**bn:.2f}, {1.2*1.3**(bn+1):.2f}]: U {r_[0]/r_[1]:.3f}  null {n_[0]/n_[1]:.3f}  cells {r_[1]}  (null sd of the cell mean about {math.sqrt(12)/math.sqrt(r_[1]):.3f})")
real = [r for r in res if 'U' in r]
U = np.array([r['U'] for r in real]); Un = np.array([x for r in real for x in r['null']])
z = (U - Un.mean()) / Un.std()
print(f"configurations {len(real)}: U mean {U.mean():.3f} sd {U.std():.3f} max {U.max():.3f}; null mean {Un.mean():.3f} sd {Un.std():.3f} max {Un.max():.3f} (n {len(Un)})")
big = [r for r in real if r['n'] >= 2000]
Ub = np.array([r['U'] for r in big]); Unb = np.array([x for r in big for x in r['null']])
print(f"maps with n >= 2000: {len(big)} configurations: U mean {Ub.mean():.3f} sd {Ub.std():.3f} max {Ub.max():.3f}; null mean {Unb.mean():.3f} sd {Unb.std():.3f} max {Unb.max():.3f}")
real.sort(key=lambda r: -r['U'])
for r in real[:12]: print(r)
json.dump(dict(k=k, Q=Q, res=res), open(OUT, 'w'))
