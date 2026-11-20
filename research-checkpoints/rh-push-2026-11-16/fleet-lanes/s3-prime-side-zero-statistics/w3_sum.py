import json, glob
for f in sorted(glob.glob('out/scan_*.jsonl')):
    rows = [json.loads(l) for l in open(f) if l.strip()]
    if not rows: print(f, 'EMPTY'); continue
    m = rows[0]
    print('%-6s lo=%g hi=%g X=%g n=%d | box n_neg=%d und=%d edge=%s negpiv=%s log10minpiv=%.1f | hann n_neg=%d edge=%s' % (m['family'], m['lo'], m['hi'], m['X'], m['n'], m['box']['n_neg'], m['box']['undecided'],
          m['edge_box'] and round(m['edge_box'], 2), m['box'].get('first_neg_pivot') and '%.2e' % m['box']['first_neg_pivot'], m['box'].get('log10_min_abs_pivot', float('nan')), m['hann']['n_neg'], m['edge_hann'] and round(m['edge_hann'], 2)))
    pl = rows[1:]
    if pl:
        for beta in sorted(set(r['plant_beta'] for r in pl)):
            print('     plant beta=%g: ' % beta + ' '.join('d=%g:%s' % (r['plant_gamma'] - m['hi'], ('N' if r['n_neg'] == 0 else 'neg@%.0f' % r['edge']) + ('?' if r['undecided'] else '')) for r in pl if r['plant_beta'] == beta))
