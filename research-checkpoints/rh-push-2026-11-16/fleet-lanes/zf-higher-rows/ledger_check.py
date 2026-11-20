#!/usr/bin/env python3
"""ledger_check.py -- absorption identity for every row order r (numerical check at primes).

For chi of exact order r on F_p^x (p = 1 mod lcm(r,2)), rho the quadratic character, sigma = +-1:
  (A)  mu(pi) g(chi^s) = (-J(chi^s, rho)) * g(chi^s rho) / g(rho)            [mu(pi) = -1]
  (N)  order of chi^s rho  =  nu(r) = r (4|r), r/2 (r = 2 mod 4), 2r (r odd)
  (I)  index: g(psi; h) := sum psi(x) e(hx/p) = conj(psi(h)) g(psi).  With psi = chi^s rho and the
       exponent e(r) = 1 + r/2 (4|r), r + 1 (r odd, in terms of omega with omega^2 = chi), 1 (r = 2 mod 4):
       g(chi^s; h)  =  [rho(h) if r = 2 mod 4]  * (ratio) * g(psi; h^e)
  (W)  Galois weight: the only psi in <chi, rho> with g(psi)/ (mu g(chi^s)) of weight in <rho> are chi^s and chi^s rho.
"""
import cmath, math, sys
from math import gcd

def primes_cong(m, count, start=3):
    out = []; n = start
    while len(out) < count:
        n += 1
        if n % m == 1 and all(n % q for q in range(2, int(n**0.5) + 1)):
            out.append(n)
    return out

def primroot(p):
    fs = set(); m = p - 1; q = 2
    while q * q <= m:
        while m % q == 0: fs.add(q); m //= q
        q += 1
    if m > 1: fs.add(m)
    for g in range(2, p):
        if all(pow(g, (p - 1) // f, p) != 1 for f in fs): return g

def run(r, nprimes=6):
    L = r if r % 2 == 0 else 2 * r
    nu = r if r % 4 == 0 else (r // 2 if r % 2 == 0 else 2 * r)
    worst = 0.0
    for p in primes_cong(L, nprimes, start=max(3, 2*L)):
        g = primroot(p)
        ind = [0] * p; x = 1
        for j in range(p - 1):
            ind[x] = j; x = x * g % p
        zp = [cmath.exp(2j * math.pi * t / p) for t in range(p)]
        # characters as exponent pairs: omega = primitive order-L character, omega(g) = exp(2 pi i / L)
        def ch(t):  # omega^t
            return lambda x: cmath.exp(2j * math.pi * (t * ind[x] % L) / L)
        def gauss(t, h=1):
            f = ch(t); return sum(f(x) * zp[h * x % p] for x in range(1, p))
        def jac(t1, t2):
            f1, f2 = ch(t1), ch(t2); return sum(f1(x) * f2((1 - x) % p) for x in range(2, p))
        tchi = L // r            # chi = omega^(L/r), exact order r
        trho = L // 2            # rho = omega^(L/2)
        for s in (1, -1):
            a = (s * tchi) % L; b = (a + trho) % L
            lhs = -gauss(a)
            J = jac(a, trho)
            rhs = (-J) * gauss(b) / gauss(trho)
            worst = max(worst, abs(lhs - rhs))
            assert abs(abs(J) - math.sqrt(p)) < 1e-7
            order_b = L // gcd(L, b)
            assert order_b == nu, (r, order_b, nu)
            # index lemma
            if r % 4 == 0: e = 1 + r // 2; quad = False
            elif r % 2 == 1: e = r + 1; quad = False
            else: e = 1; quad = True
            for h in (2, 3, 5, 7, 11):
                if h % p == 0: continue
                he = pow(h, e, p)
                ratio = gauss(a, h) / gauss(b, he)
                ratio0 = gauss(a) / gauss(b)
                if quad: ratio0 *= ch(trho)(h % p)
                worst = max(worst, abs(ratio - ratio0))
            # weight uniqueness: psi = omega^t has g(psi)/g(chi^s) Galois weight omega^(a - t); in <rho> iff t in {a, a + L/2}
            sols = [t for t in range(1, L) if (a - t) % (L // 2) == 0]
            assert sorted(sols) == sorted({a % L, b % L} - {0}), (r, sols)
    return nu, worst

if __name__ == '__main__':
    print('r   nu(r)=ord(chi*rho)   max |identity error| (A),(I)')
    for r in (3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24):
        nu, w = run(r, nprimes=4 if r > 12 else 6)
        print('%-3d %-20d %.2e' % (r, nu, w))
    print('ALL CHECKS PASS')
