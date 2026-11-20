# Symmetric quartet 1/2 +- eta +- i g in the rational model, parameters E = eta^2, c = 1/4 + eta^2 + g^2:
# b(u) = (u - 1) [ (u^2 + u + c)^2 - E (2u + 1)^2 ].   H(E, c): exact 19 x 19 rational matrix of N / (Delta Delta) on the invariant monomials of degree <= 12.
from flint import fmpq, fmpq_mat
from lib import orbit, Delta, basis, inv, q
B = basis(12); m = len(B)
import random
_r = random.Random(77)
P1 = [(q(_r.randint(1, 100), 101), q(_r.randint(1, 100), 103)) for k in range(m)]
P2 = [(q(_r.randint(1, 100), 107), q(_r.randint(1, 100), 109)) for k in range(m)]
V1i = fmpq_mat(m, m, [x for p in P1 for x in inv(p, B)]).inv(); V2i = fmpq_mat(m, m, [x for p in P2 for x in inv(p, B)]).transpose().inv()
O1 = [orbit(p) for p in P1]; O2 = [orbit(p) for p in P2]
def Hmat(E, c, extra_test=None):
    def b(u): 
        t = u*u + u + c; s = 2*u + 1
        return (u - 1)*(t*t - E*s*s)
    def psi(x): return b(x[0])*b(x[1])*b(x[0]+x[1])
    A1 = [[(x, sg*psi(x)) for (x, sg) in o] for o in O1]; A2 = [[(x, sg*psi(x)) for (x, sg) in o] for o in O2]
    def Nv(oa, ob):
        s = q(0)
        for (x, cx) in oa:
            for (y, cy) in ob: s += cx*cy/((x[0]+y[0])*(x[1]+y[1]))
        return s
    Pm = fmpq_mat(m, m, [Nv(A1[i], A2[j])/(Delta(P1[i])*Delta(P2[j])) for i in range(m) for j in range(m)])
    H = V1i*Pm*V2i
    if extra_test is not None:
        bad = 0
        for (a, cc) in extra_test:
            lhs = Nv([(x, sg*psi(x)) for (x, sg) in orbit(a)], [(x, sg*psi(x)) for (x, sg) in orbit(cc)])/(Delta(a)*Delta(cc)); ia, ic = inv(a, B), inv(cc, B)
            if lhs != sum((H[i, j]*ia[i]*ic[j] for i in range(m) for j in range(m)), q(0)): bad += 1
        return H, bad
    return H
