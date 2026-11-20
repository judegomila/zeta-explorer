import numpy as np, math, json
import predict as P
K, _ = P.kernel('psi_48.json'); LAM = 1.5731510713
old = [[6.99, -0.8485, 0.0154], [7.96, -0.8843, 0.0095], [9.00, -0.8981, 0.0056], [10.01, -0.9135, 0.0034], [10.74, -0.9329, 0.0033],
       [11.26, -0.9346, 0.0029], [11.67, -0.9400, 0.0029], [11.98, -0.9414, 0.0027]]
new = sorted([[s['L'], s['Q'], s['Qerr'], s['n'], s['V'], s['Verr'], s['T']] for s in map(json.loads, open('out/qstat.jsonl'))])
rows = []
for L, Q, e, *rest in [o + [0, 0, 0, 0] for o in old] + new:
    p = P.predict(L, K); rows.append((L, Q + 1, e, p))
    print('L=%7.3f  Q+1=%.5f+-%.5f  c=%.4f+-%.4f  formula=%.5f (c=%.4f)  meas/formula=%.3f %s' % (L, Q + 1, e, (Q + 1) * L * L / (12 * LAM), e * L * L / (12 * LAM), p, p * L * L / (12 * LAM), (Q + 1) / p, ('n=%d V=%.5f+-%.5f T=%.4g' % (rest[0], rest[1], rest[2], rest[3])) if rest[0] else ''))
def chi_const(rs):
    x = np.array([12 * LAM / r[0] ** 2 for r in rs]); y = np.array([r[1] for r in rs]); s = np.array([r[2] for r in rs])
    c = np.sum(x * y / s ** 2) / np.sum(x * x / s ** 2); return c, 1 / math.sqrt(np.sum(x * x / s ** 2)), float(np.sum(((y - c * x) / s) ** 2))
def chi_shape(rs):
    x = np.array([r[3] for r in rs]); y = np.array([r[1] for r in rs]); s = np.array([r[2] for r in rs])
    a = np.sum(x * y / s ** 2) / np.sum(x * x / s ** 2); return a, 1 / math.sqrt(np.sum(x * x / s ** 2)), float(np.sum(((y - a * x) / s) ** 2))
for lab, rs in [('all %d points' % len(rows), rows), ('new points only (%d)' % len(new), rows[len(old):]), ('old 8 bins', rows[:len(old)])]:
    c, ce, x2 = chi_const(rs); a, ae, x2s = chi_shape(rs)
    x2f = float(sum(((r[1] - r[3]) / r[2]) ** 2 for r in rs))
    print('%s: constant-c fit c=%.4f+-%.4f chi2=%.1f | formula x free normalisation a=%.4f+-%.4f chi2=%.1f | formula as is chi2=%.1f' % (lab, c, ce, x2, a, ae, x2s, x2f))
