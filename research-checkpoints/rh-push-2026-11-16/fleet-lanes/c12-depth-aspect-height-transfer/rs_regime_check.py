"""Lemma X with r = 5 in the Riemann-Siegel regime: q = p^k, t = 2 pi q (so sqrt(t/2pi) = sqrt(q)).
Exhibits m with all ten integers m + a_i H, m + b_i H <= sqrt(q), the two products congruent mod q (exact),
and the archimedean phase t*D(H/m) at distance >= 1 from 2 pi Z."""
import math
a = [1, 2, 10, 14, 18]; b = [0, 4, 8, 16, 17]; r = 5
kap = abs(sum(x**r for x in a) - sum(x**r for x in b))/r
print("kappa =", kap)
for p, k in ((3, 20), (3, 30), (5, 20), (2, 50), (7, 15)):
    q = p**k; H = p**(-(-k//r)); t = 2*math.pi*q; N = math.isqrt(q)
    x0 = (1.12/(kap*t))**(1/r); xu = (4.5/(kap*t))**(1/r)
    m = int(H/xu) + 1
    while m % p == 0: m += 1
    A = 1; B = 1
    for x in a: A *= m + x*H
    for x in b: B *= m + x*H
    D = sum(math.log1p(x*H/m) for x in a) - sum(math.log1p(x*H/m) for x in b)
    G = t*D; d = abs((G + math.pi) % (2*math.pi) - math.pi)
    print(f"p={p} k={k} q~{q:.3e} H={H} m={m} top={m+18*H} sqrt(q)={N} top<=sqrt(q): {m+18*H <= N}  "
          f"m<=H/x0: {m <= H/x0}  (A-B)%q={ (A-B) % q}  x=H/m={H/m:.4f}  tD={G:.4f}  dist to 2piZ={d:.4f}")
