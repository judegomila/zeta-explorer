"""Generic F_q[T] (q prime, q = 1 mod 6) brute-force objects. Independent of ../tro6-functionfield/fflib.py:
Gauss sums are computed from the definition by a k-dimensional DFT, symbols by resultants (batched determinants).
Polys: integer index  sum c_i q^i  for the low coefficients; monic of degree k <-> index in [0,q^k)."""
import numpy as np, itertools, math
class FF:
    def __init__(s, q):
        s.q = q; s._cache = {}
        g = next(g for g in range(2, q) if len({pow(g, e, q) for e in range(q - 1)}) == q - 1)
        s.LOG = np.full(q, -1, dtype=np.int64); x = 1
        for e in range(q - 1):
            s.LOG[x] = e; x = x * g % q
        s.INV = np.array([0] + [pow(a, q - 2, q) for a in range(1, q)], dtype=np.int64)
        s.h = (q - 1) // 6
        s.Z6 = np.exp(2j * np.pi * np.arange(6) / 6)
        s.PSI = np.exp(2j * np.pi * np.arange(q) / q)
        s.chim1 = s.chi0(q - 1)
    def chi0(s, a, j=1):
        a %= s.q
        return 0 if a == 0 else s.Z6[(int(s.LOG[a]) * j) % 6]   # chi_0(a) = zeta6^(log a)  (order 6 since h | ... uses log mod 6)
    def G(s, j):
        return sum(s.chi0(a, j) * s.PSI[a] for a in range(1, s.q))
    def coeffs(s, idx, L):
        idx = np.asarray(idx, dtype=np.int64)
        return np.stack([(idx // s.q ** i) % s.q for i in range(L)], axis=-1) if L else np.zeros(idx.shape + (0,), dtype=np.int64)
    def allc(s, L):
        return s.coeffs(np.arange(s.q ** L), L)
    def bdet(s, M):
        q = s.q; M = M.copy() % q; n, k, _ = M.shape
        det = np.ones(n, dtype=np.int64); ar = np.arange(n)
        for j in range(k):
            nz = M[:, j:, j] != 0
            piv = nz.argmax(axis=1) + j; has = nz.any(axis=1)
            det[~has] = 0
            sw = piv != j
            if sw.any():
                idx = ar[sw]; tmp = M[idx, j, :].copy()
                M[idx, j, :] = M[idx, piv[sw], :]; M[idx, piv[sw], :] = tmp
                det[sw] = (-det[sw]) % q
            p = M[:, j, j]; det = det * p % q; pinv = s.INV[p]
            if j + 1 < k:
                f = (M[:, j + 1:, j] * pinv[:, None]) % q
                M[:, j + 1:, :] = (M[:, j + 1:, :] - f[:, :, None] * M[:, j, None, :]) % q
        return det
    def res_table(s, clow, R):
        """Res(c, r) for one monic c (low coeffs clow, length k) and rows r of R (n, t) (any polys). -> (n,) in F_q"""
        q = s.q; k = len(clow); R = np.atleast_2d(R); n = R.shape[0]
        if k == 0:
            return np.ones(n, dtype=np.int64)
        comp = np.zeros((k, k), dtype=np.int64)
        for i in range(1, k):
            comp[i, i - 1] = 1
        comp[:, k - 1] = (-np.asarray(clow)) % q
        M = np.zeros((n, k, k), dtype=np.int64); I = np.eye(k, dtype=np.int64)[None]
        for i in range(R.shape[1] - 1, -1, -1):
            M = (M @ comp) % q
            M = (M + R[:, i][:, None, None] * I) % q
        return s.bdet(M)
    def chilog(s, clow):
        """log table (mod 6; -1 for zero) of chi_c(x) = chi_0(Res(c,x)) over all residues x (index = low coeffs)."""
        k = len(clow); key = tuple(int(x) for x in clow)
        if key in s._cache: return s._cache[key]
        r = s.res_table(clow, s.allc(k)) if k else np.ones(1, dtype=np.int64)
        lg = s.LOG[r]
        out = np.where(lg >= 0, lg % 6, -1).astype(np.int8)
        if k <= 4: s._cache[key] = out
        return out
    def tops(s, clow, n):
        """top(T^i mod c) (coefficient of T^(k-1)) and full reductions T^i mod c for i < n."""
        q = s.q; k = len(clow); red = np.zeros((n, k), dtype=np.int64)
        v = np.zeros(k, dtype=np.int64)
        if k: v[0] = 1
        for i in range(n):
            red[i] = v
            if k:
                top = v[k - 1]; v = np.concatenate([[0], v[:-1]]); v = (v - top * np.asarray(clow)) % q
        return red
    def redidx(s, clow, P):
        """index of (p mod c) for rows p of P (n, L) coefficient arrays."""
        k = len(clow); P = np.atleast_2d(P)
        if k == 0:
            return np.zeros(P.shape[0], dtype=np.int64)
        red = s.tops(clow, P.shape[1])
        return ((P @ red) % s.q) @ (s.q ** np.arange(k))
    def chi_at(s, clow, P, j=1):
        """chi_c(p)^j for rows p of P (complex, 0 if not coprime)."""
        lg = s.chilog(clow)[s.redidx(clow, P)]
        return np.where(lg >= 0, s.Z6[(lg * j) % 6], 0)
    def gauss_all(s, clow, j=1):
        """array over t in F_q^k (index low coeffs) of sum_x chi_c(x)^j psi(t.x)."""
        q = s.q; k = len(clow)
        if k == 0:
            return np.ones(1, dtype=complex)
        lg = s.chilog(clow)
        f = np.where(lg >= 0, s.Z6[(lg * j) % 6], 0).reshape((q,) * k)   # axes: last axis = coefficient 0? index = sum c_i q^i -> reshape gives axis order c_{k-1},...,c_0
        F = np.fft.ifftn(f) * q ** k        # sum_x f(x) exp(+2 pi i t.x/q)
        return F.reshape(-1)
    def gauss(s, clow, M, j=1):
        """g_(chi^j)(m, c) = sum_{x mod c} chi_c(x)^j e(m x / c) for rows m of M (n, L)."""
        k = len(clow); M = np.atleast_2d(M)
        if k == 0:
            return np.ones(M.shape[0], dtype=complex)
        F = s.gauss_all(clow, j)
        red = s.tops(clow, M.shape[1] + k - 1)[:, k - 1]            # s_n = top(T^n mod c)
        # t_i = top(m T^i mod c) = sum_j m_j s_{i+j}
        t = np.stack([(M @ red[i:i + M.shape[1]]) % s.q for i in range(k)], axis=1)
        return F[t @ (s.q ** np.arange(k))]
    def monic(s, d):
        """coefficient arrays (q^d, d+1) of all monic polys of degree d."""
        return np.concatenate([s.allc(d), np.ones((s.q ** d, 1), dtype=np.int64)], axis=1)
    # python helpers on tuples (low->high)
    def trim(s, a):
        a = [int(x) % s.q for x in a]
        while a and a[-1] == 0: a.pop()
        return tuple(a)
    def pmul(s, a, b):
        if not a or not b: return ()
        r = [0] * (len(a) + len(b) - 1)
        for i, x in enumerate(a):
            for j, y in enumerate(b):
                r[i + j] = (r[i + j] + x * y) % s.q
        return s.trim(r)
    def pdivmod(s, a, b):
        a = list(s.trim(a)); b = s.trim(b); db = len(b) - 1; ib = int(s.INV[b[-1]])
        qt = [0] * max(1, len(a) - db)
        while a and len(a) - 1 >= db:
            f = a[-1] * ib % s.q; sh = len(a) - 1 - db; qt[sh] = f
            for i, bc in enumerate(b):
                a[sh + i] = (a[sh + i] - f * bc) % s.q
            while a and a[-1] == 0: a.pop()
        return s.trim(qt), tuple(a)
    def pgcd(s, a, b):
        a = s.trim(a); b = s.trim(b)
        while b: a, b = b, s.pdivmod(a, b)[1]
        if not a: return ()
        i = int(s.INV[a[-1]]); return tuple(x * i % s.q for x in a)
    def deriv(s, p):
        return s.trim([i * p[i] for i in range(1, len(p))])
    def sqfree(s, p):
        p = s.trim(p)
        if len(p) <= 2: return True
        dp = s.deriv(p)
        return bool(dp) and len(s.pgcd(p, dp)) == 1
    def monics(s, d):
        return [tuple(int(x) for x in row) for row in s.monic(d)]
    def divisors(s, p, maxdeg=None):
        """monic divisors of monic p (brute force)."""
        out = []
        for e in range(0, len(p)):
            if maxdeg is not None and e > maxdeg: break
            for t in s.monics(e):
                if not s.pdivmod(p, t)[1]: out.append(t)
        return out
