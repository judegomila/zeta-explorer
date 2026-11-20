# Exact inertia of the apex kernel N of the rational model, any degree, integer arithmetic only.
# N(lam,mu) = sum_{w,w'} sgn sgn psi(w lam) psi(w' mu)/(nu1 nu2), psi(x)=b(x1)b(x2)b(x1+x2).
# Pole-free evaluation by the Bezoutian identity (Theorem H of c18):
#   6 N = A[ L(x1,y1) L(x2,y2) ( b(x12) b(y12) + 2 b(-x12) b(-y12) ) ],  L(x,y) = [b(x)b(y)-b(-x)b(-y)]/(x+y).
# Gram matrix G = 6 N(p_i,p_j) on m integer points of the open chamber, m = dim of Delta*C[I2,I3]_{<=3(n-1)};
# G = V H V^T with V the evaluation matrix; rank V = m is checked exactly, so inertia(G) = inertia(H).
from flint import fmpz, fmpz_mat, fmpq, fmpz_poly
from fractions import Fraction as Fr
import math, random, json, sys, time

def pmul(a, b):
    r = [Fr(0)]*(len(a)+len(b)-1)
    for i, x in enumerate(a):
        for j, y in enumerate(b): r[i+j] += x*y
    return r
def factor(spec):
    t = spec[0]
    if t == 'q':   # quartet 1/2 +- eta +- i g
        eta, g = Fr(spec[1]), Fr(spec[2]); E = eta*eta; c = Fr(1, 4)+E+g*g
        s = pmul([c, 1, 1], [c, 1, 1]); l = pmul([1, 2], [1, 2])
        return [s[i]-(E*l[i] if i < 3 else 0) for i in range(5)]
    if t == 'r':   # real pair 1/2 +- eta
        eta = Fr(spec[1]); return [Fr(1, 4)-eta*eta, Fr(1), Fr(1)]
    if t == 'l':   # pair on the line 1/2 +- i g
        g = Fr(spec[1]); return [Fr(1, 4)+g*g, Fr(1), Fr(1)]
    if t == 'p':   # conjugate pair a, conj a (not symmetric in general): (u+a)(u+conj a)
        re, im = Fr(spec[1]), Fr(spec[2]); return [re*re+im*im, 2*re, Fr(1)]
    if t == 's':   # single real zero a
        return [Fr(spec[1]), Fr(1)]
    raise ValueError(t)
