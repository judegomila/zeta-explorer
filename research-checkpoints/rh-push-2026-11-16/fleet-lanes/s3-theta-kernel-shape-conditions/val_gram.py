# validation of t_gram.py: (i) Lemma 1.1, D_t(x) = int Q_t(v) cos(2xv) dv, on the grid objects;
# (ii) Levinson pivots against numpy eigenvalues of the same Toeplitz matrix (float64, small case).
import math, numpy as np
from flint import arb
import klib3 as K3, t_gram as G
for name, t in (('zeta', '0'), ('dh', '0.1'), ('tnr3_2.2', '0')):
    prec = 600
    Kt, hh = G.tgrid(name, t, 256, prec)
    q = G.qvals(Kt, hh, 1, 10**6)
    J = len(Kt) - 1
    for x in (3.0, 11.5):
        xx = arb(x)
        H = Kt[0]/2; H1 = arb(0); H2 = arb(0)
        for j in range(1, J + 1):
            c = (xx*hh*j).cos(); s = (xx*hh*j).sin()
            H += Kt[j]*c; H1 -= hh*j*Kt[j]*s; H2 -= (hh*j)**2*Kt[j]*c
        H, H1, H2 = 2*hh*H, 2*hh*H1, 2*hh*H2
        D = H1*H1 - H*H2
        S = q[0]/2
        for k in range(1, len(q)):
            S += q[k]*(2*xx*hh*k).cos()
        S = 2*hh*S
        print('%-9s t=%s x=%.1f  D = %s   int Q cos = %s   rel diff %.2e' % (name, t, x, D.str(20), S.str(20), abs(float(((D - S)/D).mid()))))
r = G.run_gram('tnr3_2.2', '0', 32, 60, 512)
print('tnr gram: first negative pivot size', r['first_negative_pivot_size'], 'neg counts', r['neg_count_by_n'])
Kt, hh = G.tgrid('tnr3_2.2', '0', 512, 700)
q = [float(v.mid()) for v in G.qvals(Kt, hh, 32, 60)]
for n in (20, 25, 26, 30, 50):
    T = np.array([[q[abs(i - j)] if abs(i - j) < len(q) else 0.0 for j in range(n)] for i in range(n)])
    ev = np.linalg.eigvalsh(T)
    print('numpy n=%d  min eig/q0 = %.3e  #neg = %d' % (n, ev[0]/q[0], int((ev < 0).sum())))
