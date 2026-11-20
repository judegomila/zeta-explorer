# Summary numbers for combination 2 (reads server outputs; no heavy computation).
import json, math, glob, numpy as np
out = {}
# (i) DH: number of eigenvalues above 1 against the off-line zero table of c12-control-battery-harness (84 pairs below 2000)
zt = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
off = sorted((float(z[1]), float(z[0])) for z in zt['offline'])
def count_rows(fn, a):
    d = json.load(open(fn)); rows = []
    poles = [g for g, b in off if b > 0.5 + a]
    for w in d['windows']:
        k = w.get('n_eig_gt_1+tol', 0)
        if 0 < k <= len(poles) - 1:
            T = poles[k - 1]                      # height of the k-th pole
            rows.append({'l': w['l'], 'L2': math.exp(2*w['l']), 'n_eig_gt_1': k, 'height_of_kth_pole': T, 'L2/(5 T/2pi)': math.exp(2*w['l'])/(5*T/(2*math.pi))})
    return rows, len(poles)
for fn, a in (('out_server/c2_DH_l4_h0.002.json', 0.25), ('out_server/c2_DH_l4_h0.004_a0.05.json', 0.05), ('out_server/c2_DH_l7_h0.004_c0.75.json', 0.25)):
    try:
        rows, npol = count_rows(fn, a)
    except FileNotFoundError:
        continue
    if rows:
        X = np.array([math.log(r['height_of_kth_pole']) for r in rows]); Y = np.array([2*r['l'] for r in rows])
        c = np.polyfit(X, Y, 1)
        out['DH count law ' + fn.split('/')[-1]] = {'a': a, 'poles_in_table': npol, 'rows': rows, 'fit 2l = c1 log T_k + c0': [float(c[0]), float(c[1])]}
# (ii) twins: lowest listed pole as predictor (no assignment by frequency)
for a in (0.05, 0.25):
    r = json.load(open('out_server/c2_twins_a%g.json' % a))
    tw = [x for x in r if x['key'].startswith('q')]
    X = []; Y = []; B = []; rat = []; rat_in = []
    for x in tw:
        zs = sorted([z for z in (x['zeros'] or []) if z[0] > 0.5 + a], key=lambda z: z[1])
        if x['l_star'] is None or not zs: continue
        g = zs[0][1]; X.append(math.log(x['q']*g/(2*math.pi))); Y.append(2*x['l_star']); B.append(zs[0][0])
        rat.append(math.exp(2*x['l_star'])/math.sqrt(x['q']*g/(2*math.pi)))
        if max(z[0] for z in zs) < 1.0 and not x.get('real_zeros'): rat_in.append(rat[-1])
    X = np.array(X); Y = np.array(Y); c = np.polyfit(X, Y, 1)
    on = [x for x in tw if x['l_star'] is not None]
    out['twins a=%g' % a] = {'n': len(tw), 'n_onset': len(on), 'n_no_onset': len(tw) - len(on),
        'n_no_onset_with_listed_offline_zero_any_beta': sum(1 for x in tw if x['l_star'] is None and x['zeros']),
        'n_with_listed_pole': sum(1 for x in tw if [z for z in (x['zeros'] or []) if z[0] > 0.5 + a]),
        'n_with_listed_pole_and_onset': len(X),
        'lowest-listed-pole fit 2l* = c1 log(q g/2pi) + c0': [float(c[0]), float(c[1])], 'rms': float(np.sqrt(np.mean((Y - np.polyval(c, X))**2))), 'corr': float(np.corrcoef(X, Y)[0, 1]),
        'L*^2/sqrt(q g/2pi) quantiles (0,10,50,90,100)%': [float(np.quantile(rat, p)) for p in (0, .1, .5, .9, 1)],
        'same, twins whose listed zeros all have beta<1 and no listed real zero: n': len(rat_in),
        'same, quantiles': [float(np.quantile(rat_in, p)) for p in (0, .1, .5, .9, 1)] if rat_in else None,
        'same, n with ratio < 1': int(np.sum(np.array(rat_in) < 1)),
        'l*_min': min(x['l_star'] for x in on), 'l*_max': max(x['l_star'] for x in on),
        'max_excess_among_no_onset': max(x['max_excess'] for x in tw if x['l_star'] is None),
        'comparison objects': {x['key']: [x['l_star'], x['max_excess']] for x in r if not x['key'].startswith('q')}}
# (iii) single-object table
tab = []
for f in sorted(glob.glob('out_server/c2_*.json')):
    if 'twins' in f: continue
    d = json.load(open(f)); w = d['windows']
    noise = 1e-7 if d['cshift'] <= 2 else 1e-3
    first = next((x['l'] for x in w if x['norm_minus_1'] > noise), None)
    prev = max([x['l'] for x in w if first is not None and x['l'] < first], default=None)
    tab.append({'run': f.split('/')[-1][3:-5], 'a': d['a'], 'cshift': d['cshift'], 'h': d['h'], 'lmax': d['l'], 'N': d['N'], 'onset_bracket': [prev, first],
                'norm_minus_1_at_lmax': w[-1]['norm_minus_1'], 'n_eig_gt_1_at_lmax': w[-1].get('n_eig_gt_1+tol'), 'top_freq_at_lmax': w[-1].get('top_eigfn_freq'),
                'max_abs_norm_minus_1_from_l=1_when_no_onset': (max(abs(x['norm_minus_1']) for x in w if x['l'] >= 1.0) if first is None else None)})
out['runs'] = tab
json.dump(out, open('out/summary_c2.json', 'w'), indent=1)
for k, v in out.items():
    if k == 'runs':
        for t in v: print(t)
    else: print(k, json.dumps(v)[:1800])
