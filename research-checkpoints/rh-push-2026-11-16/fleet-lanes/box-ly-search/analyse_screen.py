import json, sys, collections
rows = collections.defaultdict(dict)
for l in open(sys.argv[1]):
    try: r = json.loads(l)
    except ValueError: continue
    t, res = r['task'], r['res']
    k = (t['scheme'], str(t.get('Y')), t.get('weight'), t['input'])
    fb = res.get('first_bad')
    rows[k][t['size']] = ('E' if 'error' in res else ('-' if fb is None else '%g' % fb[0]), res.get('n_bad'), res.get('n_suspect'))
sel = sys.argv[2] if len(sys.argv) > 2 else None
for k in sorted(rows):
    if sel and sel not in ' '.join(k): continue
    d = rows[k]
    clean = [N for N in sorted(d) if d[N][0] == '-']
    firstfail = next((N for N in sorted(d) if d[N][0] != '-'), None)
    print('%-28s clean N: %s | first failing N=%s | first_bad by N: %s' % (' '.join(k), clean if len(clean) < 12 else str(clean[:5]) + '..' + str(clean[-5:]) + ' (%d of %d)' % (len(clean), len(d)), firstfail,
          ' '.join('%d:%s' % (N, d[N][0]) for N in sorted(d) if d[N][0] != '-')[:150]))
