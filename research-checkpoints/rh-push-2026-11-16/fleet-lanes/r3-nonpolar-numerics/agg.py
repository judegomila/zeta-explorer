#!/usr/bin/env python3
"""agg.py outdir -- summary of the family scan (fam_k.npz, k = 0..10) -> agg.json + printed tables."""
import os, sys, json, math, numpy as np
outd = sys.argv[1]
nm = np.load(os.path.join(outd, 'norms.npz')); Qs = nm['Qs']; NB = len(Qs)
VAR = ['loo', 'band']; STR = ['p6', 'np6', 'all']
nr = np.concatenate([nm['nr'], nm['nr'].sum(1, keepdims=True)], 1)       # [k, 3, 12]
nb = np.concatenate([nm['nb'], nm['nb'].sum(1, keepdims=True)], 1)       # [k, 3]
cnt = np.concatenate([nm['cnt'], nm['cnt'].sum(1, keepdims=True)], 1)
def P(*a): print(*a, flush=True)
J = {'Q': Qs.tolist()}
def cols(t):
    """[..., par, 36] -> [..., var, str, sigma12] with sigma ordered (parity block, slot)."""
    s = t.shape[:-2]
    return t.reshape(s + (2, 2, 3, 6)).transpose(tuple(range(len(s))) + (len(s) + 1, len(s) + 2, len(s), len(s) + 3)).reshape(s + (2, 3, 12))
def stats(t):
    """t: [ntarget, 12] -> dict"""
    x = t.reshape(-1).astype(float); n = len(x); nt = t.shape[0]
    xs = np.sort(x); ks = np.abs((1 - np.exp(-xs)) - (np.arange(n) + 0.5) / n).max()
    tm = t.astype(float).mean(1)
    return dict(n=nt, mean=float(x.mean()), se=float(tm.std(ddof=1) / math.sqrt(nt)) if nt > 1 else float('nan'), m2=float((x ** 2).mean()),
                f3=float((x > 3).mean()), f6=float((x > 6).mean()), max=float(x.max()), emax=math.log(n) + 0.5772, ks=float(ks), ks05=1.36 / math.sqrt(n))
def line(name, s):
    return f"{name:28s} n={s['n']:6d} mean t {s['mean']:.4f} +- {s['se']:.4f}  E t^2 {s['m2']:.3f}  P(t>3) {s['f3']:.4f}  P(t>6) {s['f6']:.5f}  max {s['max']:.2f} (exp {s['emax']:.2f})  KS {s['ks']:.4f} (5%: {s['ks05']:.4f})"
