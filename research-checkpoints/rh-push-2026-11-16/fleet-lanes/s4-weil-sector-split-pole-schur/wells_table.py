import json, sys
rows = json.load(open(sys.argv[1]))
objs = []
for r in rows:
    if r['obj'] not in objs: objs.append(r['obj'])
def fmt(x): return 'n/a' if x is None else ('%.3g' % x)
print('| object | first 2a with crude margin < 0 (even / odd) | first 2a with exact margin < 0 or P not positive (even / odd) | mu at 2a = 1.0, 2.2 (even) | N_max, P_min at 2a = 1.0 (even) | wells (count, length) at 2a = 2.2 |')
print('|---|---|---|---|---|---|')
for o in objs:
    rs = sorted([r for r in rows if r['obj'] == o], key=lambda r: r['twoa'])
    def first(pn, key, cond):
        for r in rs:
            if cond(r[pn][key]): return '%.1f' % r['twoa']
        return '> 2.2'
    c = ' / '.join(first(pn, 'crude', lambda x: x < 0) for pn in ('even', 'odd'))
    m = ' / '.join(first(pn, 'W_min', lambda x: x < -1e-9) for pn in ('even', 'odd'))
    r10 = [r for r in rs if abs(r['twoa'] - 1.0) < 1e-9][0]; r22 = rs[-1]
    print('| %s | %s | %s | %.3f, %.3f | %s, %s | %d, %.1f |' % (o, c, m, r10['even']['mu'], r22['even']['mu'], fmt(r10['even']['N_max']), fmt(r10['even']['P_min']), r22['n_wells'], r22['wells_length']))
print()
print('crude margin P_min - N_max by support (min over the two sectors):')
print('| object | ' + ' | '.join('%.1f' % r['twoa'] for r in sorted([r for r in rows if r['obj'] == objs[0]], key=lambda r: r['twoa'])) + ' |')
print('|---|' + '---|' * 18)
for o in objs:
    rs = sorted([r for r in rows if r['obj'] == o], key=lambda r: r['twoa'])
    print('| %s | ' % o + ' | '.join('%.2g' % min(r['even']['crude'], r['odd']['crude']) for r in rs) + ' |')
print()
print('exact margin 1 - R (min over sectors; n/a where P is not positive definite; float64, resolution about 1e-10):')
print('|---|' + '---|' * 18)
for o in objs:
    rs = sorted([r for r in rows if r['obj'] == o], key=lambda r: r['twoa'])
    def mm(r):
        v = [r[pn]['margin'] for pn in ('even', 'odd')]
        return 'n/a' if None in v else '%.2g' % min(v)
    print('| %s | ' % o + ' | '.join(mm(r) for r in rs) + ' |')
