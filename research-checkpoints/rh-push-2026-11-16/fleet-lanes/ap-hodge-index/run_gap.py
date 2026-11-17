# usage: run_gap.py <libdir> <h> <nmax> <ratio> <dps> <step>
# zeta: generalized eigenvalues of the pencil (I, G) on V_n = span of the first n Gaussians (G = L^2 Gram matrix).
# mu_1 > 0 is the single positive eigenvalue; gap = -mu_2 = distance of the rest of the spectrum from 0
# (the margin of the Hodge-index inequality relative to the L^2 norm).
import sys, time, mpmath as mp
sys.path.insert(0, sys.argv[1])
from hlib import *
import harch
h = mp.mpf(sys.argv[2]); n = int(sys.argv[3]); r = mp.mpf(sys.argv[4]); mp.mp.dps = int(sys.argv[5]); dps = mp.mp.dps; step = int(sys.argv[6])
s = r*h; v = 2*s*s; amp = s*mp.sqrt(mp.pi); c0 = amp*mp.sqrt(2*mp.pi*v)
Nmax = int(mp.exp(reach_of((n-1)*h, v, 0))) + 10
O = make_objects(Nmax, 10); obj = O['zeta']
T = harch.table_uniform(mp.mpf(1)/4, v, h, n, dps)
pp = [(mp.log(q), obj.lamfun(q)/mp.sqrt(q)) for q in range(2, Nmax+1) if obj.lamfun(q) != 0]
K = []; G = []
for j in range(n):
    d = j*h; g0 = amp*mp.exp(-d*d/(2*v)); A = obj.cond*g0 + T[j]*c0
    Pr = mp.mpf(0)
    for l, w in pp: Pr += w*(mp.exp(-(l-d)**2/(2*v)) + mp.exp(-(l+d)**2/(2*v)))
    K.append(Pr*amp - A); G.append(g0)
print('# zeta, h=%s s=%s dps=%d' % (sys.argv[2], mp.nstr(s, 4), dps))
print('# n  cutoff  mu_1 (positive)  mu_2 (largest non-positive)  mu_min')
for m in range(step, n+1, step):
    I = mp.matrix(m, m); Gm = mp.matrix(m, m)
    for j in range(m):
        for k in range(m): I[j, k] = K[abs(j-k)]; Gm[j, k] = G[abs(j-k)]
    Lc = mp.cholesky(Gm); Li = mp.inverse(Lc)
    M = Li*I*Li.T
    M = (M+M.T)/2
    E = sorted(mp.eigsy(M, eigvals_only=True))
    print('%3d  %s  %s  %s  %s   (number positive: %d)' % (m, mp.nstr((m-1)*h, 4), mp.nstr(E[-1], 6), mp.nstr(E[-2], 6), mp.nstr(E[0], 6), sum(1 for e in E if e > 0)), flush=True)
