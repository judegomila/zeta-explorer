import numpy as np, lib7, sys
lg = float(sys.argv[1]); X = 2.0 ** lg; M = X
D = lib7.build(int(2 * X) + 1); pl, S, qc, gam, inc, mu = D['pl'], D['S'], D['qc'], D['gam'], D['inc'], D['mu']
sel = np.nonzero((qc > X / 2) & (qc < 2 * X))[0]; q = qc[sel].astype(float); V = lib7.bump(q / X); I = inc[sel]
u, v, qm = lib7.lattice(8 * M); T, Zm = lib7.sym_table(pl, u, v); ch = lib7.chi_c(I, T, Zm)
G = (ch * np.exp(-np.pi * qm / M)) @ np.conj(ch).T
share = (I @ I.T) > 0.5; eye = np.eye(len(sel), dtype=bool)
nprime = I.sum(1)
for name, wt in (('liou', np.ones(len(sel))), ('one', mu[sel])):
    a = wt * np.conj(gam[sel]) * V / np.sqrt(q)
    Q = np.outer(a, np.conj(a)) * G
    print(name, 'total %.4f diag %.4f coprime %.4f noncoprime-offdiag %.4f' % (Q.sum().real, Q[eye].sum().real, Q[~share].sum().real, Q[share & ~eye].sum().real))
