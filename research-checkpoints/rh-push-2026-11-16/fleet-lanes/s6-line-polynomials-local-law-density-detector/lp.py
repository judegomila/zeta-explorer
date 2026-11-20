"""Lane s6-line-polynomials-local-law-density-detector: coefficient sequences of the objects (shared by c1..c4).
ZETA 1; CHI4 = chi_-4; CHI5 = (n/5); DH = Davenport-Heilbronn (1, kappa, -kappa, -1, 0 mod 5);
EA = zeta(s+1/4) zeta(s-1/4): n^(-1/4) sigma_(1/2)(n); TNR<q> = zeta(s)(1 + 2.2 sqrt(q) q^-s + q q^-2s) (off-line zeros at Re = 1/2 +- log(1.5583)/log q,
ordinates (2k+1) pi/log q); LIOU = Liouville; SGN<P> / UNI<P> = completely multiplicative, random sign / random phase at primes > P, 1 at primes <= P;
LIOU<P> = -1 at primes > P; HEAT<tau> = exp((tau/4) log^2 n) (not multiplicative)."""
import math, re, numpy as np
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
SEED = 20261120
CN = 2.2

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]

def cmult(N, val, dtype=np.float64):
    """completely multiplicative array from val(i, p) (i = index of the prime); primes with value 1 are skipped"""
    a = np.ones(N + 1, dtype=dtype); pr = primes_upto(N)
    for i, p in enumerate(pr):
        v = val(i, int(p))
        if v == 1: continue
        p = int(p); pk = p
        while pk <= N:
            a[pk::pk] *= v; pk *= p
    return a

def coefs(name, N):
    n = np.arange(0, N + 1)
    if name == 'ZETA': return np.ones(N + 1)
    if name == 'CHI4': return np.array([0.0, 1, 0, -1])[n % 4]
    if name == 'CHI5': return np.array([0.0, 1, -1, -1, 1])[n % 5]
    if name == 'DH': return np.array([0, 1, KAPPA, -KAPPA, -1.0])[n % 5]
    m = re.fullmatch(r'TNR(\d+)', name)
    if m:
        q = int(m.group(1)); return 1.0 + CN * math.sqrt(q) * (n % q == 0) + q * (n % (q * q) == 0)
    if name == 'EA':
        ea = np.ones(N + 1)
        for p in primes_upto(N):
            p = int(p); pk = p; k = 1; prev = 1.0
            while pk <= N:
                cur = sum(p ** (0.25 * (2 * j - k)) for j in range(k + 1))
                ea[pk::pk] *= cur / prev; prev = cur; pk *= p; k += 1
        return ea
    m = re.fullmatch(r'(LIOU|SGN|UNI)(\d*)', name)
    if m:
        P = int(m.group(2) or 1); kind = m.group(1); npr = len(primes_upto(N))
        if kind == 'LIOU': return cmult(N, lambda i, p: -1.0 if p > P else 1.0)
        if kind == 'SGN':
            sg = np.random.default_rng(SEED).integers(0, 2, npr)
            return cmult(N, lambda i, p: (1.0 - 2.0 * sg[i]) if p > P else 1.0)
        un = np.random.default_rng(SEED + 1).uniform(0, 2 * math.pi, npr)
        return cmult(N, lambda i, p: complex(np.exp(1j * un[i])) if p > P else 1.0, dtype=np.complex128)
    m = re.fullmatch(r'HEAT(-?[\d.]+)', name)
    if m:
        tau = float(m.group(1)); l = np.log(np.maximum(n, 1).astype(float)); return np.exp((tau / 4) * l * l)
    raise ValueError(name)

def dirichlet_inverse(a, n):
    b = np.zeros(n + 1, dtype=np.complex128 if np.iscomplexobj(a) else np.float64); b[1] = 1
    for m in range(1, n // 2 + 1):
        if b[m] != 0:
            ks = np.arange(2, n // m + 1)
            b[m * ks] -= b[m] * a[ks]
    return b

def detector_coefs(a, X, Y):
    """c(n) = sum_{d | n, d <= X} inv(d) a(n/d), n <= Y; returns (c with c[0..X] set to 0, check = max |c(n)|, 2 <= n <= X, max |inv|)"""
    inv = dirichlet_inverse(a, X)
    c = np.zeros(Y + 1, dtype=np.complex128 if (np.iscomplexobj(a) or np.iscomplexobj(inv)) else np.float64)
    for d in range(1, X + 1):
        if inv[d] != 0:
            jm = Y // d
            c[d:d * jm + 1:d] += inv[d] * a[1:jm + 1]
    chk = float(np.max(np.abs(c[2:X + 1]))) if X >= 2 else 0.0
    c[:X + 1] = 0
    return c, chk, float(np.max(np.abs(inv)))
