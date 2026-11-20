"""Combination 3 table: lambda_min(2a) on the 0.05 grid for the untruncated objects, fits of log10 lambda_min = alpha e^{2a} + beta,
conductor-scaled slope, first negative support. Merges several output directories (later directories fill supports missing in
earlier ones). usage: law_table.py dir:N [dir:N ...]"""
import sys, json, glob, math, os
import numpy as np
rows = {}
for spec in sys.argv[1:]:
    D, N = spec.split(':')
    for f in glob.glob(os.path.join(D, 'sup_*.json')):
        s = round(float(f.split('sup_')[1][:-5]), 6)
        if s not in rows: rows[s] = (json.load(open(f))['obj'], int(N))
sup = sorted(rows)
def lam(nm, variant, s):
    o, N = rows[s]
    r = o.get('%s|%s|%d' % (nm, variant, N))
    if r is None: return None
    return float(r['both']) if 'both' in r else min(float(r['even']), float(r['odd']))
grid = [s for s in sup if abs(s * 20 - round(s * 20)) < 1e-6 and s >= 1.0 - 1e-9]
OBJ = [('ZETA', 'pf', 1, 'even, pole projected out'), ('ZETA', 'full', 1, 'even, with pole'), ('CHI-3', 'pf', 3, 'odd'), ('CHI-4', 'pf', 4, 'odd'), ('CHI5', 'pf', 5, 'even'), ('CHI-7', 'pf', 7, 'odd'),
       ('CHI8', 'pf', 8, 'even'), ('CHI-8', 'pf', 8, 'odd'), ('CHI-11', 'pf', 11, 'odd'), ('CHI12', 'pf', 12, 'even'), ('CHI13', 'pf', 13, 'even'),
       ('X5C', 'pf', 5, 'odd; L(chi) with chi mod 5 complex, real tests'), ('DH', 'pf', 5, 'odd; no Euler product'), ('DH-pp', 'pf', 5, 'DH with composite-index coefficients removed'),
       ('TNR-q2-c1.0', 'full', 4, 'zeros on the line'), ('TNR-q3-c1.0', 'full', 9, 'zeros on the line'), ('TNR-q2-c2.2', 'full', 4, 'zeros off the line'), ('TNR-q3-c2.2', 'full', 9, 'zeros off the line'),
       ('SGN-LIOU', 'pf', 1, 'no functional equation'), ('SGN-FLIP2', 'pf', 1, 'no functional equation'), ('SGN-FLIP3', 'pf', 1, 'no functional equation'), ('U-A', 'pf', 1, 'no functional equation'), ('WT', 'pf', 1, 'zeta(s + i alpha) in zeta\'s form'), ('DHcoef-ZETAarch', 'pf', 1, 'DH coefficients, zeta gamma factor')]
def fit(nm, variant, lo, hi):
    xs = []; ys = []
    for s in grid:
        v = lam(nm, variant, s)
        if v is None or v <= 0: break
        if lo - 1e-9 <= s <= hi + 1e-9: xs.append(math.exp(s)); ys.append(math.log10(v))
    if len(xs) < 4: return None
    A, cov = np.polyfit(xs, ys, 1, cov=True)
    return A[0], A[1], math.sqrt(cov[0, 0]), math.sqrt(cov[1, 1]), len(xs)
def first_neg(nm, variant):
    prev = None
    for s in sup:
        v = lam(nm, variant, s)
        if v is None: continue
        if v < 0: return prev, s
        prev = s
    return prev, None
print('| object | form | conductor q | fit 1.0..2.0: alpha (s.e.) | beta (s.e.) | alpha q | fit 1.4..2.0: alpha | beta | alpha q | first negative 2a (last positive) |')
print('|---|---|---|---|---|---|---|---|---|---|')
for nm, variant, q, note in OBJ:
    if lam(nm, variant, grid[0]) is None: continue
    f1 = fit(nm, variant, 1.0, 2.0); f2 = fit(nm, variant, 1.4, 2.0)
    lp, fn = first_neg(nm, variant)
    c1 = '- | - | -' if f1 is None else '%.3f (%.3f) | %.2f (%.2f) | %.2f' % (f1[0], f1[2], f1[1], f1[3], f1[0] * q)
    c2 = '- | - | -' if f2 is None else '%.3f | %.2f | %.2f' % (f2[0], f2[1], f2[0] * q)
    print('| %s | %s; %s | %d | %s | %s | %s |' % (nm, variant, note, q, c1, c2, 'none up to %.2f' % sup[-1] if fn is None else '%.4f (%s)' % (fn, '-' if lp is None else '%.4f' % lp)))
print()
show = [('ZETA', 'pf'), ('ZETA', 'full'), ('CHI-3', 'pf'), ('CHI5', 'pf'), ('X5C', 'pf'), ('DH', 'pf'), ('CHI13', 'pf'), ('TNR-q3-c1.0', 'full'), ('TNR-q2-c2.2', 'full'), ('SGN-LIOU', 'pf'), ('U-A', 'pf')]
print('| 2a | N | ' + ' | '.join('%s %s' % x for x in show) + ' | zeta source law 10^(-4.82 e^{2a} + 12.1) |')
print('|---|---|' + '---|' * (len(show) + 1))
for s in grid:
    print('| %.2f | %d | ' % (s, rows[s][1]) + ' | '.join('%.2e' % lam(nm, v, s) for nm, v in show) + ' | %.2e |' % 10 ** (-4.82 * math.exp(s) + 12.1))
print()
print('| 2a = ln n | N | ZETA pf | source certified lower bound |')
print('|---|---|---|---|')
for n, src in ((4, '8.55e-8'), (5, '2.25e-12'), (6, '6.25e-17'), (11, '5.62e-42 (conditional)')):
    s = round(math.log(n), 6)
    s_ = min(sup, key=lambda x: abs(x - s))
    if abs(s_ - s) < 1e-5: print('| ln %d | %d | %.3e | %s |' % (n, rows[s_][1], lam('ZETA', 'pf', s_), src))
