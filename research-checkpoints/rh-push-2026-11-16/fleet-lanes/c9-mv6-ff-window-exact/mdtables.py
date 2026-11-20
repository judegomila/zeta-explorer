"""mdtables.py : markdown tables for RESULT.md from results.json / predictions.json (display only)."""
import json
from fractions import Fraction as Fr
from plan import *
res = json.load(open('results.json')); P = json.load(open('predictions.json'))
def f(x):
    x = float(Fr(x)); return f'{x:.3g}' if abs(x) < 1e4 else f'{x:.2e}'
for q in (7, 13):
    names = list(weights(q))
    print(f'\nq = {q}, N = 2 (completed row = squarefree row)\n')
    print('| (N, lam, d) | rmax | r* (a) | B_coh (a) | ' + ' | '.join(names) + ' |'); print('|' + '---|'*(4+len(names)))
    for rec in res:
        if rec['q'] != q or rec['N'] != 2: continue
        cfg = f"({rec['N']}, {rec['lam']}, {rec['d']})"; pk = P[f"{q} 2 {rec['lam']} {rec['d']} a"]
        rs = max([a[1] for a in pk['active']], default='-')
        if not rec['run']: print(f"| {cfg} | {rmax(2, rec['lam'], rec['d'])} | {rs} | {pk['B_coh']:.3g} | " + ' | '.join(['not run']*len(names)) + ' |'); continue
        print(f"| {cfg} | {rmax(2, rec['lam'], rec['d'])} | {rs} | {pk['B_coh']:.3g} | " + ' | '.join(f(rec['w'][n]['e']) for n in names) + ' |')
    print(f'\nq = {q}, N = 3: completed row / squarefree row\n')
    print('| (N, lam, d) | rmax | ' + ' | '.join(names) + ' |'); print('|' + '---|'*(2+len(names)))
    for rec in res:
        if rec['q'] != q or rec['N'] != 3: continue
        cfg = f"({rec['N']}, {rec['lam']}, {rec['d']})"
        if not rec['run']: print(f"| {cfg} | {rmax(3, rec['lam'], rec['d'])} | " + ' | '.join(['not run']*len(names)) + ' |'); continue
        print(f"| {cfg} | {rmax(3, rec['lam'], rec['d'])} | " + ' | '.join(f(rec['w'][n]['e']) + ' / ' + f(rec['w'][n]['e_sqf']) for n in names) + ' |')
