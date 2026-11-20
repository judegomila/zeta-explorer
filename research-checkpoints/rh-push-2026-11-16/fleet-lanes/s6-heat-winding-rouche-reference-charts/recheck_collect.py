"""Collect recheck logs (complete or partial) into a markdown table."""
import glob, re, json, os
rows = []
for fn in sorted(glob.glob('recheck/rlog/*.log')):
    m = re.match(r'(\w+)_([0-9e.+-]+)_([0-9.-]+)b?\.log', os.path.basename(fn))
    if not m or fn.split('/')[-1].startswith('lowdh'): continue
    kind, X, t = m.group(1), float(m.group(2)), float(m.group(3))
    n = 0; fl = 0; md = 0.0; near = 0; summ = None
    for l in open(fn):
        mm = re.match(r'y ([0-9.]+) box (\d+) engine ([0-9.eE+-]+) true ([0-9.eE+-]+)', l)
        if mm:
            a, b = float(mm.group(3)), float(mm.group(4)); n += 1; fl += int((a < 1) != (b < 1)); md = max(md, abs(a - b))
        if l.startswith('SUMMARY'): summ = json.loads(l[8:])
    rows.append((kind, X, t, n, fl, md, summ))
rows.sort(key=lambda r: (r[0] != 'ZETA', r[0], r[1], r[2]))
print('| function | X | t | box-levels compared | flips | largest difference of max abs(f E - 1) | largest abs(f_engine - f_true) | largest relative error of E_1000 | status |')
print('|---|---|---|---|---|---|---|---|---|')
tot = 0
for kind, X, t, n, fl, md, s in rows:
    tot += n
    print('| %s | %g | %g | %d | %d | %.2g | %s | %s | %s |' % (kind, X, t, n, fl, md, ('%.2g' % s['max_abs_f_diff']) if s else '-', ('%.1e' % s['max_rel_E_diff']) if s else '-', 'complete' if s else 'stopped before the end'))
print('TOTAL', tot)
