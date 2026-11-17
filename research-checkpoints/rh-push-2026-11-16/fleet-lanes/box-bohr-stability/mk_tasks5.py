import json, math, random
random.seed(41)
T = []
phs = [{str(p): random.uniform(0, 2 * math.pi) for p in (2, 3, 5, 7)} for _ in range(20)]
for a in range(10):
    t1 = 3.0137 + 30 * a; t2 = t1 + 30; prec = 300 + int(1.3 * t2)
    for inp, N in (('zeta', 10), ('dh', 14), ('tw2m', 10), ('liou', 10), ('tw2h', 10)):
        if inp == 'dh' and a > 4: continue
        T.append(dict(kind='winpt', scheme='thalf', inp=inp, size=N, T1=t1, T2=t2, prec=prec))
    for b, ph in enumerate(phs):
        T.append(dict(kind='winpt', scheme='thalf', inp='zeta', size=10, T1=t1, T2=t2, prec=prec, tag='rand%d' % b, phi=ph))
    for k in (1, 2, 3, 6, 9, 11):
        T.append(dict(kind='winpt', scheme='thalf', inp='zeta', size=10, T1=t1, T2=t2, prec=prec, tag='line2', phi={'2': 2 * math.pi * k / 12}))
    for eps in (0.01, 0.05, 0.2):
        T.append(dict(kind='winpt', scheme='thalf', inp='zeta', size=10, T1=t1, T2=t2, prec=prec, tag='near%g' % eps, phi={'2': eps}))
json.dump(T, open('tasks5.json', 'w'))
print(len(T))
