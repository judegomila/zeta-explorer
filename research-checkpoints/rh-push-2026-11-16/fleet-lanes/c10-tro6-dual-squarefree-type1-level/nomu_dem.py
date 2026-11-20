"""nomu_dem.py -- r2 of the Moebius-free variant of form (a) (weight alpha^2 G N^(-1/2), no mu) before and after removal of the
class mean of the rows (lane c10 diagnostic; same path and cells as ana10.py, u = lambda).
Usage: python nomu_dem.py acc_a.npz table.npz"""
import sys, math, numpy as np
import alib as A, zomega as Z, ana10
d = np.load(sys.argv[1]); T = A.SFTable(sys.argv[2])
idx = d['idx']; M = float(d['M']); X = int(d['X']); R = d['r6'][:, 0].astype(complex)
nn = len(idx); N = T.N[idx].astype(float); na = T.na[idx]; nb = T.nb[idx]
pos = {(int(x), int(y)): j for j, (x, y) in enumerate(zip(na.tolist(), nb.tolist()))}
cz = na + nb * Z.to_c((0, 1)); alpha = cz / np.abs(cz); Gv = T.G()[idx]; mu = T.mu[idx].astype(float)
w0 = alpha ** 2 * Gv / np.sqrt(N); cellc = T.m4[idx].astype(np.int64) * 9 + T.m9[idx].astype(np.int64)
ncell = (np.floor(np.log2(np.maximum(N, 1))).astype(np.int64)) * 108 + cellc
cnt = np.bincount(ncell); mean = np.zeros((len(cnt), 24), complex); np.add.at(mean, ncell, R); mean /= np.maximum(cnt, 1)[:, None]
Rd = R - mean[ncell]
rng = np.random.default_rng(20261118 + 9); rps = [np.exp(2j * np.pi * rng.random(nn)) for _ in range(6)]
for th_name, th in (('2/9', 2 / 9), ('1/3', 1 / 3)):
    xs = []; out = {k: [] for k in ('nomu raw', 'nomu demeaned', 'mu raw', 'mu demeaned')}; seeds = [[] for _ in rps]
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
        def r2(rows, w):
            t = np.zeros((len(cs), 24), complex); np.add.at(t, co, rows[ni]); t = t * w[cs][:, None]
            tt = t[:, :12] + t[:, 12:]; Sm = np.zeros((108, 12), complex); np.add.at(Sm, cellc[cs], tt)
            return math.sqrt((np.abs(Sm) ** 2).sum() / (np.abs(tt) ** 2).sum())
        out['nomu raw'].append(r2(R, w0)); out['nomu demeaned'].append(r2(Rd, w0)); out['mu raw'].append(r2(R, w0 * mu)); out['mu demeaned'].append(r2(Rd, w0 * mu))
        for q, p in enumerate(rps): seeds[q].append(r2(Rd * p[:, None], w0))
        xs.append(Mj)
    ss = [ana10.slope(xs, s) for s in seeds]
    print(f"X={X:.0e} theta={th_name} u=lambda; seeds (demeaned random-phase rows, weight without mu): exponents [{min(ss):+.4f}, {max(ss):+.4f}]")
    for k, v in out.items():
        print(f"   {k:14s} r2: " + ' '.join(f"{x:.3f}" for x in v) + f"   exponent {ana10.slope(xs, v):+.4f}")
