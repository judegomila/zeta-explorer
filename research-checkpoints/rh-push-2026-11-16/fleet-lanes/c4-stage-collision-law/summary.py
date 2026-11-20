# markdown summary tables from out_*.json, longscan.json, wiggle_*.json (text processing only)
import json, math, os
keys = ['8e3', '1e5', '1e6', '1e7', '1e8', '1e9']
O = {k: json.load(open('out_%s_h.json' % k if os.path.exists('out_%s_h.json' % k) else 'out_%s.json' % k)) for k in keys}
DH = json.load(open('out_dh.json'))   # the _h runs repeat the same five columns and add X = T^0.75
XN = ['log2', 'a0.05', 'a0.1', 'a0.25', 'a0.5']
def f(v, n=3): return '-' if v is None else ('%.*g' % (n, v))
print('### Table A. Stage on the line: stationary points of Phi, on-line and off-line stage zeros (2000-zero windows)\n')
print('| family | X | T | primes | logX/logT | stationary pts | frac(Phi\'<0) | arb-certified negative minima | on-line stage zeros / true zeros | off-line stage zeros, 0.03 <= delta logT <= 4 (interval-Newton certified) | min delta logT |')
print('|---|---|---|---|---|---|---|---|---|---|---|')
for fam in ['zeta', 'U']:
    for xn in XN:
        for k in keys:
            o = O[k]; co = o['fam'][fam][xn]
            print('| %s | %s | %s | %d | %.3f | %d | %s | %s | %d/%d | %s (%s) | %s |' % (fam, xn, k, co['nprimes'], math.log(co['X']) / o['logT'], co['a_stationary_points'], f(co['a_frac_phi_prime_neg']),
                  ('%s/%s' % (co.get('a_arb_negative_minima_certified'), co.get('a_arb_negative_minima_checked'))) if 'a_arb_negative_minima_checked' in co else '-',
                  co['a_online_stage_zeros'], co['true_online_zeros_in_window'], co.get('a_offline_stage_zeros_found'), co.get('a_offline_arb_certified', 'float'), f(co.get('a_offline_min_delta_logT'))))
for xn in XN:
    co = DH['fam']['DH'][xn]
    print('| DH | %s | 8.3e3 | %d | %.3f | %d | %s | - | %d/%d | %s (float) | %s |' % (xn, co['nprimes'], math.log(co['X']) / DH['logT'], co['a_stationary_points'], f(co['a_frac_phi_prime_neg']), co['a_online_stage_zeros'], co['true_online_zeros_in_window'], co.get('a_offline_stage_zeros_found'), f(co.get('a_offline_min_delta_logT'))))
print('\n### Table B. Stage zeros against zeta zeros (defect in mean spacings; zeta zero n paired with stage level n-2) and the sign law at stage anti-points\n')
print('| family | X | T | rms defect | max defect | frac > 1/4 | frac > 1/2 | levels crossed more than once | anti-points | frac with wrong zero count | longest exact run |')
print('|---|---|---|---|---|---|---|---|---|---|---|')
for fam in ['zeta', 'L', 'U']:
    for xn in XN:
        for k in keys:
            co = O[k]['fam'][fam][xn]; b = co['b_level_defect']
            print('| %s | %s | %s | %s | %s | %s | %s | %d | %d | %s | %d |' % (fam, xn, k, f(b['rms']), f(b['max']), f(b['frac_gt_quarter']), f(b['frac_gt_half']), b['levels_multi'], co['b_antipoint_n'], f(co['b_antipoint_frac_count_error_nonzero']), co['b_longest_run_exact_antipoints']))
print('\nDH (nearest-neighbour defect of true on-line zeros to stage on-line zeros, mean spacings): ' + '; '.join('%s rms %s max %s' % (xn, f(DH['fam']['DH'][xn]['b_nn_defect_rms']), f(DH['fam']['DH'][xn]['b_nn_defect_max'])) for xn in XN))
print('zeta at 8e3, same statistic: ' + '; '.join('%s rms %s max %s' % (xn, f(O['8e3']['fam']['zeta'][xn]['b_nn_defect_rms']), f(O['8e3']['fam']['zeta'][xn]['b_nn_defect_max'])) for xn in XN))
print('\n### Table C. Rouche ratio r = |F - F_X|/|F_X| on Re s = 1/2 + c/logT, 16 points per mean spacing\n')
print('Entry: fraction of sampled points with r < 1 / fraction of 16-spacing sub-windows with r < 1 at every sampled point / W if the whole 2000-zero window holds. zeta rows: every point decided by arb balls (no undecided point in any row).\n')
print('| family | X | c | 8e3 | 1e5 | 1e6 | 1e7 | 1e8 | 1e9 |')
print('|---|---|---|---|---|---|---|---|---|')
def cell(e): return '%.4f / %.3f%s' % (e['frac_points_lt1'], e['winfrac']['16'], ' / W' if e['whole_window_holds'] else '')
und = 0
for fam in ['zeta', 'L', 'U']:
    for xn in ['log2', 'a0.1', 'a0.25', 'a0.5']:
        for c in ['0.5', '1.0', '2.0', '4.0', '8.0']:
            print('| %s | %s | %s | ' % (fam, xn, c) + ' | '.join(cell(O[k]['fam'][fam][xn]['c'][c]) for k in keys) + ' |')
            if fam == 'zeta': und += sum(O[k]['fam'][fam][xn]['c'][c]['arb_undecided'] for k in keys)
