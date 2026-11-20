#!/usr/bin/env python3
"""quartic_dual.py -- conductor exponent of the Moebius-twisted quartic Gauss-sum family over Q(i).

For a primary prime h of Z[i] and a scale D, with n over squarefree primary n prime to 2h:

  TEST    S_h(D) = sum_n mu(n) gamma_1(n) conj(chi_n(h))        V(N n / D)   (Poisson dual of the order-4 Moebius family)
  CONTROL C_h(D) = sum_n alpha(n) conj(gamma_1(n)) chi_n(h)     V(N n / D)   (quartic Kubota series, index h, alpha-twist)
  RANDOM  R_h(D) = sum_n eps_n                                   V(N n / D)   (random signs; baseline = 1)

gamma_1(n) = g(chi_n)/sqrt(N n), chi_n = (./n)_4, alpha(n) = n/|n|, V(x) = x exp(-x^2).
F(D) = |S|^2 / sum_n V^2.  If the family has a functional equation of conductor Q0 N(h)^a then F ~ 1 for
D << Q0 N(h)^a and F -> 0 for D >> Q0 N(h)^a.  The collapse exponent in N(h) is the dual exponent a.

usage: quartic_dual.py XMAX [out.npz]
"""
import sys, math, cmath, time
import numpy as np

XMAX = int(float(sys.argv[1])) if len(sys.argv) > 1 else 200000
OUT = sys.argv[2] if len(sys.argv) > 2 else 'quartic_dual.npz'
HMAX = int(sys.argv[3]) if len(sys.argv) > 3 else 61
I4 = [1, 1j, -1, -1j]

