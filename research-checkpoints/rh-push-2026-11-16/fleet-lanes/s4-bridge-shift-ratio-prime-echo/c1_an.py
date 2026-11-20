"""tables for combination (1) from echo.py / dh_train.py outputs.
usage: c1_an.py <echo.json> [objects csv]   -> prints, per object:variant, a table height x checkpoint of
   q50 / q99 / max of x* (grid values; 0 = positive on the whole grid; '>.5' = negative at the top of the grid), and the total-variation
   distance between the x* histogram of the object and that of ZETA (same variant family) at the same (height, P)."""
import sys, json, math, numpy as np
r = json.load(open(sys.argv[1])); X = r['X'][:15]
want = sys.argv[2].split(',') if len(sys.argv) > 2 else None
vals = [0.0] + list(X)        # histogram index i>0 -> highest negative grid x is X[i-1]; x* is the next grid value above it
def q(h, p):
    c = np.cumsum(h) / sum(h); i = int(np.searchsorted(c, p)); return i
def lab(i): return '0' if i == 0 else ('%.3g' % X[i - 1])
Hs = list(r['heights'].keys()); keys = sorted({k.split('|')[0] for k in r['heights'][Hs[0]]['hist']})
cks = r['checkpoints']
summ = {}
for k in keys:
    if want and k not in want: continue
    ref = ('ZETA:' + k.split(':')[1].split('+')[0] + '+pole') if ':' in k else None
    print('\n== %s  (cells: fraction of t with a negative grid value | median, 99%%, max of the highest negative grid x | TV distance to %s)' % (k, ref))
    print('height \\ P ' + ''.join('%26s' % ('%g' % c) for c in cks))
    for H in Hs:
        row = '%-10s' % H
        for c in cks:
            h = np.array(r['heights'][H]['hist']['%s|%g' % (k, c)], float)
            frac = 1 - h[0] / h.sum()
            tv = ''
            if ref and ('%s|%g' % (ref, c)) in r['heights'][H]['hist']:
                h0 = np.array(r['heights'][H]['hist']['%s|%g' % (ref, c)], float)
                tv = '%.3f' % (0.5 * np.abs(h / h.sum() - h0 / h0.sum()).sum())
            imax = int(np.nonzero(h)[0].max())
            row += '%26s' % ('%.4f|%s,%s,%s|%s' % (frac, lab(q(h, 0.5)), lab(q(h, 0.99)), lab(imax), tv))
            summ['%s|%s|%g' % (k, H, c)] = dict(frac=frac, q50=lab(q(h, 0.5)), q99=lab(q(h, 0.99)), max=lab(imax), tv=tv, n=int(h.sum()))
        print(row)
json.dump(summ, open(sys.argv[1].replace('.json', '_summary.json'), 'w'))
