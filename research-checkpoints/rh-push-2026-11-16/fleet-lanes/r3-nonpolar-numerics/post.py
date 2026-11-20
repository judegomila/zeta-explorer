#!/usr/bin/env python3
"""post.py outdir -- (i) positive control: r of the aligned (theta) row rebuilt from the conductor side, to compare with
r2 (0.2310 ... 0.2569 all generic rows, loo);  (ii) share of the pred-coherent (polar) part in sum_c |x_c|^2;
(iii) r_null sqrt(rows);  (iv) slopes with jackknife errors;  (v) top targets."""
import os, sys, math, numpy as np
outd = sys.argv[1]
nm = np.load(os.path.join(outd, 'norms.npz')); Qs = nm['Qs']; NB = len(Qs)
nr = np.concatenate([nm['nr'], nm['nr'].sum(1, keepdims=True)], 1); nb = np.concatenate([nm['nb'], nm['nb'].sum(1, keepdims=True)], 1)
nbr = np.concatenate([nm['nbr'], nm['nbr'].sum(1, keepdims=True)], 1); cnt = np.concatenate([nm['cnt'], nm['cnt'].sum(1, keepdims=True)], 1)
nse = np.concatenate([nm['nse'], nm['nse'].sum(1, keepdims=True)], 1)
def cols(t):
    s = t.shape[:-2]
    return t.reshape(s + (2, 2, 3, 6)).transpose(tuple(range(len(s))) + (len(s) + 1, len(s) + 2, len(s), len(s) + 3)).reshape(s + (2, 3, 12))
rres = np.zeros((NB, 3)); share = np.zeros((NB, 3)); rns = np.zeros((NB, 2, 3)); rr = {f: np.zeros((NB, 2, 3)) for f in ('f1', 'f2', 'f3')}
rmax = np.zeros((NB, 2, 3)); tmaxn = np.zeros((NB, 2, 3)); ntar = 0
for k in range(NB):
    z = np.load(os.path.join(outd, f'fam_{k:02d}.npz')); cop = z['cop']; sig = np.concatenate([cop[0], cop[1]])
    N0 = cols(z['N0'][None])[0]; kk = z['f2k']; k0 = int(np.flatnonzero(kk == 0)[0]); j0 = z['f2'].shape[1] // 2
    f2r = cols(z['f2r'][k0, j0][None])[0]                      # [var, str, 12]; N0 of the res base equals N0 (|multiplier| = 1)
    rres[k] = np.sqrt((f2r[0] * N0[0] / (nr[k][:, sig] * nbr[k][:, None])).mean(-1))
    share[k] = 1 - N0[1].sum(-1) / N0[0].sum(-1)
    rn2 = N0 / (nr[k][:, sig][None] * nb[k][None, :, None])
    rns[k] = np.sqrt(rn2.mean(-1) * 2 * cnt[k][None])
    a = z['f1a']; f1 = cols(z['f1'])[a > 0]; f2 = cols(z['f2']).reshape(-1, 2, 3, 12); f2 = np.delete(f2, k0 * z['f2'].shape[1] + j0, 0)
    f3 = cols(z['f3'])[4:].reshape(-1, 2, 3, 12)
    for f, t in (('f1', f1), ('f2', f2), ('f3', f3)):
        rr[f][k] = np.sqrt((t.astype(float).mean(0) * rn2).mean(-1))
    allt = np.concatenate([f1, f2, f3]).astype(float); ntar = len(allt)
    rmax[k] = np.sqrt((allt * rn2[None]).max((0, 3))); tmaxn[k] = allt.max((0, 3))
lq = np.log(Qs)
def slope(y, idx):
    idx = np.asarray(idx); full = -np.polyfit(lq[idx], np.log(y[idx]), 1)[0]
    jk = np.array([-np.polyfit(lq[np.delete(idx, i)], np.log(y[np.delete(idx, i)]), 1)[0] for i in range(len(idx))])
    n = len(idx); return full, math.sqrt((n - 1) / n * ((jk - jk.mean()) ** 2).sum())
print("Q:", " ".join(f"{q:.0f}" for q in Qs))
print("noise share of sum |rho_hat|^2 (p6, np6, all):"); [print("  ", " ".join(f"{x:.3f}" for x in (nse[:, s].sum(-1) / nr[:, s].sum(-1)))) for s in range(3)]
for s, sn in enumerate(['p6', 'np6', 'all']):
    print(f"== stratum {sn}")
    print("   aligned row r (conductor side, loo):", " ".join(f"{x:.4f}" for x in rres[:, s]))
    print("   polar (pred-coherent, cell-constant) share of sum_c |x_c|^2:", " ".join(f"{x:.3f}" for x in share[:, s]), " slope vs Q: %.3f +- %.3f" % tuple(-np.array(slope(share[:, s], range(NB))) * np.array([1, -1])))
    for v, vn in enumerate(['loo', 'band']):
        print(f"   [{vn}] r_null*sqrt(rows):", " ".join(f"{x:.3f}" for x in rns[:, v, s]))
        for f in ('f1', 'f2', 'f3'):
            d1 = slope(rr[f][:, v, s], range(NB)); d2 = slope(rr[f][:, v, s], range(4, NB))
            print(f"   [{vn}] {f} r_rms slope delta = {d1[0]:.4f} +- {d1[1]:.4f} (all Q); {d2[0]:.4f} +- {d2[1]:.4f} (Q >= 3750)")
        d1 = slope(rmax[:, v, s], range(NB))
        print(f"   [{vn}] sup over {ntar} targets x 12 classes: r_max:", " ".join(f"{x:.4f}" for x in rmax[:, v, s]), f" delta = {d1[0]:.3f} +- {d1[1]:.3f}")
        print(f"   [{vn}] max t:", " ".join(f"{x:.1f}" for x in tmaxn[:, v, s]), f" (Exp(1) expectation for {ntar*12} draws: {math.log(ntar*12)+0.5772:.1f}, sd 1.28)")
