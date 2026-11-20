# Exact model (rational arithmetic + sympy): toy base M_0(u) = (u+1)/(u-1) (pole at 1, residue 2, M_0(0) = -1; apex kernel identically 0)
# times the Blaschke factor of two real zeros a1, a2:  M = M_0 g(-u)/g(u), g(u) = (u+a1)(u+a2).
# Claim fitted and tested: K_0(lam,mu) = Delta(lam) Delta(mu) * sum_{i,j} H_ij(a1,a2) m_i(lam) m_j(mu) / (psi(lam) psi(mu)),
#   Delta = z1 z2 (z1+z2), psi(lam) = prod over positive roots of g(u)(u-1), m_i = monomials I2^a I3^b in the Weyl invariants.
# H is fitted exactly at rational (a1,a2) from 7 x 7 kernel values, checked on fresh points (exact equality), interpolated as a polynomial matrix in (a1,a2)
# (degree <= 6 in each), and its principal minors are factored. Identity status: exact equality at random rational points (not a symbolic proof).
import sys, json, random, itertools
from flint import fmpq, fmpq_mat
import sympy as sp
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
def kern(lam, mu, M):
    def orb(l):
        z1, z2 = l; m1, m2, m12 = M(z1), M(z2), M(z1+z2)
        return [(z1, z2, q(1)), (-z1, z1+z2, m1), (z1+z2, -z2, m2), (z2, -z1-z2, m12*m1), (-z1-z2, z1, m12*m2), (-z2, -z1, m1*m2*m12)]
    s = q(0)
    for (a, b, c) in orb(lam):
        for (a2, b2, c2) in orb(mu):
            s += c*c2/((a+a2)*(b+b2))
    return s
def Delta(l): return l[0]*l[1]*(l[0]+l[1])
rng = random.Random(11)
def pt(): return (q(rng.randint(1, 400), rng.randint(7, 97)), q(rng.randint(1, 400), rng.randint(7, 97)))
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
def inertia(H):
    A = [[H[i, j] for j in range(N)] for i in range(N)]; pos = neg = 0; used = []
    while True:
        cand = [i for i in range(N) if i not in used and A[i][i] != 0]
        if not cand: break
        k = cand[0]; d = A[k][k]; used.append(k); pos += d > 0; neg += d < 0
        for i in range(N):
            if i in used: continue
            f = A[i][k]/d
            for j in range(N):
                if j not in used: A[i][j] -= f*A[k][j]
    rest = any(A[i][j] != 0 for i in range(N) for j in range(N) if i not in used and j not in used)
    return pos, neg, rest
out = dict(samples=[])
print('inertia of the exact form at rational (a1, a2); predicted negative index = #{a_i < 1/2 without partner 1 - a_i}')
for (a1, a2) in [(q(1, 4), q(3, 4)), (q(1, 8), q(7, 8)), (q(1, 4), q(1, 8)), (q(3, 4), q(7, 8)), (q(1, 4), q(7, 8)), (q(1, 2), q(1, 2)), (q(1, 2), q(3, 4)), (q(1, 2), q(1, 4)),
                 (q(2), q(3)), (q(1, 3), q(1, 3)), (q(1, 3), q(2, 3)), (q(9, 10), q(1, 5)), (q(1), q(1, 3)), (q(1), q(2, 3)), (q(1), q(1))]:
    H, bad = fitH(a1, a2); pos, neg, rest = inertia(H)
    pred = (0 if a1 + a2 == 1 else int(a1 < q(1, 2)) + int(a2 < q(1, 2)))
    print('  a = (%s, %s): fit failures %d of 12, rank %d, positive %d, negative %d%s   predicted negative %d' % (a1, a2, bad, pos+neg, pos, neg, ' (2x2 pivots left)' if rest else '', pred))
    out['samples'].append(dict(a1=str(a1), a2=str(a2), fit_failures=bad, pos=int(pos), neg=int(neg), predicted_neg=pred))
# interpolation of H(a1,a2): entries are polynomials of degree <= 6 in each a_i
xs = [q(k, 3) for k in range(1, 9)]          # 8 nodes: degree <= 7 allowed; the top coefficient must vanish (check)
grid = {}
for x in xs:
    for y in xs:
        if y < x: continue
        H, bad = fitH(x, y); assert bad == 0
        grid[(x, y)] = H; grid[(y, x)] = H
A1, A2 = sp.symbols('a1 a2')
def lag(nodes, k, X):
    r = sp.Integer(1)
    for m, xm in enumerate(nodes):
        if m != k: r *= (X - sp.Rational(int(xm.p), int(xm.q)))/(sp.Rational(int(nodes[k].p), int(nodes[k].q)) - sp.Rational(int(xm.p), int(xm.q)))
    return r
L1 = [sp.expand(lag(xs, k, A1)) for k in range(len(xs))]; L2 = [sp.expand(lag(xs, k, A2)) for k in range(len(xs))]
Hs = sp.zeros(N, N)
for i in range(N):
    for j in range(N):
        e = 0
        for k, x in enumerate(xs):
            for l, y in enumerate(xs):
                v = grid[(x, y)][i, j]
                if v != 0: e += sp.Rational(int(v.p), int(v.q))*L1[k]*L2[l]
        Hs[i, j] = sp.factor(sp.expand(e))
maxdeg = max([sp.Poly(sp.expand(Hs[i, j]), A1, A2).degree(A1) if Hs[i, j] != 0 else 0 for i in range(N) for j in range(N)])
print('max degree in a1 of the interpolated entries (8 nodes allow 7):', maxdeg)
# test of the interpolated matrix at a point off the grid
t1, t2 = q(5, 7), q(11, 13); Ht, bad = fitH(t1, t2)
ok = all(sp.Rational(int(Ht[i, j].p), int(Ht[i, j].q)) == Hs[i, j].subs({A1: sp.Rational(5, 7), A2: sp.Rational(11, 13)}) for i in range(N) for j in range(N))
print('interpolated H equals the fitted H at (5/7, 11/13):', ok)
nzrows = [i for i in range(N) if any(Hs[i, j] != 0 for j in range(N))]
print('rows of H that are not identically zero (basis index):', [basis[i] for i in nzrows])
Hr = Hs.extract(nzrows, nzrows)
print('H restricted:'); 
for i in range(Hr.rows): print('  ', [str(Hr[i, j]) for j in range(Hr.cols)])
mins = []
for k in range(1, Hr.rows+1):
    d = sp.factor(Hr.extract(list(range(k)), list(range(k))).det()); mins.append(str(d)); print('leading principal minor of order', k, ':', d)
out.update(basis=basis, nonzero_rows=[basis[i] for i in nzrows], H=[[str(Hr[i, j]) for j in range(Hr.cols)] for i in range(Hr.rows)], leading_minors=mins, interpolation_check=bool(ok), max_degree=int(maxdeg))
json.dump(out, open('toy_exact.json', 'w'), indent=1)
