# Duality check (exact integers). Jet space of polys of bidegree < n with Q = L (x) L.
#   jm_lam = sum_w sgn(w) b(-(w lam)_12) delta_{w lam},   jp_lam = sum_w b(-(w lam)_12) delta_{w lam}.
# Claims: Q(jp_lam, jm_mu) = 0;  Q(jm,jm) = 2N;  Q(jp,jp) = 2N^+ (N^+ = sum_{w,w'} psi psi a, no signs);
#         neg(N) + neg(N^+) + z = (negative index of Q) ,  pos(N) + pos(N^+) + z = (positive index of Q), z = dim of the common radical.
from xd import *
def dual(specs, base='pole', extra=6):
    b = bpoly(specs, base); n = len(b)-1
    L = bezout(b); Lm = fmpz_mat(n, n, [x for r in L for x in r])
    bev = lambda u: sum(c*u**k for k, c in enumerate(b))
    M = n*(n+1)//2 + extra
    pts = [(z1, s-z1) for s in range(2, 80) for z1 in range(1, s)][:M]
    def th(p, signed):
        acc = [[0]*n for _ in range(n)]
        for (x, sg) in orbit(p):
            w = (sg if signed else 1)*bev(-(x[0]+x[1]))
            if w == 0: continue
            for i in range(n):
                for j in range(n): acc[i][j] += w*x[0]**i*x[1]**j
        return fmpz_mat(n, n, [v for r in acc for v in r])
    Tm = [th(p, True) for p in pts]; Tp = [th(p, False) for p in pts]
    def gram(A, B):
        K = [Lm*T*Lm.transpose() for T in B]
        return fmpz_mat(M, M, [sum((A[i][a, c]*K[j][a, c] for a in range(n) for c in range(n)), fmpz(0)) for i in range(M) for j in range(M)])
    Gmm = gram(Tm, Tm); Gpp = gram(Tp, Tp); Gpm = gram(Tp, Tm)
    # direct 36-term check of 2N and 2N^+ at one off-diagonal pair of rational points
    from flint import fmpq
    psi = lambda x: bev(x[0])*bev(x[1])*bev(x[0]+x[1])
    lam, mu = pts[3], pts[7]
    Nm = sum((fmpq(sx*sy*psi(x)*psi(y), (x[0]+y[0])*(x[1]+y[1])) for (x, sx) in orbit(lam) for (y, sy) in orbit(mu) if psi(x)*psi(y) != 0), fmpq(0)) if all((x[0]+y[0])*(x[1]+y[1]) != 0 for (x, _) in orbit(lam) for (y, _) in orbit(mu)) else None
    Np = sum((fmpq(psi(x)*psi(y), (x[0]+y[0])*(x[1]+y[1])) for (x, sx) in orbit(lam) for (y, sy) in orbit(mu)), fmpq(0)) if Nm is not None else None
    iq = inertia_int(fmpz_mat(n*n, n*n, [L[i][k]*L[j][l] for i in range(n) for j in range(n) for k in range(n) for l in range(n)]))
    im = inertia_int(Gmm); ip = inertia_int(Gpp)
    # dimensions of J^- and J^+ (rank of the Theta families)
    dm = fmpz_mat(M, n*n, [T[i, j] for T in Tm for i in range(n) for j in range(n)]).rank()
    dp = fmpz_mat(M, n*n, [T[i, j] for T in Tp for i in range(n) for j in range(n)]).rank()
    return dict(n=n, Q=iq[:2], N=im[:2], Nplus=ip[:2], dimJm=int(dm), dimJp=int(dp), cross_zero=all(Gpm[i, j] == 0 for i in range(M) for j in range(M)),
                check2N=(None if Nm is None else bool(2*Nm == fmpq(Gmm[3, 7]))), check2Np=(None if Np is None else bool(2*Np == fmpq(Gpp[3, 7]))))
if __name__ == '__main__':
    import sys
    cases = [('sym real pair', [('r', '1/4')], 'pole'), ('sym line pair', [('l', '3/2')], 'pole'), ('sym quartet', [('q', '1/4', '1')], 'pole'), ('sym quartet near edge', [('q', '31/64', '1/8')], 'pole'),
             ('sym d=6 q+l', [('q', '1/4', '1'), ('l', '2')], 'pole'), ('sym d=6 confluent', [('r', '1/3'), ('r', '1/3'), ('r', '0')], 'pole'), ('sym d=8 two quartets', [('q', '1/4', '1'), ('q', '1/3', '2')], 'pole'),
             ('left pair', [('p', '1/5', '2')], 'pole'), ('right pair', [('p', '4/5', '2')], 'pole'), ('left+right', [('p', '1/5', '2'), ('p', '2/3', '1')], 'pole'),
             ('quartet + left pair', [('q', '1/4', '1'), ('p', '1/5', '2')], 'pole'), ('quartet outside strip', [('q', '3/4', '1')], 'pole'),
             ('quartet, base -1', [('q', '1/4', '1')], 'minus'), ('left pair, base +1', [('p', '1/5', '2')], 'plus')]
    for name, sp, base in cases: print(name, dual(sp, base), flush=True)
