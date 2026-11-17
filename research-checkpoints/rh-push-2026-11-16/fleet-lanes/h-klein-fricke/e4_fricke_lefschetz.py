"""E4: Lefschetz for the Fricke involution w_p on X_0(p).  #Fix(w_p) = h(-4p) + [p=3 mod 4] h(-p).
Tr(w_p | S_2(p)) = 1 - #Fix/2.  Independent count: w_p = -Frobenius on the supersingular module, so
Tr(w_p | S_2(p)) = 1 - #{supersingular j in F_p}.  Number of weight-2 forms with root number -1
(odd order of vanishing at the centre) = dim S_2^{w=+1} = genus of X_0(p)/w_p = (g + 1 - #Fix/2)/2."""
from math import gcd
def h(D):  # class number of primitive forms, discriminant -D
    n = 0; a = 1
    while 3 * a * a <= D:
        for b in range(-a + 1, a + 1):
            if (b * b + D) % (4 * a) == 0:
                c = (b * b + D) // (4 * a)
                if (c > a or (c == a and b >= 0)) and gcd(a, gcd(b, c)) == 1: n += 1
        a += 1
    return n
def genus(p):
    r = p % 12
    return (p + 1) // 12 - (1 if r == 1 else 0) + (1 if r == 11 else 0) if r in (1, 11) else (p + 1) // 12 if True else 0
def genus(p):
    r = p % 12
    return {1: (p - 13) // 12, 5: (p - 5) // 12, 7: (p - 7) // 12, 11: (p + 1) // 12}[r]
def ss_count(p):
    qr = [0] * p
    for x in range(1, p): qr[x * x % p] = 1
    leg = [0] + [1 if qr[x] else -1 for x in range(1, p)]
    cnt = 0
    for j in range(p):
        if j == 0: a, b = 0, 1
        elif j == 1728 % p: a, b = 1, 0
        else:
            k = j * pow((1728 - j) % p, p - 2, p) % p
            a, b = 3 * k % p, 2 * k % p
        s = 0
        for x in range(p): s += leg[(x * x * x + a * x + b) % p]
        if s == 0: cnt += 1
    return cnt
print("p  g  h(-4p) h(-p)  #Fix(w_p)  #ss j in F_p  [check 2*ss = Fix]  Tr(w_p|S_2)  #forms eps=-1 = g(X_0^+(p))")
for p in (11, 23, 37, 43, 53, 61, 67, 73, 89, 101, 163, 389, 997):
    F = h(4 * p) + (h(p) if p % 4 == 3 else 0)
    ss = ss_count(p); g = genus(p)
    print(p, g, h(4 * p), h(p) if p % 4 == 3 else "-", F, ss, 2 * ss == F, 1 - F // 2, (g + 1 - F // 2) // 2)
