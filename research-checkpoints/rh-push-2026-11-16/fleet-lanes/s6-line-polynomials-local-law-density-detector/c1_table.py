import json, glob, math, collections
rows = [json.loads(l) for f in sorted(glob.glob('out/c1_*.jsonl')) for l in open(f)]
by = collections.defaultdict(dict)
for r in rows:
    if r['T'] not in by[r['obj']] or r['full'] or not by[r['obj']][r['T']]['full']: by[r['obj']][r['T']] = r
Ts = sorted({r['T'] for r in rows})
for vi, V in enumerate(rows[0]['V']):
    if V not in (0.5, 1.0, 2.0): continue
    print('\nfraction of unit cells with max |D| >= %g   (R = fraction x T)' % V)
    print('obj'.ljust(12) + ''.join(('%.0e' % T).rjust(10) for T in Ts) + '   slope of log R in log T (1e4..1e9 | 1e9..top)')
    for o, d in by.items():
        line = o.ljust(12)
        for T in Ts: line += ('%.3g' % d[T]['frac'][vi]).rjust(10) if T in d else ' ' * 10
        def slope(lo, hi):
            pts = [(math.log(T), math.log(d[T]['frac'][vi] * T)) for T in Ts if T in d and lo <= T <= hi and d[T]['frac'][vi] > 0]
            if len(pts) < 2: return float('nan')
            n = len(pts); mx = sum(p[0] for p in pts) / n; my = sum(p[1] for p in pts) / n
            return sum((p[0] - mx) * (p[1] - my) for p in pts) / sum((p[0] - mx) ** 2 for p in pts)
        print(line + '   %.3f | %.3f' % (slope(1e4, 1e9), slope(1e9, 1e17)))
print('\nmean square: predicted sum |c|^2 n^-3/2 (measured/predicted), max |D|, max |inverse coefficient|')
for o, d in by.items():
    print(o.ljust(12) + ' '.join('%.0e: %.4g (%.4f) max %.3g inv %.3g;' % (T, d[T]['m2_pred'], d[T]['m2_meas'] / d[T]['m2_pred'], d[T]['max'], d[T]['inv_max']) for T in Ts if T in d))
