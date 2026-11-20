# symmetric insertions with multiplicity (order up to 20): the same quartet repeated k times, and a real pair repeated k times. T = 0. Certified inertia.
import random, json
from flint import acb, ctx
import k2, search
tot = [0, 0, 0, 0]; out = []
for (spec, kmax) in ((('q', 0.3, 3.0), 5), (('q', 0.05, 0.5), 5), (('q', 0.45, 14.134725141734695), 5), (('rp', 0.2), 10), (('q', 0.125, 100.0), 5)):
    for k in sorted(set([2, 3, kmax])):
        cfg = dict(name='mult', base='zeta', zeros=[spec]*k, kind='sym', order=0)
        for fam in ('low', 'special', 'cluster', 'polar', 'realish', 'height'):
            for n in (12, 40, 64):
                raw = search.gen_points(fam, n, cfg, random.Random(31*k + n))
                r = k2.certify(lambda: [(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in raw], lambda: k2.make_M(k2.M_zeta, cfg['zeros']), (0, 0))
                tot[0] += 1; tot[1] += (r['status'] == 'ok' and r['nneg'] == 0); tot[2] += (r.get('nneg', 0) > 0); tot[3] += (r['status'] != 'ok')
                out.append(dict(spec=list(spec), k=k, family=fam, n=n, status=r['status'], npos=r['npos'], nneg=r['nneg'], prec=r['prec']))
print('repeated symmetric insertions (order up to 20), T = 0: matrices', tot[0], 'certified positive', tot[1], 'negative', tot[2], 'undecided', tot[3])
json.dump(out, open('mult_check.json', 'w'))
