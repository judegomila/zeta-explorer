# re-test of the first candidates from bench.jsonl: same points, zeta against several insertions, several T, two precisions.
import json, sys
from flint import acb, ctx
import k2, search
recs = [json.loads(l) for l in open('bench.jsonl')]
cands = [r for r in recs if r.get('nneg', 0) > 0]
Q = search.quartet
cases = [('zeta', []), ('quartet(0.2,0.1)', Q(0.2, 0.1)), ('quartet(0.2,3)', Q(0.2, 3)), ('quartet(0.05,0.1)', Q(0.05, 0.1)), ('realpair(0.2)', search.realpair(0.2)),
         ('quartet(0.2,1)', Q(0.2, 1)), ('right pair 0.7+-0.1i', [complex(0.7, 0.1), complex(0.7, -0.1)]), ('double zero at 1/2+-0.1i', [complex(0.5, 0.1), complex(0.5, -0.1)]*2)]
for r in cands:
    raw = [(complex(p[0], p[1]), complex(p[2], p[3])) for p in r['points']]
    print('== candidate', r['family'], 'seed', r['seed'])
    for name, zs in cases:
        for T in ((0, 0), (0.05, 0), (0.3, 0.3), (1, 1)):
            for precs in ((256, 512), (2048,)):
                res = k2.certify(lambda: [(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in raw], lambda: k2.make_M(k2.M_zeta, zs), T, precs=precs)
                print('  %-26s T=%-10s prec=%-5d %s npos=%d nneg=%d  log10 piv min/max %.1f %.1f  negrel %s' % (name, T, res['prec'], res['status'], res['npos'], res['nneg'],
                      res.get('log10_piv_min', 0), res.get('log10_piv_max', 0), res.get('log10_negpiv_rel', '-')))
    sys.stdout.flush()
