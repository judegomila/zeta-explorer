"""check_indep12.py : second code path for the cube parts at (6, 12, 2) and (6, 9, 2): c10's assemble6.completed (its own coef(), V_j and diagonal) with a zero S_6 block,
against fourpart.py / vecs.py.  |Tq + Tf|^2 = E_2 of assemble6; D_c from assemble6 with the support count of the (6, 9, 2) run."""
import json
from fractions import Fraction as Fr
import assemble6 as A6
from fourpart import decompose, norm, add, nm
R6 = json.load(open('results6.json')); ok = True
for lam in (9, 12):
    W0 = A6.load(f'ref/q7_N0_lam{lam}_d2.txt'); S0 = A6.pick(W0, 'one'); np_ = S0['np']; W3 = A6.load(f'ref/q7_N3_lam9_d2.txt')
    for name in ('one', 'a', 'b', 'mu'):
        cnt = int(R6[name]['diag_parts']['0']) // int(R6[name]['np']); s3 = dict(A6.pick(W3, name)); s3['np'] = np_; s3['diag'] = s3['diag'] // 4483696 * np_
        fake = {'np': np_, 'diag': np_*cnt, 'rows': [(0, 0)]*49}
        c = A6.completed(6, 2, name, {6: fake, 3: s3, 0: S0}); r = decompose(name, None, None, S0['rows'], np_, np_*cnt)
        # E_2 of assemble6 = |Tq + Tf|^2 ; fourpart: |Tq|^2 + |Tf|^2 + mixed.  Compare D_c and E_2 through the mixed term computed here from fourpart's terms.
        from fourpart import terms, re2, en
        X, Tq, Tf, V = terms(name, None, None, S0['rows']); E2 = en([add(a, b) for a, b in zip(Tq, Tf)])
        same = c['D'] == r['D_c'] and c['Ej'][2] == E2; ok = ok and same
        print(f"{'OK  ' if same else 'DIFF'} (6, {lam}, 2) {name}: D_c {r['D_c']} and E_2 {E2} equal to assemble6: {same};  E_2/D_c = {E2/r['D_c']:.5g}")
print('INDEP', 'PASS' if ok else 'FAIL')
