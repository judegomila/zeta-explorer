"""ffpy.py : exact helpers in Z[zeta_6] and F_q[T] (conventions of ffx.c: polys low -> high, chi_c(x) = chi_0(Res(c, x)))."""
import itertools
def mul(x, y): return (x[0]*y[0] - x[1]*y[1], x[0]*y[1] + x[1]*y[0] + x[1]*y[1])
def add(x, y): return (x[0]+y[0], x[1]+y[1])
def conj(x): return (x[0]+x[1], -x[1])
def norm(x): return x[0]*x[0] + x[0]*x[1] + x[1]*x[1]
ZP = [(1,0),(0,1),(-1,1),(-1,0),(0,-1),(1,-1)]
class FF:
    def __init__(s, q):
        s.q = q
        g = next(g for g in range(2, q) if len({pow(g, e, q) for e in range(q-1)}) == q-1)
        s.L6 = {pow(g, e, q): e % 6 for e in range(q-1)}; s.LM1 = s.L6[q-1]
        J = (0, 0)
        for x in range(2, q): J = add(J, ZP[(2*s.L6[x] + 2*s.L6[(1-x) % q]) % 6])
        assert norm(J) == q
        s.J = J; s.Jb = conj(J)
    def idx2poly(s, i, k): return [(i // s.q**a) % s.q for a in range(k)] + [1]
    def pmod(s, a, b):
        q = s.q; a = a[:]; db = len(b) - 1; ib = pow(b[-1], q-2, q)
        for i in range(len(a)-1, db-1, -1):
            f = a[i]*ib % q
            if f:
                for j in range(db+1): a[i-db+j] = (a[i-db+j] - f*b[j]) % q
        a = a[:db]
        while a and a[-1] == 0: a.pop()
        return a
    def res(s, a, b):
        q = s.q; a = a[:]; b = b[:]
        while a and a[-1] == 0: a.pop()
        while b and b[-1] == 0: b.pop()
        if not a or not b: return 0
        da, db = len(a)-1, len(b)-1
        if db == 0: return pow(b[0], da, q)
        if da == 0: return pow(a[0], db, q)
        if da < db: return (-1)**(da*db) * s.res(b, a) % q
        r = s.pmod(a, b)
        if not r: return 0
        return (-1)**(da*db) * pow(b[-1], da-(len(r)-1), q) * s.res(b, r) % q
    def pmul(s, a, b):
        o = [0]*(len(a)+len(b)-1)
        for i, x in enumerate(a):
            for j, y in enumerate(b): o[i+j] = (o[i+j] + x*y) % s.q
        return o
    def gphase(s, c, sp):
        """phase of g_3 (sp = 2) for monic squarefree c: g_3(1,c) = G_2^deg zeta6^gphase; None if not squarefree (ffx.c gphase)."""
        k = len(c) - 1
        if k == 0: return 0
        dc = [(i % s.q)*c[i] % s.q for i in range(1, k+1)]
        D = s.res(c, dc)
        if D == 0: return None
        l = s.L6[D]; sg = s.LM1 if (k*(k-1)//2) & 1 else 0
        return (3*(l+sg) + sp*l) % 6
    def chi(s, c, x):
        R = s.res(c, x)
        return None if R == 0 else s.L6[R]
    def irreducible(s, P):
        n = len(P) - 1
        for e in range(1, n//2 + 1):
            for i in range(s.q**e):
                if not s.pmod(P, s.idx2poly(i, e)): return False
        return n >= 1
