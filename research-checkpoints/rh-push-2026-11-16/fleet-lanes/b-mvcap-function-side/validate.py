import numpy as np, mpmath as mp, time
from scipy.interpolate import CubicSpline
D = np.load('z_3p1e12.npz'); d = D['d']; Z = D['z']; zs = D['zeros']; cs = CubicSpline(d, Z)
mp.mp.dps = 30
T0 = mp.mpf('3.1e12')
i = np.searchsorted(zs, -1.37773)
pts = [-1.3777343046762194, float(zs[i - 1]) - 0.004, float(zs[i]) + 0.004, 0.0, 37.123, -55.5]
print('close pair zeros:', zs[i - 1], zs[i], 'gap', zs[i] - zs[i - 1])
for x in pts:
    t1 = time.time(); v = mp.siegelz(T0 + mp.mpf(x)); print('tau=%+.6f  RS-double %.9f  mpmath %.9f  diff %.2e  (%.0fs)' % (x, float(cs(x)), float(v), float(cs(x)) - float(v), time.time() - t1), flush=True)
for x in [0.0, -1.3777]:
    v = mp.zeta(mp.mpc(2, T0 + x)); print('zeta(2+i(T0%+.4f)) = %s abs %.9f' % (x, mp.nstr(v, 12), abs(v)), flush=True)
