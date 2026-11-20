# Combination 2, Riesz sums: R_c(x) x^(-1/4) on the grid 10^(j/8); exponents of block suprema; T-NR from R(x/9^k).
import json, math, numpy as np
R = np.loadtxt('riesz_2e9.txt'); x = R[:, 0]; tot = R[:, 2:6] + R[:, 7:11]; hs = R[:, 6]
lx = np.log(x)
class _K(dict):
    def __getitem__(self, v):
        i = int(np.argmin(np.abs(lx - math.log(v)))); assert abs(lx[i] - math.log(v)) < 1e-5, v; return i
key = _K()
round = lambda v, n=0: v
grid = [10**(j/8) for j in range(8, 8*13 + 1)]
def fit(xs, ys, lo=1e7):
    xs = np.array(xs); ys = np.abs(np.array(ys)); s = xs >= lo
    # suprema over blocks of one decade (8 points), then slope
    b = np.minimum(np.floor(np.log10(xs[s]) + 1e-9).astype(int), 12); ub = np.unique(b); sup = np.array([ys[s][b == u].max() for u in ub])
    sl, ic = np.polyfit(ub*math.log(10), np.log(sup), 1); return float(sl), [float(v) for v in sup]
out = {}
gi = [key[round(g, 3)] for g in grid]; gx = x[gi]
for c, nm in enumerate(['zeta', 'L(chi_-4)', 'L(chi_-3)', 'Liouville twist (|mu|)']):
    y = tot[gi, c]; sl, sup = fit(gx, y); out[nm] = dict(exponent=sl, sup_by_decade=sup, max_norm_quarter=float(np.abs(y/gx**0.25)[gx >= 1e3].max()))
y = hs[gi]; sl, sup = fit(gx, y); out['hash sign twist'] = dict(exponent=sl, sup_by_decade=sup, max_norm_quarter=float(np.abs(y/gx**0.25)[gx >= 1e3].max()), note='no tail correction (no closed value at infinity); tail <= 1.3e-4 x^(1/4)')
c_ = 2.2; q = 3; h = [1.0, -c_*math.sqrt(q)]
for k in range(2, 40): h.append(-c_*math.sqrt(q)*h[-1] - q*h[-2])
tn = []
for g in grid:
    yv = g; k = 0; s = 0.0
    while yv >= 9:
        s += h[k]*tot[key[round(yv, 3)], 0]; yv /= 9; k += 1
    # remaining argument yv in [1, 9): R(yv) evaluated directly (series converges fast for small argument)
    r = sum((-1)**(j + 1)*yv**j/math.factorial(j - 1)/float(__import__('mpmath').zeta(2*j)) for j in range(1, 60)); s += h[k]*r
    tn.append(s)
sl, sup = fit(grid, tn); out['T-NR(3, 2.2)'] = dict(exponent=sl, sup_by_decade=sup, predicted=0.5*(0.5 + math.acosh(1.1)/math.log(3)))
for fn, nm, pred in (('dh_1e9.riesz', 'DH', None), ('ea25_1e9.riesz', 'E_a, a=1/4', 0.375), ('ea125_1e9.riesz', 'E_a, a=1/8', 0.3125)):
    D = np.loadtxt(fn); ld = np.log(D[:, 0]); ii = [int(np.argmin(np.abs(ld - math.log(g)))) for g in grid if np.abs(ld - math.log(g)).min() < 1e-5]
    xx = D[ii, 0]; y = D[ii, 2] + D[ii, 3]; sl, sup = fit(xx, y); out[nm] = dict(exponent=sl, sup_by_decade=sup, predicted=pred, max_norm_quarter=float(np.abs(y/xx**0.25)[xx >= 1e3].max()), capped_from=float(D[D[:, 1] == 1, 0].min()) if (D[:, 1] == 1).any() else None)
for k, v in out.items(): print('%-26s exponent of decade suprema (x >= 1e7): %.3f  %s  sup last decades %s' % (k, v['exponent'], {a: b for a, b in v.items() if a in ('predicted', 'max_norm_quarter')}, ['%.3g' % s for s in v['sup_by_decade'][-3:]]))
json.dump(out, open('riesz_an.json', 'w'), indent=1)
