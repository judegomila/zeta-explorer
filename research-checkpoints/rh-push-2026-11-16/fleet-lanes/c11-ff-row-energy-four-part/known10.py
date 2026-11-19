"""known10.py : quantities of the completed (6, 10, 2) row that are exact from stored c9 rows before the run (disclosed in PREREG section 0)."""
import json
from fractions import Fraction as Fr
from fourpart import *
from assemble6 import load, pick
R6 = json.load(open('results6.json')); cnt6 = {n: int(R6[n]['diag_parts']['0']) // int(R6[n]['np']) for n in ('one', 'a', 'b', 'mu')}
for lam in (9, 10, 11, 12):
    W3 = load(f'ref/q7_N3_lam{lam}_d2.txt'); W0 = load(f'ref/q7_N0_lam{lam}_d2.txt'); S0 = pick(W0, 'one')['rows']
    for name in ('one', 'a', 'b', 'mu'):
        w = pick(W3, name); np_ = w['np']; V1, Vsq, Vsf = Vs(name); d1, d2 = diag_cube(name, np_); Dc = np_*cnt6[name] + d1 + d2
        E1 = q*sum(V1[mi]**2 * norm(w['rows'][mi]) for mi in range(nm))
        print(f"(6, {lam}, 2) {name}: D_c = {Dc}; diagonal shares j = 0, 1, 2: {np_*cnt6[name]/Dc:.4f}, {d1/Dc:.4f}, {d2/Dc:.4f}; E_j1/D_c = {E1/Dc:.5g}; squarefree row of length 3: energy/diagonal = {w['sumnorm']/w['diag']:.4g}")
