"""selftest.py -- exact/numerical checks of the Gauss-sum machinery against the 7/8 manuscript's identities.

Checks (each prints max error and PASS/FAIL):
  T1  gauss6 table vs brute force (done in-line for small primes; complex embedding of e(z))
  T2  Lemma 4.2: gamma_2(p)^3 = -alpha(p);  gamma_1 gamma_2 = H(4)^{+-1} gamma_3 gamma_2^3 (which orientation holds)
  T3  Lemma 4.3/4.4: gamma_3(p) = Gamma(p) (four-term formula); Gamma(p)^2 = chi_p(-1)
  T4  Lemma 4.4: sextic reciprocity chi_b(a) = R(a, b) chi_a(b), coprime primary pairs (primes and composites)
  T5  CRT twisted multiplicativity gamma_j(ab) = chi_a(b)^j chi_b(a)^j gamma_j(a) gamma_j(b) (brute force, composites)
  T6  (4.7) on squarefree c: gamma_2^3 = mu alpha; gamma_1 gamma_2 = mu alpha G with G = conj(chi_c(4)) gamma_3 (bar restored)
  T7  corollary used below: gamma_1(c) = G(c) gamma_2(c)^2 on squarefree c
  T8  Dunn-Radziwill normalisation (paper (5.8)-(5.10)): gt3(n) = q^{-1/2} sum (v/n)_3 exp(2 pi i Tr(v/n)) = chi_n(lambda)^{-2} gamma_2(n)
  T9  generalized index: gt_j(y, n) = conj(chi_n(y))^j gamma_j(n) for (y, n) = 1, brute force
  T10 cross-check vs the independent C data tmp/cubic-r2-2-data/gauss-a.txt (other implementation)
Usage: python selftest.py  (from repo root)
"""
import sys, os, math, cmath, random, itertools
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zomega as Z

random.seed(12345)
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
recs = np.fromfile(os.path.join(D, 'split_0_1e6.bin'), dtype=Z.REC)
irecs = np.fromfile(os.path.join(D, 'inert_3163.bin'), dtype=Z.REC)
res = {}

def report(name, err, tol):
    ok = err < tol
    res[name] = (float(err), ok)
    print(f"{name:60s} max err {err:.3e}  {'PASS' if ok else 'FAIL'}")

# primes with norm <= 4000 as PrimeO objects + gammas
small = [r for r in recs if r['p'] <= 4000]
P = []      # list of (PrimeO, {j: gamma_j})
for r in small:
    g = Z.gammas_from_periods(r)
    pi = (int(r['a']), int(r['b']))
    P.append((Z.PrimeO(pi, int(r['p']), False), {j: complex(g[j]) for j in g}))
    P.append((Z.PrimeO(Z.conj(pi), int(r['p']), False), {j: complex(np.conj(g[j])) for j in g}))
for r in irecs:
    if r['p'] ** 2 <= 4000:
        g = Z.gammas_from_periods(r)
        P.append((Z.PrimeO((int(r['a']), 0), int(r['p']), True), {j: complex(g[j]) for j in g}))
P.sort(key=lambda t: (t[0].q, t[0].pi))
print("primes with norm <= 4000:", len(P))

# T1 brute force on the first 40 primes (both orientations, split + inert), j = 1..5
e = 0
for Pr, g in P[:40]:
    for j in range(1, 6):
        e = max(e, abs(Z.gauss_brute(Pr.pi, [Pr], j) - g[j]))
report("T1 gauss6 table = brute force (40 primes, j=1..5)", e, 1e-8)

# T2 Lemma 4.2
e1 = e2p = e2m = 0
for Pr, g in P:
    al = Z.to_c(Pr.pi); al /= abs(al)
    e1 = max(e1, abs(g[2] ** 3 + al))
    h4 = Z.ZETA6[Pr.chi((4, 0))]
    e2p = max(e2p, abs(g[1] * g[2] - h4 * g[3] * g[2] ** 3))
    e2m = max(e2m, abs(g[1] * g[2] - np.conj(h4) * g[3] * g[2] ** 3))
