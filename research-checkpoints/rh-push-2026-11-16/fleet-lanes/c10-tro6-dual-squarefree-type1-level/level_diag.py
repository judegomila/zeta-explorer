"""level_diag.py -- per-level energy ratio L(a) = sum_cells |t_a|^2 (theta rows) / mean over 12 random-phase row draws, against the
number of conductors per (level, class) cell, at every path point (lane c10, diagnostic for the L statistic of form (b)).
Usage: python level_diag.py acc_b.npz table.npz out.json"""
import sys, json, math, numpy as np
import alib as A
d = np.load(sys.argv[1]); T = A.SFTable(sys.argv[2])
X = int(d['X']); NB = int(d['NB']); r6 = d['r6']; Qi = d['Qi']; levN = d['levN'].astype(float); lev = d['lev']
rows = d['rows']; nr = len(rows)
rng = np.random.default_rng(20261118 + 7)
rp = [np.exp(2j * np.pi * rng.random(nr)) for _ in range(12)]
Xc = X / 4.0; N = T.N.astype(float)
# density of multiples of a among squarefree nodes: prod 1/(N(p)+1)
dens = []
for a in lev.tolist():
    x = 1.0; i = a
    while i > 0:
        x /= (float(T.pq[T.last[i]]) + 1); i = int(T.parent[i])
    dens.append(x)
dens = np.array(dens)
out = []
bins = [(0, 6), (6, 12), (12, 25), (25, 50), (50, 100), (100, 200), (200, 400), (400, 1000), (1000, 3000), (3000, 1e9)]
agg = {b: [0.0, 0.0] for b in bins}; agg_hi = {b: [0.0, 0.0] for b in bins}
for i in range(NB):
    Q = float(Qi[i])
    if Q < 600: continue
    Ai = d[f'A{i}'].astype(np.complex128); nrow, nl, _ = Ai.shape
    ncond = int(((N <= Xc / 2 ** i) & (N > Xc / 2 ** (i + 1))).sum())
    rr = r6[:nrow, :12] + r6[:nrow, 12:]
    Dth = (np.abs(np.einsum('ms,maf->asf', rr, Ai)) ** 2).sum((1, 2))
    Drp = np.mean([(np.abs(np.einsum('ms,maf->asf', rr * p[:nrow, None], Ai)) ** 2).sum((1, 2)) for p in rp], 0)
    ncell = ncond * dens[:nl] / 12.0
    L = Dth / Drp
    rec = {'Q': Q, 'conductors': ncond, 'L_a1': float(L[0]), 'levels': []}
    for b in bins:
        s = (ncell >= b[0]) & (ncell < b[1]); s[0] = False
        if s.any():
            rec['levels'].append({'ncell_range': b, 'levels': int(s.sum()), 'L': float(Dth[s].sum() / Drp[s].sum())})
            tgt = agg_hi if Q > 5000 else agg
            tgt[b][0] += Dth[s].sum(); tgt[b][1] += Drp[s].sum()
            agg[b][0] += 0
    out.append(rec)
    print(f"Q={Q:8.0f} cond={ncond:7d} L(a=1)={L[0]:.3f} (cell size {ncell[0]:.0f}) | " + ' '.join(f"[{b['ncell_range'][0]:.0f},{b['ncell_range'][1]:.0f}):{b['L']:.3f}({b['levels']})" for b in rec['levels']))
print("pooled over path points with Q <= 5000: " + ' '.join(f"[{b[0]:.0f},{b[1]:.0f}):{v[0] / v[1]:.3f}" for b, v in agg.items() if v[1] > 0))
print("pooled over path points with Q >  5000: " + ' '.join(f"[{b[0]:.0f},{b[1]:.0f}):{v[0] / v[1]:.3f}" for b, v in agg_hi.items() if v[1] > 0))
json.dump(out, open(sys.argv[3], 'w'), indent=1)
