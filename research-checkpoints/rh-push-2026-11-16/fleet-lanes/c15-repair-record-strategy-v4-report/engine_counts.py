import json, sys, collections
E_, out = sys.argv[1], sys.argv[2]
g = json.load(open(E_ + '/IDEA_GRAPH.json')); c = json.load(open(E_ + '/CANDIDATES.json'))
d = json.load(open(E_ + '/curated/devices.json')); o = json.load(open(E_ + '/outcomes.json'))
nodes = g['nodes']; edges = g['edges']
res = dict(nodes=len(nodes), edges=len(edges), meta=g.get('meta', {}).get('counts', g.get('meta', {})),
           edgesByType=dict(collections.Counter(e.get('type') for e in edges)),
           nodesByType=dict(collections.Counter(n.get('type') for n in nodes)),
           deviceTypes=dict(collections.Counter(x['state'] for x in d['devices'])), pending=len(d['pending']),
           candMeta={k: v for k, v in c.items() if not isinstance(v, list)} if isinstance(c, dict) else None,
           top=[(x.get('rank'), x.get('score'), x.get('nodes') or x.get('ids')) for x in (c.get('candidates') or c.get('top') or [])[:60]] if isinstance(c, dict) else None,
           outcomes=len(o) if isinstance(o, list) else {k: (len(v) if hasattr(v, '__len__') else v) for k, v in o.items()})
json.dump(res, open(out, 'w'), indent=1, default=str)
print(json.dumps({k: res[k] for k in ('nodes', 'edges', 'deviceTypes', 'pending', 'candMeta', 'outcomes')}, default=str)[:1500])
