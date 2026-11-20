#!/usr/bin/env python3
"""Markdown tables from the result files. usage: mktables.py res_main.json res_extras.json res_dh.json"""
import json, sys, math
R = json.load(open(sys.argv[1])); X = json.load(open(sys.argv[2])); D = json.load(open(sys.argv[3]))
def g(x, n=3): return ('%%.%dg' % n) % x
ROWS = [('zeta, primes only (the stated inequality)', 'zeta:theta', R, 'one'), ('zeta, Lambda-weighted', 'zeta:psi', R, 'two'),
        ('L(s, chi_4)', 'chi4:psi', R, 'two'), ('L(s, chi_3)', 'chi3:psi', R, 'two'), ('L(s, chi_5 real)', 'chi5real:psi', R, 'two'), ('L(s, chi_5 quartic), real part', 'chi5q_re:psi', R, 'two'),
        ('sign twist (hash signs), main term 0', 'eps:theta', R, 'two'), ('THIN-random b = 0.9', 'thin:theta', R, 'one'), ('DEL-random b = 0.9', 'del:theta', R, 'one'),
        ('T-NR q = 3, c = 2.2 (zeros Re = 0.904)', 'TNR_q3_c2.2:theta', R, 'one'), ('T-NR q = 3, c = 2.02 (zeros Re = 0.629)', 'TNR_q3_c2.02:theta', R, 'one'),
        ('T-NR q = 1000003, c = 2.2 (zeros Re = 0.532)', 'TNR_q1000003_c2.2:theta', R, 'one'),
        ('E_a, a = 0.1, own main term (run to 1e11)', 'EA:theta', X, 'one'), ('zeta(s + i), own main term, real part (run to 1e11)', 'U_re:psi', X, 'two')]
for T, title in (('T88', 'T88 tent on (N, 4N]'), ('T91', 'T91 tent a = 17/9 on (81N, 289N]'), ('T92_m61', 'T92 tent c = 124/123, m = 61, knots (M, c^61 M, c^153 M]'), ('T92_m62', 'T92 tent m = 62'), ('T93', 'T93 tent a = 23/15 on (225N, 529N]')):
    d = R[T]['_def']; b = d['bias_coeff']
    print('\n**%s.** m(N) = (main - tent)/N^(3/2); bias coefficient B = %s; RH floor from the global amplitude bound = %s (%s B). Columns in units of B.\n' % (title, g(b, 7), g(d['rh_floor_abs_amplitude'], 6), g(d['rh_floor_abs_amplitude'] / b, 3)))
    print('| sequence | N reached | points | first N with m < 0 | last N with m < 0 | points with m < 0 | min m/B (N >= 1e3) | max m/B (N >= 1e3) | min, max m/B in the last full decade |')
    print('|---|---|---|---|---|---|---|---|---|')
    for lab, nm, src, kind in ROWS:
        if nm not in src[T]: continue
        e = src[T][nm]; ld = e['decades'][-2] if len(e['decades']) > 1 else e['decades'][-1]
        print('| %s | %s | %d | %s | %s | %d | %s | %s | 1e%d: %s, %s |' % (lab, g(e['last'][0], 4), e['n'], e['first_negative_N'], e['last_negative_N'], e['n_negative'], g(e['min_m_N_ge_1000'] / b, 4), g(e['max_m_N_ge_1000'] / b, 4), ld['decade'], g(ld['min'] / b, 4), g(ld['max'] / b, 4)))
    if T in D:
        e = D[T]; dd = e['direct_decades']
        print('| DH, direct Lambda_DH sums (main 0) | %s | %d | n/a | n/a | n/a | %s | %s | 1e%d: %s, %s |' % (g(e['Nmax'], 4), e['n'], g(min(x['direct_min'] for x in dd[2:]) / b, 4), g(max(x['direct_max'] for x in dd[2:]) / b, 4), dd[-2]['decade'], g(dd[-2]['direct_min'] / b, 4), g(dd[-2]['direct_max'] / b, 4)))
print('\n**T88, dyadic N = 2^k (zeta, primes only), m/B:**\n')
dy = R['T88']['zeta:theta']['dyadic']; b = R['T88']['_def']['bias_coeff']
print(', '.join('%d: %.3f' % (int(a).bit_length() - 1, m / b) for a, m in dy if a >= 1024))
print('\n**T88 distribution per decade (zeta, primes only), m/B: min, 5%, median, 95%, max**\n')
print('| decade of N | points | min | 5% | median | 95% | max |\n|---|---|---|---|---|---|---|')
for x in R['T88']['zeta:theta']['decades']: print('| 1e%d | %d | %s | %s | %s | %s | %s |' % (x['decade'], x['count'], *[g(x[k] / b, 4) for k in ('min', 'q05', 'median', 'q95', 'max')]))
print('\n**Resolution of T88 (Nmax = %s): hypothetical off-line pair beta + i gamma added by the explicit formula**\n' % g(R['T88_resolution']['Nmax'], 4))
print('| beta | largest gamma that produces a violation on the grid | smallest gamma that produces none |\n|---|---|---|')
for k, v in R['T88_resolution']['table'].items(): print('| %s | %s | %s |' % (k, g(v['largest_gamma_with_violation'], 4), g(v['smallest_gamma_without_violation'], 4)))
print('\n**Pascal/carry ballot, lambda(N) = log(S_N/C_N)/N^(3/2)**\n')
print('| sequence | points | first N with lambda < 0 | points with lambda < 0 | min, max per decade of N |\n|---|---|---|---|---|')
for nm in ('zeta:theta', 'thin:theta', 'del:theta', 'TNR_q3_c2.2:theta', 'TNR_q3_c2.02:theta', 'TNR_q1000003_c2.2:theta'):
    e = R['Pascal'][nm]; print('| %s | %d | %s | %d | %s |' % (nm, e['n'], e['first_negative_N'], e['n_negative'], '; '.join('1e%d: %s, %s' % (x['decade'], g(x['min'], 4), g(x['max'], 4)) for x in e['decades'][::2])))
