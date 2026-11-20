# Adversarial descent on the diagonal at T = 0: minimise q(lam) = K_0(lam,lam) / (sum of |terms|) over the open chamber, symmetric insertions.
# q < 0 at one point would be a failure of order 1 (then re-certified at 1024 bits). Random-restart pattern search, arb midpoints at 160 bits.
# Planned memory: < 100 MB per worker.
import sys, os, json, random, math
from multiprocessing import Pool
from flint import acb, arb, ctx
import k2, search
def q(pt, M):
    z1 = acb(pt[0], pt[1]); z2 = acb(pt[2], pt[3])
    o = k2.orbit((z1, z2), M, (0, 0))
    s = acb(0); tot = arb(0)
    for (a, b, c) in o:
        for (a2, b2, c2) in o:
            t = c*c2.conjugate()/((a+a2.conjugate())*(b+b2.conjugate()))
            s += t; tot += abs(t)
    return float(s.real.mid())/float(tot.mid())
def work(a):
    cfg, seed, starts, steps = a
    ctx.prec = 160
    rng = random.Random(seed)
    M = k2.make_M(k2.M_zeta, cfg['zeros'])
    S = search.specials(cfg)
    best = (1e9, None)
    for st in range(starts):
        if st % 2 == 0:
            p = [rng.uniform(0.01, 2), rng.uniform(-8, 8), rng.uniform(0.01, 2), rng.uniform(-8, 8)]
        else:
            s = rng.choice(S); s2 = rng.choice(S + [complex(1, 0)])
            p = [abs(s2.real - s.real) + 0.01 if rng.random() < 0.5 else rng.uniform(0.01, 2), s2.imag - s.imag if rng.random() < 0.5 else rng.uniform(-8, 8), s.real, s.imag]
            p = [x + rng.gauss(0, 0.05) for x in p]
        p[0] = max(p[0], 1e-4); p[2] = max(p[2], 1e-4)
        if abs(p[1]) < 1e-9: p[1] = 1e-3
        if abs(p[3]) < 1e-9: p[3] = 1e-3
        try: v = q(p, M)
        except Exception: continue
        h = 0.2
        for it in range(steps):
            improved = False
            for k in range(4):
                for sgn in (1, -1):
                    p2 = p[:]; p2[k] += sgn*h
                    if p2[0] < 1e-6 or p2[2] < 1e-6: continue
                    try: v2 = q(p2, M)
                    except Exception: continue
                    if v2 < v: p, v, improved = p2, v2, True
            if not improved:
                h *= 0.5
                if h < 1e-7: break
        if v < best[0]: best = (v, p)
    return dict(cfg=cfg['name'], seed=seed, min_q=best[0], argmin=best[1])
if __name__ == '__main__':
    workers = int(os.environ.get('RH_WORKERS', '6'))
    cfgs = [c for c in search.configs() if c['order'] in (2, 4)][::2] + [c for c in search.configs() if c['order'] > 4][::6]
    tasks = [(c, 100 + i, 60, 60) for i, c in enumerate(cfgs)]
    print('configs', len(cfgs), 'starts per config 60, steps <= 60', flush=True)
    res = []
    with Pool(workers) as pool:
        for r in pool.imap_unordered(work, tasks):
            res.append(r)
    res.sort(key=lambda r: r['min_q'])
    neg = [r for r in res if r['min_q'] < 0]
    print('configs with negative q:', len(neg)); print('lowest five:', [(r['cfg'], '%.3e' % r['min_q']) for r in res[:5]])
    json.dump(res, open('adv_diag.json', 'w'), indent=0)
