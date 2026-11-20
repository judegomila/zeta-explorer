# Part F: Davenport-Heilbronn twisted bilinear pair; reality after Hardy rotation by modulus class.
# Planned allocations: lists of < 1e3 mpf. Run through scripts/memcap.sh 8.
from mpmath import mp, mpf, mpc, zeta, gamma, pi, exp, sqrt, fabs, re, im, nstr
mp.dps = 20
I = mpc(0, 1)
def e(x): return exp(2 * pi * I * x)
def primroot(q):
    for g in range(2, q):
        seen, x = set(), 1
        for _ in range(q - 1):
            x = x * g % q; seen.add(x)
        if len(seen) == q - 1: return g
def chars(q):
    g = primroot(q); ind = {}; x = 1
    for m in range(q - 1):
        ind[x] = m; x = x * g % q
    return [{r: e(mpf(k * ind[r]) / (q - 1)) for r in range(1, q)} for k in range(q - 1)]
C5 = chars(5); chi5 = [c for c in C5 if abs(c[2] - I) < 1e-10][0]; chi5b = {r: chi5[r].conjugate() for r in chi5}
kap = (sqrt(10 - 2 * sqrt(5)) - 2) / (sqrt(5) - 1)
def Lprod(s, c5, psi, q):
    N = 5 * q; tot = mpc(0)
    for r in range(1, N):
        if r % 5 and r % q:
            tot += c5[r % 5] * psi[r % q] * zeta(s, mpf(r) / N)
    return mpf(N) ** (-s) * tot
def F(s, psi, q):
    return (1 - I * kap) / 2 * Lprod(s, chi5, psi, q) + (1 + I * kap) / 2 * Lprod(s, chi5b, psi, q)
print("== F. DH twisted by psi mod q: rotated pair F(s,psi)F(s,psibar) (5q/pi)^s Gamma((s+k)/2)^2/|.|, s = 1/2+it")
for q in [11, 19, 7, 13]:
    CH = chars(q); n = q - 1; worst = mpf(0); signs = set()
    for t in [mpf("1.3"), mpf("4.1"), mpf("9.7"), mpf("16.2")]:
        s = mpc(0.5, t)
        for k in [1, 2, 3]:
            psi = CH[k]; psib = CH[n - k]
            par_psi = 0 if abs(psi[q - 1] - 1) < 1e-10 else 1
            kp = (1 + par_psi) % 2          # chi5 is odd
            v = F(s, psi, q) * F(s, psib, q) * (mpf(5 * q) / pi) ** (I * t) * gamma((s + kp) / 2) ** 2 / fabs(gamma((s + kp) / 2)) ** 2
            worst = max(worst, fabs(im(v)) / fabs(v)); signs.add(1 if re(v) > 0 else -1)
    print(f"   q={q} (q mod 5 = {q%5}): max |Im|/|value| over 4 heights x 3 characters = {nstr(worst,3)}; signs of real part seen: {sorted(signs)}")
