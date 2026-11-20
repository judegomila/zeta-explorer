import json, sys, math, glob
rows = []
for f in sys.argv[1:]: rows += json.load(open(f))
order = ['Z0', 'Z7', 'Z8', 'Z9', 'Z10', 'Z11', 'Z12', 'CHI', 'CHIBAR', 'DH', 'HEATa', 'HEATb', 'HEATc']
rows.sort(key=lambda r: order.index(r['name']) if r['name'] in order else 99)
def K(r, kind, par): return next(e for e in r['kernels'] if e['kind'] == kind and abs(e['par'] - par) < 1e-6)
print('## certificate c = 2 - R_lam  (meas +- se | BK prediction | sine value)')
for r in rows:
    s = '%-7s L=%.2f n=%.3g: ' % (r['name'], r['L_mean'], r['n_zeros'])
    for l in (1.0, 1.04, 1.26, 1.7, 2.0, 3.0):
        e = K(r, 'tri', l); s += ' lam=%.2f: %.5f+-%.5f | %.5f | %.5f ;' % (l, 2 - e['full'], e['full_se'], 2 - e['gue_full'] - e.get('arith', 0), 2 - e['gue_full'])
    print(s)
print('## (meas - BK)/se for tri kernels, and residual meas - BK')
for r in rows:
    print('%-7s' % r['name'], ' '.join('%.2f:%+.1f(%+.1e)' % (e['par'], (e['full'] - e['gue_full'] - e['arith']) / e['full_se'], e['full'] - e['gue_full'] - e['arith']) for e in r['kernels'] if e['kind'] == 'tri'))
print('## Fejer^2 linear statistic variance (connected): meas | GUE | BK | residual vs BK | residual vs GUE+diag only | se')
for r in rows:
    print('%-7s' % r['name'], ' ; '.join('W=%.2f: %.5f | %.5f | %.5f | %+.1e | %+.1e | %.1e' % (e['par'], e['conn'], e['gue_conn'], e['gue_conn'] + e['arith'], e['conn'] - e['gue_conn'] - e['arith'], e['conn'] - e['gue_conn'] - e['arith_diag'], e['conn_se']) for e in r['kernels'] if e['kind'] == 'fej'))
print('## band tents (half width 1/6): meas | BK | (meas-BK)/se')
for r in rows:
    print('%-7s' % r['name'], ' ; '.join('c=%.2f: %.5f | %.5f | %+.1f' % (e['par'], e['conn'], e['gue_conn'] + e['arith'], (e['conn'] - e['gue_conn'] - e['arith']) / e['conn_se']) for e in r['kernels'] if e['kind'] == 'tent'))
print('## Poisson-kernel tail int_{|a|>W} exp(-4 pi |a|) F: meas / (F=min(|a|,1) value), se relative')
for r in rows:
    print('%-7s' % r['name'], ' ; '.join('W=%.2f: %.3e ratio %.4f +- %.4f' % (p['W'], p['meas'], p['meas'] / p['gue'], p['se'] / p['gue']) for p in r['pois']))
print('## Landau sums per zero: x: meas +- se | -Lambda(x)/(L sqrt x)')
for r in rows:
    if 'landau' in r:
        L = r['L_mean']
        def lam(x):
            x = int(x)
            return {2: math.log(2), 3: math.log(3), 1000003: math.log(1000003), 999983: math.log(999983)}.get(x, 0.0)
        print('%-7s' % r['name'], ' ; '.join('x=%s: %+.2e +- %.1e | %+.2e' % (x, v['re'], v['se'], -lam(x) / (v['L'] * math.sqrt(int(x)))) for x, v in r['landau'].items()))
