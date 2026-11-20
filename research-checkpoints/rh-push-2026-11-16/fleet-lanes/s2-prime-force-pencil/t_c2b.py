import numpy as np, mpmath as mp, math, lib
g, cond, s0 = lib.load_list('zeta'); g = g[:20001]
mp.mp.dps = 20
for W in (40, 200):
    x, s, k, tight = lib.near_collisions(g, W=W)
    for lo, hi in ((0, 40), (200, 230), (len(x) // 4, len(x) // 4 + 30), (len(x) - 200, len(x) - 170)):
        err = []
        for i in range(lo, hi):
            xs = float(mp.findroot(lambda t: mp.siegelz(t, derivative=1), x[i])); err.append(abs(xs - x[i]) / (g[k[i] + 1] - g[k[i]]))
        print('W=%d heights %.1f..%.1f: |dx|/gap max %.3e mean %.3e' % (W, x[lo], x[hi - 1], max(err), np.mean(err)))
