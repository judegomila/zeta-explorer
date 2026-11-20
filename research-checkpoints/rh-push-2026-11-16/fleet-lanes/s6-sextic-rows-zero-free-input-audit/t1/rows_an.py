#!/usr/bin/env python3
"""rows_an.py -- analysis of rows.py output. usage: rows_an.py prefix out.json"""
import sys, os, math, json
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import objs1
pref, outp = sys.argv[1], sys.argv[2]
d = np.load(pref + '_B.npz'); B = d['B']; cols = d['cols']; grid = d['grid'].astype(float); cnt = d['cnt'].astype(float); X = int(d['X']); L = int(d['L']); iid = d['iid']
Nn = cols[:, 0]; K = len(Nn); nsh = len(grid)
tabs = objs1.coeff_tables(L)
MULT = ['gamma1', 'gamma2', 'random']
def coef(o):
    return iid if o == 'randiid' else tabs[o][Nn]
out = {'X': X, 'L': L, 'columns': K}
P = lambda *a: print(*a, flush=True)

def fit_fixed(dS, th, s0=1):
    a = grid[s0:] ** th - grid[s0 - 1:-1] ** th; dd = dS[..., s0:]; n = cnt[s0:]; ok = n > 0
    W = (a[ok] ** 2 / n[ok]).sum()
    c = (dd[..., ok] * (a[ok] / n[ok])).sum(-1) / W
    return c, 1 / math.sqrt(W)
def chi2(dS, th, var, s0=1):
    a = grid[s0:] ** th - grid[s0 - 1:-1] ** th; dd = dS[s0:]; n = cnt[s0:] * var; ok = n > 0
    W = (a[ok] ** 2 / n[ok]).sum(); c = (dd[ok] * (a[ok] / n[ok])).sum() / W
    return 2 * (np.abs(dd[ok] - c * a[ok]) ** 2 / n[ok]).sum(), c
def fit_free(dS, var):
    ths = np.linspace(0.30, 1.0, 351); ch = np.array([chi2(dS, t, var)[0] for t in ths]); i = int(np.argmin(ch)); ins = ths[ch <= ch[i] + 1]
    return float(ths[i]), float(ins.min()), float(ins.max()), float(ch[i]), 2 * int((cnt[1:] > 0).sum()) - 2
def dyadic(S):
    """S = cumulative sums on the grid. sup |S| on dyadic blocks (X/2^{i+1}, X/2^i], i = 0..7; local slopes; LS exponent."""
    sup = []
    for i in range(8):
        m = (grid > X / 2 ** (i + 1)) & (grid <= X / 2 ** i)
        sup.append(float(np.abs(S[m]).max()))
    sup = np.array(sup[::-1]); sl = np.diff(np.log2(sup))
    xs = np.arange(8); A_ = np.polyfit(xs, np.log2(sup), 1)[0]
    return dict(sup=sup.tolist(), slope=float(A_), scatter=float(sl.std(ddof=1) / math.sqrt(len(sl))), local=sl.tolist())

# ---------------- validation on single columns
i1 = int(np.flatnonzero(Nn == 1)[0])
v = {}
for nm, im, j, th in (('cubic Gauss sums, index 1 (Patterson, 5/6)', 1, 4, 5 / 6), ('sextic Gauss sums, index 1 (2/3)', 0, 5, 2 / 3), ('random phases', 2, 5, 0.5)):
    f = fit_free(B[i1, im, j - 1], 1.0); c, se = fit_fixed(B[i1, im, j - 1], th)
    v[nm] = dict(theta=f[0], lo=f[1], hi=f[2], chi2=f[3], dof=f[4], c_abs=float(abs(c)), se=se)
    P(f"validation {nm}: free exponent {f[0]:.3f} [{f[1]:.3f}, {f[2]:.3f}], chi2/dof {f[3]:.0f}/{f[4]}; |c| at fixed exponent {abs(c):.4f} +- {se:.4f}")
out['validation'] = v
# vanishing at exponent 5: index n^5 (j = 1) for prime n against index n (j = 5): mean |c|^2 / se^2
c5, se = fit_fixed(B[:, 0, 0], 2 / 3); c1, _ = fit_fixed(B[:, 0, 4], 2 / 3); cr, _ = fit_fixed(B[:, 2, 4], 2 / 3)
out['theta_snr'] = {f"j={j}": float(np.mean(np.abs(fit_fixed(B[:, 0, j - 1], 2 / 3)[0]) ** 2) / se ** 2) for j in range(1, 6)}
out['theta_snr']['random'] = float(np.mean(np.abs(cr) ** 2) / se ** 2)
P("mean |c_n|^2 / se^2 of the X^(2/3) constant over columns (1 = noise): ", {k: round(v, 2) for k, v in out['theta_snr'].items()})

