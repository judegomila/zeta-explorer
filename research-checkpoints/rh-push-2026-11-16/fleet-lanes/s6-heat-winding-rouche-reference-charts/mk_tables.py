"""Markdown tables from the per-height summaries sum_X*.json -> tables.md"""
import json, glob, sys
R = []
for fn in glob.glob('sum_X*.json'): R += json.load(open(fn))
Xs = sorted(set(r['X'] for r in R))
D = {(r['kind'], round(r['t'], 7), r['X']): r for r in R}
def xs(X): return ('%.0e' % X).replace('e+0', 'e').replace('e+', 'e')
def fmt(v, nd=4):
    if v is None: return '-'
    if v == 1: return '1'
    if v == 0: return '0'
    return ('%.' + str(nd) + 'f') % v
out = []
def table(title, rows, getter, nd=4):
    out.append('\n### ' + title + '\n'); out.append('| row | ' + ' | '.join(xs(X) for X in Xs) + ' |'); out.append('|---|' + '---|' * len(Xs))
    for label, key in rows:
        vals = []
        for X in Xs:
            r = D.get((key[0], round(key[1], 7), X))
            try: vals.append(fmt(getter(r, key), nd) if r is not None else ' ')
            except KeyError: vals.append(' ')
        out.append('| ' + label + ' | ' + ' | '.join(vals) + ' |')
TS = 0.1262875
# ---- test 1
def g1(field):
    return lambda r, key: r['t1'][key[2]][field] if not isinstance(r['t1'][key[2]].get(field), list) else None
for y0 in (0.1809, 0.03):
    rows = []
    for t in (0, 0.05, 0.16):
        for ref in ('B0', 'P13', 'P97', 'P1000'): rows.append(('ZETA t=%g %s' % (t, ref), ('ZETA', t, '%s|y0=%g' % (ref, y0))))
    for k in ('CHI4', 'CHI5'):
        for t in (0, 0.05, 0.16):
            for ref in ('P97', 'P1000'): rows.append(('%s t=%g %s' % (k, t, ref), (k, t, '%s|y0=%g' % (ref, y0))))
    table('Test 1. Fraction of boxes [x, x+1] x [%g, 1] with margin 1 - sup |f E_P - 1| > 0: zeta and L(chi)' % y0, rows, g1('frac_certified'))
    table('Test 1. Smallest margin over the boxes, y0 = %g: zeta and L(chi)' % y0, rows, lambda r, key: r['t1'][key[2]]['margin_q'][0], 3)
    table('Test 1. Median margin over the boxes, y0 = %g: zeta and L(chi)' % y0, rows, lambda r, key: r['t1'][key[2]]['margin_q'][2], 3)
    rows = [('EA t=0 P1000', ('EA', 0, 'P1000|y0=%g' % y0))]
    for k, refs in (('TNR1000003', ('oP1000', 'zP1000')), ('TNR3', ('oP1000', 'zP1000')), ('DH', ('cP1000', 'aP1000', 'cP97', 'aP97')), ('SGN', ('P97', 'P1000')), ('U', ('P97', 'P1000'))):
        for t in (0, 0.05, 0.16):
            for ref in refs: rows.append(('%s t=%g %s' % (k, t, ref), (k, t, '%s|y0=%g' % (ref, y0))))
    for t in (-0.1, -0.05, 0.06):
        for ref in ('P97', 'P1000'): rows.append(('HEAT (zeta at t=%g) %s' % (t, ref), ('ZETA', t, '%s|y0=%g' % (ref, y0))))
    table('Test 1. Fraction of boxes with positive margin, y0 = %g: controls with their references (o = own factors, z = zeta-type factor, c = combination of the two Euler products, a = formal a(p) factors)' % y0, rows, g1('frac_certified'))
    table('Test 1. The same fraction restricted to boxes farther than 5 from every box with non-zero winding of f (y >= 0.03), y0 = %g' % y0, rows, g1('frac_certified_far'))
    table('Test 1. Number of such far boxes, y0 = %g' % y0, rows, lambda r, key: float(r['t1'][key[2]]['n_far']), 0)
    table('Test 1. Fraction of certified boxes among boxes with non-zero winding of f, y0 = %g' % y0, rows, g1('frac_certified_zero_boxes'))
rows = []
for t in (0, 0.05, 0.16):
    for ref in ('P97', 'P1000'):
        for y0 in (0.03, 0.1809): rows.append(('ZETA t=%g %s y0=%g' % (t, ref, y0), ('ZETA', t, '%s|y0=%g' % (ref, y0))))
table('Test 1. Median over certified boxes of sup |d(f E_P)/dx| / margin on the bottom edge (panels per unit x); compare rho', rows, lambda r, key: r['t1'][key[2]]['panels_per_unit_x_q'][1], 1)
# ---- winding (tests 1 and 4)
rows = []
for k, ts in (('ZETA', (-0.1, -0.05, 0, TS - 0.1, 0.05, 0.06, 0.1, TS, 0.16, 0.2, 0.3, 0.5)), ('CHI4', (0, 0.05, TS, 0.16)), ('CHI5', (0, 0.05, TS, 0.16)), ('DH', (0, 0.05, 0.1, TS, 0.16, 0.2, 0.3, 0.5)),
              ('TNR3', (0, 0.05, 0.1, TS, 0.16, 0.2, 0.3, 0.5)), ('TNR1000003', (0, 0.05, TS, 0.16)), ('EA', (0,)), ('SGN', (0, 0.05, TS, 0.16)), ('U', (0, 0.05, TS, 0.16))):
    for t in ts: rows.append(('%s t=%g' % (k, t), (k, t)))
