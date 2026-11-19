"""squares.py : POST-HOC split of the row energy between the rows m that are perfect squares (m = l^2, d = 2) and the others.
For a square m the cube part L_0(s, chi_m^3) of the completed series is a zeta function (chi_n(m)^3 = 1 for (n, m) = 1): V_1(m) = q - 1 instead of -1.
Printed for every d = 2 configuration and vector: e over all rows, e over the non-square rows, e over the square rows (each = energy / diagonal of the same rows).
Exact integers; the diagonal of a row subset is recomputed from the definition."""
import json, math
from fractions import Fraction as Fr
from plan import *
import analyze
from ffpy import FF, norm
L = ['q (N,lam,d) vector | e all rows | e non-square rows | e square rows | share of the energy on square rows']
for fam, (q, N, d, lams) in FAM.items():
    if d != 2: continue
    F = FF(q); Wq = weights(q); names = list(Wq); nm = q**d; ms = [F.idx2poly(i, d) for i in range(nm)]
    sq = [any(F.pmul(l, l) == m for l in (F.idx2poly(i, 1) for i in range(q))) for m in ms]
    As = [F.idx2poly(i, N) for i in range(q**N)]; sqf = [F.gphase(A, 0) is not None for A in As]; lin = [F.idx2poly(i, 1) for i in range(q)]
    copA = [[F.res(A, m) != 0 for m in ms] for A in As]; copn = [[F.res(n, m) != 0 for m in ms] for n in lin]
    m0 = next(mi for mi, m in enumerate(ms) if F.irreducible(m))
    for lam in lams:
        W = analyze.load(q, N, lam, d)
        if W is None: continue
        W0 = analyze.load(q, 0, lam, d) if N == 3 else None
        if N == 3 and W0 is None: continue
        for i, name in enumerate(names):
            w = W[i]; mode, p1, p2, p3 = Wq[name]
            if N == 3: sn, dg, = analyze.completed(q, lam, d, name, w, W0, F); rows = analyze.completed.rows; supn = analyze.completed.sup_n
            else: rows = w['rows']; supn = []
            if mode == 0 and p1 > 0:
                Fp = F.idx2poly(p2, p1); sup = [ai for ai in range(len(As)) if sqf[ai] and F.res(Fp, As[ai]) != 0]
            elif mode == 5: sup = [ai for ai in range(len(As)) if sqf[ai] and copA[ai][m0]]
            else: sup = [ai for ai in range(len(As)) if sqf[ai]]
            out = []
            for sel in (None, False, True):
                idx = [mi for mi in range(nm) if sel is None or sq[mi] == sel]
                E = sum(norm(rows[mi]) for mi in idx)
                Dg = w['np'] * (sum(sum(1 for mi in idx if copA[ai][mi]) for ai in sup) + q * sum(sum(1 for mi in idx if copn[ni][mi]) for ni in supn))
                out.append((E, Dg))
            assert out[0][0] == out[1][0] + out[2][0] and out[0][1] == out[1][1] + out[2][1]
            L.append(f"{q} ({N},{lam},{d}) {name} | {out[0][0]/out[0][1]:.4g} | {out[1][0]/out[1][1]:.4g} | {out[2][0]/out[2][1]:.4g} | {out[2][0]/max(out[0][0],1):.3f}")
open('squares.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
