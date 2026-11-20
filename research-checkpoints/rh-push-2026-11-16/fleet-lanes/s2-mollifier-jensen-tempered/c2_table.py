"""Table of the exact zero-side results (c2_zero_side*.jsonl). Status: 'stable' = same N* at two cutoffs; 'above tail' = |pivot| exceeds the largest dropped weight;
otherwise the value is the N* of the truncated zero list (for PLANT a lower bound for the full list: dropped terms are positive semidefinite)."""
import json, glob, math, re
rows = []
for fn in glob.glob('c2_zero_side*.jsonl'):
    for l in open(fn):
        r = json.loads(l); r.setdefault('CUT', 14.0); rows.append(r)
def pv(r):
    m = re.match(r'\[(-?[0-9.]+e?[-+]?[0-9]*)', r.get('pivot', '') or '')
    try: return abs(float(m.group(1)))
    except Exception: return 0.0
key = lambda r: (r['case'], r['T'], r['delta'], round(r['Delta'] / r['d'], 2) if r['case'] in ('PLANT', 'DH') else r['Delta'], round(r['d'], 1))
groups = {}
for r in rows: groups.setdefault(key(r), []).append(r)
out = []
print('case | T | delta = beta - 1/2 | d | Delta | zeros per unit rho | K_d | cutoffs: N* | status | |pivot| at N* | N*/K_d | N*/(rho Delta)^2')
for k in sorted(groups):
    g = sorted(groups[k], key=lambda r: r['CUT']); r = g[-1]
    ns = [x.get('Nstar') for x in g]
    if r.get('Nstar') is None: st = r['status']
    elif len(g) > 1 and ns[-1] == ns[-2]: st = 'stable'
    elif pv(r) > math.exp(-r['CUT'] ** 2 / 2): st = 'above tail'
    elif r['Nstar'] >= r['zeros']: st = 'truncated (N* = number of zeros used)'
    else: st = 'truncated list'
    rho = math.log(r['T'] / (2 * math.pi)) / (2 * math.pi) * (1 if r['case'] != 'DH' else 1) if r['case'] != 'DH' else math.log(5 * max(r['T'], 10) / (2 * math.pi)) / (2 * math.pi)
    N = r.get('Nstar')
    line = '%s | %g | %s | %.3f | %.3f | %.3f | %d | %s | %s | %.1e | %s | %s' % (r['case'], r['T'], r['delta'], r['d'], r['Delta'], rho, r['K_d'], ', '.join('%g: %s' % (x['CUT'], x.get('Nstar')) for x in g), st, pv(r),
            ('%.2f' % (N / r['K_d'])) if N and r['K_d'] else '-', ('%.1f' % (N / (rho * r['Delta']) ** 2)) if N else '-')
    print(line); out.append(line)
open('c2_table.txt', 'w').write('\n'.join(out) + '\n')
