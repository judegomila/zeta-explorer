# builds the plain-text tables of RESULT.md from out_server/*.json  (python summarize.py [dir] > out/summary.txt)
import json, os, sys, math

D = sys.argv[1] if len(sys.argv) > 1 else 'out_server'


def load(f):
    p = os.path.join(D, f)
    return json.load(open(p)) if os.path.exists(p) else None


def runs_s(runs, lim=6):
    return ' '.join('%s[%.4g,%.4g]' % ('+' if r[0] > 0 else ('-' if r[0] < 0 else '?'), r[1], r[2]) for r in runs[:lim]) + (' ...' if len(runs) > lim else '')


def pat(c):
    """sign pattern string of a condition record: e.g. '+', '-', '-+' with the positions of the changes."""
    return ''.join('+' if r[0] > 0 else ('-' if r[0] < 0 else '?') for r in c['runs']) + ('...' if c['nruns'] > len(c['runs']) else '')


for fn, title in (('shape_light.json', 'SHAPE (light pass)'), ('shape_heavy.json', 'SHAPE (heavy pass)')):
    d = load(fn)
    if not d:
        continue
    print('==== %s: umax %.2f prec %d' % (title, d['umax'], d['prec']))
    ks = d['kernels']
    conds = list(ks['zeta']['conds'].keys())
    zp = {c: pat(ks['zeta']['conds'][c]) for c in conds}
    print('kernel      npts  ' + ' '.join('%-6s' % c for c in conds))
    for nm, o in ks.items():
        print('%-10s %6d  ' % (nm, o['npts']) + ' '.join('%-6s' % pat(o['conds'][c])[:6] for c in conds))
    print('-- conditions where the sign pattern differs from zeta (pattern, then runs):')
    for nm, o in ks.items():
        if nm == 'zeta':
            continue
        diff = [c for c in conds if pat(o['conds'][c]) != zp[c]]
        print('%-10s differs at: %s' % (nm, ', '.join(diff) if diff else 'none'))
        for c in diff:
            print('      %-3s %s  (undet %d)' % (c, runs_s(o['conds'][c]['runs']), o['conds'][c]['undet']))
    print('-- zeta runs:')
    for c in conds:
        print('      %-3s %s  (undet %d)' % (c, runs_s(ks['zeta']['conds'][c]['runs']), ks['zeta']['conds'][c]['undet']))
    print('-- undetermined totals:', {nm: sum(o['conds'][c]['undet'] for c in conds) for nm, o in ks.items()})
    print()

d = load('mom.json')
if d:
    print('==== MOMENTS  r(tau) = M2/M0, x_c = sqrt(2/r)  (2/169 = %.9f)' % (2/169))
    for r in d:
        print('%-10s minsign %2d  r(0) %s  r(1/2) %s  below %s  x_c(0) %.4f  x_c(1/2) %.4f' % (
            r['kernel'], r['min_sign'], r['tau0']['M2_over_M0'][1:14], r['tau0.5']['M2_over_M0'][1:14], r['tau0.5']['below_2_over_169'], r['tau0']['x_c'], r['tau0.5']['x_c']))
    print()

d = load('gram.json')
if d:
    print('==== GRAM / SCAN')
    sc = [r for r in d if r.get('mode') == 'scan' and 'error' not in r]
    gr = [r for r in d if r.get('mode') == 'gram' and 'error' not in r]
    er = [r for r in d if 'error' in r]
    print('errors:', er)
    print('-- scans: kernel t xmax | first sign change of H | first x with D<0 | number of negative intervals | first intervals | undet')
    for r in sorted(sc, key=lambda r: (r['kernel'], float(r['t']), r['xmax'])):
        print('%-10s t=%-5s xmax %-6g | H0 %-8s | Dneg %-8s | n %-4d | %s | undet %d | %.0fs' % (
            r['kernel'], r['t'], r['xmax'], r['first_H_sign_change_x'], r['first_D_negative_x'], r['n_D_negative_intervals'],
            ' '.join('[%.2f,%.2f]' % (a[1], a[2]) for a in r['D_negative_intervals'][:5]), r['D_undetermined'], r['seconds']))
    print('-- gram: kernel t | per (hu_inv, r): x_N, n reached, first negative pivot size (n* hv), negatives, certified')
    keys = sorted(set((r['kernel'], r['t']) for r in gr), key=lambda k: (k[0], float(k[1])))
    for k in keys:
        rows = sorted([r for r in gr if (r['kernel'], r['t']) == k], key=lambda r: r['xN'])
        s = []
        for r in rows:
            fn = r['first_negative_pivot_size']
            s.append('xN=%.0f n=%d: %s' % (r['xN'], r['n_reached'], ('PD' if fn is None else 'n*=%d (n*hv=%.2f, neg=%d, cert=%s)' % (
                fn, fn*r['hv'], r['negative_pivots'], r['certificate']['certified_negative'] if r['certificate'] else None)) + ('' if not r.get('zero_pivot') else ' ZERO-PIVOT')))
        print('%-10s t=%-5s ' % k + ' | '.join(s))
    print('max seconds gram', max(r['seconds'] for r in gr) if gr else None)
    print()

