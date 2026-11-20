"""print the sample neighbourhood of flagged positive minima that are not resolved as close pairs.  usage: find_viol.py in.npz [max]"""
import sys, numpy as np, hole
f = np.load(sys.argv[1], allow_pickle=True); Z = f['Z'].astype(np.float64); pps = int(f['pps']); T0 = float(f['T0']); q = int(f['q']); nwin = len(f['hs'])
d, hs, npw = hole.grid(T0, nwin, q, pps)
n = len(Z); i = np.arange(1, n - 1)
fl = i[((Z[i] > 0) & (Z[i] < Z[i - 1]) & (Z[i] < Z[i + 1])) | ((Z[i] < 0) & (Z[i] > Z[i - 1]) & (Z[i] > Z[i + 1]))]
a2 = (Z[fl - 1] - 2 * Z[fl] + Z[fl + 1]) / 2; b1 = (Z[fl + 1] - Z[fl - 1]) / 2
vertex = Z[fl] - b1 * b1 / (4 * a2); ee = np.sqrt(np.abs(vertex / a2)); close = vertex * Z[fl] < 0
sel = fl[(~close)]; es = ee[~close]
o = np.argsort(-es)[:int(sys.argv[2]) if len(sys.argv) > 2 else 5]
for j in o:
    k = sel[j]; print('idx', k, 'eta_steps', es[j], 'd', repr(d[k]), 'step', hs[k // npw], 'Z', [float(x) for x in Z[k - 3:k + 4]])
