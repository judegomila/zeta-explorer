# c17 pre-registered search. Usage: search.py <plan> <outfile> [ntasks_scale]
# Every task: (config, family, n, T, seed) -> Gram matrix of K_T on n points -> certified inertia (ball LDL, adaptive precision).
# Planned memory: one Gram matrix of order <= 40 in acb at <= 4096 bits: 1600 * 2 * (4096/8 + 48) bytes < 2 MB; LDL copy the same;
# per worker < 200 MB including the interpreter; 16 workers < 4 GB. No dense allocation above 2 MB.
import sys, os, json, random, math, time
from multiprocessing import Pool
from flint import acb, arb, ctx
import k2

ZZ = [14.134725141734695, 21.022039638771556, 25.01085758014569, 30.424876125859512, 32.93506158773919,
      37.58617815882567, 40.918719012147495, 43.327073280914996, 48.00515088116716, 49.7738324776723]
ZNEAR = {100: [98.83119421819369, 101.31785100573138], 300: [299.84032605358747, 301.6493254621942],
         1000: [999.7915716337242, 1000.7140349238564], 50: [49.7738324776723, 52.970321477714464]}   # filled/verified by make_plan (mpmath)

T_GRID = [(0, 0), (0.05, 0), (0, 0.05), (0.3, 0.3), (1, 0), (0, 1), (1, 1), (3, 3)]
ETAS = [0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.45]
GS = [0.1, 0.5, 1, 3, 7, 14.2, 21, 30, 50, 100, 300, 1000]

def quartet(eta, g):
    return [('q', eta, g)]          # exact spec, expanded in ball arithmetic by k2.exact_zeros
def realpair(eta):
    return [('rp', eta)]
def approx_zeros(zs):
    out = []
    for z in zs:
        if isinstance(z, (tuple, list)) and z[0] in ('q', 'qd'):
            out += [complex(0.5-z[1], z[2]), complex(0.5-z[1], -z[2]), complex(0.5+z[1], z[2]), complex(0.5+z[1], -z[2])]
        elif isinstance(z, (tuple, list)) and z[0] == 'rp':
            out += [complex(0.5-z[1], 0), complex(0.5+z[1], 0)]
        else: out.append(complex(z))
    return out

def configs():
    C = []
    for eta in ETAS:
        C.append(dict(name='realpair(%g)' % eta, base='zeta', zeros=realpair(eta), kind='sym', order=2))
        for g in GS:
            C.append(dict(name='quartet(%g,%g)' % (eta, g), base='zeta', zeros=quartet(eta, g), kind='sym', order=4))
    # zeros placed at an exact zeta ordinate (quartet straddling a zeta zero)
    for eta in (0.01, 0.2, 0.45):
        C.append(dict(name='quartet(%g,gamma1)' % eta, base='zeta', zeros=quartet(eta, ZZ[0]), kind='sym', order=4))
    rng = random.Random(1717)
    for order in (6, 8, 10, 12, 16, 20):
        for rep in range(7):
            zs = []; cnt = 0
            while cnt < order:
                if order - cnt >= 4 and rng.random() < 0.8:
                    lo = rng.choice([(0.1, 3), (0.1, 40), (5, 1000)])
                    zs += quartet(rng.uniform(0.01, 0.45), math.exp(rng.uniform(math.log(lo[0]), math.log(lo[1])))); cnt += 4
                else:
                    zs += realpair(rng.uniform(0.01, 0.45)); cnt += 2
            C.append(dict(name='multi%d_%d' % (order, rep), base='zeta', zeros=zs, kind='sym', order=order))
    return C

def configs_ext():
    C = configs()[::3]
    for eta in (1e-3, 1e-6, 0.49, 0.499):          # outside the registered range of eta: near-double zeros on the line, and zeros near Re = 0, 1
        for g in (0.01, 1, 14.2):
            C.append(dict(name='xquartet(%g,%g)' % (eta, g), base='zeta', zeros=quartet(eta, g), kind='sym', order=4))
        C.append(dict(name='xrealpair(%g)' % eta, base='zeta', zeros=realpair(eta), kind='sym', order=2))
    return C

def controls():
    C = [dict(name='zeta', base='zeta', zeros=[], kind='ctl-pass', order=0)]
    for a in (0.55, 0.75, 0.9):
        C.append(dict(name='real1(%g)' % a, base='zeta', zeros=[complex(a, 0)], kind='ctl-fail', order=1))
    for a in (complex(0.2, 3), complex(0.4, 14.2), complex(0.05, 100)):
        C.append(dict(name='left(%g+%gi)' % (a.real, a.imag), base='zeta', zeros=[a, a.conjugate()], kind='ctl-fail', order=2))
    for dl in (1e-6, 1e-10, 1e-17, 1e-30):
        for (eta, g) in ((0.2, 0.1), (0.3, 3), (0.1, 30)):
            C.append(dict(name='mispair(%g,%g;%g)' % (eta, g, dl), base='zeta', zeros=[('qd', eta, g, dl)], kind='ctl-mispair', order=4))
    for a in (complex(0.8, 3), complex(0.55, 0.2), complex(1.6, 2), complex(0.7, 100)):
        C.append(dict(name='right(%g+%gi)' % (a.real, a.imag), base='zeta', zeros=[a, a.conjugate()], kind='ctl-right', order=2))
    C.append(dict(name='DH', base='dh', zeros=[], kind='ctl-dh', order=0))
    C.append(dict(name='toy', base='toy', zeros=[], kind='ctl-toy', order=0))
    for (eta, g) in ((0.3, 3), (0.05, 0.5), (0.45, 30)):
        C.append(dict(name='toy-quartet(%g,%g)' % (eta, g), base='toy', zeros=quartet(eta, g), kind='toy-sym', order=4))
    return C

