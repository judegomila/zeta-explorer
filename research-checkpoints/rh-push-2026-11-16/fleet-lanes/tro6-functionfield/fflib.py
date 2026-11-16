"""F_7[T] metaplectic Gauss sums, Kubota coefficient sums c_k(m), theta coefficients.
Polys: coefficient tuples/arrays low->high over F_7. chi_0: F_7^* -> mu_6, chi_0(3^e)=zeta6^e.
Order-n symbol (n | 6): chi = chi_0^(6/n);  (x/c)_n := chi(Res(c,x)), c monic.
e(f) = psi0(coefficient of T^-1 of f), psi0(a)=exp(2 pi i a/7).
g(m,c) = sum_{x mod c} (x/c)_n e(m x / c)."""
import numpy as np, itertools, cmath, math
q = 7
LOG = np.full(7, -1, dtype=np.int64)
_x = 1
for _e in range(6):
    LOG[_x] = _e; _x = _x * 3 % 7
INV = np.array([0, 1, 4, 5, 2, 3, 6], dtype=np.int64)
Z6 = np.exp(2j * np.pi * np.arange(6) / 6)
PSI = np.exp(2j * np.pi * np.arange(7) / 7)

def G1(j):  # Gauss sum of chi_0^j over F_7
    return sum(Z6[(LOG[x] * j) % 6] * PSI[x] for x in range(1, 7))

# ---------- batched linear algebra mod 7 ----------
def bdet(M):
    M = M.copy() % 7
    N, s, _ = M.shape
    det = np.ones(N, dtype=np.int64)
    ar = np.arange(N)
    for j in range(s):
        nz = M[:, j:, j] != 0
        piv = nz.argmax(axis=1) + j
        has = nz.any(axis=1)
        det[~has] = 0
        sw = piv != j
        if sw.any():
            idx = ar[sw]
            tmp = M[idx, j, :].copy()
            M[idx, j, :] = M[idx, piv[sw], :]
            M[idx, piv[sw], :] = tmp
            det[sw] = (-det[sw]) % 7
        p = M[:, j, j]
        det = det * p % 7
        pinv = INV[p]
        if j + 1 < s:
            f = (M[:, j + 1:, j] * pinv[:, None]) % 7
            M[:, j + 1:, :] = (M[:, j + 1:, :] - f[:, :, None] * M[:, j, None, :]) % 7
    return det

def bres(C, R):
    """Res(c, r) for monic c (rows of C: k low coefficients, shape (N,k) or (1,k)), r rows of R (N or 1, t)."""
    C = np.atleast_2d(C); R = np.atleast_2d(R)
    k = C.shape[1]
    N = max(C.shape[0], R.shape[0])
    if k == 0:
        return np.ones(N, dtype=np.int64)
    comp = np.zeros((C.shape[0], k, k), dtype=np.int64)
    for i in range(1, k):
        comp[:, i, i - 1] = 1
    comp[:, :, k - 1] = (-C) % 7
    I = np.eye(k, dtype=np.int64)[None]
    M = np.zeros((N, k, k), dtype=np.int64)
    for i in range(R.shape[1] - 1, -1, -1):
        M = (M @ comp) % 7 if i < R.shape[1] - 1 else M
        M = (M + R[:, i][:, None, None] * I) % 7
    return bdet(M)