P("Exp(1) reference: mean 1, E t^2 2, P(t>3) 0.0498, P(t>6) 0.00248")
fam = {}
for k in range(NB):
    z = np.load(os.path.join(outd, f'fam_{k:02d}.npz'))
    cop = z['cop']; sig = np.concatenate([cop[0], cop[1]])
    N0 = cols(z['N0'][None])[0]                                           # [var, str, 12] (ordered by block, slot)
    rn2 = N0 / (nr[k][:, sig][None] * nb[k][None, :, None])               # r_null^2 [var, str, 12]
    f1 = cols(z['f1']); f1s = cols(z['f1s']); a = z['f1a']; p = z['f1p']; w = z['f1w']
    order = (p - 1) // np.gcd(a, p - 1); order[a == 0] = 1
    groups = {'F1 principal': order == 1, 'F1 order 2': order == 2, 'F1 order 3': order == 3, 'F1 order 6': order == 6, 'F1 order 4,12': (order == 4) | (order == 12),
              'F1 other orders': (order > 1) & ~np.isin(order, [2, 3, 4, 6, 12]), 'F1 all nonprincipal': order > 1}
    f2 = cols(z['f2']); f2r = cols(z['f2r']); kk = z['f2k']; vv = z['f2v']; k0 = int(np.flatnonzero(kk == 0)[0]); j0 = len(vv) // 2
    f3 = cols(z['f3']); st = cols(z['stein']); ii = cols(z['iid'])
    Xa = cols((np.abs(z['Xa']) ** 2 / z['N0'])[None])[0]                  # t of the trivial target (row 'a')
    D = {}
    P(f"\n================ k = {k}: Q = {Qs[k]:.0f}, R = {float(z['R']):.0f}, window nodes {z['nw'].tolist()}, half rows {cnt[k].astype(int).tolist()}")
    for iv, vn in enumerate(VAR):
        for js, sn in enumerate(STR):
            tag = f"{vn}/{sn}"; d = {}
            d['rnull_rms'] = float(np.sqrt(rn2[iv, js].mean())); d['inv_sqrt_rows'] = float(1 / math.sqrt(2 * cnt[k, js]))
            d['rnull2'] = rn2[iv, js].tolist()
            for g, m in groups.items():
                d[g] = stats(f1[m][:, iv, js]); d[g + ' (shuffled)'] = stats(f1s[m][:, iv, js])
            # jackknife over primes for the nonprincipal mean, and r_rms
            m = order > 1; tm = f1[m][:, iv, js].astype(float)
            d['F1 r_rms'] = float(np.sqrt((tm.mean(0) * rn2[iv, js]).mean())); d['F1 r_max'] = float(np.sqrt((tm * rn2[iv, js][None]).max()))
            d['F1 mean t by sigma'] = tm.mean(0).tolist()
            pm = np.array([tm[p[m] == q].mean() for q in np.unique(p)]); d['F1 se over primes'] = float(pm.std(ddof=1) / math.sqrt(len(pm)))
            f2m = np.ones(f2.shape[:2], bool); f2m[k0, j0] = False
            d['F2 alpha^k N^iv'] = stats(f2[f2m][:, iv, js]); d['F2 (0,0)'] = float(f2[k0, j0, iv, js].mean())
            d['F2 by |k|'] = [float(f2[np.abs(kk) == q][:, :, iv, js].mean()) for q in range(0, 31)]
            d['F2 k=0 by |j|<=10'] = [float(f2[k0, j0 + q, iv, js].mean()) for q in range(-10, 11)]
            d['F2 r_rms'] = float(np.sqrt((f2[f2m][:, iv, js].astype(float).mean(0) * rn2[iv, js]).mean()))
            d['F2 r_max'] = float(np.sqrt((f2[f2m][:, iv, js].astype(float) * rn2[iv, js][None]).max()))
            d['F2r (0,0)'] = float(f2r[k0, j0, iv, js].mean())
            d['F2r k=0 by j'] = [float(f2r[k0, j0 + q, iv, js].mean()) for q in range(-8, 9)]
            d['F2r j=0 by k'] = [float(f2r[k0 + q, j0, iv, js].mean()) for q in range(-6, 7)]
            far = (np.abs(kk)[:, None] >= 1) | (np.abs(np.arange(len(vv)) - j0)[None, :] >= 12)
            d['F2r away from pole'] = stats(f2r[far][:, iv, js])
            d['F2r k!=0'] = stats(f2r[np.abs(kk) >= 1].reshape(-1, 2, 3, 12)[:, iv, js])
            d['F3 primes j=1,5'] = stats(f3[4:, [0, 4]].reshape(-1, 2, 3, 12)[:, iv, js])
            d['F3 primes j=2,4'] = stats(f3[4:, [1, 3]].reshape(-1, 2, 3, 12)[:, iv, js])
            d['F3 primes j=3'] = stats(f3[4:, [2]].reshape(-1, 2, 3, 12)[:, iv, js])
            d['F3 special y=2,lam,-1,w by j'] = f3[:4, :, iv, js].astype(float).mean(-1).tolist()
            d['F3 r_rms'] = float(np.sqrt((f3[4:].reshape(-1, 2, 3, 12)[:, iv, js].astype(float).mean(0) * rn2[iv, js]).mean()))
            d['Steinhaus'] = stats(st[:, iv, js]); d['iid'] = stats(ii[:, iv, js])
            d['row a (trivial target) t'] = float(Xa[iv, js].mean())
            D[tag] = d
            if sn == 'all' or k == NB - 1:
                P(f"--- {tag}: r_null rms {d['rnull_rms']:.5f}, 1/sqrt(rows) {d['inv_sqrt_rows']:.5f}; row a t = {d['row a (trivial target) t']:.2f}; F1 se over primes {d['F1 se over primes']:.4f}")
                for g in list(groups) + ['F1 all nonprincipal (shuffled)', 'F2 alpha^k N^iv', 'F2r away from pole', 'F2r k!=0', 'F3 primes j=1,5', 'F3 primes j=2,4', 'F3 primes j=3', 'Steinhaus', 'iid']:
                    P("   " + line(g, d[g]))
                P(f"   F2 (0,0) t = {d['F2 (0,0)']:.2f}; F2r (0,0) t = {d['F2r (0,0)']:.1f}; F2r k=0, j=-8..8: " + " ".join(f"{x:.1f}" for x in d['F2r k=0 by j']))
                P("   F2r j=0, k=-6..6: " + " ".join(f"{x:.2f}" for x in d['F2r j=0 by k']))
                P("   F3 special (rows y = 2, lam, -1, w; cols j=1..5): " + " | ".join(" ".join(f"{x:.2f}" for x in r) for r in d['F3 special y=2,lam,-1,w by j']))
                P("   F1 mean t by sigma: " + " ".join(f"{x:.3f}" for x in d['F1 mean t by sigma']))
                P(f"   r_rms: F1 {d['F1 r_rms']:.5f}  F2 {d['F2 r_rms']:.5f}  F3 {d['F3 r_rms']:.5f};  r_max: F1 {d['F1 r_max']:.5f}  F2 {d['F2 r_max']:.5f}")
    fam[k] = D
