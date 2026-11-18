# Jacobi-sum cocycle of the Gauss sum: order 3 (weight 1, -J is a Hecke character value) vs order 2 (weight 0).
import cmath, math
def primroot(p):
    f = set(); m = p-1; q = 2
    while q*q <= m:
        if m % q == 0:
            f.add(q)
            while m % q == 0: m //= q
        q += 1
    if m > 1: f.add(m)
    g = 2
    while any(pow(g, (p-1)//q, p) == 1 for q in f): g += 1
    return g
for p in (7, 13, 19, 31, 37, 43, 61, 67, 73, 79, 97, 103, 109, 127, 997):
    g = primroot(p); ind = [0]*p; x = 1
    for i in range(p-1): ind[x] = i; x = x*g % p
    # J3 = sum chi(x)chi(1-x) = a + b*omega, exact integer count
    cnt = [0, 0, 0]
    for x in range(2, p): cnt[(ind[x] + ind[(1-x) % p]) % 3] += 1
    a = cnt[0] - cnt[2]; b = cnt[1] - cnt[2]            # omega^2 = -1 - omega
    J2 = sum((1 if ind[x] % 2 == 0 else -1)*(1 if ind[(1-x) % p] % 2 == 0 else -1) for x in range(2, p))
    print('p=%4d  J(chi3,chi3)=%d%+d*omega  norm=%d  (a mod 3, b mod 3)=(%d,%d)  -J = 1 mod 3: %s |  J(chi2,chi2)=%d  -chi2(-1)=%d' % (
        p, a, b, a*a-a*b+b*b, a % 3, b % 3, (a % 3 == 2 and b % 3 == 0), J2, -(1 if ((p-1)//2) % 2 == 0 else -1)))
