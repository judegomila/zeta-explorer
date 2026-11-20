# Dual certificate on every symmetric configuration of the campaign plan (exact integers):
#   (i)  N^+ restricted to the pole line lam = (1, z): inertia, expected (1, d);
#   (ii) N restricted to the pole line: inertia, expected (d-1, 0);
#   (iii) Q(j+,j+) + Q(j-,j-) = 4 Q(E,E) i.e. N + N^+ = 2 Q(E_z,E_z') on the pole line, E_z = b(-1-z) delta_(1,z) + b(z) delta_(-1-z,1): at most one positive square.
# By Theorem C (RESULT.md), neg(N) <= 2d - z - neg(N^+), z >= d for simple symmetric zeros, so neg(N^+ on the line) >= d certifies N >= 0.
import json, sys, os, time
from multiprocessing import Pool
from xd import *
from campaign import tasks, predict
def one(t):
    specs = [tuple(s) for s in t['specs']]; b = bpoly(specs, 'pole'); n = len(b)-1; d = n-1
    L = bezout(b); Lm = fmpz_mat(n, n, [x for r in L for x in r])
    bev = lambda u: sum(c*u**k for k, c in enumerate(b))
    def th(terms):
        acc = [[0]*n for _ in range(n)]
        for (w, x) in terms:
            if w == 0: continue
            for i in range(n):
                for j in range(n): acc[i][j] += w*x[0]**i*x[1]**j
        return fmpz_mat(n, n, [v for r in acc for v in r])
    M = n+8; zs = list(range(2, 2+M))
    Tp = [th([(bev(-(x[0]+x[1])), x) for (x, sg) in orbit((1, z))]) for z in zs]
    Tm = [th([(sg*bev(-(x[0]+x[1])), x) for (x, sg) in orbit((1, z))]) for z in zs]
    Te = [th([(bev(-1-z), (1, z)), (bev(z), (-1-z, 1))]) for z in zs]
    def G(A, B):
        K = [Lm*T*Lm.transpose() for T in B]
        return fmpz_mat(M, M, [sum((A[i][a, c]*K[j][a, c] for a in range(n) for c in range(n)), fmpz(0)) for i in range(M) for j in range(M)])
    Gp = G(Tp, Tp); Gm = G(Tm, Tm); Ge = G(Te, Te)
    return dict(id=t['id'], d=d, cat=t['cat'], Np_line=inertia_int(Gp)[:2], N_line=inertia_int(Gm)[:2], E=inertia_int(Ge)[:2], identity=bool(Gp+Gm == 4*Ge))
if __name__ == '__main__':
    T = [t for t in tasks() if t['kind'] == 'sym']
    if len(sys.argv) > 2: T = [t for t in T if predict([tuple(s) for s in t['specs']])['d'] <= int(sys.argv[2])]
    t0 = time.time()
    with Pool(int(os.environ.get('RH_WORKERS', '6'))) as P, open(sys.argv[1], 'w') as f:
        for r in P.imap_unordered(one, T): f.write(json.dumps(r)+'\n'); f.flush()
    R = [json.loads(l) for l in open(sys.argv[1])]
    print('configs', len(R), 'identity ok', sum(r['identity'] for r in R), 'Np_line == (1,d)', sum(r['Np_line'] == [1, r['d']] for r in R), 'N_line == (d-1,0)', sum(r['N_line'] == [r['d']-1, 0] for r in R),
          'E pos <= 1', sum(r['E'][0] <= 1 for r in R), 'time', round(time.time()-t0))
    bad = [r for r in R if r['Np_line'][1] < r['d']]; print('configs with fewer than d negative squares of N^+ on the line:', len(bad), bad[:5])