def specials(cfg):
    S = approx_zeros(cfg['zeros'])
    gs = sorted(set(abs(z.imag) for z in S))
    zz = list(ZZ[:4])
    for g in gs:
        near = sorted(ZZ + sum(ZNEAR.values(), []), key=lambda y: abs(y-g))[:2]
        zz += near
    for y in set(zz):
        S += [complex(0.5, y), complex(0.5, -y)]
    S.append(complex(1, 0))
    return S

def gen_points(family, n, cfg, rng):
    S = specials(cfg)
    gs = sorted(set(abs(z.imag) for z in approx_zeros(cfg['zeros']))) or [0.0]
    def low():
        return complex(rng.uniform(0.02, 1.5), rng.uniform(-6, 6))
    def atheight():
        g = rng.choice(gs + [0.0]); sg = rng.choice([1, -1])
        return complex(rng.uniform(0.02, 1.5), sg*g + rng.uniform(-3, 3))
    def delta():
        r = 10**rng.uniform(-6, -1); th = rng.uniform(0, 2*math.pi)
        return complex(r*math.cos(th), r*math.sin(th))
    def ok(z1, z2):
        return z1.real > 1e-9 and z2.real > 1e-9 and abs(z1.imag) > 1e-12 and abs(z2.imag) > 1e-12 and abs((z1+z2).imag) > 1e-12
    pts = []
    centre = None
    tries = 0
    while len(pts) < n:
        tries += 1
        if tries > 100000: raise RuntimeError('gen_points')
        if family == 'low':
            z1, z2 = low(), low()
        elif family == 'height':
            z1, z2 = atheight(), atheight()
        elif family == 'special':
            pat = rng.randrange(6); s = rng.choice(S); s2 = rng.choice(S)
            if pat == 0: z2 = s + delta(); z1 = rng.choice([low, atheight])()
            elif pat == 1: z1 = s + delta(); z2 = rng.choice([low, atheight])()
            elif pat == 2:
                z2 = complex(rng.uniform(0.02, max(0.03, s.real-0.02)), rng.uniform(-6, 6)); z1 = s + delta() - z2
            elif pat == 3: z2 = s + delta(); z1 = s2 - s + delta()
            elif pat == 4: z2 = s + delta(); z1 = 1 - s + delta()
            else: z1 = 1 + delta(); z2 = s + delta()
        elif family == 'wall':
            z1, z2 = rng.choice([low, atheight])(), rng.choice([low, atheight])()
            eps = 10**rng.uniform(-6, -2)
            if rng.random() < 0.5: z1 = complex(eps, z1.imag)
            else: z2 = complex(eps, z2.imag)
        elif family == 'cluster':
            if centre is None:
                c1 = rng.choice(S) + 0.3*complex(rng.uniform(0, 1), rng.uniform(-1, 1)) if rng.random() < 0.5 else low()
                c2 = rng.choice(S) + 0.3*complex(rng.uniform(0, 1), rng.uniform(-1, 1)) if rng.random() < 0.5 else low()
                centre = (c1, c2, 10**rng.uniform(-2.5, -0.7))
            c1, c2, r = centre
            z1 = c1 + r*complex(rng.uniform(-1, 1), rng.uniform(-1, 1)); z2 = c2 + r*complex(rng.uniform(-1, 1), rng.uniform(-1, 1))
        elif family == 'polar':
            pat = rng.randrange(3); d = delta()*0.1
            if pat == 0:
                z2 = rng.choice(S + [low(), low()]) + delta(); z1 = 1 + d - z2
            elif pat == 1:
                z1 = 1 + d; z2 = rng.choice(S + [low(), low()]) + delta()
            else:
                z2 = 1 + d; z1 = rng.choice(S + [low(), low()]) + delta()
        elif family == 'realish':
            z1 = complex(rng.uniform(0.02, 2.5), 10**rng.uniform(-5, -2)*rng.choice([1, -1]))
            z2 = complex(rng.uniform(0.02, 2.5), 10**rng.uniform(-5, -2)*rng.choice([1, -1]))
        else:
            raise ValueError(family)
        if ok(z1, z2): pts.append((z1, z2))
    return pts

FAMILIES = ['low', 'height', 'special', 'wall', 'cluster', 'polar', 'realish']
BASES = {'zeta': k2.M_zeta, 'dh': k2.M_dh, 'toy': k2.M_toy}

