import json, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
g = json.load(open(os.path.join(HERE, '..', '..', 'engine', 'IDEA_GRAPH.json')))
N = {n['id']: n for n in g['nodes']}
for i in ('ctl-HQ2', 'ctl-HQ3', 'ctl-HQ4', 'row-X2', 'row-G45', 'row-P58', 'row-D10', 'row-Z37', 'row-X1', 'row-G44'):
    n = N.get(i); print(i, bool(n), (n or {}).get('status'), (n or {}).get('defeatedByControls'))
E = g['edges']; print('edge keys', sorted(E[0].keys()))
src = lambda e: e.get('source', e.get('from', e.get('s'))); dst = lambda e: e.get('target', e.get('to', e.get('t')))
for c in ('ctl-HQ2', 'ctl-HQ3', 'ctl-HQ4'):
    es = [e for e in E if src(e) == c or dst(e) == c]
    print(c, len(es), collections.Counter(e['type'] for e in es), sorted({dst(e) if src(e) == c else src(e) for e in es})[:20])
mo = [n['id'] for n in g['nodes'] if n['id'].startswith('map-open-')]
print(len(mo), mo[-2:], N[mo[-1]]['name'][:100], '| status', N[mo[-1]].get('status'), '| roles', N[mo[-1]].get('roles'), '| live', N[mo[-1]].get('live'))
print('counts', {k: v for k, v in g.get('meta', g.get('counts', {})).items() if not isinstance(v, (list, dict))} if isinstance(g.get('meta', g.get('counts')), dict) else '')
