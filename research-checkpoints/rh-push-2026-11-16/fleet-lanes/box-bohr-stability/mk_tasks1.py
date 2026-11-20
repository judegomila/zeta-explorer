import json, math
T = []
def mw(inp, N):
    q = 5.0 if inp == 'dh' else 1.0
    ta = max(2 * math.pi * N * N / q, 3.0) + 0.0137; tb = 2 * math.pi * (N + 1) ** 2 / q + 0.0137
    return dict(kind='win', scheme='afe', inp=inp, size=N, T1=ta, T2=tb) if tb - ta > 1 else None
# round-robin by N so every input advances together
for N in range(1, 301):
    for inp in ('zeta', 'dh', 'tw2m', 'liou', 'tw2h'):
        if inp in ('tw2m', 'liou', 'tw2h') and N > 80:
            continue
        for NN in ([N] if inp != 'dh' else [2 * N - 1, 2 * N]):
            t = mw(inp, NN)
            if t: T.append(t)
    if N <= 40:
        # Euler K=1 and K=infinity sections, windows of 50 up to 2000
        for inp in ('zeta', 'dh', 'tw2m', 'tw2h', 'liou', 'ea:0.25', 'nr:3:2.2'):
            for P in (2, 3, 5, 7, 11, 13):
                if inp.startswith('nr') and P < 3: continue
                T.append(dict(kind='win', scheme='euler', inp=inp, size=P, K=1, T1=3.0137 + 50 * (N - 1), T2=3.0137 + 50 * N, Y=0.5))
        for inp in ('zeta', 'dh'):
            for NN in (1, 2, 3):
                T.append(dict(kind='win', scheme='afe', inp=inp, size=NN, T1=3.0137 + 50 * (N - 1), T2=3.0137 + 50 * N))
json.dump(T, open('tasks1.json', 'w'))
print(len(T))
