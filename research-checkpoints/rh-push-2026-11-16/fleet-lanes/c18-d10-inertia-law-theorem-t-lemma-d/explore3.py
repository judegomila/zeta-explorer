import sympy as sp, itertools
def Ghat(n):
    r = sp.symbols('r0:%d' % n)
    u = sp.Symbol('u')
    b = sp.prod([(u - t) for t in r])
    bp = [sp.prod([(r[j] - r[t]) for t in range(n) if t != j]) for j in range(n)]
    bm = lambda x: sp.prod([(x - t) for t in r])
    beta = [bp[j]/bm(-r[j]) for j in range(n)]
    idx = [(i, j) for i in range(n) for j in range(n)]
    G = sp.zeros(n*n, n*n)
    for a, (i, j) in enumerate(idx):
        for c, (k, l) in enumerate(idx):
            v = 1/((r[i]+r[k])*(r[j]+r[l]))
            if j == l: v += beta[j]/(r[i]+r[j]+r[k])
            if i == k: v += beta[i]/(r[i]+r[j]+r[l])
            if j == k and i == l: v -= beta[i]*beta[j]*bm(r[i]+r[j])/bm(-r[i]-r[j])
            G[a, c] = sp.factor(sp.together(v))
    return G, idx, r
G, idx, r = Ghat(2)
print('n=2'); 
for a in range(4): print(idx[a], [G[a, c] for c in range(4)])
print('nullspace n=2:', [sp.simplify(v.T) for v in G.nullspace()])
G, idx, r = Ghat(3)
print('n=3 diag entries'); 
for a in range(9): print(idx[a], G[a, a])
sub = {r[0]: sp.Rational(1), r[1]: sp.Rational(-1, 5), r[2]: sp.Rational(-1, 3)}
Gn = G.subs(sub)
print('rank n=3 numeric', Gn.rank()); ns = Gn.nullspace(); 
for v in ns: print(list(v.T))
for S in ([1, 2, 5], [0, 4, 8], [0, 1, 2]):
    M = G.extract(S, S); print([idx[s] for s in S], sp.factor(M.det()))
