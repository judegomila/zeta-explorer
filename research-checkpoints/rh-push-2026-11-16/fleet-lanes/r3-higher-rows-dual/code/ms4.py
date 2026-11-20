#!/usr/bin/env python3
"""ms4.py -- mean squares of quartic rows over Q(i) in the regime (number of rows) ~ (length).

Rows m: squarefree primary (m = 1 mod (2+2i)), N(m) <= QMAX.  Columns a: squarefree primary, N(a) <= XMAX,
weight w(N a / Z), w(x) = x exp(-x^2), for several lengths Z.  gamma_1(a) = g(chi_a)/sqrt(N a), chi_a = (./a)_4.

Variants (coefficient c_a, row symbol):
  T   c = mu*gamma_1,  conj chi_a(m)   exact Poisson dual of the order-4 Moebius rows (index class 3, alpha-twisted)
  K3  c = gamma_1,     chi_a(m)        Kubota sum at index m^3 (class 3, untwisted); residue tau_4(m^3) = 0 (Suzuki)
  K1  c = gamma_1,     conj chi_a(m)   Kubota sum at literal index m (class 1); pole with residue tau_4(m)
  K1t c = conj chi_a(l^2) gamma_1, conj chi_a(m)   index lambda^2 m (class 1; the pole is visible at m = 1, pole_probe.py)
  K3t c = conj chi_a(l^2) gamma_1, chi_a(m)        index lambda^2 m^3 (class 3 with the same ramified twist)
  MU  c = mu,          chi_a(m)        Moebius sums twisted by chi_.(m)  (the family whose dual is T)
  L   c = 1,           chi_a(m)        partial sums of L(s, chi_.(m))
  RND c = random unit phases, chi_a(m) baseline

Output: for each Z and each dyadic bin of N(m): R = mean_m |B_m|^2 / sum_a |c_a w_a|^2  (R = 1: square-root size).
usage: ms4.py ZMAX [NPROC] [out.npz]
"""
import sys, os, math, time
import numpy as np

ZMAX = int(float(sys.argv[1])); NPROC = int(sys.argv[2]) if len(sys.argv) > 2 else 1
OUT = sys.argv[3] if len(sys.argv) > 3 else 'ms4_%d.npz' % ZMAX
CUT = 3.5
XMAX = int(CUT * ZMAX); QMAX = ZMAX
I4 = np.array([1, 1j, -1, -1j, 0], dtype=np.complex64)
ZERO = 64

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** .5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0].tolist()

def prime_factors(m):
    f = []; d = 2
    while d * d <= m:
        if m % d == 0:
            f.append(d)
            while m % d == 0: m //= d
        d += 1
    if m > 1: f.append(m)
    return f

