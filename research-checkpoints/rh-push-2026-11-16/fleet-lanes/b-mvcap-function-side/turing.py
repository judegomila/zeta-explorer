"""Turing-style consistency check: S_c(t) = N_found(t) - theta-count(t) should have the same mean on every sub-interval; a missed pair shifts later means by -2."""
import numpy as np, math, sys
for f in sys.argv[1:]:
    D = np.load(f); T0 = float(D['T0']); zs = D['zeros']; half = D['d'].max()
    t = np.linspace(-half, half, 200001)
    th = (0.5 * t * math.log(T0 / (2 * math.pi)) + t * t / (4 * T0)) / math.pi
    S = np.searchsorted(zs, t, side='right') - (th - th[0])
    nb = 6; e = np.linspace(-half, half, nb + 1)
    means = [S[(t >= e[i]) & (t < e[i + 1])].mean() for i in range(nb)]
    print(f, 'zeros %d; sub-interval means of S_c (6 equal parts):' % len(zs), ' '.join('%+.3f' % m for m in means), '| spread %.3f | S_c range [%.2f, %.2f]' % (max(means) - min(means), S.min(), S.max()))
