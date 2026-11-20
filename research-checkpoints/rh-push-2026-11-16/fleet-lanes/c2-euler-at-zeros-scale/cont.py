# continuous reference: mean of |zeta_S(1/2+it)|^2 over a uniform t-grid (16 points per zero) across each window
import sys, json, math, time, numpy as np
from multiprocessing import Pool
from elib import *
def task(a):
    key, j = a; gam = np.load('zeros_%s.npy' % key); N = len(gam)
    tt = np.linspace(gam[0], gam[-1], 16 * N, endpoint=False)[j::16]
    return np.exp(2 * cumlog(0.5, tt, np.ones(len(PR), dtype=np.complex128)).real)
if __name__ == '__main__':
    keys = sys.argv[1:]; t0 = time.time(); out = {}
    print('planned memory per worker: 20000 x 128 complex x 4 = 164 MB; workers', NW, flush=True)
    tasks = [(k, j) for k in keys for j in range(16)]
    with Pool(NW) as pool: res = dict(zip(tasks, pool.map(task, tasks, chunksize=1)))
    for key in keys:
        gam = np.load('zeros_%s.npy' % key); N = len(gam); LA = np.load('la_zeta_%s.npy' % key)  # (KSH, nP, N)
        tt = np.linspace(gam[0], gam[-1], 16 * N, endpoint=False)
        X = np.zeros((len(CPS), 16 * N))
        for j in range(16): X[:, j::16] = res[(key, j)]
        for ci, P in enumerate(CPS):
            M = float(np.prod(1 / (1 - 1 / PR[:CPI[ci]]))); A0 = np.exp(LA[0, ci, :])
            for ws in (500, 2000, N):
                if ws > N: continue
                rc = []; cm = []
                for w in range(N // ws):
                    lo = gam[w * ws]; hi = gam[(w + 1) * ws - 1]; m = (tt >= lo) & (tt <= hi)
                    c = X[ci, m].mean(); rc.append(A0[w * ws:(w + 1) * ws].mean() / c); cm.append(c / M)
                out['%s|%d|%d' % (key, P, ws)] = dict(Rcont=dict(mean=float(np.mean(rc)), min=float(np.min(rc)), max=float(np.max(rc)), sd=float(np.std(rc, ddof=1)) if len(rc) > 1 else 0.0, rows=rc if ws >= 2000 else None),
                                                      contOverM=dict(mean=float(np.mean(cm)), min=float(np.min(cm)), max=float(np.max(cm))))
    json.dump(out, open('cont.json', 'w')); print('done', time.time() - t0)
