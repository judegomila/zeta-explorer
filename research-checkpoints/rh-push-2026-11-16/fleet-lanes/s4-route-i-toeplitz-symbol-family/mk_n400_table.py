import json, glob, math, os, sys
def load(D):
    r = {}
    for f in glob.glob(os.path.join(D, 'sup_*.json')): r[round(float(f.split('sup_')[1][:-5]), 9)] = json.load(open(f))['obj']
    return r
R4 = load('out_n400'); R2 = load('out_merged_n200'); R1 = load('out_fine_n120'); RB = load('outB') if os.path.isdir('outB') else {}
def g(R, s, k, N):
    o = R.get(s)
    if not o: return None
    r = o.get('%s|%d' % (k, N))
    return None if r is None else min(float(r['even']), float(r['odd']))
objs = ['ZETA|pf', 'ZETA|full', 'ZETA-S2|pf', 'ZETA-S23|pf', 'CHI-3|pf', 'CHI5|pf', 'X5C|pf', 'DH|pf']
out = ['| 2a | ' + ' | '.join(o.replace('|', ' ') + ' (N = 400; ratio to smaller N)' for o in objs) + ' | smaller N |', '|---|' + '---|' * (len(objs) + 1)]
for s in sorted(R4):
    cells = []; small = None
    for o in objs:
        v = g(R4, s, o, 400); w = g(R2, s, o, 200); small = 200
        if w is None: w = g(R1, s, o, 120); small = 120
        cells.append('%+.4e (%.4f)' % (v, v / w) if w else '%+.4e' % v)
    out.append('| %.10f | ' % s + ' | '.join(cells) + ' | %d |' % small)
txt = '\n'.join(out) + '\n'
a, b = g(R4, 1.1314, 'ZETA-S2|pf', 400), g(R4, 1.1318, 'ZETA-S2|pf', 400)
x4 = 1.1314 + 0.0004 * a / (a - b)
a, b = g(R1, 1.1314, 'ZETA-S2|pf', 120), g(R1, 1.1318, 'ZETA-S2|pf', 120)
x1 = 1.1314 + 0.0004 * a / (a - b)
a, b = g(R1, 1.1314, 'ZETA-S2|pf', 60), g(R1, 1.1318, 'ZETA-S2|pf', 60)
x0 = 1.1314 + 0.0004 * a / (a - b)
txt += '\nOne-prime crossing interpolated inside the bracket (1.1314, 1.1318]: N = 60: %.5f, N = 120: %.5f, N = 400: %.5f.\n' % (x0, x1, x4)
if RB:
    mx = 0; n = 0; worst = None
    for s in RB:
        if s not in R4: continue
        for k in RB[s]:
            if k not in R4[s]: continue
            for f in ('even', 'odd', 'both'):
                if f in RB[s][k]:
                    x = float(RB[s][k][f]); y = float(R4[s][k][f]); d = abs(x - y) / max(abs(y), 1e-300); n += 1
                    if d > mx: mx = d; worst = (s, k, f, x, y)
    txt += '\nServer unit (N = 400, %d supports) against the local N = 400 run: %d eigenvalues compared, max relative difference %.2e (%s).\n' % (len(RB), n, mx, worst)
open('tables_n400.md', 'w').write(txt); print(txt)
