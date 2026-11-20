from lib import *
from explore4 import ghat
import random, itertools
rng = random.Random(4)
sg = lambda x: 1 if x > 0 else -1
data = []
for trial in range(400):
    r = [q(rng.randint(-60, 60), 7) + q(1, 1000+trial)*(t+1) for t in range(3)]
    try: G = ghat(r)
    except ZeroDivisionError: continue
    data.append((r, inertia(G)))
def feats(r, a, b, k):
    return [sg((2*r[a]+r[b])*(r[a]+2*r[b])), sg((r[a]+r[k])*(r[b]+r[k])), sg((2*r[a]+r[k])*(2*r[b]+r[k])), sg((2*r[k]+r[a])*(2*r[k]+r[b])),
            sg(r[0]+r[1]+r[2]), sg(r[k]), sg(r[a]+r[b]), sg(r[a]*r[b])]
names = ['sigma_ab', '(ra+rk)(rb+rk)', '(2ra+rk)(2rb+rk)', '(2rk+ra)(2rk+rb)', 'Sigma', 'rk', 'ra+rb', 'ra rb']
for mask in range(1, 256):
    ok = True
    for (r, ine) in data:
        neg = 0
        for (a, b, k) in ((0, 1, 2), (0, 2, 1), (1, 2, 0)):
            f = feats(r, a, b, k); e = 1
            for t in range(8):
                if mask >> t & 1: e *= f[t]
            neg += e < 0
        if neg != ine[1]: ok = False; break
    if ok: print('rule:', [names[t] for t in range(8) if mask >> t & 1])
print('done', len(data))
