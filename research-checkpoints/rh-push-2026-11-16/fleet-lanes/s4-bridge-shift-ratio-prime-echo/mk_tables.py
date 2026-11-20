"""markdown tables for RESULT.md from echo outputs. usage: mk_tables.py <echo.json> <objects csv> [checkpoints csv]"""
import sys, json, math, numpy as np
r = json.load(open(sys.argv[1])); X = r['X'][:15]
objs = sys.argv[2].split(',')
cks = [float(v) for v in sys.argv[3].split(',')] if len(sys.argv) > 3 else r['checkpoints']
Hs = list(r['heights'].keys())
def lab(i): return '0' if i == 0 else ('%g' % X[i - 1])
print('Cells: fraction of sampled t with D <= 0 at some grid x; in brackets the largest grid x with D <= 0 over the sample (x* is the next grid value). n = %d points per height.\n' % r['npts'])
for k in objs:
    print('**%s**\n' % k)
    print('| height \\ P | ' + ' | '.join('%g' % c for c in cks) + ' |'); print('|---|' + '---|' * len(cks))
    for H in Hs:
        row = []
        for c in cks:
            key = '%s|%g' % (k, c)
            if key not in r['heights'][H]['hist']: row.append('-'); continue
            h = np.array(r['heights'][H]['hist'][key], float)
            f = 1 - h[0] / h.sum(); im = int(np.nonzero(h)[0].max())
            row.append(('0' if f == 0 else ('%.4f' % f if f >= 0.001 else '%.1e' % f)) + (' [%s]' % lab(im) if im else ''))
        print('| %s | ' % H + ' | '.join(row) + ' |')
    print()
