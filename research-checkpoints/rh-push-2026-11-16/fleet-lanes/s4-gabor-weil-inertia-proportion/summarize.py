"""Tables from out/c1*.jsonl, out/c2_*.json, out/c3.jsonl, out/c4_*.json (markdown to stdout)."""
import json, glob, math, sys, os
import numpy as np
def rows(p):
    return [json.loads(l) for f in sorted(glob.glob(p)) for l in open(f) if l.strip()]
c1 = rows('out/c1*.jsonl')
print('### c1: prime-side spectra\n')
print('| family | T | lam | n | X | terms | N_smooth | min eig | max eig | n - N_0 | n - N_0.1 | n - N_0.5 | gap at 0 | m1 | m2/m1 | R_lam = 1/lam + lam/3 | m3 | m4 | C_mt | list in window | diff n+ (>0.1) | diff n- (<-0.1) |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for r in sorted(c1, key=lambda r: (r['T'], r['lam'] if r['family'] != 'EA' else 2 * r['lam'], r['family'], r['a'], r['nu0'])):
    p = r['prime_side']; n = r['n']; lam = r['lam']
    fam = r['family'] + (' a=%g' % r['a'] if r['family'] == 'EA' else '') + ('' if r['nu0'] == r['T'] else ' nu0=%g' % r['nu0'])
    d = r.get('diff')
    print('| %s | %g | %g | %d | %.4g | %d | %.0f | %.4f | %.3f | %d | %d | %d | %.1e | %.4f | %.4f | %.4f | %.3f | %.3f | %s | %s | %s | %s |' % (
        fam, r['T'], lam, n, r['X'], r['nterms'], r['N_smooth'], p['lam_min'], p['lam_max'], n - p['N_theta']['0.0'], n - p['N_theta']['0.1'], n - p['N_theta']['0.5'], p['gap_theta']['0.0'],
        p['m'][0], p['m'][1] / p['m'][0], 1 / lam + lam / 3, p['m'][2], p['m'][3], ('%.5f' % r['mt']['C_meas']) if 'mt' in r else '-',
        r.get('list_in_window', '-'), d['n_above']['0.1'] if d else '-', d['n_below']['0.1'] if d else '-'))
print('\n### c2: zero-side pair sums\n')
print('| list | T range | zeros | L | S2(w*) | err | C* - S2 | S2(box) | err |')
print('|---|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out/c2_*.json')):
    r = json.load(open(f))
    print('| %s | %.4g .. %.4g | %d | %.2f | %.5f | %.5f | %+.5f | %.5f | %.5f |' % (r['name'], r['T_lo'], r['T_hi'], r['N0'], r['L'], r['star']['S2'], r['star']['err'], r['C_star'] - r['star']['S2'], r['box']['S2'], r['box']['err']))
print('\n### c3: zero-side moments\n')
c3 = rows('out/c3.jsonl')
from collections import defaultdict
g = defaultdict(list)
for r in c3: g[(r['name'], r['mode'], r.get('a', 0))].append(r)
print('| list | mode | windows | M | T | m2 | m3 | m4 | C*(meas) |')
print('|---|---|---|---|---|---|---|---|---|')
for k, v in g.items():
    m = np.array([r['m'] for r in v]); c = [r['C_star_meas'] for r in v if r.get('C_star_meas') is not None]
    se = lambda a: (a.std(ddof=1) / math.sqrt(len(a))) if len(a) > 1 else float('nan')
    print('| %s | %s%s | %d | %d | %.4g .. %.4g | %.4f +- %.4f | %.4f +- %.4f | %.4f +- %.4f | %s |' % (k[0], k[1], (' a=%g' % k[2]) if k[1] == 'ea' else '', len(v), v[0]['M'], v[0]['T_lo'], v[-1]['T_hi'],
          m[:, 1].mean(), se(m[:, 1]), m[:, 2].mean(), se(m[:, 2]), m[:, 3].mean(), se(m[:, 3]), ('%.5f +- %.5f' % (np.mean(c), se(np.array(c)))) if c else '-'))
print('\n### c4: number variance\n')
for f in sorted(glob.glob('out/c4_*.json')):
    r = json.load(open(f))
    print('**%s%s** (%d zeros, T %.4g .. %.4g)' % (r['name'], ' detrended' if r['detrend'] else '', r['n'], r['T_lo'], r['T_hi']))
    for q in r['node']:
        if 'var' in q: print('- node window T=%.3g: Lw=%.1f, sd=%.4f, var=%.4f +- %.4f, r=%.4f +- %.4f (exact GUE var %.4f), %.1f independent windows' % (q['T'], q['Lw'], q['sd'], q['var'], q['var_err'], q['r'], q['r_err'], q['gue_exact'], q['independent_windows']))
        else: print('- node window T=%.3g: Lw=%.1f: %s' % (q['T'], q['Lw'], q['note']))
    print('- ladder (ell: var, var/GUE, rho, rho_GUE): ' + '; '.join('%g: %.4f, %.3f, %.4f+-%.4f, %.4f' % (q['ell'], q['var'], q['ratio'], q['rho'], q['rho_err'], q['rho_gue']) for q in r['rows']))
