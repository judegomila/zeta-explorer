"""t1_identity.py -- checks of Lemma 1 at small size (float64, direct summation).
 (a) (4.7) consistency and twisted multiplicativity of tau on the table;
 (b) pair formula: sum_m chi_c(m) conj chi_c'(m) g_X(m) against the Poisson side;
 (c) aggregated identity: sum_m g_X(m) |B_m|^2 = X * D + X * sum_{k != 0} (form in m_c(k)), theta vector."""
import sys, math, cmath, itertools
import numpy as np
from ek_common import *
T = Tab(400)
print("nodes", T.n, "primes", len(T.pp))
# (a) |G| = 1 and G^2 real-phase check: G(c) = chi_c(4)^{+-1} gamma_3(c)
E4 = T.node_exps(T.prime_exps(np.array([4]), np.array([0])))[:, 0]
for sgn, name in ((1, "chi_c(4) gamma_3"), (-1, "conj chi_c(4) gamma_3")):
    Gt = Z6[(sgn * E4) % 6] * T.g3
    print(f"(a) max |G - {name}| = {np.abs(T.G - Gt).max():.3e}")
print("(a) max ||G|-1| =", np.abs(np.abs(T.G) - 1).max(), " max ||tau|-1| =", np.abs(np.abs(T.tau) - 1).max())
# element helpers
objs = [Zm.PrimeO((int(a), int(b)), int(p), bool(i)) for a, b, p, i in zip(T.pa, T.pb, T.pp, T.pinert)]
def chi(c, x):
    """chi_c(x) as complex (0 if not coprime); c node index."""
    tot = 0
    for j in T.factors(c):
        k = objs[j].chi(x)
        if k is None: return 0j
        tot += k
    return Z6[tot % 6]
def el(c): return (int(T.na[c]), int(T.nb[c]))
def gt1(k, c):
    """gt_1(k, c) = conj(chi_c(k)) gamma_1(c)."""
    return np.conj(chi(c, k)) * T.g1[c]
def cdiv(c, g):
    """node index of c/g."""
    fc = set(T.factors(c)) - set(T.factors(g))
    for t in range(T.n):
        if set(T.factors(t)) == fc: return t
    raise ValueError
import functools
fact = [frozenset(T.factors(c)) for c in range(T.n)]
byset = {fact[c]: c for c in range(T.n)}
def pair_dual(c, cp, X, KR):
    fg = fact[c] & fact[cp]; g = byset[fg]; c1 = byset[fact[c] - fg]; c1p = byset[fact[cp] - fg]
    tot = 0j
    n1 = Zm.mul(el(c1), el(c1p)); qn1 = Zm.norm(n1)
    for sub in itertools.chain.from_iterable(itertools.combinations(sorted(fg), r) for r in range(len(fg) + 1)):
        d = byset[frozenset(sub)]; dd = el(d); qd = Zm.norm(dd)
        pref = ((-1) ** len(sub)) / qd * chi(c1, dd) * np.conj(chi(c1p, dd)) * Zm.Rrec(el(c1), el(c1p)) / math.sqrt(qn1)
        if pref == 0: continue
        s = 0j
        for ka, kb, kq in KR:
            if kq * X / (qd * qn1) > 40 / KAP: continue
            k = (int(ka), int(kb)); mk = (-k[0], -k[1])
            s += X * math.exp(-KAP * X * kq / (qd * qn1)) * gt1(k, c1) * np.conj(gt1(mk, c1p))
        # k = 0 term: gt_1(0, c) = 0 unless c = 1
        if c1 == 0 and c1p == 0: s += X
        tot += pref * s
    return tot
X = 60.0
ma, mb, mq = elements(40 * X / KAP)
gw = np.exp(-KAP * mq / X)
KP = T.prime_exps(ma, mb); E = T.node_exps(KP)
Ph = np.where(E < 64, Z6[E % 6], 0)
ka, kb, kq = elements(40 / KAP * 400 * 400 / X)
order = np.argsort(kq); KR = list(zip(ka[order], kb[order], kq[order]))
rng = np.random.default_rng(3)
cs = [c for c in range(T.n) if T.N[c] <= 130]
worst = 0
pairs = [(c, cp) for c in cs for cp in cs]
sample = [pairs[i] for i in rng.choice(len(pairs), 60, replace=False)]
sample += [(c, c) for c in cs[:6]] + [(byset[frozenset([0, 1])], byset[frozenset([0])]), (byset[frozenset([0, 1])], byset[frozenset([1, 2])])]
for c, cp in sample:
    lhs = (Ph[c] * np.conj(Ph[cp]) * gw).sum() + (1 if (c == 0 and cp == 0) else 0)   # m = 0 term of chi_1
    rhs = pair_dual(c, cp, X, KR)
    worst = max(worst, abs(lhs - rhs))
print(f"(b) pair formula: {len(sample)} pairs (N <= 130, X = {X}), max |direct - dual| = {worst:.3e}")
# (c) aggregated: columns N <= 130, weights a_c = tau_c q^{-1/2} V(q/Z)
Zs = 40.0
V = np.exp(-np.log(T.N / Zs) ** 2)
for name, vec in (("theta", T.tau), ("aligned", np.conj(T.g1))):
    a = np.where(T.N <= 130, vec * V / np.sqrt(T.N), 0)
    lhs = (gw * np.abs(a @ Ph) ** 2).sum().real
    rhs = 0j
    for c in cs:
        for cp in cs:
            rhs += a[c] * np.conj(a[cp]) * pair_dual(c, cp, X, KR)
    print(f"(c) {name}: direct {lhs:.10f}  dual {rhs.real:.10f}  imag {rhs.imag:.2e}")
