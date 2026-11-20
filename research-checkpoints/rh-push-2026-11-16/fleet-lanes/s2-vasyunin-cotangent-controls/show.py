import json, sys
j = json.load(open(sys.argv[1]+'/analysis.json'))
skip = set(sys.argv[2:])
for t, r in j.items():
    if t in skip: continue
    print('==', t)
    for k, v in r.items():
        if k == 'lam':
            print('   lam:', [(e['n'], round(e['lam1'], 4), round(e['lam2'], 4), round(e['w1'], 4), round(e['r0'], 3), round(e['k'], 3)) for e in v if e['n'] in (100, 250, 1000, 3000, 3333, 5500, 6000, 7000, 7500, 10000, 20000, 30000)])
            continue
        print('  ', k, ':', json.dumps(v)[:1300])
