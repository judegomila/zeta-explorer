"""Summary of c1 jsonl files: per function, per mollifier: mean / min / max over windows of kappa_J, kappa_nJ, gap; per-window best tempered gap.
Usage: c1_summary.py file.jsonl ..."""
import sys, json, numpy as np
import c1lib
for fn in sys.argv[1:]:
    rows = [json.loads(l) for l in open(fn)]
    seen = {}; 
    for r in rows: seen[r['w']] = r
    rows = [seen[k] for k in sorted(seen)]
    keys = list(rows[0]['st'].keys())
    print('\n== %s: %d windows, Tw %.6g .. %.6g, M %d, h %.4f' % (fn, len(rows), rows[0]['Tw'], rows[-1]['Tw'], rows[0]['M'], rows[0]['h']))
    arr = {k: np.array([r['st'][k] for r in rows]) for k in keys}
    out = {'file': fn, 'windows': len(rows), 'per_option': {}, 'best_tempered': {}}
    print('function|mollifier|theta : kappa_J mean [min, max] ; kappa_nJ mean [min, max] ; gap mean [min, max]')
    for k in keys:
        a = arr[k]
        print('%-22s: kJ %7.4f [%7.4f, %7.4f] ; knJ %7.4f [%7.4f, %7.4f] ; gap %6.4f [%6.4f, %6.4f]' % (k, a[:,2].mean(), a[:,2].min(), a[:,2].max(), a[:,3].mean(), a[:,3].min(), a[:,3].max(), a[:,4].mean(), a[:,4].min(), a[:,4].max()))
        out['per_option'][k] = {'kJ': [a[:,2].mean(), a[:,2].min(), a[:,2].max()], 'knJ': [a[:,3].mean(), a[:,3].min(), a[:,3].max()], 'gap': [a[:,4].mean(), a[:,4].min(), a[:,4].max(), a[:,4].std()]}
    print('per-window best over the tempered options (min gap; max kappa_J), by theta (the option "none" is included):')
    for th in ('1/2', '4/7'):
        best = {}
        for f in c1lib.OPTIONS:
            ks = [k for k in keys if k.startswith(f + '|') and (k.endswith('|' + th) or k.endswith('|-'))]
            g = np.min(np.stack([arr[k][:,4] for k in ks]), axis=0); kj = np.max(np.stack([arr[k][:,2] for k in ks]), axis=0)
            best[f] = (g, kj)
            print('  theta %s %-5s: best gap mean %.4f min %.4f max %.4f sd %.4f | best kappa_J mean %.4f min %.4f max %.4f' % (th, f, g.mean(), g.min(), g.max(), g.std(), kj.mean(), kj.min(), kj.max()))
            out['best_tempered']['%s|%s' % (f, th)] = {'gap': [g.mean(), g.min(), g.max(), g.std()], 'kJ': [kj.mean(), kj.min(), kj.max()]}
        zmax = max(best['ZETA'][0].max(), best['LCHI'][0].max())
        for f in ('DH', 'TNR', 'EA', 'LIOU'):
            ex = best[f][0] - np.maximum(best['ZETA'][0], best['LCHI'][0])
            print('  theta %s %-5s: windows with gap > max over all windows of zeta and L(chi) gap (%.4f): %d of %d; min same-window excess over max(zeta, L(chi)): %.4f' % (th, f, zmax, int((best[f][0] > zmax).sum()), len(ex), ex.min()))
            out['best_tempered']['%s|%s' % (f, th)]['windows_above_zeta_max'] = int((best[f][0] > zmax).sum()); out['best_tempered']['%s|%s' % (f, th)]['min_excess'] = float(ex.min())
    json.dump(out, open(fn.replace('.jsonl', '_summary.json'), 'w'), indent=1, default=float)
