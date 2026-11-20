import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(HERE, 'after', 'scored_with_map-open-23.json')))
c = d['candidates'] if isinstance(d, dict) else d
ids = lambda x: [n['id'] if isinstance(n, dict) else n for n in x['nodes']]
out = dict(scoredInDump=len(c), scoredContainingMapOpen23=sum(1 for x in c if 'map-open-23' in ids(x)),
           scoredNamingHQControl=sum(1 for x in c if (x.get('control') or '') in ('ctl-HQ2', 'ctl-HQ3', 'ctl-HQ4')),
           scoredWithRowCheckX2orG45=sum(1 for x in c if any(r.get('row') in ('row-X2', 'row-G45', 'X2', 'G45') for r in x.get('rowsChecked', x.get('checkedRows', [])) if isinstance(r, dict))),
           keysOfCandidate=sorted(c[0].keys()) if c else [])
json.dump(out, open(os.path.join(HERE, 'after', 'scored_counts.json'), 'w'), indent=1); print(out)
