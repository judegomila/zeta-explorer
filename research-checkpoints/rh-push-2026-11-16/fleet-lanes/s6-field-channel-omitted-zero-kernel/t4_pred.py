"""Combination 4, prediction.  Small-distance constants of the sine kernel and of the CUE(n) kernel S_n(r) = sin(pi r)/(n sin(pi r/n)):
  R2 ~ c2 r^2,  R3(0, x, x+y) ~ c3 (x y (x+y))^2.   Effective matrix size from the primes (Bogomolny et al. 2006):
  N_eff(E) = log(E/2pi)/sqrt(12 Lam),  Lam = gamma0^2 + 2 gamma1 + sum_p log^2 p/(p-1)^2.
Leading-order prediction for the fraction of windows of N zeros whose minimal pair has rho = g/d_1 > c:
  f(N) = N int_0^inf dg 2 c3 I_c g^7 exp(-N (c2/3) g^3),  I_c = int_1^{1/c} u^2 (1+u)^2 du  =  2 c3 I_c Gamma(8/3) / (3 (c2/3)^(8/3)) N^(-5/3).
Usage: t4_pred.py OUT.json"""
import sys, math, json, numpy as np, mpmath as mp
mp.mp.dps = 60
def consts(n=None):
    K = (lambda r: mp.sinc(mp.pi * r)) if n is None else (lambda r: mp.sin(mp.pi * r) / (n * mp.sin(mp.pi * r / n)) if r != 0 else mp.mpf(1))
    e = mp.mpf('1e-6'); x, y = e, 2 * e
    R2 = 1 - K(e) ** 2
    pts = [mp.mpf(0), x, x + y]
    A = mp.matrix(3, 3)
    for i in range(3):
        for j in range(3): A[i, j] = K(pts[i] - pts[j])
    R3 = mp.det(A)
    return float(R2 / e ** 2), float(R3 / (x * y * (x + y)) ** 2)
ps = np.ones(10 ** 6 + 1, bool); ps[:2] = False
for i in range(2, 1001):
    if ps[i]: ps[i * i::i] = False
p = np.nonzero(ps)[0].astype(np.float64)
S = float((np.log(p) ** 2 / (p - 1) ** 2).sum()); tail = (math.log(1e6) ** 2 + 2 * math.log(1e6) + 2) / 1e6 / math.log(1e6) * math.log(1e6)  # int_X^inf log t / t^2 dt = (log X + 1)/X
tail = (math.log(1e6) + 1) / 1e6
g0 = float(mp.euler); g1 = float(mp.stieltjes(1))
Lam = g0 * g0 + 2 * g1 + S + tail
c2, c3 = consts()
res = dict(Lam=Lam, prime_sum_to_1e6=S, tail_estimate=tail, c2_sine=c2, c2_exact=math.pi ** 2 / 3, c3_sine=c3, rows=[], thresholds={})
def pref(c, c2, c3):
    Ic = float(mp.quad(lambda u: u * u * (1 + u) ** 2, [1, 1 / c]))
    return 2 * c3 * Ic * math.gamma(8 / 3) / (3 * (c2 / 3) ** (8 / 3))
for c in (0.72, 0.8980208880762339): res['thresholds'][str(c)] = dict(prefactor_sine=pref(c, c2, c3))
for E in (1e3, 1e4, 1e5, 1e6, 4.3e6, 1.4e7, 2.5e7, 3.7e7, 1e9, 1e12):
    n = math.log(E / (2 * math.pi)) / math.sqrt(12 * Lam); a2, a3 = consts(mp.mpf(n))
    res['rows'].append(dict(E=E, N_eff=n, c2_ratio=a2 / c2, c2_first_order=1 - 1 / n ** 2, c3_ratio=a3 / c3, prefactor_072=pref(0.72, a2, a3), prefactor_ratio_072=pref(0.72, a2, a3) / pref(0.72, c2, c3)))
json.dump(res, open(sys.argv[1], 'w'), indent=1); print(json.dumps(res, indent=1))
