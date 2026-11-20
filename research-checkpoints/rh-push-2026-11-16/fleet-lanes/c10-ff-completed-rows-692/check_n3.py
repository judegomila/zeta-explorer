"""check_n3.py : the general assembly (assemble6.completed) at N = 3 against the stored completed results of c9 (results.json: sumnorm_c, diag_c), all six vectors."""
import json
from assemble6 import *
R = json.load(open('../c9-mv6-ff-window-exact/results.json')); ok = True
for (lam, d, dirn) in ((9, 2, 'ref'), ):
    W3 = load(f'{dirn}/q7_N3_lam{lam}_d{d}.txt'); W0 = load(f'{dirn}/q7_N0_lam{lam}_d{d}.txt')
    rec = next(r for r in R if r['q'] == 7 and r['N'] == 3 and r['lam'] == lam and r['d'] == d)
    for name in ('one', 'a', 'b', 'mu', 'al', 'r1'):
        if name == 'r1': S = {3: pick(W3, 'r'), 0: pick(W0, 'r')}; c = completed(3, d, 'r', S)
        elif name == 'al': S = {3: pick(W3, 'al'), 0: pick(W0, 'al')}; c = completed(3, d, 'al', S)
        else: S = {3: pick(W3, name), 0: pick(W0, 'one')}; c = completed(3, d, name, S)
        same = (c['E'] == rec['w'][name]['sumnorm_c'] and c['D'] == rec['w'][name]['diag_c']); ok &= same
        print(f"(3,{lam},{d}) {name}: E {c['E']} D {c['D']} | c9 stored {rec['w'][name]['sumnorm_c']} {rec['w'][name]['diag_c']} | identical: {same}")
print('ALL IDENTICAL' if ok else 'MISMATCH')
