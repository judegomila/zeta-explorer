#!/usr/bin/env python3
"""NWM row: m(s) = 1 + R(s), R = g(z) + g(-z), g(z) = int_0^inf e^(z r) r^(-r) dr, z = -4i(s - 1/2). mpmath, 30 digits."""
import mpmath as mp, json, math, random
from multiprocessing import Pool
mp.mp.dps = 30
def g(z):
    return mp.quad(lambda r: mp.exp(z * r - r * mp.log(r)) if r > 0 else mp.mpf(1), [0, 1, 5, 20, 60, 150, 400, 1000])
def task(t):
    out = []
    for j in range(4, 19):
        d = mp.mpf(2) ** (-j)
        z = -4j * (d + 1j * mp.mpf(t))
        out.append(float(mp.log(abs(1 + g(z) + g(-z)))))
    return t, out
if __name__ == '__main__':
    rnd = random.Random(20261120)
    ts = [rnd.uniform(0, 1.2) for _ in range(200)]
    with Pool(4) as P: res = P.map(task, ts)
    js = list(range(4, 19)); x = [j * math.log(2) for j in js[-11:]]; xm = sum(x) / 11
    den = sum((a - xm) ** 2 for a in x)
    betas = [sum((a - xm) * y for a, y in zip(x, ys[-11:])) / den for t, ys in res]
    S = dict(name='NWM', n=200, beta_min=min(betas), beta_max=max(betas), frac_int=sum(abs(b - round(b)) <= 0.02 for b in betas) / 200,
             y_last_min=min(ys[-1] for t, ys in res), y_last_max=max(ys[-1] for t, ys in res),
             max_abs_y_change_over_window=max(abs(ys[-1] - ys[-11]) for t, ys in res))
    json.dump(dict(summary=S, rows=res), open('nwm_out.json', 'w'))
    print(json.dumps(S))
