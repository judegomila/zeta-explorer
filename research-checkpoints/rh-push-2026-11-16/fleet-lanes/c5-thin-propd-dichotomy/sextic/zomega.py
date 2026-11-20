"""zomega.py -- exact arithmetic in O = Z[w] (w = e^{2 pi i/3}), sextic/cubic/quadratic residue symbols and the
normalised Gauss sums gamma_j of the 7/8 manuscript (~/lean-deps/qrh-verify/paper.txt, Sections 4.1-4.2).

Conventions (paper):
  element = pair (a, b) meaning a + b w;  q_a = N(a) = a^2 - ab + b^2;  primary = a = 1 mod 3, b = 0 mod 3.
  lambda = 1 + 2w (norm 3);  e(z) = exp(2 pi i Tr(z/lambda)) = exp(4 pi i Im z / sqrt 3).
  chi_p(x) = sixth root of unity congruent to x^{(q_p - 1)/6} mod p, 0 if p | x;  chi_c = prod chi_p^{v_p(c)}.
  Sixth roots encoded by exponents k: value zeta6^k, zeta6 = 1 + w = e^{i pi/3}.
  gamma_j(c) = q_c^{-1/2} sum_{v mod c} chi_c(v)^j e(v/c)   (c squarefree);
  generalized index: gt_j(y, c) = q_c^{-1/2} sum_{v mod c} chi_c(v)^j e(y v / c) = conj(chi_c(y))^j gamma_j(c) if (y, c) = 1.
  Cubic symbol = chi^2; quadratic = chi^3.  Dunn-Radziwill normalisation gt3(n) = chi_n(lambda)^{-2} gamma_2(n)  (paper (5.10)).

Everything here is independent of tmp/beat78_prop152_subtract_lib.py and tmp/cubic-r2-2-gauss.c (used only for cross-checks).
"""
import math, cmath
import numpy as np

SQ3 = math.sqrt(3.0)
ZETA6 = np.exp(1j * np.pi * np.arange(6) / 3.0)

# ------------------------------------------------------------------------------------------------ Z[w] arithmetic
def mul(x, y):
    a, b = x; c, d = y
    return (a * c - b * d, a * d + b * c - b * d)

def conj(x):
    a, b = x
    return (a - b, -b)

def norm(x):
    a, b = x
    return a * a - a * b + b * b

def neg(x):
    return (-x[0], -x[1])

def to_c(x):
    a, b = x
    return complex(a - b / 2.0, b * SQ3 / 2.0)

def is_primary(x):
    return x[0] % 3 == 1 and x[1] % 3 == 0

UNITS = [(1, 0), (1, 1), (0, 1), (-1, 0), (-1, -1), (0, -1)]   # zeta6^k = (1 + w)^k
LAM = (1, 2)
TWO = (-2, 0)                                                 # primary generator of (2)

def primary_assoc(x):
    for u in UNITS:
        y = mul(u, x)
        if is_primary(y):
            return y
    raise ValueError("no primary associate (not coprime to 3?)", x)

def unit_index(u):
    return UNITS.index(u)

def power(x, k):
    r = (1, 0)
    for _ in range(k):
        r = mul(r, x)
    return r

def e_add(z):
    """e(z) = exp(4 pi i Im z/sqrt 3) for complex z."""
    return cmath.exp(4j * math.pi * z.imag / SQ3)

def divides(d, x):
    """does d divide x in O?"""
    n = norm(d)
    num = mul(x, conj(d))
    return num[0] % n == 0 and num[1] % n == 0

