# compact tables from out_*.json (text only; no numerics)
import json, sys, glob
def g(v, n=3):
    return ('%.*g' % (n, v)) if isinstance(v, float) else str(v)
for fn in sys.argv[1:]:
    o = json.load(open(fn)); LT = o['logT']
    print('\n#### %s  T0=%s  logT=%.3f  spacing=%.4f  window=[%.2f, %.2f]  sec=%.0f  selftest=%s' % (o['key'], o['T0'], LT, o['spacing'], o['tA'], o['tB'], o['sec'], g(o.get('selftest_float_vs_arb_stage_relerr', o.get('selftest_dh_fe_relerr')))))
    print('true-function max ball radius per line:', {k: g(v) for k, v in o['true_maxrad'].items()})
    for fam, fo in o['fam'].items():
        print('\n== family', fam)
        print('X-name | X | primes | a=logX/logT | stat.pts | frac phi\'<0 | min phi\'/theta\' | arb neg minima cert/checked | on-line stage zeros / true | off-line found (arb cert) | min delta logT | max dist to stat.pt')
        for xn, co in fo.items():
            import math
            a = math.log(co['X']) / LT
            print(' | '.join([xn, g(co['X'], 5), str(co['nprimes']), g(a), str(co['a_stationary_points']), g(co['a_frac_phi_prime_neg']), g(co['a_min_phi_prime_over_theta_prime']),
                  '%s/%s' % (co.get('a_arb_negative_minima_certified', '-'), co.get('a_arb_negative_minima_checked', '-')),
                  '%d/%d' % (co['a_online_stage_zeros'], co['true_online_zeros_in_window']),
                  '%s (%s) cells %s net %s' % (co.get('a_offline_stage_zeros_found', '-'), co.get('a_offline_arb_certified', '-'), co.get('a_offline_cells_nonzero_winding', '-'), co.get('a_offline_net_winding', '-')),
                  g(co.get('a_offline_min_delta_logT', '-')), g(co.get('a_offline_max_dist_to_stationary', '-')),
                  'trivial %s vs theta\' %s' % (g(co['a_trivial_bound_sum_logp_over_sqrtp_minus_1']), g(co['a_theta_prime']))]))
        print('(b) X-name | nn rms | nn max | level rms | level max | frac>1/4 | frac>1/2 | multi | antipts | frac count err | frac sign viol | max err | longest exact run | gram-fail vs phi\'<0 blocks [FE,F~E,~FE,~F~E]')
        for xn, co in fo.items():
            b = co.get('b_level_defect', {})
            print(' | '.join([xn, g(co.get('b_nn_defect_rms', '-')), g(co.get('b_nn_defect_max', '-')), g(b.get('rms', '-')), g(b.get('max', '-')), g(b.get('frac_gt_quarter', '-')), g(b.get('frac_gt_half', '-')), str(b.get('levels_multi', '-')),
                  str(co.get('b_antipoint_n', '-')), g(co.get('b_antipoint_frac_count_error_nonzero', '-')), g(co.get('b_antipoint_frac_sign_law_violated', '-')), str(co.get('b_antipoint_max_abs_count_error', '-')), str(co.get('b_longest_run_exact_antipoints', '-')), str(co.get('pred_gram_fail_vs_phi_neg_blocks4', '-')), 'off=%s' % co.get('b_best_offset', '-')]))
        print('(c) X-name | c=delta logT | frac pts <1 | arb lt/gt/undec | median | q99 | max | window frac m=1,4,16,64,256 | whole | fail-block vs phi\'<0 [FE,F~E,~FE,~F~E]')
        for xn, co in fo.items():
            for c, e in co.get('c', {}).items():
                print(' | '.join([xn, c, g(e['frac_points_lt1'], 4), '%s/%s/%s' % (e.get('arb_cert_lt1', '-'), e.get('arb_cert_gt1', '-'), e.get('arb_undecided', '-')), g(e['median_ratio']), g(e['q99']), g(e['max_ratio']),
                      ' '.join(g(e['winfrac'][m]) for m in ('1', '4', '16', '64', '256')), str(e['whole_window_holds']), str(e['pred_fail_vs_phi_neg_blocks4']),
                      'fl-arb %s mism %s' % (g(e.get('float_vs_arb_max_abs_diff_stage', '-')), e.get('float_class_mismatch', '-'))]))
        if fam == 'DH':
            for xn, co in fo.items():
                d = co.get('true_offline_dist_to_nearest_stage_offline_spacings')
                if d is not None: print('DH true off-line zeros in window %d; dist to nearest stage off-line zero (spacings): n=%d median=%s max=%s' % (co['true_offline_in_window'], len(d), g(sorted(d)[len(d)//2]) if d else '-', g(max(d)) if d else '-'), xn)
