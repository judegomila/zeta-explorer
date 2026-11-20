"""Tables for combinations 1 and 3 from ladder.py outputs. usage: analyze_ladder.py outdir N [fitmax]"""
import sys, json, glob, math, os
import numpy as np
D = sys.argv[1]; N = int(sys.argv[2]); FITMAX = float(sys.argv[3]) if len(sys.argv) > 3 else 2.0
rows = {}
for f in glob.glob(os.path.join(D, 'sup_*.json')):
    d = json.load(open(f)); rows[float(f.split('sup_')[1][:-5])] = d['obj']
sup = sorted(rows)
def lam(nm, variant, s, Ns=None):
    if s not in rows: return None
    r = rows[s].get('%s|%s|%d' % (nm, variant, Ns or N))
    if r is None: return None
    if 'both' in r: return float(r['both'])
    return min(float(r['even']), float(r['odd']))
def crossing(nm, variant='pf', Ns=None):
    """first sign change on the support grid (linear interpolation in 2a); (last positive support, first negative support, interpolated)"""
    prev = None
    for s in sup:
        v = lam(nm, variant, s, Ns)
        if v is None: continue
        if v < 0:
            if prev is None: return (None, s, None)
            s0, v0 = prev
            return (s0, s, s0 + (s - s0) * v0 / (v0 - v))
        prev = (s, v)
    return (prev[0] if prev else None, None, None)
names = sorted({k.split('|')[0] for k in rows[sup[0]]})
out = []
P = out.append
P('## Crossings (first sign change of lambda_min on the support grid, N = %d)\n' % N)
P('| object | variant | last positive 2a | first negative 2a | interpolated crossing |')
P('|---|---|---|---|---|')
for nm in names:
    for variant in ('pf', 'full'):
        if '%s|%s|%d' % (nm, variant, N) not in rows[sup[0]]: continue
        a, b, c = crossing(nm, variant)
        P('| %s | %s | %s | %s | %s |' % (nm, variant, '-' if a is None else '%.4f' % a, 'none <= %.2f' % sup[-1] if b is None else '%.4f' % b, '-' if c is None else '%.4f' % c))
P('\n## N-ladder of the crossing (nested Legendre blocks)\n')
Ns = sorted({int(k.split('|')[2]) for k in rows[sup[0]] if k.startswith('ZETA-S2|pf|')})
P('| N | ' + ' | '.join(['ZETA-S2 crossing', 'ZETA-S2 lambda_min at 2a = ln 3', 'ZETA-S23 crossing', 'DH-S2 crossing']) + ' |')
P('|---|---|---|---|---|')
ln3 = min(sup, key=lambda s: abs(s - math.log(3)))
for n_ in Ns:
    c1 = crossing('ZETA-S2', 'pf', n_); c2 = crossing('ZETA-S23', 'pf', n_); c3 = crossing('DH-S2', 'pf', n_)
    P('| %d | %s | %.6f | %s | %s |' % (n_, '%.5f' % c1[2] if c1[2] else '-', lam('ZETA-S2', 'pf', ln3, n_), '%.5f' % c2[2] if c2[2] else '-', '%.5f' % c3[2] if c3[2] else '-'))
grid = [s for s in sup if abs(s * 20 - round(s * 20)) < 1e-9]
P('\n## Coercivity law: fit log10 lambda_min = alpha e^{2a} + beta on 1.0 <= 2a <= %.2f (0.05 grid, positive values only)\n' % FITMAX)
P('| object | variant | points | alpha | beta | rms residual | first negative 2a | lambda_min at 2a = 1.0 | at 1.5 | at 2.0 | at 2.6 |')
P('|---|---|---|---|---|---|---|---|---|---|---|')
fits = {}
for nm in names:
    for variant in ('pf', 'full'):
        if '%s|%s|%d' % (nm, variant, N) not in rows[sup[0]]: continue
        xs = []; ys = []
        for s in grid:
            v = lam(nm, variant, s)
            if v is None or v <= 0: break
            if s <= FITMAX + 1e-9: xs.append(math.exp(s)); ys.append(math.log10(v))
        a, b, c = crossing(nm, variant)
        if len(xs) >= 4:
            A = np.polyfit(xs, ys, 1); rms = float(np.sqrt(np.mean((np.polyval(A, xs) - np.array(ys)) ** 2)))
            fits[(nm, variant)] = (A[0], A[1], rms, len(xs))
            fs = '%d | %.3f | %.2f | %.2f' % (len(xs), A[0], A[1], rms)
        else: fs = '%d | - | - | -' % len(xs)
        def g(s):
            v = lam(nm, variant, s); return '-' if v is None else '%.2e' % v
        P('| %s | %s | %s | %s | %s | %s | %s | %s |' % (nm, variant, fs, 'none' if b is None else '%.4f' % b, g(1.0), g(1.5), g(2.0), g(2.6)))
P('\n## N-convergence of lambda_min (ZETA pole-free) on the 0.05 grid\n')
Nz = sorted({int(k.split('|')[2]) for k in rows[sup[0]] if k.startswith('ZETA|pf|')})
P('| 2a | ' + ' | '.join('N = %d' % n_ for n_ in Nz) + ' |'); P('|---|' + '---|' * len(Nz))
for s in grid:
    if abs(s * 5 - round(s * 5)) < 1e-9: P('| %.2f | ' % s + ' | '.join(('-' if lam('ZETA', 'pf', s, n_) is None else '%.3e' % lam('ZETA', 'pf', s, n_)) for n_ in Nz) + ' |')
json.dump({'fits': {'%s|%s' % k: v for k, v in fits.items()}}, open(os.path.join(D, 'fits.json'), 'w'), indent=1)
open(os.path.join(D, 'tables.md'), 'w').write('\n'.join(out) + '\n')
print('\n'.join(out))
