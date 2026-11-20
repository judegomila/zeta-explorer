"""Ball-arithmetic recheck (python-flint arb, 128 bits) with an independent naive implementation of the triangle functional
(accumulation by n in a dictionary, no gcd structure), and a ball recheck of sampled covering coefficients c_n^F."""
import sys, json, math, random
from flint import arb, ctx
ctx.prec = 128
KAP = (arb(10) - 2 * arb(5).sqrt()).sqrt(); KAP = (KAP - 2) / (arb(5).sqrt() - 1)
def a_dh(n): return [arb(0), arb(1), KAP, -KAP, arb(-1)][n % 5]
def a_one(n): return arb(1)
def tri_naive(N, t, y, lam, a):
    t = arb(t); y = arb(y); pi = arb.pi()
    xN = 4 * pi * (arb(N) ** 2 - t / 16); L = (arb(N) ** 2 - t / 16).log()
    inner = 1 - 3 * y + 4 * y * (1 + y) / xN**2
    inner = inner if inner > 0 else arb(0)
    sigma = (1 + y) / 2 + (t / 4) * L - t * inner / (2 * xN**2); K = t * y / (2 * (xN - 6)); g = (arb('0.02') * y - (y / 2) * L).exp()
    lg = [arb(0)] + [arb(m).log() for m in range(1, N + 1)]
    cB = [None] + [a(m) * ((t / 4) * lg[m] ** 2).exp() for m in range(1, N + 1)]
    b = {}; a0 = {}
    for d, l in lam.items():
        l = arb(l)
        for m in range(1, N + 1):
            n = d * m; v = l * cB[m]
            b[n] = b.get(n, arb(0)) + v; a0[n] = a0.get(n, arb(0)) + v * (y * lg[m]).exp()
    S = arb(0)
    for n in b:
        if n == 1: continue
        S += (abs(b[n]) + g * abs(a0[n])) * (-sigma * arb(n).log()).exp()
    M = sum((abs(arb(l)) * (-sigma * arb(d).log()).exp() for d, l in lam.items()), arb(0))
    corr = g * sum((abs(cB[m]) * ((K * lg[m]).exp() - 1) * ((y - sigma) * lg[m]).exp() for m in range(2, N + 1)), arb(0))
    return (1 - g - S) / M - corr
Y0 = arb(87677) / 2500000; Y0 = Y0.sqrt()
out = []
# (a) zeta, Euler mollifier p <= 11, N = 2000, t = 0.36 and 0.33 (float64 code value compared in RESULT.md)
import itertools
def euler(P, t):
    lam = {1: arb(1)}
    for p in P:
        bp = ((arb(t) / 4) * arb(p).log() ** 2).exp(); lam = {**lam, **{d * p: -v * bp for d, v in lam.items()}}
    return lam
for N, t in ((2000, '0.36'), (2000, '0.33')):
    T = tri_naive(N, arb(t), Y0, euler((2, 3, 5, 7, 11), t), a_one); out.append(dict(case='ZETA P11', N=N, t=t, T=str(T))); print(out[-1], flush=True)
# (b) DH with the optimised mollifier stored at its t* bracket (N = 10000) evaluated at t = tstar_hi + 0.02
for l in open('c1_dh_DH_1000-10000-100000.jsonl'):
    r = json.loads(l)
    if r['part'] == 'dh_tstar' and r['N'] in (1000, 10000):
        lam = {int(d): v for d, v in r['lam'].items() if v != 0}
        for dt in ('0.02', '-0.03'):
            t = arb(r['tstar_hi']) + arb(dt)
            T = tri_naive(r['N'], t, Y0, lam, a_dh); out.append(dict(case='DH optimised mollifier (fixed at t*)', N=r['N'], t=float(r['tstar_hi']) + float(dt), T=str(T), sign=('positive' if T > 0 else 'negative' if T < 0 else 'undecided'))); print(out[-1], flush=True)
# (c) covering coefficients: 20000 random n <= 1e9, DH and chi_-4 with zeta weights, t0 and t = 0.10: sign and monotonicity in balls
random.seed(20261119); MU = {1: 1, 2: -1, 3: -1, 5: -1, 6: 1, 10: 1, 15: 1, 30: -1}
def cn(n, t, a):
    s = arb(0)
    for d, mu in MU.items():
        if n % d == 0:
            beta = sum((arb(p).log() ** 2 for p in (2, 3, 5) if d % p == 0), arb(0))
            s += mu * ((arb(t) / 4) * (beta + arb(n // d).log() ** 2)).exp() * a(n // d)
    return s
def a_chi4(n): return arb([0, 1, 0, -1][n % 4])
for nm, a in (('DH', a_dh), ('CHIM4', a_chi4), ('ZETA', a_one)):
    neg = 0; nonmono = 0; und = 0; K = 20000
    for _ in range(K):
        n = random.randint(2, 10**9); c1 = cn(n, '0.10', a); c2 = cn(n, '0.16125', a)
        if c2 < 0: neg += 1
        elif not (c2 >= 0): und += 1
        if c1 > c2: nonmono += 1
    out.append(dict(case='c_n^F zeta weights, random n <= 1e9', F=nm, samples=K, negative_at_t0=neg, undecided_sign=und, c_at_0p10_gt_c_at_t0=nonmono)); print(out[-1], flush=True)
json.dump(out, open('recheck_arb.json', 'w'), indent=1)
