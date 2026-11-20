"""Checks for the no-exchange lemma (pure python, exact integers + float phases).
(1) PTE congruence: prod(m + a_i H) == prod(m + b_i H) mod H^r, exact, for r = 2,3,4,5.
(2) Lemma X numerically: for q = p^k, find the best character chi mod q approximating n^{-it}
    on primes l <= N (l != p):  E(N) = min_a max_l |chi_a(l) - l^{-it}|.  (Closeness on primes is
    necessary for closeness on all n <= N.)
(3) The forced phase: for m in the window of Lemma X (r=2), |exp(iG(m)) - 1| with
    G(m) = -t log(1 - H^2/m^2); a character within eps on [1,N] forces this <= 4 eps.
"""
import math, cmath, sys
PTE = {2: ([1, -1], [0, 0]),
       3: ([1, 2, 6], [0, 4, 5]),
       4: ([0, 4, 7, 11], [1, 2, 9, 10]),
       5: ([1, 2, 10, 14, 18], [0, 4, 8, 16, 17])}
def check_pte():
    for r, (a, b) in PTE.items():
        for j in range(1, r):
            assert sum(x**j for x in a) == sum(x**j for x in b), (r, j)
        assert sum(x**r for x in a) != sum(x**r for x in b)
        bad = 0
        for p, e in ((3, 4), (5, 3), (2, 7)):
            H = p**e
            for m in range(20*H + 1, 20*H + 400):
                A = 1; B = 1
                for x in a: A *= m + x*H
                for x in b: B *= m + x*H
                if (A - B) % H**r: bad += 1
                # for ideal solutions the difference is constant in m
        print(f"PTE r={r}: power sums equal to degree {r-1}, congruence mod H^r failures: {bad}")
def primes_upto(n):
    s = bytearray([1])*(n+1); s[0:2] = b"\0\0"
    for i in range(2, int(n**.5)+1):
        if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
    return [i for i in range(n+1) if s[i]]
def primitive_root(p, k):
    q = p**k; phi = q - q//p
    fac = set(); x = phi; d = 2
    while d*d <= x:
        while x % d == 0: fac.add(d); x //= d
        d += 1
    if x > 1: fac.add(x)
    g = 2
    while True:
        if math.gcd(g, p) == 1 and all(pow(g, phi//f, q) != 1 for f in fac): return g
        g += 1
def best_char(p, k, t, Ns):
    q = p**k; phi = q - q//p; g = primitive_root(p, k)
    ind = {}; x = 1
    for e in range(phi):
        ind[x] = e; x = x*g % q
    out = []
    for N in Ns:
        ls = [l for l in primes_upto(N) if l != p]
        idx = [ind[l % q] for l in ls]
        tgt = [(-t*math.log(l)/(2*math.pi)) % 1.0 for l in ls]
        best = 9.0; besta = None
        for a in range(phi):
            worst = 0.0
            for i, th in zip(idx, tgt):
                d = (a*i % phi)/phi - th
                d -= round(d); d = abs(d)
                if d > worst:
                    worst = d
                    if worst >= best: break
            if worst < best: best = worst; besta = a
        out.append((N, len(ls), 2*math.sin(math.pi*best), besta))
    return q, out
def forced_phase(p, k, t):
    r = (k+1)//2; H = p**r
    lo = H*math.sqrt(t)/2.1; hi = H*math.sqrt(t)
    m = int(lo) + 1
    while m % p == 0: m += 1
    G = -t*math.log(1 - (H/m)**2)
    return H, m, m + H, G, abs(cmath.exp(1j*G) - 1)
if __name__ == "__main__":
    check_pte()
    for (p, k, t) in ((3, 8, 100.0), (3, 10, 100.0), (3, 10, 1000.0), (5, 6, 100.0), (7, 5, 100.0), (3, 11, 777.7)):
        q, out = best_char(p, k, t, [5, 7, 11, 13, 17, 23, 31, 47, 97])
        print(f"p={p} k={k} q={q} sqrt(q)={q**.5:.0f} log(q)={math.log(q):.1f} t={t}")
        for N, npr, E, a in out:
            print(f"   N={N:3d} primes={npr:2d}  E(N)=min_a max_l |chi_a(l) - l^-it| = {E:.4f}  (a={a})")
        H, m, top, G, dev = forced_phase(p, k, t)
        print(f"   Lemma X r=2: H={H}, m={m}, needs N >= {top}; G(m)={G:.4f}, |e^(iG)-1|={dev:.4f} (must be <= 4 eps)")
