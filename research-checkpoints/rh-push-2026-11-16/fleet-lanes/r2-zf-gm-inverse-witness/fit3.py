#!/usr/bin/env python3
"""fit3.py big.json -- lam = a*(sqrt(nr)+sqrt(nc))^2 + b*X, global over r > 0.5 and K >= Kmin; X = nr^p nc^q.
Models: theta (5/6, 1/3), bgl (2/3, 2/3), none (b = 0); plus free (p, q) grid.  Relative least squares."""
import json, sys, math
d = json.load(open(sys.argv[1]))
def ls(rows, f, base):
    s11 = s12 = s22 = t1 = t2 = 0.0
    for x in rows:
        l = x['lam'][0]; u = base(x) / l; v = f(x) / l
        s11 += u * u; s12 += u * v; s22 += v * v; t1 += u; t2 += v
    det = s11 * s22 - s12 * s12
    a = (t1 * s22 - t2 * s12) / det; b = (s11 * t2 - s12 * t1) / det
    rms = math.sqrt(sum(((a * base(x) + b * f(x)) / x['lam'][0] - 1) ** 2 for x in rows) / len(rows))
    return a, b, rms
rand = lambda x: x['rand']
for Kmin in (3125, 12500):
  for od in (6, 3, 2):
    rows = [x for x in d if x['order'] == od and x['r'] > 0.5 and x['K'] >= Kmin]
    a0 = sum(rand(x) / x['lam'][0] for x in rows) / sum((rand(x) / x['lam'][0]) ** 2 for x in rows)
    r0 = math.sqrt(sum((a0 * rand(x) / x['lam'][0] - 1) ** 2 for x in rows) / len(rows))
    out = [f"none: a={a0:.3f} rms={100*r0:.2f}%"]
    for nm, (p, q) in (('theta', (5 / 6, 1 / 3)), ('bgl', (2 / 3, 2 / 3))):
        a, b, rms = ls(rows, lambda x: x['nrows'] ** p * x['ncols'] ** q, rand)
        out.append(f"{nm}: a={a:.3f} b={b:.4f} rms={100*rms:.2f}%")
    best = None
    for pi in range(0, 41):
        for qi in range(0, 41):
            p = pi * 0.025; q = qi * 0.025
            if abs(p - 0.5) < 1e-9 and abs(q - 0.5) < 1e-9: continue
            try: a, b, rms = ls(rows, lambda x: x['nrows'] ** p * x['ncols'] ** q, rand)
            except ZeroDivisionError: continue
            if a >= 0 and b >= 0 and (best is None or rms < best[0]): best = (rms, p, q, a, b)
    print(f"Kmin={Kmin} order {od} n={len(rows)}: " + " | ".join(out) + f" | free: p={best[1]:.3f} q={best[2]:.3f} a={best[3]:.3f} b={best[4]:.4f} rms={100*best[0]:.2f}%")
