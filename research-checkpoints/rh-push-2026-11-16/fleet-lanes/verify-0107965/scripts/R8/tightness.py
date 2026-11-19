#!/usr/bin/env python3
"""R8: where is (84) tight? argv[1] = plan JSON. Own code, mpmath."""
import sys, json
from mpmath import mp, mpf, mpc, sqrt, diff, factorial, findroot
mp.dps = 40
plan = json.load(open(sys.argv[1]))
def F(x):
    a, _, b = x.partition('/'); return mpf(int(a)) / mpf(int(b or 1))
def K(h, d, b): return -(1 / mpc(d, h - b) + 1 / mpc(d, h + b)).imag
def make_R(row):
    nodes = [(F(n['height']), F(n['shift']), F(n['weight'])) for n in row['nodes']]
    ov = row.get('joint_jet_overlay'); alpha = F(ov['alpha']) if ov else mpf(1)
    cents = [(F(c['p']), [F(x) for x in c['b']]) for c in ov['centres']] if ov else []
    def R(d, b):
        tot = sum(w / 2 * (K(h, d + v, b) + K(h, d - v, b)) for h, v, w in nodes) * alpha
        for p, bs in cents:
            for r, br in enumerate(bs):
                if br: tot += 2 * br * p ** (r - 1) / factorial(r) * (K(p, d, b) if r == 0 else diff(lambda hh: K(hh, d, b), p, r))
        return tot
    return R
for idx in range(67):
    row = plan['rows'][idx]; cap = F(row['q_interval'][1]); R = make_R(row)
    g = lambda d, q: 1 - (d * d + 4 * q) * R(d, sqrt(q)) / 4
    ds = [mpf(10) ** (mpf(k) / 20) for k in range(-40, 81)]
    best = min((g(d, cap), d) for d in ds)
    over = min(g(d, cap * mpf('1.05')) for d in ds)
    half = min(g(d, cap / 2) for d in ds)
    print(idx, 'min over d at q=cap: %.3e at d=%.2f | q=cap/2: %.3e | q=1.05cap: %.3e' % (best[0], best[1], half, over), flush=True)
