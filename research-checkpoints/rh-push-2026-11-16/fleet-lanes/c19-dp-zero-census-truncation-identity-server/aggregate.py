# Aggregates resBC_*.jsonl into tables (Run B) and z-scores (Run C). Pure post-processing.
import json, sys, math, glob
import numpy as np
rows = []
for f in sorted(glob.glob('resBC_*.jsonl')):
    rows += [json.loads(l) for l in open(f)]
cells = sorted({(r['t'], r['theta']) for r in rows})
HELD = {3e5, 3e7}
out = {'n_jobs': len(rows), 'incomplete': [(r['t'], r['theta'], r['cls'], r['kind'], r['idx'], r['w'], r['n_ext'], r['wind_ext']) for r in rows if not r['complete']],
       'max_abs_resid_complete': max(abs(r['resid']) for r in rows if r['complete']),
       'n_resid_gt_1e-4': sum(1 for r in rows if r['complete'] and abs(r['resid']) > 1e-4),
       'frac_absSminusL_le_0.05': float(np.mean([abs(r['S'] - r['L']) <= 0.05 for r in rows])),
       'max_abs_S_minus_L': max(abs(r['S'] - r['L']) for r in rows), 'cells': []}
def sel(t, th, cls, kind): return [r for r in rows if r['t'] == t and r['theta'] == th and r['cls'] == cls and r['kind'] == kind]
def zfun(ens, stat):
    pts = [(math.log(r['N_R']), math.log(r['C'][stat])) for r in ens if r['C']]
    if len(pts) < 6: return None
    x = np.array([p[0] for p in pts]); y = np.array([p[1] for p in pts])
    if x.std() < 1e-9: sl, ic = 0.0, y.mean()
    else: sl, ic = np.polyfit(x, y, 1)
    sd = (y - (sl * x + ic)).std(ddof=2 if x.std() > 1e-9 else 1)
    return lambda r: None if not r['C'] else float((math.log(r['C'][stat]) - (sl * math.log(r['N_R']) + ic)) / sd)
B = []; C = []
for t, th in cells:
    hz = sel(t, th, 'zeta', 'haar')
    c = {'t': t, 'theta': th, 'held_out': t in HELD, 'P': sel(t, th, 'zeta', 'real')[0]['P'] if sel(t, th, 'zeta', 'real') else None}
    def summ(rs, key):
        v = [r[key] for r in rs]
        return None if not v else [float(np.min(v)), float(np.median(v)), float(np.max(v))]
    for name, rs in [('zeta', sel(t, th, 'zeta', 'real')), ('chains', sel(t, th, 'chain', 'real')), ('haar_zeta', hz)] + \
                    [(k, sel(t, th, k, 'real')) for k in ('TNR', 'ZQ', 'EA', 'DH', 'HQ2')] + [('haar_' + k, sel(t, th, k, 'haar')) for k in ('TNR', 'ZQ', 'EA', 'DH', 'HQ2')]:
        c[name] = {'n': len(rs), 'S': summ(rs, 'S'), 'L': summ(rs, 'L'), 'frac_right': summ(rs, 'frac_right'), 'N_R': summ(rs, 'N_R'),
                   'max_re': max([r['max_re'] or 0 for r in rs]) if rs else None, 'L_pos_frac': float(np.mean([r['L'] > 0 for r in rs])) if rs else None}
    if hz and c['zeta']['n']:
        hS = sorted(r['S'] for r in hz)
        zs = [r['S'] for r in sorted(sel(t, th, 'zeta', 'real'), key=lambda r: r['w'])]
        c['zeta_S_by_window'] = zs
        c['zeta_in_haar_range'] = int(sum(hS[0] <= s <= hS[-1] for s in zs))
        c['zeta_below_haar_median'] = int(sum(s < np.median(hS) for s in zs))
        for k in ('EA', 'TNR'):
            r = [x for x in sel(t, th, k, 'real') if x['w'] == 0]
            if r: c[k + '_above_haar_zeta_max'] = bool(r[0]['S'] > hS[-1])
    cc = {'t': t, 'theta': th, 'held_out': t in HELD}
    for stat in ('Q1', 'Q2', 'Q0'):
        zf = zfun(hz, stat)
        d = {}
        if zf:
            zz = [zf(r) for r in sorted(sel(t, th, 'zeta', 'real'), key=lambda r: r['w'])]
            zz = [z for z in zz if z is not None]
            d['zeta_z'] = [round(z, 2) for z in zz]
            d['zeta_Z8'] = float(sum(zz) / math.sqrt(len(zz))) if zz else None
            ch = [zf(r) for r in sel(t, th, 'chain', 'real')]; ch = [z for z in ch if z is not None]
            d['chains_n_ge_2.5'] = int(sum(abs(z) >= 2.5 for z in ch)); d['chains_n_ge_4'] = int(sum(abs(z) >= 4 for z in ch))
            d['chains_mean_z'] = float(np.mean(ch)) if ch else None; d['chains_sd_z'] = float(np.std(ch)) if ch else None
            # leave-one-out z of the Haar draws themselves (calibration of the z scale)
            loo = []
            for i in range(len(hz)):
                f2 = zfun(hz[:i] + hz[i + 1:], stat)
                if f2 and hz[i]['C']: loo.append(f2(hz[i]))
            d['haar_loo_max_abs_z'] = float(max(abs(z) for z in loo)) if loo else None
            d['haar_loo_sd_z'] = float(np.std(loo)) if loo else None
        for k in ('TNR', 'ZQ', 'EA', 'DH', 'HQ2'):
            zf2 = zfun(sel(t, th, k, 'haar'), stat); rall = sorted(sel(t, th, k, 'real'), key=lambda r: r['w']); r = [x for x in rall if x['w'] == 0]
            d[k + '_z'] = (zf2(r[0]) if (zf2 and r) else None)
            if zf2:
                zz8 = [zf2(x) for x in rall]; zz8 = [z for z in zz8 if z is not None]
                d[k + '_Z8'] = float(sum(zz8) / math.sqrt(len(zz8))) if zz8 else None; d[k + '_n'] = len(zz8)
            # also against the zeta-coefficient ensemble
            d[k + '_z_vs_zeta_haar'] = (zf(r[0]) if (zf and r) else None)
        cc[stat] = d
    B.append(c); C.append(cc)
