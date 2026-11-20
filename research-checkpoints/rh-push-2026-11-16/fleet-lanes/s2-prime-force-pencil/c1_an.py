import sys, json
for f in sys.argv[1:]:
    d = json.load(open(f)); print('\n## %s  window [%.0f, %.0f]  step %.4f  sign changes of Z_F %d ; gridding check %s' % (d['obj'], d['A'], d['B'], d['h'], d['n_signchanges'], d.get('grid_check')))
    if 'meanfield' in d:
        m = d['meanfield']; print('mean-field pencil: n0 %d, first change tau>0 at %s, tau<0 at %s' % (m['n0'], m['first_change_up'], m['first_change_down']))
    print('| family | P | form | tau+ | tau- | n(+0.01)/n0 | n(-0.01)/n0 | n(+0.1)/n0 | n(-0.1)/n0 | n(+1)/n0 | n(-1)/n0 | rms W |'); print('|---|---|---|---|---|---|---|---|---|---|---|---|')
    T = d['taus']; i01 = T.index(0.01); i1 = T.index(0.1); i10 = T.index(1.0)
    for r in d['rows']:
        if r['P'] in (1000, 10 ** 6, d['levels'][-1]):
            n0 = r['n0']; print('| %s | 1e%d | %s | %.2e | %.2e | %.4f | %.4f | %.4f | %.4f | %.4f | %.4f | %.2f |' % (r['family'], len(str(r['P'])) - 1, r['form'], r['tau_plus'] or -1, r['tau_minus'] or -1, r['plus'][i01] / n0, r['minus'][i01] / n0, r['plus'][i1] / n0, r['minus'][i1] / n0, r['plus'][i10] / n0, r['minus'][i10] / n0, r['W_rms']))
