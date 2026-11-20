"""known-answer check of the stencil derivative: |zeta'(rho)| from mpmath against j1.zprime at the first zeros above 1e4 and 1e6 (CPU fallback)."""
import math, numpy as np, mpmath as mp, j1
mp.mp.dps = 25
for n0 in (10143, 1747147):
    g = [mp.zetazero(n0 + k).imag for k in range(4)]
    ref = np.array([float(abs(mp.zeta(mp.mpc(0.5, x), derivative=1))) for x in g])
    t = np.array([float(x) for x in g]); T0 = math.floor(t[0]) - 1.0
    zp = np.abs(j1.zprime(T0, t - T0, math.log(t[0] / (2 * math.pi))))
    print('zeros near', t[0], 'max relative error of |zeta\'(rho)|:', float(np.max(np.abs(zp / ref - 1))))
