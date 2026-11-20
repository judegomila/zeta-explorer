import sys, json, numpy as np
R = json.load(open(sys.argv[1]))
TOR = {0.08: 0.2812, 0.10: 0.3092, 0.12: 0.0348, 0.14: -0.0288, 0.16: -0.0647, 0.25: -0.5170}   # source: TORUS_LINE_0145 (L-BFGS scan)
BLO, BW, NB = R['hist_bins']
kinds = []
for w in R['windows']:
    if w['kind'] not in kinds:
        kinds.append(w['kind'])
M = 1 << R['meta']['logM']
print(f"windows of {M} grid points, dx={R['meta']['dx']}, length {M * R['meta']['dx']:.3e}; N={R['meta']['N']}")
print('| y | t | gamma | torus inf (scan) | kind | windows | realised inf (min over windows) | mean of window minima | sd | realised - torus | frac G<0 | q(1e-6) | q(1e-3) | mean G |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
out = {}
for r, row in enumerate(R['rows']):
    for k in kinds:
        ws = [w for w in R['windows'] if w['kind'] == k and w['row'] == r]
        if not ws:
            continue
        mins = np.array([w['minG'] for w in ws])
        h = np.sum([w['hist'] for w in ws], axis=0); c = np.cumsum(h) / h.sum()
        q = lambda p: BLO + BW * (np.searchsorted(c, p) + 0.5)
        tor = TOR[round(row['y'], 2)]
        out[(r, k)] = (mins, h)
        print(f"| {row['y']} | {row['t']} | {row['gamma']:.4f} | {tor:+.4f} | {k} | {len(ws)} | {mins.min():+.4f} | {mins.mean():+.4f} | {mins.std(ddof=1) if len(ws) > 1 else 0:.4f} | {mins.min() - tor:+.4f} | {np.mean([w['frac_neg'] for w in ws]):.1e} | {q(1e-6):+.4f} | {q(1e-3):+.4f} | {np.mean([w['meanG'] for w in ws]):+.4f} |")
print()
print('z-scores of the mean window minimum, true orbit against each control (Welch):')
for r, row in enumerate(R['rows']):
    a = out[(r, 'true')][0]
    s = []
    for k in kinds[1:]:
        if (r, k) not in out or len(out[(r, k)][0]) < 2:
            continue
        b = out[(r, k)][0]
        z = (a.mean() - b.mean()) / np.sqrt(a.var(ddof=1) / len(a) + b.var(ddof=1) / len(b))
        s.append(f'{k} {z:+.2f}')
    # histogram distance (total variation) true vs haar
    if (r, 'chi') in out and (r, 'chihaar') in out:
        x = out[(r, 'chi')][0]; y2 = out[(r, 'chihaar')][0]
        s.append('chi vs its own Haar flow %+.2f' % ((x.mean() - y2.mean()) / np.sqrt(x.var(ddof=1) / len(x) + y2.var(ddof=1) / len(y2))))
    ha = out[(r, 'true')][1] / out[(r, 'true')][1].sum(); hb = out[(r, 'haar')][1] / out[(r, 'haar')][1].sum()
    print(f"y={row['y']}: " + ', '.join(s) + f"; total variation distance of the G histograms (true vs haar) = {0.5 * np.abs(ha - hb).sum():.2e}")