def bpoly(specs, base='pole'):
    g = [Fr(1)]
    for s in specs: g = pmul(g, factor(s))
    if base == 'pole': b = pmul([Fr(-1), Fr(1)], g)
    elif base == 'minus': b = g
    elif base == 'plus': b = pmul([Fr(0), Fr(1)], g)
    else: raise ValueError(base)
    den = 1
    for c in b: den = den*c.denominator//math.gcd(den, c.denominator)
    co = [int(c*den) for c in b]
    gg = 0
    for c in co: gg = math.gcd(gg, c)
    return [c//gg for c in co]
def bezout(b):
    n = len(b)-1   # degree
    c = [[b[i]*b[j]*(1-(-1)**(i+j)) for j in range(n+1)] for i in range(n+1)]
    l = [[0]*n for _ in range(n)]
    for j in range(0, n):
        for i in range(1, n+1):
            l[i-1][j] = c[i][j] - (l[i][j-1] if (j >= 1 and i < n) else 0)
    # check: l[i-1][j] + l[i][j-1] = c[i][j] for all, including j = n
    for i in range(0, n+1):
        for j in range(0, n+1):
            v = (l[i-1][j] if (i >= 1 and j < n) else 0) + (l[i][j-1] if (j >= 1 and i < n) else 0)
            assert v == c[i][j], 'bezout division'
    return l
def orbit(l):
    z1, z2 = l
    return [((z1, z2), 1), ((-z1, z1+z2), -1), ((z1+z2, -z2), -1), ((z2, -z1-z2), 1), ((-z1-z2, z1), 1), ((-z2, -z1), -1)]
def basis(maxdeg): return [(a, b) for b in range(0, maxdeg//3+1) for a in range(0, maxdeg//2+1) if 2*a+3*b <= maxdeg]
def points(m):
    # integer points of the open chamber, ordered by size; the first m with full-rank evaluation matrix are used
    pts = []; s = 2
    while len(pts) < 4*m+20:
        for z1 in range(1, s):
            pts.append((z1, s-z1))
        s += 1
    return pts
_PT = {}
def pointset(n):
    if n in _PT: return _PT[n]
    B = basis(3*(n-1)); m = len(B); cand = points(m)
    def row(p):
        z1, z2 = p; i2 = z1*z1+z1*z2+z2*z2; i3 = (2*z1+z2)*(z1-z2)*(z1+2*z2); d = z1*z2*(z1+z2)
        return [d*i2**a*i3**b for (a, b) in B]
    # greedy: take candidate blocks until rank m
    k = m
    while True:
        sel = cand[:k]
        V = fmpz_mat(len(sel), m, [x for p in sel for x in row(p)])
        if V.rank() == m: break
        k += max(1, m//10)
        if k > len(cand): raise RuntimeError('no unisolvent set')
    _PT[n] = (sel, m); return _PT[n]
def gram6(b):
    n = len(b)-1; pts, m = pointset(n)
    L = bezout(b); Lm = fmpz_mat(n, n, [x for r in L for x in r])
    def bev(u):
        r = 0
        for c in reversed(b): r = r*u + c
        return r
    def phi(p, sign):
        acc = [[0]*n for _ in range(n)]
        for (x, sg) in orbit(p):
            w = sg*bev(sign*(x[0]+x[1]))
            if w == 0: continue
            p1 = [x[0]**k for k in range(n)]; p2 = [x[1]**k for k in range(n)]
            for i in range(n):
                wi = w*p1[i]
                if wi == 0: continue
                ai = acc[i]
                for j in range(n): ai[j] += wi*p2[j]
        # apply L on both tensor factors: L acc L^T
        A = Lm*fmpz_mat(n, n, [x for r in acc for x in r])*Lm.transpose()
        return [x for r in acc for x in r], [A[i, j] for i in range(n) for j in range(n)]
    M = len(pts)
    Fp = []; Gp = []; Fm = []; Gm = []
    for p in pts:
        f, g = phi(p, 1); Fp.append(f); Gp.append(g)
        f, g = phi(p, -1); Fm.append(f); Gm.append(g)
    A1 = fmpz_mat(M, n*n, [x for r in Fp for x in r]); B1 = fmpz_mat(M, n*n, [x for r in Gp for x in r])
    A2 = fmpz_mat(M, n*n, [x for r in Fm for x in r]); B2 = fmpz_mat(M, n*n, [x for r in Gm for x in r])
    G = A1*B1.transpose() + 2*(A2*B2.transpose())
    return G, m
def inertia_int(G):
    # fraction-free (Bareiss) elimination with symmetric diagonal pivoting; exact. Returns (pos, neg, rank).
    n = G.nrows(); A = [[G[i, j] for j in range(n)] for i in range(n)]
    for i in range(n):
        for j in range(i): assert A[i][j] == A[j][i]
    live = list(range(n)); prev = fmpz(1); pos = neg = 0; psign = 1
    while live:
        k = next((i for i in live if A[i][i] != 0), None)
        if k is None:
            if all(A[i][j] == 0 for i in live for j in live): break
            # 2x2 pivot needed: fall back to rationals on the remaining Schur complement (scaled by prev)
            from flint import fmpq
            R = [[fmpq(A[i][j]) for j in live] for i in live]
            p2, n2 = inertia_q(R); s = 1 if prev > 0 else -1
            if s < 0: p2, n2 = n2, p2
            pos += p2; neg += n2; break
        d = A[k][k]
        # d = (principal minor of order t+1), prev = minor of order t  => sign of pivot = sign(d/prev)
        if (d > 0) == (prev > 0): pos += 1
        else: neg += 1
        live.remove(k); rk = A[k]
        for a, i in enumerate(live):
            ri = A[i]; f = ri[k]
            for j in live[a:]:
                v = (ri[j]*d - f*rk[j])/prev
                ri[j] = v; A[j][i] = v
        prev = d
    return pos, neg, pos+neg
def inertia_q(A):
    n = len(A); live = list(range(n)); pos = neg = 0
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
def run(specs, base='pole'):
    t = time.time(); b = bpoly(specs, base); G, m = gram6(b); t1 = time.time()-t
    rk = G.rank(); pos, neg, r2 = inertia_int(G)
    assert r2 == rk, ('rank mismatch', r2, rk)
    return dict(n=len(b)-1, m=m, rank=int(rk), pos=pos, neg=neg, t_gram=round(t1, 2), t=round(time.time()-t, 2))
if __name__ == '__main__':
    # self tests against c18 values
    print(run([('r', '1/4')]))                       # d=2 symmetric: rank 1 pos
    print(run([('q', '1/4', '1')]))                  # (6,0)
    print(run([('q', '3/4', '1')]))                  # outside strip: (4,2)
    print(run([('p', '1/5', '2')]))                  # unpaired left pair: (1,2)
    print(run([('p', '1/5', '2')], 'minus'), run([('p', '1/5', '2')], 'plus'))   # (1,0),(3,0)
    print(run([('q', '2/7', '3'), ('l', '5/3')]))    # (15,0)
    print(run([]))                                   # b = u-1: N = 0
