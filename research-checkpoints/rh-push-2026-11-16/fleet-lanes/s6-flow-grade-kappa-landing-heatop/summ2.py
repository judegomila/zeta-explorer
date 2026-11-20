import sys, json, math
def track(fn):
    d = json.load(open(fn)); print('== track', d['obj'], fn)
    for p in d['pairs']:
        line = 'g=%.3f b=%.4f prec %s: ' % (float(p['g']), float(p['b']), p.get('prec'))
        for r in p['rows']:
            if 'd_pair' in r: line += ' n=%d: d_pair=%d (D0 %.0f, ratio %.3f, terms %s, log2 max term %s)' % (r['n'], r['d_pair'], r['D0_pair'], r['ratio_to_D0'], r.get('terms_used'), r.get('log2_largest_term'))
            elif 'note' in r: line += ' n=%d: zero of F^(n) real' % r['n']
            else: line += ' n=%d: no descent' % r['n']
        print('  ', line)
    dp = [(r['d_pair'], float(p['g'])) for p in d['pairs'] for r in p['rows'] if r.get('n') == 0 and 'd_pair' in r]
    if dp: print('   min over pairs of d_pair(n=0): %d at g=%.3f ; pairs %d' % (min(dp)[0], min(dp)[1], len(dp)))
def arbl(fn):
    d = json.load(open(fn)); print('== landing', d['obj'], fn); best = None
    for p in d['pairs']:
        if 'landing' not in p: print('   g=%s: %s' % (p['g'][:10], p.get('note'))); continue
        if p['bracket'][1] is None: print('   g=%.3f b=%.4f: not landed by %.4f' % (float(p['g']), float(p['b']), p['bracket'][0])); continue
        if best is None or p['landing'] > best['landing']: best = p
    for p in d['pairs'][:6] + ([best] if best else []):
        if 'landing' in p and p['bracket'][1] is not None: print('   g=%.4f b=%.5f landing %.9f  de Bruijn %.6f  ratio %.4f  (prec %d, terms %d)' % (float(p['g']), float(p['b']), p['landing'], p['debruijn'], p['ratio'], p['prec'], p['terms']))
    if best: print('   max landing over %d pairs: %.9f at g=%.4f (b=%.5f, de Bruijn %.6f)' % (len(d['pairs']), best['landing'], float(best['g']), float(best['b']), best['debruijn']))
def surf(fn):
    d = json.load(open(fn)); print('== surface', d['obj'], fn, 'cells', d['n_cells'], 'positive', d['n_positive'], 'uncertified', d['uncertified'])
    print('   d*(n) on the grid:', d['dstar_grid'])
    pos = [r for r in d['rows'] if r.get('theta_star', 0) != 0.0]
    for n in sorted(set(r['n'] for r in pos))[:6]:
        print('   n=%d: ' % n + ' '.join('d=%d: %.3g' % (r['d'], r['theta_star']) for r in pos if r['n'] == n))
for f in sys.argv[1:]:
    try:
        (track if 'track' in f else arbl if 'arbland' in f else surf)(f)
    except Exception as e: print(f, 'ERR', e)
