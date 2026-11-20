"""Positive ternary integral forms (integer Gram matrix) of determinant d: enumeration, canonical form,
automorphism count, genus invariants. Pure integer arithmetic (numpy int64 only for vector enumeration)."""
import itertools, math, cmath
import numpy as np
from fractions import Fraction

def det3(A):
    (a,b,c),(d,e,f),(g,h,i)=A
    return a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g)

def adj3(A):
    (a,b,c),(d,e,f),(g,h,i)=A
    return ((e*i-f*h, c*h-b*i, b*f-c*e),
            (f*g-d*i, a*i-c*g, c*d-a*f),
            (d*h-e*g, b*g-a*h, a*e-b*d))

def vectors_upto(A, bound, scale=1):
    """all nonzero integer x with x^T A x <= bound; A positive definite integer Gram. returns (X (n,3) int64, norms)"""
    d = det3(A); ad = adj3(A)
    # |x_i| <= sqrt(bound * (A^-1)_ii) = sqrt(bound*ad_ii/d)
    r = [int(math.isqrt(int(bound*ad[i][i]//d)))+1 for i in range(3)]
    n_alloc = (2*r[0]+1)*(2*r[1]+1)*(2*r[2]+1)
    if n_alloc*8*4 > 2**30: print("planned allocation: %.2f GB for vector box %s"%(n_alloc*32/2**30, r), flush=True)
    xs = np.arange(-r[0], r[0]+1, dtype=np.int64); ys = np.arange(-r[1], r[1]+1, dtype=np.int64); zs = np.arange(-r[2], r[2]+1, dtype=np.int64)
    X, Y, Z = np.meshgrid(xs, ys, zs, indexing='ij')
    N = A[0][0]*X*X + A[1][1]*Y*Y + A[2][2]*Z*Z + 2*(A[0][1]*X*Y + A[0][2]*X*Z + A[1][2]*Y*Z)
    m = (N <= bound) & (N > 0)
    V = np.stack([X[m], Y[m], Z[m]], axis=1)
    return V, N[m]

def rep_counts(A, bound):
    V, N = vectors_upto(A, bound)
    return np.bincount(N, minlength=bound+1)  # index n -> r_A(n), n=1..bound

def canon(A):
    """canonical Gram (tuple of 6: a,b,c,f12,f13,f23) and |O(A)|.
    Minimal lexicographic Gram over all bases (v1,v2,v3) with Q(vi) = i-th successive minimum."""
    # successive minima
    cmax = max(A[0][0], A[1][1], A[2][2])
    V, N = vectors_upto(A, cmax)
    order = np.argsort(N, kind='stable'); V = V[order]; N = N[order]
    lam1 = int(N[0]); v1 = V[0]
    # lam2: smallest norm of vector independent of v1
    lam2 = None; lam3 = None
    for k in range(len(V)):
        if np.any(np.cross(v1, V[k]) != 0):
            lam2 = int(N[k]); v2 = V[k]; break
    cr = np.cross(v1, v2)
    for k in range(len(V)):
        if int(np.dot(cr, V[k])) != 0:
            lam3 = int(N[k]); break
    Am = np.array(A, dtype=np.int64)
    S1 = V[N == lam1]; S2 = V[N == lam2]; S3 = V[N == lam3]
    best = None; cnt = 0
    AS2 = S2 @ Am; AS3 = S3 @ Am
    for u in S1:
        f12s = AS2 @ u
        f13s = AS3 @ u
        for j, v in enumerate(S2):
            c12 = np.cross(u, v)
            if not c12.any(): continue
            dets = S3 @ c12
            idx = np.nonzero(np.abs(dets) == 1)[0]
            if len(idx) == 0: continue
            f23s = AS3[idx] @ v
            for t, k in enumerate(idx):
                key = (int(f12s[j]), int(f13s[k]), int(f23s[t]))
                # canonical: maximise? choose lexicographically smallest (-f12,-f13,-f23) i.e. any fixed total order
                if best is None or key < best: best = key; cnt = 1
                elif key == best: cnt += 1
    if best is None: raise RuntimeError("no minimal basis found (not Minkowski-achievable?) %r" % (A,))
    return (lam1, lam2, lam3) + best, cnt

def gram_from_key(k):
    a,b,c,f12,f13,f23 = k
    return ((a,f12,f13),(f12,b,f23),(f13,f23,c))

def legendre(a, p):
    a %= p
    if a == 0: return 0
    return 1 if pow(a, (p-1)//2, p) == 1 else -1

def inv_odd(A, p):
    """p odd, p || det A: Legendre symbol of the determinant of the rank-2 unimodular Jordan part."""
    M = [[x % p for x in row] for row in A]
    # kernel vector of M mod p (rank 2)
    # brute force via adjugate: columns of adj(M) are in the kernel
    ad = adj3(M); ker = None
    for j in range(3):
        col = [ad[i][j] % p for i in range(3)]
        if any(col): ker = col; break
    if ker is None: raise ValueError("rank < 2 mod p")
    # complete to basis: pick two standard vectors e_i,e_j with ker, det nonzero mod p
    for i, j in ((0,1),(0,2),(1,2)):
        k = 3 - i - j
        if ker[k] % p != 0:
            return legendre(M[i][i]*M[j][j] - M[i][j]*M[j][i], p)
    raise ValueError

def oddity(A):
    """odd unimodular Z_2 lattice: oddity mod 8 from the Gauss sum over (Z/8)^3 (needs det A odd)."""
    s = 0
    cnt = [0]*8
    for x in range(8):
        for y in range(8):
            for z in range(8):
                q = (A[0][0]*x*x + A[1][1]*y*y + A[2][2]*z*z + 2*(A[0][1]*x*y + A[0][2]*x*z + A[1][2]*y*z)) % 8
                cnt[q] += 1
    s = sum(cnt[q]*cmath.exp(2j*math.pi*q/8) for q in range(8))
    if abs(abs(s) - 64) > 1e-6: return ('even-or-degenerate', tuple(cnt))
    return round(cmath.phase(s)/(2*math.pi)*8) % 8

def genus_inv(A, primes):
    return (oddity(A),) + tuple(inv_odd(A, p) for p in primes)

def enumerate_forms(d):
    """one Gram per candidate satisfying loose Minkowski conditions; superset of all classes of determinant d."""
    out = []
    amax = int(round((2*d)**(1/3))) + 1
    for a in range(1, amax+1):
        if a**3 > 2*d: break
        b = a
        while a*b*b <= 2*d:
            for f12 in range(0, a//2 + 1):
                m33 = a*b - f12*f12
                for f13 in range(0, a//2 + 1):
                    for f23 in range(-(b//2), b//2 + 1):
                        # det = c*m33 - (a f23^2 + b f13^2 - 2 f12 f13 f23)
                        num = d + a*f23*f23 + b*f13*f13 - 2*f12*f13*f23
                        if num % m33: continue
                        c = num // m33
                        if c < b: continue
                        out.append(((a,f12,f13),(f12,b,f23),(f13,f23,c)))
            b += 1
    return out

def classes(d, primes, target=None):
    """dict genus_invariant -> list of (canonical key, |O|) for all classes of det d. primes = odd primes dividing d (each exactly once)."""
    seen = {}
    for A in enumerate_forms(d):
        assert det3(A) == d
        k, o = canon(A)
        if k in seen: continue
        seen[k] = o
    gen = {}
    for k, o in seen.items():
        A = gram_from_key(k)
        gen.setdefault(genus_inv(A, primes), []).append((k, o))
    return gen

if __name__ == "__main__":
    import sys
    for d, pr in ((1,()),(17,(17,)),(3,(3,)),(15,(3,5))):
        g = classes(d, pr)
        for inv, L in sorted(g.items(), key=str):
            print(d, inv, len(L), sum(Fraction(1,o) for _,o in L), L[:4])
        print(' target', genus_inv(((1,0,0),(0,1,0),(0,0,d)), pr))
