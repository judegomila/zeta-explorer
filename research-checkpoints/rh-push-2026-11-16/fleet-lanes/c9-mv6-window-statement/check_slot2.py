"""check_slot2.py -- (b) G(pi c') = +-G(pi) G(c') for pi prime, c' squarefree prime to pi, and the sign depends only on
 the classes of pi and c' modulo 4 (float screen). G from (4.7): gamma_1 gamma_2 = mu alpha G."""
import sys, numpy as np
from ek_common import *
T = Tab(float(sys.argv[1]) if len(sys.argv) > 1 else 30000.0)
key = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(T.na, T.nb))}
worst = 0.0; cnt = 0; signs = {}; clash = 0
for j in range(len(T.pp)):
    if T.pq[j] > 60: continue
    pi = (int(T.pa[j]), int(T.pb[j])); ipi = key[pi]
    E = T.node_exps(T.prime_exps(np.array([pi[0]]), np.array([pi[1]])))[:, 0]
    for c in range(1, T.n):
        if E[c] >= 64 or T.N[c] * T.pq[j] > T.N.max(): continue
        prod = Zm.mul((int(T.na[c]), int(T.nb[c])), pi); ic = key[(int(prod[0]), int(prod[1]))]
        r = T.G[ic] / (T.G[ipi] * T.G[c]); s = 1 if r.real > 0 else -1
        worst = max(worst, abs(r - s)); cnt += 1
        k = (pi[0] % 4, pi[1] % 4, int(T.na[c]) % 4, int(T.nb[c]) % 4)
        if signs.setdefault(k, s) != s: clash += 1
print(f"checked {cnt} pairs; max |G(pi c')/(G(pi) G(c')) - (+-1)| = {worst:.3e}; class pairs mod 4 seen {len(signs)}; sign clashes within a class pair {clash}; signs -1 on {sum(1 for v in signs.values() if v < 0)} class pairs")
