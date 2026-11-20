"""Collects the JSON outputs (out_server/ = server runs, out/ = Mac runs) into out/tables.md.  Reads only this lane's own output files."""
import json, os, glob, math, numpy as np
S = 'out_server/'; L = 'out/'; o = []
def P(*a): o.append(' '.join(str(x) for x in a))
def ld(fn):
    return json.load(open(fn)) if os.path.exists(fn) else None
def f(x, n=4): return 'n/a' if x is None else ('%.' + str(n) + 'g') % x

# ---------------------------------------------------------------- combination 1, zero side
P('## T1 zero side (server): K_l of the omitted zeros, reference (longer list) against the density\n')
d = ld(S + 't1z_zeta.json')
if d:
    P('| N | top height | S(top) | K_max (depth) | first omitted zero at | r top gap (bT / bN) | r depth 10-30 (bT) | r depth 100-300 (bT) | r depth 100-300 (bN) | r depth >= 1000 (bT) | record pair: gap, K, r |'); P('|---|---|---|---|---|---|---|---|---|---|---|')
    for r in d['rows']:
        bb = {tuple(b['depth']): b for b in r['bands']}; rp = r['record_pair']
        g = lambda k, a, b_: '[%s, %s]' % (f(bb[k][a], 5), f(bb[k][b_], 5)) if k in bb else 'n/a'
        P('| %d | %.6g | %+.2f | %.4f (%d) | %.3f (%.2f spacings) | %s / %s | %s | %s | %s | %s | %.6f, %.4g, %.6f |' % (r['N'], r['top_height'], r['S_at_top'], r['Kmax'], r['Kmax_depth'], r['dist_first_omitted'], r['dist_first_omitted'] / r['mean_spacing'],
          f(bb[(0, 1)]['rT_med']), f(bb[(0, 1)]['rN_min']), g((10, 30), 'rT_min', 'rT_max'), g((100, 300), 'rT_min', 'rT_max'), g((100, 300), 'rN_min', 'rN_max'), g((1000, 2001), 'rT_min', 'rT_max'), rp['gap'], rp['K'], rp['K'] / rp['Kb']))
    t = d.get('topscan')
    if t:
        P('\nTop gap over %d random table sizes N (zeta, first 1e8 zeros). Quantiles %s' % (t['n'], t['quantiles']))
        P('- K_top: %s' % [float(f(v)) for v in t['K_top_quantiles']]); P('- K_top / dens^2: %s' % [float(f(v)) for v in t['K_top_over_dens2_quantiles']]); P('- r = K/K(bT): %s' % [float(f(v)) for v in t['r_quantiles']])
        P('- fraction of N with K_top > 2.85: %.4f; > 22.92: %.4f; largest K_top %.1f at N = %d' % (t['frac_K_gt_2p85'], t['frac_K_gt_22p92'], t['K_max'], t['N_at_max']))
for nm in ('chi', 'chibar', 'L4', 'L5'):
    d = ld(S + 't1z_%s.json' % nm) or ld(L + 't1z_%s_local.json' % nm)
    if not d: continue
    for r in d['rows']:
        bb = {tuple(b['depth']): b for b in r['bands']}
        P('- %s N = %d (top %.6g): K_max %.3f; r(bT) depth 10-30 [%s, %s]; depth 100-300 [%s, %s]; r(bN) depth 100-300 [%s, %s]' % (nm, r['N'], r['top_height'], r['Kmax'], f(bb[(10, 30)]['rT_min'], 5), f(bb[(10, 30)]['rT_max'], 5), f(bb[(100, 300)]['rT_min'], 5), f(bb[(100, 300)]['rT_max'], 5), f(bb[(100, 300)]['rN_min'], 6), f(bb[(100, 300)]['rN_max'], 6)))
    t = d.get('topscan')
    if t: P('  - %s top gap over %d table sizes: K_top/dens^2 quantiles %s; r quantiles %s' % (nm, t['n'], [float(f(v, 3)) for v in t['K_top_over_dens2_quantiles']], [float(f(v, 3)) for v in t['r_quantiles']]))

