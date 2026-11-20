"""lemma1.py -- exact-table checks for Lemma 1 (the theta-dual m-coefficient is a sextic Gauss sum in the modulus m)
and the K-type test (first moments of abar^l gamma_1 and abar^l gamma_2).
(a) gamma_1(m) gamma_3(m) = prod_{p|m} gamma_1(p) gamma_3(p) * prod_{p|m} chi_p(m/p)^(-2)     [shape of MS (5.3)]
(b) gamma_1(m) gamma_3(m) conj(chi_m(s)) chi_m(mu)^3 = G(m) gt_1(4^5 s mu^3, m),  G = conj(chi_m(4)) gamma_3(m) (mod-4 class function)
(c) first moments sum_{N(n)<=X} alpha(n)^(-l) gamma_j(n): WLS constant at the Kubota exponent 1/2 + 1/n and its z-score.
"""
import sys, math, json
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z
T = A.SFTable(SX + '/data/sf_1e7.npz')
Z6 = Z.ZETA6
rng = np.random.default_rng(3)
out = {}
# (a)
objs = {}
def P(k):
    if k not in objs: objs[k] = Z.PrimeO((int(T.pa[k]), int(T.pb[k])), int(T.pp[k]), bool(T.pinert[k]))
    return objs[k]
worst = 0.0; cnt = 0
for depth in (2, 3, 4):
    idx = np.flatnonzero(T.depth == depth)
    for node in rng.choice(idx, size=min(1500, len(idx)), replace=False):
        ks = []; nd = int(node)
        while nd != 0:
            ks.append(int(T.last[nd])); nd = int(T.parent[nd])
        val = 1 + 0j
        for k in ks:
            cof = (1, 0)
            for k2 in ks:
                if k2 != k: cof = Z.mul(cof, P(k2).pi)
            val *= T.pg[1][k] * T.pg[3][k] * Z6[(-2 * P(k).chi(cof)) % 6]
        worst = max(worst, abs(val - T.g1[node] * T.g3[node])); cnt += 1
print(f"(a) local-global product, {cnt} nodes of depth 2-4: max |lhs - rhs| = {worst:.2e}")
out['a'] = {'n': cnt, 'max_err': worst}
# (b)
G = T.G(); worst = 0.0; nb = 0
for s_, mu in [((1, 3), (1, 0)), ((1, 0), (1, -3)), ((1, 3), (1, -3)), ((-2, 3), (1, 6)), ((4, 3), (-5, 0))]:
    es = T.node_exponents(s_); em = T.node_exponents(mu)
    y = Z.mul(Z.mul(Z.power((4, 0), 5), s_), Z.power(mu, 3))
    ey = T.node_exponents(y)
    ok = (es >= 0) & (em >= 0)
    assert ((ey >= 0) == ok).all()
    lhs = T.g1 * T.g3 * np.conj(Z6[es % 6]) * Z6[(3 * em) % 6]
    rhs = G * np.conj(Z6[ey % 6]) * T.g1
    d = np.abs(lhs - rhs)[ok].max(); worst = max(worst, d); nb += int(ok.sum())
    print(f"(b) s={s_} mu={mu}: index y = 4^5 s mu^3 = {y}, N(y) = {Z.norm(y)}: max |lhs - rhs| over {int(ok.sum())} moduli = {d:.2e}")
gv = {}
for c in range(12):
    v = G[T.m4 == c]; gv[c] = complex(v[0]); gdev = max(globals().get('gdev', 0.0), float(np.abs(v - v[0]).max())); nvals = len(np.unique(np.round(v, 6)))
    if nvals > 1: print('   class', c, 'has', nvals, 'values of G:', np.unique(np.round(v, 6))[:6])
print("(b) G is a function of m mod 4 (12 classes), values:", ' '.join(f"{gv[c].real:+.2f}{gv[c].imag:+.2f}i" for c in range(12)))
out['b'] = {'max_err': worst, 'n': nb}
# (c)
z = T.na + T.nb * (-0.5 + 1j * math.sqrt(3) / 2); alpha = z / np.abs(z)
grid = A.geom_grid(1000, T.X, 90)
ones = np.ones(T.n, dtype=bool)
res = {}
for j, th, name in ((1, 2 / 3, 'sextic gamma_1, exponent 2/3'), (2, 5 / 6, 'cubic gamma_2, exponent 5/6')):
    g = {1: T.g1, 2: T.g2}[j]
    print(f"(c) {name}: l, all-n constant, z; sum over the 12 classes mod 4 of z^2 (null mean 12 for complex constants ~ 2 per class -> 24)")
    for l in range(-6, 7):
        v = g * np.conj(alpha) ** l
        S, cnt_ = T.partial(v, grid); c, se, chi2, dof = A.fit_fixed(grid, S, cnt_, th)
        zz = 0.0
        for cl in range(12):
            m = T.m4 == cl
            S2, c2 = T.partial(v * m, grid); cc, se2, _, _ = A.fit_fixed(grid, S2, c2, th)
            zz += abs(cc / se2) ** 2
        res[f'{j}|{l}'] = {'c': [c.real, c.imag], 'se': se, 'z': abs(c) / se, 'sumz2_classes': zz}
        print(f"    l={l:+d}: c = {c.real:+.5f}{c.imag:+.5f}i  se {se:.5f}  z = {abs(c) / se:5.1f}   sum_classes z^2 = {zz:7.1f}")
# null for sum of z^2
nul = []
for r in range(20):
    v = np.exp(2j * np.pi * rng.random(T.n)); zz = 0.0
    for cl in range(12):
        m = T.m4 == cl
        S2, c2 = T.partial(v * m, grid); cc, se2, _, _ = A.fit_fixed(grid, S2, c2, 2 / 3)
        zz += abs(cc / se2) ** 2
    nul.append(zz)
print(f"(c) null (random phases, 20 draws): sum_classes z^2 mean {np.mean(nul):.1f}, max {np.max(nul):.1f}")
out['c'] = res; out['c_null'] = nul
json.dump(out, open('tmp/research-2026-11-16/push/e2-theta-dual-mseries-fe/lemma1.json', 'w'))
