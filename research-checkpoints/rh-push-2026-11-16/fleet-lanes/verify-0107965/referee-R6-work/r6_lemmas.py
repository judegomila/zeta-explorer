"""R6 referee: numerical tests of the analytic lemmas of App. D (own code, mpmath/numpy only)."""
import sys, math, random
import mpmath as mp
import numpy as np
mp.mp.dps = 40
random.seed(1); rng = np.random.default_rng(1)
out = []
def rep(name, ok, info=''):
    out.append((name, ok)); print(('PASS ' if ok else 'FAIL ') + name, info, flush=True)

# L1: SOS template identity and bound, random A,B,C and dense grid
worst = 1e9; iderr = 0
for _ in range(400):
    A, B, C = [10 ** random.uniform(-3, 3) for _ in range(3)]
    a = rng.uniform(-np.pi, np.pi, 4000); b = rng.uniform(-np.pi, np.pi, 4000)
    lhs = A * np.cos(a) + B * np.cos(b) - C * np.cos(a + b)
    rhs = 0.5 * (A * B / C + A * C / B + B * C / A)
    u = np.exp(1j * a); v = np.exp(1j * b)
    sq = C / 2 * np.abs(np.sqrt(A / B) * u + np.sqrt(B / A) * np.conj(v) - np.sqrt(A * B) / C) ** 2
    iderr = max(iderr, np.max(np.abs((rhs - lhs) - sq)) / max(A, B, C, rhs))
    worst = min(worst, np.min(rhs - lhs) / rhs)
rep('L1 SOS identity (rhs-lhs = (C/2)|...|^2) and sign', iderr < 1e-9 and worst > -1e-12, f'max rel identity error {iderr:.2e}, min (rhs-lhs)/rhs {worst:.3e}')

# L1b: harmonic branch: C(1/A+1/B)<=1 => A(1-cos a)+B(1-cos b)+C(1+cos(a+b)) >= 2C
worst = 1e9
for _ in range(400):
    A, B = [10 ** random.uniform(-2, 2) for _ in range(2)]
    C = random.uniform(0.2, 1.0) / (1 / A + 1 / B)
    g = np.linspace(-np.pi, np.pi, 801); a, b = np.meshgrid(g, g)
    val = A * (1 - np.cos(a)) + B * (1 - np.cos(b)) + C * (1 + np.cos(a + b)) - 2 * C
    worst = min(worst, val.min() / C)
rep('L1b harmonic branch deficit >= 2C', worst > -1e-12, f'min (val-2C)/C {worst:.3e}')
# sharpness: C(1/A+1/B) slightly above 1 must be able to fail (direction check)
A = B = 1.0; C = 0.5 * 1.3
g = np.linspace(-np.pi, np.pi, 2001); a, b = np.meshgrid(g, g)
val = A * (1 - np.cos(a)) + B * (1 - np.cos(b)) + C * (1 + np.cos(a + b)) - 2 * C
rep('L1b sharpness (fails when C(1/A+1/B)=1.3)', val.min() < 0, f'min {val.min():.4f}')

# L2: repeated label maximum of S cos u - C cos 2u
worst = 0
for _ in range(2000):
    S = 10 ** random.uniform(-2, 2); C = 10 ** random.uniform(-2, 2)
    u = np.linspace(-np.pi, np.pi, 20001)
    m = np.max(S * np.cos(u) - C * np.cos(2 * u))
    f = C + S * S / (8 * C) if S <= 4 * C else S - C
    worst = max(worst, abs(m - f) / f, (m - f) / f)
rep('L2 repeated-label maximum formula', worst < 1e-6, f'max rel deviation {worst:.2e}')

# L3: composite inequality 1-cos(sum e_p th_p) <= Omega * sum e_p (1-cos th_p)
worst = 1e9
for _ in range(200000):
    k = random.randint(1, 5); e = [random.randint(1, 4) for _ in range(k)]
    th = [random.uniform(-math.pi, math.pi) * random.choice([1, 0.1, 0.01]) for _ in range(k)]
    Om = sum(e)
    lhs = 1 - math.cos(sum(ei * t for ei, t in zip(e, th)))
    rhs = Om * sum(ei * (1 - math.cos(t)) for ei, t in zip(e, th))
    worst = min(worst, rhs - lhs)
