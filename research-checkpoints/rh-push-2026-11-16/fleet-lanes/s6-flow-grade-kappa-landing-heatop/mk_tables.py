"""prints all tables of the lane from the json outputs (out/ = Mac, out_server/ = server) into out/tables.md"""
import json, glob, os, math, sys
L = []
def P(*a): L.append(' '.join(str(x) for x in a))
def load(f):
    try: return json.load(open(f))
    except Exception: return None
# ---------------- C1
P('## Table C1a: function-side landing times (Taylor tables, no zero list)\n')
P('| object | file | pairs | pair (height, beta - 1/2) | landing time | de Bruijn Y^2/2 | ratio |'); P('|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out*/arbland*.json')):
    d = load(f)
    if not d: continue
    ok = [p for p in d['pairs'] if 'landing' in p and p['bracket'][1] is not None]
    if not ok: P('| %s | %s | %d | none landed | | | |' % (d['obj'], f, len(d['pairs']))); continue
    best = max(ok, key=lambda p: p['landing'])
    for p in ok[:3] + ([best] if best not in ok[:3] else []):
        P('| %s | %s | %d of %d | %.4f, %.5f%s | %.9f | %.6f | %.4f |' % (d['obj'], f, len(ok), len(d['pairs']), float(p['g']), float(p['b']), ' (largest)' if p is best else '', p['landing'], p['debruijn'], p['ratio']))
P('\n## Table C1b: Lambda_H / kappa_H by height from per-pair flows\n')
g = load('out/c1_grade.json')
if g:
    for fn, e in g.items():
        P('\n%s (run to height %g, %s)\n' % (e['obj'], e['Hgamma'], fn)); P('| H | Lambda_H | kappa_H | Lambda_H/kappa_H | pairs in band | landing/de Bruijn in band: median [min, max] | largest landing in band |'); P('|---|---|---|---|---|---|---|')
        for r in e['rows']:
            if r['band_pairs']: P('| %.4g | %.6f | %.6f | %.4f | %d | %.3f [%.3f, %.3f] | %.4f |' % (r['H'], r['Lambda_H'], r['kappa_H'], r['ratio'], r['band_pairs'], r['band_ratio_median'], r['band_ratio_min'], r['band_ratio_max'], r['band_max_land']))
P('\n## Table C1c: pairs planted on zeta (landing time / de Bruijn)\n')
P('| list | height | variant | Y = 2(beta - 1/2) | sites | median [min, max] | mean-field value | Y x density |'); P('|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out*/plant_*.json')):
    d = load(f)
    if not d or 'summary' not in d: continue
    for s in d['summary']:
        if s['Y'] in (0.2, 1.0) or (s['Y'] == 0.6 and s['variant'] in ('hole', 'added')):
            P('| %s | %.3g | %s | %.2f | %d | %.3f [%.3f, %.3f] | %.3f | %.3f |' % (f, s['T'], s['variant'], s['Y'], s['n'], s['ratio_median'], s['ratio_min'], s['ratio_max'], s['mean_field_ratio'], s['Yrho']))
# ---------------- C2
P('\n## Table C2a: Jensen surfaces (d in the grid up to 400)\n')
P('| object | file | precision (bits) | cells | cells with theta* > 0 | uncertified | largest hyperbolic grid degree d*(n) for n = 0, 1, 2, 3, 5, 8, 12, 20, .. |'); P('|---|---|---|---|---|---|---|')
surf = {}
for f in sorted(glob.glob('out*/surf*.json')):
    d = load(f)
    if not d: continue
    surf[f] = d; ds = d['dstar_grid']
    P('| %s | %s | %d | %d | %d | %d | %s |' % (d['obj'], f, d['prec'], d['n_cells'], d['n_positive'], d['uncertified'], ', '.join('%s' % ds[k] for k in sorted(ds, key=int))))
P('\n## Table C2b: theta*(d, n) = t*/s^2 where positive\n')
for f, d in surf.items():
    pos = [r for r in d['rows'] if r.get('theta_star', 0) not in (0.0,)]
    if not pos: continue
    P('\n%s (%s)\n' % (d['obj'], f)); ns = sorted(set(r['n'] for r in pos)); dd = sorted(set(r['d'] for r in pos))
    P('| n | ' + ' | '.join('d=%d' % x for x in dd) + ' |'); P('|---|' + '---|' * len(dd))
    for n in ns:
        row = {r['d']: r for r in pos if r['n'] == n}
        P('| %d | ' % n + ' | '.join(('%.3g (%d real)' % (row[x]['theta_star'], row[x]['real_roots_t0'])) if x in row else '0' for x in dd) + ' |')
