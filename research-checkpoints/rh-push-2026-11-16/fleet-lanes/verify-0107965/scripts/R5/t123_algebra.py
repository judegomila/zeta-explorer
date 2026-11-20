"""R5 referee: own checks of Lemma 3.3, eq (61)-(62), Lemma A.1, Props A.2/A.3, eq (63).
mpmath only. No packet code imported, no packet file read."""
import random, itertools
from mpmath import mp, mpf, log, exp, quad, mpc, pi, findroot
mp.dps = 40
random.seed(5)

def coeffs(t, K):
    """b, d (=D log* b), dtilde, c for n<=K from the definitions (not from the paper's ODE)."""
    t = mpf(t)
    lg = [mpf(0), mpf(0)] + [log(n) for n in range(2, K + 1)]
    b = [mpf(0)] + [exp(t * lg[n] ** 2 / 4) for n in range(1, K + 1)]
    # d = (D b) * b^{-1}: solve (log n) b(n) = sum_{r|n} d(r) b(n/r)
    d = [mpf(0)] * (K + 1)
    divs = [[] for _ in range(K + 1)]
    for r in range(2, K + 1):
        for n in range(r, K + 1, r):
            divs[n].append(r)
    for n in range(2, K + 1):
        d[n] = lg[n] * b[n] - sum(d[r] * b[n // r] for r in divs[n] if r < n)
    # Euler multiplier coefficients m_t (8 terms)
    m = {1: mpf(1)}
    for p in (2, 3, 5):
        for q, v in list(m.items()):
            m[q * p] = -v * b[p]
    c = [mpf(0)] * (K + 1)
    for q, v in m.items():
        for n in range(q, K + 1, q):
            c[n] += v * b[n // q]
    # dtilde from its DEFINITION D log* c: (log n) c(n) = sum_{r|n,r>=2} dt(r) c(n/r), c(1)=1
    dt = [mpf(0)] * (K + 1)
    for n in range(2, K + 1):
        dt[n] = lg[n] * c[n] - sum(dt[r] * c[n // r] for r in divs[n] if r < n)
    return lg, b, d, dt, c

print('== T1: Lemma 3.3 ==')
K = 4096
ts = [0, mpf(1)/400, mpf(1)/50, mpf(1)/16, mpf(87)/800, mpf(19)/125, mpf(1)/5]
prev = None
for t in ts:
    lg, b, d, dt, c = coeffs(t, K)
    mn = (min(d[2:]), min(dt[2:]), min(c[2:]))
    # eq (60)
    e60 = 0
    for n in range(2, K + 1):
        sub = mpf(0)
        for p in (2, 3, 5):
            j = 1; q = p
            while q <= K:
                if q == n: sub = lg[p] * exp(j * mpf(t) * lg[p] ** 2 / 4)
                q *= p; j += 1
        e60 = max(e60, abs(dt[n] - (d[n] - sub)))
    mono = None
    if prev is not None:
        mono = (min(x - y for x, y in zip(d[2:], prev[0][2:])), min(x - y for x, y in zip(dt[2:], prev[1][2:])), min(x - y for x, y in zip(c[2:], prev[2][2:])))
    print('t=%s min d=%s min dtilde=%s min c=%s | max err (60)=%s | min increments vs previous t: %s' % (mp.nstr(mpf(t), 6), mp.nstr(mn[0], 5), mp.nstr(mn[1], 5), mp.nstr(mn[2], 5), mp.nstr(e60, 3), None if mono is None else [mp.nstr(x, 4) for x in mono]))
    prev = (d, dt, c)
# heat ODE for d by central difference at t=0.05
t0 = mpf(1)/20; hh = mpf(10) ** -12
_, _, dp, _, _ = coeffs(t0 + hh, 600); _, _, dm, _, _ = coeffs(t0 - hh, 600); lg, b, d, dt, c = coeffs(t0, 600)
worst = 0
for n in range(2, 601):
    conv = sum(d[a] * d[n // a] for a in range(2, n) if n % a == 0)
    rhs = lg[n] ** 2 / 4 * d[n] + lg[n] / 4 * conv
    worst = max(worst, abs((dp[n] - dm[n]) / (2 * hh) - rhs))
print('heat ODE for d_t(n), n<=600, t=1/20: max |finite difference - rhs| =', mp.nstr(worst, 3))
# d_0 = von Mangoldt
lg, b, d, dt, c = coeffs(0, 300)
def vm(n):
    for p in range(2, n + 1):
        if n % p == 0:
            m = n
            while m % p == 0: m //= p
            return log(p) if m == 1 else mpf(0)
print('d_0 = Lambda: max err', mp.nstr(max(abs(d[n] - vm(n)) for n in range(2, 301)), 3))

print('== T2: residual identity (61)-(62) on small models, all labels brute force ==')
def t2(N0, K, t, sigma, h, Lfake, trials=200):
    lg, b, d, dt, c_small = coeffs(t, max(K, 30))
    t = mpf(t)
    logs = [mpf(0)] + [log(n) for n in range(1, 30 * N0 + 1)]
    bb = lambda n: exp(t * logs[n] ** 2 / 4)
    m = {1: mpf(1)}
    for p in (2, 3, 5):
        for q, v in list(m.items()):
            m[q * p] = -v * bb(p)
    # labels of Q = E*f : (freq, coefficient modulus weight, sign, kind, integer label for phase)
    # first branch: n<=N0, weight b(n) n^-sigma ; reflected: weight b(n) n^-(sigma-h) e^{-hL/2}, freq L-log n
    head = {}      # collected coefficient c(n) n^-sigma for dn<=N0
    ext = []       # (freq, signed weight, phase-key)
    for q, v in m.items():
        for n in range(1, N0 + 1):
            w = v * bb(n) * mpf(q * n) ** (-sigma)
            if q * n <= N0: head[q * n] = head.get(q * n, mpf(0)) + w
            else: ext.append((logs[q * n], w, ('f', q * n)))
            wr = v * mpf(q) ** (-sigma) * bb(n) * mpf(n) ** (-(sigma - h)) * exp(-h * Lfake / 2)
            ext.append((Lfake - logs[n] + logs[q], wr, ('r', q, n)))
    A = sum(head[n] for n in head if n > 1) + sum(abs(w) for f, w, k in ext)
    B = sum(logs[n] * head[n] for n in head if n > 1) + sum(f * abs(w) for f, w, k in ext)
    DK = sum(dt[k] * mpf(k) ** (-sigma) for k in range(2, K + 1))
    ZK = sum(dt[k] * mpf(k) ** (-sigma) * sum(head[mm] for mm in range(2, N0 // k + 1)) for k in range(2, K + 1))
    Rstar = B - (1 - A) * DK - 2 * ZK
    # direct positive decomposition
    res_head = mpf(0)
    for n in range(2, N0 + 1):
        matched = sum(dt[k] * mpf(k) ** (-sigma) * (head[n // k] if n // k > 1 else (1 if n == k else 0)) for k in range(2, min(K, n) + 1) if n % k == 0)
        r = logs[n] * head[n] - matched
        assert r > -mpf(10) ** -30, ('negative residual coefficient', n, r)
        res_head += r
    overflow = sum(dt[k] * mpf(k) ** (-sigma) * sum(head[mm] for mm in range(N0 // k + 1, N0 + 1)) for k in range(2, K + 1))
    extpart = sum(f * abs(w) for f, w, k in ext) + DK * sum(abs(w) for f, w, k in ext)
    direct = res_head + overflow + extpart
    # random-phase test of |V - Q T_K| <= R*
    worst = mpf(0)
    for _ in range(trials):
        tau = mpf(random.uniform(0, 500)); v = mpf(random.uniform(-2, 2)); G = exp(mpc(0, random.uniform(0, 6.28)))
        ph = lambda n: exp(mpc(0, 1) * (tau + v / 2) * logs[n])
        Q = 1 + sum(head[n] * ph(n) for n in head if n > 1); V = sum(logs[n] * head[n] * ph(n) for n in head if n > 1)
        for f, w, k in ext:
            if k[0] == 'f': z = w * ph(k[1])
            else: z = w * G * ph(k[1]) / ph(k[2]) * exp(mpc(0, 1) * v / 2 * (Lfake - 2 * logs[k[2]])) * ph(k[2]) ** 0
            Q += z; V += f * z
        TK = sum(dt[k] * mpf(k) ** (-sigma) * ph(k) for k in range(2, K + 1))
        worst = max(worst, abs(V - Q * TK) / Rstar)
    print('N0=%d K=%d t=%s sigma=%s: R*=%s direct sum of nonneg pieces=%s diff=%s ; max |V-Q T_K|/R* over %d random phases = %s' % (N0, K, mp.nstr(t, 4), mp.nstr(sigma, 4), mp.nstr(Rstar, 12), mp.nstr(direct, 12), mp.nstr(Rstar - direct, 3), trials, mp.nstr(worst, 6)))
t2(400, 16, mpf(1)/10, mpf('1.9'), mpf('2.2'), 2 * log(400) + mpf('0.01'))
t2(700, 40, mpf(1)/50, mpf('1.6'), mpf('2'), 2 * log(700) + mpf('0.3'))
t2(300, 7, mpf(0), mpf('1.55'), mpf('2.1'), 2 * log(300))

print('== T3: Lemma A.1, Props A.2/A.3, eq (63) ==')
Vp = mpf(6723) / 500; Vm = mpf(2689) / 200
worstA = worstD = 0; viol = 0; cnt = 0
for h in [mpf('1.21'), mpf('1.3189'), mpf('1.5'), 2, mpf('2.18'), 3, 4, 6]:
    for tl in [0, mpf(1)/400, mpf(1)/16, mpf(43)/400, mpf(19)/125]:
        h = mpf(h); d = (h - 1) / 2; p = (h + 1) / 2; a = mpf(tl) * Vm / 2; k = a + d; c = a + h; U = 1 / d - 1 / p
        Aa = Vp / (2 * d) + 1 / (2 * d * d); Ak = Vp * U / 2 + (1 / d ** 2 - 1 / p ** 2) / 2; Bk = U / 2; Ac = Vp / (2 * p) + 1 / (2 * p * p); Bc = 1 / p
        A3 = lambda s: exp(-a * s) / d - U * exp(-k * s) - exp(-c * s) / p
        D3 = lambda s: Aa * exp(-a * s) - (Ak + Bk * s) * exp(-k * s) - (Ac + Bc * s) * exp(-c * s)
        Aint = lambda s: exp(-a * s) * quad(lambda w: exp(-d * w), [0, s]) + exp(-c * s) * quad(lambda w: exp(p * w), [0, s])
        Dint = lambda s: exp(-a * s) / 2 * quad(lambda w: (Vp + w) * exp(-d * w), [0, s]) + exp(-c * s) / 2 * quad(lambda w: (Vp + 2 * s - w) * exp(p * w), [0, s])
        for s in [mpf('1e-12'), mpf('0.01'), mpf('0.3'), 1, 5, 40]:
            s = mpf(s)
            worstA = max(worstA, abs(A3(s) - Aint(s)) / max(Aint(s), mpf('1e-30'))); worstD = max(worstD, abs(D3(s) - Dint(s)) / max(Dint(s), mpf('1e-30')))
            if not (Aint(s) <= 2 * s * (1 + mpf(10) ** -25) and Dint(s) <= (Vp + 2 * s) * s * (1 + mpf(10) ** -25)): viol += 1
        Hk = k * Ak - Bk; Jk = k * Bk; Hc = c * Ac - Bc; Jc = c * Bc
        ok115 = min(Hk, Jk, Hc, Jc) > 0 and Jk - d * Hk < 0 and Jc - h * Hc < 0
        # sign changes of derivative on a fine grid, and compare max on grid with value at the root
        dA = lambda s: -a / d + k * U * exp(-d * s) + c / p * exp(-h * s)
        dD = lambda s: -a * Aa + (Hk + Jk * s) * exp(-d * s) + (Hc + Jc * s) * exp(-h * s)
        grid = [mpf(i) / 50 for i in range(0, 50 * 400)]
        chA = sum(1 for x, y in zip(grid, grid[1:]) if (dA(x) > 0) != (dA(y) > 0)); chD = sum(1 for x, y in zip(grid, grid[1:]) if (dD(x) > 0) != (dD(y) > 0))
        gA = max(A3(s) for s in grid); gD = max(D3(s) for s in grid)
        cnt += 1
        print('h=%s t-=%s a=%s: (115) %s; sign changes A\'=%d D\'=%d on [0,400); A\'(0)=%s (claim 2) D\'(0)=%s (claim V+=%s); grid max A=%s (1/d=%s) D=%s (Aa=%s)' % (mp.nstr(h, 5), mp.nstr(mpf(tl), 5), mp.nstr(a, 4), ok115, chA, chD, mp.nstr(dA(0), 12), mp.nstr(dD(0), 12), mp.nstr(Vp, 8), mp.nstr(gA, 8), mp.nstr(1 / d, 8), mp.nstr(gD, 8), mp.nstr(Aa, 8)))
print('Lemma A.1: max relative |closed form - quadrature| A: %s  D: %s ; violations of (63)-type bounds A<=2s, D<=(V+ +2s)s: %d' % (mp.nstr(worstA, 3), mp.nstr(worstD, 3), viol))
# refund scaling inequality, random
bad = 0
for _ in range(20000):
    g = random.uniform(0.01, 1); r0 = random.uniform(0, g * 0.999); r1 = random.uniform(0, 1); W = random.uniform(0, 10); kap = random.uniform(0, 1)
    Pq = lambda a0, a1: a1 / (g - a0) + W * a0 / (2 * g * (g - a0))
    if Pq(kap * r0, kap * r1) > kap * Pq(r0, r1) * (1 + 1e-12): bad += 1
print('refund scaling P(g,W;k r0,k r1) <= k P(g,W;r0,r1): violations in 20000 random draws =', bad)
