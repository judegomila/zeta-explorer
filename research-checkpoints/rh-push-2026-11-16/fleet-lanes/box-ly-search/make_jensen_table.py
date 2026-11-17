import json, glob, collections
R = collections.defaultdict(dict)
for fn in ['results/box/jensen_box.jsonl'] + glob.glob('results/box/apx_*.jsonl'):
    try: f = open(fn)
    except OSError: continue
    for l in f:
        try: r = json.loads(l)
        except ValueError: continue
        t = r['task']; res = r.get('result') or {}
        if t.get('scheme') != 'jensen': continue
        R[(t['input'], t['shift'])][t['size']] = res.get('verdict') or r['status']
print('| input | shift n | certified PASS (Sturm) degrees | first certified FAIL degree | other |')
print('|---|---|---|---|---|')
for k in sorted(R):
    d = R[k]
    P = [x for x in sorted(d) if d[x] == 'PASS']; F = [x for x in sorted(d) if d[x] == 'FAIL']
    O = sorted(set(v for v in d.values() if v not in ('PASS', 'FAIL')))
    print('| %s | %d | %s | %s | %s |' % (k[0], k[1], (', '.join(map(str, P)) or '-'), (F[0] if F else '-'), ', '.join(O)))
print()
print('| input | degrees d scanned | shifts n scanned per d | degrees with a certified FAIL: d (failing shifts) | certified PASS for all scanned n: d range |')
print('|---|---|---|---|---|')
for fn in sorted(glob.glob('results/box/jmap_*.jsonl')):
    rows = sorted((json.loads(l) for l in open(fn)), key=lambda r: r['d'])
    if not rows: continue
    fl = ['%d (n=%s)' % (r['d'], ','.join(str(x[0]) for x in r['fails'])) for r in rows if r['n_fails']]
    ap = [r['d'] for r in rows if r['all_pass']]
    un = [r['d'] for r in rows if r['unresolved']]
    print('| %s | %d..%d (%d values) | 0..%d | %s | %s%s |' % (rows[0]['input'], rows[0]['d'], rows[-1]['d'], len(rows), max(r['scanned_to'] for r in rows),
          ('; '.join(fl[:6]) + (' ... ' + fl[-1] if len(fl) > 6 else '')) or 'none', ('%d..%d (%d values)' % (ap[0], ap[-1], len(ap)) if ap else '-'),
          (' ; unresolved at d=%s' % un[:5] if un else '')))