rep('L3 composite telescoping/Cauchy inequality', worst > -1e-12, f'min rhs-lhs {worst:.3e}')
# equality case: all equal small angles -> ratio -> 1 (bound is sharp, so Omega*e_p charge cannot be reduced)
t = 1e-4; e = [2, 1]; Om = 3
print('   L3 sharpness ratio lhs/rhs at equal small angles:', (1 - math.cos(3 * t)) / (Om * 3 * (1 - math.cos(t))))

# L4: conjugate C*(alpha,b) = max_{|u|<=pi} b u - alpha(1-cos u)
worst = 0
for _ in range(3000):
    al = 10 ** random.uniform(-3, 1); b = al * random.choice([random.uniform(0, 0.999), random.uniform(1, 5)]) * random.choice([-1, 1])
    u = np.linspace(-np.pi, np.pi, 400001)
    m = np.max(b * u - al * (1 - np.cos(u)))
    cands = [math.pi * abs(b) - 2 * al]
    if abs(b) < al:
        w = abs(b) / al; cands.append(al * (w * math.asin(w) + math.sqrt(1 - w * w) - 1))
    f = max(cands)
    worst = max(worst, abs(m - f) / max(al, abs(f)))
rep('L4 principal-angle conjugate closed form', worst < 1e-8, f'max rel deviation {worst:.2e}')
# where does the endpoint beat the interior stationary value? (u*asin u + sqrt(1-u^2) - 1 >= pi u - 2 ?)
us = np.linspace(0, 1, 100001); psi = us * np.arcsin(us) + np.sqrt(1 - us ** 2) - 1
cross = us[np.argmax(psi < np.pi * us - 2)] if np.any(psi < np.pi * us - 2) else None
print('   L4 endpoint dominates interior for u >=', cross)

# L5: cosine envelope: sum r_p(1-cos th_p) >= r*(1-cos sqrt(u)), u=min(E/r*,6), whenever sum r_p th_p^2 >= E, |th_p|<=pi
worst = 1e9
for _ in range(100000):
    k = random.randint(1, 6); r = [10 ** random.uniform(-3, 0) for _ in range(k)]
    th = [random.uniform(-math.pi, math.pi) * random.choice([1, 0.3, 0.05]) for _ in range(k)]
    Etrue = sum(ri * t * t for ri, t in zip(r, th)); E = Etrue * random.uniform(0.2, 1.0)
    rs = min(r); u = min(E / rs, 6.0)
    lhs = sum(ri * (1 - math.cos(t)) for ri, t in zip(r, th))
    mid = rs * (1 - math.cos(math.sqrt(u))); low = rs * (u / 2 - u ** 2 / 24 + u ** 3 / 720 - u ** 4 / 40320)
    worst = min(worst, (lhs - mid) / rs, (mid - low) / rs)
rep('L5 angle-energy -> cosine deficit envelope', worst > -1e-12, f'min normalized slack {worst:.3e}')

# L6: Loewner step: U - UWU > 0, U >= G = V V^T  =>  V^T W V <= I
worst = -1
for _ in range(300):
    m = random.randint(2, 8); p = random.randint(2, 12)
    V = rng.normal(size=(m, p)); G = V @ V.T
    U = G + rng.uniform(0, 0.1) * np.eye(m)
    # choose W so that U - UWU is PD: W = c * U^{-1} scaled diagonal attempt
    w = rng.uniform(0, 1, m); W = np.diag(w)
    s = np.max(np.linalg.eigvalsh(np.sqrt(W) @ U @ np.sqrt(W)))
    W = W / (s * rng.uniform(1.01, 2))
    assert np.min(np.linalg.eigvalsh(U - U @ W @ U)) > 0
    worst = max(worst, np.max(np.linalg.eigvalsh(V.T @ W @ V)))
rep('L6 U-UWU>0 & U>=G implies V^T W V <= I', worst <= 1 + 1e-10, f'max eig {worst:.6f}')

# L7: d_t recurrence, derivative formula, positivity, monotonicity (n<=600)
K = 600
logs = [mp.mpf(0)] + [mp.log(n) for n in range(1, K + 1)]
divs = [[] for _ in range(K + 1)]
for d in range(2, K + 1):
    for n in range(2 * d, K + 1, d): divs[n].append(d)
