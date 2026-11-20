import json, math, random, os, collections
random.seed(23)
th = json.load(open('results/thresholds.json'))
T = []
# (1) S1 certificates from the screen
rows = collections.defaultdict(list)
if os.path.exists('results/big_s1.jsonl'):
    for ln in open('results/big_s1.jsonl'):
        d = json.loads(ln); k = d['key'].split('|')
        rows[(k[1], k[2], k[4])].append((int(k[3]), d))
for (sch, inp, opt), r in rows.items():
    if inp.startswith('ea') and sch == 'euler' or (sch == 'euler' and inp != 'dh'):
        continue
    r.sort(key=lambda x: x[0])
    for size, d in r:
        spec = dict(scheme=sch, inp=inp, size=size)
        if sch == 'euler':
            spec['K'] = int(opt)
        elif opt != 'sharp':
            spec['weight'] = opt
        if d['n_zero_xge0'] and d['x_sup'] and d['x_sup'] > 1e-3:
            T.append(dict(kind='s1zero', x=d['x_sup'], th=d['witness_th'], primes=d['primes'], prec=256, **spec))
        elif d['m'] <= 3 and not d['n_zero_xge0']:
            T.append(dict(kind='s1pass', prec=128, **spec))
# (2) torus translates of Euler K=1 sections: all PASS predicted above t*(P)
for P in (3, 5, 7, 11):
    ts = th[f'zeta|P{P}|K1|X0.5']
    ps = [p for p in (2, 3, 5, 7, 11) if p <= P]
    phs = [{str(p): random.uniform(0, 2 * math.pi) for p in ps} for _ in range(40)]
    for a in range(int(1.3 * ts / 50) + 2):
        for b, ph in enumerate(phs):
            T.append(dict(kind='win', scheme='euler', inp='zeta', size=P, K=1, Y=0.5, T1=3.0137 + 50 * a, T2=53.0137 + 50 * a, tag='rand%d' % b, phi=ph, budget=600000))
T.sort(key=lambda t: (0 if t['kind'] != 'win' else 1, t.get('T1', 0)))
json.dump(T, open('tasks3.json', 'w'))
print(len(T), sum(1 for t in T if t['kind'] == 's1zero'), sum(1 for t in T if t['kind'] == 's1pass'))