out['cells'] = B; out['C'] = C
json.dump(out, open('aggregate.json', 'w'), indent=1)
print('jobs', out['n_jobs'], 'incomplete', len(out['incomplete']), 'max resid', out['max_abs_resid_complete'], 'n>1e-4', out['n_resid_gt_1e-4'], 'frac |S-L|<=0.05', out['frac_absSminusL_le_0.05'], 'max |S-L|', out['max_abs_S_minus_L'])
f3 = lambda v: 'NA' if v is None else '/'.join('%.4f' % x for x in v)
print('\nRun B: S = sum(Re beta - 1/2)/100 [min/median/max], L, fraction right')
for c in B:
    print('\n t=%g theta=%.2f P=%s %s' % (c['t'], c['theta'], c['P'], '(held out)' if c['held_out'] else ''))
    for k in ('zeta', 'chains', 'haar_zeta', 'TNR', 'haar_TNR', 'ZQ', 'haar_ZQ', 'EA', 'haar_EA', 'DH', 'haar_DH', 'HQ2', 'haar_HQ2'):
        v = c[k]
        if v['n']: print('  %-10s n=%2d S %s | L %s | frac %s | maxRe %.3f | L>0 %.2f' % (k, v['n'], f3(v['S']), f3(v['L']), f3(v['frac_right']), v['max_re'], v['L_pos_frac']))
    print('  zeta in Haar range: %s of %d; below Haar median: %s; EA above Haar max: %s; TNR above: %s' % (c.get('zeta_in_haar_range'), c['zeta']['n'], c.get('zeta_below_haar_median'), c.get('EA_above_haar_zeta_max'), c.get('TNR_above_haar_zeta_max')))
print('\nRun C: z against own Haar ensemble')
g = lambda v: 'NA' if v is None else '%.2f' % v
for cc in C:
    for stat in ('Q1', 'Q2', 'Q0'):
        d = cc[stat]
        if not d or 'zeta_Z8' not in d: continue
        print(' t=%g th=%.2f %s %s: zeta Z8 %s  z_w %s | chains >=2.5: %d, >=4: %d (mean %s sd %s) | Haar LOO max %s sd %s | TNR %s ZQ %s EA %s DH %s HQ2 %s' % (
            cc['t'], cc['theta'], 'H' if cc['held_out'] else 'D', stat, g(d['zeta_Z8']), d['zeta_z'], d['chains_n_ge_2.5'], d['chains_n_ge_4'], g(d['chains_mean_z']), g(d['chains_sd_z']),
            g(d['haar_loo_max_abs_z']), g(d['haar_loo_sd_z']), g(d['TNR_z']), g(d['ZQ_z']), g(d['EA_z']), g(d['DH_z']), g(d['HQ2_z'])) + ' || Z8(extra): ' + ' '.join('%s %s' % (k, g(d.get(k + '_Z8'))) for k in ('TNR', 'ZQ', 'EA', 'DH', 'HQ2')))