def dt(t):
    b = [mp.mpf(0)] + [mp.exp(mp.mpf(t) * logs[n] ** 2 / 4) for n in range(1, K + 1)]
    d = [mp.mpf(0)] * (K + 1)
    for n in range(2, K + 1):
        d[n] = logs[n] * b[n] - mp.fsum(d[r] * b[n // r] for r in divs[n])
    return d
ok = True; maxerr = 0
for t in [mp.mpf('0'), mp.mpf('0.02'), mp.mpf('0.0875'), mp.mpf('0.10875')]:
    h = mp.mpf('1e-12'); d0 = dt(t); d1 = dt(t + h); dm = dt(t - h) if t > 0 else None
    for n in range(2, K + 1):
        fd = (d1[n] - d0[n]) / h if dm is None else (d1[n] - dm[n]) / (2 * h)
        formula = logs[n] ** 2 / 4 * d0[n] + logs[n] / 4 * mp.fsum(d0[a] * d0[n // a] for a in divs[n])
        maxerr = max(maxerr, abs(fd - formula))
        if d0[n] < -mp.mpf('1e-30') or formula < -mp.mpf('1e-30'): ok = False
# t=0 equals von Mangoldt
d0 = dt(0)
def vonm(n):
    for p in range(2, n + 1):
        if n % p == 0:
            m = n
            while m % p == 0: m //= p
            return mp.log(p) if m == 1 else mp.mpf(0)
vm = max(abs(d0[n] - vonm(n)) for n in range(2, K + 1))
rep('L7 d_t: d_0=Lambda, d/dt formula, d_t>=0 and nondecreasing (n<=600)', ok and maxerr < 1e-9 and vm < 1e-30, f'max |FD-formula| {mp.nstr(maxerr,3)}, max|d_0-Lambda| {mp.nstr(vm,3)}')

# L8: coordinate constants
N0 = 690988; X = 6000000185827
k0 = mp.mpf(1) / 5000000
g0 = (1 - 4 * mp.pi * N0 ** 2 / mp.mpf(6) / 10 ** 12) / 4
print('   (1-4 pi N0^2/X0)/4 =', mp.nstr(g0, 12), ' kappa0 =', mp.nstr(k0, 6), ' 4 pi N0^2 =', mp.nstr(4 * mp.pi * N0 ** 2, 20))
rep('L8 kappa0 < (1-4piN0^2/X0)/4 and X-4 > 6e12 > 4 pi N0^2', g0 > k0 and X - 4 > 6 * 10 ** 12 > 4 * mp.pi * N0 ** 2,
    f'ratio {mp.nstr(g0/k0,8)}; L0={mp.nstr(2*mp.log(N0),12)}; L(X-4)={mp.nstr(mp.log((X-4)/(4*mp.pi)),14)}')
# true c-c0 at x = X-4 (smallest physical centre) versus kappa0
print('   c-c0 at x=X-4:', mp.nstr((mp.log((X - 4) / (4 * mp.pi)) - 2 * mp.log(N0)) / 4, 10), ' at x=6e12:', mp.nstr((mp.log(6e12 / (4 * mp.pi)) - 2 * mp.log(N0)) / 4, 10))
# L9: row-8 relation
num = 3 ** 4 * 5 * 11 * 19 ** 2 * 23 * 47 * 71; den = 2 ** 4 * 7 ** 5 * 13 * 17 * 31 * 67
a8 = 2 * N0 ** 2 * mp.log(mp.mpf(num) / den)
rep('L9 row-8 relation product = 123435179505/123435179504', (num, den) == (123435179505, 123435179504), f'a_8 = 2N0^2 log R = {mp.nstr(a8,12)} (h_8=7, delta at v=q=0: {mp.nstr(a8-7,8)})')
# L10: near-interval cover e^{omega}-1 <= omega/(1-omega), and clock identity tau/pi = 2N0^2(1+v+q)
ok = all(math.exp(w) - 1 <= w / (1 - w) for w in np.linspace(1e-6, 0.999, 5000))
x = mp.mpf('6.1e12'); t = mp.mpf('0.05'); L = mp.log(x / (4 * mp.pi)); v = mp.exp(L - 2 * mp.log(N0)) - 1; q = t / (16 * N0 ** 2)
err = abs((x / 2 + mp.pi * t / 8) / mp.pi - 2 * N0 ** 2 * (1 + v + q))
rep('L10 e^w-1<=w/(1-w); tau/pi = 2N0^2(1+v+q)', ok and err < mp.mpf('1e-20'), f'clock identity error {mp.nstr(err,3)}')
print('SUMMARY', sum(o for _, o in out), 'of', len(out), 'pass')
sys.exit(0 if all(o for _, o in out) else 1)
