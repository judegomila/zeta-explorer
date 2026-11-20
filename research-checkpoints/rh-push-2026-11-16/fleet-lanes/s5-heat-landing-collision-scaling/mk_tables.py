"""Markdown tables for RESULT.md from the json outputs (out_server/, out/)."""
import json, glob, os, numpy as np
def L(fn): return json.load(open(fn)) if os.path.exists(fn) else None
order = ['zeta', 'zeta_1e9', 'zeta_1e12', 'heat_0', 'chi', 'chibar', 'L4', 'L5', 'dh', 'alt', 'heat_-1e-4', 'heat_-5e-4', 'heat_-2e-3', 'heat_-1e-2']
lab = {'zeta': 'zeta, first zeros', 'zeta_1e9': 'zeta, window at 1e9', 'zeta_1e12': 'zeta, window at 1e12', 'heat_0': 'zeta, window at 1e7 (sampler, tau = 0)', 'chi': 'L(chi), chi mod 5 complex',
       'chibar': 'L(chibar)', 'L4': 'L(chi_-4)', 'L5': 'L(chi_5), real', 'dh': 'DH on-line list', 'alt': 'alt = Z_chi - Z_chibar on-line list',
       'heat_-1e-4': 'heat tau = -1e-4', 'heat_-5e-4': 'heat tau = -5e-4', 'heat_-2e-3': 'heat tau = -2e-3', 'heat_-1e-2': 'heat tau = -1e-2'}
print('### Table C1 (landing)\n')
print('| object | zeros in the run | pairs | Lambda = max landing time (pairs below 0.8 H) | at height, beta - 1/2 | de Bruijn Y^2/2 of that pair | speed-up, median (5%, 95%) | landing / frozen-rung time, median (max) | unlanded pairs at t = 0.01, 0.05 |')
print('|---|---|---|---|---|---|---|---|---|')
for fn in ['out_server/c1_DH_50000.json', 'out_server/c1_DH_2000_ld.json', 'out/c1_HEAT--0.1_2000.json', 'out/c1_HEAT--0.5_2000.json', 'out_server/c1_EA-0.02_20000.json', 'out_server/c1_EA-0.1_20000.json', 'out_server/c1_EA-0.3_20000.json',
           'out_server/c1_TNR-3-2.2_20000.json', 'out_server/c1_TNR-1000003-2.2_3000.json']:
    d = L(fn)
    if not d: continue
    p = d['pairs']; g = np.array(p['gamma']); land = np.array(p['land']); db = np.array(p['debruijn']); inner = g < 0.8 * d['Hgamma']
    i = int(np.nanargmax(np.where(inner, land, -1))); q = d['speedup_quantiles']; r = d['land_over_rung_quantiles']; s = d['snapshots']
    print('| %s%s, below %g | %d real + 2 x %d | %d | %.6f | %.3f, %.4f | %.6f | %.3f (%.3f, %.3f) | %.3f (%.3f) | %d, %d |' % (
        d['obj'], ' (long double)' if d['ld'] else '', d['Hgamma'], d['n_real'], d['n_pairs'], d['n_pairs'], land[i], g[i], p['x'][i], db[i], q[2], q[1], q[3], r[2], r[4], s['0.01']['unlanded'], s['0.05']['unlanded']))
print('\n### Table C2 (minimal gap, collision time)\n')
print('| list | zeros | exponent of E[min of N normalised gaps] (blocks) | E[min]/GUE-cubic value at N = 100, 1e3, 1e4, 1e5 | small-gap exponent | t_c at N_max (long double window) | t_c/(g^2/8) - 1 | largest N of the full flow, t_c, t_c/(g^2/8) - 1 | s_min/E_coll at N = 1e3 .. N_max |')
print('|---|---|---|---|---|---|---|---|---|')
for nm in order:
    d = L('out_server/c23_%s.json' % nm)
    if not d: continue
    bf = d.get('block_min_fit', {}); bm = {b['N']: b for b in d['block_min']}; last = d['ladder'][-1]
    full = [r for r in d['ladder'] if 'tc_flow' in r]
    rat = d['ladder_fit']['ratio_smin_over_ansatz']
    sg = d['small_gap']['exponent_0p02_0p1']; sg = ('%.2f' % sg) if sg < 10 else 'no gap below 0.02'
    print('| %s | %d | %.4f +- %.4f | %s | %s | %.4e | %.1e | %s | %.2f .. %.2f (min %.2f, max %.2f) |' % (lab[nm], d['n'], bf.get('exponent', float('nan')), bf.get('exponent_err', float('nan')),
          ', '.join(('%.3f' % bm[N]['ratio_to_gue']) if N in bm else '-' for N in (100, 1000, 10000, 100000)), sg, last['tc_window_ld'], last['retardation_window'],
          ('%d, %.4e, %.1e' % (full[-1]['N'], full[-1]['tc_flow'], full[-1]['retardation'])) if full else '-', rat[0], rat[-1], min(rat), max(rat)))
