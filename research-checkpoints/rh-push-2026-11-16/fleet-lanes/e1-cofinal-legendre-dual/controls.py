"""Controls: generalised von Mangoldt point Lambda_a = (a log) * a^{-1} for a coefficient sequence a(n),
its sign pattern (is it in the cone b >= 0?), growth of the Dirichlet inverse, and real zeros of DH on (0,1]."""
import math, json
import mpmath as mp
N = 4000
def dinv(a):
    inv = [0.0] * (N + 1); inv[1] = 1.0 / a[1]
    for n in range(1, N + 1):
        if inv[n] == 0.0: continue
        for m in range(2, N // n + 1):
            pass
    # direct O(N log N) recursion: inv(n) = -sum_{d|n, d<n} a(n/d) inv(d)
    acc = [0.0] * (N + 1)
    inv = [0.0] * (N + 1); inv[1] = 1.0
    for d in range(1, N + 1):
        if d > 1: inv[d] = -acc[d]
        if inv[d] != 0.0:
            for m in range(2, N // d + 1):
                acc[d * m] += a[m] * inv[d]
    return inv
def conv(f, g):
    h = [0.0] * (N + 1)
    for d in range(1, N + 1):
        if f[d] == 0.0: continue
        for m in range(1, N // d + 1):
            h[d * m] += f[d] * g[m]
    return h
def is_pp(n):
    for p in range(2, n + 1):
        if n % p == 0:
            while n % p == 0: n //= p
            return n == 1
    return False
def report(name, a):
    inv = dinv(a)
    lam = conv([0.0] + [a[n] * math.log(n) for n in range(1, N + 1)], inv)
    neg = [(n, round(lam[n], 4)) for n in range(2, 61) if lam[n] < -1e-9]
    offpp = [(n, round(lam[n], 4)) for n in range(2, 61) if abs(lam[n]) > 1e-9 and not is_pp(n)]
    negmass = sum(-min(l, 0) for l in lam[1:]); posmass = sum(max(l, 0) for l in lam[1:])
    Ainv = [sum(abs(v) for v in inv[1:X + 1]) for X in (500, 1000, 2000, 4000)]
    print(json.dumps(dict(name=name, first_negative=neg[:8], n_negative_le_60=len(neg), first_off_prime_power=offpp[:6],
          neg_mass_le_N=negmass, pos_mass_le_N=posmass, sum_abs_inverse_at_500_1000_2000_4000=Ainv,
          growth_exponent_abs_inverse=math.log(Ainv[3] / Ainv[1]) / math.log(4))), flush=True)
xi = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
per = [0, 1, xi, -xi, -1]
report("zeta", [0.0] + [1.0] * N)
report("Davenport-Heilbronn", [0.0] + [per[n % 5] for n in range(1, N + 1)])
lio = [0.0] * (N + 1)
for n in range(1, N + 1):
    m, c, p = n, 0, 2
    while p * p <= m:
        while m % p == 0: m //= p; c += 1
        p += 1
    if m > 1: c += 1
    lio[n] = (-1.0) ** c
report("sign twist (Liouville): zeta(2s)/zeta(s)", lio)
aa = 0.2
report("E_a, a=0.2: zeta(s+a)zeta(s-a)", [0.0] + [sum((d / (n / d)) ** aa for d in range(1, n + 1) if n % d == 0) for n in range(1, N + 1)])
r3 = [0] * (N + 1)
R = int(math.isqrt(N))
sq = [0] * (N + 1)
for i in range(-R, R + 1): sq[i * i] += 1
r2 = [0] * (N + 1)
for i in range(N + 1):
    if sq[i]:
        for j in range(N + 1 - i):
            if sq[j]: r2[i + j] += sq[i] * sq[j]
for i in range(N + 1):
    if sq[i]:
        for j in range(N + 1 - i): r3[i + j] += sq[i] * r2[j]
report("theta^3: r_3(n)/6", [0.0] + [r3[n] / 6.0 for n in range(1, N + 1)])
mp.mp.dps = 25
f = lambda s: 5 ** (-s) * (mp.zeta(s, mp.mpf(1) / 5) + xi * mp.zeta(s, mp.mpf(2) / 5) - xi * mp.zeta(s, mp.mpf(3) / 5) - mp.zeta(s, mp.mpf(4) / 5))
vals = [(float(s), float(f(mp.mpf(s)))) for s in [0.02 * i for i in range(1, 101)]]
sc = [(vals[i][0], vals[i + 1][0]) for i in range(len(vals) - 1) if vals[i][1] * vals[i + 1][1] < 0]
print("DH f on (0,2]: min", min(v for _, v in vals), "max", max(v for _, v in vals), "sign changes", sc, "f(0.02)", vals[0][1], "f(1)", float(f(1)))
