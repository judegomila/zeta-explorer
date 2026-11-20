import json, numpy as np
d = json.load(open('pair_full.json'))
print('| gamma | L = log(gamma/2pi) | b | model 2a (sinh(2ab)/b - 2a = L) | measured 2a*: min / median / max over 12 positions | c = median/L | median/model | witness mass within one mean spacing of gamma0 (median) | within 60 |')
print('|---|---|---|---|---|---|---|---|---|')
for s in d['summary']:
    if s['n_detected'] == 0:
        print('| %.0e | %.3f | %.2f | %.2f | none up to the top of the scan | - | - | - | - |' % (s['gamma'], s['L'], s['b'], s['model'])); continue
    print('| %.0e | %.3f | %.2f | %.2f | %.2f / %.2f / %.2f (%d of 12) | %.3f | %.3f | %.2f | %.2f |' % (s['gamma'], s['L'], s['b'], s['model'], s['min'], s['median'], s['max'], s['n_detected'],
          s['median'] / s['L'], s['median'] / s['model'], np.median(s['mass_within_1sp']), np.median(s['mass_within_60'])))
print()
for g in sorted({r['gamma'] for r in d['raw']}):
    rs = [r for r in d['raw'] if r['gamma'] == g]
    print('gamma %.0e: zeta band minimum over %d supports: min %.2e max %.2e; top support %.2f, frame %d' % (g, len(rs), min(r['zeta'] for r in rs), max(r['zeta'] for r in rs), max(r['twoa'] for r in rs), max(r['n'] for r in rs)))
    L = np.log(g / 2 / np.pi)
    for r in sorted(rs, key=lambda r: r['twoa']):
        if abs(r['twoa'] / L - round(r['twoa'] / L * 4) / 4) < 0.5 * 0.05 / L and r['twoa'] / L <= 1.3: print('   2a = %.2f (%.2f L): zeta band lambda_min = %.3e' % (r['twoa'], r['twoa'] / L, r['zeta']))
