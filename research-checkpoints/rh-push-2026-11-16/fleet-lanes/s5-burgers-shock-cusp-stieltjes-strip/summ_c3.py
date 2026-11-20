import json, sys, os, glob
for d0 in ('out', 'out_server'):
    for f in sorted(glob.glob(d0 + '/c3_*.json')):
        d = json.load(open(f))
        if 'rows' not in d: continue
        print(d0, d['name'], d['n'])
        for r in d['rows']:
            if r['N'] in (1000, 10000, 100000, 1000000, 10000000, 100000000) or r is d['rows'][-1]:
                print('   N %-9d Minf*y %.4f t_proxy %.4g tc %.4g (closest pair first: %s, g2/8 %.4g) R_A %.4g R_A*N^1.5 %.4g' % (r['N'], r['Minf_over_atom'], r['t_proxy'], r['tc'], r['first_pair_is_closest'], r['gmin2_over_8'], r['R_A'], r['R_A'] * r['N'] ** 1.5)
                      + ('  Smax %.3f S(N) %.2f D %.4g C_W %.4g' % (r['Smax'], r['S_at_N'], r['D'], r['C_W']) if 'D' in r else ''))
        print('   fits:', {k: [round(v[0], 3), float('%.3g' % v[1])] for k, v in d['fits'].items() if k != 'R_A_times_N32'})
        print('   Minf*y range: %.3f..%.3f ; first collision is the closest pair in %d of %d rungs' % (min(r['Minf_over_atom'] for r in d['rows']), max(r['Minf_over_atom'] for r in d['rows']), sum(r['first_pair_is_closest'] for r in d['rows']), len(d['rows'])))
