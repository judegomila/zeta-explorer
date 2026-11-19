"""sq.py : squared probe signal against the intersection form on Frobenius-graph classes. Exact integers / Fractions only.
q = 7, N <= 3.  No large allocation: largest table = monic polynomials of degree <= 6 (137,257 entries, < 50 MB)."""
import sys, json, itertools, random
from fractions import Fraction as Fr
import os
q = int(os.environ.get("Q", "7"))
LEG = {x: (0 if x == 0 else (1 if pow(x, (q-1)//2, q) == 1 else -1)) for x in range(q)}
def trim(a):
    a = list(a)
    while a and a[-1] == 0: a.pop()
    return a
def pmod(a, b):
    a = trim(a); db = len(b)-1; inv = pow(b[-1], q-2, q)
    while len(a)-1 >= db and a:
        f = a[-1]*inv % q; s = len(a)-1-db
        for i in range(db+1): a[s+i] = (a[s+i]-f*b[i]) % q
        a = trim(a)
    return a
def res(f, g):
    """resultant Res(f, g) mod q = lc(f)^deg g * prod_{f(x)=0} g(x)"""
    f = trim(f); g = trim(g); r = 1
    while True:
        if not g: return 0
        df, dg = len(f)-1, len(g)-1
        if dg == 0: return r*pow(g[0], df, q) % q
        h = pmod(f, g)
        if not h: return 0
        dh = len(h)-1
        # Res(f,g) = (-1)^(df dg) lc(g)^(df-dh) Res(g,h)
        r = r*pow(g[-1], df-dh, q) % q
        if (df*dg) % 2: r = (-r) % q
        f, g = g, h
def mono(n):
    for idx in range(q**n): yield tuple((idx//q**a) % q for a in range(n)) + (1,)
def mul(a, b):
    c = [0]*(len(a)+len(b)-1)
    for i, x in enumerate(a):
        if x:
            for j, y in enumerate(b): c[i+j] = (c[i+j]+x*y) % q
    return tuple(c)
def primes_upto(D):
    red = set()
    for n in range(2, D+1):
        for i in range(1, n//2+1):
            for a in mono(i):
                for b in mono(n-i): red.add(mul(a, b))
    return {n: [p for p in mono(n) if p not in red] for n in range(1, D+1)}
def npr(lam):
    def mu(n):
        m = 1; p = 2
        while p <= n:
            if n % p == 0:
                n //= p
                if n % p == 0: return 0
                m = -m
            p += 1
        return m
    return sum(mu(e)*q**(lam//e) for e in range(1, lam+1) if lam % e == 0)//lam
PR = primes_upto(3)
# squarefree monic A' of degree n <= 3 with their prime factors
SQF = {0: [((1,), ())]}
for n in range(1, 4):
    out = {}
    allp = [p for d in range(1, n+1) for p in PR[d]]
    for r in range(1, n+1):
        for comb in itertools.combinations(allp, r):
            if sum(len(p)-1 for p in comb) == n:
                A = (1,)
                for p in comb: A = mul(A, p)
                out[A] = comb
    SQF[n] = sorted(out.items())
assert [len(SQF[n]) for n in range(4)] == [1, q, q*q-q, q**3-q*q]
def scop(w, N, lam, kmax):
    """S_cop(k), k = 0..kmax, convention of ffx.c cmd_sc.  w: function (A', primes) -> integer weight."""
    S = [0]*(kmax+1); n_p = npr(lam) if lam else 1
    for A, ps in SQF[N]:
        sw = w(A, ps)
        if not sw: continue
        pol = [0]*(kmax+1); pol[0] = 1
        for p in ps:
            e = len(p)-1
            for j in range(kmax, e-1, -1): pol[j] -= pol[j-e]
        cop = [sum(pol[j]*q**(k-j) for j in range(k+1)) for k in range(kmax+1)]
        mu = -1 if len(ps) % 2 else 1; nfl = sum(1 for p in ps if len(p)-1 == lam)
        for k in range(kmax+1):
            if lam == 0: S[k] += sw*mu*cop[k]
            else: S[k] -= sw*mu*(n_p-nfl)*(cop[k]-(cop[k-lam] if k >= lam else 0))
    return S
def nu(F):
    c = {}
    def f(A, ps=None):
        if A not in c: c[A] = LEG[res(F, A)]
        return c[A]
    return f
def Lcoef(F, nmax):
    v = nu(F); return [sum(v(A) for A in mono(n)) for n in range(nmax+1)]
def traces(tr, g_coefs, nmax):
    """power sums t_n = sum alpha_i^n from L(u) = sum g_coefs[i] u^i = prod (1 - alpha_i u), by Newton."""
    e = [(-1)**i*c for i, c in enumerate(g_coefs)]  # elementary symmetric
    t = [len(g_coefs)-1]
    for n in range(1, nmax+1):
        s = 0
        for i in range(1, n):
            if i < len(e): s += (-1)**(i-1)*e[i]*t[n-i]
        if n < len(e): s += (-1)**(n-1)*n*e[n]
        t.append(s)
    return t
def gram(t, J, g):
    """G_jk = -P_j.P_k = q^j + q^k - Gamma_j.Gamma_k, from point counts N_n = q^n + 1 - t_n; Gamma_j.Gamma_j = q^j (2 - 2g)."""
    Nn = [None] + [q**n + 1 - t[n] for n in range(1, J+1)]
    G = [[0]*(J+1) for _ in range(J+1)]
    for j in range(J+1):
        for k in range(J+1):
            GG = q**j*(2-2*g) if j == k else q**min(j, k)*Nn[abs(j-k)]
            G[j][k] = q**j + q**k - GG
    return G
def qf(G, x): return sum(x[i]*x[j]*G[i][j] for i in range(len(x)) for j in range(len(x)))
def solve(M, b):
    n = len(M); A = [[Fr(x) for x in row]+[Fr(y)] for row, y in zip(M, b)]
    for i in range(n):
        p = next(r for r in range(i, n) if A[r][i] != 0); A[i], A[p] = A[p], A[i]
        A[i] = [x/A[i][i] for x in A[i]]
        for r in range(n):
            if r != i and A[r][i] != 0: A[r] = [x-A[r][i]*y for x, y in zip(A[r], A[i])]
    return [A[i][n] for i in range(n)]
def xvec(c, N):
    """D = sum_j c_j (P_{N+j} + q^j P_{N-j}); coefficient vector on P_0..P_2N."""
    x = [Fr(0)]*(2*N+1)
    for j, cj in enumerate(c):
        x[N+j] += cj; x[N-j] += cj*q**j
    return x
