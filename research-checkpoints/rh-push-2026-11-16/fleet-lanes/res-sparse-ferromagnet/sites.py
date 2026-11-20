"""Single-site and kernel-side stage checks (mpmath, 30 digits, scalars only: < 100 MB)."""
import mpmath as mp
mp.mp.dps = 30
gam = lambda s: mp.pi ** (-s / 2) * mp.gamma(s / 2)

print("== 1. additive symmetrisation of the prime site: 1/(1-p^-s) + 1/(1-p^(s-1))")
for p in [2, 3, 5, 101]:
    x = mp.acosh(mp.sqrt(p)) / mp.log(p)
    for k in [0, 3]:
        s = mp.mpf(1) / 2 + x + 2j * mp.pi * k / mp.log(p)
        f = 1 / (1 - p ** (-s)) + 1 / (1 - p ** (s - 1))
        print(f" p={p} k={k} predicted zero s={mp.nstr(s, 12)}  |f|={mp.nstr(abs(f), 3)}  Re s - 1/2 = {mp.nstr(x, 10)}")

print("== 2. multiplicative symmetrisation = Poisson kernel")
for p, t in [(2, 1.7), (7, 13.1)]:
    s = mp.mpf(1) / 2 + 1j * t; th = t * mp.log(p)
    lhs = 1 / ((1 - p ** (-s)) * (1 - p ** (s - 1)))
    rhs = 1 / (1 + mp.mpf(1) / p - 2 * mp.cos(th) / mp.sqrt(p))
    print(f" p={p} t={t}  lhs={mp.nstr(lhs, 15)} rhs={mp.nstr(rhs, 15)}")

print("== 3. tails of the symmetrised one-term kernel phi(u)+phi(-u) against -3 pi e^{-5|u|}")
phi = lambda u: (2 * mp.pi ** 2 * mp.e ** (9 * u) - 3 * mp.pi * mp.e ** (5 * u)) * mp.exp(-mp.pi * mp.e ** (4 * u))
for u in [1, 2, 3, 5]:
    print(f" u={u}  (phi(u)+phi(-u)) / (-3 pi e^(-5u)) = {mp.nstr((phi(u) + phi(-u)) / (-3 * mp.pi * mp.e ** (-5 * u)), 12)}")

print("== 4. real zeros of the symmetrised Dirichlet stages  g_N(s) = gam(s) D_N(s) + gam(1-s) D_N(1-s),  s real")
def gN(s, N):
    D = lambda w: mp.fsum(mp.mpf(n) ** (-w) for n in range(1, N + 1))
    return gam(s) * D(s) + gam(1 - s) * D(1 - s)
def bis(f, a, b, it=110):
    fa = f(a)
    for _ in range(it):
        m = (a + b) / 2; fm = f(m)
        if mp.sign(fm) == mp.sign(fa): a, fa = m, fm
        else: b = m
    return (a + b) / 2
for N in [1, 2, 3, 10]:
    hits = []
    for m in range(1, 60):          # interval (2m-1, 2m+1) between consecutive poles of gam(1-s)
        mid = gN(mp.mpf(2 * m), N)
        pole_sign = mp.sign(mp.gamma(mp.mpf(1 - 2 * m) / 2))   # sign of gam(1-s) D_N(1-s) on the whole interval; -> +-inf at both ends
        if mp.sign(mid) != pole_sign: hits.append(m)
    print(f" N={N}: intervals (2m-1,2m+1), m<60, where the mid value has the sign opposite to the divergence at both ends (two real zeros each): {len(hits)}; m = {hits[:6]}...")
    if hits:
        m = hits[0]
        r1 = bis(lambda s: gN(s, N), 2 * m - 1 + mp.mpf("1e-25"), mp.mpf(2 * m))
        r2 = bis(lambda s: gN(s, N), mp.mpf(2 * m), 2 * m + 1 - mp.mpf("1e-25"))
        print(f"   first pair: s = {mp.nstr(r1, 14)}, {mp.nstr(r2, 14)}; |g_N| = {mp.nstr(abs(gN(r1, N)), 3)}, {mp.nstr(abs(gN(r2, N)), 3)}; z = -i(2s-1): Im z = {mp.nstr(-(2*r1-1), 10)}")

print("== 5. full Euler factor stage P={2}: zero of gam(s)/(1-2^-s) + gam(1-s)/(1-2^(s-1)) near the pole 1 + 2 pi i k / log 2")
h = lambda s: gam(s) / (1 - 2 ** (-s)) + gam(1 - s) / (1 - 2 ** (s - 1))
for k in [2, 5, 20, 100, 1000]:
    s0 = 1 + 2j * mp.pi * k / mp.log(2)
    # first-order prediction: s - s0 = -c/A, c = residue of second term, A = gam(s0)/(1 - 2^-s0)
    c = gam(1 - s0) / (-mp.log(2)); A = gam(s0) / (1 - 2 ** (-s0))
    r = mp.findroot(h, s0 - c / A)
    print(f" k={k} pole {mp.nstr(s0, 10)}  zero {mp.nstr(r, 14)}  |h|={mp.nstr(abs(h(r)), 3)}  Re-1/2={mp.nstr(mp.re(r) - 0.5, 8)}  |zero-pole|={mp.nstr(abs(r - s0), 5)}")

print("== 6. free Ising products: if Xi(z) = e^{-a z^2} prod cos(lam_k z) then 3 * (first zero) is a zero")
g1 = mp.zetazero(1).imag
for m in [3, 5]:
    print(f" |zeta(1/2 + {m} i gamma_1)| = {mp.nstr(abs(mp.zeta(mp.mpf(1)/2 + 1j * m * g1)), 10)}   ({m} gamma_1 = {mp.nstr(m*g1, 10)})")

print("== 7. Curie-Weiss at criticality: exp(-x^4/12 - b x^2) transform, real-rooted for b>=0 (Polya); sample zero count")
def F(z, b):
    return 2 * mp.quad(lambda x: mp.exp(-x ** 4 / 12 - b * x ** 2) * mp.cos(z * x), [0, 2, 4, 8, 12])
for b in [0, 1, 4]:
    zs = [mp.mpf(i) / 4 for i in range(0, 80)]
    v = [F(z, b) for z in zs]
    sc = sum(1 for i in range(len(v) - 1) if mp.sign(v[i]) != mp.sign(v[i + 1]))
    print(f" b={b}: sign changes of the transform on 0<z<20: {sc}")
