# Channel formula: [(1-L_b)^{-1} 1](x) = 2 psi^+(x+1)/zeta(2b),  value at 0: 2 zeta(2b-1)/zeta(2b).
import sys
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from common import *
from mpmath import fabs, eye
mp.dps = 50
N = 40
print("planned allocation: 4 mp matrices %dx%d per point"%(N, N))
for b in (mpc('0.3', '5'), mpc('0.4', '20'), mpc('0.3', '7.2'), mpc('0.75', '3'), mpc('0.5', '13.7797513519')):
    for a in (0, mpf('0.7')):
        L, xs = mayer(b, N, a)
        V = matrix(N, N)
        for p in range(N):
            for q in range(N): V[p, q] = xs[p]**q
        h = mp.lu_solve(eye(N) - L, matrix([1]*N))
        c = mp.lu_solve(V, h)
        s = 2*b
        line = "b=%s a=%s: [(1-L)^-1 1](0) = %s"%(mp.nstr(b, 12), mp.nstr(a, 3), mp.nstr(c[0], 15))
        if a == 0:
            pred = 2*zeta(s-1)/zeta(s)
            # full function check at the nodes: 2 psi^+(x+1)/zeta(s), psi^+ = psi + zeta(s)/2 (1+z^-s)
            ex = [2*(psi(x+1, s) + zeta(s)/2*(1+(x+1)**(-s)))/zeta(s) for x in xs]
            err = max(fabs(h[i]-ex[i]) for i in range(N))/max(fabs(e) for e in ex)
            line += "   2zeta(2b-1)/zeta(2b) = %s   sup rel err on nodes %s"%(mp.nstr(pred, 15), mp.nstr(err, 3))
        print(line, flush=True)
