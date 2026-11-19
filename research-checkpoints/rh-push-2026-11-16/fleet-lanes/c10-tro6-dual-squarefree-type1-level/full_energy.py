"""full_energy.py -- energy of the full signed conductor sum in class cells, relative to the exact random-phase-row expectation
(lane c10).  E = sum_cells |sum_m rho_sigma(m) A[m, cell]|^2 / sum_m sum_sigma |rho_sigma(m)|^2 sum_cells |A[m, cell]|^2.
  weights 'beta'    : A from c9 istrat_acc (beta_c = alpha gamma_2; cells c mod 4 x c mod 9), the TRO6 row
  weights 'mu beta' : A from acc10 mode b at level a = 1 (mu(c) beta_c = alpha^2 G conj gamma_1; cells c mod 4)
Also the split-half cross version Ex (only the part of rho-hat common to the two estimator halves).
Usage: python full_energy.py c9_acc.npz acc_b.npz table.npz"""
import sys, numpy as np, math
import alib as A, ana10
c9 = np.load(sys.argv[1]); d = np.load(sys.argv[2]); T = A.SFTable(sys.argv[3])
rows = d['rows']; assert (rows == c9['rows']).all()
r6 = d['r6']; r3 = d['r3']; NB = int(d['NB']); Qi = d['Qi']; nr = len(rows)
fac, keep = ana10.factor_rows(rows, T)
rng = np.random.default_rng(20261118 + 3)
order = keep[np.argsort(T.pq[keep], kind='stable')]
thin = dict(zip(order.tolist(), ana10.thin_flags(T.pq[order]).tolist()))
def msign(sg): return np.array([np.prod([sg[i] ** e for i, e in f.items()]) if f else 1.0 for f in fac])
Om = np.array([sum(f.values()) for f in fac])
var = {'theta': (r6, None), 'liouville': (r6, (-1.0) ** Om), 'thin': (r6, msign({i: (-1.0 if thin[i] else 1.0) for i in order.tolist()})), 'cubicrows': (r3, None)}
for k in range(4): var[f'randmult{k}'] = (r6, msign(dict(zip(order.tolist(), rng.choice([-1.0, 1.0], len(order)).tolist()))))
for k in range(4): var[f'randphase{k}'] = (r6, np.exp(2j * np.pi * rng.random(nr)))
print('columns: Q | per variant E (beta weights, 1296 cells) / E (mu beta weights, 144 cells) / Ex (beta weights)')
tab = {k: [] for k in var}
for i in range(NB):
    Q = float(Qi[i])
    if Q < 600: continue
    sel = rows[:, 0] <= Q; nrow = int(sel.sum())
    A9 = c9['Aa'][:nrow, i * 108:(i + 1) * 108].astype(np.complex128)
    Ab = d[f'A{i}'][:, 0, :].astype(np.complex128)
    line = f"Q={Q:7.0f}"
    for nm, (base, tw) in var.items():
        rr = base[:nrow] if tw is None else base[:nrow] * tw[:nrow, None]
        h0, h1 = rr[:, :12], rr[:, 12:]; rf = h0 + h1
        out = []
        for AA in (A9, Ab):
            num = (np.abs(rf.T @ AA) ** 2).sum(); den = ((np.abs(rf) ** 2).sum(1) * (np.abs(AA) ** 2).sum(1)).sum()
            out.append(num / den)
        numx = ((h0.T @ A9) * np.conj(h1.T @ A9)).real.sum(); denx = ((h0 * np.conj(h1)).real.sum(1) * (np.abs(A9) ** 2).sum(1)).sum()
        out.append(numx / denx)
        tab[nm].append(out)
        if nm in ('theta', 'liouville', 'thin', 'cubicrows', 'randmult0', 'randphase0'): line += f" | {nm} {out[0]:.3f}/{out[1]:.3f}/{out[2]:.3f}"
    print(line, flush=True)
print('means over path points (E beta, E mu beta, Ex beta) and standard error of the mean:')
for nm, v in tab.items():
    v = np.array(v); print(f"  {nm:11s} " + ' '.join(f"{m:.3f}+-{s:.3f}" for m, s in zip(v.mean(0), v.std(0) / math.sqrt(len(v)))))
