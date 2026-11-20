"""c16: tables from main.json (or main.json.part). usage: summ.py <json> [outjson]"""
import json, sys
from collections import Counter
d = json.load(open(sys.argv[1]))
rows = d['rows']
seen = set()
dup = 0
for q in rows:
    k = (q['fam'], q['node'])
    dup += k in seen
    seen.add(k)
out = dict(rows=len(rows), duplicates=dup, fam={})
for fam in sorted(set(q['fam'] for q in rows)):
    R = [q for q in rows if q['fam'] == fam]
    c = Counter(q['res'] for q in R)
    o = dict(n=len(R), res=dict(c), nb=sum(q.get('nb', 0) for q in R), maxprec=dict(Counter(str(q.get('maxprec', 0)) for q in R)),
             nleft=sum(q.get('nleft', 0) for q in R))
    ex = [q for q in R if q['res'] == 'excluded']
    o['excluded_rejectable_pattern(T-NR,E_a,HEAT)'] = dict(Counter(''.join('Y' if x else 'n' for x in q['rejectable']) + ('' if q['one_signable'] else ' not-one-signable') for q in ex))
    tt = [q for q in R if q['res'] == 'ttrain']
    if tt:
        o['primary_full'] = sum(bool(q['primary']['full']) for q in tt)
        o['primary_exit'] = dict(Counter(str(q['primary']['exit']) for q in tt))
        o['primary_PH_min'] = min(q['primary'].get('PH', -1) for q in tt)
        for key in ('H2', 'H3', 'H4'):
            v = [q['primary'][key] for q in tt if key in q['primary']]
            o['primary_%s_seen' % key] = dict(n=len(v), max=max(v) if v else None)
        o['secondary_any'] = sum(bool(q['secondary']['any']) for q in tt)
        o['secondary_best_cheap_hist'] = dict(sorted(Counter(q['secondary']['best_cheap'] for q in tt).items()))
        o['secondary_heat_stage'] = sum(q['secondary']['heat_stage'] > 0 for q in tt)
        o['secondary_best_all_max'] = max(q['secondary']['best_all'] for q in tt)
        o['ttrain_abs_u'] = [min(abs(q['u']) for q in tt), max(abs(q['u']) for q in tt)]
        o['ttrain_sign_s'] = dict(Counter(q['ints'][0][0] for q in tt))
        o['ttrain_interval_abs_max'] = max(max(abs(a) for a in q['ints'][0][1:]) for q in tt)
    un = [q for q in R if q['res'] == 'undecided']
    o['undecided_list'] = [dict(node=q['node'], u=q['u'], h=q['h'], left=q['left'], nleft=q['nleft']) for q in un][:50]
    o['abs_u_range'] = [min(abs(q['u']) for q in R), max(abs(q['u']) for q in R)]
    out['fam'][fam] = o
    print(fam, json.dumps(o)[:1800])
tot = Counter()
for f, o in out['fam'].items():
    for k, v in o['res'].items():
        tot[k] += v
out['total'] = dict(tot)
out['primary_full_total'] = sum(o.get('primary_full', 0) for o in out['fam'].values())
out['secondary_any_total'] = sum(o.get('secondary_any', 0) for o in out['fam'].values())
print('TOTAL', out['rows'], 'dup', dup, dict(tot), 'primary full', out['primary_full_total'], 'secondary any', out['secondary_any_total'])
if len(sys.argv) > 2:
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
