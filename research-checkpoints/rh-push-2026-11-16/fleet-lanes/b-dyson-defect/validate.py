import numpy as np, sys, math
sys.path.insert(0, '.')
import rs_zeros as R, mpmath as mp
g = np.loadtxt('zeros6')
T0 = 1000000
delta, x, meta = R.run(T0, 20000, sys.argv[1] if len(sys.argv) > 1 else 'cpu')
mine = T0 + delta
ref = g[(g > mine[0] - 1e-6) & (g < mine[-1] + 1e-6)]
print('mine', len(mine), 'ref', len(ref))
if len(mine) == len(ref):
    print('max abs diff', np.abs(mine - ref).max(), 'min gap', np.diff(ref).min())
# spot check Z samples vs mpmath
mp.mp.dps = 30
for T in [10**8, 10**10, 10**12]:
    d = np.array([0.1234, 5.5, 77.7, 1000.25])
    z = R.sample_Z(T, d, 'cpu')
    zz = [float(mp.siegelz(mp.mpf(T) + mp.mpf(float(v)))) for v in d]
    print(T, np.abs(z - np.array(zz)).max(), z[:2], zz[:2])
