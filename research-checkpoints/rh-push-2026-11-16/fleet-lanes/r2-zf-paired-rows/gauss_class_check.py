#!/usr/bin/env python3
"""gauss_class_check.py -- Theorem D and Lemma F at primes p = 1 mod 12 (prime residue fields F_p)."""
import cmath, math
def setup(p, r):
    fs = [q for q in range(2, p) if (p - 1) % q == 0 and all(q % d for d in range(2, int(q ** .5) + 1))]
    g = next(g for g in range(2, p) if all(pow(g, (p - 1) // f, p) != 1 for f in fs))
    dl = {pow(g, k, p): k for k in range(p - 1)}
    chi = lambda x, e=1: cmath.exp(2j * math.pi * ((e * dl[x % p]) % r) / r) if x % p else 0
    return chi
def G(chi, e, p, h=1):
    return sum(chi(x, e) * cmath.exp(2j * math.pi * h * x / p) for x in range(1, p))
def J(chi, e1, e2, p):
    return sum(chi(x, e1) * chi((1 - x) % p, e2) for x in range(2, p))
worst = [0.0] * 5
for p in (13, 37, 61, 73, 97, 109, 157, 181, 193):
    r = 12; chi = setup(p, r); rho = 6
    # (i) conjugate pair: g(psi; k1) conj-partner g(psi-bar; k2) = psi(-1) p * chi(k2/k1)^e
    for e in (1, 3, 5):
        for k1, k2 in ((1, 1), (2, 5), (3, 7)):
            lhs = G(chi, e, p, k1) * G(chi, -e, p, k2)
            rhs = chi(-1, e) * p * chi(k2, e) * chi(pow(k1, -1, p), e)
            worst[0] = max(worst[0], abs(lhs - rhs))
    # (ii) g(chi^3) g(chi^-1) = J(chi^3, chi^-1) g(chi^2)
    worst[1] = max(worst[1], abs(G(chi, 3, p) * G(chi, -1, p) - J(chi, 3, -1, p) * G(chi, 2, p)))
    # (iii) mu * (Gauss product) = Hecke * cubic Gauss sum: -g(chi^2) = -J(chi^2, rho) g(chi^8)/g(rho), chi^8 of order 3
    worst[2] = max(worst[2], abs(-G(chi, 2, p) - (-J(chi, 2, rho, p)) * G(chi, 8, p) / G(chi, rho, p)))
    # (iv) index: g(chi^3; k1) g(chi^-1; k2) = chi(k2 k1^-3) g(chi^3) g(chi^-1)
    for k1, k2 in ((2, 3), (5, 7), (4, 11)):
        lhs = G(chi, 3, p, k1) * G(chi, -1, p, k2)
        rhs = chi(k2) * chi(pow(k1, -3, p)) * G(chi, 3, p) * G(chi, -1, p)
        worst[3] = max(worst[3], abs(lhs - rhs))
    # Lemma F for r in {3,4,5,6,8,10,12} when r | p-1
    for rr in (3, 4, 6, 12):
        ch = setup(p, 2 * rr if rr % 2 else rr)          # character group containing chi (order rr) and rho
        R = 2 * rr if rr % 2 else rr; e = R // rr; rh = R // 2
        for h in (2, 3, 5):
            lhs = G(ch, e, p, h); rhs = G(ch, e, p) / G(ch, e + rh, p) * ch(h, rh) * G(ch, e + rh, p, h)
            worst[4] = max(worst[4], abs(lhs - rhs))
print('max errors over p in {13,...,193}:')
for name, w in zip(('D(i) conjugate pair g g-bar = psi(-1) p chi(k2/k1)^e', 'D(ii) g(chi^3) g(chi^-1) = J g(chi^2), order 12',
                    'D(iii) -g(chi^2) = -J(chi^2,rho) g(chi^8)/g(rho) (cubic class)', 'D index chi(k2 k1^-3)', 'Lemma F twisted form'), worst):
    print('  %-62s %.2e' % (name, w))
