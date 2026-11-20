from lib import *
def gram(r):
    n = len(r); b = mkb(r)
    def bo(u, j):
        p = q(1)
        for t in range(n):
            if t != j: p *= (u - r[t])
        return p
    def qij(x, i, j): return bo(x[0], j)*bo(x[1], i)*b(x[0]+x[1])
    def D(i, j): return b(-r[i])*b(-r[j])*b(-r[i]-r[j])
    idx = [(i, j) for i in range(n) for j in range(n)]
    G = fmpq_mat(n*n, n*n, [-D(i, j)*sum((sg*qij(x, i, j) for (x, sg) in orbit((r[k], r[l]))), q(0)) for (i, j) in idx for (k, l) in idx])
    return G, idx, D
if __name__ == "__main__":
  for r in ([q(1), q(-1,3)], [q(1), q(-1,5), q(-1,3)], [q(1), q(-3,5), q(-4,5)], [q(1), q(-1,4), q(-3,4)], [q(1), q(-1,5), q(-1,3), q(-3,5)], [q(1), q(-3,5), q(-4,5), q(-7,10)]):
      G, idx, D = gram(r); n = len(r)
      sym = all(G[a, c] == G[c, a] for a in range(n*n) for c in range(n*n))
      print([str(t) for t in r], 'symmetric', sym, 'rank', G.rank(), 'inertia', inertia(G), 'H inertia', inertia(fitH(r)[0]))
      if n <= 3:
          # compare with weighted Cauchy x Cauchy
          for a, (i, j) in enumerate(idx):
              row = []
              for c, (k, l) in enumerate(idx):
                  cc = D(i, j)*D(k, l)/((r[j]+r[l])*(r[i]+r[k]))
                  row.append(str(G[a, c]/cc))
              print((i, j), row)