J['fam'] = fam
# ---------------- exponent fits and coherent-amplitude bounds along the path
lq = np.log(Qs)
def fit(yv, ks_):
    c = np.polyfit(lq[ks_], np.log(np.array(yv)[ks_]), 1); return -c[0]
P("\n================ path summary (stratum x variant)")
summ = {}
for vn in VAR:
    for sn in STR:
        tag = f"{vn}/{sn}"; d = [fam[k][tag] for k in range(NB)]
        E = np.array([x['F1 all nonprincipal']['mean'] - 1 for x in d]); se = np.array([max(x['F1 all nonprincipal']['se'], x['F1 se over primes']) for x in d])
        rn = np.array([x['rnull_rms'] for x in d])
        a95 = np.sqrt(np.maximum(E + 2 * se, 0)) * rn
        s = dict(E=E.tolist(), se=se.tolist(), rnull=rn.tolist(), coh95=a95.tolist())
        for f in ('F1', 'F2', 'F3'):
            rr = [x[f + ' r_rms'] for x in d]; s[f + ' r_rms'] = rr
            s[f + ' delta all'] = float(fit(rr, np.arange(NB))); s[f + ' delta Q>=3750'] = float(fit(rr, np.arange(4, NB)))
        s['rnull delta'] = float(fit(rn, np.arange(NB)))
        s['F1 r_max'] = [x['F1 r_max'] for x in d]; s['F2 r_max'] = [x['F2 r_max'] for x in d]
        s['F1 rmax delta'] = float(fit(s['F1 r_max'], np.arange(NB))); s['F2 rmax delta'] = float(fit(s['F2 r_max'], np.arange(NB)))
        summ[tag] = s
        P(f"--- {tag}")
        P("   Q:            " + " ".join(f"{q:8.0f}" for q in Qs))
        P("   F1 mean t - 1:" + " ".join(f"{x:+8.4f}" for x in E))
        P("   se:           " + " ".join(f"{x:8.4f}" for x in se))
        P("   r_null rms:   " + " ".join(f"{x:8.5f}" for x in rn))
        P("   coherent r, 95% upper: " + " ".join(f"{x:8.5f}" for x in a95))
        P("   F1 r_rms:     " + " ".join(f"{x:8.5f}" for x in s['F1 r_rms']) + f"   delta {s['F1 delta all']:.3f} (Q>=3750: {s['F1 delta Q>=3750']:.3f})")
        P("   F2 r_rms:     " + " ".join(f"{x:8.5f}" for x in s['F2 r_rms']) + f"   delta {s['F2 delta all']:.3f} (Q>=3750: {s['F2 delta Q>=3750']:.3f})")
        P("   F3 r_rms:     " + " ".join(f"{x:8.5f}" for x in s['F3 r_rms']) + f"   delta {s['F3 delta all']:.3f} (Q>=3750: {s['F3 delta Q>=3750']:.3f})")
        P("   F1 r_max:     " + " ".join(f"{x:8.5f}" for x in s['F1 r_max']) + f"   delta {s['F1 rmax delta']:.3f}")
        P("   F2 r_max:     " + " ".join(f"{x:8.5f}" for x in s['F2 r_max']) + f"   delta {s['F2 rmax delta']:.3f}")
J['path'] = summ
json.dump(J, open(os.path.join(outd, 'agg.json'), 'w'))
