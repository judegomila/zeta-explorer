"""Prime side (symlib) against the zero side for a modulated test function at height 1000 and at low height.
g(x) = e^{i g0 x} cos^2(pi x / 2a) = e_{g0}/2 + e_{g0+pi/a}/4 + e_{g0-pi/a}/4 ; ghat = O(t^-3)."""
import math, numpy as np, mpmath as mp
from symlib import *
def ghat(t, nu, c, a):
    d = t[:, None] - nu[None, :]
    with np.errstate(all='ignore'):
        s = np.where(np.abs(d) < 1e-12, 2 * a, 2 * np.sin(d * a) / d)
    return s @ c
def run(g0, a, zeros):
    nu = np.array([g0 - math.pi / a, g0, g0 + math.pi / a]); c = np.array([0.25, 0.5, 0.25])
    o = make_object('ZETA', math.exp(2 * a) + 1)
    A, B = symbols(o, nu, a); M, G = loewner(nu, A, B, a)
    prime_side = c @ M @ c
    zs = np.concatenate([zeros, -zeros])
    zero_side = float(np.sum(ghat(zs, nu, c, a) ** 2))
    print('g0 = %g, 2a = %g: prime side % .10f   zero side (%d zeros) % .10f   norm^2 %.6f' % (g0, 2 * a, prime_side, len(zeros), zero_side, c @ G @ c))
mp.mp.dps = 15
z_low = np.array([float(mp.zetazero(n).imag) for n in range(1, 301)])
run(20.0, 1.0, z_low); run(20.0, 2.0, z_low); run(30.0, 3.0, z_low)
z_hi = np.array([float(mp.zetazero(n).imag) for n in range(480, 831)])
print('zeros used near 1000: %.3f .. %.3f' % (z_hi[0], z_hi[-1]))
run(1000.0, 1.0, z_hi); run(1000.3, 2.0, z_hi); run(1000.0, 3.0, z_hi)
