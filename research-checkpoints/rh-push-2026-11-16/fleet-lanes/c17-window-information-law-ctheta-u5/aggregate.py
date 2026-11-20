"""Text processing of the unit logs (JSON lines) into tables.txt. No numerics beyond closed-form reference values."""
import json, math, os, sys, glob, statistics
HERE = os.path.dirname(os.path.abspath(__file__))
def rows(pattern):
    out = []
    for p in sorted(glob.glob(os.path.join(HERE, 'logs', pattern))):
        for l in open(p):
            if l.startswith('{'):
                out.append(json.loads(l))
    return out
def root(fn, lo, hi):
    for _ in range(200):
        m = (lo + hi) / 2
        if fn(m): lo = m
        else: hi = m
    return lo
L = []
A2 = [r for r in rows('*testA2*.log') if 'xs' in r]
A = [r for r in rows('*testA*.log') if 'kappa' in r and r['A'] is not None]
L.append('TEST A (scale-free; u = 1; A = u b; tight background c u; ball arithmetic, exact criterion)')
for c in sorted(set(r['c'] for r in A), reverse=True):
    one = root(lambda a: math.sinh(a) / a <= 1 + c, 1e-9, 50)
    L.append('c = %g   one-pair closed form A = %.4f' % (c, one))
    ks = sorted(set(r['kappa'] for r in A)); ps = sorted(set(r['p'] for r in A))
    L.append('  n | ' + ' | '.join('k=%.2f p=%d' % (k, p) for k in ks for p in ps) + ' | best | best/n')
    for n in sorted(set(r['n'] for r in A)):
        cells, best = [], 0
        for k in ks:
            for p in ps:
                rr = [r for r in A if r['c'] == c and r['n'] == n and r['kappa'] == k and r['p'] == p]
                if rr and rr[0]['A'] is not None:
                    v = rr[0]['A']; best = max(best, v)
                    cells.append('%6.2f%s' % (v, '*' if rr[0]['note'] else ' '))
                else:
                    cells.append('   -   ')
        L.append('%3d | ' % n + ' | '.join(cells) + ' | %6.2f | %.3f' % (best, best / n))
L.append('')
L.append('TEST A2 (shape optimised, symmetric clusters; lower bounds for A*(n, c))')
for r in sorted(A2, key=lambda r: (-r['c'], r['n'])):
    L.append('c = %g n = %d  A = %.3f  A/n = %.3f  positions %s  relative offsets %s' % (r['c'], r['n'], r['A'], r['A'] / r['n'], ' '.join('%.3f' % v for v in r['xs']), ' '.join('%.3f' % v for v in r['ws'])))
B = rows('*testB*.log') + rows('*fill*.log')
L.append('')
L.append('TEST B (zeta ordinates in the window, lattice outside; largest passing offset b; cap 0.4999)')
cells = sorted(set((r['T'], r['theta'], r['M']) for r in B))
for (T, th, M) in cells:
    Lg = math.log(T / 2 / math.pi); u = th * math.log(T); u1 = u - Lg
    L.append('T = %g theta = %g M = %g   u = %.3f Lg = %.3f theta\' = %.3f   c15 region c_theta/L = %.3f' % (T, th, M, u, Lg, u / Lg, math.log(20 / th) / th / math.log(T)))
    one = [r for r in B if (r['T'], r['theta'], r['M']) == (T, th, M) and r['mode'] == 'one' and 'where' in r]
    for wh in ('ordinate', 'midpoint', 'replace'):
        v = sorted(r['b'] for r in one if r['where'] == wh and r['b'] is not None)
        if v:
            L.append('  one pair, %-8s: n=%d min %.4f median %.4f max %.4f' % (wh, len(v), v[0], statistics.median(v), v[-1]))
    if u < Lg:
        a = root(lambda a: math.sinh(a) / a <= 1 + (Lg + 2 * M) / u, 1e-9, 50)
        L.append('  tight-lattice law sinh(A)/A = 1 + (Lg + 2M)/u: A = %.4f, b = %.4f' % (a, a / u))
    else:
        lo = math.sqrt(12 * M / u ** 3)
        d = 2 * math.pi / Lg
        mid = root(lambda b: (1 + math.sinh(math.pi * b / d) ** 2) * u1 * (math.sinh(u1 * b) / (u1 * b) - 1) <= 2 * M, 1e-9, 2)
        at = root(lambda b: (math.sinh(math.pi * b / d) ** 2) * u1 * (math.sinh(u1 * b) / (u1 * b) - 1) <= 2 * M, 1e-9, 2)
        own = root(lambda b: u * (math.sinh(u * b) / (u * b) - 1) <= 2 * M, 1e-9, 2)
        L.append('  proved bounds (lattice model): passes below %.4f (own negativity <= 2M); excluded above %.4f at a lattice midpoint, above %.4f at a lattice point' % (own, mid, at))
    modes = sorted(set(r['mode'] for r in B if r['mode'] != 'one'))
    ns = sorted(set(r['n'] for r in B if 'n' in r))
    L.append('  mode            | ' + ' | '.join('n=%-3d' % n for n in ns))
    for mo in modes:
        cs = []
        for n in ns:
            rr = sorted([r for r in B if (r['T'], r['theta'], r['M']) == (T, th, M) and r['mode'] == mo and r.get('n') == n], key=lambda r: r['b'] is None)
            cs.append(('%.3f%s' % (rr[0]['b'], '*' if rr[0]['note'] not in ('', 'cap') else ('c' if rr[0]['note'] == 'cap' else ' '))) if rr and rr[0]['b'] is not None else ('  -   ' if not rr else ('<1e-4 ' if any(r['note'] == 'lo:fail' for r in rr) else ' und  ')))
        L.append('  %-15s | ' % mo + ' | '.join(cs))
open(os.path.join(HERE, 'tables.txt'), 'w').write('\n'.join(L) + '\n')
print('\n'.join(L))
