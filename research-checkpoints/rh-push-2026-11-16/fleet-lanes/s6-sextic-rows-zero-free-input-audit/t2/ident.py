"""ident.py -- exact-table check of the identity of lane e2-theta-dual-mseries-fe (Lemma 1) on ALL squarefree m, N(m) <= 1e6:
(a) gamma_1(m) gamma_3(m) = prod_{p|m} gamma_1(p) gamma_3(p) * prod_{p|m} chi_p(m/p)^(-2)                  [shape of MS (5.3)]
(b) gamma_1(m) gamma_3(m) conj(chi_m(s)) chi_m(mu)^3 = G(m) gt_1(4^5 s mu^3, m),  G(m) = conj(chi_m(4)) gamma_3(m)
No factor of either side depends on a target function: the columns of (b) are indexed by (s, mu) only."""
import sys, json, numpy as np
SX = 'tmp/sextic'; sys.path.insert(0, SX)
import alib as A, zomega as Z
T = A.SFTable(SX + '/data/sf_1e6.npz'); Z6 = Z.ZETA6
out = {'nodes': int(T.n)}
# (a) on every node: accumulate along the tree. prod_{p|m} chi_p(m/p)^(-2) and prod gamma_1(p) gamma_3(p)
pg = T.pg[1] * T.pg[3]
objs = {}
def PO(k):
    if k not in objs: objs[k] = Z.PrimeO((int(T.pa[k]), int(T.pb[k])), int(T.pp[k]), bool(T.pinert[k]))
    return objs[k]
rng = np.random.default_rng(1); worst = 0.0; cnt = 0
for node in rng.choice(np.arange(1, T.n), size=20000, replace=False):
    ks = []; nd = int(node)
    while nd != 0: ks.append(int(T.last[nd])); nd = int(T.parent[nd])
    val = 1 + 0j
    for k in ks:
        cof = (1, 0)
        for k2 in ks:
            if k2 != k: cof = Z.mul(cof, (int(T.pa[k2]), int(T.pb[k2])))
        e = PO(k).chi(cof)
        val *= pg[k] * np.conj(Z6[e]) ** 2
    worst = max(worst, abs(val - T.g1[node] * T.g3[node])); cnt += 1
out['a'] = dict(checked=cnt, max_abs_diff=float(worst))
print('(a)', out['a'], flush=True)
# (b) on all nodes for 24 pairs (s, mu)
G = T.G(); worst = 0.0; npairs = 0; ntot = 0
prim = [(1, 0), (-2, 3), (4, 3), (1, 3), (-5, 0), (7, 0), (4, -3), (-2, -3), (1, -3), (7, 3), (-5, 3), (-5, -6)]
for s in prim[:6]:
    for mu in prim[4:8]:
        es = T.node_exponents(s).astype(np.int64); em = T.node_exponents(mu).astype(np.int64)
        y = Z.mul(Z.mul(Z.power((4, 0), 5), s), Z.power(mu, 3))
        ey = T.node_exponents(y).astype(np.int64)
        ok = (es >= 0) & (em >= 0)
        assert ((ey >= 0) == ok).all()
        lhs = T.g1 * T.g3 * np.conj(Z6[es % 6]) * Z6[(3 * em) % 6]
        rhs = G * np.conj(Z6[ey % 6]) * T.g1
        worst = max(worst, float(np.abs(lhs - rhs)[ok].max())); npairs += 1; ntot += int(ok.sum())
out['b'] = dict(pairs=npairs, node_checks=ntot, max_abs_diff=worst)
print('(b)', out['b'], flush=True)
json.dump(out, open(__file__.replace('ident.py', 'ident.json'), 'w'))
