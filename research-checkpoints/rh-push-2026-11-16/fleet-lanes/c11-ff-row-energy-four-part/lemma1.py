"""lemma1.py : FIRST LEMMA.  The registered decomposition at the round-10 size (6, 9, 2), from the stored exact rows, against results6.json of c10:
E_c, D_c, the n = l^2 and squarefree-n energies of the cube term must be the same integers, and the identity of fourpart.py must hold exactly."""
import json, sys
from fractions import Fraction as Fr
from fourpart import *
from assemble6 import load, pick
R6 = json.load(open('results6.json')); W6 = load('ref/q7_N6_lam9_d2.txt'); W3 = load('ref/q7_N3_lam9_d2.txt'); W0 = load('ref/q7_N0_lam9_d2.txt'); S0 = pick(W0, 'one')['rows']
out = {}; ok = True
print('vector | E_c, D_c, |Tq|^2, |Tf|^2 equal to results6.json | identity | e_c | A principal | B own | C = |Tq|^2 (C_perp) | D = |Pi Tf|^2 (|Tf|^2) | G bulk | x_CD | x_CG | x_DG   [units D_c]')
for name in ('one', 'a', 'b', 'mu', 'al'):
    S6 = pick(W6, name); S3 = pick(W3, name); s0 = pick(W0, 'al')['rows'] if name == 'al' else S0
    r = decompose(name, S6['rows'], S3['rows'], s0, S6['np'], S6['diag']); D = r['D_c']; ref = R6[name]
    same = r['E_c'] == int(ref['E_c']) and D == int(ref['D_c'])
    if 'E2_square_n' in ref: same = same and r['C_total'] == int(ref['E2_square_n']) and r['D_total'] == int(ref['E2_sqfree_n'])
    ok = ok and same and r['identity']
    f = lambda x: '%.4g' % float(Fr(x)/D)
    print(f"{name} | {same} | {r['identity']} | {f(r['E_c'])} | {f(r['A'])} | {f(r['B'])} | {f(r['C_total'])} ({f(r['C_perp'])}) | {f(r['D'])} ({f(r['D_total'])}) | {f(r['G'])} | {f(r['x_CD'])} | {f(r['x_CG'])} | {f(r['x_DG'])}")
    print(f"     principal signal by term: X {f(r['X_along'][0])}, Tq {f(r['C_along'][0])}, Tf {f(r['D_along'][0])};  own-character by term: X {f(r['X_along'][1])}, Tq {f(r['C_along'][1])}, Tf {f(r['D_along'][1])}")
    out[name] = {k: (str(v) if not isinstance(v, (list, tuple, bool)) else str(v)) for k, v in r.items() if k != 'rows'}
json.dump(out, open('lemma1_692.json', 'w'), indent=0)
print('FIRST LEMMA at (6, 9, 2):', 'HOLDS (five vectors: integers equal to results6.json, identity exact)' if ok else 'FAILS'); sys.exit(0 if ok else 1)