P('\n## Table C2c: degree at which the Jensen root continuing an off-line zero becomes real\n')
P('| object | file | off-line zero (height, beta - 1/2) | cone bound D0 | d_pair(n = 0) | d_pair / D0 | terms summed | n = 1 | n = 2 |'); P('|---|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out*/track*.json')):
    d = load(f)
    if not d: continue
    for p in d['pairs']:
        r = {x['n']: x for x in p['rows']}
        def cell(n):
            if n not in r: return '-'
            x = r[n]
            return ('%d (D0 %.0f)' % (x['d_pair'], x['D0_pair'])) if 'd_pair' in x else ('zero of F^(%d) real' % n if 'note' in x else 'no descent')
        r0 = r.get(0, {})
        if 'd_pair' in r0: P('| %s | %s | %.4f, %.5f | %.0f | %d | %.3f | %s | %s | %s |' % (d['obj'][:40], f, float(p['g']), float(p['b']), r0['D0_pair'], r0['d_pair'], r0['ratio_to_D0'], r0.get('terms_used'), cell(1), cell(2)))
        else: P('| %s | %s | %.4f, %.5f | | not resolved by this table | | | | |' % (d['obj'][:40], f, float(p['g']), float(p['b'])))
# ---------------- C3
P('\n## Table C3: prime side against direct evaluation of M_t\n')
for f in sorted(glob.glob('out*/c3*_zeta.json') + glob.glob('out*/c3*_L.json')):
    d = load(f)
    if not d: continue
    P('\n%s: prime powers to %g (%d)\n' % (f, d['P'], d['prime_powers']))
    P('| object | x0 | c | abs(dM_0) | abs(F_P/F - 1) | abs(dM_-0.1) | Burgers defect / scale (prime side) | abs(dM_+0.1) | part of the +0.1 integral inside the strip | prime side against the same truncated integral |'); P('|---|---|---|---|---|---|---|---|---|---|')
    for r in d['rows']:
        P('| %s | %.6g | %.1f | %.2e | %.2e | %.2e | %.1e / %.1e | %s | %s | %s |' % (r['obj'], r['x0'], r['c'], r['M0_abs_diff'], r['logF_abs_diff'], r['Mneg_abs_diff'], r['burgers_defect_prime'], r['burgers_scale_prime'],
          ('%.2e' % r['Mpos_prime_vs_direct']) if 'Mpos_prime_vs_direct' in r else '-', ('%.2e' % r['Mpos_strip_part']) if 'Mpos_strip_part' in r else '-', ('%.2e' % r['Mpos_prime_vs_truncated_direct']) if 'Mpos_prime_vs_truncated_direct' in r else '-'))
for f in sorted(glob.glob('out*/c3*dhser.json')):
    d = load(f)
    if not d: continue
    P('\n%s: partial sums of -F\'/F with the function\'s own coefficients\n' % f); P('| object | sigma | t | ' + ' | '.join('N=%.0e' % p['N'] for p in d[0]['partial']) + ' | max abs c(n) per decade |'); P('|---|---|---|' + '---|' * (len(d[0]['partial']) + 1))
    for r in d: P('| %s | %.1f | %g | ' % (r['obj'], r['sigma'], r['t']) + ' | '.join('%.2e' % p['abs_diff'] for p in r['partial']) + ' | ' + ', '.join('%.3g' % v for v in r['max_abs_c_by_decade']) + ' |')
# ---------------- C4
P('\n## Table C4a: direct count D(tau, T) (model sum) against the prediction\n')
P('| file | object | T range | zeros | tau | D | pair criterion | D / (pair + triple) | +- | D / pair only | D / GUE | zeta on the same blocks: D, ratio |'); P('|---|---|---|---|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out*/c4_count_*.json') + glob.glob('out*/c4_tnr*.json')):
    d = load(f)
    if not d or 'table' not in d or 'test' in f: continue
    for e in d['table']:
        r = e['ratio']['bk_pair_triple'] or 0
        P('| %s | %s | %.3g .. %.4g | %d | %g | %d | %d | %.4f | %.4f | %.4f | %.4f | %s |' % (f, ('T-NR q=%g' % d['tnr'][0]) if d['tnr'] else 'zeta', d['T'], d['Tend'], d['n0'], e['tau'], e['D'], e['D_gap'], r, r * (e['rel_stat'] or 0), e['ratio']['bk_pair'] or 0, e['ratio']['gue'] or 0,
          ('%d, %.4f' % (e['D_zeta'], e['ratio_zeta']['bk_pair_triple'])) if 'D_zeta' in e else '-'))
P('\n## Table C4b: lists, pair criterion against the prediction with the list\'s conductor\n')
P('| file | list | q | zeros | heights | tau | D (pair criterion) | D / (pair + triple) | +- | D / pair only | D / GUE |'); P('|---|---|---|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out*/c4_lists_*.json')):
    d = load(f)
    if not d: continue
    for r in d:
        for e in r['rows']:
            if e['D_gap'] and e['tau'] in (1e-6, 1e-5, 1e-4, 1e-3, 1e-2):
                P('| %s | %s | %d | %d | %.3g .. %.3g | %g | %d | %.4f | %.4f | %.4f | %.4f |' % (f, r['name'], r['q'], r['zeros'], r['heights'][0], r['heights'][1], e['tau'], e['D_gap'], e['ratio'], e['ratio'] * e['rel_stat'], e['ratio_pair_only'], e['ratio_gue']))
open('out/tables.md', 'w').write('\n'.join(L) + '\n'); print('tables written:', len(L), 'lines')
