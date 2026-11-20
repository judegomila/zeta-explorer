"""tables.md from the output JSON files of table11.py. usage: build_tables.py out1.json out2.json ..."""
import json, sys, re
C = {}
for f in sys.argv[1:]:
    d = json.load(open(f))
    for k, v in d['controls'].items(): C[k] = v
ORDER = [k for k in ('zeta', 'DH', 'EA', 'NR', 'HEAT1', 'HEAT025', 'TW', 'UT') if k in C]
LBL = dict(zeta='zeta', DH='DH', EA='E_a, a = 5/16', NR='T-NR, q = 2, c = 17/8', HEAT1='HEAT, tau = 1', HEAT025='HEAT, tau = 0.25', TW='sign twist (Liouville)', UT='unimodular twist, alpha = 1')
def cs(c):
    if c is None: return 'n/f'
    if c['mid'] is None: return 'not finite'
    if c['contains0']: return '0 +- %.1e%s' % (c['rad'], '' if c['rad_below_1e_40'] else ' (radius above 1e-40)')
    return '**excludes 0**: %.6g %+.6gi (+- %.1e)' % (c['mid'][0], c['mid'][1], c['rad'])
def lead(s, n=14):
    """leading digits of 'RE + IM i' where RE, IM are Arb strings '[mid +/- rad]' or exact decimals"""
    try:
        parts = s.replace(' i', '').split(' + ')
        vals = []
        for p in parts[:2]:
            p = p.strip()
            m = re.match(r'\[?\s*(-?[0-9.]+(?:e[-+]?[0-9]+)?)', p)
            vals.append(float(m.group(1)) if m and not p.startswith('[+/-') else 0.0)
        while len(vals) < 2: vals.append(0.0)
        return '%.*g %+.*gi' % (n, vals[0], n, vals[1])
    except Exception: return s[:40]
out = []
out.append('### Table 1. Rows P8 (order 1) and P1 (order 2): enclosure of Q - W_R + C_R\n')
out.append('| control | rectangle (X; Im range) | zeros certified / contour count, per factor | P8 Q_gen | P8 cell (general form) | P8 cell (cited symmetric form) | P8 W_R - pair formula | P1 cell (general) | P1 cell (cited symmetric) |')
out.append('|---|---|---|---|---|---|---|---|---|')
for k in ORDER:
    n = C[k].get('narrow')
    if not n: out.append('| %s | error | | | | | | | |' % LBL[k]); continue
    r8, r1 = n['rows']['P8'], n['rows']['P1']
    fz = '; '.join('%s: %d / %s%s' % (f['name'], f['zeros_certified'], f['contour_count_integer'], '' if f['complete'] else ' (MISMATCH)') for f in n['factors'])
    out.append('| %s | %s; [%s, %s] | %s | %s | %s | %s | %s | %s | %s |' % (LBL[k], n['rect']['X'], n['rect']['Ta'], n['rect']['Tb'], fz, lead(r8['Q_gen'], 10), cs(r8['cell_gen']),
               cs(r8.get('cell_sym')) if 'cell_sym' in r8 else 'not computed (see text)', cs(r8.get('cell_pair')), cs(r1['cell_gen']), cs(r1.get('cell_sym')) if 'cell_sym' in r1 else 'not computed (see text)'))
out.append('\n### Table 2. Sizes in rows P8, P1 (so that no cell is 0 = 0)\n')
out.append('| control | rate z1 | abs D at the rates (lower bound) | P8: abs W_R | P8: abs C_R | P1: abs W_R | P1: abs C_R | P1 Q_gen |')
out.append('|---|---|---|---|---|---|---|---|')
for k in ORDER:
    n = C[k].get('narrow')
    if not n: continue
    r8, r1 = n['rows']['P8'], n['rows']['P1']
    out.append('| %s | %s - %si | %s | %.6g | %.6g | %.6g | %.6g | %s |' % (LBL[k], C[k]['config']['rates'][0][0], C[k]['config']['rates'][0][1], ', '.join('%.3g' % x for x in r1['absD_at_rates_lower']),
               r8['absW'], r8['absC'], r1['absW'], r1['absC'], lead(r1['Q_gen'], 10)))
out.append('\n### Table 3. Row EF: prime side of Q(e^(-zt)) at Re z = 11.5 against the zero side on the wide rectangle\n')
out.append('| control | z3 | N | proved tail bound | abs prime sum | Q from the prime side | cell (prime side - W_R + C_R) | cell (cited symmetric form, jets) | cell pointwise D\'/D + sum | zero list complete |')
out.append('|---|---|---|---|---|---|---|---|---|---|')
for k in ORDER:
    c = C[k]
    if 'wide' in c:
        r = c['wide']['rows']['EF']
        out.append('| %s | %s - %si | %d | %.1e | %.6g | %s | %s | %s | %s | %s |' % (LBL[k], c['config']['z3'][0], c['config']['z3'][1], r['N'], r['tail_bound'], r['abs_prime_sum'], lead(r['Q_prime'], 12),
                   cs(r['cell_prime']), cs(r.get('cell_sym')), cs(r['cell_pointwise']), c['wide']['zero_list_complete']))
    elif 'pointwise_EF' in c:
        r = c['pointwise_EF']
        out.append('| %s | %s - %si | %d | %.1e | %.6g | not formulable in the symmetric form | n/f | n/f | %s | |' % (LBL[k], c['config']['z3'][0], c['config']['z3'][1], r['N'], r['tail_bound'], r['abs_prime_sum'], cs(r['cell_pointwise'])))
    else:
        out.append('| %s | | | | | not formulable (no ordinary Dirichlet series) | n/f | n/f | n/f | |' % LBL[k])
out.append('\n### Table 4. Row P45: Fejer kernel Y^w/(w^2 log Y), Y = 30.5, cell S_Y - TU + C3 - Res\n')
out.append('| control | s | rectangle Im range (Re from -1/2 to 24) | divisor points in R (zeros certified / poles, per factor; contour count) | N | proved tail bound | S_Y | abs TU | divisor sum | cell | tail closed form self-test (worst radius) |')
out.append('|---|---|---|---|---|---|---|---|---|---|---|')
for k in ORDER:
    p = C[k].get('p45')
    if not p:
        out.append('| %s | | | | | | not formulable (no ordinary Dirichlet series) | | | n/f | |' % LBL[k] if k.startswith('HEAT') else '| %s | error | | | | | | | | | |' % LBL[k]); continue
    fz = '; '.join('%s: %d / %d; %s%s' % (f['name'], f['zeros_certified'], f['poles_inside'], f['contour_count_integer'], '' if f['complete'] else ' (MISMATCH)') for f in p['factors'])
    st = p['tail_closed_form_selftest']; ok = all(t['cell']['contains0'] for t in st); wr = max(t['cell']['rad'] for t in st)
    tu = lead(p['TU'], 6)
    out.append('| %s | %s | [%s, %s] | %s | %d | %.1e | %s | %s | %s | %s | %s, %.1e |' % (LBL[k], '%s + %si' % tuple(C[k]['config']['p45']['s']), p['rect']['Ta'], p['rect']['Tb'], fz, p['N'], p['tail_bound'], lead(p['S_Y'], 12),
               tu, lead(p['divisor_sum'], 12), cs(p['cell']), 'all enclose 0' if ok else 'FAIL', wr))
open('tables.md', 'w').write('\n'.join(out) + '\n')
print('\n'.join(out))
