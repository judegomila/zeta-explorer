# Exact rational arithmetic for the rational model, general denominator polynomial b.
# M(u) = -b(-u)/b(u) when b has no factor u convention: cocycle c(w,lam) = sgn(w) psi(w lam)/psi(lam),
# psi(x) = b(x1) b(x2) b(x1+x2).  N(lam,mu) = psi(lam) psi(mu) K_0(lam,mu) = sum sgn sgn psi(w lam) psi(w' mu)/(nu1 nu2).
from flint import fmpq, fmpq_mat
import random
def q(a, b=1): return fmpq(a, b)
def orbit(l):
    z1, z2 = l
    return [((z1, z2), 1), ((-z1, z1+z2), -1), ((z1+z2, -z2), -1), ((z2, -z1-z2), 1), ((-z1-z2, z1), 1), ((-z2, -z1), -1)]
def mkb(roots):
    def b(u):
        r = q(1)
        for t in roots: r *= (u - t)
        return r
    return b
def mkpsi(b):
    return lambda x: b(x[0])*b(x[1])*b(x[0]+x[1])
def N(lam, mu, psi):
    s = q(0)
    ol = [(x, sg*psi(x)) for (x, sg) in orbit(lam)]
    om = [(x, sg*psi(x)) for (x, sg) in orbit(mu)]
    for (x, cx) in ol:
        if cx == 0: continue
        for (y, cy) in om:
            if cy == 0: continue
            s += cx*cy/((x[0]+y[0])*(x[1]+y[1]))
    return s
def Delta(l): return l[0]*l[1]*(l[0]+l[1])
def I2(l): return l[0]*l[0]+l[0]*l[1]+l[1]*l[1]
def I3(l): return (2*l[0]+l[1])*(l[0]-l[1])*(l[0]+2*l[1])
def basis(maxdeg): return [(a, b) for b in range(0, maxdeg//3+1) for a in range(0, maxdeg//2+1) if 2*a+3*b <= maxdeg]
def inv(l, B):
    i2, i3 = I2(l), I3(l)
    return [i2**a*i3**b for (a, b) in B]
def rpt(rng): return (q(rng.randint(1, 900), rng.randint(7, 197)), q(rng.randint(1, 900), rng.randint(7, 197)))
def fitH(roots, seed=5, ntest=6):
    n = len(roots); B = basis(3*(n-1)); m = len(B); rng = random.Random(seed)
    psi = mkpsi(mkb(roots))
    P1 = [rpt(rng) for _ in range(m)]; P2 = [rpt(rng) for _ in range(m)]
    V1i = fmpq_mat(m, m, [x for p in P1 for x in inv(p, B)]).inv(); V2i = fmpq_mat(m, m, [x for p in P2 for x in inv(p, B)]).transpose().inv()
    Pm = fmpq_mat(m, m, [N(a, c, psi)/(Delta(a)*Delta(c)) for a in P1 for c in P2])
    H = V1i*Pm*V2i
    bad = 0
    for _ in range(ntest):
        a, c = rpt(rng), rpt(rng)
        lhs = N(a, c, psi)/(Delta(a)*Delta(c)); ia, ic = inv(a, B), inv(c, B)
        if lhs != sum((H[i, j]*ia[i]*ic[j] for i in range(m) for j in range(m)), q(0)): bad += 1
    return H, B, bad
def inertia(H):
    n = H.nrows(); A = [[H[i, j] for j in range(n)] for i in range(n)]; live = list(range(n)); pos = neg = 0
    while True:
        k = next((i for i in live if A[i][i] != 0), None)
        if k is not None:
            d = A[k][k]; pos += d > 0; neg += d < 0; live.remove(k)
            for i in live:
                f = A[i][k]/d
                if f != 0:
                    for j in live: A[i][j] -= f*A[k][j]
            continue
        pr = next(((i, j) for i in live for j in live if i < j and A[i][j] != 0), None)
        if pr is None: break
        i0, j0 = pr; bb = A[i0][j0]; pos += 1; neg += 1; live.remove(i0); live.remove(j0)
        for i in live:
            fi = A[i][j0]/bb; fj = A[i][i0]/bb
            for j in live: A[i][j] -= fi*A[i0][j] + fj*A[j0][j]
    return int(pos), int(neg)