def primes_upto(n):
    s = bytearray([1]) * (n + 1); s[0:2] = b'\0\0'
    for i in range(2, int(n ** .5) + 1):
        if s[i]: s[i * i::i] = bytearray(len(s[i * i::i]))
    return [i for i in range(n + 1) if s[i]]

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
    # p = c^2 + d^2, c odd, d even
    x = next(pow(a, (p - 1) // 4, p) for a in range(2, p) if pow(a, (p - 1) // 2, p) == p - 1)
    a, b = p, x
    while b * b > p: a, b = b, a % b
    c, d = b, int(round(math.sqrt(p - b * b)))
    if c % 2 == 0: c, d = d, c
    return c, d

def gmul(x, y, q):
    return ((x[0] * y[0] - x[1] * y[1]) % q, (x[0] * y[1] + x[1] * y[0]) % q)

def gpow(x, e, q):
    r = (1, 0)
    while e:
        if e & 1: r = gmul(r, x, q)
        x = gmul(x, x, q); e >>= 1
    return r

class Prime:
    __slots__ = ('kind', 'p', 'c', 'd', 'r', 'norm', 'gamma', 'rj')
    def sym(self, z):
        """exponent j with (z/pi)_4 = i^j, or None if pi | z."""
        a, b = z
        if self.kind == 0:
            p = self.p; t = (a + b * self.r) % p
            if t == 0: return None
            return self.rj[pow(t, (p - 1) // 4, p)]
        q = self.p
        if a % q == 0 and b % q == 0: return None
        v = gpow((a % q, b % q), (q * q - 1) // 4, q)
        return {(1, 0): 0, (0, 1): 1, (q - 1, 0): 2, (0, q - 1): 3}[v]

def make_split(p, c, d):
    P = Prime(); P.kind = 0; P.p = p; P.c = c; P.d = d; P.norm = p
    P.r = (-c * pow(d, -1, p)) % p            # i -> r in Z[i]/pi = F_p
    P.rj = {1: 0, P.r: 1, p - 1: 2, (p - P.r) % p: 3}
    return P

def gauss_split(P):
    p = P.p; fs = prime_factors(p - 1)
    g0 = next(g for g in range(2, p) if all(pow(g, (p - 1) // f, p) != 1 for f in fs))
    j = P.sym((g0, 0))
    arr = np.array([1], dtype=np.int64)
    while len(arr) < p - 1:
        arr = np.concatenate([arr, arr * pow(g0, len(arr), p) % p])
    arr = arr[:p - 1]
    k = (np.arange(p - 1, dtype=np.int64) * j) % 4
    ph = np.exp(2j * np.pi * ((2 * P.c * arr) % p) / p)      # e(Tr(x/pi)) = e(2 c x / p)
    g = (np.array(I4)[k] * ph).sum()
    return g / math.sqrt(p)

def gauss_inert(q):
    N = q * q; fs = prime_factors(N - 1)
    P = Prime(); P.kind = 1; P.p = q; P.norm = N
    gen = None
    for a in range(1, q):
        for b in range(1, q):
            if all(gpow((a, b), (N - 1) // f, q) != (1, 0) for f in fs): gen = (a, b); break
        if gen: break
    j = P.sym(gen)
    xa = np.array([1], dtype=np.int64); xb = np.array([0], dtype=np.int64)
    while len(xa) < N - 1:
        ga, gb = gpow(gen, len(xa), q)
        na = (xa * ga - xb * gb) % q; nb = (xa * gb + xb * ga) % q
        xa = np.concatenate([xa, na]); xb = np.concatenate([xb, nb])
    xa = xa[:N - 1]
    k = (np.arange(N - 1, dtype=np.int64) * j) % 4
    ph = np.exp(-2j * np.pi * ((2 * xa) % q) / q)             # e(Tr(x/(-q)))
    P.gamma = complex((np.array(I4)[k] * ph).sum() / q)
    return P

def _split_task(t):
    p, c, d = t
    P = make_split(p, c, d)
    return complex(gauss_split(P))

def build_primes(X):
    import os
    nproc = int(os.environ.get('NPROC', '1'))
    out = []; tasks = []
    for p in primes_upto(X):
        if p % 4 == 1:
            c, d = two_squares(p)
            for dd in (d, -d):
                cc = c if (c + dd) % 4 == 1 else -c     # primary: c odd, d even, c + d = 1 mod 4
                tasks.append((p, cc, dd))
        elif p % 4 == 3 and p * p <= X:
            out.append(gauss_inert(p))
    cache = 'primes_%d.npy' % X
    if os.path.exists(cache):
        gs = list(np.load(cache))
    elif nproc > 1:
        import multiprocessing as mp
        with mp.Pool(nproc) as pool:
            gs = pool.map(_split_task, tasks[::-1], chunksize=16)[::-1]
    else:
        gs = [_split_task(t) for t in tasks]
    np.save(cache, np.array(gs))
    for t, g in zip(tasks, gs):
        P = make_split(*t); P.gamma = g; out.append(P)
    out.sort(key=lambda P: P.norm)
    return out

def val(P):
    return (P.c, P.d) if P.kind == 0 else (-P.p, 0)

def direct_gauss(z, plist):
    """direct normalised Gauss sum of chi_n for n = z = product of the primes in plist."""
    a, b = z; N = a * a + b * b; s = 0
    for u in range(N):
        for v in range(N):
            e = 0; ok = True
            for P in plist:
                j = P.sym((u, v))
                if j is None: ok = False; break
                e += j
            if ok: s += I4[e % 4] * cmath.exp(2j * math.pi * (2 * (u * a + v * b) % N) / N)
    return s / N / math.sqrt(N)

def main():
    t0 = time.time()
    primes = build_primes(XMAX)
    print('primes with norm <= %d: %d  (%.1fs)' % (XMAX, len(primes), time.time() - t0), flush=True)
    print('max ||gamma_1(pi)| - 1| =', max(abs(abs(P.gamma) - 1) for P in primes))
    # Lemma Q2(b): gamma_1(pi)^2 = mu(pi) chi_pi(-1) alpha(pi) gamma_2(pi); gamma_2 = (-1)^(d/2) split, 1 inert
    err = 0
    for P in primes:
        a, b = val(P); al = complex(a, b) / math.sqrt(P.norm)
        g2 = (-1) ** ((abs(b) // 2) % 2) if P.kind == 0 else 1
        err = max(err, abs(P.gamma ** 2 - (-1) * I4[P.sym((-1, 0))] * al * g2))
    print('Lemma Q2(b) max error over all primes:', err)
    small = [P for P in primes if P.norm <= 30]
    worst = 0
    for i in range(len(small)):
        for j in range(i + 1, len(small)):
            P, Q = small[i], small[j]
            if P.norm * Q.norm > 500: continue
            if P.kind == 0 and Q.kind == 0 and P.p == Q.p: continue
            zp, zq = val(P), val(Q); z = (zp[0] * zq[0] - zp[1] * zq[1], zp[0] * zq[1] + zp[1] * zq[0])
            pred = P.gamma * Q.gamma * I4[(P.sym(zq) + Q.sym(zp)) % 4]
            worst = max(worst, abs(pred - direct_gauss(z, [P, Q])))
    print('twisted multiplicativity gamma(ab) = gamma(a)gamma(b)chi_a(b)chi_b(a): max error', worst, flush=True)

    hs = [P for P in primes if P.norm <= HMAX]          # rows h: primary primes of small norm
    hz = [val(P) for P in hs]; nh = len(hs)
    E = [[P.sym(z) for z in hz] for P in primes]      # chi_pi(h) exponents (None if pi | h)
    norms = []; gam = []; mus = []; als = []; exps = []
    # DFS over squarefree products with increasing prime index
    stack = [(-1, (1, 0), 1, 1 + 0j, 1, [0] * nh, [])]
    while stack:
        last, z, N, g, mu, ex, fac = stack.pop()
        norms.append(N); gam.append(g); mus.append(mu); als.append(complex(z[0], z[1]) / math.sqrt(N)); exps.append(ex)
        for idx in range(last + 1, len(primes)):
            P = primes[idx]
            if N * P.norm > XMAX: break
            zp = val(P)
            if P.kind == 0 and fac and any(primes[f].kind == 0 and primes[f].p == P.p for f in fac):
                pass                                      # pi * conj(pi) allowed: distinct prime ideals
            j1 = P.sym(z)                                 # chi_pi(m)
            j2 = 0
            for f in fac: j2 += primes[f].sym(zp)         # chi_m(pi)
            nz = (z[0] * zp[0] - z[1] * zp[1], z[0] * zp[1] + z[1] * zp[0])
            Ei = E[idx]
            nex = [(-1 if (e < 0 or Ei[k] is None) else (e + Ei[k]) % 4) for k, e in enumerate(ex)]
            stack.append((idx, nz, N * P.norm, g * P.gamma * I4[(j1 + j2) % 4], -mu, nex, fac + [idx]))
    norms = np.array(norms, dtype=np.float64); gam = np.array(gam); mus = np.array(mus); als = np.array(als)
    exps = np.array(exps, dtype=np.int8)
    print('squarefree primary n with N(n) <= %d: %d  max||gamma|-1| = %.2e  (%.1fs)'
          % (XMAX, len(norms), np.abs(np.abs(gam) - 1).max(), time.time() - t0), flush=True)
    np.savez_compressed(OUT, norms=norms, gam=gam, mus=mus, als=als, exps=exps,
                        hnorm=np.array([P.norm for P in hs]), hre=np.array([z[0] for z in hz]), him=np.array([z[1] for z in hz]))
    print('saved', OUT)

if __name__ == '__main__':
    main()