# ---------------------------------------------------------------- combination 1, prime side
for fn in sorted(glob.glob(S + 't1p_*.json')) + sorted(glob.glob(L + 't1p_local.json')):
    d = ld(fn)
    if not d or fn.endswith('_acc.json'): continue
    P('\n## T1 prime side (%s): X_max = %g, %d prime powers, %d points\n' % (fn, d['XMAX'], d['n_prime_powers'], d['n_points']))
    P('| object | N | X | resolution (mean spacings) | band (depth) | n | rms prime - ref | r prime [min, med, max] | r ref | r true kernel | cut kernel - true (max rel) |'); P('|---|---|---|---|---|---|---|---|---|---|---|')
    for r in d['rows']:
        for b in r['bands']:
            P('| %s | %d | %g | %.2f | %s | %d | %.2e | %s | %s | %s | %.2e |' % (r['name'], r['N'], r['X'], r['resolution_in_mean_spacings'], b['depth'], b['n'], b['rms_prime_minus_ref'], [float(f(v)) for v in b['r_prime']], [float(f(v)) for v in b['r_ref']], [float(f(v)) for v in b['r_true']], b['max_rel_cut_minus_true']))
    P('\nControls on the table of zeta (r = K^L(control coefficients, zeta table)/K^L(density); "true_field" = unsmoothed function side over the density):\n')
    P('| N | X | band | zeta r | T-NR q=1000003 | T-NR q=1000003 function side | T-NR q=3 | E_0.02 | E_0.1 | Liouville | random sign |'); P('|---|---|---|---|---|---|---|---|---|---|---|')
    for r in d['rows']:
        if r['kind'] != 'zeta': continue
        for b in r['bands']:
            if 'ctl_sgn' not in b: continue
            c = lambda v: [float(f(t, 3)) for t in b['ctl_' + v]['r']]
            P('| %d | %g | %s | %s | %s | %s | %s | %s | %s | %s | %s |' % (r['N'], r['X'], b['depth'], [float(f(v)) for v in b['r_prime']], c('tnr_q1000003'), c('tnr_q1000003_true_field'), c('tnr_q3'), c('ea0.02'), c('ea0.1'), c('liou'), c('sgn')))

# ---------------------------------------------------------------- combination 1, controls with off-line zeros
P('\n## T1 controls with zeros off the line (zero side, Mac)\n')
for nm in ('dh', 'heat-0.1', 'heat-0.5', 'tnr_q3'):
    d = ld(L + 't1c_%s.json' % nm)
    if not d: continue
    P('**%s**: %d on-line, %d off-line pairs, first off-line height %.4f\n' % (nm, d['online'], d['offline_pairs'], d['first_offline_height']))
    P('| table height | N | off-line pairs below top | subset | n | r [min, 10%, med, 90%, max] | r from on-line zeros only [min, med, max] | K_off signed [min, med, max] | K_dens median | fraction outside [0.9, 1.1] |'); P('|---|---|---|---|---|---|---|---|---|---|')
    for r in d['rows']:
        for b in r['bands']:
            P('| %.2f | %d | %d | %s | %d | %s | %s | %s | %.3g | %.3f |' % (r['Htab'], r['N'], r['offline_pairs_below_table_top'], b['subset'], b['n'], [float(f(v)) for v in b['r']], [float(f(v)) for v in b['r_online_only']], [float(f(v, 3)) for v in b['K_offline_signed']], b['K_dens_median'], b['frac_r_outside_0p9_1p1']))
    P('')

# ---------------------------------------------------------------- combination 2
P('\n## T2 plateau table (server)\n')
d = ld(S + 't2_plateau.json') or ld(L + 't2_plateau_local.json')
if d:
    P('| startN | endN | H | a | theta | tcLo | tcHi | F_mb upper | K_paper bound |'); P('|---|---|---|---|---|---|---|---|---|')
    for r in d['rows']: P('| %d | %d | %.8f | %d | %.10f | %.9e | %.9e | %.6e | %.6e |' % (r['startN'], r['endN'], r['H'], r['a'], r['theta'], r['tcLo'], r['tcHi'], r['FmbUpper'], r['KpaperBound']))
    P('\nK_paper max = %.8e (source 2.42370832e-6); min theta %.10f' % (d['K_paper_max'], d['min_theta']))
