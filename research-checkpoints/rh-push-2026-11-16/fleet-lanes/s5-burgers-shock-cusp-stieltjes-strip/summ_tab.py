import json
d = json.load(open('out/c4_tables.json'))
for k, v in d.items():
    for Y, w in v['widths'].items():
        if 'all_x' not in w: continue
        a = w['all_x']; f = w.get('far_from_offline'); o = w.get('mass_of_real_zeros_at_offline_pairs'); fs = w.get('full_set')
        print(k, Y, 'all: mean %.3f min %.3f q01 %.3f' % (a['mean_ratio'], a['min_ratio'], a['q0p01_ratio']),
              ('| far(%.2f of grid): mean %.3f min %.3f q01 %.3f' % (f['frac_of_grid'], f['mean_ratio'], f['min_ratio'], f['q0p01_ratio'])) if f else '',
              ('| at offline: mean %.3f min %.3f max %.3f, >=p_req %.3f' % (o['mean_ratio'], o['min_ratio'], o['max_ratio'], o['frac_at_or_above_preq'])) if o else '',
              ('| full: mean %.3f min %.2f neg %.4f neg-far %.2g b>delta %d' % (fs['mean_ratio'], fs['min'], fs['frac_negative'], fs['frac_negative_far'], fs['offline_with_b_above_delta'])) if fs else '',
              '| palm %.3f' % w['palm_pair_excluded_at_real_pairs']['mean_ratio'])
