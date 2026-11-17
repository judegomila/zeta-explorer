"""F_q[T] cubic objects, q = 7. Uses ../r2-ff-tro6-complete/ff.py (read-only) for resultants.
Poly index: sum c_i q^i over low coefficients; monic of degree k <-> index in [0, q^k).
Cubic symbol chi_c(x) = chi0(Res(c, x)), chi0 = cubic character of F_q (omega^(log x mod 3)).
e(y/c) = psi(coefficient of T^(k-1) in y mod c), k = deg c.  g(r, c) = sum_{x mod c} chi_c(x) e(r x / c)."""
import sys, os, numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'r2-ff-tro6-complete'))
from ff import FF
q = 7
ff = FF(q)
OM = np.exp(2j * np.pi * np.arange(3) / 3)
LOG3 = np.where(ff.LOG >= 0, ff.LOG % 3, -1)          # cubic log on F_q, -1 at 0
EMAX = 5

def polymul_idx(A, B):
    """A (na, la), B (nb, lb) coefficient arrays -> (na, nb, la+lb-1) product coefficients mod q."""
    la, lb = A.shape[1], B.shape[1]
    out = np.zeros((A.shape[0], B.shape[0], la + lb - 1), dtype=np.int64)
    for i in range(la):
        out[:, :, i:i + lb] += A[:, None, i:i + 1] * B[None, :, :]
    return out % q

def build_spf(emax=EMAX):
    """For monic x of degree e <= emax: SPF[e][idx] = (dp, ip, iy) with x = p*y, p prime of least degree
    (dp = e and iy = 0 when x is prime)."""
    SPF = {0: None}
    primes = {}
    for e in range(1, emax + 1):
        n = q ** e
        dp = np.full(n, e, dtype=np.int64); ip = np.arange(n, dtype=np.int64); iy = np.zeros(n, dtype=np.int64)
        done = np.zeros(n, dtype=bool)
        for d in range(1, e // 2 + 1):
            P = primes[d]
            if len(P) == 0: continue
            A = ff.monic(d)[P]; B = ff.monic(e - d)
            prod = polymul_idx(A, B)[:, :, :e] @ (q ** np.arange(e))       # (np, q^(e-d)) indices of products
            pi = np.repeat(P[:, None], B.shape[0], axis=1); yi = np.repeat(np.arange(B.shape[0])[None, :], len(P), axis=0)
            pr = prod.ravel(); new = ~done[pr]
            # first writer wins within this batch: use unique
            u, first = np.unique(pr[new], return_index=True)
            dp[u] = d; ip[u] = pi.ravel()[new][first]; iy[u] = yi.ravel()[new][first]; done[u] = True
        primes[e] = np.nonzero(~done)[0]
        SPF[e] = (dp, ip, iy)
    return SPF, primes
SPF, PRIMES = build_spf()

# map from nonzero residue index (length-6 coefficient vector) to (degree, monic index, leading coeff)
def residue_maps(k):
    X = ff.allc(k)                                   # (q^k, k)
    nz = X != 0
    deg = np.where(nz.any(axis=1), k - 1 - nz[:, ::-1].argmax(axis=1), -1)
    lead = np.where(deg >= 0, X[np.arange(len(X)), np.maximum(deg, 0)], 0)
    mon = (X * ff.INV[lead][:, None]) % q
    midx = np.zeros(len(X), dtype=np.int64)
    for e in range(0, k):
        sel = deg == e
        midx[sel] = mon[sel][:, :e] @ (q ** np.arange(e)) if e else 0
    return deg, midx, lead
_RM = {}
def rm(k):
    if k not in _RM: _RM[k] = residue_maps(k)
    return _RM[k]

def chi_table(clow):
    """cubic log (0,1,2; -1 if not coprime) of chi_c(x) for all residues x mod c (index = low coeffs)."""
    k = len(clow)
    if k == 0: return np.zeros(1, dtype=np.int8)
    deg, midx, lead = rm(k)
    tab = {0: np.zeros(1, dtype=np.int64)}
    for e in range(1, k):
        dp, ip, iy = SPF[e]
        t = np.full(q ** e, -9, dtype=np.int64)
        for d in range(1, e + 1):
            if d == e:
                P = PRIMES[e]
                if len(P):
                    res = ff.res_table(clow, ff.monic(e)[P])
                    t[P] = LOG3[res]
            else:
                sel = np.nonzero(dp == d)[0]
                if len(sel) == 0: continue
                a = tab[d][ip[sel]]; b = tab[e - d][iy[sel]]
                t[sel] = np.where((a < 0) | (b < 0), -1, (a + b) % 3)
        tab[e] = t
    out = np.full(q ** k, -1, dtype=np.int64)
    for e in range(0, k):
        sel = deg == e
        base = tab[e][midx[sel]]
        out[sel] = np.where(base < 0, -1, (base + k * LOG3[lead[sel]]) % 3)
    return out.astype(np.int8)

def gauss_table(tab, k):
    """F[t] = sum_x chi_c(x) psi(t.x) for all t in F_q^k."""
    f = np.where(tab >= 0, OM[np.maximum(tab, 0)], 0).reshape((q,) * k)
    return (np.fft.ifftn(f) * q ** k).reshape(-1)

def t_index(clow, M):
    """index t(m) with t_i = top(m T^i mod c) for rows m of M (n, L)."""
    k = len(clow); L = M.shape[1]
    red = ff.tops(clow, L + k - 1)[:, k - 1]
    t = np.stack([(M @ red[i:i + L]) % q for i in range(k)], axis=1)
    return t @ (q ** np.arange(k))

def monic_pad(maxdeg, L):
    """all monic polys of degree <= maxdeg as (N, L) coefficient rows, plus degree array."""
    rows = []; degs = []
    for e in range(maxdeg + 1):
        m = ff.monic(e); pad = np.zeros((m.shape[0], L), dtype=np.int64); pad[:, :e + 1] = m
        rows.append(pad); degs += [e] * m.shape[0]
    return np.concatenate(rows), np.array(degs)

def shift_coeffs(P, a):
    """coefficients of p(T + a) for rows p of P."""
    L = P.shape[1]; out = np.zeros_like(P)
    from math import comb
    for i in range(L):
        for j in range(i + 1):
            out[:, j] += P[:, i] * (comb(i, j) * pow(a, i - j, q) % q)
    return out % q
