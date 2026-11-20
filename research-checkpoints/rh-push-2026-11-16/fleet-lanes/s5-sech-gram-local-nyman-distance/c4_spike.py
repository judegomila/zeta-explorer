# c4_spike.py : location of the largest value of P_N for DH (and chi5 as comparison) and P_N near the first off-line DH zero 0.8085 + 85.6993 i.
import json, math, numpy as np, mpmath as mp, objs
out = {}
for tag, coef in (('DH', objs.OBJ_PER['dh']), ('chi5', objs.OBJ_PER['chi5'])):
    N = 5000; G = np.fromfile(f'out4/gram_{tag}.bin', dtype=np.float64).reshape(N, N); n_arr = np.arange(1, N+1.0)
    L1 = -sum(coef[r-1]*float(mp.digamma(mp.mpf(r)/5)) for r in range(1, 6))/5; b = L1/n_arr
    L = np.linalg.cholesky(G); del G; yf = np.linalg.solve(L, b)
    h = 0.005; t = np.arange(60, 120, h); u = t-90.0; F = objs.periodic_line(90.0, u, coef); rows = []
    for n in (20, 50, 100, 500, 5000):
        y = np.linalg.solve(L[:n, :n].T, yf[:n])
        D = np.concatenate([np.exp(-1j*t[k:k+2000, None]*np.log(n_arr[None, :n])) @ (y/np.sqrt(n_arr[:n])) for k in range(0, len(t), 2000)])
        P = np.abs(1-F*D)**2; k = int(P.argmax()); sel = (t > 80) & (t < 91)
        rows.append({'N': n, 'sup_60_120': float(P[k]), 't_at_sup': float(t[k]), 'absF_at_sup': float(abs(F[k])), 'absD_at_sup': float(abs(D[k])), 'sup_80_91': float(P[sel].max()), 'median_60_120': float(np.median(P))})
        print(tag, rows[-1], flush=True)
    out[tag] = rows
json.dump(out, open('out4/c4_spike.json', 'w'), indent=1)
