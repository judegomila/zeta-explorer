import json, glob, os, sys
d = sys.argv[1] if len(sys.argv) > 1 else 'out_server'
for f in sorted(glob.glob(d + '/c1_static_*.json')):
    r = json.load(open(f)); nm = r['name']
    print('==', nm, 'zeros', r['n'], 'heights %.4g..%.6g' % tuple(r['height']), 'frac pairs Theta>1/4: %.3f' % r['frac_pairs_Theta_gt']['0.25'], 'neg', r['n_negative_Theta'])
    gm = r['global_min_pair']; print('   min pair s=%.5f Theta=%.2e ; Theta/s^2 small gaps median %s' % (gm['s'], gm['Theta'], r['Theta_over_s2_small_gaps']['median']))
    print('   Nstar(1/4):', {k: v for k, v in (r['Nstar_0.25'] or {}).items() if k in ('Nstar', 'at', 's', 'Theta_window', 's_left', 's_right')}, ' Nstar(0.443):', (r['Nstar_0.443'] or {}).get('Nstar'))
    print('   close pairs s<0.2: %d ; with Theta>1: %d' % (r['n_close_pairs_s_lt_0.2'], len(r['close_pairs_Theta_gt_1'])))
    for w in r['windows']:
        if w['N'] in (10, 30, 100, 200, 300, 500, 1000, 2000, 10000, 1000000):
            print('   N=%-8d windows %-10d fail(K-bound) 1/4: %-9d 0.443: %-8d exact 1/4: %s 0.443: %s  maxTheta(K) %.4g med %.3g' % (w['N'], w['windows'], w['fail_0.25'], w['fail_0.443'], w.get('exact_fail_0.25', w.get('exact', '-')), w.get('exact_fail_0.443', '-'), w['maxTheta'], w['medTheta']))
for f in sorted(glob.glob(d + '/c1_winexact_*.json')):
    print('==', f); [print('  ', {k: (round(v, 4) if isinstance(v, float) else v) for k, v in r.items()}) for r in json.load(open(f))]
for f in sorted(glob.glob(d + '/c1_flow_*.json')):
    r = json.load(open(f)); print('== flow', os.path.basename(f), {k: r[k] for k in ('N', 'inner', 'height', 'g0', 'Theta0', 'Theta_max', 'tc', 'tc_over_g2_8', 'A1_holds', 'steps', 'switched')}, 'longdouble', r['longdouble_local']['tc'], r['longdouble_local']['rel_diff'])
