"""Trend table over T from the merged c1 jsonl files (all files matching c1_T<T>*.jsonl are merged by window index). Usage: c1_table.py"""
import glob, json, numpy as np
import c1lib
out = {}
for T in ('1e+06', '1e+07', '1e+08', '1e+09', '1e+10'):
    seen = {}
    for fn in sorted(glob.glob('c1_T%s*.jsonl' % T)):
        if 'cn' in fn or 'hf' in fn or 'timing' in fn: continue
        for l in open(fn):
            r = json.loads(l); seen[r['w']] = r
    rows = [seen[k] for k in sorted(seen)]
    if not rows: continue
    keys = list(rows[0]['st'].keys()); arr = {k: np.array([r['st'][k] for r in rows]) for k in keys}
    o = {'windows': len(rows), 'Tw_min': rows[0]['Tw'], 'Tw_max': rows[-1]['Tw'], 'M': rows[0]['M'], 'h': rows[0]['h'], 'missing': [i for i in range(1000) if i not in seen][:5]}
    for th in ('1/2', '4/7'):
        best = {}
        for f in c1lib.OPTIONS:
            ks = [k for k in keys if k.startswith(f + '|') and (k.endswith('|' + th) or k.endswith('|-'))]
            g = np.min(np.stack([arr[k][:, 4] for k in ks]), axis=0); kj = np.max(np.stack([arr[k][:, 2] for k in ks]), axis=0)
            which = [ks[i] for i in np.unique(np.argmin(np.stack([arr[k][:, 4] for k in ks]), axis=0))]
            knj = arr[which[0]][:, 3]
            best[f] = g
            o['%s|%s' % (f, th)] = {'gap': [float(g.mean()), float(g.min()), float(g.max())], 'kJ': [float(kj.mean()), float(kj.min()), float(kj.max())], 'knJ': [float(knj.mean()), float(knj.min()), float(knj.max())], 'option': which}
        zl = np.maximum(best['ZETA'], best['LCHI']); zmax = float(zl.max())
        for f in ('DH', 'TNR', 'EA', 'LIOU'):
            o['%s|%s' % (f, th)]['windows_above_all_zeta_lchi'] = int((best[f] > zmax).sum()); o['%s|%s' % (f, th)]['min_excess_same_window'] = float((best[f] - zl).min())
            o['%s|%s' % (f, th)]['max_excess_same_window'] = float((best[f] - zl).max())
    out[T] = o
json.dump(out, open('c1_table.json', 'w'), indent=1)
for th in ('1/2', '4/7'):
    print('\ntheta = %s. Per window: smallest Jensen gap over the tempered options. Entries: mean [min, max] over windows' % th)
    print('T (windows) | ' + ' | '.join(c1lib.OPTIONS))
    for T, o in out.items():
        print('%s (%d) | ' % (T, o['windows']) + ' | '.join('%.4f [%.4f, %.4f]' % tuple(o['%s|%s' % (f, th)]['gap']) for f in c1lib.OPTIONS))
    print('kappa_J (largest over the tempered options), mean [min, max]')
    for T, o in out.items():
        print('%s | ' % T + ' | '.join('%.3f [%.3f, %.3f]' % tuple(o['%s|%s' % (f, th)]['kJ']) for f in c1lib.OPTIONS))
    print('windows with gap above the largest zeta / L(chi) gap of the block, and smallest same-window excess over max(zeta, L(chi))')
    for T, o in out.items():
        print('%s | ' % T + ' | '.join('%s %d/%d, %.4f' % (f, o['%s|%s' % (f, th)]['windows_above_all_zeta_lchi'], o['windows'], o['%s|%s' % (f, th)]['min_excess_same_window']) for f in ('DH', 'TNR', 'EA', 'LIOU')))
    print('option attaining the minimum: ' + '; '.join('%s: %s' % (f, ','.join(sorted({x.split('|')[1] for T, o in out.items() for x in o['%s|%s' % (f, th)]['option']}))) for f in c1lib.OPTIONS))
