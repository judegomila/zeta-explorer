import json, sys
R = json.load(open(sys.argv[1])); what = sys.argv[2]; filt = sys.argv[3:] 
for r in R:
    tag = '%-11s t=%-9g X=%g' % (r['kind'], r['t'], r['X'])
    if what == 'wind':
        print(tag, ' | '.join('%s nz %.4f tot %d unrel %.4f' % (k, v['frac_nonzero'], v['total'], v['frac_step_gt_2p6']) for k, v in r['wind'].items()))
    if what == 't1':
        for k, v in r['t1'].items():
            if filt and not any(f in k for f in filt): continue
            print(tag, '%-18s cert %.5f far(n=%d) %s  margin q0/1/50/99/100 %s  panels %s  %s' % (k, v['frac_certified'], v['n_far'], ('%.5f' % v['frac_certified_far']) if v['frac_certified_far'] is not None else '-',
                  ' '.join('%.3g' % x for x in v['margin_q']), ' '.join('%.3g' % x for x in v.get('panels_per_unit_x_q', [])),
                  ('refwind %.4f consistent %s' % (v['ref_frac_nonzero_wind'], v['rouche_consistent'])) if 'rouche_consistent' in v else ''))
    if what == 't2' and 't2' in r:
        for k, v in r['t2'].items():
            if filt and not any(f in k for f in filt): continue
            print(tag, '%-16s cert %.5f ptw %.5f far %s (n=%d) residual 1/50/99 %s floor %s' % (k, v['frac_certified'], v['frac_pointwise'], ('%.5f' % v['frac_certified_far_from_zero_boxes']) if v['frac_certified_far_from_zero_boxes'] is not None else '-', v['n_far'],
                  ' '.join('%.3g' % x for x in v['residual_q']), ' '.join('%.3g' % x for x in v['floor_q'])))
    if what == 't3':
        for k, v in r['t3'].items():
            if filt and not any(f in k for f in filt): continue
            if isinstance(v, dict) and 'frac_hold' in v:
                print(tag, '%-10s hold(B0) %.5f sup50/99/100 %s' % (k, v['frac_hold'], ' '.join('%.3g' % x for x in v['sup_q'])),
                      ('hold(B) %.5f AD %s minD %s' % (v['frac_hold_B'], ' '.join('%.3g' % x for x in v['AD_q']), ' '.join('%.3g' % x for x in v['minD_q']))) if 'frac_hold_B' in v else '')
            else: print(tag, k, v)
