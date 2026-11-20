"""c7-liou-high-row-bound: sextic symbols and Gauss sums over O = Z[omega], own conventions.
Elements are pairs (u, v) = u + v*omega, omega^2 = -1 - omega.  lambda = sqrt(-3) = 1 + 2 omega.
e(z) = exp(2 pi i Tr(z/lambda)).  Primary = 1 mod 3.  chi_c = sextic symbol, zero on non-units.
gamma_1(c) = q_c^(-1/2) sum_{x mod c} chi_c(x) e(x/c)."""
import numpy as np

Z6 = np.exp(2j * np.pi * np.arange(6) / 6)     # zeta_6^k, zeta_6 = 1 + omega = e^{i pi/3}

def emul(a, b):
    (u, v), (x, y) = a, b
    return (u * x - v * y, u * y + v * x - v * y)

def epow(a, n):
    r = (1, 0)
    for _ in range(n):
        r = emul(r, a)
    return r

def is_prime(n):
    if n < 2: return False
    i = 2
    while i * i <= n:
        if n % i == 0: return False
        i += 1
    return True

def primes_primary(cmax):
    """primary generators (a, b), a = 1 mod 3, b = 0 mod 3, of prime ideals coprime to 6 with norm <= cmax"""
    out = []
    R = int(2 * cmax ** 0.5) + 3
    for a in range(-R, R + 1):
        if a % 3 != 1: continue
        for b in range(-R - (-R % 3), R + 1, 3):
            n = a * a - a * b + b * b
            if n > cmax or n < 2 or n % 2 == 0: continue
            if b == 0:
                p = abs(a)
                if is_prime(p) and p % 3 == 2: out.append((n, a, b))
            elif is_prime(n):
                out.append((n, a, b))
    out.sort()
    return out

def modpow_vec(x, e, p):
    x = x % p; r = np.ones_like(x)
    while e:
        if e & 1: r = r * x % p
        x = x * x % p; e >>= 1
    return r

def pow_pair(u, v, e, p):
    """(u + v w)^e in F_p[w]/(w^2+w+1), vectorised"""
    ru = np.ones_like(u); rv = np.zeros_like(v); u = u % p; v = v % p
    while e:
        if e & 1:
            ru, rv = (ru * u - rv * v) % p, (ru * v + rv * u - rv * v) % p
        u, v = (u * u - v * v) % p, (2 * u * v - v * v) % p
        e >>= 1
    return ru, rv

