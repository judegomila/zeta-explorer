#!/usr/bin/env python3
"""lemma_check.py -- exact check of the degeneration in Lemma S on the Gauss-sum table.
For table primes pi (norm 7..97, both conjugates; inert 5, 11) and squarefree primary nodes c prime to 6 pi:
 (cubic)     chi_c(pi)^2 = chi_pi(c)^2                       (no sign: R^2 = 1)
 (quadratic) chi_c(pi)^3 = R(pi, c) chi_pi(c)^3, R = +-1 a function of (pi mod 4, c mod 4) only
 (sextic)    chi_c(pi)   = R(pi, c) chi_pi(c)
and for composite m = m1 m2^2 m3^3 m4^4: e_c(m) = e_c(m1) + 2 e_c(m2) + 3 e_c(m3) + 4 e_c(m4) mod 6.
"""
import sys, numpy as np
SX = sys.argv[1]; sys.path.insert(0, SX)
import alib as A, zomega as Z
T = A.SFTable(SX + '/data/sf_1e7.npz')
rng = np.random.default_rng(5)
nodes = rng.choice(np.flatnonzero(T.N > 1), size=20000, replace=False)
ks = [k for k in range(T.np_) if 7 <= T.pq[k] <= 97 or (T.pinert[k] and T.pq[k] <= 121)]
bad2 = bad3 = bad1 = 0; ntest = 0; Rtab = {}
for k in ks:
    pi = (int(T.pa[k]), int(T.pb[k])); Pk = Z.PrimeO(pi, int(T.pp[k]), bool(T.pinert[k]))
    e = T.node_exponents(pi)[nodes]
    cls_pi = Z.mod4_index(pi)
    for j, nd in enumerate(nodes):
        if e[j] < 0: continue
        c = (int(T.na[nd]), int(T.nb[nd])); f = Pk.chi(c)
        if f is None: continue
        ntest += 1
        if (2 * e[j] - 2 * f) % 6: bad2 += 1
        d = (e[j] - f) % 6
        if d not in (0, 3): bad1 += 1
        key = (cls_pi, int(T.m4[nd])); Rtab.setdefault(key, set()).add(d)
bad3 = sum(1 for v in Rtab.values() if len(v) > 1)
print(f"pairs tested {ntest}; cubic reciprocity failures {bad2}; chi_c(pi)/chi_pi(c) not +-1: {bad1}; "
      f"(class pi, class c) cells {len(Rtab)}, cells where the sign is not constant: {bad3}; cells with sign -1: {sum(1 for v in Rtab.values() if v == {3})}")
# composite
k7, k13, k19, k31 = [[k for k in range(300) if T.pq[k] == q and not T.pinert[k]][0] for q in (7, 13, 19, 31)]
pr = lambda k: (int(T.pa[k]), int(T.pb[k]))
m = Z.mul(Z.mul(pr(k31), Z.power(pr(k7), 2)), Z.mul(Z.power(pr(k13), 3), Z.power(pr(k19), 4)))
em = T.node_exponents(m).astype(int); e1 = T.node_exponents(pr(k31)).astype(int); e2 = T.node_exponents(pr(k7)).astype(int)
e3 = T.node_exponents(pr(k13)).astype(int); e4 = T.node_exponents(pr(k19)).astype(int)
ok = em >= 0
print(f"composite m, N(m) = {Z.norm(m)}: coprime nodes {ok.sum()}, mismatches {int(((em - e1 - 2*e2 - 3*e3 - 4*e4) % 6 != 0)[ok].sum())}")
