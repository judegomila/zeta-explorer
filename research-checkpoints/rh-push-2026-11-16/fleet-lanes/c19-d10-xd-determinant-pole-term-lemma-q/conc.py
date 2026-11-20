# Jet space model with real rational simple roots. Q(delta_x, delta_y) = L(x1,y1) L(x2,y2).
#   jm_lam = sum_w sgn(w) b(-(w lam)_12) delta_{w lam}   (spans J^-; N(lam,mu) = (1/2) Q(jm_lam, jm_mu))
#   v_ij = 2 b(-r_i-r_j) delta_{(r_i,r_j)} - jm_{p_ij}   (in the Q-orthogonal complement of J^-)
# Checks: (a) N = (1/2) Q(jm, jm) against the 36-term formula; (b) Q(v_a, jm_mu) = 0;
# (c) concentration: neg(N) = neg of the Gram of N on the 2d+1 crossing points (0,0),(0,j),(j,0);
# (d) inertia of Gram(v_a) on index subsets.
from flint import fmpq
import random, sys
from xd import inertia_q, orbit
def setup(r):
    def b(u):
        p = fmpq(1)
        for t in r: p *= (u-t)
        return p
    co = [fmpq(1)]
    for t in r:
        co = [(co[k-1] if k >= 1 else 0) - t*(co[k] if k < len(co) else 0) for k in range(len(co)+1)]
    from xd import bezout
    Lc = bezout(co); nn = len(r)
    def L(x, y):
        if x+y != 0: return (b(x)*b(y)-b(-x)*b(-y))/(x+y)
        return sum((Lc[i][j]*x**i*y**j for i in range(nn) for j in range(nn)), fmpq(0))
    Q = lambda x, y: L(x[0], y[0])*L(x[1], y[1])
    def jm(lam): return [(sg*b(-(x[0]+x[1])), x) for (x, sg) in orbit(lam) if b(-(x[0]+x[1])) != 0]
    def pair(u, v): return sum((cu*cv*Q(x, y) for (cu, x) in u for (cv, y) in v), fmpq(0))
    psi = lambda x: b(x[0])*b(x[1])*b(x[0]+x[1])
    def N(lam, mu): return sum((sx*sy*psi(x)*psi(y)/((x[0]+y[0])*(x[1]+y[1])) for (x, sx) in orbit(lam) for (y, sy) in orbit(mu)), fmpq(0))
    def v(i, j):
        p = (r[i], r[j]); return [(2*b(-r[i]-r[j]), p)] + [(-c, x) for (c, x) in jm(p)]
    return b, Q, jm, pair, N, v
def gram(vs, pair): return [[pair(a, c) for c in vs] for a in vs]
def study(r, label):
    n = len(r); d = n-1; b, Q, jm, pair, N, v = setup(r); rng = random.Random(7)
    lam = (fmpq(3, 7), fmpq(5, 11)); mu = (fmpq(2, 13), fmpq(9, 17))
    okA = (2*N(lam, mu) == pair(jm(lam), jm(mu)))
    okB = all(pair(v(i, j), jm(mu)) == 0 for i in range(n) for j in range(n))
    # inertia of N: Gram of jm at enough generic points
    pts = [(fmpq(rng.randint(1, 300), rng.randint(7, 90)), fmpq(rng.randint(1, 300), rng.randint(7, 90))) for _ in range(n*(n-1)//2+4)]
    inN = inertia_q(gram([jm(p) for p in pts], pair))
    I0 = [(0, j) for j in range(1, n)] + [(j, 0) for j in range(1, n)]
    def gN(idx): return inertia_q(gram([jm((r[i], r[j])) for (i, j) in idx], pair))
    def gV(idx): return inertia_q(gram([v(i, j) for (i, j) in idx], pair))
    allp = [(i, j) for i in range(n) for j in range(n)]; LL = [(i, j) for i in range(1, n) for j in range(1, n)]
    print(label, [str(x) for x in r], '| N=(1/2)Q(j,j):', okA, '| v in Jperp:', okB, '| inertia N', inN,
          '| Gram N on I0+00', gN(I0+[(0, 0)]), 'on I0', gN(I0), '| Gram v: all', gV(allp), 'I0', gV(I0), 'I0+00', gV(I0+[(0, 0)]), 'LL', gV(LL), flush=True)
if __name__ == '__main__':
    rng = random.Random(11); F = fmpq
    for d in (1, 2, 3, 4):
        for rep in range(3):
            a = sorted(set(F(rng.randint(1, 63), 64) for _ in range(d)))
            if len(a) < d or any(x+y == 1 for x in a for y in a) or any(2*x+y == 1 or x == 2*y for x in a for y in a) : continue
            left = sum(1 for x in a if x < F(1, 2))
            study([F(1)]+[-x for x in a], 'generic d=%d left=%d' % (d, left))
    study([F(1), F(-1, 4), F(-3, 4)], 'SYM d=2')
    study([F(1), F(-1, 4), F(-3, 4), F(-1, 3), F(-2, 3)], 'SYM d=4')
    study([F(1), F(-1, 4), F(-3, 4), F(-1, 5)], 'sym pair + left 1/5')
    study([F(1), F(-1, 4), F(-3, 4), F(-4, 5)], 'sym pair + right 4/5')