print('\n### Table C3 (gates)\n')
print('| list | adjacent pairs | S < 0 | fraction with S g^2 > 0.909 (all pairs) | > 2 | close pairs (s < 0.2): number, with S g^2 > 0.909, > 2, largest | running minimal pair: largest S g^2 on the ladder | closest pairs flowed: resolved, sup B g^2 > 0.909, > 2 | bracket violations with the true beta | t_c beyond the static depth T_+(g, S_0) |')
print('|---|---|---|---|---|---|---|---|---|---|')
rows = []
for nm in order:
    d = L('out_server/c23_%s.json' % nm)
    if not d: continue
    c = d['c3']; cp = c['closest_pairs']; cl = c['close_pairs']
    print('| %s | %d | %d | %.4f +- %.4f | %.4f | %d, %d, %d, %.2f | %.4g | %d of %d, %d, %d | %d | %d |' % (lab[nm], c['pairs'], c['S_negative'], c['frac_gate_gt_0p909'][0], c['frac_gate_gt_0p909'][1], c['frac_gate_gt_2'][0],
          cl['n'], cl['n_gate_gt_0p909'], cl['n_gate_gt_2'], cl['max_gate'] or 0, max(m['gate_S_g2'] for m in c['running_minimal_pair']), cp['resolved'], cp['n'], cp['n_sup_gt_0p909'], cp['n_sup_gt_2'], cp['violations_sandwich_true_beta'], cp['static_reserve_depth_exceeded']))
cu = L('out/cue_ref.json')
if cu: print('| CUE, N = 1500, 120 matrices | %d | 0 | %.4f +- %.4f | %.4f | %d, %d, %d, %.2f | - | - | - | - |' % (cu['pairs'], cu['frac_gate_gt_0p909'], cu['frac_gate_gt_0p909_sem'], cu['frac_gate_gt_2'], cu['close_pairs']['n'], cu['close_pairs']['n_gate_gt_0p909'], cu['close_pairs']['n_gate_gt_2'], cu['close_pairs']['max_gate']))
print('\n### Table C4a (windowed discriminant rate per zero, unfolded; GUE mean pi^2/3 = 3.2899, lattice 1.6449)\n')
print('| list | N = 1e3: windows, mean +- sem, median, max | N = 1e4: mean, median, max | N = 1e5: mean, median, max | N = 1e6: mean, median, max | nearest-neighbour share |')
print('|---|---|---|---|---|---|')
for nm in order:
    d = L('out_server/c4_disc_%s.json' % nm)
    if not d: continue
    w = {x['N']: x for x in d['windows']}
    f = lambda N: ('%.3f, %.3f, %.1f' % (w[N]['mean'], w[N]['median'], w[N]['max'])) if N in w else '-'
    print('| %s | %d, %.3f +- %.3f, %.3f, %.1f | %s | %s | %s | %.2f |' % (lab[nm], w[1000]['windows'], w[1000]['mean'], w[1000]['sem'], w[1000]['median'], w[1000]['max'], f(10000), f(100000), f(1000000), w[1000]['nearest_neighbour_share']))
if cu: print('| CUE, N = 1500 (whole circle) | 120, %.3f +- %.3f, %.3f, - | - | - | - | %.2f |' % (cu['disc_rate_mean'], cu['disc_rate_sem'], cu['disc_rate_median'], cu['nearest_neighbour_share']))
d = L('out_server/c4_prime.json')
if d:
    print('\n### Table C4b (prime side minus zero side at the 1000 zeros of a window; explicit formula with prime powers to X)\n')
    print('| list, window start (height) | X | resolution 1/log X in mean spacings | rms of Z | rms (max) of P - Z | T-NR q = 3: rms (max) mismatch, terms | T-NR q = 1000003: rms (max) mismatch, terms |')
    print('|---|---|---|---|---|---|---|')
    for r in d['rows']:
        a = r['tnr_q3']; b = r['tnr_q1000003']
        print('| %s, %d (%.6g) | 1e%d | %.2f | %.2f | %.1e (%.1e) | %.3g (%.3g), %d | %.3g (%.3g), %d |' % (r['name'], r['start'], r['height'], round(np.log10(r['X'])), r['resolution_in_mean_spacings'], r['rms_Z'], r['rms_diff'], r['max_abs_diff'],
              a['rms_mismatch'], a['max_abs_mismatch'], a['terms'], b['rms_mismatch'], b['max_abs_mismatch'], b['terms']))
    print('\nT-NR Poisson check:', d['tnr_poisson_check'])
print('\n### Table C4c (Hadamard identity at the zeros)\n')
print('| object | zeros below | rms of function side | mismatch with the on-line list only: rms, max | residual after the off-line pair formula: max | zeros below the first off-line height: number, max mismatch | fraction with mismatch > nearest-pair term, > 2 x |')
print('|---|---|---|---|---|---|---|')
for o in ('ZETA', 'L4', 'L5', 'DH', 'TNR'):
    d = L('out_server/c4_hadamard_%s.json' % o)
    if not d: continue
    print('| %s | %d (%g) | %.3f | %.2e, %.2e | %.1e | %s | %s |' % (o, d['n'], d['tmax'], d['rms_F'], d['rms_mismatch'], d['max_abs_mismatch'], d['max_abs_residual'],
          ('%d, %.2e' % (d['n_zeros_below_first_offline'], d['max_abs_mismatch_below_first_offline'] or 0)) if 'n_zeros_below_first_offline' in d else '-',
          ('%.2f, %.2f' % (d['frac_abs_mismatch_gt_abs_nearest'], d['frac_abs_mismatch_gt_twice_nearest'])) if 'frac_abs_mismatch_gt_abs_nearest' in d else '-'))
