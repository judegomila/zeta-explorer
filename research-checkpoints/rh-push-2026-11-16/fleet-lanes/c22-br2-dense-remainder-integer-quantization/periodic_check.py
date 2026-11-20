#!/usr/bin/env python3
"""Theorem E2 check (float64, numpy; screen): S_1 = {prime nearest e^k}, periodic phases theta_k = 2 pi s_(k mod M)/d.
Prediction at t = 2 pi a/b (b = 1 mod d, gcd(b, M) = 1): y * delta * b^2/pi^2 -> -beta_2,
beta_2 = mean over the period of B_2({s_r/d}), B_2(x) = x^2 - x + 1/6."""
import math, json, sys
import numpy as np
import common as C
small, k0 = C.small_set(1.0)
assert len(small) == k0 - 1
CUT = 40.0
def B2(x): x = x % 1.0; return x * x - x + 1.0 / 6
pats = {'plus': (1, [0]), 'minus': (2, [1]), 'alt(+,-)': (2, [0, 1]), '(+,-,-)': (2, [0, 1, 1]), '(+,+,-)': (2, [0, 0, 1]),
        'cubic(0,1,2)/3': (3, [0, 1, 2]), 'quartic(0,1,1,3)/4': (4, [0, 1, 1, 3])}
rats = [(0, 1), (1, 1), (1, 5), (2, 7), (3, 13), (5, 49)]
out = []
for name, (d, s) in pats.items():
    M = len(s); b2 = sum(B2(x / d) for x in s) / M
    for (a, b) in rats:
        if b % d != 1 % d or math.gcd(b, M) != 1: continue
        t = 2 * math.pi * a / b
        row = []
        for j in (12, 16, 20):
            dl = 2.0 ** -j; K = int(CUT * 2 ** j) + 1; y = 0.0
            for lo in range(1, K, 4000000):
                k = np.arange(lo, min(lo + 4000000, K))
                lam = k.astype(np.float64)
                m = k < k0
                lam[m] = np.log(np.array([small[i - 1] for i in k[m]], dtype=np.float64))
                th = 2 * math.pi * np.array(s, dtype=np.float64)[(k - 1) % M] / d   # phase of the k-th prime: s_((k-1) mod M)
                phi = th - lam * t
                r = np.exp(-lam * dl); om = -np.expm1(-lam * dl)
                y += 0.5 * np.log(om * om + 4 * r * np.sin(0.5 * phi) ** 2).sum()
            row.append((j, y, y * dl * b * b / math.pi ** 2))
        print('%-20s beta_2 = %+.6f  a/b = %d/%d  ' % (name, b2, a, b) + '  '.join('j=%d: y=%.2f, y d b^2/pi^2 = %+.6f' % x for x in row), flush=True)
        out.append(dict(pattern=name, d=d, s=s, beta2=b2, a=a, b=b, rows=row))
json.dump(out, open('out/periodic_check.json', 'w'))
