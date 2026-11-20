import numpy as np, json
from levinson import best, cval
from scipy.optimize import brentq
out = {}
thetas = [0.5, 17/33, 6/11, 4/7, 0.6, 2/3, 0.75, 7/8, 1, 1.5, 2, 3, 5, 10, 30, 100]
for th in thetas:
    row = {}
    for deg in (1, 2, 3, 5):
        v, p = best(th, deg, starts=6)
        row[deg] = (float(v), [float(t) for t in p])
    out[str(th)] = row
    print("theta=%8.4f  linQ=%.6f  degQ3=%.6f  degQ5=%.6f  degQ9=%.6f (R=%.4f, lam=%.4f)" %
          (th, row[1][0], row[2][0], row[3][0], row[5][0], row[5][1][0], cval(row[5][1][1:], row[5][1][0], th)[1]), flush=True)
json.dump(out, open("achieved_table.json", "w"), indent=1)
# thresholds: smallest theta with one-piece value >= target (degQ9)
for target in (5/12, 0.5, 2/3, 0.9):
    f = lambda th: best(th, 3, starts=4)[0] - target
    print("target %.5f: theta ~ %.4f" % (target, brentq(f, 0.5, 60, xtol=1e-3)), flush=True)
