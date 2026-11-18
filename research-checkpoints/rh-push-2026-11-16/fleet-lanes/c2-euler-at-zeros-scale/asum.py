# float64 screen: A_S at zeros and at shifted points; zeta, Liouville twist (at rho and rho/2), random unimodular twists
import sys, json, math, time, numpy as np
from multiprocessing import Pool
from elib import *
NSEED = 8
def eps_for(tw):
    if tw == 'zeta': return np.ones(len(PR), dtype=np.complex128)
    if tw in ('liou', 'liou_half'): return -np.ones(len(PR), dtype=np.complex128)
    rng = np.random.default_rng(1000 + int(tw[3:])); return np.exp(2j * math.pi * rng.random(len(PR)))
def task(a):
    key, tw, k = a
    gam = np.load('zeros_%s.npy' % key); d = shifts_spacing(gam); eps = eps_for(tw)
    if tw == 'liou_half': return cumlog(0.25, 0.5 * (gam + k / KSH * d), eps).real * 2   # points rho/2 + i delta/2
    return cumlog(0.5, gam + k / KSH * d, eps).real * 2
if __name__ == '__main__':
    keys = sys.argv[1:]; tws = ['zeta', 'liou', 'liou_half'] + ['rnd%d' % i for i in range(NSEED)]
    print('planned memory per worker: chunk 20000 x 128 complex x ~4 temporaries = %.0f MB; workers %d' % (20000 * 128 * 16 * 4 / 1e6, NW), flush=True)
    tasks = [(key, tw, k) for key in keys for tw in tws for k in range(KSH)]
    t0 = time.time()
    with Pool(NW) as pool: res = pool.map(task, tasks, chunksize=1)
    print('computed', len(tasks), 'tasks in', time.time() - t0, flush=True)
    R = dict(zip(tasks, res)); out = {}
    lpp = np.log(PR)
    for key in keys:
        gam = np.load('zeros_%s.npy' % key)
        for tw in tws:
            LA = np.stack([R[(key, tw, k)] for k in range(KSH)])  # (KSH, nP, N)
            if tw == 'zeta': np.save('la_zeta_%s.npy' % key, LA)
            eps = eps_for(tw)
            for ci, P in enumerate(CPS):
                n = CPI[ci]
                if tw == 'liou_half':
                    Mref = float(np.prod(1 / (1 - PR[:n] ** -0.5))) if P <= 1000 else None
                    c = float(np.sum(lpp[:n] / (PR[:n] - 1)))
                else:
                    Mref = float(np.prod(1 / (1 - 1 / PR[:n])))
                    c = float(np.sum((eps[:n] * lpp[:n] / (PR[:n] - eps[:n])).real))
                pred = lambda T, c=c: 1 - 2 * c / math.log(T / (2 * math.pi))
                X = np.exp(LA[:, ci, :])
                for ws in (500, 2000, len(gam)):
                    if ws > len(gam): continue
                    rows = win_stats(X, LA[:, ci, :], gam, ws, pred, Mref)
                    out['%s|%s|%d|%d' % (key, tw, P, ws)] = dict(c=c, Mref=Mref, rows=rows if ws >= 2000 else None,
                        **{kk: summarize(rows, kk) for kk in ('RU', 'Rhalf', 'Rref', 'Uref', 'RUhann', 'G', 'pred')})
                A = X.sum(axis=1); out['%s|%s|%d|profile' % (key, tw, P)] = (A / A.mean()).tolist()
    json.dump(out, open('asum_%s.json' % '_'.join(keys), 'w'))
    print('done', time.time() - t0)
