"""rows.py <lam> <out.json> : exact rows S_6, S_3 (every vector) and the companion S_0 at (N, lam, 2), q = 7, from the Y tables of `ffy ytab` (server; numpy).
Also the cofactor-slot energy SDA = sum_{m, A' squarefree coprime to m} |Y[m][A']|^2 (= the mean of the row energy over independent unimodular phases on the cofactors)."""
import sys, json, os
import numpy as np
from ylib import *
lam = int(sys.argv[1]); D = os.path.dirname(os.path.abspath(__file__)); nseed = 24
names = ['one', 'a', 'b', 'mu'] + ['cm%d' % s for s in range(1, nseed + 1)] + ['ru%d' % s for s in range(1, nseed + 1)]
out = {'lam': lam, 'vectors': {}}
for N in (6, 3, 0):
    y = Y(f'{D}/results/y_q7_N{N}_lam{lam}_d2'); out['np'] = y.np
    ok = y.sqf[None, :] & y.cop
    sda = sum(int(x) for x in (np.where(ok, y.Ya*y.Ya + y.Ya*y.Yb + y.Yb*y.Yb, 0)).sum(axis=1)); out[f'SDA{N}'] = str(sda); out[f'D{N}_full'] = str(y.np * int(ok.sum()))
    if N == 0:
        r, diag, sw = y.rows(np.zeros((1, 1), dtype=np.uint8))[0]; out['S0'] = [[str(a), str(b)] for a, b in r]
        ra, da, sa = y.aligned(); out['S0_al'] = [[str(a), str(b)] for a, b in ra]; continue
    W = np.stack([vector_fn(n, N)[N] for n in names]).astype(np.uint8); res = y.rows(W)
    for n, (r, diag, sw) in zip(names, res):
        out['vectors'].setdefault(n, {})[f'S{N}'] = [[str(a), str(b)] for a, b in r]; out['vectors'][n][f'diag{N}'] = str(diag)
    ra, da, sa = y.aligned(); out['vectors'].setdefault('al', {})[f'S{N}'] = [[str(a), str(b)] for a, b in ra]; out['vectors']['al'][f'diag{N}'] = str(da)
    print(f'N = {N}: {len(names) + 1} vectors assembled', flush=True)
json.dump(out, open(sys.argv[2] + '.tmp', 'w')); os.rename(sys.argv[2] + '.tmp', sys.argv[2]); print('ROWS_DONE', sys.argv[2])
