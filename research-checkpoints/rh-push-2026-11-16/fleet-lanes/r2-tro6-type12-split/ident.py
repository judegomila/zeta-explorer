#!/usr/bin/env python3
"""ident.py -- independent brute-force checks of the identities used in RESULT.md (no import of tmp/sextic/zomega.py).

O = Z[w], w = exp(2 pi i/3); elements are pairs (a, b) = a + b w.  lambda = 1 + 2w = sqrt(-3).
e(z) = exp(2 pi i Tr(z/lambda)).  chi_p(x) = sextic residue symbol, chi_p(x) = zeta6^k with x^((Np-1)/6) = (1+w)^k mod p.
gt_j(m, c) = N(c)^(-1/2) sum_{d mod c} chi_c(d)^j e(m d / c);   gamma_j(c) = gt_j(1, c);   alpha(c) = c/|c|;
G(c) = conj(chi_c(4)) gamma_3(c)   (the convention under which (4.7) holds numerically; see REFEREE of tro6-period).

Checks (max abs error printed for each):
 I0  Lemma L: gamma_2 = mu alpha G conj(gamma_1); gamma_2 chi_c(m) = mu alpha G conj gt_1(m, c) for all m.
 I1  reciprocity sign: Rrec(a,b) := chi_b(a)/chi_a(b) in {+1,-1}; equals r(a,b) of manuscript (4.4);
     G(ab) = G(a) G(b) Rrec(a,b);  G^2 multiplicative; G depends only on c mod 4.
 I2  index-shift twisted multiplicativity: gt_1(m, ab) = Rrec(a,b) gt_1(m,a) gt_1(m a^4, b) for ALL m (coprime or not).
 I3  row coefficient f_j(m;c) := gamma_2(c) alpha(c) G(c)^j chi_c(m):
        f_j(m; ab) = Rrec(a,b)^j f_j(m; a) f_j(m a^4; b)        (j = 0, 1).
     mu-normalised kernel k_e(m;c) := alpha(c)^2 G(c)^e conj gt_1(m,c):
        k_e(m; ab) = Rrec(a,b)^(e+1) k_e(m; a) k_e(m a^4; b)    (e = 1, 2);   f_j = mu * k_{j+1}.
 I4  Vaughan identity for mu on primary squarefree-or-not elements prime to 6, exact integers.
 I5  character expansion of G over the 12 characters of (O/4)^x: number of nonzero Fourier coefficients.
 I6  n^3 part: chi_{c n^3}(m) = chi_c(m) chi_n(m)^3;  G(n^3) = gamma_3(n) for prime n;  G(c n^3) = G(c) G(n^3) Rrec(c, n).
"""
import cmath, math, itertools, random, sys
random.seed(20261116)
W = cmath.exp(2j * cmath.pi / 3)
Z6 = [cmath.exp(2j * cmath.pi * k / 6) for k in range(6)]

def mul(x, y):
    a, b = x; c, d = y
    return (a * c - b * d, a * d + b * c - b * d)
def nrm(x): return x[0] * x[0] - x[0] * x[1] + x[1] * x[1]
def cj(x): return (x[0] - x[1], -x[1])
def toc(x): return x[0] + x[1] * W
def red(x, c):
    """x mod c, canonical representative (nearest-lattice rounding of x/c)."""
    n = nrm(c); t = mul(x, cj(c))
    q = (math.floor(t[0] / n + 0.5), math.floor(t[1] / n + 0.5))
    qc = mul(q, c)
    return (x[0] - qc[0], x[1] - qc[1])
def divides(c, x):
    n = nrm(c); t = mul(x, cj(c)); return t[0] % n == 0 and t[1] % n == 0
def powmod(x, e, c):
    r = (1, 0); x = red(x, c)
    while e:
        if e & 1: r = red(mul(r, x), c)
        x = red(mul(x, x), c); e >>= 1
    return r
