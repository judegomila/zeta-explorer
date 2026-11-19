"""lemma_check.py -- finite checks of Lemma A (dual form on squarefree n) and Lemma B (Type I by level), lane c10.
Own small node set built from zomega.py primes; Gauss sums by brute force (gauss_brute), symbols in integer arithmetic.
Nothing is read from the big tables except in check L0t (Lemma L on every node of the 1e6 table)."""
import sys, os, math, itertools, cmath
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zomega as Z
Z6 = [complex(v) for v in Z.ZETA6]
rng = np.random.default_rng(10)

# primes: both primary primes above each split p <= 61, inert -5
P = []
for p in (7, 13, 19, 31, 37, 43, 61):
    a, b = Z.split_primary(p)[:2] if not isinstance(Z.split_primary(p)[0], tuple) else (None, None)
    sp = Z.split_primary(p)
    pis = sp if isinstance(sp[0], tuple) else [sp, Z.primary_assoc(Z.conj(sp))]
    for pi in pis:
        P.append(Z.PrimeO(tuple(pi), p, False))
P.append(Z.PrimeO((-5, 0), 5, True))
for X in P: assert Z.is_primary(X.pi), X.pi

class Node:
    def __init__(s, fac):
        s.fac = fac; x = (1, 0)
        for F in fac: x = Z.mul(x, F.pi)
        s.x = x; s.N = Z.norm(x); s.mu = (-1) ** len(fac); s.ids = frozenset(id(F) for F in fac)
        c = Z.to_c(x); s.alpha = c / abs(c)
    def chi(s, y):                      # exponent or None
        return Z.chi_composite(s.fac, y) if s.fac else 0
    def gam(s, j, y=(1, 0)):
        return Z.gauss_brute(s.x, s.fac, j, y) if s.fac else 1 + 0j
NMAX = 1400
nodes = [Node([])]
for r in (1, 2, 3):
    for comb in itertools.combinations(P, r):
        n = Node(list(comb))
        if n.N <= NMAX: nodes.append(n)
nodes.sort(key=lambda n: n.N)
print(f"primes {len(P)}, squarefree nodes with N <= {NMAX}: {len(nodes)}")
G1 = {}; G2 = {}; G3 = {}; GG = {}
for n in nodes:
    G1[n.x] = n.gam(1); G2[n.x] = n.gam(2); G3[n.x] = n.gam(3)
    GG[n.x] = (Z6[n.chi((4, 0))].conjugate() if n.fac else 1) * G3[n.x]
beta = {n.x: n.alpha * G2[n.x] for n in nodes}
def cop(a, b): return not (a.ids & b.ids)
def zc(k): return Z6[k % 6]

# ---------------- L0: beta_c gamma_1(c) = mu(c) alpha(c)^2 G(c), |gamma_1| = 1
e0 = max(abs(beta[n.x] * G1[n.x] - n.mu * n.alpha ** 2 * GG[n.x]) for n in nodes)
e1 = max(abs(abs(G1[n.x]) - 1) for n in nodes)
print(f"L0  beta gamma_1 = mu alpha^2 G on {len(nodes)} nodes (brute-force Gauss sums): max err {e0:.2e}; | |gamma_1| - 1 | max {e1:.2e}")

# ---------------- reciprocity chi_k(c) = R(c, k) chi_c(k): integer check
bad = 0; cnt = 0; neg = 0
for a in nodes[1:120]:
    for b in nodes[1:120]:
        if not cop(a, b): continue
        R = Z.Rrec(a.x, b.x); cnt += 1; neg += (R < 0)
        bad += ((b.chi(a.x) - a.chi(b.x) - (3 if R < 0 else 0)) % 6 != 0)
print(f"REC chi_b(a) = R(a,b) chi_a(b): {cnt} coprime pairs ({neg} with R = -1), mismatches {bad}")

# ---------------- Lemma A
u = Z.LAM
Kset = [n for n in nodes if 300 < n.N <= NMAX]            # estimator moduli
Cset = [n for n in nodes if 20 <= n.N <= 100 and n.fac]   # c
Sset = [n for n in nodes if n.N <= 40]                    # s (includes 1)
def Scut(c): return 40 * c.N / 100.0
def rho_hat(idx_nodes):                                   # sum_k gamma_1(k) conj chi_k(u * prod)
    y = u
    for n in idx_nodes: y = Z.mul(y, n.x)
    tot = 0j
    for k in Kset:
        e = k.chi(y)
        if e is None: continue
        tot += G1[k.x] * zc(-e)
    return tot
A1 = 0j; A1b = 0j; Lam = {}; rh = {}
for c in Cset:
    w = c.mu * c.alpha ** 2 * GG[c.x] / math.sqrt(c.N); wb = beta[c.x] * G1[c.x] / math.sqrt(c.N)
    for s in Sset:
        if not cop(c, s) or s.N > Scut(c): continue
        key = frozenset(c.ids | s.ids)
        if key not in rh: rh[key] = rho_hat([c, s])
        A1 += w * rh[key]; A1b += wb * rh[key]
        Lam[key] = Lam.get(key, 0) + w
A2 = sum(Lam[k] * rh[k] for k in Lam)
A3 = 0j
for k in Kset:
    eu = k.chi(u)
    inner = 0j
    for c in Cset:
        if not cop(c, k): continue
        Sk = 0j
        for s in Sset:
            if not cop(c, s) or not cop(s, k) or s.N > Scut(c): continue
            Sk += zc(-k.chi(s.x))
        R = Z.Rrec(c.x, k.x)
        inner += c.mu * c.alpha ** 2 * GG[c.x] / math.sqrt(c.N) * R * zc(-c.chi(k.x)) * Sk
    A3 += G1[k.x] * zc(-eu) * inner
