# Exact rational arithmetic: toy base M_0(u) = (u+1)/(u-1) times Blaschke factors of degree 4 (quartets and comparison sets).
# K_0 psi psi / (Delta Delta) is fitted exactly in the 19 invariant monomials I2^a I3^b of degree <= 12, the fit is tested by exact equality on fresh
# rational points, and the inertia of the exact 19 x 19 rational matrix H is computed by exact symmetric elimination (1x1 and 2x2 pivots).
# Status: exact at each listed parameter value (identity tested on 10 fresh pairs, not on a full grid).
import random, json, sys
from flint import fmpq, fmpq_mat
def q(a, b=1): return fmpq(a, b)
maxdeg = 12
basis = [(a, b) for b in range(0, 5) for a in range(0, 7) if 2*a+3*b <= maxdeg]
N = len(basis)
def inv(l):
    I2 = l[0]*l[0]+l[0]*l[1]+l[1]*l[1]; I3 = (2*l[0]+l[1])*(l[0]-l[1])*(l[0]+2*l[1])
    return [I2**a*I3**b for (a, b) in basis]
def Delta(l): return l[0]*l[1]*(l[0]+l[1])
rng = random.Random(5)
def pt(): return (q(rng.randint(1, 900), rng.randint(7, 197)), q(rng.randint(1, 900), rng.randint(7, 197)))
P1 = [pt() for _ in range(N)]; P2 = [pt() for _ in range(N)]; FR = [(pt(), pt()) for _ in range(10)]
V1i = fmpq_mat(N, N, [x for p in P1 for x in inv(p)]).inv(); V2i = fmpq_mat(N, N, [x for p in P2 for x in inv(p)]).transpose().inv()
def pair(A, g): return (2*A, A*A+g*g)       # conjugate pair A +- i g  ->  u^2 + kappa u + m
def run(name, quads, pred):
    def g(u):
        r = q(1)
        for (k, m) in quads: r *= (u*u + k*u + m)
        return r
    def M(u): return g(-u)/g(u)*(u+1)/(u-1)
    def psi(l):
        r = q(1)
        for u in (l[0], l[1], l[0]+l[1]): r *= g(u)*(u-1)
        return r
    def orb(l):
        z1, z2 = l; m1, m2, m12 = M(z1), M(z2), M(z1+z2)
        return [(z1, z2, q(1)), (-z1, z1+z2, m1), (z1+z2, -z2, m2), (z2, -z1-z2, m12*m1), (-z1-z2, z1, m12*m2), (-z2, -z1, m1*m2*m12)]
    def kern(lam, mu):
        s = q(0)
        for (a, b, c) in orb(lam):
            for (a2, b2, c2) in orb(mu):
                s += c*c2/((a+a2)*(b+b2))
        return s
    Pm = fmpq_mat(N, N, [kern(a, b)*psi(a)*psi(b)/(Delta(a)*Delta(b)) for a in P1 for b in P2])
    H = V1i*Pm*V2i
    bad = 0
    for (a, b) in FR:
        lhs = kern(a, b)*psi(a)*psi(b)/(Delta(a)*Delta(b)); ia, ib = inv(a), inv(b)
        if lhs != sum((H[i, j]*ia[i]*ib[j] for i in range(N) for j in range(N)), q(0)): bad += 1
    sym = all(H[i, j] == H[j, i] for i in range(N) for j in range(N))
    A = [[H[i, j] for j in range(N)] for i in range(N)]; live = list(range(N)); pos = neg = 0
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
        i0, j0 = pr; b = A[i0][j0]; pos += 1; neg += 1; live.remove(i0); live.remove(j0)   # 2x2 pivot [[0,b],[b,0]]: one positive, one negative
        for i in live:
            fi = A[i][j0]/b; fj = A[i][i0]/b
            for j in live: A[i][j] -= fi*A[i0][j] + fj*A[j0][j]
    print('%-58s fit failures %d of 10, symmetric %s, rank %2d, positive %2d, negative %d   predicted negative %s' % (name, bad, sym, pos+neg, pos, neg, pred)); sys.stdout.flush()
    return dict(case=name, fit_failures=bad, symmetric=sym, pos=int(pos), neg=int(neg), predicted_neg=pred)
h = q(1, 2); out = []
for (eta, g) in [(q(1, 4), q(1)), (q(1, 10), q(3)), (q(9, 20), q(1, 2)), (q(1, 4), q(30)), (q(1, 100), q(1, 5)), (q(2, 5), q(14))]:
    out.append(run('symmetric quartet eta = %s, g = %s' % (eta, g), [pair(h-eta, g), pair(h+eta, g)], 0))
out.append(run('mis-paired quartet (1/4, 1; right shifted by 1/1000)', [pair(q(1, 4), q(1)), pair(q(3, 4)+q(1, 1000), q(1))], 2))
out.append(run('mis-paired quartet (1/4, 1; right at other height 2)', [pair(q(1, 4), q(1)), pair(q(3, 4), q(2))], 2))
out.append(run('two left pairs', [pair(q(1, 4), q(1)), pair(q(1, 3), q(2))], 4))
out.append(run('two right pairs', [pair(q(3, 4), q(1)), pair(q(2, 3), q(2))], 0))
out.append(run('left pair doubled', [pair(q(1, 4), q(1)), pair(q(1, 4), q(1))], 4))
out.append(run('pair on the line doubled', [pair(h, q(1)), pair(h, q(1))], 0))
out.append(run('two different pairs on the line', [pair(h, q(1)), pair(h, q(3))], 0))
out.append(run('real symmetric pair {1/4,3/4} and pair on the line', [(q(1), q(3, 16)), pair(h, q(2))], 0))
json.dump(out, open('toy_quartet.json', 'w'), indent=1)
