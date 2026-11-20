"""Combination 1 table: for each truncated object, the first omitted index n* with c(n*) != 0, log n*, the measured crossing
bracket (last positive / first negative support), and the offset of the bracket from log n*.
usage: crossing_table.py outdir N"""
import sys, json, glob, math, os
sys.argv_saved = sys.argv
from wlib import *
setprec(128)
D = sys.argv[1]; N = int(sys.argv[2])
K = 40
def chi_table(Dd):
    q = abs(Dd)
    tabs = {-3: [0, 1, -1], -4: [0, 1, 0, -1], 5: [0, 1, -1, -1, 1], -7: [0, 1, 1, -1, 1, -1, -1]}
    if Dd in tabs: return tabs[Dd]
    qr = {(x * x) % q for x in range(1, q)}
    return [0] + [1 if x in qr else -1 for x in range(1, q)]
def monoid(n, S):
    for p in S:
        while n % p == 0: n //= p
    return n == 1
def pp_in(n, S):
    pk = primepower(n); return bool(pk and pk[0] in S)
base = {'ZETA': coef_zeta(K), 'DH': coef_dh(K), 'X5C': coef_chi(K, [0, 1, 0, 0, -1])}
for Dd in (-3, 5, -7, 13): base['CHI%d' % Dd] = coef_chi(K, chi_table(Dd))
for q in (2, 3):
    for c in ('2.2', '1.0'): base['TNR-q%d-c%s' % (q, c)] = coef_tnr(K, q, c)
rows = {}
for f in glob.glob(os.path.join(D, 'sup_*.json')):
    rows[float(f.split('sup_')[1][:-5])] = json.load(open(f))['obj']
sup = sorted(rows)
def lam(key, s):
    r = rows[s].get(key)
    if r is None: return None
    return float(r['both']) if 'both' in r else min(float(r['even']), float(r['odd']))
def bracket(key):
    prev = None
    for s in sup:
        v = lam(key, s)
        if v is None: return None
        if v < 0: return (prev, s, v)
        prev = s
    return (prev, None, None)
print('| object | kept indices | first omitted n* with c(n*) != 0 | c(n*) | log n* | last positive 2a | first negative 2a | offset of the bracket from log n* | lambda_min of the untruncated form at the last positive support |')
print('|---|---|---|---|---|---|---|---|---|')
specs = [('ZETA-S2', 'ZETA', [2], monoid), ('ZETA-S23', 'ZETA', [2, 3], monoid), ('ZETA-S235', 'ZETA', [2, 3, 5], monoid), ('ZETA-S2357', 'ZETA', [2, 3, 5, 7], monoid)]
for b in ('CHI-3', 'CHI5', 'CHI-7', 'CHI13', 'X5C'):
    specs += [('%s-S2' % b, b, [2], monoid), ('%s-S23' % b, b, [2, 3], monoid), ('%s-S235' % b, b, [2, 3, 5], monoid)]
specs += [('DH-S2', 'DH', [2], monoid), ('DH-S23pp', 'DH', [2, 3], pp_in), ('DH-S23', 'DH', [2, 3], monoid), ('DH-S237', 'DH', [2, 3, 7], monoid), ('DH-pp', 'DH', [2, 3, 5, 7, 11, 13], pp_in)]
for b in ('TNR-q2-c2.2', 'TNR-q2-c1.0', 'TNR-q3-c2.2', 'TNR-q3-c1.0'):
    specs += [('%s-S2' % b, b, [2], monoid), ('%s-S23' % b, b, [2, 3], monoid)]
for nm, b, S, rule in specs:
    c = base[b]
    nstar = next((n for n in range(2, K) if not rule(n, S) and abs(float(c[n].mid())) > 1e-30), None)
    key = '%s|pf|%d' % (nm, N); br = bracket(key)
    if br is None: continue
    lo, hi, v = br
    ln = math.log(nstar)
    kept = ('monoid <%s>' if rule is monoid else 'prime powers of %s') % ','.join(map(str, S))
    off = 'no sign change up to %.3f' % sup[-1] if hi is None else '(%+.4f, %+.4f]' % (lo - ln, hi - ln)
    bl = lam('%s|pf|%d' % (b, N), lo) if lo is not None else None
    print('| %s | %s | %d | %+.4f | %.4f | %s | %s | %s | %s |' % (nm, kept, nstar, float(c[nstar].mid()), ln, '-' if lo is None else '%.4f' % lo, '-' if hi is None else '%.4f' % hi, off, '-' if bl is None else '%.2e' % bl))
