import numpy as np, math, sys
from scipy.interpolate import CubicSpline
D = np.load(sys.argv[1]); T0 = float(D['T0']); d = D['d']; z = D['z']
cs = CubicSpline(d, z); r = np.sort(cs.roots(extrapolate=False)); r = r[np.isfinite(r)]
half = d.max(); exp = (half * math.log(T0 / (2 * math.pi)) + 0) / math.pi   # (theta(T0+half)-theta(T0-half))/pi to O(half^2/T0)
g = np.diff(r)
print('T0=%g samples=%d zeros=%d theta-count=%.2f gap mean %.5f min %.5f max %.5f max|Z| %.3f' % (T0, len(d), len(r), exp, g.mean(), g.min(), g.max(), np.abs(z).max()))
ex = cs.derivative().roots(extrapolate=False); print('smallest |Z| extrema:', np.sort(np.abs(cs(ex)))[:5])
np.savez(sys.argv[2], T0=T0, d=d, z=z, zeros=r)
