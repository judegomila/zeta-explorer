"""lemmaM.py : Lemma M (mean of the squarefree-n part over unimodular cube coefficients).  For independent c(n) with E c(n) conj(c(n')) = delta:
    E |Tf|^2 = q^2 sum_m nu(m) |S_0(m)|^2,   nu(m) = #{n squarefree of degree 2 coprime to m}  (42 for m irreducible, 36 or 40 otherwise as counted below).
Compared with the 24 ru and 24 cm seeds and the targets at lam = 9, 12 (exact |Tf|^2 from the stored companion rows)."""
import json, statistics
from fractions import Fraction as Fr
from fourpart import *
from assemble6 import load, pick
F1 = json.load(open('firsttest.json'))
nu = [sum(1 for i in range(q*q) if i not in SQ and CHI3[2][i][mi]) for mi in range(nm)]
print('nu(m) values:', sorted(set(nu)), 'mean', sum(nu)/nm)
for lam in (9, 12):
    S0 = pick(load(f'ref/q7_N0_lam{lam}_d2.txt'), 'one')['rows']; mean = q*q*sum(nu[mi]*norm(S0[mi]) for mi in range(nm)); Dc = F1[str(lam)]['cm1']['D_c']
    tf = {c: [F1[str(lam)][f'{c}{s}']['D_total'] for s in range(1, 25)] for c in ('cm', 'ru')}
    print(f"lam = {lam}: exact mean |Tf|^2 / D_c = {mean/Dc:.5f}; seeds: ru mean {statistics.mean(tf['ru']):.5f} (sd {statistics.pstdev(tf['ru']):.3f}), cm mean {statistics.mean(tf['cm']):.5f} (sd {statistics.pstdev(tf['cm']):.3f}); targets a {F1[str(lam)]['a']['D_total']:.5f}, b {F1[str(lam)]['b']['D_total']:.5f}; one {F1[str(lam)]['one']['D_total']:.4f}; mu {F1[str(lam)]['mu']['D_total']:.4f}")
