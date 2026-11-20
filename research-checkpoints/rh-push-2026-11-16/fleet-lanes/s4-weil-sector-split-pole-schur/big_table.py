"""table of the large runs (values below 1e-308 are read from the decimal strings). usage: python big_table.py part.json ..."""
import json, sys
def v(x):
    s = x.get('lam_str')
    if s is None: return '%.2e' % x['lam']
    m, e = s.split('e') if 'e' in s else (s, '0')
    return '%.2fe%s' % (float(m), e)
def sv(S):
    if S is None: return 'n/a'
    s = S[0][0]
    if 'e' in s:
        m, e = s.split('e'); return '%.2fe%s' % (float(m), e)
    return '%.2e' % float(s)
print('| N | 2a | lambda^2 | object | full even | full odd | pole-free even | pole-free odd | S even | S odd | negative eigenvalues (even, odd) |')
print('|---|---|---|---|---|---|---|---|---|---|---|')
import math
def nn(x): return str(x.get('neg0')) if x['how'].startswith('ldl') else 'float64'
rows = []
for f in sys.argv[1:]:
    r = json.load(open(f))
    if 'results' in r: rs = list(r['results'].values())
    else: rs = [r]
    for q in rs:
        for o, rec in q['objects'].items():
            e, od = rec['even'], rec['odd']
            rows.append((q['N'], q['twoa'], o, '| %d | %.4f | %.1f | %s | %s | %s | %s | %s | %s | %s | %s, %s |' % (q['N'], q['twoa'], math.exp(q['twoa']), o, v(e['full']), v(od['full']), v(e['pf']), v(od['pf']),
                  sv(e['schur'].get('S')), sv(od['schur'].get('S')), nn(e['full']), nn(od['full']))))
for r in sorted(rows, key=lambda r: (r[2] != 'ZETA', r[2], r[0], r[1])): print(r[3])
