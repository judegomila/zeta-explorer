# tables for RESULT.md from the server outputs in out_server/
import json, math, sys, os
import numpy as np
D = sys.argv[1] if len(sys.argv) > 1 else 'out_server'
def load(n):
    p = os.path.join(D, n)
    return json.load(open(p)) if os.path.exists(p) else None

print('=== combination 1: Nystrom norm ===')
g = load('c1_gpu.json'); ab = load('c1_arb.json')
arb_ = {r['key']: r for r in ab} if ab else {}
if g:
    print('unimodular check', g['unimodular'])
    print('%-18s %-7s %-14s %-14s %-14s %-12s %-12s | exponent d log norm/da at a = 0.5, 1, 2, 5, 10, 20, 30, 40, 60' % ('key', 'n', 'a*(n max)', 'a*(n/2)', 'a*(n/4)', 'a_G (ball)', 'a_L (ball)'))
    for r in g['recs']:
        if 'error' in r: print(r['key'], r['error']); continue
        ns = sorted(int(k) for k in r['sizes'])
        S = r['sizes']
        top = S[str(ns[-1])]
        a = arb_.get(r['key'], {})
        ex = top.get('exponent', {})
        print('%-18s %-7d %-14s %-14s %-14s %-12s %-12s | %s' % (r['key'], top['n'], '%.9f' % top['a_star'] if top['a_star'] else None,
              '%.9f' % S[str(ns[-2])]['a_star'] if len(ns) > 1 and S[str(ns[-2])]['a_star'] else None,
              '%.9f' % S[str(ns[-3])]['a_star'] if len(ns) > 2 and S[str(ns[-3])]['a_star'] else None,
              '%.7f' % a['a_G'] if a.get('a_G') else None, '%.7f' % a['a_L'] if a.get('a_L') else None,
              ' '.join('%.4f' % ex[k] for k in sorted(ex, key=float))))
    print('norm/G at a = 0.001, 0.1, 1, 10, 30, 60 and log10 norm at the same a (largest n)')
    for r in g['recs']:
        if 'error' in r: continue
        ns = sorted(int(k) for k in r['sizes']); top = r['sizes'][str(ns[-1])]['grid']
        ks = ['0.001', '0.1', '1.0', '10.0', '30.0', '60.0']
        print('%-18s %s | %s' % (r['key'], ' '.join('%.6f' % top[k]['ratio_norm_G'] for k in ks), ' '.join('%.3f' % (top[k]['lognorm']/math.log(10)) for k in ks)))
    for r in g['recs']:
        if 'error' in r: continue
        if '2048' in r['sizes'] and 'full_svd' in r['sizes']['2048'] and r['key'] in ('zeta', 'DH', 'chi-4', 'NR(1000003,2.2)'):
            print('sv ratios', r['key'], {k: ['%.3g' % z for z in v] for k, v in r['sizes']['2048']['full_svd'].items()})
if ab:
    print('ball brackets'); 
    for r in ab: print('  %-18s a_G %.9f a_L %s  G<1 below: %s  L>1 above: %s' % (r['key'], r['a_G'], r.get('a_L'), r.get('G_below_lt1'), r.get('L_above_gt1')))

print('\n=== combination 2: shear angle ===')
c2 = load('c2.json')
if c2:
    fam = sorted(c2['family'], key=lambda z: z['c'])
    cs = np.array([f['c'] for f in fam]); TH = np.array([f['theta'] for f in fam]); LS = np.array([f['log10sin'] for f in fam])
    cur = {r['key']: r for r in c2['curves']}
    idx = [0, 1, 3, 10, 33, 67, 100, 200]
    print('a values:', [cur['zeta']['a'][i] for i in idx])
    print('%-18s %-52s %-10s %-9s %-11s %-11s %-9s %-6s' % ('key', 'theta(a) at the a values; last two as log10 sin', 'log10sin60', 'best c', 'res theta', 'res log10sin', '2nd size', 'bits'))
    rows = {}
    for k, r in cur.items():
        th = np.array(r['theta']); ls = np.array(r['log10sin'])
        # best c: minimise sup |theta - theta_c| with linear interpolation in c
        best = (1e9, None)
        for i in range(len(cs) - 1):
            for lam in np.linspace(0, 1, 9)[:-1]:
                tc = (1 - lam)*TH[i] + lam*TH[i + 1]
                e = np.abs(th - tc).max()
                if e < best[0]:
                    best = (e, cs[i] + lam*(cs[i + 1] - cs[i]), np.abs(ls - ((1 - lam)*LS[i] + lam*LS[i + 1])).max())
        rows[k] = best
        print('%-18s %-52s %-10.3f %-9.4f %-11.3e %-11.3e %-9.1f %-6d' % (k, ' '.join('%.5f' % th[i] for i in idx[:6]), ls[200], best[1], best[0], best[2], r['second_size']['max_rel_diff_log10'], r['min_rel_bits']))
    print('theta(0) to 50 digits: zeta', cur['zeta']['theta0_str'])
    print('gauge0.3 - zeta max |dtheta|:', np.abs(np.array(cur['gauge0.3']['theta']) - np.array(cur['zeta']['theta'])).max())
    z = np.array(cur['zeta']['theta'])
    print('heat family: theta_tau - theta_zeta at a = 0, 0.9, 3, 9.9, 20.1, 30; and residual after best shift')
    for k in sorted([k for k in cur if k.startswith('heat')], key=lambda s: float(s[4:])):
        d = np.array(cur[k]['theta']) - z
        print('  %-10s %s | res %.3e at c = %.4f' % (k, ' '.join('%+.3e' % d[i] for i in idx[:7]), rows[k][0], rows[k][1]))

