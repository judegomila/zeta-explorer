# c18-d10: certified inertia of the apex kernel K_0 (T = 0) of zeta times a finite Blaschke insertion.
# 200 symmetric insertions (predicted negative index 0) and 200 insertions with unpaired left zeros (predicted negative index =
# number of zeros a with Re a < 1/2 whose partner 1 - a is absent). Orders 64, 96, 128; ball LDL (k2.certify). MEASURED per matrix.
# Planned memory: Gram of order 128 in acb at <= 4096 bits: 16384 * 2 * 560 bytes < 20 MB, LDL copy the same; < 300 MB per worker.
import sys, os, json, random, math, time
from multiprocessing import Pool
from flint import acb, arb
import k2, search
def build():
    rng = random.Random(1810)
    C = []
    for i in range(200):
        zs = []; order = rng.choice([2, 4, 4, 6, 8, 12]); cnt = 0
        while cnt < order:
            if order - cnt >= 4 and rng.random() < 0.8:
                eta = round(rng.uniform(0.01, 0.49)*4096)/4096; g = round(math.exp(rng.uniform(math.log(0.1), math.log(60)))*1024)/1024
                zs.append(('q', eta, g)); cnt += 4
            else:
                eta = round(rng.uniform(0.01, 0.49)*4096)/4096; zs.append(('rp', eta)); cnt += 2
        C.append(dict(name='sym%d' % i, zeros=zs, pred=0, kind='sym', order=order))
    for i in range(200):
        zs = []; k = rng.choice([1, 1, 2, 3]); pred = 0
        for _ in range(k):
            if rng.random() < 0.75:
                a = complex(rng.uniform(0.03, 0.47), math.exp(rng.uniform(math.log(0.1), math.log(8)))); zs += [a, a.conjugate()]; pred += 2
            else:
                a1 = rng.uniform(0.03, 0.47); a2 = rng.uniform(0.03, 0.47); zs += [complex(a1, 0), complex(a2, 0)]; pred += 2
        if rng.random() < 0.5:
            a = complex(rng.uniform(0.53, 0.97), math.exp(rng.uniform(math.log(0.1), math.log(8)))); zs += [a, a.conjugate()]
        if rng.random() < 0.5:
            zs.append(('q', round(rng.uniform(0.01, 0.49)*4096)/4096, round(math.exp(rng.uniform(math.log(0.1), math.log(8)))*1024)/1024))
        C.append(dict(name='unp%d' % i, zeros=zs, pred=pred, kind='unpaired', order=len(search.approx_zeros(zs))))
    return C
def task(t):
    ci, cfg, n, fam = t
    t0 = time.time()
    rng = random.Random(7919*ci + n)
    c2 = dict(name=cfg['name'], base='zeta', zeros=cfg['zeros'], kind='x', order=cfg['order'])
    raw = search.gen_points(fam, n, c2, rng)
    r = k2.certify(lambda: [(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in raw], lambda: k2.make_M(k2.M_zeta, cfg['zeros']), (0, 0), precs=(512, 1024, 2048, 4096))
    r.update(name=cfg['name'], kind=cfg['kind'], pred=cfg['pred'], fam=fam, order=cfg['order'], sec=round(time.time()-t0, 1))
    return r
if __name__ == '__main__':
    out = sys.argv[1]; orders = [int(x) for x in sys.argv[2].split(',')]
    C = build(); tasks = []
    for n in orders:
        for ci, cfg in enumerate(C):
            tasks.append((ci, cfg, n, ('special', 'low', 'height')[(ci + n) % 3] if cfg['kind'] == 'sym' else ('special', 'low')[ci % 2]))
    nw = int(os.environ.get('RH_WORKERS', '4'))
    done = 0
    with Pool(nw) as p, open(out, 'w') as f:
        for r in p.imap_unordered(task, tasks, chunksize=1):
            f.write(json.dumps(r) + '\n'); f.flush(); done += 1
            if done % 20 == 0: print('done', done, 'of', len(tasks), time.strftime('%H:%M:%S')); sys.stdout.flush()
    print('FINISHED', done)
