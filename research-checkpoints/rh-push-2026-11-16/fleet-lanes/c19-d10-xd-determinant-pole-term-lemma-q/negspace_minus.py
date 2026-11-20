# Negative subspace test. Jet space Jt = dual of polys of bidegree < n, form L(x)L. Negative definite 2d-space:
#   Nn = delta_1 (x) P + P (x) delta_1,  P = annihilator of g(-x) in the one-variable jets.
# delta_1 (x) P in Jperp  <=>  A[ g(-x1) (x2-1) q(x2) b(x12) ] = 0 for all q of degree < d   (family F1)
# P (x) delta_1 in Jperp  <=>  A[ (x1-1) q(x1) g(-x2) b(x12) ] = 0                         (family F2)
# Rank of F1, F2, F1+F2 as functions of lambda (exact, on integer points).
from xd import *
def fam(specs):
    b = bpoly(specs, 'pole'); g = bpoly(specs, 'minus'); n = len(b)-1; d = n-1
    ev = lambda c, u: sum(ck*u**k for k, ck in enumerate(c))
    pts = [(z1, s-z1) for s in range(2, 40) for z1 in range(1, s)][:6*d+12]
    def A(f): return [sum(sg*f(x) for (x, sg) in orbit(p)) for p in pts]
    F1 = [A(lambda x, k=k: ev(g, -x[0])*(x[1]-1)*x[1]**k*ev(b, -(x[0]+x[1]))) for k in range(d)]
    F2 = [A(lambda x, k=k: (x[0]-1)*x[0]**k*ev(g, -x[1])*ev(b, -(x[0]+x[1]))) for k in range(d)]
    r = lambda rows: fmpz_mat(len(rows), len(pts), [v for row in rows for v in row]).rank() if rows else 0
    return dict(d=d, rankF1=r(F1), rankF2=r(F2), rankF12=r(F1+F2))
if __name__ == '__main__':
    for name, sp in (('sym real pair', [('r', '1/4')]), ('sym line pair', [('l', '3/2')]), ('sym quartet', [('q', '1/4', '1')]), ('sym d=6', [('q', '1/4', '1'), ('l', '2')]), ('sym d=8', [('q', '1/4', '1'), ('q', '1/3', '2')]),
                     ('left pair', [('p', '1/5', '2')]), ('right pair', [('p', '4/5', '2')]), ('left+right', [('p', '1/5', '2'), ('p', '2/3', '1')]), ('quartet outside', [('q', '3/4', '1')])):
        print(name, fam(sp))
