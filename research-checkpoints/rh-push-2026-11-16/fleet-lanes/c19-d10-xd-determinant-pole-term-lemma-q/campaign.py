# Decisive test for X(d): exact inertia of the apex kernel on random symmetric configurations, d = 6..16,
# with confluent, near-confluent, near-boundary and near-degenerate sets; controls: non-symmetric sets, pole removed.
import os, sys, json, random, time
from fractions import Fraction as Fr
from multiprocessing import Pool
from xd import run
def zeros(specs):
    Z = {}
    def add(re, im): Z[(re, im)] = Z.get((re, im), 0)+1
    for s in specs:
        t = s[0]
        if t == 'q':
            e, g = Fr(s[1]), Fr(s[2])
            for a in (Fr(1, 2)+e, Fr(1, 2)-e):
                for b in (g, -g): add(a, b)
        elif t == 'r':
            e = Fr(s[1]); add(Fr(1, 2)+e, Fr(0)); add(Fr(1, 2)-e, Fr(0))
        elif t == 'l':
            g = Fr(s[1]); add(Fr(1, 2), g); add(Fr(1, 2), -g)
        elif t == 'p':
            re, im = Fr(s[1]), Fr(s[2]); add(re, im); add(re, -im)
        elif t == 's': add(Fr(s[1]), Fr(0))
    return Z
def predict(specs):
    Z = zeros(specs); d = sum(Z.values()); n = d+1
    deficit = sum(max(0, m-Z.get((1-re, im), 0)) for (re, im), m in Z.items() if re < Fr(1, 2))
    partnered = sum(min(m, Z.get((1-re, im), 0)) for (re, im), m in Z.items())
    return dict(d=d, neg=deficit, rank=n*(n-1)//2-partnered)
def rfrac(rng, lo, hi, dens):
    while True:
        q = rng.choice(dens); p = rng.randint(1, 60*q); x = Fr(p, q)
        if lo < x < hi: return x
def sym_config(rng, d, cat):
    specs = []; left = d
    def eta():
        if cat == 'boundary' and rng.random() < 0.7: return Fr(1, 2)-Fr(1, 2**rng.randint(4, 12))
        if cat == 'degenerate' and rng.random() < 0.6: return Fr(1, 2**rng.randint(3, 12))
        q = rng.randint(2, 12); return Fr(rng.randint(1, q-1), 2*q)
    def hgt():
        if cat == 'degenerate' and rng.random() < 0.6: return Fr(1, 2**rng.randint(3, 12))
        if cat == 'boundary' and rng.random() < 0.3: return Fr(1, 2**rng.randint(3, 10))
        return rfrac(rng, Fr(1, 20), Fr(40), [1, 2, 3, 4, 5, 7])
    while left > 0:
        kinds = ['q', 'r', 'l'] if left >= 4 else ['r', 'l']
        if cat == 'real': kinds = ['r']
        if cat == 'line': kinds = ['l']
        k = rng.choice(kinds)
        if k == 'q': s = ('q', str(eta()), str(hgt())); w = 4
        elif k == 'r': s = ('r', str(eta())); w = 2
        else: s = ('l', str(hgt())); w = 2
        if cat == 'confluent':
            r = rng.random()
            if r < 0.15 and left >= 2: s = ('r', '0'); w = 2          # double zero at 1/2
            elif r < 0.25 and left >= 4: s = ('q', str(eta()), '0'); w = 4   # real pair doubled
            elif r < 0.35 and left >= 4: s = ('q', '0', str(hgt())); w = 4   # line pair doubled
            reps = rng.choice([2, 2, 3])
            while reps > 0 and left >= w: specs.append(s); left -= w; reps -= 1
            continue
        if cat == 'nearconf' and left >= 2*w and rng.random() < 0.7:
            eps = Fr(1, 2**rng.randint(4, 12))
            if k == 'q': s2 = ('q', str(Fr(s[1])-eps if Fr(s[1]) > eps else Fr(s[1])+eps), str(Fr(s[2])+eps))
            elif k == 'r': s2 = ('r', str(Fr(s[1])-eps if Fr(s[1]) > eps else Fr(s[1])+eps))
            else: s2 = ('l', str(Fr(s[1])+eps))
            specs += [s, s2]; left -= 2*w; continue
        specs.append(s); left -= w
    return specs
def unpaired(rng):
    r = rng.random()
    if r < 0.55:
        re = Fr(rng.randint(1, 15), 32) if rng.random() < 0.7 else Fr(rng.randint(17, 31), 32)
        return [('p', str(re), str(rfrac(rng, Fr(1, 10), Fr(8), [1, 2, 3, 4])))]
    a1 = Fr(rng.randint(1, 31), 32); a2 = Fr(rng.randint(1, 31), 32)
    return [('s', str(a1)), ('s', str(a2))]
def tasks():
    T = []; rng = random.Random(20261119)
    cats = ['generic', 'boundary', 'degenerate', 'confluent', 'nearconf', 'real', 'line', 'generic', 'boundary', 'confluent']
    plan = {6: 60, 8: 50, 10: 40, 12: 32, 14: 22, 16: 16}
    for d, cnt in plan.items():
        for i in range(cnt):
            cat = cats[i % len(cats)]
            T.append(dict(kind='sym', cat=cat, base='pole', specs=sym_config(rng, d, cat)))
    for i in range(60):   # control 1: non-symmetric sets, base with the pole
        d0 = rng.choice([0, 2, 4, 6]); specs = sym_config(rng, d0, 'generic') if d0 else []
        for _ in range(rng.choice([1, 1, 2, 3])): specs += unpaired(rng)
        T.append(dict(kind='nonsym', cat='control', base='pole', specs=specs))
    for i in range(60):   # control 2: pole removed (base -1 and base +1), symmetric and not
        d0 = rng.choice([2, 4, 6, 8]); specs = sym_config(rng, d0, cats[i % len(cats)])
        if i % 2: specs += unpaired(rng)
        T.append(dict(kind='nopole', cat='control', base=('minus' if i % 4 < 2 else 'plus'), specs=specs))
    for i, t in enumerate(T): t['id'] = i
    return T
def work(t):
    try:
        r = run([tuple(s) for s in t['specs']], t['base']); p = predict([tuple(s) for s in t['specs']])
        t = dict(t); t.update(r); t['pred'] = p; return t
    except Exception as e:
        t = dict(t); t['error'] = repr(e); return t
if __name__ == '__main__':
    out = sys.argv[1]; T = tasks()
    if len(sys.argv) > 2: T = [t for t in T if sum(predict([tuple(s) for s in t['specs']])['d'] for _ in [0]) <= int(sys.argv[2])]
    T.sort(key=lambda t: -predict([tuple(s) for s in t['specs']])['d'])
    nw = int(os.environ.get('RH_WORKERS', '4')); print('tasks', len(T), 'workers', nw, flush=True)
    print('planned memory: at most 217 x 217 integer Gram matrix per worker, entries below 1e5 bits during elimination: under 1 GB per worker', flush=True)
    t0 = time.time()
    with Pool(nw) as P, open(out, 'w') as f:
        for k, r in enumerate(P.imap_unordered(work, T, chunksize=1)):
            f.write(json.dumps(r)+'\n'); f.flush()
            if k % 10 == 0: print(k, round(time.time()-t0), 's', flush=True)
    print('done', round(time.time()-t0), 's', flush=True)
