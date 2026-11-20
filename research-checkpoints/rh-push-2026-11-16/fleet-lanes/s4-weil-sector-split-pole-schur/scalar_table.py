import json, sys
for f in sys.argv[1:]:
    d = json.load(open(f))
    print('## %s  (mesh h = %g, Wmax = %.4f, GPU %s)\n' % (f, d['h'], d['Wmax'], d['gpu']))
    if d['first']:
        print('| object | variant | first W with lambda_min(q_W) < 0 | first W with pencil > 1 (mu = 1e-2) | pencil max there (mu = 1e-2, 1e-4, 1e-6) | lambda_min(q) there | a_0 | dyadic block of n with the largest share of V |')
        print('|---|---|---|---|---|---|---|---|')
        for k, v in d['first'].items():
            nm, var = k.split('|')
            row = [r for r in d['rows'] if r['obj'] == nm and r['variant'] == var and v['exceed'] is not None and abs(r['W'] - v['exceed']) < 1e-9]
            if row:
                r = row[0]; p = r['pencil']; b = r.get('blocks', {}).get('0.01', {})
                print('| %s | %s | %s | %.3f | %.4f, %.4f, %.4f | %.4f | %.4f | %s (%.3f of %.3f) |' % (nm, var, ('%.3f' % v['weil_negative']) if v['weil_negative'] else 'none', v['exceed'], p['0.01'], p['0.0001'], p['1e-06'], r['lam_min_q'], r['a0'], b.get('top_block'), b.get('top_value', float('nan')), b.get('V_primes', float('nan'))))
            else:
                print('| %s | %s | %s | none up to Wmax | | | | |' % (nm, var, ('%.3f' % v['weil_negative']) if v['weil_negative'] else 'none'))
        print()
    print('| object | variant | W | e^W | m | lambda_min(q_W) | pencil max mu = 1e-2 | 1e-4 | 1e-6 |')
    print('|---|---|---|---|---|---|---|---|---|')
    import math
    for r in d['rows']:
        if r['obj'] in ('ZETA', 'CHI-3', 'CHI5') and (r['variant'] == 'own' or r['obj'] == 'ZETA'):
            p = r['pencil']
            print('| %s | %s | %.4f | %.3g | %d | %.3e | %.5f | %.5f | %.5f |' % (r['obj'], r['variant'], r['W'], math.exp(r['W']), r['m'], r['lam_min_q'], p['0.01'], p['0.0001'], p['1e-06']))
    print()
