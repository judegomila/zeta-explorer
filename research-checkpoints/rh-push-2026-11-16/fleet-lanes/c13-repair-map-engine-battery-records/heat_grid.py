"""HEAT tau < 0 by Gaussian convolution of xi along the ordinate (independent of the Gauss-Legendre quadrature of heatlib.py).
F_tau(z) = int e^{tau u^2/16} kappa(u) e^{zu/2} du = E[ F_0(z + iY) ], Y ~ N(0, |tau|/2), F_0(z) = xi(1/2+z)/2.
Stage 1 (this file): W(X, t) = F_0(X + it) * exp(pi t/4) on the lattice X = 0, 0.05, .., 3.0; t = T0 + k h, h = 0.025, in complex128
(computed in 128-bit balls, then rounded). Usage: python heat_grid.py <out.npz> [workers]"""
import sys, math, time, numpy as np, multiprocessing as mp
from flint import acb, arb, ctx
H = 0.025; T0 = -8.0 + 0.0125; NT = int(round(2016.0 / H)); XS = [0.05 * i for i in range(61)]
def row(i):
    ctx.prec = 128
    X = arb(i) / 20; out = np.empty(NT, dtype=np.complex128); q = arb.pi() / 4
    for k in range(NT):
        t = arb(-8) + arb(1) / 80 + arb(k) / 40
        s = acb(arb(1) / 2 + X, t)
        v = s * (s - 1) / 2 * acb.pi() ** (-s / 2) * (s / 2).gamma() * s.zeta() * (q * abs(t)).exp()
        out[k] = complex(float(v.real.mid()), float(v.imag.mid()))
    return i, out
if __name__ == '__main__':
    W = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    print('planned allocation: %d x %d complex128 = %.1f MB' % (len(XS), NT, len(XS) * NT * 16 / 1e6), flush=True)
    t0 = time.time(); A = np.empty((len(XS), NT), dtype=np.complex128)
    with mp.get_context('fork').Pool(W) as p:
        for i, r in p.imap_unordered(row, range(len(XS))): A[i] = r
    np.savez(sys.argv[1], W=A, X=np.array(XS), t=T0 + H * np.arange(NT), h=H)
    print('done %.0f s' % (time.time() - t0), 'max|W|', np.abs(A).max(), 'min|W|', np.abs(A).min())