multi = sum(1 for k in Lam) ; pairs = sum(1 for c in Cset for s in Sset if cop(c, s) and s.N <= Scut(c))
print(f"A   moduli {len(Kset)}, c {len(Cset)}, s {len(Sset)}, pairs (c,s) {pairs}, distinct n {multi}; |D| = {abs(A1):.6f}")
print(f"A1  mu alpha^2 G form vs beta gamma_1 form: {abs(A1 - A1b):.2e}")
print(f"A2  divisor regrouping sum_n rho-hat(u n) Lambda(n): {abs(A1 - A2):.2e}")
print(f"A3  trilinear form with reciprocity (Moebius sum of conj chi_c(k) R(c,k)): {abs(A1 - A3):.2e}")

# ---------------- Lemma B
rows = []
for a in range(-40, 41):
    for b in range(-39, 40, 3):
        if a % 3 == 1 and 1 <= a * a - a * b + b * b <= 220 and (a * a - a * b + b * b) % 2 == 1:
            rows.append((a, b))
rho = rng.standard_normal(len(rows)) + 1j * rng.standard_normal(len(rows))
Cb = [n for n in nodes if 150 < n.N <= 900 and n.fac]       # conductor window
Ab = [n for n in nodes if 1 < n.N <= 40]                    # levels
def chiv(n, y):
    e = n.chi(y); return 0j if e is None else zc(e)
T = {c.x: sum(r * chiv(c, m) for r, m in zip(rho, rows)) for c in Cb}
bynode = {n.ids: n for n in nodes}
# B1
eb1 = 0; nb1 = 0
for a in Ab:
    for c in Cb:
        if not a.ids <= c.ids or a.ids == c.ids: continue
        b = bynode[c.ids - a.ids]
        a4 = Z.power(a.x, 4)
        for m in rows[::7]:
            lhs = beta[c.x] * chiv(c, m); rhs = beta[a.x] * chiv(a, m) * beta[b.x] * chiv(b, Z.mul(m, a4))
            eb1 = max(eb1, abs(lhs - rhs)); nb1 += 1
print(f"B1  beta_ab chi_ab(m) = beta_a chi_a(m) beta_b chi_b(m a^4): {nb1} triples, max err {eb1:.2e}")
# B2, B3, B4
tot_lhs = 0j; eb2 = 0; tot_M = 0j
Mc = {c.x: 0 for c in Cb}
ta = {}
for a in Ab:
    t1 = 0j; a4 = Z.power(a.x, 4); t2 = 0j
    for c in Cb:
        if not a.ids <= c.ids: continue
        t1 += c.mu * beta[c.x] * T[c.x]; Mc[c.x] += a.mu
        b = bynode[c.ids - a.ids]
        # inner Kubota term alpha(b)^2 G(b) conj gt(m a^4, b) by brute force at the shifted index
        for r, m in zip(rho, rows):
            ca = chiv(a, m)
            if ca == 0: continue
            g = b.gam(1, Z.mul(m, a4)) if b.fac else 1
            t2 += a.mu * beta[a.x] * r * ca * b.alpha ** 2 * GG[b.x] * np.conj(g)
    ta[a.x] = t1; eb2 = max(eb2, abs(t1 - t2)); tot_lhs += a.mu * t1
print(f"B2  level sum t_a = mu(a) beta_a sum_m rho chi_a(m) sum_b alpha^2 G conj gt(m a^4, b): {len(Ab)} levels, max err {eb2:.2e}")
tot_M = sum(c.mu * beta[c.x] * T[c.x] * Mc[c.x] for c in Cb)
print(f"B3  sum_a mu(a) t_a = sum_c mu(c) beta_c T(c) M(c): err {abs(tot_lhs - tot_M):.2e}; |value| = {abs(tot_lhs):.4f}; M(c) range {min(Mc.values())}..{max(Mc.values())}")
tot4 = 0j
Call = {c.ids for c in Cb}
for b in nodes:
    for a in Ab:
        if not cop(a, b) or (a.ids | b.ids) not in Call: continue
        for r, m in zip(rho, rows):
            cb = chiv(b, m); ca = chiv(a, m)
            if cb == 0 or ca == 0: continue
            g2 = a.gam(2, Z.mul(m, b.x))
            tot4 += r * b.mu * beta[b.x] * cb * a.alpha * ca ** 3 * g2
print(f"B4  = sum_m rho sum_b mu(b) beta_b chi_b(m) sum_a alpha(a) chi_a(m)^3 gt_2(m b, a) (cubic Gauss sums, brute force): err {abs(tot_lhs - tot4):.2e}")

# ---------------- L0t: Lemma L on the full 1e6 table
if os.path.exists('data/sf_1e6.npz'):
    import alib as A
    Tb = A.SFTable('data/sf_1e6.npz')
    cz = Tb.na + Tb.nb * Z.to_c((0, 1)); al = cz / np.abs(cz)
    err = np.abs(al * Tb.g2 * Tb.g1 - Tb.mu * al ** 2 * Tb.G())
    print(f"L0t table 1e6: beta gamma_1 = mu alpha^2 G on {Tb.n} nodes, max err {err.max():.2e}")
