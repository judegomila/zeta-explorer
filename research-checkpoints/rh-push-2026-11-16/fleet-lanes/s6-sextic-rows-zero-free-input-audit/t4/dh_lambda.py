"""dh_lambda.py -- coefficients Lambda_DH(n) of -F'/F for Davenport-Heilbronn, n <= N: support and growth.
a(n) log n = sum_{d | n} Lambda_F(d) a(n/d).  Reports the first n that is not a prime power with Lambda_F(n) != 0,
block maxima of |Lambda_F(n)| (dyadic) with the fitted growth exponent, and the size of the weighted sums at the abscissae of the lane."""
import sys, math, json, numpy as np
N = int(float(sys.argv[1])); K = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
n = np.arange(N + 1); a = np.array([0.0, 1.0, K, -K, -1.0])[n % 5]
c = a * np.log(np.maximum(n, 1))
for d in range(2, N // 2 + 1):
    if c[d] != 0.0: c[2 * d::d] -= c[d] * a[2:N // d + 1]
spf = np.zeros(N + 1, np.int64)
for i in range(2, N + 1):
    if spf[i] == 0: spf[i::i] = np.where(spf[i::i] == 0, i, spf[i::i])
def is_pp(v):
    p = int(spf[v])
    while v % p == 0: v //= p
    return v == 1
first = next(int(v) for v in range(2, N + 1) if abs(c[v]) > 1e-12 and not is_pp(v))
blocks = []; k = 4
while 2 ** (k + 1) <= N:
    seg = np.abs(c[2 ** k:2 ** (k + 1)]); blocks.append((2 ** k, float(seg.max()), float(np.sqrt(np.mean(seg ** 2))))); k += 1
xs = np.log([b[0] for b in blocks]); ys = np.log([b[1] for b in blocks]); yr = np.log([b[2] for b in blocks])
h = len(xs) // 2
out = dict(N=N, first_non_prime_power=first, value=float(c[first]), growth_exp_max=float(np.polyfit(xs[h:], ys[h:], 1)[0]), growth_exp_rms=float(np.polyfit(xs[h:], yr[h:], 1)[0]),
           blocks=blocks, sums={})
lg = np.log(np.maximum(n, 1)); w = np.maximum(1 - lg / math.log(N), 0)
for q in (0.5625, 0.16, 0.01):
    sg = 0.5 + math.sqrt(q) / 2
    out['sums'][str(q)] = dict(sigma=sg, sum_abs=float(np.sum(np.abs(c[1:]) * w[1:] * n[1:] ** -sg)), rms=float(np.sqrt(np.sum(np.abs(c[1:]) ** 2 * w[1:] ** 2 * n[1:] ** (-2 * sg)))))
print(json.dumps(out)); json.dump(out, open(__file__.replace('dh_lambda.py', f'dh_lambda_{N:.0e}.json'), 'w'))
