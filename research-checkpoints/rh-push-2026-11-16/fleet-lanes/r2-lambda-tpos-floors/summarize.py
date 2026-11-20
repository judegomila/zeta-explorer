import json, numpy as np
rows = sorted(sum((json.load(open('lp50_part%d.json' % p)) for p in range(3)), []), key=lambda r: r['k'])
json.dump(rows, open('lp50.json', 'w'))
print('  k      t       y     h_F2  ell_F2 ellJ_mod | E_F2   E_mF2  hge+   free+  sgn3   sgn50  ceil | ratios to E_F2: mF2 hge+ free+ sgn3 sgn50 | W free+ sgn3 | viol')
keys = ['hge_pos', 'free_pos', 'free_signed3', 'free_signed']
def adj(d): return d['E']*(1 + min(d['viol'], 0)*2)     # crude rescale for grid violation
R = {k: [] for k in ['m'] + keys}
for r in rows:
    E0 = r['E_F2']; vals = [adj(r[k]) for k in keys]
    for k, v in zip(keys, vals): R[k].append(v/E0)
    R['m'].append(r['f2model']['E_model']/E0)
    print('%6d %.5f %.4f %.3f %.4f %.4f | %.3f %.3f %.3f %.3f %.3f %.3f %.3f | %.3f %.3f %.3f %.3f %.3f | %.3f %.3f | %.0e' % (
        r['k'], r['t'], r['y'], r['h_F2'], r['ell_F2'], r['f2model']['ell_joint'], E0, r['f2model']['E_model'], *vals, r['ceiling'],
        r['f2model']['E_model']/E0, *[v/E0 for v in vals], r['free_pos']['W'], r['free_signed3']['W'], min(r[k]['viol'] for k in keys)))
for k in R: print(k, 'ratio to E_F2: min %.3f median %.3f mean %.3f max %.3f' % (min(R[k]), np.median(R[k]), np.mean(R[k]), max(R[k])))
print('ratio to model-F2: ', {k: round(float(np.median(np.array(R[k])/np.array(R['m']))), 4) for k in keys})
print('lam_neg total', sum(r['lam_neg'] for r in rows if r['t'] > 0), ' min lam_min (t>0)', min(r['lam_min'] for r in rows if r['t'] > 0))
json.dump({'k': [r['k'] for r in rows], **{k: R[k] for k in R}}, open('gain_ratios.json', 'w'))