report("T2a gamma_2(p)^3 = -alpha(p)", e1, 1e-8)
print(f"    T2b gamma_1 gamma_2 = H(4) gamma_3 gamma_2^3 (as printed): err {e2p:.3e};  with conj(H(4)): err {e2m:.3e}")
report("T2b gamma_1 gamma_2 = conj(H(4)) gamma_3 gamma_2^3 (bar restored)", e2m, 1e-8)

# T3 gamma_3 = Gamma four-term; Gamma^2 = chi_p(-1)
e3 = e3b = 0
for Pr, g in P:
    e3 = max(e3, abs(g[3] - Z.Gamma4(Pr.pi)))
    e3b = max(e3b, abs(Z.Gamma4(Pr.pi) ** 2 - Z.ZETA6[Pr.chi((-1, 0))]))
report("T3a gamma_3(p) = Gamma(p) (four-term formula 4.3)", e3, 1e-8)
report("T3b Gamma(p)^2 = chi_p(-1)", e3b, 1e-12)

# composite squarefree elements from these primes
def make_sf(k, maxnorm, trials):
    out = []
    while len(out) < trials:
        fs = random.sample(P, k)
        if len({f[0].pi for f in fs}) < k: continue
        if len({f[0].p for f in fs if f[0].inert}) < sum(f[0].inert for f in fs): continue
        n = (1, 0)
        for f in fs: n = Z.mul(n, f[0].pi)
        # distinct prime ideals? (pi and conj(pi) are distinct ideals; inert appear once)
        if Z.norm(n) > maxnorm: continue
        out.append((n, fs))
    return out

# T4 reciprocity on prime pairs and composite pairs
mx = 0; cnt = 0
for (A, ga), (B, gb) in itertools.combinations(P[:120], 2):
    if A.p == B.p and (A.inert or B.inert): continue
    ka = B.chi(A.pi); kb = A.chi(B.pi)
    if ka is None or kb is None: continue
    lhs = Z.ZETA6[ka]; rhs = Z.Rrec(A.pi, B.pi) * Z.ZETA6[kb]
    mx = max(mx, abs(lhs - rhs)); cnt += 1
comp = make_sf(2, 10 ** 7, 300)
for (n1, f1), (n2, f2) in zip(comp[::2], comp[1::2]):
    if set(f[0].pi for f in f1) & set(f[0].pi for f in f2): continue
    k12 = Z.chi_composite([f[0] for f in f2], n1); k21 = Z.chi_composite([f[0] for f in f1], n2)
    if k12 is None or k21 is None: continue
    mx = max(mx, abs(Z.ZETA6[k12] - Z.Rrec(n1, n2) * Z.ZETA6[k21])); cnt += 1
report(f"T4 reciprocity chi_b(a) = R(a,b) chi_a(b) ({cnt} pairs)", mx, 1e-12)

# T5, T6, T7, T9 on composite squarefree n with small norm (brute force)
comps = make_sf(2, 2500, 25) + make_sf(3, 6000, 6)
e5 = e6a = e6b = e6c = e7 = e9 = 0
for n, fs in comps:
    facs = [f[0] for f in fs]
    gams = {}
    for j in (1, 2, 3):
        # twisted multiplicativity built prime by prime
        acc = 1 + 0j; cur = (1, 0); curf = []
        for Pr, g in fs:
            if curf:
                k1 = Z.chi_composite(curf, Pr.pi); k2 = Pr.chi(cur)
                acc = acc * Z.ZETA6[(j * (k1 + k2)) % 6]
            acc *= g[j]; cur = Z.mul(cur, Pr.pi); curf.append(Pr)
        gb = Z.gauss_brute(n, facs, j)
        e5 = max(e5, abs(acc - gb)); gams[j] = gb
    mu = (-1) ** len(fs); al = Z.to_c(n) / abs(Z.to_c(n))
    k4 = Z.chi_composite(facs, (4, 0))
    Gbar = np.conj(Z.ZETA6[k4]) * gams[3]; Gnob = Z.ZETA6[k4] * gams[3]
    e6a = max(e6a, abs(gams[2] ** 3 - mu * al))
    e6b = max(e6b, abs(gams[1] * gams[2] - mu * al * Gbar))
    e6c = max(e6c, abs(gams[1] * gams[2] - mu * al * Gnob))
    e7 = max(e7, abs(gams[1] - Gbar * gams[2] ** 2))
    # generalized index (random index coprime to n)
    for _ in range(2):
        while True:
            y = (random.randint(-50, 50), random.randint(-50, 50))
            if y != (0, 0) and Z.chi_composite(facs, y) is not None: break
        ky = Z.chi_composite(facs, y)
        for j in (1, 2):
            e9 = max(e9, abs(Z.gauss_brute(n, facs, j, y) - np.conj(Z.ZETA6[ky]) ** j * gams[j]))
