# Inertia of N^+ and N restricted to the pole line lam = (1, z) and to (z, 1), and to both (exact integers).
from xd import *
def line(specs, base='pole'):
    b = bpoly(specs, base); n = len(b)-1
    L = bezout(b); Lm = fmpz_mat(n, n, [x for r in L for x in r])
    bev = lambda u: sum(c*u**k for k, c in enumerate(b))
    def th(p, signed):
        acc = [[0]*n for _ in range(n)]
        for (x, sg) in orbit(p):
            w = (sg if signed else 1)*bev(-(x[0]+x[1]))
            if w == 0: continue
            for i in range(n):
                for j in range(n): acc[i][j] += w*x[0]**i*x[1]**j
        return fmpz_mat(n, n, [v for r in acc for v in r])
    def inert(pts, signed):
        T = [th(p, signed) for p in pts]; K = [Lm*t*Lm.transpose() for t in T]; M = len(pts)
        return inertia_int(fmpz_mat(M, M, [sum((T[i][a, c]*K[j][a, c] for a in range(n) for c in range(n)), fmpz(0)) for i in range(M) for j in range(M)]))[:2]
    K = 3*n+6
    l1 = [(1, z) for z in range(2, 2+K)]; l2 = [(z, 1) for z in range(2, 2+K)]
    return dict(n=n, Np_line1=inert(l1, False), Np_line2=inert(l2, False), Np_both=inert(l1+l2, False), N_line1=inert(l1, True), N_both=inert(l1+l2, True))
if __name__ == '__main__':
    for name, sp in (('sym real pair', [('r', '1/4')]), ('sym line pair', [('l', '3/2')]), ('sym quartet', [('q', '1/4', '1')]), ('sym d=6 q+l', [('q', '1/4', '1'), ('l', '2')]),
                     ('sym d=6 confluent', [('r', '1/3'), ('r', '1/3'), ('r', '0')]), ('sym d=8 two quartets', [('q', '1/4', '1'), ('q', '1/3', '2')]), ('sym d=8 near edge', [('q', '31/64', '1/8'), ('r', '7/16'), ('l', '5')]),
                     ('left pair', [('p', '1/5', '2')]), ('right pair', [('p', '4/5', '2')]), ('left+right', [('p', '1/5', '2'), ('p', '2/3', '1')]), ('quartet + left pair', [('q', '1/4', '1'), ('p', '1/5', '2')])):
        print(name, line(sp), flush=True)
