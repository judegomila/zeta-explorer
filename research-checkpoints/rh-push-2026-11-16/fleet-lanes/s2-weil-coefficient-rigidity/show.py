import json, sys
D = json.load(open(sys.argv[1])); R = D['results']
keys = sys.argv[2:] or list(R)
def f(x): return 'None' if x is None else '%.3e' % x
for ak in keys:
    r = R[ak]
    print('==== %s  2a = %.4f  rungs n = %s  N = %d' % (ak, r['twoa'], r['ns'], r['N']))
    for nm, o in r['objects'].items():
        line = '%-24s' % nm
        for var in ('full', 'pf'):
            if var + '_k0' not in o: continue
            vals = []
            for k in range(4):
                rec = o['%s_k%d' % (var, k)]
                v = rec['lam'] if 'lam' in rec else min(rec['even'], rec['odd'])
                vals.append(f(v))
            line += ' %s[k0..3]: %s |' % (var, ' '.join(vals))
        print(line)
    print('cramer', json.dumps(r['cramer']))
    for var, A in r['admissible'].items():
        print(' admissible', var, 'base', A['base'])
        for dn, e in A['dirs'].items():
            print('   %-18s  minus: %s (lin %s)   plus: %s (lin %s)' % (dn, f(e['-']['edge']), f(e['-'].get('linear')), f(e['+']['edge']), f(e['+'].get('linear'))))
    print(' combo2 scan (x = c(2)/log 2): full_even lam, P2, ratio')
    for row in r['combo2_scan']:
        p2 = row['full_even_P2']
        print('   x=%9.5f  full_even %s  P2 %s  lam/P2 %s | full_odd %s | pf_even %s pf_odd %s' % (row['x_over_log2'], f(row['full_even']), f(p2), f(row['full_even'] / p2) if p2 else '-', f(row['full_odd']), f(row['pf_even']), f(row['pf_odd'])))
