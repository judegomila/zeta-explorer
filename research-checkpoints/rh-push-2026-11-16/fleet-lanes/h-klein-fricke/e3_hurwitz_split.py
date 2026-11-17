"""E3: Hurwitz-Kronecker. T_n . Diagonal on X(1) x X(1) = sum_{t^2<4n} H(4n-t^2) (n non-square) = 2 sum_{d|n, d>sqrt n} d.
Split of the intersection points (CM points) into real points of X(1) (j real <=> ambiguous class) and conjugate pairs."""
from math import isqrt, gcd
def forms(D):  # D>0: reduced positive forms of discriminant -D, all contents
    out = []
    a = 1
    while 3 * a * a <= D:
        for b in range(-a + 1, a + 1):
            if (b * b + D) % (4 * a) == 0:
                c = (b * b + D) // (4 * a)
                if c > a or (c == a and b >= 0):
                    out.append((a, b, c))
        a += 1
    return out
def wt(f):
    a, b, c = f
    g = gcd(a, gcd(b, c)); a, b, c = a // g, b // g, c // g
    if (a, b, c) == (1, 0, 1): return 0.5
    if (a, b, c) == (1, 1, 1): return 1 / 3
    return 1.0
def real(f):
    a, b, c = f
    return b == 0 or a == b or a == c
print("n   sum H(4n-t^2)   2*sum_{d|n,d>sqrt n} d   real-points(weighted)   in conjugate pairs   real fraction")
for n in (2, 3, 5, 7, 11, 13, 101, 1009, 10007, 100003):
    tot = re = 0.0
    for t in range(-isqrt(4 * n), isqrt(4 * n) + 1):
        D = 4 * n - t * t
        if D <= 0: continue
        for f in forms(D):
            tot += wt(f)
            if real(f): re += wt(f)
    rhs = 2 * sum(d for d in range(1, n + 1) if n % d == 0 and d * d > n)
    print(n, round(tot, 6), rhs, round(re, 4), round(tot - re, 4), round(re / tot, 5))
