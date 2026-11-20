#!/usr/bin/env python3
"""Normalised Gram matrix of the stored toy completed-cubic rows (conj_rows_800.npz): proxy for quasi-orthogonality of rows
with different finite-order twists (psi = alpha G vs alpha) and different lengths R. Rows outside the Kummer coset, prime to 6."""
import sys, os
import numpy as np
d = np.load(os.path.join(sys.argv[1], 'conj_rows_800.npz'))
B = d['B']; fl = d['flags']; keys = [str(k) for k in d['keys']]
sel = (fl[:, 0] == 0) & (fl[:, 1] == 0) & (fl[:, 5] == 0)
Bs = B[sel]; n = Bs.shape[0]
nr = np.sqrt((np.abs(Bs) ** 2).sum(0))
G = np.abs(Bs.conj().T @ Bs) / np.outer(nr, nr)
print(f"rows {n}; random level n^-1/2 = {n ** -.5:.3f}")
print(' ' * 12 + ' '.join(f"{k:>10s}" for k in keys))
for i, k in enumerate(keys):
    print(f"{k:>12s}" + ' '.join(f"{G[i, j]:10.3f}" for j in range(len(keys))))
