# Test: Gamma = C(x)C + T (Theorem G of c18, crossing-point Gram of N, real simple roots). Is (C(x)C)^{-1} Gamma = 1 - tau with tau an involution?
from flint import fmpq, fmpq_mat
import random
def build(r):
    n = len(r)
    def b(u):
        p = fmpq(1)
        for t in r: p *= (u-t)
        return p
    def bp(i):
        p = fmpq(1)
        for k, t in enumerate(r):
            if k != i: p *= (r[i]-t)
        return p
    beta = [bp(i)/b(-r[i]) for i in range(n)]
    S = lambda u: b(-u)/b(u)
    idx = [(i, j) for i in range(n) for j in range(n)]
    CC = fmpq_mat(n*n, n*n, [1/((r[i]+r[k])*(r[j]+r[l])) for (i, j) in idx for (k, l) in idx])
    def t(i, j, k, l):
        v = fmpq(0)
        if j == l: v += beta[j]/(r[i]+r[j]+r[k])
        if i == k: v += beta[i]/(r[i]+r[j]+r[l])
        if j == k and i == l: v -= beta[i]*beta[j]/S(r[i]+r[j])
        return v
    T = fmpq_mat(n*n, n*n, [t(i, j, k, l) for (i, j) in idx for (k, l) in idx])
    return CC, T, idx
rng = random.Random(3)
for n in (2, 3, 4):
    for rep in range(3):
        r = [fmpq(1)] + [fmpq(-rng.randint(1, 40), rng.randint(41, 60)) for _ in range(n-1)] if rep < 2 else [fmpq(rng.choice([-1,1])*rng.randint(1, 300), rng.randint(301, 400)) for _ in range(n)]
        CC, T, idx = build(r); tau = -(CC.inv()*T); I = tau*0
        for i in range(n*n): I[i, i] = 1
        inv = (tau*tau == I)
        Gam = CC+T
        print(n, [str(x) for x in r], 'tau^2 = 1:', inv, 'rank Gamma', Gam.rank(), 'rank(1+tau)', (I+tau).rank(), 'rank(1-tau)', (I-tau).rank())
        if n == 2 and rep == 0:
            print('tau =', [[str(tau[i, j]) for j in range(n*n)] for i in range(n*n)])
