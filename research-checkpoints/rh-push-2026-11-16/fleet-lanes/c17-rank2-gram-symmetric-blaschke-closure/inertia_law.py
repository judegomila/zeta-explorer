# Negative index of K_0 (T = 0) for zeta times a Blaschke factor, n = 40 and 64 points, certified inertia. MEASURED.
# Question: is the number of negative squares equal to the number of zeros a of Theta with Re a < 1/2 (with multiplicity) whose
# partner 1 - a is missing (multiplicity deficit), plus the sign condition for an odd number of real zeros?
import json, random, sys
from flint import acb, arb, ctx
import k2, search
h = 0.5
def c(x, y): return complex(x, y)
cases = [
 ('zeta', [], 0),
 ('left pair 0.2+-3i', [c(0.2, 3), c(0.2, -3)], 2),
 ('two left pairs 0.2+-3i, 0.35+-1i', [c(0.2, 3), c(0.2, -3), c(0.35, 1), c(0.35, -1)], 4),
 ('real left pair {0.3, 0.2}', [c(0.3, 0), c(0.2, 0)], 2),
 ('real right pair {0.6, 0.8}', [c(0.6, 0), c(0.8, 0)], 0),
 ('real {0.25 left, 0.9 right} (not partners)', [c(0.25, 0), c(0.9, 0)], 1),
 ('quartet(0.25,2) exact', [('q', 0.25, 2.0)], 0),
 ('quartet(0.25,2) + extra copy of the left pair (left mult 2, right mult 1)', [('q', 0.25, 2.0), c(0.25, 2), c(0.25, -2)], 2),
 ('quartet(0.25,2) + extra copy of the right pair (left mult 1, right mult 2)', [('q', 0.25, 2.0), c(0.75, 2), c(0.75, -2)], 0),
 ('quartet(0.25,2) twice (double quartet)', [('q', 0.25, 2.0), ('q', 0.25, 2.0)], 0),
 ('left pair + quartet elsewhere', [c(0.2, 3), c(0.2, -3), ('q', 0.125, 1.0)], 2),
 ('on-line double pair 1/2+-2i (mult 2)', [c(0.5, 2), c(0.5, -2)]*2, 0),
 ('on-line simple pair 1/2+-2i (mult 1)', [c(0.5, 2), c(0.5, -2)], None),
 ('single real zero 0.75', [c(0.75, 0)], None),
 ('single real zero 0.25', [c(0.25, 0)], None),
 ('three real zeros {0.25, 0.75 (partners), 1}', [('rp', 0.25), c(1, 0)], None),
]
out = []
for name, zs, pred in cases:
    cfg = dict(name=name, base='zeta', zeros=zs, kind='x', order=0)
    counts = {}
    for fam in ('low', 'special', 'realish', 'polar', 'height'):
        for n in (40, 64):
            for seed in (1, 2):
                rng = random.Random(1000*seed + n)
                raw = search.gen_points(fam, n, cfg, rng)
                r = k2.certify(lambda: [(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in raw], lambda: k2.make_M(k2.M_zeta, zs), (0, 0))
                key = r['nneg'] if r['status'] == 'ok' else 'undecided'
                counts[key] = counts.get(key, 0) + 1
    print('%-75s predicted %s  observed nneg histogram %s' % (name, pred, dict(sorted(counts.items(), key=str)))); sys.stdout.flush()
    out.append(dict(case=name, predicted=pred, nneg_histogram={str(k): v for k, v in counts.items()}))
json.dump(out, open('inertia_law.json', 'w'), indent=1)
