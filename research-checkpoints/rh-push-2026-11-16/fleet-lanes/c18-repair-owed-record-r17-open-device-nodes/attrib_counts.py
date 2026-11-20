#!/usr/bin/env python3
"""Counts over every scored candidate (generate.py --dump-all), lane c18-repair. Usage: attrib_counts.py <all_scored.json>"""
import json, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
allc = json.load(open(sys.argv[1]))
ids = lambda c: [n['id'] if isinstance(n, dict) else n for n in c['nodes']]
key = lambda c: ' x '.join(sorted(ids(c)))
S = {key(c): c['score'] for c in allc}
cmp_ = json.load(open(os.path.join(HERE, 'top60_before_after.json')))
B = json.load(open(os.path.join(HERE, 'before', 'CANDIDATES.json')))['candidates']
kb = {key(c): c['score'] for c in B}
left = cmp_['left']
still = [k for k in left if k in S]; gone = [k for k in left if k not in S]
P = ['tz-one-sided-completion-bound-band', 'exact-relation-rigidity']
out = {}
for p in P:
    cs = [c for c in allc if p in ids(c)]
    out[p] = dict(scored=len(cs), best=max(c['score'] for c in cs), withPenalty=sum(1 for c in cs if c['scoreParts']['penalties'] < 0))
both = [c for c in allc if all(p in ids(c) for p in P)]
cells = [c for c in allc if c.get('cells')]
res = dict(scoredTotal=len(allc), leftTop60=dict(n=len(left), stillScored=len(still), sameScore=sum(1 for k in still if abs(S[k] - kb[k]) < 1e-9), noLongerScored=gone),
           perProposedNode=out, withBoth=len(both), withCellMember=len(cells), bestWithCell=max((c['score'] for c in cells), default=None))
json.dump(res, open(os.path.join(HERE, 'after', 'scored_counts.json'), 'w'), indent=1); print(json.dumps(res, indent=1))
