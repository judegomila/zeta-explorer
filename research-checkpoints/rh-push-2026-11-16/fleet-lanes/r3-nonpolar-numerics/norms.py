#!/usr/bin/env python3
"""norms.py -- row-side norms needed to convert t (conductor-side statistic) into r (correlation against Cauchy-Schwarz).
nr[k, st, sigma] = sum over generic half rows N(m) <= Q_k of |rho_nat_sigma|^2;  nb[k, st] = sum of |B^0|^2 + |B^1|^2
for the row type 'a' at window k; nse = estimator noise sum se^2; cnt = row counts.  Conventions of r2 analysis.py."""
import os, glob, numpy as np
R2 = os.path.expanduser('~/rh-push/r2-tro6-nonpolar-scale/out')
stc = np.load(os.path.join(R2, 'static.npz')); Qs = stc['Qs']; NB = len(Qs); types = [str(t) for t in stc['types']]
TA = types.index('a'); TR = types.index('res')
nr = np.zeros((NB, 2, 12)); nse = np.zeros((NB, 2, 12)); nb = np.zeros((NB, 2)); nbr = np.zeros((NB, 2)); cnt = np.zeros((NB, 2))
for f in sorted(glob.glob(os.path.join(R2, 'rows_*.npz'))):
    r = np.load(f); Nm = r['Nm']; fl = r['flags']; gen = ~r['six']
    rho = r['rho_str'] + r['rho_cor']; se = r['se']; B = r['B']
    st = np.where((fl[:, 0] == 0) & (fl[:, 1] == 0), 0, 1)
    for k in range(NB):
        for s in (0, 1):
            m = gen & (st == s) & (Nm <= Qs[k])
            nr[k, s] += (np.abs(rho[m]) ** 2).sum(0); nse[k, s] += (se[m] ** 2).sum(0); cnt[k, s] += m.sum()
            nb[k, s] += (np.abs(B[m, k, :, TA]) ** 2).sum(); nbr[k, s] += (np.abs(B[m, k, :, TR]) ** 2).sum()
    print(f, flush=True)
np.savez('out/norms.npz', nr=nr, nse=nse, nb=nb, nbr=nbr, cnt=cnt, Qs=Qs)
print(cnt)
