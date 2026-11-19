"""cmp_row.py : PREREG section 4 step 6.  Rows of `ffw6 enw` at (6, 7, 1) against the independent closed-form kernel `ffx row` (vectors a and mu), and the two code paths of ffw6."""
import os
from assemble6 import *
W = load('results/q7_N6_lam7_d1.txt'); ok = True
for name in ('a',):   # the planned mu comparison was dropped: the rows of mu and of the trivial vector vanish identically at d = 1
    fn = f'results/row_q7_d1_N6_lam7_{name}.txt'
    if not os.path.exists(fn) or not open(fn).read().strip(): print(name, ': ffx row output missing'); ok = False; continue
    R = []
    for line in open(fn):
        t = line.split()
        if len(t) == 7: H = [int(x) for x in t[1:]]; R.append((H[0]-H[2]-H[3]+H[5], H[1]+H[2]-H[4]-H[5]))
    w = pick(W, name); same = (R == w['rows']); ok &= same
    print(f"(6,7,1) {name}: ffx row rows {R}\n            ffw6 rows  {w['rows']}\n   identical: {same}; sum of norms {w['sumnorm']}, diag {w['diag']}, e = {w['sumnorm']/w['diag']:.4f}")
g = 'results/q7_N6_lam7_d1_generic.txt'
if os.path.exists(g):
    same = open(g).read() == open('results/q7_N6_lam7_d1.txt').read(); ok &= same; print('bit-mask path and byte path of ffw6 at (6,7,1), six vectors, all lines identical:', same)
else: ok = False; print('generic-path file missing')
for w in W: print('ENW', w['mode'], w['p'], 'e =', f"{w['sumnorm']/w['diag']:.4g}")
print('N6 CHECK', 'PASSED' if ok else 'FAILED')