P('\n## T2 bracket against the flow of the full zero set\n')
P('| object | where | windows | heights | declared per-gap: inside / outside / not certified | declared uniform | honest per-gap | t_true/pair [min, med, max] | position in declared bracket [min, max] | direct H_t / flow [min, max] (n) | nearest off-line zero (spacings) [min, med] | K_off record [min, med, max] | windows with an off-line zero inside the quarantine distance |'); P('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for src, tag in ((S + 't2_', 'server'), (L + 't2L_', 'Mac')):
    for fn in sorted(glob.glob(src + '*.json')):
        if 'plateau' in fn: continue
        d = ld(fn); R = [r for r in d['rows']]
        if not R: continue
        tt = np.array([r['t_true'] / r['pair_time'] if r['t_true'] else np.nan for r in R]); pos = np.array([r['declared']['pg'].get('pos', np.nan) for r in R], dtype=float)
        dv = [r['direct_over_flow'] for r in R if r.get('direct_over_flow')]
        c = lambda k: '%d / %d / %d' % (d[k]['inside'], d[k]['outside'], d[k]['not_certified'])
        if R[0]['nearest_offline'] is not None:
            near = np.array([r['nearest_offline'] / r['spacing'] for r in R]); ko = np.array([r['K_off_signed_record'] for r in R]); q = np.array([r['quarantine'] / r['spacing'] for r in R])
            offs = '[%.3g, %.3g] | [%.3g, %.3g, %.3g] | %d' % (near.min(), np.median(near), ko.min(), np.median(ko), ko.max(), int((near < q).sum()))
        else: offs = 'none | 0 | 0'
        P('| %s | %s | %d | %.4g .. %.4g | %s | %s | %s | [%.6f, %.6f, %.6f] | [%.3f, %.3f] | %s | %s |' % (d['name'], tag, len(R), R[0]['height'], R[-1]['height'], c('declared_pg'), c('declared_uni'), c('honest_pg'), np.nanmin(tt), np.nanmedian(tt), np.nanmax(tt), np.nanmin(pos), np.nanmax(pos),
          ('[%.7f, %.7f] (%d)' % (min(dv), max(dv), len(dv))) if dv else 'not run', offs))

# ---------------------------------------------------------------- combination 3
P('\n## T3 per-site depth: minimal member-spectator distance in mean spacings (close pairs: unfolded gap < 0.1)\n')
P('| list | where | N | subset | close pairs | static floor (d_1 at t = 0) | floor c = 1/16 | floor c = 1/8 (collisions with a spectator) | floor c = 1/4 (collisions) | end/static range at c = 1/4 | 1% quantile static | floors in four height blocks (static) |'); P('|---|---|---|---|---|---|---|---|---|---|---|---|')
for src, tag in ((S + 't3_', 'server'), (L + 't3L_', 'Mac')):
    for fn in sorted(glob.glob(src + '*.json')):
        d = ld(fn)
        for r in d['rows']:
            a, b, c = r['c=0.0625'], r['c=0.1250'], r['c=0.2500']
            P('| %s | %s | %d | %s | %d | %.4f | %.4f | %.4f (%d) | %.4f (%d) | [%.3f, %.3f] | %.3f | %s |' % (d['name'], tag, r['N'], r['subset'], r['pairs'], r['static_floor'], a['floor'], b['floor'], b['zeros'], c['floor'], c['zeros'], c['end_over_static_min'], c['end_over_static_max'], r['static_q01'], [round(h['static_floor'], 3) for h in r['height_blocks']]))
P('\n60-digit recheck (mpmath RK4, 150 and 300 steps) of the smallest positive floors:\n')
for src in (S + 't3_', L + 't3L_'):
    for fn in sorted(glob.glob(src + '*.json')):
        d = ld(fn)
        for c in d.get('recheck_60_digits', [])[:3]:
            P('- %s (%s) pair %d c = %.4f: float64 min %.12f end %.12f; mp(150) %s; mp(300) %s' % (d['name'], 'server' if src.startswith(S) else 'Mac', c['pair_index'], c['c'], c['float64_min'], c['float64_end'], [round(v, 12) for v in c['mp_150_steps_min_end']], [round(v, 12) for v in c['mp_300_steps_min_end']]))
P('\nTransport coefficient of Lemma B on Im z = y* (sup over 600 points of |Im M\'\'|/|Im M| against 2/y*^2):\n')
P('| list | N | y* (spacings) | 2/y*^2 | measured sup | ratio | sup |Im(2MM\' + M\'\')|/|Im M| | Jacobian sup 2|M\'| | 2N/y*^2 |'); P('|---|---|---|---|---|---|---|---|---|')
for src in (S + 't3_', L + 't3L_'):
    for fn in sorted(glob.glob(src + '*.json')):
        d = ld(fn)
        if d['name'] not in ('zeta', 'chi', 'dh', 'heat_-1e-2', 'heatL_-1e-2', 'zeta_1e9'): continue
        for t in d['transport']:
            P('| %s | %d | %.3f (%.2f) | %.4g | %.4g | %.3f | %.4g | %.4g | %.4g |' % (d['name'], t['N'], t['y_star'], t['y_star_in_spacings'], t['bound_2_over_y2'], t['sup_ImM2_over_ImM'], t['ratio_to_bound'], t['sup_full_rate'], t['measured_jacobian_sup'], t['L_field_2N_over_y2']))

# ---------------------------------------------------------------- combination 4
P('\n## T4 isolation ratio of the minimal pair of each window (server)\n')
pr = ld(S + 't4_pred.json') or ld(L + 't4_pred.json')
if pr:
    P('Prediction: Lam = %.6f (primes to 1e6: %.6f); sine kernel c2 = %.6f, c3 = %.6f; f(N) = %.3f N^(-5/3) for rho > 0.72 and %.3f N^(-5/3) for rho > c_half (leading order, sine kernel).' % (pr['Lam'], pr['prime_sum_to_1e6'], pr['c2_sine'], pr['c3_sine'], pr['thresholds']['0.72']['prefactor_sine'], pr['thresholds']['0.8980208880762339']['prefactor_sine']))
    P('\n| E | N_eff | c2 ratio | c3 ratio | f(N) prefactor ratio (0.72) |'); P('|---|---|---|---|---|')
    for r in pr['rows']: P('| %g | %.3f | %.4f | %.4f | %.4f |' % (r['E'], r['N_eff'], r['c2_ratio'], r['c3_ratio'], r['prefactor_ratio_072']))
P('\n| list | zeros | heights | pair exponent (count below e) | clusters both gaps < 0.2 / < 0.3 | N | windows | rho > 0.72: n (fraction) | sine-kernel prediction n | rho > c_half: n | largest rho | median rho | n by height quarter |'); P('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for nm in ('zeta', 'zeta_1e9', 'zeta_1e12', 'chi', 'chibar', 'L4', 'L5', 'dh', 'alt', 'heat_0', 'heat_-1e-4', 'heat_-5e-4', 'heat_-2e-3', 'heat_-1e-2'):
    d = ld(S + 't4_%s.json' % nm)
    if not d: continue
    Lw = d['laws']
    for w in d['windows']:
        pred = (pr['thresholds']['0.72']['prefactor_sine'] * w['N'] ** (-5 / 3) * w['windows']) if pr else float('nan')
        P('| %s | %d | %.3g .. %.3g | %s | %d / %d | %d | %d | %d (%.3e) | %.1f | %d | %.3f | %.3f | %s |' % (nm, d['n_zeros'], d['height'][0], d['height'][1], f(Lw['pair_exponent_fit'][0], 3), Lw['cluster_both_below'][8], Lw['cluster_both_below'][9], w['N'], w['windows'], w['n_gt_072'], w['frac_gt_072'], pred, w['n_gt_chalf'], w['rho_max'], w['rho_median'], [b['n_gt_072'] for b in w['by_height']]))
open(L + 'tables.md', 'w').write('\n'.join(o) + '\n'); print(len(o), 'lines written to', L + 'tables.md')