def run_task(task):
    cfg, family, n, T, seed = task
    rng = random.Random(seed)
    raw = gen_points(family, n, cfg, rng)
    t0 = time.time()
    try:
        r = k2.certify(lambda: [(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in raw],
                       lambda: k2.make_M(BASES[cfg['base']], cfg['zeros']), T)
    except Exception as e:
        r = dict(status='error', err=repr(e)[:200], npos=0, nneg=0, n=n)
    r.update(cfg=cfg['name'], kind=cfg['kind'], order=cfg['order'], family=family, T=list(T), seed=seed, sec=round(time.time()-t0, 2))
    if r.get('nneg', 0) > 0 or r['status'] != 'ok':
        r['points'] = [[a.real, a.imag, b.real, b.imag] for (a, b) in raw]
        r['zeros'] = [list(z) if isinstance(z, (tuple, list)) else [complex(z).real, complex(z).imag] for z in cfg['zeros']]
    return r

def make_plan(plan, scale):
    tasks = []
    seed = 10**6*{'main': 1, 'controls': 2, 'bench': 3, 'ext': 4}[plan]
    if plan == 'bench':
        cfg = configs()[40]
        for fam in FAMILIES:
            for n in (12, 40):
                seed += 1; tasks.append((cfg, fam, n, (0, 0), seed))
        return tasks
    cfgs = configs() if plan == 'main' else (configs_ext() + controls() if plan == 'ext' else controls())
    sizes = [(1, 6), (2, 4), (3, 4), (5, 3), (8, 3), (12, 2), (20, 2), (40, 2)]   # (n, repetitions per (config, family, T-slot))
    if plan == 'ext': sizes = [(64, 1), (96, 0.5)]                                # beyond the registered size 40 (extension)
    for cfg in cfgs:
        for fam in FAMILIES:
            for (n, reps) in sizes:
                for rep in range(max(1, int(round(reps*scale)))):
                    # T slots: T = 0 always; one further T from the grid (cycled)
                    seed += 1; tasks.append((cfg, fam, n, T_GRID[0], seed))
                    seed += 1; tasks.append((cfg, fam, n, T_GRID[1 + (seed // 2) % (len(T_GRID)-1)], seed))
    return tasks

if __name__ == '__main__':
    plan = sys.argv[1]; outfile = sys.argv[2]; scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
    workers = int(os.environ.get('RH_WORKERS', '4'))
    tasks = make_plan(plan, scale)
    random.Random(99).shuffle(tasks)
    # optional: "tail K LIMIT_SEC": take the last K tasks of the shuffled list (the server job works from the front) and stop after LIMIT_SEC
    limit = None
    if len(sys.argv) > 6 and sys.argv[4] == 'tail':
        tasks = tasks[-int(sys.argv[5]):][::-1]; limit = float(sys.argv[6])
    print('plan', plan, 'tasks', len(tasks), 'workers', workers, 'planned memory per worker < 200 MB; largest allocation < 2 MB', flush=True)
    t0 = time.time(); done = 0; summ = {}; agg = {}
    def dump():
        json.dump(dict(plan=plan, scale=scale, tasks=len(tasks), done=done, sec=round(time.time()-t0), summary={'%s/%s' % k: v for k, v in sorted(summ.items())},
                       cells=[dict(kind=k[0], cfg=k[1], family=k[2], n=k[3], T=list(k[4]), count=v[0], pos=v[1], neg=v[2], undecided=v[3], min_log10_rel_pivot=v[4], max_prec=v[5]) for k, v in sorted(agg.items())]),
                  open(outfile + '.agg.json', 'w'))
    with open(outfile, 'w') as fo, Pool(workers, maxtasksperchild=2000) as pool:
        for r in pool.imap_unordered(run_task, tasks, chunksize=32):
            done += 1
            st = 'neg' if r.get('nneg', 0) > 0 else r['status']
            summ[(r['kind'], st)] = summ.get((r['kind'], st), 0) + 1
            k = (r['kind'], r['cfg'], r['family'], r['n'], tuple(r['T']))
            v = agg.setdefault(k, [0, 0, 0, 0, 0.0, 0])
            v[0] += 1; v[1] += (st == 'ok'); v[2] += (st == 'neg'); v[3] += (st not in ('ok', 'neg'))
            if 'log10_piv_min' in r: v[4] = min(v[4], r['log10_piv_min'] - r['log10_piv_max'])
            v[5] = max(v[5], r.get('prec', 0))
            if st != 'ok':
                fo.write(json.dumps(r) + '\n'); fo.flush()
                if r['kind'] == 'sym' and st == 'neg':
                    print('CANDIDATE FAILURE', json.dumps(r)[:400], flush=True)
            if done % 20000 == 0:
                dump(); print(done, len(tasks), round(time.time()-t0), {'%s/%s' % k: v for k, v in sorted(summ.items())}, flush=True)
            if limit is not None and time.time() - t0 > limit:
                print('time limit reached; stopping after', done, 'tasks', flush=True); pool.terminate(); break
    dump()
    print('DONE', done, round(time.time()-t0), {'%s/%s' % k: v for k, v in sorted(summ.items())}, flush=True)
