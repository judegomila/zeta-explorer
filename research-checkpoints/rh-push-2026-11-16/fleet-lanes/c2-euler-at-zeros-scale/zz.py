# zeta zeros with python-flint (rigorous isolation by acb.zeta_zeros); stores midpoints as float64
import sys, time, numpy as np
from multiprocessing import Pool
from flint import acb, arb, ctx
from elib import NW
PLAN = {'1e3': 2000, '1e4': 8000, '1e5': 20000, '1e6': 20000, '1e7': 20000, '1e8': 20000}
def chunk(a):
    n, m = a; ctx.prec = 80
    return [float(z.imag.mid()) for z in acb.zeta_zeros(n, m)], max(float(z.imag.rad()) for z in acb.zeta_zeros(n, 1))
if __name__ == '__main__':
    for key in sys.argv[1:]:
        ctx.prec = 80
        n0 = int(float(arb(float(key)).zeta_nzeros().mid())) + 1; cnt = PLAN[key]
        print(key, 'first index', n0, 'count', cnt, 'planned memory: %d floats = %.1f MB' % (cnt, cnt * 8e-6), flush=True)
        t = time.time()
        with Pool(NW) as pool: res = pool.map(chunk, [(n0 + i, 250) for i in range(0, cnt, 250)])
        g = np.array([x for r in res for x in r[0]]); assert np.all(np.diff(g) > 0)
        np.save('zeros_%s.npy' % key, g); open('zeros_%s.meta' % key, 'w').write('%d %d\n' % (n0, cnt))
        print(key, g[0], g[-1], 'sec', time.time() - t, flush=True)
