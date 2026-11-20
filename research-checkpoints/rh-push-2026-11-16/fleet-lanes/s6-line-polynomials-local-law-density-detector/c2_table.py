import json, math, numpy as np
def fit(Lg, d, se=None):
    d = np.array(d); Lg = np.array(Lg)
    if not (np.all(d > 0) or np.all(d < 0)): return None
    w = np.ones(len(d)) if se is None else (np.abs(d) / np.array(se)) ** 2
    X = np.log(Lg); Y = np.log(np.abs(d)); mx = np.sum(w * X) / w.sum(); my = np.sum(w * Y) / w.sum()
    b = np.sum(w * (X - mx) * (Y - my)) / np.sum(w * (X - mx) ** 2)
    return -b, (math.sqrt(1 / np.sum(w * (X - mx) ** 2)) if se is not None else None), math.copysign(math.exp(my + b * (-mx)), d[0])
for f in ('out/c2_zeta.json', 'out/c2_ctrl.json'):
    try: res = json.load(open(f))
    except Exception as e: print(f, e); continue
    print('\n' + f)
    for r in res:
        if 'data' not in r:
            print('%-22s Lg %.2f  BK - GUE: ' % (r['name'], r['Lg']) + ' '.join('L=%g: %+.5f' % (L, b - g) for L, b, g in zip(r['L'], r['bk'], r['gue']))); continue
        print('%-7s n=%d Lg=%.3f' % (r['name'], r['n'], r['Lg']))
        for i, L in enumerate(r['L']):
            print('   L=%-4g data %.5f +- %.5f  GUE %.5f  BK %.5f  data-GUE %+.5f  BK-GUE %+.5f  (data-BK)/se %+.1f' % (L, r['data'][i], r['se'][i], r['gue'][i], r['bk'][i], r['data'][i] - r['gue'][i], r['bk'][i] - r['gue'][i], (r['data'][i] - r['bk'][i]) / r['se'][i]))
        if 'tnr_union' in r:
            for u in r['tnr_union']:
                if u['L'] in (1.0, 5.0, 50.0): print('   T-NR(q=1000003) union L=%g: var zeta %.4f lattice %.4f union %.4f cov %+.4f; off-line per window %.2f, on-line %.2f' % (u['L'], u['var_zeta'], u['var_lattice'], u['var_union'], u['cov'], u['offline_per_window'], u['online_per_window']))
    zs = [r for r in res if 'data' in r and r['name'].startswith('Z')]
    if len(zs) >= 3:
        print(' rate fit  delta = Sigma^2 - GUE = K Lg^-a over %d heights (weighted); data | BK prediction at the same Lg' % len(zs))
        for i, L in enumerate(zs[0]['L']):
            Lg = [r['Lg'] for r in zs]; dd = [r['data'][i] - r['gue'][i] for r in zs]; se = [r['se'][i] for r in zs]; db = [r['bk'][i] - r['gue'][i] for r in zs]
            a = fit(Lg, dd, se); b = fit(Lg, db, [s * abs(y / x) for s, x, y in zip(se, dd, db)])
            print('   L=%-4g data: %s | BK: %s' % (L, 'a = %.3f +- %.3f, K = %.4g' % a if a else 'sign change', 'a = %.3f, K = %.4g' % (b[0], b[2]) if b else 'sign change'))
