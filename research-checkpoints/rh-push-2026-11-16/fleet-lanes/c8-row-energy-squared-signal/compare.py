"""Compare recheck.jsonl (independent recomputation) with the stored block files of c7-ff-order2-vertex-exact."""
import json, os
from fractions import Fraction
H = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(H, '..', 'c7-ff-order2-vertex-exact')
blocks = {}
for d in (3, 4):
    for l in open(os.path.join(B, f'blocks_q7_d{d}.jsonl')):
        r = json.loads(l); blocks[(r['target'], r['N'], r['lam'], r['d'], r['k'])] = r
print('| target | N | lam | d | marks | k (r=0) | energy ||R||^2 | squared signal |J|^2/||c_k||^2 | remainder (direct) | E = S + Rem | |J|^2 = wt^2 q^2d |S_cop|^2 | stored nr2, J2 equal | S/diag | Rem/diag | excess |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
allok = True
for l in open(os.path.join(H, 'recheck.jsonl')):
    o = json.loads(l)
    for b in o['blocks']:
        st = blocks.get((o['target'], o['N'], o['lam'], o['d'], b['k']))
        if b['r'] != 0:
            assert b['J2'] == 0, 'J != 0 at r < 0'
            if st and o['seed'] is None: assert int(st['J2']) == 0
            continue
        cmp_ = 'n/a (control marks)'
        if o['seed'] is None:
            if st is None:
                cmp_ = 'no stored block'
            ok = st is None or int(st['J2']) == b['J2'] and int(st['nr2']) == o['nr2'] and int(st['nc2']) == b['nc2'] and int(st['S_cop']) ** 2 == b['S_cop_abs2']
            cmp_ = cmp_ if st is None else ('yes' if ok else 'NO'); allok &= ok
        allok &= o['identity_energy_eq_signal_plus_remainder'] and b['signal_law_exact'] and o['gram_offdiag_zero'] and Fraction(b['nc2_formula']) == b['nc2']
        f = lambda s: '%.6f' % float(Fraction(s))
        print(f"| {o['target']} | {o['N']} | {o['lam']} | {o['d']} | {'coherent (1)' if o['seed'] is None else 'random 6th roots, seed %d' % o['seed']} | {b['k']} | {o['nr2']} | {b['squared_signal_J2_over_nc2']} | {o['remainder_direct']} | {o['identity_energy_eq_signal_plus_remainder']} | {b['signal_law_exact']} | {cmp_} | {f(o['signal_over_diag'])} | {f(o['remainder_over_diag'])} | {f(o['excess_over_diag'])} |")
print('ALL CHECKS', 'PASS' if allok else 'FAIL')
