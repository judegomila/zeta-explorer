"""Theorem A (pairwise master identity) and Lemma R (non-coprime reduction), brute force, q in {7, 13}.
S(c,A;d) := sum_{m monic deg d} g_6(m,c) chi_A(m)."""
import sys, numpy as np, itertools
from ff import FF
q = int(sys.argv[1]); cases = eval(sys.argv[2])
F = FF(q); PSI = F.PSI
def Zr(c, A, r):
    """sum_{deg z <= r} psi(z_r) chi_c(z) conj chi_A(z); (convention: z=0 term only if c=A=1)."""
    k, N = len(c) - 1, len(A) - 1
    if r < 0:
        return 1.0 if (k == 0 and N == 0) else 0.0
    P = F.allc(r + 1)
    v = F.chi_at(c[:-1], P) * np.conj(F.chi_at(A[:-1], P)) * PSI[P[:, r]]
    return v.sum()
def S_direct(c, A, d):
    M = F.monic(d)
    return (F.gauss(c[:-1], M) * F.chi_at(A[:-1], M)).sum()
def S_A(c, A, d):   # Theorem A, coprime
    k, N = len(c) - 1, len(A) - 1
    g6A = F.gauss(A[:-1], np.array([[1]]))[0]
    return F.chim1 ** (N * (k + 1)) * q ** (d - N) * g6A * Zr(c, A, k + N - 1 - d)
def S_R(c, A, d):   # Lemma R
    # c = c1 * c2, c2 supported on primes of A
    c1 = c; c2 = (1,)
    while True:
        g = F.pgcd(c1, A)
        if len(g) == 1: break
        c1 = F.pdivmod(c1, g)[0]; c2 = F.pmul(c2, g)
    if len(c2) == 1:
        return S_A(c, A, d)
    if not F.sqfree(c2) or F.pdivmod(A, c2)[1]:
        return 0.0
    g = c2; Ap = F.pdivmod(A, g)[0]
    one = np.array([[1]])
    pref = F.chi_at(c1[:-1], np.array([g]))[0] * F.chi_at(g[:-1], np.array([c1]))[0] * F.gauss(g[:-1], one)[0]
    tot = 0
    for e in F.divisors(g, maxdeg=d):
        mu = (-1) ** omega(e)
        ph = np.conj(F.chi_at(c1[:-1], np.array([e]))[0]) * F.chi_at(Ap[:-1], np.array([e]))[0]
        tot += mu * ph * S_A(c1, Ap, d - (len(e) - 1))
    return pref * tot
def omega(e):
    n = 0; e = tuple(e)
    for dd in range(1, len(e)):
        for t in F.monics(dd):
            while len(e) > 1 and not F.pdivmod(e, t)[1] and len(t) > 1:
                e = F.pdivmod(e, t)[0]; n += 1
    return n
rng = np.random.default_rng(1)
for (k, N, d, cap) in cases:
    Cs = F.monics(k); As = [A for A in F.monics(N) if F.sqfree(A)]
    pairs = [(c, A) for c in Cs for A in As]
    if len(pairs) > cap:
        pairs = [pairs[i] for i in rng.choice(len(pairs), cap, replace=False)]
    err = {'cop_sf': 0, 'cop_nsf': 0, 'ncop': 0}; cnt = dict.fromkeys(err, 0); mx = 0
    for c, A in pairs:
        lhs = S_direct(c, A, d)
        cop = len(F.pgcd(c, A)) == 1
        key = ('cop_sf' if F.sqfree(c) else 'cop_nsf') if cop else 'ncop'
        rhs = S_A(c, A, d) if cop else S_R(c, A, d)
        err[key] = max(err[key], abs(lhs - rhs)); cnt[key] += 1; mx = max(mx, abs(lhs))
    print(f"q={q} (k,N,d)=({k},{N},{d}) r={k+N-1-d} parity={'even' if (N-k)%6==0 else 'odd'} pairs={cnt} max|S|={mx:.3g} max abs err={ {a: float('%.2g' % b) for a, b in err.items()} }", flush=True)
