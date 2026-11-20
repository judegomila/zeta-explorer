import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
c = json.load(open(os.path.join(HERE, 'after', 'scored_with_map-open-23.json')))
c = c['candidates'] if isinstance(c, dict) else c
hq = [x for x in c if any('HQ' in (r.get('verdict') or '') for r in x['rowsChecked'])]
ex = next(r for x in hq for r in x['rowsChecked'] if 'HQ' in (r.get('verdict') or ''))
top = json.load(open(os.path.join(HERE, 'final', 'CANDIDATES.json')))['candidates']
topb = json.load(open(os.path.join(HERE, 'before', 'CANDIDATES.json')))['candidates']
f = lambda T: sum(1 for x in T if any('HQ' in (r.get('verdict') or '') for r in x['rowsChecked']))
g = lambda T: sum(1 for x in T if any(r.get('row') in ('X2', 'G45', 'row-X2', 'row-G45') for r in x['rowsChecked']))
out = json.load(open(os.path.join(HERE, 'after', 'scored_counts.json')))
out.update(scoredWithVerdictNamingHQ=len(hq), exampleVerdict=ex, top60FinalVerdictNamingHQ=f(top), top60BeforeVerdictNamingHQ=f(topb), top60FinalCheckingX2orG45=g(top), top60BeforeCheckingX2orG45=g(topb))
json.dump(out, open(os.path.join(HERE, 'after', 'scored_counts.json'), 'w'), indent=1, ensure_ascii=False); print(json.dumps(out)[:1200])
