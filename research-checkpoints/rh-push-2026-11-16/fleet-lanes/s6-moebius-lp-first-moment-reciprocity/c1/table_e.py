import json, sys, glob, math, collections
rows = collections.OrderedDict()
for f in sys.argv[1:]:
    for l in open(f):
        if not l.startswith('{'): continue
        r = json.loads(l)
        if 'name' not in r: continue
        kw = ','.join(f"{k}={v}" for k, v in r['kw'].items() if k not in ('q', 'c'))
        key = (r['name'] + (' ' + kw if kw else ''), r['k'], round(r['D'] / math.sqrt(r['X']), 1))
        g = r.get('gap_over_sqrtX')
        st = {0: ('%.1e' % g) if g is not None else '?', 2: 'infeasible', 3: 'unbounded', 4: 'solver failure'}.get(r['status'], str(r['status']))
        rows.setdefault(key, {})[r['X']] = st + ('' if r['status'] else (' [sv %d]' % r['neg_count'] if r['neg_count'] else ''))
for (name, k, df), d in rows.items():
    print(f"{name:22s} k={k} D/sqrtX={df:<5} " + '  '.join(f"{X:.0e}: {v}" for X, v in sorted(d.items())))
