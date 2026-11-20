import json, sys
R = json.load(open(sys.argv[1]))
print(R['meta'])
names = ['zeta:theta', 'zeta:psi', 'chi4:theta', 'chi4:psi', 'chi3:psi', 'chi5real:psi', 'chi5q_re:psi', 'eps:theta', 'eps:psi', 'thin:theta', 'del:theta', 'TNR_q3_c2.2:psi', 'TNR_q3_c2.02:psi', 'TNR_q1000003_c2.2:psi', 'EA:psi', 'U_re:psi', 'U_im:psi']
for T in ('T88', 'T91', 'T92_m61', 'T92_m62', 'T93'):
    d = R[T]['_def']; print('\n', T, 'bias %.6g floor %.6g' % (d['bias_coeff'], d['rh_floor_abs_amplitude']))
    for nm in names:
        if nm in R[T]:
            e = R[T][nm]; b = d['bias_coeff']
            print('  %-24s firstneg %-10s lastneg %-13s nneg %5d/%5d  min/max(N>=1e3) %10.4f %10.4f | per decade min/max (units of bias): %s' % (nm, e['first_negative_N'], e['last_negative_N'], e['n_negative'], e['n'], e['min_m_N_ge_1000'] / b, e['max_m_N_ge_1000'] / b,
                  ' '.join('%d:[%.3g,%.3g]' % (x['decade'], x['min'] / b, x['max'] / b) for x in e['decades'][2:])))
print('\nT88 dyadic zeta:theta', [(int.bit_length(a) - 1, round(m, 4)) for a, m in R['T88']['zeta:theta']['dyadic']])
print('\nPascal')
for nm, e in R['Pascal'].items():
    print('  %-24s firstneg %s lastneg %s nneg %d/%d' % (nm, e['first_negative_N'], e['last_negative_N'], e['n_negative'], e['n']), ' '.join('%d:[%.4g,%.4g]' % (x['decade'], x['min'], x['max']) for x in e['decades']))
print('  pow3', R['Pascal']['zeta:theta']['pow3']); print('  pow10', R['Pascal']['zeta:theta']['pow10'])
print('\nRobin', R['Robin']['n'], R['Robin']['n_negative'], R['Robin']['last']); [print('  ', d) for d in R['Robin']['decades']]
print('\nTriangular')
for nm in names:
    if nm in R['Triangular']:
        e = R['Triangular'][nm]
        print('  %-24s bestC1 %.4g at x=%.4g ; two-sided C %.4g at %.4g ; per decade two-sided-run/maxR32/minR32: %s' % (nm, e['bestC_one_sided'], e['argmax_x'], e['bestC_two_sided'], e['argmax_two_sided_x'],
              ' '.join('%d:[%.3g|%.3g|%.3g]' % (x['decade'], max(abs(x['max_R_over_x158']), abs(x['min_R_over_x158'])), x['max_R_over_x32'], x['min_R_over_x32']) for x in e['decades'][2:])))
print(R['Triangular']['zeta:psi']['centred_residual']); print({k: v for k, v in R['Triangular']['zeta:theta'].items() if k != 'decades'})
