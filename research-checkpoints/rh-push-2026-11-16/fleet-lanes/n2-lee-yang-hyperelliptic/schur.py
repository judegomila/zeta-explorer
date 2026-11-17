"""Exact Schur-Cohn zero count in a disc |u|<r (r rational) for polynomials over Q(i).
Gaussian rationals as (Fraction re, Fraction im) pairs wrapped in class G."""
from fractions import Fraction as F
class G:
    __slots__ = ('a', 'b')
    def __init__(s, a=0, b=0): s.a = F(a); s.b = F(b)
    def __add__(s, o): o = G.c(o); return G(s.a+o.a, s.b+o.b)
    __radd__ = __add__
    def __sub__(s, o): o = G.c(o); return G(s.a-o.a, s.b-o.b)
    def __rsub__(s, o): return G.c(o)-s
    def __mul__(s, o): o = G.c(o); return G(s.a*o.a-s.b*o.b, s.a*o.b+s.b*o.a)
    __rmul__ = __mul__
    def conj(s): return G(s.a, -s.b)
    def n2(s): return s.a*s.a+s.b*s.b
    def iszero(s): return s.a == 0 and s.b == 0
    @staticmethod
    def c(o): return o if isinstance(o, G) else G(o, 0)
    def __complex__(s): return complex(float(s.a), float(s.b))
    def __repr__(s): return f"({s.a})+({s.b})i"

def schur_cohn_count(co, r):
    """co ascending list of G; returns number of zeros in |u|<r, exact; raises if degenerate."""
    r = F(r)
    p = [c*(r**k) for k, c in enumerate(co)]         # p(r u): zeros in unit disc
    while p[-1].iszero(): p.pop()
    d = len(p)-1; inside = 0; prod = 1
    for step in range(d):
        m = len(p)-1
        a0, am = p[0], p[m]
        gam = a0.n2() - am.n2()
        if gam == 0: raise ValueError("degenerate Schur-Cohn step")
        # T p = conj(a0) p - am p*,  p*(u) = sum conj(p[m-k]) u^k
        tp = [a0.conj()*p[k] - am*p[m-k].conj() for k in range(m)]   # degree <= m-1
        prod = prod * (1 if gam > 0 else -1)
        if prod < 0: inside += 1
        p = tp
        while len(p) > 1 and p[-1].iszero():
            raise ValueError("degree drop >1: degenerate")
    return inside

if __name__ == '__main__':
    import numpy as np, random
    random.seed(3); bad = 0
    for t in range(3000):
        d = random.randint(1, 6)
        co = [G(random.randint(-9, 9), random.randint(-9, 9)) for _ in range(d+1)]
        if co[-1].iszero() or co[0].iszero(): continue
        r = F(random.randint(1, 30), 10)
        rt = np.roots([complex(c) for c in co][::-1])
        if min(abs(abs(rt)-float(r))) < 1e-6: continue
        try: c = schur_cohn_count(co, r)
        except ValueError: continue
        if c != int((abs(rt) < float(r)).sum()): bad += 1
    print("schur-cohn selftest mismatches:", bad)
