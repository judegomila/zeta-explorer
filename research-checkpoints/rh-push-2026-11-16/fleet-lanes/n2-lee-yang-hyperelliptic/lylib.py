"""Exact Lee-Yang weight enumerator for split hyperelliptic characters over F_q.
W(u;z) = sum_k u^k sum_{D monic deg k, D(e_i)!=0 all i} prod_i z_i^{[chi(D(e_i))=-1]}
N(u;z) = (1-qu) W(u;z) = (1-qu) sum_{k<n} A_k(z) u^k + C(z) u^n,  C = ((q-1)/2)^n prod(1+z_i).
"""
import numpy as np, itertools

def chi_table(q):
    t = np.full(q, -1, dtype=np.int64); t[0] = 0
    for a in range(1, q): t[(a*a) % q] = 1
    return t

def value_tables(q, kmax):
    """vals[k] = array (q^k, q): D(x) for all monic D of degree k, all x in F_q."""
    xs = np.arange(q, dtype=np.int64)
    out = []
    for k in range(kmax+1):
        print(f"  planned allocation: {q**k}x{q} int64 = {q**k*q*8/1e6:.3f} MB", flush=True)
        if k == 0:
            out.append(np.ones((1, q), dtype=np.int64)); continue
        # coefficients c_0..c_{k-1}
        idx = np.arange(q**k, dtype=np.int64)
        v = np.ones((q**k, q), dtype=np.int64)  # Horner starting with leading 1
        for j in range(k-1, -1, -1):
            c = (idx // (q**j)) % q
            v = (v * xs[None, :] + c[:, None]) % q
        out.append(v)
    return out

def counts(q, es, vals, chi):
    """cnt[k][pat] for k<n; pat bit i set iff chi(D(e_i)) = -1; D vanishing at any e_i dropped."""
    n = len(es)
    cnt = np.zeros((n, 2**n), dtype=object)
    for k in range(n):
        s = chi[vals[k][:, es]]           # (q^k, n) in {0,1,-1}
        ok = (s != 0).all(axis=1)
        bits = ((s[ok] == -1).astype(np.int64) * (1 << np.arange(n))[None, :]).sum(axis=1)
        bc = np.bincount(bits, minlength=2**n)
        for p in range(2**n): cnt[k, p] = int(bc[p])
    return cnt

def Ncoeffs(q, n, cnt, z, one=1):
    """coefficients of N(u;z) in u (ascending), generic number type via python ops."""
    A = []
    for k in range(n):
        acc = 0*one
        for p in range(2**n):
            c = cnt[k, p]
            if c == 0: continue
            m = one
            for i in range(n):
                if (p >> i) & 1: m = m * z[i]
            acc = acc + c*m
        A.append(acc)
    C = one * ((q-1)//2)**n
    for i in range(n): C = C * (1 + z[i])
    co = [0*one]*(n+1)
    for k in range(n):
        co[k] = co[k] + A[k]
        co[k+1] = co[k+1] - q*A[k]
    co[n] = co[n] + C
    return co

def monomial_matrix(n, Z):
    """Z: (m, n) complex -> (m, 2^n) monomials."""
    m = Z.shape[0]
    M = np.ones((m, 2**n), dtype=complex)
    for p in range(2**n):
        for i in range(n):
            if (p >> i) & 1: M[:, p] *= Z[:, i]
    return M