class Prime:
    def __init__(self, n, a, b):
        self.n, self.a, self.b = n, a, b
        if b != 0:
            p = n; self.p = p; self.split = True
            self.r = (-a * pow(b, -1, p)) % p            # omega -> r, pi -> 0
            z = (1 + self.r) % p
            self.tab = {pow(z, k, p): k for k in range(6)}
        else:
            self.p = abs(a); self.split = False
            self.tab = {}
            for k in range(6):
                zu, zv = epow((1, 1), k)
                self.tab[(zu % self.p, zv % self.p)] = k
    def sym(self, U, V):
        """exponent k (chi = zeta_6^k) and unit mask for elements U + V omega (int64 arrays)"""
        U = np.asarray(U, dtype=np.int64); V = np.asarray(V, dtype=np.int64); p = self.p
        if self.split:
            t = (U + V * self.r) % p
            w = modpow_vec(t, (p - 1) // 6, p)
            lut = np.full(p, -1, dtype=np.int64)
            for val, k in self.tab.items(): lut[val] = k
            k = lut[w]; mask = t != 0
        else:
            ru, rv = pow_pair(U, V, (p * p - 1) // 6, p)
            lut = np.full(p * p, -1, dtype=np.int64)
            for (zu, zv), k in self.tab.items(): lut[zu * p + zv] = k
            k = lut[ru * p + rv]; mask = ((U % p) != 0) | ((V % p) != 0)
        assert np.all(k[mask] >= 0)
        return np.where(mask, k, 0), mask
    def gamma1(self):
        p = self.p
        if self.split:
            t = np.arange(1, p, dtype=np.int64)
            k, _ = self.sym(t, np.zeros_like(t))
            return np.sum(Z6[k] * np.exp(-2j * np.pi * ((self.b * t) % p) / p)) / np.sqrt(p)
        u, v = np.meshgrid(np.arange(p, dtype=np.int64), np.arange(p, dtype=np.int64), indexing='ij')
        u = u.ravel(); v = v.ravel()
        k, m = self.sym(u, v)
        return np.sum(np.where(m, Z6[k], 0) * np.exp(-2j * np.pi * v / p)) / p

def bump(x):
    """V(x) = exp(1 - 1/(1 - t^2)), t = log2 x in (-1, 1)"""
    t = np.log2(np.asarray(x, dtype=float))
    out = np.zeros_like(t); ok = np.abs(t) < 1
    out[ok] = np.exp(1 - 1 / (1 - t[ok] ** 2))
    return out

def build(cmax):
    """primes, pair symbol table S[i,j] = exponent of chi_{pi_i}(pi_j), squarefree c <= cmax as prime index lists,
    gamma_1(c) by twisted multiplicativity gamma_1(ab) = gamma_1(a) gamma_1(b) chi_a(b) chi_b(a)."""
    pl = [Prime(*t) for t in primes_primary(cmax)]
    n = len(pl)
    A = np.array([q.a for q in pl], dtype=np.int64); B = np.array([q.b for q in pl], dtype=np.int64)
    S = np.zeros((n, n), dtype=np.int8)
    for i, q in enumerate(pl):
        k, m = q.sym(A, B); S[i] = k
    g1 = np.array([q.gamma1() for q in pl])
    norms = np.array([q.n for q in pl], dtype=np.int64)
    cs = []                                       # (norm, tuple of prime indices, gamma_1 exponent-free value)
    def dfs(start, norm, idx, g):
        cs.append((norm, tuple(idx), g))
        for j in range(start, n):
            nn = norm * int(norms[j])
            if nn > cmax: break
            e = sum(int(S[i, j]) + int(S[j, i]) for i in idx) % 6
            dfs(j + 1, nn, idx + [j], g * g1[j] * Z6[e])
    dfs(0, 1, [], 1.0 + 0j)
    cs.sort(key=lambda t: t[0])
    qc = np.array([t[0] for t in cs], dtype=np.int64)
    gam = np.array([t[2] for t in cs])
    inc = np.zeros((len(cs), n), dtype=np.float32)
    for r, t in enumerate(cs):
        inc[r, list(t[1])] = 1
    mu = np.array([(-1) ** len(t[1]) for t in cs], dtype=float)
    return dict(pl=pl, S=S, g1=g1, pn=norms, qc=qc, gam=gam, inc=inc, mu=mu)

def sym_table(pl, U, V):
    """T[i, j] = exponent of chi_{pi_i}(x_j), Zm[i, j] = 1 if pi_i | x_j"""
    T = np.zeros((len(pl), len(U)), dtype=np.float32); Zm = np.zeros((len(pl), len(U)), dtype=np.float32)
    for i, q in enumerate(pl):
        k, m = q.sym(U, V); T[i] = k; Zm[i] = ~m
    return T, Zm

def chi_c(inc, T, Zm):
    """complex matrix chi_c(x_j) for all c (rows) and elements x_j (columns)"""
    E = np.rint(inc @ T).astype(np.int64) % 6
    bad = (inc @ Zm) > 0.5
    return np.where(bad, 0, Z6[E])

def lattice(qmax):
    R = int(2 * qmax ** 0.5) + 2
    u, v = np.meshgrid(np.arange(-R, R + 1, dtype=np.int64), np.arange(-R, R + 1, dtype=np.int64), indexing='ij')
    u = u.ravel(); v = v.ravel(); q = u * u - u * v + v * v
    ok = (q <= qmax)
    return u[ok], v[ok], q[ok]