# ---------------- statistic A: exponent of S_F(X) on dyadic blocks ; statistic B: correlation with theta constants
res = {}
Lc = sorted(set([min(L, 300), min(L, 1000), min(L, 3000), L]))
rng = np.random.default_rng(101)
for Lcut in Lc:
    sel = Nn <= Lcut; w = 1 / np.sqrt(Nn[sel].astype(float))
    null_ph = np.exp(2j * np.pi * rng.random((400, int(sel.sum()))))
    for im in (0, 1, 2):
        for j in (2, 4, 5, 1, 3):
            Bm = B[sel, im, j - 1]                                   # columns x shells
            th0 = 5 / 6 if im == 1 else 2 / 3
            cn, se = fit_fixed(Bm, th0)                              # per-column constants
            nullC = np.abs((null_ph * w) @ cn)
            for o in objs1.OBJ:
                a = coef(o)[sel] * w
                dS = a @ Bm; S = np.cumsum(dS)
                var = float((np.abs(a) ** 2).sum())
                dy = dyadic(S)
                ff = fit_free(dS, var)
                C = complex(a @ cn)
                # null for C with the same moduli |a|: random phases times |a|
                nC = np.abs((null_ph * np.abs(a)) @ cn)
                res[f"{o}|L{Lcut}|{MULT[im]}|j{j}"] = dict(dy=dy, theta=ff[0], lo=ff[1], hi=ff[2], chi2=ff[3], dof=ff[4], l2=var,
                    C_abs=abs(C), C_se=se * math.sqrt(var), null_rms=float(np.sqrt(np.mean(nC ** 2))), null_p=float(np.mean(nC >= abs(C))),
                    S_end=abs(S[-1]), S_norm=abs(S[-1]) / math.sqrt(var * cnt.sum()))
out['rows'] = res
for Lcut in Lc:
    for im, j in ((0, 2), (0, 4), (0, 5), (2, 2), (1, 4)):
        P(f"--- L = {Lcut}, multiplier {MULT[im]}, row power j = {j} (index n^{6 - j})")
        P("  object     block slope +- scatter   free exponent [lo, hi]   chi2/dof   |C|/null rms   null p   |S(X)|/sqrt(var count)")
        for o in objs1.OBJ:
            r = res[f"{o}|L{Lcut}|{MULT[im]}|j{j}"]
            P(f"  {o:9s}  {r['dy']['slope']:.3f} +- {r['dy']['scatter']:.3f}        {r['theta']:.3f} [{r['lo']:.3f}, {r['hi']:.3f}]   {r['chi2']:.0f}/{r['dof']}   {r['C_abs'] / r['null_rms']:.2f}   {r['null_p']:.3f}   {r['S_norm']:.2f}")
# ---------------- rows R_F(c): large sieve and cross-check
if os.path.exists(pref + '_R.npz'):
    r = np.load(pref + '_R.npz'); SR = r['SR']; S2 = r['S2']; S4 = r['S4']; lc = r['lcuts']; ob = [str(x) for x in r['obj']]
    ls = {}
    for il, Lcut in enumerate(lc):
        sel = Nn <= Lcut; w = 1 / np.sqrt(Nn[sel].astype(float))
        P(f"--- cubic rows R_F(c), N(n) <= {Lcut} ({int(sel.sum())} columns), N(c) <= {X:.3g} ({int(cnt.sum())} moduli)")
        P("  object     sum|R|^2/(count l2)   by quarter of the shells                 kurtosis sum|R|^4 count/(sum|R|^2)^2   check vs B (j = 2, gamma1)")
        for io, o in enumerate(ob):
            a = coef(o)[sel] * w; l2 = float((np.abs(a) ** 2).sum())
            tot = S2[il, io].sum() / (cnt.sum() * l2)
            qs = [S2[il, io][k * nsh // 4:(k + 1) * nsh // 4].sum() / (cnt[k * nsh // 4:(k + 1) * nsh // 4].sum() * l2) for k in range(4)]
            kur = S4[il, io].sum() * cnt.sum() / S2[il, io].sum() ** 2
            chk = abs(SR[il, io, 0].sum() - (a @ B[sel, 0, 1]).sum()) / max(1e-9, abs(SR[il, io, 0].sum()))
            ls[f"{o}|L{int(Lcut)}"] = dict(ratio=float(tot), quarters=[float(x) for x in qs], kurt=float(kur), l2=l2, check=float(chk),
                                            first_moment=abs(SR[il, io, 3].sum()) / cnt.sum())
            P(f"  {o:9s}  {tot:.4f}   {' '.join('%.4f' % x for x in qs)}   {kur:.3f}   {chk:.1e}")
    out['large_sieve'] = ls
json.dump(out, open(outp, 'w'), indent=0)