print('\n=== combination 3: Perron locus ===')
c3 = load('c3.json')
if c3:
    m = {r['key']: r for r in c3}
    degs = ['2', '4', '8', '12', '20', '30', '40', '50', '60']
    print('%-18s %s | a1*DEG at 40, 50, 60 | all certified' % ('key', ' '.join('%-11s' % ('DEG=' + d) for d in degs)))
    for k, r in m.items():
        ok = all(v['below_lt1'] and v['above_gt1'] and v['positive'] for v in r['deg'].values())
        print('%-18s %s | %.4f %.4f %.4f | %s prec %d' % (k, ' '.join('%-11.8f' % r['deg'][d]['a1'] for d in degs), 40*r['deg']['40']['a1'], 50*r['deg']['50']['a1'], 60*r['deg']['60']['a1'], ok, r['prec']))
    print('ratios a1(F)/a1(reference) at DEG = 4, 12, 30, 60')
    for k, ref in [('zeta', 'zeta_lead'), ('chi-4', 'lead(4,1)'), ('chi5', 'lead(5,0)'), ('DH', 'lead(5,1)'), ('DH', 'DH_lead'), ('DH', 'chi5'), ('DH', 'chi-4'), ('gauge0.3', 'zeta'), ('heat-0.5', 'zeta'), ('heat0.5', 'zeta'), ('heat-0.05', 'zeta'), ('heat0.05', 'zeta'), ('E_b=0.25', 'zeta'), ('E_b=0.125', 'E_b=0.25'), ('NR(3,2.2)', 'NR(3,1.9)'), ('NR(1000003,2.2)', 'NR(1000003,1.9)'), ('liouville', 'zeta'), ('chi-3', 'zeta'), ('chi-7', 'zeta'), ('chi8', 'zeta')]:
        if k in m and ref in m:
            print('  %-18s / %-16s %s' % (k, ref, ' '.join('%.6f' % (m[k]['deg'][d]['a1']/m[ref]['deg'][d]['a1']) for d in ('4', '12', '30', '60'))))
    print('gap norm - max diag at a1 (DEG 4, 12, 30, 60), norm at a = 0.5, 1, 3 (DEG 60)')
    for k, r in m.items():
        print('  %-18s %s | %s' % (k, ' '.join('%.4f' % r['deg'][d]['gap'] for d in ('4', '12', '30', '60')), ' '.join(r['fixed_a_cert'][a]['60']['norm'][:14] for a in ('0.5', '1.0', '3.0'))))
    print('flat (source object) norm at s = 3, DEG 4:', m['flat']['fixed_a_cert']['3.0']['4'] if 'flat' in m else None)

print('\n=== combination 4: Hankel determinants ===')
c4 = load('c4.json')
if c4:
    print('synthetic', c4['synthetic'])
    for r in c4['recs']:
        s0 = r['sq']['shift0']; s1 = r['sq']['shift1']; l0 = r.get('lin', {}).get('shift0', {}); l1 = r.get('lin', {}).get('shift1', {})
        print('%-18s mode %-4s Phi sign change %-5s c>0 %-5s | sq: first neg %s/%s undecided %s/%s | lin: first neg %s/%s undecided %s/%s | log10|D_40| %s log10|D_80| %s  %s' % (
            r['key'], r['mode'], r['kernel_sign_changes_on_window'], r['c_sq_positive'], s0['first_negative_order'], s1['first_negative_order'], s0['first_undecided_order'], s1['first_undecided_order'],
            l0.get('first_negative_order'), l1.get('first_negative_order'), l0.get('first_undecided_order'), l1.get('first_undecided_order'),
            '%.0f' % s0['log10_abs_D'][39] if len(s0['log10_abs_D']) > 39 and s0['log10_abs_D'][39] else None, '%.0f' % s0['log10_abs_D'][-1] if s0['log10_abs_D'][-1] else None, r.get('M_one_sided', '')))