print('\nPowers of 10: ' + ', '.join('N=1e%d: %s' % (round(math.log10(a)), g(v, 6)) for a, v, _ in R['Pascal']['zeta:theta']['pow10']))
print('\nPowers of 3 (last six): ' + ', '.join('3^%d: %s' % (round(math.log(a, 3)), g(v, 6)) for a, v in R['Pascal']['zeta:theta']['pow3'][-6:]))
print('\n**Robin comparison** (%s)\n' % R['Robin']['definition'])
print('| decade of largest prime x | points | min nu | max nu | min of e^gamma loglog n - sigma(n)/n |\n|---|---|---|---|---|')
for x in R['Robin']['decades']: print('| 1e%d | %d | %s | %s | %s |' % (x['decade'], x['count'], g(x['min_nu'], 4), g(x['max_nu'], 4), g(x['min_margin'], 4)))
print('\n**Triangular inequality (4): R(x) = F(x) - main(x); columns: sup of R/x^(15/8) over the decade (one-sided), sup |R|/x^(15/8) (two-sided)**\n')
TR = [('zeta, primes only', 'zeta:theta', R), ('zeta, Lambda-weighted', 'zeta:psi', R), ('L(s, chi_4)', 'chi4:psi', R), ('sign twist, main 0', 'eps:theta', R), ('THIN-random b = 0.9', 'thin:theta', R), ('DEL-random b = 0.9', 'del:theta', R),
      ('T-NR q = 3, c = 2.2', 'TNR_q3_c2.2:psi', R), ('T-NR q = 3, c = 2.02', 'TNR_q3_c2.02:psi', R), ('T-NR q = 1000003, c = 2.2', 'TNR_q1000003_c2.2:psi', R), ('E_a a = 0.1 (to 1e11)', 'EA:psi', X)]
decs = [3, 5, 7, 9, 11, 12]
print('| sequence | best one-sided C over x >= 2 (argmax x) | ' + ' | '.join('1e%d' % d for d in decs) + ' |\n|---|---|' + '---|' * len(decs))
for lab, nm, src in TR:
    e = src['Triangular'][nm]; dm = {x['decade']: x for x in e['decades']}
    print('| %s | %s (x = %s) | ' % (lab, g(e['bestC_one_sided'], 3), g(e['argmax_x'], 3)) + ' | '.join(('%s ; %s' % (g(dm[d]['max_R_over_x158'], 3), g(max(abs(dm[d]['max_R_over_x158']), abs(dm[d]['min_R_over_x158'])), 3))) if d in dm else '-' for d in decs) + ' |')
if 'Triangular' in D:
    print('| DH direct (to 6e8), two-sided only | - | ' + ' | '.join((g(next((x['max_abs_F_over_x158'] for x in D['Triangular'] if x['decade'] == d), float('nan')), 3)) for d in decs) + ' |')
c = R['Triangular']['zeta:psi']['centred_residual']; t = R['Triangular']['zeta:theta']
print('\nCentred residual r(x) = (psi_1(x) - x^2/2 + x log 2pi - zeta\'/zeta(-1))/x^(3/2): sign changes on the grid: %d in total, %d up to 4.93e8; per decade %s; range for x >= 1e3: [%s, %s] (bound %s).' % (c['sign_changes_total'], c['sign_changes_upto_4p93e8'], c['per_decade'], g(c['min_x_ge_1e3'], 4), g(c['max_x_ge_1e3'], 4), g(c['bound_K0'], 4)))
print('Primes-only residual R(x)/x^(3/2) for x >= 1e3: [%s, %s]; sign changes of R: %d.' % (g(t['theta_residual_over_x32_x_ge_1e3'][0], 4), g(t['theta_residual_over_x32_x_ge_1e3'][1], 4), t['sign_changes_of_R']))
print('\n**DH: direct sums against the explicit formula with the zero table (height <= 2000)**\n')
for T in ('T88', 'T91', 'T93'):
    e = D[T]; b = R[T]['_def']['bias_coeff']
    print('\n%s (units of B): first decade where the off-line part exceeds the on-line part: 1e%s (3x: 1e%s)\n' % (T, e['first_decade_offline_exceeds_online'], e['first_decade_offline_exceeds_3x_online']))
    print('| decade of N | points | direct min | direct max | rms(explicit formula - direct) | max on-line part | max off-line part |\n|---|---|---|---|---|---|---|')
    for x in e['direct_decades']: print('| 1e%d | %d | %s | %s | %s | %s | %s |' % (x['decade'], x['count'], g(x['direct_min'] / b), g(x['direct_max'] / b), g(x['ef_minus_direct_rms'] / b, 2), g(x['online_part_max_abs'] / b), g(x['offline_part_max_abs'] / b)))
    print('\nExplicit-formula extrapolation, max |off-line part| / max |on-line part| per decade: ' + ', '.join('1e%d: %s' % (x['decade'], g(x['offline_max_abs'] / x['online_max_abs'], 3)) for x in e['ef_extrapolation'][::2][:8]))
