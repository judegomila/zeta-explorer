import json, math, random
random.seed(11)
th = json.load(open('results/thresholds.json'))
T = []
def W(a, **kw):
    d = dict(kind='win', T1=3.0137 + 50 * a, T2=3.0137 + 50 * (a + 1), budget=600000); d.update(kw); return d
for a in range(100):
    for inp in ('zeta', 'dh'):
        T.append(W(a, scheme='true', inp=inp, size=0))
for a in range(60):
    for inp in ('zeta', 'dh', 'tw2h'):
        for N in (4, 5, 7, 10, 20):
            T.append(W(a, scheme='afe', inp=inp, size=N))
for a in range(30, 200):
    for inp in ('zeta', 'dh'):
        for N in (1, 2):
            T.append(W(a, scheme='afe', inp=inp, size=N))
for P in (2, 3, 5, 7, 11, 13, 17, 19, 23):
    ts = th[f'zeta|P{P}|K1|X0.5']
    top = int(min(1.2 * ts, 6000) / 50) + 1
    for a in range(0 if P > 13 else 30, max(top, 40)):
        T.append(W(a, scheme='euler', inp='zeta', size=P, K=1, Y=0.5))
    if P > 13:
        for inp in ('tw2m', 'tw2h', 'liou', 'dh'):
            for a in range(40):
                T.append(W(a, scheme='euler', inp=inp, size=P, K=1, Y=0.5))
for inp in ('zeta', 'tw2m', 'tw2h', 'liou', 'dh'):
    for P in (2, 3, 5, 7, 11):
        for a in range(40):
            T.append(W(a, scheme='euler', inp=inp, size=P, K=2, Y=0.5))
    for P in (2, 3, 5):
        for a in range(20):
            T.append(W(a, scheme='euler', inp=inp, size=P, K=0, Y=0.45))
for inp, Ps in (('ea:0.1', (2, 3, 5)), ('ea:0.4', (2, 3, 5)), ('nr:2:2.2', (5,)), ('nr:3:3', (5,)), ('nr:5:2.5', (5,)), ('nr:3:2.01', (5,))):
    for P in Ps:
        for K in (1, 0):
            if K == 0 and inp == 'ea:0.4':
                continue
            for a in range(10):
                T.append(W(a, scheme='euler', inp=inp, size=P, K=K, Y=0.5 if K else 0.2))
# torus translates, AFE matched windows (omega_p = exp(-i phi_p))
for N in range(2, 31):
    ta = 2 * math.pi * N * N + 0.0137; tb = 2 * math.pi * (N + 1) ** 2 + 0.0137
    ps = [p for p in range(2, N + 1) if all(p % q for q in range(2, p))]
    for b in range(30):
        T.append(dict(kind='win', scheme='afe', inp='zeta', size=N, T1=ta, T2=tb, budget=600000, tag='rand%d' % b,
                      phi={str(p): random.uniform(0, 2 * math.pi) for p in ps}))
    for k in range(1, 12):
        T.append(dict(kind='win', scheme='afe', inp='zeta', size=N, T1=ta, T2=tb, budget=600000, tag='line2', phi={'2': 2 * math.pi * k / 12}))
    for p in (3, 5, 7):
        if p <= N:
            T.append(dict(kind='win', scheme='afe', inp='zeta', size=N, T1=ta, T2=tb, budget=600000, tag='flip%d' % p, phi={str(p): math.pi}))
# theta form (b): point-sampled totals, certified sign changes
for a, (t1, t2) in enumerate(((3.0137, 33.0137), (33.0137, 63.0137))):
    for inp, Ns in (('zeta', (1, 2, 3, 4)), ('tw2m', (1, 2, 3, 4)), ('liou', (2, 3, 4)), ('tw2h', (2, 3, 4)), ('dh', (1, 2, 3, 4, 6))):
        for N in Ns:
            T.append(dict(kind='winpt', scheme='thalf', inp=inp, size=N, T1=t1, T2=t2, prec=256))
    for b in range(60):
        T.append(dict(kind='winpt', scheme='thalf', inp='zeta', size=4, T1=t1, T2=t2, prec=256, tag='rand%d' % b,
                      phi={str(p): random.uniform(0, 2 * math.pi) for p in (2, 3)}))
    for k in range(1, 12):
        T.append(dict(kind='winpt', scheme='thalf', inp='zeta', size=4, T1=t1, T2=t2, prec=256, tag='line2', phi={'2': 2 * math.pi * k / 12}))
T.sort(key=lambda t: (t['T1'] * (3 if t['kind'] == 'winpt' else 1)))
json.dump(T, open('tasks2.json', 'w'))
print(len(T))
