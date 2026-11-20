# off-endpoint share for further real primitive characters (envelope of the L-function class) and T-NR
import sys, math, numpy as np
sys.path.insert(0, '../s1-kernel-shear-norms')
from klib import kron_char
from glib import KERNELS, phi_F, gl, autocorr
edges = [0.0, 0.05, 0.1, 0.2, 0.4, 0.7, 1.0, 1.5, 2.0, 3.0, 4.5, 6.0]
def off(phi, alist=(0.01, 1.0, 5.0, 20.0)):
    gs, ws, As = [], [], []
    for lo, hi in zip(edges[:-1], edges[1:]):
        g, w = gl(200, lo, hi); gs.append(g); ws.append(w); As.append(autocorr(phi, g, n=2000))
    g = np.concatenate(gs); w = np.concatenate(ws); A = np.concatenate(As)
    return [float((A*np.sinh(a*g)*w)[g >= 0.1].sum()/(A*np.sinh(a*g)*w).sum()) for a in alist], float(A.min()/A.max())
for nm in ('zeta', 'DH', 'T-NR(3,2.2)'):
    print('%-12s' % nm, ['%.4f' % x for x in off(KERNELS[nm])[0]])
for D in (-3, -4, 5, -7, 8, -11, 13, -19, -23, 29, -43, -67, -163):
    b, d = kron_char(D); q = abs(D)
    o, mn = off(lambda u: phi_F(u, b, q, d))
    print('chi_%-5d   ' % D, ['%.4f' % x for x in o], ' min A/max A %.1e' % mn)
