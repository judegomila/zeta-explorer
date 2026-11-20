#!/usr/bin/env python3
"""analyse.py big.json -- exponent fits for the sieve-norm run (pure python)."""
import json, sys, math
d = json.load(open(sys.argv[1]))
def fit(xs, ys):
    n = len(xs); mx = sum(xs) / n; my = sum(ys) / n
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
for od in (6, 3, 2):
    print(f"=== order {od}")
    print(" r      K      nrows ncols  lam/nrows  lam2/nrows rand/nrows rqspan(conj g)/nrows  proj(conj g) proj(g) base")
    for r in sorted({x['r'] for x in d}):
        rows = sorted([x for x in d if x['order'] == od and x['r'] == r], key=lambda x: x['K'])
        for x in rows:
            nr = x['nrows']; key = 'conj_g%d' % od
            print(f" {r:<6} {x['K']:<6} {nr:<6}{x['ncols']:<6} {x['lam'][0]/nr:9.3f} {x['lam'][1]/nr:9.3f} {x['rand']/nr:9.3f}"
                  f" {x['rqspan_'+key]/nr:12.3f} {x['proj_'+key]:14.3f} {x['proj_g%d' % od]:8.3f} {math.sqrt(min(1, x['nclasses']/x['ncols'])):6.3f}")
        big = [x for x in rows if x['K'] >= 12500]
        if len(big) >= 3:
            lk = [math.log(x['K']) for x in big]
            s1 = fit(lk, [math.log(x['lam'][0]) for x in big])
            s2 = fit(lk, [math.log(x['lam'][1]) for x in big])
            sg = fit(lk, [math.log(x['rqspan_conj_g%d' % od]) for x in big])
            sn = fit(lk, [math.log(x['nrows']) for x in big])
            # excess over the bulk: lam - lam2
            ex = [x['lam'][0] - x['lam'][1] for x in big]
            se = fit(lk, [math.log(e) for e in ex]) if min(ex) > 0 else float('nan')
            print(f"   slope d log/d log K (K>=12500): lam1 {s1:.3f}  lam2 {s2:.3f}  gauss-span RQ {sg:.3f}  nrows {sn:.3f}  (lam1-lam2) {se:.3f}"
                  f"   | predictions: mean value 1, theta 5/6+r/3 = {5/6+r/3:.3f} (cubic 2(1+r)/3 = {2*(1+r)/3:.3f}), BGL (KD)^(2/3) = {2*(1+r)/3:.3f}")
