"""dem_a.py -- form (a) after removal of the first-moment (class-mean) component of the theta estimator (lane c10 diagnostic).
rho-hat_sigma(u n) minus its mean over the cell (octave of N(n), n mod 4, n mod 9), per estimator half and class sigma.
Statistics as in ana10.py (same path, weights, cells); reference rows = demeaned rows times seeded random phases (6 seeds).
Usage: python dem_a.py acc_a.npz table.npz out.json"""
import sys, json, math, numpy as np
import alib as A, zomega as Z, ana10
d = np.load(sys.argv[1]); T = A.SFTable(sys.argv[2])
idx = d['idx']; M = float(d['M']); X = int(d['X']); r6 = d['r6']
nn = len(idx); N = T.N[idx].astype(float); na = T.na[idx]; nb = T.nb[idx]
pos = {(int(x), int(y)): j for j, (x, y) in enumerate(zip(na.tolist(), nb.tolist()))}
cz = na + nb * Z.to_c((0, 1)); alpha = cz / np.abs(cz); Gv = T.G()[idx]; mu = T.mu[idx].astype(float)
wgt = mu * alpha ** 2 * Gv / np.sqrt(N); cellc = T.m4[idx].astype(np.int64) * 9 + T.m9[idx].astype(np.int64)
ncell = (np.floor(np.log2(np.maximum(N, 1))).astype(np.int64)) * 108 + cellc
rng = np.random.default_rng(20261118 + 5)
rps = [np.exp(2j * np.pi * rng.random(nn)) for _ in range(6)]
res = {}
for ui, uname in ((0, 'lambda'), (1, 'y0'), (2, 'one')):
    R = r6[:, ui].astype(complex)
    cnt = np.bincount(ncell); mean = np.zeros((len(cnt), 24), complex); np.add.at(mean, ncell, R); mean /= np.maximum(cnt, 1)[:, None]
    Rd = R - mean[ncell]
    share = float((np.abs(mean[ncell]) ** 2).sum() / (np.abs(R) ** 2).sum()); null = float(len(np.unique(ncell)) / nn)
    for th_name, th in (('2/9', 2 / 9), ('1/3', 1 / 3)):
        xs = []; rows_out = []
        for j in range(12):
            Mj = M / 2 ** j; C = Mj ** (1 - th); S = Mj ** th
            cs = np.flatnonzero((N > C / 2) & (N <= C))
            if len(cs) < 100: break
            ci = []; ni = []
            for c in cs.tolist():
                ns = int(np.searchsorted(N, S * N[c] / C, side='right')); ca, cb = int(na[c]), int(nb[c])
                for s in range(ns):
                    sa, sb = int(na[s]), int(nb[s]); p = pos.get((ca * sa - cb * sb, ca * sb + cb * sa - cb * sb))
                    if p is not None: ci.append(c); ni.append(p)
            ci = np.array(ci); ni = np.array(ni); cmap = np.full(nn, -1); cmap[cs] = np.arange(len(cs)); co = cmap[ci]
            def st(rows, plain=False):
                t = np.zeros((len(cs), 24), complex); np.add.at(t, co, rows[ni])
                t = t * (1 / np.sqrt(N[cs]) if plain else wgt[cs])[:, None]
                tt = t[:, :12] + t[:, 12:]; Sm = np.zeros((108, 12), complex); np.add.at(Sm, cellc[cs], tt)
                return math.sqrt((np.abs(Sm) ** 2).sum() / (np.abs(tt) ** 2).sum()), float((np.abs(tt) ** 2).sum())
            r2_raw, D_raw = st(R); r2_dem, D_dem = st(Rd); r2_plain_raw, _ = st(R, True); r2_plain_dem, _ = st(Rd, True)
            ref_raw = [st(R * p[:, None]) for p in rps]; ref_dem = [st(Rd * p[:, None]) for p in rps]
            rows_out.append({'M_j': Mj, 'conductors': int(len(cs)), 'r2_raw': r2_raw, 'r2_dem': r2_dem, 'L_raw': D_raw / np.mean([x[1] for x in ref_raw]), 'L_dem': D_dem / np.mean([x[1] for x in ref_dem]),
                             'L_dem_seeds': [x[1] / np.mean([y[1] for y in ref_dem]) for x in ref_dem], 'r2_dem_seeds': [x[0] for x in ref_dem],
                             'plain_r2_raw': r2_plain_raw, 'plain_r2_dem': r2_plain_dem})
            xs.append(Mj)
        if len(xs) < 3: continue
        sl = lambda key: ana10.slope(xs, [r[key] for r in rows_out])
        seedsL = [ana10.slope(xs, [r['L_dem_seeds'][q] for r in rows_out]) for q in range(6)]
        seedsr = [ana10.slope(xs, [r['r2_dem_seeds'][q] for r in rows_out]) for q in range(6)]
        res[f'theta={th_name},u={uname}'] = {'points': rows_out, 'mean_share': share, 'mean_share_null': null, 'exp_L_raw': sl('L_raw'), 'exp_L_dem': sl('L_dem'), 'exp_r2_dem': sl('r2_dem'), 'seed_exp_L_dem': seedsL, 'seed_exp_r2_dem': seedsr}
        print(f"[a, demeaned] X={X:.0e} theta={th_name} u={uname}: class-mean share of sum |rho-hat|^2 = {share:.4f} (null {null:.4f})")
        print("    L raw: " + ' '.join(f"{r['L_raw']:.3f}" for r in rows_out) + f" (exp {sl('L_raw'):+.4f}) | L demeaned: " + ' '.join(f"{r['L_dem']:.3f}" for r in rows_out) + f" (exp {sl('L_dem'):+.4f}; seeds [{min(seedsL):+.4f}, {max(seedsL):+.4f}])")
        print("    r2 demeaned: " + ' '.join(f"{r['r2_dem']:.3f}" for r in rows_out) + f" (exp {sl('r2_dem'):+.4f}; seeds [{min(seedsr):+.4f}, {max(seedsr):+.4f}]) | plain-weight r2 raw: " + ' '.join(f"{r['plain_r2_raw']:.2f}" for r in rows_out) + " -> demeaned: " + ' '.join(f"{r['plain_r2_dem']:.2f}" for r in rows_out), flush=True)
json.dump(res, open(sys.argv[3], 'w'), indent=1)
