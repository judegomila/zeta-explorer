import math, numpy as np
from wlib import *
from symlib import make_object, lam_min
setprec(200)
N = 48
for twoa in ('1.9', '2.0', '2.1'):
    a = arb(twoa) / 2
    Alog, T = assemble_arch(N, [(a, ['0.25'])])
    M = arch_matrix(N, a, ['0.25'], Alog, T[0], logQ2=0) + eye(N) * (2 * arb(2).log())
    c = coef_tnr(14, 2, '2.2')
    for n in range(2, 15):
        C = rung(N, a, n)
        if C is not None and float(abs(c[n].mid())) != 0: M = M - (C + C.transpose()) * c[n]
    vp, vm = pole_vec(N, a, arb('0.5'), 1), pole_vec(N, a, arb('0.5'), -1)
    Mf = tofloat(M) + np.outer([float(x.mid()) for x in vp], [float(x.mid()) for x in vm]) + np.outer([float(x.mid()) for x in vm], [float(x.mid()) for x in vp])
    w = np.linalg.eigvalsh((Mf + Mf.T) / 2)
    o = make_object('TNR:2:2.2', math.exp(float(twoa)) + 1)
    print(twoa, 'legendre N=48:', w[0], ' frame:', lam_min(o, float(twoa) / 2, 120)[0][0], [ (n, float(c[n].mid())) for n in (2,4,8)])
