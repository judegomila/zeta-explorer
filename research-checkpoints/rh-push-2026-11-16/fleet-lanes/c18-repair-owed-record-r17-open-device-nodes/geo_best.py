#!/usr/bin/env python3
"""Best-scored candidate per geometric-program tag (partner tag, declared) on each proposed device node. Usage: geo_best.py <all_scored.json>"""
import json, sys, os
HERE = os.path.dirname(os.path.abspath(__file__)); ENG = os.path.normpath(os.path.join(HERE, '..', '..', 'engine'))
GEO = ['twin-ladder', 'bridge', 'shear', 'antibridge', 'torus', 'klein', 'spinor', 'twistor', 'zero-channel', 'vortex']
P = ['tz-one-sided-completion-bound-band', 'exact-relation-rigidity']
tags = {n['id']: set(n['tags']) for n in json.load(open(os.path.join(ENG, 'IDEA_GRAPH.json')))['nodes']}
allc = sorted(json.load(open(sys.argv[1])), key=lambda c: -c['score'])
ids = lambda c: [n['id'] if isinstance(n, dict) else n for n in c['nodes']]
res = {}
for p in P:
    res[p] = {}
    for t in GEO:
        cs = [(k + 1, c) for k, c in enumerate(allc) if p in ids(c) and any(t in tags[i] for i in ids(c) if i not in P)]
        res[p][t] = dict(scored=len(cs), best=(dict(score=cs[0][1]['score'], positionAmongAllScored=cs[0][0], nodes=ids(cs[0][1]), penalties=cs[0][1]['scoreParts']['penalties']) if cs else None))
json.dump(res, open(os.path.join(HERE, 'after', 'geo_best.json'), 'w'), indent=1)
for p in P:
    for t in GEO:
        b = res[p][t]['best']
        print(p[:12], t, res[p][t]['scored'], b and (b['score'], b['positionAmongAllScored'], ' x '.join(i for i in b['nodes'] if i not in P)))