print('\nzeta rows, total undecided arb points over the rows shown:', und)
print('\n| DH (height 8.3e3 to 9.9e3) | c=0.5 | c=1 | c=2 | c=4 | c=8 |\n|---|---|---|---|---|---|')
for xn in ['log2', 'a0.1', 'a0.25', 'a0.5']:
    print('| %s | ' % xn + ' | '.join(cell(DH['fam']['DH'][xn]['c'][c]) for c in ['0.5', '1.0', '2.0', '4.0', '8.0']) + ' |')
print('\n### Table D. Are failing 4-spacing blocks predicted by the prime-only event (Phi\' < 0 somewhere in the block)? zeta family\n')
print('Counts of 4-spacing blocks [fail and event, fail without event, event without fail, neither].\n')
print('| X | c | 1e5 | 1e7 | 1e9 |\n|---|---|---|---|---|')
for xn in ['log2', 'a0.25', 'a0.5']:
    for c in ['0.5', '1.0', '2.0', '4.0']:
        print('| %s | %s | ' % (xn, c) + ' | '.join(str(O[k]['fam']['zeta'][xn]['c'][c]['pred_fail_vs_phi_neg_blocks4']) for k in ['1e5', '1e7', '1e9']) + ' |')
    print('| %s | anti-point count error | ' % xn + ' | '.join(str(O[k]['fam']['zeta'][xn]['pred_gram_fail_vs_phi_neg_blocks4']) for k in ['1e5', '1e7', '1e9']) + ' |')
print('\n### Table E. Prime-only event Phi\'_X(t) < 0: measured fraction of t against the torus model and the Gaussian tail\n')
print('| T | a | primes | theta\'/sigma_X | zeta, t in [T, T+1e6] | torus (independent phases) | Gaussian Q | samples |\n|---|---|---|---|---|---|---|---|')
for r in json.load(open('longscan.json')):
    print('| %g | %g | %d | %.3f | %.3g | %.3g | %.3g | %d |' % (r['T'], r['a'], r['nprimes'], r['u'], r['frac_zeta'], r['frac_torus'], r['gauss_Q'], r['n']))
print('\n### Table F. Where the intervals Phi\' < 0 sit\n')
print('| T | family | X | intervals | median abs cos Phi at the minimum of Phi\' | frac with abs cos Phi > 0.9 | min abs cos Phi | max drop of Phi / pi | median containing zeta gap (mean spacings) |\n|---|---|---|---|---|---|---|---|---|')
for k in ['1e6', '1e8']:
    if not os.path.exists('wiggle_%s.json' % k): continue
    w = json.load(open('wiggle_%s.json' % k))
    for name, st in w.items():
        if isinstance(st, dict) and st.get('n'):
            print('| %s | %s | %s | %d | %s | %s | %s | %s | %s |' % (k, name.split('_')[0], name.split('_')[1], st['n'], f(st['abscos_median']), f(st['frac_abscos_gt_0.9']), f(st['abscos_min']), f(st['drop_over_pi_max']), f(st.get('gap_median'))))
for k in ['1e5', '1e6', '1e7']:
    if not os.path.exists('out_%s_h.json' % k): continue
    o = json.load(open('out_%s_h.json' % k))
    if k == '1e5': print('\n### Table G. X = T^0.75 (float64 screen, line statistics only)\n\n| family | T | primes | stationary pts | frac(Phi\'<0) | on-line stage zeros / true | rms defect | max defect | frac > 1/2 | levels crossed more than once | frac anti-points with wrong count |\n|---|---|---|---|---|---|---|---|---|---|---|')
    for fam in ['zeta', 'U']:
        co = o['fam'][fam]['a0.75']; b = co['b_level_defect']
        print('| %s | %s | %d | %d | %s | %d/%d | %s | %s | %s | %d | %s |' % (fam, k, co['nprimes'], co['a_stationary_points'], f(co['a_frac_phi_prime_neg']), co['a_online_stage_zeros'], co['true_online_zeros_in_window'], f(b['rms']), f(b['max']), f(b['frac_gt_half']), b['levels_multi'], f(co['b_antipoint_frac_count_error_nonzero'])))
print('\nself-tests (float stage against arb stage, relative):', {k: f(O[k]['selftest_float_vs_arb_stage_relerr']) for k in keys}, ' DH functional equation residual:', f(DH['selftest_dh_fe_relerr']))
print('max radius of the arb values of the true function on the Rouche lines:', {k: f(max(O[k]['true_maxrad'].values())) for k in keys}, 'DH', f(max(DH['true_maxrad'].values())))
print('DH true off-line zeros in the window: %d; distance from each to the nearest off-line stage zero (mean spacings, first 60):' % DH['fam']['DH']['a0.5']['true_offline_in_window'], {xn: 'median %s max %s' % (f(sorted(d)[len(d) // 2]), f(max(d))) for xn in XN for d in [DH['fam']['DH'][xn].get('true_offline_dist_to_nearest_stage_offline_spacings')] if d})
print('DH min Phi\'/theta\' per X:', {xn: f(DH['fam']['DH'][xn]['a_min_phi_prime_over_theta_prime']) for xn in XN}, ' zeta at 8e3:', {xn: f(O['8e3']['fam']['zeta'][xn]['a_min_phi_prime_over_theta_prime']) for xn in XN})