table('Tests 1 and 4. Zeros of f in [x, x+1] x [0.03, 1] per box (sum of winding numbers / number of boxes)', rows, lambda r, key: r['wind']['0.03-1']['total'] / r['boxes'], 5)
table('Tests 1 and 4. The same for [x, x+1] x [0.1809, 1]', rows, lambda r, key: r['wind']['0.1809-1']['total'] / r['boxes'], 5)
table('Fraction of boxes whose winding count used a phase step above 2.6 (count not reliable), y in [0.03, 1]', rows, lambda r, key: r['wind']['0.03-1']['frac_step_gt_2p6'], 5)
table('Number of boxes', rows, lambda r, key: float(r['boxes']), 0)
# ---- test 2
for d in (0.02, 0.1, 0.25):
    rows = []
    for k, refs in (('ZETA', ('B0', 'P2', 'P13', 'P97', 'P1000')), ('CHI4', ('P13', 'P97', 'P1000')), ('CHI5', ('P13', 'P97', 'P1000')), ('EA', ('P97', 'P1000')), ('TNR1000003', ('oP1000', 'zP1000')), ('TNR3', ('oP1000', 'zP1000')),
                    ('DH', ('cP13', 'cP97', 'cP1000', 'aP1000')), ('SGN', ('P97', 'P1000')), ('U', ('P97', 'P1000'))):
        for ref in refs: rows.append(('%s %s' % (k, ref), (k, 0, '%s|d=%g' % (ref, d))))
    table('Test 2. Fraction of charts (width 1 in Im s) on Re s = 1/2 + %g with sup |F - Q| < inf |Q| (t = 0)' % d, rows, lambda r, key: r['t2'][key[2]]['frac_certified'])
    table('Test 2. Fraction of charts with |F/Q - 1| < 1 at every chart point, Re s = 1/2 + %g' % d, rows, lambda r, key: r['t2'][key[2]]['frac_pointwise'])
    table('Test 2. Median residual sup |F - Q| / median floor inf |Q|, Re s = 1/2 + %g' % d, rows, lambda r, key: r['t2'][key[2]]['residual_q'][1] / r['t2'][key[2]]['floor_q'][1], 3)
    table('Test 2. Certified fraction among charts farther than 5 boxes from every box with non-zero winding (y >= 0.03), Re s = 1/2 + %g' % d, rows, lambda r, key: r['t2'][key[2]]['frac_certified_far_from_zero_boxes'])
# ---- test 3
for t in (TS, 0.16):
    for ys in ('0.03', '0.1', '0.165', '0.1809', '0.28', '0.44'):
        rows = [('%s' % k, (k, tt, 'y*=' + ys)) for k, tt in (('ZETA', t), ('CHI4', t), ('CHI5', t), ('DH', t), ('TNR3', t), ('TNR1000003', t), ('SGN', t), ('U', t), ('ZETA', t - 0.1))]
        rows[-1] = ('HEAT (zeta at t=%g)' % (t - 0.1), rows[-1][1])
        table('Test 3. t = %g, y* = %s: fraction of boxes with |f - 1| < 1 on the slice y* <= v <= 0.8645 (reference B_0)' % (t, ys), rows, lambda r, key: r['t3'][key[2]]['frac_hold'], 5)
        table('Test 3. t = %g, y* = %s: fraction with |A/B| < 1 and B != 0 on the slice (reference B = full direct ladder)' % (t, ys), rows, lambda r, key: r['t3'][key[2]]['frac_hold_B'], 5)
        table('Test 3. t = %g, y* = %s: largest sup |f - 1| over the boxes' % (t, ys), rows, lambda r, key: r['t3'][key[2]]['sup_q'][2], 3)
    rows = [('%s' % k, (k, tt)) for k, tt in (('ZETA', t), ('CHI4', t), ('CHI5', t), ('DH', t), ('SGN', t), ('U', t), ('ZETA', t - 0.1))]
    table('Test 3. t = %g: zeros of B (direct ladder) per box in [0.165, 0.8645]' % t, rows, lambda r, key: r['t3']['windD']['0.165-0.8645']['total'] / r['boxes'], 5)
    table('Test 3. t = %g: fraction of boxes where |A/B| < 1 holds on the slice [0.165, 0.8645] and f has a zero in the box' % t, rows, lambda r, key: r['t3']['B_hold_but_f_zero(0.165-0.8645)'], 5)
    table('Test 3. t = %g: fraction of boxes where |A/B| < 1 holds on the slice and B has a zero in the box' % t, rows, lambda r, key: r['t3']['B_hold_and_B_zero'], 5)
open('tables.md', 'w').write('# Tables, lane s6-heat-winding-rouche-reference-charts (generated by mk_tables.py from sum_X*.json)\n\nColumns: X (start of the strip of boxes). Blank = not run. All values MEASURED on the two-ladder approximant (float64).\n' + '\n'.join(out) + '\n')
print(len(out), 'lines')
