import sys, json
q, d = int(sys.argv[1]), int(sys.argv[2]); tg = sys.argv[3].split(',') if len(sys.argv) > 3 else None
rows = [json.loads(l) for l in open(f'blocks_q{q}_d{d}.jsonl')]
ks = sorted({r['k'] for r in rows})
print('q', q, 'd', d, ' columns k =', ks, ' entries: h_up = 3 + 6 log_q(|J|/(||c|| ||R||))/N  (N=0: log_q ratio)')
for lam in sorted({r['lam'] for r in rows}):
    for N in sorted({r['N'] for r in rows}):
        for t in sorted({r['target'] for r in rows}):
            if tg and t not in tg: continue
            rr = sorted([r for r in rows if r['lam'] == lam and r['N'] == N and r['target'] == t], key=lambda r: r['k'])
            if not rr: continue
            def f(r):
                v = r.get('h_up') if N > 0 else r.get('log_q_ratio')
                return '    . ' if v is None else '%6.2f' % v
            ri = rr[0]['row_infl']
            print('lam %d N %d %-3s infl_R %8s |' % (lam, N, t, ('%.3f' % ri) if ri else '?'), ' '.join(f(r) for r in rr))