report(f"T5 twisted multiplicativity vs brute force ({len(comps)} composites, j=1,2,3)", e5, 1e-8)
report("T6a gamma_2(c)^3 = mu(c) alpha(c)", e6a, 1e-8)
report("T6b gamma_1 gamma_2 = mu alpha G, G = conj(chi_c(4)) gamma_3 (bar restored)", e6b, 1e-8)
print(f"    T6c same with G = chi_c(4) gamma_3 (as printed, no bar): err {e6c:.3e}  (expected to FAIL)")
report("T7 gamma_1(c) = G(c) gamma_2(c)^2", e7, 1e-8)
report("T9 gt_j(y,n) = conj(chi_n(y))^j gamma_j(n), (y,n)=1", e9, 1e-8)

# T8 Dunn-Radziwill normalisation, primes and composites
def gt3_brute(n, facs):
    s = 0j
    for v in Z.hnf_residues(n):
        k = Z.chi_composite(facs, v)
        if k is None: continue
        z = Z.to_c(v) / Z.to_c(n)
        s += Z.ZETA6[(2 * k) % 6] * cmath.exp(2j * math.pi * 2 * z.real)   # exp(2 pi i Tr z), Tr z = 2 Re z
    return s / math.sqrt(Z.norm(n))
e8 = 0
for Pr, g in P[:30]:
    kl = Pr.chi(Z.LAM)
    e8 = max(e8, abs(gt3_brute(Pr.pi, [Pr]) - Z.ZETA6[(-2 * kl) % 6] * g[2]))
for n, fs in comps[:10]:
    facs = [f[0] for f in fs]
    kl = Z.chi_composite(facs, Z.LAM)
    e8 = max(e8, abs(gt3_brute(n, facs) - Z.ZETA6[(-2 * kl) % 6] * Z.gauss_brute(n, facs, 2)))
report("T8 DR normalisation gt3(n) = chi_n(lambda)^{-2} gamma_2(n)", e8, 1e-8)

# T10 cross-check with independent C implementation (tmp/cubic-r2-2-gauss.c data)
f10 = os.path.join(os.path.dirname(D), '..', 'cubic-r2-2-data', 'gauss-a.txt')
if os.path.exists(f10):
    mine = {int(r['p']): r for r in recs}
    mx10 = 0; n10 = 0
    with open(f10) as fh:
        for line in fh:
            v = line.split(); p = int(v[0]); a, b = int(v[1]), int(v[2])
            if p > 1000000 or p not in mine: continue
            if n10 >= 4000: break
            S = np.array([float(v[4 + 2 * t]) + 1j * float(v[5 + 2 * t]) for t in range(6)])
            g_other = {j: (Z.ZETA6[(j * np.arange(6)) % 6] * S).sum() / math.sqrt(p) for j in (1, 2, 3)}
            r = mine[p]; g = Z.gammas_from_periods(r)
            if (a, b) == (int(r['a']), int(r['b'])):
                gm = {j: complex(g[j]) for j in (1, 2, 3)}
            elif (a, b) == Z.conj((int(r['a']), int(r['b']))):
                gm = {j: complex(np.conj(g[j])) for j in (1, 2, 3)}
            else:
                raise SystemExit(f"prime mismatch {p}")
            for j in (1, 2, 3):
                mx10 = max(mx10, abs(gm[j] - g_other[j]))
            n10 += 1
    report(f"T10 vs independent C data cubic-r2-2 ({n10} primes, j=1,2,3)", mx10, 1e-6)
else:
    print("T10 skipped (no data)")

print("ALL PASS" if all(ok for _, ok in res.values()) else "SOME FAIL")
