import json, math, statistics, sys, os
from math import gamma
L2 = math.log(2)
def zeta(s): return sum(n ** -s for n in range(1, 200000)) + 200000 ** (1 - s) / (s - 1)
def load(tag, mode):
    f = 'out/gpu_%s_%s.json' % (tag, mode)
    return json.load(open(f)) if os.path.exists(f) else None
cross = json.load(open('out/cross.json'))['cells'] if os.path.exists('out/cross.json') else []
for tag, beta in (('b100', 1.0), ('b075', 0.75), ('b050', 0.5)):
    a = 1 / beta
    cpred = gamma(a + 1) * zeta(a + 2) * 2 ** (-a - 1)
    for mode in ('plus', 'rand'):
        d = load(tag, mode)
        if d is None: continue
        js = d['js']; done = d['done']; y = d['y']; H = d['heights']
        fin = [i for i in range(len(js)) if done[i]]
        print('=== beta %.2f mode %s: depths final j = %d..%d (k_done %.3e, %d s)' % (beta, mode, js[fin[0]], js[fin[-1]], d['k_done'], d['secs']))
        groups = {}
        for h, desc in enumerate(H): groups.setdefault(desc[0], []).append(h)
        # cross-check against Arb
        diffs = [abs(c['y'] - y[js.index(c['j'])][c['hi']]) for c in cross if c['beta'] == beta and c['mode'] == mode and c['j'] in js]
        if diffs: print('    Arb cross-check, %d cells: max |float64 - ball| = %.2e' % (len(diffs), max(diffs)))
        for g, idx in groups.items():
            print('  group', g, len(idx))
            for i in fin:
                j = js[i]
                if (js[fin[-1]] - j) % 2: continue
                v = [y[i][h] for h in idx]
                line = '    j=%2d  min %12.2f  med %12.2f  max %12.2f  sd %11.2f' % (j, min(v), statistics.median(v), max(v), statistics.pstdev(v))
                if mode == 'rand': line += '  predicted sd %11.2f' % math.sqrt(cpred * 2.0 ** (j * a))
                if i > 0 and done[i - 1]:
                    ne = [(y[i][h] - y[i - 1][h]) / (-L2) for h in idx]
                    line += '  n_eff: med %10.2f  min %10.2f max %10.2f' % (statistics.median(ne), min(ne), max(ne))
                print(line)
        if mode == 'plus':
            print('  rational-type heights t = 2 pi a / b^beta: y * delta^p at the three deepest final depths, p = 1 and p = 1/(2 beta)')
            for h in groups.get('rat', []):
                aa, bb = H[h][1], H[h][2]
                vals = [(js[i], y[i][h]) for i in fin[-3:]]
                print('    a/b = %d/%d  t = %.5f ' % (aa, bb, d['t'][h]), '  '.join('j=%d y=%.3f y*d=%.5f y*d^(1/2b)=%.5f' % (j, v, v * 2.0 ** -j, v * 2.0 ** (-j / (2 * beta))) for j, v in vals))
