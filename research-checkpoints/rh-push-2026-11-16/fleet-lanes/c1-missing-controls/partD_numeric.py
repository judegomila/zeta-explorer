"""Part D illustration (MEASURED, not evidence for unboundedness: the growth is sqrt(log log T)):
   D_a(t) = S(t) - (1/pi) arg zeta(1/2+a+it) on t in [1000,1300], step 0.1; arg by horizontal continuation from sigma = 2.
   S(t) = N(t) - 1 - theta(t)/pi with N from the first 900 zeros (all on the line). Planned allocation < 10 MB."""
import json, math, bisect
import mpmath as mp
mp.mp.dps = 15
zz = json.load(open('zeta_zeros_900.json'))
AS = [0.05, 0.1, 0.25, 0.5]
path = [2.0, 1.6, 1.3, 1.1, 1.0, 0.9, 0.8, 0.75, 0.7, 0.65, 0.6, 0.575, 0.55]
def args_at(t):
    out = {}; prev = None; acc = 0.0
    for sg in path:
        v = mp.zeta(mp.mpc(sg, t)); a = float(mp.arg(v))
        if prev is None: acc = a
        else:
            d = a - prev
            while d > math.pi: d -= 2 * math.pi
            while d < -math.pi: d += 2 * math.pi
            acc += d
        prev = a; out[sg] = acc
    return out
rows = []
t = 1000.05
while t < 1300:
    S = bisect.bisect_right(zz, t) - 1 - float(mp.siegeltheta(t)) / math.pi
    ar = args_at(t)
    rows.append((t, S, [ar[0.5 + a] / math.pi for a in AS]))
    t += 0.1
n = len(rows)
def stats(v): m = sum(v) / n; return m, sum((x - m) ** 2 for x in v) / n, max(abs(x) for x in v)
res = {'points': n, 'window': [1000, 1300]}
mS, vS, xS = stats([r[1] for r in rows]); res['S'] = dict(mean=mS, var=vS, maxabs=xS)
primes = [p for p in range(2, 1300) if all(p % q for q in range(2, int(p ** 0.5) + 1))]
for i, a in enumerate(AS):
    sg = 0.5 + a
    m1, v1, x1 = stats([r[2][i] for r in rows])
    D = [r[1] - r[2][i] for r in rows]; m2, v2, x2 = stats(D)
    pred = sum((p ** (-k / 2) - p ** (-k * sg)) ** 2 / k ** 2 for p in primes for k in range(1, 12) if p ** k <= 1300) / (2 * math.pi ** 2)
    pred_inf = sum(p ** (-2 * sg) for p in primes) / (2 * math.pi ** 2)
    res['a=%g' % a] = dict(S_sigma=dict(mean=m1, var=v1, maxabs=x1), D=dict(mean=m2, var=v2, maxabs=x2, min=min(D), max=max(D)),
                           prime_model_var_D_x_le_1300=pred, prime_model_var_S_sigma_p_le_1300=pred_inf)
    print('a=%g' % a, json.dumps(res['a=%g' % a]), flush=True)
print('S', res['S'])
json.dump(res, open('partD_numeric.json', 'w'), indent=1)
