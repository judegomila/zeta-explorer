"""Markdown tables for RESULT.md from the json outputs in out/.   usage: tables.py > out/TABLES.md"""
import json, glob, os, math
HERE = os.path.dirname(os.path.abspath(__file__)); O = os.path.join(HERE, 'out')
def J(name):
    f = os.path.join(O, name)
    return json.load(open(f)) if os.path.exists(f) and os.path.getsize(f) > 0 else None

print('## T1. Combination (1): circles\n')
print('| file | object | r | L | N | circles (xmin) | winding numbers | triples without winding jump: non-convex modes (log abs F, arg F) / modes | triples with a jump: non-convex | not log-convex (no-jump triples) | transport residual, pairs without jump: median, max | A-parity: odd part of log abs F (max rel) |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob(os.path.join(O, 'kl_*.json'))):
    r = json.load(open(f))
    inn = [c for c in r['circles'] if not c['spec'].startswith('ax')]; inn.sort(key=lambda c: c['v'])
    nj = [t for t in r['triples'] if abs(t['winding'][0] - t['winding'][2]) < 0.01 and abs(round(t['winding'][0]) - t['winding'][0]) < 0.01]
    jp = [t for t in r['triples'] if t not in nj]
    pj = [p for p in r['pairs'] if abs(p['winding_jump']) < 0.01]
    def s(ts, key): return '%d, %d / %d' % (sum(t['logabs'][key] for t in ts), sum(t['arg'][key] for t in ts), sum(t['logabs']['n_modes'] for t in ts)) if ts else '-'
    print('| %s | %s | %g | %g | 2^%d | %s | %s | %s (%d triples) | %s (%d triples) | %s | %s | %s |' % (
        os.path.basename(f)[3:-5], r['code'], r['r'], r['L'], round(math.log2(r['N'])), ', '.join('%g' % c['xmin'] for c in inn), ', '.join('%g' % round(c['winding'], 2) for c in inn),
        s(nj, 'nonconvex'), len(nj), s(jp, 'nonconvex'), len(jp), s(nj, 'not_logconvex'),
        ('%.1e, %.1e' % (max(p['transport_resid_median'] for p in pj), max(p['transport_resid_max'] for p in pj))) if pj else '-',
        ', '.join('%.1e' % a['odd_part_logabs_rel_max'] for a in r['A_parity']) or '-'))

print('\n## T2. Combination (2): strip kernels (first order with a negative pivot; "-" = none up to n; u = undetermined at that order)\n')
for f in sorted(glob.glob(os.path.join(O, 'c2_*.json'))):
    r = json.load(open(f))
    if not r['kernels']: continue
    print('**%s**: %s, a = %s, nodes Re w in [%s, %s], Im w in [%.4g, %.4g], n = %d, %d bits, max abs S = %.6f\n' % (os.path.basename(f)[3:-5], r['code'], r['a'], r['rect'][0], r['rect'][1], float(r['rect'][2]), float(r['rect'][3]), r['n'], r['bits'], r['max_abs_S']))
    print('| kernel | ' + ' | '.join(k['kernel'].replace('sinh:', 'Y=') for k in r['kernels']) + ' |')
    print('|---|' + '---|' * len(r['kernels']))
    print('| first negative order | ' + ' | '.join(str(k['first_negative'] or '-') + ('' if k['undetermined_at'] is None else ' (u %d)' % k['undetermined_at']) for k in r['kernels']) + ' |')
    print('| negative pivots | ' + ' | '.join(str(k['n_negative']) for k in r['kernels']) + ' |')
    print('| log10 rho at order 100 | ' + ' | '.join(('%.1f' % k['log10_rho'][99]) if len(k['log10_rho']) > 99 else '-' for k in r['kernels']) + ' |')
    print('| log10 rho at first negative | ' + ' | '.join(('%.1f' % k['log10_rho'][k['first_negative'] - 1]) if k['first_negative'] else '-' for k in r['kernels']) + ' |')
    print('| log10 rho at last order | ' + ' | '.join(('%.1f' % k['log10_rho'][-1]) if k['log10_rho'] else '-' for k in r['kernels']) + ' |\n')

print('\n## T3. Combination (3): linear kernel on test sets with heights in [0, T]\n')
print('| object | a | T | n | bits | max abs S at the nodes | nodes with abs S > 1 | first negative order | log10 rho there | negative pivots | orders determined | least log10 rho |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob(os.path.join(O, 'c3_*.json'))):
    r = json.load(open(f))
    if not r['kernels']: continue
    k = r['kernels'][0]; lr = k['log10_rho']; fn = k['first_negative']
    print('| %s | %s | %.5g | %d | %d | %.6f | %d | %s | %s | %d | %d | %.1f |' % (r['code'], r['a'], float(r['rect'][3]), r['n'], r['bits'], r['max_abs_S'], r['n_abs_S_gt_1'], fn or '-', ('%.1f' % lr[fn - 1]) if fn else '-', k['n_negative'], k['determined'], min(lr)))
print('\n### r = 1 - mu_min with K_{a,0} built from Phi\n')
print('| object | a | heights | n | mu_min = 1 - r | negative eigenvalues | log10 least eigenvalue of K_{a,0} |')
print('|---|---|---|---|---|---|---|')
for f in sorted(glob.glob(os.path.join(O, 'c3r_*.json'))):
    r = json.load(open(f))
    for row in r['rows']:
        if 'error' in row: print('| %s | %s | [%g, %g] | %d | error | | |' % (r['code'], r['a'], r['T0'], r['T'], row['n'])); continue
        print('| %s | %s | [%g, %g] | %d | %s | %d | %.1f |' % (r['code'], r['a'], r['T0'], r['T'], row['n'], row['mu_min'], row['n_negative'], row['log10_K0_min_eig']))

E = J('explicit_an.json')
if E:
    print('\n## T4. Combination (4): prime-side remainder against the frozen block\n')
    print('| run | object | T | X | terms | heights | c | x | min A_X (all heights) | fraction A_X < 0 | mean A_X | pi x density | windows | max abs remainder | tol_S | tol_Phi (far zeros on the line) | remainder / tolerance |')
    print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
    for k, o in E.items():
        if 'lines' not in o or 'TNR' in k or not o['lines'] or 'n_windows' not in o['lines'][0]: continue
        for l in o['lines']:
            print('| %s | %s | %g | %g | %d | %d | %.2g | %.4f | %.3f | %.2e | %.4f | %.4f | %d | %.2e | %.2e | %.2e | %.2f |' % (k[3:], o['model'], o['Tc'], o['X'], o['terms'], l['heights'], l['c'], l['x'], l['min_A_X'], l['frac_A_X_negative'], l['mean_A_X'], l['mean_expected_pi_density'], l['n_windows'], l['max_abs_rem_all_windows'], l['tol_S_typ'], l['tol_Phi_typ'], l['max_rem_over_tol']))
    print('\n### T-NR on the same heights (frozen block = on-line zeros = zeros of zeta)\n')
    print('| q | T | X | x | b - x | fraction of heights outside q < 4b^2 with remainder < -tol | least remainder outside | least exact pair field outside | largest prime-side local term |')
    print('|---|---|---|---|---|---|---|---|---|')
    for k, o in E.items():
        if 'TNR' not in k: continue
        q = 3 if k.endswith('q3') else 1000003; b = 0.4037532248277236 if q == 3 else 0.03210653389931739
        for l in o['lines']:
            t = l.get('tnr_summary')
            if t: print('| %d | %g | %g | %.4f | %.4f | %.3f | %.4g | %.4g | %.4g |' % (q, o['Tc'], o['X'], l['x'], b - l['x'], t['frac_outside_below_minus_tol'], t['min_rem_outside'], t['exact_pair_field_min_outside'], t['local_terms_max_abs']))
    print('\n### DH (lines x fixed; frozen block = the 1861 on-line zeros below 2000 and conjugates; first off-line pair b = 0.3085 at 85.699)\n')
    print('| X | x | heights 10-45: max abs remainder (Lorentz field of the off-line pairs) | 45-70 | 70-80 | 80-84 | remainder with all strip zeros in the block, 10-160 |')
    print('|---|---|---|---|---|---|---|')
    for row in E['DH']['rows']:
        g = lambda k: '%.2e (%.2e)' % (row[k]['max_abs_rem_online_block'], row[k]['max_abs_true_pair_field'])
        print('| %g | %.2f | %s | %s | %s | %s | %.1e |' % (row['X'], row['x'], g('t_10_45'), g('t_45_70'), g('t_70_80'), g('t_80_84'), max(row[k]['max_abs_rem_all_strip_zeros'] for k in row if k.startswith('t_'))))
    print('\n### Objects without a frozen block\n')
    print('| run | object | T | X | x | min | max | mean | rms | fraction negative |')
    print('|---|---|---|---|---|---|---|---|---|---|')
    for k, o in E.items():
        if 'lines' in o and o['lines'] and 'rms' in o['lines'][0]:
            for l in o['lines']: print('| %s | %s | %g | %g | %.4f | %.3f | %.3f | %.4f | %.3f | %.3f |' % (k[3:], o['model'], o['Tc'], o['X'], l['x'], l['min'], l['max'], l['mean'], l['rms'], l['frac_negative']))
R = J('dh_reach.json')
if R:
    print('\n### DH: excess of the remainder over the Lorentz field against the distance d below the pair at 85.699\n')
    print('| X | x | b - x | d in [1.5,3] | [4,6] | [8,12] | [16,24] | [32,48] | [60,80] | reach at 1e-2 | 1e-3 | 1e-4 |')
    print('|---|---|---|---|---|---|---|---|---|---|---|---|')
    for row in R:
        ks = [k for k in row if k.startswith('d_')]
        print('| %g | %.2f | %.3f | %s | %.1f | %.1f | %.1f |' % (row['X'], row['x'], row['b_minus_x'], ' | '.join('%.1e (%.1e)' % (row[k]['max_abs_excess'], row[k]['predicted_envelope']) for k in ks), row['reach_0.01'], row['reach_0.001'], row['reach_0.0001']))
