"""c16: merge the server rows (main.json or main.json.part) with the local helper slices; check coverage of the
registered node lists and agreement on nodes computed twice. usage: merge.py <c15dir> <outjson> <server json> <local slice json>..."""
import json, sys, os
import numpy as np
c15, outf, files = sys.argv[1], sys.argv[2], sys.argv[3:]
want = set()
for fam in ('b1-Aw', 'b3-with', 'b6-with', 'b2-with', 'b5l-with', 'b5m-with', 'b5p-with'):
    s = json.load(open(os.path.join(c15, 'out2', fam + '_summary.json')))['summary']
    for q in s['PA/canon/rows_und']:
        want.add((fam, int(q)))
rows = {}
src = {}
twice = agree = 0
dis = []
for f in files:
    d = json.load(open(f))
    for q in d['rows']:
        k = (q['fam'], q['node'])
        if k in rows:
            twice += 1
            a = rows[k]
            same = a['res'] == q['res'] and a.get('rejectable') == q.get('rejectable')
            if same and a['res'] == 'ttrain':
                same = a['primary']['full'] == q['primary']['full'] and a['secondary']['any'] == q['secondary']['any'] and a['ints'][0][0] == q['ints'][0][0] \
                    and abs(a['ints'][0][1] - q['ints'][0][1]) <= 1e-9 * abs(a['ints'][0][1]) and abs(a['ints'][0][2] - q['ints'][0][2]) <= 1e-9 * abs(a['ints'][0][2])
            if same:
                agree += 1
            else:
                dis.append((k, src[k], f))
        else:
            rows[k] = q
            src[k] = f
got = set(rows)
print('registered family-nodes %d; computed %d; missing %d; extra %d; computed twice %d (agree %d, disagree %d)'
      % (len(want), len(got & want), len(want - got), len(got - want), twice, agree, len(dis)))
if dis:
    print('DISAGREE', dis[:10])
bysrc = {}
for k, f in src.items():
    key = 'server' if 'main' in os.path.basename(f) else 'local'
    bysrc[key] = bysrc.get(key, 0) + 1
print('rows by source', bysrc)
json.dump(dict(rows=[rows[k] for k in sorted(rows)], coverage=dict(registered=len(want), computed=len(got & want), missing=len(want - got), extra=len(got - want),
                                                                  twice=twice, twice_agree=agree, twice_disagree=len(dis)), by_source=bysrc), open(outf, 'w'))
