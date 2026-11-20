#!/usr/bin/env python3
"""Compare two engine/scoreboard states (directories holding IDEA_GRAPH.json, CANDIDATES.json, scoreboard.json,
devices.json, controls.json). Usage: compare.py <dirA> <dirB> <out.json>. Paths relative to this file."""
import json, os, sys, collections
HERE = os.path.dirname(os.path.abspath(__file__))
A, B, OUT = [os.path.join(HERE, x) for x in sys.argv[1:4]]
ld = lambda d, f: json.load(open(os.path.join(d, f), encoding='utf-8'))

def graph(d):
    g = ld(d, 'IDEA_GRAPH.json')
    nodes = {n['id']: n for n in g['nodes']}
    edges = collections.Counter((e.get('source', e.get('a')), e.get('target', e.get('b')), e.get('type')) for e in g['edges'])
    return g, nodes, edges

def flat(x, p=''):
    out = {}
    if isinstance(x, dict):
        for k, v in x.items(): out.update(flat(v, p + '/' + str(k)))
    elif isinstance(x, list):
        out[p] = json.dumps(x, sort_keys=True)
    else:
        out[p] = x
    return out

def key(c): return ' x '.join(sorted(n['id'] if isinstance(n, dict) else n for n in c['nodes']))

res = {}
ga, na, ea = graph(A); gb, nb, eb = graph(B)
res['nodes'] = [len(na), len(nb)]
res['live'] = [ga['meta']['counts'].get('live'), gb['meta']['counts'].get('live')]
res['rows'] = [ga['meta']['counts'].get('rows'), gb['meta']['counts'].get('rows')]
res['controls'] = [ga['meta']['counts'].get('controls'), gb['meta']['counts'].get('controls')]
res['byType'] = {k: [ga['meta']['counts']['byType'].get(k, 0), gb['meta']['counts']['byType'].get(k, 0)] for k in sorted(set(ga['meta']['counts']['byType']) | set(gb['meta']['counts']['byType'])) if ga['meta']['counts']['byType'].get(k, 0) != gb['meta']['counts']['byType'].get(k, 0)}
res['edges'] = [sum(ea.values()), sum(eb.values())]
res['edgesByType'] = {k: [ga['meta']['counts']['edgesByType'].get(k, 0), gb['meta']['counts']['edgesByType'].get(k, 0)] for k in sorted(set(ga['meta']['counts']['edgesByType']) | set(gb['meta']['counts']['edgesByType']))}
res['devicesMeta'] = [ga['meta']['counts'].get('devices'), gb['meta']['counts'].get('devices')]
res['nodesAdded'] = sorted(set(nb) - set(na)); res['nodesRemoved'] = sorted(set(na) - set(nb))
res['edgesAdded'] = sorted(['%s -> %s [%s]' % k for k in (eb - ea)]); res['edgesRemoved'] = sorted(['%s -> %s [%s]' % k for k in (ea - eb)])
chg = []
for i in set(na) & set(nb):
    d = [f for f in ('status', 'device', 'roles', 'rows', 'tags', 'statement', 'name') if na[i].get(f) != nb[i].get(f)]
    if d: chg.append('%s: %s' % (i, ','.join(d)))
res['nodesChangedFields'] = sorted(chg)
da, db = ld(A, 'devices.json'), ld(B, 'devices.json')
st = lambda d: {s: sum(1 for x in d['devices'] if x['state'] == s) for s in ('closed', 'floored', 'open')}
res['deviceTypes'] = [st(da), st(db)]; res['pending'] = [len(da['pending']), len(db['pending'])]
res['deviceTypesAdded'] = sorted({x['id'] for x in db['devices']} - {x['id'] for x in da['devices']})
res['deviceEvidenceChanged'] = sorted(x['id'] for x in db['devices'] for y in da['devices'] if y['id'] == x['id'] and (y['evidence'] != x['evidence'] or y['state'] != x['state']))
res['controlsCurated'] = [len(ld(A, 'controls.json')['controls']), len(ld(B, 'controls.json')['controls'])]
ca, cb = ld(A, 'CANDIDATES.json'), ld(B, 'CANDIDATES.json')
res['generatorMeta'] = {k: [ca['meta'].get(k), cb['meta'].get(k)] for k in sorted(set(ca['meta']) | set(cb['meta'])) if ca['meta'].get(k) != cb['meta'].get(k) and not isinstance(ca['meta'].get(k), (dict, list))}
for k in ('graphCounts', 'pools', 'filters', 'r4Rules', 'families', 'moves'):
    if isinstance(ca['meta'].get(k), dict):
        fa, fb = flat(ca['meta'][k]), flat(cb['meta'].get(k, {}))
        res['generatorMeta/' + k] = {x: [fa.get(x), fb.get(x)] for x in sorted(set(fa) | set(fb)) if fa.get(x) != fb.get(x)}
ta, tb = ca['candidates'], cb['candidates']
ka, kb = [key(c) for c in ta], [key(c) for c in tb]
sc = lambda c: c.get('score', c.get('total'))
res['top'] = dict(lenA=len(ta), lenB=len(tb), keysInCommon=len(set(ka) & set(kb)), sameOrder=(ka == kb),
                  sameScores=([sc(c) for c in ta] == [sc(c) for c in tb]),
                  rank1=[ka[0] + ' (%s)' % sc(ta[0]), kb[0] + ' (%s)' % sc(tb[0])],
                  entered=[dict(rank=i + 1, key=k, score=sc(tb[i])) for i, k in enumerate(kb) if k not in set(ka)],
                  left=[dict(rank=i + 1, key=k, score=sc(ta[i])) for i, k in enumerate(ka) if k not in set(kb)])
common = [k for k in ka if k in set(kb)]
res['top']['commonRelativeOrderKept'] = (common == [k for k in kb if k in set(ka)])
sa, sb = dict(zip(ka, ta)), dict(zip(kb, tb))
res['top']['commonScoreChanged'] = [dict(key=k, a=sc(sa[k]), b=sc(sb[k])) for k in common if sc(sa[k]) != sc(sb[k])]
rc = collections.Counter()
nrc = 0
for k in common:
    rid = lambda r: (r.get('row') or r.get('id') or json.dumps(r, sort_keys=True)) if isinstance(r, dict) else r
    ra, rb = set(map(rid, sa[k].get('rowsChecked', []))), set(map(rid, sb[k].get('rowsChecked', [])))
    if ra != rb:
        nrc += 1
        for r in rb - ra: rc['+' + r] += 1
        for r in ra - rb: rc['-' + r] += 1
res['top']['commonRowsCheckedChanged'] = dict(candidates=nrc, rows=dict(rc))
fa, fb = flat(ld(A, 'scoreboard.json')), flat(ld(B, 'scoreboard.json'))
res['scoreboardDiff'] = {k: [fa.get(k), fb.get(k)] for k in sorted(set(fa) | set(fb)) if fa.get(k) != fb.get(k) and not k.endswith('/generated')}
json.dump(res, open(OUT, 'w'), indent=1)
show = {k: v for k, v in res.items() if k not in ('edgesAdded',)}
print(json.dumps(show, indent=1)[:6000]); print('edgesAdded:', len(res['edgesAdded']))
for e in res['edgesAdded'][:40]: print('  ', e)
