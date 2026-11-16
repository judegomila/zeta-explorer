import numpy as np, sys, math
sys.path.insert(0, '.')
import rs_zeros as R
g = np.loadtxt('zeros6')
for T0 in [1000000, 300000]:
    delta, x, meta = R.run(T0, 20000, sys.argv[1], log=lambda s: None)
    mine = T0 + delta
    ref = g[(g > mine[0] - 1e-6) & (g < mine[-1] + 1e-6)]
    d = np.abs(mine - ref)
    print(T0, len(mine), len(ref), 'median', np.median(d), 'p99', np.quantile(d, .99), 'max', d.max(), 'n>1e-6', (d > 1e-6).sum(), 'n>1e-4', (d > 1e-4).sum())
    i = np.argsort(d)[-5:]
    for j in i: print('   ', mine[j], ref[j], d[j], 'gaps', ref[j]-ref[j-1], ref[j+1]-ref[j])
    xr = R.dtheta(T0, ref - T0) / math.pi
    print('   unfolded mean gap', np.diff(xr).mean())
