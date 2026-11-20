"""Remainders E0(b) = L0(b) - phi(b)(log b - 1), E1(b) = L1(b) - phi(b) b ((1/2) log b - 1/4),
L0 = sum_{1<=a<b,(a,b)=1} log a, L1 = sum a log a, for every b <= B by Moebius divisor sums; ratio to 2^omega(b)(log b + 2) (times b for E1).
Closed form checked: E0(b) = Lambda(b)/2 + (1/(12 b)) prod_{p|b}(1-p) + O(b^-3 prod(p^3-1))  (Stirling series of log n!)."""
import numpy as np, math, sys, json
from scipy.special import gammaln
import mpmath as mp
B = int(float(sys.argv[1]))
print(f"# planned memory: 9 arrays of {B+1} float64/int = {9*8*(B+1)/1e9:.2f} GB")
mu = np.ones(B + 1, dtype=np.int8); om = np.zeros(B + 1, dtype=np.int8); pr = np.ones(B + 1, dtype=bool); lam = np.zeros(B + 1)
for p in range(2, B + 1):
    if pr[p]:
        pr[2 * p::p] = False; mu[p::p] *= -1; om[p::p] += 1
        if p * p <= B: mu[p * p::p * p] = 0
        q = p
        while q <= B: lam[q] = math.log(p); q *= p
n = np.arange(B + 1, dtype=np.float64)
lg = np.zeros(B + 1); lg[1:] = np.log(n[1:])
LG = gammaln(n + 1)                         # log n!
G = np.cumsum(n * lg)                       # sum_{k<=n} k log k
L0 = np.zeros(B + 1); L1 = np.zeros(B + 1); phi = np.zeros(B + 1); P1 = np.zeros(B + 1)
for d in range(1, B + 1):
    if mu[d] == 0: continue
    m = np.arange(1, B // d + 1); md = float(mu[d])
    L0[d::d] += md * (m * lg[d] + LG[m]); L1[d::d] += md * d * (lg[d] * m * (m + 1.0) / 2 + G[m]); phi[d::d] += md * m; P1[d::d] += md * d
b = n[2:]; E0 = L0[2:] - phi[2:] * (lg[2:] - 1); E1 = L1[2:] - phi[2:] * b * (0.5 * lg[2:] - 0.25)
den = 2.0 ** om[2:] * (lg[2:] + 2)
r0 = np.abs(E0) / den; r1 = np.abs(E1) / (b * den)
cf = lam[2:] / 2 + P1[2:] / (12 * b)
res = dict(B=B, max_ratio_E0=float(r0.max()), argmax_E0=int(np.argmax(r0) + 2), max_ratio_E1=float(r1.max()), argmax_E1=int(np.argmax(r1) + 2),
           max_abs_E1_over_b=float((np.abs(E1) / b).max()), argmax_E1_over_b=int(np.argmax(np.abs(E1) / b) + 2),
           E0_closed_form_max_dev=float(np.abs(E0 - cf)[b < 2e5].max()), E0_closed_form_max_dev_note='b < 2e5 (float cancellation above)')
for lo in (1e2, 1e4, 1e6):
    s = b >= lo
    if s.any(): res[f'max_ratio_E0_b>={int(lo)}'] = float(r0[s].max()); res[f'max_ratio_E1_b>={int(lo)}'] = float(r1[s].max())
# primorials by exact divisor sums at 40 digits
mp.mp.dps = 40; prs = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]; rows = []
from itertools import combinations
for kk in range(2, 11):
    ps = prs[:kk]; bb = 1
    for p in ps: bb *= p
    l0 = mp.mpf(0); l1 = mp.mpf(0); ph = 1
    for p in ps: ph *= (p - 1)
    for r in range(kk + 1):
        for cmb in combinations(ps, r):
            d = 1
            for p in cmb: d *= p
            m = bb // d; sg = (-1) ** r
            l0 += sg * (m * mp.log(d) + mp.loggamma(m + 1))
            # G(m) = sum k log k = log of the hyperfactorial = zeta'(-1, m+1) - zeta'(-1)
            Gm = mp.zeta(-1, m + 1, derivative=1) - mp.zeta(-1, derivative=1)
            l1 += sg * d * (mp.log(d) * m * (m + 1) / 2 + Gm)
    e0 = l0 - ph * (mp.log(bb) - 1); e1 = l1 - ph * bb * (mp.log(bb) / 2 - mp.mpf(1) / 4)
    dn = 2 ** kk * (math.log(bb) + 2)
    rows.append(dict(b=bb, omega=kk, E0=float(e0), E1_over_b=float(e1 / bb), ratio_E0=float(abs(e0) / dn), ratio_E1=float(abs(e1) / (bb * dn))))
res['primorials'] = rows
json.dump(res, open('../out/e0e1.json', 'w'), indent=1)
print(json.dumps({k: v for k, v in res.items() if k != 'primorials'}, indent=0))
for r in rows: print(r)
