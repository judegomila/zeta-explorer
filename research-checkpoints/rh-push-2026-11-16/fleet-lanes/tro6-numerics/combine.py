#!/usr/bin/env python3
"""combine.py -- concatenate the complete blocks of fast.py; trim to whole norms; write rows_c.npz (rows with A = c),
rows_full.npz (rows with A = c n^3, n squarefree) and E.npy (spectrum exponents)."""
import glob, sys, numpy as np
fs = sorted(glob.glob('data/blk_*.npz')); d = [np.load(f) for f in fs]
cat = lambda k: np.concatenate([x[k] for x in d])
Nm = cat('Nm'); alld = 'ALLDONE' in open('fast.log').read()
keep = np.ones(len(Nm), bool) if alld else (Nm < Nm[-1])
keys = np.load('data/conductors.npz')['keys']
base = {k: cat(k)[keep] for k in ('ms', 'Nm', 'rho_str', 'rho_cor', 'se', 'flags', 'sqf', 'sq', 'six')}
B = cat('B')[keep]; Bn = cat('Bn')[keep]
np.savez('rows_c.npz', **base, B=B, keys=keys)
np.savez('rows_full.npz', **base, B=B + Bn, keys=keys)
np.save('Bn.npy', Bn); np.save('E.npy', cat('E')[keep])
print(f"blocks {len(fs)}, rows kept {int(keep.sum())}, N(m) <= {int(Nm[keep].max())}, complete = {alld}")
