"""digest.py -- digest of an istrat_acc.py output for cross-machine comparison."""
import sys, numpy as np
d = np.load(sys.argv[1])
w = np.cos(np.arange(d['Aa'].shape[1]) * 0.37)[None, :] * np.sin(np.arange(d['Aa'].shape[0]) * 0.11 + 1)[:, None]
print('rows', d['rows'].shape, int(d['rows'].sum()), 'counts', int(d['counts'].sum()))
for k in ('Aa', 'Ap'):
    a = d[k].astype(np.complex128); print(k, f"{np.abs(a).sum():.6f}", f"{(a * w).sum():.6f}")
for k in ('r6', 'r3'):
    a = d[k]; print(k, f"{np.abs(a).sum():.8f}", f"{(a * w[:, :24]).sum():.8f}")
