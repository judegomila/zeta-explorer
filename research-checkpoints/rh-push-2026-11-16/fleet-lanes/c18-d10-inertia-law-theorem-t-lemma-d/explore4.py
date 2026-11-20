from lib import *
import random, collections, itertools
def ghat(r):
    n = len(r); b = mkb(r)
    bp = []
    for j in range(n):
        p = q(1)
        for t in range(n):
            if t != j: p *= (r[j]-r[t])
        bp.append(p)
    beta = [bp[j]/b(-r[j]) for j in range(n)]
    idx = [(i, j) for i in range(n) for j in range(n)]
    L = []
    for (i, j) in idx:
        for (k, l) in idx:
            v = 1/((r[i]+r[k])*(r[j]+r[l]))
            if j == l: v += beta[j]/(r[i]+r[j]+r[k])
            if i == k: v += beta[i]/(r[i]+r[j]+r[l])
            if j == k and i == l: v -= beta[i]*beta[j]*b(r[i]+r[j])/b(-r[i]-r[j])
            L.append(v)
    return fmpq_mat(n*n, n*n, L)
if __name__ == '__main__':
    rng = random.Random(3)
    sg = lambda x: '+' if x > 0 else '-'
    for n in (2, 3):
        tab = collections.defaultdict(set)
        for trial in range(1500):
            r = sorted([q(rng.randint(-60, 60), 7) + q(1, 1000+trial) * (t+1) for t in range(n)], reverse=True)
            try: G = ghat(r)
            except ZeroDivisionError: continue
            ine = inertia(G)
            key = (''.join(sg(x) for x in r), ''.join(sg(r[i]+r[j]) for i in range(n) for j in range(i+1, n)), sg(sum(r, q(0))) if n == 3 else '',
                   ''.join(sg((2*r[i]+r[j])) for i in range(n) for j in range(n) if i != j))
            tab[key].add(ine)
        print('n =', n, ' keys:', len(tab), ' ambiguous:', sum(1 for v in tab.values() if len(v) > 1))
        for k in sorted(tab): print(k, sorted(tab[k]))