def two_squares(p):
    x = next(pow(a, (p - 1) // 4, p) for a in range(2, p) if pow(a, (p - 1) // 2, p) == p - 1)
    a, b = p, x
    while b * b > p: a, b = b, a % b
    c, d = b, int(round(math.sqrt(p - b * b)))
    if c % 2 == 0: c, d = d, c
    return c, d

def gmul(x, y, q): return ((x[0] * y[0] - x[1] * y[1]) % q, (x[0] * y[1] + x[1] * y[0]) % q)
def gpow(x, e, q):
    r = (1, 0)
    while e:
        if e & 1: r = gmul(r, x, q)
        x = gmul(x, x, q); e >>= 1
    return r

# prime record: (kind, p, c, d, r)  kind 0 split pi = c + d i (primary), kind 1 inert pi = -q
def sym(P, z):
    kind, p, c, d, r = P; a, b = z
    if kind == 0:
        t = (a + b * r) % p
        if t == 0: return None
        v = pow(t, (p - 1) // 4, p)
        return 0 if v == 1 else 1 if v == r else 2 if v == p - 1 else 3
    if a % p == 0 and b % p == 0: return None
    v = gpow((a % p, b % p), (p * p - 1) // 4, p)
    return {(1, 0): 0, (0, 1): 1, (p - 1, 0): 2, (0, p - 1): 3}[v]

def gauss_split(P):
    kind, p, c, d, r = P; fs = prime_factors(p - 1)
    g0 = next(g for g in range(2, p) if all(pow(g, (p - 1) // f, p) != 1 for f in fs))
    j = sym(P, (g0, 0))
    arr = np.array([1], dtype=np.int64)
    while len(arr) < p - 1: arr = np.concatenate([arr, arr * pow(g0, len(arr), p) % p])
    arr = arr[:p - 1]
    k = (np.arange(p - 1, dtype=np.int64) * j) % 4
    ph = np.exp(2j * np.pi * ((2 * c * arr) % p) / p)
    return complex((np.array([1, 1j, -1, -1j])[k] * ph).sum() / math.sqrt(p))

def gauss_inert(P):
    q = P[1]; N = q * q; fs = prime_factors(N - 1); gen = None
    for a in range(1, q):
        for b in range(1, q):
            if all(gpow((a, b), (N - 1) // f, q) != (1, 0) for f in fs): gen = (a, b); break
        if gen: break
    j = sym(P, gen)
    xa = np.array([1], dtype=np.int64); xb = np.array([0], dtype=np.int64)
    while len(xa) < N - 1:
        ga, gb = gpow(gen, len(xa), q)
        xa, xb = np.concatenate([xa, (xa * ga - xb * gb) % q]), np.concatenate([xb, (xa * gb + xb * ga) % q])
    xa = xa[:N - 1]
    k = (np.arange(N - 1, dtype=np.int64) * j) % 4
    ph = np.exp(-2j * np.pi * ((2 * xa) % q) / q)
    return complex((np.array([1, 1j, -1, -1j])[k] * ph).sum() / q)

def gauss_task(P): return gauss_split(P) if P[0] == 0 else gauss_inert(P)
def val(P): return (P[2], P[3]) if P[0] == 0 else (-P[1], 0)
def pnorm(P): return P[1] if P[0] == 0 else P[1] * P[1]

def build_primes(X):
    out = []
    for p in primes_upto(X):
        if p % 4 == 1:
            c, d = two_squares(p)
            for dd in (d, -d):
                cc = c if (c + dd) % 4 == 1 else -c
                out.append((0, p, cc, dd, (-cc * pow(dd, -1, p)) % p))
        elif p % 4 == 3 and p * p <= X:
            out.append((1, p, 0, 0, 0))
    out.sort(key=pnorm)
    return out

RE = IM = None
def row_task(P):
    """exponents of chi_pi(m) for all rows m (ZERO where pi | m), int8."""
    kind, p, c, d, r = P
    if kind == 0:
        t = (RE + IM * r) % p
        e = (p - 1) // 4; res = np.ones_like(t); base = t.copy()
        while e:
            if e & 1: res = res * base % p
            base = base * base % p; e >>= 1
        out = np.full(len(t), 3, dtype=np.int8)
        out[res == 1] = 0; out[res == r] = 1; out[res == p - 1] = 2; out[t == 0] = ZERO
        return out
    out = np.empty(len(RE), dtype=np.int8)
    for k in range(len(RE)):
        s = sym(P, (int(RE[k]), int(IM[k]))); out[k] = ZERO if s is None else s
    return out

def enumerate_sf(primes, gam, X):
    """all squarefree primary products with norm <= X: norms, gamma_1, mu, factor lists, value."""
    norms = []; G = []; MU = []; FAC = []; VAL = []
    i4 = [1, 1j, -1, -1j]
    stack = [(-1, (1, 0), 1, 1 + 0j, 1, ())]
    while stack:
        last, z, N, g, mu, fac = stack.pop()
        norms.append(N); G.append(g); MU.append(mu); FAC.append(fac); VAL.append(z)
        for idx in range(last + 1, len(primes)):
            P = primes[idx]; pn = pnorm(P)
            if N * pn > X: break
            zp = val(P)
            j1 = sym(P, z); j2 = 0
            for f in fac: j2 += sym(primes[f], zp)
            nz = (z[0] * zp[0] - z[1] * zp[1], z[0] * zp[1] + z[1] * zp[0])
            stack.append((idx, nz, N * pn, g * gam[idx] * i4[(j1 + j2) % 4], -mu, fac + (idx,)))
    return np.array(norms, dtype=np.float64), np.array(G), np.array(MU, dtype=np.float64), FAC, VAL

TAB = None; FACS = None; COEF = None
def chunk_task(rng):
    lo, hi = rng
    nrow = TAB.shape[1]
    E = np.zeros((hi - lo, nrow), dtype=np.int8)
    for k in range(lo, hi):
        e = E[k - lo]
        for f in FACS[k]: e += TAB[f]
    E = np.where(E >= ZERO, 4, E & 3)
    M = I4[E]                                      # chi_a(m), complex64, (chunk, nrow)
    c1, c2 = COEF                                  # each (nvar, nZ, ncol)
    r1 = np.tensordot(c1[:, :, lo:hi], M, axes=([2], [0]))            # variants with chi_a(m)
    r2 = np.tensordot(c2[:, :, lo:hi], np.conj(M), axes=([2], [0]))   # variants with conj chi_a(m)
    return r1, r2

def main():
    global RE, IM, TAB, FACS, COEF
    import multiprocessing as mp
    t0 = time.time()
    primes = build_primes(XMAX)
    cache = 'gauss_%d.npy' % XMAX
    if os.path.exists(cache): gam = np.load(cache)
    else:
        if NPROC > 1:
            with mp.Pool(NPROC) as pool: gam = np.array(pool.map(gauss_task, primes[::-1], chunksize=8)[::-1])
        else: gam = np.array([gauss_task(P) for P in primes])
        np.save(cache, gam)
    print('primes with norm <= %d: %d; max||gamma_1|-1| = %.2e  (%.0fs)' % (XMAX, len(primes), np.abs(np.abs(gam) - 1).max(), time.time() - t0), flush=True)
    norms, G, MU, FAC, VAL = enumerate_sf(primes, gam, XMAX)
    order = np.argsort(norms, kind='stable')
    norms = norms[order]; G = G[order]; MU = MU[order]; FAC = [FAC[i] for i in order]; VAL = [VAL[i] for i in order]
    ncol = len(norms)
    print('columns a (squarefree primary, N <= %d): %d; max||gamma_1(a)|-1| = %.2e  (%.0fs)' % (XMAX, ncol, np.abs(np.abs(G) - 1).max(), time.time() - t0), flush=True)
    nrow = int(np.searchsorted(norms, QMAX, side='right'))
    RE = np.array([VAL[i][0] for i in range(nrow)], dtype=np.int64); IM = np.array([VAL[i][1] for i in range(nrow)], dtype=np.int64)
    rnorm = norms[:nrow]
    print('rows m (N <= %d): %d' % (QMAX, nrow), flush=True)
    if NPROC > 1:
        with mp.Pool(NPROC) as pool: rows = pool.map(row_task, primes, chunksize=64)
    else: rows = [row_task(P) for P in primes]
    TAB = np.array(rows, dtype=np.int8); del rows
    print('symbol table %s (%.0fs)' % (TAB.shape, time.time() - t0), flush=True)
    FACS = FAC
    Zs = [ZMAX / 16, ZMAX / 4, ZMAX]
    rng = np.random.default_rng(12345)
    rnd = np.exp(2j * np.pi * rng.random(ncol))
    W = np.array([(norms / Z) * np.exp(-(norms / Z) ** 2) for Z in Zs])            # (nZ, ncol)
    lam = [sym(P, (1, 1)) for P in primes]                                         # chi_pi(1+i)
    tw = np.conj(np.array([1, 1j, -1, -1j])[np.array([(2 * sum(lam[f] for f in fac)) % 4 for fac in FAC])])   # conj chi_a(lambda^2)
    names1 = ['K3', 'K3t', 'MU', 'L', 'RND']; base1 = [G, tw * G, MU.astype(complex), np.ones(ncol, complex), rnd]
    names2 = ['T', 'K1', 'K1t']; base2 = [MU * G, G, tw * G]
    c1 = np.array([[b * w for w in W] for b in base1]).astype(np.complex64)
    c2 = np.array([[b * w for w in W] for b in base2]).astype(np.complex64)
    COEF = (c1, c2)
    CH = 96
    rngs = [(lo, min(lo + CH, ncol)) for lo in range(0, ncol, CH)]
    B1 = np.zeros((len(names1), len(Zs), nrow), dtype=np.complex128); B2 = np.zeros((len(names2), len(Zs), nrow), dtype=np.complex128)
    if NPROC > 1:
        with mp.Pool(NPROC) as pool:
            for k, (r1, r2) in enumerate(pool.imap_unordered(chunk_task, rngs, chunksize=4)):
                B1 += r1; B2 += r2
                if k % 400 == 0: print('  chunk %d/%d (%.0fs)' % (k, len(rngs), time.time() - t0), flush=True)
    else:
        for k, rg in enumerate(rngs):
            r1, r2 = chunk_task(rg); B1 += r1; B2 += r2
            if k % 100 == 0: print('  chunk %d/%d (%.0fs)' % (k, len(rngs), time.time() - t0), flush=True)
    names = names1 + names2; B = np.concatenate([B1, B2], axis=0)
    den = (W ** 2).sum(axis=1)                                                     # |c_a| = 1 for all variants
    np.savez_compressed(OUT, B=B.astype(np.complex64), rnorm=rnorm, Zs=np.array(Zs), den=den, names=np.array(names))
    print('saved %s (%.0fs)' % (OUT, time.time() - t0))
    edges = [1.5]
    while edges[-1] < QMAX: edges.append(edges[-1] * 2)
    for zi, Z in enumerate(Zs):
        print('\nZ = %.0f (sum w^2 = %.1f).  R = mean_m |B_m|^2 / sum w^2 per dyadic bin of N(m); s.e. = R/sqrt(rows)' % (Z, den[zi]))
        print('  %-22s %6s  ' % ('N(m) bin', 'rows') + ' '.join('%8s' % n for n in names))
        for lo, hi in zip(edges[:-1], edges[1:]):
            sel = (rnorm > lo) & (rnorm <= hi)
            if sel.sum() == 0: continue
            vals = [(np.abs(B[v, zi, sel]) ** 2).mean() / den[zi] for v in range(len(names))]
            print('  (%9.0f,%9.0f] %6d  ' % (lo, hi, sel.sum()) + ' '.join('%8.3f' % x for x in vals))

if __name__ == '__main__':
    main()
