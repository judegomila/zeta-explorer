#!/usr/bin/env python3
"""zone.py outdir -- mean t of the Moebius-phased (theta) row twisted by alpha^k N^{iv}, by zones of (|k|, |j|), v = 1.963 j.
A value below 1 means the twisted smoothed Kubota sum is shorter than a random sum (functional equation in the modulus)."""
import os, sys, numpy as np
outd = sys.argv[1]
def cols(t):
    s = t.shape[:-2]
    return t.reshape(s + (2, 2, 3, 6)).transpose(tuple(range(len(s))) + (len(s) + 1, len(s) + 2, len(s), len(s) + 3)).reshape(s + (2, 3, 12))
KZ = [(1, 1), (2, 3), (4, 6), (7, 12), (13, 20), (21, 30)]; JZ = [(0, 0), (1, 1), (2, 2), (3, 4), (5, 8), (9, 16), (17, 32), (33, 64), (65, 150)]
for nmf in ('f2r', 'f2'):
    for k in (0, 3, 6, 8, 10):
        z = np.load(os.path.join(outd, f'fam_{k:02d}.npz')); kk = z['f2k']; f = cols(z[nmf]); j0 = f.shape[1] // 2; jj = np.arange(f.shape[1]) - j0
        for iv, vn in enumerate(['loo', 'band']):
            print(f"{nmf} Q={float(z['Q']):.0f} [{vn}/all]   rows |k| zone, cols |j| zone {JZ}")
            for (a, b) in ([(0, 0)] if nmf == 'f2' else []) + KZ:
                mk = (np.abs(kk) >= a) & (np.abs(kk) <= b)
                print(f"   |k| {a:2d}-{b:2d}: " + " ".join(f"{f[mk][:, (np.abs(jj) >= c) & (np.abs(jj) <= d)][:, :, iv, 2].mean():7.3f}" for c, d in JZ))
