"""c15 tables from the run outputs. usage: make_tables.py <outdir> <tables dir>"""
import json
import os
import sys

O, T = sys.argv[1], sys.argv[2]
os.makedirs(T, exist_ok=True)
EX = ['a1-with', 'b1-Aw', 'b1-Ao', 'b1-B', 'b2-with', 'b3-with', 'b3-without', 'b4m-with', 'b4p-with', 'b4p-without', 'b5l-with', 'b5m-with', 'b5p-with', 'b6-with']
rows = []
tot = dict(nodes=0, ttrain=0, und=0, full=0, fe_ttrain=0, fe_und=0, fe_full=0, pz_ttrain=0, pz_full=0)


def line(name, s):
    pa, fe, pz = s['PA/all'], s['PA/FE'], s['PZ/all']
    h = pa['nrej_hist']
    mx = max(q - 1 for q, c in enumerate(h) if c > 0)
    noone = h[0] + h[1]
    for k, v in (('nodes', s['nodes']), ('ttrain', pa['ttrain']), ('und', pa['undecided']), ('full', pa['full']), ('fe_ttrain', fe['ttrain']), ('fe_und', fe['undecided']),
                 ('fe_full', fe['full']), ('pz_ttrain', pz['ttrain']), ('pz_full', pz['full'])):
        tot[k] += v
    return '| %s | %d | %d | %d | %d | %d | %s | %d | %d | %d / %d / %d (%d) | %d / %d / %d (%d) | %d / %d |' % (
        name, s['nodes'], noone, pa['ttrain'], pa['undecided'], pa['full'], ' '.join(str(x) for x in pa['rejected']), mx, pa['best_min_heldout'],
        fe['ttrain'], fe['undecided'], fe['full'], fe['best_min_heldout'], pz['ttrain'], pz['undecided'], pz['full'], pz['best_min_heldout'],
        s['shuffle']['ttrain'], s['shuffle']['full'])


hdr = ('| family | nodes | nodes with no rejectable class (includes nodes with no one-signed lam) | PA T-train (strict) | PA undecided (float64) | PA full | nodes at which the class is rejectable: DH T-NR E_a HEAT theta^w U THIN BLS BEU | most classes rejected at one lam | best min held-out (of 24) | FE tier: T-train / undecided / full (best min) | PZ: T-train / undecided / full (best min) | shuffles with T-train / full (of 200) |\n'
       '|---|---|---|---|---|---|---|---|---|---|---|---|')
out = [hdr]
for f in EX:
    s = json.load(open(os.path.join(O, f + '_summary.json')))['summary']
    out.append(line(f, s))
for kind in ('T', 'Q'):
    p = os.path.join(O, 'c%s_summary.json' % kind)
    if os.path.exists(p):
        J = json.load(open(p))
        for f in ('c1', 'c2', 'c3'):
            out.append(line('%s-%s' % (f, kind), J['families'][f]['summary']))
open(os.path.join(T, 'exact_families.md'), 'w').write('\n'.join(out) + '\n')
m = ['| family | functionals | stage 2 (no conflict on PZ) | one-signed on PA | PA T-train | PA optimistic | PA full | PZ one-signed | PZ rejected per class: DH T-NR E_a HEAT theta^w U THIN BLS BEU | PZ T-train | PZ optimistic | PZ full | PZ best min held-out |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
mt = {}
for k in (2, 3):
    J = json.load(open(os.path.join(O, 'a%d-with_summary.json' % k)))
    t = J['tiers']
    pa, pz = t.get('PA/all'), t.get('PZ/all')
    mt['a%d' % k] = dict(functionals=J['functionals'], stage2=J['stage2'], tiers=t)
    m.append('| a%d-with | %d | %d | %d | %d | %d | %d | %d | %s | %d | %d | %d | %d |' % (k, J['functionals'], J['stage2'], pa['one'], pa['ttrain'], pa['optimistic'], pa['full'], pz['one'],
             ' '.join(str(x) for x in pz['rejected']), pz['ttrain'], pz['optimistic'], pz['full'], pz['best_min_heldout']))
open(os.path.join(T, 'minors.md'), 'w').write('\n'.join(m) + '\n')
json.dump(dict(exact_totals=tot, minors=mt), open(os.path.join(T, 'totals.json'), 'w'), indent=1)
print('\n'.join(out))
print('\n'.join(m))
print(tot)