d = load('expfam.json')
if d:
    print('==== EXPONENTIAL FAMILY / FISHER BOUND')
    xs = ['0.02', '0.1', '0.3', '0.5', '1', '2', '10', '100', '1000', '10000']
    print('kernel     E1 E2 E3 | y*(x) at x = ' + ', '.join(xs) + ' | violations / grid points | min(ReZ - B)')
    for k, v in d.items():
        if 'real' not in v:
            continue
        r = v['real']
        if 'error' in r:
            print(k, r); continue
        row = {x['x']: x for x in v['reach'] if 'x' in x}
        s = lambda rr: ''.join('+' if a[0] > 0 else ('-' if a[0] < 0 else '?') for a in rr)
        ys = ' '.join(('%.4g' % row[x]['ystar']) if x in row and row[x].get('ystar') else '-' for x in xs)
        vi = sum(x.get('violations', 0) for x in v['reach']); gp = sum(x.get('grid_points', 0) for x in v['reach'])
        mn = min([x['min_ReZ_minus_B'] for x in v['reach'] if x.get('min_ReZ_minus_B') is not None], default=None)
        errs = [x for x in v['reach'] if 'error' in x or 'note' in x]
        print('%-10s %s %s %s | %s | %d / %d | %s %s' % (k, s(r['E1_p_pos']), s(r['E2_var_pos']), s(r['E3_p_over_a_decreasing']), ys, vi, gp, mn,
                                                     ('notes: %d' % len(errs)) if errs else ''))
    print()

for fn in ('pick8.json', 'pick24.json'):
    d = load(fn)
    if not d:
        continue
    print('==== PICK (%s) order %s prec %d pool %d' % (fn, d.get('order', 8), d['prec'], d['pool']))
    for k, r in d['kernels'].items():
        O = len(r['pos']) - 1
        ff = r['first_negative_pivot_order']
        firstneg = next((m for m in range(1, O + 1) if r['neg'][m] > 0), None)
        print('%-10s tuples %d  first order with a negative determinant: %s  neg counts by order %s  und %d  example %s' % (
            k, r['tuples'], firstneg, r['neg'][1:], sum(r['und']), (r['example'][0], [round(v, 3) for v in r['example'][1]]) if r['example'] else None))
    print()

d = load('colloc.json')
if d:
    print('==== COLLOCATION determinants (fraction of tuples with sign +; undetermined count)')
    keys = ['A%d' % m for m in range(2, 9)] + ['B%d' % m for m in range(2, 9)]
    print('kernel     ' + ' '.join('%-8s' % k for k in keys))
    for nm, r in d['kernels'].items():
        tot = sum(r['A2'])
        print('%-10s ' % nm + ' '.join('%-8s' % ('%.5f' % (r[k][0]/max(1, r[k][0] + r[k][1]))) for k in keys) + '  und %d  tuples %d' % (sum(r[k][2] for k in keys), tot))
    print()

d = load('schw.json')
if d:
    print('==== SCHWARZIAN (4-node criterion) on x in [0.01, 100]')
    for nm, o in d['kernels'].items():
        if isinstance(o, str):
            print(nm, o); continue
        print('%-10s S_h %s | S_j %s | h %s | h\' %s' % (nm, runs_s(o['S_h']), runs_s(o['S_j']), runs_s(o['h']), runs_s(o['hprime'])))
    print()

d = load('trunc.json')
if d:
    print('==== TRUNCATED KERNELS')
    print('repo kernel replay:', [(r['N'], round(r['u0'], 5), round(r['margin_u1star_minus_u0'], 4)) for r in d['repo_kernel']])
    print('canonical: N, sign changes, x0, N x0, u0, u0 + (1/4) ln N')
    for r in d['zeta_canonical']:
        if r['N'] in (1, 2, 3, 5, 10, 20, 50, 100, 256, 512, 1000, 2048, 4096, 8192, 10000):
            print('  %6d  %s  %s  %s  %s  %s' % (r['N'], r.get('sign_changes'), ('%.10g' % r['x0']) if 'x0' in r else None, ('%.8f' % r['N_x0']) if 'N_x0' in r else None,
                                         ('%.6f' % r['u0']) if 'u0' in r else None, ('%.6f' % r['u0_plus_quarter_logN']) if 'u0_plus_quarter_logN' in r else None))
    sc = [r.get('sign_changes') for r in d['zeta_canonical'] if 'sign_changes' in r]
    print('sign-change counts for N <= 256:', sorted(set(sc)), 'N values', len(sc), '; N reached', max(r['N'] for r in d['zeta_canonical'] if 'x0' in r))
    print('controls: kernel: N -> (sign at u=0, number of sign changes on u>0, largest zero u)')
    for c in sorted(d['controls'], key=lambda c: c['kernel']):
        bad = [(r['N'], r['sign_at_u0'], r['sign_changes_u_gt_0'], None if r['largest_zero_u'] is None else round(r['largest_zero_u'], 3)) for r in c['rows'] if r['sign_changes_u_gt_0'] or r['sign_at_u0'] <= 0]
        print('  %-10s %s' % (c['kernel'], 'no zero on u>0 for N in %s' % [r['N'] for r in c['rows']] if not bad else 'zeros on u>0: %s' % bad))
    print()

d = load('ode.json')
if d:
    print('==== ODE closure')
    print('system residuals:', [(r['u'], r['residual_c_equation'], r['v_minus_closed_form'], r['c_minus_closed_form']) for r in d['system_residual']])
    ks = sorted(set(r['kernel'] for r in d['nullity']))
    Ds = sorted(set(r['D'] for r in d['nullity']))
    print('nullity by degree D = %s ; (gap: smallest independent pivot log2 / threshold)' % Ds)
    for k in ks:
        row = {r['D']: r for r in d['nullity'] if r['kernel'] == k}
        print('  %-10s ' % k + ' '.join(('%d' % row[D_]['nullity']) if D_ in row else '.' for D_ in Ds) +
              '   gaps: ' + ' '.join('%s/%s' % (row[D_]['smallest_independent_pivot_log2'], row[D_]['threshold_log2']) for D_ in Ds if D_ in row and D_ >= 6))