def allpolys(k):
    """all coefficient vectors of length k (deg<k), row index = sum c_i 7^i."""
    if k == 0:
        return np.zeros((1, 0), dtype=np.int64)
    idx = np.arange(q ** k)
    return np.stack([(idx // q ** i) % q for i in range(k)], axis=1).astype(np.int64)

# ---------- pure python poly helpers ----------
def trim(a):
    a = list(a)
    while a and a[-1] % 7 == 0:
        a.pop()
    return tuple(x % 7 for x in a)

def pdivmod(a, b):
    a = list(trim(a)); b = trim(b); db = len(b) - 1; ib = int(INV[b[-1]])
    qt = [0] * max(1, len(a) - db)
    while len(a) - 1 >= db and a:
        f = a[-1] * ib % 7; sh = len(a) - 1 - db
        qt[sh] = f
        for i, bc in enumerate(b):
            a[sh + i] = (a[sh + i] - f * bc) % 7
        while a and a[-1] == 0:
            a.pop()
    return trim(qt), tuple(a)

def pmul(a, b):
    if not a or not b:
        return ()
    r = [0] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            r[i + j] = (r[i + j] + x * y) % 7
    return trim(r)

def pres(a, b):
    """Res(a,b) = lc(a)^deg b * prod_{a(th)=0} b(th)."""
    a = trim(a); b = trim(b)
    if not a or not b:
        return 0
    res = 1
    while True:
        da, db = len(a) - 1, len(b) - 1
        if db == 0:
            return res * pow(b[0], da, 7) % 7
        if da == 0:
            return res * pow(a[0], db, 7) % 7
        if da < db:
            if da * db % 2:
                res = -res % 7
            a, b = b, a
            continue
        _, r = pdivmod(a, b)
        if not r:
            return 0
        dr = len(r) - 1
        # Res(a,b) = (-1)^{da db} lc(b)^{da-dr} Res(b,r)
        if da * db % 2:
            res = -res % 7
        res = res * pow(b[-1], da - dr, 7) % 7
        a, b = b, r

def irreducibles(maxdeg):
    irr = {d: [] for d in range(1, maxdeg + 1)}
    for d in range(1, maxdeg + 1):
        for low in itertools.product(range(7), repeat=d):
            p = tuple(low) + (1,)
            ok = True
            for e in range(1, d // 2 + 1):
                for f in irr[e]:
                    if not pdivmod(p, f)[1]:
                        ok = False; break
                if not ok:
                    break
            if ok:
                irr[d].append(p)
    return irr

_IRR = None
def factor(c, maxdeg=3):
    """factor monic c assuming any leftover without prime factors of deg<=maxdeg is irreducible."""
    global _IRR
    if _IRR is None:
        _IRR = irreducibles(3)
    c = trim(c); out = []
    for d in range(1, maxdeg + 1):
        if len(c) - 1 < d:
            break
        for p in _IRR[d]:
            if len(c) - 1 < d:
                break
            a = 0
            while True:
                qt, r = pdivmod(c, p)
                if r:
                    break
                c = qt; a += 1
            if a:
                out.append((p, a))
    if len(c) > 1:
        assert len(c) - 1 <= 2 * maxdeg + 1, c
        out.append((c, 1))
    return out

def deriv(p):
    return trim([i * p[i] for i in range(1, len(p))])

class Sym:
    """order-n machinery; s = 6/n."""
    def __init__(self, n):
        self.n = n; self.s = 6 // n
        self.G = {a: G1(self.s * a) for a in range(1, n)}
    def chi(self, x, a=1):  # chi^a(x), x in F_7
        x %= 7
        if x == 0:
            return 0
        return Z6[(int(LOG[x]) * self.s * a) % 6]
    def tau(self, P, a):  # sum_{x mod P} chi_P(x)^a e(x/P), n !| a
        p = len(P) - 1
        return self.chi(pres(P, deriv(P)), a) * (-1) ** (p - 1) * self.G[a % self.n] ** p
    def gpp(self, m, P, a):  # g(m, P^a)
        p = len(P) - 1; b = 0; mm = trim(m)
        while mm:
            qt, r = pdivmod(mm, P)
            if r:
                break
            mm = qt; b += 1
            if b >= a:
                break
        if not trim(m) or b >= a:
            return (q ** (p * a) - q ** (p * (a - 1))) if a % self.n == 0 else 0
        if b == a - 1:
            if a % self.n == 0:
                return -q ** (p * (a - 1))
            return q ** (p * (a - 1)) * np.conj(self.chi(pres(P, mm), a)) * self.tau(P, a)
        return 0
    def twist(self, fac):
        t = 1
        for i in range(len(fac)):
            for j in range(i + 1, len(fac)):
                (P, a), (Q, b) = fac[i], fac[j]
                t *= self.chi(pres(P, Q), a * b) * self.chi(pres(Q, P), a * b)
        return t
    def g(self, m, c, fac=None):
        fac = fac or factor(c)
        v = self.twist(fac)
        for P, a in fac:
            v *= self.gpp(m, P, a)
            if v == 0:
                return 0
        return v
    def g_brute(self, m, c):
        k = len(c) - 1
        tot = 0
        for low in itertools.product(range(7), repeat=k):
            x = trim(low)
            if not x:
                continue
            r = pres(c, x)
            if r == 0:
                continue
            mx = pdivmod(pmul(m, x), c)[1]
            top = mx[k - 1] if len(mx) >= k else 0
            tot += self.chi(r) * PSI[top]
        return tot

def ck_table(sym, k, Ms, verbose=False):
    """c_k(m) = sum_{c monic, deg c = k} g(m,c) for each m in Ms (list of coefficient tuples, all same degree d>=0)."""
    n, s = sym.n, sym.s
    d = len(Ms[0]) - 1
    out = np.zeros(len(Ms), dtype=complex)
    if k == 0:
        return out + 1
    Clow = allpolys(k)                       # (N,k) low coeffs of monic c
    N = Clow.shape[0]
    # Res(c,c')
    dC = np.concatenate([(Clow[:, 1:] * np.arange(1, k)) % 7, np.full((N, 1), k % 7)], axis=1)
    D = np.zeros(N, dtype=np.int64)
    for st in range(0, N, 100000):
        D[st:st + 100000] = bres(Clow[st:st + 100000], dC[st:st + 100000])
    sf = D != 0
    sgn = 6 if (k * (k - 1) // 2) % 2 else 1
    disc = (D * sgn) % 7
    g1 = np.zeros(N, dtype=complex)
    lg = LOG[D[sf]]
    g1[sf] = Z6[(3 * LOG[disc[sf]]) % 6] * sym.G[1] ** k * Z6[(s * lg) % 6]
    Cfull = np.concatenate([Clow, np.ones((N, 1), dtype=np.int64)], axis=1)
    Csf = Cfull[sf]; g1sf = g1[sf]
    sign_e = 3 * ((k * d) % 2)              # chi_0(-1)^(kd) exponent
    pw = q ** np.arange(max(d, 1))
    for im, m in enumerate(Ms):
        if d == 0:
            out[im] = g1sf.sum(); continue
        mlow = np.array(m[:d], dtype=np.int64)
        # T^i mod m
        red = np.zeros((k + 1, d), dtype=np.int64)
        v = np.zeros(d, dtype=np.int64); v[0] = 1
        for i in range(k + 1):
            red[i] = v
            top = v[d - 1]
            v = np.concatenate([[0], v[:-1]])
            v = (v - top * mlow) % 7
        idx = ((Csf @ red) % 7) @ pw
        tab = bres(mlow[None, :], allpolys(d))   # Res(m, r)
        lt = LOG[tab]
        ph = np.where(lt >= 0, np.conj(Z6[(s * (lt + sign_e)) % 6]), 0)
        out[im] = np.dot(g1sf, ph[idx])
    # non-squarefree c
    nsf = np.nonzero(~sf)[0]
    mindex = {tuple(m): i for i, m in enumerate(Ms)}
    for ic in nsf:
        c = tuple(int(x) for x in Cfull[ic])
        fac = factor(c)
        h = (1,)
        for P, a in fac:
            for _ in range(a - 1):
                h = pmul(h, P)
        dh = len(h) - 1
        if dh > d:
            continue
        tw = sym.twist(fac)
        if tw == 0:
            continue
        for low in itertools.product(range(7), repeat=d - dh):
            m = pmul(h, tuple(low) + (1,))
            im = mindex.get(m)
            if im is None:
                continue
            v = tw
            for P, a in fac:
                v *= sym.gpp(m, P, a)
                if v == 0:
                    break
            out[im] += v
    return out

def monics(d):
    return [tuple(int(x) for x in row) + (1,) for row in allpolys(d)]

# ---------------- faster version (v2) ----------------
def pgcd(a, b):
    a = trim(a); b = trim(b)
    while b:
        a, b = b, pdivmod(a, b)[1]
    if not a:
        return ()
    i = int(INV[a[-1]])
    return tuple(x * i % 7 for x in a)

def g1_sf(sym, c):
    """g(1,c) for squarefree monic c (python)."""
    k = len(c) - 1
    if k == 0:
        return 1.0
    D = pres(c, deriv(c))
    disc = D * (6 if (k * (k - 1) // 2) % 2 else 1) % 7
    return Z6[(3 * int(LOG[disc])) % 6] * sym.G[1] ** k * sym.chi(D)

def split_sqfull(c):
    """c = c1*c2, c1 squarefree, (c1,c2)=1, c2 squarefull; returns c1, factorisation of c2."""
    g = pgcd(c, deriv(c)) if deriv(c) else c
    fac = []
    c1 = trim(c)
    for P, _ in factor(g):
        a = 0
        while True:
            qt, r = pdivmod(c1, P)
            if r:
                break
            c1 = qt; a += 1
        fac.append((P, a))
    return c1, fac

def sf_sum(k, Ms, gauss_s, sym_e, nu=None, want_sf_mask=False):
    """sum over squarefree monic c of degree k of  g_(chi_0^gauss_s)(1,c) * chi_0(Res(c,m))^sym_e * nu(c),
    nu = None or (L, j): nu(c) = chi_0(Res(c, L))^j for a fixed poly L."""
    d = len(Ms[0]) - 1
    out = np.zeros(len(Ms), dtype=complex)
    Clow = allpolys(k); N = Clow.shape[0]
    if k == 0:
        return out + 1
    dC = np.concatenate([(Clow[:, 1:] * np.arange(1, k)) % 7, np.full((N, 1), k % 7)], axis=1)
    D = np.zeros(N, dtype=np.int64)
    for st in range(0, N, 100000):
        D[st:st + 100000] = bres(Clow[st:st + 100000], dC[st:st + 100000])
    sf = D != 0
    sgn = 6 if (k * (k - 1) // 2) % 2 else 1
    Gs = G1(gauss_s)
    g1 = Z6[(3 * LOG[(D[sf] * sgn) % 7]) % 6] * Gs ** k * Z6[(gauss_s * LOG[D[sf]]) % 6]
    Cfull = np.concatenate([Clow, np.ones((N, 1), dtype=np.int64)], axis=1)[sf]
    if nu is not None:
        L, j = nu
        rl = np.zeros(sf.sum(), dtype=np.int64)
        Ls = np.array(trim(L), dtype=np.int64)[None, :]
        Cl = Clow[sf]
        for st in range(0, len(rl), 100000):
            rl[st:st + 100000] = bres(Cl[st:st + 100000], Ls)
        lr = LOG[rl]
        g1 = g1 * np.where(lr >= 0, Z6[(j * lr) % 6], 0)
    sign_e = 3 * ((k * d) % 2)
    pw = q ** np.arange(max(d, 1))
    for im, m in enumerate(Ms):
        if d == 0:
            out[im] = g1.sum(); continue
        mlow = np.array(m[:d], dtype=np.int64)
        red = np.zeros((k + 1, d), dtype=np.int64)
        v = np.zeros(d, dtype=np.int64); v[0] = 1
        for i in range(k + 1):
            red[i] = v
            top = v[d - 1]
            v = np.concatenate([[0], v[:-1]])
            v = (v - top * mlow) % 7
        idx = ((Cfull @ red) % 7) @ pw
        tab = bres(mlow[None, :], allpolys(d))
        lt = LOG[tab]
        ph = np.where(lt >= 0, Z6[(sym_e * (lt + sign_e)) % 6], 0)
        out[im] = np.dot(g1, ph[idx])
    if want_sf_mask:
        return out, sf
    return out

def ck_table2(sym, k, Ms):
    """c_k(m), all monic c of degree k (complete coefficient sums)."""
    d = len(Ms[0]) - 1
    if k == 0:
        return np.ones(len(Ms), dtype=complex)
    out, sf = sf_sum(k, Ms, sym.s, -sym.s, want_sf_mask=True)
    Clow = allpolys(k)
    mindex = {tuple(m): i for i, m in enumerate(Ms)}
    for ic in np.nonzero(~sf)[0]:
        c = tuple(int(x) for x in Clow[ic]) + (1,)
        c1, fac = split_sqfull(c)
        h = (1,)
        for P, a in fac:
            for _ in range(a - 1):
                h = pmul(h, P)
        dh = len(h) - 1
        if dh > d:
            continue
        c2 = (1,)
        for P, a in fac:
            for _ in range(a):
                c2 = pmul(c2, P)
        tw = sym.twist(fac) * sym.chi(pres(c1, c2)) * sym.chi(pres(c2, c1)) * g1_sf(sym, c1)
        if tw == 0:
            continue
        for low in itertools.product(range(7), repeat=d - dh):
            m = pmul(h, tuple(low) + (1,))
            im = mindex.get(m)
            if im is None:
                continue
            r = pres(c1, m)
            if r == 0:
                continue
            v = tw * np.conj(sym.chi(r))
            for P, a in fac:
                v *= sym.gpp(m, P, a)
                if v == 0:
                    break
            out[im] += v
    return out
