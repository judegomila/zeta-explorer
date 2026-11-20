#!/usr/bin/env python3
"""Second implementation (mpmath, pure python primality; no code shared with common.py / arb_census.py).
 1. beta = 1, phases +: direct product at delta = 2^-10 and 2^-12 against the eta-route values of out/eta_b1_plus.json.
 2. Theorem R, the bound |Xi(delta + i p_i)| <= C delta^(1-o(1)) on one sample (super-sparse A, hash phases).
 3. Theorem T, Kronecker step on a finite stage: min and max over a height scan of |prod_{k<=K}| against
    prod (1 -+ e^{-lambda delta}).
 4. CYC identity (1-w) prod (1+w^(2^k)) = 1.
"""
import json, math, random
from mpmath import mp, mpf, mpc, exp, log, pi, floor, sqrt, fabs
mp.dps = 60

def is_prime(n):
    if n < 2: return False
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53):
        if n % p == 0: return n == p
    d = n - 1; s = 0
    while d % 2 == 0: d //= 2; s += 1
    for a in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71):
        x = pow(a, d, n)
        if x in (1, n - 1): continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1: break
        else: return False
    return True

def nearest_prime(x):
    n = int(floor(x)); up = n + 1
    while not is_prime(up): up += 1
    dn = n
    while dn >= 2 and not is_prime(dn): dn -= 1
    if dn < 2: return up
    return dn if x - dn < up - x else up

print('== 1. direct product against the eta route (beta = 1, phases +)')
mp.dps = 80
qs = [nearest_prime(exp(mpf(k))) for k in range(1, 121)]
lam = [log(mpf(q)) for q in qs]
d = json.load(open('out/eta_b1_plus.json'))
for hi in (0, 12, 25, 28, 39, 50, 77):
    h = d['heights'][hi]
    if h[0] == 'pole': t = 2 * pi * h[2] / log(mpf(qs[h[1]]))
    elif h[0] == 'rat': t = 2 * pi * h[1] / h[2]
    else: t = mpf(h[1])
    for j in (10, 12):
        dl = mpf(2) ** -j; z = mpc(dl, t); K = int(60 * 2 ** j); y = mpf(0)
        mp.dps = 30
        for k in range(1, K + 1):
            l = lam[k - 1] if k <= 120 else mpf(k)
            y += log(fabs(1 - exp(-l * z)))
        mp.dps = 80
        ref = d['rows'][hi][d['js'].index(j)][0]
        print(h, 'j', j, 'direct %.10f' % y, 'eta route %.10f' % ref, 'diff %.2e' % abs(float(y) - ref))

print('== 2. Theorem R: |Xi(delta + i p_i)| at a zero point of the numerator factor i (mu_i = log prime nearest e^(i^2), i = 1..7)')
mp.dps = 60
mus = [log(mpf(nearest_prime(exp(mpf(i * i))))) for i in range(1, 8)]
rng = random.Random(7)
th = [2 * pi * mpf(rng.random()) for _ in mus]; thp = [2 * pi * mpf(rng.random()) for _ in mus]
for i in (1, 2, 3):
    n = int(floor(mus[i] * 3 / (2 * pi))); p = (th[i] + 2 * pi * n) / mus[i]
    out = []
    for j in (10, 20, 30, 40, 50, 60):
        z = mpc(mpf(2) ** -j, p); v = mpf(0)
        for l in range(len(mus)):
            v += log(fabs(1 - exp(mpc(0, th[l]) - mus[l] * z))) - log(fabs(1 - exp(mpc(0, thp[l]) - mus[l] * z)))
        out.append((j, float(v), float(v) / (-j * math.log(2))))
    print('factor', i + 1, 'p = %.6f' % p, ' (j, log|Xi|, exponent):', ['(%d, %.3f, %.3f)' % o for o in out])

print('== 3. Theorem T, Kronecker step, finite stage K = 4 (primes 3, 7, 19, 53), delta = 0.02, scan y in [1, 20000] step 0.01')
ls = [math.log(q) for q in (3, 7, 19, 53)]; dl = 0.02
lo = 1e9; hi_ = 0.0
import cmath
y = 1.0
while y < 20000:
    v = 1.0
    for l in ls: v *= abs(1 - cmath.exp(-l * complex(dl, y)))
    lo = min(lo, v); hi_ = max(hi_, v); y += 0.01
plo = 1.0; phi = 1.0
for l in ls: plo *= 1 - math.exp(-l * dl); phi *= 1 + math.exp(-l * dl)
print('scan min %.3e  prod(1 - e^-ld) %.3e   scan max %.4f  prod(1 + e^-ld) %.4f' % (lo, plo, hi_, phi))

print('== 4. CYC: (1 - w) prod_{k<70} (1 + w^(2^k)) - 1 at three points')
mp.dps = 60
for z in (mpc('0.001', '1.3'), mpc('1e-20', '5.719'), mpc('1e-12', 2 * pi / log(mpf(3)))):
    w = exp(-log(mpf(3)) * z); pr = 1 - w
    for k in range(70): pr *= 1 + w ** (2 ** k)
    print(complex(z), 'abs((1-w) prod - (1 - w^(2^70))) = %.2e' % abs(pr - 1 + w ** (2 ** 70)))
