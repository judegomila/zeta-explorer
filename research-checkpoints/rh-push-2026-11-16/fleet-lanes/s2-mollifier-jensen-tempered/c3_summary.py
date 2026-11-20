"""Summary of c3 result JSON. Usage: c3_summary.py c3_result_*.json"""
import sys, json
r = json.load(open(sys.argv[1]))
ts = sorted({k.split('|')[0] for k in r}, key=float, reverse=True); ys = sorted({k.split('|')[1] for k in r}, key=float)
fs = ['ZETA', 'LCHI', 'DH', 'LIOU', 'SGN', 'U', 'TNR', 'EA']
any_e = next(iter(r.values())); cnt = next(iter(any_e.values()))['cnt']; nwin = len(next(iter(any_e.values()))['perN'])
print('%d windows, %d samples per (t, y, function)' % (nwin, cnt))
out = {}
for qty, lab in (('*f', 'f = A + B'), ('*A', 'A only (direct sum, no reflected term)')):
    print('\n== mollified %s: for each function the mollifier with the largest minimum real part; entries: min Re / min |.| / fraction of samples with Re <= 0' % lab)
    for y in ys:
        print('y = %s' % y)
        print('  t     | ' + ' | '.join('%-22s' % f for f in fs))
        for t in ts:
            cells = []
            for f in fs:
                e = r['%s|%s|%s' % (t, y, f)]
                opts = {k: v for k, v in e.items() if k.startswith('E_') and k.endswith(qty)}
                k = max(opts, key=lambda k: opts[k]['min_re']); v = opts[k]
                cells.append('%7.3f/%6.3f/%7.1e' % (v['min_re'], v['min_abs'], v['neg'] / v['cnt']))
                out['%s|%s|%s|%s' % (qty, t, y, f)] = {'mollifier': k, 'min_re': v['min_re'], 'min_abs': v['min_abs'], 'neg_frac': v['neg'] / v['cnt'], 'argN': v['argN']}
            print('  %-5s | ' % t + ' | '.join(cells))
print('\n== unmollified f: min Re / min |.|')
for y in ys:
    print('y = %s' % y)
    for t in ts:
        print('  %-5s | ' % t + ' | '.join('%7.3f/%6.3f        ' % (r['%s|%s|%s' % (t, y, f)]['f']['min_re'], r['%s|%s|%s' % (t, y, f)]['f']['min_abs']) for f in fs))
print('\n== DH, all mollifiers (f = A + B), min Re:')
for y in ys:
    for t in ts:
        e = r['%s|%s|DH' % (t, y)]
        print('  y %s t %-5s ' % (y, t) + '  '.join('%s %.3f' % (k, v['min_re']) for k, v in e.items() if k.endswith('*f') or k == 'f'))
print('\n== ZETA P13, per window (t = 0.13, smallest y): N, min |E f|, min Re E f')
e = r['%s|%s|ZETA' % ('0.13', ys[0])]['E_P13*f']['perN']
print('  ' + '  '.join('%d: %.4f/%.4f' % (a, b, c) for a, b, c in e))
json.dump(out, open(sys.argv[1].replace('.json', '_summary.json'), 'w'), indent=1)
