# Holomorphic newforms with trivial character, level <= 100, from eta quotients and elliptic curves (point counts);
# each is checked against its functional equation: F(y) = sum a_n e^{-2 pi n y/sqrt N} satisfies F(1/y) = w y^k F(y), w = +-1.
import math, numpy as np

def eta_quotient(pairs, nmax):
    """q-expansion coefficients of prod eta(d z)^r for pairs (d, r); returns integer list a[0..nmax] (a[n] = coeff of q^n)."""
    lead = sum(d*r for d, r in pairs); assert lead % 24 == 0; lead //= 24
    ser = [0]*(nmax + 1); ser[0] = 1
    for d, r in pairs:
        for _ in range(abs(r)):
            if r > 0:      # multiply by prod (1 - q^{dn})
                for n in range(1, nmax//d + 1):
                    m = d*n
                    for i in range(nmax, m - 1, -1): ser[i] -= ser[i - m]
            else:
                for n in range(1, nmax//d + 1):
                    m = d*n
                    for i in range(m, nmax + 1): ser[i] += ser[i - m]
    a = [0]*(nmax + 1)
    for i in range(0, nmax + 1 - lead): a[i + lead] = ser[i]
    return a

ETA = {  # name: (k, N, pairs)
    '11a': (2, 11, [(1, 2), (11, 2)]), '14a': (2, 14, [(1, 1), (2, 1), (7, 1), (14, 1)]), '15a': (2, 15, [(1, 1), (3, 1), (5, 1), (15, 1)]),
    '20a': (2, 20, [(2, 2), (10, 2)]), '24a': (2, 24, [(2, 1), (4, 1), (6, 1), (12, 1)]), '27a': (2, 27, [(3, 2), (9, 2)]),
    '32a': (2, 32, [(4, 2), (8, 2)]), '36a': (2, 36, [(6, 4)]),
    'k4N5': (4, 5, [(1, 4), (5, 4)]), 'k4N6': (4, 6, [(1, 2), (2, 2), (3, 2), (6, 2)]), 'k4N8': (4, 8, [(2, 4), (4, 4)]), 'k4N9': (4, 9, [(3, 8)]),
    'k6N3': (6, 3, [(1, 6), (3, 6)]), 'k6N4': (6, 4, [(2, 12)]), 'k8N2': (8, 2, [(1, 8), (2, 8)]), 'Delta': (12, 1, [(1, 24)]),
}
EC = {  # name: (N, [a1,a2,a3,a4,a6])
    '37a': (37, [0, 0, 1, -1, 0]), '43a': (43, [0, 1, 1, 0, 0]), '53a': (53, [1, -1, 1, 0, 0]), '61a': (61, [1, 0, 0, -2, 1]),
    '79a': (79, [1, 1, 1, -2, 0]), '83a': (83, [1, 1, 1, 1, 0]), '89a': (89, [1, 1, 1, -1, 0]), '17a': (17, [1, -1, 1, -1, -14]), '19a': (19, [0, 1, 1, -9, -15]),
}

def ec_ap(ainv, p):
    a1, a2, a3, a4, a6 = ainv; x = np.arange(p, dtype=np.int64)
    rhs = (x*x % p*x + a2*x*x + a4*x + a6) % p
    cnt = 0
    y = np.arange(p, dtype=np.int64)
    # count solutions of y^2 + (a1 x + a3) y = rhs: tabulate values of y^2 + b y for each x via counting
    for xi in range(p):
        b = (a1*xi + a3) % p
        cnt += int(np.count_nonzero((y*y + b*y - rhs[xi]) % p == 0))
    return p - cnt

def level1(k, nmax):
    """Delta * E4^i E6^j with 4i + 6j = k - 12 (the unique normalised cusp form for k = 16, 18, 20, 22, 26)."""
    def eis(w, c):
        e = [0]*(nmax + 1); e[0] = 1
        for n in range(1, nmax + 1): e[n] = c*sum(d**(w - 1) for d in range(1, n + 1) if n % d == 0)
        return e
    def mul(u, v):
        out = [0]*(nmax + 1)
        for i, ui in enumerate(u):
            if ui:
                for j in range(0, nmax + 1 - i): out[i + j] += ui*v[j]
        return out
    f = eta_quotient([(1, 24)], nmax); rem = k - 12
    j = 1 if rem % 4 == 2 else 0; i = (rem - 6*j)//4
    for _ in range(i): f = mul(f, eis(4, 240))
    for _ in range(j): f = mul(f, eis(6, -504))
    return f

def amp_from_ap(ap, k, N):
    """amp(p, j) = alpha^j + beta^j with Satake parameters of the analytically normalised form."""
    def amp(p, j):
        lam = ap[p]/p**((k - 1)/2.0)
        if N % p == 0: return lam**j
        if abs(lam) <= 2: return 2*math.cos(j*math.acos(lam/2))
        raise ValueError('Ramanujan fails at p=%d: %g' % (p, lam))
    return amp

def fe_check(a, k, N, y=1.13):
    """returns F(1/y)/(y^k F(y)) for F(y) = sum a_n exp(-2 pi n y/sqrt N) (must be +-1)."""
    n = np.arange(1, len(a)); af = np.array([float(v) for v in a[1:]])
    F = lambda yy: float(np.sum(af*np.exp(-2*math.pi*n*yy/math.sqrt(N))))
    return F(1/y)/(y**k*F(y))

def all_forms(nmax, check=False):
    out = {}; NN = max(nmax, 1500) if check else nmax
    for nm, (k, N, pairs) in ETA.items():
        a = eta_quotient(pairs, NN)
        if check: print(nm, k, N, 'a2..a7', a[2:8], 'FE ratio', fe_check(a, k, N))
        out[nm] = (k, N, amp_from_ap(a, k, N))
    for k in (16, 18, 20, 22, 26):
        a = level1(k, min(NN, 600))
        if check: print('level1 k=%d' % k, 'a2,a3', a[2:4], 'FE ratio', fe_check(a, k, 1))
        out['k%dN1' % k] = (k, 1, amp_from_ap(a, k, 1))
    for nm, (N, ainv) in EC.items():
        ps = [p for p in range(2, NN + 1) if all(p % r for r in range(2, int(p**0.5) + 1))]
        ap = {p: ec_ap(ainv, p) for p in ps}
        if check:
            a = [0]*(NN + 1); a[1] = 1
            for n in range(2, NN + 1):
                p = next(q for q in ps if n % q == 0); m = n; e = 0
                while m % p == 0: m //= p; e += 1
                if m > 1: a[n] = a[p**e]*a[m]
                elif e == 1: a[n] = ap[p]
                else: a[n] = ap[p]*a[p**(e - 1)] - (0 if N % p == 0 else p*a[p**(e - 2)])
            print(nm, N, 'a2..a7', [ap[p] for p in (2, 3, 5, 7)], 'FE ratio', fe_check(a, 2, N))
        out[nm] = (2, N, amp_from_ap(ap, 2, N))
    return out

if __name__ == '__main__':
    all_forms(60, check=True)
