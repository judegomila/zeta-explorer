"""debug: full spectrum (mpmath eigsy, high precision) of the zeta even-sector full form and pole-free block"""
import sys, math, json
import mpmath as mp
from slib import *
N = int(sys.argv[1]); PREC = int(sys.argv[2]); s = sys.argv[3]; DIG = int(sys.argv[4])
setprec(PREC); mp.mp.prec = PREC
a = arb(s) / 2; af = float(s) / 2
Q = N + extra_nodes(af, DIG)
Alog, T = stage1_nodes(N, Q, list(range(Q)), [s], ['0.25'])
K = int(math.exp(float(s))) + 1
cz = coef_zeta(K)
ce, so = pole_vectors(N, a, '0.5')
def tomp(M):
    d = M.nrows(); X = mp.matrix(d, d)
    for i in range(d):
        for j in range(d): X[i, j] = mp.mpf(M[i, j].mid().str(int(PREC * 0.3), radius=False))
    return (X + X.T) / 2
for par in (0, 1):
    d = len(par_idx(N, par))
    X = arch_block(d, a, ['0.25'], Alog[par], [T[(s, '0.25')][par]], arb(0))
    for n in range(2, K + 1):
        if float(cz[n].mid()) != 0 and arb(n).log() < 2 * a:
            X = X - sblocks(arb(n).log() / a, N)[par] * (cz[n] / arb(n).sqrt())
    Mfull = X + outer(ce if par == 0 else so, arb(2 if par == 0 else -2))
    sc = schur(Mfull, [ce if par == 0 else so])
    E1 = mp.eigsy(tomp(Mfull), eigvals_only=True); E2 = mp.eigsy(tomp(sc['D']), eigvals_only=True)
    print('par', par, 'full lowest 4:', [mp.nstr(E1[i], 5) for i in range(4)], ' mine:', lowest(Mfull)['lam'])
    print('par', par, 'pole-free lowest 4:', [mp.nstr(E2[i], 5) for i in range(4)], ' mine:', lowest(sc['D'])['lam'])
    S = schur_complement(sc['D'], sc['B'], sc['E']); print('   S', fstr(S[0][0]), 'radius', float(S[0][0].rad()))
    # orthonormality of Z and Z^T u
    Z = sc['Z']; G = Z.transpose() * Z; print('   |Z^T Z - I| max', max(abs(float((G[i, j] - (1 if i == j else 0)).mid())) for i in range(G.nrows()) for j in range(G.ncols())),
       ' |Z^T u| max', max(abs(float(x.mid())) for x in (Z.transpose() * sc['U']).entries()))
