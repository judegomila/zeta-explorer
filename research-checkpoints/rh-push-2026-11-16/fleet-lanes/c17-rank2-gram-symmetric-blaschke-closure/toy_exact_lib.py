# shared exact-arithmetic helpers for the toy model (see toy_exact.py)
import random
from flint import fmpq, fmpq_mat
def q(a, b=1): return fmpq(a, b)
basis = [(0, 0), (1, 0), (0, 1), (2, 0), (1, 1), (3, 0), (0, 2)]
N = len(basis)
def inv(l):
    I2 = l[0]*l[0]+l[0]*l[1]+l[1]*l[1]; I3 = (2*l[0]+l[1])*(l[0]-l[1])*(l[0]+2*l[1])
    return [I2**a*I3**b for (a, b) in basis]
def setup(a1, a2):
    def g(u): return (u+a1)*(u+a2)
    def M(u): return g(-u)/g(u)*(u+1)/(u-1)
    def psi(l):
        r = q(1)
        for u in (l[0], l[1], l[0]+l[1]): r *= g(u)*(u-1)
        return r
    return M, psi
def orb(l, M):
    z1, z2 = l; m1, m2, m12 = M(z1), M(z2), M(z1+z2)
    return [(z1, z2, q(1)), (-z1, z1+z2, m1), (z1+z2, -z2, m2), (z2, -z1-z2, m12*m1), (-z1-z2, z1, m12*m2), (-z2, -z1, m1*m2*m12)]
def kern(lam, mu, M):
    s = q(0)
    for (a, b, c) in orb(lam, M):
        for (a2, b2, c2) in orb(mu, M):
            s += c*c2/((a+a2)*(b+b2))
    return s
def Delta(l): return l[0]*l[1]*(l[0]+l[1])
_rng = random.Random(11)
def pt(): return (q(_rng.randint(1, 400), _rng.randint(7, 97)), q(_rng.randint(1, 400), _rng.randint(7, 97)))
P1 = [pt() for _ in range(N)]; P2 = [pt() for _ in range(N)]; FR = [(pt(), pt()) for _ in range(12)]
V1i = fmpq_mat(N, N, [x for p in P1 for x in inv(p)]).inv(); V2i = fmpq_mat(N, N, [x for p in P2 for x in inv(p)]).transpose().inv()
def fitH(a1, a2):
    M, psi = setup(a1, a2)
    Pm = fmpq_mat(N, N, [kern(a, b, M)*psi(a)*psi(b)/(Delta(a)*Delta(b)) for a in P1 for b in P2])
    H = V1i*Pm*V2i
    bad = 0
    for (a, b) in FR:
        lhs = kern(a, b, M)*psi(a)*psi(b)/(Delta(a)*Delta(b)); ia, ib = inv(a), inv(b)
        if lhs != sum((H[i, j]*ia[i]*ib[j] for i in range(N) for j in range(N)), q(0)): bad += 1
    return H, bad
