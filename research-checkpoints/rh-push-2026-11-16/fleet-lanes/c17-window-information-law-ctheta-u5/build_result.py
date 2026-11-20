"""Assembles RESULT.md from header.md, RESULT_theory.md, tests.md (with generated tables) and tail.md. Text only."""
import json, glob, math, os, statistics
HERE = os.path.dirname(os.path.abspath(__file__))
B = []
for p in sorted(glob.glob(os.path.join(HERE, 'logs', '*testB*.log')) + glob.glob(os.path.join(HERE, 'logs', '*fill*.log')) + glob.glob(os.path.join(HERE, 'logs', '*hp*.log'))):
    for l in open(p):
        if l.startswith('{'):
            try: B.append(json.loads(l))
            except Exception: pass
NS = [1, 2, 4, 8, 12, 16, 24, 32, 40, 60]
def cell(T, th, M, mode, n):
    rr = [r for r in B if r['T'] == T and r['theta'] == th and r['M'] == M and r['mode'] == mode and r.get('n') == n]
    dec = [r for r in rr if r['b'] is not None]
    if dec:
        r = dec[0]
        return 'cap' if r['note'] == 'cap' else '%.3f' % r['b']
    if any(r['note'] == 'lo:fail' for r in rr):
        return '<1e-4'
    return 'und' if rr else '-'
def one(T, th, M, wh):
    seen, v = set(), []
    for r in B:
        if r['T'] == T and r['theta'] == th and r['M'] == M and r['mode'] == 'one' and r.get('where') == wh and r['b'] is not None and r['k'] not in seen:
            seen.add(r['k']); v.append(r['b'])
    v.sort()
    return v
def root(fn, lo, hi):
    for _ in range(200):
        m = (lo + hi) / 2
        if fn(m): lo = m
        else: hi = m
    return lo
t1 = ['| T | theta | M | theta\' | pair at an ordinate: min, median, max | pair at a midpoint: min, median, max | reference (lattice model) | c15 region c_theta/L |', '|---|---|---|---|---|---|---|---|']
for T in (1e6, 1e9, 1e12):
    for th, M in ((0.5, 0.0), (0.5, 1.0), (1.0, 1.0), (2.0, 1.0)):
        u = th * math.log(T); Lg = math.log(T / 2 / math.pi)
        a, m = one(T, th, M, 'ordinate'), one(T, th, M, 'midpoint')
        if not a or not m: continue
        if u < Lg:
            A = root(lambda x: math.sinh(x) / x <= 1 + (Lg + 2 * M) / u, 1e-9, 50)
            ref = 'exact law: %.4f' % (A / u)
        else:
            own = root(lambda b: u * (math.sinh(u * b) / (u * b) - 1) <= 2 * M, 1e-9, 2)
            ref = 'passes below %.4f' % own
        t1.append('| %g | %g | %g | %.3f | %.4f, %.4f, %.4f | %.4f, %.4f, %.4f | %s | %.3f |' % (T, th, M, u / Lg, a[0], statistics.median(a), a[-1], m[0], statistics.median(m), m[-1], ref, math.log(20 / th) / th / math.log(T)))
t2 = ['| T | theta | M | mode | ' + ' | '.join('n=%d' % n for n in NS) + ' |', '|---|---|---|---|' + '---|' * len(NS)]
names = [('add-flat', 'on ordinates, equal offsets, added'), ('add-taper', 'on ordinates, cos^2 offsets, added'), ('rep2-flat', 'count preserved, equal offsets'), ('rep2-taper', 'count preserved, cos^2 offsets'), ('row-taper-1.25', 'row, spacing 2 pi/(1.25 u), cos^2'), ('row-taper-2.0', 'row, spacing pi/u, cos^2')]
for T in (1e6, 1e9, 1e12):
    for th, M in ((0.5, 0.0), (0.5, 1.0), (1.0, 1.0), (2.0, 1.0)):
        for mo, nm in names:
            t2.append('| %g | %g | %g | %s | ' % (T, th, M, nm) + ' | '.join(cell(T, th, M, mo, n) for n in NS) + ' |')
und = sum(1 for l in t2 for c in l.split('|') if c.strip() == 'und')
tests = open(os.path.join(HERE, 'tests.md')).read().replace('@@TABLE_ONE@@', '\n'.join(t1)).replace('@@TABLE_CLUSTERS@@', '\n'.join(t2)).replace('@@UND@@', str(und))
out = open(os.path.join(HERE, 'header.md')).read() + '\n' + open(os.path.join(HERE, 'RESULT_theory.md')).read() + '\n' + tests + '\n' + open(os.path.join(HERE, 'tail.md')).read()
open(os.path.join(HERE, 'RESULT.md'), 'w').write(out)
print('written', len(out), 'characters; undecided cells in the cluster table:', und)
