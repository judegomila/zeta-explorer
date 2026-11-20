"""Checks of the statements entered in controls.json and LEAN_QUEUE.md by this lane (record lane; small exact/mpmath checks).
Planned memory: lists of length <= 8000 Fractions (< 5 MB)."""
import json, os, cmath, math
from fractions import Fraction as Fr
out = {}
HERE = os.path.dirname(os.path.abspath(__file__))
# 1. V6: Dirichlet convolution identity f * (1 + 6^-s) = 1 * (1 - 6^-s) exactly, n <= 7776; partial sums; non-multiplicativity
N = 7776
def v6(n):
    k = 0
    while n % 6 == 0:
        n //= 6; k += 1
    return k
f = [0] + [(-1) ** v6(n) for n in range(1, N + 1)]
ok = all(f[n] + (f[n // 6] if n % 6 == 0 else 0) == 1 - (1 if n % 6 == 0 else 0) for n in range(1, N + 1))
S = 0; dev = Fr(0)
for n in range(1, N + 1):
    S += f[n]; dev = max(dev, abs(Fr(S) - Fr(5 * n, 7)))
out['V6'] = dict(identity_f_conv_1plus6_eq_1_conv_1minus6=ok, f6=f[6], f2f3=f[2] * f[3], max_dev_partial_sums_5n_over_7=float(dev), N=N)
# log coefficients a_n = kappa(n) - l_f(n): l_f - l_zeta = -2 sum_{k odd} 6^{-ks}/k  <=> check exp: (1-x)/(1+x) = exp(-2 sum_{k odd} x^k/k) as power series to order 5
c = [Fr(0)] * 6; c[0] = Fr(1)
A = [Fr(0)] + [Fr(-2, k) if k % 2 else Fr(0) for k in range(1, 6)]
# exp of series A via recurrence n e_n = sum k a_k e_{n-k}
e = [Fr(1)] + [Fr(0)] * 5
for n in range(1, 6):
    e[n] = sum(k * A[k] * e[n - k] for k in range(1, n + 1)) / n
target = [Fr(1)] + [Fr(2 * (-1) ** k) for k in range(1, 6)]   # (1-x)/(1+x) = 1 + 2 sum (-1)^k x^k
out['V6']['log_series_matches_to_order_5'] = (e == target)
# 2. CYC: prod_{k<K} (1 + w^(2^k)) = (1 - w^(2^K))/(1 - w) exactly as polynomials (K = 6), and numerically at a point with |w| < 1
K = 6
poly = [1]
for k in range(K):
    m = 2 ** k
    new = [0] * (len(poly) + m)
    for i, a in enumerate(poly):
        new[i] += a; new[i + m] += a
    poly = new
out['CYC'] = dict(finite_product_is_all_ones_poly=(poly == [1] * (2 ** K)), K=K)
Q = 5.0; s = complex(0.5 + 1e-3, 3.7); w = Q ** (0.5 - s)
p = 1.0
for k in range(60):
    p *= (1 + w ** (2 ** k)) if abs(w) ** (2 ** k) > 1e-300 else 1
out['CYC']['abs_prod_times_1_minus_w_minus_1'] = abs(p * (1 - w) - 1); out['CYC']['abs_w'] = abs(w)
# rational log ratios; sparsity sum
out['CYC']['sum_log_q_pow_minus_half_60_terms'] = sum((2 ** k * math.log(Q)) ** -0.5 for k in range(60))
# 3. Lemma TS-1 (i): a_G(n) = 1 for n < P  iff  c(n) = 0 for 2 <= n < P, where zeta = G N. Test: N with c(1)=1, c(n)=0 for 2<=n<P, random beyond.
import random
rnd = random.Random(2026112201)
M = 400; P = 37
cN = [Fr(0)] * (M + 1); cN[1] = Fr(1)
for n in range(P, M + 1):
    cN[n] = Fr(rnd.randint(-3, 3), rnd.randint(1, 4))
# a_G from 1 = sum_{d|n} a_G(d) c(n/d)
aG = [Fr(0)] * (M + 1)
for n in range(1, M + 1):
    aG[n] = 1 - sum(aG[d] * cN[n // d] for d in range(1, n) if n % d == 0)
fwd = all(aG[n] == 1 for n in range(1, P)) and aG[P] == 1 - cN[P]
# converse: a_G = 1 below P, arbitrary beyond -> c(n) = 0 for 2 <= n < P
a2 = [Fr(0)] + [Fr(1)] * (P - 1) + [Fr(rnd.randint(-3, 3)) for _ in range(P, M + 1)]
c2 = [Fr(0)] * (M + 1)
for n in range(1, M + 1):
    c2[n] = 1 - sum(a2[d] * c2[n // d] for d in range(2, n + 1) if n % d == 0) if n > 1 else Fr(1)
# solve 1 = sum_{d|n} a2(d) c2(n/d): c2(n) = 1 - sum_{d|n, d>1} a2(d) c2(n/d)
conv = all(c2[n] == 0 for n in range(2, P))
out['TS1'] = dict(forward=fwd, converse=conv, P=P, M=M, c2_at_P=str(c2[P]), a2_at_P=str(a2[P]))
# 4. Lemma P0 inequality 1 - q^-delta <= delta log q, and Corollary A2-type constants: 1/(1 - 2^-1/2)
out['P0'] = dict(ineq_holds=all(1 - q ** (-d) <= d * math.log(q) for q in (2, 3, 101, 10007) for d in (1e-1, 1e-3, 1e-6)))
out['A_deg1_const'] = 1 / (1 - 2 ** -0.5)
# 5. Lemma E constants: zeta(2) - 1 < 1, -log(2 - zeta(2))
z2 = math.pi ** 2 / 6
out['E'] = dict(zeta2_minus_1=z2 - 1, bound=-math.log(2 - z2))
# 6. NR-q: q = 1 + sqrt2, threshold q^(1/2) + q^(-1/2); zero for c = 2.1
q = 1 + math.sqrt(2); thr = q ** 0.5 + q ** -0.5
b = math.acosh(2.1 / 2) / math.log(q)
out['NRq'] = dict(threshold=thr, zero_c_2p1=(0.5 + b, math.pi / math.log(q)), real_zero_c_minus_2p1=0.5 + b)
# 7. line 10: with abs(d) <= s, abs(abs(1+d)^2 - 1) <= 2s + s^2 (sharp at d = s)
smax = 0.0
for i in range(2000):
    r = rnd.random() * 0.5; th = rnd.random() * 2 * math.pi; s_ = r
    d = cmath.rect(rnd.random() * s_, th)
    smax = max(smax, abs(abs(1 + d) ** 2 - 1) - (2 * s_ + s_ * s_))
out['line10'] = dict(max_excess_over_2s_plus_s2=smax)
json.dump(out, open(os.path.join(HERE, 'checks.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