def exact_div(x, d):
    n = norm(d)
    num = mul(x, conj(d))
    assert num[0] % n == 0 and num[1] % n == 0
    return (num[0] // n, num[1] // n)

# ------------------------------------------------------------------------------------------------ residue classes
def mod4_index(x):
    """index (0..11) of x mod 4 among the 12 units of O/4 (x odd)."""
    return _MOD4[(x[0] % 4, x[1] % 4)]

def mod9_index(x):
    """index (0..8) of primary x mod 9: x = 1 + 3t, t mod 3 (t = t0 + t1 w)."""
    a, b = x[0] % 9, x[1] % 9
    return (((a - 1) // 3) % 3) * 3 + ((b // 3) % 3)

def _mk_mod4():
    tab = {}
    k = 0
    for a in range(4):
        for b in range(4):
            if norm((a, b)) % 2 == 1:
                tab[(a, b)] = k; k += 1
    assert k == 12
    return tab
_MOD4 = _mk_mod4()
MOD4_REPS = sorted(_MOD4, key=lambda t: _MOD4[t])

# square classes mod 4: representatives 1, -1, lambda, -lambda (paper (4.4)); squares of odd units mod 4 are 1, w, w^2
def _sqclass_tab():
    reps = {(1, 0): (0, 0), (-1, 0): (1, 0), LAM: (0, 1), neg(LAM): (1, 1)}
    tab = {}
    for rep, ef in reps.items():
        for sq in [(1, 0), (0, 1), (-1, -1)]:
            c = mul(rep, sq)
            tab[(c[0] % 4, c[1] % 4)] = ef
    assert len(tab) == 12
    return tab
_SQ = _sqclass_tab()

def sqclass(x):
    return _SQ[(x[0] % 4, x[1] % 4)]

def r_bichar(ef1, ef2):
    e, f = ef1; g, h = ef2
    return -1 if (e * h + f * g + f * h) % 2 else 1

def Rrec(a, b):
    """R(a, b) of Lemma 4.4 (sextic reciprocity sign)."""
    return r_bichar(sqclass(a), sqclass(b))

def Gamma4(c):
    """four-term formula (4.3): Gamma(c) = (1 + i^{-b} + i^{a} + i^{b-a})/2 for c = a + b w."""
    a, b = c
    return (1 + 1j ** ((-b) % 4) + 1j ** (a % 4) + 1j ** ((b - a) % 4)) / 2

# ------------------------------------------------------------------------------------------------ primes
class PrimeO:
    """primary prime of O outside {2, lambda}: split (norm p = 1 mod 6) or inert (pi = -q, norm q^2)."""
    __slots__ = ("pi", "p", "q", "inert", "w", "e6", "roots", "rootsF")

    def __init__(self, pi, p, inert):
        self.pi = pi; self.p = p; self.inert = inert
        self.q = p * p if inert else p
        self.e6 = (self.q - 1) // 6
        if not inert:
            a, b = pi
            self.w = (-a * pow(b, -1, p)) % p
            assert (self.w * self.w + self.w + 1) % p == 0
            z = (1 + self.w) % p
            self.roots = {pow(z, k, p): k for k in range(6)}
            assert len(self.roots) == 6
        else:
            self.w = None
            z = (1, 1); cur = (1, 0); roots = {}
            for k in range(6):
                roots[cur] = k
                cur = mul(cur, z); cur = (cur[0] % p, cur[1] % p)
            self.roots = roots
            assert len(roots) == 6

    def reduce(self, x):
        if self.inert:
            return (x[0] % self.p, x[1] % self.p)
        return (x[0] + x[1] * self.w) % self.p

    def chi(self, x):
        """sextic symbol exponent k (chi = zeta6^k) of x mod pi, or None if pi | x."""
        r = self.reduce(x)
        if self.inert:
            if r == (0, 0):
                return None
            p = self.p; res = (1, 0); base = r; e = self.e6
            while e:
                if e & 1:
                    res = mul(res, base); res = (res[0] % p, res[1] % p)
                base = mul(base, base); base = (base[0] % p, base[1] % p)
                e >>= 1
            return self.roots[res]
        if r == 0:
            return None
        return self.roots[pow(r, self.e6, self.p)]

    def residues(self):
        """a complete residue system of O/pi as elements (list of pairs)."""
        if self.inert:
            return [(x, y) for x in range(self.p) for y in range(self.p)]
        return [(x, 0) for x in range(self.p)]

def split_primary(p):
    """primary pi = a + b w of norm p with b > 0."""
    b = 3
    while 3 * b * b <= 4 * p:
        disc = 4 * p - 3 * b * b
        d = math.isqrt(disc)
        if d * d == disc:
            for num in (b + d, b - d):
                if num % 2 == 0:
                    a = num // 2
                    if a * a - a * b + b * b == p and a % 3 == 1:
                        return (a, b)
        b += 3
    raise ValueError(p)

def sieve(n):
    s = bytearray([1]) * (n + 1); s[0] = s[1] = 0
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]:
            s[i * i::i] = bytearray(len(s[i * i::i]))
    return np.flatnonzero(np.frombuffer(bytes(s), dtype=np.uint8))

# ------------------------------------------------------------------------------------------------ brute force
def hnf_residues(n):
    """complete residue system of O/nO: lattice nO has HNF basis (d1, 0), (c, d2) in coordinates (x, y) of x + y w."""
    a, b = n
    v1 = [a, b]; v2 = [-b, a - b]                     # n and n*w
    # make second coordinate: gcd on y-components
    import math as _m
    # extended Euclid on (v1[1], v2[1])
    x0, y0 = v1, v2
    while y0[1] != 0:
        qt = x0[1] // y0[1]
        x0, y0 = y0, [x0[0] - qt * y0[0], x0[1] - qt * y0[1]]
    # x0 has y-component g = gcd, y0 has y-comp 0 -> y0 = (d1, 0)
    d2 = abs(x0[1]); d1 = abs(y0[0])
    assert d1 * d2 == norm(n), (n, d1, d2)
    return [(x, y) for x in range(d1) for y in range(d2)]

def chi_composite(factors, x):
    """sextic exponent of chi_n(x) for n = product of PrimeO factors (with repetition allowed); None if not coprime."""
    tot = 0
    for P in factors:
        k = P.chi(x)
        if k is None:
            return None
        tot += k
    return tot % 6

def gauss_brute(n, factors, j, y=(1, 0)):
    """gt_j(y, n) = q_n^{-1/2} sum_{v mod n} chi_n(v)^j e(y v/n), by direct summation (any modulus n, j integer)."""
    nc = to_c(n); s = 0j
    for v in hnf_residues(n):
        k = chi_composite(factors, v)
        if k is None:
            continue
        z = to_c(mul(y, v)) / nc
        s += ZETA6[(j * k) % 6] * e_add(z)
    return s / math.sqrt(norm(n))

# ------------------------------------------------------------------------------------------------ prime Gauss-sum tables (from gauss6.c)
REC = np.dtype([('p', '<i8'), ('a', '<i8'), ('b', '<i8'), ('r', '<i8'), ('g', '<i8'), ('j0', '<i8'),
                ('er', '<f8', 6), ('ei', '<f8', 6)])

def gammas_from_periods(rec, js=(1, 2, 3, 4, 5)):
    """normalised gamma_j for the record's prime (pi = a + b w, b > 0 for split; pi = -q for inert)."""
    eta = rec['er'] + 1j * rec['ei']                  # shape (6,) or (n, 6)
    j0 = rec['j0']
    qn = np.where(rec['b'] == 0, rec['p'].astype(float) ** 2, rec['p'].astype(float))
    out = {}
    t = np.arange(6)
    for j in js:
        ph = ZETA6[(np.multiply.outer(j * j0, t)) % 6]
        out[j] = (ph * eta).sum(axis=-1) / np.sqrt(qn)
    return out

def load_prime_table(files):
    recs = np.concatenate([np.fromfile(f, dtype=REC) for f in files])
    return recs

class PrimeTable:
    """all primary primes (split pairs pi, conj(pi), and inert -q) with N <= X, sorted by norm, with gamma_1..5."""
    def __init__(self, split_files, inert_files, X):
        S = load_prime_table(split_files); I = load_prime_table(inert_files)
        S = S[S['p'] <= X]; I = I[I['p'] ** 2 <= X]
        gs = gammas_from_periods(S); gi = gammas_from_periods(I)
        n_s = len(S); n_i = len(I)
        a = np.concatenate([S['a'], S['a'] - S['b'], I['a']])
        b = np.concatenate([S['b'], -S['b'], I['b']])
        rp = np.concatenate([S['p'], S['p'], I['p']])
        qn = np.concatenate([S['p'], S['p'], I['p'] ** 2])
        inert = np.concatenate([np.zeros(2 * n_s, bool), np.ones(n_i, bool)])
        G = {j: np.concatenate([gs[j], np.conj(gs[j]), gi[j]]) for j in gs}
        order = np.lexsort((b, a, qn))
        self.a = a[order]; self.b = b[order]; self.p = rp[order]; self.q = qn[order]; self.inert = inert[order]
        self.G = {j: G[j][order] for j in G}
        self.n = len(order)
        # residue map data
        w = np.full(self.n, -1, dtype=np.int64)
        sp = ~self.inert
        w[sp] = (-self.a[sp] * np.array([pow(int(bb) % int(pp), -1, int(pp)) for bb, pp in zip(self.b[sp], self.p[sp])],
                                        dtype=np.int64)) % self.p[sp]
        self.w = w
        self.objs = None

    def prime_objs(self):
        if self.objs is None:
            self.objs = [PrimeO((int(a), int(b)), int(p), bool(i)) for a, b, p, i in zip(self.a, self.b, self.p, self.inert)]
        return self.objs

# ------------------------------------------------------------------------------------------------ vectorised symbols chi_pi(y) over all primes
def _vpow(base, exp, mod):
    """elementwise base^exp mod mod (uint64 arrays, mod < 2^26)."""
    base = base.astype(np.uint64) % mod.astype(np.uint64)
    exp = exp.astype(np.uint64).copy(); mod = mod.astype(np.uint64)
    res = np.ones_like(base)
    while np.any(exp):
        odd = (exp & np.uint64(1)).astype(bool)
        res = np.where(odd, (res * base) % mod, res)
        base = (base * base) % mod
        exp >>= np.uint64(1)
    return res

def chi_all_primes(PT, y):
    """exponent array k_pi(y) (int8; -1 if pi | y) of chi_pi(y) for all primes in table PT."""
    ya, yb = y
    k = np.full(PT.n, -1, dtype=np.int8)
    sp = ~PT.inert
    p = PT.p[sp].astype(np.int64); w = PT.w[sp]
    r = (ya % p + (yb % p) * w) % p
    nz = r != 0
    e6 = (p - 1) // 6
    val = _vpow(r[nz], e6[nz], p[nz]).astype(np.int64)
    # match against (1 + w)^k
    z = (1 + w[nz]) % p[nz]
    cur = np.ones_like(z); kk = np.full(len(z), -1, dtype=np.int8)
    for t in range(6):
        kk[val == cur] = t
        cur = (cur * z) % p[nz]
    assert (kk >= 0).all()
    tmp = np.full(sp.sum(), -1, dtype=np.int8); tmp[nz] = kk
    k[sp] = tmp
    objs = None
    for idx in np.flatnonzero(PT.inert):
        P = PrimeO((int(PT.a[idx]), int(PT.b[idx])), int(PT.p[idx]), True)
        c = P.chi((ya, yb))
        k[idx] = -1 if c is None else c
    return k
