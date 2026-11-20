import json, sys
rows = []
for f in sys.argv[1:]: rows += json.load(open(f))
print('list | pairs | q_min | D_min | P(q<0.8) | Hill q<0.02 | q<0.05 | q<0.1 | q<0.2 | Hill D<0.1 | D<0.2 | min-gap exp (blocks) | min-q exp (blocks) | ladder')
f = lambda h: ('%.3f+-%.3f' % (h['kappa'], h['se'])) if h['kappa'] else '-'
for r in rows:
    mg = r['min_gap_exponent_blocks']; mq = r['min_q_exponent_blocks']; ld = r['min_gap_exponent_ladder']
    print('%-7s | %d | %.3e | %.3e | %.4f | %s | %s | %s | %s | %s | %s | %s | %s | %s' % (r['name'], r['n_pairs'], r['q_min'], r['D_min'], r['frac_q_below_0p8'],
          f(r['hill_q']['0.02']), f(r['hill_q']['0.05']), f(r['hill_q']['0.1']), f(r['hill_q']['0.2']), f(r['hill_D']['0.1']), f(r['hill_D']['0.2']),
          ('%.3f+-%.3f' % (mg['slope'], mg['se'])) if mg else '-', ('%.3f+-%.3f' % (mq['slope'], mq['se'])) if mq else '-', ('%.3f (%d rungs)' % (ld['slope'], ld['rungs'])) if ld else '-'))
print('matched sizes: Hill exponent of q below 0.2 in disjoint blocks: [2.5%, 50%, 97.5%] (fraction of blocks with >= 3 events); min q quantiles')
for r in rows:
    for sz, e in r['matched'].items():
        h = e['hill_q_0.2']
        print('%-7s n=%-8s hill %s (%.2f, %d blocks)  min_q %s  min_D %s' % (r['name'], sz, ['%.3f' % v for v in h['quantiles']] if h['quantiles'] else '-', h['frac_defined'], h['nblocks'], ['%.2e' % v for v in e['min_q_quantiles']], ['%.3f' % v for v in e['min_D_quantiles']]))
