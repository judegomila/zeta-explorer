"""firsttest.py : DECISIVE FIRST TEST (local, before PREREG; stored exact rows of c9 only).  The cube-term parts of the completed N = 6 row
depend on the vector only through c(n), deg n <= 2, and on the marked primes only through the companion row S_0 (trivial cofactor), which c9 stored
for lam = 9, 10, 11, 12 at d = 2.  So C = |Tq|^2 and D = |Pi Tf|^2 are exact at (6, lam, 2), lam = 9..12, without any N = 6 run; D_c needs only counts
(the support count of the N = 6 block is lam-independent and taken from the (6, 9, 2) run)."""
import json, statistics
from fractions import Fraction as Fr
from fourpart import *
from assemble6 import load, pick
R6 = json.load(open('results6.json')); out = {}
cnt6 = {n: int(R6[n]['diag_parts']['0']) // int(R6[n]['np']) for n in ('one', 'a', 'b', 'mu')}
names = ['one', 'a', 'b', 'mu'] + ['cm%d' % s for s in range(1, 25)] + ['ru%d' % s for s in range(1, 25)]
L = []
for lam in (9, 10, 11, 12):
    W0 = load(f'ref/q7_N0_lam{lam}_d2.txt'); w = pick(W0, 'one'); S0 = w['rows']; np_ = w['np']
    e0 = Fr(w['sumnorm'], w['diag']); sh = Fr(norm(tot(S0)), nm*w['sumnorm']) if w['sumnorm'] else Fr(0)
    L.append(f'(6, {lam}, 2): np = {np_}; companion S_0: energy/diagonal = {float(e0):.6g}, share along v_0 = {float(sh):.6f}')
    out[lam] = {'np': np_, 'e_S0': float(e0)}
    cls = {'cm': [], 'ru': []}
    for name in names:
        r = decompose(name, None, None, S0, np_, np_*cnt6.get(name, cnt6['one'])); D = r['D_c']
        v = {'D': float(r['D']/D), 'D_total': float(Fr(r['D_total'], D)), 'C_total': float(Fr(r['C_total'], D)), 'C_perp': float(r['C_perp']/D), 'D_c': D, 'meanVsf2': float(r['meanVsf2'])}
        out[lam][name] = v
        if name[:2] in cls and name not in ('one', 'a', 'b', 'mu'): cls[name[:2]].append(v['D'])
        else: L.append(f"   {name}: D = |Pi Tf|^2/D_c = {v['D']:.6g}  (|Tf|^2/D_c = {v['D_total']:.6g});  C = |Tq|^2/D_c = {v['C_total']:.6g} (C_perp {v['C_perp']:.4g});  mean Vsf^2 = {v['meanVsf2']:.4g}")
    for c, x in cls.items():
        x = sorted(x); L.append(f"   class {c}, 24 seeds: D min {x[0]:.6g}, median {statistics.median(x):.6g}, max {x[-1]:.6g}, mean {statistics.mean(x):.6g}")
        out[lam][c] = x
json.dump(out, open('firsttest.json', 'w'), indent=0); open('firsttest.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
