import sys, json
q, d = int(sys.argv[1]), int(sys.argv[2])
rows = [json.loads(l) for l in open(f'blocks_q{q}_d{d}.jsonl')]
kmax = (d + 1) // 2
print('# signal law: blocks with k <= (d+1)/2 and a principal prediction; columns: target N lam k r | J/pred | h_up | row_excess  bessel')
for r in sorted(rows, key=lambda r: (r['lam'], r['N'], r['k'], r['target'])):
    if r['k'] > kmax or 'J_over_pred' not in r: continue
    if len(sys.argv) > 3 and r['target'] not in sys.argv[3].split(','): continue
    print('%-3s N=%d lam=%d k=%d r=%d | J/pred %7.3f | h_up %6s | exc %8s bes %8s' % (r['target'], r['N'], r['lam'], r['k'], r['r'], r['J_over_pred'],
          ('%.2f' % r['h_up']) if r.get('h_up') is not None else '.', ('%.4f' % r['row_excess_over_diag']) if 'row_excess_over_diag' in r else '?', ('%.4f' % r['bessel_over_diag']) if 'bessel_over_diag' in r else '?'))
