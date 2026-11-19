"""Row series in the twist direction l2 for the double cover of GL(3): find the recurrence (Berlekamp-Massey over Q
at a rational specialisation), then identify the characteristic roots as monomials. Exact Fractions."""
from fractions import Fraction as F
import sys, itertools
from gt import patterns
def num_ppart(l1, l2, n, rv, Tv, eps, xv, yv):
    qv = rv*rv
    def g(a):
        if n == 1: return -qv**(a-1)
        return -qv**(a-1) if a % 2 == 0 else qv**(a-1)*Tv*rv
    def h(a): return (qv-1)*qv**(a-1) if a % n == 0 else 0
    top = (l1+l2+2, l2+1, 0); out = {}
    for (a11, a12, a22) in patterns(top):
        ents = [((a11-top[1])+(a12-top[2]), a11 == top[0], a11 == top[1]),
                (a12-top[2], a12 == top[1], a12 == top[2]),
                (a22-a12, a22 == a11, a22 == a12)]
        w = F(1)
        for G, b, c in ents:
            if b and c: w = 0; break
            if c: w *= qv**G
            elif b: w *= g(G)
            else:
                w *= h(G)
            if w == 0: break
        if w == 0: continue
        k1 = (a11-top[1])+(a12-top[2]); k2 = a22
        key = (k1 % n, k2 % n)
        out[key] = out.get(key, 0) + w * xv**k1 * yv**k2
    return out
def bm(s):
    # Berlekamp-Massey over Q; returns connection polynomial C (C[0]=1): sum_i C[i] s[n-i] = 0
    C = [F(1)]; B = [F(1)]; L = 0; m = 1; b = F(1)
    for n_ in range(len(s)):
        d = s[n_] + sum(C[i]*s[n_-i] for i in range(1, L+1))
        if d == 0: m += 1
        elif 2*L <= n_:
            Tt = C[:]; coef = d/b
            C = C + [F(0)]*(len(B)+m-len(C))
            for i in range(len(B)): C[i+m] -= coef*B[i]
            L = n_+1-L; B = Tt; b = d; m = 1
        else:
            coef = d/b
            C = C + [F(0)]*(len(B)+m-len(C))
            for i in range(len(B)): C[i+m] -= coef*B[i]
            m += 1
    return C[:L+1]
if __name__ == '__main__':
    import sympy as sp
    n = int(sys.argv[1]); J = int(sys.argv[2])
    rv, xu, yu = F(3), F(5, 7), F(11, 13)      # r = sqrt q = 3 (formal), unitary-normalised parameters Xu, Yu
    xv, yv = xu/rv**2, yu/rv**2
    Tv = F(1)
    U = sp.symbols('U')
    for l1 in (0, 1):
        for e in range(n):
            seqs = {}
            for j in range(J):
                d = num_ppart(l1, n*j+e, n, rv, Tv, 1, xv, yv)
                for key in itertools.product(range(n), repeat=2):
                    seqs.setdefault(key, []).append(d.get(key, F(0)))
            for key, s in sorted(seqs.items()):
                if all(v == 0 for v in s): print(f'l1={l1} l2={e} mod {n} kappa={key}: zero'); continue
                C = bm(s)
                pol = sp.Poly(sum(sp.Rational(c.numerator, c.denominator)*U**i for i, c in enumerate(C)), U)
                print(f'l1={l1} l2={e} mod {n} kappa={key}: order {len(C)-1}; char poly factors:', sp.factor(pol.as_expr()))
