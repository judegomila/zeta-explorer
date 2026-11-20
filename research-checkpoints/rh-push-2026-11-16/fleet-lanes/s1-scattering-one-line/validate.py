import sys, math, numpy as np, mpmath as mp
import lib
from lib import *
mp.mp.dps = 25
print('GPU', lib.GPU)
chi = [0, 1, 1j, -1j, -1]; chib = [0, 1, -1j, 1j, -1]
# evaluator A against mpmath
t = np.array([50.3, 1234.567, 30000.25]); sig = 0.42
R, Rd = hurwitz_batch(t, sig, 1)
for i, tt in enumerate(t):
    s = mp.mpc(sig, tt); z = mp.zeta(s); zd = mp.zeta(s, derivative=1)
    print('A zeta', tt, abs(R[0, i] - complex(z)), abs(Rd[0, i] - complex(zd)))
t = np.array([50.3, 1234.567])
R, Rd = hurwitz_batch(t, sig, 5)
for i, tt in enumerate(t):
    s = mp.mpc(sig, tt); L = mp.dirichlet(s, chi); Ld = mp.diff(lambda u: mp.dirichlet(u, chi), s)
    print('A Lchi', tt, abs(CHI5[1:] @ R[:4, i] - complex(L)), abs(CHI5[1:] @ Rd[:4, i] - complex(Ld)))
# evaluator B against A (sigma = 0.75, 1, 1.25; t = 2e4 .. 2e6) and against mpmath
for T in [2e4, 2e5, 2e6]:
    t = T + np.array([0.1, 77.7, 1234.5])
    o = oneline_batch(t, sigmas=(0.75, 1.0, 1.25))
    for sg in (0.75, 1.0, 1.25):
        R, _ = hurwitz_batch(t, sg, 1, want_deriv=False)
        print('B zeta sigma', sg, 'T', T, 'max err', np.abs(o['zeta'][sg] - R[0]).max(), 'bound scale', (T / 2 / math.pi) ** (-sg / 2))
    R, _ = hurwitz_batch(t, 1.0, 5, want_deriv=False)
    print('B Lchi T', T, np.abs(o['Lchi'] - CHI5[1:] @ R[:4]).max(), 'Lchibar', np.abs(o['Lchibar'] - np.conj(CHI5[1:]) @ R[:4]).max(), 'scale', (5 * T / 2 / math.pi) ** -0.5)
    R2, _ = hurwitz_batch(2 * t, 2.0, 1, want_deriv=False)
    print('B zeta2', np.abs(o['zeta2'] - R2[0]).max())
z = complex(mp.zeta(mp.mpc(1, 2e6 + 0.1)))
print('mp check zeta(1+i(2e6+0.1))', abs(z - hurwitz_batch(np.array([2e6 + 0.1]), 1.0, 1, want_deriv=False)[0][0, 0]))
# Dirichlet inverse
mu = mobius_upto(3000); a = np.ones(3001, dtype=complex); a[0] = 0
print('dirichlet inverse of 1 = mu:', np.abs(dirichlet_inverse(a, 3000) - mu).max())
