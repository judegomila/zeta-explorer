"""rows_extra.py -- theta-row correlation against Cauchy-Schwarz as a function of the row length L, and saving exponents.
r_CS(F, L) = |sum_{N(n)<=L} a_F(n) N(n)^{-1/2} c_n| / ( (sum |a_F|^2/N)^{1/2} (sum |c_n|^2 - K se^2)^{1/2} ),
c_n = fitted X^{2/3} constant of sum_c gamma_1(c) chi_c(n)^j (stripped sextic theta coefficient at index n^{6-j}, first-moment normalisation).
s_F = log(CS / |S_F(X)|)/log X with CS = count * (sum |a|^2/N)^{1/2}  (|R_F(c)| replaced by its rms)."""
import sys, os, math, json
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import objs1
pref = sys.argv[1]
d = np.load(pref + '_B.npz'); B = d['B']; cols = d['cols']; grid = d['grid'].astype(float); cnt = d['cnt'].astype(float); X = int(d['X']); L = int(d['L']); iid = d['iid']
Nn = cols[:, 0]; tabs = objs1.coeff_tables(L)
def fit_fixed(dS, th, s0=1):
    a = grid[s0:] ** th - grid[s0 - 1:-1] ** th; n = cnt[s0:]; ok = n > 0
    W = (a[ok] ** 2 / n[ok]).sum(); return (dS[..., s0:][..., ok] * (a[ok] / n[ok])).sum(-1) / W, 1 / math.sqrt(W)
out = {}
Ls = [100, 300, 1000, 3000, 10000, 20000]
rng = np.random.default_rng(5)
for j in (5, 4, 2):
    c, se = fit_fixed(B[:, 0, j - 1], 2 / 3)
    print(f"\nrow power j = {j} (index n^{6 - j}); se per column {se:.4f}; columns with |c| > 3 se: {int((np.abs(c) > 3 * se).sum())} of {len(c)}")
    print("  L      K    sum|c|^2-K se^2   " + "  ".join(f"{o:>8s}" for o in objs1.OBJ) + "   null(rms of 300 random-phase rows)")
    for Lc in Ls:
        sel = Nn <= Lc; K = int(sel.sum()); w = 1 / np.sqrt(Nn[sel].astype(float)); cc = c[sel]
        T2 = float((np.abs(cc) ** 2).sum() - K * se * se)
        row = {}
        for o in objs1.OBJ:
            a = (iid[sel] if o == 'randiid' else tabs[o][Nn[sel]]) * w
            C = abs(complex(a @ cc)); row[o] = C / math.sqrt(float((np.abs(a) ** 2).sum()) * max(T2, 1e-12))
        nul = np.sqrt(np.mean(np.abs((np.exp(2j * np.pi * rng.random((300, K))) * w) @ cc) ** 2)) / math.sqrt(float((w * w).sum()) * max(T2, 1e-12))
        out[f"j{j}|L{Lc}"] = dict(K=K, T2=T2, r=row, null=float(nul), se=se)
        print(f"  {Lc:6d} {K:5d}  {T2:8.4f}   " + "  ".join(f"{row[o]:8.4f}" for o in objs1.OBJ) + f"   {nul:.4f}")
    # decay exponents of r_CS in L between L = 300 and L = 20000
    print("  exponent of r_CS in L (300 -> %d): " % Ls[-1] + "  ".join(f"{o}={math.log(out[f'j{j}|L{Ls[-1]}']['r'][o] / out[f'j{j}|L300']['r'][o]) / math.log(Ls[-1] / 300):+.2f}" for o in objs1.OBJ))
json.dump(out, open(pref + '_extra.json', 'w'))
