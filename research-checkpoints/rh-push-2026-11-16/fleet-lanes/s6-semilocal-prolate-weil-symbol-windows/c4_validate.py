"""validation of c4_hodge.build against the zero side: Z(d) = sum over zeros c0 e^(-v g^2/2) e^(i g d) (zeta; first zeros from mpmath)"""
import os, math, numpy as np
os.environ['S6_NUMPY'] = '1'
import mpmath as mp, c4_hodge
s = 0.2; M = 40
Z, o = c4_hodge.build('zeta', s, M, verbose=False)
v = 2 * s * s; c0 = 2 * math.pi * s * s
g = [float(mp.zetazero(k).imag) for k in range(1, 12)]
x = np.log(np.arange(1, M + 1)); D = x[:, None] - x[None, :]
Zz = sum(2 * c0 * math.exp(-v * gg * gg / 2) * np.cos(gg * D) for gg in g)
print('zeta, s = 0.2, M = 40: max |Z_float - Z_zeros| = %.3e, max |Z| = %.3e (11 zeros; next term %.1e)' % (np.max(np.abs(Z - Zz)), np.max(np.abs(Zz)), 2 * c0 * math.exp(-v * 56.4 ** 2 / 2)))
