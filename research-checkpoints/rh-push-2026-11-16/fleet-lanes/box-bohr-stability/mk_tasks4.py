import json, math, random
random.seed(5)
T = []
for N in range(1, 201):
    for inp in ('zeta', 'dh', 'tw2m', 'liou', 'tw2h'):
        q = 5.0 if inp == 'dh' else 1.0
        for NN in ([N] if inp != 'dh' else [2 * N - 1, 2 * N]):
            ta = max(2 * math.pi * NN * NN / q, 3.0) + 0.0137; tb = 2 * math.pi * (NN + 1) ** 2 / q + 0.0137
            if tb - ta < 1: continue
            for x0 in (0.0, 0.05, 0.1, 0.2, 0.3, 0.4):
                T.append(dict(kind='dwin', scheme='afe', inp=inp, size=NN, T1=ta, T2=tb, x0=x0))
    if 2 <= N <= 60:
        ta = 2 * math.pi * N * N + 0.0137; tb = 2 * math.pi * (N + 1) ** 2 + 0.0137
        ps = [p for p in range(2, N + 1) if all(p % q for q in range(2, p))]
        for b in range(20):
            ph = {str(p): random.uniform(0, 2 * math.pi) for p in ps}
            for x0 in (0.0, 0.1, 0.2, 0.3):
                T.append(dict(kind='dwin', scheme='afe', inp='zeta', size=N, T1=ta, T2=tb, x0=x0, phi=ph, tag='rand%d' % b))
json.dump(T, open('tasks4.json', 'w'))
print(len(T))