def congr(x, y, c): return divides(c, (x[0] - y[0], x[1] - y[1]))
U6 = [(1, 0), (1, 1), (0, 1), (-1, 0), (-1, -1), (0, -1)]          # (1+w)^k = zeta6^k
def chi_prime(pi, x):
    """exponent k of chi_pi(x) = zeta6^k, or None if pi | x."""
    if divides(pi, x): return None
    v = powmod(x, (nrm(pi) - 1) // 6, pi)
    for k in range(6):
        if congr(v, U6[k], pi): return k
    raise RuntimeError("not a sixth root of unity")
def chi(fac, x):
    """chi_c(x) for c = prod fac (list of primes with multiplicity), complex value, 0 if not coprime."""
    k = 0
    for pi in fac:
        t = chi_prime(pi, x)
        if t is None: return 0.0
        k += t
    return Z6[k % 6]
def residues(c):
    n = nrm(c); out = set(); R = int(2 * math.sqrt(n)) + 3
    for a in range(-R, R + 1):
        for b in range(-R, R + 1):
            out.add(red((a, b), c))
            if len(out) == n: return list(out)
    assert len(out) == n, (c, len(out), n); return list(out)
LAMC = toc((1, 2))
def e_add(z): return cmath.exp(2j * cmath.pi * 2 * (z / LAMC).real)
_rescache = {}
def gt(c, fac, j, m=(1, 0)):
    """gt_j(m, c) = N(c)^(-1/2) sum_{d mod c} chi_c(d)^j e(m d / c)."""
    if c not in _rescache: _rescache[c] = residues(c)
    m = red(m, c)                                                   # e(m d / c) depends on m mod c only
    cc = toc(c); mc = toc(m); s = 0j
    for d in _rescache[c]:
        x = chi(fac, d)
        if x != 0: s += x ** j * e_add(mc * toc(d) / cc)
    return s / math.sqrt(nrm(c))
def primary_split(p):
    out = []
    for a in range(-p, p + 1):
        for b in range(-p, p + 1):
            if a * a - a * b + b * b == p and a % 3 == 1 and b % 3 == 0: out.append((a, b))
    return out
PR = []
for p in (7, 13, 19, 31, 37, 43, 61, 67, 73, 79, 97):
    PR += primary_split(p)                                        # both conjugates
PR += [(-5, 0), (-11, 0)]                                         # inert, norm 25, 121
def prod(fs):
    c = (1, 0)
    for f in fs: c = mul(c, f)
    return c
def alpha(c): return toc(c) / abs(toc(c))
_g = {}
def gam(fs, j):
    key = (tuple(sorted(fs)), j)
    if key not in _g: _g[key] = gt(prod(fs), list(fs), j)
    return _g[key]
def Gf(fs):
    return chi(list(fs), (4, 0)).conjugate() * gam(fs, 3)
def sqclass(x):
    """square class (e, f) of an odd x mod 4: x = (-1)^e lambda^f * (1, w, or w^2) mod 4."""
    reps = {(0, 0): (1, 0), (1, 0): (-1, 0), (0, 1): (1, 2), (1, 1): (-1, -2)}
    for ef, r in reps.items():
        for sq in ((1, 0), (0, 1), (-1, -1)):
            t = mul(r, sq)
            if (t[0] - x[0]) % 4 == 0 and (t[1] - x[1]) % 4 == 0: return ef
    raise RuntimeError
def r_bi(x, y):
    (e, f), (g, h) = sqclass(x), sqclass(y)
    return -1 if (e * h + f * g + f * h) % 2 else 1

NMAX = int(sys.argv[1]) if len(sys.argv) > 1 else 2600
sets = [fs for r in (1, 2, 3) for fs in itertools.combinations(PR, r) if nrm(prod(fs)) <= NMAX]
# drop sets with two conjugate split primes? keep them: c is still squarefree (distinct prime ideals).
print(f"squarefree primary moduli (1-3 prime factors, norm <= {NMAX}): {len(sets)}")
def randm():
    while True:
        m = (random.randint(-30, 30), random.randint(-30, 30))
        if m != (0, 0): return m

# ---------------------------------------------------------------- I0 Lemma L
e0a = e0b = 0.0
for fs in sets:
    c = prod(fs); mu = (-1) ** len(fs); al = alpha(c); G = Gf(fs)
    e0a = max(e0a, abs(gam(fs, 2) - mu * al * G * gam(fs, 1).conjugate()))
    for m in (randm(), mul(fs[0], randm())):                      # one random, one forced non-coprime
        lhs = gam(fs, 2) * chi(list(fs), m)
        rhs = mu * al * G * gt(c, list(fs), 1, m).conjugate()
        e0b = max(e0b, abs(lhs - rhs))
print(f"I0 Lemma L: gamma_2 = mu alpha G conj gamma_1: {e0a:.2e};  gamma_2 chi_c(m) = mu alpha G conj gt(m,c) (incl. non-coprime m): {e0b:.2e}")

# ---------------------------------------------------------------- I1 reciprocity sign and G cocycle
pairs = [(A, B) for A in sets for B in sets if not set(A) & set(B) and nrm(prod(A)) * nrm(prod(B)) <= NMAX]
e1a = e1b = e1c = e1d = 0.0; nneg = 0
for A, B in pairs:
    a, b = prod(A), prod(B)
    R = chi(list(B), a) / chi(list(A), b)
    e1a = max(e1a, min(abs(R - 1), abs(R + 1)))
    Rs = 1 if abs(R - 1) < abs(R + 1) else -1
    nneg += Rs == -1
    e1b = max(e1b, abs(Rs - r_bi(a, b)))
    GA, GB, GAB = Gf(A), Gf(B), Gf(tuple(A) + tuple(B))
    e1c = max(e1c, abs(GAB - GA * GB * Rs))
    e1d = max(e1d, abs(GAB ** 2 - GA ** 2 * GB ** 2))
cls = {}
e1e = 0.0
for fs in sets:
    c = prod(fs); k = (c[0] % 4, c[1] % 4); G = Gf(fs)
    if k in cls: e1e = max(e1e, abs(cls[k] - G))
    else: cls[k] = G
print(f"I1 coprime pairs: {len(pairs)} ({nneg} with R = -1).  chi_b(a)/chi_a(b) in {{+-1}}: {e1a:.2e};  = r(a,b) of (4.4): {e1b:.2e};"
      f"  G(ab) = G(a)G(b)R: {e1c:.2e};  G^2 multiplicative: {e1d:.2e};  G constant on classes mod 4 ({len(cls)} classes seen): {e1e:.2e}")

# ---------------------------------------------------------------- I2, I3 twisted multiplicativity with index shift a^4
e2 = 0.0; e3 = {0: 0.0, 1: 0.0}; e3k = {1: 0.0, 2: 0.0}; n2 = 0
for A, B in pairs:
    a, b = prod(A), prod(B); ab = mul(a, b); AB = list(A) + list(B)
    Rs = r_bi(a, b); a4 = mul(mul(a, a), mul(a, a))
    ms = [randm(), mul(A[0], randm()), mul(B[0], randm())]
    for m in ms:
        ma4 = mul(m, a4)
        lhs = gt(ab, AB, 1, m); rhs = Rs * gt(a, list(A), 1, m) * gt(b, list(B), 1, ma4)
        e2 = max(e2, abs(lhs - rhs)); n2 += 1
        for j in (0, 1):
            f = lambda c, F, mm: gam(tuple(F), 2) * alpha(c) * Gf(tuple(F)) ** j * chi(list(F), mm)
            e3[j] = max(e3[j], abs(f(ab, AB, m) - Rs ** j * f(a, A, m) * f(b, B, ma4)))
        for e in (1, 2):
            k = lambda c, F, mm: alpha(c) ** 2 * Gf(tuple(F)) ** e * gt(c, list(F), 1, mm).conjugate()
            e3k[e] = max(e3k[e], abs(k(ab, AB, m) - Rs ** (e + 1) * k(a, A, m) * k(b, B, ma4)))
print(f"I2 gt(m,ab) = R gt(m,a) gt(m a^4, b), {n2} triples (a,b,m) incl. non-coprime m: {e2:.2e}")
print(f"I3 f_j(m;ab) = R^j f_j(m;a) f_j(m a^4;b): j=0: {e3[0]:.2e}, j=1: {e3[1]:.2e};   k_e(m;ab) = R^(e+1) k_e(m;a) k_e(m a^4;b): e=1: {e3k[1]:.2e}, e=2: {e3k[2]:.2e}")

# ---------------------------------------------------------------- I4 Vaughan identity for mu on primary elements prime to 6
def primary_elems(N):
    out = []
    R = int(2 * math.sqrt(N)) + 2
    for a in range(-R, R + 1):
        for b in range(-R, R + 1):
            if a % 3 == 1 and b % 3 == 0:
                n = a * a - a * b + b * b
                if 0 < n <= N and n % 2 == 1: out.append((a, b))   # prime to lambda (primary) and to 2 (odd norm <=> 2 does not divide)
    return sorted(out, key=nrm)
NV = 700; EL = primary_elems(NV); idx = {x: i for i, x in enumerate(EL)}
divs = {x: [] for x in EL}
for d in EL:
    for q in EL:
        if nrm(d) * nrm(q) > NV: break
        divs[mul(d, q)].append(d)
mu = {}
for x in EL:                                                       # mu by Dirichlet inversion: sum_{d | x} mu(d) = [x = 1]
    mu[x] = 1 if x == (1, 0) else -sum(mu[d] for d in divs[x] if d != x)
def quo(x, d):
    t = mul(x, cj(d)); n = nrm(d); return (t[0] // n, t[1] // n)
bad = 0; nt = 0
for Uv in (5, 12, 26):
    for x in EL:
        t1 = 2 * mu[x] if nrm(x) <= Uv else 0
        t2 = 0
        for a in divs[x]:
            if nrm(a) > Uv: continue
            y = quo(x, a)
            for b in divs[y]:
                if nrm(b) <= Uv: t2 += mu[a] * mu[b]
        t3 = 0
        for a in divs[x]:
            if nrm(a) <= Uv: continue
            b = quo(x, a)
            if nrm(b) <= Uv: continue
            kap = -sum(mu[d] for d in divs[b] if nrm(d) <= Uv)
            t3 += mu[a] * kap
        nt += 1; bad += (mu[x] != t1 - t2 + t3)
print(f"I4 Vaughan mu(c) = 2 mu(c)[N c <= U] - sum_{{abd=c; Na,Nb<=U}} mu(a)mu(b) + sum_{{ab=c; Na,Nb>U}} mu(a) kappa_U(b): {nt} cases (U = 5, 12, 26; N(c) <= {NV}), failures: {bad}")

# ---------------------------------------------------------------- I5 Fourier expansion of G over characters of (O/4)^x
units4 = [(a, b) for a in range(4) for b in range(4) if nrm((a, b)) % 2 == 1]
assert len(units4) == 12
# group (O/4)^x = <w> (order 3) x <-1> x <lambda>  (lambda^2 = -3 = 1 mod 4)
def coords(x):
    for i in range(3):
        for e in range(2):
            for f in range(2):
                t = (1, 0)
                for _ in range(i): t = mul(t, (0, 1))
                if e: t = mul(t, (-1, 0))
                if f: t = mul(t, (1, 2))
                if (t[0] - x[0]) % 4 == 0 and (t[1] - x[1]) % 4 == 0: return (i, e, f)
    raise RuntimeError
if len(cls) == 12:
    coef = {}
    for i0 in range(3):
        for e0 in range(2):
            for f0 in range(2):
                s = 0j
                for k, G in cls.items():
                    i, e, f = coords(k)
                    s += G * (W ** (i0 * i) * (-1) ** (e0 * e + f0 * f)).conjugate()
                coef[(i0, e0, f0)] = s / 12
    nz = {k: v for k, v in coef.items() if abs(v) > 1e-9}
    print(f"I5 G = sum_psi ghat(psi) psi over the 12 characters of (O/4)^x: {len(nz)} nonzero coefficients; sum |ghat|^2 = {sum(abs(v)**2 for v in coef.values()):.6f}")
    for k, v in sorted(nz.items()): print(f"     psi = (w-exponent {k[0]}, eps_-1 {k[1]}, eps_lambda {k[2]}): ghat = {v.real:+.6f}{v.imag:+.6f}i  |ghat| = {abs(v):.6f}")
else:
    print(f"I5 skipped: only {len(cls)} of 12 classes mod 4 seen")

# ---------------------------------------------------------------- I6 the n^3 part
e6a = e6b = e6c = 0.0; n6 = 0
single = [fs for fs in sets if len(fs) == 1]
for (n_,) in single:
    e6b = max(e6b, abs(gam((n_,), 3) - gt(n_, [n_], 3)))           # gamma_3(n) is the quadratic Gauss sum of chi_n^3
for A in sets:
    c = prod(A)
    for (n_,) in single[:8]:
        if n_ in A: continue
        if nrm(c) * nrm(n_) ** 3 > 4.0e6: continue
        m = randm(); fac3 = list(A) + [n_] * 3
        e6a = max(e6a, abs(chi(fac3, m) - chi(list(A), m) * chi([n_], m) ** 3))
        # finite-ray extension G(n^3) := G(n) G(n^2) R(n, n^2), G(n^2) = chi_n(4) [manuscript (4.6): G(v^2) = chi_v(4)], R(n,n^2)=R(n,n)^2=1
        Gn3 = Gf((n_,)) * chi([n_], (4, 0))
        e6c = max(e6c, abs(Gn3 - gam((n_,), 3)))                   # (4.6): G(p^3) = gamma_3(p)
        n6 += 1
print(f"I6 n^3 part ({n6} cases): chi_(c n^3)(m) = chi_c(m) chi_n(m)^3: {e6a:.2e};  G(n) chi_n(4) = gamma_3(n) [(4.6)]: {e6c:.2e}")
